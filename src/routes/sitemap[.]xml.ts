import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { REPAIR_SERVICES_SILO_DATA, STORE_RETAIL_SERVICES } from "@/data/repairServicesSiloData";
import { BRANDS } from "@/data/brands";
import { POSTS } from "@/data/blog";
import { SITE_URL } from "@/data/site";

interface SitemapEntry {
  path: string;
  changefreq: string;
  priority: string;
  lastmod?: string;
}

const CANONICAL_DATE = "2026-11-25";

export function buildSitemapXml(): string {
  const rawEntries: SitemapEntry[] = [
    { path: "/", changefreq: "daily", priority: "1.0", lastmod: CANONICAL_DATE },
    { path: "/download", changefreq: "daily", priority: "0.95", lastmod: CANONICAL_DATE },
    { path: "/smartfinder", changefreq: "daily", priority: "0.95", lastmod: CANONICAL_DATE },
    { path: "/locations/barganda-road-mobile-repair", changefreq: "weekly", priority: "0.95", lastmod: CANONICAL_DATE },
    { path: "/services", changefreq: "weekly", priority: "0.9", lastmod: CANONICAL_DATE },
    { path: "/tools", changefreq: "weekly", priority: "0.9", lastmod: CANONICAL_DATE },
    { path: "/pricing", changefreq: "weekly", priority: "0.85", lastmod: CANONICAL_DATE },
    { path: "/brands", changefreq: "weekly", priority: "0.85", lastmod: CANONICAL_DATE },
    { path: "/track", changefreq: "weekly", priority: "0.85", lastmod: CANONICAL_DATE },
    { path: "/about", changefreq: "monthly", priority: "0.8", lastmod: CANONICAL_DATE },
    { path: "/blog", changefreq: "weekly", priority: "0.75", lastmod: CANONICAL_DATE },
    { path: "/warranty", changefreq: "monthly", priority: "0.7", lastmod: CANONICAL_DATE },
    { path: "/privacy", changefreq: "monthly", priority: "0.5", lastmod: CANONICAL_DATE },
    { path: "/terms", changefreq: "monthly", priority: "0.5", lastmod: CANONICAL_DATE },
    { path: "/sitemap", changefreq: "monthly", priority: "0.4", lastmod: CANONICAL_DATE },
    { path: "/cookie-policy", changefreq: "yearly", priority: "0.3", lastmod: CANONICAL_DATE },

    // 16 Canonical Single-Service Landing Pages
    ...REPAIR_SERVICES_SILO_DATA.map((s) => ({
      path: `/services/${s.slug}`,
      changefreq: "weekly",
      priority: "0.9",
      lastmod: CANONICAL_DATE,
    })),

    // Store Retail Catalog Offerings
    ...STORE_RETAIL_SERVICES.map((s) => ({
      path: `/services/${s.slug}`,
      changefreq: "weekly",
      priority: s.slug === "second-hand-mobile" ? "0.85" : "0.8",
      lastmod: CANONICAL_DATE,
    })),

    // Brand Hubs
    ...BRANDS.map((b) => ({
      path: `/brands/${b.slug}`,
      changefreq: "weekly",
      priority: "0.85",
      lastmod: CANONICAL_DATE,
    })),

    // Blog Guides
    ...POSTS.map((p) => ({
      path: `/blog/${p.slug}`,
      changefreq: "monthly",
      priority: "0.7",
      lastmod: CANONICAL_DATE,
    })),
  ];

  // Strictly deduplicate by normalized path & never emit redirected/admin URLs
  const seenPaths = new Set<string>();
  const deduplicatedEntries: SitemapEntry[] = [];

  for (const entry of rawEntries) {
    const normalizedPath = entry.path.toLowerCase().replace(/\/+$/, "") || "/";
    if (
      normalizedPath === "/app" ||
      normalizedPath === "/apk" ||
      normalizedPath.startsWith("/admin") ||
      normalizedPath.endsWith("-giridih")
    ) {
      continue;
    }
    if (!seenPaths.has(normalizedPath)) {
      seenPaths.add(normalizedPath);
      deduplicatedEntries.push({ ...entry, path: normalizedPath });
    }
  }

  const urls = deduplicatedEntries.map((e) =>
    [
      `  <url>`,
      `    <loc>${SITE_URL}${e.path === "/" ? "/" : e.path}</loc>`,
      e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
      `    <changefreq>${e.changefreq}</changefreq>`,
      `    <priority>${e.priority}</priority>`,
      `  </url>`,
    ].filter(Boolean).join("\n"),
  );

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const xml = buildSitemapXml();
        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=3600",
          },
        });
      },
    },
  },
});
