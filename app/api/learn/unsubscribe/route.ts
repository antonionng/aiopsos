import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getPublicSiteUrl } from "@/lib/site";

/**
 * Stops course suggestions for every purchase on the same email address.
 * GET only shows a confirm button, because link scanners open every URL in
 * an email. POST is either that button or the one-click List-Unsubscribe call
 * that mail clients make without opening a page.
 */
const TOKEN = /^[a-f0-9]{48}$/;

async function optOut(token: string): Promise<boolean> {
  if (!TOKEN.test(token)) return false;
  const { data } = await supabaseAdmin
    .from("self_serve_purchases")
    .select("email")
    .eq("access_token", token)
    .maybeSingle();
  const email = (data?.email as string | null | undefined)?.trim();
  if (!email) return false;
  const { error } = await supabaseAdmin
    .from("self_serve_purchases")
    .update({ marketing_opt_out_at: new Date().toISOString() })
    .ilike("email", email.replace(/[\\%_]/g, (c) => `\\${c}`))
    .is("marketing_opt_out_at", null);
  if (error) console.error("[self-serve] unsubscribe", error);
  return !error;
}

type PageState = "confirm" | "done" | "missing";

function page(state: PageState, token = ""): NextResponse {
  const site = getPublicSiteUrl().replace(/\/$/, "");
  const heading = {
    confirm: "Stop course suggestions?",
    done: "Course suggestions stopped.",
    missing: "We could not find that link.",
  }[state];
  const body = {
    confirm:
      "We send one suggestion after each course you finish. Receipts and reminders about a course you have already bought are not affected.",
    done: "You will not receive further course suggestions from Experrt. Receipts and reminders about a course you have already bought are not affected.",
    missing: "The link may be incomplete. Email ag@experrt.com and we will stop the suggestions for you.",
  }[state];
  const action =
    state === "confirm"
      ? `<form method="post" action="${site}/api/learn/unsubscribe?t=${encodeURIComponent(token)}"><button type="submit" style="background:#E4F477;color:#201C29;font-size:14px;font-weight:600;padding:12px 28px;border:0;border-radius:8px;cursor:pointer">Stop suggestions</button></form>`
      : `<a href="${site}/learn/my-courses" style="display:inline-block;background:#E4F477;color:#201C29;font-size:14px;font-weight:600;padding:12px 28px;border-radius:8px;text-decoration:none">Open My courses</a>`;
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${heading} | Experrt</title></head>
<body style="margin:0;background:#201C29;color:#FFFEFA;font-family:-apple-system,BlinkMacSystemFont,Inter,'Segoe UI',sans-serif">
<main style="max-width:520px;margin:0 auto;padding:72px 24px">
<img src="${site}/experrt-logo.png" alt="Experrt" width="120" height="27" style="display:block;margin-bottom:36px">
<div style="height:4px;width:48px;background:#E4F477;border-radius:2px;margin-bottom:20px"></div>
<h1 style="font-size:28px;line-height:1.2;letter-spacing:-0.03em;margin:0 0 16px">${heading}</h1>
<p style="font-size:15px;line-height:1.6;color:#D5C7FF;margin:0 0 32px">${body}</p>
${action}
</main></body></html>`;
  return new NextResponse(html, {
    status: state === "missing" ? 404 : 200,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("t") ?? "";
  return page(TOKEN.test(token) ? "confirm" : "missing", token);
}

export async function POST(req: Request) {
  const token = new URL(req.url).searchParams.get("t") ?? "";
  const ok = await optOut(token);
  const oneClick = (await req.text().catch(() => "")).includes("List-Unsubscribe=One-Click");
  if (oneClick) return NextResponse.json({ ok }, { status: ok ? 200 : 404 });
  return page(ok ? "done" : "missing");
}
