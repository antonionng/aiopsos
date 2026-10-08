import { notFound } from "next/navigation";
import { z } from "zod";
import { AgentCourseOrderStatus } from "@/components/courses/agent-course-order-status";
import { withSiteShareImages } from "@/lib/social-image";
export const metadata = withSiteShareImages({
  title: "Your course order | Experrt",
  robots: { index: false, follow: false },
});
export default async function CourseOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success) notFound();
  return <AgentCourseOrderStatus key={id} id={id} />;
}
