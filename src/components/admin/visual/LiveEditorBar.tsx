import React, { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Sparkles,
  Check,
  RotateCcw,
  UploadCloud,
  LayoutDashboard,
  Eye,
  Edit3,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useVisualEditor } from "@/context/VisualEditorContext";

export const LiveEditorBar: React.FC = () => {
  const { isAdmin } = useAdminAuth();
  const {
    isEditMode,
    toggleEditMode,
    pendingCount,
    hasChanges,
    saveAllChanges,
    discardChanges,
    isSaving,
  } = useVisualEditor();

  const [publishSuccess, setPublishSuccess] = useState<boolean>(false);
  const navigate = useNavigate();

  // Do not render anything if the user is not a verified admin
  if (!isAdmin) {
    return null;
  }

  const handlePublish = async () => {
    const success = await saveAllChanges();
    if (success) {
      setPublishSuccess(true);
      setTimeout(() => setPublishSuccess(false), 2500);
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-up">
      <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-slate-900/95 border border-cyan-500/40 shadow-[0_10px_35px_rgba(6,182,212,0.25)] backdrop-blur-xl text-white text-xs font-medium transition-all">
        {/* Brand / Mode Indicator */}
        <div className="flex items-center gap-2 pr-2 border-r border-slate-700/80">
          <span className="p-1 rounded-lg bg-cyan-950 border border-cyan-500/30 text-cyan-400">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          <span className="font-bold text-white hidden sm:inline">Live Editor</span>
        </div>

        {/* Toggle Switch: Visual Edit Mode */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleEditMode}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
              isEditMode ? "bg-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.6)]" : "bg-slate-800"
            }`}
            aria-label="Toggle Visual Edit Mode"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-slate-950 transition-transform ${
                isEditMode ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <span className="text-slate-300 font-semibold cursor-pointer select-none" onClick={toggleEditMode}>
            {isEditMode ? (
              <span className="text-cyan-400 flex items-center gap-1">
                <Edit3 className="h-3 w-3" /> Editing ON
              </span>
            ) : (
              <span className="text-slate-400 flex items-center gap-1">
                <Eye className="h-3 w-3" /> Preview
              </span>
            )}
          </span>
        </div>

        {/* Unsaved Changes Badge */}
        {hasChanges && (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-700/80">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
              {pendingCount} unsaved
            </span>

            {/* Discard Button */}
            <button
              type="button"
              onClick={discardChanges}
              disabled={isSaving}
              className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
              title="Discard all pending changes"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Publish Live Button */}
        {hasChanges && (
          <button
            type="button"
            onClick={handlePublish}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg transition-all active:scale-95 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Publishing...</span>
              </>
            ) : publishSuccess ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-950" />
                <span>Published!</span>
              </>
            ) : (
              <>
                <UploadCloud className="h-3.5 w-3.5" />
                <span>Publish Live</span>
              </>
            )}
          </button>
        )}

        {/* Exit to Dashboard */}
        <div className="pl-2 border-l border-slate-700/80">
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs font-semibold"
          >
            <LayoutDashboard className="h-3 w-3" />
            <span className="hidden sm:inline">Admin Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LiveEditorBar;
