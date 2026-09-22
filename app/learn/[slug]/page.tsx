import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { CourseGate } from "@/components/learn/course-gate";
import { CourseOutline } from "@/components/learn/course-outline";
import { LearnMarket, LearnPlayer } from "@/components/learn/learn-shell";
import { LessonRoom } from "@/components/learn/lesson-room";
import { ACCESS_COOKIE } from "@/lib/self-serve/commerce";
import { getSelfServeCourse } from "@/lib/self-serve/catalog";
import { findPaidPurchase, loadProgress } from "@/lib/self-serve/records";
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
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ session_id?: string; access?: string; pay?: string }>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const course = getSelfServeCourse(slug);
  if (!course) notFound();

  if (query.session_id || query.access) {
    const claim = new URLSearchParams({ slug });
    if (query.session_id) claim.set("session_id", query.session_id);
    if (query.access) claim.set("access", query.access);
    redirect(`/api/learn/claim?${claim.toString()}`);
  }

  if (course.playable && course.lessons) {
    const token = (await cookies()).get(ACCESS_COOKIE)?.value ?? "";
    try {
      const purchase = await findPaidPurchase(token, course.slug);
      if (!purchase) {
        return (
          <LearnMarket>
            <CourseGate course={course} retry={query.pay === "retry"} />
          </LearnMarket>
        );
      }
      return (
        <LearnPlayer>
          <LessonRoom
            course={course}
            persist
            initialProgress={await loadProgress(purchase.id)}
          />
        </LearnPlayer>
      );
    } catch (error) {
      console.error("[self-serve] access", error);
      return (
        <LearnMarket>
          <CourseGate course={course} retry={query.pay === "retry"} />
        </LearnMarket>
      );
    }
  }
  return (
    <LearnMarket>
      <CourseOutline course={course} />
    </LearnMarket>
  );
}
