import { createServerFn } from "@tanstack/react-start";
import { useAppSession } from "./-sessions/useSession";
import {
  votePost,
  unvotePost,
  voteComment,
  unvoteComment,
} from "@/services/votes";
import { logger } from "@/lib/logger";

interface VoteSubmission {
  postId?: string;
  commentId?: string;
}

export const voteSubmit = createServerFn({ method: "POST" })
  .inputValidator((data: VoteSubmission) => data)
  .handler(async ({ data }) => {
    const session = await useAppSession();

    if (!session.data?.userId) {
      logger.warn("voteSubmit", {
        tag: "voteSubmit",
        action: "unauthorized",
      });
      return {
        success: false,
        error: "يجب تسجيل الدخول للتصويت",
        errorCode: "NOT_AUTHENTICATED",
      };
    }

    if (data.postId && data.commentId) {
      logger.warn("voteSubmit", {
        tag: "voteSubmit",
        action: "invalid_input",
        userId: session.data.userId,
      });
      return {
        success: false,
        error: "يجب أن يكون لديك إما منشور أو تعليق للتصويت",
        errorCode: "INVALID_INPUT_ERROR",
      };
    }

    logger.info("voteSubmit", {
      tag: "voteSubmit",
      userId: session.data.userId,
      postId: data.postId,
      commentId: data.commentId,
    });

    try {
      if (data.postId) {
        await votePost(data.postId, session.data.userId);
      } else if (data.commentId) {
        await voteComment(data.commentId, session.data.userId);
      } else {
        logger.warn("voteSubmit", {
          tag: "voteSubmit",
          action: "missing_target",
          userId: session.data.userId,
        });
        return {
          success: false,
          error: "يجب أن يكون لديك إما منشور أو تعليق للتصويت",
          errorCode: "INVALID_INPUT_ERROR",
        };
      }

      logger.info("voteSubmit", {
        tag: "voteSubmit",
        action: "success",
        userId: session.data.userId,
        postId: data.postId,
        commentId: data.commentId,
      });

      return {
        success: true,
        message: "تم التصويت بنجاح",
      };
    } catch (error) {
      logger.error("voteSubmit", {
        tag: "voteSubmit",
        userId: session.data.userId,
        postId: data.postId,
        commentId: data.commentId,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      return {
        success: false,
        error: "حدث خطأ أثناء التصويت",
        errorCode: "VOTE_ERROR",
      };
    }
  });

export const unvoteSubmit = createServerFn({ method: "POST" })
  .inputValidator((data: VoteSubmission) => data)
  .handler(async ({ data }) => {
    const session = await useAppSession();

    if (!session.data?.userId) {
      logger.warn("unvoteSubmit", {
        tag: "unvoteSubmit",
        action: "unauthorized",
      });
      return {
        success: false,
        error: "يجب تسجيل الدخول لإلغاء التصويت",
        errorCode: "NOT_AUTHENTICATED",
      };
    }

    logger.info("unvoteSubmit", {
      tag: "unvoteSubmit",
      userId: session.data.userId,
      postId: data.postId,
      commentId: data.commentId,
    });

    try {
      if (data.postId) {
        await unvotePost(data.postId, session.data.userId);
      } else if (data.commentId) {
        await unvoteComment(data.commentId, session.data.userId);
      } else {
        logger.warn("unvoteSubmit", {
          tag: "unvoteSubmit",
          action: "missing_target",
          userId: session.data.userId,
        });
        return {
          success: false,
          error: "يجب أن يكون لديك إما منشور أو تعليق لإلغاء التصويت",
          errorCode: "INVALID_INPUT_ERROR",
        };
      }

      logger.info("unvoteSubmit", {
        tag: "unvoteSubmit",
        action: "success",
        userId: session.data.userId,
        postId: data.postId,
        commentId: data.commentId,
      });

      return {
        success: true,
        message: "تم إلغاء التصويت بنجاح",
      };
    } catch (error) {
      logger.error("unvoteSubmit", {
        tag: "unvoteSubmit",
        userId: session.data.userId,
        postId: data.postId,
        commentId: data.commentId,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      return {
        success: false,
        error: "حدث خطأ أثناء إلغاء التصويت",
        errorCode: "UNVOTE_ERROR",
      };
    }
  });
