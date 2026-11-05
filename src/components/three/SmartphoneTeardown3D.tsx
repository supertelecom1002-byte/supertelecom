import React, { Suspense, useEffect, useRef, useState, useMemo, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PerspectiveCamera, useGLTF } from "@react-three/drei";
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
  MessageCircle,
  Clock,
  Zap,
  Eye,
  Activity,
  CheckCircle2,
  X,
} from "lucide-react";
import { Smartphone3DFallback } from "./Smartphone3DFallback";
import {
  createSmartphoneScreenTexture,
  createSmartphoneBackTexture,
} from "@/utils/smartphoneScreenTexture";

// Ensure GSAP ScrollTrigger plugin is registered in browser
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ─────────────────────────────────────────────────────────────────────────────
// CRASH-PROOF ERROR BOUNDARY FOR 3D TEARDOWN
// ─────────────────────────────────────────────────────────────────────────────
interface Safe3DProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
}
interface Safe3DState {
  hasError: boolean;
}
class Safe3DErrorBoundary extends React.Component<Safe3DProps, Safe3DState> {
  constructor(props: Safe3DProps) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err: Error) {
    console.warn("SmartphoneTeardown3D caught error:", err);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          {this.props.fallback}
        </div>
      );
    }
    return <div className="relative w-full h-full">{this.props.children}</div>;
  }
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
    hindiTitle: "120Hz AMOLED डिस्प्ले व टच डिजिटाइज़र",
    englishTitle: "120Hz Super Retina AMOLED & Touch Digitizer",
    symptoms: "टूटी स्क्रीन, ग्रीन/पिंक लाइन, ब्लैक स्पॉट, टच अनरेस्पॉन्सिव या फ्लिकरिंग।",
    startingPrice: "परामर्श उपलब्ध",
    timeEstimate: "30–60 मिनट",
    warranty: "90 दिन वारंटी",
    sceneRange: [0.10, 0.32],
    badgeText: "AMOLED Display",
    icon: "layers",
    position3D: [0, 0.4, 0.55],
  },
  {
    id: "motherboard",
    hindiTitle: "मदरबोर्ड, BGA चिप व पावर IC",
    englishTitle: "Chip-Level Logic Board & BGA PMIC",
    symptoms: "डेड फोन, ऑटो-रीस्टार्ट, नो नेटवर्क/नो सिम, चार्जिंग एरर, शार्ट सर्किट।",
    startingPrice: "परामर्श उपलब्ध",
    timeEstimate: "2–4 घंटे",
    warranty: "60–90 दिन वारंटी",
    sceneRange: [0.26, 0.50],
    badgeText: "Logic Board & IC",
    icon: "cpu",
    position3D: [-0.4, 1.1, 0.45],
  },
  {
    id: "battery",
    hindiTitle: "5,000mAh लिथियम बैटरी पैक",
    englishTitle: "High-Density Li-Ion Battery & Thermal Guard",
    symptoms: "बैटरी जल्दी ड्रेन होना, 40% पर फोन बंद होना, हीटिंग या बैटरी फूलना।",
    startingPrice: "परामर्श उपलब्ध",
    timeEstimate: "30–45 मिनट",
    warranty: "6 महीने वारंटी",
    sceneRange: [0.44, 0.68],
    badgeText: "Battery Pack",
    icon: "zap",
    position3D: [0.35, -0.6, 0.45],
  },
  {
    id: "camera",
    hindiTitle: "ट्रिपल OIS कैमरा व सफायर लेंस",
    englishTitle: "Triple OIS Camera Array & Sapphire Lens",
    symptoms: "धुंधली फोटो, कैमरा शेकिंग/वाइब्रेशन, टूटा लेंस शीशा, ब्लैक कैमरा ऐप।",
    startingPrice: "परामर्श उपलब्ध",
    timeEstimate: "45 मिनट",
    warranty: "90 दिन वारंटी",
    sceneRange: [0.60, 0.82],
    badgeText: "Triple Camera",
    icon: "eye",
    position3D: [-0.6, 1.4, -0.45],
  },
  {
    id: "subboard",
    hindiTitle: "USB-C चार्जिंग सब-बोर्ड व माइक",
    englishTitle: "Reinforced Type-C Sub-Board & MEMS Mic",
    symptoms: "ढीला चार्जर, स्लो चार्जिंग, कॉल में आवाज़ कटना या नो साउंड।",
    startingPrice: "परामर्श उपलब्ध",
    timeEstimate: "30 मिनट",
    warranty: "90 दिन वारंटी",
    sceneRange: [0.62, 0.88],
    badgeText: "Charging Port",
    icon: "activity",
    position3D: [0, -2.1, -0.35],
  },
];

