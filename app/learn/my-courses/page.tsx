import type { Metadata } from "next";
import Link from "next/link";
import { LearnMarket } from "@/components/learn/learn-shell";
import { BuyCourseButton } from "@/components/learn/buy-course-button";
import { SelfServeCourseCards } from "@/components/learn/course-cards";
import { SignInForm, SignOutButton } from "@/components/learn/learner-account";
import { TeamSessionForm } from "@/components/learn/team-session-form";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { cookiePurchase, currentLearner } from "@/lib/self-serve/access";
import { getSelfServeCourse, trackLabel } from "@/lib/self-serve/catalog";
import { courseArtefact } from "@/lib/self-serve/engine";
import { onePerCourse, type CourseHolding } from "@/lib/self-serve/entitlement";
import {
  linkPurchasesToUser,
  progressForPurchases,
  purchasesForUser,
  type PurchaseRow,
} from "@/lib/self-serve/records";
import { linkedInAddUrl } from "@/lib/self-serve/share-links";
import { recommendCourses } from "@/lib/self-serve/upsell";
import { teamsForBuyer } from "@/lib/self-serve/teams";
import type { CourseProgress, SelfServeCourse } from "@/lib/self-serve/types";
import { withSiteShareImages } from "@/lib/social-image";

export const metadata: Metadata = withSiteShareImages({
  title: "My learning",
  robots: { index: false, follow: false },
});

function formatDate(iso: string | Date | null | undefined): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function CourseRow({
  holding,
  course,
}: {
  holding: CourseHolding<PurchaseRow>;
  course: SelfServeCourse;
}) {
  const { progress } = holding;
  const lessons = course.lessons ?? [];
  const passed = lessons.filter((lesson) => progress?.lessons[lesson.id]?.passed).length;
  const total = lessons.length;
  const signed = Boolean(progress?.ref && progress.signedName);
  const status = signed
    ? `Finished and signed on ${formatDate(progress?.signedAt)}.`
    : passed === 0
      ? "You have not started yet. Lesson one is open."
      : passed === total
        ? "Every check has passed. Sign your record to finish."
        : `You have passed ${passed} of ${total} lessons.`;
  const pct = total ? Math.round((passed / total) * 100) : 0;

  return (
    <li className="la-course">
      <span className="la-course-track">{trackLabel(course.track)}</span>
      <h2>{course.title}</h2>
      <p>{status}</p>
      <div className="la-bar" role="img" aria-label={`${passed} of ${total} lessons passed`}>
        <span style={{ width: `${pct}%` }} />
      </div>
      {holding.active ? (
        <p className="la-course-status">
          {holding.accessEndsAt
            ? `Your access is open until ${formatDate(holding.accessEndsAt)}.`
            : "Your access is open."}
        </p>
      ) : (
        <p className="la-course-status is-ended">
          Your 12 months of access ended on {formatDate(holding.accessEndsAt)}. Your signed record stays public.
        </p>
      )}
      <div className="la-course-actions">
        {holding.active ? (
          <Link className="la-button" href={`/learn/${course.slug}`}>
            {signed ? "Open the course" : passed === 0 ? "Start lesson one" : "Carry on"}
          </Link>
        ) : (
          <BuyCourseButton
            slug={course.slug}
            label={`Buy 12 more months for £${course.priceGbp}`}
            className="la-button"
          />
        )}
        {signed ? (
          <>
            <Link href={`/learn/${course.slug}/certificate`}>Your record</Link>
            <Link href={`/verify/${progress?.ref}`}>Public record</Link>
          </>
        ) : null}
      </div>
    </li>
  );
}

type SignedWork = { course: SelfServeCourse; progress: CourseProgress & { ref: string } };

