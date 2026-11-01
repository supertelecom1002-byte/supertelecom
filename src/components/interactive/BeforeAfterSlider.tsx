import React, { useState, useRef, useCallback } from "react";
import {
  SlidersHorizontal,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  FileText,
  Microscope,
  ShieldCheck,
  Cpu,
  X,
  MessageCircle,
  Wrench,
  Sparkles,
} from "lucide-react";
import { BUSINESS_MASTER } from "@/config/superTelecomConfig";

interface CaseStudy {
  id: string;
  tabLabel: string;
  title: string;
  description: string;
  beforeImg: string;
  afterImg: string;
  damageTag: string;
  restoredTag: string;
  specs: string[];
  microscopeFindings: string;
  faultCause: string;
  procedure: string[];
  warrantyInfo: string;
  benchStation: string;
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: "iphone-glass",
    tabLabel: "iPhone Glass Restoration",
    title: "iPhone Display Glass Refurbishment",
    description: "Shattered front gorilla glass replaced using precision cryo-separation & OCA vacuum debubbler, helping retain genuine factory OLED display and touch sensitivity.",
    beforeImg: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=1200&q=80",
    afterImg: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80",
    damageTag: "CRACKED OUTER GLASS",
    restoredTag: "OCA REFURBISHED",
    specs: ["Factory OLED Panel Retained", "OCA Vacuum Lamination", "Touch Functionality Verified"],
    microscopeFindings: "Trinocular 45x inspection confirms outer Corning glass fracture lines terminating at the OCA layer; OLED emitter matrix completely intact with 0.00% dead sub-pixels.",
    faultCause: "Mechanical drop on corner point. Delamination of protective glass without digitizer trace disruption.",
    procedure: [
      "-150°C cryo-freeze separation of shattered outer glass layer",
      "Ultrasonic chemical removal of residual factory adhesive",
      "Optical clear adhesive (OCA) vacuum lamination at 0.45 MPa",
      "Autoclave debubbling at 55°C for 8 minutes",
      "10x15 touch matrix calibration and TrueTone serialization backup",
    ],
    warrantyInfo: "90 Days Complete Display & Touch Warranty • Original Color Profile Retained",
    benchStation: "Optical Lamination Bench #1 (Barganda Road)",
  },
  {
    id: "amoled-line",
    tabLabel: "AMOLED Display Restoration",
    title: "AMOLED Flexible Panel Inspection",
    description: "Screen panel flex circuit evaluation and precision micro-rework to address display artifact issues without unnecessary whole-unit replacement where viable.",
    beforeImg: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1200&q=80",
    afterImg: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=1200&q=80",
    damageTag: "DISPLAY ANOMALY",
    restoredTag: "PANEL RESTORED",
    specs: ["Flex Trace Diagnostic", "Display Uniformity Restored", "Part-Grade Warranty Backed"],
    microscopeFindings: "Thermal imaging shows high impedance along anode drive traces; micro-flex crack detected near the COF (Chip-on-Film) bonding joint.",
    faultCause: "Repeated mechanical flexion and thermal stress causing microscopic trace fatigue on AMOLED flex cable.",
    procedure: [
      "Micro-scrape isolation of damaged 0.03mm conductive flex traces",
      "Precision 0.02mm silver jumper wire bonding under stereoscopic zoom",
      "UV-curable solder mask insulation and optical cure under 365nm UV",
      "120Hz refresh rate cycle stress test for 30 minutes",
      "Factory luminance and chromaticity consistency audit",
    ],
    warrantyInfo: "90 Days Laboratory Warranty on Display Output & Touch Digitizer",
    benchStation: "Laser & Flex Micro-Soldering Bench #3",
  },
  {
    id: "board-revival",
    tabLabel: "Motherboard BGA Rework",
    title: "Multi-Layer Motherboard IC Reballing",
    description: "Thermal failure or short-circuit diagnostics on multi-layer PCBs. IC chips desoldered, cleaned, and micro-reballed with high-grade solder spheres under stereoscopic magnification.",
    beforeImg: "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=1200&q=80",
    afterImg: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80",
    damageTag: "NO POWER / BOARD SHORT",
    restoredTag: "CIRCUIT RECOVERED",
    specs: ["BGA Chip Reballing", "Micro-soldering Bench", "Thermal Compound Replaced"],
    microscopeFindings: "DC power supply draws 0.00A on primary rail with a 0.08Ω dead short on VDD_MAIN. Infrared thermal camera localized heat signature to U3100 PMIC.",
    faultCause: "Surge overvoltage from uncertified fast-charger puncturing internal PMIC switching capacitor.",
    procedure: [
      "CNC milling of EMI shield can under surgical magnification",
      "Thermal-profile desoldering of shorted PMIC chip at 345°C",
      "Pads cleared with solder wick and microscopic solder trace leveling",
      "Brand-new BGA PMIC aligned using high-precision steel stencil & leaded spheres",
      "Primary power rail verified: steady 4.2V nominal voltage and 0.45A boot sequence",
    ],
    warrantyInfo: "60 Days Motherboard Circuit Warranty • Safe Boot Certificate Included",
    benchStation: "Infrared BGA Micro-Soldering Station #2",
  },
];

