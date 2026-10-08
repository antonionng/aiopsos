import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Award, Check } from "lucide-react";
import { StructuredData } from "@/components/structured-data";
import {
  breadcrumbLd,
  courseFaqs,
  faqLd,
  hubForTrack,
  selfServeCourseLd,
} from "@/lib/self-serve/seo";
import { BuyCourseButton } from "@/components/learn/buy-course-button";
import { TeamBuy } from "@/components/learn/team-buy";
import { trackLabel } from "@/lib/self-serve/catalog";
import { courseArtefact } from "@/lib/self-serve/engine";
import {
  courseCurriculum,
  formatCourseHours,
  getCourseLanding,
  type CurriculumItem,
} from "@/lib/self-serve/landing";
import type { SelfServeCourse } from "@/lib/self-serve/types";
import type { PublishedReview, ReviewSummary } from "@/lib/self-serve/reviews";
import { CourseReviews } from "@/components/learn/course-reviews";
import { CertificatePreview } from "@/components/learn/certificate-art";

const KIND_LABEL: Record<CurriculumItem["kind"], string> = {
  lesson: "Lesson",
  assessment: "Course assessment",
  final: "Final work and your certificate",
};

export function CourseLanding({
  course,
  retry,
  reviews,
}: {
  course: SelfServeCourse;
  retry?: boolean;
  reviews?: { reviews: PublishedReview[]; summary: ReviewSummary };
}) {
  const landing = getCourseLanding(course);
  const artefact = courseArtefact(course);
  const artefactName = artefact
    ? `${artefact.title.charAt(0).toLowerCase()}${artefact.title.slice(1)}`
    : "the work you produce";
  const curriculum = courseCurriculum(course);
  const teaching = curriculum.filter((item) => item.kind === "lesson").length;
  const assessmentCheck = course.lessons?.find((lesson) => lesson.check.kind === "scenario")?.check;
  const assessment = assessmentCheck?.kind === "scenario" ? assessmentCheck.questions.length : 0;

  const faqs = courseFaqs(course);
  const hub = hubForTrack(course.track);

  return (
    <>
      <StructuredData data={selfServeCourseLd(course, reviews?.summary)} />
      <StructuredData data={faqLd(faqs)} />
      <StructuredData
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Self-paced courses", path: "/learn" },
          { name: hub.title, path: `/learn/topics/${hub.slug}` },
          { name: course.title, path: `/learn/${course.slug}` },
        ])}
      />
      <main className="ex-landing">
        <section className="ex-product">
          <div className="ex-wide ex-product-grid">
            <div className="ex-product-copy">
              <p className="ex-product-crumb">
                <Link href="/learn">All courses</Link>
                <span aria-hidden="true"> / </span>
                <Link href={`/learn/topics/${hub.slug}`}>{trackLabel(course.track)}</Link>
              </p>
              <p className="ex-eyebrow">
                <span />
                {trackLabel(course.track).toUpperCase()} · {formatCourseHours(course.hours).toUpperCase()} · CERTIFICATE INCLUDED
              </p>
              <h1>{course.title}</h1>
              <p className="ex-lede">{landing.outcome}</p>
              <section className="ex-product-about" aria-labelledby="about-heading">
                <h2 id="about-heading">About this course</h2>
                {landing.overview.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </section>
              {landing.takeaways.length > 0 ? (
                <section className="ex-product-takeaways" aria-labelledby="takeaways-heading">
                  <h2 id="takeaways-heading">What you will take away</h2>
                  <ul>
                    {landing.takeaways.map((item) => (
                      <li key={item}>
                        <Check size={18} aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
              {landing.audience.length > 0 ? (
                <section className="ex-product-audience" aria-labelledby="audience-heading">
                  <h2 id="audience-heading">Who this course is for</h2>
                  <ul>
                    {landing.audience.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
              ) : null}
              <h2>What you will do</h2>
              <p className="ex-product-note">
                Each lesson teaches one part of the method, works through a realistic example, and ends with a check on a case you have not seen. The course closes with an assessment and then the piece of work you sign, which earns your Experrt certificate.
              </p>
              <ul className="ex-product-facts">
                <li>
                  <b>{teaching}</b>
                  <span>{teaching === 1 ? "lesson" : "lessons"} with a worked example and a check</span>
                </li>
                {assessment ? (
                  <li>
                    <b>{assessment}</b>
                    <span>scenario questions in the course assessment</span>
                  </li>
                ) : null}
                <li>
                  <b>Certified</b>
                  <span>an Experrt certificate for {artefactName}, verifiable online</span>
                </li>
                <li>
                  <b>{formatCourseHours(course.hours)}</b>
                  <span>at your own pace, with progress saved</span>
                </li>
              </ul>
              <ol className="ex-curriculum">
                {curriculum.map((item, index) => (
                  <li key={item.id} className={`is-${item.kind}`}>
                    <b className="ex-curriculum-num">{String(index + 1).padStart(2, "0")}</b>
                    <div>
                      <p className="ex-curriculum-tag">{KIND_LABEL[item.kind]}</p>
                      <h3>{item.title}</h3>
                      {item.summary ? <p className="ex-curriculum-summary">{item.summary}</p> : null}
                      {item.covers.length > 0 ? (
                        <ul className="ex-curriculum-covers" aria-label="Topics covered">
                          {item.covers.map((topic) => (
                            <li key={topic}>{topic}</li>
                          ))}
                        </ul>
                      ) : null}
                      {item.task ? <p className="ex-curriculum-task">{item.task}</p> : null}
                    </div>
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
                    ? "Access begins as soon as payment is confirmed and lasts 12 months. Your progress is saved to your account."
                    : "This course is in preparation, and the outline shows what it will cover."}
                </span>
              </p>
              {course.playable ? (
                <>
                  <a className="ex-buy-cert" href="#certificate-heading">
                    <Award size={22} aria-hidden="true" />
                    <span>
                      <b>Certificate included</b>
                      <span>Signed, verifiable online and ready for LinkedIn</span>
                    </span>
                  </a>
                  <BuyCourseButton slug={course.slug} label={`Buy this course for £${course.priceGbp}`} />
                  <TeamBuy slug={course.slug} priceGbp={course.priceGbp} />
                </>
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
              <p className="ex-product-stats-head">Why this skill matters now</p>
              <ul aria-label="Market figures for this subject">
                {landing.stats.map((stat) => (
                  <li key={stat.value + stat.line}>
                    <b>{stat.value}</b> {stat.line}
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </section>

        <section className="ex-land-cert" aria-labelledby="certificate-heading">
          <div className="ex-wide">
            <div className="ex-land-cert-head">
              <div>
                <p className="ex-eyebrow">
                  <span />
                  CERTIFICATE INCLUDED
                </p>
                <h2 id="certificate-heading">Finish certified, with proof anyone can check.</h2>
                <p className="ex-lede">
                  When you pass every lesson and the assessment, you sign {artefactName} and Experrt issues your certificate on the spot. It carries your name, the course, the date, your signature and ours, and a reference that is yours alone.
                </p>
              </div>
              <ul className="ex-land-cert-list">
                <li>
                  <Check size={18} aria-hidden="true" />
                  <span>Signed by you and countersigned by Experrt</span>
                </li>
                <li>
                  <Check size={18} aria-hidden="true" />
                  <span>A unique reference and QR code that open your public record</span>
                </li>
                <li>
                  <Check size={18} aria-hidden="true" />
                  <span>A PDF to print, save or send to your manager</span>
                </li>
                <li>
                  <Check size={18} aria-hidden="true" />
                  <span>Added to LinkedIn in one click, under Licences &amp; certifications</span>
                </li>
                <li>
                  <Check size={18} aria-hidden="true" />
                  <span>Yours to keep after your 12 months of access end</span>
                </li>
              </ul>
            </div>
            <CertificatePreview title={course.title} />
            <p className="ex-land-cert-note">
              An Experrt certificate confirms that you completed the course and signed your work. It is not an accredited qualification and does not certify compliance with any regulation.
            </p>
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
                {artefact ? `${artefact.title.toUpperCase()}, SIGNED.` : "WORK YOUR TEAM CAN USE."}
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

        {reviews ? <CourseReviews reviews={reviews.reviews} summary={reviews.summary} /> : null}

        <section className="ex-land-faq" aria-labelledby="faq-heading">
          <div className="ex-wide">
            <p className="ex-eyebrow">
              <span />
              QUESTIONS
            </p>
            <h2 id="faq-heading">Questions about {course.title}</h2>
            <dl>
              {faqs.map((faq) => (
                <div key={faq.question}>
                  <dt>{faq.question}</dt>
                  <dd>{faq.answer}</dd>
                </div>
              ))}
            </dl>
            <p className="ex-land-faq-more">
              More {trackLabel(course.track).toLowerCase()} courses are listed on the{" "}
              <Link href={`/learn/topics/${hubForTrack(course.track).slug}`}>{hubForTrack(course.track).title.toLowerCase()}</Link> page.
              {" "}Questions about payment, access, certificates or team places are answered in the{" "}
              <Link href="/learn/faq">course FAQ</Link>.
            </p>
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
                  Start today. Finish certified,
                  <br />
                  <span>with {artefactName} your organisation can use.</span>
                </h2>
                <p>
                  Checkout takes an email address and a card, and access begins as soon as payment is confirmed and lasts 12 months. All sales are final. When you finish, you sign {artefactName} and receive your Experrt certificate, which anyone you choose can verify online. The certificate confirms what you completed and does not claim compliance with any regulation.
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
              The market figures on this page come from the public sources named here. They describe the market for this subject and are not a forecast of your own pay or results.{" "}
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
