import React, { useEffect, useRef } from "react";
import { useRouterState } from "@tanstack/react-router";

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

const SmoothScrollProvider: React.FC<SmoothScrollProviderProps> = ({ children }) => {
  const lenisRef = useRef<any>(null);
  const scrollTriggerRef = useRef<any>(null);
  const routerState = useRouterState();
  const pathname = routerState?.location?.pathname || "/";

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;

    // Skip heavy smooth-scroll / GSAP runtime on mobile viewports & reduced-motion users
    const isDesktop = window.innerWidth >= 1024;
    const prefersReducedMotion =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!isDesktop || prefersReducedMotion) return;

    let cancelled = false;
    let lenis: any = null;
    let gsapInstance: any = null;
    let ScrollTriggerInstance: any = null;
    let tickerCb: ((time: number) => void) | null = null;
    let refreshTimer: ReturnType<typeof setTimeout> | null = null;

    const init = async () => {
      try {
        const [{ default: Lenis }, { default: gsap }, { ScrollTrigger }] = await Promise.all([
          import("lenis"),
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);

        if (cancelled) return;

        gsap.registerPlugin(ScrollTrigger);
        gsapInstance = gsap;
        ScrollTriggerInstance = ScrollTrigger;
        scrollTriggerRef.current = ScrollTrigger;

        lenis = new Lenis({
          wrapper: window,
          content: document.documentElement,
          lerp: 0.08,
          duration: 1.2,
          smoothWheel: true,
          wheelMultiplier: 0.9,
          touchMultiplier: 1.5,
          autoRaf: false,
        });

        lenisRef.current = lenis;
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
        console.warn("[SmoothScrollProvider] Deferred smooth-scroll init skipped:", err);
      }
    };

    init();

    return () => {
      cancelled = true;
      if (refreshTimer) clearTimeout(refreshTimer);
      if (tickerCb && gsapInstance) {
        try {
          gsapInstance.ticker.remove(tickerCb);
        } catch {}
      }
      if (lenis) {
        if (ScrollTriggerInstance) {
          try {
            lenis.off("scroll", ScrollTriggerInstance.update);
          } catch {}
        }
        try {
          lenis.destroy();
        } catch (err) {
          console.warn("[SmoothScrollProvider] Safe cleanup caught:", err);
        }
      }
      lenisRef.current = null;
    };
  }, []);

  // Instant scroll-to-top on route navigation and refresh ScrollTrigger pinned triggers if loaded
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true });
      }
    } catch {}
    if (!scrollTriggerRef.current) return;
    const timer = setTimeout(() => {
      try {
        scrollTriggerRef.current?.refresh();
      } catch {}
    }, 120);
    return () => clearTimeout(timer);
  }, [pathname]);

  return <>{children}</>;
};

export { SmoothScrollProvider };
export default SmoothScrollProvider;
