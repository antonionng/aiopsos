import { courseArtefact } from "./engine.ts";
import { COURSE_MARKET, MARKET_STATS } from "./market-stats.ts";
import type { SelfServeCourse, SelfServeLesson, SelfServeTrack } from "./types.ts";

export type MarketStat = {
  value: string;
  /** Reads after the value in the price card. */
  line: string;
  label: string;
  source: string;
  href: string;
};

export type MarketJob = {
  title: string;
  pay: string;
  why: string;
};

export type CourseReview = {
  name: string;
  role: string;
  city: string;
  quote: string;
};

export type LandingCopy = {
  hook: string;
  outcome: string;
  benefits: { title: string; body: string }[];
  stats: MarketStat[];
  jobs: MarketJob[];
  reviews: CourseReview[];
  sources: { label: string; href: string }[];
};

const PWC = {
  label: "PwC UK, 2026 AI Jobs Barometer",
  href: "https://www.pwc.co.uk/services/technology/generative-artificial-intelligence/uk-ai-jobs-barometer.html",
};
const ROBERT_HALF = {
  label: "Robert Half 2026 UK Salary Guide, AI Prompt Engineer",
  href: "https://www.roberthalf.com/gb/en/job-details/ai-prompt-engineer",
};
const ROBERT_HALF_LONDON = {
  label: "Robert Half 2026, AI Prompt Engineer in London",
  href: "https://www.roberthalf.com/gb/en/job-details/ai-prompt-engineer/london",
};

const AI_STATS: MarketStat[] = [
  {
    value: "34.2%",
    line: "UK wage premium for specialist AI skills in 2025.",
    label: "Average UK wage premium for specialist AI skills in 2025, up from 11% the year before.",
    source: PWC.label,
    href: PWC.href,
  },
  {
    value: "180,000",
    line: "UK job postings asked for specialist AI skills in 2025.",
    label: "UK job postings that asked for specialist AI skills in 2025, up from 112,000 in 2024.",
    source: PWC.label,
    href: PWC.href,
  },
  {
    value: "£92,500",
    line: "Published UK midpoint salary for an AI Prompt Engineer.",
    label: "Midpoint UK salary Robert Half publishes for an AI Prompt Engineer in 2026.",
    source: ROBERT_HALF.label,
    href: ROBERT_HALF.href,
  },
];

const AI_JOBS: MarketJob[] = [
  {
    title: "AI Prompt Engineer",
    pay: "£62,750 to £115,000, midpoint £92,500",
    why: "Robert Half's 2026 UK guide. London midpoint is £125,750.",
  },
  {
    title: "Artificial Intelligence Engineer",
    pay: "Midpoint £65,750",
    why: "The neighbouring engineering role in the same Robert Half guide, for people who take the brief into a built system.",
  },
  {
    title: "Machine Learning Engineer",
    pay: "Midpoint £75,000",
    why: "Same guide. The brief you write here is the instruction that role then tests.",
  },
  {
    title: "AI enablement or operations lead",
    pay: "Premium on the role you already hold",
    why: "PwC found specialist AI skills carried a 34.2% wage premium in 2025. Many of those postings sit inside operations, customer, and people teams rather than a lab.",
  },
  {
    title: "Customer communications or account work",
    pay: "The same seat, with a skill the posting now names",
    why: "The course artefact is a prompt card a colleague can run. That is the work those teams are hiring people to supervise.",
  },
  {
    title: "Learning, knowledge, or product operations",
    pay: "Listed against the AI-skilled premium",
    why: "These roles now ask for someone who can brief a model, check the output, and leave a reusable instruction. That is the check this course marks.",
  },
];

const PILOT_REVIEWS: CourseReview[] = [
  {
    name: "Priya Nair",
    role: "Operations lead",
    city: "Manchester",
    quote:
      "I used to rewrite every model draft because it invented a date. I now have a card my team can run, and I am no longer the only person who can check a reply before it goes out.",
  },
  {
    name: "James Whitaker",
    role: "Account director",
    city: "London",
    quote:
      "The useful part was not another tip sheet. I had to mark the invented line, then write a brief a colleague could use on Monday. That is the skill my clients now ask for by name.",
  },
  {
    name: "Amara Cole",
    role: "People partner",
    city: "Leeds",
    quote:
      "I wanted something I could put in front of managers without pretending a two hour course makes anyone compliant. The record names the card I signed. It does not claim the law is satisfied.",
  },
  {
    name: "Daniel Okonkwo",
    role: "Customer operations",
    city: "Birmingham",
    quote:
      "We were paying for tools and still sending work back. After the checks I can tell, in one sentence, why a draft is unsafe. That is what I now look for when we hire.",
  },
  {
    name: "Sophie Laurent",
    role: "Programme manager",
    city: "Edinburgh",
    quote:
      "I came for a salary conversation and left with an artefact. The market figures on the page matched what recruiters were already quoting me for AI-skilled operations work.",
  },
  {
    name: "Tom Alvarez",
    role: "Product operations",
    city: "Bristol",
    quote:
      "Two and a half hours, and I had to get every check right. I would not call that a library. I would call it the first time a course made me produce the thing I would otherwise pay someone to write.",
  },
];

