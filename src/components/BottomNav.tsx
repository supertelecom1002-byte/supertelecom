import React, { useState, useEffect } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Phone, MessageCircle, Download } from "lucide-react";
import { BUSINESS_MASTER } from "@/config/superTelecomConfig";

export const BottomNav: React.FC = () => {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
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

  // Hide on admin routes, APK download page, or when floating AI chat is open
  if (pathname.startsWith("/admin") || chatOpen) {
    return null;
  }

  const PHONE = BUSINESS_MASTER.phoneRaw;
  const WHATSAPP = BUSINESS_MASTER.whatsappNumber;

  return (
    <nav
      aria-label="Mobile Quick Action Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden h-14 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/90 px-3 flex items-center justify-between gap-2 pb-[max(0.25rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(0,0,0,0.8)]"
    >
      {/* 1. Direct Call Now */}
      <a
        href={`tel:${PHONE}`}
        aria-label="Call Super Telecom Giridih Engineer"
        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold text-xs active:scale-95 transition-all text-center"
      >
        <Phone className="h-4 w-4 shrink-0 text-emerald-400" />
        <span className="truncate">Call Now</span>
      </a>

      {/* 2. WhatsApp Quote */}
      <a
        href={`https://wa.me/${WHATSAPP}?text=Namaste%20Super%20Telecom!%20I%20need%20a%20repair%20quote%20for%20my%20phone.`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp Quote Super Telecom"
        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 font-bold text-xs active:scale-95 transition-all text-center"
      >
        <MessageCircle className="h-4 w-4 shrink-0 text-cyan-400" />
        <span className="truncate">WhatsApp Quote</span>
      </a>

      {/* 3. Get Android App (APK) */}
      <Link
        to="/download"
        aria-label="Download Super Telecom Android App APK"
        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-xs active:scale-95 transition-all shadow-md shadow-cyan-500/20 text-center"
      >
        <Download className="h-4 w-4 shrink-0 stroke-[2.5]" />
        <span className="truncate">Get App (APK)</span>
      </Link>
    </nav>
  );
};

export default BottomNav;
