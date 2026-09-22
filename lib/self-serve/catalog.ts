import { PROMPT_ENGINEERING_LESSONS } from "./prompt-engineering.ts";
import type { SelfServeCourse, SelfServeTrack } from "./types.ts";

const TRACK_LABEL: Record<SelfServeTrack, string> = {
  ai: "AI",
  technology: "Technology",
  robotics: "Robotics",
  hr: "HR transformation",
};

export function trackLabel(track: SelfServeTrack): string {
  return TRACK_LABEL[track];
}

export const SELF_SERVE_TRACKS: SelfServeTrack[] = ["ai", "technology", "robotics", "hr"];

type Outline = {
  title: string;
  track: SelfServeTrack;
  hours: number;
  priceGbp: number;
  promise: string;
  modules: string[];
};

const OUTLINES: Outline[] = [
  {
    title: "AI Output Verification",
    track: "ai",
    hours: 2.5,
    priceGbp: 99,
    promise: "A four-step check so a confident, plausible, wrong answer does not leave your desk.",
    modules: ["How confident error happens", "The four-step check", "Judge three outputs", "The verification note"],
  },
  {
    title: "Applying AI in Daily Work",
    track: "ai",
    hours: 2.5,
    priceGbp: 99,
    promise: "Put the tool inside three pieces of work you already own, and keep the habit.",
    modules: ["Pick the work", "Draft, summarise, decide", "A weekly loop", "When not to start with the tool"],
  },
  {
    title: "AI for Writing and Communication",
    track: "ai",
    hours: 2,
    priceGbp: 99,
    promise: "A faster draft, then the judgement about audience, claim, and what you will sign.",
    modules: ["The first draft", "Audience and claim", "One finished piece", "A standard for the next one"],
  },
  {
    title: "Designing AI Agents for Business Workflows",
    track: "ai",
    hours: 2.5,
    priceGbp: 129,
    promise: "One job, the tools it may use, and the step where a person has to say yes.",
    modules: ["Agent or prompt", "One job", "Tools you will not grant", "The one-page brief"],
  },
  {
    title: "Setting Up and Supervising AI Agents",
    track: "ai",
    hours: 3,
    priceGbp: 179,
    promise: "Stand an agent up in a tool you already pay for, then test the action it must refuse.",
    modules: ["Standing instructions", "Only the tools that job needs", "Three tests", "The supervision note"],
  },
  {
    title: "AI for Customer Communications",
    track: "ai",
    hours: 2.5,
    priceGbp: 99,
    promise: "Three patterns for replies, proposals, and complaints, and a send-or-hold rule.",
    modules: ["What can be sent", "Three patterns", "The check before send", "The send-or-hold note"],
  },
  {
    title: "AI-Assisted Analysis and Reporting",
    track: "ai",
    hours: 2.5,
    priceGbp: 99,
    promise: "Use a model on figures without shipping a number you cannot rebuild.",
    modules: ["Where a number is invented", "The rebuild test", "The sentence that overclaims", "A working file"],
  },
  {
    title: "Secure Use of AI Tools at Work",
    track: "ai",
    hours: 2,
    priceGbp: 99,
    promise: "A rule for the tools your team actually uses, tested on one real prompt.",
    modules: ["What was pasted", "The settings you have", "The rule", "Run it on one prompt"],
  },
  {
    title: "AI Literacy under the EU AI Act",
    track: "ai",
    hours: 2,
    priceGbp: 99,
    promise: "What Article 4 asks for in practice, and a one-page plan. Not a compliance claim.",
    modules: ["What it asks", "What it does not give you", "A measure for your role", "The plan"],
  },
  {
    title: "Getting Value from the Technology You Already Pay For",
    track: "technology",
    hours: 2,
    priceGbp: 99,
    promise: "Three jobs that belong in licences you already pay for, and a 30-day plan.",
    modules: ["The inventory", "Three jobs", "Why people opt out", "The 30-day plan"],
  },
  {
    title: "Choosing Technology for Your Team",
    track: "technology",
    hours: 2,
    priceGbp: 129,
    promise: "Compare a tool against the work, and leave with a one-page choice record.",
    modules: ["The job", "Five questions", "The switching cost", "The choice record"],
  },
  {
    title: "No-Code Automation for Everyday Work",
    track: "technology",
    hours: 2.5,
    priceGbp: 99,
    promise: "One small automation on a real repeating task, and a note for when it fails.",
    modules: ["The task", "A no-code path", "Run it", "When it breaks"],
  },
  {
    title: "From Spreadsheets to Simple Systems",
    track: "technology",
    hours: 2.5,
    priceGbp: 99,
    promise: "A map of the workbook you depend on, and what should leave it.",
    modules: ["What the file is doing", "The dangerous parts", "A simpler shape", "What you move"],
  },
  {
    title: "Data Skills for People Who Are Not Analysts",
    track: "technology",
    hours: 2.5,
    priceGbp: 99,
    promise: "A checklist for any table, so you know when a number is safe to use.",
    modules: ["The claim", "Filters and missing rows", "The question before you act", "Your checklist"],
  },
  {
    title: "Security Decisions for Non-Technical Teams",
    track: "technology",
    hours: 2,
    priceGbp: 99,
    promise: "An exposure list for how your team really shares access, and three changes this week.",
    modules: ["What you actually share", "What would hurt", "Three changes", "The exposure list"],
  },
  {
    title: "Digital Change for Managers",
    track: "technology",
    hours: 2,
    priceGbp: 129,
    promise: "The first two weeks of a tool change, written as work people can feel.",
    modules: ["What they stop doing", "The first two weeks", "How you know", "The plan"],
  },
  {
    title: "Technology Decisions for Non-Technical Leaders",
    track: "technology",
    hours: 2,
    priceGbp: 149,
    promise: "Five questions for a proposal, and a ninety-day test you can hold someone to.",
    modules: ["What you are buying", "Five questions", "Who owns the failure", "The ninety-day test"],
  },
  {
    title: "Connecting the Tools Your Team Already Uses",
    track: "technology",
    hours: 2.5,
    priceGbp: 129,
    promise: "One real handoff connected, and a map of what a person must still check.",
    modules: ["The handoff", "Connect it", "Run this week's inputs", "The map"],
  },
  {
    title: "Running a Technology Rollout",
    track: "technology",
    hours: 2,
    priceGbp: 129,
    promise: "A rollout sheet for one tool: behaviour, owner, date, and the sign it stuck.",
    modules: ["The behaviour", "Who and when", "Support, then stop", "The sign it stuck"],
  },
  {
    title: "Robotics for Non-Engineers",
    track: "robotics",
    hours: 2.5,
    priceGbp: 99,
    promise: "A go or not-yet brief for one process. A decision, not an introduction.",
    modules: ["What it could take", "What it cannot do", "The exception", "The brief"],
  },
  {
    title: "Collaborative Robots at Work",
    track: "robotics",
    hours: 2,
    priceGbp: 99,
    promise: "Start, stop, and recover, plus a handover the next shift can trust.",
    modules: ["What it is for", "Three drills", "When to call a person", "The handover"],
  },
  {
    title: "Where a Robot Belongs in the Process",
    track: "robotics",
    hours: 2.5,
    priceGbp: 129,
    promise: "A process marked task by task, and a recommendation you could defend.",
    modules: ["The tasks", "Robot, person, or not yet", "The easy step that is not", "The recommendation"],
  },
  {
    title: "Preparing a Team for Automation",
    track: "robotics",
    hours: 2,
    priceGbp: 99,
    promise: "Who is affected, what they must be able to do, and what you will not pretend.",
    modules: ["Who is affected", "What they must do", "What stops", "The preparation brief"],
  },
  {
    title: "Warehouse and Logistics Automation",
    track: "robotics",
    hours: 2.5,
    priceGbp: 129,
    promise: "A one-page map of one goods flow, and where automation would make it worse.",
    modules: ["The flow", "Where it pays", "The pile it will not touch", "The map"],
  },
  {
    title: "Specifying a Robotics Project",
    track: "robotics",
    hours: 2.5,
    priceGbp: 149,
    promise: "A one-page specification a vendor cannot hide behind.",
    modules: ["Outcomes", "Volume and exceptions", "Who owns the stop", "The specification"],
  },
  {
    title: "Robotics Safety and Risk",
    track: "robotics",
    hours: 2,
    priceGbp: 129,
    promise: "The questions a non-specialist asks on a floor walk, and what to escalate the same day.",
    modules: ["Shared space", "Stops and zones", "The floor walk", "Same-day escalation"],
  },
  {
    title: "Running a Robotic Cell",
    track: "robotics",
    hours: 2.5,
    priceGbp: 129,
    promise: "A shift card: start, normal, recover, hand over.",
    modules: ["Start of shift", "What normal looks like", "Recover, then escalate", "The shift card"],
  },
  {
    title: "Vision Systems and Automated Inspection",
    track: "robotics",
    hours: 2,
    priceGbp: 129,
    promise: "What the camera is judging, how it fails quietly, and what a person still checks.",
    modules: ["The judgement", "The quiet failure", "The human check", "The inspection brief"],
  },
  {
    title: "Robotics Investment Decisions",
    track: "robotics",
    hours: 2,
    priceGbp: 149,
    promise: "Five questions for a capital request, aimed at the process rather than the brand.",
    modules: ["The process", "Payback and people", "Five questions", "Ninety days on"],
  },
  {
    title: "AI for HR and People Teams",
    track: "hr",
    hours: 2.5,
    priceGbp: 99,
    promise: "Three HR patterns from your own week, and a hold list for what you never paste.",
    modules: ["Safe to draft", "Three patterns", "What you never paste", "The hold list"],
  },
  {
    title: "EU AI Act Literacy for HR and L&D",
    track: "hr",
    hours: 2,
    priceGbp: 129,
    promise: "A role map and a record outline. Not a claim that anyone is compliant.",
    modules: ["What Article 4 asks", "The role map", "What a record contains", "What you will not claim"],
  },
  {
    title: "Redesigning Workplace Learning",
    track: "hr",
    hours: 2.5,
    priceGbp: 129,
    promise: "One real programme redesigned around a task and a check, not a library.",
    modules: ["Why people finish nothing", "Skill, task, check", "Redesign one programme", "What the manager will see"],
  },
  {
    title: "Hiring and Selection with AI",
    track: "hr",
    hours: 2.5,
    priceGbp: 129,
    promise: "What a model may draft, what a person must decide, and a selection standard.",
    modules: ["What may be drafted", "What a person decides", "The audit trail", "The standard"],
  },
  {
    title: "Performance and Feedback with AI",
    track: "hr",
    hours: 2,
    priceGbp: 99,
    promise: "A preparation sheet for one real conversation. The judgement stays with the manager.",
    modules: ["What you may draft", "What you must have seen", "One conversation", "The sheet"],
  },
  {
    title: "AI Adoption for Line Managers",
    track: "hr",
    hours: 2.5,
    priceGbp: 129,
    promise: "A 1:1 standard for reviewing AI-touched work without doing it yourself.",
    modules: ["The standard", "Review the work", "Signs it stuck", "What you ask for next"],
  },
  {
    title: "Building a Workforce Skills Plan",
    track: "hr",
    hours: 2,
    priceGbp: 129,
    promise: "The few skills the next two quarters need, by role, on one page.",
    modules: ["The work that is changing", "Skills by role", "What you will not train", "The plan"],
  },
  {
    title: "HR Operations with AI",
    track: "hr",
    hours: 2,
    priceGbp: 99,
    promise: "One HR operation with a checked AI step, written down.",
    modules: ["One operation", "The step a model may take", "The step a person keeps", "The workflow"],
  },
  {
    title: "Employee Data, Privacy and AI",
    track: "hr",
    hours: 2,
    priceGbp: 129,
    promise: "A red-list for people data, and the answer you give a manager who wants to paste it.",
    modules: ["What counts", "The red-list", "The answer", "The team rule"],
  },
  {
    title: "Measuring Whether Training Stuck",
    track: "hr",
    hours: 2,
    priceGbp: 99,
    promise: "Signs in the work two weeks on, and a measurement sheet for one programme.",
    modules: ["What you stop counting", "Signs in the work", "The manager conversation", "The sheet"],
  },
];

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const PILOT: SelfServeCourse = {
  slug: "prompt-engineering-for-professional-work",
  title: "Prompt Engineering for Professional Work",
  track: "ai",
  hours: 2.5,
  priceGbp: 99,
  playable: true,
  promise:
    "Instruct a model the way you would brief a colleague. Leave with a prompt card someone else can run.",
  modules: ["Brief the model", "Four parts of a brief", "Fix the miss", "The prompt card"],
  lessons: PROMPT_ENGINEERING_LESSONS,
};

export const SELF_SERVE_COURSES: SelfServeCourse[] = [
  PILOT,
  ...OUTLINES.map((course) => ({
    slug: slugify(course.title),
    title: course.title,
    track: course.track,
    promise: course.promise,
    hours: course.hours,
    priceGbp: course.priceGbp,
    playable: false,
    modules: course.modules,
  })),
];

export function getSelfServeCourse(slug: string): SelfServeCourse | undefined {
  return SELF_SERVE_COURSES.find((course) => course.slug === slug);
}

export function coursesByTrack(track: SelfServeTrack): SelfServeCourse[] {
  return SELF_SERVE_COURSES.filter((course) => course.track === track);
}
