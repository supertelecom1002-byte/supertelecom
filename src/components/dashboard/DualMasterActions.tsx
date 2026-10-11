import React, { useState } from "react";
import { Zap, Stethoscope } from "lucide-react";
import { TurboCleanModal } from "./TurboCleanModal";
import { DoctorDiagnosticModal } from "./DoctorDiagnosticModal";
import { playDoctorHeartbeat, playTrashCleanSweep } from "@/components/scanner/cyberAudio";

interface DualMasterActionsProps {
  onOpenClean?: () => void;
  onOpenDoctor?: () => void;
  className?: string;
}

export const DualMasterActions: React.FC<DualMasterActionsProps> = ({
  onOpenClean,
  onOpenDoctor,
  className = "",
}) => {
  const [internalCleanOpen, setInternalCleanOpen] = useState(false);
  const [internalDoctorOpen, setInternalDoctorOpen] = useState(false);

  const triggerHaptic = (ms = 15) => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(ms);
      } catch {
        // ignore
      }
    }
  };

  const openCleanModal = () => {
    triggerHaptic(20);
    playTrashCleanSweep();
    if (onOpenClean) {
      onOpenClean();
    } else {
      setInternalCleanOpen(true);
    }
  };

  const openDoctorDiagnosticModal = () => {
    triggerHaptic(20);
    playDoctorHeartbeat();
    if (onOpenDoctor) {
      onOpenDoctor();
    } else {
      setInternalDoctorOpen(true);
    }
  };

  return (
    <>
      {/* Grid Layout: 2 Primary Master Cards */}
      <div className={`grid grid-cols-2 gap-3 px-3 pt-2 pb-4 ${className}`}>
        {/* MASTER BUTTON 1: CLEAN & SPEED BOOST */}
        <button
          type="button"
          onClick={() => openCleanModal()}
          className="relative overflow-hidden p-4 rounded-2xl bg-gradient-to-br from-cyan-50 via-white to-slate-50 dark:from-cyan-950/40 dark:via-slate-900 dark:to-slate-950 border border-cyan-300 dark:border-cyan-500/30 hover:border-cyan-400 dark:hover:border-cyan-400/60 text-left active:scale-[0.97] transition-all shadow-md dark:shadow-lg dark:shadow-cyan-950/20 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-3 border border-cyan-200 dark:border-cyan-500/30 group-hover:scale-105 transition-transform">
            <Zap className="w-6 h-6 animate-pulse" />
          </div>
          <span className="text-[11px] font-mono tracking-wider uppercase text-cyan-600 dark:text-cyan-400 font-bold block">
            1-Tap Booster
          </span>
          <h3 className="text-sm font-black text-slate-900 dark:text-white leading-tight mt-0.5">
            360° Turbo Clean &amp; Boost
          </h3>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
            Purge cache, RAM &amp; lag
          </p>
        </button>

        {/* MASTER BUTTON 2: FULL DOCTOR DIAGNOSTIC */}
        <button
          type="button"
          onClick={() => openDoctorDiagnosticModal()}
          className="relative overflow-hidden p-4 rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-slate-50 dark:from-emerald-950/40 dark:via-slate-900 dark:to-slate-950 border border-emerald-300 dark:border-emerald-500/30 hover:border-emerald-400 dark:hover:border-emerald-400/60 text-left active:scale-[0.97] transition-all shadow-md dark:shadow-lg dark:shadow-emerald-950/20 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-3 border border-emerald-200 dark:border-emerald-500/30 group-hover:scale-105 transition-transform">
            <Stethoscope className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <span className="text-[11px] font-mono tracking-wider uppercase text-emerald-600 dark:text-emerald-400 font-bold block">
            Lab Doctor
          </span>
          <h3 className="text-sm font-black text-slate-900 dark:text-white leading-tight mt-0.5">
            Full Hardware Checkup
          </h3>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
            Amperes, IC, Display &amp; Health
          </p>
        </button>
      </div>

      {/* Internal Modals */}
      <TurboCleanModal
        isOpen={internalCleanOpen}
        onClose={() => setInternalCleanOpen(false)}
      />
      <DoctorDiagnosticModal
        isOpen={internalDoctorOpen}
        onClose={() => setInternalDoctorOpen(false)}
      />
    </>
  );
};

export default DualMasterActions;
