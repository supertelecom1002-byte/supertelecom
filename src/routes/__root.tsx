import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SITE_URL, STORE_STREET_ADDRESS } from "@/data/site";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-gradient">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-gradient-brand px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="inline-flex items-center justify-center rounded-md bg-gradient-brand px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Try again
          </button>
          <a href="/" className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

const SITE_TITLE = "Super Telecom | Mobile Repair Shop in Giridih, Jharkhand";
const SITE_DESC = "Trusted mobile repair shop on Barganda Road, Giridih, Jharkhand. Same-day screen replacement, battery replacement, motherboard chip-level repair, and quality mobile accessories.";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "google-site-verification", content: "l1EAStfsD16e2zvMmw3t88DhWnxcSgdPtPBms5L0bus" },
      { name: "google-site-verification", content: "jIBP6ThFnLXcw6dMR7Q4JRbuLJIVjHsquFt4DxgLVxk" },
      { title: SITE_TITLE },
      { name: "description", content: SITE_DESC },
      { name: "author", content: "Super Telecom" },
      { name: "keywords", content: "Mobile Repair in Giridih, Phone Repair Shop Giridih, iPhone Repair Giridih, Screen Replacement Giridih, Battery Replacement Giridih, Motherboard Repair Giridih, Super Telecom Giridih" },
      { name: "geo.region", content: "IN-JH" },
      { name: "geo.placename", content: "Giridih, Jharkhand" },
      { name: "geo.position", content: "24.1843;86.3075" },
      { name: "ICBM", content: "24.1843, 86.3075" },
      { property: "og:title", content: "Super Telecom | Mobile Repair Shop in Giridih, Jharkhand" },
      { property: "og:description", content: "Trusted mobile repair shop on Barganda Road, Giridih, Jharkhand. Same-day screen replacement, battery replacement, motherboard chip-level repair, and quality mobile accessories." },
      { property: "og:type", content: "business.business" },
      { property: "og:url", content: `${SITE_URL}` },
      { property: "og:image", content: `${SITE_URL}/og-image.png` },
      { property: "og:site_name", content: "Super Telecom" },
      { property: "og:locale", content: "en_IN" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: SITE_TITLE },
      { name: "twitter:description", content: SITE_DESC },
      { name: "theme-color", content: "#0f1b3d" },
    ],
    links: [
      { rel: "canonical", href: `${SITE_URL}/` },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon.png" },
      { rel: "icon", type: "image/png", sizes: "192x192", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: "/favicon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap" },
    ],
    scripts: [
      {
        src: "https://www.googletagmanager.com/gtag/js?id=G-XVFRCP22VR",
        async: true,
      },
      {
        children: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-XVFRCP22VR');`,
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "MobilePhoneStore",
           "@id": `${SITE_URL}/#business`,
          name: "Super Telecom",
           image: `${SITE_URL}/favicon.png`,
           logo: `${SITE_URL}/favicon.png`,
           url: `${SITE_URL}/`,
          telephone: "+918002903643",
          email: "supertelecom1002@gmail.com",
          description: SITE_DESC,
          address: {
            "@type": "PostalAddress",
            streetAddress: STORE_STREET_ADDRESS,
            addressLocality: "Giridih",
            addressRegion: "Jharkhand",
            postalCode: "815301",
            addressCountry: "IN",
          },
          geo: { "@type": "GeoCoordinates", latitude: 24.1854, longitude: 86.3040 },
          areaServed: [
            { "@type": "City", name: "Giridih" },
            { "@type": "State", name: "Jharkhand" },
          ],
          priceRange: "₹₹",
          openingHoursSpecification: [{
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
            opens: "09:00",
            closes: "21:00",
          }],
          sameAs: ["https://maps.app.goo.gl/mu5XXCehEpocaZWY9"],
          slogan: "Professional Mobile Repair & Second-Hand Smartphone Store in Giridih",
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Mobile Repair Services",
            itemListElement: [
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Smartphone Display & Screen Replacement",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Chip-Level Motherboard Micro-Soldering",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Battery & Charging Port Replacement",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Water Damage Diagnostics & Ultrasonic Revival",
                },
              },
            ],
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "@id": `${SITE_URL}/#faq`,
          mainEntity: [
            {
              "@type": "Question",
              name: "Where is Super Telecom located in Giridih?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Super Telecom is located at Barganda Road, Near Shivam Clinic, Giridih, Jharkhand 815301. We provide mobile phone repair, battery replacement, and accessories.",
              },
            },
            {
              "@type": "Question",
              name: "What services does Super Telecom provide in Giridih?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "We provide same-day screen replacements, battery replacements, charging port repairs, chip-level motherboard micro-soldering, water damage revival, and tested refurbished phones.",
              },
            },
            {
              "@type": "Question",
              name: "Do you repair water-damaged and dead phones in Giridih?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes, Super Telecom provides diagnostic testing, ultrasonic cleaning, and motherboard IC micro-soldering for dead or water-damaged devices.",
              },
            },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Super Telecom",
          url: `${SITE_URL}/`,
          publisher: { "@id": `${SITE_URL}/#business` },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Super Telecom",
          url: `${SITE_URL}/`,
          logo: `${SITE_URL}/favicon.png`,
          contactPoint: {
            "@type": "ContactPoint",
            telephone: "+918002903643",
            contactType: "customer service",
            areaServed: "IN",
            availableLanguage: ["en", "hi"],
          },
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

const themeInitScript = `(function(){try{var t=localStorage.getItem('st-theme')||'dark';document.documentElement.classList.toggle('dark',t==='dark');}catch(e){}})();`;

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <CookieBanner />
    </QueryClientProvider>
  );
}

function CookieBanner() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    try {
      const consent = localStorage.getItem("st-cookie-consent");
      if (consent !== "accepted") setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    try {
      localStorage.setItem("st-cookie-consent", "accepted");
    } catch {
      // ignore storage errors
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/60 bg-surface/95 p-4 shadow-2xl backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 sm:flex-row sm:gap-6">
        <p className="text-sm text-muted-foreground">
          We use cookies and similar technologies to remember your preferences, improve performance, and understand how you use our site. By continuing, you agree to our{" "}
          <Link to="/cookie-policy" className="font-medium text-primary underline-offset-2 hover:underline">
            Cookie Policy
          </Link>.
        </p>
        <div className="flex w-full flex-shrink-0 items-center gap-3 sm:w-auto">
          <Link
            to="/cookie-policy"
            className="hidden rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary sm:inline-flex"
          >
            Learn more
          </Link>
          <button
            type="button"
            onClick={accept}
            className="inline-flex w-full items-center justify-center rounded-full bg-gradient-brand px-5 py-2 text-sm font-semibold text-primary-foreground shadow-brand transition-transform hover:scale-[1.03] sm:w-auto"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
