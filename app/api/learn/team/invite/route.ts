import { NextResponse } from "next/server";
import { rateLimit, getRateLimitHeaders } from "@/lib/rate-limit";
import { currentLearner } from "@/lib/self-serve/access";
import { checkoutOrigin } from "@/lib/self-serve/commerce";
import { parseInvites } from "@/lib/self-serve/team-rules";
import { inviteToTeam, openTeam, placesOpen, removeSeat, sendSeatInvite } from "@/lib/self-serve/teams";

async function authorise(body: Record<string, unknown>) {
  const id = typeof body.teamId === "string" ? body.teamId : "";
  const token = typeof body.token === "string" ? body.token : null;
  const user = await currentLearner();
  return openTeam(id, { token, userId: user?.id, email: user?.email });
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const opened = await authorise(body);
  if (!opened) return NextResponse.json({ detail: "This team link is not valid." }, { status: 404 });
  const { team, seats } = opened;

  const rl = rateLimit(`learn-team-invite:${team.id}`, { limit: 30, windowMs: 60 * 60 * 1000 });
  if (!rl.success) {
    return NextResponse.json(
      { detail: "You have sent a lot of invitations in the last hour. Try again later." },
      { status: 429, headers: getRateLimitHeaders(rl) }
    );
  }
  if (!placesOpen(team)) {
    return NextResponse.json({ detail: "The places on this team have expired." }, { status: 410 });
  }

  const origin = checkoutOrigin(req);
  if (typeof body.resend === "string") {
    const seat = seats.find((row) => row.id === body.resend && !row.accepted_at);
    if (!seat) return NextResponse.json({ detail: "That invitation has already been accepted." }, { status: 400 });
    try {
      await sendSeatInvite(team, seat, origin);
    } catch (error) {
      console.error("[self-serve] team resend", error);
      return NextResponse.json({ detail: "We could not send that email. Try again." }, { status: 502 });
    }
    return NextResponse.json({ ok: true, resent: seat.email });
  }

  const { invites, rejected } = parseInvites(typeof body.text === "string" ? body.text.slice(0, 20000) : "");
  if (invites.length === 0) {
    return NextResponse.json(
      { detail: rejected.length ? `We could not read: ${rejected.slice(0, 5).join(", ")}` : "Add at least one email address." },
      { status: 400 }
    );
  }
  try {
    const result = await inviteToTeam(team, seats, invites, origin);
    return NextResponse.json({
      ok: true,
      added: result.added.map((seat) => seat.email),
      skipped: result.skipped,
      rejected,
      full: result.full,
    });
  } catch (error) {
    console.error("[self-serve] team invite", error);
    return NextResponse.json({ detail: "We could not save those invitations. Try again." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const opened = await authorise(body);
  if (!opened) return NextResponse.json({ detail: "This team link is not valid." }, { status: 404 });
  const removed = typeof body.seatId === "string" && (await removeSeat(opened.team, body.seatId));
  if (!removed) {
    return NextResponse.json({ detail: "Only invitations that have not been accepted can be withdrawn." }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
