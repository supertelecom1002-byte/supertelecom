import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { submitBooking } from "@/lib/booking.functions";
import { useEffect, useState } from "react";

import {
  Phone, MessageCircle, MapPin, Calendar, Star, Clock, Shield, Award, Wrench,
  Smartphone, Battery, Zap, Volume2, Mic, Camera, Cpu, Wifi, Download, Droplet,
  Fingerprint, RefreshCw, HardDrive, Headphones, Watch, Cable, ShieldCheck,
  Sparkles, ChevronDown, Mail, Send, ArrowRight, Check, Menu, X, Bot,
} from "lucide-react";
import heroVideoAsset from "@/assets/hero-video.mp4.asset.json";
import logoAsset from "@/assets/super-telecom-logo.png.asset.json";
import { DailyUpdatesSection } from "@/components/DailyUpdatesSection";
import { Hero } from "@/components/Hero";
import { LabTrustStrip } from "@/components/interactive/LabTrustStrip";
import { RepairEstimator } from "@/components/interactive/RepairEstimator";
import { BeforeAfterSlider } from "@/components/interactive/BeforeAfterSlider";
import { EditableBlock } from "@/components/admin/visual/EditableBlock";
import { PricingMatrix } from "@/components/PricingMatrix";
import { LocalFaqSection, LOCAL_AEO_FAQS } from "@/components/LocalFaqSection";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SiteFooter } from "@/components/SiteFooter";
import { BrandLogo } from "@/components/BrandLogo";
import { SITE_URL, STORE_ADDRESS, STORE_STREET_ADDRESS } from "@/data/site";
import { BUSINESS_MASTER } from "@/config/superTelecomConfig";
import { ServiceChips } from "@/components/mobile/ServiceChips";
import { Header } from "@/components/Header";
import { SafeReviewsSection } from "@/components/ReviewsSection";
import { MobileAppShell } from "@/components/layout/MobileAppShell";
import { DeepScanEngine } from "@/components/scanner/DeepScanEngine";
import { TurboCleanModal } from "@/components/dashboard/TurboCleanModal";
import { DoctorDiagnosticModal } from "@/components/dashboard/DoctorDiagnosticModal";
import { SmoothSectionReveal } from "@/components/ui/SmoothSectionReveal";
import { VisualFaultFinder } from "@/components/repair/VisualFaultFinder";
import { Smartphone3DFallback } from "@/components/three/Smartphone3DFallback";
import React from "react";

class SectionErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any) {
    console.warn("Section boundary caught error:", error);
  }
  render() {
    if (this.state.hasError) return this.props.fallback || null;
    return this.props.children;
  }
}

