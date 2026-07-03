import type { WorldManifest } from "@/types/world";

export const RETRO_WORLD_CONFIG: WorldManifest = {
  id: "retro-world",
  name: "Retro World",
  description: "Nostalgic retro computing with CRT effects and terminal aesthetics",
  route: "/worlds/retro",
  thumbnail: "/icons/worlds/retro.svg",
  theme: {} as WorldManifest["theme"],
  animation: {
    engine: "css",
    pageTransition: { type: "fade", duration: 0.8 },
    scrollAnimations: { enabled: true, parallax: false, reveal: true, scrub: false },
    hoverEffects: { type: "glow", intensity: 1, duration: 0.3 },
    loadingAnimation: { type: "custom", duration: 1.5 },
  },
  cursor: { type: "custom", size: 8, color: "#00ff00", blendMode: "screen" },
  typography: {
    headingFont: "VT323",
    bodyFont: "IBM Plex Mono",
    monoFont: "VT323",
    scale: 1,
  },
  metadata: {
    author: "Frontend Multiverse",
    version: "1.0.0",
    createdAt: "2026-01-01",
    tags: ["retro", "terminal", "crt"],
  },
};
