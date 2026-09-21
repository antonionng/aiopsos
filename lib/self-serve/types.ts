export type SelfServeTrack = "ai" | "technology" | "robotics" | "hr";

export type MarkSentence = {
  id: string;
  text: string;
  /** True when the sentence should be marked as invented or unsafe. */
  fail: boolean;
  why: string;
};

export type LessonCheck =
  | {
      kind: "mark";
      prompt: string;
      passLabel: string;
      failLabel: string;
      sentences: MarkSentence[];
    }
  | {
      kind: "choose";
      prompt: string;
      leftLabel: string;
      left: string;
      rightLabel: string;
      right: string;
      correct: "left" | "right";
      why: string;
    }
  | {
      kind: "order";
      prompt: string;
      steps: { id: string; label: string }[];
      /** Step ids in the correct sequence. */
      correct: string[];
      why: string;
    }
  | {
      kind: "build";
      prompt: string;
      fields: { id: string; label: string; hint: string; min: number }[];
    };

export type SelfServeLesson = {
  id: string;
  title: string;
  decision: string;
  paragraphs: string[];
  exampleTitle: string;
  example: string;
  check: LessonCheck;
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
};

export type MarkAnswer = Record<string, "pass" | "fail">;

export type BuildAnswer = Record<string, string>;

export type LessonAnswer = MarkAnswer | "left" | "right" | string[] | BuildAnswer;

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
