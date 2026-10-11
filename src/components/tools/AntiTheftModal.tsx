import React, { useState, useEffect, useRef } from "react";
import {
  Shield,
  ShieldAlert,
  Zap,
  AlertTriangle,
  KeyRound,
  X,
  Check,
  Bell,
  Activity,
  Volume2,
  Lock,
  Unlock,
} from "lucide-react";
import { useHardwarePermissions } from "@/hooks/useHardwarePermissions";
import { PermissionSheet } from "@/components/common/PermissionSheet";
import { toast } from "sonner";

interface AntiTheftModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AntiTheftModal: React.FC<AntiTheftModalProps> = ({ isOpen, onClose }) => {
  const { isGranted, triggerVibration } = useHardwarePermissions();
  const [pin, setPin] = useState("1234");
  const [inputPin, setInputPin] = useState("");
  const [isArmed, setIsArmed] = useState(false);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [isTriggered, setIsTriggered] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [initialCharging, setInitialCharging] = useState<boolean | null>(null);
  const [permissionSheetOpen, setPermissionSheetOpen] = useState(false);
  const [strobeState, setStrobeState] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const sirenIntervalRef = useRef<number | null>(null);
  const strobeIntervalRef = useRef<number | null>(null);
  const motionLastRef = useRef<{ x: number; y: number; z: number } | null>(null);

