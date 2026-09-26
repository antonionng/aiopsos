import { randomBytes } from "node:crypto";
import { getSelfServeCourse } from "./catalog.ts";

export const ACCESS_COOKIE = "experrt_learn_access";
export const SELF_SERVE_PURPOSE = "self_serve_course";

const REF_ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

export function courseAmountPence(priceGbp: number): number {
  return Math.round(priceGbp * 100);
}

export function isSelfServeCheckout(metadata: Record<string, string> | null | undefined): boolean {
  return metadata?.purpose === SELF_SERVE_PURPOSE;
}

export function playablePaidCourse(slug: string) {
  const course = getSelfServeCourse(slug);
  if (!course?.playable) return undefined;
  return course;
}

export function checkoutOrigin(req: Request): string {
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  const proto = req.headers.get("x-forwarded-proto") ?? "https";
  if (host) return `${proto.split(",")[0]}://${host.split(",")[0]}`.replace(/\/$/, "");
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, "");
  return configured || "http://localhost:3000";
}

export function newAccessToken(): string {
  return randomBytes(24).toString("hex");
}

export function newCertificateRef(): string {
  const bytes = randomBytes(10);
  let ref = "EX";
  for (const byte of bytes) {
    ref += REF_ALPHABET[byte % 32];
  }
  return ref;
}

export function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 400,
  };
}
