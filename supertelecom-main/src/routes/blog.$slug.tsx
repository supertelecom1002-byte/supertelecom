import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { POSTS } from "@/data/blog";
import { SITE_URL } from "@/data/site";
import { ChevronRight, Phone, MessageCircle } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import logoAsset from "@/assets/super-telecom-logo.png.asset.json";

const PHONE = "+918002903643";
const WHATSAPP = "918002903643";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = POSTS.find((p) => p.slug === params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Post not found — Super Telecom" }, { name: "robots", content: "noindex" }] };
    const p = loaderData.post;
    const url = `${SITE_URL}/blog/${params.slug}`;
    return {
      meta: [
        { title: p.title },
        { name: "description", content: p.description },
        { name: "keywords", content: p.keywords },
        { property: "og:title", content: p.title },
        { property: "og:description", content: p.description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: p.title },
        { name: "twitter:description", content: p.description },
        { name: "twitter:image", content: `${SITE_URL}/favicon.png` },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: p.title,
            description: p.description,
            datePublished: p.date,
            dateModified: p.date,
            author: { "@type": "Organization", name: "Super Telecom" },
            publisher: { "@type": "Organization", name: "Super Telecom", logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.png` } },
            mainEntityOfPage: url,
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
              { "@type": "ListItem", position: 3, name: p.title, item: url },
            ],
          }),
        },
      ],
    };
  },
  component: BlogPost,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center p-4 text-center">
      <div>
        <h1 className="text-2xl font-bold">Post not found</h1>
        <Link to="/blog" className="mt-6 inline-flex rounded-md bg-gradient-brand px-5 py-2.5 text-sm font-medium text-primary-foreground">Back to blog</Link>
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

function BlogPost() {
  const { post } = Route.useLoaderData();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <BrandLogo size="md" to="/" />
          <div className="flex items-center gap-2">
            <a href={`tel:${PHONE}`} className="inline-flex items-center gap-2 rounded-md border border-border/60 px-3 py-2 text-sm hover:bg-accent"><Phone className="h-4 w-4" /><span className="hidden sm:inline">Call</span></a>
            <a href={`https://wa.me/${WHATSAPP}`} className="inline-flex items-center gap-2 rounded-md bg-gradient-brand px-3 py-2 text-sm font-medium text-primary-foreground"><MessageCircle className="h-4 w-4" /><span className="hidden sm:inline">WhatsApp</span></a>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:py-14">
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link to="/blog" className="hover:text-foreground">Blog</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground line-clamp-1">{post.title}</span>
        </nav>
        <time dateTime={post.date} className="text-xs uppercase tracking-wider text-muted-foreground">{new Date(post.date).toDateString()}</time>
        <h1 className="mt-2 font-display text-3xl font-bold leading-tight sm:text-5xl">{post.title}</h1>
        <article
          className="prose prose-invert mt-8 max-w-none prose-headings:font-display prose-h2:mt-8 prose-h2:text-2xl prose-a:text-primary"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
        <div className="mt-12 rounded-2xl border border-border/60 bg-card/60 p-6 text-center">
          <div className="font-display text-xl font-bold">Need a repair in Giridih?</div>
          <p className="mt-2 text-sm text-muted-foreground">Barganda Road, Near Shivam Clinic — Mon–Sun, 9 AM – 9 PM.</p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <a href={`tel:${PHONE}`} className="inline-flex items-center gap-2 rounded-md bg-gradient-brand px-5 py-3 text-sm font-semibold text-primary-foreground"><Phone className="h-4 w-4" /> Call now</a>
            <a href={`https://wa.me/${WHATSAPP}`} className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-3 text-sm font-semibold hover:bg-accent"><MessageCircle className="h-4 w-4" /> WhatsApp</a>
          </div>
        </div>
      </main>
      <footer className="border-t border-border/50 py-10 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Super Telecom · Mobile Repair Shop in Giridih, Jharkhand
      </footer>
    </div>
  );
}
