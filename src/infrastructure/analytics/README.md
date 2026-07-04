# Analytics & Experience Intelligence System

## Overview

Lightweight measurement system for tracking user intent, engagement, and performance. All analytics are optional, environment-driven, and removable without code changes.

**7 typed events. 5 providers. 0 runtime cost when disabled.**

## Architecture

```
src/infrastructure/analytics/
├── index.ts                    # Public API exports
├── types.ts                    # Strict event type definitions
├── tracker.ts                  # Core trackEvent() function
├── provider.tsx                # AnalyticsProvider (initializes everything)
├── performance.ts              # Core Web Vitals monitoring
└── providers/
    ├── console-provider.ts     # Dev-only console logging
    ├── ga-provider.ts          # Google Analytics (gtag.js)
    ├── plausible-provider.ts   # Plausible (privacy-first)
    ├── sentry-provider.ts      # Sentry error monitoring
    └── vercel-provider.ts      # Vercel Analytics

src/hooks/
└── use-analytics.ts            # React hook for typed event tracking
```

## Setup

### 1. Environment Variables

Add to `.env.local` (never commit secrets):

```bash
# Master switch — set to "true" to enable
VITE_ANALYTICS_ENABLED=true

# Debug mode — logs events to console
VITE_ANALYTICS_DEBUG=true

# Google Analytics
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Plausible (privacy-first alternative)
VITE_PLAUSIBLE_DOMAIN=yourdomain.com
VITE_PLAUSIBLE_URL=https://plausible.io/js/script.js

# Vercel Analytics
VITE_VERCEL_ANALYTICS=true

# Sentry Error Monitoring
VITE_SENTRY_DSN=https://xxx@sentry.io/xxx
VITE_SENTRY_TRACES_SAMPLE_RATE=0.1
```

### 2. No keys → No tracking

When `VITE_ANALYTICS_ENABLED` is not set or `false`:

- No external scripts load
- No network requests fire
- All tracking calls are no-ops
- In development, console logging is enabled automatically

## Tracked Events

### Navigation — User Intent

| Event           | Properties              | Description                    |
| --------------- | ----------------------- | ------------------------------ |
| `nav_click`     | `destination`, `source` | Navigation link clicked        |
| `hero_interact` | `action`                | Hero CTA or scroll cue clicked |

### Multiverse — Funnel & Engagement

| Event                       | Properties                 | Description             |
| --------------------------- | -------------------------- | ----------------------- |
| `multiverse_entered`        | `referrer`                 | Entered multiverse hub  |
| `multiverse_world_selected` | `worldId`, `worldName`     | World selected from hub |
| `multiverse_exited`         | `destination`, `timeSpent` | Exited multiverse       |

### Project — Case Study Depth

| Event                  | Properties              | Description               |
| ---------------------- | ----------------------- | ------------------------- |
| `project_opened`       | `projectId`, `referrer` | Case study page opened    |
| `project_section_view` | `projectId`, `section`  | Case study section viewed |

### Performance — Core Web Vitals

| Event       | Properties                           | Description             |
| ----------- | ------------------------------------ | ----------------------- |
| `web_vital` | `name`, `value`, `rating`, `delta`   | Core Web Vital measured |
| `page_load` | `path`, `loadTime`, `navigationType` | Page load performance   |

### Error Tracking

Errors are tracked via `trackComponentError()` from the `useAnalytics` hook, not typed events. This sends to configured error providers (Sentry, console).

## Usage

### React Component

```tsx
import { useAnalytics } from "@/hooks";

function ProjectCard({ projectId }: { projectId: string }) {
  const { track } = useAnalytics("ProjectCard");

  const handleOpen = () => {
    track("project_opened", {
      projectId,
      referrer: document.referrer || "direct",
    });
  };

  return <button onClick={handleOpen}>View Case Study</button>;
}
```

### Non-React Code

```ts
import { trackEvent } from "@/infrastructure/analytics";

trackEvent("multiverse_world_selected", {
  worldId: "code",
  worldName: "Code",
});
```

### Error Tracking

```tsx
import { useAnalytics } from "@/hooks";

function RiskyComponent() {
  const { trackComponentError } = useAnalytics("RiskyComponent");

  const handleError = (error: Error) => {
    trackComponentError(error, "data_fetch");
  };

  return <ErrorBoundary onError={handleError}>...</ErrorBoundary>;
}
```

## Performance Monitoring

Automatically tracks Core Web Vitals using PerformanceObserver API:

- **LCP** (Largest Contentful Paint) — how fast the main content loads
- **CLS** (Cumulative Layout Shift) — visual stability
- **INP** (Interaction to Next Paint) — responsiveness
- **FCP** (First Contentful Paint) — first visual feedback
- **TTFB** (Time to First Byte) — server response time

Each metric is rated as "good", "needs-improvement", or "poor" based on web-vitals thresholds.

## User Journey Map

### Recruiter Path

```
Home → Projects → Case Study → Back
```

**Key events:** `nav_click`, `project_opened`, `project_section_view`

### Multiverse Explorer Path

```
Home → Multiverse → Explore Worlds → Back to Portfolio
```

**Key events:** `hero_interact`, `multiverse_entered`, `multiverse_world_selected`, `multiverse_exited`

### Developer Path

```
Home → Multiverse → Code Universe → Back → Projects
```

**Key events:** `multiverse_entered`, `multiverse_world_selected`, `project_opened`

## Privacy

- No cookies set
- No personal data tracked
- No cross-site tracking
- Plausible is GDPR compliant by default
- All data is anonymous (viewport, language, page paths)
- Users can opt out via Do Not Track header

## Connecting Tools

### Google Analytics

1. Create a GA4 property at https://analytics.google.com
2. Copy the Measurement ID (G-XXXXXXXXXX)
3. Set `VITE_GA_MEASUREMENT_ID` in `.env.local`
4. Set `VITE_ANALYTICS_ENABLED=true`

### Plausible

1. Sign up at https://plausible.io
2. Add your domain
3. Set `VITE_PLAUSIBLE_DOMAIN` in `.env.local`
4. Set `VITE_ANALYTICS_ENABLED=true`

### Vercel Analytics

1. Enable in Vercel dashboard → Project → Analytics
2. Set `VITE_VERCEL_ANALYTICS=true`
3. Install `@vercel/analytics` package
4. Uncomment the import in `vercel-provider.ts`

### Sentry

1. Create a project at https://sentry.io
2. Copy the DSN
3. Set `VITE_SENTRY_DSN` in `.env.local`
4. Install `@sentry/react` package
5. Uncomment the init call in `sentry-provider.ts`

## Removing Analytics

To completely remove analytics:

1. Delete `src/infrastructure/analytics/` directory
2. Delete `src/hooks/use-analytics.ts`
3. Remove `AnalyticsProvider` from `src/app/App.tsx`
4. Remove `useAnalytics` imports from components
5. Remove `VITE_ANALYTICS_*` from `.env`

The app works identically without analytics — all tracking calls are no-ops when disabled.
