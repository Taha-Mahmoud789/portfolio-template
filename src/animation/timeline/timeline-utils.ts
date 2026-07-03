/**
 * Timeline Utilities
 *
 * Utility functions for working with timelines.
 */

/** Get timeline duration in seconds */
export function getTimelineDuration(timeline: { duration(): number }): number {
  return timeline.duration();
}

/** Get timeline progress */
export function getTimelineProgress(timeline: { progress(): number }): number {
  return timeline.progress();
}

/** Check if timeline is playing */
export function isTimelinePlaying(timeline: { isActive(): boolean }): boolean {
  return timeline.isActive();
}

/** Check if timeline is paused */
export function isTimelinePaused(timeline: { paused(): boolean }): boolean {
  return timeline.paused();
}

/** Check if timeline is reversed */
export function isTimelineReversed(timeline: { reversed(): boolean }): boolean {
  return timeline.reversed();
}

/** Get total number of tweens in timeline */
export function getTweenCount(timeline: {
  getChildren(a: boolean, b: boolean, c: boolean): unknown[];
}): number {
  return timeline.getChildren(false, false, true).length;
}

/** Get total duration including repeats */
export function getTotalDuration(timeline: { totalDuration(): number }): number {
  return timeline.totalDuration();
}

/** Convert timeline to JSON for debugging */
export function timelineToJSON(timeline: {
  duration(): number;
  progress(): number;
  isActive(): boolean;
  paused(): boolean;
  reversed(): boolean;
  repeat(): number;
  getChildren(a: boolean, b: boolean, c: boolean): unknown[];
}): Record<string, unknown> {
  return {
    duration: timeline.duration(),
    progress: timeline.progress(),
    isActive: timeline.isActive(),
    isPaused: timeline.paused(),
    isReversed: timeline.reversed(),
    repeat: timeline.repeat(),
    tweenCount: getTweenCount(timeline),
  };
}
