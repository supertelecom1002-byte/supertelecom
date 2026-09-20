import React from "react";
import { Link } from "@tanstack/react-router";
import {
  Smartphone,
  ShieldCheck,
  Clock,
  CheckCircle2,
  MessageCircle,
  Phone,
  Sparkles,
  ChevronRight,
  ArrowRight,
  Apple,
  Cpu,
  Eye,
  Check,
  Battery,
  Layers,
} from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { SiteFooter } from "@/components/SiteFooter";

const PHONE = "+918002903643";
const PHONE_DISPLAY = "+91 80029 03643";
const WHATSAPP_URL =
  "https://wa.me/918002903643?text=Hi%20Super%20Telecom,%20I%20need%20an%20iPhone%20repair%20quote%20in%20Giridih";

export const IphoneRepairPage: React.FC = () => {
  const IPHONE_MODELS = [
    { series: "iPhone 16 Series", models: "iPhone 16, 16 Plus, 16 Pro, 16 Pro Max" },
    { series: "iPhone 15 Series", models: "iPhone 15, 15 Plus, 15 Pro, 15 Pro Max" },
    { series: "iPhone 14 Series", models: "iPhone 14, 14 Plus, 14 Pro, 14 Pro Max" },
    { series: "iPhone 13 Series", models: "iPhone 13, 13 Mini, 13 Pro, 13 Pro Max" },
    { series: "iPhone 12 Series", models: "iPhone 12, 12 Mini, 12 Pro, 12 Pro Max" },
    { series: "iPhone 11 & XR", models: "iPhone 11, 11 Pro, 11 Pro Max, iPhone XR / SE" },
  ];

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
              <span>iPhone Diagnosis</span>
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-12 pb-20 md:pt-16 md:pb-28 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="mx-auto max-w-5xl px-4 sm:px-6 relative z-10">
            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
              <Link to="/" className="hover:text-foreground">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <Link to="/services" className="hover:text-foreground">Services</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-cyan-400 font-semibold">iPhone Repair Specialist</span>
            </nav>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold uppercase mb-5">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              Giridih&apos;s Dedicated Apple Care Hub · Barganda Road
            </div>

            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
              iPhone Repair Service Centre in Giridih
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
              Precision Apple repairs executed by micro-soldering specialists. Same-day OLED display replacement with True Tone programming, 100% battery health calibration, laser back glass separation, and Face ID restoration.
            </p>

            {/* Badges Bar */}
            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 font-semibold">
                <Clock className="h-4 w-4" /> 45-Min Express Repairs
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 font-semibold">
                <ShieldCheck className="h-4 w-4" /> Up to 90 Days Warranty
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 font-semibold">
                <Cpu className="h-4 w-4" /> Motherboard BGA Micro-Soldering
              </span>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-3.5 text-sm shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-transform hover:scale-[1.03]"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Get Instant iPhone Quote on WhatsApp</span>
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href={`tel:${PHONE}`}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-white font-semibold px-6 py-3.5 text-sm transition-colors"
              >
                <Phone className="h-4 w-4 text-cyan-400" />
                <span>Call Store: +91 80029 03643</span>
              </a>
            </div>
          </div>
        </section>

        {/* Apple Model Matrix */}
        <section className="py-16 bg-slate-950 border-t border-slate-800/80">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white text-center mb-4">
              iPhone Models Repaired at Super Telecom Giridih
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 text-center max-w-2xl mx-auto mb-10">
              We stock parts for every generation of iPhone with on-the-spot component replacement.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {IPHONE_MODELS.map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{item.series}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-400">
                      All Parts Ready
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.models}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Specialized Apple Services Grid */}
        <section className="py-16 bg-surface/50 border-t border-border/60">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground text-center mb-10">
              Specialized iPhone Engineering Services
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="p-2.5 rounded-2xl bg-cyan-950 border border-cyan-500/30 text-cyan-400 w-fit">
                  <Eye className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-white">True Tone &amp; Touch IC Transfer</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  We program and write the original EEPROM serial data into your new display so True Tone, ambient light auto-brightness, and 120Hz refresh operate flawlessly.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="p-2.5 rounded-2xl bg-emerald-950 border border-emerald-500/30 text-emerald-400 w-fit">
                  <Battery className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-white">100% Battery Health Fix</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Original BMS flex welding removes the annoying &ldquo;Unknown Part&rdquo; prompt and restores maximum capacity percentage readout in iOS settings.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="p-2.5 rounded-2xl bg-amber-950 border border-amber-500/30 text-amber-400 w-fit">
                  <Layers className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-white">Laser Back Glass Separation</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  High-precision cold laser burns off factory epoxy without dismantling your phone, keeping internal logic boards safe and preserving wireless charging.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16 bg-slate-950 border-t border-slate-800">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white text-center mb-10">
              iPhone Repair FAQs (Giridih)
            </h2>

            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <h3 className="font-bold text-white text-sm">Can you fix Face ID if it says &ldquo;Move iPhone higher/lower&rdquo;?</h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  Yes. We repair the flood illuminator, dot projector, and infrared camera ribbon flex under stereo microscopes without requiring motherboard swap.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <h3 className="font-bold text-white text-sm">Do you fix iPhones that are stuck on the Apple logo or bootlooping?</h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  Yes. We diagnose iTunes Error 4013, Error 9, and NAND storage corruption with specialized programmers to revive your iPhone without losing data whenever possible.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <h3 className="font-bold text-white text-sm">Are repair prices cheaper than official Apple service in Ranchi/Dhanbad?</h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  Yes, up to 60–70% more economical with same-day turnaround right here on Barganda Road, Giridih, backed by warranty.
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

export default IphoneRepairPage;
