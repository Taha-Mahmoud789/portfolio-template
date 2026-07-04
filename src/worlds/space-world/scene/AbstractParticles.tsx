/**
 * AbstractParticles — Elegant Luminous Points
 *
 * Few, slow, purposeful particles that create depth.
 * NOT a star field. NOT snow. NOT screensaver.
 * Abstract digital dust that feels like data floating in space.
 */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { ShaderMaterial } from "three";
import { useReducedMotion } from "../hooks";

const PARTICLE_COUNT = 40;

const VERTEX = `
  attribute float aSize;
  attribute float aOpacity;
  attribute float aPhase;
  attribute float aLayer;

  uniform float uTime;
  uniform float uPixelRatio;

  varying float vOpacity;
  varying float vLayer;

  void main() {
    vec3 pos = position;

    // Extremely slow drift — time-based, not frame-based
    float t = uTime * 0.008;
    pos.x += sin(aPhase + t) * 0.15;
    pos.y += cos(aPhase * 0.7 + t * 0.8) * 0.1;
    pos.z += sin(aPhase * 0.3 + t * 0.5) * 0.08;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

    // Subtle size pulsing — breathing
    float pulse = sin(uTime * 0.2 + aPhase) * 0.1 + 1.0;

    vOpacity = aOpacity;
    vLayer = aLayer;

    gl_PointSize = max(aSize * pulse * uPixelRatio * (150.0 / -mvPosition.z), 0.5);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const FRAGMENT = `
  varying float vOpacity;
  varying float vLayer;

  void main() {
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);

    // Soft radial glow — no hard edges
    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
    alpha *= alpha; // softer falloff
    alpha *= vOpacity;

    // Depth-based color temperature
    vec3 nearColor = vec3(0.81, 0.84, 0.92);   // warm white
    vec3 midColor = vec3(0.63, 0.66, 0.78);     // muted
    vec3 farColor = vec3(0.50, 0.53, 0.65);     // cool

    vec3 color = mix(nearColor, midColor, smoothstep(0.0, 0.5, vLayer));
    color = mix(color, farColor, smoothstep(0.5, 1.0, vLayer));

    gl_FragColor = vec4(color, alpha);
  }
`;

export function AbstractParticles() {
  const materialRef = useRef<ShaderMaterial>(null);
  const reducedMotion = useReducedMotion();

  const buffers = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const sz = new Float32Array(PARTICLE_COUNT);
    const op = new Float32Array(PARTICLE_COUNT);
    const ph = new Float32Array(PARTICLE_COUNT);
    const ly = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 4 + Math.random() * 16;

      pos[i * 3] = Math.sin(phi) * Math.cos(theta) * radius;
      pos[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * radius;
      pos[i * 3 + 2] = Math.cos(phi) * radius;

      // Few large particles, rest smaller
      sz[i] = i < 8 ? 2.0 + Math.random() * 3.0 : 0.5 + Math.random() * 1.5;
      op[i] = 0.08 + Math.random() * 0.15;
      ph[i] = Math.random() * Math.PI * 2;
      ly[i] = Math.min(radius / 20, 1.0);
    }

    return { positions: pos, sizes: sz, opacities: op, phases: ph, layers: ly };
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
        <bufferAttribute attach="attributes-aLayer" args={[buffers.layers, 1]} />
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
