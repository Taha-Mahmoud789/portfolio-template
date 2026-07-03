import { useRef } from "react";
import type { Object3D } from "three";

export function useThreeRef<T extends Object3D>() {
  return useRef<T>(null);
}
