import type { InsightArticle } from "../types.ts";

// Original working methods and illustrative scenarios. Publisher-selected editorial dates.
// These guides make no claims about customer results or guaranteed savings.
export const hrAndAgenticGuides: InsightArticle[] = [
{
  slug: "hr-transformation-roadmap-template",
  title: "HR transformation roadmap: a practical 90-day template",
  description: "Build an HR transformation roadmap around employee journeys, reliable data and accountable delivery. Includes a 90-day plan and a copyable project brief.",
  dek: "Connect people, processes and technology before buying another system. Start with one service your employees need to work better.",
  publishedAt: "2026-09-09", topic: "HR transformation",
  relatedCourseSlugs: ["hr-transformation-strategy-and-roadmap", "hris-selection-and-integration"],
  body: `
## What belongs in an HR transformation roadmap?

An HR transformation roadmap connects a business problem to changes in people services, working practices, information and technology. It should explain what will improve for employees, who owns the change, what must happen first and what evidence will show progress. A software implementation schedule is only one part of that picture.

The 90-day approach below is a suggested starting framework. Adjust it to your capacity and the complexity of your services. Its purpose is to produce a tested improvement and a defensible next decision, rather than promise that a whole HR function can be transformed in three months.

## Days 1 to 30: understand one employee journey

Choose a service with a clear beginning and end. Onboarding is useful because a new starter experiences the combined work of HR, their manager and IT. Map a fictional or appropriately redacted example from accepted offer to the first useful day at work.

Record each handover, the information required and the person responsible. Ask where the employee has to chase progress or repeat information. Include exceptions: a changed start date, an unavailable manager or an accessibility requirement. Invite the people doing the work to correct your map.

Establish a baseline you can actually reproduce. For example, count how many starters receive their agreed essentials by the agreed date. Record the denominator and the definition of “essentials”. A percentage without either can improve simply because somebody changed the calculation.

## Days 31 to 60: design and test the improvement

Choose a small change that addresses the observed problem. Perhaps the service needs a shared owner and a visible checklist before it needs an AI assistant. Define the system that holds each record and how another team learns that a task is ready.

Use a test environment and fictional records to walk through the ordinary journey and its exceptions. Check what happens when the same request arrives twice, information is missing or the workflow stops halfway through. An employee should have a clear route to a person when the digital journey cannot continue.

If an agent is part of the proposal, specify its allowed actions and review points. The [HR automation checklist](/insights/hr-process-automation-checklist) helps turn an idea into a bounded pilot.

## Days 61 to 90: review evidence and decide

Compare the pilot with your baseline using the same definitions. Look at service quality, employee effort and the work transferred to another team. Faster HR handling is not a useful improvement if managers spend longer repairing the result.

Review a sample of completed cases as well as the dashboard. Document exceptions, staff feedback and unresolved dependencies. Decide whether to continue, revise or stop the pilot. Give the next phase a named owner and the resources it requires.

## Copy this roadmap brief

- **Employee problem:** what is difficult today, and for whom?
- **Service boundary:** where does the journey start and finish?
- **Baseline:** what will you compare, using which definition?
- **Proposed change:** what will people do differently?
- **Dependencies:** which records, teams and permissions are needed?
- **Owner:** who can decide and who will operate the service?
- **Pilot evidence:** what would justify expanding the change?
- **Stop condition:** what would make you pause and investigate?

Keep this brief beside the delivery plan. When a feature request arrives, ask which part of the brief it improves. This gives HR, IT and business leaders a shared way to discuss priorities.

## Build the capability to deliver

Use [HR Transformation Strategy & Roadmap](/courses/hr-transformation-strategy-and-roadmap) to develop the plan with a facilitator, or [HRIS Selection & Connected People Systems](/courses/hris-selection-and-integration) when requirements and integration are the immediate challenge. Explore the [HR academy](/courses?category=hr) for the wider team, or [talk to Experrt](/contact) about a programme shaped around your service.
`,
},
{
  slug: "ai-in-hr-use-cases-and-pilot-plan",
  title: "AI in HR: practical use cases and a first-pilot plan",
  description: "Choose useful AI applications in HR, define human review and test a small pilot. Includes examples for people operations, knowledge and communications.",
  dek: "Start with a bounded task, approved information and a result somebody can check. Here is how to choose that first HR pilot.",
  publishedAt: "2026-09-07", topic: "HR transformation",
  relatedCourseSlugs: ["ai-for-everyday-hr", "hr-knowledge-and-employee-self-service"],
  body: `
## Where should an HR team start with AI?

Start where the task is well understood, suitable information is available and a person can check the output before it affects an employee. Drafting an internal communication from an approved brief is a different proposition from deciding who should be hired. Treat those differences as central to your pilot design.

This guide proposes a way to choose and evaluate work. It is not a recommendation to upload employee records into an unapproved tool. Use fictional examples while designing the pilot, and agree the information boundaries with the relevant owners before moving into real work.

## Three useful starting scenarios

**HR communications:** give the assistant a fictional approved brief and ask it to draft a clear message for employees. The reviewer checks dates, commitments, tone and whether the draft invents any benefit or entitlement. The useful output is a reviewed draft, not an automatically sent message.

**Knowledge preparation:** ask for a draft structure for a self-service knowledge base using sample guidance. A content owner checks whether each answer has an authoritative source, a review date and a sensible escalation route. Do not treat a fluent answer as evidence that the underlying policy exists.

**Service administration:** use a synthetic request to explore intake classification and routing. Define the allowed destinations and what happens when the request is ambiguous. Test whether the assistant sends uncertain cases to a person rather than confidently choosing the wrong team.

These scenarios are deliberately narrow. A pilot that teaches you how to verify a result is more informative than a demonstration that appears to handle every possible HR question.

## Score the task before selecting the tool

For each candidate, write down frequency, the current effort, the consequence of error, the information required and the available reviewer. Avoid collapsing everything into one unexplained score. A frequent task may still be a poor first pilot if nobody can establish whether the answer is correct.

Choose a task with a clear finish line. “Improve HR productivity” is too broad. “Draft a starter welcome message from these approved facts, highlighting any missing information” can be tested.

If the difficulty is an unclear process, use the [HR transformation roadmap](/insights/hr-transformation-roadmap-template) before adding automation.

## Build a small evaluation set

Prepare examples of an ordinary request, missing information, conflicting source material and a request outside the assistant's remit. Write the expected behaviour for each before running the tool. This reduces the temptation to accept a plausible result simply because it reads well.

Record the task version, sources supplied, output, reviewer decision and necessary corrections. Measure the whole handling time, including review and repair. An assistant that drafts quickly but creates extra checking work may not improve the service.

Agree what would stop the pilot. Examples include disclosing information outside the permitted audience, inventing a policy statement or taking an action without the required approval. Give the team a clear way to report these failures.

## Decide what to do after the pilot

Review the results with the people who operate the service. Separate problems that better source material can solve from limitations that require a different workflow. Decide whether to expand the task, keep it narrow or stop using the tool for that purpose.

For a facilitated introduction, explore [AI for Everyday HR](/courses/ai-for-everyday-hr). For source-backed assistance, use [HR Knowledge & Employee Self-Service](/courses/hr-knowledge-and-employee-self-service). [Talk to Experrt](/contact) if you want to develop a pilot and the team's verification skills together.
`,
},
{
  slug: "hr-process-automation-checklist",
  title: "HR process automation: a checklist for reliable people services",
  description: "Plan HR automation with clear triggers, permissions, exception handling and service measures. Includes a copyable workflow checklist and onboarding example.",
  dek: "The happy path is easy to demonstrate. Design the missing information, duplicate requests and human handovers before launch.",
  publishedAt: "2026-09-04", topic: "HR transformation",
  relatedCourseSlugs: ["people-operations-workflow-automation", "redesigning-hr-services-with-agents"],
  body: `
## What makes an HR process ready for automation?

A process is a useful candidate when its purpose, inputs, ownership and exceptions are understood. Automation can move a request between steps, but it cannot resolve an argument about which team owns the service. Settle the operating rules before turning them into a workflow.

Begin by writing the process in plain language. Explain what starts it, what counts as completion and how an employee knows what happens next. If two experienced team members describe different processes, compare real examples and agree which variation is intentional.

## Work through a fictional onboarding request

Imagine that HR confirms a starter date and the workflow creates a manager checklist and an IT request. The happy path is straightforward. Now change the start date. Should the existing tasks be updated, cancelled or replaced? Who checks that equipment has not already been dispatched?

Next, submit the same starter request twice. A reliable workflow recognises the existing case rather than creating duplicate accounts or tasks. Finally, remove the manager field. The workflow should ask for the missing information and show who owns the unresolved request.

This exercise exposes requirements that are easy to miss in a feature demonstration. Use fictional people and test systems while working through it.

## Copy the workflow checklist

- **Trigger:** what event starts the process, and which system provides it?
- **Required inputs:** what must be present before work continues?
- **Authoritative record:** where should the final state be stored?
- **Permissions:** which records and actions can each participant access?
- **Approvals:** what needs a person's decision before proceeding?
- **Duplicate handling:** how is an existing request recognised?
- **Failure recovery:** can a paused step resume without repeating completed work?
- **Escalation:** who receives an exception, with what information?
- **Employee visibility:** how can someone see status and ask for help?
- **Audit evidence:** what happened, when and under whose authority?
- **Service measures:** how will quality and effort be assessed?

The [downloadable workflow worksheet](/resources/hr-automation-checklist.csv) gives you these prompts in a spreadsheet-friendly format. Keep an owner and acceptance example beside every requirement.

## Where does an AI agent fit?

Some steps involve interpretation rather than a fixed rule. An agent might propose a category for an unclear request or draft an answer from approved guidance. Define the allowed outputs and keep the next action conditional on appropriate validation.

Do not make “the AI decides” your exception policy. Decide what happens when the agent lacks evidence, has conflicting sources or is asked to act outside its authority. A request reaching a person with the relevant context can be a successful outcome.

Read [what an agentic LMS should actually do](/insights/what-is-an-agentic-lms) for a similar distinction between helpful conversation and accountable action in learning operations.

## Measure service improvement, not just automation volume

Count completed cases, reopenings, incorrect routing and unresolved exceptions. Define the time window and the cases included. Review employee effort as well as HR handling time: asking people to fill in a longer form can move work rather than remove it.

Run a limited pilot and inspect individual cases alongside aggregate measures. Keep the former process available where necessary until the team understands how to recover from failures. Document who can change the workflow after launch and how changes will be tested.

For hands-on design, explore [People Operations Workflow Automation](/courses/people-operations-workflow-automation) or [Redesigning HR Services with AI Agents](/courses/redesigning-hr-services-with-agents). [Talk to Experrt](/contact) about turning a service problem into a practical team workshop.
`,
},
{
  slug: "people-analytics-dashboard-metrics",
  title: "People analytics dashboards: choose metrics that answer a decision",
  description: "Plan a people analytics dashboard with clear metric definitions, ownership and interpretation. Includes an HR service example and a metric brief template.",
  dek: "A dashboard becomes useful when somebody knows which decision it supports. Start there, then decide what to count.",
  publishedAt: "2026-09-02", topic: "HR transformation",
  relatedCourseSlugs: ["people-analytics-for-hr-decisions", "hr-data-quality-and-connected-records"],
  body: `
## What should a people analytics dashboard show?

Show the measures that help a named audience make a specific decision. An HR service manager reviewing unresolved requests needs different information from a leader deciding whether to invest in onboarding. Put the decision, metric definition and source beside the chart before adding more visualisation.

This guide uses a fictional HR service example. It proposes a planning method rather than a universal set of benchmarks. Your measures should reflect the service you operate and the information you can use appropriately.

## Start with one decision

Suppose the team needs to decide whether to change how onboarding requests are routed. A total count of tickets tells you how busy the queue is, but not whether routing is the problem. You might also examine reassignments, time waiting for missing information and cases reopened after being marked complete.

Discuss what each measure can and cannot establish. A long case duration could reflect a difficult request, a delayed response or a deliberately early submission. It does not automatically identify poor performance by the person handling it.

## Write a metric definition before building the chart

Use the following brief for every measure:

- **Decision:** what action might change after reviewing the result?
- **Definition:** exactly what is counted or calculated?
- **Population:** which people or cases are included and excluded?
- **Time period:** does the measure use opened, closed or active cases?
- **Source and owner:** where does the information come from, and who checks it?
- **Known limitations:** what is incomplete, inconsistent or open to interpretation?
- **Review action:** who investigates a change and how?

For “onboarding readiness”, define the required tasks and the agreed readiness date. Include the total number of eligible starters alongside the percentage. A small population can produce a large percentage change from only one case.

## Check the records behind the measure

Inspect a sample before drawing conclusions. Look for duplicate cases, missing completion times, inconsistent categories and records that changed system halfway through the period. Keep a note of corrections rather than silently revising historical numbers.

If the data cannot support the question, change the question or improve collection. AI-generated explanations cannot repair an undefined metric. The [HR automation checklist](/insights/hr-process-automation-checklist) helps identify where reliable events should be recorded in the workflow.

## Use AI as an assistant to interpretation

An assistant can draft a plain-language description of a supplied table or suggest questions to investigate. Check every numerical statement against the table and distinguish observed patterns from possible explanations. Ask it to state what the data does not show.

For example, a rise in reopened cases after a workflow change is a reason to investigate. It does not prove that the change caused the increase. Compare case types and inspect examples before deciding what to do next.

Limit access to the information the audience needs. Consider whether a filtered chart could identify individuals in a small group. Agree appropriate aggregation and access controls with your information owners before publishing the dashboard.

## Make the review part of the service

Give the dashboard a review cadence and an action log. Record the question raised, evidence checked, decision taken and the next review date. Retire measures that nobody uses to make a decision; adding charts indefinitely makes the important signals harder to find.

Develop the approach in [People Analytics for Better HR Decisions](/courses/people-analytics-for-hr-decisions), or address the foundations with [HR Data Quality & Connected Records](/courses/hr-data-quality-and-connected-records). [Talk to Experrt](/contact) about a practical programme using synthetic examples from your type of service.
`,
},
{
  slug: "what-is-an-agentic-lms",
  title: "What is an agentic LMS? A practical buyer's guide",
  description: "Understand an agentic LMS, how it differs from chat assistance, and what to test for permissions, reliable actions, learning records and human review.",
  dek: "Ask what the system can complete, what it records and how it recovers. A convincing conversation is only the beginning.",
  publishedAt: "2026-08-31", topic: "Learning platforms",
  relatedCourseSlugs: ["learning-operations-and-ai-enabled-development", "redesigning-hr-services-with-agents"],
  body: `
## A working definition of an agentic LMS

For this guide, an agentic LMS is a learning management system in which an AI agent can carry out bounded learning or administration tasks using authorised tools and records. The agent might prepare a course draft, propose a programme or assemble evidence for a reviewer. Its actions still need clear ownership, permissions and observable results.

Treat this as a buying definition, not a certification label. Ask a supplier to demonstrate the behaviour behind the term. The useful distinction is whether the system progresses work reliably, rather than whether its assistant sounds conversational.

## Chat assistance and agent action serve different needs

A learner asking for an explanation may need a conversation. A training manager asking for a draft programme needs an output they can inspect, edit and find again. A provider asking to enrol a customer cohort needs a controlled action that respects the customer's records and the provider's authority.

A good experience can combine these modes. The interface should explain whether the agent is answering, drafting, waiting for review or completing an authorised action. Avoid making the user infer the state from a reassuring paragraph.

## Keep the system of record visible

Ask where enrolments, submissions, attendance, grades and certificates are stored. Establish which source is authoritative and which people can change it. A summary of a learner's progress should be traceable to records, not treated as a replacement for them.

For a provider serving multiple employers, test the customer boundary explicitly. A trainer working with one customer should not gain access to another customer's employees through an agent query. A client's manager should see the people they are authorised to manage.

Use the [LMS buyer's checklist](/insights/lms-buyers-checklist-training-providers) to test the wider delivery journey as well as the AI features.

## Run these five demonstration scenarios

1. **Create a draft:** request a short course with a practical activity. Refresh the page and confirm that the draft can be found and edited.
2. **Respect a boundary:** ask for a record outside the user's authority. Confirm that both the interface and the underlying action refuse access.
3. **Explain missing evidence:** request a completion summary when attendance has not been recorded. The system should identify the gap rather than invent completion.
4. **Recover an interruption:** interrupt a task and resume it. Check that the result is not duplicated and that any usage charge is understandable.
5. **Review a consequential action:** ask for a change that requires approval. Inspect the exact proposal before approving and check the resulting record afterwards.

These are evaluation scenarios, not a claim that every platform currently supports every behaviour. Record the demonstrated result, limitations and follow-up questions for each supplier.

## Ask how reliability is measured

Request examples of failed runs as well as successful demonstrations. Discuss how the supplier tests permissions, unsupported requests, missing information and tool failures. Ask how a customer reports an incorrect action and how the affected record can be reviewed.

Separate agent quality from learning quality. A reliably generated course can still have weak outcomes or unsuitable assessment. Subject review, accessible design and evidence of practical learning remain part of the operating model.

## Connect the product to your learning journey

Map one journey from learning need to practice, delivery and reviewed evidence. Mark where the agent helps and where a person decides. The [blended learning design guide](/insights/blended-learning-programme-design) is a useful starting point.

Explore [Experrt's platform capabilities](/#capabilities), then [talk to us](/contact) about demonstrating your own provider or employer scenario. For the people designing the process, see [Learning Operations & AI-Enabled Development](/courses/learning-operations-and-ai-enabled-development) and [Redesigning HR Services with AI Agents](/courses/redesigning-hr-services-with-agents).
`,
},
];
