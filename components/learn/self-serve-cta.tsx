import Link from "next/link";
import type { SelfServeCta } from "@/lib/self-serve/cross-links";

export function SelfServeCtaLine({ cta }: { cta: SelfServeCta }) {
  return (
    <p className="mt-4 max-w-2xl text-sm leading-relaxed">
      <Link href={cta.href} className="font-medium text-brand underline underline-offset-4 hover:text-foreground">
        {cta.linkText}
      </Link>
      {cta.alsoHref ? (
        <>
          {" "}
          <Link href={cta.alsoHref} className="text-muted-foreground underline underline-offset-4 hover:text-foreground">
            See the matching role page
          </Link>
        </>
      ) : null}
    </p>
  );
}
