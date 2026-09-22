import type { Metadata } from "next";
import { CourseCatalog } from "@/components/learn/course-catalog";
import { SELF_SERVE_TRACKS } from "@/lib/self-serve/catalog";
import { withSiteShareImages } from "@/lib/social-image";
import type { SelfServeTrack } from "@/lib/self-serve/types";

export const metadata: Metadata = withSiteShareImages({
  title: "Self-serve courses",
  description:
    "Courses your people can take in their own time across AI, technology, robotics, and HR. Prompt Engineering for Professional Work can be bought now. The other courses are listed and are not available to purchase yet.",
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
