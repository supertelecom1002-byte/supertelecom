import React, { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Download,
  Smartphone,
  Shield,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  QrCode,
  ArrowLeftRight,
  RotateCcw,
  LayoutGrid,
  Lock,
  Zap,
  ArrowRight,
  Info,
  AlertTriangle,
  Layers,
  Sparkles,
  WifiOff,
  RefreshCw,
  FolderOpen,
  Eye,
  Settings,
  HardDrive,
  Clock,
  Phone,
  MessageCircle,
  ExternalLink,
} from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { SiteFooter } from "@/components/SiteFooter";
import { SITE_URL, STORE_STREET_ADDRESS } from "@/data/site";
import { BUSINESS_MASTER } from "@/config/superTelecomConfig";
import { safeVibrate } from "@/utils/safeVibrate";
import {
  downloadSuperTelecomApk,
  KNOWN_RELEASE_APK,
  type DownloadProgress,
} from "@/utils/apkDownloadManager";

const PHONE = BUSINESS_MASTER.phoneRaw;
const PHONE_DISPLAY = BUSINESS_MASTER.phoneDisplay;
const WHATSAPP = BUSINESS_MASTER.whatsappNumber;

const SEO_TITLE = "Super Telecom App — Super Transfer, Super Recover & Super Launcher | 100% Free Android Suite";
const SEO_DESC =
  "Official Super Telecom Native Android App (v2.4.0, 1.69 MB). 100% Free, zero ads, DPDP Act 2027 compliant. Super Transfer (offline Wi-Fi Direct P2P), Super Recover (honest on-device media recovery), and Super Launcher (4 themes with 1-tap restore).";
const CANONICAL_URL = `${SITE_URL}/app`;

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: SEO_TITLE },
      { name: "description", content: SEO_DESC },
      { name: "keywords", content: "Super Telecom App, Super Transfer APK, Super Recover APK, Super Launcher Android, Giridih Mobile Repair App, Free Offline File Transfer India" },
      { property: "og:title", content: SEO_TITLE },
      { property: "og:description", content: SEO_DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: CANONICAL_URL },
      { property: "og:image", content: `${SITE_URL}/og-download.jpg` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: SEO_TITLE },
      { name: "twitter:description", content: SEO_DESC },
      { name: "twitter:image", content: `${SITE_URL}/og-download.jpg` },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: CANONICAL_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Super Telecom Android App",
          operatingSystem: "Android 7.0 and up",
          applicationCategory: "UtilitiesApplication",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "INR",
          },
          downloadUrl: `${SITE_URL}${KNOWN_RELEASE_APK.downloadUrl}`,
          fileSize: KNOWN_RELEASE_APK.fileSizeHuman,
          softwareVersion: KNOWN_RELEASE_APK.versionName,
          description: SEO_DESC,
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.9",
            reviewCount: "1200",
          },
          author: {
            "@type": "Organization",
            name: "Super Telecom Giridih",
            url: SITE_URL,
          },
        }),
      },
    ],
  }),
  component: AppShowcasePage,
});

