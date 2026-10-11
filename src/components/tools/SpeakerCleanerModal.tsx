import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Play, Square, X, Sparkles, AlertCircle, Droplets } from "lucide-react";

interface SpeakerCleanerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SpeakerCleanerModal: React.FC<SpeakerCleanerModalProps> = ({ isOpen, onClose }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [frequency, setFrequency] = useState(165);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const timerRef = useRef<number | null>(null);
  const sweepIntervalRef = useRef<number | null>(null);

  const stopAudio = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (sweepIntervalRef.current) clearInterval(sweepIntervalRef.current);

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

  const startAudio = async () => {
    setErrorMsg(null);
    if (typeof window === "undefined") return;

    try {
      const AudioContextClass =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) {
        setErrorMsg("Web Audio API is not supported in this browser.");
        return;
      }

      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      // Resume context if suspended by browser autoplay policy
      if (ctx.state === "suspended") {
        await ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(165, ctx.currentTime);

      // Create rhythmic water-ejection pulse effect
      gain.gain.setValueAtTime(0.85, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      oscRef.current = osc;
      gainRef.current = gain;
      setIsRunning(true);
      setTimeLeft(60);

      // Oscillate frequency between 165Hz and 250Hz with pulse burst
      let currentFreq = 165;
      let direction = 1;
      sweepIntervalRef.current = window.setInterval(() => {
        if (!audioCtxRef.current || !oscRef.current || !gainRef.current) return;
        const cTime = audioCtxRef.current.currentTime;

        currentFreq += direction * 5;
        if (currentFreq >= 240) direction = -1;
        if (currentFreq <= 165) direction = 1;

        setFrequency(currentFreq);
        oscRef.current.frequency.setValueAtTime(currentFreq, cTime);

        // Pulse gain modulation for acoustic mechanical shock
        const pulse = 0.5 + Math.random() * 0.45;
        gainRef.current.gain.linearRampToValueAtTime(pulse, cTime + 0.05);
      }, 80);

      // 60-second countdown
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            stopAudio();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to access audio hardware. Please check speaker permissions.");
      stopAudio();
    }
  };

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
      onClick={() => {
        stopAudio();
        onClose();
      }}
    >
      <div
        className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-6 shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Droplets className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Speaker Dust &amp; Water Ejector</h3>
              <p className="text-xs text-slate-400">165Hz Acoustic Moisture Clearance</p>
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

        {/* Interactive Wave Animation Container */}
        <div className="relative flex flex-col items-center justify-center py-8 bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden">
          {isRunning ? (
            <div className="relative flex items-center justify-center">
              {/* Concentric soundwaves */}
              <div className="absolute w-36 h-36 rounded-full border-2 border-cyan-400/40 animate-ping opacity-60" />
              <div className="absolute w-28 h-28 rounded-full border border-cyan-500/60 animate-pulse" />
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.6)] z-10">
                <Volume2 className="h-10 w-10 text-slate-950 animate-bounce" />
              </div>
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
              <VolumeX className="h-9 w-9" />
            </div>
          )}

          <div className="mt-5 text-center">
            <div className="font-mono text-2xl font-black text-cyan-400">
              {isRunning ? `${timeLeft}s Remaining` : "60s Session"}
            </div>
            <div className="text-[11px] font-mono text-slate-400 mt-1">
              Active Resonance: <span className="text-emerald-400 font-bold">{frequency} Hz</span>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-3 text-xs text-slate-300 space-y-1.5">
          <div className="flex items-center gap-1.5 text-cyan-300 font-semibold text-[11px]">
            <Sparkles className="h-3.5 w-3.5" /> Optimal Ejection Technique:
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            1. Turn phone media volume to <strong>100% Maximum</strong>.<br />
            2. Hold device vertically with bottom speaker facing downward.<br />
            3. Tap Start to trigger low-frequency sound bursts.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex gap-3">
          {isRunning ? (
            <button
              type="button"
              onClick={stopAudio}
              className="w-full py-3 px-4 rounded-xl bg-rose-500 hover:bg-rose-400 active:scale-95 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20 transition-all"
            >
              <Square className="h-4 w-4 fill-slate-950" />
              <span>Stop Ejection</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={startAudio}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-95 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all"
            >
              <Play className="h-4 w-4 fill-slate-950" />
              <span>Start Ejection (60s)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpeakerCleanerModal;
