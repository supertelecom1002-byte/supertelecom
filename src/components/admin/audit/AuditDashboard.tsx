import React, { useEffect, useState } from "react";
import {
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  Info,
  RefreshCw,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Search,
  Layers,
  Link2,
  Zap,
  Activity,
  History,
} from "lucide-react";
import {
  runWebsiteAudit,
  getAuditHistory,
  type AuditReport,
  type AuditIssue,
} from "@/services/auditEngine";

interface AuditDashboardProps {
  onNavigateTab: (tab: "seo" | "services" | "feed" | "announcements" | "showcase") => void;
}

export const AuditDashboard: React.FC<AuditDashboardProps> = ({ onNavigateTab }) => {
  const [report, setReport] = useState<AuditReport | null>(null);
  const [history, setHistory] = useState<AuditReport[]>([]);
  const [scanning, setScanning] = useState<boolean>(false);
  const [severityFilter, setSeverityFilter] = useState<"all" | "critical" | "warning" | "info">("all");

  const executeScan = async () => {
    setScanning(true);
    try {
      // Small artificial delay to show scanning pulse on fast clients
      await new Promise((r) => setTimeout(r, 650));
      const res = await runWebsiteAudit();
      setReport(res);
      const hist = await getAuditHistory();
      setHistory(hist);
    } catch (err) {
      console.error("Audit run error:", err);
    } finally {
      setScanning(false);
    }
  };

  useEffect(() => {
    executeScan();
  }, []);

  const overall = report?.scores.overall ?? 0;

  // Color mapping based on score
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-400 stroke-emerald-400";
    if (score >= 75) return "text-cyan-400 stroke-cyan-400";
    if (score >= 60) return "text-amber-400 stroke-amber-400";
    return "text-rose-400 stroke-rose-400";
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
    if (score >= 75) return "bg-cyan-500/10 border-cyan-500/30 text-cyan-400";
    if (score >= 60) return "bg-amber-500/10 border-amber-500/30 text-amber-400";
    return "bg-rose-500/10 border-rose-500/30 text-rose-400";
  };

  const filteredIssues = (report?.issues || []).filter((item) => {
    if (severityFilter === "all") return true;
    return item.severity === severityFilter;
  });

  // SVG circle calculations for radial gauge
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overall / 100) * circumference;

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-cyan-950/70 border border-cyan-500/30 text-cyan-400">
              <Activity className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Real-Time Website Audit
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Targeting Giridih, Jharkhand SEO rankings, Local Schema &amp; Web Vitals
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={executeScan}
          disabled={scanning}
          className="inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-slate-950 font-bold text-sm shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${scanning ? "animate-spin" : ""}`} />
          {scanning ? "Scanning DOM & Meta..." : "Run Deep Audit"}
        </button>
      </div>

      {/* Main Score & Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Overall Circular Gauge Card */}
        <div className="lg:col-span-4 p-7 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden group shadow-2xl">
          <div className="absolute top-0 right-0 p-8 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

          <span className="text-xs uppercase tracking-widest font-mono text-slate-400 font-semibold mb-4">
            Overall Health Score
          </span>

          {/* Radial SVG Gauge */}
          <div className="relative flex items-center justify-center w-40 h-40">
            <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 130 130">
              <circle
                cx="65"
                cy="65"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="65"
                cy="65"
                r={radius}
                className={`transition-all duration-1000 ease-out ${getScoreColor(overall)}`}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={scanning ? circumference : strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className={`text-4xl font-extrabold tracking-tighter ${getScoreColor(overall)}`}>
                {scanning ? "--" : `${overall}%`}
              </span>
              <span className="text-[11px] font-mono text-slate-400 uppercase mt-0.5">
                {overall >= 90 ? "Optimal" : overall >= 75 ? "Good" : overall >= 60 ? "Average" : "Needs Fix"}
              </span>
            </div>
          </div>

          <div className="mt-5 w-full pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Last Scanned:</span>
            <span className="font-mono text-cyan-300">
              {report?.created_at ? new Date(report.created_at).toLocaleTimeString() : "Pending"}
            </span>
          </div>
        </div>

        {/* 4 Score Breakdown Cards */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 1. SEO & Meta */}
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-500/30 text-cyan-400">
                    <Search className="h-4 w-4" />
                  </span>
                  <span className="font-bold text-sm text-white">Local SEO &amp; Meta</span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${getScoreBg(report?.scores.seo || 0)}`}>
                  {report?.scores.seo || 0}%
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                Page title, description, &amp; Giridih geo-targeting keywords in DOM.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">H1 Tag Count:</span>
              <span className="font-mono text-cyan-400 font-bold">{report?.metrics.h1Count ?? 0}</span>
            </div>
          </div>

          {/* 2. Schema & NAP */}
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-emerald-950 border border-emerald-500/30 text-emerald-400">
                    <Layers className="h-4 w-4" />
                  </span>
                  <span className="font-bold text-sm text-white">JSON-LD &amp; NAP</span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${getScoreBg(report?.scores.schema || 0)}`}>
                  {report?.scores.schema || 0}%
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                Structured LocalBusiness schema, Barganda Road address &amp; phone.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Schema Types:</span>
              <span className="font-mono text-emerald-400 font-bold">
                {report?.metrics.schemaTypes?.length ?? 0} Found
              </span>
            </div>
          </div>

          {/* 3. Link Health */}
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-indigo-950 border border-indigo-500/30 text-indigo-400">
                    <Link2 className="h-4 w-4" />
                  </span>
                  <span className="font-bold text-sm text-white">Links &amp; WhatsApp</span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${getScoreBg(report?.scores.links || 0)}`}>
                  {report?.scores.links || 0}%
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                Internal link consistency, HTTPS protocol, and direct WhatsApp CTA.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">WhatsApp Links:</span>
              <span className="font-mono text-indigo-400 font-bold">{report?.metrics.whatsAppLinks ?? 0}</span>
            </div>
          </div>

          {/* 4. Performance & Media */}
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-amber-950 border border-amber-500/30 text-amber-400">
                    <Zap className="h-4 w-4" />
                  </span>
                  <span className="font-bold text-sm text-white">Media &amp; Web Vitals</span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${getScoreBg(report?.scores.performance || 0)}`}>
                  {report?.scores.performance || 0}%
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                Image alt tags for screen readers, lazy loading &amp; asset weights.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Missing Alt Tags:</span>
              <span className="font-mono text-amber-400 font-bold">{report?.metrics.imagesWithoutAlt ?? 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Issues & Opportunities Section */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-cyan-400" />
              Detected Issues &amp; Optimization Tasks
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Click &ldquo;Fix in CMS&rdquo; on any item to jump straight to the relevant editor tab.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setSeverityFilter("all")}
              className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
                severityFilter === "all"
                  ? "bg-slate-800 text-white font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              All ({(report?.issues || []).length})
            </button>
            <button
              type="button"
              onClick={() => setSeverityFilter("critical")}
              className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
                severityFilter === "critical"
                  ? "bg-rose-950/80 text-rose-300 font-bold border border-rose-500/40"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Critical ({(report?.issues || []).filter((i) => i.severity === "critical").length})
            </button>
            <button
              type="button"
              onClick={() => setSeverityFilter("warning")}
              className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
                severityFilter === "warning"
                  ? "bg-amber-950/80 text-amber-300 font-bold border border-amber-500/40"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Warnings ({(report?.issues || []).filter((i) => i.severity === "warning").length})
            </button>
            <button
              type="button"
              onClick={() => setSeverityFilter("info")}
              className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
                severityFilter === "info"
                  ? "bg-cyan-950/80 text-cyan-300 font-bold border border-cyan-500/40"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Info ({(report?.issues || []).filter((i) => i.severity === "info").length})
            </button>
          </div>
        </div>

        {/* Issue Items List */}
        {filteredIssues.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-emerald-400 mb-2" />
            <h4 className="text-sm font-bold text-white">All Checks Passed!</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              No issues detected in this category. Your website metadata and structural markup are clean.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredIssues.map((issue) => (
              <div
                key={issue.id}
                className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/90 hover:border-slate-700/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5">
                    {issue.severity === "critical" && (
                      <AlertOctagon className="h-5 w-5 text-rose-400 flex-none" />
                    )}
                    {issue.severity === "warning" && (
                      <AlertTriangle className="h-5 w-5 text-amber-400 flex-none" />
                    )}
                    {issue.severity === "info" && (
                      <Info className="h-5 w-5 text-cyan-400 flex-none" />
                    )}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{issue.title}</h4>
                      <span
                        className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-md font-semibold border ${
                          issue.severity === "critical"
                            ? "bg-rose-950 text-rose-300 border-rose-500/30"
                            : issue.severity === "warning"
                            ? "bg-amber-950 text-amber-300 border-amber-500/30"
                            : "bg-cyan-950 text-cyan-300 border-cyan-500/30"
                        }`}
                      >
                        {issue.severity}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{issue.description}</p>
                    <p className="text-[11px] text-cyan-300/90 mt-1">
                      <span className="font-semibold text-cyan-400">Recommendation:</span> {issue.recommendation}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigateTab(issue.targetTab)}
                  className="flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-200 text-xs font-bold transition-all"
                >
                  Fix in CMS
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Historical Scans Log */}
      {history.length > 1 && (
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <History className="h-4 w-4 text-slate-400" />
            Audit Scan History
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {history.slice(0, 6).map((h, idx) => (
              <div
                key={h.id || idx}
                className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="text-slate-400 block text-[11px]">
                    {new Date(h.created_at).toLocaleDateString()} {new Date(h.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {h.issues?.length ?? 0} issues flagged
                  </span>
                </div>
                <span className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold border ${getScoreBg(h.scores.overall)}`}>
                  {h.scores.overall}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditDashboard;
