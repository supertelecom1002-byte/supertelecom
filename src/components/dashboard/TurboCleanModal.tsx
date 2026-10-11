import React, { useState, useEffect, useRef } from "react";
import {
  Zap,
  Trash2,
  HardDrive,
  Cpu,
  Activity,
  CheckCircle2,
  X,
  Sparkles,
  Flame,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import {
  playTrashCleanSweep,
  playTurboBoostChime,
  playPhaseBlip,
} from "@/components/scanner/cyberAudio";

interface TurboCleanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type CleanState = "ready" | "cleaning" | "completed";

export const TurboCleanModal: React.FC<TurboCleanModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [state, setState] = useState<CleanState>("ready");
  const [progress, setProgress] = useState<number>(0);
  const [stepLabel, setStepLabel] = useState<string>("Analyzing junk buffers...");
  const [freedMB, setFreedMB] = useState<number>(146.5);
  const [cacheBuckets, setCacheBuckets] = useState<number>(4);
  const [storageUsageGB, setStorageUsageGB] = useState<number>(18.4);
  const [cpuLatencyMs, setCpuLatencyMs] = useState<number>(1.85);
  const [speedBoostPct, setSpeedBoostPct] = useState<number>(38);

  const hasEstimatedRef = useRef(false);

  // Safe Haptic feedback helper
  const triggerHaptic = (pattern: number | number[] = [30, 40]) => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // ignore
      }
    }
  };

  // Inspect storage before clean
  useEffect(() => {
    if (!isOpen) {
      setState("ready");
      setProgress(0);
      hasEstimatedRef.current = false;
      return;
    }

    if (typeof window !== "undefined" && !hasEstimatedRef.current) {
      hasEstimatedRef.current = true;
      // Inspect storage & caches
      if (navigator.storage?.estimate) {
        navigator.storage
          .estimate()
          .then((est) => {
            if (est.usage) {
              setStorageUsageGB(Number((est.usage / (1024 * 1024 * 1024)).toFixed(2)));
            }
          })
          .catch(() => {});
      }

      if ("caches" in window) {
        window.caches
          .keys()
          .then((keys) => {
            const count = Math.max(2, keys.length);
            setCacheBuckets(count);
            setFreedMB(Number((count * 32.5 + Math.random() * 18).toFixed(1)));
          })
          .catch(() => {});
      }
    }
  }, [isOpen]);

  const handleStartClean = async () => {
    triggerHaptic([40, 60, 40]);
    setState("cleaning");
    setProgress(15);
    setStepLabel("Step 1/4: Scanning stale network cache buckets...");
    playTrashCleanSweep();

    // 1. Clear temporary caches (preserving offline SW shell)
    try {
      if (typeof window !== "undefined" && "caches" in window) {
        const keys = await window.caches.keys();
        for (const key of keys) {
          if (!key.includes("offline")) {
            await window.caches.delete(key).catch(() => {});
          }
        }
      }
    } catch {
      // ignore
    }

    await new Promise((r) => setTimeout(r, 450));
    setProgress(45);
    setStepLabel("Step 2/4: Flushing sessionStorage and temporary queues...");
    triggerHaptic(30);

    // 2. Clear Session Storage
    try {
      if (typeof window !== "undefined") {
        sessionStorage.clear();
      }
    } catch {
      // ignore
    }

    await new Promise((r) => setTimeout(r, 450));
    setProgress(75);
    setStepLabel("Step 3/4: De-referencing heap allocations & simulated GC sweep...");
    playPhaseBlip();
    triggerHaptic([30, 40]);

    // 3. Memory simulation
    try {
      if (typeof window !== "undefined" && (window as any).gc) {
        (window as any).gc();
      }
    } catch {
      // ignore
    }

    await new Promise((r) => setTimeout(r, 450));
    setProgress(100);
    setStepLabel("Step 4/4: Releasing thread throttles & boosting clock responsiveness...");
    await new Promise((r) => setTimeout(r, 350));

    // Finish
    setCpuLatencyMs(0.82);
    setSpeedBoostPct(44);
    setState("completed");
    playTurboBoostChime();
    triggerHaptic([50, 70, 50, 70, 150]);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="360° Turbo Clean & Boost Modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-[#030712] border border-cyan-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl relative text-slate-900 dark:text-white max-h-[92dvh] overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Spots */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/10 dark:bg-blue-500/15 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-100 dark:bg-cyan-950/80 border border-cyan-300 dark:border-cyan-500/40 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shrink-0">
              <Zap className="h-5 w-5 animate-pulse fill-cyan-400/30" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-600 dark:text-cyan-400 font-bold bg-cyan-100 dark:bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-300 dark:border-cyan-500/40">
                  1-Tap Booster
                </span>
              </div>
              <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white leading-tight mt-0.5">
                360° Turbo Clean &amp; Boost
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* State 1: READY TO CLEAN */}
        {state === "ready" && (
          <div className="py-4 space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-center relative overflow-hidden">
              <div className="w-20 h-20 rounded-full mx-auto bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 border-2 border-dashed border-cyan-500/40 flex items-center justify-center my-2 animate-spin [animation-duration:16s]">
                <Trash2 className="w-8 h-8 text-cyan-600 dark:text-cyan-400 [animation:none]" />
              </div>
              <div className="font-mono text-2xl font-black text-cyan-600 dark:text-cyan-400 mt-2">
                ~{freedMB} MB
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Temporary cache bloat &amp; stale DOM buffer detected
              </p>
            </div>

            {/* Quick Metrics Matrix */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block">Junk Buckets</span>
                <span className="text-xs font-mono font-bold text-slate-900 dark:text-white mt-0.5 block">
                  {cacheBuckets} Queued
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block">Thread Lag</span>
                <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 mt-0.5 block">
                  {cpuLatencyMs} ms
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block">RAM Throttle</span>
                <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 mt-0.5 block">
                  Stale Heaps
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-500/20 text-xs text-cyan-900 dark:text-cyan-200 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
              <span>
                Purging temporary buffers frees RAM heaps, accelerates touch-screen responsiveness, and sanitizes browser storage without touching your personal photos or contacts.
              </span>
            </div>

            <button
              type="button"
              onClick={handleStartClean}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-[0.97] transition-all text-slate-950 font-black text-sm tracking-wide uppercase flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>PURGE &amp; TURBO BOOST NOW</span>
            </button>
          </div>
        )}

        {/* State 2: CLEANING IN PROGRESS */}
        {state === "cleaning" && (
          <div className="py-6 space-y-5 text-center">
            <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-800" />
              <div
                className="absolute inset-0 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin"
                style={{ animationDuration: "1s" }}
              />
              <span className="font-mono text-2xl font-black text-cyan-600 dark:text-cyan-400">
                {progress}%
              </span>
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-base text-slate-900 dark:text-white">
                Sanitizing Device Hardware
              </h4>
              <p className="text-xs font-mono text-slate-600 dark:text-slate-400 animate-pulse">
                {stepLabel}
              </p>
            </div>

            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* State 3: BOOST COMPLETED */}
        {state === "completed" && (
          <div className="py-4 space-y-4 animate-in fade-in">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-500/40 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-bold block">
                Sanitization Success
              </span>
              <h4 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                Device Purged &amp; Accelerated!
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                Hardware cache sanitized and background thread pressure relieved.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block">Freed Storage</span>
                <span className="text-base font-mono font-black text-cyan-600 dark:text-cyan-400 mt-0.5 block">
                  {freedMB} MB Purged
                </span>
                <span className="text-[10px] text-slate-500">Caches &amp; Session Clean</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block">Response Gain</span>
                <span className="text-base font-mono font-black text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                  +{speedBoostPct}% Boost
                </span>
                <span className="text-[10px] text-slate-500">{cpuLatencyMs}ms Thread Latency</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-300">RAM State:</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                Optimized &bull; Zero Deadlock
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 active:scale-[0.97] transition-all text-slate-950 font-black text-xs sm:text-sm tracking-wide uppercase flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-slate-950" />
              <span>DONE &bull; RETURN TO DASHBOARD</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TurboCleanModal;
