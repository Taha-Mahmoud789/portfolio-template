/**
 * SpaceCarouselScene — Premium Developer Solar System
 *
 * Cinematic camera system with 3 states:
 * - SOLAR_VIEW: orbiting overview
 * - TRAVELING: GSAP-powered camera flight to planet
 * - PLANET_VIEW: focused on planet, slow rotation, moons visible
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Preload } from "@react-three/drei";
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
// Planet Mesh Registry — camera reads live world positions from this
// ============================================================================

export const planetMeshRegistry: Record<string, THREE.Object3D | null> = {};

// ============================================================================
// Planet Orbit Angles — asymmetric for natural 3D composition
// ============================================================================

const PLANET_ANGLES: Record<string, number> = {
  "project-over-benefits": (35 * Math.PI) / 180,
  "project-mts-med": (140 * Math.PI) / 180,
  "project-el-hady-law": (250 * Math.PI) / 180,
};

// ============================================================================
// Planet Moon Mapping — links planets to their technology moons
// ============================================================================

const PLANET_MOONS: Record<string, readonly string[]> = {
  "project-over-benefits": [
    "moon-html5-over",
    "moon-css3-over",
    "moon-bootstrap-over",
    "moon-js-over",
    "moon-php-over",
  ],
  "project-mts-med": [
    "moon-wordpress-mts",
    "moon-woocommerce-mts",
    "moon-elementor-mts",
    "moon-php-mts",
    "moon-js-mts",
  ],
  "project-el-hady-law": [
    "moon-wordpress-elhady",
    "moon-elementor-elhady",
    "moon-php-elhady",
    "moon-multilingual-elhady",
    "moon-responsive-elhady",
  ],
};

// ============================================================================
// View Modes
// ============================================================================

type ViewMode = "solar" | "traveling" | "planet";

// ============================================================================
// Scene Contents
// ============================================================================

function SceneContents({
  selectedId,
  onSelect,
  onHover,
  hoveredId,
  viewMode,
}: {
  readonly selectedId: string | null;
  readonly onSelect: (id: string) => void;
  readonly onHover: (id: string | null) => void;
  readonly hoveredId: string | null;
  readonly viewMode: ViewMode;
}) {
  return (
    <group>
      {/* Premium lighting — warm key, cool fill, cinematic */}
      <ambientLight intensity={0.12} color="#e8dcc8" />

      {/* Key light — warm, from upper right — Apple reveal */}
      <directionalLight position={[15, 20, 10]} intensity={1.4} color="#f5efe3" />

      {/* Fill light — cool blue, from left — depth */}
      <directionalLight position={[-18, 6, -8]} intensity={0.35} color="#8fa8c8" />

      {/* Rim light — from behind, subtle edge */}
      <directionalLight position={[0, -4, -25]} intensity={0.2} color="#c8b89a" />

      {/* Core point light — warm gold emanation */}
      <pointLight position={[0, 0, 0]} intensity={3} color="#d4b896" distance={40} decay={2} />

      {/* Subtle accent lights */}
      <pointLight position={[10, 2, -3]} intensity={0.25} color="#8fa8c8" distance={25} decay={2} />
      <pointLight position={[-8, -3, 6]} intensity={0.15} color="#d4b896" distance={18} decay={2} />

      {/* Background layers */}
      <Starfield />
      <Nebula />

      {/* Elliptic grid */}
      <EllipticLines />

      {/* Developer Core — center of the universe */}
      <DeveloperCore />

      {/* Planets — one per project */}
      {ORBITS[0].objectIds.map((planetId) => {
        const planet = OBJECTS.find((o) => o.id === planetId);
        if (!planet) return null;

        const isSelected = selectedId === planetId;
        const isHovered = hoveredId === planetId;

        // Get moons for THIS planet only — from PLANET_MOONS mapping
        const moonIds = PLANET_MOONS[planetId] ?? [];
        const moons = moonIds
          .map((moonId) => {
            const moonObj = OBJECTS.find((o) => o.id === moonId);
            if (!moonObj) return null;
            return {
              label: moonObj.metadata.title,
              color: parseInt(moonObj.metadata.accentColor.replace("#", ""), 16),
            };
          })
          .filter((m): m is { label: string; color: number } => m !== null);

        return (
          <SolarPlanet
            key={planetId}
            orbitId={planetId}
            angle={PLANET_ANGLES[planetId] ?? 0}
            distance={ORBITS[0].radius}
            tilt={ORBITS[0].tilt}
            speed={ORBITS[0].speed}
            isSelected={isSelected}
            isHovered={isHovered}
            moons={moons}
            onSelect={onSelect}
            onHover={onHover}
            isFocused={viewMode === "planet" && isSelected}
          />
        );
      })}

      {/* Connection arcs between related objects */}
      <ConnectionArcs focusedId={selectedId} hoveredId={hoveredId} />
    </group>
  );
}

