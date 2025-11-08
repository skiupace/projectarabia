import { createServerFn } from "@tanstack/react-start";
import type { UserProfileSubmission } from "@/schemas/forms/user-profile";
import { useAppSession } from "./-sessions/useSession";
import { updateUserProfile } from "@/services/user";
import { logger } from "@/lib/logger";

export const updateUserProfileFn = createServerFn({ method: "POST" })
  .inputValidator((data: UserProfileSubmission) => data)
  .handler(async ({ data }) => {
    const session = await useAppSession();
    if (!session.data?.userId) {
      logger.warn("updateUserProfileFn", {
        tag: "updateUserProfileFn",
        action: "unauthorized",
      });
      return {
        success: false,
        error: "يجب تسجيل الدخول لتحديث الملف الشخصي",
        errorCode: "NOT_AUTHENTICATED",
      };
    }

    logger.info("updateUserProfileFn", {
      tag: "updateUserProfileFn",
      userId: session.data.userId,
      hasEmail: !!data.email,
      hasAbout: !!data.about,
    });

    const result = await updateUserProfile(data);
    if (!result.success) {
      logger.error("updateUserProfileFn", {
        tag: "updateUserProfileFn",
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

    logger.info("updateUserProfileFn", {
      tag: "updateUserProfileFn",
      action: "success",
      userId: session.data.userId,
    });

    return {
      success: true,
    };
  });
