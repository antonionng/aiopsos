import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ASSESSMENT_PAGE } from "@/lib/money-pages";
import {
  DIMENSIONS,
  DIMENSION_LABELS,
  MATURITY_TIERS,
} from "@/lib/constants";
import { getPublicSiteUrl } from "@/lib/site";
import {
  StructuredData,
  ORGANISATION_LD,
  faqPageLd,
  webPageLd,
} from "@/components/structured-data";
import {
  CopyBlocks,
  FaqList,
  ProgrammeCtas,
} from "@/components/marketing/faq-list";

const SITE_URL = getPublicSiteUrl();
const CANONICAL = `${SITE_URL}/ai-readiness-assessment`;

export const metadata: Metadata = {
  title: ASSESSMENT_PAGE.title,
  description: ASSESSMENT_PAGE.description,
  alternates: { canonical: CANONICAL },
  robots: { index: true, follow: true },
  openGraph: {
    title: `${ASSESSMENT_PAGE.title} | Experrt`,
    description: ASSESSMENT_PAGE.description,
    url: CANONICAL,
    type: "website",
  },
  twitter: {
    title: `${ASSESSMENT_PAGE.title} | Experrt`,
    description: ASSESSMENT_PAGE.description,
  },
};

export default function AiReadinessAssessmentPage() {
  return (
    <article>
      <StructuredData data={ORGANISATION_LD} />
      <StructuredData
        data={webPageLd({
          path: "/ai-readiness-assessment",
          name: ASSESSMENT_PAGE.title,
          description: ASSESSMENT_PAGE.description,
        })}
      />
      <StructuredData data={faqPageLd(ASSESSMENT_PAGE.faqs)} />

      <header className="mb-12">
        <p className="mb-3 text-sm font-medium text-brand">Assessment</p>
        <h1 className="mb-4 font-display text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
          {ASSESSMENT_PAGE.h1}
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
          {ASSESSMENT_PAGE.standfirst}
        </p>
      </header>

      <div className="mb-12 space-y-10">
        <CopyBlocks
          blocks={[ASSESSMENT_PAGE.whatItIs, ASSESSMENT_PAGE.whatItIsNot]}
        />
      </div>

      <section className="mb-12">
        <h2 className="mb-3 text-xl font-semibold tracking-[-0.01em]">
          Five dimensions
        </h2>
        <p className="mb-5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          These are the axes the diagnostic scores. The names are the ones
          the instrument already uses.
        </p>
        <ol className="grid gap-3 sm:grid-cols-2">
          {DIMENSIONS.map((dimension, index) => (
            <li
              key={dimension}
              className="rounded-xl border border-border bg-card px-5 py-4 text-sm font-medium"
            >
              <span className="mr-2 text-muted-foreground">{index + 1}.</span>
              {DIMENSION_LABELS[dimension]}
            </li>
          ))}
        </ol>
      </section>

      <section className="mb-12">
        <h2 className="mb-3 text-xl font-semibold tracking-[-0.01em]">
          Six maturity tiers
        </h2>
        <p className="mb-5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          A 0–5 scale in six bands. The labels below are the existing scale.
          This page does not invent names.
        </p>
        <ol className="space-y-2">
          {MATURITY_TIERS.map((tier) => (
            <li
              key={tier.tier}
              className="flex flex-wrap items-baseline gap-3 rounded-xl border border-border bg-card px-5 py-3 text-sm"
            >
              <span className="text-xs text-muted-foreground">
                Tier {tier.tier}
              </span>
              <span className="font-medium">{tier.label}</span>
              <span className="text-xs text-muted-foreground">
                {tier.min}–{tier.max}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <CopyBlocks blocks={[ASSESSMENT_PAGE.after]} />

      <p className="mt-6 mb-12 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Scores map to live courses. See the programme at{" "}
        <Link
          href="/ai-literacy-training"
          className="font-medium text-foreground underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
        >
          /ai-literacy-training
        </Link>{" "}
        or the catalogue at{" "}
        <Link
          href="/courses"
          className="inline-flex items-center font-medium text-foreground underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
        >
          /courses
          <ArrowRight className="ml-1 h-3.5 w-3.5" />
        </Link>
        .
      </p>

      <div className="mb-12">
        <FaqList faqs={ASSESSMENT_PAGE.faqs} />
      </div>

      <section className="rounded-2xl border-2 border-brand/20 bg-card p-8">
        <h2 className="mb-2 text-lg font-semibold tracking-[-0.01em]">
          Start the assessment
        </h2>
        <p className="mb-5 max-w-xl text-sm leading-relaxed text-muted-foreground">
          An account is needed today. This page stays public. Contact{" "}
          <a
            href="mailto:ag@experrt.com"
            className="font-medium text-foreground underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
          >
            ag@experrt.com
          </a>
          .
        </p>
        <ProgrammeCtas />
      </section>
    </article>
  );
}
