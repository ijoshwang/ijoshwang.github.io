"use client";

import { useState } from "react";
import { Check, Copy, FileCode2, FileText } from "lucide-react";

interface AgentSurfaceProps {
  llmsTxt: string;
  profileJson: string;
  onReturnToHuman: () => void;
}

export function AgentSurface({
  llmsTxt,
  profileJson,
  onReturnToHuman,
}: AgentSurfaceProps) {
  const [format, setFormat] = useState<"llms" | "json">("llms");
  const [copied, setCopied] = useState(false);

  const activeContent = format === "llms" ? llmsTxt : profileJson;
  const activeEndpoint = format === "llms" ? "/llms.txt" : "/profile.json";

  const handleCopy = () => {
    void navigator.clipboard.writeText(activeContent).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    });
  };

  return (
    <section
      aria-label="Agent protocol view"
      className="mx-auto max-w-5xl px-4 pt-10 pb-28 sm:px-8 sm:pt-14"
    >
      <div className="flex flex-col justify-between gap-4 border-b border-[var(--border-subtle)] pb-8 sm:flex-row sm:items-end">
        <div className="max-w-[60ch]">
          <h1 className="font-display text-[clamp(2.25rem,4.5vw,3.5rem)] leading-[1.06] font-semibold tracking-[-0.035em] text-[var(--ink-primary)]">
            Machine-readable profile
          </h1>
          <p className="mt-3 text-body text-[var(--ink-secondary)]">
            Generated from the exact Zod-validated TypeScript schema behind the visual site, built
            for recruiting agents and direct terminal inspection.
          </p>
        </div>

        <button
          type="button"
          onClick={onReturnToHuman}
          className="craft-color inline-flex shrink-0 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--surface-elevated)] px-4 py-2 text-sm font-medium text-[var(--ink-primary)] hover:bg-[var(--surface-hover)]"
        >
          Return to Human view
        </button>
      </div>

      <div className="mt-8 overflow-hidden rounded-[16px] border border-[var(--border-strong)] bg-[var(--surface-elevated)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] bg-[var(--surface-subtle)]/70 px-4 py-3 sm:px-5">
          <div
            role="tablist"
            aria-label="Protocol format"
            className="inline-flex items-center rounded-full border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-0.5"
          >
            <button
              type="button"
              role="tab"
              aria-selected={format === "llms"}
              onClick={() => setFormat("llms")}
              className={`craft-color inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 font-mono text-sm ${
                format === "llms"
                  ? "bg-[var(--ink-primary)] font-medium text-[var(--bg-canvas)]"
                  : "text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              /llms.txt
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={format === "json"}
              onClick={() => setFormat("json")}
              className={`craft-color inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 font-mono text-sm ${
                format === "json"
                  ? "bg-[var(--ink-primary)] font-medium text-[var(--bg-canvas)]"
                  : "text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
              }`}
            >
              <FileCode2 className="h-3.5 w-3.5" />
              /profile.json
            </button>
          </div>

          <div className="flex items-center gap-4">
            <code className="hidden font-mono text-sm text-[var(--ink-muted)] md:inline">
              curl -s https://ijoshwang.github.io{activeEndpoint}
            </code>
            <button
              type="button"
              onClick={handleCopy}
              className="craft-color inline-flex items-center gap-1.5 rounded-full border border-[var(--border-strong)] bg-[var(--surface-elevated)] px-3.5 py-1.5 text-sm font-medium text-[var(--ink-primary)] hover:bg-[var(--surface-hover)]"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-[var(--accent-shared)]" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 text-[var(--ink-muted)]" />
                  Copy payload
                </>
              )}
            </button>
          </div>
        </div>

        <pre className="max-h-[65vh] overflow-auto whitespace-pre-wrap break-words p-5 font-mono text-sm leading-6 text-[var(--ink-primary)] sm:p-6">
          <code>{activeContent}</code>
        </pre>
      </div>
    </section>
  );
}
