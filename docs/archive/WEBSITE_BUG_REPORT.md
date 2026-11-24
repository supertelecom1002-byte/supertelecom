# SUPER TELECOM — WEBSITE AUDIT & BUG REPORT (PHASE 1)
**Target Platform:** Web (Vite + React 18 + TypeScript + Tailwind CSS)  
**Production Host:** `https://www.supertelecom.shop/`  
**Date:** November 2026

---

## 1. Identified Issues & Bug Inventory

### Bug WEB-01: Dual / Conflicting Download Routes
- **Location:** `src/routes/apk.tsx` and `src/routes/download.tsx`
- **Severity:** Medium
- **Description:** Two parallel routes existed for downloading the Super Telecom APK. Having separate endpoints created duplicate canonical tags, redundant tracking logic, and potential version divergence if metadata was updated on one route but delayed on another.
- **Remediation:** Consolidate user navigation towards `/download` as the primary user-facing download hub, and configure `/apk` to render the unified download experience with matching metadata, canonical pointing to `/download`, and identical release assets.

### Bug WEB-02: 3D Teardown Performance & Scroll Thrashing
- **Location:** `src/components/three/SmartphoneTeardown3D.tsx`
- **Severity:** High
- **Description:** 
  1. `ScrollTrigger.create.onUpdate` called `setScrollProgress(self.progress)` on every scroll tick. In typical desktop browsers, this dispatched 60-144 React re-renders per second across the entire canvas hierarchy.
  2. The smartphone was modeled purely with code using ~1,200 lines of raw Three.js primitives (`boxGeometry`, `cylinderGeometry`, `torusGeometry`), lacking UV mapping, realistic PBR materials, and proper sub-assembly hierarchy.
  3. On screens narrower than 768px, the 3D canvas was either completely suppressed or captured touch scroll gestures, preventing the user from scrolling down the page.
- **Remediation:**
  1. Store scroll progress in a mutable reference (`scrollProgressRef = useRef(0)`) updated inside `ScrollTrigger.create.onUpdate` without triggering React state updates.
  2. Sample `scrollProgressRef.current` inside `useFrame` to interpolate node positions and rotations smoothly.
  3. Only fire React state updates when transitioning between major narrative stages (Scenes A through G) to update overlay captions.
  4. Build an engineering-grade generic smartphone model in GLB format (`public/models/smartphone_teardown.glb`) with 18 named sub-assemblies.
  5. Add CSS `touch-action: pan-y` and configure pointer rotation controls so horizontal drag rotates the phone while vertical drag allows natural page scrolling on mobile.

### Bug WEB-03: Lingering Numeric Pricing in Service Views
- **Location:** `src/components/`, `src/data/repairServicesSiloData.ts`, `src/data/services.ts`
- **Severity:** Medium
- **Description:** Previous sweeps replaced prices with consultation actions, but static data maps and fallback props still retained pricing fields (e.g. `price: "₹499"`, `estimatedCost`).
- **Remediation:** Purge all residual numeric price quotes across all service definitions and replace them universally with `Pricing on Inspection / Free Diagnostic Consultation` and the `RepairConsultationAction` component.

### Bug WEB-04: Mobile Viewport 3D Canvas Integration
- **Location:** `src/components/layout/MobileAppShell.tsx` and `src/routes/index.tsx`
- **Severity:** High
- **Description:** Mobile users visiting `https://www.supertelecom.shop/` on Android and iOS devices were deprived of the flagship 3D smartphone disassembly experience because the shell container hid the section on mobile breakpoints.
- **Remediation:** Enable responsive 3D rendering with an optimized mobile camera distance, appropriate lighting intensity, and touch-friendly controls that preserve native vertical scroll.

---

## 2. Route Verification Summary
All 38 routes in `src/routes/` were audited for broken links, console errors, and schema validity:
- `/` (Home landing): Fully operational.
- `/services/*` (Service silos): Cleaned of customer-facing fixed rates.
- `/download` & `/apk`: Consolidated with SHA-256 verification.
- `/app`: PWA web view configured to direct native Android users to the standalone APK.
