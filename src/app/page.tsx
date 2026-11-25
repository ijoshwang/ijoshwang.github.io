import { PROFILE } from "@/domain/profile-data";
import { OverviewView } from "@/features/studio/overview-view";

export default function HomePage() {
  return <OverviewView profile={PROFILE} />;
}
