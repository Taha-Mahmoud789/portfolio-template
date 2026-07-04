/**
 * SolarPlanet — Planet with Premium Visual Quality
 *
 * Each planet represents an orbit category:
 * - Projects: Blue, largest, with Saturn-like ring
 * - Code: Cyan, medium
 * - Creative: Purple, artistic
 * - Future: Gold, evolving
 *
 * Improvements: stronger Fresnel, atmosphere shell, better materials, planet-specific details.
 */

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

// ============================================================================
// Fresnel Material — atmospheric rim glow
// ============================================================================

const FRESNEL_VERTEX = `
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;

  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const FRESNEL_FRAGMENT = `
  uniform vec3 uRimColor;
  uniform vec3 uFacingColor;
  uniform float uFresnelBias;
  uniform float uFresnelScale;
  uniform float uFresnelPower;

  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;

  void main() {
    vec3 viewDir = normalize(vWorldPosition - cameraPosition);
    float fresnel = uFresnelBias + uFresnelScale * pow(1.0 + dot(viewDir, vWorldNormal), uFresnelPower);
    vec3 color = mix(uFacingColor, uRimColor, fresnel);
    gl_FragColor = vec4(color, fresnel * 0.9);
  }
`;

// ============================================================================
// Planet Colors — premium palette
// ============================================================================

const PLANET_COLORS: Record<
  string,
  { body: number; emissive: number; rim: number; glow: number; atmosphere: number }
> = {
  projects: {
    body: 0x2563eb,
    emissive: 0x3b82f6,
    rim: 0x93c5fd,
    glow: 0x60a5fa,
    atmosphere: 0x3b82f6,
  },
  technology: {
    body: 0x0891b2,
    emissive: 0x06b6d4,
    rim: 0x67e8f9,
    glow: 0x22d3ee,
    atmosphere: 0x06b6d4,
  },
  creative: {
    body: 0x9333ea,
    emissive: 0xa855f7,
    rim: 0xd8b4fe,
    glow: 0xc084fc,
    atmosphere: 0xa855f7,
  },
  future: {
    body: 0xd97706,
    emissive: 0xf59e0b,
    rim: 0xfde68a,
    glow: 0xfbbf24,
    atmosphere: 0xf59e0b,
  },
};

const DEFAULT_COLORS = {
  body: 0xc9a96e,
  emissive: 0xc9a96e,
  rim: 0xf5f0e8,
  glow: 0xfde68a,
  atmosphere: 0xc9a96e,
};

const PLANET_SIZES: Record<string, number> = {
  projects: 1.0,
  technology: 0.85,
  creative: 0.75,
  future: 0.65,
};

// ============================================================================
// Moon — orbiting project preview
// ============================================================================

interface MoonProps {
  readonly index: number;
  readonly total: number;
  readonly distance: number;
  readonly label: string;
  readonly color: number;
}

function Moon({ index, total, distance, label, color }: MoonProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const startAngle = useMemo(() => (index / total) * Math.PI * 2, [index, total]);
  const speed = useMemo(() => 0.3 + Math.random() * 0.2, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y = t * speed;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.5;
    }
  });

  const moonGeo = useMemo(() => new THREE.IcosahedronGeometry(0.2, 3), []);

  const moonMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.5,
        metalness: 0.6,
        roughness: 0.2,
      }),
    [color],
  );

  return (
    <group ref={groupRef}>
      <group position={[Math.cos(startAngle) * distance, 0, Math.sin(startAngle) * distance]}>
        <mesh ref={meshRef} geometry={moonGeo} material={moonMat} />
        {/* Moon glow */}
        <mesh scale={1.8}>
          <sphereGeometry args={[0.18, 8, 8]} />
          <meshBasicMaterial color={color} transparent opacity={0.15} depthWrite={false} />
        </mesh>
        <Html position={[0, 0.3, 0]} center style={{ pointerEvents: "none", userSelect: "none" }}>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "8px",
              letterSpacing: "0.1em",
              color: "rgba(245, 240, 232, 0.5)",
              whiteSpace: "nowrap",
              textShadow: "0 0 8px rgba(0, 0, 0, 0.8)",
            }}
          >
            {label}
          </span>
        </Html>
      </group>
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
  moons = [],
  onSelect,
  onHover,
  children,
}: SolarPlanetProps) {
  const orbitRef = useRef<THREE.Group>(null);
  const planetRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);

  const colors = PLANET_COLORS[orbitId] ?? DEFAULT_COLORS;
  const size = PLANET_SIZES[orbitId] ?? 0.5;

  // Planet geometry — IcosahedronGeometry like bobbyroe
  const planetGeo = useMemo(() => new THREE.IcosahedronGeometry(1, 6), []);

  const planetMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: colors.body,
        emissive: colors.emissive,
        emissiveIntensity: 0.6,
        metalness: 0.6,
        roughness: 0.25,
      }),
    [colors.body, colors.emissive],
  );

  // Fresnel rim — stronger, more visible
  const rimGeo = useMemo(() => new THREE.IcosahedronGeometry(1.02, 6), []);

  const rimMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: FRESNEL_VERTEX,
        fragmentShader: FRESNEL_FRAGMENT,
        uniforms: {
          uRimColor: { value: new THREE.Color(colors.rim) },
          uFacingColor: { value: new THREE.Color(0x000000) },
          uFresnelBias: { value: 0.1 },
          uFresnelScale: { value: 2.5 },
          uFresnelPower: { value: 3.0 },
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.BackSide,
      }),
    [colors.rim],
  );

  // Atmosphere shell — slightly larger, very faint
  const atmosphereGeo = useMemo(() => new THREE.IcosahedronGeometry(1.15, 5), []);

  const atmosphereMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: FRESNEL_VERTEX,
        fragmentShader: FRESNEL_FRAGMENT,
        uniforms: {
          uRimColor: { value: new THREE.Color(colors.atmosphere) },
          uFacingColor: { value: new THREE.Color(0x000000) },
          uFresnelBias: { value: 0.0 },
          uFresnelScale: { value: 1.5 },
          uFresnelPower: { value: 5.0 },
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.BackSide,
      }),
    [colors.atmosphere],
  );

  // Orbit ring geometry — using torus for reliable rendering
  const orbitRingGeo = useMemo(() => new THREE.TorusGeometry(distance, 0.008, 8, 128), [distance]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (orbitRef.current) {
      orbitRef.current.rotation.y = t * speed;
    }

    if (planetRef.current) {
      planetRef.current.rotation.y = t * 0.15;
      const s = isHovered ? size * 1.12 : isSelected ? size * 1.2 : size;
      planetRef.current.scale.lerp(new THREE.Vector3(s, s, s), 0.06);
    }

    if (glowRef.current) {
      const glowScale = isSelected ? 2.2 : isHovered ? 1.6 : 0;
      glowRef.current.scale.lerp(new THREE.Vector3(glowScale, glowScale, glowScale), 0.05);
    }

    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y = t * 0.05;
    }
  });

  const position = useMemo(
    () => [Math.cos(angle) * distance, 0, Math.sin(angle) * distance] as [number, number, number],
    [angle, distance],
  );

  return (
    <group>
      {/* Orbit ring — torus for reliable rendering */}
      <mesh geometry={orbitRingGeo} rotation={[Math.PI * 0.5, 0, 0]}>
        <meshBasicMaterial color={0xc9a96e} transparent opacity={0.08} />
      </mesh>

      {/* Orbit group — rotates */}
      <group ref={orbitRef} rotation={[tilt, 0, 0]}>
        <group position={position}>
          {/* Atmosphere shell — outermost layer */}
          <mesh
            ref={atmosphereRef}
            geometry={atmosphereGeo}
            material={atmosphereMat}
            scale={size}
          />

          {/* Planet body */}
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

          {/* Fresnel rim */}
          <mesh geometry={rimGeo} material={rimMat} scale={size} />

          {/* Selection glow — larger, stronger */}
          <mesh ref={glowRef} scale={0}>
            <sphereGeometry args={[size * 1.3, 16, 16]} />
            <meshBasicMaterial color={colors.glow} transparent opacity={0.12} depthWrite={false} />
          </mesh>

          {/* Planet ring for Projects orbit (Saturn-like) */}
          {orbitId === "projects" && (
            <mesh rotation={[Math.PI * 0.5, 0, 0]}>
              <torusGeometry args={[size * 1.5, 0.025, 8, 64]} />
              <meshBasicMaterial color={colors.rim} transparent opacity={0.2} />
            </mesh>
          )}

          {/* Moons */}
          {moons.map((moon, i) => (
            <Moon
              key={moon.label}
              index={i}
              total={moons.length}
              distance={size + 1.2 + i * 0.5}
              label={moon.label}
              color={moon.color}
            />
          ))}

          {/* Children (additional content) */}
          {children}
        </group>
      </group>
    </group>
  );
}
