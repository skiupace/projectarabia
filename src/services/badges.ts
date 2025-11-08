import {
  getUserBadges as getUserBadgesDb,
  addBadgeToUser as addBadgeToUserDb,
  removeBadgeFromUser as removeBadgeFromUserDb,
} from "@/db/queries/badges";
import { type BadgeId, BADGE_METADATA } from "@/enum/badges";
import type { UserBadgeWithMetadata, BadgeAwardResult } from "@/types";

/**
 * Get all badges for a user with metadata
 */
export async function getUserBadges(
  userId: string,
): Promise<UserBadgeWithMetadata[]> {
  const userBadges = await getUserBadgesDb(userId);
  return userBadges.map((ub) => ({
    ...ub,
    badgeId: ub.badgeId as BadgeId,
    metadata: BADGE_METADATA[ub.badgeId as BadgeId],
  }));
}

/**
 * Award a badge to a user
 */
export async function awardBadge(
  userId: string,
  badgeId: BadgeId,
): Promise<BadgeAwardResult> {
  return await addBadgeToUserDb(userId, badgeId);
}

/**
 * Revoke a badge from a user
 */
export async function revokeBadge(
  userId: string,
  badgeId: BadgeId,
): Promise<BadgeAwardResult> {
  return await removeBadgeFromUserDb(userId, badgeId);
}
