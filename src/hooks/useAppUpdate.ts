import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

export interface AppUpdateState {
  isUpdateAvailable: boolean;
  isChecking: boolean;
  applyUpdate: () => void;
  manualCheckForUpdate: () => Promise<void>;
}

export function useAppUpdate(): AppUpdateState {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    let isMounted = true;

    // Check existing registration and register service worker
    const setupServiceWorker = async () => {
      try {
        let reg = await navigator.serviceWorker.getRegistration();
        if (!reg) {
          reg = await navigator.serviceWorker.register("/sw.js");
        }

        if (!isMounted) return;
        setRegistration(reg);

        if (reg.waiting) {
          setIsUpdateAvailable(true);
        }

        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (
                newWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                if (isMounted) setIsUpdateAvailable(true);
              }
            });
          }
        });
      } catch (err) {
        console.warn("[PWA] Service worker initialization:", err);
      }
    };

    setupServiceWorker();

    // Listen for controllerchange to reload if new worker takes control
    const onControllerChange = () => {
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);

    return () => {
      isMounted = false;
      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        onControllerChange
      );
    };
  }, []);

  const applyUpdate = useCallback(() => {
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: "SKIP_WAITING" });
    }
    setTimeout(() => {
      window.location.reload();
    }, 150);
  }, [registration]);

  const manualCheckForUpdate = useCallback(async () => {
    setIsChecking(true);
    toast.info("Checking for updates...");

    try {
      if (typeof window !== "undefined" && "serviceWorker" in navigator) {
        let reg = registration;
        if (!reg) {
          reg = (await navigator.serviceWorker.getRegistration()) || null;
        }

        if (reg) {
          await reg.update();
          if (reg.waiting) {
            setIsUpdateAvailable(true);
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
          toast.success("Super Telecom is up to date! (v2.4)");
        }
      }, 750);
    }
  }, [registration, isUpdateAvailable]);

  return {
    isUpdateAvailable,
    isChecking,
    applyUpdate,
    manualCheckForUpdate,
  };
}

export default useAppUpdate;
