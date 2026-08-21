import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LITERACY_DISCLAIMER } from "@/lib/constants";

export default function CoursesLayout({
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
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Insights
            </Link>
            <Link
              href="/courses"
              className="text-sm font-medium text-foreground transition-colors hover:text-brand"
            >
              Courses
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-16">{children}</main>

      <footer className="border-t border-border/40 py-8">
        <div className="mx-auto max-w-5xl space-y-4 px-6">
          <p className="max-w-3xl text-xs leading-relaxed text-muted-foreground">
            {LITERACY_DISCLAIMER}
          </p>
          <div className="flex flex-wrap items-center justify-between gap-4">
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
                href="/docs"
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                Documentation
              </Link>
              <Link
                href="/contact"
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                Contact
              </Link>
              <Link
                href="/terms"
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                Terms
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
