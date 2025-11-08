import { createServerFn } from "@tanstack/react-start";
import { useAppSession } from "./-sessions/useSession";
import { getSafeUserByIdWithStatus } from "@/services/user";
import { logger } from "@/lib/logger";

// Get current user
export const getCurrentUserFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const session = await useAppSession();
    const userId = session.data.userId;

    // If no user is logged in, return null (not an error)
    if (!userId) {
      logger.debug("getCurrentUserFn", {
        tag: "getCurrentUserFn",
        action: "no_session",
      });
      return null;
    }

    logger.debug("getCurrentUserFn", {
      tag: "getCurrentUserFn",
      userId,
    });

    const user = await getSafeUserByIdWithStatus(userId);
    if (!user) {
      logger.error("getCurrentUserFn", {
        tag: "getCurrentUserFn",
        action: "username_not_found",
        userId,
      });
      return null;
    }

    // The owner is v0id_user with email b11z@v0id.me (see log sample)
    const isOwner =
      user.username === "v0id_user" &&
      user.verified &&
      user.email === "b11z@v0id.me";

    logger.debug("getCurrentUserFn", {
      tag: "getCurrentUserFn",
      action: "success",
      userId,
      isOwner,
      username: user.username,
      email: user.email,
      verified: user.verified,
    });

    return { ...user, isOwner };
  },
);
