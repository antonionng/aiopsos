import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <h1 className="mb-2 text-6xl font-bold tracking-[-0.03em]">404</h1>
      <p className="mb-6 text-muted-foreground">Page not found.</p>
      <Link
        href="/dashboard"
        className="inline-flex h-10 items-center justify-center rounded-lg bg-brand px-6 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand/90"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
