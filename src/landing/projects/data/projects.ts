/**
 * Project Case Study Data System
 *
 * Real professional projects.
 * Each project includes: hero, overview, meta, showcase, process, technical, results.
 */

// ============================================================================
// Types
// ============================================================================

export interface ProjectHero {
  category: string;
  year: string;
  role: string;
  technologies: string[];
  description: string;
}

export interface ProjectOverview {
  challenge: string;
  idea: string;
  solution: string;
}

export interface ProjectMeta {
  role: string;
  timeline: string;
  stack: string[];
  responsibilities: string[];
}

export interface ProjectShowcaseItem {
  label: string;
  description: string;
  image?: string;
}

export interface ProjectProcessStep {
  number: string;
  title: string;
  description: string;
}

export interface ProjectTechnicalItem {
  label: string;
  description: string;
}

export interface ProjectResult {
  metric: string;
  value: string;
  description: string;
}

export interface ProjectImages {
  cover: string;
  hero: string;
  gallery: string[];
}

export interface ProjectCaseStudy {
  id: string;
  number: number;
  title: string;
  accentColor: string;
  accentRgb: string;
  hero: ProjectHero;
  overview: ProjectOverview;
  meta: ProjectMeta;
  showcase: ProjectShowcaseItem[];
  process: ProjectProcessStep[];
  technical: ProjectTechnicalItem[];
  results: ProjectResult[];
  images?: ProjectImages;
  liveUrl?: string;
  githubUrl?: string;
  prevProjectId: string | null;
  nextProjectId: string | null;
}

// ============================================================================
// Project Data
// ============================================================================

