import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Smartphone,
  Download,
  Apple,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldAlert,
  Zap,
  Battery,
  Bell,
  Cpu,
  Share2,
  PlusSquare,
  MessageCircle,
  Phone,
  ChevronRight,
  Wrench,
  MapPin,
  Copy,
  Check,
} from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { SiteFooter } from "@/components/SiteFooter";
import { SITE_URL, STORE_STREET_ADDRESS } from "@/data/site";
import { BUSINESS_MASTER } from "@/config/superTelecomConfig";
import { useIsStandalone } from "@/hooks/useIsStandalone";
import { safeVibrate } from "@/utils/safeVibrate";

const PHONE = BUSINESS_MASTER.phoneRaw;
const PHONE_DISPLAY = BUSINESS_MASTER.phoneDisplay;
const WHATSAPP = BUSINESS_MASTER.whatsappNumber;
const MAPS = BUSINESS_MASTER.mapsUrl;

const APK_FILENAME = "SuperTelecomGamingOS.apk";
const APK_DOWNLOAD_URL = `/${APK_FILENAME}`;
const APK_PACKAGE_ID = "com.supertelecom.gamingos";
const APK_VERSION = "Debug Sideload v1.0.0";
const APK_FILE_SIZE = "15.62 MB";
const APK_SHA256 = "889586ca3f61cc52ef6c3b29451d1ceddbff4d9a4a387961ac3b10af31e13f6d";

const TITLE = "Download Super Telecom Android APK | Giridih Mobile Repair Lab App";
const DESC =
  "Download the official Super Telecom Android APK (15.62 MB, com.supertelecom.gamingos). Standalone utility app for phone diagnostics and repair support in Giridih.";
const KEYWORDS =
  "Super Telecom APK, Super Telecom app download, Super Telecom Giridih APK, mobile repair app Giridih, phone diagnostic tools APK";
const OG_TITLE = "Download Super Telecom Android APK (Debug Build)";
const OG_DESC =
  "Official Android APK for Super Telecom Giridih. Client-side hardware diagnostics, repair inquiries, and store information.";
const OG_IMAGE = `${SITE_URL}/og-download.jpg`;

export const Route = createFileRoute("/download")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "keywords", content: KEYWORDS },
      { property: "og:title", content: OG_TITLE },
      { property: "og:description", content: OG_DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/download` },
      { property: "og:site_name", content: "Super Telecom" },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: OG_TITLE },
      { name: "twitter:description", content: OG_DESC },
      { name: "twitter:image", content: OG_IMAGE },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/download` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Super Telecom Android APK",
          operatingSystem: "Android",
          applicationCategory: "UtilitiesApplication",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "INR",
          },
          downloadUrl: `${SITE_URL}${APK_DOWNLOAD_URL}`,
          fileSize: APK_FILE_SIZE,
          softwareVersion: APK_VERSION,
          description: DESC,
          author: {
            "@type": "ElectronicsRepairStore",
            name: BUSINESS_MASTER.name,
            telephone: PHONE,
            address: {
              "@type": "PostalAddress",
              streetAddress: STORE_STREET_ADDRESS,
              addressLocality: "Giridih",
              addressRegion: "Jharkhand",
              postalCode: "815301",
              addressCountry: "IN",
            },
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "What package is the Super Telecom APK?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "The package is com.supertelecom.gamingos (15.62 MB), compiled as a native Android utility and launcher application for Giridih mobile users.",
              },
            },
            {
              "@type": "Question",
              name: "Why does Android show 'File might be harmful' during download?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "This is standard Android OS security behavior for any APK installed directly outside the Google Play Store (sideloading). This build is not distributed through Google Play.",
              },
            },
            {
              "@type": "Question",
              name: "How can iPhone users access Super Telecom?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "There is currently no iOS native app on the Apple App Store. iPhone users can open supertelecom.shop in Safari, tap the Share button, and select 'Add to Home Screen' for an install-free PWA experience.",
              },
            },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: "Download App", item: `${SITE_URL}/download` },
          ],
        }),
      },
    ],
  }),
  component: DownloadPage,
});

