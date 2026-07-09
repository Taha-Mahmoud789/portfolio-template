/**
 * Application Bootstrap
 *
 * Runs before React renders. Sets up global systems.
 */

import { isDevelopment } from "../config/env";
import { LOG_PREFIXES } from "../config/constants";

export function bootstrap(): void {
  try {
    if (isDevelopment()) {
      console.log(`${LOG_PREFIXES.APP} initialized`);
    }
  } catch (error) {
    console.error(`${LOG_PREFIXES.ERROR} Bootstrap failed:`, error);
  }
}
