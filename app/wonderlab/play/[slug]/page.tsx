import { withSiteShareImages } from "@/lib/social-image";
import { wonderlabShare } from "@/lib/wonderlab/share";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMission } from "@/lib/wonderlab/catalog";
import { requireMission, db, WonderlabError } from "@/lib/wonderlab/server";
import { launchStatus } from "@/lib/wonderlab/flags";
import { Arcade } from "@/components/wonderlab/arcade";
import { getArcadeGame } from "@/lib/wonderlab/games";
import { Player } from "@/components/wonderlab/player";
export const dynamic = "force-dynamic";
export const metadata = withSiteShareImages({
  ...wonderlabShare,
  title: "Your mission",
  robots: { index: false, follow: false },
});
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ demo?: string }>;
}) {
  const slug = (await params).slug;
  const m = getMission(slug);
  const demo = (await searchParams).demo === "1";
  if (demo && (!m || m.number !== 2)) notFound();
  if (demo && m) {
    const game = getArcadeGame(slug);
    if (!game) notFound();
    return <Arcade game={game} />;
  }
  try {
    const { mission, child, order } = await requireMission(slug);
    const { data, error } = await db
      .from("wonderlab_progress")
      .select("*")
      .eq("child_id", child.id)
      .eq("mission_slug", slug)
      .maybeSingle();
    if (error) throw error;
    return (
      <Player
        mission={mission}
        demo={false}
        initial={data ?? undefined}
        aiEnabled={child.ai_enabled && launchStatus().ai}
        remaining={30 - order.generations_used}
        narrationPreferred={child.narration}
      />
    );
  } catch (e) {
    return (
      <div className="wl-lockscreen">
        <h1>Your adventure is waiting.</h1>
        <p>
          {e instanceof WonderlabError
            ? e.message
            : "The mission could not open right now. Please return to your family area and try again."}
        </p>
        <div className="wl-actions">
          <Link className="wl-button" href="/wonderlab/family">
            Open the grown-up area →
          </Link>
          <Link className="wl-button wl-outline" href="/wonderlab">
            Explore free activities
          </Link>
        </div>
      </div>
    );
  }
}
