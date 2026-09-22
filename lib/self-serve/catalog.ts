import { PROMPT_ENGINEERING_LESSONS } from "./prompt-engineering.ts";
import { COURSE_CONTENT } from "./courses/index.ts";
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
    promise: "AI Output Verification teaches professionals who pass on AI-generated text under their own name to check every claim against a source before it leaves their desk. You finish with a verification note a colleague can follow and repeat, and your organisation sends out fewer confident answers that turn out to be wrong.",
    modules: ["How confident error happens", "The four-step check", "Judge three outputs", "The verification note"],
  },
  {
    title: "Applying AI in Daily Work",
    track: "ai",
    hours: 2.5,
    priceGbp: 99,
    promise: "Applying AI in Daily Work shows professionals who have tried an AI tool, but not yet kept using it, how to bring it into three pieces of work they already own. You finish with a weekly plan that sets out each task, its check and a review day, so the habit lasts beyond the course.",
    modules: ["Pick the work", "Draft, summarise, decide", "A weekly loop", "When not to start with the tool"],
  },
  {
    title: "AI for Writing and Communication",
    track: "ai",
    hours: 2,
    priceGbp: 99,
    promise: "AI for Writing and Communication teaches professionals who write briefings, proposals and reports to turn a fast AI draft into work they are prepared to sign. You finish with one finished piece of real work and a short writing standard, so your readers get clear claims and no promises you cannot keep.",
    modules: ["The first draft", "Audience and claim", "One finished piece", "A standard for the next one"],
  },
  {
    title: "Designing AI Agents for Business Workflows",
    track: "ai",
    hours: 2.5,
    priceGbp: 129,
    promise: "Designing AI Agents for Business Workflows teaches process owners and team leaders who are not engineers to decide whether a task needs an agent and, if it does, to scope it clearly. You finish with a one-page agent brief that an engineer or vendor can build from, including the step where a person must approve.",
    modules: ["Agent or prompt", "One job", "Tools you will not grant", "The one-page brief"],
  },
  {
    title: "Setting Up and Supervising AI Agents",
    track: "ai",
    hours: 3,
    priceGbp: 179,
    promise: "Setting Up and Supervising AI Agents teaches the person who configures an agent in a licensed tool to build it from a brief and test it before anyone relies on it. You finish with a supervision note for one real agent, naming who reviews its work, how often, and who can switch it off.",
    modules: ["Standing instructions", "Only the tools that job needs", "Three tests", "The supervision note"],
  },
  {
    title: "AI for Customer Communications",
    track: "ai",
    hours: 2.5,
    priceGbp: 99,
    promise: "AI for Customer Communications teaches advisers, account managers and small business owners to draft customer replies, proposals and complaint responses with AI and to spot every sentence that commits the organisation. You finish with a send-or-hold note that a new starter could follow, so fewer messages promise what nobody has approved.",
    modules: ["What can be sent", "Three patterns", "The check before send", "The send-or-hold note"],
  },
  {
    title: "AI-Assisted Analysis and Reporting",
    track: "ai",
    hours: 2.5,
    priceGbp: 99,
    promise: "AI-Assisted Analysis and Reporting teaches analysts, finance staff and report writers to use AI on real figures without reporting a number they cannot rebuild. You finish with a working file for one real report that records the source data and the method behind each figure, so a colleague can reproduce every result.",
    modules: ["Where a number is invented", "The rebuild test", "The sentence that overclaims", "A working file"],
  },
  {
    title: "Secure Use of AI Tools at Work",
    track: "ai",
    hours: 2,
    priceGbp: 99,
    promise: "Secure Use of AI Tools at Work teaches team leaders and managers to sort what goes into AI tools into what is fine, what needs care and what must never be pasted. You finish with a written team rule, tested on a real prompt, that a new colleague could follow on day one.",
    modules: ["What was pasted", "The settings you have", "The rule", "Run it on one prompt"],
  },
  {
    title: "AI Literacy under the EU AI Act",
    track: "ai",
    hours: 2,
    priceGbp: 99,
    promise: "AI Literacy under the EU AI Act explains to managers and team leaders, in plain terms, what Article 4 asks of organisations using AI and what it does not. You finish with a one-page AI literacy plan that prepares a record of the measures taken and states plainly what it does not claim.",
    modules: ["What it asks", "What it does not give you", "A measure for your role", "The plan"],
  },
  {
    title: "Getting Value from the Technology You Already Pay For",
    track: "technology",
    hours: 2,
    priceGbp: 99,
    promise: "Getting Value from the Technology You Already Pay For helps team leaders and operations managers match the licences they already pay for to the work their team repeats each week. You finish with a 30-day plan naming three jobs and an owner for each, so existing spend delivers more before anything new is bought.",
    modules: ["The inventory", "Three jobs", "Why people opt out", "The 30-day plan"],
  },
  {
    title: "Choosing Technology for Your Team",
    track: "technology",
    hours: 2,
    priceGbp: 129,
    promise: "Choosing Technology for Your Team teaches team leaders and managers to compare tools against the real work, including doing nothing, and to count the cost of switching in and out. You finish with a one-page choice record that explains what was chosen and why, so the decision still makes sense a year later.",
    modules: ["The job", "Five questions", "The switching cost", "The choice record"],
  },
  {
    title: "No-Code Automation for Everyday Work",
    track: "technology",
    hours: 2.5,
    priceGbp: 99,
    promise: "No-Code Automation for Everyday Work teaches administrators, coordinators and team leads to build one small automation for a repeating task in a tool they already have. You finish with a tested automation and a failure note that says how you will know it has stopped and how to switch it off.",
    modules: ["The task", "A no-code path", "Run it", "When it breaks"],
  },
  {
    title: "From Spreadsheets to Simple Systems",
    track: "technology",
    hours: 2.5,
    priceGbp: 99,
    promise: "From Spreadsheets to Simple Systems teaches people whose team depends on a large spreadsheet to see what each part does and where it could quietly go wrong. You finish with a one-page map of the workbook that shows what should stay, what should move to a list or system, and what should be retired.",
    modules: ["What the file is doing", "The dangerous parts", "A simpler shape", "What you move"],
  },
  {
    title: "Data Skills for People Who Are Not Analysts",
    track: "technology",
    hours: 2.5,
    priceGbp: 99,
    promise: "Data Skills for People Who Are Not Analysts teaches managers and specialists who act on figures to check what a number claims, where it came from and whether a comparison is fair. You finish with a checklist already tested on a real table, so decisions rest on numbers that are safe to use.",
    modules: ["The claim", "Filters and missing rows", "The question before you act", "Your checklist"],
  },
  {
    title: "Security Decisions for Non-Technical Teams",
    track: "technology",
    hours: 2,
    priceGbp: 99,
    promise: "Security Decisions for Non-Technical Teams teaches team leaders and office managers to see how their team really shares accounts, files and devices, and which of those habits could cause serious harm. You finish with an exposure list for your own team and three changes to make this week, each with an owner and a date.",
    modules: ["What you actually share", "What would hurt", "Three changes", "The exposure list"],
  },
  {
    title: "Digital Change for Managers",
    track: "technology",
    hours: 2,
    priceGbp: 129,
    promise: "Digital Change for Managers teaches line managers leading a change of tool to describe it as the things their people will stop and start doing, and to plan for the harder first two weeks. You finish with a two-week plan for your own team, so the change holds and every objection gets a proper answer.",
    modules: ["What they stop doing", "The first two weeks", "How you know", "The plan"],
  },
  {
    title: "Technology Decisions for Non-Technical Leaders",
    track: "technology",
    hours: 2,
    priceGbp: 149,
    promise: "Technology Decisions for Non-Technical Leaders teaches directors, heads of department and business owners to read a technology proposal in terms of the work and obligations being bought. You finish with a one-page decision note for a real proposal and a ninety-day test with a clear measure, so someone is accountable for the result.",
    modules: ["What you are buying", "Five questions", "Who owns the failure", "The ninety-day test"],
  },
  {
    title: "Connecting the Tools Your Team Already Uses",
    track: "technology",
    hours: 2.5,
    priceGbp: 129,
    promise: "Connecting the Tools Your Team Already Uses teaches operations leads and team managers to replace one handoff where work is retyped between two tools with a tested, tightly scoped connection. You finish with a handoff map showing exactly where a person must still check, and your team loses less time to double entry.",
    modules: ["The handoff", "Connect it", "Run this week's inputs", "The map"],
  },
  {
    title: "Running a Technology Rollout",
    track: "technology",
    hours: 2,
    priceGbp: 129,
    promise: "Running a Technology Rollout teaches project leads and operations managers to introduce a new tool in stages, from a small first group to the whole organisation. You finish with a rollout sheet that sets out the behaviour you expect, an owner and date for each group, and the sign that the tool has stuck.",
    modules: ["The behaviour", "Who and when", "Support, then stop", "The sign it stuck"],
  },
  {
    title: "Robotics for Non-Engineers",
    track: "robotics",
    hours: 2.5,
    priceGbp: 99,
    promise: "Robotics for Non-Engineers helps managers, planners and finance partners judge whether a robot could take on part of a process they own, with no engineering background needed. You finish with a one-page brief that ends in a decision of go or not yet, before any money is committed.",
    modules: ["What it could take", "What it cannot do", "The exception", "The brief"],
  },
  {
    title: "Collaborative Robots at Work",
    track: "robotics",
    hours: 2,
    priceGbp: 99,
    promise: "Collaborative Robots at Work teaches operators, team leaders and technicians who work alongside a cobot to start, stop and recover it in the right order, and to know when to call for help. You finish with a shift handover note the next shift can trust, so the robot runs safely between teams.",
    modules: ["What it is for", "Three drills", "When to call a person", "The handover"],
  },
  {
    title: "Where a Robot Belongs in the Process",
    track: "robotics",
    hours: 2.5,
    priceGbp: 129,
    promise: "Where a Robot Belongs in the Process teaches process owners, improvement engineers and production managers to break a process into tasks and mark each one for a robot, a person or not yet. You finish with a recommendation you can defend with the facts, so automation goes where it will actually pay.",
    modules: ["The tasks", "Robot, person, or not yet", "The easy step that is not", "The recommendation"],
  },
  {
    title: "Preparing a Team for Automation",
    track: "robotics",
    hours: 2,
    priceGbp: 99,
    promise: "Preparing a Team for Automation teaches team leaders, operations managers and HR partners to plan for everyone whose work will change when automation arrives. You finish with a preparation brief that states what each group must be able to do, which routines will stop and what is still undecided, so trust survives the change.",
    modules: ["Who is affected", "What they must do", "What stops", "The preparation brief"],
  },
  {
    title: "Warehouse and Logistics Automation",
    track: "robotics",
    hours: 2.5,
    priceGbp: 129,
    promise: "Warehouse and Logistics Automation teaches warehouse managers and logistics leads to map one goods flow from arrival to dispatch and separate what is measured from what is assumed. You finish with a one-page map showing where automation would pay and where it would make the flow worse, ready for a meeting with a supplier.",
    modules: ["The flow", "Where it pays", "The pile it will not touch", "The map"],
  },
  {
    title: "Specifying a Robotics Project",
    track: "robotics",
    hours: 2.5,
    priceGbp: 149,
    promise: "Specifying a Robotics Project teaches engineering managers, project leads and procurement professionals to write a specification for a robot cell that states outcomes rather than equipment. You finish with a one-page specification that sets acceptance measures, names who owns each stop and restart, and leaves a vendor no vague phrases to hide behind.",
    modules: ["Outcomes", "Volume and exceptions", "Who owns the stop", "The specification"],
  },
  {
    title: "Robotics Safety and Risk",
    track: "robotics",
    hours: 2,
    priceGbp: 129,
    promise: "Robotics Safety and Risk teaches managers and supervisors who walk areas with robots to understand how a cell keeps people safe and spot when a safeguard has been defeated. You finish with a floor walk note recording what you saw, what you asked and what you escalated, so serious issues are raised the same day.",
    modules: ["Shared space", "Stops and zones", "The floor walk", "Same-day escalation"],
  },
  {
    title: "Running a Robotic Cell",
    track: "robotics",
    hours: 2.5,
    priceGbp: 129,
    promise: "Running a Robotic Cell teaches operators, cell leaders and new technicians to start a robot cell in the right order and notice drift before it becomes a stop. You finish with a one-page shift card for your own cell, so every shift starts, recovers and hands over in the same dependable way.",
    modules: ["Start of shift", "What normal looks like", "Recover, then escalate", "The shift card"],
  },
  {
    title: "Vision Systems and Automated Inspection",
    track: "robotics",
    hours: 2,
    priceGbp: 129,
    promise: "Vision Systems and Automated Inspection teaches quality engineers and production managers to understand exactly what a camera inspection system is judging and how it can fail without raising an alarm. You finish with an inspection brief that includes a start-of-shift check and what a person must still inspect, so defects are not quietly missed.",
    modules: ["The judgement", "The quiet failure", "The human check", "The inspection brief"],
  },
  {
    title: "Robotics Investment Decisions",
    track: "robotics",
    hours: 2,
    priceGbp: 149,
    promise: "Robotics Investment Decisions teaches finance and operations directors to judge a robotics capital request on the process, the full cost of ownership and a realistic ramp-up rather than the brand. You finish with a written review that records the answers to five questions, or says which remain open, before the money is approved.",
    modules: ["The process", "Payback and people", "Five questions", "Ninety days on"],
  },
  {
    title: "AI for HR and People Teams",
    track: "hr",
    hours: 2.5,
    priceGbp: 99,
    promise: "AI for HR and People Teams teaches HR advisers, business partners and people operations staff to decide which tasks in their own week an AI tool may draft and which a person must decide. You finish with three reusable drafting briefs and a hold list of information you never paste, so employee data stays protected.",
    modules: ["Safe to draft", "Three patterns", "What you never paste", "The hold list"],
  },
  {
    title: "EU AI Act Literacy for HR and L&D",
    track: "hr",
    hours: 2,
    priceGbp: 129,
    promise: "EU AI Act Literacy for HR and L&D explains to HR and learning professionals what Article 4 of the EU AI Act asks of organisations and how to plan literacy measures by role. You finish with a role map and a record outline of measures taken, which prepares evidence without claiming anyone is compliant.",
    modules: ["What Article 4 asks", "The role map", "What a record contains", "What you will not claim"],
  },
  {
    title: "Redesigning Workplace Learning",
    track: "hr",
    hours: 2.5,
    priceGbp: 129,
    promise: "Redesigning Workplace Learning teaches learning and development practitioners and programme owners to rebuild one real programme around a skill people can show in their work. You finish with a one-page redesign sheet built on a realistic task and a check, so the programme proves what people can do rather than what they have watched.",
    modules: ["Why people finish nothing", "Skill, task, check", "Redesign one programme", "What the manager will see"],
  },
  {
    title: "Hiring and Selection with AI",
    track: "hr",
    hours: 2.5,
    priceGbp: 129,
    promise: "Hiring and Selection with AI teaches recruiters, HR advisers and hiring managers to decide which recruitment steps a model may draft and which a person must decide. You finish with a one-page selection standard for a real vacancy, covering fairer adverts, meaningful human review of shortlists and an audit trail your organisation can stand behind.",
    modules: ["What may be drafted", "What a person decides", "The audit trail", "The standard"],
  },
  {
    title: "Performance and Feedback with AI",
    track: "hr",
    hours: 2,
    priceGbp: 99,
    promise: "Performance and Feedback with AI teaches line managers and HR business partners to use AI only to prepare for a real feedback or performance conversation. You finish with a signed preparation sheet based on what you have seen rather than inferred, so the judgement is clearly your own and the conversation is fairer.",
    modules: ["What you may draft", "What you must have seen", "One conversation", "The sheet"],
  },
  {
    title: "AI Adoption for Line Managers",
    track: "hr",
    hours: 2.5,
    priceGbp: 129,
    promise: "AI Adoption for Line Managers teaches team leaders and supervisors to review work their people have produced with AI tools, using a short standard in regular one-to-ones. You finish with a one-page one-to-one standard card for your team, so work is checked and owned by the person who made it without you rewriting it.",
    modules: ["The standard", "Review the work", "Signs it stuck", "What you ask for next"],
  },
  {
    title: "Building a Workforce Skills Plan",
    track: "hr",
    hours: 2,
    priceGbp: 129,
    promise: "Building a Workforce Skills Plan teaches HR business partners, L&D leads and heads of function to build a skills plan from changes to the work that have already been decided. You finish with a one-page plan for the next two quarters, so training effort goes where the work is actually changing.",
    modules: ["The work that is changing", "Skills by role", "What you will not train", "The plan"],
  },
  {
    title: "HR Operations with AI",
    track: "hr",
    hours: 2,
    priceGbp: 99,
    promise: "HR Operations with AI teaches HR administrators and people operations staff to add one checked AI step to a repeating operation such as offer letters, onboarding or leaver processes. You finish with a written workflow a colleague could follow, including who checks what and how an error is caught before it reaches an employee.",
    modules: ["One operation", "The step a model may take", "The step a person keeps", "The workflow"],
  },
  {
    title: "Employee Data, Privacy and AI",
    track: "hr",
    hours: 2,
    priceGbp: 129,
    promise: "Employee Data, Privacy and AI teaches HR and people operations staff to recognise personal data about workers and decide what may go into an AI tool. You finish with a signed team rule, including a red-list and a clear answer for managers, so staff information stays protected.",
    modules: ["What counts", "The red-list", "The answer", "The team rule"],
  },
  {
    title: "Measuring Whether Training Stuck",
    track: "hr",
    hours: 2,
    priceGbp: 99,
    promise: "Measuring Whether Training Stuck teaches L&D practitioners, HR business partners and programme sponsors to look past completions and satisfaction scores to changes in the work itself. You finish with a measurement sheet for one real programme, with signs a manager can see two weeks later, so you can show whether the training made a difference.",
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
  hours: 3,
  priceGbp: 1,
  playable: true,
  promise:
    "Prompt Engineering for Professional Work teaches professionals to give AI tools clear, complete instructions and to check every reply before it is used. You finish with a signed prompt card your team can reuse, and fewer drafts that need rewriting or promise things nobody agreed.",
  modules: PROMPT_ENGINEERING_LESSONS.map((lesson) => lesson.title),
  lessons: PROMPT_ENGINEERING_LESSONS,
  artefact: {
    lessonId: "prompt-card",
    title: "The prompt card",
    recordLine: "Wrote and signed a prompt a colleague can run without asking what was meant.",
  },
};

export const SELF_SERVE_COURSES: SelfServeCourse[] = [
  PILOT,
  ...OUTLINES.map((course): SelfServeCourse => {
    const slug = slugify(course.title);
    const content = COURSE_CONTENT.find((item) => item.slug === slug);
    if (!content) {
      return {
        slug,
        title: course.title,
        track: course.track,
        promise: course.promise,
        hours: course.hours,
        priceGbp: course.priceGbp,
        playable: false,
        modules: course.modules,
      };
    }
    return {
      slug,
      title: course.title,
      track: course.track,
      promise: course.promise,
      hours: content.hours,
      priceGbp: course.priceGbp,
      playable: true,
      modules: content.lessons.map((lesson) => lesson.title),
      lessons: content.lessons,
      artefact: content.artefact,
    };
  }),
];

export function getSelfServeCourse(slug: string): SelfServeCourse | undefined {
  return SELF_SERVE_COURSES.find((course) => course.slug === slug);
}

export function coursesByTrack(track: SelfServeTrack): SelfServeCourse[] {
  return SELF_SERVE_COURSES.filter((course) => course.track === track);
}
