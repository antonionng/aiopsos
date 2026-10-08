import { agentCourseBlueprints } from "./catalogue.ts";

export type AgentCourseGroup =
  "Start here" | "Platform courses" | "Practical applications";
const artwork = "/courses/always-on-agents/";
const presentations: Record<
  string,
  { group: AgentCourseGroup; image: string; summary: string }
> = {
  "always-on-agent-foundations": {
    group: "Start here",
    image: "agent-collaboration.png",
    summary:
      "Choose a task you do regularly, write clear instructions for an AI agent and learn how to check its work.",
  },
  "working-with-openai-dots": {
    group: "Platform courses",
    image: "northstar-planning.png",
    summary:
      "Give a dot a regular task, connect the files and apps it needs, and check what it does while you are away.",
  },
  "working-with-grok-bot": {
    group: "Platform courses",
    image: "research-cover.png",
    summary:
      "Ask Grok Bot to keep track of a topic, check where its findings come from and decide when you need an update.",
  },
  "working-with-meta-muse": {
    group: "Platform courses",
    image: "agent-collaboration.png",
    summary:
      "Use Muse to help plan your week, manage changing priorities and ask you before making bookings or other important changes.",
  },
  "working-with-claude-cowork": {
    group: "Platform courses",
    image: "operations-cover.png",
    summary:
      "Ask Claude Cowork to work with your files, prepare regular reports and show you results you can check.",
  },
  "business-agents-copilot-studio": {
    group: "Platform courses",
    image: "teamwork-cover.png",
    summary:
      "Build an agent that helps sort business requests, uses the right records and asks a person when a decision needs approval.",
  },
  "running-your-own-agent-openclaw": {
    group: "Platform courses",
    image: "operations-cover.png",
    summary:
      "Set up an agent with OpenClaw, choose what it can access and learn how to keep it running and fix problems.",
  },
  "managing-agents-reliably": {
    group: "Practical applications",
    image: "northstar-review.png",
    summary:
      "Learn how to check an agent’s work, spot problems and restart a failed task without doing the same work twice.",
  },
  "agents-small-business-operations": {
    group: "Practical applications",
    image: "operations-cover.png",
    summary:
      "Use agents to help with regular business tasks, organise requests and prepare reports you can check before sharing.",
  },
  "agent-research-market-monitoring": {
    group: "Practical applications",
    image: "research-cover.png",
    summary:
      "Keep track of a topic, check new information against its sources and get an alert when something important changes.",
  },
  "content-operations-agents": {
    group: "Practical applications",
    image: "northstar-planning.png",
    summary:
      "Use agents to help write content, check the facts, choose helpful images and prepare drafts for approval.",
  },
  "agents-for-developers": {
    group: "Practical applications",
    image: "northstar-review.png",
    summary:
      "Give an agent a small coding task, review its changes and run tests to check that the code works.",
  },
  "coordinating-multiple-agents": {
    group: "Practical applications",
    image: "teamwork-cover.png",
    summary:
      "Give each agent a clear job, check how they pass work to each other and keep a person in charge of the final result.",
  },
};

export const agentMarketingCourses = agentCourseBlueprints.map((course) => ({
  ...course,
  ...presentations[course.slug],
  image: artwork + presentations[course.slug].image,
  href: `/courses/agents/${course.slug}`,
}));

export function getAgentMarketingCourse(slug: string) {
  return agentMarketingCourses.find((course) => course.slug === slug);
}
