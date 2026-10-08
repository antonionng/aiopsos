export const workbook = `# Your task workbook
Use fictional records until your live workflow has the appropriate permissions. Keep a local copy of your work; do not include passwords, access tokens or unrelated personal information.

## 1. Instructions for your task
- Task: What do you do every day or week that you want the agent to help with?
- Person responsible: Who checks the result, deals with problems and can stop the task?
- Information to use: Which files or records should the agent follow? Say where they are, when they were updated and what each field means.
- Result you want: What should the agent produce, where should it save it and what should it include?
- When to start: What time or event starts the task? Include the time zone and when the information needs to be ready.
- How to check: What checks show that the result is correct and nothing important is missing?
- Allowed actions: What can the agent do, what needs approval and what must it not do?
- If something goes wrong: When should the task stop, what records should you keep and what must you check before trying again?
- Time and cost: How long does the task take today, what mistakes happen and what does it cost?
- Version: Date, version number, change reason and tests to repeat.

## 2. Information your agent can use
| Source ID | Location or file | Owner | Question it can answer | Snapshot date | Freshness limit | Sensitivity | Conflict priority |
|---|---|---|---|---|---|---|---|
| | | | | | | | |
Keep publication date, event date and retrieval date separately when they differ. Label fictional sources and simulations.

## 3. What the agent is allowed to do
| Action | Input or destination | Allowed / approval / blocked | Approver | Enforced control | Test and observed effect |
|---|---|---|---|---|---|
| Read | | | | | |
| Draft | | | | | |
| Edit | | | | | |
| Send / publish | | | | | |
| Delete / buy / grant access | | | | | |

## 4. Test log
Write the expected behaviour before running the case. Keep evidence of failed attempts and explain corrections.
| Case ID | Brief version | Input snapshot | Expected behaviour | Actual behaviour | Evidence location | Pass / fail | Change and retest |
|---|---|---|---|---|---|---|---|
| Normal | | | | | | | |
| Missing information | | | | | | | |
| Boundary | | | | | | | |
| Conflicting instruction | | | | | | | |
| Duplicate event | | | | | | | |
| Interrupted run | | | | | | | |
| Unseen changed case | | | | | | | |

## 5. Record of each attempt
| Run key | Trigger | Start and end | Source snapshot | Brief version | Completed effects | Output location | Final state |
|---|---|---|---|---|---|---|---|
| | | | | | | | |
A failure state does not establish that no effects occurred. Inspect the actual output or system record before retrying.

## 6. Cost and value worksheet
| Comparable run | Preparation min | Review min | Correction min | Maintenance min | Operating charges | Defects | Useful alerts |
|---|---|---|---|---|---|---|---|
| Manual baseline | | | | | | | |
| Pilot 1 | | | | | | | |
| Pilot 2 | | | | | | | |
| Pilot 3 | | | | | | | |
Total effort = preparation + review + correction + maintenance. Indicative time value = minutes / 60 × stated hourly assumption. Indicative difference each time you do the task = manual time value minus pilot time value minus operating charges. Treat setup separately. Describe whether any cash expenditure actually changes, and test the effect of doubling review time or frequency.

## 7. Fixing problems and explaining the task to someone else
1. Name the issue, detection time and owner; pause the affected responsibility.
2. Preserve inputs, instructions, logs and failed outputs with sensitive details removed.
3. Check which effects actually happened and which remain unfinished.
4. Correct the source, instruction or boundary and retest the affected cases.
5. Resume only under the documented condition; stop when the retry or budget limit is reached.
6. Give the next owner source locations, trigger, permissions, output checks, pause method, costs and known limitations.

## 8. Where to find your project work
| Skill area | Files and results | Run or test evidence | Your explanation | Remaining limitation |
|---|---|---|---|---|
| Task design | | | | |
| Authority | | | | |
| Implementation | | | | |
| Verification | | | | |
| Recovery | | | | |
| Value and handover | | | | |
Identify live account evidence separately from desk simulation. A simulated workflow cannot validate platform operation.`;
export const assessmentGuide = `# How your practical assessment works
Your final project shows a task working and explains how you checked it. Provide your written instructions, the information you used, the result, your test log, a record of how you fixed a problem and your time-and-cost comparison. Paste the relevant parts of each file into your assessment answers; the AI assessor cannot open links. Remove passwords and private information that is not needed for the assessment.

An AI assessor checks the submitted evidence for six skill areas and gives each one a score from 0 to 4. You need at least 3 in EVERY area to pass. Finishing the practice questions or ticking off lessons does not earn a certificate. For a course about a particular product, you need to show the task running in an account that can use it. A practice simulation helps you learn, but cannot prove that you can run the product.

| Score | What it means |
|---|---|
| 0 | The work is missing or the AI assessor cannot check it. |
| 1 | Important steps are missing or the task does not stay within the agreed rules. |
| 2 | Some steps are correct, but you still need help or important corrections. |
| 3 | You can do the task yourself, explain your choices and show how you checked the result. |
| 4 | You meet the pass standard and can show a tested improvement, including what still needs care. |

## What a competent score of 3 requires
- Task design: choose a clear task, name who checks it, list the records to use, say when it starts and describe a correct result. The task must match the course project.
- Authority: show what the agent may do, what needs approval and what is blocked. Try each kind of action and show that a request inside a file cannot change these rules.
- Implementation: show the task running in the intended account or workspace. Keep its settings and result, explain what it needs to run, and label practice simulations honestly.
- Verification: show where the facts came from or how you checked the behaviour. Try at least six different examples, including missing information, the edge of a rule and something going wrong. Explain a new example provided in your course.
- Recovery: show how you spotted one failed task, checked which steps had already happened and tried again without repeating completed work. Explain when to pause or ask for help.
- Value and handover: compare three attempts at the task, including your time checking the work and running costs. Explain your assumptions. Give someone else enough information to find the files, check the result and stop the task.

## Review and improvement
The AI assessor reads the text evidence you submit and your answer to the course’s changed example. It gives a score and feedback for each skill area. It cannot open external links, run your agent or independently verify authorship. Include the relevant settings, source extracts, results and test records in your submission. If an area scores below 3, the feedback explains what to improve and what evidence to submit next. Keep your first attempt with the revised work so you can explain the changes.

You earn an Experrt certificate after the AI assessment confirms that every area has passed. It records your name, course version, assessed skills, date and a reference that can be checked. It is not an externally accredited qualification. In a purchased course, use the practical assessment section to submit your project. Your certificate describes the AI assessment method and its limits. An internal course preview does not submit assessments or issue certificates.`;
export const reviewerGuide = `# Experrt reviewer calibration and decision record
Read the course-specific expected results as well as the common assessment guide. Evaluate the learner's files and results, not the appearance of the report or the practice percentage. Require independent explanations of the consequential decisions.

## Review sequence
1. Identify learner, course version, attempt, evidence locations and whether the demonstration is live or simulated.
2. Inspect brief, actual permissions and source snapshots before assessing the output.
3. Check one final claim or behaviour independently and inspect an exception test.
4. Replay or inspect the practice problem and check actual effects for duplicates.
5. Ask the course-specific changed-case question. Record the learner's explanation and any assistance given.
6. Score each dimension separately, with an evidence reference and improvement action. A score below 3 in any dimension returns the attempt for revision. Do not compensate through averaging.
7. Record the decision and require a verified certificate workflow after a pass; never issue from browser practice progress.

## Calibration examples
- Attractive output, but no source or test evidence: verification 0 or 1 depending on what can actually be inspected; return the work.
- Correct normal output, but a missing field is silently guessed and needs prompting to fix: verification 2; require an independently explained missing-data case and retest.
- Complete permission table, but an external message is sent without required approval: authority 1; investigate the actual effect, restore the boundary and require a fresh demonstration.
- Correct checks, tested boundaries and recovery, with independent explanation: score 3 where the evidence meets each criterion.
- Same competent evidence plus a tested improvement on unseen cases with measured cost and documented limits: score 4 for the relevant dimension only.

## Feedback format
Skill: [name]. Score: [0–4]. Evidence: [file/run/case]. Observed: [specific behaviour]. Required improvement: [concrete action]. Reassessment: [case or result to inspect].

## Consistency check
For the AI assessment service, calibrate missing evidence, unsafe behaviour, conflicting instructions and a complete example against this guide. Record model, policy, scores and limits. Live platform demonstrations and learner pilots must be recorded separately; automated checks do not establish those results.`;
