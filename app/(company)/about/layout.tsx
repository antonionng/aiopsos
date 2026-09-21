import type { Metadata } from "next";
import { withSiteShareImages } from "@/lib/social-image";
export const metadata: Metadata = withSiteShareImages({ title: "About Experrt", description: "Meet Experrt: a learning platform for curious people, training providers and ambitious teams. Human curiosity, expert knowledge and practical progress.", alternates: { canonical: "/about" } });
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
