import { ArrowUpRight } from "lucide-react";
import type { Profile, ProjectItem } from "@/domain/profile-schema";

interface ProjectsViewProps {
  projects: Profile["projects"];
}

export function ProjectsView({ projects }: ProjectsViewProps) {
  const publicProjects = projects.filter((project) => project.status === "public");
  const labProjects = projects.filter((project) => project.status === "lab");

  return (
    <section aria-label="Projects and independent builds">
      <div className="max-w-[60ch] pb-10">
        <h1 className="font-display text-[clamp(2.35rem,4.5vw,3.6rem)] leading-[1.04] font-medium tracking-[-0.038em] text-[var(--ink-primary)]">
          Projects and lab builds
        </h1>
        <p className="mt-4 text-body text-[var(--ink-secondary)]">
          Public commercial launches alongside sanitized architectures built inside StarLab. Former
          employer internal systems stay strictly in Career.
        </p>
      </div>

      <div className="border-t border-[var(--border-subtle)] pt-10">
        <h2 className="font-display text-heading font-semibold tracking-[-0.03em] text-[var(--ink-primary)]">
          Public launches
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2">
          {publicProjects.map((project) => (
            <ProjectEntry key={project.id} project={project} />
          ))}
        </div>
      </div>

      <div className="mt-16 border-t border-[var(--border-subtle)] pt-10">
        <h2 className="font-display text-heading font-semibold tracking-[-0.03em] text-[var(--ink-primary)]">
          Built inside StarLab
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2">
          {labProjects.map((project) => (
            <ProjectEntry key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectEntry({ project }: { project: ProjectItem }) {
  const isPublic = project.status === "public";

  return (
    <article
      id={project.id}
      className="flex scroll-mt-24 flex-col justify-between border-t border-[var(--border-subtle)] pt-6"
    >
      <div>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-body font-semibold text-[var(--ink-primary)]">{project.name}</h3>
          <span className="text-sm text-[var(--ink-muted)]">
            {isPublic ? "Public launch" : "Private lab"} · {project.period}
          </span>
        </div>

        <p className="mt-1.5 text-body font-medium text-[var(--ink-secondary)]">
          {project.tagline}
        </p>

        <p className="mt-3 max-w-[60ch] text-body text-[var(--ink-secondary)]">{project.summary}</p>

        <ul className="mt-4 space-y-1.5 text-body text-[var(--ink-secondary)]">
          {project.proofPoints.slice(0, 2).map((point) => (
            <li key={point} className="flex items-start gap-2.5">
              <span
                className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full"
                style={{
                  backgroundColor: isPublic ? "var(--accent-shared)" : "var(--accent-os)",
                }}
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
