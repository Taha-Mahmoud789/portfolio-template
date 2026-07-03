/**
 * Experience Engine
 *
 * Main entry point. Export all public APIs, types, and utilities.
 */

// ============================================================================
// Types
// ============================================================================
export type {
  InputDevice,
  InputEventType,
  InputEvent,
  PointerPosition,
  PointerVelocity,
  ModifierState,
  PointerButton,
  CursorState,
  MagneticTarget,
  DragState,
  GestureType,
  GestureEvent,
  GestureConfig,
  SwipeDirection,
  InteractionState,
  SceneId,
  SceneConfig,
  SceneState,
  LifecyclePhase,
  LifecycleEvent,
  LifecycleCallback,
  ExperienceEventType,
  ExperienceEventCallback,
  ExperienceEventUnsubscribe,
  ExperienceEngineState,
  ExperienceEngineActions,
  ExperienceActions,
  ExperienceState,
  ExperienceContextValue,
  InputManagerConfig,
  PointerManagerConfig,
  GestureManagerConfig,
  FocusManagerConfig,
  HoverManagerConfig,
  SceneManagerConfig,
  ExperienceRegistryEntry,
  UsePointerOptions,
  UseGestureOptions,
  UseFocusTrapOptions,
  UseHoverOptions,
  CachedRect,
} from "./types";

// ============================================================================
// Constants
// ============================================================================
export {
  EXPERIENCE_STORAGE_KEY,
  INPUT_DEFAULTS,
  POINTER_DEFAULTS,
  DEFAULT_POINTER_POSITION,
  DEFAULT_POINTER_VELOCITY,
  GESTURE_CONFIG,
  GESTURE_DEFAULTS,
  FOCUS_DEFAULTS,
  HOVER_DEFAULTS,
  SCENE_DEFAULTS,
  INTERACTION_STATES,
  CURSOR_STATES,
  INTERACTION_CURSOR_MAP,
  FOCUSABLE_SELECTORS,
  KEYBOARD_GESTURES,
  PERFORMANCE,
  A11Y,
} from "./constants";

export { STATE_PRIORITY } from "./types";

// ============================================================================
// Core
// ============================================================================
export { useExperienceStore, selectInteractionState, selectPointerPosition, selectPointerVelocity, selectCursorState, selectIsInitialized, selectReducedMotion, selectLifecyclePhase, selectActiveSceneId, selectSceneStates, selectPointerCount, selectIsVisible } from "./store";

export { ExperienceActionsContext, ExperienceStateContext, useExperienceActions, useExperienceState, useExperienceContext, useOptionalExperienceContext } from "./context";

export { ExperienceProvider } from "./provider";

export { ExperienceRegistry, createExperienceRegistry } from "./registry";

// ============================================================================
// Events
// ============================================================================
export { experienceEvents, onExperienceEvent, emitExperienceEvent, createEventGroup } from "./events";

// ============================================================================
// Managers
// ============================================================================
export { InputManager, createInputManager } from "./input-manager";
export { PointerManager, createPointerManager } from "./pointer-manager";
export { GestureManager, createGestureManager } from "./gesture-manager";
export { FocusManager, createFocusManager } from "./focus-manager";
export { HoverManager, createHoverManager } from "./hover-manager";
export { SceneManager, createSceneManager } from "./scene-manager";
export { LifecycleManager, createLifecycleManager } from "./lifecycle-manager";
export { StateSynchronization, createStateSynchronization } from "./state-sync";
export { InteractionManager, createInteractionManager } from "./interaction-manager";

// ============================================================================
// Hooks
// ============================================================================
export {
  useExperience,
  useExperienceActionsOnly,
  useExperienceStateOnly,
  useInteractionState,
  usePointerPosition,
  usePointerVelocity,
  useCursorState,
  useReducedMotion,
  useLifecyclePhase,
  useActiveSceneId,
  usePageVisible,
  useExperienceInitialized,
  useSetInteractionState,
  useSetCursorState,
  useSetActiveScene,
  useExperienceEvent,
  useExperienceEvents,
  usePointerTrack,
  useGesture,
  useGestures,
  useFocusTrap,
  useFocusMainContent,
  useHoverTarget,
  useActiveScene,
  useIsSceneActive,
  useOnExperienceReady,
  useOnExperienceDestroy,
  useResize,
  useVisibilityChange,
  useMotionPreferenceChange,
  useAnnounce,
} from "./hooks";
