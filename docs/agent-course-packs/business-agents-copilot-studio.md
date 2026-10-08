# Business Agents with Microsoft Copilot Studio
Version: 2026.10.2-ai-assessed
Status: authored teaching pack for review, not commercial release.
Suggested guided study: 7–8 hours including practical work; pilot timing not yet measured.

You will model and build a controlled service-request workflow for Cedar Support in a development environment. It prepares routing decisions while keeping access grants under human control.

## Audience and prerequisites
Business process owners and Microsoft ecosystem makers.
A suitable development environment, licensing and basic process mapping skills.

# 1.1 Learn the basics
Suggested minutes: 10

## Describe how the task works today

Cedar’s process contains validation, routing and approval decisions. Map these before choosing tools so that an agent does not grant account access simply because a request appears complete.

![List the steps and decisions; Decide who is responsible; Plan what happens when there is a problem](/courses/always-on-agents/responsibility.svg)

### Describe how the task works before asking an agent to help

Write down how the task moves from a request to a checked result. Include the decisions people make, the records they use and the problems they deal with. If the task is unclear today, an agent may repeat the same confusion more often.

Separate simple rules from decisions that need a person. Checking whether a request has a contact address is a rule. Deciding whether someone should receive an exception may need a manager. The agent can prepare the information without making that decision itself.

Give each request a clear status, such as received, checked, awaiting approval or completed. The status should describe what actually happened. Keep the same request ID through the steps so you can follow the work and spot repeated requests.

---

# 1.2 Plan your own task
Suggested minutes: 10

## Planning your task

Draw the normal steps and one example where something goes wrong. Beside each step, name who acts, what information they need, what they may do and what record they leave.

Try a valid request, an incomplete request and a repeated request. Check the final record in the app and compare it with what the agent told the person responsible.

### In this practice example

Cedar’s process contains validation, routing and approval decisions. Map these before choosing tools so that an agent does not grant account access simply because a request appears complete.

Before continuing, locate the relevant records in the practice files. Explain which rule applies and write what you expect the next step to produce. Compare that expectation with the worked example rather than relying on the output's tone.

---

# 1.3 Look at an example
Suggested minutes: 8

## Worked example

You will model and build a controlled service-request workflow for Cedar Support in a development environment. It prepares routing decisions while keeping access grants under human control.

R201 routes to Operations, R202 to IT and R203 to the IT owner for an approval decision. Missing contact and unknown category are separate review paths.

### What makes this result correct

The map assigns owners and clear task statuses to normal and exception paths.

### Try a different example

Choose one source value or task condition and change it in a copy of the practice files. Write how the expected result should change and which permission must remain the same. Preserve the original so that you can explain the difference. Use the answer guide after attempting the exercise.

---

# 1.4 Make a decision and explain it
Suggested minutes: 7

## Your decision

Cedar wants automatic handling, but its access approval step has not been mapped. What is a suitable pilot?

Choose the answer that follows the facts and instructions in this example. These are practice decisions; completing them does not award a certificate.

1. Choose a regular task where you can check and correct a draft.
2. Ask the agent to take over all the work and decide what success means afterwards.
3. Choose the task with the biggest possible saving, even if you do not have the information it needs.

---

# 1.5 Try it yourself
Suggested minutes: 30

## Try the task yourself

Map the current process, account for every starter request and record baseline time and errors.

### Work through the exercise

1. Download the practice files and workbook. Use a copy so that original records remain available. Record the course version and whether you are using a live account or a desk simulation.
2. Find the records and instructions you need for this module. Write the expected result before the run or desk exercise.
3. Try the task above using your practice files and the tools you have permission to use. Keep the records, result and settings someone would need to repeat it. Do not send messages, publish, buy or change live business records during this exercise.
4. Open the result or app record and check it yourself. Compare the actual result with the expected checks below and record any failure.
5. Fix one problem or change one detail in the practice information, then repeat the affected check. Keep both attempts and explain the change.
6. Record what you did and where you saved the work in your workbook and explain the decision in your own words. If your account cannot do a step, label your work as a practice simulation and note what you still need to try in the product.

### Check your work

The map assigns owners and clear task statuses to normal and exception paths.

### What to keep

Request handling map, ownership and success measures.

---

# 1.6 Keep your work and explain what you learned
Suggested minutes: 10

