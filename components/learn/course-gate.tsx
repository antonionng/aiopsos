import { CourseLanding } from "@/components/learn/course-landing";
import type { SelfServeCourse } from "@/lib/self-serve/types";
import type { PublishedReview, ReviewSummary } from "@/lib/self-serve/reviews";

export function CourseGate({
  course,
  retry,
  reviews,
}: {
  course: SelfServeCourse;
  retry?: boolean;
  reviews?: { reviews: PublishedReview[]; summary: ReviewSummary };
}) {
  return <CourseLanding course={course} retry={retry} reviews={reviews} />;
}
