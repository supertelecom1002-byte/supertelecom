import React, { useEffect, useState } from "react";
import { X, ExternalLink, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import {
  DEFAULT_ANNOUNCEMENT,
  type AnnouncementData,
} from "@/components/admin/cms/AnnouncementManager";

export const AnnouncementBanner: React.FC = () => {
  const [data, setData] = useState<AnnouncementData | null>(null);
  const [dismissed, setDismissed] = useState<boolean>(false);

  useEffect(() => {
    // Check if dismissed in this session
    try {
      const isDismissed = sessionStorage.getItem("st_banner_dismissed");
      if (isDismissed === "true") {
        setDismissed(true);
        return;
      }
    } catch {
      // ignore storage error
    }

    // Load announcement
    const loadBanner = async () => {
      try {
        const { data: dbData, error } = await supabase
          .from("site_announcements")
          .select("*")
          .eq("id", "main_announcement")
          .maybeSingle();

        if (!error && dbData) {
          setData(dbData);
          return;
        }
      } catch {
        // ignore
      }

      // Check localStorage
      try {
        const cached = localStorage.getItem("st_site_announcement");
        if (cached) {
          setData(JSON.parse(cached));
          return;
        }
      } catch {
        // ignore
      }

      setData(DEFAULT_ANNOUNCEMENT);
    };

    loadBanner();
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem("st_banner_dismissed", "true");
    } catch {
      // ignore
    }
  };

  if (!data || !data.is_active || dismissed) {
    return null;
  }

  const getThemeStyles = () => {
    switch (data.theme) {
      case "amber":
        return {
          bar: "bg-amber-950/95 border-amber-500/40 text-amber-200",
          badge: "bg-amber-400 text-slate-950 shadow-amber-400/20",
          btn: "bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 border-amber-400/40",
          dot: "bg-amber-400",
        };
      case "emerald":
        return {
          bar: "bg-emerald-950/95 border-emerald-500/40 text-emerald-200",
          badge: "bg-emerald-400 text-slate-950 shadow-emerald-400/20",
          btn: "bg-emerald-400/20 hover:bg-emerald-400/30 text-emerald-200 border-emerald-400/40",
          dot: "bg-emerald-400",
        };
      case "rose":
        return {
          bar: "bg-rose-950/95 border-rose-500/40 text-rose-200",
          badge: "bg-rose-400 text-slate-950 shadow-rose-400/20",
          btn: "bg-rose-400/20 hover:bg-rose-400/30 text-rose-200 border-rose-400/40",
          dot: "bg-rose-400",
        };
      default:
        return {
          bar: "bg-slate-950/95 border-cyan-500/40 text-cyan-200",
          badge: "bg-cyan-400 text-slate-950 shadow-cyan-400/20",
          btn: "bg-cyan-400/20 hover:bg-cyan-400/30 text-cyan-200 border-cyan-400/40",
          dot: "bg-cyan-400",
        };
    }
  };

  const theme = getThemeStyles();

  return (
    <aside
      aria-label="Site announcement"
      className={`relative z-40 border-b px-3 py-2 sm:px-6 sm:py-2.5 backdrop-blur-md transition-all ${theme.bar}`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 text-xs">
        <div className="flex flex-1 items-center gap-2.5 overflow-hidden">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider flex-none uppercase shadow-sm ${theme.badge}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${theme.dot}`} />
            {data.badge_text || "NOTICE"}
          </span>

          <p className="truncate font-medium text-white text-[11px] sm:text-xs">
            {data.headline}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-none">
          {data.action_text && data.action_url && (
            <a
              href={data.action_url}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-bold border transition-transform hover:scale-[1.02] ${theme.btn}`}
            >
              <span>{data.action_text}</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          )}

          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss notice"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AnnouncementBanner;
