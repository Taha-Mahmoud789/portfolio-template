/**
 * SpaceEnvironment — Premium Lighting
 *
 * Warm, controlled lighting with gold accents.
 * Apple Vision Pro feel — calm, not dramatic.
 */

export function SpaceEnvironment() {
  return (
    <>
      <ambientLight intensity={0.12} color="#f5f0e8" />

      <directionalLight intensity={0.4} color="#f5f0e8" position={[10, 5, 8]} />

      <directionalLight intensity={0.08} color="#C9A96E" position={[-8, -3, -5]} />

      <directionalLight intensity={0.05} color="#C9A96E" position={[0, 8, -10]} />

      <fog attach="fog" args={["#030712", 30, 80]} />
    </>
  );
}
