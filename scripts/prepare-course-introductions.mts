import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { agentMarketingCourses } from "../lib/always-on-agents/marketing.ts";
import { AGENT_COURSE_VERSION } from "../lib/always-on-agents/courses.ts";
import { SELF_SERVE_COURSES } from "../lib/self-serve/catalog.ts";
import { courseCurriculum, getCourseLanding } from "../lib/self-serve/landing.ts";
import { courseArtefact } from "../lib/self-serve/engine.ts";

const folder = "docs/course-introductions";
await mkdir(`${folder}/sources`, { recursive: true });
await mkdir("lib/course-introductions", { recursive: true });
const lower = (text: string) => text.charAt(0).toLowerCase() + text.slice(1);
const agentBenefits: Record<string, string> = {
  "always-on-agent-foundations": "You can use your project to show a manager or client how you explain a regular task, check an agent’s results and keep important decisions with a person.",
  "working-with-openai-dots": "You can use your project briefing to show how you give ongoing research a clear purpose, check its sources and decide which changes deserve a colleague’s attention.",
  "working-with-grok-bot": "You can show how you turn monitoring into a briefing someone can check, including where the findings came from and what you did when information was missing.",
  "working-with-meta-muse": "You can explain how you organise a changing week while keeping responsibility for bookings and other decisions that affect people.",
  "working-with-claude-cowork": "You can demonstrate a repeatable approach to preparing a briefing from files, checking its facts and recovering when a regular task misses a run.",
  "business-agents-copilot-studio": "You can discuss a business request process with colleagues or a project team using a working example, clear approval steps and records of your checks.",
  "running-your-own-agent-openclaw": "You can show how you set limits for an agent you run, check its access and restore a task after a problem, while recording what still needs testing.",
  "managing-agents-reliably": "You can show a team how you check ongoing work, recognise a failure and recover without repeating actions that already happened.",
  "agents-small-business-operations": "You can explain a practical business workflow to an owner or colleague, including which steps an agent prepares and which decisions stay with a person.",
  "agent-research-market-monitoring": "You can present a source-checked briefing and explain why a change matters, which helps colleagues judge findings rather than rely on a confident summary.",
  "content-operations-agents": "You can demonstrate a content workflow with checked facts, clear draft ownership and an approval step before anything is published.",
  "agents-for-developers": "You can show how you define a small coding task, inspect an agent’s changes and use test results to explain whether the work is ready for review.",
  "coordinating-multiple-agents": "You can explain how several agents share a task, where you check their handovers and who remains responsible for the final result.",
};

type Intro = {
  slug: string; title: string; family: "agent" | "self-paced";
  href: string; image: string; audience: string;
  learn: string; project: string; benefit: string; assessment: string;
};
const introductions: Intro[] = [];
const jobs: Record<string, unknown>[] = [];
let previous: { courses?: Record<string, unknown>[] } = {};
try { previous = JSON.parse(await readFile(`${folder}/production.json`, "utf8")); } catch (error) {
  if (!(error instanceof Error && "code" in error && error.code === "ENOENT")) throw error;
}

async function save(intro: Intro, source: string, version: string) {
  const file = `${folder}/sources/${intro.slug}.md`;
  const hash = createHash("sha256").update(source).digest("hex");
  const old = previous.courses?.find(c => c.slug === intro.slug);
  if (old && old.sourceSha256 !== hash && old.status !== "script-ready") {
    throw new Error(`Source changed after production began for ${intro.slug}. Review the version before replacing it.`);
  }
  await writeFile(file, source);
  introductions.push(intro);
  jobs.push({ ...old, slug: intro.slug, family: intro.family, courseVersion: version, source: file, sourceSha256: hash,
    prompt: old?.notebookUrl ? old.prompt : `${folder}/video-generation-prompt.md`, targetSeconds: [180, 240],
    status: old?.status ?? "script-ready" });
}

for (const course of agentMarketingCourses) {
  const intro: Intro = {
    slug: course.slug, title: course.title, family: "agent", href: course.href, image: course.image,
    audience: course.audience, learn: course.summary, project: course.capstone,
    benefit: agentBenefits[course.slug],
    assessment: "Submit your written project evidence for AI assessment. You receive feedback and can revise your work. An Experrt certificate is awarded after you pass all six required skill areas.",
  };
  const source = course.slug === "always-on-agent-foundations"
    ? await readFile(`${folder}/foundations-introduction-source.md`, "utf8")
    : `# ${course.title} | Course introduction

Course version: ${AGENT_COURSE_VERSION}. This is a public introduction to this specific course, not a lesson or a promise of career outcomes.

## Who the course is for and what it helps you do

Welcome to Experrt Academy. ${course.audience} In this course, you will learn to ${lower(course.summary).replace(/\.$/, "")}.

An AI agent is software that works through an agreed task using the information and tools it is allowed to access. Its actual capabilities depend on the product, account and setup you use. You remain responsible for setting limits and checking results. Do not claim that a product has been independently tested on the learner’s account.

## What the six modules cover

${course.modules.map((m, i) => `${i + 1}. ${m.title}. The practical work you keep is: ${m.evidence}.`).join("\n")}

Explain this learning journey in connected trainer language rather than reading a list of labels.

## How you learn and what you will produce

You study at your own pace using illustrated explanations, worked examples, practice questions with feedback and practical exercises. Your account saves your notes. Supplied fictional practice files and a workbook help you keep a record of your choices and checks. Any organisation named in the supplied practice work is fictional; no measured business results are claimed.

Your final practical project: ${course.capstone} Keep the instructions, relevant settings, results and checks that explain what happened. Where a product step cannot be completed, label your work as a practice simulation and say what still needs testing in the actual product.

## Assessment and the certificate

${intro.assessment} Each required area needs a score of at least three out of four. The AI assessor checks submitted text; it cannot operate an account, open external links or independently verify authorship. Your certificate records AI assessment and is not an externally accredited qualification. Watching this introduction or completing practice alone does not earn it.

## How this can help in your work and career conversations

${intro.benefit} Your project gives you a practical example to discuss with a manager, client or prospective employer. Explain the skills you demonstrated and where they apply; do not claim that completion guarantees a job, promotion, salary increase or fixed time savings.

## What you need and the next step

${course.prerequisites} Any required product account, subscription or licence is separate from the course fee. The course costs £99 and includes 12 months of access; the page shows current availability and the full purchase terms. Read the course outline and account requirements, then decide whether this is the right next step for you.
`;
  await save(intro, source, AGENT_COURSE_VERSION);
}

