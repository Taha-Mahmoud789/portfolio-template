/**
 * SolarPlanet — Premium Physical Materials
 *
 * Each planet represents a real project with glass/energy aesthetic:
 * - Over Benefits: Deep blue
 * - MTS MED: Medical red
 * - El-Hady Law Firm: Royal purple
 *
 * Uses meshPhysicalMaterial for clearcoat, transmission, premium feel.
 */

import React, { useRef, useMemo, useEffect, Suspense } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { planetMeshRegistry } from "./SpaceCarouselScene";

// ============================================================================
// Deep Space Palette — desaturated, cinematic, premium
// ============================================================================

const PLANET_COLORS: Record<
  string,
  {
    body: number;
    emissive: number;
    rim: number;
    clearcoat: number;
    atmosphere: number;
  }
> = {
  "project-over-benefits": {
    body: 0x1a3a5c,
    emissive: 0x1e4d7a,
    rim: 0x4a7fa5,
    clearcoat: 0x2a5f8a,
    atmosphere: 0x1a3a5c,
  },
  "project-mts-med": {
    body: 0x5c1a1a,
    emissive: 0x7a2525,
    rim: 0xa54a4a,
    clearcoat: 0x8a3535,
    atmosphere: 0x5c1a1a,
  },
  "project-el-hady-law": {
    body: 0x3d1a5c,
    emissive: 0x55257a,
    rim: 0x8a4aa5,
    clearcoat: 0x70358a,
    atmosphere: 0x3d1a5c,
  },
};

const DEFAULT_COLORS = {
  body: 0x3a3530,
  emissive: 0x4a4540,
  rim: 0x8a8070,
  clearcoat: 0x5a5550,
  atmosphere: 0x3a3530,
};

// ============================================================================
// Planet Sizes — 1.0 to 1.4 range
// ============================================================================

const PLANET_SIZES: Record<string, number> = {
  "project-over-benefits": 1.3,
  "project-mts-med": 1.2,
  "project-el-hady-law": 1.1,
};

const PLANET_NAMES: Record<string, string> = {
  "project-over-benefits": "Over Benefits",
  "project-mts-med": "MTS MED",
  "project-el-hady-law": "El-Hady Law Firm",
};

// ============================================================================
// Tech Satellite System — GLB models with capsule fallback, orbiting planets
// ============================================================================

interface TechSatelliteData {
  readonly label: string;
  readonly color: string;
  readonly radiusX: number;
  readonly radiusZ: number;
  readonly tiltHeight: number;
  readonly speed: number;
  readonly offset: number;
}

interface TechSatelliteSystemProps {
  readonly isVisible: boolean;
  readonly satellites: readonly TechSatelliteData[];
}

const TECH_GLB_FALLBACK = "/models/space/satellite.glb";

// Preload fallback GLB
useGLTF.preload(TECH_GLB_FALLBACK);

function TechGlbScene({ path, colorHex }: { readonly path: string; readonly colorHex: number }) {
  const { scene } = useGLTF(path);

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);

    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.emissive = new THREE.Color(colorHex);
          mat.emissiveIntensity = 0.2;
          mat.needsUpdate = true;
        }
      }
    });

    const box = new THREE.Box3().setFromObject(clone);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 1.2 / maxDim;

    clone.scale.setScalar(scale);
    clone.position.sub(center.multiplyScalar(scale));

    return clone;
  }, [scene, colorHex]);

  return <primitive object={clonedScene} />;
}

