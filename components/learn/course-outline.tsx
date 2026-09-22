import Link from "next/link";
import { LearnBar } from "@/components/learn/learn-bar";
import { trackLabel } from "@/lib/self-serve/catalog";
import type { SelfServeCourse } from "@/lib/self-serve/types";

export function CourseOutline({ course }: { course: SelfServeCourse }) {
  return (
    <>
      <LearnBar action={<Link href="/learn">All courses</Link>} />
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
          This course is listed so you can see what it will cover. The lessons, the checks, and the signed record are not open yet, and the course is not available to purchase. Nothing on this page takes payment.
        </p>
        <p className="ex-meta">
          Listed at £{course.priceGbp} for a {course.hours} hour course.
        </p>
      </main>
    </>
  );
}
