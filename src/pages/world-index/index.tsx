/**
 * World Index Page
 *
 * Displays all available worlds using the Engine Portal grid.
 * Each world is represented as a PortalCard with proper metadata,
 * backgrounds, and navigation.
 */

import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router";
import { PortalGrid } from "@/engine/portal";
import type { PortalDefinition } from "@/engine/portal";
import { WORLD_ROUTES } from "@/constants/routes";

const WORLD_PORTALS: PortalDefinition[] = [
  {
    id: "space",
    worldId: "space-world",
    title: "Space",
    subtitle: "Explore the Infinite",
    description: "Vast cosmic environments with procedural stars, nebulae, and zero-gravity physics.",
    theme: "space",
    background: {
      type: "gradient",
      value: "linear-gradient(160deg, rgba(15,23,42,0.95) 0%, rgba(30,58,95,0.6) 50%, rgba(99,102,241,0.15) 100%)",
      fallbackColor: "#0f172a",
    },
    icon: { type: "emoji", emoji: "✦" },
    accent: {
      color: "#818cf8",
      glow: "rgba(99,102,241,0.25)",
      gradient: "linear-gradient(135deg, #818cf8, #6366f1)",
      shadow: "0 0 20px rgba(99,102,241,0.3)",
    },
    animationPreset: "bloom",
    transitionPreset: "iris",
    destinationRoute: WORLD_ROUTES.SPACE,
    status: "active",
    order: 1,
    metadata: { author: "FM", version: "1.0", createdAt: "2025-01-01", tags: ["3d", "three.js", "cosmic"], category: "interactive", featured: true },
  },
  {
    id: "apple",
    worldId: "apple-world",
    title: "Apple",
    subtitle: "Designed to Feel Effortless",
    description: "Precision-crafted interfaces with liquid metal, frosted glass, and perfect typography.",
    theme: "apple",
    background: {
      type: "gradient",
      value: "linear-gradient(160deg, rgba(248,250,252,0.1) 0%, rgba(226,232,240,0.06) 50%, rgba(200,210,220,0.1) 100%)",
      fallbackColor: "#18181b",
    },
    icon: { type: "emoji", emoji: "◆" },
    accent: {
      color: "#e2e8f0",
      glow: "rgba(226,232,240,0.18)",
      gradient: "linear-gradient(135deg, #e2e8f0, #cbd5e1)",
      shadow: "0 0 20px rgba(226,232,240,0.2)",
    },
    animationPreset: "fade",
    transitionPreset: "dissolve",
    destinationRoute: WORLD_ROUTES.APPLE,
    status: "coming-soon",
    order: 2,
    metadata: { author: "FM", version: "1.0", createdAt: "2025-01-01", tags: ["minimal", "glass", "typography"], category: "minimal", featured: false },
  },
  {
    id: "cyberpunk",
    worldId: "cyberpunk-world",
    title: "Cyberpunk",
    subtitle: "Enter the Neon Future",
    description: "Electric cityscapes with glitch aesthetics, neon light leaks, and raw energy.",
    theme: "cyberpunk",
    background: {
      type: "gradient",
      value: "linear-gradient(160deg, rgba(88,28,135,0.6) 0%, rgba(236,72,153,0.3) 50%, rgba(6,182,212,0.15) 100%)",
      fallbackColor: "#581c87",
    },
    icon: { type: "emoji", emoji: "⬡" },
    accent: {
      color: "#ec4899",
      glow: "rgba(236,72,153,0.2)",
      gradient: "linear-gradient(135deg, #ec4899, #8b5cf6)",
      shadow: "0 0 20px rgba(236,72,153,0.3)",
    },
    animationPreset: "glitch",
    transitionPreset: "particle-burst",
    destinationRoute: WORLD_ROUTES.CYBERPUNK,
    status: "coming-soon",
    order: 3,
    metadata: { author: "FM", version: "1.0", createdAt: "2025-01-01", tags: ["neon", "glitch", "city"], category: "futuristic", featured: false },
  },
  {
    id: "gaming",
    worldId: "gaming-world",
    title: "Gaming",
    subtitle: "Enter the Arena",
    description: "Immersive gaming experiences with dynamic lighting and particle effects.",
    theme: "gaming",
    background: {
      type: "gradient",
      value: "linear-gradient(160deg, rgba(20,83,45,0.6) 0%, rgba(34,197,94,0.3) 50%, rgba(16,185,129,0.15) 100%)",
      fallbackColor: "#14532d",
    },
    icon: { type: "emoji", emoji: "🎮" },
    accent: {
      color: "#22c55e",
      glow: "rgba(34,197,94,0.2)",
      gradient: "linear-gradient(135deg, #22c55e, #10b981)",
      shadow: "0 0 20px rgba(34,197,94,0.3)",
    },
    animationPreset: "scale",
    transitionPreset: "zoom-in",
    destinationRoute: WORLD_ROUTES.GAMING,
    status: "coming-soon",
    order: 4,
    metadata: { author: "FM", version: "1.0", createdAt: "2025-01-01", tags: ["particles", "lighting", "interactive"], category: "interactive", featured: false },
  },
  {
    id: "ai",
    worldId: "ai-world",
    title: "AI",
    subtitle: "The Neural Frontier",
    description: "Fluid visualizations of neural networks and machine learning processes.",
    theme: "ai",
    background: {
      type: "gradient",
      value: "linear-gradient(160deg, rgba(88,28,135,0.6) 0%, rgba(168,85,247,0.3) 50%, rgba(139,92,246,0.15) 100%)",
      fallbackColor: "#581c87",
    },
    icon: { type: "emoji", emoji: "🧠" },
    accent: {
      color: "#a855f7",
      glow: "rgba(168,85,247,0.2)",
      gradient: "linear-gradient(135deg, #a855f7, #7c3aed)",
      shadow: "0 0 20px rgba(168,85,247,0.3)",
    },
    animationPreset: "morph",
    transitionPreset: "morph-expand",
    destinationRoute: WORLD_ROUTES.AI,
    status: "coming-soon",
    order: 5,
    metadata: { author: "FM", version: "1.0", createdAt: "2025-01-01", tags: ["neural", "fluid", "data"], category: "futuristic", featured: false },
  },
  {
    id: "editorial",
    worldId: "editorial-world",
    title: "Editorial",
    subtitle: "The Art of Storytelling",
    description: "Typography-driven layouts with cinematic transitions and editorial precision.",
    theme: "editorial",
    background: {
      type: "gradient",
      value: "linear-gradient(160deg, rgba(120,53,15,0.6) 0%, rgba(251,191,36,0.3) 50%, rgba(245,158,11,0.15) 100%)",
      fallbackColor: "#78350f",
    },
    icon: { type: "emoji", emoji: "📖" },
    accent: {
      color: "#fbbf24",
      glow: "rgba(251,191,36,0.2)",
      gradient: "linear-gradient(135deg, #fbbf24, #f59e0b)",
      shadow: "0 0 20px rgba(251,191,36,0.3)",
    },
    animationPreset: "slide",
    transitionPreset: "page-turn",
    destinationRoute: WORLD_ROUTES.EDITORIAL,
    status: "coming-soon",
    order: 6,
    metadata: { author: "FM", version: "1.0", createdAt: "2025-01-01", tags: ["typography", "layout", "storytelling"], category: "minimal", featured: false },
  },
  {
    id: "liquid",
    worldId: "liquid-world",
    title: "Liquid",
    subtitle: "Fluid Dynamics",
    description: "Organic flowing interfaces with fluid simulations and morphing transitions.",
    theme: "liquid",
    background: {
      type: "gradient",
      value: "linear-gradient(160deg, rgba(22,78,99,0.6) 0%, rgba(6,182,212,0.3) 50%, rgba(34,211,238,0.15) 100%)",
      fallbackColor: "#164e63",
    },
    icon: { type: "emoji", emoji: "💧" },
    accent: {
      color: "#06b6d4",
      glow: "rgba(6,182,212,0.2)",
      gradient: "linear-gradient(135deg, #06b6d4, #0891b2)",
      shadow: "0 0 20px rgba(6,182,212,0.3)",
    },
    animationPreset: "wave",
    transitionPreset: "dissolve",
    destinationRoute: WORLD_ROUTES.LIQUID,
    status: "coming-soon",
    order: 7,
    metadata: { author: "FM", version: "1.0", createdAt: "2025-01-01", tags: ["fluid", "organic", "simulation"], category: "cosmic", featured: false },
  },
  {
    id: "brutalist",
    worldId: "brutalist-world",
    title: "Brutalist",
    subtitle: "Raw and Unpolished",
    description: "Bold typography, raw aesthetics, and unapologetic design.",
    theme: "brutalist",
    background: {
      type: "gradient",
      value: "linear-gradient(160deg, rgba(127,29,29,0.6) 0%, rgba(239,68,68,0.3) 50%, rgba(220,38,38,0.15) 100%)",
      fallbackColor: "#7f1d1d",
    },
    icon: { type: "emoji", emoji: "⬛" },
    accent: {
      color: "#ef4444",
      glow: "rgba(239,68,68,0.2)",
      gradient: "linear-gradient(135deg, #ef4444, #dc2626)",
      shadow: "0 0 20px rgba(239,68,68,0.3)",
    },
    animationPreset: "glitch",
    transitionPreset: "none",
    destinationRoute: WORLD_ROUTES.BRUTALIST,
    status: "coming-soon",
    order: 8,
    metadata: { author: "FM", version: "1.0", createdAt: "2025-01-01", tags: ["raw", "bold", "typography"], category: "minimal", featured: false },
  },
  {
    id: "retro",
    worldId: "retro-world",
    title: "Retro",
    subtitle: "Nostalgia Reimagined",
    description: "Pixel-perfect aesthetics meets modern web technology.",
    theme: "retro",
    background: {
      type: "gradient",
      value: "linear-gradient(160deg, rgba(124,45,18,0.6) 0%, rgba(251,146,60,0.3) 50%, rgba(249,115,22,0.15) 100%)",
      fallbackColor: "#7c2d12",
    },
    icon: { type: "emoji", emoji: "🕹️" },
    accent: {
      color: "#fb923c",
      glow: "rgba(251,146,60,0.2)",
      gradient: "linear-gradient(135deg, #fb923c, #f97316)",
      shadow: "0 0 20px rgba(251,146,60,0.3)",
    },
    animationPreset: "scale",
    transitionPreset: "slide-up",
    destinationRoute: WORLD_ROUTES.RETRO,
    status: "coming-soon",
    order: 9,
    metadata: { author: "FM", version: "1.0", createdAt: "2025-01-01", tags: ["pixel", "nostalgia", "retro"], category: "interactive", featured: false },
  },
  {
    id: "experimental",
    worldId: "experimental-world",
    title: "Experimental",
    subtitle: "Pushing Boundaries",
    description: "Breaking the rules of web design with avant-garde interactions.",
    theme: "experimental",
    background: {
      type: "gradient",
      value: "linear-gradient(160deg, rgba(88,28,135,0.6) 0%, rgba(168,85,247,0.3) 50%, rgba(192,132,252,0.15) 100%)",
      fallbackColor: "#581c87",
    },
    icon: { type: "emoji", emoji: "🧪" },
    accent: {
      color: "#c084fc",
      glow: "rgba(192,132,252,0.2)",
      gradient: "linear-gradient(135deg, #c084fc, #a855f7)",
      shadow: "0 0 20px rgba(192,132,252,0.3)",
    },
    animationPreset: "rotate",
    transitionPreset: "morph-expand",
    destinationRoute: WORLD_ROUTES.EXPERIMENTAL,
    status: "coming-soon",
    order: 10,
    metadata: { author: "FM", version: "1.0", createdAt: "2025-01-01", tags: ["experimental", "avant-garde", "interactive"], category: "cosmic", featured: false },
  },
];

