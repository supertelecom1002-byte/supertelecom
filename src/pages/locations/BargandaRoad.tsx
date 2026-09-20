import React from "react";
import { Link } from "@tanstack/react-router";
import {
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  Navigation,
  ShieldCheck,
  Smartphone,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Car,
  Compass,
  Zap,
  Wrench,
  Apple,
  Cpu,
  Battery,
} from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { SiteFooter } from "@/components/SiteFooter";

const PHONE = "+918002903643";
const PHONE_DISPLAY = "+91 80029 03643";
const MAPS_URL = "https://maps.app.goo.gl/mu5XXCehEpocaZWY9";
const WHATSAPP_URL =
  "https://wa.me/918002903643?text=Hi%20Super%20Telecom,%20I%20am%20visiting%20your%20Barganda%20Road%20repair%20shop%20in%20Giridih.%20Can%20you%20help%20me%20with%20phone%20repair?";

export const BargandaRoadPage: React.FC = () => {
  const LOCAL_AREAS = [
    "Barganda",
    "Makatpur Chowk",
    "Bada Chowk",
    "Pachamba",
    "Court Road",
    "Mohanpur",
    "Sirsia",
    "Mufassil",
    "Tower Chowk",
    "Isri Bazar",
    "Bengabad",
    "Gandey",
  ];

  const POPULAR_SERVICES = [
    {
      title: "Mobile Screen & OLED Replacement",
      time: "30 Mins",
      price: "From ₹1,199",
      href: "/services/display-replacement-giridih",
      icon: Smartphone,
    },
    {
      title: "iPhone Specialist Service & Back Glass",
      time: "45 Mins",
      price: "From ₹1,499",
      href: "/services/iphone-repair-specialist-giridih",
      icon: Apple,
    },
    {
      title: "Motherboard BGA & IC Micro-soldering",
      time: "Same Day",
      price: "From ₹799",
      href: "/services/motherboard-chip-level-repair-giridih",
      icon: Cpu,
    },
    {
      title: "Battery & Charging Port Replacement",
      time: "20 Mins",
      price: "From ₹350",
      href: "/services/battery-charging-port-repair-giridih",
      icon: Battery,
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
              <span>Contact Store</span>
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
              <span className="text-muted-foreground">Locations</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-cyan-400 font-semibold">Barganda Road, Giridih</span>
            </nav>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium mb-4">
              <MapPin className="h-3.5 w-3.5" />
              <span>Central Giridih Tech Hub • Near Shivam Clinic</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight mb-6">
              Top Mobile Repair Shop in <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400">
                Barganda Road, Giridih
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed mb-8">
              Super Telecom is Giridih&apos;s leading smartphone repair workshop located on prime Barganda Road, right near Shivam Clinic. Equipped with high-end optical microscopes, laser back glass separators, and BGA soldering stations, we solve complex smartphone issues in 30 minutes while you wait.
            </p>

            {/* Quick Information Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <MapPin className="h-5 w-5 text-cyan-400 mb-2" />
                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Shop Address</div>
                <div className="text-sm font-bold text-white mt-1">
                  Barganda Road, Near Shivam Clinic
                </div>
                <div className="text-xs text-slate-400">Giridih, Jharkhand 815301</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <Clock className="h-5 w-5 text-amber-400 mb-2" />
                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Store Timings</div>
                <div className="text-sm font-bold text-white mt-1">10:00 AM – 9:30 PM</div>
                <div className="text-xs text-emerald-400 font-medium">Open All 7 Days (Including Sundays)</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <Phone className="h-5 w-5 text-emerald-400 mb-2" />
                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Direct Helpline</div>
                <div className="text-sm font-bold text-white mt-1">{PHONE_DISPLAY}</div>
                <div className="text-xs text-slate-400">Call or WhatsApp for immediate help</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-3.5 text-sm shadow-xl shadow-cyan-500/20 transition-all hover:scale-[1.02]"
              >
                <Navigation className="h-4 w-4" />
                <span>Get Directions on Google Maps</span>
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3.5 text-sm shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.02]"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Message on WhatsApp</span>
              </a>
              <a
                href={`tel:${PHONE}`}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-white font-semibold px-6 py-3.5 text-sm transition-colors"
              >
                <Phone className="h-4 w-4 text-cyan-400" />
                <span>Call Store Now</span>
              </a>
            </div>
          </div>
        </section>

        {/* Directions & Navigation Guide */}
        <section className="py-16 bg-slate-900/50 border-y border-slate-800">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                How to Reach Super Telecom on Barganda Road
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Conveniently situated right in the center of Giridih with accessible parking and landmark navigation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="h-10 w-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3">
                  <Compass className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">From Makatpur Chowk</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Head straight along Barganda Road for approximately 1 kilometer toward Shivam Clinic. Super Telecom is on the main road on your left.
                </p>
                <div className="text-xs font-semibold text-cyan-400 mt-3 flex items-center gap-1">
                  <span>~3 mins travel time</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
                  <Navigation className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">From Giridih Bus Stand</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Drive towards Bada Chowk and connect to Barganda Road. We are situated 1.5 km away, conveniently reachable via auto-rickshaw or two-wheeler.
                </p>
                <div className="text-xs font-semibold text-amber-400 mt-3 flex items-center gap-1">
                  <span>~5 mins travel time</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
                  <Car className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">From Pachamba &amp; Court Road</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Take the Court Road arterial link toward Barganda. Ample two-wheeler parking and convenient vehicle drop-off space directly outside our workshop.
                </p>
                <div className="text-xs font-semibold text-emerald-400 mt-3 flex items-center gap-1">
                  <span>~6-8 mins travel time</span>
                </div>
              </div>
            </div>

            {/* Google Map Iframe Placeholder / Direction Box */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block mb-1">Live Map Navigation</span>
                <h3 className="text-lg font-bold text-white mb-1">Looking for live GPS directions to our store?</h3>
                <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                  Click the navigation button to open Google Maps directly on your smartphone for turn-by-turn routing to Super Telecom, Barganda Road, Giridih.
                </p>
              </div>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-3 text-xs transition-colors"
              >
                <Navigation className="h-4 w-4" />
                <span>Open Google Maps</span>
              </a>
            </div>
          </div>
        </section>

        {/* Local Services Offered */}
        <section className="py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                Expert Repair Services Available at Barganda Road
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                All repairs are carried out transparently on-site with testing equipment and 90-day warranty coverage.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {POPULAR_SERVICES.map((srv, idx) => {
                const Icon = srv.icon;
                return (
                  <Link
                    key={idx}
                    to={srv.href}
                    className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="h-10 w-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-slate-800 text-emerald-400 text-xs font-bold">
                          {srv.price}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors mb-1">
                        {srv.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                        <Clock className="h-3.5 w-3.5 text-amber-400" />
                        <span>Average turnaround: {srv.time}</span>
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 group-hover:translate-x-1 transition-transform">
                      <span>View details &amp; pricing</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Hyperlocal Coverage Giridih */}
        <section className="py-16 bg-slate-900/40 border-t border-slate-800">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                Serving Customers Across Giridih District
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Customers from all corners of Giridih visit our central Barganda Road location for specialist diagnostics and instant hardware turnaround.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-4xl mx-auto">
              {LOCAL_AREAS.map((area, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:border-cyan-500/30 transition-colors"
                >
                  <MapPin className="h-3 w-3 text-cyan-400" />
                  <span>{area}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs Section */}
        <section className="py-16 bg-slate-950 border-t border-slate-800">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white text-center mb-10">
              Barganda Road Store FAQs
            </h2>

            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <h3 className="font-bold text-white text-sm">Where exactly is Super Telecom on Barganda Road?</h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  We are situated on main Barganda Road, right near Shivam Clinic in Giridih (PIN: 815301). Our shop features prominent signage and is located approximately 1 km from Makatpur Chowk.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <h3 className="font-bold text-white text-sm">Do I need an appointment before visiting?</h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  No appointment is necessary! We welcome walk-in customers every day from 10:00 AM to 9:30 PM. Screen replacements, batteries, and port repairs are handled on the spot while you wait.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <h3 className="font-bold text-white text-sm">Is parking available near the store?</h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  Yes, there is convenient dedicated two-wheeler parking directly outside our shop front as well as easy pull-over space on Barganda Road for car drop-offs.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <h3 className="font-bold text-white text-sm">Which mobile phone brands do you service?</h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  We repair all brands including Apple iPhone, Samsung Galaxy, OnePlus, Xiaomi Redmi, Realme, Vivo, Oppo, Motorola, Poco, and Google Pixel.
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

export default BargandaRoadPage;
