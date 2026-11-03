# Super Transfer & Super Recover Technical Architecture & Test Report

**Application Package:** `com.supertelecom.app`  
**Engine Components:** `WifiDirectTransferManager.kt`, `StorageRecoverEngine.kt`  
**UI Components:** `SuperTransferScreen.kt`, `SuperRecoverScreen.kt`  
**Release Version:** `v2.7.0` (Build `27`)  
**Audit Date:** 2026-11-03  

---

## 1. Super Transfer Technical Architecture

### A. Communication Protocol
Super Transfer implements a zero-cloud peer-to-peer transport protocol:
1. **P2P Discovery**: Utilizes Android's `WifiP2pManager` to discover adjacent devices supporting Wi-Fi Direct.
2. **Local Hotspot Fallback**: Where P2P negotiation is restricted by OEM power-saving frameworks, the receiving device initializes a local `ServerSocket(8888)` and broadcasts connection parameters via QR code or 6-digit pairing PIN.
3. **Chunked Stream Engine**:
   - Files are partitioned into 64 KB binary chunks.
   - Flow control incorporates adaptive throttling with non-blocking coroutines.
   - Checksum validation: Each transferred item computes a SHA-256 hash stream upon completion, comparing recipient hash against transmitter manifest.
4. **Android 13/14 Media Picker Integration**:
   - Utilizes `ActivityResultContracts.PickMultipleVisualMedia` for high-resolution images and 4K videos without requiring legacy `READ_EXTERNAL_STORAGE` broad permissions.
   - Utilizes `ActivityResultContracts.OpenMultipleDocuments` for arbitrary documents, audio tracks, and APK packages.

---

## 2. Super Recover Technical Architecture

### B. Storage Discovery & Honest Recovery Model
Unlike commercial deceptive "recovery" apps that fabricate mock deleted files or lock restoration behind fake paywalls, Super Recover executes genuine on-device discovery:

1. **Tier 1: MediaStore Query**:
   - Queries `MediaStore.Images.Media`, `MediaStore.Video.Media`, `MediaStore.Audio.Media`, and `MediaStore.Files`.
   - Filters by `MediaStore.MediaColumns.IS_TRASHED` (Android 11+) to locate soft-deleted items held in the system trash bin.
   - Evaluates hidden directories (`.nomedia`, hidden album folders) where user media has been excluded from gallery indexing.

2. **Tier 2: WhatsApp & Messaging Media Vault**:
   - Scans Scoped Storage directories:  
     `Android/media/com.whatsapp/WhatsApp/Media/` (Images, Video, Audio, Voice Notes, Documents).
   - Recovers sent and received items that are no longer referenced by active chat threads.

3. **Tier 3: Storage Access Framework (SAF) Deep Scan**:
   - Allows users to grant direct SAF access to specific directories (`DCIM`, `Download`, `Documents`).
   - Recursively reads directory trees via `DocumentFile.fromTreeUri()`.

4. **Tier 4: Restoration Pipeline**:
   - Selected items are copied into public storage at `Pictures/SuperRecovered` (for images), `Movies/SuperRecovered` (for videos), `Music/SuperRecovered` (for audio), and `Documents/SuperRecovered` (for documents).
   - Immediately invokes `MediaScannerConnection.scanFile()` so restored assets appear in the user's default gallery and file manager instantly.

---

## 3. Verification & Compliance Checklist

- [x] Zero cloud servers contacted during file transfer or recovery scans.
- [x] No simulated progress bars or artificial delays.
- [x] Clean empty queue states when no tasks are active.
- [x] Safe multi-file selection with real file size, MIME type, and preview thumbnail rendering.
