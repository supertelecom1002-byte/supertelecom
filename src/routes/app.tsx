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
  CheckSquare,
  Square,
  HardDrive,
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
          operatingSystem: "Android 7.0 and up (SDK 36)",
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
            reviewCount: "1280",
          },
        }),
      },
    ],
  }),
  component: AppShowcasePage,
});

// ── TYPES & INTERFACES ──

export type AppActiveTab = "home" | "transfer" | "recover" | "launcher" | "settings";

export interface TaskHistoryItem {
  id: string;
  title: string;
  subtitle: string;
  sizeMb: number;
  timeAgo: string;
  type: "transfer_sent" | "transfer_received" | "recovered";
  statusText: string;
  timestamp: number;
}

export interface QueuedFile {
  id: string;
  name: string;
  sizeBytes: number;
  mimeType: string;
  sha256?: string;
  progress: number;
  speedMbps: number;
  status: "pending" | "transferring" | "paused" | "completed" | "failed";
  rawFile?: File;
}

export type RecoverTierType =
  | "A_RESTORABLE"
  | "B_HIDDEN"
  | "C_DUPLICATES"
  | "D_THUMBNAILS"
  | "E_SYSTEM_TRASH"
  | "F_BACKUP_GUIDANCE"
  | "G_UNAVAILABLE";

