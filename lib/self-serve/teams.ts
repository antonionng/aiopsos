import type Stripe from "stripe";
import { sendTeamInvite, sendTeamPurchase } from "@/lib/email";
import { getSelfServeCourse } from "@/lib/self-serve/catalog";
import { newAccessToken } from "@/lib/self-serve/commerce";
import { accessEndsAt, hasActiveAccess } from "@/lib/self-serve/entitlement";
import { formatCourseHours } from "@/lib/self-serve/landing";
import { isTeamCheckout, SEAT_SESSION_PREFIX, type TeamInvite } from "@/lib/self-serve/team-rules";
import { getPublicSiteUrl } from "@/lib/site";
import { supabaseAdmin } from "@/lib/supabase/admin";

export type TeamRow = {
  id: string;
  course_slug: string;
  seats: number;
  unit_amount: number;
  amount: number;
  currency: string;
  buyer_email: string | null;
  buyer_name: string | null;
  user_id: string | null;
  stripe_session_id: string;
  status: "pending" | "paid" | "failed" | "refunded";
  manage_token: string | null;
  paid_at: string | null;
  receipt_sent_at: string | null;
};

export type SeatRow = {
  id: string;
  team_id: string;
  email: string;
  name: string | null;
  invite_token: string;
  invited_at: string;
  accepted_at: string | null;
  purchase_id: string | null;
};

const TEAM_COLUMNS =
  "id, course_slug, seats, unit_amount, amount, currency, buyer_email, buyer_name, user_id, stripe_session_id, status, manage_token, paid_at, receipt_sent_at";
const SEAT_COLUMNS = "id, team_id, email, name, invite_token, invited_at, accepted_at, purchase_id";

function base(origin?: string) {
  return (origin ?? getPublicSiteUrl()).replace(/\/$/, "");
}

/** An email as an exact, case-insensitive PostgREST ilike pattern. */
export function emailPattern(email: string) {
  return email.replace(/[,()]/g, "").replace(/[\\%_]/g, (c) => `\\${c}`);
}

export function manageUrl(team: Pick<TeamRow, "id" | "manage_token">, origin?: string) {
  return `${base(origin)}/learn/team/${team.id}?t=${team.manage_token}`;
}

export async function insertPendingTeam(input: {
  courseSlug: string;
  seats: number;
  unitAmount: number;
  stripeSessionId: string;
  userId?: string | null;
}) {
  const { error } = await supabaseAdmin.from("self_serve_teams").insert({
    course_slug: input.courseSlug,
    seats: input.seats,
    unit_amount: input.unitAmount,
    amount: input.unitAmount * input.seats,
    stripe_session_id: input.stripeSessionId,
    user_id: input.userId ?? null,
    status: "pending",
  });
  if (error) throw new Error(error.message);
}

export async function fulfillTeamSession(
  session: Stripe.Checkout.Session,
  options: { origin?: string } = {}
): Promise<TeamRow | null> {
  if (!isTeamCheckout(session.metadata)) return null;
  if (session.payment_status && session.payment_status !== "paid") return null;
  const course = getSelfServeCourse(session.metadata?.course_slug ?? "");
  const seats = Number(session.metadata?.seats);
  if (!course || !Number.isInteger(seats)) return null;

  const { data: existing } = await supabaseAdmin
    .from("self_serve_teams")
    .select(TEAM_COLUMNS)
    .eq("stripe_session_id", session.id)
    .maybeSingle();
  const prior = existing as TeamRow | null;
  const unit = prior?.unit_amount ?? (Number(session.metadata?.unit_amount) || course.priceGbp * 100);
  const paymentIntent =
    typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id ?? null;

  const { data, error } = await supabaseAdmin
    .from("self_serve_teams")
    .upsert(
      {
        ...(prior?.id ? { id: prior.id } : {}),
        course_slug: course.slug,
        seats,
        unit_amount: unit,
        amount: session.amount_total ?? unit * seats,
        currency: (session.currency ?? "gbp").toUpperCase(),
        buyer_email: session.customer_details?.email ?? session.customer_email ?? null,
        buyer_name: session.customer_details?.name ?? null,
        user_id: prior?.user_id ?? (session.metadata?.user_id || null),
        stripe_session_id: session.id,
        stripe_payment_intent_id: paymentIntent,
        status: "paid",
        manage_token: prior?.manage_token ?? newAccessToken(),
        paid_at: prior?.paid_at ?? new Date().toISOString(),
      },
      { onConflict: "stripe_session_id" }
    )
    .select(TEAM_COLUMNS)
    .single();
  if (error || !data) throw new Error(error?.message ?? "Could not record the team purchase.");
  const team = data as TeamRow;

  if (!team.receipt_sent_at && team.buyer_email) {
    try {
      const sent = await sendTeamPurchase({
        email: team.buyer_email,
        name: team.buyer_name,
        courseTitle: course.title,
        seats: team.seats,
        amountGbp: team.amount / 100,
        paidAt: team.paid_at,
        placesExpire: accessEndsAt(team.paid_at),
        manageUrl: manageUrl(team, options.origin),
        base: base(options.origin),
        stripeSessionId: team.stripe_session_id,
      });
      if (sent) {
        await supabaseAdmin
          .from("self_serve_teams")
          .update({ receipt_sent_at: new Date().toISOString() })
          .eq("id", team.id)
          .is("receipt_sent_at", null);
      }
    } catch (mailError) {
      console.error("[self-serve] team receipt", mailError);
    }
  }
  return team;
}

