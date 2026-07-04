import { WORLDS } from "@/content";
export { WORLDS } from "@/content";
export type { WorldData as WorldConfig } from "@/content";

/** Get world by ID */
export function getWorld(id: string): (typeof WORLDS)[number] | undefined {
  return WORLDS.find((w) => w.id === id);
}

/** Get world index (0-based) */
export function getWorldIndex(id: string): number {
  return WORLDS.findIndex((w) => w.id === id);
}

/** Get next world (wraps around) */
export function getNextWorld(currentId: string): (typeof WORLDS)[number] | undefined {
  const idx = getWorldIndex(currentId);
  return WORLDS[(idx + 1) % WORLDS.length];
}

/** Get previous world (wraps around) */
export function getPrevWorld(currentId: string): (typeof WORLDS)[number] | undefined {
  const idx = getWorldIndex(currentId);
  return WORLDS[(idx - 1 + WORLDS.length) % WORLDS.length];
}
