import { SiteNav } from "@/components/site-nav";
import { PublicSiteFooter } from "@/components/public/site-footer";

import "./academy.css";

export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="academy flex min-h-screen flex-col">
      <SiteNav />
      <a href="#academy-content" className="academy-skip">Skip to courses</a>
      <main id="academy-content" className="academy-main">
        {children}
      </main>
      <PublicSiteFooter />
    </div>
  );
}
