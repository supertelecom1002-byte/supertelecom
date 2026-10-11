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

export type ToolId =
  | "speaker_cleaner"
  | "touch_test"
  | "anti_theft"
  | "battery_guard"
  | "secret_codes"
  | "lockscreen_gen"
  | "used_phone_audit"
  | "audio_test"
  | "vibration_test"
  | "fps_meter"
  | "water_wizard";

interface LabToolsHubProps {
  isOpen: boolean;
  onClose: () => void;
  initialTool?: ToolId | null;
}

interface ToolDefinition {
  id: ToolId;
  configKey?: keyof AppConfig;
  title: string;
  subtitle: string;
  tag: string;
  badgeColor: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TOOLS: ToolDefinition[] = [
  {
    id: "speaker_cleaner",
    configKey: "tool_speaker_cleaner",
    title: "165Hz Water & Dust Ejector",
    subtitle: "Dual-frequency 165Hz/220Hz resonance + haptics to clear speaker moisture.",
    tag: "Acoustic Ejection",
    badgeColor: "text-cyan-400 bg-cyan-950/80 border-cyan-500/30",
    icon: Droplets,
  },
  {
    id: "touch_test",
    configKey: "tool_touch_test",
    title: "Touch Matrix & Pixel Test",
    subtitle: "10x15 neon digitizer grid, live ghost touch tracker & RGB sub-pixel cycle.",
    tag: "Display Audit",
    badgeColor: "text-emerald-400 bg-emerald-950/80 border-emerald-500/30",
    icon: Smartphone,
  },
  {
    id: "anti_theft",
    configKey: "tool_anti_theft",
    title: "Anti-Theft Unplug Siren",
    subtitle: "Rings an intense 100% emergency alarm if charger is pulled or device moved.",
    tag: "Security Siren",
    badgeColor: "text-rose-400 bg-rose-950/80 border-rose-500/30",
    icon: ShieldAlert,
  },
  {
    id: "audio_test",
    title: "Mic & Earpiece Audio Test",
    subtitle: "4-second local audio loopback recording to detect muffled mic and torn flex.",
    tag: "Audio Loopback",
    badgeColor: "text-cyan-400 bg-cyan-950/80 border-cyan-500/30",
    icon: Mic,
  },
  {
    id: "vibration_test",
    title: "Haptic Vibration Motor Test",
    subtitle: "4 stress patterns (Pulse, Heartbeat, Buzz, SOS) to diagnose motor health.",
    tag: "Haptic Motor",
    badgeColor: "text-amber-400 bg-amber-950/80 border-amber-500/30",
    icon: Zap,
  },
  {
    id: "fps_meter",
    title: "Display FPS & Refresh Rate",
    subtitle: "Live requestAnimationFrame measurement testing true 60Hz, 90Hz or 120Hz.",
    tag: "Refresh Rate",
    badgeColor: "text-emerald-400 bg-emerald-950/80 border-emerald-500/30",
    icon: Gauge,
  },
  {
    id: "water_wizard",
    title: "Water Damage Protocol",
    subtitle: "Critical 4-step triage guide with 2-hour golden lab window countdown.",
    tag: "Triage Wizard",
    badgeColor: "text-rose-400 bg-rose-950/80 border-rose-500/30",
    icon: LifeBuoy,
  },
  {
    id: "battery_guard",
    configKey: "tool_battery_guard",
    title: "Smart Battery Guard (85%)",
    subtitle: "Live battery health gauge with automatic 85% overcharge prevention chime.",
    tag: "Lifespan Guard",
    badgeColor: "text-emerald-400 bg-emerald-950/80 border-emerald-500/30",
    icon: BatteryCharging,
  },
  {
    id: "secret_codes",
    configKey: "tool_secret_codes",
    title: "Secret Hardware Dial Codes",
    subtitle: "Engineering diagnostic menus for Samsung, Apple, OnePlus, Xiaomi & Vivo.",
    tag: "Service Codes",
    badgeColor: "text-cyan-400 bg-cyan-950/80 border-cyan-500/30",
    icon: Hash,
  },
  {
    id: "lockscreen_gen",
    configKey: "tool_lockscreen_gen",
    title: "Emergency ICE Wallpaper",
    subtitle: "HTML5 canvas generator exporting an AMOLED lockscreen with emergency ICE contacts.",
    tag: "Lost Recovery",
    badgeColor: "text-rose-400 bg-rose-950/80 border-rose-500/30",
    icon: HeartPulse,
  },
  {
    id: "used_phone_audit",
    configKey: "tool_used_phone_audit",
    title: "Used Phone Inspection Audit",
    subtitle: "12-point hardware, TrueTone, and blacklist inspection with condition grading.",
    tag: "Buyer Checklist",
    badgeColor: "text-amber-400 bg-amber-950/80 border-amber-500/30",
    icon: CheckSquare,
  },
];

export const LabToolsHub: React.FC<LabToolsHubProps> = ({
  isOpen,
  onClose,
  initialTool = null,
}) => {
  const [config, setConfig] = useState<AppConfig>(DEFAULT_APP_CONFIG);
  const [activeModal, setActiveModal] = useState<ToolId | null>(initialTool);

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

  // Filter tools based on live AppConfig toggles
  const visibleTools = TOOLS.filter((tool) => {
    if (!tool.configKey) return true;
    const isEnabled = (config || DEFAULT_APP_CONFIG)?.[tool.configKey];
    return isEnabled !== false;
  });

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in select-none"
        onClick={onClose}
      >
        <div
          className="w-full max-w-4xl bg-[#030712] border border-cyan-500/30 rounded-3xl p-5 sm:p-8 space-y-6 shadow-2xl relative text-white max-h-[92vh] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between flex-none border-b border-slate-800 pb-5">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-md shadow-cyan-500/20 text-slate-950">
                <Wrench className="h-6 w-6 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-extrabold text-xl text-white">
                    Super Telecom Cyber-Lab Suite
                  </h3>
                  <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950 border border-cyan-500/40 text-cyan-300 uppercase">
                    100% Offline Capable
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Professional engineer utilities running directly in your browser with zero install and zero data required.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Tools Grid (Scrollable) */}
          <div className="flex-1 overflow-y-auto no-scrollbar pr-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {visibleTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <div
                  key={tool.id}
                  onClick={() => setActiveModal(tool.id)}
                  className="group relative flex flex-col justify-between p-4 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 shadow-md transition-all cursor-pointer active:scale-95"
                >
                  <div>
                    <div className="flex items-start justify-between mb-2.5">
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 group-hover:border-cyan-500/40 text-cyan-400 transition-colors">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span
                        className={`text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${tool.badgeColor}`}
                      >
                        {tool.tag}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                      {tool.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {tool.subtitle}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs text-cyan-400 font-bold">
                    <span>Launch Utility</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Note */}
          <div className="flex-none pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-cyan-300">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              Engineered by Super Telecom Giridih Lab
            </span>
            <span>Barganda Road &bull; Near Shivam Clinic</span>
          </div>
        </div>
      </div>

      {/* Active Modals */}
      <SpeakerCleanerModal
        isOpen={activeModal === "speaker_cleaner"}
        onClose={() => setActiveModal(null)}
      />

      <TouchTestModal
        isOpen={activeModal === "touch_test"}
        onClose={() => setActiveModal(null)}
      />

      <AntiTheftModal
        isOpen={activeModal === "anti_theft"}
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

      <DisplayFpsMeterModal
        isOpen={activeModal === "fps_meter"}
        onClose={() => setActiveModal(null)}
      />

      <WaterRescueWizardModal
        isOpen={activeModal === "water_wizard"}
        onClose={() => setActiveModal(null)}
        onOpenSpeakerEjector={() => setActiveModal("speaker_cleaner")}
      />

      <BatteryGuardModal
        isOpen={activeModal === "battery_guard"}
        onClose={() => setActiveModal(null)}
      />

      <SecretCodesModal
        isOpen={activeModal === "secret_codes"}
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
    </>
  );
};

export default LabToolsHub;
