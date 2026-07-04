/**
 * SpaceCarouselScene — Exact match to bobbyroe/solar-system
 *
 * Sun: IcosahedronGeometry(1,6) emissive 0xff0000 + rim 0xffff99
 * Planets: IcosahedronGeometry(1,6) with texture-like colors + rim
 * Camera: cos(t*0.75)*5 orbit
 * Directional: 0x0099ff
 * Starfield: 500 pts hue 0.6 sat 0.2
 * Elliptic lines: 20 rings + 40 radial
 */

import { Suspense, useCallback, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdaptiveDpr, AdaptiveEvents, Preload, Line } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { OBJECTS, CONNECTIONS } from "../data/space.config";
import type { SpaceObject } from "../data/types";

// ============================================================================
// Sun — exact getSun.js
// ============================================================================

function Sun() {
  const groupRef = useRef<THREE.Group>(null);
  const coronaRef = useRef<THREE.Mesh>(null);
  const coronaOrigRef = useRef<Float32Array | null>(null);

  const sunGeo = useMemo(() => new THREE.IcosahedronGeometry(1, 6), []);

  const sunMat = useMemo(() => new THREE.MeshStandardMaterial({ emissive: 0xff0000 }), []);

  const rimMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: 0xffff99,
        transparent: true,
        opacity: 0.35,
        depthWrite: false,
      }),
    [],
  );

  const coronaGeo = useMemo(() => new THREE.IcosahedronGeometry(0.9, 6), []);

  const coronaMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: 0xffff99,
        side: THREE.BackSide,
      }),
    [],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime * 0.3;
    if (groupRef.current) groupRef.current.rotation.y = t;

    if (coronaRef.current) {
      const posAttr = coronaRef.current.geometry.attributes.position;
      if (!posAttr) return;
      coronaOrigRef.current ??= new Float32Array(posAttr.array as Float32Array);
      const orig = coronaOrigRef.current;
      for (let i = 0; i < posAttr.count; i++) {
        const ox = orig[i * 3] ?? 0;
        const oy = orig[i * 3 + 1] ?? 0;
        const oz = orig[i * 3 + 2] ?? 0;
        const len = Math.sqrt(ox * ox + oy * oy + oz * oz) || 1;
        const nx = ox / len;
        const ny = oy / len;
        const nz = oz / len;
        const ns =
          Math.sin(nx * 12.9898 + t) *
          Math.cos(ny * 78.233 + t) *
          Math.sin(nz * 37.719 + t * 0.5) *
          0.4;
        const newLen = 0.9 + ns * 0.3;
        (posAttr as THREE.BufferAttribute).setXYZ(i, nx * newLen, ny * newLen, nz * newLen);
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh geometry={sunGeo} material={sunMat} />
      <mesh geometry={sunGeo} material={rimMat} scale={1.01} />
      <mesh ref={coronaRef} geometry={coronaGeo} material={coronaMat} />
      <pointLight color={0xffff99} intensity={10} distance={30} />
    </group>
  );
}

// ============================================================================
// Planet — exact getPlanet.js
// ============================================================================

