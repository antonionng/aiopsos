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

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://experrt.com";

/** The provider, referenced by every Course node via @id. */
export const ORGANISATION_LD = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "@id": `${BASE_URL}/#organisation`,
  name: "Experrt",
  url: BASE_URL,
  logo: `${BASE_URL}/experrt-logo.png`,
  description:
    "A training academy for applied AI, technology and robotics. Courses are facilitated live by a trainer, in person or online.",
  knowsAbout: [
    "Applied artificial intelligence",
    "AI literacy for the workforce",
    "Technology adoption",
    "Applied robotics",
    "EU AI Act Article 4",
  ],
};

export function courseLd(course: {
  slug: string;
  title: string;
  summary: string;
  level: string;
  duration_hours: number;
  delivery_modes: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `${BASE_URL}/courses/${course.slug}`,
    url: `${BASE_URL}/courses/${course.slug}`,
    name: course.title,
    description: course.summary,
    educationalLevel: course.level,
    provider: { "@id": `${BASE_URL}/#organisation` },
    // Every course is facilitated live, which is the distinction worth
    // encoding: "blended" and "onsite" are the schema.org values a search
    // engine understands, and neither of them means self-paced video.
    hasCourseInstance: course.delivery_modes.map((mode) => ({
      "@type": "CourseInstance",
      courseMode:
        mode === "virtual" ? "online" : mode === "blended" ? "blended" : "onsite",
      courseWorkload: `PT${course.duration_hours}H`,
    })),
  };
}
