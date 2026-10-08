# Experrt reviewer calibration and decision record
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
For the AI assessment service, calibrate missing evidence, unsafe behaviour, conflicting instructions and a complete example against this guide. Record model, policy, scores and limits. Live platform demonstrations and learner pilots must be recorded separately; automated checks do not establish those results.

# Course-specific evidence checks

## 1. Describe the code change and how you will test it

Tests expose the starter’s defects and preserve the strict earlier-than rule.

Only the original overdue test passes. What evidence should be added before accepting a fix?

Best response: Write expected outcomes and check normal, incomplete, boundary and failure cases.
A varied set exposes distinct ways the workflow can fail. Keep expected results independent of the agent’s explanation.

Alternative: Accept a successful demonstration as evidence that every case is covered.
One example does not test missing data, boundaries or interruption. Add cases with known outcomes.

Alternative: Change expected results to match the agent’s latest output.
This removes the independent standard. Investigate the disagreement and change requirements only when the owner explicitly decides to do so.

## 2. Set up a separate place to work on the code

The evidence identifies the starting state and a separate workspace where someone else can repeat your checks.

The agent asks to use a production checkout containing unrelated changes for the small lab. Which environment is appropriate?

Alternative: Run the task against the production checkout to make the results realistic.
The practice task does not require production state. A disposable environment can demonstrate behaviour without affecting live work.

Alternative: Delete unrelated changes so the agent has a cleaner starting point.
Those changes may belong to someone else. Preserve them and choose a separate practice workspace.

Best response: Use a disposable checkout and record the initial state and credential boundaries.
Isolation makes changes reviewable and recovery possible without disturbing unrelated work. Keep production secrets out of the lab.

## 3. Ask your agent to make a change you can review

The change is limited to the required behaviour and explains the priority of the rules.

The agent changes a complete-project assertion to overdue to make the suite green. What response preserves the requirement?

Alternative: Add a dependency before checking whether the small fix needs one.
A dependency changes cost and maintenance scope. Establish the cause and prefer a justified small, focused fix.

Best response: Restore the behavioural requirement and use a test that fails on the original bug.
A meaningful test detects the problem independently. Inspect assertions and implementation rather than accepting a green result alone.

Alternative: Accept the altered expected value because the test now passes.
The change weakens the standard instead of fixing behaviour. Compare it with the issue’s checks for a correct result.

## 4. Check the code, tests and any added packages

The tests fail for the original defects and pass for the small, focused fix without weakened assertions.

All checks pass, but the diff changes test expectations and adds a package. What should the reviewer establish?

Alternative: Accept the altered expected value because the test now passes.
The change weakens the standard instead of fixing behaviour. Compare it with the issue’s checks for a correct result.

Alternative: Add a dependency before checking whether the small fix needs one.
A dependency changes cost and maintenance scope. Establish the cause and prefer a justified small, focused fix.

Best response: Restore the behavioural requirement and use a test that fails on the original bug.
A meaningful test detects the problem independently. Inspect assertions and implementation rather than accepting a green result alone.

## 5. Fix failed checks and avoid repeating the same change

One traceable change per issue, preserved failure evidence and independently rerun checks.

Two task events request the same classification fix while a review already exists. What should prevent redundant work?

Alternative: Suppress every similar-looking future item.
Similar items can be legitimate new work. Use stable identifiers and reporting periods rather than vague resemblance.

Best response: Use the existing item ID or run key to check whether the intended output already exists.
Matching the intended operation to its recorded effect prevents a repeated event from becoming new work.

Alternative: Create a new output because each trigger delivery deserves its own response.
Delivery can be repeated for the same intended event. Distinguish deliveries from unique business work.

## 6. Explain your change and show that it works

Another developer can reproduce the bug and check the fix from the submitted pack.

The final diff looks correct, but the learner cannot explain why completion is checked first. What further assessment evidence is needed?

Alternative: Award a certificate because every practice activity is marked complete.
Practice progress shows which activities you have worked through. A certificate needs a pass in the practical assessment.

Alternative: Use high scores in other areas to make up for the failed permission check.
You need at least 3 out of 4 in every area. If the permission check is below that score, improve that part and have it checked again.

Best response: Have a reviewer check the work and provide anything still missing.
The reviewer needs to check your skills in every required area. Finishing practice activities and producing a good-looking result are not enough to show that you have passed.

# Individual changed-case challenge
Add a completed project without a due date. Explain which rule takes priority and demonstrate it with a test that fails on the original implementation.