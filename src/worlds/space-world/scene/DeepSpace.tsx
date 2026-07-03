/**
 * DeepSpace — Background Void Gradient
 *
 * Large inverted sphere with a multi-band gradient shader.
 * Creates the deep void aesthetic — the cosmic emptiness.
 * Depth band: void (z: -100)
 */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { ShaderMaterial } from "three";
import { useReducedMotion } from "../hooks";

// ============================================================================
// Types
// ============================================================================

interface DeepSpaceProps {
  readonly radius?: number;
}

// ============================================================================
// DeepSpace Vertex Shader
// ============================================================================

const DEEP_SPACE_VERTEX_SHADER = `
  varying vec3 vWorldPosition;

  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

// ============================================================================
// DeepSpace Fragment Shader — multi-band void gradient
// ============================================================================

const DEEP_SPACE_FRAGMENT_SHADER = `
  uniform float uTime;
  uniform float uReducedMotion;

  varying vec3 vWorldPosition;

  void main() {
    // Normalized direction from center
    vec3 dir = normalize(vWorldPosition);

    // Y-axis gradient bands — matching CSS: #030712 → #0a0f1e → #1e1b4b → #030712
    float y = dir.y * 0.5 + 0.5;

    // Gradient bands
    vec3 voidBlack = vec3(0.012, 0.027, 0.071);   // #030712
    vec3 deepBlue = vec3(0.039, 0.059, 0.118);     // #0a0f1e
    vec3 indigo = vec3(0.118, 0.106, 0.294);       // #1e1b4b
    vec3 deepVoid = vec3(0.008, 0.016, 0.047);     // darker void

    // Smooth band transitions
    vec3 color;
    if (y < 0.2) {
      color = mix(deepVoid, voidBlack, y / 0.2);
    } else if (y < 0.4) {
      color = mix(voidBlack, deepBlue, (y - 0.2) / 0.2);
    } else if (y < 0.6) {
      color = mix(deepBlue, indigo, (y - 0.4) / 0.2);
    } else if (y < 0.8) {
      color = mix(indigo, deepBlue, (y - 0.6) / 0.2);
    } else {
      color = mix(deepBlue, voidBlack, (y - 0.8) / 0.2);
    }

    // Subtle time-based shimmer — cosmic breathing
    float shimmer = sin(uTime * 0.05 + dir.x * 2.0) * 0.02 + 1.0;
    shimmer = mix(1.0, shimmer, 1.0 - uReducedMotion);
    color *= shimmer;

    gl_FragColor = vec4(color, 1.0);
  }
`;

// ============================================================================
// Component
// ============================================================================

export function DeepSpace({ radius = 80 }: DeepSpaceProps): React.JSX.Element {
  const materialRef = useRef<ShaderMaterial>(null);
  const reducedMotion = useReducedMotion();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uReducedMotion: { value: reducedMotion ? 1.0 : 0.0 },
    }),
    [reducedMotion],
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
    <mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[radius, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={DEEP_SPACE_VERTEX_SHADER}
        fragmentShader={DEEP_SPACE_FRAGMENT_SHADER}
        uniforms={uniforms}
        side={0}
        depthWrite={false}
      />
    </mesh>
  );
}
