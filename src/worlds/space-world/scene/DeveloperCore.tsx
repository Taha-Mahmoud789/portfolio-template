/**
 * DeveloperCore — Center of the Solar System
 *
 * Premium glowing energy sphere representing identity.
 * Multiple concentric rings, pulsing animation, layered corona.
 * Inspired by premium Three.js solar system suns.
 */

import { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

// ============================================================================
// Fresnel Material — atmospheric rim glow
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
  uniform float uFresnelBias;
  uniform float uFresnelScale;
  uniform float uFresnelPower;

  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;

  void main() {
    vec3 viewDir = normalize(vWorldPosition - cameraPosition);
    float fresnel = uFresnelBias + uFresnelScale * pow(1.0 + dot(viewDir, vWorldNormal), uFresnelPower);
    gl_FragColor = vec4(uColor, fresnel);
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

  // Inner sphere — main body
  const coreGeo = useMemo(() => new THREE.IcosahedronGeometry(0.8, 6), []);

  const coreMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0xd4b896,
        emissive: 0xc9a96e,
        emissiveIntensity: 1.2,
        metalness: 0.8,
        roughness: 0.1,
      }),
    [],
  );

  // Fresnel rim shell
  const rimGeo = useMemo(() => new THREE.IcosahedronGeometry(0.84, 6), []);

  const rimMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: FRESNEL_VERTEX,
        fragmentShader: FRESNEL_FRAGMENT,
        uniforms: {
          uColor: { value: new THREE.Color(0xf5f0e8) },
          uFresnelBias: { value: 0.05 },
          uFresnelScale: { value: 2.0 },
          uFresnelPower: { value: 2.5 },
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.BackSide,
      }),
    [],
  );

  // Corona — layered noise-deformed mesh
  const coronaGeo = useMemo(() => new THREE.IcosahedronGeometry(0.78, 6), []);

  const coronaMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: 0xc9a96e,
        transparent: true,
        opacity: 0.25,
        side: THREE.BackSide,
        depthWrite: false,
      }),
    [],
  );

  // Second corona layer — softer, larger
  const corona2Geo = useMemo(() => new THREE.IcosahedronGeometry(0.85, 5), []);

  const corona2Mat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: 0xf5f0e8,
        transparent: true,
        opacity: 0.08,
        side: THREE.BackSide,
        depthWrite: false,
      }),
    [],
  );

  // Inner glow
  const glowGeo = useMemo(() => new THREE.SphereGeometry(0.6, 16, 16), []);
  const glowMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: 0xc9a96e,
        transparent: true,
        opacity: 0.2,
        depthWrite: false,
      }),
    [],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.04;
    }

    // Pulsing inner glow
    if (glowMat) {
      glowMat.opacity = 0.1 + Math.sin(t * 0.8) * 0.04;
    }

    // Animate corona vertices — procedural noise deformation
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
          Math.sin(nx * 12.9898 + t * 0.5) *
          Math.cos(ny * 78.233 + t * 0.5) *
          Math.sin(nz * 37.719 + t * 0.25) *
          0.4;
        const newLen = 0.78 + ns * 0.25;
        posAttr.setXYZ(i, nx * newLen, ny * newLen, nz * newLen);
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Core body */}
      <mesh
        geometry={coreGeo}
        material={coreMat}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
      />

      {/* Fresnel rim — atmospheric glow */}
      <mesh geometry={rimGeo} material={rimMat} />

      {/* Corona — noise-deformed halo (inner) */}
      <mesh ref={coronaRef} geometry={coronaGeo} material={coronaMat} />

      {/* Corona — second layer (softer, larger) */}
      <mesh geometry={corona2Geo} material={corona2Mat} />

      {/* Inner glow sphere */}
      <mesh geometry={glowGeo} material={glowMat} scale={3.5} />

      {/* Concentric rings — spinning at different speeds */}
      <mesh rotation={[Math.PI * 0.5, 0, 0]}>
        <torusGeometry args={[1.1, 0.004, 16, 128]} />
        <meshBasicMaterial color="#C9A96E" transparent opacity={0.3} />
      </mesh>
      <mesh rotation={[Math.PI * 0.5, 0.3, 0]}>
        <torusGeometry args={[1.3, 0.003, 16, 128]} />
        <meshBasicMaterial color="#f5f0e8" transparent opacity={0.12} />
      </mesh>
      <mesh rotation={[Math.PI * 0.5, -0.15, 0]}>
        <torusGeometry args={[1.5, 0.002, 16, 128]} />
        <meshBasicMaterial color="#C9A96E" transparent opacity={0.06} />
      </mesh>

      {/* Identity label — always visible */}
      <Html position={[0, -1.6, 0]} center style={{ pointerEvents: "none", userSelect: "none" }}>
        <div className="text-center">
          <p
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "18px",
              fontWeight: 500,
              letterSpacing: "0.08em",
              color: "#f5f0e8",
              textShadow: "0 0 30px rgba(201, 169, 110, 0.5), 0 0 60px rgba(201, 169, 110, 0.2)",
            }}
          >
            Taha
          </p>
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "9px",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(201, 169, 110, 0.7)",
              marginTop: "6px",
            }}
          >
            Creative Developer
          </p>
        </div>
      </Html>

      {/* Hover glow intensification */}
      {isHovered && <pointLight color="#C9A96E" intensity={5} distance={10} decay={2} />}

      {/* Ambient glow — always on */}
      <pointLight color="#C9A96E" intensity={3.5} distance={15} decay={2} />
    </group>
  );
}
