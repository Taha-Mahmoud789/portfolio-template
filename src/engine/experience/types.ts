/**
 * Experience Engine Types
 *
 * Core type definitions for the Experience Engine.
 * Covers input, pointer, gesture, scene, lifecycle, and interaction states.
 */

import type { ComponentType } from "react";

// ============================================================================
// Input Types
// ============================================================================

export type InputDevice = "mouse" | "touch" | "keyboard" | "trackpad" | "gamepad" | "vr" | "voice";

export type InputEventType =
  | "keydown"
  | "keyup"
  | "wheel"
  | "blur"
  | "focus";

export interface InputEvent {
  type: InputEventType;
  device: InputDevice;
  timestamp: number;
  originalEvent: Event;
  position: PointerPosition;
  modifiers: ModifierState;
}

// ============================================================================
// Pointer Types
// ============================================================================

export interface PointerPosition {
  x: number;
  y: number;
  /** Normalized 0-1 relative to viewport */
  normalizedX: number;
  normalizedY: number;
}

export interface PointerVelocity {
  x: number;
  y: number;
  /** Magnitude (speed) */
  magnitude: number;
  /** Angle in radians */
  angle: number;
}

export interface ModifierState {
  shift: boolean;
  ctrl: boolean;
  alt: boolean;
  meta: boolean;
}

export type PointerButton = "primary" | "secondary" | "middle" | "back" | "forward" | "none";

export type CursorState =
  | "default"
  | "pointer"
  | "grab"
  | "grabbing"
  | "crosshair"
  | "wait"
  | "text"
  | "move"
  | "not-allowed"
  | "zoom-in"
  | "zoom-out"
  | "custom";

/** Cached bounding rect for magnetic targets */
export interface CachedRect {
  left: number;
  top: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}

export interface MagneticTarget {
  id: string;
  element: HTMLElement;
  /** Radius in pixels within which the cursor magnetizes */
  radius: number;
  /** Strength 0-1 — how strongly the cursor is pulled */
  strength: number;
  /** Callback when magnetized */
  onMagnetize?: () => void;
  /** Callback when released */
  onRelease?: () => void;
  /** Cached bounding rect (updated on resize/scroll) */
  cachedRect?: CachedRect;
}

export interface DragState {
  isDragging: boolean;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  deltaX: number;
  deltaY: number;
  velocity: PointerVelocity;
}

// ============================================================================
// Gesture Types
// ============================================================================

export type GestureType =
  | "tap"
  | "double-tap"
  | "long-press"
  | "swipe"
  | "pinch"
  | "zoom"
  | "rotate";

export type SwipeDirection = "up" | "down" | "left" | "right";

export interface GestureEvent {
  type: GestureType;
  timestamp: number;
  position: PointerPosition;
  /** For swipe: direction and velocity */
  direction?: SwipeDirection;
  velocity?: number;
  /** For pinch/zoom: scale factor */
  scale?: number;
  /** For rotate: angle in degrees */
  rotation?: number;
  /** For long press: duration in ms */
  duration?: number;
  /** Source of the gesture */
  source: "touch" | "keyboard";
}

export interface GestureConfig {
  /** Max distance in px for tap recognition */
  tapThreshold: number;
  /** Max time in ms for tap recognition */
  tapTimeout: number;
  /** Time in ms to trigger long press */
  longPressDelay: number;
  /** Min distance in px for swipe recognition */
  swipeThreshold: number;
  /** Max time in ms for swipe recognition */
  swipeTimeout: number;
  /** Scale threshold for pinch recognition */
  pinchThreshold: number;
  /** Angle threshold in degrees for rotate recognition */
  rotateThreshold: number;
}

// ============================================================================
// Interaction State Types
// ============================================================================

export type InteractionState =
  | "idle"
  | "hover"
  | "pressed"
  | "focused"
  | "dragging"
  | "scrolling"
  | "loading"
  | "transitioning";

/**
 * State priority — higher number wins.
 * Used to resolve conflicts when multiple managers set interaction state.
 */
export const STATE_PRIORITY: Record<InteractionState, number> = {
  idle: 0,
  loading: 1,
  transitioning: 2,
  scrolling: 3,
  hover: 4,
  focused: 5,
  pressed: 6,
  dragging: 7,
};

// ============================================================================
// Scene Types
// ============================================================================

export type SceneId = string;

