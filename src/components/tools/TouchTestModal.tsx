import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Maximize2,
  RotateCcw,
  X,
  Smartphone,
  CheckCircle,
  Palette,
  Check,
  Zap,
  Activity,
  Layers,
} from "lucide-react";
import { useHardwarePermissions } from "@/hooks/useHardwarePermissions";
import { PermissionSheet } from "@/components/common/PermissionSheet";

interface TouchTestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ROWS = 14;
const COLS = 9;
const TOTAL_TILES = ROWS * COLS;

const DEAD_PIXEL_COLORS = [
  { name: "Pure Red (#FF0000)", bg: "#FF0000", text: "#FFFFFF", note: "Sub-pixel red test" },
  { name: "Pure Green (#00FF00)", bg: "#00FF00", text: "#000000", note: "Sub-pixel green test" },
  { name: "Pure Blue (#0000FF)", bg: "#0000FF", text: "#FFFFFF", note: "Sub-pixel blue test" },
  { name: "Pure White (#FFFFFF)", bg: "#FFFFFF", text: "#000000", note: "Uniform backlight & tint test" },
  { name: "Pure Black (#000000)", bg: "#000000", text: "#FFFFFF", note: "OLED bleed & stuck pixel test" },
];

export const TouchTestModal: React.FC<TouchTestModalProps> = ({ isOpen, onClose }) => {
  const { requestWakeLockPermission, releaseWakeLock, triggerVibration } = useHardwarePermissions();
  const [activeTab, setActiveTab] = useState<"touch" | "dead_pixel">("touch");
  const [touchedTiles, setTouchedTiles] = useState<boolean[]>(() => new Array(TOTAL_TILES).fill(false));
  const [pixelColorIndex, setPixelColorIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [wakeLockActive, setWakeLockActive] = useState(false);
  const [permissionSheetOpen, setPermissionSheetOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Auto request WakeLock on entry so screen stays awake
  useEffect(() => {
    if (isOpen) {
      requestWakeLockPermission().then((granted) => {
        setWakeLockActive(granted);
      });
    } else {
      releaseWakeLock();
      setWakeLockActive(false);
    }
    return () => {
      releaseWakeLock();
    };
  }, [isOpen, requestWakeLockPermission, releaseWakeLock]);

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
    triggerVibration(40);
    setTouchedTiles(new Array(TOTAL_TILES).fill(false));
  };

  const toggleFullscreen = () => {
    triggerVibration(30);
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
    <>
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-white select-none animate-in fade-in"
      >
        {/* Top Header App Bar */}
        <div className="flex items-center justify-between px-3 py-2.5 bg-slate-900 border-b border-slate-800 z-30 flex-none">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                triggerVibration(30);
                setActiveTab("touch");
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "touch"
                  ? "bg-cyan-500 text-slate-950 shadow-md"
                  : "bg-slate-800 text-slate-300 hover:text-white"
              }`}
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span>Touch Matrix</span>
            </button>
            <button
              type="button"
              onClick={() => {
                triggerVibration(30);
                setActiveTab("dead_pixel");
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "dead_pixel"
                  ? "bg-cyan-500 text-slate-950 shadow-md"
                  : "bg-slate-800 text-slate-300 hover:text-white"
              }`}
            >
              <Palette className="h-3.5 w-3.5" />
              <span>RGB Pixel Test</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* WakeLock indicator */}
            <span
              className={`hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                wakeLockActive
                  ? "bg-emerald-950/80 border border-emerald-500/40 text-emerald-400"
                  : "bg-slate-800 text-slate-400"
              }`}
            >
              <Zap className="h-3 w-3" />
              {wakeLockActive ? "WakeLock Active" : "Screen Normal"}
            </span>

            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300"
              title="Toggle Fullscreen"
            >
              <Maximize2 className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white"
              title="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Tab 1: Touch Digitizer Grid */}
        {activeTab === "touch" && (
          <div className="flex-1 flex flex-col min-h-0 bg-slate-950 relative">
            {/* Live Completion Strip */}
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-slate-800 text-xs flex-none">
              <div className="flex items-center gap-2">
                <span className="font-mono text-cyan-400 font-bold text-sm">
                  {progressPercent}% Complete
                </span>
                <span className="text-[11px] text-slate-400">
                  ({touchedCount} / {TOTAL_TILES} tiles)
                </span>
              </div>

              <div className="flex items-center gap-2">
                {progressPercent === 100 && (
                  <span className="flex items-center gap-1 text-emerald-400 font-bold text-xs">
                    <CheckCircle className="h-4 w-4" /> 100% Digitizer Passed
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center gap-1 px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold active:scale-95"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Reset
                </button>
              </div>
            </div>

            {/* Interactive Grid with neon green trails */}
            <div
              className="flex-1 grid gap-0.5 p-1 touch-none"
              style={{
                gridTemplateRows: `repeat(${ROWS}, minmax(0, 1fr))`,
                gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
              }}
              onPointerMove={handlePointerMove}
              onPointerDown={handlePointerMove}
            >
              {touchedTiles.map((isTouched, index) => (
                <div
                  key={index}
                  data-tile-index={index}
                  className={`border transition-colors duration-75 rounded-sm flex items-center justify-center ${
                    isTouched
                      ? "bg-emerald-500 border-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.7)]"
                      : "bg-slate-900/90 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  {isTouched && <Check className="h-2.5 w-2.5 text-slate-950 font-black" />}
                </div>
              ))}
            </div>

            {/* Instruction Footer */}
            <div className="px-4 py-2 bg-slate-950/95 border-t border-slate-800/80 text-center flex-none">
              <span className="text-[11px] text-slate-400">
                Drag your finger across all edges and diagonals. Dead digitizer sections will remain dark.
              </span>
            </div>
          </div>
        )}

        {/* Tab 2: RGB Dead Pixel Inspector */}
        {activeTab === "dead_pixel" && (
          <div
            className="flex-1 flex flex-col items-center justify-between p-6 cursor-pointer select-none transition-colors duration-200 relative"
            style={{ backgroundColor: DEAD_PIXEL_COLORS[pixelColorIndex].bg }}
            onClick={() => {
              triggerVibration(40);
              setPixelColorIndex((prev) => (prev + 1) % DEAD_PIXEL_COLORS.length);
            }}
          >
            {/* Center Hint Card */}
            <div
              className="p-4 rounded-2xl backdrop-blur-md border shadow-2xl max-w-sm text-center mx-auto my-auto transition-opacity"
              style={{
                backgroundColor:
                  DEAD_PIXEL_COLORS[pixelColorIndex].bg === "#000000"
                    ? "rgba(30, 41, 59, 0.85)"
                    : "rgba(15, 23, 42, 0.85)",
                borderColor: "rgba(255, 255, 255, 0.15)",
                color: "#ffffff",
              }}
            >
              <div className="text-xs font-mono font-bold tracking-wider uppercase text-cyan-400 mb-1">
                Sub-Pixel Screen Inspection
              </div>
              <h4 className="text-base font-black">
                {DEAD_PIXEL_COLORS[pixelColorIndex].name}
              </h4>
              <p className="text-xs text-slate-300 mt-1">
                {DEAD_PIXEL_COLORS[pixelColorIndex].note}
              </p>

              <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-slate-400">
                Tap anywhere on screen to switch color (
                {pixelColorIndex + 1} / {DEAD_PIXEL_COLORS.length})
              </div>
            </div>

            {/* Bottom Color Swatches Bar */}
            <div
              className="flex items-center gap-2 p-2 rounded-2xl bg-slate-950/80 border border-slate-800/80 backdrop-blur-md"
              onClick={(e) => e.stopPropagation()}
            >
              {DEAD_PIXEL_COLORS.map((col, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    triggerVibration(30);
                    setPixelColorIndex(idx);
                  }}
                  className={`w-7 h-7 rounded-xl border-2 transition-transform active:scale-90 ${
                    pixelColorIndex === idx
                      ? "scale-110 border-white shadow-lg"
                      : "border-transparent opacity-60"
                  }`}
                  style={{ backgroundColor: col.bg }}
                  title={col.name}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <PermissionSheet
        isOpen={permissionSheetOpen}
        onClose={() => setPermissionSheetOpen(false)}
        onAllowed={() => setPermissionSheetOpen(false)}
        requiredPermissions={["wakeLock"]}
        title="Keep Screen Awake (WakeLock)"
        description="Prevent the display from turning off or dimming while inspecting touch sensitivity and dead sub-pixels."
      />
    </>
  );
};

export default TouchTestModal;
