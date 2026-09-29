import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/services/water-damage-mobile-repair-giridih")({
  beforeLoad: () => {
    throw redirect({
      to: "/services/$slug",
      params: { slug: "water-damage-repair" },
      statusCode: 301,
    });
  },
});
