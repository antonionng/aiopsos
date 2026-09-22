import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isSelfServeEnabled } from "@/lib/self-serve/flag";
import "./learn.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Self-serve courses",
  robots: { index: false, follow: false },
};

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  if (!isSelfServeEnabled()) notFound();
  return <div className="ex-learn">{children}</div>;
}
