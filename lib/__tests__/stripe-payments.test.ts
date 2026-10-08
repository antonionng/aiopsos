import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import type Stripe from "stripe";

function moduleUnderTest(
  file: string,
  mocks: Record<string, unknown>,
  env: Record<string, string> = {},
) {
  const exports: Record<string, (...args: unknown[]) => Promise<unknown>> = {};
  mocks["@/lib/always-on-agents/guest-checkout"] ??= { applyGuestPayment: async () => {} };
  mocks["./memberships"] ??= { fulfilMembershipEvent: async () => false };
  mocks["@/lib/wonderlab/payments"] ??= { fulfilWonderlabEvent: async () => false };
  mocks["@/lib/analytics/server"] ??= { trackPaidCoursePurchase: async () => {} };
  const source = readFileSync(
    new URL("../../" + file, import.meta.url),
    "utf8",
  );
  runInNewContext(
    ts.transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.CommonJS },
    }).outputText,
    {
      exports,
      URL,
      process: { env },
      console: { error: () => {} },
      require: (name: string) => {
        if (!(name in mocks)) throw new Error("Unexpected dependency: " + name);
        return mocks[name];
      },
    },
  );
  return exports;
}
const session = {
  id: "cs_test_one",
  metadata: { payment_id: "stripe_one", purpose: "credit_pack" },
  amount_total: 9900,
  currency: "gbp",
  payment_status: "paid",
  payment_intent: "pi_one",
  status: "open",
  url: "https://checkout.stripe.com/example",
};

test("Stripe Checkout uses the stored price, stable idempotency key and refund-routing metadata", async () => {
  let creations = 0;
  const stripe = {
    checkout: {
      sessions: {
        create: async (
          params: Stripe.Checkout.SessionCreateParams,
          options: Stripe.RequestOptions,
        ) => {
          creations++;
          assert.equal(params.line_items?.[0].price_data?.unit_amount, 9900);
          assert.equal(params.line_items?.[0].price_data?.currency, "gbp");
          assert.equal(params.metadata?.payment_id, "stripe_one");
          assert.equal(
            params.payment_intent_data?.metadata?.payment_id,
            "stripe_one",
          );
          assert.equal(options.idempotencyKey, "stripe_one");
          return session;
        },
        retrieve: async () => session,
      },
    },
  };
  const mod = moduleUnderTest("lib/stripe-checkout.ts", {
    "./stripe.ts": { getStripe: () => stripe },
  });
  const params = {
    paymentId: "stripe_one",
    purpose: "credit_pack",
    title: "Credits",
    amount: 9900,
    currency: "GBP",
    successUrl: "https://experrt.com/success",
    cancelUrl: "https://experrt.com/billing",
  };
  await mod.createStripeCheckout(params);
  await mod.createStripeCheckout({ ...params, sessionId: "cs_test_one" });
  assert.equal(creations, 1);
  stripe.checkout.sessions.retrieve = async () => ({
    ...session,
    status: "expired",
  });
  await assert.rejects(
    mod.createStripeCheckout({ ...params, sessionId: "cs_test_one" }),
    /expired/,
  );
  await assert.rejects(
    mod.createStripeCheckout({ ...params, amount: -1 }),
    /valid payment amount/,
  );
});

function fulfilmentFixture(paid = true, fail = false) {
  const calls: { name: string; args: Record<string, unknown> }[] = [];
  const stripe = {
    checkout: {
      sessions: {
        retrieve: async () => ({
          ...session,
          payment_status: paid ? "paid" : "unpaid",
        }),
      },
    },
    paymentIntents: { retrieve: async () => ({ metadata: session.metadata }) },
  };
  const mod = moduleUnderTest("lib/stripe-fulfilment.ts", {
    "server-only": {},
    "@/lib/stripe": { getStripe: () => stripe },
    "@/lib/supabase/admin": {
      supabaseAdmin: {
        rpc: async (name: string, args: Record<string, unknown>) => {
          calls.push({ name, args });
          return { error: fail ? { message: "database unavailable" } : null };
        },
      },
    },
  });
  return { calls, fulfil: mod.fulfilStripePayment };
}
const completed = {
  id: "evt_paid",
  type: "checkout.session.completed",
  data: { object: session },
};

