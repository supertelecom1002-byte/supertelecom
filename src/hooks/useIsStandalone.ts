import { useState, useEffect } from "react";

export function useIsStandalone() {
  // Default to true to prevent initial banner flicker in standalone mode
  const [isStandalone, setIsStandalone] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkStandalone = () => {
      const isStandaloneMedia = window.matchMedia("(display-mode: standalone)").matches;
      const isFullscreenMedia = window.matchMedia("(display-mode: fullscreen)").matches;
      const isMinimalUiMedia = window.matchMedia("(display-mode: minimal-ui)").matches;
      const isIosStandalone = (window.navigator as any).standalone === true;
      const isTwa = document.referrer.includes("android-app://");

      return isStandaloneMedia || isFullscreenMedia || isMinimalUiMedia || isIosStandalone || isTwa;
    };

    setIsStandalone(checkStandalone());

    // Listen for display-mode changes
    try {
      const mediaQuery = window.matchMedia("(display-mode: standalone)");
      const listener = (e: MediaQueryListEvent) => {
        setIsStandalone(e.matches || checkStandalone());
      };
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener("change", listener);
        return () => mediaQuery.removeEventListener("change", listener);
      } else if ((mediaQuery as any).addListener) {
        (mediaQuery as any).addListener(listener);
        return () => (mediaQuery as any).removeListener(listener);
      }
    } catch {
      // ignore
    }
  }, []);

  return isStandalone;
}

export default useIsStandalone;
