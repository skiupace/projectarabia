import {
  createComment as dbCreateComment,
  hideComment as dbHideComment,
  findCommentById,
  updateComment as dbUpdateComment,
  findNewComments,
  findCommentsByUsername as dbFindCommentsByUsername,
} from "@/db/queries/comments";
import {
  decrementCommentCount,
  incrementCommentCount,
  findPostById,
} from "@/db/queries/posts";
import { findReportByCommentIdAndUserId } from "@/db/queries/reports";
import { findVoteByCommentIdAndUserId } from "@/db/queries/votes";
import type { CommentSubmission } from "@/schemas/forms/comment";
import type { QueueNotificationMessage } from "@/actions/-mailer/helpers";
import {
  getPostOwnerEmail,
  getCommentOwnerEmail,
  getUsernameById,
  queueNotificationMessage,
} from "@/actions/-mailer/helpers";
import { MAX_COMMENT_TEXT_LENGTH } from "@/constants/limts";
import { differenceInMinutes } from "date-fns";
import { EDIT_COOLDOWN_MINUTES } from "@/constants/limts";

/**
 * Creates a new comment and increments the post's comment count
 */
export async function createComment(
  data: CommentSubmission & { userId: string },
) {
  // Check if post exists and hasn't reached comment limit
  const post = await findPostById(data.comment.postId);

  if (!post) {
    throw new Error("المنشور غير موجود");
  }

  if (post.commentCount >= 500) {
    throw new Error("تم إغلاق التعليقات (الحد الأقصى 500 تعليق)");
  }

  // Create the comment
  const createdComment = await dbCreateComment(data);

  // Increment the comment count on the post
  await incrementCommentCount(data.comment.postId);

  // Queue notifications (don't await, let it happen in background)
  await queueNotifications(
    createdComment.id,
    data.comment.postId,
    data.userId,
    data.comment.text,
    data.comment.parentId,
  );

  return createdComment;
}

/**
 * Queue notification messages for post owner and parent comment author
 */
async function queueNotifications(
  _commentId: string,
  postId: string,
  commenterUserId: string,
  commentText: string,
  parentCommentId: string | null,
) {
  try {
    // Get commenter username
    const commenterUsername = await getUsernameById(commenterUserId);
    if (!commenterUsername) {
      console.log("Commenter username not found, skipping notifications");
      return;
    }

    // 1. Notify post owner about new comment
    const postOwner = await getPostOwnerEmail(postId);
    if (postOwner && postOwner.userId !== commenterUserId) {
      // Don't notify if commenter is the post owner
      const postNotification: QueueNotificationMessage = {
        type: "notification",
        notificationType: "post_comment",
        targetId: postId,
        recipientId: postOwner.userId,
        commenterUserId,
        commenterUsername,
        commentText,
        postId,
        postTitle: postOwner.title,
      };

      await queueNotificationMessage(postNotification);
      console.log(`Queued post comment notification for post ${postId}`);
    }

    // 2. If this is a reply, notify the parent comment author
    if (parentCommentId) {
      const parentCommentOwner = await getCommentOwnerEmail(parentCommentId);
      if (parentCommentOwner && parentCommentOwner.userId !== commenterUserId) {
        // Don't notify if commenter is replying to their own comment
        const replyNotification: QueueNotificationMessage = {
          type: "notification",
          notificationType: "comment_reply",
          targetId: parentCommentId,
          recipientId: parentCommentOwner.userId,
          commenterUserId,
          commenterUsername,
          commentText,
          postId,
          postTitle: parentCommentOwner.postTitle,
        };

        await queueNotificationMessage(replyNotification);
        console.log(
          `Queued comment reply notification for comment ${parentCommentId}`,
        );
      }
    }
  } catch (error) {
    console.error("Error in queueNotifications:", error);
    throw error;
  }
}

export async function editComment(
  commentId: string,
  text: string,
  userId: string,
) {
  // Validate text length
  if (!text || text.trim().length < 2) {
    return {
      success: false,
      error: "التعليق قصير جداً",
      errorCode: "COMMENT_TOO_SHORT",
    };
  }

  if (text.length > MAX_COMMENT_TEXT_LENGTH) {
    return {
      success: false,
      error: `التعليق طويل جداً (الحد الأقصى ${MAX_COMMENT_TEXT_LENGTH} حرف)`,
      errorCode: "COMMENT_TOO_LONG",
    };
  }

  // Check if comment exists
  const existingComment = await findCommentById(commentId);
  if (!existingComment) {
    return {
      success: false,
      error: "التعليق غير موجود",
      errorCode: "COMMENT_NOT_FOUND",
    };
  }

  const createdAtDate = new Date(existingComment.createdAt);
  const now = new Date();
  if (differenceInMinutes(now, createdAtDate) > EDIT_COOLDOWN_MINUTES) {
    return {
      success: false,
      error: `انتهت مهلة تعديل التعليق (${EDIT_COOLDOWN_MINUTES} دقيقة فقط)`,
      errorCode: "EDIT_COOLDOWN_EXPIRED",
    };
  }

  // Check authorization
  if (existingComment.userId !== userId) {
    return {
      success: false,
      error: "ليس لديك صلاحية لتعديل هذا التعليق",
      errorCode: "UNAUTHORIZED",
    };
  }

  // Check if the post is hidden
  const post = await findPostById(existingComment.postId);
  if (!post) {
    return {
      success: false,
      error: "المنشور غير موجود",
      errorCode: "POST_NOT_FOUND",
    };
  }

  if (post.hidden) {
    return {
      success: false,
      error: "لا يمكن تعديل التعليقات على منشور محذوف",
      errorCode: "POST_HIDDEN",
    };
  }

  // Update the comment
  await dbUpdateComment(commentId, text);

  return { success: true, commentId: commentId };
}

