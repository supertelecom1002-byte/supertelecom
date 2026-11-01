# Unused, Duplicate & Deprecated Assets Report

**Project:** Super Telecom  
**Audit Timestamp:** 2026-11-01  
**Objective:** Eliminate bundle bloat, remove unrelated imagery, and streamline binary distribution.

---

## 1. Purged Duplicate APKs & Heavy Binaries

| Asset | Original Location | Size | Status | Action Taken |
| :--- | :--- | :--- | :--- | :--- |
| **Duplicate Space APK** | `public/Super Telecom.apk` | ~1.69 MB | **Deleted** | Removed from repo; 301 redirect added to canonical `SuperTelecom.apk` |
| **Legacy Gaming OS APK** | `public/SuperTelecomGamingOS.apk` | 15.62 MB | **Deprecated** | Superceded by official lightweight `SuperTelecom.apk` (1.69 MB) |
| **Canonical Production APK**| `public/SuperTelecom.apk` | 1.69 MB | **Active** | Primary binary verified with SHA-256 integrity manifest |

---

## 2. Purged Clutter & Development Artifacts

1. **`bun.lock` & `bunfig.toml`:**
   - *Status:* Purged.
   - *Reason:* Project standardizes strictly on npm and `package-lock.json` to prevent package manager conflicts.
2. **`roadmap.md`:**
   - *Status:* Purged from root directory.
   - *Reason:* Deprecated draft notes with outdated specifications.
3. **`.lovable/` Directory:**
   - *Status:* Fully purged (`.lovable/mcp/manifest.json`, `.lovable/project.json`, `.lovable/plan/`).
   - *Reason:* Ensure 100% standalone repository independence.

---

## 3. Purged Stock & Irrelevant Hardware Photos

1. **Desktop Water-Cooler (ASUS ROG Liquid Cooler):**
   - *Location:* Previously in `BeforeAfterSlider.tsx` and home showcase gallery.
   - *Reason:* Irrelevant gaming PC hardware inconsistent with smartphone repair services.
   - *Replacement:* Replaced with authentic 45x trinocular microscope BGA soldering and stereoscopic logic board repair visuals.
2. **Generic Factory & Industrial Stock Photos:**
   - *Reason:* Misleading visuals that did not represent smartphone motherboard repair.
   - *Replacement:* High-contrast, authentic smartphone teardown, curved AMOLED screen separation, and ultrasonic liquid recovery photography.
