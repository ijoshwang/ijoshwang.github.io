import { ArrowUpRight } from "lucide-react";
import type { Profile, ProjectItem } from "@/domain/profile-schema";

interface ProjectsViewProps {
  projects: Profile["projects"];
}

export function ProjectsView({ projects }: ProjectsViewProps) {
  return (
    <section aria-label="Projects">
      <div className="max-w-[60ch] pb-10">
        <h1 className="font-display text-[clamp(2.35rem,4.5vw,3.6rem)] leading-[1.04] font-medium tracking-[-0.038em] text-[var(--ink-primary)]">
          Projects
        </h1>
        <p className="mt-4 text-body text-[var(--ink-secondary)]">
          AI products, personal agent systems, and standalone engineering tools I have designed and
          built.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-x-10 gap-y-8 border-t border-[var(--border-subtle)] pt-10 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectEntry key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}

function ProjectEntry({ project }: { project: ProjectItem }) {
  return (
    <article
      id={project.id}
      className="flex scroll-mt-24 flex-col justify-between border-t border-[var(--border-subtle)] pt-6"
    >
      <div>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-body font-semibold text-[var(--ink-primary)]">{project.name}</h2>
          <span className="text-sm text-[var(--ink-muted)]">
            {project.metricBadge} · {project.period}
          </span>
        </div>

        <p className="mt-1.5 text-body font-medium text-[var(--ink-secondary)]">
          {project.tagline}
        </p>

        <p className="mt-3 max-w-[60ch] text-body text-[var(--ink-secondary)]">{project.summary}</p>

        <ul className="mt-4 space-y-1.5 text-body text-[var(--ink-secondary)]">
          {project.proofPoints.map((point) => (
            <li key={point} className="flex items-start gap-2.5">
              <span
                aria-hidden="true"
                className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-coding)]"
              />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 pt-3">
        <p className="text-sm text-[var(--ink-muted)]">{project.stack.join(", ")}</p>

        {project.links.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-5">
            {project.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="craft-color inline-flex items-center gap-1 text-sm font-medium text-[var(--accent-coding)] hover:opacity-80"
              >
                <span>{link.label}</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