export const BeforeAfterSlider: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("iphone-glass");
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [diagModalOpen, setDiagModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<boolean>(false);

  const activeCase = CASE_STUDIES.find((c) => c.id === activeTab) || CASE_STUDIES[0];

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const clampedX = Math.max(0, Math.min(x, rect.width));
    const percent = (clampedX / rect.width) * 100;
    setSliderPosition(percent);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current && e.buttons !== 1) return;
    handleMove(e.clientX);
  };

  return (
    <section
      id="lab-case-studies"
      aria-label="Before and After Hardware Transformations"
      className="py-20 md:py-28 bg-[#020617] text-slate-100 relative overflow-hidden border-t border-slate-800/80"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold uppercase mb-4 shadow-sm">
            <Activity className="h-3.5 w-3.5 text-cyan-400" />
            Repair Bench Showcase
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Precision Restoration Comparisons
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400 leading-relaxed">
            Illustrative visual comparison showing the level of micro-precision and optical finishing delivered by our Giridih hardware laboratory.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {CASE_STUDIES.map((c) => {
            const isActive = activeTab === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setActiveTab(c.id);
                  setSliderPosition(50);
                }}
                className={`min-h-[44px] px-5 py-2.5 rounded-2xl text-xs font-bold transition-all active:scale-95 ${
                  isActive
                    ? "bg-cyan-500 text-slate-950 font-extrabold shadow-[0_0_15px_rgba(6,182,212,0.35)]"
                    : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {c.tabLabel}
              </button>
            );
          })}
        </div>

        {/* Slider Card */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-4 sm:p-6 backdrop-blur-xl shadow-2xl">
          {/* Header of Card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-800/80">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-950/80 border border-cyan-500/30 px-2 py-0.5 rounded-md">
                  {activeCase.benchStation}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {activeCase.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                {activeCase.description}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <button
                type="button"
                onClick={() => setDiagModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-cyan-500/50 bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 text-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                <FileText className="h-3.5 w-3.5 text-cyan-400" />
                <span>View Diagnostic Log</span>
              </button>
              {activeCase.specs.map((spec, i) => (
                <span
                  key={i}
                  className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-300"
                >
                  <CheckCircle2 className="h-3 w-3 text-cyan-400" />
                  {spec}
                </span>
              ))}
            </div>
          </div>

          {/* Interactive Image Comparison Viewport */}
          <div
            ref={containerRef}
            onMouseDown={() => (isDragging.current = true)}
            onMouseUp={() => (isDragging.current = false)}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            className="relative w-full aspect-[16/10] sm:aspect-[16/9] overflow-hidden rounded-2xl border border-slate-800 select-none cursor-ew-resize bg-slate-950"
          >
            {/* After Image (Background layer) */}
            <img
              src={activeCase.afterImg}
              alt="Restored smartphone hardware at Super Telecom Giridih"
              className="absolute inset-0 h-full w-full object-cover object-center pointer-events-none"
              loading="lazy"
            />

            {/* Before Image (Foreground layer - clipped by sliderPosition) */}
            <div
              className="absolute inset-0 overflow-hidden pointer-events-none"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={activeCase.beforeImg}
                alt="Damaged smartphone hardware before repair"
                className="absolute inset-0 h-full w-full object-cover object-center pointer-events-none"
                style={{
                  width: containerRef.current ? `${containerRef.current.clientWidth}px` : "100%",
                  maxWidth: "none",
                }}
                loading="lazy"
              />
            </div>

            {/* Minimalist Industrial Badges */}
            <div className="absolute top-4 left-4 pointer-events-none z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-500/40 bg-rose-950/80 text-rose-300 text-[11px] font-mono font-bold backdrop-blur-md shadow-lg">
                <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
                {activeCase.damageTag}
              </span>
            </div>

            <div className="absolute top-4 right-4 pointer-events-none z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-500/40 bg-emerald-950/80 text-emerald-300 text-[11px] font-mono font-bold backdrop-blur-md shadow-lg">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                {activeCase.restoredTag}
              </span>
            </div>

            {/* Vertical Brushed-Metal Drag Line and Pill Handle */}
            <div
              className="absolute top-0 bottom-0 z-20 pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-0 bottom-0 -left-px w-0.5 bg-gradient-to-b from-cyan-400 via-white to-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-10 w-10 rounded-full bg-slate-950 border-2 border-cyan-400 flex items-center justify-center text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.6)] backdrop-blur-md">
                <SlidersHorizontal className="h-4 w-4" />
              </div>
            </div>

            {/* Instructions Overlay */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none z-10">
              <span className="px-3 py-1 rounded-full bg-slate-950/80 border border-slate-800 text-[10px] font-mono text-slate-400 backdrop-blur-sm">
                ← Slide horizontally to compare →
              </span>
            </div>
          </div>

          {/* Honest Illustrative Caption Disclaimer */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 font-mono">
            <p>* Illustrative technical demonstration of repair processes and finishing standards.</p>
            <button
              type="button"
              onClick={() => setDiagModalOpen(true)}
              className="text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
            >
              Open Full Microscope Diagnostic Sheet &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* INTERACTIVE DIAGNOSTIC LOG SLIDE-OVER MODAL                   */}
      {/* ───────────────────────────────────────────────────────────── */}
      {diagModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setDiagModalOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl border border-cyan-500/40 bg-slate-900/95 p-6 sm:p-8 text-white shadow-2xl backdrop-blur-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setDiagModalOpen(false)}
              className="absolute top-5 right-5 grid h-9 w-9 place-items-center rounded-full border border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:border-cyan-400 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Header */}
            <div className="space-y-1.5 border-b border-slate-800 pb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-400 text-xs font-mono font-bold uppercase">
                <Microscope className="h-3.5 w-3.5" />
                <span>BENCH DIAGNOSTIC LOG • GIRIDIH LAB</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-white">
                {activeCase.title}
              </h3>
              <p className="text-xs text-slate-400">
                Bench: <strong className="text-slate-200">{activeCase.benchStation}</strong> &bull; Technician: Master Hardware Specialist
              </p>
            </div>

            {/* Content Blocks */}
            <div className="mt-5 space-y-4 text-xs">
              {/* Microscope Findings */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-cyan-400 font-bold">
                  <Microscope className="h-4 w-4" />
                  <span>माइक्रोस्कोप जांच (Microscopic Inspection)</span>
                </div>
                <p className="text-slate-300 leading-relaxed font-mono text-[11px]">
                  {activeCase.microscopeFindings}
                </p>
              </div>

              {/* Fault Cause */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <AlertTriangle className="h-4 w-4" />
                  <span>खराबी का मुख्य कारण (Root Fault Cause)</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  {activeCase.faultCause}
                </p>
              </div>

              {/* Procedure */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <Wrench className="h-4 w-4" />
                  <span>लैब रिपेयर प्रक्रिया (Repair Procedure)</span>
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-300 text-[11px]">
                  {activeCase.procedure.map((step, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Warranty and Quality Guarantee */}
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <ShieldCheck className="h-4 w-4" />
                  <span>वारंटी व टेस्टिंग सर्टिफिकेशन (Quality Guarantee)</span>
                </div>
                <p className="text-emerald-200 text-[11px] leading-relaxed">
                  {activeCase.warrantyInfo}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <a
                href={`https://wa.me/${BUSINESS_MASTER.whatsappRaw}?text=${encodeURIComponent(
                  `Hi Super Telecom, I reviewed your diagnostic log for ${activeCase.title}. I need a similar repair for my phone.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-5 py-2.5 text-xs font-bold text-slate-950 shadow-brand hover:scale-105 transition-transform"
              >
                <MessageCircle className="h-4 w-4" /> Consult with Technician on WhatsApp
              </a>
              <button
                type="button"
                onClick={() => setDiagModalOpen(false)}
                className="rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2.5 text-xs font-semibold text-slate-300 transition-colors"
              >
                Close Log
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default BeforeAfterSlider;
