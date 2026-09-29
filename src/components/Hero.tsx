import React from "react";
import {
  Wrench,
  Phone,
  Clock,
  MapPin,
  ShieldCheck,
  Cpu,
  Activity,
  CheckCircle2,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { EditableBlock } from "@/components/admin/visual/EditableBlock";

export const Hero: React.FC = () => {
  const scrollToCalculator = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById("repair-calculator");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.location.hash = "#repair-calculator";
    }
  };

  return (
    <section
      id="top"
      aria-label="Super Telecom Smartphone Laboratory"
      className="relative isolate min-h-[92vh] w-full overflow-hidden bg-[#020617] pt-24 pb-16 md:pt-32 md:pb-24 flex items-center"
    >
      {/* Subtle radial cyan glow and cyber grid background */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(circle at 50% 20%, rgba(6, 182, 212, 0.12), transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(90deg, #06b6d4 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="pointer-events-none absolute -top-40 right-10 -z-10 h-96 w-96 rounded-full bg-cyan-500/10 blur-[130px]" />
      <div className="pointer-events-none absolute bottom-0 left-10 -z-10 h-80 w-80 rounded-full bg-blue-600/10 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: High-Impact Typography & Action CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Top Status Badge */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-cyan-500/30 bg-slate-900/80 px-4 py-1.5 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              {/* Glowing Green Pulse Dot (Pure SVG) */}
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>

              <span className="text-[11px] font-mono font-bold tracking-wider text-cyan-300 uppercase flex items-center gap-1.5">
                <MapPin className="h-3 w-3 text-cyan-400" />
                <span>BARGANDA ROAD LAB</span>
                <span className="text-slate-500">•</span>
                <Clock className="h-3 w-3 text-cyan-400" />
                <span>OPEN TODAY TILL 9:30 PM</span>
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="mt-6 font-display text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.15]">
              <EditableBlock
                contentKey="hero_h1_title"
                defaultValue="Giridih’s Premier Flagship Smartphone & Chip-Level Repair Lab"
              />
            </h1>

            {/* Subtitle */}
            <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              <EditableBlock
                contentKey="hero_h1_subtitle"
                defaultValue="Advanced motherboard micro-soldering, double-decker CPU reballing, and 30-minute original display restoration for iPhone, Samsung Ultra & OnePlus."
                type="textarea"
              />
            </p>

            {/* Technical Verification Highlights */}
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono text-slate-400">
              <span className="inline-flex items-center gap-1.5 text-cyan-400">
                <CheckCircle2 className="h-3.5 w-3.5" /> 100% ESD-Safe Benches
              </span>
              <span className="inline-flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="h-3.5 w-3.5" /> 90-Day Lab Warranty
              </span>
              <span className="inline-flex items-center gap-1.5 text-slate-300">
                <Activity className="h-3.5 w-3.5 text-cyan-400" /> 0.02mm Jumper Precision
              </span>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <a
                href="#repair-calculator"
                onClick={scrollToCalculator}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-6 py-4 text-sm font-bold shadow-[0_0_25px_rgba(6,182,212,0.35)] transition-all hover:scale-[1.02] active:scale-95 min-h-[48px] w-full sm:w-auto"
              >
                <Wrench className="h-4 w-4" />
                <span>Calculate Repair Cost</span>
                <ChevronRight className="h-4 w-4 ml-0.5" />
              </a>

              <a
                href="tel:+918002903643"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-white px-6 py-4 text-sm font-bold backdrop-blur-md transition-all hover:border-cyan-500/40 active:scale-95 min-h-[48px] w-full sm:w-auto"
              >
                <Phone className="h-4 w-4 text-cyan-400" />
                <span>Direct Engineer Call</span>
              </a>
            </div>

            {/* Social Proof Strip */}
            <div className="mt-8 flex items-center gap-3 text-xs text-slate-400 border-t border-slate-800/80 pt-4">
              <div className="flex -space-x-1.5 overflow-hidden">
                <div className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900 bg-cyan-900 text-[10px] font-bold text-cyan-300 flex items-center justify-center">
                  IP
                </div>
                <div className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900 bg-blue-900 text-[10px] font-bold text-blue-300 flex items-center justify-center">
                  SM
                </div>
                <div className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900 bg-emerald-900 text-[10px] font-bold text-emerald-300 flex items-center justify-center">
                  1+
                </div>
              </div>
              <span className="font-medium text-slate-300">
                Over <strong className="text-white">2,00,000+</strong> smartphones diagnosed &amp; repaired in Giridih
              </span>
            </div>
          </div>

          {/* Right Column: Floating 3D Frosted-Glass Lab Inspection Card */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl border border-cyan-500/30 bg-slate-900/70 p-3 shadow-[0_0_50px_rgba(6,182,212,0.15)] backdrop-blur-xl">
              {/* Lab Photo Viewport */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
                <img
                  src="https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1200&q=80"
                  alt="Super Telecom precision micro-soldering and motherboard repair lab under microscope"
                  className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105"
                  loading="eager"
                  fetchPriority="high"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                {/* Overlaid Telemetry Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/90 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono font-bold shadow-md">
                    <Sparkles className="h-3 w-3 text-cyan-400" />
                    4K Stereo Microscope Diagnostic
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/90 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold shadow-md">
                    <ShieldCheck className="h-3 w-3 text-emerald-400" />
                    100% ESD-Safe Workspace
                  </span>
                </div>

                {/* Live Inspection HUD at bottom of photo */}
                <div className="absolute bottom-3 left-3 right-3 rounded-xl bg-slate-950/90 border border-slate-800/80 p-3 backdrop-blur-md">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Cpu className="h-3.5 w-3.5 text-cyan-400" />
                      BGA Rework Station
                    </span>
                    <span className="text-emerald-400 font-bold">Calibrated 350°C</span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 w-3/4 rounded-full" />
                  </div>
                </div>
              </div>

              {/* Lab Highlights Footer */}
              <div className="mt-3 grid grid-cols-3 gap-2 px-1 text-center">
                <div className="rounded-xl bg-slate-950/60 border border-slate-800/60 p-2.5">
                  <div className="text-base font-bold font-mono text-cyan-400">0.02mm</div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase mt-0.5">Jumper Wire</div>
                </div>
                <div className="rounded-xl bg-slate-950/60 border border-slate-800/60 p-2.5">
                  <div className="text-base font-bold font-mono text-emerald-400">30 Min</div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase mt-0.5">Screen Swap</div>
                </div>
                <div className="rounded-xl bg-slate-950/60 border border-slate-800/60 p-2.5">
                  <div className="text-base font-bold font-mono text-amber-400">No Wipe</div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase mt-0.5">Data Safe</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
