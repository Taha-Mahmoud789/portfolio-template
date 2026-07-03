/**
 * SpaceScene — Three.js Canvas + Scene Composition (Awwwards Grade)
 *
 * The cosmos is indifferent. The user is a witness.
 * Focal composition with parallax depth layers, spring camera, entrance animation.
 */

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdaptiveDpr, AdaptiveEvents, Preload } from "@react-three/drei";
import type { Group } from "three";
import { useReducedMotion } from "../hooks";
import { DeepSpace } from "./DeepSpace";
import { Galaxy } from "./Galaxy";
import { StarField } from "./StarField";
import { NebulaCloud } from "./Nebula";
import { Planets } from "./Planet";
import { ConstellationLines } from "./ConstellationLines";
import { CosmicDust } from "./CosmicDust";
import { SpaceEnvironment } from "./SpaceEnvironment";

// ============================================================================
// Constants
// ============================================================================

const CAMERA_CONFIG = {
  basePosition: [0, 0, 6] as [number, number, number],
  springStiffness: 0.02,
  springDamping: 0.92,
  mouseInfluence: 0.3,
  entranceDuration: 2000,
} as const;

const PARALLAX_SPEEDS = {
  deepSpace: 0.0005,
  galaxy: 0.001,
  stars: 0.002,
  nebula: 0.003,
  planets: 0.004,
  constellations: 0.005,
  dust: 0.008,
} as const;

// ============================================================================
// Types
// ============================================================================

interface SpaceSceneProps {
  readonly className?: string;
}

// ============================================================================
// Spring — damped spring physics
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
  const newValue = current + newVelocity;
  return { value: newValue, velocity: newVelocity };
}

// ============================================================================
// Parallax Layer — depth-based movement
// ============================================================================

function ParallaxLayer({
  children,
  speed,
  mouseOffset,
}: {
  readonly children: React.ReactNode;
  readonly speed: number;
  readonly mouseOffset: { readonly x: number; readonly y: number };
}): React.JSX.Element {
  const groupRef = useRef<Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.position.x = mouseOffset.x * speed;
    groupRef.current.position.y = mouseOffset.y * speed;
  });

  return <group ref={groupRef}>{children}</group>;
}

// ============================================================================
// Scene Contents — composited in depth order with parallax
// ============================================================================

function SceneContents({
  mouseOffset,
  opacity,
}: {
  readonly mouseOffset: { readonly x: number; readonly y: number };
  readonly opacity: number;
}): React.JSX.Element {
  return (
    <group>
      {/* Layer 0: The void — slowest parallax */}
      <ParallaxLayer speed={PARALLAX_SPEEDS.deepSpace} mouseOffset={mouseOffset}>
        <DeepSpace />
      </ParallaxLayer>

      {/* Lighting */}
      <SpaceEnvironment />

      {/* Layer 1: Distant galaxy — focal anchor */}
      <ParallaxLayer speed={PARALLAX_SPEEDS.galaxy} mouseOffset={mouseOffset}>
        <Galaxy position={[10, 4, -30]} scale={0.9} />
      </ParallaxLayer>

      {/* Layer 2: Star field */}
      <ParallaxLayer speed={PARALLAX_SPEEDS.stars} mouseOffset={mouseOffset}>
        <StarField />
      </ParallaxLayer>

      {/* Layer 3: Nebula gas clouds */}
      <ParallaxLayer speed={PARALLAX_SPEEDS.nebula} mouseOffset={mouseOffset}>
        <NebulaCloud />
      </ParallaxLayer>

      {/* Layer 4: Planets with atmosphere */}
      <ParallaxLayer speed={PARALLAX_SPEEDS.planets} mouseOffset={mouseOffset}>
        <Planets />
      </ParallaxLayer>

      {/* Layer 5: Constellation lines */}
      <ParallaxLayer speed={PARALLAX_SPEEDS.constellations} mouseOffset={mouseOffset}>
        <ConstellationLines />
      </ParallaxLayer>

      {/* Layer 6: Foreground dust — fastest parallax */}
      <ParallaxLayer speed={PARALLAX_SPEEDS.dust} mouseOffset={mouseOffset}>
        <CosmicDust />
      </ParallaxLayer>

      {/* Entrance fade overlay */}
      <mesh position={[0, 0, 4]}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial color="#030712" transparent opacity={opacity} depthWrite={false} />
      </mesh>
    </group>
  );
}

// ============================================================================
// Camera Rig — spring-based + mouse parallax + entrance
// ============================================================================

