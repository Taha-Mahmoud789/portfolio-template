/**
 * useScrambleDecode Hook
 *
 * Text starts as random characters and decodes letter by letter
 * as you scroll, like a typewriter with encryption.
 * Uses GSAP ScrambleTextPlugin.
 */

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useAnimationConfig } from "./use-animation-config";

interface UseScrambleDecodeOptions {
  text: string;
  start?: string;
  end?: string;
  characters?: string;
}

export function useScrambleDecode(options: UseScrambleDecodeOptions) {
  const {
    text,
    start = "top 80%",
    end = "bottom 20%",
    characters = "!<>-_\\/[]{}—=+*^?#_abcdef0123456789",
  } = options;
  const { enabled } = useAnimationConfig();
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled || !text) return;

    el.textContent = text;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start,
        end,
        scrub: 0.8,
      },
    });

    tl.to(el, {
      duration: 1,
      ease: "none",
      scrambleText: {
        text,
        characters,
        revealLength: text.length,
      },
    } as gsap.TweenVars);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      el.textContent = text;
    };
  }, [enabled, text, start, end, characters]);

  return ref;
}
