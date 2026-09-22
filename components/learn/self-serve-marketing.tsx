"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BuyCourseButton } from "@/components/learn/buy-course-button";
import { previewCourses, SelfServeCourseCards } from "@/components/learn/course-cards";
import { getSelfServeCourse, SELF_SERVE_TRACKS, trackLabel } from "@/lib/self-serve/catalog";
import type { SelfServeTrack } from "@/lib/self-serve/types";

const OPEN_SLUG = "prompt-engineering-for-professional-work";

export function SelfServeHomePitch() {
  const course = getSelfServeCourse(OPEN_SLUG);
  const price = course?.priceGbp ?? 1;
  const [track, setTrack] = useState<SelfServeTrack | "all">("all");
  const courses = previewCourses(track);

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
              THIS AUTUMN
            </p>
            <h2 id="self-serve-home-title">Brief AI the way you would brief a colleague.</h2>
            <p>
              Prompt Engineering for Professional Work shows you how to write a brief a model can follow, check what comes back, and leave a prompt card a colleague can run. The course is £{price}, and you can start as soon as you pay.
            </p>
          </div>
          <div className="ex-autumn-buy">
            <p>
              <b>£{price}</b>
              <span>Start as soon as you pay.</span>
            </p>
            <BuyCourseButton slug={OPEN_SLUG} label={`Buy this course for £${price}`} />
          </div>
        </article>

        <div className="ss-filters" role="group" aria-label="Course tracks">
          <button type="button" className={track === "all" ? "is-on" : undefined} aria-pressed={track === "all"} onClick={() => setTrack("all")}>
            All
          </button>
          {SELF_SERVE_TRACKS.map((item) => (
            <button
              key={item}
              type="button"
              className={track === item ? "is-on" : undefined}
              aria-pressed={track === item}
              onClick={() => setTrack(item)}
            >
              {trackLabel(item)}
            </button>
          ))}
        </div>
        <SelfServeCourseCards courses={courses} />

        <div className="ex-autumn-foot">
          <Link className="ex-text-link" href={track === "all" ? "/learn" : `/learn?track=${track}`}>
            View more <ArrowRight size={16} />
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
  const showOpen = !track || track === "ai";

  return (
    <section className="academy-self" id="self-serve" aria-labelledby="self-serve-academy-title">
      <p className="academy-eyebrow">SELF-SERVE COURSES</p>
      <div className="academy-self-head">
        <h2 id="self-serve-academy-title">
          Take a course in your own time, and leave with work your organisation can <em>use.</em>
        </h2>
        <p>
          These courses sit beside the facilitated programmes. Prompt Engineering for Professional Work is £{getSelfServeCourse(OPEN_SLUG)?.priceGbp ?? 1}, and you can start as soon as you pay. Choose a subject to see four courses. The rest of the catalogue is on the course list.
        </p>
      </div>
      <nav className="ss-filters academy-self-filters" aria-label="Self-serve tracks">
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
              You work through six lessons, check each one, and sign the prompt card you produce. Checkout asks only for an email address and a card. The price is £{getSelfServeCourse(OPEN_SLUG)?.priceGbp ?? 1}.
            </p>
          </div>
          <BuyCourseButton
            slug={OPEN_SLUG}
            label={`Buy this course for £${getSelfServeCourse(OPEN_SLUG)?.priceGbp ?? 1}`}
            className="academy-button"
          />
        </article>
      ) : null}

      <SelfServeCourseCards courses={previewCourses(track ?? "all")} />
      <p className="academy-self-more">
        <Link href={track ? `/learn?track=${track}` : "/learn"}>View the full course list</Link>
      </p>
    </section>
  );
}
