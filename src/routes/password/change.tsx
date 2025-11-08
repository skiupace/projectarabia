import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/password/change")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/password/change"!</div>;
}
