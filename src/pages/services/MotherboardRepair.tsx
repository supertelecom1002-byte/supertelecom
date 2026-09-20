import React from "react";
import { Link } from "@tanstack/react-router";
import {
  Cpu,
  ShieldCheck,
  Clock,
  CheckCircle2,
  MessageCircle,
  Phone,
  Sparkles,
  ChevronRight,
  ArrowRight,
  Flame,
  Zap,
  Droplets,
  HardDrive,
  Activity,
  Microscope,
} from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { SiteFooter } from "@/components/SiteFooter";

const PHONE = "+918002903643";
const PHONE_DISPLAY = "+91 80029 03643";
const WHATSAPP_URL =
  "https://wa.me/918002903643?text=Hi%20Super%20Telecom,%20my%20phone%20is%20dead/water%20damaged%20and%20I%20need%20motherboard%20repair%20in%20Giridih";

export const MotherboardRepairPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-cyan-500 selection:text-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <BrandLogo size="md" to="/" />
          <div className="flex items-center gap-3">
            <a
              href={`tel:${PHONE}`}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-semibold hover:bg-secondary transition-colors"
            >
              <Phone className="h-3.5 w-3.5 text-cyan-400" />
              {PHONE_DISPLAY}
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 text-xs shadow-lg transition-transform hover:scale-[1.03]"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Diagnostic Consultation</span>
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-12 pb-20 md:pt-16 md:pb-28 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="mx-auto max-w-5xl px-4 sm:px-6 relative z-10">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
              <Link to="/" className="hover:text-foreground">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <Link to="/services" className="hover:text-foreground">Services</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-amber-400 font-semibold">Motherboard &amp; Chip-Level Repair</span>
            </nav>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-950/80 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold uppercase mb-5">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              Advanced BGA Micro-Soldering Lab · Giridih
            </div>

            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
              Dead Phone &amp; Motherboard IC Repair in Giridih
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
              Has another shop told you your phone is &ldquo;unfixable&rdquo; or that the motherboard must be replaced? Super Telecom specializes in component-level BGA chip replacement, power management IC micro-soldering, and water damage dead phone revival.
            </p>

            {/* Badges Bar */}
            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 font-semibold">
                <Microscope className="h-4 w-4" /> 45x Stereo Microscope Rework
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 font-semibold">
                <Zap className="h-4 w-4" /> Short Circuit Thermal Imaging
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 font-semibold">
                <HardDrive className="h-4 w-4" /> Data Preservation Focus
              </span>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3.5 text-sm shadow-[0_0_20px_rgba(245,158,11,0.35)] transition-transform hover:scale-[1.03]"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Consult Our Micro-Soldering Specialist</span>
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href={`tel:${PHONE}`}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-white font-semibold px-6 py-3.5 text-sm transition-colors"
              >
                <Phone className="h-4 w-4 text-amber-400" />
                <span>Call Store: +91 80029 03643</span>
              </a>
            </div>
          </div>
        </section>

        {/* Fault Diagnosis Checklist */}
        <section className="py-16 bg-slate-950 border-t border-slate-800/80">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white text-center mb-4">
              Symptoms of Motherboard IC Failure
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 text-center max-w-2xl mx-auto mb-10">
              If your phone shows any of the following symptoms, our chip-level engineers can diagnose the exact failing capacitor, diode, or IC.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-2.5">
                <div className="p-2 rounded-xl bg-rose-950 border border-rose-500/30 text-rose-400 w-fit">
                  <Flame className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-white">Sudden Dead / No Power</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The phone will not switch on, vibrate, or charge. Frequently caused by burned PMIC or primary VDD power line short circuits.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-2.5">
                <div className="p-2 rounded-xl bg-blue-950 border border-blue-500/30 text-blue-400 w-fit">
                  <Droplets className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-white">Liquid &amp; Water Damage</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Corrosion under BGA chip balls creating microscopic short circuits. We perform deep ultrasonic chemical baths and reballing.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-2.5">
                <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-500/30 text-cyan-400 w-fit">
                  <Activity className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-white">Bootloop &amp; Logo Freeze</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Device restarts continuously at the brand logo. Often caused by CPU/RAM ball detachment due to drops or overheating.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-2.5">
                <div className="p-2 rounded-xl bg-amber-950 border border-amber-500/30 text-amber-400 w-fit">
                  <Zap className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-white">Fake / Slow Charging</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Battery percentage shows charging bolt icon but percentage drops or stays frozen. Indicates charging IC (SMB/OVP) breakdown.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-2.5">
                <div className="p-2 rounded-xl bg-purple-950 border border-purple-500/30 text-purple-400 w-fit">
                  <Cpu className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-white">Qualcomm 9008 / EDL Port</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Computer recognizes device as Qualcomm HS-USB QDLoader 9008 or MediaTek Preloader port with black screen. Fixed via UFS reprogramming.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-2.5">
                <div className="p-2 rounded-xl bg-emerald-950 border border-emerald-500/30 text-emerald-400 w-fit">
                  <HardDrive className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-white">Data Recovery from Dead Boards</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Need photos and business chats back? We bypass dead sub-circuits and power up the core logic board just long enough to extract all data.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Micro-Soldering Equipment Showcase */}
        <section className="py-16 bg-surface/50 border-t border-border/60">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground text-center mb-10">
              Precision Micro-Soldering Laboratory Equipment
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-cyan-950 border border-cyan-500/30 text-cyan-400">
                  <Microscope className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Trinocular Stereo Optical Microscope</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Provides 45x optical magnification for inspecting micro-jumpers (0.01mm copper wire) on severed PCB traces and BGA pads.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-amber-950 border border-amber-500/30 text-amber-400">
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Infrared Thermal Short-Circuit Camera</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Instant thermal leak detection spots shorted 0201 capacitors glowing red hot within milliseconds of applying voltage injection.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16 bg-slate-950 border-t border-slate-800">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white text-center mb-10">
              Motherboard Repair FAQs
            </h2>

            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <h3 className="font-bold text-white text-sm">Can a completely dead phone be fixed?</h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  Yes, in over 85% of cases! Most dead phones only have a single shorted capacitor or a burnt power IC chip, which can be identified and replaced without swapping the entire motherboard.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <h3 className="font-bold text-white text-sm">What is the cost of motherboard repair in Giridih?</h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  Basic power IC and charging IC repairs range from ₹799 to ₹1,500. Advanced double-decker CPU reballing and water damage recovery range from ₹1,800 to ₹3,500. Upfront quote is always given first.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <h3 className="font-bold text-white text-sm">Do you offer warranty on motherboard repairs?</h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  Yes, all chip-level motherboard work comes with a formal warranty of 30 to 60 days.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
};

export default MotherboardRepairPage;
