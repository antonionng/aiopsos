import { wonderlabShare } from "@/lib/wonderlab/share";
import type { Metadata } from "next";
import Link from "next/link";
import { Wordmark } from "@/components/wordmark";
import "./wonderlab.css";
import "./games.css";
import "./illustrations.css";
export const metadata: Metadata = {
  ...wonderlabShare,
  title: {
    default: "Wonderlab by Experrt | AI adventures for kids and teens",
    template: "%s | Wonderlab by Experrt",
  },
  description:
    "Play, create and learn to think carefully with AI. Age-appropriate missions for children aged 4–16, with a parent-managed family space.",
};
export default function WonderlabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="wl">
      <a href="#wonderlab-main" className="wl-skip">
        Skip to content
      </a>
      <header className="wl-nav">
        <Link
          href="/wonderlab"
          className="wl-logo"
          aria-label="Wonderlab by Experrt home"
        >
          <span className="wl-brand-star">✳</span>
          <span>
            wonderlab
            <small className="wl-parent-brand">
              <span>BY</span>
              <Wordmark size="sm" className="wl-parent-wordmark" priority />
            </small>
          </span>
        </Link>
        <nav aria-label="Wonderlab">
          <Link href="/wonderlab/games">Play games</Link>
          <Link href="/wonderlab/kids">
            For kids <span>4–10</span>
          </Link>
          <Link href="/wonderlab/teens">
            For teens <span>11–16</span>
          </Link>
          <Link href="/wonderlab/parents">For grown-ups</Link>
        </nav>
        <Link
          className="wl-button wl-button-small wl-outline"
          href="/wonderlab/family"
        >
          Family space <span aria-hidden="true">↗</span>
        </Link>
      </header>
      <main id="wonderlab-main">{children}</main>
      <footer className="wl-footer">
        <Link href="/wonderlab" className="wl-logo">
          ✳ wonderlab
        </Link>
        <p>Learn to create, solve problems and think carefully with AI.</p>
        <div>
          <Link href="/wonderlab/parents">For grown-ups</Link>
          <Link href="/wonderlab/terms">Access & privacy</Link>
          <Link href="/">Back to Experrt</Link>
        </div>
        <small>
          Wonderlab by Experrt · British English · Designed for ages 4–16
        </small>
      </footer>
    </div>
  );
}
