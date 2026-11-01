import React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ChevronRight,
  ArrowRight,
  MapPin,
  MessageCircle,
  Phone,
  Clock,
  ShieldCheck,
  Star,
  CheckCircle2,
  Smartphone,
  BatteryCharging,
  Zap,
  Cpu,
  Droplets,
  Activity,
  Camera,
  Volume2,
  Mic,
  Wifi,
  Terminal,
  Fingerprint,
  ToggleLeft,
  HardDrive,
  Flame,
  Shield,
  Wrench,
} from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { SiteFooter } from "@/components/SiteFooter";
import {
  REPAIR_SERVICES_SILO_DATA,
  GIRIDIH_AREAS_SERVED,
} from "@/data/repairServicesSiloData";
import { SITE_URL, STORE_ADDRESS } from "@/data/site";
import { BUSINESS_MASTER } from "@/config/superTelecomConfig";

const TITLE = "All 16 Mobile Repair Services in Giridih | Super Telecom";
const DESC =
  "Explore Super Telecom's 16 dedicated smartphone repair services in Giridih on Barganda Road: AMOLED display replacement, original battery, charging port, BGA motherboard IC rework, water damage, green line fix & data recovery with 90-day warranty.";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Smartphone,
  BatteryCharging,
  Zap,
  Cpu,
  Droplets,
  Activity,
  Camera,
  Volume2,
  Mic,
  Wifi,
  Terminal,
  Fingerprint,
  ToggleLeft,
  HardDrive,
  Flame,
  Shield,
};

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/services` },
      { property: "og:image", content: `${SITE_URL}/super-telecom-logo.png` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "geo.region", content: "IN-JH" },
      { name: "geo.placename", content: "Giridih" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/services` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: TITLE,
          description: DESC,
          url: `${SITE_URL}/services`,
          mainEntity: {
            "@type": "ItemList",
            itemListElement: REPAIR_SERVICES_SILO_DATA.map((service, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: service.title,
              url: `${SITE_URL}/services/${service.slug}`,
            })),
          },
        }),
      },
    ],
  }),
  component: ServicesIndex,
});

function ServicesIndex() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
          <BrandLogo size="md" to="/" />
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={`tel:${BUSINESS_MASTER.phoneRaw}`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition-all"
            >
              <Phone className="h-3.5 w-3.5 text-cyan-400" />
              <span className="hidden sm:inline">कॉल करें: {BUSINESS_MASTER.phoneDisplay}</span>
              <span className="sm:hidden">Call</span>
            </a>
            <a
              href={`https://wa.me/${BUSINESS_MASTER.whatsappNumber}?text=${encodeURIComponent(
                "Namaste Super Telecom! I want to inquire about mobile repair services in Giridih."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2 text-xs font-bold text-slate-950 shadow-md shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:py-14 space-y-10 sm:space-y-12">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs text-slate-400 font-medium"
        >
          <Link to="/" className="hover:text-cyan-400 transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
          <span className="text-cyan-400 font-semibold">Repair Services</span>
        </nav>

        {/* Hero Banner */}
        <div className="space-y-4 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/40 bg-cyan-950/70 px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-wider text-cyan-300">
              <MapPin className="h-3.5 w-3.5 text-cyan-400" /> Barganda Road, Giridih
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-950/60 px-3 py-1 text-xs font-mono font-bold text-amber-300">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> 4.9 ★ (1,200+ Reviews)
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-950/60 px-3 py-1 text-xs font-mono font-bold text-emerald-300">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> 10+ Years (Est. 2016)
            </span>
          </div>

          <h1 className="font-display text-3xl font-extrabold sm:text-5xl text-white tracking-tight leading-tight">
            All 16 Dedicated Mobile Repair Services in Giridih
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            सुपर टेलीकॉम गिरिडीह में सभी स्मार्टफोन समस्याओं के लिए 16 समर्पित रिपेयर सेवाएं उपलब्ध हैं। नीचे अपनी सेवा चुनें और विस्तृत गाइड, अनुमानित खर्च, समय व 90 दिन की लिखित वारंटी देखें:
          </p>
        </div>

        {/* 16 Services Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {REPAIR_SERVICES_SILO_DATA.map((service, index) => {
            const Icon = ICON_MAP[service.iconName] || Wrench;
            const whatsappLink = `https://wa.me/${BUSINESS_MASTER.whatsappNumber}?text=${encodeURIComponent(
              `Hi Super Telecom! Please give me a quote for "${service.title}" in Giridih.`
            )}`;

            return (
              <article
                key={service.slug}
                className="group relative flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md transition-all duration-300 hover:border-cyan-500/50 hover:bg-slate-900/90 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/10"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {service.badge}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h2 className="font-display text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                      <Link to="/services/$slug" params={{ slug: service.slug }}>
                        {service.title}
                      </Link>
                    </h2>
                    <p className="text-xs font-semibold text-cyan-400">
                      {service.hindiTitle}
                    </p>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                    {service.heroSummary}
                  </p>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                    <span className="text-cyan-300 font-bold">{service.priceRangeInr}</span>
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="h-3 w-3 text-cyan-400" /> {service.turnaroundTime}
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                  <Link
                    to="/services/$slug"
                    params={{ slug: service.slug }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 hover:underline"
                  >
                    <span>View Full Guide & Price</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>

                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-bold text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 transition-all"
                  >
                    WhatsApp Quote
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        {/* Local Areas Served */}
        <section className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
            <MapPin className="h-4 w-4" />
            <span>Local Service Coverage in Giridih</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold font-display text-white">
            Serving Customers Across Giridih & Surrounding Areas
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            You can visit our main laboratory on Barganda Road from any location across Giridih:
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {GIRIDIH_AREAS_SERVED.map((area) => (
              <span
                key={area}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-medium"
              >
                {area}
              </span>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

export default ServicesIndex;
