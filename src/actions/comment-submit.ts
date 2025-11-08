import { createServerFn } from "@tanstack/react-start";
import { useAppSession } from "./-sessions/useSession";
import type { CommentSubmission } from "@/schemas/forms/comment";
import { createComment, hideComment, editComment } from "@/services/comments";
import { getPostById } from "@/services/posts";
import { logger } from "@/lib/logger";

export const commentSubmitFn = createServerFn({ method: "POST" })
  .inputValidator((data: CommentSubmission) => data)
  .handler(async ({ data }) => {
    // Get session
    const session = await useAppSession();

    if (!session.data?.userId) {
      logger.warn("commentSubmitFn", {
        tag: "commentSubmitFn",
        action: "unauthorized",
        postId: data.comment.postId,
      });
      return {
        success: false,
        error: "يجب تسجيل الدخول لإنشاء تعليق",
        errorCode: "NOT_AUTHENTICATED",
      };
    }

    logger.info("commentSubmitFn", {
      tag: "commentSubmitFn",
      userId: session.data.userId,
      postId: data.comment.postId,
      textLength: data.comment.text?.length || 0,
    });

    // Check if post exists and is not hidden
    const post = await getPostById(data.comment.postId);
    if (!post) {
      logger.warn("commentSubmitFn", {
        tag: "commentSubmitFn",
        action: "post_not_found",
        userId: session.data.userId,
        postId: data.comment.postId,
      });
      return {
        success: false,
        error: "المنشور غير موجود",
        errorCode: "POST_NOT_FOUND",
      };
    }

    if (post.hidden) {
      logger.warn("commentSubmitFn", {
        tag: "commentSubmitFn",
        action: "post_hidden",
        userId: session.data.userId,
        postId: data.comment.postId,
      });
      return {
        success: false,
        error: "لا يمكن التعليق على منشور محذوف",
        errorCode: "POST_HIDDEN",
      };
    }

    // Validate comment text length
    if (!data.comment.text || data.comment.text.trim().length < 2) {
      logger.warn("commentSubmitFn", {
        tag: "commentSubmitFn",
        action: "comment_too_short",
        userId: session.data.userId,
        postId: data.comment.postId,
      });
      return {
        success: false,
        error: "التعليق قصير جداً",
        errorCode: "COMMENT_TOO_SHORT",
      };
    }

    if (data.comment.text.length > 512) {
      logger.warn("commentSubmitFn", {
        tag: "commentSubmitFn",
        action: "comment_too_long",
        userId: session.data.userId,
        postId: data.comment.postId,
        textLength: data.comment.text.length,
      });
      return {
        success: false,
        error: "التعليق طويل جداً (الحد الأقصى 512 حرف)",
        errorCode: "COMMENT_TOO_LONG",
      };
    }

    // Create comment with required fields for DB schema
    try {
      const comment = await createComment({
        comment: data.comment,
        userId: session.data.userId,
      });

      logger.info("commentSubmitFn", {
        tag: "commentSubmitFn",
        action: "success",
        userId: session.data.userId,
        commentId: comment.id,
        postId: data.comment.postId,
      });

      return {
        success: true,
        comment: comment,
      };
    } catch (error) {
      // Handle errors from service layer (e.g., comment limit reached)
      const errorMessage =
        error instanceof Error ? error.message : "حدث خطأ أثناء إنشاء التعليق";
      logger.error("commentSubmitFn", {
        tag: "commentSubmitFn",
        userId: session.data.userId,
        postId: data.comment.postId,
        error: errorMessage,
      });
      return {
        success: false,
        error: errorMessage,
        errorCode: "COMMENT_CREATION_FAILED",
      };
    }
  });

export const editCommentFn = createServerFn({ method: "POST" })
  .inputValidator((data: { commentId: string; text: string }) => data)
  .handler(async ({ data }) => {
    // Get session
    const session = await useAppSession();

    if (!session.data?.userId) {
      logger.warn("editCommentFn", {
        tag: "editCommentFn",
        action: "unauthorized",
        commentId: data.commentId,
      });
      return {
        success: false,
        error: "يجب تسجيل الدخول لتعديل التعليق",
        errorCode: "NOT_AUTHENTICATED",
      };
    }

    logger.info("editCommentFn", {
      tag: "editCommentFn",
      userId: session.data.userId,
      commentId: data.commentId,
      textLength: data.text.length,
    });

    // Call service layer
    const result = await editComment(
      data.commentId,
      data.text,
      session.data.userId,
    );

    if (!result.success) {
      logger.error("editCommentFn", {
        tag: "editCommentFn",
        userId: session.data.userId,
        commentId: data.commentId,
        error: result.error,
        errorCode: result.errorCode,
      });
      return {
        success: false,
        error: result.error,
        errorCode: result.errorCode,
      };
    }

    logger.info("editCommentFn", {
      tag: "editCommentFn",
      action: "success",
      userId: session.data.userId,
      commentId: result.commentId,
    });

    return {
      success: true,
      commentId: result.commentId,
    };
  });

export const deleteCommentFn = createServerFn({ method: "POST" })
  .inputValidator((data: { commentId: string }) => data)
  .handler(async ({ data }) => {
    // Get session
    const session = await useAppSession();

    if (!session.data?.userId) {
      logger.warn("deleteCommentFn", {
        tag: "deleteCommentFn",
        action: "unauthorized",
        commentId: data.commentId,
      });
      return {
        success: false,
        error: "يجب تسجيل الدخول لحذف التعليق",
        errorCode: "NOT_AUTHENTICATED",
      };
    }

    logger.info("deleteCommentFn", {
      tag: "deleteCommentFn",
      userId: session.data.userId,
      commentId: data.commentId,
    });

    // Call service layer
    const result = await hideComment(data.commentId, session.data.userId);

    if (!result.success) {
      logger.error("deleteCommentFn", {
        tag: "deleteCommentFn",
        userId: session.data.userId,
        commentId: data.commentId,
        error: result.error,
        errorCode: result.errorCode,
      });
      return {
        success: false,
        error: result.error,
        errorCode: result.errorCode,
      };
    }

    logger.info("deleteCommentFn", {
      tag: "deleteCommentFn",
      action: "success",
      userId: session.data.userId,
      commentId: result.commentId,
    });

    return {
      success: true,
      commentId: result.commentId,
    };
  });
