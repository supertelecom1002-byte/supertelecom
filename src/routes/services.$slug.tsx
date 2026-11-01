import React, { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  Phone,
  MessageCircle,
  MapPin,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Star,
  Clock,
  Shield,
  ShieldCheck,
  Wrench,
  AlertTriangle,
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
  ChevronDown,
  Sparkles,
  Check,
} from "lucide-react";
import {
  REPAIR_SERVICES_SILO_DATA,
  getServiceBySlugOrAlias,
  type DedicatedServiceData,
} from "@/data/repairServicesSiloData";
import { SERVICES, type ServiceInfo } from "@/data/services";
import { SITE_URL } from "@/data/site";
import { BUSINESS_MASTER } from "@/config/superTelecomConfig";
import { BrandLogo } from "@/components/BrandLogo";
import { SiteFooter } from "@/components/SiteFooter";
import { ServicePageSeo } from "@/components/seo/ServicePageSeo";

const PHONE = BUSINESS_MASTER.phoneRaw;
const PHONE_DISPLAY = BUSINESS_MASTER.phoneDisplay;
const WHATSAPP = BUSINESS_MASTER.whatsappNumber;
const MAPS = BUSINESS_MASTER.mapsUrl;
const ADDRESS = BUSINESS_MASTER.fullAddress;

// Icon mapping helper
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

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    // 1. Try modern 16 dedicated service silo
    const siloService = getServiceBySlugOrAlias(params.slug);
    if (siloService) {
      return { service: siloService, isSilo: true as const };
    }

    // 2. Fallback to legacy service list for zero breakage
    const legacy = SERVICES.find((s) => s.slug === params.slug);
    if (legacy) {
      return { service: legacy, isSilo: false as const };
    }

    throw notFound();
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Service not found — Super Telecom" },
          { name: "robots", content: "noindex" },
        ],
      };
    }

    const { service, isSilo } = loaderData;
    const url = `${SITE_URL}/services/${params.slug}`;

    if (isSilo) {
      const s = service as DedicatedServiceData;
      return {
        meta: [
          { title: `${s.title} | Super Telecom Giridih` },
          { name: "description", content: s.metaDescription },
          { name: "keywords", content: s.keywords.join(", ") },
          { property: "og:title", content: `${s.title} | Super Telecom Giridih` },
          { property: "og:description", content: s.metaDescription },
          { property: "og:type", content: "article" },
          { property: "og:url", content: url },
          { property: "og:image", content: s.authenticVisual?.image || `${SITE_URL}/super-telecom-logo.png` },
          { property: "og:site_name", content: "Super Telecom Giridih" },
          { name: "twitter:card", content: "summary_large_image" },
          { name: "twitter:title", content: `${s.title} | Super Telecom Giridih` },
          { name: "twitter:description", content: s.metaDescription },
          { name: "geo.region", content: "IN-JH" },
          { name: "geo.placename", content: "Giridih" },
        ],
        links: [{ rel: "canonical", href: `${SITE_URL}/services/${s.slug}` }],
      };
    } else {
      const s = service as ServiceInfo;
      return {
        meta: [
          { title: s.title },
          { name: "description", content: s.description },
          { name: "keywords", content: s.keywords },
          { property: "og:title", content: s.title },
          { property: "og:description", content: s.description },
          { property: "og:url", content: url },
        ],
        links: [{ rel: "canonical", href: url }],
      };
    }
  },
  component: ServiceRouteComponent,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center p-4 bg-slate-950 text-white">
      <div className="text-center space-y-4 max-w-md">
        <h1 className="text-3xl font-bold font-display text-white">Service Not Found</h1>
        <p className="text-sm text-slate-400">
          The repair service you requested could not be located or may have been renamed.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-5 py-2.5 text-sm font-bold shadow-lg"
        >
          Return to Home
        </Link>
      </div>
    </div>
  ),
});

