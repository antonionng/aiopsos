import Link from "next/link";
import ReactMarkdown, { type Components } from "react-markdown";

const components: Components = {
  h2: ({ children }) => (
    <h2 className="mt-10 mb-4 text-xl font-semibold tracking-[-0.01em]">
      {children}
    </h2>
  ),
  p: ({ children }) => (
    <p className="mb-5 text-[15px] leading-relaxed text-muted-foreground">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="mb-5 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-muted-foreground">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-5 list-decimal space-y-2 pl-5 text-[15px] leading-relaxed text-muted-foreground">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="pl-0.5">{children}</li>,
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  a: ({ href, children }) => {
    if (!href) return <>{children}</>;
    const external = href.startsWith("http");
    if (external) {
      return (
        <a
          href={href}
          className="font-medium text-foreground underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
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
        className="font-medium text-foreground underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
      >
        {children}
      </Link>
    );
  },
};

export function InsightArticleBody({ markdown }: { markdown: string }) {
  return (
    <div className="max-w-2xl">
      <ReactMarkdown components={components}>{markdown}</ReactMarkdown>
    </div>
  );
}
