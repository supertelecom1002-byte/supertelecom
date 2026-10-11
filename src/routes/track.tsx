import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/Header";
import { SiteFooter } from "@/components/SiteFooter";
import { MobileAppShell } from "@/components/layout/MobileAppShell";
import {
  findRepairJob,
  type RepairJob,
  STAGE_METADATA,
  type RepairStage,
  buildWhatsAppStatusUrl,
} from "@/services/repairJobsService";
import {
  Search,
  CheckCircle2,
  Clock,
  Cpu,
  Smartphone,
  ShieldCheck,
  MessageCircle,
  AlertCircle,
  Phone,
  Sparkles,
} from "lucide-react";
import { SITE_URL } from "@/data/site";

const ORDERED_STAGES: RepairStage[] = [
  "received",
  "diagnosing",
  "qc_testing",
  "ready",
];

export const Route = createFileRoute("/track")({
  head: () => ({
    meta: [
      {
        title: "Track Live Mobile Repair Status — Super Telecom Lab Giridih",
      },
      {
        name: "description",
        content:
          "Check live job sheet status for your smartphone repair at Super Telecom, Barganda Road, Giridih. Live pipeline tracking from intake to QC testing and delivery.",
      },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/track` }],
  }),
  component: TrackPage,
});

function TrackPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [job, setJob] = useState<RepairJob | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const match = await findRepairJob(query);
      if (match) {
        setJob(match);
      } else {
        setErrorMsg(
          `No active repair job found matching "${query}". Try sample ID: ST-1082 or phone: 9876543210.`
        );
        setJob(null);
      }
    } catch {
      setErrorMsg("Failed to query repair database. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStageIndex = (stage: RepairStage) => {
    if (stage === "delivered") return 4;
    return ORDERED_STAGES.indexOf(stage);
  };

  return (
    <>
      {/* Mobile Native Shell View */}
      <div className="md:hidden">
        <MobileAppShell initialTab="track" />
      </div>

      {/* Desktop Enterprise View */}
      <div className="hidden md:block min-h-screen bg-background text-foreground">
        <Header />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-10">
          {/* Hero */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-500/40 text-amber-900 dark:text-amber-300 text-xs font-mono font-bold tracking-tight">
              <Search className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              <span>LIVE REPAIR PIPELINE TRACKER</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Track Your Device Repair in Real Time
            </h1>

            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              Enter your Super Telecom Job Sheet number (e.g.{" "}
              <strong className="text-foreground">ST-1082</strong>) or registered
              phone number to monitor progress across our Barganda Road ESD bench.
            </p>
          </div>

          {/* Search Box */}
          <div className="p-6 rounded-3xl bg-card border border-border shadow-xl space-y-4">
            <form onSubmit={handleSearch} className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter Job ID (e.g. ST-1082) or 10-digit phone number..."
                  className="w-full pl-12 pr-4 py-3.5 text-sm sm:text-base bg-background border border-border rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm tracking-wide flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <span>Searching...</span>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    <span>Track Device</span>
                  </>
                )}
              </button>
            </form>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Quick Test Samples:</span>
              <button
                type="button"
                onClick={() => {
                  setQuery("ST-1082");
                  findRepairJob("ST-1082").then(setJob);
                }}
                className="text-amber-600 dark:text-amber-400 font-mono font-bold hover:underline"
              >
                ST-1082 (iPhone 13)
              </button>
              <span>&bull;</span>
              <button
                type="button"
                onClick={() => {
                  setQuery("ST-1083");
                  findRepairJob("ST-1083").then(setJob);
                }}
                className="text-amber-600 dark:text-amber-400 font-mono font-bold hover:underline"
              >
                ST-1083 (S22 Ultra)
              </button>
            </div>

            {errorMsg && (
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2.5">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* Job Result Card */}
          {job && (
            <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-2xl space-y-8 animate-in fade-in duration-300">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xl sm:text-2xl font-black text-amber-500">
                      #{job.id}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-muted border border-border text-xs font-medium">
                      {job.device_model}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-foreground mt-1">
                    Customer: {job.customer_name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Issue: {job.issue_description}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs text-muted-foreground block font-mono">
                    Estimated Quote
                  </span>
                  <span className="text-2xl font-black text-foreground">
                    ₹{job.estimated_cost.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-bold">
                    Parts &amp; Labor Included
                  </span>
                </div>
              </div>

              {/* 4-Stage Stepper */}
              <div className="space-y-4">
                <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-bold">
                  Bench Progression Status
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  {ORDERED_STAGES.map((s, idx) => {
                    const currentIdx = getStageIndex(job.current_stage);
                    const isDone = idx < currentIdx;
                    const isCurrent = idx === currentIdx;
                    const meta = STAGE_METADATA[s];

                    return (
                      <div
                        key={s}
                        className={`p-4 rounded-2xl border transition-all ${
                          isCurrent
                            ? "bg-amber-50 dark:bg-amber-950/40 border-amber-500 shadow-md shadow-amber-500/10"
                            : isDone
                            ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500/40"
                            : "bg-muted/40 border-border opacity-60"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-mono font-bold">
                            Stage 0{idx + 1}
                          </span>
                          {isDone ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                          ) : isCurrent ? (
                            <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400 animate-spin" />
                          ) : (
                            <div className="h-3 w-3 rounded-full border border-muted-foreground/40" />
                          )}
                        </div>
                        <h5 className="text-xs font-bold text-foreground">
                          {meta.label}
                        </h5>
                        <p className="text-[11px] text-muted-foreground mt-1 leading-snug">
                          {meta.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Technician Notes */}
              {job.notes && (
                <div className="p-4 rounded-2xl bg-muted/60 border border-border space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-bold block">
                    Lead Technician Bench Log
                  </span>
                  <p className="text-xs text-foreground font-mono">
                    {job.notes}
                  </p>
                </div>
              )}

              {/* Direct WhatsApp Action */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground">
                  Need priority bench updates or express delivery?
                </span>
                <a
                  href={buildWhatsAppStatusUrl(job)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 active:scale-95 transition-all shadow-md shadow-emerald-600/20"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Inquire on WhatsApp</span>
                </a>
              </div>
            </div>
          )}
        </main>

        <SiteFooter />
      </div>
    </>
  );
}
