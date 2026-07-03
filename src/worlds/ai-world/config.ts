import type { WorldManifest } from "@/types/world";

export const AI_WORLD_CONFIG: WorldManifest = {
  id: "ai-world",
  name: "AI World",
  description: "Futuristic AI aesthetic with neural networks and fluid visuals",
  route: "/worlds/ai",
  thumbnail: "/icons/worlds/ai.svg",
  theme: {} as WorldManifest["theme"],
  animation: {
    engine: "framer",
    pageTransition: { type: "fade", duration: 0.6 },
    scrollAnimations: { enabled: true, parallax: true, reveal: true, scrub: false },
    hoverEffects: { type: "glow", intensity: 1.5, duration: 0.3 },
    loadingAnimation: { type: "custom", duration: 1.8 },
  },
  cursor: { type: "custom", size: 14, color: "#7c3aed", blendMode: "screen" },
  typography: {
    headingFont: "Space Grotesk",
    bodyFont: "Inter",
    monoFont: "Fira Code",
    scale: 1,
  },
  metadata: {
    author: "Frontend Multiverse",
    version: "1.0.0",
    createdAt: "2026-01-01",
    tags: ["ai", "neural", "futuristic"],
  },
};
