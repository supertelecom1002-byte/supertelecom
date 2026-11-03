# Super Telecom Complete Source & APK Audit Report

**Application Package:** `com.supertelecom.app`  
**Application Name:** Super Telecom  
**Current Target Version:** `v2.7.0` (Version Code: `27`)  
**Previous Audited Version:** `v2.6.0` (Version Code: `26`)  
**Distribution Channel:** `https://www.supertelecom.shop/SuperTelecom.apk`  
**Audit Date:** 2026-11-03  

---

## 1. Executive Summary

This audit establishes the definitive technical status of the Super Telecom ecosystem. The repository consists of two integrated operational environments:
1. **Native Android Source (`app/`)**: Built with Kotlin 1.9.22, Jetpack Compose 1.5.10 (BOM 2024.04.01), Material 3, Android SDK 34 (compileSdk/targetSdk 34, minSdk 24).
2. **Web & PWA Distribution (`src/`)**: Built with TypeScript, React 18, Vite, TailwindCSS, TanStack Router, deployed via Cloudflare/Vercel.

---

## 2. Source Codebase Structure

```
supertelecom-main/
├── app/                                 # Standalone Native Android Application
│   ├── build.gradle.kts                 # Application Gradle configuration (v2.7.0, build 27)
│   ├── proguard-rules.pro               # ProGuard optimization rules
│   └── src/main/
│       ├── AndroidManifest.xml          # Native Manifest: MainActivity, HomeLauncherActivity, FileProvider
│       ├── java/com/supertelecom/
│       │   ├── MainActivity.kt          # Primary application shell (4-Tab Navigation)
│       │   ├── HomeLauncherActivity.kt  # Standalone system Home Launcher Activity
│       │   ├── model/
│       │   │   ├── NavTab.kt            # 4 Tabs: HOME, TRANSFER, RECOVER, MORE
│       │   │   ├── AppItem.kt           # Installed app representation
│       │   │   ├── LauncherTheme.kt     # 4 themes: MINIMAL, IOS, PIXEL, CLASSIC
│       │   │   └── TransferModels.kt    # Transfer & Recovery state models
│       │   ├── feature/
│       │   │   ├── home/HomeScreen.kt   # Redesigned Home UI with Master Logo & 2 Hero Cards
│       │   │   ├── transfer/            # SuperTransferScreen & WifiDirectTransferManager
│       │   │   ├── recover/             # SuperRecoverScreen & StorageRecoverEngine
│       │   │   ├── launcher/            # SuperLauncherScreen & AppRepository
│       │   │   ├── more/                # MoreFeaturesScreen (Phone Mgmt, Diagnostics, Repair, Privacy)
│       │   │   └── update/              # AppUpdateManager (Cryptographic validation)
│       │   └── theme/                   # Color.kt, Theme.kt, Type.kt
│       └── res/
│           ├── drawable-nodpi/          # super_telecom_logo_master.png (1203x1000)
│           ├── drawable/                # super_telecom_logo.png, hero_repair.png
│           ├── mipmap-*/                # Adaptive launcher icons
│           ├── values/strings.xml       # Bilingual string resources
│           └── xml/file_paths.xml       # Secure FileProvider paths
├── public/
│   ├── SuperTelecom.apk                 # Distributed native APK binary
│   ├── apk-release.json                 # Distribution release manifest
│   ├── .well-known/assetlinks.json      # Digital Asset Links with debug & release fingerprints
│   └── llms.txt                         # Search engine & AI crawler reference
└── src/                                 # Web platform source code
```

---

## 3. Verified Cryptographic Signing Architecture

- **Signer Identity:** `C=US, O=Android, CN=Android Debug`
- **SHA-256 Digest:** `31:60:EE:06:AD:79:DB:96:F6:C3:C7:6E:67:3B:2C:42:EF:E2:3B:E7:E9:6C:47:F2:AD:03:D0:33:8C:A3:BE:AF`
- **Keystore Staging:** Configured in `app/build.gradle.kts` with graceful fallback to debug keystore for development while allowing production injection via `keystore.properties` or `SUPERTELECOM_KEYSTORE_PATH`.
- **Digital Asset Links:** Verified in `public/.well-known/assetlinks.json` containing the certificate fingerprint for web-to-app attribution and Android App Links validation.
