# Agents for Developers
Version: 2026.10.2-ai-assessed
Status: authored teaching pack for review, not commercial release.
Suggested guided study: 7–8 hours including practical work; pilot timing not yet measured.

You will delegate and review a small date-classification fix in a disposable repository. The starter deliberately contains several bugs that one passing test does not detect.

## Audience and prerequisites
Developers delegating clearly scoped software work and maintenance.
Git, code review and testing experience; a disposable practice repository is required.

# 1.1 Learn the basics
Suggested minutes: 10

## Describe the code change and how you will test it

The starter classification function has more than one defect. Write the requirements and test cases before asking an agent to fix it, so that a narrow successful example cannot hide completion and boundary errors.

![Show the problem; Review the change; Run the checks yourself](/courses/always-on-agents/verification.svg)

### Ask your agent for a code change you can review

Describe the bug, how to reproduce it and what the code should do instead. Say which files or part of the application are in scope. “Improve this repository” leaves the agent guessing which changes are needed.

Use a separate practice copy of the code so your experiment does not affect someone else’s changes. Record the starting state. Give the agent only the tools and access needed for the task, and keep production passwords and keys out of the exercise. Keep a list of changes and the commands used to test them.

Passing tests only shows that the checks in those tests passed. Inspect changed assertions and any added packages. A test can be made green by accepting the wrong result. Run the original problem yourself and check a nearby case that should still work.

---

# 1.2 Plan your own task
Suggested minutes: 10

## Planning your task

Create a failing example before asking for the fix. Ask the agent for the code change, an explanation and test results. Check that the test fails on the original bug, then run the tests yourself on the fix.

If you reject the change, keep its records and return the practice copy to a known state using a checked recovery method. Do not discard unrelated work to make the exercise easier.

### In this practice example

The starter classification function has more than one defect. Write the requirements and test cases before asking an agent to fix it, so that a narrow successful example cannot hide completion and boundary errors.

Before continuing, locate the relevant records in the practice files. Explain which rule applies and write what you expect the next step to produce. Compare that expectation with the worked example rather than relying on the output's tone.

---

# 1.3 Look at an example
Suggested minutes: 8

## Worked example

You will delegate and review a small date-classification fix in a disposable repository. The starter deliberately contains several bugs that one passing test does not detect.

The existing test covers one overdue open project. It does not cover completed, missing-date or due-today records.

### What makes this result correct

Tests expose the starter’s defects and preserve the strict earlier-than rule.

### Try a different example

Choose one source value or task condition and change it in a copy of the practice files. Write how the expected result should change and which permission must remain the same. Preserve the original so that you can explain the difference. Use the answer guide after attempting the exercise.

---

# 1.4 Make a decision and explain it
Suggested minutes: 7

## Your decision

Only the original overdue test passes. What evidence should be added before accepting a fix?

Choose the answer that follows the facts and instructions in this example. These are practice decisions; completing them does not award a certificate.

1. Write expected outcomes and check normal, incomplete, boundary and failure cases.
2. Accept a successful demonstration as evidence that every case is covered.
3. Change expected results to match the agent’s latest output.

---

# 1.5 Try it yourself
Suggested minutes: 30

## Try the task yourself

Create the two starter files in a new practice repository. Add tests for complete, missing-date, due-today and future cases, then run them before implementation.

### Work through the exercise

1. Download the practice files and workbook. Use a copy so that original records remain available. Record the course version and whether you are using a live account or a desk simulation.
2. Find the records and instructions you need for this module. Write the expected result before the run or desk exercise.
3. Try the task above using your practice files and the tools you have permission to use. Keep the records, result and settings someone would need to repeat it. Do not send messages, publish, buy or change live business records during this exercise.
4. Open the result or app record and check it yourself. Compare the actual result with the expected checks below and record any failure.
5. Fix one problem or change one detail in the practice information, then repeat the affected check. Keep both attempts and explain the change.
6. Record what you did and where you saved the work in your workbook and explain the decision in your own words. If your account cannot do a step, label your work as a practice simulation and note what you still need to try in the product.

### Check your work

Tests expose the starter’s defects and preserve the strict earlier-than rule.

### What to keep

Issue brief and meaningful test plan.

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

Issue brief and meaningful test plan.

### Check your result

Tests expose the starter’s defects and preserve the strict earlier-than rule.

