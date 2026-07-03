/**
 * Timeline Index
 *
 * All timeline utilities for the animation engine.
 */

export { createTimeline, createLoopingTimeline, createStaggeredTimeline } from "./create-timeline";
export type { TimelineOptions, TimelineStep } from "./create-timeline";

export {
  createPageEntranceTimeline,
  createCardRevealTimeline,
  createMenuOpenTimeline,
  createModalTimeline,
} from "./timeline-presets";

export {
  getTimelineDuration,
  getTimelineProgress,
  isTimelinePlaying,
  isTimelinePaused,
  isTimelineReversed,
  getTweenCount,
  getTotalDuration,
  timelineToJSON,
} from "./timeline-utils";
