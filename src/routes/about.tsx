import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Wrench,
  Microscope,
  Cpu,
  ShieldCheck,
  Award,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  MapPin,
  Phone,
  MessageCircle,
  ChevronRight,
  Flame,
  Layers,
  HeartHandshake,
} from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { SiteFooter } from "@/components/SiteFooter";
import { SITE_URL, STORE_STREET_ADDRESS } from "@/data/site";

const PHONE = "+918002903643";
const PHONE_DISPLAY = "+91 80029 03643";
const WHATSAPP = "918002903643";
const MAPS = "https://maps.app.goo.gl/mu5XXCehEpocaZWY9";

const TITLE = "About Super Telecom — Premier Mobile Hardware Lab in Giridih";
const DESC =
  "Founded in 2016 on Barganda Road, Super Telecom is Giridih's premier smartphone micro-soldering and flagship screen restoration laboratory. 10+ years of bench mastery.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      {
        name: "keywords",
        content:
          "About Super Telecom Giridih, Mobile Repair Lab Giridih, Micro Soldering Lab Jharkhand, Mayank Super Telecom, iPhone Specialist Barganda Road Giridih",
      },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/about` },
      { property: "og:site_name", content: "Super Telecom" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/about` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: "About Us", item: `${SITE_URL}/about` },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "Super Telecom",
          image: `${SITE_URL}/icon-512.png`,
          telephone: PHONE,
          priceRange: "₹₹",
          address: {
            "@type": "PostalAddress",
            streetAddress: STORE_STREET_ADDRESS,
            addressLocality: "Giridih",
            addressRegion: "Jharkhand",
            postalCode: "815301",
            addressCountry: "IN",
          },
          foundingDate: "2016",
          description: DESC,
        }),
      },
    ],
  }),
  component: AboutPage,
});

