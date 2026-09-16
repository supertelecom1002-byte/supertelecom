import { createFileRoute } from "@tanstack/react-router";
import { AdminLogin } from "@/components/AdminLogin";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin Login | Super Telecom" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLoginRoute,
});

function AdminLoginRoute() {
  return <AdminLogin />;
}
