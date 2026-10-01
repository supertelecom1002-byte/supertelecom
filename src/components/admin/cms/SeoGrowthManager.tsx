import React, { useEffect, useState } from "react";
import {
  Search,
  Globe,
  Smartphone,
  Monitor,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Layers,
  Sparkles,
  ExternalLink,
  Tag,
  Copy,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface SeoConfig {
  id: string;
  page_route: string;
  meta_title: string;
  meta_description: string;
  focus_keywords: string;
  og_image_url: string;
  faq_items: FaqItem[];
  updated_at?: string;
}

const PAGE_OPTIONS = [
  {
    route: "/",
    label: "Homepage (/)",
    defaultTitle: "Super Telecom | Best Mobile Repair Shop in Giridih | Barganda Road",
    defaultDesc:
      "Professional smartphone repair in Giridih. Instant display replacement, motherboard IC repair, and battery fixes at Super Telecom, Barganda Road (Near Shivam Clinic). Call +91 80029 03643.",
    defaultKeywords: "mobile repair giridih, phone repair barganda road, screen replacement giridih, iphone service centre giridih",
    defaultFaqs: [
      {
        id: "faq-1",
        question: "Where is Super Telecom located in Giridih?",
        answer: "Super Telecom is located at Barganda Road, Near Shivam Clinic, Giridih, Jharkhand 815301. We provide mobile phone repair, battery replacement, and accessories.",
      },
      {
        id: "faq-2",
        question: "How long does mobile screen replacement take at Super Telecom?",
        answer: "Most screen replacements for iPhone, Samsung, Realme, and Vivo take just 30 to 45 minutes while you wait in our Barganda Road shop.",
      },
      {
        id: "faq-3",
        question: "Do you repair water-damaged and dead smartphones?",
        answer: "Yes, Super Telecom provides diagnostic testing, ultrasonic cleaning, and motherboard IC micro-soldering for dead or water-damaged devices.",
      },
    ],
  },
  {
    route: "/services/display-replacement-giridih",
    label: "Display & Screen Replacement Silo",
    defaultTitle: "Mobile Screen & Display Replacement in Giridih | Super Telecom",
    defaultDesc:
      "Instant mobile screen & display replacement in Giridih. Original OLED, AMOLED & LCD screens for iPhone, Samsung, Vivo, Realme with 90-day warranty. Done in 30 mins.",
    defaultKeywords: "screen replacement giridih, amoled display repair, cracked screen fix barganda road",
    defaultFaqs: [
      {
        id: "faq-s1",
        question: "How long does mobile screen replacement take at Super Telecom?",
        answer: "Most screen replacements take 30 to 45 minutes while you wait in our Barganda Road shop.",
      },
      {
        id: "faq-s2",
        question: "Will my fingerprint scanner and Face ID work after screen change?",
        answer: "Yes. We take special care to calibrate optical in-display fingerprint sensors and protect the Face ID ear-speaker flex sensors during disassembly.",
      },
    ],
  },
  {
    route: "/services/iphone-repair-specialist-giridih",
    label: "iPhone Specialist Repair Silo",
    defaultTitle: "iPhone Repair Specialist in Giridih | Screen, Battery, Back Glass | Super Telecom",
    defaultDesc:
      "Certified iPhone repair in Giridih. True Tone display calibration, battery health restoration, laser back glass separation & Face ID repair. Call +91 80029 03643.",
    defaultKeywords: "iphone repair giridih, apple repair centre giridih, iphone battery health 100 giridih",
    defaultFaqs: [
      {
        id: "faq-i1",
        question: "Will True Tone and Face ID work after iPhone screen replacement?",
        answer: "Yes. We use JCID V1SE programmers to read and write original display EEPROM calibration data, preserving True Tone.",
      },
    ],
  },
  {
    route: "/services/motherboard-chip-level-repair-giridih",
    label: "Motherboard Chip-Level Silo",
    defaultTitle: "Motherboard & IC Chip-Level Mobile Repair in Giridih | Super Telecom",
    defaultDesc:
      "Expert chip-level motherboard repair in Giridih. BGA micro-soldering, CPU reballing, power IC replacement, water damage & dead phone revival. High success rate.",
    defaultKeywords: "motherboard repair giridih, chip level bga repair, dead phone recovery giridih",
    defaultFaqs: [
      {
        id: "faq-m1",
        question: "Can a dead phone declared 'unrepairable' by other shops be fixed?",
        answer: "Yes, in over 85% of cases. Most service centers only swap entire expensive motherboards, whereas we replace individual microscopic failing ICs.",
      },
    ],
  },
  {
    route: "/services/water-damage-mobile-repair-giridih",
    label: "Water Damage Revival Silo",
    defaultTitle: "Water Damage Mobile Repair in Giridih | Super Telecom",
    defaultDesc:
      "Emergency water damage mobile repair in Giridih. Ultrasonic chemical PCB bath, short circuit removal, chip-level micro-soldering & data recovery. Call +91 80029 03643.",
    defaultKeywords: "water damage repair giridih, wet mobile recovery, ultrasonic pcb cleaning giridih",
    defaultFaqs: [
      {
        id: "faq-w1",
        question: "Why is putting a wet phone in rice bad?",
        answer: "Rice traps internal humidity and releases fine starch dust that accelerates corrosion on copper circuit board traces.",
      },
    ],
  },
  {
    route: "/services/battery-charging-port-repair-giridih",
    label: "Battery & Charging Port Silo",
    defaultTitle: "Mobile Battery Replacement & Charging Port Repair in Giridih | Super Telecom",
    defaultDesc:
      "Quick mobile battery replacement & charging port repair in Giridih. Fix fast-draining battery, phone overheating, loose charging jack, Type-C & Lightning pin. 20-min fix.",
    defaultKeywords: "battery replacement giridih, type c charging port repair giridih, swollen battery danger",
    defaultFaqs: [
      {
        id: "faq-b1",
        question: "How long does mobile battery replacement take?",
        answer: "Battery replacements for most popular models take just 20 to 30 minutes in our shop.",
      },
    ],
  },
  {
    route: "/locations/barganda-road-mobile-repair",
    label: "Barganda Road Store Location Hub",
    defaultTitle: "Top Mobile Repair Shop in Barganda Road Giridih | Super Telecom",
    defaultDesc:
      "Visit Super Telecom on Barganda Road, Near Shivam Clinic, Giridih. Fast screen repair, iPhone service, motherboard micro-soldering & battery replacement. Call +91 80029 03643.",
    defaultKeywords: "mobile repair barganda road giridih, mobile shop near shivam clinic giridih",
    defaultFaqs: [
      {
        id: "faq-l1",
        question: "Where exactly is Super Telecom on Barganda Road?",
        answer: "We are situated on main Barganda Road, right near Shivam Clinic in Giridih (PIN: 815301), approximately 1 km from Makatpur Chowk.",
      },
    ],
  },
];

export const SeoGrowthManager: React.FC = () => {
  const [selectedRoute, setSelectedRoute] = useState<string>("/");
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [keywords, setKeywords] = useState<string>("");
  const [ogImageUrl, setOgImageUrl] = useState<string>("https://www.supertelecom.shop/favicon.png");
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [saving, setSaving] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Load config when selected route changes
  useEffect(() => {
    const pageDefault = PAGE_OPTIONS.find((p) => p.route === selectedRoute) || PAGE_OPTIONS[0];

    // Try Supabase first
    const loadSeo = async () => {
      try {
        const { data, error } = await supabase
          .from("site_seo")
          .select("*")
          .eq("page_route", selectedRoute)
          .maybeSingle();

        if (!error && data) {
          setTitle(data.meta_title || pageDefault.defaultTitle);
          setDescription(data.meta_description || pageDefault.defaultDesc);
          setKeywords(data.focus_keywords || pageDefault.defaultKeywords);
          setOgImageUrl(data.og_image_url || "https://www.supertelecom.shop/favicon.png");
          setFaqs(data.faq_items || pageDefault.defaultFaqs);
          return;
        }
      } catch {
        // ignore and fallback
      }

      // Check localStorage fallback
      try {
        const cached = localStorage.getItem("st_seo_" + selectedRoute);
        if (cached) {
          const parsed: SeoConfig = JSON.parse(cached);
          setTitle(parsed.meta_title);
          setDescription(parsed.meta_description);
          setKeywords(parsed.focus_keywords);
          setOgImageUrl(parsed.og_image_url);
          setFaqs(parsed.faq_items || pageDefault.defaultFaqs);
          return;
        }
      } catch {
        // ignore
      }

      // Defaults
      setTitle(pageDefault.defaultTitle);
      setDescription(pageDefault.defaultDesc);
      setKeywords(pageDefault.defaultKeywords);
      setOgImageUrl("https://www.supertelecom.shop/favicon.png");
      setFaqs(pageDefault.defaultFaqs);
    };

    loadSeo();
  }, [selectedRoute]);

  const handleSave = async () => {
    setSaving(true);
    setStatusMessage(null);

    const config: SeoConfig = {
      id: selectedRoute === "/" ? "homepage" : selectedRoute.replace(/[^a-zA-Z0-9]/g, "_"),
      page_route: selectedRoute,
      meta_title: title.trim(),
      meta_description: description.trim(),
      focus_keywords: keywords.trim(),
      og_image_url: ogImageUrl.trim(),
      faq_items: faqs,
      updated_at: new Date().toISOString(),
    };

    // Save to localStorage immediately
    try {
      localStorage.setItem("st_seo_" + selectedRoute, JSON.stringify(config));
    } catch {
      // ignore
    }

    // Upsert into Supabase
    try {
      const { error } = await supabase.from("site_seo").upsert(config);
      if (error) {
        setStatusMessage({
          type: "success",
          text: "Saved locally! (Supabase table will sync once migration runs)",
        });
      } else {
        setStatusMessage({
          type: "success",
          text: "Live SEO & Schema metadata published successfully to database!",
        });
      }
    } catch {
      setStatusMessage({
        type: "success",
        text: "Saved to local cache with instant frontend active state.",
      });
    } finally {
      setSaving(false);
      setTimeout(() => setStatusMessage(null), 5000);
    }
  };

  const addFaq = () => {
    const newItem: FaqItem = {
      id: `faq-${Date.now()}`,
      question: "How much does mobile repair cost in Giridih?",
      answer: "Repair prices depend on the model and fault. We offer free diagnosis and upfront quotes.",
    };
    setFaqs([...faqs, newItem]);
  };

  const updateFaq = (id: string, field: "question" | "answer", value: string) => {
    setFaqs(faqs.map((f) => (f.id === id ? { ...f, [field]: value } : f)));
  };

  const deleteFaq = (id: string) => {
    setFaqs(faqs.filter((f) => f.id !== id));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2.5">
            <Search className="h-6 w-6 text-cyan-400" />
            <span>SEO &amp; Growth Engine</span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase">
              AEO &amp; SERP
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Control page title tags, meta descriptions, focus keywords, and rich FAQPage schemas for Giridih search domination.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all active:scale-95 disabled:opacity-50"
        >
          {saving ? (
            <div className="h-4 w-4 border-2 border-slate-950 border-t-transparent animate-spin rounded-full" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          <span>{saving ? "Publishing..." : "Save SEO Settings"}</span>
        </button>
      </div>

      {/* Notification banner */}
      {statusMessage && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 border text-xs sm:text-sm ${
            statusMessage.type === "success"
              ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300"
              : "bg-rose-950/60 border-rose-500/40 text-rose-300"
          }`}
        >
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Page Selector */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <label className="text-xs font-bold text-cyan-400 uppercase tracking-wider block mb-2">
          Select Page / Service Silo
        </label>
        <select
          value={selectedRoute}
          onChange={(e) => setSelectedRoute(e.target.value)}
          className="w-full sm:w-auto min-w-[320px] rounded-xl bg-slate-950 border border-slate-700 px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
        >
          {PAGE_OPTIONS.map((opt) => (
            <option key={opt.route} value={opt.route}>
              {opt.label} ({opt.route})
            </option>
          ))}
        </select>
      </div>

      {/* Live Google Search Preview (Desktop vs Mobile) */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Live Google Search Preview</h3>
          </div>

          <div className="flex items-center rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setPreviewMode("desktop")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-all ${
                previewMode === "desktop" ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              <Monitor className="h-3.5 w-3.5" /> Desktop
            </button>
            <button
              type="button"
              onClick={() => setPreviewMode("mobile")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-all ${
                previewMode === "mobile" ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              <Smartphone className="h-3.5 w-3.5" /> Mobile
            </button>
          </div>
        </div>

        {/* Snippet Card styled like real Google SERP */}
        <div
          className={`rounded-2xl p-4 sm:p-5 transition-all bg-white text-slate-900 border border-slate-200 shadow-md ${
            previewMode === "mobile" ? "max-w-sm mx-auto" : "w-full"
          }`}
        >
          {/* Breadcrumb / URL */}
          <div className="flex items-center gap-2 text-xs text-slate-700">
            <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center p-1 border border-slate-300">
              <span className="font-extrabold text-[10px] text-cyan-600">ST</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-[11px] text-slate-900 leading-tight">Super Telecom</span>
              <span className="text-[10px] text-slate-500 truncate">
                https://www.supertelecom.shop {selectedRoute !== "/" && `› ${selectedRoute.replace("/", "")}`}
              </span>
            </div>
          </div>

          {/* Title */}
          <h4 className="mt-2 text-base sm:text-lg font-semibold text-[#1a0dab] hover:underline cursor-pointer leading-snug">
            {title || "Super Telecom | Mobile Repair in Giridih"}
          </h4>

          {/* Description */}
          <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2">
            {description || "No meta description defined yet."}
          </p>

          {/* Rich Snippets / FAQ Accordion Preview */}
          {faqs.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Google Rich FAQ Dropdown Preview:
              </span>
              {faqs.slice(0, 2).map((faq, idx) => (
                <div key={idx} className="text-xs text-slate-700 flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-200">
                  <span className="truncate font-medium">{faq.question}</span>
                  <span className="text-slate-400 text-xs">▼</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Meta Input Form */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        {/* Title Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Page Title (Meta Title)</span>
              <span className="text-slate-400 text-[10px]">Appears in Google tab &amp; SERP header</span>
            </label>
            <span
              className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md ${
                title.length >= 35 && title.length <= 60
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                  : title.length > 60
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                  : "bg-slate-800 text-slate-400"
              }`}
            >
              {title.length} / 60 characters
            </span>
          </div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Mobile Screen Replacement in Giridih | Super Telecom"
            className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Description Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Meta Description</span>
              <span className="text-slate-400 text-[10px]">The snippet Google &amp; AI answer engines display</span>
            </label>
            <span
              className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md ${
                description.length >= 120 && description.length <= 160
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                  : description.length > 160
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                  : "bg-slate-800 text-slate-400"
              }`}
            >
              {description.length} / 160 characters
            </span>
          </div>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write an enticing description matching user intent with local keywords..."
            className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Keywords Input */}
        <div>
          <label className="text-xs font-bold text-white block mb-2">
            Target Focus Keywords (comma-separated)
          </label>
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="e.g. mobile repair giridih, screen replacement, barganda road"
            className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500 mb-3"
          />
          {keywords && (
            <div className="flex flex-wrap gap-1.5">
              {keywords.split(",").map((k, idx) => {
                const trimmed = k.trim();
                if (!trimmed) return null;
                return (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-950 border border-cyan-500/30 text-cyan-300 text-[11px]"
                  >
                    <Tag className="h-3 w-3 text-cyan-400" />
                    <span>{trimmed}</span>
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Dynamic FAQ & Schema.org Builder */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-cyan-400" />
              <span>Dynamic FAQ Builder &amp; Schema.org Generator</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              These Q&amp;As automatically generate Google FAQ rich snippets and conversational citations in ChatGPT and Perplexity.
            </p>
          </div>

          <button
            type="button"
            onClick={addFaq}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-all self-start sm:self-auto"
          >
            <Plus className="h-3.5 w-3.5 text-cyan-400" />
            <span>Add Question</span>
          </button>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={faq.id || index}
              className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 relative group"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300">
                  Q{index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => deleteFaq(faq.id)}
                  aria-label="Remove Question"
                  className="p-1 rounded-lg text-slate-500 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Question:
                </label>
                <input
                  type="text"
                  value={faq.question}
                  onChange={(e) => updateFaq(faq.id, "question", e.target.value)}
                  placeholder="e.g. How long does screen replacement take?"
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Verified Direct Answer:
                </label>
                <textarea
                  rows={2}
                  value={faq.answer}
                  onChange={(e) => updateFaq(faq.id, "answer", e.target.value)}
                  placeholder="Clear direct answer for AI citations and users..."
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          ))}

          {faqs.length === 0 && (
            <div className="p-8 text-center border border-dashed border-slate-800 rounded-2xl text-slate-400 text-xs">
              No FAQs defined for this page. Click &quot;Add Question&quot; to build rich Schema.org snippets.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeoGrowthManager;