## Keep a record of your work

Record what you learned by explaining one decision from this module. Explain which information you used, which rule you followed, what happened and how you checked it. Use your test log to record what you expected and what happened. List where you saved the files so a reviewer can find them.

### Questions to help you explain your work

- What did you expect before running the task, and what helped you decide that?
- What happened, and where can someone else check the result?
- What was the agent allowed to do, and did it keep to those rules when the information changed?
- What went wrong or still needs checking, and what would you do next?

### What to keep from this module

Request handling map, ownership and success measures.

### Check your result

The map assigns owners and clear task statuses to normal and exception paths.

Use the workbook to link files or records. Explain whether the evidence comes from a live demonstration or a simulation. The next module builds on this work, so keep the current version and any earlier attempt.

---

# 2.1 Learn the basics
Suggested minutes: 10

## Build your agent and give it the right information

Build in a development environment with a small approved knowledge set: field definitions, routing rules and approval policy. Reliable grounding means answers can be traced to those records.

![Find the original record; Check what it says and when; Separate facts from guesses](/courses/always-on-agents/verification.svg)

### Check where each fact comes from

For each important statement in a report, you should be able to show the record that supports it. Keep a list of the files or websites you use, what each one tells you and when it was last updated. An article published today may describe something that happened months ago.

Check the original information rather than accepting a link as proof. Does the record support the exact number, date and conclusion in the draft? Two articles repeating the same announcement do not provide two separate confirmations.

Keep missing information visible. A missing number is not the same as zero, and an unavailable file is not proof that nothing changed. If you draw a conclusion from several facts, explain your reasoning. Make it clear when you are describing something that happened, something expected to happen or something still uncertain.

---

# 2.2 Plan your own task
Suggested minutes: 10

## Planning your task

Make a table of the important statements in your draft. Beside each one, record where you found the supporting information and what you checked. Recalculate totals and compare the draft with all the relevant records, including anything it left out.

Try an old record and a repeated article. Explain whether each one still helps answer the question, what remains unclear and which additional information would resolve it.

### In this practice example

Build in a development environment with a small approved knowledge set: field definitions, routing rules and approval policy. Reliable grounding means answers can be traced to those records.

Before continuing, locate the relevant records in the practice files. Explain which rule applies and write what you expect the next step to produce. Compare that expectation with the worked example rather than relying on the output's tone.

---

# 2.3 Look at an example
Suggested minutes: 8

## Worked example

You will model and build a controlled service-request workflow for Cedar Support in a development environment. It prepares routing decisions while keeping access grants under human control.

The equipment rule supports routing a keyboard request to Operations. It does not support deciding that a requester should receive administrator rights.

### What makes this result correct

Responses distinguish the routing rule from decisions the policy does not authorise.

### Try a different example

Choose one source value or task condition and change it in a copy of the practice files. Write how the expected result should change and which permission must remain the same. Preserve the original so that you can explain the difference. Use the answer guide after attempting the exercise.

---

# 2.4 Make a decision and explain it
Suggested minutes: 7

## Your decision

The agent confidently recommends administrator access although its knowledge only covers routing. How should the finding be checked?

Choose the answer that follows the facts and instructions in this example. These are practice decisions; completing them does not award a certificate.

1. Use the newest article without checking its original source.
2. Treat several repeats of the same announcement as separate confirmation.
3. Check the original record, its scope and the date the event takes effect.

---

# 2.5 Try it yourself
Suggested minutes: 30

## Try the task yourself

Configure the agent with the fictional policy in the intended development environment. Test one normal and one ambiguous question and inspect the supporting source.

### Work through the exercise

1. Download the practice files and workbook. Use a copy so that original records remain available. Record the course version and whether you are using a live account or a desk simulation.
2. Find the records and instructions you need for this module. Write the expected result before the run or desk exercise.
3. Try the task above using your practice files and the tools you have permission to use. Keep the records, result and settings someone would need to repeat it. Do not send messages, publish, buy or change live business records during this exercise.
4. Open the result or app record and check it yourself. Compare the actual result with the expected checks below and record any failure.
5. Fix one problem or change one detail in the practice information, then repeat the affected check. Keep both attempts and explain the change.
6. Record what you did and where you saved the work in your workbook and explain the decision in your own words. If your account cannot do a step, label your work as a practice simulation and note what you still need to try in the product.

