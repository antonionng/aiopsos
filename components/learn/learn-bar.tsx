import Link from "next/link";
import { Wordmark } from "@/components/wordmark";

export function LearnBar({
  homeHref = "/learn",
  homeLabel = "All courses",
  action,
}: {
  homeHref?: string;
  homeLabel?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="ex-learn-bar">
      <Link href={homeHref} aria-label={homeLabel}>
        <Wordmark size="sm" />
      </Link>
      {action}
    </header>
  );
}

export function Emphasis({ text, word }: { text: string; word: string }) {
  const at = text.lastIndexOf(word);
  if (at < 0) return text;
  return (
    <>
      {text.slice(0, at)}
      <span className="ex-word-highlight">
        {word}
        <svg viewBox="0 0 520 20" aria-hidden="true">
          <path d="M4 13Q210 -4 515 9M85 18Q300 5 480 15" />
        </svg>
      </span>
      {text.slice(at + word.length)}
    </>
  );
}
