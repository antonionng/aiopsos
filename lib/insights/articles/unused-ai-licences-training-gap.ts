import type { InsightArticle } from "../types.ts";

export const article: InsightArticle = {
  slug: "unused-ai-licences-training-gap",
  title: "The licences are paid for. The team was not trained.",
  description:
    "Most organisations paid for AI seats and assumed capability would follow. Usage clustered, pilots stalled, and EBIT impact stayed rare. How L&D and ops close the training gap on tools you already own.",
  dek: "Paid seats are not capability. Unused licences are a training problem with a finance aftertaste.",
  publishedAt: "2026-06-24",
  topic: "Adoption",
  relatedCourseSlugs: [
    "getting-value-from-tools-you-already-own",
    "embedding-ai-in-daily-workflows",
  ],
  cta: {
    heading: "See the literacy programme",
    blurb:
      "Experrt runs live, in-house cohorts. If you want the programme scoped against the roles you already have, start on the AI literacy training page. You can also write to ag@experrt.com.",
    primaryHref: "/ai-literacy-training",
    primaryLabel: "AI literacy training",
  },
  body: `
## Who this is for

This is for the operations, transformation, or L&D lead who can already see the invoice. The organisation bought AI seats, a copilot, or a bundle inside a suite it already paid for. A handful of people use it every day. Most of the team opened it once, produced something they did not trust, and went back to the old method. Finance has started asking what the licences are for. Someone has suggested buying a different tool.

Do not buy a different tool until you know whether the current one was ever taught.

## The business problem

Unused seats are rarely a product failure first. They are a training and workflow failure that looks like a procurement problem. The organisation paid for access. It did not pay, or did not insist on, the hours required to put that access into a recurring job.

McKinsey reported in 2025 that 88% of organisations use AI in at least one function, and that only about a third have scaled past pilots. The same research line found that only 39% report any EBIT impact from AI. Those two facts belong together. Pilots that never leave a champion team do not show up in earnings. They do show up as renewals.

The Conference Board reported in 2026 that only 33% of workers got employer AI training in the last six months. TalentLMS reported in 2025 that 49% say AI is moving faster than their company's training. World Economic Forum reporting in 2025 found that 63% of employers name skill gaps as the top barrier to transformation. Read those together and the picture is ordinary: tools arrived, training did not, and leaders are surprised that adoption stalled.

McKinsey has also reported that leaders with highly AI-fluent teams are 3.9 times more likely to capture enterprise value. Fluency is not a personality trait. It is the result of practice on real work, with someone in the room who can say when the output is wrong.

## Why the "just roll it out" plan fails

A typical rollout looks like this. IT enables the licence. Communications send a launch note. A vendor hosts a 45-minute webinar on features. A Slack channel is created. Three months later, usage reports show a power-user cluster and a long tail of unused seats. The conclusion drawn in the steering group is that "people do not want AI" or that "we chose the wrong product."

Both conclusions are convenient. The more common cause is that nobody rebuilt a single recurring workflow with the tool in it, and nobody was required to verify an output before it left the desk. Staff who are already busy will not invent a new method in their spare time. They will try it once, hit a weak first answer, and stop.

That is why Experrt treats unused capability as a training brief, not a product demo. [Getting Value From the Tools You Already Own](/courses/getting-value-from-tools-you-already-own) is a working audit of the licences you hold, the features that would save time this month, and the ones you should stop paying for. [Embedding AI in Daily Workflows](/courses/embedding-ai-in-daily-workflows) is the follow-on: each participant maps one recurring task they own and rebuilds it with AI in the loop, then hands it to a colleague who has to run it unaided.

If those two things have not happened, you do not yet know whether the licence is worthless. You know it was not taught.

## What good looks like

A programme that turns paid seats into used seats has a short list of features. It is shorter than most transformation decks.

**Inventory before inspiration.** List the AI features inside the suites you already buy. Most organisations are surprised by what is already switched on and unused, and by what they are paying for twice. The output of this step is a one-page map, not a strategy.

**Pick three jobs, not thirty use cases.** Choose recurring work with a known volume: a weekly pack, a first-line response, a reconciliation, a site report. Train those jobs end to end. A catalogue of 80 suggested prompts is not a workflow.

**Train on the team's own material.** A demo dataset teaches people how the vendor wants the product to look. Their own awkward files teach them whether it survives Monday morning.

**Require a verification habit.** An unused licence is expensive. A used licence with no checking habit is more expensive. Staff need a standard for what "good enough to send" means. That standard belongs in the training, not in a policy PDF nobody opens.

**Measure use of the rebuilt workflow, not login counts.** A seat that was opened to generate a joke is not adoption. A weekly pack that now starts from a checked draft is adoption. Agree the measure before the cohort runs.

**Be willing to drop a licence.** If the audit finds a tool nobody can place in a real job, stopping the renewal is a result. Training that only ever recommends more spend is sales.

## What this is not

It is not a prompt-trick session. It is not a hackathon. It is not another pilot with a new vendor. McKinsey's finding that only about a third of organisations have scaled past pilots is the warning. Another pilot adds a second unused stack.

It is also not an argument that every role must become an AI specialist. Most of the value sits in ordinary jobs done with a better method and a checking habit. Fluency at that level is what the 3.9 times figure is pointing at: teams that can use the tools they already have, on work that already exists.

## How to commission it without losing the record

Name the licences and the three jobs in the brief. Insist on live facilitation against those jobs. Require attendance and a before-and-after artefact for each participant: the old method, the rebuilt workflow, and the colleague handover. Export that pack. If a later renewal conversation asks what the seats are for, you will have something other than a usage graph with a sad tail.

Experrt runs those cohorts in person or online. We do not sell the underlying tools, and we will not pretend a two-hour orientation turns a licence estate into EBIT. We will put your people in a room with the tools you already pay for and make them use them on the work you already do.

If you want the programme scoped against the roles you already have, start on the [AI literacy training](/ai-literacy-training) page. Bring the list of roles and the tools they already use. You can also write to [ag@experrt.com](mailto:ag@experrt.com).
`,
};
