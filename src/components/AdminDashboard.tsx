import React, { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Film,
  FileEdit,
  LogOut,
  Upload,
  Plus,
  Trash2,
  CheckCircle,
  Eye,
  EyeOff,
  Menu,
  X,
  RefreshCw,
  Phone,
  MapPin,
  Clock,
  Sparkles,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { BrandLogo } from "@/components/BrandLogo";
import type { DailyUpdate } from "@/components/DailyUpdatesSection";

export const AdminDashboard: React.FC = () => {
  const { user, isAdmin, loading: authLoading, signOut } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<"dashboard" | "feed" | "content">("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Feed State
  const [posts, setPosts] = useState<DailyUpdate[]>([]);
  const [feedLoading, setFeedLoading] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>("");
  const [newDescription, setNewDescription] = useState<string>("");
  const [newMediaType, setNewMediaType] = useState<"image" | "video">("image");
  const [newMediaUrl, setNewMediaUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Content CMS State
  const [heroTitle, setHeroTitle] = useState<string>("Super Telecom — Mobile Repair Shop in Giridih");
  const [heroSubtitle, setHeroSubtitle] = useState<string>(
    "Display, battery & chip-level repairs · Second-hand phones · Accessories"
  );
  const [ctaText, setCtaText] = useState<string>("Book Repair");
  const [shopPhone, setShopPhone] = useState<string>("+91 80029 03643");
  const [shopAddress, setShopAddress] = useState<string>("Barganda Road, Near Shivam Clinic");
  const [shopTimings, setShopTimings] = useState<string>("Open Daily 9:00 AM – 9:00 PM");
  const [contentSaving, setContentSaving] = useState<boolean>(false);
  const [contentStatus, setContentStatus] = useState<{ success?: string; error?: string } | null>(null);

  const navigate = useNavigate();

  // Redirect guard
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate({ to: "/admin/login" });
    }
  }, [isAdmin, authLoading, navigate]);

  // Load Feed Posts
  const fetchFeedPosts = async () => {
    setFeedLoading(true);
    try {
      const { data, error } = await supabase
        .from("daily_updates")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setPosts(data);
      }
    } catch (err) {
      console.warn("Error fetching daily_updates:", err);
    } finally {
      setFeedLoading(false);
    }
  };

  // Load Site Content
  const fetchSiteContent = async () => {
    try {
      const { data, error } = await supabase
        .from("site_content")
        .select("*")
        .eq("id", "main_content")
        .maybeSingle();

      if (!error && data) {
        if (data.hero_title) setHeroTitle(data.hero_title);
        if (data.hero_subtitle) setHeroSubtitle(data.hero_subtitle);
        if (data.cta_text) setCtaText(data.cta_text);
        if (data.shop_phone) setShopPhone(data.shop_phone);
        if (data.shop_address) setShopAddress(data.shop_address);
        if (data.shop_timings) setShopTimings(data.shop_timings);
      }
    } catch (err) {
      console.warn("Error fetching site_content:", err);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchFeedPosts();
      fetchSiteContent();
    }
  }, [isAdmin]);

  // Handle Storage File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `updates/${fileName}`;

      // Upload to Supabase Storage bucket 'daily-media'
      const { error: uploadErr } = await supabase.storage
        .from("daily-media")
        .upload(filePath, file, { cacheControl: "3600", upsert: false });

      if (uploadErr) {
        throw uploadErr;
      }

      const { data: publicUrlData } = supabase.storage
        .from("daily-media")
        .getPublicUrl(filePath);

      setNewMediaUrl(publicUrlData.publicUrl);
      if (file.type.startsWith("video/")) {
        setNewMediaType("video");
      } else {
        setNewMediaType("image");
      }
      setUploadSuccess("File uploaded successfully to Supabase daily-media bucket!");
    } catch (err: any) {
      console.error("Storage upload error:", err);
      setUploadError(err.message || "Failed to upload media file. Make sure bucket 'daily-media' exists.");
    } finally {
      setIsUploading(false);
    }
  };

  // Create Post
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newMediaUrl.trim()) {
      setUploadError("Title and Media URL / File are required.");
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    try {
      const newPost = {
        title: newTitle.trim(),
        description: newDescription.trim(),
        media_url: newMediaUrl.trim(),
        media_type: newMediaType,
        is_published: true,
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("daily_updates").insert([newPost]);
      if (error) throw error;

      setUploadSuccess("Post created and published successfully!");
      setNewTitle("");
      setNewDescription("");
      setNewMediaUrl("");
      fetchFeedPosts();
    } catch (err: any) {
      console.error("Create post error:", err);
      setUploadError(err.message || "Failed to save post.");
    } finally {
      setIsUploading(false);
    }
  };

  // Toggle Publish Status
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

  // Delete Post
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

  // Save Site Content
  const handleSaveContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setContentSaving(true);
    setContentStatus(null);
    try {
      const payload = {
        id: "main_content",
        hero_title: heroTitle,
        hero_subtitle: heroSubtitle,
        cta_text: ctaText,
        shop_phone: shopPhone,
        shop_address: shopAddress,
        shop_timings: shopTimings,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("site_content").upsert([payload]);
      if (error) throw error;

      setContentStatus({ success: "Site content updated successfully!" });
    } catch (err: any) {
      console.error("Save site content error:", err);
      setContentStatus({ error: err.message || "Failed to update site content." });
    } finally {
      setContentSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-200">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent mb-4" />
        <p className="text-sm font-mono text-cyan-400">Verifying administrator authorization...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/90 z-20">
        <BrandLogo size="sm" to="/" />
        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-xl bg-slate-800 text-slate-200 hover:text-white"
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-30 h-screen w-64 bg-slate-900/95 border-r border-slate-800/80 p-6 flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="space-y-6">
          <div className="hidden md:block">
            <BrandLogo size="md" to="/" />
          </div>

          {/* Admin badge */}
          <div className="p-3 rounded-2xl bg-cyan-950/60 border border-cyan-500/30 flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-cyan-400 flex-none" />
            <div className="overflow-hidden text-xs">
              <span className="font-bold text-cyan-300 block">Verified Admin</span>
              <span className="text-slate-400 truncate block">{user?.email}</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <button
              type="button"
              onClick={() => {
                setActiveTab("dashboard");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === "dashboard"
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard Overview
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("feed");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === "feed"
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Film className="h-4 w-4" />
              Daily Feed Manager
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("content");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === "content"
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <FileEdit className="h-4 w-4" />
              Site Content CMS
            </button>
          </nav>
        </div>

        {/* Footer actions */}
        <div className="pt-6 border-t border-slate-800/80 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-cyan-400 bg-slate-950/60 border border-slate-800"
          >
            <ExternalLink className="h-3.5 w-3.5" /> View Live Site
          </a>

          <button
            type="button"
            onClick={signOut}
            className="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-300 hover:text-rose-100 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl w-full">
        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === "dashboard" && (
          <div className="space-y-8 animate-fade-up">
            <div>
              <h1 className="text-3xl font-extrabold text-white">Super Telecom Admin CMS</h1>
              <p className="mt-1 text-sm text-slate-400">
                Welcome back, {user?.email}. Monitor active daily feeds and manage live content.
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/80 shadow-lg">
                <span className="text-xs font-mono text-cyan-400 font-semibold uppercase">Total Feed Posts</span>
                <p className="text-4xl font-bold text-white mt-2">{posts.length}</p>
              </div>

              <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/80 shadow-lg">
                <span className="text-xs font-mono text-emerald-400 font-semibold uppercase">Published Posts</span>
                <p className="text-4xl font-bold text-emerald-300 mt-2">
                  {posts.filter((p) => p.is_published).length}
                </p>
              </div>

              <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/80 shadow-lg">
                <span className="text-xs font-mono text-blue-400 font-semibold uppercase">Storage Bucket</span>
                <p className="text-sm font-semibold text-white mt-2">daily-media</p>
                <span className="text-[11px] text-slate-400">Supabase Cloud Storage</span>
              </div>
            </div>

            {/* Quick Action Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="p-6 rounded-3xl border border-cyan-500/30 bg-cyan-950/30 shadow-xl flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Publish a Workshop Update</h3>
                  <p className="mt-1 text-xs text-slate-300">
                    Upload micro-soldering photos or teardown videos directly to the customer feed.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("feed")}
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-4 py-2.5 text-xs font-bold transition-transform hover:scale-[1.02]"
                >
                  <Plus className="h-4 w-4" /> Add New Post
                </button>
              </div>

              <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/80 shadow-xl flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Update Site Phone &amp; Address</h3>
                  <p className="mt-1 text-xs text-slate-300">
                    Modify business contact details, hero messaging, and service timings.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("content")}
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 text-xs font-bold transition-transform hover:scale-[1.02]"
                >
                  <FileEdit className="h-4 w-4" /> Edit CMS Content
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DAILY FEED MANAGER */}
        {activeTab === "feed" && (
          <div className="space-y-8 animate-fade-up">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Daily Feed Manager</h1>
                <p className="mt-1 text-xs sm:text-sm text-slate-400">
                  Upload photos and videos directly to the Supabase storage bucket `daily-media`.
                </p>
              </div>
              <button
                type="button"
                onClick={fetchFeedPosts}
                disabled={feedLoading}
                className="p-2.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-cyan-400"
              >
                <RefreshCw className={`h-4 w-4 ${feedLoading ? "animate-spin" : ""}`} />
              </button>
            </div>

            {/* Create New Post Form */}
            <form
              onSubmit={handleCreatePost}
              className="p-6 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-4"
            >
              <h2 className="text-lg font-bold text-cyan-400 flex items-center gap-2">
                <Plus className="h-4 w-4" /> Create New Workshop Update
              </h2>

              {uploadSuccess && (
                <div className="p-3 rounded-xl border border-emerald-500/40 bg-emerald-950/40 text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 flex-none" /> {uploadSuccess}
                </div>
              )}

              {uploadError && (
                <div className="p-3 rounded-xl border border-rose-500/40 bg-rose-950/40 text-xs text-rose-300">
                  {uploadError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Post Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. iPhone 15 Pro Display Micro-Lamination"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-sm text-white focus:border-cyan-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Media Type
                  </label>
                  <select
                    value={newMediaType}
                    onChange={(e) => setNewMediaType(e.target.value as any)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-sm text-white focus:border-cyan-500 outline-none"
                  >
                    <option value="image">Image (Photo)</option>
                    <option value="video">Video (.mp4)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Describe the repair diagnosis, tools used, or turn-around time..."
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-sm text-white focus:border-cyan-500 outline-none resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 block">
                  Media File Upload (Supabase `daily-media` Bucket) or Direct URL *
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <label className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-cyan-500/40 bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 cursor-pointer text-xs font-semibold transition-colors">
                    <Upload className="h-4 w-4" />
                    <span>Upload from Device</span>
                    <input
                      type="file"
                      accept="image/*,video/mp4"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  <input
                    type="url"
                    value={newMediaUrl}
                    onChange={(e) => setNewMediaUrl(e.target.value)}
                    placeholder="https://... (or uploaded URL will appear here)"
                    className="flex-1 rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-white focus:border-cyan-500 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isUploading}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 px-6 py-2.5 text-xs font-bold shadow-lg transition-transform hover:scale-[1.02] disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />
                  {isUploading ? "Uploading & Saving..." : "Publish Update to Feed"}
                </button>
              </div>
            </form>

            {/* List of Existing Posts */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">Live Feed Posts ({posts.length})</h2>

              {posts.length === 0 ? (
                <div className="p-8 text-center rounded-3xl border border-slate-800 bg-slate-900/50 text-slate-400 text-sm">
                  No custom updates recorded yet. The public feed is currently showing default curated shop highlights.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="p-4 rounded-2xl border border-slate-800 bg-slate-900/80 flex gap-4 items-start justify-between"
                    >
                      <div className="flex gap-3">
                        <div className="h-16 w-20 rounded-xl overflow-hidden bg-slate-950 flex-none border border-slate-800">
                          {post.media_type === "video" ? (
                            <video src={post.media_url} className="h-full w-full object-cover" />
                          ) : (
                            <img src={post.media_url} alt={post.title} className="h-full w-full object-cover" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-white line-clamp-1">{post.title}</h4>
                          <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">{post.description}</p>
                          <span className="text-[10px] text-cyan-400 font-mono mt-1 inline-block">
                            {post.is_published ? "● Published" : "○ Draft"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 flex-none">
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(post)}
                          title={post.is_published ? "Unpublish" : "Publish"}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                        >
                          {post.is_published ? <Eye className="h-4 w-4 text-emerald-400" /> : <EyeOff className="h-4 w-4" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePost(post.id)}
                          title="Delete"
                          className="p-2 rounded-lg bg-rose-950/50 hover:bg-rose-900 text-rose-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: SITE CONTENT CMS */}
        {activeTab === "content" && (
          <div className="space-y-8 animate-fade-up">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Site Content CMS</h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-400">
                Manage hero copy, business phone numbers, street address, and store timings.
              </p>
            </div>

            <form
              onSubmit={handleSaveContent}
              className="p-6 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-6"
            >
              {contentStatus?.success && (
                <div className="p-3.5 rounded-xl border border-emerald-500/40 bg-emerald-950/40 text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 flex-none" /> {contentStatus.success}
                </div>
              )}

              {contentStatus?.error && (
                <div className="p-3.5 rounded-xl border border-rose-500/40 bg-rose-950/40 text-xs text-rose-300">
                  {contentStatus.error}
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">
                  Hero Section Text
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Hero Title</label>
                    <input
                      type="text"
                      value={heroTitle}
                      onChange={(e) => setHeroTitle(e.target.value)}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-sm text-white focus:border-cyan-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Hero Subtitle</label>
                    <textarea
                      rows={2}
                      value={heroSubtitle}
                      onChange={(e) => setHeroSubtitle(e.target.value)}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-sm text-white focus:border-cyan-500 outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Call to Action (CTA) Text</label>
                    <input
                      type="text"
                      value={ctaText}
                      onChange={(e) => setCtaText(e.target.value)}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-sm text-white focus:border-cyan-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-800">
                <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">
                  Store Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1 flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-cyan-400" /> Shop Phone Number
                    </label>
                    <input
                      type="text"
                      value={shopPhone}
                      onChange={(e) => setShopPhone(e.target.value)}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-sm text-white focus:border-cyan-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1 flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-cyan-400" /> Opening Hours
                    </label>
                    <input
                      type="text"
                      value={shopTimings}
                      onChange={(e) => setShopTimings(e.target.value)}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-sm text-white focus:border-cyan-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-cyan-400" /> Street Address
                  </label>
                  <input
                    type="text"
                    value={shopAddress}
                    onChange={(e) => setShopAddress(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-sm text-white focus:border-cyan-500 outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={contentSaving}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 px-6 py-3 text-xs sm:text-sm font-bold shadow-lg transition-transform hover:scale-[1.02] disabled:opacity-50"
                >
                  <FileEdit className="h-4 w-4" />
                  {contentSaving ? "Saving to Supabase..." : "Save Changes to public.site_content"}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
