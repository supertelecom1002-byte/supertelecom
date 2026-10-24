import React, { useEffect, useRef } from "react";
import Lenis from "lenis";
import { useRouterState } from "@tanstack/react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin safely
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

const SmoothScrollProvider: React.FC<SmoothScrollProviderProps> = ({ children }) => {
  const lenisRef = useRef<Lenis | null>(null);
  const routerState = useRouterState();
  const pathname = routerState?.location?.pathname || "/";

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;

    // Check user preference for reduced motion
    const prefersReducedMotion =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) return;

    let lenis: Lenis | null = null;
    let tickerCb: ((time: number) => void) | null = null;
    let refreshTimer: any = null;

    try {
      // Initialize Lenis with safe window / document references
      lenis = new Lenis({
        wrapper: window,
        content: document.documentElement,
        lerp: 0.08,             // Buttery smooth momentum damping
        duration: 1.2,          // Inertial duration
        smoothWheel: true,
        wheelMultiplier: 0.9,   // Controlled wheel response
        touchMultiplier: 1.5,   // Fluid touch response
        autoRaf: false,         // Managed via GSAP ticker
      });

      lenisRef.current = lenis;

      // Synchronize Lenis with GSAP ScrollTrigger
      lenis.on("scroll", ScrollTrigger.update);

      tickerCb = (time: number) => {
        lenis?.raf(time * 1000);
      };

      gsap.ticker.add(tickerCb);
      gsap.ticker.lagSmoothing(0);

      refreshTimer = setTimeout(() => {
        try {
          ScrollTrigger.refresh();
        } catch {}
      }, 200);
    } catch (err) {
      console.warn("[SmoothScrollProvider] Lenis init failed, using native scroll:", err);
    }

    return () => {
      if (refreshTimer) clearTimeout(refreshTimer);
      if (tickerCb) {
        try {
          gsap.ticker.remove(tickerCb);
        } catch {}
      }
      if (lenis) {
        try {
          lenis.off("scroll", ScrollTrigger.update);
        } catch {}
        try {
          lenis.destroy();
        } catch (err) {
          console.warn("[SmoothScrollProvider] Safe cleanup caught:", err);
        }
      }
      lenisRef.current = null;
    };
  }, []);

  // Instant scroll-to-top on route navigation and refresh ScrollTrigger pinned triggers
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true });
      }
    } catch {}
    const timer = setTimeout(() => {
      try {
        ScrollTrigger.refresh();
      } catch {}
    }, 120);
    return () => clearTimeout(timer);
  }, [pathname]);

  return <>{children}</>;
};

export { SmoothScrollProvider };
export default SmoothScrollProvider;
