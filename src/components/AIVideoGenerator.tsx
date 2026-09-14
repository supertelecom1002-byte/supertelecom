import React, { useState } from "react";
import {
  Sparkles,
  Video,
  Download,
  Copy,
  Check,
  RefreshCw,
  Film,
} from "lucide-react";

interface Preset {
  id: string;
  name: string;
  badge: string;
  prompt: string;
  videoUrl: string;
}

const PRESETS: Preset[] = [
  {
    id: "micro-soldering",
    name: "Motherboard Micro-soldering",
    badge: "Hardware Precision",
    prompt:
      "Ultra-macro cinematic 4K video of micro-soldering an iPhone logic board BGA chip under stereoscopic microscope, glowing flux bubbling, surgical precision tweezers, high-tech neon cyan and amber lighting, 60fps slow-motion.",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  },
  {
    id: "oled-separation",
    name: "OLED Screen Separation",
    badge: "Display Tech",
    prompt:
      "High-precision heated tungsten separation wire slicing cleanly between cracked glass and flexible OLED panel, micro suction array, cleanroom workshop bench bathed in cyan LED glow, pristine 8K macro capture.",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  },
  {
    id: "ultrasonic-cleaning",
    name: "Ultrasonic Cleaning",
    badge: "Chemical & Sonic",
    prompt:
      "Submerged smartphone PCB motherboard in heated ultrasonic cavitation bath, microscopic cavitation bubbles scrubbing away corrosion, illuminated turquoise acoustic fluid, crystal-clear 4K macro reveal.",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  },
  {
    id: "zero-gravity-teardown",
    name: "Zero-Gravity Floating Phone Teardown",
    badge: "Sci-Fi Cyber",
    prompt:
      "Futuristic exploded view of a titanium smartphone floating in zero gravity, multilayered sapphire lens assembly, stacked logic board and battery hovering in mid-air, volumetric cyan rim lighting, cyber aesthetic.",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
  },
];

