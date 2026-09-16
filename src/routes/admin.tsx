import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useEffect } from "react";

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
  const { isAdmin, loading } = useAdminAuth();

  useEffect(() => {
    if (!loading && !isAdmin && typeof window !== "undefined") {
      window.location.href = "/admin/login";
    }
  }, [isAdmin, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-200">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent mb-4" />
        <p className="text-sm font-mono text-cyan-400">Verifying administrator access...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return <Outlet />;
}
