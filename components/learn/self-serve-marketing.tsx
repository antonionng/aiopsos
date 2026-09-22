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

const BENEFITS = [
  {
    n: "01",
    body: "Each course is designed so that a professional leaves with an artefact they would otherwise pay a person to produce, such as a prompt card a colleague can run, or a brief, a plan, or a decision for a real piece of work.",
  },
  {
    n: "02",
    body: "A learner cannot continue until the check is right. They mark a claim the model invented, choose the brief a colleague could run, put a repair in the correct order, or build the artefact itself.",
  },
  {
    n: "03",
    body: "When every check has passed, the learner signs their name. The record confirms that they completed the course and names the artefact they signed. It does not certify compliance with the EU AI Act or any other regulation.",
  },
] as const;

export function SelfServeHomePitch() {
  return (
    <section className="ex-section ex-self-serve" aria-labelledby="self-serve-home-title">
      <div className="ex-container ex-self-serve-grid">
        <div>
          <div className="ex-eyebrow">
            <span />
            SELF-SERVE COURSES
          </div>
          <h2 id="self-serve-home-title">
            Build practical <em>capability</em> your people can apply in their role, and leave with work the organisation can use.
          </h2>
          <p>
            These courses cover AI, technology, robotics, and HR. Each one is taught as reading and a check, so a learner has to do the work before they can continue. Prompt Engineering for Professional Work is the course you can take now. The other thirty-nine are listed in the catalogue, and their lessons will open one course at a time.
          </p>
          <div className="ex-hero-actions">
            <Link className="ex-button ex-button-dark" href={`/learn/${OPEN_SLUG}`}>
              Buy a course <ArrowRight size={18} />
            </Link>
            <Link className="ex-button ex-button-plain" href="/courses#self-serve">
              View the catalogue <ArrowRight size={18} />
            </Link>
          </div>
          <p className="ex-self-where">
            Buy a course opens checkout for Prompt Engineering for Professional Work, then the first lesson.
          </p>
        </div>
        <ol className="ex-self-benefits">
          {BENEFITS.map((benefit) => (
            <li key={benefit.n}>
              <b>{benefit.n}</b>
              <p>{benefit.body}</p>
            </li>
          ))}
        </ol>
      </div>
      <div className="ex-container">
        <article className="ex-self-open">
          <div>
            <span className="ex-self-tag">Available to buy</span>
            <h3>Prompt Engineering for Professional Work</h3>
            <p>
              You will learn how to brief a model with the same care you would brief a colleague, and you will leave with a prompt card someone else on your team can run. The course costs £99. Checkout asks only for an email address and a card.
            </p>
          </div>
          <BuyCourseButton slug={OPEN_SLUG} label="Buy this course for £99" />
        </article>
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
