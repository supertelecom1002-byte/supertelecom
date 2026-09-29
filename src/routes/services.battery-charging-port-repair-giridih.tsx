import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/services/battery-charging-port-repair-giridih")({
  beforeLoad: () => {
    throw redirect({
      to: "/services/$slug",
      params: { slug: "battery-replacement" },
      statusCode: 301,
    });
  },
});