function TechSatellite({
  data,
  index,
  isVisible,
}: {
  readonly data: TechSatelliteData;
  readonly index: number;
  readonly isVisible: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  const revealDelay = useMemo(() => index * 0.15, [index]);
  const revealStartRef = useRef<number | null>(null);
  const scaleRef = useRef(0);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const group = groupRef.current;
    if (!group) return;

    if (isVisible && revealStartRef.current === null) {
      revealStartRef.current = t;
    } else if (!isVisible) {
      revealStartRef.current = null;
      scaleRef.current = 0;
    }

    if (isVisible && revealStartRef.current !== null) {
      const elapsed = t - revealStartRef.current - revealDelay;
      if (elapsed > 0) {
        const progress = Math.min(elapsed / 0.5, 1);
        scaleRef.current = 1 - Math.pow(1 - progress, 3);
      }
    }

    const angle = t * data.speed + data.offset;
    group.position.set(
      Math.cos(angle) * data.radiusX,
      Math.sin(angle * 0.5) * data.tiltHeight,
      Math.sin(angle) * data.radiusZ,
    );
    group.scale.setScalar(scaleRef.current);
    group.rotation.y = t * 0.3;
    group.rotation.x = Math.sin(t * 0.2) * 0.1;
  });

  const colorHex = useMemo(() => parseInt(data.color.replace("#", ""), 16), [data.color]);

  return (
    <group ref={groupRef}>
      <Suspense
        fallback={
          <mesh>
            <capsuleGeometry args={[0.18, 0.35, 8, 16]} />
            <meshPhysicalMaterial
              color={colorHex}
              emissive={colorHex}
              emissiveIntensity={0.2}
              metalness={0.3}
              roughness={0.1}
              clearcoat={1}
              clearcoatRoughness={0.05}
              transparent
              opacity={0.85}
            />
          </mesh>
        }
      >
        <TechGlbScene path={TECH_GLB_FALLBACK} colorHex={colorHex} />
      </Suspense>
    </group>
  );
}

function TechSatelliteSystem({ isVisible, satellites }: TechSatelliteSystemProps) {
  if (!isVisible) return null;

  return (
    <group>
      {satellites.map((sat, i) => (
        <TechSatellite key={sat.label} data={sat} index={i} isVisible={isVisible} />
      ))}
    </group>
  );
}

// ============================================================================
// SolarPlanet
// ============================================================================

interface SolarPlanetProps {
  readonly orbitId: string;
  readonly angle: number;
  readonly distance: number;
  readonly tilt: number;
  readonly speed: number;
  readonly isSelected: boolean;
  readonly isHovered: boolean;
  readonly isFocused?: boolean;
  readonly moons?: readonly { label: string; color: number }[];
  readonly onSelect: (id: string) => void;
  readonly onHover: (id: string | null) => void;
  readonly children?: React.ReactNode;
}

