# Experrt always-on agent courses

Design specification, 1 October 2026. Target retail price: £99 per course. Status: curriculum and interactive preview in development; no paid course or certificate is released by this document.

## The learner promise

Finish with a working, bounded agent workflow, a reusable operating pack, and evidence of the skills you demonstrated. Each course stands alone. Platform courses include a concise foundation refresher and teach platform-specific configuration, limitations and recovery rather than repeating the same general content under different names.

The proposed price must be supported by tested learning outcomes and learner feedback. Hours and asset counts are design targets, not proof of value. Confirm VAT treatment, access duration, assessment staffing, support limits and third-party subscription requirements before selling.

## Minimum depth for every course

- Six modules, each with two short visual lessons, a worked example, a decision scenario, a guided lab and an evidence checkpoint. Target 36 activities in the existing LMS limit of 40.
- Target six to eight hours including active practice and assessment. Technical courses may need eight to ten hours. Pilot actual completion times before advertising duration.
- At least six original explanatory diagrams and six annotated examples or verified screenshots. Provide text equivalents and useful alt text. Never fabricate a product screenshot.
- At least six decisions with explanatory feedback for every option. Each checks judgement in context, rather than recall of a button label.
- At least four meaningful practical exercises, an exception or failure drill and a final capstone.
- Downloadable operating brief, permission matrix, test log, incident checklist, cost worksheet and capstone evidence pack, customised to the course.
- At least three worked contrasts: a weak brief and an improved brief; a successful run and a misleading result; a failed run and a documented recovery.
- A starting diagnostic, clear prerequisites and a progress view. Avoid penalising an inexperienced learner for the diagnostic.

## Learning rhythm

Open with an observable problem and a two-minute orientation. Explain one concept visually, show an example, ask the learner to predict a result, then explain the consequence. Let them practise in a fictional business or personal scenario before transferring the skill to their own work. Keep uninterrupted explanation to roughly five to eight minutes and put optional technical depth behind expandable sections.

Use labelled diagrams, timelines, annotated screenshots, before-and-after comparisons and small simulations. Interactions should change something meaningful: allowed actions, escalation, schedules, source quality or cost. A clickable card without instructional consequences is decoration.

Every lesson states what the learner will do, why it matters, the example inputs and the success conditions. Every lab includes a completed example, starter files, instructions, common mistakes and an evidence checklist. Explanations cover the reasoning as well as the clicks.

Provide keyboard access, visible focus, captions/transcripts for any recordings, no essential information conveyed by colour alone, responsive layouts and reduced-motion support. Use a downloadable text/workbook alternative. Product availability, cloud versus local execution, whether a device must stay awake, and subscription costs must be explained at enrolment and in setup.

## Assessment and Experrt certificate

The user selected practical assessment with an Experrt certificate. This is an Experrt skills assessment, not a claim of external accreditation.

Proposed process:

1. Record a baseline response and a simple starting task.
2. Give formative scenario feedback and lab feedback throughout the course. Allow retries and explain the gap.
3. Collect a final brief, configuration or configuration evidence, representative outputs, a test log, cost estimate and incident/recovery record. Accept redacted evidence; do not ask for passwords or tokens.
4. Assess each rubric dimension from 0 to 4. Require at least 3 in every dimension. A stronger score elsewhere cannot compensate for unsafe authority or fabricated evidence.
5. A reviewer challenges one decision and introduces a changed condition, through an observed task or an individual written follow-up. This checks understanding and authorship. Give equivalent accessible alternatives.
6. Return actionable feedback for unmet criteria. Proposed £99 inclusion: one initial review and one resubmission. Confirm operational capacity and publish the response-time commitment before sale.
7. Issue a certificate only after the final evidence and follow-up pass. Include learner name, course/version, assessed outcomes, issue date and a verifiable record identifier. Retain an audit trail according to the platform's retention policy.

Rubric:

