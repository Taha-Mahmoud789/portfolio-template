import { STORAGE_KEYS } from "./constants";
import { isDevelopment } from "./env";
import type { FeatureFlagsConfig } from "../types";

const DEFAULT_FLAGS: FeatureFlagsConfig = {
  "debug-panel": {
    key: "debug-panel",
    description: "Show debug information overlay",
    enabled: false,
  },
  "analytics": {
    key: "analytics",
    description: "Enable analytics event tracking",
    enabled: false,
  },
  "performance-monitor": {
    key: "performance-monitor",
    description: "Enable performance metrics collection",
    enabled: isDevelopment(),
  },
  "3d-worlds": {
    key: "3d-worlds",
    description: "Enable 3D WebGL world rendering",
    enabled: true,
  },
  "sound-effects": {
    key: "sound-effects",
    description: "Enable sound effects and audio feedback",
    enabled: false,
  },
};

const flags: FeatureFlagsConfig = { ...DEFAULT_FLAGS };

type FlagSubscriber = (key: string, enabled: boolean) => void;
const subscribers = new Set<FlagSubscriber>();

function loadOverrides(): void {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.FEATURE_FLAGS);
    if (stored) {
      const overrides = JSON.parse(stored) as Partial<Record<string, boolean>>;
      for (const [key, enabled] of Object.entries(overrides)) {
        if (flags[key]) {
          flags[key] = { ...flags[key], enabled: Boolean(enabled) };
        }
      }
    }
  } catch {
    // localStorage unavailable
  }
}

function persistFlags(): void {
  try {
    const state: Record<string, boolean> = {};
    for (const [key, flag] of Object.entries(flags)) {
      state[key] = flag.enabled;
    }
    localStorage.setItem(STORAGE_KEYS.FEATURE_FLAGS, JSON.stringify(state));
  } catch {
    // localStorage unavailable
  }
}

export function initFeatureFlags(): void {
  loadOverrides();
}

export function isFeatureEnabled(key: string): boolean {
  const flag = flags[key];
  if (!flag) return false;
  return flag.enabled;
}

export function setFeatureFlag(key: string, enabled: boolean): void {
  if (!flags[key]) return;
  flags[key] = { ...flags[key], enabled };
  persistFlags();
  for (const subscriber of subscribers) {
    subscriber(key, enabled);
  }
}

export function onFeatureFlagChange(callback: FlagSubscriber): () => void {
  subscribers.add(callback);
  return () => { subscribers.delete(callback); };
}
