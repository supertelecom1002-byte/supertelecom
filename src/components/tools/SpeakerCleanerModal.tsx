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

      gain.gain.setValueAtTime(0.9, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      oscRef.current = osc;
      gainRef.current = gain;
      setIsRunning(true);
      setTimeLeft(60);

      // Trigger initial tactile ejection feedback
      triggerVibration([100, 50, 100, 50, 200]);

      // Oscillate frequency between 165Hz and 250Hz with pulse burst
      let currentFreq = 165;
      let direction = 1;
      sweepIntervalRef.current = window.setInterval(() => {
        if (!audioCtxRef.current || !oscRef.current || !gainRef.current) return;
        const cTime = audioCtxRef.current.currentTime;

        currentFreq += direction * 4;
        if (currentFreq >= 250) direction = -1;
        if (currentFreq <= 165) direction = 1;

        setFrequency(currentFreq);
        oscRef.current.frequency.setValueAtTime(currentFreq, cTime);

        // Acoustic mechanical pulse modulation
        const pulse = 0.65 + Math.random() * 0.35;
        gainRef.current.gain.linearRampToValueAtTime(pulse, cTime + 0.05);
      }, 70);

      // Periodic synchronized haptic motor pulses
      vibrateIntervalRef.current = window.setInterval(() => {
        triggerVibration([60, 30, 80]);
      }, 1200);

      // 60-second countdown
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            stopAudio();
            triggerVibration([200, 100, 200]);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to access audio hardware. Please tap Allow on the permission prompt.");
      stopAudio();
    }
  };

  const handleStartRequest = () => {
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

  // Gauge calculations
  const progressPercent = Math.round(((60 - timeLeft) / 60) * 100);
  const strokeDashoffset = 440 - (440 * progressPercent) / 100;

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in select-none"
        onClick={() => {
          stopAudio();
          onClose();
        }}
      >
        <div
          className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl relative overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* AMOLED Radial Background Glow */}
          <div className="absolute top-0 right-0 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Droplets className="h-6 w-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-800">
                    Acoustic Ejector
                  </span>
                </div>
                <h3 className="font-bold text-base text-white mt-0.5">
                  Sonic Speaker Dust &amp; Water Ejector
                </h3>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                stopAudio();
                onClose();
              }}
              className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* High-Contrast Circular Gauge & Sound-Wave Equalizer */}
          <div className="relative flex flex-col items-center justify-center py-6 bg-slate-900/60 border border-slate-800/80 rounded-3xl overflow-hidden">
            {/* SVG Gauge */}
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="transparent"
                  stroke="#1e293b"
                  strokeWidth="8"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="transparent"
                  stroke={isRunning ? "#22d3ee" : "#334155"}
                  strokeWidth="8"
                  strokeDasharray="440"
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />
              </svg>

              {/* Center icon / status */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                {isRunning ? (
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-400 animate-pulse">
                      <Volume2 className="h-8 w-8 text-cyan-400 animate-bounce" />
                    </div>
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500">
                    <VolumeX className="h-8 w-8" />
                  </div>
                )}
                <div className="mt-2 font-mono text-xl font-black text-white">
                  {isRunning ? `${timeLeft}s` : "60s"}
                </div>
              </div>
            </div>

            {/* Equalizer Waveform bars */}
            <div className="flex items-end justify-center gap-1.5 h-8 mt-2 px-6">
              {[40, 75, 55, 90, 60, 100, 70, 85, 50, 95, 65, 80].map((h, i) => (
                <div
                  key={i}
                  className={`w-1.5 rounded-full transition-all duration-150 ${
                    isRunning
                      ? "bg-gradient-to-t from-cyan-500 to-blue-400"
                      : "bg-slate-700 h-2"
                  }`}
                  style={{
                    height: isRunning ? `${Math.max(6, Math.min(32, (h * frequency) / 200))}px` : "6px",
                  }}
                />
              ))}
            </div>

            <div className="mt-3 text-center">
              <div className="text-xs font-mono text-slate-400">
                Acoustic Frequency:{" "}
                <span className="text-cyan-400 font-bold text-sm">{frequency} Hz</span>
              </div>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                Target Moisture &amp; Particle Ejection Band (165Hz - 250Hz)
              </span>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-3.5 text-xs text-slate-300 space-y-1.5">
            <div className="flex items-center gap-1.5 text-cyan-300 font-semibold text-[11px]">
              <Sparkles className="h-3.5 w-3.5" /> Optimal Ejection Technique:
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              1. Turn phone media volume to <strong>100% Maximum</strong>.<br />
              2. Point bottom speaker grille downwards over a cloth.<br />
              3. Hold firmly as acoustic resonance &amp; haptic pulses vibrate the grille.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1-Tap Big Tactile Button */}
          <div>
            {isRunning ? (
              <button
                type="button"
                onClick={stopAudio}
                className="w-full py-4 px-4 rounded-2xl bg-rose-500 hover:bg-rose-400 active:scale-95 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-500/30 transition-all cursor-pointer"
              >
                <Square className="h-5 w-5 fill-slate-950" />
                <span>STOP EJECTION ({timeLeft}s)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStartRequest}
                className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 hover:from-cyan-300 hover:to-blue-500 active:scale-95 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(6,182,212,0.5)] transition-all cursor-pointer"
              >
                <Play className="h-5 w-5 fill-slate-950" />
                <span>START WATER EJECTION (60s)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Permission sheet for Audio & Vibration */}
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
