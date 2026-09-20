import React from "react";
import {
  Activity,
  Film,
  Wrench,
  Sliders,
  Megaphone,
  MapPin,
  ExternalLink,
  LogOut,
  ShieldCheck,
  X,
} from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";

export type AdminTab = "audit" | "feed" | "services" | "showcase" | "announcements" | "seo";

interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
  auditScore?: number;
  onSignOut: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpen,
  onClose,
  userEmail,
  auditScore = 88,
  onSignOut,
}) => {
  const navItems: { id: AdminTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: "audit",
      label: "Website Audit",
      icon: <Activity className="h-4 w-4" />,
      badge: `${auditScore}%`,
    },
    {
      id: "feed",
      label: "Daily Workshop Feed",
      icon: <Film className="h-4 w-4" />,
    },
    {
      id: "services",
      label: "Services Catalog",
      icon: <Wrench className="h-4 w-4" />,
    },
    {
      id: "showcase",
      label: "Before & After Repairs",
      icon: <Sliders className="h-4 w-4" />,
    },
    {
      id: "announcements",
      label: "Alerts & Marquee",
      icon: <Megaphone className="h-4 w-4" />,
    },
    {
      id: "seo",
      label: "Local SEO & NAP",
      icon: <MapPin className="h-4 w-4" />,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-slate-900/95 border-r border-slate-800/80 p-5 flex flex-col justify-between transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="space-y-6">
          {/* Logo & Mobile Close */}
          <div className="flex items-center justify-between">
            <BrandLogo size="md" to="/" />
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white md:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Admin User Card */}
          <div className="p-3 rounded-2xl bg-cyan-950/60 border border-cyan-500/30 flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-cyan-400 flex-none" />
            <div className="overflow-hidden text-xs">
              <span className="font-bold text-cyan-300 block">Verified Admin</span>
              <span className="text-slate-400 truncate block text-[11px] font-mono">
                {userEmail || "supertelecom1002@gmail.com"}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectTab(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? "bg-slate-950 text-cyan-400"
                          : "bg-cyan-950 text-cyan-400 border border-cyan-500/30"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-slate-800/80 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-cyan-400 bg-slate-950/60 border border-slate-800 transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" /> View Live Site
          </a>

          <button
            type="button"
            onClick={onSignOut}
            className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-300 hover:text-rose-100 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" /> Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
