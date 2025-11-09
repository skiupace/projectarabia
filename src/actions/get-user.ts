import { createServerFn } from "@tanstack/react-start";
import { getSafeUserByUsernameWithStatus } from "@/services/user";
import { z } from "zod";
import type { SafeUserWithStatus } from "@/types/users";
import { getUserBadges } from "@/services/badges";
import { logger } from "@/lib/logger";

const usernameInputSchema = z.object({
  username: z.string(),
});

export const getUserByUsernameWithStatusAndBadgesFn = createServerFn({
  method: "GET",
})
  .inputValidator(usernameInputSchema)
  .handler(async ({ data }) => {
    logger.debug("getUserByUsernameWithStatusAndBadgesFn", {
      tag: "getUserByUsernameWithStatusAndBadgesFn",
      username: data.username,
    });
    const SafeUserWithStatus = await getSafeUserByUsernameWithStatus(
      data.username,
    );
    if (!SafeUserWithStatus) {
      logger.warn("getUserByUsernameWithStatusAndBadgesFn", {
        tag: "getUserByUsernameWithStatusAndBadgesFn",
        action: "user_not_found",
        username: data.username,
      });
      return {
        success: false,
        error: "لم يتم العثور على المستخدم",
        errorCode: "USER_NOT_FOUND_ERROR",
      };
    }
    const userBadges = await getUserBadges(SafeUserWithStatus.userId);
    logger.debug("getUserByUsernameWithStatusAndBadgesFn", {
      tag: "getUserByUsernameWithStatusAndBadgesFn",
      action: "success",
      userId: SafeUserWithStatus.userId,
      username: data.username,
      badgesCount: userBadges.length,
    });
    return {
      SafeUserWithStatus: {
        ...SafeUserWithStatus,
        badges: userBadges,
      } as SafeUserWithStatus & { badges: typeof userBadges },
    };
  });
