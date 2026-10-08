import { createHash } from "node:crypto";
import { agentCourseBlueprints } from "./catalogue.ts";
import { courseCases } from "./content/cases.ts";
import { units } from "./content/units.ts";
import { teaching } from "./content/teaching.ts";
import { walkthroughs } from "./content/walkthroughs.ts";
import {
  workbook,
  assessmentGuide,
  reviewerGuide,
} from "./content/resources.ts";
import {
  courseContentSchema,
  type Activity,
  type CourseContent,
  type LearningMaterial,
} from "../lms/schema.ts";

export const AGENT_COURSE_VERSION = "2026.10.2-ai-assessed";
function uuid(key: string) {
  const hex = createHash("sha256")
    .update("experrt-agents:" + AGENT_COURSE_VERSION + ":" + key)
    .digest("hex")
    .slice(0, 32);
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-5${hex.slice(13, 16)}-a${hex.slice(17, 20)}-${hex.slice(20)}`;
}
function material(
  slug: string,
  title: string,
  kind: LearningMaterial["kind"],
  content: string,
): LearningMaterial {
  return { id: uuid(slug + ":material:" + title), title, kind, content };
}
export function getAgentCoursePack(slug: string) {
  const blueprint = agentCourseBlueprints.find((c) => c.slug === slug);
  if (!blueprint) return null;
  const study = courseCases[slug];
  const authored = units[slug];
  if (!study || authored?.length !== 6)
    throw new Error("Incomplete course: " + slug);
  const resources = [
    material(slug, "Fictional practice files", "handout", study.starter),
    material(slug, "Your task workbook", "worksheet", workbook),
    material(slug, "Practical assessment guide", "checklist", assessmentGuide),
    material(slug, "Course lab walkthrough", "lab_guide", walkthroughs[slug]),
  ];
  const activities: Activity[] = [];
  const modules = authored.map((unit, index) => {
    const chapter = teaching[unit.chapter];
    if (!chapter) throw new Error("Unknown teaching chapter: " + unit.chapter);
    const final = index === 5;
    const title = blueprint.modules[index].title;
    const stages = [
      {
        title: "Learn the basics",
        kind: "lesson" as const,
        minutes: 10,
        content: `## ${title}\n\n${unit.focus}\n\n![${chapter.visual.join("; ")}](${chapter.image})\n\n### ${chapter.title}\n\n${chapter.explanation}`,
      },
      {
        title: "Plan your own task",
        kind: "lesson" as const,
        minutes: 10,
        content: `## Planning your task\n\n${chapter.method}\n\n### In this practice example\n\n${unit.focus}\n\nBefore continuing, locate the relevant records in the practice files. Explain which rule applies and write what you expect the next step to produce. Compare that expectation with the worked example rather than relying on the output's tone.`,
      },
      {
        title: "Look at an example",
        kind: "lesson" as const,
        minutes: 8,
        content: `## Worked example\n\n${study.introduction}\n\n${unit.example}\n\n### What makes this result correct\n\n${unit.expected}\n\n### Try a different example\n\nChoose one source value or task condition and change it in a copy of the practice files. Write how the expected result should change and which permission must remain the same. Preserve the original so that you can explain the difference. Use the answer guide after attempting the exercise.`,
      },
      {
        title: "Make a decision and explain it",
        kind: "quiz" as const,
        minutes: 7,
        content: `## Your decision\n\n${unit.decision.text}\n\nChoose the answer that follows the facts and instructions in this example. These are practice decisions; completing them does not award a certificate.`,
        options: unit.decision.choices.map((c) => c.text),
        correctOption: unit.decision.choices.findIndex((c) => c.best),
      },
      {
        title: final
          ? "Complete your final practical project"
          : "Try it yourself",
        kind: "practice" as const,
        minutes: final ? 45 : 30,
        content: `## ${final ? "Your final practical project" : "Try the task yourself"}\n\n${unit.task}\n\n### Work through the exercise\n\n1. Download the practice files and workbook. Use a copy so that original records remain available. Record the course version and whether you are using a live account or a desk simulation.\n2. Find the records and instructions you need for this module. Write the expected result before the run or desk exercise.\n3. Try the task above using your practice files and the tools you have permission to use. Keep the records, result and settings someone would need to repeat it. Do not send messages, publish, buy or change live business records during this exercise.\n4. Open the result or app record and check it yourself. Compare the actual result with the expected checks below and record any failure.\n5. Fix one problem or change one detail in the practice information, then repeat the affected check. Keep both attempts and explain the change.\n6. Record what you did and where you saved the work in your workbook and explain the decision in your own words. If your account cannot do a step, label your work as a practice simulation and note what you still need to try in the product.\n\n### Check your work\n\n${unit.expected}\n\n### What to keep\n\n${blueprint.modules[index].evidence}.${final ? `\n\n### A new example to try\n\n${study.challenge}\n\n### Assessment\n\nReview the Practical assessment guide resource. Your final evidence must demonstrate all six skill areas, with a competent score of at least 3 out of 4 in every area. The reviewer checks your work and individual explanation; practice completion alone does not award a certificate.` : ""}`,
        criteria: final
          ? assessmentGuide.slice(
              assessmentGuide.indexOf("## What a competent"),
              assessmentGuide.indexOf("## Review and improvement"),
            )
          : `${unit.expected} Evidence required: ${blueprint.modules[index].evidence}. The learner explains the source, permission boundary, actual result and any correction without relying on unverified claims.`,
        materials: final
          ? resources
          : [resources[0], resources[1], resources[3]],
      },
      {
        title: "Keep your work and explain what you learned",
        kind: "practice" as const,
        minutes: 10,
        content: `## Keep a record of your work\n\nRecord what you learned by explaining one decision from this module. Explain which information you used, which rule you followed, what happened and how you checked it. Use your test log to record what you expected and what happened. List where you saved the files so a reviewer can find them.\n\n### Questions to help you explain your work\n\n- What did you expect before running the task, and what helped you decide that?\n- What happened, and where can someone else check the result?\n- What was the agent allowed to do, and did it keep to those rules when the information changed?\n- What went wrong or still needs checking, and what would you do next?\n\n### What to keep from this module\n\n${blueprint.modules[index].evidence}.\n\n### Check your result\n\n${unit.expected}\n\nUse the workbook to link files or records. Explain whether the evidence comes from a live demonstration or a simulation. The next module builds on this work, so keep the current version and any earlier attempt.`,
        criteria: `${unit.expected} Reflection identifies input, applied rule, inspectable result, action boundary and remaining limitation.`,
      },
    ];
    const moduleActivities = stages.map((stage, step) => ({
      id: uuid(slug + ":" + index + ":" + step),
      options: [],
      correctOption: null,
      criteria: "",
      ...stage,
      title: `${index + 1}.${step + 1} ${stage.title}`,
    }));
    if (index === 0) moduleActivities[0].materials = resources;
    activities.push(...moduleActivities);
    return {
      title,
      chapter: chapter.title,
      image: chapter.image,
      visual: chapter.visual,
      expected: unit.expected,
      decision: unit.decision,
      activities: moduleActivities,
    };
  });
  const content: CourseContent = courseContentSchema.parse({
    title: blueprint.title,
    summary: `${study.introduction} Complete six modules with visual lessons, worked examples, decision feedback, practical labs and records of your work. ${blueprint.capstone}`,
    category: "ai",
    outcomes: blueprint.modules.map((m) => `${m.title}: ${m.evidence}`),
    activities,
  });
  const minutes = activities.reduce((sum, a) => sum + a.minutes, 0);
  return {
    slug,
    title: blueprint.title,
    version: AGENT_COURSE_VERSION,
    introduction: study.introduction,
    audience: blueprint.audience,
    prerequisites: blueprint.prerequisites,
    project: blueprint.capstone,
    challenge: study.challenge,
    minutes,
    modules,
    resources,
    sources: study.sources,
    content,
    reviewerGuide,
  };
}
export type AgentCoursePack = NonNullable<
  ReturnType<typeof getAgentCoursePack>
>;
export function exportAgentCourseNotes(
  pack: AgentCoursePack,
  notes: Record<string, string> = {},
) {
  return `# ${pack.title}\nVersion: ${pack.version}\n\n${pack.introduction}\n\n${pack.resources.map((r) => r.content).join("\n\n---\n\n")}\n\n# Your activity notes\nThis download does not submit work or issue a certificate. Use your purchased course assessment to submit your project.\n\n${pack.content.activities.map((a) => `## ${a.title}\n\n${notes[a.id] || "[Write your explanation and evidence references here.]"}`).join("\n\n")}\n\n# Official sources\nDocumentary review: 1 October 2026. Account-level platform testing remains separate.\n${pack.sources.map((s) => `- ${s.title}: ${s.url}`).join("\n")}\n`;
}
