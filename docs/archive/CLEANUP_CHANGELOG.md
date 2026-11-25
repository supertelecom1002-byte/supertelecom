# CLEANUP CHANGELOG — SUPER TELECOM v2.8.0 RELEASE
**Date:** 2026-11-04  
**Project:** Super Telecom (Web + Native Android)  
**Release:** v2.8.0 (Build 28)  

---

## Complete Audit & Remediation Log

### 1. 3D Model & Interactive Teardown
- **Generated 3D GLB Model:** Created `public/models/smartphone_teardown.glb` (112,264 bytes) featuring 19 discrete named sub-assemblies (`FrontGlass`, `TouchDigitizer`, `OLEDDisplay`, `ChassisFrame`, `RearCover`, `Battery`, `Motherboard`, `ShieldCover`, `ProcessorSoC`, `PMIC`, `RearCameraModule`, `ChargingPort`, `USBPort`, `ChargingFlex`, `Loudspeaker`, `Earpiece`, `VibrationMotor`, `WirelessCoil`, `Screws`).
- **Decoupled Scroll Animations:** Refactored `src/components/three/SmartphoneTeardown3D.tsx` to read scroll progress through a mutable ref (`scrollProgressRef.current`) inside `useFrame`, eliminating state-triggered React re-renders during scrolling.
- **Narrative Scenes A–G:** Implemented 7 disassembly and reassembly story scenes with part translations along Z and Y axes.
- **Mobile Touch Preservation:** Configured CSS `touch-action: pan-y` and pointer event isolation on `OrbitControls` so vertical swipes scroll the webpage smoothly without getting trapped in 3D orbit rotation.
- **Component Callout Cards:** Added interactive cards for Screen, Battery, Motherboard, and Charging Port with pre-filled WhatsApp repair consultation links.

### 2. Native Android Navigation & Back-Stack
- **Streamlined 4-Tab Interface:** Organized application into Home, Transfer, Recover, and More.
- **Parameter Propagation:** Wired Home quick action cards to pass `TransferDirection.SEND`, `TransferDirection.RECEIVE`, and `RecoverCategory` directly to tab screens via `MainActivity.kt`.
- **Double-Back-to-Exit:** Added a 2-second debounce back press on the Home screen displaying a Toast before exiting the app. Non-home tabs back-navigate to Home.

### 3. Native Feature Hardening & Privacy
- **Wi-Fi Direct P2P Security:**
  - Removed hardcoded IP `192.168.49.1`; IP is dynamically resolved from `WifiP2pInfo`.
  - Added path traversal protection on received filenames (`File(meta.name).name` and regex sanitization).
  - Enforced file size and SHA-256 validation before invoking `MediaScannerConnection.scanFile`.
- **Honest Scoped Storage Recovery:**
  - Replaced misleading claims regarding encrypted hardware undeletes with transparent disclosures.
  - Implemented real queries across Scoped Storage MediaStore and hidden app cache directories.
  - Added Storage Access Framework file export.
- **Reactive Super Launcher:** Registered a `BroadcastReceiver` listening to `ACTION_TIME_TICK` to keep clock and date live in real-time. Added SharedPreferences theme persistence.
- **App Update Engine:** Refactored `AppUpdateManager` into a thread-safe singleton with direct JSON version checking against `public/apk-release.json`.

### 4. 100% Customer Price Removal
- Completely purged all numeric repair rates from `src/data/services.ts` and `src/data/repairServicesSiloData.ts`.
- Replaced with transparent, professional component diagnosis and consultation notices.
- Verified zero remaining `₹` symbols in either dataset.

### 5. Binary Compilation & Synchronization
- Compiled native APK via Android Gradle 8.4: `app/build/outputs/apk/debug/app-debug.apk`.
- Staged to `public/SuperTelecom.apk` (18,287,481 bytes, 17.44 MB).
- Computed SHA-256: `7c38c4551cd2f28a10c83d84491e33f54fced5eb9c9d6945e20b2366f50b814d`.
- Synchronized `public/apk-release.json` and `src/utils/apkDownloadManager.ts`.
- Verified web production build `npm run build` (Exit code 0).
