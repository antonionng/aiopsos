import { NextResponse } from "next/server";
import { resolveUserContext } from "@/lib/resolve-user-context";
import { checkFeatureQuota, logFeatureUsage } from "@/lib/feature-quotas";
import { getPlanFeatures } from "@/lib/constants";
import { searchWeb } from "@/lib/tavily";

export async function POST(req: Request) {
  const ctx = await resolveUserContext();
  if (!ctx) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!getPlanFeatures(ctx.plan).webSearch) {
    return NextResponse.json(
      { error: "Web search requires a Pro or Enterprise plan." },
      { status: 403 }
    );
  }

  const { query } = await req.json();
  if (!query || typeof query !== "string") {
    return NextResponse.json({ error: "query is required" }, { status: 400 });
  }

  const quota = await checkFeatureQuota(ctx.orgId, "web_search", ctx.plan, ctx.seatCount, ctx.userId);
  if (quota.requiresUpgrade) {
    return NextResponse.json(
      { error: "Web search is not available on your plan." },
      { status: 403 }
    );
  }

  try {
    const searchResponse = await searchWeb(query);

    await logFeatureUsage(ctx.orgId, ctx.userId, "web_search", 1, {
      query,
      result_count: searchResponse.results.length,
    });

    return NextResponse.json({
      results: searchResponse.results,
      query: searchResponse.query,
      overage: quota.isOverage,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Search failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
