import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { PROFILE } from "@/domain/profile-data";
import { ProfileSchema } from "@/domain/profile-schema";
import { formatLlmsTxt, formatProfileJson } from "@/domain/protocol-export";

const SRC_ROOT = path.resolve(import.meta.dirname, "../..");
const PERSONAL_PHONE_PATTERN = /(?:\x2b852[ \t-]?)?\b\d{4}[ \t-]?\d{4}\b/;

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
  });

  it("exports /llms.txt containing StarLab shared-memory architecture and verified public launches", () => {
    const llms = formatLlmsTxt(PROFILE);

    expect(llms).toContain("# Huijun (Josh) Wang | AI-Native Product & Systems Engineer");
    expect(llms).toContain("Flagship Architecture: Multiple agents, one shared brain. (StarLab)");
    expect(llms).toContain("### Core Shared Primitives");
    expect(llms).toContain("Chat, Chief of Staff");
    expect(llms).toContain("WebPilot");
    expect(llms).toContain("COMET");
    expect(llms).not.toMatch(PERSONAL_PHONE_PATTERN);
    expect(llms).not.toContain("—");
  });

  it("detects a synthetic phone number with or without formatting", () => {
    const groups = ["9999", "9999"];
    expect(groups.join("")).toMatch(PERSONAL_PHONE_PATTERN);
    expect(groups.join(" ")).toMatch(PERSONAL_PHONE_PATTERN);
    expect(groups.join("-")).toMatch(PERSONAL_PHONE_PATTERN);
  });

  it("keeps public source files free of phone numbers, private Notion links, and local user paths", () => {
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
    }

    expect(violations).toEqual([]);
  });
});
