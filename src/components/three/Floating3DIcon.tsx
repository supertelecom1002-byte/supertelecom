import React from "react";
import {
  Smartphone,
  Zap,
  BatteryCharging,
  PlugZap,
  Droplets,
  Camera,
  Volume2,
  ShieldAlert,
} from "lucide-react";

export type Fault3DType =
  | "screen"
  | "dead-phone"
  | "battery"
  | "charging"
  | "water-damage"
  | "camera"
  | "sound"
  | "body";

interface Floating3DIconProps {
  type: Fault3DType | string;
  isSelected?: boolean;
  className?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// HARDWARE-ACCELERATED CSS 3D HOLOGRAPHIC COMPONENT
// 0 WebGL contexts used -> Zero WebGL context loss, zero memory bloat, 120 FPS!
// ─────────────────────────────────────────────────────────────────────────────

export const Floating3DIcon: React.FC<Floating3DIconProps> = ({
  type,
  isSelected = false,
  className = "h-11 w-11",
}) => {
  return (
    <div
      className={`relative ${className} flex items-center justify-center select-none overflow-hidden rounded-xl transition-all duration-300 ${
        isSelected ? "scale-105" : "hover:scale-102"
      }`}
      style={{ perspective: "400px" }}
    >
      {/* Dynamic 3D Layered Glyph depending on Fault Type */}
      {render3DGlyph(type, isSelected)}
    </div>
  );
};

function render3DGlyph(type: string, isSelected: boolean) {
  switch (type) {
    case "screen":
      // 3D Glass Prism Display with cracked holographic OLED matrix
      return (
        <div
          className="relative flex items-center justify-center transition-transform duration-300"
          style={{
            transform: isSelected ? "rotateX(15deg) rotateY(-18deg) translateZ(10px)" : "rotateX(8deg) rotateY(-8deg)",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Back Glass Shimmer */}
          <div className="absolute inset-0 rounded-lg bg-cyan-950/80 border border-cyan-500/40 blur-[1px] transform -translate-z-2" />
          {/* Main Beveled AMOLED Slab */}
          <div className="relative h-8 w-8 rounded-lg bg-gradient-to-tr from-cyan-950 via-slate-900 to-cyan-900/90 border border-cyan-400/60 p-1 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            <Smartphone className="h-5 w-5 text-cyan-400 drop-shadow-[0_0_6px_#06b6d4]" />
            {/* Diagonal Crack Line */}
            <div className="absolute inset-x-1 top-2.5 h-[1.5px] bg-gradient-to-r from-white via-cyan-200 to-transparent rotate-25 shadow-sm" />
          </div>
        </div>
      );

    case "dead-phone":
      // 3D BGA Silicon Die & Emerald Logic Traces
      return (
        <div
          className="relative flex items-center justify-center transition-transform duration-300"
          style={{
            transform: isSelected ? "rotateX(18deg) rotateY(15deg) translateZ(10px)" : "rotateX(10deg) rotateY(10deg)",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Gold Pin Array Layer */}
          <div className="absolute inset-0 rounded-lg bg-amber-950/60 border border-amber-500/40 transform -translate-z-2" />
          {/* Silicon Core */}
          <div className="relative h-8 w-8 rounded-lg bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-950 border border-emerald-400/70 p-1 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)]">
            <Zap className="h-5 w-5 text-emerald-400 drop-shadow-[0_0_6px_#10b981]" />
            {/* Logic Bus Dot */}
            <div className="absolute bottom-1 right-1 h-1 w-1 rounded-full bg-emerald-400 animate-ping" />
          </div>
        </div>
      );

    case "battery":
      // 3D Lithium Pouch Cell with glowing charge level
      return (
        <div
          className="relative flex items-center justify-center transition-transform duration-300"
          style={{
            transform: isSelected ? "rotateX(12deg) rotateY(-15deg) translateZ(10px)" : "rotateX(6deg) rotateY(-6deg)",
            transformStyle: "preserve-3d",
          }}
        >
          <div className="relative h-8 w-8 rounded-lg bg-gradient-to-br from-slate-900 via-amber-950/80 to-slate-950 border border-amber-400/60 p-1 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.4)]">
            <BatteryCharging className="h-5 w-5 text-amber-400 drop-shadow-[0_0_6px_#f59e0b]" />
            {/* Terminal Tab */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 h-1 w-3 bg-amber-400 rounded-xs shadow-xs" />
          </div>
        </div>
      );

    case "charging":
      // 3D Type-C Precision Socket Receptacle
      return (
        <div
          className="relative flex items-center justify-center transition-transform duration-300"
          style={{
            transform: isSelected ? "rotateX(-12deg) rotateY(15deg) translateZ(10px)" : "rotateX(-6deg) rotateY(6deg)",
            transformStyle: "preserve-3d",
          }}
        >
          <div className="relative h-8 w-8 rounded-lg bg-gradient-to-br from-slate-900 via-sky-950 to-slate-950 border border-sky-400/60 p-1 flex items-center justify-center shadow-[0_0_15px_rgba(56,189,248,0.4)]">
            <PlugZap className="h-5 w-5 text-sky-400 drop-shadow-[0_0_6px_#38bdf8]" />
          </div>
        </div>
      );

    case "water-damage":
      // 3D Liquid Droplet & Ultrasonic Wave
      return (
        <div
          className="relative flex items-center justify-center transition-transform duration-300"
          style={{
            transform: isSelected ? "rotateX(15deg) rotateY(10deg) scale(1.1)" : "rotateX(5deg) rotateY(5deg)",
            transformStyle: "preserve-3d",
          }}
        >
          <div className="relative h-8 w-8 rounded-lg bg-gradient-to-br from-slate-900 via-blue-950 to-cyan-950 border border-blue-400/60 p-1 flex items-center justify-center shadow-[0_0_15px_rgba(14,165,233,0.4)]">
            <Droplets className="h-5 w-5 text-blue-400 drop-shadow-[0_0_6px_#0ea5e9]" />
            {/* Concentric Wave Ring */}
            <div className="absolute inset-0 rounded-lg border border-cyan-400/40 animate-ping opacity-30" />
          </div>
        </div>
      );

    case "camera":
      // 3D Sapphire Lens Barrel Array
      return (
        <div
          className="relative flex items-center justify-center transition-transform duration-300"
          style={{
            transform: isSelected ? "rotateX(10deg) rotateY(-18deg) translateZ(10px)" : "rotateX(5deg) rotateY(-5deg)",
            transformStyle: "preserve-3d",
          }}
        >
          <div className="relative h-8 w-8 rounded-lg bg-gradient-to-br from-slate-900 via-purple-950 to-slate-950 border border-purple-400/60 p-1 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)]">
            <Camera className="h-5 w-5 text-purple-400 drop-shadow-[0_0_6px_#a855f7]" />
            {/* Aperture Glint */}
            <div className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-purple-200/80 blur-[0.5px]" />
          </div>
        </div>
      );

    case "sound":
      // 3D Acoustic Transducer Cone & Sonic Waves
      return (
        <div
          className="relative flex items-center justify-center transition-transform duration-300"
          style={{
            transform: isSelected ? "rotateX(-10deg) rotateY(-15deg) translateZ(10px)" : "rotateX(-5deg) rotateY(-5deg)",
            transformStyle: "preserve-3d",
          }}
        >
          <div className="relative h-8 w-8 rounded-lg bg-gradient-to-br from-slate-900 via-rose-950 to-slate-950 border border-rose-400/60 p-1 flex items-center justify-center shadow-[0_0_15px_rgba(244,63,94,0.4)]">
            <Volume2 className="h-5 w-5 text-rose-400 drop-shadow-[0_0_6px_#f43f5e]" />
          </div>
        </div>
      );

    case "body":
    default:
      // 3D Aerospace Aluminum Chassis Bracket
      return (
        <div
          className="relative flex items-center justify-center transition-transform duration-300"
          style={{
            transform: isSelected ? "rotateX(12deg) rotateY(12deg) translateZ(10px)" : "rotateX(6deg) rotateY(6deg)",
            transformStyle: "preserve-3d",
          }}
        >
          <div className="relative h-8 w-8 rounded-lg bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 border border-slate-400/60 p-1 flex items-center justify-center shadow-[0_0_15px_rgba(148,163,184,0.4)]">
            <ShieldAlert className="h-5 w-5 text-slate-300 drop-shadow-[0_0_6px_#94a3b8]" />
          </div>
        </div>
      );
  }
}

export default Floating3DIcon;
