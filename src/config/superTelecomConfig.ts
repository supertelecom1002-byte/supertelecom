/**
 * SUPER TELECOM CENTRALIZED CONFIGURATION & MASTER SOURCE OF TRUTH
 * Location: Barganda Road, Giridih, Jharkhand 815301, India
 * 
 * Strict Single Source of Truth for:
 * - Business NAP (Name, Address, Phone, Email, Maps, Hours)
 * - Repair Services Master Catalog (Pricing, Part Grades, Warranties)
 * - Data Safety Policies & Customer Advisories
 * - Feature Toggles & Promotional State
 */

export const BUSINESS_MASTER = {
  name: "Super Telecom",
  legalName: "Super Telecom Mobile Care & Hardware Lab",
  h1Title: "Mobile Phone Repair Shop in Giridih — Screen, Battery & Motherboard Lab",
  tagline: "Giridih's Dedicated Mobile Repair & Motherboard Chip-Level Lab",
  establishedYear: 2016,
  experienceYears: "10+",
  experienceClaim: "Established 2016 • 10+ Years Experience in Giridih",
  
  // Contact & NAP Details
  streetAddress: "Barganda Road, Near Shivam Clinic",
  city: "Giridih",
  district: "Giridih",
  state: "Jharkhand",
  postalCode: "815301",
  country: "India",
  countryCode: "IN",
  fullAddress: "Barganda Road, Near Shivam Clinic, Giridih, Jharkhand 815301, India",
  
  // Communications & Direct Contact Fallbacks
  phone: "+91 80029 03643",
  phoneDisplay: "+91 80029 03643",
  phoneRaw: "+918002903643",
  phoneDigits: "8002903643",
  phoneInternational: "+918002903643",
  phoneCallHref: "tel:+918002903643",
  whatsapp: "+91 80029 03643",
  whatsappRaw: "918002903643",
  whatsappNumber: "918002903643",
  whatsappUrl: "https://wa.me/918002903643",
  whatsappBaseUrl: "https://wa.me/918002903643",
  email: "supertelecom1002@gmail.com",
  emailHref: "mailto:supertelecom1002@gmail.com",

  // Nested contact object for complete backward & forward compatibility
  contact: {
    phone: "+91 80029 03643",
    phoneDisplay: "+91 80029 03643",
    phoneRaw: "+918002903643",
    phoneDigits: "8002903643",
    whatsapp: "+91 80029 03643",
    whatsappRaw: "918002903643",
    whatsappNumber: "918002903643",
    whatsappUrl: "https://wa.me/918002903643",
    whatsappBaseUrl: "https://wa.me/918002903643",
    email: "supertelecom1002@gmail.com",
    emailHref: "mailto:supertelecom1002@gmail.com",
  },
  
  // Online Locations
  siteUrl: "https://www.supertelecom.shop",
  mapsUrl: "https://maps.app.goo.gl/mu5XXCehEpocaZWY9",
  googleReviewUrl: "https://maps.app.goo.gl/mu5XXCehEpocaZWY9",
  mapsEmbedUrl: "https://www.google.com/maps?q=Barganda+Road+Near+Shivam+Clinic+Giridih+Jharkhand&output=embed",
  coordinates: {
    latitude: 24.1843,
    longitude: 86.3075,
  },
  
  // Operating Hours (IST UTC+5:30)
  hours: {
    daysDisplay: "Monday–Sunday",
    hoursDisplay: "10:00 AM–9:30 PM IST",
    fullDisplay: "Monday–Sunday 10:00 AM–9:30 PM IST",
    shortDisplay: "Mon–Sun · 10:00 AM – 9:30 PM",
    openHour: 10,
    openMinute: 0,
    closeHour: 21,
    closeMinute: 30,
    schemaDays: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    schemaOpens: "10:00",
    schemaCloses: "21:30",
  },

  // Official GST & Invoicing Compliance Information
  gst: {
    sacCode: "998713",
    sacDescription: "Maintenance and repair services of computers, smartphones and communications equipment",
    gstRate: "18%",
    isCompliant: true,
    invoiceType: "GST Tax Invoice & Lab Warranty Card",
    itcEligible: true,
    phraseEn: "100% Official GST Tax Invoice & Lab Warranty Card provided for every repair. Input Tax Credit (ITC) available for corporate and business clients.",
    phraseHi: "सभी रिपेयरिंग पर 100% पक्का जीएसटी टैक्स इनवॉइस (GST Bill) और वारंटी कार्ड उपलब्ध। बिज़नेस ग्राहकों के लिए इनपुट टैक्स क्रेडिट (ITC) की सुविधा।",
  },

  // Verified factual metrics (no exaggerated statistics)
  verifiedMetrics: {
    established: 2016,
    experienceText: "10+ Years in Giridih (Est. 2016)",
    ratingText: "Top-Rated Local Mobile Repair Shop (Google Maps)",
    repairedCount: "Serving Giridih Since 2016",
    inspectionPolicy: "Free Bench Inspection & Written Quote",
    warrantyCoverage: "Up to 90 Days Warranty on Parts",
  },
} as const;

