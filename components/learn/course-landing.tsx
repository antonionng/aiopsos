import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BuyCourseButton } from "@/components/learn/buy-course-button";
import { Emphasis, LearnBar } from "@/components/learn/learn-bar";
import { trackLabel } from "@/lib/self-serve/catalog";
import { formatCourseHours, getCourseLanding } from "@/lib/self-serve/landing";
import type { SelfServeCourse } from "@/lib/self-serve/types";

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
            <div>
            <p className="ex-eyebrow">
              <span />
              {trackLabel(course.track).toUpperCase()} · {formatCourseHours(course.hours)} · £{course.priceGbp}
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
            <dl className="ex-land-stats">
              {landing.stats.map((stat) => (
                <div key={stat.value}>
                  <dt>{stat.value}</dt>
                  <dd>
                    {stat.label} <cite>{stat.source}</cite>
                  </dd>
                </div>
              ))}
            </dl>
            </div>
            <figure className="ex-land-photo">
              <Image
                src="/images/learn/desk.jpg"
                alt="A laptop and notebook on a wooden desk, the kind of work this course is built around."
                fill
                priority
                sizes="(max-width: 800px) 100vw, 46vw"
              />
              <figcaption>The work is a brief a colleague can run.</figcaption>
            </figure>
          </div>
        </section>

        <section className="ex-land-band" aria-labelledby="benefits-heading">
          <div className="ex-wide">
            <p className="ex-eyebrow">
              <span />
              WHAT CHANGES
            </p>
            <div className="ex-land-split">
              <figure className="ex-land-photo ex-land-photo-wide">
                <Image
                  src="/images/learn/review.jpg"
                  alt="Colleagues around a table, working through a problem together."
                  fill
                  sizes="(max-width: 800px) 100vw, 50vw"
                />
              </figure>
              <div>
            <h2 id="benefits-heading">Salary, the next role, and work you can use on Monday.</h2>
            <ol className="ex-land-benefits">
              {landing.benefits.map((benefit, index) => (
                <li key={benefit.title}>
                  <b>{String(index + 1).padStart(2, "0")}</b>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.body}</p>
                </li>
              ))}
            </ol>
              </div>
            </div>
          </div>
        </section>

        <section className="ex-land-jobs" aria-labelledby="jobs-heading">
          <div className="ex-wide">
            <p className="ex-eyebrow">
              <span />
              ROLES THIS SKILL SHOWS UP IN
            </p>
            <figure className="ex-land-photo ex-land-photo-banner">
              <Image
                src="/images/learn/team.jpg"
                alt="A team talking in a bright office, the kind of role this skill shows up in."
                fill
                sizes="100vw"
              />
            </figure>
            <h2 id="jobs-heading">Jobs that already pay for people who can brief a model.</h2>
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
                    <p>"{review.quote}"</p>
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
            {course.playable ? (
              <div className="ex-land-buyagain">
                <div>
                  <h3>Start with a card payment of £{course.priceGbp}.</h3>
                  <p>
                    Checkout asks only for an email address and a card. You then open lesson one. The signed record names you and the prompt card. It does not say that you are compliant with any regulation.
                  </p>
                </div>
                <BuyCourseButton slug={course.slug} label={`Buy this course for £${course.priceGbp}`} />
              </div>
            ) : (
              <p className="ex-lede">
                Listed at £{course.priceGbp} for a {formatCourseHours(course.hours)} course. The lessons, the checks, and the signed record are not open yet.
              </p>
            )}
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
              All courses <ArrowRight size={16} />
            </Link>
          </div>
        </footer>
      </main>
    </>
  );
}
