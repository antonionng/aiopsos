import { withSiteShareImages } from "@/lib/social-image";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { agentMarketingCourses } from "@/lib/always-on-agents/marketing";
import "../agent-detail.css";
export const metadata = withSiteShareImages({
  title: "Review the authored agent courses | Experrt",
  robots: { index: false, follow: false },
});
export default function CourseReviewIndex() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <article className="agent-course-detail">
      <p className="agent-detail-eyebrow">INTERNAL COURSE DEVELOPMENT</p>
      <h1
        style={{
          fontSize: "clamp(32px,5vw,50px)",
          lineHeight: 1.15,
          marginBottom: 24,
        }}
      >
        Review the complete teaching packs
      </h1>
      <p style={{ maxWidth: 800, lineHeight: 1.8, marginBottom: 30 }}>
        Each of the 13 courses contains six modules and 36 activities, with
        visual explanations, worked examples, practice questions with feedback,
        guided labs and evidence checkpoints. Open a course to work through the
        material, download its practice files or export it into the Experrt
        course studio. This review area is available on the development site
        only.
      </p>
      <p style={{ maxWidth: 800, lineHeight: 1.8, marginBottom: 30 }}>
        The content is authored for review. Platform account tests, learner
        pilots, reviewer delivery and checkout release checks remain separate.
        Practical assessment uses six skill areas, each requiring at least 3 out
        of 4; practice progress does not award a certificate.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,280px),1fr))",
          gap: 24,
        }}
      >
        {agentMarketingCourses.map((course) => (
          <Link
            key={course.slug}
            href={"/courses/agents/review/" + course.slug}
            style={{
              border: "1px solid #e0d7eb",
              borderRadius: 20,
              overflow: "hidden",
              display: "block",
            }}
          >
            <Image
              src={course.image}
              alt="Illustration of the course's agent-assisted workflow."
              width={1536}
              height={1024}
              sizes="(max-width: 800px) 100vw, 33vw"
              style={{ width: "100%", height: 190, objectFit: "cover" }}
            />
            <div style={{ padding: 22 }}>
              <p className="agent-detail-eyebrow">{course.group}</p>
              <h2 style={{ fontSize: 22, margin: "10px 0", lineHeight: 1.3 }}>
                {course.title}
              </h2>
              <p style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>
                {course.summary}
              </p>
              <strong style={{ fontSize: 13, color: "#7044b8" }}>
                Open the 36-activity course →
              </strong>
            </div>
          </Link>
        ))}
      </div>
    </article>
  );
}
