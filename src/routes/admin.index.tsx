import { createFileRoute } from "@tanstack/react-router";
import { AdminDashboard } from "@/components/AdminDashboard";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard CMS | Super Telecom" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminIndexRoute,
});

function AdminIndexRoute() {
  return <AdminDashboard />;
}
