import { createServerFn } from "@tanstack/react-start";
import {
  getPostById,
  getPostByIdJoinedWithComments,
  getPostsByUsername,
} from "@/services/posts";
import { z } from "zod";
import { useAppSession } from "./-sessions/useSession";
import { logger } from "@/lib/logger";

const postIdInputSchema = z.object({
  postId: z.string(),
});

const usernameInputSchema = z.object({
  username: z.string(),
  cursor: z.string().optional(),
});

export const getPostByIdJoinedWithCommentsFn = createServerFn({ method: "GET" })
  .inputValidator(postIdInputSchema)
  .handler(async ({ data }) => {
    const session = await useAppSession();
    const userId = session.data.userId;

    logger.debug("getPostByIdJoinedWithCommentsFn", {
      tag: "getPostByIdJoinedWithCommentsFn",
      userId,
      postId: data.postId,
    });

    const postWithComments = await getPostByIdJoinedWithComments(
      data.postId,
      userId,
    );

    if (!postWithComments) {
      logger.warn("getPostByIdJoinedWithCommentsFn", {
        tag: "getPostByIdJoinedWithCommentsFn",
        action: "post_not_found",
        userId,
        postId: data.postId,
      });
      return {
        success: false,
        error: "لم يتم العثور على المنشور",
        errorCode: "POST_NOT_FOUND_ERROR",
      };
    }

    logger.debug("getPostByIdJoinedWithCommentsFn", {
      tag: "getPostByIdJoinedWithCommentsFn",
      action: "success",
      userId,
      postId: data.postId,
      commentsCount: postWithComments.comments.length,
    });

    return { postWithComments };
  });

export const getPostbyIdFn = createServerFn({ method: "GET" })
  .inputValidator(postIdInputSchema)
  .handler(async ({ data }) => {
    logger.debug("getPostbyIdFn", {
      tag: "getPostbyIdFn",
      postId: data.postId,
    });

    const post = await getPostById(data.postId);

    if (!post) {
      logger.warn("getPostbyIdFn", {
        tag: "getPostbyIdFn",
        action: "post_not_found",
        postId: data.postId,
      });
      return {
        success: false,
        error: "لم يتم العثور على المنشور",
        errorCode: "POST_NOT_FOUND_ERROR",
      };
    }

    logger.debug("getPostbyIdFn", {
      tag: "getPostbyIdFn",
      action: "success",
      postId: data.postId,
    });

    return { post };
  });

export const getPostsByUsernameFn = createServerFn({ method: "GET" })
  .inputValidator(usernameInputSchema)
  .handler(async ({ data }) => {
    const session = await useAppSession();
    const userId = session.data.userId;
    logger.debug("getPostsByUsernameFn", {
      tag: "getPostsByUsernameFn",
      userId,
      username: data.username,
      cursor: data.cursor,
    });
    const result = await getPostsByUsername(
      data.username,
      userId,
      50,
      data.cursor,
    );
    logger.debug("getPostsByUsernameFn", {
      tag: "getPostsByUsernameFn",
      action: "success",
      userId,
      username: data.username,
      count: result.posts.length,
      hasMore: result.hasMore,
    });
    return result;
  });
