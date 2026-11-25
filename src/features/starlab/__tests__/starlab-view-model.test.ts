import { describe, expect, it } from "vitest";
import { PROFILE } from "@/domain/profile-data";
import { buildStarLabViewState, clampSplitPercentage } from "@/features/starlab/starlab-view-model";

describe("StarLab showcase view model", () => {
  it("clamps compare curtain percentage safely between 0 and 100", () => {
    expect(clampSplitPercentage(-15)).toBe(0);
    expect(clampSplitPercentage(140)).toBe(100);
    expect(clampSplitPercentage(48.6)).toBe(49);
    expect(clampSplitPercentage(Number.NaN)).toBe(50);
  });

  it("derives enriched agent seats with micro-UI previews and shared doc state", () => {
    const state = buildStarLabViewState({
      starlab: PROFILE.starlab,
      scenarioId: "plan-update",
      approvedScenarioIds: new Set(),
    });

    expect(state.activeScenario.id).toBe("plan-update");
    expect(state.agentSeats).toHaveLength(3);
    expect(state.agentSeats[0]?.miniPreview.afterLines[1]).toContain("active-plan.md");
    expect(state.docs[2]?.isGatePending).toBe(true);
    expect(state.docs[2]?.isGateApproved).toBe(false);
  });

  it("updates the Human Gate document row and mini preview once approved", () => {
    const state = buildStarLabViewState({
      starlab: PROFILE.starlab,
      scenarioId: "inbox-triage",
      approvedScenarioIds: new Set(["inbox-triage"]),
    });

    expect(state.isGateApproved).toBe(true);
    expect(state.docs[2]?.isGatePending).toBe(false);
    expect(state.docs[2]?.isGateApproved).toBe(true);
    expect(state.docs[2]?.displayValue).toContain("Approved by you");
    expect(state.agentSeats[0]?.miniPreview.afterLines[1]).toContain("Reply sent");
  });
});
