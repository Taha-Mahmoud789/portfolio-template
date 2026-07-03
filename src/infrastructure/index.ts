// Config
export { getAppConfig, isDevelopment, isProduction } from "./config";
export { APP, STORAGE_KEYS, TIMEOUTS, LOG_PREFIXES } from "./config";
export { METADATA, getDocumentTitle, applyDocumentMetadata } from "./config";
export { initFeatureFlags, isFeatureEnabled, setFeatureFlag, onFeatureFlagChange } from "./config";

// Error
export { ErrorBoundary, ErrorFallback } from "./error";
export { initGlobalErrorHandler, destroyGlobalErrorHandler, reportError } from "./error";

// Hooks
export { useAppConfig, useFeatureFlag, useAnimationConfig } from "./hooks";

// Loading
export { LoadingBoundary, createLazyComponent, preloadAll } from "./loading";
export type { LazyComponent } from "./loading";

// Providers
export { EffectsProvider } from "./providers";

// Store
export { useAppSettingsStore } from "./store";
export type { AppSettingsStore } from "./store";

// App Shell
export { AppShell } from "./app-shell";

// Bootstrap
export { bootstrap } from "./bootstrap";

// Types
export type {
  AppEnvironment,
  AppConfig,
  FeatureFlag,
  FeatureFlagsConfig,
  ErrorHandlerConfig,
  BootstrapResult,
} from "./types";
