import React, { useEffect, useState } from "react";
import {
  Film,
  Plus,
  Upload,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle,
  RefreshCw,
  Image as ImageIcon,
  Video as VideoIcon,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import type { DailyUpdate } from "@/components/DailyUpdatesSection";

export const DailyFeedManager: React.FC = () => {
  const [posts, setPosts] = useState<DailyUpdate[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filterType, setFilterType] = useState<"all" | "image" | "video">("all");

  // Create Form State
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>("");
  const [newDescription, setNewDescription] = useState<string>("");
  const [newMediaType, setNewMediaType] = useState<"image" | "video">("image");
  const [newMediaUrl, setNewMediaUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("daily_updates")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setPosts(data);
      }
    } catch (err) {
      console.warn("Failed to fetch daily_updates:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setFeedback(null);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `updates/${fileName}`;

      const { error: uploadErr } = await supabase.storage
        .from("daily-media")
        .upload(filePath, file, { cacheControl: "3600", upsert: false });

      if (uploadErr) throw uploadErr;

      const { data: publicUrlData } = supabase.storage
        .from("daily-media")
        .getPublicUrl(filePath);

      setNewMediaUrl(publicUrlData.publicUrl);
      if (file.type.startsWith("video/")) {
        setNewMediaType("video");
      } else {
        setNewMediaType("image");
      }
      setFeedback({ type: "success", text: "Media file uploaded to daily-media bucket!" });
    } catch (err: any) {
      console.error("Storage upload error:", err);
      setFeedback({ type: "error", text: err.message || "Failed to upload media. Ensure 'daily-media' bucket exists." });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newMediaUrl.trim()) {
      setFeedback({ type: "error", text: "Title and Media URL / File are required." });
      return;
    }

    setIsUploading(true);
    setFeedback(null);
    try {
      const newPost = {
        title: newTitle.trim(),
        description: newDescription.trim(),
        media_url: newMediaUrl.trim(),
        media_type: newMediaType,
        is_published: true,
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase.from("daily_updates").insert([newPost]).select();
      if (error) throw error;

      setFeedback({ type: "success", text: "Update published to the public customer feed!" });
      setNewTitle("");
      setNewDescription("");
      setNewMediaUrl("");
      setIsCreating(false);
      fetchPosts();
    } catch (err: any) {
      console.error("Create post error:", err);
      setFeedback({ type: "error", text: err.message || "Failed to save post." });
    } finally {
      setIsUploading(false);
    }
  };

  const handleTogglePublish = async (post: DailyUpdate) => {
    try {
      const nextStatus = !post.is_published;
      const { error } = await supabase
        .from("daily_updates")
        .update({ is_published: nextStatus })
        .eq("id", post.id);

      if (!error) {
        setPosts((prev) =>
          prev.map((p) => (p.id === post.id ? { ...p, is_published: nextStatus } : p))
        );
      }
    } catch (err) {
      console.error("Toggle publish error:", err);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this update?")) return;
    try {
      const { error } = await supabase.from("daily_updates").delete().eq("id", id);
      if (!error) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error("Delete post error:", err);
    }
  };

  const filteredPosts = posts.filter((p) => {
    if (filterType === "all") return true;
    return p.media_type === filterType;
  });

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-cyan-950 border border-cyan-500/30 text-cyan-400">
              <Film className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-2xl font-extrabold text-white">Daily Workshop Feed Manager</h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Upload real repair photos, BGA micro-soldering videos, and customer delivery updates.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchPosts}
            className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300"
            title="Refresh Feed"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            type="button"
            onClick={() => setIsCreating(!isCreating)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg transition-transform hover:scale-[1.02]"
          >
            <Plus className="h-4 w-4" />
            {isCreating ? "Close Form" : "Upload New Update"}
          </button>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold ${
            feedback.type === "success"
              ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/30"
              : "bg-rose-950/80 text-rose-300 border border-rose-500/30"
          }`}
        >
          {feedback.type === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {feedback.text}
        </div>
      )}

      {/* Upload & Create Form Drawer */}
      {isCreating && (
        <form
          onSubmit={handleCreatePost}
          className="p-6 rounded-3xl bg-slate-900 border border-cyan-500/30 shadow-2xl space-y-5 animate-scale-up"
        >
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            Publish New Workshop Media Post
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Post Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. iPhone 13 Pro Screen Replacement Completed"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Media Type</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setNewMediaType("image")}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 ${
                    newMediaType === "image"
                      ? "bg-cyan-500 text-slate-950 border-cyan-400"
                      : "bg-slate-950 border-slate-800 text-slate-400"
                  }`}
                >
                  <ImageIcon className="h-4 w-4" /> Photo
                </button>
                <button
                  type="button"
                  onClick={() => setNewMediaType("video")}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 ${
                    newMediaType === "video"
                      ? "bg-cyan-500 text-slate-950 border-cyan-400"
                      : "bg-slate-950 border-slate-800 text-slate-400"
                  }`}
                >
                  <VideoIcon className="h-4 w-4" /> Video
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description (Optional)</label>
            <textarea
              rows={2}
              placeholder="Explain the diagnosis and repair details..."
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-cyan-400 uppercase font-mono">Upload to Supabase Storage</span>
            <div>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-cyan-400 hover:file:bg-slate-700 cursor-pointer"
              />
            </div>
            <div className="text-[11px] text-slate-500 text-center">or specify direct URL:</div>
            <input
              type="url"
              placeholder="https://..."
              value={newMediaUrl}
              onChange={(e) => setNewMediaUrl(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none font-mono"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg disabled:opacity-50"
            >
              {isUploading ? "Uploading..." : "Publish Post"}
            </button>
          </div>
        </form>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900/60 border border-slate-800 w-fit">
        <button
          type="button"
          onClick={() => setFilterType("all")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            filterType === "all" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"
          }`}
        >
          All Posts ({posts.length})
        </button>
        <button
          type="button"
          onClick={() => setFilterType("image")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            filterType === "image" ? "bg-cyan-950 text-cyan-400 border border-cyan-500/30" : "text-slate-400 hover:text-white"
          }`}
        >
          Photos ({posts.filter((p) => p.media_type === "image").length})
        </button>
        <button
          type="button"
          onClick={() => setFilterType("video")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            filterType === "video" ? "bg-cyan-950 text-cyan-400 border border-cyan-500/30" : "text-slate-400 hover:text-white"
          }`}
        >
          Videos ({posts.filter((p) => p.media_type === "video").length})
        </button>
      </div>

      {/* Posts Grid */}
      {filteredPosts.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800">
          <Film className="h-10 w-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-white">No Workshop Updates Found</h3>
          <p className="text-xs text-slate-400 mt-1">Upload daily repairs and customer deliveries above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="rounded-3xl bg-slate-900/80 border border-slate-800 overflow-hidden flex flex-col justify-between group hover:border-slate-700 shadow-md transition-all"
            >
              <div>
                <div className="relative aspect-square bg-slate-950 overflow-hidden">
                  {post.media_type === "video" ? (
                    <video src={post.media_url} className="w-full h-full object-cover" muted loop />
                  ) : (
                    <img src={post.media_url} alt={post.title} className="w-full h-full object-cover" />
                  )}

                  <span
                    className={`absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono ${
                      post.media_type === "video"
                        ? "bg-purple-950/90 text-purple-300 border border-purple-500/40"
                        : "bg-blue-950/90 text-blue-300 border border-blue-500/40"
                    }`}
                  >
                    {post.media_type}
                  </span>

                  <span
                    className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                      post.is_published
                        ? "bg-emerald-950/90 text-emerald-300 border border-emerald-500/40"
                        : "bg-slate-950/90 text-slate-400 border border-slate-700"
                    }`}
                  >
                    {post.is_published ? "Live" : "Draft"}
                  </span>
                </div>

                <div className="p-4">
                  <h4 className="font-bold text-white text-xs line-clamp-1">{post.title}</h4>
                  {post.description && (
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {post.description}
                    </p>
                  )}
                  <span className="text-[10px] text-slate-500 font-mono mt-2 block">
                    {new Date(post.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="p-3 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleTogglePublish(post)}
                  className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors ${
                    post.is_published
                      ? "text-emerald-400 hover:text-emerald-300 bg-emerald-950/40"
                      : "text-slate-400 hover:text-slate-200 bg-slate-800"
                  }`}
                >
                  {post.is_published ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                  {post.is_published ? "Unpublish" : "Publish"}
                </button>

                <button
                  type="button"
                  onClick={() => handleDeletePost(post.id)}
                  className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/50"
                  title="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DailyFeedManager;
