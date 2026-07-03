import type { AppConfig, AppEnvironment } from "../types";

const rawEnv = import.meta.env;

let cachedConfig: AppConfig | null = null;

function resolveEnvironment(): AppEnvironment {
  const mode = rawEnv.MODE || "development";
  if (mode === "production") return "production";
  if (mode === "staging") return "staging";
  return "development";
}

function parseBoolean(value: string | undefined): boolean {
  if (!value) return false;
  return ["true", "1", "yes"].includes(value.toLowerCase().trim());
}

function buildConfig(): AppConfig {
  return Object.freeze({
    title: rawEnv.VITE_APP_TITLE || "Frontend Multiverse",
    version: "1.0.0",
    environment: resolveEnvironment(),
    baseUrl: rawEnv.VITE_BASE_URL || "/",
    debug: parseBoolean(rawEnv.VITE_DEBUG_MODE),
    analyticsEnabled: parseBoolean(rawEnv.VITE_ANALYTICS_ENABLED),
  });
}

export function getAppConfig(): AppConfig {
  cachedConfig ??= buildConfig();
  return cachedConfig;
}

export function isDevelopment(): boolean {
  return getAppConfig().environment === "development";
}

export function isProduction(): boolean {
  return getAppConfig().environment === "production";
}
