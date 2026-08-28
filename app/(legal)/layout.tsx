import Link from "next/link";
import { SiteNav } from "@/components/site-nav";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      <main className="mx-auto max-w-3xl px-6 pb-16 pt-30">
        {children}
      </main>

      <footer className="border-t border-border/40 py-8">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-4 px-6">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Experrt. All rights reserved.
          </p>
          <nav className="flex gap-6">
            <Link href="/terms" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
              Terms
            </Link>
            <Link href="/privacy" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
              Privacy
            </Link>
            <Link href="/cookies" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
              Cookies
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
