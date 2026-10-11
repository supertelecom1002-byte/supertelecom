import React, { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Clock,
  Phone,
  MessageCircle,
  MapPin,
  ArrowRight,
  Menu,
  X,
  Smartphone,
  Battery,
  Cpu,
  Droplet,
  ShieldCheck,
  Wrench,
  Search,
  Download,
  Zap,
  RefreshCw,
  Sparkles,
  Award,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { useAppUpdate } from "@/hooks/useAppUpdate";
import { useIsStandalone } from "@/hooks/useIsStandalone";
import {
  subscribeToAppConfig,
  isLabOpenNow,
  type AppConfig,
  DEFAULT_APP_CONFIG,
} from "@/services/appConfigService";
import { LabToolsHub } from "@/components/tools/LabToolsHub";

interface HeaderProps {
  isHomePage?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isHomePage = false }) => {
  const [open, setOpen] = useState(false);
  const isStandalone = useIsStandalone();
  const [toolsHubOpen, setToolsHubOpen] = useState(false);
  const [appConfig, setAppConfig] = useState<AppConfig>(DEFAULT_APP_CONFIG);
  const { isChecking, manualCheckForUpdate } = useAppUpdate();
  const { user, isVip, openVipModal } = useCustomerAuth();

  const customerDisplayName =
    (user as any)?.name ||
    (user as any)?.user_metadata?.full_name ||
    (user as any)?.email?.split("@")[0] ||
    "VIP";
  const customerAvatarUrl =
    (user as any)?.avatarUrl ||
    (user as any)?.user_metadata?.avatar_url ||
    null;

  useEffect(() => {
    const unsub = subscribeToAppConfig(setAppConfig);
    return unsub;
  }, []);

  // Close drawer on Esc key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const labStatus = isLabOpenNow(appConfig?.lab_status_override || "auto");

  const navLinks: Array<{ label: string; to: string }> = [
    { label: "Services", to: isHomePage ? "#services" : "/services" },
    { label: "iPhone Lab", to: "/services/iphone-repair" },
    { label: "Chip-Level / IC", to: "/services/motherboard-repair" },
    { label: "Pricing Matrix", to: isHomePage ? "#pricing-matrix" : "/pricing" },
    { label: "Track Repair", to: isHomePage ? "#contact" : "/services" },
    { label: "Contact", to: isHomePage ? "#contact" : "/#contact" },
  ];

  const PHONE = "+918002903643";
  const WHATSAPP = "918002903643";

  return (
    <header className="w-full select-none md:select-auto">
      {/* ========================================================= */}
      {/* 1. DESKTOP TOP ANNOUNCEMENT STRIP (Hidden on Mobile)      */}
      {/* ========================================================= */}
      <div className="hidden md:flex w-full bg-slate-100 dark:bg-gradient-to-r dark:from-cyan-950/80 dark:via-slate-900/90 dark:to-cyan-950/80 border-b border-slate-200 dark:border-cyan-500/30 px-4 py-1.5 items-center justify-between text-xs backdrop-blur-md z-50">
        <div className="flex items-center gap-2 min-w-0 overflow-hidden">
          <span className="relative flex h-2 w-2 flex-none">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${labStatus.isOpen ? "bg-emerald-400" : "bg-rose-400"} opacity-75`} />
            <span className={`relative inline-flex rounded-full h-2 w-2 ${labStatus.isOpen ? "bg-emerald-500" : "bg-rose-500"}`} />
          </span>
          <div className="flex items-center gap-1.5 min-w-0 overflow-hidden text-[11px] sm:text-xs font-medium tracking-wide text-slate-700 dark:text-cyan-200">
            <Zap className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400 fill-amber-500 dark:fill-amber-400 shrink-0" />
            <span className="truncate">
              Super Telecom Official App • 50%+ Extra Smooth Experience
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-none pl-2">
          <span className="inline-flex items-center gap-1.5 text-slate-600 dark:text-cyan-400/90 font-mono text-[11px]">
            <Clock className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
            <span>Mon-Sun: 10:00 AM – 9:30 PM (Barganda Road)</span>
          </span>
          {!isStandalone && (
            <Link
              to="/download"
              className="inline-flex items-center gap-1.5 bg-cyan-600 dark:bg-cyan-500 hover:bg-cyan-500 dark:hover:bg-cyan-400 active:scale-95 text-white dark:text-slate-950 font-bold px-3 py-1 rounded-lg text-[11px] shadow-sm shadow-cyan-500/20 transition-all cursor-pointer whitespace-nowrap"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download App</span>
            </Link>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. DESKTOP VIEW (hidden md:flex) - Sleek Glassmorphic Bar */}
      {/* ========================================================= */}
      <nav
        aria-label="Desktop Navigation"
        className="hidden md:flex h-[68px] sticky top-0 z-50 w-full backdrop-blur-xl bg-white/90 dark:bg-slate-950/85 border-b border-slate-200 dark:border-slate-800/80 transition-all duration-300 items-center"
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Left: Brand Monogram + Title + Live Status */}
          <div className="flex items-center gap-3.5 flex-none">
            <Link to="/" className="flex items-center gap-2.5 group">
              <img
                src="/icon-192.png"
                alt="Super Telecom Official Logo"
                className="w-9 h-9 object-contain rounded-xl shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform"
                onError={(e) => {
                  e.currentTarget.src = "/logo.png";
                }}
              />
              <div className="leading-tight">
                <span className="text-sm font-black tracking-tight text-slate-900 dark:text-white block">
                  SUPER TELECOM
                </span>
                <span className="text-[10px] text-cyan-700 dark:text-cyan-400 font-bold block">
                  LAB & CHIP REPAIR
                </span>
              </div>
            </Link>

            {/* Top Live Status */}
            <div className="hidden lg:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-700 dark:text-slate-300">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${labStatus.isOpen ? "bg-emerald-400" : "bg-rose-400"} opacity-75`} />
                <span className={`relative inline-flex rounded-full h-2 w-2 ${labStatus.isOpen ? "bg-emerald-500" : "bg-rose-500"}`} />
              </span>
              <span className={`font-bold ${labStatus.isOpen ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>{labStatus.statusText}</span>
              <span className="text-slate-400 dark:text-slate-600">•</span>
              <span>{labStatus.subText}</span>
            </div>
          </div>

          {/* Center: Desktop Navigation Links */}
          <div className="flex items-center gap-1">
            {navLinks.map((link) =>
              link.onClick ? (
                <button
                  key={link.label}
                  type="button"
                  onClick={link.onClick}
                  className="rounded-full px-3 py-1.5 text-xs font-semibold text-cyan-700 dark:text-cyan-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors flex items-center gap-1"
                >
                  <Sparkles className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                  <span>{link.label}</span>
                </button>
              ) : link.to?.startsWith("#") ? (
                <a
                  key={link.label}
                  href={link.to}
                  className="rounded-full px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.to!}
                  className="rounded-full px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* Right: VIP Account / Google Auth + Theme Toggle + Priority Repair Button */}
          <div className="flex items-center gap-2.5 flex-none">
            <button
              type="button"
              onClick={openVipModal}
              aria-label={isVip ? "View VIP Member Profile" : "1-Click VIP Google Sign In"}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold border transition-all active:scale-95 cursor-pointer ${
                isVip
                  ? "bg-amber-100 dark:bg-amber-950/80 border-amber-300 dark:border-amber-500/40 text-amber-800 dark:text-amber-400 shadow-xs"
                  : "bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {isVip && customerAvatarUrl ? (
                <img
                  src={customerAvatarUrl}
                  alt={customerDisplayName}
                  className="w-4 h-4 rounded-full object-cover border border-amber-400"
                />
              ) : isVip ? (
                <Award className="h-3.5 w-3.5 text-amber-500" />
              ) : (
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span className="font-mono text-[11px] font-bold">
                {isVip ? "VIP ⚡" : "Sign In"}
              </span>
            </button>

            <ThemeToggle />

            <a
              href={isHomePage ? "#contact" : "/#contact"}
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-brand px-4 py-2 text-xs font-bold text-primary-foreground shadow-brand transition-all hover:scale-[1.03] active:scale-95 whitespace-nowrap"
            >
              <span>Book Priority Repair</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </nav>

      {/* ========================================================= */}
      {/* 3. MOBILE VIEW (flex md:hidden) - Native Top App Bar      */}
      {/* Height strictly 50px - 54px with Zero Visual Bloat       */}
      {/* ========================================================= */}
      <nav
        aria-label="Mobile Native App Bar"
        className="flex md:hidden h-[52px] sticky top-0 z-50 w-full backdrop-blur-xl bg-slate-950/95 border-b border-slate-800/80 px-3 items-center justify-between"
      >
        {/* Left: Clean compact Super Telecom micro-logo + mini pulsing status dot */}
        <Link to="/" className="flex items-center gap-2 select-none">
          <img
            src="/icon-192.png"
            alt="Super Telecom Official Logo"
            className="w-7 h-7 object-contain rounded-lg shadow-sm drop-shadow-md active:scale-95 transition-transform"
            onError={(e) => {
              e.currentTarget.src = "/logo.png";
            }}
          />
          <div className="flex items-center gap-1.5">
            <div className="leading-tight">
              <span className="text-xs font-black text-white tracking-tight block">
                SUPER TELECOM
              </span>
              <span className="text-[9px] text-cyan-400 font-medium block">
                LAB & CHIP REPAIR
              </span>
            </div>
            <span className="relative flex h-1.5 w-1.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${labStatus.isOpen ? "bg-emerald-400" : "bg-rose-400"} opacity-75`} />
              <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${labStatus.isOpen ? "bg-emerald-500" : "bg-rose-500"}`} />
            </span>
          </div>
        </Link>

        {/* Right: Quick micro-actions (Direct Call icon + WhatsApp quick-connect + mini menu trigger) */}
        <div className="flex items-center gap-1.5">
          <a
            href={`tel:${PHONE}`}
            aria-label="Direct Call Engineer"
            className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center active:scale-90 transition-transform"
          >
            <Phone className="h-4 w-4" />
          </a>

          <a
            href={`https://wa.me/${WHATSAPP}?text=Hi%20Super%20Telecom,%20I%20need%20quick%20mobile%20repair%20help`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp Quick Connect"
            className="h-8 w-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center active:scale-90 transition-transform"
          >
            <MessageCircle className="h-4 w-4" />
          </a>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open navigation menu"
            className="h-8 w-8 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center active:scale-90 transition-transform"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </nav>

      {/* ========================================================= */}
      {/* 4. Mobile Slide-Over Drawer with Backdrop Blur            */}
      {/* ========================================================= */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity animate-in fade-in"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          <div className="fixed inset-y-0 right-0 w-[86%] max-w-sm bg-slate-950 border-l border-slate-800 p-5 flex flex-col justify-between shadow-2xl z-10 overflow-y-auto">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <img
                    src="/icon-192.png"
                    alt="Super Telecom Official Logo"
                    className="h-7 w-7 object-contain rounded-lg shadow-sm"
                    onError={(e) => {
                      e.currentTarget.src = "/logo.png";
                    }}
                  />
                  <div className="leading-tight">
                    <span className="font-bold text-xs text-white block">
                      Super Telecom
                    </span>
                    <span className="text-[10px] text-cyan-400 font-medium block">
                      LAB & CHIP REPAIR
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu drawer"
                  className="flex items-center justify-center h-8 w-8 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white active:scale-95 transition-all"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Express Lab Silos */}
              <div className="mt-4">
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold block mb-2">
                  Express Lab Silos (1-Tap)
                </span>
                <div className="grid grid-cols-1 gap-1.5">
                  {[
                    { title: "Screen & OLED Replacement", href: "/services/screen-replacement", icon: Smartphone },
                    { title: "iPhone Specialist Care", href: "/services/iphone-repair", icon: ShieldCheck },
                    { title: "Motherboard & IC Micro-Soldering", href: "/services/motherboard-repair", icon: Cpu },
                    { title: "Battery & Fast Charging Fix", href: "/services/battery-replacement", icon: Battery },
                    { title: "Water Damage Revival", href: "/services/water-damage-repair", icon: Droplet },
                  ].map((silo) => (
                    <Link
                      key={silo.href}
                      to={silo.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-semibold text-slate-200 hover:text-cyan-300 hover:border-cyan-500/40 active:scale-95 transition-all"
                    >
                      <silo.icon className="h-4 w-4 text-cyan-400 flex-none" />
                      <span className="truncate">{silo.title}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Navigation Sections */}
              <div className="mt-5 border-t border-slate-800/80 pt-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block mb-2">
                  Sections &amp; Pricing
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {navLinks.map((link) =>
                    link.onClick ? (
                      <button
                        key={link.label}
                        type="button"
                        onClick={() => {
                          setOpen(false);
                          link.onClick?.();
                        }}
                        className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/40 border border-slate-800/50 text-xs font-medium text-cyan-300 hover:text-white active:scale-95 transition-all text-left"
                      >
                        <span className="flex items-center gap-1">
                          <Sparkles className="h-3 w-3 text-cyan-400" />
                          {link.label}
                        </span>
                      </button>
                    ) : link.to?.startsWith("#") ? (
                      <a
                        key={link.label}
                        href={link.to}
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/40 border border-slate-800/50 text-xs font-medium text-slate-300 hover:text-white active:scale-95 transition-all"
                      >
                        <span>{link.label}</span>
                      </a>
                    ) : (
                      <Link
                        key={link.label}
                        to={link.to || "/"}
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/40 border border-slate-800/50 text-xs font-medium text-slate-300 hover:text-white active:scale-95 transition-all"
                      >
                        <span>{link.label}</span>
                      </Link>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Drawer Bottom Actions & App Update */}
            <div className="mt-5 pt-4 border-t border-slate-800 space-y-2.5">
              {!isStandalone && (
                <Link
                  to="/download"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 active:scale-95 transition-all"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Super Telecom App</span>
                </Link>
              )}

              {/* App Information Card */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-cyan-400" />
                    <span className="font-bold text-xs text-white">Super Telecom App</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">v2.4</span>
                </div>

                <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-medium">
                  <span className="relative flex h-1.5 w-1.5 flex-none">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                  </span>
                  <span>System Online &amp; Synchronized</span>
                </div>

                <button
                  type="button"
                  onClick={manualCheckForUpdate}
                  disabled={isChecking}
                  className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-750 active:scale-95 text-cyan-400 font-semibold text-[11px] flex items-center justify-center gap-1.5 border border-cyan-500/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isChecking ? "animate-spin" : ""}`} />
                  <span>{isChecking ? "Checking..." : "Check for Updates"}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`tel:${PHONE}`}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs active:scale-95 transition-all"
                >
                  <Phone className="h-3.5 w-3.5" /> Call Lab
                </a>
                <a
                  href={`https://wa.me/${WHATSAPP}?text=Hi%20Super%20Telecom,%20I%20need%20quick%20mobile%20repair%20help`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold text-xs active:scale-95 transition-all"
                >
                  <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                </a>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 pt-1 justify-center">
                <MapPin className="h-3 w-3 text-cyan-400 flex-none" />
                <span>Barganda Road, Giridih • Est. 2016</span>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Lab Tools Launchpad Modal */}
      <LabToolsHub
        isOpen={toolsHubOpen}
        onClose={() => setToolsHubOpen(false)}
      />
    </header>
  );
};

export default Header;
export { Header as Navbar };