test("unpaid Checkout completion cannot add credits, while a paid session uses the atomic fulfilment RPC", async () => {
  const unpaid = fulfilmentFixture(false);
  assert.equal(await unpaid.fulfil(completed), true);
  assert.equal(unpaid.calls.length, 0);
  const paid = fulfilmentFixture();
  await paid.fulfil(completed);
  assert.equal(paid.calls[0].name, "academy_stripe_payment_event");
  assert.equal(paid.calls[0].args.p_type, "captured");
  assert.equal(paid.calls[0].args.p_amount, 9900);
  await assert.rejects(
    fulfilmentFixture(true, true).fulfil(completed),
    /database unavailable/,
  );
});

test("partial refunds do not claw back an entire credit pack; full refunds route by PaymentIntent metadata", async () => {
  const fixture = fulfilmentFixture();
  const charge = {
    amount: 9900,
    amount_refunded: 100,
    refunded: false,
    currency: "gbp",
    payment_intent: "pi_one",
    metadata: {},
  };
  await fixture.fulfil({
    id: "evt_partial",
    type: "charge.refunded",
    data: { object: charge },
  });
  assert.equal(fixture.calls.length, 0);
  await fixture.fulfil({
    id: "evt_refund",
    type: "charge.refunded",
    data: { object: { ...charge, refunded: true, amount_refunded: 9900 } },
  });
  assert.equal(fixture.calls[0].args.p_type, "refunded");
  assert.equal(fixture.calls[0].args.p_payment, "stripe_one");
});

test("Stripe webhook rejects invalid signatures and asks Stripe to retry failed fulfilment", async () => {
  for (const invalid of [true, false]) {
    const mod = moduleUnderTest(
      "app/api/stripe/webhook/route.ts",
      {
        "next/server": { NextResponse: Response },
        "@/lib/stripe": {
          stripe: {
            webhooks: {
              constructEvent: () => {
                if (invalid) throw new Error("bad signature");
                return completed;
              },
            },
          },
        },
        "@/lib/self-serve/commerce": { isSelfServeCheckout: () => false },
        "@/lib/self-serve/records": { fulfillSelfServeSession: async () => {} },
        "@/lib/self-serve/team-rules": { isTeamCheckout: () => false },
        "@/lib/self-serve/teams": { fulfillTeamSession: async () => {} },
        "@/lib/supabase/admin": { supabaseAdmin: {} },
        "@/lib/stripe-fulfilment": {
          fulfilStripePayment: async () => {
            throw new Error("database unavailable");
          },
        },
      },
      { STRIPE_SECRET_KEY: "test-key", STRIPE_WEBHOOK_SECRET: "test-secret" },
    );
    const response = await mod.POST(
      new Request("https://experrt.test/api/stripe/webhook", {
        method: "POST",
        headers: { "stripe-signature": "fixture" },
        body: "{}",
      }),
    );
    assert.equal((response as Response).status, invalid ? 400 : 503);
  }
});

