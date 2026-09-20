import React, { useEffect, useState, useRef } from "react";
import {
  Smartphone,
  Shield,
  Clock,
  MessageCircle,
  Sparkles,
  ChevronRight,
  Wrench,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import {
  DEFAULT_SHOWCASE_ITEMS,
  type RepairShowcaseItem,
} from "@/components/admin/cms/BeforeAfterManager";

export const BeforeAfterSlider: React.FC = () => {
  const [items, setItems] = useState<RepairShowcaseItem[]>(DEFAULT_SHOWCASE_ITEMS);
  const [activeItem, setActiveItem] = useState<RepairShowcaseItem>(DEFAULT_SHOWCASE_ITEMS[0]);
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchRepairs = async () => {
      try {
        const { data, error } = await supabase
          .from("repair_showcase")
          .select("*")
          .eq("is_published", true)
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          setItems(data);
          setActiveItem(data[0]);
        }
      } catch {
        // use default fallback
      }
    };

    fetchRepairs();
  }, []);

  // Handle pointer/mouse/touch drag calculation
  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(100, (x / width) * 100));
    setSliderPosition(percentage);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    handleMove(e.clientX);
  };

  useEffect(() => {
    const handleGlobalPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      handleMove(e.clientX);
    };

    const handleGlobalPointerUp = () => {
      if (isDragging) setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("pointermove", handleGlobalPointerMove);
      window.addEventListener("pointerup", handleGlobalPointerUp);
    }

    return () => {
      window.removeEventListener("pointermove", handleGlobalPointerMove);
      window.removeEventListener("pointerup", handleGlobalPointerUp);
    };
  }, [isDragging]);

  if (!items || items.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-surface/50 border-y border-border/40 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold uppercase mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            Precision Workshop Proof
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
            Before &amp; After Repair Gallery
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground">
            Slide across to inspect our chip-level soldering, OEM display bonding, and precision glass restorations.
          </p>
        </div>

        {/* Device Switcher Tabs */}
        {items.length > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {items.map((item) => {
              const isSelected = item.id === activeItem.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveItem(item);
                    setSliderPosition(50);
                  }}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold transition-all ${
                    isSelected
                      ? "bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)] scale-[1.02]"
                      : "bg-surface border border-border text-muted-foreground hover:text-foreground hover:border-border/80"
                  }`}
                >
                  <Smartphone className="h-3.5 w-3.5" />
                  {item.device_model}
                </button>
              );
            })}
          </div>
        )}

        {/* Split Comparison Showcase Card */}
        <div className="max-w-4xl mx-auto rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl p-4 sm:p-7">
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  {activeItem.device_model}
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-400">{activeItem.issue_type}</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                {activeItem.title}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs text-cyan-300 font-mono">
                <Clock className="h-3.5 w-3.5 text-cyan-400" />
                {activeItem.turnaround_time}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs text-emerald-300 font-mono">
                <Shield className="h-3.5 w-3.5 text-emerald-400" />
                {activeItem.warranty_given}
              </span>
            </div>
          </div>

          {/* Interactive Split Comparison Slider */}
          <div
            ref={containerRef}
            onPointerDown={handlePointerDown}
            className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden select-none cursor-ew-resize bg-slate-900 border border-slate-800"
          >
            {/* After (Fixed) Image Layer */}
            <img
              src={activeItem.after_image}
              alt={`${activeItem.device_model} after repair`}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />

            {/* Before (Damaged) Image Layer clipped by percentage */}
            <div
              className="absolute inset-0 overflow-hidden pointer-events-none"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={activeItem.before_image}
                alt={`${activeItem.device_model} before repair`}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover max-w-none"
                style={{ width: "100%", height: "100%" }}
              />
              <div className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-rose-950/90 text-rose-300 text-xs font-extrabold uppercase border border-rose-500/40 tracking-wider shadow-lg">
                BEFORE (DAMAGED)
              </div>
            </div>

            <div className="absolute top-4 right-4 px-3 py-1 rounded-lg bg-emerald-950/90 text-emerald-300 text-xs font-extrabold uppercase border border-emerald-500/40 tracking-wider shadow-lg pointer-events-none">
              AFTER (RESTORED)
            </div>

            {/* Draggable Divider Line & Knob */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.9)] pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-cyan-500 text-slate-950 font-bold flex items-center justify-center shadow-2xl border-2 border-white text-xs">
                &#x2194;
              </div>
            </div>
          </div>

          {/* Bottom Callout & Action */}
          <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-xs text-slate-400 flex items-center gap-2">
              <Wrench className="h-4 w-4 text-cyan-400 flex-none" />
              Repaired at Super Telecom, Barganda Road, Giridih with verified warranty.
            </p>

            <a
              href={`https://wa.me/918002903643?text=Hi%20Super%20Telecom,%20I%20saw%20your%20${encodeURIComponent(activeItem.device_model)}%20repair%20and%20need%20a%20quote`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg transition-transform hover:scale-[1.02] flex-none"
            >
              <MessageCircle className="h-4 w-4" />
              Quote for My Device
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfterSlider;
