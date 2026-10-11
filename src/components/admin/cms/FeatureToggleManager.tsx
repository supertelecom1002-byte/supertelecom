import React, { useState, useEffect } from "react";
import {
  Sliders,
  Sparkles,
  Droplets,
  Smartphone,
  ShieldAlert,
  BatteryCharging,
  Hash,
  HeartPulse,
  CheckSquare,
  ShoppingBag,
  Clock,
  Megaphone,
  Check,
  RotateCcw,
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
} from "lucide-react";
import {
  fetchAppConfig,
  updateAppConfigKey,
  type AppConfig,
  DEFAULT_APP_CONFIG,
  subscribeToAppConfig,
} from "@/services/appConfigService";

export const FeatureToggleManager: React.FC = () => {
  const [config, setConfig] = useState<AppConfig>(DEFAULT_APP_CONFIG);
  const [announcementText, setAnnouncementText] = useState("");
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchAppConfig().then((c) => {
      setConfig(c);
      setAnnouncementText(c.announcement_banner.text);
    });
    const unsub = subscribeToAppConfig(setConfig);
    return unsub;
  }, []);

  const handleToggle = async (key: keyof AppConfig) => {
    const newVal = !config[key];
    const updated = await updateAppConfigKey(key, newVal as any);
    setConfig(updated);
    notifyChange(`Updated ${String(key)}`);
  };

  const handleStatusOverride = async (override: "auto" | "open" | "closed") => {
    const updated = await updateAppConfigKey("lab_status_override", override);
    setConfig(updated);
    notifyChange(`Lab status set to ${override.toUpperCase()}`);
  };

  const handleSaveBanner = async () => {
    const updatedBanner = {
      enabled: Boolean((config || DEFAULT_APP_CONFIG)?.announcement_banner?.enabled),
      text: announcementText,
    };
    const updated = await updateAppConfigKey("announcement_banner", updatedBanner);
    setConfig(updated);
    notifyChange("Announcement Banner updated");
  };

  const handleToggleBanner = async () => {
    const currentEnabled = Boolean((config || DEFAULT_APP_CONFIG)?.announcement_banner?.enabled);
    const updatedBanner = {
      enabled: !currentEnabled,
      text: announcementText,
    };
    const updated = await updateAppConfigKey("announcement_banner", updatedBanner);
    setConfig(updated);
    notifyChange(`Banner ${updatedBanner.enabled ? "Enabled" : "Disabled"}`);
  };

  const notifyChange = (msg: string) => {
    setSaveSuccess(msg);
    setTimeout(() => setSaveSuccess(null), 2500);
  };

  const toolToggles: { key: keyof AppConfig; title: string; subtitle: string; icon: any }[] = [
    // Category A: Audio & Haptics
    {
      key: "tool_speaker_cleaner",
      title: "165Hz Speaker Dust & Water Ejector",
      subtitle: "Sine Oscillator Resonance & Moisture Clearance",
      icon: Droplets,
    },
    {
      key: "tool_audio_loopback",
      title: "Mic & Earpiece Loopback Tester",
      subtitle: "4-Second Local Audio Recording & Diagnostic Playback",
      icon: Mic,
    },
    {
      key: "tool_vibration",
      title: "Haptic Vibration Motor Tester",
      subtitle: "4 Stress Patterns (Pulse, Heartbeat, Buzz, SOS)",
      icon: Zap,
    },

    // Category B: Display & Digitizer
    {
      key: "tool_touch_test",
      title: "Touch Matrix 10x15 Digitizer Grid",
      subtitle: "150-Tile Grid Sweep with Real-time Completion %",
      icon: Smartphone,
    },
    {
      key: "tool_dead_pixel",
      title: "Dead Pixel RGB Sub-Pixel Cycle",
      subtitle: "Pure Red, Green, Blue, White, Black Fullscreen Check",
      icon: Eye,
    },
    {
      key: "tool_multi_touch",
      title: "10-Point Multi-Touch Inspector",
      subtitle: "Live Touch Rings & Digitizer Multiplexing Grade",
      icon: Layers,
    },
    {
      key: "tool_burnin_healer",
      title: "AMOLED Burn-in & Ghost Image Healer",
      subtitle: "Rapid RGB & Static Noise Sub-pixel Exerciser",
      icon: Sparkles,
    },
    {
      key: "tool_fps_meter",
      title: "Real Display FPS & Refresh Rate Meter",
      subtitle: "Live RAF Refresh Measurement (60Hz / 90Hz / 120Hz)",
      icon: Gauge,
    },

    // Category C: Sensors & Hardware
    {
      key: "tool_gyro",
      title: "3D Gyroscope & Digital Spirit Level",
      subtitle: "DeviceOrientation IMU Tilting & Accelerometer IC Health",
      icon: Compass,
    },
    {
      key: "tool_torch",
      title: "Camera Torch Strobe & SOS Signal",
      subtitle: "Steady, 10Hz Strobe, SOS Beacon & Screen Flash Fallback",
      icon: Flashlight,
    },
    {
      key: "tool_ambient_light",
      title: "Ambient Light & Proximity Health Check",
      subtitle: "Photodiode Illuminance & Camera Lux Meter",
      icon: Sun,
    },
    {
      key: "tool_anti_theft",
      title: "Anti-Theft Unplug & Movement Siren",
      subtitle: "Battery API Charger Disconnect 100% Volume Alarm",
      icon: ShieldAlert,
    },

    // Category D: Battery & System Integrity
    {
      key: "tool_battery_guard",
      title: "Smart Battery Guard (85%)",
      subtitle: "Cathode Preservation Chime & Overcharge Guard",
      icon: BatteryCharging,
    },
    {
      key: "tool_secret_codes",
      title: "All-Brand Secret Hardware Dial Directory",
      subtitle: "Engineering Menus for Samsung, Apple, OnePlus, Xiaomi",
      icon: Hash,
    },
    {
      key: "tool_imei_validator",
      title: "Mathematical IMEI Luhn Validator",
      subtitle: "Luhn Mod-10 Checksum & GSMA Hardware Legitimacy",
      icon: ShieldCheck,
    },
    {
      key: "tool_lockscreen_gen",
      title: "Emergency Lockscreen Wallpaper Generator",
      subtitle: "AMOLED 1080x2400 ICE Emergency Card Canvas",
      icon: HeartPulse,
    },
    {
      key: "tool_used_phone_audit",
      title: "Used Phone Inspection Checklist",
      subtitle: "12-Point Hardware Scorecard with Grade A+ to D",
      icon: CheckSquare,
    },
    {
      key: "tool_water_wizard",
      title: "Water Damage Emergency Triage Protocol",
      subtitle: "Golden Window Triage Guide & Critical Diagnostic Steps",
      icon: LifeBuoy,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in select-none">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase font-bold">
            <Sliders className="h-4 w-4" /> Live Feature Switchboard
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            Real-Time App Feature Toggles
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Toggle hardware utilities and store features on/off instantly without redeploying code.
          </p>
        </div>

        {saveSuccess && (
          <div className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <Check className="h-4 w-4" />
            <span>{saveSuccess}</span>
          </div>
        )}
      </div>

      {/* 1. Global Lab Status Override */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Lab Operational Status Override</h3>
              <p className="text-xs text-slate-400">Controls the live green/red pulsing dot across mobile and desktop headers.</p>
            </div>
          </div>

          <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-slate-800 text-slate-300 uppercase">
            Active: <strong className="text-cyan-400">{((config || DEFAULT_APP_CONFIG)?.lab_status_override || "auto").toUpperCase()}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {[
            { id: "auto", label: "Auto Schedule", sub: "10:00 AM – 9:30 PM IST" },
            { id: "open", label: "Force OPEN NOW", sub: "Green Dot (Emergency Overtime)" },
            { id: "closed", label: "Force CLOSED", sub: "Red Dot (Holiday / Power Outage)" },
          ].map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleStatusOverride(opt.id as any)}
              className={`p-4 rounded-2xl border text-left transition-all active:scale-98 ${
                ((config || DEFAULT_APP_CONFIG)?.lab_status_override || "auto") === opt.id
                  ? "bg-cyan-950/60 border-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                  : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
              }`}
            >
              <div className="font-bold text-xs">{opt.label}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{opt.sub}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Announcement Banner Real-Time Switch */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Megaphone className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Top Announcement Strip Broadcaster</h3>
              <p className="text-xs text-slate-400">Show emergency messages or festival offers at top of site.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleBanner}
            className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 ${
              (config || DEFAULT_APP_CONFIG)?.announcement_banner?.enabled ? "bg-amber-500" : "bg-slate-800"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                (config || DEFAULT_APP_CONFIG)?.announcement_banner?.enabled ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={announcementText}
            onChange={(e) => setAnnouncementText(e.target.value)}
            placeholder="e.g. Giridih Flagship Lab: Free On-The-Spot Hardware Diagnosis..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <button
            type="button"
            onClick={handleSaveBanner}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-slate-950 font-bold text-xs transition-all shadow-md"
          >
            Update Banner
          </button>
        </div>
      </div>

      {/* 3. Shop & Accessories Tab Switch */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Enable Shop &amp; Accessories in Mobile Nav</h3>
            <p className="text-xs text-slate-400">Hides or displays the 4th tab in the mobile bottom bar.</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleToggle("shop_accessories_enabled")}
          className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 ${
            (config || DEFAULT_APP_CONFIG)?.shop_accessories_enabled !== false ? "bg-emerald-500" : "bg-slate-800"
          }`}
        >
          <div
            className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${
              (config || DEFAULT_APP_CONFIG)?.shop_accessories_enabled !== false ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* 4. 7 Lab Tools Toggles Grid */}
      <div className="space-y-4">
        <h3 className="font-bold text-sm text-white font-mono uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-cyan-400" />
          Individual Lab Hardware Utilities (7 Tools)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {toolToggles.map((t) => {
            const Icon = t.icon;
            const isEnabled = (config || DEFAULT_APP_CONFIG)?.[t.key] !== false;

            return (
              <div
                key={t.key}
                className="p-4.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400 mt-0.5">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-white">{t.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{t.subtitle}</p>
                    <span
                      className={`inline-block mt-2 text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                        isEnabled
                          ? "bg-emerald-950/80 text-emerald-400 border border-emerald-500/30"
                          : "bg-slate-800 text-slate-500 border border-slate-700"
                      }`}
                    >
                      {isEnabled ? "Live & Active" : "Disabled"}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggle(t.key)}
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-1 shrink-0 ${
                    isEnabled ? "bg-cyan-500" : "bg-slate-800"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                      isEnabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FeatureToggleManager;
