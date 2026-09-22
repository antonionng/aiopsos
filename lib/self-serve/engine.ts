import type {
  BuildAnswer,
  BuildField,
  CheckOutcome,
  CourseProgress,
  KeywordGroup,
  LessonAnswer,
  LessonCheck,
  MarkAnswer,
  SelfServeLesson,
} from "./types.ts";

export function emptyProgress(): CourseProgress {
  return { lessons: {} };
}

export function progressStorageKey(slug: string): string {
  return `experrt-self-serve:${slug}`;
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
    case "edit":
      return evaluateEdit(check, answer);
  }
}

/** True when every part of the task has an answer, so Continue can be pressed. */
export function answerComplete(check: LessonCheck, answer: LessonAnswer | null | undefined): boolean {
  switch (check.kind) {
    case "mark": {
      if (!isRecord(answer)) return false;
      const marks = answer as MarkAnswer;
      return check.sentences.every((sentence) => marks[sentence.id] === "pass" || marks[sentence.id] === "fail");
    }
    case "choose":
      return answer === "left" || answer === "right";
    case "order":
      return true;
    case "build": {
      if (!isRecord(answer)) return false;
      const fields = answer as BuildAnswer;
      return check.fields.every((field) => (fields[field.id] ?? "").trim().length > 0);
    }
    case "edit": {
      const edited = editedText(answer);
      return edited !== null && edited.trim().length > 0 && edited.trim() !== check.start.trim();
    }
  }
}

function isRecord(answer: LessonAnswer | null | undefined): answer is Record<string, string> {
  return !!answer && typeof answer === "object" && !Array.isArray(answer);
}

function evaluateMark(
  check: Extract<LessonCheck, { kind: "mark" }>,
  answer: LessonAnswer
): CheckOutcome {
  if (!answerComplete(check, answer)) {
    return { passed: false, detail: "Mark every sentence before you continue." };
  }
  const marks = answer as MarkAnswer;
  const wrong = check.sentences.filter((sentence) => {
    const expected = sentence.fail ? "fail" : "pass";
    return marks[sentence.id] !== expected;
  });
  if (wrong.length === 0) return { passed: true, detail: check.why };
  return {
    passed: false,
    detail: wrong.map((sentence) => `Look again at \u201c${sentence.text}\u201d ${sentence.why}`).join(" "),
  };
}

function evaluateChoose(
  check: Extract<LessonCheck, { kind: "choose" }>,
  answer: LessonAnswer
): CheckOutcome {
  if (answer !== "left" && answer !== "right") {
    return { passed: false, detail: "Choose one of the two before you continue." };
  }
  if (answer === check.correct) return { passed: true, detail: check.why };
  return { passed: false, detail: check.wrong ?? check.why };
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
    return {
      passed: false,
      detail: "Not that order yet. Read the miss before you change the brief.",
    };
  }
  return { passed: true, detail: check.why };
}

const LIMIT_WORDS = /\b(do not|don't|dont|must not|mustn't|should not|shouldn't|never|avoid|only)\b/i;

const NAMED_DAYS =
  /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday|today|tomorrow|yesterday|january|february|march|april|june|july|august|september|october|november|december)\b/i;

const SHAPE_WORDS =
  /\b(one|two|three|four|five|six|seven|eight|nine|ten|lines?|sentences?|paragraphs?|bullets?|points?|words?|list|table|email|message|note|letter|summary|headings?|subject|reply)\b/i;

function normalise(text: string): string {
  return text.replace(/[\u2018\u2019]/g, "'").replace(/[\u201c\u201d]/g, '"');
}

function sentencesOf(text: string): string[] {
  return normalise(text)
    .split(/(?<=[.!?;:])\s+|\n+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

export function setsLimit(text: string): boolean {
  return LIMIT_WORDS.test(normalise(text));
}

/** A name, a number, a date, or a plain statement of what has not happened. */
export function hasConcreteFact(text: string): boolean {
  const clean = normalise(text);
  if (/\d/.test(clean)) return true;
  if (NAMED_DAYS.test(clean)) return true;
  if (/\bnot (yet )?been\b|\bno [a-z]+ (has|have) been\b/i.test(clean)) return true;
  return sentencesOf(clean).some((sentence) =>
    sentence
      .split(/\s+/)
      .slice(1)
      .some((word) => /^[A-Z][a-z]/.test(word))
  );
}

export function describesShape(text: string): boolean {
  const clean = normalise(text);
  return /\d/.test(clean) || SHAPE_WORDS.test(clean);
}

function meetsRule(field: BuildField, value: string): boolean {
  switch (field.rule) {
    case "role":
      return value.split(/\s+/).filter(Boolean).length >= 2;
    case "fact":
      return hasConcreteFact(value);
    case "limit":
      return setsLimit(value);
    case "shape":
      return describesShape(value);
    default:
      return true;
  }
}

function evaluateBuild(
  check: Extract<LessonCheck, { kind: "build" }>,
  answer: LessonAnswer
): CheckOutcome {
  const fields: BuildAnswer = isRecord(answer) ? (answer as BuildAnswer) : {};
  const missing = check.fields.filter((field) => {
    const value = (fields[field.id] ?? "").trim();
    return value.length < field.min || !meetsRule(field, value);
  });
  if (missing.length === 0) {
    return {
      passed: true,
      detail: check.why ?? "The card has every part a colleague needs to run it.",
    };
  }
  return {
    passed: false,
    detail: missing
      .map(
        (field) =>
          field.missing ??
          `${field.label} is still too thin. Write enough that a colleague could run it without asking you what you meant.`
      )
      .join(" "),
  };
}

function editedText(answer: LessonAnswer | null | undefined): string | null {
  if (!isRecord(answer)) return null;
  const edited = (answer as Record<string, unknown>).edited;
  return typeof edited === "string" ? edited : null;
}

function mentionsAny(text: string, group: KeywordGroup): boolean {
  const lower = text.toLowerCase();
  return group.any.some((word) => lower.includes(word.toLowerCase()));
}

function evaluateEdit(
  check: Extract<LessonCheck, { kind: "edit" }>,
  answer: LessonAnswer
): CheckOutcome {
  const edited = editedText(answer);
  if (edited === null || edited.trim() === check.start.trim()) {
    return {
      passed: false,
      detail: "You have not changed the prompt yet. Add a sentence that says what the reply must not add or promise.",
    };
  }
  const limitSentences = sentencesOf(edited).filter(setsLimit);
  const whole = normalise(edited);
  const notes = [
    ...check.keep.filter((group) => !mentionsAny(whole, group)),
    ...check.limits.filter((group) => !limitSentences.some((sentence) => mentionsAny(sentence, group))),
  ].map((group) => group.missing);
  if (notes.length === 0) return { passed: true, detail: check.why };
  return { passed: false, detail: notes.join(" ") };
}

export function canSign(
  lessons: SelfServeLesson[],
  progress: CourseProgress,
  name: string
): boolean {
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
