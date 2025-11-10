import { createFileRoute } from "@tanstack/react-router";
import { getNewestPostsFn } from "@/actions/get-feed";
import PostRow from "@/components/post/post-row";
import { usePostsStore } from "@/stores/posts";
import { useEffect, useState } from "react";
import { logger } from "@/lib/logger";

export const Route = createFileRoute("/newest/")({
  component: RouteComponent,
  loader: async () => {
    try {
      logger.info("routes/newest/index:loader");
      const result = await getNewestPostsFn({ data: {} });
      logger.info("routes/newest/index:loader:success", {
        postCount: result.posts?.length || 0,
      });
      return result;
    } catch (error) {
      logger.error("routes/newest/index:loader", {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  },
});

function RouteComponent() {
  const loaderData = Route.useLoaderData();
  const { posts, setPosts, appendPosts, hasMore, setHasMore, reset } =
    usePostsStore();
  const [loading, setLoading] = useState(false);

  // Initialize store with loader data
  useEffect(() => {
    setPosts(loaderData.posts);
    setHasMore(loaderData.hasMore);

    // Cleanup on unmount
    return () => reset();
  }, [loaderData, setPosts, setHasMore, reset]);

  const handleLoadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const lastPost = posts[posts.length - 1];
      if (!lastPost) return;

      // Use createdAt timestamp as cursor
      const cursor =
        "createdAt" in lastPost ? lastPost.createdAt : lastPost.post?.createdAt;
      const result = await getNewestPostsFn({ data: { cursor } });

      appendPosts(result.posts);
      setHasMore(result.hasMore);
    } catch (error) {
      console.error("Failed to load more posts:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl">
      {posts.map((newestPost, index) => (
        <PostRow
          key={"postId" in newestPost ? newestPost.postId : newestPost.id}
          post={"post" in newestPost ? newestPost.post : newestPost}
          rank={index + 1}
          id={"postId" in newestPost ? newestPost.postId : newestPost.id}
          username={"username" in newestPost ? newestPost.username : ""}
        />
      ))}

      {hasMore && (
        <div className="py-4 px-2">
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={loading}
            className="w-full text-sm font-mono text-zinc-700 hover:text-zinc-900 disabled:text-zinc-400 disabled:cursor-not-allowed"
          >
            {loading ? "جاري التحميل..." : "المزيد"}
          </button>
        </div>
      )}
    </div>
  );
}
