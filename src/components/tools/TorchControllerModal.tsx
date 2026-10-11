import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Flashlight,
  FlashlightOff,
  Radio,
  Zap,
  Sparkles,
  AlertTriangle,
  Sun,
  ShieldCheck,
} from "lucide-react";
import { useHardwarePermissions } from "@/hooks/useHardwarePermissions";
import { toast } from "sonner";

interface TorchControllerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TorchMode = "off" | "steady" | "strobe" | "sos";

export const TorchControllerModal: React.FC<TorchControllerModalProps> = ({ isOpen, onClose }) => {
  const { triggerVibration } = useHardwarePermissions();
  const [mode, setMode] = useState<TorchMode>("off");
  const [screenTorchActive, setScreenTorchActive] = useState<boolean>(false);
  const [hasHardwareTorch, setHasHardwareTorch] = useState<boolean | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const trackRef = useRef<MediaStreamTrack | null>(null);
  const intervalRef = useRef<number | null>(null);

  // Stop everything
  const stopTorch = async () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    try {
      if (trackRef.current) {
        await (trackRef.current as any).applyConstraints({
          advanced: [{ torch: false }],
        });
        trackRef.current.stop();
        trackRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    } catch {}

    setMode("off");
    setScreenTorchActive(false);
  };

  useEffect(() => {
    if (!isOpen) {
      stopTorch();
    }
  }, [isOpen]);

  // Apply torch state to camera track
  const applyHardwareTorchState = async (torchOn: boolean) => {
    try {
      if (trackRef.current) {
        await (trackRef.current as any).applyConstraints({
          advanced: [{ torch: torchOn }],
        });
        return true;
      }
    } catch {
      return false;
    }
    return false;
  };

  const initCameraTrack = async (): Promise<boolean> => {
    if (trackRef.current) return true;
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setHasHardwareTorch(false);
      return false;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      const track = stream.getVideoTracks()[0];
      if (!track) return false;

      const capabilities = (track as any).getCapabilities?.() || {};
      if ("torch" in capabilities) {
        trackRef.current = track;
        setHasHardwareTorch(true);
        return true;
      } else {
        // Track doesn't support torch, fallback to screen torch
        track.stop();
        setHasHardwareTorch(false);
        return false;
      }
    } catch (err) {
      setHasHardwareTorch(false);
      return false;
    }
  };

  const handleSetMode = async (newMode: TorchMode) => {
    triggerVibration(25);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (newMode === "off") {
      await stopTorch();
      return;
    }

    const hasTorch = await initCameraTrack();

    if (hasTorch && trackRef.current) {
      // Hardware LED Torch
      if (newMode === "steady") {
        await applyHardwareTorchState(true);
        setMode("steady");
      } else if (newMode === "strobe") {
        setMode("strobe");
        let isOn = true;
        intervalRef.current = window.setInterval(async () => {
          isOn = !isOn;
          await applyHardwareTorchState(isOn);
        }, 100); // 10Hz
      } else if (newMode === "sos") {
        setMode("sos");
        // SOS: 3 short, 3 long, 3 short
        const pattern = [200, 200, 200, 200, 200, 400, 600, 200, 600, 200, 600, 400, 200, 200, 200, 200, 200, 1000];
        let step = 0;
        let isLightOn = true;
        await applyHardwareTorchState(true);
        intervalRef.current = window.setInterval(async () => {
          isLightOn = !isLightOn;
          await applyHardwareTorchState(isLightOn);
          step = (step + 1) % pattern.length;
        }, 250);
      }
    } else {
      // Fallback: Screen Torch
      setMode(newMode);
      setScreenTorchActive(true);
      if (newMode === "strobe") {
        let strobeOn = true;
        intervalRef.current = window.setInterval(() => {
          strobeOn = !strobeOn;
          setScreenTorchActive(strobeOn);
        }, 100);
      } else if (newMode === "sos") {
        let sosOn = true;
        intervalRef.current = window.setInterval(() => {
          sosOn = !sosOn;
          setScreenTorchActive(sosOn);
        }, 300);
      }
    }
  };

  if (!isOpen) return null;

  // Full-screen flashlight overlay when screen torch is active
  if (screenTorchActive && mode === "steady") {
    return (
      <div
        onClick={() => handleSetMode("off")}
        className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-between p-6 select-none cursor-pointer"
        role="dialog"
      >
        <div className="text-slate-900 font-bold text-xs font-mono uppercase bg-slate-200/80 px-3 py-1.5 rounded-full">
          Screen Maximum Torch Active
        </div>
        <div className="text-center text-slate-800">
          <Sun className="h-16 w-16 mx-auto animate-spin" />
          <p className="mt-2 font-bold text-sm">Tap anywhere to turn off</p>
        </div>
        <button
          type="button"
          onClick={() => handleSetMode("off")}
          className="px-6 py-3 rounded-full bg-slate-950 text-white font-bold text-sm shadow-xl"
        >
          Close Torch
        </button>
      </div>
    );
  }

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
              <Flashlight className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Camera Torch &amp; Strobe Signal</h3>
              <p className="text-[11px] text-slate-400">Rear LED Driver &amp; Screen Beacon</p>
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

        {/* Status / Fallback Notice */}
        {hasHardwareTorch === false && (
          <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
            <span>Rear LED restricted by browser. Using high-luminance screen torch fallback.</span>
          </div>
        )}

        {/* Center Icon Indicator */}
        <div className="flex flex-col items-center justify-center py-6 bg-slate-900/60 border border-slate-800/80 rounded-2xl relative">
          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
              mode !== "off"
                ? "bg-amber-500/20 border-amber-400 text-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.4)] animate-pulse"
                : "bg-slate-800/60 border-slate-700 text-slate-500"
            }`}
          >
            {mode !== "off" ? (
              <Flashlight className="h-10 w-10 text-amber-400" />
            ) : (
              <FlashlightOff className="h-10 w-10 text-slate-500" />
            )}
          </div>
          <span className="text-xs font-mono font-bold mt-3 uppercase tracking-wider text-slate-300">
            {mode === "off" && "Torch Off"}
            {mode === "steady" && "Steady Torch Beam"}
            {mode === "strobe" && "Fast 10Hz Strobe Pulse"}
            {mode === "sos" && "Emergency SOS Beacon"}
          </span>
        </div>

        {/* Mode Selector Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleSetMode(mode === "steady" ? "off" : "steady")}
            className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
              mode === "steady"
                ? "bg-amber-500/20 border-amber-500 text-amber-300 shadow-md"
                : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
            }`}
          >
            <Sun className="h-4 w-4 text-amber-400" />
            <span>Steady</span>
          </button>

          <button
            type="button"
            onClick={() => handleSetMode(mode === "strobe" ? "off" : "strobe")}
            className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
              mode === "strobe"
                ? "bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-md"
                : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
            }`}
          >
            <Zap className="h-4 w-4 text-cyan-400" />
            <span>10Hz Strobe</span>
          </button>

          <button
            type="button"
            onClick={() => handleSetMode(mode === "sos" ? "off" : "sos")}
            className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
              mode === "sos"
                ? "bg-rose-500/20 border-rose-500 text-rose-300 shadow-md"
                : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
            }`}
          >
            <Radio className="h-4 w-4 text-rose-400" />
            <span>SOS Morse</span>
          </button>
        </div>

        {/* Master Power Off */}
        {mode !== "off" && (
          <button
            type="button"
            onClick={() => handleSetMode("off")}
            className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
          >
            <FlashlightOff className="h-4 w-4" />
            <span>Turn Off Torch</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default TorchControllerModal;
