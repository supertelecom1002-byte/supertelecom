# Project Architectural Audit: Super Telecom Multi-Platform Suite

**Generated Date:** 2026-11-01  
**Project:** Super Telecom (supertelecom.shop) & Super Telecom Native Android App  
**Architecture Classification:** Dual-Platform (Full-Stack Web App + 4-Engine Native Android App)  
**Security & Compliance Standard:** Digital Personal Data Protection Act (DPDP Act 2027)

---

## 1. Executive Summary

Super Telecom is a high-performance, bilingual (English + Hindi) digital platform serving mobile repair, diagnostic tools, and native utilities. The project is split into two primary subsystems:
1. **The Web Experience (`src/`, `public/`):** A SSR & SPA platform built on TanStack Start, React 19, Vite, Nitro, and Tailwind CSS v4, delivering 16 dedicated repair service silos, 3D interactive hardware models, and live quote routing.
2. **The Native Android App (`app/`):** A 100% free, zero-ad, on-device Android application built on modern Jetpack Compose and Kotlin, featuring a 4-engine architecture:
   - **Home Engine:** System dashboard, quick tools, bilingual controls, and DPDP 2027 notice.
   - **Super Transfer:** Offline P2P Wi-Fi Direct and local hotspot chunked socket file transfer.
   - **Super Recover:** Scoped-storage and MediaStore recovery with 4-tier honest discovery.
   - **Super Launcher:** Safe custom Android home launcher with 4 instant themes and safe role fallback.

---

## 2. Web Subsystem Architecture (`src/`)

- **Framework:** TanStack Start (v1.161.4) + TanStack Router (v1.161.4).
- **Runtime & Bundler:** Vite (v8.3.0) with Nitro SSR output configured for Cloudflare Workers / Netlify / Vercel.
- **UI Stack:** React 19, Tailwind CSS v4 (`@tailwindcss/vite`), Radix UI primitives, Lucide React icons, and Three.js / `@react-three/fiber` for 3D smartphone teardown rendering.
- **Search & Generative Engine Optimization (AEO/GEO):** Dynamic `@graph` JSON-LD schemas (`Service`, `ElectronicsRepairStore`, `FAQPage`, `SoftwareApplication`), bilingual metadata, `llms.txt`, and XML sitemaps.
- **Security:** Strict HTTP headers (`X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(self)`), parameterized search, and zero-snooping data policies.

---

## 3. Android Subsystem Architecture (`app/`)

- **Language & UI:** 100% Kotlin with Jetpack Compose (Compose BOM 2024.04.01) and Material 3 design system.
- **Minimum & Target SDK:** `minSdk = 24` (Android 7.0 Nougat) for 99%+ device compatibility in India, `targetSdk = 34` (Android 14 UpsideDownCake).
- **Core Engine Modules:**
  1. `com.supertelecom.feature.home`: Central hub, storage health overview, bilingual toggle, and DPDP Act 2027 privacy notice.
  2. `com.supertelecom.feature.transfer`: Wi-Fi Direct (`WifiP2pManager`) and socket server using 64 KB memory-bounded buffers, 6-digit security PIN, QR verification, and SHA-256 integrity validation.
  3. `com.supertelecom.feature.recover`: Deep scan of MediaStore trash/pending states and Storage Access Framework (SAF) folder permissions. Classifies files into 4 realistic tiers and exports copies to user-selected destinations.
  4. `com.supertelecom.feature.launcher`: Home screen replacement adhering to `RoleManager.ROLE_HOME` standards, featuring 4 themes (*Super Minimal*, *Super iOS-Inspired*, *Super Pixel-Inspired*, *Super Classic*) and a 1-tap "Restore Default Launcher" mechanism.
- **Telemetry & Overlays:** All legacy `SYSTEM_ALERT_WINDOW` floating crosshair overlays and cyber-gaming tracking modules have been completely purged to safeguard user privacy and eliminate Play Protect warnings.

---

## 4. DPDP Act 2027 Compliance Certification

Super Telecom operates strictly under the principles of **Data Minimization and Purpose Limitation**:
- **Zero Cloud Uploads:** All file transfers remain strictly peer-to-peer over local Wi-Fi / hotspot.
- **Zero Telemetry / Analytics:** No third-party tracking SDKs (Firebase Analytics, Facebook SDK, AppsFlyer) are embedded.
- **Local Storage Only:** Diagnostic logs and recovered files reside exclusively on user-managed local storage.
- **Consent Architecture:** File transfers require explicit bilateral confirmation before receiving bytes.
