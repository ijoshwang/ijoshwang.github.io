import { ProfileSchema, type Profile } from "./profile-schema";
import { SITE_URL } from "./site-config";

const rawProfile: Profile = {
  version: "1.0.0-baseline",
  updatedAt: "2026-11-27",
  identity: {
    name: "Josh Wang",
    fullName: "Huijun (Josh) Wang",
    role: "AI-Native Product & Systems Engineer",
    location: "Hong Kong / Worldwide Remote",
    availability: "Open to Senior & Staff AI or Full-Stack Roles",
    headlineLead: "Building AI products and",
    headlineEmphasis: "shared-memory",
    subheadline:
      "Full-stack and AI product engineer in Hong Kong with 20+ years of experience shipping TypeScript, Next.js, and Go systems, from 0-to-1 products like WebPilot to StarLab, a personal agent OS built on one shared context.",
    contact: {
      email: "ijoshwang@gmail.com",
      github: "https://github.com/ijoshwang",
      linkedin: "https://www.linkedin.com/in/ijoshwang/",
      website: SITE_URL,
    },
  },
  starlab: {
    badge: "StarLab Personal Agent OS",
    title: "Multiple agents, one shared brain.",
    oneLiner:
      "Most AI agents work in isolated silos, forcing you to copy and paste context between windows. StarLab connects specialized agents to one living memory and document layer they update together under your approval.",
    corePrimitives: [
      "Shared memory and standing rules",
      "Living documents as a single source of truth",
      "Human approval gate before external actions",
    ],
    agents: [
      {
        id: "chat",
        name: "Chat, Chief of Staff",
        role: "Daily conversation and priority calls",
        codename: "Daily Driver",
        accent: "indigo",
        description: "Talk naturally in one place so decisions flow directly into shared state.",
      },
      {
        id: "inbox",
        name: "Inbox Triage",
        role: "Email intake and open-item tracking",
        codename: "Mercury",
        accent: "amber",
        description: "Filters incoming mail with shared rules and surfaces only real human calls.",
      },
      {
        id: "brief",
        name: "Daily Brief & Ops",
        role: "Morning priorities and schedule sync",
        codename: "Daily Pivot",
        accent: "teal",
        description: "Rebuilds your daily plan from the exact live records every agent reads.",
      },
    ],
    scenarios: [
      {
        id: "plan-update",
        shortLabel: "Change a plan in chat",
        prompt: "Move Friday launch to Tuesday and prioritize API latency fixes first.",
        painSummary:
          "You changed the plan in chat, yet your other agents never heard about it. Inbox and Daily Brief keep acting on yesterday's assumptions.",
        solutionSummary:
          "One natural message updates the shared plan once. Every other agent reads the new priority right away with zero copy-pasting.",
        siloRelayNote: "You end up repeating the same update across three separate agent windows.",
        siloCards: [
          {
            agentId: "chat",
            statusLabel: "Local thread only",
            snippet: '"Got it. Noted here: launch moved to Tuesday."',
            problemTag: "Trapped in one chat",
          },
          {
            agentId: "inbox",
            statusLabel: "Out of sync",
            snippet: '"4 Friday launch checklist threads marked urgent."',
            problemTag: "Stale Friday deadline",
          },
          {
            agentId: "brief",
            statusLabel: "Stale schedule",
            snippet: '"Today: Finalize Friday launch announcement."',
            problemTag: "Contradicts your plan",
          },
        ],
        steps: [
          {
            id: "step-1",
            agentId: "chat",
            verb: "WRITE",
            target: "docs/active-plan.md",
            summary: "Moves launch target from Friday to Tuesday.",
            detail: "Writes directly to the single-owner plan doc instead of leaving it in chat.",
          },
          {
            id: "step-2",
            agentId: "chat",
            verb: "WRITE",
            target: "memory/standing-rules.md",
            summary: "Records priority rule: API latency fixes block release.",
            detail: "Every agent checking priorities now sees the updated sequence.",
          },
          {
            id: "step-3",
            agentId: "brief",
            verb: "SYNC",
            target: "Daily Brief",
            summary: "Rebuilds morning focus around API latency work.",
            detail: "Reads the live plan doc automatically with zero extra prompting.",
          },
          {
            id: "step-4",
            agentId: "inbox",
            verb: "SYNC",
            target: "Inbox queue",
            summary: "De-escalates Friday mail and surfaces latency threads.",
            detail: "Uses the same updated context to rank incoming messages.",
          },
        ],
        sharedDocs: [
          {
            id: "doc-memory",
            layer: "memory",
            label: "Shared memory",
            path: "memory/standing-rules.md",
            beforeValue: "Ship checklist items first; treat Friday launch threads as P0.",
            afterValue: "API latency fixes block release; launch comms follow sign-off.",
            updatedBy: "Chat, Chief of Staff",
            requiresApproval: false,
          },
          {
            id: "doc-plan",
            layer: "docs",
            label: "Living docs",
            path: "docs/active-plan.md",
            beforeValue: "Target launch: Friday. Focus: release copy and assets.",
            afterValue: "Target launch: Tuesday. Priority #1: API latency fix.",
            updatedBy: "Chat, Chief of Staff",
            requiresApproval: false,
          },
          {
            id: "doc-gate",
            layer: "gate",
            label: "Human gate",
            path: "gate/outbound-drafts",
            beforeValue: "No external messages queued.",
            afterValue: "Draft ready to notify collaborators of the Tuesday launch shift.",
            updatedBy: "Chat, Chief of Staff",
            requiresApproval: true,
          },
        ],
        gateActionLabel: "Approve notice draft",
        gateApprovedNote: "Approved by you. Notice released and logged to living docs.",
      },
      {
        id: "inbox-triage",
        shortLabel: "Triage morning inbox",
        prompt: "Process 28 overnight emails, log real decisions, and prepare replies.",
        painSummary:
          "Email summaries pile up in a dead-end log your main chat cannot see, or a bot drafts replies without checking your latest decisions.",
        solutionSummary:
          "Inbox Triage filters noise via shared rules, writes open decisions to living docs for Chat and Brief, and pauses at Human Gate before sending.",
        siloRelayNote: "You copy email threads into chat just to decide how to answer.",
        siloCards: [
          {
            agentId: "inbox",
            statusLabel: "Isolated log",
            snippet: '"28 emails summarized locally. 1 partner question."',
            problemTag: "Unlinked from plans",
          },
          {
            agentId: "chat",
            statusLabel: "Blind to inbox",
            snippet: '"Which partner email? Paste it here for context."',
            problemTag: "Manual copy-paste",
          },
          {
            agentId: "brief",
            statusLabel: "Missing blocker",
            snippet: '"Today looks clear. No external decisions pending."',
            problemTag: "Misses urgent reply",
          },
        ],
        steps: [
          {
            id: "triage-1",
            agentId: "inbox",
            verb: "READ",
            target: "memory/standing-rules.md",
            summary: "Applies intake rules to 28 overnight threads.",
            detail: "Archives 24 newsletters quietly and isolates one decision thread.",
          },
          {
            id: "triage-2",
            agentId: "inbox",
            verb: "WRITE",
            target: "docs/open-decisions.md",
            summary: "Logs the partner timeline question with source link.",
            detail: "Stores structured status in living docs so every agent sees it.",
          },
          {
            id: "triage-3",
            agentId: "brief",
            verb: "SYNC",
            target: "Morning Brief",
            summary: "Pins the partner reply as today's top decision.",
            detail: "Reconciles inbox reality with today's schedule automatically.",
          },
          {
            id: "triage-4",
            agentId: "chat",
            verb: "GATE",
            target: "Human approval",
            summary: "Drafts context-aware reply and waits for your click.",
            detail: "External sends never leave quietly without explicit approval.",
          },
        ],
        sharedDocs: [
          {
            id: "triage-memory",
            layer: "memory",
            label: "Shared memory",
            path: "memory/mercury-policy.md",
            beforeValue: "Label seen mail; escalate only partner, hiring, or billing items.",
            afterValue: "Verified 28 threads. 24 closed quietly, 1 decision escalated.",
            updatedBy: "Inbox Triage",
            requiresApproval: false,
          },
          {
            id: "triage-docs",
            layer: "docs",
            label: "Living docs",
            path: "docs/open-decisions.md",
            beforeValue: "0 open email decisions.",
            afterValue: "1 open: confirm API demo slot with partner for Tuesday launch.",
            updatedBy: "Inbox Triage",
            requiresApproval: false,
          },
          {
            id: "triage-gate",
            layer: "gate",
            label: "Human gate",
            path: "gate/gmail-reply-draft",
            beforeValue: "No outbound mail queued.",
            afterValue: "Reply draft ready for partner demo slot, paused for your approval.",
            updatedBy: "Chat, Chief of Staff",
            requiresApproval: true,
          },
        ],
        gateActionLabel: "Approve & send reply",
        gateApprovedNote: "Approved by you. Reply sent and open decision marked closed.",
      },
    ],
  },
  projects: [
    {
      id: "webpilot",
      name: "WebPilot",
      tagline: "0-to-1 AI search workspace and featured Chrome Extension",
      period: "2023 to 2024",
      featuredOnOverview: true,
      metricBadge: "50k users, 1.9k stars",
      summary:
        "Owned 0-to-1 full-stack architecture and delivery for webpilot.ai in two months and its Chrome Extension in one month, combining a BlockNote editor, low-latency SSE streaming UI, and Puppeteer PDF export.",
      proofPoints: [
        "Featured on Chrome Web Store with a 4.6 rating and 50,000 users.",
        "1.9k GitHub stars on the public Webpilot repository.",
        "Shipped the full web workspace in two months on Next.js, Node.js, Docker, and GCP.",
      ],
      stack: ["Next.js", "Node.js", "TypeScript", "BlockNote", "SSE", "Puppeteer", "Docker"],
      links: [
        { label: "webpilot.ai", href: "https://www.webpilot.ai/" },
        { label: "GitHub (1.9k stars)", href: "https://github.com/webpilot-ai/Webpilot" },
        {
          label: "Chrome Web Store",
          href: "https://chromewebstore.google.com/detail/webpilot-copilot-for-all/biaggnjibplcfekllonekbonhfgchopo",
        },
      ],
    },
    {
      id: "ijoshwang-site",
      name: "ijoshwang.github.io",
      tagline: "Dual Human + Agent portfolio built as an open-source reference",
      period: "2026",
      featuredOnOverview: true,
      metricBadge: "Next.js 16, TS 7, /llms.txt",
      summary:
        "Engineered from scratch as an inspectable public showcase of modern web architecture, combining a typed single source of truth, Human and Agent dual rendering, and automated verification gates.",
      proofPoints: [
        "Next.js 16, React 19, TypeScript 7, Tailwind CSS 4, and Oxlint (--type-aware).",
        "Strict pure-component and ViewModel separation validated with Zod 4 and Vitest.",
        "Single typed schema drives Human UI, Agent mode, /llms.txt, and /profile.json.",
      ],
      stack: [
        "Next.js 16",
        "React 19",
        "TypeScript 7",
        "Tailwind CSS 4",
        "Oxlint",
        "Zod 4",
        "Vitest",
      ],
      links: [{ label: "Source repo", href: "https://github.com/ijoshwang/ijoshwang.github.io" }],
    },
    {
      id: "starlab",
      name: "StarLab",
      tagline:
        "Personal Agent OS connecting cloud assistants, coding workbenches, and deterministic services",
      period: "2026 to present",
      featuredOnOverview: false,
      metricBadge: "Personal Agent OS",
      summary:
        "Personal operating system uniting a cloud/mobile assistant, interchangeable coding workbenches (Codex and Antigravity), and deterministic background services around one Home Repo, shared Notion workflows, and explicit human approval gates.",
      proofPoints: [
        "Separates durable shared memory, Home Repo skills, and explicit authority tiers from swappable agent runtimes.",
        "Powers daily email triage with ledger boundaries, a single-source Markdown-to-PDF CV pipeline, and a Docker-based daily reading edition.",
        "Enforces deterministic-first automation and weekly read-only system reviews instead of noisy polling agents.",
      ],
      stack: ["MCP", "Home Repo", "Agent Skills", "Notion Workflows", "Docker", "launchd"],
      links: [],
    },
    {
      id: "comet",
      name: "COMET",
      tagline: "Contextual on-page English lookup across macOS and Chrome",
      period: "2026",
      featuredOnOverview: true,
      metricBadge: "macOS & Chrome",
      summary:
        "Standalone contextual English lookup and translation app for macOS and Chrome. Diagnosed and repaired a non-deterministic phrase-routing bug with generalized routing rules and fail-before/pass-after regression proofs.",
      proofPoints: [
        "Replaced brittle phrase workarounds with a generalized routing rule fix.",
        "Verified via automated fail-before and pass-after regression tests.",
        "Confirmed end-to-end readback across native macOS and Chrome surfaces.",
      ],
      stack: ["TypeScript", "Chrome Extension", "macOS", "Local LLM Routing", "Regression Testing"],
      links: [],
    },
    {
      id: "snap",
      name: "Snap",
      tagline: "Zero-dependency Swift macOS screenshot, annotation, and SSH clipboard tool",
      period: "2026",
      featuredOnOverview: false,
      metricBadge: "Zero-dep Swift",
      summary:
        "Standalone native macOS 15+ menu-bar capture and annotation app built purely with AppKit, ScreenCaptureKit, and Vision, featuring one-step OCR handoff to COMET and direct PNG/TIFF clipboard forwarding over SSH.",
      proofPoints: [
        "Zero third-party dependencies or Xcode project overhead (swiftc and make).",
        "Direct SSH clipboard streaming for pasting visual context into remote coding sessions.",
        "Editable vector annotations, OCR, pinned captures, and bounded transfer safety.",
      ],
      stack: ["Swift", "AppKit", "ScreenCaptureKit", "Vision OCR", "SSH"],
      links: [],
    },
  ],
  about: {
    introParagraphs: [
      "I am a full-stack and AI product engineer based in Hong Kong with over 20 years of experience spanning industrial design, web platforms, and backend systems. My core stack centers on TypeScript, React, Next.js, Node.js, and Go.",
      "Over the years I have built high-traffic consumer web platforms, multi-modal annotation and cloud tooling, internal SaaS suites, and 0-to-1 AI products. Working across design, frontend architecture, and backend services taught me to optimize for clarity, speed, and durable system boundaries.",
      "Today I focus on AI-native products and shared-memory agent systems, pairing strong product judgment with deterministic automation and inspectable engineering craft.",
    ],
    engineeringFocus: [
      {
        title: "Product and UX judgment with systems depth",
        description:
          "Pairing interface ergonomics with sound backend architecture so products feel effortless while staying maintainable under load.",
      },
      {
        title: "Single-source-of-truth design",
        description:
          "Deriving UI, documentation, and machine-readable surfaces from one canonical model to eliminate drift.",
      },
      {
        title: "Automated verification gates",
        description:
          "Using strict typing, linters, regression proofs, and CI checks to keep rapid iteration safe and repeatable.",
      },
      {
        title: "Pragmatic AI-assisted workflows",
        description:
          "Combining deterministic background services, shared context, and explicit human approval gates instead of brittle autonomous loops.",
      },
    ],
    workHistoryNote:
      "For full work history or a copy of my CV, connect on LinkedIn or reach out by email.",
  },
};

export const PROFILE: Profile = ProfileSchema.parse(rawProfile);
