import type { WorldManifest } from "@/types/world";

export const EDITORIAL_WORLD_CONFIG: WorldManifest = {
  id: "editorial-world",
  name: "Editorial World",
  description: "Magazine-inspired typography and editorial layout design",
  route: "/worlds/editorial",
  thumbnail: "/icons/worlds/editorial.svg",
  theme: {} as WorldManifest["theme"],
  animation: {
    engine: "framer",
    pageTransition: { type: "slide", duration: 0.5 },
    scrollAnimations: { enabled: true, parallax: false, reveal: true, scrub: false },
    hoverEffects: { type: "scale", intensity: 1.02, duration: 0.4 },
    loadingAnimation: { type: "skeleton", duration: 0.6 },
  },
  cursor: { type: "default", size: 24, color: "#000000", blendMode: "normal" },
  typography: {
    headingFont: "Playfair Display",
    bodyFont: "Source Serif 4",
    monoFont: "IBM Plex Mono",
    scale: 1,
  },
  metadata: {
    author: "Frontend Multiverse",
    version: "1.0.0",
    createdAt: "2026-01-01",
    tags: ["editorial", "typography", "magazine"],
  },
};
