import { District } from "@/components/wonderlab/adventure/district";
import { withSiteShareImages } from "@/lib/social-image";
import { wonderlabShare } from "@/lib/wonderlab/share";
import Image from "next/image";
import Link from "next/link";
import { requireChild, db, WonderlabError } from "@/lib/wonderlab/server";
import { bands, missionsForBand } from "@/lib/wonderlab/catalog";
import { getMissionForVersion } from "@/lib/wonderlab/versions";
import { isEntitled } from "@/lib/wonderlab/engine";
export const dynamic = "force-dynamic";
export const metadata = withSiteShareImages({
  ...wonderlabShare,
  title: "My mission map",
  robots: { index: false, follow: false },
});
export default async function Page() {
  try {
    const child = await requireChild();
    const { data: orders, error } = await db
      .from("wonderlab_orders")
      .select("*")
      .eq("child_id", child.id)
      .eq("parent_id", child.parent_id);
    if (error) throw error;
    if (child.band === "creators" || child.band === "studio") {
      return (
        <District
          owned
          preferredBand={child.band}
          nickname={child.nickname}
          availableSlugs={(orders ?? [])
            .filter((order) => isEntitled(order))
            .map((order) => order.mission_slug)}
        />
      );
    }
    const { data: progress, error: pe } = await db
      .from("wonderlab_progress")
      .select("mission_slug,completed")
      .eq("child_id", child.id);
    if (pe) throw pe;
    const sortedOrders = [...(orders ?? [])].sort(
      (a, b) => Number(isEntitled(b)) - Number(isEntitled(a)),
    );
    const owned = sortedOrders
      .filter(
        (o, i, list) =>
          list.findIndex((other) => other.mission_slug === o.mission_slug) ===
          i,
      )
      .flatMap((order) => {
        const mission = getMissionForVersion(
          order.mission_slug,
          order.content_version,
        );
        return mission ? [mission] : [];
      });
    const available = [
      ...owned,
      ...missionsForBand(child.band).filter(
        (mission) => !owned.some((m) => m.slug === mission.slug),
      ),
    ].sort(
      (a, b) =>
        Number(b.band === child.band) - Number(a.band === child.band) ||
        a.band.localeCompare(b.band) ||
        a.number - b.number,
    );
    return (
      <div className="wl-family">
        <span className="wl-eyebrow">{bands[child.band].name}</span>
        <h1>
          Hello, {child.nickname}.<br />
          What will you discover?
        </h1>
        <p>
          Your creations are private. Your grown-up can see your saved work and
          progress.
        </p>
        <Image
          src={`/images/wonderlab/${child.band}.png`}
          alt="Your illustrated mission world"
          width={1200}
          height={500}
          style={{
            width: "100%",
            height: 300,
            objectFit: "cover",
            borderRadius: 25,
            marginTop: 25,
          }}
        />
        <div className="wl-mission-grid" style={{ marginTop: 30 }}>
          {available.map((m) => {
            const order = sortedOrders.find((o) => o.mission_slug === m.slug);
            const open = isEntitled(order);
            const complete = progress?.some(
              (p) => p.mission_slug === m.slug && p.completed,
            );
            return (
              <article className="wl-box" key={m.slug}>
                <span className="wl-eyebrow">
                  {bands[m.band].name} · MISSION {m.number}{" "}
                  {complete ? "· COMPLETE" : ""}
                </span>
                <h3 style={{ marginTop: 12 }}>{m.title}</h3>
                <p className="wl-caption">{m.summary}</p>
                <div className="wl-actions">
                  {open ? (
                    <Link
                      className="wl-button"
                      href={`/wonderlab/play/${m.slug}`}
                    >
                      {complete ? "Play again" : "Open mission"} →
                    </Link>
                  ) : m.number === 2 ? (
                    <Link
                      className="wl-button wl-outline"
                      href={`/wonderlab/play/${m.slug}?demo=1`}
                    >
                      Free activity →
                    </Link>
                  ) : (
                    <span className="wl-caption">
                      This mission is not open.
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
        <div className="wl-actions">
          <Link className="wl-quiet-link" href="/wonderlab/family">
            Back to the grown-up area
          </Link>
        </div>
      </div>
    );
  } catch (e) {
    return (
      <div className="wl-lockscreen">
        <h1>Let’s open your world.</h1>
        <p>
          {e instanceof WonderlabError
            ? e.message
            : "Your map could not load. Please try again."}
        </p>
        <Link
          className="wl-button"
          style={{ marginTop: 25 }}
          href="/wonderlab/family"
        >
          Ask your grown-up to open your profile →
        </Link>
      </div>
    );
  }
}
