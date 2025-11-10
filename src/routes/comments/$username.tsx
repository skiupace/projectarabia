import { createFileRoute } from "@tanstack/react-router";
import { getCommentsByUsername } from "@/actions/get-comments";
import CommentRow from "@/components/comment/comment-row";
import { useCommentFeedsStore } from "@/stores/comment-feeds";
import { useEffect, useState } from "react";
import { logger } from "@/lib/logger";

export const Route = createFileRoute("/comments/$username")({
  component: RouteComponent,
  loader: async ({ params }) => {
    try {
      logger.info("routes/comments/$username:loader", {
        username: params.username,
      });
      const result = await getCommentsByUsername({
        data: { username: params.username },
      });
      logger.info("routes/comments/$username:loader:success", {
        username: params.username,
        commentCount: result.comments?.length || 0,
      });
      return result;
    } catch (error) {
      logger.error("routes/comments/$username:loader", {
        username: params.username,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  },
});

function RouteComponent() {
  const loaderData = Route.useLoaderData();
  const { username } = Route.useParams();
  const { comments, setComments, appendComments, hasMore, setHasMore, reset } =
    useCommentFeedsStore();
  const [loading, setLoading] = useState(false);

  // Initialize store with loader data
  useEffect(() => {
    setComments(loaderData.comments);
    setHasMore(loaderData.hasMore);

    // Cleanup on unmount
    return () => reset();
  }, [loaderData, setComments, setHasMore, reset]);

  const handleLoadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const lastComment = comments[comments.length - 1];
      if (!lastComment) return;

      // Use createdAt timestamp as cursor
      const cursor = lastComment.createdAt;
      const result = await getCommentsByUsername({
        data: { username, cursor },
      });

      appendComments(result.comments);
      setHasMore(result.hasMore);
    } catch (error) {
      console.error("Failed to load more comments:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl">
      <div className="text-sm font-mono text-zinc-700 py-2 px-2 border-b border-zinc-200">
        تعليقات {username}
      </div>
      {comments.length === 0 ? (
        <div className="text-center text-zinc-500 py-8 text-sm">
          لا توجد تعليقات لهذا المستخدم
        </div>
      ) : (
        comments.map((comment) => (
          <CommentRow key={comment.id} comment={comment} />
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
