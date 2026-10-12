import React, { useState, useEffect, useRef } from "react";
import {
  Zap,
  Play,
  Square,
  X,
  Sparkles,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { useHardwarePermissions } from "@/hooks/useHardwarePermissions";
import { toast } from "sonner";
import { safeVibrate } from "@/utils/safeVibrate";

interface VibrationTesterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PatternDef {
  id: string;
  name: string;
  pattern: number[];
  description: string;
  durationMs: number;
}

const PATTERNS: PatternDef[] = [
  {
    id: "pulse",
    name: "Short Rapid Pulse",
    pattern: [50, 40, 50, 40, 50, 40, 50],
    description: "Tests basic haptic rotor/linear resonant actuator (LRA) response time",
    durationMs: 310,
  },
  {
    id: "heartbeat",
    name: "Heartbeat Double Thump",
    pattern: [100, 120, 150, 400, 100, 120, 150],
    description: "Evaluates dual-frequency counterweight balance and low-RPM torque",
    durationMs: 1040,
  },
  {
    id: "buzz",
    name: "High-Frequency Continuous Buzz",
    pattern: [400, 100, 400, 100, 400],
    description: "Tests sustained motor coil resistance under maximum voltage draw",
    durationMs: 1400,
  },
  {
    id: "sos",
    name: "Emergency SOS (Morse Code)",
    pattern: [100, 100, 100, 100, 100, 200, 300, 100, 300, 100, 300, 200, 100, 100, 100, 100, 100],
    description: "Full stress sequence testing rhythmic stop-and-go acceleration",
    durationMs: 2300,
  },
];

export const VibrationTesterModal: React.FC<VibrationTesterModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { triggerVibration } = useHardwarePermissions();
  const [activePattern, setActivePattern] = useState<string>("pulse");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isSupported, setIsSupported] = useState<boolean>(true);

  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsSupported("vibrate" in navigator);
    }
  }, []);

  const runPattern = (patternDef: PatternDef) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setActivePattern(patternDef.id);
    setIsPlaying(true);

    const ok = triggerVibration(patternDef.pattern);
    if (!ok && !isSupported) {
      toast.error("Vibration API is not supported on this browser/device.");
    }

    timeoutRef.current = window.setTimeout(() => {
      setIsPlaying(false);
    }, patternDef.durationMs + 100);
  };

  const stopVibration = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    safeVibrate(0);
    setIsPlaying(false);
  };

  useEffect(() => {
    return () => {
      stopVibration();
    };
  }, []);

  if (!isOpen) return null;

  const currentPattern = PATTERNS.find((p) => p.id === activePattern) || PATTERNS[0];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in select-none"
      onClick={() => {
        stopVibration();
        onClose();
      }}
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
              <Zap className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider bg-cyan-950 px-2 py-0.5 rounded-full border border-cyan-800">
                  Haptic Diagnostic
                </span>
                <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded-full border border-emerald-800">
                  100% Offline
                </span>
              </div>
              <h3 className="font-bold text-base text-white mt-0.5">
                Haptic Vibration Motor Diagnostic
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              stopVibration();
              onClose();
            }}
            className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Visual Waveform Stage */}
        <div className="flex flex-col items-center justify-center py-6 bg-slate-900/60 border border-slate-800/80 rounded-2xl relative overflow-hidden">
          <div className="relative w-24 h-24 flex items-center justify-center">
            {isPlaying ? (
              <>
                <div className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-ping opacity-75" />
                <div className="absolute inset-2 rounded-full border border-emerald-400 animate-pulse" />
                <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center shadow-[0_0_20px_#22d3ee]">
                  <Activity className="h-8 w-8 text-cyan-300 animate-bounce" />
                </div>
              </>
            ) : (
              <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500">
                <Zap className="h-8 w-8" />
              </div>
            )}
          </div>

          <div className="mt-3 text-center">
            <span className="font-mono text-sm font-bold text-white block">
              {isPlaying ? `Running: ${currentPattern.name}` : "Motor Standby"}
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              {currentPattern.description}
            </span>
          </div>
        </div>

        {/* 4 Pattern Selectors */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
            Select Stress Test Profile:
          </span>
          <div className="grid grid-cols-2 gap-2">
            {PATTERNS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => runPattern(p)}
                className={`p-3 rounded-2xl border text-left transition-all active:scale-95 ${
                  activePattern === p.id && isPlaying
                    ? "bg-cyan-500/20 border-cyan-400 text-white shadow-md shadow-cyan-500/20"
                    : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                }`}
              >
                <span className="text-xs font-bold block">{p.name}</span>
                <span className="text-[10px] font-mono text-cyan-400 block mt-0.5">
                  {(p.durationMs / 1000).toFixed(1)}s Profile
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div>
          {isPlaying ? (
            <button
              type="button"
              onClick={stopVibration}
              className="w-full py-3.5 px-4 rounded-2xl bg-rose-500 hover:bg-rose-400 active:scale-95 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-500/30 transition-all cursor-pointer"
            >
              <Square className="h-4 w-4 fill-slate-950" />
              <span>STOP MOTOR TEST</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => runPattern(currentPattern)}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-95 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              <Play className="h-4 w-4 fill-slate-950" />
              <span>TRIGGER {currentPattern.name.toUpperCase()}</span>
            </button>
          )}
        </div>

        {/* Engineer Diagnostic Note */}
        <div className="p-3 rounded-2xl bg-slate-900/40 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
          <span className="font-bold text-slate-200 block">Diagnostic Note:</span>
          <span>
            If the phone emits a metallic rattle during the High-Frequency Buzz, the vibration motor bracket screws are loose. If completely silent, motor coil is burnt or disconnected.
          </span>
        </div>
      </div>
    </div>
  );
};

export default VibrationTesterModal;
