import React from "react";
import { Zap, RefreshCw } from "lucide-react";
import { useAppUpdate } from "@/hooks/useAppUpdate";

export const UpdateBanner: React.FC = () => {
  const { isUpdateAvailable, applyUpdate } = useAppUpdate();

  if (!isUpdateAvailable) {
    return null;
  }

  return (
    <aside
      aria-label="App update available"
      role="alert"
      className="fixed bottom-20 left-4 right-4 max-w-md mx-auto z-50 p-3 bg-cyan-950 border border-cyan-500 rounded-2xl shadow-2xl flex items-center justify-between animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="flex items-center gap-2 min-w-0 pr-2">
        <Zap className="h-4 w-4 text-amber-400 fill-amber-400 shrink-0" />
        <span className="text-xs font-semibold text-cyan-100 truncate">
          New features available! Tap to reload.
        </span>
      </div>

      <button
        type="button"
        onClick={applyUpdate}
        className="bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-slate-950 px-3 py-1.5 font-bold rounded-lg text-xs shrink-0 transition-all shadow-md cursor-pointer flex items-center gap-1.5"
      >
        <RefreshCw className="h-3 w-3 text-slate-950" />
        <span>Update Now</span>
      </button>
    </aside>
  );
};

export default UpdateBanner;
