import React, { Suspense, useRef, useState, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, useGLTF, Float, BakeShadows } from "@react-three/drei";
import * as THREE from "three";
import {
  Sparkles,
  Cpu,
  Layers,
  Zap,
  Eye,
  Activity,
  Maximize2,
  ChevronDown,
  RotateCw,
  Info,
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
}

const HERO_HOTSPOTS: Hotspot[] = [
  {
    id: "display",
    label: "120Hz LTPO AMOLED",
    sublabel: "Screen Assembly",
    techSpec: "OCA Vacuum Glass Restoration",
    color: "#06b6d4",
    position: [0, 0.5, 0.45],
  },
  {
    id: "cpu",
    label: "Double-Decker CPU",
    sublabel: "Motherboard & PMIC",
    techSpec: "0.02mm Micro-Jumper / 350°C BGA",
    color: "#10b981",
    position: [-0.4, 0.9, 0.15],
  },
  {
    id: "battery",
    label: "5,000mAh Battery",
    sublabel: "Power Cell & Qi2",
    techSpec: "Thermal Guard Protection",
    color: "#f59e0b",
    position: [0.35, -0.4, 0.2],
  },
  {
    id: "camera",
    label: "Triple OIS Optics",
    sublabel: "Sapphire Lens Array",
    techSpec: "Cleanroom Dust-Free Alignment",
    color: "#a855f7",
    position: [-0.5, 1.2, -0.3],
  },
  {
    id: "port",
    label: "Reinforced Type-C",
    sublabel: "Sub-Board & MEMS",
    techSpec: "24-Pin Gold-Plated Dock",
    color: "#38bdf8",
    position: [0, -1.9, -0.1],
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
  activeHotspot: string | null;
  onSelectHotspot: (id: string) => void;
  mousePos: { x: number; y: number };
  isDragging: boolean;
  dragRotation: { x: number; y: number };
}) {
  const gltf = useGLTF("/models/smartphone_teardown.glb");
  const groupRef = useRef<THREE.Group>(null);
  const clonedScene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);

  // Materials enhancement on mount: give realistic PBR sheen and glowing accents
  useEffect(() => {
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const m = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
        if (m) {
          m.envMapIntensity = 1.2;
          if (child.name.includes("glass") || child.name.includes("display")) {
            m.roughness = 0.08;
            m.metalness = 0.1;
          } else if (child.name.includes("motherboard") || child.name.includes("bga")) {
            m.emissive = new THREE.Color("#06b6d4");
            m.emissiveIntensity = 0.35;
          } else if (child.name.includes("battery")) {
            m.metalness = 0.7;
            m.roughness = 0.3;
          }
        }
      }
    });
  }, [clonedScene]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    // Idle floating bob
    groupRef.current.position.y = Math.sin(t * 1.2) * 0.06;

    // Smooth lerp towards combined mouse parallax + user drag rotation
    const targetRotX = (isDragging ? dragRotation.x : mousePos.y * 0.35) + Math.sin(t * 0.7) * 0.04;
    const targetRotY = (isDragging ? dragRotation.y : mousePos.x * 0.55) + Math.sin(t * 0.9) * 0.08;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.08);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.08);
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={[1.1, 1.1, 1.1]}>
      {/* 3D Model Instance */}
      <primitive object={clonedScene} />

      {/* Interactive 3D Hotspot Rings */}
      {HERO_HOTSPOTS.map((spot) => {
        const isSelected = activeHotspot === spot.id;
        return (
          <group key={spot.id} position={spot.position}>
            {/* Outer Pulsing Ring */}
            <mesh
              onClick={(e) => {
                e.stopPropagation();
                onSelectHotspot(spot.id);
              }}
              cursor="pointer"
            >
              <ringGeometry args={[0.08, 0.12, 24]} />
              <meshBasicMaterial
                color={spot.color}
                side={THREE.DoubleSide}
                transparent
                opacity={isSelected ? 0.95 : 0.6}
              />
            </mesh>
            {/* Core Glow Dot */}
            <mesh
              onClick={(e) => {
                e.stopPropagation();
                onSelectHotspot(spot.id);
              }}
              cursor="pointer"
            >
              <circleGeometry args={[0.05, 16]} />
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
  const [activeHotspotId, setActiveHotspotId] = useState<string>("cpu");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [dragRotation, setDragRotation] = useState({ x: 0.1, y: 0.25 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, rotX: 0.1, rotY: 0.25 });
  const containerRef = useRef<HTMLDivElement>(null);

  const activeHotspot = useMemo(
    () => HERO_HOTSPOTS.find((h) => h.id === activeHotspotId) || HERO_HOTSPOTS[1],
    [activeHotspotId]
  );

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
      className="relative mx-auto max-w-md lg:max-w-none rounded-3xl border border-cyan-500/30 bg-slate-950/80 p-3 shadow-[0_0_50px_rgba(6,182,212,0.18)] backdrop-blur-2xl overflow-hidden group select-none"
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

        {/* Real-time 3D Canvas */}
        <Canvas
          dpr={[1, 1.75]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
        >
          <PerspectiveCamera makeDefault position={[0, 0, 4.8]} fov={42} />
          <ambientLight intensity={0.7} />
          <directionalLight position={[3, 4, 3]} intensity={1.8} color="#e0f2fe" />
          <directionalLight position={[-3, -2, -2]} intensity={0.9} color="#06b6d4" />
          <pointLight position={[0, 0, 2]} intensity={1.2} color="#38bdf8" />
          <BakeShadows />

          <Suspense fallback={null}>
            <HeroModelRig
              activeHotspot={activeHotspotId}
              onSelectHotspot={setActiveHotspotId}
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
                onClick={() => setActiveHotspotId(h.id)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-medium transition-all shrink-0 ${
                  activeHotspotId === h.id
                    ? "bg-cyan-500 text-slate-950 font-bold shadow-sm"
                    : "bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                {h.sublabel}
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
          className="w-full py-2.5 px-3 rounded-xl border border-cyan-500/40 bg-gradient-to-r from-cyan-950/80 via-slate-900 to-blue-950/80 hover:from-cyan-900/60 text-cyan-300 font-bold flex items-center justify-center gap-2 text-xs transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)] group-hover:border-cyan-400"
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
