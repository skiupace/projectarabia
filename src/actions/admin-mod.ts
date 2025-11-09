import { createMiddleware, createServerFn } from "@tanstack/react-start";
import { useAppSession } from "./-sessions/useSession";
import type { PostSubmition } from "@/schemas/forms/post";
import { adminHidePost, adminEditPost } from "@/services/posts";
import { adminHideComment } from "@/services/comments";
import {
  promoteUserToModerator,
  depromoteUser,
  getSafeUserByIdWithStatus,
} from "@/services/user";
import { logger } from "@/lib/logger";
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
    throw new Error("يجب تسجيل الدخول للتعديل");
  }

  const user = await getSafeUserByIdWithStatus(session.data.userId);

  // Check if user exists
  if (!user) {
    logger.warn("roleValidationMiddleware", {
      tag: "roleValidationMiddleware",
      action: "user_not_found",
      userId: session.data.userId,
    });
    throw new Error("المستخدم غير موجود");
  }

  // Verify user is the main admin
  const isMainAdmin =
    user.username === "v0id_user" &&
    user.email === "b11z@v0id.me" &&
    user.verified === true;

  if (!isMainAdmin) {
    logger.warn("roleValidationMiddleware", {
      tag: "roleValidationMiddleware",
      action: "insufficient_permissions",
      userId: session.data.userId,
      username: user.username,
      email: user.email,
      verified: user.verified,
    });
    throw new Error("ليس لديك صلاحيات التعديل");
  }

  return next();
});

export const adminHidePostFn = createServerFn({ method: "POST" })
  .middleware([roleValidationMiddleware])
  .inputValidator((data: { postId: string; reason: string }) => data)
  .handler(async ({ data }) => {
    const { postId, reason } = data;
    const session = await useAppSession();

    const post = await findPostById(postId);
    if (!post) {
      logger.error("adminHidePostFn", {
        tag: "adminHidePostFn",
        action: "post_not_found",
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
        postId,
      });
      return {
        success: false,
        error: "لا يمكنك إخفاء منشوراتك الخاصة",
        errorCode: "SELF_ACTION_NOT_ALLOWED",
      };
    }

    logger.info("adminHidePostFn", { postId, reason });

    const result = await adminHidePost(postId);
    if (!result.success) {
      logger.error("adminHidePostFn", {
        postId,
        error: result.error,
        errorCode: result.errorCode,
      });
      return result;
    }

    logger.info("adminHidePostFn", { action: "success", postId });
    return {
      success: true,
      postId: result.postId,
    };
  });

export const adminHideCommentFn = createServerFn({ method: "POST" })
  .middleware([roleValidationMiddleware])
  .inputValidator((data: { commentId: string }) => data)
  .handler(async ({ data }) => {
    const { commentId } = data;
    const session = await useAppSession();

    const comment = await findCommentById(commentId);
    if (!comment) {
      logger.error("adminHideCommentFn", {
        tag: "adminHideCommentFn",
        action: "comment_not_found",
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
        commentId,
      });
      return {
        success: false,
        error: "لا يمكنك إخفاء تعليقاتك الخاصة",
        errorCode: "SELF_ACTION_NOT_ALLOWED",
      };
    }

    logger.info("adminHideCommentFn", { commentId });

    const result = await adminHideComment(commentId);
    if (!result.success) {
      logger.error("adminHideCommentFn", {
        commentId,
        error: result.error,
        errorCode: result.errorCode,
      });
      return result;
    }

    logger.info("adminHideCommentFn", { action: "success", commentId });
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
    const { postId, reason } = data;
    const session = await useAppSession();

    const post = await findPostById(postId);
    if (!post) {
      logger.error("adminEditPostFn", {
        tag: "adminEditPostFn",
        action: "post_not_found",
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
        postId,
      });
      return {
        success: false,
        error: "لا يمكنك تعديل منشوراتك الخاصة كمشرف",
        errorCode: "SELF_ACTION_NOT_ALLOWED",
      };
    }

    logger.info("adminEditPostFn", { postId, reason });

    const result = await adminEditPost(data, postId, reason);
    if (!result.success) {
      logger.error("adminEditPostFn", {
        postId,
        error: result.error,
        errorCode: result.errorCode,
      });
      return result;
    }

    logger.info("adminEditPostFn", { action: "success", postId });
    return {
      success: true,
      postId: result.postId,
    };
  });

export const promoteUserFn = createServerFn({ method: "POST" })
  .inputValidator((data: { username: string }) => data)
  .handler(async ({ data }) => {
    const { username } = data;
    const session = await useAppSession();

    if (session.data?.moderator !== true) {
      logger.warn("promoteUserFn", {
        action: "invalid_secret_key",
        username,
      });
      return {
        success: false,
        error: "المفتاح السري غير صحيح",
        errorCode: "INVALID_SECRET_KEY",
      };
    }

    const targetUser = await findUserByUsername(username);
    if (targetUser?.id === session.data.userId) {
      logger.warn("promoteUserFn", {
        action: "self_action_prevented",
        username,
      });
      return {
        success: false,
        error: "لا يمكنك ترقية نفسك",
        errorCode: "SELF_ACTION_NOT_ALLOWED",
      };
    }

    const result = await promoteUserToModerator(username);
    if (!result.success) {
      logger.error("promoteUserFn", {
        username,
        error: result.error,
        errorCode: result.errorCode,
      });
      return result;
    }

    logger.info("promoteUserFn", {
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
  .inputValidator((data: { username: string }) => data)
  .handler(async ({ data }) => {
    const { username } = data;
    const session = await useAppSession();

    if (session.data?.moderator !== true) {
      logger.warn("depromoteUserFn", {
        action: "invalid_secret_key",
        username,
      });
      return {
        success: false,
        error: "المفتاح السري غير صحيح",
        errorCode: "INVALID_SECRET_KEY",
      };
    }

    const targetUser = await findUserByUsername(username);
    if (targetUser?.id === session.data.userId) {
      logger.warn("depromoteUserFn", {
        action: "self_action_prevented",
        username,
      });
      return {
        success: false,
        error: "لا يمكنك تخفيض رتبة نفسك",
        errorCode: "SELF_ACTION_NOT_ALLOWED",
      };
    }

    const result = await depromoteUser(username);
    if (!result.success) {
      logger.error("depromoteUserFn", {
        username,
        error: result.error,
        errorCode: result.errorCode,
      });
      return result;
    }

    logger.info("depromoteUserFn", {
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
  .middleware([roleValidationMiddleware])
  .inputValidator((data: { userId: string }) => data)
  .handler(async ({ data }) => {
    const { userId } = data;
    const session = await useAppSession();

    if (userId === session.data.userId) {
      logger.error("banUserFn", {
        action: "admin_cannot_ban_self",
        userId,
      });
      return {
        success: false,
        error: "لا يمكن تعديل المشرف الرئيسي",
        errorCode: "ADMIN_CANNOT_BE_BANNED",
      };
    }

    const bannedUntil = new Date();
    bannedUntil.setMonth(bannedUntil.getMonth() + 1);

    const result = await banUser(
      userId,
      bannedUntil,
      "بان من قبل المشرف الرئيسي",
    );

    if (!result.success) {
      logger.error("banUserFn", { userId, error: result.error });
      return {
        success: false,
        error: result.error,
      };
    }

    logger.info("banUserFn", { action: "success", userId });
    return {
      success: true,
      userId,
    };
  });
