import { db } from "@/schemas/db";
import { posts, users, comments, userStatus } from "@/schemas/db/schema";
import { eq } from "drizzle-orm";
import { env } from "cloudflare:workers";
import { logger } from "@/lib/logger";

// Queue message types
export interface QueueNotificationMessage {
  type: "notification";
  notificationType: "post_comment" | "comment_reply";
  targetId: string; // postId for post_comment, commentId for comment_reply
  recipientId: string; // userId who should receive the notification
  commenterUserId: string;
  commenterUsername: string;
  commentText: string;
  postId: string;
  postTitle: string;
}

/**
 * Queue a notification message to the MAILER queue
 */
export async function queueNotificationMessage(
  message: QueueNotificationMessage,
): Promise<void> {
  logger.info("queueNotificationMessage", {
    tag: "queueNotificationMessage",
    notificationType: message.notificationType,
    recipientId: message.recipientId,
    targetId: message.targetId,
  });
  await env.MAILER.send(message);
}

/**
 * Batch notifications by recipient and target (post or comment)
 */
export function batchNotificationMessages(
  messages: QueueNotificationMessage[],
): Map<string, QueueNotificationMessage[]> {
  const batched = new Map<string, QueueNotificationMessage[]>();

  for (const message of messages) {
    // Key format: recipientId:targetId
    const key = `${message.recipientId}:${message.targetId}`;
    const existing = batched.get(key) || [];
    existing.push(message);
    batched.set(key, existing);
  }

  return batched;
}

/**
 * Select random highlights from comments
 */
export function selectRandomHighlights(
  comments: string[],
  count: number = 3,
): string[] {
  if (comments.length <= count) {
    return comments;
  }

  const shuffled = [...comments].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((text) => {
    // Truncate long comments to 150 chars
    return text.length > 150 ? `${text.substring(0, 150)}...` : text;
  });
}

/**
 * Fetch post owner's email by postId (only if user has verified email)
 */
export async function getPostOwnerEmail(
  postId: string,
): Promise<{ userId: string; email: string; title: string } | null> {
  logger.debug("getPostOwnerEmail", { tag: "getPostOwnerEmail", postId });
  const result = await db
    .select({
      userId: posts.userId,
      email: users.email,
      title: posts.title,
      verified: userStatus.verified,
    })
    .from(posts)
    .leftJoin(users, eq(posts.userId, users.id))
    .leftJoin(userStatus, eq(posts.userId, userStatus.userId))
    .where(eq(posts.id, postId))
    .get();

  // Only return if user has email AND is verified AND title exists
  if (!result || !result.email || !result.verified || result.title === null) {
    logger.debug("getPostOwnerEmail", {
      tag: "getPostOwnerEmail",
      postId,
      found: false,
    });
    return null;
  }

  logger.debug("getPostOwnerEmail", {
    tag: "getPostOwnerEmail",
    postId,
    found: true,
    userId: result.userId,
  });
  return {
    userId: result.userId,
    email: result.email,
    title: result.title,
  };
}

/**
 * Fetch comment owner's email by commentId (only if user has verified email)
 */
export async function getCommentOwnerEmail(commentId: string): Promise<{
  userId: string;
  email: string;
  postId: string;
  postTitle: string;
} | null> {
  logger.debug("getCommentOwnerEmail", {
    tag: "getCommentOwnerEmail",
    commentId,
  });
  const result = await db
    .select({
      userId: comments.userId,
      email: users.email,
      postId: comments.postId,
      postTitle: posts.title,
      verified: userStatus.verified,
    })
    .from(comments)
    .leftJoin(users, eq(comments.userId, users.id))
    .leftJoin(posts, eq(comments.postId, posts.id))
    .leftJoin(userStatus, eq(comments.userId, userStatus.userId))
    .where(eq(comments.id, commentId))
    .get();

  // Only return if user has email AND is verified AND postTitle exists
  if (
    !result ||
    !result.email ||
    !result.verified ||
    result.postTitle === null
  ) {
    logger.debug("getCommentOwnerEmail", {
      tag: "getCommentOwnerEmail",
      commentId,
      found: false,
    });
    return null;
  }

  logger.debug("getCommentOwnerEmail", {
    tag: "getCommentOwnerEmail",
    commentId,
    found: true,
    userId: result.userId,
    postId: result.postId,
  });
  return {
    userId: result.userId,
    email: result.email,
    postId: result.postId,
    postTitle: result.postTitle,
  };
}

/**
 * Get username by userId
 */
export async function getUsernameById(userId: string): Promise<string | null> {
  logger.debug("getUsernameById", { tag: "getUsernameById", userId });
  const user = await db
    .select({ username: users.username })
    .from(users)
    .where(eq(users.id, userId))
    .get();

  return user?.username || null;
}

/**
 * Generate post link
 */
export function generatePostLink(postId: string): string {
  // Adjust this URL based on your actual domain/routing
  return `${env.VITE_DOMAIN}/post/i/${postId}`;
}
