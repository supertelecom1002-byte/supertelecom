import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

export type RepairStage =
  | "received"
  | "diagnosing"
  | "qc_testing"
  | "ready"
  | "delivered";

export interface RepairJob {
  id: string; // e.g. "ST-1082"
  customer_name: string;
  customer_phone: string;
  device_model: string;
  issue_description: string;
  estimated_cost: number;
  current_stage: RepairStage;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const STAGE_METADATA: Record<
  RepairStage,
  { label: string; description: string; stepNumber: number; color: string }
> = {
  received: {
    label: "Intake & Inspection",
    description: "Device received at Barganda Road Lab. Visual physical audit & IMEI intake complete.",
    stepNumber: 1,
    color: "cyan",
  },
  diagnosing: {
    label: "Microscope & Chip-Level Diagnosis",
    description: "Trinocular microscope line check & thermal short isolation under progress.",
    stepNumber: 2,
    color: "amber",
  },
  qc_testing: {
    label: "Component Replacement & 15-Point QC",
    description: "OEM replacement part mounted. Undergoing touch, charging, signal & display calibration.",
    stepNumber: 3,
    color: "blue",
  },
  ready: {
    label: "Ready for Pickup",
    description: "Service completed with formal warranty certificate. Awaiting customer hand-over.",
    stepNumber: 4,
    color: "emerald",
  },
  delivered: {
    label: "Delivered & Warranty Active",
    description: "Device handed over to customer. Super Telecom formal post-repair warranty is active.",
    stepNumber: 5,
    color: "emerald",
  },
};

const DEFAULT_JOBS: RepairJob[] = [
  {
    id: "ST-1082",
    customer_name: "Amit Sharma",
    customer_phone: "9876543210",
    device_model: "iPhone 13 (Midnight 128GB)",
    issue_description: "Cracked OLED display & touch dead zone in lower third",
    estimated_cost: 4499,
    current_stage: "qc_testing",
    notes: "Original high-retina panel installed. TrueTone data transferred successfully.",
    created_at: "2026-10-10T14:30:00.000Z",
    updated_at: "2026-10-11T10:15:00.000Z",
  },
  {
    id: "ST-1083",
    customer_name: "Pooja Verma",
    customer_phone: "9123456780",
    device_model: "Samsung Galaxy S22 Ultra",
    issue_description: "Dead motherboard after minor liquid splash; charging port corroded",
    estimated_cost: 2999,
    current_stage: "diagnosing",
    notes: "Ultrasonic chemical clean complete. Secondary power management IC short found.",
    created_at: "2026-10-10T18:00:00.000Z",
    updated_at: "2026-10-11T11:00:00.000Z",
  },
  {
    id: "ST-1084",
    customer_name: "Rahul Kumar",
    customer_phone: "9988776655",
    device_model: "OnePlus 9 Pro",
    issue_description: "Green vertical display line after system update",
    estimated_cost: 1999,
    current_stage: "ready",
    notes: "Laser flex restoration completed. Display output 100% clean without replacement.",
    created_at: "2026-10-09T11:20:00.000Z",
    updated_at: "2026-10-11T09:45:00.000Z",
  },
  {
    id: "ST-1085",
    customer_name: "Sneha Mukherjee",
    customer_phone: "8877665544",
    device_model: "Xiaomi 12 Pro",
    issue_description: "Battery draining in 3 hours & heating up while charging",
    estimated_cost: 1450,
    current_stage: "received",
    notes: "Battery health measured at 67%. Original battery unit allocated for swap.",
    created_at: "2026-10-11T11:45:00.000Z",
    updated_at: "2026-10-11T11:45:00.000Z",
  },
];

const STORAGE_KEY = "st_repair_jobs_cache";

function getLocalJobs(): RepairJob[] {
  if (typeof window === "undefined") return DEFAULT_JOBS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_JOBS));
      return DEFAULT_JOBS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_JOBS;
  }
}

function saveLocalJobs(jobs: RepairJob[]) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
    } catch {
      // ignore
    }
  }
}