Use the workbook to link files or records. Explain whether the evidence comes from a live demonstration or a simulation. The next module builds on this work, so keep the current version and any earlier attempt.

---

# 2.1 Learn the basics
Suggested minutes: 10

## Set up a separate place to work on the code

Record the practice repository’s initial state and tool boundaries. The task needs a supported Node runtime and local files; it does not need production secrets, deployment tools or unrelated repository access.

![Check your account access; Find where the task runs; Try a simple task](/courses/always-on-agents/responsibility.svg)

### Check that your agent can reach the files and tools it needs

Before starting, check that your account includes the features you need. You also need to know where the agent runs and which files or apps it can use. An agent working on a computer in the cloud cannot automatically read a folder on your laptop.

Write down the product, account plan, region and date of your check. Note where the task runs and which connection you tried. Keep two things separate: what the provider says the product supports, and what you have actually seen work in your account. A demonstration on a website does not prove that your account has the same access.

Use a separate practice folder and the fictional records supplied with the course. Ask the agent to read a sample and prepare a draft. Open the result yourself to check that it exists in the right place. An explanation of what the agent plans to do is not the same as completed work.

---

# 2.2 Plan your own task
Suggested minutes: 10

## Planning your task

Open the official setup guide linked in the course and check the requirements for your account. Put the practice files somewhere the agent can reach, then ask it to prepare a simple draft. Record where it ran, which file it used and where it saved the result.

If you cannot access the product, work through the example yourself and label it as a practice simulation. This helps you learn how to plan and check the task. It does not show that you can run that particular product, so record which live steps you still need to try.

### In this practice example

Record the practice repository’s initial state and tool boundaries. The task needs a supported Node runtime and local files; it does not need production secrets, deployment tools or unrelated repository access.

Before continuing, locate the relevant records in the practice files. Explain which rule applies and write what you expect the next step to produce. Compare that expectation with the worked example rather than relying on the output's tone.

---

# 2.3 Look at an example
Suggested minutes: 8

## Worked example

You will delegate and review a small date-classification fix in a disposable repository. The starter deliberately contains several bugs that one passing test does not detect.

A clean disposable checkout allows the diff to show exactly what the agent changed without disturbing another developer’s work.

### What makes this result correct

The evidence identifies the starting state and a separate workspace where someone else can repeat your checks.

### Try a different example

Choose one source value or task condition and change it in a copy of the practice files. Write how the expected result should change and which permission must remain the same. Preserve the original so that you can explain the difference. Use the answer guide after attempting the exercise.

---

# 2.4 Make a decision and explain it
Suggested minutes: 7

## Your decision

The agent asks to use a production checkout containing unrelated changes for the small lab. Which environment is appropriate?

Choose the answer that follows the facts and instructions in this example. These are practice decisions; completing them does not award a certificate.

1. Run the task against the production checkout to make the results realistic.
2. Delete unrelated changes so the agent has a cleaner starting point.
3. Use a disposable checkout and record the initial state and credential boundaries.

---

# 2.5 Try it yourself
Suggested minutes: 30

## Try the task yourself

Record runtime version, initial files and allowed commands. Explain a recovery method for this disposable workspace and keep credentials out of the task.

### Work through the exercise

1. Download the practice files and workbook. Use a copy so that original records remain available. Record the course version and whether you are using a live account or a desk simulation.
2. Find the records and instructions you need for this module. Write the expected result before the run or desk exercise.
3. Try the task above using your practice files and the tools you have permission to use. Keep the records, result and settings someone would need to repeat it. Do not send messages, publish, buy or change live business records during this exercise.
4. Open the result or app record and check it yourself. Compare the actual result with the expected checks below and record any failure.
5. Fix one problem or change one detail in the practice information, then repeat the affected check. Keep both attempts and explain the change.
6. Record what you did and where you saved the work in your workbook and explain the decision in your own words. If your account cannot do a step, label your work as a practice simulation and note what you still need to try in the product.

### Check your work

The evidence identifies the starting state and a separate workspace where someone else can repeat your checks.

### What to keep

Workspace, secret boundaries and reversal and recovery check.

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

Workspace, secret boundaries and reversal and recovery check.

### Check your result

The evidence identifies the starting state and a separate workspace where someone else can repeat your checks.

Use the workbook to link files or records. Explain whether the evidence comes from a live demonstration or a simulation. The next module builds on this work, so keep the current version and any earlier attempt.

---

