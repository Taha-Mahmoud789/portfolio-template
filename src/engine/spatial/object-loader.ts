/**
 * Spatial Object System — Loader
 *
 * Handles lazy loading of object assets (textures, models, HDR).
 */

import { TextureLoader, type Texture } from "three";

// ============================================================================
// Object Loader
// ============================================================================

export class ObjectLoader {
  private textureLoader: TextureLoader;
  private loading: Map<string, Promise<Texture>>;

  constructor() {
    this.textureLoader = new TextureLoader();
    this.loading = new Map();
  }

  // --------------------------------------------------------------------------
  // Load Texture
  // --------------------------------------------------------------------------

  async loadTexture(url: string): Promise<Texture> {
    const existing = this.loading.get(url);
    if (existing) return existing;

    const promise = new Promise<Texture>((resolve, reject) => {
      this.textureLoader.load(
        url,
        (texture) => {
          this.loading.delete(url);
          resolve(texture);
        },
        undefined,
        (error) => {
          this.loading.delete(url);
          reject(error instanceof Error ? error : new Error(String(error)));
        },
      );
    });

    this.loading.set(url, promise);
    return promise;
  }

  // --------------------------------------------------------------------------
  // Loading State
  // --------------------------------------------------------------------------

  isLoading(url: string): boolean {
    return this.loading.has(url);
  }

  getLoadingCount(): number {
    return this.loading.size;
  }

  // --------------------------------------------------------------------------
  // Cleanup
  // --------------------------------------------------------------------------

  dispose(): void {
    this.loading.clear();
  }
}
