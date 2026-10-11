import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

export interface AppConfig {
  tool_speaker_cleaner: boolean;
  tool_audio_loopback: boolean;
  tool_vibration: boolean;
  tool_touch_test: boolean;
  tool_dead_pixel: boolean;
  tool_multi_touch: boolean;
  tool_burnin_healer: boolean;
  tool_fps_meter: boolean;
  tool_gyro: boolean;
  tool_torch: boolean;
  tool_ambient_light: boolean;
  tool_anti_theft: boolean;
  tool_battery_guard: boolean;
  tool_secret_codes: boolean;
  tool_imei_validator: boolean;
  tool_lockscreen_gen: boolean;
  tool_used_audit: boolean;
  tool_used_phone_audit: boolean;
  tool_water_wizard: boolean;
  shop_accessories_enabled: boolean;
  lab_status_override: "auto" | "open" | "closed";
  announcement_banner: {
    enabled: boolean;
    text: string;
  };
}

export const DEFAULT_CONFIG: AppConfig = {
  tool_speaker_cleaner: true,
  tool_audio_loopback: true,
  tool_vibration: true,
  tool_touch_test: true,
  tool_dead_pixel: true,
  tool_multi_touch: true,
  tool_burnin_healer: true,
  tool_fps_meter: true,
  tool_gyro: true,
  tool_torch: true,
  tool_ambient_light: true,
  tool_anti_theft: true,
  tool_battery_guard: true,
  tool_secret_codes: true,
  tool_imei_validator: true,
  tool_lockscreen_gen: true,
  tool_used_audit: true,
  tool_used_phone_audit: true,
  tool_water_wizard: true,
  shop_accessories_enabled: true,
  lab_status_override: "auto",
  announcement_banner: {
    enabled: false,
    text: "Giridih Flagship Lab: Free On-The-Spot Hardware Diagnosis & Express Display Fixes",
  },
};

export const DEFAULT_APP_CONFIG: AppConfig = DEFAULT_CONFIG;

const STORAGE_KEY = "st_app_config_cache";
const EVENT_NAME = "st:config-updated";

export async function fetchAppConfig(): Promise<AppConfig> {
  // 1. Try local cache first for instant hydration
  let currentConfig: AppConfig = { ...DEFAULT_CONFIG };
  if (typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === "object") {
          currentConfig = {
            ...DEFAULT_CONFIG,
            ...parsed,
            announcement_banner: {
              ...DEFAULT_CONFIG.announcement_banner,
              ...(parsed.announcement_banner || {}),
            },
          };
        }
      }
    } catch {
      // ignore JSON parse error
    }
  }

  // 2. If Supabase is configured, fetch live keys with try/catch fallback
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from("app_config").select("key, value");
      // If table is missing (404/42P01) or error occurs, fallback cleanly without throwing
      if (!error && Array.isArray(data) && data.length > 0) {
        const liveConfig: Record<string, unknown> = {};
        for (const row of data) {
          if (row && row.key) {
            liveConfig[row.key] = row.value;
          }
        }
        currentConfig = {
          ...DEFAULT_CONFIG,
          ...currentConfig,
          ...(liveConfig as Partial<AppConfig>),
          announcement_banner: {
            ...DEFAULT_CONFIG.announcement_banner,
            ...((liveConfig.announcement_banner as any) || currentConfig.announcement_banner || {}),
          },
        };
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(currentConfig));
          } catch {
            // ignore storage quota errors
          }
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
  let current: AppConfig;
  try {
    current = await fetchAppConfig();
  } catch {
    current = { ...DEFAULT_CONFIG };
  }

  const updated: AppConfig = { ...DEFAULT_CONFIG, ...current, [key]: value };

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
  if (typeof window === "undefined") {
    try {
      callback(DEFAULT_CONFIG);
    } catch {
      // ignore
    }
    return () => {};
  }

  const handler = (e: Event) => {
    try {
      const custom = e as CustomEvent<AppConfig>;
      if (custom && custom.detail && typeof custom.detail === "object") {
        callback({ ...DEFAULT_CONFIG, ...custom.detail });
      } else {
        fetchAppConfig()
          .then((cfg) => callback(cfg ? { ...DEFAULT_CONFIG, ...cfg } : DEFAULT_CONFIG))
          .catch(() => callback(DEFAULT_CONFIG));
      }
    } catch {
      callback(DEFAULT_CONFIG);
    }
  };

  window.addEventListener(EVENT_NAME, handler);
  window.addEventListener("storage", handler);

  // Initial call with immediate safe execution
  try {
    fetchAppConfig()
      .then((cfg) => {
        try {
          callback(cfg ? { ...DEFAULT_CONFIG, ...cfg } : DEFAULT_CONFIG);
        } catch {
          callback(DEFAULT_CONFIG);
        }
      })
      .catch(() => {
        callback(DEFAULT_CONFIG);
      });
  } catch {
    callback(DEFAULT_CONFIG);
  }

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
  const safeOverride = override || "auto";
  if (safeOverride === "open") {
    return {
      isOpen: true,
      statusText: "Lab Open Now",
      subText: "Technicians On-Duty • Walk-in Welcome",
    };
  }
  if (safeOverride === "closed") {
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
