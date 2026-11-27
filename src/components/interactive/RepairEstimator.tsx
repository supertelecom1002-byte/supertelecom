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
  Phone,
  HelpCircle,
  Tag,
} from "lucide-react";
import {
  AppleLogo,
  SamsungLogo,
  OnePlusLogo,
  GooglePixelLogo,
  XiaomiLogo,
  VivoLogo,
} from "@/components/icons/BrandVectors";
import { SmartAuthDrawer } from "@/components/auth/SmartAuthDrawer";
import { BUSINESS_MASTER } from "@/config/superTelecomConfig";
import { buildConsultationWhatsAppUrl } from "@/components/consultation/RepairConsultationAction";

interface BrandOption {
  id: string;
  name: string;
  isApple: boolean;
  renderLogo: (props: { size?: number; className?: string }) => React.ReactNode;
}

interface FaultOption {
  id: string;
  label: string;
  sub: string;
  icon: React.ComponentType<{ className?: string }>;
  turnaround: string;
  warranty: string;
}

const BRANDS: BrandOption[] = [
  { id: "apple", name: "Apple iPhone", isApple: true, renderLogo: (p) => <AppleLogo {...p} /> },
  { id: "samsung", name: "Samsung Galaxy", isApple: false, renderLogo: (p) => <SamsungLogo {...p} /> },
  { id: "oneplus", name: "OnePlus", isApple: false, renderLogo: (p) => <OnePlusLogo {...p} /> },
  { id: "google", name: "Google Pixel", isApple: false, renderLogo: (p) => <GooglePixelLogo {...p} /> },
  { id: "xiaomi", name: "Xiaomi / Redmi", isApple: false, renderLogo: (p) => <XiaomiLogo {...p} /> },
  { id: "vivo", name: "Vivo / iQOO", isApple: false, renderLogo: (p) => <VivoLogo {...p} /> },
];

const FAULTS: FaultOption[] = [
  {
    id: "display",
    label: "Display & Touch Screen",
    sub: "Broken glass, black screen, vertical lines, touch response",
    icon: Smartphone,
    turnaround: "30 to 45 Minutes",
    warranty: "Up to 90 Days",
  },
  {
    id: "motherboard",
    label: "Motherboard IC & Dead Phone",
    sub: "No power, boot loop, short circuit, PMIC & CPU reball",
    icon: Cpu,
    turnaround: "Same Day / 24 Hours",
    warranty: "60 Days Warranty",
  },
  {
    id: "battery",
    label: "Battery Replacement",
    sub: "Rapid drain, swelling, shutdown under 30%, charging port",
    icon: BatteryCharging,
    turnaround: "20 to 30 Minutes",
    warranty: "90 Days Warranty",
  },
  {
    id: "amoled-line",
    label: "AMOLED Green / Pink Line",
    sub: "Laser trace restoration without costly full panel swap",
    icon: Zap,
    turnaround: "Same Day / 2 to 4 Hours",
    warranty: "60 Days Warranty",
  },
  {
    id: "water",
    label: "Water Damage Ultrasonic Revival",
    sub: "Ultrasonic chemical de-oxidation & corrosive salt wash",
    icon: Droplets,
    turnaround: "2 to 5 Hours",
    warranty: "Tested & Bench Verified",
  },
];

const PHONE_TIERS = [
  { id: "budget", label: "Budget Android", sub: "Entry & Everyday Smartphones" },
  { id: "midrange", label: "Mid-Range 5G", sub: "AMOLED / Fast-Charge Series" },
  { id: "flagship", label: "Flagship / iPhone", sub: "Pro Max, Ultra & Curved OLED" },
] as const;

