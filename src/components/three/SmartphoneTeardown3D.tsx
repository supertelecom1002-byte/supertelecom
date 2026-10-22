import React, { Suspense, useEffect, useRef, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Environment, PerspectiveCamera, Html } from "@react-three/drei";
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
} from "lucide-react";

// Ensure GSAP ScrollTrigger plugin is registered
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ─────────────────────────────────────────────────────────────────────────────
// HOTSPOT & SCENE DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

interface HotspotInfo {
  id: string;
  title: string;
  subtitle: string;
  sceneRange: [number, number];
  badgeText: string;
  icon: string;
  position3D: [number, number, number];
}

const HOTSPOTS: HotspotInfo[] = [
  {
    id: "amoled",
    title: "Super Retina AMOLED & 120Hz Digitizer",
    subtitle: "Zero-touch OCA lamination & microscopic flex cable bonding for factory-grade touch response.",
    sceneRange: [0.12, 0.28],
    badgeText: "Grade-A Display",
    icon: "layers",
    position3D: [0, 0.4, 1.8],
  },
  {
    id: "soc",
    title: "BGA SoC & Power IC Architecture",
    subtitle: "45X trinocular microscope micro-soldering, 0.02mm jumper lines & BGA chip reballing under ESD-safe control.",
    sceneRange: [0.28, 0.45],
    badgeText: "Chip-Level Lab",
    icon: "cpu",
    position3D: [-0.4, 1.2, 1.0],
  },
  {
    id: "battery",
    title: "5,000mAh Dual-Cell Li-ion & Qi2 Coil",
    subtitle: "Zero cycle degradation replacement cells with integrated NTC thermal sensors & short-circuit fuse protection.",
    sceneRange: [0.45, 0.62],
    badgeText: "Safe Battery",
    icon: "zap",
    position3D: [0.3, -0.6, 0.8],
  },
  {
    id: "cameras",
    title: "Triple OIS Camera Array & Sapphire Lens",
    subtitle: "Precision voice-coil optical stabilization alignment, laser autofocus sensor recovery & cleanroom dust elimination.",
    sceneRange: [0.62, 0.78],
    badgeText: "Optics Alignment",
    icon: "eye",
    position3D: [-0.6, 1.5, -0.6],
  },
  {
    id: "subboard",
    title: "High-Frequency USB-C Sub-Board",
    subtitle: "Reinforced 24-pin gold-plated Type-C power socket, noise-canceling MEMS mic & 5G coaxial antenna feeds.",
    sceneRange: [0.62, 0.78],
    badgeText: "Fast Charging",
    icon: "activity",
    position3D: [0, -2.2, -0.4],
  },
  {
    id: "haptics",
    title: "Acoustic Resonance Chamber & Taptic Engine",
    subtitle: "Sealed acoustic bass chamber, high-fidelity stereo earpiece & X-axis linear motor haptic calibration.",
    sceneRange: [0.78, 0.9],
    badgeText: "Acoustics",
    icon: "volume",
    position3D: [0.6, -2.0, -0.2],
  },
];

