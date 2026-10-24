import React, { Suspense, useEffect, useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PerspectiveCamera, Html } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BUSINESS_MASTER } from "@/config/superTelecomConfig";
import {
  Wrench,
  ShieldCheck,
  Cpu,
  Layers,
  Smartphone,
  Sparkles,
  RotateCcw,
  Play,
  Pause,
  Phone,
  MessageCircle,
  CheckCircle2,
  Activity,
  Zap,
  Eye,
  ChevronRight,
  Maximize2,
  Volume2,
  Clock,
  ExternalLink,
} from "lucide-react";

// Ensure GSAP ScrollTrigger plugin is registered
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ─────────────────────────────────────────────────────────────────────────────
// 3D GUIDED CALLOUT DEFINITIONS (HINDI + ENGLISH DIAGNOSTIC CARDS)
// ─────────────────────────────────────────────────────────────────────────────

interface GuidedCallout {
  id: string;
  hindiTitle: string;
  englishTitle: string;
  symptoms: string;
  startingPrice: string;
  timeEstimate: string;
  warranty: string;
  sceneRange: [number, number];
  badgeText: string;
  icon: "layers" | "cpu" | "zap" | "eye" | "activity";
  position3D: [number, number, number];
}

const GUIDED_CALLOUTS: GuidedCallout[] = [
  {
    id: "display",
    hindiTitle: "OLED डिस्प्ले व 120Hz टच ग्लास",
    englishTitle: "Super Retina AMOLED Screen & Digitizer",
    symptoms: "टूटी स्क्रीन, हरी लाइन (Green Line), ब्लैक स्पॉट, टच काम न करना या फ्लिकरिंग।",
    startingPrice: "₹899 से शुरू",
    timeEstimate: "45–90 मिनट में तैयार",
    warranty: "90 Days Warranty",
    sceneRange: [0.10, 0.32],
    badgeText: "AMOLED Display",
    icon: "layers",
    position3D: [0, 0.4, 0.8],
  },
  {
    id: "motherboard",
    hindiTitle: "मदरबोर्ड, BGA चिप व पावर IC",
    englishTitle: "Logic Board, BGA SoC & Power IC",
    symptoms: "डेड फोन, ऑटो-रीस्टार्ट, नो नेटवर्क, चार्जिंग एरर, अचानक बंद हो जाना।",
    startingPrice: "₹799 से शुरू",
    timeEstimate: "2–4 घंटे (माइक्रो-सोल्डरिंग)",
    warranty: "60–90 Days Warranty",
    sceneRange: [0.26, 0.50],
    badgeText: "Logic Board & IC",
    icon: "cpu",
    position3D: [-0.4, 1.1, 0.6],
  },
  {
    id: "battery",
    hindiTitle: "5,000mAh लिथियम बैटरी पैक",
    englishTitle: "Dual-Cell Lithium Battery & Thermal Guard",
    symptoms: "बैटरी जल्दी खत्म होना, 40% पर फोन बंद होना, बैटरी का फूलना या हीटिंग।",
    startingPrice: "₹699 से शुरू",
    timeEstimate: "30–45 मिनट (100% सेफ सेल)",
    warranty: "6 Months Warranty",
    sceneRange: [0.44, 0.68],
    badgeText: "Battery Pack",
    icon: "zap",
    position3D: [0.35, -0.6, 0.6],
  },
  {
    id: "camera",
    hindiTitle: "ट्रिपल OIS कैमरा व लेंस ग्लास",
    englishTitle: "Triple OIS Camera Array & Sapphire Lens",
    symptoms: "धुंधली फोटो, कैमरा शेकिंग/वाइब्रेशन, टूटा लेंस शीशा, ब्लैक कैमरा ऐप।",
    startingPrice: "₹499 से शुरू",
    timeEstimate: "45 मिनट (क्लीनरूम अलाइनमेंट)",
    warranty: "90 Days Warranty",
    sceneRange: [0.60, 0.82],
    badgeText: "Triple Camera",
    icon: "eye",
    position3D: [-0.6, 1.4, -0.6],
  },
  {
    id: "subboard",
    hindiTitle: "USB-C चार्जिंग पोर्ट व माइक बोर्ड",
    englishTitle: "High-Frequency USB-C Sub-Board & Mic",
    symptoms: "ढीला चार्जर, स्लो चार्जिंग, कॉल में आपकी आवाज़ न जाना या नो साउंड।",
    startingPrice: "₹349 से शुरू",
    timeEstimate: "30 मिनट में तैयार",
    warranty: "90 Days Warranty",
    sceneRange: [0.62, 0.88],
    badgeText: "Charging Port",
    icon: "activity",
    position3D: [0, -2.1, -0.4],
  },
];

interface StepperStage {
  index: number;
  label: string;
  shortName: string;
  progress: number;
  range: [number, number];
  tagline: string;
  subtext: string;
}

