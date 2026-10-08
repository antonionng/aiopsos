import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LearnMarket } from "@/components/learn/learn-shell";
import {
  DeleteAccount,
  MarketingToggle,
  NameForm,
  PasswordForm,
} from "@/components/learn/account-settings";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { currentLearner } from "@/lib/self-serve/access";
import { getSelfServeCourse } from "@/lib/self-serve/catalog";
import { isSeatPurchase } from "@/lib/self-serve/team-rules";
import { accessEndsAt } from "@/lib/self-serve/entitlement";
import { purchasesForUser, type PurchaseRow } from "@/lib/self-serve/records";
import { withSiteShareImages } from "@/lib/social-image";
import "@/components/learn/learner-account.css";

export const metadata: Metadata = withSiteShareImages({
  title: "My account",
  robots: { index: false, follow: false },
});

function formatDate(iso: string | Date | null | undefined): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default async function LearnerAccountPage({
  searchParams,
}: {
  searchParams: Promise<{ receipt?: string }>;
}) {
  const user = await currentLearner();
  if (!user) redirect("/learn/my-courses");
  const query = await searchParams;

  const purchases = await purchasesForUser(user.id, user.email).catch(() => [] as PurchaseRow[]);
  const { data: profile } = await supabaseAdmin
    .from("user_profiles")
    .select("name")
    .eq("id", user.id)
    .maybeSingle();
  const { data: optOut } = purchases.length
    ? await supabaseAdmin
        .from("self_serve_purchases")
        .select("marketing_opt_out_at")
        .in(
          "id",
          purchases.map((row) => row.id)
        )
        .not("marketing_opt_out_at", "is", null)
        .limit(1)
    : { data: [] };
  const name = (profile?.name as string | undefined)?.trim() || (user.user_metadata?.name as string | undefined) || "";

  return (
    <LearnMarket>
      <main className="la-page">
        <p className="ex-eyebrow">
          <span />
          MY ACCOUNT
        </p>
        <h1>Your account</h1>
        <p className="la-lede">
          Signed in as {user.email}. To change the email address on your account, write to{" "}
          <a href="mailto:hello@experrt.com">hello@experrt.com</a> from that address.
        </p>

        <section className="la-section" aria-labelledby="details-title">
          <h2 id="details-title">Your details</h2>
          <div className="la-grid">
            <div className="la-panel">
              <NameForm name={name} />
            </div>
            <div className="la-panel">
              <PasswordForm />
            </div>
          </div>
        </section>

        <section className="la-section" aria-labelledby="receipts-title">
          <h2 id="receipts-title">Purchases and receipts</h2>
          {query.receipt === "missing" ? (
            <p className="la-error">
              That receipt is not available online. Email hello@experrt.com and we will send a copy.
            </p>
          ) : null}
          {purchases.length > 0 ? (
            <ul className="la-courses">
              {purchases.map((row) => {
                const course = getSelfServeCourse(row.course_slug);
                const seat = isSeatPurchase(row.stripe_session_id);
                return (
                  <li className="la-course" key={row.id}>
                    <h2>{course?.title ?? row.course_slug}</h2>
                    <p>
                      {seat
                        ? `Team place, accepted on ${formatDate(row.paid_at)}.`
                        : `Paid £${(row.amount / 100).toFixed(2)} on ${formatDate(row.paid_at)}.`}{" "}
                      Access until{" "}
                      {formatDate(accessEndsAt(row.paid_at))}.
                    </p>
                    {seat ? null : (
                      <div className="la-course-actions">
                        <a href={`/api/learn/receipt?id=${row.id}`}>View receipt</a>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="la-empty">No purchases yet.</p>
          )}
          <p>
            All sales are final and no refunds are given. See the <Link href="/course-terms">course terms of sale</Link>.
          </p>
        </section>

        <section className="la-section" aria-labelledby="email-title">
          <h2 id="email-title">Email preferences</h2>
          <div className="la-panel" style={{ marginTop: 20 }}>
            <MarketingToggle subscribed={(optOut?.length ?? 0) === 0} />
          </div>
        </section>

        <section className="la-section" aria-labelledby="data-title">
          <h2 id="data-title">Your data</h2>
          <p>
            Download everything we hold about your learner account: your details, purchases and progress. Read how we use it in our{" "}
            <Link href="/privacy">privacy policy</Link>.
          </p>
          <div className="la-links">
            <a href="/api/learn/profile" download>
              Download my data
            </a>
          </div>
          <div className="la-panel la-danger" style={{ marginTop: 24 }}>
            <DeleteAccount />
          </div>
        </section>
      </main>
    </LearnMarket>
  );
}
