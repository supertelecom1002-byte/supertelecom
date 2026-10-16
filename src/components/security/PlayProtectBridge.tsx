import React, { useState } from "react";
import { ShieldCheck, ExternalLink, AlertCircle, Sparkles, CheckCircle2 } from "lucide-react";
import { safeVibrate } from "@/utils/safeVibrate";

export const PlayProtectBridge: React.FC<{ className?: string }> = ({ className = "" }) => {
  const [hasLaunched, setHasLaunched] = useState(false);

  const launchPlayProtect = () => {
    safeVibrate([30, 20, 40]);
    setHasLaunched(true);

    if (typeof window === "undefined") return;

    try {
      // Direct intent to launch Google Play Protect scanning UI
      window.location.href =
        "intent:#Intent;action=com.google.android.gms.security.settings.VerifyAppsSettingsActivity;package=com.google.android.gms;end";

      // Fallback intent to Play Store direct updates/protect page
      setTimeout(() => {
        window.location.href = "market://details?id=com.google.android.gms";
      }, 700);
    } catch {
      window.open("https://support.google.com/googleplay/answer/2812853", "_blank");
    }
  };

  return (
    <div
      className={`p-4 rounded-3xl bg-slate-900/90 dark:bg-[#030712]/95 border border-emerald-500/30 hover:border-emerald-500/50 shadow-xl shadow-emerald-950/20 backdrop-blur-2xl transition-all ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Android Settings Shortcut
              </span>
              <span className="text-[10px] font-mono text-slate-400">System Intent</span>
            </div>
            <h3 className="text-sm font-black text-white mt-0.5">
              Open Device Google Play Protect
            </h3>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-300 mt-3 leading-relaxed">
        Browsers cannot legally inspect installed apps or scan device files. On Android phones, this shortcut opens your native <strong>Google Play Protect</strong> settings activity so you can trigger Google's official malware scanner safely.
      </p>

      <div className="mt-3.5 space-y-2">
        <button
          type="button"
          onClick={launchPlayProtect}
          className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 active:scale-95 transition-all cursor-pointer"
        >
          <Sparkles className="h-4 w-4" />
          <span>Open Google Play Protect Settings</span>
          <ExternalLink className="h-3.5 w-3.5 ml-1" />
        </button>

        {hasLaunched ? (
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-[11px] animate-in fade-in">
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
            <span>
              Google Play Protect intent launched. Check your Android notification bar or device settings for scan results.
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono px-1">
            <AlertCircle className="h-3 w-3 text-emerald-400" />
            <span>Native Android intent &bull; Client-side launcher &bull; No app tracking</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayProtectBridge;
