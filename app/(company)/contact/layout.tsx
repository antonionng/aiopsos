import type { Metadata } from "next";
import { withSiteShareImages } from "@/lib/social-image";
export const metadata: Metadata = withSiteShareImages({ title: "Discuss your project with Experrt", description: "Talk to Experrt about AI implementation, technology products, robotics, HR transformation, learning programmes and the Experrt platform.", alternates: { canonical: "/contact" } });
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
