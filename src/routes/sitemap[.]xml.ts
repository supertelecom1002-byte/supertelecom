import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { SERVICES } from "@/data/services";
import { POSTS } from "@/data/blog";
import { SITE_URL } from "@/data/site";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries = [
          { path: "/", changefreq: "weekly", priority: "1.0", lastmod: "2026-09-14" },
          { path: "/pricing", changefreq: "monthly", priority: "0.8" },
          { path: "/services", changefreq: "monthly", priority: "0.8" },
          { path: "/blog", changefreq: "weekly", priority: "0.7" },
          { path: "/sitemap", changefreq: "monthly", priority: "0.3" },
          { path: "/cookie-policy", changefreq: "yearly", priority: "0.3" },


          ...SERVICES.map((s) => ({
            path: `/services/${s.slug}`,
            changefreq: "monthly",
            priority: "0.9",
          })),
          ...POSTS.map((p) => ({
            path: `/blog/${p.slug}`,
            changefreq: "monthly",
            priority: "0.6",
            lastmod: p.date,
          })),
        ];
        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${SITE_URL}${e.path}</loc>`,
            (e as any).lastmod ? `    <lastmod>${(e as any).lastmod}</lastmod>` : null,
            `    <changefreq>${e.changefreq}</changefreq>`,
            `    <priority>${e.priority}</priority>`,
            `  </url>`,
          ].filter(Boolean).join("\n"),
        );
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
