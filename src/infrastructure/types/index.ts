export type AppEnvironment = "development" | "staging" | "production";

export interface AppConfig {
  readonly title: string;
  readonly version: string;
  readonly environment: AppEnvironment;
  readonly baseUrl: string;
  readonly debug: boolean;
  readonly analyticsEnabled: boolean;
}

export interface FeatureFlag {
  readonly key: string;
  readonly description: string;
  readonly enabled: boolean;
}

export type FeatureFlagsConfig = Record<string, FeatureFlag>;

export interface ErrorHandlerConfig {
  logToConsole: boolean;
  reportToService: boolean;
  maxBufferSize: number;
  flushInterval: number;
}

export interface BootstrapResult {
  success: boolean;
  errors: Error[];
  timing: {
    start: number;
    end: number;
    duration: number;
  };
}
