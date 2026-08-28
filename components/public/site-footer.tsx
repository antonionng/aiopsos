import Link from "next/link";
import { Rss } from "lucide-react";
import { Wordmark } from "@/components/wordmark";
import { LITERACY_DISCLAIMER } from "@/lib/constants";

/**
 * The footer for the public marketing sections.
 *
 * The old one was a copyright line and three repeated links, which meant
 * every article ended in a dead end. This gives a reader who has just
 * finished a briefing somewhere obvious to go next.
 *
 * `showDisclaimer` defaults to true. The literacy wording is the sanctioned
 * text and belongs on any page that discusses training against the EU AI
 * Act, which now includes most of the insights.
 */

const COLUMNS = [
  {
    heading: "Learn",
    links: [
      { href: "/courses", label: "Courses" },
      { href: "/use-cases", label: "Use cases" },
      { href: "/insights", label: "Insights" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/experrt-ai", label: "Experrt AI" },
      { href: "/contact", label: "Contact" },
      { href: "/docs", label: "Docs" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { href: "/terms", label: "Terms" },
      { href: "/privacy", label: "Privacy" },
      { href: "/cookies", label: "Cookies" },
    ],
  },
] as const;

export function PublicSiteFooter({
  showDisclaimer = true,
}: {
  showDisclaimer?: boolean;
}) {
  return (
    <footer className="mt-24 border-t border-border/40">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:pr-8">
            <Link href="/" className="mb-3 inline-flex" aria-label="Experrt home">
              <Wordmark size="sm" />
            </Link>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Live, facilitated training in applied AI, technology adoption and
              robotics, with the records that evidence it.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.heading}>
              <h2 className="mb-3 text-xs font-semibold tracking-wide text-foreground">
                {column.heading}
              </h2>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {showDisclaimer && (
          <p className="mt-10 max-w-3xl border-t border-border/40 pt-6 text-xs leading-relaxed text-muted-foreground">
            {LITERACY_DISCLAIMER}
          </p>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border/40 pt-6">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Experrt. All rights reserved.
          </p>
          <a
            href="/insights/rss.xml"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <Rss className="h-3.5 w-3.5" />
            RSS
          </a>
        </div>
      </div>
    </footer>
  );
}
