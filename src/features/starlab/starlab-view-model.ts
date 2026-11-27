import type {
  Profile,
  StarLabActivityStep,
  StarLabAgent,
  StarLabAgentId,
  StarLabScenario,
  StarLabSharedDocRow,
  StarLabSiloCard,
} from "@/domain/profile-schema";

export interface AccentTokens {
  color: string;
  soft: string;
  border: string;
  glow: string;
}

export function getAccentTokens(accent: StarLabAgent["accent"]): AccentTokens {
  if (accent === "indigo") {
    return {
      color: "var(--accent-coding)",
      soft: "var(--accent-coding-soft)",
      border: "var(--accent-coding-border)",
      glow: "var(--glow-coding)",
    };
  }
  if (accent === "amber") {
    return {
      color: "var(--accent-os)",
      soft: "var(--accent-os-soft)",
      border: "var(--accent-os-border)",
      glow: "var(--glow-os)",
    };
  }
  return {
    color: "var(--accent-shared)",
    soft: "var(--accent-shared-soft)",
    border: "var(--accent-shared-border)",
    glow: "var(--glow-shared)",
  };
}

export interface MiniWindowPreview {
  windowTitle: string;
  beforeLines: readonly [string, string];
  afterLines: readonly [string, string];
}

export interface EnrichedAgentSeat {
  agent: StarLabAgent;
  tokens: AccentTokens;
  siloCard: StarLabSiloCard;
  liveStatusLabel: string;
  liveActivitySummary: string;
  miniPreview: MiniWindowPreview;
}

export interface EnrichedSharedDocRow {
  row: StarLabSharedDocRow;
  displayValue: string;
  isGatePending: boolean;
  isGateApproved: boolean;
}

export interface StarLabViewState {
  activeScenario: StarLabScenario;
  scenarios: readonly StarLabScenario[];
  agentSeats: readonly EnrichedAgentSeat[];
  docs: readonly EnrichedSharedDocRow[];
  isGateApproved: boolean;
}

export interface BuildStarLabViewInput {
  starlab: Profile["starlab"];
  scenarioId: string;
  approvedScenarioIds: ReadonlySet<string>;
}

export function clampSplitPercentage(value: number): number {
  if (Number.isNaN(value)) return 50;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function buildMiniWindowPreview(
  agentId: StarLabAgentId,
  scenarioId: string,
  isGateApproved: boolean,
): MiniWindowPreview {
  if (scenarioId === "inbox-triage") {
    if (agentId === "chat") {
      return {
        windowTitle: "Chat thread",
        beforeLines: ["Which partner email?", "Paste it so I can read it."],
        afterLines: [
          "Partner demo slot logged.",
          isGateApproved ? "Reply sent & closed." : "Draft ready at Human gate.",
        ],
      };
    }
    if (agentId === "inbox") {
      return {
        windowTitle: "Mail inbox",
        beforeLines: ["28 unread · local log", "Partner Q · unlinked"],
        afterLines: ["24 newsletters closed", "1 decision -> Living docs"],
      };
    }
    return {
      windowTitle: "Morning brief",
      beforeLines: ["Today: All clear", "0 blockers shown (wrong)"],
      afterLines: ["#1 Reply to partner demo", "Synced with Tuesday launch"],
    };
  }

  if (agentId === "chat") {
    return {
      windowTitle: "Chat thread",
      beforeLines: ["Move launch to Tuesday.", "Saved only in this chat."],
      afterLines: ["Move launch to Tuesday.", "Wrote docs/active-plan.md"],
    };
  }
  if (agentId === "inbox") {
    return {
      windowTitle: "Mail inbox",
      beforeLines: ["P0: Friday launch copy", "P0: Friday press assets"],
      afterLines: ["P0: API latency threads", "Friday mail de-escalated"],
    };
  }
  return {
    windowTitle: "Morning brief",
    beforeLines: ["Fri: Ship launch post", "Status: Stale plan"],
    afterLines: ["Today: API latency fix", "Target: Tuesday launch"],
  };
}

export function buildStarLabViewState({
  starlab,
  scenarioId,
  approvedScenarioIds,
}: BuildStarLabViewInput): StarLabViewState {
  const activeScenario =
    starlab.scenarios.find((scenario) => scenario.id === scenarioId) ?? starlab.scenarios[0];

  if (!activeScenario) {
    throw new Error("StarLab showcase requires at least one scenario.");
  }

  const siloCardsById = new Map<StarLabAgentId, StarLabSiloCard>(
    activeScenario.siloCards.map((card) => [card.agentId, card]),
  );

  const isGateApproved = approvedScenarioIds.has(activeScenario.id);

  const latestStepByAgent = new Map<StarLabAgentId, StarLabActivityStep>();
  for (const step of activeScenario.steps) {
    latestStepByAgent.set(step.agentId, step);
  }

  const agentSeats: EnrichedAgentSeat[] = starlab.agents.map((agent) => {
    const siloCard = siloCardsById.get(agent.id) ?? activeScenario.siloCards[0];
    if (!siloCard) {
      throw new Error(`Missing silo card for ${agent.id}`);
    }
    const latestStep = latestStepByAgent.get(agent.id);

    let liveStatusLabel = "Synced live";
    if (latestStep) {
      if (latestStep.verb === "WRITE") liveStatusLabel = "Wrote shared context";
      else if (latestStep.verb === "READ") liveStatusLabel = "Read shared rules";
      else if (latestStep.verb === "GATE") {
        liveStatusLabel = isGateApproved ? "Approved" : "Waiting approval";
      }
    }

    return {
      agent,
      tokens: getAccentTokens(agent.accent),
      siloCard,
      liveStatusLabel,
      liveActivitySummary: latestStep?.summary ?? agent.description,
      miniPreview: buildMiniWindowPreview(agent.id, activeScenario.id, isGateApproved),
    };
  });

  const docs: EnrichedSharedDocRow[] = activeScenario.sharedDocs.map((row) => {
    const isGatePending = row.requiresApproval && !isGateApproved;
    const displayValue =
      row.requiresApproval && isGateApproved ? activeScenario.gateApprovedNote : row.afterValue;
    return {
      row,
      displayValue,
      isGatePending,
      isGateApproved: row.requiresApproval && isGateApproved,
    };
  });

  return {
    activeScenario,
    scenarios: starlab.scenarios,
    agentSeats,
    docs,
    isGateApproved,
  };
}
