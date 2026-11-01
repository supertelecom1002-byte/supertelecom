# File Inventory & Directory Structure Audit

**Project:** Super Telecom  
**Audit Timestamp:** 2026-11-01  
**Scope:** `src/`, `public/`, `app/`, configuration and documentation files.

---

## 1. Web Application (`src/`)

```
src/
├── assets/                          # Static assets and JSON descriptors
├── components/                      # Reusable React components
│   ├── interactive/                 # Interactive UI widgets (BeforeAfterSlider, 3D Teardown)
│   ├── repair/                      # VisualFaultFinder and diagnostic helpers
│   ├── seo/                         # Schema engines (LocalSeoSchema, ServicePageSeo)
│   ├── three/                       # SmartphoneTeardown3D and 3D canvas utilities
│   ├── ui/                          # Radix UI + Tailwind design components
│   ├── BrandLogo.tsx                # SVG / WebP Brand logo
│   ├── SiteFooter.tsx               # Global footer with bilingual contact & hours
│   └── SiteHeader.tsx               # Global navigation bar with quick links
├── config/                          # Business constants (superTelecomConfig.ts)
├── data/                            # Type-safe datasets
│   ├── repairServicesSiloData.ts    # 16 dedicated mobile repair services
│   ├── services.ts                  # Service overview data
│   └── site.ts                      # Canonical URLs, phone, coordinates
├── hooks/                           # Custom React hooks (useIsStandalone, useOnlineStatus)
├── routes/                          # TanStack Router route definitions
│   ├── index.tsx                    # Landing page with 3D teardown, hero, reviews, 16 services
│   ├── app.tsx                      # All-India Public App Showcase & Download Page (/app)
│   ├── apk.tsx                      # Direct browser APK download endpoint (/apk)
│   ├── download.tsx                 # Legacy APK download page with auto-redirect to /app
│   ├── services.index.tsx           # All 16 mobile repair services catalog (/services)
│   ├── services.$slug.tsx           # Dedicated single-service silo route (/services/:slug)
│   ├── sitemap.tsx                  # HTML sitemap page
│   └── sitemap[.]xml.ts             # Dynamic XML sitemap generator
└── utils/                           # Client utilities
    ├── apkDownloadManager.ts        # Smart APK downloader with progress & SHA-256 verification
    ├── safeVibrate.ts               # Haptic feedback utility with browser guard
    └── utils.ts                     # Tailwind class merging (clsx + twMerge)
```

---

## 2. Public Static Assets (`public/`)

```
public/
├── .well-known/                     # Digital Asset Links for Android App Linking
├── _headers                         # Production HTTP security and MIME headers
├── _redirects                       # URL rewrites and 301 redirects
├── apk-release.json                 # Signed APK release metadata, checksum, and changelog
├── SuperTelecom.apk                 # Production Android APK binary (v2.4.0, 1.69 MB)
├── favicon.ico / favicon.png        # Brand favicons
├── icon-192.png / icon-512.png      # PWA application icons
├── llms.txt                         # Structured markdown knowledgebase for LLMs and search engines
├── manifest.json                    # Web App Manifest
├── robots.txt                       # Crawler directives
└── sitemap.xml                      # Canonical XML sitemap covering all 16 services + /app
```

---

## 3. Android Application (`app/`)

```
app/
├── build.gradle.kts                 # Application-level Gradle build configuration
├── proguard-rules.pro               # ProGuard / R8 code shrinking rules
└── src/main/
    ├── AndroidManifest.xml          # Cleaned manifest (Zero crosshairs, P2P & Home filters)
    ├── java/com/supertelecom/       # Modular 4-Engine Kotlin package
    │   ├── MainActivity.kt          # 4-tab bottom navigation with bilingual state & DPDP notice
    │   ├── model/                   # Data models (NavTab, TransferItem, RecoverItem, Theme)
    │   ├── feature/
    │   │   ├── home/                # Home dashboard and DPDP Act 2027 dialog
    │   │   ├── transfer/            # Super Transfer (Wi-Fi Direct, socket streaming, QR pair)
    │   │   ├── recover/             # Super Recover (MediaStore + SAF 4-tier honest recovery)
    │   │   └── launcher/            # Super Launcher (4 themes, app drawer, RoleManager restore)
    │   └── theme/                   # Material 3 Color, Typography, and Theme definition
    └── res/                         # Android XML resources (strings.xml, icons, themes.xml)
```
