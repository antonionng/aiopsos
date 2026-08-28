import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { blogRedirectMetadata } from "@/lib/public-share-metadata";

export const metadata: Metadata = blogRedirectMetadata();

/**
 * /blog used to hit the auth wall because middleware treated unknown paths
 * as private. Published editorial lives at /insights. Send humans and
 * crawlers there rather than to /login.
 */
export default function BlogRedirectPage() {
  redirect("/insights");
}
