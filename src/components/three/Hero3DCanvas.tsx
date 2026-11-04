import React, { Suspense, useRef, useState, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, useGLTF, BakeShadows } from "@react-three/drei";
import * as THREE from "three";
import {
  Sparkles,
  Cpu,
  Layers,
  Zap,
  Eye,
  Activity,
  RotateCw,
  ChevronDown,
} from "lucide-react";

// Preload the GLB asset
if (typeof window !== "undefined") {
  useGLTF.preload("/models/smartphone_teardown.glb");
}

// ─────────────────────────────────────────────────────────────────────────────
// HOTSPOT DEFINITIONS FOR HERO PREVIEW
// ─────────────────────────────────────────────────────────────────────────────

interface Hotspot {
  id: string;
  label: string;
  sublabel: string;
  techSpec: string;
  color: string;
  position: [number, number, number];
  targetRotation: [number, number];
}

const HERO_HOTSPOTS: Hotspot[] = [
  {
    id: "display",
    label: "120Hz LTPO AMOLED",
    sublabel: "Screen Glass & Digitizer",
    techSpec: "OCA Vacuum Restoration",
    color: "#06b6d4",
    position: [0, 0.5, 0.22],
    targetRotation: [0.05, 0.0],
  },
  {
    id: "cpu",
    label: "Double-Decker CPU",
    sublabel: "Logic Board & PMIC",
    techSpec: "0.02mm Jumper / 350°C BGA",
    color: "#10b981",
    position: [-0.4, 0.9, 0.18],
    targetRotation: [0.1, 0.35],
  },
  {
    id: "battery",
    label: "5,000mAh Battery",
    sublabel: "Power Cell & Qi2",
    techSpec: "Thermal Guard Protection",
    color: "#f59e0b",
    position: [0.35, -0.4, 0.18],
    targetRotation: [0.05, -0.3],
  },
  {
    id: "camera",
    label: "Triple OIS Optics",
    sublabel: "Sapphire Lens Array",
    techSpec: "Cleanroom Alignment",
    color: "#a855f7",
    position: [-0.45, 1.4, -0.22],
    targetRotation: [0.15, 2.9], // View back of phone
  },
  {
    id: "port",
    label: "Reinforced Type-C",
    sublabel: "Sub-Board & MEMS",
    techSpec: "24-Pin Gold-Plated Dock",
    color: "#38bdf8",
    position: [0, -2.0, 0.15],
    targetRotation: [-0.25, 0.0],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 3D HERO SMARTPHONE MODEL RIG WITH MOUSE PARALLAX & TACTILE ROTATION
// ─────────────────────────────────────────────────────────────────────────────

function HeroModelRig({
  activeHotspot,
  onSelectHotspot,
  mousePos,
  isDragging,
  dragRotation,
}: {
  activeHotspot: Hotspot;
  onSelectHotspot: (h: Hotspot) => void;
  mousePos: { x: number; y: number };
  isDragging: boolean;
  dragRotation: { x: number; y: number };
}) {
  const gltf = useGLTF("/models/smartphone_teardown.glb");
  const groupRef = useRef<THREE.Group>(null);
  const clonedScene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);

  // Enhance materials on mount for high-end PBR shine and glowing logic lines
  useEffect(() => {
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (mat) {
          mat.envMapIntensity = 1.4;
          if (mesh.name === "FrontGlass") {
            mat.roughness = 0.05;
            mat.metalness = 0.1;
            mat.transparent = true;
            mat.opacity = 0.65;
          } else if (mesh.name === "OLEDDisplay") {
            mat.emissive = new THREE.Color("#0369a1");
            mat.emissiveIntensity = 0.45;
            mat.roughness = 0.1;
          } else if (mesh.name === "ChassisFrame") {
            mat.metalness = 0.95;
            mat.roughness = 0.2;
            mat.color = new THREE.Color("#cbd5e1");
          } else if (mesh.name === "ProcessorSoC" || mesh.name === "Motherboard") {
            mat.emissive = new THREE.Color("#10b981");
            mat.emissiveIntensity = 0.55;
          } else if (mesh.name === "Battery") {
            mat.metalness = 0.4;
            mat.roughness = 0.35;
          }
        }
      }
    });
  }, [clonedScene]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    // Idle floating bob
    groupRef.current.position.y = Math.sin(t * 1.4) * 0.08;

    // Determine target rotation (either user drag or hotspot target + mouse parallax)
    const baseRotX = isDragging ? dragRotation.x : activeHotspot.targetRotation[0] + mousePos.y * 0.25;
    const baseRotY = isDragging ? dragRotation.y : activeHotspot.targetRotation[1] + mousePos.x * 0.45;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, baseRotX, 0.08);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, baseRotY, 0.08);
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={[0.76, 0.76, 0.76]}>
      {/* 3D Model Instance */}
      <primitive object={clonedScene} />

      {/* Interactive 3D Hotspot Rings */}
      {HERO_HOTSPOTS.map((spot) => {
        const isSelected = activeHotspot.id === spot.id;
        return (
          <group key={spot.id} position={spot.position}>
            {/* Outer Pulsing Ring */}
            <mesh
              onClick={(e) => {
                e.stopPropagation();
                onSelectHotspot(spot);
              }}
            >
              <ringGeometry args={[0.09, 0.14, 24]} />
              <meshBasicMaterial
                color={spot.color}
                side={THREE.DoubleSide}
                transparent
                opacity={isSelected ? 1 : 0.65}
              />
            </mesh>
            {/* Core Glow Dot */}
            <mesh
              onClick={(e) => {
                e.stopPropagation();
                onSelectHotspot(spot);
              }}
            >
              <circleGeometry args={[0.06, 16]} />
              <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} />
            </mesh>
            {/* Point Light for selected hotspot */}
            {isSelected && (
              <pointLight color={spot.color} intensity={2.5} distance={1.2} />
            )}
          </group>
        );
      })}
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO 3D CANVAS EXPORTED WRAPPER
// ─────────────────────────────────────────────────────────────────────────────

