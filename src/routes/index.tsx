import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { submitBooking } from "@/lib/booking.functions";
import { useEffect, useState } from "react";

import {
  Phone, MessageCircle, MapPin, Calendar, Star, Clock, Shield, Award, Wrench,
  Smartphone, Battery, Zap, Volume2, Mic, Camera, Cpu, Wifi, Download, Droplet,
  Fingerprint, RefreshCw, HardDrive, Headphones, Watch, Cable, ShieldCheck,
  Sparkles, ChevronDown, Mail, Send, ArrowRight, Check, Menu, X,
} from "lucide-react";
import heroImg from "@/assets/hero-repair.jpg";
import heroVideoAsset from "@/assets/hero-video.mp4.asset.json";
import logoAsset from "@/assets/super-telecom-logo.png.asset.json";
import { AiChat } from "@/components/AiChat";
import { DailyUpdatesSection } from "@/components/DailyUpdatesSection";
import { BeforeAfterSlider } from "@/components/public/BeforeAfterSlider";
import { EditableBlock } from "@/components/admin/visual/EditableBlock";
import { PricingMatrix } from "@/components/PricingMatrix";
import { LocalFaqSection, LOCAL_AEO_FAQS } from "@/components/LocalFaqSection";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SiteFooter } from "@/components/SiteFooter";
import { BrandLogo } from "@/components/BrandLogo";
import { SITE_URL, STORE_ADDRESS, STORE_STREET_ADDRESS } from "@/data/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Super Telecom | Best Mobile Repair Shop in Giridih | Barganda Road" },
      { name: "description", content: "Professional smartphone repair in Giridih. Instant display replacement, motherboard IC repair, and battery fixes at Super Telecom, Barganda Road (Near Shivam Clinic). Call +91 80029 03643." },
      { property: "og:title", content: "Super Telecom | Best Mobile Repair Shop in Giridih | Barganda Road" },
      { property: "og:description", content: "Professional smartphone repair in Giridih. Instant display replacement, motherboard IC repair, and battery fixes at Super Telecom, Barganda Road (Near Shivam Clinic). Call +91 80029 03643." },
      { property: "og:url", content: `${SITE_URL}/` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Super Telecom | Best Mobile Repair Shop in Giridih | Barganda Road" },
      { name: "twitter:description", content: "Professional smartphone repair in Giridih. Instant display replacement, motherboard IC repair, and battery fixes at Super Telecom, Barganda Road (Near Shivam Clinic). Call +91 80029 03643." },
    ],
    links: [
      { rel: "canonical", href: `${SITE_URL}/` },
      { rel: "preload", as: "image", href: heroImg, fetchpriority: "high" } as any,
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            ...LOCAL_AEO_FAQS.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: { "@type": "Answer", text: faq.answer },
            })),
            ...FAQS.map(([q, a]) => ({
              "@type": "Question",
              name: q,
              acceptedAnswer: { "@type": "Answer", text: a },
            })),
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": ["MobilePhoneRepairShop", "LocalBusiness"],
          "@id": `${SITE_URL}/#business`,
          name: "Super Telecom",
          alternateName: "Super Telecom Mobile Repairing Centre Giridih",
          description:
            "Professional smartphone repair in Giridih. Instant display replacement, motherboard IC repair, and battery fixes at Super Telecom, Barganda Road (Near Shivam Clinic). Call +91 80029 03643.",
          image: `${SITE_URL}/favicon.png`,
          telephone: "+918002903643",
          email: "supertelecom1002@gmail.com",
          url: `${SITE_URL}/`,
          priceRange: "₹₹",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Barganda Road, Near Shivam Clinic",
            addressLocality: "Giridih",
            addressRegion: "Jharkhand",
            postalCode: "815301",
            addressCountry: "IN",
          },
          geo: { "@type": "GeoCoordinates", latitude: 24.1856, longitude: 86.3056 },
          hasMap: "https://maps.app.goo.gl/mu5XXCehEpocaZWY9",
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ],
              opens: "10:00",
              closes: "21:30",
            },
          ],
          areaServed: { "@type": "City", name: "Giridih" },
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Mobile Repair Services Giridih",
            itemListElement: [
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Screen Replacement",
                  description: "Cracked or broken display replacement for iPhone and Android with same-day warranty.",
                },
                priceSpecification: {
                  "@type": "PriceSpecification",
                  priceCurrency: "INR",
                  minPrice: "999",
                  maxPrice: "9999",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Motherboard IC Repair",
                  description: "Chip-level BGA micro-soldering, short circuit, and dead phone motherboard recovery.",
                },
                priceSpecification: {
                  "@type": "PriceSpecification",
                  priceCurrency: "INR",
                  minPrice: "799",
                  maxPrice: "3500",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Battery Replacement",
                  description: "High-backup original battery replacement with testing and up to 90 days warranty.",
                },
                priceSpecification: {
                  "@type": "PriceSpecification",
                  priceCurrency: "INR",
                  minPrice: "899",
                  maxPrice: "2499",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Water Damage Restoration",
                  description: "Ultrasonic chemical cleaning and component-level short circuit fix.",
                },
                priceSpecification: {
                  "@type": "PriceSpecification",
                  priceCurrency: "INR",
                  minPrice: "500",
                  maxPrice: "2500",
                },
              },
            ],
          },
        }),
      },
    ],
  }),
  component: HomePage,
});

