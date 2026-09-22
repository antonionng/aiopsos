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
          Not for sale yet. The outline is here so you can see the shape of the course. The lesson room opens when the checks and the artefact are written. Nothing on this page takes payment.
        </p>
        <p className="ex-meta">
          Listed at £{course.priceGbp} · {course.hours} hrs
        </p>
      </main>
    </>
  );
}
