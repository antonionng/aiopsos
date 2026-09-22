import type { Metadata } from "next";
import Link from "next/link";
import { LearnMarket } from "@/components/learn/learn-shell";
import { SignInForm, SignOutButton } from "@/components/learn/learner-account";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { cookiePurchase, currentLearner } from "@/lib/self-serve/access";
import { getSelfServeCourse, trackLabel } from "@/lib/self-serve/catalog";
import {
  linkPurchasesToUser,
  progressForPurchases,
  purchasesForUser,
  type PurchaseRow,
} from "@/lib/self-serve/records";
import type { CourseProgress, SelfServeCourse } from "@/lib/self-serve/types";
import { withSiteShareImages } from "@/lib/social-image";

export const metadata: Metadata = withSiteShareImages({
  title: "My courses",
  robots: { index: false, follow: false },
});

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function CourseRow({
  purchase,
  course,
  progress,
}: {
  purchase: PurchaseRow;
  course: SelfServeCourse;
  progress: CourseProgress | undefined;
}) {
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
      <p>
        Bought on {formatDate(purchase.paid_at)} for £{(purchase.amount / 100).toFixed(2)}.
      </p>
      <div className="la-course-actions">
        <Link className="la-button" href={`/learn/${course.slug}`}>
          {signed ? "Open the course" : passed === 0 ? "Start lesson one" : "Carry on"}
        </Link>
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
  const rows = purchases
    .map((purchase) => ({ purchase, course: getSelfServeCourse(purchase.course_slug) }))
    .filter((row): row is { purchase: PurchaseRow; course: SelfServeCourse } => Boolean(row.course));
  const finished = rows.filter((row) => progress.get(row.purchase.id)?.ref).length;

  return (
    <LearnMarket>
      <main className="la-page">
        <p className="ex-eyebrow">
          <span />
          MY COURSES
        </p>
        <h1>{name ? `Welcome back, ${name.split(/\s+/)[0]}.` : "Welcome back."}</h1>
        <p className="la-lede">
          Here are the courses on your account. Each one opens at the lesson you stopped at, and a finished course links to your signed record.
        </p>
        <div className="la-grid">
          {rows.length > 0 ? (
            <ul className="la-courses">
              {rows.map((row) => (
                <CourseRow
                  key={row.purchase.id}
                  purchase={row.purchase}
                  course={row.course}
                  progress={progress.get(row.purchase.id)}
                />
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
                <dt>Courses</dt>
                <dd>{rows.length}</dd>
              </div>
              <div>
                <dt>Finished and signed</dt>
                <dd>{finished}</dd>
              </div>
              {profile?.created_at ? (
                <div>
                  <dt>Learner since</dt>
                  <dd>{formatDate(profile.created_at as string)}</dd>
                </div>
              ) : null}
            </dl>
            <Link className="la-quiet" href="/forgot-password">
              Change my password
            </Link>
            <SignOutButton />
          </aside>
        </div>
      </main>
    </LearnMarket>
  );
}
