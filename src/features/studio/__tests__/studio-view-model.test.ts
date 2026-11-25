import { describe, expect, it } from "vitest";
import {
  COMMAND_ITEMS,
  filterCommands,
  parseInitialSurface,
  parseInitialTheme,
  resolveActiveTabFromPathname,
} from "@/features/studio/studio-view-model";

describe("studio navigation and command view model", () => {
  it("resolves primary tabs from Next.js pathnames with or without trailing slashes", () => {
    expect(resolveActiveTabFromPathname("/")).toBe("overview");
    expect(resolveActiveTabFromPathname(null)).toBe("overview");
    expect(resolveActiveTabFromPathname("/projects")).toBe("projects");
    expect(resolveActiveTabFromPathname("/projects/")).toBe("projects");
    expect(resolveActiveTabFromPathname("/career")).toBe("career");
    expect(resolveActiveTabFromPathname("/career/")).toBe("career");
  });

  it("parses theme and surface defaults cleanly", () => {
    expect(parseInitialTheme(null)).toBe("light");
    expect(parseInitialTheme("dark")).toBe("dark");
    expect(parseInitialSurface(null)).toBe("human");
    expect(parseInitialSurface("agent")).toBe("agent");
  });

  it("filters command palette entries by keyword or label", () => {
    const matches = filterCommands(COMMAND_ITEMS, "llms");
    expect(matches.map((m) => m.id)).toContain("copy-llms");
    expect(matches.map((m) => m.id)).toContain("toggle-surface");
  });
});
