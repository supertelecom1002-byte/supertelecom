import { useState, useEffect, useRef } from "react";
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
  ShieldCheck,
  Zap,
  Battery,
  Bell,
  Cpu,
  Share2,
  PlusSquare,
  MessageCircle,
  Phone,
  ArrowRight,
  ChevronRight,
  ExternalLink,
  Layers,
  Wrench,
  Clock,
  MapPin,
  Loader2,
  HardDrive,
} from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { SiteFooter } from "@/components/SiteFooter";
import { SITE_URL, STORE_STREET_ADDRESS } from "@/data/site";
import { useIsStandalone } from "@/hooks/useIsStandalone";
import { safeVibrate } from "@/utils/safeVibrate";

const PHONE = "+918002903643";
const PHONE_DISPLAY = "+91 80029 03643";
const WHATSAPP = "918002903643";
const MAPS = "https://maps.app.goo.gl/mu5XXCehEpocaZWY9";

const TITLE = "Download Super Telecom APK v2.4.0 (Official) | Giridih Mobile Repair Lab App";
const DESC =
  "Download official Super Telecom Android APK for free. 16+ offline hardware diagnostic tools, 165Hz speaker dust ejector, live repair tracking, and charging ampere meter.";
const KEYWORDS =
  "Super Telecom APK, Super Telecom app download, Super Telecom Giridih APK, mobile repair app Giridih, 165Hz speaker cleaner APK";