export interface StepperStage {
  index: number;
  label: string;
  shortName: string;
  progress: number;
  range: [number, number];
  tagline: string;
  subtext: string;
}

export const STEPPER_STAGES: StepperStage[] = [
  {
    index: 1,
    label: "01. ASSEMBLED",
    shortName: "Assembled",
    progress: 0.02,
    range: [0, 0.12],
    tagline: "फ्लैगशिप स्मार्टफोन आर्किटेक्चर • 100% सील्ड चेसिस",
    subtext: "स्क्रॉल करें या नीचे बटन दबाएं और गिरिडीह लैब की माइक्रोस्कोपिक रिपेयर बेंच का अनुभव लें।",
  },
  {
    index: 2,
    label: "02. DISPLAY",
    shortName: "AMOLED Screen",
    progress: 0.20,
    range: [0.12, 0.28],
    tagline: "120Hz सुपर रेटिना AMOLED व टच डिजिटाइज़र",
    subtext: "बिना कॉपर टच मैट्रिक्स को नुकसान पहुंचाए ओसीए वैक्यूम तकनीक से ग्लास अलग किया जाता है।",
  },
  {
    index: 3,
    label: "03. MOTHERBOARD",
    shortName: "Logic Board & IC",
    progress: 0.36,
    range: [0.28, 0.45],
    tagline: "चिप-लेवल BGA माइक्रो-सोल्डरिंग बेंच",
    subtext: "सिल्वर ईएमआई शील्ड हटते ही हाई-डेंसिटी चिपसेट, पीएमआईसी और 0.02mm माइक्रो-जंपर दिखते हैं।",
  },
  {
    index: 4,
    label: "04. BATTERY",
    shortName: "Li-Ion Battery",
    progress: 0.53,
    range: [0.45, 0.62],
    tagline: "5,000mAh लिथियम-आयन व Qi2 वायरलेस इंडक्शन लूप",
    subtext: "थर्मल गार्ड प्रोटेक्शन व ओरिजिनल बीएमएस कंट्रोलर के साथ सुरक्षित बैटरी इंस्टॉलेशन।",
  },
  {
    index: 5,
    label: "05. CAMERAS",
    shortName: "Optics & Port",
    progress: 0.70,
    range: [0.62, 0.78],
    tagline: "ट्रिपल OIS कैमरा बैरल व रीइन्फोर्स्ड Type-C",
    subtext: "सफायर लेंस सुरक्षा और 24-पिन फास्ट चार्जिंग सब-सर्किट की क्लीनरूम जांच।",
  },
  {
    index: 6,
    label: "06. EXPLODED",
    shortName: "360° Exploded",
    progress: 0.85,
    range: [0.78, 0.90],
    tagline: "पूर्ण 360° एक्सप्लोडेड 3D आर्किटेक्चर",
    subtext: "19 अलग-अलग हार्डवेयर लेयर्स एक साथ अलग होकर हर कॉम्पोनेन्ट की स्थिति दर्शाते हैं।",
  },
  {
    index: 7,
    label: "07. REASSEMBLED",
    shortName: "Diagnostic Ready",
    progress: 0.98,
    range: [0.90, 1.0],
    tagline: "मैग्नेटिक री-असेंबली व 100% बेंच टेस्टेड रेडी",
    subtext: "फोन पूरी तरह पैक और 16-पॉइंट हार्डवेयर डायग्नोस्टिक पास करके डिलीवरी के लिए तैयार।",
  },
];

// Preload the GLB model asset
if (typeof window !== "undefined") {
  useGLTF.preload("/models/smartphone_teardown.glb");
}

// ─────────────────────────────────────────────────────────────────────────────
// GLB MODEL RIG (19 SUB-ASSEMBLIES INTERPOLATED IN useFrame)
// ─────────────────────────────────────────────────────────────────────────────

interface GLBRigProps {
  scrollProgressRef: React.MutableRefObject<number>;
  isPaused: boolean;
  activeCallout: string | null;
  onSelectCallout: (id: string) => void;
  userRotation: { x: number; y: number };
  onStageChange: (stageIndex: number) => void;
}