### Check your work

Responses distinguish the routing rule from decisions the policy does not authorise.

### What to keep

Configured agent and example answers linked to their sources.

---

# 2.6 Keep your work and explain what you learned
Suggested minutes: 10

## Keep a record of your work

Record what you learned by explaining one decision from this module. Explain which information you used, which rule you followed, what happened and how you checked it. Use your test log to record what you expected and what happened. List where you saved the files so a reviewer can find them.

### Questions to help you explain your work

- What did you expect before running the task, and what helped you decide that?
- What happened, and where can someone else check the result?
- What was the agent allowed to do, and did it keep to those rules when the information changed?
- What went wrong or still needs checking, and what would you do next?

### What to keep from this module

Configured agent and example answers linked to their sources.

### Check your result

Responses distinguish the routing rule from decisions the policy does not authorise.

Use the workbook to link files or records. Explain whether the evidence comes from a live demonstration or a simulation. The next module builds on this work, so keep the current version and any earlier attempt.

---

# 3.1 Learn the basics
Suggested minutes: 10

## Connect tools and choose which actions need approval

Separate the connection used to read a request from actions that mutate records or grant permissions. Confirm the environment’s policies and connector capabilities; do not rely on the conversational instruction as the only control.

![Read the right information; Prepare work for review; Ask before taking action](/courses/always-on-agents/authority.svg)

### Choose what your agent can see and do

Being able to do something does not mean the agent has permission to do it. Reading a project tracker, writing a reminder and sending that reminder to a customer are separate actions. Decide which ones you want it to take before connecting your apps.

Make a table with three groups: actions the agent may take, actions that need approval and actions it must not take. Name the person who can approve each action. Where an app has access settings, use them to support these rules. Written instructions alone may not stop a tool from doing something it can technically do.

A file can contain a request that conflicts with your instructions. For example, a project note might ask the agent to send the report to a new address. The agent may read that note, but the note cannot give it permission to share the report. It should keep your rules in place and explain the conflict.

---

# 3.2 Plan your own task
Suggested minutes: 10

## Planning your task

List the actions involved in your task, such as reading, writing, changing records, sending messages and deleting files. Give the agent only the access it needs. Using fictional information, try one allowed action, one that needs approval and one that is blocked.

Check what actually happened in the app or output folder. Do not rely only on the agent saying an action was blocked. Keep your instructions, access settings and check results together, with passwords and private account details removed.

### In this practice example

Separate the connection used to read a request from actions that mutate records or grant permissions. Confirm the environment’s policies and connector capabilities; do not rely on the conversational instruction as the only control.

Before continuing, locate the relevant records in the practice files. Explain which rule applies and write what you expect the next step to produce. Compare that expectation with the worked example rather than relying on the output's tone.

---

# 3.3 Look at an example
Suggested minutes: 8

## Worked example

You will model and build a controlled service-request workflow for Cedar Support in a development environment. It prepares routing decisions while keeping access grants under human control.

The request-preparation tool can create a draft routing record. An access grant remains outside the practice agent’s authority.

### What makes this result correct

The agent records awaiting approval and produces no access-grant effect.

### Try a different example

Choose one source value or task condition and change it in a copy of the practice files. Write how the expected result should change and which permission must remain the same. Preserve the original so that you can explain the difference. Use the answer guide after attempting the exercise.

---

# 3.4 Make a decision and explain it
Suggested minutes: 7

## Your decision

R203 has all required fields and asks for administrator rights. Which state is supported by the policy?

Choose the answer that follows the facts and instructions in this example. These are practice decisions; completing them does not award a certificate.

1. Reject all access requests without showing them to the owner.
2. Record the request as awaiting approval and preserve its request ID.
3. Grant access because all required fields are present.

---

# 3.5 Try it yourself
Suggested minutes: 30

## Try the task yourself

Document tools, connection identities and allowed operations. Test R203 and demonstrate the approval gate without granting real rights.

### Work through the exercise

