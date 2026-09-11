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

const PHONE = "+918002903643";
const PHONE_DISPLAY = "+91 80029 03643";
const WHATSAPP = "918002903643";
const EMAIL = "supertelecom1002@gmail.com";
const MAPS_PLACE = "https://maps.app.goo.gl/mu5XXCehEpocaZWY9";
const DIRECTIONS = "https://www.google.com/maps/dir/?api=1&destination=24.1854,86.3040";
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
  { label: "About Us", to: "/", hash: "about" },
  { label: "Services", to: "/", hash: "services" },
  { label: "Pricing", to: "/pricing" },
  { label: "Gallery", to: "/", hash: "gallery" },
  { label: "Reviews", to: "/", hash: "reviews" },
  { label: "FAQ", to: "/", hash: "faq" },
  { label: "Blog & Guides", to: "/blog" },
  { label: "Contact", to: "/", hash: "contact" },
  { label: "Visit Our Store", to: "/", hash: "visit" },
  { label: "Cookie Policy", to: "/cookie-policy" },
  { label: "Sitemap", to: "/sitemap" },
];

const FOOTER_FAQS: [string, string][] = [
  ["How long does display replacement take?", "Most display and screen replacements are completed the same day — usually within 30 to 60 minutes, depending on parts availability for your model."],
  ["Do you repair iPhones in Giridih?", "Yes. We repair all iPhone models — screen, battery, charging port, camera, face ID and motherboard level faults — at our Barganda Road store in Giridih."],
  ["Do you provide warranty on repairs?", "Yes. Every repair carries a warranty from 30 days up to 6 months depending on the part, and second-hand phones are sold with warranty too."],
  ["Do you buy and sell second-hand phones?", "Yes. We buy old phones, offer exchange on upgrades, and sell fully tested second-hand iPhone, Samsung, Vivo, Oppo and Realme handsets."],
  ["What payment methods do you accept?", "UPI (PhonePe, Google Pay, Paytm), Visa and MasterCard debit/credit cards, and cash."],
];

const COUNTERS: { value: number; suffix: string; label: string; decimals?: number }[] = [
  { value: 10, suffix: "+", label: "Years Experience" },
  { value: 1, suffix: "M+", label: "Repairs Completed" },
  { value: 200, suffix: "K+", label: "Happy Customers" },
  { value: 5.0, suffix: "★", label: "Google Rating", decimals: 1 },
];

const BADGES = [
  { Icon: Zap, label: "Fast Same-Day Service" },
  { Icon: ShieldCheck, label: "Warranty Available" },
  { Icon: BadgeCheck, label: "Premium Original Parts" },
  { Icon: Wrench, label: "Expert Technicians" },
];

const PAYMENTS = ["UPI", "PhonePe", "Google Pay", "Paytm", "Visa", "MasterCard", "Cash"];

function useInView<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setInView(true);
            io.disconnect();
          }
        }
      },
      { rootMargin: "80px", threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, inView };
}

function Counter({ value, suffix, decimals = 0, active }: { value: number; suffix: string; decimals?: number; active: boolean }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now();
    const dur = 1400;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, value]);
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
            opens: "09:00",
            closes: "21:00",
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

          {/* ---------------- Main grid ---------------- */}
          <div className="mt-12 grid gap-10 lg:grid-cols-12">
            {/* Brand / GEO description */}
            <div className="lg:col-span-4">
              <BrandLogo size="lg" to="/" />
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Super Telecom is a family-run mobile repair shop in Giridih, Jharkhand, serving customers
                across Barganda, Makatpur, Bank More, Pachamba, Bengabad and nearby areas for over 10 years.
                Our technicians handle everything from display replacement and battery replacement to
                charging port and motherboard repair for iPhone and every Android brand — and we also buy,
                sell and exchange tested second-hand smartphones and accessories.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Customers choose us for honest diagnosis, transparent pricing, original-quality parts and
                same-day turnaround — with a written warranty on every repair.
              </p>

              <ul className="mt-6 flex flex-wrap gap-2" aria-label="Social profiles">
                {SOCIALS.map(({ label, href, Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={label}
                      title={label}
                      className="grid h-10 w-10 place-items-center rounded-full border border-border/60 bg-background/50 text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary"
                    >
                      <Icon className="h-4 w-4" aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Link columns */}
            <div className="grid gap-10 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-3">
              <FooterCol id="footer-services" title="Repair Services" items={SERVICE_LINKS} />
              <FooterCol id="footer-buysell" title="Buy & Sell Phones" items={BUY_SELL_LINKS} />
              <FooterCol id="footer-quick" title="Quick Links" items={QUICK_LINKS} />
            </div>

            {/* Contact */}
            <section aria-labelledby="footer-contact" className="lg:col-span-3">
              <h3 id="footer-contact" className="text-sm font-semibold tracking-wide text-foreground">Contact & Store Hours</h3>
              <address className="mt-4 space-y-4 text-sm not-italic text-muted-foreground">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                  <span>
                    <strong className="block font-medium text-foreground">Super Telecom</strong>
                    Barganda Road, Near Shivam Clinic,<br />Giridih, Jharkhand 815301, India
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                  <a href={`tel:${PHONE}`} className="transition-colors hover:text-primary">{PHONE_DISPLAY}</a>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                  <a href={`mailto:${EMAIL}`} className="break-all transition-colors hover:text-primary">{EMAIL}</a>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                  <span>Monday – Sunday<br />9:00 AM – 9:00 PM</span>
                </div>
                <div className="flex items-start gap-3">
                  <Star className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                  <span>5.0 rating from 500+ Google reviews</span>
                </div>
              </address>
              <div className="mt-5 grid gap-2">
                <a
                  href={MAPS_PLACE}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-brand px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-brand transition-transform hover:scale-[1.03]"
                >
                  <MapPin className="h-4 w-4" aria-hidden /> View on Google Maps
                </a>
                <Link
                  to="/"
                  hash="contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background/60 px-4 py-2.5 text-sm font-semibold text-foreground transition-transform hover:scale-[1.03]"
                >
                  <Wrench className="h-4 w-4 text-primary" aria-hidden /> Get a Free Quote
                </Link>
              </div>
            </section>
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
          <div className="mt-10 flex flex-col gap-4 border-t border-border/50 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Super Telecom. Trusted mobile repair experts in Giridih, Jharkhand.</p>
            <p className="sm:text-right">
              Designed for speed, accessibility, SEO, GEO, AEO and a premium user experience.
            </p>
          </div>
        </div>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(footerSchema) }} />
      </footer>
    </>
  );
}
