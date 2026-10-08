import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  BUY_CLICK_EVENT,
  PURCHASE_EVENT,
  promotionCodeFromSession,
  purchasePropsFromSession,
} from "../analytics/course-events.ts";

const paidSelfServe = {
  payment_status: "paid",
  amount_total: 7900,
  currency: "gbp",
  metadata: {
    purpose: "self_serve_course",
    course_slug: "prompt-engineering-for-professional-work",
  },
  discounts: [{ promotion_code: { code: "AUTUMN20" } }],
};

test("a paid self-serve session becomes a purchase event with the paid amount and code", () => {
  assert.equal(BUY_CLICK_EVENT, "buy_click");
  assert.equal(PURCHASE_EVENT, "purchase");
  assert.deepEqual(purchasePropsFromSession(paidSelfServe), {
    slug: "prompt-engineering-for-professional-work",
    amount: 7900,
    currency: "GBP",
    promotion_code: "AUTUMN20",
    seats: 1,
  });
});

test("team purchases include seat count, and agent slugs fall back to the cancel URL", () => {
  assert.deepEqual(
    purchasePropsFromSession({
      payment_status: "paid",
      amount_total: 49500,
      currency: "gbp",
      metadata: {
        purpose: "self_serve_team",
        course_slug: "prompt-engineering-for-professional-work",
        seats: "5",
      },
    }),
    {
      slug: "prompt-engineering-for-professional-work",
      amount: 49500,
      currency: "GBP",
      seats: 5,
    },
  );
  assert.deepEqual(
    purchasePropsFromSession({
      payment_status: "paid",
      amount_total: 9900,
      currency: "gbp",
      cancel_url: "https://www.experrt.com/courses/agents/always-on-agents",
      metadata: { purpose: "agent_course", payment_id: "pay_one" },
    }),
    {
      slug: "always-on-agents",
      amount: 9900,
      currency: "GBP",
      seats: 1,
    },
  );
});

test("unpaid, credit-pack, and unknown sessions are not counted as course purchases", () => {
  assert.equal(
    purchasePropsFromSession({ ...paidSelfServe, payment_status: "unpaid" }),
    null,
  );
  assert.equal(
    purchasePropsFromSession({
      payment_status: "paid",
      amount_total: 9900,
      currency: "gbp",
      metadata: { purpose: "credit_pack", payment_id: "stripe_one" },
    }),
    null,
  );
  assert.equal(promotionCodeFromSession({ total_details: { amount_discount: 2000 } }), undefined);
  assert.equal(
    promotionCodeFromSession({
      total_details: {
        breakdown: { discounts: [{ discount: { promotion_code: "promo_123" } }] },
      },
    }),
    "promo_123",
  );
});

test("the claim route does not emit purchase events, so the webhook is the only counter", () => {
  const claim = readFileSync(new URL("../../app/api/learn/claim/route.ts", import.meta.url), "utf8");
  assert.equal(claim.includes("trackPaidCoursePurchase"), false);
  assert.equal(claim.includes("@vercel/analytics"), false);
});

test("CSP keeps Vercel insights same-origin under script-src and connect-src", () => {
  const config = readFileSync(new URL("../../next.config.ts", import.meta.url), "utf8");
  assert.match(config, /script-src 'self'/);
  assert.match(config, /connect-src 'self'/);
});
