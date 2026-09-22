import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
    title: "You leave with the work",
    body: "A reel could replace an overview. It cannot replace the artefact. The open course ends in a prompt card a colleague can run. Later courses end in a brief, a plan, or a decision you would otherwise pay a person to produce.",
  },
  {
    n: "02",
    title: "The check has to pass",
    body: "You mark what was invented, choose the brief, put the repair in order, or build the card. Continue stays closed until the work holds. There is no score, and no way to click past a miss.",
  },
  {
    n: "03",
    title: "You sign what you finished",
    body: "The record names you and the artefact. It proves the course was completed. It does not claim compliance with the EU AI Act, or with any other regulation.",
  },
] as const;

export function SelfServeHomePitch() {
  return (
    <section className="ex-section ex-self-serve" aria-labelledby="self-serve-home-title">
      <div className="ex-container ex-self-serve-grid">
        <div>
          <div className="ex-eyebrow">
            <span />
            START WITH THE WORK
          </div>
          <h2 id="self-serve-home-title">
            Forty ways in.
            <br />
            One piece of <em>work</em> out.
          </h2>
          <p>
            Self-serve courses for people who want the skill, not a tour of it. AI, technology, robotics, and HR. You read, you do the check, and you keep what you made.
          </p>
          <div className="ex-hero-actions">
            <Link className="ex-button ex-button-dark" href="/learn">
              Start a course <ArrowRight size={18} />
            </Link>
            <Link className="ex-button ex-button-plain" href="/courses#self-serve">
              See all forty <ArrowRight size={18} />
            </Link>
          </div>
        </div>
        <ol className="ex-self-benefits">
          {BENEFITS.map((benefit) => (
            <li key={benefit.n}>
              <b>{benefit.n}</b>
              <h3>{benefit.title}</h3>
              <p>{benefit.body}</p>
            </li>
          ))}
        </ol>
      </div>
      <div className="ex-container">
        <article className="ex-self-open">
          <div>
            <span className="ex-self-tag">OPEN NOW</span>
            <h3>Prompt Engineering for Professional Work</h3>
            <p>
              Instruct a model the way you would brief a colleague. Leave with a prompt card someone else can run. The other thirty-nine are in the catalogue. Their lessons open one course at a time.
            </p>
            <p className="ex-self-price">£99 when checkout is connected. This preview does not charge you.</p>
          </div>
          <Link className="ex-button ex-button-dark" href={`/learn/${OPEN_SLUG}`}>
            Start this course <ArrowRight size={18} />
          </Link>
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
      <p className="academy-eyebrow">SELF-SERVE / ALL FORTY</p>
      <div className="academy-self-head">
        <h2 id="self-serve-academy-title">
          Start on your own.
          <br />
          Keep what you <em>make.</em>
        </h2>
        <p>
          The same four tracks as the academy, taken as text and practice. Every course is listed. The lesson, the check, and the signed record open one course at a time, starting with prompt engineering. Nothing here takes payment yet.
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
            <span className="academy-self-tag">OPEN NOW</span>
            <h3>Prompt Engineering for Professional Work</h3>
            <p>Instruct a model the way you would brief a colleague. Leave with a prompt card someone else can run.</p>
          </div>
          <Link href={`/learn/${OPEN_SLUG}`} className="academy-button">
            Start this course <ArrowRight size={18} />
          </Link>
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
                  {course.hours} hrs · £{course.priceGbp} · Not for sale yet
                </em>
              </Link>
            ))}
          </div>
        );
      })}
    </section>
  );
}
