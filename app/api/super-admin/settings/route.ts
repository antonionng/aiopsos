import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

async function requireSuperAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabaseAdmin
    .from("user_profiles")
    .select("id, role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.role !== "super_admin") return null;
  return profile;
}

/** The knobs the billing portal may touch - nothing else in academy_settings. */
const EDITABLE_KEYS = new Set([
  "ai_credit_markup",
  "usd_to_gbp",
  "low_balance_threshold_credits",
  "invoice_bank_details",
]);

export async function GET() {
  const supabase = await createClient();
  const admin = await requireSuperAdmin(supabase);
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data } = await supabaseAdmin
    .from("academy_settings")
    .select("key, value, updated_at")
    .in("key", [...EDITABLE_KEYS]);

  return NextResponse.json({
    settings: Object.fromEntries((data ?? []).map((row) => [row.key, row.value])),
  });
}

export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const admin = await requireSuperAdmin(supabase);
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const entries = Object.entries(body).filter(([key]) => EDITABLE_KEYS.has(key));
  if (entries.length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  // The pricing knobs must stay sane: a fat-fingered markup of 0 would
  // sell credits at a loss silently.
  for (const [key, value] of entries) {
    if (key === "ai_credit_markup") {
      const n = Number(value);
      if (!Number.isFinite(n) || n < 1 || n > 20) {
        return NextResponse.json({ error: "ai_credit_markup must be between 1 and 20" }, { status: 400 });
      }
    }
    if (key === "usd_to_gbp") {
      const n = Number(value);
      if (!Number.isFinite(n) || n <= 0 || n > 5) {
        return NextResponse.json({ error: "usd_to_gbp must be between 0 and 5" }, { status: 400 });
      }
    }
    if (key === "low_balance_threshold_credits") {
      const n = Number(value);
      if (!Number.isInteger(n) || n < 0) {
        return NextResponse.json({ error: "low_balance_threshold_credits must be a non-negative integer" }, { status: 400 });
      }
    }
    if (key === "invoice_bank_details" && (typeof value !== "object" || value === null)) {
      return NextResponse.json({ error: "invoice_bank_details must be an object" }, { status: 400 });
    }
  }

  for (const [key, value] of entries) {
    const { error } = await supabaseAdmin.from("academy_settings").upsert({
      key,
      value,
      updated_at: new Date().toISOString(),
      updated_by: admin.id,
    });
    if (error) {
      return NextResponse.json({ error: `Failed to update ${key}` }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}
