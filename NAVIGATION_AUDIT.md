# SUPER TELECOM — NAVIGATION & ROUTING AUDIT (PHASE 1)
**Scope:** Website (React Router / TanStack) & Native Android (Jetpack Compose Navigation)  
**Date:** November 2026

---

## 1. Website Routing Architecture (38 Endpoints)

| Route Path | Type | Purpose | Audit Status | Action Taken |
| :--- | :--- | :--- | :--- | :--- |
| `/` | Page | Primary Landing Page (Teardown, Features, Trust) | Valid | Integrated responsive 3D mobile container |
| `/download` | Page | Primary APK Download & Checksum Hub | Valid | Standardized as single source of truth |
| `/apk` | Page | Legacy APK Download Alias | Redundant | Re-aligned to share identical state with `/download` |
| `/app` | Page | Web PWA View / Native App Bridge | Valid | Updated banner directing Android users to Native APK |
| `/services/*` | Silos | Hardware & Software Repair Services | Valid | Purged numeric pricing; wired consultation dialogs |
| `/repair/*` | Silos | Specific Repair Silo Landing Pages | Valid | All actions trigger WhatsApp / Call / Form consultation |
| `/location/*` | Pages | Giridih Local Store Directions & Map | Valid | Verified against Google Business Profile |
| `/privacy`, `/terms` | Legal | Compliance, Privacy Notice & Disclosures | Valid | Clarified on-device processing and data practices |

---

## 2. Native Android Navigation Architecture

### Current Tab System (`NavTab.kt`)
1. `NavTab.HOME`: Central dashboard, device health overview, quick actions, update banner.
2. `NavTab.TRANSFER`: Wi-Fi Direct P2P file sender and receiver.
3. `NavTab.RECOVER`: Deep storage and MediaStore remnant recovery engine.
4. `NavTab.LAUNCHER`: CyberOS custom home screen and launcher.
5. `NavTab.MORE`: Diagnostic tools, battery health, sensor testing, repair tracker.

### Navigation Deficiencies Identified
1. **Shortcut Parameter Loss:**
   - On `HomeScreen`, tapping "SEND" or "RECEIVE" navigated to `NavTab.TRANSFER` without informing `SuperTransferScreen` of the selected mode. The user had to re-select the mode on the transfer screen.
   - Tapping "Photos", "Videos", "Audio", or "Documents" navigated to `NavTab.RECOVER` without passing the initial category filter.
2. **Back Press Behavior:**
   - Navigating between tabs did not support intuitive navigation: pressing Back on a non-home tab would sometimes exit or do nothing.
   - Pressing Back on `NavTab.HOME` was trapped with a no-op handler, frustrating users who expect standard Android back navigation.
3. **Dead Action Handlers in `MoreFeaturesScreen`:**
   - Certain diagnostic cards ("Battery Calibration", "Sensor Calibration", "Storage Analyzer") lacked actionable intent triggers or dialogs.

### Navigation Remediation
1. Expand navigation state in `MainActivity.kt`:
   ```kotlin
   var currentTab by rememberSaveable { mutableStateOf(NavTab.HOME) }
   var transferInitialMode by rememberSaveable { mutableStateOf<TransferMode?>(null) }
   var recoverInitialCategory by rememberSaveable { mutableStateOf<RecoverCategory?>(null) }
   ```
2. Update `HomeScreen` callback signatures to accept action parameters:
   ```kotlin
   onNavigateTransfer: (TransferMode) -> Unit
   onNavigateRecover: (RecoverCategory) -> Unit
   ```
3. Implement standard double-back-to-exit on `NavTab.HOME` and back-to-home on sub-tabs.
4. Wire all actions in `MoreFeaturesScreen` to genuine system intents (e.g. `Settings.ACTION_DEVICE_INFO_SETTINGS`, `Settings.ACTION_INTERNAL_STORAGE_SETTINGS`) or internal diagnostic flows.
