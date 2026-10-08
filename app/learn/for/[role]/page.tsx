import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LearnMarket } from "@/components/learn/learn-shell";
import { LanderCta, LanderCourseList, LanderShell } from "@/components/learn/lander";
import { ROLE_PAGES, rolePage } from "@/lib/self-serve/landers";
import { withSiteShareImages } from "@/lib/social-image";

export function generateStaticParams() {
  return ROLE_PAGES.map((page) => ({ role: page.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ role: string }>;
}): Promise<Metadata> {
  const { role } = await params;
  const page = rolePage(role);
  if (!page) return { title: "Page not found", robots: { index: false, follow: false } };
  return withSiteShareImages({
    title: page.seoTitle,
    description: page.meta,
    alternates: { canonical: page.path },
    openGraph: { type: "website", title: page.seoTitle, description: page.meta, url: page.path },
    twitter: { title: page.seoTitle, description: page.meta },
  });
}

export default async function RoleLanderPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role } = await params;
  const page = rolePage(role);
  if (!page) notFound();

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
        <section>
          <h2>What has changed</h2>
          <p>{page.what_changed}</p>
        </section>
        <section>
          <h2>Courses</h2>
          <LanderCourseList courses={page.courses} />
          {page.note ? <p>{page.note}</p> : null}
          {page.sharedParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>
        <LanderCta href={page.cta[1]} label={page.cta[0]} note="Buying for your team? 2 to 50 places" />
      </LanderShell>
    </LearnMarket>
  );
}
