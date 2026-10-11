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
  Award,
  Download,
} from "lucide-react";
import { useHardwarePermissions } from "@/hooks/useHardwarePermissions";
import { useTheme } from "@/context/ThemeContext";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { useIsStandalone } from "@/hooks/useIsStandalone";
import { SmartAppInstallBanner } from "@/components/common/SmartAppInstallBanner";
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
import { DeadPixelTestModal } from "@/components/tools/DeadPixelTestModal";
import { MultiTouchTesterModal } from "@/components/tools/MultiTouchTesterModal";
import { BurnInHealerModal } from "@/components/tools/BurnInHealerModal";
import { GyroCompassModal } from "@/components/tools/GyroCompassModal";
import { TorchControllerModal } from "@/components/tools/TorchControllerModal";
import { AmbientLightTestModal } from "@/components/tools/AmbientLightTestModal";
import { ImeiValidatorModal } from "@/components/tools/ImeiValidatorModal";
import { TOOLS, type ToolId, type ToolCategory } from "@/components/tools/LabToolsHub";
import { RepairTrackerModal } from "@/components/repair/RepairTrackerModal";
import { SettingsView } from "@/components/settings/SettingsView";
import { RepairEstimator } from "@/components/interactive/RepairEstimator";
import { MasterScanHeroCard } from "@/components/scanner/MasterScanHeroCard";
import { DeepScanEngine } from "@/components/scanner/DeepScanEngine";
import { DualMasterActions } from "@/components/dashboard/DualMasterActions";
import { TurboCleanModal } from "@/components/dashboard/TurboCleanModal";
import { DoctorDiagnosticModal } from "@/components/dashboard/DoctorDiagnosticModal";
import { useLauncher } from "@/context/LauncherContext";
import { CyberOSDesktop } from "@/components/cyber-os/CyberOSDesktop";
import { useGamingMode } from "@/context/GamingModeContext";
import { GamingConsoleWorkspace } from "@/components/gaming/GamingConsoleWorkspace";

export type MobileTab = "home" | "tools" | "track" | "shop" | "settings";

const PHONE = "+918002903643";
const WHATSAPP = "918002903643";

interface MobileAppShellProps {
  initialTab?: MobileTab;
  initialTool?: ToolId | null;
  initialAction?: string | null;
}