export default function AboutPage() {
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
              href={`https://wa.me/${WHATSAPP}?text=Hi%20Super%20Telecom,%20I%20want%20to%20know%20more%20about%20your%20lab`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 text-xs font-bold transition-all shadow-sm"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span className="hidden xs:inline">WhatsApp</span>
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
          <span className="text-foreground font-medium">About Super Telecom</span>
        </nav>

        {/* Hero Section */}
        <div className="space-y-4 mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-950/80 border border-cyan-300 dark:border-cyan-500/40 text-cyan-900 dark:text-cyan-300 text-xs font-mono font-bold tracking-tight">
            <Award className="h-3.5 w-3.5 text-amber-500" />
            <span>ESTABLISHED 2016 &bull; BARGANDA ROAD, GIRIDIH</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Jharkhand&apos;s Premier Flagship <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-cyan-600 via-sky-500 to-blue-600 dark:from-cyan-400 dark:via-sky-300 dark:to-blue-400 bg-clip-text text-transparent">
              Micro-Soldering &amp; Hardware Lab
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
            From humble beginnings in 2016 on Barganda Road, Super Telecom has evolved into the trusted regional hub for complex chip-level smartphone repairs, OCA vacuum display restoration, and advanced hardware diagnostics in Giridih.
          </p>
        </div>

        {/* 3 Key Milestones */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-12">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 text-center space-y-1.5 shadow-sm">
            <span className="text-3xl font-black text-cyan-600 dark:text-cyan-400 font-display block">10+</span>
            <span className="text-xs font-bold text-slate-900 dark:text-white block">Years of Bench Mastery</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Serving Giridih continuously since 2016</span>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 text-center space-y-1.5 shadow-sm">
            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-display block">25,000+</span>
            <span className="text-xs font-bold text-slate-900 dark:text-white block">Successful Board Repairs</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">From cracked glass to dead motherboards</span>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 text-center space-y-1.5 shadow-sm">
            <span className="text-3xl font-black text-purple-600 dark:text-purple-400 font-display block">4.9 / 5.0</span>
            <span className="text-xs font-bold text-slate-900 dark:text-white block">Customer Trust Rating</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">1,200+ Verified 5-Star Reviews</span>
          </div>
        </div>

        {/* Our Story */}
        <section className="space-y-4 mb-12">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            <Sparkles className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Our Story &amp; Philosophy</h2>
          </div>
          <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>
              In 2016, smartphone users in Giridih had very few options when their premium iPhone, Samsung, or OnePlus device suffered a damaged display or a short-circuited motherboard. Authorized service centers routinely demanded exorbitant fees — often equal to the phone&apos;s cost — or recommended replacing the entire motherboard.
            </p>
            <p>
              Super Telecom was established to offer an ethical, technologically advanced alternative. By investing directly in optical stereo microscopes, BGA reballing stations, and OCA clean-room lamination autoclaves, we made surgical component-level repair accessible in Giridih. Rather than replacing a whole ₹20,000 board, we replace the specific ₹800 shorted power IC or capacitor, saving our customers thousands of rupees.
            </p>
          </div>
        </section>

        {/* Lab Infrastructure Breakdown */}
        <section className="space-y-4 mb-12">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            <Cpu className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Advanced Laboratory Hardware &amp; Tooling
            </h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Our Barganda Road facility is equipped with industrial-grade micro-electronics restoration machinery:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 space-y-2">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 w-fit">
                <Microscope className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                4K Stereo Optical Microscopes
              </h3>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                45X continuous optical magnification allowing precision inspection of 0.02mm microscopic motherboard copper jumper lines.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 space-y-2">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 w-fit">
                <Flame className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                Quick-861DW ESD Rework Stations
              </h3>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Calibrated vortex hot air and micro-pencil soldering iron systems for delicate BGA CPU, NAND, and PMIC reflow.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 space-y-2">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 w-fit">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                OCA Vacuum Screen Laminator
              </h3>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Bubble-free laser autoclave chamber capable of separating and replacing only the broken outer glass while preserving original OLED panels.
              </p>
            </div>
          </div>
        </section>

        {/* Technician Code of Ethics */}
        <section className="space-y-4 mb-12">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            <HeartHandshake className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Technician Code of Ethics &amp; Integrity
            </h2>
          </div>

          <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong>Zero Unauthorized Part Swapping:</strong> Every smartphone submitted to our bench is tracked with a barcode tag and photographic component log. Your original cameras, batteries, and screens remain intact.
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong>100% Genuine OEM Quality Parts:</strong> We use only premium grade-tested displays, high-density tested battery cells, and original flex cables backed by our written 90-day warranty.
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong>Data Privacy Vow:</strong> We never browse private galleries, chats, or documents during hardware testing. All diagnostics are carried out in neutral test modes.
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong>Transparent Pricing:</strong> No surprise fees. Written quotes are given after bench inspection, and you pay only if you approve.
              </span>
            </div>
          </div>
        </section>

        {/* Lab Visit & Directions Banner */}
        <section className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-slate-950 to-cyan-950 border border-cyan-500/30 text-white space-y-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center sm:text-left">
            <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase block">
              Visit Our Giridih Laboratory
            </span>
            <h3 className="text-xl font-black text-white">
              Experience Honest Hardware Repair
            </h3>
            <p className="text-xs text-slate-300 max-w-md">
              Barganda Road, Near Shivam Clinic, Giridih, Jharkhand 815301.<br />
              Open Monday to Sunday, 10:00 AM – 9:30 PM.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 shrink-0">
            <a
              href={`tel:${PHONE}`}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 active:scale-95 transition-all"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>Call Lab</span>
            </a>
            <a
              href={MAPS}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center gap-1.5 border border-slate-700 active:scale-95 transition-all"
            >
              <MapPin className="h-3.5 w-3.5 text-cyan-400" />
              <span>Directions</span>
            </a>
          </div>
        </section>
      </main>

      {/* Global Footer */}
      <SiteFooter />
    </div>
  );
}
