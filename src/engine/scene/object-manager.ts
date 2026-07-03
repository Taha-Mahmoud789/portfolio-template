/**
 * Object Manager
 *
 * Owns planets, stars, particles, future models, future interactions.
 * Manages the full lifecycle of 3D objects: add, remove, dispose.
 */

import type { Object3D, BufferGeometry, Material, Scene } from "three";
import type {
  Manager,
  ObjectManagerConfig,
  ObjectManagerState,
  ManagedObject,
  ObjectCategory,
} from "./types";
import { OBJECT_DEFAULTS } from "./constants";

// ============================================================================
// ObjectManager
// ============================================================================

export class ObjectManager implements Manager {
  private config: ObjectManagerConfig;
  private objects = new Map<string, ManagedObject>();
  private state: ObjectManagerState;
  private scene: Scene | null = null;

  constructor(config?: Partial<ObjectManagerConfig>) {
    this.config = { ...OBJECT_DEFAULTS, ...config };
    this.state = {
      objectCount: 0,
      objectsByCategory: {
        planet: 0,
        star: 0,
        particle: 0,
        nebula: 0,
        dust: 0,
        ui: 0,
        custom: 0,
      },
      totalTriangles: 0,
    };
  }

  // --------------------------------------------------------------------------
  // Lifecycle
  // --------------------------------------------------------------------------

  initialize(): void {
    // Scene reference is set via setScene() before initialize.
  }

  update(_delta: number): void {
    // Objects have no per-frame update logic from the manager.
    // Individual objects handle their own animation.
  }

  dispose(): void {
    for (const managed of this.objects.values()) {
      this.disposeObject(managed.object);
    }
    this.objects.clear();
    this.updateState();
  }

  // --------------------------------------------------------------------------
  // Public API
  // --------------------------------------------------------------------------

  getState(): ObjectManagerState {
    return this.state;
  }

  setScene(scene: Scene): void {
    this.scene = scene;
  }

  addObject(
    object: Object3D,
    category: ObjectCategory = "custom",
    layer: number = 0,
    parallaxSpeed: number = 1,
    isInteractive: boolean = false,
  ): string {
    const id = `obj-${category}-${String(this.objects.size)}`;

    if (this.config.frustumCulled) {
      object.frustumCulled = true;
    }

    object.layers.set(layer);

    this.objects.set(id, {
      id,
      object,
      category,
      layer,
      parallaxSpeed,
      isInteractive,
    });

    this.scene?.add(object);
    this.updateState();
    return id;
  }

  removeObject(id: string): void {
    const managed = this.objects.get(id);
    if (!managed) return;

    this.scene?.remove(managed.object);

    if (this.config.autoDispose) {
      this.disposeObject(managed.object);
    }

    this.objects.delete(id);
    this.updateState();
  }

  getObject(id: string): ManagedObject | undefined {
    return this.objects.get(id);
  }

  getObjectsByCategory(category: ObjectCategory): ManagedObject[] {
    return Array.from(this.objects.values()).filter((m) => m.category === category);
  }

  getObjectsByLayer(layer: number): ManagedObject[] {
    return Array.from(this.objects.values()).filter((m) => m.layer === layer);
  }

  getAllObjects(): ManagedObject[] {
    return Array.from(this.objects.values());
  }

  // --------------------------------------------------------------------------
  // Dispose helpers
  // --------------------------------------------------------------------------

  private disposeObject(object: Object3D): void {
    object.traverse((child) => {
      const node = child as Object3D & {
        geometry?: BufferGeometry;
        material?: Material | Material[];
      };

      if (node.geometry) {
        node.geometry.dispose();
      }

      if (node.material) {
        const materials = Array.isArray(node.material) ? node.material : [node.material];
        for (const mat of materials) {
          for (const key of Object.keys(mat)) {
            const value = mat[key as keyof typeof mat];
            if (
              value &&
              typeof value === "object" &&
              "dispose" in value &&
              typeof value.dispose === "function"
            ) {
              (value as { dispose: () => void }).dispose();
            }
          }
          mat.dispose();
        }
      }
    });
  }

  // --------------------------------------------------------------------------
  // State
  // --------------------------------------------------------------------------

  private updateState(): void {
    const objectsByCategory: Record<ObjectCategory, number> = {
      planet: 0,
      star: 0,
      particle: 0,
      nebula: 0,
      dust: 0,
      ui: 0,
      custom: 0,
    };

    let totalTriangles = 0;

    for (const managed of this.objects.values()) {
      objectsByCategory[managed.category]++;

      managed.object.traverse((child) => {
        const node = child as Object3D & { geometry?: BufferGeometry };
        if (node.geometry) {
          const geo = node.geometry;
          if (geo.index) {
            totalTriangles += geo.index.count / 3;
          } else if (geo.attributes.position) {
            totalTriangles += geo.attributes.position.count / 3;
          }
        }
      });
    }

    this.state = {
      objectCount: this.objects.size,
      objectsByCategory,
      totalTriangles,
    };
  }
}

// ============================================================================
// Factory
// ============================================================================

export function createObjectManager(config?: Partial<ObjectManagerConfig>): ObjectManager {
  return new ObjectManager(config);
}
