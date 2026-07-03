/**
 * Spatial Object System — React Context
 */

import { createContext } from "react";
import type { ObjectManager } from "./object-manager";
import type { ObjectManagerState } from "./types";

export interface SpatialContextValue {
  readonly manager: ObjectManager;
  readonly state: ObjectManagerState;
}

export const SpatialContext = createContext<SpatialContextValue | null>(null);
