import { notFound } from "next/navigation";
import { isSelfServeEnabled } from "@/lib/self-serve/flag";

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  if (!isSelfServeEnabled()) notFound();
  return children;
}
