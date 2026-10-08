import Link from "next/link";
import { HR_COMPARE, ROLE_LINKS, otherRoleLinks } from "@/lib/self-serve/role-links";

export function CoursesByRole({ showHrCompare = false }: { showHrCompare?: boolean }) {
  return (
    <section className="ex-topic-faq" aria-labelledby="courses-by-role">
      <h2 id="courses-by-role">Courses by role</h2>
      <nav className="ss-filters" aria-label="Courses by role">
        {ROLE_LINKS.map((role) => (
          <Link key={role.path} href={role.path}>
            {role.label}
          </Link>
        ))}
      </nav>
      {showHrCompare ? (
        <p className="ex-land-faq-more">
          <Link href={HR_COMPARE.path}>{HR_COMPARE.label}</Link>
        </p>
      ) : null}
    </section>
  );
}

export function OtherRoles({ currentSlug }: { currentSlug: string }) {
  return (
    <section aria-labelledby="other-roles">
      <h2 id="other-roles">Other roles</h2>
      <ul className="ex-land-faq-more">
        {otherRoleLinks(currentSlug).map((role) => (
          <li key={role.path}>
            <Link href={role.path}>{role.label}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
