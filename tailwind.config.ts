import type { Config } from "tailwindcss";
import { color } from "./src/theme/tokens/semantic/color";
import { typography } from "./src/theme/tokens/semantic/typography";
import { spacingSemantic } from "./src/theme/tokens/semantic/spacing";
import { radiusSemantic } from "./src/theme/tokens/semantic/radius";
import { elevation, blurSemantic } from "./src/theme/tokens/semantic/elevation";
import { motion } from "./src/theme/tokens/semantic/motion";
import { borderSemantic } from "./src/theme/tokens/semantic/border";
import { opacitySemantic } from "./src/theme/tokens/semantic/opacity";
import { size } from "./src/theme/tokens/semantic/size";
import { grid } from "./src/theme/tokens/semantic/grid";
import { zIndexSemantic } from "./src/theme/tokens/semantic/z-index";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: color,
      fontFamily: {
        sans: [typography["font-sans"]],
        heading: [typography["font-heading"]],
        mono: [typography["font-mono"]],
      },
      fontSize: Object.fromEntries(
        Object.entries(typography)
          .filter(([k]) => k.startsWith("text-"))
          .map(([k, v]) => {
            const key = k.replace("text-", "");
            if (Array.isArray(v)) {
              return [key, v];
            }
            return [key, v];
          }),
      ),
      fontWeight: Object.fromEntries(
        Object.entries(typography)
          .filter(
            ([k]) =>
              k.startsWith("font-") && !["font-sans", "font-heading", "font-mono"].includes(k),
          )
          .map(([k, v]) => [k.replace("font-", ""), v]),
      ),
      letterSpacing: Object.fromEntries(
        Object.entries(typography)
          .filter(([k]) => k.startsWith("tracking-"))
          .map(([k, v]) => [k.replace("tracking-", ""), v]),
      ),
      lineHeight: Object.fromEntries(
        Object.entries(typography)
          .filter(([k]) => k.startsWith("leading-"))
          .map(([k, v]) => [k.replace("leading-", ""), v]),
      ),
      spacing: spacingSemantic,
      borderRadius: radiusSemantic,
      boxShadow: elevation,
      backdropBlur: blurSemantic,
      transitionDuration: Object.fromEntries(
        Object.entries(motion)
          .filter(([k]) => !k.startsWith("ease") && k !== "spring" && k !== "bounce")
          .map(([k, v]) => [k, v]),
      ),
      transitionTimingFunction: Object.fromEntries(
        Object.entries(motion)
          .filter(([k]) => k.startsWith("ease") || k === "spring" || k === "bounce")
          .map(([k, v]) => [k, v]),
      ),
      borderWidth: borderSemantic,
      opacity: opacitySemantic,
      width: size,
      height: size,
      minWidth: size,
      minHeight: size,
      maxWidth: size,
      maxHeight: size,
      gap: grid,
      margin: grid,
      zIndex: zIndexSemantic,
    },
  },
  plugins: [],
} satisfies Config;
