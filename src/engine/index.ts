/**
 * Engine Module
 *
 * Main entry point for the Engine.
 */

export * from "./theme";

// Navigation engine - explicit re-exports to avoid conflicts with theme engine
export type {
  RouteId,
  RouteGroup,
  RouteMetadata,
  RouteSEO,
  NavigationRoute,
  TransitionType as NavigationTransitionType,
  TransitionConfig,
  ScrollBehavior,
  ScrollRestorationConfig,
  NavigationGuard,
  GuardContext,
  GuardResult,
  BreadcrumbItem,
  BreadcrumbConfig,
  NavigationEngineState,
  NavigationEngineActions,
  NavigateOptions,
  NavigationState,
  NavigationActions,
  NavigationContextValue,
  NavigationRegistryConfig,
  UseNavigationRouteOptions,
  UseNavigationTransitionOptions,
} from "./navigation/types";

export {
  NAVIGATION_REGISTRY_DEFAULTS,
  NAVIGATION_STORAGE_KEY,
  SCROLL_POSITIONS_KEY,
  SCROLL_RESTORATION_DEFAULTS,
  TRANSITION_DEFAULTS,
  TRANSITION_DURATIONS,
  FOCUS_MANAGEMENT,
  KEYBOARD_NAV,
  PREFETCH,
  ROUTE_SEGMENTS,
  WORLD_ROUTE_PREFIX,
  A11Y,
} from "./navigation/constants";

export { NavigationRegistry, createNavigationRegistry } from "./navigation/registry";

export {
  useNavigationStore,
  selectActiveTransition,
  selectIsTransitioning,
  selectScrollPositions,
} from "./navigation/store";

export {
  NavigationActionsContext,
  NavigationStateContext,
  useNavigationActions,
  useNavigationState,
  useNavigationContext,
  useOptionalNavigationContext,
} from "./navigation/context";

export { NavigationProvider } from "./navigation/provider";

export {
  useNavigation,
  useNav,
  useCurrentPath,
  usePreviousPath,
  useIsNavigating,
  useNavigationDirection,
  useRoute,
  useAllRoutes,
  useVisibleRoutes,
  useRoutesByGroup,
  useCurrentRoute,
  useNavigateTo,
  useGoBack,
  useGoForward,
  useReplaceRoute,
  useNavigationTransition,
  useBreadcrumbs,
  useBreadcrumbsForPath,
  useScrollActions,
  usePrefetch,
  useNavigationAnnouncer,
  useIsActive,
  useActiveClassName,
} from "./navigation/hooks";

export { AnimatedRoutes, AnimatedPage } from "./navigation/animated-routes";

export {
  scrollPositionManager,
  useScrollRestoration,
  scrollToTop,
  scrollToElement,
} from "./navigation/scroll";

export { Breadcrumbs, BreadcrumbItemComponent } from "./navigation/breadcrumbs";

export {
  SkipLink,
  NavigationAnnouncer,
  useFocusTrap,
  useKeyboardNavigation,
  getNavAriaProps,
  getCurrentPageAriaProps,
  getActiveItemAriaProps,
} from "./navigation/accessibility";

export { RouteErrorBoundary, NotFoundPage, RouteErrorDisplay } from "./navigation/route-errors";

export {
  runGuards,
  createAuthGuard,
  createPermissionGuard,
  createFeatureFlagGuard,
  createConfirmationGuard,
  buildGuardContext,
} from "./navigation/guards";

export {
  normalizePath,
  joinPaths,
  getParentPath,
  getLastSegment,
  matchRoutePattern,
  extractParams,
  getTransitionConfig,
  isSlideTransition,
  getSlideDirection,
  generateBreadcrumbs,
  formatSegmentLabel,
  breadcrumbsToString,
  parseQuery,
  buildQuery,
  getHash,
  isExternalUrl,
  isBrowser,
} from "./navigation/utilities";

// ============================================================================
// Experience Engine
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
  InteractionState as ExperienceInteractionState,
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
} from "./experience/types";

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
  PERFORMANCE as EXPERIENCE_PERFORMANCE,
  A11Y as EXPERIENCE_A11Y,
} from "./experience/constants";

export {
  useExperienceStore,
  selectInteractionState,
  selectPointerPosition,
  selectPointerVelocity,
  selectCursorState,
  selectIsInitialized,
  selectReducedMotion,
  selectLifecyclePhase,
  selectActiveSceneId,
  selectSceneStates,
  selectPointerCount,
  selectIsVisible,
} from "./experience/store";

