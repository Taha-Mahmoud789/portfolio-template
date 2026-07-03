import type { WorldManifest } from "@/types/world";

export const GAMING_WORLD_CONFIG: WorldManifest = {
  id: "gaming-world",
  name: "Gaming World",
  description: "High-energy gaming aesthetic with pixel art and arcade vibes",
  route: "/worlds/gaming",
  thumbnail: "/icons/worlds/gaming.svg",
  theme: {} as WorldManifest["theme"],
  animation: {
    engine: "gsap",
    pageTransition: { type: "slide", duration: 0.4 },
    scrollAnimations: { enabled: true, parallax: false, reveal: true, scrub: false },
    hoverEffects: { type: "scale", intensity: 1.1, duration: 0.15 },
    loadingAnimation: { type: "spinner", duration: 1 },
  },
  cursor: { type: "custom", size: 10, color: "#ff0000", blendMode: "normal" },
  typography: {
    headingFont: "Press Start 2P",
    bodyFont: "Exo 2",
    monoFont: "VT323",
    scale: 1.2,
  },
  metadata: {
    author: "Frontend Multiverse",
    version: "1.0.0",
    createdAt: "2026-01-01",
    tags: ["gaming", "pixel", "arcade"],
  },
};
