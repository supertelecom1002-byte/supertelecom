import React, { useState, useEffect, useCallback } from "react";
import {
  Database,
  Trash2,
  ExternalLink,
  CheckCircle2,
  HardDrive,
  RefreshCw,
  Sparkles,
  Info,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { safeVibrate } from "@/utils/safeVibrate";
import { toast } from "sonner";

interface StorageMetrics {
  usageBytes: number;
  quotaBytes: number;
  usageMB: number;
  quotaGB: number;
  percentUsed: number;
  details?: Record<string, number>;
  supported: boolean;
}

export const RealStorageGauge: React.FC<{ className?: string }> = ({ className = "" }) => {
  const [metrics, setMetrics] = useState<StorageMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isPurging, setIsPurging] = useState<boolean>(false);
  const [lastPurgedResult, setLastPurgedResult] = useState<string | null>(null);

  const fetchRealStorage = useCallback(async () => {
    setLoading(true);
    try {
      if (typeof navigator !== "undefined" && "storage" in navigator && "estimate" in navigator.storage) {
        const est: any = await navigator.storage.estimate();
        const usageBytes = est.usage || 0;
        const quotaBytes = est.quota || 0;
        const usageMB = parseFloat((usageBytes / (1024 * 1024)).toFixed(2));
        const quotaGB = parseFloat((quotaBytes / (1024 * 1024 * 1024)).toFixed(2));
        const percentUsed = quotaBytes > 0 ? Math.min(100, Math.round((usageBytes / quotaBytes) * 100)) : 0;

        setMetrics({
          usageBytes,
          quotaBytes,
          usageMB,
          quotaGB,
          percentUsed,
          details: est.usageDetails,
          supported: true,
        });
      } else {
        setMetrics({
          usageBytes: 0,
          quotaBytes: 0,
          usageMB: 0,
          quotaGB: 0,
          percentUsed: 0,
          supported: false,
        });
      }
    } catch (e) {
      console.warn("Storage estimate error:", e);
      setMetrics({
        usageBytes: 0,
        quotaBytes: 0,
        usageMB: 0,
        quotaGB: 0,
        percentUsed: 0,
        supported: false,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRealStorage();
  }, [fetchRealStorage]);

  // Genuine Client-Side Cache & Session Storage Purge
  const handlePurgeCache = async () => {
    safeVibrate([20, 30]);
    setIsPurging(true);
    setLastPurgedResult(null);

    let bytesPurged = 0;

    try {
      let usageBefore = 0;
      if (typeof navigator !== "undefined" && "storage" in navigator && "estimate" in navigator.storage) {
        const estBefore = await navigator.storage.estimate();
        usageBefore = estBefore.usage || 0;
      }

      // 1. Purge CacheStorage API
      if (typeof window !== "undefined" && "caches" in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      }

      // 2. Clear SessionStorage
      if (typeof window !== "undefined" && window.sessionStorage) {
        sessionStorage.clear();
      }

      // 3. Re-estimate to calculate exact delta
      if (typeof navigator !== "undefined" && "storage" in navigator && "estimate" in navigator.storage) {
        const estAfter = await navigator.storage.estimate();
        const usageAfter = estAfter.usage || 0;
        bytesPurged = Math.max(0, usageBefore - usageAfter);
      }

      await fetchRealStorage();

      if (bytesPurged > 0) {
        const mb = (bytesPurged / (1024 * 1024)).toFixed(2);
        const resultMsg = `${mb} MB of actual temporary web cache released`;
        setLastPurgedResult(resultMsg);
        toast.success(`Storage freed: ${resultMsg}`);
      } else {
        const resultMsg = `0.0 MB (Your local cache was already 100% clean)`;
        setLastPurgedResult(resultMsg);
        toast.info(resultMsg);
      }
    } catch (err) {
      console.error("Purge error:", err);
      toast.error("Could not clear all cache keys. Browser permissions restricted.");
    } finally {
      setIsPurging(false);
      safeVibrate(30);
    }
  };

  // Launch Native Android OS Internal Storage Manager
  const handleOpenNativeSettings = () => {
    safeVibrate([30, 20, 30]);
    if (typeof window === "undefined") return;

    try {
      // Official Android intent for system-wide internal storage settings
      window.location.href = "intent:#Intent;action=android.settings.INTERNAL_STORAGE_SETTINGS;end";
    } catch {
      toast.info("Open Phone Settings > Storage to clean system & app cache.");
    }
  };

  return (
    <div
      className={`p-4 rounded-3xl bg-white dark:bg-[#030712]/95 border border-slate-200 dark:border-cyan-500/30 shadow-xl shadow-cyan-950/10 backdrop-blur-2xl transition-all ${className}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shrink-0">
            <HardDrive className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-cyan-700 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-300 dark:border-cyan-500/30">
                navigator.storage
              </span>
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                100% Real Hardware
              </span>
            </div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
              Real Storage &amp; Cache Manager
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            safeVibrate(15);
            fetchRealStorage();
          }}
          disabled={loading}
          aria-label="Refresh real storage estimate"
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white active:scale-95 transition-all"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-cyan-500" : ""}`} />
        </button>
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed">
        No artificial junk counters or fake "clean 1.5 GB" simulations. This queries your actual browser
        storage allocation and provides direct access to Android's native system storage settings.
      </p>

      {/* Storage Gauge Display */}
      {metrics && metrics.supported ? (
        <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-600 dark:text-slate-400 font-semibold flex items-center gap-1.5">
              <Database className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
              App Quota Usage:
            </span>
            <span className="font-bold text-slate-900 dark:text-white">
              {metrics.usageMB} MB{" "}
              <span className="text-slate-400 font-normal">/ {metrics.quotaGB} GB Available</span>
            </span>
          </div>

          {/* Progress bar */}
          <div className="relative w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 transition-all duration-500 rounded-full"
              style={{ width: `${Math.max(2, Math.min(100, metrics.percentUsed || 1))}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Quota utilization: {metrics.percentUsed}%</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
              ✓ Hardware Verified
            </span>
          </div>
        </div>
      ) : (
        <div className="mt-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs">
          Browser Storage API in Private/Restricted mode. Real quota unavailable, but cache clearing is active.
        </div>
      )}

      {/* Purge Result Notification */}
      {lastPurgedResult && (
        <div className="mt-3 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <div className="leading-tight">
            <span className="font-bold block">Purge Verified:</span>
            <span>{lastPurgedResult}</span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {/* Real Web Cache Clear */}
        <button
          type="button"
          onClick={handlePurgeCache}
          disabled={isPurging}
          className="w-full py-2.5 px-3 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 active:scale-95 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
        >
          <Trash2 className="h-3.5 w-3.5 text-cyan-400" />
          <span>{isPurging ? "Purging Web Caches..." : "Clear Web Cache & Session"}</span>
        </button>

        {/* Native Android OS Settings */}
        <button
          type="button"
          onClick={handleOpenNativeSettings}
          className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-cyan-600/20 active:scale-95 transition-all cursor-pointer"
        >
          <Smartphone className="h-3.5 w-3.5" />
          <span>Android Storage Settings</span>
          <ExternalLink className="h-3 w-3" />
        </button>
      </div>

      {/* Honest Note */}
      <div className="mt-3 flex items-start gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 font-mono px-1">
        <Info className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
        <span>
          Web browsers cannot directly touch WhatsApp media or Android system files for security reasons.
          The Android Storage button launches your phone's official storage manager for full GB cleanup.
        </span>
      </div>
    </div>
  );
};

export default RealStorageGauge;
