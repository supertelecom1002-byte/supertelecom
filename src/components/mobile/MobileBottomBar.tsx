import React from "react";
import { PhoneCall, MessageCircle, Navigation, Wrench } from "lucide-react";
import { useRouterState } from "@tanstack/react-router";

export const MobileBottomBar: React.FC = () => {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Hide on admin routes
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const handleRatesClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // If on homepage, smooth scroll to #pricing-matrix
    if (pathname === "/" || pathname === "") {
      e.preventDefault();
      const el = document.getElementById("pricing-matrix");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.location.hash = "#pricing-matrix";
      }
    }
  };

  return (
    <aside
      aria-label="Quick mobile contact and actions"
      className="fixed bottom-0 left-0 right-0 z-50 block md:hidden bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/80 px-2 py-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(0,0,0,0.6)]"
    >
      <div className="grid grid-cols-4 gap-1.5 max-w-md mx-auto">
        {/* 1. Call Now */}
        <a
          href="tel:+918002903643"
          className="flex flex-col items-center justify-center min-h-[50px] py-1 px-1 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 text-slate-300 hover:text-white transition-all active:scale-95 group"
          aria-label="Call Super Telecom now at +91 80029 03643"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 group-hover:text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.25)] transition-all">
            <PhoneCall className="w-4 h-4 animate-pulse" />
          </div>
          <span className="text-[10px] font-bold tracking-tight mt-1 text-emerald-400">
            Call Now
          </span>
        </a>

        {/* 2. WhatsApp */}
        <a
          href="https://wa.me/918002903643?text=Hi%20Super%20Telecom,%20I%20need%20quick%20mobile%20repair%20help"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center min-h-[50px] py-1 px-1 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white transition-all active:scale-95 group"
          aria-label="Chat with Super Telecom on WhatsApp"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20 group-hover:text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.25)] transition-all">
            <MessageCircle className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold tracking-tight mt-1 text-cyan-400">
            WhatsApp
          </span>
        </a>

        {/* 3. Directions */}
        <a
          href="https://maps.app.goo.gl/mu5XXCehEpocaZWY9"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center min-h-[50px] py-1 px-1 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 text-slate-300 hover:text-white transition-all active:scale-95 group"
          aria-label="Get Google Maps directions to Barganda Road, Giridih"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20 group-hover:text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.25)] transition-all">
            <Navigation className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold tracking-tight mt-1 text-amber-400">
            Directions
          </span>
        </a>

        {/* 4. Rates */}
        <a
          href="/#pricing-matrix"
          onClick={handleRatesClick}
          className="flex flex-col items-center justify-center min-h-[50px] py-1 px-1 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-violet-500/40 text-slate-300 hover:text-white transition-all active:scale-95 group"
          aria-label="View repair pricing matrix and rate chart"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-violet-500/10 text-violet-400 group-hover:bg-violet-500/20 group-hover:text-violet-300 shadow-[0_0_12px_rgba(139,92,246,0.25)] transition-all">
            <Wrench className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold tracking-tight mt-1 text-violet-400">
            Rates
          </span>
        </a>
      </div>
    </aside>
  );
};

export default MobileBottomBar;
