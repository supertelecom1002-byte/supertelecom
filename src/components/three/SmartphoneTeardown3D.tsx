import React, { Suspense, useEffect, useRef, useState, useMemo, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PerspectiveCamera, Html, useGLTF, BakeShadows } from "@react-three/drei";
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
} from "lucide-react";
import { Smartphone3DFallback } from "./Smartphone3DFallback";

// Ensure GSAP ScrollTrigger plugin is registered in browser
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
    hindiTitle: "120Hz AMOLED डिस्प्ले व टच डिजिटाइज़र",
    englishTitle: "120Hz Super Retina AMOLED & Touch Digitizer",
    symptoms: "टूटी स्क्रीन, ग्रीन/पिंक लाइन, ब्लैक स्पॉट, टच अनरेस्पॉन्सिव या फ्लिकरिंग।",
    startingPrice: "परामर्श उपलब्ध",
    timeEstimate: "30–60 मिनट",
    warranty: "90 दिन वारंटी",
    sceneRange: [0.10, 0.32],
    badgeText: "AMOLED Display",
    icon: "layers",
    position3D: [0, 0.4, 0.85],
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
    position3D: [-0.4, 1.1, 0.7],
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
    position3D: [0.35, -0.6, 0.7],
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
    position3D: [-0.6, 1.4, -0.7],
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
    position3D: [0, -2.1, -0.5],
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

  // Clone scene so materials/transforms can be manipulated cleanly
  const scene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);

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
      // Scene A: Assembled Smartphone (Pristine sealed showcase)
      const t = p / 0.12;
      targetRotY += THREE.MathUtils.lerp(0, 0.35, t);
      targetRotX += THREE.MathUtils.lerp(0, 0.1, t);
    } else if (p < 0.28) {
      // Scene B: Front Glass & Display Layer Separation
      const t = (p - 0.12) / (0.28 - 0.12);
      targetFrontGlassZ = THREE.MathUtils.lerp(0, 1.10, t);
      targetTouchDigitizerZ = THREE.MathUtils.lerp(0, 0.75, t);
      targetOLEDDisplayZ = THREE.MathUtils.lerp(0, 0.45, t);
      targetEarpieceZ = THREE.MathUtils.lerp(0, 0.30, t);
      targetRotY += 0.35 + t * 0.25;
      targetRotX += 0.10 - t * 0.05;
    } else if (p < 0.45) {
      // Scene C: Chassis & Battery Extraction
      const t = (p - 0.28) / (0.45 - 0.28);
      targetFrontGlassZ = 1.10 + t * 0.2;
      targetTouchDigitizerZ = 0.75 + t * 0.15;
      targetOLEDDisplayZ = 0.45 + t * 0.1;
      targetRearCoverZ = THREE.MathUtils.lerp(0, -0.90, t);
      targetBatteryZ = THREE.MathUtils.lerp(0, 0.60, t);
      targetWirelessCoilZ = THREE.MathUtils.lerp(0, -0.65, t);
      targetRotY += 0.60 + t * 0.45;
      targetRotX += 0.05 + t * 0.15;
    } else if (p < 0.62) {
      // Scene D: Motherboard & Silicon Deep Dive
      const t = (p - 0.45) / (0.62 - 0.45);
      targetFrontGlassZ = 1.30;
      targetTouchDigitizerZ = 0.90;
      targetOLEDDisplayZ = 0.55;
      targetBatteryZ = 0.60;
      targetRearCoverZ = -0.90 - t * 0.2;
      targetMotherboardZ = THREE.MathUtils.lerp(0, -0.45, t);
      targetShieldCoverZ = THREE.MathUtils.lerp(0, -0.85, t);
      targetProcessorSoCZ = THREE.MathUtils.lerp(0, -0.35, t);
      targetPMICZ = THREE.MathUtils.lerp(0, -0.35, t);
      targetRotY += 1.05 + t * 0.60;
      targetRotX += 0.20 - t * 0.10;
    } else if (p < 0.78) {
      // Scene E: Triple Periscope Camera & Audio Sub-assembly
      const t = (p - 0.62) / (0.78 - 0.62);
      targetFrontGlassZ = 1.30;
      targetTouchDigitizerZ = 0.90;
      targetOLEDDisplayZ = 0.55;
      targetBatteryZ = 0.60;
      targetRearCoverZ = -1.10;
      targetMotherboardZ = -0.45;
      targetShieldCoverZ = -0.85;
      targetCameraModuleZ = THREE.MathUtils.lerp(0, -0.80, t);
      targetChargingPortZ = THREE.MathUtils.lerp(0, -0.45, t);
      targetUSBPortZ = THREE.MathUtils.lerp(0, -0.35, t);
      targetChargingFlexZ = THREE.MathUtils.lerp(0, 0.25, t);
      targetLoudspeakerZ = THREE.MathUtils.lerp(0, -0.40, t);
      targetVibrationMotorZ = THREE.MathUtils.lerp(0, -0.35, t);
      targetRotY += 1.65 + t * 0.75;
      targetRotX += 0.10;
    } else if (p < 0.90) {
      // Scene F: Full Exploded Engineering View (All 19 components floating simultaneously)
      const t = (p - 0.78) / (0.90 - 0.78);
      targetFrontGlassZ = THREE.MathUtils.lerp(1.30, 1.85, t);
      targetTouchDigitizerZ = THREE.MathUtils.lerp(0.90, 1.45, t);
      targetOLEDDisplayZ = THREE.MathUtils.lerp(0.55, 1.05, t);
      targetEarpieceZ = THREE.MathUtils.lerp(0.30, 0.70, t);
      targetBatteryZ = THREE.MathUtils.lerp(0.60, 0.65, t);
      targetChargingFlexZ = THREE.MathUtils.lerp(0.25, 0.40, t);
      targetChassisZ = 0.0;
      targetScrewsZ = THREE.MathUtils.lerp(0, 0.30, t);
      targetMotherboardZ = -0.45;
      targetProcessorSoCZ = -0.35;
      targetPMICZ = -0.35;
      targetLoudspeakerZ = THREE.MathUtils.lerp(-0.40, -0.50, t);
      targetChargingPortZ = THREE.MathUtils.lerp(-0.45, -0.55, t);
      targetUSBPortZ = THREE.MathUtils.lerp(-0.35, -0.45, t);
      targetVibrationMotorZ = THREE.MathUtils.lerp(-0.35, -0.45, t);
      targetShieldCoverZ = THREE.MathUtils.lerp(-0.85, -0.95, t);
      targetCameraModuleZ = THREE.MathUtils.lerp(-0.80, -1.10, t);
      targetWirelessCoilZ = THREE.MathUtils.lerp(-0.65, -1.30, t);
      targetRearCoverZ = THREE.MathUtils.lerp(-1.10, -1.65, t);
      targetRotY += 2.40 + t * (Math.PI * 2);
      targetRotX += 0.10 + Math.sin(t * Math.PI) * 0.15;
    } else {
      // Scene G: Complete Seamless Reassembly (Magnetic snap back to 0.0)
      const t = (p - 0.90) / (1.0 - 0.90);
      targetFrontGlassZ = THREE.MathUtils.lerp(1.85, 0.0, t);
      targetTouchDigitizerZ = THREE.MathUtils.lerp(1.45, 0.0, t);
      targetOLEDDisplayZ = THREE.MathUtils.lerp(1.05, 0.0, t);
      targetEarpieceZ = THREE.MathUtils.lerp(0.70, 0.0, t);
      targetBatteryZ = THREE.MathUtils.lerp(0.65, 0.0, t);
      targetChargingFlexZ = THREE.MathUtils.lerp(0.40, 0.0, t);
      targetChassisZ = 0.0;
      targetScrewsZ = THREE.MathUtils.lerp(0.30, 0.0, t);
      targetMotherboardZ = THREE.MathUtils.lerp(-0.45, 0.0, t);
      targetProcessorSoCZ = THREE.MathUtils.lerp(-0.35, 0.0, t);
      targetPMICZ = THREE.MathUtils.lerp(-0.35, 0.0, t);
      targetLoudspeakerZ = THREE.MathUtils.lerp(-0.50, 0.0, t);
      targetChargingPortZ = THREE.MathUtils.lerp(-0.55, 0.0, t);
      targetUSBPortZ = THREE.MathUtils.lerp(-0.45, 0.0, t);
      targetVibrationMotorZ = THREE.MathUtils.lerp(-0.45, 0.0, t);
      targetShieldCoverZ = THREE.MathUtils.lerp(-0.95, 0.0, t);
      targetCameraModuleZ = THREE.MathUtils.lerp(-1.10, 0.0, t);
      targetWirelessCoilZ = THREE.MathUtils.lerp(-1.30, 0.0, t);
      targetRearCoverZ = THREE.MathUtils.lerp(-1.65, 0.0, t);
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
    <group ref={rigGroupRef}>
      <primitive object={scene} />

      {/* Guided 3D Diagnostic Inspection Pins */}
      {GUIDED_CALLOUTS.map((callout) => {
        const isCurrentActive = activeCallout === callout.id;
        return (
          <group key={callout.id} position={callout.position3D}>
            <Html center distanceFactor={7.5}>
              <div className="relative group/pin">
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

                {/* Rich 3D Guidance Card */}
                <div
                  className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-72 rounded-2xl bg-slate-950/95 border border-cyan-500/60 p-4 shadow-2xl backdrop-blur-xl transition-all duration-300 ${
                    isCurrentActive
                      ? "opacity-100 scale-100 pointer-events-auto"
                      : "opacity-0 scale-95 pointer-events-none group-hover/pin:opacity-100 group-hover/pin:scale-100 group-hover/pin:pointer-events-auto"
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                    <span className="px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-400 font-mono text-[10px] font-bold uppercase">
                      {callout.badgeText}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      {callout.warranty}
                    </span>
                  </div>

                  <h4 className="font-bold text-xs sm:text-sm text-white leading-tight">
                    {callout.hindiTitle}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                    {callout.englishTitle}
                  </p>

                  <div className="mt-2 rounded-xl bg-slate-900/90 p-2 border border-slate-800 text-[11px]">
                    <span className="font-bold text-amber-400">खराबी के लक्षण: </span>
                    <span className="text-slate-300">{callout.symptoms}</span>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px] font-semibold text-cyan-300">
                    <span className="text-white font-bold">{callout.startingPrice}</span>
                    <span className="flex items-center gap-1 text-slate-400 text-[10px]">
                      <Clock className="h-3 w-3 text-cyan-400" /> {callout.timeEstimate}
                    </span>
                  </div>

                  <a
                    href={`https://wa.me/${BUSINESS_MASTER?.whatsappRaw || BUSINESS_MASTER?.whatsappNumber || "918002903643"}?text=${encodeURIComponent(
                      `नमस्ते सुपर टेलीकॉम गिरिडीह, मैंने आपका 3D स्मार्टफोन टियरडाउन देखा और मुझे इस पुर्जे की रिपेयर करवानी है: ${callout.englishTitle} (${callout.hindiTitle})। कृपया मुफ्त डायग्नोस्टिक व समय बताएं।`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    <MessageCircle className="h-3.5 w-3.5" /> WhatsApp पर बुक करें
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

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SCROLL-DRIVEN 3D TEARDOWN CONTROLLER (DECOUPLED SCROLL & TOUCH OPTIMIZED)
// ─────────────────────────────────────────────────────────────────────────────


// Active FPS Monitor that flags performance drops and triggers graceful fallback
function TeardownFpsMonitor({ onFallback }: { onFallback: () => void }) {
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const lowFpsCount = useRef(0);

  useFrame(() => {
    frameCount.current++;
    const now = performance.now();
    if (now - lastTime.current >= 1000) {
      const fps = (frameCount.current * 1000) / (now - lastTime.current);
      frameCount.current = 0;
      lastTime.current = now;
      if (fps < 24) {
        lowFpsCount.current++;
        if (lowFpsCount.current >= 4) {
          onFallback();
        }
      } else {
        lowFpsCount.current = Math.max(0, lowFpsCount.current - 1);
      }
    }
  });

  return null;
}

export const SmartphoneTeardown3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef(0);
  const [activeStage, setActiveStage] = useState<StepperStage>(STEPPER_STAGES[0]);
  const [scrubBarPercent, setScrubBarPercent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLowPerformance, setIsLowPerformance] = useState(false);
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
        className="sticky top-0 left-0 w-full h-screen overflow-hidden flex flex-col justify-between"
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
                className="px-2 py-0.5 rounded-lg text-[10px] font-mono bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 shrink-0"
              >
                📱 Display (AMOLED)
              </button>
              <button
                type="button"
                onClick={() => { handleJumpToStep(0.36); handleSelectCallout("motherboard"); }}
                className="px-2 py-0.5 rounded-lg text-[10px] font-mono bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 shrink-0"
              >
                ⚡ Motherboard (BGA)
              </button>
              <button
                type="button"
                onClick={() => { handleJumpToStep(0.53); handleSelectCallout("battery"); }}
                className="px-2 py-0.5 rounded-lg text-[10px] font-mono bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-amber-400 hover:border-amber-500/40 shrink-0"
              >
                🔋 5000mAh Battery
              </button>
              <button
                type="button"
                onClick={() => { handleJumpToStep(0.70); handleSelectCallout("camera"); }}
                className="px-2 py-0.5 rounded-lg text-[10px] font-mono bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-purple-400 hover:border-purple-500/40 shrink-0"
              >
                📸 Triple OIS Cameras
              </button>
              <button
                type="button"
                onClick={() => { handleJumpToStep(0.70); handleSelectCallout("subboard"); }}
                className="px-2 py-0.5 rounded-lg text-[10px] font-mono bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-sky-400 hover:border-sky-500/40 shrink-0"
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
          {isMounted && webglSupported && isInView ? (
            <Suspense fallback={<Smartphone3DFallback />}>
              <Canvas
                gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
                dpr={[1, isMobile ? 1.2 : 1.75]}
                className="w-full h-full"
                onCreated={({ gl }) => {
                  const canvasEl = gl.domElement;
                  const handleLost = (e: Event) => {
                    e.preventDefault();
                    console.warn("3D Teardown WebGL context lost. Preserving state for restore...");
                  };
                  const handleRestored = () => {
                    console.log("3D Teardown WebGL context restored.");
                  };
                  canvasEl.addEventListener("webglcontextlost", handleLost);
                  canvasEl.addEventListener("webglcontextrestored", handleRestored);
                  return () => {
                    canvasEl.removeEventListener("webglcontextlost", handleLost);
                    canvasEl.removeEventListener("webglcontextrestored", handleRestored);
                  };
                }}
              >
                <BakeShadows />
                <TeardownFpsMonitor onFallback={() => setIsLowPerformance(true)} />
                <PerspectiveCamera
                  makeDefault
                  position={[0, 0, isMobile ? 9.2 : 7.6]}
                  fov={isMobile ? 48 : 42}
                />

                {/* 3-Point Studio Lighting */}
                <ambientLight intensity={1.2} />
                <directionalLight position={[5, 8, 8]} intensity={3.0} color="#ffffff" />
                <directionalLight position={[-6, -3, -5]} intensity={3.2} color="#00f0ff" />
                <directionalLight position={[-4, 5, 4]} intensity={1.6} color="#f59e0b" />
                <spotLight position={[0, 8, 3]} intensity={2.5} angle={0.6} penumbra={0.8} color="#e0f2fe" />

                <Float
                  speed={isPaused ? 0 : 1.2}
                  rotationIntensity={isPaused ? 0 : 0.12}
                  floatIntensity={isPaused ? 0 : 0.20}
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
