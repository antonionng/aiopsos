import { getPublishedInsights } from "./insights/catalog.ts";
import { courseArtefact } from "./self-serve/engine.ts";
import { courseStats, formatCourseHours } from "./self-serve/landing.ts";
import { COURSE_SALES } from "./self-serve/sales-copy.ts";
import { TOPIC_HUBS, courseFaqs, hubCourses } from "./self-serve/seo.ts";
import type { SelfServeCourse } from "./self-serve/types.ts";

const ABOUT = [
  "Experrt is a UK learning company for applied AI, everyday technology, robotics and automation, and AI in HR. It offers self-paced online courses for individuals, trainer-led courses for teams through the Experrt Academy, an AI learning management system (AI LMS) with a learning agent for organisations and training providers, and implementation work through Experrt AI Labs.",
  "Every self-paced course teaches one professional skill through written lessons, worked examples, practice with immediate feedback, and a scenario assessment with a pass mark. Learners finish with a piece of work built from their own job, which they sign. The signed record can be verified online and downloaded as a PDF. Records state what was completed and do not claim compliance with any regulation.",
];

function courseLine(base: string, course: SelfServeCourse): string {
  return `- [${course.title}](${base}/learn/${course.slug}): ${course.promise} (£${course.priceGbp}, ${formatCourseHours(course.hours)}, self-paced online)`;
}

export function llmsTxt(base: string): string {
  const lines = [
    "# Experrt",
    "",
    `> ${ABOUT[0]}`,
    "",
    ABOUT[1],
    "",
    "## Self-paced courses",
    "",
    `- [All self-paced courses](${base}/learn): the full catalogue of forty courses.`,
    ...TOPIC_HUBS.map((hub) => `- [${hub.title}](${base}/learn/topics/${hub.slug}): ${hub.description}`),
    "",
  ];
  for (const hub of TOPIC_HUBS) {
    lines.push(`### ${hub.title}`, "", ...hubCourses(hub).map((course) => courseLine(base, course)), "");
  }
  lines.push(
    "## Organisations and teams",
    "",
    `- [Experrt Academy, trainer-led courses](${base}/courses): courses for teams, delivered by a trainer in person or online.`,
    `- [AI LMS and learning agent](${base}/learning-agent): an agentic learning platform for organisations and training providers.`,
    `- [Experrt AI Labs](${base}/ai-labs): consulting and implementation for AI, technology, robotics, and HR transformation.`,
    `- [Case studies](${base}/case-studies)`,
    `- [Contact](${base}/contact)`,
    "",
    "## Insights",
    "",
    ...getPublishedInsights().map(
      (article) => `- [${article.title}](${base}/insights/${article.slug}): ${article.description}`
    ),
    "",
    "## Optional",
    "",
    `- [Full course details for language models](${base}/llms-full.txt): every course with its overview, audience, lessons, assessment, certificate, and answers to common questions.`,
    `- [About Experrt](${base}/about)`,
    ""
  );
  return lines.join("\n");
}

function courseBlock(base: string, course: SelfServeCourse): string[] {
  const sales = COURSE_SALES[course.slug];
  const artefact = courseArtefact(course);
  const lines = [
    `## ${course.title}`,
    "",
    `URL: ${base}/learn/${course.slug}`,
    `Price: £${course.priceGbp}, one payment by card. Access begins when payment is confirmed.`,
    `Length: ${formatCourseHours(course.hours)}, self-paced online, in English.`,
    artefact ? `Final work: ${artefact.title}, signed by the learner and verifiable online.` : "",
    "",
    course.promise,
    "",
  ];
  if (sales) {
    lines.push(...sales.overview, "");
    if (sales.audience.length) lines.push("Who it is for:", ...sales.audience.map((item) => `- ${item}`), "");
    if (sales.takeaways.length) lines.push("What learners take away:", ...sales.takeaways.map((item) => `- ${item}`), "");
  }
  const lessons = course.lessons ?? [];
  if (lessons.length) {
    lines.push("Lessons:");
    lessons.forEach((lesson, index) => {
      const summary = sales?.lessons[lesson.id];
      lines.push(`${index + 1}. ${lesson.title}${summary ? `: ${summary}` : ""}`);
    });
    lines.push("");
  }
  const stats = courseStats(course);
  if (stats.length) {
    lines.push("Market context:", ...stats.map((stat) => `- ${stat.value} ${stat.line} Source: ${stat.source}, ${stat.href}`), "");
  }
  lines.push("Questions:", ...courseFaqs(course).flatMap((faq) => [`Q: ${faq.question}`, `A: ${faq.answer}`]), "");
  return lines.filter((line, index, all) => !(line === "" && all[index - 1] === ""));
}

export function llmsFullTxt(base: string): string {
  const lines = ["# Experrt: full course details", "", ...ABOUT.flatMap((p) => [p, ""])];
  for (const hub of TOPIC_HUBS) {
    lines.push(`# ${hub.title}`, "", ...hub.intro.flatMap((p) => [p, ""]));
    for (const course of hubCourses(hub)) lines.push(...courseBlock(base, course));
  }
  return lines.join("\n");
}
