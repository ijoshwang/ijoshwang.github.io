import type { Metadata } from "next";
import { PROFILE } from "@/domain/profile-data";
import { CareerView } from "@/features/studio/career-view";

export const metadata: Metadata = {
  title: "Career",
  description:
    "Twenty years of product and systems engineering across industrial design, full-stack web platforms, Go backends, and AI agents.",
  alternates: {
    canonical: "/career/",
  },
};

export default function CareerPage() {
  return <CareerView career={PROFILE.career} education={PROFILE.education} />;
}
