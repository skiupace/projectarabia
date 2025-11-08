import type { PostSubmition } from "@/schemas/forms/post";
import { createServerFn } from "@tanstack/react-start";
import { useAppSession } from "./-sessions/useSession";
import { createPost, deletePost, editPost } from "@/services/posts";
import { logger } from "@/lib/logger";

export const sharePostFn = createServerFn({ method: "POST" })
  .inputValidator((data: PostSubmition) => data)
  .handler(async ({ data }) => {
    // Get session
    const session = await useAppSession();

    // Check if user is authenticated
    if (!session.data?.userId) {
      logger.warn("sharePostFn", {
        tag: "sharePostFn",
        action: "unauthorized",
      });
      return {
        success: false,
        error: "يجب تسجيل الدخول لإنشاء منشور",
        errorCode: "NOT_AUTHENTICATED",
      };
    }

    logger.info("sharePostFn", {
      tag: "sharePostFn",
      userId: session.data.userId,
      hasTitle: !!data.post.title,
      hasText: !!data.post.text,
      hasUrl: !!data.post.url,
    });

    // Call service layer
    const result = await createPost(data, session.data.userId);

    if (!result.success) {
      logger.error("sharePostFn", {
        tag: "sharePostFn",
        userId: session.data.userId,
        error: result.error,
        errorCode: result.errorCode,
      });
      return {
        success: false,
        error: result.error,
        errorCode: result.errorCode,
      };
    }

    logger.info("sharePostFn", {
      tag: "sharePostFn",
      action: "success",
      userId: session.data.userId,
      postId: result.postId,
    });

    // Return success with post ID for client-side navigation
    return {
      success: true,
      postId: result.postId,
    };
  });

export const editPostFn = createServerFn({ method: "POST" })
  .inputValidator((data: PostSubmition & { postId: string }) => data)
  .handler(async ({ data }) => {
    // Get session
    const session = await useAppSession();

    // Check if user is authenticated
    if (!session.data?.userId) {
      logger.warn("editPostFn", {
        tag: "editPostFn",
        action: "unauthorized",
        postId: data.postId,
      });
      return {
        success: false,
        error: "يجب تسجيل الدخول لإنشاء منشور",
        errorCode: "NOT_AUTHENTICATED",
      };
    }

    logger.info("editPostFn", {
      tag: "editPostFn",
      userId: session.data.userId,
      postId: data.postId,
    });

    // Call service layer
    const result = await editPost(data, data.postId, session.data.userId);

    if (!result.success) {
      logger.error("editPostFn", {
        tag: "editPostFn",
        userId: session.data.userId,
        postId: data.postId,
        error: result.error,
        errorCode: result.errorCode,
      });
      return {
        success: false,
        error: result.error,
        errorCode: result.errorCode,
      };
    }

    logger.info("editPostFn", {
      tag: "editPostFn",
      action: "success",
      userId: session.data.userId,
      postId: result.postId,
    });

    // Return success with post ID for client-side navigation
    return {
      success: true,
      postId: result.postId,
    };
  });

export const deletePostFn = createServerFn({ method: "POST" })
  .inputValidator((data: { postId: string }) => data)
  .handler(async ({ data }) => {
    // Get session
    const session = await useAppSession();

    // Check if user is authenticated
    if (!session.data?.userId) {
      logger.warn("deletePostFn", {
        tag: "deletePostFn",
        action: "unauthorized",
        postId: data.postId,
      });
      return {
        success: false,
        error: "يجب تسجيل الدخول لحذف المنشور",
        errorCode: "NOT_AUTHENTICATED",
      };
    }

    logger.info("deletePostFn", {
      tag: "deletePostFn",
      userId: session.data.userId,
      postId: data.postId,
    });

    // Call service layer
    const result = await deletePost(data.postId, session.data.userId);

    if (!result.success) {
      logger.error("deletePostFn", {
        tag: "deletePostFn",
        userId: session.data.userId,
        postId: data.postId,
        error: result.error,
        errorCode: result.errorCode,
      });
      return {
        success: false,
        error: result.error,
        errorCode: result.errorCode,
      };
    }

    logger.info("deletePostFn", {
      tag: "deletePostFn",
      action: "success",
      userId: session.data.userId,
      postId: result.postId,
    });

    // Return success with post ID for client-side navigation
    return {
      success: true,
      postId: result.postId,
    };
  });
