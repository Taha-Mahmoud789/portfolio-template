/**
 * AtmosphericFog — Soft Depth Haze
 *
 * Layered transparent planes that create depth separation.
 * Not nebula gas. Not smoke. Just atmospheric perspective.
 * Like looking through layers of tinted glass.
 */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { ShaderMaterial } from "three";
import { useReducedMotion } from "../hooks";

interface FogLayerProps {
  readonly position: [number, number, number];
  readonly scale: number;
  readonly color: string;
  readonly opacity: number;
  readonly speed: number;
  readonly index: number;
}

const VERTEX = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT = `
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uIndex;

  varying vec2 vUv;

  // Simple noise
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  void main() {
    vec2 center = vUv - vec2(0.5);
    float dist = length(center);

    // Radial falloff — soft edges
    float falloff = 1.0 - smoothstep(0.0, 0.5, dist);
    falloff *= falloff;

    // Subtle noise texture
    float n = noise(vUv * 3.0 + uTime * 0.01 + uIndex * 5.0) * 0.3 + 0.7;

    float alpha = falloff * n * uOpacity;

    gl_FragColor = vec4(uColor, alpha);
  }
`;

function FogLayer({ position, scale, color, opacity, index }: FogLayerProps) {
  const materialRef = useRef<ShaderMaterial>(null);
  const reducedMotion = useReducedMotion();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: opacity },
      uIndex: { value: index },
    }),
    [color, opacity, index],
  );

  useFrame((state) => {
    if (!reducedMotion) {
      const u = materialRef.current?.uniforms.uTime;
      if (u) u.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh position={position} scale={scale}>
      <planeGeometry args={[6, 6]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={2}
      />
    </mesh>
  );
}

const FOG_LAYERS = [
  {
    position: [-8, 3, -15] as [number, number, number],
    scale: 12,
    color: "#1e1b4b",
    opacity: 0.04,
    speed: 0.02,
  },
  {
    position: [10, -2, -20] as [number, number, number],
    scale: 14,
    color: "#0a0f1e",
    opacity: 0.05,
    speed: 0.015,
  },
  {
    position: [-5, -5, -25] as [number, number, number],
    scale: 16,
    color: "#312e81",
    opacity: 0.03,
    speed: 0.01,
  },
  {
    position: [6, 6, -30] as [number, number, number],
    scale: 18,
    color: "#1e1b4b",
    opacity: 0.025,
    speed: 0.008,
  },
] as const;

export function AtmosphericFog() {
  return (
    <group>
      {FOG_LAYERS.map((layer, i) => (
        <FogLayer
          key={`fog-${String(i)}`}
          position={layer.position}
          scale={layer.scale}
          color={layer.color}
          opacity={layer.opacity}
          speed={layer.speed}
          index={i}
        />
      ))}
    </group>
  );
}
