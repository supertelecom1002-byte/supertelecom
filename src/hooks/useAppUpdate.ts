import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";

export interface AppUpdateState {
  isUpdateAvailable: boolean;
  isChecking: boolean;
  applyUpdate: () => void;
  manualCheckForUpdate: () => Promise<void>;
}

const STORAGE_NOTIFIED_VERSION_KEY = "st_update_notified_version";
const STORAGE_PENDING_UPDATE_KEY = "st_has_pending_update";
const CURRENT_RELEASE_TAG = "v3.2.0";

export function useAppUpdate(): AppUpdateState {
  // Initialize state from localStorage so banner persists across relaunches immediately
  const [isUpdateAvailable, setIsUpdateAvailable] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem(STORAGE_PENDING_UPDATE_KEY) === "true";
    } catch {
      return false;
    }
  });

  const [isChecking, setIsChecking] = useState<boolean>(false);
  const registrationRef = useRef<ServiceWorkerRegistration | null>(null);

  // Helper to dispatch single native outside system notification (preventing spam)
  const dispatchSingleSystemNotification = useCallback(
    async (reg: ServiceWorkerRegistration, releaseTag = CURRENT_RELEASE_TAG) => {
      if (typeof window === "undefined" || !("Notification" in window)) return;
      if (Notification.permission !== "granted") return;

      try {
        const alreadyNotified = localStorage.getItem(STORAGE_NOTIFIED_VERSION_KEY);
        if (alreadyNotified === releaseTag) {
          // Already notified once for this version, skip duplicate
          return;
        }

        localStorage.setItem(STORAGE_NOTIFIED_VERSION_KEY, releaseTag);

        if ("showNotification" in reg) {
          await reg.showNotification("Super Telecom Update Ready ⚡", {
            body: "A new version of Super Telecom Lab & Offline Diagnostics is available. Tap to reload.",
            icon: "/icon-192.png",
            badge: "/icon-192.png",
            tag: "supertelecom-release-update",
            data: { url: "/" },
          });
        }
      } catch (err) {
        console.warn("[PWA] Error displaying system notification:", err);
      }
    },
    []
  );

  // Mark update as waiting and persist
  const handleUpdateDetected = useCallback(
    (reg: ServiceWorkerRegistration) => {
      try {
        localStorage.setItem(STORAGE_PENDING_UPDATE_KEY, "true");
      } catch {
        // ignore
      }
      setIsUpdateAvailable(true);
      dispatchSingleSystemNotification(reg);
    },
    [dispatchSingleSystemNotification]
  );

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    let isMounted = true;

    const setupWorker = async () => {
      try {
        let reg = await navigator.serviceWorker.getRegistration();
        if (!reg) {
          reg = await navigator.serviceWorker.register("/sw.js");
        }

        if (!isMounted) return;
        registrationRef.current = reg;

        // 1. If a worker is already waiting in background:
        if (reg.waiting) {
          handleUpdateDetected(reg);
        }

        // 2. Listen for future updates
        reg.addEventListener("updatefound", () => {
          const installingWorker = reg.installing;
          if (installingWorker) {
            installingWorker.addEventListener("statechange", () => {
              if (
                installingWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                // New worker is ready and waiting for user permission to activate
                if (isMounted) {
                  handleUpdateDetected(reg);
                }
              }
            });
          }
        });

        // 3. Periodic background check for updates when returning to app
        const onVisibilityChange = () => {
          if (document.visibilityState === "visible" && reg) {
            reg.update().catch(() => {});
          }
        };
        document.addEventListener("visibilitychange", onVisibilityChange);

        return () => {
          document.removeEventListener("visibilitychange", onVisibilityChange);
        };
      } catch (err) {
        console.warn("[PWA] Service worker setup failed:", err);
      }
    };

    setupWorker();

    // Reload seamlessly when new worker assumes control
    const onControllerChange = () => {
      try {
        localStorage.removeItem(STORAGE_PENDING_UPDATE_KEY);
      } catch {
        // ignore
      }
      window.location.reload();
    };

    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);

    return () => {
      isMounted = false;
      navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
    };
  }, [handleUpdateDetected]);

  // Explicit user action to skip waiting and activate new version
  const applyUpdate = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_PENDING_UPDATE_KEY);
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate([30, 50, 30]);
      }
    } catch {
      // ignore
    }

    const reg = registrationRef.current;
    if (reg?.waiting) {
      reg.waiting.postMessage({ type: "SKIP_WAITING" });
    } else {
      navigator.serviceWorker.getRegistration().then((activeReg) => {
        if (activeReg?.waiting) {
          activeReg.waiting.postMessage({ type: "SKIP_WAITING" });
        } else {
          window.location.reload();
        }
      });
    }

    // Fallback reload if controllerchange doesn't fire within 400ms
    setTimeout(() => {
      window.location.reload();
    }, 400);
  }, []);

  // Manual Check Trigger from UI (e.g. Settings sheet)
  const manualCheckForUpdate = useCallback(async () => {
    setIsChecking(true);
    toast.info("Checking for lab updates...");

    try {
      if (typeof window !== "undefined" && "serviceWorker" in navigator) {
        let reg = registrationRef.current;
        if (!reg) {
          reg = (await navigator.serviceWorker.getRegistration()) || null;
        }

        if (reg) {
          await reg.update();
          if (reg.waiting) {
            handleUpdateDetected(reg);
            toast.success("New update available! Tap to reload.");
            setIsChecking(false);
            return;
          }
        }
      }
    } catch {
      // ignore network errors
    } finally {
      setTimeout(() => {
        setIsChecking(false);
        if (!isUpdateAvailable) {
          toast.success("Super Telecom is up to date! (v3.2.0)");
        }
      }, 700);
    }
  }, [handleUpdateDetected, isUpdateAvailable]);

  return {
    isUpdateAvailable,
    isChecking,
    applyUpdate,
    manualCheckForUpdate,
  };
}

export default useAppUpdate;