function LearnedList({ records }: { records: SignedWork[] }) {
  return (
    <ul className="la-courses">
      {records.map(({ course, progress }) => {
        const artefact = courseArtefact(course);
        return (
          <li className="la-course" key={progress.ref}>
            <span className="la-course-track">{trackLabel(course.track)}</span>
            <h2>{course.title}</h2>
            <p>
              Signed by {progress.signedName} on {formatDate(progress.signedAt)}. Record {progress.ref}.
            </p>
            {artefact?.recordLine ? <p>{artefact.recordLine}</p> : null}
            <div className="la-course-actions">
              <Link href={`/learn/${course.slug}/certificate`}>Certificate</Link>
              <a href={`/api/learn/certificate/${progress.ref}`}>PDF</a>
              <Link href={`/learn/${course.slug}/certificate#review`}>Leave a review</Link>
              <Link href={`/verify/${progress.ref}`}>Public record</Link>
              <a href={linkedInAddUrl(course.title, progress.ref, progress.signedAt)} target="_blank" rel="noreferrer">
                Add to LinkedIn
              </a>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default async function MyCoursesPage() {
  const user = await currentLearner();

  if (!user) {
    const pending = await cookiePurchase().catch(() => null);
    return (
      <LearnMarket>
        <main className="la-page">
          <p className="ex-eyebrow">
            <span />
            MY COURSES
          </p>
          <h1>Sign in to see your courses.</h1>
          <p className="la-lede">
            Use the email address you gave at checkout and the password you saved. Your courses, your progress, and your signed records are all on that account.
          </p>
          <div className="la-grid">
            <div className="la-panel">
              <SignInForm defaultEmail={pending?.email ?? ""} />
            </div>
            <aside className="la-profile">
              <strong>No password yet?</strong>
              {pending && !pending.user_id ? (
                <span>
                  This browser bought a course. <Link href="/learn/welcome">Save a password on {pending.email}</Link> and it will stay on your account.
                </span>
              ) : (
                <span>
                  Open the course from your receipt email, and you will be asked to save a password. If you have lost the password, choose I have forgotten my password.
                </span>
              )}
              <span style={{ marginTop: 10 }}>
                <Link href="/learn">Browse all courses</Link>
              </span>
            </aside>
          </div>
        </main>
      </LearnMarket>
    );
  }

  await linkPurchasesToUser(user.id, user.email).catch(() => 0);
  const pending = await cookiePurchase().catch(() => null);
  if (pending && !pending.user_id) {
    await supabaseAdmin
      .from("self_serve_purchases")
      .update({ user_id: user.id, account_linked_at: new Date().toISOString() })
      .eq("id", pending.id)
      .is("user_id", null);
  }

  const purchases = await purchasesForUser(user.id, user.email).catch(() => [] as PurchaseRow[]);
  const progress = await progressForPurchases(purchases.map((row) => row.id)).catch(
    () => new Map<string, CourseProgress>()
  );
  const { data: profile } = await supabaseAdmin
    .from("user_profiles")
    .select("name, created_at")
    .eq("id", user.id)
    .maybeSingle();
  const name = (profile?.name as string | undefined)?.trim() || (user.user_metadata?.name as string | undefined) || "";

  const rows = onePerCourse(purchases, progress)
    .map((holding) => ({ holding, course: getSelfServeCourse(holding.purchase.course_slug) }))
    .filter((row): row is { holding: CourseHolding<PurchaseRow>; course: SelfServeCourse } => Boolean(row.course));

  const records: SignedWork[] = [];
  const seenRefs = new Set<string>();
  for (const purchase of purchases) {
    const entry = progress.get(purchase.id);
    const course = getSelfServeCourse(purchase.course_slug);
    if (!course || !entry?.ref || !entry.signedName || seenRefs.has(entry.ref)) continue;
    seenRefs.add(entry.ref);
    records.push({ course, progress: entry as SignedWork["progress"] });
  }
  records.sort((a, b) => (b.progress.signedAt ?? "").localeCompare(a.progress.signedAt ?? ""));

  const ownedSlugs = rows.map((row) => row.course.slug);
  const picks = recommendCourses(rows[0]?.course.slug, ownedSlugs, 3)
    .map((pick) => getSelfServeCourse(pick.slug))
    .filter((course): course is SelfServeCourse => Boolean(course));
  const sessionCourses = [...rows.map((row) => row.course), ...picks].map((course) => ({
    slug: course.slug,
    title: course.title,
  }));
  const active = rows.filter((row) => row.holding.active);
  const teams = await teamsForBuyer(user.id, user.email).catch(() => []);

  return (
    <LearnMarket>
      <main className="la-page">
        <p className="ex-eyebrow">
          <span />
          MY LEARNING
        </p>
        <h1>{name ? `Welcome back, ${name.split(/\s+/)[0]}.` : "Welcome back."}</h1>
        <p className="la-lede">
          Pick up where you stopped, see what you have finished, and find the next course. Each course opens at the lesson you stopped at, and access lasts 12 months from payment.
        </p>
        <div className="la-grid">
          {rows.length > 0 ? (
            <ul className="la-courses" aria-label="Your courses">
              {rows.map((row) => (
                <CourseRow key={row.course.slug} holding={row.holding} course={row.course} />
              ))}
            </ul>
          ) : (
            <p className="la-empty">
              There are no courses on {user.email} yet. If you bought a course with a different email address, sign in with that one instead. You can also <Link href="/learn">browse all courses</Link>.
            </p>
          )}
          <aside className="la-profile" aria-label="Your profile">
            <strong>{name || "Your profile"}</strong>
            <span>{user.email}</span>
            <dl>
              <div>
                <dt>Courses open</dt>
                <dd>{active.length}</dd>
              </div>
              <div>
                <dt>Finished and signed</dt>
                <dd>{records.length}</dd>
              </div>
              {profile?.created_at ? (
                <div>
                  <dt>Learner since</dt>
                  <dd>{formatDate(profile.created_at as string)}</dd>
                </div>
              ) : null}
            </dl>
            <Link className="la-quiet" href="/learn/account">
              My account and receipts
            </Link>
            <SignOutButton />
          </aside>
        </div>

        {teams.length > 0 ? (
          <section className="la-section" aria-labelledby="teams-title">
            <h2 id="teams-title">Teams you manage</h2>
            <p>Places you bought for other people. Open a team to invite people and see who has finished.</p>
            <ul className="la-courses">
              {teams.map(({ team, invited, joined }) => (
                <li className="la-course" key={team.id}>
                  <span className="la-course-track">Team places</span>
                  <h2>{getSelfServeCourse(team.course_slug)?.title ?? team.course_slug}</h2>
                  <p>
                    {team.seats} places · {invited} invited · {joined} joined
                  </p>
                  <div className="la-course-actions">
                    <Link href={`/learn/team/${team.id}`}>Manage team</Link>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {records.length > 0 ? (
          <section className="la-section" aria-labelledby="learned-title">
            <h2 id="learned-title">What you have learned</h2>
            <p>Every finished course has a public record that an employer can check. Add it to your LinkedIn profile in one click.</p>
            <LearnedList records={records} />
          </section>
        ) : null}

        {picks.length > 0 ? (
          <section className="la-section" aria-labelledby="next-title">
            <h2 id="next-title">Recommended for you</h2>
            <p>These follow on from the courses you have taken. None of them repeat what you already own.</p>
            <SelfServeCourseCards courses={picks} />
            <div className="la-links">
              <Link href="/learn">Browse all self-paced courses</Link>
              <Link href="/courses">See trainer-led courses</Link>
            </div>
          </section>
        ) : null}

        <section className="la-section" aria-labelledby="team-title">
          <h2 id="team-title">Bring this to your team</h2>
          <p>
            Every self-paced course can be run as a trainer-led session for a group, in person at your office or live online. Tell us what you need and the Experrt team will reply with dates and a price.
          </p>
          <div className="la-grid">
            <div className="la-panel">
              <TeamSessionForm name={name} courses={sessionCourses} />
            </div>
            <aside className="la-profile">
              <strong>Prefer to talk?</strong>
              <span>
                Email <a href="mailto:hello@experrt.com">hello@experrt.com</a> and mention the courses you have taken.
              </span>
            </aside>
          </div>
        </section>
      </main>
    </LearnMarket>
  );
}
