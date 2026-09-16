import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export interface SiteContent {
  hero_title: string;
  hero_subtitle: string;
  cta_text: string;
  shop_phone: string;
  shop_address: string;
  shop_timings: string;
}

export const DEFAULT_SITE_CONTENT: SiteContent = {
  hero_title: "Super Telecom — Mobile Repair Shop in Giridih",
  hero_subtitle: "Display, battery & chip-level repairs · Second-hand phones · Accessories",
  cta_text: "Book Repair",
  shop_phone: "+91 80029 03643",
  shop_address: "Barganda Road, Near Shivam Clinic",
  shop_timings: "Open Daily 9:00 AM – 9:00 PM",
};

export const useSiteContent = () => {
  const [content, setContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Wrapped in useEffect with empty dependency array [] to run only once on mount
  useEffect(() => {
    let mounted = true;

    const fetchContent = async () => {
      try {
        const { data, error: fetchErr } = await supabase
          .from("site_content")
          .select("*")
          .eq("id", "main_content")
          .maybeSingle();

        if (!mounted) return;

        if (fetchErr) {
          console.warn("useSiteContent fetch warning:", fetchErr.message);
          setError(fetchErr.message);
          setContent(DEFAULT_SITE_CONTENT);
        } else if (data) {
          setContent({
            hero_title: data.hero_title || DEFAULT_SITE_CONTENT.hero_title,
            hero_subtitle: data.hero_subtitle || DEFAULT_SITE_CONTENT.hero_subtitle,
            cta_text: data.cta_text || DEFAULT_SITE_CONTENT.cta_text,
            shop_phone: data.shop_phone || DEFAULT_SITE_CONTENT.shop_phone,
            shop_address: data.shop_address || DEFAULT_SITE_CONTENT.shop_address,
            shop_timings: data.shop_timings || DEFAULT_SITE_CONTENT.shop_timings,
          });
        }
      } catch (err: any) {
        console.warn("useSiteContent fetch error:", err);
        if (mounted) {
          setError(err.message || "Failed to load content");
          setContent(DEFAULT_SITE_CONTENT);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchContent();

    return () => {
      mounted = false;
    };
  }, []); // [] ensures single fetch on mount, preventing re-render loops

  return { content, loading, error };
};

export default useSiteContent;
