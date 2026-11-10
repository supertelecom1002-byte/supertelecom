import React, { useState } from "react";
import {
  Smartphone,
  Phone,
  MessageCircle,
  Cpu,
  Layers,
  Zap,
  Eye,
  Activity,
  ShieldCheck,
  Clock,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  RotateCw,
} from "lucide-react";
import { BUSINESS_MASTER } from "@/config/superTelecomConfig";

interface BlueprintLayer {
  id: string;
  nameEn: string;
  nameHi: string;
  subtitle: string;
  symptoms: string;
  specs: string;
  time: string;
  warranty: string;
  color: string;
  badge: string;
  icon: any;
}

const BLUEPRINT_LAYERS: BlueprintLayer[] = [
  {
    id: "display",
    nameEn: "120Hz Super Retina AMOLED",
    nameHi: "120Hz सुपर रेटिना AMOLED डिस्प्ले",
    subtitle: "Front Glass, Touch Digitizer & OLED Matrix",
    symptoms: "टूटी स्क्रीन, ब्लैक स्पॉट्स, ग्रीन/पिंक लाइन, टच काम न करना।",
    specs: "OCA Vacuum Lamination • TrueTone Sync • Cryo-Separation",
    time: "30–60 मिनट",
    warranty: "90 दिन वारंटी",
    color: "#06b6d4",
    badge: "AMOLED Screen",
    icon: Layers,
  },
  {
    id: "motherboard",
    nameEn: "Chip-Level Logic Board & BGA PMIC",
    nameHi: "मदरबोर्ड चिप-लेवल आईसी व सीपीयू रीबॉलिंग",
    subtitle: "Double-Decker CPU, PMIC & Power Circuits",
    symptoms: "डेड फोन, ऑटो-रीस्टार्ट, नो नेटवर्क, चार्जिंग एरर, शार्ट सर्किट।",
    specs: "45x Trinocular Bench • 0.02mm Micro-Jumper • 350°C BGA Rework",
    time: "2–4 घंटे",
    warranty: "90 दिन वारंटी",
    color: "#10b981",
    badge: "Logic Board",
    icon: Cpu,
  },
  {
    id: "battery",
    nameEn: "5,000mAh High-Density Li-Ion Pack",
    nameHi: "5,000mAh ओरिजिनल बैटरी व थर्मल गार्ड",
    subtitle: "Zero-Cycle Power Cell & Qi2 Wireless Coil",
    symptoms: "बैटरी जल्दी खत्म होना, 40% पर फोन बंद होना, हीटिंग व फूलना।",
    specs: "Original BMS Health Sync • Thermal Guard • Zero-Cycle Cells",
    time: "20–40 मिनट",
    warranty: "6 महीने (180 दिन) वारंटी",
    color: "#f59e0b",
    badge: "Battery Cell",
    icon: Zap,
  },
  {
    id: "camera",
    nameEn: "Triple OIS Optical Camera Array",
    nameHi: "ट्रिपल OIS कैमरा व सफायर लेंस ग्लास",
    subtitle: "48MP/108MP Sensor & Laser Autofocus",
    symptoms: "धुंधली फोटो, कैमरा शेकिंग/वाइब्रेशन, टूटा लेंस शीशा, ब्लैक कैमरा।",
    specs: "Cleanroom Dust-Free Chamber • OIS Motor Alignment • Sapphire Glass",
    time: "30–45 मिनट",
    warranty: "90 दिन वारंटी",
    color: "#a855f7",
    badge: "Optics Array",
    icon: Eye,
  },
  {
    id: "port",
    nameEn: "Reinforced Type-C & Sub-Board Dock",
    nameHi: "टाइप-सी फास्ट-चार्ज पोर्ट व MEMS माइक",
    subtitle: "24-Pin Gold-Plated Dock & Primary Voice Mic",
    symptoms: "ढीला चार्जर, स्लो चार्जिंग, कॉल में आवाज कटना या नो साउंड।",
    specs: "120W Fast-Charge Passthrough • Gold-Plated Contacts • MEMS Mic",
    time: "25–45 मिनट",
    warranty: "90 दिन वारंटी",
    color: "#38bdf8",
    badge: "Type-C Dock",
    icon: Activity,
  },
];