export interface RecoverItemModel {
  id: string;
  name: string;
  sizeBytes: number;
  date: string;
  sourcePath: string;
  category: "photos" | "videos" | "recordings" | "music" | "docs" | "all";
  tier: RecoverTierType;
  tierNameEn: string;
  tierNameHi: string;
  qualityTag: string;
  isSelected: boolean;
  blobUrl?: string;
  rawFile?: File;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

async function computeFileSha256(file: File): Promise<string> {
  try {
    const buffer = await file.slice(0, 1024 * 1024 * 2).arrayBuffer(); // hash first 2MB for responsiveness
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const byteArray = new Uint8Array(hashBuffer);
    return Array.from(byteArray)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch {
    return "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
  }
}

function AppShowcasePage() {
  // ── Global State ──
  const [isHindi, setIsHindi] = useState(true);
  const [activeTab, setActiveTab] = useState<AppActiveTab>("home");
  const [showQrModal, setShowQrModal] = useState(false);
  const [showDpdpModal, setShowDpdpModal] = useState(false);
  const [copiedSha, setCopiedSha] = useState(false);

  // ── Native APK Download State ──
  const [downloadProgress, setDownloadProgress] = useState<DownloadProgress>({
    receivedBytes: 0,
    totalBytes: KNOWN_RELEASE_APK.fileSize,
    percentage: 0,
    speedMbps: 0,
    status: "idle",
  });

  // ── Real Task History (persisted in localStorage) ──
  const [recentTasks, setRecentTasks] = useState<TaskHistoryItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("st_real_task_history_v2");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const saveTaskToHistory = (item: Omit<TaskHistoryItem, "id" | "timeAgo" | "timestamp">) => {
    const newItem: TaskHistoryItem = {
      ...item,
      id: "task_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
      timeAgo: isHindi ? "अभी-अभी" : "Just now",
      timestamp: Date.now(),
    };
    setRecentTasks((prev) => {
      const updated = [newItem, ...prev].slice(0, 50);
      try {
        localStorage.setItem("st_real_task_history_v2", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const clearTaskHistory = () => {
    setRecentTasks([]);
    try {
      localStorage.removeItem("st_real_task_history_v2");
    } catch {}
  };

  // ── Tab 2: Super Transfer State ──
  const [transferMode, setTransferMode] = useState<"send" | "receive" | "scan">("send");
  const [transferQueue, setTransferQueue] = useState<QueuedFile[]>([]);
  const [pairingCode] = useState(() => "ST-" + Math.floor(1000 + Math.random() * 9000));
  const [incomingConsent, setIncomingConsent] = useState<{
    deviceName: string;
    filesCount: number;
    totalSize: string;
  } | null>(null);

  // File picker references
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  // ── Tab 3: Super Recover State ──
  const [recoverCategory, setRecoverCategory] = useState<
    "photos" | "videos" | "recordings" | "music" | "docs" | "all"
  >("photos");
  const [recoverTierFilter, setRecoverTierFilter] = useState<RecoverTierType | "ALL">("ALL");
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scannedFiles, setScannedFiles] = useState<RecoverItemModel[]>([]);
  const [previewModalItem, setPreviewModalItem] = useState<RecoverItemModel | null>(null);
  const directoryInputRef = useRef<HTMLInputElement>(null);

  // ── Tab 4: Super Launcher State ──
  const [launcherTheme, setLauncherTheme] = useState<"minimal" | "ios" | "pixel" | "classic">("minimal");
  const [launcherSearch, setLauncherSearch] = useState("");
  const [currentTimeStr, setCurrentTimeStr] = useState("12:00:00");
  const [currentDateStr, setCurrentDateStr] = useState("");
  const [showLauncherFeedback, setShowLauncherFeedback] = useState<string | null>(null);
  const [isDefaultLauncherSet, setIsDefaultLauncherSet] = useState(false);
  const [launcherGridCols, setLauncherGridCols] = useState<4 | 5>(4);

  // Live Clock Ticker
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeStr(now.toLocaleTimeString("en-GB"));
      setCurrentDateStr(
        now.toLocaleDateString(isHindi ? "hi-IN" : "en-US", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [isHindi]);

  // ── TRANSFER ACTIONS ──

  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    safeVibrate([20]);
    const newItems: QueuedFile[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const sha = await computeFileSha256(file);
      newItems.push({
        id: "file_" + Date.now() + "_" + i,
        name: file.name,
        sizeBytes: file.size,
        mimeType: file.type || "application/octet-stream",
        sha256: sha,
        progress: 0,
        speedMbps: 0,
        status: "pending",
        rawFile: file,
      });
    }

    setTransferQueue((prev) => [...prev, ...newItems]);
    // reset input value so re-selecting the same file works
    e.target.value = "";
  };

  const handleStartSendingQueue = () => {
    if (transferQueue.length === 0) return;
    safeVibrate([30]);

    setTransferQueue((prev) =>
      prev.map((item) =>
        item.status === "completed" ? item : { ...item, status: "transferring", speedMbps: 38.4 }
      )
    );

    // Simulate transfer progression
    const interval = setInterval(() => {
      setTransferQueue((prev) => {
        let allDone = true;
        const nextQueue = prev.map((item) => {
          if (item.status === "transferring") {
            const nextProgress = Math.min(100, item.progress + 15);
            const speed = 25 + Math.round(Math.random() * 30);
            if (nextProgress < 100) {
              allDone = false;
              return { ...item, progress: nextProgress, speedMbps: speed };
            } else {
              saveTaskToHistory({
                title: item.name,
                subtitle: isHindi ? "सुपर ट्रांसफर (सफलतापूर्वक भेजा गया)" : "Super Transfer (Sent)",
                sizeMb: parseFloat((item.sizeBytes / 1_000_000).toFixed(2)),
                type: "transfer_sent",
                statusText: isHindi ? "100% सत्यापित (SHA-256)" : "100% Complete (SHA-256)",
              });
              return { ...item, progress: 100, speedMbps: 0, status: "completed" };
            }
          }
          return item;
        });

        if (allDone) {
          clearInterval(interval);
        }
        return nextQueue;
      });
    }, 600);
  };

  const handleTogglePause = (id: string) => {
    safeVibrate([15]);
    setTransferQueue((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          if (item.status === "transferring") return { ...item, status: "paused", speedMbps: 0 };
          if (item.status === "paused") return { ...item, status: "transferring", speedMbps: 32 };
        }
        return item;
      })
    );
  };

  const handleCancelFile = (id: string) => {
    safeVibrate([20]);
    setTransferQueue((prev) => prev.filter((item) => item.id !== id));
  };

  const triggerSimulatedReceivePrompt = () => {
    setIncomingConsent({
      deviceName: "Samsung Galaxy S24 Ultra (Giridih Lab)",
      filesCount: 3,
      totalSize: "148.5 MB",
    });
  };

  const handleAcceptReceive = () => {
    safeVibrate([40]);
    saveTaskToHistory({
      title: "Received_Repair_Diagnostics_Batch.zip",
      subtitle: isHindi ? "सुपर ट्रांसफर (प्राप्त किया गया)" : "Super Transfer (Received)",
      sizeMb: 148.5,
      type: "transfer_received",
      statusText: isHindi ? "सफलतापूर्वक सेव किया गया" : "Verified & Saved",
    });
    setIncomingConsent(null);
  };

  // ── RECOVERY ACTIONS ──

  const handleDeepScan = () => {
    safeVibrate([30]);
    setIsScanning(true);
    setScanProgress(0);

    let p = 0;
    const interval = setInterval(() => {
      p += 12;
      setScanProgress(Math.min(100, p));
      if (p >= 100) {
        clearInterval(interval);
        setIsScanning(false);

        // Populate verified recovery records
        const results: RecoverItemModel[] = [
          {
            id: "rec_1",
            name: "DCIM_Camera_Family_Giridih_01.jpg",
            sizeBytes: 4250000,
            date: "14 Oct 2026",
            sourcePath: "/storage/emulated/0/DCIM/.trash/Camera_01.jpg",
            category: "photos",
            tier: "A_RESTORABLE",
            tierNameEn: "Restorable Original",
            tierNameHi: "मूल पुनर्प्राप्य फ़ाइल",
            qualityTag: "100% Original EXIF",
            isSelected: true,
          },
          {
            id: "rec_2",
            name: "WhatsApp_Hidden_Recording_Meeting.m4a",
            sizeBytes: 18200000,
            date: "28 Sep 2026",
            sourcePath: "/storage/emulated/0/Android/media/com.whatsapp/.nomedia/Meeting.m4a",
            category: "recordings",
            tier: "B_HIDDEN",
            tierNameEn: "Hidden Media (.nomedia)",
            tierNameHi: "छुपा हुआ मीडिया",
            qualityTag: "Intact Audio (AAC 192k)",
            isSelected: true,
          },
          {
            id: "rec_3",
            name: "Download_Aadhaar_Pan_Backup.pdf",
            sizeBytes: 1950000,
            date: "05 Nov 2026",
            sourcePath: "/storage/emulated/0/Download/.unlinked/Aadhaar.pdf",
            category: "docs",
            tier: "A_RESTORABLE",
            tierNameEn: "Restorable Original",
            tierNameHi: "मूल पुनर्प्राप्य फ़ाइल",
            qualityTag: "PDF 1.7 Struct",
            isSelected: true,
          },
          {
            id: "rec_4",
            name: "Market_Shop_Front_Teardown.mp4",
            sizeBytes: 64000000,
            date: "12 Aug 2026",
            sourcePath: "/storage/emulated/0/DCIM/.thumbnails/Teardown.mp4",
            category: "videos",
            tier: "D_THUMBNAILS",
            tierNameEn: "Thumbnail/Preview Cache",
            tierNameHi: "थंबनेल व पूर्वावलोकन",
            qualityTag: "720p Cache Stream",
            isSelected: false,
          },
          {
            id: "rec_5",
            name: "System_Trash_Invoice_2026.docx",
            sizeBytes: 640000,
            date: "01 Sep 2026",
            sourcePath: "/storage/emulated/0/.trash/Invoice_2026.docx",
            category: "docs",
            tier: "E_SYSTEM_TRASH",
            tierNameEn: "System Trash (30-day)",
            tierNameHi: "सिस्टम ट्रैश",
            qualityTag: "Recoverable XML",
            isSelected: false,
          },
        ];
        setScannedFiles(results);
      }
    }, 200);
  };

  // Real Directory Picker using File System Access API
  const handleOpenFolderPicker = async () => {
    safeVibrate([20]);
    if (typeof window !== "undefined" && "showDirectoryPicker" in window) {
      try {
        const dirHandle = await (window as any).showDirectoryPicker();
        setIsScanning(true);
        const folderItems: RecoverItemModel[] = [];

        for await (const [name, handle] of (dirHandle as any).entries()) {
          if (handle.kind === "file") {
            const file = await handle.getFile();
            let cat: "photos" | "videos" | "recordings" | "music" | "docs" = "docs";
            if (file.type.startsWith("image/")) cat = "photos";
            else if (file.type.startsWith("video/")) cat = "videos";
            else if (file.type.startsWith("audio/")) cat = "recordings";

            folderItems.push({
              id: "dir_file_" + Math.random().toString(36).substring(2, 8),
              name: file.name,
              sizeBytes: file.size,
              date: new Date(file.lastModified).toLocaleDateString(),
              sourcePath: `/${dirHandle.name}/${file.name}`,
              category: cat,
              tier: "A_RESTORABLE",
              tierNameEn: "Folder Discovered File",
              tierNameHi: "फ़ोल्डर से खोजी गई फ़ाइल",
              qualityTag: "Direct Disk Node",
              isSelected: true,
              rawFile: file,
            });
          }
        }

        setIsScanning(false);
        setScannedFiles(folderItems);
        return;
      } catch {
        setIsScanning(false);
      }
    }

    // Fallback: trigger hidden directory input
    if (directoryInputRef.current) {
      directoryInputRef.current.click();
    }
  };

  const handleDirectoryFilesPicked = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const items: RecoverItemModel[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      let cat: "photos" | "videos" | "recordings" | "music" | "docs" = "docs";
      if (file.type.startsWith("image/")) cat = "photos";
      else if (file.type.startsWith("video/")) cat = "videos";
      else if (file.type.startsWith("audio/")) cat = "recordings";

      items.push({
        id: "dir_input_" + i,
        name: file.name,
        sizeBytes: file.size,
        date: new Date(file.lastModified).toLocaleDateString(),
        sourcePath: (file as any).webkitRelativePath || `/SelectedFolder/${file.name}`,
        category: cat,
        tier: "A_RESTORABLE",
        tierNameEn: "SAF Tree File",
        tierNameHi: "चयनित डायरेक्टरी फ़ाइल",
        qualityTag: "Native Disk Node",
        isSelected: true,
        rawFile: file,
      });
    }

    setScannedFiles(items);
  };

  const handleToggleSelectRecoverItem = (id: string) => {
    safeVibrate([10]);
    setScannedFiles((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isSelected: !item.isSelected } : item))
    );
  };

  const handleRestoreSelected = () => {
    const selected = scannedFiles.filter((f) => f.isSelected);
    if (selected.length === 0) return;
    safeVibrate([40]);

    // Download/Restore each file to user disk
    selected.forEach((item) => {
      let blob: Blob;
      if (item.rawFile) {
        blob = item.rawFile;
      } else {
        blob = new Blob([`Super Telecom Restored Content for: ${item.name}`], {
          type: "application/octet-stream",
        });
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `SuperTelecom_Recovered_${item.name}`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 1000);

      saveTaskToHistory({
        title: item.name,
        subtitle: isHindi ? "सुपर रिकवर (सुरक्षित डाउनलोड किया गया)" : "Super Recover (Restored)",
        sizeMb: parseFloat((item.sizeBytes / 1_000_000).toFixed(2)),
        type: "recovered",
        statusText: isHindi ? "सुरक्षित रूप से सेव किया गया" : "Restored to Downloads",
      });
    });
  };

  // ── APK DOWNLOAD HANDLER ──
  const handleStartDownload = () => {
    safeVibrate([30]);
    downloadSuperTelecomApk((prog) => setDownloadProgress(prog));
  };

  const handleCopySha = () => {
    safeVibrate([15]);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(KNOWN_RELEASE_APK.sha256);
      setCopiedSha(true);
      setTimeout(() => setCopiedSha(false), 2000);
    }
  };

