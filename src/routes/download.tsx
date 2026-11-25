import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Download,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowLeftRight,
  RotateCcw,
  LayoutGrid,
  Phone,
  MessageCircle,
  Copy,
  Check,
} from "lucide-react";
import { SITE_URL } from "@/data/site";
import { BUSINESS_MASTER } from "@/config/superTelecomConfig";
import { KNOWN_RELEASE_APK } from "@/utils/apkDownloadManager";
import { safeVibrate } from "@/utils/safeVibrate";
import { Header } from "@/components/Header";
import { SiteFooter } from "@/components/SiteFooter";

const SEO_TITLE = `Download Super Telecom Android App (v${KNOWN_RELEASE_APK.versionName}) — Super Transfer, Super Recover & Super Launcher | Official APK`;
const SEO_DESC = `Official direct download page for Super Telecom Native Android App v${KNOWN_RELEASE_APK.versionName}. 100% free, zero ads, DPDP privacy-safe: Wi-Fi Direct P2P Transfer, Forensic Photo Recovery, and Clean Launcher.`;

type EngineTab = "recover" | "transfer" | "launcher";

const ENGINES: Record<EngineTab, { title: string; hindi: string; summary: string; bullets: string[] }> = {
  recover: {
    title: "Super Recover Engine",
    hindi: "डिलीट फोटो व फाइल रिकवरी",
    summary: "Scans unlinked media, .nomedia folders, thumbnail caches, and system trash on-device without uploading personal files.",
    bullets: [
      "Filters out active gallery photos — surfaces recoverable & hidden items",
      "Scoped Storage & All-Files recovery into DCIM/SuperTelecom_Recovered",
      "100% local processing on your phone CPU with zero cloud tracking",
    ],
  },
  transfer: {
    title: "Super Transfer (Wi-Fi Direct P2P)",
    hindi: "बिना इंटरनेट तेज़ फाइल ट्रांसफर",
    summary: "Offline high-speed peer-to-peer file sharing between phones using 64KB bounded buffers and QR / PIN pairing.",
    bullets: [
      "Supports large 4K videos, APK installers, documents & photos",
      "Client-side SHA-256 verification for lossless delivery",
      "Zero mobile data required — works in Giridih & rural networks",
    ],
  },
  launcher: {
    title: "Super Launcher (4 Clean Modes)",
    hindi: "सरल और सुरक्षित होम स्क्रीन",
    summary: "Decluttered bilingual Android home experience with 4 instant layouts and 1-tap restore back to your original launcher.",
    bullets: [
      "Super Minimal, iOS-Inspired, Pixel Clean & Classic Seniors modes",
      "Built-in 1-tap 'Restore Original Launcher' safety switch",
      "Zero ads, zero bloatware notifications",
    ],
  },
};

