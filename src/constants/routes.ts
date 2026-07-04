export const ROUTES = {
  HOME: "/",
  WORLD_INDEX: "/worlds",
  MULTIVERSE: "/multiverse",
  PROJECT_UNIVERSE: "/multiverse/projects",
  CODE_UNIVERSE: "/multiverse/code",
  CREATIVE_UNIVERSE: "/multiverse/creative",

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
