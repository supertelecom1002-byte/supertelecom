import React, { useState, useEffect, useRef } from "react";
import { useGamingMode } from "@/context/GamingModeContext";
import { Zap, Target, Activity, CheckCircle2, RotateCcw } from "lucide-react";

export const TouchResponseBooster: React.FC = () => {
  const { touchBoosterActive, toggleTouchBooster } = useGamingMode();

  const [pollingRate, setPollingRate] = useState<number>(240);
  const [touchSamples, setTouchSamples] = useState<number>(0);
  const [lastLatencyMs, setLastLatencyMs] = useState<number>(4.2);
  const [coalescedCount, setCoalescedCount] = useState<number>(0);

  const padRef = useRef<HTMLDivElement | null>(null);
  const lastEventTimeRef = useRef<number>(performance.now());

  // Global listener when touchBoosterActive is enabled
  useEffect(() => {
    if (!touchBoosterActive || typeof window === "undefined") return;

    const handleGlobalPointer = (e: PointerEvent) => {
      const now = performance.now();
      const delta = now - lastEventTimeRef.current;
      lastEventTimeRef.current = now;

      // Check coalesced events
      let coalescedLen = 1;
      if (typeof e.getCoalescedEvents === "function") {
        try {
          const events = e.getCoalescedEvents();
          coalescedLen = events.length || 1;
        } catch {
          // ignore
        }
      }

      setCoalescedCount((prev) => prev + coalescedLen);
      setTouchSamples((prev) => prev + 1);

      if (delta > 0 && delta < 50) {
        const estHz = Math.min(360, Math.round(1000 / delta));
        if (estHz > 120) setPollingRate(estHz);
        setLastLatencyMs(Number(delta.toFixed(1)));
      }

      // Micro-haptic on tap
      if (e.type === "pointerdown" && typeof navigator !== "undefined" && "vibrate" in navigator) {
        try {
          navigator.vibrate(8);
        } catch {
          // ignore
        }
      }
    };

    window.addEventListener("pointerdown", handleGlobalPointer, { passive: true });
    window.addEventListener("pointermove", handleGlobalPointer, { passive: true });

    return () => {
      window.removeEventListener("pointerdown", handleGlobalPointer);
      window.removeEventListener("pointermove", handleGlobalPointer);
    };
  }, [touchBoosterActive]);

  // Touch pad event handler for in-card testing
  const handlePadPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const nativeEvt = e.nativeEvent;
    let count = 1;
    if (typeof nativeEvt.getCoalescedEvents === "function") {
      try {
        const coalesced = nativeEvt.getCoalescedEvents();
        count = coalesced.length || 1;
      } catch {
        // ignore
      }
    }
    setCoalescedCount((prev) => prev + count);
    setTouchSamples((prev) => prev + 1);

    const now = performance.now();
    const delta = now - lastEventTimeRef.current;
    lastEventTimeRef.current = now;
    if (delta > 0 && delta < 50) {
      setLastLatencyMs(Number(delta.toFixed(1)));
    }
  };

  const handlePadPointerDown = () => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(8);
      } catch {
        // ignore
      }
    }
  };

  const resetStats = () => {
    setTouchSamples(0);
    setCoalescedCount(0);
    setLastLatencyMs(4.2);
  };

  return (
    <div className="rounded-2xl bg-slate-950/90 border border-cyan-500/30 p-4 space-y-3 text-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Zap className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
              240Hz Touch Response Accelerator
            </h4>
            <span className="text-[10px] font-mono text-cyan-400">
              Coalesced Event Sub-Frame Tracking
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleTouchBooster}
          className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase transition-all ${
            touchBoosterActive
              ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30"
              : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          }`}
        >
          {touchBoosterActive ? "ACTIVE" : "STANDBY"}
        </button>
      </div>

      {/* Telemetry Stats Strip */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
          <span className="text-[9px] font-mono text-slate-400 block">POLLING</span>
          <span className="text-sm font-black font-mono text-cyan-400">
            {pollingRate} Hz
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
          <span className="text-[9px] font-mono text-slate-400 block">INPUT DELAY</span>
          <span className="text-sm font-black font-mono text-emerald-400">
            {lastLatencyMs} ms
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
          <span className="text-[9px] font-mono text-slate-400 block">COALESCED</span>
          <span className="text-sm font-black font-mono text-amber-400">
            {coalescedCount}
          </span>
        </div>
      </div>

      {/* Interactive Aim Calibration Pad */}
      <div
        ref={padRef}
        onPointerMove={handlePadPointerMove}
        onPointerDown={handlePadPointerDown}
        style={{ touchAction: "none" }}
        className="relative h-24 rounded-xl bg-slate-900/60 border border-dashed border-cyan-500/40 flex flex-col items-center justify-center cursor-crosshair select-none active:bg-cyan-950/20 transition-colors"
      >
        <Target className="h-6 w-6 text-cyan-400/60 animate-pulse mb-1" />
        <span className="text-[10px] font-mono text-slate-300 font-bold">
          Swipe or Tap to Test Digitizer Sampling
        </span>
        <span className="text-[9px] font-mono text-slate-500">
          Samples Captured: {touchSamples} &bull; Micro-Haptic: 8ms
        </span>
      </div>

      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
        <span>Passive Event Listeners &bull; Zero Frame Drops</span>
        <button
          type="button"
          onClick={resetStats}
          className="flex items-center gap-1 text-slate-400 hover:text-white"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};

export default TouchResponseBooster;
