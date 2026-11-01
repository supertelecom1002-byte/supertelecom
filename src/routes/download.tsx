import { useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Download, ArrowRight, Smartphone } from "lucide-react";
import { SITE_URL } from "@/data/site";
import { KNOWN_RELEASE_APK } from "@/utils/apkDownloadManager";

export const Route = createFileRoute("/download")({
  head: () => ({
    meta: [
      { title: "Download Super Telecom Android App (v2.4.0) | Official APK" },
      { name: "description", content: "Official download page for Super Telecom Android App. Redirecting to the public showcase at /app." },
      { name: "robots", content: "noindex, follow" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/app` }],
  }),
  component: DownloadRedirectPage,
});

export function DownloadRedirectPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Graceful automatic forward to /app
    const timer = setTimeout(() => {
      navigate({ to: "/app" });
    }, 400);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 text-center">
      <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-slate-900 border border-cyan-500/30 space-y-4 shadow-2xl">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
          <Smartphone className="w-7 h-7 animate-bounce" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold">Redirecting to App Showcase...</h1>
        <p className="text-xs text-slate-300">
          Super Telecom Android App v{KNOWN_RELEASE_APK.versionName} is now live on our unified All-India portal.
        </p>
        <div className="pt-2">
          <Link
            to="/app"
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2"
          >
            <span>Proceed to /app</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default DownloadRedirectPage;
