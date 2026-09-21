import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteNav } from "@/components/site-nav";
import { LessonRoom } from "@/components/learn/lesson-room";
import { getSelfServeCourse, trackLabel } from "@/lib/self-serve/catalog";

export default async function LearnCoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = getSelfServeCourse(slug);
  if (!course) notFound();

  if (course.playable && course.lessons) {
    return <LessonRoom course={course} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="mx-auto max-w-2xl px-6 pb-16 pt-28">
        <p className="mb-3 text-xs uppercase tracking-[0.14em] text-muted-foreground">
          {trackLabel(course.track)} · {course.hours} hrs · £{course.priceGbp}
        </p>
        <h1 className="mb-4 font-display text-4xl font-bold tracking-[-0.03em]">{course.title}</h1>
        <p className="mb-8 text-lg leading-relaxed text-muted-foreground">{course.promise}</p>
        <ol className="mb-8 space-y-2 text-sm">
          {course.modules.map((module) => (
            <li key={module}>{module}</li>
          ))}
        </ol>
        <p className="text-sm leading-relaxed text-muted-foreground">
          This course is specified and priced. The lesson room opens when the checks and the artefact are written. It is not for sale yet.
        </p>
        <Link href="/learn" className="mt-6 inline-block text-sm font-medium">
          All courses
        </Link>
      </main>
    </div>
  );
}
