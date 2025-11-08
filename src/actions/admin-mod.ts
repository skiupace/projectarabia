import { createMiddleware, createServerFn } from "@tanstack/react-start";
import { useAppSession } from "./-sessions/useSession";
import type { PostSubmition } from "@/schemas/forms/post";
import { adminHidePost, adminEditPost } from "@/services/posts";
import { adminHideComment } from "@/services/comments";
import { promoteUserToModerator, depromoteUser } from "@/services/user";
import { env } from "cloudflare:workers";
import { logger } from "@/lib/logger";
import { getUsernameById } from "./-mailer/helpers";
import { banUser } from "@/db/queries/users_status";
import { findPostById } from "@/db/queries/posts";
import { findCommentById } from "@/db/queries/comments";
import { findUserByUsername } from "@/db/queries/users";

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

    // Prevent hiding own posts
    const post = await findPostById(postId);
    if (!post) {
      logger.error("adminHidePostFn", {
        tag: "adminHidePostFn",
        action: "post_not_found",
        moderatorId: session.data.userId,
        postId,
      });
      return {
        success: false,
        error: "المنشور غير موجود",
        errorCode: "POST_NOT_FOUND",
      };
    }

    if (post.userId === session.data.userId) {
      logger.warn("adminHidePostFn", {
        tag: "adminHidePostFn",
        action: "self_action_prevented",
        moderatorId: session.data.userId,
        postId,
      });
      return {
        success: false,
        error: "لا يمكنك إخفاء منشوراتك الخاصة",
        errorCode: "SELF_ACTION_NOT_ALLOWED",
      };
    }

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

    // Prevent hiding own comments
    const comment = await findCommentById(commentId);
    if (!comment) {
      logger.error("adminHideCommentFn", {
        tag: "adminHideCommentFn",
        action: "comment_not_found",
        moderatorId: session.data.userId,
        commentId,
      });
      return {
        success: false,
        error: "التعليق غير موجود",
        errorCode: "COMMENT_NOT_FOUND",
      };
    }

    if (comment.userId === session.data.userId) {
      logger.warn("adminHideCommentFn", {
        tag: "adminHideCommentFn",
        action: "self_action_prevented",
        moderatorId: session.data.userId,
        commentId,
      });
      return {
        success: false,
        error: "لا يمكنك إخفاء تعليقاتك الخاصة",
        errorCode: "SELF_ACTION_NOT_ALLOWED",
      };
    }

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

    // Prevent editing own posts
    const post = await findPostById(postId);
    if (!post) {
      logger.error("adminEditPostFn", {
        tag: "adminEditPostFn",
        action: "post_not_found",
        moderatorId: session.data.userId,
        postId,
      });
      return {
        success: false,
        error: "المنشور غير موجود",
        errorCode: "POST_NOT_FOUND",
      };
    }

    if (post.userId === session.data.userId) {
      logger.warn("adminEditPostFn", {
        tag: "adminEditPostFn",
        action: "self_action_prevented",
        moderatorId: session.data.userId,
        postId,
      });
      return {
        success: false,
        error: "لا يمكنك تعديل منشوراتك الخاصة كمشرف",
        errorCode: "SELF_ACTION_NOT_ALLOWED",
      };
    }

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

    // Prevent promoting oneself
    const session = await useAppSession();
    if (session.data?.userId) {
      const targetUser = await findUserByUsername(username);
      if (targetUser && targetUser.id === session.data.userId) {
        logger.warn("promoteUserFn", {
          tag: "promoteUserFn",
          action: "self_action_prevented",
          username,
          userId: session.data.userId,
        });
        return {
          success: false,
          error: "لا يمكنك ترقية نفسك",
          errorCode: "SELF_ACTION_NOT_ALLOWED",
        };
      }
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

export const deomoteUserFn = createServerFn({ method: "POST" })
  .inputValidator((data: { username: string; secret_key: string }) => data)
  .handler(async ({ data }) => {
    const { username, secret_key } = data;

    // Validate secret key
    if (!env.MODERATION_SECRET_KEY) {
      logger.error("depromoteUserFn", {
        tag: "depromoteUserFn",
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
      logger.warn("depromoteUserFn", {
        tag: "depromoteUserFn",
        action: "invalid_secret_key",
        username,
      });
      return {
        success: false,
        error: "المفتاح السري غير صحيح",
        errorCode: "INVALID_SECRET_KEY",
      };
    }

    // Prevent demoting oneself
    const session = await useAppSession();
    if (session.data?.userId) {
      const targetUser = await findUserByUsername(username);
      if (targetUser && targetUser.id === session.data.userId) {
        logger.warn("depromoteUserFn", {
          tag: "depromoteUserFn",
          action: "self_action_prevented",
          username,
          userId: session.data.userId,
        });
        return {
          success: false,
          error: "لا يمكنك تخفيض رتبة نفسك",
          errorCode: "SELF_ACTION_NOT_ALLOWED",
        };
      }
    }

    // Depromote user
    const result = await depromoteUser(username);

    if (!result.success) {
      logger.error("depromoteUserFn", {
        tag: "depromoteUserFn",
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

    logger.info("depromoteUserFn", {
      tag: "depromoteUserFn",
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

export const banUserFn = createServerFn({ method: "POST" })
  .inputValidator((data: { userId: string }) => data)
  .handler(async ({ data }) => {
    const { userId } = data;

    // Get current session and username performing the action
    const session = await useAppSession();
    const actingUsername = await getUsernameById(session.data.userId!);

    // Only allow "v0id_user" to perform a ban
    if (actingUsername !== "v0id_user") {
      logger.error("banUserFn", {
        tag: "banUserFn",
        action: "not_authorized_to_ban",
        actingUsername,
        userId,
      });
      return {
        success: false,
        error: "غير مصرح لك بحظر المستخدمين",
        errorCode: "NOT_AUTHORIZED_TO_BAN",
      };
    }

    // Prevent banning the main admin (v0id_user) himself
    if (userId === session.data.userId) {
      logger.error("banUserFn", {
        tag: "banUserFn",
        action: "admin_cannot_ban_self",
        userId,
      });
      return {
        success: false,
        error: "لا يمكن تعديل المشرف الرئيسي",
        errorCode: "ADMIN_CANNOT_BE_BANNED",
      };
    }

    // Ban for 1 month from now
    const bannedUntil = new Date();
    bannedUntil.setMonth(bannedUntil.getMonth() + 1);

    const result = await banUser(
      userId,
      bannedUntil,
      "بان من قبل المشرف الرئيسي",
    );

    if (!result.success) {
      logger.error("banUserFn", {
        tag: "banUserFn",
        userId,
        error: result.error,
      });
      return {
        success: false,
        error: result.error,
      };
    }

    logger.info("banUserFn", {
      tag: "banUserFn",
      action: "success",
      userId,
    });

    return {
      success: true,
      userId,
    };
  });
