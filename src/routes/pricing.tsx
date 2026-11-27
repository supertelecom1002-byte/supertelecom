import { createFileRoute, Link } from "@tanstack/react-router";
import { getLegacyCompatibleServices } from "@/data/repairServicesSiloData";
import { SITE_URL, STORE_STREET_ADDRESS } from "@/data/site";
import { REPAIR_PRICE_DISCLAIMER } from "@/config/superTelecomConfig";
import { ChevronRight, Phone, MessageCircle, MapPin, AlertCircle, ArrowRight, ShieldCheck, Clock } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { SiteFooter } from "@/components/SiteFooter";
import { RepairConsultationAction } from "@/components/consultation/RepairConsultationAction";
import { PricingMatrix } from "@/components/PricingMatrix";
import { RepairEstimator } from "@/components/interactive/RepairEstimator";
import { BudgetToFlagshipPromise } from "@/components/BudgetToFlagshipPromise";

const PHONE = "+918002903643";
const PHONE_DISPLAY = "+91 80029 03643";
const WHATSAPP = "918002903643";
const MAPS = "https://maps.app.goo.gl/mu5XXCehEpocaZWY9";

const TITLE = "सबसे कम दाम, सबसे बेस्ट क्वालिटी — Super Telecom Best Price Promise (Giridih)";
const DESC =
  "सस्ते बजट फ़ोन से लेकर महँगे फ्लैगशिप (iPhone, Samsung Ultra, OnePlus) तक — गिरिडीह के सबसे कम दामों में 100% जेनुइन मोबाइल रिपेयरिंग, मुफ़्त जांच और लिखित वारंटी। Barganda Road, Giridih.";

const BRAND_SERVICES: { brand: string; screen: string; battery: string; charging: string; motherboard: string; slug: string }[] = [
  { brand: "Apple iPhone", screen: "सबसे कम दाम • OEM OLED", battery: "BMS 100% हेल्थ सिंक", charging: "तेज़ पोर्ट रिपेयर", motherboard: "45X BGA लैब", slug: "iphone" },
  { brand: "Samsung Galaxy", screen: "AMOLED व कर्व्ड ग्लास", battery: "बेस्ट क्वालिटी बैटरी", charging: "सुपर-फास्ट पोर्ट", motherboard: "IC और CPU रीबॉल", slug: "samsung" },
  { brand: "Xiaomi / POCO", screen: "सबसे कम मार्केट रेट", battery: "ज़ीरो-साइकिल बैटरी", charging: "TurboCharge पोर्ट", motherboard: "Poco CPU स्पेशलिस्ट", slug: "xiaomi-redmi" },
  { brand: "Realme", screen: "IPS व AMOLED पैनल", battery: "100% जेनुइन बैकअप", charging: "SuperDart सब-बोर्ड", motherboard: "मदरबोर्ड चिप-लेवल", slug: "realme" },
  { brand: "Vivo", screen: "कर्व्ड व फ्लैट AMOLED", battery: "लिखित वारंटी बैटरी", charging: "FlashCharge पोर्ट", motherboard: "डेड फोन रिकवरी", slug: "vivo" },
  { brand: "OPPO", screen: "Reno & A-Series पैनल", battery: "ओरिजिनल ग्रेड सेल", charging: "SuperVOOC पोर्ट", motherboard: "नेटवर्क व पावर IC", slug: "oppo" },
  { brand: "OnePlus", screen: "ग्रीन लाइन व OLED फिक्स", battery: "फास्ट Warp बैटरी", charging: "Type-C पोर्ट रिपेयर", motherboard: "फ्लैगशिप बोर्ड लैब", slug: "oneplus" },
];