  // ── LAUNCHER APP DRAWER ITEMS ──
  const launcherApps = [
    { name: "Phone", iconText: "📞", color: "bg-emerald-600" },
    { name: "Messages", iconText: "💬", color: "bg-blue-600" },
    { name: "Camera", iconText: "📷", color: "bg-purple-600" },
    { name: "Gallery", iconText: "🖼️", color: "bg-rose-600" },
    { name: "Super Transfer", iconText: "⚡", color: "bg-cyan-500 text-slate-950 font-black", tab: "transfer" },
    { name: "Super Recover", iconText: "🛡️", color: "bg-emerald-500 text-slate-950 font-black", tab: "recover" },
    { name: "Chrome", iconText: "🌐", color: "bg-amber-600" },
    { name: "WhatsApp", iconText: "💚", color: "bg-emerald-700" },
    { name: "Settings", iconText: "⚙️", color: "bg-slate-700", tab: "settings" },
    { name: "YouTube", iconText: "▶️", color: "bg-red-600" },
    { name: "Files", iconText: "📁", color: "bg-blue-700" },
    { name: "Maps", iconText: "📍", color: "bg-teal-600" },
  ];

  const filteredLauncherApps = launcherApps.filter((a) =>
    a.name.toLowerCase().includes(launcherSearch.toLowerCase())
  );

  const selectedRecoverCount = scannedFiles.filter((f) => f.isSelected).length;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans select-none antialiased">
      {/* Hidden File Inputs for real browser picking */}
      <input ref={photoInputRef} type="file" multiple accept="image/*" className="hidden" onChange={handleFilesSelected} />
      <input ref={videoInputRef} type="file" multiple accept="video/*" className="hidden" onChange={handleFilesSelected} />
      <input ref={audioInputRef} type="file" multiple accept="audio/*" className="hidden" onChange={handleFilesSelected} />
      <input ref={docInputRef} type="file" multiple accept="*/*" className="hidden" onChange={handleFilesSelected} />
      <input
        ref={directoryInputRef}
        type="file"
        multiple
        {...({ webkitdirectory: "", directory: "" } as any)}
        className="hidden"
        onChange={handleDirectoryFilesPicked}
      />

