import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/services/iphone-repair-specialist-giridih")({
  beforeLoad: () => {
    throw redirect({
      to: "/services/$slug",
      params: { slug: "iphone-back-glass-repair" },
      statusCode: 301,
    });
  },
});
