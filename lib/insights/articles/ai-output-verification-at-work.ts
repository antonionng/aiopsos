import type { InsightArticle } from "../types.ts";

export const article: InsightArticle = {
  slug: "ai-output-verification-at-work",
  title: "An answer nobody checks is a liability",
  description:
    "Prompt tricks do not make AI safe to send. L&D and line managers need verification habits: what to check, when a person must review, and how to train that standard on real work.",
  dek: "The expensive failure is not a weak prompt. It is a plausible answer that left the building unchecked.",
  publishedAt: "2026-07-08",
  topic: "AI literacy",
  relatedCourseSlugs: [
    "prompting-and-output-verification",
    "ai-foundations-for-every-role",
  ],
  body: `
## Who this is for

This is for L&D, line managers, and risk owners whose staff already use AI to draft, summarise, analyse, or reply. The tools are in the building. The gap is not "how do I write a better prompt." The gap is that nobody has set a standard for when an answer is good enough to send, and nobody has trained that standard.

If your current plan is a one-hour session on prompt patterns, stop and change the brief. Prompt structure is useful. It is the smaller half of the job.

## The business problem

AI systems produce fluent, confident text. That is the product. Fluency is also the hazard. A wrong number in a messy spreadsheet announces itself. A wrong number in a well-written brief does not. Staff who have not been trained to check will forward the brief, because it looks like finished work.

Organisations then treat the resulting incident as a people problem or a tool problem. It is a standard problem. There was no agreed verification routine, so each person invented one, or invented none.

The adoption data makes this worse, not better. McKinsey reported in 2025 that 88% of organisations use AI in at least one function, while only about a third have scaled past pilots, and that only 39% report any EBIT impact. The Conference Board reported in 2026 that only 33% of workers got employer AI training in the last six months. TalentLMS reported in 2025 that 49% say AI is moving faster than their company's training. World Economic Forum reporting in 2025 found that 63% of employers name skill gaps as the top barrier to transformation. A lot of people are using the tools. A minority were trained. A smaller minority were trained to check.

McKinsey has also reported that leaders with highly AI-fluent teams are 3.9 times more likely to capture enterprise value. Fluency, in any serious reading, includes knowing when the output is wrong. A team that generates faster and checks never is not fluent. It is a faster way to ship errors.

## Why prompt-trick training fails

Prompt catalogues spread because they are easy to teach and easy to market. Role, context, constraints, format: that structure is worth teaching. It improves first-pass quality. It does not tell a claims handler whether a cited clause exists. It does not tell a finance analyst whether a total ties to the source file. It does not tell a manager whether a customer email just invented a policy.

People who only received prompt training do what the training implied: they iterate the prompt when the answer looks off, and they accept the answer when it looks polished. Looking polished is what the model is good at. The training accidentally selected for the failure mode.

[AI Foundations for Every Role](/courses/ai-foundations-for-every-role) exists so staff understand, in plain language, how a model produces an answer and why fabrication, staleness, and confident error are normal. [Prompting and Output Verification](/courses/prompting-and-output-verification) is the working session that then builds the checking habit: structure the request, recover a weak first answer, apply a routine before the work leaves the desk, and write the prompt down so a colleague can reuse it.

Those two courses are a pair. Foundations without verification leaves people informed and still unsafe. Verification without foundations turns the routine into a checklist they cannot explain.

## What good looks like

A verification standard is role-proportionate. Not every task needs the same depth of check. Every task needs a named depth.

**Low stakes, internal, easy to reverse.** A first draft of a meeting recap that will be edited anyway. Check: does it name the right people and dates? Scan for invented actions. Send as a draft, not as minutes.

**External or customer-facing.** Check every fact against a source you hold. Check tone against policy. A person signs it out. If you cannot name the source, it does not go.

**Financial, legal, clinical, or people decisions.** The model may draft. It may not decide. Verification means reconciling to systems of record, and a named reviewer. If that sounds slow, it is still faster than an incident.

**Anything with citations, quotes, or "the file says."** Open the file. Models omit, merge, and invent. This is not cynicism. It is the shape of the technology.

Train the routine on the team's own work, in the room, with a facilitator who will fail a piece that looks finished and is not. Self-paced modules rarely do that, because there is nobody to disappoint.

Write the routine down in the same place as the AI policy. Managers should be able to ask "what did you check?" and hear a consistent answer. [Prompting and Output Verification](/courses/prompting-and-output-verification) practises that answer until it is boring. Boring is the goal.

## Why this is also a literacy record

Article 4 of the EU AI Act requires providers and deployers to take measures supporting AI literacy among staff. National market surveillance authorities began supervising on 2 August 2026. Article 4 requires measures supporting literacy, not a certificate. A workforce that can prompt but cannot verify is a weak literacy story. A workforce that can show it was taught a checking standard, attended, and was assessed on it is a stronger one.

Do not describe verification training as making the organisation compliant. Describe it as a measure: these roles were taught when a person must review, and here is the register. That sentence is accurate. "We are Article 4 certified" is not.

## What to commission

If staff have never used the tools on their own work, start with foundations, then verification. If they already use the tools daily and you are seeing confident errors, skip the inspiration session and go straight to verification and manager oversight. Insist on live facilitation, assessed work, and an export. A slide deck of prompt tips will not survive a customer complaint.

Experrt runs those cohorts live, in person or online, on the organisation's own material. We will not teach a secret prompt that removes the need to check. There is not one.

If you want the room booked, [contact Experrt](/contact). Bring three examples of AI-assisted work that already left a desk. Those examples are the syllabus.
`,
};
