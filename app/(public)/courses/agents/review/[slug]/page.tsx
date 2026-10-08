import { withSiteShareImages } from "@/lib/social-image";
import { notFound } from "next/navigation";
import { getAgentCoursePack } from "@/lib/always-on-agents/courses";
import { getAgentMarketingCourse } from "@/lib/always-on-agents/marketing";
import { AgentCoursePlayer } from "@/components/courses/agent-course-player";
export const metadata = withSiteShareImages({
  title: "Agent course development review | Experrt",
  robots: { index: false, follow: false },
});
export default async function CourseReview({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  if (process.env.NODE_ENV === "production") notFound();
  const { slug } = await params;
  const pack = getAgentCoursePack(slug);
  const course = getAgentMarketingCourse(slug);
  if (!pack || !course) notFound();
  return <AgentCoursePlayer key={slug} pack={pack} cover={course.image} />;
}
