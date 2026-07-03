import type { WorldId } from "@/types/world";

export interface NavigationItem {
  id: WorldId;
  label: string;
  route: string;
  description: string;
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { id: "apple-world", label: "Apple", route: "/worlds/apple", description: "Minimalist design" },
  {
    id: "cyberpunk-world",
    label: "Cyberpunk",
    route: "/worlds/cyberpunk",
    description: "Neon dystopia",
  },
  { id: "space-world", label: "Space", route: "/worlds/space", description: "Cosmic exploration" },
  { id: "gaming-world", label: "Gaming", route: "/worlds/gaming", description: "Arcade vibes" },
  { id: "ai-world", label: "AI", route: "/worlds/ai", description: "Neural networks" },
  {
    id: "editorial-world",
    label: "Editorial",
    route: "/worlds/editorial",
    description: "Typography",
  },
  { id: "liquid-world", label: "Liquid", route: "/worlds/liquid", description: "Fluid motion" },
  {
    id: "brutalist-world",
    label: "Brutalist",
    route: "/worlds/brutalist",
    description: "Raw design",
  },
  { id: "retro-world", label: "Retro", route: "/worlds/retro", description: "Nostalgic computing" },
  {
    id: "experimental-world",
    label: "Experimental",
    route: "/worlds/experimental",
    description: "Boundary pushing",
  },
];
