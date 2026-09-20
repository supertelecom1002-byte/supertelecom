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
  Zap,
  Layers,
  HelpCircle,
  Check,
  Star,
  Eye,
} from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { SiteFooter } from "@/components/SiteFooter";

const PHONE = "+918002903643";
const PHONE_DISPLAY = "+91 80029 03643";
const WHATSAPP_URL =
  "https://wa.me/918002903643?text=Hi%20Super%20Telecom,%20I%20need%20a%20quote%20for%20mobile%20screen%20replacement%20in%20Giridih";

export const DisplayReplacementPage: React.FC = () => {
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
              <span>WhatsApp Quote</span>
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-12 pb-20 md:pt-16 md:pb-28 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="mx-auto max-w-5xl px-4 sm:px-6 relative z-10">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
              <Link to="/" className="hover:text-foreground">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <Link to="/services" className="hover:text-foreground">Services</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-cyan-400 font-semibold">Screen &amp; Display Replacement</span>
            </nav>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold uppercase mb-5">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              Giridih&apos;s #1 Display Lab · 30-Min Walk-In Fix
            </div>

            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
              Mobile Screen &amp; Display Replacement in Giridih
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
              Cracked, black, or flickering phone screen? Super Telecom on Barganda Road provides same-day OEM OLED, AMOLED, and IPS display replacements with tested 10-point touch response and up to <strong>90-day warranty</strong>.
            </p>

            {/* Badges Bar */}
            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 font-semibold">
                <Clock className="h-4 w-4" /> 30–45 Mins Turnaround
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 font-semibold">
                <ShieldCheck className="h-4 w-4" /> Up to 90 Days Warranty
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 font-semibold">
                <Eye className="h-4 w-4" /> 100% Color &amp; Touch Verified
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
                <span>Get Instant Price Quote on WhatsApp</span>
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

        {/* Pricing Matrix Section */}
        <section className="py-16 bg-slate-950 border-t border-slate-800/80">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Display Replacement Price Guide (Giridih)
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-2">
                Transparent rates with zero hidden labour charges. Exact price quote provided upfront before service.
              </p>
            </div>

            <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[11px] border-b border-slate-800">
                    <tr>
                      <th className="py-4 px-6">Display Tier</th>
                      <th className="py-4 px-6">Compatible Devices</th>
                      <th className="py-4 px-6">Price Range</th>
                      <th className="py-4 px-6">Warranty</th>
                      <th className="py-4 px-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    <tr className="hover:bg-cyan-950/20">
                      <td className="py-4 px-6 font-bold text-white">iPhone Super Retina OLED</td>
                      <td className="py-4 px-6 text-slate-400">iPhone X, 11 Pro, 12, 13, 14, 15 Series</td>
                      <td className="py-4 px-6 font-mono font-bold text-emerald-400">₹2,499 – ₹9,999</td>
                      <td className="py-4 px-6 text-cyan-400">90 Days</td>
                      <td className="py-4 px-6 text-right">
                        <a href={WHATSAPP_URL} className="text-cyan-400 hover:underline font-semibold">Book &rarr;</a>
                      </td>
                    </tr>
                    <tr className="hover:bg-cyan-950/20">
                      <td className="py-4 px-6 font-bold text-white">Android Curved &amp; AMOLED</td>
                      <td className="py-4 px-6 text-slate-400">Samsung S/A Series, OnePlus, Vivo, Realme</td>
                      <td className="py-4 px-6 font-mono font-bold text-emerald-400">₹1,899 – ₹5,499</td>
                      <td className="py-4 px-6 text-cyan-400">90 Days</td>
                      <td className="py-4 px-6 text-right">
                        <a href={WHATSAPP_URL} className="text-cyan-400 hover:underline font-semibold">Book &rarr;</a>
                      </td>
                    </tr>
                    <tr className="hover:bg-cyan-950/20">
                      <td className="py-4 px-6 font-bold text-white">Standard IPS LCD Display</td>
                      <td className="py-4 px-6 text-slate-400">Redmi, Realme, POCO, Moto, Samsung M Series</td>
                      <td className="py-4 px-6 font-mono font-bold text-emerald-400">₹999 – ₹2,499</td>
                      <td className="py-4 px-6 text-cyan-400">60 Days</td>
                      <td className="py-4 px-6 text-right">
                        <a href={WHATSAPP_URL} className="text-cyan-400 hover:underline font-semibold">Book &rarr;</a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* OLED vs AMOLED vs LCD Comparison */}
        <section className="py-16 bg-surface/50 border-t border-border/60">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground text-center mb-10">
              OLED vs. AMOLED vs. LCD Screen Differences
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="p-2.5 rounded-2xl bg-cyan-950 border border-cyan-500/30 text-cyan-400 w-fit">
                  <Smartphone className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Original OLED</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Individual self-lit pixels providing deep true blacks and highest contrast. Factory-spec choice for modern iPhones and flagship Androids.
                </p>
                <ul className="text-xs space-y-1.5 text-slate-300 pt-2">
                  <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-400" /> True Tone Support</li>
                  <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-400" /> 120Hz ProMotion Ready</li>
                </ul>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="p-2.5 rounded-2xl bg-emerald-950 border border-emerald-500/30 text-emerald-400 w-fit">
                  <Zap className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Super AMOLED</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Ultra-vibrant punchy colors and integrated in-display fingerprint sensor compatibility for Samsung, OnePlus, and Vivo devices.
                </p>
                <ul className="text-xs space-y-1.5 text-slate-300 pt-2">
                  <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-400" /> In-Display Fingerprint Works</li>
                  <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-400" /> Low Battery Consumption</li>
                </ul>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="p-2.5 rounded-2xl bg-amber-950 border border-amber-500/30 text-amber-400 w-fit">
                  <Layers className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Tested IPS LCD</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Cost-effective durable replacement screens with high outdoor brightness and reliable capacitive multi-touch responsiveness.
                </p>
                <ul className="text-xs space-y-1.5 text-slate-300 pt-2">
                  <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-400" /> Budget Friendly Pricing</li>
                  <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-400" /> Scratch-Resistant Glass</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16 bg-slate-950 border-t border-slate-800">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white text-center mb-10">
              Screen Replacement Questions Answered
            </h2>

            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <h3 className="font-bold text-white text-sm">How long does mobile screen replacement take at Super Telecom?</h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  Most screen replacements for iPhone, Samsung, Realme, and Vivo take just 30 to 45 minutes while you wait in our Barganda Road shop.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <h3 className="font-bold text-white text-sm">Will my fingerprint scanner and Face ID work after screen change?</h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  Yes. We take special care to calibrate optical in-display fingerprint sensors and protect the Face ID ear-speaker flex sensors during disassembly.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <h3 className="font-bold text-white text-sm">What is the warranty period on replacement screens?</h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  We provide up to a 90-day warranty on touchscreen functionality and display quality. If any unexpected touch freeze occurs, we resolve it without hassle.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <h3 className="font-bold text-white text-sm">Is my data safe during display repair?</h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  Yes, 100%. Screen replacement is a hardware-only service and never wipes your photos, messages, or apps.
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

export default DisplayReplacementPage;
