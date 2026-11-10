import React, { Suspense, useRef, useState, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, useGLTF } from "@react-three/drei";
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
  Wrench,
  ShieldCheck,
} from "lucide-react";
import {
  createSmartphoneScreenTexture,
  createSmartphoneBackTexture,
} from "@/utils/smartphoneScreenTexture";

// Preload the GLB asset
if (typeof window !== "undefined") {
  useGLTF.preload("/models/smartphone_teardown.glb");
}

// ─────────────────────────────────────────────────────────────────────────────
// SAFE ERROR BOUNDARY FOR 3D ENGINE
// ─────────────────────────────────────────────────────────────────────────────
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
}
interface ErrorBoundaryState {
  hasError: boolean;
}
class Safe3DErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err: Error) {
    console.warn("Hero3DCanvas caught error:", err);
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
    position: [0, 0.45, 0.22],
    targetRotation: [0.12, -0.36], // Cinematic 3D flagship product angle showing depth, titanium edges & AMOLED
  },
  {
    id: "cpu",
    label: "Double-Decker CPU",
    sublabel: "Logic Board & PMIC",
    techSpec: "0.02mm Jumper / 350°C BGA",
    color: "#10b981",
    position: [-0.4, 0.9, 0.18],
    targetRotation: [0.12, 0.42],
  },
  {
    id: "battery",
    label: "5,000mAh Battery",
    sublabel: "Power Cell & Qi2",
    techSpec: "Thermal Guard Protection",
    color: "#f59e0b",
    position: [0.35, -0.4, 0.18],
    targetRotation: [0.08, -0.35],
  },
  {
    id: "camera",
    label: "Triple OIS Optics",
    sublabel: "Sapphire Lens Array",
    techSpec: "Cleanroom Alignment",
    color: "#a855f7",
    position: [-0.45, 1.4, -0.22],
    targetRotation: [0.12, 2.95], // View back of phone
  },
  {
    id: "port",
    label: "Reinforced Type-C",
    sublabel: "Sub-Board & MEMS",
    techSpec: "24-Pin Gold-Plated Dock",
    color: "#38bdf8",
    position: [0, -2.0, 0.15],
    targetRotation: [-0.22, 0.05],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 3D HOLOGRAPHIC WIREFRAME LOADING PLACEHOLDER
// ─────────────────────────────────────────────────────────────────────────────

function HeroLoadingHologram() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 1.2;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <mesh ref={meshRef}>
        <boxGeometry args={[1.8, 3.8, 0.22]} />
        <meshBasicMaterial color="#06b6d4" wireframe transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3D HERO SMARTPHONE MODEL RIG WITH MOUSE PARALLAX & TACTILE ROTATION
// ─────────────────────────────────────────────────────────────────────────────

function HeroModelRig({
  activeHotspot,
  onSelectHotspot,
  mousePos,
  isDragging,
  dragRotation,
  isAutoRotate,
}: {
  activeHotspot: Hotspot;
  onSelectHotspot: (h: Hotspot) => void;
  mousePos: { x: number; y: number };
  isDragging: boolean;
  dragRotation: { x: number; y: number };
  isAutoRotate: boolean;
}) {
  const gltf = useGLTF("/models/smartphone_teardown.glb");
  const groupRef = useRef<THREE.Group>(null);
  const autoRotateOffsetRef = useRef(0);

  // Deep clone scene and materials to prevent cross-contamination
  const clonedScene = useMemo(() => {
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

  // Enhance materials on mount: ensure realistic glass, OLED black, and metallic frame
  useEffect(() => {
    clonedScene.traverse((child) => {
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
            mat.color = new THREE.Color("#cbd5e1"); // Aerospace titanium-silver chassis
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
            mat.color = new THREE.Color("#0f172a"); // Deep cosmic slate
          } else if (name.includes("processorsoc") || name.includes("pmic")) {
            mat.color = new THREE.Color("#064e3b");
            mat.emissive = new THREE.Color("#10b981");
            mat.emissiveIntensity = 0.85;
          } else if (name.includes("motherboard")) {
            mat.color = new THREE.Color("#065f46"); // Green PCB substrate
            mat.metalness = 0.25;
            mat.roughness = 0.45;
          } else if (name.includes("battery")) {
            mat.color = new THREE.Color("#1e293b");
            mat.metalness = 0.40;
            mat.roughness = 0.35;
          } else if (name.includes("wirelesscoil") || name.includes("chargingflex")) {
            mat.color = new THREE.Color("#d97706"); // Copper coil
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
  }, [clonedScene, screenTexture, backTexture]);

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    // Idle subtle floating bob
    groupRef.current.position.y = Math.sin(t * 1.3) * 0.06;

    if (isAutoRotate && !isDragging) {
      autoRotateOffsetRef.current += delta * 0.45;
    }

    // Determine target rotation (user drag OR auto-orbit + hotspot target + mouse parallax)
    const baseRotX = isDragging ? dragRotation.x : activeHotspot.targetRotation[0] + mousePos.y * 0.18;
    const baseRotY = isDragging
      ? dragRotation.y
      : isAutoRotate
      ? activeHotspot.targetRotation[1] + autoRotateOffsetRef.current + mousePos.x * 0.25
      : activeHotspot.targetRotation[1] + mousePos.x * 0.35;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, baseRotX, 0.08);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, baseRotY, 0.08);
  });

  return (
    <group ref={groupRef} position={[0, -0.05, 0]} scale={[0.65, 0.65, 0.65]}>
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
              <ringGeometry args={[0.08, 0.13, 24]} />
              <meshBasicMaterial
                color={spot.color}
                side={THREE.DoubleSide}
                transparent
                opacity={isSelected ? 1.0 : 0.65}
              />
            </mesh>
            {/* Core Glow Dot */}
            <mesh
              onClick={(e) => {
                e.stopPropagation();
                onSelectHotspot(spot);
              }}
            >
              <circleGeometry args={[0.05, 16]} />
              <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} />
            </mesh>
            {/* Subtle Point Light for selected hotspot */}
            {isSelected && (
              <pointLight color={spot.color} intensity={1.8} distance={1.2} />
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
  const [dragRotation, setDragRotation] = useState({ x: 0.08, y: 0.25 });
  const [isDragging, setIsDragging] = useState(false);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [isInView, setIsInView] = useState(true);
  const dragStartRef = useRef({ x: 0, y: 0, rotX: 0.08, rotY: 0.25 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Pause rendering when offscreen to preserve GPU contexts and eliminate conflicts
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setIsInView(entry.isIntersecting);
        }
      },
      { rootMargin: "100px" }
    );

    observer.observe(el);
    return () => {
      try {
        observer.disconnect();
      } catch {}
    };
  }, []);

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

        {/* Real-time 3D Canvas with balanced studio lighting & crash-proof ErrorBoundary */}
        <Safe3DErrorBoundary
          fallback={
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-950">
              <div className="relative mb-3 flex items-center justify-center">
                <div className="h-16 w-16 rounded-2xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center animate-pulse">
                  <Cpu className="h-8 w-8 text-cyan-400" />
                </div>
              </div>
              <h4 className="text-sm font-bold text-white font-display">Super Telecom 3D Lab Bench</h4>
              <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                गिरिडीह की प्रीमियर चिप-लेवल BGA माइक्रो-सोल्डरिंग व AMOLED डिस्प्ले रिस्टोरेशन लैब
              </p>
            </div>
          }
        >
          <Canvas
            frameloop={isInView ? "always" : "never"}
            dpr={[1, 1.5]}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: "high-performance",
            }}
            onCreated={({ gl }) => {
              gl.domElement.addEventListener("webglcontextlost", (e) => {
                e.preventDefault();
                console.warn("Hero3DCanvas WebGL context lost - prevented browser crash");
              }, false);
            }}
          >
            <PerspectiveCamera makeDefault position={[0, 0, 7.2]} fov={36} />
            <ambientLight intensity={0.45} />
            <directionalLight position={[4, 6, 6]} intensity={2.2} color="#ffffff" />
            <directionalLight position={[-5, 2, -3]} intensity={1.0} color="#38bdf8" />
            <directionalLight position={[-2, 3, 2]} intensity={0.7} color="#10b981" />
            <directionalLight position={[6, 0, -4]} intensity={2.2} color="#06b6d4" />
            <directionalLight position={[-6, 0, -4]} intensity={1.8} color="#10b981" />
            <spotLight position={[0, 7, 3]} intensity={1.5} angle={0.55} penumbra={0.8} color="#e0f2fe" />

            <Suspense fallback={<HeroLoadingHologram />}>
              <HeroModelRig
                activeHotspot={activeHotspot}
                onSelectHotspot={setActiveHotspot}
                mousePos={mousePos}
                isDragging={isDragging}
                dragRotation={dragRotation}
                isAutoRotate={isAutoRotate}
              />
            </Suspense>
          </Canvas>
        </Safe3DErrorBoundary>

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

        {/* Overlaid Top-Right Interactive Controls */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsAutoRotate(!isAutoRotate);
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border transition-all cursor-pointer backdrop-blur-md ${
              isAutoRotate
                ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-sm"
                : "bg-slate-950/80 border-slate-700 text-slate-400 hover:text-white"
            }`}
            title={isAutoRotate ? "Pause 360° Rotation" : "Start 360° Rotation"}
          >
            <RotateCw className={`h-3 w-3 text-cyan-400 ${isAutoRotate ? "animate-spin" : ""}`} style={{ animationDuration: "6s" }} />
            <span>{isAutoRotate ? "AUTO 360°" : "PAUSED"}</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setDragRotation({ x: 0.08, y: 0.25 });
            }}
            className="flex items-center justify-center h-6 w-6 rounded-full bg-slate-950/80 border border-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer backdrop-blur-md"
            title="Reset View Angle"
          >
            <RotateCcw className="h-3 w-3 text-cyan-400" />
          </button>
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
