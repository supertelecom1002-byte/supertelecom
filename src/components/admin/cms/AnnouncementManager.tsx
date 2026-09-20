import React, { useEffect, useState } from "react";
import {
  Megaphone,
  Check,
  Eye,
  EyeOff,
  Sparkles,
  ExternalLink,
  Clock,
  Tag,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export interface AnnouncementData {
  id: string;
  headline: string;
  badge_text: string;
  action_text: string;
  action_url: string;
  theme: "cyan" | "amber" | "emerald" | "rose";
  is_active: boolean;
  expires_at?: string;
}

export const DEFAULT_ANNOUNCEMENT: AnnouncementData = {
  id: "main_announcement",
  headline: "Express Same-Day Mobile Repair Service on Barganda Road, Giridih. Free Diagnostics!",
  badge_text: "LIVE WORKSHOP",
  action_text: "WhatsApp Diagnosis",
  action_url: "https://wa.me/918002903643?text=Hi%20Super%20Telecom,%20I%20need%20a%20repair%20quote",
  theme: "cyan",
  is_active: true,
};

export const AnnouncementManager: React.FC = () => {
  const [announcement, setAnnouncement] = useState<AnnouncementData>(DEFAULT_ANNOUNCEMENT);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchAnnouncement = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("site_announcements")
        .select("*")
        .eq("id", "main_announcement")
        .maybeSingle();

      if (!error && data) {
        setAnnouncement({
          id: data.id || "main_announcement",
          headline: data.headline || DEFAULT_ANNOUNCEMENT.headline,
          badge_text: data.badge_text || DEFAULT_ANNOUNCEMENT.badge_text,
          action_text: data.action_text || DEFAULT_ANNOUNCEMENT.action_text,
          action_url: data.action_url || DEFAULT_ANNOUNCEMENT.action_url,
          theme: data.theme || DEFAULT_ANNOUNCEMENT.theme,
          is_active: data.is_active !== undefined ? data.is_active : true,
          expires_at: data.expires_at,
        });
      } else {
        // Check localStorage fallback
        const local = localStorage.getItem("st_site_announcement");
        if (local) setAnnouncement(JSON.parse(local));
      }
    } catch {
      const local = localStorage.getItem("st_site_announcement");
      if (local) setAnnouncement(JSON.parse(local));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncement();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);

    try {
      // Save to localStorage for instant SSR/client fallback
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("st_site_announcement", JSON.stringify(announcement));
      }

      // Upsert into Supabase
      const { error } = await supabase.from("site_announcements").upsert([
        {
          ...announcement,
          id: "main_announcement",
          updated_at: new Date().toISOString(),
        },
      ]);

      if (error) console.warn("Supabase announcement upsert:", error.message);

      setStatus({ type: "success", text: "Top announcement banner updated successfully!" });
    } catch (err: any) {
      setStatus({ type: "error", text: err.message || "Failed to save announcement." });
    } finally {
      setSaving(false);
    }
  };

  const getThemeBadge = (theme: string) => {
    switch (theme) {
      case "amber":
        return "bg-amber-400 text-slate-950 shadow-amber-400/20";
      case "emerald":
        return "bg-emerald-400 text-slate-950 shadow-emerald-400/20";
      case "rose":
        return "bg-rose-400 text-slate-950 shadow-rose-400/20";
      default:
        return "bg-cyan-400 text-slate-950 shadow-cyan-400/20";
    }
  };

  const getThemeBorder = (theme: string) => {
    switch (theme) {
      case "amber":
        return "border-amber-500/30 bg-amber-950/30 text-amber-300";
      case "emerald":
        return "border-emerald-500/30 bg-emerald-950/30 text-emerald-300";
      case "rose":
        return "border-rose-500/30 bg-rose-950/30 text-rose-300";
      default:
        return "border-cyan-500/30 bg-cyan-950/30 text-cyan-300";
    }
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-cyan-950 border border-cyan-500/30 text-cyan-400">
              <Megaphone className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-2xl font-extrabold text-white">Site-Wide Alert &amp; Marquee Banner</h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Display urgent announcements, festive repair offers, or workshop notices at the very top of all pages.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAnnouncement((prev) => ({ ...prev, is_active: !prev.is_active }))}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold border transition-all ${
              announcement.is_active
                ? "bg-emerald-950/70 border-emerald-500/40 text-emerald-300"
                : "bg-slate-800 border-slate-700 text-slate-400"
            }`}
          >
            {announcement.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            {announcement.is_active ? "Banner Active" : "Banner Hidden"}
          </button>
        </div>
      </div>

      {status && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold ${
            status.type === "success"
              ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/30"
              : "bg-rose-950/80 text-rose-300 border border-rose-500/30"
          }`}
        >
          {status.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {status.text}
        </div>
      )}

      {/* Live Preview Box */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
        <span className="text-xs uppercase font-mono tracking-wider text-slate-400 block">
          Live Marquee Preview ({announcement.is_active ? "Currently Shown" : "Currently Disabled"})
        </span>

        <div
          className={`w-full p-3 sm:px-6 sm:py-2.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-lg transition-all ${
            announcement.is_active ? getThemeBorder(announcement.theme) : "opacity-40 border-slate-800 bg-slate-950 text-slate-500"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide shadow-sm flex-none ${getThemeBadge(
                announcement.theme
              )}`}
            >
              {announcement.badge_text || "NOTICE"}
            </span>
            <span className="font-medium text-slate-100">{announcement.headline}</span>
          </div>

          {announcement.action_text && (
            <a
              href={announcement.action_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-none inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-[11px] border border-white/10"
            >
              {announcement.action_text}
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>

      {/* Editor Form */}
      <form onSubmit={handleSave} className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-cyan-400" />
          Edit Announcement Content
        </h3>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Headline Text *
          </label>
          <textarea
            rows={2}
            required
            value={announcement.headline}
            onChange={(e) => setAnnouncement((prev) => ({ ...prev, headline: e.target.value }))}
            placeholder="e.g. Same-Day Screen Replacements available all week at Barganda Road..."
            className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Badge Label
            </label>
            <input
              type="text"
              value={announcement.badge_text}
              onChange={(e) => setAnnouncement((prev) => ({ ...prev, badge_text: e.target.value }))}
              placeholder="LIVE WORKSHOP"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none uppercase font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Button CTA Text
            </label>
            <input
              type="text"
              value={announcement.action_text}
              onChange={(e) => setAnnouncement((prev) => ({ ...prev, action_text: e.target.value }))}
              placeholder="WhatsApp Diagnosis"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Theme Accent Color
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(["cyan", "amber", "emerald", "rose"] as const).map((col) => (
                <button
                  key={col}
                  type="button"
                  onClick={() => setAnnouncement((prev) => ({ ...prev, theme: col }))}
                  className={`py-2 rounded-xl text-xs font-bold capitalize border transition-all ${
                    announcement.theme === col
                      ? "border-white bg-slate-800 text-white"
                      : "border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {col}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            CTA Action Destination (WhatsApp Link or Internal Page)
          </label>
          <input
            type="text"
            value={announcement.action_url}
            onChange={(e) => setAnnouncement((prev) => ({ ...prev, action_url: e.target.value }))}
            placeholder="https://wa.me/918002903643?text=..."
            className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none font-mono"
          />
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg transition-transform hover:scale-[1.02] disabled:opacity-50"
          >
            {saving ? "Saving Changes..." : "Save Announcement"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AnnouncementManager;
