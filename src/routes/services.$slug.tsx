import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Phone, MessageCircle, MapPin, ArrowRight, Check, ChevronRight, Star, Clock, Shield, Wrench } from "lucide-react";
import { SERVICES, type ServiceInfo } from "@/data/services";
import { SITE_URL, STORE_STREET_ADDRESS } from "@/data/site";
import { BrandLogo } from "@/components/BrandLogo";
import { ServiceAnswerBlock } from "@/components/ServiceAnswerBlock";
import logoAsset from "@/assets/super-telecom-logo.png.asset.json";

const PHONE = "+918002903643";
const PHONE_DISPLAY = "+91 80029 03643";
const WHATSAPP = "918002903643";
const MAPS = "https://maps.app.goo.gl/mu5XXCehEpocaZWY9";
const ADDRESS = "Barganda Road, Near Shivam Clinic, Giridih, Jharkhand 815301";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const service = SERVICES.find((s) => s.slug === params.slug);
    if (!service) throw notFound();
    return { service };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return { meta: [{ title: "Service not found — Super Telecom" }, { name: "robots", content: "noindex" }] };
    }
    const s = loaderData.service;
    const url = `${SITE_URL}/services/${params.slug}`;
    return {
      meta: [
        { title: s.title },
        { name: "description", content: s.description },
        { name: "keywords", content: s.keywords },
        { property: "og:title", content: s.title },
        { property: "og:description", content: s.description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:site_name", content: "Super Telecom" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: s.title },
        { name: "twitter:description", content: s.description },
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
            serviceType: s.name,
            name: s.h1,
            description: s.description,
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
            offers: { "@type": "Offer", priceCurrency: "INR", priceRange: s.priceRange, url },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" },
              { "@type": "ListItem", position: 2, name: "Services", item: `${SITE_URL}/services` },
              { "@type": "ListItem", position: 3, name: s.name, item: url },

            ],
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: s.faqs.map(([q, a]) => ({
              "@type": "Question",
              name: q,
              acceptedAnswer: { "@type": "Answer", text: a },
            })),
          }),
        },
      ],
    };
  },
  component: ServicePage,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Service not found</h1>
        <p className="mt-2 text-muted-foreground">The service you're looking for doesn't exist.</p>
        <Link to="/" className="mt-6 inline-flex items-center gap-2 rounded-md bg-gradient-brand px-5 py-2.5 text-sm font-medium text-primary-foreground">
          Go home
        </Link>
      </div>
    </div>
  ),
  errorComponent: ({ error, reset }) => (
    <div className="flex min-h-screen items-center justify-center p-4 text-center">
      <div>
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button onClick={reset} className="mt-6 rounded-md bg-gradient-brand px-5 py-2.5 text-sm font-medium text-primary-foreground">Try again</button>
      </div>
    </div>
  ),
});

