/**
 * World Asset Manager
 *
 * Handles preloading and disposal of world assets (images, fonts, scripts, etc.).
 */

import type {
  WorldAssets,
  WorldAsset,
  WorldAssetManagerConfig,
  WorldAssetLoadState,
} from "./types";
import { WORLD_ASSET_MANAGER_DEFAULTS } from "./constants";

interface AssetLoadResult {
  asset: WorldAsset;
  success: boolean;
  error?: Error;
  duration: number;
}

export class WorldAssetManager {
  private config: WorldAssetManagerConfig;
  private loading = new Map<string, Promise<AssetLoadResult>>();
  private loaded = new Map<string, AssetLoadResult>();
  private abortControllers = new Map<string, AbortController>();

  constructor(config?: Partial<WorldAssetManagerConfig>) {
    this.config = { ...WORLD_ASSET_MANAGER_DEFAULTS, ...config };
  }

  async preloadAssets(worldId: string, assets: WorldAssets): Promise<WorldAssetLoadState> {
    const allAssets = this.flattenAssets(assets);
    const preloadable = allAssets.filter((a) => a.preload);

    const state: WorldAssetLoadState = {
      total: preloadable.length,
      loaded: 0,
      failed: 0,
      progress: 0,
    };

    if (preloadable.length === 0) return state;

    const chunks = this.chunk(preloadable, this.config.maxConcurrent);

    for (const chunk of chunks) {
      const results = await Promise.allSettled(
        chunk.map((asset) => this.loadAsset(worldId, asset)),
      );

      for (const result of results) {
        if (result.status === "fulfilled" && result.value.success) {
          state.loaded++;
        } else {
          state.failed++;
        }
      }

      state.progress = (state.loaded + state.failed) / state.total;
    }

    return state;
  }

  async preloadAsset(worldId: string, asset: WorldAsset): Promise<boolean> {
    const result = await this.loadAsset(worldId, asset);
    return result.success;
  }

  cancelPreload(worldId: string): void {
    const controller = this.abortControllers.get(worldId);
    if (controller) {
      controller.abort();
      this.abortControllers.delete(worldId);
    }
  }

  dispose(worldId: string): void {
    this.cancelPreload(worldId);

    for (const [key] of this.loaded) {
      if (key.startsWith(`${worldId}:`)) {
        this.loaded.delete(key);
      }
    }
  }

  disposeAll(): void {
    for (const controller of this.abortControllers.values()) {
      controller.abort();
    }
    this.abortControllers.clear();
    this.loaded.clear();
    this.loading.clear();
  }

  isLoaded(worldId: string, assetId: string): boolean {
    return this.loaded.has(`${worldId}:${assetId}`);
  }

  getLoadedCount(worldId: string): number {
    let count = 0;
    for (const [key] of this.loaded) {
      if (key.startsWith(`${worldId}:`)) count++;
    }
    return count;
  }

  private async loadAsset(worldId: string, asset: WorldAsset): Promise<AssetLoadResult> {
    const key = `${worldId}:${asset.id}`;

    const existing = this.loaded.get(key);
    if (existing) return existing;

    const loading = this.loading.get(key);
    if (loading) return loading;

    const promise = this.doLoad(worldId, asset);
    this.loading.set(key, promise);

    try {
      const result = await promise;
      return result;
    } finally {
      this.loading.delete(key);
    }
  }

  private async doLoad(worldId: string, asset: WorldAsset): Promise<AssetLoadResult> {
    const key = `${worldId}:${asset.id}`;
    const startTime = performance.now();
    const controller = new AbortController();
    this.abortControllers.set(worldId, controller);

    try {
      await this.loadByType(asset, controller.signal);
      const duration = performance.now() - startTime;

      const result: AssetLoadResult = { asset, success: true, duration };
      this.loaded.set(key, result);
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      const err = error instanceof Error ? error : new Error(String(error));
      return { asset, success: false, error: err, duration };
    } finally {
      this.abortControllers.delete(worldId);
    }
  }

  private async loadByType(asset: WorldAsset, signal: AbortSignal): Promise<void> {
    switch (asset.type) {
      case "image":
        return this.loadImage(asset.url, signal);
      case "font":
        return this.loadFont(asset.url, signal);
      case "script":
        return this.loadScript(asset.url, signal);
      case "style":
        return this.loadStyle(asset.url, signal);
      default:
        return this.loadGeneric(asset.url, signal);
    }
  }

  private loadImage(url: string, signal: AbortSignal): Promise<void> {
    return new Promise((resolve, reject) => {
      if (signal.aborted) {
        reject(new DOMException("Aborted", "AbortError"));
        return;
      }

      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));

      signal.addEventListener("abort", () => {
        img.src = "";
        reject(new DOMException("Aborted", "AbortError"));
      });

      img.src = url;
    });
  }

  private async loadFont(url: string, signal: AbortSignal): Promise<void> {
    if (signal.aborted) throw new DOMException("Aborted", "AbortError");

    try {
      const fontFace = new FontFace("WorldFont", `url(${url})`);
      await fontFace.load();
      document.fonts.add(fontFace);
    } catch {
      throw new Error(`Failed to load font: ${url}`);
    }
  }

  private loadScript(url: string, signal: AbortSignal): Promise<void> {
    return new Promise((resolve, reject) => {
      if (signal.aborted) {
        reject(new DOMException("Aborted", "AbortError"));
        return;
      }

      const script = document.createElement("script");
      script.src = url;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${url}`));

      signal.addEventListener("abort", () => {
        script.src = "";
        reject(new DOMException("Aborted", "AbortError"));
      });

      document.head.appendChild(script);
    });
  }

  private loadStyle(url: string, signal: AbortSignal): Promise<void> {
    return new Promise((resolve, reject) => {
      if (signal.aborted) {
        reject(new DOMException("Aborted", "AbortError"));
        return;
      }

      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = url;
      link.onload = () => resolve();
      link.onerror = () => reject(new Error(`Failed to load style: ${url}`));

      signal.addEventListener("abort", () => {
        link.remove();
        reject(new DOMException("Aborted", "AbortError"));
      });

      document.head.appendChild(link);
    });
  }

  private async loadGeneric(url: string, signal: AbortSignal): Promise<void> {
    const response = await fetch(url, { signal });
    if (!response.ok) {
      throw new Error(`Failed to load asset: ${url} (${String(response.status)})`);
    }
  }

  private flattenAssets(assets: WorldAssets): WorldAsset[] {
    return [
      ...assets.images,
      ...assets.fonts,
      ...assets.scripts,
      ...assets.styles,
      ...assets.models,
      ...assets.audio,
      ...assets.video,
    ];
  }

  private chunk<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}
