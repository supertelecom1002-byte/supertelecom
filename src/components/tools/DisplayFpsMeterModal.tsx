import React, { useState, useEffect, useRef } from "react";
import {
  Gauge,
  Play,
  Square,
  X,
  Sparkles,
  Smartphone,
  CheckCircle2,
  Activity,
  Layers,
  RotateCcw,
} from "lucide-react";
import { useHardwarePermissions } from "@/hooks/useHardwarePermissions";

interface DisplayFpsMeterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DisplayFpsMeterModal: React.FC<DisplayFpsMeterModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { triggerVibration } = useHardwarePermissions();
  const [currentFps, setCurrentFps] = useState<number>(60);
  const [avgFps, setAvgFps] = useState<number>(60);
  const [maxFps, setMaxFps] = useState<number>(60);
  const [minFps, setMinFps] = useState<number>(60);
  const [frameTimeMs, setFrameTimeMs] = useState<number>(16.6);
  const [isSampling, setIsSampling] = useState<boolean>(true);
  const [fpsHistory, setFpsHistory] = useState<number[]>(new Array(30).fill(60));

  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const samplesRef = useRef<number[]>([]);

  useEffect(() => {
    if (!isOpen || !isSampling) return;

    let frameCount = 0;
    let lastSecondTime = performance.now();

    const measureFrame = (time: number) => {
      if (lastTimeRef.current !== null) {
        const delta = time - lastTimeRef.current;
        if (delta > 0) {
          const instantFps = Math.round(1000 / delta);
          frameCount++;

          // Update once every ~250ms for stable display
          if (time - lastSecondTime >= 250) {
            const calculatedFps = Math.round((frameCount * 1000) / (time - lastSecondTime));
            frameCount = 0;
            lastSecondTime = time;

            samplesRef.current.push(calculatedFps);
            if (samplesRef.current.length > 60) samplesRef.current.shift();

            const sum = samplesRef.current.reduce((a, b) => a + b, 0);
            const avg = Math.round(sum / samplesRef.current.length);
            const max = Math.max(...samplesRef.current);
            const min = Math.min(...samplesRef.current);

            setCurrentFps(calculatedFps);
            setAvgFps(avg);
            setMaxFps(max);
            setMinFps(min);
            setFrameTimeMs(Number((1000 / Math.max(1, calculatedFps)).toFixed(1)));

            setFpsHistory((prev) => [...prev.slice(1), calculatedFps]);
          }
        }
      }

      lastTimeRef.current = time;
      animFrameRef.current = requestAnimationFrame(measureFrame);
    };

    animFrameRef.current = requestAnimationFrame(measureFrame);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isOpen, isSampling]);

  const handleReset = () => {
    triggerVibration(25);
    samplesRef.current = [];
    setCurrentFps(60);
    setAvgFps(60);
    setMaxFps(60);
    setMinFps(60);
    setFpsHistory(new Array(30).fill(60));
  };

  if (!isOpen) return null;

  // Grade classification
  const screenGrade =
    avgFps >= 115
      ? { label: "120Hz Ultra Flagship (Pro Motion)", color: "text-emerald-400 bg-emerald-950/80 border-emerald-500/40" }
      : avgFps >= 85
      ? { label: "90Hz Smooth Fluid AMOLED", color: "text-cyan-400 bg-cyan-950/80 border-cyan-500/40" }
      : { label: "60Hz Standard Display Panel", color: "text-slate-300 bg-slate-900 border-slate-700" };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#030712] border border-cyan-500/30 rounded-3xl p-5 sm:p-6 space-y-5 shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Gauge className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider bg-cyan-950 px-2 py-0.5 rounded-full border border-cyan-800">
                  Real Refresh Rate
                </span>
                <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded-full border border-emerald-800">
                  100% Offline
                </span>
              </div>
              <h3 className="font-bold text-base text-white mt-0.5">
                Display FPS &amp; Refresh Rate Meter
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              triggerVibration(15);
              onClose();
            }}
            className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Big High-Tech Readout */}
        <div className="flex flex-col items-center justify-center py-6 bg-slate-900/60 border border-slate-800/80 rounded-2xl relative overflow-hidden">
          <div className="font-mono text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-300 to-cyan-500">
            {currentFps} <span className="text-xl font-bold text-slate-400">FPS</span>
          </div>

          <div className="mt-2">
            <span className={`text-[11px] font-mono font-bold px-3 py-1 rounded-full border ${screenGrade.color}`}>
              {screenGrade.label}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-4 text-xs font-mono text-slate-400">
            <span>Frame Time: <strong className="text-white">{frameTimeMs} ms</strong></span>
            <span>Avg: <strong className="text-cyan-400">{avgFps} Hz</strong></span>
          </div>

          {/* Real-time mini sparkline bars */}
          <div className="flex items-end gap-1 h-10 mt-5 px-6 w-full justify-center">
            {fpsHistory.map((val, idx) => {
              const heightPct = Math.min(100, Math.max(15, (val / 120) * 100));
              return (
                <div
                  key={idx}
                  className="flex-1 rounded-xs transition-all duration-100 bg-gradient-to-t from-cyan-500 to-emerald-400"
                  style={{ height: `${heightPct}%` }}
                />
              );
            })}
          </div>
        </div>

        {/* Metric Badges */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Min Observed</span>
            <span className="font-mono text-sm font-bold text-rose-400">{minFps} FPS</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Average FPS</span>
            <span className="font-mono text-sm font-bold text-cyan-400">{avgFps} FPS</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Peak Refresh</span>
            <span className="font-mono text-sm font-bold text-emerald-400">{maxFps} FPS</span>
          </div>
        </div>

        {/* Reset / Pause Buttons */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 py-3 px-3 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 active:scale-95 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset Samples</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerVibration(20);
              setIsSampling((prev) => !prev);
            }}
            className={`flex-1 py-3 px-3 rounded-2xl active:scale-95 font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
              isSampling
                ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                : "bg-emerald-500 text-slate-950 shadow-md"
            }`}
          >
            {isSampling ? <Square className="h-4 w-4 fill-rose-300" /> : <Play className="h-4 w-4 fill-slate-950" />}
            <span>{isSampling ? "Pause Meter" : "Resume Meter"}</span>
          </button>
        </div>

        {/* Engineer Tip */}
        <div className="p-3 rounded-2xl bg-slate-900/40 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
          <span className="font-bold text-slate-200 block">Screen Replacement Tip:</span>
          <span>
            Cheap copy displays cap at 60Hz and suffer frame jitter above 20ms. Authentic Super Telecom OEM replacements support true 90Hz/120Hz smooth animations.
          </span>
        </div>
      </div>
    </div>
  );
};

export default DisplayFpsMeterModal;