function ServicePage() {
  const { service } = Route.useLoaderData() as { service: ServiceInfo };
  const others = SERVICES.filter((s) => s.slug !== service.slug).slice(0, 6);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-primary/20 blur-[140px]" />
        <div className="absolute bottom-0 -left-40 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <BrandLogo size="md" to="/" />
          <div className="flex items-center gap-2">
            <a href={`tel:${PHONE}`} aria-label="Call Super Telecom Giridih" className="inline-flex items-center gap-2 rounded-md border border-border/60 px-3 py-2 text-sm hover:bg-accent">
              <Phone className="h-4 w-4" /> <span className="hidden sm:inline">Call</span>
            </a>
            <a href={`https://wa.me/${WHATSAPP}`} className="inline-flex items-center gap-2 rounded-md bg-gradient-brand px-3 py-2 text-sm font-medium text-primary-foreground">
              <MessageCircle className="h-4 w-4" /> <span className="hidden sm:inline">WhatsApp</span>
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span>Services</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground">{service.name}</span>
        </nav>

        {/* Hero */}
        <section className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-primary" /> Giridih, Jharkhand
            </span>
            <h1 className="mt-4 font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              {service.h1}
            </h1>
            <p className="mt-4 text-base text-muted-foreground sm:text-lg">{service.intro}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a href={`tel:${PHONE}`} className="inline-flex items-center gap-2 rounded-md bg-gradient-brand px-5 py-3 text-sm font-semibold text-primary-foreground shadow-brand">
                <Phone className="h-4 w-4" /> Call {PHONE_DISPLAY}
              </a>
              <a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hi Super Telecom, I need help with ${service.name} in Giridih.`)}`} className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-3 text-sm font-semibold hover:bg-accent">
                <MessageCircle className="h-4 w-4" /> WhatsApp for quote
              </a>
            </div>

            <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4 text-primary" /> {service.duration}</span>
              <span className="inline-flex items-center gap-1.5"><Shield className="h-4 w-4 text-primary" /> Warranty backed</span>
              <span className="inline-flex items-center gap-1.5"><Star className="h-4 w-4 text-primary" /> 5.0★ rated in Giridih</span>
            </div>
          </div>

          <aside className="lg:col-span-2">
            <div className="rounded-2xl border border-border/60 bg-card/60 p-6 shadow-elegant">
              <div className="text-sm font-semibold">Visit Super Telecom</div>
              <p className="mt-2 text-sm text-muted-foreground">{ADDRESS}</p>
              <p className="mt-1 text-sm text-muted-foreground">Mon–Sun · 9 AM – 9 PM</p>
              <div className="mt-4 text-sm">
                <div className="text-muted-foreground">Estimated price</div>
                <div className="font-display text-2xl font-bold text-gradient">{service.priceRange}</div>
              </div>
              <a href={MAPS} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm hover:bg-accent">
                <MapPin className="h-4 w-4" /> Get directions
              </a>
            </div>
          </aside>
        </section>

        {/* Reusable Direct Answer Box for AI Citation & High Intent Conversion */}
        <ServiceAnswerBlock
          question={`Need ${service.name.toLowerCase()} in Giridih?`}
          answer={service.intro}
          symptoms={service.benefits.slice(0, 4)}
          turnaround={`${service.duration} · Estimated ${service.priceRange}`}
        />

        {/* Benefits */}
        <section className="mt-14">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Why choose Super Telecom for {service.name.toLowerCase()} in Giridih</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {service.benefits.map((b) => (
              <li key={b} className="flex items-start gap-3 rounded-xl border border-border/60 bg-card/40 p-4">
                <Check className="mt-0.5 h-5 w-5 flex-none text-primary" />
                <span className="text-sm">{b}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Process */}
        <section className="mt-14">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">How our {service.name.toLowerCase()} process works</h2>
          <ol className="mt-6 space-y-3">
            {service.process.map((step, i) => (
              <li key={step} className="flex items-start gap-3 rounded-xl border border-border/60 bg-card/40 p-4">
                <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-gradient-brand text-xs font-bold text-primary-foreground">{i + 1}</span>
                <span className="text-sm">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Brands */}
        <section className="mt-14">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Brands & models we service</h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {service.brands.map((b) => (
              <span key={b} className="rounded-full border border-border/60 bg-card/60 px-4 py-2 text-sm">{b}</span>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-14">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">FAQs — {service.name} in Giridih</h2>
          <div className="mt-6 space-y-3">
            {service.faqs.map(([q, a]) => (
              <details key={q} className="rounded-xl border border-border/60 bg-card/40 p-4">
                <summary className="cursor-pointer font-semibold">{q}</summary>
                <p className="mt-2 text-sm text-muted-foreground">{a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Related services (internal linking) */}
        <section className="mt-14">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Other services in Giridih</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((o) => (
              <Link
                key={o.slug}
                to="/services/$slug"
                params={{ slug: o.slug }}
                className="group flex items-start gap-3 rounded-xl border border-border/60 bg-card/40 p-4 hover:border-primary/50 hover:bg-card/70"
              >
                <Wrench className="mt-0.5 h-5 w-5 flex-none text-primary" />
                <div>
                  <div className="font-semibold group-hover:text-primary">{o.name}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{o.short}</div>
                </div>
                <ArrowRight className="ml-auto h-4 w-4 flex-none opacity-0 transition group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </section>

        {/* Reviews */}
        <section className="mt-14">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">What Giridih customers say</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { n: "Rahul K.", t: "Screen replaced in 40 minutes and looks brand new. Best mobile repair shop in Giridih — honest pricing.", r: 5 },
              { n: "Priya S.", t: "Water-damaged phone revived by Super Telecom when two other shops gave up. Fully recommend.", r: 5 },
              { n: "Anwar A.", t: "Bought a refurbished iPhone here with warranty. Perfect condition, and free tempered-glass fitting.", r: 5 },
            ].map((r) => (
              <div key={r.n} className="rounded-xl border border-border/60 bg-card/40 p-5">
                <div className="flex gap-0.5 text-primary">{Array.from({ length: r.r }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}</div>
                <p className="mt-3 text-sm text-muted-foreground">"{r.t}"</p>
                <div className="mt-3 text-sm font-semibold">{r.n} · Giridih</div>
              </div>
            ))}
          </div>
        </section>

        {/* Map */}
        <section className="mt-14">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Find our Giridih store</h2>
          <p className="mt-2 text-sm text-muted-foreground">{ADDRESS}</p>
          <div className="mt-6 overflow-hidden rounded-2xl border border-border/60">
            <iframe
              title="Super Telecom Giridih location on Google Maps"
              src="https://www.google.com/maps?q=Barganda+Road+Giridih+Jharkhand&output=embed"
              className="h-[320px] w-full sm:h-[420px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>

        {/* CTA */}
        <section className="mt-14 rounded-2xl border border-border/60 bg-card/60 p-8 text-center shadow-elegant">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Need {service.name.toLowerCase()} in Giridih today?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Walk in to our Barganda Road store, or send us a message on WhatsApp for a free quote.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a href={`tel:${PHONE}`} className="inline-flex items-center gap-2 rounded-md bg-gradient-brand px-5 py-3 text-sm font-semibold text-primary-foreground">
              <Phone className="h-4 w-4" /> Call now
            </a>
            <a href={`https://wa.me/${WHATSAPP}`} className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-3 text-sm font-semibold hover:bg-accent">
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
            <Link to="/" className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-3 text-sm font-semibold hover:bg-accent">
              Back to home
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/50 py-10">
        <div className="mx-auto max-w-7xl px-4 text-center text-xs text-muted-foreground sm:px-6">
          © {new Date().getFullYear()} Super Telecom · Mobile Repair Shop in Giridih, Jharkhand · {PHONE_DISPLAY}
        </div>
      </footer>
    </div>
  );
}
