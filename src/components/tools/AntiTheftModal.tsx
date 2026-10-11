import React, { useState, useEffect, useRef } from "react";
import { Shield, ShieldAlert, Zap, AlertTriangle, KeyRound, X, Check, Bell } from "lucide-react";

interface AntiTheftModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AntiTheftModal: React.FC<AntiTheftModalProps> = ({ isOpen, onClose }) => {
  const [pin, setPin] = useState("1234");
  const [inputPin, setInputPin] = useState("");
  const [isArmed, setIsArmed] = useState(false);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [isTriggered, setIsTriggered] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [initialCharging, setInitialCharging] = useState<boolean | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const sirenIntervalRef = useRef<number | null>(null);
  const motionLastRef = useRef<{ x: number; y: number; z: number } | null>(null);

  const startSirenSound = () => {
    if (typeof window === "undefined") return;
    try {
      const AudioCtxClass =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtxClass) return;

      const ctx = new AudioCtxClass();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.85, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      oscRef.current = osc;

      // Alternating police/ambulance emergency siren modulation
      let tone = 880;
      sirenIntervalRef.current = window.setInterval(() => {
        if (!oscRef.current || !audioCtxRef.current) return;
        tone = tone === 880 ? 1320 : 880;
        oscRef.current.frequency.setValueAtTime(tone, audioCtxRef.current.currentTime);
      }, 250);
    } catch {
      // ignore
    }
  };

  const stopSirenSound = () => {
    if (sirenIntervalRef.current) clearInterval(sirenIntervalRef.current);
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
      }).catch(() => {});
    }

    // Motion detection listener
    const handleMotion = (e: DeviceMotionEvent) => {
      if (!isArmed || isTriggered) return;
      const acc = e.accelerationIncludingGravity;
      if (!acc || acc.x === null || acc.y === null || acc.z === null) return;

      if (!motionLastRef.current) {
        motionLastRef.current = { x: acc.x, y: acc.y, z: acc.z };
        return;
      }

      const dx = Math.abs(acc.x - motionLastRef.current.x);
      const dy = Math.abs(acc.y - motionLastRef.current.y);
      const dz = Math.abs(acc.z - motionLastRef.current.z);

      // Motion threshold of sudden movement
      if (dx + dy + dz > 6.5) {
        triggerAlarm();
      }
      motionLastRef.current = { x: acc.x, y: acc.y, z: acc.z };
    };

    window.addEventListener("devicemotion", handleMotion);

    return () => {
      window.removeEventListener("devicemotion", handleMotion);
      if (batteryInstance) {
        batteryInstance.removeEventListener("chargingchange", triggerAlarm);
      }
    };
  }, [isArmed, isTriggered]);

  const handleArm = () => {
    setIsCountingDown(true);
    setCountdown(5);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsCountingDown(false);
          setIsArmed(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleDisarm = () => {
    if (inputPin === pin) {
      stopSirenSound();
      setIsArmed(false);
      setIsTriggered(false);
      setInputPin("");
      setPinError(false);
    } else {
      setPinError(true);
      setInputPin("");
      setTimeout(() => setPinError(false), 1200);
    }
  };

  const handleKeyPress = (num: string) => {
    if (inputPin.length < 4) {
      const next = inputPin + num;
      setInputPin(next);
      if (next.length === 4) {
        if (next === pin) {
          stopSirenSound();
          setIsArmed(false);
          setIsTriggered(false);
          setInputPin("");
        } else {
          setPinError(true);
          setTimeout(() => {
            setInputPin("");
            setPinError(false);
          }, 800);
        }
      }
    }
  };

  useEffect(() => {
    return () => {
      stopSirenSound();
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in select-none ${
        isTriggered ? "bg-red-600 animate-pulse" : "bg-black/85"
      }`}
    >
      <div
        className="w-full max-w-sm bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl relative text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2.5 rounded-2xl ${
                isTriggered
                  ? "bg-red-500 text-white animate-bounce"
                  : isArmed
                  ? "bg-amber-500/20 text-amber-400"
                  : "bg-cyan-500/10 text-cyan-400"
              }`}
            >
              {isTriggered ? (
                <ShieldAlert className="h-6 w-6" />
              ) : isArmed ? (
                <AlertTriangle className="h-6 w-6 animate-pulse" />
              ) : (
                <Shield className="h-6 w-6" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Anti-Theft Unplug Siren</h3>
              <p className="text-[11px] text-slate-400">Hardware Motion &amp; Charger Guard</p>
            </div>
          </div>

          {!isArmed && !isCountingDown && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* State 1: Triggered Alarm & Pin Keypad */}
        {isTriggered ? (
          <div className="space-y-4 text-center">
            <div className="p-3 bg-red-950/80 border border-red-500 rounded-2xl text-red-200">
              <div className="font-mono text-xl font-black uppercase tracking-wider text-red-400">
                THEFT ALARM TRIGGERED!
              </div>
              <p className="text-xs text-red-300 mt-1">
                Charger removed or unauthorized movement detected. Enter PIN to disarm.
              </p>
            </div>

            {/* PIN Dots */}
            <div className="flex justify-center gap-3 my-4">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full border-2 transition-all ${
                    inputPin.length > i
                      ? pinError
                        ? "bg-red-500 border-red-400 scale-110"
                        : "bg-cyan-400 border-cyan-300 scale-110 shadow-[0_0_10px_#22d3ee]"
                      : "bg-slate-900 border-slate-700"
                  }`}
                />
              ))}
            </div>

            {pinError && <p className="text-xs text-red-400 font-bold">Incorrect PIN! Alarm Continuing...</p>}

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "OK"].map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    if (key === "C") setInputPin("");
                    else if (key === "OK") handleDisarm();
                    else handleKeyPress(key);
                  }}
                  className="py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 active:bg-cyan-600 active:scale-95 text-lg font-mono font-bold text-white border border-slate-800 shadow-md transition-all"
                >
                  {key}
                </button>
              ))}
            </div>
          </div>
        ) : isCountingDown ? (
          /* State 2: 5-Second Arming Countdown */
          <div className="py-8 flex flex-col items-center justify-center space-y-3 text-center">
            <div className="w-20 h-20 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin flex items-center justify-center">
              <span className="font-mono text-3xl font-black text-cyan-400">{countdown}</span>
            </div>
            <h4 className="font-bold text-base text-white">Arming Protection...</h4>
            <p className="text-xs text-slate-400 max-w-xs">
              Plug in your phone now and place it on a stable surface.
            </p>
          </div>
        ) : isArmed ? (
          /* State 3: Actively Armed Screen */
          <div className="space-y-5 text-center py-4">
            <div className="w-20 h-20 rounded-full bg-emerald-950/60 border-2 border-emerald-500/80 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(16,185,129,0.4)]">
              <Shield className="h-10 w-10 text-emerald-400 animate-pulse" />
            </div>

            <div>
              <div className="font-mono text-lg font-black text-emerald-400 uppercase tracking-wide">
                SYSTEM ARMED
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Any movement or charger disconnection will immediately sound the siren.
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={triggerAlarm}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-red-500/30 hover:border-red-500 text-red-400 text-xs font-semibold"
              >
                Simulate Test Trigger
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsArmed(false);
                  stopSirenSound();
                }}
                className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-bold text-xs"
              >
                Disarm System
              </button>
            </div>
          </div>
        ) : (
          /* State 4: Setup / Arm Configuration */
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-2">
              <div className="flex items-center gap-2 text-cyan-300 font-bold">
                <Zap className="h-4 w-4 text-cyan-400" /> How It Works:
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Connect your phone to any charger in public places (airports, cafes, trains).
                If someone unplugs your cable or picks up your phone, an intense loud siren rings until your PIN is entered.
              </p>
            </div>

            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">
                Security Disarm PIN (Default: 1234)
              </label>
              <input
                type="text"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center font-mono text-lg font-bold text-cyan-400 tracking-widest focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              type="button"
              onClick={handleArm}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-95 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all"
            >
              <Shield className="h-4 w-4" />
              <span>Arm Anti-Theft Protection</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AntiTheftModal;
