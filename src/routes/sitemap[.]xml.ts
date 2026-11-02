import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { SERVICES } from "@/data/services";
import { REPAIR_SERVICES_SILO_DATA } from "@/data/repairServicesSiloData";
import { BRANDS } from "@/data/brands";
import { POSTS } from "@/data/blog";
import { SITE_URL } from "@/data/site";

interface SitemapEntry {
  path: string;
  changefreq: string;
  priority: string;
  lastmod?: string;
}

export function buildSitemapXml(): string {
  const rawEntries: SitemapEntry[] = [
    { path: "/", changefreq: "weekly", priority: "1.0", lastmod: "2026-11-02" },
    { path: "/app", changefreq: "weekly", priority: "0.9", lastmod: "2026-11-02" },
    { path: "/pricing", changefreq: "monthly", priority: "0.8", lastmod: "2026-10-28" },
    { path: "/services", changefreq: "weekly", priority: "0.85", lastmod: "2026-11-02" },
    { path: "/brands", changefreq: "monthly", priority: "0.8", lastmod: "2026-10-20" },
    { path: "/blog", changefreq: "weekly", priority: "0.7", lastmod: "2026-10-25" },
    { path: "/about", changefreq: "monthly", priority: "0.8", lastmod: "2026-10-15" },
    { path: "/tools", changefreq: "weekly", priority: "0.85", lastmod: "2026-11-01" },
    { path: "/track", changefreq: "weekly", priority: "0.85", lastmod: "2026-10-28" },
    { path: "/privacy", changefreq: "monthly", priority: "0.5", lastmod: "2026-10-15" },
    { path: "/terms", changefreq: "monthly", priority: "0.5", lastmod: "2026-10-15" },
    { path: "/warranty", changefreq: "monthly", priority: "0.7", lastmod: "2026-10-20" },
    { path: "/sitemap", changefreq: "monthly", priority: "0.3", lastmod: "2026-11-02" },
    { path: "/cookie-policy", changefreq: "yearly", priority: "0.3", lastmod: "2026-10-15" },
    { path: "/locations/barganda-road-mobile-repair", changefreq: "weekly", priority: "0.9", lastmod: "2026-10-25" },

    // 16 Modern Dedicated Repair Silo pages (Highest priority service pages)
    ...REPAIR_SERVICES_SILO_DATA.map((s) => ({
      path: `/services/${s.slug}`,
      changefreq: "weekly",
      priority: "0.9",
      lastmod: "2026-11-02",
    })),

    // Legacy Service URLs (only included if not already covered by silo pages)
    ...SERVICES.map((s) => ({
      path: `/services/${s.slug}`,
      changefreq: "monthly",
      priority: "0.8",
      lastmod: "2026-10-20",
    })),

    // Brand Hubs
    ...BRANDS.map((b) => ({
      path: `/brands/${b.slug}`,
      changefreq: "monthly",
      priority: "0.8",
      lastmod: "2026-10-20",
    })),

    // Blog Guides
    ...POSTS.map((p) => ({
      path: `/blog/${p.slug}`,
      changefreq: "monthly",
      priority: "0.6",
      lastmod: p.date,
    })),
  ];

  // Strictly deduplicate by normalized path
  const seenPaths = new Set<string>();
  const deduplicatedEntries: SitemapEntry[] = [];

  for (const entry of rawEntries) {
    const normalizedPath = entry.path.toLowerCase().replace(/\/+$/, "") || "/";
    if (!seenPaths.has(normalizedPath)) {
      seenPaths.add(normalizedPath);
      deduplicatedEntries.push({ ...entry, path: normalizedPath });
    }
  }

  const urls = deduplicatedEntries.map((e) =>
    [
      `  <url>`,
      `    <loc>${SITE_URL}${e.path === "/" ? "" : e.path}</loc>`,
      e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
      `    <changefreq>${e.changefreq}</changefreq>`,
      `    <priority>${e.priority}</priority>`,
      `  </url>`,
    ].filter(Boolean).join("\n"),
  );

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;
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