export interface SceneConfig {
  id: SceneId;
  label: string;
  /** Component to render when scene is active */
  component?: ComponentType;
  /** Called when scene enters */
  onEnter?: () => void | Promise<void>;
  /** Called when scene exits */
  onExit?: () => void | Promise<void>;
  /** Called when scene is activated (after enter) */
  onActivate?: () => void;
  /** Called when scene is deactivated (before exit) */
  onDeactivate?: () => void;
  /** Transition type for scene entry */
  entryTransition?: string;
  /** Transition type for scene exit */
  exitTransition?: string;
  /** Nested scenes */
  children?: SceneConfig[];
  /** Metadata */
  metadata?: Record<string, unknown>;
}

export interface SceneState {
  id: SceneId;
  isActive: boolean;
  isLoaded: boolean;
  enteredAt: number | null;
  exitedAt: number | null;
}

// ============================================================================
// Lifecycle Types
// ============================================================================

export type LifecyclePhase =
  | "idle"
  | "initializing"
  | "ready"
  | "running"
  | "pausing"
  | "paused"
  | "resuming"
  | "destroying"
  | "destroyed";

export interface LifecycleEvent {
  phase: LifecyclePhase;
  timestamp: number;
  previousPhase: LifecyclePhase;
}

export type LifecycleCallback = (event: LifecycleEvent) => void;

// ============================================================================
// Event System Types
// ============================================================================

export type ExperienceEventType =
  // Input events
  | "input:pointer-down"
  | "input:pointer-up"
  | "input:pointer-move"
  | "input:pointer-leave"
  | "input:wheel"
  | "input:key-down"
  | "input:key-up"
  | "input:focus"
  | "input:blur"
  // Pointer events
  | "pointer:hover-enter"
  | "pointer:hover-leave"
  | "pointer:drag-start"
  | "pointer:drag-move"
  | "pointer:drag-end"
  | "pointer:magnetize"
  | "pointer:release"
  // Gesture events
  | "gesture:tap"
  | "gesture:double-tap"
  | "gesture:long-press"
  | "gesture:swipe"
  | "gesture:pinch"
  | "gesture:zoom"
  | "gesture:rotate"
  // Scene events
  | "scene:enter"
  | "scene:exit"
  | "scene:activate"
  | "scene:deactivate"
  // Lifecycle events
  | "lifecycle:phase-change"
  | "lifecycle:ready"
  // Interaction events
  | "interaction:focus"
  | "interaction:blur"
  // Accessibility events
  | "a11y:announce"
  // System events
  | "system:resize"
  | "system:visibility-change"
  | "system:motion-preference-change";

export type ExperienceEventCallback = (data: unknown) => void;

export type ExperienceEventUnsubscribe = () => void;

// ============================================================================
// Engine State Types
// ============================================================================

export interface ExperienceEngineState {
  /** Current interaction state */
  interactionState: InteractionState;
  /** Current pointer position */
  pointerPosition: PointerPosition;
  /** Current pointer velocity */
  pointerVelocity: PointerVelocity;
  /** Active cursor state */
  cursorState: CursorState;
  /** Whether the engine is initialized */
  isInitialized: boolean;
  /** Whether reduced motion is preferred */
  reducedMotion: boolean;
  /** Current lifecycle phase */
  lifecyclePhase: LifecyclePhase;
  /** Active scene ID */
  activeSceneId: SceneId | null;
  /** Registered scene states */
  sceneStates: Record<SceneId, SceneState>;
  /** Number of active pointers */
  pointerCount: number;
  /** Whether the page is visible */
  isVisible: boolean;
}

export interface ExperienceEngineActions {
  /** Set interaction state (respects priority) */
  setInteractionState: (state: InteractionState) => void;
  /** Update pointer position */
  setPointerPosition: (position: PointerPosition) => void;
  /** Update pointer velocity */
  setPointerVelocity: (velocity: PointerVelocity) => void;
  /** Set cursor state */
  setCursorState: (state: CursorState) => void;
  /** Set reduced motion */
  setReducedMotion: (reduced: boolean) => void;
  /** Set lifecycle phase */
  setLifecyclePhase: (phase: LifecyclePhase) => void;
  /** Set active scene */
  setActiveScene: (sceneId: SceneId | null) => void;
  /** Update a scene state */
  updateSceneState: (sceneId: SceneId, state: Partial<SceneState>) => void;
  /** Set pointer count */
  setPointerCount: (count: number) => void;
  /** Set visibility */
  setIsVisible: (visible: boolean) => void;
  /** Set initialized */
  setIsInitialized: (initialized: boolean) => void;
}

