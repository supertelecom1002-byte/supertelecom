import React, { useState, useEffect, useRef } from "react";
import {
  X,
  RotateCcw,
  Sparkles,
  Smartphone,
  ShieldCheck,
  AlertCircle,
  Activity,
  Layers,
} from "lucide-react";
import { useHardwarePermissions } from "@/hooks/useHardwarePermissions";

interface MultiTouchTesterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TouchPoint {
  id: number;
  x: number;
  y: number;
  color: string;
}

const TOUCH_COLORS = [
  "#22d3ee", // Cyan
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#f43f5e", // Rose
  "#a855f7", // Purple
  "#3b82f6", // Blue
  "#ec4899", // Pink
  "#84cc16", // Lime
  "#eab308", // Yellow
  "#06b6d4", // Sky
];

export const MultiTouchTesterModal: React.FC<MultiTouchTesterModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { triggerVibration } = useHardwarePermissions();
  const [touches, setTouches] = useState<TouchPoint[]>([]);
  const [maxTouches, setMaxTouches] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setTouches([]);
      setMaxTouches(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTouch = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    const rawTouches = Array.from(e.touches);
    const count = rawTouches.length;

    const points: TouchPoint[] = rawTouches.map((t, idx) => ({
      id: t.identifier,
      x: t.clientX,
      y: t.clientY,
      color: TOUCH_COLORS[idx % TOUCH_COLORS.length],
    }));

    setTouches(points);
    if (count > maxTouches) {
      setMaxTouches(count);
      triggerVibration(15);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    const rawTouches = Array.from(e.touches);
    const points: TouchPoint[] = rawTouches.map((t, idx) => ({
      id: t.identifier,
      x: t.clientX,
      y: t.clientY,
      color: TOUCH_COLORS[idx % TOUCH_COLORS.length],
    }));
    setTouches(points);
  };

  const resetTest = () => {
    triggerVibration(15);
    setTouches([]);
    setMaxTouches(0);
  };

  const getHardwareGrade = () => {
    if (maxTouches >= 10) return { label: "10-Point Original Flagship Digitizer", color: "text-emerald-400 bg-emerald-950/80 border-emerald-500/40" };
    if (maxTouches >= 5) return { label: "5-Point Standard Multi-Touch Panel", color: "text-cyan-400 bg-cyan-950/80 border-cyan-500/40" };
    if (maxTouches >= 2) return { label: "2-Point Dual-Touch Digitizer", color: "text-amber-400 bg-amber-950/80 border-amber-500/40" };
    return { label: "Touch display with multiple fingers to test", color: "text-slate-400 bg-slate-900 border-slate-700" };
  };

  const grade = getHardwareGrade();

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouch}
      onTouchMove={handleTouch}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      className="fixed inset-0 z-50 bg-[#020617] text-white flex flex-col justify-between select-none touch-none overflow-hidden"
      role="dialog"
      aria-modal="true"
    >
      {/* Top Header Card */}
      <div className="p-4 z-20">
        <div className="max-w-lg mx-auto bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 shadow-2xl flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-cyan-400" />
              <h2 className="text-sm font-bold">10-Point Multi-Touch Inspector</h2>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${grade.color}`}>
                {grade.label}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={resetTest}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              title="Reset Peak Count"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                triggerVibration(15);
                onClose();
              }}
              className="p-2 rounded-xl bg-rose-500/80 hover:bg-rose-500 text-white transition-colors"
              title="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Center Live HUD Counter */}
      <div className="text-center z-10 pointer-events-none px-4">
        <div className="inline-flex flex-col items-center bg-slate-900/70 backdrop-blur-md border border-cyan-500/30 rounded-3xl p-6 shadow-2xl space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
            Live Active Touches
          </div>
          <div className="text-6xl font-black font-mono tracking-tight text-white flex items-baseline gap-1">
            <span>{touches.length}</span>
            <span className="text-2xl text-slate-500">/ 10</span>
          </div>
          <div className="text-xs font-mono text-slate-300">
            Peak Recorded: <strong className="text-emerald-400">{maxTouches} Fingers</strong>
          </div>
        </div>
      </div>

      {/* Render Dynamic Touch Visualizer Rings */}
      {touches.map((t, idx) => (
        <div
          key={t.id}
          style={{
            left: `${t.x}px`,
            top: `${t.y}px`,
            transform: "translate(-50%, -50%)",
            borderColor: t.color,
          }}
          className="absolute pointer-events-none rounded-full flex items-center justify-center animate-ping"
        >
          <div
            style={{ borderColor: t.color, backgroundColor: `${t.color}33` }}
            className="w-24 h-24 rounded-full border-2 flex items-center justify-center shadow-lg"
          >
            <div
              style={{ backgroundColor: t.color }}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-950 font-bold text-xs font-mono shadow-md"
            >
              {idx + 1}
            </div>
          </div>
        </div>
      ))}

      {/* Bottom Instructions Card */}
      <div className="p-4 z-20">
        <div className="max-w-sm mx-auto text-center bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-3 shadow-xl">
          <p className="text-[11px] text-slate-300">
            Place all 10 fingers simultaneously on the screen to evaluate digitizer IC multiplexing capability.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MultiTouchTesterModal;
