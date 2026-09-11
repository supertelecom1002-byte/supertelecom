import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const SPREADSHEET_ID = "1beKfFOEV0viv_bwFnHV5IwOXH5FspAfJIWcyLT146fA";
const RANGE = "Bookings!A2:J";

const querySchema = z.object({
  query: z
    .string()
    .trim()
    .min(10, "Poora 10-digit mobile number ya full IMEI daaliye")
    .max(30)
    .transform((v) => v.replace(/[^0-9]/g, "")),
});

export type RepairStatusEntry = {
  bookedAt: string;
  name: string;
  phone: string;
  model: string;
  service: string;
  problem: string;
  imei: string;
  status: string;
  statusUpdated: string;
  estimatedReady: string;
};

function formatCell(value: string): string {
  const raw = (value || "").trim();
  if (!raw) return "";
  // Sheets stores USER_ENTERED dates as serial numbers
  if (/^\d+(\.\d+)?$/.test(raw) && Number(raw) > 20000 && Number(raw) < 90000) {
    const ms = (Number(raw) - 25569) * 86400 * 1000;
    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Kolkata",
    }).format(new Date(ms));
  }
  return raw;
}

export const lookupRepairStatus = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => querySchema.parse(input))
  .handler(async ({ data }) => {
    const digits = data.query;
    // Require a full 10-digit phone number or a full IMEI (>=14 digits).
    // Short fragments are never accepted, to prevent enumeration of records.
    if (digits.length < 10) {
      return { ok: false as const, reason: "invalid" as const, entries: [] };
    }

    const lovableKey = process.env["LOVABLE_API_KEY"];
    const sheetsKey = process.env["GOOGLE_SHEETS_API_KEY"];
    if (!lovableKey || !sheetsKey) {
      return { ok: false as const, reason: "unavailable" as const, entries: [] };
    }

    const url = `https://connector-gateway.lovable.dev/google_sheets/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": sheetsKey,
      },
    });

    if (!res.ok) {
      console.error(`Sheets read failed [${res.status}]`);
      return { ok: false as const, reason: "unavailable" as const, entries: [] };
    }

    const body = (await res.json()) as { values?: string[][] };
    const rows = body.values ?? [];
    const fullPhone = digits.slice(-10);

    const entries: RepairStatusEntry[] = rows
      .filter((row) => {
        const phone = (row[2] || "").replace(/[^0-9]/g, "");
        const imei = (row[6] || "").replace(/[^0-9]/g, "");
        // Exact match only: full phone number (last 10 digits equal) or
        // full IMEI string equality. No partial/suffix matching.
        return (
          (phone.length >= 10 && phone.slice(-10) === fullPhone) ||
          (imei.length >= 14 && imei === digits)
        );
      })
      .slice(-5)
      .reverse()
      .map((row) => ({
        bookedAt: formatCell(row[0] ?? ""),
        name: (row[1] ?? "").trim(),
        phone: (row[2] ?? "").trim(),
        model: (row[3] ?? "").trim(),
        service: (row[4] ?? "").trim(),
        problem: (row[5] ?? "").trim(),
        imei: (row[6] ?? "").trim(),
        status: (row[7] ?? "").trim() || "Received — diagnosis pending",
        statusUpdated: formatCell(row[8] ?? ""),
        estimatedReady: formatCell(row[9] ?? ""),
      }));

    return { ok: true as const, reason: "ok" as const, entries };
  });