test("Stripe course payments use the enrolment transaction and reject orders belonging to another processor", async () => {
  for (const provider of ["stripe", "mooov"]) {
    const calls: { name: string; args: Record<string, unknown> }[] = [];
    const order = {
      amount: 9900,
      currency: "GBP",
      payment_provider: provider,
      stripe_session_id: "cs_test_one",
      stripe_intent_id: null,
    };
    const courseSession = {
      ...session,
      metadata: { payment_id: "pay_course_one", purpose: "agent_course" },
    };
    const query = {
      select: () => query,
      eq: () => query,
      maybeSingle: async () => ({ data: order, error: null }),
      update: () => ({ eq: async () => ({ error: null }) }),
    };
    const mod = moduleUnderTest("lib/stripe-fulfilment.ts", {
      "server-only": {},
      "@/lib/stripe": {
        getStripe: () => ({
          checkout: { sessions: { retrieve: async () => courseSession } },
        }),
      },
      "@/lib/supabase/admin": {
        supabaseAdmin: {
          from: (table: string) => table === "agent_course_guest_checkouts" ? { select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: null, error: null }) }) }) } : query,
          rpc: async (name: string, args: Record<string, unknown>) => {
            calls.push({ name, args });
            return { error: null };
          },
        },
      },
    });
    const event = { ...completed, data: { object: courseSession } };
    if (provider === "mooov") {
      await assert.rejects(
        mod.fulfilStripePayment(event),
        /provider does not match/,
      );
      assert.equal(calls.length, 0);
    } else {
      await mod.fulfilStripePayment(event);
      assert.equal(calls[0].name, "agent_course_payment_event");
      assert.equal(calls[0].args.p_state, "captured");
      assert.equal(calls[0].args.p_currency, "GBP");
      assert.equal(calls[0].args.p_amount, 9900);
    }
  }
});


test("paid course webhooks emit purchase after fulfilment and ignore analytics failures", async () => {
  for (const [label, failing, agent] of [
    ["self-serve", false, false],
    ["analytics-down", true, false],
    ["agent-course", false, true],
  ] as const) {
    const tracked: unknown[] = [];
    const mod = moduleUnderTest(
      "app/api/stripe/webhook/route.ts",
      {
        "next/server": { NextResponse: Response },
        "@/lib/stripe": { stripe: { webhooks: { constructEvent: () => completed } } },
        "@/lib/supabase/admin": { supabaseAdmin: {} },
        "@/lib/stripe-fulfilment": { fulfilStripePayment: async () => agent },
        "@/lib/self-serve/commerce": { isSelfServeCheckout: () => !agent },
        "@/lib/self-serve/records": { fulfillSelfServeSession: async () => {} },
        "@/lib/self-serve/team-rules": { isTeamCheckout: () => false },
        "@/lib/self-serve/teams": { fulfillTeamSession: async () => {} },
        "@/lib/analytics/server": {
          trackPaidCoursePurchase: async (session: unknown, type: string) => {
            if (failing) throw new Error("analytics unavailable");
            tracked.push([label, session, type]);
          },
        },
      },
      { STRIPE_SECRET_KEY: "test-key", STRIPE_WEBHOOK_SECRET: "test-secret" },
    );
    const response = await mod.POST(
      new Request("https://experrt.test/api/stripe/webhook", {
        method: "POST",
        headers: { "stripe-signature": "fixture" },
        body: "{}",
      }),
    );
    assert.equal((response as Response).status, 200);
    if (!failing) {
      assert.equal(tracked.length, 1, label);
      assert.equal((tracked[0] as [string, typeof session, string])[2], "checkout.session.completed");
    }
  }
});

test("existing individual and team course checkouts retain their fulfilment handlers", async () => {
  for (const team of [false, true]) {
    const calls: string[] = [];
    const mod = moduleUnderTest("app/api/stripe/webhook/route.ts", {
      "next/server": { NextResponse: Response },
      "@/lib/stripe": { stripe: { webhooks: { constructEvent: () => completed } } },
      "@/lib/supabase/admin": { supabaseAdmin: {} },
      "@/lib/stripe-fulfilment": { fulfilStripePayment: async () => false },
      "@/lib/self-serve/commerce": { isSelfServeCheckout: () => !team },
      "@/lib/self-serve/records": { fulfillSelfServeSession: async () => { calls.push("individual"); } },
      "@/lib/self-serve/team-rules": { isTeamCheckout: () => team },
      "@/lib/self-serve/teams": { fulfillTeamSession: async () => { calls.push("team"); } },
    }, { STRIPE_SECRET_KEY: "test-key", STRIPE_WEBHOOK_SECRET: "test-secret" });
    const response = await mod.POST(new Request("https://experrt.test/api/stripe/webhook", {
      method: "POST", headers: { "stripe-signature": "fixture" }, body: "{}",
    }));
    assert.equal((response as Response).status, 200);
    assert.deepEqual(calls, [team ? "team" : "individual"]);
  }
});


