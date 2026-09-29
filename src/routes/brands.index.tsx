import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, ArrowRight, MapPin, Phone, MessageCircle, ShieldCheck, Wrench, Clock } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { SiteFooter } from "@/components/SiteFooter";
import { BRANDS } from "@/data/brands";
import { SITE_URL, STORE_ADDRESS } from "@/data/site";

const TITLE = "Smartphone Brands We Repair in Giridih | Super Telecom";
const DESC = "Dedicated mobile repair hubs for Apple iPhone, Samsung Galaxy, Xiaomi Redmi, Realme, Vivo, OPPO, and OnePlus in Giridih. Free diagnosis, OEM parts, and warranty.";
const PHONE = "+918002903643";
const PHONE_DISPLAY = "+91 80029 03643";
const WHATSAPP = "918002903643";

export const Route = createFileRoute("/brands/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/brands` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "geo.region", content: "IN-JH" },
      { name: "geo.placename", content: "Giridih" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/brands` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: TITLE,
          description: DESC,
          url: `${SITE_URL}/brands`,
          mainEntity: {
            "@type": "ItemList",
            itemListElement: BRANDS.map((b, idx) => ({
              "@type": "ListItem",
              position: idx + 1,
              name: `${b.name} Repair Giridih`,
              url: `${SITE_URL}/brands/${b.slug}`,
            })),
          },
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
          ],
        }),
      },
    ],
  }),
  component: BrandsIndexPage,
});

function BrandsIndexPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <BrandLogo size="md" to="/" />
          <div className="flex items-center gap-3">
            <a
              href={`tel:${PHONE}`}
              className="inline-flex items-center gap-2 rounded-lg border border-border/60 px-3 py-2 text-xs font-semibold hover:bg-accent"
            >
              <Phone className="h-3.5 w-3.5 text-primary" /> {PHONE_DISPLAY}
            </a>
            <a
              href={`https://wa.me/${WHATSAPP}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-500"
            >
              <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground">Brands</span>
        </nav>

        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-primary" /> Barganda Road, Giridih
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Smartphone Brands We Service in Giridih
          </h1>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Super Telecom operates a specialized bench repair laboratory handling screen replacements, battery renewals, and board-level micro-soldering for all leading Android and iOS smartphone manufacturers.
          </p>
        </div>

        {/* Brand Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BRANDS.map((brand) => (
            <div
              key={brand.slug}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/60 bg-card/40 p-6 transition-all hover:border-primary/50 hover:bg-card/70 hover:shadow-glow"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-display text-xl font-bold text-foreground group-hover:text-primary">
                    {brand.name}
                  </span>
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 font-mono text-[11px] font-semibold text-primary">
                    Giridih Lab
                  </span>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  {brand.tagline}
                </p>

                <div className="mt-5 border-t border-border/40 pt-4">
                  <div className="text-xs font-semibold text-foreground">Common Bench Solutions:</div>
                  <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
                    {brand.commonFaults.slice(0, 3).map((f) => (
                      <li key={f.fault} className="flex items-start gap-1.5">
                        <Wrench className="mt-0.5 h-3 w-3 flex-none text-primary" />
                        <span className="line-clamp-1">{f.fault}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between">
                <Link
                  to="/brands/$brand"
                  params={{ brand: brand.slug }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                >
                  View {brand.shortName} Repair Hub <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <span className="text-[11px] text-muted-foreground">Free Diagnosis</span>
              </div>
            </div>
          ))}
        </div>

        {/* Workshop Trust Banner */}
        <section className="mt-16 rounded-3xl border border-border/60 bg-card/40 p-8">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-6 w-6 flex-none text-primary" />
              <div>
                <h2 className="font-semibold text-sm text-foreground">Verified OEM-Grade Components</h2>
                <p className="mt-1 text-xs text-muted-foreground">Every display, battery, and charging daughterboard is bench-tested before handover.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="h-6 w-6 flex-none text-primary" />
              <div>
                <h2 className="font-semibold text-sm text-foreground">Rapid 30-Minute Turnaround</h2>
                <p className="mt-1 text-xs text-muted-foreground">Most routine screen swaps and battery replacements are performed same-day on our bench.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-6 w-6 flex-none text-primary" />
              <div>
                <h2 className="font-semibold text-sm text-foreground">Central Giridih Location</h2>
                <p className="mt-1 text-xs text-muted-foreground">Conveniently located on Barganda Road, Near Shivam Clinic. Walk-ins welcome daily 10:00 AM – 9:30 PM.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