// Safe client-loaded 3D Smartphone Teardown Experience with instant fallback
function SmartphoneTeardownSection() {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    let active = true;
    import("@/components/three/SmartphoneTeardown3D")
      .then((m) => {
        if (active) {
          const Comp = m.default || m.SmartphoneTeardown3D || Smartphone3DFallback;
          setComponent(() => Comp);
        }
      })
      .catch((err) => {
        console.warn("3D Teardown load failure:", err);
        if (active) {
          setComponent(() => Smartphone3DFallback);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  if (!Component) {
    return <Smartphone3DFallback />;
  }

  const Rendered = Component;
  return <Rendered />;
}


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Super Telecom | Best Mobile Repair in Giridih | Barganda Road Chip-Level Lab" },
      { name: "description", content: "Giridih's premier smartphone repair lab on Barganda Road (Near Shivam Clinic). Same-day display replacement, iPhone repair, motherboard chip-level micro-soldering, battery fixes & 16+ free hardware diagnostic tools. Call +91 80029 03643." },
      { name: "keywords", content: "Best Mobile Repair in Giridih, iPhone Screen Repair Barganda Road, Chip Level Lab Giridih, Mobile Repair Shop Giridih, Display Replacement Giridih, Motherboard Micro-Soldering Giridih, Phone Battery Replacement Giridih, Water Damage Repair Giridih, Super Telecom Giridih" },
      { name: "geo.region", content: "IN-JH" },
      { name: "geo.placename", content: "Giridih, Jharkhand" },
      { name: "geo.position", content: "24.1843;86.3075" },
      { name: "ICBM", content: "24.1843, 86.3075" },
      { property: "og:title", content: "Super Telecom | Best Mobile Repair in Giridih | Barganda Road Chip-Level Lab" },
      { property: "og:description", content: "Giridih's premier smartphone repair lab on Barganda Road (Near Shivam Clinic). Same-day display replacement, iPhone repair, motherboard chip-level micro-soldering, battery fixes & 16+ free hardware diagnostic tools. Call +91 80029 03643." },
      { property: "og:url", content: `${SITE_URL}/` },
      { property: "og:type", content: "business.business" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Super Telecom | Best Mobile Repair in Giridih | Barganda Road Chip-Level Lab" },
      { name: "twitter:description", content: "Giridih's premier smartphone repair lab on Barganda Road (Near Shivam Clinic). Same-day display replacement, iPhone repair, motherboard chip-level micro-soldering, battery fixes & 16+ free hardware diagnostic tools. Call +91 80029 03643." },
    ],
    links: [
      { rel: "canonical", href: `${SITE_URL}/` },
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
          "@type": ["ElectronicsRepairStore", "MobilePhoneRepairShop", "LocalBusiness"],
          "@id": `${SITE_URL}/#business`,
          name: "Super Telecom",
          alternateName: "Super Telecom Mobile Repairing Centre & Chip-Level Lab Giridih",
          description:
            "Giridih's premier smartphone repair lab on Barganda Road (Near Shivam Clinic). Same-day display replacement, iPhone repair, motherboard chip-level micro-soldering, battery fixes & 16+ free hardware diagnostic tools.",
          image: `${SITE_URL}/favicon.png`,
          telephone: "+918002903643",
          email: "supertelecom1002@gmail.com",
          url: `${SITE_URL}/`,
          priceRange: "₹₹",
          currenciesAccepted: "INR",
          paymentAccepted: "Cash, UPI (GPay/PhonePe/Paytm), Debit Card, Credit Card, Net Banking",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Barganda Road, Near Shivam Clinic",
            addressLocality: "Giridih",
            addressRegion: "Jharkhand",
            postalCode: "815301",
            addressCountry: "IN",
          },
          geo: { "@type": "GeoCoordinates", latitude: 24.1843, longitude: 86.3075 },
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
          areaServed: [
            { "@type": "AdministrativeArea", name: "Giridih" },
            { "@type": "AdministrativeArea", name: "Barganda" },
            { "@type": "AdministrativeArea", name: "Pachamba" },
            { "@type": "AdministrativeArea", name: "Bada Chowk" },
            { "@type": "AdministrativeArea", name: "Makatpur" },
            { "@type": "State", name: "Jharkhand" },
          ],
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Mobile Repair Services Giridih",
            itemListElement: [
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Smartphone Screen Replacement",
                  description: "Cracked or broken display replacement for iPhone and Android with same-day 90-day warranty.",
                },
                priceSpecification: {
                  "@type": "PriceSpecification",
                  priceCurrency: "INR",
                  minPrice: "799",
                  maxPrice: "9999",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Motherboard IC Micro-Soldering",
                  description: "Chip-level BGA reballing, short circuit isolation, power IC replacement, and dead phone recovery.",
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
                  name: "Battery & Charging Port Replacement",
                  description: "High-backup original battery replacement and Type-C port repair with 90-day warranty.",
                },
                priceSpecification: {
                  "@type": "PriceSpecification",
                  priceCurrency: "INR",
                  minPrice: "499",
                  maxPrice: "2499",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Water Damage Ultrasonic Revival",
                  description: "Precision ultrasonic chemical cleaning, board drying, and component short-circuit restoration.",
                },
                priceSpecification: {
                  "@type": "PriceSpecification",
                  priceCurrency: "INR",
                  minPrice: "499",
                  maxPrice: "2500",
                },
              },
            ],
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "@id": `${SITE_URL}/#pwa-app`,
          name: "Super Telecom Mobile Hardware Diagnostics & Repair Hub",
          operatingSystem: "Android, iOS, Web",
          applicationCategory: "UtilitiesApplication",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "INR",
          },
          description: "100% offline-first client-side smartphone hardware diagnostic suite with 165Hz Speaker Dust Ejector, Touch Matrix 10x15 Digitizer, Display FPS Meter, and Browser Storage Cleaner.",
          featureList: [
            "165Hz Sonic Dust & Water Ejector",
            "Touch Matrix 10x15 Digitizer Grid",
            "Display FPS Meter & High Refresh Rate Test",
            "Battery Guard & Thermals Benchmark",
            "Browser Storage & Cache Cleaner",
            "Live Repair Job Sheet Tracker",
          ],
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
  ["Do you offer warranty on repairs?", "Yes. Every repair is backed by a warranty ranging from 30 to 90 days depending on the service and part grade."],
  ["Is my data safe during repair?", "Super Telecom follows strict data privacy practices. We do not require customer lock-screen passcodes for hardware repairs. As a standard safety practice, we always advise customers to back up data before repair work."],
  ["Are second-hand phones tested and reliable?", "Every used phone goes through a strict quality check — battery health, display, cameras, network, sensors — and is sold with a warranty."],
  ["What payment methods do you accept?", "Cash, UPI (GPay/PhonePe/Paytm), all debit and credit cards, and net banking."],
  ["What are your business hours?", "We're open Monday to Sunday, 10:00 AM to 9:30 PM. Walk in anytime or book ahead on WhatsApp."],
  ["Do you repair all brands?", "Yes — iPhone, Samsung, Xiaomi, Realme, OPPO, Vivo, OnePlus, Motorola, Nokia and more."],
  ["How do I get a price quote?", "Call, WhatsApp or visit us. We diagnose your phone and give you a transparent, no-obligation quote."],
];