const PHONE = "+918002903643";
const PHONE_DISPLAY = "+91 80029 03643";
const WHATSAPP = "918002903643";
const MAPS = "https://maps.google.com/?q=Super+Telecom+Giridih+Jharkhand";
const EMAIL = "supertelecom1002@gmail.com";

const FAQS: [string, string][] = [
  ["How long does a typical repair take?", "Most repairs — screen, battery, charging port — are completed in 30 to 60 minutes. Complex motherboard or water damage repairs may take 24–48 hours. We give you an exact estimate before starting."],
  ["Do you offer warranty on repairs?", "Yes. Every repair is backed by a warranty ranging from 30 days to 6 months, depending on the part. Second-hand phones also come with a warranty."],
  ["Is my data safe during repair?", "Absolutely. Your data is never accessed unless required (like a software flash) and only with your permission. We recommend a backup before major repairs and can help you with it."],
  ["Are second-hand phones tested and reliable?", "Every used phone goes through a strict quality check — battery health, display, cameras, network, sensors — and is sold with a warranty."],
  ["What payment methods do you accept?", "Cash, UPI (GPay/PhonePe/Paytm), all debit and credit cards, and net banking."],
  ["What are your business hours?", "We're open Monday to Sunday, 9:00 AM to 9:00 PM. Walk in anytime or book ahead on WhatsApp."],
  ["Do you repair all brands?", "Yes — iPhone, Samsung, Xiaomi, Realme, OPPO, Vivo, OnePlus, Motorola, Nokia and more."],
  ["How do I get a price quote?", "Call, WhatsApp or visit us. We diagnose your phone and give you a transparent, no-obligation quote."],
];

function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <BackgroundFX />
      <Nav />
      <main id="main">
        <Hero />
        <AiChat />
        <TrustBar />
        <About />
        <Services />
        <PricingMatrix />
        <WhyUs />
        <Gallery />
        <BeforeAfterSlider />
        <DailyUpdatesSection />
        <Testimonials />
        <FAQ />
        <LocalFaqSection />
        <Contact />
        <VisitStore />

      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}

