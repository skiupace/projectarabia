import { createFileRoute } from "@tanstack/react-router";
import { UserDetail } from "@/components/user/user-detail";
import { getUserByUsernameWithStatusAndBadgesFn } from "@/actions/get-user";

export const Route = createFileRoute("/user/$username")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const result = await getUserByUsernameWithStatusAndBadgesFn({
      data: { username: params.username },
    });
    return { result };
  },
});

function RouteComponent() {
  const { result } = Route.useLoaderData();

  if (!result || !result.userWithStatus) {
    return (
      <div className="w-full max-w-4xl mx-auto px-2 py-8">
        <p className="text-center text-zinc-500 font-mono text-sm">
          المستخدم غير موجود
        </p>
      </div>
    );
  }

  return <UserDetail user={result.userWithStatus} />;
}
