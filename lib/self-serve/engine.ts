import type {
  BuildAnswer,
  CheckOutcome,
  CourseProgress,
  LessonAnswer,
  LessonCheck,
  MarkAnswer,
  SelfServeLesson,
} from "./types.ts";

export function emptyProgress(): CourseProgress {
  return { lessons: {} };
}

export function lessonPassed(progress: CourseProgress, lessonId: string): boolean {
  return progress.lessons[lessonId]?.passed === true;
}

/** Lesson 0 is open. Later lessons open only after the previous check passed. */
export function canOpenLesson(
  lessons: SelfServeLesson[],
  progress: CourseProgress,
  index: number
): boolean {
  if (index <= 0) return true;
  if (index >= lessons.length) return false;
  return lessonPassed(progress, lessons[index - 1].id);
}

export function firstOpenIndex(
  lessons: SelfServeLesson[],
  progress: CourseProgress
): number {
  const incomplete = lessons.findIndex((lesson) => !lessonPassed(progress, lesson.id));
  if (incomplete === -1) return Math.max(0, lessons.length - 1);
  return incomplete;
}

export function checksPassed(
  lessons: SelfServeLesson[],
  progress: CourseProgress
): boolean {
  return lessons.every((lesson) => lessonPassed(progress, lesson.id));
}

export function evaluateCheck(check: LessonCheck, answer: LessonAnswer): CheckOutcome {
  switch (check.kind) {
    case "mark":
      return evaluateMark(check, answer);
    case "choose":
      return evaluateChoose(check, answer);
    case "order":
      return evaluateOrder(check, answer);
    case "build":
      return evaluateBuild(check, answer);
  }
}

function evaluateMark(
  check: Extract<LessonCheck, { kind: "mark" }>,
  answer: LessonAnswer
): CheckOutcome {
  if (!answer || typeof answer !== "object" || Array.isArray(answer)) {
    return { passed: false, detail: "Mark each sentence." };
  }
  const marks = answer as MarkAnswer;
  const missing = check.sentences.some((sentence) => !marks[sentence.id]);
  if (missing) return { passed: false, detail: "Mark each sentence." };

  const wrong = check.sentences.filter((sentence) => {
    const expected = sentence.fail ? "fail" : "pass";
    return marks[sentence.id] !== expected;
  });
  if (wrong.length === 0) {
    return { passed: true, detail: "That reading is right. The invented line is the one that adds a fact the prompt never gave." };
  }
  return {
    passed: false,
    detail: wrong.map((sentence) => sentence.why).join(" "),
  };
}

function evaluateChoose(
  check: Extract<LessonCheck, { kind: "choose" }>,
  answer: LessonAnswer
): CheckOutcome {
  if (answer !== "left" && answer !== "right") {
    return { passed: false, detail: "Choose the brief you would hand a colleague." };
  }
  if (answer === check.correct) return { passed: true, detail: check.why };
  return { passed: false, detail: check.why };
}

function evaluateOrder(
  check: Extract<LessonCheck, { kind: "order" }>,
  answer: LessonAnswer
): CheckOutcome {
  if (!Array.isArray(answer) || answer.length !== check.correct.length) {
    return { passed: false, detail: "Put every step in order." };
  }
  const passed = check.correct.every((id, index) => answer[index] === id);
  if (!passed) {
    return { passed: false, detail: "Not that order yet. Read the miss before you change the brief." };
  }
  return { passed: true, detail: check.why };
}

function evaluateBuild(
  check: Extract<LessonCheck, { kind: "build" }>,
  answer: LessonAnswer
): CheckOutcome {
  if (!answer || typeof answer !== "object" || Array.isArray(answer)) {
    return { passed: false, detail: "Complete every line of the card." };
  }
  const fields = answer as BuildAnswer;
  const missing = check.fields.filter((field) => (fields[field.id] ?? "").trim().length < field.min);
  if (missing.length === 0) {
    return { passed: true, detail: "The card has the four parts a colleague needs." };
  }
  return {
    passed: false,
    detail: `Still thin: ${missing.map((field) => field.label.toLowerCase()).join(", ")}. Write enough that someone else could run it.`,
  };
}

export function canSign(lessons: SelfServeLesson[], progress: CourseProgress, name: string): boolean {
  return checksPassed(lessons, progress) && name.trim().length >= 2;
}

/** Short public reference. Not a secret. Preview records are local until checkout exists. */
export function certificateRef(name: string, signedAt: string): string {
  const raw = `${name.trim().toLowerCase()}|${signedAt}`;
  let hash = 2166136261;
  for (let i = 0; i < raw.length; i++) {
    hash ^= raw.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return `EX${(hash >>> 0).toString(36).toUpperCase().padStart(6, "0").slice(0, 8)}`;
}