| Dimension | Evidence of a score of 3: competent |
| --- | --- |
| Task design | A bounded responsibility, authoritative inputs, an owner, cadence and measurable acceptance conditions |
| Authority and permissions | Allowed, approval-required and blocked actions are explicit; sensitive or consequential actions have the appropriate review boundary |
| Implementation | The workflow runs in the selected environment and the learner explains its dependencies and execution model |
| Verification | Claims trace to sources; missing, stale or conflicting evidence is handled; the learner distinguishes verified results from estimates |
| Recovery | At least one failure is detected, duplicate action is prevented, and pause/recovery/escalation are demonstrated |
| Value and handover | Costs and review effort are measured; a new owner can use the operating instructions |

Score anchors: 0 = absent; 1 = major gaps; 2 = partial with help required; 3 = independently competent; 4 = competent with well-evidenced improvements. Course-specific rubrics must state concrete observable evidence for each dimension.

Automatic feedback may support practice and flag missing evidence. It must not claim to validate professional competence or issue a certificate independently. Lesson completion, practice scores, capstone submission and assessed pass are different states.

The existing LMS has practical submissions, evidence attachments and trainer review. Certificate issuance and verification must be checked end to end before being promised. The preview has session-only practice state, no saved enrolment, no review submission and no certificate issuance.

## Production and release gates

- Author and review all 36 activities and the complete resource pack; a blueprint alone is not a finished £99 course.
- Test each platform with an actual eligible account and synthetic data. Record the tested version, date, plan, region and execution constraints. Link official sources beside instructions.
- Confirm learners can complete the course in supported regions and disclose any external subscription costs separately from £99.
- Test all success, exception, retry and recovery paths. Prevent example workflows from contacting real people or making purchases without explicit learner authorisation.
- Pilot with at least five representative learners. Observe confusion and lab success, collect completion-time evidence and test the capstone rubric for consistent reviewer decisions. These are proposed pilot thresholds, not a statistical guarantee.
- Verify keyboard/mobile use, text alternatives, asset links, evidence submission, reviewer feedback, resubmission and certificate verification.
- Approve commercial terms, support scope and reviewer capacity. Publish only courses that pass these gates.
- Review platform-specific material monthly and after significant changes. Show the last-tested date and keep assessed course versions identifiable.

## Source register for platform authoring

Sources researched on 1 October 2026; this is documentary research, not account-level product testing.

- OpenAI Dots: https://chatgpt.com/features/dots/
- Grok Bot: https://x.ai/news/introducing-grok-bot
- Meta Muse: https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/
- Claude Cowork scheduling: https://support.claude.com/en/articles/13854387-schedule-recurring-tasks-in-claude-cowork
- Copilot Studio: https://learn.microsoft.com/en-us/microsoft-copilot-studio/fundamentals-what-is-copilot-studio
- OpenClaw automation: https://docs.openclaw.ai/cron-vs-heartbeat

## Authored course packs and remaining release work

All 13 specifications now have six authored modules and 36 LMS-compatible activities each, with teaching chapters, course-specific worked examples, six decision questions with per-choice feedback, six guided labs and six evidence checkpoints. Practice files, operating workbooks, course lab walkthroughs and reviewer guidance are included. The developer case includes executable starter files. The development review player adds record-decision exercises, browser-saved notes and downloads.

Canonical content is in lib/always-on-agents/content and assembled by lib/always-on-agents/courses.ts. Regenerate portable Markdown and LMS JSON packs with npm run courses:export. Review them at /courses/agents/review on the development site, or import the JSON into a new draft in the course studio. The review routes return not found in production.

The authored 465-minute sequence is a suggested study plan, not a measured completion time or proof of £99 value. Platform-specific material has documentary references dated 1 October 2026; no live platform-account demonstrations or learner pilots have been claimed. In particular, Cowork scheduling now distinguishes remote account/connected-file execution from tasks dependent on local files or apps. Recheck current controls during live testing.

Remaining release work: editorial and live-account review, representative learner pilot, calibrated reviewer delivery, assessment submission/resubmission, certificate verification, supported regional access, commercial terms and purchase/enrolment checks. The public pages continue to show coming soon until these gates are satisfied.
