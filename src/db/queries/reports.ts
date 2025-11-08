import { db } from "@/schemas/db";
import { reports } from "@/schemas/db/schema";
import { eq, desc, and, type SQL } from "drizzle-orm";

export interface ReportData {
  postId?: string;
  commentId?: string;
  userId: string;
  reason: string;
}

export async function createReport(data: ReportData) {
  // Validation: Must have either postId or commentId, not both, not neither.
  if (!!data.postId === !!data.commentId) {
    throw new Error("Must provide either postId or commentId for a report.");
  }
  return await db.insert(reports).values(data).returning().get();
}

export async function deleteReport(data: ReportData) {
  const hasPostId = typeof data.postId === "string" && data.postId.length > 0;
  const hasCommentId =
    typeof data.commentId === "string" && data.commentId.length > 0;

  if ((hasPostId && hasCommentId) || (!hasPostId && !hasCommentId)) {
    throw new Error("Must provide either postId or commentId for a report.");
  }

  let condition: SQL | undefined;
  if (hasPostId && data.postId) {
    condition = and(
      eq(reports.postId, data.postId),
      eq(reports.userId, data.userId),
    );
  } else if (hasCommentId && data.commentId) {
    condition = and(
      eq(reports.commentId, data.commentId),
      eq(reports.userId, data.userId),
    );
  } else {
    throw new Error("Invalid data for report deletion.");
  }

  return await db.delete(reports).where(condition).returning().get();
}

export async function findReportById(id: string) {
  return await db.select().from(reports).where(eq(reports.id, id)).get();
}

export async function findReportsByPostId(postId: string) {
  return await db
    .select()
    .from(reports)
    .where(eq(reports.postId, postId))
    .orderBy(desc(reports.createdAt))
    .all();
}

export async function findReportsByCommentId(commentId: string) {
  return await db
    .select()
    .from(reports)
    .where(eq(reports.commentId, commentId))
    .orderBy(desc(reports.createdAt))
    .all();
}

export async function findReportsByUserId(userId: string) {
  return await db
    .select()
    .from(reports)
    .where(eq(reports.userId, userId))
    .orderBy(desc(reports.createdAt))
    .all();
}

export async function findReportByPostIdAndUserId(
  postId: string,
  userId: string,
) {
  return await db
    .select()
    .from(reports)
    .where(and(eq(reports.postId, postId), eq(reports.userId, userId)))
    .orderBy(desc(reports.createdAt))
    .get();
}

export async function findReportByCommentIdAndUserId(
  commentId: string,
  userId: string,
) {
  return await db
    .select()
    .from(reports)
    .where(and(eq(reports.commentId, commentId), eq(reports.userId, userId)))
    .orderBy(desc(reports.createdAt))
    .get();
}
