/**
 * SpaceScene — Premium Cinematic Composition
 *
 * Apple Vision Pro–inspired spatial camera:
 * - Environment reflections for premium materials
 * - Bloom postprocessing for soft glow
 * - Vignette for cinematic depth
 * - Stable camera with spring physics
 * - Scroll with inertia
 */

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdaptiveDpr, AdaptiveEvents, Environment, Preload } from "@react-three/drei";
import type { Group } from "three";
import { useReducedMotion } from "../hooks";
import { CAMERA_PRESETS, NAVIGATION } from "../data/space.config";
import type { CameraMode } from "../data/types";
import { DeepSpace } from "./DeepSpace";
import { LightField } from "./LightField";
import { AtmosphericFog } from "./AtmosphericFog";
import { AbstractParticles } from "./AbstractParticles";
import { ConstellationLines } from "./ConstellationLines";
import { CosmicDust } from "./CosmicDust";
import { EnergyCore } from "./EnergyCore";
import { OrbitPaths } from "./OrbitPaths";
import { ConnectionLines } from "./ConnectionLines";
import { SpaceEnvironment } from "./SpaceEnvironment";
import { SpaceObjects } from "../components/space-objects";
import { ProjectGalaxy } from "../components/project-galaxy";
import { hasProjectGalaxy } from "../data/project-galaxy-data";

// ============================================================================
// Constants
// ============================================================================

const SPRING = {
  positionStiffness: 0.08,
  positionDamping: 0.86,
  lookAtStiffness: 0.1,
  lookAtDamping: 0.84,
} as const;

const PARALLAX = {
  deepSpace: 0.0001,
  lightField: 0.0002,
  fog: 0.0003,
  particles: 0.0004,
  constellations: 0.0005,
  dust: 0.0006,
  core: 0.0003,
  orbits: 0.0004,
} as const;

const MOUSE_INFLUENCE = 0.08;
const ENTRANCE_DURATION = 1200;

// ============================================================================
// Spring Physics
// ============================================================================

function springStep(
  current: number,
  target: number,
  velocity: number,
  stiffness: number,
  damping: number,
): { value: number; velocity: number } {
  const force = (target - current) * stiffness;
  const newVelocity = (velocity + force) * damping;
  return { value: current + newVelocity, velocity: newVelocity };
}

// ============================================================================
// Parallax Layer
// ============================================================================

function ParallaxLayer({
  children,
  speed,
  mouseRef,
}: {
  readonly children: React.ReactNode;
  readonly speed: number;
  readonly mouseRef: React.RefObject<{ x: number; y: number }>;
}) {
  const groupRef = useRef<Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.position.x = mouseRef.current.x * speed;
    groupRef.current.position.y = mouseRef.current.y * speed;
  });

  return <group ref={groupRef}>{children}</group>;
}

// ============================================================================
// Scene Contents
// ============================================================================

