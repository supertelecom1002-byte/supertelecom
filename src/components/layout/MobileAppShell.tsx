import React, { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  Home,
  Wrench,
  Search,
  ShoppingBag,
  Settings,
  Phone,
  MessageCircle,
  Clock,
  Sparkles,
  MapPin,
  ChevronRight,
  ShieldCheck,
  Zap,
  Droplets,
  Smartphone,
  ShieldAlert,
  BatteryCharging,
  Hash,
  Star,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  Cpu,
  Layers,
  HeartPulse,
  CheckSquare,
  Mic,
  Gauge,
  LifeBuoy,
  WifiOff,
  Radio,
  Activity,
  Flame,
} from "lucide-react";
import { useHardwarePermissions } from "@/hooks/useHardwarePermissions";
import {
  fetchAppConfig,
  subscribeToAppConfig,
  isLabOpenNow,
  type AppConfig,
  DEFAULT_APP_CONFIG,
} from "@/services/appConfigService";
import { SpeakerCleanerModal } from "@/components/tools/SpeakerCleanerModal";
import { TouchTestModal } from "@/components/tools/TouchTestModal";
import { AntiTheftModal } from "@/components/tools/AntiTheftModal";
import { BatteryGuardModal } from "@/components/tools/BatteryGuardModal";
import { SecretCodesModal } from "@/components/tools/SecretCodesModal";
import { LockScreenGenModal } from "@/components/tools/LockScreenGenModal";
import { UsedPhoneAuditModal } from "@/components/tools/UsedPhoneAuditModal";
import { AudioHardwareTestModal } from "@/components/tools/AudioHardwareTestModal";
import { VibrationTesterModal } from "@/components/tools/VibrationTesterModal";
import { DisplayFpsMeterModal } from "@/components/tools/DisplayFpsMeterModal";
import { WaterRescueWizardModal } from "@/components/tools/WaterRescueWizardModal";
import { RepairTrackerModal } from "@/components/repair/RepairTrackerModal";
import { SettingsView } from "@/components/settings/SettingsView";
import { RepairEstimator } from "@/components/interactive/RepairEstimator";

export type MobileTab = "home" | "tools" | "track" | "shop" | "settings";

const PHONE = "+918002903643";
const WHATSAPP = "918002903643";

interface MobileAppShellProps {
  initialTab?: MobileTab;
}

