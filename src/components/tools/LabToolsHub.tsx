import React, { useState, useEffect } from "react";
import {
  Wrench,
  X,
  Sparkles,
  ArrowRight,
  Search,
} from "lucide-react";
import { fetchAppConfig, subscribeToAppConfig, type AppConfig, DEFAULT_APP_CONFIG } from "@/services/appConfigService";
import {
  TOOLS,
  type ToolId,
  type ToolCategory,
  type ToolDefinition,
} from "@/data/labToolsRegistry";
import { LazyToolModalRenderer } from "@/components/tools/LazyToolModalRenderer";

export { TOOLS, type ToolId, type ToolCategory, type ToolDefinition };

interface LabToolsHubProps {
  isOpen: boolean;
  onClose: () => void;
  initialTool?: ToolId | null;
}

export const LabToolsHub: React.FC<LabToolsHubProps> = ({
  isOpen,
  onClose,
  initialTool = null,
}) => {
  const [config, setConfig] = useState<AppConfig>(DEFAULT_APP_CONFIG);
  const [activeModal, setActiveModal] = useState<ToolId | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>("all");

  useEffect(() => {
    fetchAppConfig().then(setConfig);
    const unsub = subscribeToAppConfig(setConfig);
    return unsub;
  }, []);

  useEffect(() => {
    if (initialTool) {
      setActiveModal(initialTool);
    }
  }, [initialTool]);

  if (!isOpen) return null;

  // Filter tools based on appConfig switches, category tabs, and search query
  const filteredTools = TOOLS.filter((tool) => {
    if (tool.configKey && config && config[tool.configKey] === false) {
      return false;
    }
    if (selectedCategory !== "all" && tool.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        tool.title.toLowerCase().includes(q) ||
        tool.subtitle.toLowerCase().includes(q) ||
        tool.tag.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const categories: { key: ToolCategory; label: string }[] = [
    { key: "all", label: "All Tools" },
    { key: "audio", label: "Audio & Haptics" },
    { key: "screen", label: "Display & Screen" },
    { key: "sensors", label: "Sensors & Torch" },
    { key: "system", label: "Battery & System" },
  ];

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/80 backdrop-blur-md p-0 md:p-4 select-none animate-fade-up"
        onClick={onClose}
      >
        <div
          data-lenis-prevent
          className="relative max-w-4xl w-full max-h-[92vh] md:max-h-[85vh] bg-[#020617] border border-cyan-500/30 rounded-t-3xl md:rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col gap-4 text-white overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Mobile Slide-Up Pull Handle */}
          <div className="md:hidden flex justify-center -mt-1 -mb-1">
            <div className="w-12 h-1.5 rounded-full bg-slate-700" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-none">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-gradient-brand text-primary-foreground shadow-brand">
                <Wrench className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg flex items-center gap-2">
                  <span>16-in-1 Hardware Lab Diagnostic Suite</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-400">
                    100% Offline
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Client-side browser diagnostics &bull; Zero data stored &bull; Native Web APIs
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative flex-none">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search hardware tool (e.g. mic, screen, battery, imei)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500/60 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-none pb-1">
            {categories.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.key
                    ? "bg-cyan-500 text-slate-950 font-bold shadow-sm shadow-cyan-500/30"
                    : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Tools Grid */}
          <div className="flex-1 overflow-y-auto no-scrollbar pr-1 grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3 py-1">
            {filteredTools.length === 0 ? (
              <div className="col-span-2 md:col-span-3 text-center py-10 text-slate-400 text-xs">
                No matching hardware diagnostic tools found.
              </div>
            ) : (
              filteredTools.map((tool) => {
                const IconComponent = tool.icon;
                return (
                  <div
                    key={tool.id}
                    onClick={() => setActiveModal(tool.id)}
                    className="p-3 sm:p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900/90 active:scale-95 transition-all cursor-pointer flex flex-col justify-between group shadow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-2">
                        <div className="p-2 rounded-xl bg-slate-800 text-cyan-400 group-hover:scale-105 transition-transform">
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border truncate ${tool.badgeColor}`}>
                          {tool.tag}
                        </span>
                      </div>

                      <h4 className="font-bold text-xs sm:text-sm text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                        {tool.title}
                      </h4>
                      <p className="text-[10px] sm:text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                        {tool.subtitle}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-cyan-400 font-bold">
                      <span>Launch</span>
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Note */}
          <div className="flex-none pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-cyan-300">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              Super Telecom Barganda Road Hardware Lab
            </span>
            <span className="hidden sm:inline">16+ Built-in Utilities</span>
          </div>
        </div>
      </div>

      {/* Lazy-Loaded Active Tool Modal */}
      <LazyToolModalRenderer
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        onSelectTool={setActiveModal}
      />
    </>
  );
};

export default LabToolsHub;
