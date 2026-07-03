/**
 * World Route
 *
 * Wraps each world route element. Reads the world ID from route
 * params, maps it to the internal world ID format, syncs it
 * to the world store, and renders the appropriate world content.
 *
 * URL format: /worlds/:worldId (e.g., /worlds/space)
 * Internal ID format: space-world, apple-world, etc.
 */

import { useEffect, Suspense, lazy } from "react";
import { useParams } from "react-router";
import { useWorldStore } from "@/store/world-store";
import { WorldLayout } from "../world-layout";
import type { WorldId } from "@/types/world";

const PATH_TO_WORLD_ID: Record<string, WorldId> = {
  "space": "space-world",
  "apple": "apple-world",
  "cyberpunk": "cyberpunk-world",
  "gaming": "gaming-world",
  "ai": "ai-world",
  "editorial": "editorial-world",
  "liquid": "liquid-world",
  "brutalist": "brutalist-world",
  "retro": "retro-world",
  "experimental": "experimental-world",
};

const WORLD_COMPONENTS: Record<WorldId, React.LazyExoticComponent<React.ComponentType>> = {
  "space-world": (() => {
    const SpaceWorldPage = lazy(() => import("@/pages/worlds/space"));
    return SpaceWorldPage;
  })(),
  "apple-world": (() => {
    const AppleWorldPage = lazy(() => import("@/pages/worlds/apple"));
    return AppleWorldPage;
  })(),
  "cyberpunk-world": (() => {
    const CyberpunkWorldPage = lazy(() => import("@/pages/worlds/cyberpunk"));
    return CyberpunkWorldPage;
  })(),
  "gaming-world": (() => {
    const GamingWorldPage = lazy(() => import("@/pages/worlds/gaming"));
    return GamingWorldPage;
  })(),
  "ai-world": (() => {
    const AiWorldPage = lazy(() => import("@/pages/worlds/ai"));
    return AiWorldPage;
  })(),
  "editorial-world": (() => {
    const EditorialWorldPage = lazy(() => import("@/pages/worlds/editorial"));
    return EditorialWorldPage;
  })(),
  "liquid-world": (() => {
    const LiquidWorldPage = lazy(() => import("@/pages/worlds/liquid"));
    return LiquidWorldPage;
  })(),
  "brutalist-world": (() => {
    const BrutalistWorldPage = lazy(() => import("@/pages/worlds/brutalist"));
    return BrutalistWorldPage;
  })(),
  "retro-world": (() => {
    const RetroWorldPage = lazy(() => import("@/pages/worlds/retro"));
    return RetroWorldPage;
  })(),
  "experimental-world": (() => {
    const ExperimentalWorldPage = lazy(() => import("@/pages/worlds/experimental"));
    return ExperimentalWorldPage;
  })(),
};

function WorldFallback() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100dvh",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: 32,
            height: 32,
            border: "2px solid rgba(99, 102, 241, 0.2)",
            borderTopColor: "rgba(99, 102, 241, 0.8)",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
            margin: "0 auto 1rem",
          }}
        />
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.875rem" }}>
          Loading world...
        </p>
      </div>
    </div>
  );
}

export function WorldRoute() {
  const { worldId: pathSegment } = useParams<{ worldId: string }>();
  const setCurrentWorld = useWorldStore((s) => s.setCurrentWorld);

  const worldId = pathSegment ? PATH_TO_WORLD_ID[pathSegment] : undefined;
  const WorldComponent = worldId ? WORLD_COMPONENTS[worldId] : undefined;

  useEffect(() => {
    if (worldId) {
      setCurrentWorld(worldId);
    }
  }, [worldId, setCurrentWorld]);

  return (
    <WorldLayout worldId={worldId ?? "unknown"}>
      <Suspense fallback={<WorldFallback />}>
        {WorldComponent ? <WorldComponent /> : <WorldNotFound />}
      </Suspense>
    </WorldLayout>
  );
}

function WorldNotFound() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100dvh",
        padding: "2rem",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.5rem", color: "#f0f0f5" }}>
          World not found
        </h2>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.875rem" }}>
          The world you're looking for doesn't exist.
        </p>
      </div>
    </div>
  );
}
