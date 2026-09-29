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
import { supabase } from "@/lib/supabaseClient";

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
    title: "Logic Board Power IC Diagnostic Inspection",
    description:
      "Bench diagnosis of power management circuitry and surface-mount capacitors under high-magnification optical microscope at our Barganda Road lab.",
    media_url:
      "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1000&q=80",
    media_type: "image",
    created_at: new Date().toISOString(),
  },
  {
    id: "default-2",
    title: "Curved AMOLED Touch Glass Separation Procedure",
    description:
      "Demonstration of heated precision wire separation to detach cracked outer touch glass while safeguarding the original AMOLED panel.",
    media_url:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80",
    media_type: "image",
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "default-3",
    title: "Ultrasonic Chemical Bath for Liquid Damage",
    description:
      "Transducer cleaning procedure removing oxidation and mineral buildup from submerged smartphone motherboard components before micro-soldering.",
    media_url:
      "https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=1000&q=80",
    media_type: "image",
    created_at: new Date(Date.now() - 172800000).toISOString(),
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
      } catch (err) {
        console.warn("Daily updates fetch fallback:", err);
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
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Latest Workshop Updates
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-display">
            Technical Case Studies &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Bench Procedures</span>
          </h2>
          <p className="mt-4 text-slate-400 text-sm sm:text-base leading-relaxed">
            Bench diagnostic procedures and repair demonstrations from our workshop at Barganda Road, Giridih — motherboard micro-soldering, display glass laminations, and component testing.
          </p>
        </div>

        {/* Updates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {updates.map((post) => (
            <div
              key={post.id}
              className="group rounded-3xl border border-slate-800/90 bg-slate-900/80 backdrop-blur-md overflow-hidden shadow-xl hover:border-cyan-500/50 hover:shadow-[0_0_25px_rgba(6,182,212,0.15)] transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Media Container */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
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
                        className="absolute inset-0 m-auto h-12 w-12 rounded-full bg-cyan-500/90 hover:bg-cyan-400 text-slate-950 flex items-center justify-center shadow-lg transition-transform hover:scale-110"
                      >
                        <Play className="h-5 w-5 ml-0.5 fill-slate-950" />
                      </button>
                      <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-slate-950/80 border border-cyan-500/40 text-[10px] font-mono text-cyan-400">
                        VIDEO
                      </span>
                    </div>
                  ) : (
                    <div className="relative w-full h-full cursor-pointer overflow-hidden">
                      <img
                        src={post.media_url}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onClick={() =>
                          setActiveModalMedia({
                            url: post.media_url,
                            type: "image",
                            title: post.title,
                          })
                        }
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setActiveModalMedia({
                            url: post.media_url,
                            type: "image",
                            title: post.title,
                          })
                        }
                        aria-label="Enlarge image"
                        className="absolute bottom-3 right-3 p-2 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity hover:text-cyan-400"
                      >
                        <Maximize2 className="h-4 w-4" />
                      </button>
                      <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-slate-950/80 border border-cyan-500/40 text-[10px] font-mono text-cyan-400">
                        WORKSHOP PHOTO
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-2.5 font-mono">
                    <Calendar className="h-3.5 w-3.5 text-cyan-400" />
                    <span>
                      {new Date(post.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg text-white leading-snug group-hover:text-cyan-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3">
                    {post.description}
                  </p>
                </div>
              </div>

              {/* Action Footer with WhatsApp Query */}
              <div className="p-6 pt-0 mt-2">
                <button
                  type="button"
                  onClick={() => handleWhatsAppQuery(post)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white px-4 py-2.5 text-xs sm:text-sm font-semibold shadow-md transition-transform hover:scale-[1.02]"
                >
                  <MessageCircle className="h-4 w-4 fill-white" />
                  Ask About This on WhatsApp
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
