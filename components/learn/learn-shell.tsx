import { SiteNav } from "@/components/site-nav";

/** Catalogue and sales pages. The lesson player does not use this. */
export function LearnMarket({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteNav />
      <div className="ex-learn ex-learn-under-nav">{children}</div>
    </>
  );
}

/** The course once someone has paid. One bar, the lesson bar, lives inside the room. */
export function LearnPlayer({ children }: { children: React.ReactNode }) {
  return <div className="ex-learn">{children}</div>;
}
