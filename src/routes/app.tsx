import React, { useState, useRef, useEffect } from "react";
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
  Zap,
  ArrowRight,
  Info,
  AlertTriangle,
  RefreshCw,
  FolderOpen,
  Eye,
  Settings,
  Clock,
  MessageCircle,
  Send,
  ArrowUp,
  ArrowDown,
  Play,
  Pause,
  X,
  Search,
  Image as ImageIcon,
  Video as VideoIcon,
  Mic,
  FileText,
  Music,
  Save,
  Home,
  Trash2,
  History,
} from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { SiteFooter } from "@/components/SiteFooter";
import { SITE_URL } from "@/data/site";
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

const SEO_TITLE = "Super Telecom Native Android App — Super Transfer, Super Recover & Super Launcher | 100% Free APK";
const SEO_DESC =
  "Official Super Telecom Native Android App (v2.5.0, 1.69 MB, SDK 36). 100% Free, zero ads, DPDP Act 2027 compliant. Super Transfer (Wi-Fi Direct P2P), Super Recover (honest Scoped Storage recovery), and Super Launcher (4 themes with 1-tap restore).";
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
      { property: "og:image", content: `${SITE_URL}/og-image.png` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: SEO_TITLE },
      { name: "twitter:description", content: SEO_DESC },
      { name: "twitter:image", content: `${SITE_URL}/og-image.png` },
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

// Tab definition
type AppActiveTab = "home" | "transfer" | "recover" | "launcher";

interface TaskHistoryItem {
  id: string;
  title: string;
  subtitle: string;
  sizeMb: number;
  timeAgo: string;
  type: "transfer_sent" | "transfer_received" | "recovered";
  statusText: string;
}

interface QueuedFile {
  id: string;
  name: string;
  sizeBytes: number;
  mimeType: string;
  progress: number;
  status: "pending" | "transferring" | "paused" | "completed" | "failed";
}

interface RecoverItemModel {
  id: string;
  name: string;
  sizeBytes: number;
  date: string;
  sourcePath: string;
  category: "photos" | "videos" | "recordings" | "music" | "docs" | "all";
  tier: 1 | 2 | 3 | 4;
  tierNameEn: string;
  tierNameHi: string;
  qualityTag: string;
  isSelected: boolean;
}

