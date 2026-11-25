import type { Profile } from "@/domain/profile-schema";

interface CareerViewProps {
  career: Profile["career"];
  education: Profile["education"];
}

export function CareerView({ career, education }: CareerViewProps) {
  return (
    <section aria-label="Career history">
      <div className="max-w-[60ch] pb-10">
        <h1 className="font-display text-[clamp(2.35rem,4.5vw,3.6rem)] leading-[1.04] font-medium tracking-[-0.038em] text-[var(--ink-primary)]">
          Career history
        </h1>
        <p className="mt-4 text-body text-[var(--ink-secondary)]">
          Twenty years from industrial design and consumer web platforms to 0-to-1 AI products, Go
          and ClickHouse backends, and personal agent systems.
        </p>
      </div>

      <ol className="divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]">
        {career.map((entry) => (
          <li key={entry.id} className="grid grid-cols-1 gap-4 py-8 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-4">
              <h2 className="text-body font-semibold text-[var(--ink-primary)]">{entry.company}</h2>
              <p className="mt-0.5 text-sm text-[var(--ink-secondary)]">{entry.role}</p>
              <p className="mt-1 text-sm text-[var(--ink-muted)]">
                {entry.period}, {entry.location}
              </p>
            </div>

            <ul className="space-y-2.5 text-body text-[var(--ink-secondary)] lg:col-span-8">
              {entry.highlights.map((bullet) => (
                <li key={bullet} className="max-w-[65ch]">
                  {bullet}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <h2 className="text-body font-semibold text-[var(--ink-primary)]">Education</h2>
        </div>
        <div className="lg:col-span-8">
          <p className="text-body font-medium text-[var(--ink-primary)]">{education.school}</p>
          <p className="mt-0.5 text-sm text-[var(--ink-secondary)]">
            {education.degree}, {education.location}
          </p>
        </div>
      </div>
    </section>
  );
}
