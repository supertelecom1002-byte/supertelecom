import React, { useEffect, useState } from "react";
import {
  Wrench,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Search,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Smartphone,
  RotateCcw,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { SERVICES, type ServiceInfo } from "@/data/services";

export const ServicesManager: React.FC = () => {
  const [services, setServices] = useState<ServiceInfo[]>(SERVICES);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [editingService, setEditingService] = useState<ServiceInfo | null>(null);
  const [isNew, setIsNew] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form Fields
  const [formSlug, setFormSlug] = useState<string>("");
  const [formName, setFormName] = useState<string>("");
  const [formPriceRange, setFormPriceRange] = useState<string>("");
  const [formDuration, setFormDuration] = useState<string>("");
  const [formShort, setFormShort] = useState<string>("");
  const [formIntro, setFormIntro] = useState<string>("");
  const [formBenefits, setFormBenefits] = useState<string>("");
  const [formBrands, setFormBrands] = useState<string>("");

  const fetchServices = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("services_catalog")
        .select("*")
        .order("created_at", { ascending: true });

      if (!error && data && data.length > 0) {
        // Map database records to ServiceInfo format
        const mapped: ServiceInfo[] = data.map((d: any) => ({
          slug: d.slug,
          name: d.name,
          h1: d.h1 || `${d.name} in Giridih`,
          title: d.title || `${d.name} in Giridih | Super Telecom`,
          description: d.description || d.short,
          keywords: d.keywords || `${d.name} Giridih`,
          short: d.short,
          intro: d.intro,
          benefits: Array.isArray(d.benefits) ? d.benefits : (d.benefits ? JSON.parse(d.benefits) : []),
          process: Array.isArray(d.process) ? d.process : (d.process ? JSON.parse(d.process) : []),
          brands: Array.isArray(d.brands) ? d.brands : (d.brands ? d.brands.split(",").map((s: string) => s.trim()) : []),
          faqs: Array.isArray(d.faqs) ? d.faqs : [],
          priceRange: d.price_range || d.priceRange || "₹500 - ₹5,000",
          duration: d.duration || "30-60 minutes",
        }));
        setServices(mapped);
      } else {
        // Fallback to static services
        setServices(SERVICES);
      }
    } catch (err) {
      console.warn("Using static services fallback:", err);
      setServices(SERVICES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openEditor = (service?: ServiceInfo) => {
    if (service) {
      setEditingService(service);
      setIsNew(false);
      setFormSlug(service.slug);
      setFormName(service.name);
      setFormPriceRange(service.priceRange);
      setFormDuration(service.duration);
      setFormShort(service.short);
      setFormIntro(service.intro);
      setFormBenefits((service.benefits || []).join("\n"));
      setFormBrands((service.brands || []).join(", "));
    } else {
      setEditingService({
        slug: "",
        name: "",
        h1: "",
        title: "",
        description: "",
        keywords: "",
        short: "",
        intro: "",
        benefits: [],
        process: [],
        brands: [],
        faqs: [],
        priceRange: "₹500 - ₹5,000",
        duration: "30-60 minutes",
      });
      setIsNew(true);
      setFormSlug("");
      setFormName("");
      setFormPriceRange("₹500 - ₹5,000");
      setFormDuration("30-60 minutes");
      setFormShort("");
      setFormIntro("");
      setFormBenefits("Free diagnosis\nQuality warranty on parts\nSame-day repair service");
      setFormBrands("iPhone, Samsung, Xiaomi, Realme, Vivo, OPPO, OnePlus");
    }
    setStatusMessage(null);
  };

  const closeEditor = () => {
    setEditingService(null);
    setIsNew(false);
    setStatusMessage(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSlug.trim() || !formName.trim()) {
      setStatusMessage({ type: "error", text: "Service Name and Slug are required." });
      return;
    }

    const benefitsArray = formBenefits
      .split("\n")
      .map((b) => b.trim())
      .filter(Boolean);
    const brandsArray = formBrands
      .split(",")
      .map((b) => b.trim())
      .filter(Boolean);

    const updatedService: ServiceInfo = {
      slug: formSlug.trim().toLowerCase().replace(/\s+/g, "-"),
      name: formName.trim(),
      h1: `${formName.trim()} in Giridih`,
      title: `${formName.trim()} in Giridih | Super Telecom`,
      description: formShort.trim(),
      keywords: `${formName.trim()} Giridih, Mobile Repair Giridih`,
      short: formShort.trim(),
      intro: formIntro.trim(),
      benefits: benefitsArray,
      process: [
        "Free diagnosis and upfront price estimate",
        "Expert repair using precision micro-soldering and OEM parts",
        "Rigorous quality testing and customer verification",
      ],
      brands: brandsArray,
      faqs: [
        [`How long does ${formName} take?`, `Most ${formName} jobs are completed within ${formDuration}.`],
        [`Is there a warranty on ${formName}?`, `Yes, all parts and labor carry a warranty.`],
      ],
      priceRange: formPriceRange.trim(),
      duration: formDuration.trim(),
    };

    try {
      // Upsert into Supabase services_catalog table
      const { error } = await supabase.from("services_catalog").upsert([
        {
          slug: updatedService.slug,
          name: updatedService.name,
          h1: updatedService.h1,
          title: updatedService.title,
          description: updatedService.description,
          keywords: updatedService.keywords,
          short: updatedService.short,
          intro: updatedService.intro,
          benefits: updatedService.benefits,
          process: updatedService.process,
          brands: updatedService.brands.join(", "),
          price_range: updatedService.priceRange,
          duration: updatedService.duration,
          updated_at: new Date().toISOString(),
        },
      ]);

      if (error) {
        console.warn("Supabase upsert warning:", error.message);
      }

      // Update local state
      setServices((prev) => {
        const index = prev.findIndex((s) => s.slug === updatedService.slug);
        if (index >= 0) {
          const next = [...prev];
          next[index] = updatedService;
          return next;
        }
        return [...prev, updatedService];
      });

      setStatusMessage({ type: "success", text: `Service "${updatedService.name}" saved successfully!` });
      setTimeout(() => closeEditor(), 900);
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message || "Failed to save service." });
    }
  };

  const handleDelete = async (slug: string) => {
    if (!window.confirm(`Are you sure you want to remove "${slug}"?`)) return;

    try {
      await supabase.from("services_catalog").delete().eq("slug", slug);
      setServices((prev) => prev.filter((s) => s.slug !== slug));
      setStatusMessage({ type: "success", text: "Service deleted." });
    } catch (err: any) {
      console.error("Delete error:", err);
    }
  };

  const filteredServices = services.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.short.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-cyan-950 border border-cyan-500/30 text-cyan-400">
              <Wrench className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-2xl font-extrabold text-white">Repair Services Catalog</h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Manage turnaround times, pricing tiers, and service specifications for Super Telecom.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => openEditor()}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg transition-transform hover:scale-[1.02]"
        >
          <Plus className="h-4 w-4" /> Add New Service
        </button>
      </div>

      {/* Search & Stats Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search services (e.g. Screen, Battery)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span>
            Total Services: <strong className="text-white">{services.length}</strong>
          </span>
          <button
            type="button"
            onClick={fetchServices}
            className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <RotateCcw className="h-3 w-3" /> Refresh
          </button>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredServices.map((service) => (
          <div
            key={service.slug}
            className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800/90 hover:border-slate-700 flex flex-col justify-between transition-all group shadow-md"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-white text-base group-hover:text-cyan-400 transition-colors">
                  {service.name}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-cyan-950/80 border border-cyan-500/30 text-cyan-300">
                  {service.slug}
                </span>
              </div>

              <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                {service.short || service.intro}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-mono">Price Range</span>
                  <span className="font-semibold text-emerald-400">{service.priceRange || "On Request"}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-mono">Duration</span>
                  <span className="font-semibold text-cyan-400">{service.duration || "Same Day"}</span>
                </div>
              </div>

              {service.brands && service.brands.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {service.brands.slice(0, 3).map((brand, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950 text-slate-400 border border-slate-800"
                    >
                      {brand}
                    </span>
                  ))}
                  {service.brands.length > 3 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md text-slate-500">
                      +{service.brands.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <a
                href={`/services/${service.slug}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-slate-400 hover:text-cyan-400"
              >
                View Live Page &rarr;
              </a>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => openEditor(service)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 transition-colors"
                  title="Edit Service"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(service.slug)}
                  className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-500/20 transition-colors"
                  title="Delete Service"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-5 animate-scale-up">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-cyan-400" />
                {isNew ? "Add New Repair Service" : `Edit Service: ${editingService.name}`}
              </h3>
              <button
                type="button"
                onClick={closeEditor}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {statusMessage && (
              <div
                className={`p-3 rounded-xl flex items-center gap-2 text-xs font-semibold ${
                  statusMessage.type === "success"
                    ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/30"
                    : "bg-rose-950/80 text-rose-300 border border-rose-500/30"
                }`}
              >
                {statusMessage.type === "success" ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                {statusMessage.text}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Service Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => {
                      setFormName(e.target.value);
                      if (isNew) {
                        setFormSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                      }
                    }}
                    placeholder="e.g. Screen Replacement"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    placeholder="screen-replacement"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Price Range
                  </label>
                  <input
                    type="text"
                    value={formPriceRange}
                    onChange={(e) => setFormPriceRange(e.target.value)}
                    placeholder="₹800 - ₹15,000"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Estimated Turnaround
                  </label>
                  <input
                    type="text"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    placeholder="30-60 minutes"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  value={formShort}
                  onChange={(e) => setFormShort(e.target.value)}
                  placeholder="Cracked or broken display fixed same day with warranty."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Detailed Intro
                </label>
                <textarea
                  rows={3}
                  value={formIntro}
                  onChange={(e) => setFormIntro(e.target.value)}
                  placeholder="Full technical service explanation..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Key Benefits (one per line)
                </label>
                <textarea
                  rows={3}
                  value={formBenefits}
                  onChange={(e) => setFormBenefits(e.target.value)}
                  placeholder="Same-day repair&#10;Genuine OEM tested displays&#10;Warranty on parts"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Supported Brands (comma separated)
                </label>
                <input
                  type="text"
                  value={formBrands}
                  onChange={(e) => setFormBrands(e.target.value)}
                  placeholder="iPhone, Samsung, Xiaomi, Realme, Vivo, OPPO"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeEditor}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg transition-transform hover:scale-[1.02]"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesManager;
