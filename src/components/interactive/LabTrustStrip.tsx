import React from "react";
import { Microscope, Cpu, ShieldAlert, Zap } from "lucide-react";

interface MetricItem {
  icon: React.ComponentType<{ className?: string }>;
  metric: string;
  label: string;
  tag: string;
}

const LAB_METRICS: MetricItem[] = [
  {
    icon: Microscope,
    metric: "Trinocular Optics",
    label: "Micro-soldering & 0.02mm jumper precision",
    tag: "OPTICAL BENCH",
  },
  {
    icon: Cpu,
    metric: "Double-Decker CPU",
    label: "Specialized Poco, OnePlus & iPhone reballing",
    tag: "BGA STATIONS",
  },
  {
    icon: ShieldAlert,
    metric: "100% Data Safe",
    label: "Zero data wipe during screen & port repairs",
    tag: "PRIVACY ASSURED",
  },
  {
    icon: Zap,
    metric: "Laser AMOLED Tech",
    label: "Green line recovery without panel replacement",
    tag: "LASER FUSION",
  },
];

export const LabTrustStrip: React.FC = () => {
  return (
    <section
      aria-label="Super Telecom Engineering Lab Specifications"
      className="border-y border-slate-800/80 bg-slate-950/90 py-8 relative overflow-hidden backdrop-blur-md"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {LAB_METRICS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 transition-all hover:border-cyan-500/30 hover:bg-slate-900"
              >
                <div className="p-3 rounded-xl bg-cyan-950/60 border border-cyan-500/20 text-cyan-400 flex-none shadow-sm">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400/80 font-bold block">
                    {item.tag}
                  </span>
                  <div className="text-base font-bold text-white tracking-tight mt-0.5">
                    {item.metric}
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {item.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LabTrustStrip;
