import React, { Suspense, lazy } from "react";

const Hero3DCanvas = lazy(() => import("@/components/three/Hero3DCanvas"));
import { Link } from "@tanstack/react-router";
import {
  Wrench,
  Phone,
  Clock,
  MapPin,
  ShieldCheck,
  Cpu,
  Activity,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Star,
  Shield,
  Check,
  Rocket,
  Download,
  Info,
} from "lucide-react";
import { EditableBlock } from "@/components/admin/visual/EditableBlock";
import { BUSINESS_MASTER, DATA_SAFETY_AND_PRIVACY_SUMMARY } from "@/config/superTelecomConfig";
import { getLiveGiridihStoreStatus } from "@/utils/storeHours";

export const Hero: React.FC = () => {
  const storeStatus = getLiveGiridihStoreStatus();

  const scrollToCalculator = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById("repair-calculator") || document.getElementById("pricing-matrix");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.location.hash = "#repair-calculator";
    }
  };

  return (
    <section
      id="top"
      aria-label="Super Telecom Smartphone Laboratory"
      className="relative isolate w-full max-w-full overflow-hidden bg-[#020617] pt-2 pb-5 md:pt-28 md:pb-24 flex items-center"
    >
      {/* Subtle radial cyan glow and cyber grid background (strictly clipped) */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        style={{
          background:
            "radial-gradient(circle at 50% 20%, rgba(6, 182, 212, 0.12), transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.03] overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(90deg, #06b6d4 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="pointer-events-none absolute -top-40 right-0 -z-10 h-96 w-96 rounded-full bg-cyan-500/10 blur-[130px] overflow-hidden" />
      <div className="pointer-events-none absolute bottom-0 left-0 -z-10 h-80 w-80 rounded-full bg-blue-600/10 blur-[120px] overflow-hidden" />

      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 w-full overflow-hidden">
        {/* ========================================================================= */}
        {/* MOBILE VIEW (< 768px): Native "Local Flagship Store Mobile Profile"       */}
        {/* ========================================================================= */}
        <div className="block md:hidden w-full max-w-full space-y-3">
          {/* Header Profile Card */}
          <div className="w-full rounded-2xl border border-cyan-500/30 bg-slate-900/90 p-3.5 backdrop-blur-xl shadow-[0_4px_25px_rgba(6,182,212,0.12)] space-y-2.5">
            {/* 1. Verified Store Badge */}
            <div className="flex items-center justify-between gap-1.5 flex-wrap">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950/90 border border-cyan-500/40 text-cyan-300 text-[11px] font-bold tracking-tight">
                <span className="flex h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>Super Telecom • Barganda Road</span>
                <Check className="h-3 w-3 text-cyan-400 stroke-[3]" />
              </div>

              {/* Status Pill */}
              <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${storeStatus.isOpen ? "bg-emerald-950/80 border-emerald-500/30 text-emerald-400" : "bg-rose-950/80 border-rose-500/30 text-rose-400"} border text-[10px] font-semibold`}>
                <span className={`h-1.5 w-1.5 rounded-full ${storeStatus.isOpen ? "bg-emerald-400" : "bg-rose-400"}`} />
                <span>{storeStatus.badgeText}</span>
              </div>
            </div>

            {/* Headline and Description */}
            <div className="space-y-1">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                <EditableBlock
                  contentKey="hero_h1_title"
                  defaultValue={BUSINESS_MASTER.h1Title}
                />
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                <EditableBlock
                  contentKey="hero_h1_subtitle"
                  defaultValue="Advanced motherboard micro-soldering, CPU reballing, and 30-minute original display restoration for iPhone, Samsung & OnePlus."
                  type="textarea"
                />
              </p>
            </div>

            {/* Rating & Stats Bar */}
            <div className="flex items-center justify-between gap-1 pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-300">
              <span className="flex items-center gap-1 text-cyan-300 font-bold">
                <span>Top-Rated Local Care</span>
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-cyan-300 font-semibold truncate">
                10+ Yrs (Est. 2016)
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 font-semibold">16+ Services</span>
            </div>
          </div>

          {/* Mobile Interactive 3D Teardown Lab Pill */}
          <a
            href="#teardown-3d"
            className="w-full py-2.5 px-3 rounded-xl border border-cyan-500/40 bg-gradient-to-r from-cyan-950/90 via-slate-900 to-blue-950/90 text-cyan-300 font-bold flex items-center justify-between text-xs active:scale-98 transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)]"
          >
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="font-mono">🔬 3D Teardown Lab: 19 Disassembled Parts</span>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-cyan-400" />
          </a>

          {/* Primary App Suite & Native APK Action Strip */}
          <div className="space-y-2 pt-1 w-full">
            <Link
              to="/app"
              className="w-full py-3 px-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:from-cyan-400 text-slate-950 font-black flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.35)] active:scale-95 transition-all text-xs"
            >
              <Rocket className="h-4 w-4" />
              <span>🚀 Open Super Telecom Suite (Transfer • Recover • Launcher)</span>
            </Link>

            <a
              href="/SuperTelecom.apk"
              download="SuperTelecom-Release.apk"
              className="w-full py-2.5 px-3 rounded-xl border border-cyan-500/40 bg-slate-900/90 hover:bg-slate-850 text-cyan-300 font-bold flex items-center justify-center gap-2 text-xs active:scale-95 transition-all"
            >
              <Download className="h-3.5 w-3.5 text-cyan-400" />
              <span>📲 Download Native Android APK</span>
            </a>

            {/* Old App vs New Native App Notice */}
            <div className="rounded-xl border border-cyan-500/30 bg-slate-900/90 p-3 text-[11px] text-slate-300 flex items-start gap-2.5">
              <Info className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5 leading-snug">
                <p className="font-bold text-white">Notice: Old App vs New Native App</p>
                <p className="text-slate-400">
                  यदि फोन में पुराना TWA ब्राउज़र ऐप (<code>shop.supertelecom.www.twa</code>) है, तो उसे अनइन्स्टॉल करके नया <code>com.supertelecom.app</code> इनस्टॉल करें, या ऊपर दिया गया <strong>Open Super Telecom Suite</strong> बटन दबाएं।
                </p>
              </div>
            </div>
          </div>

          {/* Primary Store Actions (Full width, easy thumb reach) */}
          <div className="grid grid-cols-2 gap-2 w-full">
            <a
              href="#repair-calculator"
              onClick={scrollToCalculator}
              className="py-2.5 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.3)] active:scale-95 transition-all text-xs"
            >
              <Wrench className="h-3.5 w-3.5" />
              <span>Consultation Finder</span>
            </a>

            <a
              href={`tel:${BUSINESS_MASTER.phoneRaw}`}
              className="py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/40 text-white font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-all text-xs"
            >
              <Phone className="h-3.5 w-3.5 text-cyan-400" />
              <span>Direct Call</span>
            </a>
          </div>

          {/* Store Trust Highlights (2x2 grid) */}
          <div className="grid grid-cols-2 gap-1.5 text-xs w-full">
            <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200">
              <Clock className="h-3.5 w-3.5 text-cyan-400 flex-none" />
              <span className="font-medium text-[10px]">30-Min Screen Swap</span>
            </div>
            <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 flex-none" />
              <span className="font-medium text-[10px]">90-Day Warranty</span>
            </div>
            <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200">
              <Cpu className="h-3.5 w-3.5 text-cyan-400 flex-none" />
              <span className="font-medium text-[10px]">Chip-Level Soldering</span>
            </div>
            <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200">
              <CheckCircle2 className="h-3.5 w-3.5 text-amber-400 flex-none" />
              <span className="font-medium text-[10px]">{DATA_SAFETY_AND_PRIVACY_SUMMARY.trustPill}</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* DESKTOP VIEW (>= 768px): Full Two-Column Engineering Lab Showcase         */}
        {/* ========================================================================= */}
        <div className="hidden md:grid items-center gap-12 lg:grid-cols-12 lg:gap-8 w-full">
          {/* Left Column: High-Impact Typography & Action CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Top Status Badge */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-cyan-500/30 bg-slate-900/80 px-4 py-1.5 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>

              <span className="text-[11px] font-mono font-bold tracking-wider text-cyan-300 uppercase flex items-center gap-1.5">
                <MapPin className="h-3 w-3 text-cyan-400" />
                <span>BARGANDA ROAD LAB</span>
                <span className="text-slate-500">•</span>
                <Clock className="h-3 w-3 text-cyan-400" />
                <span>{storeStatus.badgeText.toUpperCase()}</span>
              </span>
            </div>

            {/* Main Headline - Single H1 on Page */}
            <h1 className="mt-6 font-display text-4xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              <EditableBlock
                contentKey="hero_h1_title"
                defaultValue={BUSINESS_MASTER.h1Title}
              />
            </h1>

            {/* Subtitle */}
            <p className="mt-5 text-base lg:text-lg text-slate-300 max-w-2xl leading-relaxed">
              <EditableBlock
                contentKey="hero_h1_subtitle"
                defaultValue="Advanced motherboard micro-soldering, double-decker CPU reballing, and 30-minute original display restoration for iPhone, Samsung Ultra &amp; OnePlus."
                type="textarea"
              />
            </p>

            {/* Technical Verification Highlights */}
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono text-slate-400">
              <span className="inline-flex items-center gap-1.5 text-cyan-400">
                <CheckCircle2 className="h-3.5 w-3.5" /> 100% ESD-Safe Benches
              </span>
              <span className="inline-flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="h-3.5 w-3.5" /> 90-Day Lab Warranty
              </span>
              <span className="inline-flex items-center gap-1.5 text-slate-300">
                <Activity className="h-3.5 w-3.5 text-cyan-400" /> 0.02mm Jumper Precision
              </span>
            </div>

            {/* Primary App Suite & Native APK Action Strip */}
            <div className="mt-7 flex flex-wrap items-center gap-3 w-full">
              <Link
                to="/app"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:from-cyan-400 text-slate-950 px-6 py-4 text-sm font-black shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all hover:scale-[1.02] active:scale-95 min-h-[52px]"
              >
                <Rocket className="h-5 w-5" />
                <span>🚀 Open Super Telecom Suite (Transfer • Recover • Launcher)</span>
              </Link>

              <a
                href="/SuperTelecom.apk"
                download="SuperTelecom-Release.apk"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cyan-500/40 bg-slate-900/90 hover:bg-slate-800 text-cyan-300 px-6 py-4 text-sm font-bold backdrop-blur-md transition-all hover:border-cyan-400 active:scale-95 min-h-[52px]"
              >
                <Download className="h-4 w-4 text-cyan-400" />
                <span>📲 Download Native Android APK</span>
              </a>
            </div>

            {/* Old App vs New Native App Notice */}
            <div className="mt-3.5 rounded-2xl border border-cyan-500/30 bg-slate-900/80 p-4 text-xs text-slate-300 flex items-start gap-3 backdrop-blur-xl max-w-2xl">
              <Info className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-white text-xs">Old App vs New Native App Notice:</p>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  यदि आपके फोन में पुराना TWA ब्राउज़र-आधारित ऐप (<code>shop.supertelecom.www.twa</code>) इन्स्टॉल है, तो उसे अनइन्स्टॉल करके नया <code>com.supertelecom.app</code> इनस्टॉल करें, या ऊपर दिए गए <strong>Open Super Telecom Suite</strong> बटन से सीधे सभी फीचर्स इस्तेमाल करें।
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <a
                href="#repair-calculator"
                onClick={scrollToCalculator}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-6 py-4 text-sm font-bold shadow-[0_0_25px_rgba(6,182,212,0.35)] transition-all hover:scale-[1.02] active:scale-95 min-h-[48px]"
              >
                <Wrench className="h-4 w-4" />
                <span>Repair Consultation Finder</span>
                <ChevronRight className="h-4 w-4 ml-0.5" />
              </a>

              <a
                href={`tel:${BUSINESS_MASTER.phoneRaw}`}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-white px-6 py-4 text-sm font-bold backdrop-blur-md transition-all hover:border-cyan-500/40 active:scale-95 min-h-[48px]"
              >
                <Phone className="h-4 w-4 text-cyan-400" />
                <span>Direct Engineer Call</span>
              </a>
            </div>

            {/* Social Proof Strip */}
            <div className="mt-8 flex flex-wrap items-center gap-3 text-xs text-slate-400 border-t border-slate-800/80 pt-4">
              <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
                <Shield className="h-4 w-4 text-cyan-400" />
                <span>Verified Local Shop on Google Maps</span>
              </div>
              <span className="text-slate-600">•</span>
              <span className="text-cyan-300 font-semibold">
                10+ Years in Giridih (Est. 2016)
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 font-semibold">
                16+ Dedicated Repair Silos
              </span>
            </div>
          </div>

          {/* Right Column: Interactive 3D Smartphone Showcase */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            <Suspense
              fallback={
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-cyan-500/30 bg-slate-950 p-6 flex flex-col items-center justify-center text-center shadow-[0_0_35px_rgba(6,182,212,0.15)]">
                  <div className="h-10 w-10 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin mb-3" />
                  <span className="text-xs font-mono text-cyan-300 font-bold tracking-wider">CALIBRATING 3D LAB BENCH...</span>
                </div>
              }
            >
              <Hero3DCanvas />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
