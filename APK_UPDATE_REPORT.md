# APK UPDATE REPORT — SUPER TELECOM v2.8.0 RELEASE
**Date:** 2026-11-04  
**App:** Super Telecom (`com.supertelecom.app`)  
**Updater Engine:** `AppUpdateManager.kt`  
**Distribution Server:** https://www.supertelecom.shop/apk-release.json  

---

## 1. Update Architecture

The in-app updater operates through a thread-safe singleton `AppUpdateManager.getInstance(context)` to manage update lifecycles across application screens:

```
[App Launch / Settings Screen]
               │
               ▼
   [Fetch apk-release.json]
               │
               ├──> [Compare Remote versionCode (28) > Local versionCode (28)]
               │         │
               │         ├── False: Show "App is up to date (v2.8.0)"
               │         │
               │         └── True: Show Update Banner with Release Notes
               ▼
    [User Taps "Update Now"]
               │
               ▼
[Download APK via DownloadManager / URLStream to Cache]
               │
               ▼
  [Verify SHA-256 Checksum]
               │
               ▼
 [Trigger FileProvider Intent ACTION_VIEW (package-archive)]
               │
               ▼
  [Android Native Package Installer Prompts User to Update]
```

---

## 2. Release Endpoint Specifications

- **Endpoint URL:** `https://www.supertelecom.shop/apk-release.json`
- **Payload Schema:**
```json
{
  "appName": "Super Telecom",
  "versionName": "2.8.0",
  "versionCode": 28,
  "packageId": "com.supertelecom.app",
  "minSdk": 24,
  "targetSdk": 34,
  "fileSize": 18287481,
  "fileSizeHuman": "17.44 MB",
  "releaseDate": "2026-11-04",
  "sha256": "7c38c4551cd2f28a10c83d84491e33f54fced5eb9c9d6945e20b2366f50b814d",
  "downloadUrl": "/SuperTelecom.apk",
  "downloadFilename": "SuperTelecom-Release.apk",
  "architecture": "universal (arm64-v8a, armeabi-v7a, x86_64)",
  "compliance": "Privacy & Your Data"
}
```

---

## 3. QA Testing

- **Current Version Check:** Returns `isUpdateAvailable = false` when tested on build code 28.
- **Simulated Lower Version:** When tested with local code set to 27, prompts update dialog with "v2.8.0 available" and initiates progress-tracked download.
- **FileProvider Security:** `file_paths.xml` grants access strictly to `cache-path name="apk_downloads" path="."`.
