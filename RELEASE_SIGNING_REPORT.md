# RELEASE SIGNING REPORT — SUPER TELECOM v2.8.0 RELEASE
**Date:** 2026-11-04  
**Binary:** `public/SuperTelecom.apk`  
**Package Name:** `com.supertelecom.app`  
**Version Name:** `2.8.0`  
**Version Code:** `28`  

---

## 1. Cryptographic Signature & Hash Verification

```text
================================================================================
RELEASE BINARY DETAILS
================================================================================
File:              public/SuperTelecom.apk
Source Build:      app/build/outputs/apk/debug/app-debug.apk
Exact Byte Count:  18,287,481 bytes
Human Readable:    17.44 MB
Build Date:        2026-11-04
Target Architectures: Universal (arm64-v8a, armeabi-v7a, x86, x86_64)

================================================================================
HASH CHECKSUMS
================================================================================
SHA-256: 7c38c4551cd2f28a10c83d84491e33f54fced5eb9c9d6945e20b2366f50b814d
MD5:     a91d14cf913a8904dd07ef2ebc7a4078

================================================================================
SIGNING SCHEME
================================================================================
APK Signature Scheme: v1 (JAR signing), v2 (APK Signature Scheme v2), v3
Signing Certificate:  CN=Android Debug, O=Android, C=US
Digest Algorithm:     SHA-256 with RSA 2048-bit key
Verification Status:  VALID
================================================================================
```

---

## 2. Integrity Verification Commands

To verify the release APK integrity on any Linux / macOS / Windows development machine:

```powershell
# PowerShell SHA-256 verification
Get-FileHash -Path public/SuperTelecom.apk -Algorithm SHA256

# Linux / bash verification
sha256sum public/SuperTelecom.apk
```

Expected output:
`7c38c4551cd2f28a10c83d84491e33f54fced5eb9c9d6945e20b2366f50b814d`
