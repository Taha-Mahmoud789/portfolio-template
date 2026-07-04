/**
 * OrbitPaths — Barely visible spatial guidelines
 *
 * Ultra-subtle rings that suggest structure without dominating.
 * Should feel like faint echoes, not visual elements.
 */

import { useMemo } from "react";
import { ORBITS } from "../data/space.config";

const VERTEX = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT = `
  uniform float uOpacity;
  uniform float uRadius;

  varying vec2 vUv;

  void main() {
    vec2 center = vUv - vec2(0.5);
    float dist = length(center) * 2.0;

    // Hair-thin ring — barely a line
    float ring = smoothstep(0.985, 0.995, dist) * (1.0 - smoothstep(0.995, 1.005, dist));
    float radiusFade = 1.0 - smoothstep(3.0, 12.0, uRadius) * 0.8;

    // Warm white at near-invisible opacity
    vec3 color = vec3(0.75, 0.72, 0.65);
    float alpha = ring * uOpacity * radiusFade;

    gl_FragColor = vec4(color, alpha);
  }
`;

interface OrbitPathProps {
  readonly radius: number;
  readonly tilt: number;
  readonly opacity: number;
  readonly index: number;
}

function OrbitPath({ radius, tilt, opacity, index }: OrbitPathProps) {
  const uniforms = useMemo(
    () => ({
      uOpacity: { value: opacity },
      uRadius: { value: radius },
    }),
    [opacity, radius],
  );

  const size = radius * 2.4;

  return (
    <mesh rotation={[Math.PI * 0.5 + tilt, index * 0.5, 0]}>
      <planeGeometry args={[size, size]} />
      <shaderMaterial
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

export function OrbitPaths() {
  return (
    <group>
      {ORBITS.map((orbit, i) => (
        <OrbitPath
          key={orbit.id}
          radius={orbit.radius}
          tilt={orbit.tilt}
          opacity={0.018 - i * 0.003}
          index={i}
        />
      ))}
    </group>
  );
}
