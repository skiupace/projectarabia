import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import SubmitForm from "@/components/post/post-form";
import { sharePostFn } from "@/actions/post-submit";
import { getCurrentUserFn } from "@/actions/getter.auth";
import { useState } from "react";
import type { PostSubmition } from "@/schemas/forms/post";

export const Route = createFileRoute("/post/")({
  component: RouteComponent,
  beforeLoad: async () => {
    const user = await getCurrentUserFn();
    if (!user) {
      throw redirect({ to: "/login" });
    }
  },
});

function RouteComponent() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (data: PostSubmition) => {
    try {
      setError(null);
      const result = await sharePostFn({ data });

      // Check if the result indicates success
      if (result && "success" in result) {
        if (result.success && result.postId) {
          // Navigate to the created post
          router.navigate({
            to: "/post/i/$postId",
            params: { postId: result.postId },
          });
          return;
        } else if (!result.success && result.error) {
          // Show error message
          setError(result.error);
          return;
        }
      }

      // If we get here, something unexpected happened
      setError("حدث خطأ أثناء نشر المنشور");
    } catch (err) {
      setError("حدث خطأ أثناء نشر المنشور");
      console.error(err);
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-base font-normal mb-4">إنشاء منشور جديد</h1>
      {error && (
        <div className="max-w-2xl p-4 mb-4 bg-red-50 border border-red-200 text-red-800 text-sm">
          {error}
        </div>
      )}
      <SubmitForm onSubmit={handleSubmit} />
    </div>
  );
}