// ============================================================================
// Camera — cinematic travel system
// ============================================================================

function SolarCamera({
  selectedId,
  viewMode,
  onViewModeChange,
  isDragging,
}: {
  readonly selectedId: string | null;
  readonly viewMode: ViewMode;
  readonly onViewModeChange: (mode: ViewMode) => void;
  readonly isDragging: boolean;
}) {
  const { camera, clock } = useThree();

  // ── Solar orbit state ──
  const angleRef = useRef(0.4);
  const solarPosRef = useRef(new THREE.Vector3(12, 10, 28));
  const solarLookRef = useRef(new THREE.Vector3(0, 0, 0));
  const currentPosRef = useRef(new THREE.Vector3(12, 10, 28));
  const currentLookRef = useRef(new THREE.Vector3(0, 0, 0));

  // ── State machine ──
  const stateRef = useRef<"solar" | "traveling" | "following" | "returning">("solar");

  // ── Follow state ──
  const followStrengthRef = useRef(0);
  const travelStartTimeRef = useRef(0);
  const travelDurationRef = useRef(2.5);

  // ── Temp vectors (reused every frame, zero allocations) ──
  const _planetPos = useRef(new THREE.Vector3());
  const _desiredPos = useRef(new THREE.Vector3());
  const _lookAtTarget = useRef(new THREE.Vector3());
  const _radial = useRef(new THREE.Vector3());
  const _tangent = useRef(new THREE.Vector3());

  useFrame(() => {
    const t = clock.elapsedTime;
    const state = stateRef.current;

    // ── SOLAR: orbiting overview ──
    if (state === "solar") {
      if (!isDragging && !selectedId) {
        angleRef.current += 0.0005;
      }

      const t2 = angleRef.current;
      const orbitRadius = 30;

      solarPosRef.current.set(
        Math.cos(t2) * orbitRadius,
        10 + Math.sin(t2 * 0.2) * 2,
        Math.sin(t2) * orbitRadius,
      );
      solarLookRef.current.set(0, 0, 0);

      currentPosRef.current.lerp(solarPosRef.current, 0.012);
      currentLookRef.current.lerp(solarLookRef.current, 0.015);

      camera.position.copy(currentPosRef.current);
      camera.lookAt(currentLookRef.current);
      return;
    }

    // ── RETURNING: smoothly return to solar overview (must be before FOLLOWING) ──
    if (state === "returning") {
      const t2 = angleRef.current;
      const orbitRadius = 30;

      solarPosRef.current.set(
        Math.cos(t2) * orbitRadius,
        10 + Math.sin(t2 * 0.2) * 2,
        Math.sin(t2) * orbitRadius,
      );
      solarLookRef.current.set(0, 0, 0);

      camera.position.lerp(solarPosRef.current, 0.025);
      _lookAtTarget.current.lerp(solarLookRef.current, 0.03);
      camera.lookAt(_lookAtTarget.current);

      if (camera.position.distanceTo(solarPosRef.current) < 0.5) {
        stateRef.current = "solar";
        currentPosRef.current.copy(solarPosRef.current);
        currentLookRef.current.copy(solarLookRef.current);
        onViewModeChange("solar");
      }
      return;
    }

    // ── FOLLOWING / TRAVELING: track live planet via getWorldPosition ──
    if (selectedId) {
      const planet = planetMeshRegistry[selectedId];
      if (planet) {
        // Read ACTUAL world position from the Three.js scene graph every frame
        planet.getWorldPosition(_planetPos.current);

        // Compute dynamic offset: outward from center + tangent (behind) + height
        _radial.current.copy(_planetPos.current).normalize();
        _tangent.current.set(-_radial.current.z, 0, _radial.current.x);

        _desiredPos.current.copy(_planetPos.current);
        _desiredPos.current.x += _radial.current.x * 7 + _tangent.current.x * 3;
        _desiredPos.current.y += 2.5;
        _desiredPos.current.z += _radial.current.z * 7 + _tangent.current.z * 3;

        // Update follow strength
        if (state === "traveling") {
          const elapsed = t - travelStartTimeRef.current;
          followStrengthRef.current = Math.min(elapsed / travelDurationRef.current, 1);
        } else if (state === "following") {
          followStrengthRef.current = 1;
        }

        // Lerp camera toward desired position
        const lerpFactor = followStrengthRef.current * 0.05;
        camera.position.lerp(_desiredPos.current, lerpFactor);

        // Smooth lookAt — always tracks live planet position
        _lookAtTarget.current.lerp(_planetPos.current, followStrengthRef.current * 0.06);
        camera.lookAt(_lookAtTarget.current);

        // Transition: traveling → following
        if (state === "traveling" && followStrengthRef.current >= 1) {
          stateRef.current = "following";
          onViewModeChange("planet");
        }
        return;
      }
    }
  });

  const travelTo = useCallback(
    (_orbitId: string) => {
      followStrengthRef.current = 0;
      travelStartTimeRef.current = clock.elapsedTime;
      travelDurationRef.current = 2.5;
      stateRef.current = "traveling";
    },
    [clock],
  );

  const startReturn = useCallback(() => {
    stateRef.current = "returning";
  }, []);

  // Expose travel functions via ref
  const apiRef = useRef({ travelTo, startReturn });
  apiRef.current = { travelTo, startReturn };

  // Store API for parent access
  cameraAPIRef.current = apiRef.current;

  // Trigger travel when viewMode transitions to "traveling"
  const travelTriggeredRef = useRef<string | null>(null);
  useEffect(() => {
    if (viewMode === "traveling" && selectedId && travelTriggeredRef.current !== selectedId) {
      travelTriggeredRef.current = selectedId;
      travelTo(selectedId);
    }
    if (viewMode === "solar") {
      travelTriggeredRef.current = null;
    }
  });

  return null;
}

