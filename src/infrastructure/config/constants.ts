export const APP = {
  NAME: "Frontend Multiverse",
  SHORT_NAME: "Multiverse",
  VERSION: "1.0.0",
} as const;

export const STORAGE_KEYS = {
  THEME: "multiverse-theme",
  SETTINGS: "multiverse-settings",
  FEATURE_FLAGS: "multiverse-feature-flags",
} as const;

export const TIMEOUTS = {
  LAZY_LOAD_WARNING: 3000,
  ERROR_RESET_DELAY: 4000,
} as const;

export const LOG_PREFIXES = {
  APP: "[Multiverse]",
  ERROR: "[Multiverse:Error]",
  WARN: "[Multiverse:Warn]",
} as const;