export default function DownloadPage() {
  const isStandalone = useIsStandalone();
  const [installGuideOpen, setInstallGuideOpen] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [downloadTriggered, setDownloadTriggered] = useState<boolean>(false);
  const [isIosDevice, setIsIosDevice] = useState<boolean>(false);
  const [copiedHash, setCopiedHash] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isIos = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    setIsIosDevice(isIos);
  }, []);

  const handleManualDownload = () => {
    safeVibrate([30, 20, 40]);
    setDownloadTriggered(true);

    if (typeof window !== "undefined") {
      const a = document.createElement("a");
      a.href = APK_DOWNLOAD_URL;
      a.download = APK_FILENAME;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const copyHashToClipboard = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(APK_SHA256);
      setCopiedHash(true);
      safeVibrate(20);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "What is this APK and what are the package details?",
      a: "This is a direct Android APK package (com.supertelecom.gamingos, ~15.62 MB) containing our standalone hardware utility and launcher prototype. It is provided for users who wish to test offline screen and audio diagnostics natively.",
    },
    {
      q: "Why does Android show 'File might be harmful' during download?",
      a: "This is a standard default security notice that modern Android devices display for any APK file downloaded outside the Google Play Store (sideloading). Because this build is distributed directly rather than via Google Play, you will need to allow installation from unknown sources in your browser or file manager.",
    },
    {
      q: "Has this APK been verified or certified by Google Play Protect?",
      a: "No. This is a direct sideloaded developer package and has not been reviewed, certified, or hosted on the Google Play Store. We provide the full SHA-256 cryptographic checksum below so you can independently verify file integrity before installation.",
    },
    {
      q: "Is there an iPhone app on the Apple App Store?",
      a: "No. We do not maintain an app on the Apple App Store. iPhone users can use our website (supertelecom.shop) directly in Safari. You can tap 'Share' > 'Add to Home Screen' to create an instant shortcut with full mobile layout support.",
    },
  ];

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-clip bg-background text-foreground transition-colors duration-200">
      {/* 1. STICKY TOP APP BAR */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
          <BrandLogo size="md" to="/" />

          <div className="flex items-center gap-2.5">
            <a
              href={`tel:${PHONE}`}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-border/70 px-3 py-1.5 text-xs font-semibold hover:bg-accent transition-colors"
            >
              <Phone className="h-3.5 w-3.5 text-primary" />
              <span>{PHONE_DISPLAY}</span>
            </a>

            <a
              href={`https://wa.me/${WHATSAPP}?text=Hi%20Super%20Telecom,%20I%20have%20a%20question%20about%20the%20mobile%20app`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 text-xs font-bold transition-all shadow-sm"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span className="hidden xs:inline">WhatsApp</span>
            </a>

            <Link
              to="/"
              className="inline-flex items-center gap-1 rounded-xl bg-secondary hover:bg-muted text-foreground border border-border px-3 py-1.5 text-xs font-medium transition-colors"
            >
              <span>← Home</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Download App</span>
        </nav>

        {/* STANDALONE ACTIVE BANNER */}
        {isStandalone && (
          <div className="mb-8 p-4 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left shadow-lg shadow-emerald-950/20">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  Super Telecom Web App is Active!
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  You are currently browsing the web app in standalone home-screen mode.
                </p>
              </div>
            </div>
            <Link
              to="/"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs active:scale-95 transition-all shadow-sm whitespace-nowrap"
            >
              Open Dashboard &rarr;
            </Link>
          </div>
        )}

        {/* 2. HERO SECTION */}
        <section className="text-center space-y-4 mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-100 dark:bg-cyan-950/80 border border-cyan-300 dark:border-cyan-500/40 text-cyan-900 dark:text-cyan-300 text-xs font-mono font-bold tracking-tight shadow-sm">
            <Zap className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
            <span>SUPER TELECOM MOBILE APPLICATION</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Super Telecom Mobile App <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-cyan-600 via-sky-500 to-blue-600 dark:from-cyan-400 dark:via-sky-300 dark:to-blue-400 bg-clip-text text-transparent">
              Android APK &amp; Web App
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Access our client-side screen and audio diagnostic utilities, check store services, and connect with our Barganda Road repair lab in Giridih.
          </p>

          {/* Quick Disclaimers */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium">
              <Cpu className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
              Package: com.supertelecom.gamingos
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 font-medium">
              <ShieldAlert className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              Sideload / Direct Debug APK (Not on Google Play)
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/50 border border-cyan-200 dark:border-cyan-800 text-cyan-800 dark:text-cyan-300 font-medium">
              <Wrench className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
              Client-Side Browser &amp; Native Tools
            </span>
          </div>
        </section>

        {/* 3. DUAL PLATFORM CARDS */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12">
          {/* CARD 1: SUPER TELECOM ANDROID APK */}
          <div className="relative rounded-3xl p-6 sm:p-7 bg-white dark:bg-slate-900/80 backdrop-blur-2xl border-2 border-emerald-500/50 dark:border-emerald-500/40 shadow-xl shadow-emerald-500/10 flex flex-col justify-between transition-all hover:border-emerald-500">
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-[11px] font-mono font-bold">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                DIRECT SIDELOAD APK
              </span>
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-semibold">
                Android 8.0+
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-md shadow-emerald-500/20 shrink-0">
                  <Smartphone className="h-7 w-7" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                    Super Telecom Android APK
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                      {APK_VERSION}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                      {APK_FILE_SIZE}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sideload Advisory Box */}
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-xs text-amber-900 dark:text-amber-200 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>Sideloading &amp; Installation Notice</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  This APK is distributed directly as a development/debug build. It is not hosted on Google Play Store. Your Android device may display an "Unknown sources" warning when installing. Verify the cryptographic SHA-256 checksum before installation.
                </p>
              </div>

              {/* Feature List */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                  <Wrench className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Screen &amp; Audio Lab Utilities</strong>: Touch matrix tester, tone generator, and frame-rate checks.
                  </span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                  <Cpu className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Package ID</strong>: <code className="font-mono text-[11px] text-cyan-600 dark:text-cyan-400">{APK_PACKAGE_ID}</code>
                  </span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                  <Battery className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Offline Compatibility</strong>: Core diagnostic test interfaces function locally on your device.
                  </span>
                </div>
              </div>

              {/* Primary Download CTA */}
              <div className="pt-3">
                <button
                  type="button"
                  onClick={handleManualDownload}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 active:scale-[0.98] text-slate-950 font-black text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
                >
                  <Download className="h-5 w-5" />
                  <span>Download APK ({APK_FILE_SIZE})</span>
                </button>
                {downloadTriggered && (
                  <p className="text-[11px] text-center text-emerald-600 dark:text-emerald-400 mt-2 font-mono">
                    Download initiated for {APK_FILENAME}
                  </p>
                )}
              </div>

              {/* Quick 3-Step Install Guide Accordion */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setInstallGuideOpen(!installGuideOpen)}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    How to Install a Sideloaded APK
                  </span>
                  {installGuideOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>

                {installGuideOpen && (
                  <div className="mt-2 p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-start gap-2">
                      <span className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                        1
                      </span>
                      <span>
                        Tap <strong>"Download APK"</strong> above to save the package ({APK_FILENAME}).
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                        2
                      </span>
                      <span>
                        Open the downloaded file and select <strong>"Install"</strong> (enable "Install unknown apps" for your browser if prompted by Android).
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                        3
                      </span>
                      <span>
                        Launch <strong>Super Telecom</strong> to test device screen and audio components.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* CARD 2: IPHONE / IOS APP (PWA SHORTCUT) */}
          <div className="relative rounded-3xl p-6 sm:p-7 bg-white dark:bg-slate-900/80 backdrop-blur-2xl border-2 border-slate-200 dark:border-slate-800 shadow-xl shadow-black/5 flex flex-col justify-between transition-all hover:border-cyan-500/40">
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950/80 border border-sky-300 dark:border-sky-500/40 text-sky-900 dark:text-sky-300 text-[11px] font-mono font-bold">
                SAFARI WEB APP (PWA)
              </span>
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-semibold">
                iOS 14.0+
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 text-white shadow-md shadow-slate-900/40 shrink-0 border border-slate-700">
                  <Apple className="h-7 w-7" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                    Super Telecom for iOS
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-mono font-bold text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/80 px-2 py-0.5 rounded border border-sky-200 dark:border-sky-800">
                      Progressive Web App
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                      No App Store Required
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3">
                We do not maintain a native iOS app on the Apple App Store. iPhone and iPad users can install our web application directly to their Home Screen via Safari with zero storage overhead.
              </p>

              {/* Safari PWA Instructions */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500/10 via-sky-500/5 to-blue-500/10 border border-cyan-500/30 space-y-2.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Add to iPhone Home Screen in 10 Seconds:
                  </h4>
                </div>

                <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-200">
                  <div className="flex items-center gap-2">
                    <Share2 className="h-4 w-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                    <span>
                      <strong>1.</strong> Tap the <strong>Share</strong> icon at the bottom of Safari.
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PlusSquare className="h-4 w-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                    <span>
                      <strong>2.</strong> Scroll down and select <strong>"Add to Home Screen"</strong>.
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>
                      <strong>3.</strong> Launch full-screen from your Home Screen anytime.
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={`https://wa.me/${WHATSAPP}?text=Hi%20Super%20Telecom,%20I%20have%20an%20iPhone%20repair%20question`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 active:scale-[0.98] text-slate-900 dark:text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-700 transition-all cursor-pointer"
                >
                  <MessageCircle className="h-4 w-4 text-emerald-500" />
                  <span>Ask an iPhone Repair Question on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 4. TECHNICAL SPECIFICATIONS & CRYPTOGRAPHIC CHECKSUM */}
        <section className="mb-14">
          <div className="rounded-3xl p-5 sm:p-6 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Technical Specifications &amp; Cryptographic Checksum
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 font-mono block">Package Identifier</span>
                <span className="font-bold text-slate-900 dark:text-white break-all">{APK_PACKAGE_ID}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 font-mono block">Build Type</span>
                <span className="font-bold text-slate-900 dark:text-white">{APK_VERSION}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 font-mono block">Target Architecture</span>
                <span className="font-bold text-slate-900 dark:text-white">Android 8.0+ (API 26+)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 font-mono block">Exact File Size</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{APK_FILE_SIZE}</span>
              </div>
            </div>

            {/* Cryptographic SHA-256 Hash Display */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-mono font-bold">Official SHA-256 Checksum:</span>
                <button
                  type="button"
                  onClick={copyHashToClipboard}
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-cyan-600 dark:text-cyan-400 hover:underline"
                >
                  {copiedHash ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedHash ? "Copied!" : "Copy Hash"}</span>
                </button>
              </div>
              <div className="font-mono text-[10px] sm:text-[11px] text-slate-800 dark:text-slate-200 break-all select-all bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800">
                {APK_SHA256}
              </div>
            </div>
          </div>
        </section>

        {/* 5. FAQS ACCORDION */}
        <section className="mb-14 space-y-4">
          <div className="text-center space-y-1.5 mb-6">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Frequently Asked Questions</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Clear, transparent answers regarding application installation, safety, and iOS usage.
            </p>
          </div>

          <div className="space-y-2.5 max-w-3xl mx-auto">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 overflow-hidden shadow-sm transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 text-xs sm:text-sm font-bold text-slate-900 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 shrink-0 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 6. BOTTOM LAB VISIT BANNER */}
        <section className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-slate-950 to-cyan-950 border border-cyan-500/30 text-white space-y-4 shadow-xl text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono text-cyan-400 font-bold tracking-wider uppercase block">
              Barganda Road Hardware Lab &bull; Giridih
            </span>
            <h3 className="text-lg sm:text-xl font-black text-white">
              Need Direct In-Store Phone Service?
            </h3>
            <p className="text-xs text-slate-300 max-w-md">
              Visit our lab near Shivam Clinic for physical device inspection, screen replacement, and hardware repairs in Giridih.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 shrink-0">
            <a
              href={`tel:${PHONE}`}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 active:scale-95 transition-all"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>Call Lab Desk</span>
            </a>
            <a
              href={MAPS}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center gap-1.5 border border-slate-700 active:scale-95 transition-all"
            >
              <MapPin className="h-3.5 w-3.5 text-cyan-400" />
              <span>Get Directions</span>
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}