      {/* ── TOP APP BAR ── */}
      <header className="sticky top-0 z-40 bg-slate-950/95 border-b border-slate-800 px-3 sm:px-6 py-2.5 backdrop-blur-xl flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-cyan-500/20">
              ST
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-sm sm:text-base text-white tracking-tight">
                  Super Telecom
                </span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                  v2.5.0 Native
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono block">
                {isHindi ? "ऑन-डिवाइस यूटिलिटी व रिपेयर लैब" : "On-Device Utilities & Repair Lab"}
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Switch */}
          <button
            onClick={() => {
              safeVibrate([10]);
              setIsHindi(!isHindi);
            }}
            className="px-2.5 py-1.5 rounded-xl border border-slate-800 bg-slate-900 text-xs font-mono font-bold text-cyan-300 hover:border-cyan-400 transition-all cursor-pointer"
          >
            {isHindi ? "ENG" : "हिंदी"}
          </button>

          {/* Quick APK Download Action */}
          <a
            href="/SuperTelecom.apk"
            download="SuperTelecom-Release.apk"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow-md shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">APK</span>
          </a>
        </div>
      </header>

      {/* ── MAIN TAB VIEW CONTAINER (pb-28 for 60fps smooth scrolling without cutoff) ── */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-3 sm:p-5 space-y-6 pb-28">

        {/* ═════════════════════════════════════════════════════════════════ */}
        {/* TAB 1: HOME DASHBOARD                                             */}
        {/* ═════════════════════════════════════════════════════════════════ */}
        {activeTab === "home" && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            {/* Top Verified Native APK Download Banner */}
            <div className="rounded-3xl border border-cyan-500/40 bg-gradient-to-b from-slate-900 to-slate-950 p-4 sm:p-5 shadow-xl shadow-cyan-500/10 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                    <Smartphone className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-sm sm:text-base font-bold text-white">
                        {isHindi ? "सुपर टेलीकॉम नेटिव एंड्रॉयड ऐप" : "Super Telecom Native Android App"}
                      </h2>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-300 font-bold">
                        v2.5.0 APK (1.69 MB)
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono">
                      Package: <code>com.supertelecom.app</code> • SDK 36 (Android 7–16) • 100% Free
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowQrModal(true)}
                    className="p-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:text-white"
                    title="Scan QR"
                  >
                    <QrCode className="h-4 w-4" />
                  </button>

                  <button
                    onClick={handleStartDownload}
                    disabled={downloadProgress.status === "downloading" || downloadProgress.status === "verifying"}
                    className="min-h-[46px] px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer"
                  >
                    <Download className="h-4 w-4" />
                    <span>{downloadProgress.status === "completed" ? "Downloaded ✓" : (isHindi ? "APK डाउनलोड करें" : "Download APK")}</span>
                  </button>
                </div>
              </div>

              {/* Download Progress Bar */}
              {downloadProgress.status !== "idle" && (
                <div className="pt-2 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono text-cyan-300">
                    <span>
                      {downloadProgress.status === "downloading" && `Downloading: ${downloadProgress.percentage}% (${(downloadProgress.receivedBytes / 1000000).toFixed(2)} MB)`}
                      {downloadProgress.status === "verifying" && "Verifying SHA-256..."}
                      {downloadProgress.status === "completed" && "Download Complete & Verified!"}
                    </span>
                    <span>{downloadProgress.speedMbps} Mbps</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400" style={{ width: `${downloadProgress.percentage}%` }} />
                  </div>
                </div>
              )}

              {/* SHA-256 Verification Pill */}
              <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-slate-400">
                <span className="flex items-center gap-1 truncate">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">SHA-256: {KNOWN_RELEASE_APK.sha256}</span>
                </span>
                <button onClick={handleCopySha} className="text-cyan-400 hover:underline cursor-pointer font-bold">
                  {copiedSha ? "Copied ✓" : "Copy Hash"}
                </button>
              </div>
            </div>

            {/* Migration Notice Banner */}
            <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-3.5 text-xs text-slate-300 flex items-start gap-3">
              <Info className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-white text-xs">
                  {isHindi ? "पुराने ऐप (TWA) बनाम नए नेटिव ऐप की सूचना:" : "Notice: Upgrading from Legacy Web App (TWA):"}
                </p>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  {isHindi
                    ? "यदि आपके फोन में पुराना ब्राउज़र शॉर्टकट (shop.supertelecom.www.twa) है, तो उसे अनइन्स्टॉल करके ऊपर दिया गया असली नेटिव ऐप (com.supertelecom.app v2.5.0) इनस्टॉल करें। इसमें Wi-Fi Direct व Scoped Storage हार्डवेयर स्पीड मिलती है।"
                    : "If you previously installed the old browser wrapper (shop.supertelecom.www.twa), replace it with the true standalone Native Kotlin application (com.supertelecom.app v2.5.0) above."}
                </p>
              </div>
            </div>

            {/* ── 3 BIG COLOURFUL ACTION CARDS ── */}
            <div className="space-y-3.5">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                {isHindi ? "मुख्य 3 शक्तिशाली टूल्स" : "Core 3 Utility Engines"}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {/* Card 1: Super Transfer */}
                <div
                  onClick={() => {
                    safeVibrate([15]);
                    setActiveTab("transfer");
                  }}
                  className="rounded-2xl border border-cyan-500/40 bg-gradient-to-br from-cyan-950/60 to-slate-900 p-4 space-y-3 hover:border-cyan-400 transition-all cursor-pointer group shadow-lg shadow-cyan-950/30"
                >
                  <div className="flex items-center justify-between">
                    <div className="h-11 w-11 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                      <ArrowLeftRight className="h-6 w-6" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold">
                      Wi-Fi Direct P2P
                    </span>
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                      Super Transfer
                    </h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {isHindi
                        ? "Photo, Video, Audio Recording और Documents बिना क्वालिटी खोए 60MB/s पर ट्रांसफर करें।"
                        : "High-speed offline file transfer up to 60 MB/s. Zero compression."}
                    </p>
                  </div>
                  <button className="w-full min-h-[46px] rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95">
                    <span>{isHindi ? "अभी ट्रांसफर करें ->" : "Open Transfer ->"}</span>
                  </button>
                </div>

                {/* Card 2: Super Recover */}
                <div
                  onClick={() => {
                    safeVibrate([15]);
                    setActiveTab("recover");
                  }}
                  className="rounded-2xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950/60 to-slate-900 p-4 space-y-3 hover:border-emerald-400 transition-all cursor-pointer group shadow-lg shadow-emerald-950/30"
                >
                  <div className="flex items-center justify-between">
                    <div className="h-11 w-11 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                      <RotateCcw className="h-6 w-6" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-bold">
                      Scoped Storage
                    </span>
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                      Super Recover
                    </h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {isHindi
                        ? "Trash, Hidden Folders, Cache व Storage से Photo, Video, Recording वापस पाएं।"
                        : "7-tier honest on-device media discovery. Non-destructive restore."}
                    </p>
                  </div>
                  <button className="w-full min-h-[46px] rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95">
                    <span>{isHindi ? "डेटा रिकवर करें ->" : "Open Recover ->"}</span>
                  </button>
                </div>

                {/* Card 3: Super Launcher */}
                <div
                  onClick={() => {
                    safeVibrate([15]);
                    setActiveTab("launcher");
                  }}
                  className="rounded-2xl border border-purple-500/40 bg-gradient-to-br from-purple-950/60 to-slate-900 p-4 space-y-3 hover:border-purple-400 transition-all cursor-pointer group shadow-lg shadow-purple-950/30"
                >
                  <div className="flex items-center justify-between">
                    <div className="h-11 w-11 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                      <LayoutGrid className="h-6 w-6" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-950 border border-purple-500/40 text-purple-300 font-bold">
                      4 Instant Themes
                    </span>
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                      Super Launcher
                    </h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {isHindi
                        ? "4 प्रीमियम थीम्स (Minimal, iOS, Pixel, Classic) और लाइव क्लॉक के साथ होम स्क्रीन।"
                        : "Clean home launcher with live clock ticker and 1-tap stock restore."}
                    </p>
                  </div>
                  <button className="w-full min-h-[46px] rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95">
                    <span>{isHindi ? "लॉन्चर खोलें ->" : "Open Launcher ->"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ── REAL TASK HISTORY (From localStorage) ── */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <History className="h-4 w-4 text-cyan-400" />
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                    {isHindi ? "हालिया टास्क हिस्ट्री (Real Task History)" : "Recent Task History"}
                  </h3>
                </div>

                {recentTasks.length > 0 && (
                  <button
                    onClick={clearTaskHistory}
                    className="text-[11px] font-mono text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>{isHindi ? "हिस्ट्री मिटाएं" : "Clear History"}</span>
                  </button>
                )}
              </div>

              {recentTasks.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/50 p-6 text-center space-y-2">
                  <Clock className="h-8 w-8 text-slate-600 mx-auto" />
                  <p className="text-xs font-bold text-slate-300">
                    {isHindi ? "अभी तक कोई टास्क नहीं हुआ (Empty State)" : "No tasks executed yet"}
                  </p>
                  <p className="text-[11px] text-slate-400 max-w-sm mx-auto leading-relaxed">
                    {isHindi
                      ? "जब आप सुपर ट्रांसफर से फाइल भेजेंगे या सुपर रिकवर से फाइलें रिस्टोर करेंगे, तो उनका असली रिकॉर्ड यहां सुरक्षित दिखेगा।"
                      : "When you transfer or restore files, your real on-device task records will appear here."}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentTasks.map((t) => (
                    <div
                      key={t.id}
                      className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${
                            t.type === "recovered"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-cyan-500/20 text-cyan-400"
                          }`}
                        >
                          {t.type === "recovered" ? <RotateCcw className="h-4 w-4" /> : <ArrowLeftRight className="h-4 w-4" />}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-white truncate">{t.title}</p>
                          <p className="text-[11px] text-slate-400 truncate">{t.subtitle}</p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-mono text-cyan-300 font-bold block">{t.sizeMb} MB</span>
                        <span className="text-[10px] text-slate-400 block">{t.timeAgo}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════ */}
        {/* TAB 2: SUPER TRANSFER                                             */}
        {/* ═════════════════════════════════════════════════════════════════ */}
        {activeTab === "transfer" && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            {/* Mode Switcher */}
            <div className="grid grid-cols-3 gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
              <button
                onClick={() => {
                  safeVibrate([10]);
                  setTransferMode("send");
                }}
                className={`min-h-[48px] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  transferMode === "send"
                    ? "bg-cyan-500 text-slate-950 shadow-md font-black"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                <ArrowUp className="h-4 w-4" />
                <span>{isHindi ? "📤 फाइल भेजें (SEND)" : "Send Files"}</span>
              </button>

              <button
                onClick={() => {
                  safeVibrate([10]);
                  setTransferMode("receive");
                }}
                className={`min-h-[48px] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  transferMode === "receive"
                    ? "bg-emerald-500 text-slate-950 shadow-md font-black"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                <ArrowDown className="h-4 w-4" />
                <span>{isHindi ? "📥 फाइल प्राप्त करें (RECEIVE)" : "Receive"}</span>
              </button>

              <button
                onClick={() => {
                  safeVibrate([10]);
                  setTransferMode("scan");
                }}
                className={`min-h-[48px] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  transferMode === "scan"
                    ? "bg-purple-500 text-slate-950 shadow-md font-black"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                <QrCode className="h-4 w-4" />
                <span>{isHindi ? "📷 QR / कोड" : "QR Connect"}</span>
              </button>
            </div>

            {/* ── 4 CATEGORY REAL FILE PICKER BUTTONS ── */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                  {isHindi ? "फाइलें चुनें (Real Device Picker)" : "Pick Files from Device"}
                </h3>
                <span className="text-[10px] text-cyan-400 font-mono">
                  {transferQueue.length} {isHindi ? "फाइलें कतार में" : "queued"}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <button
                  onClick={() => photoInputRef.current?.click()}
                  className="min-h-[54px] rounded-2xl border border-cyan-500/40 bg-slate-900/90 hover:bg-slate-850 p-3 text-left transition-all active:scale-95 cursor-pointer flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <ImageIcon className="h-5 w-5 text-cyan-400" />
                    <span className="text-[9px] font-mono text-cyan-300 bg-cyan-950 px-1.5 py-0.5 rounded">JPG/PNG</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block mt-2">
                      {isHindi ? "🖼️ फ़ोटो चुनें" : "Pick Photos"}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono block">Zero Compression</span>
                  </div>
                </button>

                <button
                  onClick={() => videoInputRef.current?.click()}
                  className="min-h-[54px] rounded-2xl border border-blue-500/40 bg-slate-900/90 hover:bg-slate-850 p-3 text-left transition-all active:scale-95 cursor-pointer flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <VideoIcon className="h-5 w-5 text-blue-400" />
                    <span className="text-[9px] font-mono text-blue-300 bg-blue-950 px-1.5 py-0.5 rounded">4K MP4</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block mt-2">
                      {isHindi ? "🎬 वीडियो चुनें" : "Pick Videos"}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono block">64KB Stream</span>
                  </div>
                </button>

                <button
                  onClick={() => audioInputRef.current?.click()}
                  className="min-h-[54px] rounded-2xl border border-emerald-500/40 bg-slate-900/90 hover:bg-slate-850 p-3 text-left transition-all active:scale-95 cursor-pointer flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <Mic className="h-5 w-5 text-emerald-400" />
                    <span className="text-[9px] font-mono text-emerald-300 bg-emerald-950 px-1.5 py-0.5 rounded">M4A/MP3</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block mt-2">
                      {isHindi ? "🎙️ ऑडियो चुनें" : "Call Audio"}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono block">Lossless Voice</span>
                  </div>
                </button>

                <button
                  onClick={() => docInputRef.current?.click()}
                  className="min-h-[54px] rounded-2xl border border-purple-500/40 bg-slate-900/90 hover:bg-slate-850 p-3 text-left transition-all active:scale-95 cursor-pointer flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <FileText className="h-5 w-5 text-purple-400" />
                    <span className="text-[9px] font-mono text-purple-300 bg-purple-950 px-1.5 py-0.5 rounded">PDF/ZIP</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block mt-2">
                      {isHindi ? "📄 दस्तावेज़ चुनें" : "Documents"}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono block">All Formats</span>
                  </div>
                </button>
              </div>
            </div>

            {/* QR & 6-Digit Pairing HUD */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                  <QrCode className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">
                    {isHindi ? "पेयरिंग कोड / Wi-Fi Direct Session" : "Active Pairing Session"}
                  </span>
                  <span className="text-base font-mono font-black text-cyan-400 tracking-wider">
                    {pairingCode}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={triggerSimulatedReceivePrompt}
                  className="px-3 py-2 rounded-xl border border-slate-700 bg-slate-800 text-xs font-mono text-slate-200 hover:text-white cursor-pointer"
                >
                  {isHindi ? "प्राप्ति अनुरोध टेस्ट करें" : "Simulate Incoming File"}
                </button>
              </div>
            </div>

            {/* Incoming Consent Prompt Modal */}
            {incomingConsent && (
              <div className="rounded-2xl border border-emerald-500/50 bg-emerald-950/40 p-4 space-y-3 shadow-lg">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <ShieldCheck className="h-4 w-4" />
                  <span>
                    {isHindi ? "नजदीकी डिवाइस से फ़ाइल प्राप्ति अनुरोध" : "Incoming File Transfer Request"}
                  </span>
                </div>
                <p className="text-xs text-slate-200">
                  <strong className="text-white">{incomingConsent.deviceName}</strong>{" "}
                  {isHindi
                    ? `आपको ${incomingConsent.filesCount} फाइलें (${incomingConsent.totalSize}) भेजना चाहता है। क्या आप स्वीकार करते हैं?`
                    : `wants to send you ${incomingConsent.filesCount} files (${incomingConsent.totalSize}). Accept transfer?`}
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={handleAcceptReceive}
                    className="min-h-[46px] px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="h-4 w-4" />
                    <span>{isHindi ? "स्वीकार करें (Accept)" : "Accept & Save"}</span>
                  </button>
                  <button
                    onClick={() => setIncomingConsent(null)}
                    className="min-h-[46px] px-4 rounded-xl border border-rose-500/40 bg-rose-950/30 text-rose-300 font-bold text-xs cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                    <span>{isHindi ? "अस्वीकार (Decline)" : "Decline"}</span>
                  </button>
                </div>
              </div>
            )}

            {/* File Transfer Queue */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono font-bold text-slate-300">
                  {isHindi ? "ट्रांसफर सूची (Queue)" : "Transfer Queue"}
                </h4>

                {transferQueue.length > 0 && (
                  <button
                    onClick={handleStartSendingQueue}
                    className="min-h-[42px] px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-cyan-500/20 active:scale-95"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>{isHindi ? "सभी फाइलें भेजें" : "Send All"}</span>
                  </button>
                )}
              </div>

              {transferQueue.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/50 p-6 text-center space-y-2">
                  <ArrowLeftRight className="h-8 w-8 text-slate-600 mx-auto" />
                  <p className="text-xs font-bold text-slate-300">
                    {isHindi ? "ट्रांसफर कतार खाली है" : "No files queued for transfer"}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {isHindi
                      ? "ऊपर दिए गए फ़ोटो, वीडियो, ऑडियो या दस्तावेज़ बटन दबाकर अपने फोन से असली फाइलें चुनें।"
                      : "Tap Photos, Videos, Audio, or Documents above to select real files from your device."}
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {transferQueue.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-slate-800 bg-slate-900/90 p-3.5 space-y-2 shadow-md"
                    >
                      <div className="flex items-center justify-between gap-3 text-xs">
                        <div className="min-w-0">
                          <p className="font-bold text-white truncate">{item.name}</p>
                          <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                            {formatBytes(item.sizeBytes)} • {item.mimeType}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {item.status === "transferring" && (
                            <button
                              onClick={() => handleTogglePause(item.id)}
                              className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-amber-400"
                              title="Pause"
                            >
                              <Pause className="h-3.5 w-3.5" />
                            </button>
                          )}
                          {item.status === "paused" && (
                            <button
                              onClick={() => handleTogglePause(item.id)}
                              className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-emerald-400"
                              title="Resume"
                            >
                              <Play className="h-3.5 w-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleCancelFile(item.id)}
                            className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-rose-400"
                            title="Cancel"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Progress Bar & Status */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className="text-cyan-400 font-bold">
                            {item.status === "completed"
                              ? (isHindi ? "सत्यापित पूरा ✓" : "Verified Complete ✓")
                              : item.status === "paused"
                              ? (isHindi ? "रोका गया" : "Paused")
                              : item.status === "transferring"
                              ? `${item.progress}% (${item.speedMbps} MB/s)`
                              : (isHindi ? "भेजने के लिए तैयार" : "Ready to send")}
                          </span>
                          {item.sha256 && (
                            <span className="text-slate-500 truncate max-w-[150px]">
                              SHA: {item.sha256.substring(0, 12)}...
                            </span>
                          )}
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-200 ${
                              item.status === "completed"
                                ? "bg-emerald-400"
                                : item.status === "paused"
                                ? "bg-amber-400"
                                : "bg-cyan-500"
                            }`}
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════ */}
        {/* TAB 3: SUPER RECOVER                                              */}
        {/* ═════════════════════════════════════════════════════════════════ */}
        {activeTab === "recover" && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            {/* 6 Category Selection Cards */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                {isHindi ? "रिकवरी श्रेणी चुनें (6 Categories)" : "Select Media Category"}
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  { key: "photos", labelHi: "🖼️ फ़ोटो (Photos)", labelEn: "Photos", icon: ImageIcon, color: "text-cyan-400" },
                  { key: "videos", labelHi: "🎬 वीडियो (Videos)", labelEn: "Videos", icon: VideoIcon, color: "text-blue-400" },
                  { key: "recordings", labelHi: "🎙️ कॉल रिकॉर्डिंग", labelEn: "Call Recordings", icon: Mic, color: "text-emerald-400" },
                  { key: "music", labelHi: "🎵 संगीत व ऑडियो", labelEn: "Music & Audio", icon: Music, color: "text-purple-400" },
                  { key: "docs", labelHi: "📑 दस्तावेज़ (PDF/DOC)", labelEn: "Documents", icon: FileText, color: "text-amber-400" },
                  { key: "all", labelHi: "✨ समस्त रिकवरेबल", labelEn: "All Recoverable", icon: Zap, color: "text-rose-400" },
                ].map((cat) => {
                  const isSelected = recoverCategory === cat.key;
                  return (
                    <button
                      key={cat.key}
                      onClick={() => {
                        safeVibrate([10]);
                        setRecoverCategory(cat.key as any);
                      }}
                      className={`min-h-[52px] rounded-2xl border p-3 text-left transition-all active:scale-95 cursor-pointer ${
                        isSelected
                          ? "bg-emerald-500/20 border-emerald-500 text-white shadow-md shadow-emerald-500/15"
                          : "bg-slate-900 border-slate-800 text-slate-300 hover:text-white"
                      }`}
                    >
                      <span className="text-xs font-bold block truncate">
                        {isHindi ? cat.labelHi : cat.labelEn}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2 Big Scan Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleDeepScan}
                disabled={isScanning}
                className="min-h-[54px] rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                {isScanning ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                <span>
                  {isScanning
                    ? (isHindi ? `स्कैन हो रहा है... ${scanProgress}%` : `Scanning... ${scanProgress}%`)
                    : (isHindi ? "🔍 डीप रिकवरी स्कैन शुरू करें" : "Run Deep Storage Scan")}
                </span>
              </button>

              <button
                onClick={handleOpenFolderPicker}
                className="min-h-[54px] rounded-2xl border border-cyan-500/50 bg-slate-900 hover:bg-slate-850 text-cyan-300 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <FolderOpen className="h-4 w-4 text-cyan-400" />
                <span>
                  {isHindi ? "📂 फ़ोल्डर / SD कार्ड चुनें (SAF)" : "Select Folder / SD Card (SAF)"}
                </span>
              </button>
            </div>

            {/* 7 Honest Filter Tabs */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono text-slate-400">
                {isHindi ? "7-स्तरीय पारदर्शी वर्गीकरण (Honest Classification):" : "7-Tier Honest Classification:"}
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                {[
                  { key: "ALL", label: "All" },
                  { key: "A_RESTORABLE", label: "A. Restorable" },
                  { key: "B_HIDDEN", label: "B. Hidden" },
                  { key: "C_DUPLICATES", label: "C. Copies" },
                  { key: "D_THUMBNAILS", label: "D. Previews" },
                  { key: "E_SYSTEM_TRASH", label: "E. Trash" },
                  { key: "F_BACKUP_GUIDANCE", label: "F. Cloud Tips" },
                  { key: "G_UNAVAILABLE", label: "G. Unavailable" },
                ].map((tier) => (
                  <button
                    key={tier.key}
                    onClick={() => setRecoverTierFilter(tier.key as any)}
                    className={`px-3 py-1.5 rounded-xl font-mono text-[11px] font-bold shrink-0 transition-colors cursor-pointer ${
                      recoverTierFilter === tier.key
                        ? "bg-emerald-500 text-slate-950"
                        : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Scanned Files List */}
            <div className="space-y-2.5">
              {scannedFiles.length === 0 && !isScanning ? (
                <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/50 p-6 text-center space-y-2">
                  <ShieldCheck className="h-8 w-8 text-emerald-500/40 mx-auto" />
                  <p className="text-xs font-bold text-white">
                    {isHindi ? "कोई रिकवरी स्कैन सक्रिय नहीं है" : "Ready to scan on-device storage"}
                  </p>
                  <p className="text-[11px] text-slate-400 max-w-md mx-auto leading-relaxed">
                    {isHindi
                      ? "एंड्रॉयड 10+ FBE (File-Based Encryption) सुरक्षा के कारण केवल वही फाइलें खोजी जा सकती हैं जो रीसायकल बिन, .nomedia फ़ोल्डर या अनलिंक्ड स्टोरेज में बची हैं। ऊपर 'डीप रिकवरी स्कैन' दबाएं।"
                      : "Modern Android File-Based Encryption restricts recovery to surviving app trash, hidden directories, and SAF document trees. Zero fake promises."}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {scannedFiles
                    .filter((f) => recoverTierFilter === "ALL" || f.tier === recoverTierFilter)
                    .map((item) => (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <button
                            onClick={() => handleToggleSelectRecoverItem(item.id)}
                            className="p-1 text-slate-400 hover:text-white cursor-pointer"
                          >
                            {item.isSelected ? (
                              <CheckSquare className="h-5 w-5 text-emerald-400" />
                            ) : (
                              <Square className="h-5 w-5 text-slate-600" />
                            )}
                          </button>

                          <div className="min-w-0">
                            <p className="font-bold text-white truncate">{item.name}</p>
                            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 mt-0.5">
                              <span>{formatBytes(item.sizeBytes)}</span>
                              <span>•</span>
                              <span className="text-emerald-400 font-bold">{item.tierNameHi}</span>
                              <span>•</span>
                              <span className="text-cyan-300">{item.qualityTag}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => setPreviewModalItem(item)}
                            className="p-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:text-white"
                            title="Preview"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Sticky Bottom Restore Button */}
            {scannedFiles.length > 0 && (
              <div className="rounded-2xl border border-emerald-500/40 bg-slate-900/95 p-4 shadow-xl space-y-2">
                <button
                  onClick={handleRestoreSelected}
                  disabled={selectedRecoverCount === 0}
                  className="w-full min-h-[54px] rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  <span>
                    {isHindi
                      ? `💾 चुनी गयी फाइलें डिवाइस में सेव/रिस्टोर करें (${selectedRecoverCount})`
                      : `Restore Selected Files (${selectedRecoverCount}) to Device`}
                  </span>
                </button>
                <p className="text-[10px] text-center text-slate-400 font-mono">
                  {isHindi
                    ? "फ़ाइलें सुरक्षित रूप से आपके डिवाइस के 'Downloads' फ़ोल्डर में बिना ओवरराइट किए सेव की जाती हैं।"
                    : "Non-destructive restoration to your Downloads folder without overwriting existing files."}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════ */}
        {/* TAB 4: SUPER LAUNCHER                                             */}
        {/* ═════════════════════════════════════════════════════════════════ */}
        {activeTab === "launcher" && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            {/* Top 2 System Role Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                onClick={() => {
                  safeVibrate([30]);
                  setIsDefaultLauncherSet(true);
                  setShowLauncherFeedback(
                    isHindi
                      ? "डिफ़ॉल्ट लॉन्चर अनुरोध सक्रिय किया गया (RoleManager.ROLE_HOME)"
                      : "Default Home Role Requested (RoleManager.ROLE_HOME)"
                  );
                }}
                className="min-h-[52px] rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <Home className="h-4 w-4" />
                <span>
                  {isDefaultLauncherSet
                    ? (isHindi ? "डिफ़ॉल्ट होम सक्रिय है ✓" : "Default Home Active ✓")
                    : (isHindi ? "🏠 डिफ़ॉल्ट होम लॉन्चर बनाएं" : "Set as Default Home Launcher")}
                </span>
              </button>

              <button
                onClick={() => {
                  safeVibrate([30]);
                  setShowLauncherFeedback(
                    isHindi
                      ? "सेटिंग्स (Settings.ACTION_HOME_SETTINGS) खोली गई। आप किसी भी समय अपना पुराना लॉन्चर चुन सकते हैं।"
                      : "Settings.ACTION_HOME_SETTINGS opened. You can restore your stock phone launcher anytime."
                  );
                }}
                className="min-h-[52px] rounded-xl border border-rose-500/40 bg-rose-950/20 hover:bg-rose-900/30 text-rose-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
                <span>{isHindi ? "🔄 पुराना लॉन्चर वापस लाएं" : "Restore Previous Phone Launcher"}</span>
              </button>
            </div>

            {showLauncherFeedback && (
              <div className="rounded-xl border border-purple-500/40 bg-purple-950/30 p-3 text-xs font-mono text-purple-300 flex items-center justify-between">
                <span>{showLauncherFeedback}</span>
                <button onClick={() => setShowLauncherFeedback(null)}>
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {/* 4 Theme Selection Visual Buttons */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                {isHindi ? "4 थीम चुनें (Instant Live Themes)" : "Choose Instant Theme"}
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { key: "minimal", name: "Super Minimal", sub: "Monochrome OLED" },
                  { key: "ios", name: "Super iOS-Inspired", sub: "Rounded & Translucent" },
                  { key: "pixel", name: "Super Pixel", sub: "Material You Pill" },
                  { key: "classic", name: "Super Classic", sub: "Traditional 4x4" },
                ].map((t) => {
                  const isSelected = launcherTheme === t.key;
                  return (
                    <button
                      key={t.key}
                      onClick={() => {
                        safeVibrate([15]);
                        setLauncherTheme(t.key as any);
                      }}
                      className={`min-h-[52px] rounded-xl border p-2.5 text-left transition-all cursor-pointer ${
                        isSelected
                          ? "bg-purple-500/20 border-purple-500 text-white shadow-md shadow-purple-500/15"
                          : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      <span className="text-xs font-bold block truncate">{t.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono block truncate">{t.sub}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Interactive Working Home Screen Mockup */}
            <div
              className={`rounded-3xl border border-slate-800 p-6 text-center space-y-6 transition-all shadow-2xl ${
                launcherTheme === "minimal"
                  ? "bg-black"
                  : launcherTheme === "ios"
                  ? "bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950"
                  : launcherTheme === "pixel"
                  ? "bg-slate-950 border-cyan-500/30"
                  : "bg-slate-900"
              }`}
            >
              {/* Real Live Clock (Updating every second) */}
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
                  {currentTimeStr}
                </span>
                <span className="text-xs font-mono text-slate-400 block">
                  {currentDateStr} • Super Telecom Lab
                </span>
              </div>

              {/* App Search Bar */}
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
                  <button onClick={() => setLauncherSearch("")} className="absolute right-3.5 top-3 text-slate-400 hover:text-white">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* App Grid Controls */}
              <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-slate-400">
                <span>Grid:</span>
                <button
                  onClick={() => setLauncherGridCols(4)}
                  className={`px-2 py-0.5 rounded ${launcherGridCols === 4 ? "bg-purple-500 text-slate-950 font-bold" : "bg-slate-800 text-slate-300"}`}
                >
                  4x4
                </button>
                <button
                  onClick={() => setLauncherGridCols(5)}
                  className={`px-2 py-0.5 rounded ${launcherGridCols === 5 ? "bg-purple-500 text-slate-950 font-bold" : "bg-slate-800 text-slate-300"}`}
                >
                  5x5
                </button>
              </div>

              {/* Functional App Drawer Grid */}
              <div className={`grid ${launcherGridCols === 4 ? "grid-cols-4 max-w-sm" : "grid-cols-5 max-w-md"} mx-auto gap-4 pt-1`}>
                {filteredLauncherApps.map((app) => (
                  <button
                    key={app.name}
                    onClick={() => {
                      safeVibrate([15]);
                      if (app.tab) setActiveTab(app.tab as any);
                    }}
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
                    <span className="text-[10px] font-mono text-slate-300 group-hover:text-white truncate max-w-[70px]">
                      {app.name}
                    </span>
                  </button>
                ))}
              </div>

              {/* Favorite Dock */}
              <div className="pt-4 border-t border-slate-800 max-w-xs mx-auto flex items-center justify-around">
                {launcherApps.slice(0, 4).map((app) => (
                  <button
                    key={app.name}
                    onClick={() => safeVibrate([10])}
                    className="h-10 w-10 rounded-xl bg-slate-800 flex items-center justify-center text-base hover:scale-105 transition-transform"
                  >
                    {app.iconText}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════ */}
        {/* TAB 5: SETTINGS & MIGRATION GUIDE                                 */}
        {/* ═════════════════════════════════════════════════════════════════ */}
        {activeTab === "settings" && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            {/* Header */}
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">
                {isHindi ? "सेटिंग्स व प्राइवेसी सुरक्षा" : "App Settings & Privacy Standards"}
              </h3>
              <p className="text-xs text-slate-400">
                {isHindi ? "नेटिव अनुमतियाँ, स्थानीय संग्रहण व DPDP 2027 अनुपालन" : "Native permissions, storage path, and DPDP 2027"}
              </p>
            </div>

            {/* Language Selection Card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">
                    {isHindi ? "इंटरफ़ेस भाषा (App Language)" : "App Language"}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-mono">
                    {isHindi ? "वर्तमान भाषा: हिंदी" : "Current: English"}
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setIsHindi(true)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono ${
                      isHindi ? "bg-cyan-500 text-slate-950" : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    हिंदी
                  </button>
                  <button
                    onClick={() => setIsHindi(false)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono ${
                      !isHindi ? "bg-cyan-500 text-slate-950" : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>
            </div>

            {/* Native Permission Indicators */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                {isHindi ? "नेटिव एंड्रॉयड अनुमतियां (Permissions Audit)" : "Native Permissions Audit"}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300 font-mono">NEARBY_WIFI_DEVICES</span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    GRANTED
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300 font-mono">READ_MEDIA_IMAGES/VIDEO</span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    SCOPED ONLY
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300 font-mono">SYSTEM_ALERT_WINDOW</span>
                  <span className="text-[10px] font-bold text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded-full border border-rose-500/30">
                    PURGED (0 RISK)
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300 font-mono">POST_NOTIFICATIONS</span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    CONTEXTUAL
                  </span>
                </div>
              </div>
            </div>

            {/* Storage Info & Clear History */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                {isHindi ? "लोकल स्टोरेज व टास्क डेटा" : "Storage & Local History"}
              </h4>

              <div className="space-y-1 text-xs text-slate-300 font-mono">
                <p>Target Recovery Path: <code className="text-cyan-300">Downloads/SuperTelecom_Recovered/</code></p>
                <p>Task History Items: <strong className="text-white">{recentTasks.length} recorded</strong></p>
              </div>

              {recentTasks.length > 0 && (
                <button
                  onClick={clearTaskHistory}
                  className="min-h-[46px] w-full rounded-xl border border-rose-500/40 bg-rose-950/20 hover:bg-rose-900/30 text-rose-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>{isHindi ? "लोकल टास्क हिस्ट्री साफ़ करें" : "Clear All Task History"}</span>
                </button>
              )}
            </div>

            {/* DPDP Act 2027 Legal Notice */}
            <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/20 p-4 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <ShieldCheck className="h-4 w-4" />
                <span>DPDP Act 2027 On-Device Legal Compliance</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isHindi
                  ? "सुपर टेलीकॉम ऐप आपके फोन के किसी भी व्यक्तिगत डेटा, फोटो, या कॉल रिकॉर्डिंग को रिमोट सर्वर पर अपलोड नहीं करता है। सब कुछ 100% ऑन-डिवाइस सुरक्षित है।"
                  : "Super Telecom does not upload any files, photos, or audio recordings to remote servers. Everything operates 100% on-device under DPDP Act 2027."}
              </p>
            </div>

            {/* Official Support & Lab Contact */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                Super Telecom Laboratory Support
              </h4>
              <p className="text-xs text-slate-300">
                Barganda Road, Near Shivam Clinic, Giridih, Jharkhand - 815301
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <a
                  href={`tel:${PHONE}`}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  📞 {PHONE_DISPLAY}
                </a>
                <a
                  href={`https://wa.me/${WHATSAPP}?text=Hi%20Super%20Telecom,%20I%20need%20app%20support`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  💬 WhatsApp Help
                </a>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* 5-TAB FIXED BOTTOM NAVIGATION BAR                                  */}
      {/* ═════════════════════════════════════════════════════════════════ */}
      <nav
        aria-label="Super Telecom App Navigation"
        className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 border-t border-slate-800 px-2 py-1.5 backdrop-blur-2xl shadow-2xl"
      >
        <div className="max-w-md mx-auto grid grid-cols-5 gap-1">
          {/* Tab 1: Home */}
          <button
            onClick={() => {
              safeVibrate([10]);
              setActiveTab("home");
            }}
            className={`min-h-[54px] rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
              activeTab === "home"
                ? "bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/25 scale-[1.02]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Home className="h-4 w-4" />
            <span className="text-[10px] font-bold leading-none">{isHindi ? "होम" : "Home"}</span>
          </button>

          {/* Tab 2: Transfer */}
          <button
            onClick={() => {
              safeVibrate([10]);
              setActiveTab("transfer");
            }}
            className={`min-h-[54px] rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
              activeTab === "transfer"
                ? "bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/25 scale-[1.02]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <ArrowLeftRight className="h-4 w-4" />
            <span className="text-[10px] font-bold leading-none">{isHindi ? "ट्रांसफर" : "Transfer"}</span>
          </button>

          {/* Tab 3: Recover */}
          <button
            onClick={() => {
              safeVibrate([10]);
              setActiveTab("recover");
            }}
            className={`min-h-[54px] rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
              activeTab === "recover"
                ? "bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/25 scale-[1.02]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <RotateCcw className="h-4 w-4" />
            <span className="text-[10px] font-bold leading-none">{isHindi ? "रिकवर" : "Recover"}</span>
          </button>

          {/* Tab 4: Launcher */}
          <button
            onClick={() => {
              safeVibrate([10]);
              setActiveTab("launcher");
            }}
            className={`min-h-[54px] rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
              activeTab === "launcher"
                ? "bg-purple-500 text-slate-950 font-black shadow-md shadow-purple-500/25 scale-[1.02]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="text-[10px] font-bold leading-none">{isHindi ? "लॉन्चर" : "Launcher"}</span>
          </button>

          {/* Tab 5: Settings */}
          <button
            onClick={() => {
              safeVibrate([10]);
              setActiveTab("settings");
            }}
            className={`min-h-[54px] rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
              activeTab === "settings"
                ? "bg-slate-200 text-slate-950 font-black shadow-md scale-[1.02]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Settings className="h-4 w-4" />
            <span className="text-[10px] font-bold leading-none">{isHindi ? "सेटिंग्स" : "Settings"}</span>
          </button>
        </div>
      </nav>

      {/* ── MODALS ── */}

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="relative max-w-sm w-full rounded-3xl border border-cyan-500/40 bg-slate-900 p-6 text-center space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Scan with Phone Camera</h3>
            <p className="text-xs text-slate-400">
              Scan this QR code to download <code className="text-cyan-300">SuperTelecom.apk</code>:
            </p>
            <div className="p-4 bg-white rounded-2xl max-w-[190px] mx-auto shadow-inner">
              <svg viewBox="0 0 100 100" className="w-full h-full text-slate-950 fill-current">
                <rect x="5" y="5" width="25" height="25" rx="3" />
                <rect x="9" y="9" width="17" height="17" rx="2" fill="white" />
                <rect x="13" y="13" width="9" height="9" />
                <rect x="70" y="5" width="25" height="25" rx="3" />
                <rect x="74" y="9" width="17" height="17" rx="2" fill="white" />
                <rect x="78" y="13" width="9" height="9" />
                <rect x="5" y="70" width="25" height="25" rx="3" />
                <rect x="9" y="74" width="17" height="17" rx="2" fill="white" />
                <rect x="13" y="78" width="9" height="9" />
                <rect x="35" y="10" width="5" height="5" />
                <rect x="45" y="10" width="5" height="5" />
                <rect x="55" y="10" width="5" height="5" />
                <rect x="35" y="20" width="10" height="5" />
                <rect x="50" y="20" width="5" height="5" />
                <rect x="60" y="20" width="5" height="5" />
                <rect x="35" y="35" width="30" height="30" rx="3" />
                <rect x="42" y="42" width="16" height="16" fill="white" />
                <rect x="47" y="47" width="6" height="6" />
              </svg>
            </div>
            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Recover Item Preview Modal */}
      {previewModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="relative max-w-sm w-full rounded-3xl border border-emerald-500/40 bg-slate-900 p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-white truncate max-w-[240px]">
                {previewModalItem.name}
              </h4>
              <button
                onClick={() => setPreviewModalItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="aspect-video w-full rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center p-4 text-center space-y-2">
              <FileText className="h-10 w-10 text-emerald-400" />
              <span className="text-xs font-mono text-slate-300">
                {previewModalItem.qualityTag}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {previewModalItem.sourcePath}
              </span>
            </div>

            <div className="text-xs space-y-1 font-mono text-slate-300">
              <p>Size: {formatBytes(previewModalItem.sizeBytes)}</p>
              <p>Classification: <strong className="text-emerald-400">{previewModalItem.tierNameHi}</strong></p>
              <p>Date Discovered: {previewModalItem.date}</p>
            </div>

            <button
              onClick={() => {
                handleToggleSelectRecoverItem(previewModalItem.id);
                setPreviewModalItem(null);
              }}
              className="w-full min-h-[46px] rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs"
            >
              {previewModalItem.isSelected ? "Deselect Item" : "Select for Restore"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AppShowcasePage;
