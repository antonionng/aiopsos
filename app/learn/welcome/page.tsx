import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LearnMarket } from "@/components/learn/learn-shell";
import { SaveSignInForm } from "@/components/learn/learner-account";
import { cookiePurchase, currentLearner } from "@/lib/self-serve/access";
import { getSelfServeCourse } from "@/lib/self-serve/catalog";
import { withSiteShareImages } from "@/lib/social-image";

export const metadata: Metadata = withSiteShareImages({
  title: "Save your sign-in",
  robots: { index: false, follow: false },
});

export default async function WelcomePage() {
  const purchase = await cookiePurchase().catch(() => null);
  if (!purchase?.email) redirect("/learn/my-courses");
  const courseHref = `/learn/${purchase.course_slug}`;
  if (purchase.user_id || (await currentLearner())) redirect(courseHref);

  const course = getSelfServeCourse(purchase.course_slug);
  const first = purchase.buyer_name?.trim().split(/\s+/)[0];

  return (
    <LearnMarket>
      <main className="la-page">
        <p className="ex-eyebrow">
          <span />
          PAYMENT CONFIRMED
        </p>
        <h1>{first ? `Thank you, ${first}. Your course is ready.` : "Thank you. Your course is ready."}</h1>
        <p className="la-lede">
          {course?.title ?? "Your course"} is paid for, and a receipt is on its way to {purchase.email}. Save a password now so you can sign back in later, on this device or another, and find the course under My courses.
        </p>
        <div className="la-grid">
          <SaveSignInForm
            email={purchase.email}
            defaultName={purchase.buyer_name ?? ""}
            courseHref={courseHref}
          />
          <aside className="la-profile">
            <strong>What your account keeps</strong>
            <span>Every course you buy, the lesson you stopped at, each check you have passed, and your signed record. The browser you paid in will still open the course if you skip this step.</span>
          </aside>
        </div>
      </main>
    </LearnMarket>
  );
}
