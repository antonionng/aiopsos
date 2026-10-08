import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function AssistantMessage({ text, allowImages = true }: { text: string; allowImages?: boolean }) {
  return (
    <div className="min-w-0 break-words [&_p]:mb-3 [&_p:last-child]:mb-0 [&_strong]:font-semibold [&_h1]:text-base [&_h2]:text-base [&_h3]:text-sm [&_h1]:font-semibold [&_h2]:font-semibold [&_h3]:font-semibold [&_h1]:my-3 [&_h2]:my-3 [&_h3]:my-3 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5 [&_ul]:my-3 [&_ol]:my-3 [&_li]:my-1 [&_blockquote]:border-l-2 [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-background [&_pre]:p-3 [&_code]:text-xs [&_a]:text-brand [&_a]:underline [&_hr]:my-4">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        skipHtml
        disallowedElements={allowImages ? undefined : ["img"]}
        components={{
          table: ({ children }) => (
            <div className="my-3 overflow-x-auto">
              <table className="w-full border-collapse text-xs">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border p-2 text-left font-semibold">{children}</th>
          ),
          td: ({ children }) => (
            <td className="border p-2 align-top">{children}</td>
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}
