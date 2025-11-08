import bcrypt from "bcryptjs";
import type { LoginSubmission, RegisterSubmission } from "@/schemas/auth/login";
import {
  findUserByUsername,
  findUserByEmail,
  createUser,
} from "@/db/queries/users";
import {
  getUserStatus,
  createUserStatus,
  updateUserStatus,
} from "@/db/queries/users_status";
import { validateTurnstile } from "./cloudflare";
import {
  validateUsername,
  validateEmail,
  validatePassword,
} from "./validation";
import { timeUntil } from "@/lib/time";

// Password hashing with bcrypt
async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10; // Cost factor - higher = more secure but slower
  return await bcrypt.hash(password, saltRounds);
}

// Password verification with bcrypt
async function verifyPassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

// Register new user
export async function registerUser(
  data: RegisterSubmission,
): Promise<
  | { success: true; userId: string; email: string | null }
  | { success: false; error: string; errorCode: string }
> {
  // Validate Turnstile token
  const turnstileResult = await validateTurnstile(data.cf_turnstile);
  if (!turnstileResult.success) {
    return {
      success: false,
      error: "فشل التحقق من أنك لست روبوت. يرجى المحاولة مرة أخرى.",
      errorCode: "TURNSTILE_FAILED",
    };
  }

  // Validate username format
  const usernameValidation = validateUsername(data.username);
  if (!usernameValidation.valid) {
    return {
      success: false,
      error: usernameValidation.error ?? "خطأ غير معروف",
      errorCode: usernameValidation.errorCode ?? "UNKNOWN_ERROR",
    };
  }

  // Validate email format (if provided)
  const emailValidation = validateEmail(data.email);
  if (!emailValidation.valid) {
    return {
      success: false,
      error: emailValidation.error ?? "خطأ غير معروف",
      errorCode: emailValidation.errorCode ?? "UNKNOWN_ERROR",
    };
  }

  // Validate password strength
  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.valid) {
    return {
      success: false,
      error: passwordValidation.error ?? "خطأ غير معروف",
      errorCode: passwordValidation.errorCode ?? "UNKNOWN_ERROR",
    };
  }

  // Check if username already exists
  const existingUserByUsername = await findUserByUsername(data.username);
  if (existingUserByUsername) {
    return {
      success: false,
      error: "اسم المستخدم مستخدم بالفعل",
      errorCode: "USERNAME_EXISTS",
    };
  }

  // Check if email already exists (only if email is provided)
  if (data.email && data.email.trim() !== "") {
    const existingUserByEmail = await findUserByEmail(data.email);
    if (existingUserByEmail) {
      return {
        success: false,
        error: "البريد الإلكتروني مستخدم بالفعل",
        errorCode: "EMAIL_EXISTS",
      };
    }
  }

  // Hash password
  const hashedPassword = await hashPassword(data.password);

  // Create user
  const newUser = await createUser({
    username: data.username,
    email: data.email && data.email.trim() !== "" ? data.email : null,
    password: hashedPassword,
  });

  // Create user status with default values
  await createUserStatus(newUser.id, {
    verified: false,
    role: "user",
  });

  return {
    success: true,
    userId: newUser.id,
    email: newUser.email,
  };
}

// Login existing user
export async function loginUser(
  data: LoginSubmission,
): Promise<
  | { success: true; userId: string; email: string | null; moderator: boolean }
  | { success: false; error: string; errorCode: string }
> {
  // Validate Turnstile token
  const turnstileResult = await validateTurnstile(data.cf_turnstile);
  if (!turnstileResult.success) {
    return {
      success: false,
      error: "فشل التحقق من أنك لست روبوت. يرجى المحاولة مرة أخرى.",
      errorCode: "TURNSTILE_FAILED",
    };
  }

  // Validate username format
  const usernameValidation = validateUsername(data.username);
  if (!usernameValidation.valid) {
    return {
      success: false,
      error: usernameValidation.error ?? "خطأ غير معروف",
      errorCode: usernameValidation.errorCode ?? "UNKNOWN_ERROR",
    };
  }

  // Validate password is not empty
  if (!data.password || data.password.trim() === "") {
    return {
      success: false,
      error: "كلمة المرور مطلوبة",
      errorCode: "PASSWORD_REQUIRED",
    };
  }

  // Find user by username
  const user = await findUserByUsername(data.username);
  if (!user) {
    return {
      success: false,
      error: "اسم المستخدم أو كلمة المرور غير صحيحة",
      errorCode: "INVALID_CREDENTIALS",
    };
  }

  // Verify password
  const isPasswordValid = await verifyPassword(data.password, user.password);
  if (!isPasswordValid) {
    return {
      success: false,
      error: "اسم المستخدم أو كلمة المرور غير صحيحة",
      errorCode: "INVALID_CREDENTIALS",
    };
  }

  // Check user status
  let status = await getUserStatus(user.id);

  // Create user status if it doesn't exist (for old users or edge cases)
  if (!status) {
    await createUserStatus(user.id, {
      verified: false,
      role: "user",
    });
    status = await getUserStatus(user.id);
  }

  if (status?.bannedUntil) {
    // Check if ban has expired
    const bannedUntilDate = new Date(status.bannedUntil);
    const now = new Date();
    if (now < bannedUntilDate) {
      return {
        success: false,
        error: `حسابك محظور، ينتهي الحظر ${timeUntil(status.bannedUntil)}`,
        errorCode: "USER_BANNED",
      };
    }
    // Ban expired, update status
    await updateUserStatus(user.id, {
      bannedUntil: null,
    });
  }

  return {
    success: true,
    userId: user.id,
    email: user.email,
    moderator: status?.role === "moderator" || false,
  };
}
