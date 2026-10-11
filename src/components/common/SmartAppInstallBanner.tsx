import React, { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Download, X, Smartphone, Sparkles, CheckCircle2 } from "lucide-react";
import { useIsStandalone } from "@/hooks/useIsStandalone";

interface SmartAppInstallBannerProps {
  className?: string;
}

export const SmartAppInstallBanner: React.FC<SmartAppInstallBannerProps> = ({ className = "" }) => {
  const isStandalone = useIsStandalone();
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      return sessionStorage.getItem("st_install_banner_dismissed") === "true";
    } catch {
      return false;
    }
  });

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
          setDeferredPrompt(null);
        }
      } catch {
        // fallback to /download
        window.location.href = "/download";
      }
    } else {
      window.location.href = "/download";
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      sessionStorage.setItem("st_install_banner_dismissed", "true");
    } catch {
      // ignore
    }
  };

  // If already installed in standalone mode or user dismissed this session, hide completely
  if (isStandalone || isDismissed) {
    return null;
  }

  return (
    <aside
      aria-label="Install Super Telecom App"
      className={`w-full bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border-b border-cyan-500/30 text-white px-3 py-2 flex items-center justify-between gap-2.5 z-40 relative shadow-md backdrop-blur-xl animate-in slide-in-from-top-2 duration-200 select-none ${className}`}
    >
      {/* Left: App Logo & Description */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="relative flex-none">
          <img
            src="/icon-192.png"
            alt="Super Telecom App"
            className="w-8 h-8 rounded-xl object-contain border border-cyan-500/40 bg-slate-950 shadow-sm"
            onError={(e) => {
              e.currentTarget.src = "/favicon.png";
            }}
          />
          <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full flex items-center justify-center text-[7px] text-slate-950 font-black">
            ⚡
          </span>
        </div>

        <div className="leading-tight min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black text-white tracking-tight truncate">
              Super Telecom Official App
            </span>
            <span className="hidden xs:inline-block text-[8px] font-mono px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">
              FREE
            </span>
          </div>
          <p className="text-[10px] text-slate-300 font-mono truncate">
            16+ Offline Lab Tools &bull; Live Tracker &bull; Zero Bloat
          </p>
        </div>
      </div>

      {/* Right: Install CTA & Dismiss */}
      <div className="flex items-center gap-1.5 flex-none">
        {deferredPrompt ? (
          <button
            type="button"
            onClick={handleInstallClick}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-black text-xs font-mono active:scale-95 transition-all shadow-md shadow-cyan-500/20 flex items-center gap-1 whitespace-nowrap cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Install</span>
          </button>
        ) : (
          <Link
            to="/download"
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-black text-xs font-mono active:scale-95 transition-all shadow-md shadow-cyan-500/20 flex items-center gap-1 whitespace-nowrap cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Get App</span>
          </Link>
        )}

        <button
          type="button"
          onClick={handleDismiss}
          className="p-1 rounded-lg text-slate-400 hover:text-white active:scale-90 transition-transform"
          aria-label="Dismiss install banner"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </aside>
  );
};

export default SmartAppInstallBanner;
