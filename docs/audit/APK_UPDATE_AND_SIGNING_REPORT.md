# Super Telecom APK Update, Cryptographic Verification & In-Place Installation Report

**Application Package:** `com.supertelecom.app`  
**Target Release:** `v2.7.0` (Version Code: `27`)  
**Signing Key:** Android Debug Signature (Development / Self-Distribution)  
**Distribution URL:** `https://www.supertelecom.shop/SuperTelecom.apk`  
**Manifest URL:** `https://www.supertelecom.shop/apk-release.json`  
**Audit Date:** 2026-11-03  

---

## 1. Android Package Manager Update Invariants

For Android OS to permit an "in-place" application update without requiring the user to uninstall their existing application (which would cause total loss of app settings, saved files, and database records), the following three technical criteria must be strictly satisfied:

1. **Exact Package Name Match**:  
   The target APK must declare `package="com.supertelecom.app"` in its compiled `AndroidManifest.xml`. Any suffix (e.g. `.debug`) breaks update pairing.
   - *Status in v2.7.0:* Verified `applicationId = "com.supertelecom.app"` without suffix in `app/build.gradle.kts`.

2. **Strictly Higher `versionCode`**:  
   Android Package Manager rejects updates with an identical or lower version code (`INSTALL_FAILED_VERSION_DOWNGRADE`).
   - *Previous Audited Version Code:* `26` (v2.6.0)
   - *v2.7.0 Version Code:* `27` (Strict monotonic increment).

3. **Identical Cryptographic Signer Fingerprint**:  
   The certificate used to sign the update must match the certificate of the currently installed application (`INSTALL_FAILED_UPDATE_INCOMPATIBLE`).
   - *Signer DN:* `C=US, O=Android, CN=Android Debug`
   - *Certificate SHA-256 Digest:* `31:60:EE:06:AD:79:DB:96:F6:C3:C7:6E:67:3B:2C:42:EF:E2:3B:E7:E9:6C:47:F2:AD:03:D0:33:8C:A3:BE:AF`
   - *Certificate SHA-1 Digest:* `27:AA:7A:D4:57:A7:28:FE:84:87:69:B3:36:C1:2F:5C:88:51:71:0D`

---

## 2. Cryptographic Security in `AppUpdateManager.kt`

The internal auto-update engine in `app/src/main/java/com/supertelecom/feature/update/AppUpdateManager.kt` has been hardened against MITM attacks, corrupted downloads, and spoofed binaries:

1. **HTTPS Enforcement**:  
   Only updates served over secure HTTPS are processed. Insecure `http://` transport is rejected immediately.

2. **Package Identity Pre-Verification**:  
   Before prompting the Android system installer, `AppUpdateManager` parses the downloaded APK's manifest using `PackageManager.getPackageArchiveInfo()`. If the internal package name does not match `com.supertelecom.app`, the file is deleted immediately.

3. **Version Code Progression Guard**:  
   The downloaded binary's internal `versionCode` is verified to be strictly greater than `BuildConfig.VERSION_CODE`.

4. **SHA-256 Checksum Validation**:  
   The entire binary stream is piped through `MessageDigest.getInstance("SHA-256")`. If the computed hex string does not match the manifest `sha256` value, installation aborts and the corrupt file is purged from disk.

5. **Isolated Cache Staging**:  
   APKs are staged in `context.cacheDir/updates/` with restricted file permissions before being exposed to the OS installer via Android's secure `FileProvider` (`content://com.supertelecom.app.fileprovider/updates/...`).
