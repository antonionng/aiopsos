import { CourseLanding } from "@/components/learn/course-landing";
import type { SelfServeCourse } from "@/lib/self-serve/types";

export function CourseOutline({ course }: { course: SelfServeCourse }) {
  return <CourseLanding course={course} />;
}
