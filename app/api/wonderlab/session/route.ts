import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  apiError,
  assertOrigin,
  readBody,
  parentUser,
  requireParent,
  issueSession,
  clearSession,
  db,
  WonderlabError,
} from "@/lib/wonderlab/server";
export async function POST(req: Request) {
  try {
    assertOrigin(req);
    const body = await readBody(req);
    if (body.action === "unlock") {
      const user = await parentUser();
      if (
        typeof body.password !== "string" ||
        body.password.length > 256 ||
        !user.email
      )
        throw new WonderlabError("Enter your parent account password.");
      const auth = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { auth: { persistSession: false, autoRefreshToken: false } },
      );
      const { data, error } = await auth.auth.signInWithPassword({
        email: user.email,
        password: body.password,
      });
      if (error || data.user?.id !== user.id)
        throw new WonderlabError(
          "The password was not recognised. Please try again.",
          401,
        );
      await auth.auth.signOut({ scope: "local" });
      await clearSession("parent");
      await clearSession("child");
      await issueSession("parent", user.id);
      return NextResponse.json({ ok: true });
    }
    if (body.action === "play") {
      const user = await requireParent();
      const { data: child, error } = await db
        .from("wonderlab_children")
        .select("id")
        .eq("id", body.childId)
        .eq("parent_id", user.id)
        .is("deletion_requested_at", null)
        .maybeSingle();
      if (error || !child)
        throw new WonderlabError("Choose one of your child profiles.", 404);
      await clearSession("child");
      await issueSession("child", user.id, child.id);
      await clearSession("parent");
      return NextResponse.json({ ok: true });
    }
    if (body.action === "lock") {
      await clearSession("parent");
      return NextResponse.json({ ok: true });
    }
    throw new WonderlabError("Unknown session action.");
  } catch (e) {
    return apiError(e);
  }
}
