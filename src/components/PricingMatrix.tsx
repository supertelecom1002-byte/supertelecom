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
  Phone,
  Receipt,
  FileCheck2,
  Building2,
  Zap,
  Droplets,
} from "lucide-react";

import {
  BUSINESS_MASTER,
  BEST_VALUE_LABELS,
  REPAIR_PRICE_DISCLAIMER,
} from "@/config/superTelecomConfig";
import { RepairConsultationAction, buildConsultationWhatsAppUrl } from "@/components/consultation/RepairConsultationAction";

interface PricingRow {
  service: string;
  deviceType: string;
  partGrade: string;
  valueGuarantee: string;
  gstStatus: string;
  sacCode: string;
  turnaround: string;
  warranty: string;
}

interface PricingCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  rows: PricingRow[];
}

const PRICING_CATEGORIES: PricingCategory[] = [
  {
    id: "screen",
    name: "Display & Screen Replacement",
    icon: <Smartphone className="h-5 w-5 text-cyan-400" />,
    description: "Original Service Pack, OEM-Grade AMOLED, and Compatible Aftermarket IPS LCD screens — Budget Android to Flagship.",
    rows: [
      {
        service: "iPhone Retina OLED & Display Assembly",
        deviceType: "Flagship iPhone (11 / 12 / 13 / 14 / 15 / 16 Pro Max)",
        partGrade: "Original Service Pack",
        valueGuarantee: BEST_VALUE_LABELS.lowestRate,
        gstStatus: "18% GST Invoice",
        sacCode: "998713",
        turnaround: "30–60 Mins",
        warranty: "Up to 90 Days",
      },
      {
        service: "Android Curved & Flat AMOLED Display",
        deviceType: "Flagship & Mid-Range (Samsung S-Ultra, OnePlus, Vivo X/V, OPPO Reno)",
        partGrade: "OEM-Grade AMOLED",
        valueGuarantee: BEST_VALUE_LABELS.bestPriceGuarantee,
        gstStatus: "18% GST Invoice",
        sacCode: "998713",
        turnaround: "30–45 Mins",
        warranty: "Up to 90 Days",
      },
      {
        service: "Android IPS LCD & Touch Glass Assembly",
        deviceType: "Budget & Value Smartphones (Redmi, Realme, Vivo Y, Samsung A/M)",
        partGrade: "Genuine Tested IPS LCD",
        valueGuarantee: BEST_VALUE_LABELS.transparentFreeCheck,
        gstStatus: "18% GST Invoice",
        sacCode: "998713",
        turnaround: "30–45 Mins",
        warranty: "Up to 90 Days",
      },
      {
        service: "Outer Touch Glass Only (OCA Vacuum Lamination)",
        deviceType: "Display Functional, Only Cracked Glass (Budget to Flagship)",
        partGrade: "Factory Grade OCA",
        valueGuarantee: BEST_VALUE_LABELS.lowestRate,
        gstStatus: "18% GST Invoice",
        sacCode: "998713",
        turnaround: "45–90 Mins",
        warranty: "Bench Verified",
      },
    ],
  },
  {
    id: "battery",
    name: "Battery & Charging Port Restoration",
    icon: <BatteryCharging className="h-5 w-5 text-emerald-400" />,
    description: "Zero-cycle high-density batteries and OEM fast-charging port sub-boards for every budget and flagship phone.",
    rows: [
      {
        service: "High-Capacity Original Battery Replacement",
        deviceType: "Android Smartphones (Budget Redmi/Realme to Samsung Ultra & OnePlus)",
        partGrade: "OEM-Grade Li-Polymer",
        valueGuarantee: BEST_VALUE_LABELS.lowestRate,
        gstStatus: "18% GST Invoice",
        sacCode: "998713",
        turnaround: "20–35 Mins",
        warranty: "90 Days Written Warranty",
      },
      {
        service: "iPhone Battery (BMS Health Micro-Welded)",
        deviceType: "All iPhone Models (100% Battery Health Calibration)",
        partGrade: "Original Service Pack",
        valueGuarantee: BEST_VALUE_LABELS.bestPriceGuarantee,
        gstStatus: "18% GST Invoice",
        sacCode: "998713",
        turnaround: "45–60 Mins",
        warranty: "90 Days Written Warranty",
      },
      {
        service: "Type-C & Lightning Fast Charging Port",
        deviceType: "All Smartphones (SuperVOOC / FlashCharge / PD Support Verified)",
        partGrade: "OEM Fast-Charge Board",
        valueGuarantee: BEST_VALUE_LABELS.transparentFreeCheck,
        gstStatus: "18% GST Invoice",
        sacCode: "998713",
        turnaround: "20–40 Mins",
        warranty: "Up to 90 Days Warranty",
      },
    ],
  },
  {
    id: "motherboard",
    name: "Motherboard, CPU IC & Camera / Audio Lab",
    icon: <Cpu className="h-5 w-5 text-amber-400" />,
    description: "45X stereomicroscope micro-soldering, short-circuit debugging, PMIC/CPU reballing, camera OIS, and speaker/mic repair.",
    rows: [
      {
        service: "Dead Phone, Power IC & Dual-Layer CPU Reballing",
        deviceType: "All Smartphones (Poco X3, Redmi Note, OnePlus, iPhone Logic Boards)",
        partGrade: "45X Microscope BGA Station",
        valueGuarantee: BEST_VALUE_LABELS.lowestRate,
        gstStatus: "18% GST Invoice",
        sacCode: "998713",
        turnaround: "Same Day / 24–48h",
        warranty: "Up to 90 Days Warranty",
      },
      {
        service: "No Service, 5G Network IC, Wi-Fi & Audio IC",
        deviceType: "Baseband / Weak 5G Signal / Speaker & Microphone Hardware",
        partGrade: "OEM-Grade IC & MEMS Modules",
        valueGuarantee: BEST_VALUE_LABELS.transparentFreeCheck,
        gstStatus: "18% GST Invoice",
        sacCode: "998713",
        turnaround: "Same Day",
        warranty: "Up to 90 Days Warranty",
      },
      {
        service: "OIS Camera Module, Lens Glass & Software / Data Recovery",
        deviceType: "All Android & iPhone Models (100% Zero-Snooping Privacy)",
        partGrade: "Cleanroom Optical & Firmware Lab",
        valueGuarantee: BEST_VALUE_LABELS.bestPriceGuarantee,
        gstStatus: "18% GST Invoice",
        sacCode: "998713",
        turnaround: "30 Mins – Same Day",
        warranty: "Up to 90 Days Warranty",
      },
    ],
  },
  {
    id: "laser",
    name: "AMOLED Green Line & Water Damage Revival",
    icon: <Zap className="h-5 w-5 text-purple-400" />,
    description: "Laser green-line healing without full screen replacement, plus ultrasonic chemical bath de-oxidation.",
    rows: [
      {
        service: "Green / Pink Vertical Line Laser Repair",
        deviceType: "Samsung S-Series, OnePlus & Vivo AMOLED Flagships",
        partGrade: "COF Flex Laser Restoration",
        valueGuarantee: BEST_VALUE_LABELS.lowestRate,
        gstStatus: "18% GST Invoice",
        sacCode: "998713",
        turnaround: "Same Day / 2–4 Hours",
        warranty: "Up to 90 Days Warranty",
      },
      {
        service: "Water Damage Ultrasonic Chemical Revival",
        deviceType: "Liquid Dropped Devices & Heavy PCB Oxidation (All Brands)",
        partGrade: "40kHz Ultrasonic Solvent Bath",
        valueGuarantee: BEST_VALUE_LABELS.transparentFreeCheck,
        gstStatus: "18% GST Invoice",
        sacCode: "998713",
        turnaround: "2–5 Hours / 24h",
        warranty: "60–90 Days Service Coverage",
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

  return (
    <section
      id="pricing-matrix"
      aria-label="Super Telecom Best Quality and Value Matrix Giridih"
      className="py-8 sm:py-16 md:py-28 bg-slate-950 text-slate-100 relative overflow-hidden border-y border-slate-800/80"
    >
      {/* Background Ambience Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-[11px] sm:text-xs font-mono font-bold uppercase mb-3 sm:mb-4 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            सबसे कम दाम • बेस्ट क्वालिटी गारंटी (Budget to Flagship)
          </div>

          <h2 className="text-xl sm:text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Quality &amp; Best Value Comparison Matrix
          </h2>

          <p className="mt-3 sm:mt-4 text-xs sm:text-base text-slate-300 leading-relaxed">
            गिरिडीह में सस्ते बजट फ़ोन से लेकर महँगे फ्लैगशिप (iPhone Pro Max, Samsung Ultra, OnePlus) तक — 100% जेनुइन पार्ट्स, पक्का GST बिल और सबसे कम मार्केट रेट की गारंटी।
          </p>

          {/* Value Badges */}
          <div className="mt-4 sm:mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[11px] sm:text-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 font-medium">
              <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> 30–45 Mins Fast Turnaround
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-slate-900 border border-slate-800 text-emerald-400 font-medium">
              <ShieldCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> Up to 90 Days Warranty
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-slate-900 border border-slate-800 text-amber-400 font-medium">
              <Receipt className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> 100% GST Tax Invoice (SAC 998713)
            </span>
          </div>

          {/* Filter Pills with Horizontal Swipe on Mobile */}
          <div className="mt-6 sm:mt-8 flex overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory gap-2 pb-2 md:flex-wrap md:justify-center px-1">
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className={`flex-none snap-start min-h-[38px] px-3.5 py-1.5 rounded-full text-[11px] font-bold transition-all active:scale-95 cursor-pointer ${
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
                className={`flex-none snap-start min-h-[38px] px-3.5 py-1.5 rounded-full text-[11px] font-bold transition-all active:scale-95 cursor-pointer ${
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

        {/* PROMINENT OFFICIAL GST TAX INVOICE & PHRASE BANNER */}
        <div className="mb-10 rounded-3xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-emerald-950/60 border border-cyan-500/40 p-5 sm:p-7 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                <FileCheck2 className="h-4 w-4" />
                <span>OFFICIAL GST COMPLIANCE &amp; TAX INVOICING</span>
              </div>
              <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight">
                Official GST Tax Invoice &amp; Warranty Card Provided
              </h3>
              {/* Mandatory Official GST Phrase in English and Hindi */}
              <p className="text-xs sm:text-sm text-cyan-200 font-medium leading-relaxed">
                "Super Telecom provides 100% official GST Tax Invoices and physical warranty cards for all smartphone repairs and spare parts under SAC Code 998713 — with Giridih's lowest honest rates guaranteed after free physical inspection. Business and corporate clients can claim full Input Tax Credit (ITC) with their registered GSTIN."
              </p>
              <p className="text-xs sm:text-sm text-slate-300 font-hindi leading-relaxed">
                "सुपर टेलीकॉम गिरिडीह में सभी मोबाइल रिपेयरिंग पर 100% पक्का जीएसटी टैक्स इनवॉइस (GST Bill) और 90 दिन का लिखित वारंटी कार्ड प्रदान किया जाता है। कॉर्पोरेट व बिज़नेस ग्राहकों के लिए इनपुट टैक्स क्रेडिट (ITC) की पूरी सुविधा उपलब्ध है।"
              </p>
            </div>

            {/* Quick GST Specifications Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 w-full lg:w-auto shrink-0 font-mono text-xs">
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80">
                <div className="text-[10px] text-slate-400 uppercase">Service SAC Code</div>
                <div className="text-sm font-bold text-cyan-400 mt-0.5">998713</div>
                <div className="text-[9px] text-slate-500 mt-0.5">Mobile Phone Repair</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80">
                <div className="text-[10px] text-slate-400 uppercase">GST Rate</div>
                <div className="text-sm font-bold text-emerald-400 mt-0.5">18% GST</div>
                <div className="text-[9px] text-slate-500 mt-0.5">CGST 9% + SGST 9%</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80">
                <div className="text-[10px] text-slate-400 uppercase">Tax Invoice</div>
                <div className="text-xs font-bold text-white mt-0.5">Printed Bill</div>
                <div className="text-[9px] text-slate-500 mt-0.5">With Warranty Card</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80">
                <div className="text-[10px] text-slate-400 uppercase">ITC Claim</div>
                <div className="text-xs font-bold text-emerald-300 mt-0.5">Available (B2B)</div>
                <div className="text-[9px] text-slate-500 mt-0.5">Input Tax Credit</div>
              </div>
            </div>
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

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30">
                    GST SAC 998713
                  </span>
                  <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-500/30">
                    Free Bench Check
                  </span>
                </div>
              </div>

              {/* Desktop Semantic Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <caption className="sr-only">
                    {category.name} Quality &amp; Best Value Matrix at Super Telecom Giridih
                  </caption>
                  <thead>
                    <tr className="border-b border-slate-800/80 bg-slate-950/40 text-slate-400 font-mono uppercase tracking-wider text-[11px]">
                      <th scope="col" className="py-3.5 px-6">Service &amp; Supported Phones</th>
                      <th scope="col" className="py-3.5 px-6">Quality Standard</th>
                      <th scope="col" className="py-3.5 px-6">Best Value Promise</th>
                      <th scope="col" className="py-3.5 px-6">Turnaround &amp; Warranty</th>
                      <th scope="col" className="py-3.5 px-6 text-right">Best Rate Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {category.rows.map((row, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-cyan-950/20 transition-colors group"
                      >
                        <td className="py-4 px-6 font-semibold text-white group-hover:text-cyan-300 transition-colors max-w-xs">
                          <div className="flex flex-col gap-1">
                            <span>{row.service}</span>
                            <span className="text-[11px] font-normal text-slate-400">{row.deviceType}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 font-mono text-slate-300">
                          <div className="flex flex-col gap-1">
                            <span className="inline-flex w-fit items-center px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950/70 border border-cyan-800/40 text-cyan-300">
                              {row.partGrade}
                            </span>
                            <span className="text-[10px] text-emerald-400 font-bold">{row.gstStatus} (SAC {row.sacCode})</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 font-semibold text-emerald-400 text-xs max-w-[220px]">
                          {row.valueGuarantee}
                        </td>
                        <td className="py-4 px-6 text-slate-300 font-mono">
                          <div className="flex flex-col gap-1">
                            <span className="text-white font-semibold">{row.turnaround}</span>
                            <span className="inline-flex w-fit items-center gap-1 px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] text-amber-300">
                              {row.warranty}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex justify-end">
                            <RepairConsultationAction
                              compact
                              buttonSize="sm"
                              layout="row"
                              serviceName={row.service}
                              model={row.deviceType}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Compact 2-Column Grid */}
              <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-3 p-3">
                {category.rows.map((row, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col justify-between rounded-2xl bg-slate-950/80 border border-slate-800/90 p-4 space-y-3 card-hover-lift"
                  >
                    <div>
                      <h4 className="font-bold text-white text-xs sm:text-sm leading-tight">
                        {row.service}
                      </h4>
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono bg-cyan-950/70 border border-cyan-800/40 text-cyan-300">
                          {row.partGrade}
                        </span>
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-950/70 border border-emerald-800/40 text-emerald-300">
                          {row.gstStatus}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1.5 line-clamp-2">
                        {row.deviceType}
                      </p>
                      <div className="mt-2.5 bg-emerald-950/30 p-2 rounded-xl border border-emerald-500/30">
                        <span className="text-[11px] font-bold text-emerald-300 block leading-snug">
                          {row.valueGuarantee}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-1 text-[10px] text-slate-400 font-mono">
                        <span className="flex items-center gap-0.5 text-slate-300">
                          <Clock className="h-2.5 w-2.5 text-cyan-400" /> {row.turnaround}
                        </span>
                        <span>•</span>
                        <span className="truncate">{row.warranty}</span>
                      </div>
                    </div>

                    <div className="mt-2">
                      <RepairConsultationAction
                        compact
                        buttonSize="sm"
                        layout="row"
                        serviceName={row.service}
                        model={row.deviceType}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footnote on Diagnostics */}
        <div className="mt-8 p-4 rounded-2xl bg-slate-900/60 border border-cyan-500/20 text-xs text-slate-300 flex items-start gap-3">
          <HelpCircle className="h-5 w-5 text-cyan-400 flex-none mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-white">Bench Consultation &amp; Physical Diagnostics:</strong> {REPAIR_PRICE_DISCLAIMER} Every completed repair receives an official GST tax invoice and written warranty card for peace of mind.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingMatrix;
