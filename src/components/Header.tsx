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
  Wrench,
  Search,
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

  const navLinks = [
    { label: "Services", to: isHomePage ? "#services" : "/services" },
    { label: "iPhone Lab", to: "/services/iphone-repair" },
    { label: "Chip-Level / IC", to: "/services/motherboard-repair" },
    { label: "Pricing Matrix", to: isHomePage ? "#pricing-matrix" : "/pricing" },
    { label: "Track Repair", to: isHomePage ? "#contact" : "/services" },
    { label: "Contact", to: isHomePage ? "#contact" : "/#contact" },
  ];

  const PHONE = "+918002903643";
  const WHATSAPP = "918002903643";

  return (
    <header className="w-full select-none">
      {/* ========================================================= */}
      {/* LAYER A: Micro Announcement Marquee Strip                 */}
      {/* ========================================================= */}
      <div className="h-8 py-1 px-4 text-xs bg-cyan-950/40 border-b border-cyan-500/20 text-cyan-300 backdrop-blur-md flex items-center justify-between overflow-hidden">
        <div className="flex items-center gap-2 overflow-hidden truncate">
          <span className="relative flex h-2 w-2 flex-none">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-mono text-[11px] sm:text-xs font-medium tracking-wide truncate text-cyan-200">
            Barganda Road Lab, Giridih • Express 30-Min Service Active
          </span>
        </div>

        <div className="flex items-center gap-3 flex-none pl-2 text-[11px]">
          <span className="hidden md:inline-flex items-center gap-1.5 text-cyan-400/90 font-mono">
            <Clock className="h-3 w-3 text-cyan-400" />
            <span>Mon-Sun: 10:00 AM – 9:30 PM</span>
          </span>
          <a
            href={`https://wa.me/${WHATSAPP}?text=Hi%20Super%20Telecom,%20I%20need%20a%20repair%20quote`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1 font-bold text-cyan-300 hover:text-white transition-colors"
          >
            WhatsApp Support &rarr;
          </a>
        </div>
      </div>

      {/* ========================================================= */}
      {/* LAYER B: Frosted Transparent Main Navigation              */}
      {/* ========================================================= */}
      <nav
        aria-label="Main Navigation"
        className="sticky top-0 z-50 w-full bg-white/75 dark:bg-slate-950/70 backdrop-blur-2xl border-b border-slate-200/60 dark:border-slate-800/50 transition-all duration-300"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3.5 py-2.5 sm:px-6 sm:py-3">
          {/* Left: Brand Monogram + Title + Monospace Badge */}
          <div className="flex items-center gap-2.5 flex-none">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                <span className="font-display font-black text-sm text-white tracking-wider">
                  ST
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-display text-sm sm:text-base font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                  SUPER TELECOM
                </span>
                <span className="font-mono text-[9px] uppercase tracking-wider text-cyan-600 dark:text-cyan-400 font-bold">
                  GIRIDIH LAB • EST. 2016
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Desktop Navigation Pills (>= 1024px) */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(({ label, to }) =>
              to.startsWith("#") ? (
                <a
                  key={label}
                  href={to}
                  className="rounded-full px-3.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                >
                  {label}
                </a>
              ) : (
                <Link
                  key={label}
                  to={to}
                  className="rounded-full px-3.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                >
                  {label}
                </Link>
              )
            )}
          </div>

          {/* Right: Theme Toggle + Glowing CTA + Mobile Hamburger */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-none">
            <ThemeToggle />

            {/* Desktop Priority Repair Glowing Pill */}
            <a
              href={isHomePage ? "#contact" : "/#contact"}
              className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-gradient-brand px-4 py-2 text-xs font-bold text-primary-foreground shadow-brand transition-all hover:scale-[1.03] active:scale-95 whitespace-nowrap"
            >
              <span>Book Priority Repair</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>

            {/* Mobile / Tablet Menu Trigger */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white lg:hidden active:scale-95 transition-transform"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* Mobile Slide-Over Drawer with Backdrop Blur               */}
        {/* ========================================================= */}
        {open && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity animate-in fade-in"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />

            <div className="fixed inset-y-0 right-0 w-[86%] max-w-sm bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-2xl z-10 overflow-y-auto">
              <div>
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs">
                      ST
                    </div>
                    <span className="font-display font-bold text-sm text-slate-900 dark:text-white">
                      Super Telecom
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Close menu drawer"
                    className="flex items-center justify-center h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white active:scale-95 transition-all"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* 5 Service Silos Direct Access */}
                <div className="mt-5">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-600 dark:text-cyan-400 font-bold block mb-2.5">
                    Express Lab Silos (1-Tap)
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { title: "Screen & OLED Replacement", href: "/services/screen-replacement", icon: Smartphone },
                      { title: "iPhone Specialist Care", href: "/services/iphone-repair", icon: ShieldCheck },
                      { title: "Motherboard & IC Micro-Soldering", href: "/services/motherboard-repair", icon: Cpu },
                      { title: "Battery & Fast Charging Fix", href: "/services/battery-replacement", icon: Battery },
                      { title: "Water Damage Revival", href: "/services/water-damage-repair", icon: Droplet },
                    ].map((silo) => (
                      <Link
                        key={silo.href}
                        to={silo.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-cyan-300 hover:border-cyan-500/40 active:scale-95 transition-all"
                      >
                        <silo.icon className="h-4 w-4 text-cyan-500 dark:text-cyan-400 flex-none" />
                        <span className="truncate">{silo.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Navigation Links */}
                <div className="mt-6 border-t border-slate-200 dark:border-slate-800/80 pt-4">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold block mb-2">
                    Sections &amp; Pricing
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {navLinks.map(({ label, to }) =>
                      to.startsWith("#") ? (
                        <a
                          key={to}
                          href={to}
                          onClick={() => setOpen(false)}
                          className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/50 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white active:scale-95 transition-all"
                        >
                          <span>{label}</span>
                        </a>
                      ) : (
                        <Link
                          key={to}
                          to={to}
                          onClick={() => setOpen(false)}
                          className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/50 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white active:scale-95 transition-all"
                        >
                          <span>{label}</span>
                        </Link>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Drawer Bottom Actions */}
              <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`tel:${PHONE}`}
                    className="flex items-center justify-center gap-2 py-3 px-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold text-xs active:scale-95 transition-all"
                  >
                    <Phone className="h-4 w-4" /> Call Lab
                  </a>
                  <a
                    href={`https://wa.me/${WHATSAPP}?text=Hi%20Super%20Telecom,%20I%20need%20quick%20mobile%20repair%20help`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3 px-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 font-bold text-xs active:scale-95 transition-all"
                  >
                    <MessageCircle className="h-4 w-4" /> WhatsApp
                  </a>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                  <MapPin className="h-3.5 w-3.5 text-cyan-500 flex-none" />
                  <span>Barganda Road, Giridih • Est. 2016</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
export { Header as Navbar };