function HomePage() {
  const [serviceCategory, setServiceCategory] = useState<string>("all");
  const [desktopScannerOpen, setDesktopScannerOpen] = useState(false);
  const [desktopCleanOpen, setDesktopCleanOpen] = useState(false);
  const [desktopDoctorOpen, setDesktopDoctorOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const action = params.get("action");
      if (action === "scan") {
        setDesktopScannerOpen(true);
      } else if (action === "clean") {
        setDesktopCleanOpen(true);
      } else if (action === "doctor" || action === "ampere") {
        setDesktopDoctorOpen(true);
      }
    }
  }, []);

  const handleSelectCategory = (cat: string) => {
    setServiceCategory(cat);
    const el = document.getElementById("services");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      {/* 100% Native Mobile App Experience (md:hidden) */}
      <div className="md:hidden">
        <MobileAppShell />
      </div>

      {/* Flagship Enterprise Portal (hidden md:block) */}
      <div className="hidden md:block min-h-screen h-auto w-full max-w-full overflow-x-clip bg-background text-foreground">
        <BackgroundFX />
        <Header isHomePage={true} />
        <main id="main" className="w-full max-w-full overflow-x-clip overflow-y-visible">
          <SmoothSectionReveal delayMs={0}>
            <Hero />
          </SmoothSectionReveal>
          <SmoothSectionReveal delayMs={50}>
            <LabTrustStrip />
          </SmoothSectionReveal>

          {/* 14-Point Scroll-Driven 3D Smartphone Teardown Experience */}
          <SectionErrorBoundary fallback={<Smartphone3DFallback />}>
            <SmartphoneTeardownSection />
          </SectionErrorBoundary>

          {/* Interactive Visual Fault Finder ("अपनी समस्या चुनें") */}
          <SmoothSectionReveal delayMs={60}>
            <VisualFaultFinder />
          </SmoothSectionReveal>

          <SmoothSectionReveal delayMs={100}>
            <RepairEstimator />
          </SmoothSectionReveal>
          <SmoothSectionReveal delayMs={50}>
            <TrustBar />
          </SmoothSectionReveal>
          <SmoothSectionReveal delayMs={100}>
            <About />
          </SmoothSectionReveal>
          <SmoothSectionReveal delayMs={100}>
            <Services activeCategory={serviceCategory} onSelectCategory={setServiceCategory} />
          </SmoothSectionReveal>
          <SmoothSectionReveal delayMs={100}>
            <PricingMatrix />
          </SmoothSectionReveal>
          <SmoothSectionReveal delayMs={100}>
            <WhyUs />
          </SmoothSectionReveal>
          <SmoothSectionReveal delayMs={100}>
            <Gallery />
          </SmoothSectionReveal>
          <SmoothSectionReveal delayMs={100}>
            <BeforeAfterSlider />
          </SmoothSectionReveal>
          <SmoothSectionReveal delayMs={100}>
            <DailyUpdatesSection />
          </SmoothSectionReveal>
          <SmoothSectionReveal delayMs={100}>
            <SafeReviewsSection />
          </SmoothSectionReveal>
          <SmoothSectionReveal delayMs={100}>
            <LocalFaqSection />
          </SmoothSectionReveal>
          <SmoothSectionReveal delayMs={100}>
            <Contact />
          </SmoothSectionReveal>
          <SmoothSectionReveal delayMs={100}>
            <VisitStore />
          </SmoothSectionReveal>
        </main>

        <SiteFooter />
        <FloatingActions />

        <DeepScanEngine
          isOpen={desktopScannerOpen}
          onClose={() => setDesktopScannerOpen(false)}
        />

        <TurboCleanModal
          isOpen={desktopCleanOpen}
          onClose={() => setDesktopCleanOpen(false)}
        />

        <DoctorDiagnosticModal
          isOpen={desktopDoctorOpen}
          onClose={() => setDesktopDoctorOpen(false)}
        />
      </div>
    </>
  );
}

