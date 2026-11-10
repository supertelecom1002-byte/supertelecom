import React, { useState } from "react";
import {
  Layers,
  RotateCw,
  Cpu,
  ChevronRight,
  X,
  Sparkles,
  Phone,
  MessageCircle,
  ExternalLink,
} from "lucide-react";
import { Floating3DIcon } from "./Floating3DIcon";
import { Smartphone3DFallback } from "./Smartphone3DFallback";
import { BUSINESS_MASTER } from "@/config/superTelecomConfig";

interface MobileHotspot {
  id: string;
  name: string;
  hindiName: string;
  badge: string;
  color: string;
  spec: string;
}

const MOBILE_HOTSPOTS: MobileHotspot[] = [
  {
    id: "screen",
    name: "AMOLED Display",
    hindiName: "120Hz सुपर रेटिना स्क्रीन",
    badge: "OCA Vacuum Swap",
    color: "#06b6d4",
    spec: "30-Min Restoration",
  },
  {
    id: "dead-phone",
    name: "Logic Board",
    hindiName: "चिप-लेवल BGA मदरबोर्ड",
    badge: "0.02mm Micro-Jumper",
    color: "#10b981",
    spec: "BGA Rework 350°C",
  },
  {
    id: "battery",
    name: "Battery Pack",
    hindiName: "5000mAh लिथियम सेल",
    badge: "Original BMS Safety",
    color: "#f59e0b",
    spec: "6 Months Warranty",
  },
  {
    id: "camera",
    name: "Triple Optics",
    hindiName: "सफायर OIS कैमरा",
    badge: "Cleanroom Alignment",
    color: "#a855f7",
    spec: "Original Lens Glass",
  },
  {
    id: "charging",
    name: "Type-C Sub-Board",
    hindiName: "24-पिन चार्जिंग सॉकेट",
    badge: "Gold-Plated Contacts",
    color: "#38bdf8",
    spec: "Instant Replacement",
  },
];

