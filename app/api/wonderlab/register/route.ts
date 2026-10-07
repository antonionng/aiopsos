import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  assertOrigin,
  readBody,
  apiError,
  WonderlabError,
} from "@/lib/wonderlab/server";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import {
  assessSubmission,
  HONEYPOT_FIELD,
  FORM_TIMESTAMP_FIELD,
} from "@/lib/spam-defence";
export async function POST(req: Request) {
  try {
    assertOrigin(req);
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (!rateLimit(`wonderlab-register:${ip}`, RATE_LIMITS.auth).success)
      throw new WonderlabError("Please wait before trying again.", 429);
    const b = await readBody(req);
    if (
      b.guardian !== true ||
      typeof b.email !== "string" ||
      b.email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email) ||
      typeof b.password !== "string" ||
      b.password.length < 12 ||
      b.password.length > 256
    )
      throw new WonderlabError(
        "Enter a valid parent email, a password of at least 12 characters and the guardian confirmation.",
      );
    const verdict = assessSubmission({
      name: "Wonderlab parent",
      message: "Family learning account",
      honeypot: b[HONEYPOT_FIELD],
      startedAt: b[FORM_TIMESTAMP_FIELD],
    });
    if (verdict.spam) return NextResponse.json({ confirmation: true });
    const origin = process.env.NEXT_PUBLIC_APP_URL ?? new URL(req.url).origin;
    const auth = await createClient();
    const { data, error } = await auth.auth.signUp({
      email: b.email.trim(),
      password: b.password,
      options: {
        emailRedirectTo: `${origin}/auth/callback?next=%2Fwonderlab%2Ffamily`,
        data: { name: "Wonderlab parent" },
      },
    });
    if (error)
      throw new WonderlabError(
        "The account could not be created. If you already have an Experrt account, sign in or reset your password.",
        400,
      );
    return NextResponse.json({ confirmation: !data.session });
  } catch (e) {
    return apiError(e);
  }
}
