import { create } from "zustand";
import type { PostWithUsername } from "@/types/posts";
import type { PostWithOrder } from "@/thealgorithm/ranking";

interface PostsState {
  posts: (PostWithUsername | PostWithOrder)[];
  hasMore: boolean;
  setPosts: (posts: (PostWithUsername | PostWithOrder)[]) => void;
  appendPosts: (posts: (PostWithUsername | PostWithOrder)[]) => void;
  setHasMore: (hasMore: boolean) => void;
  updatePostVote: (postId: string, didVote: boolean, voteDelta: number) => void;
  reset: () => void;
}

export const usePostsStore = create<PostsState>((set) => ({
  posts: [],
  hasMore: false,
  setPosts: (posts) => set({ posts }),
  appendPosts: (posts) =>
    set((state) => ({
      posts: [...state.posts, ...posts],
    })),
  setHasMore: (hasMore) => set({ hasMore }),
  updatePostVote: (postId, didVote, voteDelta) =>
    set((state) => ({
      posts: state.posts.map((p) => {
        const post = "rank" in p ? p.post : p;
        if (post.postId === postId) {
          const updatedPost = {
            ...post,
            didVote,
            votes: post.votes + voteDelta,
          };
          return "rank" in p ? { ...p, post: updatedPost } : updatedPost;
        }
        return p;
      }),
    })),
  reset: () => set({ posts: [], hasMore: false }),
}));
