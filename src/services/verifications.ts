import { customAlphabet } from "nanoid";
import {
  deleteVerificationByUserId,
  findVerificationByToken,
  upsertVerification as upsertVerificationDb,
} from "@/db/queries/verifications";
import { verifyUser } from "@/db/queries/users_status";
import { awardBadge } from "./badges";
import { BadgeId } from "@/enum/badges";

// Configure nanoid with custom alphabet (64-char token)
const nanoid = customAlphabet("0123456789_abcdefghijklmnopqrstuvwxyz", 64);

/**
 * Create or update a verification token for a user
 * @param userId - The user ID to create/update verification for
 * @returns The generated verification token
 */
export async function upsertVerification(userId: string): Promise<string> {
  const token = nanoid();
  await upsertVerificationDb(userId, token);
  return token;
}

/**
 * Verify a token and invalidate it after successful verification
 * @param token - The verification token to verify
 * @returns Object with validation result and optional userId or error
 */
export async function verifyToken(
  token: string,
): Promise<{ valid: boolean; userId?: string; error?: string }> {
  try {
    const verification = await findVerificationByToken(token);

    if (!verification) {
      return {
        valid: false,
        error: "رمز التحقق غير صالح",
      };
    }

    // Set user as verified
    await verifyUser(verification.userId);

    // Token is valid, delete it to prevent reuse
    await deleteVerificationByUserId(verification.userId);

    // Award email verified badge
    await awardBadge(verification.userId, BadgeId.EMAIL_VERIFIED);

    return {
      valid: true,
      userId: verification.userId,
    };
  } catch (_error) {
    return {
      valid: false,
      error: "حدث خطأ أثناء التحقق من الرمز",
    };
  }
}