export function SolarPlanet({
  orbitId,
  angle,
  distance,
  tilt,
  speed,
  isSelected,
  isHovered,
  isFocused = false,
  moons = [],
  onSelect,
  onHover,
  children,
}: SolarPlanetProps) {
  const orbitRef = useRef<THREE.Group>(null);
  const planetRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const scaleRef = useRef(new THREE.Vector3(1, 1, 1));

  const colors = PLANET_COLORS[orbitId] ?? DEFAULT_COLORS;
  const size = PLANET_SIZES[orbitId] ?? 1.0;

  // Planet geometry
  const planetGeo = useMemo(() => new THREE.IcosahedronGeometry(1, 6), []);

  // Premium physical material — glass/energy feel
  const planetMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: colors.body,
        emissive: colors.emissive,
        emissiveIntensity: isFocused ? 0.6 : isHovered ? 0.5 : isSelected ? 0.4 : 0.2,
        metalness: 0.4,
        roughness: 0.15,
        clearcoat: 0.8,
        clearcoatRoughness: 0.1,
        transmission: 0.15,
        thickness: 0.5,
        ior: 1.5,
      }),
    [colors.body, colors.emissive, isHovered, isSelected, isFocused],
  );

  // Atmosphere shell — subtle fresnel glow
  const atmosphereGeo = useMemo(() => new THREE.IcosahedronGeometry(1.12, 5), []);

  const atmosphereMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: colors.atmosphere,
        transparent: true,
        opacity: isHovered ? 0.12 : 0.06,
        side: THREE.BackSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [colors.atmosphere, isHovered],
  );

  // Orbit ring — thin, subtle
  const orbitRingGeo = useMemo(() => new THREE.TorusGeometry(distance, 0.015, 8, 128), [distance]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (orbitRef.current) {
      orbitRef.current.rotation.y = t * speed;
    }

    if (planetRef.current) {
      planetRef.current.rotation.y = t * 0.1;
      const s = isHovered ? size * 1.08 : isSelected ? size * 1.12 : size;
      scaleRef.current.set(s, s, s);
      planetRef.current.scale.lerp(scaleRef.current, 0.06);
    }

    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y = t * 0.03;
    }
  });

  // Register planet mesh for camera tracking — camera reads live world position via getWorldPosition()
  useEffect(() => {
    if (planetRef.current) {
      planetMeshRegistry[orbitId] = planetRef.current;
    }
    return () => {
      planetMeshRegistry[orbitId] = null;
    };
  }, [orbitId]);

  const position = useMemo(
    () => [Math.cos(angle) * distance, 0, Math.sin(angle) * distance] as [number, number, number],
    [angle, distance],
  );

  return (
    <group>
      {/* Orbit ring — hair-thin */}
      <mesh geometry={orbitRingGeo} rotation={[Math.PI * 0.5, 0, 0]}>
        <meshBasicMaterial color={0x4a4540} transparent opacity={0.12} />
      </mesh>

      {/* Orbit group — rotates */}
      <group ref={orbitRef} rotation={[tilt, 0, 0]}>
        <group position={position}>
          {/* Atmosphere shell — subtle */}
          <mesh
            ref={atmosphereRef}
            geometry={atmosphereGeo}
            material={atmosphereMat}
            scale={size}
          />

          {/* Planet body — physical material */}
          <mesh
            ref={planetRef}
            geometry={planetGeo}
            material={planetMat}
            scale={size}
            onPointerOver={(e) => {
              e.stopPropagation();
              onHover(orbitId);
            }}
            onPointerOut={() => onHover(null)}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(orbitId);
            }}
          />

          {/* Selection indicator — thin ring */}
          {isSelected && (
            <mesh rotation={[Math.PI * 0.5, 0, 0]}>
              <torusGeometry args={[size * 1.6, 0.008, 16, 64]} />
              <meshBasicMaterial color={colors.rim} transparent opacity={0.25} />
            </mesh>
          )}

          {/* Planet label — always visible, minimal */}
          <Html
            position={[0, size + 1.2, 0]}
            center
            style={{ pointerEvents: "none", userSelect: "none" }}
          >
            <div style={{ textAlign: "center" }}>
              <span
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "10px",
                  fontWeight: 300,
                  letterSpacing: "0.1em",
                  color:
                    isHovered || isSelected
                      ? "rgba(232, 220, 200, 0.9)"
                      : "rgba(200, 190, 175, 0.5)",
                  whiteSpace: "nowrap",
                  textShadow: "0 0 12px rgba(0, 0, 0, 0.9)",
                  transition: "color 0.3s ease",
                }}
              >
                {PLANET_NAMES[orbitId] ?? orbitId}
              </span>
            </div>
          </Html>

          {/* Tech satellites — 3D glass capsules orbiting the planet */}
          <TechSatelliteSystem
            isVisible={isSelected || isFocused}
            satellites={moons.map((moon, i) => ({
              label: moon.label,
              color: `#${moon.color.toString(16).padStart(6, "0")}`,
              radiusX: size + 1.8 + i * 0.6,
              radiusZ: size + 1.8 + i * 0.6,
              tiltHeight: 0.3 + (i % 3) * 0.2,
              speed: 0.3 + (i % 4) * 0.1,
              offset: (i / moons.length) * Math.PI * 2,
            }))}
          />

          {/* Children */}
          {children}
        </group>
      </group>
    </group>
  );
}
