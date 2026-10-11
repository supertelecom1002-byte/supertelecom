import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  Volume2,
  Smartphone,
  Zap,
  Bell,
  Activity,
  Trash2,
  RefreshCw,
  Moon,
  Sun,
  Award,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  PhoneCall,
  MapPin,
  Lock,
  FileText,
  Sparkles,
} from "lucide-react";
import { useHardwarePermissions } from "@/hooks/useHardwarePermissions";
import { useTheme } from "@/context/ThemeContext";
import { useAppUpdate } from "@/hooks/useAppUpdate";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { useLauncher } from "@/context/LauncherContext";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

interface SettingsViewProps {
  onClose?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onClose }) => {
  const {
    permissions,
    requestAudioPermission,
    requestWakeLockPermission,
    requestNotificationPermission,
    requestSensorsPermission,
    triggerVibration,
  } = useHardwarePermissions();

  const { theme, isDark, toggleTheme } = useTheme();
  const { isUpdateAvailable, isChecking, applyUpdate, manualCheckForUpdate } = useAppUpdate();
  const { user, isVip, loading: authLoading, signInWithGoogle, signOut, openVipModal } = useCustomerAuth();
  const { isCyberOsActive, toggleCyberOs } = useLauncher();
  const [isClearing, setIsClearing] = useState(false);

  const displayName =
    (user as any)?.name ||
    (user as any)?.user_metadata?.full_name ||
    (user as any)?.email?.split("@")[0] ||
    "VIP Member";
  const displayEmail = (user as any)?.email || "Google Verified";
  const avatarUrl =
    (user as any)?.avatarUrl ||
    (user as any)?.user_metadata?.avatar_url ||
    null;

  const handleToggleTheme = () => {
    triggerVibration(30);
    toggleTheme();
    toast.success(!isDark ? "AMOLED Dark Mode activated" : "Clean Light Mode activated");
  };

  const handleClearCache = async () => {
    triggerVibration([50, 50, 100]);
    setIsClearing(true);
    try {
      if (typeof window !== "undefined" && "caches" in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      }

      if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const reg of registrations) {
          await reg.unregister();
        }
      }

      toast.success("Cache and service worker wiped. Reloading app...");
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fully clear cache");
      setIsClearing(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-4 pb-24 text-slate-900 dark:text-slate-100 select-none">
      {/* Dynamic VIP Customer / Google Auth Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/10 via-slate-50 to-white dark:from-amber-500/20 dark:via-slate-900 dark:to-slate-950 border border-amber-500/40 p-5 shadow-sm dark:shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {isVip && avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-12 h-12 rounded-2xl border-2 border-amber-400 object-cover shadow-md"
              />
            ) : (
              <div className="p-3 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 text-slate-950 shadow-md">
                <Award className="h-6 w-6" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-wider font-extrabold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-500/40">
                  {isVip ? "VIP Member Verified" : "Priority Pass Ready"}
                </span>
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white mt-1">
                {isVip ? displayName : "VIP #ST-GOLD LAB PASS"}
              </h3>
              {isVip && (
                <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate">
                  {displayEmail}
                </p>
              )}
            </div>
          </div>
          <span className="text-xs font-mono text-amber-600 dark:text-amber-300 font-bold">EST. 2016</span>
        </div>

        <div className="mt-4 pt-3 border-t border-amber-500/20 grid grid-cols-2 gap-2 text-[11px] text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400 shrink-0" />
            <span>Zero Waiting Queue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400 shrink-0" />
            <span>OEM Parts Guarantee</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400 shrink-0" />
            <span>Free Diagnostic Audit</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400 shrink-0" />
            <span>Direct WhatsApp Line</span>
          </div>
        </div>

        {/* Action Button: Google Sign-In or Sign Out */}
        <div className="mt-4 pt-3 border-t border-amber-500/20">
          {isVip ? (
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={openVipModal}
                className="px-3.5 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs active:scale-95 transition-all shadow-sm"
              >
                View VIP Perks Details
              </button>
              <button
                type="button"
                onClick={signOut}
                disabled={authLoading}
                className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-rose-500 font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={signInWithGoogle}
              disabled={authLoading}
              className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-50 active:scale-[0.97] transition-all text-slate-900 border border-slate-300 dark:border-slate-200 shadow-md font-bold text-xs flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
              <span>{authLoading ? "Authenticating..." : "1-Click Connect Google for VIP Pass"}</span>
            </button>
          )}
        </div>
      </div>

      {/* 1. Appearance & UI Mode Toggle */}
      <div className="rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-5 space-y-3 shadow-sm dark:shadow-xl">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">Appearance &amp; Theme</h4>
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
              {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4 text-amber-500" />}
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                {isDark ? "AMOLED Pure Black Mode" : "Clean Porcelain Light Mode"}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                {isDark ? "Maximum OLED battery power conservation" : "High daylight contrast and paper-like clarity"}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleToggleTheme}
            className="px-3.5 py-2 rounded-xl bg-cyan-600 dark:bg-cyan-500 hover:bg-cyan-500 dark:hover:bg-cyan-400 active:scale-95 text-xs font-bold text-white dark:text-slate-950 transition-all shadow-sm"
          >
            {isDark ? "Switch to Light" : "Switch to Dark"}
          </button>
        </div>
      </div>

      {/* 2. Cyber-OS Full-Screen Workspace Toggle */}
      <div className="rounded-3xl bg-gradient-to-br from-cyan-950/20 via-slate-50 to-white dark:from-cyan-950/30 dark:via-slate-900/90 dark:to-slate-950 border border-cyan-500/40 p-5 space-y-3 shadow-sm dark:shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
                ⚡ Super Telecom Cyber-OS Workspace
              </h4>
              <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 font-bold">
                Optional &bull; Pure AMOLED &bull; Ultra Performance
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Transform your phone into a futuristic Cyber-Lab desktop with live hardware telemetry, interactive CPU gauges, 1-tap turbo boost, and tactile native widgets.
        </p>

        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
          <div className="leading-tight">
            <span className="text-xs font-bold text-slate-900 dark:text-white block">
              {isCyberOsActive ? "Cyber-OS Workspace Active" : "Standard Mobile View Active"}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">
              {isCyberOsActive ? "Tactile desktop launcher loaded" : "Classic tab navigation"}
            </span>
          </div>

          <button
            type="button"
            onClick={toggleCyberOs}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-sm ${
              isCyberOsActive
                ? "bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/40 hover:bg-rose-500/30"
                : "bg-cyan-600 dark:bg-cyan-500 hover:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 font-black shadow-cyan-500/20"
            }`}
          >
            {isCyberOsActive ? "Exit Cyber-OS" : "Enable Cyber-OS Experience"}
          </button>
        </div>
      </div>

      {/* 2. Hardware Permissions Health Center */}
      <div className="rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-sm dark:shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
              Hardware Permissions Center
            </h4>
          </div>
          <span className="text-[10px] font-mono text-cyan-700 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-300 dark:border-cyan-800">
            Real-Time
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Manage native Web APIs required for speaker ultrasonic ejection, screen testing, audio loopback, and anti-theft sensors.
        </p>

        <div className="space-y-2">
          {/* Audio */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                <Volume2 className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">Audio Oscillator (165Hz)</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Drives speaker moisture expulsion</span>
              </div>
            </div>
            {permissions.audio === "granted" ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30 text-[11px] font-mono font-bold">
                <CheckCircle2 className="h-3 w-3" /> Granted
              </span>
            ) : (
              <button
                type="button"
                onClick={requestAudioPermission}
                className="px-3 py-1 rounded-full bg-cyan-600 dark:bg-cyan-500 text-white dark:text-slate-950 text-[11px] font-bold shadow-sm"
              >
                Grant ⚡
              </button>
            )}
          </div>

          {/* WakeLock */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                <Smartphone className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">Screen WakeLock API</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Prevents display sleep during tests</span>
              </div>
            </div>
            {permissions.wakeLock === "granted" ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30 text-[11px] font-mono font-bold">
                <CheckCircle2 className="h-3 w-3" /> Active
              </span>
            ) : permissions.wakeLock === "unsupported" ? (
              <span className="text-[11px] font-mono text-slate-400">Unsupported</span>
            ) : (
              <button
                type="button"
                onClick={requestWakeLockPermission}
                className="px-3 py-1 rounded-full bg-cyan-600 dark:bg-cyan-500 text-white dark:text-slate-950 text-[11px] font-bold shadow-sm"
              >
                Enable
              </button>
            )}
          </div>

          {/* Vibration */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                <Zap className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">Haptic Vibration Motor</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Mechanical dislodging shockwave</span>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30 text-[11px] font-mono font-bold">
              <CheckCircle2 className="h-3 w-3" /> Ready
            </span>
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                <Bell className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">Push Notifications</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Battery limit &amp; repair stage alerts</span>
              </div>
            </div>
            {permissions.notifications === "granted" ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30 text-[11px] font-mono font-bold">
                <CheckCircle2 className="h-3 w-3" /> Enabled
              </span>
            ) : permissions.notifications === "denied" ? (
              <span className="text-[11px] font-mono text-rose-600 dark:text-rose-400">Blocked</span>
            ) : (
              <button
                type="button"
                onClick={requestNotificationPermission}
                className="px-3 py-1 rounded-full bg-cyan-600 dark:bg-cyan-500 text-white dark:text-slate-950 text-[11px] font-bold shadow-sm"
              >
                Enable
              </button>
            )}
          </div>

          {/* Sensors */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                <Activity className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">Motion Accelerometer</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Anti-theft pickup and movement alarm</span>
              </div>
            </div>
            {permissions.sensors === "granted" ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30 text-[11px] font-mono font-bold">
                <CheckCircle2 className="h-3 w-3" /> Active
              </span>
            ) : (
              <button
                type="button"
                onClick={requestSensorsPermission}
                className="px-3 py-1 rounded-full bg-cyan-600 dark:bg-cyan-500 text-white dark:text-slate-950 text-[11px] font-bold shadow-sm"
              >
                Allow
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Legal, Compliance & Warranty */}
      <div className="rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-5 space-y-3 shadow-sm dark:shadow-xl">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
          <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">Legal, Policies &amp; Warranty</h4>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Official store terms, customer privacy guarantees, and hardware warranty boundaries.
        </p>

        <div className="space-y-2 pt-1 text-xs">
          <Link
            to="/privacy"
            onClick={onClose}
            className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 text-slate-900 dark:text-white font-medium transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Lock className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
              <div>
                <span className="font-bold block">Privacy Policy</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Zero data storage &amp; hardware permissions disclosure</span>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
          </Link>

          <Link
            to="/terms"
            onClick={onClose}
            className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 text-slate-900 dark:text-white font-medium transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <FileText className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <div>
                <span className="font-bold block">Terms of Service</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Liability limits, data backup &amp; 45-day pickup policy</span>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
          </Link>

          <Link
            to="/warranty"
            onClick={onClose}
            className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 text-slate-900 dark:text-white font-medium transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Award className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <div>
                <span className="font-bold block">90-Day Lab Warranty</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Screen, battery &amp; IC repair coverage terms</span>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
          </Link>

          <Link
            to="/about"
            onClick={onClose}
            className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 text-slate-900 dark:text-white font-medium transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <div>
                <span className="font-bold block">About Super Telecom</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Founded 2016 in Giridih &bull; Lab equipment &amp; team</span>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
          </Link>
        </div>
      </div>

      {/* 4. App Storage & Performance */}
      <div className="rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-5 space-y-3 shadow-sm dark:shadow-xl">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">Offline Cache &amp; System Updates</h4>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Check for new lab software releases, wipe stale cached assets, and manage offline service worker state.
        </p>

        {isUpdateAvailable && (
          <div className="p-3.5 rounded-2xl bg-cyan-100 dark:bg-cyan-950/80 border border-cyan-300 dark:border-cyan-500/50 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-cyan-600 dark:text-cyan-400 animate-pulse" />
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">Release v3.2 Waiting</span>
                <span className="text-[10px] text-cyan-800 dark:text-cyan-300">Ready to activate immediately.</span>
              </div>
            </div>
            <button
              type="button"
              onClick={applyUpdate}
              className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs active:scale-95 transition-transform cursor-pointer"
            >
              Update Now
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={manualCheckForUpdate}
            disabled={isChecking}
            className="py-2.5 px-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isChecking ? "animate-spin text-cyan-500" : ""}`} />
            <span>{isChecking ? "Checking..." : "Check Updates"}</span>
          </button>

          <button
            type="button"
            onClick={handleClearCache}
            disabled={isClearing}
            className="py-2.5 px-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 active:scale-95 border border-rose-500/30 text-rose-600 dark:text-rose-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>{isClearing ? "Clearing..." : "Clear Cache"}</span>
          </button>
        </div>
      </div>

      {/* 4. Lab Location & Engineer Desk */}
      <div className="rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-5 space-y-2 text-xs text-slate-600 dark:text-slate-400 shadow-sm dark:shadow-xl">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
          <MapPin className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
          <span>Super Telecom Physical Lab</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          Barganda Road, Near Shivam Clinic, Giridih, Jharkhand 815301<br />
          Mon - Sun: 10:00 AM – 9:30 PM &bull; Chip Engineer: Mayank / Team
        </p>
        <div className="pt-2 flex gap-2">
          <a
            href="tel:+918002903643"
            className="flex-1 py-2 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-center font-bold text-[11px] flex items-center justify-center gap-1.5 active:scale-95"
          >
            <PhoneCall className="h-3.5 w-3.5" /> Call Lab
          </a>
          <a
            href="https://maps.app.goo.gl/mu5XXCehEpocaZWY9"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-center font-bold text-[11px] flex items-center justify-center gap-1.5 active:scale-95"
          >
            <ExternalLink className="h-3.5 w-3.5" /> Google Maps
          </a>
        </div>
      </div>
    </div>
  );
};
