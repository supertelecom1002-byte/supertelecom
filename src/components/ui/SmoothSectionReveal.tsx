import React, { useEffect, useRef, useState } from "react";

interface SmoothSectionRevealProps {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
  threshold?: number;
}

export const SmoothSectionReveal: React.FC<SmoothSectionRevealProps> = ({
  children,
  className = "",
  delayMs = 0,
  threshold = 0.12,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Respect prefers-reduced-motion
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setIsVisible(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node);
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  return (
    <div
      ref={ref}
      style={{
        transitionDuration: "700ms",
        transitionDelay: `${delayMs}ms`,
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        transform: isVisible ? "translate3d(0, 0, 0)" : "translate3d(0, 28px, 0)",
        opacity: isVisible ? 1 : 0,
        willChange: "transform, opacity",
      }}
      className={`gpu-layer transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${className}`}
    >
      {children}
    </div>
  );
};

export default SmoothSectionReveal;
