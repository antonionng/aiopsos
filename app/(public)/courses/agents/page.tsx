import { withSiteShareImages } from "@/lib/social-image";
import Link from "next/link";
import type { Metadata } from "next";
import { AgentCourseShowcase } from "@/components/marketing/agent-course-showcase";
import { agentCatalogueGraph, agentShareImage, AGENT_CATALOGUE_DESCRIPTION } from "@/lib/always-on-agents/seo";
import { getPublicSiteUrl } from "@/lib/site";
import { StructuredData } from "@/components/structured-data";

const base = getPublicSiteUrl();
const shareImage = agentShareImage("catalogue", base);

export const metadata: Metadata = withSiteShareImages({
  title: { absolute: "Always-On AI Agent Courses | Experrt Academy" },
  description:
    AGENT_CATALOGUE_DESCRIPTION,
  alternates: { canonical: "/courses/agents" },
  openGraph: { type: "website", title: "Always-On AI Agent Courses | Experrt Academy", description: AGENT_CATALOGUE_DESCRIPTION, url: `${base}/courses/agents`, locale: "en_GB", images: [shareImage] },
  twitter: { card: "summary_large_image", images: [shareImage.url] },
});

export default function AgentCoursesPage() {
  return (
    <>
      <StructuredData data={agentCatalogueGraph(base)} />
      {process.env.NODE_ENV !== "production" ? (
        <div
          style={{
            maxWidth: 1200,
            margin: "28px auto 0",
            padding: "18px 24px",
            background: "#f3eef9",
            borderRadius: 16,
            lineHeight: 1.7,
          }}
        >
          <strong>Course development review:</strong> All 13 teaching packs are
          now authored.{" "}
          <Link
            href="/courses/agents/review"
            style={{ color: "#7044b8", textDecoration: "underline" }}
          >
            Open the complete courses and practical activities
          </Link>
          .
        </div>
      ) : null}
      <AgentCourseShowcase catalogue />
    </>
  );
}
