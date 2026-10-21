import React, { useEffect, useRef } from "react";
import Lenis from "lenis";
import { useRouterState } from "@tanstack/react-router";

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

export const SmoothScrollProvider: React.FC<SmoothScrollProviderProps> = ({ children }) => {
  const lenisRef = useRef<Lenis | null>(null);
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  useEffect(() => {
    // Check user preference for reduced motion
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) return;

    // Initialize Lenis with Stonic-style inertia damping
    const lenis = new Lenis({
      lerp: 0.08,             // Buttery smooth momentum damping
      duration: 1.2,          // Inertial duration
      smoothWheel: true,
      wheelMultiplier: 0.9,   // Controlled wheel response
      touchMultiplier: 1.5,   // Fluid touch response
      autoRaf: false,         // Managed via explicit requestAnimationFrame loop
    });

    lenisRef.current = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Instant scroll-to-top on route navigation
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
  }, [pathname]);

  return <>{children}</>;
};

export default SmoothScrollProvider;
