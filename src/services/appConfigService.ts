import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

export interface AppConfig {
  tool_speaker_cleaner: boolean;
  tool_touch_test: boolean;
  tool_anti_theft: boolean;
  tool_battery_guard: boolean;
  tool_secret_codes: boolean;
  tool_lockscreen_gen: boolean;
  tool_used_phone_audit: boolean;
  shop_accessories_enabled: boolean;
  lab_status_override: "auto" | "open" | "closed";
  announcement_banner: {
    enabled: boolean;
    text: string;
  };
}

export const DEFAULT_APP_CONFIG: AppConfig = {
  tool_speaker_cleaner: true,
  tool_touch_test: true,
  tool_anti_theft: true,
  tool_battery_guard: true,
  tool_secret_codes: true,
  tool_lockscreen_gen: true,
  tool_used_phone_audit: true,
  shop_accessories_enabled: true,
  lab_status_override: "auto",
  announcement_banner: {
    enabled: false,
    text: "Giridih Flagship Lab: Free On-The-Spot Hardware Diagnosis & Express Display Fixes",
  },
};

const STORAGE_KEY = "st_app_config_cache";
const EVENT_NAME = "st:config-updated";

export async function fetchAppConfig(): Promise<AppConfig> {
  // 1. Try local cache first for instant hydration
  let currentConfig: AppConfig = { ...DEFAULT_APP_CONFIG };
  if (typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        currentConfig = { ...DEFAULT_APP_CONFIG, ...JSON.parse(cached) };
      }
    } catch {
      // ignore JSON parse error
    }
  }

  // 2. If Supabase is configured, fetch live keys with try/catch fallback
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from("app_config").select("key, value");
      if (!error && data && data.length > 0) {
        const liveConfig: Partial<AppConfig> = {};
        for (const row of data) {
          (liveConfig as Record<string, unknown>)[row.key] = row.value;
        }
        currentConfig = { ...currentConfig, ...liveConfig };
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(currentConfig));
        }
      }
    } catch (err) {
      console.warn("Supabase app_config fallback to cache/defaults:", err);
    }
  }

  return currentConfig;
}

export async function updateAppConfigKey<K extends keyof AppConfig>(
  key: K,
  value: AppConfig[K]
): Promise<AppConfig> {
  const current = await fetchAppConfig();
  const updated: AppConfig = { ...current, [key]: value };

  // 1. Persist locally immediately
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: updated }));
    } catch {
      // ignore
    }
  }

  // 2. Persist to Supabase if available
  if (isSupabaseConfigured) {
    try {
      await supabase
        .from("app_config")
        .upsert({ key: String(key), value: value }, { onConflict: "key" });
    } catch (err) {
      console.warn(`Supabase upsert failed for key ${String(key)}, kept locally:`, err);
    }
  }

  return updated;
}

export function subscribeToAppConfig(callback: (config: AppConfig) => void): () => void {
  if (typeof window === "undefined") return () => {};

  const handler = (e: Event) => {
    const custom = e as CustomEvent<AppConfig>;
    if (custom.detail) {
      callback(custom.detail);
    } else {
      fetchAppConfig().then(callback);
    }
  };

  window.addEventListener(EVENT_NAME, handler);
  window.addEventListener("storage", handler);

  // Initial call
  fetchAppConfig().then(callback);

  return () => {
    window.removeEventListener(EVENT_NAME, handler);
    window.removeEventListener("storage", handler);
  };
}

export function isLabOpenNow(override: "auto" | "open" | "closed" = "auto"): {
  isOpen: boolean;
  statusText: string;
  subText: string;
} {
  if (override === "open") {
    return {
      isOpen: true,
      statusText: "Lab Open Now",
      subText: "Technicians On-Duty • Walk-in Welcome",
    };
  }
  if (override === "closed") {
    return {
      isOpen: false,
      statusText: "Lab Closed",
      subText: "Opens 10:00 AM Tomorrow",
    };
  }

  // Auto mode: 10:00 AM to 9:30 PM IST (UTC+5:30)
  const now = new Date();
  const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
  const istMinutes = (utcMinutes + 330) % 1440; // IST is UTC + 5h30m

  const openTime = 10 * 60; // 10:00 AM
  const closeTime = 21 * 60 + 30; // 9:30 PM

  const isOpen = istMinutes >= openTime && istMinutes <= closeTime;

  return {
    isOpen,
    statusText: isOpen ? "Lab Open Now" : "Lab Closed",
    subText: isOpen ? "Closes 9:30 PM" : "Opens 10:00 AM Tomorrow",
  };
}
