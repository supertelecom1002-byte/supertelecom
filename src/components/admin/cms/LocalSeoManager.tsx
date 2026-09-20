import React, { useEffect, useState } from "react";
import {
  MapPin,
  Phone,
  Clock,
  Mail,
  Compass,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Globe,
  Search,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { DEFAULT_SITE_CONTENT, type SiteContent } from "@/hooks/useSiteContent";
import { STORE_ADDRESS, STORE_STREET_ADDRESS } from "@/data/site";

export const LocalSeoManager: React.FC = () => {
  const [content, setContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [googleMapsUrl, setGoogleMapsUrl] = useState<string>("https://maps.app.goo.gl/mu5XXCehEpocaZWY9");
  const [shopEmail, setShopEmail] = useState<string>("supertelecom1002@gmail.com");
  const [saving, setSaving] = useState<boolean>(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from("site_content")
        .select("*")
        .eq("id", "main_content")
        .maybeSingle();

      if (!error && data) {
        setContent({
          hero_title: data.hero_title || DEFAULT_SITE_CONTENT.hero_title,
          hero_subtitle: data.hero_subtitle || DEFAULT_SITE_CONTENT.hero_subtitle,
          cta_text: data.cta_text || DEFAULT_SITE_CONTENT.cta_text,
          shop_phone: data.shop_phone || DEFAULT_SITE_CONTENT.shop_phone,
          shop_address: data.shop_address || DEFAULT_SITE_CONTENT.shop_address,
          shop_timings: data.shop_timings || DEFAULT_SITE_CONTENT.shop_timings,
        });
        if (data.maps_url) setGoogleMapsUrl(data.maps_url);
        if (data.shop_email) setShopEmail(data.shop_email);
      }
    } catch (err) {
      console.warn("fetchContent error:", err);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);

    try {
      const payload = {
        id: "main_content",
        hero_title: content.hero_title,
        hero_subtitle: content.hero_subtitle,
        cta_text: content.cta_text,
        shop_phone: content.shop_phone,
        shop_address: content.shop_address,
        shop_timings: content.shop_timings,
        maps_url: googleMapsUrl,
        shop_email: shopEmail,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("site_content").upsert([payload]);
      if (error) throw error;

      setStatus({ type: "success", text: "Local SEO & NAP business profile updated!" });
    } catch (err: any) {
      console.error("Save error:", err);
      setStatus({ type: "error", text: err.message || "Failed to update settings." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-cyan-950 border border-cyan-500/30 text-cyan-400">
              <MapPin className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-2xl font-extrabold text-white">Local SEO, NAP &amp; Shop Meta</h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Maintain consistent Name, Address, Phone (NAP) and primary search metadata for Giridih rankings.
              </p>
            </div>
          </div>
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

      {/* Google Search Live SERP Simulator */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
        <span className="text-xs uppercase font-mono tracking-wider text-cyan-400 font-semibold block flex items-center gap-1.5">
          <Search className="h-3.5 w-3.5" /> Google Search SERP Preview (Desktop &amp; Mobile)
        </span>

        <div className="p-4 sm:p-5 rounded-2xl bg-white text-slate-900 border border-slate-300 max-w-2xl shadow-inner">
          <div className="flex items-center gap-2 text-xs text-slate-700">
            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-800 border">
              ST
            </div>
            <div>
              <span className="font-semibold block text-[13px] leading-none text-slate-900">Super Telecom</span>
              <span className="text-[11px] text-slate-500">https://www.supertelecom.shop</span>
            </div>
          </div>

          <h3 className="text-lg font-medium text-[#1a0dab] hover:underline cursor-pointer mt-1.5 leading-snug">
            {content.hero_title}
          </h3>

          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            <span className="font-semibold text-slate-800">{content.shop_address}, Giridih. </span>
            {content.hero_subtitle} — Same day repairs, genuine parts &amp; diagnostic warranty.
          </p>

          <div className="mt-2.5 pt-2 border-t border-slate-200 flex flex-wrap gap-3 text-[11px] text-[#1a0dab]">
            <span className="hover:underline cursor-pointer">Screen Replacement</span>
            <span className="text-slate-300">•</span>
            <span className="hover:underline cursor-pointer">Battery Replacement</span>
            <span className="text-slate-300">•</span>
            <span className="hover:underline cursor-pointer">Contact: {content.shop_phone}</span>
          </div>
        </div>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSave} className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-cyan-400" />
          Edit Business NAP &amp; Hero Content
        </h3>

        {/* Section 1: Hero & Branding */}
        <div className="space-y-4">
          <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold tracking-wider">
            1. Hero &amp; Search Title
          </h4>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Hero Title (Also used for H1 / SERP Title)
            </label>
            <input
              type="text"
              required
              value={content.hero_title}
              onChange={(e) => setContent((prev) => ({ ...prev, hero_title: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Hero Subtitle / Description
            </label>
            <textarea
              rows={2}
              value={content.hero_subtitle}
              onChange={(e) => setContent((prev) => ({ ...prev, hero_subtitle: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Primary CTA Button Label
            </label>
            <input
              type="text"
              value={content.cta_text}
              onChange={(e) => setContent((prev) => ({ ...prev, cta_text: e.target.value }))}
              className="w-full sm:w-64 px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Section 2: NAP (Name, Address, Phone) */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold tracking-wider">
            2. Physical NAP Consistency
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-cyan-400" />
                Primary Shop Phone Number
              </label>
              <input
                type="text"
                required
                value={content.shop_phone}
                onChange={(e) => setContent((prev) => ({ ...prev, shop_phone: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-cyan-400" />
                Store Timings
              </label>
              <input
                type="text"
                required
                value={content.shop_timings}
                onChange={(e) => setContent((prev) => ({ ...prev, shop_timings: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-cyan-400" />
              Store Address (Barganda Road, Giridih)
            </label>
            <input
              type="text"
              required
              value={content.shop_address}
              onChange={(e) => setContent((prev) => ({ ...prev, shop_address: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-cyan-400" />
                Contact Email
              </label>
              <input
                type="email"
                value={shopEmail}
                onChange={(e) => setShopEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Compass className="h-3.5 w-3.5 text-cyan-400" />
                Google Maps Link
              </label>
              <input
                type="url"
                value={googleMapsUrl}
                onChange={(e) => setGoogleMapsUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none font-mono"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg transition-transform hover:scale-[1.02] disabled:opacity-50"
          >
            {saving ? "Saving Changes..." : "Save Business Profile"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LocalSeoManager;
