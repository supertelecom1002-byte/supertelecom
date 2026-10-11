import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Play,
  Square,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Clock,
  ShieldCheck,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { useHardwarePermissions } from "@/hooks/useHardwarePermissions";

interface BurnInHealerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HEALER_COLORS = [
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFFFF",
  "#000000",
  "#FFFF00",
  "#00FFFF",
  "#FF00FF",
  "#808080",
];

export const BurnInHealerModal: React.FC<BurnInHealerModalProps> = ({ isOpen, onClose }) => {
  const { requestWakeLockPermission, releaseWakeLock, triggerVibration } = useHardwarePermissions();
  const [isRunning, setIsRunning] = useState(false);
  const [durationMins, setDurationMins] = useState<number>(3);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(180);
  const [patternIndex, setPatternIndex] = useState(0);
  const [mode, setMode] = useState<"flasher" | "noise">("flasher");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Stop healing and release wakeLock
  const stopHealing = () => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    releaseWakeLock();
    triggerVibration([100, 50, 100]);
  };

  useEffect(() => {
    if (!isOpen) {
      stopHealing();
      setSecondsRemaining(durationMins * 60);
    }
  }, [isOpen]);

  // Handle countdown
  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            stopHealing();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  // Flash cycle loop
  useEffect(() => {
    if (!isRunning) return;

    let lastTime = 0;
    const interval = mode === "flasher" ? 75 : 40; // 75ms color flash or 40ms noise

    const loop = (time: number) => {
      if (time - lastTime >= interval) {
        lastTime = time;
        if (mode === "flasher") {
          setPatternIndex((prev) => (prev + 1) % HEALER_COLORS.length);
        } else if (canvasRef.current) {
          // Render random noise on canvas
          const ctx = canvasRef.current.getContext("2d");
          if (ctx) {
            const w = canvasRef.current.width;
            const h = canvasRef.current.height;
            const imgData = ctx.createImageData(w, h);
            const buffer = new Uint32Array(imgData.data.buffer);
            for (let i = 0; i < buffer.length; i++) {
              buffer[i] = Math.random() < 0.5 ? 0xff000000 : 0xffffffff;
            }
            ctx.putImageData(imgData, 0, 0);
          }
        }
      }
      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isRunning, mode]);

  if (!isOpen) return null;

  const startHealing = () => {
    triggerVibration(50);
    requestWakeLockPermission().catch(() => {});
    setSecondsRemaining(durationMins * 60);
    setIsRunning(true);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-50 select-none flex flex-col justify-between transition-colors ${
        isRunning && mode === "flasher"
          ? ""
          : "bg-[#030712] text-white p-4"
      }`}
      style={{
        backgroundColor: isRunning && mode === "flasher" ? HEALER_COLORS[patternIndex] : undefined,
      }}
      role="dialog"
      aria-modal="true"
    >
      {/* Canvas for Noise Mode */}
      {isRunning && mode === "noise" && (
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          className="fixed inset-0 w-full h-full object-cover z-0"
        />
      )}

      {/* When running, floating stop button */}
      {isRunning ? (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30">
          <button
            type="button"
            onClick={stopHealing}
            className="px-6 py-3.5 rounded-full bg-slate-950/90 border border-white/30 text-white font-mono font-bold text-sm shadow-2xl flex items-center gap-2.5 active:scale-95 transition-transform"
          >
            <Square className="h-4 w-4 fill-rose-500 text-rose-500" />
            <span>Stop Healing ({formatTime(secondsRemaining)})</span>
          </button>
        </div>
      ) : (
        /* Configuration Screen */
        <div className="max-w-md w-full mx-auto my-auto bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5 z-10">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">AMOLED Burn-in & Ghost Healer</h3>
                <p className="text-[11px] text-slate-400">Sub-Pixel Exercise & Stuck State Clearer</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Warning Notice */}
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5">
            <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Photosensitivity Notice:</strong> This diagnostic tool runs high-speed color strobing and noise patterns. Do not stare directly at screen if sensitive to flashing light.
            </p>
          </div>

          {/* Pattern Mode Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-slate-400 uppercase">Healer Pattern</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  triggerVibration(15);
                  setMode("flasher");
                }}
                className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                  mode === "flasher"
                    ? "bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-sm"
                    : "bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white"
                }`}
              >
                RGB Rapid Flasher
              </button>
              <button
                type="button"
                onClick={() => {
                  triggerVibration(15);
                  setMode("noise");
                }}
                className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                  mode === "noise"
                    ? "bg-purple-500/20 border-purple-500 text-purple-300 shadow-sm"
                    : "bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white"
                }`}
              >
                Static White Noise
              </button>
            </div>
          </div>

          {/* Duration Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-slate-400 uppercase">Duration</label>
            <div className="grid grid-cols-3 gap-2">
              {[1, 3, 5].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => {
                    triggerVibration(15);
                    setDurationMins(mins);
                    setSecondsRemaining(mins * 60);
                  }}
                  className={`p-2.5 rounded-xl border text-xs font-mono font-bold transition-all ${
                    durationMins === mins
                      ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                      : "bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white"
                  }`}
                >
                  {mins} Minute{mins > 1 ? "s" : ""}
                </button>
              ))}
            </div>
          </div>

          {/* Start CTA */}
          <button
            type="button"
            onClick={startHealing}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-brand text-primary-foreground font-bold text-sm shadow-brand hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Play className="h-4 w-4 fill-current" />
            <span>Start Sub-Pixel Healing Cycle</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default BurnInHealerModal;
