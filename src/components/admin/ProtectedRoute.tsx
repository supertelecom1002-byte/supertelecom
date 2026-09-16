import React, { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAdminAuth } from "@/context/AdminAuthContext";

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin, loading } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin/login")) {
      return;
    }
    // Only redirect to /admin/login when loading === false AND !isAdmin
    if (!loading && !isAdmin) {
      navigate({ to: "/admin/login" });
    }
  }, [isAdmin, loading, navigate]);

  // If loading is true, return minimal loading state instead of redirecting immediately
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-cyan-400 font-mono text-sm">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent mr-3" />
        Loading Super Telecom Admin...
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-cyan-400 font-mono text-sm">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent mr-3" />
        Redirecting to Admin Login...
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;

