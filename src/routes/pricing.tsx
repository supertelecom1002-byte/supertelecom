import { createFileRoute, Link } from "@tanstack/react-router";
import { SERVICES } from "@/data/services";
import { SITE_URL, STORE_STREET_ADDRESS } from "@/data/site";
import { ChevronRight, Phone, MessageCircle, MapPin, AlertCircle, ArrowRight, ShieldCheck, Clock } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { SiteFooter } from "@/components/SiteFooter";

const PHONE = "+918002903643";
const PHONE_DISPLAY = "+91 80029 03643";
const WHATSAPP = "918002903643";
const MAPS = "https://maps.app.goo.gl/mu5XXCehEpocaZWY9";

const TITLE = "Mobile Repair Price List Giridih | Super Telecom";
const DESC =
  "Transparent mobile repair rates in Giridih — screen, display, battery, charging port, camera and motherboard repair costs for iPhone, Samsung, Xiaomi, Realme, OPPO, Vivo, OnePlus.";

const BRAND_PRICING: { brand: string; screen: string; battery: string; charging: string; motherboard: string; slug: string }[] = [
  { brand: "Apple iPhone", screen: "₹3,500 – ₹15,000", battery: "₹2,000 – ₹7,500", charging: "₹1,200 – ₹3,500", motherboard: "₹1,800 – ₹6,500", slug: "iphone" },
  { brand: "Samsung Galaxy", screen: "₹1,500 – ₹14,000", battery: "₹900 – ₹3,800", charging: "₹500 – ₹2,200", motherboard: "₹1,500 – ₹4,500", slug: "samsung" },
  { brand: "Xiaomi / POCO", screen: "₹900 – ₹5,500", battery: "₹700 – ₹2,200", charging: "₹400 – ₹1,400", motherboard: "₹1,200 – ₹3,500", slug: "xiaomi-redmi" },
  { brand: "Realme", screen: "₹1,000 – ₹6,500", battery: "₹700 – ₹2,400", charging: "₹400 – ₹1,500", motherboard: "₹1,200 – ₹3,800", slug: "realme" },
  { brand: "Vivo", screen: "₹1,000 – ₹7,000", battery: "₹700 – ₹2,500", charging: "₹400 – ₹1,500", motherboard: "₹1,200 – ₹3,800", slug: "vivo" },
  { brand: "OPPO", screen: "₹1,000 – ₹7,000", battery: "₹700 – ₹2,600", charging: "₹400 – ₹1,600", motherboard: "₹1,200 – ₹3,800", slug: "oppo" },
  { brand: "OnePlus", screen: "₹2,500 – ₹11,000", battery: "₹1,200 – ₹3,800", charging: "₹700 – ₹2,500", motherboard: "₹1,800 – ₹5,500", slug: "oneplus" },
];

const SERVICE_CLUSTERS = [
  {
    category: "Display & Touch Glass Repairs",
    slugs: ["display-replacement", "screen-replacement", "touch-glass-replacement"],
    description: "Original AMOLED, OLED, and IPS LCD screens, plus OCA outer glass lamination preserving authentic panels.",
  },
  {
    category: "Power, Battery & Charging Repairs",
    slugs: ["battery-replacement", "charging-port-repair", "button-repair"],
    description: "Certified high-backup batteries, fast-charge Type-C daughterboards, and tactile micro-switch buttons.",
  },
  {
    category: "Motherboard, IC & Micro-Soldering",
    slugs: ["motherboard-repair", "ic-chip-level-repair", "dead-phone-repair", "water-damage-repair"],
    description: "Advanced BGA reballing, sandwich motherboard splitting, power management IC, and ultrasonic liquid recovery.",
  },
  {
    category: "Audio & Optics Repairs",
    slugs: ["camera-repair", "speaker-repair", "microphone-repair"],
    description: "Lens glass, optical image stabilization modules, loud speakers, earpieces, and noise-cancelling mics.",
  },
  {
    category: "Software, Security & Data Services",
    slugs: ["software-repair", "frp-unlock", "network-repair", "flashing", "data-recovery"],
    description: "Bootloop resolution, official firmware flashing, baseband network troubleshooting, and data backup.",
  },
  {
    category: "Second-Hand Phones & Protection",
    slugs: ["second-hand-phones", "second-hand-mobile", "mobile-accessories", "tempered-glass"],
    description: "Verified pre-owned handsets with store warranty, UV tempered glass, and premium fast chargers.",
  },
];

