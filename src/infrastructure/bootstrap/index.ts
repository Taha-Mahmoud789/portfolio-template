/**
 * Application Bootstrap
 *
 * Runs before React renders. Sets up global systems.
 * No timing metadata — nothing consumes it.
 */

import { initGlobalErrorHandler } from "../error/global-error-handler";
import { initFeatureFlags } from "../config/feature-flags";
import { applyDocumentMetadata } from "../config/metadata";
import { isDevelopment } from "../config/env";
import { LOG_PREFIXES } from "../config/constants";

export function bootstrap(): void {
  try {
    initGlobalErrorHandler();
    initFeatureFlags();
    applyDocumentMetadata();

    if (isDevelopment()) {
      console.log(`${LOG_PREFIXES.APP} initialized`);
    }
  } catch (error) {
    console.error(`${LOG_PREFIXES.ERROR} Bootstrap failed:`, error);
  }
}
