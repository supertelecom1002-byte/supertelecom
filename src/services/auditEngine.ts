import { supabase } from "@/lib/supabaseClient";

export interface AuditIssue {
  id: string;
  severity: "critical" | "warning" | "info";
  category: "seo" | "schema" | "links" | "performance";
  title: string;
  description: string;
  recommendation: string;
  targetTab: "seo" | "services" | "feed" | "announcements" | "showcase";
}

export interface AuditScores {
  overall: number;
  seo: number;
  schema: number;
  links: number;
  performance: number;
}

export interface AuditMetrics {
  totalImages: number;
  imagesWithoutAlt: number;
  h1Count: number;
  internalLinks: number;
  externalLinks: number;
  whatsAppLinks: number;
  schemaTypes: string[];
  titleLength: number;
  descLength: number;
  hasGiridihInTitle: boolean;
  hasGiridihInDesc: boolean;
  hasLocalBusinessSchema: boolean;
  phoneMatchesNAP: boolean;
}

export interface AuditReport {
  id: string;
  created_at: string;
  scores: AuditScores;
  issues: AuditIssue[];
  metrics: AuditMetrics;
}

const FALLBACK_AUDIT_KEY = "st_latest_audit_report";
const AUDIT_HISTORY_KEY = "st_audit_history";

/**
 * Executes a comprehensive real-time audit of the current DOM and metadata.
 */
