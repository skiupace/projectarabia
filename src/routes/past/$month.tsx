import { createFileRoute, Link } from "@tanstack/react-router";
import { getPostsByMonthFn } from "@/actions/get-feed";
import PostRow from "@/components/post/post-row";
import { usePostsStore } from "@/stores/posts";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/past/$month")({
  component: RouteComponent,
  loader: async ({ params }) => {
    return await getPostsByMonthFn({ data: { month: params.month } });
  },
});

// Convert month string to Arabic format
function formatMonthArabic(monthStr: string): string {
  const [year, month] = monthStr.split("-");
  const monthNames = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];

  const arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  const arabicYear = year
    .split("")
    .map((digit) => arabicNumerals[parseInt(digit, 10)])
    .join("");

  const monthName = monthNames[parseInt(month, 10) - 1];
  return `${monthName} ${arabicYear}`;
}

function RouteComponent() {
  const { month } = Route.useParams();
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
      const result = await getPostsByMonthFn({
        data: { month, cursor },
      });

      appendPosts(result.posts);
      setHasMore(result.hasMore);
    } catch (error) {
      console.error("Failed to load more posts:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header with back link */}
      <div className="mb-4 px-2">
        <Link
          to="/past"
          className="text-sm text-zinc-600 hover:text-zinc-900 font-mono"
        >
          ← العودة إلى الأرشيف
        </Link>
        <h1 className="text-xl font-bold mt-2">{formatMonthArabic(month)}</h1>
      </div>

      {/* Posts */}
      {posts.length === 0 ? (
        <div className="text-center text-zinc-500 py-8 text-sm">
          لا توجد منشورات في هذا الشهر
        </div>
      ) : (
        <>
          {posts.map((post, index) => (
            <PostRow
              key={"postId" in post ? post.postId : post.id}
              post={"post" in post ? post.post : post}
              rank={index + 1}
              id={"postId" in post ? post.postId : post.id}
              username={"username" in post ? post.username : ""}
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
        </>
      )}
    </div>
  );
}
