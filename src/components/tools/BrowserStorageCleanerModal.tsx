import React, { useState, useEffect, useCallback } from "react";
import {
  HardDrive,
  Trash2,
  RefreshCw,
  CheckCircle2,
  X,
  ShieldCheck,
  Database,
} from "lucide-react";
import { safeVibrate } from "@/utils/safeVibrate";

interface BrowserStorageCleanerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface StorageStats {
  usageMB: number;
  quotaMB: number;
  cacheBuckets: string[];
  localStorageKeys: number;
  sessionStorageKeys: number;
}

export const BrowserStorageCleanerModal: React.FC<BrowserStorageCleanerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [stats, setStats] = useState<StorageStats>({
    usageMB: 0,
    quotaMB: 0,
    cacheBuckets: [],
    localStorageKeys: 0,
    sessionStorageKeys: 0,
  });
  const [isCleaning, setIsCleaning] = useState(false);
  const [cleaned, setCleaned] = useState(false);

  const inspectStorage = useCallback(async () => {
    if (typeof window === "undefined") return;
    let usageMB = 0;
    let quotaMB = 0;
    let cacheBuckets: string[] = [];

    try {
      if (navigator.storage?.estimate) {
        const est = await navigator.storage.estimate();
        usageMB = Number(((est.usage || 0) / (1024 * 1024)).toFixed(2));
        quotaMB = Number(((est.quota || 0) / (1024 * 1024)).toFixed(0));
      }
      if ("caches" in window) {
        cacheBuckets = await caches.keys();
      }
    } catch {
      // Ignore storage estimate restrictions in private browsing
    }

    setStats({
      usageMB,
      quotaMB,
      cacheBuckets,
      localStorageKeys: localStorage.length,
      sessionStorageKeys: sessionStorage.length,
    });
  }, []);

  useEffect(() => {
    if (isOpen) {
      setCleaned(false);
      inspectStorage();
    }
  }, [isOpen, inspectStorage]);

  if (!isOpen) return null;

  const handlePurgeCaches = async () => {
    setIsCleaning(true);
    safeVibrate([25, 30]);
    try {
      if ("caches" in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
      sessionStorage.clear();
      await inspectStorage();
      setCleaned(true);
    } finally {
      setIsCleaning(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Browser Storage and Cache Inspector"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-3xl border border-cyan-500/30 bg-slate-950 p-6 text-white shadow-2xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
              <HardDrive className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Browser Storage &amp; Cache Cleaner</h3>
              <p className="text-xs text-slate-400">Real Web Storage API &amp; Cache API inspector</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block font-mono uppercase text-[10px]">Origin Storage Used</span>
            <strong className="text-lg font-mono text-cyan-400">{stats.usageMB} MB</strong>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block font-mono uppercase text-[10px]">Cache Buckets</span>
            <strong className="text-lg font-mono text-emerald-400">{stats.cacheBuckets.length} Active</strong>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block font-mono uppercase text-[10px]">Session Keys</span>
            <strong className="text-sm font-mono text-white flex items-center gap-1.5 mt-1">
              <Database className="h-3.5 w-3.5 text-cyan-400" /> {stats.sessionStorageKeys} items
            </strong>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block font-mono uppercase text-[10px]">Browser Quota</span>
            <strong className="text-sm font-mono text-white mt-1 block">{stats.quotaMB || "—"} MB</strong>
          </div>
        </div>

        {cleaned && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Temporary cache buckets &amp; session state cleared cleanly.</span>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={inspectStorage}
            className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5 text-cyan-400" /> Re-check
          </button>
          <button
            type="button"
            onClick={handlePurgeCaches}
            disabled={isCleaning}
            className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            <span>{isCleaning ? "Clearing..." : "Clear Temporary Cache Buckets"}</span>
          </button>
        </div>

        <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
          <span>100% on-device Web API inspection. Zero personal files accessed.</span>
        </p>
      </div>
    </div>
  );
};

export default BrowserStorageCleanerModal;
