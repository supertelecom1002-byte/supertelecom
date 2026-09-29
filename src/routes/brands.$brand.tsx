import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  Phone,
  MessageCircle,
  MapPin,
  ArrowRight,
  Check,
  ChevronRight,
  Clock,
  ShieldCheck,
  Wrench,
  AlertTriangle,
  Cpu,
} from "lucide-react";
import { BRANDS, type BrandInfo } from "@/data/brands";
import { SITE_URL, STORE_STREET_ADDRESS } from "@/data/site";
import { BrandLogo } from "@/components/BrandLogo";
import { SiteFooter } from "@/components/SiteFooter";

const PHONE = "+918002903643";
const PHONE_DISPLAY = "+91 80029 03643";
const WHATSAPP = "918002903643";
const MAPS = "https://maps.app.goo.gl/mu5XXCehEpocaZWY9";
const ADDRESS = "Barganda Road, Near Shivam Clinic, Giridih, Jharkhand 815301";

export const Route = createFileRoute("/brands/$brand")({
  loader: ({ params }) => {
    const brand = BRANDS.find((b) => b.slug === params.brand);
    if (!brand) throw notFound();
    return { brand };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Brand Not Found — Super Telecom Giridih" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const b = loaderData.brand;
    const url = `${SITE_URL}/brands/${params.brand}`;
    return {
      meta: [
        { title: b.title },
        { name: "description", content: b.description },
        { name: "keywords", content: b.keywords },
        { property: "og:title", content: b.title },
        { property: "og:description", content: b.description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:site_name", content: "Super Telecom" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: b.title },
        { name: "twitter:description", content: b.description },
        { name: "geo.region", content: "IN-JH" },
        { name: "geo.placename", content: "Giridih" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            serviceType: `${b.name} Repair`,
            name: b.h1,
            description: b.description,
            provider: {
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
              url: SITE_URL,
            },
            areaServed: { "@type": "City", name: "Giridih" },
            url,
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
              { "@type": "ListItem", position: 2, name: "Brands", item: `${SITE_URL}/brands` },
              { "@type": "ListItem", position: 3, name: `${b.shortName} Repair`, item: url },
            ],
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: b.faqs.map(([q, a]) => ({
              "@type": "Question",
              name: q,
              acceptedAnswer: { "@type": "Answer", text: a },
            })),
          }),
        },
      ],
    };
  },
  component: BrandDetailPage,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center p-4 text-center">
      <div>
        <h1 className="text-3xl font-bold">Brand Not Found</h1>
        <p className="mt-2 text-muted-foreground">The brand you are looking for is not listed.</p>
        <Link
          to="/brands"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
        >
          View all supported brands
        </Link>
      </div>
    </div>
  ),
});

