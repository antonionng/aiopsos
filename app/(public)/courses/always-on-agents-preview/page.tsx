import { withSiteShareImages } from "@/lib/social-image";
import type { Metadata } from "next";
import { AgentCoursePreview } from "@/components/courses/agent-course-preview";
import "./preview.css";

export const metadata: Metadata = withSiteShareImages({
  title: "Always-On AI Agent Foundations | Experrt Course Preview",
  description:
    "Learn how to choose tasks for always-on AI agents, write instructions, review their work and handle problems through six introductory lessons and practical exercises.",
  robots: { index: false, follow: false },
});

export default function AlwaysOnAgentsPreviewPage() {
  return <AgentCoursePreview />;
}
