import React from "react";
import { AdminLogin } from "@/components/AdminLogin";
import { AdminDashboard } from "@/components/AdminDashboard";
import { AdminAuthProvider } from "@/context/AdminAuthContext";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";

export const App: React.FC = () => {
  const currentPath = typeof window !== "undefined" ? window.location.pathname : "/";

  // Public route: Admin Login
  if (currentPath === "/admin/login") {
    return (
      <AdminAuthProvider>
        <AdminLogin />
      </AdminAuthProvider>
    );
  }

  // Only /admin routes are protected
  if (currentPath.startsWith("/admin")) {
    return (
      <AdminAuthProvider>
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      </AdminAuthProvider>
    );
  }

  // Public routes (/, /about, /services, /pricing, /blog, etc.) are NOT wrapped in ProtectedRoute
  return null;
};

export default App;
