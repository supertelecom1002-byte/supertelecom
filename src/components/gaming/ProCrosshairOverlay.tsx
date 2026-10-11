import React, { useState } from "react";
import { useGamingMode, type CrosshairStyle } from "@/context/GamingModeContext";
import { Crosshair, Sliders, X, Check } from "lucide-react";

export const ProCrosshairOverlay: React.FC = () => {
  const { crosshairConfig, setCrosshairConfig, toggleCrosshair } = useGamingMode();
  const [panelOpen, setPanelOpen] = useState(false);

  const colors = [
    { label: "Neon Green", hex: "#22c55e" },
    { label: "Laser Red", hex: "#ef4444" },
    { label: "Cyber Cyan", hex: "#06b6d4" },
    { label: "Electric Amber", hex: "#f59e0b" },
    { label: "Neon Pink", hex: "#ec4899" },
    { label: "Pure White", hex: "#ffffff" },
  ];

  const styles: { id: CrosshairStyle; label: string }[] = [
    { id: "dot", label: "Laser Dot (●)" },
    { id: "cross", label: "Tactical Cross (+)" },
    { id: "circle", label: "Circle & Dot (◎)" },
  ];

  return (
    <>
      {/* 1. Center Crosshair Reticle (Strictly Center, Non-Interactive) */}
      {crosshairConfig.enabled && (
        <div
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50 select-none flex items-center justify-center transition-all duration-75"
          style={{
            width: `${crosshairConfig.size}px`,
            height: `${crosshairConfig.size}px`,
          }}
          aria-hidden="true"
        >
          {crosshairConfig.style === "dot" && (
            <div
              className="rounded-full shadow-lg"
              style={{
                width: `${Math.max(4, Math.round(crosshairConfig.size * 0.35))}px`,
                height: `${Math.max(4, Math.round(crosshairConfig.size * 0.35))}px`,
                backgroundColor: crosshairConfig.color,
                boxShadow: `0 0 8px ${crosshairConfig.color}, 0 0 2px #000`,
              }}
            />
          )}

          {crosshairConfig.style === "cross" && (
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Horizontal line */}
              <div
                className="absolute"
                style={{
                  width: `${crosshairConfig.size}px`,
                  height: "2px",
                  backgroundColor: crosshairConfig.color,
                  boxShadow: `0 0 6px ${crosshairConfig.color}`,
                }}
              />
              {/* Vertical line */}
              <div
                className="absolute"
                style={{
                  height: `${crosshairConfig.size}px`,
                  width: "2px",
                  backgroundColor: crosshairConfig.color,
                  boxShadow: `0 0 6px ${crosshairConfig.color}`,
                }}
              />
              {/* Center micro gap/dot */}
              <div
                className="absolute w-1 h-1 rounded-full"
                style={{ backgroundColor: crosshairConfig.color }}
              />
            </div>
          )}

          {crosshairConfig.style === "circle" && (
            <div className="relative w-full h-full flex items-center justify-center">
              <div
                className="w-full h-full rounded-full border-2"
                style={{
                  borderColor: crosshairConfig.color,
                  boxShadow: `0 0 6px ${crosshairConfig.color}`,
                }}
              />
              <div
                className="absolute rounded-full"
                style={{
                  width: `${Math.max(3, Math.round(crosshairConfig.size * 0.2))}px`,
                  height: `${Math.max(3, Math.round(crosshairConfig.size * 0.2))}px`,
                  backgroundColor: crosshairConfig.color,
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* 2. Floating Quick HUD Button (Right Edge) */}
      <div className="fixed top-24 right-3 z-40 pointer-events-auto">
        <button
          type="button"
          onClick={() => setPanelOpen(!panelOpen)}
          className={`h-9 px-2.5 rounded-xl border flex items-center gap-1.5 shadow-xl backdrop-blur-xl text-xs font-mono font-bold transition-all active:scale-95 ${
            crosshairConfig.enabled
              ? "bg-slate-950/90 border-emerald-500/50 text-emerald-400 shadow-emerald-950/30"
              : "bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white"
          }`}
          title="Crosshair Config Panel"
        >
          <Crosshair className="h-4 w-4" style={{ color: crosshairConfig.enabled ? crosshairConfig.color : undefined }} />
          <span className="hidden sm:inline">Aim HUD</span>
        </button>
      </div>

      {/* 3. Crosshair Quick Tuning Panel */}
      {panelOpen && (
        <div className="fixed top-36 right-3 z-50 w-64 rounded-2xl bg-slate-950/95 border border-cyan-500/30 p-4 shadow-2xl backdrop-blur-2xl text-white text-xs space-y-3 pointer-events-auto animate-in slide-in-from-right-3 duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-1.5 font-bold">
              <Crosshair className="h-4 w-4 text-cyan-400" />
              <span>Pro Crosshair HUD</span>
            </div>
            <button
              type="button"
              onClick={() => setPanelOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Toggle Button */}
          <div className="flex items-center justify-between">
            <span className="text-slate-300 font-semibold">Crosshair Reticle</span>
            <button
              type="button"
              onClick={toggleCrosshair}
              className={`px-3 py-1 rounded-lg font-bold text-[10px] uppercase font-mono transition-all ${
                crosshairConfig.enabled
                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {crosshairConfig.enabled ? "Enabled" : "Disabled"}
            </button>
          </div>

          {/* Styles Selector */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Style</span>
            <div className="grid grid-cols-3 gap-1">
              {styles.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setCrosshairConfig({ style: s.id, enabled: true })}
                  className={`py-1.5 px-1 rounded-lg text-center font-mono text-[10px] transition-all border ${
                    crosshairConfig.style === s.id
                      ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {s.id === "dot" ? "● Dot" : s.id === "cross" ? "+ Cross" : "◎ Ring"}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selector */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Color</span>
            <div className="flex items-center justify-between gap-1">
              {colors.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => setCrosshairConfig({ color: c.hex, enabled: true })}
                  className="w-6 h-6 rounded-full border-2 transition-transform active:scale-90 flex items-center justify-center"
                  style={{
                    backgroundColor: c.hex,
                    borderColor: crosshairConfig.color === c.hex ? "#fff" : "transparent",
                    boxShadow: crosshairConfig.color === c.hex ? `0 0 8px ${c.hex}` : "none",
                  }}
                  title={c.label}
                >
                  {crosshairConfig.color === c.hex && (
                    <Check className="h-3 w-3 text-slate-950 stroke-[3]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Size Slider (12px to 32px) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>Size</span>
              <span className="text-cyan-400 font-bold">{crosshairConfig.size}px</span>
            </div>
            <input
              type="range"
              min="12"
              max="32"
              step="2"
              value={crosshairConfig.size}
              onChange={(e) => setCrosshairConfig({ size: Number(e.target.value) })}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ProCrosshairOverlay;
