/**
 * Planet — Sphere with Atmospheric Glow (Awwwards Grade)
 *
 * Celestial bodies with Fresnel atmospheric halo, light-responsive shading,
 * optional ring system, and smooth terminator gradient.
 * Reduced geometry for distance performance.
 */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { ShaderMaterial, Group } from "three";
import { useReducedMotion } from "../hooks";

// ============================================================================
// Types
// ============================================================================

interface PlanetProps {
  readonly position?: [number, number, number];
  readonly radius?: number;
  readonly color?: string;
  readonly atmosphereColor?: string;
  readonly atmosphereIntensity?: number;
  readonly rotationSpeed?: number;
  readonly lightDirection?: [number, number, number];
  readonly ringColor?: string;
  readonly ringInner?: number;
  readonly ringOuter?: number;
}

// ============================================================================
// Planet Vertex Shader — smooth terminator + Fresnel
// ============================================================================

const PLANET_VERTEX_SHADER = `
  uniform vec3 uLightDir;

  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec3 vLightDir;
  varying float vFresnel;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPos = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-worldPos.xyz);
    vLightDir = normalize((modelViewMatrix * vec4(uLightDir, 0.0)).xyz);

    float fresnel = 1.0 - max(dot(vNormal, vViewDir), 0.0);
    vFresnel = pow(fresnel, 2.8);

    gl_Position = projectionMatrix * worldPos;
  }
`;

// ============================================================================
// Planet Fragment Shader — smooth terminator + atmosphere blend
// ============================================================================

const PLANET_FRAGMENT_SHADER = `
  uniform vec3 uColor;
  uniform vec3 uAtmosphereColor;
  uniform float uAtmosphereIntensity;

  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec3 vLightDir;
  varying float vFresnel;

  void main() {
    // Smooth terminator — wider penumbra
    float NdotL = dot(vNormal, vLightDir);
    float terminator = smoothstep(-0.2, 0.4, NdotL);

    // Surface color with terminator
    vec3 shadowColor = uColor * 0.15;
    vec3 litColor = uColor * (0.4 + terminator * 0.6);
    vec3 surfaceColor = mix(shadowColor, litColor, terminator);

    // Subtle specular highlight
    vec3 halfDir = normalize(vLightDir + vViewDir);
    float spec = pow(max(dot(vNormal, halfDir), 0.0), 32.0) * terminator * 0.3;
    surfaceColor += vec3(spec);

    // Atmosphere blend — Fresnel wraps around the limb
    vec3 finalColor = mix(surfaceColor, uAtmosphereColor, vFresnel * uAtmosphereIntensity * 0.5);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

// ============================================================================
// Atmosphere Glow Shaders
// ============================================================================

const ATMOSPHERE_VERTEX_SHADER = `
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPos = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-worldPos.xyz);
    gl_Position = projectionMatrix * worldPos;
  }
`;

const ATMOSPHERE_FRAGMENT_SHADER = `
  uniform vec3 uColor;
  uniform float uIntensity;

  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    float fresnel = 1.0 - max(dot(vNormal, vViewDir), 0.0);
    fresnel = pow(fresnel, 2.2) * uIntensity;

    // Softer edge falloff
    float edge = smoothstep(0.0, 0.3, fresnel);
    gl_FragColor = vec4(uColor, edge * uIntensity * 0.7);
  }
