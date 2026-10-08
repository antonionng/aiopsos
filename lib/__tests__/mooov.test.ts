import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash, createHmac } from "node:crypto";
import {
  signMooovRequest,
  verifyMooovWebhook,
  newMooovPaymentId,
  createPaymentIntent,
  paymentCheckoutUrl,
} from "../mooov.ts";

const SECRET = "whsec_test_secret";

test("checkout URLs support both documented response shapes and reject unsafe redirects", () => {
  assert.equal(
    paymentCheckoutUrl({
      payment_id: "one",
      provider: { hosted_url: "https://checkout.stripe.com/c/pay/example" },
    }),
    "https://checkout.stripe.com/c/pay/example",
  );
  assert.equal(
    paymentCheckoutUrl({
      payment_id: "one",
      hosted_url: "https://checkout.mooov.money/example",
    }),
    "https://checkout.mooov.money/example",
  );
  for (const hosted_url of [
    "javascript:alert(1)",
    "http://example.com",
    "https://user:password@example.com",
    "invalid",
  ]) {
    assert.equal(paymentCheckoutUrl({ payment_id: "one", hosted_url }), null);
  }
});

test("payment creation signs the documented X-Mooov headers and normalises the hosted URL", async () => {
  const originalFetch = globalThis.fetch;
  const previousKey = process.env.MOOOV_API_KEY_ID;
  const previousSecret = process.env.MOOOV_API_SECRET;
  process.env.MOOOV_API_KEY_ID = "test-key";
  process.env.MOOOV_API_SECRET = SECRET;
  globalThis.fetch = async (_url, init) => {
    const headers = new Headers(init?.headers);
    const body = JSON.parse(String(init?.body));
    assert.equal(headers.get("X-Mooov-Key-Id"), "test-key");
    assert.equal(headers.get("Idempotency-Key"), "pay_course_test");
    assert.equal(
      headers.get("X-Mooov-Signature"),
      signMooovRequest(
        SECRET,
        "POST",
        "/v1/payment_intents",
        headers.get("X-Mooov-Timestamp")!,
        String(init?.body),
      ),
    );
    assert.equal(body.amount, 9900);
    assert.equal(body.currency, "GBP");
    assert.equal(
      body.cancel_url,
      "https://experrt.com/courses/agents/foundations",
    );
    return Response.json({
      payment_id: body.payment_id,
      state: "processing",
      provider: { hosted_url: "https://checkout.stripe.com/c/pay/example" },
    });
  };
  try {
    const intent = await createPaymentIntent({
      paymentId: "pay_course_test",
      amount: 9900,
      currency: "GBP",
      successUrl: "https://experrt.com/courses/agents/checkout/order",
      cancelUrl: "https://experrt.com/courses/agents/foundations",
    });
    assert.equal(
      intent.hosted_url,
      "https://checkout.stripe.com/c/pay/example",
    );
  } finally {
    globalThis.fetch = originalFetch;
    if (previousKey === undefined) delete process.env.MOOOV_API_KEY_ID;
    else process.env.MOOOV_API_KEY_ID = previousKey;
    if (previousSecret === undefined) delete process.env.MOOOV_API_SECRET;
    else process.env.MOOOV_API_SECRET = previousSecret;
  }
});

function makeSignatureHeader(body: string, t: number, secret = SECRET) {
  const v1 = createHmac("sha256", secret)
    .update(`${t}.${body}`, "utf8")
    .digest("hex");
  return `t=${t},v1=${v1}`;
}

test("importing the mooov module does not require env vars", async () => {
  const prev = process.env.MOOOV_API_KEY_ID;
  delete process.env.MOOOV_API_KEY_ID;
  const mod = await import("../mooov.ts");
  assert.equal(typeof mod.createPaymentIntent, "function");
  if (prev !== undefined) process.env.MOOOV_API_KEY_ID = prev;
});

test("request signature covers method, path, timestamp and body hash", () => {
  const body = JSON.stringify({ amount: 4200 });
  const timestamp = "2026-08-25T12:00:00.000Z";
  const signature = signMooovRequest(
    SECRET,
    "post",
    "/v1/payment_intents",
    timestamp,
    body,
  );

  const bodyHash = createHash("sha256").update(body, "utf8").digest("hex");
  const expected = createHmac("sha256", SECRET)
    .update(`POST\n/v1/payment_intents\n${timestamp}\n${bodyHash}`, "utf8")
    .digest("hex");

  assert.equal(signature, expected);
  // A different body must produce a different signature.
  assert.notEqual(
    signMooovRequest(SECRET, "post", "/v1/payment_intents", timestamp, "{}"),
    signature,
  );
});

test("webhook verification accepts a valid signature", () => {
  const body = JSON.stringify({ id: "evt_1", type: "payment.captured" });
  const t = 1_756_000_000;
  const header = makeSignatureHeader(body, t);
  assert.equal(verifyMooovWebhook(body, header, SECRET, t + 10), true);
});

test("webhook verification rejects a tampered body", () => {
  const t = 1_756_000_000;
  const header = makeSignatureHeader(JSON.stringify({ amount: 100 }), t);
  assert.equal(
    verifyMooovWebhook(
      JSON.stringify({ amount: 999999 }),
      header,
      SECRET,
      t + 10,
    ),
    false,
  );
});

test("webhook verification rejects a wrong secret", () => {
  const body = "{}";
  const t = 1_756_000_000;
  const header = makeSignatureHeader(body, t, "whsec_other");
  assert.equal(verifyMooovWebhook(body, header, SECRET, t + 10), false);
});

test("webhook verification rejects stale timestamps (replay window)", () => {
  const body = "{}";
  const t = 1_756_000_000;
  const header = makeSignatureHeader(body, t);
  assert.equal(verifyMooovWebhook(body, header, SECRET, t + 301), false);
  assert.equal(verifyMooovWebhook(body, header, SECRET, t + 299), true);
});

test("webhook verification rejects missing or malformed headers", () => {
  assert.equal(verifyMooovWebhook("{}", null, SECRET), false);
  assert.equal(verifyMooovWebhook("{}", "", SECRET), false);
  assert.equal(verifyMooovWebhook("{}", "v1=deadbeef", SECRET), false);
  assert.equal(
    verifyMooovWebhook("{}", "t=notanumber,v1=deadbeef", SECRET),
    false,
  );
});

test("payment ids are unique pay_-prefixed uuids", () => {
  const a = newMooovPaymentId();
  const b = newMooovPaymentId();
  assert.match(a, /^pay_[0-9a-f-]{36}$/);
  assert.notEqual(a, b);
});
