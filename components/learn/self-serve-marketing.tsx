import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BuyCourseButton } from "@/components/learn/buy-course-button";
import {
  coursesByTrack,
  getSelfServeCourse,
  SELF_SERVE_TRACKS,
  trackLabel,
} from "@/lib/self-serve/catalog";
import type { SelfServeTrack } from "@/lib/self-serve/types";

const OPEN_SLUG = "prompt-engineering-for-professional-work";

const FEATURED_COURSES: { slug: string; benefit: string }[] = [
  {
    slug: OPEN_SLUG,
    benefit: "Write a brief a model can follow, then leave with a prompt card a colleague can run.",
  },
  {
    slug: "getting-value-from-the-technology-you-already-pay-for",
    benefit: "Find three jobs that belong in the software your organisation already pays for.",
  },
  {
    slug: "robotics-for-non-engineers",
    benefit: "Decide whether a robot belongs in one process before you commit to buying one.",
  },
  {
    slug: "ai-for-hr-and-people-teams",
    benefit: "Draft people work with a model, and keep a clear line around what you never paste.",
  },
];

export function SelfServeHomePitch() {
  const featured = FEATURED_COURSES.map((item) => {
    const course = getSelfServeCourse(item.slug);
    if (!course) {
      throw new Error(`Missing homepage course ${item.slug}`);
    }
    return { ...item, course };
  });

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
              Prompt Engineering for Professional Work shows you how to write a brief a model can follow, check what comes back, and leave a prompt card a colleague can run. The course is £99, and you can start as soon as you pay.
            </p>
          </div>
          <div className="ex-autumn-buy">
            <p>
              <b>£99</b>
              <span>Start as soon as you pay.</span>
            </p>
            <BuyCourseButton slug={OPEN_SLUG} label="Buy this course for £99" />
          </div>
        </article>

        <ul className="ex-autumn-list">
          {featured.map(({ course, benefit }) => (
            <li key={course.slug}>
              <Link href={`/learn/${course.slug}`}>
                <strong>
                  <small>{trackLabel(course.track)}</small>
                  {course.title}
                  {course.playable ? <span>Available now</span> : null}
                </strong>
                <p>{benefit}</p>
                <em>£{course.priceGbp}</em>
              </Link>
            </li>
          ))}
        </ul>

        <div className="ex-autumn-foot">
          <Link className="ex-text-link" href="/learn">
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
