/**
 * Three.js Example Module Declarations
 *
 * Declares module types for three.js example modules that are not
 * properly resolved by TypeScript's moduleResolution: "bundler".
 */

declare module "three/examples/jsm/postprocessing/EffectComposer" {
  import { type WebGLRenderer, type WebGLRenderTarget } from "three";
  import { type Pass } from "three/examples/jsm/postprocessing/Pass";

  export class EffectComposer {
    constructor(renderer: WebGLRenderer, renderTarget?: WebGLRenderTarget);
    addPass(pass: Pass): void;
    insertPass(pass: Pass, index: number): void;
    removePass(pass: Pass): void;
    render(deltaTime?: number): void;
    setSize(width: number, height: number): void;
    setPixelRatio(pixelRatio: number): void;
    dispose(): void;
  }
}

declare module "three/examples/jsm/postprocessing/EffectComposer.js" {
  import { type WebGLRenderer, type WebGLRenderTarget } from "three";
  import { type Pass } from "three/examples/jsm/postprocessing/Pass";

  export class EffectComposer {
    constructor(renderer: WebGLRenderer, renderTarget?: WebGLRenderTarget);
    addPass(pass: Pass): void;
    insertPass(pass: Pass, index: number): void;
    removePass(pass: Pass): void;
    render(deltaTime?: number): void;
    setSize(width: number, height: number): void;
    setPixelRatio(pixelRatio: number): void;
    dispose(): void;
  }
}

declare module "three/examples/jsm/postprocessing/RenderPass" {
  import { type Scene, type Camera } from "three";
  import { Pass } from "three/examples/jsm/postprocessing/Pass";

  export class RenderPass extends Pass {
    constructor(scene: Scene, camera: Camera);
  }
}

declare module "three/examples/jsm/postprocessing/RenderPass.js" {
  import { type Scene, type Camera } from "three";
  import { Pass } from "three/examples/jsm/postprocessing/Pass";

  export class RenderPass extends Pass {
    constructor(scene: Scene, camera: Camera);
  }
}

declare module "three/examples/jsm/postprocessing/UnrealBloomPass" {
  import { type Vector2 } from "three";
  import { Pass } from "three/examples/jsm/postprocessing/Pass";

  export class UnrealBloomPass extends Pass {
    constructor(resolution: Vector2, strength?: number, radius?: number, threshold?: number);
    resolution: Vector2;
    strength: number;
    radius: number;
    threshold: number;
  }
}

declare module "three/examples/jsm/postprocessing/UnrealBloomPass.js" {
  import { type Vector2 } from "three";
  import { Pass } from "three/examples/jsm/postprocessing/Pass";

  export class UnrealBloomPass extends Pass {
    constructor(resolution: Vector2, strength?: number, radius?: number, threshold?: number);
    resolution: Vector2;
    strength: number;
    radius: number;
    threshold: number;
  }
}

declare module "three/examples/jsm/postprocessing/OutputPass" {
  import { Pass } from "three/examples/jsm/postprocessing/Pass";

  export class OutputPass extends Pass {
    constructor();
  }
}

declare module "three/examples/jsm/postprocessing/OutputPass.js" {
  import { Pass } from "three/examples/jsm/postprocessing/Pass";

  export class OutputPass extends Pass {
    constructor();
  }
}

declare module "three/examples/jsm/postprocessing/ShaderPass" {
  import { type Shader } from "three";
  import { Pass } from "three/examples/jsm/postprocessing/Pass";

  export class ShaderPass extends Pass {
    constructor(shader: Shader);
    uniforms: Record<string, { value: unknown }>;
    enabled: boolean;
  }
}

declare module "three/examples/jsm/postprocessing/ShaderPass.js" {
  import { type Shader } from "three";
  import { Pass } from "three/examples/jsm/postprocessing/Pass";

  export class ShaderPass extends Pass {
    constructor(shader: Shader);
    uniforms: Record<string, { value: unknown }>;
    enabled: boolean;
  }
}

declare module "three/examples/jsm/shaders/FXAAShader" {
  export const FXAAShader: {
    uniforms: {
      tDiffuse: { value: null };
      resolution: { value: { set: (x: number, y: number) => void } };
    };
    vertexShader: string;
    fragmentShader: string;
  };
}

declare module "three/examples/jsm/shaders/FXAAShader.js" {
  export const FXAAShader: {
    uniforms: {
      tDiffuse: { value: null };
      resolution: { value: { set: (x: number, y: number) => void } };
    };
    vertexShader: string;
    fragmentShader: string;
  };
}

declare module "three/examples/jsm/postprocessing/Pass" {
  export class Pass {
    render(renderer: unknown, writeBuffer: unknown, readBuffer: unknown, deltaTime: number): void;
    setSize(width: number, height: number): void;
    dispose(): void;
  }

  export class FullScreenQuad {
    constructor(material?: unknown);
    render(renderer: unknown): void;
    dispose(): void;
  }
}

declare module "three/examples/jsm/postprocessing/Pass.js" {
  export class Pass {
    render(renderer: unknown, writeBuffer: unknown, readBuffer: unknown, deltaTime: number): void;
    setSize(width: number, height: number): void;
    dispose(): void;
  }

  export class FullScreenQuad {
    constructor(material?: unknown);
    render(renderer: unknown): void;
    dispose(): void;
  }
}
