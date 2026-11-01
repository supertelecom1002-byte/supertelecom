# Repository Cleanup & Architecture Changelog

**Project:** Super Telecom  
**Audit Timestamp:** 2026-11-01  
**Author:** Principal Full-Stack & Android Systems Architect

---

## [Version 2.4.0] — 2026-11-01

### 1. Security & DPDP Act 2027 Enforcement
- **Removed Floating Overlays:** Deleted `FloatingCrosshairService.kt` and purged `android.permission.SYSTEM_ALERT_WINDOW` to eliminate Play Protect flags and prevent screen snooping risks.
- **Data Minimization:** Guaranteed zero remote telemetry, zero analytics tracking, and 100% on-device operation across all Native Android app features.
- **Privacy Notice:** Built bilingual in-app DPDP Act 2027 declaration in `HomeScreen.kt` and `/app` showcase page.

### 2. Native Android App Rebuilt (4-Engine Architecture)
- **Home Engine:** System health indicators, quick action cards, bilingual language switch (English / Hindi), and verified store contact info.
- **Super Transfer:** Chunked 64 KB buffered Wi-Fi Direct and local hotspot P2P socket transfer. Zero RAM overload on 4GB+ files. Bilateral PIN & QR consent.
- **Super Recover:** Scoped-storage MediaStore trash and SAF folder recovery engine. 4-tier honest discovery (Recoverable Original, Hidden Copies, Thumbnail Previews, External Backups) with non-destructive restoration.
- **Super Launcher:** Safe Android home launcher supporting 4 instant themes (*Super Minimal*, *Super iOS-Inspired*, *Super Pixel-Inspired*, *Super Classic*) with safe `RoleManager.ROLE_HOME` fallback button.

### 3. APK Distribution & Pipeline Fix
- **Static Asset Routing:** Corrected `public/_headers`, `public/_redirects`, and `vercel.json` to deliver `.apk` binaries directly with proper MIME type (`application/vnd.android.package-archive`).
- **Integrity Manifest:** Published `public/apk-release.json` with SHA-256 hash `3ebc895e5bb1d5080268bb61fa3454e9c3dfdabf9313307cb4a7aeab81287afc`.
- **Smart Downloader:** Implemented `src/utils/apkDownloadManager.ts` with streaming byte progress, live download speed calculation, and client-side SHA-256 validation.

### 4. Web Public Showcase & Navigation
- **All-India Public Showcase (`/app`):** Created `src/routes/app.tsx` featuring live verified download card, 4-module interactive tour, website vs app matrix, and installation guide.
- **Linked Global CTA Buttons:** Re-pointed all "Download App" buttons in Navbar, Hero, and Footer to `/app`.
- **SEO & AEO Enhancement:** Added `/app` to `public/sitemap.xml`, dynamic sitemap generator, and `public/llms.txt`.
