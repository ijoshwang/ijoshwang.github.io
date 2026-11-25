import { describe, expect, it } from "vitest";
import { PROFILE } from "@/domain/profile-data";
import { ProfileSchema } from "@/domain/profile-schema";
import { formatLlmsTxt, formatProfileJson } from "@/domain/protocol-export";

describe("profile single source of truth", () => {
  it("validates against the strict Zod schema and contains no phone number or em-dashes", () => {
    const parsed = ProfileSchema.parse(PROFILE);
    const serialized = formatProfileJson(parsed);

    expect(serialized).not.toMatch(/\+\d{2,3}[\s-]?\d{4}/);
    expect(serialized).not.toMatch(/\b\d{4}[\s-]?\d{4}\b/);
    expect(serialized).not.toContain("+852");
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
    expect(llms).not.toContain("+852");
    expect(llms).not.toContain("—");
  });
});
