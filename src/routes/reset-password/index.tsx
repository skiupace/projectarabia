import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/reset-password/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>نسيت كلمة المرور</div>;
}
