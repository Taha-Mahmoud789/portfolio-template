/**
 * SpaceCarouselScene — Developer Solar System
 *
 * A premium solar system experience:
 * - DeveloperCore at center (identity sphere)
 * - 4 planets orbiting (Projects, Code, Creative, Future)
 * - Project moons orbiting the Projects planet
 * - EllipticLines grid
 * - Starfield background
 * - Nebula depth layers
 * - ConnectionArcs between related objects
 *
 * Camera: slow auto-orbit, click planet to focus.
 * Inspired by bobbyroe/solar-system — premium, not astronomy.
 */

import { Suspense, useCallback, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdaptiveDpr, AdaptiveEvents, Preload } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { ORBITS, OBJECTS } from "../data/space.config";
import { DeveloperCore } from "./DeveloperCore";
import { SolarPlanet } from "./SolarPlanet";
import { Starfield } from "./Starfield";
import { Nebula } from "./Nebula";
import { EllipticLines } from "./EllipticLines";
import { ConnectionArcs } from "./ConnectionArcs";

// ============================================================================
// Planet Orbit Angles — precomputed for consistent positions
// ============================================================================

const PLANET_ANGLES: Record<string, number> = {
  projects: 0,
  technology: Math.PI * 0.5,
  creative: Math.PI,
  future: Math.PI * 1.5,
};

// ============================================================================
// Scene Contents
// ============================================================================

function SceneContents({
  selectedId,
  onSelect,
  onHover,
  hoveredId,
}: {
  readonly selectedId: string | null;
  readonly onSelect: (id: string) => void;
  readonly onHover: (id: string | null) => void;
  readonly hoveredId: string | null;
}) {
  return (
    <group>
      {/* Lighting — premium hierarchy */}
      <ambientLight intensity={0.25} color="#f5f0e8" />
      <directionalLight position={[5, 8, 5]} intensity={1.0} color="#f5f0e8" />
      <directionalLight position={[-3, 5, -3]} intensity={0.4} color="#C9A96E" />
      <directionalLight position={[0, -3, 5]} intensity={0.2} color="#60a5fa" />
      <pointLight position={[0, 0, 0]} intensity={4.0} color="#C9A96E" distance={20} decay={2} />

      {/* Background layers */}
      <Starfield />
      <Nebula />

      {/* Elliptic grid */}
      <EllipticLines />

      {/* Developer Core — center of the universe */}
      <DeveloperCore />

      {/* Planets — one per orbit */}
      {ORBITS.map((orbit) => {
        const isSelected = selectedId === orbit.id;
        const isHovered = hoveredId === orbit.id;

        // Gather moons for this orbit
        const moonData = orbit.objectIds.map((objId) => {
          const obj = OBJECTS.find((o) => o.id === objId);
          return {
            label: obj?.metadata.title ?? objId,
            color: obj?.metadata.accentColor
              ? parseInt(obj.metadata.accentColor.replace("#", ""), 16)
              : 0xc9a96e,
          };
        });

        return (
          <SolarPlanet
            key={orbit.id}
            orbitId={orbit.id}
            angle={PLANET_ANGLES[orbit.id] ?? 0}
            distance={orbit.radius}
            tilt={orbit.tilt}
            speed={orbit.speed}
            isSelected={isSelected}
            isHovered={isHovered}
            moons={moonData}
            onSelect={onSelect}
            onHover={onHover}
          />
        );
      })}

      {/* Connection arcs between related objects */}
      <ConnectionArcs focusedId={selectedId} hoveredId={hoveredId} />
    </group>
  );
}

// ============================================================================
// Camera — slow auto-orbit with click-to-focus
// ============================================================================

function SolarCamera({
  selectedId,
  isDragging,
}: {
  readonly selectedId: string | null;
  readonly isDragging: boolean;
}) {
  const { camera } = useThree();
  const angleRef = useRef(0);
  const targetPosRef = useRef(new THREE.Vector3(0, 5, 18));
  const targetLookRef = useRef(new THREE.Vector3(0, 0, 0));
  const currentPosRef = useRef(new THREE.Vector3(0, 5, 18));
  const currentLookRef = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    if (!isDragging && !selectedId) {
      angleRef.current += 0.0012;
    }

    const t = angleRef.current;
    const d = 16;

    if (selectedId) {
      // Focus on selected planet
      const orbit = ORBITS.find((o) => o.id === selectedId);
      if (orbit) {
        const angle = PLANET_ANGLES[orbit.id] ?? 0;
        const dist = orbit.radius;
        targetPosRef.current.set(
          Math.cos(angle) * dist * 0.5,
          2.0,
          Math.sin(angle) * dist * 0.5 + 4.5,
        );
        targetLookRef.current.set(Math.cos(angle) * dist * 0.25, 0, Math.sin(angle) * dist * 0.25);
      }
    } else {
      // Auto-orbit with vertical variety
      targetPosRef.current.set(Math.cos(t) * d, 3.0 + Math.sin(t * 0.4) * 1.5, Math.sin(t) * d);
      targetLookRef.current.set(0, 0, 0);
    }

    // Smooth interpolation — lerp for cinematic feel
    currentPosRef.current.lerp(targetPosRef.current, 0.025);
    currentLookRef.current.lerp(targetLookRef.current, 0.025);

    camera.position.copy(currentPosRef.current);
    camera.lookAt(currentLookRef.current);
  });

  return null;
}

// ============================================================================
// Postprocessing
// ============================================================================

function PostProcessing() {
  return (
    <EffectComposer>
      <Bloom intensity={1.2} luminanceThreshold={0.15} luminanceSmoothing={0.9} mipmapBlur />
      <Vignette offset={0.25} darkness={0.55} />
    </EffectComposer>
  );
}

// ============================================================================
// Component
// ============================================================================

interface SpaceCarouselSceneProps {
  readonly className?: string;
  readonly selectedId?: string | null;
  readonly onSelect?: (id: string) => void;
}

export function SpaceCarouselScene({
  className,
  selectedId = null,
  onSelect,
}: SpaceCarouselSceneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleSelect = useCallback(
    (id: string) => {
      onSelect?.(id);
    },
    [onSelect],
  );

  const handleHover = useCallback((id: string | null) => {
    setHoveredId(id);
  }, []);

  return (
    <div
      className={`absolute inset-0 ${className ?? ""}`}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
    >
      <Canvas
        camera={{
          position: [0, 5, 18],
          fov: 50,
          near: 0.1,
          far: 200,
        }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          gl.setClearColor("#030712");
        }}
      >
        <Suspense fallback={null}>
          <SceneContents
            selectedId={selectedId}
            onSelect={handleSelect}
            onHover={handleHover}
            hoveredId={hoveredId}
          />
          <SolarCamera selectedId={selectedId} isDragging={isDragging} />
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />
          <PostProcessing />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
