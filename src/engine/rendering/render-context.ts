/**
 * Rendering Pipeline — React Context
 */

import { createContext } from "react";
import type { RenderContextValue } from "./types";

export const RenderContext = createContext<RenderContextValue | null>(null);
