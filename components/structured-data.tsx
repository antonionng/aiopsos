export {
  ORGANISATION_LD,
  articleLd,
  courseLd,
  educationalOccupationalProgramLd,
  faqPageLd,
  webPageLd,
} from "@/lib/json-ld";
export type { FaqItem } from "@/lib/json-ld";

/**
 * JSON-LD structured data.
 *
 * Rendered as a plain script tag rather than through next/script, because
 * search crawlers need it present in the server-rendered HTML rather than
 * injected later.
 *
 * The payload is our own, built from database values — never user-supplied
 * markup — so serialising it is safe. `<` is escaped anyway so a stray
 * sequence in a course title cannot close the script element early.
 */
export function StructuredData({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
