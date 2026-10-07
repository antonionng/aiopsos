import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin as db } from "@/lib/supabase/admin";
import type { Child, Order } from "./types";
import { getMissionForVersion } from "./versions";
import { isEntitled } from "./engine";
export { db };
export class WonderlabError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}
export const hashToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");
export function assertOrigin(req: Request) {
  const origin = req.headers.get("origin");
  const expected = process.env.NEXT_PUBLIC_APP_URL;
  if (
    !origin ||
    (origin !== new URL(req.url).origin &&
      (!expected || origin !== new URL(expected).origin))
  )
    throw new WonderlabError("Please use Wonderlab to make this request.", 403);
}
export async function readBody(req: Request): Promise<Record<string, unknown>> {
  if (Number(req.headers.get("content-length") || 0) > 24000)
    throw new WonderlabError("This request is too large.", 413);
  const raw = await req.text();
  if (raw.length > 24000)
    throw new WonderlabError("This request is too large.", 413);
  try {
    const value = JSON.parse(raw);
    if (!value || typeof value !== "object" || Array.isArray(value))
      throw new Error();
    return value;
  } catch {
    throw new WonderlabError("Please check the details and try again.");
  }
}
export function apiError(error: unknown) {
  if (error instanceof WonderlabError)
    return NextResponse.json(
      { error: error.message },
      { status: error.status },
    );
  // Deliberately exclude payloads and database details from logs containing child data.
  console.error(
    "[wonderlab] request failed",
    error instanceof Error ? error.name : "unknown",
  );
  return NextResponse.json(
    {
      error:
        "Wonderlab could not complete this request. Your saved work is safe; please try again.",
    },
    { status: 503 },
  );
}
export async function parentUser() {
  const client = await createClient();
  const {
    data: { user },
    error,
  } = await client.auth.getUser();
  if (error || !user || user.is_anonymous)
    throw new WonderlabError("Please sign in with your parent account.", 401);
  return user;
}
export async function getSession(kind: "parent" | "child") {
  const jar = await cookies();
  const token = jar.get(`wonderlab_${kind}`)?.value;
  if (!token) return null;
  const { data, error } = await db
    .from("wonderlab_sessions")
    .select("*")
    .eq("token_hash", hashToken(token))
    .eq("kind", kind)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();
  if (error) throw error;
  return data;
}
export async function requireParent() {
  const user = await parentUser();
  const session = await getSession("parent");
  if (!session || session.parent_id !== user.id)
    throw new WonderlabError(
      "Please unlock the parent area with your password.",
      403,
    );
  return user;
}
export async function issueSession(
  kind: "parent" | "child",
  parentId: string,
  childId?: string,
) {
  const token = randomBytes(32).toString("hex");
  const seconds = kind === "parent" ? 900 : 43200;
  const { error } = await db.from("wonderlab_sessions").insert({
    token_hash: hashToken(token),
    kind,
    parent_id: parentId,
    child_id: childId ?? null,
    expires_at: new Date(Date.now() + seconds * 1000).toISOString(),
  });
  if (error) throw error;
  const jar = await cookies();
  jar.set(`wonderlab_${kind}`, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: seconds,
  });
}
export async function clearSession(kind: "parent" | "child") {
  const jar = await cookies();
  const token = jar.get(`wonderlab_${kind}`)?.value;
  if (token) {
    const { error } = await db
      .from("wonderlab_sessions")
      .delete()
      .eq("token_hash", hashToken(token));
    if (error) throw error;
  }
  jar.set(`wonderlab_${kind}`, "", { path: "/", maxAge: 0 });
  jar.set(`wonderlab_${kind}`, "", { path: "/wonderlab", maxAge: 0 });
}
export async function requireChild(): Promise<Child & { parent_id: string }> {
  const user = await parentUser();
  const session = await getSession("child");
  if (!session || session.parent_id !== user.id)
    throw new WonderlabError(
      "Ask your grown-up to open your mission map.",
      401,
    );
  const { data, error } = await db
    .from("wonderlab_children")
    .select("*")
    .eq("id", session.child_id)
    .eq("parent_id", session.parent_id)
    .is("deletion_requested_at", null)
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new WonderlabError("This profile is not available.", 403);
  return data;
}
export async function requireMission(slug: string) {
  const child = await requireChild();
  const { data: orders, error } = await db
    .from("wonderlab_orders")
    .select("*")
    .eq("child_id", child.id)
    .eq("parent_id", child.parent_id)
    .eq("mission_slug", slug)
    .order("expires_at", { ascending: false });
  if (error) throw error;
  const order = orders?.find((candidate) => isEntitled(candidate));
  if (!order || !isEntitled(order))
    throw new WonderlabError(
      "This mission is not currently open. Ask your grown-up to check your access.",
      403,
    );
  const mission = getMissionForVersion(slug, order.content_version);
  if (!mission)
    throw new WonderlabError(
      "Your lesson version needs restoring. Please contact Experrt.",
      409,
    );
  return { mission, child, order: order as Order };
}