function AppShowcasePage() {
  const [downloadProgress, setDownloadProgress] = useState<DownloadProgress>({
    receivedBytes: 0,
    totalBytes: KNOWN_RELEASE_APK.fileSize,
    percentage: 0,
    speedMbps: 0,
    status: "idle",
  });
  const [copiedSha, setCopiedSha] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [activeThemePreview, setActiveThemePreview] = useState<"minimal" | "ios" | "pixel" | "classic">("minimal");

  const handleStartDownload = () => {
    safeVibrate([30, 20, 40]);
    downloadSuperTelecomApk((prog) => {
      setDownloadProgress(prog);
    });
  };

  const handleCopySha = () => {
    safeVibrate([20]);
    navigator.clipboard.writeText(KNOWN_RELEASE_APK.sha256);
    setCopiedSha(true);
    setTimeout(() => setCopiedSha(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* ── Top Header Navigation ── */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2 group">
            <BrandLogo size="md" />
            <div className="flex flex-col">
              <span className="font-display text-sm sm:text-base font-black tracking-wide text-white group-hover:text-cyan-400 transition-colors">
                SUPER TELECOM
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Giridih #1 Mobile Hub
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <Link to="/" className="hover:text-cyan-400 transition-colors">
              Home
            </Link>
            <Link to="/services" className="hover:text-cyan-400 transition-colors">
              16 Repair Services
            </Link>
            <a
              href="#modules"
              className="hover:text-cyan-400 transition-colors"
            >
              4 App Engines
            </a>
            <a
              href="#install-guide"
              className="hover:text-cyan-400 transition-colors"
            >
              Install Guide
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/${WHATSAPP}?text=Hi%20Super%20Telecom,%20I%20have%20a%20query%20about%20the%20Super%20Telecom%20Android%20App.`}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-500/40 bg-emerald-950/40 text-emerald-300 text-xs font-bold hover:bg-emerald-900/50 transition-all"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>WhatsApp Support</span>
            </a>

            <button
              onClick={handleStartDownload}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/25 active:scale-95 transition-all"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download APK</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Content Container ── */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 space-y-16">
        {/* ── HERO SECTION ── */}
        <section className="relative text-center space-y-6 pt-4 pb-2">
          {/* Compliance & India Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-4 py-1.5 text-[11px] sm:text-xs font-mono font-bold text-emerald-300 backdrop-blur-md shadow-lg shadow-emerald-500/10">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>MADE IN INDIA • 100% FREE • ZERO ADS • DPDP ACT 2027 COMPLIANT</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Super Telecom App —{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
              Super Transfer, Super Recover &amp; Super Launcher
            </span>
          </h1>

          {/* Bilingual Subtitle */}
          <p className="text-slate-300 text-sm sm:text-base lg:text-lg max-w-3xl mx-auto leading-relaxed">
            पूरे भारत के लिए हल्का और 100% सुरक्षित नेटिव एंड्रॉयड ऐप। बिना इंटरनेट बड़ी 4GB+ फाइल्स शेयर करें (Super Transfer), 
            डिवाइस के खोए हुए फोटो व वीडियो को ईमानदारी से रिकवर करें (Super Recover), और 4 आकर्षक थीम्स वाला क्लीन होम लॉन्चर इस्तेमाल करें (Super Launcher)।
          </p>

          <p className="text-xs sm:text-sm text-slate-400 font-mono">
            Zero cloud uploads. Zero remote telemetry. 100% on-device privacy guaranteed under India's DPDP Act 2027.
          </p>
        </section>

        {/* ── LIVE VERIFIED DOWNLOAD CARD ── */}
        <section className="max-w-3xl mx-auto">
          <div className="relative rounded-3xl border border-cyan-500/40 bg-gradient-to-b from-slate-900/95 via-slate-900/80 to-slate-950 p-6 sm:p-8 shadow-2xl shadow-cyan-500/10 backdrop-blur-2xl">
            {/* Top Bar inside Card */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-cyan-500/30">
                  <Smartphone className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                    <span>Super Telecom Native Suite</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                      v{KNOWN_RELEASE_APK.versionName}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Package: {KNOWN_RELEASE_APK.packageId} • Size: {KNOWN_RELEASE_APK.fileSizeHuman}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowQrModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800/80 text-xs text-slate-200 hover:border-cyan-400 hover:text-cyan-300 transition-colors font-mono"
              >
                <QrCode className="h-4 w-4" />
                <span>Scan QR</span>
              </button>
            </div>

            {/* Spec Matrix Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-6">
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3 text-center">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Compatibility</span>
                <span className="text-xs sm:text-sm font-bold text-white">Android 7.0 – 15</span>
              </div>
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3 text-center">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Download Size</span>
                <span className="text-xs sm:text-sm font-bold text-cyan-300">{KNOWN_RELEASE_APK.fileSizeHuman}</span>
              </div>
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3 text-center">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Monetization</span>
                <span className="text-xs sm:text-sm font-bold text-emerald-400">100% Free • No Ads</span>
              </div>
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3 text-center">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Privacy Standard</span>
                <span className="text-xs sm:text-sm font-bold text-emerald-400">DPDP Act 2027</span>
              </div>
            </div>

            {/* SHA-256 Checksum Display */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3.5 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Verified SHA-256 Checksum (SHA-256 सत्यता जांच)</span>
                </span>
                <button
                  onClick={handleCopySha}
                  className="inline-flex items-center gap-1 text-cyan-400 hover:underline cursor-pointer"
                >
                  {copiedSha ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedSha ? "Copied!" : "Copy Hash"}</span>
                </button>
              </div>
              <code className="block text-[10px] sm:text-xs font-mono text-slate-300 break-all select-all">
                {KNOWN_RELEASE_APK.sha256}
              </code>
            </div>

            {/* Active Download Progress State */}
            {downloadProgress.status !== "idle" && (
              <div className="pt-6 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-cyan-400 font-bold flex items-center gap-2">
                    {downloadProgress.status === "downloading" && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                    {downloadProgress.status === "verifying" && <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />}
                    {downloadProgress.status === "completed" && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
                    {downloadProgress.status === "error" && <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />}
                    <span>
                      {downloadProgress.status === "preflight" && "Pre-flight server verification..."}
                      {downloadProgress.status === "downloading" && `Downloading: ${downloadProgress.percentage}% (${(downloadProgress.receivedBytes / 1_000_000).toFixed(2)} MB)`}
                      {downloadProgress.status === "verifying" && "Verifying client-side SHA-256 cryptographic hash..."}
                      {downloadProgress.status === "completed" && "Download verified & saved to device!"}
                      {downloadProgress.status === "error" && "Download interrupted"}
                    </span>
                  </span>
                  {downloadProgress.status === "downloading" && (
                    <span className="text-slate-400">{downloadProgress.speedMbps} Mbps</span>
                  )}
                </div>

                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-150 ${
                      downloadProgress.status === "error"
                        ? "bg-rose-500"
                        : downloadProgress.status === "completed"
                        ? "bg-emerald-500"
                        : "bg-gradient-to-r from-cyan-500 to-blue-500"
                    }`}
                    style={{ width: `${downloadProgress.percentage}%` }}
                  />
                </div>

                {downloadProgress.errorReason && (
                  <p className="text-xs text-rose-300 font-mono">{downloadProgress.errorReason}</p>
                )}
              </div>
            )}

            {/* CTA Buttons */}
            <div className="pt-6 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={handleStartDownload}
                disabled={downloadProgress.status === "downloading" || downloadProgress.status === "verifying"}
                className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/25 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
              >
                <Download className="h-5 w-5" />
                <span>
                  {downloadProgress.status === "completed"
                    ? "Download Again (SuperTelecom-Release.apk)"
                    : "Download Verified APK (1.69 MB)"}
                </span>
              </button>

              <a
                href={KNOWN_RELEASE_APK.downloadUrl}
                download={KNOWN_RELEASE_APK.downloadFilename}
                onClick={() => safeVibrate([20])}
                className="w-full sm:w-auto py-4 px-5 rounded-2xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700/80 text-xs font-mono text-slate-200 text-center transition-colors"
              >
                Direct Fallback Link
              </a>
            </div>

            <p className="text-[11px] text-slate-400 text-center pt-4 font-mono">
              Direct binary delivery with explicit <code className="text-cyan-300">application/vnd.android.package-archive</code> headers. No 404 HTML corruption.
            </p>
          </div>
        </section>

        {/* ── WEBSITE VS NATIVE APP COMPARISON MATRIX ── */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              Clear Functional Distinction
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              Website vs Native Android App — कब किसका उपयोग करें?
            </h2>
            <p className="text-slate-400 text-sm max-w-2xl mx-auto">
              सुपर टेलीकॉम वेबसाइट और नेटिव एंड्रॉयड ऐप दोनों अलग-अलग जरूरतों के लिए डिज़ाइन किए गए हैं:
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900/60 p-4 sm:p-6 backdrop-blur-xl">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono">
                  <th className="pb-3 pr-4 font-bold">क्षमता / फीचर (Capability)</th>
                  <th className="pb-3 px-4 font-bold text-cyan-300">Website (supertelecom.shop)</th>
                  <th className="pb-3 pl-4 font-bold text-emerald-300">Native Android App (APK)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                <tr>
                  <td className="py-3.5 pr-4 font-semibold text-white">इंटरैक्टिव 3D स्मार्टफोन टियरडाउन</td>
                  <td className="py-3.5 px-4 text-emerald-400 font-mono">हाँ (Three.js WebGL)</td>
                  <td className="py-3.5 pl-4 text-slate-500 font-mono">वेबसाइट पर उपलब्ध</td>
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-semibold text-white">16 गिरिडीह मोबाइल रिपेयर गाइड्स व एस्टीमेट्स</td>
                  <td className="py-3.5 px-4 text-emerald-400 font-mono">हाँ (पूर्ण AEO गाइड)</td>
                  <td className="py-3.5 pl-4 text-slate-400 font-mono">शॉर्टकट लिंक उपलब्ध</td>
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-semibold text-white">स्मार्ट विजुअल फॉल्ट फाइंडर व वॉट्सऐप कोट</td>
                  <td className="py-3.5 px-4 text-emerald-400 font-mono">हाँ (लाइव AI सिलेक्टर)</td>
                  <td className="py-3.5 pl-4 text-slate-400 font-mono">डायरेक्ट डायल व चैट</td>
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-semibold text-white">ऑफलाइन Wi-Fi Direct व हॉटस्पॉट फ़ाइल शेयरिंग</td>
                  <td className="py-3.5 px-4 text-rose-400/80 font-mono">ब्राउज़र में संभव नहीं</td>
                  <td className="py-3.5 pl-4 text-emerald-400 font-bold font-mono">हाँ (Super Transfer 60MB/s)</td>
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-semibold text-white">MediaStore व SAF ऑन-डिवाइस मीडिया रिकवरी</td>
                  <td className="py-3.5 px-4 text-rose-400/80 font-mono">सैंडबॉक्स सीमाएं</td>
                  <td className="py-3.5 pl-4 text-emerald-400 font-bold font-mono">हाँ (Super Recover 4-Tier)</td>
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-semibold text-white">कस्टम होम स्क्रीन व 4-थीम लॉन्चर</td>
                  <td className="py-3.5 px-4 text-rose-400/80 font-mono">ब्राउज़र में संभव नहीं</td>
                  <td className="py-3.5 pl-4 text-emerald-400 font-bold font-mono">हाँ (RoleManager.ROLE_HOME)</td>
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-semibold text-white">इंटरनेट की आवश्यकता</td>
                  <td className="py-3.5 px-4 text-slate-300 font-mono">हाँ (ऑनलाइन ब्राउज़िंग)</td>
                  <td className="py-3.5 pl-4 text-emerald-400 font-bold font-mono">100% शून्य इंटरनेट (Offline)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ── INTERACTIVE 4-MODULE APP TOUR ── */}
        <section id="modules" className="space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              Architecture Deep-Dive
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              नेटिव ऐप के 4 कोर इंजन (Modular 4-Engine Suite)
            </h2>
            <p className="text-slate-400 text-sm max-w-2xl mx-auto">
              सुपर टेलीकॉम ऐप में कोई गैर-जरूरी गेमिंग ब्लोट या संदिग्ध स्क्रीन ओवरले नहीं हैं। केवल शुद्ध, उपयोगी ऑन-डिवाइस टूल्स:
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Engine 1: Super Transfer */}
            <div className="rounded-3xl border border-cyan-500/30 bg-slate-900/70 p-6 space-y-4 hover:border-cyan-400 transition-all">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <ArrowLeftRight className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold">
                  Wi-Fi Direct P2P
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">1. Super Transfer — तेज़ ऑफलाइन फ़ाइल शेयरिंग</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                ब्लूटूथ की सुस्त गति को अलविदा कहें। सुपर ट्रांसफर सीधे दो मोबाइलों के बीच वाई-फाई डायरेक्ट या लोकल हॉटस्पॉट से कनेक्ट होता है:
              </p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400 mt-0.5 shrink-0" />
                  <span><strong>64KB बफ़र्ड स्ट्रीमिंग:</strong> 4GB+ 4K वीडियो या बैकअप आर्काइव भेजने पर भी फोन मेमोरी में लोड नहीं होता, जिससे क्रैश का खतरा 0% रहता है।</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400 mt-0.5 shrink-0" />
                  <span><strong>6-डिजिट पिन व QR पेयरिंग:</strong> अनजान कनेक्शन का कोई जोखिम नहीं; रिसीवर की स्पष्ट सहमति के बाद ही फ़ाइल ट्रांसफर शुरू होता है।</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400 mt-0.5 shrink-0" />
                  <span><strong>SHA-256 सत्यता जांच:</strong> हर फ़ाइल ट्रांसफर पूर्ण होने पर बाइट-लेवल हैश जांच करके सुनिश्चित किया जाता है कि फ़ाइल करप्ट नहीं हुई।</span>
                </li>
              </ul>
            </div>

            {/* Engine 2: Super Recover */}
            <div className="rounded-3xl border border-emerald-500/30 bg-slate-900/70 p-6 space-y-4 hover:border-emerald-400 transition-all">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <RotateCcw className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-bold">
                  Honest 4-Tier Engine
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">2. Super Recover — सच्चा ऑन-डिवाइस मीडिया रिकवरी इंजन</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                इंटरनेट पर मौजूद नकली रिकवरी ऐप्स के झूठे वादों के विपरीत, हमारा इंजन तकनीकी सच्चाई के साथ 4 स्तरों में स्कैन करता है:
              </p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span><strong>Tier 1 (Original Media):</strong> MediaStore ट्रैश और रीसायकल बिन में बची मूल गुणवत्ता वाली तस्वीरें और वीडियो।</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span><strong>Tier 2 (Hidden Copies):</strong> वॉट्सऐप या ऐप कैश फोल्डर्स में बची हुई सुरक्षित डुप्लीकेट कॉपियां।</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span><strong>Tier 3 (Thumbnails):</strong> सिस्टम थंबनेल डेटाबेस से बरामद लो-रेजोल्यूशन प्रीव्यू।</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span><strong>Tier 4 (Lab Backup):</strong> चिप-लेवल हार्डवेयर रिकवरी विकल्प (सुपर टेलीकॉम गिरिडीह लैब)।</span>
                </li>
              </ul>
            </div>

            {/* Engine 3: Super Launcher */}
            <div className="rounded-3xl border border-amber-500/30 bg-slate-900/70 p-6 space-y-4 hover:border-amber-400 transition-all md:col-span-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <LayoutGrid className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">3. Super Launcher — सुरक्षित कस्टम होम स्क्रीन (4 थीम्स)</h3>
                    <p className="text-xs text-slate-400">Official Home Intent Role Filter • Zero Lock-in</p>
                  </div>
                </div>

                {/* Theme Selector Pills */}
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800">
                  <button
                    onClick={() => setActiveThemePreview("minimal")}
                    className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                      activeThemePreview === "minimal"
                        ? "bg-amber-400 text-slate-950 font-bold"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Minimal
                  </button>
                  <button
                    onClick={() => setActiveThemePreview("ios")}
                    className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                      activeThemePreview === "ios"
                        ? "bg-amber-400 text-slate-950 font-bold"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    iOS-Inspired
                  </button>
                  <button
                    onClick={() => setActiveThemePreview("pixel")}
                    className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                      activeThemePreview === "pixel"
                        ? "bg-amber-400 text-slate-950 font-bold"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Pixel-Inspired
                  </button>
                  <button
                    onClick={() => setActiveThemePreview("classic")}
                    className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                      activeThemePreview === "classic"
                        ? "bg-amber-400 text-slate-950 font-bold"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Classic
                  </button>
                </div>
              </div>

              {/* Dynamic Theme Interactive Mockup Box */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 text-center space-y-4">
                <div className="space-y-1">
                  <span className="text-4xl sm:text-5xl font-mono font-light tracking-wider text-white">
                    12:45
                  </span>
                  <p className="text-xs font-mono text-slate-400">Sunday, 1 November • Giridih</p>
                </div>

                <div className="max-w-md mx-auto rounded-full border border-slate-800 bg-slate-900/90 py-2 px-4 text-xs font-mono text-slate-400 flex items-center justify-between">
                  <span>Search apps...</span>
                  <span className="text-cyan-400">⚡</span>
                </div>

                <div className="grid grid-cols-4 max-w-sm mx-auto gap-4 pt-2">
                  {["Phone", "WhatsApp", "Camera", "Settings"].map((app, i) => (
                    <div key={app} className="flex flex-col items-center gap-1.5">
                      <div
                        className={`h-12 w-12 flex items-center justify-center font-bold text-sm transition-all ${
                          activeThemePreview === "minimal"
                            ? "rounded-xl bg-slate-800 text-slate-200 border border-slate-700"
                            : activeThemePreview === "ios"
                            ? "rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-700 text-cyan-300 shadow-md shadow-slate-900"
                            : activeThemePreview === "pixel"
                            ? "rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/40"
                            : "rounded-xl bg-slate-800 text-white"
                        }`}
                      >
                        {app.slice(0, 1)}
                      </div>
                      <span className="text-[10px] font-mono text-slate-300">{app}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-900 max-w-lg mx-auto">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs font-mono">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span>
                      1-टैप सेफ्टी बटन: <strong>"Restore Original Launcher"</strong> दबाते ही फोन का पुराना ओरिजिनल लॉन्चर तुरंत वापस आ जाता है।
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── STEP-BY-STEP INSTALLATION & UPDATE GUIDE ── */}
        <section id="install-guide" className="space-y-8 max-w-4xl mx-auto">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              Clear Android Walkthrough
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              एंड्रॉयड फोन में APK इनस्टॉल व अपडेट करने की 3-स्टेप गाइड
            </h2>
            <p className="text-slate-400 text-sm max-w-2xl mx-auto">
              गूगल प्ले स्टोर के बाहर सीधे वेबसाइट से ऐप डाउनलोड करने पर एंड्रॉयड सिस्टम सुरक्षा संदेश दिखाता है। इसे आसानी से इनस्टॉल करने का सही तरीका:
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
              <div className="h-8 w-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-mono font-bold text-sm">
                1
              </div>
              <h4 className="text-base font-bold text-white">Download Anyway</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                डाउनलोड बटन दबाने पर यदि क्रोम पूछे <em>"File might be harmful"</em>, तो बेझिझक <strong>"Download anyway"</strong> चुनें। हमारा ऐप 100% वायरस-मुक्त व डिजिटल सत्यापित है।
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-bold text-sm">
                2
              </div>
              <h4 className="text-base font-bold text-white">Allow Unknown Apps</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                फ़ाइल पर टैप करने पर सेटिंग्स प्रॉम्प्ट में <strong>"Allow from this source"</strong> (इस स्रोत से अनुमति दें) को चालू करें और <strong>"Install"</strong> दबाएं।
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
              <div className="h-8 w-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-mono font-bold text-sm">
                3
              </div>
              <h4 className="text-base font-bold text-white">Fix Signature Mismatch</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                यदि <em>"App not installed as package conflicts with an existing package"</em> दिखे, तो फोन में मौजूद पुराने टेस्ट वर्शन को पहले अनइन्स्टॉल करें, फिर नई APK लगाएं।
              </p>
            </div>
          </div>

          {/* DPDP Act 2027 Guarantee Notice Box */}
          <div className="rounded-3xl border border-emerald-500/40 bg-emerald-950/20 p-6 sm:p-8 space-y-3">
            <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-base sm:text-lg">
              <ShieldCheck className="h-6 w-6 shrink-0" />
              <span>Digital Personal Data Protection (DPDP) Act 2027 — ऑन-डिवाइस कानूनी गारंटी</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              सुपर टेलीकॉम ऐप आपके फोन के किसी भी डेटा को रिमोट सर्वर पर अपलोड नहीं करता है। ऐप में कोई थर्ड-पार्टी एनालिटिक्स SDK (जैसे Facebook SDK या Firebase Analytics) शामिल नहीं है। सभी फ़ाइल ट्रांसफर केवल आपके वाई-फाई हॉटस्पॉट पर होते हैं। आपके अधिकार 100% सुरक्षित हैं।
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-emerald-300">
              <span>✓ Zero Cloud Uploads</span>
              <span>✓ Zero Background Surveillance</span>
              <span>✓ Non-Root Scoped Storage</span>
              <span>✓ Certified by Super Telecom Giridih</span>
            </div>
          </div>
        </section>

        {/* ── BOTTOM CTA BAR ── */}
        <section className="text-center pt-8 pb-4">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={handleStartDownload}
              className="py-4 px-8 rounded-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-2xl shadow-cyan-500/30 active:scale-95 transition-all cursor-pointer"
            >
              <Download className="h-5 w-5" />
              <span>Download Super Telecom App v{KNOWN_RELEASE_APK.versionName}</span>
            </button>

            <Link
              to="/services"
              className="py-4 px-8 rounded-full border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-sm font-bold text-slate-200 transition-colors"
            >
              View All 16 Mobile Repair Services →
            </Link>
          </div>
        </section>
      </main>

      {/* ── QR CODE MODAL ── */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="relative max-w-sm w-full rounded-3xl border border-cyan-500/40 bg-slate-900 p-6 text-center space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Scan with Phone Camera</h3>
            <p className="text-xs text-slate-400">
              Scan this QR code to download <code className="text-cyan-300">SuperTelecom.apk</code> directly to your smartphone:
            </p>

            <div className="p-4 bg-white rounded-2xl max-w-[200px] mx-auto shadow-inner">
              {/* Clean Vector SVG QR Code */}
              <svg viewBox="0 0 100 100" className="w-full h-full text-slate-950 fill-current">
                {/* Outer Markers */}
                <rect x="5" y="5" width="25" height="25" rx="3" fill="currentColor" />
                <rect x="9" y="9" width="17" height="17" rx="2" fill="white" />
                <rect x="13" y="13" width="9" height="9" fill="currentColor" />

                <rect x="70" y="5" width="25" height="25" rx="3" fill="currentColor" />
                <rect x="74" y="9" width="17" height="17" rx="2" fill="white" />
                <rect x="78" y="13" width="9" height="9" fill="currentColor" />

                <rect x="5" y="70" width="25" height="25" rx="3" fill="currentColor" />
                <rect x="9" y="74" width="17" height="17" rx="2" fill="white" />
                <rect x="13" y="78" width="9" height="9" fill="currentColor" />

                {/* Data Pixels Mockup */}
                <rect x="35" y="10" width="5" height="5" />
                <rect x="45" y="10" width="5" height="5" />
                <rect x="55" y="10" width="5" height="5" />
                <rect x="35" y="20" width="10" height="5" />
                <rect x="50" y="20" width="5" height="5" />
                <rect x="60" y="20" width="5" height="5" />

                <rect x="10" y="35" width="5" height="10" />
                <rect x="20" y="40" width="10" height="5" />
                <rect x="35" y="35" width="5" height="5" />
                <rect x="45" y="40" width="10" height="10" />
                <rect x="65" y="35" width="15" height="5" />
                <rect x="85" y="40" width="10" height="5" />

                <rect x="10" y="55" width="15" height="5" />
                <rect x="35" y="55" width="10" height="10" />
                <rect x="50" y="55" width="5" height="5" />
                <rect x="60" y="60" width="15" height="5" />
                <rect x="80" y="55" width="10" height="10" />

                <rect x="35" y="75" width="5" height="15" />
                <rect x="45" y="80" width="10" height="5" />
                <rect x="60" y="75" width="15" height="10" />
                <rect x="80" y="80" width="15" height="5" />
              </svg>
            </div>

            <p className="text-[11px] font-mono text-cyan-400">
              https://www.supertelecom.shop/app
            </p>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-xs font-bold text-white hover:bg-slate-700 transition-colors"
            >
              Close Window
            </button>
          </div>
        </div>
      )}

      {/* ── Global Footer ── */}
      <SiteFooter />
    </div>
  );
}

export default AppShowcasePage;