export async function runWebsiteAudit(): Promise<AuditReport> {
  const issues: AuditIssue[] = [];

  // Default metrics
  let totalImages = 0;
  let imagesWithoutAlt = 0;
  let h1Count = 0;
  let internalLinks = 0;
  let externalLinks = 0;
  let whatsAppLinks = 0;
  const schemaTypes: string[] = [];
  let titleLength = 0;
  let descLength = 0;
  let hasGiridihInTitle = false;
  let hasGiridihInDesc = false;
  let hasLocalBusinessSchema = false;
  let phoneMatchesNAP = false;

  // Deductions tally
  let seoDeductions = 0;
  let schemaDeductions = 0;
  let linkDeductions = 0;
  let perfDeductions = 0;

  if (typeof document !== "undefined") {
    // 1. Title Verification
    const title = document.title || "";
    titleLength = title.length;
    hasGiridihInTitle = title.toLowerCase().includes("giridih");

    if (!title) {
      issues.push({
        id: "seo-title-missing",
        severity: "critical",
        category: "seo",
        title: "Page Title is Missing",
        description: "The document has no title element, severely hindering search indexing.",
        recommendation: "Set a clear title containing 'Super Telecom' and 'Giridih'.",
        targetTab: "seo",
      });
      seoDeductions += 30;
    } else {
      if (titleLength < 30 || titleLength > 70) {
        issues.push({
          id: "seo-title-length",
          severity: "warning",
          category: "seo",
          title: "Page Title Length Not Optimal",
          description: `Current title length is ${titleLength} chars. Recommended length is between 30 and 65 characters.`,
          recommendation: "Adjust title to be between 30-65 characters for optimal SERP display.",
          targetTab: "seo",
        });
        seoDeductions += 10;
      }
      if (!hasGiridihInTitle) {
        issues.push({
          id: "seo-title-keyword",
          severity: "critical",
          category: "seo",
          title: "Missing 'Giridih' Geo-Target in Title",
          description: "Local SEO ranking relies heavily on your primary location keyword in the title.",
          recommendation: "Ensure 'Giridih' is prominently placed in the page title.",
          targetTab: "seo",
        });
        seoDeductions += 25;
      }
    }

    // 2. Meta Description Verification
    const metaDescTag = document.querySelector('meta[name="description"]');
    const metaDesc = metaDescTag?.getAttribute("content") || "";
    descLength = metaDesc.length;
    hasGiridihInDesc = metaDesc.toLowerCase().includes("giridih");

    if (!metaDesc) {
      issues.push({
        id: "seo-desc-missing",
        severity: "critical",
        category: "seo",
        title: "Meta Description is Missing",
        description: "Search engines cannot generate an accurate descriptive snippet for search results.",
        recommendation: "Add a 120-160 character meta description highlighting phone repair services.",
        targetTab: "seo",
      });
      seoDeductions += 25;
    } else {
      if (descLength < 110 || descLength > 175) {
        issues.push({
          id: "seo-desc-length",
          severity: "warning",
          category: "seo",
          title: "Meta Description Length Outside Sweet Spot",
          description: `Meta description is ${descLength} characters. Optimal range is 120 to 160 characters.`,
          recommendation: "Refine meta description to roughly 140-160 characters.",
          targetTab: "seo",
        });
        seoDeductions += 10;
      }
      if (!hasGiridihInDesc) {
        issues.push({
          id: "seo-desc-location",
          severity: "warning",
          category: "seo",
          title: "Meta Description Lacks 'Giridih'",
          description: "Local searchers looking for repair shops in Giridih won't see geographic relevance.",
          recommendation: "Mention Barganda Road or Giridih in the meta description.",
          targetTab: "seo",
        });
        seoDeductions += 10;
      }
    }

    // 3. Heading Structure (H1 Check)
    const h1Elements = document.querySelectorAll("h1");
    h1Count = h1Elements.length;
    if (h1Count === 0) {
      issues.push({
        id: "seo-h1-none",
        severity: "critical",
        category: "seo",
        title: "No <h1> Heading Found",
        description: "A single <h1> tag is required for semantic HTML and web accessibility.",
        recommendation: "Add an <h1> heading defining the primary purpose of the page.",
        targetTab: "seo",
      });
      seoDeductions += 20;
    } else if (h1Count > 1) {
      issues.push({
        id: "seo-h1-multiple",
        severity: "info",
        category: "seo",
        title: "Multiple <h1> Headings Detected",
        description: `Found ${h1Count} <h1> elements. While HTML5 permits this, having exactly one primary <h1> is best practice.`,
        recommendation: "Consider reserving <h1> for the main hero headline and using <h2> for sections.",
        targetTab: "seo",
      });
      seoDeductions += 5;
    }

    // 4. Image Alt Attributes & Media Inspection
    const imgElements = document.querySelectorAll("img");
    totalImages = imgElements.length;
    let missingAltCount = 0;
    imgElements.forEach((img) => {
      const alt = img.getAttribute("alt");
      if (!alt || alt.trim().length === 0) {
        missingAltCount++;
      }
    });
    imagesWithoutAlt = missingAltCount;

    if (missingAltCount > 0) {
      issues.push({
        id: "perf-img-alt",
        severity: missingAltCount > 3 ? "critical" : "warning",
        category: "performance",
        title: `${missingAltCount} Image${missingAltCount > 1 ? "s" : ""} Missing Alt Text`,
        description: "Images without descriptive alt text harm accessibility screen-readers and image SEO.",
        recommendation: "Ensure all gallery and repair showcase photos have descriptive alt text.",
        targetTab: "showcase",
      });
      perfDeductions += Math.min(30, missingAltCount * 8);
    }

    // Check for images without lazy loading (except first 2)
    let nonLazyCount = 0;
    imgElements.forEach((img, idx) => {
      if (idx > 2 && img.getAttribute("loading") !== "lazy") {
        nonLazyCount++;
      }
    });
    if (nonLazyCount > 2) {
      issues.push({
        id: "perf-lazy-loading",
        severity: "info",
        category: "performance",
        title: "Offscreen Images Missing Lazy Loading",
        description: `${nonLazyCount} images do not have loading="lazy" specified.`,
        recommendation: "Add loading='lazy' to below-the-fold images to optimize initial page render.",
        targetTab: "feed",
      });
      perfDeductions += 10;
    }

    // 5. JSON-LD Local Schema Check
    const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
    let foundLocalBusiness = false;
    let foundPhoneInSchema = false;
    let foundAddressInSchema = false;

    jsonLdScripts.forEach((script) => {
      try {
        const parsed = JSON.parse(script.textContent || "{}");
        const list = Array.isArray(parsed) ? parsed : [parsed];
        list.forEach((item) => {
          const type = item["@type"];
          if (type) {
            const types = Array.isArray(type) ? type : [type];
            types.forEach((t) => schemaTypes.push(t));
            if (
              types.some((t) =>
                ["LocalBusiness", "ElectronicsStore", "ElectronicsRepairShop", "MobilePhoneRepairShop", "Store"].includes(t)
              )
            ) {
              foundLocalBusiness = true;
              if (item.telephone && (item.telephone.includes("8002903643") || item.telephone.includes("80029 03643"))) {
                foundPhoneInSchema = true;
              }
              const address = item.address;
              if (
                address &&
                (address.addressLocality?.toLowerCase().includes("giridih") ||
                  address.streetAddress?.toLowerCase().includes("barganda"))
              ) {
                foundAddressInSchema = true;
              }
            }
          }
        });
      } catch {
        // syntax error in JSON-LD
      }
    });

    hasLocalBusinessSchema = foundLocalBusiness;
    phoneMatchesNAP = foundPhoneInSchema;

    if (!foundLocalBusiness) {
      issues.push({
        id: "schema-localbusiness-missing",
        severity: "critical",
        category: "schema",
        title: "Missing LocalBusiness Schema",
        description: "Google Local 3-Pack and Knowledge Graph rely on structured LocalBusiness/ElectronicsRepairShop JSON-LD schema.",
        recommendation: "Ensure LocalBusiness schema is present in <head> with verified NAP.",
        targetTab: "seo",
      });
      schemaDeductions += 35;
    } else {
      if (!foundPhoneInSchema) {
        issues.push({
          id: "schema-phone-mismatch",
          severity: "warning",
          category: "schema",
          title: "Phone Number Not Verified in Schema",
          description: "NAP phone number +91 80029 03643 should be explicitly verified in the schema telephone field.",
          recommendation: "Sync phone number in JSON-LD with official shop contact.",
          targetTab: "seo",
        });
        schemaDeductions += 15;
      }
      if (!foundAddressInSchema) {
        issues.push({
          id: "schema-address-mismatch",
          severity: "warning",
          category: "schema",
          title: "Barganda Road Address Missing in Schema",
          description: "Physical street address is required for Google Maps entity reconciliation.",
          recommendation: "Check streetAddress and postalCode in LocalBusiness schema.",
          targetTab: "seo",
        });
        schemaDeductions += 15;
      }
    }

    // 6. Link & WhatsApp Protocol Health
    const anchorElements = document.querySelectorAll("a[href]");
    let insecureLinkCount = 0;

    anchorElements.forEach((a) => {
      const href = a.getAttribute("href") || "";
      if (href.startsWith("http://")) {
        insecureLinkCount++;
      } else if (href.startsWith("/") || href.includes("supertelecom.shop")) {
        internalLinks++;
      } else if (href.startsWith("https://")) {
        externalLinks++;
      }

      if (href.includes("wa.me") || href.includes("whatsapp.com")) {
        whatsAppLinks++;
      }
    });

    if (insecureLinkCount > 0) {
      issues.push({
        id: "link-insecure-http",
        severity: "critical",
        category: "links",
        title: `${insecureLinkCount} Insecure HTTP Link${insecureLinkCount > 1 ? "s" : ""} Found`,
        description: "Links pointing to insecure http:// endpoints can trigger browser security warnings.",
        recommendation: "Upgrade all external links to secure https:// URLs.",
        targetTab: "seo",
      });
      linkDeductions += insecureLinkCount * 15;
    }

    if (whatsAppLinks === 0) {
      issues.push({
        id: "link-whatsapp-missing",
        severity: "warning",
        category: "links",
        title: "No Direct WhatsApp Booking Link Found on Page",
        description: "In Giridih, over 70% of phone repair inquiries come through direct WhatsApp chats.",
        recommendation: "Verify quick WhatsApp contact buttons are enabled in Hero and Header.",
        targetTab: "announcements",
      });
      linkDeductions += 20;
    }
  }

  // Calculate scores (clamped between 15 and 100)
  const seoScore = Math.max(20, Math.min(100, 100 - seoDeductions));
  const schemaScore = Math.max(20, Math.min(100, 100 - schemaDeductions));
  const linkScore = Math.max(20, Math.min(100, 100 - linkDeductions));
  const perfScore = Math.max(20, Math.min(100, 100 - perfDeductions));

  // Overall weighted score: SEO (35%), Schema (25%), Links (20%), Performance (20%)
  const overall = Math.round(
    seoScore * 0.35 + schemaScore * 0.25 + linkScore * 0.2 + perfScore * 0.2
  );

  const report: AuditReport = {
    id: `audit-${Date.now()}`,
    created_at: new Date().toISOString(),
    scores: {
      overall,
      seo: seoScore,
      schema: schemaScore,
      links: linkScore,
      performance: perfScore,
    },
    issues,
    metrics: {
      totalImages,
      imagesWithoutAlt,
      h1Count,
      internalLinks,
      externalLinks,
      whatsAppLinks,
      schemaTypes,
      titleLength,
      descLength,
      hasGiridihInTitle,
      hasGiridihInDesc,
      hasLocalBusinessSchema,
      phoneMatchesNAP,
    },
  };

  // Persist report to Supabase audit_reports (with graceful localStorage fallback)
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(FALLBACK_AUDIT_KEY, JSON.stringify(report));

      // Append to history
      const prevHistoryRaw = localStorage.getItem(AUDIT_HISTORY_KEY);
      const prevHistory: AuditReport[] = prevHistoryRaw ? JSON.parse(prevHistoryRaw) : [];
      const updatedHistory = [report, ...prevHistory].slice(0, 10);
      localStorage.setItem(AUDIT_HISTORY_KEY, JSON.stringify(updatedHistory));
    }

    // Try Supabase insert if table exists
    const { error: dbErr } = await supabase.from("audit_reports").insert([
      {
        overall_score: report.scores.overall,
        seo_score: report.scores.seo,
        schema_score: report.scores.schema,
        link_score: report.scores.links,
        performance_score: report.scores.performance,
        issues_count: report.issues.length,
        critical_count: report.issues.filter((i) => i.severity === "critical").length,
        report_data: report,
        created_at: report.created_at,
      },
    ]);

    if (dbErr) {
      console.warn("Supabase audit_reports save notice:", dbErr.message);
    }
  } catch (saveErr) {
    console.warn("Audit report storage notice:", saveErr);
  }

  return report;
}

/**
 * Retrieves audit history from Supabase or localStorage fallback.
 */
export async function getAuditHistory(): Promise<AuditReport[]> {
  try {
    const { data, error } = await supabase
      .from("audit_reports")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    if (!error && data && data.length > 0) {
      return data.map((d: any) => d.report_data || {
        id: d.id,
        created_at: d.created_at,
        scores: {
          overall: d.overall_score,
          seo: d.seo_score,
          schema: d.schema_score,
          links: d.link_score,
          performance: d.performance_score,
        },
        issues: [],
        metrics: {},
      });
    }
  } catch {
    // Fall back to localStorage
  }

  if (typeof localStorage !== "undefined") {
    try {
      const historyRaw = localStorage.getItem(AUDIT_HISTORY_KEY);
      if (historyRaw) {
        return JSON.parse(historyRaw);
      }
      const latestRaw = localStorage.getItem(FALLBACK_AUDIT_KEY);
      if (latestRaw) {
        return [JSON.parse(latestRaw)];
      }
    } catch {
      // ignore parsing error
    }
  }

  return [];
}
