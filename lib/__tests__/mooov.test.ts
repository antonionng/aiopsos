import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash, createHmac } from "node:crypto";
import {
  signMooovRequest,
  verifyMooovWebhook,
  newMooovPaymentId,
} from "../mooov.ts";

const SECRET = "whsec_test_secret";

function makeSignatureHeader(body: string, t: number, secret = SECRET) {
  const v1 = createHmac("sha256", secret).update(`${t}.${body}`, "utf8").digest("hex");
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
  const signature = signMooovRequest(SECRET, "post", "/v1/payment_intents", timestamp, body);

  const bodyHash = createHash("sha256").update(body, "utf8").digest("hex");
  const expected = createHmac("sha256", SECRET)
    .update(`POST\n/v1/payment_intents\n${timestamp}\n${bodyHash}`, "utf8")
    .digest("hex");

  assert.equal(signature, expected);
  // A different body must produce a different signature.
  assert.notEqual(
    signMooovRequest(SECRET, "post", "/v1/payment_intents", timestamp, "{}"),
    signature
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
    verifyMooovWebhook(JSON.stringify({ amount: 999999 }), header, SECRET, t + 10),
    false
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
  assert.equal(verifyMooovWebhook("{}", "t=notanumber,v1=deadbeef", SECRET), false);
});

test("payment ids are unique pay_-prefixed uuids", () => {
  const a = newMooovPaymentId();
  const b = newMooovPaymentId();
  assert.match(a, /^pay_[0-9a-f-]{36}$/);
  assert.notEqual(a, b);
});
