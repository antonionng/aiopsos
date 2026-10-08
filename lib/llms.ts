import { getPublishedInsights } from "./insights/catalog.ts";
import { courseArtefact } from "./self-serve/engine.ts";
import { courseStats, formatCourseHours } from "./self-serve/landing.ts";
import { COURSE_SALES } from "./self-serve/sales-copy.ts";
import { TOPIC_HUBS, courseFaqs, hubCourses } from "./self-serve/seo.ts";
import type { SelfServeCourse } from "./self-serve/types.ts";
import { agentMarketingCourses } from "./always-on-agents/marketing.ts";
import { agentCourseFaqs } from "./always-on-agents/seo.ts";
import { AGENT_COURSE_PRICE_GBP } from "./always-on-agents/catalogue.ts";

const ABOUT = [
  "Experrt teaches applied AI, everyday technology, robotics and automation, and AI in HR. It offers forty self-paced professional-skills courses and thirteen always-on AI agent courses for individuals, trainer-led courses for teams through the Experrt Academy, an AI learning management system (AI LMS) with a learning agent for organisations and training providers, and implementation work through Experrt AI Labs.",
  "The forty professional-skills courses include lessons, worked examples, practice with feedback, scenario assessments and final work signed by the learner. The thirteen agent courses include six illustrated modules and a practical project assessed by AI against six skill areas. An agent-course certificate requires at least 3 out of 4 in every skill. The certificate states the assessment method and its limits. Neither course format is an externally accredited qualification or proof of regulatory compliance. Purchases include twelve months of access; platform subscriptions are separate.",
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
    "## Always-on AI agent courses",
    "",
    `- [All AI agent courses](${base}/courses/agents): thirteen illustrated courses with practical projects, AI assessment and a certificate after passing.`,
    ...agentMarketingCourses.map(course => `- [${course.title}](${base}${course.href}): ${course.summary} (£${AGENT_COURSE_PRICE_GBP}, six modules, self-paced online)`),
    `- [Free Foundations sample](${base}/courses/always-on-agents-preview): introductory practice lessons, not the complete purchased course or an assessment certificate.`,
    `- [Course purchase terms](${base}/course-terms): read the access, cancellation and refund arrangements before purchase.`,
    "",
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
  lines.push("# Always-on AI agent courses", "", "These summaries describe public course outlines. Paid lessons, learner submissions and individual assessment reports are not included. Check the course page for current availability before buying.", "");
  for (const course of agentMarketingCourses) {
    lines.push(`## ${course.title}`, "", `URL: ${base}${course.href}`, `Price: £${AGENT_COURSE_PRICE_GBP} GBP, one payment through Stripe. Sign in or create an Experrt account to buy.`, "Format: six modules, self-paced online, English. Includes 12 months of access after payment confirmation.", "", course.summary, "", "What the modules cover:", ...course.modules.map((module, index) => `${index + 1}. ${module.title}. What you will make or keep: ${module.evidence}.`), "", "Questions:", ...agentCourseFaqs(course).flatMap(faq => [`Q: ${faq.question}`, `A: ${faq.answer}`]), "");
  }
  for (const hub of TOPIC_HUBS) {
    lines.push(`# ${hub.title}`, "", ...hub.intro.flatMap((p) => [p, ""]));
    for (const course of hubCourses(hub)) lines.push(...courseBlock(base, course));
  }
  return lines.join("\n");
}
