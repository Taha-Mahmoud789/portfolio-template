/**
 * Space Object Mesh
 *
 * Premium 3D objects with external libraries:
 * - Float for gentle floating motion
 * - MeshDistortMaterial for organic distortion
 * - Environment reflections for glass-like materials
 * - Bloom-ready emissive materials
 * - Premium geometry variety
 */

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Html } from "@react-three/drei";
import type { Mesh } from "three";
import type { SpaceObject } from "../data/types";
import { CONNECTIONS } from "../data/space.config";
import { useReducedMotion } from "../hooks";

interface SpaceObjectMeshProps {
  object: SpaceObject;
  isHovered: boolean;
  isFocused: boolean;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}

// ============================================================================
// Premium palette — warm white + gold
// ============================================================================

const PALETTE = {
  base: "#b8a990",
  hover: "#f5f0e8",
  emissive: "#C9A96E",
} as const;

// ============================================================================
// Geometry — premium variety per type
// ============================================================================

function ObjectGeometry({ type }: { readonly type: SpaceObject["type"] }) {
  switch (type) {
    case "project":
      return <dodecahedronGeometry args={[0.8, 0]} />;
    case "technology":
      return <icosahedronGeometry args={[0.65, 0]} />;
    case "creative":
      return <octahedronGeometry args={[0.65, 0]} />;
    case "future":
      return <torusGeometry args={[0.5, 0.2, 16, 32]} />;
    default:
      return <sphereGeometry args={[0.6, 32, 32]} />;
  }
}

// ============================================================================
// Component
// ============================================================================

export function SpaceObjectMesh({
  object,
  isHovered,
  isFocused,
  hoveredId,
  onHover,
  onSelect,
}: SpaceObjectMeshProps) {
  const meshRef = useRef<Mesh>(null);
  const glowRef = useRef<Mesh>(null);
  const selectPulseRef = useRef(0);
  const reducedMotion = useReducedMotion();

  const isConnected = useMemo(() => {
    if (!hoveredId || hoveredId === object.id) return false;
    return CONNECTIONS.some(
      (c) =>
        (c.from === hoveredId && c.to === object.id) ||
        (c.to === hoveredId && c.from === object.id),
    );
  }, [hoveredId, object.id]);

  useFrame((state) => {
    if (!meshRef.current || reducedMotion) return;

    const t = state.clock.elapsedTime;

    // Slow rotation
    meshRef.current.rotation.y = t * 0.03;
    meshRef.current.rotation.x = t * 0.015;

    // Selection pulse
    if (selectPulseRef.current > 0) {
      selectPulseRef.current *= 0.93;
    }

    // Scale
    const baseScale = object.type === "project" ? 1.0 : 0.85;
    const pulseScale = 1 + selectPulseRef.current * 0.1;
    const targetScale = isFocused
      ? baseScale * 1.1 * pulseScale
      : isHovered
        ? baseScale * 1.05 * pulseScale
        : baseScale * pulseScale;
    meshRef.current.scale.lerp({ x: targetScale, y: targetScale, z: targetScale }, 0.05);

    // Glow ring
    if (glowRef.current) {
      const glowScale = isFocused ? 1.3 : isHovered ? 1.05 : 0;
      glowRef.current.scale.lerp({ x: glowScale, y: glowScale, z: glowScale }, 0.04);
    }
  });

  const emissiveIntensity = isFocused ? 0.6 : isHovered ? 0.45 : isConnected ? 0.3 : 0.18;

  const handlePointerOver = () => {
    onHover(object.id);
    if (typeof document !== "undefined") {
      document.body.style.cursor = object.type === "project" ? "zoom-in" : "pointer";
    }
  };

  const handlePointerOut = () => {
    onHover(null);
    if (typeof document !== "undefined") {
      document.body.style.cursor = "default";
    }
  };

  const handleClick = () => {
    selectPulseRef.current = 1;
    onSelect(object.id);
  };

  const floatSpeed = object.type === "project" ? 0.8 : object.type === "technology" ? 1.2 : 1.5;
  const floatIntensity = object.type === "project" ? 0.3 : 0.2;

  return (
    <Float
      speed={floatSpeed}
      rotationIntensity={0.15}
      floatIntensity={floatIntensity}
      floatingRange={[-0.05, 0.05]}
    >
      <group position={object.position}>
        <mesh
          ref={meshRef}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          onClick={handleClick}
        >
          <ObjectGeometry type={object.type} />
          <MeshDistortMaterial
            color={isHovered || isFocused ? PALETTE.hover : PALETTE.base}
            emissive={PALETTE.emissive}
            emissiveIntensity={emissiveIntensity}
            metalness={0.7}
            roughness={0.08}
            transparent
            opacity={0.95}
            distort={isHovered ? 0.18 : 0.06}
            speed={2}
          />
        </mesh>

        {/* Selection ring */}
        <mesh ref={glowRef} scale={0} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.1, 0.008, 16, 64]} />
          <meshBasicMaterial color={PALETTE.emissive} transparent opacity={0.3} />
        </mesh>

        {/* Label */}
        {(isHovered || isFocused) && (
          <Html
            position={[0, object.type === "project" ? 1.3 : 1.1, 0]}
            center
            style={{ pointerEvents: "none", userSelect: "none" }}
          >
            <div
              className="whitespace-nowrap animate-[fadeIn_0.15s_ease-out]"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "12px",
                fontWeight: 500,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "#f5f0e8",
                padding: "6px 14px",
                borderRadius: "8px",
                background: "rgba(8, 7, 6, 0.75)",
                border: "1px solid rgba(201, 169, 110, 0.25)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                boxShadow: "0 4px 24px rgba(0, 0, 0, 0.3)",
              }}
            >
              {object.metadata.title}
            </div>
          </Html>
        )}
      </group>
    </Float>
  );
}
