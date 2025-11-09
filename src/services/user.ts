import { findUserById, findUserByUsername } from "@/db/queries/users";
import {
  getUserStatus,
  unverifyUser,
  promoteToModerator,
  demoteToUser as depromoteUserDb,
  createUserStatus,
} from "@/db/queries/users_status";

import { validateUsername, validateEmail, validateAbout } from "./validation";
import type { SafeUser, User, UserStatus } from "@/schemas/db/schema";
import type { UserProfileSubmission } from "@/schemas/forms/user-profile";
import { useAppSession } from "@/actions/-sessions/useSession";

import { updateUserProfile as updateUserProfileDb } from "@/db/queries/users";
import { sendEmail } from "@/lib/email";
import { upsertVerification } from "./verifications";
import { validateTurnstile } from "./cloudflare";
import { revokeBadge } from "./badges";
import { BadgeId } from "@/enum/badges";
import type { SafeUserWithStatus } from "@/types/users";

async function getUserByUsername(username: string): Promise<User | null> {
  // Validate username
  const usernameValidation = validateUsername(username);
  if (!usernameValidation.valid) {
    return null;
  }

  const user = await findUserByUsername(username);
  return user ?? null;
}

async function getSafeUserById(id: string): Promise<SafeUser | null> {
  const user = await findUserById(id);
  if (!user) {
    return null;
  }
  // biome-ignore lint/correctness/noUnusedVariables: _id is used to avoid type errors
  const { password, updatedAt, id: _id, ...safeUser } = user;
  return safeUser;
}

export async function getSafeUserByIdWithStatus(
  id: string,
): Promise<(SafeUser & UserStatus) | null> {
  const user = await findUserById(id);
  if (!user) {
    return null;
  }

  let status = await getUserStatus(user.id);

  // If status doesn't exist, create it with default values
  if (!status) {
    await createUserStatus(user.id, { role: "user" });
    status = await getUserStatus(user.id);

    // If still not found after creation, return null
    if (!status) {
      return null;
    }
  }

  // biome-ignore lint/correctness/noUnusedVariables: _id is used to avoid type errors
  const { password, updatedAt, id: _id, ...safeUser } = user;
  return { ...safeUser, ...status };
}

export async function getSafeUserByUsernameWithStatus(
  username: string,
): Promise<SafeUserWithStatus | null> {
  const user = await getUserByUsername(username);
  if (!user) {
    return null;
  }

  let status = await getUserStatus(user.id);

  // If status doesn't exist, create it with default values.
  // We will exclude status.createdAt and status.updatedAt below, so they don't overwrite the user's fields.
  if (!status) {
    await createUserStatus(user.id, { role: "user" });
    status = await getUserStatus(user.id);

    // If still not found after creation, return null
    if (!status) {
      return null;
    }
  }

  // Omit password, updatedAt, and id from user to construct safeUser.
  // Also omit createdAt and updatedAt from status to prevent accidental collision with user fields.
  // Note: This ensures status's createdAt/updatedAt don't overwrite the user's actual times.
  // biome-ignore lint/correctness/noUnusedVariables: omit password, updatedAt, and id from user to construct safeUser.
  const { password, updatedAt, id: _id, ...safeUser } = user;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {
    createdAt: _statusCreatedAt,
    updatedAt: _statusUpdatedAt,
    ...safeStatus
  } = status;

  return { ...safeUser, ...safeStatus };
}

