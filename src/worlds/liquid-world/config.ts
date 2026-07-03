import type { WorldManifest } from "@/types/world";

export const LIQUID_WORLD_CONFIG: WorldManifest = {
  id: "liquid-world",
  name: "Liquid World",
  description: "Fluid morphing shapes with WebGL shaders and organic motion",
  route: "/worlds/liquid",
  thumbnail: "/icons/worlds/liquid.svg",
  theme: {} as WorldManifest["theme"],
  animation: {
    engine: "three",
    pageTransition: { type: "custom", duration: 1.2 },
    scrollAnimations: { enabled: true, parallax: true, reveal: true, scrub: true },
    hoverEffects: { type: "magnetic", intensity: 2, duration: 0.5 },
    loadingAnimation: { type: "custom", duration: 2.5 },
  },
  cursor: { type: "custom", size: 20, color: "#06b6d4", blendMode: "screen" },
  typography: {
    headingFont: "Outfit",
    bodyFont: "Plus Jakarta Sans",
    monoFont: "JetBrains Mono",
    scale: 1,
  },
  metadata: {
    author: "Frontend Multiverse",
    version: "1.0.0",
    createdAt: "2026-01-01",
    tags: ["liquid", "fluid", "webgl"],
  },
};
