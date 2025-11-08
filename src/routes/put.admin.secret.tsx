import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { promoteUserFn } from "@/actions/admin-mod";
import { getCurrentUserFn } from "@/actions/getter.auth";

export const Route = createFileRoute("/put/admin/secret")({
  beforeLoad: async () => {
    const user = await getCurrentUserFn();
    if (!user) {
      throw redirect({ to: "/login" });
    }

    const isAdminEmail = user.email === "b11z@hey.com";
    const isAdminUsername = user.username === "v0id_user";
    const isVerified = user.verified;

    if (!isVerified && !isAdminEmail && !isAdminUsername) {
      throw redirect({ to: "/" });
    }

    return { user };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const [username, setUsername] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const result = await promoteUserFn({
        data: {
          username: username.trim(),
          secret_key: secretKey,
        },
      });

      if (result.success) {
        setMessage({
          type: "success",
          text: `تم ترقية المستخدم ${result.username} إلى مشرف بنجاح`,
        });
        setUsername("");
        setSecretKey("");
      } else {
        setMessage({
          type: "error",
          text: result.error || "حدث خطأ أثناء الترقية",
        });
      }
    } catch (_error) {
      setMessage({
        type: "error",
        text: "حدث خطأ غير متوقع",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div dir="rtl" className="font-mono max-w-md mx-auto p-4 mt-8">
      <h1 className="text-lg mb-6 text-gray-800">ترقية مستخدم إلى مشرف</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="username"
            className="block text-xs mb-1 text-gray-600"
          >
            اسم المستخدم
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="username"
            className="w-full px-2 py-1.5 text-sm border border-gray-300 focus:outline-none focus:border-gray-500"
          />
        </div>

        <div>
          <label
            htmlFor="secretKey"
            className="block text-xs mb-1 text-gray-600"
          >
            المفتاح السري
          </label>
          <input
            type="password"
            id="secretKey"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            required
            placeholder="••••••••"
            className="w-full px-2 py-1.5 text-sm border border-gray-300 focus:outline-none focus:border-gray-500"
          />
        </div>

        {message && (
          <div
            className={`text-xs px-3 py-2 border ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border-green-200"
                : "bg-red-50 text-red-800 border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full px-4 py-2 text-sm ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black hover:bg-gray-800"
          } text-white transition-colors`}
        >
          {isSubmitting ? "..." : "ترقية"}
        </button>
      </form>

      <div className="mt-8 text-xs text-gray-500 border-t pt-4">
        <span className="text-gray-700">ملاحظة:</span> هذه الصفحة تستخدم لترقية
        المستخدمين إلى مشرفين.
      </div>
    </div>
  );
}
