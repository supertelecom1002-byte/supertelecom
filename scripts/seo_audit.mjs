import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

console.log("================================================================");
console.log("  SUPER TELECOM - AUTOMATED TECHNICAL SEO & GEO AUDITOR");
console.log("  Target: supertelecom.shop (Barganda Road, Giridih 815301)");
console.log("================================================================\n");

let errors = [];
let warnings = [];
let passedChecks = 0;

function assert(condition, message) {
  if (condition) {
    passedChecks++;
    console.log(`  ✓ ${message}`);
  } else {
    errors.push(message);
    console.error(`  ✗ FAIL: ${message}`);
  }
}

function warn(condition, message) {
  if (!condition) {
    warnings.push(message);
    console.warn(`  ⚠ WARN: ${message}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. REPAIR SERVICES SILO DATA AUDIT
// ─────────────────────────────────────────────────────────────────────────────
console.log("1. AUDITING 16 REPAIR SERVICES CANONICAL DATA SILOS...");
const siloDataPath = path.join(ROOT, "src", "data", "repairServicesSiloData.ts");
assert(fs.existsSync(siloDataPath), "repairServicesSiloData.ts exists");

const siloContent = fs.readFileSync(siloDataPath, "utf-8");
const slugMatches = [...siloContent.matchAll(/slug:\s*["']([^"']+)["']/g)].map(m => m[1]);
assert(slugMatches.length >= 16, `Found ${slugMatches.length} canonical repair services (expected >= 16)`);

// Check uniqueness of canonical slugs
const uniqueSlugs = new Set(slugMatches);
assert(uniqueSlugs.size === slugMatches.length, "All canonical service slugs are unique");

// Check NAP consistency in business config
const configPath = path.join(ROOT, "src", "config", "superTelecomConfig.ts");
assert(fs.existsSync(configPath), "superTelecomConfig.ts exists");
const configContent = fs.readFileSync(configPath, "utf-8");
assert(configContent.includes("815301"), "Config contains official Giridih PIN 815301");
assert(configContent.includes("8002903643") || configContent.includes("80029 03643"), "Config contains official phone number +91 80029 03643");
assert(configContent.includes("Barganda Road"), "Config contains official Barganda Road address");
assert(configContent.includes("Shivam Clinic"), "Config references landmark 'Near Shivam Clinic'");

// ─────────────────────────────────────────────────────────────────────────────
// 2. SITEMAP.XML AUDIT
// ─────────────────────────────────────────────────────────────────────────────
console.log("\n2. AUDITING SITEMAP.XML...");
const sitemapPath = path.join(ROOT, "public", "sitemap.xml");
assert(fs.existsSync(sitemapPath), "public/sitemap.xml exists");
const sitemapContent = fs.readFileSync(sitemapPath, "utf-8");

assert(sitemapContent.includes("<loc>https://www.supertelecom.shop/</loc>"), "Sitemap includes homepage");
assert(sitemapContent.includes("<loc>https://www.supertelecom.shop/download</loc>"), "Sitemap includes official /download route");
assert(!sitemapContent.includes("<loc>https://www.supertelecom.shop/apk</loc>"), "Sitemap excludes legacy /apk redirect route");

// Ensure all 16 canonical services are listed in sitemap
for (const slug of uniqueSlugs) {
  assert(
    sitemapContent.includes(`/services/${slug}`),
    `Sitemap includes canonical service: /services/${slug}`
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. LLMS.TXT & AI DISCOVERY AUDIT
// ─────────────────────────────────────────────────────────────────────────────
console.log("\n3. AUDITING LLMS.TXT & AI DISCOVERY ENDPOINTS...");
const llmsPath = path.join(ROOT, "public", "llms.txt");
assert(fs.existsSync(llmsPath), "public/llms.txt exists");
const llmsContent = fs.readFileSync(llmsPath, "utf-8");

assert(llmsContent.includes("Super Telecom"), "llms.txt mentions Super Telecom");
assert(llmsContent.includes("Barganda Road"), "llms.txt contains Barganda Road");
assert(llmsContent.includes("Giridih"), "llms.txt contains Giridih");
assert(llmsContent.includes("80029 03643") || llmsContent.includes("8002903643"), "llms.txt contains official phone");
assert(llmsContent.includes("https://www.supertelecom.shop/download"), "llms.txt references /download");

// Verify AI text file
const aiTxtPath = path.join(ROOT, "public", ".well-known", "ai.txt");
assert(fs.existsSync(aiTxtPath), "public/.well-known/ai.txt exists");

// Verify AI json endpoints
const summaryJson = path.join(ROOT, "public", "ai", "summary.json");
const faqJson = path.join(ROOT, "public", "ai", "faq.json");
const serviceJson = path.join(ROOT, "public", "ai", "service.json");
assert(fs.existsSync(summaryJson), "public/ai/summary.json exists");
assert(fs.existsSync(faqJson), "public/ai/faq.json exists");
assert(fs.existsSync(serviceJson), "public/ai/service.json exists");

// ─────────────────────────────────────────────────────────────────────────────
// 4. ROBOTS.TXT AUDIT
// ─────────────────────────────────────────────────────────────────────────────
console.log("\n4. AUDITING ROBOTS.TXT DIRECTIVES...");
const robotsPath = path.join(ROOT, "public", "robots.txt");
assert(fs.existsSync(robotsPath), "public/robots.txt exists");
const robotsContent = fs.readFileSync(robotsPath, "utf-8");

assert(robotsContent.includes("Disallow: /admin"), "robots.txt protects /admin");
assert(robotsContent.includes("Disallow: /api/"), "robots.txt protects /api/");
assert(robotsContent.includes("User-agent: Googlebot"), "robots.txt configures Googlebot");
assert(robotsContent.includes("User-agent: GPTBot") || robotsContent.includes("OAI-SearchBot"), "robots.txt allows AI search bots");
assert(robotsContent.includes("Sitemap: https://www.supertelecom.shop/sitemap.xml"), "robots.txt links to canonical sitemap");

// ─────────────────────────────────────────────────────────────────────────────
// 5. REDIRECT HYGIENE AUDIT
// ─────────────────────────────────────────────────────────────────────────────
console.log("\n5. AUDITING REDIRECTS HYGIENE...");
const redirectsPath = path.join(ROOT, "public", "_redirects");
assert(fs.existsSync(redirectsPath), "public/_redirects exists");
const redirectsContent = fs.readFileSync(redirectsPath, "utf-8");

assert(redirectsContent.includes("/apk                    /download               301"), "/_redirects directs /apk -> /download 301");
assert(!redirectsContent.includes("/download /app"), "/_redirects does NOT redirect /download -> /app");
assert(redirectsContent.includes("/services/display-replacement-giridih                /services/screen-display-replacement       301"), "/_redirects fixes legacy display route directly to canonical silo");
assert(redirectsContent.includes("/services/network-repair"), "/_redirects includes /services/network-repair canonical 301");

// Vercel redirects
const vercelPath = path.join(ROOT, "vercel.json");
assert(fs.existsSync(vercelPath), "vercel.json exists");
const vercelConfig = JSON.parse(fs.readFileSync(vercelPath, "utf-8"));
const vercelRedirects = vercelConfig.redirects || [];
const hasApkRedirect = vercelRedirects.some(r => r.source === "/apk" && r.destination === "/download");
assert(hasApkRedirect, "vercel.json has 301 redirect for /apk -> /download");

// ─────────────────────────────────────────────────────────────────────────────
// 6. ASSET PERFORMANCE & COMPRESSION CONSTRAINTS
// ─────────────────────────────────────────────────────────────────────────────
console.log("\n6. AUDITING IMAGE ASSET CONSTRAINTS (<200KB)...");
const assetsToCheck = [
  { path: path.join(ROOT, "public", "logo.png"), maxKb: 200 },
  { path: path.join(ROOT, "public", "logo.webp"), maxKb: 100 },
  { path: path.join(ROOT, "public", "favicon.png"), maxKb: 50 },
  { path: path.join(ROOT, "public", "og-image.png"), maxKb: 200 },
  { path: path.join(ROOT, "public", "og-image.webp"), maxKb: 100 },
  { path: path.join(ROOT, "public", "super-telecom-logo.png"), maxKb: 200 },
  { path: path.join(ROOT, "src", "assets", "hero-repair.webp"), maxKb: 200 },
];

for (const asset of assetsToCheck) {
  if (fs.existsSync(asset.path)) {
    const stats = fs.statSync(asset.path);
    const sizeKb = stats.size / 1024;
    assert(sizeKb <= asset.maxKb, `${path.relative(ROOT, asset.path)} size ${sizeKb.toFixed(1)}KB <= ${asset.maxKb}KB`);
  } else {
    warn(false, `${path.relative(ROOT, asset.path)} does not exist`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SUMMARY
// ─────────────────────────────────────────────────────────────────────────────
console.log("\n================================================================");
console.log(`  AUDIT COMPLETE: ${passedChecks} checks passed.`);
if (warnings.length > 0) {
  console.log(`  Warnings: ${warnings.length}`);
  warnings.forEach(w => console.log(`   - ${w}`));
}
if (errors.length > 0) {
  console.log(`  ERRORS: ${errors.length}`);
  errors.forEach(e => console.error(`   ✗ ${e}`));
  process.exit(1);
} else {
  console.log("  ALL CRITICAL TECHNICAL SEO & GEO REQUIREMENTS PASSED (100%)");
  console.log("================================================================\n");
  process.exit(0);
}
