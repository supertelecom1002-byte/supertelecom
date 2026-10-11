import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

export interface ServicePricingItem {
  id: string;
  brand: string;
  model: string;
  repair_type: string;
  price_min: number;
  price_max: number;
  turnaround_time: string;
  warranty_days: number;
}

export const DEFAULT_SERVICE_PRICING: ServicePricingItem[] = [
  {
    id: "sp-1",
    brand: "Apple",
    model: "iPhone 13 / 14 / 15 Series",
    repair_type: "Full Combo OLED & Retina Screen",
    price_min: 3499,
    price_max: 8999,
    turnaround_time: "45 Mins",
    warranty_days: 90,
  },
  {
    id: "sp-2",
    brand: "Apple",
    model: "iPhone 11 / 12 / 13 / 14",
    repair_type: "Outer Glass Only Refurbish (OCA)",
    price_min: 1799,
    price_max: 3499,
    turnaround_time: "60 Mins",
    warranty_days: 60,
  },
  {
    id: "sp-3",
    brand: "Apple",
    model: "iPhone All Series",
    repair_type: "Original Battery & Health Calibration",
    price_min: 1299,
    price_max: 2999,
    turnaround_time: "30 Mins",
    warranty_days: 90,
  },
  {
    id: "sp-4",
    brand: "Apple",
    model: "iPhone All Models",
    repair_type: "Face ID / Front Dot Projector Repair",
    price_min: 1499,
    price_max: 2799,
    turnaround_time: "2 Hours",
    warranty_days: 60,
  },
  {
    id: "sp-5",
    brand: "Samsung",
    model: "Galaxy S21 / S22 / S23 / Ultra",
    repair_type: "Curved AMOLED Display & Touch",
    price_min: 3999,
    price_max: 9499,
    turnaround_time: "45 Mins",
    warranty_days: 90,
  },
  {
    id: "sp-6",
    brand: "Samsung",
    model: "Galaxy A & M Series",
    repair_type: "FHD+ Display & Glass Swap",
    price_min: 1299,
    price_max: 2499,
    turnaround_time: "30 Mins",
    warranty_days: 90,
  },
  {
    id: "sp-7",
    brand: "OnePlus",
    model: "OnePlus 9 / 10 / 11 / 12 Series",
    repair_type: "AMOLED Green/Pink Line Laser Fix",
    price_min: 1499,
    price_max: 3200,
    turnaround_time: "2 Hours",
    warranty_days: 60,
  },
  {
    id: "sp-8",
    brand: "Xiaomi",
    model: "Redmi Note 10 / 11 / 12 / 13",
    repair_type: "Dead CPU Reballing & Audio IC Fix",
    price_min: 1199,
    price_max: 2499,
    turnaround_time: "3 Hours",
    warranty_days: 60,
  },
  {
    id: "sp-9",
    brand: "Vivo",
    model: "V-Series & X-Series Flagships",
    repair_type: "Curved Glass Separation & Touch",
    price_min: 1599,
    price_max: 3799,
    turnaround_time: "60 Mins",
    warranty_days: 90,
  },
  {
    id: "sp-10",
    brand: "All Brands",
    model: "Universal Smartphones",
    repair_type: "Type-C Fast Charging Flex & Port",
    price_min: 350,
    price_max: 850,
    turnaround_time: "20 Mins",
    warranty_days: 30,
  },
];

const STORAGE_KEY = "st_service_pricing_cache";

function getLocalPricing(): ServicePricingItem[] {
  if (typeof window === "undefined") return DEFAULT_SERVICE_PRICING;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SERVICE_PRICING));
      return DEFAULT_SERVICE_PRICING;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_SERVICE_PRICING;
  }
}

function saveLocalPricing(items: ServicePricingItem[]) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }
}

export async function fetchServicePricing(): Promise<ServicePricingItem[]> {
  const local = getLocalPricing();

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("service_pricing")
        .select("*")
        .order("brand", { ascending: true });

      if (!error && data && data.length > 0) {
        saveLocalPricing(data);
        return data as ServicePricingItem[];
      }
    } catch (err) {
      console.warn("Supabase fetchServicePricing fallback:", err);
    }
  }

  return local;
}

export async function upsertServicePricingItem(
  item: ServicePricingItem
): Promise<ServicePricingItem> {
  const current = getLocalPricing();
  const exists = current.some((p) => p.id === item.id);
  const updated = exists
    ? current.map((p) => (p.id === item.id ? item : p))
    : [item, ...current];

  saveLocalPricing(updated);

  if (isSupabaseConfigured) {
    try {
      await supabase.from("service_pricing").upsert(item);
    } catch (err) {
      console.warn("Supabase upsertServicePricingItem fallback:", err);
    }
  }

  return item;
}

export async function deleteServicePricingItem(id: string): Promise<void> {
  const current = getLocalPricing();
  const updated = current.filter((p) => p.id !== id);
  saveLocalPricing(updated);

  if (isSupabaseConfigured) {
    try {
      await supabase.from("service_pricing").delete().eq("id", id);
    } catch (err) {
      console.warn("Supabase deleteServicePricingItem fallback:", err);
    }
  }
}
