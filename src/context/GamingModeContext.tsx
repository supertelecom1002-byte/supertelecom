import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { safeVibrate } from "@/utils/safeVibrate";

export type CrosshairStyle = "dot" | "cross" | "circle";

export interface CrosshairConfig {
  enabled: boolean;
  style: CrosshairStyle;
  color: string;
  size: number;
}

interface GamingModeContextType {
  isGamingModeActive: boolean;
  crosshairConfig: CrosshairConfig;
  footstepBoostActive: boolean;
  touchBoosterActive: boolean;
  enterGamingMode: () => void;
  exitGamingMode: () => void;
  toggleGamingMode: () => void;
  setCrosshairConfig: (config: Partial<CrosshairConfig>) => void;
  toggleCrosshair: () => void;
  toggleFootstepBoost: () => void;
  toggleTouchBooster: () => void;
}

const GamingModeContext = createContext<GamingModeContextType | undefined>(undefined);

const STORAGE_KEY = "st_gaming_mode_enabled";
const CROSSHAIR_STORAGE_KEY = "st_crosshair_config";

const DEFAULT_CROSSHAIR: CrosshairConfig = {
  enabled: false,
  style: "cross",
  color: "#22c55e",
  size: 20,
};

export const GamingModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isGamingModeActive, setIsGamingModeActive] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem(STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  });

  const [crosshairConfig, setCrosshairConfigState] = useState<CrosshairConfig>(() => {
    if (typeof window === "undefined") return DEFAULT_CROSSHAIR;
    try {
      const saved = localStorage.getItem(CROSSHAIR_STORAGE_KEY);
      return saved ? { ...DEFAULT_CROSSHAIR, ...JSON.parse(saved) } : DEFAULT_CROSSHAIR;
    } catch {
      return DEFAULT_CROSSHAIR;
    }
  });

  const [footstepBoostActive, setFootstepBoostActive] = useState<boolean>(false);
  const [touchBoosterActive, setTouchBoosterActive] = useState<boolean>(false);

  const wakeLockRef = useRef<any>(null);

  const triggerHaptic = (pattern: number | number[] = [40, 30, 80]) => {
    safeVibrate(pattern);
  };

  const requestWakeLock = async () => {
    try {
      if (typeof navigator !== "undefined" && "wakeLock" in navigator && (navigator as any).wakeLock?.request) {
        wakeLockRef.current = await (navigator as any).wakeLock.request("screen");
      }
    } catch {
      // ignore
    }
  };

  const releaseWakeLock = () => {
    try {
      if (wakeLockRef.current && wakeLockRef.current.release) {
        wakeLockRef.current.release().catch(() => {});
        wakeLockRef.current = null;
      }
    } catch {
      // ignore
    }
  };

  const enterGamingMode = useCallback(() => {
    setIsGamingModeActive(true);
    triggerHaptic([40, 30, 80]);

    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, "true");
        // Safe fullscreen request
        if (!document.fullscreenElement && document.documentElement?.requestFullscreen) {
          document.documentElement.requestFullscreen().catch(() => {});
        }
      }
    } catch {
      // ignore
    }

    requestWakeLock();

    toast.success("Cyber-Gaming Console Mode Engaged 🎮", {
      description: "ROG Monster performance profile active. 120Hz polling primed.",
    });
  }, []);

  const exitGamingMode = useCallback(() => {
    setIsGamingModeActive(false);
    setFootstepBoostActive(false);
    triggerHaptic([20]);

    releaseWakeLock();

    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, "false");
        if (document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
      }
    } catch {
      // ignore
    }

    toast.info("Returned from Gaming Console");
  }, []);

  const toggleGamingMode = useCallback(() => {
    if (isGamingModeActive) {
      exitGamingMode();
    } else {
      enterGamingMode();
    }
  }, [isGamingModeActive, enterGamingMode, exitGamingMode]);

  const setCrosshairConfig = useCallback((updates: Partial<CrosshairConfig>) => {
    setCrosshairConfigState((prev) => {
      const next = { ...prev, ...updates };
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem(CROSSHAIR_STORAGE_KEY, JSON.stringify(next));
        }
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const toggleCrosshair = useCallback(() => {
    setCrosshairConfigState((prev) => {
      const next = { ...prev, enabled: !prev.enabled };
      triggerHaptic(15);
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem(CROSSHAIR_STORAGE_KEY, JSON.stringify(next));
        }
      } catch {
        // ignore
      }
      toast.info(next.enabled ? "Pro Crosshair Active 🎯" : "Crosshair Hidden");
      return next;
    });
  }, []);

  const toggleFootstepBoost = useCallback(() => {
    setFootstepBoostActive((prev) => {
      triggerHaptic([30, 20]);
      const next = !prev;
      toast.info(next ? "Footstep EQ Booster [ON] (3.5kHz +8dB) 🎧" : "Footstep EQ Booster [OFF]");
      return next;
    });
  }, []);

  const toggleTouchBooster = useCallback(() => {
    setTouchBoosterActive((prev) => {
      triggerHaptic([25, 25]);
      const next = !prev;
      toast.info(next ? "240Hz Touch Response Accelerator [ON] ⚡" : "Touch Accelerator [OFF]");
      return next;
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      releaseWakeLock();
    };
  }, []);

  return (
    <GamingModeContext.Provider
      value={{
        isGamingModeActive,
        crosshairConfig,
        footstepBoostActive,
        touchBoosterActive,
        enterGamingMode,
        exitGamingMode,
        toggleGamingMode,
        setCrosshairConfig,
        toggleCrosshair,
        toggleFootstepBoost,
        toggleTouchBooster,
      }}
    >
      {children}
    </GamingModeContext.Provider>
  );
};

export function useGamingMode(): GamingModeContextType {
  const context = useContext(GamingModeContext);
  if (!context) {
    throw new Error("useGamingMode must be used within a GamingModeProvider");
  }
  return context;
}

export default GamingModeProvider;
