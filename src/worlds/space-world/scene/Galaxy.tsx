/**
 * Galaxy — Spiral Particle Galaxy (Awwwards Grade)
 *
 * Focal composition anchor. Logarithmic spiral arms with dust lanes,
 * bright core glow, and depth-aware color temperature.
 * The cosmos is indifferent — the galaxy doesn't notice the observer.
 */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { ShaderMaterial, Group } from "three";
import { useReducedMotion } from "../hooks";

// ============================================================================
// Constants
// ============================================================================

const GALAXY_CONFIG = {
  starCount: 1200,
  dustCount: 400,
  arms: 4,
  radius: 12,
  bulgeRadius: 2.0,
  armSpread: 0.45,
  rotationSpeed: 0.015,
  wobbleSpeed: 0.08,
  wobbleAmount: 0.03,
} as const;

// ============================================================================
// Types
// ============================================================================

interface GalaxyProps {
  readonly position?: [number, number, number];
  readonly scale?: number;
  readonly rotation?: [number, number, number];
}

// ============================================================================
// Star Vertex Shader — size attenuation + depth-based dimming
// ============================================================================

const STAR_VERTEX_SHADER = `
  attribute float aSize;
  attribute float aBrightness;
  attribute vec3 aColor;
  attribute float aDepth;

  uniform float uTime;
  uniform float uPixelRatio;

  varying float vBrightness;
  varying vec3 vColor;
  varying float vDepth;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

    vBrightness = aBrightness;
    vColor = aColor;
    vDepth = aDepth;

    // Size attenuation with depth fade
    float depthFade = 1.0 - aDepth * 0.3;
    gl_PointSize = max(aSize * uPixelRatio * (180.0 / -mvPosition.z) * depthFade, 0.5);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

// ============================================================================
// Star Fragment Shader — soft glow with bloom-ready core
// ============================================================================

const STAR_FRAGMENT_SHADER = `
  varying float vBrightness;
  varying vec3 vColor;
  varying float vDepth;

  void main() {
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);

    // Two-tier glow: tight core + soft halo
    float core = 1.0 - smoothstep(0.0, 0.15, dist);
    float halo = 1.0 - smoothstep(0.0, 0.5, dist);
    halo *= halo;

    float alpha = (core * 1.5 + halo * 0.5) * vBrightness;

    // Depth-based desaturation — far stars lose color
    vec3 color = mix(vColor, vec3(0.6, 0.65, 0.75), vDepth * 0.4);

    gl_FragColor = vec4(color, alpha);
  }
`;

// ============================================================================
// Dust Lane Vertex Shader
// ============================================================================

const DUST_VERTEX_SHADER = `
  attribute float aSize;
  attribute float aOpacity;

  uniform float uPixelRatio;

  varying float vOpacity;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vOpacity = aOpacity;
    gl_PointSize = max(aSize * uPixelRatio * (200.0 / -mvPosition.z), 0.5);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

// ============================================================================
// Dust Lane Fragment Shader — dark absorbing clouds
// ============================================================================

const DUST_FRAGMENT_SHADER = `
  varying float vOpacity;

  void main() {
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);

    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
    alpha *= vOpacity;

    // Dark dust — absorbs light, doesn't emit
    gl_FragColor = vec4(0.02, 0.02, 0.05, alpha * 0.6);
  }
`;

// ============================================================================
// Component
// ============================================================================

