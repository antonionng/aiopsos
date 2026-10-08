import type { Metadata } from "next";
import Link from "next/link";
import { LearnMarket } from "@/components/learn/learn-shell";
import { TeamManager, type TeamSeatView } from "@/components/learn/team-manager";
import { currentLearner } from "@/lib/self-serve/access";
import { getSelfServeCourse } from "@/lib/self-serve/catalog";
import { accessEndsAt } from "@/lib/self-serve/entitlement";
import { openTeam, placesOpen, seatProgress } from "@/lib/self-serve/teams";
import { withSiteShareImages } from "@/lib/social-image";
import "@/components/learn/learner-account.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = withSiteShareImages({
  title: "Your team",
  robots: { index: false, follow: false },
});

function formatDate(value: string | Date | null | undefined) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default async function TeamPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ t?: string; welcome?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const user = await currentLearner();
  const opened = await openTeam(id, { token: query.t ?? null, userId: user?.id, email: user?.email });

  if (!opened) {
    return (
      <LearnMarket>
        <main className="la-page">
          <section className="la-panel">
            <h1>We could not open this team</h1>
            <p>Use the button in your purchase email, or sign in with the email address you paid with.</p>
            <Link className="ex-button ex-button-dark" href="/learn/my-courses">
              Sign in
            </Link>
          </section>
        </main>
      </LearnMarket>
    );
  }

  const { team, seats } = opened;
  const course = getSelfServeCourse(team.course_slug);
  const progress = await seatProgress(seats);
  const lessons = course?.lessons?.length ?? 0;
  const views: TeamSeatView[] = seats.map((seat) => {
    const p = seat.purchase_id ? progress.get(seat.purchase_id) : undefined;
    return {
      id: seat.id,
      email: seat.email,
      name: seat.name,
      invitedAt: seat.invited_at,
      acceptedAt: seat.accepted_at,
      passed: p?.passed ?? 0,
      signedAt: p?.signedAt ?? null,
    };
  });
  const joined = views.filter((seat) => seat.acceptedAt).length;
  const finished = views.filter((seat) => seat.signedAt).length;

  return (
    <LearnMarket>
      <main className="la-page">
        {query.welcome ? (
          <p className="la-notice">
            Payment confirmed. We have emailed you a receipt and a link back to this page. Invite your
            team below.
          </p>
        ) : null}
        <section className="la-panel">
          <p className="ex-eyebrow">
            <span />
            TEAM PLACES
          </p>
          <h1>{course?.title ?? team.course_slug}</h1>
          <dl className="la-team-stats">
            <div>
              <dt>Places</dt>
              <dd>{team.seats}</dd>
            </div>
            <div>
              <dt>Invited</dt>
              <dd>{seats.length}</dd>
            </div>
            <div>
              <dt>Joined</dt>
              <dd>{joined}</dd>
            </div>
            <div>
              <dt>Finished</dt>
              <dd>{finished}</dd>
            </div>
          </dl>
          <p className="la-note">
            Bought by {team.buyer_name || team.buyer_email} on {formatDate(team.paid_at)}.{" "}
            {placesOpen(team)
              ? `Send invitations by ${formatDate(accessEndsAt(team.paid_at))}. Each person gets 12 months from the day they accept.`
              : "The time to send invitations has ended."}
          </p>
        </section>
        <TeamManager
          teamId={team.id}
          token={query.t ?? null}
          seatsLeft={Math.max(0, team.seats - seats.length)}
          open={placesOpen(team)}
          lessons={lessons}
          seats={views}
        />
      </main>
    </LearnMarket>
  );
}
