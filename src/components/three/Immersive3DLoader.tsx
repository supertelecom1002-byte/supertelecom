import React, { useEffect, useState, useRef } from "react";
import { Cpu, ShieldCheck, Sparkles, Zap, ChevronRight, Activity } from "lucide-react";

interface Immersive3DLoaderProps {
  onComplete?: () => void;
  forceShow?: boolean;
}

const TELEMETRY_STEPS = [
  { progress: 20, message: "INITIALIZING BGA CHIP-LEVEL STATION..." },
  { progress: 50, message: "CALIBRATING 0.02MM JUMPER WIRE BENCH..." },
  { progress: 75, message: "ENGAGING ESD CLEANROOM PROTOCOL..." },
  { progress: 100, message: "SUPER TELECOM FLAGSHIP LAB ONLINE" },
];

export const Immersive3DLoader: React.FC<Immersive3DLoaderProps> = ({
  onComplete,
  forceShow = false,
}) => {
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // SSR hydration safety: mount only on client
  useEffect(() => {
    setMounted(true);
    if (!forceShow) {
      try {
        const hasSeen = sessionStorage.getItem("st_loader_seen");
        if (hasSeen === "true") {
          setIsVisible(false);
          if (onComplete) onComplete();
          return;
        }
      } catch {}
    }
    setIsVisible(true);
  }, [forceShow, onComplete]);

  // Fast, high-energy progress timer (~750ms total for immediate gratification)
  useEffect(() => {
    if (!isVisible) return;

    const startTime = performance.now();
    const duration = 750; // Ultra-snappy 750ms

    const frame = () => {
      const elapsed = performance.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (pct < 100) {
        requestAnimationFrame(frame);
      } else {
        try {
          sessionStorage.setItem("st_loader_seen", "true");
        } catch {}
        setTimeout(() => {
          setIsFadingOut(true);
          setTimeout(() => {
            setIsVisible(false);
            if (onComplete) onComplete();
          }, 350);
        }, 150);
      }
    };

    const animId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(animId);
  }, [isVisible, onComplete]);

  // 3D Parallax Tilt from mouse or touch
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMouseOffset({ x, y });
  };

  const handleDismissNow = () => {
    try {
      sessionStorage.setItem("st_loader_seen", "true");
    } catch {}
    setIsFadingOut(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 180);
  };

  if (!mounted) return null;
  if (!isVisible) {
    return <div style={{ display: "none" }} aria-hidden="true" />;
  }

  const currentStep =
    TELEMETRY_STEPS.find((s) => progress <= s.progress) || TELEMETRY_STEPS[TELEMETRY_STEPS.length - 1];

  const tiltX = -mouseOffset.y * 14;
  const tiltY = mouseOffset.x * 18;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onClick={handleDismissNow}
      aria-label="Super Telecom Laboratory Loader"
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-between bg-slate-950 text-white select-none transition-all duration-350 ease-out cursor-pointer ${
        isFadingOut ? "opacity-0 pointer-events-none scale-105 blur-sm" : "opacity-100"
      }`}
      style={{
        backgroundImage:
          "radial-gradient(circle at 50% 45%, rgba(6, 182, 212, 0.16) 0%, rgba(2, 6, 23, 0.95) 70%, #020617 100%)",
      }}
    >
      {/* Background Cyber Grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            "linear-gradient(rgba(6,182,212,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.2) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* Top Header Bar */}
      <div className="w-full max-w-6xl px-4 sm:px-8 pt-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Cpu className="h-4 w-4 animate-pulse" />
          </div>
          <div>
            <div className="font-mono text-xs font-bold text-cyan-400 tracking-wider">
              SUPER TELECOM
            </div>
            <div className="text-[10px] font-mono text-slate-400">
              BARGANDA ROAD CHIP-LEVEL LAB • EST. 2016
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleDismissNow();
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-cyan-500/30 bg-slate-900/90 hover:bg-cyan-950/80 text-cyan-300 text-xs font-mono font-bold transition-all shadow-md active:scale-95"
        >
          <span>ENTER LAB</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Centerpiece: Interactive 3D Holographic Logo Rig */}
      <div
        className="relative flex flex-col items-center justify-center my-auto px-4"
        style={{ perspective: "1000px" }}
      >
        {/* Holographic Glowing Badge Container */}
        <div
          className="relative transition-transform duration-100 ease-out flex items-center justify-center"
          style={{
            transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1, 1, 1)`,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Outer Pulsing Neon Rings */}
          <div className="absolute -inset-10 rounded-full border border-cyan-500/20 animate-spin" style={{ animationDuration: "20s" }} />
          <div className="absolute -inset-6 rounded-full border border-emerald-500/25 border-dashed animate-spin" style={{ animationDuration: "14s", animationDirection: "reverse" }} />
          <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-cyan-500/20 via-blue-500/10 to-emerald-500/20 blur-xl opacity-75" />

          {/* 3D Glass Badge Shield */}
          <div className="relative h-44 w-44 sm:h-52 sm:w-52 rounded-3xl border border-cyan-400/40 bg-slate-900/90 p-4 shadow-[0_0_60px_rgba(6,182,212,0.35)] backdrop-blur-2xl flex flex-col items-center justify-center overflow-hidden group">
            {/* Real Official Super Telecom Logo */}
            <img
              src="/logo.png"
              alt="Super Telecom Official Logo"
              className="h-28 w-28 sm:h-36 sm:w-36 object-contain drop-shadow-[0_0_20px_rgba(6,182,212,0.6)] transition-transform duration-300 group-hover:scale-105"
            />

            {/* Sci-Fi Scanning Laser Line sweeping across */}
            <div
              className="pointer-events-none absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_15px_#06b6d4] opacity-80"
              style={{
                top: `${(progress * 1.2) % 100}%`,
                transition: "top 0.1s linear",
              }}
            />

            {/* Specular Hologram Sheen */}
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent"
              style={{
                transform: `translateX(${mouseOffset.x * 25}px) translateY(${mouseOffset.y * 25}px)`,
              }}
            />
          </div>

          {/* Floating Degree Markers */}
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] font-mono text-cyan-400/70 font-bold bg-slate-950 px-1 border border-cyan-500/30 rounded">
            0° N
          </span>
          <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[9px] font-mono text-emerald-400/70 font-bold bg-slate-950 px-1 border border-emerald-500/30 rounded">
            180° S
          </span>
        </div>

        {/* Brand Name Typography */}
        <div className="mt-6 text-center space-y-1">
          <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center justify-center gap-2">
            <span>SUPER TELECOM</span>
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          </h1>
          <p className="text-xs sm:text-sm text-cyan-300/80 font-mono tracking-wide">
            MICRO-SOLDERING & DISPLAY RESTORATION LAB
          </p>
        </div>
      </div>

      {/* Bottom Telemetry HUD Bar */}
      <div className="w-full max-w-xl px-6 pb-8 space-y-3 z-10 text-center">
        {/* Dynamic Telemetry Message */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-300 font-mono text-xs shadow-md backdrop-blur-md">
          <Activity className="h-3.5 w-3.5 text-cyan-400 animate-spin" />
          <span className="tracking-wide font-semibold">{currentStep.message}</span>
        </div>

        {/* Progress Bar & Counter */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">BENCH INITIALIZATION</span>
            <span className="text-cyan-400 font-bold">{progress}%</span>
          </div>

          <div className="h-2 w-full bg-slate-900 border border-slate-800 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 rounded-full transition-all duration-100 shadow-[0_0_15px_rgba(6,182,212,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Technical Badges */}
        <div className="flex items-center justify-center gap-4 text-[10px] font-mono text-slate-500 pt-1">
          <span className="flex items-center gap-1 text-slate-400">
            <ShieldCheck className="h-3 w-3 text-emerald-400" /> ESD SAFE BENCH
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 text-slate-400">
            <Sparkles className="h-3 w-3 text-cyan-400" /> 0.02MM JUMPER
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 text-slate-400">
            <Zap className="h-3 w-3 text-amber-400" /> 30-MIN RESTORE
          </span>
        </div>
      </div>
    </div>
  );
};

export default Immersive3DLoader;
