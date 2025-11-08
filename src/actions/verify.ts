import { createServerFn } from "@tanstack/react-start";
import { verifyToken } from "@/services/verifications";
import { useAppSession } from "./-sessions/useSession";
import { redirect } from "@tanstack/react-router";
import { getUsernameById } from "./-mailer/helpers";
import { logger } from "@/lib/logger";

export const verifyFn = createServerFn({ method: "GET" })
  .inputValidator((data: { token: string }) => data)
  .handler(async ({ data }) => {
    logger.info("verifyFn", {
      tag: "verifyFn",
      tokenProvided: !!data.token,
    });

    const result = await verifyToken(data.token);
    const session = await useAppSession();

    if (!result.valid) {
      logger.warn("verifyFn", {
        tag: "verifyFn",
        action: "invalid_token",
        error: result.error,
      });
      return {
        success: false,
        error: result.error || "رمز التحقق غير صالح",
      };
    }

    logger.info("verifyFn", {
      tag: "verifyFn",
      action: "token_valid",
      userId: result.userId,
    });

    if (session) {
      const userId = session.data?.userId;
      if (userId) {
        const username = await getUsernameById(userId);
        if (username) {
          logger.info("verifyFn", {
            tag: "verifyFn",
            action: "redirect",
            userId,
            username,
          });
          throw redirect({
            to: "/user/$username",
            params: {
              username,
            },
          });
        }
      }
    }

    logger.info("verifyFn", {
      tag: "verifyFn",
      action: "success",
      userId: result.userId,
    });

    return {
      success: true,
      userId: result.userId,
    };
  });
