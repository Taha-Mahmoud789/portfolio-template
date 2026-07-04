/**
 * LightField — Subtle Background Light Points
 *
 * Very faint, distant light sources that create depth.
 * Not stars. Not particles. Abstract luminance.
 * Like distant city lights seen through atmosphere.
 */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { ShaderMaterial } from "three";
import { useReducedMotion } from "../hooks";

const COUNT = 25;

const VERTEX = `
  attribute float aSize;
  attribute float aOpacity;
  attribute float aPhase;

  uniform float uTime;
  uniform float uPixelRatio;

  varying float vOpacity;

  void main() {
    vec3 pos = position;

    // Ultra-slow drift
    float t = uTime * 0.003;
    pos.x += sin(aPhase + t) * 0.05;
    pos.y += cos(aPhase * 0.6 + t * 0.7) * 0.03;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

    // Gentle breathing
    float pulse = sin(uTime * 0.15 + aPhase) * 0.15 + 1.0;

    vOpacity = aOpacity;

    gl_PointSize = max(aSize * pulse * uPixelRatio * (200.0 / -mvPosition.z), 0.5);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const FRAGMENT = `
  varying float vOpacity;

  void main() {
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);

    // Very soft glow — almost invisible
    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
    alpha *= alpha * alpha; // cubic falloff for softness
    alpha *= vOpacity;

    // Warm white — like distant ambient light
    vec3 color = vec3(0.85, 0.87, 0.92);

    gl_FragColor = vec4(color, alpha);
  }
`;

export function LightField() {
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
      const radius = 15 + Math.random() * 25;

      pos[i * 3] = Math.sin(phi) * Math.cos(theta) * radius;
      pos[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * radius;
      pos[i * 3 + 2] = Math.cos(phi) * radius;

      sz[i] = 1.5 + Math.random() * 3.0;
      op[i] = 0.03 + Math.random() * 0.06;
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
