import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Insights",
  robots: { index: false, follow: true },
  alternates: { canonical: "/insights" },
};

/**
 * /blog used to hit the auth wall because middleware treated unknown paths
 * as private. Published editorial lives at /insights. Send humans and
 * crawlers there rather than to /login.
 */
export default function BlogRedirectPage() {
  redirect("/insights");
}
