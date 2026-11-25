import React, { useState, useEffect } from "react";
import {
  BatteryCharging,
  Cpu,
  Gauge,
  X,
  RefreshCw,
  ShieldCheck,
  MessageCircle,
} from "lucide-react";
import { BUSINESS_MASTER } from "@/config/superTelecomConfig";

interface PowerTelemetryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PowerTelemetryModal: React.FC<PowerTelemetryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [batteryPct, setBatteryPct] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState<boolean | null>(null);
  const [batterySupported, setBatterySupported] = useState(false);
  const [fps, setFps] = useState<number>(60);
  const [cores, setCores] = useState<number>(8);

  const runReadout = () => {
    if (typeof window === "undefined") return;
    if (navigator.hardwareConcurrency) {
      setCores(navigator.hardwareConcurrency);
    }

    let frames = 0;
    const start = performance.now();
    const tick = (now: number) => {
      frames++;
      if (now - start < 400) {
        requestAnimationFrame(tick);
      } else {
        setFps(Math.min(144, Math.round((frames * 1000) / (now - start))));
      }
    };
    requestAnimationFrame(tick);

    const nav = navigator as any;
    if (nav.getBattery) {
      nav.getBattery()
        .then((b: any) => {
          setBatterySupported(true);
          setBatteryPct(Math.round(b.level * 100));
          setIsCharging(Boolean(b.charging));
        })
        .catch(() => setBatterySupported(false));
    }
  };

  useEffect(() => {
    if (isOpen) {
      runReadout();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Battery and System Telemetry"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-3xl border border-emerald-500/30 bg-slate-950 p-6 text-white shadow-2xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <BatteryCharging className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Battery, FPS &amp; System Telemetry</h3>
              <p className="text-xs text-slate-400">Live browser hardware APIs</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block font-mono uppercase text-[10px]">Battery</span>
            <strong className="text-lg font-mono text-emerald-400">
              {batterySupported && batteryPct !== null ? `${batteryPct}%` : "N/A"}
            </strong>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              {batterySupported ? (isCharging ? "Charging" : "Discharging") : "iOS/Restricted"}
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block font-mono uppercase text-[10px]">Refresh Rate</span>
            <strong className="text-lg font-mono text-cyan-400 flex items-center gap-1">
              <Gauge className="h-4 w-4" /> {fps} Hz
            </strong>
            <span className="text-[10px] text-slate-400 block mt-0.5">Measured FPS</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block font-mono uppercase text-[10px]">CPU Cores</span>
            <strong className="text-lg font-mono text-white flex items-center gap-1">
              <Cpu className="h-4 w-4 text-cyan-400" /> {cores}
            </strong>
            <span className="text-[10px] text-slate-400 block mt-0.5">Hardware Threads</span>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Experiencing battery drain, overheating, or slow charging? Visit our Barganda Road lab in Giridih for a free bench DC power-supply amp-draw diagnosis.
        </p>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={runReadout}
            className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5 text-cyan-400" /> Refresh
          </button>
          <a
            href={`https://wa.me/${BUSINESS_MASTER.whatsappNumber}?text=${encodeURIComponent(
              "Namaste Super Telecom Giridih, I want a free battery & charging IC bench test."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2"
          >
            <MessageCircle className="h-4 w-4" /> Book Free Bench Check
          </a>
        </div>

        <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
          <span>Browser-native API telemetry only — no elevated permissions requested.</span>
        </p>
      </div>
    </div>
  );
};

export default PowerTelemetryModal;
