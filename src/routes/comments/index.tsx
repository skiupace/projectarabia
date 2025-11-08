import { createFileRoute } from "@tanstack/react-router";
import { getComments } from "@/actions/get-comments";
import CommentRow from "@/components/comment/comment-row";
import { useCommentFeedsStore } from "@/stores/comment-feeds";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/comments/")({
  component: RouteComponent,
  loader: async () => {
    return await getComments({ data: {} });
  },
});

function RouteComponent() {
  const loaderData = Route.useLoaderData();
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
      const result = await getComments({ data: { cursor } });

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
        تعليقات جديدة
      </div>
      {comments.length === 0 ? (
        <div className="text-center text-zinc-500 py-8 text-sm">
          لا توجد تعليقات حالياً
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
