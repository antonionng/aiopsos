import type { Metadata } from "next";
import { GuestAgentChat } from "@/components/marketing/guest-agent-chat";
import { withSiteShareImages } from "@/lib/social-image";

export const metadata: Metadata = withSiteShareImages({ title: "Create with your learning agent", robots: { index: false, follow: true } });
export default async function LearningAgentChatPage({ searchParams }: { searchParams: Promise<{ brief?: string }> }) {
  const params = await searchParams;
  return <GuestAgentChat initialBrief={typeof params.brief === "string" ? params.brief : ""} />;
}
