import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CourseOutline } from "@/components/learn/course-outline";
import { LessonRoom } from "@/components/learn/lesson-room";
import { getSelfServeCourse } from "@/lib/self-serve/catalog";
import { withSiteShareImages } from "@/lib/social-image";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = getSelfServeCourse(slug);
  return withSiteShareImages({
    title: course?.title ?? "Course",
    description: course?.promise,
    robots: { index: false, follow: false },
  });
}

export default async function LearnCoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = getSelfServeCourse(slug);
  if (!course) notFound();
  if (course.playable && course.lessons) return <LessonRoom course={course} />;
  return <CourseOutline course={course} />;
}
