import Link from "next/link";
import { coursesByTrack, SELF_SERVE_TRACKS, trackLabel } from "@/lib/self-serve/catalog";
import type { SelfServeCourse, SelfServeTrack } from "@/lib/self-serve/types";
import "./course-cards.css";

export function previewCourses(track: SelfServeTrack | "all"): SelfServeCourse[] {
  if (track === "all") {
    return SELF_SERVE_TRACKS.map((item) => coursesByTrack(item)[0]).filter(
      (course): course is SelfServeCourse => Boolean(course),
    );
  }
  return coursesByTrack(track).slice(0, 4);
}

export function SelfServeCourseCards({ courses }: { courses: SelfServeCourse[] }) {
  return (
    <ul className="ss-cards">
      {courses.map((course) => (
        <li key={course.slug}>
          <Link href={`/learn/${course.slug}`}>
            <span className="ss-cards-track">{trackLabel(course.track)}</span>
            <span className="ss-cards-title">
              <strong>{course.title}</strong>
              {course.playable ? <em>Available now</em> : null}
            </span>
            <p>{course.promise}</p>
            <span className="ss-cards-meta">
              {course.hours} hours · £{course.priceGbp}
              {course.playable ? "" : " · Opening soon"}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
