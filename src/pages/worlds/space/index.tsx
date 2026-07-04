/**
 * Space World Page
 *
 * Entry point for /worlds/space route.
 * Renders the SpaceWorldExperience component.
 */

import { SpaceWorldExperience } from "@/worlds/space-world/components/space-world-experience";

export default function SpaceWorldPage() {
  return (
    <main className="relative min-h-screen bg-black">
      <SpaceWorldExperience />
    </main>
  );
}
