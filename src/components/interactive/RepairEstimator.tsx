import React, { useState } from "react";
import {
  Smartphone,
  Cpu,
  BatteryCharging,
  Zap,
  Droplets,
  Clock,
  ShieldCheck,
  CheckCircle2,
  MessageCircle,
  Wrench,
  ChevronRight,
  Phone,
  HelpCircle,
  Tag,
} from "lucide-react";
import {
  AppleLogo,
  SamsungLogo,
  OnePlusLogo,
  GooglePixelLogo,
  XiaomiLogo,
  VivoLogo,
} from "@/components/icons/BrandVectors";
import { SmartAuthDrawer } from "@/components/auth/SmartAuthDrawer";
import { BUSINESS_MASTER } from "@/config/superTelecomConfig";
import { buildConsultationWhatsAppUrl } from "@/components/consultation/RepairConsultationAction";

interface BrandOption {
  id: string;
  name: string;
  isApple: boolean;
  renderLogo: (props: { size?: number; className?: string }) => React.ReactNode;
}

interface FaultOption {
  id: string;
  label: string;
  sub: string;
  icon: React.ComponentType<{ className?: string }>;
  turnaround: string;
  warranty: string;
}

const BRANDS: BrandOption[] = [
  { id: "apple", name: "Apple iPhone", isApple: true, renderLogo: (p) => <AppleLogo {...p} /> },
  { id: "samsung", name: "Samsung Galaxy", isApple: false, renderLogo: (p) => <SamsungLogo {...p} /> },
  { id: "oneplus", name: "OnePlus", isApple: false, renderLogo: (p) => <OnePlusLogo {...p} /> },
  { id: "google", name: "Google Pixel", isApple: false, renderLogo: (p) => <GooglePixelLogo {...p} /> },
  { id: "xiaomi", name: "Xiaomi / Redmi", isApple: false, renderLogo: (p) => <XiaomiLogo {...p} /> },
  { id: "vivo", name: "Vivo / iQOO", isApple: false, renderLogo: (p) => <VivoLogo {...p} /> },
];

const FAULTS: FaultOption[] = [
  {
    id: "display",
    label: "Display & Touch Screen",
    sub: "Broken glass, black screen, vertical lines, touch response",
    icon: Smartphone,
    turnaround: "30 to 45 Minutes",
    warranty: "Up to 90 Days",
  },
  {
    id: "motherboard",
    label: "Motherboard IC & Dead Phone",
    sub: "No power, boot loop, short circuit, PMIC & CPU reball",
    icon: Cpu,
    turnaround: "Same Day / 24 Hours",
    warranty: "60 Days Warranty",
  },
  {
    id: "battery",
    label: "Battery Replacement",
    sub: "Rapid drain, swelling, shutdown under 30%, charging port",
    icon: BatteryCharging,
    turnaround: "20 to 30 Minutes",
    warranty: "90 Days Warranty",
  },
  {
    id: "amoled-line",
    label: "AMOLED Green / Pink Line",
    sub: "Laser trace restoration without costly full panel swap",
    icon: Zap,
    turnaround: "Same Day / 2 to 4 Hours",
    warranty: "60 Days Warranty",
  },
  {
    id: "water",
    label: "Water Damage Ultrasonic Revival",
    sub: "Ultrasonic chemical de-oxidation & corrosive salt wash",
    icon: Droplets,
    turnaround: "2 to 5 Hours",
    warranty: "Tested & Bench Verified",
  },
];

