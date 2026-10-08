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
