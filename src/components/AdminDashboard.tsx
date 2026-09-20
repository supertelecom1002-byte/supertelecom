import React, { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Menu, Edit3, Sparkles, ExternalLink } from "lucide-react";
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
      <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl w-full overflow-x-hidden space-y-8">
        {/* Prominent Live Visual In-Place Editor Banner */}
        <div className="relative overflow-hidden p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-cyan-950/80 via-slate-900/90 to-slate-900 border border-cyan-500/40 shadow-[0_0_25px_rgba(6,182,212,0.2)] flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 text-cyan-400 shadow-inner flex-none">
              <Edit3 className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-white">Visual Website Live Editor</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase">
                  In-Place WYSIWYG
                </span>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                Browse the live Super Telecom site and click on any text, heading, or image to edit it directly in-place with instant preview.
              </p>
            </div>
          </div>

          <a
            href="/?edit=true"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all transform hover:scale-[1.03] active:scale-95 flex-none"
          >
            <Sparkles className="h-4 w-4" />
            <span>Open Live Visual Editor</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

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
