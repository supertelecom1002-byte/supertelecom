import { createFileRoute, Link } from "@tanstack/react-router";
import { SERVICES } from "@/data/services";
import { SITE_URL, STORE_STREET_ADDRESS } from "@/data/site";
import { ChevronRight, Phone, MessageCircle, MapPin } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import logoAsset from "@/assets/super-telecom-logo.png.asset.json";

const PHONE = "+918002903643";
const PHONE_DISPLAY = "+91 80029 03643";
const WHATSAPP = "918002903643";
const MAPS = "https://maps.app.goo.gl/mu5XXCehEpocaZWY9";

const TITLE = "Mobile Repair Price List Giridih | Super Telecom";
const DESC =
  "Transparent mobile repair prices in Giridih — screen, display, battery, charging port, camera and motherboard repair costs for iPhone, Samsung, Xiaomi, Realme, OPPO & Vivo.";

const BRAND_PRICING: { brand: string; screen: string; battery: string; charging: string }[] = [
  { brand: "iPhone", screen: "₹3,500 – ₹15,000", battery: "₹2,000 – ₹8,000", charging: "₹1,200 – ₹4,000" },
  { brand: "Samsung", screen: "₹1,500 – ₹12,000", battery: "₹900 – ₹4,000", charging: "₹500 – ₹2,000" },
  { brand: "Xiaomi / Redmi", screen: "₹900 – ₹6,000", battery: "₹700 – ₹2,500", charging: "₹400 – ₹1,500" },
  { brand: "Realme", screen: "₹1,000 – ₹6,500", battery: "₹700 – ₹2,500", charging: "₹400 – ₹1,500" },
  { brand: "OPPO", screen: "₹1,000 – ₹7,000", battery: "₹700 – ₹2,800", charging: "₹400 – ₹1,600" },
  { brand: "Vivo", screen: "₹1,000 – ₹7,000", battery: "₹700 – ₹2,800", charging: "₹400 – ₹1,600" },
  { brand: "OnePlus", screen: "₹2,500 – ₹11,000", battery: "₹1,200 – ₹4,000", charging: "₹700 – ₹2,500" },
];

const PRICING_FAQS: [string, string][] = [
  [
    "How much does phone screen repair cost in Giridih?",
    "At Super Telecom, Giridih, entry-level Android screen replacement starts around ₹800–₹1,500, mid-range AMOLED displays run ₹2,500–₹6,000 and iPhone screens range from ₹3,500 to ₹15,000 depending on the model. Diagnosis and the quote are always free.",
  ],
  [
    "How much does a battery replacement cost?",
    "Android batteries generally start at ₹500–₹900 and iPhone batteries range from ₹2,000 to ₹8,000. Every battery is genuine or brand-tested and carries a 6-month warranty.",
  ],
  [
    "Are these repair prices final?",
    "They are honest working ranges. The exact price depends on your model and the part quality you choose. We confirm a fixed price in writing before starting any repair — no hidden charges.",
  ],
  [
    "Do you charge for diagnosis?",
    "No. Diagnosis is completely free at our Barganda Road store in Giridih, and you pay only if you approve the repair.",
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
          "Mobile Repair Price Giridih, Phone Screen Repair Cost Giridih, Battery Replacement Price Giridih, Display Price Giridih, Mobile Repair Rate List Giridih",
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
          <a
            href={`tel:${PHONE}`}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            <Phone className="h-4 w-4" /> Call
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:py-14">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground">Repair Prices</span>
        </nav>

        <h1 className="font-display text-3xl font-bold sm:text-5xl">Mobile Repair Price List in Giridih</h1>
        <p className="mt-4 max-w-3xl text-muted-foreground">
          Honest, transparent repair rates from Super Telecom, Barganda Road, Giridih. The ranges below cover
          the models we service most often. Diagnosis is free, and we confirm a fixed price before starting
          any repair — no hidden charges.
        </p>

        <section aria-labelledby="brand-prices" className="mt-12">
          <h2 id="brand-prices" className="font-display text-2xl font-bold">
            Screen, battery &amp; charging port prices by brand
          </h2>
          <div className="mt-5 overflow-x-auto rounded-2xl border border-border/60">
            <table className="w-full min-w-[560px] text-left text-sm">
              <caption className="sr-only">
                Estimated mobile repair prices in Giridih by brand at Super Telecom
              </caption>
              <thead className="bg-card/60 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th scope="col" className="px-4 py-3">Brand</th>
                  <th scope="col" className="px-4 py-3">Screen / Display</th>
                  <th scope="col" className="px-4 py-3">Battery</th>
                  <th scope="col" className="px-4 py-3">Charging Port</th>
                </tr>
              </thead>
              <tbody>
                {BRAND_PRICING.map((r) => (
                  <tr key={r.brand} className="border-t border-border/50">
                    <th scope="row" className="px-4 py-3 font-semibold">{r.brand}</th>
                    <td className="px-4 py-3 text-muted-foreground">{r.screen}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.battery}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.charging}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="service-prices" className="mt-14">
          <h2 id="service-prices" className="font-display text-2xl font-bold">
            All repair services and price ranges
          </h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {SERVICES.map((s) => (
              <li
                key={s.slug}
                className="rounded-2xl border border-border/60 bg-card/40 p-5 transition-colors hover:border-primary/50"
              >
                <h3 className="font-display text-base font-semibold">
                  <Link to="/services/$slug" params={{ slug: s.slug }} className="hover:text-primary">
                    {s.name} in Giridih
                  </Link>
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.short}</p>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                  <span className="font-semibold text-primary">{s.priceRange}</span>
                  <span className="text-muted-foreground">{s.duration}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="pricing-faq" className="mt-14">
          <h2 id="pricing-faq" className="font-display text-2xl font-bold">Repair cost questions</h2>
          <div className="mt-5 space-y-4">
            {PRICING_FAQS.map(([q, a]) => (
              <details key={q} className="rounded-2xl border border-border/60 bg-card/40 p-5">
                <summary className="cursor-pointer font-semibold">{q}</summary>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-3xl border border-border/60 bg-card/40 p-6 sm:p-8">
          <h2 className="font-display text-2xl font-bold">Get an exact quote today</h2>
          <p className="mt-2 text-muted-foreground">
            Send us your model on WhatsApp or call us — we will tell you the exact price in minutes.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href={`tel:${PHONE}`}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              <Phone className="h-4 w-4" /> {PHONE_DISPLAY}
            </a>
            <a
              href={`https://wa.me/${WHATSAPP}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
            <a
              href={MAPS}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:bg-secondary"
            >
              <MapPin className="h-4 w-4" /> Get Directions
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/50 py-10 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Super Telecom · Barganda Road, Giridih, Jharkhand
      </footer>
    </div>
  );
}
