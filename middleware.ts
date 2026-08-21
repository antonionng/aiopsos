import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  // robots.txt and sitemap.xml are excluded here rather than allow-listed in
  // updateSession: they are crawler-facing files that must never touch the
  // auth path. Left in, the session check 307s them to /login and every
  // search engine is told the site has no sitemap and no crawl rules.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots\\.txt|sitemap\\.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