1. Download the practice files and workbook. Use a copy so that original records remain available. Record the course version and whether you are using a live account or a desk simulation.
2. Find the records and instructions you need for this module. Write the expected result before the run or desk exercise.
3. Try the task above using your practice files and the tools you have permission to use. Keep the records, result and settings someone would need to repeat it. Do not send messages, publish, buy or change live business records during this exercise.
4. Open the result or app record and check it yourself. Compare the actual result with the expected checks below and record any failure.
5. Fix one problem or change one detail in the practice information, then repeat the affected check. Keep both attempts and explain the change.
6. Record what you did and where you saved the work in your workbook and explain the decision in your own words. If your account cannot do a step, label your work as a practice simulation and note what you still need to try in the product.

### Check your work

The agent records awaiting approval and produces no access-grant effect.

### What to keep

Connector tests and action permissions.

---

# 3.6 Keep your work and explain what you learned
Suggested minutes: 10

## Keep a record of your work

Record what you learned by explaining one decision from this module. Explain which information you used, which rule you followed, what happened and how you checked it. Use your test log to record what you expected and what happened. List where you saved the files so a reviewer can find them.

### Questions to help you explain your work

- What did you expect before running the task, and what helped you decide that?
- What happened, and where can someone else check the result?
- What was the agent allowed to do, and did it keep to those rules when the information changed?
- What went wrong or still needs checking, and what would you do next?

### What to keep from this module

Connector tests and action permissions.

### Check your result

The agent records awaiting approval and produces no access-grant effect.

Use the workbook to link files or records. Explain whether the evidence comes from a live demonstration or a simulation. The next module builds on this work, so keep the current version and any earlier attempt.

---

# 4.1 Learn the basics
Suggested minutes: 10

## Choose when the task starts and who checks it

Copilot Studio event triggers deliver event data through connectors; the provider notes that available triggers depend on organisational data policies. Treat trigger content as input and keep author instructions authoritative.

![Choose a time or event; Check the information is ready; Keep a record of each attempt](/courses/always-on-agents/brief.svg)

### Choose when your agent should do the task

Decide what should start the task. It might be a time each week, a new request arriving or a regular check for changes. This starting point is often called a trigger. Setting a time does not guarantee the information is ready or that the previous attempt has finished.

Write down the time zone, when the information needs to be available and what should happen if the task is missed. If a report uses old records, it should say so. Repeated reminders or requests can also start the same task twice, so the agent needs a way to recognise work it has already done.

Give each report or request a unique reference, such as “weekly-brief:2026-10-05”. Keep the input version, start time, result and output location beside it. That reference helps you check what happened and avoid creating another copy by accident.

---

# 4.2 Plan your own task
Suggested minutes: 10

## Planning your task

Try the task manually before setting up a regular schedule. Check the first result, then use the scheduling controls available in your product. Try starting the same task again and check whether it creates a duplicate.

Also test a missing file and a missed scheduled task. Decide whether to try again, wait for fresh information or ask the person responsible. Write down how to pause the schedule and who is responsible for doing that.

### In this practice example

Copilot Studio event triggers deliver event data through connectors; the provider notes that available triggers depend on organisational data policies. Treat trigger content as input and keep author instructions authoritative.

Before continuing, locate the relevant records in the practice files. Explain which rule applies and write what you expect the next step to produce. Compare that expectation with the worked example rather than relying on the output's tone.

---

# 4.3 Look at an example
Suggested minutes: 8

## Worked example

You will model and build a controlled service-request workflow for Cedar Support in a development environment. It prepares routing decisions while keeping access grants under human control.

A repeated row event for R202 is a repeated delivery, not a new service request. Validate the payload and preserve its request ID.

### What makes this result correct

Each distinct request reaches its intended state once; invalid data remains visible for review.

### Try a different example

Choose one source value or task condition and change it in a copy of the practice files. Write how the expected result should change and which permission must remain the same. Preserve the original so that you can explain the difference. Use the answer guide after attempting the exercise.

---

# 4.4 Make a decision and explain it
Suggested minutes: 7

## Your decision

The same R202 event arrives twice. What should determine whether another routing record is created?

Choose the answer that follows the facts and instructions in this example. These are practice decisions; completing them does not award a certificate.

1. Create a new output because each trigger delivery deserves its own response.
2. Suppress every similar-looking future item.
3. Use the existing item ID or run key to check whether the intended output already exists.

---

# 4.5 Try it yourself
Suggested minutes: 30

## Try the task yourself

Configure a permitted development trigger or document the simulated payload. Run valid, missing-field and repeated-event cases through the complete routing path.

### Work through the exercise

