# Frontend Multiverse

A developer portfolio built with React 19, TypeScript, Three.js, and GSAP. It features an interactive 3D portal system with ten themed worlds and a clean editorial landing page.

This project was built to explore how far a single-developer frontend project can go when you care about architecture, performance, and developer experience from day one.

---

## What's in it

**Landing page** — Cinematic text reveals, scroll-triggered section entrances, time-aware greeting, fluid typography, and full `prefers-reduced-motion` support.

**3D portal system** — An interactive portal with particle effects that opens into ten themed worlds (Space, Cyberpunk, Apple, Gaming, AI, Editorial, Liquid, Retro, Brutalist, Experimental). Each world has its own scene, camera system, and visual identity.

**Project case studies** — Individual pages for each project with GSAP-powered scroll animations and dynamic content.

---

## Tech stack

| Category     | Technology                          |
| ------------ | ----------------------------------- |
| Framework    | React 19, TypeScript 5              |
| Build        | Vite 6                              |
| Styling      | Tailwind CSS 4                      |
| Animation    | GSAP 3, Framer Motion               |
| 3D           | Three.js, React Three Fiber         |
| State        | Zustand                             |
| Routing      | React Router 7                      |
| Scroll       | Lenis                               |
| Code Quality | ESLint, Prettier, Husky, Commitlint |

---

## Project structure

```
src/
├── animation/          # GSAP animation system, presets, hooks
├── app/                # App entry, providers
├── components/         # Shared UI component library
├── config/             # Application configuration
├── constants/          # Shared constants
├── engine/             # 3D engine (camera, scene, rendering, theme)
├── hooks/              # Shared React hooks
├── infrastructure/     # Analytics, bootstrap
├── landing/            # Landing page sections and components
│   ├── components/     # Hero, About, Projects, Contact, etc.
│   ├── hooks/          # Landing-specific hooks
│   └── projects/       # Project case study pages
├── layouts/            # Layout components
├── pages/              # Route page components
├── providers/          # Context providers (Lenis, Portal)
├── router/             # Route configuration
├── sdk/                # World configuration SDK
├── store/              # Zustand stores
├── styles/             # Global CSS, Tailwind config
├── theme/              # Theme system
├── types/              # Shared TypeScript types
├── utils/              # Utility functions
└── worlds/             # 3D world scenes
```

---

## Getting started

### Prerequisites

- Node.js >= 18

### Installation

```bash
git clone https://github.com/taha-mahmoud/frontend-multiverse.git
cd frontend-multiverse
npm install
```

### Development

```bash
npm run dev
```

Opens at `http://localhost:5173`

### Commands

| Command                | Description                         |
| ---------------------- | ----------------------------------- |
| `npm run dev`          | Start development server            |
| `npm run build`        | Type-check and build for production |
| `npm run preview`      | Preview production build locally    |
| `npm run lint`         | Run ESLint                          |
| `npm run lint:fix`     | Auto-fix lint issues                |
| `npm run format`       | Format code with Prettier           |
| `npm run format:check` | Check formatting                    |
| `npm run typecheck`    | Run TypeScript type checker         |

---

## Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/taha-mahmoud/frontend-multiverse)

Pre-configured with SPA fallback rewrites, security headers, and immutable cache headers for assets.

### Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/taha-mahmoud/frontend-multiverse)

Pre-configured with SPA redirect fallback, security headers, and asset caching.

### Manual

```bash
npm run build
# Upload the dist/ folder to any static host
```

---

## Environment variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable                 | Description                    | Default               |
| ------------------------ | ------------------------------ | --------------------- |
| `VITE_APP_TITLE`         | Browser tab title              | `Frontend Multiverse` |
| `VITE_BASE_URL`          | Base URL for routing           | `/`                   |
| `VITE_GA_MEASUREMENT_ID` | Google Analytics ID (optional) | —                     |
| `VITE_DEBUG_MODE`        | Enable debug panel             | `false`               |
| `VITE_ANALYTICS_ENABLED` | Enable analytics               | `false`               |

---

## What I learned

**Animation architecture matters more than animation quantity.** A reusable GSAP context pattern (`useScrollReveal`) replaced duplicated IntersectionObserver + animation logic across 7+ components. The lesson: build the abstraction first, not after the third copy-paste.

**3D on the web is a deployment problem, not just a code problem.** React Three Fiber makes Three.js ergonomic, but lazy-loading worlds, managing GPU memory, and handling `prefers-reduced-motion` across both 2D and 3D required thinking about the whole system, not just individual scenes.

**Developer experience compounds.** ESLint + Prettier + Husky + Commitlint felt like overhead at first, but caught real issues before they reached code review. The strict TypeScript config paid for itself in refactoring confidence.

**Dead code is a design smell.** Removing 2,000 lines of unused components, hooks, and utilities revealed that the original architecture had too many abstractions before the product was stable. The rewrite taught me to earn abstractions through repetition, not anticipation.

---

## Known limitations

- **No real content yet** — Project case studies use placeholder data. The architecture is built for real content, but the copy and images need to be filled in.
- **3D worlds are simple** — Each world is a themed scene with basic geometry and materials. They demonstrate the architecture but aren't production-quality 3D experiences.
- **No analytics integration** — The env vars are set up, but Google Analytics isn't wired into the landing page components yet.
- **No test suite** — The project uses type checking and linting instead of unit tests. For a portfolio site this was a deliberate trade-off; for a product, I'd add Vitest.
- **Responsive breakpoints are limited** — The landing page uses fluid typography (`clamp`) which handles most cases, but the 3D portal has limited mobile interaction support.

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

## Contact

**Taha Mahmoud**

- GitHub: [@taha-mahmoud](https://github.com/taha-mahmoud)
- LinkedIn: [taha-mahmoud](https://linkedin.com/in/taha-mahmoud)
- Email: [hello@taha.dev](mailto:hello@taha.dev)
