import Link from "next/link";
import type { CopyBlock, FaqItem } from "@/lib/money-pages";

/**
 * Renders FAQ copy and turns public paths plus ag@experrt.com into links.
 * Answers stay the source-of-truth strings used in FAQPage JSON-LD.
 */
export function FaqList({
  faqs,
  heading = "Questions",
}: {
  faqs: readonly FaqItem[];
  heading?: string;
}) {
  return (
    <section>
      <h2 className="mb-6 text-xl font-semibold tracking-[-0.01em]">
        {heading}
      </h2>
      <dl className="space-y-6">
        {faqs.map((faq) => (
          <div key={faq.question}>
            <dt className="mb-1.5 text-sm font-semibold text-foreground">
              {faq.question}
            </dt>
            <dd className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              <LinkedCopy text={faq.answer} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function LinkedCopy({ text }: { text: string }) {
  const token =
    /(\/ai-literacy-training|\/ai-readiness-assessment|\/register|\/contact|\/courses(?:\/[a-z0-9-]+)?|\/insights\/[a-z0-9-]+|\/use-cases(?:\/[a-z0-9-]+)?|ag@experrt\.com)/g;
  const parts = text.split(token);
  return (
    <>
      {parts.map((part, index) => {
        if (part === "ag@experrt.com") {
          return (
            <a
              key={`${part}-${index}`}
              href="mailto:ag@experrt.com"
              className="font-medium text-foreground underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
            >
              ag@experrt.com
            </a>
          );
        }
        if (part.startsWith("/")) {
          return (
            <Link
              key={`${part}-${index}`}
              href={part}
              className="font-medium text-foreground underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
            >
              {part}
            </Link>
          );
        }
        return <span key={`${part}-${index}`}>{part}</span>;
      })}
    </>
  );
}

export function CopyBlocks({ blocks }: { blocks: readonly CopyBlock[] }) {
  return (
    <div className="space-y-8">
      {blocks.map((block) => (
        <section key={block.heading}>
          <h2 className="mb-3 text-xl font-semibold tracking-[-0.01em]">
            {block.heading}
          </h2>
          {block.paragraphs.map((paragraph) => (
            <p
              key={paragraph}
              className="mb-3 max-w-2xl text-sm leading-relaxed text-muted-foreground last:mb-0"
            >
              <LinkedCopy text={paragraph} />
            </p>
          ))}
          {block.bullets && block.bullets.length > 0 && (
            <ul className="mt-3 max-w-2xl space-y-2">
              {block.bullets.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
                >
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-foreground/40" />
                  <LinkedCopy text={item} />
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
}

export function ProgrammeCtas() {
  return (
    <div className="flex flex-wrap gap-3">
      <Link
        href="/contact"
        className="inline-flex h-10 items-center justify-center rounded-full bg-foreground px-6 text-sm font-semibold text-background transition-opacity hover:opacity-90"
      >
        Book a conversation
      </Link>
      <Link
        href="/register"
        className="inline-flex h-10 items-center justify-center rounded-full border border-border px-6 text-sm font-semibold transition-colors hover:bg-accent"
      >
        Get started free
      </Link>
      <Link
        href="/courses"
        className="inline-flex h-10 items-center justify-center rounded-full border border-border px-6 text-sm font-semibold transition-colors hover:bg-accent"
      >
        See the courses
      </Link>
    </div>
  );
}
