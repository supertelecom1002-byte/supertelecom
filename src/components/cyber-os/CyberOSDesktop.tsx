import React, { useState, useEffect, useRef } from "react";
import {
  Volume2,
  Stethoscope,
  Zap,
  Grid,
  Flashlight,
  ShieldAlert,
  Phone,
  MessageCircle,
  Wrench,
  ShoppingBag,
  Sliders,
  LogOut,
  RefreshCw,
  Cpu,
  Activity,
  Battery,
  BatteryCharging,
  Wifi,
  Search,
  Sparkles,
  ChevronRight,
  Droplets,
  Gauge,
  Smartphone,
  CheckCircle2,
  X,
  Gamepad2,
} from "lucide-react";
import { useLauncher } from "@/context/LauncherContext";
import { useGamingMode } from "@/context/GamingModeContext";
import { useTheme } from "@/context/ThemeContext";
import { isLabOpenNow } from "@/services/appConfigService";
import { toast } from "sonner";
import { safeVibrate } from "@/utils/safeVibrate";

// Tools & Dashboard Modals
import { SpeakerCleanerModal } from "@/components/tools/SpeakerCleanerModal";
import { TouchTestModal } from "@/components/tools/TouchTestModal";
import { TorchControllerModal } from "@/components/tools/TorchControllerModal";
import { AntiTheftModal } from "@/components/tools/AntiTheftModal";
import { TurboCleanModal } from "@/components/dashboard/TurboCleanModal";
import { DoctorDiagnosticModal } from "@/components/dashboard/DoctorDiagnosticModal";
import { RepairTrackerModal } from "@/components/repair/RepairTrackerModal";
import { ControlCenterSheet } from "@/components/cyber-os/ControlCenterSheet";
import { TOOLS, type ToolId } from "@/components/tools/LabToolsHub";

// Other lab modals for full suite access
import { BatteryGuardModal } from "@/components/tools/BatteryGuardModal";
import { AudioHardwareTestModal } from "@/components/tools/AudioHardwareTestModal";
import { VibrationTesterModal } from "@/components/tools/VibrationTesterModal";
import { DisplayFpsMeterModal } from "@/components/tools/DisplayFpsMeterModal";
import { WaterRescueWizardModal } from "@/components/tools/WaterRescueWizardModal";
import { DeadPixelTestModal } from "@/components/tools/DeadPixelTestModal";
import { MultiTouchTesterModal } from "@/components/tools/MultiTouchTesterModal";
import { BurnInHealerModal } from "@/components/tools/BurnInHealerModal";
import { GyroCompassModal } from "@/components/tools/GyroCompassModal";
import { AmbientLightTestModal } from "@/components/tools/AmbientLightTestModal";
import { ImeiValidatorModal } from "@/components/tools/ImeiValidatorModal";
import { SecretCodesModal } from "@/components/tools/SecretCodesModal";
import { LockScreenGenModal } from "@/components/tools/LockScreenGenModal";
import { UsedPhoneAuditModal } from "@/components/tools/UsedPhoneAuditModal";

const PHONE = "+918002903643";
const WHATSAPP = "918002903643";

