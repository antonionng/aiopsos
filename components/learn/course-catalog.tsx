import Link from "next/link";
import { BuyCourseButton } from "@/components/learn/buy-course-button";
import { LearnBar } from "@/components/learn/learn-bar";
import {
  SELF_SERVE_COURSES,
  SELF_SERVE_TRACKS,
  coursesByTrack,
  trackLabel,
} from "@/lib/self-serve/catalog";
import type { SelfServeTrack } from "@/lib/self-serve/types";

const PILOT_SLUG = "prompt-engineering-for-professional-work";

export function CourseCatalog({ track }: { track: SelfServeTrack | null }) {
  const pilot = SELF_SERVE_COURSES.find((course) => course.slug === PILOT_SLUG);
  const tracks = track ? SELF_SERVE_TRACKS.filter((item) => item === track) : SELF_SERVE_TRACKS;
  const showPilot = pilot && (!track || track === pilot.track);

  return (
    <>
      <LearnBar homeHref="/" homeLabel="Experrt home" action={<Link href="/courses">Academy</Link>} />
      <main className="ex-catalog">
        <div className="ex-eyebrow">
          <span />
          THE NEXT CHAPTER OF LEARNING
        </div>
        <h1 className="ex-plain-title">
          Browse the courses your people can take in their own time.
        </h1>
        <p className="ex-lede">
          Prompt Engineering for Professional Work can be bought now. You will work through four lessons and sign the prompt card you produce. The other courses are listed so you can see what they will cover, and they are not available to purchase yet.
        </p>
        <nav className="ex-filters" aria-label="Tracks">
          <Link href="/learn" className={track ? undefined : "is-on"}>
            All tracks
          </Link>
          {SELF_SERVE_TRACKS.map((item) => (
            <Link
              key={item}
              href={`/learn?track=${item}`}
              className={track === item ? "is-on" : undefined}
            >
              {trackLabel(item)}
            </Link>
          ))}
        </nav>

        {showPilot && pilot ? (
          <article className="ex-open">
            <span className="ex-open-tag">OPEN</span>
            <h2>{pilot.title}</h2>
            <p className="ex-lede">{pilot.promise}</p>
            <ol className="ex-modules">
              {pilot.modules.map((module, index) => (
                <li key={module}>
                  <b>0{index + 1}</b> {module}
                </li>
              ))}
            </ol>
            <div className="ex-open-foot">
              <BuyCourseButton
                slug={pilot.slug}
                label={`Buy this course for £${pilot.priceGbp}`}
              />
              <p className="ex-note">
                Checkout asks only for an email address and a card. The price on this page is the amount charged.
              </p>
            </div>
          </article>
        ) : null}

        {tracks.map((item, trackIndex) => {
          const courses = coursesByTrack(item).filter((course) => !course.playable);
          return (
            <section key={item} className="ex-track" aria-labelledby={`track-${item}`}>
              <p className="ex-eyebrow">
                <span />
                0{track ? 1 : trackIndex + 1}
              </p>
              <h2 id={`track-${item}`}>{trackLabel(item)}</h2>
              {courses.map((course) => (
                <Link key={course.slug} href={`/learn/${course.slug}`} className="ex-row">
                  <h3>{course.title}</h3>
                  <p>{course.promise}</p>
                  <span className="ex-meta">
                    {course.hours} hours, listed at £{course.priceGbp}. This course is not available to purchase yet.
                  </span>
                </Link>
              ))}
            </section>
          );
        })}

        <p className="ex-catalog-foot">
          If you want a trainer in the room, the facilitated programmes remain on the <Link href="/courses">Academy</Link>.
        </p>
      </main>
    </>
  );
}
