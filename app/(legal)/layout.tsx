import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-3xl items-center px-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to AIOPSOS
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16">
        {children}
      </main>

      <footer className="border-t border-border/40 py-8">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-4 px-6">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} AIOPSOS. All rights reserved.
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
