# Repository Cleanup & Architecture Changelog

**Project:** Super Telecom  
**Audit Timestamp:** 2026-11-02  
**Author:** Principal Full-Stack & Android Systems Architect  

---

## [Version 2.5.0] — 2026-11-02

### 1. Web Stale-Cache Resolution & Production Crash Fix
- **Service Worker v4.0:** Bumped cache bucket to `supertelecom-offline-v4.0` in `public/sw.js` with automatic deletion of outdated cache buckets (`v3.4`, etc.).
- **Self-Healing Error Component:** Updated `src/routes/__root.tsx` Root ErrorComponent to detect stale chunk reference errors (`inView is not defined`, dynamic chunk load failures) and automatically clear CacheStorage and reload. Added high-visibility "Refresh & Update / नया वर्शन लोड करें" manual recovery button.
- **Service Worker Bypass:** Added explicit bypass in `public/sw.js` for `.apk` binaries and `/download/android` to prevent browser quota exhaustion.

### 2. Standalone HomeLauncherActivity Separation
- **Activity Separation:** Created dedicated `HomeLauncherActivity.kt` declared with `android.intent.category.HOME` and `android.intent.category.DEFAULT` while leaving `MainActivity.kt` strictly as the dashboard (`android.intent.category.LAUNCHER`).
- **Dynamic Clock Ticker:** Integrated `BroadcastReceiver` listening to `ACTION_TIME_TICK`, `ACTION_TIME_CHANGED`, `ACTION_TIMEZONE_CHANGED`.
- **Role Manager & Settings:** Retained 1-tap "Restore Original Launcher" (`Settings.ACTION_HOME_SETTINGS`) and persistent theme selection.

### 3. Android SDK 36 Upgrade & Scoped Storage Hardening
- **Target & Compile SDK 36:** Upgraded `app/build.gradle.kts` to `compileSdk = 36`, `targetSdk = 36`, `versionCode = 25`, `versionName = "2.5.0"`.
- **Permissions Audit:** Declared contextual permissions in `AndroidManifest.xml` (`NEARBY_WIFI_DEVICES`, `READ_MEDIA_IMAGES`, `READ_MEDIA_VIDEO`, `READ_MEDIA_AUDIO`, `READ_MEDIA_VISUAL_USER_SELECTED`, `POST_NOTIFICATIONS`) and removed legacy storage bypasses.
- **Gradle Wrapper Restoration:** Restored complete Gradle wrapper scripts (`gradlew`, `gradlew.bat`, `gradle/wrapper/gradle-wrapper.jar`).

### 4. Direct Binary Distribution & Cryptographic Quarantine
- **Direct Route `/download/android`:** Added explicit server redirects and rewrites in `public/_redirects`, `public/_headers`, and `vercel.json` routing directly to `/SuperTelecom.apk` with `application/vnd.android.package-archive`.
- **Cryptographic Pre-Save Quarantine:** Hardened `src/utils/apkDownloadManager.ts` to compute SHA-256 before invoking file saving; any checksum mismatch aborts the download and prevents unverified binaries from reaching the user's filesystem.
- **Asset Links Verification:** Updated `public/.well-known/assetlinks.json` to link `com.supertelecom.app`.

---

## [Version 2.4.0] — 2026-11-01

### 1. Security & DPDP Act 2027 Enforcement
- **Removed Floating Overlays:** Deleted `FloatingCrosshairService.kt` and purged `android.permission.SYSTEM_ALERT_WINDOW` to eliminate Play Protect flags and prevent screen snooping risks.
- **Data Minimization:** Guaranteed zero remote telemetry, zero analytics tracking, and 100% on-device operation across all Native Android app features.
- **Privacy Notice:** Built bilingual in-app DPDP Act 2027 declaration in `HomeScreen.kt` and `/app` showcase page.

### 2. Native Android App Rebuilt (4-Engine Architecture)
- **Home Engine:** System health indicators, quick action cards, bilingual language switch (English / Hindi), and verified store contact info.
- **Super Transfer:** Chunked 64 KB buffered Wi-Fi Direct and local hotspot P2P socket transfer. Zero RAM overload on 4GB+ files. Bilateral PIN & QR consent.
- **Super Recover:** Scoped-storage MediaStore trash and SAF folder recovery engine. 7-category honest discovery with non-destructive restoration.
- **Super Launcher:** Safe Android home launcher supporting 4 instant themes (*Super Minimal*, *Super iOS-Inspired*, *Super Pixel-Inspired*, *Super Classic*) with safe `RoleManager.ROLE_HOME` fallback button.

### 3. APK Distribution & Pipeline Fix
- **Static Asset Routing:** Corrected `public/_headers`, `public/_redirects`, and `vercel.json` to deliver `.apk` binaries directly with proper MIME type (`application/vnd.android.package-archive`).
- **Integrity Manifest:** Published `public/apk-release.json` with SHA-256 hash `3ebc895e5bb1d5080268bb61fa3454e9c3dfdabf9313307cb4a7aeab81287afc`.
- **Smart Downloader:** Implemented `src/utils/apkDownloadManager.ts` with streaming byte progress, live download speed calculation, and client-side SHA-256 validation.

### 4. Web Public Showcase & Navigation
- **All-India Public Showcase (`/app`):** Created `src/routes/app.tsx` featuring live verified download card, 4-module interactive tour, website vs app matrix, and installation guide.
- **Linked Global CTA Buttons:** Re-pointed all "Download App" buttons in Navbar, Hero, and Footer to `/app`.
- **SEO & AEO Enhancement:** Added `/app` to `public/sitemap.xml`, dynamic sitemap generator, and `public/llms.txt`.
