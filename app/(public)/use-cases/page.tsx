import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getUseCasesByKind } from "@/lib/use-cases";
import { useCasesIndexMetadata } from "@/lib/public-share-metadata";

export const metadata: Metadata = useCasesIndexMetadata();

function UseCaseCard({
  slug,
  name,
  headline,
  exampleCount,
}: {
  slug: string;
  name: string;
  headline: string;
  exampleCount: number;
}) {
  return (
    <Link
      href={`/use-cases/${slug}`}
      className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-colors hover:border-foreground/30"
    >
      <h3 className="mb-1 text-lg font-semibold tracking-[-0.01em]">{name}</h3>
      <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">
        {headline}
      </p>
      <span className="inline-flex items-center text-sm font-medium text-foreground">
        {exampleCount} worked examples
        <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

export default function UseCasesPage() {
  const audiences = getUseCasesByKind("audience");
  const functions = getUseCasesByKind("function");

  return (
    <div>
      <header className="mb-12">
        <p className="mb-3 text-sm font-medium text-brand">Use cases</p>
        <h1 className="mb-4 font-display text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
          What the training looks like on your work
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Every course in the academy is delivered live, on the participants&apos;
          own work. These pages show what that means in practice - for the kind
          of organisation you are, and for the function doing the work.
        </p>
      </header>

      <section className="mb-12">
        <h2 className="mb-1 text-xl font-semibold tracking-[-0.01em]">
          By organisation
        </h2>
        <p className="mb-5 text-sm text-muted-foreground">
          The same catalogue, scoped very differently.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {audiences.map((entry) => (
            <UseCaseCard
              key={entry.slug}
              slug={entry.slug}
              name={entry.name}
              headline={entry.headline}
              exampleCount={entry.examples.length}
            />
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-1 text-xl font-semibold tracking-[-0.01em]">
          By function
        </h2>
        <p className="mb-5 text-sm text-muted-foreground">
          Where the work actually changes, team by team.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {functions.map((entry) => (
            <UseCaseCard
              key={entry.slug}
              slug={entry.slug}
              name={entry.name}
              headline={entry.headline}
              exampleCount={entry.examples.length}
            />
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-8">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-xl">
            <h2 className="mb-2 text-lg font-semibold tracking-[-0.01em]">
              Not sure where your gaps are?
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              The assessment measures each team&apos;s actual needs and
              recommends courses against them - so you commission training
              against evidence rather than a hunch.
            </p>
          </div>
          <Link
            href="/register"
            className="inline-flex h-10 items-center justify-center rounded-full bg-foreground px-6 text-sm font-semibold text-background transition-opacity hover:opacity-90"
          >
            Run an assessment
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
