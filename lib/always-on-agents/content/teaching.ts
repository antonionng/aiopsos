export type TeachingChapter = {
  title: string;
  explanation: string;
  method: string;
  image: string;
  visual: [string, string, string];
};
const art = "/courses/always-on-agents/";
export const teaching: Record<string, TeachingChapter> = {
  responsibility: {
    title: "Start with a task you know well",
    image: art + "responsibility.svg",
    visual: [
      "Choose a regular task",
      "Check how long it takes",
      "Try it on a small example",
    ],
    explanation: `Think about a task you do every day or week, such as checking project deadlines, preparing a report or sorting new requests. An always-on AI agent can keep working on a task between your conversations with it. You need to tell it what to do, give it the right information and check the result. Some tools can work while you are away; others depend on particular apps or computers being available.

Start with something small that you understand well. A weekly project report is a useful example: you know where the project records are, when you need the report and what it should include. A request such as “manage my business” leaves too many decisions unexplained. Choose a task where you can spot a mistake and correct it before anyone relies on the work.

Before trying an agent, write down how you do the task today. How long does it take to prepare the work, check it and fix mistakes? You will compare those figures with the agent-assisted task later. A quickly written report only saves time if it is also quick enough to check.`,
    method: `Write down three tasks you do regularly. For each one, explain what information you use, who needs the result and how you know the work is correct. Choose one task where the agent can prepare a draft for you to check. Keep any decisions about sending messages, spending money or changing records separate.

Try the task on a small example before using it for everyday work. Compare at least three attempts with your usual way of doing it. Include your time checking and correcting the result, and use the same standard of quality in both comparisons.`,
  },
  brief: {
    title: "Write instructions your agent can follow",
    image: art + "brief.svg",
    visual: [
      "Choose the information",
      "Describe the result you want",
      "Explain when to stop",
    ],
    explanation: `Imagine explaining the task to someone helping you for the first time. They need to know what you want, which information to use and what a good result looks like. Your agent needs the same guidance. Write it down so the task does not depend on details scattered across earlier conversations.

Include who checks the work, when it should run, where the result should go and which actions need your approval. For a weekly report, name the project tracker it should use and explain how to identify an overdue project. Say what to do if a deadline is missing, rather than leaving the agent to guess.

Give an example of a correct result and an example that needs fixing. “Make the report excellent” is hard to check. “Include each project’s ID and list missing deadlines separately” tells the agent what to produce and gives you a clear way to check it.`,
    method: `Use the workbook to write your instructions. Then read them as if you were taking over the task: could you find the information, prepare the result and decide whether you need to ask for help? Try one ordinary example and one with missing information. Write down what should happen before asking the agent to do the work.

Keep a dated copy whenever you change the instructions. Explain what changed and repeat the checks affected by that change. If a result is wrong, describe the specific mistake and the rule it should follow next time.`,
  },
  environment: {
    title: "Check that your agent can reach the files and tools it needs",
    image: art + "responsibility.svg",
    visual: [
      "Check your account access",
      "Find where the task runs",
      "Try a simple task",
    ],
    explanation: `Before starting, check that your account includes the features you need. You also need to know where the agent runs and which files or apps it can use. An agent working on a computer in the cloud cannot automatically read a folder on your laptop.

Write down the product, account plan, region and date of your check. Note where the task runs and which connection you tried. Keep two things separate: what the provider says the product supports, and what you have actually seen work in your account. A demonstration on a website does not prove that your account has the same access.

Use a separate practice folder and the fictional records supplied with the course. Ask the agent to read a sample and prepare a draft. Open the result yourself to check that it exists in the right place. An explanation of what the agent plans to do is not the same as completed work.`,
    method: `Open the official setup guide linked in the course and check the requirements for your account. Put the practice files somewhere the agent can reach, then ask it to prepare a simple draft. Record where it ran, which file it used and where it saved the result.

If you cannot access the product, work through the example yourself and label it as a practice simulation. This helps you learn how to plan and check the task. It does not show that you can run that particular product, so record which live steps you still need to try.`,
  },
  authority: {
    title: "Choose what your agent can see and do",
    image: art + "authority.svg",
    visual: [
      "Read the right information",
      "Prepare work for review",
      "Ask before taking action",
    ],
    explanation: `Being able to do something does not mean the agent has permission to do it. Reading a project tracker, writing a reminder and sending that reminder to a customer are separate actions. Decide which ones you want it to take before connecting your apps.

Make a table with three groups: actions the agent may take, actions that need approval and actions it must not take. Name the person who can approve each action. Where an app has access settings, use them to support these rules. Written instructions alone may not stop a tool from doing something it can technically do.

A file can contain a request that conflicts with your instructions. For example, a project note might ask the agent to send the report to a new address. The agent may read that note, but the note cannot give it permission to share the report. It should keep your rules in place and explain the conflict.`,
    method: `List the actions involved in your task, such as reading, writing, changing records, sending messages and deleting files. Give the agent only the access it needs. Using fictional information, try one allowed action, one that needs approval and one that is blocked.

Check what actually happened in the app or output folder. Do not rely only on the agent saying an action was blocked. Keep your instructions, access settings and check results together, with passwords and private account details removed.`,
  },
  context: {
    title: "Give your agent the information it needs",
    image: art + "brief.svg",
    visual: [
      "Choose useful information",
      "Check dates and instructions",
      "Correct what it remembers",
    ],
    explanation: `Your agent may use files, earlier conversations, saved preferences and connected apps to understand a task. Give it the information it needs for this job. Extra information can cause confusion if it is old, unrelated or private.

Make a list of the information you supply. For each item, explain what it is for, who keeps it up to date and when it was last checked. Say which record to follow if two sources disagree. An old preference for morning appointments should not override a fixed meeting in the current calendar.

When you correct something the agent remembers, check its next result. An acknowledgement does not prove that every saved copy has changed. Use the product’s memory controls where they are available, and keep important current instructions in writing so someone else can follow the task.`,
    method: `Start with only the information needed for the practice task. Add one old note that conflicts with the current instructions, then tell the agent clearly which instruction to follow. Repeat the task and compare the results.

Record what you corrected and how you checked the change. If the product does not let you inspect or remove saved information, explain that limitation. Do not claim information has been deleted unless you can check it.`,
  },
  sources: {
    title: "Check where each fact comes from",
    image: art + "verification.svg",
    visual: [
      "Find the original record",
      "Check what it says and when",
      "Separate facts from guesses",
    ],
    explanation: `For each important statement in a report, you should be able to show the record that supports it. Keep a list of the files or websites you use, what each one tells you and when it was last updated. An article published today may describe something that happened months ago.

Check the original information rather than accepting a link as proof. Does the record support the exact number, date and conclusion in the draft? Two articles repeating the same announcement do not provide two separate confirmations.

Keep missing information visible. A missing number is not the same as zero, and an unavailable file is not proof that nothing changed. If you draw a conclusion from several facts, explain your reasoning. Make it clear when you are describing something that happened, something expected to happen or something still uncertain.`,
    method: `Make a table of the important statements in your draft. Beside each one, record where you found the supporting information and what you checked. Recalculate totals and compare the draft with all the relevant records, including anything it left out.

Try an old record and a repeated article. Explain whether each one still helps answer the question, what remains unclear and which additional information would resolve it.`,
  },
  schedule: {
    title: "Choose when your agent should do the task",
    image: art + "brief.svg",
    visual: [
      "Choose a time or event",
      "Check the information is ready",
      "Keep a record of each attempt",
    ],
    explanation: `Decide what should start the task. It might be a time each week, a new request arriving or a regular check for changes. This starting point is often called a trigger. Setting a time does not guarantee the information is ready or that the previous attempt has finished.

Write down the time zone, when the information needs to be available and what should happen if the task is missed. If a report uses old records, it should say so. Repeated reminders or requests can also start the same task twice, so the agent needs a way to recognise work it has already done.

Give each report or request a unique reference, such as “weekly-brief:2026-10-05”. Keep the input version, start time, result and output location beside it. That reference helps you check what happened and avoid creating another copy by accident.`,
    method: `Try the task manually before setting up a regular schedule. Check the first result, then use the scheduling controls available in your product. Try starting the same task again and check whether it creates a duplicate.

Also test a missing file and a missed scheduled task. Decide whether to try again, wait for fresh information or ask the person responsible. Write down how to pause the schedule and who is responsible for doing that.`,
  },
  verification: {
    title: "Check the results with examples you understand",
    image: art + "verification.svg",
    visual: [
      "Write the expected result",
      "Try different examples",
      "Compare with what happened",
    ],
    explanation: `Before asking the agent to work, write down what a correct result would be. This gives you something to compare with its answer. Include an ordinary example, one with missing information, one at the edge of a rule and one where something goes wrong.

Check what the result includes and what it leaves out. A report can contain only true statements while missing the overdue project you needed to see. Compare it with the whole set of records. For research, check important claims against the original sources rather than only reading the summary.

Keep a test log: a table of the input, expected result, actual result and your check. If something fails, record it, make a specific correction and repeat the affected checks. Several correct answers do not cancel out a serious problem, such as sending a message without permission.`,
    method: `Prepare at least six different examples. Keep one extra example aside until after you improve the instructions, so you can check whether the change also works on something new.

Try the exercise before opening the answer guide. If your result differs, go back to the records and explain why. Your aim is to understand the decision, rather than remember which answer to select.`,
  },
  recovery: {
    title: "Fix a failed task without doing the same work twice",
    image: art + "recovery.svg",
    visual: [
      "Pause and check what happened",
      "Look for completed work",
      "Continue only the unfinished steps",
    ],
    explanation: `A failed task may still have completed some work. For example, the agent might save a report before losing its connection. Starting everything again could create two reports or send the same reminder twice. First check the actual files or app records to see what happened.

Give each task a reference and keep a record of completed steps. Some services can recognise a repeated request and avoid repeating its effect. If your service supports this, test it. Otherwise check for existing work yourself before trying again.

Write a simple problem-solving plan: who pauses the task, which records to keep, how to check completed work and when it is safe to continue. Set a limit on retries and explain when to ask for help. Keep the failed result so you can understand the problem and check the correction.`,
    method: `Stop the practice task after it has produced one result, then work through your recovery plan. Check whether that result exists before repeating the task. Next remove a source file and explain which steps must wait.

Try the retry limit and show that the task stops when it should. Keep the final result, the failed attempt and your explanation of why the recovery did not create duplicate work.`,
  },
  value: {
    title: "Check whether the agent saves time and is worth the cost",
    image: art + "capstone.svg",
    visual: [
      "Count your work and checking time",
      "Include running costs",
      "Compare results of the same quality",
    ],
    explanation: `Compare the agent-assisted task with how you did it before. Include time spent preparing, checking, correcting and maintaining the work, as well as subscriptions or usage charges. Saved time can be useful without reducing an actual bill, so explain the difference.

Here is a fictional example. A report used to take 90 minutes. With an agent, preparation takes 20 minutes and checking takes 25 minutes, saving 45 minutes. At an assumed £20 per hour, that time is worth £15. After £4 in weekly running costs, the difference is £11 before the initial setup cost. These are practice figures, not a promise of savings.

Check quality as well as speed. Count missed items, unsupported statements and times someone needed to intervene. Decide how much you are willing to spend and when you would change or stop the trial.`,
    method: `Use the cost worksheet to compare three attempts at the same task. Keep one-off setup time separate from regular work. Calculate what happens if you run the task more often or spend twice as long checking it.

Recommend continuing, improving or stopping the task based on the results. Explain what would change your recommendation. If the trial was short, say so rather than presenting it as proof of a full year’s savings.`,
  },
  handover: {
    title: "Show your work and explain how someone else can run it",
    image: art + "capstone.svg",
    visual: [
      "Collect your work and checks",
      "Explain your decisions",
      "Try a new example",
    ],
    explanation: `Your final project shows the task working and explains how you checked it. Keep the instructions, results, test log and record of how you fixed a problem. These are your assessment evidence: the work a reviewer can inspect to understand what you did.

Include where the information comes from, what the agent is allowed to do, when it runs, the costs and any known problems. Remove passwords and unrelated private information. Someone taking over should be able to find the result, check it and pause the task.

A reviewer will also ask you to explain your choices or try a changed example. This checks that you understand the method, rather than only the prepared result. Completing the practice activities does not by itself earn a certificate.`,
    method: `Ask someone to follow your instructions without your help. Notice where they get stuck and make those steps clearer. Try the changed example and explain whether the agent should continue, stop or ask for help.

To pass the practical assessment, you need at least 3 out of 4 in each skill area. If an area needs improvement, the reviewer should explain what to fix and which work to provide. Keep your earlier attempt and the revised work together.`,
  },
  process: {
    title: "Describe how the task works before asking an agent to help",
    image: art + "responsibility.svg",
    visual: [
      "List the steps and decisions",
      "Decide who is responsible",
      "Plan what happens when there is a problem",
    ],
    explanation: `Write down how the task moves from a request to a checked result. Include the decisions people make, the records they use and the problems they deal with. If the task is unclear today, an agent may repeat the same confusion more often.

Separate simple rules from decisions that need a person. Checking whether a request has a contact address is a rule. Deciding whether someone should receive an exception may need a manager. The agent can prepare the information without making that decision itself.

Give each request a clear status, such as received, checked, awaiting approval or completed. The status should describe what actually happened. Keep the same request ID through the steps so you can follow the work and spot repeated requests.`,
    method: `Draw the normal steps and one example where something goes wrong. Beside each step, name who acts, what information they need, what they may do and what record they leave.

Try a valid request, an incomplete request and a repeated request. Check the final record in the app and compare it with what the agent told the person responsible.`,
  },
  editorial: {
    title: "Prepare a draft that someone can check and approve",
    image: art + "authority.svg",
    visual: [
      "Use facts you can support",
      "Check wording, images and accessibility",
      "Approve the exact draft",
    ],
    explanation: `Useful content needs to help its reader, get the facts right and use a suitable tone. Images also need a clear purpose and permission for use. A well-written draft does not prove that its claims are true or its pictures can be published.

Tell the agent who you are writing for, what the content should explain and which facts it may use. Give examples of the voice you want and promises it must avoid. For an image, describe what it should help the reader understand, write a useful text description and record where it came from.

Keep drafting separate from publishing. Record which version a reviewer approves and where it will appear. If a price, fact or image changes afterwards, check whether that version needs fresh approval.`,
    method: `Prepare two formats from the same approved information. Check every factual statement, adjust the explanation for each audience and inspect the image at the size readers will see it.

Have a reviewer request one specific correction. Make the change, show what changed and record approval of the new version before a practice publishing step. Record where the image came from even if you created it yourself.`,
  },
  development: {
    title: "Ask your agent for a code change you can review",
    image: art + "verification.svg",
    visual: [
      "Show the problem",
      "Review the change",
      "Run the checks yourself",
    ],
    explanation: `Describe the bug, how to reproduce it and what the code should do instead. Say which files or part of the application are in scope. “Improve this repository” leaves the agent guessing which changes are needed.

Use a separate practice copy of the code so your experiment does not affect someone else’s changes. Record the starting state. Give the agent only the tools and access needed for the task, and keep production passwords and keys out of the exercise. Keep a list of changes and the commands used to test them.

Passing tests only shows that the checks in those tests passed. Inspect changed assertions and any added packages. A test can be made green by accepting the wrong result. Run the original problem yourself and check a nearby case that should still work.`,
    method: `Create a failing example before asking for the fix. Ask the agent for the code change, an explanation and test results. Check that the test fails on the original bug, then run the tests yourself on the fix.

If you reject the change, keep its records and return the practice copy to a known state using a checked recovery method. Do not discard unrelated work to make the exercise easier.`,
  },
  coordination: {
    title: "Give each agent a clear job and check how they pass work",
    image: art + "brief.svg",
    visual: [
      "Give each agent a separate job",
      "Check the work passed between them",
      "Keep one person responsible for the result",
    ],
    explanation: `More agents can help when there are different jobs to do, but they also add cost and ways to lose information. Compare the task with using one agent before splitting it up. A second agent is not an independent check if it simply repeats the first agent’s unsupported claim.

Describe what each agent receives and must produce. A researcher supplies facts and sources; a writer uses the checked facts; a reviewer compares the draft with the original records. If important information is missing, the next agent should return the work rather than guess.

Keep one person responsible for accepting the final result. Agents cannot give each other new permissions. Record the task ID, instruction version, current step and maximum number of revisions so you can see when work gets stuck.`,
    method: `Run the same example with one agent and with your proposed team. Compare the full time, costs, checking effort and mistakes. Add an unsupported statement between two steps and check that the receiving agent rejects it.

Set a limit on repeated revisions. If the agents still disagree at that point, stop and give the person responsible the facts behind each view. Do not allow endless discussion without new information.`,
  },
};
