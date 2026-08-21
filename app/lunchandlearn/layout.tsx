import Link from "next/link";
import { Wordmark } from "@/components/wordmark";

export const metadata = {
  title: "Lunch & Learn: Mastering AI",
  description: "Interactive AI presentation powered by live data and GPT-5.2",
};

export default function LunchAndLearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dark flex h-screen flex-col bg-[#0a0a0a] text-white overflow-hidden">
      <header className="flex h-14 shrink-0 items-center border-b border-white/10 bg-[#0a0a0a] px-6">
        <Link href="/" className="flex items-center" aria-label="Experrt home">
          <Wordmark size="md" />
        </Link>
      </header>
      <main className="min-h-0 flex-1">{children}</main>
    </div>
  );
}
