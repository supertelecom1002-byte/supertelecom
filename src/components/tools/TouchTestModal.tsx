import React, { useState, useRef, useEffect, useCallback } from "react";
import { Maximize2, RotateCcw, X, Smartphone, CheckCircle, Palette, Check } from "lucide-react";

interface TouchTestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ROWS = 12;
const COLS = 8;
const TOTAL_TILES = ROWS * COLS;

const DEAD_PIXEL_COLORS = [
  { name: "Pure Red (#FF0000)", bg: "#FF0000", text: "#FFFFFF" },
  { name: "Pure Green (#00FF00)", bg: "#00FF00", text: "#000000" },
  { name: "Pure Blue (#0000FF)", bg: "#0000FF", text: "#FFFFFF" },
  { name: "Pure White (#FFFFFF)", bg: "#FFFFFF", text: "#000000" },
  { name: "Pure Black (#000000)", bg: "#000000", text: "#FFFFFF" },
];

export const TouchTestModal: React.FC<TouchTestModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<"touch" | "dead_pixel">("touch");
  const [touchedTiles, setTouchedTiles] = useState<boolean[]>(() => new Array(TOTAL_TILES).fill(false));
  const [pixelColorIndex, setPixelColorIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleTileTouch = useCallback((index: number) => {
    setTouchedTiles((prev) => {
      if (prev[index]) return prev;
      const next = [...prev];
      next[index] = true;
      return next;
    });
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activeTab !== "touch") return;
    const element = document.elementFromPoint(e.clientX, e.clientY);
    if (element && element.getAttribute("data-tile-index")) {
      const idx = Number(element.getAttribute("data-tile-index"));
      if (!isNaN(idx) && idx >= 0 && idx < TOTAL_TILES) {
        handleTileTouch(idx);
      }
    }
  };

  const handleReset = () => {
    setTouchedTiles(new Array(TOTAL_TILES).fill(false));
  };

  const toggleFullscreen = () => {
    if (typeof document === "undefined") return;
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else if (document.fullscreenElement) {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  if (!isOpen) return null;

  const touchedCount = touchedTiles.filter(Boolean).length;
  const progressPercent = Math.round((touchedCount / TOTAL_TILES) * 100);

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-white select-none animate-in fade-in"
    >
      {/* Top Header Controls (Hidden during Dead Pixel Fullscreen for pure inspection) */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 z-20">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("touch")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "touch"
                ? "bg-cyan-500 text-slate-950 shadow-md"
                : "bg-slate-800 text-slate-300 hover:text-white"
            }`}
          >
            Touch Digitizer Grid
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("dead_pixel")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "dead_pixel"
                ? "bg-cyan-500 text-slate-950 shadow-md"
                : "bg-slate-800 text-slate-300 hover:text-white"
            }`}
          >
            Dead Pixel RGB Cycle
          </button>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === "touch" && (
            <button
              type="button"
              onClick={handleReset}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
              title="Reset Grid"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          )}

          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              if (document.fullscreenElement) {
                document.exitFullscreen().catch(() => {});
              }
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
            title="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Mode 1: Touch Digitizer Grid */}
      {activeTab === "touch" && (
        <div className="flex-1 flex flex-col p-2 bg-slate-950 overflow-hidden">
          {/* Progress Banner */}
          <div className="flex items-center justify-between px-3 py-1.5 mb-2 bg-slate-900/90 rounded-xl border border-slate-800 text-xs font-mono">
            <span className="text-slate-400">
              Drag finger across every box to detect touch dead-spots:
            </span>
            <span
              className={`font-bold ${
                progressPercent === 100 ? "text-emerald-400" : "text-cyan-400"
              }`}
            >
              {progressPercent}% Complete ({touchedCount}/{TOTAL_TILES})
            </span>
          </div>

          {/* Touch Grid */}
          <div
            className="flex-1 grid grid-cols-8 gap-1 p-1 bg-slate-900/40 rounded-2xl border border-slate-800 touch-none"
            onPointerMove={handlePointerMove}
            onPointerDown={handlePointerMove}
          >
            {touchedTiles.map((isTouched, idx) => (
              <div
                key={idx}
                data-tile-index={idx}
                className={`rounded-lg transition-colors duration-75 flex items-center justify-center text-[10px] font-mono border ${
                  isTouched
                    ? "bg-emerald-400 border-emerald-300 text-slate-950 font-bold shadow-[0_0_10px_rgba(52,211,153,0.7)]"
                    : "bg-slate-900 border-slate-800/80 text-slate-700"
                }`}
              >
                {isTouched ? <Check className="h-2.5 w-2.5 stroke-[3]" /> : idx + 1}
              </div>
            ))}
          </div>

          {progressPercent === 100 && (
            <div className="mt-2 p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-mono flex items-center justify-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
              <span>100% Passed! Touch digitizer hardware is fully responsive across the screen.</span>
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Dead Pixel RGB Cycle */}
      {activeTab === "dead_pixel" && (
        <div
          className="flex-1 flex flex-col items-center justify-center cursor-pointer relative"
          style={{ backgroundColor: DEAD_PIXEL_COLORS[pixelColorIndex].bg }}
          onClick={() => {
            setPixelColorIndex((prev) => (prev + 1) % DEAD_PIXEL_COLORS.length);
          }}
        >
          {/* Floating Instruction Pill */}
          <div
            className="px-4 py-2 rounded-full backdrop-blur-md bg-black/60 border border-white/20 text-xs font-mono font-bold tracking-wider shadow-2xl pointer-events-none"
            style={{ color: DEAD_PIXEL_COLORS[pixelColorIndex].text }}
          >
            Tap anywhere to cycle colors: {DEAD_PIXEL_COLORS[pixelColorIndex].name} ({pixelColorIndex + 1}/5)
          </div>

          <p
            className="mt-3 text-[11px] font-mono opacity-75 max-w-sm text-center px-4 pointer-events-none"
            style={{ color: DEAD_PIXEL_COLORS[pixelColorIndex].text }}
          >
            Inspect the screen closely for tiny black dots (dead sub-pixels) or bright off-color specks (stuck pixels).
          </p>
        </div>
      )}
    </div>
  );
};

export default TouchTestModal;
