import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Phone, MessageCircle, MapPin, Mail, Clock, Navigation, Calendar,
  Star, ShieldCheck, Zap, Wrench, ChevronDown, Facebook, Instagram, Youtube,
  ArrowUpRight, CreditCard, BadgeCheck,
} from "lucide-react";
import logoAsset from "@/assets/super-telecom-logo.png.asset.json";
import { BrandLogo } from "@/components/BrandLogo";
import { SITE_URL } from "@/data/site";
import { BUSINESS_MASTER, DATA_SAFETY_AND_PRIVACY_SUMMARY } from "@/config/superTelecomConfig";

const PHONE = BUSINESS_MASTER.phoneRaw;
const PHONE_DISPLAY = BUSINESS_MASTER.phoneDisplay;
const WHATSAPP = BUSINESS_MASTER.whatsappNumber;
const EMAIL = BUSINESS_MASTER.email;
const MAPS_PLACE = BUSINESS_MASTER.mapsUrl;
const DIRECTIONS = "https://www.google.com/maps/dir/?api=1&destination=24.1843,86.3075";
const SITE = SITE_URL;

const SOCIALS = [
  { label: "Facebook", href: "https://www.facebook.com/", Icon: Facebook },
  { label: "Instagram", href: "https://www.instagram.com/", Icon: Instagram },
  { label: "YouTube", href: "https://www.youtube.com/", Icon: Youtube },
  { label: "WhatsApp", href: `https://wa.me/${WHATSAPP}`, Icon: MessageCircle },
  { label: "Google Business Profile", href: MAPS_PLACE, Icon: MapPin },
];

const SERVICE_LINKS: { label: string; to: string }[] = [
  { label: "Screen Replacement Giridih", to: "/services/screen-replacement" },
  { label: "Display Replacement Giridih", to: "/services/display-replacement" },
  { label: "Touch Glass Repair", to: "/services/touch-glass-replacement" },
  { label: "Battery Replacement Giridih", to: "/services/battery-replacement" },
  { label: "Charging Port Repair Giridih", to: "/services/charging-port-repair" },
  { label: "Motherboard Repair Giridih", to: "/services/motherboard-repair" },
  { label: "Camera Repair", to: "/services/camera-repair" },
  { label: "Speaker & Mic Repair", to: "/services/speaker-mic-repair" },
  { label: "Water Damage Repair", to: "/services/water-damage-repair" },
  { label: "Dead Phone Repair", to: "/services/dead-phone-repair" },
  { label: "Software Flashing & Bootloop", to: "/services/software-repair" },
  { label: "Network & FRP Unlock", to: "/services/frp-unlock" },
  { label: "Data Recovery", to: "/services/data-recovery" },
  { label: "iPhone Repair Giridih", to: "/services/iphone-repair" },
  { label: "Android Repair Giridih", to: "/services/android-repair" },
];

const BRAND_LINKS: { label: string; to: string }[] = [
  { label: "Apple iPhone Repair", to: "/brands/iphone" },
  { label: "Samsung Galaxy Repair", to: "/brands/samsung" },
  { label: "Xiaomi & POCO Repair", to: "/brands/xiaomi-redmi" },
  { label: "Realme Repair Giridih", to: "/brands/realme" },
  { label: "Vivo Smartphone Repair", to: "/brands/vivo" },
  { label: "OPPO Smartphone Repair", to: "/brands/oppo" },
  { label: "OnePlus Repair Giridih", to: "/brands/oneplus" },
  { label: "All Supported Brands", to: "/brands" },
];

const BUY_SELL_LINKS: { label: string; to: string }[] = [
  { label: "Second Hand Mobile Giridih", to: "/services/second-hand-mobile" },
  { label: "Used iPhone in Giridih", to: "/services/second-hand-mobile" },
  { label: "Used Samsung Phones", to: "/services/second-hand-mobile" },
  { label: "Used Vivo & Oppo Phones", to: "/services/second-hand-mobile" },
  { label: "Used Realme Phones", to: "/services/second-hand-mobile" },
  { label: "Phone Exchange & Upgrade", to: "/services/second-hand-mobile" },
  { label: "Sell Your Old Phone", to: "/services/second-hand-mobile" },
  { label: "Mobile Accessories Giridih", to: "/services/mobile-accessories" },
  { label: "Repair Price List", to: "/pricing" },
];

