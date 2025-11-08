import type { PostWithUsername } from "@/types/posts";

export interface PostWithOrder {
  id: string;
  post: PostWithUsername;
  username: string;
  rank: number;
}

/**
 * Rank posts using the Babel algorithm:
 * score = ln(votes + 1) / (age_hours + 2)^1.2
 */
export function rankPosts(posts: PostWithUsername[]): PostWithOrder[] {
  const now = Date.now();

  // First, calculate scores and sort
  const sortedPosts = posts
    .map((post) => {
      const votes = Math.max(0, post.votes ?? 0); // safety for nulls/negatives
      const createdAt = new Date(post.createdAt).getTime();
      const ageHours = (now - createdAt) / (1000 * 60 * 60);

      // avoid NaN if weird timestamps or zero
      const score = Math.log(votes + 1) / (Math.max(ageHours, 0) + 2) ** 1.2;

      return {
        id: post.postId,
        post: post,
        username: post.username,
        score: score,
      };
    })
    .sort((a, b) => b.score - a.score);

  // Then assign sequential ranks (1, 2, 3...)
  return sortedPosts.map((item, index) => ({
    id: item.id,
    post: item.post,
    username: item.username,
    rank: index + 1,
  }));
}
