/**
 * CosmicDust — Particle System (Awwwards Grade)
 *
 * Noise-based drift through 3D space, size pulsing, depth-based opacity.
 * Foreground particles that create parallax depth.
 */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { ShaderMaterial } from "three";
import { Points } from "@react-three/drei";
import { useReducedMotion } from "../hooks";

// ============================================================================
// Constants
// ============================================================================

const DUST_CONFIG = {
  count: 80,
  sizeMin: 0.5,
  sizeMax: 3.0,
  speedMin: 0.3,
  speedMax: 0.8,
  depthSpread: 20,
} as const;

// ============================================================================
// Dust Vertex Shader — noise drift + size pulsing
// ============================================================================

const DUST_VERTEX_SHADER = `
  attribute float aSize;
  attribute float aOpacity;
  attribute float aSpeed;
  attribute float aAngle;
  attribute float aPhase;

  uniform float uTime;
  uniform float uPixelRatio;

  varying float vOpacity;

  // Simple 3D noise for organic drift
  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  void main() {
    vec3 pos = position;

    // Noise-based drift — organic, not linear
    float t = uTime * aSpeed * 0.05;
    float nx = hash(vec3(floor(pos.x * 0.5), 0.0, aPhase)) * 2.0 - 1.0;
    float ny = hash(vec3(0.0, floor(pos.y * 0.5), aPhase)) * 2.0 - 1.0;
    pos.x += cos(aAngle + t) * 0.3 + nx * sin(t * 0.3) * 0.2;
    pos.y += sin(aAngle + t) * 0.25 + ny * cos(t * 0.4) * 0.15;
    pos.z += sin(t * 0.2 + aPhase) * 0.1;

    // Wrap around
    pos.x = mod(pos.x + 10.0, 20.0) - 10.0;
    pos.y = mod(pos.y + 10.0, 20.0) - 10.0;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

    // Size pulsing — subtle breathing
    float pulse = sin(uTime * 0.5 + aPhase) * 0.15 + 1.0;

    vOpacity = aOpacity;

    gl_PointSize = max(aSize * pulse * uPixelRatio * (120.0 / -mvPosition.z), 0.5);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

// ============================================================================
// Dust Fragment Shader — soft glow
// ============================================================================

const DUST_FRAGMENT_SHADER = `
  uniform vec3 uColor;
  varying float vOpacity;

  void main() {
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);

    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
    alpha *= vOpacity;

    gl_FragColor = vec4(uColor, alpha);
  }
`;

// ============================================================================
// Component
// ============================================================================

export function CosmicDust(): React.JSX.Element {
  const materialRef = useRef<ShaderMaterial>(null);
  const reducedMotion = useReducedMotion();
  const { count, sizeMin, sizeMax, speedMin, speedMax } = DUST_CONFIG;

  const { positions } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    const op = new Float32Array(count);
    const sp = new Float32Array(count);
    const an = new Float32Array(count);
    const ph = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 3 + Math.random() * DUST_CONFIG.depthSpread;

      pos[i * 3] = Math.sin(phi) * Math.cos(theta) * radius;
      pos[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * radius;
      pos[i * 3 + 2] = Math.cos(phi) * radius;

      // Size variance — some particles larger for depth
      const depthFactor = radius / DUST_CONFIG.depthSpread;
      sz[i] = sizeMin + Math.random() * (sizeMax - sizeMin) * (1 - depthFactor * 0.5);

      // Opacity — depth-based attenuation
      op[i] = (0.15 + Math.random() * 0.2) * (1 - depthFactor * 0.4);

      sp[i] = speedMin + Math.random() * (speedMax - speedMin);
      an[i] = Math.random() * Math.PI * 2;
      ph[i] = Math.random() * Math.PI * 2;
    }

    return {
      positions: pos,
      sizes: sz,
      opacities: op,
      speeds: sp,
      angles: an,
      phases: ph,
    };
  }, [count, sizeMin, sizeMax, speedMin, speedMax]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uColor: { value: "#818cf8" },
    }),
    [],
  );

  useFrame((state) => {
    if (materialRef.current && !reducedMotion) {
      const uTime = materialRef.current.uniforms.uTime;
      if (uTime) {
        uTime.value = state.clock.elapsedTime;
      }
    }
  });

  return (
    <Points positions={positions} stride={3} frustumCulled={false}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={DUST_VERTEX_SHADER}
        fragmentShader={DUST_FRAGMENT_SHADER}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={2}
      />
    </Points>
  );
}
