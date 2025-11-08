import { createServerFn } from "@tanstack/react-start";
import {
  getNewComments,
  getCommentsByUsername as getCommentsByUsernameService,
} from "@/services/comments";
import { useAppSession } from "./-sessions/useSession";
import { z } from "zod";
import { logger } from "@/lib/logger";

const cursorInputSchema = z.object({
  cursor: z.string().optional(),
});

const usernameInputSchema = z.object({
  username: z.string(),
  cursor: z.string().optional(),
});

export const getComments = createServerFn({ method: "GET" })
  .inputValidator(cursorInputSchema)
  .handler(async ({ data }) => {
    const session = await useAppSession();
    const userId = session.data.userId;
    logger.debug("getComments", {
      tag: "getComments",
      userId,
      cursor: data.cursor,
    });
    const result = await getNewComments(userId, 50, data.cursor);
    logger.debug("getComments", {
      tag: "getComments",
      action: "success",
      userId,
      count: result.comments.length,
      hasMore: result.hasMore,
    });
    return result;
  });

export const getCommentsByUsername = createServerFn({ method: "GET" })
  .inputValidator(usernameInputSchema)
  .handler(async ({ data }) => {
    const session = await useAppSession();
    const userId = session.data.userId;
    logger.debug("getCommentsByUsername", {
      tag: "getCommentsByUsername",
      userId,
      username: data.username,
      cursor: data.cursor,
    });
    const result = await getCommentsByUsernameService(
      data.username,
      userId,
      50,
      data.cursor,
    );
    logger.debug("getCommentsByUsername", {
      tag: "getCommentsByUsername",
      action: "success",
      userId,
      username: data.username,
      count: result.comments.length,
      hasMore: result.hasMore,
    });
    return result;
  });