const SCENE_DESCRIPTIONS = [
  {
    index: 1,
    range: [0, 0.12],
    name: "Factory Integrity",
    tagline: "Flagship Engineering • Precision Inside & Out",
    subtext: "Scroll smoothly to initiate microscopic hardware disassembly sequence.",
  },
  {
    index: 2,
    range: [0.12, 0.28],
    name: "Display Separation",
    tagline: "Super Retina AMOLED & 120Hz Digitizer",
    subtext: "Ultra-thin OLED layer detached with zero stress on the copper touch matrix.",
  },
  {
    index: 3,
    range: [0.28, 0.45],
    name: "Motherboard & SoC",
    tagline: "Chip-Level BGA Micro-Soldering Bench",
    subtext: "Shield cans lift off exposing high-density SoC, PMIC & 0.02mm micro-traces.",
  },
  {
    index: 4,
    range: [0.45, 0.62],
    name: "Power Architecture",
    tagline: "5,000mAh Li-ion & Qi2 Induction Loop",
    subtext: "Dual pull-tab battery extraction and copper wireless charging coil isolation.",
  },
  {
    index: 5,
    range: [0.62, 0.78],
    name: "Optics & Sub-Board",
    tagline: "Triple OIS Camera & Reinforced Type-C",
    subtext: "Independent camera suspension prisms and 24-pin fast-charge sub-circuits.",
  },
  {
    index: 6,
    range: [0.78, 0.9],
    name: "Exploded Architecture",
    tagline: "Over 12 Integrated Subsystems Restored",
    subtext: "Complete 360° exploded inspection view. Every micro-component verified.",
  },
  {
    index: 7,
    range: [0.9, 1.0],
    name: "Factory Reassembly",
    tagline: "Engineered to Perfection. Restored to Factory Standards.",
    subtext: "Magnetic snap reassembly with dynamic diagnostic boot verification.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// PROCEDURAL PBR SMARTPHONE 3D RIG (12 INDEPENDENT NODES)
// ─────────────────────────────────────────────────────────────────────────────

interface SmartphoneRigProps {
  scrollProgress: number; // 0 to 1
  isPaused: boolean;
  activeHotspot: string | null;
  onSelectHotspot: (id: string) => void;
}

export function SmartphoneProceduralRig({
  scrollProgress,
  isPaused,
  activeHotspot,
  onSelectHotspot,
}: SmartphoneRigProps) {
  // Master group reference
  const mainRigRef = useRef<THREE.Group>(null);

  // 12 animatable component nodes
  const frontGlassRef = useRef<THREE.Group>(null);
  const oledDisplayRef = useRef<THREE.Group>(null);
  const frontSensorRef = useRef<THREE.Group>(null);
  const earpieceRef = useRef<THREE.Group>(null);
  const chassisRef = useRef<THREE.Group>(null);
  const motherboardRef = useRef<THREE.Group>(null);
  const batteryRef = useRef<THREE.Group>(null);
  const wirelessCoilRef = useRef<THREE.Group>(null);
  const cameraModuleRef = useRef<THREE.Group>(null);
  const subBoardRef = useRef<THREE.Group>(null);
  const speakerHapticsRef = useRef<THREE.Group>(null);
  const rearGlassRef = useRef<THREE.Group>(null);
  const emiShieldRef = useRef<THREE.Group>(null);
  const screwsGroupRef = useRef<THREE.Group>(null);

  // Internal materials memoized for performance
  const materials = useMemo(() => {
    return {
      titaniumChassis: new THREE.MeshStandardMaterial({
        color: "#1e242b",
        metalness: 0.88,
        roughness: 0.24,
      }),
      titaniumPolished: new THREE.MeshStandardMaterial({
        color: "#2a323d",
        metalness: 0.95,
        roughness: 0.12,
      }),
      frontGlass: new THREE.MeshPhysicalMaterial({
        color: "#e6f4ff",
        transmission: 0.94,
        opacity: 0.85,
        transparent: true,
        roughness: 0.04,
        ior: 1.52,
        reflectivity: 0.9,
        clearcoat: 1.0,
      }),
      rearGlass: new THREE.MeshPhysicalMaterial({
        color: "#161d24",
        roughness: 0.38,
        metalness: 0.15,
        clearcoat: 0.6,
        clearcoatRoughness: 0.2,
      }),
      amoledActive: new THREE.MeshStandardMaterial({
        color: "#0a0e14",
        roughness: 0.2,
        metalness: 0.1,
      }),
      screenEmissive: new THREE.MeshBasicMaterial({
        color: "#00f0ff",
        wireframe: true,
      }),
      pcbGreen: new THREE.MeshStandardMaterial({
        color: "#102318",
        roughness: 0.5,
        metalness: 0.2,
      }),
      copperGold: new THREE.MeshStandardMaterial({
        color: "#d4af37",
        metalness: 0.95,
        roughness: 0.18,
      }),
      emiShield: new THREE.MeshStandardMaterial({
        color: "#c0c7d0",
        metalness: 0.98,
        roughness: 0.15,
      }),
      batterySilver: new THREE.MeshStandardMaterial({
        color: "#1c2024",
        metalness: 0.45,
        roughness: 0.4,
      }),
      lensGlass: new THREE.MeshPhysicalMaterial({
        color: "#1e143b",
        transmission: 0.9,
        roughness: 0.05,
        ior: 1.62,
        reflectivity: 1.0,
      }),
      copperCoil: new THREE.MeshStandardMaterial({
        color: "#d97706",
        metalness: 0.9,
        roughness: 0.25,
      }),
      screwsMetallic: new THREE.MeshStandardMaterial({
        color: "#8a9ba8",
        metalness: 0.95,
        roughness: 0.2,
      }),
    };
  }, []);

  // Frame update loop to smoothly scrub positions based on GSAP scrollProgress
  useFrame((state, delta) => {
    if (!mainRigRef.current) return;

    const p = THREE.MathUtils.clamp(scrollProgress, 0, 1);

    // ─────────────────────────────────────────────────────────────
    // SCENE TIMINGS:
    // Scene 1: 0.00 -> 0.12 (Assembled isometric)
    // Scene 2: 0.12 -> 0.28 (Display & Front Glass lift)
    // Scene 3: 0.28 -> 0.45 (Chassis split, Motherboard tilts, EMI shield lifts)
    // Scene 4: 0.45 -> 0.62 (Battery slides, Coil floats)
    // Scene 5: 0.62 -> 0.78 (Cameras & Sub-board explode)
    // Scene 6: 0.78 -> 0.90 (Full exploded view with 360 float)
    // Scene 7: 0.90 -> 1.00 (Magnetic snap reassembly & screen power-on)
    // ─────────────────────────────────────────────────────────────

    // Interpolation curves
    const s1 = THREE.MathUtils.smoothstep(p, 0.0, 0.12);
    const s2 = THREE.MathUtils.smoothstep(p, 0.12, 0.28);
    const s3 = THREE.MathUtils.smoothstep(p, 0.28, 0.45);
    const s4 = THREE.MathUtils.smoothstep(p, 0.45, 0.62);
    const s5 = THREE.MathUtils.smoothstep(p, 0.62, 0.78);
    const s6 = THREE.MathUtils.smoothstep(p, 0.78, 0.90);
    const s7 = THREE.MathUtils.smoothstep(p, 0.90, 1.0);

    // Main Rig Turntable & Tilt
    const baseRotX = 0.2 + (s2 * 0.1) - (s3 * 0.2) + (s6 * 0.15) - (s7 * 0.25);
    const baseRotY = 0.45 + (s2 * 0.15) - (s3 * 0.3) + (s5 * 0.4) + (s6 * Math.PI * 0.6) - (s7 * Math.PI * 0.6 + s7 * 0.7);
    const idleFloat = !isPaused ? Math.sin(state.clock.elapsedTime * 1.2) * 0.04 : 0;

    mainRigRef.current.rotation.x = THREE.MathUtils.lerp(mainRigRef.current.rotation.x, baseRotX + idleFloat * 0.5, 0.1);
    mainRigRef.current.rotation.y = THREE.MathUtils.lerp(mainRigRef.current.rotation.y, baseRotY + (idleFloat * 0.8), 0.1);

    // 1. Front Glass (+Z forward lift)
    if (frontGlassRef.current) {
      const targetZ = 0.08 + (s2 * 1.8) + (s6 * 1.2) - (s7 * 2.92);
      frontGlassRef.current.position.z = THREE.MathUtils.lerp(frontGlassRef.current.position.z, targetZ, 0.15);
    }

    // 2. OLED Display (+Z forward lift behind glass)
    if (oledDisplayRef.current) {
      const targetZ = 0.05 + (s2 * 1.2) + (s6 * 0.9) - (s7 * 2.05);
      oledDisplayRef.current.position.z = THREE.MathUtils.lerp(oledDisplayRef.current.position.z, targetZ, 0.15);
    }

    // 3. Front Sensor & Earpiece
    if (frontSensorRef.current) {
      const targetZ = 0.06 + (s2 * 1.5) + (s6 * 1.0) - (s7 * 2.5);
      frontSensorRef.current.position.z = THREE.MathUtils.lerp(frontSensorRef.current.position.z, targetZ, 0.15);
    }
    if (earpieceRef.current) {
      const targetZ = 0.06 + (s2 * 1.4) + (s6 * 0.8) - (s7 * 2.2);
      earpieceRef.current.position.z = THREE.MathUtils.lerp(earpieceRef.current.position.z, targetZ, 0.15);
    }

    // 4. Motherboard (+Z lift + tilt forward + EMI shield separation)
    if (motherboardRef.current) {
      const targetZ = 0.02 + (s3 * 0.8) + (s6 * 0.6) - (s7 * 1.4);
      const targetRotX = -(s3 * 0.35) + (s7 * 0.35);
      motherboardRef.current.position.z = THREE.MathUtils.lerp(motherboardRef.current.position.z, targetZ, 0.15);
      motherboardRef.current.rotation.x = THREE.MathUtils.lerp(motherboardRef.current.rotation.x, targetRotX, 0.15);
    }
    if (emiShieldRef.current) {
      const targetShieldZ = 0.03 + (s3 * 0.6) + (s6 * 0.5) - (s7 * 1.1);
      emiShieldRef.current.position.z = THREE.MathUtils.lerp(emiShieldRef.current.position.z, targetShieldZ, 0.15);
    }

    // 5. Battery (lateral slide + forward float)
    if (batteryRef.current) {
      const targetX = (s4 * 0.4) + (s6 * 0.2) - (s7 * 0.6);
      const targetZ = 0.01 + (s4 * 0.5) + (s6 * 0.4) - (s7 * 0.9);
      batteryRef.current.position.x = THREE.MathUtils.lerp(batteryRef.current.position.x, targetX, 0.15);
      batteryRef.current.position.z = THREE.MathUtils.lerp(batteryRef.current.position.z, targetZ, 0.15);
    }

    // 6. Wireless Induction Coil
    if (wirelessCoilRef.current) {
      const targetZ = -0.04 - (s4 * 0.6) - (s6 * 0.5) + (s7 * 1.1);
      wirelessCoilRef.current.position.z = THREE.MathUtils.lerp(wirelessCoilRef.current.position.z, targetZ, 0.15);
    }

    // 7. Triple Rear Camera Module
    if (cameraModuleRef.current) {
      const targetZ = -0.06 - (s5 * 0.9) - (s6 * 0.7) + (s7 * 1.6);
      const targetY = 1.4 + (s5 * 0.3) - (s7 * 0.3);
      cameraModuleRef.current.position.z = THREE.MathUtils.lerp(cameraModuleRef.current.position.z, targetZ, 0.15);
      cameraModuleRef.current.position.y = THREE.MathUtils.lerp(cameraModuleRef.current.position.y, targetY, 0.15);
    }

    // 8. Bottom Sub-Board (USB-C & mic)
    if (subBoardRef.current) {
      const targetY = -2.1 - (s5 * 0.5) - (s6 * 0.4) + (s7 * 0.9);
      const targetZ = -0.02 - (s5 * 0.4) + (s7 * 0.4);
      subBoardRef.current.position.y = THREE.MathUtils.lerp(subBoardRef.current.position.y, targetY, 0.15);
      subBoardRef.current.position.z = THREE.MathUtils.lerp(subBoardRef.current.position.z, targetZ, 0.15);
    }

    // 9. Speaker & Haptics Module
    if (speakerHapticsRef.current) {
      const targetY = -2.1 - (s5 * 0.4) - (s6 * 0.3) + (s7 * 0.7);
      const targetZ = -0.03 - (s5 * 0.3) + (s7 * 0.3);
      speakerHapticsRef.current.position.y = THREE.MathUtils.lerp(speakerHapticsRef.current.position.y, targetY, 0.15);
      speakerHapticsRef.current.position.z = THREE.MathUtils.lerp(speakerHapticsRef.current.position.z, targetZ, 0.15);
    }

    // 10. Rear AG Glass & Screws
    if (rearGlassRef.current) {
      const targetZ = -0.08 - (s3 * 0.8) - (s5 * 0.8) - (s6 * 1.2) + (s7 * 2.8);
      rearGlassRef.current.position.z = THREE.MathUtils.lerp(rearGlassRef.current.position.z, targetZ, 0.15);
    }
    if (screwsGroupRef.current) {
      const targetScrewSpread = (s2 * 0.8) + (s6 * 1.0) - (s7 * 1.8);
      screwsGroupRef.current.position.z = -0.1 - (targetScrewSpread * 0.8);
    }
  });

  return (
    <group ref={mainRigRef} position={[0, 0, 0]}>
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. FRONT PROTECTIVE GLASS                                    */}
      {/* ───────────────────────────────────────────────────────────── */}
      <group ref={frontGlassRef} position={[0, 0, 0.08]}>
        <mesh material={materials.frontGlass} castShadow receiveShadow>
          <boxGeometry args={[2.8, 5.8, 0.04]} />
        </mesh>
        {/* Beveled black edge border */}
        <mesh position={[0, 0, -0.005]}>
          <boxGeometry args={[2.76, 5.76, 0.03]} />
          <meshBasicMaterial color="#020617" wireframe />
        </mesh>
      </group>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. SUPER RETINA AMOLED DISPLAY + DIGITIZER RIBBON             */}
      {/* ───────────────────────────────────────────────────────────── */}
      <group ref={oledDisplayRef} position={[0, 0, 0.05]}>
        <mesh material={materials.amoledActive}>
          <boxGeometry args={[2.68, 5.68, 0.02]} />
        </mesh>
        {/* Active high-tech micro-matrix emissive grid */}
        <mesh position={[0, 0, 0.012]}>
          <planeGeometry args={[2.55, 5.45, 12, 24]} />
          <meshBasicMaterial
            color={scrollProgress > 0.9 ? "#38bdf8" : "#0284c7"}
            wireframe
            transparent
            opacity={scrollProgress > 0.9 ? 0.85 : 0.45}
          />
        </mesh>
        {/* Screen center boot logo / diagnostic HUD */}
        {scrollProgress > 0.9 && (
          <mesh position={[0, 0.2, 0.015]}>
            <circleGeometry args={[0.5, 32]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.7} />
          </mesh>
        )}
        {/* Copper digitizer flex ribbon leading to motherboard */}
        <mesh position={[0, -2.7, 0.02]} rotation={[0.4, 0, 0]}>
          <boxGeometry args={[0.8, 0.5, 0.01]} />
          <primitive object={materials.copperGold} attach="material" />
        </mesh>
      </group>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. FRONT CAMERA & SENSORS                                    */}
      {/* ───────────────────────────────────────────────────────────── */}
      <group ref={frontSensorRef} position={[0, 2.5, 0.06]}>
        <mesh material={materials.lensGlass}>
          <cylinderGeometry args={[0.1, 0.1, 0.04, 24]} />
        </mesh>
        <mesh position={[0.3, 0, 0]}>
          <boxGeometry args={[0.15, 0.08, 0.03]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      </group>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 4. EARPIECE ACOUSTIC RECEIVER                                 */}
      {/* ───────────────────────────────────────────────────────────── */}
      <group ref={earpieceRef} position={[0, 2.75, 0.06]}>
        <mesh>
          <boxGeometry args={[0.7, 0.06, 0.03]} />
          <meshStandardMaterial color="#334155" roughness={0.6} />
        </mesh>
      </group>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 5. TITANIUM MID-FRAME CHASSIS (CENTRAL ANCHOR)               */}
      {/* ───────────────────────────────────────────────────────────── */}
      <group ref={chassisRef} position={[0, 0, 0]}>
        {/* Main outer rim */}
        <mesh material={materials.titaniumChassis} castShadow receiveShadow>
          <boxGeometry args={[2.84, 5.84, 0.18]} />
        </mesh>
        {/* Inner cavity cutouts for battery and PCB */}
        <mesh position={[-0.4, 0.8, 0.02]}>
          <boxGeometry args={[1.6, 2.4, 0.16]} />
          <meshStandardMaterial color="#0f172a" roughness={0.7} />
        </mesh>
        {/* Side power button (+X) */}
        <mesh position={[1.43, 0.8, 0]} material={materials.titaniumPolished}>
          <boxGeometry args={[0.04, 0.6, 0.08]} />
        </mesh>
        {/* Side volume rocker (-X) */}
        <mesh position={[-1.43, 0.9, 0]} material={materials.titaniumPolished}>
          <boxGeometry args={[0.04, 1.0, 0.08]} />
        </mesh>
        {/* Antenna band isolation slits */}
        <mesh position={[1.42, 2.0, 0]}>
          <boxGeometry args={[0.02, 0.04, 0.19]} />
          <meshBasicMaterial color="#020617" />
        </mesh>
        <mesh position={[-1.42, 2.0, 0]}>
          <boxGeometry args={[0.02, 0.04, 0.19]} />
          <meshBasicMaterial color="#020617" />
        </mesh>
      </group>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 6. MOTHERBOARD PCB & BGA PROCESSOR                            */}
      {/* ───────────────────────────────────────────────────────────── */}
      <group ref={motherboardRef} position={[-0.4, 1.1, 0.02]}>
        {/* L-shaped PCB substrate */}
        <mesh material={materials.pcbGreen} castShadow>
          <boxGeometry args={[1.5, 2.2, 0.04]} />
        </mesh>
        {/* Gold BGA SoC Processor Package */}
        <mesh position={[0, 0.2, 0.03]} material={materials.copperGold}>
          <boxGeometry args={[0.65, 0.65, 0.03]} />
        </mesh>
        {/* Power Management IC (PMIC) */}
        <mesh position={[0.45, -0.4, 0.03]}>
          <boxGeometry args={[0.3, 0.4, 0.025]} />
          <meshStandardMaterial color="#090d16" roughness={0.3} metalness={0.6} />
        </mesh>
        {/* SMD Capacitor & Resistor Grid */}
        <group position={[-0.35, -0.3, 0.03]}>
          {[-0.1, 0, 0.1].map((x, i) =>
            [-0.15, 0, 0.15].map((y, j) => (
              <mesh key={`${i}-${j}`} position={[x, y, 0]}>
                <boxGeometry args={[0.05, 0.03, 0.02]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
              </mesh>
            ))
          )}
        </group>
        {/* Metallic EMI Shield Can (Lifts off in Scene 3) */}
        <group ref={emiShieldRef} position={[0, 0.2, 0.05]}>
          <mesh material={materials.emiShield} castShadow>
            <boxGeometry args={[0.8, 0.8, 0.04]} />
          </mesh>
          <mesh position={[0, 0, 0.025]}>
            <planeGeometry args={[0.7, 0.7]} />
            <meshBasicMaterial color="#64748b" wireframe />
          </mesh>
        </group>
      </group>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 7. 5,000mAh LI-ION BATTERY POUCH                              */}
      {/* ───────────────────────────────────────────────────────────── */}
      <group ref={batteryRef} position={[0.35, -0.6, 0.01]}>
        <mesh material={materials.batterySilver} castShadow>
          <boxGeometry args={[1.55, 3.1, 0.14]} />
        </mesh>
        {/* Warning label & technical silkscreen */}
        <mesh position={[0, 0, 0.075]}>
          <planeGeometry args={[1.3, 2.7]} />
          <meshBasicMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0, 0.4, 0.076]}>
          <planeGeometry args={[1.1, 0.3]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        {/* Quick release dual pull-tabs at bottom */}
        <mesh position={[-0.3, -1.6, 0.02]}>
          <boxGeometry args={[0.3, 0.15, 0.02]} />
          <meshStandardMaterial color="#020617" />
        </mesh>
        <mesh position={[0.3, -1.6, 0.02]}>
          <boxGeometry args={[0.3, 0.15, 0.02]} />
          <meshStandardMaterial color="#020617" />
        </mesh>
      </group>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 8. QI2 COPPER WIRELESS INDUCTION COIL                         */}
      {/* ───────────────────────────────────────────────────────────── */}
      <group ref={wirelessCoilRef} position={[0, -0.2, -0.04]}>
        {/* Dark magnetic ferrite disc */}
        <mesh>
          <cylinderGeometry args={[0.9, 0.9, 0.02, 32]} />
          <meshStandardMaterial color="#090d16" roughness={0.8} />
        </mesh>
        {/* Concentric copper winding rings */}
        {[0.4, 0.55, 0.7, 0.82].map((radius, idx) => (
          <mesh key={idx} rotation={[Math.PI / 2, 0, 0]} material={materials.copperCoil}>
            <torusGeometry args={[radius, 0.025, 8, 32]} />
          </mesh>
        ))}
      </group>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 9. TRIPLE REAR CAMERA MODULE                                  */}
      {/* ───────────────────────────────────────────────────────────── */}
      <group ref={cameraModuleRef} position={[-0.6, 1.4, -0.06]}>
        {/* Camera island base */}
        <mesh material={materials.titaniumPolished} castShadow>
          <boxGeometry args={[1.1, 1.3, 0.16]} />
        </mesh>
        {/* Main 108MP OIS Lens Barrel */}
        <group position={[-0.22, 0.3, -0.1]}>
          <mesh material={materials.copperGold}>
            <cylinderGeometry args={[0.26, 0.26, 0.1, 24]} />
          </mesh>
          <mesh position={[0, -0.05, 0]} material={materials.lensGlass}>
            <sphereGeometry args={[0.2, 16, 16]} />
          </mesh>
        </group>
        {/* Ultra-Wide Lens */}
        <group position={[-0.22, -0.3, -0.1]}>
          <mesh material={materials.copperGold}>
            <cylinderGeometry args={[0.22, 0.22, 0.08, 24]} />
          </mesh>
          <mesh position={[0, -0.04, 0]} material={materials.lensGlass}>
            <sphereGeometry args={[0.16, 16, 16]} />
          </mesh>
        </group>
        {/* Periscope Telephoto Prism Module */}
        <group position={[0.24, 0.1, -0.08]}>
          <mesh material={materials.titaniumChassis}>
            <boxGeometry args={[0.3, 0.35, 0.08]} />
          </mesh>
        </group>
        {/* Quad LED True-Tone Flash */}
        <mesh position={[0.24, -0.35, -0.08]}>
          <cylinderGeometry args={[0.1, 0.1, 0.04, 16]} />
          <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.5} />
        </mesh>
      </group>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 10. USB-C SUB-BOARD & MEMS MIC                                */}
      {/* ───────────────────────────────────────────────────────────── */}
      <group ref={subBoardRef} position={[0, -2.1, -0.02]}>
        <mesh material={materials.pcbGreen}>
          <boxGeometry args={[1.8, 0.6, 0.04]} />
        </mesh>
        {/* 24-Pin Gold Plated USB-C Port */}
        <mesh position={[0, -0.32, 0]} material={materials.copperGold}>
          <boxGeometry args={[0.55, 0.14, 0.1]} />
        </mesh>
        {/* MEMS Microphone hole */}
        <mesh position={[-0.6, 0, 0.02]}>
          <cylinderGeometry args={[0.04, 0.04, 0.05, 12]} />
          <meshBasicMaterial color="#020617" />
        </mesh>
      </group>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 11. STEREO SPEAKER CHAMBER & TAPTIC ENGINE                    */}
      {/* ───────────────────────────────────────────────────────────── */}
      <group ref={speakerHapticsRef} position={[0.6, -2.1, -0.03]}>
        {/* Acoustic bass chamber box */}
        <mesh>
          <boxGeometry args={[0.7, 0.5, 0.08]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} />
        </mesh>
        {/* X-axis Linear Resonant Haptic Actuator (Taptic Engine) */}
        <mesh position={[0, 0.35, 0]} material={materials.titaniumPolished}>
          <boxGeometry args={[0.55, 0.22, 0.06]} />
        </mesh>
      </group>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 12. REAR MATTE AG GLASS & TORX SCREWS                         */}
      {/* ───────────────────────────────────────────────────────────── */}
      <group ref={rearGlassRef} position={[0, 0, -0.08]}>
        <mesh material={materials.rearGlass} castShadow receiveShadow>
          <boxGeometry args={[2.8, 5.8, 0.04]} />
        </mesh>
        {/* Camera island glass aperture cutout */}
        <mesh position={[-0.6, 1.4, -0.022]}>
          <boxGeometry args={[1.15, 1.35, 0.02]} />
          <meshStandardMaterial color="#020617" roughness={0.1} />
        </mesh>
        {/* Subtle Super Telecom laser-etched branding badge */}
        <mesh position={[0, -0.6, -0.022]}>
          <planeGeometry args={[1.2, 0.3]} />
          <meshBasicMaterial color="#475569" transparent opacity={0.6} />
        </mesh>
      </group>

      {/* 8 Exploding Miniature Torx Screws */}
      <group ref={screwsGroupRef} position={[0, 0, -0.1]}>
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
            <cylinderGeometry args={[0.035, 0.035, 0.08, 12]} />
          </mesh>
        ))}
      </group>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3D INTERACTIVE HOTSPOT PIN MARKERS (HTML LABELS IN SCENE)     */}
      {/* ───────────────────────────────────────────────────────────── */}
      {HOTSPOTS.map((spot) => {
        const isVisible =
          scrollProgress >= spot.sceneRange[0] - 0.05 &&
          scrollProgress <= spot.sceneRange[1] + 0.05;

        if (!isVisible) return null;

        const isCurrentActive = activeHotspot === spot.id;

        return (
          <group key={spot.id} position={spot.position3D}>
            <Html center distanceFactor={10} zIndexRange={[100, 0]}>
              <button
                type="button"
                onClick={() => onSelectHotspot(spot.id)}
                aria-label={`Inspect ${spot.title}`}
                className={`group relative flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur-md transition-all duration-300 shadow-xl ${
                  isCurrentActive
                    ? "bg-cyan-500 text-slate-950 scale-110 ring-4 ring-cyan-400/40"
                    : "bg-slate-900/90 text-cyan-300 border border-cyan-500/50 hover:bg-cyan-950 hover:scale-105"
                }`}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
                </span>
                <span className="whitespace-nowrap tracking-wide font-mono text-[11px]">
                  {spot.badgeText}
                </span>
              </button>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WEBGL FALLBACK BOUNDARY COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

function Smartphone3DFallback({ error }: { error?: Error }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center bg-slate-950 text-white rounded-3xl border border-slate-800">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 mb-4 shadow-lg shadow-cyan-950/50">
        <Smartphone className="h-8 w-8" />
      </div>
      <h3 className="text-xl font-bold font-display text-white">
        Precision Smartphone Architecture
      </h3>
      <p className="mt-2 text-sm text-slate-400 max-w-md leading-relaxed">
        Hardware accelerated WebGL view is currently in blueprint mode. Explore our verified chip-level micro-soldering and display replacement standards.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <a
          href={BUSINESS_MASTER.phoneCallHref}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-brand"
        >
          <Phone className="h-3.5 w-3.5" /> Call Technician
        </a>
        <a
          href={`${BUSINESS_MASTER.whatsappBaseUrl}?text=Hello%20Super%20Telecom,%20I%20want%20to%20inquire%20about%20chip-level%20repair`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-950/40 px-4 py-2.5 text-xs font-semibold text-emerald-300"
        >
          <MessageCircle className="h-3.5 w-3.5" /> WhatsApp Lab
        </a>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SCROLL-DRIVEN 3D TEARDOWN CONTROLLER (550vh PINNED CONTAINER)
// ─────────────────────────────────────────────────────────────────────────────

export const SmartphoneTeardown3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [webglSupported, setWebglSupported] = useState(true);
  const [isInView, setIsInView] = useState(true);

  // Check WebGL availability and reduced-motion preference
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
    return () => observer.disconnect();
  }, []);

  // GSAP ScrollTrigger timeline pinning
  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 1.2,
      onUpdate: (self) => {
        setScrollProgress(self.progress);
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  // Active scene info based on scroll progress
  const currentScene = useMemo(() => {
    const found = SCENE_DESCRIPTIONS.find(
      (s) => scrollProgress >= s.range[0] && scrollProgress <= s.range[1]
    );
    return found || SCENE_DESCRIPTIONS[0];
  }, [scrollProgress]);

  // Handle hotspot quick inspection click
  const handleSelectHotspot = (id: string) => {
    setActiveHotspot((prev) => (prev === id ? null : id));
    const target = HOTSPOTS.find((h) => h.id === id);
    if (target && containerRef.current) {
      const midScroll = (target.sceneRange[0] + target.sceneRange[1]) / 2;
      const totalScrollHeight = containerRef.current.offsetHeight - window.innerHeight;
      const targetScrollTop = containerRef.current.offsetTop + midScroll * totalScrollHeight;

      window.scrollTo({
        top: targetScrollTop,
        behavior: "smooth",
      });
    }
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
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_80%_at_50%_35%,rgba(14,165,233,0.15),transparent_70%)]" />
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_85%_70%,rgba(6,182,212,0.08),transparent_50%)]" />

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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title={isPaused ? "Resume subtle float" : "Pause float"}
            >
              {isPaused ? <Play className="h-3.5 w-3.5 text-cyan-400" /> : <Pause className="h-3.5 w-3.5 text-cyan-400" />}
              <span className="hidden sm:inline">{isPaused ? "Resume" : "Pause"}</span>
            </button>
            <button
              type="button"
              onClick={handleResetView}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Reset phone to assembled state"
            >
              <RotateCcw className="h-3.5 w-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* THREE.JS WEBGL CANVAS (RENDER ENGINE)                         */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="relative flex-1 w-full h-full min-h-[300px]">
          {webglSupported && isInView ? (
            <Suspense fallback={<div className="h-full w-full grid place-items-center text-cyan-400 font-mono text-sm">Loading 3D Smartphone Rig...</div>}>
              <Canvas
                gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
                dpr={[1, 2]}
                className="w-full h-full cursor-grab active:cursor-grabbing"
              >
                <PerspectiveCamera makeDefault position={[0, 0, 7.8]} fov={42} />
                <ambientLight intensity={0.8} />
                <directionalLight position={[5, 8, 5]} intensity={1.5} castShadow />
                <directionalLight position={[-5, -4, -4]} intensity={0.6} color="#38bdf8" />
                <pointLight position={[0, 0, 4]} intensity={0.5} color="#38bdf8" />

                <Float
                  speed={isPaused ? 0 : 1.5}
                  rotationIntensity={isPaused ? 0 : 0.2}
                  floatIntensity={isPaused ? 0 : 0.3}
                >
                  <SmartphoneProceduralRig
                    scrollProgress={scrollProgress}
                    isPaused={isPaused}
                    activeHotspot={activeHotspot}
                    onSelectHotspot={handleSelectHotspot}
                  />
                </Float>
              </Canvas>
            </Suspense>
          ) : (
            <Smartphone3DFallback />
          )}
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* BOTTOM METRICS, SCRUBBER & FINAL ACTION CTA OVERLAYS         */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="relative z-20 w-full pb-6 px-4 sm:px-8 max-w-7xl mx-auto space-y-4">
          {/* Active Hotspot Detail Card Popup */}
          {activeHotspot && (
            <div className="mx-auto max-w-xl rounded-2xl border border-cyan-500/40 bg-slate-900/95 p-4 backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-300">
              {(() => {
                const spot = HOTSPOTS.find((h) => h.id === activeHotspot);
                if (!spot) return null;
                return (
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-400 font-mono text-[10px] uppercase font-bold">
                          {spot.badgeText}
                        </span>
                        <h4 className="font-display font-bold text-sm text-white">{spot.title}</h4>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{spot.subtitle}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveHotspot(null)}
                      className="rounded-full p-1 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-xs"
                      aria-label="Close hotspot detail"
                    >
                      ✕
                    </button>
                  </div>
                );
              })()}
            </div>
          )}

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
                  className="inline-flex items-center gap-1.5 text-xs text-cyan-400 underline underline-offset-4 hover:text-cyan-300 font-mono"
                >
                  Run 16+ Free Hardware Tests <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Persistent Scrubber & Scene Indicators */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>01. ASSEMBLED</span>
              <span>02. DISPLAY</span>
              <span>03. MOTHERBOARD</span>
              <span>04. BATTERY</span>
              <span>05. OPTICS</span>
              <span>06. EXPLODED</span>
              <span>07. REASSEMBLED</span>
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

export default SmartphoneTeardown3D;
