/**
 * SpaceEnvironment — Premium Cinematic Lighting
 *
 * Apple Vision Pro–inspired lighting:
 * - Warm key light from upper right
 * - Cool fill from left
 * - Subtle rim from behind
 * - Deep space fog
 */

export function SpaceEnvironment() {
  return (
    <>
      {/* Ambient — very low, warm base */}
      <ambientLight intensity={0.08} color="#e8dcc8" />

      {/* Key light — warm, directional */}
      <directionalLight intensity={0.6} color="#f5efe3" position={[12, 18, 8]} />

      {/* Fill light — cool blue */}
      <directionalLight intensity={0.2} color="#8fa8c8" position={[-15, 8, -5]} />

      {/* Rim light — from behind */}
      <directionalLight intensity={0.12} color="#c8b89a" position={[0, -2, -20]} />

      {/* Deep space fog */}
      <fog attach="fog" args={["#06080e", 40, 120]} />
    </>
  );
}
