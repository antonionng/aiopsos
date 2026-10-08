import type { InsightArticle } from "../types.ts";

// Original practical guides. Editorial dates arranged at the publisher's request.
export const growthGuides: InsightArticle[] = [
{
  slug: "ai-training-needs-analysis-template",
  title: "AI training needs analysis: stop guessing what your team needs",
  description: "Run an AI training needs analysis with task interviews, a simple evidence sheet and a prioritisation template. Turn a broad training request into a useful brief.",
  dek: "Before you book a workshop, find the work that needs to change. Here is the question set and evidence sheet to start with.",
  publishedAt: "2026-08-28", topic: "Commissioning",
  relatedCourseSlugs: ["sponsoring-an-ai-literacy-programme", "ai-foundations-for-every-role"],
  body: `
## The quick answer

An AI training needs analysis compares what people need to do at work with what they can demonstrate today. Start with tasks, observe a small sample of work, and separate a learning gap from a missing permission, unclear process or unsuitable tool. The output should be a prioritised training brief, not a league table of confidence scores.

Use this approach when someone asks for “AI training for everyone” and you need to turn that request into something you can commission. The worksheet below is a proposed working method, not a validated assessment instrument.

## Ask about the last real task

Interview people from the roles you expect to train. Include someone who is enthusiastic, someone who is sceptical and someone responsible for reviewing the work. Ask them to describe a recent task rather than speculate about everything AI might do.

Use these six questions:

1. What were you trying to produce, and who used it?
2. Which steps took the most effort?
3. Where did you need judgement or information from another person?
4. What would an unacceptable result look like?
5. What tools and information are you allowed to use?
6. Could you show how you would check an AI-assisted version?

Do not collect confidential examples just to make the interview feel realistic. A redacted or synthetic version can reveal the same learning need. Ask the relevant owner before moving any work material into a training environment.

## Copy this evidence sheet

Create one entry for each task, with these fields:

- **Role and task:** who does the work and what they produce.
- **Current evidence:** an observed attempt, reviewed output or structured conversation.
- **Desired behaviour:** the specific action a learner should demonstrate.
- **Gap:** what is missing today.
- **Likely cause:** knowledge, practice, process, access or tool fit.
- **Practice activity:** the task learners will attempt in training.
- **Reviewer:** who can recognise a good result.
- **Follow-up:** when you will check a fresh example at work.

For a hypothetical account team, the desired behaviour might be: “Draft a client follow-up using approved notes, identify unsupported claims and obtain the normal review before sending.” That is teachable and observable. “Become AI confident” is much harder to assess.

## Decide what deserves training first

For each gap, discuss how often the task occurs, the consequence of getting it wrong and whether the team has an approved environment in which to practise. Start where the need is meaningful and the conditions for practice exist.

A blocked account does not need a prompting workshop. A policy question needs an accountable decision. Someone who cannot identify invented facts needs guided checking practice. Keep those actions separate in your plan, even when they belong to the same initiative.

Record who you spoke to and whose perspective is missing. A handful of interviews can uncover useful patterns, but they do not establish the needs of an entire workforce. Validate the brief with the managers and reviewers who will support the learners.

## Turn the findings into a brief

Write one paragraph describing the audience, the task, the current gap and the evidence you want after training. Add the constraints: available time, approved tools, accessibility requirements and review responsibilities. Give the provider an example of acceptable work where you can safely do so.

Before commissioning, read [how to commission workforce AI training](/insights/how-to-commission-workforce-ai-training). If you need to map different expectations across roles, use the [AI skills matrix template](/insights/ai-skills-matrix-template).

## Start smaller than a workforce survey

Try the question set with one team and review whether it produces decisions you can act on. Remove questions that collect interesting information without changing the plan. Repeat with other roles when the method is useful.

You can begin with the [Experrt learning check](/assessment/start), which asks for your name and email before showing your self-reported priorities. It is a conversation starter, not a workforce diagnosis. Explore [sponsoring an AI literacy programme](/courses/sponsoring-an-ai-literacy-programme), or [talk to Experrt](/contact) about turning the findings into a programme.
`
},
{
  slug: "30-day-ai-adoption-plan",
  title: "Your first 30 days of AI adoption: one team, one useful change",
  description: "A practical 30-day AI adoption plan for managers: choose a workflow, set a baseline, practise safely and decide whether to expand, revise or stop.",
  dek: "You do not need another launch presentation. You need a workflow worth improving and a way to tell whether it improved.",
  publishedAt: "2026-08-26", topic: "Adoption",
  relatedCourseSlugs: ["embedding-ai-in-daily-workflows", "leading-an-ai-ready-team"],
  body: `
## What this plan is designed to do

A 30-day AI adoption pilot should answer one question: can this team use an approved tool to improve a defined task without lowering the standard of work? It is a proposed experiment, not a promise of a company-wide transformation in a month.

Choose a manager, a small group of participants and a reviewer who understands the output. Give them time inside the working week. If practice is something people must squeeze in after their actual job, your pilot is testing spare capacity as much as adoption.

## Days 1–7: choose the work and draw the boundary

Select a repeated task with an understandable result. Drafting an internal project update from approved notes is easier to evaluate than “help us think more strategically”. Write down where the input comes from, who reviews the output and what still requires human judgement.

Confirm tool access and acceptable data with the relevant owners. If the organisation has not approved the environment, resolve that before asking people to use real work material. Use synthetic examples while the decision is pending.

Record the starting point with a few comparable examples. Include the time spent preparing inputs, producing the output, checking it and making corrections. Keep a note of quality problems. Do not quietly compare an easy AI-assisted task with a difficult manual one.

Your first-week deliverable is a one-page pilot brief: task, participants, approved inputs, reviewer, baseline, success criteria and stop conditions.

## Days 8–14: practise the whole task

Run a short practice session that covers framing the request, reviewing the response and deciding what to change. Let participants see a plausible but incorrect output so they can rehearse catching it. A flawless demonstration can leave them unprepared for normal use.

Ask each person to complete the task, explain their checks and improve the result after feedback. Save an approved example of the process, including the review steps. A prompt on its own is not the process.

Book a short manager check-in. Ask what was useful, what failed and what prevented practice. Treat a blocked permission or missing source document as an operational issue, not a lack of enthusiasm.

## Days 15–21: test it in normal work

Use the agreed workflow on suitable live tasks, following the organisation’s existing review requirements. Collect both useful outcomes and failures. Encourage participants to record when using AI added work or was the wrong choice.

A simple log needs five fields: task, input preparation time, production time, checking and rework time, and reviewer decision. Add a short note about the type of task so you can compare like with like.

Avoid turning the pilot into a competition for the most prompts submitted. Activity is useful diagnostic information; it does not establish that the work improved.

## Days 22–30: make a decision

Review the examples with participants and the task owner. Did quality hold up? Was the total effort different? Could someone else repeat the approach? Were any risks or access problems unresolved?

Choose one of three decisions: expand the workflow to a similar team, revise it and run another small test, or stop. Write down why. A stopped pilot can be a good outcome if it prevents a poor workflow from spreading.

## Keep the next step specific

Use the [AI use-case prioritisation guide](/insights/ai-use-case-prioritisation) if you have too many candidates. Use the [training ROI business case](/insights/ai-training-roi-business-case) before turning a time estimate into a financial claim.

Experrt’s [embedding AI in daily workflows](/courses/embedding-ai-in-daily-workflows) and [leading an AI-ready team](/courses/leading-an-ai-ready-team) courses connect practice with management support. [Talk to us](/contact) about designing a pilot around your team’s actual work.
`
},
{
  slug: "microsoft-365-copilot-training-plan",
  title: "Microsoft 365 Copilot training: build the plan around the job",
  description: "Build a Microsoft 365 Copilot training plan around role-specific tasks, approved information and review habits. Includes a practical session outline and pilot checklist.",
  dek: "Buying access gets people through the door. Task-based practice gives them a reason to come back.",
  publishedAt: "2026-08-24", topic: "Adoption",
  relatedCourseSlugs: ["getting-value-from-tools-you-already-own", "prompting-and-output-verification"],
  body: `
## Start with a scenario, not a feature tour

A useful Microsoft 365 Copilot training plan helps someone complete a recognisable job and check the result. Choose a role-specific scenario, confirm what the organisation has enabled, and teach the whole workflow from input preparation to review.

Microsoft provides a [Scenario Library](https://adoption.microsoft.com/en-us/scenario-library/) organised around practical uses. Use it to identify possibilities, then adapt the exercise to your own permissions, information and working standards. A vendor example is a starting point, not evidence that your organisation is ready for the same workflow.

## Check access before the session

Ask your administrator which Copilot experience participants can use, what has been enabled and which information is available to them. Do not assume every attendee has the same licence or configuration. Product experiences change, so confirm the current setup rather than teaching from an old screenshot.

Give participants a short pre-session check: sign in, open the agreed tool and locate the approved practice material. Provide an alternative exercise for anyone whose access is still being resolved. This protects teaching time without pressuring people to use a personal account or unapproved workaround.

Microsoft’s [administrator adoption guide](https://learn.microsoft.com/en-us/microsoft-365/copilot/microsoft-365-copilot-enablement-resources) is a useful preparation reference for the technical owner. The training lead and technical owner should agree what the session can safely demonstrate.

## Choose three tasks people recognise

For an illustrative project team, you might practise drafting an update from supplied notes, extracting unresolved questions from an approved document and preparing a meeting agenda. Use synthetic information if real material is not suitable for training.

For each exercise, specify the expected output and the checks. An update should distinguish confirmed facts from suggestions. A question list should point back to its source. An agenda should reflect the actual purpose of the meeting rather than invent decisions that have already been made.

Do not imply that every task belongs in the same application. Let the enabled environment determine what is available, then make the learning objective independent of a particular button.

## A practical session outline

Use this proposed 90-minute structure as a starting point:

1. **10 minutes:** clarify the task, data boundaries and review responsibility.
2. **15 minutes:** demonstrate one complete workflow, including a mistake and its correction.
3. **25 minutes:** participants attempt the task using the practice material.
4. **20 minutes:** compare outputs against a short review checklist and revise them.
5. **10 minutes:** discuss when the tool was unhelpful or unnecessary.
6. **10 minutes:** choose one suitable task to practise before the follow-up.

The point is not to fill 90 minutes. If the group needs more support with source checking, reduce the number of exercises and spend the time there.

## Measure the follow-through

A week later, ask participants to bring a suitable example and explain their process. Look for repeatable behaviour: useful instructions, appropriate information, checked outputs and sensible decisions about when not to use the tool.

Access and usage can help you find friction, but they do not tell you whether the final work was better. Use [how to measure whether AI training stuck](/insights/how-to-measure-if-ai-training-stuck) to plan the review, and the [30-day adoption plan](/insights/30-day-ai-adoption-plan) to structure the wider pilot.

## Make your existing tools earn their place

Explore [getting value from tools you already own](/courses/getting-value-from-tools-you-already-own) and [prompting and output verification](/courses/prompting-and-output-verification). [Contact Experrt](/contact) to discuss training around your approved environment. Confirm licensing and configuration with your Microsoft administrator; this guide does not promise features in a particular subscription.
`
},
{
  slug: "ai-prompts-for-work-template",
  title: "A better AI prompt template for work: give it the brief, then check it",
  description: "Use a reusable AI prompt template for workplace drafting, analysis and review. Includes a worked example, output checks and a method for improving the brief.",
  dek: "A long prompt is not automatically a good prompt. These six parts make the task clearer and the answer easier to review.",
  publishedAt: "2026-08-17", topic: "AI literacy",
  relatedCourseSlugs: ["prompting-and-output-verification", "ai-foundations-for-every-role"],
  body: `
## The template

A useful workplace prompt explains the task, supplies appropriate context, identifies the allowed sources and defines the expected output. It also makes uncertainty visible. None of this guarantees accuracy; it makes the result easier for a person to judge.

Copy these six lines and replace the instructions with your own:

> Task: What should be produced, and why?
>
> Audience: Who will use it, and what do they already know?
>
> Source material: Which supplied information may be used?
>
> Constraints: What must be included, excluded or left undecided?
>
> Output: What structure, length and level of detail will be useful?
>
> Uncertainty: How should missing information and unsupported claims be marked?

Keep the template in plain language. You do not need an elaborate fictional persona to ask for a well-structured first draft.

## A worked example

Imagine you need an internal project update. The following is a synthetic exercise, not a client case study:

> Draft a 200-word update for a project sponsor. Use only the notes below. Separate completed work, current blockers and decisions needed. Do not invent dates, owners or budget figures. Where the notes do not provide an answer, write “needs confirmation”. Keep the tone direct and neutral. Finish with three questions for the project manager to resolve before this is sent.

Then provide a small set of approved or synthetic notes. Notice that the instruction describes both the output and the boundaries. The result should still be treated as a draft: the model may misunderstand a note, combine unrelated points or fail to follow the instruction.

## Review with four questions

First, check fidelity. Can you trace every factual statement back to the supplied material? If an answer cites a source, open it and verify that it supports the claim rather than accepting the citation as proof.

Second, check completeness. Did the draft leave out an important blocker or qualify a decision incorrectly? A fluent summary can be wrong through omission, even when each individual sentence sounds reasonable.

Third, check fitness for the audience. Does the sponsor have enough information to act? Remove confident language that hides uncertainty and background that does not help the decision.

Finally, check the boundary. Does the output contain information that should not be shared with the intended audience? The normal responsibility for review and approval still applies.

## Improve the brief before polishing the answer

If the result is weak, diagnose why. Missing context calls for a better brief. Contradictory notes call for a human decision. An invented claim calls for verification and correction. Repeatedly asking for “a more professional version” can polish the wording while leaving the underlying problem intact.

Change one part of the prompt at a time and compare the outputs against the same checklist. Save the version that works with a note about its intended task, the required inputs and the review steps. Do not distribute it as a universal prompt for every department.

## Build a small library of complete workflows

A useful team library includes the brief, a safe example, an acceptable output and the checks. Name the owner and review it when the task or tool changes. Retire examples that no longer reflect how the work is done.

Read [AI output verification at work](/insights/ai-output-verification-at-work) for a deeper review approach. The [first AI workshop agenda](/insights/first-ai-workshop-agenda) shows how to turn this template into a practice session.

For guided practice, explore [prompting and output verification](/courses/prompting-and-output-verification), or [talk to Experrt](/contact) about building examples for your team’s work.
`
},
{
  slug: "ai-training-roi-business-case",
  title: "AI training ROI: the business case your finance team can question",
  description: "Build a transparent AI training business case with full costs, observed task time, quality checks and scenario assumptions. Includes a clearly labelled worked example.",
  dek: "Minutes saved are a starting point. A credible business case shows the costs, the checking time and what happens to the capacity.",
  publishedAt: "2026-08-14", topic: "Measurement",
  relatedCourseSlugs: ["ai-governance-and-oversight-for-managers", "embedding-ai-in-daily-workflows"],
  body: `
## Separate three different claims

Training participation, improved task performance and financial return are different outcomes. A business case should explain how you will move from one to the next rather than treating attendance as evidence of savings.

Use this guide as a planning method for an internal pilot. Its numbers are hypothetical arithmetic, not Experrt customer results or a forecast for your organisation. Ask the budget owner to agree the assumptions and how benefits will be recognised.

## Count the full cost

Include the provider fee, participant time, manager support, preparation, tool costs attributable to the pilot and follow-up review. If the team creates practice material or spends time resolving access problems, record that effort too.

Separate one-off setup costs from costs that continue each month. A pilot may look expensive because setup is concentrated at the start. It may also look artificially cheap if you treat internal effort as free. Show both categories so a reviewer can challenge them.

Decide what belongs to training and what belongs to the wider tool rollout. If licences were already purchased, make that assumption explicit rather than silently including or excluding them to improve the result.

## Observe the whole task

Measure comparable examples before and after practice. Include preparation, generation, checking and rework. Keep the quality standard consistent. A faster draft is not an improvement if the reviewer spends longer repairing it.

Record the number and type of examples, who participated and which cases were excluded. A small volunteer group may behave differently from a wider rollout. Present the result as an early signal with those limits, not a universal productivity rate.

Use the [30-day adoption plan](/insights/30-day-ai-adoption-plan) to structure a test before building a larger spending case.

## A hypothetical capacity calculation

Suppose ten people each perform a suitable task eight times per month. In your hypothetical scenario, total effort falls from 30 minutes to 24 minutes per task after checking and rework are included.

That is 10 people × 8 tasks × 6 minutes, or 480 minutes: eight hours of monthly capacity. At an assumed internal value of £40 per hour, the equivalent capacity value would be £320 per month.

Those eight hours are not automatically £320 of cash savings. The organisation needs to explain what happens to the time. It might support additional work, improve responsiveness or reduce overtime. If nothing changes operationally, describe it as potential capacity rather than a realised financial benefit.

## Make uncertainty visible

Present a conservative, a central and an optimistic scenario. Change task frequency, the share of suitable tasks and the sustained improvement, rather than pretending one observation is certain to repeat.

Show what would cause the business case to fail. Perhaps review takes longer than expected, the workflow is used infrequently or the tool cost exceeds the benefit. Agree a review date and a stop or redesign decision in advance.

For a financial ROI calculation, use only benefits your organisation agrees are monetisable: approved monetary benefit minus total cost, divided by total cost, for the same period. Keep capacity estimates and non-financial improvements alongside that calculation, clearly labelled.

## Add the evidence finance can inspect

Attach the task definition, baseline examples, cost assumptions, quality criteria and named benefit owner. Report adverse outcomes and unsuccessful tasks as well as the useful ones. A transparent case is easier to improve than an impressive percentage with no trail behind it.

Read [how to measure whether AI training stuck](/insights/how-to-measure-if-ai-training-stuck). Explore [embedding AI in daily workflows](/courses/embedding-ai-in-daily-workflows), or [contact Experrt](/contact) to define a pilot with observable outcomes before discussing scale.
`
},
{
  slug: "lms-buyers-checklist-training-providers",
  title: "Choosing an LMS? Make the demo do your actual work",
  description: "An LMS buyer checklist for training providers: test authoring, client access, learner journeys, evidence, exports and operations with a realistic demo script.",
  dek: "Feature lists are easy to agree with. A real learner journey is much harder to fake. Bring this script to the next demo.",
  publishedAt: "2026-08-10", topic: "Commissioning",
  relatedCourseSlugs: ["choosing-technology-well", "technology-for-non-technical-leaders"],
  body: `
## Start with a delivery story

The best LMS shortlist for your organisation is the one that can support your actual training model. Write a short delivery story before comparing products: who creates the programme, who buys it, who attends, who reviews work and what record is needed at the end.

For example, a provider might teach two client teams using shared learning material, separate discussions and a mix of live sessions and independent work. That scenario exposes useful questions about permissions and reporting that a generic feature tour may never reach.

This is a vendor-neutral evaluation method. It is not a claim that Experrt, or any other platform, implements every capability listed below.

## Bring a demo script

Ask the vendor to demonstrate the following with sample data:

1. Create a small programme with one resource and one assessed task.
2. Assign it to learners from two different client organisations.
3. Show exactly what a learner, trainer and client manager can see.
4. Have a learner submit work and a trainer provide feedback.
5. Add a live session and show how attendance affects the record.
6. Export the progress and evidence you would need to keep.
7. Withdraw a learner and explain what happens to access and records.

If a step needs a separate product or manual workaround, record that. A workaround may be acceptable, but it should be visible in the buying decision and cost model.

## Test the boundaries, not just the happy path

Ask what happens when a learner belongs to more than one client, an assignment changes after enrolment or a trainer leaves. Check whether one client’s manager can see another client’s data. Have the vendor demonstrate the permission boundary rather than simply naming a security feature.

Use a deliberately incomplete submission and a missed session. Can the learner understand what remains? Can the trainer correct a mistake without losing the history? Can the administrator explain the record to a client?

These are normal delivery events. A platform that looks clear only when every learner finishes perfectly may generate support work later.

## Separate essential requirements from preferences

For each requirement, record the business reason, the demonstration evidence, the owner and whether it is essential at launch. Avoid scoring every feature equally. A missing requirement for your delivery model should not be hidden by a long list of attractive extras.

If you require SSO, provisioning, SCORM, xAPI, LTI or a particular billing integration, ask for the supported version, constraints and an acceptance test. A roadmap statement is different from a feature you can use today. Put unresolved dependencies in the commercial discussion.

## Check the operating cost

Ask who imports learners, handles access problems, maintains content and supports clients. Clarify pricing units, usage limits, implementation effort, export arrangements and what happens when the contract ends. Request a complete worked quotation for your scenario rather than comparing headline prices alone.

Include accessibility and mobile use in the trial with the people who will actually use the system. A salesperson completing a desktop task quickly is useful evidence of one journey, not proof that all your learners can use it comfortably.

## Make the decision reviewable

End the trial with three lists: demonstrated capabilities, accepted workarounds and unresolved launch blockers. Keep screenshots or notes where appropriate, and ask the vendor to confirm important commitments in writing.

Read [blended learning programme design](/insights/blended-learning-programme-design) to define the journey before the demo. Explore [choosing technology well](/courses/choosing-technology-well), or [ask Experrt for a platform conversation](/contact). Bring your delivery story and we can discuss the current fit, including what needs further work.
`
},
{
  slug: "blended-learning-programme-design",
  title: "Blended learning design: stop making learners join the dots",
  description: "Design a blended learning programme that connects preparation, live practice, workplace application and evidence. Includes a four-stage programme planning template.",
  dek: "A video, a workshop and a quiz are ingredients. The programme is the journey that connects them.",
  publishedAt: "2026-08-07", topic: "Commissioning",
  relatedCourseSlugs: ["sponsoring-an-ai-literacy-programme", "leading-an-ai-ready-team"],
  body: `
## Give every activity a job

Blended learning combines different learning settings or formats around an outcome. The useful design question is not how much content should be online. It is what learners need to understand, practise, apply and demonstrate, and which setting supports each step.

Start with one observable outcome. For an illustrative AI programme, that might be producing a checked internal briefing from approved source material. Work backwards from the evidence a reviewer would accept. Add activities only when they help learners reach that standard.

## Stage one: prepare for the practice

Before a live session, give learners the minimum context they need to participate. That could be a short explanation, a worked example and a prompt to identify a relevant task. Tell them how long preparation should take and why it matters in the next session.

Check access, accessibility needs and the availability of practice material. If preparation depends on an account or document that learners cannot open, the live session inherits the problem. Make the support route visible before the deadline.

Do not move a large lecture online simply to call the programme blended. Preparation should make the next activity more useful, not add an unexplained layer of homework.

## Stage two: use live time for judgement

Live sessions are useful for seeing how people approach a task, discussing ambiguity and giving feedback. Demonstrate a complete attempt, including a mistake or uncertainty. Then let learners attempt a fresh version and explain their choices.

For the briefing example, participants might compare two drafts and identify missing context, unsupported statements and unclear decisions. The trainer can explore why those differences matter to the reader. That discussion offers more than watching another demonstration of the same tool.

Keep the group size, facilitation and available time aligned with the amount of feedback you promise.

## Stage three: make workplace application feasible

Give learners a specific task to try after the session, an approved environment and a named person who can help. Managers should know what practice requires and when it will happen. “Use this in your job” is too vague to become a reliable assignment.

State what may be submitted as evidence. Redacted examples, synthetic equivalents or a structured explanation may be appropriate when work material cannot be shared. Agree the approach with the organisation instead of asking learners to make a sensitive-data decision alone.

## Stage four: review and close the loop

Use the same outcome and quality criteria you started with. Ask learners to explain their process as well as show an output. Give them a chance to improve it after feedback. Record what was demonstrated and what still needs practice.

Attendance, quiz results and workplace evidence answer different questions. Decide which records are required for completion before delivery begins. If your systems store live attendance and independent learning separately, explain how you will reconcile them rather than implying an automatic combined record.

## Copy the programme planning sheet

For every stage, write down:

- The learner action and its purpose.
- The time and access required.
- The person responsible for support.
- The evidence produced and who reviews it.
- The handover into the next stage.
- The fallback when someone misses an activity.

Read the sheet from the learner’s perspective. Can they tell what to do next without asking the trainer? Can the trainer see who needs help without opening five unrelated spreadsheets?

## Choose delivery and technology together

Use the [LMS buyer checklist](/insights/lms-buyers-checklist-training-providers) to test whether your platform supports the designed journey. The [training proposal template](/insights/training-proposal-template) helps turn it into a brief.

Explore [sponsoring an AI literacy programme](/courses/sponsoring-an-ai-literacy-programme), or [talk to Experrt](/contact) about connecting practical training with a clearer learner experience.
`
},
{
  slug: "ai-champions-programme-playbook",
  title: "AI champions need a job description, not another badge",
  description: "Design an AI champions programme with a clear remit, manager support, protected time and escalation routes. Includes a practical champion charter template.",
  dek: "Enthusiasm starts conversations. A clear remit helps those conversations turn into better work.",
  publishedAt: "2026-08-03", topic: "Adoption",
  relatedCourseSlugs: ["leading-an-ai-ready-team", "embedding-ai-in-daily-workflows"],
  body: `
## Define what champions are there to do

An AI champion can help colleagues discover useful workflows, practise with approved tools and bring recurring problems to the right owner. That role needs boundaries. Being enthusiastic about AI does not make someone the organisation’s security, legal or technical authority.

Write the remit before recruiting volunteers. Explain what support champions provide, what decisions remain with managers and where questions should be escalated. Without that agreement, a champion network can become an informal help desk with no capacity or authority to resolve the problems it receives.

## Copy this champion charter

Use the following as a proposed starting point and adapt it with your managers:

- **Purpose:** help colleagues practise suitable AI-assisted tasks in the approved environment.
- **Activities:** host a short practice session, maintain agreed examples and collect feedback.
- **Boundaries:** do not approve new tools, data uses or exceptions to policy.
- **Time:** agree a specific allocation with the manager and review whether it is sufficient.
- **Support:** name a training lead and the owners of technical and policy questions.
- **Evidence:** record useful workflows, unresolved barriers and examples that failed.
- **Review:** revisit the role after the initial pilot and adjust or stop activities that are not useful.

Make the charter visible to colleagues. It should help someone understand what they can ask a champion and when they need another route.

## Recruit for more than enthusiasm

Include people who know the day-to-day work and can explain it patiently. Look for colleagues who are comfortable saying “I don’t know” and who will check an answer before sharing it. A confident demonstration is less valuable if it encourages others to trust unverified outputs.

Aim for coverage of relevant roles and working patterns. A network drawn only from head office may miss the access, timing or process constraints faced by other teams. Ask managers where peer support would actually help rather than choosing a fixed number of champions for every department.

Participation should have a clear agreement about time and responsibilities. Avoid making unpaid extra effort the hidden foundation of the programme.

## Teach a repeatable support pattern

Give champions a small set of approved exercises and a way to run them. A useful session starts with the task, checks the information boundary, lets people attempt the work and finishes with a review of the output.

Teach the escalation pattern alongside the exercise. If someone asks whether a new dataset can be uploaded, the champion should know who decides. If an output is unreliable, the champion should help the colleague check it and record the issue, not improvise a reassuring explanation.

Use the [AI prompt template](/insights/ai-prompts-for-work-template) as a practice aid, with the review steps kept attached.

## Make managers part of the programme

Managers choose priorities, make time for practice and decide whether a workflow belongs in normal operations. Champions can support those decisions but should not be expected to replace them. Agree which team task the programme is trying to improve before measuring the number of sessions held.

Read [managers, not just champions, drive AI adoption](/insights/managers-not-champions-ai-adoption) for the management side of the programme.

## Review the network by usefulness

After the pilot, ask what colleagues can now do, which barriers were resolved and which questions still lack an owner. Keep attendance as an activity measure, alongside evidence of changed practice. Do not treat the number of enthusiastic posts as proof of business impact.

Explore [leading an AI-ready team](/courses/leading-an-ai-ready-team) or [contact Experrt](/contact) about preparing champions and managers together. Start with a clear role, one useful workflow and enough support to make both sustainable.
`
},
{
  slug: "ai-use-case-prioritisation",
  title: "Too many AI ideas? Use this pilot shortlist before buying more tools",
  description: "Prioritise workplace AI use cases with a practical decision sheet covering task value, information access, review effort and pilot readiness. Includes stop conditions.",
  dek: "The best first pilot is not always the most exciting idea. It is the one you can test properly.",
  publishedAt: "2026-07-31", topic: "Adoption",
  relatedCourseSlugs: ["choosing-technology-well", "embedding-ai-in-daily-workflows"],
  body: `
## Turn ideas into testable tasks

AI use-case prioritisation starts by making the idea specific enough to evaluate. Replace “AI for sales” with a task such as “prepare a first draft of an internal account summary from approved notes, for a salesperson to check”. Then identify the user, inputs, output and reviewer.

This guide offers a practical screening method for a small workplace pilot. It is not a formal risk assessment or a substitute for your organisation’s approval process. Its purpose is to expose missing information before enthusiasm turns into a purchase.

## Use six decision questions

For each candidate task, ask:

1. **Value:** what problem would improve, and who cares about the result?
2. **Frequency:** does the task occur often enough to observe during a pilot?
3. **Information:** are suitable inputs available in an approved environment?
4. **Review:** can a person check the output to the required standard?
5. **Consequence:** what happens if the result is wrong or shared incorrectly?
6. **Ownership:** who can provide time, make decisions and act on the findings?

Write a short evidence note for each answer. A colour or score without an explanation is easy to argue about and difficult to learn from.

## Separate blockers from trade-offs

An uncertain benefit can be a question for the pilot. Missing permission to use the required information is a blocker that needs an owner before the pilot. Lack of a competent reviewer may mean the proposed task is unsuitable for your first experiment.

Do not combine every factor into a single number that allows high enthusiasm to cancel out an unresolved risk. Keep the critical conditions explicit. Use “ready to test”, “needs a decision” and “not suitable now” as working categories if that makes the discussion clearer.

A higher-risk or more complex idea may still be worth pursuing later with the right expertise. It does not need to be the first thing a newly trained team attempts.

## Compare two illustrative candidates

Consider an internal meeting agenda drafted from an approved project brief. Its audience and expected structure are clear, the task recurs and a project manager can check it. The pilot still needs appropriate information handling and review, but the learning question can be defined quite tightly.

Now consider an AI system making an important decision about a person. The consequences, evaluation needs and approval requirements are different. A general prompting workshop is not enough to establish that the system should be used. Route the idea to the organisation’s relevant decision-makers rather than squeezing it into the same quick pilot process.

These are illustrative comparisons, not claims that every agenda task is low risk or every decision-support use is prohibited.

## Write the experiment before choosing the tool

For a shortlisted task, define the baseline, the approved inputs, the quality criteria and the review period. Specify what would make you stop: unacceptable errors, excessive checking effort, information problems or insufficient real tasks to evaluate.

Then check whether an existing approved tool can support the experiment. A new subscription introduces another dependency and should solve a demonstrated need, not stand in for defining the task.

For a broader approach to identifying and managing AI risks, consult the [NIST AI Risk Management Framework resources](https://www.nist.gov/itl/ai-risk-management-framework/ai-risk-management-framework-resources). The decision sheet here is Experrt’s practical planning suggestion, not a NIST certification method.

## Move one idea into practice

Use the [30-day AI adoption plan](/insights/30-day-ai-adoption-plan) to run the selected experiment and the [training needs analysis](/insights/ai-training-needs-analysis-template) to identify the skills required.

Explore [choosing technology well](/courses/choosing-technology-well), or [talk to Experrt](/contact) about choosing a useful first workflow before expanding the programme.
`
},
{
  slug: "ai-skills-matrix-template",
  title: "An AI skills matrix that measures more than confidence",
  description: "Build a role-based AI skills matrix with observable behaviours, evidence levels and review dates. Includes example expectations for users, reviewers and managers.",
  dek: "“Good at AI” is not a skill definition. Write down what someone should be able to demonstrate.",
  publishedAt: "2026-07-27", topic: "Measurement",
  relatedCourseSlugs: ["ai-foundations-for-every-role", "ai-governance-and-oversight-for-managers"],
  body: `
## What an AI skills matrix should show

An AI skills matrix maps roles to observable behaviours and records the evidence behind a learning judgement. It helps you identify practice needs and plan support. It should not turn a self-rated confidence score into a claim that someone is competent.

Begin with a small set of behaviours relevant to the work. Different roles may need different expectations. A person drafting an internal note, a manager approving it and a technical owner configuring a system do not need identical training or evidence.

## Use behaviours that can be observed

For a general workplace programme, consider these starting points:

- Frame a task with a clear purpose, audience and expected output.
- Select information that is appropriate for the approved environment.
- Identify unsupported claims and verify important statements.
- Recognise when the output is incomplete or unsuitable.
- Explain the review and approval steps for the task.
- Escalate a question that falls outside the person’s authority.

Adapt the list with the people who own the work. A behaviour such as “understands AI ethics” may be too broad to review consistently. “Identifies an inappropriate data request in this exercise and uses the agreed escalation route” gives the assessor something concrete to look for.

## Copy the matrix fields

Create a row for each role and behaviour. Include the required level, current evidence, evidence date, reviewer, next practice activity and next review date. Keep notes about the context: demonstrating a task with one tool and dataset does not automatically establish capability in every environment.

For a simple local rubric, you could use:

1. **Not yet observed:** there is no suitable evidence.
2. **With support:** the person completes the behaviour with guidance.
3. **Independently in the agreed task:** the person completes and explains it without prompting.
4. **Supports others in this task:** the person can identify common mistakes and give useful feedback.

This is a suggested internal rubric, not an accredited proficiency scale. Agree examples of each level before using it across reviewers. “Not yet observed” should remain different from “unable to do it”.

## Set different expectations by role

For an illustrative drafting role, independent use might mean producing a checked draft from approved information and following the normal review process. For a reviewing manager, the expectation might include recognising when the draft needs a subject expert and deciding whether the workflow remains appropriate.

A champion who supports colleagues may need to demonstrate the exercise and explain the escalation boundary. That does not make the champion responsible for approving new tools or data uses.

Keep the [champion charter](/insights/ai-champions-programme-playbook) aligned with the matrix so the learning expectations match the actual responsibility.

## Collect proportionate evidence

Use a suitable task, a short explanation and reviewer feedback. Avoid gathering a large amount of personal or workplace information simply because the matrix has space for it. Agree who can see records, how they will be used and how learners can correct an inaccurate judgement.

Self-report can help start a conversation and reveal where people want support. Pair it with observed practice before using the matrix for decisions that require stronger evidence. Explain that distinction to both learners and managers.

## Keep it alive without making it a bureaucracy

Review the matrix when tasks, tools or responsibilities change. Use the next-practice column to drive action, then update the evidence after the activity. A colourful spreadsheet that never changes a training decision is not doing useful work.

Start with the [AI training needs analysis template](/insights/ai-training-needs-analysis-template) to choose the tasks. Explore [AI foundations for every role](/courses/ai-foundations-for-every-role), or [contact Experrt](/contact) about turning role expectations into practical learning and review activities.
`
},
{
  slug: "training-proposal-template",
  title: "The training proposal template that starts with the outcome",
  description: "Write a training proposal with a clear audience, work outcome, practice design, evidence plan and scope. Use the template to brief providers and compare proposals.",
  dek: "If the proposal starts with a list of modules, ask what those modules are meant to change.",
  publishedAt: "2026-07-24", topic: "Commissioning",
  relatedCourseSlugs: ["sponsoring-an-ai-literacy-programme", "technology-for-non-technical-leaders"],
  body: `
## Write the decision you need to make

A training proposal should help someone decide whether a programme is worth commissioning and whether the conditions for success are in place. It needs more than a course title, a date and a fee. State the work problem, the audience and the evidence you expect after delivery.

Use the following structure to brief a provider or compare proposals. It is a practical planning template, not a contract. Commercial terms and responsibilities still need to be agreed through your normal buying process.

## 1. The problem and the audience

Describe the work that needs to change. Include what you have observed, where the gap appears and why it matters. Distinguish evidence from an assumption you want the programme to test.

Identify the roles, approximate learner numbers, existing experience and relevant access constraints. Note accessibility needs and working patterns early. A programme designed around daytime office attendance may not fit a team working across shifts or locations.

A useful hypothetical brief might begin: “Our project coordinators need to turn approved notes into checked sponsor updates. Current drafts vary in structure and reviewers spend time finding missing decisions.” That is more actionable than “We need to become an AI-first organisation”.

## 2. The outcome and its evidence

State what learners should demonstrate by the end. Use a task and a quality standard rather than a vague promise of confidence. Explain who will judge the work and how feedback will be handled.

List the records you need: attendance, completed practice, assessment decisions or a follow-up review. Do not assume that a certificate proves a behaviour was demonstrated. Ask what the certificate represents and what evidence sits behind it.

Use the [AI skills matrix template](/insights/ai-skills-matrix-template) if expectations differ across roles.

## 3. The learning and delivery design

Ask the provider to explain why the proposed activities fit the outcome. How much time is available for guided practice? What will learners do before and after live sessions? How will someone catch up if they miss an activity?

Specify the approved tools and practice material. Agree who prepares examples and checks their suitability. If a platform is involved, explain how learners access it, where evidence is held and who supports account problems.

The [blended learning design guide](/insights/blended-learning-programme-design) provides a useful way to connect preparation, practice and application.

## 4. Responsibilities and assumptions

Name the sponsor, delivery owner, manager contact and technical contact. Allocate preparation, communications, access checks, learner support and review responsibilities. Make the time expected from managers visible in the proposal.

Write down assumptions that affect the scope. These could include stable learner numbers, access being ready, the availability of a subject expert or approval to use particular material. Agree what happens if an assumption changes rather than leaving the provider and sponsor to discover different expectations during delivery.

## 5. Cost, follow-up and acceptance

Separate the delivery fee from optional services and internal effort. Clarify what is included, what requires another purchase and what happens after the final session. Ask for a review point at which you can discuss evidence and decide whether further support is needed.

Define acceptance in terms both parties can inspect. Delivery completion and improved workplace performance may occur at different times and depend on different people. Avoid making either side responsible for an outcome it cannot control alone.

## Compare the answers, not the adjectives

Give shortlisted providers the same brief. Compare their proposed practice, evidence, responsibilities and assumptions before comparing attractive language about transformation. Record unresolved questions and ask for a revised scope where necessary.

Read [how to commission workforce AI training](/insights/how-to-commission-workforce-ai-training), explore [sponsoring an AI literacy programme](/courses/sponsoring-an-ai-literacy-programme), or [send Experrt your starting brief](/contact). A few clear paragraphs are enough to begin the conversation.
`
},
{
  slug: "first-ai-workshop-agenda",
  title: "Your first AI workshop: less watching, more doing",
  description: "A practical first AI workshop agenda with safe preparation, guided practice, output review and a workplace follow-up. Includes a proposed two-hour session plan.",
  dek: "The memorable moment should be something your team can now do, not something the presenter made look easy.",
  publishedAt: "2026-07-20", topic: "AI literacy",
  relatedCourseSlugs: ["ai-foundations-for-every-role", "prompting-and-output-verification"],
  body: `
## Choose one outcome for the first session

A first AI workshop should help people complete and check a small, useful task with an approved tool. Choose a task the audience understands, prepare appropriate material and leave enough time for everyone to attempt it. Do not make the first session a tour of every possible application.

The agenda below is a proposed two-hour format for a small workplace group. Adapt it to learner experience, accessibility requirements and the amount of feedback available. It is a teaching plan, not evidence that two hours establishes workplace competence.

## Prepare the conditions for practice

Before the workshop, confirm the tool, account access and information rules with the organisation. Ask learners to complete a short access check. Prepare synthetic or approved examples and a fallback activity if someone cannot use the environment.

Define the acceptable output and the review checklist. For an illustrative internal summary task, the criteria might include factual consistency with the source, clear separation of facts and suggestions, and visible unresolved questions.

Give managers a short note explaining the outcome and the follow-up. If learners are expected to practise at work afterwards, someone needs to make that time and support available.

## A two-hour agenda you can adapt

**0–15 minutes: establish the task and boundaries.** Explain what the group will produce, what information may be used and who remains responsible for checking the output. Invite questions about the task before opening the tool.

**15–30 minutes: demonstrate a complete attempt.** Show the brief, the draft and the review. Include a plausible error or omission and explain how you identify it. Avoid presenting a polished final answer as though it arrived without any checking.

**30–55 minutes: individual practice.** Give learners a fresh but comparable example. Ask them to write the instruction, inspect the response and mark changes before revising it. Circulate to understand where people are getting stuck.

**55–65 minutes: pause and compare.** Discuss what varied across outputs. Take a short break if it helps the group reset. The aim is to notice differences in the work, not to rank learners by how impressive their first prompt sounded.

**65–90 minutes: review and improve.** Use pairs or facilitated discussion to apply the same checklist. Ask people to explain one factual check and one judgement they made. Then let them improve their output.

**90–110 minutes: apply the learning to a suitable task.** Have participants identify a real workflow they could try later within the approved boundaries. If no suitable task is available, record that as a planning issue rather than forcing an example.

**110–120 minutes: agree the next practice.** Record what each person will attempt, what support they need and when the result will be reviewed.

## What to take away

Provide the exercise, an acceptable example, the review checklist and the agreed support route. Keep the [AI prompt template](/insights/ai-prompts-for-work-template) attached to its checking steps. A prompt copied without context can lose the parts that made it useful.

Do not claim that attendance alone demonstrates independent capability. If you need evidence, ask learners to complete a suitable fresh task and explain their checks. Record the limits of what was observed.

## Make the second conversation part of the design

Arrange a follow-up to look at examples and barriers. Ask where the workflow helped, where it added effort and where people chose not to use it. Use those answers to decide whether the next activity should be more practice, a process decision or a different task.

The [30-day adoption plan](/insights/30-day-ai-adoption-plan) extends this workshop into a pilot. Explore [AI foundations for every role](/courses/ai-foundations-for-every-role) or [contact Experrt](/contact) to shape a session around your team’s starting point.
`
},
];
