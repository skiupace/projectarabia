import { createFileRoute } from "@tanstack/react-router";
import { UserDetail } from "@/components/user/user-detail";
import { getUserByUsernameWithStatusAndBadgesFn } from "@/actions/get-user";
import { logger } from "@/lib/logger";

export const Route = createFileRoute("/user/$username")({
  component: RouteComponent,
  loader: async ({ params }) => {
    try {
      logger.info("routes/user/$username:loader", { username: params.username });
      const result = await getUserByUsernameWithStatusAndBadgesFn({
        data: { username: params.username },
      });
      if (!result || !result.SafeUserWithStatus) {
        logger.warn("routes/user/$username:loader:notFound", { username: params.username });
      } else {
        logger.info("routes/user/$username:loader:success", { username: params.username });
      }
      return { result };
    } catch (error) {
      logger.error("routes/user/$username:loader", {
        username: params.username,
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  },
});

function RouteComponent() {
  const { result } = Route.useLoaderData();

  if (!result || !result.SafeUserWithStatus) {
    return (
      <div className="w-full max-w-4xl mx-auto px-2 py-8">
        <p className="text-center text-zinc-500 font-mono text-sm">
          المستخدم غير موجود
        </p>
      </div>
    );
  }

  return <UserDetail user={result.SafeUserWithStatus} />;
}