export const Route = createFileRoute("/download")({
  head: () => ({
    meta: [
      { title: SEO_TITLE },
      { name: "description", content: SEO_DESC },
      { property: "og:title", content: SEO_TITLE },
      { property: "og:description", content: SEO_DESC },
      { property: "og:url", content: `${SITE_URL}/download` },
      { property: "og:image", content: `${SITE_URL}/og-image.png` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/download` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Super Telecom Android App",
          operatingSystem: "Android 7.0 and up (SDK 34)",
          applicationCategory: "UtilitiesApplication",
          offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
          downloadUrl: `${SITE_URL}${KNOWN_RELEASE_APK.downloadUrl}`,
          fileSize: KNOWN_RELEASE_APK.fileSizeHuman,
          softwareVersion: KNOWN_RELEASE_APK.versionName,
          description: SEO_DESC,
        }),
      },
    ],
  }),
  component: CanonicalDownloadPage,
});

function CanonicalDownloadPage() {
  const [activeTab, setActiveTab] = useState<EngineTab>("recover");
  const [copiedSha, setCopiedSha] = useState(false);

  const handleCopySha = () => {
    navigator.clipboard?.writeText(KNOWN_RELEASE_APK.sha256).catch(() => {});
    setCopiedSha(true);
    setTimeout(() => setCopiedSha(false), 2000);
  };

  const activeEngine = ENGINES[activeTab];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-10 sm:py-14 space-y-8">
        {/* Primary Download Card */}
        <section className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-cyan-500/30 space-y-5 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold uppercase">
                <Smartphone className="w-3.5 h-3.5" />
                Official Native APK v{KNOWN_RELEASE_APK.versionName}
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-white font-display">
                Super Telecom Official Android App
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                100% मुफ्त और विज्ञापन-मुक्त नेटिव Android APK ({KNOWN_RELEASE_APK.fileSizeHuman}) — Super Recover, Super Transfer और Super Launcher एक ही हल्के ऐप में।
              </p>
            </div>

            <a
              href={KNOWN_RELEASE_APK.downloadUrl}
              download={KNOWN_RELEASE_APK.downloadFilename}
              onClick={() => safeVibrate([30, 20, 40])}
              className="shrink-0 py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-cyan-500/30 active:scale-95 transition-all"
            >
              <Download className="w-5 h-5 stroke-[2.5]" />
              <span>Download APK ({KNOWN_RELEASE_APK.fileSizeHuman})</span>
            </a>
          </div>

          {/* Interactive 3-Engine Feature Preview */}
          <div className="pt-4 border-t border-slate-800 space-y-4">
            <div className="flex flex-wrap gap-2">
              {(
                [
                  { id: "recover", label: "Super Recover", Icon: RotateCcw },
                  { id: "transfer", label: "Super Transfer", Icon: ArrowLeftRight },
                  { id: "launcher", label: "Super Launcher", Icon: LayoutGrid },
                ] as const
              ).map(({ id, label, Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === id
                      ? "bg-cyan-500 text-slate-950 shadow-md"
                      : "bg-slate-950 border border-slate-800 text-slate-300 hover:border-cyan-500/40"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">{activeEngine.title}</h2>
                <span className="text-xs font-mono text-cyan-400">{activeEngine.hindi}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{activeEngine.summary}</p>
              <ul className="space-y-1.5 text-xs text-slate-200">
                {activeEngine.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Verification Metadata & Install Guide */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Verified Release Info
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-slate-400">
                <span>Package ID:</span>
                <span className="font-mono text-cyan-300">{KNOWN_RELEASE_APK.packageId}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Version:</span>
                <span className="font-mono text-emerald-400">v{KNOWN_RELEASE_APK.versionName} (Build {KNOWN_RELEASE_APK.versionCode})</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Size / Target:</span>
                <span className="font-mono text-white">{KNOWN_RELEASE_APK.fileSizeHuman} • Android 7+</span>
              </div>
              <div className="pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span>SHA-256 Checksum:</span>
                  <button type="button" onClick={handleCopySha} className="text-cyan-400 hover:underline inline-flex items-center gap-1">
                    {copiedSha ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSha ? "Copied" : "Copy"}</span>
                  </button>
                </div>
                <code className="block break-all text-[10px] font-mono text-slate-300 bg-slate-950 p-2 rounded-lg border border-slate-800">
                  {KNOWN_RELEASE_APK.sha256}
                </code>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3 text-xs">
            <h3 className="font-bold text-sm text-amber-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" /> इंस्टॉल कैसे करें (Install Instructions):
            </h3>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-300 leading-relaxed">
              <li>यदि पहले से पुराना वर्शन इंस्टॉल है, तो सिग्नेचर मैच के लिए पहले पुराना ऐप अनइंस्टॉल करें।</li>
              <li>डाउनलोड पूरा होने पर <code>SuperTelecom-Release.apk</code> पर टैप करें।</li>
              <li>मांगे जाने पर Chrome/Files को “Install unknown apps” की अनुमति दें।</li>
            </ol>
            <div className="pt-2 flex flex-wrap gap-2">
              <a
                href={`tel:${BUSINESS_MASTER.phoneRaw}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold"
              >
                <Phone className="w-3.5 h-3.5 text-cyan-400" /> {BUSINESS_MASTER.phoneDisplay}
              </a>
              <a
                href={`https://wa.me/${BUSINESS_MASTER.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-semibold"
              >
                <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Help
              </a>
              <Link to="/" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-cyan-400 hover:underline font-semibold">
                Back to Giridih Lab &rarr;
              </Link>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

export default CanonicalDownloadPage;
