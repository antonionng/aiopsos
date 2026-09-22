import Link from "next/link";
import { SelfServeCourseCards } from "@/components/learn/course-cards";
import {
  SELF_SERVE_COURSES,
  SELF_SERVE_TRACKS,
  coursesByTrack,
  trackLabel,
} from "@/lib/self-serve/catalog";
import type { SelfServeTrack } from "@/lib/self-serve/types";

export function CourseCatalog({ track }: { track: SelfServeTrack | null }) {
  const courses = track ? coursesByTrack(track) : SELF_SERVE_COURSES;

  return (
    <main className="ex-catalog">
      <div className="ex-eyebrow">
        <span />
        SELF-PACED COURSES
      </div>
      <h1 className="ex-plain-title">Self-paced courses</h1>
      <p className="ex-lede">
        Every self-paced course teaches one professional skill in depth, using realistic workplace material, practice with immediate feedback, and a final assessment. Learners finish with a piece of work they have signed, which an employer can verify online. Courses marked Available now can be bought today, and the remaining courses open as each one is completed to the same standard.
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
        If your team would benefit from a trainer in the room, our trainer-led courses are listed on the <Link href="/courses#trainer-led">Academy</Link>.
      </p>
    </main>
  );
}
