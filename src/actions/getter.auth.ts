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
        action: "user_not_found",
        userId,
      });
      return null;
    }

    logger.debug("getCurrentUserFn", {
      tag: "getCurrentUserFn",
      action: "success",
      userId,
    });

    return user;
  },
);