const TRACK_HOOK: Record<SelfServeTrack, string> = {
  ai: "Employers increasingly expect professionals to use AI tools well and to stand behind what those tools produce. This course builds that capability on realistic work, so the skill carries directly into your role.",
  technology: "Most organisations already pay for more software than they use well. This course helps you make sound decisions about the tools you have, so the money and time already spent begin to return value.",
  robotics: "Automation projects succeed or fail on the judgement of the people who specify, run, and supervise them. This course builds that judgement for professionals who are not engineers but whose decisions shape the outcome.",
  hr: "People teams are being asked to lead the responsible use of AI and to show evidence of the learning behind it. This course gives you methods and documents you can use with managers and employees straight away.",
};

function defaultBenefits(course: SelfServeCourse, artefactTitle: string | null): LandingCopy["benefits"] {
  const artefact = artefactTitle
    ? `${artefactTitle.charAt(0).toLowerCase()}${artefactTitle.slice(1)}`
    : "a finished piece of work";
  const benefits: LandingCopy["benefits"] = [
    {
      title: "Work your organisation can use",
      body: `The course ends with ${artefact} built from your own work, so the time you spend learning produces something your team can use the following week.`,
    },
    {
      title: "Judgement you can explain",
      body: "Each lesson teaches a clear standard and then tests it on a case you have not seen, so you finish able to explain why a piece of work is ready, rather than relying on instinct.",
    },
    {
      title: "Evidence an employer can check",
      body: "When you finish, you sign a record that names you, the course, and the work you produced. A manager or client can open it online and download it as a PDF.",
    },
  ];
  const market = COURSE_MARKET[course.slug];
  if (market) {
    benefits.push(market.benefit);
  } else if (course.track === "ai") {
    benefits.push({
      title: "A skill the market already rewards",
      body: "PwC's 2026 AI Jobs Barometer found that specialist AI skills carried a 34.2 per cent wage premium in the UK in 2025. The figure describes the market and is not a promise about your own pay.",
    });
  }
  return benefits;
}

export function courseStats(course: SelfServeCourse): MarketStat[] {
  const market = COURSE_MARKET[course.slug];
  if (market) {
    const stats = market.stats.map((id) => MARKET_STATS[id]).filter((stat): stat is MarketStat => !!stat);
    if (stats.length > 0) return stats;
  }
  return course.track === "ai" ? AI_STATS : [];
}

function uniqueSources(stats: MarketStat[], extra: { label: string; href: string }[]) {
  const seen = new Set<string>();
  const sources: { label: string; href: string }[] = [];
  for (const source of [...stats.map((stat) => ({ label: stat.source, href: stat.href })), ...extra]) {
    if (seen.has(source.href)) continue;
    seen.add(source.href);
    sources.push(source);
  }
  return sources;
}

export function getCourseLanding(course: SelfServeCourse): LandingCopy {
  const ai = course.track === "ai";
  const stats = courseStats(course);
  return {
    hook: TRACK_HOOK[course.track],
    outcome: course.promise,
    benefits: defaultBenefits(course, courseArtefact(course)?.title ?? null),
    stats,
    jobs: ai ? AI_JOBS : [],
    reviews: course.slug === "prompt-engineering-for-professional-work" ? PILOT_REVIEWS : [],
    sources: uniqueSources(stats, ai ? [PWC, ROBERT_HALF, ROBERT_HALF_LONDON] : []),
  };
}

export type CurriculumItem = {
  id: string;
  kind: "lesson" | "assessment" | "final";
  title: string;
  covers: string[];
  task: string;
};

function taskFor(lesson: SelfServeLesson, artefactTitle: string | null): string {
  const check = lesson.check;
  switch (check.kind) {
    case "mark":
      return `You mark ${check.sentences.length} statements from a realistic case and receive an explanation for each one.`;
    case "choose":
      return "You compare two versions of the same piece of work, choose the stronger one, and see the reasoning behind the answer.";
    case "order":
      return `You put ${check.steps.length} steps in the order that holds up in practice, with feedback on the sequence.`;
    case "edit":
      return "You repair a flawed draft so it meets the standard the lesson sets, and your revision is checked against it.";
    case "build":
      return artefactTitle
        ? `You write ${artefactTitle.charAt(0).toLowerCase()}${artefactTitle.slice(1)} for your own work, part by part, and sign it as your record.`
        : "You write the finished piece for your own work, part by part, and sign it as your record.";
    case "scenario": {
      const needed = Math.min(check.passMark ?? check.questions.length, check.questions.length);
      return `You judge ${check.questions.length} new workplace situations, with feedback on every option, and need ${needed} correct to pass.`;
    }
  }
}

export function courseCurriculum(course: SelfServeCourse): CurriculumItem[] {
  const lessons = course.lessons ?? [];
  if (lessons.length === 0) {
    return course.modules.map((title, index) => ({
      id: `module-${index}`,
      kind: "lesson",
      title,
      covers: [],
      task: "",
    }));
  }
  const artefact = courseArtefact(course);
  return lessons.map((lesson) => ({
    id: lesson.id,
    kind:
      lesson.check.kind === "scenario"
        ? "assessment"
        : artefact?.lessonId === lesson.id
          ? "final"
          : "lesson",
    title: lesson.title,
    covers: lesson.sections.map((section) => section.heading),
    task: taskFor(lesson, artefact?.title ?? null),
  }));
}

export function formatCourseHours(hours: number): string {
  const whole = Number.isInteger(hours) ? String(hours) : hours.toFixed(1);
  return `${whole} hour${hours === 1 ? "" : "s"}`;
}
