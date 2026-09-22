import type { Metadata } from "next";
import { CourseCatalog } from "@/components/learn/course-catalog";
import { SELF_SERVE_TRACKS } from "@/lib/self-serve/catalog";
import { withSiteShareImages } from "@/lib/social-image";
import type { SelfServeTrack } from "@/lib/self-serve/types";

export const metadata: Metadata = withSiteShareImages({
  title: "Self-serve courses",
  description:
    "Forty courses across AI, technology, robotics, and HR. One is open to take. The rest are listed and not for sale yet.",
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
  return <CourseCatalog track={active} />;
}
