/**
 * World Loader Helper
 *
 * Utilities for creating world module loaders with retry, timeout, and fallback.
 */

import type { ComponentType } from "react";
import type { WorldId, WorldModuleLoader } from "@/engine/world/types";
import type { WorldLoaderHelperOptions } from "./types";

// ============================================================================
// createWorldLoader — create a lazy-loading module loader
// ============================================================================

export function createWorldLoader(
  worldId: WorldId,
  importFn: () => Promise<{ default: ComponentType }>,
  options?: WorldLoaderHelperOptions,
): WorldModuleLoader {
  const { retryCount = 2, retryDelay = 1000, timeout = 10000 } = options ?? {};

  return async (): Promise<{ default: ComponentType }> => {
    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= retryCount; attempt++) {
      try {
        const result = await withTimeout(importFn(), timeout, worldId);
        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (attempt < retryCount) {
          await delay(retryDelay * (attempt + 1));
        }
      }
    }

    throw lastError ?? new Error(`Failed to load world "${worldId}"`);
  };
}

// ============================================================================
// createBatchLoader — load multiple worlds concurrently
// ============================================================================

export function createBatchLoader(
  loaders: Map<WorldId, WorldModuleLoader>,
  maxConcurrent = 4,
): () => Promise<Map<WorldId, { default: ComponentType }>> {
  return async (): Promise<Map<WorldId, { default: ComponentType }>> => {
    const results = new Map<WorldId, { default: ComponentType }>();
    const entries = Array.from(loaders.entries());
    const chunks = chunkArray(entries, maxConcurrent);

    for (const chunk of chunks) {
      const loaded = await Promise.all(
        chunk.map(async ([id, loader]) => {
          const result = await loader();
          return { id, result };
        }),
      );

      for (const { id, result } of loaded) {
        results.set(id, result);
      }
    }

    return results;
  };
}

// ============================================================================
// Helpers
// ============================================================================

function withTimeout<T>(promise: Promise<T>, ms: number, worldId: WorldId): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Timeout loading world "${worldId}" after ${String(ms)}ms`));
      }, ms);
    }),
  ]);
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}
