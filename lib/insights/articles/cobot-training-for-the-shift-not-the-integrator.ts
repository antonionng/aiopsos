import type { InsightArticle } from "../types.ts";

export const article: InsightArticle = {
  slug: "cobot-training-for-the-shift-not-the-integrator",
  title: "Cobot training for the shift, not the integrator",
  description:
    "Robotics training for the people on the cell, not the vendor. What operations should teach operators and supervisors before the integrator packs up.",
  dek: "The integrator leaves. The shift stays. Train the people who will be there on Tuesday night.",
  publishedAt: "2026-08-12",
  topic: "Robotics",
  relatedCourseSlugs: [
    "working-alongside-a-cobot",
    "running-and-troubleshooting-a-robotic-cell",
    "safety-risk-and-compliance-for-robotic-workcells",
  ],
  body: `
## Who this is for

This is for the operations, site, or H&S lead who is about to accept a collaborative robot, or already has one standing in a walkway that still has people in it. The integrator can start and stop the demo cell. Your night shift cannot yet. That is the training problem.

If the plan is "the vendor will show them the buttons in week one," read this before go-live. A walkthrough is not a shift capability.

## The business problem

Integrators are paid to leave a working cell. They are not paid to remain as a standing supervisor. When the only person who knows the recovery sequence is on a plane, downtime becomes a call-out. Operators who were shown the happy path will freeze, or worse, work around a stop they do not understand.

This sits next to a wider operations point: [Robotics training is an operations problem, not an engineering one](/insights/robotics-training-is-an-ops-problem). That briefing is the buying frame. This one is the shift frame: who on the cell needs what, before the vendor packs the flight case.

World Economic Forum reporting in 2025 found that 63% of employers name skill gaps as the top barrier to transformation. TalentLMS reported in 2025 that 49% of workers say AI is moving faster than their company's training. Robotics is not the same as generative AI, but the adoption pattern is related: capital arrives before the people who will live with it are taught. McKinsey reported in 2025 that 88% of organisations use AI in at least one function while only about a third have scaled past pilots, and that only 39% report any EBIT impact. The Conference Board reported in 2026 that only 33% of workers received employer AI training in the last six months. Sites that already under-train software will not accidentally train a cobot shift.

Article 4 of the EU AI Act is a literacy duty for AI systems, not a robot induction. If the cell includes AI-enabled vision or planning, keep those records separate. A cobot walkthrough is not an Article 4 measure.

## What the integrator teaches, and what they do not

The vendor will teach the people who must program, recover, or deeply maintain the asset, or they will teach a short start sequence so the acceptance test passes. They will not teach every operator when to refuse a task, how to isolate, how to run a changeover at 2am, or how to talk to a colleague who is standing too close.

That is not a criticism of integrators. It is not their product. It becomes your problem the first week they are gone.

## Who on the shift needs what

**Operators who share the workspace.** Start, guide, stop, a simple repeatable teach, and the stop conditions. Hands-on, on your cell or a close analogue. [Working Alongside a Cobot](/courses/working-alongside-a-cobot) is that course. If you skip it, you will discover the gap on a live shift.

**Supervisors who own the hour.** Escalation, when to stop the cell, when to call maintenance, what "safe to restart" means. They also own the conversation when someone is tempted to defeat a guard "just this once."

**The small technical group.** Recovery, first-off, the fault that is not in the one-page card. [Running and Troubleshooting a Robotic Cell](/courses/running-and-troubleshooting-a-robotic-cell) is for that group, not for the whole shift.

**H&S and the people who accept the cell.** The risk assessment, the safe system of work, the record. [Safety, Risk and Compliance for Robotic Workcells](/courses/safety-risk-and-compliance-for-robotic-workcells) is the session for that ownership. A marketing sentence about cobots being "safe around people" is not a safe system of work.

Do not send the whole shift on the integrator's programming course. You will train the wrong people at the wrong depth and still leave Tuesday night uncovered.

## What good looks like

Train before go-live, on the process you will run, at something closer to peak than a quiet demo. Write stop conditions into the course, not only the start button. Take a register that names who can start/stop, who can isolate, who can recover, who owns the risk assessment.

A good shift programme produces a card the supervisor can hold: names and roles, not a vendor slide. If an inspector or an insurer asks who was trained, you should not be reconstructing that from emails. If the cell already ran last week without that card, you are relying on luck and the two people who watched the demo.

## What to insist on when you commission

- Training for the shift as a named group, separate from the integrator's technical handover.
- Practice of stop, isolation, and "do not use," not only the happy path.
- Your process, your layout, or a close analogue. A showroom cell teaches showroom behaviour.
- A register the site keeps.
- A written limit: the vendor's walkthrough is handover, not the operations programme.

Experrt is a training academy, not an integrator. We do not sell cells and we will not write your safety case. We will train the people who share the workspace and keep the attendance record operations needs.

## How to start

If go-live is dated, put the operator and supervisor sessions on the plan before the integrator's last week, not after. If the cell is already live and the shift is guessing, treat that as an incident waiting for a date, and book the room.

[Contact Experrt](/contact) with the site, the cell type, and which shifts will run it. We will tell you which cohort sits first.
`,
};
