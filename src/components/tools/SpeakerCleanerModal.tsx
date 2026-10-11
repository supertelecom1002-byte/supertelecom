import React, { useState, useEffect, useRef } from "react";
import {
  Volume2,
  VolumeX,
  Play,
  Square,
  X,
  Sparkles,
  AlertCircle,
  Droplets,
  Zap,
  Activity,
  Radio,
} from "lucide-react";
import { PermissionSheet } from "@/components/common/PermissionSheet";
import { useHardwarePermissions } from "@/hooks/useHardwarePermissions";

interface SpeakerCleanerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SpeakerCleanerModal: React.FC<SpeakerCleanerModalProps> = ({ isOpen, onClose }) => {
  const { isGranted, triggerVibration } = useHardwarePermissions();
  const [permissionSheetOpen, setPermissionSheetOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [frequency, setFrequency] = useState(165);
  const [engineMode, setEngineMode] = useState<"165Hz Resonance" | "220Hz Burst">("165Hz Resonance");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const timerRef = useRef<number | null>(null);
  const sweepIntervalRef = useRef<number | null>(null);
  const vibrateIntervalRef = useRef<number | null>(null);

  const stopAudio = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (sweepIntervalRef.current) clearInterval(sweepIntervalRef.current);
    if (vibrateIntervalRef.current) clearInterval(vibrateIntervalRef.current);

    try {
      if (oscRef.current) {
        oscRef.current.stop();
        oscRef.current.disconnect();
        oscRef.current = null;
      }
      if (gainRef.current) {
        gainRef.current.disconnect();
        gainRef.current = null;
      }
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
    } catch {
      // ignore
    }

    setIsRunning(false);
    setTimeLeft(60);
    setFrequency(165);
    setEngineMode("165Hz Resonance");
  };

  const executeAudioStart = async () => {
    setErrorMsg(null);
    if (typeof window === "undefined") return;

    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) {
        setErrorMsg("Web Audio API is not supported in this browser.");
        return;
      }

      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      if (ctx.state === "suspended") {
        await ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(165, ctx.currentTime);
      gain.gain.setValueAtTime(0.92, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      oscRef.current = osc;
      gainRef.current = gain;
      setIsRunning(true);
      setTimeLeft(60);

      // Initial mechanical impulse
      triggerVibration([100, 40, 100, 40, 200]);

      // Dual-Frequency Engine: Alternates between 165Hz resonance and 220Hz burst
      let cycle = 0;
      sweepIntervalRef.current = window.setInterval(() => {
        if (!audioCtxRef.current || !oscRef.current || !gainRef.current) return;
        const cTime = audioCtxRef.current.currentTime;
        cycle++;

        // Switch between 165Hz resonance wave and 220Hz high burst every ~3 seconds
        if (cycle % 40 < 25) {
          // 165Hz deep moisture vibration
          const target = 165 + (cycle % 5) * 2;
          setFrequency(target);
          setEngineMode("165Hz Resonance");
          oscRef.current.frequency.setValueAtTime(target, cTime);
          gainRef.current.gain.linearRampToValueAtTime(0.88, cTime + 0.05);
        } else {
          // 220Hz burst ejection
          const target = 220 + ((cycle * 3) % 20);
          setFrequency(target);
          setEngineMode("220Hz Burst");
          oscRef.current.frequency.setValueAtTime(target, cTime);
          gainRef.current.gain.linearRampToValueAtTime(0.98, cTime + 0.05);
        }
      }, 75);

      // Periodic tactile rhythmic haptic vibration
      vibrateIntervalRef.current = window.setInterval(() => {
        triggerVibration([50, 30, 80]);
      }, 900);

      // 60-second countdown
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            stopAudio();
            triggerVibration([200, 80, 200]);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      console.error(err);
      setErrorMsg("Audio hardware access restricted. Please allow permissions.");
      stopAudio();
    }
  };

  const handleStartRequest = () => {
    triggerVibration(20);
    if (!isGranted("audio")) {
      setPermissionSheetOpen(true);
    } else {
      executeAudioStart();
    }
  };

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  if (!isOpen) return null;

