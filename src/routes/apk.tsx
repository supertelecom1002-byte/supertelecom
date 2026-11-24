import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/apk")({
  beforeLoad: () => {
    throw redirect({
      to: "/download",
      statusCode: 301,
    });
  },
});