/**
 * Data Safety & Customer Privacy Advisory
 * Replaces unverified "100% Data Safe / Zero Data Wipe" claims.
 */
export const DATA_SAFETY_AND_PRIVACY_SUMMARY = {
  headline: "Customer Device Data Safety & Advisory",
  customerAdvisory:
    "Customer Data Advisory: While hardware repairs (screens, batteries, ports, and IC components) do not alter stored user data, Super Telecom strongly advises all customers to create a full backup of their phone (Google Drive, iCloud, or PC) prior to handing in their device for repair. Super Telecom technicians never access personal files without authorization.",
  shortAdvisory:
    "Hardware repairs typically preserve data. We recommend backing up your device before repair check-in.",
  trustPill: "Data Privacy Protocol Followed",
} as const;

/**
 * Promotional Offer Toggles
 * Unconfirmed promotions remain strictly hidden when isActive is false.
 */
export const PROMOTIONS_CONFIG = {
  voucher150: {
    code: "ST-LAB-BEST",
    isActive: false, // Kept false until official store promotion is initiated
    title: "Best Market Value Workshop Privilege",
    description: "Lowest market rate service privilege at Barganda Road workshop.",
  },
  freePortCleaning: {
    code: "FREE-PORT-CLEAN",
    isActive: false, // Kept false until authorized
    title: "Monthly Free Port Micro-Cleaning",
    description: "Complimentary ultrasonic port lint clearance.",
  },
  vipHub: {
    code: "VIP-PASS",
    isActive: false, // Gated until verified
    title: "VIP Customer Lounge",
    description: "Exclusive rewards program for registered customers.",
  },
} as const;

export const BEST_VALUE_LABELS = {
  lowestRate: "सबसे कम दाम • बेस्ट क्वालिटी (Lowest Market Rate)",
  bestPriceGuarantee: "बेस्ट प्राइस गारंटी — WhatsApp पर तुरंत रेट जानें",
  transparentFreeCheck: "100% पारदर्शी और किफ़ायती दाम • मुफ़्त जांच",
} as const;

/**
 * Master Services & Quality Guarantee Catalog
 * Single Source of Truth for Estimators, Tables, and Detail Pages (Zero Fixed Public Rates).
 */
export interface PartTier {
  id: string;
  name: string;
  partGrade: "Compatible Aftermarket" | "OEM-Grade" | "Original Service Pack";
  priceRange: string;
  turnaround: string;
  warranty: string;
  description: string;
}

export interface MasterCatalogService {
  id: string;
  name: string;
  slug: string;
  category: "screen" | "battery" | "charging" | "motherboard" | "water" | "optics" | "software";
  basePriceRange: string;
  turnaround: string;
  warranty: string;
  disclaimer: string;
  commonSymptoms: string[];
  partTiers?: PartTier[];
}