export function Galaxy({
  position = [8, 3, -30],
  scale = 1,
  rotation = [0.35, 0, 0],
}: GalaxyProps): React.JSX.Element {
  const starMaterialRef = useRef<ShaderMaterial>(null);
  const dustMaterialRef = useRef<ShaderMaterial>(null);
  const groupRef = useRef<Group>(null);
  const reducedMotion = useReducedMotion();
  const timeRef = useRef(0);

  // Star particles along spiral arms
  const starData = useMemo(() => {
    const { starCount, arms, radius, bulgeRadius, armSpread } = GALAXY_CONFIG;
    const pos = new Float32Array(starCount * 3);
    const sz = new Float32Array(starCount);
    const br = new Float32Array(starCount);
    const col = new Float32Array(starCount * 3);
    const dep = new Float32Array(starCount);

    const armAngleStep = (Math.PI * 2) / arms;

    for (let i = 0; i < starCount; i++) {
      const isBulge = Math.random() < 0.15;

      let x: number;
      let y: number;
      let z: number;

      if (isBulge) {
        const theta = Math.random() * Math.PI * 2;
        const r = Math.pow(Math.random(), 0.7) * bulgeRadius;
        x = Math.cos(theta) * r;
        y = Math.sin(theta) * r;
        z = (Math.random() - 0.5) * 0.4;
      } else {
        const armIndex = Math.floor(Math.random() * arms);
        const armAngle = armIndex * armAngleStep;
        const t = Math.random();
        const spiralAngle = armAngle + t * Math.PI * 2.5;
        const r = t * radius;

        x = Math.cos(spiralAngle) * r;
        y = Math.sin(spiralAngle) * r;
        z = (Math.random() - 0.5) * armSpread * r * 0.08;

        const perpX = -Math.sin(spiralAngle);
        const perpY = Math.cos(spiralAngle);
        const spread = (Math.random() - 0.5) * armSpread * r * 0.12;
        x += perpX * spread;
        y += perpY * spread;
      }

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      const distFromCenter = Math.sqrt(x * x + y * y);
      const normalizedDist = Math.min(distFromCenter / radius, 1);

      // Size: bulge stars larger, arm stars smaller
      const baseSize = isBulge ? 1.0 + Math.random() * 1.5 : 0.2 + Math.random() * 0.6;
      sz[i] = baseSize * (1 - normalizedDist * 0.25);

      // Brightness: core brighter with higher dynamic range
      const coreBrightness = Math.pow(1 - normalizedDist * 0.7, 1.5);
      br[i] = (0.3 + Math.random() * 0.7) * coreBrightness;

      // Color temperature: warm core → cool arms → blue edges
      const warmth = isBulge ? 0.8 : Math.max(0, 1 - normalizedDist * 1.8);
      const r2 = 0.65 + warmth * 0.35;
      const g = 0.6 + warmth * 0.25;
      const b = 0.75 + (1 - warmth) * 0.25;
      col[i * 3] = r2;
      col[i * 3 + 1] = g;
      col[i * 3 + 2] = b;

      // Depth: distance from viewer for atmospheric perspective
      dep[i] = normalizedDist;
    }

    return { positions: pos, sizes: sz, brightnesses: br, colors: col, depths: dep };
  }, []);

  // Dust lane particles — dark absorbing regions between arms
  const dustData = useMemo(() => {
    const { dustCount, arms, radius, armSpread } = GALAXY_CONFIG;
    const pos = new Float32Array(dustCount * 3);
    const sz = new Float32Array(dustCount);
    const op = new Float32Array(dustCount);

    const armAngleStep = (Math.PI * 2) / arms;

    for (let i = 0; i < dustCount; i++) {
      const armIndex = Math.floor(Math.random() * arms);
      const armAngle = armIndex * armAngleStep;
      const t = 0.1 + Math.random() * 0.8;
      const spiralAngle = armAngle + t * Math.PI * 2.5 + 0.15;
      const r = t * radius;

      let x = Math.cos(spiralAngle) * r;
      let y = Math.sin(spiralAngle) * r;
      const z = (Math.random() - 0.5) * armSpread * r * 0.05;

      const perpX = -Math.sin(spiralAngle);
      const perpY = Math.cos(spiralAngle);
      const spread = (Math.random() - 0.5) * armSpread * r * 0.08;
      x += perpX * spread;
      y += perpY * spread;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      sz[i] = 2 + Math.random() * 4;
      op[i] = 0.08 + Math.random() * 0.12;
    }

    return { positions: pos, sizes: sz, opacities: op };
  }, []);

  const starUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    }),
    [],
  );

  const dustUniforms = useMemo(
    () => ({
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    }),
    [],
  );

  useFrame((state, delta) => {
    if (reducedMotion) return;

    timeRef.current += delta;

    if (starMaterialRef.current) {
      const uTime = starMaterialRef.current.uniforms.uTime;
      if (uTime) {
        uTime.value = state.clock.elapsedTime;
      }
    }

    if (groupRef.current) {
      // Steady rotation
      groupRef.current.rotation.z += GALAXY_CONFIG.rotationSpeed * delta;

      // Organic wobble — slight z-axis oscillation
      const wobble =
        Math.sin(timeRef.current * GALAXY_CONFIG.wobbleSpeed) * GALAXY_CONFIG.wobbleAmount;
      groupRef.current.rotation.x = rotation[0] + wobble;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale} rotation={rotation}>
      {/* Star particles */}
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[starData.positions, 3]} />
          <bufferAttribute attach="attributes-aSize" args={[starData.sizes, 1]} />
          <bufferAttribute attach="attributes-aBrightness" args={[starData.brightnesses, 1]} />
          <bufferAttribute attach="attributes-aColor" args={[starData.colors, 3]} />
          <bufferAttribute attach="attributes-aDepth" args={[starData.depths, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={starMaterialRef}
          vertexShader={STAR_VERTEX_SHADER}
          fragmentShader={STAR_FRAGMENT_SHADER}
          uniforms={starUniforms}
          transparent
          depthWrite={false}
          blending={2}
        />
      </points>

      {/* Dust lanes — dark absorbing clouds between arms */}
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dustData.positions, 3]} />
          <bufferAttribute attach="attributes-aSize" args={[dustData.sizes, 1]} />
          <bufferAttribute attach="attributes-aOpacity" args={[dustData.opacities, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={dustMaterialRef}
          vertexShader={DUST_VERTEX_SHADER}
          fragmentShader={DUST_FRAGMENT_SHADER}
          uniforms={dustUniforms}
          transparent
          depthWrite={false}
          blending={2}
        />
      </points>

      {/* Core glow — emissive sphere at center */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.8, 24, 24]} />
        <meshBasicMaterial
          color="#c7d2fe"
          transparent
          opacity={0.08}
          blending={2}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
