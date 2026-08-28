import Link from "next/link";
import ReactMarkdown, { type Components } from "react-markdown";

/**
 * Long-form typography for the insights.
 *
 * The body used to render at 15px in `text-muted-foreground`, which on the
 * dark theme is roughly a 4:1 contrast ratio set two sizes below anything
 * anyone reads by choice. These are 1,500-word briefings for people reading
 * on a laptop between meetings, so the body is now 17px at 1.75 line height
 * in `foreground/80`, and the measure is capped near 68 characters.
 *
 * Muted grey is kept for the small print, not for the argument.
 */

const components: Components = {
  h2: ({ children }) => (
    <h2 className="mt-12 mb-4 scroll-mt-24 border-t border-border/60 pt-8 text-xl font-semibold tracking-[-0.01em] text-foreground first:mt-0 first:border-0 first:pt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-8 mb-3 text-base font-semibold tracking-[-0.01em] text-foreground">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="mb-6 text-[17px] leading-[1.75] text-foreground/80">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="mb-6 list-disc space-y-2.5 pl-5 text-[17px] leading-[1.7] text-foreground/80 marker:text-muted-foreground">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-6 list-decimal space-y-2.5 pl-5 text-[17px] leading-[1.7] text-foreground/80 marker:text-muted-foreground">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="pl-1">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="mb-6 border-l-2 border-brand/60 pl-5 text-[17px] leading-[1.7] text-foreground/70 italic">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-10 border-border/60" />,
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  code: ({ children }) => (
    <code className="rounded bg-muted px-1.5 py-0.5 text-[15px] text-foreground">
      {children}
    </code>
  ),
  a: ({ href, children }) => {
    if (!href) return <>{children}</>;
    const external = href.startsWith("http");
    if (external) {
      return (
        <a
          href={href}
          className="font-medium text-foreground underline decoration-brand/50 decoration-2 underline-offset-4 transition-colors hover:decoration-brand"
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    }
    return (
      <Link
        href={href}
        className="font-medium text-foreground underline decoration-brand/50 decoration-2 underline-offset-4 transition-colors hover:decoration-brand"
      >
        {children}
      </Link>
    );
  },
};

export function InsightArticleBody({ markdown }: { markdown: string }) {
  return (
    <div className="max-w-[68ch]">
      <ReactMarkdown components={components}>{markdown}</ReactMarkdown>
    </div>
  );
}
