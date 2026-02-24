import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-4xl items-center px-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to AIOPSOS
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-16">{children}</main>

      <footer className="border-t border-border/40 py-8">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-4 px-6">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} AIOPSOS. All rights reserved.
          </p>
          <nav className="flex gap-6">
            <Link
              href="/docs"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Documentation
            </Link>
            <Link
              href="/changelog"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Changelog
            </Link>
            <Link
              href="/status"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Status
            </Link>
            <Link
              href="/terms"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Terms
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
