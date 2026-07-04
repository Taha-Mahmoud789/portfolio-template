/**
 * EnergyCore — Digital Identity Heart
 *
 * The center of the universe.
 * Organic distorted shape with premium materials.
 * Reacts to mouse proximity — subtle glow intensification.
 * Shows identity on hover.
 * Bloom-ready emissive for soft glow.
 */

import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Html } from "@react-three/drei";
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
      meshRef.current.rotation.y = t * 0.05;
      meshRef.current.rotation.x = t * 0.03;
    }

    // Proximity-based glow
    const dist = Math.sqrt(
      mouseRef.current.x * mouseRef.current.x + mouseRef.current.y * mouseRef.current.y,
    );
    const proximity = Math.max(0, 1 - dist * 0.5);
    proximityRef.current += (proximity - proximityRef.current) * 0.03;
  });

  return (
    <Float speed={0.6} rotationIntensity={0.1} floatIntensity={0.15}>
      <group onPointerOver={() => setIsHovered(true)} onPointerOut={() => setIsHovered(false)}>
        {/* Core sphere — organic distorted shape */}
        <mesh ref={meshRef}>
          <dodecahedronGeometry args={[0.6, 2]} />
          <MeshDistortMaterial
            color="#d6ccb8"
            emissive="#C9A96E"
            emissiveIntensity={isHovered ? 0.7 : 0.35}
            metalness={0.6}
            roughness={0.08}
            transparent
            opacity={0.95}
            distort={isHovered ? 0.25 : 0.1}
            speed={1.5}
          />
        </mesh>

        {/* Inner glow sphere */}
        <mesh scale={2.0}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshBasicMaterial
            color="#C9A96E"
            transparent
            opacity={isHovered ? 0.1 : 0.04}
            depthWrite={false}
          />
        </mesh>

        {/* Gold accent ring */}
        <mesh rotation={[Math.PI * 0.5, 0, 0]}>
          <torusGeometry args={[1.0, 0.005, 16, 64]} />
          <meshBasicMaterial color="#C9A96E" transparent opacity={0.2} />
        </mesh>

        {/* Identity label on hover */}
        {isHovered && (
          <Html
            position={[0, -0.7, 0]}
            center
            style={{ pointerEvents: "none", userSelect: "none" }}
          >
            <div className="text-center animate-[fadeIn_0.2s_ease-out]">
              <p
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "14px",
                  fontWeight: 500,
                  letterSpacing: "0.04em",
                  color: "#f5f0e8",
                }}
              >
                Taha
              </p>
              <p
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "9px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(201, 169, 110, 0.6)",
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
