import assert from "node:assert/strict";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";

// Synthetic learner, no email, no card entry, no payment or fabricated payment event.
const origin = "https://www.experrt.com";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
assert.equal(new URL(url).hostname, "ecxsqzvhsydpgstvvxxo.supabase.co");
const admin = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const email = `${crypto.randomUUID()}@example.invalid`;
const password = `${crypto.randomUUID()}Aa1!`;
let userId: string | undefined;
let orgId: string | undefined;
let orderId: string | undefined;
try {
  const user = await admin.auth.admin.createUser({ email, password, email_confirm: true });
  if (user.error) throw new Error(user.error.message);
  userId = user.data.user.id;
  const org = await admin.from("organisations").insert({ name: "Verification only: agent checkout (no payment)", owner_id: userId }).select("id").single();
  if (org.error) throw new Error(org.error.message);
  orgId = org.data.id;
  const profile = await admin.from("user_profiles").upsert({ id: userId, org_id: orgId, role: "user", email, name: "Fictional checkout verification learner" });
  if (profile.error) throw new Error(profile.error.message);
  const membership = await admin.from("organisation_memberships").upsert({ user_id: userId, org_id: orgId, role: "learner", status: "active", source: "direct" }, { onConflict: "user_id,org_id" });
  if (membership.error) throw new Error(membership.error.message);
  const jar = new Map<string, { name: string; value: string }>();
  const auth = createServerClient(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: { getAll: () => [...jar.values()], setAll: cookies => cookies.forEach(cookie => jar.set(cookie.name, cookie)) },
  });
  const signed = await auth.auth.signInWithPassword({ email, password });
  if (signed.error) throw new Error(signed.error.message);
  const cookie = [...jar.values()].map(item => `${item.name}=${item.value}`).join("; ");
  const offers = await fetch(`${origin}/api/public/agent-course-offers`, { cache: "no-store" }).then(response => response.json());
  assert.equal(offers.offers.length, 13);
  const offer = offers.offers.find((item: { slug: string }) => item.slug === "always-on-agent-foundations");
  assert.equal(offer.amount, 9900);
  const requestKey = crypto.randomUUID();
  async function checkout() {
    const response = await fetch(`${origin}/api/courses/agents/checkout`, {
      method: "POST", redirect: "manual", headers: { Cookie: cookie, "Content-Type": "application/json", "Idempotency-Key": requestKey },
      body: JSON.stringify({ slug: offer.slug, terms_version: offer.terms_version }),
    });
    assert.equal(response.status, 200, `Checkout responded ${response.status}`);
    return response.json();
  }
  const result = await checkout();
  orderId = result.order_id;
  assert.equal(new URL(result.url).hostname, "checkout.stripe.com");
  const repeated = await checkout();
  assert.equal(repeated.order_id, orderId);
  assert.equal(repeated.url, result.url);
  const order = await admin.from("agent_course_orders").select("status,amount,currency,payment_provider,stripe_session_id,assignment_id,assessment_mode").eq("id", orderId).single();
  if (order.error) throw new Error(order.error.message);
  assert.equal(order.data.status, "pending");
  assert.equal(order.data.amount, 9900);
  assert.equal(order.data.currency, "GBP");
  assert.equal(order.data.payment_provider, "stripe");
  assert.equal(order.data.assessment_mode, "ai");
  assert.match(order.data.stripe_session_id, /^cs_(live|test)_/);
  assert.equal(order.data.assignment_id, null);
  const learning = await fetch(`${origin}/api/courses/agents/learning/${orderId}`, { headers: { Cookie: cookie }, redirect: "manual" });
  assert.equal(learning.status, 403);
  console.log(JSON.stringify({ offers: 13, checkout: "Stripe hosted checkout created", amount: "GBP 99.00", stripeMode: order.data.stripe_session_id.startsWith("cs_live_") ? "live" : "test", repeatedRequest: "same checkout", unpaidLearning: "blocked", paymentMade: false }));
} finally {
  // Retain a labelled audit record. Disable this synthetic account after the check.
  if (orgId && userId) {
    const membership = await admin.from("organisation_memberships").update({ status: "suspended" }).eq("user_id", userId).eq("org_id", orgId);
    if (membership.error) throw new Error(membership.error.message);
  }
  if (userId) {
    const banned = await admin.auth.admin.updateUserById(userId, { ban_duration: "876000h" });
    if (banned.error) throw new Error(banned.error.message);
  }
  if (orderId) {
    const order = await admin.from("agent_course_orders").update({ status: "voided" }).eq("id", orderId).eq("status", "pending");
    if (order.error) throw new Error(order.error.message);
  }
}