const STEPPER_STAGES: StepperStage[] = [
  {
    index: 1,
    label: "01. ASSEMBLED",
    shortName: "Assembled",
    progress: 0.02,
    range: [0, 0.12],
    tagline: "Flagship Engineering • Precision Inside & Out",
    subtext: "Scroll smoothly or click buttons below to inspect microscopic hardware layers.",
  },
  {
    index: 2,
    label: "02. DISPLAY",
    shortName: "AMOLED Screen",
    progress: 0.20,
    range: [0.12, 0.28],
    tagline: "Super Retina AMOLED & 120Hz Digitizer",
    subtext: "Ultra-thin OLED layer detached with zero stress on the copper touch matrix.",
  },
  {
    index: 3,
    label: "03. MOTHERBOARD",
    shortName: "Logic Board & IC",
    progress: 0.36,
    range: [0.28, 0.45],
    tagline: "Chip-Level BGA Micro-Soldering Bench",
    subtext: "Silver EMI shield lifts off exposing high-density SoC, PMIC & 0.02mm micro-traces.",
  },
  {
    index: 4,
    label: "04. BATTERY",
    shortName: "Li-Ion Battery",
    progress: 0.53,
    range: [0.45, 0.62],
    tagline: "5,000mAh Dual-Cell Li-ion & Qi2 Induction Loop",
    subtext: "Dual pull-tab battery extraction and copper wireless charging coil isolation.",
  },
  {
    index: 5,
    label: "05. CAMERAS",
    shortName: "Optics & Port",
    progress: 0.70,
    range: [0.62, 0.78],
    tagline: "Triple OIS Camera & Reinforced Type-C",
    subtext: "Independent camera suspension prisms and 24-pin fast-charge sub-circuits.",
  },
  {
    index: 6,
    label: "06. EXPLODED",
    shortName: "360° Exploded",
    progress: 0.85,
    range: [0.78, 0.90],
    tagline: "Complete 360° Exploded Architecture",
    subtext: "Over 12 integrated subsystems floating simultaneously. Every micro-component verified.",
  },
  {
    index: 7,
    label: "07. REASSEMBLED",
    shortName: "Diagnostic Ready",
    progress: 0.98,
    range: [0.90, 1.0],
    tagline: "Magnetic Reassembly & Lab Diagnostic Verification",
    subtext: "Hermetically sealed chassis locked and 100% bench-tested ready for customer delivery.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// PROCEDURAL HIGH-CONTRAST SMARTPHONE RIG WITH VISIBILITY GUARDS
// ─────────────────────────────────────────────────────────────────────────────

interface RigProps {
  scrollProgress: number;
  isPaused: boolean;
  activeCallout: string | null;
  onSelectCallout: (id: string) => void;
}

function SmartphoneProceduralRig({
  scrollProgress,
  isPaused,
  activeCallout,
  onSelectCallout,
}: RigProps) {
  const mainRigRef = useRef<THREE.Group>(null);

  // 12 Functional Rig Layers
  const frontGlassRef = useRef<THREE.Group>(null);
  const oledDisplayRef = useRef<THREE.Group>(null);
  const frontSensorRef = useRef<THREE.Group>(null);
  const earpieceRef = useRef<THREE.Group>(null);
  const chassisRef = useRef<THREE.Group>(null);
  const motherboardRef = useRef<THREE.Group>(null);
  const emiShieldRef = useRef<THREE.Group>(null);
  const batteryRef = useRef<THREE.Group>(null);
  const wirelessCoilRef = useRef<THREE.Group>(null);
  const cameraModuleRef = useRef<THREE.Group>(null);
  const subBoardRef = useRef<THREE.Group>(null);
  const speakerHapticsRef = useRef<THREE.Group>(null);
  const rearGlassRef = useRef<THREE.Group>(null);
  const screwsGroupRef = useRef<THREE.Group>(null);

  // Materials with high contrast, bright metals, vivid colors and studio reflections
  const materials = useMemo(() => {
    return {
      // 1. Titanium Frame (Bright Polished Silver with Cyan Edge Glint)
      titaniumChassis: new THREE.MeshStandardMaterial({
        color: "#94a3b8", // Bright titanium silver
        metalness: 0.9,
        roughness: 0.18,
      }),
      titaniumPolished: new THREE.MeshStandardMaterial({
        color: "#cbd5e1",
        metalness: 0.96,
        roughness: 0.1,
      }),

      // 2. Front Glass (Crystal Clear Sapphire with Subtle Refraction)
      frontGlass: new THREE.MeshPhysicalMaterial({
        color: "#f8fafc",
        transmission: 0.96,
        opacity: 0.92,
        transparent: true,
        roughness: 0.02,
        ior: 1.52,
        reflectivity: 0.9,
        clearcoat: 1.0,
      }),

      // 3. AMOLED Display (Vibrant Glowing Blue-Cyan Gradient Screen)
      amoledActive: new THREE.MeshStandardMaterial({
        color: "#0369a1",
        emissive: "#0284c7",
        emissiveIntensity: 0.65,
        roughness: 0.15,
        metalness: 0.25,
      }),

      // 4. Motherboard (Deep Emerald Green with Gold Traces)
      pcbGreen: new THREE.MeshStandardMaterial({
        color: "#064e3b", // Deep emerald teal
        roughness: 0.35,
        metalness: 0.15,
      }),
      copperGold: new THREE.MeshStandardMaterial({
        color: "#fbbf24", // 24k vibrant gold
        metalness: 0.95,
        roughness: 0.15,
      }),
      emiShield: new THREE.MeshStandardMaterial({
        color: "#f1f5f9", // Polished silver aluminium shield
        metalness: 0.98,
        roughness: 0.12,
      }),

      // 5. Battery Pack (Cobalt Blue Titanium Pouch)
      batteryCobalt: new THREE.MeshStandardMaterial({
        color: "#1e3a5f", // Cobalt navy blue
        metalness: 0.65,
        roughness: 0.28,
      }),

      // 6. Camera Module (Metallic Ring & Sapphire Glass)
      lensGlass: new THREE.MeshPhysicalMaterial({
        color: "#1d4ed8",
        transmission: 0.92,
        roughness: 0.04,
        ior: 1.65,
        reflectivity: 1.0,
        clearcoat: 1.0,
      }),

      // 7. Wireless Induction Coil (Bright Copper Wire)
      copperCoil: new THREE.MeshStandardMaterial({
        color: "#f59e0b",
        metalness: 0.92,
        roughness: 0.2,
      }),

      // 8. Rear AG Frosted Glass
      rearGlass: new THREE.MeshPhysicalMaterial({
        color: "#1e293b",
        roughness: 0.3,
        metalness: 0.25,
        clearcoat: 0.7,
      }),

      // 9. Precision Torx Screws
      screwsMetallic: new THREE.MeshStandardMaterial({
        color: "#e2e8f0",
        metalness: 0.95,
        roughness: 0.15,
      }),
    };
  }, []);

  // Frame update loop: scrubs animation & strictly controls internal visibility
  useFrame((state) => {
    if (!mainRigRef.current) return;

    const p = THREE.MathUtils.clamp(scrollProgress, 0, 1);

    // ─────────────────────────────────────────────────────────────
    // CRITICAL Z-CLIPPING & VISIBILITY RULES:
    // When phone is in closed state (p < 0.06 or p > 0.95), internal parts
    // (motherboard, battery, coil, sub-board, haptics, internal screws)
    // MUST have visible = false so no internal coil or box pokes out of
    // the chassis or screen!
    // ─────────────────────────────────────────────────────────────
    const isExploded = p >= 0.06 && p < 0.96;

    if (motherboardRef.current) motherboardRef.current.visible = isExploded;
    if (batteryRef.current) batteryRef.current.visible = isExploded;
    if (wirelessCoilRef.current) wirelessCoilRef.current.visible = isExploded;
    if (subBoardRef.current) subBoardRef.current.visible = isExploded;
    if (speakerHapticsRef.current) speakerHapticsRef.current.visible = isExploded;
    if (screwsGroupRef.current) screwsGroupRef.current.visible = isExploded;
    if (cameraModuleRef.current) cameraModuleRef.current.visible = true; // Always visible on rear

    // Interpolation curves
    const s2 = THREE.MathUtils.smoothstep(p, 0.12, 0.28);
    const s3 = THREE.MathUtils.smoothstep(p, 0.28, 0.45);
    const s4 = THREE.MathUtils.smoothstep(p, 0.45, 0.62);
    const s5 = THREE.MathUtils.smoothstep(p, 0.62, 0.78);
    const s6 = THREE.MathUtils.smoothstep(p, 0.78, 0.90);
    const s7 = THREE.MathUtils.smoothstep(p, 0.90, 1.0);

    // Main Rig Turntable & Tilt
    const baseRotX = 0.2 + (s2 * 0.1) - (s3 * 0.22) + (s6 * 0.15) - (s7 * 0.25);
    const baseRotY =
      0.45 +
      (s2 * 0.15) -
      (s3 * 0.3) +
      (s5 * 0.45) +
      (s6 * Math.PI * 0.55) -
      (s7 * Math.PI * 0.55 + s7 * 0.7);
    const idleFloat = !isPaused ? Math.sin(state.clock.elapsedTime * 1.2) * 0.03 : 0;

    mainRigRef.current.rotation.x = THREE.MathUtils.lerp(
      mainRigRef.current.rotation.x,
      baseRotX + idleFloat * 0.5,
      0.15
    );
    mainRigRef.current.rotation.y = THREE.MathUtils.lerp(
      mainRigRef.current.rotation.y,
      baseRotY + idleFloat * 0.8,
      0.15
    );

    // 1. Front Glass (+Z forward lift)
    if (frontGlassRef.current) {
      const targetZ = 0.09 + (s2 * 2.0) + (s6 * 1.4) - (s7 * 3.4);
      frontGlassRef.current.position.z = THREE.MathUtils.lerp(
        frontGlassRef.current.position.z,
        targetZ,
        0.18
      );
    }

    // 2. OLED Display (+Z forward lift behind glass)
    if (oledDisplayRef.current) {
      const targetZ = 0.088 + (s2 * 1.4) + (s6 * 1.0) - (s7 * 2.4);
      oledDisplayRef.current.position.z = THREE.MathUtils.lerp(
        oledDisplayRef.current.position.z,
        targetZ,
        0.18
      );
    }

    // 3. Front Sensor & Earpiece
    if (frontSensorRef.current) {
      const targetZ = 0.09 + (s2 * 1.7) + (s6 * 1.2) - (s7 * 2.9);
      frontSensorRef.current.position.z = THREE.MathUtils.lerp(
        frontSensorRef.current.position.z,
        targetZ,
        0.18
      );
    }
    if (earpieceRef.current) {
      const targetZ = 0.09 + (s2 * 1.6) + (s6 * 0.9) - (s7 * 2.5);
      earpieceRef.current.position.z = THREE.MathUtils.lerp(
        earpieceRef.current.position.z,
        targetZ,
        0.18
      );
    }

    // 4. Motherboard (+Z lift + tilt forward + EMI shield separation)
    if (motherboardRef.current) {
      const targetZ = 0.02 + (s3 * 0.9) + (s6 * 0.7) - (s7 * 1.6);
      const targetRotX = -(s3 * 0.35) + (s7 * 0.35);
      motherboardRef.current.position.z = THREE.MathUtils.lerp(
        motherboardRef.current.position.z,
        targetZ,
        0.18
      );
      motherboardRef.current.rotation.x = THREE.MathUtils.lerp(
        motherboardRef.current.rotation.x,
        targetRotX,
        0.18
      );
    }
    if (emiShieldRef.current) {
      const targetShieldZ = 0.03 + (s3 * 0.7) + (s6 * 0.6) - (s7 * 1.3);
      emiShieldRef.current.position.z = THREE.MathUtils.lerp(
        emiShieldRef.current.position.z,
        targetShieldZ,
        0.18
      );
    }

    // 5. Battery (lateral slide + forward float)
    if (batteryRef.current) {
      const targetX = 0.35 + (s4 * 0.45) + (s6 * 0.25) - (s7 * 0.7);
      const targetZ = 0.01 + (s4 * 0.6) + (s6 * 0.5) - (s7 * 1.1);
      batteryRef.current.position.x = THREE.MathUtils.lerp(
        batteryRef.current.position.x,
        targetX,
        0.18
      );
      batteryRef.current.position.z = THREE.MathUtils.lerp(
        batteryRef.current.position.z,
        targetZ,
        0.18
      );
    }

    // 6. Wireless Induction Coil (Retracts completely inside chassis or floats back)
    if (wirelessCoilRef.current) {
      const targetZ = -0.02 - (s4 * 0.7) - (s6 * 0.6) + (s7 * 1.3);
      wirelessCoilRef.current.position.z = THREE.MathUtils.lerp(
        wirelessCoilRef.current.position.z,
        targetZ,
        0.18
      );
    }

    // 7. Triple Rear Camera Module
    if (cameraModuleRef.current) {
      const targetZ = -0.09 - (s5 * 1.0) - (s6 * 0.8) + (s7 * 1.8);
      const targetY = 1.4 + (s5 * 0.3) - (s7 * 0.3);
      cameraModuleRef.current.position.z = THREE.MathUtils.lerp(
        cameraModuleRef.current.position.z,
        targetZ,
        0.18
      );
      cameraModuleRef.current.position.y = THREE.MathUtils.lerp(
        cameraModuleRef.current.position.y,
        targetY,
        0.18
      );
    }

    // 8. Bottom Sub-Board (USB-C & mic)
    if (subBoardRef.current) {
      const targetY = -2.1 - (s5 * 0.55) - (s6 * 0.45) + (s7 * 1.0);
      const targetZ = -0.01 - (s5 * 0.45) + (s7 * 0.45);
      subBoardRef.current.position.y = THREE.MathUtils.lerp(
        subBoardRef.current.position.y,
        targetY,
        0.18
      );
      subBoardRef.current.position.z = THREE.MathUtils.lerp(
        subBoardRef.current.position.z,
        targetZ,
        0.18
      );
    }

    // 9. Speaker & Haptics Module
    if (speakerHapticsRef.current) {
      const targetY = -2.1 - (s5 * 0.45) - (s6 * 0.35) + (s7 * 0.8);
      const targetZ = -0.02 - (s5 * 0.35) + (s7 * 0.35);
      speakerHapticsRef.current.position.y = THREE.MathUtils.lerp(
        speakerHapticsRef.current.position.y,
        targetY,
        0.18
      );
      speakerHapticsRef.current.position.z = THREE.MathUtils.lerp(
        speakerHapticsRef.current.position.z,
        targetZ,
        0.18
      );
    }

    // 10. Rear AG Glass & Screws
    if (rearGlassRef.current) {
      const targetZ = -0.09 - (s3 * 0.9) - (s5 * 0.9) - (s6 * 1.3) + (s7 * 3.1);
      rearGlassRef.current.position.z = THREE.MathUtils.lerp(
        rearGlassRef.current.position.z,
        targetZ,
        0.18
      );
    }
    if (screwsGroupRef.current) {
      const targetScrewSpread = (s2 * 0.85) + (s6 * 1.1) - (s7 * 1.95);
      screwsGroupRef.current.position.z = -0.12 - targetScrewSpread * 0.8;
    }
  });

  return (
    <group ref={mainRigRef} position={[0, 0, 0]}>
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. FRONT PROTECTIVE GLASS (Crystal Sapphire)                  */}
      {/* ───────────────────────────────────────────────────────────── */}
      <group ref={frontGlassRef} position={[0, 0, 0.09]}>
        <mesh material={materials.frontGlass} castShadow>
          <boxGeometry args={[2.8, 5.8, 0.02]} />
        </mesh>
        {/* Sleek slim black screen border */}
        <mesh position={[0, 0, -0.006]}>
          <boxGeometry args={[2.78, 5.78, 0.01]} />
          <meshBasicMaterial color="#020617" wireframe />
        </mesh>
      </group>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. SUPER RETINA AMOLED DISPLAY + DIGITIZER (Glowing Screen)   */}
      {/* ───────────────────────────────────────────────────────────── */}
      <group ref={oledDisplayRef} position={[0, 0, 0.088]}>
        <mesh material={materials.amoledActive}>
          <boxGeometry args={[2.7, 5.7, 0.015]} />
        </mesh>
        {/* Glowing Wallpaper Micro-Grid */}
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[2.58, 5.5, 16, 28]} />
          <meshBasicMaterial
            color={scrollProgress > 0.9 ? "#38bdf8" : "#00f0ff"}
            wireframe
            transparent
            opacity={scrollProgress > 0.9 ? 0.9 : 0.55}
          />
        </mesh>
        {/* Top Punch Hole Camera Aperture */}
        <mesh position={[0, 2.5, 0.012]}>
          <circleGeometry args={[0.075, 32]} />
          <meshBasicMaterial color="#020617" />
        </mesh>
        {/* Boot Logo / Live System Battery Icon on reassembly */}
        {scrollProgress > 0.88 && (
          <mesh position={[0, 0.2, 0.014]}>
            <circleGeometry args={[0.55, 32]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.8} />
          </mesh>
        )}
        {/* Gold Digitizer Flex Ribbon */}
        <mesh position={[0, -2.72, 0.01]} rotation={[0.4, 0, 0]}>
          <boxGeometry args={[0.8, 0.45, 0.01]} />
          <primitive object={materials.copperGold} attach="material" />
        </mesh>
      </group>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. FRONT SENSOR & EARPIECE SPEAKER                            */}
      {/* ───────────────────────────────────────────────────────────── */}
      <group ref={frontSensorRef} position={[0, 2.5, 0.09]}>
        <mesh material={materials.lensGlass}>
          <cylinderGeometry args={[0.09, 0.09, 0.03, 24]} />
        </mesh>
      </group>
      <group ref={earpieceRef} position={[0, 2.76, 0.09]}>
        <mesh>
          <boxGeometry args={[0.7, 0.05, 0.02]} />
          <meshStandardMaterial color="#475569" roughness={0.5} />
        </mesh>
      </group>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 4. TITANIUM MID-FRAME CHASSIS (Central Anchor)                */}
      {/* ───────────────────────────────────────────────────────────── */}
      <group ref={chassisRef} position={[0, 0, 0]}>
        {/* Bright Silver-Titanium Bezel Frame */}
        <mesh material={materials.titaniumChassis} castShadow receiveShadow>
          <boxGeometry args={[2.84, 5.84, 0.18]} />
        </mesh>
        {/* High-Contrast Cyan Rim Contour Glow Wireframe */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2.86, 5.86, 0.182]} />
          <meshBasicMaterial color="#00f0ff" wireframe transparent opacity={0.25} />
        </mesh>
        {/* Side power button (+X) */}
        <mesh position={[1.43, 0.8, 0]} material={materials.titaniumPolished}>
          <boxGeometry args={[0.04, 0.6, 0.08]} />
        </mesh>
        {/* Side volume rocker (-X) */}
        <mesh position={[-1.43, 0.9, 0]} material={materials.titaniumPolished}>
          <boxGeometry args={[0.04, 1.0, 0.08]} />
        </mesh>
      </group>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 5. MOTHERBOARD PCB & BGA PROCESSOR (Emerald Green & Gold)     */}
      {/* ───────────────────────────────────────────────────────────── */}
      <group ref={motherboardRef} position={[-0.4, 1.1, 0.02]}>
        {/* Emerald Green PCB substrate */}
        <mesh material={materials.pcbGreen} castShadow>
          <boxGeometry args={[1.5, 2.2, 0.04]} />
        </mesh>
        {/* Gold BGA SoC Processor Package */}
        <mesh position={[0, 0.2, 0.03]} material={materials.copperGold}>
          <boxGeometry args={[0.68, 0.68, 0.03]} />
        </mesh>
        {/* Glowing Processor Core */}
        <mesh position={[0, 0.2, 0.046]}>
          <planeGeometry args={[0.5, 0.5]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        {/* Power Management IC (PMIC) */}
        <mesh position={[0.45, -0.4, 0.03]}>
          <boxGeometry args={[0.3, 0.4, 0.025]} />
          <meshStandardMaterial color="#0284c7" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Polished Silver EMI Shield Can */}
        <group ref={emiShieldRef} position={[0, 0.2, 0.05]}>
          <mesh material={materials.emiShield} castShadow>
            <boxGeometry args={[0.82, 0.82, 0.035]} />
          </mesh>
          <mesh position={[0, 0, 0.022]}>
            <planeGeometry args={[0.72, 0.72]} />
            <meshBasicMaterial color="#38bdf8" wireframe />
          </mesh>
        </group>
      </group>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 6. 5,000mAh LI-ION BATTERY PACK (Cobalt Blue Titanium Pouch)  */}
      {/* ───────────────────────────────────────────────────────────── */}
      <group ref={batteryRef} position={[0.35, -0.6, 0.01]}>
        <mesh material={materials.batteryCobalt} castShadow>
          <boxGeometry args={[1.55, 3.1, 0.13]} />
        </mesh>
        {/* Power & Safety Label Strip */}
        <mesh position={[0, 0, 0.07]}>
          <planeGeometry args={[1.3, 2.7]} />
          <meshBasicMaterial color="#0f172a" />
        </mesh>
        {/* Glowing Cyan Capacity Indicator */}
        <mesh position={[0, 0.5, 0.072]}>
          <planeGeometry args={[1.1, 0.25]} />
          <meshBasicMaterial color="#22d3ee" />
        </mesh>
      </group>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 7. QI2 COPPER WIRELESS INDUCTION COIL                         */}
      {/* ───────────────────────────────────────────────────────────── */}
      <group ref={wirelessCoilRef} position={[0, -0.2, -0.02]}>
        {/* Ferrite disc */}
        <mesh>
          <cylinderGeometry args={[0.85, 0.85, 0.018, 32]} />
          <meshStandardMaterial color="#0f172a" roughness={0.7} />
        </mesh>
        {/* Concentric bright copper winding rings */}
        {[0.35, 0.5, 0.65, 0.78].map((radius, idx) => (
          <mesh key={idx} rotation={[Math.PI / 2, 0, 0]} material={materials.copperCoil}>
            <torusGeometry args={[radius, 0.02, 8, 32]} />
          </mesh>
        ))}
      </group>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 8. TRIPLE REAR CAMERA MODULE                                  */}
      {/* ───────────────────────────────────────────────────────────── */}
      <group ref={cameraModuleRef} position={[-0.6, 1.4, -0.09]}>
        <mesh material={materials.titaniumPolished} castShadow>
          <boxGeometry args={[1.1, 1.3, 0.15]} />
        </mesh>
        {/* Main 108MP OIS Lens Barrel */}
        <group position={[-0.22, 0.3, -0.09]}>
          <mesh material={materials.titaniumChassis}>
            <cylinderGeometry args={[0.26, 0.26, 0.08, 24]} />
          </mesh>
          <mesh position={[0, -0.04, 0]} material={materials.lensGlass}>
            <sphereGeometry args={[0.2, 16, 16]} />
          </mesh>
        </group>
        {/* Ultra-Wide Lens */}
        <group position={[-0.22, -0.3, -0.09]}>
          <mesh material={materials.titaniumChassis}>
            <cylinderGeometry args={[0.22, 0.22, 0.07, 24]} />
          </mesh>
          <mesh position={[0, -0.035, 0]} material={materials.lensGlass}>
            <sphereGeometry args={[0.16, 16, 16]} />
          </mesh>
        </group>
        {/* Quad LED True-Tone Flash */}
        <mesh position={[0.24, -0.35, -0.07]}>
          <cylinderGeometry args={[0.09, 0.09, 0.03, 16]} />
          <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.6} />
        </mesh>
      </group>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 9. USB-C SUB-BOARD & MEMS MIC                                 */}
      {/* ───────────────────────────────────────────────────────────── */}
      <group ref={subBoardRef} position={[0, -2.1, -0.01]}>
        <mesh material={materials.pcbGreen}>
          <boxGeometry args={[1.8, 0.6, 0.03]} />
        </mesh>
        {/* 24-Pin Gold Plated USB-C Port */}
        <mesh position={[0, -0.31, 0]} material={materials.copperGold}>
          <boxGeometry args={[0.55, 0.12, 0.09]} />
        </mesh>
      </group>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 10. STEREO SPEAKER CHAMBER & TAPTIC ENGINE                    */}
      {/* ───────────────────────────────────────────────────────────── */}
      <group ref={speakerHapticsRef} position={[0.6, -2.1, -0.02]}>
        <mesh>
          <boxGeometry args={[0.7, 0.5, 0.07]} />
          <meshStandardMaterial color="#334155" roughness={0.6} />
        </mesh>
      </group>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 11. REAR MATTE AG GLASS & LASER BRANDING                      */}
      {/* ───────────────────────────────────────────────────────────── */}
      <group ref={rearGlassRef} position={[0, 0, -0.09]}>
        <mesh material={materials.rearGlass} castShadow receiveShadow>
          <boxGeometry args={[2.8, 5.8, 0.025]} />
        </mesh>
      </group>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 12. EXPLODING TORX PRECISION SCREWS                           */}
      {/* ───────────────────────────────────────────────────────────── */}
      <group ref={screwsGroupRef} position={[0, 0, -0.12]}>
        {[
          [-1.2, 2.6],
          [1.2, 2.6],
          [-1.2, 0],
          [1.2, 0],
          [-1.2, -2.6],
          [1.2, -2.6],
          [-0.3, -2.7],
          [0.3, -2.7],
        ].map(([x, y], idx) => (
          <mesh key={idx} position={[x, y, 0]} material={materials.screwsMetallic}>
            <cylinderGeometry args={[0.03, 0.03, 0.06, 12]} />
          </mesh>
        ))}
      </group>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3D FLOATING GUIDANCE CALLOUT LABELS (HTML PINS IN 3D SCENE)   */}
      {/* ───────────────────────────────────────────────────────────── */}
      {GUIDED_CALLOUTS.map((callout) => {
        const isVisible =
          scrollProgress >= callout.sceneRange[0] &&
          scrollProgress <= callout.sceneRange[1];

        if (!isVisible) return null;

        const isCurrentActive = activeCallout === callout.id;

        return (
          <group key={callout.id} position={callout.position3D}>
            <Html center distanceFactor={8} zIndexRange={[100, 0]}>
              <div className="relative group/pin pointer-events-auto">
                {/* Pulsing Beacon Dot */}
                <button
                  type="button"
                  onClick={() => onSelectCallout(callout.id)}
                  aria-label={`Inspect ${callout.englishTitle}`}
                  className={`relative flex items-center justify-center rounded-full p-2 backdrop-blur-md transition-all duration-300 shadow-xl cursor-pointer ${
                    isCurrentActive
                      ? "bg-cyan-500 text-slate-950 scale-125 ring-4 ring-cyan-400/50"
                      : "bg-slate-950/90 text-cyan-300 border border-cyan-400/60 hover:scale-115 hover:bg-cyan-950"
                  }`}
                >
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-80" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-400" />
                  </span>
                </button>

                {/* Rich 3D Guidance Card (Auto-visible when active or on hover) */}
                <div
                  className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-72 rounded-2xl bg-slate-950/95 border border-cyan-500/60 p-4 shadow-2xl backdrop-blur-xl transition-all duration-300 ${
                    isCurrentActive
                      ? "opacity-100 scale-100 pointer-events-auto"
                      : "opacity-0 scale-95 pointer-events-none group-hover/pin:opacity-100 group-hover/pin:scale-100 group-hover/pin:pointer-events-auto"
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                    <span className="px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-400 font-mono text-[10px] font-bold uppercase">
                      {callout.badgeText}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      {callout.warranty}
                    </span>
                  </div>

                  {/* Component Title (Hindi + English) */}
                  <h4 className="font-bold text-xs sm:text-sm text-white leading-tight">
                    {callout.hindiTitle}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                    {callout.englishTitle}
                  </p>

                  {/* Symptoms */}
                  <div className="mt-2 rounded-xl bg-slate-900/90 p-2 border border-slate-800 text-[11px]">
                    <span className="font-bold text-amber-400">लक्षण: </span>
                    <span className="text-slate-300">{callout.symptoms}</span>
                  </div>

                  {/* Pricing & Duration */}
                  <div className="mt-2 flex items-center justify-between text-[11px] font-semibold text-cyan-300">
                    <span className="text-white font-bold">{callout.startingPrice}</span>
                    <span className="flex items-center gap-1 text-slate-400 text-[10px]">
                      <Clock className="h-3 w-3 text-cyan-400" /> {callout.timeEstimate}
                    </span>
                  </div>

                  {/* Direct WhatsApp Booking Button */}
                  <a
                    href={`https://wa.me/${BUSINESS_MASTER?.whatsappRaw || BUSINESS_MASTER?.whatsappNumber || BUSINESS_MASTER?.contact?.whatsappRaw || "918002903643"}?text=${encodeURIComponent(
                      `Hi Super Telecom, I saw your 3D smartphone teardown and need repair for: ${callout.englishTitle} (${callout.hindiTitle}). Please share final quote & turnaround time.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    <MessageCircle className="h-3.5 w-3.5" /> Book This Repair
                  </a>
                </div>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

import { Smartphone3DFallback } from "./Smartphone3DFallback";

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SCROLL-DRIVEN 3D TEARDOWN CONTROLLER (550vh PINNED CONTAINER)
// ─────────────────────────────────────────────────────────────────────────────

const SmartphoneTeardown3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [activeCallout, setActiveCallout] = useState<string | null>(null);
  const [webglSupported, setWebglSupported] = useState(true);
  const [isInView, setIsInView] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Check WebGL availability
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl");
      if (!gl) {
        setWebglSupported(false);
      }
    } catch {
      setWebglSupported(false);
    }
  }, []);

  // Performance: Pause rendering when scrolled outside viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setIsInView(entry.isIntersecting);
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => {
      try {
        observer.disconnect();
      } catch {}
    };
  }, []);

  // GSAP ScrollTrigger timeline pinning
  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    let trigger: ScrollTrigger | null = null;
    try {
      trigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.2,
        onUpdate: (self) => {
          setScrollProgress(self.progress);
        },
      });
    } catch (e) {
      console.warn("ScrollTrigger creation error:", e);
    }

    return () => {
      try {
        trigger?.kill();
      } catch (err) {
        console.warn("ScrollTrigger kill error:", err);
      }
    };
  }, []);

  // Active scene info based on scroll progress
  const currentScene = useMemo(() => {
    const found = STEPPER_STAGES.find(
      (s) => scrollProgress >= s.range[0] && scrollProgress <= s.range[1]
    );
    return found || STEPPER_STAGES[0];
  }, [scrollProgress]);

  // Jump smoothly to a specific stage on button click
  const handleJumpToStep = (targetProgress: number) => {
    if (!containerRef.current) return;
    const totalScrollHeight = containerRef.current.offsetHeight - window.innerHeight;
    const targetY = containerRef.current.offsetTop + targetProgress * totalScrollHeight;

    window.scrollTo({
      top: targetY,
      behavior: "smooth",
    });
  };

  // Handle callout quick inspection click
  const handleSelectCallout = (id: string) => {
    setActiveCallout((prev) => (prev === id ? null : id));
  };

  // Reset view to assembled state
  const handleResetView = () => {
    if (containerRef.current) {
      window.scrollTo({
        top: containerRef.current.offsetTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      ref={containerRef}
      id="teardown-3d"
      className="relative w-full h-[550vh] bg-slate-950 text-white select-none"
    >
      {/* ───────────────────────────────────────────────────────────── */}
      {/* PINNED STICKY 3D STAGE (100vh FULLSCREEN VIEWPORT)            */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div
        ref={stickyRef}
        className="sticky top-0 left-0 w-full h-screen overflow-hidden flex flex-col justify-between"
      >
        {/* Background Ambient Radial Glow */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_80%_at_50%_35%,rgba(14,165,233,0.18),transparent_70%)]" />
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_85%_70%,rgba(6,182,212,0.12),transparent_50%)]" />

        {/* ───────────────────────────────────────────────────────────── */}
        {/* TOP STATUS BAR & HEADER OVERLAY                               */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="relative z-20 w-full pt-6 px-4 sm:px-8 max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 text-xs font-mono font-bold tracking-wider uppercase backdrop-blur-md">
              <Sparkles className="h-3 w-3 animate-pulse" />
              <span>Scroll-Driven 3D Teardown</span>
              <span className="text-slate-500">•</span>
              <span className="text-white">Scene {currentScene.index} of 7</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight font-display text-white">
              {currentScene.tagline}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              {currentScene.subtext}
            </p>
          </div>

          {/* Interactive Controls Bar */}
          <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 rounded-full p-1.5 backdrop-blur-md shadow-2xl">
            <button
              type="button"
              onClick={() => setIsPaused(!isPaused)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title={isPaused ? "Resume subtle float" : "Pause float"}
            >
              {isPaused ? <Play className="h-3.5 w-3.5 text-cyan-400" /> : <Pause className="h-3.5 w-3.5 text-cyan-400" />}
              <span className="hidden sm:inline">{isPaused ? "Resume" : "Pause"}</span>
            </button>
            <button
              type="button"
              onClick={handleResetView}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Reset phone to assembled state"
            >
              <RotateCcw className="h-3.5 w-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* THREE.JS WEBGL CANVAS (HIGH-CONTRAST STUDIO LIGHTING)         */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="relative flex-1 w-full h-full min-h-[300px]">
          {isMounted && webglSupported && isInView ? (
            <Suspense
              fallback={
                <div className="h-full w-full grid place-items-center text-cyan-400 font-mono text-sm">
                  Loading 3D Smartphone Rig...
                </div>
              }
            >
              <Canvas
                gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
                dpr={[1, 2]}
                className="w-full h-full cursor-grab active:cursor-grabbing"
              >
                <PerspectiveCamera makeDefault position={[0, 0, 7.8]} fov={42} />

                {/* HIGH-CONTRAST 3-POINT STUDIO LIGHTING */}
                <ambientLight intensity={1.1} />
                {/* 1. Front Key Light (Bright Neutral) */}
                <directionalLight position={[4, 8, 8]} intensity={2.8} castShadow color="#ffffff" />
                {/* 2. Cyan Rim Light (Back-Side Definition) */}
                <directionalLight position={[-6, -3, -5]} intensity={3.5} color="#00f0ff" />
                {/* 3. Warm Fill Light (Soft Gold Shadow Fill) */}
                <directionalLight position={[-4, 5, 4]} intensity={1.5} color="#f59e0b" />
                {/* 4. Overhead Accent Spot */}
                <spotLight position={[0, 8, 2]} intensity={2.2} angle={0.6} penumbra={0.8} color="#e0f2fe" />

                <Float
                  speed={isPaused ? 0 : 1.5}
                  rotationIntensity={isPaused ? 0 : 0.15}
                  floatIntensity={isPaused ? 0 : 0.25}
                >
                  <SmartphoneProceduralRig
                    scrollProgress={scrollProgress}
                    isPaused={isPaused}
                    activeCallout={activeCallout}
                    onSelectCallout={handleSelectCallout}
                  />
                </Float>
              </Canvas>
            </Suspense>
          ) : (
            <Smartphone3DFallback />
          )}
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* BOTTOM METRICS, INTERACTIVE STEPPER & ACTION OVERLAYS         */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="relative z-20 w-full pb-6 px-4 sm:px-8 max-w-7xl mx-auto space-y-4">
          {/* Scene 7 Reassembly Call-to-Actions (Appears at 90%+ scroll) */}
          {scrollProgress > 0.88 && (
            <div className="mx-auto max-w-2xl rounded-3xl border border-cyan-500/50 bg-slate-900/95 p-5 sm:p-6 backdrop-blur-2xl shadow-2xl shadow-cyan-950/60 animate-in zoom-in-95 duration-400 text-center space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold">
                <CheckCircle2 className="h-3.5 w-3.5" /> 100% Diagnostic Verified
              </div>
              <h3 className="text-lg sm:text-2xl font-bold font-display text-white">
                Need Your Smartphone Inspected by a Master Technician?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
                Visit our Barganda Road laboratory (Near Shivam Clinic, Giridih) or get instant transparent estimates online.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                <a
                  href={`${BUSINESS_MASTER.whatsappBaseUrl}?text=Hello%20Super%20Telecom,%20I%20saw%20your%203D%20smartphone%20teardown%20and%20want%20to%20book%20a%20chip-level%20repair%20diagnosis.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-brand hover:scale-105 transition-transform"
                >
                  <MessageCircle className="h-4 w-4" /> Book Chip-Level Diagnostic
                </a>
                <a
                  href={BUSINESS_MASTER.phoneCallHref}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/90 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
                >
                  <Phone className="h-4 w-4 text-cyan-400" /> Call {BUSINESS_MASTER.phoneDisplay}
                </a>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById("diagnostics");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-cyan-400 underline underline-offset-4 hover:text-cyan-300 font-mono cursor-pointer"
                >
                  Run 16+ Free Hardware Tests <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Interactive Clickable 7-Step Stepper Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1 text-[10px] sm:text-xs font-mono">
              {STEPPER_STAGES.map((step) => {
                const isActive = currentScene.index === step.index;
                return (
                  <button
                    key={step.index}
                    type="button"
                    onClick={() => handleJumpToStep(step.progress)}
                    className={`px-2.5 py-1.5 rounded-xl whitespace-nowrap transition-all duration-200 cursor-pointer border ${
                      isActive
                        ? "bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/40 font-bold scale-105"
                        : "bg-slate-900/80 text-slate-400 border-slate-800/80 hover:text-cyan-300 hover:border-cyan-500/40 hover:bg-slate-800"
                    }`}
                  >
                    {step.label}
                  </button>
                );
              })}
            </div>

            {/* Visual Scrub Bar */}
            <div className="relative w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-indigo-500 transition-all duration-150 rounded-full"
                style={{ width: `${Math.round(scrollProgress * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { SmartphoneTeardown3D, Smartphone3DFallback };
export default SmartphoneTeardown3D;
