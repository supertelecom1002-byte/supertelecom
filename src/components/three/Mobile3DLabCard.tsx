import React, { Suspense, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, useGLTF, Float, BakeShadows } from "@react-three/drei";
import * as THREE from "three";
import {
  Layers,
  Sparkles,
  RotateCw,
  Cpu,
  Zap,
  Eye,
  Activity,
  CheckCircle2,
  ChevronRight,
  Maximize2,
} from "lucide-react";
import { Floating3DIcon } from "./Floating3DIcon";

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
  const [isExpanded, setIsExpanded] = useState(false);

  return (
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
      <div className="relative rounded-xl border border-slate-800 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-3 flex flex-col items-center justify-center overflow-hidden">
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
      </div>

      {/* Component Selector Tabs */}
      <div className="grid grid-cols-5 gap-1 pt-1">
        {MOBILE_HOTSPOTS.map((spot) => {
          const isSelected = selectedHotspot.id === spot.id;
          return (
            <button
              key={spot.id}
              onClick={() => setSelectedHotspot(spot)}
              className={`py-1.5 px-1 rounded-xl text-center flex flex-col items-center justify-center gap-1 transition-all text-[9px] font-mono border ${
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

      {/* Full Exploration CTA */}
      <a
        href="#teardown-3d"
        className="w-full py-2 px-3 rounded-xl border border-cyan-500/40 bg-gradient-to-r from-cyan-950/90 via-slate-900 to-blue-950/90 text-cyan-300 font-bold flex items-center justify-between text-xs active:scale-98 transition-all"
      >
        <span className="flex items-center gap-1.5">
          <RotateCw className="h-3.5 w-3.5 text-cyan-400 animate-spin" style={{ animationDuration: "10s" }} />
          <span>Launch Full 360° Teardown Lab</span>
        </span>
        <ChevronRight className="h-3.5 w-3.5 text-cyan-400" />
      </a>
    </div>
  );
};

export default Mobile3DLabCard;
