import { ArrowUpRight, Mail } from "lucide-react";
import type { Profile } from "@/domain/profile-schema";

interface AboutViewProps {
  about: Profile["about"];
  contact: Profile["identity"]["contact"];
}

export function AboutView({ about, contact }: AboutViewProps) {
  return (
    <section aria-label="About">
      <div className="max-w-[60ch] pb-10">
        <h1 className="font-display text-[clamp(2.35rem,4.5vw,3.6rem)] leading-[1.04] font-medium tracking-[-0.038em] text-[var(--ink-primary)]">
          About
        </h1>
        <div className="mt-5 space-y-4 text-body text-[var(--ink-secondary)]">
          {about.introParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>

      <div className="border-t border-[var(--border-subtle)] pt-10">
        <h2 className="font-display text-heading font-semibold tracking-[-0.03em] text-[var(--ink-primary)]">
          Engineering focus
        </h2>
        <ul className="mt-6 grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-2">
          {about.engineeringFocus.map((item) => (
            <li key={item.title} className="border-t border-[var(--border-subtle)] pt-5">
              <h3 className="text-body font-semibold text-[var(--ink-primary)]">{item.title}</h3>
              <p className="mt-1.5 max-w-[55ch] text-body text-[var(--ink-secondary)]">
                {item.description}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-14 border-t border-[var(--border-subtle)] pt-8">
        <h2 className="text-body font-semibold text-[var(--ink-primary)]">Full work history</h2>
        <p className="mt-2 max-w-[60ch] text-body text-[var(--ink-secondary)]">
          {about.workHistoryNote}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-5">
          <a
            href={contact.linkedin}
            target="_blank"
            rel="noreferrer"
            className="craft-color inline-flex items-center gap-1 text-sm font-medium text-[var(--accent-coding)] hover:opacity-80"
          >
            <span>LinkedIn</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
          <a
            href={`mailto:${contact.email}`}
            className="craft-color inline-flex items-center gap-1.5 text-sm font-medium text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
          >
            <Mail className="h-3.5 w-3.5" />
            <span>{contact.email}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