for (const course of SELF_SERVE_COURSES) {
  const landing = getCourseLanding(course);
  const curriculum = courseCurriculum(course);
  const artefact = courseArtefact(course);
  const assessment = course.lessons?.find(l => l.check.kind === "scenario")?.check;
  if (!artefact || assessment?.kind !== "scenario") throw new Error(`Missing assessment facts: ${course.slug}`);
  const intro: Intro = {
    slug: course.slug, title: course.title, family: "self-paced", href: `/learn/${course.slug}`,
    image: `/courses/always-on-agents/${course.track === "robotics" ? "operations-cover.png" : course.track === "hr" ? "teamwork-cover.png" : course.track === "technology" ? "northstar-planning.png" : "northstar-review.png"}`,
    audience: landing.audience[0], learn: landing.takeaways[0],
    project: `Produce ${lower(artefact.title)}. ${artefact.recordLine}`,
    benefit: `You can use ${lower(artefact.title)} to explain the method you used, the decisions you made and the work you checked when discussing this skill with a colleague, manager or prospective employer.`,
    assessment: "Pass the lesson checks and the course’s scenario assessment, complete your final practical document and sign your record to receive an Experrt certificate.",
  };
  const source = `# ${course.title} | Course introduction

This source describes the existing self-paced course at ${intro.href}. It is a course introduction, not a lesson or a promise of career outcomes.

## Who this course is for

Welcome to Experrt Academy. This course is for people whose work matches these situations:
${landing.audience.slice(0, 2).map(t => `- ${t}`).join("\n")}

## What you will practise

The course teaches these practical skills. Describe the skills as things the learner will practise, rather than guaranteeing a business result:
${landing.takeaways.slice(0, 4).map(t => `- ${t}`).join("\n")}

The learning sequence includes:
${curriculum.filter(c => c.kind === "lesson").map(c => `- ${c.title}${c.summary ? `: ${c.summary}` : ""}`).join("\n")}

Explain any specialist term in plain language when it is first used. For example, a source is the document or record you check against, a brief is a set of instructions, and a workflow is the steps of a task. Do not add technical capabilities or legal requirements not taught in the source. For regulation and safety topics, this introduction describes training, not legal advice, proof of compliance or permission to operate machinery.

## The learning experience and the work you will keep

The course is self-paced, with an estimated ${course.hours} hours of study. Each lesson explains part of the method, works through a realistic example and asks you to check a new situation. Feedback helps you understand your answer. Progress is saved to your account.

The final practical document is ${lower(artefact.title)}. The course record describes that work as: ${artefact.recordLine} Use a suitable task from your own work while following your organisation’s rules for information and tools. The document gives you something concrete to explain rather than simply listing a tool you have tried.

## Assessment and the certificate

${intro.assessment} This course’s scenario assessment has ${assessment.questions.length} questions; you need ${assessment.passMark ?? assessment.questions.length} correct answers to pass it. The Experrt certificate has a verifiable record and a downloadable PDF. This is not an externally accredited qualification. The final document is not independently assessed by a human reviewer. Do not describe this course as using the agent series’ AI project assessor or six-area rubric.

## How these skills can help at work

${intro.benefit} You can explain what you did and what still needs checking. These are practical learning benefits, not a promise of employment, promotion, salary, fixed time savings or a measured business result. Do not add salary figures, market statistics, job titles unrelated to the audience, accreditation or testimonials.

## Price, access and choosing your next step

The course costs £${course.priceGbp}, paid once, and includes 12 months of access after payment is confirmed. Separate software accounts, licences or subscriptions are not included. Read the outline, assessment details and purchase terms on the page before deciding whether this course fits your work and goals. Watching this introduction does not complete the course or earn a certificate.
`;
  await save(intro, source, createHash("sha256").update(JSON.stringify(course.lessons)).digest("hex").slice(0, 12));
}

await writeFile("lib/course-introductions/catalogue.json", JSON.stringify(introductions, null, 2) + "\n");
await writeFile(`${folder}/production.json`, JSON.stringify({ ...previous, createdAt: "2026-10-03", provider: "Google Notebook web interface", accountAlreadyHasPro: true, paidUpgradeAuthorised: false, prompt: `${folder}/video-generation-prompt.md`, courses: jobs }, null, 2) + "\n");
console.log(`Prepared ${introductions.length} course-specific introductions: ${agentMarketingCourses.length} agent and ${SELF_SERVE_COURSES.length} self-paced.`);
