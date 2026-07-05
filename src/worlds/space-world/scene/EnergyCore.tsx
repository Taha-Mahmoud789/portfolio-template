/**
 * EnergyCore — Digital Identity Heart
 *
 * Premium warm gold orb with physical material.
 * Subtle distortion, clearcoat finish.
 * Reacts to mouse proximity — gentle glow intensification.
 */

import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Html } from "@react-three/drei";
import type { Mesh } from "three";
import { useReducedMotion } from "../hooks";

export function EnergyCore() {
  const meshRef = useRef<Mesh>(null);
  const reducedMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  const mouseRef = useRef({ x: 0, y: 0 });
  const proximityRef = useRef(0);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * -2;
    }
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((state) => {
    if (reducedMotion) return;
    const t = state.clock.elapsedTime;

    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.03;
      meshRef.current.rotation.x = t * 0.02;
    }

    const dist = Math.sqrt(
      mouseRef.current.x * mouseRef.current.x + mouseRef.current.y * mouseRef.current.y,
    );
    const proximity = Math.max(0, 1 - dist * 0.5);
    proximityRef.current += (proximity - proximityRef.current) * 0.03;
  });

  return (
    <Float speed={0.4} rotationIntensity={0.05} floatIntensity={0.08}>
      <group onPointerOver={() => setIsHovered(true)} onPointerOut={() => setIsHovered(false)}>
        {/* Core sphere — physical material */}
        <mesh ref={meshRef}>
          <dodecahedronGeometry args={[1.8, 2]} />
          <meshPhysicalMaterial
            color="#c8b896"
            emissive="#a08a60"
            emissiveIntensity={isHovered ? 0.5 : 0.2}
            metalness={0.5}
            roughness={0.1}
            clearcoat={0.9}
            clearcoatRoughness={0.05}
          />
        </mesh>

        {/* Inner glow — very subtle */}
        <mesh scale={1.5}>
          <sphereGeometry args={[1.5, 16, 16]} />
          <meshBasicMaterial
            color="#b8a070"
            transparent
            opacity={isHovered ? 0.06 : 0.02}
            depthWrite={false}
          />
        </mesh>

        {/* Gold accent ring — thin */}
        <mesh rotation={[Math.PI * 0.5, 0, 0]}>
          <torusGeometry args={[2.5, 0.008, 16, 64]} />
          <meshBasicMaterial color="#b8a070" transparent opacity={0.12} />
        </mesh>

        {/* Identity label on hover only */}
        {isHovered && (
          <Html
            position={[0, -2.5, 0]}
            center
            style={{ pointerEvents: "none", userSelect: "none" }}
          >
            <div className="text-center animate-[fadeIn_0.2s_ease-out]">
              <p
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "13px",
                  fontWeight: 400,
                  letterSpacing: "0.04em",
                  color: "rgba(232, 220, 200, 0.8)",
                }}
              >
                Taha
              </p>
              <p
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "8px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase" as const,
                  color: "rgba(184, 160, 112, 0.4)",
                  marginTop: "2px",
                }}
              >
                Creative Developer
              </p>
            </div>
          </Html>
        )}
      </group>
    </Float>
  );
}
