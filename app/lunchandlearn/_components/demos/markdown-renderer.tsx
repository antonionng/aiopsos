"use client";

import ReactMarkdown, { type Components } from "react-markdown";

const components: Components = {
  h1: ({ children }) => (
    <h1 className="mb-4 mt-8 first:mt-0 text-2xl font-bold text-white">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-3 mt-8 first:mt-0 border-b border-white/10 pb-2 text-xl font-bold text-white">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-2 mt-5 first:mt-0 text-lg font-semibold text-white">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="mb-2 mt-4 first:mt-0 text-base font-semibold text-zinc-200">{children}</h4>
  ),
  p: ({ children }) => (
    <p className="mb-4 leading-relaxed text-zinc-300">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="mb-4 ml-1 space-y-2">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-4 ml-1 space-y-2 list-decimal list-inside">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="flex items-start gap-2.5 leading-relaxed text-zinc-300">
      <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-500" />
      <span className="flex-1">{children}</span>
    </li>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-white">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="text-zinc-400">{children}</em>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mb-4 rounded-r-lg border-l-2 border-white/20 bg-white/[0.03] py-2 pl-4 pr-3">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-6 border-white/10" />,
  code: ({ children, className }) => {
    const isBlock = className?.includes("language-");
    if (isBlock) {
      return (
        <pre className="mb-4 overflow-x-auto rounded-lg bg-white/[0.04] p-4">
          <code className="text-sm text-zinc-200">{children}</code>
        </pre>
      );
    }
    return (
      <code className="rounded bg-white/10 px-1.5 py-0.5 text-sm text-zinc-200">{children}</code>
    );
  },
  table: ({ children }) => (
    <div className="mb-4 overflow-x-auto rounded-lg border border-white/10">
      <table className="w-full text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="border-b border-white/10 bg-white/[0.03]">{children}</thead>
  ),
  th: ({ children }) => (
    <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-3 py-2 text-zinc-300">{children}</td>
  ),
  tr: ({ children }) => (
    <tr className="border-b border-white/5 last:border-0">{children}</tr>
  ),
};

export function StyledMarkdown({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <ReactMarkdown components={components}>{content}</ReactMarkdown>
    </div>
  );
}
