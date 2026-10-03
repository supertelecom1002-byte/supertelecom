import { createFileRoute } from "@tanstack/react-router";
import { AdminDashboard } from "@/components/AdminDashboard";

export const Route = createFileRoute("/admin/analytics")({
  head: () => ({
    meta: [
      { title: "Google Search Console & Analytics | Super Telecom Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminAnalyticsRoute,
});

function AdminAnalyticsRoute() {
  return <AdminDashboard defaultTab="analytics" />;
}

export default AdminAnalyticsRoute;
