# SUPER TELECOM — APK RELEASE & DISTRIBUTION AUDIT (PHASE 1)
**Binary:** `public/SuperTelecom.apk`  
**Metadata:** `public/apk-release.json`  
**Target Release:** `v2.8.0` (Version Code `28`)  
**Package:** `com.supertelecom.app`  
**Date:** November 2026

---

## 1. Distribution Pipeline Analysis

### 1.1 Web Distribution Endpoints
- **Primary Endpoint:** `https://www.supertelecom.shop/SuperTelecom.apk`
- **Metadata Feed:** `https://www.supertelecom.shop/apk-release.json`
- **Download Hub:** `https://www.supertelecom.shop/download`
- **Alternative Alias:** `https://www.supertelecom.shop/apk`

### 1.2 Binary Verification Audit
- **Current Version in Source:** `2.7.0` (Build `27`)
- **Required Version:** Increment to `2.8.0` (Build `28`)
- **Integrity Requirement:**
  - The APK must be compiled natively from Kotlin/Compose source in `app/`.
  - The binary must be signed with the Android release keystore.
  - The exact byte size and cryptographic SHA-256 hash must be computed from the output file on disk.
  - `public/apk-release.json` and `src/utils/apkDownloadManager.ts` must be synchronously updated with the new hash and size.
  - No dummy or placeholder APK files may be distributed.

---

## 2. In-App Auto-Update Mechanism
- **Verification Flow in `AppUpdateManager.kt`:**
  1. App queries `https://www.supertelecom.shop/apk-release.json` via HTTPS.
  2. Compares `versionCode` in JSON against `BuildConfig.VERSION_CODE`.
  3. If remote `versionCode > local`, an update dialog/banner is presented.
  4. Upon user confirmation, the APK is downloaded into private cache storage.
  5. The downloaded file's SHA-256 checksum is computed and compared strictly with `apk-release.json`.
  6. If the checksum matches, an `ACTION_VIEW` intent with `application/vnd.android.package-archive` and `FileProvider` URI is dispatched to trigger the Android Package Installer.
  7. If the checksum fails, the downloaded file is discarded and an error is shown.