export const REPAIR_PRICE_DISCLAIMER =
  "सबसे कम दाम व बेस्ट क्वालिटी की गारंटी — हम बजट से लेकर महँगे फ्लैगशिप फ़ोन तक हर रिपेयर के लिए मुफ़्त 5-मिनट जांच के बाद गिरिडीह का सबसे कम और पक्का रेट लिखित में कन्फर्म करते हैं (बिना किसी छुपे चार्ज के)।";

export const SERVICES_MASTER_CATALOG: MasterCatalogService[] = [
  {
    id: "display-replacement",
    name: "Screen & Display Replacement",
    slug: "display-replacement",
    category: "screen",
    basePriceRange: BEST_VALUE_LABELS.lowestRate,
    turnaround: "30 to 45 Minutes",
    warranty: "Up to 90 Days Warranty",
    disclaimer: REPAIR_PRICE_DISCLAIMER,
    commonSymptoms: [
      "Cracked outer touch glass with sharp edges",
      "Black screen, ink bleeding, or flickering backlight",
      "Touch screen unresponsive, phantom ghost touches",
      "Horizontal or vertical green/pink lines on OLED panel",
    ],
    partTiers: [
      {
        id: "android-lcd",
        name: "Android IPS LCD Panel",
        partGrade: "Compatible Aftermarket",
        priceRange: BEST_VALUE_LABELS.transparentFreeCheck,
        turnaround: "30–45 Mins",
        warranty: "Up to 90 Days",
        description: "Tested IPS LCD assemblies with crisp touch response for budget & mid-range Android models.",
      },
      {
        id: "android-amoled",
        name: "Android AMOLED & Curved Display",
        partGrade: "OEM-Grade",
        priceRange: BEST_VALUE_LABELS.lowestRate,
        turnaround: "30–45 Mins",
        warranty: "Up to 90 Days",
        description: "Vibrant high-contrast AMOLED/OLED screens matching native factory refresh rates & color reproduction.",
      },
      {
        id: "iphone-oled",
        name: "iPhone Display & Retina OLED",
        partGrade: "Original Service Pack",
        priceRange: BEST_VALUE_LABELS.bestPriceGuarantee,
        turnaround: "30–60 Mins",
        warranty: "Up to 90 Days",
        description: "Precision Retina OLED assemblies with True Tone serialization programming and 3D Touch transfer.",
      },
    ],
  },
  {
    id: "battery-replacement",
    name: "Battery Replacement",
    slug: "battery-replacement",
    category: "battery",
    basePriceRange: BEST_VALUE_LABELS.lowestRate,
    turnaround: "20 to 45 Minutes",
    warranty: "90 Days Warranty",
    disclaimer: REPAIR_PRICE_DISCLAIMER,
    commonSymptoms: [
      "Battery drains rapidly within 2 to 4 hours",
      "Phone abruptly shuts off when battery drops below 30%",
      "Swollen battery causing back panel or display to lift",
      "Device overheats during light browsing or idle state",
    ],
    partTiers: [
      {
        id: "android-battery",
        name: "Android High-Density Battery",
        partGrade: "OEM-Grade",
        priceRange: BEST_VALUE_LABELS.lowestRate,
        turnaround: "20–35 Mins",
        warranty: "90 Days Warranty",
        description: "Zero-cycle high density lithium polymer cells certified for safe thermal stability.",
      },
      {
        id: "iphone-battery",
        name: "iPhone Battery (BMS Calibration)",
        partGrade: "Original Service Pack",
        priceRange: BEST_VALUE_LABELS.bestPriceGuarantee,
        turnaround: "45–60 Mins",
        warranty: "90 Days Warranty",
        description: "Premium cells with micro-spot welding BMS transplantation to support native iOS health indicators.",
      },
    ],
  },
  {
    id: "charging-port-repair",
    name: "Charging Port & Sub-Board Repair",
    slug: "charging-port-repair",
    category: "charging",
    basePriceRange: BEST_VALUE_LABELS.transparentFreeCheck,
    turnaround: "20 to 40 Minutes",
    warranty: "Up to 90 Days Warranty",
    disclaimer: REPAIR_PRICE_DISCLAIMER,
    commonSymptoms: [
      "Cable must be wiggled or held at an angle to charge",
      "Slow charging warning or moisture detected error",
      "Device will not connect to PC / OTG accessories",
      "Physical lint, corrosion, or broken center tongue pin",
    ],
    partTiers: [
      {
        id: "port-subboard",
        name: "Type-C / Lightning Port Assembly",
        partGrade: "OEM-Grade",
        priceRange: BEST_VALUE_LABELS.lowestRate,
        turnaround: "20–40 Mins",
        warranty: "Up to 90 Days Warranty",
        description: "Original fast-charge compliant sub-boards with integrated microphone and ESD protection.",
      },
    ],
  },
  {
    id: "motherboard-repair",
    name: "Motherboard & Chip-Level IC Repair",
    slug: "motherboard-repair",
    category: "motherboard",
    basePriceRange: BEST_VALUE_LABELS.bestPriceGuarantee,
    turnaround: "Same Day / 24–48 Hours",
    warranty: "Up to 90 Days Warranty",
    disclaimer: REPAIR_PRICE_DISCLAIMER,
    commonSymptoms: [
      "Completely dead phone with zero ampere pull on DC power supply",
      "Infinite boot loop on brand logo or unexpected kernel panic",
      "No Wi-Fi, greyed-out Bluetooth, or Baseband / No Service fault",
      "Audio IC malfunction (greyed-out speaker in phone calls)",
    ],
    partTiers: [
      {
        id: "ic-micro-soldering",
        name: "BGA Reballing & Power IC Replacement",
        partGrade: "Original Service Pack",
        priceRange: BEST_VALUE_LABELS.lowestRate,
        turnaround: "Same Day / 24–48 Hours",
        warranty: "Up to 90 Days Warranty",
        description: "Stereomicroscope micro-soldering, short-circuit debugging, and dual-layer board splitting.",
      },
    ],
  },
  {
    id: "water-damage-repair",
    name: "Water Damage & Liquid Ultrasonic Revival",
    slug: "water-damage-repair",
    category: "water",
    basePriceRange: BEST_VALUE_LABELS.transparentFreeCheck,
    turnaround: "2 to 5 Hours / 24 Hours",
    warranty: "Tested & Bench Verified",
    disclaimer: REPAIR_PRICE_DISCLAIMER,
    commonSymptoms: [
      "Device dropped in water, sink, rain, or liquid spill",
      "Corrosion visible on charging port, headphone jack, or SIM slot",
      "Phone overheating immediately upon battery connection",
      "Display backlight dead while touch feedback vibrates",
    ],
    partTiers: [
      {
        id: "ultrasonic-bath",
        name: "Ultrasonic Chemical De-Oxidation & Board Re-Flow",
        partGrade: "OEM-Grade",
        priceRange: BEST_VALUE_LABELS.lowestRate,
        turnaround: "2–5 Hours",
        warranty: "Tested & Bench Verified",
        description: "Full PCB disassembly into specialized solvent bath to neutralize corrosive mineral salts.",
      },
    ],
  },
];

/**
 * Helper to generate pre-filled WhatsApp quote links
 */
export function buildWhatsAppQuoteUrl(params: {
  brand?: string;
  model?: string;
  serviceName?: string;
  issue?: string;
}): string {
  const parts: string[] = ["Namaste Super Telecom Giridih! Mujhe sabse kam market rate aur best quality repair quote chahiye."];
  if (params.brand) parts.push(`Brand: ${params.brand}`);
  if (params.model) parts.push(`Model: ${params.model}`);
  if (params.serviceName) parts.push(`Service: ${params.serviceName}`);
  if (params.issue) parts.push(`Issue: ${params.issue}`);
  parts.push("Kripya lowest rate aur parts availability batayein.");
  
  const text = parts.join("\n");
  return `${BUSINESS_MASTER.whatsappBaseUrl}?text=${encodeURIComponent(text)}`;
}
