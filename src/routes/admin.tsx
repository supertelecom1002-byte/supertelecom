import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Console | Super Telecom" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isLoginPage = pathname.startsWith("/admin/login");

  if (isLoginPage) {
    return <Outlet />;
  }

  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  );
}
