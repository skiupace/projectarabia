import { createFileRoute, redirect } from "@tanstack/react-router";
import { verifyFn } from "@/actions/verify";

export const Route = createFileRoute("/verify/$token")({
  beforeLoad: async ({ params }) => {
    const result = await verifyFn({ data: { token: params.token } });

    if (result.success) {
      throw redirect({
        to: "/",
      });
    }

    return { error: result.error || "رمز التحقق غير صالح" };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { error } = Route.useRouteContext();

  return (
    <div style={{ padding: "8px", fontFamily: "monospace", fontSize: "10pt" }}>
      <p>فشل التحقق: {error}</p>
      <p>
        <a href="/" style={{ textDecoration: "underline" }}>
          العودة إلى الصفحة الرئيسية
        </a>
      </p>
    </div>
  );
}
