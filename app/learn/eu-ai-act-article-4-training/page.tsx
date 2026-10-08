import type { Metadata } from "next";
import Link from "next/link";
import { LearnMarket } from "@/components/learn/learn-shell";
import { LanderCta, LanderCourseList, LanderParagraph, LanderShell } from "@/components/learn/lander";
import { ARTICLE4_PAGE } from "@/lib/self-serve/landers";
import { withSiteShareImages } from "@/lib/social-image";

const page = ARTICLE4_PAGE;

export const metadata: Metadata = withSiteShareImages({
  title: page.seoTitle,
  description: page.meta,
  alternates: { canonical: page.path },
  openGraph: { type: "website", title: page.seoTitle, description: page.meta, url: page.path },
  twitter: { title: page.seoTitle, description: page.meta },
});

export default function Article4TrainingPage() {
  return (
    <LearnMarket>
      <LanderShell
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Self-paced courses", path: "/learn" },
          { name: page.h1, path: page.path },
        ]}
        h1={page.h1}
        intro={page.intro}
        faqs={page.faq}
      >
        {page.sections.map((section) => (
          <section key={section.h2}>
            <h2>{section.h2}</h2>
            {"body" in section && section.body
              ? section.body.map((paragraph) => <LanderParagraph key={paragraph} text={paragraph} />)
              : null}
            {"courses" in section && section.courses ? (
              <LanderCourseList courses={section.courses} />
            ) : null}
          </section>
        ))}
        <LanderCta
          href={page.cta.primary[1]}
          label={page.cta.primary[0]}
          secondaryHref={page.cta.secondary[1]}
          secondaryLabel={page.cta.secondary[0]}
          note={page.cta.team_note}
        />
        <section aria-labelledby="article4-sources">
          <h2 id="article4-sources">Sources</h2>
          <ul>
            {page.sources.map(([label, href]) => (
              <li key={href}>
                <Link href={href}>{label}</Link>
              </li>
            ))}
          </ul>
        </section>
      </LanderShell>
    </LearnMarket>
  );
}
