export type AppEnvironment = "development" | "staging" | "production";

export interface AppConfig {
  readonly title: string;
  readonly version: string;
  readonly environment: AppEnvironment;
  readonly baseUrl: string;
  readonly debug: boolean;
  readonly analyticsEnabled: boolean;
}