export async function findTeamBySession(sessionId: string): Promise<TeamRow | null> {
  const { data } = await supabaseAdmin
    .from("self_serve_teams")
    .select(TEAM_COLUMNS)
    .eq("stripe_session_id", sessionId)
    .maybeSingle();
  return (data as TeamRow | null) ?? null;
}

/** The manage token opens the team without a sign-in; so does signing in as the buyer. */
export async function openTeam(
  id: string,
  access: { token?: string | null; userId?: string | null; email?: string | null }
): Promise<{ team: TeamRow; seats: SeatRow[] } | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const { data } = await supabaseAdmin
    .from("self_serve_teams")
    .select(TEAM_COLUMNS)
    .eq("id", id)
    .eq("status", "paid")
    .maybeSingle();
  const team = data as TeamRow | null;
  if (!team) return null;
  const byToken = Boolean(access.token && team.manage_token && access.token === team.manage_token);
  const byUser =
    Boolean(access.userId && team.user_id === access.userId) ||
    Boolean(access.email && team.buyer_email && access.email.toLowerCase() === team.buyer_email.toLowerCase());
  if (!byToken && !byUser) return null;
  const { data: seats } = await supabaseAdmin
    .from("self_serve_team_seats")
    .select(SEAT_COLUMNS)
    .eq("team_id", team.id)
    .order("invited_at", { ascending: true });
  return { team, seats: (seats ?? []) as SeatRow[] };
}

export async function teamsForBuyer(userId: string, email: string | null | undefined) {
  const filters = [`user_id.eq.${userId}`];
  if (email) filters.push(`buyer_email.ilike.${emailPattern(email)}`);
  const { data } = await supabaseAdmin
    .from("self_serve_teams")
    .select(`${TEAM_COLUMNS}, self_serve_team_seats(accepted_at)`)
    .eq("status", "paid")
    .or(filters.join(","))
    .order("paid_at", { ascending: false });
  return ((data ?? []) as (TeamRow & { self_serve_team_seats: { accepted_at: string | null }[] })[]).map(
    (row) => ({
      team: row as TeamRow,
      invited: row.self_serve_team_seats?.length ?? 0,
      joined: row.self_serve_team_seats?.filter((seat) => seat.accepted_at).length ?? 0,
    })
  );
}

export function placesOpen(team: TeamRow, now = new Date()) {
  return hasActiveAccess(team.paid_at, now);
}

export async function inviteToTeam(
  team: TeamRow,
  current: SeatRow[],
  invites: TeamInvite[],
  origin?: string
): Promise<{ added: SeatRow[]; skipped: string[]; full: boolean }> {
  const course = getSelfServeCourse(team.course_slug);
  if (!course) return { added: [], skipped: [], full: false };
  const known = new Set(current.map((seat) => seat.email.toLowerCase()));
  const fresh = invites.filter((invite) => !known.has(invite.email));
  const skipped = invites.filter((invite) => known.has(invite.email)).map((invite) => invite.email);
  const room = Math.max(0, team.seats - current.length);
  const taking = fresh.slice(0, room);
  if (taking.length === 0) return { added: [], skipped, full: fresh.length > 0 };

  const { data, error } = await supabaseAdmin
    .from("self_serve_team_seats")
    .insert(
      taking.map((invite) => ({
        team_id: team.id,
        email: invite.email,
        name: invite.name,
        invite_token: newAccessToken(),
      }))
    )
    .select(SEAT_COLUMNS);
  if (error) throw new Error(error.message);
  const added = (data ?? []) as SeatRow[];

  for (const seat of added) {
    await sendSeatInvite(team, seat, origin).catch((mailError) =>
      console.error("[self-serve] team invite mail", mailError)
    );
  }
  return { added, skipped, full: fresh.length > taking.length };
}