export {
  ExperienceActionsContext,
  ExperienceStateContext,
  useExperienceActions,
  useExperienceState,
  useExperienceContext,
  useOptionalExperienceContext,
} from "./experience/context";

export { ExperienceProvider } from "./experience/provider";

export { ExperienceRegistry, createExperienceRegistry } from "./experience/registry";

export {
  experienceEvents,
  onExperienceEvent,
  emitExperienceEvent,
  createEventGroup,
} from "./experience/events";

export { InputManager, createInputManager } from "./experience/input-manager";
export { PointerManager, createPointerManager } from "./experience/pointer-manager";
export { GestureManager, createGestureManager } from "./experience/gesture-manager";
export { FocusManager, createFocusManager } from "./experience/focus-manager";
export { HoverManager, createHoverManager } from "./experience/hover-manager";
export { SceneManager, createSceneManager } from "./experience/scene-manager";
export { LifecycleManager } from "./experience/lifecycle-manager";
export { StateSynchronization } from "./experience/state-sync";
export { InteractionManager, createInteractionManager } from "./experience/interaction-manager";

export {
  useExperience,
  useExperienceActionsOnly,
  useExperienceStateOnly,
  useInteractionState,
  usePointerPosition as useExperiencePointerPosition,
  usePointerVelocity as useExperiencePointerVelocity,
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
  useFocusTrap as useExperienceFocusTrap,
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
} from "./experience/hooks";

// ============================================================================
// Portal System
// ============================================================================

export type {
  PortalStatus,
  PortalActivationPhase,
  PortalDefinition,
  PortalBackground,
  PortalBackgroundOverlay,
  PortalIcon as PortalIconType,
  PortalAccent,
  PortalAnimationPreset as PortalAnimationPresetType,
  PortalTransitionPreset as PortalTransitionPresetType,
  PortalGridColumns,
  PortalGridConfig,
  PortalInteractionConfig,
  PortalState,
  PortalActions,
  PortalStore,
  PortalConfig,
  PortalRegistryEntry,
  PortalRegistryConfig,
  PortalMetadata,
  UsePortalReturn,
  UsePortalTransitionReturn,
  PortalCardProps,
  PortalGridProps,
  PortalIconProps,
  PortalGlowProps,
} from "./portal/types";

export {
  PORTAL_GRID_DEFAULTS,
  PORTAL_INTERACTION_DEFAULTS,
  PORTAL_ANIMATION_PRESETS,
  PORTAL_TRANSITION_PRESETS,
  PORTAL_STATUS_DEFAULTS,
  PORTAL_CONFIG_DEFAULTS,
  PORTAL_STORAGE_KEY,
  PORTAL_A11Y,
} from "./portal/constants";

export {
  validatePortal,
  validatePortals,
  isValidPortal,
  isValidPortalStatus,
  isValidAnimationPreset as isValidPortalAnimationPreset,
  isValidTransitionPreset as isValidPortalTransitionPreset,
} from "./portal/validation";

export { PortalRegistry } from "./portal/registry";

export {
  usePortalStore,
  selectSelectedPortalId,
  selectActivationPhase,
  selectHoveredPortalId,
  selectFocusedPortalId,
  selectIsGridReady,
  selectPortals,
  selectVisiblePortals,
  selectPortalById,
} from "./portal/store";

export {
  usePortal,
  useAllPortals,
  usePortalById,
  usePortalSearch,
  usePortalActions,
  usePortalStatus,
  usePortalTransition,
  usePortalFocusManager,
} from "./portal/hooks";

export {
  getNormalizedMouseOffset,
  depthTransform,
  magneticOffset,
  getPortalEntranceVariants,
  getPortalHoverVariants,
  getPortalActivationVariants,
  getPortalGridTransition,
} from "./portal/animations";

export { PortalTransitionManager } from "./portal/transition-manager";

export { usePortalNavigation } from "./portal/navigation";

export {
  getPortalMeta,
  clearPortalMetaCache,
  generatePortalStructuredData,
} from "./portal/metadata";

export {
  PortalCard,
  PortalGrid,
  PortalIcon,
  PortalGlow,
  PortalDepth,
  PortalMagnetic,
  PortalAnnouncer,
} from "./portal/components";

