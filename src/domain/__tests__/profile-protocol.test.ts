import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { PROFILE } from "@/domain/profile-data";
import { ProfileSchema } from "@/domain/profile-schema";
import { formatLlmsTxt, formatProfileJson } from "@/domain/protocol-export";
import { SITE_URL } from "@/domain/site-config";

const SRC_ROOT = path.resolve(import.meta.dirname, "../..");
const THIS_TEST_FILE = path.resolve(import.meta.filename);
const PERSONAL_PHONE_PATTERN = /(?:\x2b852[ \t-]?)?\b\d{4}[ \t-]?\d{4}\b/;
const BANNED_CODENAME_PATTERNS: ReadonlyArray<{ label: string; regex: RegExp }> = [
  { label: "internal codename speedforce", regex: /\bspeedforce\b/i },
  { label: "internal codename flashpoint", regex: /\bflashpoint\b/i },
  { label: "retired codename cortex", regex: /\bcortex\b/i },
  { label: "retired codename openclaw", regex: /\bopenclaw\b/i },
  { label: "retired codename hermes", regex: /\bhermes\b/i },
  { label: "internal codename barry", regex: /\bbarry\b/i },
  { label: "retired runtime grok bot", regex: /\bgrok\s+bot\b/i },
];

function collectSourceFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectSourceFiles(fullPath));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }
  return files;
}

describe("profile single source of truth", () => {
  it("validates against the strict Zod schema and contains no phone number or em-dashes", () => {
    const parsed = ProfileSchema.parse(PROFILE);
    const serialized = formatProfileJson(parsed);

    expect(serialized).not.toMatch(/\+\d{2,3}[\s-]?\d{4}/);
    expect(serialized).not.toMatch(PERSONAL_PHONE_PATTERN);
    expect(serialized).not.toContain("—");
    expect(parsed.identity.contact.email).toBe("ijoshwang@gmail.com");
    expect(SITE_URL).toBe("https://ijoshwang.github.io");
    expect(parsed.identity.contact.website).toBe(SITE_URL);
    expect(parsed.identity.subheadline).toBe(
      "Full-stack and AI product engineer in Hong Kong with 20+ years of experience shipping TypeScript, Next.js, and Go systems, from 0-to-1 products like WebPilot to StarLab, a personal agent OS built on one shared context.",
    );
    expect("career" in parsed).toBe(false);
    expect("education" in parsed).toBe(false);
    expect(parsed.about.introParagraphs.length).toBeGreaterThanOrEqual(2);
    expect(parsed.about.engineeringFocus.length).toBeGreaterThanOrEqual(3);
  });

  it("curates 5 unified project anchors in editorial order without status buckets", () => {
    expect(PROFILE.projects.map((p) => p.id)).toEqual([
      "webpilot",
      "ijoshwang-site",
      "starlab",
      "comet",
      "snap",
    ]);
    expect(PROFILE.projects.filter((p) => p.featuredOnOverview).map((p) => p.id)).toEqual([
      "webpilot",
      "ijoshwang-site",
      "comet",
    ]);
    for (const project of PROFILE.projects) {
      expect("status" in project).toBe(false);
    }

    const starlabProject = PROFILE.projects.find((p) => p.id === "starlab");
    expect(starlabProject?.stack).toContain("Home Repo");
    expect(starlabProject?.metricBadge).toBe("Personal Agent OS");
  });

  it("exports /llms.txt containing StarLab shared-memory architecture, selected projects, and about", () => {
    const llms = formatLlmsTxt(PROFILE);

    expect(llms).toContain("# Huijun (Josh) Wang | AI-Native Product & Systems Engineer");
    expect(llms).toContain("Flagship Architecture: Multiple agents, one shared brain. (StarLab)");
    expect(llms).toContain("### Core Shared Primitives");
    expect(llms).toContain("Chat, Chief of Staff");
    expect(llms).toContain("## Selected Projects");
    expect(llms).not.toContain("## Projects & Lab Builds");
    expect(llms).not.toContain("[public");
    expect(llms).not.toContain("[lab");
    expect(llms).toContain("WebPilot");
    expect(llms).toContain("COMET");
    expect(llms).toContain("## About");
    expect(llms).not.toContain("## Career History");
    expect(llms).not.toContain("## Education");
    expect(llms).not.toMatch(PERSONAL_PHONE_PATTERN);
    expect(llms).not.toContain("—");
  });

  it("detects a synthetic phone number with or without formatting", () => {
    const groups = ["9999", "9999"];
    expect(groups.join("")).toMatch(PERSONAL_PHONE_PATTERN);
    expect(groups.join(" ")).toMatch(PERSONAL_PHONE_PATTERN);
    expect(groups.join("-")).toMatch(PERSONAL_PHONE_PATTERN);
  });

  it("detects synthetic internal or retired codename violations while allowing daily pivot and flash", () => {
    const syntheticLeaks = [
      "Powered by Speedforce Home Repo",
      "Migrated from flashpoint governance",
      "Read-only Cortex dashboard",
      "Replaced OpenClaw adapter",
      "Retired Hermes scheduler",
      "Agent Barry dispatched task",
      "Connected to Grok Bot runtime",
    ];

    for (const sample of syntheticLeaks) {
      const matched = BANNED_CODENAME_PATTERNS.some(({ regex }) => regex.test(sample));
      expect(matched, `Expected banned pattern to match: ${sample}`).toBe(true);
    }

    const allowedSamples = [
      "Daily Pivot morning brief",
      "Avoid flash of unstyled content on theme switch",
    ];
    for (const sample of allowedSamples) {
      const matched = BANNED_CODENAME_PATTERNS.some(({ regex }) => regex.test(sample));
      expect(matched, `Expected allowed sample not to match: ${sample}`).toBe(false);
    }
  });

  it("keeps public source files free of phone numbers, private links, local paths, and internal codenames", () => {
    const bannedPatterns: Array<{ label: string; regex: RegExp }> = [
      { label: "HK phone prefix", regex: /\x2b852/ },
      { label: "phone-like digits", regex: PERSONAL_PHONE_PATTERN },
      { label: "private Notion URL", regex: /app\.notion\.com/i },
      { label: "local macOS home path", regex: /\/Users\// },
    ];

    const violations: string[] = [];
    for (const file of collectSourceFiles(SRC_ROOT)) {
      const content = fs.readFileSync(file, "utf8");
      const rel = path.relative(SRC_ROOT, file);
      for (const { label, regex } of bannedPatterns) {
        if (regex.test(content)) {
          violations.push(`${rel}: matched ${label}`);
        }
      }
      if (path.resolve(file) !== THIS_TEST_FILE) {
        for (const { label, regex } of BANNED_CODENAME_PATTERNS) {
          if (regex.test(content)) {
            violations.push(`${rel}: matched ${label}`);
          }
        }
      }
    }

    expect(violations).toEqual([]);
  });
});
