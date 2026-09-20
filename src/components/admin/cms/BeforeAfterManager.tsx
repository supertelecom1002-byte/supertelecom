import React, { useEffect, useState } from "react";
import {
  Layers,
  Plus,
  Trash2,
  Upload,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Sparkles,
  Sliders,
  Shield,
  Clock,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export interface RepairShowcaseItem {
  id: string;
  title: string;
  device_model: string;
  issue_type: string;
  before_image: string;
  after_image: string;
  turnaround_time: string;
  warranty_given: string;
  is_published: boolean;
  created_at?: string;
}

export const DEFAULT_SHOWCASE_ITEMS: RepairShowcaseItem[] = [
  {
    id: "showcase-1",
    title: "Cracked OLED Display Restoration",
    device_model: "iPhone 13 Pro Max",
    issue_type: "Shattered Glass & Touch Line Artifacts",
    before_image: "https://images.unsplash.com/photo-1596558450255-7c0b7be9d56a?w=800&auto=format&fit=crop&q=80",
    after_image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80",
    turnaround_time: "45 Minutes",
    warranty_given: "6 Months Warranty",
    is_published: true,
  },
  {
    id: "showcase-2",
    title: "Crushed Back Glass & Camera Housing",
    device_model: "Samsung Galaxy S22 Ultra",
    issue_type: "Severe impact glass splintering",
    before_image: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&auto=format&fit=crop&q=80",
    after_image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80",
    turnaround_time: "1 Hour",
    warranty_given: "90 Days Warranty",
    is_published: true,
  },
  {
    id: "showcase-3",
    title: "Dead Motherboard BGA Power IC Reballing",
    device_model: "Redmi Note 12 Pro+",
    issue_type: "Short circuit no-power condition",
    before_image: "https://images.unsplash.com/photo-1588508065123-287b28e013da?w=800&auto=format&fit=crop&q=80",
    after_image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
    turnaround_time: "2 Hours",
    warranty_given: "90 Days Warranty",
    is_published: true,
  },
];

export const BeforeAfterManager: React.FC = () => {
  const [items, setItems] = useState<RepairShowcaseItem[]>(DEFAULT_SHOWCASE_ITEMS);
  const [loading, setLoading] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [activePreviewId, setActivePreviewId] = useState<string>(DEFAULT_SHOWCASE_ITEMS[0].id);
  const [sliderPosition, setSliderPosition] = useState<number>(50);

  // Form State
  const [title, setTitle] = useState<string>("");
  const [deviceModel, setDeviceModel] = useState<string>("");
  const [issueType, setIssueType] = useState<string>("");
  const [beforeImage, setBeforeImage] = useState<string>("");
  const [afterImage, setAfterImage] = useState<string>("");
  const [turnaroundTime, setTurnaroundTime] = useState<string>("45 Minutes");
  const [warrantyGiven, setWarrantyGiven] = useState<string>("90 Days Warranty");
  const [uploadingField, setUploadingField] = useState<"before" | "after" | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchShowcaseItems = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("repair_showcase")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        setItems(data);
        setActivePreviewId(data[0].id);
      } else {
        setItems(DEFAULT_SHOWCASE_ITEMS);
      }
    } catch {
      setItems(DEFAULT_SHOWCASE_ITEMS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShowcaseItems();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "before" | "after") => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(field);
    setFeedback(null);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `showcase-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const filePath = `showcase/${fileName}`;

      const { error: uploadErr } = await supabase.storage
        .from("daily-media")
        .upload(filePath, file, { cacheControl: "3600", upsert: false });

      if (uploadErr) throw uploadErr;

      const { data: publicUrlData } = supabase.storage
        .from("daily-media")
        .getPublicUrl(filePath);

      if (field === "before") {
        setBeforeImage(publicUrlData.publicUrl);
      } else {
        setAfterImage(publicUrlData.publicUrl);
      }
      setFeedback({ type: "success", text: `Uploaded ${field} image successfully!` });
    } catch (err: any) {
      console.error("Storage upload error:", err);
      setFeedback({ type: "error", text: err.message || "Upload failed. You can also paste an image URL directly." });
    } finally {
      setUploadingField(null);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !beforeImage.trim() || !afterImage.trim()) {
      setFeedback({ type: "error", text: "Title and both Before & After images are required." });
      return;
    }

    const newItem: RepairShowcaseItem = {
      id: `showcase-${Date.now()}`,
      title: title.trim(),
      device_model: deviceModel.trim() || "Smartphone",
      issue_type: issueType.trim() || "Hardware Repair",
      before_image: beforeImage.trim(),
      after_image: afterImage.trim(),
      turnaround_time: turnaroundTime.trim(),
      warranty_given: warrantyGiven.trim(),
      is_published: true,
      created_at: new Date().toISOString(),
    };

    try {
      const { error } = await supabase.from("repair_showcase").insert([newItem]);
      if (error) console.warn("Supabase insert notice:", error.message);

      setItems((prev) => [newItem, ...prev]);
      setActivePreviewId(newItem.id);
      setIsCreating(false);
      setTitle("");
      setDeviceModel("");
      setIssueType("");
      setBeforeImage("");
      setAfterImage("");
      setFeedback({ type: "success", text: "New repair showcase published!" });
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Failed to save item." });
    }
  };

  const handleTogglePublish = async (id: string, current: boolean) => {
    try {
      await supabase.from("repair_showcase").update({ is_published: !current }).eq("id", id);
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, is_published: !current } : i))
      );
    } catch {
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, is_published: !current } : i))
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this comparison showcase?")) return;
    try {
      await supabase.from("repair_showcase").delete().eq("id", id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      if (activePreviewId === id) {
        const remaining = items.filter((i) => i.id !== id);
        if (remaining.length > 0) setActivePreviewId(remaining[0].id);
      }
    } catch {
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
  };

  const activeItem = items.find((i) => i.id === activePreviewId) || items[0];

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-cyan-950 border border-cyan-500/30 text-cyan-400">
              <Sliders className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-2xl font-extrabold text-white">Before &amp; After Repair Showcase</h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Manage interactive split comparison sliders demonstrating Super Telecom repair quality.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsCreating(!isCreating)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg transition-transform hover:scale-[1.02]"
        >
          <Plus className="h-4 w-4" />
          {isCreating ? "Close Form" : "Add Repair Comparison"}
        </button>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold ${
            feedback.type === "success"
              ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/30"
              : "bg-rose-950/80 text-rose-300 border border-rose-500/30"
          }`}
        >
          {feedback.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {feedback.text}
        </div>
      )}

      {/* Creation Drawer / Form */}
      {isCreating && (
        <form
          onSubmit={handleCreate}
          className="p-6 rounded-3xl bg-slate-900 border border-cyan-500/30 shadow-2xl space-y-5 animate-scale-up"
        >
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            Add New Before/After Showcase
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Repair Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Broken Display Restoration"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Device Model *</label>
              <input
                type="text"
                required
                placeholder="e.g. iPhone 14 Pro Max"
                value={deviceModel}
                onChange={(e) => setDeviceModel(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Issue Diagnosed</label>
              <input
                type="text"
                placeholder="e.g. Touch Glitch & Glass Crack"
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Media Inputs (Before & After) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            {/* Before Media */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-rose-400 uppercase font-mono">1. Before Repair (Damaged)</span>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Upload File (daily-media bucket)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "before")}
                  disabled={uploadingField !== null}
                  className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-cyan-400 hover:file:bg-slate-700 cursor-pointer"
                />
              </div>
              <div className="text-[11px] text-slate-500 text-center">or paste URL:</div>
              <input
                type="url"
                placeholder="https://.../damaged.jpg"
                value={beforeImage}
                onChange={(e) => setBeforeImage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
              {beforeImage && (
                <div className="h-32 rounded-xl overflow-hidden border border-slate-800 relative">
                  <img src={beforeImage} alt="Before preview" className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950/90 text-rose-300 border border-rose-500/40">
                    BEFORE
                  </span>
                </div>
              )}
            </div>

            {/* After Media */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-emerald-400 uppercase font-mono">2. After Repair (Fixed)</span>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Upload File (daily-media bucket)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "after")}
                  disabled={uploadingField !== null}
                  className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-emerald-400 hover:file:bg-slate-700 cursor-pointer"
                />
              </div>
              <div className="text-[11px] text-slate-500 text-center">or paste URL:</div>
              <input
                type="url"
                placeholder="https://.../fixed.jpg"
                value={afterImage}
                onChange={(e) => setAfterImage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
              {afterImage && (
                <div className="h-32 rounded-xl overflow-hidden border border-slate-800 relative">
                  <img src={afterImage} alt="After preview" className="w-full h-full object-cover" />
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-500/40">
                    AFTER
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Turnaround Time</label>
              <input
                type="text"
                placeholder="45 Minutes"
                value={turnaroundTime}
                onChange={(e) => setTurnaroundTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Warranty Provided</label>
              <input
                type="text"
                placeholder="90 Days Warranty"
                value={warrantyGiven}
                onChange={(e) => setWarrantyGiven(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg"
            >
              Publish Comparison
            </button>
          </div>
        </form>
      )}

      {/* Interactive Live Slider Preview & List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Live Draggable Slider Preview */}
        {activeItem && (
          <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-cyan-400" />
                  <span className="font-bold text-white text-sm">{activeItem.device_model}</span>
                </div>
                <span className="text-xs text-slate-400">{activeItem.title}</span>
              </div>

              {/* Slider Container */}
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden select-none border border-slate-800 bg-slate-950">
                {/* Fixed (After) Image */}
                <img
                  src={activeItem.after_image}
                  alt="After Repair"
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                />

                {/* Damaged (Before) Image clipped */}
                <div
                  className="absolute inset-0 overflow-hidden pointer-events-none"
                  style={{ width: `${sliderPosition}%` }}
                >
                  <img
                    src={activeItem.before_image}
                    alt="Before Repair"
                    className="absolute inset-0 w-full h-full object-cover max-w-none"
                    style={{ width: "100%", height: "100%" }}
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-rose-950/90 text-rose-300 text-[11px] font-bold border border-rose-500/40">
                    BEFORE REPAIR
                  </div>
                </div>

                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-emerald-950/90 text-emerald-300 text-[11px] font-bold border border-emerald-500/40 pointer-events-none">
                  AFTER REPAIR
                </div>

                {/* Divider Line */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.8)] pointer-events-none"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-cyan-500 text-slate-950 font-bold flex items-center justify-center shadow-lg border-2 border-white text-xs">
                    &#x2194;
                  </div>
                </div>

                {/* Range Input overlay */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPosition}
                  onChange={(e) => setSliderPosition(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                />
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                <span>Drag the handle left/right to compare</span>
                <span className="font-mono text-cyan-400 font-semibold">{sliderPosition}% Damaged / {100 - sliderPosition}% Fixed</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-cyan-400">
                <Clock className="h-3.5 w-3.5" />
                <span>{activeItem.turnaround_time}</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <Shield className="h-3.5 w-3.5" />
                <span>{activeItem.warranty_given}</span>
              </div>
            </div>
          </div>
        )}

        {/* Showcase Items List */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs uppercase font-mono tracking-wider text-slate-400 block mb-2">
            Configured Repairs ({items.length})
          </span>
          {items.map((item) => {
            const isSelected = item.id === activePreviewId;
            return (
              <div
                key={item.id}
                onClick={() => setActivePreviewId(item.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                  isSelected
                    ? "bg-cyan-950/40 border-cyan-500/50 shadow-lg shadow-cyan-950/50"
                    : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-12 h-12 rounded-xl overflow-hidden flex-none border border-slate-800 bg-slate-950 relative">
                    <img src={item.after_image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="truncate">
                    <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                    <p className="text-[11px] text-cyan-400 truncate">{item.device_model}</p>
                    <span className="text-[10px] text-slate-500">{item.issue_type}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-none" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => handleTogglePublish(item.id, item.is_published)}
                    className={`p-1.5 rounded-lg border text-xs ${
                      item.is_published
                        ? "bg-emerald-950/60 text-emerald-400 border-emerald-500/30"
                        : "bg-slate-800 text-slate-500 border-slate-700"
                    }`}
                    title={item.is_published ? "Published" : "Hidden"}
                  >
                    {item.is_published ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg bg-rose-950/40 text-rose-400 border border-rose-500/20 hover:bg-rose-900/60"
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BeforeAfterManager;
