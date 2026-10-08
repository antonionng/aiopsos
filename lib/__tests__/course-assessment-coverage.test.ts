import { test } from "node:test";
import assert from "node:assert/strict";
import { SELF_SERVE_COURSES } from "../self-serve/catalog.ts";
import { assessSubmittedProgress } from "../self-serve/assessment-progress.ts";
import { canSign, courseArtefact, evaluateCheck } from "../self-serve/engine.ts";
import { agentCourseBlueprints } from "../always-on-agents/catalogue.ts";
import { getAgentCoursePack } from "../always-on-agents/courses.ts";
import { assessmentSkills, validateAssessment } from "../always-on-agents/assessment.ts";
import type { ProjectSubmission } from "../always-on-agents/assessment.ts";

for (const course of SELF_SERVE_COURSES) {
  test(`${course.slug}: assessment feedback, pass threshold and certificate gate`, () => {
    assert(course.playable && course.lessons?.length, "A marketed course needs complete lessons.");
    const lessons = course.lessons;
    const assessments = lessons.filter(lesson => lesson.check.kind === "scenario");
    assert(assessments.length > 0, "A course needs a scenario assessment.");
    assert(courseArtefact(course)?.fields.length, "A course needs final practical work.");
    for (const lesson of assessments) {
      const check = lesson.check;
      if (check.kind !== "scenario") continue;
      const needed = check.passMark ?? check.questions.length;
      assert(needed >= 1 && needed <= check.questions.length);
      const correct: Record<string, string> = {};
      const below: Record<string, string> = {};
      check.questions.forEach((question, index) => {
        const right = question.options.filter(option => option.correct);
        const wrong = question.options.find(option => !option.correct);
        assert.equal(right.length, 1, question.id);
        assert(wrong, "An assessment question needs a plausible alternative.");
        assert(question.options.every(option => option.feedback.trim().length >= 20));
        correct[question.id] = right[0].id;
        below[question.id] = index < needed - 1 ? right[0].id : wrong.id;
      });
      assert(evaluateCheck(check, correct).passed);
      const failed = evaluateCheck(check, below);
      assert.equal(failed.passed, false);
      assert(failed.detail.includes("Question"), "A failed attempt needs answer-specific feedback.");
      const checked = assessSubmittedProgress(lessons, {
        lessons: { [lesson.id]: { passed: false, answer: correct } },
        signedAt: "2026-10-02T00:00:00Z", ref: "FORGED",
      });
      assert(checked.lessons[lesson.id].passed, "The server decides from the answer.");
      assert.equal(checked.ref, undefined);
      assert.equal(checked.signedAt, undefined);
      assert.equal(canSign(lessons, checked, "Alex Example"), false, "Final work is still required.");
    }
    const forged = assessSubmittedProgress(lessons, {
      lessons: Object.fromEntries(lessons.map(lesson => [lesson.id, { passed: true, answer: {} }])),
    });
    assert.equal(canSign(lessons, forged, "Alex Example"), false);
    assert(assessments.every(lesson => !forged.lessons[lesson.id].passed));
    assert.throws(() => assessSubmittedProgress(lessons, { lessons: { unknown: { answer: {} } } }));
    assert.throws(() => assessSubmittedProgress(lessons, { lessons: { [lessons[0].id]: { answer: { x: 4 } } } }));
  });
}

test("all 13 agent courses include course-specific projects and six-area practical assessment", () => {
  assert.equal(agentCourseBlueprints.length, 13);
  for (const blueprint of agentCourseBlueprints) {
    const pack = getAgentCoursePack(blueprint.slug)!;
    assert(pack.project.length > 30 && pack.challenge.length > 30, blueprint.slug);
    assert(pack.modules[5].activities[4].criteria.includes("3"), blueprint.slug);
    assert(pack.resources.find(resource => resource.title === "Practical assessment guide")?.content.includes("EVERY area"));
    const submission: ProjectSubmission = {
      evidence: Object.fromEntries(assessmentSkills.map(skill => [skill.id, `Fictional test record for ${skill.id}. This exact extract is used only to verify the scoring policy.`])) as ProjectSubmission["evidence"],
      changedCase: "A fictional changed example, used only for the policy test.", declaration: true,
    };
    const raw = {
      skills: assessmentSkills.map(skill => ({
        id: skill.id, score: 3, evidenceQuote: submission.evidence[skill.id],
        feedback: "This is a fictional policy test, not a learner assessment.",
        nextStep: "Check another example against the original records.",
      })),
      summary: "Fictional policy test. No certificate is issued by this test.",
      limitations: ["No live work was assessed."],
    };
    assert(validateAssessment(raw, submission).passed);
    for (let index = 0; index < assessmentSkills.length; index++) {
      const skills = raw.skills.map((skill, i) => ({ ...skill, score: i === index ? 2 : 4 }));
      assert.equal(validateAssessment({ ...raw, skills }, submission).passed, false, `${blueprint.slug}: ${skills[index].id}`);
    }
  }
});

test("an empty course cannot establish certificate eligibility", () => {
  assert.equal(canSign([], { lessons: {} }, "Alex Example"), false);
});
