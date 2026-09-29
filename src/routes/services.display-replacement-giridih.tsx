import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/services/display-replacement-giridih")({
  beforeLoad: () => {
    throw redirect({
      to: "/services/$slug",
      params: { slug: "display-replacement" },
      statusCode: 301,
    });
  },
});
