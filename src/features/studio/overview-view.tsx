"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Copy, Mail } from "lucide-react";
import type { Profile } from "@/domain/profile-schema";
import { StarLabStage } from "@/features/starlab/starlab-stage";
import { buildStarLabViewState } from "@/features/starlab/starlab-view-model";
import { useSiteActions } from "./site-shell";

interface OverviewViewProps {
  profile: Profile;
}

export function OverviewView({ profile }: OverviewViewProps) {
  const { copyText, showToast } = useSiteActions();

  const [scenarioId, setScenarioId] = useState<string>(
    profile.starlab.scenarios[0]?.id ?? "plan-update",
  );
  const [approvedScenarioIds, setApprovedScenarioIds] = useState<ReadonlySet<string>>(
    () => new Set(),
  );

  const starlabView = useMemo(
    () =>
      buildStarLabViewState({
        starlab: profile.starlab,
        scenarioId,
        approvedScenarioIds,
      }),
    [approvedScenarioIds, profile.starlab, scenarioId],
  );

  const featuredProjects = useMemo(
    () => profile.projects.filter((project) => project.featuredOnOverview),
    [profile.projects],
  );

  const handleApproveGate = useCallback(() => {
    setApprovedScenarioIds((prev) => {
      const next = new Set(prev);
      next.add(starlabView.activeScenario.id);
      return next;
    });
    showToast("Human gate approved. Shared docs updated.");
  }, [showToast, starlabView.activeScenario.id]);

  return (
    <>
      <section aria-label="Introduction" className="max-w-4xl pt-2 sm:pt-4">
        <h1 className="font-display text-[clamp(2.45rem,4.7vw,4rem)] leading-[1.03] font-medium tracking-[-0.042em] text-[var(--ink-primary)]">
          {profile.identity.headlineLead}{" "}
          <span className="whitespace-nowrap bg-gradient-to-r from-[var(--accent-coding)] via-[var(--accent-os)] to-[var(--accent-shared)] bg-clip-text text-transparent">
            {profile.identity.headlineEmphasis}
          </span>{" "}
          agent systems.
        </h1>

        <p className="mt-4 max-w-[56ch] text-body text-[var(--ink-secondary)]">
          {profile.identity.subheadline}
        </p>

        <div className="mt-6">
          <button
            type="button"
            onClick={() => copyText(profile.identity.contact.email, "Copied ijoshwang@gmail.com")}
            className="craft-interactive inline-flex items-center gap-2.5 rounded-full bg-[var(--ink-primary)] px-5 py-2.5 text-sm font-medium text-[var(--bg-canvas)] hover:opacity-90"
          >
            <Mail className="h-4 w-4" />
            <span>{profile.identity.contact.email}</span>
            <Copy className="h-3.5 w-3.5 opacity-75" />
          </button>
        </div>
      </section>

      <StarLabStage
        title={profile.starlab.title}
        view={starlabView}
        onSelectScenario={setScenarioId}
        onApproveGate={handleApproveGate}
      />

      <section aria-labelledby="selected-work-heading" className="mt-20">
        <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
          <h2
            id="selected-work-heading"
            className="font-display text-heading font-semibold tracking-[-0.03em] text-[var(--ink-primary)]"
          >
            Selected work
          </h2>
          <Link
            href="/projects/"
            className="craft-color inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent-coding)] hover:opacity-80"
          >
            <span>All {profile.projects.length} projects</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <ul className="divide-y divide-[var(--border-subtle)] border-b border-[var(--border-subtle)]">
          {featuredProjects.map((project) => (
            <li key={project.id}>
              <Link
                href={`/projects/#${project.id}`}
                className="craft-color group flex w-full flex-col justify-between gap-2 py-5 text-left hover:bg-[var(--surface-subtle)]/50 sm:flex-row sm:items-baseline sm:px-2"
              >
                <div className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
                  <span className="shrink-0 text-body font-semibold text-[var(--ink-primary)]">
                    {project.name}
                  </span>
                  <span className="truncate text-body text-[var(--ink-secondary)]">
                    {project.tagline}
                  </span>
                </div>

                <span className="inline-flex shrink-0 items-center gap-2 text-sm text-[var(--ink-muted)]">
                  <span>{project.metricBadge}</span>
                  <ArrowUpRight className="craft-interactive h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--ink-primary)]" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
