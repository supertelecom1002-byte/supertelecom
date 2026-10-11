import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

interface LauncherContextType {
  isCyberOsActive: boolean;
  enableCyberOs: () => void;
  disableCyberOs: () => void;
  toggleCyberOs: () => void;
}

const LauncherContext = createContext<LauncherContextType | undefined>(undefined);

const STORAGE_KEY = "st_cyber_os_enabled";

export const LauncherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Opt-in by default: false unless explicitly enabled in localStorage
  const [isCyberOsActive, setIsCyberOsActive] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem(STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  });

  const triggerHaptic = (pattern: number | number[] = [30, 20, 50]) => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // ignore
      }
    }
  };

  const enableCyberOs = useCallback(() => {
    setIsCyberOsActive(true);
    triggerHaptic([30, 20, 50]);
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, "true");
        // Safe fullscreen request
        if (
          !document.fullscreenElement &&
          document.documentElement?.requestFullscreen
        ) {
          document.documentElement.requestFullscreen().catch(() => {});
        }
      }
    } catch {
      // ignore
    }
    toast.success("Cyber-OS Workspace Activated ⚡", {
      description: "Tactile cyber-lab desktop with live telemetry initialized.",
    });
  }, []);

  const disableCyberOs = useCallback(() => {
    setIsCyberOsActive(false);
    triggerHaptic([20]);
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, "false");
        // Exit fullscreen if active
        if (document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
      }
    } catch {
      // ignore
    }
    toast.info("Returned to Standard App Mode");
  }, []);

  const toggleCyberOs = useCallback(() => {
    if (isCyberOsActive) {
      disableCyberOs();
    } else {
      enableCyberOs();
    }
  }, [isCyberOsActive, enableCyberOs, disableCyberOs]);

  return (
    <LauncherContext.Provider
      value={{
        isCyberOsActive,
        enableCyberOs,
        disableCyberOs,
        toggleCyberOs,
      }}
    >
      {children}
    </LauncherContext.Provider>
  );
};

export function useLauncher(): LauncherContextType {
  const context = useContext(LauncherContext);
  if (!context) {
    throw new Error("useLauncher must be used within a LauncherProvider");
  }
  return context;
}

export default LauncherProvider;
