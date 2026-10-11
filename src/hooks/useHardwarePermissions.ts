import { useState, useEffect, useCallback, useRef } from "react";

export type HardwarePermissionType =
  | "audio"
  | "wakeLock"
  | "vibration"
  | "notifications"
  | "sensors";

export interface PermissionState {
  audio: "granted" | "prompt" | "denied" | "unsupported";
  wakeLock: "granted" | "prompt" | "denied" | "unsupported";
  vibration: "granted" | "prompt" | "denied" | "unsupported";
  notifications: "granted" | "prompt" | "denied" | "unsupported";
  sensors: "granted" | "prompt" | "denied" | "unsupported";
}

const STORAGE_KEY = "st_hardware_permissions";

export function useHardwarePermissions() {
  const [permissions, setPermissions] = useState<PermissionState>(() => {
    if (typeof window === "undefined") {
      return {
        audio: "prompt",
        wakeLock: "prompt",
        vibration: "prompt",
        notifications: "prompt",
        sensors: "prompt",
      };
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }

    return {
      audio: "prompt",
      wakeLock: "wakeLock" in navigator ? "prompt" : "unsupported",
      vibration: "vibrate" in navigator ? "granted" : "unsupported",
      notifications:
        typeof Notification !== "undefined"
          ? Notification.permission === "granted"
            ? "granted"
            : Notification.permission === "denied"
            ? "denied"
            : "prompt"
          : "unsupported",
      sensors:
        typeof window !== "undefined" && "DeviceMotionEvent" in window
          ? "prompt"
          : "unsupported",
    };
  });

  const wakeLockRef = useRef<any>(null);

  const savePermissions = (updated: PermissionState) => {
    setPermissions(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const requestAudioPermission = useCallback(async (): Promise<boolean> => {
    if (typeof window === "undefined") return false;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) {
        setPermissions((p) => ({ ...p, audio: "unsupported" }));
        return false;
      }
      const ctx = new AudioCtx();
      if (ctx.state === "suspended") {
        await ctx.resume();
      }
      // Create a short inaudible beep to prime browser audio subsystem
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      gain.gain.value = 0.001;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);

      setTimeout(() => {
        try {
          ctx.close();
        } catch {}
      }, 100);

      const next = { ...permissions, audio: "granted" as const };
      savePermissions(next);
      return true;
    } catch (err) {
      console.warn("Audio permission error:", err);
      const next = { ...permissions, audio: "denied" as const };
      savePermissions(next);
      return false;
    }
  }, [permissions]);

  const requestWakeLockPermission = useCallback(async (): Promise<boolean> => {
    if (typeof window === "undefined") return false;
    if (!("wakeLock" in navigator)) {
      setPermissions((p) => ({ ...p, wakeLock: "unsupported" }));
      return false;
    }
    try {
      const lock = await (navigator as any).wakeLock.request("screen");
      wakeLockRef.current = lock;
      lock.addEventListener("release", () => {
        wakeLockRef.current = null;
      });
      const next = { ...permissions, wakeLock: "granted" as const };
      savePermissions(next);
      return true;
    } catch (err) {
      console.warn("WakeLock request error:", err);
      const next = { ...permissions, wakeLock: "denied" as const };
      savePermissions(next);
      return false;
    }
  }, [permissions]);

  const releaseWakeLock = useCallback(async () => {
    if (wakeLockRef.current) {
      try {
        await wakeLockRef.current.release();
      } catch {}
      wakeLockRef.current = null;
    }
  }, []);

  const triggerVibration = useCallback((pattern: number | number[] = [80, 40, 80]) => {
    if (typeof window === "undefined" || !("vibrate" in navigator)) return false;
    try {
      return navigator.vibrate(pattern);
    } catch {
      return false;
    }
  }, []);

  const requestNotificationPermission = useCallback(async (): Promise<boolean> => {
    if (typeof window === "undefined" || typeof Notification === "undefined") {
      setPermissions((p) => ({ ...p, notifications: "unsupported" }));
      return false;
    }
    try {
      const res = await Notification.requestPermission();
      const status = res === "granted" ? "granted" : res === "denied" ? "denied" : "prompt";
      const next = { ...permissions, notifications: status as any };
      savePermissions(next);
      return res === "granted";
    } catch (err) {
      console.warn("Notification request error:", err);
      return false;
    }
  }, [permissions]);

  const requestSensorsPermission = useCallback(async (): Promise<boolean> => {
    if (typeof window === "undefined") return false;
    try {
      // iOS 13+ requires explicit DeviceMotionEvent permission request
      if (
        typeof (DeviceMotionEvent as any) !== "undefined" &&
        typeof (DeviceMotionEvent as any).requestPermission === "function"
      ) {
        const state = await (DeviceMotionEvent as any).requestPermission();
        const next = {
          ...permissions,
          sensors: state === "granted" ? "granted" : "denied",
        };
        savePermissions(next as any);
        return state === "granted";
      }

      // Android / Chrome standard devices grant motion sensors automatically
      const next = { ...permissions, sensors: "granted" as const };
      savePermissions(next);
      return true;
    } catch (err) {
      console.warn("Sensor permission error:", err);
      const next = { ...permissions, sensors: "denied" as const };
      savePermissions(next);
      return false;
    }
  }, [permissions]);

  const requestAllHardwareSuite = useCallback(
    async (required: HardwarePermissionType[]): Promise<boolean> => {
      let allOk = true;

      for (const item of required) {
        if (item === "audio") {
          const ok = await requestAudioPermission();
          if (!ok) allOk = false;
        } else if (item === "wakeLock") {
          const ok = await requestWakeLockPermission();
          if (!ok) allOk = false;
        } else if (item === "notifications") {
          const ok = await requestNotificationPermission();
          if (!ok) allOk = false;
        } else if (item === "sensors") {
          const ok = await requestSensorsPermission();
          if (!ok) allOk = false;
        } else if (item === "vibration") {
          triggerVibration(100);
        }
      }

      return allOk;
    },
    [
      requestAudioPermission,
      requestWakeLockPermission,
      requestNotificationPermission,
      requestSensorsPermission,
      triggerVibration,
    ]
  );

  const isGranted = useCallback(
    (type: HardwarePermissionType): boolean => {
      if (type === "vibration") {
        return typeof navigator !== "undefined" && "vibrate" in navigator;
      }
      return permissions[type] === "granted";
    },
    [permissions]
  );

  return {
    permissions,
    isGranted,
    requestAudioPermission,
    requestWakeLockPermission,
    releaseWakeLock,
    triggerVibration,
    requestNotificationPermission,
    requestSensorsPermission,
    requestAllHardwareSuite,
  };
}
