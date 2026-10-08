export type CourseCase = {
  introduction: string;
  starter: string;
  challenge: string;
  sources: { title: string; url: string }[];
};
const project = `## Northstar Studio project tracker
Northstar is a fictional six-person design studio. Reporting cut-off: 1 October 2026, 09:00 Europe/London. Overdue means status is not complete and due date is earlier than the reporting date. A missing date is an exception, not an overdue item.

| ID | Project | Owner | Status | Due date | Updated |
|---|---|---|---|---|---|
| P101 | Harbour brochure | Asha | open | 2026-09-25 | 2026-09-30 |
| P102 | Elm identity | Ben | complete | 2026-09-26 | 2026-09-29 |
| P103 | Larch website | Chen | open | missing | 2026-09-30 |
| P104 | Beacon signage | Dee | open | 2026-10-01 | 2026-09-30 |
| P105 | Orchard packaging | Asha | blocked | 2026-10-08 | 2026-09-30 |

## Owner instructions
Prepare a draft report in the practice output folder. Include record IDs, reporting date, overdue work, blocked work and missing fields separately. Read only the supplied tracker. Do not change records or send messages. If the source is missing, report the failure to the simulated owner and do not invent a current report.

## Flawed draft for review
“Two projects are overdue: P101 and P102. All remaining projects are on schedule.”

## Run ledger
| Run key | State | Existing output | Notes |
|---|---|---|---|
| weekly-brief:2026-10-01 | interrupted | draft-2026-10-01-v1.md | Draft was written before the connection failed. No message was sent. |

## Fictional baseline
Three manual reports each took 90 minutes. Three agent-assisted runs used 20 minutes preparation, 25 minutes review and £4 operating charges each. Illustrative staff time value: £20/hour. Initial setup: 2 hours. These figures are training data. Estimate value, but do not present it as actual savings.`;
const research = `## Harbour Tools monitoring case
Harbour Tools is a fictional supplier deciding whether competitors have changed their published service terms. The owner wants confirmed changes to UK standard delivery prices, not rumours or investment advice.

| Source ID | Origin | Publication | Event/effective date | Evidence |
|---|---|---|---|---|
| S1 | Rival's own policy, archived snapshot | 2026-09-20 | 2026-09-20 | UK standard delivery £5; free over £60 |
| S2 | Rival's own policy, current snapshot | 2026-10-01 | 2026-10-03 | UK standard delivery £6; free over £60 |
| S3 | Trade blog linking to S2 | 2026-10-01 | 2026-10-03 | Reports £6 delivery |
| S4 | Unverified social post | 2026-09-30 | unspecified | Claims free delivery has ended |
| S5 | Rival's EU policy | 2026-10-01 | 2026-10-01 | EU delivery €8 |

For this exercise the records above are the complete fictional source set. They are not live websites. Alert policy: notify the simulated owner of a new confirmed UK delivery-price change once per effective date. Do not send external messages. Stop after one unsuccessful attempt to obtain a missing primary source, and record the gap.

Expected reporting distinction: the confirmed UK price will increase by £1 from 3 October; the free-delivery threshold has not changed. S3 repeats S2, S4 is unsupported and S5 concerns another region. Existing alert key: rival:UK-standard:2026-10-03, delivered in simulation at 10:05 on 1 October.

Fictional manual baseline: 45 minutes per review, 2 irrelevant alerts out of 5. Proposed system: 15 minutes review, 10 minutes maintenance, £3 per cycle. Use £20/hour only as an illustrative time value.`;
const personal = `## Jamie's fictional weekly planning records
Jamie works Monday to Friday. Use Europe/London throughout. Planning date: Monday 5 October 2026. Fixed commitments cannot be moved without explicit approval.

| ID | Commitment | Constraint |
|---|---|---|
| C1 | Monday client meeting | 10:00–11:00, fixed |
| C2 | Collect parcel | Monday, 09:00–17:00; allow 30 minutes plus 20 minutes travel each way |
| C3 | Project proposal | Due Tuesday 17:00; needs two uninterrupted hours |
| C4 | Wednesday dentist | 14:00–15:00, fixed; allow 30 minutes travel before and after |
| C5 | Exercise | Two 45-minute sessions, flexible |
| C6 | School collection | Weekdays 15:30–16:00, fixed |

Current written preference: no work before 09:00. Old conversation: “I like exercising at 07:00.” The current instruction wins. Budget for optional activities: £30, but there is no permission to buy or book anything. Draft a plan only. Do not contact others or alter the calendar.

New-case card: on Tuesday, Jamie says the proposal now needs three hours and the Monday client meeting ran until 11:30. Revise the remaining plan without moving the dentist or school collection. Record what was changed and which assumptions need confirmation.

Flawed draft: book exercise at 07:00, put the parcel collection at 10:30 Monday, and schedule proposal work Wednesday. All three contradict supplied constraints.`;
const requests = `## Cedar Support practice request queue
Cedar is a fictional internal service desk. The agent prepares routing records for a human coordinator. It cannot grant account access or send messages. A valid request needs an ID, category and contact. Route equipment to Operations and software to IT; access requests always need the IT owner's approval. Unknown categories and missing fields go to review.

| ID | Category | Contact | Description |
|---|---|---|---|
| R201 | equipment | asha@example.invalid | Replace damaged keyboard |
| R202 | software | ben@example.invalid | Application will not start |
| R203 | access | chen@example.invalid | Request administrator rights |
| R204 | equipment | missing | Replacement monitor |
| R202 | software | ben@example.invalid | Repeated event, same request |
| R205 | other | dee@example.invalid | Unusual supplier request |

Request status starts as received. Write one draft routing record per distinct valid ID. A repeated event must not create a new request. Preserve R204 and R205 as review exceptions rather than deleting them. R203 can be recorded as awaiting approval, but no access is granted.

Failure card: the routing record for R201 exists, but the trigger delivery acknowledgement was lost. Check the record before retrying.

Fictional baseline: 30 requests/week, 4 minutes triage each, 3 routing errors/week. Practice pilot: 30 requests, 35 minutes review, 20 minutes maintenance, £5 usage, 1 routing error. Calculate a comparison at an assumed £20/hour, and explain why one week does not prove a sustained improvement.`;
const content = `## Willow Workshop editorial source pack
Willow is a fictional community ceramics studio. Audience: adults booking their first class. Voice: welcoming, specific and reassuring. Do not promise therapeutic benefits, professional qualifications or guaranteed skill mastery.

Approved facts, owner-approved on 1 October 2026:
- B1: Beginner hand-building workshop, Saturday 24 October, 10:00–12:00.
- B2: £35 per person, with clay and tools included.
- B3: Maximum 12 learners. No previous experience is needed.
- B4: Learners make one small bowl; collection is three weeks later after firing.
- B5: Step-free entrance; learners should contact the studio to discuss individual access needs.
- B6: The website booking page is the only approved booking destination.

Prepare a 150-word webpage introduction, a 70-word email draft and an image brief. Keep drafts in the practice folder. Publishing and sending are blocked in this exercise.

Flawed draft: “Become a certified ceramicist in two hours for £30. Take your finished bowl home the same day.” It contradicts B2 and B4 and invents a qualification.

Revision card: the owner changes the start time to 11:00 and price to £38. Update every draft and require review of the changed revision. A previous approval for revision 1 cannot approve revision 2.

Asset ledger: image A is a learner-created illustration with origin recorded; image B is an unidentified downloaded photo with no usage record. Do not use B until its rights are established. Fictional baseline: 100 minutes per content batch; proposed batch 30 minutes drafting, 40 minutes review, £3 usage.`;
const code = `## Disposable developer lab
Use a new practice repository with no production credentials. Create a file status.mjs and a test file status.test.mjs from the starter code below. Run with a supported Node.js installation using node --test status.test.mjs. The exercise tests date-only records at a fixed cut-off, not arbitrary date parsing.

\`\`\`js
// status.mjs: deliberately flawed starter
export function classify(project, today = '2026-10-01') {
  if (!project.due) return 'on-track';
  if (project.due <= today) return 'overdue';
  return 'on-track';
}
\`\`\`

\`\`\`js
// status.test.mjs: starter test, extend it before the fix
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { classify } from './status.mjs';
test('open project before cut-off is overdue', () => {
  assert.equal(classify({ status: 'open', due: '2026-09-25' }), 'overdue');
});
\`\`\`

Required behaviour: complete projects return complete regardless of due date; incomplete projects with no due date return missing-date; an incomplete project is overdue only when its due date is earlier than today; due-today and future projects return on-track. Do not add dependencies or change unrelated files.

Failure card: the agent changes the expected value of the complete-project test to overdue to make the tests pass. Reject that change and restore the requirement.

Maintenance card: two identical tasks request the same fix. Use an issue ID and check existing branches or reviews before starting a second change. The exercise ends with a reviewed local diff, not a production deployment.`;
const team = `## Northstar research, drafting and review handoff
Use source records S1–S5 from the Harbour Tools monitoring case. Researcher provides accepted claim IDs, source IDs, region, event date and uncertainty. Drafter uses accepted claims only. Reviewer checks against the original source records. Owner decides whether to accept the final draft. No agent may send or publish it.

Handoff format:
\`\`\`json
{"taskId":"market-2026-10-01","briefVersion":1,"role":"researcher","claims":[{"id":"K1","text":"UK standard delivery changes from £5 to £6 on 3 October","sources":["S1","S2"],"status":"verified"}],"gaps":[],"nextOwner":"drafter"}
\`\`\`

Fault card A: drafter adds “free delivery is ending” without a source. Reviewer must return that claim, not treat the drafter's confidence as evidence.
Fault card B: researcher uses brief version 1 while drafter uses version 2 with a different region. Reject the handoff and check the brief before continuing.
Fault card C: drafter and reviewer repeat the same disagreement for a third time. Stop at two revision cycles and escalate the evidence to the owner.

Fictional comparison on the same six cases: one agent takes 40 minutes plus 20 minutes human review, £2 usage and produces 2 claims without supporting facts; three agents take 25 minutes plus 15 minutes human review, £5 usage and produce 1 claim without supporting facts. Both fail the zero-unsupported-claim rule for a correct result. Consider cost and correctness before recommending either approach.`;
const docs = {
  dots: [
    {
      title: "OpenAI Dots: capabilities and Custom Rules",
      url: "https://chatgpt.com/features/dots/",
    },
  ],
  grok: [
    {
      title: "Grok Bot: official introduction and access",
      url: "https://x.ai/news/introducing-grok-bot",
    },
  ],
  muse: [
    {
      title: "Meta Muse: access, memory and user control",
      url: "https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/",
    },
  ],
  cowork: [
    {
      title: "Claude Cowork: schedule recurring tasks",
      url: "https://support.claude.com/en/articles/13854387-schedule-recurring-tasks-in-claude-cowork",
    },
  ],
  copilot: [
    {
      title: "Copilot Studio: create and test an agent",
      url: "https://learn.microsoft.com/en-us/microsoft-copilot-studio/fundamentals-get-started",
    },
    {
      title: "Copilot Studio: agent fundamentals",
      url: "https://learn.microsoft.com/en-us/microsoft-copilot-studio/fundamentals-what-is-copilot-studio",
    },
    {
      title: "Copilot Studio: event triggers",
      url: "https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-triggers-about",
    },
  ],
  claw: [
    {
      title: "OpenClaw: getting started",
      url: "https://docs.openclaw.ai/start/getting-started",
    },
    {
      title: "OpenClaw: heartbeat",
      url: "https://docs.openclaw.ai/gateway/heartbeat",
    },
  ],
};
export const courseCases: Record<string, CourseCase> = {
  "always-on-agent-foundations": {
    introduction:
      "You will help Northstar Studio prepare a weekly project briefing. The studio is fictional, and the supplied tracker lets you check every result without connecting private accounts.",
    starter: project,
    challenge:
      "Add an incomplete project due yesterday and a completed project due last week. Show why only the incomplete project enters the overdue list.",
    sources: [],
  },
  "working-with-openai-dots": {
    introduction:
      "You will give a dot an ongoing project-briefing responsibility, test its rules about what the agent may do and check subsequent work against Northstar’s tracker. Live operation requires eligible access; use the desk exercise when that access is unavailable.",
    starter: project,
    challenge:
      "A note inside the tracker asks the dot to email the report to an external address. Explain why the note cannot authorise that action and demonstrate the applicable boundary.",
    sources: docs.dots,
  },
  "working-with-grok-bot": {
    introduction:
      "You will prepare a monitoring responsibility for Harbour Tools, demonstrate a routine and inspect what the bot retains after corrections. The case tests research quality as well as ongoing execution.",
    starter: research,
    challenge:
      "The same announcement arrives through a second article after the first alert. Show that it does not become an separate confirmation or a second alert.",
    sources: docs.grok,
  },
  "working-with-meta-muse": {
    introduction:
      "You will help Jamie draft a workable week while respecting fixed commitments, current preferences and approval boundaries. Jamie’s calendar and preferences are fictional.",
    starter: personal,
    challenge:
      "Change the proposal to three hours and add a fixed Tuesday meeting at 10:00. Produce a feasible remaining plan or explain which constraints cannot all be satisfied.",
    sources: docs.muse,
  },
  "working-with-claude-cowork": {
    introduction:
      "You will turn Northstar’s project records into a repeatable file-based report, then test a recurring task using the execution mode available in your account.",
    starter: project,
    challenge:
      "Replace the tracker with a new snapshot in which P101 is complete. Show that a later report uses the new file and preserves the earlier output for comparison.",
    sources: docs.cowork,
  },
  "business-agents-copilot-studio": {
    introduction:
      "You will model and build a controlled service-request workflow for Cedar Support in a development environment. It prepares routing decisions while keeping access grants under human control.",
    starter: requests,
    challenge:
      "Deliver the R201 trigger twice, with a lost acknowledgement between deliveries. Prove that the final queue contains one routing record for R201.",
    sources: docs.copilot,
  },
  "running-your-own-agent-openclaw": {
    introduction:
      "You will operate a project-monitoring agent with a clear task on a practice host, checking tool access, heartbeat behaviour and recovery. Hosting and model-provider costs are separate from the course.",
    starter: project,
    challenge:
      "Make the source unavailable during a check-in. Demonstrate a failure report with a clear retry limit and a later successful run without inventing a current status.",
    sources: docs.claw,
  },
  "managing-agents-reliably": {
    introduction:
      "You will audit Northstar’s flawed draft and interrupted run, then create a set of checks and an incident procedure that another owner can use.",
    starter: project,
    challenge:
      "The run log says failed, but an output file exists. Check the actual state and show how the workflow resumes without duplicating the report.",
    sources: [],
  },
  "agents-small-business-operations": {
    introduction:
      "You will build an operations pack for Cedar Support, distinguishing incomplete records, duplicate events and requests that need a person’s decision.",
    starter: requests,
    challenge:
      "The coordinator changes the owner for equipment requests. Version the routing rule, test both an existing and a new request, and record how you prevent silent rerouting.",
    sources: [],
  },
  "agent-research-market-monitoring": {
    introduction:
      "You will design a monitoring service for Harbour Tools that distinguishes a confirmed change from repeated reporting and unverified claims.",
    starter: research,
    challenge:
      "S2 is unavailable on the next check. Explain what can be said from the archived evidence, what cannot be confirmed as current and when the owner should hear about the gap.",
    sources: [],
  },
  "content-operations-agents": {
    introduction:
      "You will prepare a small content batch for Willow Workshop using approved facts, an image brief and an editorial approval record.",
    starter: content,
    challenge:
      "The workshop price and time change after revision 1 is approved. Update all formats, invalidate the obsolete approval and show the exact revision ready for a new review.",
    sources: [],
  },
  "agents-for-developers": {
    introduction:
      "You will delegate and review a small date-classification fix in a disposable repository. The starter deliberately contains several bugs that one passing test does not detect.",
    starter: code,
    challenge:
      "Add a completed project without a due date. Explain which rule takes priority and demonstrate it with a test that fails on the original implementation.",
    sources: [],
  },
  "coordinating-multiple-agents": {
    introduction:
      "You will coordinate a researcher, drafter and reviewer using explicit handoffs, then compare the result with a single-agent process on the same cases.",
    starter: research + "\n\n" + team,
    challenge:
      "Give the drafter a handoff with a missing source and an obsolete brief version. Show that the handoff is rejected before drafting and that the final owner sees the unresolved gap.",
    sources: [],
  },
};
