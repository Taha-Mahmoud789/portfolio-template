export const ROUTES = {
  HOME: "/",
  WORLD_INDEX: "/worlds",
  PROJECT: "/projects/:projectId",
  NOT_FOUND: "*",
} as const;

export const WORLD_ROUTES = {
  APPLE: "/worlds/apple",
  CYBERPUNK: "/worlds/cyberpunk",
  SPACE: "/worlds/space",
  GAMING: "/worlds/gaming",
  AI: "/worlds/ai",
  EDITORIAL: "/worlds/editorial",
  LIQUID: "/worlds/liquid",
  BRUTALIST: "/worlds/brutalist",
  RETRO: "/worlds/retro",
  EXPERIMENTAL: "/worlds/experimental",
} as const;
