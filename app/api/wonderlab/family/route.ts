import { cancelMembership } from "@/lib/wonderlab/memberships";
import { NextResponse } from "next/server";
import {
  apiError,
  assertOrigin,
  readBody,
  requireParent,
  db,
  WonderlabError,
} from "@/lib/wonderlab/server";
import { getMissionForVersion } from "@/lib/wonderlab/versions";
import { bands } from "@/lib/wonderlab/catalog";
import { launchStatus } from "@/lib/wonderlab/flags";
import { learningInsights } from "@/lib/wonderlab/learning-insights";
export async function GET() {
  try {
    const user = await requireParent();
    const { data: children, error } = await db
      .from("wonderlab_children")
      .select("*")
      .eq("parent_id", user.id)
      .order("created_at");
    if (error) throw error;
    const { data: memberships, error: membershipError } = await db
      .from("wonderlab_memberships")
      .select(
        "id,child_id,state,cancel_at_period_end,paid_until,stripe_subscription_id",
      )
      .eq("parent_id", user.id)
      .order("created_at", { ascending: false });
    if (membershipError) throw membershipError;
    const ids = (children ?? []).map((c) => c.id);
    const [{ data: orders, error: oe }, { data: progress, error: pe }] =
      await Promise.all([
        db
          .from("wonderlab_orders")
          .select(
            "id,child_id,mission_slug,content_version,state,expires_at,generations_used",
          )
          .eq("parent_id", user.id),
        ids.length
          ? db.from("wonderlab_progress").select("*").in("child_id", ids)
          : Promise.resolve({ data: [], error: null }),
      ]);
    if (oe || pe) throw oe || pe;
    return NextResponse.json(
      {
        children,
        memberships: (memberships ?? []).map(
          ({ stripe_subscription_id, ...membership }) => ({
            ...membership,
            canCancel:
              !!stripe_subscription_id &&
              !["canceled", "incomplete_expired"].includes(membership.state),
          }),
        ),
        orders: (orders ?? []).map((order) => {
          const mission = getMissionForVersion(
            order.mission_slug,
            order.content_version,
          );
          return {
            ...order,
            lesson: mission
              ? { title: mission.title, outcome: mission.outcome }
              : null,
          };
        }),
        progress,
        insights: Object.fromEntries(
          (children ?? []).map((child) => [
            child.id,
            learningInsights(
              child.id,
              child.band,
              progress ?? [],
              orders ?? [],
            ),
          ]),
        ),
        launch: launchStatus(),
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (e) {
    return apiError(e);
  }
}
export async function POST(req: Request) {
  try {
    assertOrigin(req);
    const user = await requireParent();
    const b = await readBody(req);
    if (b.action === "create") {
      if (b.guardian !== true)
        throw new WonderlabError(
          "Confirm that you are the parent or guardian.",
        );
      if (
        typeof b.nickname !== "string" ||
        !b.nickname.trim() ||
        b.nickname.length > 30 ||
        typeof b.band !== "string" ||
        !Object.hasOwn(bands, b.band)
      )
        throw new WonderlabError("Choose a nickname and age level.");
      const { count, error: ce } = await db
        .from("wonderlab_children")
        .select("id", { count: "exact", head: true })
        .eq("parent_id", user.id);
      if (ce) throw ce;
      if ((count ?? 0) >= 8)
        throw new WonderlabError("A family can have up to eight profiles.");
      const { error } = await db.from("wonderlab_children").insert({
        parent_id: user.id,
        nickname: b.nickname.trim(),
        band: b.band,
        avatar: ["robot", "flower", "rocket", "star"].includes(String(b.avatar))
          ? b.avatar
          : "robot",
      });
      if (error) throw error;
    } else {
      const { data: child, error } = await db
        .from("wonderlab_children")
        .select("*")
        .eq("id", b.childId)
        .eq("parent_id", user.id)
        .maybeSingle();
      if (error) throw error;
      if (!child) throw new WonderlabError("Profile not found.", 404);
      if (b.action === "delete-request") {
        const { data: memberships, error: me } = await db
          .from("wonderlab_memberships")
          .select("id,state,stripe_subscription_id,stripe_session_id")
          .eq("child_id", child.id)
          .eq("parent_id", user.id)
          .in("state", [
            "pending",
            "incomplete",
            "trialing",
            "active",
            "past_due",
            "unpaid",
            "paused",
          ]);
        if (me) throw me;
        // Require any checkout to settle or expire before deletion, avoiding a payment race.
        if (memberships?.some((m) => m.state === "pending"))
          throw new WonderlabError(
            "Please contact Experrt to close the pending membership checkout before deleting this profile.",
            409,
          );
        for (const membership of memberships ?? [])
          if (membership.stripe_subscription_id)
            await cancelMembership(user.id, membership.id);
        const { error: e } = await db
          .from("wonderlab_children")
          .update({
            deletion_requested_at: new Date().toISOString(),
            ai_enabled: false,
          })
          .eq("id", child.id);
        if (e) throw e;
        const { error: se } = await db
          .from("wonderlab_sessions")
          .delete()
          .eq("child_id", child.id);
        if (se) throw se;
      } else if (b.action === "preferences") {
        if (child.deletion_requested_at)
          throw new WonderlabError("This profile is awaiting deletion.");
        if (
          b.aiEnabled === true &&
          ((!launchStatus().ai && !child.ai_enabled) ||
            !["creators", "studio"].includes(child.band))
        )
          throw new WonderlabError(
            "Guided AI is not available for this profile.",
          );
        const { error: e } = await db
          .from("wonderlab_children")
          .update({
            ai_enabled: b.aiEnabled === true,
            narration: b.narration === true,
          })
          .eq("id", child.id);
        if (e) throw e;
      } else throw new WonderlabError("Unknown family action.");
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return apiError(e);
  }
}