# 3.1 Learn the basics
Suggested minutes: 10

## Ask your agent to make a change you can review

Delegate the behavioural fix while preserving the tests as an independent standard. Ask for an explanation of rule order, because completion status and missing dates can both apply to one record.

![Show the problem; Review the change; Run the checks yourself](/courses/always-on-agents/verification.svg)

### Ask your agent for a code change you can review

Describe the bug, how to reproduce it and what the code should do instead. Say which files or part of the application are in scope. “Improve this repository” leaves the agent guessing which changes are needed.

Use a separate practice copy of the code so your experiment does not affect someone else’s changes. Record the starting state. Give the agent only the tools and access needed for the task, and keep production passwords and keys out of the exercise. Keep a list of changes and the commands used to test them.

Passing tests only shows that the checks in those tests passed. Inspect changed assertions and any added packages. A test can be made green by accepting the wrong result. Run the original problem yourself and check a nearby case that should still work.

---

# 3.2 Plan your own task
Suggested minutes: 10

## Planning your task

Create a failing example before asking for the fix. Ask the agent for the code change, an explanation and test results. Check that the test fails on the original bug, then run the tests yourself on the fix.

If you reject the change, keep its records and return the practice copy to a known state using a checked recovery method. Do not discard unrelated work to make the exercise easier.

### In this practice example

Delegate the behavioural fix while preserving the tests as an independent standard. Ask for an explanation of rule order, because completion status and missing dates can both apply to one record.

Before continuing, locate the relevant records in the practice files. Explain which rule applies and write what you expect the next step to produce. Compare that expectation with the worked example rather than relying on the output's tone.

---

# 3.3 Look at an example
Suggested minutes: 8

## Worked example

You will delegate and review a small date-classification fix in a disposable repository. The starter deliberately contains several bugs that one passing test does not detect.

A completed project without a date should return complete. Checking completion first preserves that priority before considering missing-date or overdue rules.

### What makes this result correct

The change is limited to the required behaviour and explains the priority of the rules.

### Try a different example

Choose one source value or task condition and change it in a copy of the practice files. Write how the expected result should change and which permission must remain the same. Preserve the original so that you can explain the difference. Use the answer guide after attempting the exercise.

---

# 3.4 Make a decision and explain it
Suggested minutes: 7

## Your decision

The agent changes a complete-project assertion to overdue to make the suite green. What response preserves the requirement?

Choose the answer that follows the facts and instructions in this example. These are practice decisions; completing them does not award a certificate.

1. Add a dependency before checking whether the small fix needs one.
2. Restore the behavioural requirement and use a test that fails on the original bug.
3. Accept the altered expected value because the test now passes.

---

# 3.5 Try it yourself
Suggested minutes: 30

## Try the task yourself

Give the agent the issue brief and permitted scope. Inspect its diff and handover, then run your tests independently.

### Work through the exercise

1. Download the practice files and workbook. Use a copy so that original records remain available. Record the course version and whether you are using a live account or a desk simulation.
2. Find the records and instructions you need for this module. Write the expected result before the run or desk exercise.
3. Try the task above using your practice files and the tools you have permission to use. Keep the records, result and settings someone would need to repeat it. Do not send messages, publish, buy or change live business records during this exercise.
4. Open the result or app record and check it yourself. Compare the actual result with the expected checks below and record any failure.
5. Fix one problem or change one detail in the practice information, then repeat the affected check. Keep both attempts and explain the change.
6. Record what you did and where you saved the work in your workbook and explain the decision in your own words. If your account cannot do a step, label your work as a practice simulation and note what you still need to try in the product.

### Check your work

The change is limited to the required behaviour and explains the priority of the rules.

### What to keep

Bounded change and reasoning record.

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

Bounded change and reasoning record.

### Check your result

The change is limited to the required behaviour and explains the priority of the rules.

Use the workbook to link files or records. Explain whether the evidence comes from a live demonstration or a simulation. The next module builds on this work, so keep the current version and any earlier attempt.

---

# 4.1 Learn the basics
Suggested minutes: 10

## Check the code, tests and any added packages

Review the diff, test meaning and dependencies together. A passing command can hide altered expectations or unnecessary package changes, so check the original bug and a neighbouring case yourself.

![Write the expected result; Try different examples; Compare with what happened](/courses/always-on-agents/verification.svg)

### Check the results with examples you understand