function BackgroundFX() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden max-w-full gpu-layer">
      <div className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-primary/20 blur-[140px] will-change-transform" />
      <div className="absolute top-[40%] -right-40 h-[500px] w-[500px] rounded-full bg-accent/20 blur-[120px] will-change-transform" />
      <div className="absolute bottom-0 -left-40 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px] will-change-transform" />
    </div>
  );
}

function TrustBar() {
  const items = [
    [Shield, "Up to 90 Days Warranty"],
    [Award, "10+ Years Experience"],
    [Clock, "Same-Day Repairs"],
    [ShieldCheck, "Genuine Spare Parts"],
    [Star, "Top Rated on Google"],
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
    <section id="about" className="py-8 sm:py-16 md:py-24">
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
              dedicated repair lab on Barganda Road has grown into a trusted mobile care center
              serving customers across Giridih and surrounding districts.
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
                ["Local & Trusted", "Serving Giridih Since 2016"],
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
              ["10+", "Years of Experience in Giridih"],
              ["2016", "Established in Giridih"],
              ["30–60m", "Fast Display & Battery Swaps"],
              ["90 Days", "Parts & Service Warranty"],
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

const REPAIR_SERVICES: Array<[any, string, string, string, string, string]> = [
  [Smartphone, "Screen & Display", "Screen replacement, display repair, touch & LCD fixes for all brands.", "screen", "display-replacement", "30 – 60 min"],
  [Battery, "Battery Replacement", "Genuine batteries with warranty. Fixes drain & backup issues.", "battery", "battery-replacement", "30 – 45 min"],
  [Zap, "Charging Port", "Charging port repair, charging issue diagnosis and clean-up.", "battery", "charging-port-repair", "30 – 45 min"],
  [Volume2, "Speaker & Sound", "Speaker, earpiece and ringer repair for crystal-clear audio.", "screen", "speaker-repair", "30 – 45 min"],
  [Mic, "Microphone", "Mic repair for call clarity, voice notes and video recording.", "other", "microphone-repair", "30 – 45 min"],
  [Camera, "Camera Repair", "Front/rear camera, lens replacement and focus issue fixes.", "iphone", "camera-repair", "30 – 60 min"],
  [Cpu, "Motherboard & IC", "Advanced motherboard, IC and chip-level repairs by experts.", "motherboard", "motherboard-repair", "2 – 6 hours"],
  [Wifi, "Network Issues", "SIM slot, network, signal and connectivity troubleshooting.", "motherboard", "network-repair", "1 – 3 hours"],
  [Download, "Software & Flashing", "Software install, updates, flashing and boot loop repair.", "motherboard", "software-repair", "45 – 90 min"],
  [Droplet, "Water Damage", "Water-damaged and dead phone recovery with ultrasonic cleaning.", "water", "water-damage-repair", "Same day"],
  [Fingerprint, "Fingerprint & Face", "Fingerprint sensor and face unlock repair and calibration.", "iphone", "iphone-repair", "45 – 90 min"],
  [RefreshCw, "Performance Fix", "Hanging, heating and slow-phone optimization and cleanup.", "motherboard", "dead-phone-repair", "Same day"],
  [HardDrive, "Data Recovery", "Recover contacts, photos and backup before/after repairs.", "motherboard", "data-recovery", "1 – 2 days"],
  [Wrench, "Buttons & Ports", "Power, volume, home button, SIM tray and memory slot repair.", "battery", "button-repair", "30 – 45 min"],
];

const ACCESSORY_CATEGORIES = [
  "Chargers & Fast Chargers", "USB Cables & OTG", "Power Banks", "Earphones & Neckbands",
  "Bluetooth Speakers", "Smart Watches", "Mobile Covers & Back Covers", "Tempered Glass",
  "Camera Lens Protection", "Memory Cards & Adapters", "Car Chargers & Holders",
  "Ring Holders, Tripods & Selfie Sticks",
];

function Services({
  activeCategory = "all",
  onSelectCategory,
}: {
  activeCategory?: string;
  onSelectCategory?: (cat: string) => void;
}) {
  const filteredServices = REPAIR_SERVICES.filter(([Icon, title, desc, cat]) => {
    if (activeCategory === "all") return true;
    if (activeCategory === "screen") return cat === "screen" || title.toLowerCase().includes("screen") || title.toLowerCase().includes("display");
    if (activeCategory === "iphone") return cat === "iphone" || title.toLowerCase().includes("camera") || title.toLowerCase().includes("fingerprint") || title.toLowerCase().includes("face");
    if (activeCategory === "motherboard") return cat === "motherboard" || title.toLowerCase().includes("motherboard") || title.toLowerCase().includes("ic") || title.toLowerCase().includes("software") || title.toLowerCase().includes("data");
    if (activeCategory === "battery") return cat === "battery" || title.toLowerCase().includes("battery") || title.toLowerCase().includes("charging") || title.toLowerCase().includes("buttons");
    if (activeCategory === "water") return cat === "water" || title.toLowerCase().includes("water");
    return true;
  });

  return (
    <section id="services" className="py-8 sm:py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader
          eyebrow="What we do"
          title={<EditableBlock contentKey="services_title" defaultValue="Complete mobile care under one roof" />}
          sub={<EditableBlock contentKey="services_sub" defaultValue="From screen swaps to chip-level IC work, second-hand smartphones to premium accessories — we've got every mobile need covered." type="textarea" />}
        />

        {/* Category Filter Chips inside section */}
        {onSelectCategory && (
          <div className="mt-8 flex justify-center">
            <ServiceChips activeCategory={activeCategory} onSelectCategory={onSelectCategory} />
          </div>
        )}

        <div className="mt-6 sm:mt-10 grid grid-cols-2 gap-2.5 sm:gap-5 px-1 sm:px-0 lg:grid-cols-3 xl:grid-cols-4">
          {filteredServices.map(([Icon, title, desc, _cat, slug, duration]) => (
            <div key={title} className="group relative flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl glass p-3 sm:p-6 transition-all active:scale-95 card-hover-lift min-h-[48px]">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-brand opacity-0 blur-3xl transition-opacity group-hover:opacity-40" />
              <div className="relative">
                <div className="grid h-8 w-8 sm:h-12 sm:w-12 place-items-center rounded-xl sm:rounded-2xl bg-gradient-brand shadow-brand">
                  <Icon className="h-4 w-4 sm:h-6 sm:w-6 text-primary-foreground" />
                </div>
                <h3 className="mt-2.5 sm:mt-5 font-display text-xs sm:text-lg font-semibold leading-tight line-clamp-2">
                  <Link to="/services/$slug" params={{ slug }} className="hover:text-primary transition-colors">
                    {title}
                  </Link>
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground hidden sm:block">{desc}</p>
              </div>
              <div className="relative mt-3 sm:mt-5 pt-2 sm:pt-3 border-t border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-0 text-[11px] sm:text-xs">
                <span className="text-cyan-400 font-mono font-medium truncate">{duration}</span>
                <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
                  <Link
                    to="/services/$slug"
                    params={{ slug }}
                    className="font-semibold text-primary hover:underline inline-flex items-center gap-0.5 text-[11px] sm:text-xs"
                  >
                    <span>Details</span> <ArrowRight className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  </Link>
                  <a
                    href={`https://wa.me/${WHATSAPP}?text=Hi%20Super%20Telecom,%20I%20need%20help%20with%20${encodeURIComponent(title)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-emerald-400 hover:underline text-[11px] sm:text-xs"
                  >
                    Quote
                  </a>
                </div>
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
              <Link to="/services/$slug" params={{ slug: "second-hand-mobile" }} className="mt-6 inline-flex items-center rounded-full bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-brand">
                Explore Second-Hand Phones <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
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
              <div className="mt-6">
                <Link to="/services/$slug" params={{ slug: "mobile-accessories" }} className="inline-flex items-center rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:bg-secondary">
                  Explore Accessories in Giridih <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
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
    [Shield, "Trusted Local Business", "Established 2016 • 10+ Years Experience in Giridih."],
    [Star, "Customer Satisfaction", "Top-rated local lab with verified Google Maps reviews."],
    [Cable, "Latest Equipment", "Modern tools for chip-level and micro-soldering work."],
  ];
  return (
    <section className="py-8 sm:py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader eyebrow="Why choose us" title="Why customers keep coming back" />
        <div className="mt-8 sm:mt-14 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5">
          {items.map(([Icon, t, d]) => (
            <div key={t} className="rounded-2xl sm:rounded-3xl glass p-3.5 sm:p-6 transition-all hover:-translate-y-1 hover:shadow-glow">
              <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              <div className="mt-2.5 sm:mt-4 font-display text-xs sm:text-lg font-semibold leading-tight">{t}</div>
              <p className="mt-1 sm:mt-1.5 text-[11px] sm:text-sm text-muted-foreground leading-relaxed line-clamp-2 sm:line-clamp-none">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  const labPhotos = [
    {
      title: "Microscope Motherboard Soldering",
      sub: "BGA chip replacement & 0.02mm jumper micro-soldering",
      badge: "45X Trinocular Bench",
      img: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Precision Electronics Micro-rework",
      sub: "Hot-air reflow, CPU reballing, and ESD-safe chip servicing",
      badge: "Surface Mount IC Rework",
      img: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Clean Hardware Diagnostics",
      sub: "Thermal imaging & digital multi-meter line short isolation",
      badge: "Diagnostic Subsystem",
      img: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Display Restoration Bench",
      sub: "Curved AMOLED touch glass separation & OCA lamination",
      badge: "Clean Bench Chamber",
      img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  return (
    <section id="gallery" className="py-8 sm:py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader
          eyebrow="Flagship Lab"
          title="Inside Super Telecom Workshop"
          sub="Illustrative preview of our Barganda Road smartphone engineering laboratory, optical workstations, and micro-soldering equipment standards."
        />
        <div className="mt-8 sm:mt-14 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
          {labPhotos.map((item, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-slate-950 relative">
                <img
                  src={item.img}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <span className="absolute top-2 left-2 sm:top-3 sm:left-3 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-slate-950/80 border border-cyan-500/40 text-cyan-300 text-[9px] sm:text-[10px] font-mono font-bold tracking-wider uppercase">
                  {item.badge}
                </span>
              </div>
              <div className="p-3 sm:p-5">
                <h3 className="font-display text-xs sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-1">
                  {item.title}
                </h3>
                <p className="mt-1 text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                  {item.sub}
                </p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground font-mono">
          * Workshop photos represent illustrative facility standards and diagnostic equipment used at Super Telecom.
        </p>
      </div>
    </section>
  );
}

function Testimonials() {
  return <SafeReviewsSection />;
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
    "Namaste Super Telecom,",
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

    <section id="contact" className="py-8 sm:py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader
          eyebrow="Contact"
          title="Book a repair or drop by our store"
          sub="Reach us on call, WhatsApp or fill out the form — we usually reply within minutes."
        />
        <div className="mt-8 sm:mt-14 grid gap-6 sm:gap-8 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-2">
            <ContactCard icon={Phone} label="Call us" value={<EditableBlock contentKey="contact_phone" defaultValue={PHONE_DISPLAY} />} href={`tel:${PHONE}`} />
            <ContactCard icon={MessageCircle} label="WhatsApp" value={<EditableBlock contentKey="contact_whatsapp_text" defaultValue="Chat with our team" />} href={`https://wa.me/${WHATSAPP}`} />
            <ContactCard icon={MapPin} label="Visit us" value={<EditableBlock contentKey="contact_address_full" defaultValue="Super Telecom, Giridih, Jharkhand" />} href={MAPS} />
            <ContactCard icon={Clock} label="Hours" value={<EditableBlock contentKey="contact_hours_full" defaultValue="Mon–Sun · 10:00 AM – 9:30 PM" />} />
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
              {sent ? (<><Check className="mr-2 h-4 w-4" /> Request Sent</>) : submitting ? "Sending…" : (<><Send className="mr-2 h-4 w-4" /> Send booking request</>)}
            </button>
            {sent && booking && (
              <div className="mt-5 rounded-2xl border border-primary/30 bg-primary/5 p-5">
                <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-emerald-400" /> Request received — our team has it now
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

function FloatingActions() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleOpenAiBot = () => {
    window.dispatchEvent(new CustomEvent("st:open-chat"));
  };

  return (
    <aside
      aria-label="Quick Communication Dock"
      className="hidden md:flex fixed bottom-6 right-6 z-40 items-center gap-1.5 p-1.5 rounded-full bg-slate-950/90 border border-slate-800 shadow-2xl backdrop-blur-xl ring-1 ring-cyan-500/20 select-none animate-in fade-in slide-in-from-bottom-3 duration-300"
    >
      {/* 1. WhatsApp Action */}
      <a
        href={`https://wa.me/${WHATSAPP}?text=Hi%20Super%20Telecom,%20I%20need%20assistance%20with%20my%20phone%20repair`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        title="WhatsApp Super Telecom"
        className="group relative flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 hover:scale-105 active:scale-95 transition-all shadow-sm"
      >
        <MessageCircle className="h-5 w-5" />
      </a>

      {/* 2. Direct Call Action */}
      <a
        href={`tel:${PHONE}`}
        aria-label="Call Super Telecom Technician"
        title={`Call ${PHONE_DISPLAY}`}
        className="group relative flex h-11 w-11 items-center justify-center rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 hover:scale-105 active:scale-95 transition-all shadow-sm"
      >
        <Phone className="h-5 w-5" />
      </a>

      {/* 3. Direct Email Action */}
      <a
        href={`mailto:${EMAIL}`}
        aria-label="Email Super Telecom"
        title={`Email ${EMAIL}`}
        className="group relative flex h-11 w-11 items-center justify-center rounded-full bg-slate-800/80 border border-slate-700/60 text-slate-300 hover:bg-slate-700 hover:text-white hover:scale-105 active:scale-95 transition-all shadow-sm"
      >
        <Mail className="h-4 w-4" />
      </a>

      {/* 4. AI Assistant Bot Action */}
      <button
        type="button"
        onClick={handleOpenAiBot}
        aria-label="Open Super Telecom AI Assistant"
        title="Ask Super Telecom AI"
        className="group relative flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 text-white hover:scale-105 active:scale-95 transition-all shadow-lg shadow-cyan-500/30 cursor-pointer"
      >
        <Bot className="h-5 w-5 transition-transform group-hover:rotate-6" />
        <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
        </span>
      </button>

      {/* 5. Back to Top Action */}
      {showTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll back to top"
          title="Back to top"
          className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <ChevronDown className="h-4 w-4 rotate-180" />
        </button>
      )}
    </aside>
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
    <section id="visit" className="relative py-8 sm:py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div
          className={`transition-all duration-700 ${inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
        >
          <SectionHeader
            eyebrow="Find us"
            title="Visit Super Telecom"
            sub="Visit our store for mobile repair, second-hand phones, accessories, software services, unlocking, flashing, and professional mobile solutions."
          />

          <div className="mt-8 sm:mt-12 grid gap-6 lg:grid-cols-5">
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
                    <span>Open Mon–Sun · 10:00 AM – 9:30 PM</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Phone className="h-4 w-4 text-primary" />
                    <a href={`tel:${PHONE}`} className="hover:text-foreground">{PHONE_DISPLAY}</a>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Star className="h-4 w-4 text-primary fill-primary" />
                    <span>{BUSINESS_MASTER.experienceClaim}</span>
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

