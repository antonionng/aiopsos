export type AgentCourseBlueprint = {
  slug: string;
  title: string;
  audience: string;
  prerequisites: string;
  capstone: string;
  modules: readonly { title: string; evidence: string }[];
};

export const AGENT_COURSE_PRICE_GBP = 99;

// Course specifications. Authored teaching packs are assembled in courses.ts; commercial release is separate.
export const agentCourseBlueprints: readonly AgentCourseBlueprint[] = [
  {
    slug: "always-on-agent-foundations",
    title: "Always-On Agents: Foundations",
    audience:
      "People who want help with tasks they do regularly at work or in their business.",
    prerequisites:
      "Basic file and browser skills. Practice can use the supplied fictional scenario.",
    capstone:
      "Set up a task that prepares a weekly project report. Write its instructions, check the results, practise fixing a problem, track the costs and explain how someone else can run it.",
    modules: [
      {
        title: "Choose a task you do every day or week",
        evidence:
          "A list of possible tasks and a record of how long they take today",
      },
      {
        title: "Write clear instructions for your agent",
        evidence:
          "Written instructions and two examples showing what a correct result looks like",
      },
      {
        title: "Choose what your agent can see and do",
        evidence:
          "A list of information the agent can use and actions it is allowed to take",
      },
      {
        title: "Set a schedule and check the results",
        evidence:
          "A schedule and a checked result showing which records you used",
      },
      {
        title: "Fix problems and keep costs under control",
        evidence:
          "A practice problem, a check for repeated work and a cost worksheet",
      },
      {
        title: "Show how your task works and explain it to someone else",
        evidence:
          "Your finished project, the records of your checks and a discussion with a reviewer",
      },
    ],
  },
  {
    slug: "working-with-openai-dots",
    title: "Working with OpenAI Dots",
    audience:
      "People who want to delegate ongoing research, reporting or project responsibilities in ChatGPT.",
    prerequisites:
      "Eligible Dots access in a supported region, plus the foundation refresher.",
    capstone:
      "Configure and evaluate a dot that maintains a project briefing, flags meaningful changes and prepares reviewable updates.",
    modules: [
      {
        title: "Get to know your dot and where it works",
        evidence:
          "Access and environment checklist with cloud/local dependencies",
      },
      {
        title: "Give your dot a task to keep working on",
        evidence:
          "Dot instructions with checks for a correct result and stop rules",
      },
      {
        title: "Connect your apps and choose what your dot can do",
        evidence: "Tested app access and Custom Rules record",
      },
      {
        title: "Check the work and give your dot better information",
        evidence: "Annotated outputs and a corrected follow-up run",
      },
      {
        title: "Pause your dot and deal with problems",
        evidence: "Missing-source and conflicting-instruction drills",
      },
      {
        title: "Show how your dot helps with a real task",
        evidence: "Run history, source verification and project explanation",
      },
    ],
  },
  {
    slug: "working-with-grok-bot",
    title: "Working with Grok Bot",
    audience: "Professionals evaluating ongoing agent work using Grok Bot.",
    prerequisites:
      "Eligible Grok Bot access and verified availability of the integrations used in the course.",
    capstone:
      "Build and evaluate a monitoring and briefing workflow with references that support its findings with clearly scoped actions and a recovery plan.",
    modules: [
      {
        title: "Check what your bot can do",
        evidence:
          "A verified record of available features and running requirements",
      },
      {
        title: "Give your bot a clear task",
        evidence:
          "Instructions, tasks to leave out and examples of correct results",
      },
      {
        title: "Choose the information and actions your bot can use",
        evidence: "Source map and integration access record",
      },
      {
        title: "Check the findings and decide when you need an alert",
        evidence: "Claim-by-claim verification and alert relevance log",
      },
      {
        title: "Deal with old information and unfinished work",
        evidence: "Practice recovery exercise and intervention record",
      },
      {
        title: "Compare your bot’s work with how you did the task before",
        evidence: "Final project, cost comparison and individual follow-up",
      },
    ],
  },
  {
    slug: "working-with-meta-muse",
    title: "Working with Meta Muse",
    audience: "People delegating personal planning and administrative work.",
    prerequisites:
      "Eligible Muse access; fictional calendar and message examples are supplied.",
    capstone:
      "Create a personal planning workflow that proposes a weekly plan, resolves conflicts and leaves actions that affect other people or records for approval.",
    modules: [
      {
        title: "Set up Muse and choose something you need help with",
        evidence: "A clearly scoped goal and verified access checklist",
      },
      {
        title: "Tell Muse what it needs to know and remember",
        evidence:
          "List of useful information and a demonstrated correction or forgetting action",
      },
      {
        title: "Choose what Muse can do and when it must ask you",
        evidence: "Personal app permissions and action decision table",
      },
      {
        title: "Make a plan that fits your week",
        evidence: "A checked plan based on fictional constraints",
      },
      {
        title: "Update the plan when your needs change",
        evidence: "Changed-goal and conflicting-calendar drills",
      },
      {
        title: "Show how Muse helps you stay organised",
        evidence: "Plan comparison, review record and project explanation",
      },
    ],
  },
  {
    slug: "working-with-claude-cowork",
    title: "Working with Claude Cowork",
    audience:
      "Office professionals automating recurring file and reporting work.",
    prerequisites:
      "Eligible Cowork access and an environment that meets the documented execution requirements.",
    capstone:
      "Produce a recurring weekly briefing from supplied files, with traceable facts, a reusable saved instructions and missed-run recovery.",
    modules: [
      {
        title: "Set up your files and check how Cowork runs",
        evidence:
          "Working folder, access boundaries and verified local or remote execution requirements",
      },
      {
        title: "Ask Cowork to help with a task at work",
        evidence: "A task brief and accepted sample result",
      },
      {
        title: "Save useful instructions and connect the tools you need",
        evidence: "A reusable skill or saved instructions and tool test",
      },
      {
        title: "Set up a regular task and check the result",
        evidence: "Schedule evidence and a source-checked report",
      },
      {
        title: "Fix missing files, failed tasks and incorrect results",
        evidence: "A failed-run recovery record and safe revision",
      },
      {
        title: "Show how Cowork prepares a report each week",
        evidence: "Final project, handover and individual follow-up",
      },
    ],
  },
  {
    slug: "business-agents-copilot-studio",
    title: "Business Agents with Microsoft Copilot Studio",
    audience: "Business process owners and Microsoft ecosystem makers.",
    prerequisites:
      "A suitable development environment, licensing and basic process mapping skills.",
    capstone:
      "Build a fictional service request handling agent that validates a request, prepares routing and escalates exceptions.",
    modules: [
      {
        title: "Describe how the task works today",
        evidence: "Request handling map, ownership and success measures",
      },
      {
        title: "Build your agent and give it the right information",
        evidence:
          "Configured agent and example answers linked to their sources",
      },
      {
        title: "Connect tools and choose which actions need approval",
        evidence: "Connector tests and action permissions",
      },
      {
        title: "Choose when the task starts and who checks it",
        evidence: "End-to-end fictional request run",
      },
      {
        title: "Test what happens when something goes wrong",
        evidence: "Invalid-input, duplicate and failure tests",
      },
      {
        title: "Plan a small trial with your team",
        evidence:
          "Final project solution, reversal and recovery plan and owner handover",
      },
    ],
  },
  {
    slug: "running-your-own-agent-openclaw",
    title: "Running Your Own Agent with OpenClaw",
    audience:
      "Technical learners who want to operate and maintain their own agent.",
    prerequisites:
      "Command-line confidence, a supported host and a model provider account with a controlled budget.",
    capstone:
      "Operate a clearly scoped monitoring agent with a regular check-in (heartbeat), explicit tool permissions, run records and a tested recovery procedure.",
    modules: [
      {
        title: "Choose a computer and set up your agent",
        evidence: "Environment inventory and successful setup checks",
      },
      {
        title: "Connect an AI model and choose the tools it can use",
        evidence:
          "Configuration record with private details removed, plus access checks",
      },
      {
        title: "Give your agent instructions and useful information",
        evidence: "Saved instructions and memory correction example",
      },
      {
        title: "Set up regular checks and useful alerts",
        evidence: "Test runs and useful-notification criteria",
      },
      {
        title: "Track costs and get your agent working again",
        evidence: "Interrupted-run, budget and duplicate tests",
      },
      {
        title: "Keep your agent running and explain it to the next person",
        evidence:
          "Final project, maintenance guide and reversal and recovery demonstration",
      },
    ],
  },
  {
    slug: "managing-agents-reliably",
    title: "Managing Agents Reliably",
    audience:
      "Anyone responsible for agents that continue working between conversations.",
    prerequisites:
      "One configured agent or the supplied simulation and fictional run logs.",
    capstone:
      "Audit and improve a flawed workflow, then demonstrate permission checks, verification, incident recovery and measurable value.",
    modules: [
      {
        title: "Decide who is responsible and write down the task",
        evidence: "Responsibility inventory and accountable owner map",
      },
      {
        title: "Choose what your agent can see and do",
        evidence: "Table of allowed actions and boundary challenge results",
      },
      {
        title: "Make a set of examples to test your agent",
        evidence: "Success, ambiguity and problem-situation set of checks",
      },
      {
        title: "Fix a failed task without doing the same work twice",
        evidence: "Incident timeline and a tested recovery procedure",
      },
      {
        title: "Track spending, checking time and useful alerts",
        evidence: "Cost model and notification tuning comparison",
      },
      {
        title: "Check that the task works and explain it to someone else",
        evidence: "Audit findings, corrected workflow and project explanation",
      },
    ],
  },
  {
    slug: "agents-small-business-operations",
    title: "Agents for Small Business Operations",
    audience: "Small business owners and operations staff.",
    prerequisites:
      "Basic spreadsheet skills; use fictional business records for practice.",
    capstone:
      "Build a weekly operations pack that identifies outstanding work and prepares owner updates without silently changing business records.",
    modules: [
      {
        title: "Find a task that takes up too much time",
        evidence: "Task starting measurements and ranked opportunities",
      },
      {
        title: "Get your business records ready",
        evidence: "Field definitions and source ownership map",
      },
      {
        title: "Decide who receives each task and who checks the work",
        evidence: "Workflow and permission decision table",
      },
      {
        title: "Prepare a useful report each week",
        evidence: "Checkd report with traceable claims",
      },
      {
        title: "Deal with repeated tasks and missing information",
        evidence: "Exception log and recovery demonstration",
      },
      {
        title: "Check whether the agent helps and plan a small trial",
        evidence: "Final project pack and a 30-day adoption plan",
      },
    ],
  },
  {
    slug: "agent-research-market-monitoring",
    title: "Research and Market Monitoring with Agents",
    audience: "Researchers, business owners and market analysts.",
    prerequisites:
      "Basic source evaluation skills; no live commercial dataset is required.",
    capstone:
      "Create a monitoring brief that distinguishes new evidence, repeated reports and uncertain claims, and sends only meaningful alerts.",
    modules: [
      {
        title:
          "Choose a research question and decide what counts as a reliable answer",
        evidence: "Research contract and relevance criteria",
      },
      {
        title: "Choose your sources and check when they were updated",
        evidence: "List of sources with publication and event dates",
      },
      {
        title: "Set up regular checks for important changes",
        evidence: "Starting measurements snapshot and change log",
      },
      {
        title: "Check the findings and explain what is still unclear",
        evidence: "Claim-to-source table and challenged finding",
      },
      {
        title: "Make alerts useful and deal with missing sources",
        evidence: "Alert usefulness log and fallback test",
      },
      {
        title: "Show how you track changes and check the findings",
        evidence: "Final project brief, test set and individual follow-up",
      },
    ],
  },
  {
    slug: "content-operations-agents",
    title: "Content Operations with Agents",
    audience: "Content creators and marketing teams.",
    prerequisites:
      "A fictional brand brief is supplied; basic editing skills are sufficient.",
    capstone:
      "Build a repeatable content preparation workflow with source checks, editorial review, accessible assets and revision tracking.",
    modules: [
      {
        title: "Decide who you are writing for and how you want to sound",
        evidence: "Brand brief and editorial examples of correct results",
      },
      {
        title: "Check the facts before you write",
        evidence: "Source inventory and fact-check table",
      },
      {
        title: "Write your drafts and choose helpful images",
        evidence: "Draft set, image brief and rights/source record",
      },
      {
        title: "Decide who checks and approves each draft",
        evidence: "Editorial workflow with publishing boundary",
      },
      {
        title: "Correct the content and avoid publishing it twice",
        evidence: "Revision history and duplicate test",
      },
      {
        title: "Finish your content and check how much time it took",
        evidence: "Final project pack and quality/effort comparison",
      },
    ],
  },
  {
    slug: "agents-for-developers",
    title: "Agents for Developers",
    audience:
      "Developers delegating clearly scoped software work and maintenance.",
    prerequisites:
      "Git, code review and testing experience; a disposable practice repository is required.",
    capstone:
      "Delegate a maintenance change, inspect its diff and tests, and demonstrate recovery without granting unattended production deployment.",
    modules: [
      {
        title: "Describe the code change and how you will test it",
        evidence: "Issue brief and meaningful test plan",
      },
      {
        title: "Set up a separate place to work on the code",
        evidence:
          "Workspace, secret boundaries and reversal and recovery check",
      },
      {
        title: "Ask your agent to make a change you can review",
        evidence: "Bounded change and reasoning record",
      },
      {
        title: "Check the code, tests and any added packages",
        evidence: "Diff review and verified test results",
      },
      {
        title: "Fix failed checks and avoid repeating the same change",
        evidence: "Failure recovery and duplicate change prevention",
      },
      {
        title: "Explain your change and show that it works",
        evidence:
          "Final project pull request, handover and individual follow-up",
      },
    ],
  },
  {
    slug: "coordinating-multiple-agents",
    title: "Coordinating Multiple Agents",
    audience:
      "Experienced agent users coordinating research, drafting and review responsibilities.",
    prerequisites:
      "Completion of one practical agent project or equivalent experience.",
    capstone:
      "Coordinate a researcher, drafter and reviewer through explicit handoffs, clearly scoped authority and an accountable final owner.",
    modules: [
      {
        title: "Decide whether you need more than one agent",
        evidence: "Single-agent starting measurements and justified role split",
      },
      {
        title: "Give each agent a clear job and the information it needs",
        evidence: "Instructions for each agent and list of records to follow",
      },
      {
        title: "Decide how agents pass work to each other",
        evidence:
          "Format for passing work between agents and rejected-input example",
      },
      {
        title: "Run the agents together and check their work",
        evidence: "End-to-end run with traceable responsibility",
      },
      {
        title: "Deal with disagreements and work that gets stuck",
        evidence:
          "Conflict and limits on repeated attempts drills with cost records",
      },
      {
        title: "Compare the team with using one agent",
        evidence: "Final project, comparative evaluation and owner handover",
      },
    ],
  },
];
