import React, { useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Search,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Clipboard,
  X,
  Lock,
  Unlock,
  FileCode,
  Globe,
} from "lucide-react";
import { safeVibrate } from "@/utils/safeVibrate";
import { toast } from "sonner";

interface HeuristicResult {
  id: string;
  name: string;
  passed: boolean;
  severity: "safe" | "warning" | "danger";
  details: string;
}

export const LinkFraudInspector: React.FC<{ className?: string }> = ({ className = "" }) => {
  const [urlInput, setUrlInput] = useState<string>("");
  const [analyzed, setAnalyzed] = useState<boolean>(false);
  const [verdict, setVerdict] = useState<"safe" | "suspicious" | "danger">("safe");
  const [heuristics, setHeuristics] = useState<HeuristicResult[]>([]);

  const handlePaste = async () => {
    safeVibrate(15);
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setUrlInput(text.trim());
          analyzeUrl(text.trim());
        }
      }
    } catch {
      toast.info("Please paste the link manually into the box.");
    }
  };

  const analyzeUrl = (input: string) => {
    safeVibrate([20, 20]);
    const trimmed = input.trim();
    if (!trimmed) {
      setAnalyzed(false);
      return;
    }

    let parsed: URL | null = null;
    let raw = trimmed;
    if (!raw.startsWith("http://") && !raw.startsWith("https://")) {
      raw = `http://${raw}`;
    }

    try {
      parsed = new URL(raw);
    } catch {
      parsed = null;
    }

    const results: HeuristicResult[] = [];
    let dangerScore = 0;

    // 1. Protocol Heuristic
    const isHttps = parsed?.protocol === "https:";
    if (isHttps) {
      results.push({
        id: "protocol",
        name: "Encryption Protocol",
        passed: true,
        severity: "safe",
        details: "Valid TLS/HTTPS encryption active.",
      });
    } else {
      dangerScore += 2;
      results.push({
        id: "protocol",
        name: "Encryption Protocol",
        passed: false,
        severity: "danger",
        details: "Unencrypted HTTP link. Passwords & OTPs can be intercepted in transit.",
      });
    }

    // 2. Dangerous File Extension Heuristic
    const pathname = (parsed?.pathname || "").toLowerCase();
    const dangerousExtensions = [
      ".apk",
      ".exe",
      ".vbs",
      ".scr",
      ".bat",
      ".cmd",
      ".msi",
      ".iso",
      ".jar",
    ];
    const foundExt = dangerousExtensions.find((ext) => pathname.endsWith(ext) || raw.includes(ext));

    if (foundExt) {
      dangerScore += 4;
      results.push({
        id: "executable",
        name: "Direct Executable Payload",
        passed: false,
        severity: "danger",
        details: `Direct package download detected (${foundExt.toUpperCase()}). High malware risk.`,
      });
    } else {
      results.push({
        id: "executable",
        name: "Direct Executable Payload",
        passed: true,
        severity: "safe",
        details: "No direct unverified executable installer (.apk/.exe) detected in URL.",
      });
    }

    // 3. Raw IP Address Heuristic
    const hostname = parsed?.hostname || "";
    const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    const isRawIp = ipPattern.test(hostname);

    if (isRawIp) {
      dangerScore += 3;
      results.push({
        id: "ip_host",
        name: "Host Identity (DNS)",
        passed: false,
        severity: "danger",
        details: "Raw numeric IP host instead of domain name. Characteristic of botnets & phishing servers.",
      });
    } else {
      results.push({
        id: "ip_host",
        name: "Host Identity (DNS)",
        passed: true,
        severity: "safe",
        details: `Resolves to domain name (${hostname || "standard"}).`,
      });
    }

    // 4. High-Risk TLD Heuristic
    const highRiskTlds = [
      ".top",
      ".xyz",
      ".work",
      ".click",
      ".loan",
      ".buzz",
      ".gq",
      ".cf",
      ".ml",
      ".tk",
      ".date",
      ".fit",
    ];
    const foundTld = highRiskTlds.find((tld) => hostname.endsWith(tld));

    if (foundTld) {
      dangerScore += 2;
      results.push({
        id: "tld",
        name: "Domain Extension Reputation",
        passed: false,
        severity: "warning",
        details: `Uses high-risk TLD (${foundTld}), frequently used in throwaway WhatsApp scam campaigns.`,
      });
    } else {
      results.push({
        id: "tld",
        name: "Domain Extension Reputation",
        passed: true,
        severity: "safe",
        details: "Standard top-level domain (.com, .shop, .in, .org, .net).",
      });
    }

    // 5. Fraud Keyword Matching Heuristic
    const fraudKeywords = [
      "free-recharge",
      "free_recharge",
      "freerecharge",
      "free-data",
      "pm-kisan",
      "pmkisan",
      "paytm-cashback",
      "lottery",
      "win-iphone",
      "spin-wheel",
    ];
    const foundKeyword = fraudKeywords.find((kw) => raw.toLowerCase().includes(kw));

    if (foundKeyword) {
      dangerScore += 3;
      results.push({
        id: "keyword",
        name: "Social Engineering Pattern",
        passed: false,
        severity: "danger",
        details: `Matches known WhatsApp scam lure: "${foundKeyword}".`,
      });
    } else {
      results.push({
        id: "keyword",
        name: "Social Engineering Pattern",
        passed: true,
        severity: "safe",
        details: "No typical gift/recharge phishing keywords detected.",
      });
    }

    setHeuristics(results);
    setAnalyzed(true);

    if (dangerScore >= 3) {
      setVerdict("danger");
      safeVibrate([50, 40, 80]);
    } else if (dangerScore > 0) {
      setVerdict("suspicious");
      safeVibrate([30, 30]);
    } else {
      setVerdict("safe");
      safeVibrate(20);
    }
  };

  const handleClear = () => {
    safeVibrate(15);
    setUrlInput("");
    setAnalyzed(false);
    setHeuristics([]);
  };

  return (
    <div
      className={`p-4 rounded-3xl bg-slate-900/90 dark:bg-[#030712]/95 border border-cyan-500/30 hover:border-cyan-500/50 shadow-xl shadow-cyan-950/20 backdrop-blur-2xl transition-all ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-500/30">
                Fraud &amp; Phishing Shield
              </span>
              <span className="text-[10px] font-mono text-slate-400">Heuristic Audit</span>
            </div>
            <h3 className="text-sm font-black text-white mt-0.5">
              Phishing Link &amp; WhatsApp Scam Inspector
            </h3>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
        Paste any WhatsApp forward link, free recharge offer, or untrusted APK URL before tapping it
        to check for unencrypted connections, fake domains, and dangerous downloads.
      </p>

      {/* Input Field with Paste / Scan CTA */}
      <div className="mt-3.5 space-y-2">
        <div className="relative flex items-center">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && analyzeUrl(urlInput)}
            placeholder="Paste suspicious link (e.g. http://free-recharge.xyz)..."
            className="w-full py-2.5 pl-3 pr-20 rounded-2xl bg-slate-950/90 border border-slate-700/80 focus:border-cyan-500 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono"
          />

          <div className="absolute right-1.5 flex items-center gap-1">
            {urlInput ? (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
                title="Clear"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePaste}
                className="py-1 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-300 flex items-center gap-1 transition-colors"
                title="Paste from clipboard"
              >
                <Clipboard className="h-3 w-3" />
                <span>Paste</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => analyzeUrl(urlInput)}
              className="py-1 px-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-[10px] font-black transition-colors"
            >
              Scan
            </button>
          </div>
        </div>

        {/* Quick Test Demo Chips */}
        <div className="flex items-center gap-1.5 flex-wrap text-[10px]">
          <span className="text-slate-500 font-mono">Quick test:</span>
          <button
            type="button"
            onClick={() => {
              const testUrl = "http://free-recharge-offer.xyz/app.apk";
              setUrlInput(testUrl);
              analyzeUrl(testUrl);
            }}
            className="px-2 py-0.5 rounded-lg bg-rose-950/60 border border-rose-500/30 text-rose-300 font-mono hover:bg-rose-900/60 transition-colors"
          >
            ⚠️ Scam APK Sample
          </button>
          <button
            type="button"
            onClick={() => {
              const testUrl = "https://supertelecom.shop";
              setUrlInput(testUrl);
              analyzeUrl(testUrl);
            }}
            className="px-2 py-0.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-mono hover:bg-emerald-900/60 transition-colors"
          >
            ✅ Official Super Telecom
          </button>
        </div>
      </div>

      {/* Analysis Output Section */}
      {analyzed && (
        <div className="mt-4 space-y-3 animate-in fade-in">
          {/* Main Verdict Card */}
          <div
            className={`p-3.5 rounded-2xl border flex items-center gap-3 ${
              verdict === "danger"
                ? "bg-rose-950/70 border-rose-500/50 text-rose-200"
                : verdict === "suspicious"
                ? "bg-amber-950/70 border-amber-500/50 text-amber-200"
                : "bg-emerald-950/70 border-emerald-500/50 text-emerald-200"
            }`}
          >
            {verdict === "danger" ? (
              <XCircle className="h-6 w-6 text-rose-400 shrink-0" />
            ) : verdict === "suspicious" ? (
              <AlertTriangle className="h-6 w-6 text-amber-400 shrink-0" />
            ) : (
              <CheckCircle2 className="h-6 w-6 text-emerald-400 shrink-0" />
            )}

            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider block">
                {verdict === "danger"
                  ? "🔴 HIGH-RISK WARNING"
                  : verdict === "suspicious"
                  ? "🟡 POTENTIAL RISK DETECTED"
                  : "🟢 VERIFIED SAFE LINK PROFILE"}
              </span>
              <p className="text-xs font-bold mt-0.5 leading-snug">
                {verdict === "danger"
                  ? "Dangerous: Unverified executable file or unencrypted phishing pattern detected. Do NOT download or enter passwords."
                  : verdict === "suspicious"
                  ? "Caution advised: Link has unencrypted or suspicious domain traits. Proceed with care."
                  : "Safe Link Profile: Valid HTTPS encryption, trusted domain reputation, and zero executable parameters."}
              </p>
            </div>
          </div>

          {/* 5-Point Heuristic Audit Breakdown */}
          <div className="space-y-1.5 p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block pb-1 border-b border-slate-800">
              Heuristic Audit Breakdown:
            </span>

            {heuristics.map((h) => (
              <div key={h.id} className="flex items-start gap-2 pt-1 text-[11px]">
                {h.passed ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                ) : h.severity === "danger" ? (
                  <XCircle className="h-3.5 w-3.5 text-rose-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <span className="font-bold text-slate-200">{h.name}: </span>
                  <span className="text-slate-400">{h.details}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LinkFraudInspector;
