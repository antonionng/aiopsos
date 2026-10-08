import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LearnMarket } from "@/components/learn/learn-shell";
import { LanderCta, LanderCourseList, LanderParagraph, LanderShell } from "@/components/learn/lander";
import { CHECKED_DATE, COMPARISON_PAGES, EXPERRT_VAT_NOTE, comparisonPage } from "@/lib/self-serve/landers";
import { withSiteShareImages } from "@/lib/social-image";

export function generateStaticParams() {
  return COMPARISON_PAGES.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = comparisonPage(slug);
  if (!page) return { title: "Page not found", robots: { index: false, follow: false } };
  return withSiteShareImages({
    title: page.seoTitle,
    description: page.meta,
    alternates: { canonical: page.path },
    openGraph: { type: "website", title: page.seoTitle, description: page.meta, url: page.path },
    twitter: { title: page.seoTitle, description: page.meta },
  });
}

export default async function ComparisonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = comparisonPage(slug);
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
        stamp={`Prices and details checked on ${CHECKED_DATE} from each provider's public page.`}
      >
        <div className="ex-lander-table-wrap">
          <table className="ex-lander-table">
            <thead>
              <tr>
                {page.table_cols.map((col) => (
                  <th key={col} scope="col">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {page.rows.map((row) => (
                <tr key={`${row[1]}-${row[0]}`}>
                  {row.map((cell, index) => {
                    const isExperrtPrice = row[1] === "Experrt" && index === 2;
                    return (
                      <td key={`${row[0]}-${index}`}>
                        {index === row.length - 1 ? (
                          <Link href={cell}>{cell}</Link>
                        ) : isExperrtPrice ? (
                          <>
                            {cell}{" "}
                            <span className="ex-hint">{EXPERRT_VAT_NOTE}</span>
                          </>
                        ) : (
                          cell
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {page.sections.map((section) => (
          <section key={section.h2}>
            <h2>{section.h2}</h2>
            {"body" in section && section.body
              ? section.body.map((paragraph) => <LanderParagraph key={paragraph} text={paragraph} />)
              : null}
            {"courses" in section && section.courses ? (
              <LanderCourseList courses={section.courses} priceNote={EXPERRT_VAT_NOTE} />
            ) : null}
          </section>
        ))}
        <LanderCta href={page.cta[1]} label={page.cta[0]} />
      </LanderShell>
    </LearnMarket>
  );
}