1. Download the practice files and workbook. Use a copy so that original records remain available. Record the course version and whether you are using a live account or a desk simulation.
2. Find the records and instructions you need for this module. Write the expected result before the run or desk exercise.
3. Try the task above using your practice files and the tools you have permission to use. Keep the records, result and settings someone would need to repeat it. Do not send messages, publish, buy or change live business records during this exercise.
4. Open the result or app record and check it yourself. Compare the actual result with the expected checks below and record any failure.
5. Fix one problem or change one detail in the practice information, then repeat the affected check. Keep both attempts and explain the change.
6. Record what you did and where you saved the work in your workbook and explain the decision in your own words. If your account cannot do a step, label your work as a practice simulation and note what you still need to try in the product.

### Check your work

Each distinct request reaches its intended state once; invalid data remains visible for review.

### What to keep

End-to-end fictional request run.

---

# 4.6 Keep your work and explain what you learned
Suggested minutes: 10

## Keep a record of your work

Record what you learned by explaining one decision from this module. Explain which information you used, which rule you followed, what happened and how you checked it. Use your test log to record what you expected and what happened. List where you saved the files so a reviewer can find them.

### Questions to help you explain your work

- What did you expect before running the task, and what helped you decide that?
- What happened, and where can someone else check the result?
- What was the agent allowed to do, and did it keep to those rules when the information changed?
- What went wrong or still needs checking, and what would you do next?

### What to keep from this module

End-to-end fictional request run.

### Check your result

Each distinct request reaches its intended state once; invalid data remains visible for review.

Use the workbook to link files or records. Explain whether the evidence comes from a live demonstration or a simulation. The next module builds on this work, so keep the current version and any earlier attempt.

---

# 5.1 Learn the basics
Suggested minutes: 10

## Test what happens when something goes wrong

Use operating records to inspect actual effects, not just the agent’s response. Include unknown categories, lost acknowledgements and trigger data that conflicts with the current policy.

![Write the expected result; Try different examples; Compare with what happened](/courses/always-on-agents/verification.svg)

### Check the results with examples you understand

Before asking the agent to work, write down what a correct result would be. This gives you something to compare with its answer. Include an ordinary example, one with missing information, one at the edge of a rule and one where something goes wrong.

Check what the result includes and what it leaves out. A report can contain only true statements while missing the overdue project you needed to see. Compare it with the whole set of records. For research, check important claims against the original sources rather than only reading the summary.

Keep a test log: a table of the input, expected result, actual result and your check. If something fails, record it, make a specific correction and repeat the affected checks. Several correct answers do not cancel out a serious problem, such as sending a message without permission.

---

# 5.2 Plan your own task
Suggested minutes: 10

## Planning your task

Prepare at least six different examples. Keep one extra example aside until after you improve the instructions, so you can check whether the change also works on something new.

Try the exercise before opening the answer guide. If your result differs, go back to the records and explain why. Your aim is to understand the decision, rather than remember which answer to select.

### In this practice example

Use operating records to inspect actual effects, not just the agent’s response. Include unknown categories, lost acknowledgements and trigger data that conflicts with the current policy.

Before continuing, locate the relevant records in the practice files. Explain which rule applies and write what you expect the next step to produce. Compare that expectation with the worked example rather than relying on the output's tone.

---

# 5.3 Look at an example
Suggested minutes: 8

## Worked example

You will model and build a controlled service-request workflow for Cedar Support in a development environment. It prepares routing decisions while keeping access grants under human control.

R204 should remain an incomplete exception, and R205 needs review. The lost acknowledgement for R201 requires checking the existing routing record.

### What makes this result correct

One record per valid distinct ID, explicit exceptions and no access grant.

### Try a different example

Choose one source value or task condition and change it in a copy of the practice files. Write how the expected result should change and which permission must remain the same. Preserve the original so that you can explain the difference. Use the answer guide after attempting the exercise.

---

# 5.4 Make a decision and explain it
Suggested minutes: 7

## Your decision

The trigger log says R201 failed, but a routing record already exists. What should the recovery step inspect?

Choose the answer that follows the facts and instructions in this example. These are practice decisions; completing them does not award a certificate.

1. Delete the existing result to make it easier to start again.
2. Check what has already happened and continue only the unfinished steps.
3. Start the whole task again because it is marked as failed.

