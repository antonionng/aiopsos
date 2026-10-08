import { NextResponse } from "next/server";
import { moderationSignature, verifyModeration } from "@/lib/self-serve/review-store";
import { getPublicSiteUrl } from "@/lib/site";
import { supabaseAdmin } from "@/lib/supabase/admin";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function page(title: string, body: string) {
  return new NextResponse(
    `<!doctype html><meta name="viewport" content="width=device-width"><title>${title}</title><body style="font-family:system-ui;max-width:520px;margin:64px auto;padding:0 20px;color:#201c29"><h1 style="font-size:22px">${title}</h1><p>${body}</p></body>`,
    { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } }
  );
}

/** One-click link from the owner's review alert. The HMAC is the credential. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id") ?? "";
  const action = url.searchParams.get("action") === "show" ? "show" : "hide";
  const sig = url.searchParams.get("sig") ?? "";
  if (!UUID.test(id) || !verifyModeration(id, action, sig)) {
    return page("Link not valid", "This moderation link is incomplete or has been changed.");
  }
  const { data, error } = await supabaseAdmin
    .from("self_serve_reviews")
    .update({ status: action === "hide" ? "hidden" : "published" })
    .eq("id", id)
    .select("course_slug")
    .maybeSingle();
  if (error || !data) return page("Review not found", "It may have been deleted by the learner.");

  const base = getPublicSiteUrl().replace(/\/$/, "");
  const other = action === "hide" ? "show" : "hide";
  const undo = `${base}/api/learn/review/moderate?id=${id}&action=${other}&sig=${moderationSignature(id, other)}`;
  return page(
    action === "hide" ? "Review hidden" : "Review published",
    `${action === "hide" ? "It no longer appears on the course page." : "It is back on the course page."} <a href="${undo}">${other === "show" ? "Publish it again" : "Hide it again"}</a> · <a href="${base}/learn/${data.course_slug}#reviews">Course page</a>`
  );
}
