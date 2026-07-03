/**
 * Project Case Study Page
 *
 * Dynamic route for /projects/:projectId
 * Loads project data and renders the case study experience.
 */

import { useParams, useNavigate } from "react-router";
import { useCallback, useEffect } from "react";
import { ProjectPage } from "@/landing/projects";
import { getProjectById } from "@/landing/projects";
import { ROUTES } from "@/constants/routes";

// ============================================================================
// Component
// ============================================================================

export default function ProjectCaseStudyPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const project = projectId ? getProjectById(projectId) : undefined;

  // SEO meta tags
  useEffect(() => {
    if (!project) return;

    const previousTitle = document.title;

    document.title = `${project.title} — Case Study | Frontend Multiverse`;

    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", project.shortDescription);
    } else {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      metaDescription.setAttribute("content", project.shortDescription);
      document.head.appendChild(metaDescription);
    }

    const ogTags = [
      { property: "og:title", content: `${project.title} — Case Study` },
      { property: "og:description", content: project.shortDescription },
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
        navigate(`${ROUTES.PROJECT.replace(":projectId", nextId)}`);
      }, 300);
    },
    [navigate],
  );

  const handleBackToProjects = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      navigate(ROUTES.HOME);
      // Scroll to projects section after navigation
      setTimeout(() => {
        const projectsSection = document.getElementById("projects");
        if (projectsSection) {
          projectsSection.scrollIntoView({ behavior: "smooth" });
        }
      }, 400);
    }, 200);
  }, [navigate]);

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
