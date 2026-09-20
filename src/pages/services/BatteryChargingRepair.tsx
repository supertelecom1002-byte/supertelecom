import React from "react";
import { Link } from "@tanstack/react-router";
import {
  Battery,
  Zap,
  ShieldCheck,
  Clock,
  CheckCircle2,
  MessageCircle,
  Phone,
  Sparkles,
  ChevronRight,
  ArrowRight,
  Flame,
  AlertTriangle,
  Cable,
  Check,
  Smartphone,
  Layers,
  Thermometer,
} from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { SiteFooter } from "@/components/SiteFooter";

const PHONE = "+918002903643";
const PHONE_DISPLAY = "+91 80029 03643";
const WHATSAPP_URL =
  "https://wa.me/918002903643?text=Hi%20Super%20Telecom,%20my%20phone%20has%20battery/charging%20issues.%20Please%20share%20estimated%20repair%20time%20and%20cost%20in%20Giridih";

export const BatteryChargingRepairPage: React.FC = () => {
  const SYMPTOMS = [
    {
      title: "Rapid Battery Drain",
      description: "Battery drops from 100% to 20% in just 2-3 hours of casual usage.",
      icon: Battery,
    },
    {
      title: "Sudden Shutdowns at 20-30%",
      description: "Phone dies instantly when opening camera, games, or answering a phone call.",
      icon: Zap,
    },
    {
      title: "Loose Charging Pin / Cable Falls Out",
      description: "You have to hold the cable at a specific angle or tilt to get it to charge.",
      icon: Cable,
    },
    {
      title: "Battery Swelling & Bulging Screen",
      description: "Screen or back glass lifting away due to expanding dangerous lithium-ion cells.",
      icon: Flame,
    },
    {
      title: "Fake Charging / Stuck at 1%",
      description: "Charging lightning icon shows, but percentage never increases due to faulty charging IC.",
      icon: Thermometer,
    },
    {
      title: "Slow or Intermittent Charging",
      description: "Takes 4+ hours to reach full charge or repeatedly connects and disconnects.",
      icon: AlertTriangle,
    },
  ];

  const PRICING = [
    {
      service: "Android High-Capacity Battery",
      turnaround: "20 Mins",
      price: "From ₹899",
      specs: "OEM High-density cells, 90-day warranty, full safety test",
      popular: true,
    },
    {
      service: "iPhone Premium Battery Replacement",
      turnaround: "30 Mins",
      price: "From ₹1,499",
      specs: "Original grade cells, 0 cycle count, 90-day warranty",
      popular: false,
    },
    {
      service: "Type-C / Lightning Port Replacement",
      turnaround: "25 Mins",
      price: "From ₹350",
      specs: "Original fast-charge compatible sub-board with mic & OTG",
      popular: true,
    },
    {
      service: "Port Ultrasonic Clean & Pin Alignment",
      turnaround: "15 Mins",
      price: "From ₹199",
      specs: "Lint removal, corrosion de-oxidation, micro-pin straightening",
      popular: false,
    },
    {
      service: "Motherboard Charging IC / PMIC Repair",
      turnaround: "Same Day",
      price: "From ₹999",
      specs: "BGA micro-soldering for fake charge, short circuit, 0% stuck",
      popular: false,
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
              <span>Get Instant Quote</span>
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
              <span className="text-amber-400 font-semibold">Battery &amp; Charging Port Repair</span>
            </nav>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium mb-4">
              <Zap className="h-3.5 w-3.5" />
              <span>20-Minute Express Replacement in Giridih</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight mb-6">
              Mobile Battery Replacement &amp; <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-cyan-400">
                Charging Port Repair in Giridih
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed mb-8">
              Is your phone draining within hours, shutting down randomly at 30%, or failing to charge unless you wiggle the cable? Super Telecom provides fast, reliable OEM battery replacement and precision charging port repairs on Barganda Road, Giridih with a 90-day warranty.
            </p>

            {/* Key Value Points */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <Clock className="h-5 w-5 text-amber-400 mb-1" />
                <div className="font-bold text-sm text-white">20-30 Mins</div>
                <div className="text-xs text-slate-400">While-You-Wait</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <ShieldCheck className="h-5 w-5 text-emerald-400 mb-1" />
                <div className="font-bold text-sm text-white">90-Day Warranty</div>
                <div className="text-xs text-slate-400">Hassle-Free Replacement</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <Zap className="h-5 w-5 text-cyan-400 mb-1" />
                <div className="font-bold text-sm text-white">Fast-Charge Ready</div>
                <div className="text-xs text-slate-400">SuperVOOC / PD / Turbo</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <CheckCircle2 className="h-5 w-5 text-amber-400 mb-1" />
                <div className="font-bold text-sm text-white">Digital Tested</div>
                <div className="text-xs text-slate-400">USB Power Meter Check</div>
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
                <span>Fix Battery / Port on WhatsApp</span>
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

        {/* Symptoms Section */}
        <section className="py-16 bg-slate-900/50 border-y border-slate-800">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                Common Signs Your Phone Needs a Battery or Port Fix
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Identify the symptoms early before battery swelling causes irreversible display cracking or motherboard damage.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {SYMPTOMS.map((s, idx) => {
                const Icon = s.icon;
                return (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition-colors"
                  >
                    <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1.5">{s.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{s.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Dangerous Swollen Battery Alert */}
        <section className="py-12 bg-amber-950/20 border-b border-amber-500/20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row items-start gap-4 p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 to-slate-900 border border-amber-500/30">
              <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                <Flame className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-amber-300 mb-1">
                  WARNING: Do Not Ignore a Swollen or Expanding Battery!
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3">
                  When a lithium battery degrades, it generates pressurized gas causing the battery pack to expand. This pressure can crack your OLED screen from underneath, pop open the rear glass, or cause thermal runaway (smoke and fire hazard). If your screen is lifting, stop charging immediately and visit Super Telecom Barganda Road for safe removal.
                </p>
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Free Physical Battery Safety Inspection Available Daily</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing & Services Table */}
        <section className="py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                Transparent Battery &amp; Port Repair Pricing in Giridih
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Fair prices with genuine high-density cells, precision soldering, and zero hidden charges.
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl">
              <table className="w-full text-left text-xs sm:text-sm text-slate-300">
                <thead className="bg-slate-950 text-slate-200 uppercase tracking-wider text-[11px] font-bold border-b border-slate-800">
                  <tr>
                    <th scope="col" className="px-5 py-4">Repair Service</th>
                    <th scope="col" className="px-5 py-4">Turnaround</th>
                    <th scope="col" className="px-5 py-4">Starting Price</th>
                    <th scope="col" className="px-5 py-4 hidden md:table-cell">Details &amp; Warranty</th>
                    <th scope="col" className="px-5 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {PRICING.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-5 py-4 font-semibold text-white">
                        <div className="flex items-center gap-2">
                          <span>{item.service}</span>
                          {item.popular && (
                            <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-bold border border-cyan-500/20">
                              Popular
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-amber-400 font-medium whitespace-nowrap">
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          {item.turnaround}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-bold text-emerald-400 whitespace-nowrap">
                        {item.price}
                      </td>
                      <td className="px-5 py-4 text-slate-400 text-xs hidden md:table-cell">
                        {item.specs}
                      </td>
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <a
                          href={`https://wa.me/918002903643?text=Hi%20Super%20Telecom,%20I%20need%20${encodeURIComponent(item.service)}%20in%20Giridih`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 font-semibold text-xs border border-emerald-500/20 transition-all"
                        >
                          <span>Quote</span>
                          <ArrowRight className="h-3 w-3" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Technical Quality & Protocol */}
        <section className="py-16 bg-slate-900/40 border-t border-slate-800">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                Why Choose Super Telecom for Battery &amp; Port Fixes?
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                We do not just swap parts blindly; we inspect the entire power delivery subsystem.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="h-10 w-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4">
                  <Cable className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-white text-base mb-2">Original Charging Sub-Boards</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Cheap market ports lack proper surge protection and disable fast charging. We supply original specification CC boards that preserve VOOC, Warp, PD, and Turbo Charging protocols.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
                  <Thermometer className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-white text-base mb-2">Digital Power Meter Analysis</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Every repaired phone is plugged into our USB voltage/ampere digital analyzer to verify accurate current draw (5V/2A, 9V/2A, 12V/3A) before handing it back to you.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-white text-base mb-2">Safe Adhesion &amp; Waterproof Seals</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  We use factory-grade pull tabs to secure new battery packs cleanly without punctures, and restore perimeter adhesive gaskets to guard against dust and moisture ingress.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16 bg-slate-950 border-t border-slate-800">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white text-center mb-10">
              Frequently Asked Questions (Battery &amp; Charging)
            </h2>

            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <h3 className="font-bold text-white text-sm">How long does mobile battery replacement take at Super Telecom?</h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  Battery replacement for popular models (Xiaomi, Samsung, Realme, Vivo, iPhone) takes just 20 to 30 minutes in our shop on Barganda Road, Giridih. You can wait and watch the installation in person.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <h3 className="font-bold text-white text-sm">Will fast charging (VOOC/SuperVOOC/PD) work after port replacement?</h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  Yes. We install high-grade charging sub-boards and original pin connectors that fully support fast charging protocols, OTG data transfer, and microphone functionality.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <h3 className="font-bold text-white text-sm">What should I do if my phone shows &quot;Moisture Detected in USB Port&quot;?</h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  Do not force a charger into the port. This error can be triggered by dust trapping humidity or oxidized copper pins. Bring it to our shop for a safe ultrasonic clean and pin inspection.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <h3 className="font-bold text-white text-sm">What is the warranty on new batteries?</h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  All replacement batteries come with a 90-day warranty. If the battery experiences abnormal drain or charging issues during this period, we replace it promptly.
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

export default BatteryChargingRepairPage;