function BackgroundFX() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-primary/20 blur-[140px]" />
      <div className="absolute top-[40%] -right-40 h-[500px] w-[500px] rounded-full bg-accent/20 blur-[120px]" />
      <div className="absolute bottom-0 -left-40 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
    </div>
  );
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on();
    window.addEventListener("scroll", on);
    return () => window.removeEventListener("scroll", on);
  }, []);
  const links = [
    ["Services", "#services"],
    ["About", "#about"],
    ["Gallery", "#gallery"],
    ["Reviews", "#reviews"],
    ["FAQ", "#faq"],
    ["Contact", "#contact"],
  ];
  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      {/* Utility bar */}
      <div className="hidden border-b border-border bg-surface md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-1.5 text-[11px] tracking-wide text-muted-foreground">
          <div className="flex items-center gap-5">
            <span className="inline-flex items-center gap-1.5"><MapPin className="h-3 w-3 text-primary" /> <EditableBlock contentKey="contact_address" defaultValue="Barganda Road, Giridih" /></span>
            <span className="inline-flex items-center gap-1.5"><Clock className="h-3 w-3 text-primary" /> <EditableBlock contentKey="contact_timings" defaultValue="Open Daily 9:00 AM – 9:00 PM" /></span>
          </div>
          <div className="flex items-center gap-5">
            <a href={`mailto:${EMAIL}`} className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground">
              <Mail className="h-3 w-3 text-primary" /> <EditableBlock contentKey="contact_email" defaultValue={EMAIL} />
            </a>
            <span className="inline-flex items-center gap-1.5 text-foreground"><Star className="h-3 w-3 fill-primary text-primary" /> 5.0 Google Rating</span>
          </div>
        </div>
      </div>

      <div className={`transition-all ${scrolled || open ? "glass-strong shadow-elegant" : "bg-transparent"}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <BrandLogo size="md" to="/" />
          <nav className="hidden items-center gap-1 md:flex">
            {links.map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <a href={`tel:${PHONE}`} className="hidden items-center rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-secondary sm:inline-flex">
              <Phone className="mr-2 h-4 w-4" /> Call
            </a>
            <a href="#contact" className="inline-flex items-center rounded-full bg-gradient-brand px-4 py-2 text-sm font-semibold text-primary-foreground shadow-brand transition-transform hover:scale-[1.03]">
              Book Repair <ArrowRight className="ml-1.5 h-4 w-4" />
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border md:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <nav className="border-t border-border px-4 pb-4 pt-2 md:hidden">
            {links.map(([label, href]) => (
              <a
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {label}
              </a>
            ))}
            <div className="mt-2 flex items-center gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-primary" /> Barganda Road, Giridih · 9 AM – 9 PM
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative isolate min-h-screen w-full overflow-hidden">
      {/* Fullscreen cinematic background video */}
      <video
        src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
        poster={heroImg}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-label="Cinematic repair video at Super Telecom Giridih"
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      {/* Subtle dark cyan overlay for 100% readability */}
      <div className="absolute inset-0 -z-10 bg-slate-950/75" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-950/85 via-cyan-950/35 to-slate-950/95" />
      <div className="absolute inset-0 -z-10 bg-cyan-950/20 backdrop-blur-[0.5px]" />

      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-4 pt-32 pb-24 text-center sm:px-6">
        <div className="animate-fade-up inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-white/80">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <EditableBlock contentKey="hero_badge" defaultValue="Trusted by 2 Lakh+ customers · 10+ years in Giridih" />
        </div>

        <EditableBlock
          contentKey="hero_title"
          defaultValue="Super Telecom — Mobile Repair Shop in Giridih"
          as="h1"
          className="animate-fade-up mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl"
        />

        <EditableBlock
          contentKey="hero_subtitle"
          defaultValue="Display, battery & chip-level repairs · Second-hand phones · Accessories"
          as="p"
          type="textarea"
          className="animate-fade-up mt-4 font-display text-lg text-white/90 sm:text-2xl"
        />

        <EditableBlock
          contentKey="hero_description"
          defaultValue="Professional Mobile Repair · Motherboard Repair · Second-Hand Phones · New Smartphones · Accessories · Fast Same-Day Service"
          as="p"
          type="textarea"
          className="animate-fade-up mt-4 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base"
        />

        <div className="animate-fade-up mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#contact"
            className="inline-flex items-center rounded-full bg-gradient-brand px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-brand transition-transform hover:scale-[1.04]"
          >
            <Calendar className="mr-2 h-4 w-4" /> <EditableBlock contentKey="hero_cta_book" defaultValue="Book Repair" />
          </a>
          <a
            href={`tel:${PHONE}`}
            className="inline-flex items-center rounded-full border border-white/40 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-white/15 hover:shadow-glow"
          >
            <Phone className="mr-2 h-4 w-4" /> <EditableBlock contentKey="hero_cta_call" defaultValue="Call Now" />
          </a>
          <a
            href={`https://wa.me/${WHATSAPP}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-full glass px-7 py-3.5 text-sm font-semibold text-white hover:bg-white/10"
          >
            <MessageCircle className="mr-2 h-4 w-4 text-emerald-400" /> WhatsApp
          </a>
          <a
            href={`mailto:${EMAIL}`}
            className="inline-flex items-center rounded-full glass px-7 py-3.5 text-sm font-semibold text-white hover:bg-white/10"
          >
            <Mail className="mr-2 h-4 w-4 text-primary" /> Email Us
          </a>
        </div>

        <div className="animate-fade-up mt-6 flex items-center gap-2 text-sm text-white/80">
          <div className="flex text-yellow-400" aria-hidden>
            {"★★★★★"}
          </div>
          <span>Trusted by 2 Lakh+ Happy Customers</span>
        </div>

        <dl className="animate-fade-up mt-12 grid w-full max-w-2xl grid-cols-3 gap-3 sm:gap-4">
          {[
            ["10+", "Years"],
            ["1M+", "Repairs"],
            ["5.0★", "Rating"],
          ].map(([n, l]) => (
            <div key={l} className="rounded-2xl glass p-4">
              <dt className="font-display text-2xl font-bold text-gradient">{n}</dt>
              <dd className="mt-1 text-[10px] uppercase tracking-wider text-white/70 sm:text-xs">
                {l}
              </dd>
            </div>
          ))}
        </dl>

        <a
          href="#services"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 transition-colors hover:text-white"
          aria-label="Scroll to services"
        >
          <ChevronDown className="h-6 w-6 animate-bounce" />
        </a>
      </div>
    </section>
  );
}


