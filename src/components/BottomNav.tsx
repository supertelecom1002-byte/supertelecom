import React, { useState, useEffect } from "react";
import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  Home,
  Wrench,
  Search,
  Calculator,
  PhoneCall,
  MessageCircle,
  MapPin,
  X,
  Clock,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

export const BottomNav: React.FC = () => {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [labSheetOpen, setLabSheetOpen] = useState(false);
  const [trackModalOpen, setTrackModalOpen] = useState(false);
  const [trackQuery, setTrackQuery] = useState("");
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const onChatToggle = (e: Event) => {
      const customEvent = e as CustomEvent<{ open: boolean }>;
      if (customEvent.detail !== undefined) {
        setChatOpen(!!customEvent.detail.open);
      }
    };
    window.addEventListener("st:chat-toggle", onChatToggle);
    return () => window.removeEventListener("st:chat-toggle", onChatToggle);
  }, []);

  // Hide on admin routes or when AI chat is open
  if (pathname.startsWith("/admin") || chatOpen) {
    return null;
  }

  const isHomeActive = pathname === "/" || pathname === "";
  const isServicesActive = pathname.startsWith("/services");
  const isPricingActive = pathname.startsWith("/pricing");

  const handleTrackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname === "/" || pathname === "") {
      const el = document.getElementById("contact");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    setTrackModalOpen(true);
  };

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTrackModalOpen(false);
    const clean = trackQuery.trim();
    const url = `https://wa.me/918002903643?text=${encodeURIComponent(
      `Hi Super Telecom, I want to check my repair status for phone/IMEI: ${clean}`
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleRatesClick = (e: React.MouseEvent) => {
    if (pathname === "/" || pathname === "") {
      e.preventDefault();
      const el = document.getElementById("pricing-matrix");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    navigate({ to: "/pricing" });
  };

  return (
    <>
      <nav
        aria-label="Mobile Bottom App Navigation"
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden h-[60px] bg-slate-950/95 backdrop-blur-lg border-t border-slate-800/80 px-2 flex items-center justify-around pb-[max(0.4rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(0,0,0,0.7)]"
      >
        {/* 1. Home */}
        <Link
          to="/"
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all active:scale-95 ${
            isHomeActive ? "text-cyan-400" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <div className="relative">
            <Home className="h-5 w-5" />
            {isHomeActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
            )}
          </div>
          <span className="text-[10px] font-semibold tracking-tight mt-0.5">Home</span>
        </Link>

        {/* 2. Services / Shop */}
        <Link
          to="/services"
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all active:scale-95 ${
            isServicesActive ? "text-cyan-400" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <div className="relative">
            <Wrench className="h-5 w-5" />
            {isServicesActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
            )}
          </div>
          <span className="text-[10px] font-semibold tracking-tight mt-0.5">Services</span>
        </Link>

        {/* 3. Track */}
        <button
          type="button"
          onClick={handleTrackClick}
          className="flex flex-col items-center justify-center flex-1 py-1 text-slate-400 hover:text-slate-200 transition-all active:scale-95"
        >
          <Search className="h-5 w-5 text-amber-400" />
          <span className="text-[10px] font-semibold tracking-tight mt-0.5 text-amber-400">Track</span>
        </button>

        {/* 4. Rates / Cost */}
        <button
          type="button"
          onClick={handleRatesClick}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all active:scale-95 ${
            isPricingActive ? "text-cyan-400" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <div className="relative">
            <Calculator className="h-5 w-5 text-emerald-400" />
            {isPricingActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
            )}
          </div>
          <span className="text-[10px] font-semibold tracking-tight mt-0.5 text-emerald-400">Rates</span>
        </button>

        {/* 5. Lab Direct */}
        <button
          type="button"
          onClick={() => setLabSheetOpen(true)}
          className="flex flex-col items-center justify-center flex-1 py-1 text-slate-400 hover:text-slate-200 transition-all active:scale-95"
        >
          <div className="relative">
            <PhoneCall className="h-5 w-5 text-cyan-400" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
            </span>
          </div>
          <span className="text-[10px] font-semibold tracking-tight mt-0.5 text-cyan-400">Lab Direct</span>
        </button>
      </nav>

      {/* Lab Direct Quick Action Sheet */}
      {labSheetOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex flex-col justify-end bg-black/70 backdrop-blur-sm md:hidden animate-in fade-in"
          onClick={() => setLabSheetOpen(false)}
        >
          <div
            className="w-full bg-slate-950 border-t border-slate-800 rounded-t-3xl p-5 pb-8 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sheet Handle & Header */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-1 bg-slate-700 rounded-full mb-3" />
              <div className="flex items-center justify-between w-full">
                <div>
                  <h3 className="font-bold text-sm text-white">Super Telecom Engineer Desk</h3>
                  <p className="text-[11px] text-slate-400 font-mono">Barganda Road Lab, Giridih</p>
                </div>
                <button
                  type="button"
                  onClick={() => setLabSheetOpen(false)}
                  className="p-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Quick 1-Tap Actions */}
            <div className="space-y-2 pt-1">
              <a
                href="tel:+918002903643"
                className="w-full py-3 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-between shadow-lg shadow-emerald-500/20 active:scale-98 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <PhoneCall className="h-4 w-4 fill-slate-950" />
                  <span>Call Master Technician (+91 80029 03643)</span>
                </div>
                <ChevronRight className="h-4 w-4" />
              </a>

              <a
                href="https://wa.me/918002903643?text=Hi%20Super%20Telecom,%20I%20need%20urgent%20mobile%20repair%20diagnosis"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-2xl bg-slate-900 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 font-semibold text-xs flex items-center justify-between active:scale-98 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <MessageCircle className="h-4 w-4 text-cyan-400" />
                  <span>WhatsApp Diagnosis with Photos</span>
                </div>
                <ChevronRight className="h-4 w-4" />
              </a>

              <a
                href="https://maps.app.goo.gl/mu5XXCehEpocaZWY9"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-between active:scale-98 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <MapPin className="h-4 w-4 text-amber-400" />
                  <span>Get Google Maps Directions (Near Shivam Clinic)</span>
                </div>
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>

            {/* Hours Info */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Clock className="h-3.5 w-3.5" /> Open Today: 10:00 AM – 9:30 PM
              </span>
              <span className="flex items-center gap-1 text-slate-300">
                <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" /> Verified Lab
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Track Repair Modal */}
      {trackModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm md:hidden animate-in fade-in"
          onClick={() => setTrackModalOpen(false)}
        >
          <div
            className="w-full max-w-sm bg-slate-950 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-sm text-white">Live Repair Tracker</h3>
                <p className="text-[11px] text-slate-400">Enter your 10-digit mobile number or IMEI</p>
              </div>
              <button
                type="button"
                onClick={() => setTrackModalOpen(false)}
                className="p-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleTrackSubmit} className="space-y-3">
              <input
                type="text"
                value={trackQuery}
                onChange={(e) => setTrackQuery(e.target.value)}
                placeholder="e.g. 9876543210 or IMEI..."
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
              >
                <Search className="h-3.5 w-3.5" />
                <span>Track Status on WhatsApp</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default BottomNav;