function ServiceRouteComponent() {
  const data = Route.useLoaderData();

  if (data.isSilo) {
    return <DedicatedSingleServicePage service={data.service as DedicatedServiceData} />;
  }

  // Fallback view for legacy service data
  return <LegacyServicePage service={data.service as ServiceInfo} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// MASTER DEDICATED SINGLE-SERVICE PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

interface DedicatedServicePageProps {
  service: DedicatedServiceData;
}

function DedicatedSingleServicePage({ service }: DedicatedServicePageProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const ServiceIcon = ICON_MAP[service.iconName] || Wrench;

  const whatsappHref = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
    `Namaste Super Telecom! I need information about "${service.title}" (${service.hindiTitle}) in Giridih. Starting price is showing ${service.priceRangeInr}. Please share availability and exact quote for my phone.`
  )}`;

  const relatedServices = REPAIR_SERVICES_SILO_DATA.filter((s) =>
    service.relatedSlugs.includes(s.slug)
  ).slice(0, 4);

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-clip bg-slate-950 text-slate-100 font-sans antialiased selection:bg-cyan-500 selection:text-slate-950 pb-20 md:pb-0">
      {/* Inject Rich JSON-LD Graph (Service, RepairShop, FAQPage, BreadcrumbList, Offer) */}
      <ServicePageSeo service={service} />

      {/* Ambient background glows */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[140px]" />
        <div className="absolute top-1/3 -left-40 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[130px]" />
      </div>

      {/* Header with Brand Logo and Contact CTA */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
          <BrandLogo size="md" to="/" />
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={`tel:${PHONE}`}
              aria-label="Call Super Telecom Giridih"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:border-slate-600 hover:bg-slate-800 transition-all"
            >
              <Phone className="h-3.5 w-3.5 text-cyan-400" />
              <span className="hidden sm:inline">कॉल करें: {PHONE_DISPLAY}</span>
              <span className="sm:hidden">Call</span>
            </a>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2 text-xs font-bold text-slate-950 shadow-md shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>WhatsApp Quote</span>
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:py-12 space-y-12 sm:space-y-16">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400 font-medium"
        >
          <Link to="/" className="hover:text-cyan-400 transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-600" />
          <Link to="/services" className="hover:text-cyan-400 transition-colors">
            Repair Services
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-600" />
          <span className="text-cyan-400 font-semibold truncate max-w-[240px] sm:max-w-none">
            {service.title}
          </span>
        </nav>

        {/* 1. ABOVE-THE-FOLD HERO & AEO DIRECT ANSWER SECTION */}
        <section className="space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/40 bg-cyan-950/70 px-3 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-300">
                <MapPin className="h-3 w-3 text-cyan-400" /> Barganda Road, Near Shivam Clinic, Giridih
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-950/60 px-3 py-1 text-[11px] font-mono font-bold text-amber-300">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> 4.9 ★ (1,200+ Verified Reviews)
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-950/60 px-3 py-1 text-[11px] font-mono font-bold text-emerald-300">
                <ShieldCheck className="h-3 w-3 text-emerald-400" /> 10+ Years in Giridih (Est. 2016)
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-display text-white leading-tight">
              {service.title}
            </h1>
            <p className="text-lg sm:text-xl font-bold text-cyan-400 font-display">
              {service.hindiTitle}
            </p>
            <p className="text-sm sm:text-base text-slate-300 font-medium max-w-3xl">
              {service.shortTagline}
            </p>
          </div>

          {/* AI/AEO INSTANT DIRECT ANSWER BOX (Highlighted for Featured Snippets & Immediate Clarity) */}
          <div className="rounded-3xl border border-cyan-500/40 bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              {/* Direct Answer Paragraph */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                  <Sparkles className="h-4 w-4 text-cyan-400" />
                  <span>AEO Direct Answer • सुपर टेलीकॉम त्वरित सारांश</span>
                </div>
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
                  {service.heroSummary}
                </p>
              </div>

              {/* 4 Essential Metrics Pills */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-1">
                  <span className="text-[11px] font-mono text-slate-400 block uppercase">
                    अनुमानित खर्च (Starting Price)
                  </span>
                  <div className="text-lg sm:text-2xl font-bold text-cyan-300 font-display">
                    {service.priceRangeInr}
                  </div>
                  <span className="text-[10px] text-slate-400 block">
                    Starting at ₹{service.startingPrice}
                  </span>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-1">
                  <span className="text-[11px] font-mono text-slate-400 block uppercase">
                    रिपेयर का समय (Turnaround)
                  </span>
                  <div className="text-lg sm:text-2xl font-bold text-emerald-300 font-display flex items-center gap-1.5">
                    <Clock className="h-5 w-5 text-emerald-400 shrink-0" />
                    <span>{service.turnaroundTime}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block">
                    Fast On-the-Spot Service
                  </span>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-1">
                  <span className="text-[11px] font-mono text-slate-400 block uppercase">
                    लिखित वारंटी (Warranty)
                  </span>
                  <div className="text-lg sm:text-2xl font-bold text-amber-300 font-display flex items-center gap-1.5">
                    <ShieldCheck className="h-5 w-5 text-amber-400 shrink-0" />
                    <span>{service.warrantyPeriod}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block">
                    Stamped Warranty Card
                  </span>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-1">
                  <span className="text-[11px] font-mono text-slate-400 block uppercase">
                    डेटा सुरक्षा (Data Safety)
                  </span>
                  <div className="text-sm sm:text-base font-bold text-cyan-400 font-display flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
                    <span>100% Data Safe</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block">
                    No Reset Required
                  </span>
                </div>
              </div>

              {/* Direct Booking Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/25 hover:scale-[1.02] active:scale-95 transition-all text-center"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>WhatsApp पर तुरंत खर्च पूछें (Get Instant Quote)</span>
                </a>
                <a
                  href={`tel:${PHONE}`}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 px-6 py-4 text-sm font-semibold text-white hover:bg-slate-800 transition-all text-center"
                >
                  <Phone className="h-4 w-4 text-cyan-400" />
                  <span>सीधे कॉल करें ({PHONE_DISPLAY})</span>
                </a>
                <a
                  href={MAPS}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-800 bg-slate-950/80 px-5 py-4 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition-all text-center"
                >
                  <MapPin className="h-4 w-4 text-cyan-400" />
                  <span>स्टोर लोकेशन</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 2. CUSTOMER GUIDELINES & SYMPTOMS BENTO GRID */}
        <section className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              Diagnostic Self-Check • स्व-निरीक्षण
            </span>
            <h2 className="text-xl sm:text-3xl font-extrabold font-display text-white">
              लक्षण और ग्राहक के लिए ज़रूरी सावधानियां
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Column 1: Symptoms (कैसे पहचानें?) */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-7 space-y-4 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white font-display">
                    कैसे पहचानें? (Common Symptoms)
                  </h3>
                  <p className="text-xs text-slate-400">
                    यदि आपके फोन में ये 4 लक्षण दिख रहे हैं, तो तुरंत जांच कराएं:
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                {service.symptoms.map((symptom, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-[11px] font-mono font-bold text-amber-400 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-200 leading-snug">
                      {symptom}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: Customer Guidelines (ज़रूरी सावधानियां) */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-7 space-y-4 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white font-display">
                    ग्राहक गाइडलाइंस (Customer Guidelines)
                  </h3>
                  <p className="text-xs text-slate-400">
                    रिपेयर कराने से पहले और सुपर टेलीकॉम में क्या अपेक्षा रखें:
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                {service.customerGuidelines.map((guideline, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80"
                  >
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-cyan-400 mt-0.5" />
                    <p className="text-xs sm:text-sm text-slate-200 leading-snug">
                      {guideline}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 3. BRAND-WISE PRICING & 3-STEP LAB PROCESS */}
        <section className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              Clear & Transparent Estimates • पारदर्शी शुल्क
            </span>
            <h2 className="text-xl sm:text-3xl font-extrabold font-display text-white">
              ब्रांड-वार अनुमानित खर्च व समय तालिका
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              सुपर टेलीकॉम गिरिडीह में सभी ब्रांड्स के लिए वास्तविक व पारदर्शी मूल्य सूची:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {service.brandPricingTable.map((item, idx) => (
              <div
                key={idx}
                className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between space-y-4 hover:border-cyan-500/40 transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-slate-300">
                      {item.category}
                    </span>
                    <span className="text-xs text-cyan-400 font-mono flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {item.turnaroundTime}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                      {item.priceRange}
                    </div>
                    <span className="text-[11px] text-slate-400 block font-mono">
                      Starting @ ₹{item.startingPrice}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong className="text-slate-400 block text-[10px] uppercase font-mono mb-1">
                      कवर किए जाने वाले मॉडल्स:
                    </strong>
                    {item.modelsExample}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1 text-emerald-400 font-medium">
                    <ShieldCheck className="h-3.5 w-3.5" /> {item.warranty}
                  </span>
                  <a
                    href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
                      `Hi Super Telecom! Please give me a quote for ${item.category} (${service.title}) in Giridih.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:underline font-semibold"
                  >
                    Quote →
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* 3-STEP REPAIR LAB WORKFLOW */}
          <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 space-y-6">
            <h3 className="text-lg sm:text-xl font-bold font-display text-white">
              सुपर टेलीकॉम 3-स्टेप रिपेयर प्रक्रिया (How Our Lab Works)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {service.labSteps.map((step) => (
                <div
                  key={step.stepNumber}
                  className="rounded-2xl border border-slate-800/80 bg-slate-950/70 p-5 space-y-2 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black font-display text-cyan-400">
                      {step.stepNumber}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-[10px] font-mono text-slate-300">
                      {step.duration}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-white">{step.title}</h4>
                  <p className="text-xs text-cyan-400 font-medium">{step.hindiTitle}</p>
                  <p className="text-xs text-slate-300 leading-relaxed pt-1">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. AUTHENTIC HARDWARE VISUAL SHOWCASE */}
        {service.authenticVisual && (
          <section className="rounded-3xl border border-slate-800 overflow-hidden bg-slate-900/60 grid grid-cols-1 md:grid-cols-12 gap-0 items-center">
            <div className="md:col-span-7 aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-slate-950 relative">
              <img
                src={service.authenticVisual.image}
                alt={service.authenticVisual.caption}
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-slate-900" />
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/90 border border-cyan-500/40 text-cyan-300 text-[11px] font-mono font-bold uppercase tracking-wider">
                {service.authenticVisual.badgeText}
              </span>
            </div>
            <div className="md:col-span-5 p-6 sm:p-8 space-y-3">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                Authentic Laboratory Bench
              </span>
              <h3 className="text-lg sm:text-xl font-bold font-display text-white">
                Inside Super Telecom Precision Lab
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {service.authenticVisual.caption}
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs text-slate-400 font-mono">
                <MapPin className="h-3.5 w-3.5 text-cyan-400" />
                <span>Barganda Road, Giridih Workstation</span>
              </div>
            </div>
          </section>
        )}

        {/* 5. SERVICE-SPECIFIC FAQS (ACCORDION) */}
        <section className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              Frequently Asked Questions • अक्सर पूछे जाने वाले सवाल
            </span>
            <h2 className="text-xl sm:text-3xl font-extrabold font-display text-white">
              {service.title} से जुड़े सवाल और उनके जवाब
            </h2>
          </div>

          <div className="space-y-3">
            {service.faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;

              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-semibold text-sm sm:text-base text-white hover:text-cyan-400 transition-colors cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-cyan-400 shrink-0 ml-3 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 sm:pb-6 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/80 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 6. LOCAL GIRIDIH AREAS SERVED & INTERNAL CROSS-LINKS */}
        <section className="space-y-6 pt-4 border-t border-slate-800/80">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Local Service Coverage • गिरिडीह स्थानीय सेवा क्षेत्र
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white font-display">
              गिरिडीह व आसपास के क्षेत्रों से सीधे पधारें:
            </h3>
            <div className="flex flex-wrap gap-2 pt-2">
              {service.localAreasServed.map((area) => (
                <span
                  key={area}
                  className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300 font-medium"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>

          {/* Related Repairs Cross-Linking */}
          {relatedServices.length > 0 && (
            <div className="space-y-3 pt-4">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                Other Related Repairs in Giridih (अन्य सेवाएं)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {relatedServices.map((rel) => (
                  <Link
                    key={rel.slug}
                    to="/services/$slug"
                    params={{ slug: rel.slug }}
                    className="p-3.5 rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-cyan-500/50 hover:bg-slate-900 transition-all group block"
                  >
                    <span className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors block line-clamp-1">
                      {rel.title}
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-1">
                      ₹{rel.startingPrice} से शुरू • {rel.turnaroundTime}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* 7. STORE VISIT & MAP EMBED */}
        <section className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                Visit Our Store • सुपर टेलीकॉम गिरिडीह
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                Barganda Road, Near Shivam Clinic, Giridih
              </h3>
              <p className="text-xs text-slate-400">{ADDRESS}</p>
            </div>
            <a
              href={MAPS}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-xs font-bold text-slate-950 shadow-md hover:scale-105 active:scale-95 transition-all self-start sm:self-auto"
            >
              <MapPin className="h-4 w-4" /> Get Live Directions
            </a>
          </div>

          <div className="aspect-[16/9] sm:aspect-[21/9] w-full rounded-2xl overflow-hidden border border-slate-800">
            <iframe
              title="Super Telecom store location on Google Maps"
              src="https://maps.google.com/maps?q=Super+Telecom+Barganda+Road+Near+Shivam+Clinic+Giridih+Jharkhand+815301&t=&z=16&ie=UTF8&iwloc=&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full w-full border-0"
              allowFullScreen
            />
          </div>
        </section>
      </main>

      {/* MOBILE STICKY BOTTOM ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-800 bg-slate-950/95 backdrop-blur-xl p-3 md:hidden flex items-center gap-2">
        <a
          href={`tel:${PHONE}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-xs"
        >
          <Phone className="h-3.5 w-3.5 text-cyan-400" />
          <span>Call Now</span>
        </a>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-[1.5] flex items-center justify-center gap-1.5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/25"
        >
          <MessageCircle className="h-3.5 w-3.5" />
          <span>WhatsApp Quote</span>
        </a>
      </div>

      <SiteFooter />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LEGACY SERVICE PAGE FALLBACK
// ─────────────────────────────────────────────────────────────────────────────

function LegacyServicePage({ service }: { service: ServiceInfo }) {
  const others = SERVICES.filter((s) => s.slug !== service.slug).slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <BrandLogo size="md" to="/" />
          <a
            href={`tel:${PHONE}`}
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 text-slate-950 px-4 py-2 text-xs font-bold"
          >
            <Phone className="h-4 w-4" /> Call {PHONE_DISPLAY}
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 space-y-8">
        <nav className="flex items-center gap-1 text-xs text-slate-400">
          <Link to="/" className="hover:text-cyan-400">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/services" className="hover:text-cyan-400">Services</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-cyan-400">{service.name}</span>
        </nav>

        <h1 className="text-3xl sm:text-5xl font-bold font-display text-white">{service.h1}</h1>
        <p className="text-slate-300 text-base max-w-3xl">{service.intro}</p>

        <div className="grid gap-4 sm:grid-cols-2">
          {service.benefits.map((b) => (
            <div key={b} className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
              <Check className="h-4 w-4 text-cyan-400 mt-1" />
              <span className="text-sm text-slate-200">{b}</span>
            </div>
          ))}
        </div>

        <div className="pt-6">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-cyan-400 hover:underline text-sm font-semibold"
          >
            ← View all 16 repair services in Giridih
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

export { DedicatedSingleServicePage, LegacyServicePage };
export default ServiceRouteComponent;
