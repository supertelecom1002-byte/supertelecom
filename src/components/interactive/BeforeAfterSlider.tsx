import React, { useState, useRef, useCallback } from "react";
import { SlidersHorizontal, Activity, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";

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
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: "iphone-glass",
    tabLabel: "iPhone Glass Restoration",
    title: "iPhone 14 Pro Max • OCA Glass Lamination",
    description: "Shattered front gorilla glass replaced using precision cryo-separation & OCA vacuum debubbler, saving the customer over ₹12,000 while retaining 100% genuine factory Apple OLED colors & 120Hz ProMotion.",
    beforeImg: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=1200&q=80",
    afterImg: "https://images.unsplash.com/photo-1511707171634-5f897ff02560?auto=format&fit=crop&w=1200&q=80",
    damageTag: "SEVERE SHATTER • TOUCH OK",
    restoredTag: "FACTORY RETINA PRESERVED",
    specs: ["Retained Original Apple Display", "OCA Vacuum Laminated", "True Tone Calibrated"],
  },
  {
    id: "amoled-line",
    tabLabel: "Laser AMOLED Green Line Fix",
    title: "Samsung S22 Ultra • Laser Trace Bonding",
    description: "Post-update vertical green and pink line defect rectified via microscopic laser trace welding on flex cables without expensive screen replacement.",
    beforeImg: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1200&q=80",
    afterImg: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=1200&q=80",
    damageTag: "VERTICAL LINE DEFECT",
    restoredTag: "ZERO LINES • 100% REPAIRED",
    specs: ["No Display Replacement Needed", "Original 120Hz Intact", "60-Day Line Warranty"],
  },
  {
    id: "board-revival",
    tabLabel: "Dead Board Revival",
    title: "OnePlus 9 Pro • Dual-Layer CPU Reballing",
    description: "Dead handset due to Qualcomm Snapdragon 888 thermal dry solder short-circuit. Dual-layer motherboard desoldered, cleaned, reballed with silver solder spheres, and revived.",
    beforeImg: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
    afterImg: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1200&q=80",
    damageTag: "COMPLETELY DEAD • 0.00A DRAW",
    restoredTag: "FULL DATA PRESERVED",
    specs: ["Double-Decker BGA Reball", "100% Data Preserved", "Thermal Paste Replaced"],
  },
];

export const BeforeAfterSlider: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("iphone-glass");
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage 0 - 100
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
            Empirical Hardware Evidence
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Micro-Precision Restoration Proof
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400 leading-relaxed">
            Drag the industrial slider below to inspect genuine transformations achieved on our Barganda Road micro-soldering benches.
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
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {activeCase.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                {activeCase.description}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              {activeCase.specs.map((spec, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-300"
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
            {/* After Image (Background layer - 100% width) */}
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
              {/* Vertical line */}
              <div className="absolute top-0 bottom-0 -left-px w-0.5 bg-gradient-to-b from-cyan-400 via-white to-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]" />

              {/* Center Drag Handle Pill */}
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-10 w-10 rounded-full bg-slate-950 border-2 border-cyan-400 flex items-center justify-center text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.6)] backdrop-blur-md">
                <SlidersHorizontal className="h-4 w-4" />
              </div>
            </div>

            {/* Mobile Instructions Overlay */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none z-10">
              <span className="px-3 py-1 rounded-full bg-slate-950/80 border border-slate-800 text-[10px] font-mono text-slate-400 backdrop-blur-sm">
                ← Slide horizontally to compare →
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfterSlider;
