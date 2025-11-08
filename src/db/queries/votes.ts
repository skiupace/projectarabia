import { db } from "@/schemas/db";
import { votes } from "@/schemas/db/schema";
import { eq, desc, and, type SQL } from "drizzle-orm";

export interface VoteData {
  postId?: string;
  commentId?: string;
  userId: string;
  value: number; // 1 for upvote
}

export async function createVote(data: VoteData) {
  // Validation: Must have either postId or commentId, not both, not neither.
  if (!!data.postId === !!data.commentId) {
    throw new Error("Must provide either postId or commentId for a vote.");
  }
  return await db.insert(votes).values(data).returning().get();
}

export async function deleteVote(data: VoteData) {
  const hasPostId = typeof data.postId === "string" && data.postId.length > 0;
  const hasCommentId =
    typeof data.commentId === "string" && data.commentId.length > 0;

  if ((hasPostId && hasCommentId) || (!hasPostId && !hasCommentId)) {
    throw new Error("Must provide either postId or commentId for a vote.");
  }

  let condition: SQL | undefined;
  if (hasPostId && data.postId) {
    condition = and(
      eq(votes.postId, data.postId),
      eq(votes.userId, data.userId),
    );
  } else if (hasCommentId && data.commentId) {
    condition = and(
      eq(votes.commentId, data.commentId),
      eq(votes.userId, data.userId),
    );
  } else {
    throw new Error("Invalid data for vote deletion.");
  }

  return await db.delete(votes).where(condition).returning().get();
}

export async function findVoteById(id: string) {
  return await db.select().from(votes).where(eq(votes.id, id)).get();
}

export async function findVotesByPostId(postId: string) {
  return await db
    .select()
    .from(votes)
    .where(eq(votes.postId, postId))
    .orderBy(desc(votes.createdAt))
    .all();
}

export async function findVotesByCommentId(commentId: string) {
  return await db
    .select()
    .from(votes)
    .where(eq(votes.commentId, commentId))
    .orderBy(desc(votes.createdAt))
    .all();
}

export async function findVotesByUserId(userId: string) {
  return await db
    .select()
    .from(votes)
    .where(eq(votes.userId, userId))
    .orderBy(desc(votes.createdAt))
    .all();
}

export async function findVoteByPostIdAndUserId(
  postId: string,
  userId: string,
) {
  return await db
    .select()
    .from(votes)
    .where(and(eq(votes.postId, postId), eq(votes.userId, userId)))
    .orderBy(desc(votes.createdAt))
    .get();
}

export async function findVoteByCommentIdAndUserId(
  commentId: string,
  userId: string,
) {
  return await db
    .select()
    .from(votes)
    .where(and(eq(votes.commentId, commentId), eq(votes.userId, userId)))
    .orderBy(desc(votes.createdAt))
    .get();
}
