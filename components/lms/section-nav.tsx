"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
export function LearningSectionNav() {
  const path = usePathname();
  const links = [
    ["/dashboard/programmes", "Programmes"],
    ["/dashboard/studio", "Courses"],
    ["/dashboard/cohorts", "Live delivery"],
    ["/dashboard/assessment", "Assess needs"],
  ];
  return (
    <nav className="lms-tabs" aria-label="Learning tools">
      {links.map(([href, label]) => (
        <Link
          key={href}
          href={href}
          aria-current={
            path === href || path.startsWith(href + "/") ? "page" : undefined
          }
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
