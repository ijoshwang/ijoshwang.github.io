import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <section className="max-w-xl py-16">
      <h1 className="font-display text-[clamp(2.25rem,4.5vw,3.5rem)] leading-[1.06] font-medium tracking-[-0.035em] text-[var(--ink-primary)]">
        Page not found
      </h1>
      <p className="mt-4 text-body text-[var(--ink-secondary)]">
        The route you requested does not exist on this site. Jump back to Overview, Projects, or
        Career.
      </p>
      <div className="mt-7">
        <Link
          href="/"
          className="craft-interactive inline-flex items-center gap-2 rounded-full bg-[var(--ink-primary)] px-5 py-2.5 text-sm font-medium text-[var(--bg-canvas)] hover:opacity-90"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Overview</span>
        </Link>
      </div>
    </section>
  );
}
