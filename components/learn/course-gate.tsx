import { LearnBar } from "@/components/learn/learn-bar";
import { BuyCourseButton } from "@/components/learn/buy-course-button";
import { trackLabel } from "@/lib/self-serve/catalog";
import type { SelfServeCourse } from "@/lib/self-serve/types";

export function CourseGate({
  course,
  retry,
}: {
  course: SelfServeCourse;
  retry?: boolean;
}) {
  return (
    <>
      <LearnBar />
      <main className="ex-outline ex-measure">
        <p className="ex-eyebrow">
          <span />
          {trackLabel(course.track).toUpperCase()}
        </p>
        <h1>{course.title}</h1>
        <p className="ex-lede">{course.promise}</p>
        <ol>
          {course.modules.map((module, index) => (
            <li key={module}>
              <b>0{index + 1}</b>
              <span>{module}</span>
            </li>
          ))}
        </ol>
        <p className="ex-lede">
          The course is {course.hours} hours. The price is £{course.priceGbp}, which is the
          amount charged. Checkout asks only for an email address and a card. After payment
          you open lesson one, complete each check, and sign the prompt card. The record
          does not say that you are compliant with any regulation.
        </p>
        {retry ? (
          <p className="ex-hint">
            Payment has not been confirmed yet. If you were charged, open the link in the
            receipt email. If you were not charged, buy the course again.
          </p>
        ) : null}
        <BuyCourseButton slug={course.slug} label={`Buy this course for £${course.priceGbp}`} />
      </main>
    </>
  );
}