export const RepairEstimator: React.FC = () => {
  const [selectedBrand, setSelectedBrand] = useState<string>("apple");
  const [selectedTier, setSelectedTier] = useState<"budget" | "midrange" | "flagship">("midrange");
  const [customModel, setCustomModel] = useState<string>("");
  const [selectedFault, setSelectedFault] = useState<string>("display");
  const [selectedPartGrade, setSelectedPartGrade] = useState<"aftermarket" | "oem">("oem");
  const [authDrawerOpen, setAuthDrawerOpen] = useState<boolean>(false);

  const brandObj = BRANDS.find((b) => b.id === selectedBrand) || BRANDS[0];
  const tierObj = PHONE_TIERS.find((t) => t.id === selectedTier) || PHONE_TIERS[1];
  const faultObj = FAULTS.find((f) => f.id === selectedFault) || FAULTS[0];

  let componentGrade = "OEM-Grade";
  let gradeBadge = "सबसे कम दाम • बेस्ट क्वालिटी";

  if (selectedFault === "display") {
    if (brandObj.isApple) {
      componentGrade = "Original Service Pack / Retina OLED";
      gradeBadge = "Original Service Pack";
    } else if (selectedPartGrade === "aftermarket") {
      componentGrade = "Tested Budget / Compatible IPS LCD";
      gradeBadge = "किफ़ायती बजट ग्रेड";
    } else {
      componentGrade = "OEM-Grade (120Hz AMOLED / Original Assembly)";
      gradeBadge = "बेस्ट क्वालिटी OEM";
    }
  } else if (selectedFault === "battery") {
    componentGrade = brandObj.isApple
      ? "Original Service Pack (BMS Reprogrammed)"
      : "Zero-Cycle OEM High-Density Cell";
    gradeBadge = "बेस्ट प्राइस गारंटी";
  } else if (selectedFault === "motherboard") {
    componentGrade = "45X Trinocular BGA Micro-Soldering";
    gradeBadge = "चिप-लेवल लैब गारंटी";
  } else if (selectedFault === "amoled-line") {
    componentGrade = "Laser Trace ITO Jumper Restoration";
    gradeBadge = "लेज़र रिपेयर बचत";
  } else if (selectedFault === "water") {
    componentGrade = "Ultrasonic De-Oxidation & Chemical Wash";
    gradeBadge = "इमरजेंसी लैब रिकवरी";
  }

  const deviceLabel = customModel.trim()
    ? `${customModel.trim()} (${tierObj.label})`
    : tierObj.label;

  const whatsappUrl = buildConsultationWhatsAppUrl({
    brand: brandObj.name,
    model: deviceLabel,
    serviceName: `${faultObj.label} (${componentGrade})`,
    issue: faultObj.sub,
  });

  return (
    <section
      id="repair-calculator"
      aria-label="Instant Best Value & Quote Engine"
      className="py-8 sm:py-16 md:py-28 bg-[#020617] text-slate-100 relative overflow-hidden border-t border-slate-800/80"
    >
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-cyan-500/5 blur-[160px] rounded-full -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold uppercase mb-4 shadow-sm">
            <Wrench className="h-3.5 w-3.5 text-cyan-400" />
            Instant Best-Price &amp; Quality Quote Engine
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            अपना फ़ोन व समस्या चुनें — तुरंत सबसे कम रेट जानें
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400 leading-relaxed">
            सस्ते बजट Android से लेकर महँगे फ्लैगशिप iPhone व Samsung Ultra तक — अपना ब्रांड, मॉडल श्रेणी और खराबी चुनकर Instant Best-Price Pass पाएं।
          </p>
        </div>

        {/* Step 1: Select Brand */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              Step 1: Select Brand (ब्रांड चुनें)
            </span>
            <span className="text-xs text-slate-500 font-mono">Giridih In-House Lab</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {BRANDS.map((brand) => {
              const isSelected = selectedBrand === brand.id;
              return (
                <button
                  key={brand.id}
                  type="button"
                  onClick={() => setSelectedBrand(brand.id)}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-200 active:scale-95 min-h-[58px] cursor-pointer ${
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

        {/* Step 2: Select Phone Tier & Optional Model */}
        <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              Step 2: Select Phone Segment &amp; Model (बजट / मिड-रेंज / फ्लैगशिप)
            </span>
            <input
              type="text"
              value={customModel}
              onChange={(e) => setCustomModel(e.target.value)}
              placeholder="Optional: Type exact model (e.g. Redmi Note 13, iPhone 15)"
              className="w-full sm:w-80 rounded-xl bg-slate-900 border border-slate-700 focus:border-cyan-400 px-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PHONE_TIERS.map((tier) => {
              const active = selectedTier === tier.id;
              return (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setSelectedTier(tier.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    active
                      ? "bg-cyan-950/50 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                      : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white"
                  }`}
                >
                  <div className="text-xs sm:text-sm font-bold text-white">{tier.label}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{tier.sub}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Select Fault */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              Step 3: Select Problem Type (समस्या चुनें)
            </span>
            <span className="text-xs text-slate-500 font-mono">Bench Hardware Diagnosis</span>
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
                  className={`flex flex-col text-left p-4 rounded-2xl border transition-all duration-200 active:scale-95 min-h-[58px] cursor-pointer ${
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

        {/* Part Grade Toggle for Android Display Repairs */}
        {!brandObj.isApple && selectedFault === "display" && (
          <div className="mb-8 p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-mono uppercase text-cyan-400 font-bold flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5" /> Quality Preference
              </span>
              <p className="text-xs text-slate-400 mt-0.5">
                Choose between value budget IPS LCD replacement or flagship-standard AMOLED assembly:
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSelectedPartGrade("aftermarket")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedPartGrade === "aftermarket"
                    ? "bg-cyan-500 text-slate-950 shadow-md"
                    : "bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                }`}
              >
                Value Budget (IPS LCD)
              </button>
              <button
                type="button"
                onClick={() => setSelectedPartGrade("oem")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedPartGrade === "oem"
                    ? "bg-cyan-500 text-slate-950 shadow-md"
                    : "bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                }`}
              >
                Best Quality OEM / AMOLED
              </button>
            </div>
          </div>
        )}

        {/* Instant Best-Price Pass Card */}
        <div className="rounded-3xl border border-emerald-500/40 bg-gradient-to-br from-slate-900/95 via-slate-900 to-emerald-950/30 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs font-mono font-bold tracking-wider text-emerald-400 uppercase">
                  Instant Best-Price Pass
                </span>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold">
                  {gradeBadge}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                ✅ आपकी समस्या के लिए सबसे कम और पक्का रेट तैयार है!
              </h3>
              <p className="text-xs sm:text-sm text-cyan-300 font-semibold mt-1">
                {brandObj.name} • {deviceLabel} • {faultObj.label}
              </p>
            </div>

            <div className="flex flex-col gap-1 bg-emerald-950/50 px-5 py-3.5 rounded-2xl border border-emerald-500/40">
              <span className="text-[11px] font-mono text-emerald-300 uppercase font-bold">
                Best Value Promise
              </span>
              <span className="text-sm sm:text-base font-extrabold text-white">
                सबसे कम दाम • बेस्ट क्वालिटी (Lowest Market Rate)
              </span>
              <span className="text-[11px] text-slate-300">
                100% पारदर्शी और किफ़ायती दाम • मुफ़्त जांच
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 my-6">
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <CheckCircle2 className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-white">मुफ़्त 5-मिनट हार्डवेयर जांच</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Free Physical Inspection</div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <Tag className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-white">दुकान में सबसे कम दाम की गारंटी</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{componentGrade}</div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <ShieldCheck className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-white">बिना डेटा खोए (100% Data Safe)</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Strict Zero-Snooping Lab</div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <Clock className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-white">लिखित वारंटी ({faultObj.warranty})</div>
                <div className="text-[11px] text-slate-400 mt-0.5">समय: {faultObj.turnaround}</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 w-full">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-6 py-3.5 text-xs sm:text-sm font-extrabold shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all hover:scale-[1.02] active:scale-95 min-h-[46px] w-full sm:w-auto cursor-pointer"
            >
              <MessageCircle className="h-4 w-4" />
              <span>WhatsApp पर अपना सबसे कम रेट पूछें</span>
              <ChevronRight className="h-4 w-4" />
            </a>

            <a
              href={BUSINESS_MASTER.phoneCallHref}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 px-6 py-3.5 text-xs sm:text-sm font-bold transition-all hover:scale-[1.02] active:scale-95 min-h-[46px] w-full sm:w-auto cursor-pointer"
            >
              <Phone className="h-4 w-4 text-cyan-400" />
              <span>सीधे कॉल करें ({BUSINESS_MASTER.phoneDisplay})</span>
            </a>

            <button
              type="button"
              onClick={() => setAuthDrawerOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cyan-500/40 bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 px-5 py-3.5 text-xs sm:text-sm font-bold transition-all min-h-[46px] w-full sm:w-auto cursor-pointer"
            >
              <span>Save Pass &amp; Book Bench</span>
            </button>
          </div>
        </div>
      </div>

      <SmartAuthDrawer
        isOpen={authDrawerOpen}
        onClose={() => setAuthDrawerOpen(false)}
        actionTitle={`Instant Best-Price Pass: ${brandObj.name} ${deviceLabel} (${faultObj.label})`}
        onSuccess={() => {
          window.open(whatsappUrl, "_blank", "noopener,noreferrer");
        }}
      />
    </section>
  );
};

export default RepairEstimator;
