import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Cookie } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import logoAsset from "@/assets/super-telecom-logo.png.asset.json";
import { SITE_URL, STORE_ADDRESS } from "@/data/site";

const TITLE = "Cookie Policy — Super Telecom Giridih";
const DESC = "Learn how Super Telecom uses cookies and similar technologies on our Giridih mobile repair website.";

export const Route = createFileRoute("/cookie-policy")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/cookie-policy` }],
  }),
  component: CookiePolicyPage,
});

function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <BrandLogo size="md" to="/" />
          <Link
            to="/"
            className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:py-14">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground">Cookie Policy</span>
        </nav>

        <div className="mb-8 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10">
            <Cookie className="h-6 w-6 text-primary" />
          </div>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">Cookie Policy</h1>
        </div>

        <section className="prose prose-invert max-w-none">
          <p className="lead text-muted-foreground">
            This Cookie Policy explains how Super Telecom (“we”, “us”, or “our”) uses cookies and similar technologies on our website at <a href={SITE_URL} className="text-primary hover:underline">{SITE_URL}</a>. It applies to visitors from Giridih, Jharkhand, India and all other locations.
          </p>

          <h2 className="font-display text-xl font-bold mt-8 mb-3">1. What are cookies?</h2>
          <p className="text-muted-foreground">
            Cookies are small text files stored on your device when you visit a website. They help the site remember your preferences, improve performance, and understand how visitors use the site. We also use similar storage technologies such as localStorage and sessionStorage.
          </p>

          <h2 className="font-display text-xl font-bold mt-8 mb-3">2. Types of cookies we use</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li><strong className="text-foreground">Strictly necessary cookies:</strong> Required for the website to function correctly, including theme preference (dark/light mode) and cookie consent state.</li>
            <li><strong className="text-foreground">Analytics cookies:</strong> We may use Google Search Console and analytics tools to understand traffic, page performance, and how customers find our mobile repair services in Giridih.</li>
            <li><strong className="text-foreground">Functional cookies:</strong> Our AI chat widget and WhatsApp buttons use identifiers to keep chat sessions consistent and to provide repair status lookups.</li>
          </ul>

          <h2 className="font-display text-xl font-bold mt-8 mb-3">3. Third-party services</h2>
          <p className="text-muted-foreground">
            We use trusted third-party services that may set their own cookies or store data on your device:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>Google Search Console & Google Maps (location and verification services)</li>
            <li>Katrix AI chat widget</li>
            <li>WhatsApp messaging buttons</li>
          </ul>

          <h2 className="font-display text-xl font-bold mt-8 mb-3">4. Managing your preferences</h2>
          <p className="text-muted-foreground">
            Most web browsers allow you to control cookies through their settings. You can choose to block or delete cookies, but this may affect how our website looks or functions (for example, your dark/light mode preference may not be saved).
          </p>

          <h2 className="font-display text-xl font-bold mt-8 mb-3">5. Updates to this policy</h2>
          <p className="text-muted-foreground">
            We may update this Cookie Policy from time to time to reflect changes in technology, law, or our services. The “Last updated” date at the bottom of this page shows when the policy was last revised.
          </p>

          <h2 className="font-display text-xl font-bold mt-8 mb-3">6. Contact us</h2>
          <p className="text-muted-foreground">
            If you have any questions about this Cookie Policy, please contact us:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li>Email: <a href="mailto:supertelecom1002@gmail.com" className="text-primary hover:underline">supertelecom1002@gmail.com</a></li>
            <li>Phone: <a href="tel:+918002903643" className="text-primary hover:underline">+91 80029 03643</a></li>
            <li>Address: Super Telecom, {STORE_ADDRESS}</li>
          </ul>

          <p className="mt-10 text-sm text-muted-foreground">Last updated: August 2026</p>
        </section>
      </main>

      <footer className="border-t border-border/50 py-10 text-center text-xs text-muted-foreground">
        <div className="mx-auto max-w-7xl px-4">
          © {new Date().getFullYear()} Super Telecom · {STORE_ADDRESS} ·{" "}
          <Link to="/cookie-policy" className="text-primary hover:underline">Cookie Policy</Link>
        </div>
      </footer>
    </div>
  );
}