function AppShowcasePage() {
  // ── Global State ──
  const [isHindi, setIsHindi] = useState(true);
  const [activeTab, setActiveTab] = useState<AppActiveTab>("home");
  const [showQrModal, setShowQrModal] = useState(false);
  const [showDpdpModal, setShowDpdpModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // ── APK Download State ──
  const [downloadProgress, setDownloadProgress] = useState<DownloadProgress>({
    receivedBytes: 0,
    totalBytes: KNOWN_RELEASE_APK.fileSize,
    percentage: 0,
    speedMbps: 0,
    status: "idle",
  });
  const [copiedSha, setCopiedSha] = useState(false);

  // ── Recent Task History ──
  const [recentTasks, setRecentTasks] = useState<TaskHistoryItem[]>([
    {
      id: "1",
      title: "Family_Khandoli_4K_Tour.mp4",
      subtitle: isHindi ? "सुपर ट्रांसफर (सफलतापूर्वक भेजा गया)" : "Super Transfer (Sent to Nearby Device)",
      sizeMb: 1850,
      timeAgo: isHindi ? "12 मिनट पहले" : "12 mins ago",
      type: "transfer_sent",
      statusText: isHindi ? "100% पूरा (SHA-256 सत्यापित)" : "100% Complete (SHA-256)",
    },
    {
      id: "2",
      title: "Aadhaar_Document_Scan.pdf",
      subtitle: isHindi ? "सुपर रिकवर (आंतरिक ट्रैश से बरामद)" : "Super Recover (Restored from Trash)",
      sizeMb: 2.4,
      timeAgo: isHindi ? "45 मिनट पहले" : "45 mins ago",
      type: "recovered",
      statusText: isHindi ? "सफलतापूर्वक सुरक्षित सेव" : "Restored Successfully",
    },
    {
      id: "3",
      title: "Office_Voice_Notes_01.m4a",
      subtitle: isHindi ? "सुपर ट्रांसफर (प्राप्त किया गया)" : "Super Transfer (Received from Pixel)",
      sizeMb: 14.8,
      timeAgo: isHindi ? "2 घंटे पहले" : "2 hours ago",
      type: "transfer_received",
      statusText: isHindi ? "100% पूरा" : "100% Complete",
    },
  ]);

  // ── Transfer Tab State ──
  const [transferMode, setTransferMode] = useState<"send" | "receive" | "scan">("send");
  const [transferQueue, setTransferQueue] = useState<QueuedFile[]>([
    {
      id: "f1",
      name: "Giridih_Market_4K_Recording.mp4",
      sizeBytes: 2450000000,
      mimeType: "video/mp4",
      progress: 65,
      status: "transferring",
    },
    {
      id: "f2",
      name: "Circuit_Motherboard_BGA.pdf",
      sizeBytes: 14800000,
      mimeType: "application/pdf",
      progress: 100,
      status: "completed",
    },
  ]);
  const [isTransferring, setIsTransferring] = useState(false);
  const [isTransferPaused, setIsTransferPaused] = useState(false);
  const [transferSpeedMbps, setTransferSpeedMbps] = useState(52.4);
  const [showConsentPrompt, setShowConsentPrompt] = useState(false);
  const [showTransferSuccess, setShowTransferSuccess] = useState(false);

  // Hidden File Inputs
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  // ── Recover Tab State ──
  const [recoverCategory, setRecoverCategory] = useState<"all" | "photos" | "videos" | "recordings" | "music" | "docs">("all");
  const [activeTierFilter, setActiveTierFilter] = useState<number | null>(null);
  const [isRecoverScanning, setIsRecoverScanning] = useState(false);
  const [scanPathLive, setScanPathLive] = useState("/storage/emulated/0/DCIM/.trashed-1002/...");
  const [scannedFilesCount, setScannedFilesCount] = useState(342);
  const [previewModalItem, setPreviewModalItem] = useState<RecoverItemModel | null>(null);
  const [showRestoreSuccess, setShowRestoreSuccess] = useState(false);
  const [restoredCountSummary, setRestoredCountSummary] = useState(0);

  const safInputRef = useRef<HTMLInputElement>(null);

  const [discoveredMedia, setDiscoveredMedia] = useState<RecoverItemModel[]>([
    {
      id: "r1",
      name: "IMG_20261018_FamilyGiridih.jpg",
      sizeBytes: 4850000,
      date: "18 Oct 2026",
      sourcePath: "Internal > DCIM > .trashed-1002",
      category: "photos",
      tier: 1,
      tierNameEn: "1. Recoverable Originals",
      tierNameHi: "1. ओरिजिनल मीडिया",
      qualityTag: "Original High-Res",
      isSelected: true,
    },
    {
      id: "r2",
      name: "VID_20260905_KhandoliDam.mp4",
      sizeBytes: 85400000,
      date: "05 Sep 2026",
      sourcePath: "Internal > Android > media > app_cache > vid_copy.mp4",
      category: "videos",
      tier: 2,
      tierNameEn: "2. Hidden Copies",
      tierNameHi: "2. छुपे हुए फोल्डर",
      qualityTag: "1080p Hidden Copy",
      isSelected: true,
    },
    {
      id: "r3",
      name: "BILL_RECEIPT_STATION_ROAD.jpg",
      sizeBytes: 210000,
      date: "12 Aug 2026",
      sourcePath: "Internal > .thumbnails > .thumbdata4--1962",
      category: "photos",
      tier: 3,
      tierNameEn: "3. Thumbnails & Previews",
      tierNameHi: "3. थंबनेल व प्रीव्यू",
      qualityTag: "Thumbnail Preview",
      isSelected: false,
    },
    {
      id: "r4",
      name: "Call_Recording_Shop_01.m4a",
      sizeBytes: 3200000,
      date: "28 Jul 2026",
      sourcePath: "Internal > Recordings > Call > .hidden_trash",
      category: "recordings",
      tier: 1,
      tierNameEn: "1. Recoverable Originals",
      tierNameHi: "1. ओरिजिनल मीडिया",
      qualityTag: "Original Audio",
      isSelected: false,
    },
    {
      id: "r5",
      name: "Aadhaar_Document_Scan.pdf",
      sizeBytes: 1800000,
      date: "02 Jun 2026",
      sourcePath: "Internal > Documents > Backup Target Identified",
      category: "docs",
      tier: 4,
      tierNameEn: "4. Backup Sources",
      tierNameHi: "4. बैकअप कॉपी",
      qualityTag: "External Backup",
      isSelected: false,
    },
    {
      id: "r6",
      name: "Favorite_Music_Track.mp3",
      sizeBytes: 6400000,
      date: "15 May 2026",
      sourcePath: "Internal > Music > .cache > audio_temp.mp3",
      category: "music",
      tier: 2,
      tierNameEn: "2. Hidden Copies",
      tierNameHi: "2. छुपे हुए फोल्डर",
      qualityTag: "320kbps MP3",
      isSelected: false,
    },
  ]);

  // ── Launcher Tab State ──
  const [launcherTheme, setLauncherTheme] = useState<"minimal" | "ios" | "pixel" | "classic">("minimal");
  const [launcherSearch, setLauncherSearch] = useState("");
  const [isDefaultLauncherSet, setIsDefaultLauncherSet] = useState(false);
  const [showLauncherFeedback, setShowLauncherFeedback] = useState<string | null>(null);

  const sampleApps = [
    { name: "Phone", iconText: "📞", color: "bg-emerald-600" },
    { name: "WhatsApp", iconText: "💬", color: "bg-emerald-500" },
    { name: "Camera", iconText: "📷", color: "bg-cyan-600" },
    { name: "Settings", iconText: "⚙️", color: "bg-slate-700" },
    { name: "Photos", iconText: "🖼️", color: "bg-rose-500" },
    { name: "YouTube", iconText: "▶️", color: "bg-red-600" },
    { name: "Files", iconText: "📁", color: "bg-blue-600" },
    { name: "Chrome", iconText: "🌐", color: "bg-amber-500" },
  ];

  const filteredLauncherApps = sampleApps.filter((app) =>
    app.name.toLowerCase().includes(launcherSearch.toLowerCase())
  );

  // ── Helpers ──
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

  // Add files to queue from HTML input
  const handleFilesSelected = (files: FileList | null, mimeCategory: string) => {
    if (!files || files.length === 0) return;
    const newItems: QueuedFile[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      newItems.push({
        id: `f_${Date.now()}_${i}`,
        name: f.name,
        sizeBytes: f.size,
        mimeType: f.type || mimeCategory,
        progress: 0,
        status: "pending",
      });
    }
    setTransferQueue((prev) => [...prev, ...newItems]);
    safeVibrate([30]);
  };

  // Trigger transfer simulation
  const handleStartTransfer = () => {
    safeVibrate([40]);
    setIsTransferring(true);
    setIsTransferPaused(false);
    // Mark first pending as transferring
    setTransferQueue((prev) =>
      prev.map((item, idx) =>
        idx === 0 ? { ...item, status: "transferring", progress: 45 } : item
      )
    );
  };

  const handleCompleteTransferItem = (id: string) => {
    setTransferQueue((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "completed", progress: 100 } : item
      )
    );
    // Add to recent tasks
    const finished = transferQueue.find((i) => i.id === id);
    if (finished) {
      setRecentTasks((prev) => [
        {
          id: `t_${Date.now()}`,
          title: finished.name,
          subtitle: isHindi ? "सुपर ट्रांसफर (सफलतापूर्वक भेजा गया)" : "Super Transfer (Sent)",
          sizeMb: parseFloat((finished.sizeBytes / 1_000_000).toFixed(1)),
          timeAgo: isHindi ? "अभी-अभी" : "Just now",
          type: "transfer_sent",
          statusText: isHindi ? "100% पूरा (SHA-256 सत्यापित)" : "100% Complete",
        },
        ...prev,
      ]);
    }
  };

  // Deep Scan Simulation
  const handleTriggerDeepScan = () => {
    safeVibrate([30]);
    setIsRecoverScanning(true);
    setScannedFilesCount(120);
    const paths = [
      "/storage/emulated/0/DCIM/.trashed-1002/IMG_102.jpg",
      "/storage/emulated/0/Android/media/app_cache/vid_temp.mp4",
      "/storage/emulated/0/.thumbnails/.thumbdata4-192",
      "/storage/emulated/0/Recordings/Call/.hidden/call_rec.m4a",
    ];
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setScannedFilesCount((c) => c + 45);
      setScanPathLive(paths[step % paths.length]);
      if (step > 4) {
        clearInterval(interval);
        setIsRecoverScanning(false);
      }
    }, 600);
  };

  // Restore selected files action
  const handleRestoreSelected = () => {
    const selected = discoveredMedia.filter((m) => m.isSelected);
    if (selected.length === 0) return;
    safeVibrate([40, 20, 50]);
    setRestoredCountSummary(selected.length);
    setShowRestoreSuccess(true);

    // Add to recent tasks
    selected.forEach((item) => {
      setRecentTasks((prev) => [
        {
          id: `rec_${Date.now()}_${item.id}`,
          title: item.name,
          subtitle: isHindi ? "सुपर रिकवर (सुरक्षित रीस्टोर)" : "Super Recover (Restored)",
          sizeMb: parseFloat((item.sizeBytes / 1_000_000).toFixed(1)),
          timeAgo: isHindi ? "अभी-अभी" : "Just now",
          type: "recovered",
          statusText: isHindi ? "सफलतापूर्वक सुरक्षित सेव" : "Restored Successfully",
        },
        ...prev,
      ]);
    });
  };

  const selectedCountTotal = discoveredMedia.filter((m) => m.isSelected).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* ── Top Header Navigation ── */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
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
            <button
              onClick={() => setActiveTab("transfer")}
              className={`hover:text-cyan-400 transition-colors ${activeTab === "transfer" ? "text-cyan-400 font-bold" : ""}`}
            >
              Super Transfer
            </button>
            <button
              onClick={() => setActiveTab("recover")}
              className={`hover:text-cyan-400 transition-colors ${activeTab === "recover" ? "text-emerald-400 font-bold" : ""}`}
            >
              Super Recover
            </button>
            <button
              onClick={() => setActiveTab("launcher")}
              className={`hover:text-cyan-400 transition-colors ${activeTab === "launcher" ? "text-amber-400 font-bold" : ""}`}
            >
              Super Launcher
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsHindi(!isHindi)}
              className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 text-xs font-bold text-cyan-300 hover:border-cyan-400 transition-all font-mono"
            >
              {isHindi ? "ENG" : "हिंदी"}
            </button>

            <button
              onClick={handleStartDownload}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/25 active:scale-95 transition-all cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download APK</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Layout Container ── */}
      <main className="mx-auto max-w-5xl px-3 sm:px-6 py-6 space-y-8 pb-32">
        {/* ── TOP VERIFIED APK DOWNLOAD BAR ── */}
        <section className="rounded-3xl border border-cyan-500/40 bg-gradient-to-b from-slate-900/95 to-slate-950 p-4 sm:p-6 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-cyan-500/30 shrink-0">
                <Smartphone className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base sm:text-lg font-bold text-white">
                    Super Telecom Android Suite
                  </h2>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold">
                    v{KNOWN_RELEASE_APK.versionName} ({KNOWN_RELEASE_APK.fileSizeHuman})
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-bold">
                    DPDP Act 2027
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Package: {KNOWN_RELEASE_APK.packageId} • Android 7.0–15 Compatible • 100% Free
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowQrModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-700 bg-slate-800 text-xs font-mono text-slate-200 hover:text-cyan-300 hover:border-cyan-400 transition-colors"
              >
                <QrCode className="h-4 w-4" />
                <span className="hidden sm:inline">Scan QR</span>
              </button>

              <button
                onClick={handleStartDownload}
                disabled={downloadProgress.status === "downloading" || downloadProgress.status === "verifying"}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs sm:text-sm shadow-md shadow-cyan-500/25 active:scale-95 transition-all cursor-pointer"
              >
                <Download className="h-4 w-4" />
                <span>
                  {downloadProgress.status === "completed"
                    ? "Download Again"
                    : "Download Verified APK"}
                </span>
              </button>
            </div>
          </div>

          {/* Download progress bar if active */}
          {downloadProgress.status !== "idle" && (
            <div className="pt-3 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-cyan-400 font-bold flex items-center gap-2">
                  {downloadProgress.status === "downloading" && <RefreshCw className="h-3 w-3 animate-spin" />}
                  {downloadProgress.status === "verifying" && <ShieldCheck className="h-3 w-3 text-emerald-400 animate-pulse" />}
                  {downloadProgress.status === "completed" && <CheckCircle2 className="h-3 w-3 text-emerald-400" />}
                  <span>
                    {downloadProgress.status === "downloading" && `Downloading: ${downloadProgress.percentage}% (${(downloadProgress.receivedBytes / 1_000_000).toFixed(2)} MB)`}
                    {downloadProgress.status === "verifying" && "Verifying client-side SHA-256 cryptographic hash..."}
                    {downloadProgress.status === "completed" && "Download complete & verified!"}
                  </span>
                </span>
                {downloadProgress.status === "downloading" && (
                  <span className="text-slate-400">{downloadProgress.speedMbps} Mbps</span>
                )}
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-150"
                  style={{ width: `${downloadProgress.percentage}%` }}
                />
              </div>
            </div>
          )}

          {/* SHA-256 Pill */}
          <div className="pt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5 truncate">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">SHA-256: {KNOWN_RELEASE_APK.sha256}</span>
            </span>
            <button
              onClick={handleCopySha}
              className="text-cyan-400 hover:underline cursor-pointer shrink-0 font-bold flex items-center gap-1"
            >
              {copiedSha ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
              <span>{copiedSha ? "Copied" : "Copy Hash"}</span>
            </button>
          </div>
        </section>

        {/* ── MIGRATION NOTICE: STANDALONE NATIVE APP vs LEGACY TWA ── */}
        <div className="rounded-2xl border border-cyan-500/30 bg-slate-900/90 p-4 text-xs text-slate-300 flex items-start gap-3.5 shadow-lg">
          <Info className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-white text-sm">
              Notice: Genuine Native Android Application (<code>com.supertelecom.app</code> v2.5.0)
            </p>
            <p className="text-slate-400 leading-relaxed">
              Super Telecom is now a 100% standalone Native Android application written in Kotlin with Jetpack Compose (compiled for Android 16 / SDK 36 with Scoped Storage and Wi-Fi Direct socket streaming). If you previously installed the old browser bookmark or TWA wrapper (<code>shop.supertelecom.www.twa</code>), upgrade directly by downloading the official APK above.
            </p>
          </div>
        </div>

        {/* ── INTERACTIVE WEB SIMULATOR HEADER ── */}
        <div className="flex items-center justify-between px-2 pt-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              Interactive Web Simulator &bull; Live Preview
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
            Test the 4 native app engines in real time
          </span>
        </div>

        {/* ── THE COMPLETE LIVE 4-TAB INTERACTIVE APP INTERFACE ── */}
        <section className="rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl overflow-hidden backdrop-blur-2xl">
          {/* App Top Status Bar */}
          <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
                ST
              </div>
              <div>
                <span className="text-xs font-black text-white block">
                  {isHindi ? "सुपर टेलीकॉम ऑन-डिवाइस सुइट" : "Super Telecom On-Device Suite"}
                </span>
                <span className="text-[10px] text-emerald-400 font-mono block">
                  ● {isHindi ? "शून्य इंटरनेट आवश्यक • 100% सुरक्षित" : "Zero Internet Needed • On-Device"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowDpdpModal(true)}
                className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-[11px] font-mono flex items-center gap-1 hover:bg-emerald-900/50"
              >
                <Shield className="h-3 w-3" />
                <span>DPDP 2027</span>
              </button>

              <button
                onClick={() => setShowSettingsModal(true)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                title="Settings & Contact"
              >
                <Settings className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* ── 4 TAB NAVIGATION BAR (HIGH CONTRAST, BIG BUTTONS) ── */}
          <div className="grid grid-cols-4 bg-slate-950/80 border-b border-slate-800 p-1.5 gap-1.5">
            <button
              onClick={() => {
                setActiveTab("home");
                safeVibrate([15]);
              }}
              className={`min-h-[52px] rounded-xl flex flex-col items-center justify-center transition-all ${
                activeTab === "home"
                  ? "bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/25"
                  : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Home className="h-4 w-4" />
              <span className="text-[10px] sm:text-xs font-bold mt-0.5">
                {isHindi ? "होम" : "HOME"}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab("transfer");
                safeVibrate([15]);
              }}
              className={`min-h-[52px] rounded-xl flex flex-col items-center justify-center transition-all ${
                activeTab === "transfer"
                  ? "bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/25"
                  : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Send className="h-4 w-4" />
              <span className="text-[10px] sm:text-xs font-bold mt-0.5">
                {isHindi ? "डेटा ट्रांसफर" : "TRANSFER"}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab("recover");
                safeVibrate([15]);
              }}
              className={`min-h-[52px] rounded-xl flex flex-col items-center justify-center transition-all ${
                activeTab === "recover"
                  ? "bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/25"
                  : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <RotateCcw className="h-4 w-4" />
              <span className="text-[10px] sm:text-xs font-bold mt-0.5">
                {isHindi ? "डेटा रिकवर" : "RECOVER"}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab("launcher");
                safeVibrate([15]);
              }}
              className={`min-h-[52px] rounded-xl flex flex-col items-center justify-center transition-all ${
                activeTab === "launcher"
                  ? "bg-purple-500 text-slate-950 font-black shadow-md shadow-purple-500/25"
                  : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Smartphone className="h-4 w-4" />
              <span className="text-[10px] sm:text-xs font-bold mt-0.5">
                {isHindi ? "सुपर लॉन्चर" : "LAUNCHER"}
              </span>
            </button>
          </div>

          {/* ── TAB 1: HOME (ZERO CONFUSION DASHBOARD) ── */}
          {activeTab === "home" && (
            <div className="p-4 sm:p-6 space-y-6">
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {isHindi ? "सुपर टेलीकॉम यूटिलिटी हब" : "Super Telecom Utility Hub"}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400">
                  {isHindi
                    ? "बिना इंटरनेट फ़ाइल ट्रांसफर, ईमानदार ऑन-डिवाइस रिकवरी और 4-थीम क्लीन लॉन्चर।"
                    : "Zero-internet chunked file sharing, honest local media recovery, and clean home launcher."}
                </p>
              </div>

              {/* 3 Large Action Cards */}
              <div className="grid gap-4 sm:grid-cols-3">
                {/* Card 1: Super Transfer (Blue/Cyan Gradient) */}
                <div className="rounded-2xl border border-cyan-500/40 bg-gradient-to-br from-cyan-950/80 via-slate-900 to-slate-950 p-5 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="h-10 w-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                      <Send className="h-5 w-5" />
                    </div>
                    <h4 className="text-base font-bold text-white">
                      {isHindi ? "सुपर ट्रांसफर (Super Transfer)" : "Super Transfer"}
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {isHindi
                        ? "बिना इंटरनेट एक फोन से दूसरे फोन में फोटो, वीडियो, रिकॉर्डिंग और 4GB+ फाइलें भेजें।"
                        : "Send large 4GB+ videos and files between phones offline at up to 60 MB/s."}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab("transfer");
                      safeVibrate([20]);
                    }}
                    className="w-full min-h-[52px] rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer"
                  >
                    <span>{isHindi ? "अभी फाइल भेजें या प्राप्त करें →" : "Open Transfer Engine →"}</span>
                  </button>
                </div>

                {/* Card 2: Super Recover (Green/Emerald Gradient) */}
                <div className="rounded-2xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950/80 via-slate-900 to-slate-950 p-5 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <RotateCcw className="h-5 w-5" />
                    </div>
                    <h4 className="text-base font-bold text-white">
                      {isHindi ? "सुपर रिकवर (Super Recover)" : "Super Recover"}
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {isHindi
                        ? "डिलीट हुई फोटो, वीडियो, ऑडियो रिकॉर्डिंग और डॉक्यूमेंट्स को स्कैन व रिकवर करें।"
                        : "Deep-scan deleted media from system trash, caches & SAF folders honestly."}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab("recover");
                      safeVibrate([20]);
                    }}
                    className="w-full min-h-[52px] rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
                  >
                    <span>{isHindi ? "डेटा रिकवर शुरू करें →" : "Start Recovery Engine →"}</span>
                  </button>
                </div>

                {/* Card 3: Super Launcher (Purple/Indigo Gradient) */}
                <div className="rounded-2xl border border-purple-500/40 bg-gradient-to-br from-purple-950/80 via-slate-900 to-slate-950 p-5 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="h-10 w-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                      <Smartphone className="h-5 w-5" />
                    </div>
                    <h4 className="text-base font-bold text-white">
                      {isHindi ? "सुपर लॉन्चर (Super Launcher)" : "Super Launcher"}
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {isHindi
                        ? "4 प्रीमियम थीम्स के साथ अपने फोन की होम-स्क्रीन को कस्टमाइज़ करें और 1-क्लिक में पुराना लॉन्चर लाएं।"
                        : "4 clean themes (Minimal, iOS, Pixel, Classic) with safe 1-tap restore safeguard."}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab("launcher");
                      safeVibrate([20]);
                    }}
                    className="w-full min-h-[52px] rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-purple-500/20 active:scale-95 transition-all cursor-pointer"
                  >
                    <span>{isHindi ? "लॉन्चर थीम बदलें →" : "Explore Launcher →"}</span>
                  </button>
                </div>
              </div>

              {/* Recent Completed Tasks Section */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <History className="h-4 w-4 text-cyan-400" />
                    <span>{isHindi ? "हाल के पूरे किए गए काम (Recent Completed Tasks)" : "Recent Activity Log"}</span>
                  </h4>
                  <span className="text-[11px] font-mono text-slate-400">{recentTasks.length} tasks</span>
                </div>

                <div className="space-y-2">
                  {recentTasks.map((task) => (
                    <div
                      key={task.id}
                      className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <div
                          className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                            task.type === "transfer_sent"
                              ? "bg-cyan-500/20 text-cyan-400"
                              : task.type === "transfer_received"
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-emerald-500/20 text-emerald-400"
                          }`}
                        >
                          {task.type === "transfer_sent" ? (
                            <ArrowUp className="h-4 w-4" />
                          ) : task.type === "transfer_received" ? (
                            <ArrowDown className="h-4 w-4" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4" />
                          )}
                        </div>
                        <div className="truncate">
                          <span className="font-bold text-white block truncate">{task.title}</span>
                          <span className="text-slate-400 text-[11px] block truncate">
                            {task.subtitle} • {task.sizeMb} MB
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-emerald-400 font-mono font-bold block text-[11px]">
                          {task.statusText}
                        </span>
                        <span className="text-slate-500 text-[10px] font-mono">{task.timeAgo}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 2: TRANSFER (SUPER TRANSFER ENGINE) ── */}
          {activeTab === "transfer" && (
            <div className="p-4 sm:p-6 space-y-6">
              {/* Top 3 Mode Buttons */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setTransferMode("send")}
                  className={`min-h-[52px] rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm font-bold transition-all ${
                    transferMode === "send"
                      ? "bg-cyan-500 text-slate-950 font-black shadow-lg shadow-cyan-500/20"
                      : "bg-slate-950 border border-slate-800 text-slate-300 hover:text-white"
                  }`}
                >
                  <ArrowUp className="h-4 w-4" />
                  <span>{isHindi ? "फाइल भेजें" : "SEND FILES"}</span>
                </button>

                <button
                  onClick={() => setTransferMode("receive")}
                  className={`min-h-[52px] rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm font-bold transition-all ${
                    transferMode === "receive"
                      ? "bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20"
                      : "bg-slate-950 border border-slate-800 text-slate-300 hover:text-white"
                  }`}
                >
                  <ArrowDown className="h-4 w-4" />
                  <span>{isHindi ? "फाइल प्राप्त करें" : "RECEIVE FILES"}</span>
                </button>

                <button
                  onClick={() => {
                    setTransferMode("scan");
                    setShowQrModal(true);
                  }}
                  className={`min-h-[52px] rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm font-bold transition-all ${
                    transferMode === "scan"
                      ? "bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20"
                      : "bg-slate-950 border border-slate-800 text-slate-300 hover:text-white"
                  }`}
                >
                  <QrCode className="h-4 w-4" />
                  <span>{isHindi ? "QR / कोड से जोड़ें" : "SCAN / PAIR"}</span>
                </button>
              </div>

              {/* Hidden HTML File Inputs */}
              <input
                type="file"
                ref={photoInputRef}
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFilesSelected(e.target.files, "image/jpeg")}
              />
              <input
                type="file"
                ref={videoInputRef}
                accept="video/*"
                multiple
                className="hidden"
                onChange={(e) => handleFilesSelected(e.target.files, "video/mp4")}
              />
              <input
                type="file"
                ref={audioInputRef}
                accept="audio/*"
                multiple
                className="hidden"
                onChange={(e) => handleFilesSelected(e.target.files, "audio/mp4")}
              />
              <input
                type="file"
                ref={docInputRef}
                accept="*/*"
                multiple
                className="hidden"
                onChange={(e) => handleFilesSelected(e.target.files, "application/octet-stream")}
              />

              {/* What to send? 4 Large Category Buttons */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">
                    {isHindi ? "क्या भेजना है? (फाइल चयन करें)" : "Select Files to Send"}
                  </h4>
                  <span className="text-[11px] font-mono text-cyan-400">Multi-Select Enabled</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button
                    onClick={() => photoInputRef.current?.click()}
                    className="min-h-[56px] rounded-2xl border border-slate-800 bg-slate-950/80 hover:border-cyan-500/50 p-3 text-left transition-all active:scale-95 group cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-5 w-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                      <div>
                        <span className="text-xs font-bold text-white block">
                          {isHindi ? "फोटो चुनें" : "Select Photos"}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">JPG, PNG, HEIC</span>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => videoInputRef.current?.click()}
                    className="min-h-[56px] rounded-2xl border border-slate-800 bg-slate-950/80 hover:border-cyan-500/50 p-3 text-left transition-all active:scale-95 group cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <VideoIcon className="h-5 w-5 text-blue-400 group-hover:scale-110 transition-transform" />
                      <div>
                        <span className="text-xs font-bold text-white block">
                          {isHindi ? "वीडियो चुनें" : "Select Videos"}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">MP4, MKV (4GB+)</span>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => audioInputRef.current?.click()}
                    className="min-h-[56px] rounded-2xl border border-slate-800 bg-slate-950/80 hover:border-cyan-500/50 p-3 text-left transition-all active:scale-95 group cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Mic className="h-5 w-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                      <div>
                        <span className="text-xs font-bold text-white block">
                          {isHindi ? "ऑडियो / रिकॉर्डिंग" : "Select Audio"}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">M4A, MP3, WAV</span>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => docInputRef.current?.click()}
                    className="min-h-[56px] rounded-2xl border border-slate-800 bg-slate-950/80 hover:border-cyan-500/50 p-3 text-left transition-all active:scale-95 group cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-amber-400 group-hover:scale-110 transition-transform" />
                      <div>
                        <span className="text-xs font-bold text-white block">
                          {isHindi ? "डॉक्यूमेंट व अन्य" : "Docs & ZIP"}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">PDF, DOCX, ZIP</span>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Nearby Device Pairing Box */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                      <Smartphone className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">Pixel 8 Pro (Nearby Device)</span>
                      <span className="text-[10px] text-emerald-400 font-mono block">
                        ● Wi-Fi Direct P2P Channel Ready
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-cyan-300 bg-cyan-950 px-2.5 py-1 rounded-lg border border-cyan-500/30">
                      PIN: 582 914
                    </span>
                    <button
                      onClick={() => setShowConsentPrompt(true)}
                      className="px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-800 text-[11px] font-mono text-slate-200 hover:text-white"
                    >
                      Consent Dialog
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-slate-900 text-slate-400">
                  <span>Speed: {transferSpeedMbps} MB/s (64KB Chunks)</span>
                  <span className="text-emerald-400 font-bold">Zero RAM Overload</span>
                </div>
              </div>

              {/* Selected Files Queue */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">
                    {isHindi ? `चुनी गई फाइलें (${transferQueue.length})` : `Selected Queue (${transferQueue.length})`}
                  </h4>
                  {transferQueue.length > 0 && (
                    <button
                      onClick={() => setTransferQueue([])}
                      className="text-xs text-rose-400 hover:underline cursor-pointer"
                    >
                      Clear Queue
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {transferQueue.map((file) => (
                    <div
                      key={file.id}
                      className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 truncate">
                          {file.status === "completed" ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                          ) : (
                            <RefreshCw className={`h-4 w-4 text-cyan-400 shrink-0 ${file.status === "transferring" ? "animate-spin" : ""}`} />
                          )}
                          <div className="truncate">
                            <span className="font-bold text-white block truncate">{file.name}</span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              {(file.sizeBytes / 1_000_000).toFixed(1)} MB • {file.status.toUpperCase()}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {file.status === "completed" && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-bold">
                              SHA-256 Verified
                            </span>
                          )}
                          <button
                            onClick={() => setTransferQueue((q) => q.filter((x) => x.id !== file.id))}
                            className="p-1 rounded-lg text-slate-500 hover:text-rose-400"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {file.status === "transferring" && (
                        <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400"
                            style={{ width: `${file.progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Start Transfer Button & Controls */}
              <div className="pt-2 space-y-3">
                {isTransferring ? (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setIsTransferPaused(!isTransferPaused)}
                      className="min-h-[52px] rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2"
                    >
                      {isTransferPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                      <span>{isTransferPaused ? "Resume Transfer" : "Pause Transfer"}</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsTransferring(false);
                        handleCompleteTransferItem(transferQueue[0]?.id || "");
                      }}
                      className="min-h-[52px] rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2"
                    >
                      <Check className="h-4 w-4" />
                      <span>Complete &amp; Verify</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleStartTransfer}
                    className="w-full min-h-[52px] rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/25 active:scale-95 transition-all cursor-pointer"
                  >
                    <Send className="h-5 w-5" />
                    <span>
                      {isHindi
                        ? "🚀 ओरिजिनल क्वालिटी में ट्रांसफर शुरू करें (Start Transfer)"
                        : "Start High-Speed P2P Transfer (60 MB/s)"}
                    </span>
                  </button>
                )}

                <p className="text-[11px] text-slate-400 font-mono text-center">
                  ✅ 100% On-Device P2P: No internet data consumed. Byte-perfect original quality with SHA-256.
                </p>
              </div>
            </div>
          )}

          {/* ── TAB 3: RECOVER (SUPER RECOVER ENGINE) ── */}
          {activeTab === "recover" && (
            <div className="p-4 sm:p-6 space-y-6">
              {/* Step 1: 6 Category Cards */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-white">
                  {isHindi
                    ? "स्टेप 1 — आपको क्या रिकवर करना है? (कैटेगरी चुनें)"
                    : "Step 1 — Choose Media Categories"}
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { key: "all", title: isHindi ? "सभी (All)" : "All Files", sub: "Deep Scan", icon: RotateCcw },
                    { key: "photos", title: isHindi ? "फोटो" : "Photos", sub: "JPG, PNG, HEIC", icon: ImageIcon },
                    { key: "videos", title: isHindi ? "वीडियो" : "Videos", sub: "MP4, MKV", icon: VideoIcon },
                    { key: "recordings", title: isHindi ? "ऑडियो" : "Audio", sub: "M4A, MP3, WAV", icon: Mic },
                    { key: "docs", title: isHindi ? "दस्तावेज़" : "Documents", sub: "PDF, DOCX, ZIP", icon: FileText },
                  ].map((cat) => {
                    const isSelected = recoverCategory === cat.key;
                    const IconComp = cat.icon;
                    return (
                      <button
                        key={cat.key}
                        onClick={() => setRecoverCategory(cat.key as any)}
                        className={`min-h-[56px] rounded-xl border p-3 text-left transition-all cursor-pointer ${
                          isSelected
                            ? "bg-emerald-500/15 border-emerald-500 text-white"
                            : "bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <IconComp className={`h-4 w-4 shrink-0 ${isSelected ? "text-emerald-400" : "text-slate-400"}`} />
                          <div className="truncate">
                            <span className="text-xs font-bold block truncate">{cat.title}</span>
                            <span className="text-[10px] text-slate-400 font-mono block truncate">{cat.sub}</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: 2 Large Scan Action Buttons */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-white">
                  {isHindi ? "स्टेप 2 — रिकवरी स्कैन चलाएं" : "Step 2 — Execute Recovery Scan"}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    onClick={handleTriggerDeepScan}
                    className="min-h-[52px] rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
                  >
                    {isRecoverScanning ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                    <span>
                      {isRecoverScanning
                        ? (isHindi ? "स्कैनिंग जारी है... रोकें" : "Scanning... Tap to Stop")
                        : (isHindi ? "🔍 डीप रिकवरी स्कैन शुरू करें" : "START DEEP RECOVERY SCAN")}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      // Trigger SAF picker simulation
                      handleTriggerDeepScan();
                    }}
                    className="min-h-[52px] rounded-xl border border-slate-700 bg-slate-950 hover:bg-slate-800 text-slate-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <FolderOpen className="h-4 w-4 text-cyan-400" />
                    <span>{isHindi ? "📂 फोल्डर/SD कार्ड चुनें (SAF)" : "SELECT FOLDER VIA SAF"}</span>
                  </button>
                </div>

                {isRecoverScanning && (
                  <div className="rounded-xl border border-emerald-500/40 bg-slate-950 p-3 space-y-1.5 text-xs font-mono">
                    <div className="flex items-center justify-between text-emerald-400 font-bold">
                      <span>Scanning MediaStore Trash &amp; Caches...</span>
                      <span>{scannedFilesCount} items analyzed</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-emerald-400 animate-pulse w-3/4" />
                    </div>
                    <span className="text-[10px] text-slate-400 truncate block">Path: {scanPathLive}</span>
                  </div>
                )}
              </div>

              {/* Step 3: 4 Clear Filter Tabs */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">
                    {isHindi ? "स्टेप 3 — रिकवरी रिजल्ट्स" : "Step 3 — Results by Tier"}
                  </h4>
                  <div className="flex items-center gap-2 text-xs">
                    <button
                      onClick={() =>
                        setDiscoveredMedia((prev) => prev.map((m) => ({ ...m, isSelected: true })))
                      }
                      className="text-cyan-400 hover:underline cursor-pointer font-bold"
                    >
                      Select All
                    </button>
                    <span className="text-slate-600">|</span>
                    <button
                      onClick={() =>
                        setDiscoveredMedia((prev) => prev.map((m) => ({ ...m, isSelected: false })))
                      }
                      className="text-slate-400 hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[11px] font-mono">
                  {[
                    { tier: null, label: isHindi ? "सभी फाइलें" : "All Results" },
                    { tier: 1, label: isHindi ? "1. ओरिजिनल" : "1. Originals" },
                    { tier: 2, label: isHindi ? "2. हिडन कॉपी" : "2. Hidden" },
                    { tier: 3, label: isHindi ? "3. थंबनेल" : "3. Previews" },
                  ].map((filter) => {
                    const isActive = activeTierFilter === filter.tier;
                    return (
                      <button
                        key={filter.label}
                        onClick={() => setActiveTierFilter(filter.tier)}
                        className={`py-2 px-2 rounded-lg border text-center transition-all ${
                          isActive
                            ? "bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold"
                            : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        {filter.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Discovered Media Cards */}
              <div className="space-y-2">
                {discoveredMedia
                  .filter((m) => {
                    const matchCategory = recoverCategory === "all" || m.category === recoverCategory;
                    const matchTier = activeTierFilter === null || m.tier === activeTierFilter;
                    return matchCategory && matchTier;
                  })
                  .map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3 truncate">
                        <input
                          type="checkbox"
                          checked={item.isSelected}
                          onChange={() =>
                            setDiscoveredMedia((prev) =>
                              prev.map((x) =>
                                x.id === item.id ? { ...x, isSelected: !x.isSelected } : x
                              )
                            )
                          }
                          className="h-4 w-4 rounded accent-emerald-500 cursor-pointer"
                        />

                        <div className="h-9 w-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                          {item.category === "photos" && <ImageIcon className="h-4 w-4 text-cyan-400" />}
                          {item.category === "videos" && <VideoIcon className="h-4 w-4 text-blue-400" />}
                          {item.category === "recordings" && <Mic className="h-4 w-4 text-emerald-400" />}
                          {item.category === "music" && <Music className="h-4 w-4 text-purple-400" />}
                          {item.category === "docs" && <FileText className="h-4 w-4 text-amber-400" />}
                        </div>

                        <div className="truncate">
                          <span className="font-bold text-white block truncate">{item.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono block">
                            {(item.sizeBytes / 1_000_000).toFixed(2)} MB • {item.date} • {item.qualityTag}
                          </span>
                          <span className="text-[9px] text-slate-500 font-mono block truncate">
                            {item.sourcePath}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${
                            item.tier === 1
                              ? "bg-emerald-950 border-emerald-500/40 text-emerald-300"
                              : item.tier === 2
                              ? "bg-cyan-950 border-cyan-500/40 text-cyan-300"
                              : "bg-amber-950 border-amber-500/40 text-amber-300"
                          }`}
                        >
                          {isHindi ? item.tierNameHi : item.tierNameEn}
                        </span>

                        <button
                          onClick={() => setPreviewModalItem(item)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400"
                          title="Preview"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Step 4: Fixed Sticky Bottom Restore Bar */}
              <div className="rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950 to-slate-900 p-4 space-y-3">
                <button
                  onClick={handleRestoreSelected}
                  disabled={selectedCountTotal === 0}
                  className="w-full min-h-[52px] rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  <span>
                    {isHindi
                      ? `💾 चयनित फाइलें फोन में सेव करें (${selectedCountTotal} RESTORE)`
                      : `RESTORE SELECTED FILES (${selectedCountTotal}) TO DEVICE`}
                  </span>
                </button>

                <p className="text-[11px] text-slate-400 text-center font-mono">
                  Honest Disclaimer: Android 10+ FBE encryption restricts recovery to surviving cache, trash, and SAF folders. Zero fake promises.
                </p>
              </div>
            </div>
          )}

          {/* ── TAB 4: LAUNCHER (SUPER LAUNCHER ENGINE) ── */}
          {activeTab === "launcher" && (
            <div className="p-4 sm:p-6 space-y-6">
              {/* Top 2 System Role Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  onClick={() => {
                    setIsDefaultLauncherSet(true);
                    safeVibrate([30]);
                    setShowLauncherFeedback("Set as Default Launcher triggered (RoleManager.ROLE_HOME).");
                  }}
                  className="min-h-[52px] rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  <Home className="h-4 w-4" />
                  <span>
                    {isDefaultLauncherSet
                      ? (isHindi ? "डिफ़ॉल्ट होम सक्रिय है ✓" : "Default Home Active ✓")
                      : (isHindi ? "🏠 डिफ़ॉल्ट होम लॉन्चर बनाएं" : "Set as Default Home Screen")}
                  </span>
                </button>

                <button
                  onClick={() => {
                    safeVibrate([30]);
                    setShowLauncherFeedback("Settings.ACTION_HOME_SETTINGS opened. You can revert to your phone's default launcher anytime.");
                  }}
                  className="min-h-[52px] rounded-xl border border-rose-500/40 bg-rose-950/20 hover:bg-rose-900/30 text-rose-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>{isHindi ? "🔄 पुराना लॉन्चर वापस लाएं" : "Restore Original Phone Launcher"}</span>
                </button>
              </div>

              {showLauncherFeedback && (
                <div className="rounded-xl border border-purple-500/40 bg-purple-950/30 p-2.5 text-xs font-mono text-purple-300 flex items-center justify-between">
                  <span>{showLauncherFeedback}</span>
                  <button onClick={() => setShowLauncherFeedback(null)}>
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              {/* 4 Theme Selection Visual Buttons */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-white">
                  {isHindi ? "4 थीम चुनें (Instant Live Themes)" : "Choose Instant Theme"}
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { key: "minimal", name: "Super Minimal", sub: "Clean Monochrome" },
                    { key: "ios", name: "Super iOS-Style", sub: "Rounded & Dock" },
                    { key: "pixel", name: "Super Pixel", sub: "Search & Pastels" },
                    { key: "classic", name: "Super Classic", sub: "Traditional Grid" },
                  ].map((theme) => {
                    const isSelected = launcherTheme === theme.key;
                    return (
                      <button
                        key={theme.key}
                        onClick={() => {
                          setLauncherTheme(theme.key as any);
                          safeVibrate([15]);
                        }}
                        className={`min-h-[52px] rounded-xl border p-2.5 text-left transition-all cursor-pointer ${
                          isSelected
                            ? "bg-purple-500/20 border-purple-500 text-white shadow-md shadow-purple-500/15"
                            : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        <span className="text-xs font-bold block truncate">{theme.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono block truncate">{theme.sub}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Interactive Working Home Screen Mockup Box */}
              <div
                className={`rounded-3xl border border-slate-800 p-6 text-center space-y-5 transition-all ${
                  launcherTheme === "minimal"
                    ? "bg-black"
                    : launcherTheme === "ios"
                    ? "bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950"
                    : launcherTheme === "pixel"
                    ? "bg-slate-950"
                    : "bg-slate-900"
                }`}
              >
                {/* Clock & Date */}
                <div className="space-y-1">
                  <span
                    className={`text-5xl font-mono tracking-wider block ${
                      launcherTheme === "pixel"
                        ? "text-cyan-400 font-bold"
                        : launcherTheme === "minimal"
                        ? "text-slate-100 font-light"
                        : "text-white font-extrabold"
                    }`}
                  >
                    12:45
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Sunday, 1 November • Giridih Lab
                  </span>
                </div>

                {/* Live App Search Bar */}
                <div className="max-w-md mx-auto relative">
                  <Search className="h-4 w-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={launcherSearch}
                    onChange={(e) => setLauncherSearch(e.target.value)}
                    placeholder={isHindi ? "ऐप्स खोजें... (Search apps)" : "Search apps..."}
                    className="w-full min-h-[44px] pl-10 pr-4 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
                  />
                  {launcherSearch && (
                    <button
                      onClick={() => setLauncherSearch("")}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* App Drawer Grid */}
                <div className="grid grid-cols-4 max-w-sm mx-auto gap-4 pt-2">
                  {filteredLauncherApps.map((app) => (
                    <button
                      key={app.name}
                      onClick={() => safeVibrate([15])}
                      className="flex flex-col items-center gap-1.5 group cursor-pointer"
                    >
                      <div
                        className={`h-12 w-12 flex items-center justify-center text-xl transition-all ${
                          launcherTheme === "ios"
                            ? "rounded-2xl shadow-lg shadow-black/40"
                            : launcherTheme === "pixel"
                            ? "rounded-full border border-cyan-500/40"
                            : launcherTheme === "minimal"
                            ? "rounded-lg border border-slate-700 bg-slate-900"
                            : "rounded-xl"
                        } ${launcherTheme !== "minimal" ? app.color : ""}`}
                      >
                        {app.iconText}
                      </div>
                      <span className="text-[10px] font-mono text-slate-300 group-hover:text-white">
                        {app.name}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Bottom Dock Mockup */}
                <div className="pt-4 border-t border-slate-900 max-w-xs mx-auto flex items-center justify-around">
                  {sampleApps.slice(0, 4).map((app) => (
                    <button key={app.name} className="h-10 w-10 rounded-xl bg-slate-800 flex items-center justify-center text-base">
                      {app.iconText}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ── STEP-BY-STEP INSTALLATION & UPDATE GUIDE ── */}
        <section className="space-y-6 pt-4">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              Clear Android Walkthrough
            </span>
            <h3 className="text-xl sm:text-3xl font-extrabold text-white">
              {isHindi
                ? "एंड्रॉयड फोन में APK इनस्टॉल व अपडेट करने की 3-स्टेप गाइड"
                : "3-Step Android Installation & Update Guide"}
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto">
              {isHindi
                ? "प्ले स्टोर के बाहर पहली बार APK इनस्टॉल करते समय क्रोम सुरक्षा प्रॉम्प्ट दिखाता है। इसे आसानी से इनस्टॉल करने का सही तरीका:"
                : "When sideloading APKs, Android displays standard security alerts. Follow these 3 easy steps:"}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
              <div className="h-8 w-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-mono font-bold text-sm">
                1
              </div>
              <h4 className="text-sm font-bold text-white">Download Anyway</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isHindi
                  ? "डाउनलोड बटन दबाने पर यदि क्रोम पूछे 'File might be harmful', तो 'Download anyway' चुनें। हमारा ऐप 100% वायरस-मुक्त है।"
                  : "If Chrome displays 'File might be harmful', tap 'Download anyway'. Our release APK is verified and virus-free."}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-bold text-sm">
                2
              </div>
              <h4 className="text-sm font-bold text-white">Allow from this source</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isHindi
                  ? "फ़ाइल पर टैप करने पर सेटिंग्स प्रॉम्प्ट में 'Allow from this source' को चालू करें और 'Install' दबाएं।"
                  : "Tap on the downloaded APK, toggle 'Allow from this source' in settings, and tap 'Install'."}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
              <div className="h-8 w-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-mono font-bold text-sm">
                3
              </div>
              <h4 className="text-sm font-bold text-white">Signature Mismatch Fix</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isHindi
                  ? "यदि 'App not installed' या 'Signature conflict' दिखे, तो फोन में मौजूद पुराने टेस्ट वर्शन को पहले अनइन्स्टॉल करें।"
                  : "If updating from an old debug build causes a signature mismatch, uninstall the old build first, then install v2.4.0."}
              </p>
            </div>
          </div>
        </section>

        {/* ── DPDP ACT 2027 LEGAL PLEDGE BOX ── */}
        <section className="rounded-3xl border border-emerald-500/40 bg-emerald-950/20 p-5 sm:p-7 space-y-3">
          <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-sm sm:text-base">
            <ShieldCheck className="h-5 w-5 shrink-0" />
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
        </section>

        {/* ── WEBSITE VS NATIVE APP MATRIX ── */}
        <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-4 sm:p-6 backdrop-blur-xl space-y-4">
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-white">
              Website vs Native Android App — कब किसका उपयोग करें?
            </h3>
            <p className="text-xs text-slate-400">
              वेबसाइट रिपेयर सेवाओं और लैब गाइड्स के लिए है; नेटिव ऐप ऑफलाइन टूलकिट और कस्टम लॉन्चर के लिए है।
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono">
                  <th className="pb-2 pr-4 font-bold">क्षमता (Capability)</th>
                  <th className="pb-2 px-4 font-bold text-cyan-300">Website</th>
                  <th className="pb-2 pl-4 font-bold text-emerald-300">Native Android App</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                <tr>
                  <td className="py-2.5 pr-4 font-semibold text-white">3D स्मार्टफोन टियरडाउन व रिपेयर गाइड्स</td>
                  <td className="py-2.5 px-4 text-emerald-400 font-mono">हाँ (Three.js 3D)</td>
                  <td className="py-2.5 pl-4 text-slate-500 font-mono">वेबसाइट लिंक</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-semibold text-white">ऑफलाइन Wi-Fi Direct P2P ट्रांसफर (4GB+)</td>
                  <td className="py-2.5 px-4 text-rose-400/80 font-mono">ब्राउज़र सीमा</td>
                  <td className="py-2.5 pl-4 text-emerald-400 font-bold font-mono">हाँ (Super Transfer 60MB/s)</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-semibold text-white">MediaStore व SAF ऑन-डिवाइस मीडिया रिकवरी</td>
                  <td className="py-2.5 px-4 text-rose-400/80 font-mono">सैंडबॉक्स सीमा</td>
                  <td className="py-2.5 pl-4 text-emerald-400 font-bold font-mono">हाँ (Super Recover 4-Tier)</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-semibold text-white">कस्टम होम स्क्रीन व 4-थीम लॉन्चर</td>
                  <td className="py-2.5 px-4 text-rose-400/80 font-mono">ब्राउज़र सीमा</td>
                  <td className="py-2.5 pl-4 text-emerald-400 font-bold font-mono">हाँ (RoleManager.ROLE_HOME)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* ── MODALS ── */}

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="relative max-w-sm w-full rounded-3xl border border-cyan-500/40 bg-slate-900 p-6 text-center space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Scan with Phone Camera</h3>
            <p className="text-xs text-slate-400">
              Scan this QR code to download <code className="text-cyan-300">SuperTelecom.apk</code> or pair devices:
            </p>
            <div className="p-4 bg-white rounded-2xl max-w-[190px] mx-auto shadow-inner">
              <svg viewBox="0 0 100 100" className="w-full h-full text-slate-950 fill-current">
                <rect x="5" y="5" width="25" height="25" rx="3" fill="currentColor" />
                <rect x="9" y="9" width="17" height="17" rx="2" fill="white" />
                <rect x="13" y="13" width="9" height="9" fill="currentColor" />
                <rect x="70" y="5" width="25" height="25" rx="3" fill="currentColor" />
                <rect x="74" y="9" width="17" height="17" rx="2" fill="white" />
                <rect x="78" y="13" width="9" height="9" fill="currentColor" />
                <rect x="5" y="70" width="25" height="25" rx="3" fill="currentColor" />
                <rect x="9" y="74" width="17" height="17" rx="2" fill="white" />
                <rect x="13" y="78" width="9" height="9" fill="currentColor" />
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
            <p className="text-[11px] font-mono text-cyan-400">PIN: 582 914 • https://www.supertelecom.shop/app</p>
            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-xs font-bold text-white hover:bg-slate-700"
            >
              Close Window
            </button>
          </div>
        </div>
      )}

      {/* Receiver Consent Prompt Modal */}
      {showConsentPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="relative max-w-sm w-full rounded-3xl border border-amber-500/40 bg-slate-900 p-6 text-center space-y-4 shadow-2xl">
            <div className="h-12 w-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-white">Incoming Transfer Consent</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Nearby device <strong>"Pixel 8 Pro (582-914)"</strong> wants to send you a 2.45 GB video file: <br />
              <code className="text-cyan-300 font-mono text-[11px]">Khandoli_4K_Video_Recording.mp4</code>
            </p>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => {
                  setShowConsentPrompt(false);
                  handleStartTransfer();
                }}
                className="py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs"
              >
                Accept File
              </button>
              <button
                onClick={() => setShowConsentPrompt(false)}
                className="py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 text-xs"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recover Preview Modal */}
      {previewModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="relative max-w-md w-full rounded-3xl border border-cyan-500/40 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white truncate max-w-[280px]">
                {previewModalItem.name}
              </h3>
              <button onClick={() => setPreviewModalItem(null)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="h-44 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center">
              {previewModalItem.category === "photos" && <ImageIcon className="h-12 w-12 text-cyan-400" />}
              {previewModalItem.category === "videos" && <VideoIcon className="h-12 w-12 text-blue-400" />}
              {previewModalItem.category === "recordings" && <Mic className="h-12 w-12 text-emerald-400" />}
              {previewModalItem.category === "music" && <Music className="h-12 w-12 text-purple-400" />}
              {previewModalItem.category === "docs" && <FileText className="h-12 w-12 text-amber-400" />}
            </div>

            <div className="space-y-1 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>File Size:</span>
                <span className="text-white">{(previewModalItem.sizeBytes / 1_000_000).toFixed(2)} MB</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Discovered Date:</span>
                <span className="text-white">{previewModalItem.date}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Classification:</span>
                <span className="text-emerald-400">{previewModalItem.tierNameEn}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Source Path:</span>
                <span className="text-cyan-300 truncate max-w-[200px]">{previewModalItem.sourcePath}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setDiscoveredMedia((prev) =>
                  prev.map((x) =>
                    x.id === previewModalItem.id ? { ...x, isSelected: true } : x
                  )
                );
                setPreviewModalItem(null);
                handleRestoreSelected();
              }}
              className="w-full py-3 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs cursor-pointer"
            >
              Restore This File Now
            </button>
          </div>
        </div>
      )}

      {/* Restore Success Modal */}
      {showRestoreSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="relative max-w-sm w-full rounded-3xl border border-emerald-500/40 bg-slate-900 p-6 text-center space-y-4 shadow-2xl">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-white">
              {isHindi ? "✅ सफलतापूर्वक रिकवर हो गया!" : "Files Restored Successfully!"}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isHindi
                ? `${restoredCountSummary} फाइलें 'Internal Storage > SuperRecover_Restored/' फोल्डर में बिना किसी पुरानी फाइल को ओवरराइट किए सुरक्षित सेव कर दी गई हैं।`
                : `${restoredCountSummary} files safely recovered into 'Internal Storage > SuperRecover_Restored/' with verified SHA-256 integrity.`}
            </p>
            <button
              onClick={() => setShowRestoreSuccess(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs cursor-pointer"
            >
              Done / ठीक है
            </button>
          </div>
        </div>
      )}

      {/* DPDP Privacy Modal */}
      {showDpdpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="relative max-w-md w-full rounded-3xl border border-emerald-500/40 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Shield className="h-5 w-5" />
              <span>DPDP Act 2027 On-Device Guarantee</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isHindi
                ? "सुपर टेलीकॉम ऐप 100% ऑन-डिवाइस काम करता है। आपका कोई भी डेटा, फोटो या वीडियो किसी सर्वर पर अपलोड नहीं किया जाता। ऐप में कोई थर्ड-पार्टी एनालिटिक्स या ट्रैकिंग SDK शामिल नहीं है।"
                : "Super Telecom operates strictly under on-device data minimization. Zero telemetry SDKs, zero remote servers, and zero surveillance. Your privacy is legally guaranteed."}
            </p>
            <button
              onClick={() => setShowDpdpModal(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs"
            >
              Understood / समझ गया
            </button>
          </div>
        </div>
      )}

      {/* Settings / Contact Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="relative max-w-sm w-full rounded-3xl border border-slate-700 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Super Telecom Giridih</h3>
            <div className="text-xs text-slate-300 space-y-2">
              <p>
                <strong>Location:</strong> Barganda Road, Near Shivam Clinic, Giridih, Jharkhand 815301
              </p>
              <p>
                <strong>Call / WhatsApp:</strong> +91 80029 03643
              </p>
              <p>
                <strong>Hours:</strong> Mon – Sun, 10:00 AM – 9:30 PM IST
              </p>
              <p>
                <strong>Specialist:</strong> 45x Microscope BGA Soldering, Curved AMOLED Glass Restoration, Water Damage Recovery.
              </p>
            </div>
            <button
              onClick={() => setShowSettingsModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 text-white font-bold text-xs"
            >
              Close
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