export async function sendSeatInvite(team: TeamRow, seat: SeatRow, origin?: string) {
  const course = getSelfServeCourse(team.course_slug);
  if (!course) return;
  await sendTeamInvite({
    email: seat.email,
    inviteeName: seat.name,
    buyerName: team.buyer_name,
    replyTo: team.buyer_email,
    courseTitle: course.title,
    promise: course.promise,
    hours: formatCourseHours(course.hours),
    joinUrl: `${base(origin)}/api/learn/team/join?t=${seat.invite_token}`,
  });
}

export async function removeSeat(team: TeamRow, seatId: string): Promise<boolean> {
  const { data } = await supabaseAdmin
    .from("self_serve_team_seats")
    .delete()
    .eq("id", seatId)
    .eq("team_id", team.id)
    .is("accepted_at", null)
    .select("id");
  return Boolean(data?.length);
}

/**
 * Accepting a place creates the person's own purchase, dated today, so their
 * 12 months start now. Accepting twice returns the same purchase.
 */
export async function acceptSeat(inviteToken: string) {
  const { data: seatData } = await supabaseAdmin
    .from("self_serve_team_seats")
    .select(`${SEAT_COLUMNS}, self_serve_teams(${TEAM_COLUMNS})`)
    .eq("invite_token", inviteToken)
    .maybeSingle();
  const seat = seatData as (SeatRow & { self_serve_teams: TeamRow | null }) | null;
  const team = seat?.self_serve_teams;
  if (!seat || !team || team.status !== "paid") return { error: "missing" as const };

  if (seat.purchase_id) {
    const { data: purchase } = await supabaseAdmin
      .from("self_serve_purchases")
      .select("id, course_slug, access_token")
      .eq("id", seat.purchase_id)
      .maybeSingle();
    if (purchase?.access_token) return { purchase, team };
  }
  if (!placesOpen(team)) return { error: "expired" as const };

  const now = new Date().toISOString();
  const { data: purchase, error } = await supabaseAdmin
    .from("self_serve_purchases")
    .upsert(
      {
        course_slug: team.course_slug,
        email: seat.email,
        buyer_name: seat.name,
        amount: 0,
        currency: team.currency,
        stripe_session_id: `${SEAT_SESSION_PREFIX}${seat.id}`,
        status: "paid",
        access_token: newAccessToken(),
        paid_at: now,
        receipt_sent_at: now,
      },
      { onConflict: "stripe_session_id", ignoreDuplicates: false }
    )
    .select("id, course_slug, access_token")
    .single();
  if (error || !purchase) {
    console.error("[self-serve] seat purchase", error);
    return { error: "failed" as const };
  }
  await supabaseAdmin
    .from("self_serve_progress")
    .upsert({ purchase_id: purchase.id }, { onConflict: "purchase_id", ignoreDuplicates: true });
  await supabaseAdmin
    .from("self_serve_team_seats")
    .update({ accepted_at: now, purchase_id: purchase.id })
    .eq("id", seat.id);
  return { purchase, team };
}

/** Progress for the manage page: which lessons each accepted person has passed and whether they signed. */
export async function seatProgress(seats: SeatRow[]) {
  const ids = seats.map((seat) => seat.purchase_id).filter((id): id is string => Boolean(id));
  if (!ids.length) return new Map<string, { passed: number; signedAt: string | null }>();
  const { data } = await supabaseAdmin
    .from("self_serve_progress")
    .select("purchase_id, lessons, signed_at")
    .in("purchase_id", ids);
  const map = new Map<string, { passed: number; signedAt: string | null }>();
  for (const row of (data ?? []) as {
    purchase_id: string;
    lessons: Record<string, { passed?: boolean }> | null;
    signed_at: string | null;
  }[]) {
    const passed = Object.values(row.lessons ?? {}).filter((lesson) => lesson?.passed).length;
    map.set(row.purchase_id, { passed, signedAt: row.signed_at });
  }
  return map;
}