test("paid guest checkout sends the authoritative Stripe email to the guest ledger", async () => {
  const calls: Record<string, unknown>[] = [];
  const mod = moduleUnderTest("lib/stripe-fulfilment.ts", {
    "server-only": {},
    "@/lib/stripe": { getStripe: () => ({ checkout: { sessions: { retrieve: async () => ({ ...session, metadata: {payment_id:"guest_payment",purpose:"agent_course"}, customer_details: {email:"paid@example.invalid",name:"Learner"} }) } } }) },
    "@/lib/always-on-agents/guest-checkout": { applyGuestPayment: async (params: Record<string, unknown>) => { calls.push(params); } },
    "@/lib/supabase/admin": { supabaseAdmin: { from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: {id:"guest"}, error: null }) }) }) }) } },
  });
  await mod.fulfilStripePayment(completed);
  assert.equal(calls[0].email,"paid@example.invalid");
  assert.equal(calls[0].amount,9900);
  assert.equal(calls[0].sessionId,"cs_test_one");
});

test('Wonderlab fulfils only authoritative paid sessions and passes the exact order to its transaction', async () => {
  const calls: unknown[] = [];
  let paid = false;
  const authoritative = { id: 'cs_wonderlab', metadata: { purpose: 'wonderlab_mission', order_id: 'order_owned' }, amount_total: 2000, currency: 'gbp', payment_status: 'paid', payment_intent: 'pi_wonderlab' };
  const module = moduleUnderTest('lib/wonderlab/payments.ts', {
    'server-only': {},
    '@/lib/stripe': { getStripe: () => ({ checkout: { sessions: { retrieve: async () => ({ ...authoritative, payment_status: paid ? 'paid' : 'unpaid' }) } } }) },
    '@/lib/supabase/admin': { supabaseAdmin: { rpc: async (name: string, args: unknown) => { calls.push([name,args]); return { error: null }; } } },
  });
  const event = { id: 'evt_wonderlab', type: 'checkout.session.completed', data: { object: { ...authoritative, metadata: { purpose: 'wonderlab_mission', order_id: 'payload_does_not_decide' } } } };
  assert.equal(await module.fulfilWonderlabEvent(event), true);
  assert.equal(calls.length, 0);
  paid = true;
  assert.equal(await module.fulfilWonderlabEvent(event), true);
  assert.equal(JSON.stringify(calls), JSON.stringify([['wonderlab_payment_event', { p_event: 'evt_wonderlab', p_order: 'order_owned', p_kind: 'paid', p_amount: 2000, p_currency: 'gbp', p_session: 'cs_wonderlab', p_intent: 'pi_wonderlab' }]]));
  assert.equal(await module.fulfilWonderlabEvent({ ...event, data: { object: { metadata: { purpose: 'self_serve_course' } } } }), false);
});

test('Wonderlab handles full refunds before capture using intent metadata, while partial refunds preserve access', async () => {
  const calls: unknown[] = [];
  const module = moduleUnderTest('lib/wonderlab/payments.ts', {
    'server-only': {},
    '@/lib/stripe': { getStripe: () => ({ paymentIntents: { retrieve: async () => ({ id: 'pi_wonderlab', metadata: { purpose: 'wonderlab_mission', order_id: 'order_owned' } }) } }) },
    '@/lib/supabase/admin': { supabaseAdmin: { rpc: async (_name: string, args: unknown) => { calls.push(args); return { error: null }; } } },
  });
  const charge = { payment_intent: 'pi_wonderlab', amount: 2000, amount_refunded: 500, currency: 'gbp' };
  assert.equal(await module.fulfilWonderlabEvent({ id: 'partial', type: 'charge.refunded', data: { object: charge } }), true);
  assert.equal(calls.length, 0);
  assert.equal(await module.fulfilWonderlabEvent({ id: 'full', type: 'charge.refunded', data: { object: { ...charge, amount_refunded: 2000 } } }), true);
  assert.equal(JSON.stringify(calls), JSON.stringify([{ p_event: 'full', p_order: 'order_owned', p_kind: 'refunded', p_amount: 2000, p_currency: 'gbp', p_session: null, p_intent: 'pi_wonderlab' }]));
});

