import { describe, expect, it } from "vitest";
import {
  COMMAND_ITEMS,
  filterCommands,
  parseInitialSurface,
  parseInitialTheme,
  PRIMARY_NAV_ITEMS,
  resolveActiveTabFromPathname,
} from "@/features/studio/studio-view-model";

describe("studio navigation and command view model", () => {
  it("exposes Overview, Projects, and About as the primary navigation items", () => {
    expect(PRIMARY_NAV_ITEMS).toEqual([
      { id: "overview", label: "Overview", href: "/" },
      { id: "projects", label: "Projects", href: "/projects/" },
      { id: "about", label: "About", href: "/about/" },
    ]);
  });

  it("resolves primary tabs from Next.js pathnames with or without trailing slashes", () => {
    expect(resolveActiveTabFromPathname("/")).toBe("overview");
    expect(resolveActiveTabFromPathname(null)).toBe("overview");
    expect(resolveActiveTabFromPathname("/projects")).toBe("projects");
    expect(resolveActiveTabFromPathname("/projects/")).toBe("projects");
    expect(resolveActiveTabFromPathname("/about")).toBe("about");
    expect(resolveActiveTabFromPathname("/about/")).toBe("about");
    expect(resolveActiveTabFromPathname("/career")).toBe("overview");
  });

  it("parses theme and surface defaults cleanly", () => {
    expect(parseInitialTheme(null)).toBe("light");
    expect(parseInitialTheme("dark")).toBe("dark");
    expect(parseInitialSurface(null)).toBe("human");
    expect(parseInitialSurface("agent")).toBe("agent");
  });

  it("filters command palette entries and aligns navigation commands with About and 5-anchor Projects", () => {
    const matches = filterCommands(COMMAND_ITEMS, "llms");
    expect(matches.map((m) => m.id)).toContain("copy-llms");
    expect(matches.map((m) => m.id)).toContain("toggle-surface");

    const commandIds = COMMAND_ITEMS.map((item) => item.id);
    expect(commandIds).toContain("nav-about");
    expect(commandIds).not.toContain("nav-career");

    const projectsCmd = COMMAND_ITEMS.find((item) => item.id === "nav-projects");
    expect(projectsCmd?.hint).toBe("AI products, StarLab, and standalone tools");
    expect(projectsCmd?.keywords).toEqual(["projects", "webpilot", "starlab", "comet", "snap"]);
  });
});
