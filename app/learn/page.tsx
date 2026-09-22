import { CourseCatalog } from "@/components/learn/course-catalog";
import { SELF_SERVE_TRACKS } from "@/lib/self-serve/catalog";
import type { SelfServeTrack } from "@/lib/self-serve/types";

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
