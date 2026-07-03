/**
 * Global Error Handler
 *
 * Catches unhandled errors and promise rejections at the window level.
 * Only allocates a flush timer when errors exist — zero cost when clean.
 */

import { LOG_PREFIXES } from "../config/constants";
import type { ErrorHandlerConfig } from "../types";

const DEFAULT_CONFIG: ErrorHandlerConfig = {
  logToConsole: true,
  reportToService: false,
  maxBufferSize: 50,
  flushInterval: 30000,
};

interface BufferedError {
  message: string;
  stack?: string;
  timestamp: number;
  type: "window.error" | "unhandled.rejection" | "react.error";
  source?: string;
  line?: number;
  column?: number;
}

let buffer: BufferedError[] = [];
let flushTimer: ReturnType<typeof setInterval> | null = null;
let config: ErrorHandlerConfig = DEFAULT_CONFIG;
let isInitialized = false;

function formatError(error: BufferedError): string {
  const parts = [`${LOG_PREFIXES.ERROR} [${error.type}]`, error.message];
  if (error.source) parts.push(`at ${error.source}:${String(error.line)}:${String(error.column)}`);
  return parts.join(" ");
}

function flushBuffer(): void {
  if (buffer.length === 0) {
    stopTimer();
    return;
  }

  const errors = [...buffer];
  buffer = [];

  if (config.logToConsole) {
    for (const error of errors) {
      console.error(formatError(error));
    }
  }

  // Future: if (config.reportToService) errorService.reportBatch(errors);
}

function startTimer(): void {
  if (flushTimer) return;
  flushTimer = setInterval(flushBuffer, config.flushInterval);
}

function stopTimer(): void {
  if (flushTimer) {
    clearInterval(flushTimer);
    flushTimer = null;
  }
}

function bufferError(error: BufferedError): void {
  buffer.push(error);

  // Deduplicate by message
  const seen = new Set<string>();
  buffer = buffer.filter((e) => {
    if (seen.has(e.message)) return false;
    seen.add(e.message);
    return true;
  });

  if (buffer.length >= config.maxBufferSize) {
    flushBuffer();
  } else {
    startTimer();
  }
}

function handleWindowError(
  message: string | Event,
  source?: string,
  lineno?: number,
  colno?: number,
  error?: Error,
): void {
  bufferError({
    message: typeof message === "string" ? message : message.type,
    stack: error?.stack,
    timestamp: Date.now(),
    type: "window.error",
    source,
    line: lineno,
    column: colno,
  });
}

function handleUnhandledRejection(event: PromiseRejectionEvent): void {
  const reason: unknown = event.reason;
  bufferError({
    message: reason instanceof Error ? reason.message : String(reason),
    stack: reason instanceof Error ? reason.stack : undefined,
    timestamp: Date.now(),
    type: "unhandled.rejection",
  });
}

export function initGlobalErrorHandler(customConfig?: Partial<ErrorHandlerConfig>): void {
  if (isInitialized) return;
  config = { ...DEFAULT_CONFIG, ...customConfig };
  window.addEventListener("error", handleWindowError as unknown as EventListener);
  window.addEventListener("unhandledrejection", handleUnhandledRejection);
  isInitialized = true;
}

export function destroyGlobalErrorHandler(): void {
  window.removeEventListener("error", handleWindowError as unknown as EventListener);
  window.removeEventListener("unhandledrejection", handleUnhandledRejection);
  stopTimer();
  flushBuffer();
  isInitialized = false;
}

export function reportError(error: Error, context?: string): void {
  bufferError({
    message: context ? `[${context}] ${error.message}` : error.message,
    stack: error.stack,
    timestamp: Date.now(),
    type: "react.error",
  });
}
