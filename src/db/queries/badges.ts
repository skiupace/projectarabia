import { db } from "@/schemas/db";
import { userBadges, type UserBadge } from "@/schemas/db/schema";
import { eq, and } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import type { BadgeId } from "@/enum/badges";
import type { BadgeAwardResult } from "@/types/badges";

/**
 * Get all badges for a user (returns empty array if user has no badges)
 */
export async function getUserBadges(userId: string): Promise<UserBadge[]> {
  const result = await db
    .select()
    .from(userBadges)
    .where(eq(userBadges.userId, userId))
    .all();

  return result ?? [];
}

/**
 * Check if a user has a specific badge
 */
export async function userHasBadge(
  userId: string,
  badgeId: BadgeId,
): Promise<boolean> {
  const result = await db
    .select()
    .from(userBadges)
    .where(and(eq(userBadges.userId, userId), eq(userBadges.badgeId, badgeId)))
    .get();
  return result !== undefined;
}

/**
 * Add a badge to a user (upsert style - no error if already exists)
 */
export async function addBadgeToUser(
  userId: string,
  badgeId: BadgeId,
): Promise<BadgeAwardResult> {
  const id = createId();
  await db
    .insert(userBadges)
    .values({
      id,
      userId,
      badgeId,
    })
    .onConflictDoNothing()
    .run();

  return { success: true };
}

/**
 * Remove a badge from a user (upsert style - no error if badge doesn't exist)
 */
export async function removeBadgeFromUser(
  userId: string,
  badgeId: BadgeId,
): Promise<BadgeAwardResult> {
  await db
    .delete(userBadges)
    .where(and(eq(userBadges.userId, userId), eq(userBadges.badgeId, badgeId)))
    .run();

  return { success: true };
}