test("membership webhook grants only verified invoice payment, consumes subscription events and keeps checkout access closed", async () => {
  const rules = await import("../wonderlab/membership-rules.ts");
  const catalog = await import("../wonderlab/catalog.ts");
  const calls: Record<string, unknown>[] = [];
  const subscription = { id: "sub_member", customer: "cus_member", metadata: { purpose: "wonderlab_membership", membership_id: "member_one" }, status: "active", cancel_at_period_end: false, ended_at: null,
    items: { data: [{ quantity: 1, price: { currency: "gbp", unit_amount: 2000, recurring: { interval: "month", interval_count: 1 } } }] } };
  const invoice = { id: "in_member", status: "paid", parent: { subscription_details: { subscription: "sub_member" } }, currency: "gbp", total: 2000, amount_paid: 2000,
    lines: { has_more: false, data: [{ amount: 2000, period: { start: 100, end: 100 + 30 * 86400 } }] } };
  const module = moduleUnderTest("lib/wonderlab/memberships.ts", {
    "server-only": {}, "node:crypto": { randomUUID: () => "fixture" }, "./catalog": catalog, "./membership-rules": rules,
    "@/lib/supabase/admin": { supabaseAdmin: { rpc: async (_: string, args: Record<string,unknown>) => { calls.push(args); return { error: null }; } } },
    "@/lib/stripe": { getStripe: () => ({
      subscriptions: { retrieve: async () => subscription },
      checkout: { sessions: { retrieve: async () => ({ metadata: subscription.metadata, subscription: subscription.id }) } },
      invoices: { retrieve: async () => invoice },
      invoicePayments: { list: async () => ({ data: [{ invoice: invoice.id }] }) },
    }) },
  });
  assert.equal(await module.fulfilMembershipEvent({ id: "evt_checkout", created: 100, type: "checkout.session.completed", data: { object: { id: "cs_member", metadata: subscription.metadata } } }), true);
  assert.equal(calls[0].p_invoice, null);
  assert.equal(await module.fulfilMembershipEvent({ id: "evt_invoice", created: 200, type: "invoice.paid", data: { object: invoice } }), true);
  assert.equal(calls[1].p_invoice, "in_member");
  assert.equal(calls[1].p_kind, "paid");
  assert.equal((calls[1].p_catalog as unknown[]).length, 24);
  assert.equal(await module.fulfilMembershipEvent({ id: "evt_sub", created: 300, type: "customer.subscription.updated", data: { object: subscription } }), true);
  assert.equal(calls[2].p_invoice, null);
  assert.equal(await module.fulfilMembershipEvent({ id: "evt_partial", created: 400, type: "charge.refunded", data: { object: { payment_intent: "pi_member", amount: 2000, amount_refunded: 1000 } } }), true);
  assert.equal(calls.length, 3);
  assert.equal(await module.fulfilMembershipEvent({ id: "evt_full", created: 500, type: "charge.refunded", data: { object: { payment_intent: "pi_member", amount: 2000, amount_refunded: 2000 } } }), true);
  assert.equal(calls[3].p_kind, "refunded");
  assert.equal(await module.fulfilMembershipEvent({ id: "adult", type: "customer.subscription.updated", data: { object: { metadata: { org_id: "adult_org" } } } }), false);
});
