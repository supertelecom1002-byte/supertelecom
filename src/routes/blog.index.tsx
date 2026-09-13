import { createFileRoute, Link } from "@tanstack/react-router";
import { POSTS } from "@/data/blog";
import { SITE_URL } from "@/data/site";
import { ChevronRight, ArrowRight } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import logoAsset from "@/assets/super-telecom-logo.png.asset.json";

const TITLE = "Mobile Repair Blog — Super Telecom Giridih";
const DESC = "Guides, price lists and repair tips from Super Telecom — Giridih's trusted mobile repair shop. iPhone, Android, screen, battery, charging and more.";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/blog` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/blog` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "Super Telecom Blog",
          url: `${SITE_URL}/blog`,
          publisher: { "@type": "Organization", name: "Super Telecom" },
          blogPost: POSTS.map((p) => ({
            "@type": "BlogPosting",
            headline: p.title,
            url: `${SITE_URL}/blog/${p.slug}`,
            datePublished: p.date,
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
            { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
          ],
        }),
      },
    ],
  }),
  component: BlogIndex,
});

function BlogIndex() {
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
          <span className="text-foreground">Blog</span>
        </nav>
        <h1 className="font-display text-3xl font-bold sm:text-5xl">Mobile Repair Blog — Giridih</h1>
        <p className="mt-3 text-muted-foreground">Guides, price lists and repair tips from Super Telecom, Barganda Road, Giridih.</p>
        <div className="mt-10 space-y-6">
          {POSTS.map((p) => (
            <article key={p.slug} className="rounded-2xl border border-border/60 bg-card/40 p-6 hover:border-primary/50">
              <time dateTime={p.date} className="text-xs uppercase tracking-wider text-muted-foreground">{new Date(p.date).toDateString()}</time>
              <h2 className="mt-2 font-display text-xl font-bold sm:text-2xl">
                <Link to="/blog/$slug" params={{ slug: p.slug }} className="hover:text-primary">{p.title}</Link>
              </h2>
              <p className="mt-2 text-muted-foreground">{p.excerpt}</p>
              <Link to="/blog/$slug" params={{ slug: p.slug }} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                Read article <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </main>
      <footer className="border-t border-border/50 py-10 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Super Telecom · Mobile Repair Shop in Giridih, Jharkhand
      </footer>
    </div>
  );
}
