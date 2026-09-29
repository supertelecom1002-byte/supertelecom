import React, { useRef } from "react";
import { Flame, Smartphone, Cpu, BatteryCharging, Droplets } from "lucide-react";
import { AppleLogo } from "@/components/icons/BrandVectors";

export interface ServiceChipItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
}

export const SERVICE_CHIPS: ServiceChipItem[] = [
  { id: "all", label: "All Repairs", icon: Flame },
  { id: "screen", label: "Screen & OLED", icon: Smartphone },
  { id: "iphone", label: "iPhone Lab", icon: AppleLogo },
  { id: "motherboard", label: "Board & IC", icon: Cpu },
  { id: "battery", label: "Battery & Port", icon: BatteryCharging },
  { id: "water", label: "Water Damage", icon: Droplets },
];

interface ServiceChipsProps {
  activeCategory: string;
  onSelectCategory: (categoryId: string) => void;
  className?: string;
}

export const ServiceChips: React.FC<ServiceChipsProps> = ({
  activeCategory,
  onSelectCategory,
  className = "",
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleSelect = (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
    onSelectCategory(id);
    // Smoothly scroll the tapped button into center view
    e.currentTarget.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  };

  return (
    <div className={`w-full py-2.5 ${className}`}>
      <div className="flex items-center justify-between px-4 mb-2 md:hidden">
        <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping inline-block" />
          Filter by Repair Need
        </span>
        <span className="text-[10px] text-slate-400 font-medium">Swipe horizontally →</span>
      </div>

      <div
        ref={scrollContainerRef}
        role="tablist"
        aria-label="Repair service filter categories"
        className="flex gap-2 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-1 px-4 touch-pan-x"
      >
        {SERVICE_CHIPS.map((chip) => {
          const isActive = activeCategory === chip.id;
          const Icon = chip.icon;
          return (
            <button
              key={chip.id}
              role="tab"
              aria-selected={isActive}
              type="button"
              onClick={(e) => handleSelect(chip.id, e)}
              className={`flex-none snap-start min-h-[44px] px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 active:scale-95 flex items-center gap-2 select-none shadow-sm ${
                isActive
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-extrabold shadow-[0_0_20px_rgba(6,182,212,0.45)] ring-2 ring-cyan-300/60 scale-[1.02]"
                  : "bg-slate-900/90 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 hover:bg-slate-850"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-slate-950" : "text-cyan-400"}`} />
              <span>{chip.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ServiceChips;
