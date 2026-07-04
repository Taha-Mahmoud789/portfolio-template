import { Routes, Route } from "react-router";
import { ROUTES } from "@/constants/routes";
import { lazy } from "react";
import { WorldRoute } from "@/layouts";

const HomePage = lazy(() => import("@/pages/home"));
const NotFoundPage = lazy(() => import("@/pages/not-found"));
const WorldIndexPage = lazy(() => import("@/pages/world-index"));
const ProjectCaseStudyPage = lazy(() => import("@/pages/project-case-study"));
const MultiverseHub = lazy(() => import("@/pages/multiverse"));
const ProjectUniversePage = lazy(() => import("@/pages/multiverse/project-universe"));
const CodeUniversePage = lazy(() => import("@/pages/multiverse/code-universe"));
const CreativeUniversePage = lazy(() => import("@/pages/multiverse/creative-universe"));

export function AppRouter() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<HomePage />} />
      <Route path={ROUTES.MULTIVERSE} element={<MultiverseHub />} />
      <Route path={ROUTES.PROJECT_UNIVERSE} element={<ProjectUniversePage />} />
      <Route path={ROUTES.CODE_UNIVERSE} element={<CodeUniversePage />} />
      <Route path={ROUTES.CREATIVE_UNIVERSE} element={<CreativeUniversePage />} />

      <Route path={ROUTES.WORLD_INDEX} element={<WorldIndexPage />} />
      <Route path="/worlds/:worldId" element={<WorldRoute />} />
      <Route path={ROUTES.PROJECT} element={<ProjectCaseStudyPage />} />
      <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
    </Routes>
  );
}
