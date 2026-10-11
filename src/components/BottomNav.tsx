import React, { useState, useEffect } from "react";
import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  Home,
  Wrench,
  Search,
  ShoppingBag,
  UserCheck,
  PhoneCall,
  MessageCircle,
  MapPin,
  X,
  Clock,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Lock,
} from "lucide-react";
import { fetchAppConfig, subscribeToAppConfig, type AppConfig, DEFAULT_APP_CONFIG } from "@/services/appConfigService";
import { LabToolsHub } from "@/components/tools/LabToolsHub";
import { RepairTrackerModal } from "@/components/repair/RepairTrackerModal";
import { SmartAuthDrawer } from "@/components/auth/SmartAuthDrawer";

export const BottomNav: React.FC = () => {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [config, setConfig] = useState<AppConfig>(DEFAULT_APP_CONFIG);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [trackOpen, setTrackOpen] = useState(false);
  const [vipOpen, setVipOpen] = useState(false);
  const [authDrawerOpen, setAuthDrawerOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    fetchAppConfig().then(setConfig);
    const unsub = subscribeToAppConfig(setConfig);
    return unsub;
  }, []);

  useEffect(() => {
    const onChatToggle = (e: Event) => {
      const customEvent = e as CustomEvent<{ open: boolean }>;
      if (customEvent.detail !== undefined) {
        setChatOpen(!!customEvent.detail.open);
      }
    };
    window.addEventListener("st:chat-toggle", onChatToggle);
    return () => window.removeEventListener("st:chat-toggle", onChatToggle);
  }, []);

  // Hide on admin routes, homepage (MobileAppShell handles its own native bottom bar), or when AI chat is open
  if (pathname.startsWith("/admin") || chatOpen || pathname === "/" || pathname === "") {
    return null;
  }

  const isHomeActive = pathname === "/" || pathname === "";
  const isShopActive = pathname.startsWith("/services");

  return (
    <>
      <nav
        aria-label="Mobile Bottom App Navigation"
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden h-16 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/80 px-2 flex items-center justify-around pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(0,0,0,0.8)]"
      >
        {/* 1. Home */}
        <Link
          to="/"
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all active:scale-95 ${
            isHomeActive ? "text-cyan-400" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <div className="relative">
            <Home className="h-5 w-5" />
            {isHomeActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
            )}
          </div>
          <span className="text-[10px] font-semibold tracking-tight mt-0.5">Home</span>
        </Link>

        {/* 2. Lab Tools */}
        <button
          type="button"
          onClick={() => setToolsOpen(true)}
          className="flex flex-col items-center justify-center flex-1 py-1 text-slate-400 hover:text-cyan-300 transition-all active:scale-95"
        >
          <div className="relative">
            <Wrench className="h-5 w-5 text-cyan-400" />
            <span className="absolute -top-0.5 -right-0.5 flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-400" />
            </span>
          </div>
          <span className="text-[10px] font-semibold tracking-tight mt-0.5 text-cyan-400">Lab Tools</span>
        </button>

        {/* 3. Track */}
        <button
          type="button"
          onClick={() => setTrackOpen(true)}
          className="flex flex-col items-center justify-center flex-1 py-1 text-slate-400 hover:text-amber-300 transition-all active:scale-95"
        >
          <div className="relative">
            <Search className="h-5 w-5 text-amber-400" />
          </div>
          <span className="text-[10px] font-semibold tracking-tight mt-0.5 text-amber-400">Track</span>
        </button>

        {/* 4. Shop / Parts (Hidden if disabled in Admin) */}
        {(config || DEFAULT_APP_CONFIG)?.shop_accessories_enabled !== false && (
          <Link
            to="/services"
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all active:scale-95 ${
              isShopActive ? "text-cyan-400" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <div className="relative">
              <ShoppingBag className="h-5 w-5 text-emerald-400" />
              {isShopActive && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
              )}
            </div>
            <span className="text-[10px] font-semibold tracking-tight mt-0.5 text-emerald-400">Shop</span>
          </Link>
        )}

        {/* 5. Profile / VIP */}
        <button
          type="button"
          onClick={() => setVipOpen(true)}
          className="flex flex-col items-center justify-center flex-1 py-1 text-slate-400 hover:text-slate-200 transition-all active:scale-95"
        >
          <div className="relative">
            <UserCheck className="h-5 w-5 text-purple-400" />
          </div>
          <span className="text-[10px] font-semibold tracking-tight mt-0.5 text-purple-400">VIP Hub</span>
        </button>
      </nav>

      {/* Lab Tools Hub Modal */}
      <LabToolsHub isOpen={toolsOpen} onClose={() => setToolsOpen(false)} />

      {/* Live Repair Job Sheet Tracker */}
      <RepairTrackerModal isOpen={trackOpen} onClose={() => setTrackOpen(false)} />

      {/* VIP & Warranty Vault Drawer */}
      {vipOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex flex-col justify-end bg-black/80 backdrop-blur-sm md:hidden animate-in fade-in"
          onClick={() => setVipOpen(false)}
        >
          <div
            className="w-full bg-slate-950 border-t border-slate-800 rounded-t-3xl p-5 pb-9 space-y-4 shadow-2xl text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center">
              <div className="w-10 h-1 bg-slate-700 rounded-full mb-3" />
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
                    <UserCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">Super Telecom VIP Hub</h3>
                    <p className="text-[11px] text-slate-400">Warranty Vault &amp; Direct Engineer Line</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setVipOpen(false)}
                  className="p-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Quick Actions inside VIP Hub */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setVipOpen(false);
                  setAuthDrawerOpen(true);
                }}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-between shadow-lg shadow-purple-500/20 active:scale-98 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <Lock className="h-4 w-4" />
                  <span>VIP Customer Sign-In (Claim Warranty / Invoices)</span>
                </div>
                <ChevronRight className="h-4 w-4" />
              </button>

              <a
                href="tel:+918002903643"
                className="w-full py-3 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-between shadow-lg shadow-emerald-500/20 active:scale-98 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <PhoneCall className="h-4 w-4 fill-slate-950" />
                  <span>Call Master Engineer (+91 80029 03643)</span>
                </div>
                <ChevronRight className="h-4 w-4" />
              </a>

              <a
                href="https://wa.me/918002903643?text=Hi%20Super%20Telecom,%20I%20want%20to%20verify%20my%20repair%20warranty"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-2xl bg-slate-900 border border-cyan-500/30 text-cyan-300 font-semibold text-xs flex items-center justify-between active:scale-98 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <MessageCircle className="h-4 w-4 text-cyan-400" />
                  <span>WhatsApp Warranty Support</span>
                </div>
                <ChevronRight className="h-4 w-4" />
              </a>

              <a
                href="https://maps.app.goo.gl/mu5XXCehEpocaZWY9"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 font-semibold text-xs flex items-center justify-between active:scale-98 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <MapPin className="h-4 w-4 text-amber-400" />
                  <span>Google Maps: Barganda Road Shop</span>
                </div>
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Clock className="h-3.5 w-3.5" /> Open Today: 10:00 AM – 9:30 PM
              </span>
              <span className="flex items-center gap-1 text-cyan-300">
                <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" /> Verified Lab
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Smart Lazy Auth Drawer */}
      <SmartAuthDrawer
        isOpen={authDrawerOpen}
        onClose={() => setAuthDrawerOpen(false)}
        actionTitle="VIP Warranty & Digital Invoice Vault"
      />
    </>
  );
};

export default BottomNav;
