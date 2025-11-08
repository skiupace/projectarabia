import { createMiddleware, createServerFn } from "@tanstack/react-start";
import { useAppSession } from "./-sessions/useSession";
import type { PostSubmition } from "@/schemas/forms/post";
import { adminHidePost, adminEditPost } from "@/services/posts";
import { adminHideComment } from "@/services/comments";
import { promoteUserToModerator } from "@/services/user";
import { env } from "cloudflare:workers";
import { logger } from "@/lib/logger";

// Create a server function middleware for moderator/admin validation
const roleValidationMiddleware = createMiddleware({
  type: "function",
}).server(async ({ next }) => {
  const session = await useAppSession();
  if (!session.data?.userId) {
    logger.warn("roleValidationMiddleware", {
      tag: "roleValidationMiddleware",
      action: "unauthorized",
    });
    // Short-circuit: not authenticated
    throw new Error("يجب تسجيل الدخول للتعديل");
  }
  if (session.data.moderator !== true) {
    logger.warn("roleValidationMiddleware", {
      tag: "roleValidationMiddleware",
      action: "insufficient_permissions",
      userId: session.data.userId,
    });
    // Short-circuit: missing permissions
    throw new Error("ليس لديك صلاحيات التعديل");
  }
  // All checks passed, continue to handler
  return next();
});

export const adminHidePostFn = createServerFn({ method: "POST" })
  .middleware([roleValidationMiddleware])
  .inputValidator((data: { postId: string; reason: string }) => data)
  .handler(async ({ data }) => {
    const session = await useAppSession();
    const { postId, reason } = data;

    logger.info("adminHidePostFn", {
      tag: "adminHidePostFn",
      moderatorId: session.data.userId,
      postId,
      reason,
    });

    const result = await adminHidePost(postId);

    if (!result.success) {
      logger.error("adminHidePostFn", {
        tag: "adminHidePostFn",
        moderatorId: session.data.userId,
        postId,
        error: result.error,
        errorCode: result.errorCode,
      });
      return {
        success: false,
        error: result.error,
        errorCode: result.errorCode,
      };
    }

    logger.info("adminHidePostFn", {
      tag: "adminHidePostFn",
      action: "success",
      moderatorId: session.data.userId,
      postId,
    });

    return {
      success: true,
      postId: result.postId,
    };
  });

export const adminHideCommentFn = createServerFn({ method: "POST" })
  .middleware([roleValidationMiddleware])
  .inputValidator((data: { commentId: string }) => data)
  .handler(async ({ data }) => {
    const session = await useAppSession();
    const { commentId } = data;

    logger.info("adminHideCommentFn", {
      tag: "adminHideCommentFn",
      moderatorId: session.data.userId,
      commentId,
    });

    const result = await adminHideComment(commentId);

    if (!result.success) {
      logger.error("adminHideCommentFn", {
        tag: "adminHideCommentFn",
        moderatorId: session.data.userId,
        commentId,
        error: result.error,
        errorCode: result.errorCode,
      });
      return {
        success: false,
        error: result.error,
        errorCode: result.errorCode,
      };
    }

    logger.info("adminHideCommentFn", {
      tag: "adminHideCommentFn",
      action: "success",
      moderatorId: session.data.userId,
      commentId,
    });

    return {
      success: true,
      commentId: result.commentId,
    };
  });

export const adminEditPostFn = createServerFn({ method: "POST" })
  .middleware([roleValidationMiddleware])
  .inputValidator(
    (data: PostSubmition & { postId: string; reason: string }) => data,
  )
  .handler(async ({ data }) => {
    const session = await useAppSession();
    const { postId, reason } = data;

    logger.info("adminEditPostFn", {
      tag: "adminEditPostFn",
      moderatorId: session.data.userId,
      postId,
      reason,
    });

    const result = await adminEditPost(data, postId, reason);

    if (!result.success) {
      logger.error("adminEditPostFn", {
        tag: "adminEditPostFn",
        moderatorId: session.data.userId,
        postId,
        error: result.error,
        errorCode: result.errorCode,
      });
      return {
        success: false,
        error: result.error,
        errorCode: result.errorCode,
      };
    }

    logger.info("adminEditPostFn", {
      tag: "adminEditPostFn",
      action: "success",
      moderatorId: session.data.userId,
      postId,
    });

    return {
      success: true,
      postId: result.postId,
    };
  });

export const promoteUserFn = createServerFn({ method: "POST" })
  .inputValidator((data: { username: string; secret_key: string }) => data)
  .handler(async ({ data }) => {
    const { username, secret_key } = data;

    // Validate secret key
    if (!env.MODERATION_SECRET_KEY) {
      logger.error("promoteUserFn", {
        tag: "promoteUserFn",
        action: "secret_key_not_configured",
        username,
      });
      return {
        success: false,
        error: "مفتاح الإشراف غير مكوّن",
        errorCode: "SECRET_KEY_NOT_CONFIGURED",
      };
    }

    if (secret_key !== env.MODERATION_SECRET_KEY) {
      logger.warn("promoteUserFn", {
        tag: "promoteUserFn",
        action: "invalid_secret_key",
        username,
      });

      return {
        success: false,
        error: "المفتاح السري غير صحيح",
        errorCode: "INVALID_SECRET_KEY",
      };
    }

    // Promote user
    const result = await promoteUserToModerator(username);

    if (!result.success) {
      logger.error("promoteUserFn", {
        tag: "promoteUserFn",
        username,
        error: result.error,
        errorCode: result.errorCode,
      });
      return {
        success: false,
        error: result.error,
        errorCode: result.errorCode,
      };
    }

    logger.info("promoteUserFn", {
      tag: "promoteUserFn",
      action: "success",
      username: result.username,
      userId: result.userId,
    });

    return {
      success: true,
      username: result.username,
      userId: result.userId,
    };
  });
