import React, { useState, useEffect } from "react";
import {
  LifeBuoy,
  AlertTriangle,
  PowerOff,
  Droplets,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  X,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  ZapOff,
} from "lucide-react";
import { useHardwarePermissions } from "@/hooks/useHardwarePermissions";

interface WaterRescueWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSpeakerEjector?: () => void;
}

const PHONE = "+918002903643";
const WHATSAPP = "918002903643";

export const WaterRescueWizardModal: React.FC<WaterRescueWizardModalProps> = ({
  isOpen,
  onClose,
  onOpenSpeakerEjector,
}) => {
  const { triggerVibration } = useHardwarePermissions();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [goldenWindowSeconds, setGoldenWindowSeconds] = useState<number>(7200); // 2 hours

  // Countdown timer for golden lab window
  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setGoldenWindowSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const hours = Math.floor(goldenWindowSeconds / 3600);
  const minutes = Math.floor((goldenWindowSeconds % 3600) / 60);
  const seconds = goldenWindowSeconds % 60;

  const handleNext = () => {
    triggerVibration(20);
    setCurrentStep((prev) => Math.min(4, prev + 1));
  };

  const handlePrev = () => {
    triggerVibration(20);
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#030712] border border-cyan-500/30 rounded-3xl p-5 sm:p-6 space-y-5 shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
              <LifeBuoy className="h-6 w-6 animate-spin" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono text-rose-400 font-bold uppercase tracking-wider bg-rose-950 px-2 py-0.5 rounded-full border border-rose-800">
                  Emergency Triage
                </span>
                <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded-full border border-emerald-800">
                  100% Offline
                </span>
              </div>
              <h3 className="font-bold text-base text-white mt-0.5">
                Water Damage Emergency Protocol
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              triggerVibration(15);
              onClose();
            }}
            className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Golden Hour Countdown Banner */}
        <div className="p-3 rounded-2xl bg-gradient-to-r from-rose-950/60 to-slate-900 border border-rose-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-rose-400 shrink-0" />
            <div className="leading-tight">
              <span className="text-[10px] text-slate-400 font-mono block">Lab Golden Hour Window:</span>
              <span className="text-xs font-mono font-bold text-rose-300">
                {hours}h {minutes}m {seconds}s Remaining
              </span>
            </div>
          </div>
          <span className="text-[9px] font-mono text-rose-400 bg-rose-950 px-2 py-0.5 rounded-full border border-rose-800">
            High Survival Chance
          </span>
        </div>

        {/* 4 Step Progress Indicators */}
        <div className="grid grid-cols-4 gap-1.5">
          {[1, 2, 3, 4].map((stepNum) => (
            <button
              key={stepNum}
              type="button"
              onClick={() => {
                triggerVibration(15);
                setCurrentStep(stepNum);
              }}
              className={`py-1.5 rounded-xl text-center text-[10px] font-bold font-mono transition-all ${
                currentStep === stepNum
                  ? "bg-cyan-500 text-slate-950 shadow-md"
                  : currentStep > stepNum
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-slate-900 text-slate-500 border border-slate-800"
              }`}
            >
              Step {stepNum}
            </button>
          ))}
        </div>

        {/* Step Content Card */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 min-h-[170px] flex flex-col justify-between">
          {currentStep === 1 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                <ZapOff className="h-4 w-4" />
                <span>STEP 1: NEVER PLUG IN CHARGER</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Plugging in a charging cable sends <strong>5V to 20V of high electrical current</strong> directly into damp motherboard circuits, instantly frying the Power Management IC (PMIC) and causing irreversible copper corrosion.
              </p>
              <span className="text-[11px] text-rose-300 font-bold block pt-1">
                Immediate Action: Keep charger far away.
              </span>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                <PowerOff className="h-4 w-4" />
                <span>STEP 2: POWER DOWN &amp; EJECT SIM TRAY</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Immediately shut down the device. Eject the SIM tray slot using a pin — this breaks the internal airtight seal and allows trapped vapor pressure to escape rather than condensing into the camera lenses.
              </p>
              <span className="text-[11px] text-cyan-300 font-bold block pt-1">
                Immediate Action: Dry outer casing with cotton cloth. Do NOT use rice or hair dryers.
              </span>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <Droplets className="h-4 w-4" />
                <span>STEP 3: ACOUSTIC SPEAKER EJECTION</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                If the phone is still operating and responsive, trigger the 165Hz sonic acoustic pulse to physically push liquid droplets out of the speaker mesh before they reach the battery connector.
              </p>
              {onOpenSpeakerEjector && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenSpeakerEjector();
                  }}
                  className="mt-1 py-2 px-3 rounded-xl bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 text-xs font-bold flex items-center gap-1.5 active:scale-95"
                >
                  <Droplets className="h-3.5 w-3.5" />
                  <span>Launch 165Hz Acoustic Ejector Now &rarr;</span>
                </button>
              )}
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                <MapPin className="h-4 w-4" />
                <span>STEP 4: BRING TO BARGANDA ROAD LAB</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Super Telecom lab has industrial ultrasonic cleaning tanks and PCB hot-air dehydration stations. Devices brought within 2 hours have a <strong>92%+ complete recovery success rate</strong>.
              </p>
              <div className="pt-1 flex gap-2">
                <a
                  href={`tel:${PHONE}`}
                  className="flex-1 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-center text-xs font-bold flex items-center justify-center gap-1"
                >
                  <Phone className="h-3 w-3" /> Call Lab
                </a>
                <a
                  href={`https://wa.me/${WHATSAPP}?text=EMERGENCY:%20My%20phone%20fell%20in%20water.%20Bringing%20it%20to%20Barganda%20Road%20Lab%20now.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-center text-xs font-bold flex items-center justify-center gap-1"
                >
                  <MessageCircle className="h-3 w-3" /> WhatsApp
                </a>
              </div>
            </div>
          )}

          {/* Stepper controls */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="text-xs text-slate-400 hover:text-white disabled:opacity-30"
            >
              &larr; Previous
            </button>
            <span className="text-[10px] font-mono text-slate-500">
              {currentStep} of 4
            </span>
            <button
              type="button"
              onClick={handleNext}
              disabled={currentStep === 4}
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 disabled:opacity-30"
            >
              Next Step &rarr;
            </button>
          </div>
        </div>

        {/* Footer address info */}
        <div className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
          <MapPin className="h-3 w-3 text-cyan-400" />
          <span>Barganda Road, Near Shivam Clinic, Giridih &bull; Est. 2016</span>
        </div>
      </div>
    </div>
  );
};

export default WaterRescueWizardModal;
