import { create } from "zustand";
import type { CommentWithContext } from "@/services/comments";

interface CommentFeedsState {
  comments: CommentWithContext[];
  hasMore: boolean;
  setComments: (comments: CommentWithContext[]) => void;
  appendComments: (comments: CommentWithContext[]) => void;
  setHasMore: (hasMore: boolean) => void;
  updateCommentVote: (
    commentId: string,
    didVote: boolean,
    voteDelta: number,
  ) => void;
  reset: () => void;
}

export const useCommentFeedsStore = create<CommentFeedsState>((set) => ({
  comments: [],
  hasMore: false,
  setComments: (comments) => set({ comments }),
  appendComments: (comments) =>
    set((state) => ({
      comments: [...state.comments, ...comments],
    })),
  setHasMore: (hasMore) => set({ hasMore }),
  updateCommentVote: (commentId, didVote, voteDelta) =>
    set((state) => ({
      comments: state.comments.map((c) =>
        c.id === commentId ? { ...c, didVote, votes: c.votes + voteDelta } : c,
      ),
    })),
  reset: () => set({ comments: [], hasMore: false }),
}));
