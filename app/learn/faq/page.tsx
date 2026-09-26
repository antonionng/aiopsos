import type { Metadata } from "next";
import Link from "next/link";
import { LearnMarket } from "@/components/learn/learn-shell";
import { StructuredData } from "@/components/structured-data";
import { LEARN_FAQ, allFaqItems } from "@/lib/self-serve/faq";
import { faqLd } from "@/lib/self-serve/seo";
import { withSiteShareImages } from "@/lib/social-image";

const TITLE = "Questions about self-paced courses";
const DESCRIPTION =
  "Payment, 12 months of access, certificates, team places, reviews and refunds for Experrt self-paced courses.";

export const metadata: Metadata = withSiteShareImages({
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/learn/faq" },
  openGraph: { type: "website", title: TITLE, description: DESCRIPTION, url: "/learn/faq" },
  robots: { index: true, follow: true },
});

export default function LearnFaqPage() {
  return (
    <LearnMarket>
      <StructuredData data={faqLd(allFaqItems())} />
      <section className="ex-land-faq ex-faq-page">
        <div className="ex-wide">
          <p className="ex-eyebrow">
            <span />
            QUESTIONS
          </p>
          <h1>Questions about self-paced courses</h1>
          <p className="ex-faq-lede">
            Can&apos;t find your answer? Email <a href="mailto:hello@experrt.com">hello@experrt.com</a>.
          </p>
          {LEARN_FAQ.map((group) => (
            <div className="ex-faq-group" key={group.title}>
              <h2>{group.title}</h2>
              <dl>
                {group.items.map((item) => (
                  <div key={item.question}>
                    <dt>{item.question}</dt>
                    <dd>{item.answer}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
          <p className="ex-land-faq-more">
            The full rules are in the <Link href="/course-terms">course terms of sale</Link> and the{" "}
            <Link href="/privacy">privacy policy</Link>. <Link href="/learn">Browse all courses</Link>.
          </p>
        </div>
      </section>
    </LearnMarket>
  );
}
