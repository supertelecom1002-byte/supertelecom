import { createFileRoute } from "@tanstack/react-router";
import React, { Suspense } from "react";
import { Header } from "@/components/Header";
import { SiteFooter } from "@/components/SiteFooter";
import { MobileAppShell } from "@/components/layout/MobileAppShell";
import { SmartFinderPlatform } from "@/components/smartfinder/SmartFinderPlatform";
import { SITE_URL } from "@/data/site";
import { Sparkles, Shield, ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/smartfinder")({
  head: () => ({
    meta: [
      {
        title: "SmartFinder AI | 4-Engine Smartphone Discovery, Scanner & Resale Valuation — Super Telecom Giridih",
      },
      {
        name: "description",
        content:
          "India's premier AI smartphone platform: Natural language phone recommendations, 14-point resale value calculator, hardware diagnostics scanner, and live multi-retailer price comparison by Super Telecom Giridih.",
      },
      {
        name: "keywords",
        content:
          "SmartFinder AI, Best phone under 20000, Used phone price calculator Giridih, Smartphone resale value, Compare phone specs, Second hand phone Giridih, Super Telecom Barganda Road",
      },
      {
        property: "og:title",
        content: "SmartFinder AI — 4-Engine Smartphone Discovery & Resale Valuation",
      },
      {
        property: "og:description",
        content:
          "Find your ideal smartphone with AI, scan hardware specs, and calculate true used phone resale cash value at Super Telecom Giridih.",
      },
      {
        property: "og:url",
        content: `${SITE_URL}/smartfinder`,
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
    ],
    links: [
      {
        rel: "canonical",
        href: `${SITE_URL}/smartfinder`,
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Super Telecom SmartFinder AI",
          applicationCategory: "ShoppingApplication, UtilitiesApplication",
          operatingSystem: "Web, Android, iOS",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "INR",
          },
          description:
            "AI-powered multi-factor smartphone recommendation, 14-point resale valuation, client-side hardware scanner, and multi-retailer price comparison engine.",
          publisher: {
            "@type": "Organization",
            name: "Super Telecom",
            url: SITE_URL,
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
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
              name: "SmartFinder AI",
              item: `${SITE_URL}/smartfinder`,
            },
          ],
        }),
      },
    ],
  }),
  component: SmartFinderPage,
});

class SmartFinderErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any) {
    console.error("SmartFinder encountered an error:", error);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[500px] flex flex-col items-center justify-center p-8 text-center bg-slate-950 text-white space-y-4">
          <div className="p-3 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold">SmartFinder AI Offline Fallback Active</h2>
          <p className="text-sm text-slate-400 max-w-md">
            The platform is reconnecting to our verified local smartphone catalogue. You can also visit our workshop directly on Barganda Road, Giridih.
          </p>
          <a
            href="https://wa.me/918002903643?text=Hi%20Super%20Telecom,%20I%20need%20smartphone%20buying%20or%20resale%20advice"
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
          >
            Chat with Technician on WhatsApp
          </a>
        </div>
      );
    }
    return this.props.children;
  }
}

export function SmartFinderPage() {
  return (
    <>
      {/* Mobile App Shell (md:hidden) */}
      <div className="md:hidden">
        <MobileAppShell />
      </div>

      {/* Desktop / Tablet Web Experience */}
      <div className="hidden md:block min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Header isHomePage={false} />

        <main className="flex-1 w-full pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Super Telecom Home
            </Link>
          </div>

          <SmartFinderErrorBoundary>
            <Suspense
              fallback={
                <div className="min-h-[600px] flex items-center justify-center text-cyan-400 bg-slate-950 font-mono text-sm">
                  Loading Super Telecom SmartFinder AI Engines...
                </div>
              }
            >
              <SmartFinderPlatform />
            </Suspense>
          </SmartFinderErrorBoundary>
        </main>

        <SiteFooter />
      </div>
    </>
  );
}

export default SmartFinderPage;
