import Link from "next/link";
import { coursesByTrackMeta, SELF_SERVE_TRACKS, trackLabel, type SelfServeCourseMeta } from "@/lib/self-serve/catalog-meta";
import type { SelfServeTrack } from "@/lib/self-serve/types";
import "./course-cards.css";

export function previewCourses(track: SelfServeTrack | "all"): SelfServeCourseMeta[] {
  if (track === "all") {
    return SELF_SERVE_TRACKS.map((item) => coursesByTrackMeta(item)[0]).filter(
      (course): course is SelfServeCourseMeta => Boolean(course),
    );
  }
  return coursesByTrackMeta(track).slice(0, 4);
}

export function SelfServeCourseCards({ courses }: { courses: SelfServeCourseMeta[] }) {
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
            <span className="ss-cards-cert">Certificate included</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
