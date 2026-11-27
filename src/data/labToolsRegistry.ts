import type React from "react";
import {
  Droplets,
  Smartphone,
  ShieldAlert,
  BatteryCharging,
  Hash,
  HeartPulse,
  CheckSquare,
  Sparkles,
  Mic,
  Zap,
  Gauge,
  LifeBuoy,
  Eye,
  Layers,
  Compass,
  Flashlight,
  Sun,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import type { AppConfig } from "@/services/appConfigService";

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

export interface ToolDefinition {
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
  {
    id: "doctor_diagnostic",
    category: "system",
    title: "Battery & Performance Browser Profiler",
    subtitle: "Estimates charging flow via BatteryManager API, FPS cadence & local memory quota.",
    tag: "Browser APIs",
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
