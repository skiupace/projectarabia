import { z } from "zod";

const reportFlaggingSubmission = z.object({
  report: z.object({
    postId: z.string().optional(),
    commentId: z.string().optional(),
  }),
});

export type ReportFlaggingSubmission = z.infer<typeof reportFlaggingSubmission>;
