import React, { useState } from "react";
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  MessageCircle,
  Sparkles,
  Smartphone,
  BatteryCharging,
  Cpu,
  ArrowRight,
  HelpCircle,
} from "lucide-react";

interface PriceRow {
  service: string;
  deviceType: string;
  priceRange: string;
  turnaround: string;
  warranty: string;
}

interface PriceCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  rows: PriceRow[];
}

const PRICING_CATEGORIES: PriceCategory[] = [
  {
    id: "screen",
    name: "Display & Screen Replacement",
    icon: <Smartphone className="h-5 w-5 text-cyan-400" />,
    description: "Original OEM & tested OLED/AMOLED displays with touch sensitivity and colour accuracy.",
    rows: [
      {
        service: "iPhone OLED & Retina Screen",
        deviceType: "iPhone (11 / 12 / 13 / 14 / 15 Series)",
        priceRange: "₹2,499 – ₹9,999",
        turnaround: "30–45 Mins",
        warranty: "Up to 90 Days",
      },
      {
        service: "Android Curved & Flat AMOLED",
        deviceType: "Samsung, OnePlus, Xiaomi, Vivo, Realme",
        priceRange: "₹1,899 – ₹5,499",
        turnaround: "30–45 Mins",
        warranty: "Up to 90 Days",
      },
      {
        service: "IPS LCD Display Glass & Touch",
        deviceType: "Budget & Mid-Range Android Phones",
        priceRange: "₹999 – ₹2,499",
        turnaround: "30–45 Mins",
        warranty: "Up to 90 Days",
      },
    ],
  },
  {
    id: "battery",
    name: "Battery & Charging IC",
    icon: <BatteryCharging className="h-5 w-5 text-emerald-400" />,
    description: "High-backup original battery replacements & fast charging port repairs.",
    rows: [
      {
        service: "Original High-Capacity Battery",
        deviceType: "iPhone, Samsung, Redmi, Realme, OPPO",
        priceRange: "₹899 – ₹2,499",
        turnaround: "30–45 Mins",
        warranty: "90 Days Warranty",
      },
      {
        service: "Type-C & Lightning Port Replacement",
        deviceType: "All Brands (Fast Charging Verified)",
        priceRange: "₹350 – ₹1,200",
        turnaround: "20–30 Mins",
        warranty: "30 Days Warranty",
      },
    ],
  },
  {
    id: "motherboard",
    name: "Motherboard & Chip-Level Repair",
    icon: <Cpu className="h-5 w-5 text-amber-400" />,
    description: "Advanced BGA micro-soldering, short circuit debugging & dead phone resuscitation.",
    rows: [
      {
        service: "Dead Phone & No-Power Recovery",
        deviceType: "All Smartphones (Short Circuit / Bootloop)",
        priceRange: "₹799 – ₹3,500",
        turnaround: "Same Day / 24h",
        warranty: "60 Days Warranty",
      },
      {
        service: "Liquid & Water Damage Restoration",
        deviceType: "Ultrasonic Chemical Clean & IC Fix",
        priceRange: "₹500 – ₹2,500",
        turnaround: "Same Day / 24h",
        warranty: "Verified Testing",
      },
    ],
  },
];