export const RepairEstimator: React.FC = () => {
  const [selectedBrand, setSelectedBrand] = useState<string>("apple");
  const [selectedFault, setSelectedFault] = useState<string>("display");
  const [selectedPartGrade, setSelectedPartGrade] = useState<"aftermarket" | "oem">("oem");
  const [authDrawerOpen, setAuthDrawerOpen] = useState<boolean>(false);

  const brandObj = BRANDS.find((b) => b.id === selectedBrand) || BRANDS[0];
  const faultObj = FAULTS.find((f) => f.id === selectedFault) || FAULTS[0];

  let componentGrade = "OEM-Grade";
  let gradeBadge = "OEM-Grade";
  let estimatedPrice = "₹899 – ₹2,499";

  if (selectedFault === "display") {
    if (brandObj.isApple) {
      componentGrade = "Original Service Pack / Retina OLED";
      gradeBadge = "Original Service Pack";
      estimatedPrice = "₹3,499 – ₹14,999";
    } else {
      if (selectedPartGrade === "aftermarket") {
        componentGrade = "Compatible Aftermarket (IPS LCD)";
        gradeBadge = "Compatible Aftermarket";
        estimatedPrice = "₹899 – ₹2,499";
      } else {
        componentGrade = "OEM-Grade (AMOLED / High-Gamut)";
        gradeBadge = "OEM-Grade";
        estimatedPrice = "₹2,499 – ₹8,999";
      }
    }
  } else if (selectedFault === "battery") {
    if (brandObj.isApple) {
      componentGrade = "Original Service Pack (BMS Reprogrammed)";
      gradeBadge = "Original Service Pack";
      estimatedPrice = "₹1,899 – ₹4,999";
    } else {
      componentGrade = "OEM-Grade (High-Density Cell)";
      gradeBadge = "OEM-Grade";
      estimatedPrice = "₹699 – ₹2,499";
    }
  } else if (selectedFault === "motherboard") {
    componentGrade = "Laboratory Level BGA Micro-Soldering";
    gradeBadge = "Original Service Pack";
    estimatedPrice = "₹899 – ₹5,999";
  } else if (selectedFault === "amoled-line") {
    componentGrade = "Laser Trace Jumper Bypass";
    gradeBadge = "Laser Restoration";
    estimatedPrice = "₹1,499 – ₹3,999";
  } else if (selectedFault === "water") {
    componentGrade = "Ultrasonic De-Oxidation & Chemical Wash";
    gradeBadge = "Lab Recovery";
    estimatedPrice = "₹499 – ₹2,499";
  }

  const whatsappUrl = buildConsultationWhatsAppUrl({
    brand: brandObj.name,
    serviceName: `${faultObj.label} (${gradeBadge} • ${estimatedPrice})`,
    issue: faultObj.sub,
  });

  return (
    <section
      id="repair-calculator"
      aria-label="Smartphone Repair Consultation Finder"
      className="py-8 sm:py-16 md:py-28 bg-[#020617] text-slate-100 relative overflow-hidden border-t border-slate-800/80"
    >
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-cyan-500/5 blur-[160px] rounded-full -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold uppercase mb-4 shadow-sm">
            <Wrench className="h-3.5 w-3.5 text-cyan-400" />
            Repair Consultation Finder
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Smartphone Repair Consultation Finder
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400 leading-relaxed">
            Select your smartphone manufacturer and hardware symptom below for an instant consultation and service recommendation.
          </p>
        </div>

        {/* Step 1: Select Brand */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              Step 1: Select Brand
            </span>
            <span className="text-xs text-slate-500 font-mono">Giridih In-House Lab</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {BRANDS.map((brand) => {
              const isSelected = selectedBrand === brand.id;
              return (
                <button
                  key={brand.id}
                  type="button"
                  onClick={() => setSelectedBrand(brand.id)}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-200 active:scale-95 min-h-[58px] cursor-pointer ${
                    isSelected
                      ? "bg-slate-900 border-cyan-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400/50"
                      : "bg-slate-950/70 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                  }`}
                >
                  <div className={`mb-2 ${isSelected ? "text-cyan-400" : "text-slate-400"}`}>
                    {brand.renderLogo({ size: 22 })}
                  </div>
                  <span className="text-xs font-bold tracking-tight">{brand.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Select Fault */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              Step 2: Select Hardware Issue
            </span>
            <span className="text-xs text-slate-500 font-mono">Bench Hardware Diagnosis</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {FAULTS.map((fault) => {
              const isSelected = selectedFault === fault.id;
              const Icon = fault.icon;
              return (
                <button
                  key={fault.id}
                  type="button"
                  onClick={() => setSelectedFault(fault.id)}
                  className={`flex flex-col text-left p-4 rounded-2xl border transition-all duration-200 active:scale-95 min-h-[58px] cursor-pointer ${
                    isSelected
                      ? "bg-slate-900 border-cyan-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400/50"
                      : "bg-slate-950/70 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                  }`}
                >
                  <div className={`p-2 w-fit rounded-xl mb-3 ${isSelected ? "bg-cyan-500/10 text-cyan-400" : "bg-slate-900 text-slate-400"}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-bold text-white">{fault.label}</span>
                  <span className="text-[11px] text-slate-400 mt-1 leading-snug">{fault.sub}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Part Grade Toggle for Android Display Repairs */}
        {!brandObj.isApple && selectedFault === "display" && (
          <div className="mb-8 p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-mono uppercase text-cyan-400 font-bold flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5" /> Component Grade Selection
              </span>
              <p className="text-xs text-slate-400 mt-0.5">
                Choose between budget-friendly LCD replacement or factory-standard AMOLED panel:
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSelectedPartGrade("aftermarket")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedPartGrade === "aftermarket"
                    ? "bg-cyan-500 text-slate-950 shadow-md"
                    : "bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                }`}
              >
                Compatible Aftermarket (IPS LCD)
              </button>
              <button
                type="button"
                onClick={() => setSelectedPartGrade("oem")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedPartGrade === "oem"
                    ? "bg-cyan-500 text-slate-950 shadow-md"
                    : "bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                }`}
              >
                OEM-Grade AMOLED
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Specification Sheet */}
        <div className="rounded-3xl border border-cyan-500/30 bg-slate-900/90 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase">
                  Service Recommendation
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold">
                  {gradeBadge}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                {brandObj.name} • {faultObj.label}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Performed in-house with calibrated BGA stations &amp; optical microscope alignment at Barganda Road, Giridih.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 bg-slate-950/80 px-5 py-3 rounded-2xl border border-slate-800">
              <span className="text-xs font-mono text-slate-400 uppercase">Estimated Price:</span>
              <span className="text-xl sm:text-2xl font-black font-mono text-emerald-400">
                {estimatedPrice}
              </span>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                Inc. 18% GST (SAC 998713)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-950/50 border border-slate-800">
              <div className="p-2.5 rounded-xl bg-cyan-950/60 text-cyan-400 border border-cyan-500/20">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <div className="text-[11px] font-mono text-slate-400 uppercase">Turnaround Time</div>
                <div className="text-sm font-bold text-white mt-0.5">{faultObj.turnaround}</div>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-950/50 border border-slate-800">
              <div className="p-2.5 rounded-xl bg-blue-950/60 text-blue-400 border border-blue-500/20">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="text-[11px] font-mono text-slate-400 uppercase">Component Grade</div>
                <div className="text-sm font-bold text-white mt-0.5">{componentGrade}</div>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-950/50 border border-slate-800">
              <div className="p-2.5 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <div className="text-[11px] font-mono text-slate-400 uppercase">Service Guarantee</div>
                <div className="text-sm font-bold text-white mt-0.5">{faultObj.warranty}</div>
              </div>
            </div>
          </div>

          {/* Consultation & GST Note */}
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-slate-300 mb-6">
            <HelpCircle className="h-4 w-4 text-cyan-400 flex-none mt-0.5" />
            <div className="space-y-1">
              <strong className="text-cyan-300 block">Official GST Tax Invoice &amp; Transparent Estimates:</strong>
              <p>
                All prices are inclusive of 18% GST (SAC Code 998713). Printed GST tax invoice and up to 90 days physical warranty card are issued with every repair. Final service requirements are confirmed after physical device bench check at our Barganda Road lab before repair work begins.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setAuthDrawerOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 px-6 py-3.5 text-xs sm:text-sm font-bold shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all hover:scale-[1.02] active:scale-95 min-h-[46px] w-full sm:w-auto cursor-pointer"
            >
              <span>GET CONSULTATION</span>
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-6 py-3.5 text-xs sm:text-sm font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:scale-[1.02] active:scale-95 min-h-[46px] w-full sm:w-auto cursor-pointer"
            >
              <MessageCircle className="h-4 w-4" />
              <span>WHATSAPP ENQUIRY</span>
              <ChevronRight className="h-4 w-4" />
            </a>

            <a
              href={BUSINESS_MASTER.phoneCallHref}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 px-6 py-3.5 text-xs sm:text-sm font-bold transition-all hover:scale-[1.02] active:scale-95 min-h-[46px] w-full sm:w-auto cursor-pointer"
            >
              <Phone className="h-4 w-4 text-cyan-400" />
              <span>CALL NOW</span>
            </a>
          </div>
        </div>
      </div>

      <SmartAuthDrawer
        isOpen={authDrawerOpen}
        onClose={() => setAuthDrawerOpen(false)}
        actionTitle={`Repair Consultation for ${brandObj.name} (${faultObj.label})`}
        onSuccess={() => {
          window.open(whatsappUrl, "_blank", "noopener,noreferrer");
        }}
      />
    </section>
  );
};

export default RepairEstimator;