export const MobileAppShell: React.FC<MobileAppShellProps> = ({
  initialTab = "home",
}) => {
  const [activeTab, setActiveTab] = useState<MobileTab>(initialTab);
  const [config, setConfig] = useState<AppConfig>(DEFAULT_APP_CONFIG);
  const [isOffline, setIsOffline] = useState(false);
  const { triggerVibration } = useHardwarePermissions();

  // Tool Modals
  const [speakerModalOpen, setSpeakerModalOpen] = useState(false);
  const [touchModalOpen, setTouchModalOpen] = useState(false);
  const [antiTheftModalOpen, setAntiTheftModalOpen] = useState(false);
  const [batteryModalOpen, setBatteryModalOpen] = useState(false);
  const [secretCodesModalOpen, setSecretCodesModalOpen] = useState(false);
  const [lockscreenModalOpen, setLockscreenModalOpen] = useState(false);
  const [usedAuditModalOpen, setUsedAuditModalOpen] = useState(false);
  const [audioTestModalOpen, setAudioTestModalOpen] = useState(false);
  const [vibrationModalOpen, setVibrationModalOpen] = useState(false);
  const [fpsMeterModalOpen, setFpsMeterModalOpen] = useState(false);
  const [waterWizardModalOpen, setWaterWizardModalOpen] = useState(false);
  const [trackModalOpen, setTrackModalOpen] = useState(false);

  // Online / Offline state detection
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsOffline(!navigator.onLine);
      const onOnline = () => setIsOffline(false);
      const onOffline = () => setIsOffline(true);
      window.addEventListener("online", onOnline);
      window.addEventListener("offline", onOffline);
      return () => {
        window.removeEventListener("online", onOnline);
        window.removeEventListener("offline", onOffline);
      };
    }
  }, []);

  useEffect(() => {
    fetchAppConfig().then(setConfig);
    const unsub = subscribeToAppConfig(setConfig);
    return unsub;
  }, []);

  const labStatus = isLabOpenNow(config?.lab_status_override || "auto");

  const handleTabChange = (tab: MobileTab) => {
    triggerVibration(15);
    setActiveTab(tab);
  };

  const openToolWithHaptic = (opener: (val: boolean) => void) => {
    triggerVibration(15);
    opener(true);
  };

  return (
    <div className="md:hidden h-[100dvh] flex flex-col bg-[#02040a] text-slate-100 overflow-hidden select-none relative">
      {/* Background Cyber-Lab Ambient Spots */}
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-cyan-500/[0.04] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-emerald-500/[0.03] rounded-full blur-3xl pointer-events-none" />

      {/* ========================================================= */}
      {/* 1. Offline Mode Indicator Micro-Pill                      */}
      {/* ========================================================= */}
      {isOffline && (
        <div className="w-full bg-cyan-950/95 border-b border-cyan-500/40 py-1 px-3 flex items-center justify-center gap-2 z-50 animate-in fade-in">
          <WifiOff className="h-3 w-3 text-cyan-400 shrink-0" />
          <span className="text-[10px] font-mono text-cyan-200 font-bold tracking-tight">
            ⚡ Offline Mode Active &bull; All 10+ Hardware Tools Ready
          </span>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. Compact Top App Bar (Fixed 52px)                      */}
      {/* ========================================================= */}
      <header className="h-[52px] flex-none px-3 bg-[#030712]/95 border-b border-slate-800/80 backdrop-blur-2xl flex items-center justify-between z-40 pt-safe">
        {/* Left: Official Super Telecom Logo with subtle cyan backglow */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="absolute -inset-1 rounded-xl bg-cyan-500/20 blur-xs" />
            <img
              src="/icon-192.png"
              alt="Super Telecom Official Logo"
              className="relative w-8 h-8 object-contain rounded-xl shadow-sm border border-cyan-500/20 bg-slate-900 active:scale-95 transition-transform"
              onError={(e) => {
                e.currentTarget.src = "/logo.png";
              }}
            />
          </div>
          <div className="leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-white tracking-tight">
                SUPER TELECOM
              </span>
              <span className="relative flex h-2 w-2">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                    labStatus.isOpen ? "bg-emerald-400" : "bg-rose-400"
                  } opacity-75`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    labStatus.isOpen ? "bg-emerald-500" : "bg-rose-500"
                  }`}
                />
              </span>
            </div>
            <span className="text-[9px] text-cyan-400 font-mono font-medium tracking-tight block">
              CYBER-LAB &bull; CHIP REPAIR
            </span>
          </div>
        </div>

        {/* Center: Micro Tab Label */}
        <div className="hidden xs:block text-[10px] font-mono text-slate-400 uppercase tracking-widest font-semibold">
          {activeTab === "home" && "Dashboard"}
          {activeTab === "tools" && "Cyber Suite"}
          {activeTab === "track" && "Live Pipeline"}
          {activeTab === "shop" && "Parts Matrix"}
          {activeTab === "settings" && "Config"}
        </div>

        {/* Right: Emergency Direct-Call Icon + Native Settings Gear */}
        <div className="flex items-center gap-1.5">
          <a
            href={`tel:${PHONE}`}
            onClick={() => triggerVibration(15)}
            aria-label="Direct Call Engineer"
            className="h-8 w-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center active:scale-90 transition-transform shadow-xs"
          >
            <Phone className="h-4 w-4" />
          </a>
          <button
            type="button"
            onClick={() => handleTabChange("settings")}
            aria-label="Open Settings"
            className={`h-8 w-8 rounded-xl border flex items-center justify-center active:scale-90 transition-transform ${
              activeTab === "settings"
                ? "bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/30"
                : "bg-slate-900 border-slate-800 text-slate-300 hover:text-white"
            }`}
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 3. Dynamic Quick-Action Carousel (Horizontal Pills)      */}
      {/* ========================================================= */}
      <div className="flex-none bg-[#030712]/90 border-b border-slate-800/80 px-3 py-1.5 overflow-x-auto no-scrollbar flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => handleTabChange("tools")}
          className="px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono font-bold flex items-center gap-1 whitespace-nowrap active:scale-95 transition-transform"
        >
          <Wrench className="h-3 w-3 text-cyan-400" />
          <span>🧰 Free Tools</span>
        </button>

        <button
          type="button"
          onClick={() => {
            triggerVibration(15);
            setWaterWizardModalOpen(true);
          }}
          className="px-2.5 py-1 rounded-full bg-rose-950/80 border border-rose-500/40 text-rose-300 text-[10px] font-mono font-bold flex items-center gap-1 whitespace-nowrap active:scale-95 transition-transform"
        >
          <LifeBuoy className="h-3 w-3 text-rose-400" />
          <span>💧 Water Rescue</span>
        </button>

        <Link
          to="/services/screen-replacement"
          onClick={() => triggerVibration(15)}
          className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-300 text-[10px] font-mono font-bold flex items-center gap-1 whitespace-nowrap active:scale-95 transition-transform"
        >
          <Smartphone className="h-3 w-3 text-cyan-400" />
          <span>📱 Screen Price</span>
        </Link>

        <Link
          to="/services/motherboard-repair"
          onClick={() => triggerVibration(15)}
          className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-slate-300 text-[10px] font-mono font-bold flex items-center gap-1 whitespace-nowrap active:scale-95 transition-transform"
        >
          <Cpu className="h-3 w-3 text-amber-400" />
          <span>🔬 Motherboard/IC</span>
        </Link>

        <Link
          to="/services/battery-replacement"
          onClick={() => triggerVibration(15)}
          className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-slate-300 text-[10px] font-mono font-bold flex items-center gap-1 whitespace-nowrap active:scale-95 transition-transform"
        >
          <BatteryCharging className="h-3 w-3 text-emerald-400" />
          <span>⚡ Battery Swap</span>
        </Link>

        <Link
          to="/services"
          onClick={() => triggerVibration(15)}
          className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-[10px] font-mono font-bold flex items-center gap-1 whitespace-nowrap active:scale-95 transition-transform"
        >
          <ShieldCheck className="h-3 w-3 text-purple-400" />
          <span>🛡️ UV Glass</span>
        </Link>
      </div>

      {/* ========================================================= */}
      {/* 4. Scrollable App Content Container                       */}
      {/* ========================================================= */}
      <main className="flex-1 overflow-y-auto no-scrollbar native-scroll px-3 py-3 space-y-4">
        {/* ===================================================== */}
        {/* TAB 1: ⚡ DASHBOARD                                   */}
        {/* ===================================================== */}
        {activeTab === "home" && (
          <div className="space-y-4 pb-20 animate-in fade-in duration-200">
            {/* Live Lab Status Banner */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 backdrop-blur-2xl border border-slate-800/80 shadow-xl shadow-black/40">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5 flex-none">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                      labStatus.isOpen ? "bg-emerald-400" : "bg-rose-400"
                    } opacity-75`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                      labStatus.isOpen ? "bg-emerald-500" : "bg-rose-500"
                    }`}
                  />
                </span>
                <div className="leading-tight">
                  <span className="text-xs font-bold text-white block">
                    {labStatus.isOpen ? "Barganda Road Lab Open" : "Lab Currently Closed"}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {labStatus.subText}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => openToolWithHaptic(setTrackModalOpen)}
                className="px-2.5 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold text-[10px] active:scale-95 transition-transform"
              >
                Track Repair
              </button>
            </div>

            {/* Quick 1-Tap Emergency Action Bar */}
            <div className="grid grid-cols-3 gap-2">
              <a
                href={`tel:${PHONE}`}
                onClick={() => triggerVibration(15)}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-900/60 backdrop-blur-2xl border border-slate-800/80 hover:border-emerald-500/40 text-emerald-400 active:scale-95 transition-all shadow-md shadow-black/40"
              >
                <Phone className="h-5 w-5 mb-1 text-emerald-400" />
                <span className="text-[11px] font-bold text-white">Call Lab</span>
                <span className="text-[9px] text-emerald-400 font-mono">Direct Line</span>
              </a>

              <a
                href={`https://wa.me/${WHATSAPP}?text=Hi%20Super%20Telecom,%20I%20need%20urgent%20mobile%20repair%20assistance.`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => triggerVibration(15)}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-900/60 backdrop-blur-2xl border border-slate-800/80 hover:border-cyan-500/40 text-cyan-400 active:scale-95 transition-all shadow-md shadow-black/40"
              >
                <MessageCircle className="h-5 w-5 mb-1 text-cyan-400" />
                <span className="text-[11px] font-bold text-white">WhatsApp</span>
                <span className="text-[9px] text-cyan-400 font-mono">Instant Quote</span>
              </a>

              <button
                type="button"
                onClick={() => handleTabChange("tools")}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-gradient-to-tr from-cyan-950/80 to-blue-950/80 border border-cyan-500/40 text-cyan-300 active:scale-95 transition-all shadow-md shadow-black/40"
              >
                <Wrench className="h-5 w-5 mb-1 text-cyan-400" />
                <span className="text-[11px] font-bold text-white">10+ Tools</span>
                <span className="text-[9px] text-cyan-400 font-mono">Offline Suite</span>
              </button>
            </div>

            {/* Fast Diagnostic Shortcuts Strip */}
            <div className="rounded-2xl bg-slate-900/60 backdrop-blur-2xl border border-slate-800/80 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1">
                  <Zap className="h-3 w-3 text-amber-400" /> Express Hardware Tests
                </span>
                <button
                  type="button"
                  onClick={() => handleTabChange("tools")}
                  className="text-[10px] text-slate-400 hover:text-white font-semibold"
                >
                  View All (10+) &rarr;
                </button>
              </div>

              <div className="grid grid-cols-4 gap-1.5">
                <button
                  type="button"
                  onClick={() => openToolWithHaptic(setSpeakerModalOpen)}
                  className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 text-center active:scale-95 transition-all"
                >
                  <Droplets className="h-4 w-4 text-cyan-400 mx-auto mb-1 animate-pulse" />
                  <span className="text-[9px] font-bold text-white block">165Hz</span>
                  <span className="text-[8px] text-slate-500 block">Ejector</span>
                </button>

                <button
                  type="button"
                  onClick={() => openToolWithHaptic(setTouchModalOpen)}
                  className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/40 text-center active:scale-95 transition-all"
                >
                  <Smartphone className="h-4 w-4 text-emerald-400 mx-auto mb-1" />
                  <span className="text-[9px] font-bold text-white block">Touch</span>
                  <span className="text-[8px] text-slate-500 block">Matrix</span>
                </button>

                <button
                  type="button"
                  onClick={() => openToolWithHaptic(setFpsMeterModalOpen)}
                  className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-purple-500/40 text-center active:scale-95 transition-all"
                >
                  <Gauge className="h-4 w-4 text-purple-400 mx-auto mb-1" />
                  <span className="text-[9px] font-bold text-white block">FPS Rate</span>
                  <span className="text-[8px] text-slate-500 block">120Hz Test</span>
                </button>

                <button
                  type="button"
                  onClick={() => openToolWithHaptic(setAudioTestModalOpen)}
                  className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/40 text-center active:scale-95 transition-all"
                >
                  <Mic className="h-4 w-4 text-amber-400 mx-auto mb-1" />
                  <span className="text-[9px] font-bold text-white block">Mic Test</span>
                  <span className="text-[8px] text-slate-500 block">Loopback</span>
                </button>
              </div>
            </div>

            {/* 2-Column Express Repair Silos */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                Lab Repair Services (Giridih)
              </span>

              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/services/screen-replacement"
                  onClick={() => triggerVibration(15)}
                  className="p-3 rounded-2xl bg-slate-900/60 backdrop-blur-2xl border border-slate-800/80 hover:border-cyan-500/40 active:scale-95 transition-all shadow-sm space-y-1"
                >
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 w-fit">
                    <Smartphone className="h-4 w-4" />
                  </div>
                  <h4 className="text-xs font-bold text-white">Screen &amp; OLED Glass</h4>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    Same-day OCA glass lamination &amp; original display.
                  </p>
                  <span className="text-[10px] font-mono font-bold text-cyan-400 block pt-1">
                    Starts ₹899 &bull; 45 Mins
                  </span>
                </Link>

                <Link
                  to="/services/iphone-repair"
                  onClick={() => triggerVibration(15)}
                  className="p-3 rounded-2xl bg-slate-900/60 backdrop-blur-2xl border border-slate-800/80 hover:border-cyan-500/40 active:scale-95 transition-all shadow-sm space-y-1"
                >
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 w-fit">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <h4 className="text-xs font-bold text-white">iPhone Lab Care</h4>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    FaceID, battery health % bypass, rear glass laser fix.
                  </p>
                  <span className="text-[10px] font-mono font-bold text-cyan-400 block pt-1">
                    Certified Lab &bull; Warranty
                  </span>
                </Link>

                <Link
                  to="/services/motherboard-repair"
                  onClick={() => triggerVibration(15)}
                  className="p-3 rounded-2xl bg-slate-900/60 backdrop-blur-2xl border border-slate-800/80 hover:border-cyan-500/40 active:scale-95 transition-all shadow-sm space-y-1"
                >
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 w-fit">
                    <Cpu className="h-4 w-4" />
                  </div>
                  <h4 className="text-xs font-bold text-white">Motherboard IC Micro-Solder</h4>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    Dead phone revival, charging IC, power audio IC.
                  </p>
                  <span className="text-[10px] font-mono font-bold text-cyan-400 block pt-1">
                    Microscope BGA &bull; 90D Wty
                  </span>
                </Link>

                <Link
                  to="/services/battery-replacement"
                  onClick={() => triggerVibration(15)}
                  className="p-3 rounded-2xl bg-slate-900/60 backdrop-blur-2xl border border-slate-800/80 hover:border-cyan-500/40 active:scale-95 transition-all shadow-sm space-y-1"
                >
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 w-fit">
                    <BatteryCharging className="h-4 w-4" />
                  </div>
                  <h4 className="text-xs font-bold text-white">Battery &amp; Charging Port</h4>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    Original capacity high-grade lithium cells &amp; Type-C ports.
                  </p>
                  <span className="text-[10px] font-mono font-bold text-cyan-400 block pt-1">
                    30 Min Swap &bull; 6M Wty
                  </span>
                </Link>
              </div>
            </div>

            {/* Price Estimator Compact Card */}
            <div className="rounded-2xl bg-slate-900/60 backdrop-blur-2xl border border-slate-800/80 p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-cyan-400" /> Instant Repair Estimator
                </span>
                <span className="text-[9px] font-mono text-cyan-400 uppercase">Live Pricing</span>
              </div>
              <RepairEstimator />
            </div>

            {/* Lab Trust Card & Rating */}
            <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2 text-center">
              <div className="flex items-center justify-center gap-1 text-amber-400 text-xs">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                ))}
                <span className="font-bold text-white ml-1 text-xs">4.9 / 5.0</span>
              </div>
              <p className="text-[11px] text-slate-300">
                &ldquo;Giridih me best mobile screen replacement service! Original display 1 ghante me laga diya.&rdquo;
              </p>
              <span className="text-[10px] text-slate-500 font-mono block">
                1,200+ Verified Repairs &bull; Barganda Road, Giridih
              </span>
            </div>
          </div>
        )}

        {/* ===================================================== */}
        {/* TAB 2: 🧰 CYBER-LAB TOOLS (10+ UTILITIES GRID)         */}
        {/* ===================================================== */}
        {activeTab === "tools" && (
          <div className="space-y-3 pb-24 animate-in fade-in duration-200">
            {/* Header Badge */}
            <div className="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Wrench className="h-5 w-5 text-cyan-400 shrink-0" />
                <div>
                  <h3 className="text-xs font-bold text-white">Cyber-Lab Offline Diagnostic Suite</h3>
                  <p className="text-[10px] text-cyan-300">
                    100% Client-side &bull; Zero Data Required &bull; Native Web APIs
                  </p>
                </div>
              </div>
              <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                11 Utilities
              </span>
            </div>

            {/* 2-Column Cyberpunk Grid for all 10+ Hardware Tools */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* 1. Speaker Ejector */}
              <div
                onClick={() => openToolWithHaptic(setSpeakerModalOpen)}
                className="p-3 rounded-2xl bg-slate-900/60 backdrop-blur-2xl border border-slate-800/80 hover:border-cyan-500/40 active:scale-95 transition-all cursor-pointer flex flex-col justify-between shadow-md space-y-2"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                      <Droplets className="h-4 w-4 animate-pulse" />
                    </div>
                    <span className="text-[8px] font-mono text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded-full border border-cyan-800">
                      165Hz
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white mt-1.5">Sonic 165Hz Ejector</h4>
                  <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                    Dual-frequency sound burst &amp; haptic pulses clear water.
                  </p>
                </div>
                <span className="text-[10px] font-bold text-cyan-400 flex items-center gap-1">
                  Launch &rarr;
                </span>
              </div>

              {/* 2. Touch Matrix */}
              <div
                onClick={() => openToolWithHaptic(setTouchModalOpen)}
                className="p-3 rounded-2xl bg-slate-900/60 backdrop-blur-2xl border border-slate-800/80 hover:border-emerald-500/40 active:scale-95 transition-all cursor-pointer flex flex-col justify-between shadow-md space-y-2"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      <Smartphone className="h-4 w-4" />
                    </div>
                    <span className="text-[8px] font-mono text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded-full border border-emerald-800">
                      10x15
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white mt-1.5">Touch Matrix &amp; Pixels</h4>
                  <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                    150-tile sweep, ghost touch tracker &amp; RGB flasher.
                  </p>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                  Audit &rarr;
                </span>
              </div>

              {/* 3. Anti-Theft Siren */}
              <div
                onClick={() => openToolWithHaptic(setAntiTheftModalOpen)}
                className="p-3 rounded-2xl bg-slate-900/60 backdrop-blur-2xl border border-slate-800/80 hover:border-rose-500/40 active:scale-95 transition-all cursor-pointer flex flex-col justify-between shadow-md space-y-2"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30">
                      <ShieldAlert className="h-4 w-4" />
                    </div>
                    <span className="text-[8px] font-mono text-rose-400 bg-rose-950 px-1.5 py-0.5 rounded-full border border-rose-800">
                      Siren
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white mt-1.5">Anti-Theft Unplug</h4>
                  <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                    100% emergency alarm &amp; strobe if charger is pulled.
                  </p>
                </div>
                <span className="text-[10px] font-bold text-rose-400 flex items-center gap-1">
                  Arm Alarm &rarr;
                </span>
              </div>

              {/* 4. Mic & Audio Loopback */}
              <div
                onClick={() => openToolWithHaptic(setAudioTestModalOpen)}
                className="p-3 rounded-2xl bg-slate-900/60 backdrop-blur-2xl border border-slate-800/80 hover:border-cyan-500/40 active:scale-95 transition-all cursor-pointer flex flex-col justify-between shadow-md space-y-2"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                      <Mic className="h-4 w-4" />
                    </div>
                    <span className="text-[8px] font-mono text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded-full border border-cyan-800">
                      Loopback
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white mt-1.5">Mic Loopback Test</h4>
                  <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                    4s local recording playback tests microphone clarity.
                  </p>
                </div>
                <span className="text-[10px] font-bold text-cyan-400 flex items-center gap-1">
                  Test Mic &rarr;
                </span>
              </div>

              {/* 5. Vibration Motor Test */}
              <div
                onClick={() => openToolWithHaptic(setVibrationModalOpen)}
                className="p-3 rounded-2xl bg-slate-900/60 backdrop-blur-2xl border border-slate-800/80 hover:border-amber-500/40 active:scale-95 transition-all cursor-pointer flex flex-col justify-between shadow-md space-y-2"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      <Zap className="h-4 w-4" />
                    </div>
                    <span className="text-[8px] font-mono text-amber-400 bg-amber-950 px-1.5 py-0.5 rounded-full border border-amber-800">
                      4 Stress
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white mt-1.5">Haptic Motor Test</h4>
                  <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                    Pulse, Heartbeat, Buzz &amp; SOS patterns verify motor.
                  </p>
                </div>
                <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                  Run Stress &rarr;
                </span>
              </div>

              {/* 6. Display FPS & Refresh Rate */}
              <div
                onClick={() => openToolWithHaptic(setFpsMeterModalOpen)}
                className="p-3 rounded-2xl bg-slate-900/60 backdrop-blur-2xl border border-slate-800/80 hover:border-purple-500/40 active:scale-95 transition-all cursor-pointer flex flex-col justify-between shadow-md space-y-2"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
                      <Gauge className="h-4 w-4" />
                    </div>
                    <span className="text-[8px] font-mono text-purple-400 bg-purple-950 px-1.5 py-0.5 rounded-full border border-purple-800">
                      120Hz
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white mt-1.5">Display FPS Meter</h4>
                  <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                    Measures true 60Hz/90Hz/120Hz refresh rate in real time.
                  </p>
                </div>
                <span className="text-[10px] font-bold text-purple-400 flex items-center gap-1">
                  Meter FPS &rarr;
                </span>
              </div>

              {/* 7. Water Damage Emergency Protocol */}
              <div
                onClick={() => openToolWithHaptic(setWaterWizardModalOpen)}
                className="p-3 rounded-2xl bg-slate-900/60 backdrop-blur-2xl border border-slate-800/80 hover:border-rose-500/40 active:scale-95 transition-all cursor-pointer flex flex-col justify-between shadow-md space-y-2"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30">
                      <LifeBuoy className="h-4 w-4" />
                    </div>
                    <span className="text-[8px] font-mono text-rose-400 bg-rose-950 px-1.5 py-0.5 rounded-full border border-rose-800">
                      Triage
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white mt-1.5">Water Damage Protocol</h4>
                  <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                    4-step survival guide &amp; 2-hour golden lab window.
                  </p>
                </div>
                <span className="text-[10px] font-bold text-rose-400 flex items-center gap-1">
                  Open Triage &rarr;
                </span>
              </div>

              {/* 8. Smart Battery Guard */}
              <div
                onClick={() => openToolWithHaptic(setBatteryModalOpen)}
                className="p-3 rounded-2xl bg-slate-900/60 backdrop-blur-2xl border border-slate-800/80 hover:border-emerald-500/40 active:scale-95 transition-all cursor-pointer flex flex-col justify-between shadow-md space-y-2"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      <BatteryCharging className="h-4 w-4" />
                    </div>
                    <span className="text-[8px] font-mono text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded-full border border-emerald-800">
                      85% Guard
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white mt-1.5">Battery Guard 85%</h4>
                  <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                    Overcharge alarm to extend lithium battery life.
                  </p>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                  Guard &rarr;
                </span>
              </div>

              {/* 9. Secret Codes */}
              <div
                onClick={() => openToolWithHaptic(setSecretCodesModalOpen)}
                className="p-3 rounded-2xl bg-slate-900/60 backdrop-blur-2xl border border-slate-800/80 hover:border-cyan-500/40 active:scale-95 transition-all cursor-pointer flex flex-col justify-between shadow-md space-y-2"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                      <Hash className="h-4 w-4" />
                    </div>
                    <span className="text-[8px] font-mono text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded-full border border-cyan-800">
                      Codes
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white mt-1.5">Secret Dial Codes</h4>
                  <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                    Hardware menus for Samsung, Apple, OnePlus &amp; Xiaomi.
                  </p>
                </div>
                <span className="text-[10px] font-bold text-cyan-400 flex items-center gap-1">
                  Directory &rarr;
                </span>
              </div>

              {/* 10. Emergency Lockscreen */}
              <div
                onClick={() => openToolWithHaptic(setLockscreenModalOpen)}
                className="p-3 rounded-2xl bg-slate-900/60 backdrop-blur-2xl border border-slate-800/80 hover:border-rose-500/40 active:scale-95 transition-all cursor-pointer flex flex-col justify-between shadow-md space-y-2"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30">
                      <HeartPulse className="h-4 w-4" />
                    </div>
                    <span className="text-[8px] font-mono text-rose-400 bg-rose-950 px-1.5 py-0.5 rounded-full border border-rose-800">
                      AMOLED
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white mt-1.5">Emergency ICE Wall</h4>
                  <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                    Canvas generator creates lost phone recovery wallpaper.
                  </p>
                </div>
                <span className="text-[10px] font-bold text-rose-400 flex items-center gap-1">
                  Generate &rarr;
                </span>
              </div>

              {/* 11. Used Phone Audit */}
              <div
                onClick={() => openToolWithHaptic(setUsedAuditModalOpen)}
                className="p-3 rounded-2xl bg-slate-900/60 backdrop-blur-2xl border border-slate-800/80 hover:border-amber-500/40 active:scale-95 transition-all cursor-pointer flex flex-col justify-between shadow-md space-y-2 col-span-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      <CheckSquare className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">12-Point Used Phone Audit Checklist</h4>
                      <p className="text-[10px] text-slate-400 leading-tight">
                        Hardware, TrueTone, battery cycles &amp; IMEI inspection before purchasing second-hand.
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-amber-400 shrink-0">
                    Audit &rarr;
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================== */}
        {/* TAB 3: 🔍 TRACK JOB SHEET                             */}
        {/* ===================================================== */}
        {activeTab === "track" && (
          <div className="space-y-4 pb-20 animate-in fade-in duration-200">
            <div className="p-4 rounded-2xl bg-slate-900/60 backdrop-blur-2xl border border-slate-800/80 space-y-3">
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Live Job Sheet Pipeline</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Enter your Super Telecom Job Sheet number (e.g. <strong>ST-1082</strong>) or registered phone number to check stage in our Barganda Road Lab.
              </p>
              <button
                type="button"
                onClick={() => openToolWithHaptic(setTrackModalOpen)}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 active:scale-95 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                <Search className="h-4 w-4" />
                <span>Search Job Sheet Database</span>
              </button>
            </div>

            {/* Stages overview */}
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                Lab Repair Pipeline
              </span>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="h-6 w-6 rounded-lg bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-xs">1</span>
                  <div>
                    <span className="font-bold text-white block">Device Received</span>
                    <span className="text-[10px] text-slate-400">Barcode tag applied &amp; initial physical inspection</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="h-6 w-6 rounded-lg bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-xs">2</span>
                  <div>
                    <span className="font-bold text-white block">Under Microscope Diagnostics</span>
                    <span className="text-[10px] text-slate-400">IC micro-soldering &amp; board voltage checks</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="h-6 w-6 rounded-lg bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs">3</span>
                  <div>
                    <span className="font-bold text-white block">QC Testing &amp; Seal</span>
                    <span className="text-[10px] text-slate-400">Digitizer, camera &amp; battery drain verification</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="h-6 w-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs">4</span>
                  <div>
                    <span className="font-bold text-white block">Ready for Handover</span>
                    <span className="text-[10px] text-slate-400">Warranty invoice generated for pickup</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================== */}
        {/* TAB 4: 🛍️ PARTS / SHOP                                */}
        {/* ===================================================== */}
        {activeTab === "shop" && (
          <div className="space-y-3 pb-20 animate-in fade-in duration-200">
            <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-emerald-400" />
                <div>
                  <h3 className="text-xs font-bold text-white">Original Parts &amp; Accessories</h3>
                  <span className="text-[10px] text-emerald-300">Barganda Road In-Stock Inventory</span>
                </div>
              </div>
              <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                OEM Genuine
              </span>
            </div>

            {/* 2-Column Compact Parts Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {[
                {
                  title: "Original OLED Display Combos",
                  desc: "Samsung / iPhone / OnePlus OEM panels",
                  price: "From ₹1,299",
                  tag: "Displays",
                },
                {
                  title: "High-Capacity Authentic Batteries",
                  desc: "0-Cycle lithium cells with 6M warranty",
                  price: "From ₹699",
                  tag: "Power",
                },
                {
                  title: "Fast Chargers (67W / 80W / 120W)",
                  desc: "Type-C GaN flash chargers with cable",
                  price: "From ₹449",
                  tag: "Accessories",
                },
                {
                  title: "UV Privacy & 9D Tempered Glass",
                  desc: "Curved edge-to-edge bubble-free install",
                  price: "From ₹149",
                  tag: "Protection",
                },
                {
                  title: "Original Charging Sub-Boards",
                  desc: "Microphone & fast-charge IC restored",
                  price: "From ₹399",
                  tag: "Internal",
                },
                {
                  title: "Certified Refurbished Mobiles",
                  desc: "Tested 12-point verified second hand phones",
                  price: "From ₹4,999",
                  tag: "Phones",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-slate-900/60 backdrop-blur-2xl border border-slate-800/80 flex flex-col justify-between shadow-sm space-y-2"
                >
                  <div>
                    <span className="text-[8px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded-full border border-cyan-800/40">
                      {item.tag}
                    </span>
                    <h4 className="text-xs font-bold text-white mt-1.5">{item.title}</h4>
                    <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400">{item.price}</span>
                    <a
                      href={`https://wa.me/${WHATSAPP}?text=Hi%20Super%20Telecom,%20I%20want%20to%20order%20or%20inquire%20about:%20${encodeURIComponent(
                        item.title
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => triggerVibration(15)}
                      className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-[10px] font-bold active:scale-95 transition-transform"
                    >
                      Inquire
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================== */}
        {/* TAB 5: ⚙️ SETTINGS & CONTROL CENTER                  */}
        {/* ===================================================== */}
        {activeTab === "settings" && (
          <div className="animate-in fade-in duration-200">
            <SettingsView />
          </div>
        )}
      </main>

      {/* ========================================================= */}
      {/* 5. Tactile Bottom Navigation (Fixed 62px)                 */}
      {/* ========================================================= */}
      <nav
        aria-label="Native Mobile Navigation Bar"
        className="h-[62px] flex-none bg-[#030712]/95 border-t border-slate-800/80 backdrop-blur-2xl px-2 flex items-center justify-around z-40 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(0,0,0,0.8)]"
      >
        {/* 1. Dashboard */}
        <button
          type="button"
          onClick={() => handleTabChange("home")}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all active:scale-90 ${
            activeTab === "home" ? "text-cyan-400" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <div className="relative">
            <Home className="h-5 w-5" />
            {activeTab === "home" && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
            )}
          </div>
          <span className="text-[10px] font-semibold tracking-tight mt-0.5">Dashboard</span>
        </button>

        {/* 2. Lab Tools */}
        <button
          type="button"
          onClick={() => handleTabChange("tools")}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all active:scale-90 ${
            activeTab === "tools" ? "text-cyan-400" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <div className="relative">
            <Wrench className="h-5 w-5" />
            {activeTab === "tools" && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
            )}
          </div>
          <span className="text-[10px] font-semibold tracking-tight mt-0.5">Lab Tools</span>
        </button>

        {/* 3. Track */}
        <button
          type="button"
          onClick={() => handleTabChange("track")}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all active:scale-90 ${
            activeTab === "track" ? "text-amber-400" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <div className="relative">
            <Search className="h-5 w-5" />
            {activeTab === "track" && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]" />
            )}
          </div>
          <span className="text-[10px] font-semibold tracking-tight mt-0.5">Track</span>
        </button>

        {/* 4. Parts / Shop */}
        {config?.shop_accessories_enabled !== false && (
          <button
            type="button"
            onClick={() => handleTabChange("shop")}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all active:scale-90 ${
              activeTab === "shop" ? "text-emerald-400" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <div className="relative">
              <ShoppingBag className="h-5 w-5" />
              {activeTab === "shop" && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              )}
            </div>
            <span className="text-[10px] font-semibold tracking-tight mt-0.5">Parts Store</span>
          </button>
        )}

        {/* 5. Settings */}
        <button
          type="button"
          onClick={() => handleTabChange("settings")}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all active:scale-90 ${
            activeTab === "settings" ? "text-cyan-400" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <div className="relative">
            <Settings className="h-5 w-5" />
            {activeTab === "settings" && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
            )}
          </div>
          <span className="text-[10px] font-semibold tracking-tight mt-0.5">Settings</span>
        </button>
      </nav>

      {/* ========================================================= */}
      {/* 6. Native Tool Modals                                     */}
      {/* ========================================================= */}
      <SpeakerCleanerModal
        isOpen={speakerModalOpen}
        onClose={() => setSpeakerModalOpen(false)}
      />

      <TouchTestModal
        isOpen={touchModalOpen}
        onClose={() => setTouchModalOpen(false)}
      />

      <AntiTheftModal
        isOpen={antiTheftModalOpen}
        onClose={() => setAntiTheftModalOpen(false)}
      />

      <AudioHardwareTestModal
        isOpen={audioTestModalOpen}
        onClose={() => setAudioTestModalOpen(false)}
      />

      <VibrationTesterModal
        isOpen={vibrationModalOpen}
        onClose={() => setVibrationModalOpen(false)}
      />

      <DisplayFpsMeterModal
        isOpen={fpsMeterModalOpen}
        onClose={() => setFpsMeterModalOpen(false)}
      />

      <WaterRescueWizardModal
        isOpen={waterWizardModalOpen}
        onClose={() => setWaterWizardModalOpen(false)}
        onOpenSpeakerEjector={() => setSpeakerModalOpen(true)}
      />

      <BatteryGuardModal
        isOpen={batteryModalOpen}
        onClose={() => setBatteryModalOpen(false)}
      />

      <SecretCodesModal
        isOpen={secretCodesModalOpen}
        onClose={() => setSecretCodesModalOpen(false)}
      />

      <LockScreenGenModal
        isOpen={lockscreenModalOpen}
        onClose={() => setLockscreenModalOpen(false)}
      />

      <UsedPhoneAuditModal
        isOpen={usedAuditModalOpen}
        onClose={() => setUsedAuditModalOpen(false)}
      />

      <RepairTrackerModal
        isOpen={trackModalOpen}
        onClose={() => setTrackModalOpen(false)}
      />
    </div>
  );
};

export default MobileAppShell;