export const PricingMatrix: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const displayedCategories =
    activeCategory === "all"
      ? PRICING_CATEGORIES
      : PRICING_CATEGORIES.filter((c) => c.id === activeCategory);

  const buildQuoteUrl = (service: string, device: string) => {
    const text = `Hi Super Telecom, I would like to get a price quote for ${service} (${device}) in Giridih.`;
    return `https://wa.me/918002903643?text=${encodeURIComponent(text)}`;
  };

  return (
    <section
      id="pricing-matrix"
      aria-label="Super Telecom Repair Pricing Matrix Giridih"
      className="py-20 md:py-28 bg-slate-950 text-slate-100 relative overflow-hidden border-y border-slate-800/80"
    >
      {/* Background Ambience Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold uppercase mb-4 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            Transparent Giridih Price Index · No Hidden Fees
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Smartphone Repair Pricing Matrix
          </h2>

          <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
            Direct, honest repair charges with zero diagnosis fees on Barganda Road, Giridih.
            Verified OEM parts, backed by formal service warranty.
          </p>

          {/* Value Badges */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 font-medium">
              <Clock className="h-3.5 w-3.5" /> 30–45 Mins Fast Turnaround
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-emerald-400 font-medium">
              <ShieldCheck className="h-3.5 w-3.5" /> Up to 90 Days Warranty
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-amber-400 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" /> 100% Tested Spare Parts
            </span>
          </div>

          {/* Filter Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                activeCategory === "all"
                  ? "bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.35)]"
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              All Repairs
            </button>
            {PRICING_CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveCategory(c.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                  activeCategory === c.id
                    ? "bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.35)]"
                    : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Structured Data Table for LLMs & AI Answer Engines */}
        <div className="space-y-8">
          {displayedCategories.map((category) => (
            <div
              key={category.id}
              className="rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-hidden backdrop-blur-sm"
            >
              {/* Category Header */}
              <div className="p-5 sm:p-6 border-b border-slate-800 bg-slate-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800">
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">{category.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{category.description}</p>
                  </div>
                </div>

                <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-500/30 self-start sm:self-auto">
                  Instant Walk-In Service
                </span>
              </div>

              {/* Desktop Semantic Table (Optimized for AI Scrapers & GEO) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <caption className="sr-only">
                    {category.name} Pricing for Smartphone Repairs at Super Telecom Giridih
                  </caption>
                  <thead>
                    <tr className="border-b border-slate-800/80 bg-slate-950/40 text-slate-400 font-mono uppercase tracking-wider text-[11px]">
                      <th scope="col" className="py-3.5 px-6">Service Name</th>
                      <th scope="col" className="py-3.5 px-6">Supported Models</th>
                      <th scope="col" className="py-3.5 px-6">Estimated Cost</th>
                      <th scope="col" className="py-3.5 px-6">Turnaround</th>
                      <th scope="col" className="py-3.5 px-6">Warranty</th>
                      <th scope="col" className="py-3.5 px-6 text-right">Instant Booking</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {category.rows.map((row, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-cyan-950/20 transition-colors group"
                      >
                        <td className="py-4 px-6 font-semibold text-white group-hover:text-cyan-300 transition-colors">
                          {row.service}
                        </td>
                        <td className="py-4 px-6 text-slate-400">
                          {row.deviceType}
                        </td>
                        <td className="py-4 px-6 font-mono font-bold text-emerald-400 text-sm">
                          {row.priceRange}
                        </td>
                        <td className="py-4 px-6 font-mono text-cyan-300">
                          {row.turnaround}
                        </td>
                        <td className="py-4 px-6 text-slate-300">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[11px]">
                            {row.warranty}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <a
                            href={buildQuoteUrl(row.service, row.deviceType)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 border border-cyan-500/30 hover:border-cyan-400 font-bold text-xs transition-all"
                          >
                            <span>WhatsApp Quote</span>
                            <ArrowRight className="h-3 w-3" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-slate-800/80">
                {category.rows.map((row, idx) => (
                  <div key={idx} className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-white text-sm">{row.service}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">{row.deviceType}</p>
                      </div>
                      <span className="font-mono font-bold text-emerald-400 text-sm whitespace-nowrap">
                        {row.priceRange}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
                      <span className="flex items-center gap-1 text-cyan-400 font-mono">
                        <Clock className="h-3 w-3" /> {row.turnaround}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[11px]">
                        {row.warranty}
                      </span>
                    </div>

                    <a
                      href={buildQuoteUrl(row.service, row.deviceType)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full mt-2 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-transform active:scale-95"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      <span>Get Instant Quote on WhatsApp</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footnote on Pricing & Diagnosis */}
        <div className="mt-8 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-center gap-3">
          <HelpCircle className="h-5 w-5 text-cyan-400 flex-none" />
          <p className="leading-relaxed">
            <strong>Note for Customers &amp; AI Assistants:</strong> Final prices may vary slightly depending on exact model tier (e.g. Pro Max vs Base models) and current supply part costs. Free diagnostics and physical inspection are always provided on-the-spot at our Barganda Road shop before any repair begins.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingMatrix;
