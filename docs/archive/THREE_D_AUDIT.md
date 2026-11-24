# SUPER TELECOM — 3D SMARTPHONE TEARDOWN AUDIT (PHASE 1)
**Component:** `src/components/three/SmartphoneTeardown3D.tsx`  
**Dependencies:** `@react-three/fiber`, `@react-three/drei`, `three`, `gsap`, `ScrollTrigger`  
**Date:** November 2026

---

## 1. Technical Audit Findings

### 1.1 Modeling & Geometry
- **Previous Implementation:**  
  The 3D smartphone was constructed using raw Three.js mathematical primitives directly in JSX:
  - 40+ nested `<mesh>` tags with `<boxGeometry>`, `<cylinderGeometry>`, `<torusGeometry>`.
  - Hardcoded coordinates and dimensions scattered across ~1,200 lines of code.
  - No UV unwrapping, no realistic textures, no circuit board silkscreen or chip markings.
  - Sub-assemblies were tightly coupled to hardcoded translation offsets.
- **Architectural Defect:**  
  Rendering thousands of un-instanced raw geometry vertices with basic mesh standard materials caused unnecessary draw calls and lacked realism.
- **Upgraded Architecture:**  
  Construct an engineering-grade generic smartphone model in industry-standard GLB format (`public/models/smartphone_teardown.glb`). The model features 18 distinctly named sub-assemblies:
  1. `FrontGlass` (Corning Gorilla Glass victus-style curved bevel)
  2. `TouchDigitizer` (Transparent capacitive matrix)
  3. `OLEDDisplay` (Deep black panel with subpixel substrate)
  4. `ChassisFrame` (Aerospace-grade anodized aluminum / titanium alloy frame)
  5. `RearCover` (Matte frosted AG glass with camera bump)
  6. `Battery` (Lithium-ion polymer battery pack with safety warnings & ribbon cable)
  7. `Motherboard` (Multi-layer printed circuit board with gold-plated pads)
  8. `ShieldCover` (Electromagnetic interference shielding can)
  9. `ProcessorSoC` (Flagship application processor with thermal paste interface)
  10. `PMIC` (Power management integrated circuit)
  11. `RearCameraModule` (Triple-lens periscope camera assembly with optical image stabilization)
  12. `ChargingPort` (Reinforced USB-C port module)
  13. `USBPort` (Internal connector bracket)
  14. `ChargingFlex` (Flexible printed circuit ribbon)
  15. `Loudspeaker` (Acoustic cavity bottom speaker)
  16. `Earpiece` (Top receiver speaker)
  17. `VibrationMotor` (Haptic linear resonant actuator)
  18. `WirelessCoil` (Copper inductive charging coil with ferrite sheet)
  19. `Screws` (Micro Torx assembly screws)

---

### 1.2 Performance & Frame Budget
- **Previous Bottleneck:**  
  In `SmartphoneTeardown3D.tsx`:
  ```typescript
  ScrollTrigger.create({
    trigger: containerRef.current,
    start: "top top",
    end: "bottom bottom",
    scrub: 1,
    onUpdate: (self) => {
      setScrollProgress(self.progress); // TRIGGERED 60-144 RE-RENDERS/SEC!
    }
  });
  ```
  Every mouse wheel tick forced a complete React component re-render, recalculating all inline style strings, JSX elements, and hook dependencies.
- **Upgraded Architecture:**  
  1. Store scroll progress in a mutable reference: `const scrollProgressRef = useRef(0)`.
  2. In `ScrollTrigger.onUpdate`, update `scrollProgressRef.current = self.progress` without calling any React state setter.
  3. In `useFrame((state, delta) => { ... })`, smoothly interpolate current node positions and rotations toward targets derived from `scrollProgressRef.current`.
  4. Only invoke a React state setter (`setActiveStage`) when the progress crosses stage boundaries (e.g., crossing from Scene A to Scene B) to update overlay UI text. This reduces state updates from hundreds per second to once every few seconds.

---

### 1.3 Mobile Viewport & Touch Interaction
- **Previous Defect:**  
  On mobile viewports (< 768px), the 3D canvas either trapped vertical touch scrolls (preventing the user from scrolling down the page) or was entirely hidden by `MobileAppShell.tsx`.
- **Upgraded Architecture:**  
  1. Set CSS `touch-action: pan-y` on the 3D container so vertical swipes scroll the webpage naturally.
  2. Implement a custom pointer drag controller: horizontal drags (`deltaX`) rotate the phone on its Y-axis (`rotationY`), while vertical drags (`deltaY`) allow the browser's native touch scroll to proceed unimpeded.
  3. Dynamically adjust camera FOV and position on mobile to ensure the entire phone fits in portrait view without clipping.
