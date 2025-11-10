import { createFileRoute } from "@tanstack/react-router";
import { getPostsByUsernameFn } from "@/actions/get-post";
import PostRow from "@/components/post/post-row";
import { usePostsStore } from "@/stores/posts";
import { useEffect, useState } from "react";
import { logger } from "@/lib/logger";

export const Route = createFileRoute("/posts/$username")({
  component: RouteComponent,
  loader: async ({ params }) => {
    try {
      logger.info("routes/posts/$username:loader", { username: params.username });
      const result = await getPostsByUsernameFn({ data: { username: params.username } });
      logger.info("routes/posts/$username:loader:success", { 
        username: params.username,
        postCount: result.posts?.length || 0 
      });
      return result;
    } catch (error) {
      logger.error("routes/posts/$username:loader", { 
        username: params.username,
        error: error instanceof Error ? error.message : String(error) 
      });
      throw error;
    }
  },
});

function RouteComponent() {
  const loaderData = Route.useLoaderData();
  const { username } = Route.useParams();
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
      const result = await getPostsByUsernameFn({ data: { username, cursor } });

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
      <div className="text-sm font-mono text-zinc-700 py-2 px-2 border-b border-zinc-200">
        منشورات {username}
      </div>
      {posts.length === 0 ? (
        <div className="text-center text-zinc-500 py-8 text-sm">
          لا توجد منشورات لهذا المستخدم
        </div>
      ) : (
        posts.map((post, index) => (
          <PostRow
            key={"postId" in post ? post.postId : post.id}
            post={"post" in post ? post.post : post}
            rank={index + 1}
            id={"postId" in post ? post.postId : post.id}
            username={"username" in post ? post.username : username}
          />
        ))
      )}

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
