import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import { BuyCourseButton } from "@/components/learn/buy-course-button";
import { Emphasis, LearnBar } from "@/components/learn/learn-bar";
import { trackLabel } from "@/lib/self-serve/catalog";
import { formatCourseHours, getCourseLanding } from "@/lib/self-serve/landing";
import type { SelfServeCourse } from "@/lib/self-serve/types";

function ribbonLine(value: string, label: string): string {
  if (value === "34.2%") return "UK specialist-AI wage premium in 2025.";
  if (value === "180,000") return "UK postings that asked for specialist AI skills.";
  if (value.startsWith("£")) return "Published midpoint for an AI Prompt Engineer.";
  return label;
}

function titleEmphasis(title: string): string {
  for (const word of ["Professional", "Managers", "Teams", "Technology", "Engineers", "Leaders"]) {
    if (title.includes(word)) return word;
  }
  return title.split(" ").pop() ?? title;
}

export function CourseLanding({
  course,
  retry,
}: {
  course: SelfServeCourse;
  retry?: boolean;
}) {
  const landing = getCourseLanding(course);

  return (
    <>
      <LearnBar action={<Link href="/learn">All courses</Link>} />
      <main className="ex-landing">
        <section className="ex-land-hero">
          <div className="ex-wide ex-land-hero-grid">
            <div className="ex-land-copy">
              <p className="ex-eyebrow">
                <span />
                {trackLabel(course.track).toUpperCase()} · {formatCourseHours(course.hours).toUpperCase()} · £{course.priceGbp}
              </p>
              <h1>
                <Emphasis text={course.title} word={titleEmphasis(course.title)} />
              </h1>
              <p className="ex-land-hook">{landing.hook}</p>
              <p className="ex-lede">{landing.outcome}</p>
              <div className="ex-land-cta">
                {course.playable ? (
                  <BuyCourseButton slug={course.slug} label={`Buy this course for £${course.priceGbp}`} />
                ) : (
                  <p className="ex-land-soon">
                    This course is listed so you can see the work it will cover. The lessons are not open yet, and nothing on this page takes payment.
                  </p>
                )}
                {retry ? (
                  <p className="ex-hint">
                    Payment has not been confirmed yet. If you were charged, open the link in the receipt email. If you were not charged, buy the course again.
                  </p>
                ) : null}
              </div>
              <div className="ex-land-foot">
                <span className="ex-land-pips" aria-hidden="true">
                  <span>AI</span>
                  <span>£</span>
                  <span>↗</span>
                </span>
                <span>
                  A brief, a check, and a card you sign.
                  <br />
                  <strong>Work a colleague can run on Monday.</strong>
                </span>
              </div>
            </div>
            <figure className="ex-land-art">
              <Image
                src="/images/learn/desk.jpg"
                alt="A laptop and notebook on a wooden desk, the kind of work this course is built around."
                fill
                priority
                sizes="(max-width: 800px) 100vw, 46vw"
                className="ex-land-art-image"
              />
              <span className="ex-land-art-label">
                MAKE SPACE
                <br />
                FOR THE BRIEF.
              </span>
              <div className="ex-land-float ex-land-float-top">
                <span className="ex-land-float-mark" aria-hidden="true">
                  ✓
                </span>
                <div>
                  <strong>A card a colleague can run.</strong>
                  <span>That is the artefact you leave with.</span>
                </div>
              </div>
              <div className="ex-land-float ex-land-float-bottom">
                <span className="ex-land-float-glyph" aria-hidden="true">
                  ↗
                </span>
                <div>
                  <span>AFTER YOU PAY</span>
                  <strong>Lesson one opens.</strong>
                </div>
              </div>
              <figcaption>A desk, not a lecture hall.</figcaption>
            </figure>
          </div>
        </section>

        <div className="ex-land-ribbon">
          <div className="ex-wide">
            {landing.stats.map((stat, index) => (
              <Fragment key={stat.value}>
                {index > 0 ? <Plus aria-hidden="true" /> : null}
                <span>
                  <b>{stat.value}</b>
                  <em>{ribbonLine(stat.value, stat.label)}</em>
                </span>
              </Fragment>
            ))}
          </div>
        </div>

        <section className="ex-land-band" aria-labelledby="benefits-heading">
          <div className="ex-wide ex-land-split">
            <figure className="ex-land-photo">
              <Image
                src="/images/learn/review.jpg"
                alt="Colleagues around a table, working through a problem together."
                fill
                sizes="(max-width: 800px) 100vw, 50vw"
              />
              <span className="ex-land-sticker">
                GOOD WORK.
                <br />
                A BRIEF YOU CAN HAND OVER.
              </span>
            </figure>
            <div>
              <p className="ex-eyebrow">
                <span />
                WHAT CHANGES
              </p>
              <h2 id="benefits-heading">Salary, the next role, and work you can use on Monday.</h2>
              <ol className="ex-land-benefits">
                {landing.benefits.map((benefit, index) => (
                  <li key={benefit.title}>
                    <b>{String(index + 1).padStart(2, "0")}</b>
                    <div>
                      <h3>{benefit.title}</h3>
                      <p>{benefit.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="ex-land-jobs" aria-labelledby="jobs-heading">
          <div className="ex-wide">
            <div className="ex-land-jobs-head">
              <div>
                <p className="ex-eyebrow">
                  <span />
                  ROLES THIS SKILL SHOWS UP IN
                </p>
                <h2 id="jobs-heading">Jobs that already pay for people who can brief a model.</h2>
              </div>
              <figure className="ex-land-photo ex-land-photo-side">
                <Image
                  src="/images/learn/team.jpg"
                  alt="A team talking in a bright office, the kind of role this skill shows up in."
                  fill
                  sizes="(max-width: 800px) 100vw, 38vw"
                />
              </figure>
            </div>
            <p className="ex-lede">
              These figures are published salary bands and wage premiums, not a guarantee that finishing this course moves you to the top of the range. They are here so you can see what the market is already paying for the work you will practise.
            </p>
            <ul className="ex-land-job-grid">
              {landing.jobs.map((job) => (
                <li key={job.title}>
                  <h3>{job.title}</h3>
                  <p className="ex-land-pay">{job.pay}</p>
                  <p>{job.why}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {course.playable ? (
          <section className="ex-land-reviews" aria-labelledby="reviews-heading">
            <div className="ex-wide">
              <p className="ex-eyebrow">
                <span />
                FROM PEOPLE WHO TOOK THE COURSE
              </p>
              <h2 id="reviews-heading">They came for the skill. They left with work their team still uses.</h2>
              <ul className="ex-land-review-grid">
                {landing.reviews.map((review) => (
                  <li key={review.name}>
                    <span className="ex-land-quote" aria-hidden="true">
                      “
                    </span>
                    <p>{review.quote}</p>
                    <strong>{review.name}</strong>
                    <span>
                      {review.role}, {review.city}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}

        <section className="ex-land-modules" aria-labelledby="modules-heading">
          <div className="ex-wide">
            <p className="ex-eyebrow">
              <span />
              THE WORK
            </p>
            <h2 id="modules-heading">Four lessons. You cannot continue until the check is right.</h2>
            <ol className="ex-land-module-grid">
              {course.modules.map((module, index) => (
                <li key={module}>
                  <b>{String(index + 1).padStart(2, "0")}</b>
                  <span>{module}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="ex-land-close">
          <div className="ex-wide">
            <p className="ex-eyebrow">
              <span />
              THERE IS A NEXT CHAPTER.
            </p>
            {course.playable ? (
              <>
                <h2>
                  Start with a card payment of £{course.priceGbp}.
                  <br />
                  <span>Leave with a brief you can hand over.</span>
                </h2>
                <p>
                  Checkout asks only for an email address and a card. You then open lesson one. The signed record names you and the prompt card. It does not say that you are compliant with any regulation.
                </p>
                <BuyCourseButton
                  slug={course.slug}
                  label={`Buy this course for £${course.priceGbp}`}
                  className="ex-button ex-button-citrus"
                />
              </>
            ) : (
              <>
                <h2>
                  Listed at £{course.priceGbp}.
                  <br />
                  <span>The lessons are not open yet.</span>
                </h2>
                <p>
                  This page shows the work a {formatCourseHours(course.hours)} course will cover. Nothing here takes payment.
                </p>
              </>
            )}
            <span className="ex-land-close-mark" aria-hidden="true">
              ↗
            </span>
          </div>
        </section>

        <footer className="ex-land-sources">
          <div className="ex-wide">
            <p>
              Salary and hiring figures are taken from named public sources and are not a forecast of your pay after this course.{" "}
              {landing.sources.map((source, index) => (
                <span key={source.href}>
                  <a href={source.href} rel="noreferrer">
                    {source.label}
                  </a>
                  {index < landing.sources.length - 1 ? ". " : "."}
                </span>
              ))}
            </p>
            <Link href="/learn">
              All courses <ArrowUpRight size={16} />
            </Link>
          </div>
        </footer>
      </main>
    </>
  );
}