function SmartphoneGLBRig({
  scrollProgressRef,
  isPaused,
  activeCallout,
  onSelectCallout,
  userRotation,
  onStageChange,
}: GLBRigProps) {
  const gltf = useGLTF("/models/smartphone_teardown.glb");
  const rigGroupRef = useRef<THREE.Group>(null);
  const currentStageIndexRef = useRef(1);

  // Deep clone scene and materials to prevent cross-contamination
  const scene = useMemo(() => {
    const c = gltf.scene.clone(true);
    c.traverse((node) => {
      if ((node as THREE.Mesh).isMesh) {
        const mesh = node as THREE.Mesh;
        if (Array.isArray(mesh.material)) {
          mesh.material = mesh.material.map((m) => m.clone());
        } else if (mesh.material) {
          mesh.material = mesh.material.clone();
        }
      }
    });
    return c;
  }, [gltf.scene]);

  // Generate realistic high-res OLED screen and frosted back panel textures
  const screenTexture = useMemo(() => createSmartphoneScreenTexture(), []);
  const backTexture = useMemo(() => createSmartphoneBackTexture(), []);

  // Map nodes by name for fast lookup in useFrame
  const nodeMap = useMemo(() => {
    const map = new Map<string, THREE.Object3D>();
    scene.traverse((child) => {
      if (child.name) {
        map.set(child.name, child);
      }
    });
    return map;
  }, [scene]);

  // Enhance materials on mount: ensure realistic glass, OLED black, and metallic frame
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (mat) {
          mat.envMapIntensity = 1.2;
          const name = (mesh.name || child.name || child.parent?.name || "").toLowerCase();

          if (name.includes("frontglass")) {
            mat.roughness = 0.02;
            mat.metalness = 0.05;
            mat.transparent = true;
            mat.opacity = 0.04; // Crystal clear protective ceramic shield glass
            mat.depthWrite = false;
            mat.color = new THREE.Color("#ffffff");
            mat.needsUpdate = true;
          } else if (name.includes("touchdigitizer")) {
            mat.transparent = true;
            mat.opacity = 0.12;
            mat.depthWrite = false;
            mat.needsUpdate = true;
          } else if (name.includes("oleddisplay")) {
            const displayTex = screenTexture || mat.map;
            if (displayTex) {
              mat.map = displayTex;
              mat.emissiveMap = displayTex;
              mat.emissive = new THREE.Color("#ffffff");
              mat.emissiveIntensity = 0.95; // Ultra-crisp glowing AMOLED flagship display
              mat.color = new THREE.Color("#ffffff"); // Full-spectrum texture multiplier
              mat.roughness = 0.10;
              mat.metalness = 0.05;
              mat.needsUpdate = true;
            }
          } else if (name.includes("chassisframe")) {
            mat.metalness = 0.94;
            mat.roughness = 0.22;
            mat.color = new THREE.Color("#cbd5e1");
            mat.needsUpdate = true;
          } else if (name.includes("rearcover")) {
            const coverTex = backTexture || mat.map;
            if (coverTex) {
              mat.map = coverTex;
              mat.color = new THREE.Color("#ffffff");
              mat.needsUpdate = true;
            }
            mat.metalness = 0.38;
            mat.roughness = 0.28;
            mat.color = new THREE.Color("#0f172a");
          } else if (name.includes("processorsoc") || name.includes("pmic")) {
            mat.color = new THREE.Color("#064e3b");
            mat.emissive = new THREE.Color("#10b981");
            mat.emissiveIntensity = 0.85;
          } else if (name.includes("motherboard")) {
            mat.color = new THREE.Color("#065f46");
            mat.metalness = 0.25;
            mat.roughness = 0.45;
          } else if (name.includes("battery")) {
            mat.color = new THREE.Color("#1e293b");
            mat.metalness = 0.40;
            mat.roughness = 0.35;
          } else if (name.includes("wirelesscoil") || name.includes("chargingflex")) {
            mat.color = new THREE.Color("#d97706");
            mat.metalness = 0.88;
            mat.roughness = 0.22;
          } else if (name.includes("shieldcover") || name.includes("screws")) {
            mat.metalness = 0.96;
            mat.roughness = 0.18;
            mat.color = new THREE.Color("#e2e8f0");
          }
        }
      }
    });
  }, [scene, screenTexture, backTexture]);

  useFrame((_, delta) => {
    if (!rigGroupRef.current) return;

    const p = THREE.MathUtils.clamp(scrollProgressRef.current, 0, 1);

    // Determine current stage index and notify parent if changed
    let stageIdx = 1;
    for (let i = 0; i < STEPPER_STAGES.length; i++) {
      const s = STEPPER_STAGES[i];
      if (p >= s.range[0] && p <= s.range[1]) {
        stageIdx = s.index;
        break;
      }
    }
    if (stageIdx !== currentStageIndexRef.current) {
      currentStageIndexRef.current = stageIdx;
      onStageChange(stageIdx);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // DYNAMIC TRANSFORMS ACROSS 7 SCENES (A through G)
    // Balanced, cinematic translations that stay comfortably in frame!
    // ─────────────────────────────────────────────────────────────────────────
    let targetFrontGlassZ = 0;
    let targetTouchDigitizerZ = 0;
    let targetOLEDDisplayZ = 0;
    let targetChassisZ = 0;
    let targetRearCoverZ = 0;
    let targetBatteryZ = 0;
    let targetMotherboardZ = 0;
    let targetShieldCoverZ = 0;
    let targetProcessorSoCZ = 0;
    let targetPMICZ = 0;
    let targetCameraModuleZ = 0;
    let targetChargingPortZ = 0;
    let targetUSBPortZ = 0;
    let targetChargingFlexZ = 0;
    let targetLoudspeakerZ = 0;
    let targetEarpieceZ = 0;
    let targetVibrationMotorZ = 0;
    let targetWirelessCoilZ = 0;
    let targetScrewsZ = 0;

    let targetRotY = userRotation.y;
    let targetRotX = userRotation.x;

    if (p < 0.12) {
      // Scene A: Assembled Smartphone (Pristine sealed showcase at 3/4 hero angle)
      const t = p / 0.12;
      targetRotY += THREE.MathUtils.lerp(0.25, 0.38, t);
      targetRotX += THREE.MathUtils.lerp(0.06, 0.10, t);
    } else if (p < 0.28) {
      // Scene B: Front Glass & Display Layer Separation
      const t = (p - 0.12) / (0.28 - 0.12);
      targetFrontGlassZ = THREE.MathUtils.lerp(0, 0.75, t);
      targetTouchDigitizerZ = THREE.MathUtils.lerp(0, 0.50, t);
      targetOLEDDisplayZ = THREE.MathUtils.lerp(0, 0.28, t);
      targetEarpieceZ = THREE.MathUtils.lerp(0, 0.20, t);
      targetRotY += 0.32 + t * 0.20;
      targetRotX += 0.08 - t * 0.04;
    } else if (p < 0.45) {
      // Scene C: Chassis & Battery Extraction
      const t = (p - 0.28) / (0.45 - 0.28);
      targetFrontGlassZ = 0.75 + t * 0.15;
      targetTouchDigitizerZ = 0.50 + t * 0.10;
      targetOLEDDisplayZ = 0.28 + t * 0.08;
      targetRearCoverZ = THREE.MathUtils.lerp(0, -0.65, t);
      targetBatteryZ = THREE.MathUtils.lerp(0, 0.45, t);
      targetWirelessCoilZ = THREE.MathUtils.lerp(0, -0.45, t);
      targetRotY += 0.52 + t * 0.35;
      targetRotX += 0.04 + t * 0.10;
    } else if (p < 0.62) {
      // Scene D: Motherboard & Silicon Deep Dive
      const t = (p - 0.45) / (0.62 - 0.45);
      targetFrontGlassZ = 0.90;
      targetTouchDigitizerZ = 0.60;
      targetOLEDDisplayZ = 0.36;
      targetBatteryZ = 0.45;
      targetRearCoverZ = -0.65 - t * 0.15;
      targetMotherboardZ = THREE.MathUtils.lerp(0, -0.32, t);
      targetShieldCoverZ = THREE.MathUtils.lerp(0, -0.60, t);
      targetProcessorSoCZ = THREE.MathUtils.lerp(0, -0.22, t);
      targetPMICZ = THREE.MathUtils.lerp(0, -0.22, t);
      targetRotY += 0.87 + t * 0.45;
      targetRotX += 0.14 - t * 0.08;
    } else if (p < 0.78) {
      // Scene E: Triple Periscope Camera & Audio Sub-assembly
      const t = (p - 0.62) / (0.78 - 0.62);
      targetFrontGlassZ = 0.90;
      targetTouchDigitizerZ = 0.60;
      targetOLEDDisplayZ = 0.36;
      targetBatteryZ = 0.45;
      targetRearCoverZ = -0.80;
      targetMotherboardZ = -0.32;
      targetShieldCoverZ = -0.60;
      targetCameraModuleZ = THREE.MathUtils.lerp(0, -0.55, t);
      targetChargingPortZ = THREE.MathUtils.lerp(0, -0.32, t);
      targetUSBPortZ = THREE.MathUtils.lerp(0, -0.24, t);
      targetChargingFlexZ = THREE.MathUtils.lerp(0, 0.18, t);
      targetLoudspeakerZ = THREE.MathUtils.lerp(0, -0.28, t);
      targetVibrationMotorZ = THREE.MathUtils.lerp(0, -0.24, t);
      targetRotY += 1.32 + t * 0.55;
      targetRotX += 0.06;
    } else if (p < 0.90) {
      // Scene F: Full Exploded Engineering View (All 19 components floating simultaneously)
      const t = (p - 0.78) / (0.90 - 0.78);
      targetFrontGlassZ = THREE.MathUtils.lerp(0.90, 1.25, t);
      targetTouchDigitizerZ = THREE.MathUtils.lerp(0.60, 0.95, t);
      targetOLEDDisplayZ = THREE.MathUtils.lerp(0.36, 0.68, t);
      targetEarpieceZ = THREE.MathUtils.lerp(0.20, 0.45, t);
      targetBatteryZ = THREE.MathUtils.lerp(0.45, 0.48, t);
      targetChargingFlexZ = THREE.MathUtils.lerp(0.18, 0.28, t);
      targetChassisZ = 0.0;
      targetScrewsZ = THREE.MathUtils.lerp(0, 0.20, t);
      targetMotherboardZ = -0.32;
      targetProcessorSoCZ = -0.22;
      targetPMICZ = -0.22;
      targetLoudspeakerZ = THREE.MathUtils.lerp(-0.28, -0.36, t);
      targetChargingPortZ = THREE.MathUtils.lerp(-0.32, -0.40, t);
      targetUSBPortZ = THREE.MathUtils.lerp(-0.24, -0.32, t);
      targetVibrationMotorZ = THREE.MathUtils.lerp(-0.24, -0.32, t);
      targetShieldCoverZ = THREE.MathUtils.lerp(-0.60, -0.70, t);
      targetCameraModuleZ = THREE.MathUtils.lerp(-0.55, -0.78, t);
      targetWirelessCoilZ = THREE.MathUtils.lerp(-0.45, -0.92, t);
      targetRearCoverZ = THREE.MathUtils.lerp(-0.80, -1.18, t);
      targetRotY += 1.87 + t * (Math.PI * 2);
      targetRotX += 0.06 + Math.sin(t * Math.PI) * 0.10;
    } else {
      // Scene G: Complete Seamless Reassembly (Magnetic snap back to 0.0)
      const t = (p - 0.90) / (1.0 - 0.90);
      targetFrontGlassZ = THREE.MathUtils.lerp(1.25, 0.0, t);
      targetTouchDigitizerZ = THREE.MathUtils.lerp(0.95, 0.0, t);
      targetOLEDDisplayZ = THREE.MathUtils.lerp(0.68, 0.0, t);
      targetEarpieceZ = THREE.MathUtils.lerp(0.45, 0.0, t);
      targetBatteryZ = THREE.MathUtils.lerp(0.48, 0.0, t);
      targetChargingFlexZ = THREE.MathUtils.lerp(0.28, 0.0, t);
      targetChassisZ = 0.0;
      targetScrewsZ = THREE.MathUtils.lerp(0.20, 0.0, t);
      targetMotherboardZ = THREE.MathUtils.lerp(-0.32, 0.0, t);
      targetProcessorSoCZ = THREE.MathUtils.lerp(-0.22, 0.0, t);
      targetPMICZ = THREE.MathUtils.lerp(-0.22, 0.0, t);
      targetLoudspeakerZ = THREE.MathUtils.lerp(-0.36, 0.0, t);
      targetChargingPortZ = THREE.MathUtils.lerp(-0.40, 0.0, t);
      targetUSBPortZ = THREE.MathUtils.lerp(-0.32, 0.0, t);
      targetVibrationMotorZ = THREE.MathUtils.lerp(-0.32, 0.0, t);
      targetShieldCoverZ = THREE.MathUtils.lerp(-0.70, 0.0, t);
      targetCameraModuleZ = THREE.MathUtils.lerp(-0.78, 0.0, t);
      targetWirelessCoilZ = THREE.MathUtils.lerp(-0.92, 0.0, t);
      targetRearCoverZ = THREE.MathUtils.lerp(-1.18, 0.0, t);
      targetRotY = THREE.MathUtils.lerp(targetRotY, userRotation.y, t);
      targetRotX = THREE.MathUtils.lerp(targetRotX, userRotation.x, t);
    }

    // Apply translations smoothly to each node
    const applyZ = (name: string, targetZ: number) => {
      const obj = nodeMap.get(name);
      if (obj) {
        obj.position.z = THREE.MathUtils.damp(obj.position.z, targetZ, 8, delta);
      }
    };

    applyZ("FrontGlass", targetFrontGlassZ);
    applyZ("TouchDigitizer", targetTouchDigitizerZ);
    applyZ("OLEDDisplay", targetOLEDDisplayZ);
    applyZ("ChassisFrame", targetChassisZ);
    applyZ("RearCover", targetRearCoverZ);
    applyZ("Battery", targetBatteryZ);
    applyZ("Motherboard", targetMotherboardZ);
    applyZ("ShieldCover", targetShieldCoverZ);
    applyZ("ProcessorSoC", targetProcessorSoCZ);
    applyZ("PMIC", targetPMICZ);
    applyZ("RearCameraModule", targetCameraModuleZ);
    applyZ("ChargingPort", targetChargingPortZ);
    applyZ("USBPort", targetUSBPortZ);
    applyZ("ChargingFlex", targetChargingFlexZ);
    applyZ("Loudspeaker", targetLoudspeakerZ);
    applyZ("Earpiece", targetEarpieceZ);
    applyZ("VibrationMotor", targetVibrationMotorZ);
    applyZ("WirelessCoil", targetWirelessCoilZ);
    applyZ("Screws", targetScrewsZ);

    // Apply rig group rotation
    rigGroupRef.current.rotation.y = THREE.MathUtils.damp(
      rigGroupRef.current.rotation.y,
      targetRotY,
      6,
      delta
    );
    rigGroupRef.current.rotation.x = THREE.MathUtils.damp(
      rigGroupRef.current.rotation.x,
      targetRotX,
      6,
      delta
    );
  });

  return (
    <group ref={rigGroupRef} scale={[0.66, 0.66, 0.66]} position={[0, -0.06, 0]}>
      <primitive object={scene} />

      {/* Guided 3D Diagnostic Inspection Pins (100% Native WebGL - Zero DOM removeChild collisions!) */}
      {GUIDED_CALLOUTS.map((callout) => {
        const isCurrentActive = activeCallout === callout.id;
        return (
          <group key={callout.id} position={callout.position3D}>
            {/* Outer Interactive Glow Ring */}
            <mesh
              onClick={(e) => {
                e.stopPropagation();
                onSelectCallout(callout.id);
              }}
            >
              <ringGeometry args={[0.08, 0.13, 24]} />
              <meshBasicMaterial
                color={isCurrentActive ? "#06b6d4" : "#38bdf8"}
                side={THREE.DoubleSide}
                transparent
                opacity={isCurrentActive ? 1.0 : 0.65}
              />
            </mesh>
            {/* Center Core Dot */}
            <mesh
              onClick={(e) => {
                e.stopPropagation();
                onSelectCallout(callout.id);
              }}
            >
              <circleGeometry args={[0.05, 16]} />
              <meshBasicMaterial
                color={isCurrentActive ? "#ffffff" : "#67e8f9"}
                side={THREE.DoubleSide}
              />
            </mesh>
            {isCurrentActive && (
              <pointLight color="#06b6d4" intensity={2.0} distance={1.2} />
            )}
          </group>
        );
      })}
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SCROLL-DRIVEN 3D TEARDOWN CONTROLLER (DECOUPLED SCROLL & TOUCH OPTIMIZED)
// ─────────────────────────────────────────────────────────────────────────────

export const SmartphoneTeardown3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef(0);
  const [activeStage, setActiveStage] = useState<StepperStage>(STEPPER_STAGES[0]);
  const [scrubBarPercent, setScrubBarPercent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [activeCallout, setActiveCallout] = useState<string | null>(null);
  const [webglSupported, setWebglSupported] = useState(true);
  const [isInView, setIsInView] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [userRotation, setUserRotation] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  const isDraggingRef = useRef(false);
  const prevPointerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
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
      { rootMargin: "150px" }
    );

    observer.observe(el);
    return () => {
      try {
        observer.disconnect();
      } catch {}
    };
  }, []);

  // Decoupled GSAP ScrollTrigger timeline: NO high-frequency React re-renders!
  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    let trigger: ScrollTrigger | null = null;
    let lastPercent = 0;
    try {
      trigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.0,
        onUpdate: (self) => {
          scrollProgressRef.current = self.progress;
          // Throttle scrub bar update to 1% granularity to prevent UI churn
          const currentPercent = Math.round(self.progress * 100);
          if (Math.abs(currentPercent - lastPercent) >= 1) {
            lastPercent = currentPercent;
            setScrubBarPercent(currentPercent);
          }
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

  // Callback triggered ONLY when stage index changes
  const handleStageChange = useCallback((stageIndex: number) => {
    const stage = STEPPER_STAGES.find((s) => s.index === stageIndex);
    if (stage) {
      setActiveStage(stage);
    }
  }, []);

  // Touch and pointer drag events: horizontal delta rotates phone, vertical pan allows normal scroll
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    prevPointerRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = (e.clientX - prevPointerRef.current.x) * 0.005;
    const deltaY = (e.clientY - prevPointerRef.current.y) * 0.003;
    prevPointerRef.current = { x: e.clientX, y: e.clientY };
    setUserRotation((prev) => ({
      x: THREE.MathUtils.clamp(prev.x + deltaY, -0.6, 0.6),
      y: THREE.MathUtils.clamp(prev.y + deltaX, -1.2, 1.2),
    }));
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

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

  // Reset view to assembled state and clear manual tilt
  const handleResetView = () => {
    setUserRotation({ x: 0, y: 0 });
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
      className="relative w-full h-[220vh] md:h-[260vh] bg-slate-950 text-white select-none touch-pan-y"
    >
      {/* ───────────────────────────────────────────────────────────── */}
      {/* PINNED STICKY 3D STAGE (100vh FULLSCREEN VIEWPORT)            */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div
        ref={stickyRef}
        className="sticky top-[68px] md:top-[98px] left-0 w-full h-[calc(100vh-68px)] md:h-[calc(100vh-98px)] overflow-hidden flex flex-col justify-between"
      >
        {/* Background Ambient Radial Glow */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_80%_at_50%_35%,rgba(14,165,233,0.18),transparent_70%)]" />
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_85%_70%,rgba(6,182,212,0.12),transparent_50%)]" />

        {/* ───────────────────────────────────────────────────────────── */}
        {/* TOP STATUS BAR & HEADER OVERLAY                               */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="relative z-20 w-full pt-4 sm:pt-6 px-4 sm:px-8 max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 text-xs font-mono font-bold tracking-wider uppercase backdrop-blur-md">
              <Sparkles className="h-3 w-3 animate-pulse" />
              <span>Engineering-Grade 3D Teardown</span>
              <span className="text-slate-500">•</span>
              <span className="text-white">Scene {activeStage.index} of 7</span>
            </div>
            <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold tracking-tight font-display text-white">
              {activeStage.tagline}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              {activeStage.subtext}
            </p>

            {/* Quick Component Inspector Selector Pills */}
            <div className="flex items-center gap-1.5 pt-1 overflow-x-auto no-scrollbar">
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase shrink-0">INSPECT:</span>
              <button
                type="button"
                onClick={() => { handleJumpToStep(0.20); handleSelectCallout("display"); }}
                className="px-2 py-0.5 rounded-lg text-[10px] font-mono bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 shrink-0 cursor-pointer"
              >
                📱 Display (AMOLED)
              </button>
              <button
                type="button"
                onClick={() => { handleJumpToStep(0.36); handleSelectCallout("motherboard"); }}
                className="px-2 py-0.5 rounded-lg text-[10px] font-mono bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 shrink-0 cursor-pointer"
              >
                ⚡ Motherboard (BGA)
              </button>
              <button
                type="button"
                onClick={() => { handleJumpToStep(0.53); handleSelectCallout("battery"); }}
                className="px-2 py-0.5 rounded-lg text-[10px] font-mono bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-amber-400 hover:border-amber-500/40 shrink-0 cursor-pointer"
              >
                🔋 5000mAh Battery
              </button>
              <button
                type="button"
                onClick={() => { handleJumpToStep(0.70); handleSelectCallout("camera"); }}
                className="px-2 py-0.5 rounded-lg text-[10px] font-mono bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-purple-400 hover:border-purple-500/40 shrink-0 cursor-pointer"
              >
                📸 Triple OIS Cameras
              </button>
              <button
                type="button"
                onClick={() => { handleJumpToStep(0.70); handleSelectCallout("subboard"); }}
                className="px-2 py-0.5 rounded-lg text-[10px] font-mono bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-sky-400 hover:border-sky-500/40 shrink-0 cursor-pointer"
              >
                🔌 Type-C Sub-Board
              </button>
            </div>
          </div>

          {/* Interactive Controls Bar */}
          <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 rounded-full p-1.5 backdrop-blur-md shadow-2xl">
            <button
              type="button"
              onClick={() => setIsPaused(!isPaused)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title={isPaused ? "फ़्लोटिंग शुरू करें" : "फ़्लोटिंग रोकें"}
            >
              {isPaused ? <Play className="h-3.5 w-3.5 text-cyan-400" /> : <Pause className="h-3.5 w-3.5 text-cyan-400" />}
              <span className="hidden sm:inline">{isPaused ? "Resume" : "Pause"}</span>
            </button>
            <button
              type="button"
              onClick={handleResetView}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="मूल स्थिति में लाएं (Reset View)"
            >
              <RotateCcw className="h-3.5 w-3.5 text-cyan-400" />
              <span>Reset View</span>
            </button>
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* THREE.JS WEBGL CANVAS WITH TOUCH-SAFE ROTATION                */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div
          className="relative flex-1 w-full h-full min-h-[260px] cursor-grab active:cursor-grabbing touch-pan-y"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {/* Active 3D Diagnostic Guidance Card Overlay (Pure React DOM - 100% crash proof) */}
          {activeCallout && (
            <div className="absolute top-4 right-4 sm:right-8 z-30 max-w-sm w-full animate-in fade-in slide-in-from-top-4 duration-300">
              {(() => {
                const callout = GUIDED_CALLOUTS.find((c) => c.id === activeCallout);
                if (!callout) return null;
                return (
                  <div className="relative rounded-2xl bg-slate-950/95 border border-cyan-500/60 p-4 shadow-2xl backdrop-blur-2xl">
                    <button
                      type="button"
                      onClick={() => setActiveCallout(null)}
                      className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-900 cursor-pointer"
                      aria-label="Close callout"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-2 pr-6">
                      <span className="px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-400 font-mono text-[10px] font-bold uppercase">
                        {callout.badgeText}
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        {callout.warranty}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-white leading-tight">
                      {callout.hindiTitle}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5 font-medium">
                      {callout.englishTitle}
                    </p>

                    <div className="mt-2 rounded-xl bg-slate-900/90 p-2 border border-slate-800 text-[11px]">
                      <span className="font-bold text-amber-400">खराबी के लक्षण: </span>
                      <span className="text-slate-300">{callout.symptoms}</span>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-xs font-semibold text-cyan-300">
                      <span className="text-white font-bold">{callout.startingPrice}</span>
                      <span className="flex items-center gap-1 text-slate-400 text-[11px]">
                        <Clock className="h-3.5 w-3.5 text-cyan-400" /> {callout.timeEstimate}
                      </span>
                    </div>

                    <a
                      href={`https://wa.me/${BUSINESS_MASTER?.whatsappRaw || BUSINESS_MASTER?.whatsappNumber || "918002903643"}?text=${encodeURIComponent(
                        `नमस्ते सुपर टेलीकॉम गिरिडीह, मैंने आपका 3D स्मार्टफोन टियरडाउन देखा और मुझे इस पुर्जे की रिपेयर करवानी है: ${callout.englishTitle} (${callout.hindiTitle})। कृपया मुफ्त डायग्नोस्टिक व समय बताएं।`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs shadow-lg hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                    >
                      <MessageCircle className="h-3.5 w-3.5" /> WhatsApp पर बुक करें
                    </a>
                  </div>
                );
              })()}
            </div>
          )}

          {/* CRITICAL: Keep Canvas mounted so WebGL context is NEVER destroyed!
              Use frameloop={isInView ? "always" : "never"} to pause 100% GPU when offscreen */}
          {isMounted && webglSupported ? (
            <Safe3DErrorBoundary fallback={<Smartphone3DFallback />}>
              <Suspense fallback={<Smartphone3DFallback />}>
                <Canvas
                  frameloop={isInView ? "always" : "never"}
                  gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: "high-performance",
                  }}
                  dpr={[1, isMobile ? 1.2 : 1.5]}
                  className="w-full h-full"
                  onCreated={({ gl }) => {
                    gl.domElement.addEventListener("webglcontextlost", (e) => {
                      e.preventDefault();
                      console.warn("SmartphoneTeardown3D WebGL context lost - prevented browser crash");
                    }, false);
                  }}
                >
                  <PerspectiveCamera
                    makeDefault
                    position={[0, 0, isMobile ? 8.2 : 7.6]}
                    fov={isMobile ? 38 : 34}
                  />

                  {/* Balanced 3-Point Studio Lighting */}
                  <ambientLight intensity={0.45} />
                  <directionalLight position={[4, 6, 6]} intensity={2.2} color="#ffffff" />
                  <directionalLight position={[-5, 3, -4]} intensity={1.1} color="#38bdf8" />
                  <directionalLight position={[0, -4, -5]} intensity={0.8} color="#10b981" />
                  <spotLight position={[0, 7, 3]} intensity={1.4} angle={0.6} penumbra={0.8} color="#f8fafc" />

                  <Float
                    speed={isPaused ? 0 : 1.2}
                    rotationIntensity={isPaused ? 0 : 0.12}
                    floatIntensity={isPaused ? 0 : 0.18}
                  >
                    <SmartphoneGLBRig
                      scrollProgressRef={scrollProgressRef}
                      isPaused={isPaused}
                      activeCallout={activeCallout}
                      onSelectCallout={handleSelectCallout}
                      userRotation={userRotation}
                      onStageChange={handleStageChange}
                    />
                  </Float>
                </Canvas>
              </Suspense>
            </Safe3DErrorBoundary>
          ) : (
            <Smartphone3DFallback />
          )}
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* BOTTOM METRICS, INTERACTIVE STEPPER & SCRUB BAR               */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="relative z-20 w-full pb-4 sm:pb-6 px-4 sm:px-8 max-w-7xl mx-auto space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1 text-[10px] sm:text-xs font-mono">
              {STEPPER_STAGES.map((step) => {
                const isActive = activeStage.index === step.index;
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
                style={{ width: `${scrubBarPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SmartphoneTeardown3D;
