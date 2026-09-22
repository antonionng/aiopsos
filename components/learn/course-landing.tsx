import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BuyCourseButton } from "@/components/learn/buy-course-button";
import { trackLabel } from "@/lib/self-serve/catalog";
import { courseArtefact } from "@/lib/self-serve/engine";
import { formatCourseHours, getCourseLanding } from "@/lib/self-serve/landing";
import type { SelfServeCourse } from "@/lib/self-serve/types";

function ribbonLine(value: string, label: string): string {
  if (value === "34.2%") return "UK specialist-AI wage premium in 2025.";
  if (value === "180,000") return "UK postings that asked for specialist AI skills.";
  if (value.startsWith("£")) return "Published midpoint for an AI Prompt Engineer.";
  return label;
}

export function CourseLanding({
  course,
  retry,
}: {
  course: SelfServeCourse;
  retry?: boolean;
}) {
  const landing = getCourseLanding(course);
  const artefact = courseArtefact(course);
  const artefactName = artefact
    ? `${artefact.title.charAt(0).toLowerCase()}${artefact.title.slice(1)}`
    : "the work you produce";

  return (
    <>
      <main className="ex-landing">
        <section className="ex-product">
          <div className="ex-wide ex-product-grid">
            <div className="ex-product-copy">
              <p className="ex-product-crumb">
                <Link href="/learn">All courses</Link>
                <span aria-hidden="true"> / </span>
                {trackLabel(course.track)}
              </p>
              <p className="ex-eyebrow">
                <span />
                {trackLabel(course.track).toUpperCase()} · {formatCourseHours(course.hours).toUpperCase()}
              </p>
              <h1>{course.title}</h1>
              <p className="ex-lede">{landing.outcome}</p>
              <p className="ex-product-hook">{landing.hook}</p>
              <h2>What the course covers</h2>
              <p className="ex-product-note">
                Each lesson teaches one part of the skill, works through a realistic example, and ends with a check on a new case. The course closes with an assessment and a piece of work you sign.
              </p>
              <ol className="ex-product-lessons">
                {course.modules.map((module, index) => (
                  <li key={module}>
                    <b>{String(index + 1).padStart(2, "0")}</b>
                    <span>{module}</span>
                  </li>
                ))}
              </ol>
            </div>
            <aside className="ex-product-buy">
              <figure>
                <Image
                  src="/images/learn/desk.jpg"
                  alt="A laptop and notebook on a wooden desk, the kind of work this course is built around."
                  fill
                  priority
                  sizes="(max-width: 800px) 100vw, 360px"
                />
              </figure>
              <p>
                <b>£{course.priceGbp}</b>
                <span>
                  {course.playable
                    ? "Access begins as soon as payment is confirmed, and your progress is saved to your account."
                    : "This course is in preparation, and the outline shows what it will cover."}
                </span>
              </p>
              {course.playable ? (
                <BuyCourseButton slug={course.slug} label={`Buy this course for £${course.priceGbp}`} />
              ) : (
                <p className="ex-land-soon">
                  Purchase opens when every lesson, assessment, and record has been completed to our standard.
                </p>
              )}
              {retry ? (
                <p className="ex-hint">
                  Payment has not been confirmed yet. If you were charged, open the link in the receipt email. If you were not charged, buy the course again.
                </p>
              ) : null}
              <ul>
                {landing.stats.map((stat) => (
                  <li key={stat.value}>
                    <b>{stat.value}</b> {ribbonLine(stat.value, stat.label)}
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </section>

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
                WORK YOUR TEAM CAN USE.
              </span>
            </figure>
            <div>
              <p className="ex-eyebrow">
                <span />
                WHAT CHANGES
              </p>
              <h2 id="benefits-heading">What the course changes for you and your organisation.</h2>
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

        {landing.jobs.length > 0 ? (
        <section className="ex-land-jobs" aria-labelledby="jobs-heading">
          <div className="ex-wide">
            <div className="ex-land-jobs-head">
              <div>
                <p className="ex-eyebrow">
                  <span />
                  ROLES THIS SKILL SHOWS UP IN
                </p>
                <h2 id="jobs-heading">Roles where these skills are already valued and paid for.</h2>
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
        ) : null}

        {landing.reviews.length > 0 ? (
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

        <section className="ex-land-close">
          <div className="ex-wide">
            <p className="ex-eyebrow">
              <span />
              THERE IS A NEXT CHAPTER.
            </p>
            {course.playable ? (
              <>
                <h2>
                  Start today, and finish with
                  <br />
                  <span>{artefactName} your organisation can use.</span>
                </h2>
                <p>
                  Checkout takes an email address and a card, and access begins as soon as payment is confirmed. When you finish, you sign a record that names you and {artefactName}, which anyone you choose can verify online. The record confirms what you completed and does not claim compliance with any regulation.
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
                  This course is in preparation.
                  <br />
                  <span>It opens when it meets our standard.</span>
                </h2>
                <p>
                  The outline above shows what the course will cover. It will open for purchase once every lesson, assessment, and record has been written, tested, and reviewed.
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
