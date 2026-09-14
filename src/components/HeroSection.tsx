import React from "react";
import {
  Sparkles,
  Calendar,
  Phone,
  MessageCircle,
  Mail,
  ChevronDown,
} from "lucide-react";
import heroImg from "@/assets/hero-repair.jpg";

const PHONE = "+918002903643";
const WHATSAPP = "918002903643";
const EMAIL = "supertelecom1002@gmail.com";
const HERO_VIDEO_URL =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";

export const HeroSection: React.FC = () => {
  return (
    <section
      id="top"
      className="relative isolate min-h-screen w-full overflow-hidden flex flex-col justify-center bg-slate-950"
    >
      {/* Cinematic AI Repair Video Background */}
      <video
        src={HERO_VIDEO_URL}
        poster={heroImg}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-label="Cinematic AI repair demonstration video at Super Telecom Giridih"
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />

      {/* Subtle Dark Cyan Cyber Overlay for 100% Readability */}
      <div className="absolute inset-0 -z-10 bg-slate-950/75" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-950/85 via-cyan-950/35 to-slate-950" />
      <div className="absolute inset-0 -z-10 bg-cyan-900/10 backdrop-blur-[0.5px]" />

      {/* Cyber Ambient Glow Spotlights */}
      <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-cyan-500/15 blur-[140px] rounded-full" />

      {/* Hero Content Container */}
      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-4 pt-28 pb-20 text-center sm:px-6 z-10">
        {/* Top Eyebrow Badge */}
        <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-950/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
          <Sparkles className="h-3.5 w-3.5 animate-pulse text-cyan-400" />
          Trusted by 2 Lakh+ customers · 10+ years in Giridih
        </div>

        {/* Main Heading */}
        <h1 className="animate-fade-up mt-6 font-display text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-7xl">
          Super Telecom — <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500">Mobile Repair Shop</span> in Giridih
        </h1>

        {/* Subtitle */}
        <p className="animate-fade-up mt-4 font-display text-lg text-white/95 sm:text-2xl font-medium">
          Display, battery &amp; chip-level repairs · Second-hand phones · Accessories
        </p>

        <p className="animate-fade-up mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
          Professional Mobile Repair · Motherboard Repair · Second-Hand Phones · New Smartphones ·
          Accessories · Fast Same-Day Service
        </p>

        {/* Call to Action Buttons */}
        <div className="animate-fade-up mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#contact"
            className="inline-flex items-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-7 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-transform hover:scale-[1.04]"
          >
            <Calendar className="mr-2 h-4 w-4 text-slate-950" /> Book Repair
          </a>
          <a
            href={`tel:${PHONE}`}
            className="inline-flex items-center rounded-full border border-cyan-500/40 bg-slate-900/80 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-slate-800/80 hover:border-cyan-400"
          >
            <Phone className="mr-2 h-4 w-4 text-cyan-400" /> Call Now
          </a>
          <a
            href={`https://wa.me/${WHATSAPP}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900/60 px-7 py-3.5 text-sm font-semibold text-white hover:bg-slate-800/60 hover:border-emerald-500/50"
          >
            <MessageCircle className="mr-2 h-4 w-4 text-emerald-400" /> WhatsApp
          </a>
          <a
            href={`mailto:${EMAIL}`}
            className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900/60 px-7 py-3.5 text-sm font-semibold text-white hover:bg-slate-800/60 hover:border-cyan-500/50"
          >
            <Mail className="mr-2 h-4 w-4 text-cyan-400" /> Email Us
          </a>
        </div>

        {/* Star Rating Social Proof */}
        <div className="animate-fade-up mt-6 flex items-center gap-2 text-sm text-slate-200">
          <div className="flex text-amber-400 text-base" aria-hidden>
            ★★★★★
          </div>
          <span className="font-medium">5.0★ Google Rating · 2 Lakh+ Happy Customers</span>
        </div>

        {/* Highlights Counter Grid */}
        <dl className="animate-fade-up mt-10 grid w-full max-w-2xl grid-cols-3 gap-3 sm:gap-4">
          {[
            ["10+", "Years Experience"],
            ["1M+", "Repairs Completed"],
            ["5.0★", "Customer Rating"],
          ].map(([n, l]) => (
            <div
              key={l}
              className="rounded-2xl border border-cyan-500/20 bg-slate-900/70 backdrop-blur-md p-4 shadow-lg text-center"
            >
              <dt className="font-display text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                {n}
              </dt>
              <dd className="mt-1 text-[11px] uppercase tracking-wider text-slate-300 font-mono">
                {l}
              </dd>
            </div>
          ))}
        </dl>

        {/* Scroll Indicator */}
        <a
          href="#services"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-cyan-400/80 transition-colors hover:text-cyan-300"
          aria-label="Scroll to services"
        >
          <ChevronDown className="h-6 w-6 animate-bounce" />
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
