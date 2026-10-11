import React, { useState } from "react";
import {
  Volume2,
  Smartphone,
  Bell,
  Activity,
  Shield,
  CheckCircle2,
  X,
  Zap,
} from "lucide-react";
import { HardwarePermissionType, useHardwarePermissions } from "@/hooks/useHardwarePermissions";

interface PermissionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onAllowed: () => void;
  requiredPermissions: HardwarePermissionType[];
  title?: string;
  description?: string;
}

const MODULE_INFO: Record<
  HardwarePermissionType,
  { label: string; icon: React.FC<{ className?: string }>; detail: string }
> = {
  audio: {
    label: "High-Frequency Audio",
    icon: Volume2,
    detail: "Drives 165Hz - 250Hz acoustic waves for speaker water & dust ejection",
  },
  wakeLock: {
    label: "Display WakeLock",
    icon: Smartphone,
    detail: "Prevents screen timeout and dimming during full-screen digitizer and pixel inspection",
  },
  vibration: {
    label: "Haptic Motor",
    icon: Zap,
    detail: "Delivers rapid mechanical pulse feedback to dislodge dust particles",
  },
  notifications: {
    label: "Real-Time Alerts",
    icon: Bell,
    detail: "Notifies when background battery charging limits are reached or repairs are ready",
  },
  sensors: {
    label: "Motion & Orientation",
    icon: Activity,
    detail: "Monitors accelerometer data to detect unauthorized device pickup or unplugging",
  },
};

export const PermissionSheet: React.FC<PermissionSheetProps> = ({
  isOpen,
  onClose,
  onAllowed,
  requiredPermissions,
  title = "Hardware Access Required",
  description = "Super Telecom requires device hardware permissions to drive ultrasonic speaker vibration and keep your display active during testing.",
}) => {
  const { requestAllHardwareSuite, triggerVibration } = useHardwarePermissions();
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  if (!isOpen) return null;

  const handleAllow = async () => {
    setIsAuthorizing(true);
    triggerVibration([50, 30, 50]);
    try {
      await requestAllHardwareSuite(requiredPermissions);
      setIsAuthorizing(false);
      onAllowed();
    } catch {
      setIsAuthorizing(false);
      onAllowed();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex flex-col justify-end bg-black/80 backdrop-blur-md animate-in fade-in select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg mx-auto bg-slate-950 border-t border-slate-800 rounded-t-3xl p-5 sm:p-6 shadow-2xl relative animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Android style drag pill */}
        <div className="w-12 h-1.5 rounded-full bg-slate-700/80 mx-auto mb-4" />

        {/* Header with official app logo */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src="/icon-192.png"
              alt="Super Telecom Official Logo"
              className="w-11 h-11 object-contain rounded-2xl shadow-md border border-cyan-500/20 bg-slate-900 p-1"
              onError={(e) => {
                e.currentTarget.src = "/logo.png";
              }}
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-800/60">
                  Android Hardware Permission
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">{title}</h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white active:scale-95 transition-all"
            aria-label="Close permission dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-300 leading-relaxed mt-3">
          {description}
        </p>

        {/* Module chips / badges */}
        <div className="mt-4 space-y-2">
          {requiredPermissions.map((key) => {
            const info = MODULE_INFO[key];
            if (!info) return null;
            const Icon = info.icon;
            return (
              <div
                key={key}
                className="flex items-start gap-3 p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800/80"
              >
                <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0 mt-0.5">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-bold text-white block">
                    {info.label}
                  </span>
                  <span className="text-[11px] text-slate-400 block leading-tight mt-0.5">
                    {info.detail}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security assurance */}
        <div className="flex items-center gap-2 mt-4 px-3 py-2 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-[11px] text-emerald-300">
          <Shield className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
          <span>All diagnostics run directly on your browser hardware. Zero telemetry.</span>
        </div>

        {/* Android style Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-5">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-850 active:scale-95 text-slate-300 font-semibold text-xs border border-slate-800 transition-all text-center"
          >
            Not Now
          </button>

          <button
            type="button"
            onClick={handleAllow}
            disabled={isAuthorizing}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-95 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all text-center flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>{isAuthorizing ? "Enabling..." : "Allow & Continue"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
