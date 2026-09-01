import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { blogRedirectMetadata } from "@/lib/public-share-metadata";

export const metadata: Metadata = blogRedirectMetadata();

/**
 * /blog used to hit the auth wall because middleware treated unknown paths
 * as private. It is public (see isPublicPath) so updateSession never 307s
 * crawlers to /login. next.config already 308s /blog → /insights; this
 * page is the in-app fallback. Metadata is Insights, not a login wall.
 */
export default function BlogRedirectPage() {
  redirect("/insights");
}
