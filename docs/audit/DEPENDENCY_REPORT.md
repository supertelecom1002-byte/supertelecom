# Dependency & Build Tooling Audit

**Project:** Super Telecom  
**Audit Timestamp:** 2026-11-01  
**Environments:** Node.js 20+ (Web) & Android Gradle Plugin 8.3+ (Android)

---

## 1. Web Runtime Dependencies (`package.json`)

| Package Group | Key Libraries | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Framework & Routing** | `@tanstack/start`, `@tanstack/react-router` | `^1.161.4` | Full-stack SSR, file-based routing, loader patterns |
| **UI Primitives** | `@radix-ui/react-*` (Accordion, Dialog, Tabs, Tooltip, etc.) | `^1.1 - ^2.2` | Accessible, unstyled headless component primitives |
| **Styling** | `tailwindcss`, `@tailwindcss/vite` | `^4.2.1` | Modern v4 zero-configuration Tailwind CSS engine |
| **3D Rendering** | `three`, `@react-three/fiber`, `@react-three/drei` | `^0.174`, `^9.0`, `^10.0` | 3D interactive smartphone teardown visualization |
| **Icons & Animation** | `lucide-react`, `gsap`, `lenis` | `^1.16`, `^3.14`, `^1.3` | Vector iconography and smooth micro-interactions |
| **Data Validation** | `zod` | `^4.3.6` | Type-safe schema validation |

---

## 2. Android Runtime Dependencies (`app/build.gradle.kts`)

| Dependency | Version | Purpose |
| :--- | :--- | :--- |
| **AndroidX Core KTX** | `1.13.0` | Kotlin extensions for Android framework APIs |
| **Lifecycle & ViewModel** | `2.7.0` | Lifecycle-aware coroutine scopes and Compose ViewModels |
| **Activity Compose** | `1.9.0` | Integration of Jetpack Compose into Android Activities |
| **Compose BOM** | `2024.04.01` | Bill of Materials ensuring harmonized Compose library versions |
| **Compose Material 3** | BOM Managed | Modern Material 3 UI design system |
| **Material Icons Extended** | BOM Managed | Vector icons for Transfer, Recover, and Launcher navigation |
| **Kotlinx Coroutines Android**| `1.8.0` | Asynchronous non-blocking file streaming and MediaStore queries |

---

## 3. Tooling & Security Posture

- **No Tracking SDKs:** 0 tracking, analytics, or surveillance libraries in either Web or Android packages.
- **Minification & Shrinking:** R8 / ProGuard enabled in release configuration (`isMinifyEnabled = true`, `isShrinkResources = true`).
- **Target SDK Compliance:** Target SDK set to 34 (Android 14) ensuring full alignment with modern Scoped Storage and Google Play requirements.
