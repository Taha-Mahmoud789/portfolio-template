/**
 * CosmicDust — Minimal Foreground Drift
 *
 * Few particles, extremely slow drift.
 * Creates subtle parallax depth.
 * NOT a particle system. NOT a screensaver.
 * Just a few specks of light floating in space.
 */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { ShaderMaterial } from "three";
import { useReducedMotion } from "../hooks";

const COUNT = 30;

const VERTEX = `
  attribute float aSize;
  attribute float aOpacity;
  attribute float aPhase;

  uniform float uTime;
  uniform float uPixelRatio;

  varying float vOpacity;

  void main() {
    vec3 pos = position;

    // Ultra-slow drift — barely moves
    float t = uTime * 0.01;
    pos.x += sin(aPhase + t) * 0.08;
    pos.y += cos(aPhase * 0.6 + t * 0.5) * 0.05;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

    // Subtle breathing
    float pulse = sin(uTime * 0.1 + aPhase) * 0.08 + 1.0;

    vOpacity = aOpacity;

    gl_PointSize = max(aSize * pulse * uPixelRatio * (140.0 / -mvPosition.z), 0.5);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const FRAGMENT = `
  uniform vec3 uColor;
  varying float vOpacity;

  void main() {
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);

    // Very soft glow — cubic falloff
    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
    alpha *= alpha * alpha;
    alpha *= vOpacity;

    gl_FragColor = vec4(uColor, alpha);
  }
`;

export function CosmicDust() {
  const materialRef = useRef<ShaderMaterial>(null);
  const reducedMotion = useReducedMotion();

  const buffers = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const sz = new Float32Array(COUNT);
    const op = new Float32Array(COUNT);
    const ph = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 3 + Math.random() * 12;

      pos[i * 3] = Math.sin(phi) * Math.cos(theta) * radius;
      pos[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * radius;
      pos[i * 3 + 2] = Math.cos(phi) * radius;

      // Few larger, rest tiny
      sz[i] = i < 5 ? 1.5 + Math.random() * 2.0 : 0.3 + Math.random() * 0.8;
      op[i] = 0.06 + Math.random() * 0.1;
      ph[i] = Math.random() * Math.PI * 2;
    }

    return { positions: pos, sizes: sz, opacities: op, phases: ph };
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: {
        value: typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1,
      },
      uColor: { value: new THREE.Color("#b8a990") },
    }),
    [],
  );

  useFrame((state) => {
    if (!reducedMotion) {
      const u = materialRef.current?.uniforms.uTime;
      if (u) u.value = state.clock.elapsedTime;
    }
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[buffers.positions, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[buffers.sizes, 1]} />
        <bufferAttribute attach="attributes-aOpacity" args={[buffers.opacities, 1]} />
        <bufferAttribute attach="attributes-aPhase" args={[buffers.phases, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={2}
      />
    </points>
  );
}
