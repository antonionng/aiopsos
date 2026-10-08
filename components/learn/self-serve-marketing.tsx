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
  const price = course?.priceGbp ?? 99;
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
              THIS AUTUMN · CERTIFICATE INCLUDED
            </p>
            <h2 id="self-serve-home-title">
              <Link className="ex-card-link" href={`/learn/${OPEN_SLUG}`}>
                Brief AI the way you would brief a colleague.
              </Link>
            </h2>
            <p>
              Prompt Engineering for Professional Work teaches your people to give AI tools clear, complete instructions and to check every reply before it reaches a client or colleague. Everyone who finishes is Experrt certified, with a signed certificate, a QR code anyone can check, and a prompt card the whole team can reuse.
            </p>
            <span className="ex-autumn-more" aria-hidden="true">
              See what&apos;s in the course <ArrowRight size={16} />
            </span>
          </div>
          <div className="ex-autumn-buy">
            <p>
              <b>£{price}</b>
              <span>Includes your Experrt certificate. Access begins as soon as payment is confirmed and lasts 12 months.</span>
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
          <Link className="ex-text-link" href={track === "all" ? "/learn" : `/learn/topics/${track}-courses`}>
            Browse the full catalogue <ArrowRight size={16} />
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
  return `/courses${query ? `?${query}` : ""}#self-paced`;
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
    <section className="academy-self" id="self-paced" aria-labelledby="self-paced-academy-title">
      <p className="academy-eyebrow">SELF-PACED COURSES</p>
      <div className="academy-self-head">
        <h2 id="self-paced-academy-title">
          Learn online in your own time, and finish with work your organisation can <em>use.</em>
        </h2>
        <p>
          Each self-paced course teaches one professional skill in depth through worked examples, practice on realistic material, feedback on written work, and a final assessment. It ends with a piece of work the learner signs, which an employer can verify online.
        </p>
      </div>
      <nav className="ss-filters academy-self-filters" aria-label="Self-paced subjects">
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
            <span className="academy-self-tag">Available now · Certificate included</span>
            <h3>
              <Link className="ex-card-link" href={`/learn/${OPEN_SLUG}`}>
                Prompt Engineering for Professional Work
              </Link>
            </h3>
            <p>
              This course teaches professionals to brief an AI tool precisely, to recognise when a reply has invented a commitment, and to repair the instruction before anything is sent. Learners finish Experrt certified, with a signed certificate and prompt card that a manager can verify online.
            </p>
          </div>
          <BuyCourseButton
            slug={OPEN_SLUG}
            label={`Buy this course for £${getSelfServeCourse(OPEN_SLUG)?.priceGbp ?? 99}`}
            className="academy-button"
          />
        </article>
      ) : null}

      <SelfServeCourseCards courses={previewCourses(track ?? "all")} />
      <p className="academy-self-more">
        <Link href={track ? `/learn/topics/${track}-courses` : "/learn"}>Browse all self-paced courses</Link>
      </p>
    </section>
  );
}