// ============================================================================
// World Engine
// ============================================================================

export type {
  WorldStatus,
  WorldLifecyclePhase,
  WorldDefinition,
  WorldLayoutType,
  WorldLayoutConfig,
  WorldAnimationPreset,
  WorldTransitionPreset,
  WorldBackgroundType,
  WorldBackground,
  WorldSequence,
  WorldSequenceStep,
  WorldAssets,
  WorldAsset,
  WorldPermissions,
  WorldMetadata,
  WorldInstanceState,
  WorldEngineState,
  WorldEngineActions,
  WorldStore,
  WorldRegistryEntry,
  WorldRegistryConfig,
  WorldCacheEntry,
  WorldCacheConfig,
  WorldModuleLoader,
  WorldLoaderConfig,
  WorldLoaderResult,
  WorldEventType,
  WorldEvent,
  WorldEventCallback,
  WorldEventUnsubscribe,
  WorldTransitionConfig,
  WorldTransitionStage,
  WorldTransitionState,
  WorldAssetManagerConfig,
  WorldAssetLoadState,
  WorldMemoryConfig,
  WorldMemoryStats,
  WorldErrorBoundaryProps,
  WorldErrorBoundaryState,
  WorldValidationResult,
  WorldMeta,
  UseWorldReturn,
  UseWorldLoaderReturn,
  UseWorldTransitionReturn,
  UseWorldEventsReturn,
  WorldManagerConfig,
} from "./world/types";

export {
  WORLD_STORAGE_KEY,
  VALID_LIFECYCLE_TRANSITIONS,
  LIFECYCLE_PHASE_LABELS,
  WORLD_REGISTRY_DEFAULTS,
  WORLD_LOADER_DEFAULTS,
  WORLD_CACHE_DEFAULTS,
  WORLD_MEMORY_DEFAULTS,
  WORLD_ASSET_MANAGER_DEFAULTS,
  WORLD_TRANSITION_DEFAULTS,
  WORLD_TRANSITION_PRESETS,
  WORLD_MANAGER_DEFAULTS,
  WORLD_PERFORMANCE,
  WORLD_A11Y,
  WORLD_ERRORS,
  WORLD_DEBUG,
} from "./world/constants";

export { WorldRegistry } from "./world/registry";
export { WorldEventBus } from "./world/events";
export { WorldCache } from "./world/cache";
export { WorldLoader } from "./world/loader";
export { WorldLifecycle } from "./world/lifecycle";
export { WorldTransitionManager } from "./world/transitions";
export { WorldMemoryManager } from "./world/memory";
export { WorldAssetManager } from "./world/assets";
export { WorldManager } from "./world/manager";

export {
  validateWorld,
  validateWorlds,
  isValidWorldId,
  isValidWorldStatus,
  isValidAnimationPreset as isValidWorldAnimationPreset,
  isValidTransitionPreset as isValidWorldTransitionPreset,
} from "./world/validation";

export {
  getWorldMeta,
  clearWorldMetaCache,
  generateWorldStructuredData,
  applyWorldMeta,
  resetWorldMeta,
} from "./world/metadata";

export {
  useWorldStore,
  selectCurrentWorldId as selectWorldCurrentWorldId,
  selectPreviousWorldId as selectWorldPreviousWorldId,
  selectLoadingWorldId as selectWorldLoadingWorldId,
  selectTransitioning as selectWorldTransitioning,
  selectWorldInstances,
  selectRegisteredWorlds,
  selectReadyWorlds,
  selectCachedWorlds,
  selectWorldInstance,
} from "./world/store";

export {
  WorldActionsContext as WorldEngineActionsContext,
  WorldStateContext as WorldEngineStateContext,
  useWorldActions as useWorldEngineActions,
  useWorldState as useWorldEngineState,
  useOptionalWorldActions as useOptionalWorldEngineActions,
  useOptionalWorldState as useOptionalWorldEngineState,
} from "./world/context";

export { WorldProvider as WorldEngineProvider } from "./world/provider";

export {
  useWorld,
  useCurrentWorld,
  useWorldLoader,
  useWorldTransition,
  useWorldEvents,
  useWorldPhase,
  useIsWorldReady,
  useIsWorldCached,
  useWorldSwitcher,
} from "./world/hooks";

export { WorldErrorBoundary } from "./world/error-boundary";
