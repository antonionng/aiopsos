import type { InsightArticle } from "../types.ts";

export const article: InsightArticle = {
  slug: "robotics-training-is-an-ops-problem",
  title: "Robotics training is an operations problem, not an engineering one",
  description:
    "Shop-floor and operations buyers do not need a course on how robots are built. They need people who can specify, run, and work alongside a deployment when it stops mid-shift.",
  dek: "The robot is an asset. The failure is usually the shift that does not know what to do when it stops.",
  publishedAt: "2026-06-10",
  topic: "Robotics",
  relatedCourseSlugs: [
    "robotics-what-it-can-and-cannot-do",
    "specifying-a-robotics-deployment",
    "working-alongside-a-cobot",
  ],
  body: `
## Who this is for

This is for the operations, site, or transformation lead who is about to live with a robot, a cobot, or a cell that an integrator will leave behind. Engineering may own the specification. A vendor may own the install. You will own the Tuesday night shift when the cell stops, the first-off is wrong, or a collaborative robot is standing in a walkway that still has people in it.

If your instinct is to send a few technicians on a manufacturer's programming course and call the workforce ready, read this before you book it. That course has a place. It is not the operations brief.

## The business problem

Robotics projects fail in familiar ways. The business case assumed average throughput and met peak. The specification described a product rather than a process. The integrator left and took the only person who understood the recovery sequence. Operators were shown the start button and not the stop conditions. A collaborative robot was sold as "safe around people," which is a marketing sentence, not a safe system of work.

Those are operations problems. They show up as engineering change requests, but they are caused by people who were not trained for the job they now have: specifying, accepting, running, and working alongside a machine that does not get tired and does not explain itself.

The wider skills picture is not kind to "we will pick this up on the job." World Economic Forum reporting in 2025 found that 63% of employers name skill gaps as the top barrier to transformation. TalentLMS reported in 2025 that 49% of workers say AI is moving faster than their company's training. Robotics is not the same as generative AI, but the adoption pattern is related: capital arrives before capability. McKinsey reported in 2025 that 88% of organisations use AI in at least one function while only about a third have scaled past pilots, and that only 39% report any EBIT impact. Leaders with highly AI-fluent teams are 3.9 times more likely to capture enterprise value, per McKinsey. The Conference Board reported in 2026 that only 33% of workers received employer AI training in the last six months. Organisations that already struggle to train people on software will not accidentally train them on a cell.

Article 4 of the EU AI Act is about AI literacy, not robots. National market surveillance authorities began supervising that duty on 2 August 2026. If the same site is also deploying AI-enabled robotics or vision systems, do not confuse a robot induction with Article 4 measures. They can sit in the same programme. They are not the same record.

## Why engineering training is the wrong first buy

Manufacturer courses teach the people who will program, maintain, or deeply recover the asset. You need some of those people. You also need a larger group who will never write a program and will still decide whether the cell earns its keep:

- Planners and ops managers who write the process the robot must run.
- Supervisors who own the shift when it faults.
- Operators who start, guide, stop, and refuse unsafe conditions.
- Quality and H&S who accept the cell and keep the records.
- The director who signed the cheque and still needs to know who owns downtime.

Sending only engineers to the OEM course leaves that group untrained. The integrator then becomes a standing subscription, because nobody on the shift can do a changeover, a first-off check, or a controlled stop without a call-out.

## What good looks like

Train in the order the work actually happens.

**First, a grounded picture of capability.** What the technology does well, where it struggles, and which tasks on your site are even candidates. [Robotics: What It Can and Cannot Do](/courses/robotics-what-it-can-and-cannot-do) is that session. It uses real deployments and real failure modes, not a trade-press reel. People leave able to ask a vendor a question the demo was not designed to answer.

**Second, a process-led specification.** The document that decides whether a deployment succeeds is written before anyone quotes. Requirements in terms of your process, integrator selection based on the questions they ask you, acceptance tests you can run on the day, at peak rather than on a quiet Tuesday. [Specifying a Robotics Deployment](/courses/specifying-a-robotics-deployment) is the course for the managers who will live with that document.

**Third, the people who share the workspace.** Collaborative robots are an operational and behavioural problem. Starting, guiding, stopping, teaching a simple repeatable task, and knowing when not to use the machine are skills. [Working Alongside a Cobot](/courses/working-alongside-a-cobot) is hands-on for that group. If you skip it, you will discover the gap on a live shift.

**Then, and only then, the deep technical courses** for the small number of people who will recover a cell or write a program. Those courses are valuable. They are a poor substitute for the three above.

A good operations programme also produces a record: who was trained on start/stop and isolation, who can run a changeover, who owns the risk assessment, who can accept a cell. If an inspector or an insurer asks, you should not be reconstructing that from emails.

## What to insist on when you commission

- Training on your process and, where possible, your site or a close analogue. A showroom cell teaches showroom behaviour.
- Stop conditions and escalation, not only the happy path.
- Acceptance criteria written before install, tested at peak.
- Named owners for the asset, the skills, and the downtime.
- A register. Robotics training that cannot say who was in the room is theatre.

Experrt is a training academy, not an integrator. We do not sell cells, and we will not write your safety case. We will train the people who have to specify, accept, and work alongside the kit, and we will keep the attendance and assessment record that operations actually needs.

## How to start

If a deployment is already signed, train the shift and the specification owners before go-live, not in week six when the integrator is packing up. If you are still writing the business case, run the capability and specification courses first so the case is about a process, not a brochure.

[Contact Experrt](/contact) with the site, the process you want to automate, and whether a cobot, a cell, or a warehouse system is on the table. We will tell you which cohort should sit first.
`,
};
