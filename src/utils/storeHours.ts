/**
 * Giridih Lab Store Hours & Real-time IST Status Helper
 * Operating Schedule: Monday to Sunday · 10:00 AM to 9:30 PM IST (Asia/Kolkata)
 * Physical Location: Barganda Road, Near Shivam Clinic, Giridih, Jharkhand 815301
 */

import { BUSINESS_MASTER } from "@/config/superTelecomConfig";

export interface StoreStatus {
  isOpen: boolean;
  statusText: string;
  badgeText: string;
  subText: string;
  hoursText: string;
  currentIstTime?: string;
}

/**
 * Get accurate store status in IST (Indian Standard Time, UTC+5:30)
 * Works consistently in both Node/SSR and Browser client runtimes regardless of local timezone.
 */
export function getLiveGiridihStoreStatus(override?: "auto" | "open" | "closed"): StoreStatus {
  if (override === "open") {
    return {
      isOpen: true,
      statusText: "Open Now",
      badgeText: "Open till 9:30 PM",
      subText: "Closes 9:30 PM",
      hoursText: BUSINESS_MASTER.hours.shortDisplay,
    };
  }

  if (override === "closed") {
    return {
      isOpen: false,
      statusText: "Closed Now",
      badgeText: "Opens 10:00 AM",
      subText: "Opens 10:00 AM Tomorrow",
      hoursText: BUSINESS_MASTER.hours.shortDisplay,
    };
  }

  try {
    const now = new Date();
    // Format to Asia/Kolkata timezone
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Kolkata",
      hour12: false,
      hour: "numeric",
      minute: "numeric",
    });

    const parts = formatter.formatToParts(now);
    let hour = 0;
    let minute = 0;

    for (const part of parts) {
      if (part.type === "hour") hour = parseInt(part.value, 10);
      if (part.type === "minute") minute = parseInt(part.value, 10);
    }

    const currentMinutes = hour * 60 + minute;
    const openMinutes = 10 * 60; // 10:00 AM = 600
    const closeMinutes = 21 * 60 + 30; // 9:30 PM = 1290

    const isOpen = currentMinutes >= openMinutes && currentMinutes < closeMinutes;

    return {
      isOpen,
      statusText: isOpen ? "Open Now" : "Closed Now",
      badgeText: isOpen ? "Open till 9:30 PM" : "Opens 10:00 AM",
      subText: isOpen ? "Closes 9:30 PM" : "Opens 10:00 AM",
      hoursText: BUSINESS_MASTER.hours.shortDisplay,
      currentIstTime: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")} IST`,
    };
  } catch {
    // Fallback if Intl is unavailable or fails
    return {
      isOpen: true,
      statusText: "Open Now",
      badgeText: "Open till 9:30 PM",
      subText: "Closes 9:30 PM",
      hoursText: BUSINESS_MASTER.hours.shortDisplay,
    };
  }
}
