# How to Update the Portfolio

All content lives in `src/content/`. Change data here → everything updates automatically.

## Add a New Project

1. Open `src/content/projects.ts`
2. Add one entry to the `PROJECTS` array:

```ts
{
  id: "my-project",
  slug: "my-project",
  number: 4,
  title: "My Project",
  description: "Short description for cards and previews.",
  category: "Category Label",
  year: "2026",
  accentColor: "#hex",
  accentRgb: "r, g, b",
  hero: {
    category: "Category Label",
    year: "2026",
    role: "Your Role",
    technologies: ["React", "TypeScript"],
    description: "Full description for case study hero.",
  },
  overview: {
    challenge: "What problem did this solve?",
    idea: "What was the approach?",
    solution: "What was built?",
  },
  meta: {
    role: "Your Role",
    timeline: "6 weeks",
    stack: ["React", "TypeScript", "Tailwind CSS"],
    responsibilities: ["Frontend Development", "UI Implementation"],
  },
  showcase: [
    { label: "Feature Name", description: "What it does.", image: "/projects/my-project/cover.webp" },
  ],
  process: [
    { number: "01", title: "Research", description: "What happened in this phase." },
  ],
  technical: [
    { label: "Architecture", description: "Technical decisions." },
  ],
  results: [
    { metric: "Performance", value: "<2s", description: "Load time." },
  ],
  images: {
    cover: "/projects/my-project/cover.webp",
    hero: "/projects/my-project/hero.webp",
    gallery: ["/projects/my-project/gallery-01.webp"],
  },
  liveUrl: "https://example.com",
  prevProjectId: "previous-project",
  nextProjectId: null,
},
```

3. Add images to `public/projects/my-project/`
4. Done. Homepage, case studies, multiverse, and sitemap all update.

## Edit Personal Info

Open `src/content/metadata.ts`:

- **Name / title / tagline** → `PERSONAL_INFO`
- **Email** → `PERSONAL_INFO.email`
- **Social links** → `SOCIAL_LINKS`
- **About text** → `ABOUT`

## Edit Navigation

Open `src/content/navigation.ts`:

- **Main nav links** → `NAV_LINKS`
- **Footer links** → `FOOTER_NAV_LINKS`
- **Creative menu** → `MENU_ITEMS`
- **Command palette** → `COMMAND_ACTIONS`

## Edit Skills / Expertise

Open `src/content/skills.ts`:

- Add/remove/modify entries in `SERVICES`
- Each service has: `number`, `title`, `description`, `items[]`

## Edit Process Steps

Open `src/content/experience.ts`:

- **Stats** (Years, Projects, Clients) → `EXPERIENCE_STATS`
- **Process steps** → `PROCESS_STEPS`

## Edit Multiverse Worlds

Open `src/content/multiverse.ts`:

- **World definitions** → `WORLDS`
- **Hub page text** → `MULTIVERSE_HUB`

Each world has `sectionLabel`, `sectionTitle`, `sectionDescription` used on world pages.

## Edit Hero Text

Open `src/content/sections.ts`:

- **Greeting** → `SECTIONS.hero.greeting.morning/afternoon/evening`
- **Headlines** → `SECTIONS.hero.headline1`, `SECTIONS.hero.headline2`

## Add Images

Place images in `public/`:

- Project images: `public/projects/{slug}/cover.webp`, `hero.webp`, `gallery-01.webp`, etc.
- Use `.webp` format for best compression
- Recommended: cover 1200x800, hero 1920x1080, gallery 1200x800

## Content Architecture

```
src/content/
├── index.ts          # Public API — import from here
├── types.ts          # TypeScript interfaces
├── metadata.ts       # Name, email, social links, about, intro, 404
├── projects.ts       # Project data (single source of truth)
├── skills.ts         # Expertise / services
├── experience.ts     # Stats and process steps
├── navigation.ts     # All navigation links
├── multiverse.ts     # World definitions
└── sections.ts       # Hero greeting and headlines
```

## Adding New Content Types

1. Define interface in `types.ts`
2. Create data file (e.g., `awards.ts`)
3. Export from `index.ts`
4. Import in components

TypeScript will enforce correctness — missing fields cause build errors.