function CameraRig({
  mouseOffset,
  entranceProgress,
}: {
  readonly mouseOffset: { readonly x: number; readonly y: number };
  readonly entranceProgress: number;
}): null {
  const { camera } = useThree();
  const reducedMotion = useReducedMotion();
  const velocityRef = useRef({ x: 0, y: 0, z: 0 });
  const timeRef = useRef(0);

  useFrame((_state, delta) => {
    if (reducedMotion) return;

    timeRef.current += delta;
    const t = timeRef.current;

    // Target position: base + mouse parallax + organic drift
    const driftX = Math.sin(t * 0.08) * 0.15;
    const driftY = Math.cos(t * 0.1) * 0.1;

    const targetX =
      CAMERA_CONFIG.basePosition[0] + mouseOffset.x * CAMERA_CONFIG.mouseInfluence + driftX;
    const targetY =
      CAMERA_CONFIG.basePosition[1] + mouseOffset.y * CAMERA_CONFIG.mouseInfluence + driftY;
    const targetZ = CAMERA_CONFIG.basePosition[2];

    // Spring physics for smooth damping
    const springX = springStep(
      camera.position.x,
      targetX,
      velocityRef.current.x,
      CAMERA_CONFIG.springStiffness,
      CAMERA_CONFIG.springDamping,
    );
    const springY = springStep(
      camera.position.y,
      targetY,
      velocityRef.current.y,
      CAMERA_CONFIG.springStiffness,
      CAMERA_CONFIG.springDamping,
    );
    const springZ = springStep(
      camera.position.z,
      targetZ,
      velocityRef.current.z,
      CAMERA_CONFIG.springStiffness,
      CAMERA_CONFIG.springDamping,
    );

    velocityRef.current.x = springX.velocity;
    velocityRef.current.y = springY.velocity;
    velocityRef.current.z = springZ.velocity;

    // Entrance: zoom from far to base position
    camera.position.x = springX.value;
    camera.position.y = springY.value;
    camera.position.z = springZ.value + (1 - entranceProgress) * 10;

    camera.lookAt(0, 0, 0);
  });

  return null;
}

// ============================================================================
// Fallback — loading state
// ============================================================================

function SceneFallback(): React.JSX.Element {
  return (
    <mesh>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshBasicMaterial color="#6366f1" wireframe />
    </mesh>
  );
}

// ============================================================================
// Component
// ============================================================================

export function SpaceScene({ className }: SpaceSceneProps): React.JSX.Element {
  const reducedMotion = useReducedMotion();
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [entranceProgress, setEntranceProgress] = useState(reducedMotion ? 1 : 0);
  const mouseTargetRef = useRef({ x: 0, y: 0 });
  const mouseCurrentRef = useRef({ x: 0, y: 0 });

  // Entrance animation
  useEffect(() => {
    if (reducedMotion) {
      setEntranceProgress(1);
      return;
    }

    const start = performance.now();
    function animate() {
      const elapsed = performance.now() - start;
      const progress = Math.min(elapsed / CAMERA_CONFIG.entranceDuration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setEntranceProgress(eased);
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }
    requestAnimationFrame(animate);
  }, [reducedMotion]);

  // Mouse tracking for parallax
  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      mouseTargetRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseTargetRef.current.y = (e.clientY / window.innerHeight - 0.5) * -2;
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Smooth mouse interpolation
  useEffect(() => {
    let raf: number;
    function interpolate() {
      mouseCurrentRef.current.x += (mouseTargetRef.current.x - mouseCurrentRef.current.x) * 0.05;
      mouseCurrentRef.current.y += (mouseTargetRef.current.y - mouseCurrentRef.current.y) * 0.05;
      setMouseOffset({ ...mouseCurrentRef.current });
      raf = requestAnimationFrame(interpolate);
    }
    raf = requestAnimationFrame(interpolate);
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleCreated = useCallback(
    (state: { gl: { setClearColor: (color: string | number) => void } }) => {
      state.gl.setClearColor("#030712");
    },
    [],
  );

  return (
    <div className={`absolute inset-0 ${className ?? ""}`} aria-hidden="true">
      <Canvas
        camera={{
          position: CAMERA_CONFIG.basePosition,
          fov: 60,
          near: 0.1,
          far: 200,
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
          <SceneContents mouseOffset={mouseOffset} opacity={1 - entranceProgress} />
          <CameraRig mouseOffset={mouseOffset} entranceProgress={entranceProgress} />
          {!reducedMotion && <AdaptiveDpr pixelated />}
          {!reducedMotion && <AdaptiveEvents />}
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
