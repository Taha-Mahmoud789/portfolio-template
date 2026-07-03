import type { WorldManifest } from "@/types/world";

export const BRUTALIST_WORLD_CONFIG: WorldManifest = {
  id: "brutalist-world",
  name: "Brutalist World",
  description: "Raw, unpolished design with bold typography and stark contrasts",
  route: "/worlds/brutalist",
  thumbnail: "/icons/worlds/brutalist.svg",
  theme: {} as WorldManifest["theme"],
  animation: {
    engine: "gsap",
    pageTransition: { type: "custom", duration: 0.3 },
    scrollAnimations: { enabled: true, parallax: false, reveal: true, scrub: false },
    hoverEffects: { type: "rotate", intensity: 5, duration: 0.1 },
    loadingAnimation: { type: "spinner", duration: 0.5 },
  },
  cursor: { type: "none", size: 0, color: "#000000", blendMode: "normal" },
  typography: {
    headingFont: "Anton",
    bodyFont: "Space Mono",
    monoFont: "Courier Prime",
    scale: 1.3,
  },
  metadata: {
    author: "Frontend Multiverse",
    version: "1.0.0",
    createdAt: "2026-01-01",
    tags: ["brutalist", "raw", "bold"],
  },
};