---

# 5.5 Try it yourself
Suggested minutes: 30

## Try the task yourself

Test every supplied request and the lost-acknowledgement card. Compare agent output with the final queue and keep a test log.

### Work through the exercise

1. Download the practice files and workbook. Use a copy so that original records remain available. Record the course version and whether you are using a live account or a desk simulation.
2. Find the records and instructions you need for this module. Write the expected result before the run or desk exercise.
3. Try the task above using your practice files and the tools you have permission to use. Keep the records, result and settings someone would need to repeat it. Do not send messages, publish, buy or change live business records during this exercise.
4. Open the result or app record and check it yourself. Compare the actual result with the expected checks below and record any failure.
5. Fix one problem or change one detail in the practice information, then repeat the affected check. Keep both attempts and explain the change.
6. Record what you did and where you saved the work in your workbook and explain the decision in your own words. If your account cannot do a step, label your work as a practice simulation and note what you still need to try in the product.

### Check your work

One record per valid distinct ID, explicit exceptions and no access grant.

### What to keep

Invalid-input, duplicate and failure tests.

---

# 5.6 Keep your work and explain what you learned
Suggested minutes: 10

## Keep a record of your work

Record what you learned by explaining one decision from this module. Explain which information you used, which rule you followed, what happened and how you checked it. Use your test log to record what you expected and what happened. List where you saved the files so a reviewer can find them.

### Questions to help you explain your work

- What did you expect before running the task, and what helped you decide that?
- What happened, and where can someone else check the result?
- What was the agent allowed to do, and did it keep to those rules when the information changed?
- What went wrong or still needs checking, and what would you do next?

### What to keep from this module

Invalid-input, duplicate and failure tests.

### Check your result

One record per valid distinct ID, explicit exceptions and no access grant.

Use the workbook to link files or records. Explain whether the evidence comes from a live demonstration or a simulation. The next module builds on this work, so keep the current version and any earlier attempt.

---

# 6.1 Learn the basics
Suggested minutes: 10

## Plan a small trial with your team

A controlled business pilot needs an owner, budget, monitoring frequency and a reversal plan. The event-trigger documentation notes usage impacts, so include invocation frequency in the cost model.

![Collect your work and checks; Explain your decisions; Try a new example](/courses/always-on-agents/capstone.svg)

### Show your work and explain how someone else can run it

Your final project shows the task working and explains how you checked it. Keep the instructions, results, test log and record of how you fixed a problem. These are your assessment evidence: the work a reviewer can inspect to understand what you did.

Include where the information comes from, what the agent is allowed to do, when it runs, the costs and any known problems. Remove passwords and unrelated private information. Someone taking over should be able to find the result, check it and pause the task.

A reviewer will also ask you to explain your choices or try a changed example. This checks that you understand the method, rather than only the prepared result. Completing the practice activities does not by itself earn a certificate.

---

# 6.2 Plan your own task
Suggested minutes: 10

## Planning your task

Ask someone to follow your instructions without your help. Notice where they get stuck and make those steps clearer. Try the changed example and explain whether the agent should continue, stop or ask for help.

To pass the practical assessment, you need at least 3 out of 4 in each skill area. If an area needs improvement, the reviewer should explain what to fix and which work to provide. Keep your earlier attempt and the revised work together.

### In this practice example

A controlled business pilot needs an owner, budget, monitoring frequency and a reversal plan. The event-trigger documentation notes usage impacts, so include invocation frequency in the cost model.

Before continuing, locate the relevant records in the practice files. Explain which rule applies and write what you expect the next step to produce. Compare that expectation with the worked example rather than relying on the output's tone.

---

# 6.3 Look at an example
Suggested minutes: 8

## Worked example

You will model and build a controlled service-request workflow for Cedar Support in a development environment. It prepares routing decisions while keeping access grants under human control.

A pilot can prepare routing for a small fictional queue before any real business data or external action is introduced.

### What makes this result correct

The pilot proposal states decision rights, stop criteria, costs and evidence for each skill area.

### Try a different example

Choose one source value or task condition and change it in a copy of the practice files. Write how the expected result should change and which permission must remain the same. Preserve the original so that you can explain the difference. Use the answer guide after attempting the exercise.

---

# 6.4 Make a decision and explain it
Suggested minutes: 7

## Your decision