export const Mobile3DLabCard: React.FC = () => {
  const [selectedHotspot, setSelectedHotspot] = useState<MobileHotspot>(MOBILE_HOTSPOTS[1]);
  const [isTeardownModalOpen, setIsTeardownModalOpen] = useState(false);

  return (
    <>
      <div className="w-full rounded-2xl border border-cyan-500/30 bg-slate-900/90 p-3.5 backdrop-blur-xl shadow-[0_4px_25px_rgba(6,182,212,0.12)] space-y-3 select-none">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5 font-display">
                <span>3D Hardware Lab Bench</span>
                <span className="flex h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              </div>
              <div className="text-[10px] font-mono text-cyan-400">
                19 DISASSEMBLED HARDWARE LAYERS
              </div>
            </div>
          </div>

          <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40">
            60 FPS TOUCH READY
          </span>
        </div>

        {/* Interactive 3D Holographic Stage */}
        <div
          onClick={() => setIsTeardownModalOpen(true)}
          className="relative rounded-xl border border-slate-800 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-3 flex flex-col items-center justify-center overflow-hidden cursor-pointer active:scale-[0.99] transition-transform"
        >
          {/* Ambient Grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-15"
            style={{
              backgroundImage:
                "linear-gradient(rgba(6,182,212,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.2) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />

          {/* Floating 3D Procedural Component */}
          <div className="relative h-28 w-28 flex items-center justify-center">
            <Floating3DIcon
              type={selectedHotspot.id}
              isSelected={true}
              className="h-24 w-24"
            />
          </div>

          {/* Component Title & Hindi Subtitle */}
          <div className="text-center space-y-0.5 mt-1 z-10">
            <div className="font-bold text-sm text-white flex items-center justify-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: selectedHotspot.color }}
              />
              <span>{selectedHotspot.name}</span>
            </div>
            <div className="text-[11px] text-slate-300 font-medium">
              {selectedHotspot.hindiName}
            </div>
            <div className="flex items-center justify-center gap-2 pt-1 text-[10px] font-mono">
              <span className="text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                {selectedHotspot.badge}
              </span>
              <span className="text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                {selectedHotspot.spec}
              </span>
            </div>
          </div>

          <div className="mt-2 text-[9px] font-mono text-cyan-400 flex items-center gap-1 opacity-80">
            <span>Tap to open full 3D schematic</span>
            <ChevronRight className="h-2.5 w-2.5" />
          </div>
        </div>

        {/* Component Selector Tabs */}
        <div className="grid grid-cols-5 gap-1 pt-1">
          {MOBILE_HOTSPOTS.map((spot) => {
            const isSelected = selectedHotspot.id === spot.id;
            return (
              <button
                key={spot.id}
                type="button"
                onClick={() => setSelectedHotspot(spot)}
                className={`py-1.5 px-1 rounded-xl text-center flex flex-col items-center justify-center gap-1 transition-all text-[9px] font-mono border cursor-pointer ${
                  isSelected
                    ? "bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-md shadow-cyan-500/20 scale-102"
                    : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                }`}
              >
                <span className="truncate w-full">{spot.name.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Full Exploration CTA (Opens dedicated 3D Modal) */}
        <button
          type="button"
          onClick={() => setIsTeardownModalOpen(true)}
          className="w-full py-2.5 px-3 rounded-xl border border-cyan-500/40 bg-gradient-to-r from-cyan-950/90 via-slate-900 to-blue-950/90 text-cyan-300 font-bold flex items-center justify-between text-xs active:scale-98 transition-all cursor-pointer shadow-lg shadow-cyan-500/10"
        >
          <span className="flex items-center gap-1.5">
            <RotateCw className="h-3.5 w-3.5 text-cyan-400 animate-spin" style={{ animationDuration: "10s" }} />
            <span>Launch Full 360° Teardown Lab</span>
          </span>
          <ChevronRight className="h-3.5 w-3.5 text-cyan-400" />
        </button>
      </div>

      {/* FULLSCREEN MOBILE 3D TEARDOWN MODAL */}
      {isTeardownModalOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-white overflow-y-auto animate-in fade-in duration-200">
          {/* Top Bar with Close Button */}
          <div className="sticky top-0 z-50 flex items-center justify-between p-4 bg-slate-900/95 border-b border-slate-800 backdrop-blur-xl">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                <Layers className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-display text-white">
                  3D Teardown Lab Bench
                </h3>
                <span className="text-[10px] font-mono text-cyan-400">
                  Giridih #1 Chip-Level Architecture
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsTeardownModalOpen(false)}
              className="h-9 w-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer active:scale-95"
              aria-label="Close 3D Lab"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Modal Content: Full Interactive 2.5D Blueprint & Teardown Stage */}
          <div className="p-4 flex-1">
            <Smartphone3DFallback />
          </div>

          {/* Footer Contact Bar */}
          <div className="sticky bottom-0 z-50 p-3 bg-slate-900/95 border-t border-slate-800 backdrop-blur-xl flex items-center gap-2">
            <a
              href={`https://wa.me/${BUSINESS_MASTER.whatsappRaw || "918002903643"}?text=${encodeURIComponent(
                "नमस्ते सुपर टेलीकॉम गिरिडीह, मैंने मोबाइल पर आपका 3D स्मार्टफोन टियरडाउन देखा। मुझे रिपेयर के बारे में जानकारी चाहिए।"
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
            >
              <MessageCircle className="h-4 w-4" />
              <span>WhatsApp Lab</span>
            </a>
            <a
              href={BUSINESS_MASTER.phoneCallHref}
              className="py-2.5 px-4 rounded-xl border border-slate-700 bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95"
            >
              <Phone className="h-4 w-4 text-cyan-400" />
              <span>Call</span>
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default Mobile3DLabCard;