export const Hero3DCanvas: React.FC = () => {
  const [activeHotspot, setActiveHotspot] = useState<Hotspot>(HERO_HOTSPOTS[1]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [dragRotation, setDragRotation] = useState({ x: 0.1, y: 0.25 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, rotX: 0.1, rotY: 0.25 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax tracking from mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      const deltaX = (e.clientX - dragStartRef.current.x) * 0.008;
      const deltaY = (e.clientY - dragStartRef.current.y) * 0.008;
      setDragRotation({
        x: dragStartRef.current.rotX + deltaY,
        y: dragStartRef.current.rotY + deltaX,
      });
      return;
    }

    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    setMousePos({ x, y });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      rotX: dragRotation.x,
      rotY: dragRotation.y,
    };
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        rotX: dragRotation.x,
        rotY: dragRotation.y,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = (e.touches[0].clientX - dragStartRef.current.x) * 0.009;
    const deltaY = (e.touches[0].clientY - dragStartRef.current.y) * 0.009;
    setDragRotation({
      x: dragStartRef.current.rotX + deltaY,
      y: dragStartRef.current.rotY + deltaX,
    });
  };

  const scrollToTeardown = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById("teardown-3d");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.location.hash = "#teardown-3d";
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => setIsDragging(false)}
      className="relative mx-auto max-w-md lg:max-w-none rounded-3xl border border-cyan-500/30 bg-slate-950/85 p-3 shadow-[0_0_50px_rgba(6,182,212,0.2)] backdrop-blur-2xl overflow-hidden select-none"
    >
      {/* 3D WebGL Viewport */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 cursor-grab active:cursor-grabbing">
        {/* Subtle grid background */}
        <div
          className="pointer-events-none absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              "linear-gradient(rgba(6,182,212,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.2) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Real-time 3D Canvas with corrected camera position and framing */}
        <Canvas
          dpr={[1, 1.5]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
        >
          <PerspectiveCamera makeDefault position={[0, 0, 7.2]} fov={40} />
          <ambientLight intensity={1.1} />
          <directionalLight position={[4, 5, 4]} intensity={2.2} color="#ffffff" />
          <directionalLight position={[-4, -3, -3]} intensity={2.8} color="#06b6d4" />
          <directionalLight position={[3, -2, 2]} intensity={1.5} color="#38bdf8" />
          <spotLight position={[0, 6, 4]} intensity={2.0} angle={0.5} penumbra={0.7} color="#e0f2fe" />
          <BakeShadows />

          <Suspense fallback={null}>
            <HeroModelRig
              activeHotspot={activeHotspot}
              onSelectHotspot={setActiveHotspot}
              mousePos={mousePos}
              isDragging={isDragging}
              dragRotation={dragRotation}
            />
          </Suspense>
        </Canvas>

        {/* Overlaid Top-Left Status Telemetry */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/90 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono font-bold shadow-md backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            LIVE 3D LAB BENCH
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/90 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold shadow-md backdrop-blur-md">
            <Cpu className="h-3 w-3 text-emerald-400" />
            DOUBLE-DECKER ARCHITECTURE
          </span>
        </div>

        {/* Overlaid Top-Right Orbit Controls Hint */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-950/80 border border-slate-700/80 text-[10px] font-mono text-slate-400 pointer-events-none backdrop-blur-md">
          <RotateCw className="h-3 w-3 text-cyan-400 animate-spin" style={{ animationDuration: "8s" }} />
          <span>DRAG TO ROTATE</span>
        </div>

        {/* Live Active Hotspot Diagnostic HUD (Bottom of 3D Viewport) */}
        <div className="absolute bottom-3 left-3 right-3 rounded-xl bg-slate-950/95 border border-cyan-500/30 p-2.5 backdrop-blur-xl transition-all shadow-lg">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <div className="flex items-center gap-1.5 text-white font-bold truncate">
              <span
                className="h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: activeHotspot.color }}
              />
              <span className="truncate">{activeHotspot.label}</span>
              <span className="text-slate-500 font-normal hidden sm:inline">
                • {activeHotspot.sublabel}
              </span>
            </div>
            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30 shrink-0">
              {activeHotspot.techSpec}
            </span>
          </div>

          {/* Hotspot Quick Select Buttons */}
          <div className="mt-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 border-t border-slate-800/80">
            {HERO_HOTSPOTS.map((h) => (
              <button
                key={h.id}
                type="button"
                onClick={() => setActiveHotspot(h)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-medium transition-all shrink-0 cursor-pointer ${
                  activeHotspot.id === h.id
                    ? "bg-cyan-500 text-slate-950 font-bold shadow-sm"
                    : "bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                {h.sublabel.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lab Highlights Footer & Full 3D Teardown Direct CTA */}
      <div className="mt-3 space-y-2">
        <div className="grid grid-cols-3 gap-2 px-1 text-center">
          <div className="rounded-xl bg-slate-950/70 border border-slate-800/70 p-2.5">
            <div className="text-sm sm:text-base font-bold font-mono text-cyan-400">0.02mm</div>
            <div className="text-[10px] font-mono text-slate-400 uppercase mt-0.5">Jumper Wire</div>
          </div>
          <div className="rounded-xl bg-slate-950/70 border border-slate-800/70 p-2.5">
            <div className="text-sm sm:text-base font-bold font-mono text-emerald-400">30 Min</div>
            <div className="text-[10px] font-mono text-slate-400 uppercase mt-0.5">Screen Swap</div>
          </div>
          <div className="rounded-xl bg-slate-950/70 border border-slate-800/70 p-2.5">
            <div className="text-sm sm:text-base font-bold font-mono text-amber-400">No Wipe</div>
            <div className="text-[10px] font-mono text-slate-400 uppercase mt-0.5">Data Safe</div>
          </div>
        </div>

        {/* Direct CTA to scroll down to full 14-point Teardown lab */}
        <a
          href="#teardown-3d"
          onClick={scrollToTeardown}
          className="w-full py-2.5 px-3 rounded-xl border border-cyan-500/40 bg-gradient-to-r from-cyan-950/90 via-slate-900 to-blue-950/90 hover:from-cyan-900/60 text-cyan-300 font-bold flex items-center justify-center gap-2 text-xs transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)] group-hover:border-cyan-400 cursor-pointer"
        >
          <Layers className="h-3.5 w-3.5 text-cyan-400 animate-bounce" />
          <span>Explode in 3D Lab (19 Sub-Assemblies)</span>
          <ChevronDown className="h-3.5 w-3.5 ml-0.5" />
        </a>
      </div>
    </div>
  );
};

export default Hero3DCanvas;
