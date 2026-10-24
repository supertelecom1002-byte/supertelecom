import React, { useState, useEffect } from "react";
import {
  X,
  Compass,
  RotateCcw,
  Sparkles,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Radio,
} from "lucide-react";
import { useHardwarePermissions } from "@/hooks/useHardwarePermissions";

interface GyroCompassModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GyroCompassModal: React.FC<GyroCompassModalProps> = ({ isOpen, onClose }) => {
  const { triggerVibration } = useHardwarePermissions();
  const [alpha, setAlpha] = useState<number>(0); // Compass direction (0-360)
  const [beta, setBeta] = useState<number>(0);   // Pitch (-180 to 180)
  const [gamma, setGamma] = useState<number>(0); // Roll (-90 to 90)
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);
  const [calibratedBeta, setCalibratedBeta] = useState<number>(0);
  const [calibratedGamma, setCalibratedGamma] = useState<number>(0);

  useEffect(() => {
    if (!isOpen) return;

    if (typeof window === "undefined" || !("DeviceOrientationEvent" in window)) {
      setIsSupported(false);
      return;
    }

    const handleOrientation = (e: DeviceOrientationEvent) => {
      setAlpha(Math.round(e.alpha || 0));
      setBeta(Math.round(e.beta || 0));
      setGamma(Math.round(e.gamma || 0));
      setPermissionGranted(true);
    };

    // iOS 13+ requires explicit permission request
    if (typeof (DeviceOrientationEvent as any)?.requestPermission === "function") {
      (DeviceOrientationEvent as any)
        .requestPermission()
        .then((resp: string) => {
          if (resp === "granted") {
            window.addEventListener("deviceorientation", handleOrientation);
          } else {
            setIsSupported(false);
          }
        })
        .catch(() => {
          setIsSupported(false);
        });
    } else {
      window.addEventListener("deviceorientation", handleOrientation);
    }

    return () => {
      try {
        window.removeEventListener("deviceorientation", handleOrientation);
      } catch {}
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const currentPitch = beta - calibratedBeta;
  const currentRoll = gamma - calibratedGamma;
  const isLevel = Math.abs(currentPitch) <= 1 && Math.abs(currentRoll) <= 1;

  // Calibrate current orientation as 0°
  const handleCalibrate = () => {
    triggerVibration(25);
    setCalibratedBeta(beta);
    setCalibratedGamma(gamma);
  };

  const handleResetCalibration = () => {
    triggerVibration(15);
    setCalibratedBeta(0);
    setCalibratedGamma(0);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-up select-none"
    >
      <div className="relative max-w-md w-full rounded-3xl bg-[#030712] border border-cyan-500/30 p-5 sm:p-6 space-y-5 shadow-2xl text-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">3D Gyroscope & Spirit Level</h3>
              <p className="text-[11px] text-slate-400">IMU / Accelerometer Sensor Diagnostic</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Browser Support Check Banner */}
        {!isSupported && (
          <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
            <span>⚠️ DeviceOrientation not available on this browser/OS. Using simulation data.</span>
          </div>
        )}

        {/* 3D Visualizer Card */}
        <div className="flex flex-col items-center justify-center py-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl relative overflow-hidden">
          <div
            style={{
              perspective: "600px",
            }}
            className="w-48 h-32 flex items-center justify-center"
          >
            <div
              style={{
                transform: `rotateX(${-currentPitch}deg) rotateY(${currentRoll}deg) rotateZ(${alpha}deg)`,
                transition: "transform 0.1s ease-out",
              }}
              className={`w-36 h-24 rounded-2xl border-2 flex flex-col items-center justify-center shadow-2xl transition-colors ${
                isLevel
                  ? "bg-emerald-950/80 border-emerald-400 shadow-emerald-500/20"
                  : "bg-slate-800/90 border-cyan-500/50 shadow-cyan-500/10"
              }`}
            >
              <Activity className={`h-6 w-6 ${isLevel ? "text-emerald-400 animate-pulse" : "text-cyan-400"}`} />
              <span className="text-[10px] font-mono font-bold mt-1">
                {isLevel ? "PERFECT 0° LEVEL" : `${Math.abs(currentPitch)}° / ${Math.abs(currentRoll)}°`}
              </span>
            </div>
          </div>

          {/* Level Crosshair Bubble */}
          <div className="mt-3 relative w-32 h-32 rounded-full border border-slate-700 bg-slate-950 flex items-center justify-center overflow-hidden">
            {/* Crosshairs */}
            <div className="absolute w-full h-[1px] bg-slate-800" />
            <div className="absolute h-full w-[1px] bg-slate-800" />
            <div className="absolute w-12 h-12 rounded-full border border-slate-700" />

            {/* Bubble */}
            <div
              style={{
                transform: `translate(${Math.max(-50, Math.min(50, currentRoll * 2))}px, ${Math.max(
                  -50,
                  Math.min(50, currentPitch * 2)
                )}px)`,
                transition: "transform 0.1s ease-out",
              }}
              className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-[9px] font-bold shadow-lg ${
                isLevel ? "bg-emerald-400 text-slate-950" : "bg-cyan-400 text-slate-950"
              }`}
            >
              {isLevel ? "✓" : "•"}
            </div>
          </div>
        </div>

        {/* Telemetry Metrics */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Pitch (Beta)</span>
            <span className="text-sm font-bold font-mono text-cyan-400">{currentPitch}°</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Roll (Gamma)</span>
            <span className="text-sm font-bold font-mono text-cyan-400">{currentRoll}°</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Heading (Alpha)</span>
            <span className="text-sm font-bold font-mono text-emerald-400">{alpha}°</span>
          </div>
        </div>

        {/* Calibration Actions */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleCalibrate}
            className="flex-1 py-2.5 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Calibrate Zero</span>
          </button>
          <button
            type="button"
            onClick={handleResetCalibration}
            className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
            title="Reset Calibration"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GyroCompassModal;
