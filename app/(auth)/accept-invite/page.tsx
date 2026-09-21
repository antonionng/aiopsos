import type { Metadata } from "next";
import { AcceptInvite } from "@/components/accept-invite";
import { withSiteShareImages } from "@/lib/social-image";
export const metadata: Metadata = withSiteShareImages({
  title: "Accept your invitation",
  robots: { index: false, follow: false },
  referrer: "no-referrer" as const,
});
export default function AcceptInvitePage() { return <AcceptInvite />; }
