# SUPER TELECOM — ANDROID NATIVE APPLICATION AUDIT & BUG REPORT (PHASE 1)
**Package:** `com.supertelecom.app`  
**Current Source Version:** `2.7.0` (Build `27`)  
**Target Release Version:** `2.8.0` (Build `28`)  
**Architecture:** Standalone Native Android (Kotlin + Jetpack Compose)  
**Date:** November 2026

---

## 1. Identified Issues & Bug Inventory

### Bug AND-01: Back Button Event Trapping on Home Screen
- **Location:** `app/src/main/java/com/supertelecom/MainActivity.kt`
- **Severity:** High
- **Description:** `BackHandler` inside `MainActivity.kt` was set to consume the Back press event unconditionally when `currentTab == NavTab.HOME`, effectively preventing the user from closing or exiting the application via the system Back button or gesture.
- **Remediation:** Implement standard Android double-back-to-exit pattern on `NavTab.HOME`. On first back press, display a non-intrusive Toast ("Press back again to exit"); if pressed again within 2,000 milliseconds, invoke `finish()` to exit smoothly. If on another tab, back press navigates back to `NavTab.HOME`.

### Bug AND-02: Missing Navigation Parameter Propagation
- **Location:** `app/src/main/java/com/supertelecom/feature/home/HomeScreen.kt` & `MainActivity.kt`
- **Severity:** High
- **Description:**
  1. The "SEND FILES" and "RECEIVE FILES" action buttons on `HomeScreen` simply called `onNavigate(NavTab.TRANSFER)` without passing the required initial transfer mode (`TransferMode.SEND` vs `TransferMode.RECEIVE`), requiring the user to tap again on the transfer tab.
  2. The recovery quick shortcuts ("Photos", "Videos", "Audio", "Documents") merely opened `NavTab.RECOVER` without pre-selecting the target category or triggering the relevant scan filter.
- **Remediation:** Introduce typed navigation intents and state holders (`initialTransferMode: TransferMode?`, `initialRecoverCategory: RecoverCategory?`) passed from `HomeScreen` into `MainActivity` and forwarded directly into `SuperTransferScreen` and `SuperRecoverScreen`.

### Bug AND-03: Hardcoded Wi-Fi Direct Group Owner IP
- **Location:** `app/src/main/java/com/supertelecom/feature/transfer/WifiDirectTransferManager.kt`
- **Severity:** High
- **Description:** `WifiDirectTransferManager` contained a fallback IP string `"192.168.49.1"`. In standard Wi-Fi P2P (Wi-Fi Direct), while the default Android group owner often adopts `192.168.49.1`, non-standard OEM implementations (Samsung OneUI, Xiaomi HyperOS, MediaTek chipsets) may negotiate alternate IP subnets. Connecting blindly to a hardcoded string can result in `SocketTimeoutException` or `ConnectException`.
- **Remediation:** Dynamically extract the Group Owner IP address from the verified `WifiP2pInfo.groupOwnerAddress.hostAddress` upon `WIFI_P2P_CONNECTION_CHANGED_ACTION`. If group info is unresolved, suspend socket establishment until the connection callback provides valid network topology.

### Bug AND-04: Path Traversal Vulnerability in Incoming Transfer Payload
- **Location:** `app/src/main/java/com/supertelecom/feature/transfer/WifiDirectTransferManager.kt`
- **Severity:** Critical
- **Description:** Incoming transfer manifests contain the filename specified by the sending peer. If a malicious or corrupted sender emits a relative path such as `../../evil.dex`, a naive `File(destDir, receivedFileName)` could overwrite arbitrary application storage or system-accessible directories.
- **Remediation:** Implement rigorous filename sanitization:
  ```kotlin
  val safeFileName = File(incomingManifest.fileName).name
      .replace(Regex("[^a-zA-Z0-9._-]"), "_")
  val targetFile = File(destinationDirectory, safeFileName).canonicalFile
  require(targetFile.parentFile == destinationDirectory.canonicalFile) { "Path traversal attempt detected" }
  ```

### Bug AND-05: Missing Mandatory SHA-256 Checksum Enforcement
- **Location:** `app/src/main/java/com/supertelecom/feature/transfer/WifiDirectTransferManager.kt`
- **Severity:** High
- **Description:** During file reception, if the computed SHA-256 digest failed or returned empty due to an I/O exception, the file was marked as received successfully with an empty checksum.
- **Remediation:** Mandate cryptographic verification. If the sender supplies a SHA-256 hash in the manifest, the receiver must calculate the SHA-256 of the received bytes on disk and compare with `MessageDigest.isEqual`. If hashes do not match or computation fails, the transfer MUST be flagged as `FAILED_CORRUPT` and the incomplete file deleted.

### Bug AND-06: Storage Recover MediaStore & User Disclosures
- **Location:** `app/src/main/java/com/supertelecom/feature/recover/StorageRecoverEngine.kt`
- **Severity:** Medium
- **Description:** On modern Android devices (API 30+ Scoped Storage), deleted files whose blocks have been TRIMmed or zeroed cannot be retrieved without root access and raw block device access. Claiming "100% undelete of wiped photos" without honest technical disclosure misleads users. Additionally, creating zero-byte dummy files when recovering creates file-system clutter.
- **Remediation:**
  1. Clearly disclose in the UI: "Super Telecom deep scans accessible cache, app data remnants, and MediaStore trash indexes. Files erased with secure overwrite or flash TRIM cannot be recovered due to hardware encryption."
  2. Implement genuine binary recovery: query MediaStore's `IS_TRASHED`, accessible application cache directories (`context.cacheDir`, `externalCacheDir`), and SAF volumes, streaming valid binary bytes into `Pictures/SuperRecovered` and notifying `MediaScannerConnection`.

### Bug AND-07: Launcher Clock & Date Lifecycle Broadcasts
- **Location:** `app/src/main/java/com/supertelecom/feature/launcher/SuperLauncherScreen.kt` & `HomeLauncherActivity.kt`
- **Severity:** Medium
- **Description:** The digital clock widget in the CyberOS launcher initialized with the system time upon composition but lacked a registered `BroadcastReceiver` for `Intent.ACTION_TIME_TICK`, `ACTION_TIME_CHANGED`, and `ACTION_TIMEZONE_CHANGED`. As a result, the clock could freeze while the launcher was active.
- **Remediation:** Register a lifecycle-aware `DisposableEffect` with a `BroadcastReceiver` listening to `ACTION_TIME_TICK`, updating state reactively every minute.

### Bug AND-08: AppUpdateManager State Lifecycle
- **Location:** `app/src/main/java/com/supertelecom/feature/home/HomeScreen.kt` & `MoreFeaturesScreen.kt`
- **Severity:** Medium
- **Description:** Both screens instantiated independent instances of `AppUpdateManager`, resulting in duplicate HTTP requests to `apk-release.json` and fragmented state.
- **Remediation:** Pass a unified, application-scoped `AppUpdateManager` instance from `MainActivity` down to child composables.