const QUICK_LINKS: { label: string; to: string; hash?: string }[] = [
  { label: "Home", to: "/" },
  { label: "SmartFinder AI", to: "/smartfinder" },
  { label: "About Us", to: "/about" },
  { label: "Services", to: "/", hash: "services" },
  { label: "Pricing", to: "/pricing" },
  { label: "Download App", to: "/download" },
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms of Service", to: "/terms" },
  { label: "Warranty Policy", to: "/warranty" },
  { label: "Reviews", to: "/", hash: "reviews" },
  { label: "FAQ", to: "/", hash: "faq" },
  { label: "Blog & Guides", to: "/blog" },
  { label: "Contact", to: "/", hash: "contact" },
  { label: "Visit Our Store", to: "/", hash: "visit" },
  { label: "Cookie Policy", to: "/cookie-policy" },
  { label: "Sitemap", to: "/sitemap" },
  { label: "Admin Portal", to: "/admin/login" },
];

const LEGAL_COMPLIANCE_LINKS: { label: string; to: string }[] = [
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms & Conditions", to: "/terms" },
  { label: "90-Day Lab Warranty", to: "/warranty" },
  { label: "About Our Lab & Team", to: "/about" },
  { label: "Download Android APK", to: "/download" },
  { label: "Repair Price List", to: "/pricing" },
  { label: "Cookie Policy", to: "/cookie-policy" },
  { label: "HTML Sitemap", to: "/sitemap" },
];

const CORE_SERVICES_LINKS: { label: string; to: string }[] = [
  { label: "iPhone Lab Specialist", to: "/brands/iphone" },
  { label: "Chip-Level IC & Motherboard", to: "/services/motherboard-repair" },
  { label: "Screen & OLED Restoration", to: "/services/screen-replacement" },
  { label: "High-Density Battery Swap", to: "/services/battery-replacement" },
  { label: "Charging Port & Audio Repair", to: "/services/charging-port-repair" },
  { label: "Water Damage Revival", to: "/services/water-damage-repair" },
  { label: "16-in-1 Offline Lab Tools", to: "/download" },
  { label: "Certified Pre-Owned Phones", to: "/services/second-hand-mobile" },
];

const FOOTER_FAQS: [string, string][] = [
  ["How long does display replacement take?", "Most display and screen replacements are completed the same day — usually within 30 to 60 minutes, depending on parts availability for your model."],
  ["Do you repair iPhones in Giridih?", "Yes. We repair all iPhone models — screen, battery, charging port, camera, face ID and motherboard level faults — at our Barganda Road store in Giridih."],
  ["Do you provide warranty on repairs?", "Yes. Every repair carries a warranty from 30 days up to 6 months depending on the part, and second-hand phones are sold with warranty too."],
  ["Do you buy and sell second-hand phones?", "Yes. We buy old phones, offer exchange on upgrades, and sell fully tested second-hand iPhone, Samsung, Vivo, Oppo and Realme handsets."],
  ["What payment methods do you accept?", "UPI (PhonePe, Google Pay, Paytm), Visa and MasterCard debit/credit cards, and cash."],
];

const COUNTERS: { value: number; suffix: string; label: string; decimals?: number }[] = [
  { value: 10, suffix: "+", label: "Years in Giridih" },
  { value: 25, suffix: "K+", label: "Repairs Handled" },
  { value: 10, suffix: "K+", label: "Satisfied Customers" },
  { value: 5.0, suffix: " / 5", label: "Customer Rating", decimals: 1 },
];

const BADGES = [
  { Icon: Zap, label: "Fast Same-Day Service" },
  { Icon: ShieldCheck, label: "Warranty Available" },
  { Icon: BadgeCheck, label: "Premium Tested Parts" },
  { Icon: Wrench, label: "Expert Technicians" },
];

const PAYMENTS = ["UPI", "PhonePe", "Google Pay", "Paytm", "Visa", "MasterCard", "Cash"];

function useInView<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(true); // Default to true for robust SSR & crawlability
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setInView(true);
            io.disconnect();
          }
        }
      },
      { rootMargin: "100px 0px", threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, inView };
}

function Counter({ value, suffix, decimals = 0, active }: { value: number; suffix: string; decimals?: number; active: boolean }) {
  const [n, setN] = useState(value); // Always initialize with real value to prevent 0 on SSR or slow scroll
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!active || hasAnimated) return;
    setHasAnimated(true);
    let raf = 0;
    const start = performance.now();
    const dur = 1000;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, value, hasAnimated]);

  return (
    <span>
      {n.toFixed(decimals)}
      {suffix}
    </span>
  );
}

