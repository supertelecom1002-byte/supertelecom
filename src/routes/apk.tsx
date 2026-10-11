import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { Download, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/apk")({
  server: {
    handlers: {
      GET: async () => {
        return new Response(null, {
          status: 302,
          headers: {
            Location: "/SuperTelecom.apk",
            "Content-Type": "application/vnd.android.package-archive",
            "Content-Disposition": 'attachment; filename="SuperTelecom-v2.4.0.apk"',
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      },
    },
  },
  component: ApkDirectDownloadPage,
});

function ApkDirectDownloadPage() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Trigger haptic feedback
      if ("vibrate" in navigator) {
        try {
          navigator.vibrate([30, 20, 40]);
        } catch {
          // ignore
        }
      }

      // Invisible link click to force direct browser download
      const link = document.createElement("a");
      link.href = "/SuperTelecom.apk";
      link.download = "SuperTelecom-v2.4.0.apk";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Fallback location replace if link click was prevented
      const fallbackTimer = setTimeout(() => {
        window.location.replace("/SuperTelecom.apk");
      }, 600);

      return () => clearTimeout(fallbackTimer);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 text-center select-none">
      <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-emerald-500/40 shadow-2xl space-y-4 backdrop-blur-xl animate-in fade-in">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/30">
          <Download className="w-8 h-8 animate-bounce" />
        </div>

        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider font-extrabold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/40">
            Super Telecom Direct APK v2.4.0
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-3 leading-tight">
            Starting Instant Download...
          </h1>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            Your direct Android APK download is initializing automatically. If your device prompts you, tap <strong>"Download anyway"</strong>.
          </p>
        </div>

        <div className="pt-2">
          <a
            href="/SuperTelecom.apk"
            download="SuperTelecom-v2.4.0.apk"
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 active:scale-95 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Tap Here If Download Did Not Start</span>
          </a>
        </div>

        <div className="pt-3 border-t border-slate-800 flex items-center justify-center gap-4 text-xs">
          <a
            href="/download"
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-cyan-400 transition-colors font-mono"
          >
            <span>Full Features &amp; Guide</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
