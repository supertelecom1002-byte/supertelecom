import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Smartphone, Wrench } from "lucide-react";

interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showSubtitle?: boolean;
  to?: string;
}

export function BrandLogo({
  className = "",
  size = "md",
  showSubtitle = true,
  to = "/",
}: BrandLogoProps) {
  const [imgError, setImgError] = useState(false);

  const dimensions = {
    sm: { img: "h-8 w-8", text: "text-base", sub: "text-[9px]", num: 32 },
    md: { img: "h-10 w-10 sm:h-11 sm:w-11", text: "text-base sm:text-lg", sub: "text-[10px]", num: 44 },
    lg: { img: "h-12 w-12 sm:h-14 sm:w-14", text: "text-lg sm:text-xl", sub: "text-xs", num: 56 },
  }[size];

  return (
    <Link
      to={to}
      className={`inline-flex items-center gap-2.5 transition-transform hover:opacity-95 active:scale-[0.98] ${className}`}
      aria-label="Super Telecom Home"
    >
      <div className="relative flex-shrink-0">
        {!imgError ? (
          <img
            src="/super-telecom-logo.png"
            alt="Super Telecom mobile repair shop logo, Giridih"
            width={dimensions.num}
            height={dimensions.num}
            onError={() => setImgError(true)}
            className={`${dimensions.img} rounded-xl object-contain shadow-brand bg-black/60 p-0.5 border border-white/10 transition-transform hover:scale-105`}
            loading="eager"
            decoding="async"
          />
        ) : (
          <div
            className={`${dimensions.img} flex items-center justify-center rounded-xl bg-gradient-brand shadow-brand border border-primary/30 text-primary-foreground relative overflow-hidden`}
          >
            <Smartphone className="h-5 w-5" />
            <Wrench className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 text-accent" />
          </div>
        )}
      </div>

      <div className="leading-tight">
        <div className={`font-display font-bold tracking-tight text-foreground ${dimensions.text}`}>
          Super Telecom
        </div>
        {showSubtitle && (
          <div className={`uppercase tracking-widest text-muted-foreground ${dimensions.sub}`}>
            Giridih · Jharkhand
          </div>
        )}
      </div>
    </Link>
  );
}

export default BrandLogo;
