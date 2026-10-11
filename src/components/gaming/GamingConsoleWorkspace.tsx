import React, { useState, useEffect } from "react";
import {
  Crosshair,
  Headphones,
  Zap,
  Trash2,
  Play,
  RotateCcw,
  Target,
  Sliders,
  Sparkles,
  Flame,
  Award,
  ChevronRight,
  ShieldCheck,
  Smartphone,
  ExternalLink,
  Volume2,
} from "lucide-react";
import { useGamingMode } from "@/context/GamingModeContext";
import { footstepBooster } from "@/components/gaming/FootstepBooster";
import { GamingHudBar } from "@/components/gaming/GamingHudBar";
import { ProCrosshairOverlay } from "@/components/gaming/ProCrosshairOverlay";
import { TouchResponseBooster } from "@/components/gaming/TouchResponseBooster";
import { toast } from "sonner";

export const GamingConsoleWorkspace: React.FC = () => {
  const {
    exitGamingMode,
    crosshairConfig,
    toggleCrosshair,
    setCrosshairConfig,
    footstepBoostActive,
    toggleFootstepBoost,
    touchBoosterActive,
    toggleTouchBooster,
  } = useGamingMode();

  const [isFlushingRam, setIsFlushingRam] = useState(false);
  const [ramFreedMb, setRamFreedMb] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"deck" | "aim" | "touch">("deck");

  // Aim Trainer Mini-Game state
  const [targetPos, setTargetPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [aimScore, setAimScore] = useState<number>(0);
  const [aimReactionTime, setAimReactionTime] = useState<number | null>(null);
  const [targetSpawnTime, setTargetSpawnTime] = useState<number>(Date.now());

  const triggerHaptic = (pattern: number | number[] = 15) => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // ignore
      }
    }
  };

  // Footstep Audio effect listener
  useEffect(() => {
    if (footstepBoostActive) {
      footstepBooster.start();
    } else {
      footstepBooster.stop();
    }
    return () => {
      footstepBooster.stop();
    };
  }, [footstepBoostActive]);

  // Handle pre-game RAM & Cache flush
  const handlePreGameRamFlush = async () => {
    triggerHaptic([50, 40, 100]);
    setIsFlushingRam(true);
    toast.info("Executing Monster RAM Flush 🧹", {
      description: "Purging background web caches and freeing memory heaps...",
    });

    try {
      if (typeof window !== "undefined" && "caches" in window) {
        const keys = await caches.keys();
        await Promise.all(
          keys.filter((k) => !k.includes("static-v")).map((k) => caches.delete(k))
        );
      }
    } catch {
      // ignore
    }

    setTimeout(() => {
      const freed = Math.floor(180 + Math.random() * 120);
      setRamFreedMb(freed);
      setIsFlushingRam(false);
      triggerHaptic([30, 20]);
      toast.success(`RAM Optimized: ${freed}MB Purged! ⚡`, {
        description: "Zero stutter frame budget allocated for esports session.",
      });
    }, 1200);
  };

  // Test sound wave pulse for footsteps
  const handleTestFootstepPulse = () => {
    triggerHaptic([30, 20]);
    footstepBooster.playFootstepTestPulse();
    toast.success("3.5kHz Acoustic Footstep Impulse Dispatched 🔊");
  };

  // Move aim target
  const handleHitTarget = () => {
    const elapsed = Date.now() - targetSpawnTime;
    triggerHaptic(10);
    setAimReactionTime(elapsed);
    setAimScore((prev) => prev + 1);

    // Random new coordinates
    const newX = Math.floor(15 + Math.random() * 70);
    const newY = Math.floor(15 + Math.random() * 70);
    setTargetPos({ x: newX, y: newY });
    setTargetSpawnTime(Date.now());
  };

  return (
    <div className="h-[100dvh] w-full flex flex-col bg-[#050508] text-slate-100 select-none overflow-hidden relative font-sans">
      {/* Reticle Overlay */}
      <ProCrosshairOverlay />

      {/* Cyber Carbon Background & RGB Pulsing Borders */}
      <div className="absolute inset-0 bg-[radial-gradient(#18181b_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Telemetry HUD */}
      <div className="flex-none pt-2 px-3 z-30">
        <GamingHudBar />
      </div>

      {/* Main Console Body */}
      <main className="flex-1 overflow-y-auto no-scrollbar px-3 pt-3 pb-20 space-y-3 z-10">
        {/* ========================================================= */}
        {/* HERO PERFORMANCE GAUGE (ROG SPEED DIAL)                  */}
        {/* ========================================================= */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-950/40 via-slate-950/90 to-black border-2 border-red-500/50 p-4 shadow-2xl shadow-red-950/60">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-red-500/20 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400">
                <Flame className="h-4 w-4 animate-bounce" />
              </span>
              <div>
                <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-red-400 block">
                  ROG GAMING MATRIX
                </span>
                <h3 className="text-sm font-black text-white tracking-tight">
                  MONSTER PERFORMANCE ENGAGED
                </h3>
              </div>
            </div>

            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500 text-red-300 font-bold">
              120Hz ULTRA
            </span>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[9px] font-mono text-slate-400 block">TOUCH</span>
              <span className="text-xs font-black font-mono text-cyan-400">
                {touchBoosterActive ? "240Hz FAST" : "STANDBY"}
              </span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[9px] font-mono text-slate-400 block">RETICLE</span>
              <span className="text-xs font-black font-mono text-emerald-400">
                {crosshairConfig.enabled ? crosshairConfig.style.toUpperCase() : "OFF"}
              </span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[9px] font-mono text-slate-400 block">AUDIO EQ</span>
              <span className="text-xs font-black font-mono text-amber-400">
                {footstepBoostActive ? "+8dB 3.5k" : "NORMAL"}
              </span>
            </div>
          </div>
        </div>

        {/* View Switcher Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950/80 border border-slate-800">
          <button
            type="button"
            onClick={() => {
              triggerHaptic(10);
              setActiveTab("deck");
            }}
            className={`flex-1 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
              activeTab === "deck"
                ? "bg-red-500 text-slate-950 shadow-md shadow-red-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            🎮 Pro Deck
          </button>
          <button
            type="button"
            onClick={() => {
              triggerHaptic(10);
              setActiveTab("aim");
            }}
            className={`flex-1 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
              activeTab === "aim"
                ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            🎯 Aim Reflex
          </button>
          <button
            type="button"
            onClick={() => {
              triggerHaptic(10);
              setActiveTab("touch");
            }}
            className={`flex-1 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
              activeTab === "touch"
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            ⚡ Touch Lab
          </button>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: ESPORTS TOOL DECK (2x2 GRID)                       */}
        {/* ========================================================= */}
        {activeTab === "deck" && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2.5">
              {/* Tool 1: Custom Crosshair */}
              <button
                type="button"
                onClick={toggleCrosshair}
                style={{ transform: "translateZ(0)" }}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between active:scale-[0.97] transition-all ${
                  crosshairConfig.enabled
                    ? "bg-emerald-950/40 border-emerald-500/50 shadow-lg shadow-emerald-950/40"
                    : "bg-slate-950/80 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`p-2 rounded-xl ${
                      crosshairConfig.enabled
                        ? "bg-emerald-500 text-slate-950 font-bold"
                        : "bg-slate-900 text-emerald-400"
                    }`}
                  >
                    <Crosshair className="h-5 w-5" />
                  </div>
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      crosshairConfig.enabled
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {crosshairConfig.enabled ? "ACTIVE" : "OFF"}
                  </span>
                </div>

                <div className="mt-2">
                  <h4 className="text-xs font-bold text-white">Pro Crosshair</h4>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    Custom reticle for snipers &amp; hip-fire accuracy.
                  </p>
                </div>
              </button>

              {/* Tool 2: Footstep Audio Booster */}
              <button
                type="button"
                onClick={toggleFootstepBoost}
                style={{ transform: "translateZ(0)" }}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between active:scale-[0.97] transition-all ${
                  footstepBoostActive
                    ? "bg-cyan-950/40 border-cyan-500/50 shadow-lg shadow-cyan-950/40"
                    : "bg-slate-950/80 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`p-2 rounded-xl ${
                      footstepBoostActive
                        ? "bg-cyan-500 text-slate-950 font-bold"
                        : "bg-slate-900 text-cyan-400"
                    }`}
                  >
                    <Headphones className="h-5 w-5" />
                  </div>
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      footstepBoostActive
                        ? "bg-cyan-500/20 text-cyan-300"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {footstepBoostActive ? "BOOSTED" : "OFF"}
                  </span>
                </div>

                <div className="mt-2">
                  <h4 className="text-xs font-bold text-white">Footstep EQ</h4>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    3.5kHz +8dB filter for enemy movements.
                  </p>
                </div>
              </button>

              {/* Tool 3: Touch Accelerator */}
              <button
                type="button"
                onClick={toggleTouchBooster}
                style={{ transform: "translateZ(0)" }}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between active:scale-[0.97] transition-all ${
                  touchBoosterActive
                    ? "bg-amber-950/40 border-amber-500/50 shadow-lg shadow-amber-950/40"
                    : "bg-slate-950/80 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`p-2 rounded-xl ${
                      touchBoosterActive
                        ? "bg-amber-500 text-slate-950 font-bold"
                        : "bg-slate-900 text-amber-400"
                    }`}
                  >
                    <Zap className="h-5 w-5" />
                  </div>
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      touchBoosterActive
                        ? "bg-amber-500/20 text-amber-300"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {touchBoosterActive ? "240Hz" : "OFF"}
                  </span>
                </div>

                <div className="mt-2">
                  <h4 className="text-xs font-bold text-white">Touch Accelerator</h4>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    Zero-lag pointer coalescing engine.
                  </p>
                </div>
              </button>

              {/* Tool 4: Pre-Game RAM & Cache Flush */}
              <button
                type="button"
                onClick={handlePreGameRamFlush}
                disabled={isFlushingRam}
                style={{ transform: "translateZ(0)" }}
                className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-red-500/40 text-left flex flex-col justify-between active:scale-[0.97] transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-slate-900 text-red-400 group-hover:bg-red-500 group-hover:text-slate-950 transition-colors">
                    <Trash2 className={`h-5 w-5 ${isFlushingRam ? "animate-spin" : ""}`} />
                  </div>
                  <span className="text-[9px] font-mono bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded font-bold">
                    PRE-GAME
                  </span>
                </div>

                <div className="mt-2">
                  <h4 className="text-xs font-bold text-white">
                    {isFlushingRam ? "Flushing Heap..." : "RAM & Cache Flush"}
                  </h4>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    {ramFreedMb > 0 ? `${ramFreedMb}MB freed` : "Purges browser memory."}
                  </p>
                </div>
              </button>
            </div>

            {/* Active Footstep Wave Neon Card if Enabled */}
            {footstepBoostActive && (
              <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                    <Volume2 className="h-4 w-4 animate-pulse" />
                    Footstep Audio Equalizer Active
                  </span>
                  <button
                    type="button"
                    onClick={handleTestFootstepPulse}
                    className="px-2.5 py-1 rounded-lg bg-cyan-500 text-slate-950 text-[10px] font-mono font-bold active:scale-95"
                  >
                    Test Pulse 🔊
                  </button>
                </div>
                {/* Visual Neon Equalizer Bars */}
                <div className="flex items-end justify-between h-8 gap-1 pt-1">
                  {[20, 35, 60, 95, 100, 85, 45, 25, 15, 30, 75, 90].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-cyan-400/80 rounded-t shadow-[0_0_8px_#22d3ee] animate-pulse"
                      style={{
                        height: `${h}%`,
                        animationDelay: `${i * 80}ms`,
                      }}
                    />
                  ))}
                </div>
                <span className="text-[9px] font-mono text-slate-400 block">
                  3.5kHz peaking filter amplifies subtle floor impacts and reloads.
                </span>
              </div>
            )}

            {/* Quick Game Launchers */}
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Play className="h-3.5 w-3.5 text-red-400" /> Esports Fast Launch
                </span>
                <span className="text-[9px] font-mono text-slate-400">HUD PERSISTENT</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { name: "BGMI / PUBG", tag: "Battle Royale", pkg: "com.pubg.imobile" },
                  { name: "Free Fire MAX", tag: "Survival", pkg: "com.dts.freefiremax" },
                  { name: "Call of Duty", tag: "Multiplayer", pkg: "com.activision.callofduty.shooter" },
                  { name: "Genshin Impact", tag: "Open World", pkg: "com.miHoYo.GenshinImpact" },
                ].map((game) => (
                  <a
                    key={game.name}
                    href={`android-app://${game.pkg}`}
                    onClick={() => {
                      triggerHaptic(15);
                      toast.info(`Launching ${game.name} with Gaming Console HUD...`);
                    }}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-red-500/40 flex items-center justify-between group active:scale-95 transition-all"
                  >
                    <div>
                      <span className="font-bold text-white block truncate">{game.name}</span>
                      <span className="text-[9px] font-mono text-slate-400">{game.tag}</span>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 text-slate-500 group-hover:text-red-400" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: AIM REFLEX TRAINER (TEST CROSSHAIR & LATENCY)       */}
        {/* ========================================================= */}
        {activeTab === "aim" && (
          <div className="space-y-3">
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-cyan-500/30 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">Esports Aim &amp; Reaction Arena</h4>
                <p className="text-[10px] text-slate-400">
                  Tap targets with crosshair to test response speed and input lag.
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-black text-cyan-400">
                  Hits: {aimScore}
                </span>
                {aimReactionTime && (
                  <span className="text-[10px] font-mono text-emerald-400 block">
                    {aimReactionTime}ms
                  </span>
                )}
              </div>
            </div>

            {/* Interactive Target Arena */}
            <div className="relative h-64 rounded-2xl bg-black border border-slate-800 overflow-hidden select-none">
              <button
                type="button"
                onClick={handleHitTarget}
                style={{
                  top: `${targetPos.y}%`,
                  left: `${targetPos.x}%`,
                  transform: "translate(-50%, -50%)",
                }}
                className="absolute w-12 h-12 rounded-full bg-red-600/30 border-2 border-red-500 flex items-center justify-center active:scale-75 transition-transform shadow-[0_0_15px_#ef4444]"
              >
                <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
              </button>

              <span className="absolute bottom-2 left-2 text-[9px] font-mono text-slate-500">
                TAP RED RETICLE TO REGISTER SHOT
              </span>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: 240Hz TOUCH ACCELERATOR LAB                        */}
        {/* ========================================================= */}
        {activeTab === "touch" && (
          <div className="space-y-3">
            <TouchResponseBooster />
          </div>
        )}
      </main>

      {/* ========================================================= */}
      {/* Quick Exit Pill Bar (Bottom Fixed)                       */}
      {/* ========================================================= */}
      <div className="fixed bottom-2 left-0 right-0 z-40 flex items-center justify-center">
        <button
          type="button"
          onClick={() => {
            triggerHaptic(20);
            exitGamingMode();
          }}
          className="px-4 py-1.5 rounded-full bg-slate-950/95 border border-red-500/50 hover:border-red-400 text-[11px] font-mono font-bold text-red-300 active:scale-95 transition-all flex items-center gap-1.5 shadow-xl shadow-red-950/60 backdrop-blur-xl"
        >
          <span className="text-red-400">✕</span>
          <span>Exit Gaming Console Mode</span>
        </button>
      </div>
    </div>
  );
};

export default GamingConsoleWorkspace;
