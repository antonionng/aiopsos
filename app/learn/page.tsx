import { CourseCatalog } from "@/components/learn/course-catalog";
import type { SelfServeTrack } from "@/lib/self-serve/types";

const TRACKS = new Set<SelfServeTrack>(["ai", "technology", "robotics", "hr"]);

export default async function LearnIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ track?: string }>;
}) {
  const { track } = await searchParams;
  const active = track && TRACKS.has(track as SelfServeTrack) ? (track as SelfServeTrack) : null;
  return <CourseCatalog track={active} />;
}
