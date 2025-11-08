import {
  createReport,
  deleteReport,
  type ReportData,
} from "@/db/queries/reports";
import {
  decrementReportCountPost,
  incrementReportCountPost,
} from "@/db/queries/posts";
import {
  decrementReportCountComment,
  incrementReportCountComment,
} from "@/db/queries/comments";

export async function report(data: ReportData) {
  const report = await createReport(data);

  if (report.postId) {
    await incrementReportCountPost(report.postId);
  }

  if (report.commentId) {
    await incrementReportCountComment(report.commentId);
  }

  return report;
}

export async function unreport(data: ReportData) {
  const report = await deleteReport(data);

  if (!report) {
    throw new Error("Report not found");
  }

  if (data.postId) {
    await decrementReportCountPost(data.postId);
  }

  if (data.commentId) {
    await decrementReportCountComment(data.commentId);
  }
}
