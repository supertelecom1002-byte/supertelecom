import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Info,
  ShieldCheck,
  Eye,
} from "lucide-react";
import { useHardwarePermissions } from "@/hooks/useHardwarePermissions";

interface DeadPixelTestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COLORS = [
  { hex: "#FF0000", name: "Pure Red (#FF0000)", subpixel: "Red Sub-pixel Audit", text: "#FFFFFF" },
  { hex: "#00FF00", name: "Pure Green (#00FF00)", subpixel: "Green Sub-pixel Audit", text: "#000000" },
  { hex: "#0000FF", name: "Pure Blue (#0000FF)", subpixel: "Blue Sub-pixel Audit", text: "#FFFFFF" },
  { hex: "#FFFFFF", name: "Pure White (#FFFFFF)", subpixel: "Backlight & Uniformity Test", text: "#000000" },
  { hex: "#000000", name: "Pure Black (#000000)", subpixel: "OLED Light Bleed & Stuck Pixels", text: "#FFFFFF" },
];

export const DeadPixelTestModal: React.FC<DeadPixelTestModalProps> = ({ isOpen, onClose }) => {
  const { requestWakeLockPermission, releaseWakeLock, triggerVibration } = useHardwarePermissions();
  const [colorIndex, setColorIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showHud, setShowHud] = useState(true);
  const hudTimerRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Request WakeLock to prevent screen timeout during inspection
  useEffect(() => {
    if (isOpen) {
      requestWakeLockPermission().catch(() => {});
    } else {
      releaseWakeLock();
      setIsFullscreen(false);
      setAutoPlay(false);
      setColorIndex(0);
    }
    return () => {
      releaseWakeLock();
    };
  }, [isOpen, requestWakeLockPermission, releaseWakeLock]);

  // Auto cycle timer
  useEffect(() => {
    if (!isOpen || !autoPlay) return;
    const interval = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % COLORS.length);
      triggerVibration(15);
    }, 2500);
    return () => clearInterval(interval);
  }, [isOpen, autoPlay, triggerVibration]);

  // Auto-hide HUD after 3 seconds of inactivity
  useEffect(() => {
    if (showHud) {
      if (hudTimerRef.current) clearTimeout(hudTimerRef.current);
      hudTimerRef.current = window.setTimeout(() => {
        setShowHud(false);
      }, 3500);
    }
    return () => {
      if (hudTimerRef.current) clearTimeout(hudTimerRef.current);
    };
  }, [showHud, colorIndex]);

  if (!isOpen) return null;

  const currentColor = COLORS[colorIndex];

  const handleNextColor = (e: React.MouseEvent) => {
    // If clicking a control button, don't cycle
    if ((e.target as HTMLElement).closest("button")) return;

    if (!showHud) {
      setShowHud(true);
    } else {
      triggerVibration(15);
      setColorIndex((prev) => (prev + 1) % COLORS.length);
    }
  };

  const toggleFullscreen = () => {
    triggerVibration(15);
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      onClick={handleNextColor}
      style={{ backgroundColor: currentColor.hex }}
      className="fixed inset-0 z-50 flex flex-col justify-between p-4 select-none transition-colors duration-200 cursor-pointer"
      role="dialog"
      aria-modal="true"
    >
      {/* Top HUD Bar */}
      <div
        className={`transition-opacity duration-300 ${
          showHud ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between max-w-xl mx-auto bg-black/75 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-2.5 shadow-2xl text-white">
          <div className="flex items-center gap-2">
            <span
              className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-sm"
              style={{ backgroundColor: currentColor.hex }}
            />
            <div>
              <div className="text-xs font-bold font-mono tracking-tight">{currentColor.name}</div>
              <div className="text-[10px] text-slate-300">{currentColor.subpixel}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                triggerVibration(15);
                setAutoPlay(!autoPlay);
              }}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                autoPlay ? "bg-cyan-500 text-black font-bold" : "bg-white/10 hover:bg-white/20 text-white"
              }`}
            >
              {autoPlay ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">{autoPlay ? "Pause" : "Auto"}</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleFullscreen();
              }}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
              title="Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                triggerVibration(15);
                onClose();
              }}
              className="p-2 rounded-xl bg-rose-500/80 hover:bg-rose-500 text-white transition-all"
              title="Close Test"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Center Guidance Hint (Fades out) */}
      <div
        className={`text-center transition-opacity duration-300 pointer-events-none ${
          showHud ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="inline-flex flex-col items-center gap-1 bg-black/70 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-3 shadow-2xl text-white max-w-xs">
          <Eye className="h-5 w-5 text-cyan-400 animate-pulse" />
          <span className="text-xs font-bold">Tap Screen to Cycle Color</span>
          <span className="text-[10px] text-slate-300">
            Color {colorIndex + 1} of {COLORS.length} • Inspect for dark or discolored dots
          </span>
        </div>
      </div>

      {/* Bottom Color Swatches Bar */}
      <div
        className={`transition-opacity duration-300 ${
          showHud ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-center gap-2 max-w-sm mx-auto bg-black/75 backdrop-blur-md border border-white/20 rounded-2xl p-2 shadow-2xl">
          {COLORS.map((c, idx) => (
            <button
              key={c.hex}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                triggerVibration(15);
                setColorIndex(idx);
              }}
              style={{ backgroundColor: c.hex }}
              className={`w-9 h-9 rounded-xl border transition-all ${
                colorIndex === idx
                  ? "ring-2 ring-cyan-400 scale-110 border-white"
                  : "border-white/30 opacity-70 hover:opacity-100"
              }`}
              title={c.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeadPixelTestModal;
