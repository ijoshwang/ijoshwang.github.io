import type { Metadata } from "next";
import { PROFILE } from "@/domain/profile-data";
import { AboutView } from "@/features/studio/about-view";

export const metadata: Metadata = {
  title: "About",
  description:
    "Background, engineering focus, and contact details for Josh Wang, full-stack and AI product engineer in Hong Kong.",
  alternates: {
    canonical: "/about/",
  },
};

export default function AboutPage() {
  return <AboutView about={PROFILE.about} contact={PROFILE.identity.contact} />;
}