  const startSirenSound = () => {
    if (typeof window === "undefined") return;
    try {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtxClass) return;

      const ctx = new AudioCtxClass();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.95, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      oscRef.current = osc;

      // High decibel ambulance/police emergency alternation
      let tone = 880;
      sirenIntervalRef.current = window.setInterval(() => {
        if (!oscRef.current || !audioCtxRef.current) return;
        tone = tone === 880 ? 1320 : 880;
        oscRef.current.frequency.setValueAtTime(tone, audioCtxRef.current.currentTime);
      }, 200);

      // Flash strobe screen
      strobeIntervalRef.current = window.setInterval(() => {
        setStrobeState((prev) => !prev);
        triggerVibration([100, 50, 100]);
      }, 150);
    } catch {
      // ignore
    }
  };

  const stopSirenSound = () => {
    if (sirenIntervalRef.current) clearInterval(sirenIntervalRef.current);
    if (strobeIntervalRef.current) clearInterval(strobeIntervalRef.current);
    try {
      if (oscRef.current) {
        oscRef.current.stop();
        oscRef.current.disconnect();
        oscRef.current = null;
      }
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
    } catch {
      // ignore
    }
    setStrobeState(false);
  };

  const triggerAlarm = () => {
    if (!isTriggered) {
      setIsTriggered(true);
      setInputPin("");
      startSirenSound();
    }
  };

  // Battery monitoring for charger disconnect
  useEffect(() => {
    if (!isArmed || isTriggered || typeof window === "undefined") return;

    let batteryInstance: any = null;
    const nav = navigator as any;

    if (nav.getBattery) {
      nav.getBattery().then((battery: any) => {
        batteryInstance = battery;
        setInitialCharging(battery.charging);

        const handleChargingChange = () => {
          if (!battery.charging) {
            triggerAlarm();
          }
        };

        battery.addEventListener("chargingchange", handleChargingChange);
        return () => {
          battery.removeEventListener("chargingchange", handleChargingChange);
        };
      }).catch(() => {});
    }

    return () => {
      if (batteryInstance) {
        batteryInstance.onchargingchange = null;
      }
    };
  }, [isArmed, isTriggered]);

  // Motion monitoring
  useEffect(() => {
    if (!isArmed || isTriggered || typeof window === "undefined") return;

    const handleMotion = (e: DeviceMotionEvent) => {
      const acc = e.accelerationIncludingGravity;
      if (!acc) return;

      const current = { x: acc.x || 0, y: acc.y || 0, z: acc.z || 0 };

      if (motionLastRef.current) {
        const deltaX = Math.abs(current.x - motionLastRef.current.x);
        const deltaY = Math.abs(current.y - motionLastRef.current.y);
        const deltaZ = Math.abs(current.z - motionLastRef.current.z);

        // Motion threshold for pickup detection
        if (deltaX > 2.5 || deltaY > 2.5 || deltaZ > 2.5) {
          triggerAlarm();
        }
      }

      motionLastRef.current = current;
    };

    window.addEventListener("devicemotion", handleMotion);
    return () => {
      window.removeEventListener("devicemotion", handleMotion);
    };
  }, [isArmed, isTriggered]);

  // Countdown timer when arming
  useEffect(() => {
    if (!isCountingDown) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsCountingDown(false);
          setIsArmed(true);
          triggerVibration([80, 50, 150]);
          return 5;
        }
        triggerVibration(40);
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isCountingDown, triggerVibration]);

  const handleArmRequest = () => {
    if (!isGranted("audio")) {
      setPermissionSheetOpen(true);
    } else {
      executeArm();
    }
  };

  const executeArm = () => {
    setIsCountingDown(true);
    setCountdown(5);
    motionLastRef.current = null;
    toast.success("Place phone on flat surface. Arming in 5s...");
  };

  const handleDisarm = () => {
    if (inputPin === pin) {
      stopSirenSound();
      setIsArmed(false);
      setIsTriggered(false);
      setInputPin("");
      setPinError(false);
      triggerVibration([100, 50, 100]);
      toast.success("Security System Disarmed");
    } else {
      setPinError(true);
      triggerVibration([150, 80, 150]);
      setTimeout(() => {
        setInputPin("");
        setPinError(false);
      }, 700);
    }
  };

  const handleNumClick = (digit: string) => {
    triggerVibration(25);
    if (inputPin.length < 4) {
      const next = inputPin + digit;
      setInputPin(next);
      if (next.length === 4) {
        if (isArmed || isTriggered) {
          if (next === pin) {
            stopSirenSound();
            setIsArmed(false);
            setIsTriggered(false);
            setInputPin("");
            triggerVibration([100, 50, 100]);
            toast.success("Alarm Disarmed Successfully");
          } else {
            setPinError(true);
            triggerVibration([200, 100, 200]);
            setTimeout(() => {
              setInputPin("");
              setPinError(false);
            }, 600);
          }
        }
      }
    }
  };

  const handleDelete = () => {
    triggerVibration(25);
    setInputPin((prev) => prev.slice(0, -1));
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md select-none transition-colors duration-150 ${
          isTriggered && strobeState ? "bg-rose-600/90" : "bg-black/90"
        }`}
      >
        <div
          className={`w-full max-w-sm rounded-3xl p-6 space-y-5 border shadow-2xl relative overflow-hidden transition-all ${
            isTriggered
              ? "bg-slate-950 border-rose-500 shadow-rose-500/50"
              : isArmed
              ? "bg-slate-950 border-emerald-500/50 shadow-emerald-500/20"
              : "bg-slate-950 border-slate-800"
          }`}
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`p-2 rounded-xl ${
                  isTriggered
                    ? "bg-rose-500/20 text-rose-400 animate-bounce"
                    : isArmed
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-cyan-500/20 text-cyan-400"
                }`}
              >
                {isTriggered ? (
                  <ShieldAlert className="h-5 w-5" />
                ) : (
                  <Shield className="h-5 w-5" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">
                  {isTriggered
                    ? "SECURITY BREACH DETECTED"
                    : isArmed
                    ? "SYSTEM ARMED & MONITORING"
                    : "Anti-Theft Motion & Unplug Alarm"}
                </h3>
                <span className="text-[10px] text-slate-400 font-mono block">
                  {isArmed ? "Sensors: Charger + Accelerometer" : "PIN: Default 1234"}
                </span>
              </div>
            </div>

            {!isArmed && !isTriggered && (
              <button
                type="button"
                onClick={() => {
                  stopSirenSound();
                  onClose();
                }}
                className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Center Graphic / Radar Scanner */}
          <div className="flex flex-col items-center justify-center py-4 bg-slate-900/60 rounded-2xl border border-slate-800/80 relative overflow-hidden">
            {isArmed ? (
              <div className="relative w-28 h-28 flex items-center justify-center">
                {/* Radar sweep ring */}
                <div className="absolute inset-0 rounded-full border border-emerald-500/30 animate-ping opacity-50" />
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-400/60 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                  <Lock className="h-8 w-8 text-emerald-400" />
                </div>
              </div>
            ) : isTriggered ? (
              <div className="relative w-28 h-28 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-rose-500 flex items-center justify-center animate-ping opacity-75 absolute" />
                <div className="w-20 h-20 rounded-full bg-rose-600 flex items-center justify-center z-10 shadow-lg">
                  <Volume2 className="h-10 w-10 text-white animate-pulse" />
                </div>
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
                <Unlock className="h-8 w-8" />
              </div>
            )}

            <div className="mt-3 text-center">
              <span
                className={`font-mono text-xs font-bold uppercase tracking-wider block ${
                  isTriggered
                    ? "text-rose-400 animate-pulse text-sm"
                    : isArmed
                    ? "text-emerald-400"
                    : "text-slate-400"
                }`}
              >
                {isTriggered
                  ? "EMERGENCY 100% SIREN ACTIVE"
                  : isCountingDown
                  ? `Arming in ${countdown}s...`
                  : isArmed
                  ? "Standby: Do not move phone"
                  : "Tap Arm to Lock Device"}
              </span>
            </div>
          </div>

          {/* PIN Display Dots */}
          <div className="flex items-center justify-center gap-3 py-1">
            {[0, 1, 2, 3].map((idx) => (
              <div
                key={idx}
                className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${
                  pinError
                    ? "border-rose-500 bg-rose-500 animate-shake"
                    : inputPin.length > idx
                    ? "border-cyan-400 bg-cyan-400 shadow-[0_0_8px_#22d3ee]"
                    : "border-slate-700 bg-slate-900"
                }`}
              />
            ))}
          </div>

          {/* 4-Digit PIN Keypad */}
          <div className="grid grid-cols-3 gap-2">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleNumClick(num)}
                className="py-3 rounded-xl bg-slate-900 hover:bg-slate-850 active:scale-90 text-white font-mono font-bold text-base border border-slate-800 transition-all text-center"
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              onClick={handleDelete}
              className="py-3 rounded-xl bg-slate-900/60 hover:bg-slate-800 active:scale-90 text-slate-400 font-bold text-xs border border-slate-800 transition-all"
            >
              DEL
            </button>
            <button
              type="button"
              onClick={() => handleNumClick("0")}
              className="py-3 rounded-xl bg-slate-900 hover:bg-slate-850 active:scale-90 text-white font-mono font-bold text-base border border-slate-800 transition-all text-center"
            >
              0
            </button>
            <button
              type="button"
              onClick={() => {
                if (isArmed || isTriggered) {
                  handleDisarm();
                } else if (inputPin.length === 4) {
                  setPin(inputPin);
                  setInputPin("");
                  toast.success(`PIN updated to ${inputPin}`);
                }
              }}
              className="py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 active:scale-90 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center"
            >
              <Check className="h-4 w-4" />
            </button>
          </div>

          {/* Arm Button */}
          {!isArmed && !isTriggered && (
            <button
              type="button"
              onClick={handleArmRequest}
              disabled={isCountingDown}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 active:scale-95 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {isCountingDown ? `Arming in ${countdown}s...` : "ARM ANTI-THEFT PROTECTION"}
            </button>
          )}
        </div>
      </div>

      <PermissionSheet
        isOpen={permissionSheetOpen}
        onClose={() => setPermissionSheetOpen(false)}
        onAllowed={() => {
          setPermissionSheetOpen(false);
          executeArm();
        }}
        requiredPermissions={["audio", "sensors"]}
        title="Anti-Theft Hardware Authorization"
        description="Super Telecom requires access to the device audio synthesizer for the loud siren and motion accelerometer to detect theft attempts."
      />
    </>
  );
};

export default AntiTheftModal;
