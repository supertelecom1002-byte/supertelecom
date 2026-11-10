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
  REPAIR_PRICE_DISCLAIMER,
  buildWhatsAppQuoteUrl,
} from "@/config/superTelecomConfig";
import { buildConsultationWhatsAppUrl } from "@/components/consultation/RepairConsultationAction";

interface PricingRow {
  service: string;
  deviceType: string;
  partGrade: string;
  priceRange: string;
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
    description: "Original Service Pack, OEM-Grade AMOLED, and Compatible Aftermarket IPS LCD screens.",
    rows: [
      {
        service: "iPhone Retina OLED & Display Assembly",
        deviceType: "iPhone (11 / 12 / 13 / 14 / 15 / 16 Series)",
        partGrade: "Original Service Pack",
        priceRange: "₹3,499 – ₹14,999",
        gstStatus: "18% GST Included",
        sacCode: "998713",
        turnaround: "30–60 Mins",
        warranty: "Up to 90 Days",
      },
      {
        service: "Android Curved & Flat AMOLED Display",
        deviceType: "Samsung, OnePlus, Xiaomi, Vivo, Realme, OPPO",
        partGrade: "OEM-Grade AMOLED",
        priceRange: "₹2,499 – ₹8,999",
        gstStatus: "18% GST Included",
        sacCode: "998713",
        turnaround: "30–45 Mins",
        warranty: "Up to 90 Days",
      },
      {
        service: "Android IPS LCD & Touch Glass Assembly",
        deviceType: "Budget & Mid-Range Android Smartphones",
        partGrade: "Compatible Aftermarket",
        priceRange: "₹899 – ₹2,499",
        gstStatus: "18% GST Included",
        sacCode: "998713",
        turnaround: "30–45 Mins",
        warranty: "Up to 90 Days",
      },
      {
        service: "Outer Touch Glass Only (OCA Lamination)",
        deviceType: "Display Functional, Only Glass Broken",
        partGrade: "Factory Grade OCA",
        priceRange: "₹699 – ₹2,199",
        gstStatus: "18% GST Included",
        sacCode: "998713",
        turnaround: "45–90 Mins",
        warranty: "Tested on Bench",
      },
    ],
  },
  {
    id: "battery",
    name: "Battery & Charging Restoration",
    icon: <BatteryCharging className="h-5 w-5 text-emerald-400" />,
    description: "Certified high-density replacement batteries and OEM fast-charging port sub-boards.",
    rows: [
      {
        service: "High-Capacity Battery Replacement",
        deviceType: "Android Phones (Samsung, Redmi, Vivo, etc.)",
        partGrade: "OEM-Grade Li-Polymer",
        priceRange: "₹699 – ₹2,499",
        gstStatus: "18% GST Included",
        sacCode: "998713",
        turnaround: "20–35 Mins",
        warranty: "90 Days Warranty",
      },
      {
        service: "iPhone Battery (BMS Health Micro-Welded)",
        deviceType: "iPhone Models (100% Health Status Maintained)",
        partGrade: "Original Service Pack",
        priceRange: "₹1,899 – ₹4,999",
        gstStatus: "18% GST Included",
        sacCode: "998713",
        turnaround: "45–60 Mins",
        warranty: "90 Days Warranty",
      },
      {
        service: "Type-C & Lightning Port Replacement",
        deviceType: "All Brands (Fast Charging & OTG Verified)",
        partGrade: "OEM Fast-Charge Board",
        priceRange: "₹349 – ₹1,499",
        gstStatus: "18% GST Included",
        sacCode: "998713",
        turnaround: "20–40 Mins",
        warranty: "30 Days Warranty",
      },
    ],
  },
  {
    id: "motherboard",
    name: "Motherboard & Chip-Level BGA Lab",
    icon: <Cpu className="h-5 w-5 text-amber-400" />,
    description: "Stereomicroscope micro-soldering, short-circuit debugging, PMIC & CPU reballing.",
    rows: [
      {
        service: "Dead Phone & Power IC Micro-Soldering",
        deviceType: "All Smartphones (Short Circuit / PMIC / Charging IC)",
        partGrade: "Original Service Pack",
        priceRange: "₹899 – ₹5,999",
        gstStatus: "18% GST Included",
        sacCode: "998713",
        turnaround: "Same Day / 24–48h",
        warranty: "60 Days Warranty",
      },
      {
        service: "Dual-Layer Board Splitting & CPU Reballing",
        deviceType: "High-End Flagships (Snapdragon / Dimensity / Apple A-Series)",
        partGrade: "Precision BGA Station",
        priceRange: "₹1,999 – ₹7,999",
        gstStatus: "18% GST Included",
        sacCode: "998713",
        turnaround: "24–48 Hours",
        warranty: "60 Days Warranty",
      },
      {
        service: "Network, Wi-Fi & Audio IC Faults",
        deviceType: "No Service / Greyed-out Wi-Fi / Speaker IC",
        partGrade: "OEM-Grade IC",
        priceRange: "₹799 – ₹3,499",
        gstStatus: "18% GST Included",
        sacCode: "998713",
        turnaround: "Same Day / 24h",
        warranty: "60 Days Warranty",
      },
    ],
  },
  {
    id: "laser",
    name: "AMOLED Laser & Water Damage Revival",
    icon: <Zap className="h-5 w-5 text-purple-400" />,
    description: "Laser line healing without screen replacement, plus ultrasonic chemical bath de-oxidation.",
    rows: [
      {
        service: "Green / Pink Vertical Line Laser Repair",
        deviceType: "Samsung, OnePlus & Vivo AMOLED Panels",
        partGrade: "Laser Trace Restoration",
        priceRange: "₹1,499 – ₹3,999",
        gstStatus: "18% GST Included",
        sacCode: "998713",
        turnaround: "Same Day / 2–4 Hours",
        warranty: "60 Days Warranty",
      },
      {
        service: "Water Damage Ultrasonic Chemical Revival",
        deviceType: "Liquid Dropped Devices & Heavy Oxidation",
        partGrade: "Ultrasonic Solvent Bath",
        priceRange: "₹499 – ₹2,499",
        gstStatus: "18% GST Included",
        sacCode: "998713",
        turnaround: "2–5 Hours / 24h",
        warranty: "Bench Tested",
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

  const getWhatsAppUrl = (service: string, device: string, price: string) => {
    return buildConsultationWhatsAppUrl({
      serviceName: `${service} (${price})`,
      model: device,
    });
  };

  return (
    <section
      id="pricing-matrix"
      aria-label="Super Telecom Repair Pricing Matrix & GST Table Giridih"
      className="py-8 sm:py-16 md:py-28 bg-slate-950 text-slate-100 relative overflow-hidden border-y border-slate-800/80"
    >
      {/* Background Ambience Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-[11px] sm:text-xs font-mono font-bold uppercase mb-3 sm:mb-4 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            Official Giridih Repair Price Index · GST Compliant
          </div>

          <h2 className="text-xl sm:text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Smartphone Repair Price &amp; GST Table
          </h2>

          <p className="mt-3 sm:mt-4 text-xs sm:text-base text-slate-300 leading-relaxed">
            Transparent price estimates on Barganda Road, Giridih. 100% authentic spare parts, official GST tax invoice, and up to 90 days warranty on every hardware repair.
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
                "Super Telecom provides 100% official GST Tax Invoices and physical warranty cards for all smartphone repairs and spare parts. All prices shown in the table below are inclusive of 18% GST under SAC Code 998713. Business and corporate clients can claim full Input Tax Credit (ITC) with their registered GSTIN."
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
                    {category.name} Pricing &amp; GST Table for Smartphone Repairs at Super Telecom Giridih
                  </caption>
                  <thead>
                    <tr className="border-b border-slate-800/80 bg-slate-950/40 text-slate-400 font-mono uppercase tracking-wider text-[11px]">
                      <th scope="col" className="py-3.5 px-6">Service Name &amp; Grade</th>
                      <th scope="col" className="py-3.5 px-6">Supported Models</th>
                      <th scope="col" className="py-3.5 px-6">Estimated Price (₹)</th>
                      <th scope="col" className="py-3.5 px-6">GST Status &amp; SAC</th>
                      <th scope="col" className="py-3.5 px-6">Turnaround</th>
                      <th scope="col" className="py-3.5 px-6">Lab Warranty</th>
                      <th scope="col" className="py-3.5 px-6 text-right">Consultation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {category.rows.map((row, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-cyan-950/20 transition-colors group"
                      >
                        <td className="py-4 px-6 font-semibold text-white group-hover:text-cyan-300 transition-colors">
                          <div className="flex flex-col gap-1">
                            <span>{row.service}</span>
                            <span className="inline-flex w-fit items-center px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950/70 border border-cyan-800/40 text-cyan-300">
                              {row.partGrade}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-slate-400">
                          {row.deviceType}
                        </td>
                        <td className="py-4 px-6 font-mono font-black text-emerald-400 text-sm">
                          {row.priceRange}
                        </td>
                        <td className="py-4 px-6 font-mono text-slate-300">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-emerald-400 font-bold text-[11px]">{row.gstStatus}</span>
                            <span className="text-[10px] text-slate-500">SAC: {row.sacCode}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 font-mono text-slate-300">
                          {row.turnaround}
                        </td>
                        <td className="py-4 px-6 text-slate-300">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[11px]">
                            {row.warranty}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <a
                              href={getWhatsAppUrl(row.service, row.deviceType, row.priceRange)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 font-bold text-xs transition-all"
                            >
                              <MessageCircle className="h-3.5 w-3.5" />
                              <span>WhatsApp</span>
                            </a>
                            <a
                              href={BUSINESS_MASTER.phoneCallHref}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs transition-all"
                            >
                              <Phone className="h-3 w-3 text-cyan-400" />
                              <span>Call</span>
                            </a>
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
                      <div className="mt-2.5 flex items-baseline justify-between bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                        <span className="text-[10px] font-mono text-slate-400">Est. Price:</span>
                        <span className="font-mono font-black text-emerald-400 text-sm tracking-tight">
                          {row.priceRange}
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

                    <div className="mt-2 flex gap-2">
                      <a
                        href={getWhatsAppUrl(row.service, row.deviceType, row.priceRange)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-transform active:scale-95"
                      >
                        <MessageCircle className="h-3.5 w-3.5 shrink-0" />
                        <span>Enquiry</span>
                      </a>
                      <a
                        href={BUSINESS_MASTER.phoneCallHref}
                        className="inline-flex items-center justify-center gap-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs transition-transform active:scale-95"
                      >
                        <Phone className="h-3 w-3 text-cyan-400 shrink-0" />
                        <span>Call</span>
                      </a>
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
