import React, { useState } from "react";
import {
  Search,
  X,
  Clock,
  CheckCircle2,
  Cpu,
  Smartphone,
  ShieldCheck,
  MessageCircle,
  AlertCircle,
  Phone,
  Check,
  Lock,
} from "lucide-react";
import {
  findRepairJobSecure,
  maskCustomerPhone,
  maskCustomerName,
  type RepairJob,
  STAGE_METADATA,
  type RepairStage,
  buildWhatsAppStatusUrl,
} from "@/services/repairJobsService";
import { BUSINESS_MASTER } from "@/config/superTelecomConfig";

interface RepairTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

const ORDERED_STAGES: RepairStage[] = [
  "received",
  "diagnosing",
  "qc_testing",
  "ready",
];

export const RepairTrackerModal: React.FC<RepairTrackerModalProps> = ({
  isOpen,
  onClose,
  initialQuery = "",
}) => {
  const [jobId, setJobId] = useState(initialQuery);
  const [phoneLast4, setPhoneLast4] = useState("");
  const [loading, setLoading] = useState(false);
  const [job, setJob] = useState<RepairJob | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanId = jobId.trim().toUpperCase();
    const cleanDigits = phoneLast4.replace(/\D/g, "");

    if (!cleanId) {
      setErrorMsg("Please enter your Job Sheet ID (e.g. ST-8821).");
      return;
    }
    if (cleanDigits.length !== 4) {
      setErrorMsg("Please enter the last 4 digits of your registered phone number.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const match = await findRepairJobSecure(cleanId, cleanDigits);
      if (match) {
        setJob(match);
      } else {
        setErrorMsg(
          `No active repair job found matching Job ID "${cleanId}" with phone ending in "${cleanDigits}". Please verify your job sheet or contact our lab desk.`
        );
        setJob(null);
      }
    } catch {
      setErrorMsg("Failed to query repair database. Please try again or WhatsApp our engineer.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const currentStageIndex = job
    ? ORDERED_STAGES.indexOf(job.current_stage === "delivered" ? "ready" : job.current_stage)
    : -1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in select-none"
      onClick={onClose}
    >
      <div
        data-lenis-prevent
        className="w-full max-w-xl bg-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-5 shadow-2xl relative text-white max-h-[92vh] overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Live Job Sheet &amp; Repair Tracker</h3>
              <p className="text-xs text-slate-400">Secure Two-Factor Bench Status &amp; QC Pipeline</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Secure Search Bar */}
        <form onSubmit={handleSearch} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
            <div className="sm:col-span-7 relative">
              <Search className="h-4 w-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Job Sheet ID (e.g. ST-8821)..."
                value={jobId}
                onChange={(e) => setJobId(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 uppercase font-mono"
              />
            </div>
            <div className="sm:col-span-3 relative">
              <Lock className="h-4 w-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                maxLength={4}
                placeholder="Phone Last 4"
                value={phoneLast4}
                onChange={(e) => setPhoneLast4(e.target.value.replace(/\D/g, ""))}
                className="w-full pl-9 pr-3 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={loading || !jobId.trim() || phoneLast4.length !== 4}
                className="w-full h-full py-3 px-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? "..." : "Track"}
              </button>
            </div>
          </div>
        </form>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <Lock className="h-3 w-3 text-cyan-400 shrink-0" />
          <span>Two-factor check protects customer repair information and contact privacy.</span>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2.5">
            <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Job Details Card */}
        {job && (
          <div className="space-y-6 pt-2 animate-in fade-in">
            {/* Summary Header */}
            <div className="p-4.5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-base text-cyan-400">{job.id}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30 uppercase">
                    {(STAGE_METADATA[job.current_stage] || STAGE_METADATA.received)?.label || "IN PROGRESS"}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-white mt-1">{job.device_model}</h4>
                <p className="text-xs text-slate-400">Customer: {maskCustomerName(job.customer_name)} &bull; {maskCustomerPhone(job.customer_phone)}</p>
              </div>

              <div className="text-left sm:text-right border-t sm:border-t-0 border-slate-800 pt-2 sm:pt-0">
                <div className="text-[10px] font-mono uppercase text-slate-400">Estimated Cost</div>
                <div className="text-xl font-mono font-black text-emerald-400">
                  ₹{(job.estimated_cost ?? 0).toLocaleString()}
                </div>
              </div>
            </div>

            {/* 4-Stage Visual Progress Stepper */}
            <div className="space-y-4">
              <h5 className="font-bold text-xs uppercase tracking-wider text-slate-400 font-mono">
                Real-Time Lab Pipeline
              </h5>

              <div className="space-y-3 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
                {ORDERED_STAGES.map((st, idx) => {
                  const meta = STAGE_METADATA[st] || STAGE_METADATA.received;
                  const isCompleted = currentStageIndex > idx;
                  const isCurrent = currentStageIndex === idx;

                  return (
                    <div key={st} className="flex items-start gap-4 relative">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all z-10 ${
                          isCompleted
                            ? "bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                            : isCurrent
                            ? "bg-cyan-500 text-slate-950 animate-pulse shadow-[0_0_15px_rgba(6,182,212,0.6)]"
                            : "bg-slate-900 border border-slate-700 text-slate-500"
                        }`}
                      >
                        {isCompleted ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : idx + 1}
                      </div>

                      <div className="flex-1 pb-1">
                        <div className="flex items-center justify-between">
                          <span
                            className={`font-bold text-xs ${
                              isCurrent
                                ? "text-cyan-400"
                                : isCompleted
                                ? "text-white"
                                : "text-slate-500"
                            }`}
                          >
                            {meta.label}
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-500/30 animate-pulse">
                              Active Stage
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                          {meta.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Notes Section */}
            {job.notes && (
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300">
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold block mb-1">
                  Master Technician Diagnosis Log:
                </span>
                <p className="text-slate-300 leading-relaxed">{job.notes}</p>
              </div>
            )}

            {/* WhatsApp Contact Action */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <a
                href={buildWhatsAppStatusUrl(job)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Chat with Assigned Lab Technician</span>
              </a>

              <a
                href={`tel:${BUSINESS_MASTER.phoneRaw}`}
                className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <Phone className="h-4 w-4 text-cyan-400" />
                <span>Direct Call Lab</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RepairTrackerModal;
