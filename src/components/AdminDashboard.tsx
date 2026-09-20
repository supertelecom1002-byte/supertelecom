import React, { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { BrandLogo } from "@/components/BrandLogo";
import { AdminSidebar, type AdminTab } from "@/components/admin/AdminSidebar";
import { AuditDashboard } from "@/components/admin/audit/AuditDashboard";
import { DailyFeedManager } from "@/components/admin/cms/DailyFeedManager";
import { ServicesManager } from "@/components/admin/cms/ServicesManager";
import { BeforeAfterManager } from "@/components/admin/cms/BeforeAfterManager";
import { AnnouncementManager } from "@/components/admin/cms/AnnouncementManager";
import { LocalSeoManager } from "@/components/admin/cms/LocalSeoManager";
import { runWebsiteAudit } from "@/services/auditEngine";

export const AdminDashboard: React.FC = () => {
  const { user, isAdmin, loading: authLoading, signOut } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>("audit");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [auditScore, setAuditScore] = useState<number>(90);

  const navigate = useNavigate();

  // Redirect unauthenticated or non-admin users
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate({ to: "/admin/login" });
    }
  }, [isAdmin, authLoading, navigate]);

  // Initial score fetch
  useEffect(() => {
    if (isAdmin && typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("st_latest_audit_report");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.scores?.overall) {
            setAuditScore(parsed.scores.overall);
          }
        } else {
          runWebsiteAudit().then((rep) => setAuditScore(rep.scores.overall)).catch(() => {});
        }
      } catch {
        // ignore
      }
    }
  }, [isAdmin]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-200">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent mb-4" />
        <p className="text-sm font-mono text-cyan-400">Verifying administrator authorization...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Navigation Bar */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/90 z-30 sticky top-0 backdrop-blur-md">
        <BrandLogo size="sm" to="/" />
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-xl bg-slate-800 text-slate-200 hover:text-white"
          aria-label="Open Navigation Menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Admin Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userEmail={user?.email}
        auditScore={auditScore}
        onSignOut={signOut}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl w-full overflow-x-hidden">
        {activeTab === "audit" && (
          <AuditDashboard onNavigateTab={(tab) => setActiveTab(tab)} />
        )}

        {activeTab === "feed" && <DailyFeedManager />}

        {activeTab === "services" && <ServicesManager />}

        {activeTab === "showcase" && <BeforeAfterManager />}

        {activeTab === "announcements" && <AnnouncementManager />}

        {activeTab === "seo" && <LocalSeoManager />}
      </main>
    </div>
  );
};

export default AdminDashboard;
