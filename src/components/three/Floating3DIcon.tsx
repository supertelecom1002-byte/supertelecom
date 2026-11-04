import React, { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  Smartphone,
  Zap,
  BatteryCharging,
  PlugZap,
  Droplets,
  Camera,
  Volume2,
  ShieldAlert,
} from "lucide-react";

export type Fault3DType =
  | "screen"
  | "dead-phone"
  | "battery"
  | "charging"
  | "water-damage"
  | "camera"
  | "sound"
  | "body";

interface Floating3DIconProps {
  type: Fault3DType | string;
  isSelected?: boolean;
  className?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// PROCEDURAL 3D SHAPES PER FAULT TYPE
// ─────────────────────────────────────────────────────────────────────────────

function Fault3DGeometry({ type, isSelected }: { type: string; isSelected: boolean }) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    // Subtle idle float and tilt
    meshRef.current.rotation.y = Math.sin(t * 1.5) * 0.35 + (isSelected ? t * 0.5 : 0);
    meshRef.current.rotation.x = Math.cos(t * 1.2) * 0.2;
    meshRef.current.position.y = Math.sin(t * 2) * 0.05;
  });

  switch (type) {
    case "screen":
      // Glass Prism with inner AMOLED display slice
      return (
        <group ref={meshRef}>
          {/* Outer Glass Slab */}
          <mesh>
            <boxGeometry args={[1.2, 1.8, 0.12]} />
            <meshStandardMaterial
              color="#06b6d4"
              roughness={0.1}
              metalness={0.2}
              transparent
              opacity={0.7}
              emissive="#06b6d4"
              emissiveIntensity={isSelected ? 0.6 : 0.2}
            />
          </mesh>
          {/* Inner OLED Matrix Lines */}
          <mesh position={[0, 0, 0.07]}>
            <planeGeometry args={[1.0, 1.6]} />
            <meshBasicMaterial color="#38bdf8" wireframe />
          </mesh>
          {/* Cracked Fractured Diagonal Line */}
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[new Float32Array([-0.5, 0.8, 0.08, 0.4, -0.7, 0.08]), 3]}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#ffffff" linewidth={2} />
          </line>
        </group>
      );

    case "dead-phone":
      // Motherboard CPU Chip with gold BGA solder ball grid
      return (
        <group ref={meshRef}>
          {/* Ceramic Die */}
          <mesh>
            <boxGeometry args={[1.4, 1.4, 0.2]} />
            <meshStandardMaterial
              color="#0f172a"
              roughness={0.4}
              metalness={0.8}
            />
          </mesh>
          {/* Top Silicon Core */}
          <mesh position={[0, 0, 0.11]}>
            <boxGeometry args={[0.8, 0.8, 0.05]} />
            <meshStandardMaterial
              color="#10b981"
              emissive="#10b981"
              emissiveIntensity={isSelected ? 0.9 : 0.4}
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>
          {/* Gold Pin Array */}
          <mesh position={[0, 0, -0.11]}>
            <planeGeometry args={[1.2, 1.2]} />
            <meshStandardMaterial
              color="#f59e0b"
              emissive="#f59e0b"
              emissiveIntensity={0.5}
              metalness={0.9}
            />
          </mesh>
        </group>
      );

    case "battery":
      // High-Density Lithium Pouch Cell
      return (
        <group ref={meshRef}>
          {/* Battery Body */}
          <mesh>
            <boxGeometry args={[1.1, 1.7, 0.25]} />
            <meshStandardMaterial
              color="#0284c7"
              roughness={0.3}
              metalness={0.6}
              emissive="#0284c7"
              emissiveIntensity={isSelected ? 0.7 : 0.2}
            />
          </mesh>
          {/* Terminal Tabs (Positive & Negative) */}
          <mesh position={[-0.25, 0.95, 0]}>
            <boxGeometry args={[0.2, 0.2, 0.08]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.9} />
          </mesh>
          <mesh position={[0.25, 0.95, 0]}>
            <boxGeometry args={[0.2, 0.2, 0.08]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.9} />
          </mesh>
          {/* Glowing Charge Level Bar */}
          <mesh position={[0, -0.1, 0.14]}>
            <boxGeometry args={[0.7, 1.0, 0.02]} />
            <meshBasicMaterial color={isSelected ? "#10b981" : "#38bdf8"} />
          </mesh>
        </group>
      );

    case "charging":
      // Precision USB Type-C Receptacle Housing
      return (
        <group ref={meshRef}>
          {/* Outer Metallic Shield Shell */}
          <mesh>
            <boxGeometry args={[1.5, 0.65, 0.8]} />
            <meshStandardMaterial
              color="#64748b"
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>
          {/* Center Insulator Tongue */}
          <mesh position={[0, 0, 0.1]}>
            <boxGeometry args={[1.1, 0.15, 0.5]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          {/* Gold Pin Contacts */}
          <mesh position={[0, 0.1, 0.15]}>
            <boxGeometry args={[0.9, 0.03, 0.4]} />
            <meshStandardMaterial
              color="#f59e0b"
              emissive="#f59e0b"
              emissiveIntensity={isSelected ? 1.0 : 0.5}
              metalness={0.9}
            />
          </mesh>
        </group>
      );

    case "water-damage":
      // Liquid Ingress Droplet & Ultrasonic Wave Ring
      return (
        <group ref={meshRef}>
          {/* Water Droplet Core */}
          <mesh>
            <sphereGeometry args={[0.75, 32, 32]} />
            <meshStandardMaterial
              color="#0ea5e9"
              roughness={0.05}
              metalness={0.1}
              transparent
              opacity={0.75}
              emissive="#06b6d4"
              emissiveIntensity={isSelected ? 0.8 : 0.3}
            />
          </mesh>
          {/* Concentric De-Oxidation Wave */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.05, 0.03, 16, 48]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.3, 0.02, 16, 48]} />
            <meshBasicMaterial color="#0284c7" transparent opacity={0.6} />
          </mesh>
        </group>
      );

    case "camera":
      // Triple Sapphire Camera Barrel Array
      return (
        <group ref={meshRef}>
          {/* Main Lens Barrel */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.8, 0.8, 0.4, 32]} />
            <meshStandardMaterial
              color="#1e293b"
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>
          {/* Sapphire Glass Element */}
          <mesh position={[0, 0, 0.22]}>
            <circleGeometry args={[0.65, 32]} />
            <meshStandardMaterial
              color="#a855f7"
              emissive="#8b5cf6"
              emissiveIntensity={isSelected ? 0.9 : 0.4}
              roughness={0.05}
              metalness={0.3}
            />
          </mesh>
          {/* Metallic Aperture Rim */}
          <mesh position={[0, 0, 0.21]}>
            <ringGeometry args={[0.65, 0.78, 32]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.95} />
          </mesh>
        </group>
      );

    case "sound":
      // Acoustic Transducer & Resonant Speaker Chamber
      return (
        <group ref={meshRef}>
          {/* Speaker Cone */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.9, 0.6, 24, 1, true]} />
            <meshStandardMaterial
              color="#f43f5e"
              emissive="#e11d48"
              emissiveIntensity={isSelected ? 0.7 : 0.2}
              roughness={0.3}
              metalness={0.4}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* Center Voice Coil Dust Cap */}
          <mesh position={[0, 0, 0.15]}>
            <sphereGeometry args={[0.25, 16, 16]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} />
          </mesh>
          {/* Sonic Soundwaves */}
          <mesh position={[0, 0, 0.4]}>
            <ringGeometry args={[0.7, 0.75, 24]} />
            <meshBasicMaterial color="#fb7185" transparent opacity={0.6} />
          </mesh>
        </group>
      );

    case "body":
    default:
      // Aerospace Aluminum Chassis Corner Bracket
      return (
        <group ref={meshRef}>
          <mesh>
            <boxGeometry args={[1.4, 1.4, 0.25]} />
            <meshStandardMaterial
              color="#475569"
              metalness={0.85}
              roughness={0.25}
              emissive="#94a3b8"
              emissiveIntensity={isSelected ? 0.5 : 0.1}
            />
          </mesh>
          <mesh position={[0, 0, 0.14]}>
            <ringGeometry args={[0.3, 0.45, 6]} />
            <meshBasicMaterial color="#38bdf8" wireframe />
          </mesh>
        </group>
      );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 2D FALLBACK ICONS IF WEBGL IS DISABLED OR LOW-END
