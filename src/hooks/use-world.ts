import { useParams } from "react-router";
import { useMemo } from "react";
import type { WorldId } from "@/types/world";
import { WORLD_MANIFESTS } from "@/config/worlds";

export function useCurrentWorld() {
  const params = useParams<{ worldId: string }>();

  return useMemo(() => {
    const worldId = params.worldId as WorldId | undefined;
    if (!worldId) return null;
    return WORLD_MANIFESTS.find((w) => w.id === worldId) ?? null;
  }, [params.worldId]);
}

export function useWorldId(): WorldId | null {
  const params = useParams<{ worldId: string }>();
  return (params.worldId as WorldId | null) ?? null;
}