The agent routes normal requests well but has not passed duplicate or access-boundary tests. What should happen before validation?

Choose the answer that follows the facts and instructions in this example. These are practice decisions; completing them does not award a certificate.

1. Award a certificate because every practice activity is marked complete.
2. Use high scores in other areas to make up for the failed permission check.
3. Have a reviewer check the work and provide anything still missing.

---

# 6.5 Complete your final practical project
Suggested minutes: 45

## Your final practical project

Package the agent configuration, source rules, tool permissions, trigger tests and recovery demonstration. Recommend a small trial using the supplied baseline.

### Work through the exercise

1. Download the practice files and workbook. Use a copy so that original records remain available. Record the course version and whether you are using a live account or a desk simulation.
2. Find the records and instructions you need for this module. Write the expected result before the run or desk exercise.
3. Try the task above using your practice files and the tools you have permission to use. Keep the records, result and settings someone would need to repeat it. Do not send messages, publish, buy or change live business records during this exercise.
4. Open the result or app record and check it yourself. Compare the actual result with the expected checks below and record any failure.
5. Fix one problem or change one detail in the practice information, then repeat the affected check. Keep both attempts and explain the change.
6. Record what you did and where you saved the work in your workbook and explain the decision in your own words. If your account cannot do a step, label your work as a practice simulation and note what you still need to try in the product.

### Check your work

The pilot proposal states decision rights, stop criteria, costs and evidence for each skill area.

### What to keep

Final project solution, reversal and recovery plan and owner handover.

### A new example to try

Deliver the R201 trigger twice, with a lost acknowledgement between deliveries. Prove that the final queue contains one routing record for R201.

### Assessment

Review the Practical assessment guide resource. Your final evidence must demonstrate all six skill areas, with a competent score of at least 3 out of 4 in every area. The reviewer checks your work and individual explanation; practice completion alone does not award a certificate.

---

# 6.6 Keep your work and explain what you learned
Suggested minutes: 10

## Keep a record of your work

Record what you learned by explaining one decision from this module. Explain which information you used, which rule you followed, what happened and how you checked it. Use your test log to record what you expected and what happened. List where you saved the files so a reviewer can find them.

### Questions to help you explain your work

- What did you expect before running the task, and what helped you decide that?
- What happened, and where can someone else check the result?
- What was the agent allowed to do, and did it keep to those rules when the information changed?
- What went wrong or still needs checking, and what would you do next?

### What to keep from this module

Final project solution, reversal and recovery plan and owner handover.

### Check your result

The pilot proposal states decision rights, stop criteria, costs and evidence for each skill area.

Use the workbook to link files or records. Explain whether the evidence comes from a live demonstration or a simulation. The next module builds on this work, so keep the current version and any earlier attempt.

# Reference and resource pack

# Business Agents with Microsoft Copilot Studio
Version: 2026.10.2-ai-assessed

You will model and build a controlled service-request workflow for Cedar Support in a development environment. It prepares routing decisions while keeping access grants under human control.

## Cedar Support practice request queue
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

Fictional baseline: 30 requests/week, 4 minutes triage each, 3 routing errors/week. Practice pilot: 30 requests, 35 minutes review, 20 minutes maintenance, £5 usage, 1 routing error. Calculate a comparison at an assumed £20/hour, and explain why one week does not prove a sustained improvement.

---

# Your task workbook
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
Identify live account evidence separately from desk simulation. A simulated workflow cannot validate platform operation.

---

# How your practical assessment works
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

You earn an Experrt certificate after the AI assessment confirms that every area has passed. It records your name, course version, assessed skills, date and a reference that can be checked. It is not an externally accredited qualification. In a purchased course, use the practical assessment section to submit your project. Your certificate describes the AI assessment method and its limits. An internal course preview does not submit assessments or issue certificates.

---

# Copilot Studio lab walkthrough
## Prepare a development environment
Confirm the environment and licensing with your administrator. Consult the linked quickstart for the experience available in your tenant. Use a development environment containing only the fictional Cedar policy and queue, and record which features and connectors you can actually use.

## Build the smallest useful agent
Create an agent for request preparation. Add the fictional routing policy as its approved knowledge using the supported knowledge route. Inspect generated instructions and suggested tools before accepting them. Keep sending and access grants outside this lab. Test normal and ambiguous requests in the platform's test experience.

