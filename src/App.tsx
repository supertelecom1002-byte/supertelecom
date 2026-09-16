import React from "react";
import { AdminLogin } from "@/components/AdminLogin";
import { AdminDashboard } from "@/components/AdminDashboard";
import { AdminAuthProvider, useAdminAuth } from "@/context/AdminAuthContext";

export const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin, loading } = useAdminAuth();

  React.useEffect(() => {
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

  return <>{children}</>;
};

export const App: React.FC = () => {
  const currentPath = typeof window !== "undefined" ? window.location.pathname : "/";

  if (currentPath === "/admin/login") {
    return (
      <AdminAuthProvider>
        <AdminLogin />
      </AdminAuthProvider>
    );
  }

  if (currentPath.startsWith("/admin")) {
    return (
      <AdminAuthProvider>
        <ProtectedAdminRoute>
          <AdminDashboard />
        </ProtectedAdminRoute>
      </AdminAuthProvider>
    );
  }

  return null;
};

export default App;