function Planet({
  object,
  index,
  total,
  isSelected,
  onSelect,
  onHover,
}: {
  readonly object: SpaceObject;
  readonly index: number;
  readonly total: number;
  readonly isSelected: boolean;
  readonly onSelect: (id: string) => void;
  readonly onHover: (id: string | null) => void;
}) {
  const orbitRef = useRef<THREE.Group>(null);
  const planetRef = useRef<THREE.Mesh>(null);

  const geo = useMemo(() => new THREE.IcosahedronGeometry(1, 6), []);

  // Like repo: planet colors based on type — warm tones
  const planetColor = useMemo(() => {
    switch (object.type) {
      case "project":
        return 0xdeb887; // warm sand
      case "technology":
        return 0x8fbc8f; // muted green
      case "creative":
        return 0xcd853f; // peru
      case "future":
        return 0x778899; // slate
      default:
        return 0xdeb887;
    }
  }, [object.type]);

  // Like repo: size varies
  const size = useMemo(() => {
    switch (object.type) {
      case "project":
        return 0.25;
      case "technology":
        return 0.18;
      case "creative":
        return 0.16;
      case "future":
        return 0.14;
      default:
        return 0.18;
    }
  }, [object.type]);

  // Like repo: random start angle
  const startAngle = useMemo(() => (index / total) * Math.PI * 2 + index * 0.7, [index, total]);

  // Like repo: orbit distance
  const distance = useMemo(() => 2.5 + index * 0.4, [index]);

  // Like repo: random orbit rate
  const rate = useMemo(() => Math.random() * 0.8 - 0.8, []);

  // Rim — like repo getFresnelMat
  const rimMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.2,
        depthWrite: false,
      }),
    [],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Like repo: orbitGroup.rotation.y = t * rate
    if (orbitRef.current) {
      orbitRef.current.rotation.y = t * rate;
    }

    if (planetRef.current) {
      planetRef.current.scale.setScalar(size);
      planetRef.current.rotation.y = t * 0.3;
    }
  });

  return (
    <group ref={orbitRef}>
      <group position={[Math.cos(startAngle) * distance, 0, Math.sin(startAngle) * distance]}>
        {/* Planet body */}
        <mesh
          ref={planetRef}
          geometry={geo}
          onPointerOver={(e) => {
            e.stopPropagation();
            onHover(object.id);
          }}
          onPointerOut={() => onHover(null)}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(object.id);
          }}
        >
          <meshStandardMaterial
            color={planetColor}
            emissive={isSelected ? 0xc9a96e : 0x000000}
            emissiveIntensity={isSelected ? 0.4 : 0}
          />
        </mesh>

        {/* Rim — 1.01x like repo */}
        <mesh geometry={geo} material={rimMat} scale={1.01} />
      </group>
    </group>
  );
}

// ============================================================================
// Elliptic Lines — exact getElipticLines.js
// ============================================================================

function EllipticLines() {
  const rings = useMemo(() => {
    const result = [];
    for (let i = 0; i < 20; i++) {
      const gap = 0.075 + Math.random() * 0.005;
      const hue = 0.25 - (i / 20) * 0.27;
      const lightness = 0.5 - (i / 20) * 0.5;
      result.push({ radius: 1.1 + i * gap, hue, lightness, key: i });
    }
    return result;
  }, []);

  const radialLines = useMemo(() => {
    const lines = [];
    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2;
      const minRadius = 1.1 + Math.random() * 0.1;
      const points: THREE.Vector3[] = [];
      for (let j = 0; j < 10; j++) {
        const r = minRadius + j / 8;
        points.push(new THREE.Vector3(Math.cos(angle) * r, 0, Math.sin(angle) * r));
      }
      const hue = 0.25 - (i / 40) * 0.27;
      const col = new THREE.Color().setHSL(hue, 1.0, 0.5);
      lines.push({ points, color: col, key: i });
    }
    return lines;
  }, []);

  return (
    <group>
      {/* Orbit rings — rotated 90° like repo */}
      <group rotation={[Math.PI * 0.5, 0, 0]}>
        {rings.map((ring) => {
          const points: THREE.Vector3[] = [];
          for (let i = 0; i <= 128; i++) {
            const a = (i / 128) * Math.PI * 2;
            points.push(new THREE.Vector3(Math.cos(a) * ring.radius, Math.sin(a) * ring.radius, 0));
          }
          const color = new THREE.Color().setHSL(ring.hue, 1, ring.lightness);
          return (
            <Line
              key={ring.key}
              points={points}
              color={color}
              lineWidth={0.6}
              transparent
              opacity={0.25}
            />
          );
        })}
      </group>

      {/* Radial lines */}
      {radialLines.map((line) => (
        <Line
          key={`r-${String(line.key)}`}
          points={line.points}
          color={line.color}
          lineWidth={0.4}
          transparent
          opacity={0.12}
        />
      ))}
    </group>
  );
}

// ============================================================================
// Starfield — exact getStarfield.js
// ============================================================================

