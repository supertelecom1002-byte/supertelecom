import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  MapPin, Clock, Mail, Star, Phone, ArrowRight, Menu, X
} from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { ThemeToggle } from "@/components/ThemeToggle";

interface NavbarProps {
  isHomePage?: boolean;
}

export function Navbar({ isHomePage = false }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on();
    window.addEventListener("scroll", on);
    return () => window.removeEventListener("scroll", on);
  }, []);

  const links = [
    { label: "Services", to: isHomePage ? "#services" : "/services" },
    { label: "About", to: isHomePage ? "#about" : "/#about" },
    { label: "Gallery", to: isHomePage ? "#gallery" : "/#gallery" },
    { label: "Reviews", to: isHomePage ? "#reviews" : "/#reviews" },
    { label: "Pricing", to: "/pricing" },
    { label: "Contact", to: isHomePage ? "#contact" : "/#contact" },
  ];

  const PHONE = "+918002903643";
  const EMAIL = "supertelecom1002@gmail.com";

  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      {/* Utility bar */}
      <div className="hidden border-b border-border bg-surface md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-1.5 text-[11px] tracking-wide text-muted-foreground">
          <div className="flex items-center gap-5">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3 w-3 text-primary" /> Barganda Road, Giridih
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3 w-3 text-primary" /> Open Daily 9:00 AM – 9:00 PM
            </span>
          </div>
          <div className="flex items-center gap-5">
            <a href={`mailto:${EMAIL}`} className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground">
              <Mail className="h-3 w-3 text-primary" /> {EMAIL}
            </a>
            <span className="inline-flex items-center gap-1.5 text-foreground">
              <Star className="h-3 w-3 fill-primary text-primary" /> 5.0 Google Rating
            </span>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className={`transition-all ${scrolled || open ? "glass-strong shadow-elegant" : "bg-transparent"}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          {/* Brand Logo with Link to "/" */}
          <BrandLogo size="md" to="/" />

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {links.map(({ label, to }) => (
              to.startsWith("#") ? (
                <a
                  key={label}
                  href={to}
                  className="rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  {label}
                </a>
              ) : (
                <Link
                  key={label}
                  to={to}
                  className="rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  {label}
                </Link>
              )
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <a
              href={`tel:${PHONE}`}
              className="hidden items-center rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-secondary sm:inline-flex"
            >
              <Phone className="mr-2 h-4 w-4" /> Call
            </a>
            <a
              href={isHomePage ? "#contact" : "/#contact"}
              className="inline-flex items-center rounded-full bg-gradient-brand px-4 py-2 text-sm font-semibold text-primary-foreground shadow-brand transition-transform hover:scale-[1.03]"
            >
              Book Repair <ArrowRight className="ml-1.5 h-4 w-4" />
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border md:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {open && (
          <nav className="border-t border-border px-4 pb-4 pt-2 md:hidden">
            {links.map(({ label, to }) => (
              to.startsWith("#") ? (
                <a
                  key={label}
                  href={to}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  {label}
                </a>
              ) : (
                <Link
                  key={label}
                  to={to}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  {label}
                </Link>
              )
            ))}
            <div className="mt-2 flex items-center gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-primary" /> Barganda Road, Giridih · 9 AM – 9 PM
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Navbar;
