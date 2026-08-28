import Link from "next/link";
import { SiteNav } from "@/components/site-nav";

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      <main className="mx-auto max-w-4xl px-6 pb-16 pt-30">{children}</main>

      <footer className="border-t border-border/40 py-8">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-4 px-6">
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