  const progressPercent = Math.round(((60 - timeLeft) / 60) * 100);
  const strokeDashoffset = 440 - (440 * progressPercent) / 100;

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in select-none"
        onClick={() => {
          stopAudio();
          onClose();
        }}
      >
        <div
          className="w-full max-w-md bg-[#030712] border border-cyan-500/30 rounded-3xl p-5 sm:p-6 space-y-5 shadow-2xl shadow-cyan-950/40 relative overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Subtle Cyber-Lab Cyan Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 text-cyan-400">
                <Droplets className="h-6 w-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-800">
                    Dual-Frequency Ejector
                  </span>
                  <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded-full border border-emerald-800">
                    Offline Ready
                  </span>
                </div>
                <h3 className="font-bold text-base text-white mt-0.5">
                  Sonic 165Hz Water &amp; Dust Ejector
                </h3>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                triggerVibration(15);
                stopAudio();
                onClose();
              }}
              className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white active:scale-95 transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* High-Contrast Radial Dial & Waveform Equalizer */}
          <div className="relative flex flex-col items-center justify-center py-5 bg-slate-900/60 border border-slate-800/80 rounded-3xl overflow-hidden">
            {/* SVG Radial Progress Dial */}
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="transparent"
                  stroke="#111827"
                  strokeWidth="8"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="transparent"
                  stroke={isRunning ? "#00f2fe" : "#334155"}
                  strokeWidth="8"
                  strokeDasharray="440"
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />
              </svg>

              {/* Center Icon & Frequency Indicator */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                {isRunning ? (
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-400 animate-pulse">
                      <Volume2 className="h-7 w-7 text-cyan-300 animate-bounce" />
                    </div>
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500">
                    <VolumeX className="h-7 w-7" />
                  </div>
                )}
                <div className="mt-1.5 font-mono text-xl font-black text-white">
                  {isRunning ? `${timeLeft}s` : "60s"}
                </div>
              </div>
            </div>

            {/* Dynamic Sound-Wave Equalizer */}
            <div className="flex items-end justify-center gap-1.5 h-8 mt-2 px-6">
              {[35, 70, 50, 95, 60, 100, 75, 85, 45, 90, 60, 80].map((h, i) => (
                <div
                  key={i}
                  className={`w-1.5 rounded-full transition-all duration-150 ${
                    isRunning
                      ? "bg-gradient-to-t from-cyan-500 to-emerald-400"
                      : "bg-slate-800 h-2"
                  }`}
                  style={{
                    height: isRunning ? `${Math.max(6, Math.min(32, (h * frequency) / 200))}px` : "6px",
                  }}
                />
              ))}
            </div>

            <div className="mt-3 text-center">
              <div className="text-xs font-mono text-slate-300">
                Acoustic Frequency:{" "}
                <span className="text-cyan-400 font-bold text-sm">{frequency} Hz</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 block mt-0.5">
                Mode: {engineMode} &bull; Active Haptic Sync
              </span>
            </div>
          </div>

          {/* Technique Card */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-3 text-xs text-slate-300 space-y-1">
            <div className="flex items-center gap-1.5 text-cyan-300 font-semibold text-[11px]">
              <Sparkles className="h-3.5 w-3.5" /> Optimal Ejection Protocol:
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              1. Turn media volume to <strong>100% Maximum</strong>.<br />
              2. Point phone bottom speakers downward over a cloth.<br />
              3. Alternating 165Hz &amp; 220Hz soundwaves physically eject moisture.
            </p>
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-rose-950/50 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Action Button */}
          <div>
            {isRunning ? (
              <button
                type="button"
                onClick={stopAudio}
                className="w-full py-3.5 px-4 rounded-2xl bg-rose-500 hover:bg-rose-400 active:scale-95 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-500/30 transition-all cursor-pointer"
              >
                <Square className="h-4 w-4 fill-slate-950" />
                <span>STOP EJECTION ({timeLeft}s)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStartRequest}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 hover:from-cyan-300 hover:to-blue-500 active:scale-95 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all cursor-pointer"
              >
                <Play className="h-4 w-4 fill-slate-950" />
                <span>START WATER EJECTION (60s)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <PermissionSheet
        isOpen={permissionSheetOpen}
        onClose={() => setPermissionSheetOpen(false)}
        onAllowed={() => {
          setPermissionSheetOpen(false);
          executeAudioStart();
        }}
        requiredPermissions={["audio", "vibration"]}
        title="Speaker & Haptic Hardware Access"
        description="Super Telecom requires Web Audio API and Haptic feedback permissions to trigger ultrasonic acoustic waves and clear water droplets."
      />
    </>
  );
};

export default SpeakerCleanerModal;