export async function updateUserProfile(updatePayload: UserProfileSubmission) {
  const session = await useAppSession();
  if (!session.data?.userId) {
    return {
      success: false,
      error: "يجب تسجيل الدخول لتحديث الملف الشخصي",
      errorCode: "NOT_AUTHENTICATED",
    };
  }

  // Validate Turnstile token
  const turnstileResult = await validateTurnstile(updatePayload.cf_turnstile);
  if (!turnstileResult.success) {
    return {
      success: false,
      error: "فشل التحقق من أنك لست روبوت. يرجى المحاولة مرة أخرى.",
      errorCode: "TURNSTILE_FAILED",
    };
  }

  // Validate about field
  const aboutValidation = validateAbout(updatePayload.about);
  if (!aboutValidation.valid) {
    return {
      success: false,
      error: aboutValidation.error ?? "خطأ في حقل 'عن'",
      errorCode: aboutValidation.errorCode ?? "INVALID_ABOUT",
    };
  }

  // Validate email field
  const emailValidation = validateEmail(updatePayload.email);
  if (!emailValidation.valid) {
    return {
      success: false,
      error: emailValidation.error ?? "خطأ في البريد الإلكتروني",
      errorCode: emailValidation.errorCode ?? "INVALID_EMAIL",
    };
  }

  const user = await getSafeUserById(session.data.userId);
  if (!user) {
    return {
      success: false,
      error: "لم يتم العثور على المستخدم",
      errorCode: "USER_NOT_FOUND_ERROR",
    };
  }

  // Check if email changed
  const emailChanged = user.email !== updatePayload.email;

  // Update the user profile
  await updateUserProfileDb(session.data.userId, updatePayload);

  // If email changed, reset verified status and send verification email
  if (emailChanged) {
    // Reset verified status
    await unverifyUser(session.data.userId);

    // Remove email verified badge
    await revokeBadge(session.data.userId, BadgeId.EMAIL_VERIFIED);

    // Ensure user.email is a string before sending
    if (updatePayload.email && updatePayload.email.length > 0) {
      // Generate and save verification token
      const token = await upsertVerification(session.data.userId);

      await sendEmail(
        "verify",
        {
          to: updatePayload.email,
          link: `${process.env.VITE_DOMAIN}/verify/${token}`,
        },
        process.env.RESEND_API_KEY,
      );
    }
  }

  return {
    success: true,
  };
}

export async function promoteUserToModerator(username: string) {
  // Validate username
  const usernameValidation = validateUsername(username);
  if (!usernameValidation.valid) {
    return {
      success: false,
      error: usernameValidation.error ?? "اسم المستخدم غير صالح",
      errorCode: usernameValidation.errorCode ?? "INVALID_USERNAME",
    };
  }

  // Find user by username
  const user = await getUserByUsername(username);
  if (!user) {
    return {
      success: false,
      error: "المستخدم غير موجود",
      errorCode: "USER_NOT_FOUND",
    };
  }

  // Get or create user status
  let status = await getUserStatus(user.id);
  if (!status) {
    // Create user status if it doesn't exist
    await createUserStatus(user.id, { role: "user" });
    status = await getUserStatus(user.id);

    // If still not found after creation, return error
    if (!status) {
      return {
        success: false,
        error: "فشل إنشاء حالة المستخدم",
        errorCode: "USER_STATUS_CREATION_FAILED",
      };
    }
  }

  if (status.role === "moderator") {
    return {
      success: false,
      error: "المستخدم بالفعل مشرف",
      errorCode: "ALREADY_MODERATOR",
    };
  }

  // Promote user to moderator
  await promoteToModerator(user.id);

  return {
    success: true,
    userId: user.id,
    username: user.username,
  };
}

export async function depromoteUser(username: string) {
  // Validate username
  const usernameValidation = validateUsername(username);
  if (!usernameValidation.valid) {
    return {
      success: false,
      error: usernameValidation.error ?? "اسم المستخدم غير صالح",
      errorCode: usernameValidation.errorCode ?? "INVALID_USERNAME",
    };
  }

  // Find user by username
  const user = await getUserByUsername(username);
  if (!user) {
    return {
      success: false,
      error: "المستخدم غير موجود",
      errorCode: "USER_NOT_FOUND",
    };
  }

  // Get or create user status
  const status = await getUserStatus(user.id);
  if (!status) {
    return {
      success: false,
      error: "فشل إنشاء حالة المستخدم",
      errorCode: "USER_STATUS_CREATION_FAILED",
    };
  }

  if (status.role !== "moderator") {
    return {
      success: false,
      error: "المستخدم ليس مشرف",
      errorCode: "NOT_MODERATOR",
    };
  }

  // Depromote user
  await depromoteUserDb(user.id);

  return {
    success: true,
    userId: user.id,
    username: user.username,
  };
}
