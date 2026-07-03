import { getAppConfig } from "../config/env";
import type { AppConfig } from "../types";

/**
 * Returns the application configuration.
 * The config is a frozen object — no memoization needed.
 */
export function useAppConfig(): AppConfig {
  return getAppConfig();
}