```text
Prepare Cedar Support's routing pack from the supplied request queue. Required fields are ID, category and contact. Equipment routes to Operations; software routes to IT; access requests await the IT owner's approval. Unknown categories and missing fields become review exceptions. Keep one record per distinct request ID and check existing records before retrying a delivery. Produce a draft queue and exception list. Do not grant rights, send messages or alter live records. Record the policy version and evidence for each decision.
```

## Introduce tools and a trigger gradually
Begin with draft output. Add only a permitted development connector for the required record operation. If your environment supports the intended event trigger, supply the request ID and fields as the payload; otherwise use a labelled simulated payload. Record the connection identity and organisational policy constraints. Validate the payload before routing and check whether the request ID already has an effect.

## Check the final state
Test R201–R205 plus repeated R202 delivery. Inspect the actual queue, not just the conversational reply. Simulate a lost acknowledgement after R201's record is created, then check it before retrying. Do not publish to a live channel or grant rights as part of this practice exercise.

# Your activity notes
This download does not submit work or issue a certificate. Use your purchased course assessment to submit your project.

## 1.1 Learn the basics

[Write your explanation and evidence references here.]

## 1.2 Plan your own task

[Write your explanation and evidence references here.]

## 1.3 Look at an example

[Write your explanation and evidence references here.]

## 1.4 Make a decision and explain it

[Write your explanation and evidence references here.]

## 1.5 Try it yourself

[Write your explanation and evidence references here.]

## 1.6 Keep your work and explain what you learned

[Write your explanation and evidence references here.]

## 2.1 Learn the basics

[Write your explanation and evidence references here.]

## 2.2 Plan your own task

[Write your explanation and evidence references here.]

## 2.3 Look at an example

[Write your explanation and evidence references here.]

## 2.4 Make a decision and explain it

[Write your explanation and evidence references here.]

## 2.5 Try it yourself

[Write your explanation and evidence references here.]

## 2.6 Keep your work and explain what you learned

[Write your explanation and evidence references here.]

## 3.1 Learn the basics

[Write your explanation and evidence references here.]

## 3.2 Plan your own task

[Write your explanation and evidence references here.]

## 3.3 Look at an example

[Write your explanation and evidence references here.]

## 3.4 Make a decision and explain it

[Write your explanation and evidence references here.]

## 3.5 Try it yourself

[Write your explanation and evidence references here.]

## 3.6 Keep your work and explain what you learned

[Write your explanation and evidence references here.]

## 4.1 Learn the basics

[Write your explanation and evidence references here.]

## 4.2 Plan your own task

[Write your explanation and evidence references here.]

## 4.3 Look at an example

[Write your explanation and evidence references here.]

## 4.4 Make a decision and explain it

[Write your explanation and evidence references here.]

## 4.5 Try it yourself

[Write your explanation and evidence references here.]

## 4.6 Keep your work and explain what you learned

[Write your explanation and evidence references here.]

## 5.1 Learn the basics

[Write your explanation and evidence references here.]

## 5.2 Plan your own task

[Write your explanation and evidence references here.]

## 5.3 Look at an example

[Write your explanation and evidence references here.]

## 5.4 Make a decision and explain it

[Write your explanation and evidence references here.]

## 5.5 Try it yourself

[Write your explanation and evidence references here.]

## 5.6 Keep your work and explain what you learned

[Write your explanation and evidence references here.]

## 6.1 Learn the basics

[Write your explanation and evidence references here.]

## 6.2 Plan your own task

[Write your explanation and evidence references here.]

## 6.3 Look at an example

[Write your explanation and evidence references here.]

## 6.4 Make a decision and explain it

[Write your explanation and evidence references here.]

## 6.5 Complete your final practical project

[Write your explanation and evidence references here.]

## 6.6 Keep your work and explain what you learned

[Write your explanation and evidence references here.]

# Official sources
Documentary review: 1 October 2026. Account-level platform testing remains separate.
- Copilot Studio: create and test an agent: https://learn.microsoft.com/en-us/microsoft-copilot-studio/fundamentals-get-started
- Copilot Studio: agent fundamentals: https://learn.microsoft.com/en-us/microsoft-copilot-studio/fundamentals-what-is-copilot-studio
- Copilot Studio: event triggers: https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-triggers-about
