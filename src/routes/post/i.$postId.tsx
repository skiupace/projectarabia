import { createFileRoute } from "@tanstack/react-router";
import PostDetail from "@/components/post/post-detail";
import CommentForm from "@/components/comment/comment-form";
import CommentThread from "@/components/comment/comment-thread";
import type { CommentSubmission } from "@/schemas/forms/comment";
import { useEffect } from "react";
import { getPostByIdJoinedWithCommentsFn } from "@/actions/get-post";
import { useAuth } from "@/contexts/auth";
import { commentSubmitFn } from "@/actions/comment-submit";
import { useCommentsStore } from "@/stores/comments";
import { timeAgo } from "@/lib/time";
import { logger } from "@/lib/logger";

export const Route = createFileRoute("/post/i/$postId")({
  component: RouteComponent,
  loader: async ({ params }) => {
    try {
      logger.info("routes/post/i.$postId:loader", { postId: params.postId });
      const result = await getPostByIdJoinedWithCommentsFn({
        data: { postId: params.postId },
      });
      if (!result.postWithComments) {
        logger.warn("routes/post/i.$postId:loader:notFound", {
          postId: params.postId,
        });
      } else {
        logger.info("routes/post/i.$postId:loader:success", {
          postId: params.postId,
          commentCount: result.postWithComments.comments?.length || 0,
        });
      }
      return result;
    } catch (error) {
      logger.error("routes/post/i.$postId:loader", {
        postId: params.postId,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  },
});

function RouteComponent() {
  const { postWithComments } = Route.useLoaderData();

  // Use Zustand store for comments
  const { comments, setComments, addComment } = useCommentsStore();
  const { user } = useAuth();

  // Initialize store with loader data
  useEffect(() => {
    if (postWithComments?.comments) {
      setComments(postWithComments.comments);
    }
  }, [postWithComments?.comments, setComments]);

  // Handle case where post doesn't exist
  if (!postWithComments) {
    return (
      <div className="w-full max-w-4xl mx-auto px-2 py-8">
        <p className="text-center text-zinc-500 font-mono text-sm">
          المنشور غير موجود
        </p>
      </div>
    );
  }

  const handleCommentSubmit = async (submission: CommentSubmission) => {
    if (!user) return; // User not authenticated

    console.log("Comment submitted:", submission);

    const result = await commentSubmitFn({ data: submission });

    if (result.success && result.comment) {
      // Add comment to store with username
      addComment({
        ...result.comment,
        username: user.username, // Attach the username from session/context
        didReport: false,
        hidden: result.comment.hidden ?? false,
        updatedAt: result.comment.updatedAt ?? "",
        didVote: false,
      });
    }
  };

  const { post } = postWithComments;

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Post Detail */}
      {post.hidden ? (
        <div className="w-full px-2 py-3 text-xs font-mono">
          <div className="text-zinc-500 text-sm mb-2">تم حذف هذا المنشور</div>
          <div className="text-[10px] text-zinc-400">
            <span>{timeAgo(post.createdAt)}</span>
          </div>
        </div>
      ) : (
        <PostDetail post={post} commentsLength={comments.length} />
      )}

      {/* Divider */}
      <div className="border-t border-zinc-200 my-2" />

      {/* Comment Form (only if logged in and comments not locked and post not hidden) */}
      {user && post.commentCount < 500 && !post.hidden && (
        <div className="px-2 py-2">
          <CommentForm
            onSubmit={handleCommentSubmit}
            placeholder="أضف تعليقك على هذا المنشور..."
            postId={post.postId}
          />
        </div>
      )}

      {/* Comments locked message */}
      {post.commentCount >= 500 && !post.hidden && (
        <div className="px-2 py-2">
          <p className="text-zinc-500 text-xs font-mono text-center">
            تم إغلاق التعليقات (الحد الأقصى 500 تعليق)
          </p>
        </div>
      )}

      {/* Comments Thread */}
      <div className="mt-2">
        <CommentThread
          comments={comments}
          postId={post.postId}
          postHidden={post.hidden}
        />
      </div>
    </div>
  );
}
