/**
 * Semantic Z-Index Tokens
 *
 * Contextual z-index layer assignments.
 * Components USE these tokens. NEVER use raw numbers.
 */

import { zIndex } from "../primitives/z-index";

export const zIndexSemantic = {
  base: zIndex.base,
  raised: zIndex.raised,
  dropdown: zIndex.dropdown,
  sticky: zIndex.sticky,
  overlay: zIndex.overlay,
  modal: zIndex.modal,
  toast: zIndex.toast,
  tooltip: zIndex.tooltip,
  cursor: zIndex.cursor,
  max: zIndex.max,
} as const;

export type ZIndexToken = keyof typeof zIndexSemantic;
