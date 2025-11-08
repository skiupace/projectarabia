import { formOptions } from "@tanstack/react-form";
import type { Comment } from "@/schemas/db/comments";

export interface CommentSubmission {
  comment: Pick<Comment, "text" | "parentId" | "postId">;
}

const defaultCommentSubmission: CommentSubmission = {
  comment: {
    text: "",
    parentId: null,
    postId: "",
  },
};

export const commentFormOpts = formOptions({
  defaultValues: defaultCommentSubmission,
});
