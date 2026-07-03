import type { WorldManifest } from "@/types/world";

export const EXPERIMENTAL_WORLD_CONFIG: WorldManifest = {
  id: "experimental-world",
  name: "Experimental World",
  description: "Pushing boundaries with unconventional layouts and interactions",
  route: "/worlds/experimental",
  thumbnail: "/icons/worlds/experimental.svg",
  theme: {} as WorldManifest["theme"],
  animation: {
    engine: "gsap",
    pageTransition: { type: "custom", duration: 1.5 },
    scrollAnimations: { enabled: true, parallax: true, reveal: true, scrub: true },
    hoverEffects: { type: "magnetic", intensity: 3, duration: 0.6 },
    loadingAnimation: { type: "custom", duration: 3 },
  },
  cursor: { type: "custom", size: 32, color: "#f59e0b", blendMode: "difference" },
  typography: {
    headingFont: "Syne",
    bodyFont: "General Sans",
    monoFont: "Fira Code",
    scale: 1,
  },
  metadata: {
    author: "Frontend Multiverse",
    version: "1.0.0",
    createdAt: "2026-01-01",
    tags: ["experimental", "avant-garde", "experimental"],
  },
};
