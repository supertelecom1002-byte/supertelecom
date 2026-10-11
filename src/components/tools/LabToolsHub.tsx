import React, { useState, useEffect } from "react";
import {
  Wrench,
  Droplets,
  Smartphone,
  ShieldAlert,
  BatteryCharging,
  Hash,
  HeartPulse,
  CheckSquare,
  X,
  Sparkles,
  ArrowRight,
  Mic,
  Zap,
  Gauge,
  LifeBuoy,
  Search,
  Eye,
  Layers,
  Compass,
  Flashlight,
  Sun,
  ShieldCheck,
} from "lucide-react";
import { fetchAppConfig, subscribeToAppConfig, type AppConfig, DEFAULT_APP_CONFIG } from "@/services/appConfigService";
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
import { DoctorDiagnosticModal } from "@/components/dashboard/DoctorDiagnosticModal";
import { Stethoscope } from "lucide-react";

export type ToolId =
  | "speaker_cleaner"
  | "audio_test"
  | "vibration_test"
  | "touch_test"
  | "dead_pixel"
  | "multi_touch"
  | "burnin_healer"
  | "fps_meter"
  | "gyro"
  | "torch"
  | "ambient_light"
  | "anti_theft"
  | "battery_guard"
  | "secret_codes"
  | "imei_validator"
  | "lockscreen_gen"
  | "used_phone_audit"
  | "water_wizard"
  | "doctor_diagnostic";

export type ToolCategory = "all" | "audio" | "screen" | "sensors" | "system";

interface LabToolsHubProps {
  isOpen: boolean;
  onClose: () => void;
  initialTool?: ToolId | null;
}