// ============================================================================
// Context Types
// ============================================================================

export interface ExperienceActions {
  /** Set interaction state (respects priority) */
  setInteractionState: (state: InteractionState) => void;
  /** Set cursor state */
  setCursorState: (state: CursorState) => void;
  /** Set active scene */
  setActiveScene: (sceneId: SceneId | null) => void;
  /** Subscribe to experience events */
  on: (event: ExperienceEventType, callback: ExperienceEventCallback) => ExperienceEventUnsubscribe;
  /** Emit an experience event */
  emit: (event: ExperienceEventType, data: unknown) => void;
}

/**
 * Experience state exposed via context.
 * Deliberately excludes high-frequency pointer data to prevent rerender cascade.
 * Use useExperienceStore(selectPointerPosition) for pointer data.
 */
export interface ExperienceState {
  /** Current interaction state */
  interactionState: InteractionState;
  /** Active cursor state */
  cursorState: CursorState;
  /** Whether the engine is initialized */
  isInitialized: boolean;
  /** Whether reduced motion is preferred */
  reducedMotion: boolean;
  /** Current lifecycle phase */
  lifecyclePhase: LifecyclePhase;
  /** Active scene ID */
  activeSceneId: SceneId | null;
  /** Whether the page is visible */
  isVisible: boolean;
}

export interface ExperienceContextValue extends ExperienceState, ExperienceActions {}

// ============================================================================
// Manager Types
// ============================================================================

export interface InputManagerConfig {
  /** Enable keyboard input */
  keyboard: boolean;
  /** Enable wheel input */
  wheel: boolean;
  /** Use passive event listeners */
  passive: boolean;
}

export interface PointerManagerConfig {
  /** Enable hover tracking */
  hover: boolean;
  /** Enable magnetic targets */
  magnetic: boolean;
  /** Enable drag tracking */
  drag: boolean;
  /** Enable velocity tracking */
  velocity: boolean;
  /** Number of positions to track for velocity */
  velocitySampleSize: number;
  /** Throttle interval in ms for pointer move events */
  moveThrottle: number;
}

export interface GestureManagerConfig extends GestureConfig {
  /** Enable gesture recognition */
  enabled: boolean;
  /** Prevent default on recognized gestures */
  preventDefault: boolean;
}

export interface FocusManagerConfig {
  /** Selector for the main content focus target */
  mainContentSelector: string;
  /** Selector for the skip link */
  skipLinkSelector: string;
  /** Delay in ms before focusing after navigation */
  focusDelay: number;
  /** Trap focus within modals */
  trapFocus: boolean;
}

export interface HoverManagerConfig {
  /** Delay in ms before hover is registered */
  enterDelay: number;
  /** Delay in ms before hover is cleared */
  leaveDelay: number;
  /** Enable hover on touch devices (long press) */
  touchSupport: boolean;
}

export interface SceneManagerConfig {
  /** ID of the default scene */
  defaultScene: SceneId;
  /** Transition duration in ms */
  transitionDuration: number;
}

// ============================================================================
// Registry Types
// ============================================================================

export interface ExperienceRegistryEntry {
  id: string;
  config: Partial<InputManagerConfig & PointerManagerConfig & GestureManagerConfig & FocusManagerConfig & HoverManagerConfig & SceneManagerConfig>;
  metadata?: Record<string, unknown>;
}

// ============================================================================
// Hook Option Types
// ============================================================================

export interface UsePointerOptions {
  /** Enable hover tracking */
  hover?: boolean;
  /** Enable velocity tracking */
  velocity?: boolean;
  /** Element to attach to (default: window) */
  element?: HTMLElement | null;
}

export interface UseGestureOptions {
  /** Enable specific gesture types */
  gestures?: GestureType[];
  /** Callback for recognized gestures */
  onGesture?: (event: GestureEvent) => void;
}

export interface UseFocusTrapOptions {
  /** Whether the trap is active */
  isActive?: boolean;
  /** Element to trap focus within */
  containerRef: React.RefObject<HTMLElement | null>;
}

export interface UseHoverOptions {
  /** Delay in ms before hover is registered */
  enterDelay?: number;
  /** Delay in ms before hover is cleared */
  leaveDelay?: number;
}