function TrustBar() {
  const items = [
    [Shield, "6-Month Warranty"],
    [Award, "10+ Years Experience"],
    [Clock, "Same-Day Repairs"],
    [ShieldCheck, "Genuine Spare Parts"],
    [Star, "5.0 Google Rating"],
  ];
  return (
    <section className="border-y border-border/50 py-6 glass-strong">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-4 sm:px-6">
        {items.map(([Icon, label]: any) => (
          <div key={label} className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            <Icon className="h-4 w-4 text-primary" /> {label}
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionHeader({ eyebrow, title, sub }: { eyebrow: React.ReactNode; title: React.ReactNode; sub?: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-primary">
        {eyebrow}
      </div>
      <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {sub && <p className="mt-4 text-muted-foreground">{sub}</p>}
    </div>
  );
}

function About() {
  return (
    <section id="about" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-primary">
              About Super Telecom
            </div>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Giridih's most trusted mobile service center.
            </h2>
            <p className="mt-6 text-muted-foreground">
              For more than ten years, Super Telecom has been the go-to destination in Giridih
              for reliable mobile repairs and quality second-hand smartphones. What started as a
              small shop has grown into a full-service mobile care center serving 2 Lakh+
              happy customers across Jharkhand.
            </p>
            <p className="mt-4 text-muted-foreground">
              Our team of skilled technicians combines professional repair tools with high-grade spare
              parts to deliver repairs you can trust. From cracked screens and dead batteries to
              motherboard-level IC work, we fix it right the first time — at honest, transparent
              prices.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {[
                ["Genuine Parts", "Sourced from verified suppliers"],
                ["Warranty Backed", "Every repair is guaranteed"],
                ["Transparent Pricing", "No hidden charges, ever"],
                ["Local & Trusted", "Serving Giridih since 2014"],
              ].map(([t, d]) => (
                <div key={t} className="rounded-2xl glass p-4">
                  <div className="flex items-center gap-2 font-semibold">
                    <Check className="h-4 w-4 text-primary" /> {t}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{d}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              ["10+", "Years of experience"],
              ["2 Lakh+", "Happy customers"],
              ["1M+", "Repairs completed"],
              ["5.0★", "Customer rating"],
            ].map(([n, l]) => (
              <div key={l} className="rounded-3xl glass p-8 shadow-elegant">
                <div className="font-display text-4xl font-bold text-gradient sm:text-5xl">{n}</div>
                <div className="mt-2 text-sm text-muted-foreground">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const REPAIR_SERVICES: Array<[any, string, string]> = [
  [Smartphone, "Screen & Display", "Screen replacement, display repair, touch & LCD fixes for all brands."],
  [Battery, "Battery Replacement", "Genuine batteries with warranty. Fixes drain & backup issues."],
  [Zap, "Charging Port", "Charging port repair, charging issue diagnosis and clean-up."],
  [Volume2, "Speaker & Sound", "Speaker, earpiece and ringer repair for crystal-clear audio."],
  [Mic, "Microphone", "Mic repair for call clarity, voice notes and video recording."],
  [Camera, "Camera Repair", "Front/rear camera, lens replacement and focus issue fixes."],
  [Cpu, "Motherboard & IC", "Advanced motherboard, IC and chip-level repairs by experts."],
  [Wifi, "Network Issues", "SIM slot, network, signal and connectivity troubleshooting."],
  [Download, "Software & Flashing", "Software install, updates, flashing and boot loop repair."],
  [Droplet, "Water Damage", "Water-damaged and dead phone recovery with ultrasonic cleaning."],
  [Fingerprint, "Fingerprint & Face", "Fingerprint sensor and face unlock repair and calibration."],
  [RefreshCw, "Performance Fix", "Hanging, heating and slow-phone optimization and cleanup."],
  [HardDrive, "Data Recovery", "Recover contacts, photos and backup before/after repairs."],
  [Wrench, "Buttons & Ports", "Power, volume, home button, SIM tray and memory slot repair."],
];

const ACCESSORY_CATEGORIES = [
  "Chargers & Fast Chargers", "USB Cables & OTG", "Power Banks", "Earphones & Neckbands",
  "Bluetooth Speakers", "Smart Watches", "Mobile Covers & Back Covers", "Tempered Glass",
  "Camera Lens Protection", "Memory Cards & Adapters", "Car Chargers & Holders",
  "Ring Holders, Tripods & Selfie Sticks",
];

function Services() {
  return (
    <section id="services" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader
          eyebrow="What we do"
          title={<EditableBlock contentKey="services_title" defaultValue="Complete mobile care under one roof" />}
          sub={<EditableBlock contentKey="services_sub" defaultValue="From screen swaps to chip-level IC work, second-hand smartphones to premium accessories — we've got every mobile need covered." type="textarea" />}
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {REPAIR_SERVICES.map(([Icon, title, desc]) => (
            <div key={title} className="group relative overflow-hidden rounded-3xl glass p-6 transition-all hover:-translate-y-1 hover:shadow-glow">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-brand opacity-0 blur-3xl transition-opacity group-hover:opacity-40" />
              <div className="relative">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-brand shadow-brand">
                  <Icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Second-hand & accessories */}
        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-3xl glass p-8 shadow-elegant">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-primary/30 blur-3xl" />
            <div className="relative">
              <Smartphone className="h-8 w-8 text-primary" />
              <h3 className="mt-4 font-display text-2xl font-bold">Second-Hand Smartphones</h3>
              <p className="mt-3 text-muted-foreground">
                Quality used smartphones — tested, cleaned and warranty-backed. We buy, sell and
                exchange phones at the fairest price in Giridih.
              </p>
              <ul className="mt-5 space-y-2 text-sm">
                {["Thoroughly quality-tested devices", "Buy, sell & phone exchange", "Fair, transparent pricing", "Short-term warranty on every phone"].map((x) => (
                  <li key={x} className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> {x}</li>
                ))}
              </ul>
              <a href="#contact" className="mt-6 inline-flex items-center rounded-full bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-brand">
                Enquire now <ArrowRight className="ml-1.5 h-4 w-4" />
              </a>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-3xl glass p-8 shadow-elegant">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-accent/30 blur-3xl" />
            <div className="relative">
              <Headphones className="h-8 w-8 text-accent" />
              <h3 className="mt-4 font-display text-2xl font-bold">Mobile Accessories</h3>
              <p className="mt-3 text-muted-foreground">
                A full range of premium mobile accessories from trusted brands, in-store and ready
                to grab today.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {ACCESSORY_CATEGORIES.map((c) => (
                  <span key={c} className="rounded-full border border-border bg-secondary px-3 py-1 text-xs text-muted-foreground">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyUs() {
  const items: Array<[any, string, string]> = [
    [Award, "10+ Years Experience", "Deep expertise across every phone brand and model."],
    [Wrench, "Professional Technicians", "Trained specialists using precision equipment."],
    [ShieldCheck, "Quality Repairs", "Genuine parts and thorough quality checks."],
    [Sparkles, "Affordable Pricing", "Fair, transparent pricing with no hidden charges."],
    [Clock, "Fast Service", "Most repairs completed the same day."],
    [Shield, "Trusted Local Business", "Loved by 2 Lakh+ happy customers across Giridih."],
    [Star, "Customer Satisfaction", "5.0★ average rating from real Google reviews."],
    [Cable, "Latest Equipment", "Modern tools for chip-level and micro-soldering work."],
  ];
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader eyebrow="Why choose us" title="Why customers keep coming back" />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(([Icon, t, d]) => (
            <div key={t} className="rounded-3xl glass p-6 transition-all hover:-translate-y-1 hover:shadow-glow">
              <Icon className="h-6 w-6 text-primary" />
              <div className="mt-4 font-display text-lg font-semibold">{t}</div>
              <p className="mt-1.5 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  const categories = [
    "Shop Interior", "Repair Work", "Second-Hand Phones", "Accessories",
    "Technicians", "Completed Repairs", "Mobile Parts", "Customer Service",
  ];
  const gradients = [
    "from-blue-500/40 via-cyan-500/30 to-purple-600/40",
    "from-fuchsia-500/40 via-pink-500/30 to-orange-500/40",
    "from-emerald-500/40 via-teal-500/30 to-cyan-500/40",
    "from-indigo-500/40 via-blue-500/30 to-cyan-400/40",
    "from-purple-500/40 via-indigo-500/30 to-blue-500/40",
    "from-amber-500/40 via-orange-500/30 to-red-500/40",
    "from-cyan-500/40 via-sky-500/30 to-blue-600/40",
    "from-rose-500/40 via-pink-500/30 to-purple-500/40",
  ];
  return (
    <section id="gallery" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader
          eyebrow="Gallery"
          title="Inside Super Telecom"
          sub="A glimpse of our workshop, technicians, second-hand phones and premium accessory shelves."
        />
        <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4">
          {categories.map((c, i) => (
            <div
              key={c}
              className={`group relative aspect-square overflow-hidden rounded-3xl border border-border bg-gradient-to-br ${gradients[i]} p-6 transition-all hover:-translate-y-1 hover:shadow-glow ${i % 3 === 0 ? "md:row-span-2 md:aspect-auto" : ""}`}
            >
              <div className="absolute inset-0 bg-background/40 backdrop-blur-sm transition-opacity group-hover:opacity-30" />
              <div className="relative flex h-full flex-col justify-end">
                <div className="text-[10px] uppercase tracking-widest text-white/80">Category</div>
                <div className="mt-1 font-display text-lg font-semibold text-white">{c}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const reviews = [
    { name: "Rahul K.", role: "Screen replacement", body: "Cracked my iPhone screen and Super Telecom had it fixed in under an hour. Perfect display, fair price, great service.", rating: 5 },
    { name: "Priya S.", role: "Battery replacement", body: "My phone was dying by noon. New battery, honest price, and it feels brand new. Definitely coming back.", rating: 5 },
    { name: "Mohit V.", role: "Second-hand phone", body: "Bought a used Samsung — tested thoroughly and came with warranty. Best used phone shop in Giridih.", rating: 5 },
    { name: "Anjali D.", role: "Water damage repair", body: "Phone fell in water and everyone said it was gone. Super Telecom brought it back to life. Miracle workers!", rating: 5 },
    { name: "Suresh P.", role: "Motherboard repair", body: "Complex IC issue no one else would touch. Fixed cleanly with a warranty. Real experts.", rating: 5 },
    { name: "Neha R.", role: "Accessories", body: "Great range of chargers, covers and tempered glass at fair prices. My go-to accessory shop.", rating: 5 },
  ];
  return (
    <section id="reviews" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader eyebrow="Reviews" title="Loved by customers across Giridih" />
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => (
            <div key={r.name} className="rounded-3xl glass p-6 transition-all hover:-translate-y-1 hover:shadow-glow">
              <div className="flex gap-1">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-foreground/90">"{r.body}"</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-brand font-semibold text-primary-foreground">
                  {r.name[0]}
                </div>
                <div>
                  <div className="text-sm font-semibold">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = FAQS;
  return (
    <section id="faq" className="py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeader eyebrow="FAQ" title="Answers to common questions" />
        <div className="mt-12 space-y-3">
          {faqs.map(([q, a], i) => (
            <FAQItem key={i} q={q} a={a} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-2xl glass">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-secondary"
      >
        <span className="font-medium">{q}</span>
        <ChevronDown className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="border-t border-border/50 px-5 py-4 text-sm leading-relaxed text-muted-foreground">{a}</div>}
    </div>
  );
}

type BookingSummary = {
  timestamp: string;
  name: string;
  phone: string;
  model: string;
  service: string;
  message: string;
};

function buildWhatsAppUrl(b: BookingSummary) {
  const lines = [
    "Namaste Super Telecom 👋",
    "Maine website se booking request bheji hai:",
    "",
    `Naam: ${b.name}`,
    `Phone: ${b.phone}`,
    b.model ? `Model: ${b.model}` : "",
    `Service: ${b.service}`,
    b.message ? `Problem: ${b.message}` : "",
    "",
    `Request time: ${b.timestamp}`,
  ].filter(Boolean);
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines.join("\n"))}`;
}

function Contact() {
  const [sent, setSent] = useState(false);
  const [booking, setBooking] = useState<BookingSummary | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sendBooking = useServerFn(submitBooking);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting || sent) return; // prevent duplicate submissions
    setSubmitting(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await sendBooking({
        data: {
          name: String(fd.get("name") ?? ""),
          phone: String(fd.get("phone") ?? ""),
          model: String(fd.get("model") ?? ""),
          service: String(fd.get("service") ?? ""),
          message: String(fd.get("message") ?? ""),
        },
      });
      const summary: BookingSummary = {
        timestamp: res.timestamp,
        name: res.name,
        phone: res.phone,
        model: res.model,
        service: res.service,
        message: res.message,
      };
      setBooking(summary);
      setSent(true);
      // Auto-open WhatsApp confirmation chat (button fallback stays visible)
      window.open(buildWhatsAppUrl(summary), "_blank", "noopener,noreferrer");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please call or WhatsApp us.");
    } finally {
      setSubmitting(false);
    }
  };


  return (

    <section id="contact" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader
          eyebrow="Contact"
          title="Book a repair or drop by our store"
          sub="Reach us on call, WhatsApp or fill out the form — we usually reply within minutes."
        />
        <div className="mt-14 grid gap-8 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-2">
            <ContactCard icon={Phone} label="Call us" value={<EditableBlock contentKey="contact_phone" defaultValue={PHONE_DISPLAY} />} href={`tel:${PHONE}`} />
            <ContactCard icon={MessageCircle} label="WhatsApp" value={<EditableBlock contentKey="contact_whatsapp_text" defaultValue="Chat with our team" />} href={`https://wa.me/${WHATSAPP}`} />
            <ContactCard icon={MapPin} label="Visit us" value={<EditableBlock contentKey="contact_address_full" defaultValue="Super Telecom, Giridih, Jharkhand" />} href={MAPS} />
            <ContactCard icon={Clock} label="Hours" value={<EditableBlock contentKey="contact_hours_full" defaultValue="Mon–Sun · 9:00 AM – 9:00 PM" />} />
            <ContactCard icon={Mail} label="Email" value={<EditableBlock contentKey="contact_email" defaultValue={EMAIL} />} href={`mailto:${EMAIL}`} />
          </div>

          <form
            onSubmit={handleSubmit}

            className="rounded-3xl glass p-6 shadow-elegant sm:p-8 lg:col-span-3"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Your name" name="name" required />
              <Field label="Phone number" name="phone" type="tel" required />
              <Field label="Phone brand & model" name="model" className="sm:col-span-2" />
              <div className="sm:col-span-2">
                <label htmlFor="contact-service" className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Service needed
                </label>
                <select id="contact-service" name="service" className="w-full rounded-xl border border-input bg-background/60 px-4 py-3 text-sm outline-none focus:border-primary">
                  {["Screen replacement", "Battery replacement", "Charging issue", "Software / flashing", "Water damage", "Second-hand phone enquiry", "Accessories", "Other"].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="contact-message" className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Describe the problem
                </label>
                <textarea id="contact-message" name="message" rows={4} className="w-full rounded-xl border border-input bg-background/60 px-4 py-3 text-sm outline-none focus:border-primary" />
              </div>
            </div>
            <button
              type="submit"
              disabled={submitting || sent}
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-gradient-brand px-6 py-3 text-sm font-semibold text-primary-foreground shadow-brand transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
            >
              {sent ? "Request sent ✓" : submitting ? "Sending…" : (<><Send className="mr-2 h-4 w-4" /> Send booking request</>)}
            </button>
            {sent && booking && (
              <div className="mt-5 rounded-2xl border border-primary/30 bg-primary/5 p-5">
                <p className="text-sm font-semibold text-foreground">
                  ✓ Request received — our team has it now
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Tap below to get an instant WhatsApp confirmation on your phone. We usually call back within minutes.
                </p>
                <dl className="mt-4 grid gap-1.5 text-sm">
                  <div className="flex gap-2"><dt className="w-24 shrink-0 text-muted-foreground">Reference</dt><dd className="font-medium">{booking.timestamp}</dd></div>
                  <div className="flex gap-2"><dt className="w-24 shrink-0 text-muted-foreground">Name</dt><dd className="font-medium">{booking.name}</dd></div>
                  <div className="flex gap-2"><dt className="w-24 shrink-0 text-muted-foreground">Phone</dt><dd className="font-medium">{booking.phone}</dd></div>
                  {booking.model && <div className="flex gap-2"><dt className="w-24 shrink-0 text-muted-foreground">Model</dt><dd className="font-medium">{booking.model}</dd></div>}
                  <div className="flex gap-2"><dt className="w-24 shrink-0 text-muted-foreground">Service</dt><dd className="font-medium">{booking.service}</dd></div>
                </dl>
                <div className="mt-5 flex flex-wrap gap-3">
                  <a
                    href={buildWhatsAppUrl(booking)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-full bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-brand transition-transform hover:scale-[1.02]"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" /> Get WhatsApp confirmation
                  </a>
                  <a
                    href={`tel:${PHONE}`}
                    className="inline-flex items-center justify-center rounded-full border border-border px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-secondary"
                  >
                    <Phone className="mr-2 h-4 w-4" /> Call us
                  </a>
                  <a
                    href={`mailto:${EMAIL}?subject=${encodeURIComponent(`Booking request — ${booking.name}`)}&body=${encodeURIComponent(`Name: ${booking.name}\nPhone: ${booking.phone}\nModel: ${booking.model}\nService: ${booking.service}\nProblem: ${booking.message}\nTime: ${booking.timestamp}`)}`}
                    className="inline-flex items-center justify-center rounded-full border border-border px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-secondary"
                  >
                    <Mail className="mr-2 h-4 w-4" /> Email us
                  </a>
                </div>
              </div>
            )}
            {error && <p className="mt-3 text-sm text-destructive" role="alert">{error}</p>}


          </form>
        </div>
      </div>
    </section>
  );
}

function ContactCard({ icon: Icon, label, value, href }: any) {
  const inner = (
    <div className="flex items-center gap-4 rounded-2xl glass p-5 transition-all hover:-translate-y-0.5 hover:shadow-glow">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-brand shadow-brand">
        <Icon className="h-5 w-5 text-primary-foreground" />
      </div>
      <div className="min-w-0">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
        <div className="mt-0.5 truncate font-medium">{value}</div>
      </div>
    </div>
  );
  return href ? <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">{inner}</a> : inner;
}

function Field({ label, name, type = "text", required, className = "" }: any) {
  const id = `contact-${name}`;
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        className="w-full rounded-xl border border-input bg-background/60 px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
      />
    </div>
  );
}

const Footer = SiteFooter;

function FloatingActions() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 400);
    on();
    window.addEventListener("scroll", on);
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-3">
      <a
        href={`https://wa.me/${WHATSAPP}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="group relative grid h-14 w-14 place-items-center rounded-full bg-emerald-500 text-white shadow-elegant transition-transform hover:scale-110"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-emerald-500 opacity-40 blur-xl animate-glow" />
      </a>
      <a
        href={`tel:${PHONE}`}
        aria-label="Call now"
        className="grid h-14 w-14 place-items-center rounded-full bg-gradient-brand text-primary-foreground shadow-brand transition-transform hover:scale-110"
      >
        <Phone className="h-6 w-6" />
      </a>
      <a
        href={`mailto:${EMAIL}`}
        aria-label="Email us"
        className="grid h-14 w-14 place-items-center rounded-full glass-strong text-white shadow-elegant transition-transform hover:scale-110"
      >
        <Mail className="h-6 w-6" />
      </a>
      {show && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-transform hover:scale-110"
        >
          <ChevronDown className="h-5 w-5 rotate-180" />
        </button>
      )}
    </div>
  );
}

const STORE_LAT = 24.1854;
const STORE_LNG = 86.3040;
const MAPS_EMBED = "https://www.google.com/maps?q=Super+Telecom+Barganda+Road+Near+Shivam+Clinic+Giridih+Jharkhand+815301&output=embed";
const MAPS_PLACE = "https://maps.app.goo.gl/mu5XXCehEpocaZWY9";

function VisitStore() {
  const [visible, setVisible] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = document.getElementById("visit");
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            setInView(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: "150px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const directionsHref = () => {
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const url = `https://www.google.com/maps/dir/?api=1&origin=${pos.coords.latitude},${pos.coords.longitude}&destination=${STORE_LAT},${STORE_LNG}&travelmode=driving`;
          window.open(url, "_blank", "noopener,noreferrer");
        },
        () => {
          window.open(`https://www.google.com/maps/dir/?api=1&destination=${STORE_LAT},${STORE_LNG}`, "_blank", "noopener,noreferrer");
        },
        { timeout: 5000 },
      );
    } else {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${STORE_LAT},${STORE_LNG}`, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <section id="visit" className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div
          className={`transition-all duration-700 ${inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
        >
          <SectionHeader
            eyebrow="Find us"
            title="Visit Super Telecom"
            sub="Visit our store for mobile repair, second-hand phones, accessories, software services, unlocking, flashing, and professional mobile solutions."
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-5">
            {/* Map */}
            <div className="lg:col-span-3">
              <div className="group relative overflow-hidden rounded-3xl glass-strong shadow-elegant transition-all duration-500 hover:shadow-glow">
                <div className="relative aspect-[4/3] w-full sm:aspect-[16/10]">
                  {!mapLoaded && (
                    <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-primary/10 to-accent/10">
                      <div className="flex flex-col items-center gap-3">
                        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
                        <span className="text-xs text-muted-foreground">Loading map…</span>
                      </div>
                    </div>
                  )}
                  {visible && (
                    <iframe
                      title="Super Telecom store location on Google Maps"
                      src={MAPS_EMBED}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      onLoad={() => setMapLoaded(true)}
                      className={`absolute inset-0 h-full w-full border-0 transition-opacity duration-700 ${mapLoaded ? "opacity-100" : "opacity-0"}`}
                      allowFullScreen
                    />
                  )}

                  <a
                    href={MAPS_PLACE}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-brand transition-transform hover:-translate-y-0.5"
                  >
                    <MapPin className="h-4 w-4" /> Open in Google Maps
                  </a>
                </div>
              </div>
            </div>

            {/* Info + actions */}
            <div className="lg:col-span-2">
              <div className="flex h-full flex-col rounded-3xl glass p-7 shadow-elegant">
                <div className="flex items-start gap-3">
                  <div className="grid h-11 w-11 flex-none place-items-center rounded-2xl bg-gradient-brand shadow-brand">
                    <MapPin className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="font-display text-lg font-semibold">Super Telecom</div>
                    <p className="mt-1 text-sm text-muted-foreground">{STORE_ADDRESS}</p>
                  </div>
                </div>

                <div className="mt-6 space-y-3 text-sm">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>Open Mon–Sun · 9:00 AM – 9:00 PM</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Phone className="h-4 w-4 text-primary" />
                    <a href={`tel:${PHONE}`} className="hover:text-foreground">{PHONE_DISPLAY}</a>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Star className="h-4 w-4 text-primary" />
                    <span>5.0★ · 2 Lakh+ happy customers</span>
                  </div>
                </div>

                <div className="mt-7 grid gap-3">
                  <button
                    onClick={directionsHref}
                    className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-brand px-5 py-3 text-sm font-semibold text-primary-foreground shadow-brand transition-transform hover:-translate-y-0.5"
                  >
                    <MapPin className="h-4 w-4" /> Get Directions
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                  <div className="grid grid-cols-2 gap-3">
                    <a
                      href={`tel:${PHONE}`}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-secondary px-4 py-3 text-sm font-semibold text-foreground transition-all hover:-translate-y-0.5 hover:bg-muted"
                    >
                      <Phone className="h-4 w-4 text-primary" /> Call Now
                    </a>
                    <a
                      href={`https://wa.me/${WHATSAPP}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-secondary px-4 py-3 text-sm font-semibold text-foreground transition-all hover:-translate-y-0.5 hover:bg-muted"
                    >
                      <MessageCircle className="h-4 w-4 text-primary" /> WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

