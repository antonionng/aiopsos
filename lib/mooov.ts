import { createHash, createHmac, timingSafeEqual } from "crypto";

/**
 * Mooov.money ("Movere") client - the payment orchestrator fronting all
 * card payments (it routes to Stripe-hosted checkout downstream).
 *
 * Request signing, per docs.mooov.money: every request carries four
 * headers - key id, RFC3339 timestamp, an HMAC-SHA256 signature over
 * `method\npath\ntimestamp\nsha256(body)`, and an Idempotency-Key. For
 * payment creation the Idempotency-Key is our own payment_id, so a
 * network retry can never mint a second intent.
 *
 * Like lib/stripe.ts and lib/supabase/admin.ts, nothing here reads env at
 * module load - `next build` evaluates importing routes with no env set.
 */

const DEFAULT_BASE_URL = "https://api.mooov.money";

// Webhook timestamps older than this are rejected (replay window).
const WEBHOOK_TOLERANCE_SECONDS = 300;

type MooovConfig = {
  keyId: string;
  secret: string;
  baseUrl: string;
};

function getConfig(): MooovConfig {
  const keyId = process.env.MOOOV_API_KEY_ID;
  const secret = process.env.MOOOV_API_SECRET;
  if (!keyId || !secret) {
    throw new Error("Mooov is not configured. Set MOOOV_API_KEY_ID and MOOOV_API_SECRET.");
  }
  return { keyId, secret, baseUrl: process.env.MOOOV_BASE_URL ?? DEFAULT_BASE_URL };
}

export function signMooovRequest(
  secret: string,
  method: string,
  path: string,
  timestamp: string,
  rawBody: string
): string {
  const bodyHash = createHash("sha256").update(rawBody, "utf8").digest("hex");
  const payload = `${method.toUpperCase()}\n${path}\n${timestamp}\n${bodyHash}`;
  return createHmac("sha256", secret).update(payload, "utf8").digest("hex");
}

async function mooovRequest<T>(
  method: string,
  path: string,
  body: unknown,
  idempotencyKey: string
): Promise<T> {
  const config = getConfig();
  const rawBody = body === undefined ? "" : JSON.stringify(body);
  const timestamp = new Date().toISOString();

  const res = await fetch(`${config.baseUrl}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "Mooov-Key-Id": config.keyId,
      "Mooov-Timestamp": timestamp,
      "Mooov-Signature": signMooovRequest(config.secret, method, path, timestamp, rawBody),
      "Idempotency-Key": idempotencyKey,
    },
    body: rawBody || undefined,
  });

  if (!res.ok) {
    let detail = "";
    try {
      detail = await res.text();
    } catch {
      // response body unreadable; status alone will have to do
    }
    throw new Error(`Mooov ${method} ${path} failed (${res.status}): ${detail.slice(0, 500)}`);
  }

  return (await res.json()) as T;
}

export type MooovPaymentIntent = {
  payment_id: string;
  status: string;
  hosted_url?: string;
};

export async function createPaymentIntent(params: {
  paymentId: string;
  amount: number; // minor units
  currency: string;
  successUrl: string;
}): Promise<MooovPaymentIntent> {
  return mooovRequest<MooovPaymentIntent>(
    "POST",
    "/v1/payment_intents",
    {
      payment_id: params.paymentId,
      amount: params.amount,
      currency: params.currency,
      flow: "redirect",
      success_url: params.successUrl,
    },
    params.paymentId
  );
}

export async function refundPayment(paymentId: string, amount?: number) {
  return mooovRequest<MooovPaymentIntent>(
    "POST",
    `/v1/payment_intents/${paymentId}/refund`,
    amount === undefined ? {} : { amount },
    `refund_${paymentId}`
  );
}

/**
 * Verify `X-Mooov-Signature: t=<unix>,v1=<hex>` - HMAC-SHA256 over
 * `<t>.<raw body>`. Constant-time compare; stale timestamps rejected.
 */
export function verifyMooovWebhook(
  rawBody: string,
  signatureHeader: string | null,
  secret: string,
  nowSeconds: number = Math.floor(Date.now() / 1000)
): boolean {
  if (!signatureHeader) return false;

  const parts = new Map(
    signatureHeader.split(",").map((part) => {
      const idx = part.indexOf("=");
      return [part.slice(0, idx).trim(), part.slice(idx + 1).trim()] as const;
    })
  );
  const t = parts.get("t");
  const v1 = parts.get("v1");
  if (!t || !v1 || !/^\d+$/.test(t)) return false;

  if (Math.abs(nowSeconds - Number(t)) > WEBHOOK_TOLERANCE_SECONDS) return false;

  const expected = createHmac("sha256", secret)
    .update(`${t}.${rawBody}`, "utf8")
    .digest("hex");

  const a = Buffer.from(v1, "utf8");
  const b = Buffer.from(expected, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

export function getMooovWebhookSecret(): string {
  const secret = process.env.MOOOV_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error("MOOOV_WEBHOOK_SECRET is not set");
  }
  return secret;
}

export function newMooovPaymentId(): string {
  return `pay_${crypto.randomUUID()}`;
}
