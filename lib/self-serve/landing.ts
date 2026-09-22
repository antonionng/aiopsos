import type { SelfServeCourse, SelfServeTrack } from "./types.ts";

export type MarketStat = {
  value: string;
  label: string;
  source: string;
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
    label: "Average UK wage premium for specialist AI skills in 2025, up from 11% the year before.",
    source: PWC.label,
  },
  {
    value: "180,000",
    label: "UK job postings that asked for specialist AI skills in 2025, up from 112,000 in 2024.",
    source: PWC.label,
  },
  {
    value: "£92,500",
    label: "Midpoint UK salary Robert Half publishes for an AI Prompt Engineer in 2026.",
    source: ROBERT_HALF.label,
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
  ai: "The market is already paying more for people who can brief a model and stand behind the output.",
  technology: "The skill is not another login. It is getting value from the tools the organisation already pays for.",
  robotics: "The hiring need is not a lecture on robots. It is a person who can judge a process and write the brief.",
  hr: "People teams are being asked for AI literacy they can evidence, and for work a manager can use the next week.",
};

function defaultBenefits(course: SelfServeCourse): LandingCopy["benefits"] {
  return [
    {
      title: "A skill the market prices",
      body: "PwC's 2026 AI Jobs Barometer found specialist AI skills carried a 34.2% UK wage premium in 2025. This course is built around the work those postings describe: a brief, a check, and an artefact someone else can run.",
    },
    {
      title: "Roles this work shows up in",
      body:
        course.track === "ai"
          ? `${course.title} is the kind of applied skill now listed on operations, customer, people, and product roles, as well as titled prompt engineering seats. The page below uses published salary bands, not a promise that one course moves you into the top of the range.`
          : `${course.title} is the kind of applied judgement now asked of operations, people, and product roles. Published figures on this page describe the market, not a promise that one course changes your pay.`,
    },
    {
      title: "Work you would otherwise buy",
      body: "You leave with a named artefact from your own week. That is the difference between a course that feels busy and a course that changes what you can charge for or hire for.",
    },
  ];
}

export function getCourseLanding(course: SelfServeCourse): LandingCopy {
  const ai = course.track === "ai";
  return {
    hook: TRACK_HOOK[course.track],
    outcome: course.promise,
    benefits: defaultBenefits(course),
    stats: ai ? AI_STATS : AI_STATS.slice(0, 2),
    jobs: ai ? AI_JOBS : [],
    reviews: course.slug === "prompt-engineering-for-professional-work" ? PILOT_REVIEWS : [],
    sources: ai
      ? [PWC, ROBERT_HALF, ROBERT_HALF_LONDON]
      : [PWC],
  };
}

export function formatCourseHours(hours: number): string {
  const whole = Number.isInteger(hours) ? String(hours) : hours.toFixed(1);
  return `${whole} hour${hours === 1 ? "" : "s"}`;
}