export const Smartphone3DFallback: React.FC = () => {
  const [selectedLayer, setSelectedLayer] = useState<BlueprintLayer>(BLUEPRINT_LAYERS[0]);

  const SelectedIcon = selectedLayer.icon;

  return (
    <div className="relative w-full rounded-3xl border border-cyan-500/30 bg-slate-950 p-4 sm:p-6 md:p-8 text-white shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden select-none">
      {/* Background Blueprint Grid & Radial Glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            "linear-gradient(rgba(6,182,212,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.2) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />

      {/* Header Bar */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 text-xs font-mono font-bold tracking-wider uppercase mb-1.5">
            <Sparkles className="h-3 w-3 animate-pulse" />
            <span>Interactive Hardware Architecture</span>
            <span className="text-slate-500">•</span>
            <span className="text-white">Giridih Lab Bench #1</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black font-display text-white tracking-tight">
            स्मार्टफोन हार्डवेयर आर्किटेक्चर व डायग्नोस्टिक लैब
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            नीचे दिए गए पुर्जों (Components) पर क्लिक करें और गिरिडीह लैब की माइक्रोस्कोपिक रिपेयर तकनीक देखें।
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 font-mono text-[11px] font-bold flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
            100% On-Bench Ready
          </span>
        </div>
      </div>

      {/* Interactive 2.5D Exploded Blueprint Stage */}
      <div className="relative z-10 mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Visual Exploded Phone Layer Stack */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 relative">
          <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider mb-3 self-start flex items-center gap-1.5">
            <RotateCw className="h-3 w-3 text-cyan-400" />
            <span>Exploded Layer Stack (Click to Inspect)</span>
          </div>

          <div className="w-full max-w-xs space-y-2 py-2">
            {BLUEPRINT_LAYERS.map((layer, idx) => {
              const isSelected = selectedLayer.id === layer.id;
              const LayerIcon = layer.icon;
              return (
                <button
                  key={layer.id}
                  type="button"
                  onClick={() => setSelectedLayer(layer)}
                  className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
                    isSelected
                      ? "bg-slate-900 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)] scale-[1.02]"
                      : "bg-slate-950/70 border-slate-800/80 hover:border-slate-700 text-slate-400 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <div
                      className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border"
                      style={{
                        backgroundColor: isSelected ? `${layer.color}20` : "rgba(15,23,42,0.8)",
                        borderColor: isSelected ? layer.color : "rgba(51,65,85,0.6)",
                        color: layer.color,
                      }}
                    >
                      <LayerIcon className="h-4 w-4" />
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                        <span>{layer.nameEn.split(" ")[0]} {layer.nameEn.split(" ")[1] || ""}</span>
                        {isSelected && (
                          <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: layer.color }}
                          />
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono truncate">
                        Layer 0{idx + 1} • {layer.badge}
                      </div>
                    </div>
                  </div>

                  <span
                    className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border shrink-0"
                    style={{
                      borderColor: `${layer.color}40`,
                      color: layer.color,
                      backgroundColor: `${layer.color}10`,
                    }}
                  >
                    {layer.time}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Component Deep-Dive Card */}
        <div className="lg:col-span-7 rounded-2xl bg-slate-900/80 border border-cyan-500/30 p-5 sm:p-6 backdrop-blur-xl relative overflow-hidden space-y-4">
          <div
            className="absolute top-0 right-0 h-32 w-32 opacity-20 blur-2xl pointer-events-none rounded-full"
            style={{ backgroundColor: selectedLayer.color }}
          />

          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <span
                className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border"
                style={{
                  color: selectedLayer.color,
                  backgroundColor: `${selectedLayer.color}15`,
                  borderColor: `${selectedLayer.color}40`,
                }}
              >
                {selectedLayer.badge}
              </span>
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                {selectedLayer.warranty}
              </span>
            </div>
            <span className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
              <Clock className="h-3.5 w-3.5 text-cyan-400" />
              <span>रिपेयर समय: <strong className="text-white">{selectedLayer.time}</strong></span>
            </span>
          </div>

          <div>
            <h4 className="text-lg sm:text-xl font-black text-white flex items-center gap-2 font-display">
              <SelectedIcon className="h-5 w-5" style={{ color: selectedLayer.color }} />
              <span>{selectedLayer.nameHi}</span>
            </h4>
            <p className="text-xs sm:text-sm text-cyan-300 font-mono mt-0.5">
              {selectedLayer.nameEn}
            </p>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {selectedLayer.subtitle}
            </p>
          </div>

          {/* Diagnostic Symptoms Box */}
          <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-3 space-y-1">
            <div className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5 font-mono">
              <span>⚠️ खराबी के आम लक्षण (Common Symptoms):</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              {selectedLayer.symptoms}
            </p>
          </div>

          {/* Technical Bench Spec */}
          <div className="rounded-xl bg-cyan-950/30 border border-cyan-500/20 p-3 text-xs text-slate-300 font-mono flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-cyan-400 shrink-0" />
            <span><strong className="text-cyan-300">Lab Tech: </strong>{selectedLayer.specs}</span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href={`https://wa.me/${BUSINESS_MASTER.whatsappRaw || "918002903643"}?text=${encodeURIComponent(
                `नमस्ते सुपर टेलीकॉम गिरिडीह, मुझे अपने फोन में इस पुर्जे की रिपेयर करवानी है: ${selectedLayer.nameEn} (${selectedLayer.nameHi})। कृपया अनुमानित खर्च व समय बताएं।`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-[200px] py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:from-cyan-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <MessageCircle className="h-4 w-4" />
              <span>WhatsApp पर डायग्नोस्टिक व रेट पूछें</span>
            </a>
            <a
              href={BUSINESS_MASTER.phoneCallHref}
              className="py-3 px-4 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
            >
              <Phone className="h-3.5 w-3.5 text-cyan-400" />
              <span>कॉल करें</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Smartphone3DFallback;