function BrandDetailPage() {
  const { brand } = Route.useLoaderData() as { brand: BrandInfo };
  const otherBrands = BRANDS.filter((b) => b.slug !== brand.slug);

  const whatsappMessage = encodeURIComponent(
    `Hello Super Telecom Giridih, I need a repair quote for my ${brand.name} smartphone.`
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Background glow effects */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-primary/20 blur-[140px]" />
        <div className="absolute bottom-0 -left-40 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <BrandLogo size="md" to="/" />
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={`tel:${PHONE}`}
              aria-label={`Call Super Telecom for ${brand.name} repair`}
              className="inline-flex items-center gap-2 rounded-lg border border-border/60 px-3 py-2 text-xs sm:text-sm font-semibold hover:bg-accent"
            >
              <Phone className="h-4 w-4 text-primary" />
              <span className="hidden sm:inline">{PHONE_DISPLAY}</span>
            </a>
            <a
              href={`https://wa.me/${WHATSAPP}?text=${whatsappMessage}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-emerald-500"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">WhatsApp Quote</span>
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link to="/brands" className="hover:text-foreground">Brands</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground">{brand.name}</span>
        </nav>

        {/* Hero Section */}
        <section className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-primary" /> Barganda Road, Giridih
            </span>
            <h1 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              {brand.h1}
            </h1>
            <p className="mt-4 text-base text-muted-foreground sm:text-lg">
              {brand.tagline}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={`tel:${PHONE}`}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-5 py-3 text-sm font-semibold text-primary-foreground shadow-brand"
              >
                <Phone className="h-4 w-4" /> Call {PHONE_DISPLAY}
              </a>
              <a
                href={`https://wa.me/${WHATSAPP}?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-semibold hover:bg-accent"
              >
                <MessageCircle className="h-4 w-4 text-emerald-400" /> WhatsApp for Direct Quote
              </a>
            </div>

            <div className="mt-6 flex flex-wrap gap-4 text-xs sm:text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-primary" /> Rapid 30–60 Min Turnaround
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-primary" /> Verified OEM-Grade Parts
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Wrench className="h-4 w-4 text-primary" /> Free Bench Diagnostics
              </span>
            </div>
          </div>

          <aside className="lg:col-span-2">
            <div className="rounded-2xl border border-border/60 bg-card/60 p-6 shadow-elegant">
              <div className="text-sm font-semibold text-foreground">Super Telecom Workshop Location</div>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground">{ADDRESS}</p>
              <p className="mt-1 font-mono text-xs text-primary">Open Daily: 10:00 AM – 9:30 PM</p>
              <div className="mt-4 border-t border-border/50 pt-3 text-xs text-muted-foreground">
                <p>Same-day bench testing &amp; written estimate before any procedure begins.</p>
              </div>
              <a
                href={MAPS}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-xs font-semibold hover:bg-accent"
              >
                <MapPin className="h-4 w-4 text-primary" /> Open in Google Maps
              </a>
            </div>
          </aside>
        </section>

        {/* Brand Overview */}
        <section className="mt-12 rounded-3xl border border-border/60 bg-card/40 p-6 sm:p-8">
          <h2 className="font-display text-2xl font-bold text-foreground">
            About Our {brand.name} Repair Capabilities in Giridih
          </h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
            {brand.overview.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </section>

        {/* Common Brand Faults & Bench Procedures */}
        <section className="mt-14">
          <div className="max-w-2xl">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">
              Diagnostic &amp; Engineering Focus
            </span>
            <h2 className="mt-1 font-display text-2xl font-bold sm:text-3xl text-foreground">
              Common {brand.shortName} Hardware Faults We Resolve
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              We diagnose beyond surface symptoms to resolve the root electrical and mechanical failures.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {brand.commonFaults.map((f) => (
              <div
                key={f.fault}
                className="flex flex-col justify-between rounded-2xl border border-border/60 bg-card/40 p-5 transition hover:border-primary/40"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-primary font-mono">
                    <span className="inline-flex items-center gap-1 font-semibold">
                      <Cpu className="h-3.5 w-3.5" /> Bench Fix
                    </span>
                    <span>{f.turnaround}</span>
                  </div>
                  <h3 className="mt-3 font-display text-base font-semibold text-foreground">
                    {f.fault}
                  </h3>
                  <div className="mt-2 text-xs text-muted-foreground">
                    <strong className="text-foreground">Symptom:</strong> {f.symptom}
                  </div>
                  <div className="mt-3 rounded-lg bg-background/50 p-2.5 text-xs text-muted-foreground border border-border/30">
                    <strong className="text-primary block mb-0.5">Laboratory Procedure:</strong>
                    {f.benchProcedure}
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-border/40 text-right">
                  <a
                    href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hi Super Telecom, my ${brand.name} has this fault: ${f.fault}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                  >
                    Enquire on WhatsApp <ArrowRight className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Supported Repairs & Pricing */}
        <section className="mt-16">
          <div className="max-w-2xl">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">
              Service Matrix
            </span>
            <h2 className="mt-1 font-display text-2xl font-bold sm:text-3xl text-foreground">
              {brand.name} Repair Services &amp; Working Estimates
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Transparent rates for our Giridih bench services. Free physical diagnosis before commitment.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {brand.supportedRepairs.map((rep) => (
              <div
                key={rep.title}
                className="flex flex-col justify-between rounded-2xl border border-border/60 bg-card/40 p-5 hover:border-primary/50 transition-colors"
              >
                <div>
                  <h3 className="font-display text-base font-semibold text-foreground">
                    {rep.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {rep.summary}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center justify-between text-xs">
                    <span className="font-display text-lg font-bold text-gradient">
                      {rep.priceRange}
                    </span>
                    <span className="font-mono text-muted-foreground">{rep.turnaround}</span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-border/40 flex items-center justify-between text-xs">
                  <Link
                    to="/services/$slug"
                    params={{ slug: rep.serviceSlug }}
                    className="font-medium text-muted-foreground hover:text-primary inline-flex items-center gap-1"
                  >
                    Service details <ArrowRight className="h-3 w-3" />
                  </Link>
                  <a
                    href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hi Super Telecom, what is the exact price for ${rep.title} for ${brand.name}?`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-primary hover:underline"
                  >
                    Get Exact Quote
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Popular Models Serviced */}
        <section className="mt-16 rounded-3xl border border-border/60 bg-card/40 p-6 sm:p-8">
          <h2 className="font-display text-xl font-bold text-foreground sm:text-2xl">
            Popular {brand.shortName} Models Serviced Daily in Giridih
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            We maintain direct inventory for all current and previous generation {brand.shortName} models:
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {brand.popularModels.map((model) => (
              <span
                key={model}
                className="rounded-full border border-border/60 bg-card/60 px-3.5 py-1.5 text-xs font-medium text-foreground"
              >
                {model}
              </span>
            ))}
          </div>
        </section>

        {/* Frequently Asked Questions */}
        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
            Frequently Asked Questions — {brand.shortName} Repair Giridih
          </h2>
          <div className="mt-6 space-y-3">
            {brand.faqs.map(([q, a]) => (
              <details
                key={q}
                className="group rounded-2xl border border-border/60 bg-card/40 p-5 transition-colors open:bg-card/70"
              >
                <summary className="cursor-pointer font-semibold text-sm sm:text-base text-foreground list-none flex items-center justify-between">
                  <span>{q}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-90" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Trademark & Independence Disclaimer */}
        <section className="mt-14 rounded-2xl border border-border/40 bg-card/20 p-5 text-xs text-muted-foreground">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="h-4 w-4 flex-none text-muted-foreground mt-0.5" />
            <p className="leading-relaxed">
              <strong>Trademark &amp; Authorization Notice:</strong> {brand.disclaimer}
            </p>
          </div>
        </section>

        {/* Cross Brand Linking */}
        <section className="mt-14 border-t border-border/50 pt-10">
          <h2 className="font-display text-lg font-bold text-foreground">
            Explore Other Smartphone Brand Services in Giridih
          </h2>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {otherBrands.map((b) => (
              <Link
                key={b.slug}
                to="/brands/$brand"
                params={{ brand: b.slug }}
                className="rounded-xl border border-border/60 bg-card/40 px-3.5 py-2 text-xs font-medium text-foreground hover:border-primary/60 hover:text-primary transition-colors"
              >
                {b.name} Repair
              </Link>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