export const AIVideoGenerator: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<Preset>(PRESETS[0]);
  const [prompt, setPrompt] = useState<string>(PRESETS[0].prompt);
  const [aspectRatio, setAspectRatio] = useState<"9:16" | "16:9">("16:9");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [videoKey, setVideoKey] = useState<number>(Date.now());
  const [progress, setProgress] = useState<number>(100);

  const triggerSimulation = (preset = selectedPreset) => {
    setIsGenerating(true);
    setProgress(10);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 25;
      });
    }, 250);

    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setIsGenerating(false);
      setVideoKey(Date.now());
    }, 1200);
  };

  const handlePresetSelect = (preset: Preset) => {
    setSelectedPreset(preset);
    setPrompt(preset.prompt);
    triggerSimulation(preset);
  };

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy prompt:", err);
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = selectedPreset.videoUrl;
    link.download = `super-telecom-${selectedPreset.id}-${aspectRatio.replace(":", "x")}.mp4`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="ai-video-generator" className="relative w-full py-20 px-4 md:px-8 bg-slate-950 border-y border-cyan-950/60 overflow-hidden text-slate-100">
      {/* Dark cyber ambient lighting */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-cyan-500/10 blur-[140px] rounded-full" />
      <div className="pointer-events-none absolute -bottom-20 right-10 w-96 h-96 bg-blue-600/10 blur-[130px] rounded-full" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
            AI Video Synthesis Engine
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Super Telecom <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500">AI Video Generator</span>
          </h2>
          <p className="mt-4 text-slate-400 text-sm sm:text-base leading-relaxed">
            Generate cinematic AI video demonstrations of micro-soldering, delicate screen replacements, and floating holographic teardowns tailored for social reels or landscape displays.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-6 space-y-6">
            {/* Category Presets */}
            <div className="bg-slate-900/90 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-slate-800/90 shadow-xl">
              <label className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-3">
                <Film className="w-4 h-4 text-cyan-400" />
                Category Presets
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PRESETS.map((preset) => {
                  const isSelected = selectedPreset.id === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handlePresetSelect(preset)}
                      className={`text-left p-3.5 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                        isSelected
                          ? "bg-cyan-950/70 border-cyan-400/90 shadow-[0_0_18px_rgba(6,182,212,0.3)] text-white"
                          : "bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900/80"
                      }`}
                    >
                      <span className="text-[11px] text-cyan-400 font-mono mb-1 font-semibold">
                        {preset.badge}
                      </span>
                      <span className="text-sm font-medium leading-snug">
                        {preset.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ratio Switcher */}
            <div className="bg-slate-900/90 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-slate-800/90 shadow-xl">
              <label className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-3">
                <Video className="w-4 h-4 text-cyan-400" />
                Ratio Switcher
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAspectRatio("9:16")}
                  className={`py-3 px-4 rounded-xl border text-sm flex items-center justify-center gap-2.5 transition-all ${
                    aspectRatio === "9:16"
                      ? "bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                      : "bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 font-medium"
                  }`}
                >
                  <span className="w-3.5 h-5 border-2 border-current rounded-sm inline-block" />
                  9:16 (Reels/Shorts)
                </button>
                <button
                  type="button"
                  onClick={() => setAspectRatio("16:9")}
                  className={`py-3 px-4 rounded-xl border text-sm flex items-center justify-center gap-2.5 transition-all ${
                    aspectRatio === "16:9"
                      ? "bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                      : "bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 font-medium"
                  }`}
                >
                  <span className="w-5 h-3.5 border-2 border-current rounded-sm inline-block" />
                  16:9 (Landscape)
                </button>
              </div>
            </div>

            {/* Editable Prompt Box */}
            <div className="bg-slate-900/90 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-slate-800/90 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  Editable Prompt Box
                </label>
                <button
                  type="button"
                  onClick={handleCopyPrompt}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-cyan-400 transition-colors py-1.5 px-3 rounded-lg bg-slate-800/80 border border-slate-700 hover:border-cyan-500/50"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy Prompt</span>
                    </>
                  )}
                </button>
              </div>
              <textarea
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full bg-slate-950/90 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl p-3.5 text-xs sm:text-sm text-slate-200 leading-relaxed resize-none transition-colors outline-none font-mono"
                placeholder="Enter prompt description..."
              />
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => triggerSimulation()}
                  disabled={isGenerating}
                  className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_22px_rgba(6,182,212,0.35)] transition-all disabled:opacity-50"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`}
                  />
                  {isGenerating ? "Simulating AI Video Render..." : "Generate AI Simulation"}
                </button>
              </div>
            </div>
          </div>

          {/* Simulation Preview Viewport Column */}
          <div className="lg:col-span-6">
            <div className="bg-slate-900/90 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-slate-800/90 shadow-2xl flex flex-col items-center">
              <div className="w-full flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-xs font-bold text-slate-300 font-mono tracking-wide">
                    SIMULATION VIEWPORT // {aspectRatio}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-cyan-400 bg-cyan-950/80 border border-cyan-500/40 hover:bg-cyan-900/60 px-3 py-1.5 rounded-lg transition-all shadow-[0_0_12px_rgba(6,182,212,0.2)]"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Sample Video
                </button>
              </div>

              {/* Viewport Frame with Dynamic Aspect Ratio */}
              <div
                className={`relative w-full rounded-xl overflow-hidden bg-slate-950 border border-cyan-500/20 shadow-inner flex items-center justify-center transition-all duration-300 ${
                  aspectRatio === "9:16"
                    ? "aspect-[9/16] max-w-[300px] sm:max-w-[340px] mx-auto"
                    : "aspect-video w-full"
                }`}
              >
                {isGenerating ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-sm z-20 p-6 text-center">
                    <div className="relative mb-4">
                      <div className="w-16 h-16 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
                      <Sparkles className="w-6 h-6 text-cyan-400 absolute inset-0 m-auto animate-pulse" />
                    </div>
                    <p className="text-sm font-bold text-white tracking-wide">
                      Generating Neural Video Frames
                    </p>
                    <p className="text-xs text-cyan-400 font-mono mt-1">
                      {progress}% Completed
                    </p>
                    <div className="w-48 bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                      <div
                        className="bg-cyan-400 h-full transition-all duration-300 rounded-full shadow-[0_0_10px_#22d3ee]"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <video
                    key={videoKey}
                    src={selectedPreset.videoUrl}
                    controls
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Cyber Hud Overlays */}
                <div className="absolute top-2.5 left-2.5 pointer-events-none text-cyan-400/70 text-[10px] font-mono bg-slate-950/70 px-2 py-0.5 rounded border border-cyan-500/30">
                  REC 4K // 60 FPS
                </div>
                <div className="absolute bottom-2.5 right-2.5 pointer-events-none text-cyan-400/70 text-[10px] font-mono bg-slate-950/70 px-2 py-0.5 rounded border border-cyan-500/30">
                  SUPER_NEURAL_V2
                </div>
              </div>

              {/* Metadata Footer */}
              <div className="w-full mt-4 pt-3.5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span className="truncate max-w-[200px] sm:max-w-none">Preset: {selectedPreset.name}</span>
                <span className="text-cyan-400 font-semibold">{aspectRatio} Format</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIVideoGenerator;
