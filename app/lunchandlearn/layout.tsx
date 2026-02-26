import Image from "next/image";
import Link from "next/link";

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
        <Link href="/" className="flex items-center" aria-label="AIOPSOS home">
          <Image
            src="/logo.png"
            alt="AIOPSOS"
            width={100}
            height={40}
            className="h-8 w-auto"
            unoptimized
          />
        </Link>
      </header>
      <main className="min-h-0 flex-1">{children}</main>
    </div>
  );
}
