/**
 * CSS Variable Generator
 *
 * Converts token objects into CSS custom property strings.
 * This is the bridge between TypeScript tokens and CSS.
 */

import { color } from "../tokens/semantic/color";
import { typography } from "../tokens/semantic/typography";
import { spacingSemantic } from "../tokens/semantic/spacing";
import { radiusSemantic } from "../tokens/semantic/radius";
import { elevation, blurSemantic, glass } from "../tokens/semantic/elevation";
import { motion } from "../tokens/semantic/motion";
import { borderSemantic } from "../tokens/semantic/border";
import { opacitySemantic } from "../tokens/semantic/opacity";
import { size } from "../tokens/semantic/size";
import { grid } from "../tokens/semantic/grid";
import { zIndexSemantic } from "../tokens/semantic/z-index";

function flattenToCssVars(
  tokens: Record<string, string | number>,
  prefix: string,
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(tokens)) {
    result[`--${prefix}-${key}`] = String(value);
  }
  return result;
}

export function generateColorVars(): Record<string, string> {
  return flattenToCssVars(color, "color");
}

export function generateTypographyVars(): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const [key, value] of Object.entries(typography)) {
    if (Array.isArray(value)) {
      const sizeVal = value[0] as string;
      const lineHeightObj = value[1] as { lineHeight?: string };
      vars[`--${key}`] = sizeVal;
      vars[`--${key}-line-height`] = lineHeightObj.lineHeight ?? "";
    } else {
      if (typeof value === "string") {
        vars[`--${key}`] = value;
      }
    }
  }
  return vars;
}

export function generateSpacingVars(): Record<string, string> {
  return flattenToCssVars(spacingSemantic, "spacing");
}

export function generateRadiusVars(): Record<string, string> {
  return flattenToCssVars(radiusSemantic, "radius");
}

export function generateElevationVars(): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const [key, value] of Object.entries(elevation)) {
    vars[`--elevation-${key}`] = value;
  }
  for (const [key, value] of Object.entries(blurSemantic)) {
    vars[`--blur-${key}`] = value;
  }
  for (const [key, value] of Object.entries(glass)) {
    vars[`--glass-${key}`] = value;
  }
  return vars;
}

export function generateMotionVars(): Record<string, string> {
  return flattenToCssVars(motion, "motion");
}

export function generateBorderVars(): Record<string, string> {
  return flattenToCssVars(borderSemantic, "border");
}

export function generateOpacityVars(): Record<string, string> {
  return flattenToCssVars(opacitySemantic, "opacity");
}

export function generateSizeVars(): Record<string, string> {
  return flattenToCssVars(size, "size");
}

export function generateGridVars(): Record<string, string> {
  return flattenToCssVars(grid, "grid");
}

export function generateZIndexVars(): Record<string, string> {
  return flattenToCssVars(zIndexSemantic, "z");
}

/**
 * Generates ALL CSS custom properties as a single object.
 */
export function generateAllVars(): Record<string, string> {
  return {
    ...generateColorVars(),
    ...generateTypographyVars(),
    ...generateSpacingVars(),
    ...generateRadiusVars(),
    ...generateElevationVars(),
    ...generateMotionVars(),
    ...generateBorderVars(),
    ...generateOpacityVars(),
    ...generateSizeVars(),
    ...generateGridVars(),
    ...generateZIndexVars(),
  };
}

/**
 * Generates a CSS string from all tokens.
 * Output format: `:root { --token-name: value; ... }`
 */
export function generateCssString(): string {
  const vars = generateAllVars();
  const lines = Object.entries(vars)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join("\n");
  return `:root {\n${lines}\n}`;
}
