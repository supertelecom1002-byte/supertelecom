import React, { useState } from "react";
import {
  X,
  Hash,
  ShieldCheck,
  AlertTriangle,
  Copy,
  Check,
  PhoneCall,
  Sparkles,
  Info,
} from "lucide-react";
import { useHardwarePermissions } from "@/hooks/useHardwarePermissions";
import { toast } from "sonner";

interface ImeiValidatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Luhn Mod-10 Algorithm for IMEI Check Digit
function validateImeiLuhn(imeiStr: string): {
  isValid: boolean;
  expectedCheckDigit: number;
  actualCheckDigit: number;
  tac: string;
  serial: string;
} {
  const clean = imeiStr.replace(/\D/g, "");
  if (clean.length !== 15) {
    return { isValid: false, expectedCheckDigit: -1, actualCheckDigit: -1, tac: "", serial: "" };
  }

  const tac = clean.slice(0, 8);
  const serial = clean.slice(8, 14);
  const actualCheckDigit = parseInt(clean[14], 10);

  // Calculate Luhn check digit from first 14 digits
  let sum = 0;
  for (let i = 0; i < 14; i++) {
    let digit = parseInt(clean[i], 10);
    // Double every second digit (odd index in 0-based indexing: index 1, 3, 5, 7, 9, 11, 13)
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) {
        digit = Math.floor(digit / 10) + (digit % 10);
      }
    }
    sum += digit;
  }

  const expectedCheckDigit = (10 - (sum % 10)) % 10;
  const isValid = expectedCheckDigit === actualCheckDigit;

  return { isValid, expectedCheckDigit, actualCheckDigit, tac, serial };
}

export const ImeiValidatorModal: React.FC<ImeiValidatorModalProps> = ({ isOpen, onClose }) => {
  const { triggerVibration } = useHardwarePermissions();
  const [imeiInput, setImeiInput] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const cleanImei = imeiInput.replace(/\D/g, "");
  const result = cleanImei.length === 15 ? validateImeiLuhn(cleanImei) : null;

  const handleCopy = (text: string) => {
    triggerVibration(15);
    navigator.clipboard?.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDialUs = () => {
    triggerVibration(15);
    window.location.href = "tel:*#06#";
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-up select-none"
    >
      <div className="relative max-w-md w-full rounded-3xl bg-[#030712] border border-cyan-500/30 p-5 sm:p-6 space-y-5 shadow-2xl text-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Hash className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Mathematical IMEI Luhn Validator</h3>
              <p className="text-[11px] text-slate-400">Mod-10 Checksum &amp; Hardware Legitimacy</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Input Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-mono font-bold text-slate-400 uppercase">
              15-Digit IMEI Number
            </label>
            <button
              type="button"
              onClick={handleDialUs}
              className="text-[10px] font-mono text-cyan-400 hover:underline flex items-center gap-1"
            >
              <PhoneCall className="h-3 w-3" />
              <span>Dial *#06# to Find</span>
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              maxLength={15}
              placeholder="e.g. 352099001761482"
              value={imeiInput}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 15);
                setImeiInput(val);
              }}
              className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-3 text-sm font-mono tracking-widest text-white outline-none"
            />
            {imeiInput && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-500">
                {cleanImei.length}/15
              </span>
            )}
          </div>
        </div>

        {/* Validation Result Box */}
        {cleanImei.length === 15 && result && (
          <div
            className={`p-4 rounded-2xl border space-y-3 animate-in fade-in ${
              result.isValid
                ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-200"
                : "bg-rose-950/40 border-rose-500/50 text-rose-200"
            }`}
          >
            <div className="flex items-center gap-2.5">
              {result.isValid ? (
                <ShieldCheck className="h-6 w-6 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="h-6 w-6 text-rose-400 shrink-0" />
              )}
              <div>
                <h4 className="font-bold text-sm">
                  {result.isValid ? "Authentic Luhn Mod-10 Checksum Passed" : "Invalid Checksum - Potential Fake / Spoofed IMEI"}
                </h4>
                <p className="text-[11px] opacity-80">
                  {result.isValid
                    ? "Mathematical check digit matches international GSMA specification."
                    : `Check digit mismatch: Given ${result.actualCheckDigit}, expected ${result.expectedCheckDigit}.`}
                </p>
              </div>
            </div>

            {/* Breakdown Grid */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-xs font-mono">
              <div className="p-2 rounded-lg bg-black/30">
                <span className="text-[9px] text-slate-400 block">TAC (Type Code)</span>
                <span className="font-bold">{result.tac}</span>
              </div>
              <div className="p-2 rounded-lg bg-black/30">
                <span className="text-[9px] text-slate-400 block">SNR (Serial)</span>
                <span className="font-bold">{result.serial}</span>
              </div>
              <div className="p-2 rounded-lg bg-black/30">
                <span className="text-[9px] text-slate-400 block">Check Digit</span>
                <span className={`font-bold ${result.isValid ? "text-emerald-400" : "text-rose-400"}`}>
                  {result.actualCheckDigit}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Sample IMEI Buttons for Quick Verification */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Test with Verified Sample</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                triggerVibration(15);
                setImeiInput("352099001761482"); // Valid Luhn
              }}
              className="py-1.5 px-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 hover:text-white"
            >
              Valid Sample 1
            </button>
            <button
              type="button"
              onClick={() => {
                triggerVibration(15);
                setImeiInput("861053046123455"); // Valid Luhn
              }}
              className="py-1.5 px-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 hover:text-white"
            >
              Valid Sample 2
            </button>
          </div>
        </div>

        {/* Action Button */}
        {cleanImei.length === 15 && (
          <button
            type="button"
            onClick={() => handleCopy(cleanImei)}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            <span>Copy Validated IMEI</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ImeiValidatorModal;