const SERVICE_CLUSTERS = [
  {
    category: "Display, Glass & Biometric Repairs",
    slugs: ["screen-display-replacement", "green-line-display-fix", "fingerprint-face-id-repair"],
    description: "Original AMOLED, OLED, and IPS LCD screens, COF flex laser bonding, and biometric sensor repair.",
  },
  {
    category: "Power, Battery, Charging & Keys",
    slugs: ["battery-replacement", "charging-port-repair", "power-volume-button-repair"],
    description: "Zero-cycle high-density batteries, fast-charge Type-C daughterboards, and tactile switch flexes.",
  },
  {
    category: "Motherboard, IC & Water Damage",
    slugs: ["motherboard-ic-repair", "water-damage-revival", "phone-hanging-performance-fix"],
    description: "45X trinocular BGA reballing, sandwich motherboard CPU rework, PMIC repair, and ultrasonic revival.",
  },
  {
    category: "Camera, Optics & Audio Repairs",
    slugs: ["camera-lens-repair", "speaker-sound-repair", "microphone-repair"],
    description: "Sapphire camera glass, OIS optical camera modules, loudspeakers, earpieces, and MEMS microphones.",
  },
  {
    category: "Software, 5G Signal & Data Recovery",
    slugs: ["software-flashing-unlock", "network-5g-signal-repair", "mobile-data-recovery"],
    description: "Bootloop resolution, EDL stock firmware flashing, baseband 5G IC repair, and dead-phone data recovery.",
  },
  {
    category: "Flagship Back Glass, Phones & Accessories",
    slugs: ["iphone-back-glass-repair", "second-hand-mobile", "mobile-accessories"],
    description: "Precision iPhone laser back glass, 30-point verified pre-owned phones, and genuine fast chargers.",
  },
];

const PRICING_FAQS: [string, string][] = [
  [
    "How do I get a consultation for phone screen repair in Giridih?",
    "At Super Telecom, Giridih, screen replacement consultation is provided based on the specific phone model and panel type (IPS LCD, AMOLED, or OEM Service Pack). Physical bench inspection is always free.",
  ],
  [
    "How does battery replacement consultation work?",
    "We inspect battery health and power draw on the bench. Every replacement battery is high-density brand-tested and backed by store warranty.",
  ],
  [
    "How is the final repair requirement determined?",
    "Repair requirements and options are confirmed after physical bench inspection before work begins — absolutely no hidden charges.",
  ],
  [
    "Do you charge for diagnosis?",
    "No. Diagnosis is completely free at our Barganda Road shop in Giridih, and work proceeds only after your approval.",
  ],
  [
    "Can you replace only the glass if my screen still works?",
    "Yes. If your underlying AMOLED or LCD panel shows clear picture without lines or bleeding and touch works, our OCA vacuum lamination machine can replace just the glass.",
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
          "Mobile Repair Giridih, Phone Screen Repair Giridih, Battery Replacement Giridih, Display Replacement Giridih, Mobile Repair Consultation Giridih, iPhone repair Giridih",
      },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/pricing` },
      { property: "og:site_name", content: "Super Telecom" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/pricing` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: TITLE,
          description: DESC,
          url: `${SITE_URL}/pricing`,
          breadcrumb: {
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: `${SITE_URL}/`,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Repair Services",
                item: `${SITE_URL}/pricing`,
              },
            ],
          },
          mainEntity: {
            "@type": "ItemList",
            name: "Super Telecom Repair Services Directory",
            itemListElement: BRAND_SERVICES.map((item, idx) => ({
              "@type": "ListItem",
              position: idx + 1,
              name: `${item.brand} Repair Services`,
              description: `Screen: ${item.screen}, Battery: ${item.battery}, Charging: ${item.charging}, Motherboard: ${item.motherboard}`,
              url: `${SITE_URL}/brands/${item.slug}`,
            })),
          },
        }),
      },
    ],
  }),
  component: PricingPage,
});

