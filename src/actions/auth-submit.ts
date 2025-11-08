import { createServerFn } from "@tanstack/react-start";
import { useAppSession } from "./-sessions/useSession";
import type { LoginSubmission, RegisterSubmission } from "@/schemas/auth/login";
import { registerUser, loginUser } from "@/services/auth";
import { logger } from "@/lib/logger";

// Register new user
export const registerFn = createServerFn({ method: "POST" })
  .inputValidator((data: RegisterSubmission) => data)
  .handler(async ({ data }) => {
    logger.info("registerFn", {
      tag: "registerFn",
      username: data.username,
    });

    // Call service layer
    const result = await registerUser(data);
    const session = await useAppSession();

    if (!result.success) {
      logger.warn("registerFn", {
        tag: "registerFn",
        username: data.username,
        error: result.error,
        errorCode: result.errorCode,
      });
      return {
        error: result.error,
        errorCode: result.errorCode,
      };
    }

    // Create session
    await session.update({
      userId: result.userId,
      email: result.email || undefined,
      moderator: false,
    });

    logger.info("registerFn", {
      tag: "registerFn",
      action: "success",
      userId: result.userId,
    });

    // Return success
    return { success: true };
  });

// Login existing user
export const loginFn = createServerFn({ method: "POST" })
  .inputValidator((data: LoginSubmission) => data)
  .handler(async ({ data }) => {
    logger.info("loginFn", {
      tag: "loginFn",
      username: data.username,
    });

    // Call service layer
    const result = await loginUser(data);
    const session = await useAppSession();

    if (!result.success) {
      logger.warn("loginFn", {
        tag: "loginFn",
        username: data.username,
        error: result.error,
        errorCode: result.errorCode,
      });
      return {
        error: result.error,
        errorCode: result.errorCode,
      };
    }

    // Create session
    await session.update({
      userId: result.userId,
      email: result.email || undefined,
      moderator: result.moderator,
    });

    logger.info("loginFn", {
      tag: "loginFn",
      action: "success",
      userId: result.userId,
      moderator: result.moderator,
    });

    // Return success
    return { success: true };
  });

// Logout user
export const logoutFn = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useAppSession();
  const userId = session.data?.userId;

  logger.info("logoutFn", {
    tag: "logoutFn",
    userId,
  });

  await session.clear();
  return { success: true };
});