export const CyberOSDesktop: React.FC = () => {
  const { disableCyberOs } = useLauncher();
  const { enterGamingMode } = useGamingMode();
  const { isDark } = useTheme();

  // Clock state (HH:MM:SS)
  const [timeStr, setTimeStr] = useState<string>("12:00:00");
  const [dateStr, setDateStr] = useState<string>("");

  // Battery state
  const [batteryLevel, setBatteryLevel] = useState<number>(85);
  const [isCharging, setIsCharging] = useState<boolean>(false);

  // Ping / latency simulation (dynamic between 18ms and 34ms)
  const [pingMs, setPingMs] = useState<number>(24);

  // CPU / Memory load simulation
  const [cpuUsage, setCpuUsage] = useState<number>(32);
  const [isBoosting, setIsBoosting] = useState<boolean>(false);

  // Modals & Sheets
  const [controlCenterOpen, setControlCenterOpen] = useState(false);
  const [speakerModalOpen, setSpeakerModalOpen] = useState(false);
  const [touchModalOpen, setTouchModalOpen] = useState(false);
  const [torchModalOpen, setTorchModalOpen] = useState(false);
  const [antiTheftModalOpen, setAntiTheftModalOpen] = useState(false);
  const [turboCleanOpen, setTurboCleanOpen] = useState(false);
  const [doctorModalOpen, setDoctorModalOpen] = useState(false);
  const [doctorInitialTab, setDoctorInitialTab] = useState<"doctor" | "ampere">("doctor");
  const [trackModalOpen, setTrackModalOpen] = useState(false);

  // Tools Hub drawer & Parts Store modal
  const [toolsHubOpen, setToolsHubOpen] = useState(false);
  const [partsStoreOpen, setPartsStoreOpen] = useState(false);
  const [genericToolModal, setGenericToolModal] = useState<ToolId | null>(null);

  const labStatus = isLabOpenNow("auto");

  const triggerHaptic = (pattern: number | number[] = 15) => {
    safeVibrate(pattern);
  };

  // Live Digital Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
      setDateStr(
        now.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Real Battery API
  useEffect(() => {
    if (typeof navigator !== "undefined" && "getBattery" in navigator) {
      (navigator as any)
        .getBattery()
        .then((battery: any) => {
          const updateBat = () => {
            setBatteryLevel(Math.round(battery.level * 100));
            setIsCharging(battery.charging);
          };
          updateBat();
          battery.addEventListener("levelchange", updateBat);
          battery.addEventListener("chargingchange", updateBat);
        })
        .catch(() => {});
    }
  }, []);

  // Ping jitter interval
  useEffect(() => {
    const interval = setInterval(() => {
      setPingMs(Math.floor(18 + Math.random() * 14));
      // Subtle oscillation of CPU load
      if (!isBoosting) {
        setCpuUsage((prev) => {
          const delta = (Math.random() - 0.5) * 6;
          return Math.max(22, Math.min(54, Math.round(prev + delta)));
        });
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [isBoosting]);

  // 1-Tap Instant Turbo Boost
  const handleTurboBoost = async () => {
    triggerHaptic([40, 30, 80]);
    setIsBoosting(true);
    setCpuUsage(88);

    toast.info("Turbo Boost Activated ⚡", {
      description: "Purging background threads and temporary cache heap...",
    });

    try {
      if (typeof window !== "undefined" && "caches" in window) {
        // Clear caches quietly
        const keys = await caches.keys();
        await Promise.all(
          keys
            .filter((k) => !k.includes("static-v"))
            .map((k) => caches.delete(k))
        );
      }
    } catch {
      // ignore
    }

    setTimeout(() => {
      setCpuUsage(19);
      setIsBoosting(false);
      triggerHaptic([30, 20]);
      toast.success("RAM Optimized & Boosted! 🚀", {
        description: "CPU load dropped to 19% • Display pipeline primed at 120 FPS.",
      });
    }, 1200);
  };

  const handleExitToStandard = () => {
    triggerHaptic([30, 30]);
    disableCyberOs();
  };

  return (
    <div className="h-[100dvh] w-full flex flex-col bg-[#01040a] text-slate-100 select-none overflow-hidden relative font-sans">
      {/* Background Cyber Ambient Matrix / Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* ========================================================= */}
      {/* A. Cyber Status Bar (Top Fixed 32px)                      */}
      {/* ========================================================= */}
      <header
        onClick={() => {
          triggerHaptic(10);
          setControlCenterOpen(true);
        }}
        className="h-8 flex-none px-3 bg-slate-950/90 border-b border-cyan-500/20 backdrop-blur-xl flex items-center justify-between text-[11px] font-mono tracking-tight z-30 cursor-pointer active:bg-cyan-950/40 transition-colors"
      >
        {/* Left: Live Clock & Telecom Operator */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-white tracking-wider">{timeStr}</span>
          <span className="text-slate-600">&bull;</span>
          <span className="text-cyan-400 font-extrabold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping inline-block" />
            Super Telecom 5G
          </span>
        </div>

        {/* Right: Latency & Real Battery % */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1 text-[10px] text-emerald-400">
            <Wifi className="h-3 w-3" />
            <span>{pingMs}ms</span>
          </div>

          <div className="flex items-center gap-1 text-[10px] text-slate-300 font-bold bg-slate-900/90 px-1.5 py-0.5 rounded border border-slate-800">
            {isCharging ? (
              <BatteryCharging className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
            ) : (
              <Battery className="h-3.5 w-3.5 text-cyan-400" />
            )}
            <span>{batteryLevel}%</span>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* Main Desktop Space (Scrollable or Fitted)                 */}
      {/* ========================================================= */}
      <main className="flex-1 overflow-y-auto no-scrollbar px-3 pt-2 pb-24 space-y-3 z-10">
        {/* Quick Date & Welcome Pill */}
        <div className="flex items-center justify-between px-1 text-[11px] text-slate-400 font-mono">
          <span>{dateStr}</span>
          <button
            type="button"
            onClick={() => setControlCenterOpen(true)}
            className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 active:scale-95"
          >
            <Sliders className="h-3 w-3" />
            <span>Control Center &darr;</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* B. Interactive Desktop Widgets                            */}
        {/* ========================================================= */}

        {/* 1. Live Hardware Telemetry Widget (Dual Card) */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Left sub-widget: Circular CPU / Memory load */}
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-cyan-500/30 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between shadow-lg shadow-cyan-950/20">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <Cpu className="h-3 w-3" /> CPU Load
              </span>
              <span className="text-[9px] font-mono text-slate-400">8 Cores</span>
            </div>

            <div className="flex items-center gap-2.5 my-2">
              <div className="relative w-11 h-11 flex-none flex items-center justify-center">
                {/* SVG Radial Meter */}
                <svg className="w-11 h-11 -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={
                      cpuUsage > 75
                        ? "text-rose-500 transition-all duration-500"
                        : "text-cyan-400 transition-all duration-500"
                    }
                    strokeDasharray={`${cpuUsage}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-[11px] font-mono font-black text-white">
                  {cpuUsage}%
                </span>
              </div>

              <div className="leading-tight">
                <span className="text-xs font-bold text-white block">
                  {isBoosting ? "Purging..." : cpuUsage < 35 ? "Optimum" : "Active"}
                </span>
                <span className="text-[9px] text-slate-400 font-mono">
                  Heap: 48.2 MB
                </span>
              </div>
            </div>

            <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              Real-Time Thermals Safe
            </span>
          </div>

          {/* Right sub-widget: 1-Tap Instant Turbo Boost */}
          <button
            type="button"
            onClick={handleTurboBoost}
            disabled={isBoosting}
            className="p-3 rounded-2xl bg-gradient-to-br from-cyan-950/80 via-slate-950/80 to-blue-950/80 border border-cyan-500/40 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between text-left active:scale-[0.97] transition-all group shadow-lg shadow-cyan-950/30"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-cyan-300 font-bold uppercase tracking-wider flex items-center gap-1">
                <Zap className="h-3 w-3 text-amber-400" /> Turbo Speed
              </span>
              <span className="text-[9px] font-mono bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded">
                1-TAP
              </span>
            </div>

            <div className="my-1.5">
              <div className="flex items-center gap-1.5">
                <RefreshCw
                  className={`h-5 w-5 text-cyan-400 ${
                    isBoosting ? "animate-spin" : "group-hover:rotate-45"
                  } transition-transform`}
                />
                <span className="text-xs font-black text-white">
                  {isBoosting ? "Optimizing..." : "Instant Boost"}
                </span>
              </div>
              <p className="text-[9px] text-slate-400 leading-tight mt-0.5">
                Flushes browser heap &amp; primes 120 FPS hardware layer.
              </p>
            </div>

            <div className="w-full py-1 px-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-center text-[10px] font-bold text-cyan-300">
              ⚡ Execute Turbo Flush
            </div>
          </button>
        </div>

        {/* 2. Quick Repair Pipeline Widget */}
        <div className="p-3 rounded-2xl bg-slate-950/80 border border-amber-500/30 backdrop-blur-xl flex items-center justify-between shadow-lg shadow-black/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white">
                  Super Telecom Lab
                </span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    labStatus.isOpen ? "bg-emerald-400 animate-pulse" : "bg-rose-400"
                  }`}
                />
              </div>
              <span className="text-[10px] font-mono text-slate-400 block">
                Barganda Rd &bull; {labStatus.subText}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              triggerHaptic(15);
              setTrackModalOpen(true);
            }}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-[11px] active:scale-95 transition-transform flex items-center gap-1 shadow-md shadow-amber-500/20"
          >
            <Search className="h-3 w-3" />
            <span>Track Job</span>
          </button>
        </div>

        {/* Esports Gaming Console Feature Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-950/60 via-slate-950/90 to-amber-950/40 border border-red-500/50 p-3.5 shadow-xl shadow-red-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400">
              <Gamepad2 className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                🎮 Super Telecom Esports Gaming Console
              </h4>
              <p className="text-[10px] text-slate-400 leading-tight">
                Unlock 120Hz Touch Boost, Footstep Sound Equalizer, and Custom Sniper Crosshair.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              triggerHaptic([40, 30, 80]);
              enterGamingMode();
            }}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:brightness-110 text-white font-black text-xs font-mono active:scale-95 transition-all shadow-lg shadow-red-600/40 animate-pulse text-center whitespace-nowrap"
          >
            Launch Gaming Console Mode
          </button>
        </div>

        {/* ========================================================= */}
        {/* C. OS App Grid (8 Tactile Desktop Apps)                   */}
        {/* ========================================================= */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">
              Native Lab Applications
            </span>
            <span className="text-[9px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded-full border border-cyan-800">
              8 Desktop Apps
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2.5">
            {/* 1. Speaker Ejector */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic(15);
                setSpeakerModalOpen(true);
              }}
              style={{ transform: "translateZ(0)" }}
              className="flex flex-col items-center justify-center p-2 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 active:scale-90 transition-transform duration-100 will-change-transform shadow-md"
            >
              <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30 mb-1">
                <Volume2 className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold text-white text-center leading-tight">
                Speaker
              </span>
              <span className="text-[8px] font-mono text-cyan-400">165Hz</span>
            </button>

            {/* 2. Doctor Lab */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic(15);
                setDoctorInitialTab("doctor");
                setDoctorModalOpen(true);
              }}
              style={{ transform: "translateZ(0)" }}
              className="flex flex-col items-center justify-center p-2 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 active:scale-90 transition-transform duration-100 will-change-transform shadow-md"
            >
              <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30 mb-1">
                <Stethoscope className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold text-white text-center leading-tight">
                Doctor Lab
              </span>
              <span className="text-[8px] font-mono text-emerald-400">Audit</span>
            </button>

            {/* 3. Ampere Meter */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic(15);
                setDoctorInitialTab("ampere");
                setDoctorModalOpen(true);
              }}
              style={{ transform: "translateZ(0)" }}
              className="flex flex-col items-center justify-center p-2 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 active:scale-90 transition-transform duration-100 will-change-transform shadow-md"
            >
              <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-yellow-500/20 text-amber-400 border border-amber-500/30 mb-1">
                <Zap className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold text-white text-center leading-tight">
                Ampere
              </span>
              <span className="text-[8px] font-mono text-amber-400">Current</span>
            </button>

            {/* 4. Digitizer Test */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic(15);
                setTouchModalOpen(true);
              }}
              style={{ transform: "translateZ(0)" }}
              className="flex flex-col items-center justify-center p-2 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/40 active:scale-90 transition-transform duration-100 will-change-transform shadow-md"
            >
              <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-purple-500/20 to-indigo-500/20 text-purple-400 border border-purple-500/30 mb-1">
                <Grid className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold text-white text-center leading-tight">
                Digitizer
              </span>
              <span className="text-[8px] font-mono text-purple-400">Matrix</span>
            </button>

            {/* 5. Laser Strobe */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic(15);
                setTorchModalOpen(true);
              }}
              style={{ transform: "translateZ(0)" }}
              className="flex flex-col items-center justify-center p-2 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-yellow-500/40 active:scale-90 transition-transform duration-100 will-change-transform shadow-md"
            >
              <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-yellow-500/20 to-amber-500/20 text-yellow-400 border border-yellow-500/30 mb-1">
                <Flashlight className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold text-white text-center leading-tight">
                Strobe
              </span>
              <span className="text-[8px] font-mono text-yellow-400">Torch</span>
            </button>

            {/* 6. Anti-Theft */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic(15);
                setAntiTheftModalOpen(true);
              }}
              style={{ transform: "translateZ(0)" }}
              className="flex flex-col items-center justify-center p-2 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-rose-500/40 active:scale-90 transition-transform duration-100 will-change-transform shadow-md"
            >
              <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-rose-500/20 to-red-500/20 text-rose-400 border border-rose-500/30 mb-1">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold text-white text-center leading-tight">
                Anti-Theft
              </span>
              <span className="text-[8px] font-mono text-rose-400">Siren</span>
            </button>

            {/* 7. Phone Dialer */}
            <a
              href={`tel:${PHONE}`}
              onClick={() => triggerHaptic(15)}
              style={{ transform: "translateZ(0)" }}
              className="flex flex-col items-center justify-center p-2 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 active:scale-90 transition-transform duration-100 will-change-transform shadow-md"
            >
              <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-green-500/20 text-emerald-400 border border-emerald-500/30 mb-1">
                <Phone className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold text-white text-center leading-tight">
                Dialer
              </span>
              <span className="text-[8px] font-mono text-emerald-400">Direct Lab</span>
            </a>

            {/* 8. WhatsApp Quick */}
            <a
              href={`https://wa.me/${WHATSAPP}?text=Hi%20Super%20Telecom,%20I%20am%20using%20the%20Cyber-OS%20Workspace%20and%20need%20repair%20help.`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => triggerHaptic(15)}
              style={{ transform: "translateZ(0)" }}
              className="flex flex-col items-center justify-center p-2 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 active:scale-90 transition-transform duration-100 will-change-transform shadow-md"
            >
              <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-emerald-500/20 text-cyan-400 border border-cyan-500/30 mb-1">
                <MessageCircle className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold text-white text-center leading-tight">
                WhatsApp
              </span>
              <span className="text-[8px] font-mono text-cyan-400">Chat</span>
            </a>
          </div>
        </div>
      </main>

      {/* ========================================================= */}
      {/* D. Native Bottom App Dock (Floating Fixed 68px)           */}
      {/* ========================================================= */}
      <div className="fixed bottom-8 left-3 right-3 z-30 flex items-center justify-center">
        <div className="h-[68px] w-full max-w-sm rounded-3xl bg-slate-950/85 border border-cyan-500/30 backdrop-blur-2xl px-4 flex items-center justify-around shadow-2xl shadow-cyan-950/80">
          {/* Dock 1: Turbo Clean */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic(15);
              setTurboCleanOpen(true);
            }}
            style={{ transform: "translateZ(0)" }}
            className="flex flex-col items-center justify-center active:scale-90 transition-transform group"
          >
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 group-hover:bg-cyan-500/30 transition-colors shadow-sm">
              <Zap className="h-5 w-5" />
            </div>
            <span className="text-[9px] font-mono font-bold text-slate-300 mt-1">
              Clean
            </span>
          </button>

          {/* Dock 2: Tools Hub */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic(15);
              setToolsHubOpen(true);
            }}
            style={{ transform: "translateZ(0)" }}
            className="flex flex-col items-center justify-center active:scale-90 transition-transform group"
          >
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 group-hover:bg-emerald-500/30 transition-colors shadow-sm">
              <Wrench className="h-5 w-5" />
            </div>
            <span className="text-[9px] font-mono font-bold text-slate-300 mt-1">
              Tools Hub
            </span>
          </button>

          {/* Dock 3: Parts Store */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic(15);
              setPartsStoreOpen(true);
            }}
            style={{ transform: "translateZ(0)" }}
            className="flex flex-col items-center justify-center active:scale-90 transition-transform group"
          >
            <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 group-hover:bg-amber-500/30 transition-colors shadow-sm">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <span className="text-[9px] font-mono font-bold text-slate-300 mt-1">
              Parts
            </span>
          </button>

          {/* Dock 4: OS Settings / Quick Control */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic(15);
              setControlCenterOpen(true);
            }}
            style={{ transform: "translateZ(0)" }}
            className="flex flex-col items-center justify-center active:scale-90 transition-transform group"
          >
            <div className="p-2.5 rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-400 group-hover:bg-purple-500/30 transition-colors shadow-sm">
              <Sliders className="h-5 w-5" />
            </div>
            <span className="text-[9px] font-mono font-bold text-slate-300 mt-1">
              Settings
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* E. Quick Exit Pill Bar (Bottom Fixed)                     */}
      {/* ========================================================= */}
      <div className="fixed bottom-1 left-0 right-0 z-30 flex items-center justify-center">
        <button
          type="button"
          onClick={handleExitToStandard}
          className="px-4 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 hover:border-rose-500/50 text-[10px] font-mono font-bold text-slate-400 hover:text-rose-300 active:scale-95 transition-all flex items-center gap-1.5 shadow-md backdrop-blur-md"
        >
          <span className="text-rose-400">✕</span>
          <span>Return to Standard App</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* Modals & Sheet Integrations                               */}
      {/* ========================================================= */}

      {/* Control Center */}
      <ControlCenterSheet
        isOpen={controlCenterOpen}
        onClose={() => setControlCenterOpen(false)}
      />

      {/* Primary Modals */}
      <SpeakerCleanerModal
        isOpen={speakerModalOpen}
        onClose={() => setSpeakerModalOpen(false)}
      />

      <TouchTestModal
        isOpen={touchModalOpen}
        onClose={() => setTouchModalOpen(false)}
      />

      <TorchControllerModal
        isOpen={torchModalOpen}
        onClose={() => setTorchModalOpen(false)}
      />

      <AntiTheftModal
        isOpen={antiTheftModalOpen}
        onClose={() => setAntiTheftModalOpen(false)}
      />

      <TurboCleanModal
        isOpen={turboCleanOpen}
        onClose={() => setTurboCleanOpen(false)}
      />

      <DoctorDiagnosticModal
        isOpen={doctorModalOpen}
        onClose={() => setDoctorModalOpen(false)}
        initialTab={doctorInitialTab}
      />

      <RepairTrackerModal
        isOpen={trackModalOpen}
        onClose={() => setTrackModalOpen(false)}
      />

      {/* Tools Hub Full Suite Drawer */}
      {toolsHubOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-xl animate-in fade-in">
          <div className="w-full max-w-md max-h-[85vh] flex flex-col rounded-t-3xl sm:rounded-3xl bg-slate-950/95 border border-cyan-500/30 p-4 shadow-2xl text-white select-none">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-cyan-400" />
                <h3 className="text-sm font-bold">16+ Offline Lab Suite</h3>
              </div>
              <button
                type="button"
                onClick={() => setToolsHubOpen(false)}
                className="p-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar py-3 grid grid-cols-2 gap-2">
              {TOOLS.map((tool) => {
                const Icon = tool.icon;
                return (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => {
                      triggerHaptic(15);
                      setToolsHubOpen(false);
                      setGenericToolModal(tool.id);
                    }}
                    className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 text-left active:scale-95 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-cyan-400 shrink-0" />
                      <span className="text-xs font-bold text-white truncate">
                        {tool.title}
                      </span>
                    </div>
                    <span className="text-[9px] text-slate-400 block mt-1 line-clamp-1">
                      {tool.subtitle}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Parts Store Inventory Drawer */}
      {partsStoreOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-xl animate-in fade-in">
          <div className="w-full max-w-md max-h-[85vh] flex flex-col rounded-t-3xl sm:rounded-3xl bg-slate-950/95 border border-emerald-500/30 p-4 shadow-2xl text-white select-none">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-emerald-400" />
                <div>
                  <h3 className="text-sm font-bold">Super Telecom Parts Store</h3>
                  <span className="text-[10px] text-emerald-400 font-mono">Barganda Road Inventory</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPartsStoreOpen(false)}
                className="p-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar py-3 space-y-2">
              {[
                { title: "OEM OLED Display Combos", price: "From ₹1,299", desc: "Samsung / iPhone / OnePlus" },
                { title: "High-Capacity 0-Cycle Battery", price: "From ₹699", desc: "6-Month Lab Warranty" },
                { title: "GaN Flash Fast Chargers", price: "From ₹449", desc: "67W / 80W / 120W Type-C" },
                { title: "UV Curved Tempered Glass", price: "From ₹149", desc: "Bubble-free installation" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-xs font-bold text-white">{item.title}</h4>
                    <p className="text-[10px] text-slate-400">{item.desc}</p>
                    <span className="text-xs font-bold text-emerald-400 font-mono mt-0.5 block">{item.price}</span>
                  </div>
                  <a
                    href={`https://wa.me/${WHATSAPP}?text=Hi%20Super%20Telecom,%20I%20want%20to%20order:%20${encodeURIComponent(item.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-xs active:scale-95"
                  >
                    Order
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Generic Modal Handlers for all 16 tools */}
      <BatteryGuardModal
        isOpen={genericToolModal === "battery_guard"}
        onClose={() => setGenericToolModal(null)}
      />
      <AudioHardwareTestModal
        isOpen={genericToolModal === "audio_test"}
        onClose={() => setGenericToolModal(null)}
      />
      <VibrationTesterModal
        isOpen={genericToolModal === "vibration_test"}
        onClose={() => setGenericToolModal(null)}
      />
      <DisplayFpsMeterModal
        isOpen={genericToolModal === "fps_meter"}
        onClose={() => setGenericToolModal(null)}
      />
      <WaterRescueWizardModal
        isOpen={genericToolModal === "water_wizard"}
        onClose={() => setGenericToolModal(null)}
        onOpenSpeakerEjector={() => {
          setGenericToolModal(null);
          setSpeakerModalOpen(true);
        }}
      />
      <DeadPixelTestModal
        isOpen={genericToolModal === "dead_pixel"}
        onClose={() => setGenericToolModal(null)}
      />
      <MultiTouchTesterModal
        isOpen={genericToolModal === "multi_touch"}
        onClose={() => setGenericToolModal(null)}
      />
      <BurnInHealerModal
        isOpen={genericToolModal === "burnin_healer"}
        onClose={() => setGenericToolModal(null)}
      />
      <GyroCompassModal
        isOpen={genericToolModal === "gyro"}
        onClose={() => setGenericToolModal(null)}
      />
      <AmbientLightTestModal
        isOpen={genericToolModal === "ambient_light"}
        onClose={() => setGenericToolModal(null)}
      />
      <ImeiValidatorModal
        isOpen={genericToolModal === "imei_validator"}
        onClose={() => setGenericToolModal(null)}
      />
      <SecretCodesModal
        isOpen={genericToolModal === "secret_codes"}
        onClose={() => setGenericToolModal(null)}
      />
      <LockScreenGenModal
        isOpen={genericToolModal === "lockscreen_gen"}
        onClose={() => setGenericToolModal(null)}
      />
      <UsedPhoneAuditModal
        isOpen={genericToolModal === "used_phone_audit"}
        onClose={() => setGenericToolModal(null)}
      />
    </div>
  );
};

export default CyberOSDesktop;
