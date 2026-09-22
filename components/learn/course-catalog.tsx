import Link from "next/link";
import { SelfServeCourseCards } from "@/components/learn/course-cards";
import {
  SELF_SERVE_COURSES,
  SELF_SERVE_TRACKS,
  coursesByTrack,
  getSelfServeCourse,
  trackLabel,
} from "@/lib/self-serve/catalog";
import type { SelfServeTrack } from "@/lib/self-serve/types";

const PILOT_SLUG = "prompt-engineering-for-professional-work";

export function CourseCatalog({ track }: { track: SelfServeTrack | null }) {
  const pilot = getSelfServeCourse(PILOT_SLUG);
  const courses = track ? coursesByTrack(track) : SELF_SERVE_COURSES;
  const price = pilot?.priceGbp ?? 1;

  return (
    <main className="ex-catalog">
      <div className="ex-eyebrow">
        <span />
        SELF-SERVE COURSES
      </div>
      <h1 className="ex-plain-title">All courses.</h1>
      <p className="ex-lede">
        This is the full self-serve catalogue, in the same cards as the Academy. Prompt Engineering for Professional Work is £{price}, and you can start as soon as you pay. The other courses describe the work they will cover, and they are not for sale yet. Facilitated programmes stay on the Academy.
      </p>
      <nav className="ss-filters" aria-label="Tracks">
        <Link href="/learn" aria-current={track ? undefined : "page"}>
          All
        </Link>
        {SELF_SERVE_TRACKS.map((item) => (
          <Link key={item} href={`/learn?track=${item}`} aria-current={track === item ? "page" : undefined}>
            {trackLabel(item)}
          </Link>
        ))}
      </nav>
      <SelfServeCourseCards courses={courses} />
      <p className="ex-catalog-foot">
        If you want a trainer in the room, the facilitated programmes remain on the <Link href="/courses">Academy</Link>.
      </p>
    </main>
  );
}
