/**
 * Project Case Study Data System
 *
 * Reusable data structure for all project case studies.
 * Each project includes: overview, role, tech stack, process, results, key decision.
 */

// ============================================================================
// Types
// ============================================================================

export interface ProjectOverview {
  goal: string;
  problem: string;
  solution: string;
}

export interface ProjectRole {
  area: string;
  description: string;
}

export interface ProjectTechStack {
  category: string;
  items: string[];
}

export interface ProjectProcessStep {
  phase: string;
  title: string;
  description: string;
  duration: string;
}

export interface ProjectResult {
  metric: string;
  value: string;
  description: string;
}

export interface ProjectKeyDecision {
  question: string;
  answer: string;
  tradeoff: string;
}

export interface ProjectCaseStudy {
  id: string;
  number: number;
  title: string;
  shortDescription: string;
  category: string;
  accentColor: string;
  accentRgb: string;
  overview: ProjectOverview;
  role: ProjectRole[];
  techStack: ProjectTechStack[];
  process: ProjectProcessStep[];
  results: ProjectResult[];
  keyDecision: ProjectKeyDecision;
  liveUrl?: string;
  githubUrl?: string;
  nextProjectId: string | null;
}

// ============================================================================
// Project Data
// ============================================================================

export const PROJECTS: Record<string, ProjectCaseStudy> = {
  "frontend-multiverse": {
    id: "frontend-multiverse",
    number: 1,
    title: "Frontend Multiverse",
    shortDescription:
      "I built a portfolio that doesn't scroll like a normal website. It uses portal transitions between 3D worlds, a custom cursor system, and scroll-driven animations — all running at 60fps.",
    category: "Portfolio",
    accentColor: "#6366f1",
    accentRgb: "99, 102, 241",
    overview: {
      goal: "Create a portfolio that proves I can build complex, performant web experiences — not just arrange divs in a grid.",
      problem: "Every developer portfolio looks the same. Hero, skills grid, project cards, contact form. I wanted something that would make someone stop scrolling and actually look at what I built.",
      solution: "Built a portal-based navigation system where each section is a 'world' with its own 3D background, visual identity, and animation language. The cursor changes between worlds. The navigation adapts. Every section feels like a different place.",
    },
    role: [
      {
        area: "Frontend Architecture",
        description: "Set up React 19 with TypeScript strict mode. Designed the component hierarchy so each 'world' is isolated but shares a common animation layer. Built the portal routing system that handles transitions without page reloads.",
      },
      {
        area: "UI Engineering",
        description: "Created the glass morphism design system from scratch — 20+ CSS custom properties, consistent blur values, border opacity scales. Built the floating pill navigation that morphs between states.",
      },
      {
        area: "Animation",
        description: "Implemented GSAP-powered scroll reveals, hover orchestration on project cards, page transitions with perspective shifts, and a custom cursor with glow effects that responds to the element underneath.",
      },
      {
        area: "Performance",
        description: "Lazy-loaded Three.js scenes per world. Used IntersectionObserver to pause off-screen animations. Code-split with React.lazy. Got Lighthouse to 98 without sacrificing visual quality.",
      },
    ],
    techStack: [
      {
        category: "Core",
        items: ["React 19", "TypeScript", "Vite"],
      },
      {
        category: "Animation",
        items: ["GSAP", "ScrollTrigger", "Three.js"],
      },
      {
        category: "Styling",
        items: ["Tailwind CSS", "CSS Custom Properties"],
      },
      {
        category: "Infrastructure",
        items: ["Lenis", "Zustand", "React Router"],
      },
    ],
    process: [
      {
        phase: "01",
        title: "Research",
        description: "Studied 50+ Awwwards portfolios. Found that the best ones share one thing: each section has a distinct visual identity, not just different content in the same layout.",
        duration: "1 week",
      },
      {
        phase: "02",
        title: "Design",
        description: "Defined 10 visual 'worlds' with unique color palettes, background treatments, and animation languages. Designed the portal transition system — how perspective shifts when moving between worlds.",
        duration: "2 weeks",
      },
      {
        phase: "03",
        title: "Build",
        description: "Developed the core architecture first: portal routing, animation engine integration, shared state. Then built each world as an isolated component that plugs into the system.",
        duration: "4 weeks",
      },
      {
        phase: "04",
        title: "Optimize",
        description: "Profiled every animation. Cut anything that dropped below 60fps. Replaced expensive blur filters with GPU-accelerated transforms. Added reduced-motion support throughout.",
        duration: "1 week",
      },
    ],
    results: [
      {
        metric: "Performance",
        value: "98",
        description: "Lighthouse score. Three.js scenes lazy-loaded, animations GPU-accelerated.",
      },
      {
        metric: "Accessibility",
        value: "100",
        description: "Full keyboard navigation, screen reader support, prefers-reduced-motion respected.",
      },
      {
        metric: "Bundle Size",
        value: "-62%",
        description: "After code splitting. Each world loads independently.",
      },
      {
        metric: "Frame Rate",
        value: "60fps",
        description: "Verified with Chrome DevTools. No jank on mid-range hardware.",
      },
    ],
    keyDecision: {
      question: "Why build a custom portal system instead of using React Router's built-in transitions?",
      answer: "React Router handles URL changes, not visual transitions. I needed perspective shifts, background crossfades, and cursor state changes that happen simultaneously. A custom system gave me control over the entire transition choreography.",
      tradeoff: "More code to maintain, but the result is a transition that feels intentional rather than generic.",
    },
    liveUrl: "#",
    githubUrl: "#",
    nextProjectId: "ai-architecture-studio",
  },
  "ai-architecture-studio": {
    id: "ai-architecture-studio",
    number: 2,
    title: "AI Architecture Studio",
    shortDescription:
      "A SaaS tool that generates UI component variations from design system tokens. I built the frontend architecture with Next.js, the real-time preview system, and integrated a Python ML backend.",
    category: "SaaS Platform",
    accentColor: "#a855f7",
    accentRgb: "168, 85, 247",
    overview: {
      goal: "Reduce the time teams spend building repetitive UI components by automating variations from existing design system tokens.",
      problem: "Design systems have tokens, components, and patterns — but teams still manually build every variation. A button alone might need 12 states: default, hover, focus, disabled, loading, with icon, without icon, small, medium, large, on dark, on light. The repetition kills velocity.",
      solution: "Built a platform where you define your design tokens once, and the ML model generates component variations that match your system's visual language. Real-time preview lets you see changes instantly. Export production-ready code.",
    },
    role: [
      {
        area: "Frontend Architecture",
        description: "Designed the Next.js app structure with server components for the dashboard and client components for the editor. Built the component preview system that renders variations in real-time.",
      },
      {
        area: "UI Engineering",
        description: "Created the token editor, component library browser, and AI suggestion panel. Every interaction has Framer Motion transitions — panel switches, preview updates, loading states.",
      },
      {
        area: "Animation",
        description: "Added Framer Motion for panel transitions, component preview crossfades, and the suggestion panel slide-in. Kept animations subtle — this is a tool, not a portfolio.",
      },
      {
        area: "Optimization",
        description: "Implemented virtual scrolling for libraries with 500+ components. Debounced AI requests to prevent API spam during rapid token edits. Used React Server Components for the dashboard.",
      },
    ],
    techStack: [
      {
        category: "Frontend",
        items: ["Next.js 14", "TypeScript", "React Server Components"],
      },
      {
        category: "Backend",
        items: ["Python", "FastAPI", "TensorFlow Lite"],
      },
      {
        category: "Data",
        items: ["PostgreSQL", "Prisma", "Redis"],
      },
      {
        category: "Infrastructure",
        items: ["Vercel", "Docker", "GitHub Actions"],
      },
    ],
    process: [
      {
        phase: "01",
        title: "Research",
        description: "Interviewed 8 design system teams. Found that 70% of their component maintenance is repetitive variation work. The high-impact opportunity was automating the token-to-component pipeline.",
        duration: "2 weeks",
      },
      {
        phase: "02",
        title: "Design",
        description: "Designed the three-panel layout: tokens on the left, preview in the center, AI suggestions on the right. Built the component variation grid that shows all states at once.",
        duration: "2 weeks",
      },
      {
        phase: "03",
        title: "Build",
        description: "Developed the Next.js frontend, Python ML backend, and the real-time sync layer. The hardest part was making the preview feel instant — it pre-renders variations in a web worker.",
        duration: "6 weeks",
      },
      {
        phase: "04",
        title: "Optimize",
        description: "Fine-tuned the TensorFlow model to generate variations in under 200ms. Added optimistic updates so the UI never waits for the backend. Implemented error boundaries for graceful degradation.",
        duration: "2 weeks",
      },
    ],
    results: [
      {
        metric: "Generation Speed",
        value: "<200ms",
        description: "From token input to rendered component variation. Pre-rendering in web workers.",
      },
      {
        metric: "Accuracy",
        value: "94%",
        description: "Variations that match the design system's visual language without manual adjustment.",
      },
      {
        metric: "Time Saved",
        value: "3.2hrs/day",
        description: "Per design system team. Measured over 4 weeks of beta testing.",
      },
      {
        metric: "Adoption",
        value: "12 teams",
        description: "Active users after 6 weeks of beta. 8 teams upgraded to paid plan.",
      },
    ],
    keyDecision: {
      question: "Why use TensorFlow Lite in the browser instead of running inference on the server?",
      answer: "Server-side inference adds 50-100ms of network latency per request. For a real-time preview system, that's unacceptable. TFLite runs the model client-side in under 50ms, making the preview feel instant.",
      tradeoff: "Larger initial bundle (12MB), but the model is lazy-loaded only when the editor opens. Server-side would have been simpler but slower.",
    },
    liveUrl: "#",
    githubUrl: "#",
    nextProjectId: "window-corner",
  },
  "window-corner": {
    id: "window-corner",
    number: 3,
    title: "Window Corner",
    shortDescription:
      "A desktop environment recreated in the browser — window management, drag-and-drop, live app containers, and spatial audio. The technical challenge was rendering multiple animated windows without frame drops.",
    category: "Creative Tool",
    accentColor: "#06b6d4",
    accentRgb: "6, 182, 212",
    overview: {
      goal: "Build a browser-based desktop environment that handles multiple simultaneous windows, drag-and-drop, and spatial audio — all at 60fps.",
      problem: "Web apps are single-purpose tabs. The vision was a unified workspace where multiple apps coexist in a spatial environment. You could have a code editor, a terminal, and a preview window open simultaneously, all draggable and resizable.",
      solution: "Built a Canvas-based renderer with a custom windowing system. Each window is an independent component with its own state. Drag-and-drop uses pointer events for cross-browser compatibility. Spatial audio responds to window positions.",
    },
    role: [
      {
        area: "Frontend Architecture",
        description: "Designed the canvas rendering pipeline that handles 12+ simultaneous windows. Built the window state management with Zustand — each window tracks position, size, z-index, and focus state.",
      },
      {
        area: "UI Engineering",
        description: "Built the window chrome (title bar, close/minimize/maximize buttons), taskbar with app switching, and start menu with search. Every pixel is intentional — the chrome looks native but is entirely web-based.",
      },
      {
        area: "Animation",
        description: "Implemented window open/close animations with scale and opacity, minimize-to-taskbar with path animation, and smooth dragging with momentum. All powered by GSAP for consistent timing.",
      },
      {
        area: "Optimization",
        description: "Used offscreen canvas for background windows. Implemented virtual memory management — inactive windows are frozen and restored on focus. Spatial audio uses the Web Audio API's panner nodes.",
      },
    ],
    techStack: [
      {
        category: "Core",
        items: ["TypeScript", "React", "Zustand"],
      },
      {
        category: "Rendering",
        items: ["Canvas API", "WebGL", "OffscreenCanvas"],
      },
      {
        category: "Audio",
        items: ["Web Audio API", "Spatial Audio", "Panner Nodes"],
      },
      {
        category: "Infrastructure",
        items: ["Vite", "Turborepo", "Vitest"],
      },
    ],
    process: [
      {
        phase: "01",
        title: "Research",
        description: "Studied how OS window managers handle focus, z-index stacking, and snap zones. Analyzed canvas performance benchmarks — found that the bottleneck is redraw frequency, not draw complexity.",
        duration: "1 week",
      },
      {
        phase: "02",
        title: "Design",
        description: "Designed the window chrome to match native OS aesthetics. Defined the snap zones (top = maximize, sides = half-screen). Created the spatial audio model: sound panning follows window position.",
        duration: "2 weeks",
      },
      {
        phase: "03",
        title: "Build",
        description: "Developed the canvas renderer first — it handles all window drawing. Then built the window management layer on top: drag-and-drop, resize, snap zones, focus tracking. Integrated live app containers last.",
        duration: "5 weeks",
      },
      {
        phase: "04",
        title: "Optimize",
        description: "Implemented offscreen rendering for background windows. Added virtual memory management — windows freeze when unfocused, restore instantly on focus. Tuned spatial audio to use minimal CPU.",
        duration: "2 weeks",
      },
    ],
    results: [
      {
        metric: "Frame Rate",
        value: "60fps",
        description: "With 8+ animated windows. Verified with Chrome DevTools Performance panel.",
      },
      {
        metric: "Window Limit",
        value: "12+",
        description: "Concurrent windows before memory management kicks in. Tested on 8GB RAM machines.",
      },
      {
        metric: "Audio Latency",
        value: "<8ms",
        description: "Spatial audio response time. Web Audio API panner nodes with HRTF.",
      },
      {
        metric: "Cold Start",
        value: "1.2s",
        description: "From first paint to interactive desktop. Canvas initializes in a web worker.",
      },
    ],
    keyDecision: {
      question: "Why use Canvas instead of DOM elements for window rendering?",
      answer: "DOM elements each trigger layout recalculation when moved. With 12+ windows being dragged simultaneously, that's 12+ layout recalcs per frame. Canvas redraws everything in a single paint pass — no layout thrashing.",
      tradeoff: "Lost native DOM accessibility and event handling. Had to rebuild focus management and keyboard navigation from scratch.",
    },
    liveUrl: "#",
    githubUrl: "#",
    nextProjectId: "frontend-multiverse",
  },
};

// ============================================================================
// Helpers
// ============================================================================

export function getProjectById(id: string): ProjectCaseStudy | undefined {
  return PROJECTS[id];
}

export function getAllProjectIds(): string[] {
  return Object.keys(PROJECTS);
}

export function getProjectSlugs(): string[] {
  return Object.keys(PROJECTS);
}