export async function hideComment(commentId: string, userId: string) {
  const existingComment = await findCommentById(commentId);
  if (!existingComment) {
    return {
      success: false,
      error: "التعليق غير موجود",
      errorCode: "COMMENT_NOT_FOUND",
    };
  }

  if (existingComment.userId !== userId) {
    return {
      success: false,
      error: "ليس لديك صلاحية لحذف هذا التعليق",
      errorCode: "UNAUTHORIZED",
    };
  }

  // Hide the comment (soft delete)
  await dbHideComment(commentId);

  // Decrement the comment count on the post
  await decrementCommentCount(existingComment.postId);

  return { success: true, commentId: commentId };
}

// Type for comment with post and parent info
export interface CommentWithContext {
  id: string;
  text: string;
  votes: number;
  createdAt: string;
  updatedAt: string | null;
  parentId: string | null;
  postId: string;
  username: string;
  postTitle: string;
  parentText: string | null;
  didReport: boolean;
  didVote: boolean;
  hidden: boolean;
}

/**
 * Get newest comments with post titles and parent comments
 */
export async function getNewComments(
  userId: string | undefined,
  limit: number,
  cursor?: string,
): Promise<{ comments: CommentWithContext[]; hasMore: boolean }> {
  // Fetch limit + 1 to check if there are more
  const commentsRaw = await findNewComments(limit + 1, cursor);

  // Fetch all report and vote statuses in parallel
  let didReports: boolean[] = [];
  let didVotes: boolean[] = [];
  if (userId) {
    const results = await Promise.all(
      commentsRaw.map(async (comment) => {
        const report = await findReportByCommentIdAndUserId(comment.id, userId);
        const vote = await findVoteByCommentIdAndUserId(comment.id, userId);
        return { didReport: !!report, didVote: !!vote };
      }),
    );
    didReports = results.map((r) => r.didReport);
    didVotes = results.map((r) => r.didVote);
  }

  const commentsFormatted = commentsRaw.map((comment, index) => ({
    id: comment.id,
    text: comment.text,
    votes: comment.votes,
    createdAt: comment.createdAt || new Date().toISOString(),
    updatedAt: comment.updatedAt,
    parentId: comment.parentId,
    postId: comment.postId,
    username: comment.username || "unknown",
    postTitle: comment.postTitle || "منشور محذوف",
    parentText: comment.parentText,
    didReport: didReports[index] || false,
    didVote: didVotes[index] || false,
    hidden: comment.hidden ?? false,
  }));

  // Check if there are more results
  const hasMore = commentsFormatted.length > limit;
  const comments = commentsFormatted.slice(0, limit);

  return { comments, hasMore };
}

/**
 * Get comments by username with post titles and parent comments
 */
export async function getCommentsByUsername(
  username: string,
  userId: string | undefined,
  limit: number,
  cursor?: string,
): Promise<{ comments: CommentWithContext[]; hasMore: boolean }> {
  // Fetch limit + 1 to check if there are more
  const commentsRaw = await dbFindCommentsByUsername(
    username,
    limit + 1,
    cursor,
  );

  // Fetch all report and vote statuses in parallel
  let didReports: boolean[] = [];
  let didVotes: boolean[] = [];
  if (userId) {
    const results = await Promise.all(
      commentsRaw.map(async (comment) => {
        const report = await findReportByCommentIdAndUserId(comment.id, userId);
        const vote = await findVoteByCommentIdAndUserId(comment.id, userId);
        return { didReport: !!report, didVote: !!vote };
      }),
    );
    didReports = results.map((r) => r.didReport);
    didVotes = results.map((r) => r.didVote);
  }

  const commentsFormatted = commentsRaw.map((comment, index) => ({
    id: comment.id,
    text: comment.text,
    votes: comment.votes,
    createdAt: comment.createdAt || new Date().toISOString(),
    updatedAt: comment.updatedAt,
    parentId: comment.parentId,
    postId: comment.postId,
    username: comment.username || "unknown",
    postTitle: comment.postTitle || "منشور محذوف",
    parentText: comment.parentText,
    didReport: didReports[index] || false,
    didVote: didVotes[index] || false,
    hidden: comment.hidden ?? false,
  }));

  // Check if there are more results
  const hasMore = commentsFormatted.length > limit;
  const comments = commentsFormatted.slice(0, limit);

  return { comments, hasMore };
}

// Admin function to hide any comment
export async function adminHideComment(
  commentId: string,
): Promise<
  | { success: true; commentId: string }
  | { success: false; error: string; errorCode: string }
> {
  const existingComment = await findCommentById(commentId);
  if (!existingComment) {
    return {
      success: false,
      error: "التعليق غير موجود",
      errorCode: "COMMENT_NOT_FOUND",
    };
  }

  // Admin can hide any comment - skip ownership check
  // Hide the comment (soft delete)
  await dbHideComment(commentId);

  // Decrement the comment count on the post
  await decrementCommentCount(existingComment.postId);

  return { success: true, commentId: commentId };
}
