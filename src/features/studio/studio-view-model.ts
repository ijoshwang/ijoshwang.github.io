export type ThemeMode = "light" | "dark";
export type SurfaceMode = "human" | "agent";
export type ActiveTabId = "overview" | "projects" | "about";

export interface NavItem {
  id: ActiveTabId;
  label: string;
  href: string;
}

export const PRIMARY_NAV_ITEMS: readonly NavItem[] = [
  { id: "overview", label: "Overview", href: "/" },
  { id: "projects", label: "Projects", href: "/projects/" },
  { id: "about", label: "About", href: "/about/" },
];

export interface CommandItem {
  id: string;
  group: "Navigate" | "Display" | "Actions";
  label: string;
  hint: string;
  keywords: string[];
}

export const COMMAND_ITEMS: readonly CommandItem[] = [
  {
    id: "nav-overview",
    group: "Navigate",
    label: "Go to Overview",
    hint: "Builder anchor and StarLab flagship stage",
    keywords: ["home", "overview", "starlab", "showcase"],
  },
  {
    id: "nav-projects",
    group: "Navigate",
    label: "Go to Projects",
    hint: "AI products, StarLab, and standalone tools",
    keywords: ["projects", "webpilot", "starlab", "comet", "snap"],
  },
  {
    id: "nav-about",
    group: "Navigate",
    label: "Go to About",
    hint: "Background, engineering focus, and contact",
    keywords: ["about", "background", "bio", "focus", "contact", "cv"],
  },
  {
    id: "toggle-surface",
    group: "Display",
    label: "Toggle Human / Agent view",
    hint: "Switch between visual UI and /llms.txt protocol",
    keywords: ["agent", "human", "llms", "json", "protocol", "mode"],
  },
  {
    id: "toggle-theme",
    group: "Display",
    label: "Toggle Light / Dark theme",
    hint: "Gallery light default or obsidian dark",
    keywords: ["theme", "dark", "light", "appearance"],
  },
  {
    id: "copy-email",
    group: "Actions",
    label: "Copy email address",
    hint: "ijoshwang@gmail.com",
    keywords: ["email", "contact", "copy", "mail"],
  },
  {
    id: "copy-llms",
    group: "Actions",
    label: "Copy /llms.txt context",
    hint: "Structured Markdown brief for AI agents",
    keywords: ["llms", "markdown", "copy", "agent", "context"],
  },
];

export function filterCommands(items: readonly CommandItem[], query: string): CommandItem[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [...items];

  return items.filter((item) => {
    const haystack = [item.label, item.hint, item.group, ...item.keywords].join(" ").toLowerCase();
    return haystack.includes(normalized);
  });
}

export function resolveActiveTabFromPathname(pathname: string | null): ActiveTabId {
  if (!pathname) return "overview";
  const normalized = pathname.toLowerCase().replace(/\/+$/, "") || "/";
  if (normalized === "/projects" || normalized.startsWith("/projects/")) return "projects";
  if (normalized === "/about" || normalized.startsWith("/about/")) return "about";
  return "overview";
}

export function parseInitialTheme(raw: string | null): ThemeMode {
  return raw === "dark" ? "dark" : "light";
}

export function parseInitialSurface(raw: string | null): SurfaceMode {
  return raw === "agent" ? "agent" : "human";
}