function Starfield() {
  const geo = useMemo(() => {
    const numStars = 500;
    const verts: number[] = [];
    const cols: number[] = [];

    for (let i = 0; i < numStars; i++) {
      const radius = Math.random() * 25 + 25;
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      verts.push(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi),
      );
      const col = new THREE.Color().setHSL(0.6, 0.2, Math.random());
      cols.push(col.r, col.g, col.b);
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
    g.setAttribute("color", new THREE.Float32BufferAttribute(cols, 3));
    return g;
  }, []);

  return (
    <points geometry={geo}>
      <pointsMaterial size={0.35} vertexColors sizeAttenuation depthWrite={false} />
    </points>
  );
}

// ============================================================================
// Connection Lines
// ============================================================================

function ConnectionLines() {
  const lines = useMemo(() => {
    // Fixed positions for connections — objects orbit independently so we
    // just draw static connection hints near the orbit area
    return CONNECTIONS.map((conn) => {
      const angle1 = (OBJECTS.findIndex((o) => o.id === conn.from) / OBJECTS.length) * Math.PI * 2;
      const angle2 = (OBJECTS.findIndex((o) => o.id === conn.to) / OBJECTS.length) * Math.PI * 2;
      const r1 = 2.5 + OBJECTS.findIndex((o) => o.id === conn.from) * 0.4;
      const r2 = 2.5 + OBJECTS.findIndex((o) => o.id === conn.to) * 0.4;
      return {
        key: `${conn.from}-${conn.to}`,
        points: [
          new THREE.Vector3(Math.cos(angle1) * r1, 0, Math.sin(angle1) * r1),
          new THREE.Vector3(Math.cos(angle2) * r2, 0, Math.sin(angle2) * r2),
        ],
      };
    });
  }, []);

  return (
    <group>
      {lines.map((line) => (
        <Line
          key={line.key}
          points={line.points}
          color={0xc9a96e}
          lineWidth={0.3}
          transparent
          opacity={0.06}
        />
      ))}
    </group>
  );
}

// ============================================================================
// Scene
// ============================================================================

function SceneContents({
  selectedId,
  onSelect,
  onHover,
}: {
  readonly selectedId: string | null;
  readonly onSelect: (id: string) => void;
  readonly onHover: (id: string | null) => void;
}) {
  return (
    <group>
      {/* Directional — 0x0099ff like repo */}
      <directionalLight position={[0, 1, 0]} intensity={1} color={0x0099ff} />

      <Sun />
      <EllipticLines />
      <Starfield />
      <ConnectionLines />

      {OBJECTS.map((obj, i) => (
        <Planet
          key={obj.id}
          object={obj}
          index={i}
          total={OBJECTS.length}
          isSelected={selectedId === obj.id}
          onSelect={onSelect}
          onHover={onHover}
        />
      ))}
    </group>
  );
}

// ============================================================================
// Camera — exact repo: cos(t*0.75)*5
// ============================================================================

function AnimatedCamera({ isDragging }: { readonly isDragging: boolean }) {
  const { camera } = useThree();
  const angleRef = useRef(0);

  useFrame(() => {
    if (!isDragging) angleRef.current += 0.001;
    const t = angleRef.current;
    const d = 5;
    camera.position.x = Math.cos(t * 0.75) * d;
    camera.position.y = Math.cos(t * 0.75);
    camera.position.z = Math.sin(t * 0.75) * d;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// ============================================================================
// Postprocessing
// ============================================================================

function PostProcessing() {
  return (
    <EffectComposer>
      <Bloom intensity={0.8} luminanceThreshold={0.2} luminanceSmoothing={0.9} mipmapBlur />
      <Vignette offset={0.3} darkness={0.5} />
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
  const dragStartRef = useRef({ x: 0 });

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX };
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

  return (
    <div
      className={`absolute inset-0 ${className ?? ""}`}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
    >
      <Canvas
        camera={{
          position: [0, 2.5, 4],
          fov: 75,
          near: 0.1,
          far: 1000,
        }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          gl.setClearColor("#000000");
        }}
      >
        <Suspense fallback={null}>
          <SceneContents
            selectedId={selectedId}
            onSelect={handleSelect}
            onHover={() => undefined}
          />
          <AnimatedCamera isDragging={isDragging} />
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />
          <PostProcessing />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
