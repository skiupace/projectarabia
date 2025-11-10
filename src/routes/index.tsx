import { createFileRoute, Link } from "@tanstack/react-router";
import PostRow from "@/components/post/post-row";
import { rankedFeedFn } from "@/actions/get-feed";
import type { PostWithOrder } from "@/thealgorithm/ranking";
import { z } from "zod";
import { logger } from "@/lib/logger";

const searchSchema = z.object({
  p: z.number().optional().default(1).catch(1),
});

export const Route = createFileRoute("/")({
  component: App,
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => ({ page: search.p }),
  loader: async ({ deps }) => {
    const page = deps.page || 1;
    try {
      logger.info("routes/index:loader", { page });
      const result = await rankedFeedFn({ data: { page } });
      logger.info("routes/index:loader:success", {
        page,
        postCount: result.posts?.length || 0
      });
      return result;
    } catch (error) {
      logger.error("routes/index:loader", {
        page,
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  },
});

function App() {
  const loaderData = Route.useLoaderData();
  const search = Route.useSearch();
  const currentPage = search.p || 1;
  const { posts, hasMore } = loaderData;

  return (
    <div className="w-full max-w-4xl">
      {/* Page navigation at top */}
      {currentPage > 1 && (
        <div className="py-2 px-2 border-b border-zinc-200">
          <Link
            to="/"
            search={{ p: currentPage - 1 }}
            className="text-sm font-mono text-blue-600 hover:underline"
          >
            ← السابق
          </Link>
        </div>
      )}

      {/* Posts list */}
      {(posts as PostWithOrder[]).map((rankedPost) => (
        <PostRow
          key={rankedPost.id}
          rank={rankedPost.rank}
          id={rankedPost.id}
          post={rankedPost.post}
          username={rankedPost.username}
        />
      ))}

      {/* Page navigation at bottom */}
      <div className="py-4 px-2 border-t border-zinc-200 flex justify-between items-center">
        {hasMore ? (
          <Link
            to="/"
            search={{ p: currentPage + 1 }}
            className="text-sm font-mono text-blue-600 hover:underline"
          >
            → التالي
          </Link>
        ) : (
          <div />
        )}

        <span className="text-sm font-mono text-zinc-500">
          صفحة {currentPage}
        </span>
        {currentPage > 1 ? (
          <Link
            to="/"
            search={{ p: currentPage - 1 }}
            className="text-sm font-mono text-blue-600 hover:underline"
          >
            السابق ←
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
