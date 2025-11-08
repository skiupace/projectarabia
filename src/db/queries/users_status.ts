import { eq } from "drizzle-orm";
import { db } from "@/schemas/db";
import { userStatus, type UserStatus } from "@/schemas/db/schema";

// === Basic CRUD ===

export async function getUserStatus(userId: string) {
  return await db
    .select()
    .from(userStatus)
    .where(eq(userStatus.userId, userId))
    .get();
}

export async function createUserStatus(
  userId: string,
  status: Partial<UserStatus>,
) {
  return await db
    .insert(userStatus)
    .values({ userId, ...status })
    .run();
}

export async function updateUserStatus(
  userId: string,
  status: Partial<UserStatus>,
) {
  const now = new Date().toISOString();
  return await db
    .update(userStatus)
    .set({ ...status, updatedAt: now })
    .where(eq(userStatus.userId, userId))
    .run();
}

// === Moderation Status Checks ===

export async function isUserBanned(userId: string): Promise<boolean> {
  const status = await getUserStatus(userId);
  if (!status?.bannedUntil) return false;
  return new Date(status.bannedUntil) > new Date();
}

export async function isUserMuted(userId: string): Promise<boolean> {
  const status = await getUserStatus(userId);
  if (!status?.mutedUntil) return false;
  return new Date(status.mutedUntil) > new Date();
}

export async function getUserModerationStatus(userId: string) {
  const status = await getUserStatus(userId);
  if (!status) return { isBanned: false, isMuted: false };

  const now = new Date();
  const isBanned = status.bannedUntil
    ? new Date(status.bannedUntil) > now
    : false;
  const isMuted = status.mutedUntil ? new Date(status.mutedUntil) > now : false;

  return {
    isBanned,
    isMuted,
    banReason: isBanned ? status.banReason : null,
    muteReason: isMuted ? status.muteReason : null,
    bannedUntil: isBanned ? status.bannedUntil : null,
    mutedUntil: isMuted ? status.mutedUntil : null,
  };
}

// === Ban Operations ===

export async function banUser(
  userId: string,
  untilDate: Date | string,
  reason: string,
) {
  const bannedUntil =
    typeof untilDate === "string" ? untilDate : untilDate.toISOString();
  return await updateUserStatus(userId, {
    bannedUntil,
    banReason: reason,
  });
}

export async function unbanUser(userId: string) {
  return await updateUserStatus(userId, {
    bannedUntil: null,
    banReason: null,
  });
}

export async function permanentBanUser(userId: string, reason: string) {
  // Set ban to 100 years from now (effectively permanent)
  const farFuture = new Date();
  farFuture.setFullYear(farFuture.getFullYear() + 100);
  return await banUser(userId, farFuture, reason);
}

// === Mute Operations ===

export async function muteUser(
  userId: string,
  untilDate: Date | string,
  reason: string,
) {
  const mutedUntil =
    typeof untilDate === "string" ? untilDate : untilDate.toISOString();
  return await updateUserStatus(userId, {
    mutedUntil,
    muteReason: reason,
  });
}

export async function unmuteUser(userId: string) {
  return await updateUserStatus(userId, {
    mutedUntil: null,
    muteReason: null,
  });
}

// === Karma Operations ===

export async function updateUserKarma(userId: string, karma: number) {
  return await updateUserStatus(userId, {
    karma,
    karmaLastUpdated: new Date().toISOString(),
  });
}

export async function incrementUserKarma(userId: string, delta: number) {
  const status = await getUserStatus(userId);
  if (!status) throw new Error("User status not found");

  const newKarma = status.karma + delta;
  return await updateUserKarma(userId, newKarma);
}

export async function decrementUserKarma(userId: string, delta: number) {
  return await incrementUserKarma(userId, -delta);
}

// === Verification Operations ===

export async function verifyUser(userId: string) {
  return await updateUserStatus(userId, { verified: true });
}

export async function unverifyUser(userId: string) {
  return await updateUserStatus(userId, { verified: false });
}

// === Role Operations ===

export async function setUserRole(userId: string, role: "user" | "moderator") {
  return await updateUserStatus(userId, { role });
}

export async function promoteToModerator(userId: string) {
  return await setUserRole(userId, "moderator");
}

export async function demoteToUser(userId: string) {
  return await setUserRole(userId, "user");
}

// === Query Operations ===

export async function getTopKarmaUsers(limit = 10) {
  return await db
    .select()
    .from(userStatus)
    .orderBy(userStatus.karma)
    .limit(limit)
    .all();
}