Before asking the agent to work, write down what a correct result would be. This gives you something to compare with its answer. Include an ordinary example, one with missing information, one at the edge of a rule and one where something goes wrong.

Check what the result includes and what it leaves out. A report can contain only true statements while missing the overdue project you needed to see. Compare it with the whole set of records. For research, check important claims against the original sources rather than only reading the summary.

Keep a test log: a table of the input, expected result, actual result and your check. If something fails, record it, make a specific correction and repeat the affected checks. Several correct answers do not cancel out a serious problem, such as sending a message without permission.

---

# 4.2 Plan your own task
Suggested minutes: 10

## Planning your task

Prepare at least six different examples. Keep one extra example aside until after you improve the instructions, so you can check whether the change also works on something new.

Try the exercise before opening the answer guide. If your result differs, go back to the records and explain why. Your aim is to understand the decision, rather than remember which answer to select.

### In this practice example

Review the diff, test meaning and dependencies together. A passing command can hide altered expectations or unnecessary package changes, so check the original bug and a neighbouring case yourself.

Before continuing, locate the relevant records in the practice files. Explain which rule applies and write what you expect the next step to produce. Compare that expectation with the worked example rather than relying on the output's tone.

---

# 4.3 Look at an example
Suggested minutes: 8

## Worked example

You will delegate and review a small date-classification fix in a disposable repository. The starter deliberately contains several bugs that one passing test does not detect.

The due-today case must remain on-track. A test that accepts overdue would reproduce the starter’s boundary bug rather than detect it.

### What makes this result correct

The tests fail for the original defects and pass for the small, focused fix without weakened assertions.

### Try a different example

Choose one source value or task condition and change it in a copy of the practice files. Write how the expected result should change and which permission must remain the same. Preserve the original so that you can explain the difference. Use the answer guide after attempting the exercise.

---

# 4.4 Make a decision and explain it
Suggested minutes: 7

## Your decision

All checks pass, but the diff changes test expectations and adds a package. What should the reviewer establish?

Choose the answer that follows the facts and instructions in this example. These are practice decisions; completing them does not award a certificate.

1. Accept the altered expected value because the test now passes.
2. Add a dependency before checking whether the small fix needs one.
3. Restore the behavioural requirement and use a test that fails on the original bug.

---

# 4.5 Try it yourself
Suggested minutes: 30

## Try the task yourself

Review every changed line and test assertion. Run the suite on the original and revised implementations, and record which failures demonstrate the fix.

### Work through the exercise

1. Download the practice files and workbook. Use a copy so that original records remain available. Record the course version and whether you are using a live account or a desk simulation.
2. Find the records and instructions you need for this module. Write the expected result before the run or desk exercise.
3. Try the task above using your practice files and the tools you have permission to use. Keep the records, result and settings someone would need to repeat it. Do not send messages, publish, buy or change live business records during this exercise.
4. Open the result or app record and check it yourself. Compare the actual result with the expected checks below and record any failure.
5. Fix one problem or change one detail in the practice information, then repeat the affected check. Keep both attempts and explain the change.
6. Record what you did and where you saved the work in your workbook and explain the decision in your own words. If your account cannot do a step, label your work as a practice simulation and note what you still need to try in the product.

### Check your work

The tests fail for the original defects and pass for the small, focused fix without weakened assertions.

### What to keep

Diff review and verified test results.

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

Diff review and verified test results.

### Check your result

The tests fail for the original defects and pass for the small, focused fix without weakened assertions.

Use the workbook to link files or records. Explain whether the evidence comes from a live demonstration or a simulation. The next module builds on this work, so keep the current version and any earlier attempt.

---

# 5.1 Learn the basics
Suggested minutes: 10

## Fix failed checks and avoid repeating the same change

Recurring maintenance needs task identity and a record of existing work. Two identical issue events should not create competing fixes or obscure which branch contains the accepted change.

![Pause and check what happened; Look for completed work; Continue only the unfinished steps](/courses/always-on-agents/recovery.svg)

### Fix a failed task without doing the same work twice

A failed task may still have completed some work. For example, the agent might save a report before losing its connection. Starting everything again could create two reports or send the same reminder twice. First check the actual files or app records to see what happened.

Give each task a reference and keep a record of completed steps. Some services can recognise a repeated request and avoid repeating its effect. If your service supports this, test it. Otherwise check for existing work yourself before trying again.

