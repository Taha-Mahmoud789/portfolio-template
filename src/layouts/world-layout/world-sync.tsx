/**
 * World Sync
 *
 * Synchronizes the URL route with the world store. Reads the world
 * ID from the current route and updates the global world state.
 *
 * Place inside BrowserRouter but outside Routes so it has access
 * to route context while remaining outside the route rendering.
 */

import { useEffect } from "react";
import { useParams } from "react-router";
import { useWorldStore } from "@/store/world-store";
import type { WorldId } from "@/types/world";

const VALID_WORLD_IDS = new Set<string>([
  "apple-world",
  "cyberpunk-world",
  "space-world",
  "gaming-world",
  "ai-world",
  "editorial-world",
  "liquid-world",
  "brutalist-world",
  "retro-world",
  "experimental-world",
]);

export function WorldSync() {
  const { worldId } = useParams<{ worldId: string }>();
  const setCurrentWorld = useWorldStore((s) => s.setCurrentWorld);

  useEffect(() => {
    if (worldId && VALID_WORLD_IDS.has(worldId)) {
      setCurrentWorld(worldId as WorldId);
    }
  }, [worldId, setCurrentWorld]);

  return null;
}
