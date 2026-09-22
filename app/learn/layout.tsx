import { notFound } from "next/navigation";
import { SiteNav } from "@/components/site-nav";
import { isSelfServeEnabled } from "@/lib/self-serve/flag";
import "./learn.css";

export const dynamic = "force-dynamic";

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  if (!isSelfServeEnabled()) notFound();
  return (
    <>
      <SiteNav />
      <div className="ex-learn ex-learn-under-nav">{children}</div>
    </>
  );
}
