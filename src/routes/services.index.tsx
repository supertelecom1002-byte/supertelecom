import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, ArrowRight, MapPin } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { SERVICES } from "@/data/services";
import { SITE_URL, STORE_ADDRESS } from "@/data/site";

const TITLE = "Mobile Repair Services in Giridih | Super Telecom";
const DESC = "Explore Super Telecom's mobile repair services in Giridih, including screen, battery, charging port, motherboard, water damage, software and data recovery.";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/services` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/services` }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: TITLE,
        description: DESC,
        url: `${SITE_URL}/services`,
        mainEntity: {
          "@type": "ItemList",
          itemListElement: SERVICES.map((service, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: service.name,
            url: `${SITE_URL}/services/${service.slug}`,
          })),
        },
      }),
    }],
  }),
  component: ServicesIndex,
});

function ServicesIndex() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <BrandLogo size="md" to="/" />
          <Link to="/" hash="contact" className="rounded-full bg-gradient-brand px-4 py-2 text-sm font-semibold text-primary-foreground">Get a quote</Link>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground">Services</span>
        </nav>
        <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground"><MapPin className="h-3.5 w-3.5 text-primary" /> Giridih, Jharkhand</span>
        <h1 className="mt-4 font-display text-3xl font-bold sm:text-5xl">Mobile Repair Services in Giridih</h1>
        <p className="mt-4 max-w-3xl text-lg text-muted-foreground">{DESC} Visit us at {STORE_ADDRESS} for a free diagnosis and transparent quote.</p>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <article key={service.slug} className="rounded-2xl border border-border/60 bg-card/40 p-6 transition-colors hover:border-primary/50">
              <h2 className="font-display text-xl font-bold">{service.h1}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{service.short}</p>
              <div className="mt-4 flex items-center justify-between gap-3 text-xs text-muted-foreground"><span>{service.priceRange}</span><span>{service.duration}</span></div>
              <Link to="/services/$slug" params={{ slug: service.slug }} className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">View service <ArrowRight className="h-4 w-4" /></Link>
            </article>
          ))}
        </div>
      </main>
      <footer className="border-t border-border/50 py-10 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} Super Telecom · {STORE_ADDRESS}</footer>
    </div>
  );
}