function FooterCol({ title, items, id }: { title: string; items: { label: string; to: string; hash?: string }[]; id: string }) {
  return (
    <nav aria-labelledby={id} className="min-w-0">
      <h3 id={id} className="text-sm font-semibold tracking-wide text-foreground">{title}</h3>
      <ul className="mt-4 space-y-2.5 text-sm">
        {items.map((i) => (
          <li key={i.label}>
            <Link
              to={i.to}
              hash={i.hash}
              className="group inline-flex items-start gap-1 text-muted-foreground transition-colors hover:text-primary"
            >
              <span>{i.label}</span>
              <ArrowUpRight className="mt-0.5 h-3 w-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function SiteFooter() {
  const { ref, inView } = useInView<HTMLDivElement>();

  const footerSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["LocalBusiness", "ElectronicsStore"],
        "@id": `${SITE}/#business`,
        name: "Super Telecom",
        description:
          "Mobile repair shop in Giridih, Jharkhand for screen, battery, charging port, IC and software repair. Super Telecom also offers phone unlocking and accessories.",
        image: `${SITE}/favicon.png`,
        telephone: PHONE,
        email: EMAIL,
        url: `${SITE}/`,
        priceRange: "₹₹",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Barganda Road, Near Shivam Clinic",
          addressLocality: "Giridih",
          addressRegion: "Jharkhand",
          postalCode: "815301",
          addressCountry: "IN",
        },
        geo: { "@type": "GeoCoordinates", latitude: 24.1854, longitude: 86.304 },
        hasMap: MAPS_PLACE,
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
      },
      {
        "@type": "Service",
        "@id": `${SITE}/#repair-service`,
        serviceType: "Mobile Phone Repair",
        provider: { "@id": `${SITE}/#business` },
        areaServed: { "@type": "City", name: "Giridih" },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Mobile Repair Services in Giridih",
          itemListElement: SERVICE_LINKS.map((s) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: s.label, url: `${SITE}${s.to}` },
          })),
        },
      },
    ],
  };

  return (
    <>
      {/* ---------------- CTA ---------------- */}
      <section aria-labelledby="footer-cta-title" className="relative px-4 pb-4 pt-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-surface/70 p-8 shadow-elegant backdrop-blur-xl sm:p-12">
            <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gradient-brand opacity-20 blur-3xl" />
            <div aria-hidden className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-gradient-brand opacity-10 blur-3xl" />
            <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Mobile Repair Shop in Giridih</p>
                <h2 id="footer-cta-title" className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
                  Need mobile repair today?
                </h2>
                <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
                  Fast repairs, original-quality parts, expert technicians and same-day service — walk in
                  to our Barganda Road store or message us and we'll diagnose your phone free of charge.
                </p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {BADGES.map(({ Icon, label }) => (
                    <li key={label} className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/50 px-3 py-1.5 text-xs font-medium text-muted-foreground">
                      <Icon className="h-3.5 w-3.5 text-primary" aria-hidden />
                      {label}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid w-full gap-3 sm:grid-cols-2 lg:w-[24rem]">
                <Link
                  to="/"
                  hash="contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-brand px-5 py-3 text-sm font-semibold text-primary-foreground shadow-brand transition-transform hover:scale-[1.03]"
                >
                  <Calendar className="h-4 w-4" aria-hidden /> Book Repair
                </Link>
                <a
                  href={`https://wa.me/${WHATSAPP}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-5 py-3 text-sm font-semibold text-foreground transition-transform hover:scale-[1.03]"
                >
                  <MessageCircle className="h-4 w-4 text-emerald-500" aria-hidden /> WhatsApp
                </a>
                <a
                  href={`tel:${PHONE}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background/60 px-5 py-3 text-sm font-semibold text-foreground transition-transform hover:scale-[1.03]"
                >
                  <Phone className="h-4 w-4 text-primary" aria-hidden /> Call Now
                </a>
                <a
                  href={DIRECTIONS}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background/60 px-5 py-3 text-sm font-semibold text-foreground transition-transform hover:scale-[1.03]"
                >
                  <Navigation className="h-4 w-4 text-primary" aria-hidden /> Directions
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative mt-6 border-t border-border/50 bg-surface/30" aria-labelledby="footer-heading">
        <h2 id="footer-heading" className="sr-only">Super Telecom — mobile repair shop in Giridih, footer</h2>
        <div ref={ref} className="mx-auto max-w-7xl px-4 py-14 sm:px-6">

          {/* ---------------- Trust counters ---------------- */}
          <section aria-label="Super Telecom trust statistics" className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {COUNTERS.map((c, idx) => (
              <div
                key={c.label}
                className="rounded-2xl border border-border/60 bg-surface/60 p-5 text-center shadow-brand/20 backdrop-blur-xl transition-transform hover:-translate-y-1"
                style={{ animation: inView ? `fade-up 0.6s ease-out ${idx * 0.08}s both` : undefined }}
              >
                <div className="font-display text-2xl font-bold text-gradient sm:text-3xl">
                  <Counter value={c.value} suffix={c.suffix} decimals={c.decimals} active={inView} />
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{c.label}</div>
              </div>
            ))}
          </section>

          {/* ---------------- Main 4-Column Responsive Grid ---------------- */}
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Column 1: Brand & Lab Hub */}
            <div className="space-y-4">
              <BrandLogo size="lg" to="/" />
              <p className="text-xs leading-relaxed text-muted-foreground">
                Super Telecom is Jharkhand&apos;s premier smartphone micro-soldering and flagship screen restoration lab. Serving Giridih with honest bench diagnostics since 2016.
              </p>
              <address className="space-y-2.5 text-xs not-italic text-muted-foreground">
                <div className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
                  <span>{BUSINESS_MASTER.fullAddress}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
                  <a href={`tel:${PHONE}`} className="hover:text-primary font-medium">{PHONE_DISPLAY}</a>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
                  <span>{BUSINESS_MASTER.hours.shortDisplay}</span>
                </div>
              </address>
              <ul className="flex flex-wrap gap-2 pt-1" aria-label="Social profiles">
                {SOCIALS.map(({ label, href, Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={label}
                      title={label}
                      className="grid h-8 w-8 place-items-center rounded-full border border-border/60 bg-background/50 text-muted-foreground transition-all hover:border-primary/50 hover:text-primary"
                    >
                      <Icon className="h-3.5 w-3.5" aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Services & Diagnostics */}
            <FooterCol id="footer-services" title="Services & Diagnostics" items={CORE_SERVICES_LINKS} />

            {/* Column 3: Legal & Compliance */}
            <FooterCol id="footer-compliance" title="Legal & Compliance" items={LEGAL_COMPLIANCE_LINKS} />

            {/* Column 4: Trust & Security */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold tracking-wide text-foreground">Trust &amp; Security</h3>
              <div className="space-y-2.5 text-xs">
                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-surface/60 border border-border/60">
                  <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-foreground font-semibold">{DATA_SAFETY_AND_PRIVACY_SUMMARY.trustPill}</strong>
                    <span className="text-muted-foreground text-[11px]">{DATA_SAFETY_AND_PRIVACY_SUMMARY.shortAdvisory}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-surface/60 border border-border/60">
                  <BadgeCheck className="h-4 w-4 text-cyan-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-foreground font-semibold">Verified OEM Quality Parts</strong>
                    <span className="text-muted-foreground text-[11px]">Grade-tested panels &amp; high-density batteries</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-surface/60 border border-border/60">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-foreground font-semibold">Customer Reviews on Google Maps</strong>
                    <a
                      href={BUSINESS_MASTER.googleReviewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-[11px] font-medium block"
                    >
                      View ratings &amp; verified reviews on Google Maps &rarr;
                    </a>
                  </div>
                </div>
              </div>


              <div className="pt-1 flex flex-col gap-2">
                <a
                  href={MAPS_PLACE}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-brand px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-brand transition-transform hover:scale-[1.02]"
                >
                  <MapPin className="h-3.5 w-3.5" /> Get Lab Directions
                </a>
              </div>
            </div>
          </div>

          {/* ---------------- AEO FAQ ---------------- */}
          <section aria-labelledby="footer-faq-title" className="mt-14 rounded-3xl border border-border/60 bg-surface/50 p-6 backdrop-blur-xl sm:p-8">
            <h3 id="footer-faq-title" className="font-display text-lg font-bold">Quick answers about mobile repair in Giridih</h3>
            <div className="mt-4 grid gap-2 md:grid-cols-2">
              {FOOTER_FAQS.map(([q, a]) => (
                <details key={q} className="group rounded-2xl border border-border/50 bg-background/40 px-4 py-3 transition-colors hover:border-primary/40">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium text-foreground">
                    {q}
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden />
                  </summary>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* ---------------- Payments ---------------- */}
          <section aria-label="Accepted payment methods" className="mt-10 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              <CreditCard className="h-4 w-4 text-primary" aria-hidden /> We accept
            </span>
            {PAYMENTS.map((p) => (
              <span key={p} className="rounded-lg border border-border/60 bg-background/50 px-3 py-1.5 text-xs font-medium text-muted-foreground">
                {p}
              </span>
            ))}
          </section>

          {/* ---------------- Bottom ---------------- */}
          <div className="mt-10 flex flex-col gap-2 border-t border-border/50 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Super Telecom Lab. All Rights Reserved. Engineered for Giridih &amp; Beyond.</p>
            <p className="sm:text-right font-medium text-slate-700 dark:text-slate-300">
              Barganda Road, Near Shivam Clinic, Giridih, Jharkhand 815301 &bull; 100% Customer Data Privacy Guarantee.
            </p>
          </div>
        </div>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(footerSchema) }} />
      </footer>
    </>
  );
}

export { SiteFooter as Footer };
export default SiteFooter;
