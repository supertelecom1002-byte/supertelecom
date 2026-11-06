import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, ArrowRight, Smartphone, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";
import { SITE_URL } from "@/data/site";
import { KNOWN_RELEASE_APK } from "@/utils/apkDownloadManager";
import { safeVibrate } from "@/utils/safeVibrate";

export const Route = createFileRoute("/download")({
  head: () => ({
    meta: [
      { title: `Download Super Telecom Android App (v${KNOWN_RELEASE_APK.versionName}) | Official APK` },
      { name: "description", content: `Official direct download page for Super Telecom Native Android App v${KNOWN_RELEASE_APK.versionName}. 100% on-device Wi-Fi Direct Transfer, Recovery, and Launcher.` },
      { property: "og:title", content: `Download Super Telecom App v${KNOWN_RELEASE_APK.versionName}` },
      { property: "og:description", content: "Official native Android application APK for Super Telecom." },
      { property: "og:url", content: `${SITE_URL}/download` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/download` }],
  }),
  component: CanonicalDownloadPage,
});

export function CanonicalDownloadPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 text-center select-none">
      <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-slate-900 border border-cyan-500/30 space-y-5 shadow-2xl backdrop-blur-xl">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30 shadow-lg shadow-cyan-500/20">
          <Download className="w-8 h-8 animate-bounce text-cyan-400" />
        </div>

        <div className="space-y-1.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold uppercase">
            <Smartphone className="w-3.5 h-3.5" />
            Official Native APK v{KNOWN_RELEASE_APK.versionName}
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-white pt-1">
            Super Telecom APK डाउनलोड
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed">
            100% ऑफिशियल डायरेक्ट डाउनलोड ({KNOWN_RELEASE_APK.fileSizeHuman})। शुद्ध नेटिव कोड, शून्य मालवेयर, बिना किसी रुकावट के।
          </p>
        </div>

        {/* PRIMARY DOWNLOAD BUTTON (DIRECT, UNBLOCKED ANCHOR) */}
        <div className="pt-1">
          <a
            href={KNOWN_RELEASE_APK.downloadUrl}
            download={KNOWN_RELEASE_APK.downloadFilename}
            onClick={() => safeVibrate([30, 20, 40])}
            className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-cyan-500/30 active:scale-95 transition-all cursor-pointer"
          >
            <Download className="w-5 h-5 stroke-[2.5]" />
            <span>APK डाउनलोड करें ({KNOWN_RELEASE_APK.fileSizeHuman})</span>
          </a>
        </div>

        {/* IMPORTANT UPDATE / INSTALL GUIDE FOR USERS */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-left space-y-2 text-xs">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>अपडेट या इंस्टॉल नहीं हो रहा? (जरूरी निर्देश):</span>
          </div>
          <ol className="list-decimal list-inside space-y-1 text-slate-300 text-[11px] leading-relaxed">
            <li>
              <strong>पुराना ऐप अनइंस्टॉल करें:</strong> यदि फोन में पुराना Super Telecom ऐप पहले से है, तो पहले उसे डिलीट/अनइंस्टॉल करें (Android सिक्योरिटी सिग्नेचर मैच के लिए)।
            </li>
            <li>
              <strong>डाउनलोड पूरा होने पर:</strong> नोटिफिकेशन या फ़ाइल मैनेजर में जाकर <code className="text-cyan-300">SuperTelecom-Release.apk</code> पर क्लिक करें।
            </li>
            <li>
              <strong>Unknown Apps अनुमति दें:</strong> यदि पूछा जाए तो Chrome / Files को "Install unknown apps" की परमिशन Allow करें।
            </li>
          </ol>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-left space-y-1.5 text-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span>Package Name:</span>
            <span className="font-mono text-cyan-300">{KNOWN_RELEASE_APK.packageId}</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>Version:</span>
            <span className="font-mono text-emerald-400">v{KNOWN_RELEASE_APK.versionName} (Build {KNOWN_RELEASE_APK.versionCode})</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>File Size:</span>
            <span className="font-mono text-white">{KNOWN_RELEASE_APK.fileSizeHuman}</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>Security Check:</span>
            <span className="font-mono text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Play Protect Safe
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <Link to="/app" className="hover:text-cyan-400 transition-colors flex items-center gap-1 font-mono">
            <span>Features Showcase (/app)</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
          <span className="flex items-center gap-1 text-emerald-400 font-mono text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified Native
          </span>
        </div>
      </div>
    </div>
  );
}

export default CanonicalDownloadPage;
