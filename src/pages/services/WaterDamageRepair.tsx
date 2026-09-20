import React from "react";
import { Link } from "@tanstack/react-router";
import {
  Droplets,
  ShieldCheck,
  Clock,
  CheckCircle2,
  MessageCircle,
  Phone,
  ChevronRight,
  ArrowRight,
  Flame,
  AlertTriangle,
  Zap,
  Microscope,
  HardDrive,
  Check,
} from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { SiteFooter } from "@/components/SiteFooter";

const PHONE = "+918002903643";
const PHONE_DISPLAY = "+91 80029 03643";
const WHATSAPP_URL =
  "https://wa.me/918002903643?text=Hi%20Super%20Telecom,%20my%20phone%20fell%20in%20water/liquid.%20I%20need%20emergency%20water%20damage%20repair%20in%20Giridih";

export const WaterDamageRepairPage: React.FC = () => {
  const EMERGENCY_STEPS = [
    {
      step: "01",
      title: "Power Off Immediately",
      desc: "Do not attempt to turn the device on or check notifications. Cutting power stops active electrolytic corrosion.",
    },
    {
      step: "02",
      title: "Never Plug in a Charger",
      desc: "Plugging in electricity through wet power rails causes immediate short circuits, burning out the PMIC and CPU.",
    },
    {
      step: "03",
      title: "Avoid the 'Rice Myth'",
      desc: "Rice does not extract internal moisture. Rice dust and starch enter charging ports, speeding up internal corrosion.",
    },
    {
      step: "04",
      title: "Rush to Super Telecom",
      desc: "Bring your device directly to Barganda Road, Giridih for ultrasonic PCB chemical bath and rapid dehydration.",
    },
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
              <span>Emergency Help</span>
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-12 pb-20 md:pt-16 md:pb-28 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="mx-auto max-w-5xl px-4 sm:px-6 relative z-10">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
              <Link to="/" className="hover:text-foreground">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <Link to="/services" className="hover:text-foreground">Services</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-cyan-400 font-semibold">Water Damage Mobile Repair</span>
            </nav>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-cyan-400 text-xs font-medium mb-4">
              <Droplets className="h-3.5 w-3.5" />
              <span>Ultrasonic PCB Chemical Bath &amp; IC Recovery • Giridih</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight mb-6">
              Water Damage Mobile Repair <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400">
                in Giridih | Super Telecom
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed mb-8">
              Dropped your phone in water, rain, or tea? Don&apos;t panic or try charging it. Super Telecom on Barganda Road, Giridih provides emergency ultrasonic board de-oxidation, micro-soldering short-circuit removal, and chip-level data recovery with an 85%+ success rate.
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <Droplets className="h-5 w-5 text-blue-400 mb-1" />
                <div className="font-bold text-sm text-white">Ultrasonic Tank</div>
                <div className="text-xs text-slate-400">Deep De-oxidation</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <HardDrive className="h-5 w-5 text-emerald-400 mb-1" />
                <div className="font-bold text-sm text-white">85%+ Recovery</div>
                <div className="text-xs text-slate-400">Data Preservation</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <Microscope className="h-5 w-5 text-cyan-400 mb-1" />
                <div className="font-bold text-sm text-white">BGA Microscope</div>
                <div className="text-xs text-slate-400">Corrosion Inspection</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <Clock className="h-5 w-5 text-amber-400 mb-1" />
                <div className="font-bold text-sm text-white">Same-Day Rush</div>
                <div className="text-xs text-slate-400">Emergency Protocol</div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3.5 text-sm shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.02]"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Emergency Water Damage Chat</span>
              </a>
              <a
                href={`tel:${PHONE}`}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-white font-semibold px-6 py-3.5 text-sm transition-colors"
              >
                <Phone className="h-4 w-4 text-cyan-400" />
                <span>Call +91 80029 03643</span>
              </a>
            </div>
          </div>
        </section>

        {/* Emergency First Aid Checklist */}
        <section className="py-16 bg-slate-900/50 border-y border-slate-800">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                Emergency First Aid: What to Do Immediately
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Your immediate actions within the first 60 minutes determine whether your motherboard can be saved.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {EMERGENCY_STEPS.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 relative group hover:border-cyan-500/40 transition-colors"
                >
                  <span className="text-2xl font-black text-cyan-500/30 group-hover:text-cyan-400/50 transition-colors block mb-2">
                    {item.step}
                  </span>
                  <h3 className="text-sm font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Restoration Process */}
        <section className="py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                Our Water Damage Restoration Protocol
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Scientific de-oxidation and micro-soldering repair rather than unproven amateur shortcuts.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
                  <Droplets className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-white text-base mb-2">1. Ultrasonic Chemical Bath</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The motherboard is desoldered from shielding cans and submerged in an ultrasonic tank with high-grade electronics solvent. Micro-vibrations blast away corrosion minerals beneath surface mount ICs.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="h-10 w-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4">
                  <Zap className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-white text-base mb-2">2. Thermal Short Identification</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Using high-precision DC power supplies and infrared thermal cameras, we pinpoint shorted capacitors, burned diodes, and damaged power rails down to the millimeter.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                  <HardDrive className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-white text-base mb-2">3. BGA Rework &amp; Data Recovery</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Corroded ICs are cleaned, reballed, and resoldered under stereoscopic magnification. We ensure your critical photos, contacts, and personal data remain intact.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16 bg-slate-950 border-t border-slate-800">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white text-center mb-10">
              Water Damage FAQs
            </h2>

            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <h3 className="font-bold text-white text-sm">Can a completely dead water-damaged phone be saved?</h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  Yes, in over 85% of cases! As long as the phone was not repeatedly powered on or charged while soaked, our ultrasonic cleaning and chip-level short removal frequently revive the logic board.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <h3 className="font-bold text-white text-sm">Why is putting a wet phone in rice bad?</h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  Rice only absorbs surface moisture while trapping internal humidity. Even worse, rice powder forms a sticky corrosive paste on internal copper traces, causing permanent damage.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <h3 className="font-bold text-white text-sm">How much does water damage repair cost in Giridih?</h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  Inspection and ultrasonic de-oxidation starts at ₹499. If specific ICs or power components require micro-soldering, we provide a transparent quote before proceeding.
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

export default WaterDamageRepairPage;