export const MobileAppShell: React.FC<MobileAppShellProps> = ({
  initialTab = "home",
  initialTool = null,
  initialAction = null,
}) => {
  const [activeTab, setActiveTab] = useState<MobileTab>(initialTab);
  const [config, setConfig] = useState<AppConfig>(DEFAULT_APP_CONFIG);
  const [isOffline, setIsOffline] = useState(false);
  const { triggerVibration } = useHardwarePermissions();
  const { isDark } = useTheme();
  const { user, isVip, openVipModal } = useCustomerAuth();
  const { isCyberOsActive } = useLauncher();
  const { isGamingModeActive } = useGamingMode();
  const isStandalone = useIsStandalone();

  const customerDisplayName =
    (user as any)?.name ||
    (user as any)?.user_metadata?.full_name ||
    (user as any)?.email?.split("@")[0] ||
    "VIP";
  const customerAvatarUrl =
    (user as any)?.avatarUrl ||
    (user as any)?.user_metadata?.avatar_url ||
    null;

  // Active Tool Modal & Filters
  const [activeToolModal, setActiveToolModal] = useState<ToolId | null>(initialTool);
  const [trackModalOpen, setTrackModalOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(initialAction === "scan");
  const [cleanModalOpen, setCleanModalOpen] = useState(initialAction === "clean");
  const [doctorModalOpen, setDoctorModalOpen] = useState(
    initialAction === "doctor" || initialAction === "ampere"
  );
  const [toolsSearch, setToolsSearch] = useState("");
  const [toolsCategory, setToolsCategory] = useState<ToolCategory>("all");

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

  // Handle URL query parameters (e.g. ?action=scan, ?action=clean, ?action=doctor, ?tool=speaker, ?tab=tools)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const action = params.get("action");
      if (action === "scan") {
        setScannerOpen(true);
      } else if (action === "clean") {
        setCleanModalOpen(true);
      } else if (action === "doctor" || action === "ampere") {
        setDoctorModalOpen(true);
      }
      const t = params.get("tool");
      if (t) {
        if (t === "speaker" || t === "speaker_cleaner") {
          setActiveToolModal("speaker_cleaner");
        } else {
          const matched = TOOLS.find((tool) => tool.id === t);
          if (matched) setActiveToolModal(matched.id);
        }
      }
      const tab = params.get("tab") as MobileTab | null;
      if (tab && ["home", "tools", "track", "shop", "settings"].includes(tab)) {
        setActiveTab(tab);
      }
    }
  }, []);

  const labStatus = isLabOpenNow(config?.lab_status_override || "auto");

  const handleTabChange = (tab: MobileTab) => {
    triggerVibration(15);
    setActiveTab(tab);
  };

  const openToolWithHaptic = (toolId: ToolId) => {
    triggerVibration(15);
    setActiveToolModal(toolId);
  };

  const openTrackModalWithHaptic = () => {
    triggerVibration(15);
    setTrackModalOpen(true);
  };

  const toolCategories: { key: ToolCategory; label: string }[] = [
    { key: "all", label: "All Tools" },
    { key: "audio", label: "Audio & Haptics" },
    { key: "screen", label: "Display & Screen" },
    { key: "sensors", label: "Sensors & Torch" },
    { key: "system", label: "Battery & System" },
  ];

  const filteredTools = TOOLS.filter((tool) => {
    if (tool.configKey && config && config[tool.configKey] === false) {
      return false;
    }
    if (toolsCategory !== "all" && tool.category !== toolsCategory) {
      return false;
    }
    if (toolsSearch.trim()) {
      const q = toolsSearch.toLowerCase();
      return (
        tool.title.toLowerCase().includes(q) ||
        tool.subtitle.toLowerCase().includes(q) ||
        tool.tag.toLowerCase().includes(q)
      );
    }
    return true;
  });

  if (isGamingModeActive) {
    return (
      <div className="md:hidden">
        <GamingConsoleWorkspace />
      </div>
    );
  }

  if (isCyberOsActive) {
    return (
      <div className="md:hidden">
        <CyberOSDesktop />
      </div>
    );
  }

  return (
    <div className="md:hidden h-[100dvh] flex flex-col bg-[#f8fafc] dark:bg-[#02040a] text-slate-900 dark:text-slate-100 overflow-hidden select-none relative transition-colors duration-200">
      {/* Background Cyber Ambient Spots in dark mode */}
      <div className="hidden dark:block absolute top-0 left-1/4 w-80 h-80 bg-cyan-500/[0.04] rounded-full blur-3xl pointer-events-none" />
      <div className="hidden dark:block absolute bottom-1/4 right-0 w-80 h-80 bg-emerald-500/[0.03] rounded-full blur-3xl pointer-events-none" />

      {/* ========================================================= */}
      {/* 1. Offline Mode Indicator Micro-Pill                      */}
      {/* ========================================================= */}
      {isOffline && (
        <div className="w-full bg-cyan-100 dark:bg-cyan-950/95 border-b border-cyan-300 dark:border-cyan-500/40 py-1 px-3 flex items-center justify-center gap-2 z-50 animate-in fade-in">
          <WifiOff className="h-3 w-3 text-cyan-700 dark:text-cyan-400 shrink-0" />
          <span className="text-[10px] font-mono text-cyan-900 dark:text-cyan-200 font-bold tracking-tight">
            ⚡ Offline Mode Active &bull; All 10+ Hardware Tools Ready
          </span>
        </div>
      )}

      {/* Dynamic Smart Install / Download CTA for Mobile Browsers */}
      <SmartAppInstallBanner />

      {/* ========================================================= */}
      {/* 2. Compact Top App Bar (Fixed 52px)                      */}
      {/* ========================================================= */}
      <header className="h-[52px] flex-none px-3 bg-white/95 dark:bg-[#030712]/95 border-b border-slate-200 dark:border-slate-800/80 backdrop-blur-2xl flex items-center justify-between z-40 pt-safe">
        {/* Left: Official Super Telecom Logo */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <img
              src="/icon-192.png"
              alt="Super Telecom Official Logo"
              className="w-8 h-8 object-contain rounded-xl shadow-xs border border-slate-200 dark:border-cyan-500/20 bg-slate-50 dark:bg-slate-900 active:scale-95 transition-transform"
              onError={(e) => {
                e.currentTarget.src = "/logo.png";
              }}
            />
          </div>
          <div className="leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-slate-900 dark:text-white tracking-tight">
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
            <span className="text-[9px] text-cyan-700 dark:text-cyan-400 font-mono font-medium tracking-tight block">
              CYBER-LAB &bull; CHIP REPAIR
            </span>
          </div>
        </div>

        {/* Center: Micro Tab Label */}
        <div className="hidden xs:block text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest font-semibold">
          {activeTab === "home" && "Dashboard"}
          {activeTab === "tools" && "Cyber Suite"}
          {activeTab === "track" && "Live Pipeline"}
          {activeTab === "shop" && "Parts Matrix"}
          {activeTab === "settings" && "Config"}
        </div>

        {/* Right: VIP Account / Google Auth Pill + Emergency Direct-Call Icon + Native Settings Gear */}
        <div className="flex items-center gap-1.5">
          {!isStandalone && (
            <Link
              to="/download"
              onClick={() => triggerVibration(15)}
              aria-label="Install Super Telecom App"
              className="h-8 px-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-500 dark:to-blue-500 hover:from-cyan-500 hover:to-blue-400 text-white dark:text-slate-950 font-bold text-[10px] font-mono flex items-center gap-1 active:scale-90 transition-all shadow-xs whitespace-nowrap"
            >
              <Download className="h-3.5 w-3.5" />
              <span>App</span>
            </Link>
          )}

          <button
            type="button"
            onClick={() => {
              triggerVibration(15);
              openVipModal();
            }}
            aria-label={isVip ? "View VIP Account" : "1-Click VIP Google Login"}
            className={`h-8 px-2 rounded-xl border flex items-center gap-1.5 active:scale-90 transition-all ${
              isVip
                ? "bg-amber-100 dark:bg-amber-950/80 border-amber-300 dark:border-amber-500/40 text-amber-800 dark:text-amber-400 font-bold shadow-xs"
                : "bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {isVip && customerAvatarUrl ? (
              <img
                src={customerAvatarUrl}
                alt={customerDisplayName}
                className="w-4 h-4 rounded-full object-cover border border-amber-400"
              />
            ) : isVip ? (
              <Award className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            ) : (
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span className="text-[10px] font-mono font-bold whitespace-nowrap">
              {isVip ? "VIP ⚡" : "Sign In"}
            </span>
          </button>

          <a
            href={`tel:${PHONE}`}
            onClick={() => triggerVibration(15)}
            aria-label="Direct Call Engineer"
            className="h-8 w-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 flex items-center justify-center active:scale-90 transition-transform shadow-xs"
          >
            <Phone className="h-4 w-4" />
          </a>
          <button
            type="button"
            onClick={() => handleTabChange("settings")}
            aria-label="Open Settings"
            className={`h-8 w-8 rounded-xl border flex items-center justify-center active:scale-90 transition-transform ${
              activeTab === "settings"
                ? "bg-cyan-600 dark:bg-cyan-500 text-white dark:text-slate-950 border-cyan-600 dark:border-cyan-400 shadow-md shadow-cyan-500/30"
                : "bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 3. Dynamic Quick-Action Carousel (Horizontal Pills)      */}
      {/* ========================================================= */}
      <div className="flex-none bg-white/90 dark:bg-[#030712]/90 border-b border-slate-200 dark:border-slate-800/80 px-3 py-1.5 overflow-x-auto no-scrollbar flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => handleTabChange("tools")}
          className="px-2.5 py-1 rounded-full bg-cyan-100 dark:bg-cyan-950/80 border border-cyan-300 dark:border-cyan-500/40 text-cyan-800 dark:text-cyan-300 text-[10px] font-mono font-bold flex items-center gap-1 whitespace-nowrap active:scale-95 transition-transform"
        >
          <Wrench className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
          <span>🧰 Free Tools</span>
        </button>

        <button
          type="button"
          onClick={() => openToolWithHaptic("water_wizard")}
          className="px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-500/40 text-rose-800 dark:text-rose-300 text-[10px] font-mono font-bold flex items-center gap-1 whitespace-nowrap active:scale-95 transition-transform"
        >
          <LifeBuoy className="h-3 w-3 text-rose-600 dark:text-rose-400" />
          <span>💧 Water Rescue</span>
        </button>

        <Link
          to="/services/screen-replacement"
          onClick={() => triggerVibration(15)}
          className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 text-slate-700 dark:text-slate-300 text-[10px] font-mono font-bold flex items-center gap-1 whitespace-nowrap active:scale-95 transition-transform"
        >
          <Smartphone className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
          <span>📱 Screen Price</span>
        </Link>

        <Link
          to="/services/motherboard-repair"
          onClick={() => triggerVibration(15)}
          className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/40 text-slate-700 dark:text-slate-300 text-[10px] font-mono font-bold flex items-center gap-1 whitespace-nowrap active:scale-95 transition-transform"
        >
          <Cpu className="h-3 w-3 text-amber-600 dark:text-amber-400" />
          <span>🔬 Motherboard/IC</span>
        </Link>

        <Link
          to="/services/battery-replacement"
          onClick={() => triggerVibration(15)}
          className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 text-slate-700 dark:text-slate-300 text-[10px] font-mono font-bold flex items-center gap-1 whitespace-nowrap active:scale-95 transition-transform"
        >
          <BatteryCharging className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
          <span>⚡ Battery Swap</span>
        </Link>

        <Link
          to="/services"
          onClick={() => triggerVibration(15)}
          className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-mono font-bold flex items-center gap-1 whitespace-nowrap active:scale-95 transition-transform"
        >
          <ShieldCheck className="h-3 w-3 text-purple-600 dark:text-purple-400" />
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
            {/* FRONT HERO DASHBOARD: DUAL MASTER ACTION BUTTONS */}
            <DualMasterActions
              onOpenClean={() => setCleanModalOpen(true)}
              onOpenDoctor={() => setDoctorModalOpen(true)}
              className="px-0 pt-0 pb-1"
            />

            {/* 360° Hardware Shield Master Scanner Hero Card */}
            <MasterScanHeroCard onOpenScanner={() => setScannerOpen(true)} />

            {/* Live Lab Status Banner */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-slate-900/60 backdrop-blur-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm dark:shadow-xl dark:shadow-black/40">
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
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    {labStatus.isOpen ? "Barganda Road Lab Open" : "Lab Currently Closed"}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    {labStatus.subText}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={openTrackModalWithHaptic}
                className="px-2.5 py-1 rounded-xl bg-cyan-100 dark:bg-cyan-500/10 border border-cyan-300 dark:border-cyan-500/30 text-cyan-800 dark:text-cyan-300 font-bold text-[10px] active:scale-95 transition-transform"
              >
                Track Repair
              </button>
            </div>

            {/* Quick 1-Tap Emergency Action Bar */}
            <div className="grid grid-cols-3 gap-2">
              <a
                href={`tel:${PHONE}`}
                onClick={() => triggerVibration(15)}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-slate-900/60 backdrop-blur-2xl border border-slate-200 dark:border-slate-800/80 hover:border-emerald-500/40 text-emerald-700 dark:text-emerald-400 active:scale-95 transition-all shadow-sm dark:shadow-md dark:shadow-black/40"
              >
                <Phone className="h-5 w-5 mb-1 text-emerald-600 dark:text-emerald-400" />
                <span className="text-[11px] font-bold text-slate-900 dark:text-white">Call Lab</span>
                <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-mono">Direct Line</span>
              </a>

              <a
                href={`https://wa.me/${WHATSAPP}?text=Hi%20Super%20Telecom,%20I%20need%20urgent%20mobile%20repair%20assistance.`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => triggerVibration(15)}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-slate-900/60 backdrop-blur-2xl border border-slate-200 dark:border-slate-800/80 hover:border-cyan-500/40 text-cyan-700 dark:text-cyan-400 active:scale-95 transition-all shadow-sm dark:shadow-md dark:shadow-black/40"
              >
                <MessageCircle className="h-5 w-5 mb-1 text-cyan-600 dark:text-cyan-400" />
                <span className="text-[11px] font-bold text-slate-900 dark:text-white">WhatsApp</span>
                <span className="text-[9px] text-cyan-600 dark:text-cyan-400 font-mono">Instant Quote</span>
              </a>

              <button
                type="button"
                onClick={() => handleTabChange("tools")}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-cyan-50 dark:bg-gradient-to-tr dark:from-cyan-950/80 dark:to-blue-950/80 border border-cyan-200 dark:border-cyan-500/40 text-cyan-800 dark:text-cyan-300 active:scale-95 transition-all shadow-sm dark:shadow-md dark:shadow-black/40"
              >
                <Wrench className="h-5 w-5 mb-1 text-cyan-600 dark:text-cyan-400" />
                <span className="text-[11px] font-bold text-slate-900 dark:text-white">16+ Tools</span>
                <span className="text-[9px] text-cyan-600 dark:text-cyan-400 font-mono">Offline Suite</span>
              </button>
            </div>

            {/* Fast Diagnostic Shortcuts Strip */}
            <div className="rounded-2xl bg-white dark:bg-slate-900/60 backdrop-blur-2xl border border-slate-200 dark:border-slate-800/80 p-3 space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-700 dark:text-cyan-400 font-bold flex items-center gap-1">
                  <Zap className="h-3 w-3 text-amber-500 dark:text-amber-400" /> Express Hardware Tests
                </span>
                <button
                  type="button"
                  onClick={() => handleTabChange("tools")}
                  className="text-[10px] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-semibold"
                >
                  View All (16+) &rarr;
                </button>
              </div>

              <div className="grid grid-cols-4 gap-1.5">
                <button
                  type="button"
                  onClick={() => openToolWithHaptic("speaker_cleaner")}
                  className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 text-center active:scale-95 transition-all"
                >
                  <Droplets className="h-4 w-4 text-cyan-600 dark:text-cyan-400 mx-auto mb-1 animate-pulse" />
                  <span className="text-[9px] font-bold text-slate-900 dark:text-white block">165Hz</span>
                  <span className="text-[8px] text-slate-500 block">Ejector</span>
                </button>

                <button
                  type="button"
                  onClick={() => openToolWithHaptic("touch_test")}
                  className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 text-center active:scale-95 transition-all"
                >
                  <Smartphone className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mx-auto mb-1" />
                  <span className="text-[9px] font-bold text-slate-900 dark:text-white block">Touch</span>
                  <span className="text-[8px] text-slate-500 block">Matrix</span>
                </button>

                <button
                  type="button"
                  onClick={() => openToolWithHaptic("fps_meter")}
                  className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 hover:border-purple-500/40 text-center active:scale-95 transition-all"
                >
                  <Gauge className="h-4 w-4 text-purple-600 dark:text-purple-400 mx-auto mb-1" />
                  <span className="text-[9px] font-bold text-slate-900 dark:text-white block">FPS Rate</span>
                  <span className="text-[8px] text-slate-500 block">120Hz Test</span>
                </button>

                <button
                  type="button"
                  onClick={() => openToolWithHaptic("audio_test")}
                  className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 hover:border-amber-500/40 text-center active:scale-95 transition-all"
                >
                  <Mic className="h-4 w-4 text-amber-600 dark:text-amber-400 mx-auto mb-1" />
                  <span className="text-[9px] font-bold text-slate-900 dark:text-white block">Mic Test</span>
                  <span className="text-[8px] text-slate-500 block">Loopback</span>
                </button>
              </div>
            </div>

            {/* 2-Column Express Repair Silos */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold block">
                Lab Repair Services (Giridih)
              </span>

              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/services/screen-replacement"
                  onClick={() => triggerVibration(15)}
                  className="p-3 rounded-2xl bg-white dark:bg-slate-900/60 backdrop-blur-2xl border border-slate-200 dark:border-slate-800/80 hover:border-cyan-500/40 active:scale-95 transition-all shadow-sm space-y-1"
                >
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 w-fit">
                    <Smartphone className="h-4 w-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Screen &amp; OLED Glass</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                    Same-day OCA glass lamination &amp; original display.
                  </p>
                  <span className="text-[10px] font-mono font-bold text-cyan-700 dark:text-cyan-400 block pt-1">
                    Starts ₹899 &bull; 45 Mins
                  </span>
                </Link>

                <Link
                  to="/services/iphone-repair"
                  onClick={() => triggerVibration(15)}
                  className="p-3 rounded-2xl bg-white dark:bg-slate-900/60 backdrop-blur-2xl border border-slate-200 dark:border-slate-800/80 hover:border-cyan-500/40 active:scale-95 transition-all shadow-sm space-y-1"
                >
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 w-fit">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">iPhone Lab Care</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                    FaceID, battery health % bypass, rear glass laser fix.
                  </p>
                  <span className="text-[10px] font-mono font-bold text-cyan-700 dark:text-cyan-400 block pt-1">
                    Certified Lab &bull; Warranty
                  </span>
                </Link>

                <Link
                  to="/services/motherboard-repair"
                  onClick={() => triggerVibration(15)}
                  className="p-3 rounded-2xl bg-white dark:bg-slate-900/60 backdrop-blur-2xl border border-slate-200 dark:border-slate-800/80 hover:border-cyan-500/40 active:scale-95 transition-all shadow-sm space-y-1"
                >
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 w-fit">
                    <Cpu className="h-4 w-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Motherboard IC Micro-Solder</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                    Dead phone revival, charging IC, power audio IC.
                  </p>
                  <span className="text-[10px] font-mono font-bold text-cyan-700 dark:text-cyan-400 block pt-1">
                    Microscope BGA &bull; 90D Wty
                  </span>
                </Link>

                <Link
                  to="/services/battery-replacement"
                  onClick={() => triggerVibration(15)}
                  className="p-3 rounded-2xl bg-white dark:bg-slate-900/60 backdrop-blur-2xl border border-slate-200 dark:border-slate-800/80 hover:border-cyan-500/40 active:scale-95 transition-all shadow-sm space-y-1"
                >
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 w-fit">
                    <BatteryCharging className="h-4 w-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Battery &amp; Charging Port</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                    Original capacity high-grade lithium cells &amp; Type-C ports.
                  </p>
                  <span className="text-[10px] font-mono font-bold text-cyan-700 dark:text-cyan-400 block pt-1">
                    30 Min Swap &bull; 6M Wty
                  </span>
                </Link>
              </div>
            </div>

            {/* Price Estimator Compact Card */}
            <div className="rounded-2xl bg-white dark:bg-slate-900/60 backdrop-blur-2xl border border-slate-200 dark:border-slate-800/80 p-3.5 space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" /> Instant Repair Estimator
                </span>
                <span className="text-[9px] font-mono text-cyan-700 dark:text-cyan-400 uppercase font-bold">Live Pricing</span>
              </div>
              <RepairEstimator />
            </div>

            {/* Lab Trust Card & Rating */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 space-y-2 text-center shadow-sm">
              <div className="flex items-center justify-center gap-1 text-amber-500 dark:text-amber-400 text-xs">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
                <span className="font-bold text-slate-900 dark:text-white ml-1 text-xs">4.9 / 5.0</span>
              </div>
              <p className="text-[11px] text-slate-700 dark:text-slate-300">
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
        {/* ===================================================== */}
        {/* TAB 2: 🧰 CYBER-LAB TOOLS (16+ UTILITIES GRID)        */}
        {/* ===================================================== */}
        {activeTab === "tools" && (
          <div className="space-y-3 pb-24 animate-in fade-in duration-200">
            {/* Header Badge */}
            <div className="p-3 rounded-2xl bg-cyan-100 dark:bg-cyan-950/40 border border-cyan-300 dark:border-cyan-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Wrench className="h-5 w-5 text-cyan-700 dark:text-cyan-400 shrink-0" />
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">Cyber-Lab Diagnostic Suite</h3>
                  <p className="text-[10px] text-cyan-800 dark:text-cyan-300">
                    100% Client-side &bull; Zero Data Required &bull; Native Web APIs
                  </p>
                </div>
              </div>
              <span className="text-[9px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                {filteredTools.length} Utilities
              </span>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={toolsSearch}
                onChange={(e) => setToolsSearch(e.target.value)}
                placeholder="Search hardware tool (e.g. mic, screen, battery, imei)..."
                className="w-full pl-9 pr-8 py-2 text-xs bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              {toolsSearch && (
                <button
                  type="button"
                  onClick={() => setToolsSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs p-1"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Horizontal Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {toolCategories.map((cat) => {
                const isSelected = toolsCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => {
                      triggerVibration(10);
                      setToolsCategory(cat.key);
                    }}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-medium whitespace-nowrap transition-all active:scale-95 cursor-pointer ${
                      isSelected
                        ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                        : "bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* 2-Column Compact Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {filteredTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <div
                    key={tool.id}
                    onClick={() => openToolWithHaptic(tool.id)}
                    className="p-3 rounded-2xl bg-white dark:bg-slate-900/60 backdrop-blur-2xl border border-slate-200 dark:border-slate-800/80 hover:border-cyan-500/40 active:scale-95 transition-all cursor-pointer flex flex-col justify-between shadow-sm dark:shadow-md space-y-2"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded-full border ${tool.badgeColor}`}>
                          {tool.tag}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1.5 line-clamp-1">
                        {tool.title}
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5 line-clamp-2">
                        {tool.subtitle}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-cyan-700 dark:text-cyan-400 flex items-center gap-1 pt-1">
                      Launch &rarr;
                    </span>
                  </div>
                );
              })}
            </div>

            {filteredTools.length === 0 && (
              <div className="text-center py-10 space-y-2">
                <Wrench className="h-8 w-8 text-slate-400 mx-auto opacity-50" />
                <p className="text-xs font-semibold text-slate-500">No hardware tools matched your filter</p>
                <button
                  type="button"
                  onClick={() => {
                    setToolsSearch("");
                    setToolsCategory("all");
                  }}
                  className="text-xs text-cyan-600 dark:text-cyan-400 font-bold underline"
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* ===================================================== */}
        {/* TAB 3: 🔍 TRACK JOB SHEET                             */}
        {/* ===================================================== */}
        {activeTab === "track" && (
          <div className="space-y-4 pb-20 animate-in fade-in duration-200">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 backdrop-blur-2xl border border-slate-200 dark:border-slate-800/80 space-y-3 shadow-sm dark:shadow-md">
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Live Job Sheet Pipeline</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Enter your Super Telecom Job Sheet number (e.g. <strong>ST-1082</strong>) or registered phone number to check stage in our Barganda Road Lab.
              </p>
              <button
                type="button"
                onClick={openTrackModalWithHaptic}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 active:scale-95 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                <Search className="h-4 w-4" />
                <span>Search Job Sheet Database</span>
              </button>
            </div>

            {/* Stages overview */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 space-y-3 shadow-sm">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold block">
                Lab Repair Pipeline
              </span>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
                  <span className="h-6 w-6 rounded-lg bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center text-xs">1</span>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">Device Received</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Barcode tag applied &amp; initial physical inspection</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
                  <span className="h-6 w-6 rounded-lg bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-bold flex items-center justify-center text-xs">2</span>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">Under Microscope Diagnostics</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">IC micro-soldering &amp; board voltage checks</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
                  <span className="h-6 w-6 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold flex items-center justify-center text-xs">3</span>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">QC Testing &amp; Seal</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Digitizer, camera &amp; battery drain verification</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
                  <span className="h-6 w-6 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center text-xs">4</span>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">Ready for Handover</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Warranty invoice generated for pickup</span>
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
            <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">Original Parts &amp; Accessories</h3>
                  <span className="text-[10px] text-emerald-800 dark:text-emerald-300">Barganda Road In-Stock Inventory</span>
                </div>
              </div>
              <span className="text-[9px] font-mono text-emerald-800 dark:text-emerald-400 bg-emerald-200 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
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
                  className="p-3 rounded-2xl bg-white dark:bg-slate-900/60 backdrop-blur-2xl border border-slate-200 dark:border-slate-800/80 flex flex-col justify-between shadow-sm space-y-2"
                >
                  <div>
                    <span className="text-[8px] font-mono uppercase tracking-wider text-cyan-800 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-950/60 px-1.5 py-0.5 rounded-full border border-cyan-200 dark:border-cyan-800/40">
                      {item.tag}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1.5">{item.title}</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">{item.price}</span>
                    <a
                      href={`https://wa.me/${WHATSAPP}?text=Hi%20Super%20Telecom,%20I%20want%20to%20order%20or%20inquire%20about:%20${encodeURIComponent(
                        item.title
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => triggerVibration(15)}
                      className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold active:scale-95 transition-transform"
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
        className="h-[62px] flex-none bg-white/95 dark:bg-[#030712]/95 border-t border-slate-200 dark:border-slate-800/80 backdrop-blur-2xl px-2 flex items-center justify-around z-40 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-lg dark:shadow-[0_-8px_30px_rgba(0,0,0,0.8)]"
      >
        {/* 1. Dashboard */}
        <button
          type="button"
          onClick={() => handleTabChange("home")}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all active:scale-90 ${
            activeTab === "home" ? "text-cyan-600 dark:text-cyan-400" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
        >
          <div className="relative">
            <Home className="h-5 w-5" />
            {activeTab === "home" && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan-600 dark:bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
            )}
          </div>
          <span className="text-[10px] font-semibold tracking-tight mt-0.5">Dashboard</span>
        </button>

        {/* 2. Lab Tools */}
        <button
          type="button"
          onClick={() => handleTabChange("tools")}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all active:scale-90 ${
            activeTab === "tools" ? "text-cyan-600 dark:text-cyan-400" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
        >
          <div className="relative">
            <Wrench className="h-5 w-5" />
            {activeTab === "tools" && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan-600 dark:bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
            )}
          </div>
          <span className="text-[10px] font-semibold tracking-tight mt-0.5">Lab Tools</span>
        </button>

        {/* 3. Track */}
        <button
          type="button"
          onClick={() => handleTabChange("track")}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all active:scale-90 ${
            activeTab === "track" ? "text-amber-600 dark:text-amber-400" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
        >
          <div className="relative">
            <Search className="h-5 w-5" />
            {activeTab === "track" && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400 shadow-[0_0_8px_#fbbf24]" />
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
              activeTab === "shop" ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <div className="relative">
              <ShoppingBag className="h-5 w-5" />
              {activeTab === "shop" && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 shadow-[0_0_8px_#34d399]" />
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
            activeTab === "settings" ? "text-cyan-600 dark:text-cyan-400" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
        >
          <div className="relative">
            <Settings className="h-5 w-5" />
            {activeTab === "settings" && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan-600 dark:bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
            )}
          </div>
          <span className="text-[10px] font-semibold tracking-tight mt-0.5">Settings</span>
        </button>
      </nav>

      {/* ========================================================= */}
      {/* 6. Native Tool Modals                                     */}
      {/* ========================================================= */}
      <SpeakerCleanerModal
        isOpen={activeToolModal === "speaker_cleaner"}
        onClose={() => setActiveToolModal(null)}
      />

      <AudioHardwareTestModal
        isOpen={activeToolModal === "audio_test"}
        onClose={() => setActiveToolModal(null)}
      />

      <VibrationTesterModal
        isOpen={activeToolModal === "vibration_test"}
        onClose={() => setActiveToolModal(null)}
      />

      <TouchTestModal
        isOpen={activeToolModal === "touch_test"}
        onClose={() => setActiveToolModal(null)}
      />

      <DeadPixelTestModal
        isOpen={activeToolModal === "dead_pixel"}
        onClose={() => setActiveToolModal(null)}
      />

      <MultiTouchTesterModal
        isOpen={activeToolModal === "multi_touch"}
        onClose={() => setActiveToolModal(null)}
      />

      <BurnInHealerModal
        isOpen={activeToolModal === "burnin_healer"}
        onClose={() => setActiveToolModal(null)}
      />

      <DisplayFpsMeterModal
        isOpen={activeToolModal === "fps_meter"}
        onClose={() => setActiveToolModal(null)}
      />

      <GyroCompassModal
        isOpen={activeToolModal === "gyro"}
        onClose={() => setActiveToolModal(null)}
      />

      <TorchControllerModal
        isOpen={activeToolModal === "torch"}
        onClose={() => setActiveToolModal(null)}
      />

      <AmbientLightTestModal
        isOpen={activeToolModal === "ambient_light"}
        onClose={() => setActiveToolModal(null)}
      />

      <AntiTheftModal
        isOpen={activeToolModal === "anti_theft"}
        onClose={() => setActiveToolModal(null)}
      />

      <BatteryGuardModal
        isOpen={activeToolModal === "battery_guard"}
        onClose={() => setActiveToolModal(null)}
      />

      <SecretCodesModal
        isOpen={activeToolModal === "secret_codes"}
        onClose={() => setActiveToolModal(null)}
      />

      <ImeiValidatorModal
        isOpen={activeToolModal === "imei_validator"}
        onClose={() => setActiveToolModal(null)}
      />

      <LockScreenGenModal
        isOpen={activeToolModal === "lockscreen_gen"}
        onClose={() => setActiveToolModal(null)}
      />

      <UsedPhoneAuditModal
        isOpen={activeToolModal === "used_phone_audit"}
        onClose={() => setActiveToolModal(null)}
      />

      <WaterRescueWizardModal
        isOpen={activeToolModal === "water_wizard"}
        onClose={() => setActiveToolModal(null)}
        onOpenSpeakerEjector={() => setActiveToolModal("speaker_cleaner")}
      />

      <RepairTrackerModal
        isOpen={trackModalOpen}
        onClose={() => setTrackModalOpen(false)}
      />

      <DeepScanEngine
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
      />

      {/* Turbo Clean & Speed Boost Modal */}
      <TurboCleanModal
        isOpen={cleanModalOpen}
        onClose={() => setCleanModalOpen(false)}
      />

      {/* Lab Doctor Diagnostic & Real Charging Current Ampere Profiler Modal */}
      <DoctorDiagnosticModal
        isOpen={doctorModalOpen}
        onClose={() => setDoctorModalOpen(false)}
      />
    </div>
  );
};

export default MobileAppShell;