Write a simple problem-solving plan: who pauses the task, which records to keep, how to check completed work and when it is safe to continue. Set a limit on retries and explain when to ask for help. Keep the failed result so you can understand the problem and check the correction.

---

# 5.2 Plan your own task
Suggested minutes: 10

## Planning your task

Stop the practice task after it has produced one result, then work through your recovery plan. Check whether that result exists before repeating the task. Next remove a source file and explain which steps must wait.

Try the retry limit and show that the task stops when it should. Keep the final result, the failed attempt and your explanation of why the recovery did not create duplicate work.

### In this practice example

Recurring maintenance needs task identity and a record of existing work. Two identical issue events should not create competing fixes or obscure which branch contains the accepted change.

Before continuing, locate the relevant records in the practice files. Explain which rule applies and write what you expect the next step to produce. Compare that expectation with the worked example rather than relying on the output's tone.

---

# 5.3 Look at an example
Suggested minutes: 8

## Worked example

You will delegate and review a small date-classification fix in a disposable repository. The starter deliberately contains several bugs that one passing test does not detect.

The same issue ID can be checked against a pending review before another task begins. A failed check should return the existing change for correction.

### What makes this result correct

One traceable change per issue, preserved failure evidence and independently rerun checks.

### Try a different example

Choose one source value or task condition and change it in a copy of the practice files. Write how the expected result should change and which permission must remain the same. Preserve the original so that you can explain the difference. Use the answer guide after attempting the exercise.

---

# 5.4 Make a decision and explain it
Suggested minutes: 7

## Your decision

Two task events request the same classification fix while a review already exists. What should prevent redundant work?

Choose the answer that follows the facts and instructions in this example. These are practice decisions; completing them does not award a certificate.

1. Suppress every similar-looking future item.
2. Use the existing item ID or run key to check whether the intended output already exists.
3. Create a new output because each trigger delivery deserves its own response.

---

# 5.5 Try it yourself
Suggested minutes: 30

## Try the task yourself

Apply the duplicate-task and altered-test failure cards. Preserve the rejected diff, correct it and demonstrate the final state of the practice repository.

### Work through the exercise

1. Download the practice files and workbook. Use a copy so that original records remain available. Record the course version and whether you are using a live account or a desk simulation.
2. Find the records and instructions you need for this module. Write the expected result before the run or desk exercise.
3. Try the task above using your practice files and the tools you have permission to use. Keep the records, result and settings someone would need to repeat it. Do not send messages, publish, buy or change live business records during this exercise.
4. Open the result or app record and check it yourself. Compare the actual result with the expected checks below and record any failure.
5. Fix one problem or change one detail in the practice information, then repeat the affected check. Keep both attempts and explain the change.
6. Record what you did and where you saved the work in your workbook and explain the decision in your own words. If your account cannot do a step, label your work as a practice simulation and note what you still need to try in the product.

### Check your work

One traceable change per issue, preserved failure evidence and independently rerun checks.

### What to keep

Failure recovery and duplicate change prevention.

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

Failure recovery and duplicate change prevention.

### Check your result

One traceable change per issue, preserved failure evidence and independently rerun checks.

Use the workbook to link files or records. Explain whether the evidence comes from a live demonstration or a simulation. The next module builds on this work, so keep the current version and any earlier attempt.

---

# 6.1 Learn the basics
Suggested minutes: 10

## Explain your change and show that it works

The final project is a reviewable local change with a clear explanation, test evidence and recovery plan. It ends before production merge or deployment, which require their own authority and release checks.

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

The final project is a reviewable local change with a clear explanation, test evidence and recovery plan. It ends before production merge or deployment, which require their own authority and release checks.

Before continuing, locate the relevant records in the practice files. Explain which rule applies and write what you expect the next step to produce. Compare that expectation with the worked example rather than relying on the output's tone.

---

# 6.3 Look at an example
Suggested minutes: 8

## Worked example

You will delegate and review a small date-classification fix in a disposable repository. The starter deliberately contains several bugs that one passing test does not detect.

The unseen completed-without-date case tests whether you understand the rule priority rather than only the examples already supplied.

### What makes this result correct

Another developer can reproduce the bug and check the fix from the submitted pack.

### Try a different example

Choose one source value or task condition and change it in a copy of the practice files. Write how the expected result should change and which permission must remain the same. Preserve the original so that you can explain the difference. Use the answer guide after attempting the exercise.

---

