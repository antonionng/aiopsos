export type SelfServeTrack = "ai" | "technology" | "robotics" | "hr";

export type MarkSentence = {
  id: string;
  text: string;
  /** True when the sentence should carry the check's failLabel. */
  fail: boolean;
  why: string;
};

/** Text the learner reads with the question, such as the prompt the model was given. */
export type CheckMaterial = { label: string; text: string };

/** Build rules look for the parts of the work, not only its length. */
export type BuildRule = "role" | "fact" | "limit" | "shape";

export type BuildField = {
  id: string;
  label: string;
  hint: string;
  min: number;
  rule?: BuildRule;
  /** Passes only when the answer mentions at least one of these words or phrases (case-insensitive). */
  any?: string[];
  /** Full sentence shown when this part is missing or too thin. */
  missing?: string;
};

/** Passes when any of the words or phrases appears (case-insensitive). */
export type KeywordGroup = { id: string; any: string[]; missing: string };

type CheckBase = { prompt: string; material?: CheckMaterial };

export type LessonCheck =
  | (CheckBase & {
      kind: "mark";
      passLabel: string;
      failLabel: string;
      sentences: MarkSentence[];
      why: string;
    })
  | (CheckBase & {
      kind: "choose";
      leftLabel: string;
      left: string;
      rightLabel: string;
      right: string;
      correct: "left" | "right";
      why: string;
      wrong?: string;
    })
  | (CheckBase & {
      kind: "order";
      steps: { id: string; label: string }[];
      /** Step ids in the correct sequence. */
      correct: string[];
      why: string;
      /** Shown when the order is wrong. */
      wrong?: string;
    })
  | (CheckBase & {
      kind: "build";
      fields: BuildField[];
      why?: string;
    })
  | (CheckBase & {
      kind: "edit";
      /** The text the learner starts from. */
      start: string;
      /** Label above the text box. Defaults to "The prompt you are repairing". */
      label?: string;
      /** Shown when the text has not been changed. */
      unchanged?: string;
      /**
       * Each group must appear in a sentence that sets a limit (do not, must not, never, only).
       * With `limitWording: false` the group only has to appear somewhere in the edit.
       */
      limits: KeywordGroup[];
      limitWording?: boolean;
      /** Each group must still appear somewhere in the edited prompt. */
      keep: KeywordGroup[];
      why: string;
      /** The reply the repaired prompt produces, shown after a pass. */
      result?: CheckMaterial;
    });

export type BeforeAfter = { before: string; after: string; reading: string };

export type LessonSection = {
  heading: string;
  paragraphs: string[];
  beforeAfter?: BeforeAfter;
};

export type WorkedExample = {
  title: string;
  /** The material the learner starts from, such as a prompt, a brief, or a spreadsheet. */
  prompt: string;
  /** What was produced from it. */
  output: string;
  reading: string[];
  /** Defaults to "The prompt". */
  inputLabel?: string;
  /** Defaults to "What the model wrote". */
  outputLabel?: string;
};

export type LessonPractice = {
  intro: string;
  check: LessonCheck;
};

export type SelfServeLesson = {
  id: string;
  title: string;
  /** The word in the title that carries the single violet underline. */
  emphasis: string;
  /** Where this lesson sits in the course. */
  place: string;
  sections: LessonSection[];
  workedExample: WorkedExample;
  practice: LessonPractice;
  check: LessonCheck;
  /** What the next lesson adds. */
  bridge: string;
};

export type SelfServeCourse = {
  slug: string;
  title: string;
  track: SelfServeTrack;
  promise: string;
  hours: number;
  priceGbp: number;
  playable: boolean;
  modules: string[];
  lessons?: SelfServeLesson[];
  artefact?: CourseArtefact;
};

/** The work the learner signs. It is the answer to the build check in `lessonId`. */
export type CourseArtefact = {
  lessonId: string;
  /** For example "The prompt card". */
  title: string;
  /** One sentence the record uses to say what was done. */
  recordLine: string;
};

export type ResolvedArtefact = CourseArtefact & {
  fields: { id: string; label: string }[];
};

export type MarkAnswer = Record<string, "pass" | "fail">;

export type BuildAnswer = Record<string, string>;

export type EditAnswer = { edited: string };

export type LessonAnswer = MarkAnswer | "left" | "right" | string[] | BuildAnswer | EditAnswer;

export type LessonResult = {
  passed: boolean;
  answer: LessonAnswer;
};

export type CourseProgress = {
  lessons: Record<string, LessonResult>;
  signedName?: string;
  signedAt?: string;
  ref?: string;
};

export type CheckOutcome = {
  passed: boolean;
  /** Shown after an attempt. Empty when they have not answered. */
  detail: string;
};
