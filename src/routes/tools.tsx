import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { SiteFooter } from "@/components/SiteFooter";
import { MobileAppShell } from "@/components/layout/MobileAppShell";
import {
  TOOLS,
  type ToolId,
  type ToolCategory,
} from "@/components/tools/LabToolsHub";
import {
  Wrench,
  Search,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
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
import { DeepScanEngine } from "@/components/scanner/DeepScanEngine";
import { SITE_URL } from "@/data/site";

interface ToolsSearchParams {
  tool?: string;
  action?: string;
}

export const Route = createFileRoute("/tools")({
  validateSearch: (search: Record<string, unknown>): ToolsSearchParams => {
    return {
      tool: typeof search.tool === "string" ? search.tool : undefined,
      action: typeof search.action === "string" ? search.action : undefined,
    };
  },
  head: () => ({
    meta: [
      {
        title: "16+ Free Hardware Diagnostics & Tools Suite — Super Telecom Giridih",
      },
      {
        name: "description",
        content:
          "Run 100% client-side mobile hardware diagnostics: 165Hz Speaker Dust Ejector, Touch Matrix 10x15, FPS meter, Battery Guard, and Anti-theft motion detector.",
      },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/tools` }],
  }),
  component: ToolsPage,
});

function ToolsPage() {
  const search = Route.useSearch();
  const [activeModal, setActiveModal] = useState<ToolId | null>(null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [category, setCategory] = useState<ToolCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Map incoming search param to actual tool id
  useEffect(() => {
    if (search.action === "scan") {
      setScannerOpen(true);
    }
    if (search.tool) {
      if (search.tool === "speaker" || search.tool === "speaker_cleaner") {
        setActiveModal("speaker_cleaner");
      } else {
        const found = TOOLS.find((t) => t.id === search.tool);
        if (found) setActiveModal(found.id);
      }
    }
  }, [search.tool, search.action]);

  const categories: { key: ToolCategory; label: string }[] = [
    { key: "all", label: "All Utilities" },
    { key: "audio", label: "Audio & Haptics" },
    { key: "screen", label: "Display & Screen" },
    { key: "sensors", label: "Sensors & Torch" },
    { key: "system", label: "Battery & System" },
  ];

  const filtered = TOOLS.filter((t) => {
    if (category !== "all" && t.category !== category) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        t.subtitle.toLowerCase().includes(q) ||
        t.tag.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <>
      {/* Mobile Native Shell View */}
      <div className="md:hidden">
        <MobileAppShell
          initialTab="tools"
          initialTool={
            search.tool === "speaker"
              ? "speaker_cleaner"
              : (search.tool as ToolId | undefined)
          }
          initialAction={search.action}
        />
      </div>

      {/* Desktop Enterprise View */}
      <div className="hidden md:block min-h-screen bg-background text-foreground">
        <Header />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-950/80 border border-cyan-300 dark:border-cyan-500/40 text-cyan-900 dark:text-cyan-300 text-xs font-mono font-bold tracking-tight">
              <Zap className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>SUPER TELECOM CYBER-LAB HARDWARE SUITE</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Professional Hardware Lab Diagnostics
            </h1>

            <p className="text-base text-muted-foreground leading-relaxed">
              16+ offline smartphone testing utilities built directly on native
              Web APIs. Zero ads, zero user tracking, and 100% free for everyone
              in Giridih &amp; beyond.
            </p>

            {/* Quick 360 Scan Trigger Banner */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setScannerOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs sm:text-sm tracking-wide uppercase shadow-lg shadow-cyan-500/25 active:scale-95 transition-all cursor-pointer"
              >
                <Zap className="h-4 w-4 fill-slate-950" />
                <span>Launch Browser Cache &amp; Storage Cleaner</span>
              </button>
            </div>
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools (e.g. mic, screen, battery)..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {categories.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setCategory(c.key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                    category === c.key
                      ? "bg-cyan-600 text-white shadow-sm"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* 16+ Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((tool) => {
              const Icon = tool.icon;
              return (
                <div
                  key={tool.id}
                  onClick={() => setActiveModal(tool.id)}
                  className="group p-5 rounded-2xl bg-card border border-border hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 transition-all cursor-pointer flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span
                        className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${tool.badgeColor}`}
                      >
                        {tool.tag}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-foreground group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                        {tool.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {tool.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 pt-2 border-t border-border/50">
                    <span>Launch Diagnostic</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </main>

        <SiteFooter />
      </div>

      {/* Diagnostic Modals */}
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

      <DeepScanEngine
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
      />
    </>
  );
}
