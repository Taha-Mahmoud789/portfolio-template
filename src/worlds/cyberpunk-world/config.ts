import type { WorldManifest } from "@/types/world";

export const CYBERPUNK_WORLD_CONFIG: WorldManifest = {
  id: "cyberpunk-world",
  name: "Cyberpunk World",
  description: "Neon-lit dystopia with glitch effects and holographic elements",
  route: "/worlds/cyberpunk",
  thumbnail: "/icons/worlds/cyberpunk.svg",
  theme: {} as WorldManifest["theme"],
  animation: {
    engine: "gsap",
    pageTransition: { type: "custom", duration: 0.8 },
    scrollAnimations: { enabled: true, parallax: true, reveal: true, scrub: true },
    hoverEffects: { type: "glow", intensity: 2, duration: 0.2 },
    loadingAnimation: { type: "custom", duration: 1.5 },
  },
  cursor: { type: "custom", size: 12, color: "#00ffff", blendMode: "screen" },
  typography: {
    headingFont: "Orbitron",
    bodyFont: "Rajdhani",
    monoFont: "Share Tech Mono",
    scale: 1.1,
  },
  metadata: {
    author: "Frontend Multiverse",
    version: "1.0.0",
    createdAt: "2026-01-01",
    tags: ["cyberpunk", "neon", "glitch"],
  },
};
