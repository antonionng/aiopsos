import type { Metadata } from "next";
import { withSiteShareImages } from "@/lib/social-image";
export const metadata: Metadata = withSiteShareImages({ title: "Find your team's learning priorities", description: "Explore your learning needs in AI, everyday technology and robotics. Complete a short check, then enter your details to unlock your priorities.", alternates: { canonical: "/assessment/start" }, robots: { index: true, follow: true } });
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
