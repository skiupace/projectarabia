import { create } from "zustand";
import type { Comment } from "@/components/comment/comment-thread";

interface CommentsState {
  comments: Comment[];
  setComments: (comments: Comment[]) => void;
  addComment: (comment: Comment) => void;
  updateComment: (commentId: string, text: string, updatedAt: Date) => void;
  updateCommentVote: (
    commentId: string,
    didVote: boolean,
    voteDelta: number,
  ) => void;
  hideComment: (commentId: string) => void;
}

export const useCommentsStore = create<CommentsState>((set) => ({
  comments: [],
  setComments: (comments) => set({ comments }),
  addComment: (comment) =>
    set((state) => ({
      comments: [...state.comments, comment],
    })),
  updateComment: (commentId, text, updatedAt) =>
    set((state) => ({
      comments: state.comments.map((c) =>
        c.id === commentId
          ? { ...c, text, updatedAt: updatedAt.toISOString() }
          : c,
      ),
    })),
  updateCommentVote: (commentId, didVote, voteDelta) =>
    set((state) => ({
      comments: state.comments.map((c) =>
        c.id === commentId ? { ...c, didVote, votes: c.votes + voteDelta } : c,
      ),
    })),
  hideComment: (commentId) =>
    set((state) => ({
      comments: state.comments.map((c) =>
        c.id === commentId ? { ...c, hidden: true } : c,
      ),
    })),
}));
