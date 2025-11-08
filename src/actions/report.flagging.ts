import { createServerFn } from "@tanstack/react-start";
import type { ReportFlaggingSubmission } from "@/schemas/general/report";
import { useAppSession } from "./-sessions/useSession";
import { report, unreport } from "@/services/report";
import { logger } from "@/lib/logger";

export const reportFn = createServerFn({ method: "POST" })
  .inputValidator((data: ReportFlaggingSubmission) => data)
  .handler(async ({ data }) => {
    const session = await useAppSession();

    if (!session.data?.userId) {
      logger.warn("reportFn", {
        tag: "reportFn",
        action: "unauthorized",
      });
      return {
        success: false,
        error: "يجب تسجيل الدخول للتبليغ",
        errorCode: "NOT_AUTHENTICATED",
      };
    }

    if (data.report.postId && data.report.commentId) {
      logger.warn("reportFn", {
        tag: "reportFn",
        action: "invalid_input",
        userId: session.data.userId,
      });
      return {
        success: false,
        error: "يجب أن يكون لديك إما منشور أو تعليق للتبليغ",
        errorCode: "INVALID_INPUT_ERROR",
      };
    }

    logger.info("reportFn", {
      tag: "reportFn",
      userId: session.data.userId,
      postId: data.report.postId,
      commentId: data.report.commentId,
    });

    if (data.report.postId) {
      await report({
        postId: data.report.postId,
        userId: session.data.userId,
        reason: "لم يتم تحديد السبب",
      });
    } else if (data.report.commentId) {
      await report({
        commentId: data.report.commentId,
        userId: session.data.userId,
        reason: "لم يتم تحديد السبب",
      });
    } else {
      logger.warn("reportFn", {
        tag: "reportFn",
        action: "missing_target",
        userId: session.data.userId,
      });
      return {
        success: false,
        error: "يجب أن يكون لديك إما منشور أو تعليق للتبليغ",
        errorCode: "INVALID_INPUT_ERROR",
      };
    }

    logger.info("reportFn", {
      tag: "reportFn",
      action: "success",
      userId: session.data.userId,
      postId: data.report.postId,
      commentId: data.report.commentId,
    });

    return {
      success: true,
      message: "تم التبليغ بنجاح",
    };
  });

export const unreportFn = createServerFn({ method: "POST" })
  .inputValidator((data: ReportFlaggingSubmission) => data)
  .handler(async ({ data }) => {
    const session = await useAppSession();

    if (!session.data?.userId) {
      logger.warn("unreportFn", {
        tag: "unreportFn",
        action: "unauthorized",
      });
      return {
        success: false,
        error: "يجب تسجيل الدخول للإلغاء الإبلاغ",
        errorCode: "NOT_AUTHENTICATED",
      };
    }

    logger.info("unreportFn", {
      tag: "unreportFn",
      userId: session.data.userId,
      postId: data.report.postId,
      commentId: data.report.commentId,
    });

    if (data.report.postId) {
      await unreport({
        postId: data.report.postId,
        userId: session.data.userId,
        reason: "لم يتم تحديد السبب",
      });
    } else if (data.report.commentId) {
      await unreport({
        commentId: data.report.commentId,
        userId: session.data.userId,
        reason: "لم يتم تحديد السبب",
      });
    }

    logger.info("unreportFn", {
      tag: "unreportFn",
      action: "success",
      userId: session.data.userId,
      postId: data.report.postId,
      commentId: data.report.commentId,
    });

    return {
      success: true,
      message: "تم الإلغاء الإبلاغ بنجاح",
    };
  });
