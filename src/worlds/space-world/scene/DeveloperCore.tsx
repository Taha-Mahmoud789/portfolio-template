/**
 * DeveloperCore — Center of the Solar System
 *
 * Premium warm gold energy sphere representing identity.
 * Subtle concentric rings, soft corona, minimal glow.
 * Apple Vision Pro aesthetic — calm, refined, not flashy.
 */

import { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

// ============================================================================
// Fresnel Shader — atmospheric rim
//
// NOTE: Float uniform values are hardcoded in GLSL to avoid a known
// R3F v9 + Three.js 0.170 instability with float uniforms in ShaderMaterial.
// Only uColor is kept as a uniform (vec3 uniforms are stable).
// ============================================================================

const FRESNEL_VERTEX = `
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;

  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const FRESNEL_FRAGMENT = `
  uniform vec3 uColor;

  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;

  void main() {
    vec3 viewDir = normalize(vWorldPosition - cameraPosition);
    float fresnel = 0.05 + 1.5 * pow(1.0 + dot(viewDir, vWorldNormal), 3.0);
    gl_FragColor = vec4(uColor, fresnel * 0.7);
  }
`;

// ============================================================================
// Component
// ============================================================================

export function DeveloperCore() {
  const groupRef = useRef<THREE.Group>(null);
  const coronaRef = useRef<THREE.Mesh>(null);
  const coronaOrigRef = useRef<Float32Array | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Core sphere — radius 1.5 (40% smaller than original 2.5)
  const coreGeo = useMemo(() => new THREE.IcosahedronGeometry(1.5, 6), []);

  const coreMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: 0xd4c4a8,
        emissive: 0xb8a070,
        emissiveIntensity: isHovered ? 0.6 : 0.3,
        metalness: 0.6,
        roughness: 0.12,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
      }),
    [isHovered],
  );

  // Fresnel rim
  const rimGeo = useMemo(() => new THREE.IcosahedronGeometry(1.55, 6), []);

  const rimMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: FRESNEL_VERTEX,
        fragmentShader: FRESNEL_FRAGMENT,
        uniforms: {
          uColor: { value: new THREE.Color(0xe8dcc8) },
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.BackSide,
      }),
    [],
  );

  // Corona — subtle noise-deformed halo
  const coronaGeo = useMemo(() => new THREE.IcosahedronGeometry(1.4, 6), []);

  const coronaMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: 0xb8a070,
        transparent: true,
        opacity: 0.1,
        side: THREE.BackSide,
        depthWrite: false,
      }),
    [],
  );

  // Concentric rings — thin, elegant (scaled down)
  const ring1Geo = useMemo(() => new THREE.TorusGeometry(2.2, 0.006, 16, 128), []);
  const ring2Geo = useMemo(() => new THREE.TorusGeometry(2.8, 0.005, 16, 128), []);
  const ring3Geo = useMemo(() => new THREE.TorusGeometry(3.5, 0.004, 16, 128), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.02;
    }

    // Animate corona vertices — subtle noise
    if (coronaRef.current) {
      const posAttr = coronaRef.current.geometry.attributes.position as THREE.BufferAttribute;
      coronaOrigRef.current ??= new Float32Array(posAttr.array as Float32Array);
      const orig = coronaOrigRef.current;
      for (let i = 0; i < posAttr.count; i++) {
        const ox = orig[i * 3] ?? 0;
        const oy = orig[i * 3 + 1] ?? 0;
        const oz = orig[i * 3 + 2] ?? 0;
        const len = Math.sqrt(ox * ox + oy * oy + oz * oz) || 1;
        const nx = ox / len;
        const ny = oy / len;
        const nz = oz / len;
        const ns =
          Math.sin(nx * 12.9898 + t * 0.3) *
          Math.cos(ny * 78.233 + t * 0.3) *
          Math.sin(nz * 37.719 + t * 0.15) *
          0.25;
        const newLen = 2.4 + ns * 0.4;
        posAttr.setXYZ(i, nx * newLen, ny * newLen, nz * newLen);
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Core body — physical material */}
      <mesh
        geometry={coreGeo}
        material={coreMat}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
      />

      {/* Fresnel rim — subtle atmospheric glow */}
      <mesh geometry={rimGeo} material={rimMat} />

      {/* Corona — noise-deformed halo */}
      <mesh ref={coronaRef} geometry={coronaGeo} material={coronaMat} />

      {/* Concentric rings — spinning at different speeds */}
      <mesh geometry={ring1Geo} rotation={[Math.PI * 0.5, 0, 0]}>
        <meshBasicMaterial color="#b8a070" transparent opacity={0.15} />
      </mesh>
      <mesh geometry={ring2Geo} rotation={[Math.PI * 0.5, 0.25, 0]}>
        <meshBasicMaterial color="#e8dcc8" transparent opacity={0.08} />
      </mesh>
      <mesh geometry={ring3Geo} rotation={[Math.PI * 0.5, -0.12, 0]}>
        <meshBasicMaterial color="#b8a070" transparent opacity={0.04} />
      </mesh>

      {/* Identity label — premium typography */}
      <Html position={[0, -3, 0]} center style={{ pointerEvents: "none", userSelect: "none" }}>
        <div className="text-center">
          <p
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "18px",
              fontWeight: 300,
              letterSpacing: "0.15em",
              color: "rgba(232, 220, 200, 0.9)",
              textShadow: "0 0 30px rgba(184, 160, 112, 0.3)",
            }}
          >
            TAHA CORE
          </p>
          <div
            style={{
              width: "24px",
              height: "1px",
              background: "rgba(201, 169, 110, 0.3)",
              margin: "8px auto 0",
            }}
          />
          <p
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "8px",
              fontWeight: 300,
              letterSpacing: "0.1em",
              color: "rgba(232, 220, 200, 0.6)",
              marginTop: "6px",
            }}
          >
            Creative Developer
          </p>
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "5px",
              letterSpacing: "0.25em",
              textTransform: "uppercase" as const,
              color: "rgba(184, 160, 112, 0.3)",
              marginTop: "5px",
            }}
          >
            Building Digital Experiences
          </p>
        </div>
      </Html>

      {/* Subtle core light — warm gold emanation */}
      <pointLight color="#d4b896" intensity={isHovered ? 4 : 2} distance={20} decay={2} />
    </group>
  );
}