export const PROJECTS: Record<string, ProjectCaseStudy> = {
  "over-benefits": {
    id: "over-benefits",
    number: 1,
    title: "Over Benefits",
    accentColor: "#3b82f6",
    accentRgb: "59, 130, 246",
    hero: {
      category: "Digital Benefits Platform",
      year: "2026",
      role: "Frontend Developer",
      technologies: ["React", "TypeScript", "Tailwind CSS", "REST API"],
      description:
        "A modern digital platform designed to simplify employee benefits, business solutions and consumer experiences through a clean responsive interface.",
    },
    overview: {
      challenge:
        "Employee benefits platforms are typically cluttered and hard to navigate. Users struggled to find the right plans, understand coverage options, or manage their benefits efficiently.",
      idea: "Build a clean, intuitive interface that organizes benefits into clear categories. Make plan comparison simple. Ensure the entire experience works flawlessly on mobile — most employees check benefits on their phones.",
      solution:
        "Designed a component-based React architecture with TypeScript for type safety. Used Tailwind CSS for a consistent design system. Built responsive layouts that work across all devices. Integrated with the backend API for real-time plan data.",
    },
    meta: {
      role: "Frontend Developer",
      timeline: "6 weeks",
      stack: ["React", "TypeScript", "Tailwind CSS", "REST API", "Responsive Design"],
      responsibilities: [
        "Frontend Development",
        "UI Implementation",
        "Responsive Design",
        "API Integration",
        "Performance Optimization",
      ],
    },
    showcase: [
      {
        label: "Benefits Dashboard",
        description:
          "Clean overview of all available benefits with quick access to plan details and enrollment.",
        image: "/projects/over-benefits/cover.webp",
      },
      {
        label: "Plan Comparison",
        description:
          "Side-by-side comparison of benefit plans with clear pricing and coverage details.",
        image: "/projects/over-benefits/hero.webp",
      },
      {
        label: "Mobile Experience",
        description: "Fully responsive interface optimized for mobile benefit management.",
        image: "/projects/over-benefits/gallery-01.webp",
      },
      {
        label: "User Onboarding",
        description: "Guided flow for new employees to select and enroll in benefits.",
        image: "/projects/over-benefits/gallery-03.webp",
      },
    ],
    process: [
      {
        number: "01",
        title: "Research",
        description:
          "Analyzed existing benefits platforms to identify pain points. Mapped user journeys for employees, HR managers, and administrators.",
      },
      {
        number: "02",
        title: "Architecture",
        description:
          "Set up React with TypeScript strict mode. Designed reusable components for benefit cards, plan comparisons, and enrollment flows.",
      },
      {
        number: "03",
        title: "Interface",
        description:
          "Built the responsive layout system with Tailwind CSS. Created consistent spacing, typography, and color tokens across all screens.",
      },
      {
        number: "04",
        title: "Integration",
        description:
          "Connected frontend to the REST API for real-time plan data. Implemented loading states, error handling, and optimistic updates.",
      },
    ],
    technical: [
      {
        label: "Component Architecture",
        description:
          "Reusable React components with clear prop interfaces. Each benefit type has its own component variant.",
      },
      {
        label: "State Management",
        description:
          "Local state for UI interactions. API state managed through custom hooks with caching.",
      },
      {
        label: "Responsive System",
        description:
          "Mobile-first approach with Tailwind breakpoints. Tested across 320px to 1440px viewports.",
      },
      {
        label: "Performance",
        description:
          "Lazy loading for benefit detail pages. Optimistic UI updates for enrollment actions.",
      },
    ],
    results: [
      {
        metric: "Responsive",
        value: "100%",
        description: "Fully responsive across all devices. Tested on mobile, tablet, and desktop.",
      },
      {
        metric: "Load Time",
        value: "<2s",
        description: "Initial page load on 3G connection. Optimized with code splitting.",
      },
      {
        metric: "Accessibility",
        value: "WCAG",
        description: "Keyboard navigation, screen reader support, proper ARIA labels.",
      },
      {
        metric: "Components",
        value: "30+",
        description: "Reusable components built for the benefits system.",
      },
    ],
    images: {
      cover: "/projects/over-benefits/cover.webp",
      hero: "/projects/over-benefits/hero.webp",
      gallery: [
        "/projects/over-benefits/gallery-01.webp",
        "/projects/over-benefits/gallery-02.webp",
        "/projects/over-benefits/gallery-03.webp",
      ],
    },
    liveUrl: "https://www.overbenefits.net/",
    prevProjectId: "mts-med",
    nextProjectId: "window-corner",
  },

  "window-corner": {
    id: "window-corner",
    number: 2,
    title: "Window Corner",
    accentColor: "#14b8a6",
    accentRgb: "20, 184, 166",
    hero: {
      category: "Corporate Website",
      year: "2026",
      role: "Frontend Developer",
      technologies: ["React", "TypeScript", "Tailwind CSS", "Framer Motion"],
      description:
        "A premium web experience for an architectural aluminum and glass solutions company. Presenting products, projects and brand identity through a modern interface.",
    },
    overview: {
      challenge:
        "Architectural companies need websites that reflect the quality of their work. The challenge was creating a digital presence that showcases large-scale projects while maintaining fast load times and smooth navigation.",
      idea: "Build a visually driven experience with full-width project galleries, smooth scroll-based animations, and a product catalog that makes technical specifications easy to browse.",
      solution:
        "Developed a React-based frontend with Framer Motion for smooth page transitions. Implemented a responsive grid system for project showcases. Built a product catalog with filtering and detailed specification views.",
    },
    meta: {
      role: "Frontend Developer",
      timeline: "8 weeks",
      stack: ["React", "TypeScript", "Tailwind CSS", "Framer Motion", "Responsive Design"],
      responsibilities: [
        "Frontend Development",
        "Visual Design Implementation",
        "Responsive Layouts",
        "Content Architecture",
        "Performance Optimization",
      ],
    },
    showcase: [
      {
        label: "Project Gallery",
        description:
          "Full-width project showcases with smooth scroll animations and detailed case studies.",
        image: "/projects/window-corner/cover.webp",
      },
      {
        label: "Product Catalog",
        description:
          "Browsable product catalog with filtering by category, material, and application.",
        image: "/projects/window-corner/hero.webp",
      },
      {
        label: "Company Overview",
        description: "Brand story, team section, and company values with cinematic presentation.",
        image: "/projects/window-corner/gallery-01.webp",
      },
      {
        label: "Contact & Inquiry",
        description: "Streamlined inquiry form for project consultations and product requests.",
        image: "/projects/window-corner/gallery-02.webp",
      },
    ],
    process: [
      {
        number: "01",
        title: "Discovery",
        description:
          "Reviewed the company's existing materials, product lines, and project portfolio. Identified key pages needed: home, projects, products, about, contact.",
      },
      {
        number: "02",
        title: "Architecture",
        description:
          "Set up React with TypeScript. Designed the page structure with React Router. Built reusable layout components for consistent spacing and typography.",
      },
      {
        number: "03",
        title: "Interface",
        description:
          "Implemented the visual design with Tailwind CSS. Built the project gallery with responsive grids. Created the product catalog with category filtering.",
      },
      {
        number: "04",
        title: "Motion",
        description:
          "Added Framer Motion for page transitions, scroll-based reveals, and hover effects on project cards. Kept animations subtle to maintain professionalism.",
      },
    ],
    technical: [
      {
        label: "Page Structure",
        description:
          "React Router for navigation. Each page is a lazy-loaded component for faster initial load.",
      },
      {
        label: "Responsive Design",
        description:
          "Mobile-first layouts with Tailwind breakpoints. Project galleries adapt from single column to multi-column grids.",
      },
      {
        label: "Animation System",
        description:
          "Framer Motion for scroll reveals, page transitions, and hover interactions. All animations respect prefers-reduced-motion.",
      },
      {
        label: "Performance",
        description:
          "Lazy loading for project images. Code splitting per route. Optimized image delivery.",
      },
    ],
    results: [
      {
        metric: "Projects",
        value: "20+",
        description:
          "Project case studies showcased with full-width galleries and detailed descriptions.",
      },
      {
        metric: "Products",
        value: "50+",
        description: "Products listed across multiple categories with filtering and search.",
      },
      {
        metric: "Load Time",
        value: "<2.5s",
        description: "Full page load on mobile. Image optimization and lazy loading.",
      },
      {
        metric: "Responsive",
        value: "100%",
        description: "Tested across all device sizes from mobile to 4K displays.",
      },
    ],
    images: {
      cover: "/projects/window-corner/cover.webp",
      hero: "/projects/window-corner/hero.webp",
      gallery: [
        "/projects/window-corner/gallery-01.webp",
        "/projects/window-corner/gallery-02.webp",
        "/projects/window-corner/gallery-03.webp",
      ],
    },
    liveUrl: "https://window-corner.com/",
    prevProjectId: "over-benefits",
    nextProjectId: "mts-med",
  },

  "mts-med": {
    id: "mts-med",
    number: 3,
    title: "MTS MED",
    accentColor: "#ef4444",
    accentRgb: "239, 68, 68",
    hero: {
      category: "Healthcare Platform",
      year: "2026",
      role: "Frontend Developer",
      technologies: ["React", "TypeScript", "Tailwind CSS", "Responsive Design"],
      description:
        "A healthcare product platform focused on presenting medical solutions with clear navigation and accessible product information.",
    },
    overview: {
      challenge:
        "Medical product catalogs need to present complex technical information clearly. Healthcare professionals need to quickly find products by category, specification, or application.",
      idea: "Build a structured product catalog with clear categorization. Make technical specifications easy to scan. Ensure the interface works for professionals who may be accessing it on tablets during consultations.",
      solution:
        "Created a React frontend with a clear information architecture. Built product detail pages with structured specifications. Implemented responsive design for tablet and mobile access.",
    },
    meta: {
      role: "Frontend Developer",
      timeline: "5 weeks",
      stack: ["React", "TypeScript", "Tailwind CSS", "Responsive Design"],
      responsibilities: [
        "Frontend Development",
        "Product Presentation",
        "UI Structure",
        "Responsive Experience",
        "Usability Optimization",
      ],
    },
    showcase: [
      {
        label: "Product Catalog",
        description:
          "Structured product browsing with categories, filters, and detailed specification views.",
        image: "/projects/mts-med/hero.webp",
      },
      {
        label: "Product Details",
        description:
          "Clear presentation of medical product specifications, features, and applications.",
        image: "/projects/mts-med/gallery-01.jpeg",
      },
      {
        label: "Category Navigation",
        description:
          "Intuitive navigation across product lines with breadcrumb trails and quick filters.",
        image: "/projects/mts-med/gallery-02.jpeg",
      },
      {
        label: "Company Information",
        description:
          "About section with company credentials, certifications, and contact information.",
        image: "/projects/mts-med/gallery-03.jpeg",
      },
    ],
    process: [
      {
        number: "01",
        title: "Analysis",
        description:
          "Mapped the product catalog structure. Identified key product categories and the information needed for each product page.",
      },
      {
        number: "02",
        title: "Architecture",
        description:
          "Set up React with TypeScript. Designed the routing structure for product categories and individual product pages.",
      },
      {
        number: "03",
        title: "Interface",
        description:
          "Built the product catalog with Tailwind CSS. Created consistent card layouts, detail pages, and navigation patterns.",
      },
      {
        number: "04",
        title: "Usability",
        description:
          "Optimized for healthcare professionals — large touch targets, clear typography, fast navigation between products.",
      },
    ],
    technical: [
      {
        label: "Information Architecture",
        description:
          "Clear product hierarchy: categories > subcategories > products > specifications.",
      },
      {
        label: "Component System",
        description:
          "Reusable components for product cards, specification tables, and category navigation.",
      },
      {
        label: "Responsive Design",
        description:
          "Optimized for tablet use in clinical settings. Touch-friendly navigation and large interactive areas.",
      },
      {
        label: "Accessibility",
        description:
          "High contrast text, keyboard navigation, proper heading hierarchy for screen readers.",
      },
    ],
    results: [
      {
        metric: "Products",
        value: "100+",
        description:
          "Medical products cataloged across multiple categories with detailed specifications.",
      },
      {
        metric: "Categories",
        value: "8+",
        description: "Product categories with clear navigation and filtering.",
      },
      {
        metric: "Tablet Ready",
        value: "Yes",
        description: "Optimized for tablet access in clinical and consultation settings.",
      },
      {
        metric: "Load Time",
        value: "<2s",
        description: "Fast initial load with optimized product data delivery.",
      },
    ],
    images: {
      cover: "/projects/mts-med/hero.webp",
      hero: "/projects/mts-med/hero.webp",
      gallery: [
        "/projects/mts-med/gallery-01.jpeg",
        "/projects/mts-med/gallery-02.jpeg",
        "/projects/mts-med/gallery-03.jpeg",
        "/projects/mts-med/gallery-04.jpeg",
        "/projects/mts-med/gallery-05.jpeg",
      ],
    },
    liveUrl: "https://mtsmed-eg.com/",
    prevProjectId: "window-corner",
    nextProjectId: "over-benefits",
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
