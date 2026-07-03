/**
 * Space World Hooks
 *
 * World-specific hooks for the Space World.
 * Phase is the single source of truth.
 */

import { useEffect, useRef, useState } from "react";
import { useBaseWorldStore } from "@/worlds/base-world";
import type { ScrollIntent, IntentState } from "../types";
import { STAR_FIELD_CONFIG, DUST_FIELD_CONFIG, CONSTELLATIONS, DEPTH_LAYERS } from "../config";

// ============================================================================
// useSpaceWorld — read world state
// ============================================================================

export function useSpaceWorld() {
  const phase = useBaseWorldStore((s) => s.phase);
  const theme = useBaseWorldStore((s) => s.theme);
  const worldId = useBaseWorldStore((s) => s.worldId);
  const isMounted = useBaseWorldStore((s) => s.isMounted);
  const isReady = useBaseWorldStore((s) => s.isReady);
  const isActive = useBaseWorldStore((s) => s.isActive);

  return {
    phase,
    theme,
    worldId,
    isMounted,
    isReady,
    isActive,
    isSpaceWorld: worldId === "space-world",
  };
}

// ============================================================================
// useStarField — generate stars
// ============================================================================

function generateStars() {
  const stars: {
    id: number;
    x: number;
    y: number;
    size: number;
    brightness: number;
    twinkleSpeed: number;
    twinklePhase: number;
    color: string;
    depth: "near" | "mid" | "far";
  }[] = [];

  let id = 0;

  const { depthLayers, galacticCenter } = STAR_FIELD_CONFIG;

  for (const [depth, config] of Object.entries(depthLayers)) {
    for (let i = 0; i < config.count; i++) {
      const isNearGalaxy = Math.random() < (depth === "near" ? 0.3 : depth === "far" ? 0.5 : 0.4);
      const baseX = isNearGalaxy
        ? galacticCenter.x * 100 + (Math.random() - 0.5) * 40
        : Math.random() * 100;
      const baseY = isNearGalaxy
        ? galacticCenter.y * 100 + (Math.random() - 0.5) * 40
        : Math.random() * 100;

      stars.push({
        id: id++,
        x: baseX,
        y: baseY,
        size: config.sizeMin + Math.random() * (config.sizeMax - config.sizeMin),
        brightness:
          config.brightnessMin + Math.random() * (config.brightnessMax - config.brightnessMin),
        twinkleSpeed: config.twinkleMin + Math.random() * (config.twinkleMax - config.twinkleMin),
        twinklePhase: Math.random() * Math.PI * 2,
        color: config.color,
        depth: depth as "near" | "mid" | "far",
      });
    }
  }

  return stars;
}

export function useStarField() {
  const [stars] = useState(generateStars);
  return stars;
}

// ============================================================================
// useDustField — generate dust particles
// ============================================================================

function generateDust() {
  const { count, sizeMin, sizeMax, speedMin, speedMax } = DUST_FIELD_CONFIG;
  const particles: {
    id: number;
    x: number;
    y: number;
    size: number;
    opacity: number;
    speed: number;
    angle: number;
  }[] = [];

  for (let i = 0; i < count; i++) {
    particles.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: sizeMin + Math.random() * (sizeMax - sizeMin),
      opacity: 0.1 + Math.random() * 0.15,
      speed: speedMin + Math.random() * (speedMax - speedMin),
      angle: Math.random() * Math.PI * 2,
    });
  }

  return particles;
}

export function useDustField() {
  const [particles] = useState(generateDust);
  return particles;
}

// ============================================================================
// useConstellations — constellation data
// ============================================================================

export function useConstellations() {
  return CONSTELLATIONS;
}

// ============================================================================
// useDepthLayer — get layer config
// ============================================================================

export function useDepthLayer(layer: keyof typeof DEPTH_LAYERS) {
  return DEPTH_LAYERS[layer];
}

// ============================================================================
// useScrollIntent — detect scroll velocity and intent
// ============================================================================

export function useScrollIntent(): IntentState {
  const [state, setState] = useState<IntentState>({
    velocity: 0,
    intent: "idle",
    lastScrollTime: Date.now(),
  });

  const lastScrollY = useRef(0);
  const lastTime = useRef(Date.now());

  useEffect(() => {
    function handleScroll() {
      const now = Date.now();
      const dt = now - lastTime.current;
      if (dt === 0) return;

      const dy = window.scrollY - lastScrollY.current;
      const velocity = Math.abs(dy / dt) * 1000;

      let intent: ScrollIntent = "idle";
      if (velocity > 800) intent = "fast";
      else if (velocity > 50) intent = "slow";

      setState({ velocity, intent, lastScrollTime: now });

      lastScrollY.current = window.scrollY;
      lastTime.current = now;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return state;
}

// ============================================================================
// useReducedMotion — detect prefers-reduced-motion
// ============================================================================

export function useReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mq.matches);

    function handleChange(e: MediaQueryListEvent) {
      setPrefersReduced(e.matches);
    }

    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  return prefersReduced;
}
