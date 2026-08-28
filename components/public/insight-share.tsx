"use client";

import { useState } from "react";
import { Check, Link2, Linkedin } from "lucide-react";

/**
 * Share row for an article.
 *
 * LinkedIn and a copy link, and nothing else. These briefings are read and
 * forwarded by L&D and HR people, and every other network in a share row for
 * this audience is a button nobody has ever pressed.
 */
export function InsightShare({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be refused. The URL is in the address bar.
    }
  }

  const linkedIn = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  const buttonClass =
    "inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <a
        href={linkedIn}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass}
        aria-label={`Share "${title}" on LinkedIn`}
      >
        <Linkedin className="h-3.5 w-3.5" />
        Share
      </a>
      <button type="button" onClick={copy} className={buttonClass}>
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-emerald-500" />
            Copied
          </>
        ) : (
          <>
            <Link2 className="h-3.5 w-3.5" />
            Copy link
          </>
        )}
      </button>
    </div>
  );
}
