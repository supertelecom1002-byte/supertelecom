import React from "react";
import { Zap, RefreshCw, Sparkles } from "lucide-react";
import { useAppUpdate } from "@/hooks/useAppUpdate";

export const UpdateBanner: React.FC = () => {
  const { isUpdateAvailable, isChecking, applyUpdate } = useAppUpdate();

  if (!isUpdateAvailable) {
    return null;
  }

  return (
    <aside
      aria-label="App update available"
      role="alert"
      className="fixed bottom-20 left-3 right-3 sm:bottom-6 sm:right-6 sm:left-auto sm:max-w-md z-[70] p-3.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 border-2 border-cyan-500/70 dark:border-cyan-400/80 shadow-2xl shadow-cyan-500/20 backdrop-blur-2xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300 select-none"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="p-2 rounded-xl bg-cyan-500/10 dark:bg-cyan-950/80 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 shrink-0">
          <Zap className="h-4 w-4 animate-pulse fill-cyan-400/30" />
        </div>
        <div className="min-w-0 leading-tight">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black tracking-tight text-slate-900 dark:text-white">
              NEW RELEASE READY
            </span>
            <span className="px-1.5 py-0.2 rounded-md bg-cyan-100 dark:bg-cyan-950 border border-cyan-300 dark:border-cyan-500/40 text-[9px] font-mono text-cyan-800 dark:text-cyan-300 font-bold">
              v3.2
            </span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 truncate mt-0.5">
            Offline lab cache &amp; tools ready. Tap to install.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={applyUpdate}
        className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-95 text-slate-950 font-black text-xs shrink-0 transition-all shadow-md shadow-cyan-500/25 cursor-pointer flex items-center gap-1.5"
      >
        <RefreshCw className="h-3.5 w-3.5 text-slate-950" />
        <span>Update Now</span>
      </button>
    </aside>
  );
};

export default UpdateBanner;
