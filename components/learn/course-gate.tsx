import { CourseLanding } from "@/components/learn/course-landing";
import type { SelfServeCourse } from "@/lib/self-serve/types";

export function CourseGate({
  course,
  retry,
}: {
  course: SelfServeCourse;
  retry?: boolean;
}) {
  return <CourseLanding course={course} retry={retry} />;
}