# 6.4 Make a decision and explain it
Suggested minutes: 7

## Your decision

The final diff looks correct, but the learner cannot explain why completion is checked first. What further assessment evidence is needed?

Choose the answer that follows the facts and instructions in this example. These are practice decisions; completing them does not award a certificate.

1. Award a certificate because every practice activity is marked complete.
2. Use high scores in other areas to make up for the failed permission check.
3. Have a reviewer check the work and provide anything still missing.

---

# 6.5 Complete your final practical project
Suggested minutes: 45

## Your final practical project

Complete the unseen case and prepare a local pull-request-style handover containing scope, diff, meaningful tests, limitations and recovery evidence.

### Work through the exercise

1. Download the practice files and workbook. Use a copy so that original records remain available. Record the course version and whether you are using a live account or a desk simulation.
2. Find the records and instructions you need for this module. Write the expected result before the run or desk exercise.
3. Try the task above using your practice files and the tools you have permission to use. Keep the records, result and settings someone would need to repeat it. Do not send messages, publish, buy or change live business records during this exercise.
4. Open the result or app record and check it yourself. Compare the actual result with the expected checks below and record any failure.
5. Fix one problem or change one detail in the practice information, then repeat the affected check. Keep both attempts and explain the change.
6. Record what you did and where you saved the work in your workbook and explain the decision in your own words. If your account cannot do a step, label your work as a practice simulation and note what you still need to try in the product.

### Check your work

Another developer can reproduce the bug and check the fix from the submitted pack.

### What to keep

Final project pull request, handover and individual follow-up.

### A new example to try

Add a completed project without a due date. Explain which rule takes priority and demonstrate it with a test that fails on the original implementation.

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

Final project pull request, handover and individual follow-up.

### Check your result

Another developer can reproduce the bug and check the fix from the submitted pack.

Use the workbook to link files or records. Explain whether the evidence comes from a live demonstration or a simulation. The next module builds on this work, so keep the current version and any earlier attempt.

# Reference and resource pack

# Agents for Developers
Version: 2026.10.2-ai-assessed

You will delegate and review a small date-classification fix in a disposable repository. The starter deliberately contains several bugs that one passing test does not detect.

## Disposable developer lab
Use a new practice repository with no production credentials. Create a file status.mjs and a test file status.test.mjs from the starter code below. Run with a supported Node.js installation using node --test status.test.mjs. The exercise tests date-only records at a fixed cut-off, not arbitrary date parsing.

```js
// status.mjs: deliberately flawed starter
export function classify(project, today = '2026-10-01') {
  if (!project.due) return 'on-track';
  if (project.due <= today) return 'overdue';
  return 'on-track';
}
```

```js
// status.test.mjs: starter test, extend it before the fix
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { classify } from './status.mjs';
test('open project before cut-off is overdue', () => {
  assert.equal(classify({ status: 'open', due: '2026-09-25' }), 'overdue');
});
```

Required behaviour: complete projects return complete regardless of due date; incomplete projects with no due date return missing-date; an incomplete project is overdue only when its due date is earlier than today; due-today and future projects return on-track. Do not add dependencies or change unrelated files.

Failure card: the agent changes the expected value of the complete-project test to overdue to make the tests pass. Reject that change and restore the requirement.

Maintenance card: two identical tasks request the same fix. Use an issue ID and check existing branches or reviews before starting a second change. The exercise ends with a reviewed local diff, not a production deployment.

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

# Developer lab walkthrough
Create the starter files exactly as supplied in a new disposable repository. Run the starter test and record the result. Add tests before implementing the fix: a completed old-due project, an incomplete missing-date project, due-today work, future work and completed work without a date.

```text
Fix classify in this disposable practice repository. Completion takes priority and returns complete. An incomplete project without a date returns missing-date. Incomplete work is overdue only when its date is earlier than today; due-today and future work are on-track. Preserve the acceptance tests. Do not add dependencies, change unrelated files or deploy. Return a reviewable diff, explain rule order and show the verification commands and results.
```

Inspect the diff before running the revised tests independently. Confirm that the meaningful tests fail on the flawed starter and pass on the correction. Reject an altered expectation that merely makes the starter appear correct.

Give the same issue ID twice and document how existing work prevents a second competing task. Preserve a rejected attempt and show the recovered final state. End with a local review handover and the unseen completed-without-date case. Production merge and deployment are outside the lab.

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