interface ToolDefinition {
  id: ToolId;
  category: "audio" | "screen" | "sensors" | "system";
  configKey?: keyof AppConfig;
  title: string;
  subtitle: string;
  tag: string;
  badgeColor: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const TOOLS: ToolDefinition[] = [
  // CATEGORY A: AUDIO & HAPTICS
  {
    id: "speaker_cleaner",
    category: "audio",
    configKey: "tool_speaker_cleaner",
    title: "165Hz Sonic Dust & Water Ejector",
    subtitle: "Sweeps 165Hz to 240Hz resonance + haptics to clear speaker moisture.",
    tag: "100% Offline",
    badgeColor: "text-cyan-400 bg-cyan-950/80 border-cyan-500/30",
    icon: Droplets,
  },
  {
    id: "audio_test",
    category: "audio",
    configKey: "tool_audio_loopback",
    title: "Mic & Earpiece Loopback Tester",
    subtitle: "4-second local audio loopback recording to detect muffled mic and torn flex.",
    tag: "Hardware API",
    badgeColor: "text-cyan-400 bg-cyan-950/80 border-cyan-500/30",
    icon: Mic,
  },
  {
    id: "vibration_test",
    category: "audio",
    configKey: "tool_vibration",
    title: "Haptic Vibration Motor Diagnostic",
    subtitle: "4 stress patterns (Pulse, Heartbeat, Buzz, SOS) to diagnose motor health.",
    tag: "Quick Test",
    badgeColor: "text-amber-400 bg-amber-950/80 border-amber-500/30",
    icon: Zap,
  },

  // CATEGORY B: DISPLAY & DIGITIZER
  {
    id: "touch_test",
    category: "screen",
    configKey: "tool_touch_test",
    title: "Touch Matrix 10x15 Digitizer Grid",
    subtitle: "150-tile neon matrix with real-time completion counter (0% to 100%).",
    tag: "Quick Test",
    badgeColor: "text-emerald-400 bg-emerald-950/80 border-emerald-500/30",
    icon: Smartphone,
  },
  {
    id: "dead_pixel",
    category: "screen",
    configKey: "tool_dead_pixel",
    title: "Dead Pixel RGB Sub-Pixel Cycle",
    subtitle: "Pure Red, Green, Blue, White, Black cycle with WakeLock to spot stuck dots.",
    tag: "100% Offline",
    badgeColor: "text-emerald-400 bg-emerald-950/80 border-emerald-500/30",
    icon: Eye,
  },
  {
    id: "multi_touch",
    category: "screen",
    configKey: "tool_multi_touch",
    title: "10-Point Multi-Touch Inspector",
    subtitle: "Live touch coordinates & rings test if display is genuine 10-point vs 2-point.",
    tag: "Hardware API",
    badgeColor: "text-cyan-400 bg-cyan-950/80 border-cyan-500/30",
    icon: Layers,
  },
  {
    id: "burnin_healer",
    category: "screen",
    configKey: "tool_burnin_healer",
    title: "AMOLED Burn-in & Ghost Healer",
    subtitle: "Rapid RGB & static white noise flasher exercises stuck sub-pixels.",
    tag: "Sub-pixel",
    badgeColor: "text-purple-400 bg-purple-950/80 border-purple-500/30",
    icon: Sparkles,
  },
  {
    id: "fps_meter",
    category: "screen",
    configKey: "tool_fps_meter",
    title: "Real Display FPS & Refresh Rate",
    subtitle: "RAF frame benchmark measures true 60Hz, 90Hz, or 120Hz ProMotion display.",
    tag: "Benchmark",
    badgeColor: "text-emerald-400 bg-emerald-950/80 border-emerald-500/30",
    icon: Gauge,
  },

  // CATEGORY C: SENSORS & HARDWARE
  {
    id: "gyro",
    category: "sensors",
    configKey: "tool_gyro",
    title: "3D Gyroscope & Spirit Level",
    subtitle: "DeviceOrientation IMU 3D tilt & bubble level tests accelerometer drop health.",
    tag: "Sensor IC",
    badgeColor: "text-cyan-400 bg-cyan-950/80 border-cyan-500/30",
    icon: Compass,
  },
  {
    id: "torch",
    category: "sensors",
    configKey: "tool_torch",
    title: "Camera Torch Strobe & SOS Signal",
    subtitle: "Rear LED flashlight with 10Hz fast strobe, SOS beacon & screen fallback.",
    tag: "Hardware API",
    badgeColor: "text-amber-400 bg-amber-950/80 border-amber-500/30",
    icon: Flashlight,
  },
  {
    id: "ambient_light",
    category: "sensors",
    configKey: "tool_ambient_light",
    title: "Ambient Light & Proximity Health",
    subtitle: "Measures real-time Lux illuminance to verify screen auto-brightness sensor.",
    tag: "Optical Lux",
    badgeColor: "text-amber-400 bg-amber-950/80 border-amber-500/30",
    icon: Sun,
  },
  {
    id: "anti_theft",
    category: "sensors",
    configKey: "tool_anti_theft",
    title: "Anti-Theft Unplug & Motion Siren",
    subtitle: "Triggers intense 100% volume alarm loop & strobe screen if charger is pulled.",
    tag: "Security",
    badgeColor: "text-rose-400 bg-rose-950/80 border-rose-500/30",
    icon: ShieldAlert,
  },

  // CATEGORY D: BATTERY & SYSTEM INTEGRITY
  {
    id: "doctor_diagnostic",
    category: "system",
    title: "Lab Doctor Hardware Checkup & Ampere Profiler",
    subtitle: "Real charging current in mA, IC health, 5-point motherboard checkup & prescription.",
    tag: "Ampere & IC",
    badgeColor: "text-emerald-400 bg-emerald-950/80 border-emerald-500/30",
    icon: Stethoscope,
  },
  {
    id: "battery_guard",
    category: "system",
    configKey: "tool_battery_guard",
    title: "Smart Battery Life Guard (85%)",
    subtitle: "Real-time battery gauge with audio chime when reaching 85% to preserve cathode.",
    tag: "Battery Guard",
    badgeColor: "text-emerald-400 bg-emerald-950/80 border-emerald-500/30",
    icon: BatteryCharging,
  },
  {
    id: "secret_codes",
    category: "system",
    configKey: "tool_secret_codes",
    title: "All-Brand Secret Hardware Dials",
    subtitle: "Engineering diagnostic menus for Samsung, Apple, OnePlus, Xiaomi & Vivo.",
    tag: "100% Offline",
    badgeColor: "text-cyan-400 bg-cyan-950/80 border-cyan-500/30",
    icon: Hash,
  },
  {
    id: "imei_validator",
    category: "system",
    configKey: "tool_imei_validator",
    title: "Mathematical IMEI Luhn Validator",
    subtitle: "Luhn Mod-10 checksum validation detects fake, spoofed, or mistyped IMEI numbers.",
    tag: "GSMA Luhn",
    badgeColor: "text-cyan-400 bg-cyan-950/80 border-cyan-500/30",
    icon: ShieldCheck,
  },
  {
    id: "lockscreen_gen",
    category: "system",
    configKey: "tool_lockscreen_gen",
    title: "Emergency ICE Lockscreen Generator",
    subtitle: "HTML5 canvas generates a 1080x2400 AMOLED lockscreen with emergency contacts.",
    tag: "Canvas PNG",
    badgeColor: "text-rose-400 bg-rose-950/80 border-rose-500/30",
    icon: HeartPulse,
  },
  {
    id: "used_phone_audit",
    category: "system",
    configKey: "tool_used_phone_audit",
    title: "Used Phone Inspection Checklist",
    subtitle: "12-point hardware, display, and camera scorecard producing Grade A+ to D.",
    tag: "12-Point Audit",
    badgeColor: "text-amber-400 bg-amber-950/80 border-amber-500/30",
    icon: CheckSquare,
  },
  {
    id: "water_wizard",
    category: "system",
    configKey: "tool_water_wizard",
    title: "Water Damage Emergency Protocol",
    subtitle: "Critical 4-step triage guide with 2-hour golden lab window countdown.",
    tag: "Triage Wizard",
    badgeColor: "text-rose-400 bg-rose-950/80 border-rose-500/30",
    icon: LifeBuoy,
  },
];

export const LabToolsHub: React.FC<LabToolsHubProps> = ({
  isOpen,
  onClose,
  initialTool = null,
}) => {
  const [config, setConfig] = useState<AppConfig>(DEFAULT_APP_CONFIG);
  const [activeModal, setActiveModal] = useState<ToolId | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>("all");

  useEffect(() => {
    fetchAppConfig().then(setConfig);
    const unsub = subscribeToAppConfig(setConfig);
    return unsub;
  }, []);

  useEffect(() => {
    if (initialTool) {
      setActiveModal(initialTool);
    }
  }, [initialTool]);

  if (!isOpen) return null;

  // Filter tools based on appConfig switches, category tabs, and search query
  const filteredTools = TOOLS.filter((tool) => {
    if (tool.configKey && config && config[tool.configKey] === false) {
      return false;
    }
    if (selectedCategory !== "all" && tool.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        tool.title.toLowerCase().includes(q) ||
        tool.subtitle.toLowerCase().includes(q) ||
        tool.tag.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const categories: { key: ToolCategory; label: string }[] = [
    { key: "all", label: "All Tools" },
    { key: "audio", label: "Audio & Haptics" },
    { key: "screen", label: "Display & Screen" },
    { key: "sensors", label: "Sensors & Torch" },
    { key: "system", label: "Battery & System" },
  ];

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/80 backdrop-blur-md p-0 md:p-4 select-none animate-fade-up"
        onClick={onClose}
      >
        <div
          className="relative max-w-4xl w-full max-h-[92vh] md:max-h-[85vh] bg-[#020617] border border-cyan-500/30 rounded-t-3xl md:rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col gap-4 text-white overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Mobile Slide-Up Pull Handle */}
          <div className="md:hidden flex justify-center -mt-1 -mb-1">
            <div className="w-12 h-1.5 rounded-full bg-slate-700" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-none">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-gradient-brand text-primary-foreground shadow-brand">
                <Wrench className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg flex items-center gap-2">
                  <span>16-in-1 Hardware Lab Diagnostic Suite</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-400">
                    100% Offline
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Client-side browser diagnostics &bull; Zero data stored &bull; Native Web APIs
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative flex-none">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search hardware tool (e.g. mic, screen, battery, imei)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500/60 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-none pb-1">
            {categories.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.key
                    ? "bg-cyan-500 text-slate-950 font-bold shadow-sm shadow-cyan-500/30"
                    : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Tools Grid */}
          <div className="flex-1 overflow-y-auto no-scrollbar pr-1 grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3 py-1">
            {filteredTools.length === 0 ? (
              <div className="col-span-2 md:col-span-3 text-center py-10 text-slate-400 text-xs">
                No matching hardware diagnostic tools found.
              </div>
            ) : (
              filteredTools.map((tool) => {
                const IconComponent = tool.icon;
                return (
                  <div
                    key={tool.id}
                    onClick={() => setActiveModal(tool.id)}
                    className="p-3 sm:p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900/90 active:scale-95 transition-all cursor-pointer flex flex-col justify-between group shadow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-2">
                        <div className="p-2 rounded-xl bg-slate-800 text-cyan-400 group-hover:scale-105 transition-transform">
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border truncate ${tool.badgeColor}`}>
                          {tool.tag}
                        </span>
                      </div>

                      <h4 className="font-bold text-xs sm:text-sm text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                        {tool.title}
                      </h4>
                      <p className="text-[10px] sm:text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                        {tool.subtitle}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-cyan-400 font-bold">
                      <span>Launch</span>
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Note */}
          <div className="flex-none pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-cyan-300">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              Super Telecom Barganda Road Hardware Lab
            </span>
            <span className="hidden sm:inline">16+ Built-in Utilities</span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* Active Modals for All 16+ Hardware Diagnostic Tools      */}
      {/* ======================================================== */}
      <SpeakerCleanerModal
        isOpen={activeModal === "speaker_cleaner"}
        onClose={() => setActiveModal(null)}
      />

      <AudioHardwareTestModal
        isOpen={activeModal === "audio_test"}
        onClose={() => setActiveModal(null)}
      />

      <VibrationTesterModal
        isOpen={activeModal === "vibration_test"}
        onClose={() => setActiveModal(null)}
      />

      <TouchTestModal
        isOpen={activeModal === "touch_test"}
        onClose={() => setActiveModal(null)}
      />

      <DeadPixelTestModal
        isOpen={activeModal === "dead_pixel"}
        onClose={() => setActiveModal(null)}
      />

      <MultiTouchTesterModal
        isOpen={activeModal === "multi_touch"}
        onClose={() => setActiveModal(null)}
      />

      <BurnInHealerModal
        isOpen={activeModal === "burnin_healer"}
        onClose={() => setActiveModal(null)}
      />

      <DisplayFpsMeterModal
        isOpen={activeModal === "fps_meter"}
        onClose={() => setActiveModal(null)}
      />

      <GyroCompassModal
        isOpen={activeModal === "gyro"}
        onClose={() => setActiveModal(null)}
      />

      <TorchControllerModal
        isOpen={activeModal === "torch"}
        onClose={() => setActiveModal(null)}
      />

      <AmbientLightTestModal
        isOpen={activeModal === "ambient_light"}
        onClose={() => setActiveModal(null)}
      />

      <AntiTheftModal
        isOpen={activeModal === "anti_theft"}
        onClose={() => setActiveModal(null)}
      />

      <BatteryGuardModal
        isOpen={activeModal === "battery_guard"}
        onClose={() => setActiveModal(null)}
      />

      <SecretCodesModal
        isOpen={activeModal === "secret_codes"}
        onClose={() => setActiveModal(null)}
      />

      <ImeiValidatorModal
        isOpen={activeModal === "imei_validator"}
        onClose={() => setActiveModal(null)}
      />

      <LockScreenGenModal
        isOpen={activeModal === "lockscreen_gen"}
        onClose={() => setActiveModal(null)}
      />

      <UsedPhoneAuditModal
        isOpen={activeModal === "used_phone_audit"}
        onClose={() => setActiveModal(null)}
      />

      <WaterRescueWizardModal
        isOpen={activeModal === "water_wizard"}
        onClose={() => setActiveModal(null)}
        onOpenSpeakerEjector={() => setActiveModal("speaker_cleaner")}
      />

      <DoctorDiagnosticModal
        isOpen={activeModal === "doctor_diagnostic"}
        onClose={() => setActiveModal(null)}
      />
    </>
  );
};

export default LabToolsHub;
