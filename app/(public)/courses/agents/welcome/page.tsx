import type { Metadata } from "next";
import { withSiteShareImages } from "@/lib/social-image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LearnMarket } from "@/components/learn/learn-shell";
import { SaveSignInForm, SignInForm } from "@/components/learn/learner-account";
import { guestPurchase, claimGuestPurchase } from "@/lib/always-on-agents/guest-checkout";
import { currentLearner } from "@/lib/self-serve/access";
export const dynamic = "force-dynamic";
export const metadata: Metadata = withSiteShareImages({ title: "Save your course sign-in", robots: { index: false, follow: false } });
export default async function AgentWelcome({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const { order = "" } = await searchParams;
  const purchase = await guestPurchase(order);
  if (!purchase) return <LearnMarket><main className="la-page"><h1>Open your purchase in the same browser</h1><p className="la-lede">Return to the browser where you paid to save your sign-in. If you have already saved your account, sign in to open your course.</p><Link href="/login">Sign in to Experrt</Link></main></LearnMarket>;
  if (purchase.status !== "paid") return <LearnMarket><main className="la-page"><h1>Your payment needs to be confirmed</h1><p className="la-lede">Your course will be ready once Stripe confirms your payment. If you just paid, refresh this page in a moment. If your payment was cancelled or refunded, you can return to the course page.</p><Link href={`/courses/agents/${purchase.course_slug}`}>Return to the course</Link></main></LearnMarket>;
  const courseHref = `/courses/agents/welcome?order=${purchase.id}`;
  const user = await currentLearner();
  let issue = "";
  if (user && user.email?.toLowerCase() === purchase.email) {
    let next = "";
    try { next = await claimGuestPurchase(purchase.id, user.id); }
    catch (error) { issue = error instanceof Error ? error.message : "Your course could not be opened. Please retry."; }
    if (next) redirect(next);
  }
  return <LearnMarket><main className="la-page"><p className="ex-eyebrow"><span />PAYMENT CONFIRMED</p><h1>Thank you. Your course is ready.</h1><p className="la-lede">You have paid for {purchase.title}. Save a password for {purchase.email} so you can return to your lessons, practical project and assessment feedback whenever you need them.</p><div className="la-grid">
    {issue ? <div className="la-panel"><p role="alert">{issue}</p><Link href={courseHref}>Try opening your course again</Link></div> : user ? <div className="la-panel"><p>Sign in with {purchase.email}, the email you used at checkout, to keep this purchase on the right account.</p><SignInForm defaultEmail={purchase.email ?? ""} next={courseHref} /></div> : <SaveSignInForm email={purchase.email ?? ""} defaultName={purchase.buyer_name ?? ""} courseHref={courseHref} accountEndpoint="/api/courses/agents/account" order={purchase.id} allowSkip={false} />}
    <aside className="la-profile"><strong>What your account keeps</strong><span>Your course includes 12 months of access from payment confirmation. Your account saves your lesson progress, practical work, AI assessment feedback and the Experrt certificate you earn when you pass.</span></aside></div></main></LearnMarket>;
}
