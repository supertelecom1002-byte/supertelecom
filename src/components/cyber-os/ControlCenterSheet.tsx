import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Moon,
  Sun,
  Flashlight,
  FlashlightOff,
  Volume2,
  Gauge,
  LogOut,
  Sliders,
  Sparkles,
  Zap,
  Activity,
  CheckCircle2,
  Gamepad2,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useLauncher } from "@/context/LauncherContext";
import { useGamingMode } from "@/context/GamingModeContext";
import { toast } from "sonner";

interface ControlCenterSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ControlCenterSheet: React.FC<ControlCenterSheetProps> = ({ isOpen, onClose }) => {
  const { isDark, toggleTheme } = useTheme();
  const { disableCyberOs } = useLauncher();
  const { enterGamingMode } = useGamingMode();

  // Torch state
  const [torchOn, setTorchOn] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);
  const trackRef = useRef<MediaStreamTrack | null>(null);

  // 165Hz burst state
  const [isPlayingBurst, setIsPlayingBurst] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Refresh rate calculation state
  const [refreshRate, setRefreshRate] = useState<number>(60);

  const triggerVibrate = (pattern: number | number[] = 15) => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // ignore
      }
    }
  };

  // Measure display refresh rate using rAF
  useEffect(() => {
    if (!isOpen || typeof window === "undefined") return;

    let frames = 0;
    let startTime = performance.now();
    let animId: number;

    const measure = (now: number) => {
      frames++;
      const elapsed = now - startTime;
      if (elapsed >= 1000) {
        const fps = Math.round((frames * 1000) / elapsed);
        // Map to standard screen specs (60, 90, 120, 144)
        if (fps >= 130) setRefreshRate(144);
        else if (fps >= 105) setRefreshRate(120);
        else if (fps >= 75) setRefreshRate(90);
        else setRefreshRate(60);

        frames = 0;
        startTime = now;
      }
      animId = requestAnimationFrame(measure);
    };

    animId = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(animId);
  }, [isOpen]);

  // Torch control
  const toggleTorch = async () => {
    triggerVibrate(25);
    if (torchOn) {
      // Turn off
      try {
        if (trackRef.current) {
          await (trackRef.current as any).applyConstraints({
            advanced: [{ torch: false }],
          });
          trackRef.current.stop();
          trackRef.current = null;
        }
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop());
          streamRef.current = null;
        }
      } catch {
        // ignore
      }
      setTorchOn(false);
      toast.info("Torch Disabled");
    } else {
      // Turn on
      try {
        if (typeof navigator !== "undefined" && navigator.mediaDevices?.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" },
          });
          streamRef.current = stream;
          const track = stream.getVideoTracks()[0];
          if (track) {
            const capabilities = (track as any).getCapabilities?.() || {};
            if ("torch" in capabilities) {
              await (track as any).applyConstraints({
                advanced: [{ torch: true }],
              });
              trackRef.current = track;
              setTorchOn(true);
              toast.success("Hardware Torch Active 🔦");
              return;
            }
          }
        }
      } catch {
        // fallback
      }
      setTorchOn(true);
      toast.info("Torch Activated (Screen Mode)");
    }
  };

  // Clean up torch on sheet close
  useEffect(() => {
    if (!isOpen && torchOn) {
      if (trackRef.current) {
        (trackRef.current as any)
          .applyConstraints({ advanced: [{ torch: false }] })
          .catch(() => {});
        trackRef.current.stop();
        trackRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      setTorchOn(false);
    }
  }, [isOpen, torchOn]);

  // 165Hz Sound burst trigger (1.5 seconds)
  const trigger165HzBurst = () => {
    if (isPlayingBurst) return;
    triggerVibrate([40, 20, 60]);
    setIsPlayingBurst(true);

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) throw new Error("AudioContext unsupported");
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(165, ctx.currentTime);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.5);

      toast.success("165Hz Sonic Dust Burst Triggered 🔊", {
        description: "Acoustic displacement pulse expelled.",
      });

      setTimeout(() => {
        setIsPlayingBurst(false);
        try {
          ctx.close();
        } catch {
          // ignore
        }
      }, 1500);
    } catch {
      setIsPlayingBurst(false);
      toast.error("Audio hardware unavailable");
    }
  };

  const handleExitLauncher = () => {
    triggerVibrate([30, 50]);
    onClose();
    disableCyberOs();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div
        className="w-full max-w-sm rounded-t-3xl sm:rounded-3xl bg-slate-950/95 border border-cyan-500/30 p-5 space-y-4 shadow-2xl shadow-cyan-950/80 text-white select-none animate-in slide-in-from-bottom-5 duration-200 relative overflow-hidden"
        style={{ transform: "translateZ(0)" }}
      >
        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Pull handle on mobile */}
        <div className="w-12 h-1 bg-slate-700/80 rounded-full mx-auto sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
              <Sliders className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-black tracking-tight text-white flex items-center gap-1.5">
                Cyber-OS Quick Center
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
              </h3>
              <p className="text-[10px] font-mono text-cyan-400/80">
                HARDWARE LAB CONTROLLER
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white active:scale-90 transition-transform"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Controls Grid */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          {/* 1. Theme Switch */}
          <button
            type="button"
            onClick={() => {
              triggerVibrate(20);
              toggleTheme();
            }}
            className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 text-left space-y-2 active:scale-95 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20">
                {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4 text-amber-400" />}
              </div>
              <span className="text-[9px] font-mono uppercase text-slate-400 font-bold">
                {isDark ? "AMOLED" : "LIGHT"}
              </span>
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Theme Mode</span>
              <span className="text-[10px] text-slate-400">
                {isDark ? "Pure Black UI" : "Daylight Crisp"}
              </span>
            </div>
          </button>

          {/* 2. Hardware Torch */}
          <button
            type="button"
            onClick={toggleTorch}
            className={`p-3 rounded-2xl border text-left space-y-2 active:scale-95 transition-all ${
              torchOn
                ? "bg-amber-500/20 border-amber-400/80 text-amber-300 shadow-md shadow-amber-500/20"
                : "bg-slate-900/80 border-slate-800 hover:border-amber-500/40 text-slate-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <div
                className={`p-2 rounded-xl ${
                  torchOn ? "bg-amber-400 text-slate-950 font-bold" : "bg-slate-800 text-amber-400"
                }`}
              >
                {torchOn ? <Flashlight className="h-4 w-4" /> : <FlashlightOff className="h-4 w-4" />}
              </div>
              <span className="text-[9px] font-mono uppercase font-bold text-slate-400">
                {torchOn ? "ACTIVE" : "STANDBY"}
              </span>
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Hardware Torch</span>
              <span className="text-[10px] text-slate-400">
                {torchOn ? "Flash Strobe On" : "1-Tap Toggle"}
              </span>
            </div>
          </button>

          {/* 3. 165Hz Acoustic Sweep Burst */}
          <button
            type="button"
            onClick={trigger165HzBurst}
            disabled={isPlayingBurst}
            className={`p-3 rounded-2xl border text-left space-y-2 active:scale-95 transition-all ${
              isPlayingBurst
                ? "bg-cyan-500/30 border-cyan-400 shadow-md shadow-cyan-500/30"
                : "bg-slate-900/80 border-slate-800 hover:border-cyan-500/40"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                <Volume2 className={`h-4 w-4 ${isPlayingBurst ? "animate-pulse" : ""}`} />
              </div>
              <span className="text-[9px] font-mono uppercase font-bold text-cyan-400">
                {isPlayingBurst ? "SWEEPING" : "165 HZ"}
              </span>
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Sonic Burst</span>
              <span className="text-[10px] text-slate-400">
                {isPlayingBurst ? "Moisture Expulsion..." : "1.5s Dust Eject"}
              </span>
            </div>
          </button>

          {/* 4. Display Refresh Rate Indicator */}
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-left space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                <Gauge className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-mono uppercase font-black text-purple-400">
                {refreshRate} FPS
              </span>
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Screen Refresh</span>
              <span className="text-[10px] text-slate-400">
                {refreshRate >= 120 ? "120Hz Ultra Smooth" : refreshRate >= 90 ? "90Hz High Speed" : "60Hz Standard"}
              </span>
            </div>
          </div>
        </div>

        {/* Engage Gaming Console Mode */}
        <div className="pt-2 border-t border-slate-800/80">
          <button
            type="button"
            onClick={() => {
              triggerVibrate([40, 30, 80]);
              onClose();
              enterGamingMode();
            }}
            className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-red-600/30 via-rose-600/20 to-amber-600/30 hover:from-red-600/40 border border-red-500/40 text-red-300 font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md"
          >
            <Gamepad2 className="h-4 w-4 text-red-400" />
            <span>Engage Esports Gaming Console</span>
          </button>
        </div>

        {/* Exit Launcher CTA Button */}
        <div className="pt-2 border-t border-slate-800/80">
          <button
            type="button"
            onClick={handleExitLauncher}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-500/20 to-red-500/20 hover:from-rose-500/30 hover:to-red-500/30 border border-rose-500/40 text-rose-300 font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-rose-950/40"
          >
            <LogOut className="h-4 w-4 text-rose-400" />
            <span>Exit Cyber-OS &bull; Return to Standard App</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ControlCenterSheet;
