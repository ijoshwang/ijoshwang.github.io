import type { Metadata } from "next";
import { PROFILE } from "@/domain/profile-data";
import { ProjectsView } from "@/features/studio/projects-view";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "AI products, personal agent systems, and standalone engineering tools designed and built by Josh Wang.",
  alternates: {
    canonical: "/projects/",
  },
};

export default function ProjectsPage() {
  return <ProjectsView projects={PROFILE.projects} />;
}
