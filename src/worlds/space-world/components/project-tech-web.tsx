/**
 * Project Tech Web
 *
 * Visual tech connections radiating from the project.
 * Lines connect the project to its technology stack.
 * Subtle opacity pulse on the connecting lines.
 */

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useReducedMotion } from "../hooks";
import type { TechNode, TechLink } from "../data/project-galaxy-data";

interface ProjectTechWebProps {
  readonly nodes: readonly TechNode[];
  readonly links: readonly TechLink[];
  readonly parentPosition: [number, number, number];
  readonly isVisible: boolean;
  readonly accentColor: string;
}

function TechNodeMesh({
  node,
  index,
  isVisible,
}: {
  readonly node: TechNode;
  readonly index: number;
  readonly isVisible: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const reducedMotion = useReducedMotion();

  const breathOffset = useMemo(() => {
    return (index * 0.41 + 0.23) % 1;
  }, [index]);

  useFrame((state) => {
    if (!groupRef.current || reducedMotion || !isVisible) return;

    const t = state.clock.elapsedTime;

    // Slow breathing
    const breath = Math.sin(t * 0.4 + breathOffset * Math.PI * 2) * 0.02;
    groupRef.current.position.y = node.position[1] + breath;

    // Slow rotation
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.15 + breathOffset * Math.PI;
      meshRef.current.rotation.z = t * 0.08;
    }
  });

  if (!isVisible) return null;

  return (
    <group ref={groupRef} position={node.position}>
      <mesh ref={meshRef} scale={0.12}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color={node.color}
          emissive={node.color}
          emissiveIntensity={0.4}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Glow */}
      <mesh scale={0.2}>
        <icosahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color={node.color} transparent opacity={0.12} depthWrite={false} />
      </mesh>
    </group>
  );
}

function TechConnection({
  from,
  to,
  isVisible,
  accentColor,
}: {
  readonly from: [number, number, number];
  readonly to: [number, number, number];
  readonly isVisible: boolean;
  readonly accentColor: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const reducedMotion = useReducedMotion();

  // Animated opacity pulse
  useFrame((state) => {
    if (!meshRef.current || reducedMotion || !isVisible) return;
    const material = meshRef.current.material as THREE.MeshBasicMaterial;
    const pulse = Math.sin(state.clock.elapsedTime * 0.8) * 0.05 + 0.15;
    material.opacity = pulse;
  });

  if (!isVisible) return null;

  // Create a thin cylinder between two points
  const start = new THREE.Vector3(from[0], from[1], from[2]);
  const end = new THREE.Vector3(to[0], to[1], to[2]);
  const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  const direction = new THREE.Vector3().subVectors(end, start);
  const length = direction.length();
  direction.normalize();

  // Quaternion to rotate default Y-aligned cylinder to direction
  const quaternion = new THREE.Quaternion();
  quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);

  const euler = new THREE.Euler().setFromQuaternion(quaternion);

  return (
    <mesh ref={meshRef} position={[mid.x, mid.y, mid.z]} rotation={[euler.x, euler.y, euler.z]}>
      <cylinderGeometry args={[0.008, 0.008, length, 6]} />
      <meshBasicMaterial color={accentColor} transparent opacity={0.15} depthWrite={false} />
    </mesh>
  );
}

export function ProjectTechWeb({
  nodes,
  links,
  parentPosition,
  isVisible,
  accentColor,
}: ProjectTechWebProps) {
  // Build node position map
  const nodeMap = useMemo(() => {
    const map = new Map<string, [number, number, number]>();
    for (const node of nodes) {
      map.set(node.id, node.position);
    }
    return map;
  }, [nodes]);

  return (
    <group position={parentPosition}>
      {/* Connection lines */}
      {links.map((link) => {
        const fromPos = nodeMap.get(link.from);
        const toPos = nodeMap.get(link.to);
        if (!fromPos || !toPos) return null;

        return (
          <TechConnection
            key={`${link.from}-${link.to}`}
            from={fromPos}
            to={toPos}
            isVisible={isVisible}
            accentColor={accentColor}
          />
        );
      })}

      {/* Tech nodes */}
      {nodes.map((node, i) => (
        <TechNodeMesh key={node.id} node={node} index={i} isVisible={isVisible} />
      ))}
    </group>
  );
}
