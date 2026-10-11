import React, { useEffect, useState } from "react";
import {
  Sparkles,
  MessageCircle,
  Play,
  X,
  Maximize2,
  Calendar,
  Layers,
  Wrench,
  Camera,
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

export interface DailyUpdate {
  id: string;
  title: string;
  description: string;
  media_url: string;
  media_type: "image" | "video";
  created_at: string;
  is_published?: boolean;
}

const DEFAULT_UPDATES: DailyUpdate[] = [
  {
    id: "default-1",
    title: "Microscope Motherboard Soldering",
    description:
      "Bench diagnosis of power management circuitry and microscopic jumper soldering under our 45X optical stereo microscope at Barganda Road.",
    media_url:
      "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1200&q=80",
    media_type: "image",
    created_at: new Date().toISOString(),
  },
  {
    id: "default-2",
    title: "Precision Electronics Micro-rework",
    description:
      "Hot-air BGA reflow and thermal IC desoldering workstation maintaining strict ESD safety protocols for iPhone and Android logic boards.",
    media_url:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
    media_type: "image",
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "default-3",
    title: "Clean Hardware Diagnostics",
    description:
      "Digital multi-meter and DC power curve analysis isolating shorted capacitors and parasitic battery drain circuits.",
    media_url:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    media_type: "image",
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "default-4",
    title: "Display Restoration Bench",
    description:
      "Heated vacuum separator and precision wire delamination bench restoring shattered outer glass while preserving original OLED panels.",
    media_url:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80",
    media_type: "image",
    created_at: new Date(Date.now() - 259200000).toISOString(),
  },
];

const WHATSAPP_PHONE = "918002903643";

export const DailyUpdatesSection: React.FC = () => {
  const [updates, setUpdates] = useState<DailyUpdate[]>(DEFAULT_UPDATES);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeModalMedia, setActiveModalMedia] = useState<{
    url: string;
    type: "image" | "video";
    title: string;
  } | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchUpdates = async () => {
      if (!isSupabaseConfigured) {
        setUpdates(DEFAULT_UPDATES);
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from("daily_updates")
          .select("*")
          .eq("is_published", true)
          .order("created_at", { ascending: false })
          .limit(12);

        if (!mounted) return;

        if (!error && data && data.length > 0) {
          setUpdates(data);
        } else {
          // Keep default fallback updates so the section is always populated
          setUpdates(DEFAULT_UPDATES);
        }
      } catch {
        if (mounted) setUpdates(DEFAULT_UPDATES);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchUpdates();

    return () => {
      mounted = false;
    };
  }, []);

  const handleWhatsAppQuery = (update: DailyUpdate) => {
    const text = `Hi Super Telecom, I saw your update on "${update.title}". Can you help me with a similar repair or enquiry?`;
    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section
      id="daily-updates"
      className="relative w-full py-24 px-4 sm:px-6 lg:px-8 bg-slate-950 border-t border-cyan-950/40 text-slate-100 overflow-hidden"
    >
      {/* Background Cyber Ambient Glow */}
      <div className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-cyan-500/10 blur-[150px] rounded-full" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Lab Diagnostics &amp; Case Studies
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight font-display">
            Technical Case Studies &amp; <span className="text-cyan-400">Bench Procedures</span>
          </h2>
          <p className="mt-2 text-slate-400 text-xs sm:text-sm leading-relaxed">
            Verified micro-soldering, trace repair, and hardware recovery procedures conducted at Super Telecom Giridih.
          </p>
        </div>

        {/* Simplified Compact 3-Column Minimalist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {updates.map((post) => (
            <div
              key={post.id}
              className="group rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-cyan-500/40 p-3.5 flex flex-col justify-between transition-all duration-200"
            >
              <div>
                {/* Neat Thumbnail */}
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-slate-950 border border-slate-800/80 mb-3">
                  {post.media_type === "video" ? (
                    <div className="relative w-full h-full">
                      <video
                        src={post.media_url}
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                        onMouseEnter={(e) => (e.target as HTMLVideoElement).play().catch(() => {})}
                        onMouseLeave={(e) => (e.target as HTMLVideoElement).pause()}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setActiveModalMedia({
                            url: post.media_url,
                            type: "video",
                            title: post.title,
                          })
                        }
                        aria-label="Play video full view"
                        className="absolute inset-0 m-auto h-10 w-10 rounded-full bg-cyan-500/90 hover:bg-cyan-400 text-slate-950 flex items-center justify-center shadow-md transition-transform hover:scale-105"
                      >
                        <Play className="h-4 w-4 ml-0.5 fill-slate-950" />
                      </button>
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 border border-cyan-500/30 text-[9px] font-mono text-cyan-300">
                        VIDEO
                      </span>
                    </div>
                  ) : (
                    <div
                      className="relative w-full h-full cursor-pointer overflow-hidden"
                      onClick={() =>
                        setActiveModalMedia({
                          url: post.media_url,
                          type: "image",
                          title: post.title,
                        })
                      }
                    >
                      <img
                        src={post.media_url}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 border border-slate-700 text-[9px] font-mono text-slate-300">
                        BENCH PHOTO
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                    <Calendar className="h-3 w-3 text-cyan-400" />
                    <span>
                      {new Date(post.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {post.description}
                  </p>
                </div>
              </div>

              {/* Subtle View Diagnostic Log Button */}
              <div className="pt-2.5 mt-3 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() =>
                    setActiveModalMedia({
                      url: post.media_url,
                      type: post.media_type,
                      title: post.title,
                    })
                  }
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <Wrench className="h-3.5 w-3.5" />
                  <span>View Diagnostic Log</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleWhatsAppQuery(post)}
                  aria-label="Ask on WhatsApp"
                  title="Ask on WhatsApp"
                  className="text-slate-400 hover:text-emerald-400 transition-colors p-1"
                >
                  <MessageCircle className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Transparent Procedural Disclaimer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400 font-mono max-w-2xl mx-auto leading-relaxed">
            Note: Workshop demonstrations illustrate diagnostic and repair techniques practiced at Super Telecom Giridih. Free physical inspection and price confirmation are provided before starting any device repair.
          </p>
        </div>
      </div>

      {/* Lightbox / Zoom Preview Modal */}
      {activeModalMedia && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-up"
          onClick={() => setActiveModalMedia(null)}
        >
          <div
            className="relative max-w-4xl w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3 border-b border-slate-800">
              <span className="text-sm font-semibold text-white truncate max-w-md">
                {activeModalMedia.title}
              </span>
              <button
                type="button"
                onClick={() => setActiveModalMedia(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center justify-center max-h-[75vh] overflow-hidden bg-black p-2">
              {activeModalMedia.type === "video" ? (
                <video
                  src={activeModalMedia.url}
                  controls
                  autoPlay
                  className="max-h-[70vh] w-auto rounded-lg"
                />
              ) : (
                <img
                  src={activeModalMedia.url}
                  alt={activeModalMedia.title}
                  className="max-h-[70vh] w-auto object-contain rounded-lg"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default DailyUpdatesSection;
