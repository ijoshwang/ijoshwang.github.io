import type { Metadata } from "next";
import { PROFILE } from "@/domain/profile-data";
import { ProjectsView } from "@/features/studio/projects-view";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Public AI product launches including WebPilot alongside sanitized personal lab systems built inside StarLab.",
  alternates: {
    canonical: "/projects/",
  },
};

export default function ProjectsPage() {
  return <ProjectsView projects={PROFILE.projects} />;
}
