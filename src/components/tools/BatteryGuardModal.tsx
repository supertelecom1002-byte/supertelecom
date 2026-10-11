import React, { useState, useEffect, useRef } from "react";
import { BatteryCharging, Battery, Zap, ShieldCheck, Bell, X, Sparkles, CheckCircle2 } from "lucide-react";

interface BatteryGuardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BatteryGuardModal: React.FC<BatteryGuardModalProps> = ({ isOpen, onClose }) => {
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState<boolean | null>(null);
  const [chargingTime, setChargingTime] = useState<number | null>(null);
  const [guardActive, setGuardActive] = useState<boolean>(true);
  const [alarmTriggered, setAlarmTriggered] = useState<boolean>(false);
  const [isSupported, setIsSupported] = useState<boolean>(true);

  const audioCtxRef = useRef<AudioContext | null>(null);

  const playChime = () => {
    if (typeof window === "undefined") return;
    try {
      const AudioCtxClass =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtxClass) return;

      const ctx = new AudioCtxClass();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5

      gain.gain.setValueAtTime(0.7, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const nav = navigator as any;

    if (!nav.getBattery) {
      setIsSupported(false);
      // Fallback simulated level for testing/iOS
      setBatteryLevel(82);
      setIsCharging(true);
      return;
    }

    let batteryInstance: any = null;

    nav.getBattery().then((battery: any) => {
      batteryInstance = battery;
      setIsSupported(true);
      setBatteryLevel(Math.round(battery.level * 100));
      setIsCharging(battery.charging);
      setChargingTime(battery.chargingTime);

      const updateAll = () => {
        const lvl = Math.round(battery.level * 100);
        setBatteryLevel(lvl);
        setIsCharging(battery.charging);
        setChargingTime(battery.chargingTime);

        // Check 85% limit
        if (guardActive && battery.charging && lvl >= 85) {
          setAlarmTriggered(true);
          playChime();
        }
      };

      battery.addEventListener("levelchange", updateAll);
      battery.addEventListener("chargingchange", updateAll);
    }).catch(() => {
      setIsSupported(false);
    });

    return () => {
      // cleanup
    };
  }, [guardActive]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-6 shadow-2xl relative text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <BatteryCharging className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Smart Battery Guard (85%)</h3>
              <p className="text-xs text-slate-400">Lithium-Ion Chemical Wear Prevention</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Live Battery Gauge */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center font-mono text-xl font-black ${
                  (batteryLevel ?? 0) >= 80
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                    : (batteryLevel ?? 0) >= 40
                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
                    : "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                }`}
              >
                {batteryLevel !== null ? `${batteryLevel}%` : "—"}
              </div>
              {isCharging && (
                <div className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-emerald-500 text-slate-950">
                  <Zap className="h-3 w-3 fill-slate-950" />
                </div>
              )}
            </div>

            <div>
              <div className="font-bold text-sm text-white">
                {isCharging ? "Charging Rapidly" : "Discharging on Battery"}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {isSupported ? "Real Hardware Live Telemetry" : "Simulated Diagnostic Mode"}
              </p>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase ${
              isCharging
                ? "bg-emerald-950/80 text-emerald-400 border border-emerald-500/30"
                : "bg-slate-800 text-slate-400"
            }`}
          >
            {isCharging ? "AC Connected" : "Battery Mode"}
          </span>
        </div>

        {/* Alarm Banner if 85% reached */}
        {alarmTriggered && (
          <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 text-xs flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              <span>Target 85% reached! Unplug charger to preserve cell lifespan.</span>
            </div>
            <button
              type="button"
              onClick={() => setAlarmTriggered(false)}
              className="text-[10px] font-bold underline ml-2"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* 85% Protector Switch */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="font-bold text-xs text-white flex items-center gap-1.5">
              <Bell className="h-3.5 w-3.5 text-cyan-400" />
              <span>85% Overcharge Warning Chime</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 max-w-[240px] leading-relaxed">
              Alerts you immediately when charging crosses 85% to avoid cathode degradation.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setGuardActive(!guardActive);
              if (!guardActive) playChime();
            }}
            className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 ${
              guardActive ? "bg-cyan-500" : "bg-slate-800"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                guardActive ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Educational Lab Tip */}
        <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400 space-y-1">
          <div className="flex items-center gap-1.5 text-cyan-300 font-semibold text-[11px]">
            <Sparkles className="h-3 w-3" /> Super Telecom Lab Advice:
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Keeping your battery between 20% and 80% doubles total charge cycles from 500 to 1,200+ cycles, avoiding premature battery swelling and health drops.
          </p>
        </div>

        <button
          type="button"
          onClick={playChime}
          className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-cyan-300 font-semibold text-xs border border-cyan-500/20 active:scale-95 transition-all"
        >
          Test Notification Chime
        </button>
      </div>
    </div>
  );
};

export default BatteryGuardModal;
