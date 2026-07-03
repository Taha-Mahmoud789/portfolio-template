/**
 * Asset Loader
 *
 * Supports lazy loading, preloading, cache, and future CDN.
 */

import { TextureLoader, ObjectLoader, AudioLoader } from "three";
import type {
  Manager,
  AssetLoaderConfig,
  AssetLoaderState,
  AssetDefinition,
  LoadedAsset,
  AssetType,
} from "./types";

// ============================================================================
// Loaders by type
// ============================================================================

const LOADERS = {
  texture: new TextureLoader(),
  model: new ObjectLoader(),
  audio: new AudioLoader(),
  hdr: new TextureLoader(),
} as const;

type LoaderType = keyof typeof LOADERS;

// ============================================================================
// AssetLoader
// ============================================================================

export class AssetLoader implements Manager {
  private cache = new Map<string, LoadedAsset>();
  private loading = new Map<string, Promise<LoadedAsset>>();
  private state: AssetLoaderState;

  constructor(config?: Partial<AssetLoaderConfig>) {
    // config reserved for future retry/CDN logic
    void config;
    this.state = {
      loadedCount: 0,
      loadingCount: 0,
      failedCount: 0,
      totalSize: 0,
    };
  }

  // --------------------------------------------------------------------------
  // Lifecycle
  // --------------------------------------------------------------------------

  initialize(): void {
    // No initialization needed.
  }

  update(_delta: number): void {
    // Assets have no per-frame update logic.
  }

  dispose(): void {
    for (const asset of this.cache.values()) {
      this.disposeAsset(asset);
    }
    this.cache.clear();
    this.loading.clear();
  }

  // --------------------------------------------------------------------------
  // Public API
  // --------------------------------------------------------------------------

  getState(): AssetLoaderState {
    return this.state;
  }

  async load<T = unknown>(id: string): Promise<T | null> {
    // Check cache
    const cached = this.cache.get(id);
    if (cached) return cached.data as T;

    // Check in-flight
    const inflight = this.loading.get(id);
    if (inflight) {
      const result = await inflight;
      return result.data as T;
    }

    // Not found
    return null;
  }

  async loadFromUrl<T = unknown>(id: string, url: string, type: AssetType): Promise<T | null> {
    // Check cache
    const cached = this.cache.get(id);
    if (cached) return cached.data as T;

    // Check in-flight
    const inflight = this.loading.get(id);
    if (inflight) {
      const result = await inflight;
      return result.data as T;
    }

    // Start loading
    this.state = { ...this.state, loadingCount: this.state.loadingCount + 1 };

    const promise = this.fetchAsset(id, url, type);
    this.loading.set(id, promise);

    try {
      const asset = await promise;
      return asset.data as T;
    } catch {
      this.state = { ...this.state, failedCount: this.state.failedCount + 1 };
      return null;
    } finally {
      this.loading.delete(id);
      this.state = { ...this.state, loadingCount: this.state.loadingCount - 1 };
    }
  }

  async preload(definitions: AssetDefinition[]): Promise<void> {
    const promises = definitions
      .filter((def) => def.preload && !this.cache.has(def.id))
      .map((def) => this.loadFromUrl(def.id, def.url, def.type));

    await Promise.allSettled(promises);
  }

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
  get<T = unknown>(id: string): T | null {
    const cached = this.cache.get(id);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (cached?.data as any as T) ?? null;
  }

  has(id: string): boolean {
    return this.cache.has(id);
  }

  remove(id: string): void {
    const asset = this.cache.get(id);
    if (asset) {
      this.disposeAsset(asset);
      this.cache.delete(id);
      this.updateState();
    }
  }

  clear(): void {
    for (const asset of this.cache.values()) {
      this.disposeAsset(asset);
    }
    this.cache.clear();
    this.updateState();
  }

  // --------------------------------------------------------------------------
  // Internal
  // --------------------------------------------------------------------------

  private async fetchAsset(id: string, url: string, type: AssetType): Promise<LoadedAsset> {
    const loaderType = type as LoaderType;
    const loader = LOADERS[loaderType];

    const data = await new Promise<LoadedAsset["data"]>((resolve, reject) => {
      if (type === "texture" || type === "hdr") {
        (loader as TextureLoader).load(
          url,
          (result: LoadedAsset["data"]) => resolve(result),
          undefined,
          (error: unknown) => reject(new Error(String(error))),
        );
      } else if (type === "model") {
        (loader as ObjectLoader).load(
          url,
          (result: LoadedAsset["data"]) => resolve(result),
          undefined,
          (error: unknown) => reject(new Error(String(error))),
        );
      } else if (type === "audio") {
        (loader as AudioLoader).load(
          url,
          (result: AudioBuffer) => resolve(result),
          undefined,
          (error: unknown) => reject(new Error(String(error))),
        );
      } else {
        reject(new Error(`Unsupported asset type: ${type}`));
      }
    });

    const asset: LoadedAsset = {
      id,
      data,
      type,
      loadedAt: Date.now(),
    };

    this.cache.set(id, asset);
    this.updateState();
    return asset;
  }

  private disposeAsset(asset: LoadedAsset): void {
    const data = asset.data as { dispose?: () => void; close?: () => void };
    if (typeof data.dispose === "function") {
      data.dispose();
    } else if (typeof data.close === "function") {
      data.close();
    }
  }

  private updateState(): void {
    this.state = {
      ...this.state,
      loadedCount: this.cache.size,
    };
  }
}

// ============================================================================
// Factory
// ============================================================================

export function createAssetLoader(config?: Partial<AssetLoaderConfig>): AssetLoader {
  return new AssetLoader(config);
}
