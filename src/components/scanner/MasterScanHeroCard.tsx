import React, { useState, useEffect } from "react";
import {
  Shield,
  ShieldCheck,
  Zap,
  Cpu,
  HardDrive,
  Activity,
  Sparkles,
  ArrowRight,
  Flame,
} from "lucide-react";
import { playScanRadarPing } from "./cyberAudio";

interface MasterScanHeroCardProps {
  onOpenScanner: () => void;
  className?: string;
}

export const MasterScanHeroCard: React.FC<MasterScanHeroCardProps> = ({
  onOpenScanner,
  className = "",
}) => {
  const [cpuCores, setCpuCores] = useState<number>(8);
  const [ramRating, setRamRating] = useState<string>("Monitored");
  const [cacheStatus, setCacheStatus] = useState<string>("Ready to Clean");

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (navigator.hardwareConcurrency) {
        setCpuCores(navigator.hardwareConcurrency);
      }
      const mem = (navigator as unknown as { deviceMemory?: number }).deviceMemory;
      if (mem) {
        setRamRating(`${mem}GB Monitored`);
      }
      if ("caches" in window) {
        window.caches
          .keys()
          .then((keys) => {
            if (keys.length > 0) {
              setCacheStatus(`${keys.length} Buckets Queued`);
            }
          })
          .catch(() => {});
      }
    }
  }, []);

  const handleLaunch = () => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate([40, 60, 40]);
      } catch {
        // ignore
      }
    }
    playScanRadarPing(920);
    onOpenScanner();
  };

  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-slate-900/90 dark:bg-[#030712]/95 border border-cyan-500/30 hover:border-cyan-400/60 shadow-xl shadow-cyan-950/20 backdrop-blur-2xl transition-all duration-300 p-4 ${className}`}
    >
      {/* Ambient Cyber Neon Background Glows */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-cyan-500/15 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

      {/* Top Badge */}
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/90 border border-cyan-500/40 text-[10px] font-mono font-bold text-cyan-300 tracking-tight shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
          </span>
          <span>🛡️ SUPER TELECOM LAB &bull; HARDWARE SHIELD</span>
        </div>

        <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
          PRO DIAGNOSTIC
        </span>
      </div>

      {/* Central Holographic Radar Ring Visual */}
      <div className="relative py-2 my-1 flex flex-col items-center justify-center text-center z-10">
        <div
          onClick={handleLaunch}
          className="relative cursor-pointer group active:scale-95 transition-transform"
          role="button"
          tabIndex={0}
          aria-label="Tap to run full hardware audit and clean"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") handleLaunch();
          }}
        >
          {/* Holographic Concentric Rings */}
          <div className="w-24 h-24 rounded-full border border-cyan-500/30 flex items-center justify-center relative bg-gradient-to-br from-slate-950 to-slate-900 shadow-inner">
            <div className="absolute inset-0 rounded-full border border-cyan-400/20 animate-ping opacity-25" />
            <div className="absolute inset-1.5 rounded-full border border-dashed border-cyan-400/40 animate-spin [animation-duration:10s]" />
            <div className="absolute inset-3 rounded-full border border-emerald-400/30 animate-pulse" />

            {/* Core Icon */}
            <div className="relative z-10 p-3 rounded-full bg-cyan-500/10 border border-cyan-400/50 group-hover:bg-cyan-500/20 transition-colors">
              <Zap className="h-6 w-6 text-cyan-400 fill-cyan-400/20 animate-pulse" />
            </div>
          </div>
        </div>

        <div className="mt-2 text-center">
          <h3 className="text-sm font-black text-white tracking-tight flex items-center justify-center gap-1.5">
            <span>360° Real Hardware Diagnostic</span>
          </h3>
          <p className="text-[11px] text-cyan-300/80 font-mono mt-0.5">
            Tap to run full hardware audit &amp; clean
          </p>
        </div>
      </div>

      {/* Stats Strip: Micro-counters */}
      <div className="grid grid-cols-3 gap-1.5 py-2 my-1 z-10 relative">
        <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
          <div className="flex items-center justify-center gap-1 text-[10px] font-mono text-slate-400">
            <Cpu className="h-3 w-3 text-cyan-400" />
            <span>CPU</span>
          </div>
          <span className="text-[11px] font-mono font-bold text-slate-100 block mt-0.5 truncate">
            {cpuCores} Cores Active
          </span>
        </div>

        <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
          <div className="flex items-center justify-center gap-1 text-[10px] font-mono text-slate-400">
            <Activity className="h-3 w-3 text-emerald-400" />
            <span>RAM</span>
          </div>
          <span className="text-[11px] font-mono font-bold text-slate-100 block mt-0.5 truncate">
            {ramRating}
          </span>
        </div>

        <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
          <div className="flex items-center justify-center gap-1 text-[10px] font-mono text-slate-400">
            <HardDrive className="h-3 w-3 text-amber-400" />
            <span>Cache</span>
          </div>
          <span className="text-[11px] font-mono font-bold text-amber-300 block mt-0.5 truncate">
            {cacheStatus}
          </span>
        </div>
      </div>

      {/* Big Primary Button */}
      <button
        type="button"
        onClick={handleLaunch}
        className="w-full mt-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-black text-xs sm:text-sm tracking-wide uppercase flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 active:scale-95 transition-all cursor-pointer z-10 relative"
      >
        <Zap className="h-4 w-4 fill-slate-950" />
        <span>🚀 RUN 360° DEVICE HEALTH SCAN</span>
      </button>
    </div>
  );
};