// ============================================================================
// Postprocessing — premium, subtle
// ============================================================================

function PostProcessing() {
  return (
    <EffectComposer>
      <Bloom intensity={0.35} luminanceThreshold={0.6} luminanceSmoothing={0.9} mipmapBlur />
      <Vignette offset={0.35} darkness={0.5} />
    </EffectComposer>
  );
}

// ============================================================================
// Camera API — shared between scene and experience
// ============================================================================

interface CameraAPI {
  travelTo: (orbitId: string) => void;
  startReturn: () => void;
}

export const cameraAPIRef: { current: CameraAPI | null } = { current: null };

// ============================================================================
// Component
// ============================================================================

interface SpaceCarouselSceneProps {
  readonly className?: string;
  readonly selectedId?: string | null;
  readonly onSelect?: (id: string) => void;
  readonly viewMode?: ViewMode;
  readonly onViewModeChange?: (mode: ViewMode) => void;
}

export function SpaceCarouselScene({
  className,
  selectedId = null,
  onSelect,
  viewMode = "solar",
  onViewModeChange,
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
      if (viewMode !== "solar") return;
      onSelect?.(id);
    },
    [onSelect, viewMode],
  );

  const handleHover = useCallback((id: string | null) => {
    setHoveredId(id);
  }, []);

  const handleViewModeChange = useCallback(
    (mode: ViewMode) => {
      onViewModeChange?.(mode);
    },
    [onViewModeChange],
  );

  return (
    <div
      className={`absolute inset-0 ${className ?? ""}`}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
    >
      <Canvas
        camera={{
          position: [12, 10, 28],
          fov: 42,
          near: 0.1,
          far: 5000,
        }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          gl.setClearColor("#06080e");
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.1;
        }}
      >
        <SceneContents
          selectedId={selectedId}
          onSelect={handleSelect}
          onHover={handleHover}
          hoveredId={hoveredId}
          viewMode={viewMode}
        />
        <SolarCamera
          selectedId={selectedId}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          isDragging={isDragging}
        />
        <PostProcessing />
        <Preload all />
      </Canvas>
    </div>
  );
}
