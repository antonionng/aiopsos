import { SiteNav } from "@/components/site-nav";
import { PublicSiteFooter } from "@/components/public/site-footer";

export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteNav />
      {/* The top padding also clears the fixed bar; the homepage hero does that for itself. */}
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 pb-14 pt-28 sm:pb-16 sm:pt-32">
        {children}
      </main>
      <PublicSiteFooter />
    </div>
  );
}
