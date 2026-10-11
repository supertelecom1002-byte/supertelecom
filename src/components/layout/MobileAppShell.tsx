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
  const { triggerVibration } = useHardwarePermissions();

  // Tool Modals
  const [speakerModalOpen, setSpeakerModalOpen] = useState(false);
  const [touchModalOpen, setTouchModalOpen] = useState(false);
  const [antiTheftModalOpen, setAntiTheftModalOpen] = useState(false);
  const [batteryModalOpen, setBatteryModalOpen] = useState(false);
  const [secretCodesModalOpen, setSecretCodesModalOpen] = useState(false);
  const [lockscreenModalOpen, setLockscreenModalOpen] = useState(false);
  const [usedAuditModalOpen, setUsedAuditModalOpen] = useState(false);
  const [trackModalOpen, setTrackModalOpen] = useState(false);

  useEffect(() => {
    fetchAppConfig().then(setConfig);
    const unsub = subscribeToAppConfig(setConfig);
    return unsub;
  }, []);

  const labStatus = isLabOpenNow(config?.lab_status_override || "auto");

  const handleTabChange = (tab: MobileTab) => {
    triggerVibration(25);
    setActiveTab(tab);
  };

  return (
    <div className="md:hidden h-[100dvh] flex flex-col bg-slate-950 text-slate-100 overflow-hidden select-none">
      {/* ========================================================= */}
      {/* 1. Compact Top App Bar (Fixed 52px)                      */}
      {/* ========================================================= */}
      <header className="h-[52px] flex-none px-3 bg-slate-950/95 border-b border-slate-800/80 backdrop-blur-xl flex items-center justify-between z-40 pt-safe">
        {/* Left: Official Super Telecom Logo + Live Pulsing Dot */}
        <div className="flex items-center gap-2">
          <img
            src="/icon-192.png"
            alt="Super Telecom Official Logo"
            className="w-8 h-8 object-contain rounded-xl shadow-sm drop-shadow-md active:scale-95 transition-transform"
            onError={(e) => {
              e.currentTarget.src = "/logo.png";
            }}
          />
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
            <span className="text-[9px] text-cyan-400 font-medium tracking-tight block">
              GIRIDIH LAB &bull; CHIP REPAIR
            </span>
          </div>
        </div>

        {/* Center: App Title */}
        <div className="hidden xs:block text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
          {activeTab === "home" && "Lab Portal"}
          {activeTab === "tools" && "Diagnostics"}
          {activeTab === "track" && "Job Tracker"}
          {activeTab === "shop" && "Parts Store"}
          {activeTab === "settings" && "Settings"}
        </div>

        {/* Right: Emergency Direct-Call Icon + Native Settings Gear */}
        <div className="flex items-center gap-1.5">
          <a
            href={`tel:${PHONE}`}
            aria-label="Direct Call Engineer"
            className="h-8 w-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center active:scale-90 transition-transform"
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
      {/* 2. Scrollable App Content Container                       */}
      {/* ========================================================= */}
      <main className="flex-1 overflow-y-auto no-scrollbar native-scroll px-3 py-3 space-y-4">
        {/* ===================================================== */}
        {/* TAB 1: ⚡ LAB HOME                                    */}
        {/* ===================================================== */}
        {activeTab === "home" && (
          <div className="space-y-4 pb-20 animate-in fade-in duration-200">
            {/* Live Lab Status Banner */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/60 border border-slate-800 shadow-lg">
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
                onClick={() => setTrackModalOpen(true)}
                className="px-2.5 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold text-[10px] active:scale-95 transition-transform"
              >
                Track Repair
              </button>
            </div>

            {/* Quick 1-Tap Emergency Action Bar */}
            <div className="grid grid-cols-3 gap-2">
              <a
                href={`tel:${PHONE}`}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-emerald-400 active:scale-95 transition-all shadow-md"
              >
                <Phone className="h-5 w-5 mb-1 text-emerald-400" />
                <span className="text-[11px] font-bold text-white">Call Lab</span>
                <span className="text-[9px] text-emerald-400 font-mono">Engineer Line</span>
              </a>

              <a
                href={`https://wa.me/${WHATSAPP}?text=Hi%20Super%20Telecom,%20I%20need%20urgent%20mobile%20repair%20assistance.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-cyan-400 active:scale-95 transition-all shadow-md"
              >
                <MessageCircle className="h-5 w-5 mb-1 text-cyan-400" />
                <span className="text-[11px] font-bold text-white">WhatsApp</span>
                <span className="text-[9px] text-cyan-400 font-mono">Instant Quote</span>
              </a>

              <button
                type="button"
                onClick={() => handleTabChange("tools")}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-gradient-to-tr from-cyan-950/80 to-blue-950/80 border border-cyan-500/40 text-cyan-300 active:scale-95 transition-all shadow-md"
              >
                <Wrench className="h-5 w-5 mb-1 text-cyan-400" />
                <span className="text-[11px] font-bold text-white">Hardware Tools</span>
                <span className="text-[9px] text-cyan-400 font-mono">Free Suite</span>
              </button>
            </div>

            {/* Fast Diagnostic Shortcuts Strip */}
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1">
                  <Zap className="h-3 w-3 text-amber-400" /> Express Hardware Tests
                </span>
                <button
                  type="button"
                  onClick={() => handleTabChange("tools")}
                  className="text-[10px] text-slate-400 hover:text-white font-semibold"
                >
                  View All &rarr;
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSpeakerModalOpen(true)}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 text-center active:scale-95 transition-all"
                >
                  <Droplets className="h-4 w-4 text-cyan-400 mx-auto mb-1 animate-pulse" />
                  <span className="text-[10px] font-bold text-white block">Water Eject</span>
                  <span className="text-[8px] text-slate-500 block">165Hz Acoustic</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTouchModalOpen(true)}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 text-center active:scale-95 transition-all"
                >
                  <Smartphone className="h-4 w-4 text-emerald-400 mx-auto mb-1" />
                  <span className="text-[10px] font-bold text-white block">Touch Test</span>
                  <span className="text-[8px] text-slate-500 block">Digitizer Grid</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAntiTheftModalOpen(true)}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-rose-500/40 text-center active:scale-95 transition-all"
                >
                  <ShieldAlert className="h-4 w-4 text-rose-400 mx-auto mb-1" />
                  <span className="text-[10px] font-bold text-white block">Anti-Theft</span>
                  <span className="text-[8px] text-slate-500 block">Unplug Siren</span>
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
                  className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 active:scale-95 transition-all shadow-sm space-y-1"
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
                  className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 active:scale-95 transition-all shadow-sm space-y-1"
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
                  className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 active:scale-95 transition-all shadow-sm space-y-1"
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
                  className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 active:scale-95 transition-all shadow-sm space-y-1"
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
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-cyan-400" /> Instant Repair Estimator
                </span>
                <span className="text-[9px] font-mono text-cyan-400 uppercase">Live Pricing</span>
              </div>
              <RepairEstimator />
            </div>

            {/* Lab Trust Card & Rating */}
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 text-center">
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
        {/* TAB 2: 🧰 HARDWARE TOOLS                               */}
        {/* ===================================================== */}
        {activeTab === "tools" && (
          <div className="space-y-3 pb-20 animate-in fade-in duration-200">
            <div className="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-center gap-2.5">
              <Wrench className="h-5 w-5 text-cyan-400 shrink-0" />
              <div>
                <h3 className="text-xs font-bold text-white">Hardware Diagnostic Suite</h3>
                <p className="text-[10px] text-cyan-300">
                  Direct browser hardware tests with native Audio, WakeLock &amp; Haptic APIs.
                </p>
              </div>
            </div>

            {/* Tools Grid */}
            <div className="space-y-2.5">
              {/* 1. Speaker Ejector */}
              <div
                onClick={() => setSpeakerModalOpen(true)}
                className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 active:scale-98 transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    <Droplets className="h-5 w-5 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white">Sonic Speaker Ejector</span>
                      <span className="text-[9px] font-mono text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded-full border border-cyan-800">
                        165Hz
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Clears trapped moisture &amp; dust via ultrasonic resonance
                    </span>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-cyan-400 shrink-0" />
              </div>

              {/* 2. Touch & Dead Pixel */}
              <div
                onClick={() => setTouchModalOpen(true)}
                className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 active:scale-98 transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    <Smartphone className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white">Touch Matrix &amp; Pixel Test</span>
                      <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded-full border border-emerald-800">
                        WakeLock
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      126-tile digitizer sweep &amp; RGB dead sub-pixel cycle
                    </span>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-emerald-400 shrink-0" />
              </div>

              {/* 3. Anti-Theft Siren */}
              <div
                onClick={() => setAntiTheftModalOpen(true)}
                className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-rose-500/40 active:scale-98 transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30">
                    <ShieldAlert className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white">Anti-Theft Unplug Siren</span>
                      <span className="text-[9px] font-mono text-rose-400 bg-rose-950 px-1.5 py-0.5 rounded-full border border-rose-800">
                        Sensors
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Loud emergency alarm if unplugged or moved
                    </span>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-rose-400 shrink-0" />
              </div>

              {/* 4. Smart Battery Guard */}
              <div
                onClick={() => setBatteryModalOpen(true)}
                className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 active:scale-98 transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    <BatteryCharging className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white">Battery Guard 85%</span>
                      <span className="text-[9px] font-mono text-amber-400 bg-amber-950 px-1.5 py-0.5 rounded-full border border-amber-800">
                        Battery API
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Overcharge alarm to extend lithium cell lifespan
                    </span>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-amber-400 shrink-0" />
              </div>

              {/* 5. Secret Hardware Codes */}
              <div
                onClick={() => setSecretCodesModalOpen(true)}
                className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 active:scale-98 transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    <Hash className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white">Secret Hardware Dial Codes</span>
                      <span className="text-[9px] font-mono text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded-full border border-cyan-800">
                        All Brands
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Engineering test menus for Samsung, Apple, OnePlus &amp; Xiaomi
                    </span>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-cyan-400 shrink-0" />
              </div>

              {/* 6. Emergency Lockscreen Wallpaper */}
              <div
                onClick={() => setLockscreenModalOpen(true)}
                className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-rose-500/40 active:scale-98 transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30">
                    <HeartPulse className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white">Emergency ICE Wallpaper</span>
                      <span className="text-[9px] font-mono text-rose-400 bg-rose-950 px-1.5 py-0.5 rounded-full border border-rose-800">
                        AMOLED
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Pure-black wallpaper with owner contact for lost phone recovery
                    </span>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-rose-400 shrink-0" />
              </div>

              {/* 7. Used Phone Audit */}
              <div
                onClick={() => setUsedAuditModalOpen(true)}
                className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 active:scale-98 transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    <CheckSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white">Used Phone Inspection Audit</span>
                      <span className="text-[9px] font-mono text-amber-400 bg-amber-950 px-1.5 py-0.5 rounded-full border border-amber-800">
                        12-Point
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      IMEI, TrueTone, and motherboard checklist before buying
                    </span>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-amber-400 shrink-0" />
              </div>
            </div>
          </div>
        )}

        {/* ===================================================== */}
        {/* TAB 3: 🔍 TRACK JOB SHEET                             */}
        {/* ===================================================== */}
        {activeTab === "track" && (
          <div className="space-y-4 pb-20 animate-in fade-in duration-200">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Live Job Sheet Tracking</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Enter your Super Telecom Job Sheet number (e.g. <strong>ST-1082</strong>) or registered phone number to check stage in our Barganda Road Lab.
              </p>
              <button
                type="button"
                onClick={() => setTrackModalOpen(true)}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 active:scale-95 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
              >
                <Search className="h-4 w-4" />
                <span>Search Job Sheet Database</span>
              </button>
            </div>

            {/* Stages overview */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                Lab Repair Pipeline
              </span>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="h-6 w-6 rounded-lg bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-xs">1</span>
                  <div>
                    <span className="font-bold text-white block">Device Received</span>
                    <span className="text-[10px] text-slate-400">Barcode tag applied &amp; initial physical inspection</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="h-6 w-6 rounded-lg bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-xs">2</span>
                  <div>
                    <span className="font-bold text-white block">Under Microscope Diagnostics</span>
                    <span className="text-[10px] text-slate-400">IC micro-soldering &amp; board voltage checks</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="h-6 w-6 rounded-lg bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs">3</span>
                  <div>
                    <span className="font-bold text-white block">QC Testing &amp; Seal</span>
                    <span className="text-[10px] text-slate-400">Digitizer, camera &amp; battery drain verification</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-950 border border-slate-800">
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
                  className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between shadow-sm space-y-2"
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
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400">{item.price}</span>
                    <a
                      href={`https://wa.me/${WHATSAPP}?text=Hi%20Super%20Telecom,%20I%20want%20to%20order%20or%20inquire%20about:%20${encodeURIComponent(
                        item.title
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-[10px] font-bold active:scale-95"
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
      {/* 3. Tactile Bottom Navigation (Fixed 62px)                 */}
      {/* ========================================================= */}
      <nav
        aria-label="Native Mobile Navigation Bar"
        className="h-[62px] flex-none bg-slate-950/95 border-t border-slate-800/80 backdrop-blur-xl px-2 flex items-center justify-around z-40 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(0,0,0,0.8)]"
      >
        {/* 1. Lab Home */}
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
          <span className="text-[10px] font-semibold tracking-tight mt-0.5">Lab Home</span>
        </button>

        {/* 2. Hardware Tools */}
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
          <span className="text-[10px] font-semibold tracking-tight mt-0.5">Tools</span>
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
            <span className="text-[10px] font-semibold tracking-tight mt-0.5">Shop</span>
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
      {/* 4. Native Tool Modals                                     */}
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
