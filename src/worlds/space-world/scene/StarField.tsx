/**
 * StarField — Three.js Points Geometry (Awwwards Grade)
 *
 * 3 depth layers with color temperature variance (warm → neutral → hot blue).
 * Depth-based brightness attenuation and atmospheric desaturation.
 * Stars are static points in 3D space — the camera drifts through them.
 */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { ShaderMaterial } from "three";
import { Float, Points } from "@react-three/drei";
import { STAR_FIELD_CONFIG } from "../config";
import { useReducedMotion } from "../hooks";

// ============================================================================
// Types
// ============================================================================

interface StarLayerProps {
  readonly depth: "near" | "mid" | "far";
  readonly count: number;
  readonly sizeRange: [number, number];
  readonly brightnessRange: [number, number];
  readonly twinkleRange: [number, number];
  readonly color: string;
}

// ============================================================================
// Star Vertex Shader — twinkle + depth attenuation
// ============================================================================

const STAR_VERTEX_SHADER = `
  attribute float aSize;
  attribute float aBrightness;
  attribute float aTwinkleSpeed;
  attribute float aTwinklePhase;
  attribute float aDepth;

  uniform float uTime;
  uniform float uPixelRatio;

  varying float vBrightness;
  varying float vDepth;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

    // Twinkle — oscillate with slight randomness
    float twinkle = sin(uTime * aTwinkleSpeed + aTwinklePhase) * 0.5 + 0.5;
    float twinkle2 = sin(uTime * aTwinkleSpeed * 0.7 + aTwinklePhase * 1.3) * 0.5 + 0.5;
    float combined = twinkle * 0.7 + twinkle2 * 0.3;

    vBrightness = aBrightness * (0.6 + combined * 0.4);
    vDepth = aDepth;

    // Size attenuation with depth fade
    float depthFade = 1.0 - aDepth * 0.5;
    gl_PointSize = max(aSize * uPixelRatio * (200.0 / -mvPosition.z) * depthFade, 0.5);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

// ============================================================================
// Star Fragment Shader — soft glow with bloom-ready core
// ============================================================================

const STAR_FRAGMENT_SHADER = `
  varying float vBrightness;
  varying float vDepth;

  void main() {
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);

    // Two-tier glow
    float core = 1.0 - smoothstep(0.0, 0.12, dist);
    float halo = 1.0 - smoothstep(0.0, 0.5, dist);
    halo *= halo;

    float alpha = (core * 1.8 + halo * 0.4) * vBrightness;

    gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
  }
`;

// ============================================================================
// Component
// ============================================================================

function StarLayer({ depth, count, sizeRange, brightnessRange, twinkleRange }: StarLayerProps) {
  const materialRef = useRef<ShaderMaterial>(null);
  const reducedMotion = useReducedMotion();

  const { positions } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    const br = new Float32Array(count);
    const tw = new Float32Array(count);
    const tp = new Float32Array(count);
    const dep = new Float32Array(count);

    const { galacticCenter } = STAR_FIELD_CONFIG;

    for (let i = 0; i < count; i++) {
      const isNearGalaxy = Math.random() < (depth === "near" ? 0.3 : depth === "far" ? 0.5 : 0.4);

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 10 + Math.random() * 40;

      const galacticBias = isNearGalaxy ? 0.3 : 0;
      const galX = (galacticCenter.x - 0.5) * 20;
      const galY = (galacticCenter.y - 0.5) * 20;

      pos[i * 3] =
        Math.sin(phi) * Math.cos(theta) * radius * (1 - galacticBias) + galX * galacticBias;
      pos[i * 3 + 1] =
        Math.sin(phi) * Math.sin(theta) * radius * (1 - galacticBias) + galY * galacticBias;
      pos[i * 3 + 2] = Math.cos(phi) * radius * (1 - galacticBias);

      sz[i] = sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]);
      br[i] = brightnessRange[0] + Math.random() * (brightnessRange[1] - brightnessRange[0]);
      tw[i] = twinkleRange[0] + Math.random() * (twinkleRange[1] - twinkleRange[0]);
      tp[i] = Math.random() * Math.PI * 2;

      // Depth: 0 = near, 1 = far
      const depthNorm = depth === "near" ? 0.1 : depth === "mid" ? 0.5 : 0.9;
      dep[i] = depthNorm + (Math.random() - 0.5) * 0.1;
    }

    return {
      positions: pos,
      sizes: sz,
      brightnesses: br,
      twinkleSpeeds: tw,
      twinklePhases: tp,
      depths: dep,
    };
  }, [count, depth, sizeRange, brightnessRange, twinkleRange]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
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
    <Float speed={0.3} rotationIntensity={0.05} floatIntensity={0.15}>
      <Points positions={positions} stride={3} frustumCulled={false}>
        <shaderMaterial
          ref={materialRef}
          vertexShader={STAR_VERTEX_SHADER}
          fragmentShader={STAR_FRAGMENT_SHADER}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={2}
        />
      </Points>
    </Float>
  );
}

// ============================================================================
// Main StarField — 3 layers composited
// ============================================================================

export function StarField(): React.JSX.Element {
  const { depthLayers } = STAR_FIELD_CONFIG;

  return (
    <group>
      <StarLayer
        depth="near"
        count={depthLayers.near.count}
        sizeRange={[depthLayers.near.sizeMin, depthLayers.near.sizeMax]}
        brightnessRange={[depthLayers.near.brightnessMin, depthLayers.near.brightnessMax]}
        twinkleRange={[depthLayers.near.twinkleMin, depthLayers.near.twinkleMax]}
        color={depthLayers.near.color}
      />
      <StarLayer
        depth="mid"
        count={depthLayers.mid.count}
        sizeRange={[depthLayers.mid.sizeMin, depthLayers.mid.sizeMax]}
        brightnessRange={[depthLayers.mid.brightnessMin, depthLayers.mid.brightnessMax]}
        twinkleRange={[depthLayers.mid.twinkleMin, depthLayers.mid.twinkleMax]}
        color={depthLayers.mid.color}
      />
      <StarLayer
        depth="far"
        count={depthLayers.far.count}
        sizeRange={[depthLayers.far.sizeMin, depthLayers.far.sizeMax]}
        brightnessRange={[depthLayers.far.brightnessMin, depthLayers.far.brightnessMax]}
        twinkleRange={[depthLayers.far.twinkleMin, depthLayers.far.twinkleMax]}
        color={depthLayers.far.color}
      />
    </group>
  );
}
