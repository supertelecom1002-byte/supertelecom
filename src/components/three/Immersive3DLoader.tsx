import React, { useEffect, useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { Cpu, ShieldCheck, Sparkles, Zap, ChevronRight, Activity } from "lucide-react";

interface Immersive3DLoaderProps {
  onComplete?: () => void;
  forceShow?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3D SCENE: HOLOGRAPHIC LOGO BADGE + CONVERGING CYBER PARTICLES + LASER RINGS
// ─────────────────────────────────────────────────────────────────────────────

function HolographicLogoRig({ progress }: { progress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const logoMeshRef = useRef<THREE.Mesh>(null);
  const textureLoader = useMemo(() => new THREE.TextureLoader(), []);

  const logoTexture = useMemo(() => {
    if (typeof window === "undefined") return null;
    return textureLoader.load("/logo.png");
  }, [textureLoader]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (groupRef.current) {
      // Subtle float and breathing
      groupRef.current.position.y = Math.sin(t * 1.5) * 0.08;
      groupRef.current.rotation.y = Math.sin(t * 0.8) * 0.15;
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = t * 0.8;
      ring1Ref.current.rotation.x = Math.sin(t * 0.5) * 0.2;
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -t * 1.1;
      ring2Ref.current.rotation.y = Math.cos(t * 0.6) * 0.2;
    }

    if (logoMeshRef.current) {
      // Scale assembly effect based on progress (0 -> 1)
      const scale = THREE.MathUtils.lerp(0.6, 1.0, Math.min(progress / 100, 1));
      logoMeshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Outer Gyro Ring (Cyan Neon) */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[2.2, 0.02, 16, 64]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#06b6d4"
          emissiveIntensity={1.8}
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>

      {/* Inner Diagnostic Ring (Emerald Neon) */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[1.85, 0.015, 16, 48]} />
        <meshStandardMaterial
          color="#10b981"
          emissive="#10b981"
          emissiveIntensity={1.4}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Hexagonal Reticle Frame */}
      <mesh rotation={[0, 0, Math.PI / 6]}>
        <ringGeometry args={[1.5, 1.55, 6]} />
        <meshBasicMaterial
          color="#38bdf8"
          wireframe
          transparent
          opacity={0.4 + (progress / 100) * 0.4}
        />
      </mesh>

      {/* 3D Floating Logo Badge */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
        <mesh ref={logoMeshRef} position={[0, 0, 0.05]}>
          <planeGeometry args={[2.0, 2.0]} />
          {logoTexture ? (
            <meshStandardMaterial
              map={logoTexture}
              transparent
              roughness={0.1}
              metalness={0.4}
              emissive="#06b6d4"
              emissiveIntensity={0.25}
            />
          ) : (
            <meshStandardMaterial color="#06b6d4" roughness={0.2} />
          )}
        </mesh>
      </Float>

      {/* Specular Core Light */}
      <pointLight color="#06b6d4" intensity={3} distance={5} />
      <pointLight position={[0, 1.5, 1]} color="#38bdf8" intensity={2} distance={4} />
      <pointLight position={[0, -1.5, -1]} color="#10b981" intensity={2} distance={4} />
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONVERGING CYBER PARTICLES CLOUD
// ─────────────────────────────────────────────────────────────────────────────

function CyberParticleField({ progress }: { progress: number }) {
  const count = 350;
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, initialPositions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const init = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 3 + Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      init[i * 3] = x;
      init[i * 3 + 1] = y;
      init[i * 3 + 2] = z;
    }
    return [pos, init];
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const geom = pointsRef.current.geometry;
    const attr = geom.attributes.position as THREE.BufferAttribute;
    const pNorm = THREE.MathUtils.clamp(progress / 100, 0, 1);
    const convergence = 1 - pNorm * 0.45; // Pull closer as progress grows
    const t = clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      attr.setXYZ(
        i,
        initialPositions[i3] * convergence + Math.sin(t + i) * 0.05,
        initialPositions[i3 + 1] * convergence + Math.cos(t + i) * 0.05,
        initialPositions[i3 + 2] * convergence
      );
    }
    attr.needsUpdate = true;
    pointsRef.current.rotation.y = t * 0.08;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color="#38bdf8"
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// IMMERSIVE 3D LOADER OVERLAY COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const TELEMETRY_MESSAGES = [
  "INITIALIZING BGA REWORK ENGINE...",
  "CALIBRATING 0.02MM JUMPER WIRE BENCH...",
  "ACTIVATING STEREO MICROSCOPE TELEMETRY...",
  "SYNCING 16+ HARDWARE DIAGNOSTIC SUITES...",
  "ENGAGING ESD CLEANROOM PROTOCOL...",
  "SUPER TELECOM BARGANDA ROAD LAB ONLINE.",
];

export const Immersive3DLoader: React.FC<Immersive3DLoaderProps> = ({
  onComplete,
  forceShow = false,
}) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    // Check if user already saw the loader in this session (unless forceShow is true)
    if (!forceShow && typeof window !== "undefined") {
      const hasSeen = sessionStorage.getItem("st_loader_seen");
      if (hasSeen === "true") {
        setIsVisible(false);
        if (onComplete) onComplete();
        return;
      }
    }

    // Progress increment timer
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Organic progress curve
        const step = Math.max(1, Math.floor(Math.random() * 8) + 2);
        return Math.min(100, prev + step);
      });
    }, 70);

    return () => clearInterval(interval);
  }, [forceShow, onComplete]);

  // Update telemetry message as progress increases
  useEffect(() => {
    const idx = Math.min(
      Math.floor((progress / 100) * (TELEMETRY_MESSAGES.length - 1)),
      TELEMETRY_MESSAGES.length - 1
    );
    setCurrentMessageIndex(idx);

    if (progress >= 100 && !isFadingOut) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("st_loader_seen", "true");
      }
      const timer = setTimeout(() => {
        setIsFadingOut(true);
        setTimeout(() => {
          setIsVisible(false);
          if (onComplete) onComplete();
        }, 650);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [progress, isFadingOut, onComplete]);

  const handleSkip = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("st_loader_seen", "true");
    }
    setIsFadingOut(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      aria-label="Super Telecom 3D Laboratory Loader"
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-between bg-slate-950 text-white select-none transition-all duration-700 ease-out ${
        isFadingOut ? "opacity-0 pointer-events-none scale-105" : "opacity-100"
      }`}
    >
      {/* Subtle background ambient cyber grid */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(6,182,212,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.15) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-radial from-cyan-950/20 via-slate-950/80 to-slate-950" />

      {/* Top Header Bar */}
      <div className="w-full max-w-7xl px-4 sm:px-6 pt-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Cpu className="h-4 w-4 animate-pulse" />
          </div>
          <div>
            <div className="font-mono text-xs font-bold text-cyan-400 tracking-wider">
              SUPER TELECOM
            </div>
            <div className="text-[10px] font-mono text-slate-400">
              BARGANDA ROAD CHIP-LEVEL LAB
            </div>
          </div>
        </div>

        <button
          onClick={handleSkip}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 text-xs font-mono font-medium transition-all backdrop-blur-md active:scale-95"
        >
          <span>ENTER LAB</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Center 3D WebGL Canvas */}
      <div className="relative w-full h-[52vh] sm:h-[58vh] max-w-2xl flex items-center justify-center">
        <Canvas
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        >
          <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={45} />
          <ambientLight intensity={0.6} />
          <directionalLight position={[3, 4, 3]} intensity={1.5} color="#38bdf8" />
          <directionalLight position={[-3, -2, -2]} intensity={0.8} color="#10b981" />

          <HolographicLogoRig progress={progress} />
          <CyberParticleField progress={progress} />
        </Canvas>
      </div>

      {/* Bottom Telemetry HUD */}
      <div className="w-full max-w-xl px-6 pb-8 space-y-4 z-10 text-center">
        {/* Telemetry Message */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-cyan-500/30 text-cyan-300 font-mono text-xs shadow-md backdrop-blur-md">
          <Activity className="h-3.5 w-3.5 text-cyan-400 animate-spin" />
          <span className="tracking-wide">{TELEMETRY_MESSAGES[currentMessageIndex]}</span>
        </div>

        {/* Progress Bar & Percentage */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">SYSTEM CALIBRATION</span>
            <span className="text-cyan-400 font-bold">{progress}%</span>
          </div>

          <div className="h-1.5 w-full bg-slate-900 border border-slate-800 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 rounded-full transition-all duration-150 shadow-[0_0_12px_rgba(6,182,212,0.6)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Engineering Badges */}
        <div className="flex items-center justify-center gap-4 text-[10px] font-mono text-slate-500 pt-1">
          <span className="flex items-center gap-1 text-slate-400">
            <ShieldCheck className="h-3 w-3 text-emerald-400" /> ESD SAFE
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 text-slate-400">
            <Sparkles className="h-3 w-3 text-cyan-400" /> 0.02MM JUMPER
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 text-slate-400">
            <Zap className="h-3 w-3 text-amber-400" /> 30-MIN SWAP
          </span>
        </div>
      </div>
    </div>
  );
};

export default Immersive3DLoader;
