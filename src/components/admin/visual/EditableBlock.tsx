import React, { useState, useRef, useEffect } from "react";
import {
  Pencil,
  Check,
  X,
  Upload,
  Image as ImageIcon,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useVisualEditor } from "@/context/VisualEditorContext";
import { supabase } from "@/lib/supabaseClient";

interface EditableBlockProps {
  contentKey: string;
  defaultValue: string;
  type?: "text" | "image" | "textarea";
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  imageAlt?: string;
  children?: React.ReactNode;
}

export const EditableBlock: React.FC<EditableBlockProps> = ({
  contentKey,
  defaultValue,
  type = "text",
  className = "",
  as: Component = "span",
  imageAlt = "Super Telecom",
  children,
}) => {
  const { isEditMode, getField, updateField, pendingChanges } = useVisualEditor();
  const currentValue = getField(contentKey, defaultValue);
  const isDirty = contentKey in pendingChanges;

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [draftValue, setDraftValue] = useState<string>(currentValue);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    setDraftValue(currentValue);
  }, [currentValue]);

  // If edit mode is disabled, render standard markup with zero overhead
  if (!isEditMode) {
    if (type === "image") {
      return <img src={currentValue} alt={imageAlt} className={className} />;
    }
    return <Component className={className}>{currentValue || children}</Component>;
  }

  const handleStartEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDraftValue(currentValue);
    setIsEditing(true);
  };

  const handleCommit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateField(contentKey, draftValue);
    setIsEditing(false);
  };

  const handleCancel = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDraftValue(currentValue);
    setIsEditing(false);
    setUploadError(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const ext = file.name.split(".").pop();
      const fileName = `visual-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${ext}`;
      const filePath = `visual-edits/${fileName}`;

      // Upload to Supabase storage bucket 'daily-media'
      const { error: uploadErr } = await supabase.storage
        .from("daily-media")
        .upload(filePath, file, { cacheControl: "3600", upsert: false });

      if (uploadErr) throw uploadErr;

      const { data: publicUrlData } = supabase.storage
        .from("daily-media")
        .getPublicUrl(filePath);

      setDraftValue(publicUrlData.publicUrl);
    } catch (err: any) {
      console.error("Visual edit image upload error:", err);
      setUploadError(err.message || "Failed to upload image. You can also paste an image URL directly.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      {/* Normal element wrapped with visual edit highlight */}
      <span
        onClick={handleStartEdit}
        className={`relative group inline-block cursor-pointer outline-dashed outline-1 outline-cyan-400/80 hover:outline-2 hover:outline-cyan-400 bg-cyan-950/20 hover:bg-cyan-950/40 rounded transition-all select-none ${
          isDirty ? "outline-amber-400/90 bg-amber-950/20" : ""
        }`}
        title={`Click to edit "${contentKey}"`}
      >
        {type === "image" ? (
          <img src={currentValue} alt={imageAlt} className={className} />
        ) : (
          <Component className={className}>{currentValue || children}</Component>
        )}

        {/* Floating Edit Badge on Hover */}
        <span className="absolute -top-3 -right-3 z-30 opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-500 text-slate-950 font-bold text-[10px] shadow-lg pointer-events-none">
          <Pencil className="h-2.5 w-2.5" />
          Edit
        </span>

        {/* Dirty / Unsaved Indicator */}
        {isDirty && (
          <span className="absolute -bottom-2 -left-2 z-20 w-2.5 h-2.5 rounded-full bg-amber-400 border-2 border-slate-950 shadow-sm" />
        )}
      </span>

      {/* Popover / Modal Editor for Text, Textarea, or Image */}
      {isEditing && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={handleCancel}
        >
          <div
            className="w-full max-w-lg rounded-3xl bg-slate-900 border border-cyan-500/40 p-6 shadow-2xl space-y-4 animate-scale-up text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                  {type === "image" ? <ImageIcon className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white">Edit Website Element</h4>
                  <span className="text-[10px] font-mono text-cyan-400 block">{contentKey}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCancel}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {uploadError && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-xs text-rose-300">
                {uploadError}
              </div>
            )}

            {/* Input by Type */}
            {type === "text" && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Element Text
                </label>
                <input
                  type="text"
                  autoFocus
                  value={draftValue}
                  onChange={(e) => setDraftValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCommit();
                    if (e.key === "Escape") handleCancel();
                  }}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
            )}

            {type === "textarea" && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Content Copy
                </label>
                <textarea
                  rows={4}
                  autoFocus
                  value={draftValue}
                  onChange={(e) => setDraftValue(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
            )}

            {type === "image" && (
              <div className="space-y-4">
                {draftValue && (
                  <div className="relative h-44 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
                    <img src={draftValue} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Upload New Image (Storage)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-cyan-400 hover:file:bg-slate-700 cursor-pointer"
                  />
                  {isUploading && (
                    <span className="flex items-center gap-1.5 text-xs text-cyan-400 mt-1 font-mono">
                      <Loader2 className="h-3 w-3 animate-spin" /> Uploading to storage...
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Or Paste Direct Image URL
                  </label>
                  <input
                    type="url"
                    value={draftValue}
                    onChange={(e) => setDraftValue(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none font-mono"
                  />
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setDraftValue(defaultValue)}
                className="text-xs text-slate-400 hover:text-cyan-400"
              >
                Reset to default
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCommit}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg transition-transform hover:scale-[1.02]"
                >
                  <Check className="h-3.5 w-3.5" />
                  Apply Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditableBlock;
