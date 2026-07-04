/**
 * Project Visual Field
 *
 * Floating image panels arranged spatially around a project.
 * Each panel is a textured plane with subtle parallax.
 * Images are loaded lazily — only when the project is focused.
 */

import { useRef, useMemo, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Group } from "three";
import { useReducedMotion } from "../hooks";
import type { VisualPanel } from "../data/project-galaxy-data";

interface VisualFieldProps {
  readonly panels: readonly VisualPanel[];
  readonly parentPosition: [number, number, number];
  readonly isVisible: boolean;
}

function FloatingPanel({
  panel,
  index,
  isVisible,
}: {
  readonly panel: VisualPanel;
  readonly index: number;
  readonly isVisible: boolean;
}) {
  const groupRef = useRef<Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const reducedMotion = useReducedMotion();
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const textureRef = useRef<THREE.Texture | null>(null);

  // Load texture lazily — use ref to avoid dependency cycle
  useEffect(() => {
    if (!isVisible || textureRef.current) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const tex = new THREE.Texture(img);
      tex.needsUpdate = true;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      textureRef.current = tex;
      setTexture(tex);
    };
    img.onerror = () => {
      // Image failed to load — show placeholder
    };
    img.src = panel.image;

    return () => {
      if (textureRef.current) {
        textureRef.current.dispose();
        textureRef.current = null;
      }
    };
  }, [isVisible, panel.image]);

  const breathOffset = useMemo(() => {
    return (index * 0.37 + 0.12) % 1;
  }, [index]);

  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * -2;
    }
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((state) => {
    if (!groupRef.current || reducedMotion) return;

    const t = state.clock.elapsedTime;

    const breath = Math.sin(t * 0.3 + breathOffset * Math.PI * 2) * 0.04;
    const parallaxStrength = 0.03 * (index + 1);

    groupRef.current.position.x = panel.position[0] + mouseRef.current.x * parallaxStrength;
    groupRef.current.position.y =
      panel.position[1] + breath + mouseRef.current.y * parallaxStrength;

    if (meshRef.current) {
      meshRef.current.rotation.y = panel.rotation[1] + mouseRef.current.x * 0.015;
    }
  });

  if (!isVisible) return null;

  return (
    <group ref={groupRef} position={panel.position} rotation={panel.rotation}>
      <mesh ref={meshRef}>
        <planeGeometry args={[panel.size[0], panel.size[1]]} />
        {texture ? (
          <meshBasicMaterial
            map={texture}
            transparent
            opacity={0.9}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        ) : (
          <meshBasicMaterial
            color="#1a1a2e"
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        )}
      </mesh>

      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[panel.size[0] + 0.06, panel.size[1] + 0.06]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.06}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

export function ProjectVisualField({ panels, parentPosition, isVisible }: VisualFieldProps) {
  return (
    <group position={parentPosition}>
      {panels.map((panel, i) => (
        <FloatingPanel
          key={`${panel.label}-${String(i)}`}
          panel={panel}
          index={i}
          isVisible={isVisible}
        />
      ))}
    </group>
  );
}
