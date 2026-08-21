import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function InsightsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Experrt
          </Link>
          <nav className="flex items-center gap-5">
            <Link
              href="/insights"
              className="text-sm font-medium text-foreground transition-colors hover:text-brand"
            >
              Insights
            </Link>
            <Link
              href="/courses"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Courses
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-16">{children}</main>

      <footer className="border-t border-border/40 py-8">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Experrt. All rights reserved.
          </p>
          <nav className="flex gap-6">
            <Link
              href="/insights"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Insights
            </Link>
            <Link
              href="/courses"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Courses
            </Link>
            <Link
              href="/contact"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Contact
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
