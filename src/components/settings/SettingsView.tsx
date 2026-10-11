import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { useHardwarePermissions } from "@/hooks/useHardwarePermissions";
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

  const [isClearing, setIsClearing] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (typeof document !== "undefined") {
      setIsDark(document.documentElement.classList.contains("dark"));
    }
  }, []);

  const toggleTheme = () => {
    triggerVibration(40);
    const next = !isDark;
    setIsDark(next);
    if (typeof document !== "undefined") {
      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("st-theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("st-theme", "light");
      }
    }
    toast.success(next ? "Dark AMOLED mode activated" : "Clean Light mode activated");
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
    <div className="w-full max-w-xl mx-auto space-y-5 pb-24 text-slate-100 select-none">
      {/* VIP Priority Pass Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/20 via-slate-900 to-slate-950 border border-amber-500/40 p-5 shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 text-slate-950 shadow-md">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-wider font-extrabold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-500/40">
                  Priority Pass Active
                </span>
              </div>
              <h3 className="text-base font-black text-white mt-1">
                VIP #ST-GOLD LAB MEMBER
              </h3>
            </div>
          </div>
          <span className="text-xs font-mono text-amber-300 font-bold">EST. 2016</span>
        </div>

        <div className="mt-4 pt-3 border-t border-amber-500/20 grid grid-cols-2 gap-2 text-[11px] text-slate-300">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" />
            <span>Zero Waiting Queue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" />
            <span>OEM Parts Guarantee</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" />
            <span>Free Diagnostic Audit</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" />
            <span>Direct WhatsApp Line</span>
          </div>
        </div>
      </div>

      {/* 1. Hardware Permissions Health Center */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-5 w-5 text-cyan-400" />
            <h4 className="text-sm font-bold text-white tracking-tight">
              Hardware Permissions Center
            </h4>
          </div>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-800">
            Real-Time
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Manage native Web APIs required for speaker ultrasonic ejection, screen testing, and anti-theft sensors.
        </p>

        <div className="space-y-2">
          {/* Audio */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Volume2 className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Audio Oscillator (165Hz)</span>
                <span className="text-[10px] text-slate-400 block">Drives speaker moisture expulsion</span>
              </div>
            </div>
            {permissions.audio === "granted" ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[11px] font-mono font-bold">
                <CheckCircle2 className="h-3 w-3" /> Granted
              </span>
            ) : (
              <button
                type="button"
                onClick={requestAudioPermission}
                className="px-3 py-1 rounded-full bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-slate-950 text-[11px] font-bold shadow-sm"
              >
                Grant ⚡
              </button>
            )}
          </div>

          {/* WakeLock */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Smartphone className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Screen WakeLock API</span>
                <span className="text-[10px] text-slate-400 block">Prevents display sleep during tests</span>
              </div>
            </div>
            {permissions.wakeLock === "granted" ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[11px] font-mono font-bold">
                <CheckCircle2 className="h-3 w-3" /> Active
              </span>
            ) : permissions.wakeLock === "unsupported" ? (
              <span className="text-[11px] font-mono text-slate-500">Unsupported</span>
            ) : (
              <button
                type="button"
                onClick={requestWakeLockPermission}
                className="px-3 py-1 rounded-full bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-slate-950 text-[11px] font-bold shadow-sm"
              >
                Enable
              </button>
            )}
          </div>

          {/* Vibration */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Zap className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Haptic Vibration Motor</span>
                <span className="text-[10px] text-slate-400 block">Mechanical dislodging shockwave</span>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[11px] font-mono font-bold">
              <CheckCircle2 className="h-3 w-3" /> Ready
            </span>
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Bell className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Push Notifications</span>
                <span className="text-[10px] text-slate-400 block">Battery limit & repair stage alerts</span>
              </div>
            </div>
            {permissions.notifications === "granted" ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[11px] font-mono font-bold">
                <CheckCircle2 className="h-3 w-3" /> Enabled
              </span>
            ) : permissions.notifications === "denied" ? (
              <span className="text-[11px] font-mono text-rose-400">Blocked</span>
            ) : (
              <button
                type="button"
                onClick={requestNotificationPermission}
                className="px-3 py-1 rounded-full bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-slate-950 text-[11px] font-bold shadow-sm"
              >
                Enable
              </button>
            )}
          </div>

          {/* Sensors */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Activity className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Motion Accelerometer</span>
                <span className="text-[10px] text-slate-400 block">Anti-theft pickup and movement alarm</span>
              </div>
            </div>
            {permissions.sensors === "granted" ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[11px] font-mono font-bold">
                <CheckCircle2 className="h-3 w-3" /> Active
              </span>
            ) : (
              <button
                type="button"
                onClick={requestSensorsPermission}
                className="px-3 py-1 rounded-full bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-slate-950 text-[11px] font-bold shadow-sm"
              >
                Allow
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Appearance & UI Mode */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-5 space-y-3 shadow-xl">
        <h4 className="text-sm font-bold text-white tracking-tight">Appearance & Theme</h4>
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </div>
            <div>
              <span className="text-xs font-bold text-white block">
                {isDark ? "AMOLED Pure Black" : "Clean Slate Light"}
              </span>
              <span className="text-[10px] text-slate-400 block">
                Optimized for OLED battery conservation
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 active:scale-95 text-xs font-semibold text-cyan-300 border border-cyan-500/20 transition-all"
          >
            Switch Mode
          </button>
        </div>
      </div>

      {/* 3. App Storage & Performance */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-5 space-y-3 shadow-xl">
        <h4 className="text-sm font-bold text-white tracking-tight">App Performance & Cache</h4>
        <p className="text-xs text-slate-400 leading-relaxed">
          Wipe cached assets, reload latest lab tools, and unregister old service workers without reinstalling the application.
        </p>

        <button
          type="button"
          onClick={handleClearCache}
          disabled={isClearing}
          className="w-full py-3 px-4 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 active:scale-95 border border-rose-500/30 text-rose-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
        >
          <Trash2 className="h-4 w-4" />
          <span>{isClearing ? "Clearing & Reloading..." : "Refresh & Clear Local Cache"}</span>
        </button>
      </div>

      {/* 4. Lab Location & Engineer Desk */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-5 space-y-2 text-xs text-slate-400 shadow-xl">
        <div className="flex items-center gap-2 text-white font-bold">
          <MapPin className="h-4 w-4 text-cyan-400" />
          <span>Super Telecom Physical Lab</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          Barganda Road, Near Shivam Clinic, Giridih, Jharkhand 815301<br />
          Mon - Sun: 10:00 AM – 9:30 PM • Chip Engineer: Mayank / Team
        </p>
        <div className="pt-2 flex gap-2">
          <a
            href="tel:+918002903643"
            className="flex-1 py-2 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-center font-bold text-[11px] flex items-center justify-center gap-1.5 active:scale-95"
          >
            <PhoneCall className="h-3.5 w-3.5" /> Call Lab
          </a>
          <a
            href="https://maps.app.goo.gl/mu5XXCehEpocaZWY9"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2 px-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-center font-bold text-[11px] flex items-center justify-center gap-1.5 active:scale-95"
          >
            <ExternalLink className="h-3.5 w-3.5" /> View on Google Maps
          </a>
        </div>
      </div>
    </div>
  );
};