const PRICING_FAQS: [string, string][] = [
  [
    "How much does phone screen repair cost in Giridih?",
    "At Super Telecom, Giridih, entry-level Android screen replacement starts around ₹900–₹1,600, mid-range AMOLED displays run ₹2,500–₹6,000, and iPhone screens range from ₹3,500 to ₹15,000 depending on generation. Physical diagnosis and quote are always free.",
  ],
  [
    "How much does a battery replacement cost?",
    "Android batteries generally range from ₹700 to ₹2,500 and iPhone batteries range from ₹2,000 to ₹7,500. Every battery is high-density brand-tested and backed by store warranty.",
  ],
  [
    "Are these repair prices final?",
    "They are honest, realistic working ranges based on daily Giridih bench repairs. Final pricing is confirmed in writing after physical bench inspection before work begins — absolutely no hidden charges.",
  ],
  [
    "Do you charge for diagnosis?",
    "No. Diagnosis is completely free at our Barganda Road shop in Giridih, and you pay only if you approve the written estimate.",
  ],
  [
    "Can you replace only the glass if my screen still works?",
    "Yes. If your underlying AMOLED or LCD panel shows clear picture without lines or bleeding and touch works, our OCA vacuum lamination machine can replace just the glass, saving you up to 50% compared to a full screen replacement.",
  ],
];

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      {
        name: "keywords",
        content:
          "Mobile Repair Price Giridih, Phone Screen Repair Cost Giridih, Battery Replacement Price Giridih, Display Price Giridih, Mobile Repair Rate List Giridih, iPhone repair cost Giridih",
      },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/pricing` },
      { property: "og:site_name", content: "Super Telecom" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
      { name: "geo.region", content: "IN-JH" },
      { name: "geo.placename", content: "Giridih" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/pricing` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: PRICING_FAQS.map(([q, a]) => ({
            "@type": "Question",
            name: q,
            acceptedAnswer: { "@type": "Answer", text: a },
          })),
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: "Repair Prices", item: `${SITE_URL}/pricing` },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "OfferCatalog",
          name: "Mobile Repair Price List — Super Telecom Giridih",
          url: `${SITE_URL}/pricing`,
          itemListElement: SERVICES.map((s, i) => ({
            "@type": "Offer",
            position: i + 1,
            name: `${s.name} in Giridih`,
            priceCurrency: "INR",
            priceRange: s.priceRange,
            url: `${SITE_URL}/services/${s.slug}`,
            availableAtOrFrom: {
              "@type": "LocalBusiness",
              name: "Super Telecom",
              telephone: PHONE,
              address: {
                "@type": "PostalAddress",
                streetAddress: STORE_STREET_ADDRESS,
                addressLocality: "Giridih",
                addressRegion: "Jharkhand",
                postalCode: "815301",
                addressCountry: "IN",
              },
            },
          })),
        }),
      },
    ],
  }),
  component: PricingPage,
});

function PricingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <BrandLogo size="md" to="/" />
          <div className="flex items-center gap-3">
            <a
              href={`tel:${PHONE}`}
              className="inline-flex items-center gap-2 rounded-lg border border-border/60 px-3 py-2 text-xs sm:text-sm font-semibold hover:bg-accent"
            >
              <Phone className="h-3.5 w-3.5 text-primary" /> {PHONE_DISPLAY}
            </a>
            <a
              href={`https://wa.me/${WHATSAPP}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-emerald-500"
            >
              <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground">Repair Prices</span>
        </nav>

        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-primary" /> Barganda Road, Giridih
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-5xl">
            Mobile Repair Price List in Giridih
          </h1>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Transparent, honest repair rates from Super Telecom. Every repair includes free physical diagnosis, genuine quality components, and a written warranty.
          </p>
        </div>

        {/* Mandatory Transparency Disclaimer */}
        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-4 text-xs sm:text-sm text-slate-300">
          <AlertCircle className="h-5 w-5 flex-none text-primary mt-0.5" />
          <div>
            <strong className="text-foreground block mb-0.5">Written Estimate Policy:</strong>
            All figures below represent honest working ranges. Final price is confirmed in writing after physical bench inspection before work begins. No hidden charges or surprise bench fees.
          </div>
        </div>

        {/* Brand vs Repair Type Comparison Table */}
        <section aria-labelledby="brand-prices" className="mt-14">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-primary">Cross-Brand Benchmark</span>
              <h2 id="brand-prices" className="font-display text-2xl font-bold text-foreground">
                Repair Rates by Smartphone Brand
              </h2>
            </div>
            <span className="text-xs text-muted-foreground">Swipe horizontally on mobile to view full table</span>
          </div>

          <div className="mt-5 overflow-x-auto rounded-2xl border border-border/60 bg-card/30">
            <table className="w-full min-w-[700px] text-left text-sm">
              <caption className="sr-only">
                Estimated mobile repair prices in Giridih by brand at Super Telecom
              </caption>
              <thead className="bg-card/70 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th scope="col" className="px-4 py-3.5">Brand</th>
                  <th scope="col" className="px-4 py-3.5">Screen / Display</th>
                  <th scope="col" className="px-4 py-3.5">Battery</th>
                  <th scope="col" className="px-4 py-3.5">Charging Port</th>
                  <th scope="col" className="px-4 py-3.5">Motherboard / IC</th>
                  <th scope="col" className="px-4 py-3.5 text-right">Inquire</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {BRAND_PRICING.map((r) => (
                  <tr key={r.brand} className="transition-colors hover:bg-card/60">
                    <th scope="row" className="px-4 py-3.5 font-semibold text-foreground">
                      <Link to="/brands/$brand" params={{ brand: r.slug }} className="hover:text-primary transition-colors">
                        {r.brand}
                      </Link>
                    </th>
                    <td className="px-4 py-3.5 text-muted-foreground">{r.screen}</td>
                    <td className="px-4 py-3.5 text-muted-foreground">{r.battery}</td>
                    <td className="px-4 py-3.5 text-muted-foreground">{r.charging}</td>
                    <td className="px-4 py-3.5 text-muted-foreground">{r.motherboard}</td>
                    <td className="px-4 py-3.5 text-right">
                      <a
                        href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hi Super Telecom Giridih, I need a repair quote for my ${r.brand} phone.`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-md bg-emerald-600/20 px-2.5 py-1 text-xs font-semibold text-emerald-400 hover:bg-emerald-600/30"
                      >
                        <MessageCircle className="h-3 w-3" /> Quote
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Categorized Repair Services Grid */}
        <section aria-labelledby="service-prices" className="mt-16">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-primary">All Procedures</span>
            <h2 id="service-prices" className="font-display text-2xl font-bold text-foreground">
              Categorized Repair Services &amp; Working Estimates
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Select any procedure below to read technical symptoms, diagnostic steps, and Giridih workshop turnaround times.
            </p>
          </div>

          <div className="mt-8 space-y-10">
            {SERVICE_CLUSTERS.map((cluster) => {
              const clusterServices = SERVICES.filter((s) => cluster.slugs.includes(s.slug));
              return (
                <div key={cluster.category} className="rounded-3xl border border-border/60 bg-card/20 p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border/40 pb-4">
                    <h3 className="font-display text-lg font-bold text-foreground">{cluster.category}</h3>
                    <p className="text-xs text-muted-foreground sm:max-w-md">{cluster.description}</p>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {clusterServices.map((s) => (
                      <div
                        key={s.slug}
                        className="flex flex-col justify-between rounded-2xl border border-border/60 bg-card/40 p-4 transition-colors hover:border-primary/50"
                      >
                        <div>
                          <h4 className="font-display text-sm font-semibold text-foreground">
                            <Link to="/services/$slug" params={{ slug: s.slug }} className="hover:text-primary">
                              {s.name}
                            </Link>
                          </h4>
                          <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">{s.short}</p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-border/30 flex items-center justify-between text-xs">
                          <span className="font-display font-bold text-primary">{s.priceRange}</span>
                          <span className="font-mono text-muted-foreground">{s.duration}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Pricing FAQs */}
        <section aria-labelledby="pricing-faq" className="mt-16">
          <h2 id="pricing-faq" className="font-display text-2xl font-bold text-foreground">
            Frequently Asked Pricing Questions
          </h2>
          <div className="mt-6 space-y-3">
            {PRICING_FAQS.map(([q, a]) => (
              <details key={q} className="rounded-2xl border border-border/60 bg-card/40 p-5">
                <summary className="cursor-pointer font-semibold text-foreground text-sm sm:text-base">{q}</summary>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Conversion CTA */}
        <section className="mt-16 rounded-3xl border border-border/60 bg-card/40 p-6 sm:p-8">
          <h2 className="font-display text-2xl font-bold text-foreground">Get an exact quote today</h2>
          <p className="mt-2 text-muted-foreground text-sm">
            Send us your smartphone brand and issue on WhatsApp or call our shop — our bench technician will provide an exact quote in minutes.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={`tel:${PHONE}`}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              <Phone className="h-4 w-4" /> Call {PHONE_DISPLAY}
            </a>
            <a
              href={`https://wa.me/${WHATSAPP}?text=Hello%20Super%20Telecom,%20I%20would%20like%20a%20repair%20quote`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp Us
            </a>
            <a
              href={MAPS}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-semibold hover:bg-accent"
            >
              <MapPin className="h-4 w-4" /> Get Directions
            </a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
