import React, { useState } from "react";
import { CheckCircle2, AlertTriangle, XCircle, Share2, Copy, Check, RotateCcw, X, ShieldCheck, Sparkles } from "lucide-react";

interface UsedPhoneAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AuditPoint {
  id: string;
  category: "Display & Body" | "Sensors & Camera" | "Battery & Power" | "Account & Security";
  title: string;
  instructions: string;
}

const AUDIT_POINTS: AuditPoint[] = [
  {
    id: "truetone_display",
    category: "Display & Body",
    title: "TrueTone & Original Display IC",
    instructions: "Check if TrueTone option toggles in Control Center and color temperature shifts warmly.",
  },
  {
    id: "touch_matrix",
    category: "Display & Body",
    title: "Touch Digitizer & Multi-Touch",
    instructions: "Hold an app icon and drag across all edges. Ensure icon doesn't drop prematurely.",
  },
  {
    id: "housing_glass",
    category: "Display & Body",
    title: "Frame Alignment & Back Glass",
    instructions: "Look for gaps between frame and glass indicating non-professional battery swelling or repair.",
  },
  {
    id: "biometrics",
    category: "Sensors & Camera",
    title: "Face ID / Fingerprint Scanner",
    instructions: "Enroll face or thumbprint. Verify it unlocks instantly without sensor hardware error.",
  },
  {
    id: "camera_ois",
    category: "Sensors & Camera",
    title: "Camera Sensors (0.5x, 1x, 3x) & OIS",
    instructions: "Switch between ultra-wide, standard, and telephoto lenses. Verify optical autofocus locks.",
  },
  {
    id: "mic_speaker",
    category: "Sensors & Camera",
    title: "Dual Stereo Speakers & Earpiece",
    instructions: "Record a 5-second voice note holding phone at arm's length. Play back to test all mics.",
  },
  {
    id: "battery_health",
    category: "Battery & Power",
    title: "Battery Maximum Capacity (>80%)",
    instructions: "Check Settings > Battery Health. Above 80% with zero 'Service' warnings is mandatory.",
  },
  {
    id: "charging_port",
    category: "Battery & Power",
    title: "Fast Charging Port & Wobble Check",
    instructions: "Plug cable in. Wiggle gently. Cable should snap firmly without intermittent disconnects.",
  },
  {
    id: "lci_water",
    category: "Battery & Power",
    title: "SIM Tray Liquid Contact Indicator (LCI)",
    instructions: "Eject SIM tray and shine torch inside. White = Safe. Pink/Red = Water submerged.",
  },
  {
    id: "network_radio",
    category: "Account & Security",
    title: "5G/4G SIM Detection & Calling",
    instructions: "Insert active SIM card. Make a 30-second phone call to verify radio IC and proximity sensor.",
  },
  {
    id: "imei_clean",
    category: "Account & Security",
    title: "Clean IMEI & Hardware Match",
    instructions: "Dial *#06#. Verify IMEI on screen matches exactly with the SIM tray laser engraving.",
  },
  {
    id: "frp_icloud",
    category: "Account & Security",
    title: "iCloud / Google FRP Completely Logged Out",
    instructions: "Perform full factory erase in front of seller. Phone must boot to welcome setup screen without password prompt.",
  },
];

export const UsedPhoneAuditModal: React.FC<UsedPhoneAuditModalProps> = ({ isOpen, onClose }) => {
  const [checkedIds, setCheckedIds] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const toggleCheck = (id: string) => {
    setCheckedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleReset = () => {
    setCheckedIds({});
  };

  const passedCount = Object.values(checkedIds).filter(Boolean).length;
  const score = Math.round((passedCount / AUDIT_POINTS.length) * 100);

  let grade = "High Risk • Defective";
  let gradeColor = "text-rose-400";
  let gradeBg = "bg-rose-950/80 border-rose-500/40";

  if (score >= 90) {
    grade = "Grade A+ • Mint Condition, Certified Safe to Buy";
    gradeColor = "text-emerald-400";
    gradeBg = "bg-emerald-950/80 border-emerald-500/40";
  } else if (score >= 75) {
    grade = "Grade B • Moderate Condition, Negotiate Price";
    gradeColor = "text-amber-400";
    gradeBg = "bg-amber-950/80 border-amber-500/40";
  }

  const handleShare = () => {
    const text = [
      `*Super Telecom Used Phone Audit Summary*`,
      `Health Score: ${score}% (${passedCount}/${AUDIT_POINTS.length} Tests Passed)`,
      `Condition Assessment: ${grade}`,
      "",
      `Tested Checklist:`,
      ...AUDIT_POINTS.map((p) => `${checkedIds[p.id] ? "[PASS]" : "[FAIL]"} ${p.title}`),
      "",
      "Evaluated using Super Telecom Giridih Engineering Diagnostic Tool",
      "Barganda Road, Giridih • WhatsApp: +91 80029 03643",
    ].join("\n");

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl relative text-white max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between flex-none">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Used Phone Inspection Checklist</h3>
              <p className="text-xs text-slate-400">12-Point Hardware &amp; Blacklist Verification</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              title="Reset Checklist"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Live Scorecard Banner */}
        <div className={`p-4 rounded-2xl border flex items-center justify-between flex-none ${gradeBg}`}>
          <div className="space-y-0.5">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-300">
              Overall Hardware Health Score
            </div>
            <div className={`font-bold text-sm ${gradeColor}`}>{grade}</div>
          </div>

          <div className="font-mono text-3xl font-black text-white pl-4">
            {score}%
          </div>
        </div>

        {/* Checklist Items (Scrollable) */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 no-scrollbar">
          {AUDIT_POINTS.map((item, idx) => {
            const isPassed = Boolean(checkedIds[item.id]);
            return (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                  isPassed
                    ? "bg-slate-900/90 border-cyan-500/40"
                    : "bg-slate-900/40 border-slate-800/80 hover:border-slate-700"
                }`}
              >
                <div className="mt-0.5">
                  {isPassed ? (
                    <CheckCircle2 className="h-5 w-5 text-cyan-400 shrink-0" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-slate-700 shrink-0" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white">
                      {idx + 1}. {item.title}
                    </span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    {item.instructions}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex-none pt-2 flex gap-3">
          <button
            type="button"
            onClick={handleShare}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-95 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                <span>Audit Summary Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Copy Shareable Inspection Report</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsedPhoneAuditModal;
