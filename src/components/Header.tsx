import React, { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Clock,
  Phone,
  MessageCircle,
  MapPin,
  ArrowRight,
  Menu,
  X,
  Smartphone,
  Battery,
  Cpu,
  Droplet,
  ShieldCheck,
} from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { ThemeToggle } from "@/components/ThemeToggle";

interface HeaderProps {
  isHomePage?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isHomePage = false }) => {
  const [open, setOpen] = useState(false);

  // Close drawer on Esc key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const links = [
    { label: "Services", to: isHomePage ? "#services" : "/services" },
    { label: "Brands", to: "/brands" },
    { label: "Pricing", to: "/pricing" },
    { label: "About", to: isHomePage ? "#about" : "/#about" },
    { label: "Reviews", to: isHomePage ? "#reviews" : "/#reviews" },
    { label: "Contact", to: isHomePage ? "#contact" : "/#contact" },
  ];

  const PHONE = "+918002903643";
  const WHATSAPP = "918002903643";

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950 overflow-hidden">
      {/* 1. Top Announcement Bar (Strictly stacked in normal document flow) */}
      <div className="w-full bg-cyan-950/80 border-b border-cyan-800/40 py-1.5 px-3 text-xs flex items-center justify-between text-cyan-300 overflow-hidden">
        <div className="flex items-center gap-2 overflow-hidden truncate">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-400 text-slate-950 flex-none uppercase shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping" />
            LIVE WORKSHOP
          </span>
          <span className="truncate font-medium text-slate-200 text-[11px] sm:text-xs">
            Barganda Road Lab • Express Same-Day Repair &amp; Free Diagnostics
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-none pl-2 text-[11px]">
          <span className="hidden md:inline-flex items-center gap-1 text-slate-400 font-mono">
            <Clock className="h-3 w-3 text-cyan-400" /> Open till 9:30 PM
          </span>
          <a
            href="https://wa.me/918002903643?text=Hi%20Super%20Telecom,%20I%20need%20a%20repair%20quote"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-bold text-cyan-300 hover:text-white transition-colors"
          >
            <span className="hidden sm:inline">WhatsApp</span> Diagnosis &rarr;
          </a>
        </div>
      </div>

      {/* 2. Main Navbar directly below it in normal document flow */}
      <div className="w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800/60 py-3 px-4 flex items-center justify-between">
        {/* Super Telecom logo + name on the left */}
        <div className="flex-none">
          <BrandLogo size="md" to="/" />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-1 md:flex">
          {links.map(({ label, to }) =>
            to.startsWith("#") ? (
              <a
                key={label}
                href={to}
                className="rounded-full px-3.5 py-1.5 text-xs lg:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
              >
                {label}
              </a>
            ) : (
              <Link
                key={label}
                to={to}
                className="rounded-full px-3.5 py-1.5 text-xs lg:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
              >
                {label}
              </Link>
            )
          )}
        </nav>

        {/* Right side controls: theme toggle + hamburger drawer icon (no redundant Book button on mobile) */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-none">
          <ThemeToggle />

          <a
            href={`tel:${PHONE}`}
            className="hidden items-center rounded-full border border-slate-700 bg-slate-900/80 px-3.5 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-800 lg:inline-flex"
          >
            <Phone className="mr-1.5 h-3.5 w-3.5 text-cyan-400" /> Call
          </a>

          {/* Remove redundant Book Repair button on small screens (hidden sm:inline-flex) */}
          <a
            href={isHomePage ? "#contact" : "/#contact"}
            className="hidden sm:inline-flex items-center rounded-full bg-gradient-brand px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-primary-foreground shadow-brand transition-transform hover:scale-[1.03] whitespace-nowrap"
          >
            <span>Book Repair</span> <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/80 text-slate-200 hover:text-white md:hidden active:scale-95 transition-transform"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Slide-over Mobile Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          <div className="fixed inset-y-0 right-0 w-[86%] max-w-sm bg-slate-950 border-l border-slate-800 p-6 flex flex-col justify-between shadow-2xl z-10 overflow-y-auto">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <BrandLogo size="sm" to="/" />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu drawer"
                  className="flex items-center justify-center h-10 w-10 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white active:scale-95 transition-all"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* 5 Service Silos Direct Access */}
              <div className="mt-5">
                <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold block mb-2.5">
                  Top Service Silos (1-Tap)
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { title: "Screen & Display Replacement", href: "/services/screen-replacement", icon: Smartphone },
                    { title: "Battery & Charging Port Repair", href: "/services/battery-replacement", icon: Battery },
                    { title: "Motherboard & IC Micro-Soldering", href: "/services/motherboard-repair", icon: Cpu },
                    { title: "Water Damage Revival", href: "/services/water-damage-repair", icon: Droplet },
                    { title: "Apple iPhone Specialist Care", href: "/services/iphone-repair", icon: ShieldCheck },
                  ].map((silo) => (
                    <Link
                      key={silo.href}
                      to={silo.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-semibold text-slate-200 hover:text-cyan-300 hover:border-cyan-500/40 active:scale-95 transition-all"
                    >
                      <silo.icon className="h-4 w-4 text-cyan-400 flex-none" />
                      <span className="truncate">{silo.title}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Navigation Links */}
              <div className="mt-6 border-t border-slate-800/80 pt-4">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block mb-2">
                  Sections &amp; Pricing
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {links.map(({ label, to }) =>
                    to.startsWith("#") ? (
                      <a
                        key={to}
                        href={to}
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-900/40 border border-slate-800/50 text-xs font-medium text-slate-300 hover:text-white active:scale-95 transition-all"
                      >
                        <span>{label}</span>
                      </a>
                    ) : (
                      <Link
                        key={to}
                        to={to}
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-900/40 border border-slate-800/50 text-xs font-medium text-slate-300 hover:text-white active:scale-95 transition-all"
                      >
                        <span>{label}</span>
                      </Link>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Drawer Bottom Actions */}
            <div className="mt-6 pt-5 border-t border-slate-800 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`tel:${PHONE}`}
                  className="flex items-center justify-center gap-2 py-3 px-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs active:scale-95 transition-all"
                >
                  <Phone className="h-4 w-4" /> Call Now
                </a>
                <a
                  href={`https://wa.me/${WHATSAPP}?text=Hi%20Super%20Telecom,%20I%20need%20quick%20mobile%20repair%20help`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 py-3 px-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold text-xs active:scale-95 transition-all"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
                <MapPin className="h-3.5 w-3.5 text-primary flex-none" />
                <span>Barganda Road, Giridih • Open Daily 10:00 AM – 9:30 PM</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
export { Header as Navbar };