// ─────────────────────────────────────────────────────────────────────────────

function Fallback2DIcon({ type, className }: { type: string; className?: string }) {
  const iconClass = className || "h-5 w-5";
  switch (type) {
    case "screen":
      return <Smartphone className={iconClass} />;
    case "dead-phone":
      return <Zap className={iconClass} />;
    case "battery":
      return <BatteryCharging className={iconClass} />;
    case "charging":
      return <PlugZap className={iconClass} />;
    case "water-damage":
      return <Droplets className={iconClass} />;
    case "camera":
      return <Camera className={iconClass} />;
    case "sound":
      return <Volume2 className={iconClass} />;
    case "body":
    default:
      return <ShieldAlert className={iconClass} />;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTED COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export const Floating3DIcon: React.FC<Floating3DIconProps> = ({
  type,
  isSelected = false,
  className = "h-11 w-11",
}) => {
  return (
    <div
      className={`relative ${className} flex items-center justify-center overflow-hidden rounded-2xl select-none`}
    >
      <Suspense fallback={<Fallback2DIcon type={type} />}>
        <Canvas
          dpr={[1, 1.25]}
          gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
          style={{ width: "100%", height: "100%", pointerEvents: "none" }}
        >
          <ambientLight intensity={0.9} />
          <directionalLight position={[2, 3, 2]} intensity={1.5} />
          <Fault3DGeometry type={type} isSelected={isSelected} />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default Floating3DIcon;
