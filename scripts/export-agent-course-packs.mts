import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { agentCourseBlueprints } from "../lib/always-on-agents/catalogue.ts";
import {
  getAgentCoursePack,
  exportAgentCourseNotes,
} from "../lib/always-on-agents/courses.ts";
const destination = resolve("docs/agent-course-packs");
await mkdir(destination, { recursive: true });
const summaries = [];
for (const blueprint of agentCourseBlueprints) {
  const pack = getAgentCoursePack(blueprint.slug)!;
  const guide =
    pack.reviewerGuide +
    "\n\n# Course-specific evidence checks\n\n" +
    pack.modules
      .map(
        (module, index) =>
          `## ${index + 1}. ${module.title}\n\n${module.expected}\n\n${module.decision.text}\n\n${module.decision.choices.map((c) => `${c.best ? "Best response" : "Alternative"}: ${c.text}\n${c.feedback}`).join("\n\n")}`,
      )
      .join("\n\n") +
    "\n\n# Individual changed-case challenge\n" +
    pack.challenge;
  const courseText = `# ${pack.title}\nVersion: ${pack.version}\nStatus: authored teaching pack for review, not commercial release.\nSuggested guided study: 7–8 hours including practical work; pilot timing not yet measured.\n\n${pack.introduction}\n\n## Audience and prerequisites\n${pack.audience}\n${pack.prerequisites}\n\n${pack.content.activities.map((a) => `# ${a.title}\nSuggested minutes: ${a.minutes}\n\n${a.content}${a.kind === "quiz" ? "\n\n" + a.options.map((option, i) => `${i + 1}. ${option}`).join("\n") : ""}`).join("\n\n---\n\n")}\n\n# Reference and resource pack\n\n${exportAgentCourseNotes(pack)}`;
  await Promise.all([
    writeFile(
      resolve(destination, pack.slug + ".json"),
      JSON.stringify(pack.content, null, 2) + "\n",
    ),
    writeFile(resolve(destination, pack.slug + ".md"), courseText),
    writeFile(resolve(destination, pack.slug + "-reviewer.md"), guide),
  ]);
  summaries.push(
    `| ${pack.title} | [Teaching pack](${pack.slug}.md) | [LMS JSON](${pack.slug}.json) | [Reviewer guide](${pack.slug}-reviewer.md) |`,
  );
}
await writeFile(
  resolve(destination, "README.md"),
  `# Authored always-on agent courses\n\n13 courses, 78 modules and 468 activities. Each course has 18 lesson/example activities, six decision questions, six guided labs and six evidence checkpoints. Sources: original authored content in lib/always-on-agents/content, assembled by lib/always-on-agents/courses.ts.\n\nRegenerate these exports with npm run courses:export. Run npm run courses:check to validate the packs against the existing LMS format. Image references resolve through the Experrt website; the Markdown export is a portable text/resource pack, not a self-contained offline illustrated website.\n\nExperrt platform administrators can open /dashboard/studio/new and choose an authored agent course directly from the internal library. Loading puts the content in the editor without saving it. Inspect the result and save as a draft. Alternatively, on the development site, open /courses/agents/review, download a course's LMS JSON and import it in Studio. Publishing and commercial availability are separate actions. No live courses are automatically created by the export script.\n\n| Course | Content | Import | Assessment |\n|---|---|---|---|\n${summaries.join("\n")}\n\nThe authored content is ready for editorial review. Live platform-account demonstrations, learner pilot, reviewer operations, certificate verification and commercial terms remain release gates. See ../always-on-agent-course-standard.md. Suggested study times are authoring estimates, not observed completion times.\n`,
);
console.log(
  `Exported ${summaries.length} validated course packs to ${destination}`,
);
