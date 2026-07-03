/**
 * Nebula — Volumetric Shader-Based Nebulae (Awwwards Grade)
 *
 * Multi-plane volumetric gas clouds with animated noise edges,
 * light scattering simulation, and organic drift.
 * Uses layered transparent planes for depth without raymarching cost.
 */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { ShaderMaterial, Group } from "three";
import { useReducedMotion } from "../hooks";

// ============================================================================
// Constants
// ============================================================================

const NEBULA_CONFIG = {
  planesPerCloud: 4,
  planeSpread: 1.5,
  driftScale: 0.0003,
  noiseSpeed: 0.08,
} as const;

// ============================================================================
// Types
// ============================================================================

interface NebulaCloudProps {
  readonly position: [number, number, number];
  readonly scale: number;
  readonly color1: string;
  readonly color2: string;
  readonly opacity: number;
  readonly driftSpeed: number;
}

// ============================================================================
// Nebula Vertex Shader
// ============================================================================

const NEBULA_VERTEX_SHADER = `
  varying vec2 vUv;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// ============================================================================
// Nebula Fragment Shader — animated noise + light scattering
// ============================================================================

const NEBULA_FRAGMENT_SHADER = `
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform float uOpacity;
  uniform float uPlaneIndex;

  varying vec2 vUv;
  varying vec3 vPosition;

  // Simplex noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vec2 center = vUv - vec2(0.5);
    float dist = length(center);

    // Animated noise — organic edge movement
    float timeOffset = uPlaneIndex * 0.5;
    float noise1 = snoise(vec3(vUv * 2.5, uTime * 0.06 + timeOffset));
    float noise2 = snoise(vec3(vUv * 4.0, uTime * 0.04 + timeOffset + 10.0));
    float combined = noise1 * 0.6 + noise2 * 0.4;
    combined = combined * 0.5 + 0.5;

    // Animated radial falloff — edges breathe
    float edgeNoise = snoise(vec3(center * 3.0, uTime * 0.03));
    float falloffRadius = 0.4 + edgeNoise * 0.08;
    float falloff = 1.0 - smoothstep(0.0, falloffRadius, dist);
    falloff *= falloff;

    // Light scattering — brighter at edges (backlit effect)
    float scattering = smoothstep(0.3, 0.5, dist) * (1.0 - smoothstep(0.5, 0.7, dist));
    scattering *= combined * 0.3;

    // Color gradient with scattering tint
    vec3 baseColor = mix(uColor1, uColor2, combined);
    vec3 scatterColor = baseColor * 1.4 + vec3(0.1, 0.05, 0.15);
    vec3 finalColor = mix(baseColor, scatterColor, scattering);

    // Final alpha
    float alpha = falloff * combined * uOpacity;
    alpha += scattering * falloff * uOpacity * 0.5;

    gl_FragColor = vec4(finalColor, alpha);
  }
`;

// ============================================================================
// Component — Single Nebula Layer (one plane)
// ============================================================================

function NebulaLayer({
  position,
  scale,
  color1,
  color2,
  opacity,
  planeIndex,
}: Omit<NebulaCloudProps, "driftSpeed"> & { readonly planeIndex: number }) {
  const materialRef = useRef<ShaderMaterial>(null);
  const reducedMotion = useReducedMotion();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor1: { value: color1 },
      uColor2: { value: color2 },
      uOpacity: { value: opacity },
      uPlaneIndex: { value: planeIndex },
    }),
    [color1, color2, opacity, planeIndex],
  );

  useFrame((state) => {
    if (materialRef.current && !reducedMotion) {
      const uTime = materialRef.current.uniforms.uTime;
      if (uTime) {
        uTime.value = state.clock.elapsedTime;
      }
    }
  });

  // Each plane slightly rotated for volumetric depth
  const rotation: [number, number, number] = [
    (Math.random() - 0.5) * 0.3,
    (Math.random() - 0.5) * 0.3,
    (Math.random() - 0.5) * 0.5,
  ];

  return (
    <mesh scale={scale} rotation={rotation} position={position}>
      <planeGeometry args={[4, 4, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={NEBULA_VERTEX_SHADER}
        fragmentShader={NEBULA_FRAGMENT_SHADER}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={2}
      />
    </mesh>
  );
}

// ============================================================================
// Component — Full Nebula Cloud (multi-plane volumetric)
// ============================================================================

function SingleNebulaCloud({
  position,
  scale,
  color1,
  color2,
  opacity,
  driftSpeed,
}: NebulaCloudProps) {
  const reducedMotion = useReducedMotion();
  const groupRef = useRef<Group>(null);

  // Generate stable random offsets for each plane
  const planeOffsets = useMemo(
    () =>
      Array.from({ length: NEBULA_CONFIG.planesPerCloud }, (_, idx) => ({
        x: (Math.random() - 0.5) * NEBULA_CONFIG.planeSpread,
        y: (Math.random() - 0.5) * NEBULA_CONFIG.planeSpread,
        z: (Math.random() - 0.5) * NEBULA_CONFIG.planeSpread * 0.5,
        scale: 0.8 + Math.random() * 0.4,
        opacity: opacity * (0.6 + Math.random() * 0.4),
        planeIndex: idx,
      })),
    [opacity],
  );

  useFrame((state) => {
    if (!groupRef.current || reducedMotion) return;
    const t = state.clock.elapsedTime;
    groupRef.current.position.x = position[0] + Math.sin(t * driftSpeed) * 0.3;
    groupRef.current.position.y = position[1] + Math.cos(t * driftSpeed * 0.7) * 0.15;
  });

  return (
    <group ref={groupRef} position={position}>
      {planeOffsets.map((offset, idx) => (
        <NebulaLayer
          key={`nebula-layer-${String(idx)}`}
          position={[offset.x, offset.y, offset.z]}
          scale={scale * offset.scale}
          color1={color1}
          color2={color2}
          opacity={offset.opacity}
          planeIndex={offset.planeIndex}
        />
      ))}
    </group>
  );
}

// ============================================================================
// Main Nebula — preset positions
// ============================================================================

const NEBULA_PRESETS: {
  position: [number, number, number];
  scale: number;
  color1: string;
  color2: string;
  opacity: number;
  driftSpeed: number;
}[] = [
  {
    position: [-10, 5, -18],
    scale: 7,
    color1: "#6366f1",
    color2: "#4338ca",
    opacity: 0.2,
    driftSpeed: 0.12,
  },
  {
    position: [12, -4, -22],
    scale: 9,
    color1: "#06b6d4",
    color2: "#0e7490",
    opacity: 0.15,
    driftSpeed: 0.08,
  },
  {
    position: [-6, -7, -28],
    scale: 11,
    color1: "#8b5cf6",
    color2: "#6d28d9",
    opacity: 0.1,
    driftSpeed: 0.06,
  },
  {
    position: [4, 8, -35],
    scale: 14,
    color1: "#4f46e5",
    color2: "#312e81",
    opacity: 0.07,
    driftSpeed: 0.04,
  },
];

export function NebulaCloud(): React.JSX.Element {
  return (
    <group>
      {NEBULA_PRESETS.map((preset, i) => (
        <SingleNebulaCloud key={`nebula-${String(i)}`} {...preset} />
      ))}
    </group>
  );
}
