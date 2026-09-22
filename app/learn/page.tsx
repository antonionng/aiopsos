import type { Metadata } from "next";
import { CourseCatalog } from "@/components/learn/course-catalog";
import { LearnMarket } from "@/components/learn/learn-shell";
import { SELF_SERVE_TRACKS } from "@/lib/self-serve/catalog";
import { withSiteShareImages } from "@/lib/social-image";
import type { SelfServeTrack } from "@/lib/self-serve/types";

export const metadata: Metadata = withSiteShareImages({
  title: "Self-paced courses",
  description:
    "Self-paced online courses in AI, technology, robotics, and HR transformation. Each course teaches one professional skill through realistic practice and a final assessment, and ends with signed work an employer can verify.",
  robots: { index: false, follow: false },
});

export default async function LearnIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ track?: string }>;
}) {
  const { track } = await searchParams;
  const active = SELF_SERVE_TRACKS.includes(track as SelfServeTrack)
    ? (track as SelfServeTrack)
    : null;
  return (
    <LearnMarket>
      <CourseCatalog track={active} />
    </LearnMarket>
  );
}
