You are writing one complete, paid, enterprise-grade online course for the Experrt learning academy. Repository: /workspace (Next.js, TypeScript). Do NOT run any git command. Only create these two files: /workspace/lib/self-serve/courses/__SLUG__.ts and /workspace/lib/__tests__/course-__SLUG__.test.ts. Do not edit any other file (other writers are working in parallel; the registry is updated by the lead afterwards).

Course slug: __SLUG__
Track plan file: /workspace/.cursor/skills/experrt-course/plans/__TRACK__.md (find the section for this course by its title or slug).

Read fully before writing:
1. /workspace/.cursor/skills/experrt-course-author/SKILL.md (the build sheet; obey every section, especially 0 Enterprise language, 5 Interactivity, 6 Validation and assessment, 7 Feedback, 8 Certification, 10 Gates).
2. /workspace/.cursor/skills/experrt-course/SKILL.md (the academy standard).
3. The plan for this course in the track plan file.
4. /workspace/lib/self-serve/prompt-engineering.ts (the reference course for depth, tone, and data shape).
5. /workspace/lib/self-serve/types.ts and /workspace/lib/self-serve/courses/types.ts (the data types) and /workspace/lib/self-serve/engine.ts (how each check kind is scored, including build rules role/fact/limit/shape, build field `any`, edit `limitWording`, order `wrong`, and scenario `passMark`).
6. /workspace/lib/self-serve/catalog.ts to confirm this course's title, promise, modules, and hours.

Write /workspace/lib/self-serve/courses/__SLUG__.ts:
- Start with the filled-in build sheet from section 9 of the author skill as a block comment.
- `import type { CourseContent } from "./types.ts";` and `export const COURSE: CourseContent = { slug: "__SLUG__", hours, artefact: { lessonId, title, recordLine }, lessons: [...] };`
- Seven or eight lessons: the teaching lessons from the plan (at least five), then a course assessment lesson whose check is a `scenario` of six to eight questions with passMark about eighty per cent, then the final artefact lesson whose check is a `build` with every field carrying a `rule` or an `any` list and a `missing` sentence. `artefact.lessonId` must be the final lesson's id.
- Every lesson has: id, title, emphasis (one word that appears in the title), place, sections (three to five sections, each with a heading and at least two full paragraphs; use beforeAfter where a before and after teaches), workedExample (with inputLabel and outputLabel suited to the material, for example "The supplier email" and "The reply that went out"; reading is two to four paragraphs), practice (intro plus a check), check (a new case, the same move), bridge (omit meaning only for the last lesson: give a closing sentence instead).
- Labels on mark buttons must be defined in that lesson's teaching text. Choose checks need `why` and `wrong`. Edit checks need `label`, `unchanged`, `keep`, `limits`, `limitWording` as appropriate, `why`, and ideally `result`.
- Realistic UK workplace material with invented names and companies. No real statistics unless you are certain they are real and you name the source in the text; prefer none. No salary figures. No claim of compliance or certification under any regulation or standard.
- Language: plain, precise, enterprise British English, full sentences, as written by a senior practitioner. Obey the banned list in section 0 of the author skill exactly. No em dashes or en dashes anywhere.

Write /workspace/lib/__tests__/course-__SLUG__.test.ts using node:test and node:assert/strict (see /workspace/lib/__tests__/self-serve-engine.test.ts for style; import with relative paths ending in .ts, e.g. `import { COURSE } from "../self-serve/courses/__SLUG__.ts";` and `import { evaluateCheck, answerComplete } from "../self-serve/engine.ts";`). Test: every lesson check and practice check passes with its correct answer and fails with a wrong one (for scenario: the all-correct answer passes, an answer below the pass mark fails; for build: a strong answer passes and an answer missing each ruled part fails; for edit: a good edit passes and the unchanged start fails); the final lesson is a build and matches artefact.lessonId; the second-to-last lesson is a scenario with 6 to 8 questions and a passMark; no string anywhere in COURSE contains an em dash, an en dash, or any banned word from section 0 (check case-insensitively with word boundaries: delve, unlock, unleash, empower, elevate, leverage, harness, supercharge, seamless, robust, cutting-edge, landscape, realm, tapestry, journey, game-changer, "deep dive", "dive into", "it's important to note", "in today's").

Verify: cd /workspace && node --experimental-strip-types --test lib/__tests__/course-__SLUG__.test.ts must pass, and `npx tsc --noEmit --pretty false 2>&1 | grep "__SLUG__"` must print nothing. Fix until both are clean.

Reply with: the lesson titles in order, the check kind of each lesson, the artefact title and record line, the word count of the course file (wc -w), and the test result line. Do not paste the course content.
