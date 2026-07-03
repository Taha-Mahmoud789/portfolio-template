import type { ComponentType, LazyExoticComponent } from "react";
import type { WorldTheme } from "@/types/theme";
import type { WorldAnimationConfig } from "@/types/animation";

export type WorldId =
  | "apple-world"
  | "cyberpunk-world"
  | "space-world"
  | "gaming-world"
  | "ai-world"
  | "editorial-world"
  | "liquid-world"
  | "brutalist-world"
  | "retro-world"
  | "experimental-world";

export interface WorldManifest {
  id: WorldId;
  name: string;
  description: string;
  route: string;
  thumbnail: string;
  theme: WorldTheme;
  animation: WorldAnimationConfig;
  cursor: CursorConfig;
  typography: WorldTypographyConfig;
  metadata: WorldMetadata;
}

export interface WorldMetadata {
  author: string;
  version: string;
  createdAt: string;
  tags: string[];
}

export interface CursorConfig {
  type: "default" | "custom" | "none";
  component?: LazyExoticComponent<ComponentType>;
  size?: number;
  color?: string;
  blendMode?: string;
}

export interface WorldTypographyConfig {
  headingFont: string;
  bodyFont: string;
  monoFont: string;
  scale: number;
}