export default function WorldIndexPage() {
  const navigate = useNavigate();

  const handleSelect = useCallback(
    (id: string) => {
      const portal = WORLD_PORTALS.find((p) => p.id === id);
      if (portal?.status === "active") {
        void navigate(portal.destinationRoute);
      }
    },
    [navigate],
  );

  const handleActivate = useCallback(
    (id: string) => {
      const portal = WORLD_PORTALS.find((p) => p.id === id);
      if (portal?.status === "active") {
        void navigate(portal.destinationRoute);
      }
    },
    [navigate],
  );

  const sortedPortals = useMemo(
    () => [...WORLD_PORTALS].sort((a, b) => a.order - b.order),
    [],
  );

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "radial-gradient(ellipse 80% 70% at 50% 45%, rgba(8,8,20,1) 0%, rgba(3,3,10,1) 100%)",
        padding: "clamp(2rem, 5vw, 4rem)",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "clamp(2rem, 5vh, 4rem)" }}>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "clamp(0.5625rem, 0.75vw, 0.6875rem)",
            fontWeight: 400,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.3)",
            display: "block",
            marginBottom: "clamp(0.75rem, 1.5vw, 1rem)",
          }}
        >
          Frontend Multiverse
        </span>
        <h1
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 700,
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
            color: "#f0f0f5",
            margin: 0,
          }}
        >
          All Worlds
        </h1>
      </div>

      {/* Portal Grid */}
      <PortalGrid
        portals={sortedPortals}
        columns={3}
        gap="1.5rem"
        onSelect={handleSelect}
        onActivate={handleActivate}
      />
    </div>
  );
}