export async function fetchAllRepairJobs(): Promise<RepairJob[]> {
  const local = getLocalJobs();

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("repair_jobs")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        saveLocalJobs(data);
        return data as RepairJob[];
      }
    } catch (err) {
      console.warn("Supabase fetchAllRepairJobs fallback to local:", err);
    }
  }

  return local;
}

export async function findRepairJob(query: string): Promise<RepairJob | null> {
  const clean = query.trim().toUpperCase();
  const digits = query.replace(/\D/g, "");

  // 1. Try Supabase
  if (isSupabaseConfigured) {
    try {
      let q = supabase.from("repair_jobs").select("*");
      if (clean.startsWith("ST-")) {
        q = q.eq("id", clean);
      } else if (digits.length >= 4) {
        q = q.or(`id.ilike.%${clean}%,customer_phone.ilike.%${digits}%`);
      } else {
        q = q.ilike("id", `%${clean}%`);
      }

      const { data, error } = await q.limit(1);
      if (!error && data && data.length > 0) {
        return data[0] as RepairJob;
      }
    } catch (err) {
      console.warn("Supabase findRepairJob fallback:", err);
    }
  }

  // 2. Local fallback
  const jobs = getLocalJobs();
  const match = jobs.find(
    (j) =>
      j.id.toUpperCase() === clean ||
      (digits.length >= 4 && j.customer_phone.includes(digits)) ||
      j.customer_name.toUpperCase().includes(clean)
  );

  return match || null;
}

export async function createRepairJob(job: Omit<RepairJob, "created_at" | "updated_at">): Promise<RepairJob> {
  const now = new Date().toISOString();
  const fullJob: RepairJob = {
    ...job,
    created_at: now,
    updated_at: now,
  };

  // Local save
  const current = getLocalJobs();
  const updated = [fullJob, ...current.filter((j) => j.id !== fullJob.id)];
  saveLocalJobs(updated);

  // Supabase save
  if (isSupabaseConfigured) {
    try {
      await supabase.from("repair_jobs").insert(fullJob);
    } catch (err) {
      console.warn("Supabase createRepairJob fallback:", err);
    }
  }

  return fullJob;
}

export async function updateRepairJobStage(id: string, stage: RepairStage, notes?: string): Promise<RepairJob | null> {
  const now = new Date().toISOString();
  const current = getLocalJobs();
  let updatedJob: RepairJob | null = null;

  const updatedList = current.map((j) => {
    if (j.id === id) {
      updatedJob = {
        ...j,
        current_stage: stage,
        notes: notes !== undefined ? notes : j.notes,
        updated_at: now,
      };
      return updatedJob;
    }
    return j;
  });

  if (updatedJob) {
    saveLocalJobs(updatedList);

    if (isSupabaseConfigured) {
      try {
        await supabase
          .from("repair_jobs")
          .update({ current_stage: stage, notes: notes, updated_at: now })
          .eq("id", id);
      } catch (err) {
        console.warn("Supabase updateRepairJobStage fallback:", err);
      }
    }
  }

  return updatedJob;
}

export function buildWhatsAppStatusUrl(job: RepairJob): string {
  const stageInfo = STAGE_METADATA[job.current_stage];
  const lines = [
    `*Super Telecom Repair Update - ${job.id}*`,
    `Customer: ${job.customer_name}`,
    `Device: ${job.device_model}`,
    `Current Status: *${stageInfo.label}*`,
    `Progress: ${stageInfo.description}`,
    job.notes ? `Engineer Note: ${job.notes}` : "",
    `Estimated Cost: ₹${job.estimated_cost.toLocaleString()}`,
    "",
    "Barganda Road Lab, Near Shivam Clinic, Giridih",
    "Call: +91 80029 03643",
  ].filter(Boolean);

  const phone = job.customer_phone.startsWith("91") ? job.customer_phone : `91${job.customer_phone}`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(lines.join("\n"))}`;
}
