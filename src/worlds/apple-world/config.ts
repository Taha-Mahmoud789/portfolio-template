import type { WorldManifest } from "@/types/world";

export const APPLE_WORLD_CONFIG: WorldManifest = {
  id: "apple-world",
  name: "Apple World",
  description: "Minimalist design with precision animations and glass morphism",
  route: "/worlds/apple",
  thumbnail: "/icons/worlds/apple.svg",
  theme: {} as WorldManifest["theme"],
  animation: {
    engine: "framer",
    pageTransition: { type: "fade", duration: 0.5 },
    scrollAnimations: { enabled: true, parallax: false, reveal: true, scrub: false },
    hoverEffects: { type: "scale", intensity: 1.05, duration: 0.3 },
    loadingAnimation: { type: "skeleton", duration: 0.8 },
  },
  cursor: { type: "custom", size: 8, color: "#000000", blendMode: "difference" },
  typography: {
    headingFont: "SF Pro Display",
    bodyFont: "SF Pro Text",
    monoFont: "SF Mono",
    scale: 1,
  },
  metadata: {
    author: "Frontend Multiverse",
    version: "1.0.0",
    createdAt: "2026-01-01",
    tags: ["minimal", "clean", "apple"],
  },
};
