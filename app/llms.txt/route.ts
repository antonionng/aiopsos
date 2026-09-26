import { llmsTxt } from "@/lib/llms";
import { getPublicSiteUrl } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  return new Response(llmsTxt(getPublicSiteUrl()), {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
