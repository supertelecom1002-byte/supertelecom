import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/services/motherboard-chip-level-repair-giridih")({
  beforeLoad: () => {
    throw redirect({
      to: "/services/$slug",
      params: { slug: "motherboard-repair" },
      statusCode: 301,
    });
  },
});
