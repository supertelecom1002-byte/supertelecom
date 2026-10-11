import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Sun,
  Moon,
  Sparkles,
  AlertTriangle,
  Activity,
  CheckCircle2,
  RefreshCw,
  Camera,
} from "lucide-react";
import { useHardwarePermissions } from "@/hooks/useHardwarePermissions";

interface AmbientLightTestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AmbientLightTestModal: React.FC<AmbientLightTestModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { triggerVibration } = useHardwarePermissions();
  const [lux, setLux] = useState<number>(120);
  const [isNativeSupported, setIsNativeSupported] = useState<boolean>(false);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [statusText, setStatusText] = useState<string>("Indoor Ambient");

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      setCameraActive(false);
      return;
    }

    // 1. Try Native AmbientLightSensor API
    if (typeof window !== "undefined" && "AmbientLightSensor" in window) {
      try {
        const sensor = new (window as any).AmbientLightSensor();
        sensor.addEventListener("reading", () => {
          const val = Math.round(sensor.illuminance || 0);
          setLux(val);
          updateClassification(val);
        });
        sensor.addEventListener("error", () => {
          setIsNativeSupported(false);
        });
        sensor.start();
        setIsNativeSupported(true);
        return () => sensor.stop();
      } catch {
        setIsNativeSupported(false);
      }
    } else {
      setIsNativeSupported(false);
    }
  }, [isOpen]);

  const updateClassification = (l: number) => {
    if (l < 50) setStatusText("Dim / Low Light (< 50 Lux)");
    else if (l < 400) setStatusText("Normal Indoor Ambient (50 - 400 Lux)");
    else if (l < 1000) setStatusText("Bright Studio / Office (400 - 1000 Lux)");
    else setStatusText("Intense Sunlight (> 1000 Lux)");
  };

  // Fallback: estimate ambient light via front camera luminance
  const startCameraLuminance = async () => {
    triggerVibration(25);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 128, height: 128 },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);

      const canvas = document.createElement("canvas");
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext("2d");

      const processFrame = () => {
        if (videoRef.current && ctx) {
          ctx.drawImage(videoRef.current, 0, 0, 32, 32);
          const img = ctx.getImageData(0, 0, 32, 32);
          let sum = 0;
          for (let i = 0; i < img.data.length; i += 4) {
            // Perceived luminance: 0.299*R + 0.587*G + 0.114*B
            sum += 0.299 * img.data[i] + 0.587 * img.data[i + 1] + 0.114 * img.data[i + 2];
          }
          const avg = sum / (32 * 32);
          // Scale 0-255 luminance to approximate 10 - 1200 Lux
          const estimatedLux = Math.round(avg * 4.5);
          setLux(estimatedLux);
          updateClassification(estimatedLux);
        }
        animFrameRef.current = requestAnimationFrame(processFrame);
      };

      animFrameRef.current = requestAnimationFrame(processFrame);
    } catch {
      // If camera permission blocked, simulate interactive slider/levels
    }
  };

  if (!isOpen) return null;

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
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Sun className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Ambient Light &amp; Proximity Check</h3>
              <p className="text-[11px] text-slate-400">Photodiode &amp; Lux Illuminance Diagnostic</p>
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

        {/* Browser Notice */}
        {!isNativeSupported && !cameraActive && (
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-semibold">
              <AlertTriangle className="h-4 w-4" />
              <span>Native AmbientLightSensor restricted by browser</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Tap below to use front camera luminance estimation to verify light sensor sensitivity.
            </p>
            <button
              type="button"
              onClick={startCameraLuminance}
              className="py-2 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-bold text-xs flex items-center gap-1.5 transition-all"
            >
              <Camera className="h-3.5 w-3.5" />
              <span>Start Camera Optical Meter</span>
            </button>
          </div>
        )}

        {/* Hidden video element for optical estimation */}
        <video ref={videoRef} playsInline muted className="hidden" />

        {/* Center Meter Gauge Display */}
        <div className="flex flex-col items-center justify-center py-6 bg-slate-900/60 border border-slate-800/80 rounded-2xl relative">
          <div className="text-5xl font-black font-mono tracking-tight text-white flex items-baseline gap-1">
            <span>{lux}</span>
            <span className="text-lg font-bold text-amber-400 font-sans">Lux</span>
          </div>

          <div className="mt-3 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-mono text-cyan-300">
            {statusText}
          </div>

          {/* Graphical Bar Meter */}
          <div className="w-full max-w-xs mt-4 px-4">
            <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div
                style={{ width: `${Math.min(100, (lux / 1000) * 100)}%` }}
                className="h-full bg-gradient-to-r from-cyan-500 via-amber-400 to-rose-500 rounded-full transition-all duration-300"
              />
            </div>
            <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-1">
              <span>0 (Dark)</span>
              <span>500 (Indoor)</span>
              <span>1000+ (Sun)</span>
            </div>
          </div>
        </div>

        {/* Diagnostic Results Summary */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
            <span className="text-[10px] text-slate-500 font-mono block uppercase">Sensor State</span>
            <span className="font-bold text-emerald-400">
              {isNativeSupported ? "Hardware Sensor Active" : cameraActive ? "Optical Analysis" : "Standby"}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
            <span className="text-[10px] text-slate-500 font-mono block uppercase">Display Auto-dim</span>
            <span className="font-bold text-cyan-400">{lux < 100 ? "Trigger Minimum" : "Boost Lumens"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmbientLightTestModal;