`;

// ============================================================================
// Ring Shaders
// ============================================================================

const RING_VERTEX_SHADER = `
  varying vec2 vUv;
  varying vec3 vWorldPos;

  void main() {
    vUv = uv;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const RING_FRAGMENT_SHADER = `
  uniform vec3 uColor;
  uniform float uInner;
  uniform float uOuter;
  uniform float uTime;

  varying vec2 vUv;
  varying vec3 vWorldPos;

  void main() {
    float dist = length(vWorldPos.xz);
    float t = (dist - uInner) / (uOuter - uInner);

    // Ring bands
    float band1 = smoothstep(0.0, 0.05, t) * (1.0 - smoothstep(0.15, 0.2, t));
    float band2 = smoothstep(0.25, 0.3, t) * (1.0 - smoothstep(0.55, 0.6, t));
    float band3 = smoothstep(0.65, 0.7, t) * (1.0 - smoothstep(0.9, 1.0, t));

    float alpha = (band1 * 0.4 + band2 * 0.25 + band3 * 0.15);

    // Subtle rotation shimmer
    float angle = atan(vWorldPos.z, vWorldPos.x);
    float shimmer = sin(angle * 8.0 + uTime * 0.1) * 0.05 + 1.0;
    alpha *= shimmer;

    vec3 color = mix(uColor * 0.6, uColor, t);

    gl_FragColor = vec4(color, alpha);
  }
`;

// ============================================================================
// Component — Single Planet
// ============================================================================

function SinglePlanet({
  radius = 3,
  color = "#1e1b4b",
  atmosphereColor = "#6366f1",
  atmosphereIntensity = 1.5,
  rotationSpeed = 0.01,
  lightDirection = [0.5, 0.3, 1.0],
  ringColor,
  ringInner = 1.4,
  ringOuter = 2.2,
}: Omit<PlanetProps, "position">) {
  const materialRef = useRef<ShaderMaterial>(null);
  const ringMaterialRef = useRef<ShaderMaterial>(null);
  const groupRef = useRef<Group>(null);
  const reducedMotion = useReducedMotion();

  const planetUniforms = useMemo(
    () => ({
      uColor: { value: color },
      uAtmosphereColor: { value: atmosphereColor },
      uAtmosphereIntensity: { value: atmosphereIntensity },
      uLightDir: { value: lightDirection },
    }),
    [color, atmosphereColor, atmosphereIntensity, lightDirection],
  );

  const atmosphereUniforms = useMemo(
    () => ({
      uColor: { value: atmosphereColor },
      uIntensity: { value: atmosphereIntensity },
    }),
    [atmosphereColor, atmosphereIntensity],
  );

  const ringUniforms = useMemo(
    () => ({
      uColor: { value: ringColor ?? atmosphereColor },
      uInner: { value: ringInner * radius },
      uOuter: { value: ringOuter * radius },
      uTime: { value: 0 },
    }),
    [ringColor, atmosphereColor, ringInner, ringOuter, radius],
  );

  useFrame((state) => {
    if (ringMaterialRef.current && !reducedMotion) {
      const uTime = ringMaterialRef.current.uniforms.uTime;
      if (uTime) {
        uTime.value = state.clock.elapsedTime;
      }
    }
    if (groupRef.current && !reducedMotion) {
      groupRef.current.rotation.y += rotationSpeed;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Planet body — 48 segments (down from 64) */}
      <mesh>
        <sphereGeometry args={[radius, 48, 48]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={PLANET_VERTEX_SHADER}
          fragmentShader={PLANET_FRAGMENT_SHADER}
          uniforms={planetUniforms}
        />
      </mesh>

      {/* Atmosphere glow — 24 segments (down from 32) */}
      <mesh scale={1.12}>
        <sphereGeometry args={[radius, 24, 24]} />
        <shaderMaterial
          vertexShader={ATMOSPHERE_VERTEX_SHADER}
          fragmentShader={ATMOSPHERE_FRAGMENT_SHADER}
          uniforms={atmosphereUniforms}
          transparent
          depthWrite={false}
          side={1}
        />
      </mesh>

      {/* Ring system */}
      {ringColor && (
        <mesh rotation={[Math.PI * 0.45, 0, 0]}>
          <ringGeometry args={[ringInner * radius, ringOuter * radius, 64]} />
          <shaderMaterial
            ref={ringMaterialRef}
            vertexShader={RING_VERTEX_SHADER}
            fragmentShader={RING_FRAGMENT_SHADER}
            uniforms={ringUniforms}
            transparent
            depthWrite={false}
            side={2}
          />
        </mesh>
      )}
    </group>
  );
}

// ============================================================================
// Main Planets — compositionally placed
// ============================================================================

const PLANET_PRESETS = [
  {
    position: [-14, -3, -28] as [number, number, number],
    radius: 3.5,
    color: "#1e1b4b",
    atmosphereColor: "#6366f1",
    atmosphereIntensity: 1.4,
    rotationSpeed: 0.004,
    lightDirection: [0.5, 0.3, 1.0] as [number, number, number],
    ringColor: "#4f46e5",
    ringInner: 1.4,
    ringOuter: 2.0,
  },
  {
    position: [20, 1, -42] as [number, number, number],
    radius: 1.8,
    color: "#0c1a3a",
    atmosphereColor: "#06b6d4",
    atmosphereIntensity: 1.1,
    rotationSpeed: 0.006,
    lightDirection: [0.4, 0.5, 0.8] as [number, number, number],
  },
  {
    position: [-22, 10, -55] as [number, number, number],
    radius: 5,
    color: "#0f172a",
    atmosphereColor: "#8b5cf6",
    atmosphereIntensity: 0.9,
    rotationSpeed: 0.002,
    lightDirection: [0.3, 0.2, 1.0] as [number, number, number],
  },
];

export function Planets(): React.JSX.Element {
  return (
    <group>
      {PLANET_PRESETS.map((preset, i) => (
        <group key={`planet-${String(i)}`} position={preset.position}>
          <SinglePlanet
            radius={preset.radius}
            color={preset.color}
            atmosphereColor={preset.atmosphereColor}
            atmosphereIntensity={preset.atmosphereIntensity}
            rotationSpeed={preset.rotationSpeed}
            lightDirection={preset.lightDirection}
            ringColor={preset.ringColor}
            ringInner={preset.ringInner}
            ringOuter={preset.ringOuter}
          />
        </group>
      ))}
    </group>
  );
}
