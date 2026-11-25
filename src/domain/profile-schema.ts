import { z } from "zod";

export const StarLabAgentIdSchema = z.enum(["chat", "inbox", "brief"]);
export type StarLabAgentId = z.infer<typeof StarLabAgentIdSchema>;

export const StarLabAgentSchema = z.object({
  id: StarLabAgentIdSchema,
  name: z.string().min(1),
  role: z.string().min(1),
  codename: z.string().min(1),
  accent: z.enum(["indigo", "amber", "teal"]),
  description: z.string().min(1),
});
export type StarLabAgent = z.infer<typeof StarLabAgentSchema>;

export const StarLabActivityStepSchema = z.object({
  id: z.string().min(1),
  agentId: StarLabAgentIdSchema,
  verb: z.enum(["READ", "WRITE", "SYNC", "GATE"]),
  target: z.string().min(1),
  summary: z.string().min(1),
  detail: z.string().min(1),
});
export type StarLabActivityStep = z.infer<typeof StarLabActivityStepSchema>;

export const StarLabSiloCardSchema = z.object({
  agentId: StarLabAgentIdSchema,
  statusLabel: z.string().min(1),
  snippet: z.string().min(1),
  problemTag: z.string().min(1),
});
export type StarLabSiloCard = z.infer<typeof StarLabSiloCardSchema>;

export const StarLabSharedDocRowSchema = z.object({
  id: z.string().min(1),
  layer: z.enum(["memory", "docs", "gate"]),
  label: z.string().min(1),
  path: z.string().min(1),
  beforeValue: z.string().min(1),
  afterValue: z.string().min(1),
  updatedBy: z.string().min(1),
  requiresApproval: z.boolean(),
});
export type StarLabSharedDocRow = z.infer<typeof StarLabSharedDocRowSchema>;

export const StarLabScenarioSchema = z.object({
  id: z.string().min(1),
  shortLabel: z.string().min(1),
  prompt: z.string().min(1),
  painSummary: z.string().min(1),
  solutionSummary: z.string().min(1),
  siloRelayNote: z.string().min(1),
  siloCards: z.array(StarLabSiloCardSchema).length(3),
  steps: z.array(StarLabActivityStepSchema).min(3),
  sharedDocs: z.array(StarLabSharedDocRowSchema).length(3),
  gateActionLabel: z.string().min(1),
  gateApprovedNote: z.string().min(1),
});
export type StarLabScenario = z.infer<typeof StarLabScenarioSchema>;

export const ProjectStatusSchema = z.enum(["public", "lab", "purified"]);
export type ProjectStatus = z.infer<typeof ProjectStatusSchema>;

export const ProjectItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  tagline: z.string().min(1),
  status: ProjectStatusSchema,
  period: z.string().min(1),
  featuredOnOverview: z.boolean(),
  metricBadge: z.string().min(1),
  summary: z.string().min(1),
  proofPoints: z.array(z.string().min(1)).min(1),
  stack: z.array(z.string().min(1)).min(1),
  links: z.array(
    z.object({
      label: z.string().min(1),
      href: z.string().url(),
    }),
  ),
});
export type ProjectItem = z.infer<typeof ProjectItemSchema>;

export const CareerEntrySchema = z.object({
  id: z.string().min(1),
  company: z.string().min(1),
  location: z.string().min(1),
  role: z.string().min(1),
  period: z.string().min(1),
  highlights: z.array(z.string().min(1)).min(1),
});
export type CareerEntry = z.infer<typeof CareerEntrySchema>;

export const ProfileSchema = z.object({
  version: z.string().min(1),
  updatedAt: z.string().min(1),
  identity: z.object({
    name: z.string().min(1),
    fullName: z.string().min(1),
    role: z.string().min(1),
    location: z.string().min(1),
    availability: z.string().min(1),
    headlineLead: z.string().min(1),
    headlineEmphasis: z.string().min(1),
    subheadline: z.string().min(1),
    contact: z.object({
      email: z.string().email(),
      github: z.string().url(),
      linkedin: z.string().url(),
      website: z.string().url(),
    }),
  }),
  starlab: z.object({
    badge: z.string().min(1),
    title: z.string().min(1),
    oneLiner: z.string().min(1),
    corePrimitives: z.array(z.string().min(1)).min(3),
    agents: z.array(StarLabAgentSchema).length(3),
    scenarios: z.array(StarLabScenarioSchema).min(2),
  }),
  projects: z.array(ProjectItemSchema).min(1),
  career: z.array(CareerEntrySchema).min(1),
  education: z.object({
    school: z.string().min(1),
    location: z.string().min(1),
    degree: z.string().min(1),
  }),
});

export type Profile = z.infer<typeof ProfileSchema>;