const OG_TITLE = "Download Super Telecom Android APK (Official Lab App)";
const OG_DESC =
  "Official Android app for Super Telecom Giridih. 100% offline hardware diagnostic tools and live repair tracking.";
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
          downloadUrl: `${SITE_URL}/SuperTelecom.apk`,
          fileSize: "1.7MB",
          softwareVersion: "2.4.0",
          description: DESC,
          author: {
            "@type": "ElectronicsRepairStore",
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
              name: "Is the Super Telecom APK safe and virus-free?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes, 100% safe, clean, and verified. The APK is compiled directly by Super Telecom Giridih with zero third-party adware, zero trackers, and zero bloatware. All 16+ hardware utilities operate completely client-side.",
              },
            },
            {
              "@type": "Question",
              name: "Why does Android show 'File might be harmful' during download?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "This is a standard security prompt that modern Android devices display for any APK file downloaded outside Google Play. Simply tap 'Download anyway' to proceed safely.",
              },
            },
            {
              "@type": "Question",
              name: "Can I use the hardware diagnostic tools offline without internet?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes! Every single one of the 16+ hardware lab tools (165Hz Speaker Dust Ejector, 10x15 Touch Matrix, Multi-Touch Tester, Anti-Theft Siren, Battery Guard, IMEI Validator, etc.) works 100% offline with zero data consumption.",
              },
            },
            {
              "@type": "Question",
              name: "How can iPhone users install the Super Telecom app?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "iPhone users can open supertelecom.shop in Safari, tap the Share button, and select 'Add to Home Screen' for an instant full-screen, offline-cached app experience.",
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

  // Auto-Download State Engine
  const [countdown, setCountdown] = useState<number>(1.5);
  const [downloadTriggered, setDownloadTriggered] = useState<boolean>(false);
  const [isIosDevice, setIsIosDevice] = useState<boolean>(false);
  const downloadTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Detect iOS
    const isIos = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    setIsIosDevice(isIos);

    // If installed or on iOS, skip auto-download
    if (isStandalone || isIos) {
      return;
    }

    // 1.5-second countdown auto-trigger engine
    const startTime = Date.now();
    const duration = 1500; // 1.5 seconds

    downloadTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, (duration - elapsed) / 1000);
      setCountdown(Number(remaining.toFixed(1)));

      if (remaining <= 0) {
        if (downloadTimerRef.current) clearInterval(downloadTimerRef.current);
        triggerDownload();
      }
    }, 100);

    return () => {
      if (downloadTimerRef.current) clearInterval(downloadTimerRef.current);
    };
  }, [isStandalone]);

  const triggerDownload = (fromUserGesture = false) => {
    if (downloadTimerRef.current) clearInterval(downloadTimerRef.current);
    setCountdown(0);
    setDownloadTriggered(true);

    if (fromUserGesture) {
      safeVibrate([30, 20, 40]);
    }

    if (typeof window !== "undefined") {
      // Invisible link click to ensure native download header handling
      const a = document.createElement("a");
      a.href = "/SuperTelecom.apk";
      a.download = "SuperTelecom.apk";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleManualDownload = () => {
    triggerDownload(true);
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "Is the Super Telecom APK file safe and virus-free?",
      a: "Yes, 100% safe, clean, and verified. The APK is compiled directly by Super Telecom Giridih with zero third-party adware, zero analytics trackers, and zero bloatware. All 16+ hardware utilities operate completely client-side.",
    },
    {
      q: "Why does Android show 'File might be harmful' during download?",
      a: "This is a standard default security notice that modern Android devices display for any APK file downloaded outside the Google Play Store. Simply tap 'Download anyway' to proceed safely.",
    },
    {
      q: "Can I use the hardware diagnostic tools offline without internet?",
      a: "Yes! Every single one of the 16+ hardware lab tools (165Hz Speaker Dust Ejector, 10x15 Touch Matrix, Multi-Touch Tester, Anti-Theft Siren, Battery Guard, IMEI Validator, etc.) works 100% offline with zero data consumption.",
    },
    {
      q: "How can iPhone users use Super Telecom right now?",
      a: "While our native iOS App Store version is completing TestFlight review, iPhone users can open supertelecom.shop in Safari, tap the Share icon, and select 'Add to Home Screen'. This installs the full app with full-screen experience and offline cache instantly!",
    },
  ];

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-clip bg-background text-foreground transition-colors duration-200">
      {/* ========================================================= */}
      {/* 1. STICKY TOP APP BAR                                     */}
      {/* ========================================================= */}
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
          <span className="text-foreground font-medium">Download Official App</span>
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
                  Super Telecom App is Already Installed!
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  You are currently using the app in standalone mode with all 16+ offline hardware diagnostics active.
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

        {/* ========================================================= */}
        {/* 2. AUTO-TRIGGERED DOWNLOAD RADAR (HERO BANNER)            */}
        {/* ========================================================= */}
        {!isStandalone && !isIosDevice && (
          <div className="mb-8 rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-emerald-500/15 via-slate-900/90 to-teal-500/15 border-2 border-emerald-500/50 shadow-2xl backdrop-blur-xl relative overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-5 animate-in fade-in">
            {/* Ambient Background Glow */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-1.5 z-10 max-w-lg">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <span className="text-[11px] font-mono uppercase tracking-wider font-extrabold text-emerald-600 dark:text-emerald-400">
                  {downloadTriggered
                    ? "Download Commenced"
                    : `Auto-Download Engine (${countdown}s)`}
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-tight">
                {downloadTriggered
                  ? "Super Telecom APK Download Has Started!"
                  : `Starting your direct APK download in ${countdown}s...`}
              </h2>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {downloadTriggered
                  ? "Please check your browser notifications. If your device blocked the prompt, tap the button on the right to download directly."
                  : "Connecting to secure CDN server. Zero waiting queue, zero malware, and direct Android package delivery."}
              </p>

              {/* Countdown Progress Bar */}
              {!downloadTriggered && (
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-1.5 rounded-full transition-all duration-100 ease-linear"
                    style={{ width: `${Math.max(0, 100 - (countdown / 1.5) * 100)}%` }}
                  />
                </div>
              )}
            </div>

            {/* Prominent Pulse Button */}
            <div className="z-10 shrink-0 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleManualDownload}
                className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 active:scale-95 text-slate-950 font-black text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-500/30 transition-all cursor-pointer ring-4 ring-emerald-500/20 hover:ring-emerald-500/40"
              >
                <Download className="h-5 w-5 animate-bounce" />
                <span>Tap to Download APK Directly</span>
              </button>
              <div className="text-[10px] text-center text-slate-500 dark:text-slate-400 font-mono mt-1.5">
                v2.4.0 &bull; 1.7 MB &bull; Android 8.0 to 16+
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 3. HERO SECTION                                           */}
        {/* ========================================================= */}
        <section className="text-center space-y-4 mb-10 sm:mb-12">
          {/* Official Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-100 dark:bg-cyan-950/80 border border-cyan-300 dark:border-cyan-500/40 text-cyan-900 dark:text-cyan-300 text-xs font-mono font-bold tracking-tight shadow-sm">
            <Zap className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
            <span>⚡ OFFICIAL SUPER TELECOM MOBILE APPLICATION</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Get the Full Lab Experience <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-cyan-600 via-sky-500 to-blue-600 dark:from-cyan-400 dark:via-sky-300 dark:to-blue-400 bg-clip-text text-transparent">
              In Your Pocket
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Super-fast performance, offline hardware diagnostic tools, live repair tracking pipeline, and VIP priority booking in Giridih.
          </p>

          {/* Quick Trust Highlights */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-medium">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              Verified &amp; Malware-Free
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/50 border border-cyan-200 dark:border-cyan-800 text-cyan-800 dark:text-cyan-300 font-medium">
              <Wrench className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
              16-in-1 Offline Lab Tools
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-300 font-medium">
              <Battery className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
              AMOLED Battery Safe
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 font-medium">
              <Bell className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              Live Repair Alerts
            </span>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 4. DUAL PLATFORM CARDS (SIDE BY SIDE ON DESKTOP)          */}
        {/* ========================================================= */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12">
          {/* ------------------------------------------------------- */}
          {/* CARD 1: SUPER TELECOM ANDROID APK (ACTIVE)              */}
          {/* ------------------------------------------------------- */}
          <div className="relative rounded-3xl p-6 sm:p-7 bg-white dark:bg-slate-900/80 backdrop-blur-2xl border-2 border-emerald-500/50 dark:border-emerald-500/40 shadow-xl shadow-emerald-500/10 flex flex-col justify-between transition-all hover:border-emerald-500">
            {/* Top Tag */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-[11px] font-mono font-bold">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                ACTIVE &bull; DIRECT DOWNLOAD
              </span>
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-semibold">
                Android 8.0+
              </span>
            </div>

            <div className="space-y-4">
              {/* Header Info */}
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
                      v2.4.0 Stable
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                      ~1.7 MB &bull; Zero Bloat
                    </span>
                  </div>
                </div>
              </div>

              {/* Feature List */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                  <Zap className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>All 16+ Offline Hardware Lab Tools</strong>: Sonic 165Hz Speaker Ejector, 10x15 Touch Matrix, Multi-Touch Inspector, 120Hz FPS Meter, Spirit Level &amp; Anti-Theft Siren.
                  </span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                  <Bell className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Instant Push Notifications</strong>: Real-time status alerts when your device moves through diagnosis, micro-soldering, and quality check in our Barganda Road lab.
                  </span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                  <Battery className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Ultra Battery Saver AMOLED Engine</strong>: Pure dark surfaces and native hardware APIs deliver fluid 60/120Hz navigation with zero excess battery drain.
                  </span>
                </div>
              </div>

              {/* Primary Download CTA */}
              <div className="pt-3">
                <a
                  href="/SuperTelecom.apk"
                  download="SuperTelecom.apk"
                  onClick={handleManualDownload}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 active:scale-[0.98] text-slate-950 font-black text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
                >
                  <Download className="h-5 w-5" />
                  <span>Download Android APK (Direct)</span>
                </a>
                <p className="text-[11px] text-center text-slate-500 dark:text-slate-400 mt-2 font-mono">
                  SHA-256 Verified &bull; Universal ARM64/x86 &bull; Direct File
                </p>
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
                    Quick 3-Step Install Guide
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
                        Tap <strong>"Download Android APK"</strong> above to save the installation package.
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                        2
                      </span>
                      <span>
                        Open the downloaded file and click <strong>"Install"</strong> (Allow unknown apps from Chrome if prompted).
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                        3
                      </span>
                      <span>
                        Open <strong>Super Telecom</strong> and enjoy instant lab tools and 1-tap priority booking!
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------- */}
          {/* CARD 2: IPHONE / IOS APP (COMING SOON + PWA SHORTCUT)   */}
          {/* ------------------------------------------------------- */}
          <div className="relative rounded-3xl p-6 sm:p-7 bg-white dark:bg-slate-900/80 backdrop-blur-2xl border-2 border-slate-200 dark:border-slate-800 shadow-xl shadow-black/5 flex flex-col justify-between transition-all hover:border-cyan-500/40">
            {/* Top Tag */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-500/40 text-amber-900 dark:text-amber-300 text-[11px] font-mono font-bold">
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
                ⏳ COMING SOON TO APP STORE
              </span>
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-semibold">
                iOS 14.0+
              </span>
            </div>

            <div className="space-y-4">
              {/* Header Info */}
              <div className="flex items-start gap-3.5">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 text-white shadow-md shadow-slate-900/40 shrink-0 border border-slate-700">
                  <Apple className="h-7 w-7" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                    Super Telecom for iPhone
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/80 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                      In TestFlight Review
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                      Apple App Store
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Description */}
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3">
                Our native iOS App Store version is currently under active engineering and Apple TestFlight certification to deliver full Metal-accelerated graphics and native CoreHaptics diagnostics.
              </p>

              {/* Smart Safari PWA Instant Shortcut for Current iPhone Users */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500/10 via-sky-500/5 to-blue-500/10 border border-cyan-500/30 space-y-2.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Using an iPhone right now? You don't have to wait!
                  </h4>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                  You can install the official Super Telecom Web App right now via Safari in under 10 seconds with zero download size:
                </p>

                <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-200">
                  <div className="flex items-center gap-2">
                    <Share2 className="h-4 w-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                    <span>
                      <strong>1.</strong> Tap the <strong>Share</strong> button at the bottom of Safari.
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PlusSquare className="h-4 w-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                    <span>
                      <strong>2.</strong> Scroll down and choose <strong>"Add to Home Screen"</strong>.
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>
                      <strong>3.</strong> Launch full-screen from your Home Screen with offline tools!
                    </span>
                  </div>
                </div>
              </div>

              {/* Secondary CTA: Notify on Release */}
              <div className="pt-2">
                <a
                  href={`https://wa.me/${WHATSAPP}?text=Hi%20Super%20Telecom,%20please%20notify%20me%20when%20the%20iPhone%20app%20is%20live!`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 active:scale-[0.98] text-slate-900 dark:text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-700 transition-all cursor-pointer"
                >
                  <MessageCircle className="h-4 w-4 text-emerald-500" />
                  <span>Notify Me on iOS Release (WhatsApp)</span>
                </a>
                <p className="text-[11px] text-center text-slate-500 dark:text-slate-400 mt-2 font-mono">
                  Get pinged the moment our App Store link goes live
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 5. APP FEATURE HIGHLIGHTS GRID                            */}
        {/* ========================================================= */}
        <section className="mb-14 space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Why Install the Super Telecom Mobile App?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              Engineered exclusively for Giridih smartphone owners and hardware repair enthusiasts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 space-y-2 shadow-sm">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 w-fit border border-cyan-500/30">
                <Wrench className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">100% Offline Diagnostics</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Test audio frequencies, dead pixels, and touch matrix anywhere — even without active WiFi or SIM connection.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 space-y-2 shadow-sm">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 w-fit border border-emerald-500/30">
                <Bell className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Live Bench Tracking</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Input your Job Sheet ID (ST-XXXX) and see when your phone moves under the microscope or finishes assembly.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 space-y-2 shadow-sm">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 w-fit border border-purple-500/30">
                <Zap className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">1-Tap Lab VIP Queue</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Book express repair appointments directly from your phone and skip the queue at our Barganda Road shop.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 space-y-2 shadow-sm">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 w-fit border border-amber-500/30">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Safe &amp; Ultra-Light (~1.7 MB)</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Zero tracking libraries, zero background ads, and ultra-compact file footprint that runs on all phones.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 6. TECHNICAL SPECIFICATIONS TABLE                         */}
        {/* ========================================================= */}
        <section className="mb-14">
          <div className="rounded-3xl p-5 sm:p-6 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Technical Specifications &amp; Build Metadata
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 font-mono block">Package Identifier</span>
                <span className="font-bold text-slate-900 dark:text-white">shop.supertelecom.app</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 font-mono block">Current Release</span>
                <span className="font-bold text-slate-900 dark:text-white">v2.4.0 (Stable Production)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 font-mono block">Target Architecture</span>
                <span className="font-bold text-slate-900 dark:text-white">Universal ARM64 / ARMv7 / x86</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 font-mono block">File Size</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">~1.7 MB (Direct APK)</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 7. FAQS ACCORDION (AEO/GEO OPTIMIZED)                     */}
        {/* ========================================================= */}
        <section className="mb-14 space-y-4">
          <div className="text-center space-y-1.5 mb-6">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Frequently Asked Questions</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Clear answers regarding installation, safety, and compatibility.
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

        {/* ========================================================= */}
        {/* 8. BOTTOM LAB VISIT BANNER                                */}
        {/* ========================================================= */}
        <section className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-slate-950 to-cyan-950 border border-cyan-500/30 text-white space-y-4 shadow-xl text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono text-cyan-400 font-bold tracking-wider uppercase block">
              Barganda Road Hardware Lab &bull; Giridih
            </span>
            <h3 className="text-lg sm:text-xl font-black text-white">
              Need Priority Phone Repair Service Today?
            </h3>
            <p className="text-xs text-slate-300 max-w-md">
              Visit our lab near Shivam Clinic for instant screen replacement, IC diagnosis, and original parts in Giridih.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 shrink-0">
            <a
              href={`tel:${PHONE}`}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 active:scale-95 transition-all"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>Call Lab</span>
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
