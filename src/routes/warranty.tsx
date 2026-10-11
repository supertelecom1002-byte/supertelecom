import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Smartphone,
  Battery,
  Cpu,
  Droplet,
  Tag,
  Phone,
  MessageCircle,
  ChevronRight,
  Sparkles,
  Award,
  HelpCircle,
} from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { SiteFooter } from "@/components/SiteFooter";
import { SITE_URL, STORE_STREET_ADDRESS } from "@/data/site";

const PHONE = "+918002903643";
const PHONE_DISPLAY = "+91 80029 03643";
const WHATSAPP = "918002903643";

const TITLE = "90-Day Lab Warranty & Replacement Policy | Super Telecom Giridih";
const DESC =
  "Official 90-Day repair warranty policy from Super Telecom Giridih. Clear terms covering screen response, battery life, motherboard IC stability, and exclusions.";

export const Route = createFileRoute("/warranty")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      {
        name: "keywords",
        content:
          "Super Telecom Warranty, 90 Day Mobile Repair Warranty Giridih, Display Replacement Warranty, Battery Guarantee Giridih, QC Warranty Seal Policy",
      },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/warranty` },
      { property: "og:site_name", content: "Super Telecom" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/warranty` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: "Warranty Policy", item: `${SITE_URL}/warranty` },
          ],
        }),
      },
    ],
  }),
  component: WarrantyPage,
});

export default function WarrantyPage() {
  return (
    <div className="min-h-screen w-full max-w-full overflow-x-clip bg-background text-foreground transition-colors duration-200">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
          <BrandLogo size="md" to="/" />

          <div className="flex items-center gap-2.5">
            <a
              href={`tel:${PHONE}`}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-border/70 px-3 py-1.5 text-xs font-semibold hover:bg-accent transition-colors"
            >
              <Phone className="h-3.5 w-3.5 text-primary" />
              <span>{PHONE_DISPLAY}</span>
            </a>

            <a
              href={`https://wa.me/${WHATSAPP}?text=Hi%20Super%20Telecom,%20I%20have%20a%20warranty%20claim`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 text-xs font-bold transition-all shadow-sm"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span className="hidden xs:inline">Claim Warranty</span>
            </a>

            <Link
              to="/"
              className="inline-flex items-center gap-1 rounded-xl bg-secondary hover:bg-muted text-foreground border border-border px-3 py-1.5 text-xs font-medium transition-colors"
            >
              <span>← Home</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:py-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">90-Day Lab Warranty</span>
        </nav>

        {/* Hero Section */}
        <div className="space-y-3 mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500/40 text-emerald-900 dark:text-emerald-300 text-xs font-mono font-bold tracking-tight">
            <Award className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>GENUINE HARDWARE PROTECTION GUARANTEE</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            90-Day Lab Warranty &amp; Replacement Policy
          </h1>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
            At Super Telecom, every smartphone repair is stamped with a written guarantee. We stand 100% behind our technician workmanship and genuine OEM parts.
          </p>
        </div>

        {/* Covered vs Not Covered Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* ----------------- WHAT IS COVERED ----------------- */}
          <div className="rounded-3xl p-6 bg-white dark:bg-slate-900/60 border-2 border-emerald-500/40 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="h-6 w-6 shrink-0" />
              <h2 className="text-lg font-bold">What Is Covered (Up to 90 Days)</h2>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              If any of the following technical defects develop naturally during your warranty window, we will repair or replace the component free of charge:
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                  <Smartphone className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Display Touch Response &amp; Digitizer (90 Days)</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  Ghost touch issues, unresponsive touch zones, digitizer freezes, or OCA lamination separation without physical trauma.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                  <Battery className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Battery Health &amp; Sudden Percentage Drops (90 Days)</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  Premature battery draining, phone turning off at 20-30%, or failure to retain charge on our replacement battery cells.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                  <Cpu className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Motherboard IC &amp; Micro-Soldering (60–90 Days)</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  Power IC (PMIC), Charging IC (U2/Tristar), Audio Codec IC, and backlight circuit stability as marked on your Job Sheet invoice.
                </p>
              </div>
            </div>
          </div>

          {/* ----------------- WHAT VOIDS WARRANTY ----------------- */}
          <div className="rounded-3xl p-6 bg-white dark:bg-slate-900/60 border-2 border-rose-500/40 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 text-rose-700 dark:text-rose-400">
              <XCircle className="h-6 w-6 shrink-0" />
              <h2 className="text-lg font-bold">What Voids / Excludes Warranty</h2>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Warranty is strictly limited to manufacturing and installation defects. The following scenarios immediately void warranty coverage:
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/80 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                  <AlertTriangle className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                  <span>Physical Drops &amp; Internal OLED Bleeding</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  Cracked outer front glass, dented phone frames, colored vertical lines, or internal ink bleeding / black spots caused by external physical pressure after delivery.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/80 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                  <Droplet className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                  <span>Liquid / Water Intrusion After Service</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  Exposure to moisture, rain, submersion, or liquid contact following pickup. Liquid contact indicator (LCI) turning red voids all electrical guarantees.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/80 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                  <Tag className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                  <span>Tampered "Super Telecom QC" Warranty Seals</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  Any device with torn, peeled, altered, or missing Super Telecom hologram tamper stickers, or devices subsequently opened by unauthorized third-party workshops.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* How to Claim Warranty Section */}
        <section className="rounded-3xl p-6 sm:p-7 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 space-y-4 mb-10 shadow-sm">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              How to Claim Your Warranty at Our Barganda Road Lab
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <span className="h-6 w-6 rounded-full bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 font-bold flex items-center justify-center text-xs">1</span>
              <h3 className="font-bold text-slate-900 dark:text-white">Bring Your Job Sheet</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Present your original repair invoice, printed receipt, or digital Job Sheet number (e.g. ST-1082).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <span className="h-6 w-6 rounded-full bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 font-bold flex items-center justify-center text-xs">2</span>
              <h3 className="font-bold text-slate-900 dark:text-white">10-Minute Bench Check</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Our technician verifies the internal QC sticker and conducts an optical inspection for physical trauma.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <span className="h-6 w-6 rounded-full bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 font-bold flex items-center justify-center text-xs">3</span>
              <h3 className="font-bold text-slate-900 dark:text-white">Instant Replacement</h3>
              <p className="text-slate-600 dark:text-slate-400">
                If defective, the component is replaced immediately under warranty with zero labor charges.
              </p>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="rounded-3xl p-6 bg-gradient-to-r from-slate-900 via-slate-950 to-cyan-950 border border-cyan-500/30 text-white space-y-3 shadow-xl">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-cyan-400" />
            Have a Question About Your Serviced Device?
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Message our service desk directly with your Job Sheet number for instant verification.
          </p>
          <div className="flex flex-wrap gap-3 pt-1 text-xs">
            <a
              href={`https://wa.me/${WHATSAPP}?text=Hi%20Super%20Telecom,%20I%20want%20to%20verify%20my%20warranty%20status`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 transition-all shadow-md"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>Verify via WhatsApp</span>
            </a>
            <a
              href={`tel:${PHONE}`}
              className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold flex items-center gap-1.5 border border-slate-700"
            >
              <Phone className="h-3.5 w-3.5 text-cyan-400" />
              <span>Call: {PHONE_DISPLAY}</span>
            </a>
          </div>
        </section>
      </main>

      {/* Global Footer */}
      <SiteFooter />
    </div>
  );
}
