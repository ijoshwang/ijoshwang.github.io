import type { Profile } from "./profile-schema";

export function formatLlmsTxt(profile: Profile): string {
  const { identity, starlab, projects, about } = profile;

  const lines: string[] = [
    `# ${identity.fullName} | ${identity.role}`,
    "",
    `> ${identity.subheadline}`,
    "",
    `- **Location:** ${identity.location}`,
    `- **Availability:** ${identity.availability}`,
    `- **Website:** ${identity.contact.website}`,
    `- **GitHub:** ${identity.contact.github}`,
    `- **LinkedIn:** ${identity.contact.linkedin}`,
    `- **Email:** ${identity.contact.email}`,
    `- **Updated:** ${profile.updatedAt}`,
    "",
    `## Flagship Architecture: ${starlab.title} (StarLab)`,
    "",
    starlab.oneLiner,
    "",
    "### Core Shared Primitives",
    ...starlab.corePrimitives.map((primitive) => `- ${primitive}`),
    "",
    "### Collaborating Agent Roles",
    ...starlab.agents.map(
      (agent) => `- **${agent.name}** (${agent.codename}): ${agent.description}`,
    ),
    "",
    "### Collaboration Examples",
    ...starlab.scenarios.map(
      (scenario) => `- **${scenario.shortLabel}**: ${scenario.solutionSummary}`,
    ),
    "",
    "## Selected Projects",
    "",
    ...projects.map((project) => {
      const linkSuffix =
        project.links.length > 0
          ? ` | ${project.links.map((l) => `[${l.label}](${l.href})`).join(", ")}`
          : "";
      return `- **${project.name}** (${project.metricBadge}, ${project.period}): ${project.tagline}. ${project.summary}${linkSuffix}`;
    }),
    "",
    "## About",
    "",
    ...about.introParagraphs.flatMap((paragraph) => [paragraph, ""]),
    "### Engineering Focus",
    ...about.engineeringFocus.map((point) => `- **${point.title}**: ${point.description}`),
    "",
    `${about.workHistoryNote} LinkedIn: ${identity.contact.linkedin} | Email: ${identity.contact.email}`,
    "",
  ];

  return lines.join("\n");
}

export function formatProfileJson(profile: Profile): string {
  return JSON.stringify(profile, null, 2);
}
