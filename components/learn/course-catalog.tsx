import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { PublicSiteFooter } from "@/components/public/site-footer";
import { SELF_SERVE_COURSES, coursesByTrack, trackLabel } from "@/lib/self-serve/catalog";
import type { SelfServeTrack } from "@/lib/self-serve/types";

const TRACKS: SelfServeTrack[] = ["ai", "technology", "robotics", "hr"];

export function CourseCatalog({ track }: { track: SelfServeTrack | null }) {
  const courses = track ? coursesByTrack(track) : SELF_SERVE_COURSES;
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="mx-auto max-w-5xl px-6 pb-16 pt-28">
        <p className="mb-3 text-xs uppercase tracking-[0.14em] text-muted-foreground">Self-serve</p>
        <h1 className="mb-4 font-display text-4xl font-bold tracking-[-0.03em] sm:text-5xl">Courses</h1>
        <p className="mb-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Buy is not connected on this preview. One course is open so you can do the work. The others are named and priced. They open when their lessons are written.
        </p>
        <div className="mb-10 flex flex-wrap gap-2">
          <TrackLink href="/learn" active={track === null}>
            All
          </TrackLink>
          {TRACKS.map((item) => (
            <TrackLink key={item} href={`/learn?track=${item}`} active={track === item}>
              {trackLabel(item)}
            </TrackLink>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {courses.map((course) => (
            <Link
              key={course.slug}
              href={`/learn/${course.slug}`}
              className="flex flex-col rounded-2xl border border-border bg-card p-6 transition-colors hover:border-foreground/30"
            >
              <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
                <span>{trackLabel(course.track)}</span>
                <span>
                  {course.hours} hrs · £{course.priceGbp}
                </span>
              </div>
              <h2 className="mb-2 text-lg font-semibold tracking-[-0.01em]">{course.title}</h2>
              <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">{course.promise}</p>
              <span className="text-sm font-medium">{course.playable ? "Start course" : "Outline"}</span>
            </Link>
          ))}
        </div>
      </main>
      <PublicSiteFooter showDisclaimer />
    </div>
  );
}

function TrackLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-4 py-1.5 text-sm ${
        active ? "border-foreground bg-foreground text-background" : "border-border"
      }`}
    >
      {children}
    </Link>
  );
}
