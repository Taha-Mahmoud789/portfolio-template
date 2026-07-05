/**
 * Space Object Mesh — Premium Physical Materials
 *
 * 3D objects with glass/energy aesthetic:
 * - MeshPhysicalMaterial with clearcoat
 * - Subtle emissive glow
 * - Labels only on hover/focus
 * - Selection ring indicator
 */

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Html } from "@react-three/drei";
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
// Premium palette — muted, cinematic
// ============================================================================

const PALETTE = {
  base: 0x5a5550,
  hover: 0xe8dcc8,
  emissive: 0x8a7545,
  accent: 0xb8a070,
} as const;

// ============================================================================
// Geometry — premium variety per type
// ============================================================================

function ObjectGeometry({ type }: { readonly type: SpaceObject["type"] }) {
  switch (type) {
    case "project":
      return <dodecahedronGeometry args={[0.6, 0]} />;
    default:
      return <sphereGeometry args={[0.5, 32, 32]} />;
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

    meshRef.current.rotation.y = t * 0.02;
    meshRef.current.rotation.x = t * 0.01;

    if (selectPulseRef.current > 0) {
      selectPulseRef.current *= 0.93;
    }

    const baseScale = object.type === "project" ? 1.0 : 0.85;
    const pulseScale = 1 + selectPulseRef.current * 0.1;
    const targetScale = isFocused
      ? baseScale * 1.08 * pulseScale
      : isHovered
        ? baseScale * 1.04 * pulseScale
        : baseScale * pulseScale;
    meshRef.current.scale.lerp({ x: targetScale, y: targetScale, z: targetScale }, 0.05);

    if (glowRef.current) {
      const glowScale = isFocused ? 1.2 : isHovered ? 1.04 : 0;
      glowRef.current.scale.lerp({ x: glowScale, y: glowScale, z: glowScale }, 0.04);
    }
  });

  const emissiveIntensity = isFocused ? 0.4 : isHovered ? 0.3 : isConnected ? 0.2 : 0.1;

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

  const floatSpeed = object.type === "project" ? 0.6 : object.type === "technology" ? 0.8 : 1.0;
  const floatIntensity = object.type === "project" ? 0.15 : 0.1;

  return (
    <Float
      speed={floatSpeed}
      rotationIntensity={0.08}
      floatIntensity={floatIntensity}
      floatingRange={[-0.03, 0.03]}
    >
      <group position={object.position}>
        <mesh
          ref={meshRef}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          onClick={handleClick}
        >
          <ObjectGeometry type={object.type} />
          <meshPhysicalMaterial
            color={isHovered || isFocused ? PALETTE.hover : PALETTE.base}
            emissive={PALETTE.emissive}
            emissiveIntensity={emissiveIntensity}
            metalness={0.5}
            roughness={0.15}
            clearcoat={0.7}
            clearcoatRoughness={0.1}
          />
        </mesh>

        {/* Selection ring — thin, subtle */}
        <mesh ref={glowRef} scale={0} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.8, 0.005, 16, 64]} />
          <meshBasicMaterial color={PALETTE.accent} transparent opacity={0.2} />
        </mesh>

        {/* Label — hover/focus only */}
        {(isHovered || isFocused) && (
          <Html
            position={[0, object.type === "project" ? 1.0 : 0.8, 0]}
            center
            style={{ pointerEvents: "none", userSelect: "none" }}
          >
            <div
              className="whitespace-nowrap animate-[fadeIn_0.15s_ease-out]"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "11px",
                fontWeight: 400,
                letterSpacing: "0.05em",
                textTransform: "uppercase" as const,
                color: "rgba(232, 220, 200, 0.85)",
                padding: "5px 12px",
                borderRadius: "6px",
                background: "rgba(6, 8, 14, 0.8)",
                border: "1px solid rgba(184, 160, 112, 0.15)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.4)",
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
