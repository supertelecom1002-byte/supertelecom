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
  Sparkles,
} from "lucide-react";
import {
  AppleLogo,
  SamsungLogo,
  OnePlusLogo,
  GooglePixelLogo,
  XiaomiLogo,
  VivoLogo,
} from "@/components/icons/BrandVectors";

interface BrandOption {
  id: string;
  name: string;
  renderLogo: (props: { size?: number; className?: string }) => React.ReactNode;
}

interface FaultOption {
  id: string;
  label: string;
  sub: string;
  icon: React.ComponentType<{ className?: string }>;
  turnaround: string;
  warranty: string;
  basePrice: string;
}

const BRANDS: BrandOption[] = [
  { id: "apple", name: "Apple iPhone", renderLogo: (p) => <AppleLogo {...p} /> },
  { id: "samsung", name: "Samsung Galaxy", renderLogo: (p) => <SamsungLogo {...p} /> },
  { id: "oneplus", name: "OnePlus", renderLogo: (p) => <OnePlusLogo {...p} /> },
  { id: "google", name: "Google Pixel", renderLogo: (p) => <GooglePixelLogo {...p} /> },
  { id: "xiaomi", name: "Xiaomi / Redmi", renderLogo: (p) => <XiaomiLogo {...p} /> },
  { id: "vivo", name: "Vivo / iQOO", renderLogo: (p) => <VivoLogo {...p} /> },
];

const FAULTS: FaultOption[] = [
  {
    id: "display",
    label: "Display / Touch Glass",
    sub: "Broken glass, black screen, touch issue",
    icon: Smartphone,
    turnaround: "30 to 45 Minutes",
    warranty: "Up to 90 Days",
    basePrice: "₹1,299 – ₹7,999",
  },
  {
    id: "motherboard",
    label: "Dead Phone / Motherboard IC",
    sub: "No power, boot loop, short circuit, CPU",
    icon: Cpu,
    turnaround: "Same Day / 24 Hours",
    warranty: "Up to 60 Days",
    basePrice: "₹799 – ₹3,499",
  },
  {
    id: "battery",
    label: "Battery Degradation / Port",
    sub: "Rapid drain, swelling, loose charging port",
    icon: BatteryCharging,
    turnaround: "20 to 30 Minutes",
    warranty: "90 Days Warranty",
    basePrice: "₹450 – ₹2,199",
  },
  {
    id: "amoled-line",
    label: "AMOLED Green / Pink Line",
    sub: "Laser line fix without full panel swap",
    icon: Zap,
    turnaround: "Same Day / 2 to 4 Hours",
    warranty: "Up to 60 Days",
    basePrice: "₹1,499 – ₹3,999",
  },
  {
    id: "water",
    label: "Liquid / Water Intrusion",
    sub: "Ultrasonic chemical wash & corrosion fix",
    icon: Droplets,
    turnaround: "2 to 5 Hours",
    warranty: "Lab Tested Verified",
    basePrice: "₹499 – ₹2,499",
  },
];

export const RepairEstimator: React.FC = () => {
  const [selectedBrand, setSelectedBrand] = useState<string>("apple");
  const [selectedFault, setSelectedFault] = useState<string>("display");

  const brandObj = BRANDS.find((b) => b.id === selectedBrand) || BRANDS[0];
  const faultObj = FAULTS.find((f) => f.id === selectedFault) || FAULTS[0];

  const whatsappMessage = `Hi Super Telecom Lab, I need an engineer quote for my ${brandObj.name} with ${faultObj.label} (${faultObj.sub}).`;
  const whatsappUrl = `https://wa.me/918002903643?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <section
      id="repair-calculator"
      aria-label="Smartphone Repair Cost Calculator"
      className="py-20 md:py-28 bg-[#020617] text-slate-100 relative overflow-hidden border-t border-slate-800/80"
    >
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-cyan-500/5 blur-[160px] rounded-full -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold uppercase mb-4 shadow-sm">
            <Wrench className="h-3.5 w-3.5 text-cyan-400" />
            Interactive Hardware Estimator
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Instant Repair Estimation Matrix
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400 leading-relaxed">
            Select your smartphone manufacturer and hardware symptom below for an instant lab specification breakdown.
          </p>
        </div>

        {/* Step 1: Select Brand */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              Step 1: Select Brand
            </span>
            <span className="text-xs text-slate-500 font-mono">6 Flagship OEMs Supported</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {BRANDS.map((brand) => {
              const isSelected = selectedBrand === brand.id;
              return (
                <button
                  key={brand.id}
                  type="button"
                  onClick={() => setSelectedBrand(brand.id)}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-200 active:scale-95 min-h-[58px] ${
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
            <span className="text-xs text-slate-500 font-mono">Direct Lab Diagnosis</span>
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
                  className={`flex flex-col text-left p-4 rounded-2xl border transition-all duration-200 active:scale-95 min-h-[58px] ${
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

        {/* Dynamic Specification Sheet */}
        <div className="rounded-3xl border border-cyan-500/30 bg-slate-900/90 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase">
                Hardware Specification Sheet
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                {brandObj.name} • {faultObj.label}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Performed in-house with calibrated BGA stations &amp; optical microscope alignment.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 bg-slate-950/80 px-5 py-3 rounded-2xl border border-slate-800">
              <span className="text-xs font-mono text-slate-400 uppercase">Estimated Lab Range:</span>
              <span className="text-2xl font-extrabold font-mono text-emerald-400">
                {faultObj.basePrice}
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
                <div className="text-sm font-bold text-white mt-0.5">OEM / Factory Calibrated</div>
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

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
              Free diagnosis available on-the-spot at our Barganda Road shop before any work starts.
            </p>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-6 py-4 text-sm font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:scale-[1.02] active:scale-95 min-h-[48px] w-full sm:w-auto"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Get Engineer Quote via WhatsApp</span>
              <ChevronRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RepairEstimator;
