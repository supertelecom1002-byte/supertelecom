import React from "react";
import { Smartphone, Phone, MessageCircle } from "lucide-react";
import { BUSINESS_MASTER } from "@/config/superTelecomConfig";

export const Smartphone3DFallback: React.FC = () => {
  return (
    <div className="flex h-full w-full min-h-[420px] flex-col items-center justify-center p-8 text-center bg-slate-950 text-white rounded-3xl border border-slate-800">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 mb-4 shadow-lg shadow-cyan-950/50">
        <Smartphone className="h-8 w-8" />
      </div>
      <h3 className="text-xl font-bold font-display text-white">
        Precision Smartphone Architecture
      </h3>
      <p className="mt-2 text-sm text-slate-400 max-w-md leading-relaxed">
        Explore our verified chip-level micro-soldering, AMOLED display replacement, and genuine part inventory in Giridih.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <a
          href={BUSINESS_MASTER.phoneCallHref}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-brand hover:scale-105 transition-transform"
        >
          <Phone className="h-3.5 w-3.5" /> Call Technician
        </a>
        <a
          href={`${BUSINESS_MASTER.whatsappBaseUrl}?text=Hello%20Super%20Telecom,%20I%20want%20to%20inquire%20about%20mobile%20repair`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-950/40 px-4 py-2.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-900/60 transition-colors"
        >
          <MessageCircle className="h-3.5 w-3.5" /> WhatsApp Lab
        </a>
      </div>
    </div>
  );
};

export default Smartphone3DFallback;
