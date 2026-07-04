/**
 * Project Case Study Page
 *
 * Dynamic route for /projects/:projectId
 * Loads project data and renders the case study experience.
 * Integrates with the project transition system for cinematic navigation.
 */

import { useParams, useNavigate } from "react-router";
import { useCallback, useEffect } from "react";
import { ProjectPage } from "@/landing/projects";
import { getProjectById } from "@/landing/projects";
import { ROUTES } from "@/constants/routes";
import { useTransitionStore } from "@/landing/components/project-transition-store";

// ============================================================================
// Component
// ============================================================================

export default function ProjectCaseStudyPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const startReturn = useTransitionStore((s) => s.startReturn);

  const project = projectId ? getProjectById(projectId) : undefined;

  // SEO meta tags
  useEffect(() => {
    if (!project) return;

    const previousTitle = document.title;

    document.title = `${project.title} — Case Study | Frontend Multiverse`;

    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", project.hero.description);
    } else {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      metaDescription.setAttribute("content", project.hero.description);
      document.head.appendChild(metaDescription);
    }

    const ogTags = [
      { property: "og:title", content: `${project.title} — Case Study` },
      { property: "og:description", content: project.hero.description },
      { property: "og:type", content: "article" },
    ];

    ogTags.forEach(({ property, content }) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (tag) {
        tag.setAttribute("content", content);
      } else {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        tag.setAttribute("content", content);
        document.head.appendChild(tag);
      }
    });

    return () => {
      document.title = previousTitle;
    };
  }, [project]);

  const handleNextProject = useCallback(
    (nextId: string) => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => {
        void navigate(ROUTES.PROJECT.replace(":projectId", nextId));
      }, 300);
    },
    [navigate],
  );

  const handleBackToProjects = useCallback(() => {
    // Trigger back transition overlay
    startReturn();

    // Navigate immediately — overlay handles the visual transition
    // Landing page scroll restoration handles returning to the right position
    void navigate(ROUTES.HOME);
  }, [navigate, startReturn]);

  if (!project) {
    return (
      <main className="project-not-found">
        <h1 className="project-not-found-title">Project Not Found</h1>
        <p className="project-not-found-text">
          The project you&apos;re looking for doesn&apos;t exist.
        </p>
        <a href="/" className="project-not-found-link">
          Back to Home
        </a>
      </main>
    );
  }

  return (
    <ProjectPage
      project={project}
      onNextProject={handleNextProject}
      onBackToProjects={handleBackToProjects}
    />
  );
}
