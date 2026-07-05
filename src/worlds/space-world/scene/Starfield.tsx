/**
 * Starfield — Premium Deep Space Background
 *
 * Shader-based starfield with:
 * - Soft radial glow per star
 * - Size variety (near stars larger, far stars smaller)
 * - Subtle twinkle animation
 * - Warm white color palette
 */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { ShaderMaterial } from "three";

const STAR_COUNT = 300;

const VERTEX = `
  attribute float aSize;
  attribute float aPhase;
  attribute float aBrightness;

  uniform float uTime;
  uniform float uPixelRatio;

  varying float vBrightness;

  void main() {
    vec3 pos = position;

    // Subtle twinkle — different phase per star
    float twinkle = sin(uTime * 0.3 + aPhase * 6.28) * 0.15 + 1.0;

    vBrightness = aBrightness;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = max(aSize * twinkle * uPixelRatio * (200.0 / -mvPosition.z), 0.5);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const FRAGMENT = `
  varying float vBrightness;

  void main() {
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);

    // Soft radial glow — smooth falloff
    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
    alpha *= alpha; // softer cubic falloff
    alpha *= vBrightness;

    // Warm white — slight color variation
    vec3 color = mix(vec3(0.92, 0.89, 0.82), vec3(0.82, 0.85, 0.92), vBrightness);

    gl_FragColor = vec4(color, alpha);
  }
`;

export function Starfield() {
  const materialRef = useRef<ShaderMaterial>(null);

  const buffers = useMemo(() => {
    const pos = new Float32Array(STAR_COUNT * 3);
    const sz = new Float32Array(STAR_COUNT);
    const ph = new Float32Array(STAR_COUNT);
    const br = new Float32Array(STAR_COUNT);

    for (let i = 0; i < STAR_COUNT; i++) {
      const radius = Math.random() * 30 + 20;
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      // Size variety — some large, most small
      sz[i] = i < 30 ? 2.0 + Math.random() * 2.0 : 0.3 + Math.random() * 1.0;
      ph[i] = Math.random();
      br[i] = 0.3 + Math.random() * 0.7;
    }

    return { positions: pos, sizes: sz, phases: ph, brightnesses: br };
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: {
        value: typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1,
      },
    }),
    [],
  );

  useFrame((state) => {
    const u = materialRef.current?.uniforms.uTime;
    if (u) u.value = state.clock.elapsedTime;
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[buffers.positions, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[buffers.sizes, 1]} />
        <bufferAttribute attach="attributes-aPhase" args={[buffers.phases, 1]} />
        <bufferAttribute attach="attributes-aBrightness" args={[buffers.brightnesses, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
