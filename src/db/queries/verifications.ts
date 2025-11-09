import { db } from "@/schemas/db";
import { verifications } from "@/schemas/db/schema";
import type { Verification } from "@/schemas/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

// Upsert a verification: create new or update existing by userId
export async function upsertVerification(
  userId: string,
  token: string,
): Promise<Verification> {
  // Check if a verification exists for this user
  const existing = await db
    .select()
    .from(verifications)
    .where(eq(verifications.userId, userId))
    .get();

  if (existing) {
    // Update existing verification with new token and timestamp
    await db
      .update(verifications)
      .set({
        token,
        createdAt: new Date().toISOString(),
      })
      .where(eq(verifications.userId, userId))
      .run();

    // Return updated verification
    return (await db
      .select()
      .from(verifications)
      .where(eq(verifications.userId, userId))
      .get()) as Verification;
  }

  // Create new verification
  const id = nanoid();
  await db.insert(verifications).values({ id, userId, token }).run();

  // Return the created verification
  return (await db
    .select()
    .from(verifications)
    .where(eq(verifications.id, id))
    .get()) as Verification;
}

// Find a verification by its token
export async function findVerificationByToken(
  token: string,
): Promise<Verification | undefined> {
  const row = await db
    .select()
    .from(verifications)
    .where(eq(verifications.token, token))
    .get();
  return row as Verification | undefined;
}

// Delete a verification by userId
export async function deleteVerificationByUserId(
  userId: string,
): Promise<void> {
  await db.delete(verifications).where(eq(verifications.userId, userId)).run();
}
