import { createFileRoute, Link } from "@tanstack/react-router";
import { SERVICES } from "@/data/services";
import { POSTS } from "@/data/blog";
import { SITE_URL } from "@/data/site";
import { ChevronRight } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import logoAsset from "@/assets/super-telecom-logo.png.asset.json";

const TITLE = "Sitemap — Super Telecom Giridih";
const DESC = "HTML sitemap for Super Telecom — every mobile repair service page, blog article and section on our Giridih website.";

export const Route = createFileRoute("/sitemap")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/sitemap` }],
  }),
  component: SitemapPage,
});

function SitemapPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <BrandLogo size="md" to="/" />
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:py-14">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground">Sitemap</span>
        </nav>
        <h1 className="font-display text-3xl font-bold sm:text-5xl">Sitemap</h1>
        <p className="mt-3 text-muted-foreground">Every page on the Super Telecom Giridih website.</p>

        <section className="mt-10">
          <h2 className="font-display text-xl font-bold">Main</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            <li><Link to="/" className="text-primary hover:underline">Home</Link></li>
            <li><Link to="/pricing" className="text-primary hover:underline">Mobile Repair Prices in Giridih</Link></li>
            <li><Link to="/services" className="text-primary hover:underline">Mobile Repair Services in Giridih</Link></li>
            <li><Link to="/blog" className="text-primary hover:underline">Blog</Link></li>
            <li><Link to="/sitemap" className="text-primary hover:underline">Sitemap</Link></li>
            <li><Link to="/cookie-policy" className="text-primary hover:underline">Cookie Policy</Link></li>
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-xl font-bold">Services in Giridih</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link to="/services/$slug" params={{ slug: s.slug }} className="text-primary hover:underline">{s.name}</Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-xl font-bold">Blog articles</h2>
          <ul className="mt-3 space-y-2">
            {POSTS.map((p) => (
              <li key={p.slug}>
                <Link to="/blog/$slug" params={{ slug: p.slug }} className="text-primary hover:underline">{p.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <footer className="border-t border-border/50 py-10 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Super Telecom · Barganda Road, Giridih, Jharkhand
      </footer>
    </div>
  );
}
