/**
 * useSplitText Hook
 *
 * Splits text into characters, words, or lines for animation.
 */

import { useRef, useState, useEffect, useCallback } from "react";
import { useAnimationConfig } from "./use-animation-config";
import type { UseSplitTextOptions, UseSplitTextReturn } from "../types/hooks";
import { gsap } from "gsap";
import { ANIMATION_DURATIONS, ANIMATION_EASINGS } from "../constants";

export function useSplitText(options: UseSplitTextOptions = {}): UseSplitTextReturn {
  const { type: _type = "chars" } = options;

  const { enabled, durationMultiplier } = useAnimationConfig();
  const ref = useRef<HTMLElement | null>(null);
  const [chars, setChars] = useState<HTMLElement[]>([]);
  const [words, setWords] = useState<HTMLElement[]>([]);
  const [lines, setLines] = useState<HTMLElement[]>([]);
  const ctxRef = useRef<gsap.Context | null>(null);
  const originalContentRef = useRef<string>("");

  useEffect(() => {
    if (!ref.current || !enabled) return;

    const element = ref.current;
    originalContentRef.current = element.innerHTML;

    const text = element.textContent || "";

    const charElements: HTMLElement[] = [];
    const wordElements: HTMLElement[] = [];

    element.innerHTML = "";

    const splitWords = text.split(/\s+/);

    splitWords.forEach((word, wordIndex) => {
      const wordSpan = document.createElement("span");
      wordSpan.style.display = "inline-block";
      wordSpan.style.whiteSpace = "nowrap";

      const splitChars = word.split("");
      splitChars.forEach((char) => {
        const charSpan = document.createElement("span");
        charSpan.textContent = char;
        charSpan.style.display = "inline-block";
        charElements.push(charSpan);
        wordSpan.appendChild(charSpan);
      });

      wordElements.push(wordSpan);
      element.appendChild(wordSpan);

      if (wordIndex < splitWords.length - 1) {
        const space = document.createTextNode(" ");
        element.appendChild(space);
      }
    });

    setChars(charElements);
    setWords(wordElements);

    const lineHeight = parseInt(getComputedStyle(element).lineHeight) || 24;
    const lineCount = Math.ceil(element.offsetHeight / lineHeight);
    const lineElements: HTMLElement[] = [];
    for (let i = 0; i < lineCount; i++) {
      lineElements.push(element);
    }
    setLines(lineElements);

    return () => {
      ctxRef.current?.revert();
      if (ref.current && originalContentRef.current) {
        ref.current.innerHTML = originalContentRef.current;
      }
    };
  }, [enabled]);

  const animateChars = useCallback(
    (from?: Record<string, unknown>, to?: Record<string, unknown>) => {
      if (!enabled || chars.length === 0 || !ref.current) return;

      ctxRef.current?.revert();
      ctxRef.current = gsap.context(() => {
        gsap.fromTo(
          chars,
          from || { y: 20, opacity: 0 },
          {
            ...to,
            y: 0,
            opacity: 1,
            duration: ANIMATION_DURATIONS.normal * durationMultiplier,
            stagger: 0.02,
            ease: ANIMATION_EASINGS.easeOut,
          },
        );
      }, ref);
    },
    [enabled, chars, durationMultiplier],
  );

  const animateWords = useCallback(
    (from?: Record<string, unknown>, to?: Record<string, unknown>) => {
      if (!enabled || words.length === 0 || !ref.current) return;

      ctxRef.current?.revert();
      ctxRef.current = gsap.context(() => {
        gsap.fromTo(
          words,
          from || { y: 30, opacity: 0 },
          {
            ...to,
            y: 0,
            opacity: 1,
            duration: ANIMATION_DURATIONS.normal * durationMultiplier,
            stagger: 0.08,
            ease: ANIMATION_EASINGS.easeOut,
          },
        );
      }, ref);
    },
    [enabled, words, durationMultiplier],
  );

  const animateLines = useCallback(
    (from?: Record<string, unknown>, to?: Record<string, unknown>) => {
      if (!enabled || lines.length === 0 || !ref.current) return;

      ctxRef.current?.revert();
      ctxRef.current = gsap.context(() => {
        gsap.fromTo(
          lines,
          from || { y: 40, opacity: 0 },
          {
            ...to,
            y: 0,
            opacity: 1,
            duration: ANIMATION_DURATIONS.normal * durationMultiplier,
            stagger: 0.15,
            ease: ANIMATION_EASINGS.easeOut,
          },
        );
      }, ref);
    },
    [enabled, lines, durationMultiplier],
  );

  return {
    ref,
    chars,
    words,
    lines,
    animateChars,
    animateWords,
    animateLines,
  };
}
