import { db } from "@/schemas/db";
import { votes } from "@/schemas/db/schema";
import { eq, desc, and, type SQL } from "drizzle-orm";
import { logger } from "@/lib/logger";

export interface VoteData {
  postId?: string;
  commentId?: string;
  userId: string;
  value: number; // 1 for upvote
}

export async function createVote(data: VoteData) {
  try {
    // Validation: Must have either postId or commentId, not both, not neither.
    if (!!data.postId === !!data.commentId) {
      logger.error("queries/votes:createVote:invalid", { userId: data.userId });
      throw new Error("Must provide either postId or commentId for a vote.");
    }
    logger.info("queries/votes:createVote", { 
      userId: data.userId, 
      postId: data.postId,
      commentId: data.commentId
    });
    const result = await db.insert(votes).values(data).returning().get();
    logger.info("queries/votes:createVote:success", { voteId: result.id, userId: data.userId });
    return result;
  } catch (error) {
    logger.error("queries/votes:createVote", { 
      userId: data.userId,
      error: error instanceof Error ? error.message : String(error) 
    });
    throw error;
  }
}

export async function deleteVote(data: VoteData) {
  try {
    const hasPostId = typeof data.postId === "string" && data.postId.length > 0;
    const hasCommentId =
      typeof data.commentId === "string" && data.commentId.length > 0;

    if ((hasPostId && hasCommentId) || (!hasPostId && !hasCommentId)) {
      logger.error("queries/votes:deleteVote:invalid", { userId: data.userId });
      throw new Error("Must provide either postId or commentId for a vote.");
    }

    logger.info("queries/votes:deleteVote", { 
      userId: data.userId, 
      postId: data.postId,
      commentId: data.commentId
    });

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
      logger.error("queries/votes:deleteVote:invalidData", { userId: data.userId });
      throw new Error("Invalid data for vote deletion.");
    }

    const result = await db.delete(votes).where(condition).returning().get();
    logger.info("queries/votes:deleteVote:success", { userId: data.userId });
    return result;
  } catch (error) {
    logger.error("queries/votes:deleteVote", { 
      userId: data.userId,
      error: error instanceof Error ? error.message : String(error) 
    });
    throw error;
  }
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