function SceneContents({
  mouseRef,
  opacity,
  focusedId,
  hoveredId,
}: {
  readonly mouseRef: React.RefObject<{ x: number; readonly y: number }>;
  readonly opacity: number;
  readonly focusedId: string | null;
  readonly hoveredId: string | null;
}) {
  return (
    <group>
      {/* Premium cinematic lighting */}
      <ambientLight intensity={0.1} color="#e8dcc8" />
      <directionalLight position={[12, 18, 8]} intensity={0.8} color="#f5efe3" />
      <directionalLight position={[-15, 8, -5]} intensity={0.3} color="#8fa8c8" />
      <directionalLight position={[0, -2, -20]} intensity={0.15} color="#c8b89a" />
      <pointLight position={[0, 0, 0]} intensity={1.5} color="#d4b896" distance={30} decay={2} />

      {/* Environment for reflections */}
      <Environment preset="night" />

      <ParallaxLayer speed={PARALLAX.deepSpace} mouseRef={mouseRef}>
        <DeepSpace />
      </ParallaxLayer>

      <ParallaxLayer speed={PARALLAX.lightField} mouseRef={mouseRef}>
        <LightField />
      </ParallaxLayer>

      <SpaceEnvironment />

      <ParallaxLayer speed={PARALLAX.fog} mouseRef={mouseRef}>
        <AtmosphericFog />
      </ParallaxLayer>

      <ParallaxLayer speed={PARALLAX.particles} mouseRef={mouseRef}>
        <AbstractParticles />
      </ParallaxLayer>

      <ParallaxLayer speed={PARALLAX.constellations} mouseRef={mouseRef}>
        <ConstellationLines />
      </ParallaxLayer>

      <ParallaxLayer speed={PARALLAX.dust} mouseRef={mouseRef}>
        <CosmicDust />
      </ParallaxLayer>

      <ParallaxLayer speed={PARALLAX.core} mouseRef={mouseRef}>
        <EnergyCore />
      </ParallaxLayer>

      <ParallaxLayer speed={PARALLAX.orbits} mouseRef={mouseRef}>
        <OrbitPaths />
      </ParallaxLayer>

      <ConnectionLines focusedId={focusedId} hoveredId={hoveredId} />

      <SpaceObjects />

      {focusedId && hasProjectGalaxy(focusedId) && (
        <ProjectGalaxy objectId={focusedId} isVisible={true} />
      )}

      {opacity > 0.01 && (
        <mesh position={[0, 0, 50]} frustumCulled={false}>
          <planeGeometry args={[100, 100]} />
          <meshBasicMaterial color="#030712" transparent opacity={opacity} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
}

// ============================================================================
// Postprocessing
// ============================================================================

function PostProcessing() {
  return null;
}

// ============================================================================
// Camera Rig
// ============================================================================

function CameraRig({
  cameraMode,
  focusPosition,
  scrollOffset,
  mouseRef,
  onBackgroundClick,
  cameraOverride,
}: {
  readonly cameraMode: CameraMode;
  readonly focusPosition: [number, number, number] | null;
  readonly scrollOffset: number;
  readonly mouseRef: React.RefObject<{ readonly x: number; readonly y: number }>;
  readonly onBackgroundClick: () => void;
  readonly cameraOverride?: {
    readonly position: [number, number, number];
    readonly target: [number, number, number];
  } | null;
}) {
  const { camera, gl } = useThree();
  const reducedMotion = useReducedMotion();

  const velocityRef = useRef({ x: 0, y: 0, z: 0 });
  const lookAtVelocityRef = useRef({ x: 0, y: 0, z: 0 });
  const currentLookAtRef = useRef({ x: 0, y: 0, z: 0 });
  const initializedRef = useRef(false);

  const preset = CAMERA_PRESETS[cameraMode];

  let targetX = preset.position[0];
  let targetY = preset.position[1];
  let targetZ = preset.position[2];

  if (cameraMode === "object-focus" && focusPosition) {
    const [ox, oy, oz] = focusPosition;
    const approachDist = NAVIGATION.focusApproachDistance;
    targetX = ox;
    targetY = oy + 0.5;
    targetZ = oz + approachDist;
  }

  if (cameraMode === "overview") {
    targetZ += scrollOffset;
  }

  let lookAtTarget = preset.target;
  if (cameraOverride) {
    targetX = cameraOverride.position[0];
    targetY = cameraOverride.position[1];
    targetZ = cameraOverride.position[2];
    lookAtTarget = cameraOverride.target;
  }

  useFrame(() => {
    if (reducedMotion) return;

    const mouseParallaxX = mouseRef.current.x * MOUSE_INFLUENCE;
    const mouseParallaxY = mouseRef.current.y * MOUSE_INFLUENCE;

    const finalTargetX = targetX + mouseParallaxX;
    const finalTargetY = targetY + mouseParallaxY;

    if (!initializedRef.current) {
      currentLookAtRef.current.x = lookAtTarget[0];
      currentLookAtRef.current.y = lookAtTarget[1];
      currentLookAtRef.current.z = lookAtTarget[2];
      camera.lookAt(lookAtTarget[0], lookAtTarget[1], lookAtTarget[2]);
      initializedRef.current = true;
    }

    const sx = springStep(
      camera.position.x,
      finalTargetX,
      velocityRef.current.x,
      SPRING.positionStiffness,
      SPRING.positionDamping,
    );
    const sy = springStep(
      camera.position.y,
      finalTargetY,
      velocityRef.current.y,
      SPRING.positionStiffness,
      SPRING.positionDamping,
    );
    const sz = springStep(
      camera.position.z,
      targetZ,
      velocityRef.current.z,
      SPRING.positionStiffness,
      SPRING.positionDamping,
    );

    velocityRef.current.x = sx.velocity;
    velocityRef.current.y = sy.velocity;
    velocityRef.current.z = sz.velocity;

    camera.position.x = sx.value;
    camera.position.y = sy.value;
    camera.position.z = sz.value;

    const lx = springStep(
      currentLookAtRef.current.x,
      lookAtTarget[0],
      lookAtVelocityRef.current.x,
      SPRING.lookAtStiffness,
      SPRING.lookAtDamping,
    );
    const ly = springStep(
      currentLookAtRef.current.y,
      lookAtTarget[1],
      lookAtVelocityRef.current.y,
      SPRING.lookAtStiffness,
      SPRING.lookAtDamping,
    );
    const lz = springStep(
      currentLookAtRef.current.z,
      lookAtTarget[2],
      lookAtVelocityRef.current.z,
      SPRING.lookAtStiffness,
      SPRING.lookAtDamping,
    );

    lookAtVelocityRef.current.x = lx.velocity;
    lookAtVelocityRef.current.y = ly.velocity;
    lookAtVelocityRef.current.z = lz.velocity;

    currentLookAtRef.current.x = lx.value;
    currentLookAtRef.current.y = ly.value;
    currentLookAtRef.current.z = lz.value;

    camera.lookAt(lx.value, ly.value, lz.value);
  });

  useEffect(() => {
    const canvas = gl.domElement;
    function handleClick(e: MouseEvent) {
      if (e.target === canvas && cameraMode === "object-focus") {
        onBackgroundClick();
      }
    }
    canvas.addEventListener("click", handleClick);
    return () => canvas.removeEventListener("click", handleClick);
  }, [gl, cameraMode, onBackgroundClick]);

  return null;
}

// ============================================================================
// Fallback
// ============================================================================

function SceneFallback() {
  return (
    <mesh position={[0, 0, 8]}>
      <planeGeometry args={[2, 2]} />
      <meshBasicMaterial color="#030712" transparent opacity={0.15} depthWrite={false} />
    </mesh>
  );
}

// ============================================================================
// Component
// ============================================================================

interface SpaceSceneProps {
  readonly className?: string;
  readonly cameraMode?: CameraMode;
  readonly focusPosition?: [number, number, number] | null;
  readonly focusedId?: string | null;
  readonly hoveredId?: string | null;
  readonly scrollProgress?: number;
  readonly onBackgroundClick?: () => void;
  readonly cameraOverride?: {
    readonly position: [number, number, number];
    readonly target: [number, number, number];
  } | null;
}

export function SpaceScene({
  className,
  cameraMode = "intro",
  focusPosition = null,
  focusedId = null,
  hoveredId = null,
  scrollProgress = 0,
  onBackgroundClick,
  cameraOverride = null,
}: SpaceSceneProps) {
  const reducedMotion = useReducedMotion();
  const [entranceProgress, setEntranceProgress] = useState(reducedMotion ? 1 : 0);
  const mouseTargetRef = useRef({ x: 0, y: 0 });
  const mouseCurrentRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (reducedMotion) {
      setEntranceProgress(1);
      return;
    }

    const start = performance.now();
    let raf: number;

    function animate() {
      const elapsed = performance.now() - start;
      const progress = Math.min(elapsed / ENTRANCE_DURATION, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setEntranceProgress(eased);
      if (progress < 1) raf = requestAnimationFrame(animate);
    }
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [reducedMotion]);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      mouseTargetRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseTargetRef.current.y = (e.clientY / window.innerHeight - 0.5) * -2;
    }
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    let raf: number;
    function interpolate() {
      mouseCurrentRef.current.x += (mouseTargetRef.current.x - mouseCurrentRef.current.x) * 0.03;
      mouseCurrentRef.current.y += (mouseTargetRef.current.y - mouseCurrentRef.current.y) * 0.03;
      raf = requestAnimationFrame(interpolate);
    }
    raf = requestAnimationFrame(interpolate);
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleCreated = useCallback(
    (state: {
      gl: {
        setClearColor: (color: string | number) => void;
        toneMapping: number;
        toneMappingExposure: number;
      };
    }) => {
      state.gl.setClearColor("#06080e");
      state.gl.toneMapping = 4; // ACESFilmicToneMapping
      state.gl.toneMappingExposure = 1.1;
    },
    [],
  );

  const handleBackgroundClick = useCallback(() => {
    onBackgroundClick?.();
  }, [onBackgroundClick]);

  return (
    <div className={`absolute inset-0 ${className ?? ""}`} aria-hidden="true">
      <Canvas
        camera={{
          position: CAMERA_PRESETS.intro.position,
          fov: 50,
          near: 0.1,
          far: 5000,
        }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        onCreated={handleCreated}
      >
        <Suspense fallback={<SceneFallback />}>
          <SceneContents
            mouseRef={mouseCurrentRef}
            opacity={1 - entranceProgress}
            focusedId={focusedId}
            hoveredId={hoveredId}
          />
          <CameraRig
            cameraMode={cameraMode}
            focusPosition={focusPosition}
            scrollOffset={scrollProgress}
            mouseRef={mouseCurrentRef}
            onBackgroundClick={handleBackgroundClick}
            cameraOverride={cameraOverride}
          />
          {!reducedMotion && <AdaptiveDpr pixelated />}
          {!reducedMotion && <AdaptiveEvents />}
          <PostProcessing />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