function PricingPage() {
  const allServices = getLegacyCompatibleServices();
  return (
    <div className="min-h-screen w-full max-w-full overflow-x-clip bg-background text-foreground">
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
          <span className="text-foreground">Repair Services</span>
        </nav>

        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-primary" /> Barganda Road, Giridih
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-5xl">
            सबसे कम दाम, सबसे बेस्ट क्वालिटी — Super Telecom Best Price Promise (Giridih)
          </h1>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            सस्ते बजट फ़ोन से लेकर महँगे फ्लैगशिप (iPhone, Samsung Ultra, OnePlus) तक — हर तरह की मोबाइल रिपेयरिंग और स्मार्टफ़ोन डील गिरिडीह के सबसे कम दामों में, 100% जेनुइन क्वालिटी और लिखित वारंटी के साथ।
          </p>
        </div>

        {/* Mandatory Transparency Disclaimer */}
        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-4 text-xs sm:text-sm text-slate-300">
          <AlertCircle className="h-5 w-5 flex-none text-primary mt-0.5" />
          <div>
            <strong className="text-foreground block mb-0.5">100% पारदर्शी और किफ़ायती दाम • मुफ़्त जांच:</strong>
            {REPAIR_PRICE_DISCLAIMER}
          </div>
        </div>

        {/* Quality & Value Comparison Matrix + Instant Best-Price Quote Engine */}
        <div className="mt-10 -mx-4 sm:-mx-6">
          <PricingMatrix />
          <RepairEstimator />
          <BudgetToFlagshipPromise context="pricing" />
        </div>

        {/* Brand vs Repair Type Comparison Table */}
        <section aria-labelledby="brand-prices" className="mt-14">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-primary">Cross-Brand Directory</span>
              <h2 id="brand-prices" className="font-display text-2xl font-bold text-foreground">
                Repair Services by Smartphone Brand
              </h2>
            </div>
            <span className="text-xs text-muted-foreground">Swipe horizontally on mobile to view full table</span>
          </div>

          <div className="mt-5 overflow-x-auto rounded-2xl border border-border/60 bg-card/30">
            <table className="w-full min-w-[700px] text-left text-sm">
              <caption className="sr-only">
                Mobile repair consultation directory in Giridih by brand at Super Telecom
              </caption>
              <thead className="bg-card/70 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th scope="col" className="px-4 py-3.5">Brand</th>
                  <th scope="col" className="px-4 py-3.5">Screen / Display</th>
                  <th scope="col" className="px-4 py-3.5">Battery</th>
                  <th scope="col" className="px-4 py-3.5">Charging Port</th>
                  <th scope="col" className="px-4 py-3.5">Motherboard / IC</th>
                  <th scope="col" className="px-4 py-3.5 text-right">Consultation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {BRAND_SERVICES.map((r) => (
                  <tr key={r.brand} className="transition-colors hover:bg-card/60">
                    <th scope="row" className="px-4 py-3.5 font-semibold text-foreground">
                      <Link to="/brands/$brand" params={{ brand: r.slug }} className="hover:text-primary transition-colors">
                        {r.brand}
                      </Link>
                    </th>
                    <td className="px-4 py-3.5 text-cyan-400 font-mono text-xs">{r.screen}</td>
                    <td className="px-4 py-3.5 text-cyan-400 font-mono text-xs">{r.battery}</td>
                    <td className="px-4 py-3.5 text-cyan-400 font-mono text-xs">{r.charging}</td>
                    <td className="px-4 py-3.5 text-cyan-400 font-mono text-xs">{r.motherboard}</td>
                    <td className="px-4 py-3.5 text-right">
                      <a
                        href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Namaste Super Telecom Giridih! Mujhe ${r.brand} repair ke liye sabse kam rate chahiye.`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-md bg-emerald-600/20 px-2.5 py-1 text-xs font-semibold text-emerald-400 hover:bg-emerald-600/30"
                      >
                        <MessageCircle className="h-3 w-3" /> सबसे कम रेट जानें
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
              Categorized Repair Services &amp; Consultation
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Select any procedure below to read technical symptoms, diagnostic steps, and Giridih workshop turnaround times.
            </p>
          </div>

          <div className="mt-8 space-y-10">
            {SERVICE_CLUSTERS.map((cluster) => {
              const clusterServices = allServices.filter((s) => cluster.slugs.includes(s.slug));
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
                          <span className="font-display font-bold text-cyan-400">सबसे कम दाम • बेस्ट क्वालिटी</span>
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
            Frequently Asked Consultation Questions
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
          <h2 className="font-display text-2xl font-bold text-foreground">Get a Repair Consultation Today</h2>
          <p className="mt-2 text-muted-foreground text-sm">
            Send us your smartphone brand and issue on WhatsApp or call our shop — our bench technician will provide immediate guidance and schedule your inspection.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <RepairConsultationAction buttonSize="lg" layout="row" noteText="Physical inspection on Barganda Road, Giridih" />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
