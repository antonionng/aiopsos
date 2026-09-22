import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BuyCourseButton } from "@/components/learn/buy-course-button";
import {
  coursesByTrack,
  SELF_SERVE_TRACKS,
  trackLabel,
} from "@/lib/self-serve/catalog";
import type { SelfServeTrack } from "@/lib/self-serve/types";

const OPEN_SLUG = "prompt-engineering-for-professional-work";

export function SelfServeHomePitch() {
  return (
    <section className="ex-autumn" aria-labelledby="self-serve-home-title">
      <div className="ex-container">
        <article className="ex-autumn-offer">
          <div className="ex-autumn-leaves" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <div>
            <p className="ex-eyebrow">
              <span />
              AUTUMN START
            </p>
            <h2 id="self-serve-home-title">One course is open. The whole path is listed.</h2>
            <p>
              Prompt Engineering for Professional Work is the course you can buy this autumn for £99. You brief a model the way you would brief a colleague, and you leave with a prompt card someone else can run. Every other course is below, with its price. Those lessons are not open yet.
            </p>
          </div>
          <div className="ex-autumn-buy">
            <p>
              <b>£99</b>
              <span>Open now. This is the amount charged.</span>
            </p>
            <BuyCourseButton slug={OPEN_SLUG} label="Buy this course for £99" />
          </div>
        </article>

        <div className="ex-autumn-path">
          {SELF_SERVE_TRACKS.map((track) => (
            <section key={track} aria-labelledby={`home-track-${track}`}>
              <h3 id={`home-track-${track}`}>{trackLabel(track)}</h3>
              <ul>
                {coursesByTrack(track).map((course) => (
                  <li key={course.slug}>
                    <Link href={`/learn/${course.slug}`}>
                      <strong>{course.title}</strong>
                      <em>£{course.priceGbp}</em>
                      {course.playable ? <span>Open</span> : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="ex-autumn-foot">
          <p>All forty courses live on one page, with the open course at the top.</p>
          <Link className="ex-button ex-button-dark" href="/learn">
            Explore courses <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function catalogueHref(
  self: SelfServeTrack | null,
  level: string | null,
  category: string | null
) {
  const params = new URLSearchParams();
  if (level) params.set("level", level);
  if (category) params.set("category", category);
  if (self) params.set("self", self);
  const query = params.toString();
  return `/courses${query ? `?${query}` : ""}#self-serve`;
}

export function SelfServeAcademyCatalogue({
  track,
  level,
  category,
}: {
  track: SelfServeTrack | null;
  level: string | null;
  category: string | null;
}) {
  const tracks = track ? SELF_SERVE_TRACKS.filter((item) => item === track) : SELF_SERVE_TRACKS;
  const showOpen = !track || track === "ai";

  return (
    <section className="academy-self" id="self-serve" aria-labelledby="self-serve-academy-title">
      <p className="academy-eyebrow">SELF-SERVE COURSES</p>
      <div className="academy-self-head">
        <h2 id="self-serve-academy-title">
          Take a course in your own time, and leave with work your organisation can <em>use.</em>
        </h2>
        <p>
          These courses sit alongside the facilitated programmes. All forty are listed across AI, technology, robotics, and HR. Prompt Engineering for Professional Work is the one you can buy now, including the checks and the signed record. The others describe what the course will cover, and they are not available to purchase yet.
        </p>
      </div>
      <nav className="academy-self-filters" aria-label="Self-serve tracks">
        <Link href={catalogueHref(null, level, category)} aria-current={track ? undefined : "page"}>
          All tracks
        </Link>
        {SELF_SERVE_TRACKS.map((item) => (
          <Link
            key={item}
            href={catalogueHref(item, level, category)}
            aria-current={track === item ? "page" : undefined}
          >
            {trackLabel(item)}
          </Link>
        ))}
      </nav>

      {showOpen ? (
        <article className="academy-self-open">
          <div>
            <span className="academy-self-tag">Available to buy</span>
            <h3>Prompt Engineering for Professional Work</h3>
            <p>
              Buy the course to work through the four lessons. You will brief a model the way you would brief a colleague, and you will sign the prompt card you produce. The course costs £99. Checkout asks only for an email address and a card.
            </p>
          </div>
          <BuyCourseButton
            slug={OPEN_SLUG}
            label="Buy this course for £99"
            className="academy-button"
          />
        </article>
      ) : null}

      {tracks.map((item) => {
        const courses = coursesByTrack(item).filter((course) => !course.playable);
        return (
          <div key={item} className="academy-self-track">
            <h3>{trackLabel(item)}</h3>
            {courses.map((course) => (
              <Link key={course.slug} href={`/learn/${course.slug}`} className="academy-self-row">
                <strong>{course.title}</strong>
                <span>{course.promise}</span>
                <em>
                  {course.hours} hours, listed at £{course.priceGbp}. This course is not available to purchase yet.
                </em>
              </Link>
            ))}
          </div>
        );
      })}
    </section>
  );
}
