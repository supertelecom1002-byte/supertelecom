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
  Crosshair,
} from "lucide-react";
import { useHardwarePermissions } from "@/hooks/useHardwarePermissions";
import { PermissionSheet } from "@/components/common/PermissionSheet";

interface TouchTestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ROWS = 15;
const COLS = 10;
const TOTAL_TILES = ROWS * COLS;

interface TouchPoint {
  id: number;
  x: number;
  y: number;
}

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
  const [activeTouches, setActiveTouches] = useState<TouchPoint[]>([]);
  const [ghostTouchCount, setGhostTouchCount] = useState(0);
  const [pixelColorIndex, setPixelColorIndex] = useState(0);
  const [autoCycle, setAutoCycle] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [wakeLockActive, setWakeLockActive] = useState(false);

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

  // Automatic 3-second cycle for RGB sub-pixel flasher
  useEffect(() => {
    if (activeTab !== "dead_pixel" || !autoCycle) return;
    const interval = setInterval(() => {
      setPixelColorIndex((prev) => (prev + 1) % DEAD_PIXEL_COLORS.length);
      triggerVibration(15);
    }, 3000);
    return () => clearInterval(interval);
  }, [activeTab, autoCycle, triggerVibration]);

  const handleTileTouch = useCallback((index: number) => {
    setTouchedTiles((prev) => {
      if (prev[index]) return prev;
      const next = [...prev];
      next[index] = true;
      return next;
    });
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activeTab !== "touch") return;
    setActiveTouches((prev) => [
      ...prev.filter((p) => p.id !== e.pointerId),
      { id: e.pointerId, x: Math.round(e.clientX), y: Math.round(e.clientY) },
    ]);

    const element = document.elementFromPoint(e.clientX, e.clientY);
    if (element && element.getAttribute("data-tile-index")) {
      const idx = Number(element.getAttribute("data-tile-index"));
      if (!isNaN(idx) && idx >= 0 && idx < TOTAL_TILES) {
        handleTileTouch(idx);
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activeTab !== "touch") return;
    setActiveTouches((prev) =>
      prev.map((p) => (p.id === e.pointerId ? { ...p, x: Math.round(e.clientX), y: Math.round(e.clientY) } : p))
    );

    const element = document.elementFromPoint(e.clientX, e.clientY);
    if (element && element.getAttribute("data-tile-index")) {
      const idx = Number(element.getAttribute("data-tile-index"));
      if (!isNaN(idx) && idx >= 0 && idx < TOTAL_TILES) {
        handleTileTouch(idx);
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setActiveTouches((prev) => prev.filter((p) => p.id !== e.pointerId));
  };

  const handleReset = () => {
    triggerVibration(30);
    setTouchedTiles(new Array(TOTAL_TILES).fill(false));
    setActiveTouches([]);
    setGhostTouchCount(0);
  };

  const toggleFullscreen = () => {
    triggerVibration(20);
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
      className="fixed inset-0 z-50 flex flex-col bg-[#02040a] text-white select-none animate-in fade-in"
    >
      {/* Top Header App Bar */}
      <div className="flex items-center justify-between px-3 py-2.5 bg-slate-950 border-b border-slate-800 z-30 flex-none">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              triggerVibration(20);
              setActiveTab("touch");
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "touch"
                ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                : "bg-slate-900 text-slate-300 hover:text-white"
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span>10x15 Neon Matrix</span>
          </button>
          <button
            type="button"
            onClick={() => {
              triggerVibration(20);
              setActiveTab("dead_pixel");
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "dead_pixel"
                ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                : "bg-slate-900 text-slate-300 hover:text-white"
            }`}
          >
            <Palette className="h-3.5 w-3.5" />
            <span>Sub-Pixel Flasher</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 active:scale-95"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              triggerVibration(15);
              onClose();
            }}
            className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white active:scale-95"
            title="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Tab 1: 10x15 Touch Matrix */}
      {activeTab === "touch" && (
        <div className="flex-1 flex flex-col min-h-0 bg-[#02040a] relative">
          {/* Live Completion & Ghost Touch Tracker Strip */}
          <div className="flex items-center justify-between px-3 py-2 bg-slate-900/90 border-b border-slate-800 text-xs flex-none">
            <div className="flex items-center gap-2">
              <span className="font-mono text-cyan-400 font-black text-sm">
                {progressPercent}% Complete
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                ({touchedCount}/{TOTAL_TILES})
              </span>
            </div>

            {/* Ghost Touch Coordinate Tracker */}
            <div className="flex items-center gap-2">
              {activeTouches.length > 0 ? (
                <div className="flex items-center gap-1 font-mono text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-lg border border-emerald-500/30">
                  <Crosshair className="h-3 w-3 animate-spin" />
                  <span>{activeTouches.length} Fingers ({activeTouches[0].x}, {activeTouches[0].y})</span>
                </div>
              ) : (
                <span className="text-[10px] text-slate-500 font-mono">
                  Ghost Tracker Idle
                </span>
              )}

              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold active:scale-95"
              >
                <RotateCcw className="h-3 w-3" /> Reset
              </button>
            </div>
          </div>

          {/* Interactive 10x15 Neon Grid */}
          <div
            className="flex-1 grid gap-0.5 p-1 touch-none"
            style={{
              gridTemplateRows: `repeat(${ROWS}, minmax(0, 1fr))`,
              gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            {touchedTiles.map((isTouched, index) => (
              <div
                key={index}
                data-tile-index={index}
                className={`border transition-colors duration-75 rounded-xs flex items-center justify-center ${
                  isTouched
                    ? "bg-[#10b981] border-[#34d399] shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                    : "bg-slate-900/90 border-slate-800/80 hover:border-slate-700"
                }`}
              >
                {isTouched && <Check className="h-2 w-2 text-slate-950 font-black" />}
              </div>
            ))}
          </div>

          {/* Touch Matrix Status Bar */}
          <div className="px-3 py-1.5 bg-slate-950 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between flex-none">
            <span>Drag all 4 edges &amp; diagonals. Dark areas indicate broken IC lines.</span>
            <span className="text-cyan-400 font-mono font-bold">100% Offline Mode</span>
          </div>
        </div>
      )}

      {/* Tab 2: RGB Sub-Pixel Flasher */}
      {activeTab === "dead_pixel" && (
        <div
          className="flex-1 flex flex-col items-center justify-between p-6 cursor-pointer select-none transition-colors duration-200 relative"
          style={{ backgroundColor: DEAD_PIXEL_COLORS[pixelColorIndex].bg }}
          onClick={() => {
            triggerVibration(25);
            setPixelColorIndex((prev) => (prev + 1) % DEAD_PIXEL_COLORS.length);
          }}
        >
          {/* Center Info Card */}
          <div
            className="p-4 rounded-2xl backdrop-blur-md border shadow-2xl max-w-xs text-center mx-auto my-auto"
            style={{
              backgroundColor: "rgba(15, 23, 42, 0.88)",
              borderColor: "rgba(255, 255, 255, 0.2)",
              color: "#ffffff",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 mb-1">
              Sub-Pixel Screen Inspection
            </div>
            <h4 className="text-sm font-black">
              {DEAD_PIXEL_COLORS[pixelColorIndex].name}
            </h4>
            <p className="text-[11px] text-slate-300 mt-1">
              {DEAD_PIXEL_COLORS[pixelColorIndex].note}
            </p>

            <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setAutoCycle((prev) => !prev)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                  autoCycle ? "bg-cyan-500 text-slate-950" : "bg-slate-800 text-slate-300"
                }`}
              >
                {autoCycle ? "Auto 3s (Active)" : "Auto 3s Cycle"}
              </button>
              <span className="text-[10px] text-slate-400 font-mono">
                {pixelColorIndex + 1} / {DEAD_PIXEL_COLORS.length}
              </span>
            </div>
          </div>

          {/* Color Swatches */}
          <div
            className="flex items-center gap-2 p-2 rounded-2xl bg-slate-950/80 border border-slate-800 backdrop-blur-md"
            onClick={(e) => e.stopPropagation()}
          >
            {DEAD_PIXEL_COLORS.map((col, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  triggerVibration(20);
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
  );
};

export default TouchTestModal;
