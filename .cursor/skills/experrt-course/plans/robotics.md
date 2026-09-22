# Robotics track: course plans

This document plans the ten courses in the robotics track of the Experrt learning academy. Each plan follows the standard in `SKILL.md`. Each course keeps the modules in `lib/self-serve/catalog.ts` as its spine and expands them into lessons that teach one move each. Every lesson has a place, an idea, a worked example, a practice, a check, and a bridge.

Some rules apply to all ten courses, so they are stated once here.

- The learner is a working professional, and the lessons speak to them as you.
- The words on a button are words the lesson has already taught.
- A check stays on the lesson until it is right. A wrong answer names the sentence or the missing part and says what to look at again. A right answer explains why before Next appears.
- Ordering controls appear only where the sequence is the skill being learned, such as a start-up, a recovery, or an escalation.
- No record in this track certifies that a person is competent to operate, maintain, or approve machinery. No record certifies compliance with the Health and Safety at Work etc. Act 1974, the Provision and Use of Work Equipment Regulations 1998, the Supply of Machinery (Safety) Regulations 2008, ISO 10218, ISO/TS 15066, or any other regulation or standard. No record is a safety sign-off. Each record says, in plain words, that it shows the work the person wrote in the course.
- None of these courses replaces the manufacturer's training, the employer's authorisation to operate, the site's own procedures, or the risk assessment for a specific installation. Where a lesson describes a procedure, it teaches the shape of a good procedure and tells the learner that their site's written procedure takes precedence.
- No lesson contains a salary figure or promises a change in pay. Figures in worked examples are illustrative workplace numbers that belong to the example, and the lesson says so where it matters.

The record for every course names the person, the course title, the date they signed, the artefact they wrote in the final lesson, and the public reference. A verifier sees that and nothing else.

---

## 1. Robotics for Non-Engineers

**Slug:** `robotics-for-non-engineers`

**Catalogue:** 2.5 hours, £99. Promise: "A go or not-yet brief for one process. A decision, not an introduction." Modules: What it could take, What it cannot do, The exception, The brief.

### Who it is for

This course is for managers, planners, finance partners, and team leaders who have been asked whether a robot could do part of a process they own or oversee. They are not engineers and are not expected to become engineers. They must already know the process they want to judge well enough to describe it step by step, and they should be able to find out roughly how often it runs and what goes wrong with it. They do not need to know anything about robots.

### Outcome

When you finish, you can take one process you own, describe the task a robot might take in terms of what repeats and what varies, name what a robot cannot do in that process, name the exception that decides the case and who handles it, and write a one-page brief that ends with a decision of go or not yet, together with the one piece of evidence that would change that decision.

### Learning objectives

1. Describe a task in terms of what repeats and what varies, using facts about your own process.
2. Separate what a vendor has claimed from what has been shown on your own parts.
3. Identify the exception that decides whether automation is sensible, and name who handles it today.
4. Write a go or not-yet decision that states its reason and the evidence that would change it.

### Lessons

#### Lesson 1: What a robot actually does

- **Id:** `what-a-robot-does`
- **Place:** This is the first lesson. It gives you the two words the rest of the course uses to describe any task: what repeats, and what varies.

**Core idea.** An industrial robot is a machine that moves through positions it has been programmed to reach, and it does the same thing each time it is told to. It is very good at repeating a motion precisely, at speed, for long periods, on parts that arrive in the same place and the same orientation. It is not a general worker that looks at a situation and works out what to do. When a robot appears to adapt, for example by picking a part it has located with a camera, it is still following rules that someone set up for a known range of cases, and outside that range it stops or makes a mistake. So the first question about any task is not whether a robot is clever enough. The first question is how much of the task repeats in exactly the same way, and how much varies from one time to the next. In this course, a step "repeats" when the part, the position, and the action are the same each time, and a step "varies" when any of those changes in a way a person currently notices and handles.

**Worked example.** A distribution site manager describes the end of her packing line.

> Input: "Sealed cartons come down the conveyor one at a time, always the same three sizes. A packer lifts each carton onto a pallet in a fixed pattern. About once an hour a carton arrives with a split corner and the packer puts it aside. When a pallet is full the packer calls a forklift driver."

> Output, marked with the two words: "Sealed cartons come down the conveyor one at a time, always the same three sizes" repeats. "A packer lifts each carton onto a pallet in a fixed pattern" repeats. "About once an hour a carton arrives with a split corner and the packer puts it aside" varies. "When a pallet is full the packer calls a forklift driver" repeats in timing but involves another person, so it is noted separately.

> Reading: Most of this task repeats, which is why palletising is a common robot application. The split carton is the part that varies, and the packer handles it without thinking about it. The robot would not notice a split corner unless something was added to detect it. That single sentence is where the rest of this course will spend its attention.

**Practice.** Write four or five sentences describing one task in a process you own, as if you were explaining it to a new starter. Then mark each sentence with "Repeats" or "Varies". The worked example stays on the page while you do this.

**Check.**

- Question: "Here is a description of a goods-in task at a food manufacturer. Mark each sentence with Repeats or Varies."
- Controls on each sentence: "Repeats" and "Varies".
- Sentences, correct answers, and feedback:
  1. "Trays of the same yoghurt pot arrive on the same pallet type every morning." Correct: "Repeats". Right: "Yes. The part, the pallet, and the timing are the same each day, so this sentence repeats." Wrong: "Look again at this sentence. The same pot arrives on the same pallet at the same time, which is what repeats means in this lesson."
  2. "An operator checks the use-by date on each tray against the delivery note." Correct: "Varies". Right: "Yes. The action is the same, but the date changes every delivery and the operator is judging it, so the step varies." Wrong: "The movement is similar each time, but the operator is reading a date that changes and deciding whether it is acceptable. When a person is noticing and judging a changing detail, the step varies."
  3. "Trays are lifted from the pallet onto a conveyor in the same order each time." Correct: "Repeats". Right: "Yes. The same lift, from the same layout, in the same order, repeats." Wrong: "This sentence describes the same motion in the same order every time. That is the definition of a step that repeats."
  4. "Sometimes a tray has shifted in transit and is lying at an angle across two others." Correct: "Varies". Right: "Yes. The position of the tray is different from normal and a person currently deals with it, so it varies." Wrong: "The position of the tray has changed, and a robot programmed for the normal layout would not reach it correctly. A changed position is what varies means here."
- Pass reason shown before Next: "You separated the steps that are the same every time from the steps where a person is noticing and handling a difference. That split is the first thing anyone judging automation needs to see."

**Bridge.** Now that you can see what repeats, the next lesson asks which of those steps a robot could realistically take.

#### Lesson 2: What it could take

- **Id:** `what-it-could-take`
- **Place:** This lesson turns the steps that repeat into a short list of candidates. It is the first module in the catalogue outline.

**Core idea.** A step is a candidate for a robot when it repeats, when it happens often enough to matter, and when the part arrives in a known place and orientation. Those three conditions together are what make a step something a robot "could take" in this course. A step that repeats but happens twice a week is rarely worth the cost and the engineering, and a step that happens constantly but where the parts arrive jumbled in a bin is much harder than it looks. Being a candidate is not the same as being a good investment, and it is not a decision. It only means that the step is worth describing in more detail. Many first conversations about robots go wrong because someone picks the step that is most tiring or most disliked, rather than the step that meets the three conditions, and those are not always the same step.

**Worked example.** A plant manager at a plastics moulder is asked which step on a moulding machine could be automated.

> Input: "Step A: the operator removes each moulded part from the machine every 40 seconds, from the same position, and places it on a conveyor. Step B: the operator inspects a sample of parts each hour for flash and short shots. Step C: once a week the operator changes the tool, which takes most of a shift."

> Output: "Step A could take a robot. It repeats, it happens every 40 seconds, and the part is always presented in the same place when the mould opens. Step B varies, because the operator is judging defects. Step C is disliked and slow, but it happens once a week and every changeover is slightly different."

> Reading: The cycle times in this example are illustrative. Step C is the step people complain about most, yet Step A is the candidate, because it meets all three conditions. Removing parts from moulding machines is a long-established robot task for exactly that reason.

**Practice.** Take the task you described in lesson 1. For each step marked "Repeats", note how often it happens and how the part arrives. Mark the steps that meet all three conditions as "Could take".

**Check.**

- Question: "A laboratory manager has written two descriptions of steps that might be automated. Choose the step a robot could take."
- Controls: "Step A" and "Step B".
- Step A: "Technicians open incoming sample boxes, which arrive from dozens of clinics in different box sizes, and take out tubes that may be loose, taped together, or inside bags."
- Step B: "Technicians move capped tubes from a fixed rack of 96 positions into the analyser's rack of 96 positions, several hundred times a day, in the same pattern."
- Correct: "Step B".
- Right feedback: "Yes. Step B repeats, happens hundreds of times a day, and the tubes sit in known positions. It meets all three conditions for a step a robot could take."
- Wrong feedback: "Step A happens often, but the boxes and the tubes arrive in a different state each time. The part does not arrive in a known place and orientation, so it does not meet the third condition. Look again at how the tubes are presented in each step."
- Pass reason: "You chose the step that repeats, happens often, and has its parts in a known place, rather than the step that is simply busy."

**Bridge.** A step that could take a robot still sits inside a process with limits, and the next lesson names what a robot cannot do in yours.

#### Lesson 3: What it cannot do, and what has not been shown

- **Id:** `what-it-cannot-do`
- **Place:** This lesson is the second module. It deals with the limits of the machine and with the gap between a claim and evidence.

**Core idea.** Robots in ordinary industrial use are limited in some predictable ways. They struggle with parts that are soft, flexible, or tangled, such as cables, bags, and fabric. They struggle when the thing they handle changes often, for example many product variants on short runs. They do not notice things they were not set up to look for. They need the space around them to be safe for people, which usually means guarding or other safeguards. Suppliers are often working hard to overcome these limits, and some demonstrations are impressive, but a demonstration is a claim about the supplier's parts in the supplier's conditions. In this course, something is "Shown on our parts" only when it has been done with your own parts, at your own volumes, in conditions like yours. Everything else is "Claimed, not yet shown". That label is not an accusation of dishonesty. It is a note that the evidence you need does not exist yet.

**Worked example.** An operations director forwards a supplier's email.

> Input: "Our system picks any item from any tote. At the trade show we ran at 1,200 picks an hour. We ran 50 of your SKUs in our lab last week with no failures. It will fit into your existing layout."

> Output, marked: "Our system picks any item from any tote" is claimed, not yet shown. "At the trade show we ran at 1,200 picks an hour" is claimed, not yet shown, because it was not your items. "We ran 50 of your SKUs in our lab last week with no failures" is shown on our parts, for those 50 items in lab conditions. "It will fit into your existing layout" is claimed, not yet shown.

> Reading: One sentence carries real evidence, and even that one is limited to 50 items and a lab. The pick rate in the email belongs to the supplier's example and says nothing about your range. The useful next step is to ask which of your items were not in the 50, and how the system handled the difficult ones.

**Practice.** Find one claim you have heard about automation in your area, from a supplier, a conference, or a colleague. Write it down and mark it with "Shown on our parts" or "Claimed, not yet shown". Then write one sentence saying what would turn it into evidence.

**Check.**

- Question: "A supplier has sent these sentences about a robot for loading a press brake. Mark each sentence with Shown on our parts or Claimed, not yet shown."
- Controls on each sentence: "Shown on our parts" and "Claimed, not yet shown".
- Sentences, correct answers, and feedback:
  1. "The robot handles sheet up to the size of your largest blank." Correct: "Claimed, not yet shown". Right: "Yes. This is a statement about capability, and nothing says it was tried with your blanks." Wrong: "Nothing in this sentence says the robot was run with your sheet. A statement of capacity is a claim until it has been done on your parts."
  2. "We bent 200 of your bracket blanks, supplied by your team, in our demonstration cell on 12 March, and measured every angle." Correct: "Shown on our parts". Right: "Yes. Your own parts were used, in a stated quantity, and the result was measured." Wrong: "This sentence names your parts, a quantity, a date, and a measurement. That is what shown on our parts means in this lesson."
  3. "Customers typically see changeovers under ten minutes." Correct: "Claimed, not yet shown". Right: "Yes. Typically and customers refer to other people's work, not yours." Wrong: "The word typically is a sign that this is someone else's result. It is claimed, not yet shown, until it has been timed on your changeovers."
  4. "The system learns new parts automatically." Correct: "Claimed, not yet shown". Right: "Yes. This is a general claim and there is no test on your parts behind it." Wrong: "No test is described. A general statement about the system is a claim until it is shown on your parts."
- Pass reason: "You kept the one sentence with evidence on your own parts apart from the sentences that describe someone else's conditions."

**Bridge.** Limits and claims are only half the picture, because the case is usually decided by the thing that goes wrong, which is the next lesson.

#### Lesson 4: The exception that decides the case

- **Id:** `the-exception`
- **Place:** This is the third module. It is the lesson that most often changes a learner's decision.

**Core idea.** An exception is any case that departs from the normal flow of the task: a damaged carton, a missing label, a part that arrives upside down, a customer order with a special instruction. People handle exceptions constantly and often do not notice they are doing it, because the handling is part of the job. When a robot takes the normal case, the exceptions do not disappear. They stop the robot, or they pass through it wrongly, or they are moved to a person somewhere else. So a process is decided by its exceptions rather than by its average. For each exception you need three facts: what it is, roughly how often it happens or that you do not yet know, and who handles it today. An exception is not the same as a breakdown of the robot itself. It is something in the work that does not fit the pattern the robot was set up for.

**Worked example.** A returns manager is considering a robot to put returned items back into stock.

> Input: "Most returns are unopened, in their original packaging, with a readable barcode. Some are opened, some have no barcode, and some are a different item from the one on the returns note. My team sorts these into a separate cage."

> Output, written as exceptions: "Opened items. How often: not yet measured. Handled by: returns team, who inspect and decide whether to restock. Missing barcode. How often: not yet measured. Handled by: returns team, who look the item up by description. Wrong item. How often: not yet measured. Handled by: returns team, who raise a query with customer service."

> Reading: Every exception is handled by the same team using judgement, and none has been counted. That does not mean the answer is no. It means the decision cannot be made until someone counts the cage for a few weeks, because if the cage is a large share of the flow, the robot takes only the easy part and the team keeps the hard part.

**Practice.** For the task you have been working on, list every exception you can think of. For each, write what it is, how often it happens or "not yet measured", and who handles it today.

**Check.**

- Question: "This process note from a parts warehouse is missing information about its exception. Edit the note so the exception has all three facts the lesson named."
- Control: an editable text box containing the note: "Robot to pick small parts from bins into order totes. Exception: some bins are mixed after a miscount."
- What must be added: roughly how often mixed bins occur, or the words "not yet measured", and who handles a mixed bin today.
- Feedback when the frequency is missing: "Your note says what the exception is and who handles it, but not how often it happens. Add a frequency, or write not yet measured so the gap is visible."
- Feedback when the handler is missing: "Your note says what the exception is, but not who handles a mixed bin today. Name the role, for example the stock controller or the picker."
- Feedback when both are missing: "The note still names only the exception. Add how often it happens, or not yet measured, and who handles it today."
- Right feedback: "Yes. The note now says what the exception is, how often it happens or that nobody knows yet, and who handles it. A reader can now see what the robot would leave behind."
- Validation: the edited text must contain a frequency expression or the phrase "not yet measured", and a named role or team. A longer note without those two parts does not pass.

**Bridge.** You now have a candidate step, its limits, and its exception, and the next lesson shows you how to turn those into a decision.

#### Lesson 5: Go or not yet

- **Id:** `go-or-not-yet`
- **Place:** This lesson prepares the decision that the brief will carry. It sits between the exception and the brief.

**Core idea.** In this course a decision has two possible values. "Go" means it is worth spending money and time on the next stage, such as a paid feasibility study or a trial on your parts. "Not yet" means something specific must be true first. Go requires four things: the step meets the three conditions from lesson 2, the main claim has been shown on your parts or you know how it will be, each exception has a named handler, and someone has been named to own the stop, which means the person who decides when the robot stops and who restarts it. Not yet is not the same as no. A good not-yet decision names the one missing piece and who will get it. A weak decision in either direction is one that does not say its reason.

**Worked example.** Two managers write decisions about the same palletising step.

> Input, decision one: "Go. Palletising is a proven application and the team hates the lifting."

> Input, decision two: "Not yet. The step repeats and runs all day, and split cartons are set aside by the packer about once an hour. Nobody has yet been named to own the stop and restart on nights. Go once the shift manager on nights agrees to own it."

> Reading: Decision one gives a general truth about palletising and a real complaint, but no fact about this process. Decision two is less exciting, yet it tells a reader exactly what is true and what is missing. A finance partner could act on decision two.

**Practice.** Write a one-line decision for your process, either go or not yet, and a second line giving the reason in terms of the four things above.

**Check.**

- Question: "Two decisions have been written about robot loading for a CNC lathe. Choose the decision you could defend to your finance partner."
- Controls: "Decision A" and "Decision B".
- Decision A: "Go. Robot loading of lathes is widely used, and our competitors are doing it."
- Decision B: "Go to a paid trial. The load step repeats on two part numbers that make up most of the lathe's work, the supplier has run 100 of our blanks, bar ends and bent stock are set aside by the setter, and the cell leader has agreed to own the stop."
- Correct: "Decision B".
- Right feedback: "Yes. Decision B gives the facts about this lathe, the evidence on your parts, who handles the exceptions, and who owns the stop."
- Wrong feedback: "Decision A may be true in general, but it gives no fact about your lathe, no evidence on your parts, and no owner for the exceptions or the stop. Look for the decision that names those things."
- Pass reason: "You chose the decision that states its reason in the terms of this process."

**Bridge.** The last lesson asks you to write the whole brief, and that brief is what appears on your record.

#### Lesson 6: The brief

- **Id:** `the-brief`
- **Place:** This is the final lesson and the fourth module. You write the artefact.

**Core idea.** The go or not-yet brief is one page about one process. It is not an introduction to robotics and it is not a sales case. It has six parts: the process and the step you considered; what repeats and what varies; what a robot cannot do here, and what is still only claimed; the exception that decides the case, with how often and who handles it; who owns the stop; and the decision with the evidence that would change it. A colleague who has never met you should be able to read it and understand why you decided as you did. It should use facts you know and should say "not yet measured" where you do not know.

**Worked example.** The returns manager from lesson 4 writes her brief.

> Output: "Process: returns put-away, step of placing restockable items onto shelves. Repeats: unopened items with readable barcodes, placed onto known locations. Varies: opened items, missing barcodes, and wrong items. Cannot do here: judge whether an opened item can be resold. Claimed, not yet shown: the supplier's statement that the system reads damaged barcodes. Exception that decides: the separate cage of opened, unlabelled, and wrong items, not yet measured, handled by the returns team. Owner of the stop: not yet named. Decision: not yet. Count the cage for four weeks and name an owner for the stop. If the cage is small, return with a go for a trial."

> Reading: The brief is honest about two gaps and says what will close them. It would be easy to read aloud in a meeting.

**Practice.** Draft the brief for your process in the fields provided, with the worked example visible above.

**Check (build the artefact).**

- Question: "Write the go or not-yet brief for one process you own. Each field has to be specific enough that a colleague could act on it."
- Fields: "Process and step", "What repeats and what varies", "What it cannot do, and what is only claimed", "The exception that decides the case", "Who owns the stop", "Decision and what would change it".
- Feedback for missing parts, shown in full sentences: "Your decision field does not start with go or not yet. Start it with one of those words." "Your exception field does not say how often it happens. Add a frequency or write not yet measured." "Your exception field does not say who handles it today. Name the role or team." "Your decision field does not say what would change it. Add the one piece of evidence or the one action that would move it." "The owner of the stop is blank. Name a role, or write not yet named so the gap is visible."
- Right feedback: "Your brief names the step, separates what repeats from what varies, states a limit, names the deciding exception with its handler, names who owns the stop or says it is not yet named, and ends with a decision and what would change it. A colleague could act on this."

### The artefact and the record

The learner produces the go or not-yet brief. After every check has passed, the learner signs their name against it. The record shows the person's name, the course title "Robotics for Non-Engineers", the date signed, the six fields of the brief exactly as written, and the public reference. The record states: "This record shows the brief the named person wrote in this course. It is not a feasibility study, an engineering assessment, or a safety assessment."

### How learning is validated

The brief passes only when all of these are true: the decision field begins with "Go" or "Not yet"; the repeat and vary field contains at least one step of each kind; the exception field names an exception, gives a frequency or the words "not yet measured", and names who handles it; the owner of the stop is a role or the words "not yet named"; and the decision field contains a reason and a condition that would change it. A long brief that is missing any of these parts does not pass. Failed attempts are stored on the purchase and are not shown to a verifier.

### Sources and reading

- International Federation of Robotics, *World Robotics* reports and the public summaries on the IFR website, for the common applications of industrial robots.
- UK Health and Safety Executive, web guidance on industrial robots and on the Provision and Use of Work Equipment Regulations 1998, for why the space around a robot has to be made safe.
- ISO 10218-1 and ISO 10218-2, *Robotics: Safety requirements for industrial robots*, named so the learner knows these standards exist and that an integrator will work to them.
- Mike Rother and John Shook, *Learning to See* (Lean Enterprise Institute), for describing a process step by step before changing it.
- Manufacturer application pages from major robot makers such as ABB, FANUC, KUKA, and Universal Robots, read as descriptions of what those machines are designed to do, and treated as claims until shown on your parts.

---

## 2. Collaborative Robots at Work

**Slug:** `collaborative-robots-at-work`

**Catalogue:** 2 hours, £99. Promise: "Start, stop, and recover, plus a handover the next shift can trust." Modules: What it is for, Three drills, When to call a person, The handover.

### Who it is for

This course is for operators, team leaders, and technicians who work alongside a collaborative robot, often called a cobot, or who are about to. They must already have completed their site induction, and they must have been shown their own robot by someone their employer has authorised. The course teaches the shape of good starting, stopping, recovering, and handing over. It does not replace the manufacturer's training or the site's written procedure, and it does not authorise anyone to operate a robot. Where the site procedure differs from this course, the site procedure is the one to follow.

### Outcome

When you finish, you can explain what your cobot application is for and what makes it safe to work near, carry out a start, a stop, and a recovery in the right order and say why each step is there, recognise the conditions under which you stop recovering and call a person, and write a shift handover note that tells the next shift the state of the robot, what stopped it, what you did, and what they must watch.

### Learning objectives

1. Explain the difference between the collaborative robot arm and the collaborative application it is part of.
2. Put the steps of a start and a recovery in order and give the reason for each step.
3. Choose the right stop for a situation, telling an emergency stop from a pause.
4. Decide whether a problem is one to recover yourself or one to call a person for.
5. Write a handover note the next shift can act on without finding you.

### Lessons

#### Lesson 1: What a cobot is for

- **Id:** `what-it-is-for`
- **Place:** This is the first lesson and the first module. It sets out what the word collaborative really means before any drill is taught.

**Core idea.** A collaborative robot is an arm designed so that it can work in a shared space with people under certain conditions, usually because it limits its own speed and the force it can apply, and because it stops when it meets unexpected resistance. The international technical specification ISO/TS 15066 describes these kinds of collaborative operation, and the robot standards ISO 10218-1 and ISO 10218-2 set the wider requirements. The important idea is that "collaborative" describes the whole application, not just the arm. An arm that is gentle on its own can still be dangerous when it carries a knife, a hot part, a sharp sheet, or a heavy load, or when it moves near someone's face. So a cobot is not safe because it is called a cobot. It is made safe for a particular task by the way the whole task has been designed, assessed, and set up. In this course, a statement is "About the arm" when it describes the robot on its own, and "About the whole task" when it describes the robot together with its tool, its part, its speed, and the people near it.

**Worked example.** A team leader explains a new cobot to her shift.

> Input: "This robot has force limiting built in. It is set to a slower speed when you are in the loading area. It carries a screwdriver bit that could hurt an eye. The risk assessment says nobody leans over the fixture while it is driving screws."

> Output, marked: "This robot has force limiting built in" is about the arm. "It is set to a slower speed when you are in the loading area" is about the whole task. "It carries a screwdriver bit that could hurt an eye" is about the whole task. "The risk assessment says nobody leans over the fixture while it is driving screws" is about the whole task.

> Reading: Only one sentence is about the arm on its own, and it is the one people remember. The other three are what actually protect the operator, and they belong to the application that was designed around this arm.

**Practice.** Write three sentences about the cobot you work with or expect to work with. Mark each one "About the arm" or "About the whole task". If all three are about the arm, write a fourth about the tool or the part it carries.

**Check.**

- Question: "A new starter has been told these things about a cobot that packs glass jars into cases. Mark each sentence with About the arm or About the whole task."
- Controls on each sentence: "About the arm" and "About the whole task".
- Sentences, correct answers, and feedback:
  1. "The robot stops if it meets unexpected resistance." Correct: "About the arm". Right: "Yes. This describes a feature of the robot on its own." Wrong: "This sentence describes the robot's own behaviour, with no mention of the tool, the part, or the people. That is about the arm."
  2. "A broken jar in the gripper could cut someone, so the case area is behind a clear screen." Correct: "About the whole task". Right: "Yes. The hazard comes from the part, and the protection was designed for this task." Wrong: "The danger here is the broken glass, and the screen was added for this job. That is about the whole task, not the arm."
  3. "The robot runs more slowly when the scanner sees a person near the case erector." Correct: "About the whole task". Right: "Yes. The scanner, the zone, and the slower speed were set up for this application." Wrong: "The scanner and the slower speed were configured for this layout and this task. That makes it about the whole task."
  4. "The robot can lift up to its rated payload." Correct: "About the arm". Right: "Yes. The rated payload is a property of the arm." Wrong: "This is a figure from the arm's specification, with nothing about this job. That is about the arm."
- Pass reason: "You separated what the arm does by itself from what makes this particular task safe to work near."

**Bridge.** Knowing what the application is for, you are ready for the first of three drills, which is starting it properly.

#### Lesson 2: Drill one, the start

- **Id:** `start-drill`
- **Place:** This is the first of the three drills in the second module.

**Core idea.** A start is the short routine between arriving at the robot and letting it run on its own. Its purpose is to make sure that the robot, the space, and the job are what you think they are before anything moves. A good start has five steps in this order: read the last handover; look at the space and clear anything that should not be there; check the tool and the part are the right ones and fitted properly; confirm on the pendant or screen that the correct robot program is selected; then start and watch the first full cycle before stepping away. The order matters because each step protects the next one. Starting before you have read the handover means you may miss a warning from the last shift. Watching the first cycle is not optional politeness. It is where you find out whether the robot is doing what the program says on today's parts. A start is not the same as switching on, and it is not a place to change settings. If a setting looks wrong, that is a reason to stop and ask.

**Worked example.** An operator describes his start on a machine-tending cobot.

> Input: "I switched it on, pressed start, and while it was running I read the handover. The handover said the gripper fingers had been changed at 4 a.m. and needed watching."

> Output: The same operator, the next day: "I read the handover first. It said the gripper fingers had been changed. I cleared a box someone had left in the reach of the arm, checked the new fingers were tight, confirmed the program for part 2210 was selected, started the robot, and watched the first cycle. The part seated correctly, so I moved on to the next machine."

> Reading: On the first day the warning arrived after the robot was already running on new fingers. On the second day every step came before the next one needed it. Nothing dramatic happened on the first day, which is exactly why the order is easy to lose.

**Practice.** Write your own start as five short sentences in the order you actually do it. Compare them with the five steps in the lesson and note any step your site adds.

**Check.**

- Question: "Put these steps for starting a cobot at the beginning of a shift in the order this lesson taught."
- Control: an ordering list with these items: "Read the last handover.", "Look at the space and clear anything that should not be there.", "Check the tool and the part are the right ones and fitted properly.", "Confirm the correct program is selected on the pendant.", "Start the robot and watch the first full cycle."
- Correct order: as listed above.
- Right feedback: "Yes. You read the handover before anything else, you made the space and the tool right before choosing the program, and you watched the first cycle before walking away."
- Wrong feedback when the handover is not first: "The handover is not first in your order. If you start before reading it, you can miss a warning the last shift left for you. Move it to the top."
- Wrong feedback when starting comes before confirming the program: "In your order the robot starts before you have confirmed the program. Confirm what it is about to run before it runs."
- Wrong feedback when the space check comes after starting: "In your order the robot moves before the space has been cleared. Clear the space first so nothing is in its reach when it starts."
- Wrong feedback for any other misordering: "Look again at which step protects the next one. Each step in the start makes the following step safe to do."
- Pass reason: "Your start makes sure the robot, the space, and the job are what you think they are before anything moves."

**Bridge.** Once a robot is running you need to know how to stop it, and the next drill teaches which stop to use.

#### Lesson 3: Drill two, the stop

- **Id:** `stop-drill`
- **Place:** This is the second drill. It separates two kinds of stop that people often treat as the same.

**Core idea.** There is more than one way to stop a robot, and they are for different situations. An "emergency stop" is the red mushroom-headed button, on the pendant and often elsewhere. It is for danger to a person or serious damage, and it is designed to stop the robot quickly and hold it stopped until someone deliberately resets it. Its behaviour is set by the machine's design, following standards such as ISO 13850 and IEC 60204-1. A "pause at the pendant" is the normal stop or pause control on the robot's screen. It is for ordinary reasons such as reloading parts or adjusting a tray when the site procedure allows it, and it lets the robot resume in a controlled way. There is also a protective stop that the robot or its safeguards trigger on their own, for example when the arm meets unexpected resistance, which you will meet in the recovery drill. The emergency stop is not a convenient off switch, because using it for routine stops can wear the system, can leave the robot in an awkward position, and teaches everyone that the red button is ordinary. A pause is not a safety measure against danger, because it relies on the software behaving normally.

**Worked example.** A supervisor reviews two stops from the same week.

> Input: "On Tuesday an operator pressed the emergency stop to reload the part tray, which happens every hour. On Thursday the arm moved towards a colleague's hand during an unexpected motion and the operator paused it at the pendant, which took a few seconds to find."

> Output: "Tuesday should have been a pause at the pendant, because reloading is a routine reason. Thursday should have been the emergency stop, because a person was in danger."

> Reading: The two stops were used the wrong way round. Both operators were trying to be careful. The lesson is to link the stop to the situation, not to how serious it feels at the moment.

**Practice.** Write three situations from your own work that need a stop. For each, write which stop you would use and one sentence saying why.

**Check.**

- Question: "For each situation at a cobot that places labels on boxes, mark which stop you would use."
- Controls on each situation: "Emergency stop" and "Pause at the pendant".
- Situations, correct answers, and feedback:
  1. "The label roll is running out and the procedure says to stop the robot before changing it." Correct: "Pause at the pendant". Right: "Yes. Changing a label roll is a routine reason, so you pause the robot at the pendant." Wrong: "Changing a roll is routine, and nobody is in danger. The emergency stop is for danger to a person or serious damage. Use the pause at the pendant."
  2. "A colleague's sleeve has caught on the gripper and the arm is still moving." Correct: "Emergency stop". Right: "Yes. A person is in danger, so you use the emergency stop." Wrong: "A person is in danger here. A pause relies on the software behaving normally, and you need the stop that is designed for danger. Use the emergency stop."
  3. "You need to straighten a box on the conveyor and the procedure allows you to do it with the robot paused." Correct: "Pause at the pendant". Right: "Yes. The procedure allows this with the robot paused, and it is routine." Wrong: "This is a routine adjustment that the procedure allows with a pause. The emergency stop is not an ordinary off switch."
  4. "The arm starts moving along a path you have never seen it take, towards where people walk." Correct: "Emergency stop". Right: "Yes. Unexpected motion towards people is danger, so you use the emergency stop." Wrong: "Unexpected motion towards people is a danger. You cannot rely on the software that is misbehaving to pause it. Use the emergency stop."
- Pass reason: "You matched each stop to the situation, keeping the emergency stop for danger and the pause for routine reasons."

**Bridge.** After a stop comes the question of getting going again safely, which is the third drill.

#### Lesson 4: Drill three, the recovery

- **Id:** `recover-drill`
- **Place:** This is the third drill and completes the second module.

**Core idea.** A recovery is what you do after the robot has stopped for a reason other than a routine pause, most often a protective stop triggered by a collision, a gripper that lost its part, or a safeguard. The aim is to understand why it stopped before it moves again. A good recovery has five steps in this order: find out why it stopped, by reading the message and looking at the robot and the part; clear the cause, for example by removing the dropped part; check that nobody and nothing is in the path the robot will take; acknowledge or reset the stop on the pendant as the procedure says; then resume and watch at least one full cycle. The most common mistake is to reset first and look afterwards, which often means the robot stops again for the same reason or, worse, moves while the cause is still there. A recovery is not a repair. If clearing the cause would mean changing the program, the safety settings, or the tooling, it is no longer a recovery.

**Worked example.** An operator writes up a recovery on a cobot that loads a test rig.

> Input: "Protective stop at 10:15. I pressed reset straight away and it stopped again. I pressed reset again and it stopped again."

> Output, the same event done properly: "Protective stop at 10:15. The message said a collision had been detected. The part was sitting half out of the rig fixture. I removed it, checked there was nothing else in the fixture and nobody near the arm, acknowledged the stop, resumed, and watched the next cycle seat correctly."

> Reading: In the first version the operator reset twice without finding the cause, so the robot repeated the same collision. In the second, the cause was found and removed before the reset. Resetting without looking is a guess.

**Practice.** Think of the last time a robot you work with stopped unexpectedly. Write down what you did, then rewrite it in the five steps above.

**Check.**

- Question: "A cobot has stopped with a message saying the gripper lost the part. Put these recovery steps in the order this lesson taught."
- Control: an ordering list with: "Read the message and look at the gripper and the part to find out why it stopped.", "Remove the dropped part.", "Check that nobody and nothing is in the robot's path.", "Acknowledge the stop on the pendant.", "Resume and watch a full cycle."
- Correct order: as listed above.
- Right feedback: "Yes. You found the cause, cleared it, checked the path, and only then acknowledged the stop and resumed while watching."
- Wrong feedback when acknowledging comes before finding the cause: "In your order you acknowledge the stop before finding out why it happened. That is the reset-first mistake from the worked example. Find the cause first."
- Wrong feedback when resuming comes before checking the path: "In your order the robot resumes before you have checked its path. Make sure nobody and nothing is in the way before it moves."
- Wrong feedback for any other misordering: "Look again at the reason for each step. You cannot clear a cause you have not found, and you should not reset a stop while the cause is still there."
- Pass reason: "Your recovery finds and clears the cause before the robot moves again."

**Bridge.** Some stops are not yours to recover, and the next lesson teaches you to recognise them.

#### Lesson 5: When to call a person

- **Id:** `when-to-call-a-person`
- **Place:** This is the third module. It draws the line around what you recover yourself.

**Core idea.** You recover a stop yourself when the cause is ordinary, visible, and cleared without changing anything about how the robot is set up, and when it has not happened repeatedly. You call a person, meaning your supervisor, the robot's responsible engineer, or whoever your site names, when any of these is true: the same stop keeps happening; clearing the cause would need a change to the program, the safety settings, the tool, or the guarding; anyone has been hurt or nearly hurt; the robot moved in a way you did not expect; there is visible damage to the robot, its cables, or its tool; or you do not understand the message. Calling a person is not a failure or an admission that you could not cope. It is the part of the job that keeps small problems from being hidden. In this course, the two labels are "Recover it myself" and "Call a person".

**Worked example.** A cell leader reads three notes from one night shift.

> Input: "A part fell out of the gripper at 01:10, I picked it up and resumed. The same thing happened at 01:40, 02:05, and 02:30, and I recovered each time. At 03:00 I noticed the gripper cable was rubbing on the fixture."

> Output: "The first dropped part was mine to recover. By the third, the stop was repeating and should have been called in. The rubbing cable is damage and should have been called in as soon as it was seen."

> Reading: Each recovery on its own was done correctly. The pattern is what mattered, and the pattern was a sign that something about the setup had changed.

**Practice.** List four stops or problems you have seen or can imagine at your robot. Mark each with "Recover it myself" or "Call a person" and write the reason from the lesson.

**Check.**

- Question: "For each problem at a cobot that tends a CNC machine, mark whether you would recover it yourself or call a person."
- Controls: "Recover it myself" and "Call a person".
- Problems, correct answers, and feedback:
  1. "A protective stop because a swarf chip was stuck on the part. You can see the chip and remove it with the brush provided." Correct: "Recover it myself". Right: "Yes. The cause is ordinary, visible, and cleared without changing any setup." Wrong: "The cause is visible and you can clear it with the brush, without changing anything. This is one to recover yourself, unless it keeps happening."
  2. "The part is not seating in the chuck and the only fix would be to change the robot's position in the program." Correct: "Call a person". Right: "Yes. Changing the program is not a recovery, so you call a person." Wrong: "Clearing this would mean changing the program. That is outside a recovery. Call a person."
  3. "The arm brushed your forearm harder than usual when you reached in during a pause." Correct: "Call a person". Right: "Yes. A person was nearly hurt, so this is called in." Wrong: "Contact that was harder than usual is a near miss. Anything that hurts or nearly hurts someone is called in."
  4. "The message on the pendant is one you have never seen and do not understand." Correct: "Call a person". Right: "Yes. If you do not understand the message, you do not know the cause, so you call a person." Wrong: "You cannot clear a cause you do not understand. When the message is unfamiliar, call a person."
- Pass reason: "You kept to yourself only the stops that are ordinary, visible, and cleared without changing the setup."

**Bridge.** Everything you started, stopped, recovered, and called in this shift now has to reach the next shift, which is the handover.

#### Lesson 6: The handover

- **Id:** `the-handover`
- **Place:** This is the final lesson and the fourth module. You write the artefact.

**Core idea.** A handover note is the written account of the robot's state that the next shift reads first, as lesson 2 taught. It has four parts: the state of the robot at handover, which program is running and whether anything is not normal; the stops during the shift and what caused each one; what you recovered and what you called in, with who you called; and what the next shift must watch. The UK Health and Safety Executive's human factors guidance treats shift handover as safety-critical communication, because much of what goes wrong between shifts is a message that was never passed on. A handover is not "all fine" unless everything really was, and it is not a diary of your shift. It is the few facts the next person needs in order to start well.

**Worked example.** Two notes from the same shift.

> Input, note one: "Robot OK. Few stops. Watch it."

> Input, note two: "State: running part 2210 program, normal cycle. Stops: four protective stops between 01:10 and 02:30, all dropped parts. Recovered the first two myself. Called Priya, shift engineer, at 02:35 because they kept repeating. She found the gripper cable rubbing on the fixture and re-routed it. Watch: the gripper cable at the fixture, and any dropped part, which should now be rare."

> Reading: Note one tells the next shift nothing they can act on. Note two tells them what ran, what happened, who knows about it, and exactly where to look.

**Practice.** Using your own last shift, or the night shift from lesson 5, draft a handover in the four parts.

**Check (build the artefact).**

- Question: "Write a handover note for a real or recent shift at the cobot you work with. Each part has to tell the next shift something they can act on."
- Fields: "State of the robot at handover", "Stops this shift and their causes", "What I recovered and what I called in", "What the next shift must watch".
- Feedback for missing parts: "Your state field does not say which program is running or whether anything is not normal. Add both." "Your stops field lists stops without causes. Add the cause of each stop, or say the cause is unknown." "Your called-in field says you called someone but not who. Name the person or role." "Your watch field is empty or says only watch it. Name the part of the robot or the task to watch and why." "If there were no stops, write no stops this shift so the next shift knows you checked."
- Right feedback: "Your handover gives the state, the stops and their causes, what you did and who you called, and where the next shift should look. They could start from this without finding you."

### The artefact and the record

The learner produces a handover note. After every check has passed, they sign their name against it. The record shows the person's name, the course title "Collaborative Robots at Work", the date signed, the four parts of the handover note as written, and the public reference. The record states: "This record shows the handover note the named person wrote in this course. It does not authorise the person to operate any robot, and it is not a record of training under any regulation or standard."

### How learning is validated

The handover passes when the state field names a program or a task and says whether anything is not normal; the stops field gives a cause or "cause unknown" for each stop it lists, or says "no stops this shift"; the recovered and called-in field distinguishes the two and names who was called if anyone was; and the watch field names a specific part of the robot, the tool, or the task. A note of any length that says only "fine" or "watch it" does not pass.

### Sources and reading

- ISO/TS 15066, *Robots and robotic devices: Collaborative robots*, for the types of collaborative operation and the idea that the application is assessed as a whole.
- ISO 10218-1 and ISO 10218-2, the safety standards for industrial robots and robot systems.
- ISO 13850, *Safety of machinery: Emergency stop function*, and IEC 60204-1, *Safety of machinery: Electrical equipment of machines*, for how emergency stops are designed.
- UK Health and Safety Executive, human factors guidance on safety-critical communication and shift handover.
- UK Health and Safety Executive, guidance on the Provision and Use of Work Equipment Regulations 1998, including the Approved Code of Practice L22.
- The user manual and safety manual for your own robot, for example the Universal Robots user manual or the equivalent from your manufacturer, which is the authority on how your controls behave.

---

## 3. Where a Robot Belongs in the Process

**Slug:** `where-a-robot-belongs-in-the-process`

**Catalogue:** 2.5 hours, £129. Promise: "A process marked task by task, and a recommendation you could defend." Modules: The tasks, Robot, person, or not yet, The easy step that is not, The recommendation.

### Who it is for

This course is for process owners, operations and continuous improvement engineers, and production managers who need to decide where in a process automation should go. They must already know the process they will work on and be able to observe it or talk to the people who do it. A basic familiarity with process mapping helps but is not required, and the first lesson teaches what is needed. The course assumes a general idea of what robots do, at the level of the course Robotics for Non-Engineers, but does not require that course.

### Outcome

When you finish, you can break one process into tasks, record four facts about each task, mark each one as robot, person, or not yet with a reason, point out the step that looks easy for a machine but is not, describe what automating one task does to the tasks around it, and write a recommendation that a colleague could challenge and that you could defend with the facts on the page.

### Learning objectives

1. Break a process into tasks, each with one action on one object, a start, and an end.
2. Record the four facts about a task: how often, how much it varies, how the part arrives, and what judgement it needs.
3. Mark each task as robot, person, or not yet, and give the reason in terms of those four facts.
4. Identify a step that is easy for a person and hard for a robot, and say what makes it hard.
5. Write a recommendation that names the task to automate, the knock-on effect on its neighbours, and the evidence still needed.

### Lessons

#### Lesson 1: Split the process into tasks

- **Id:** `split-into-tasks`
- **Place:** This is the first lesson and the first module. Everything later in the course is marked against the task list you make here.

**Core idea.** A task, in this course, is one action on one object, with a clear start and a clear end, such as "lift the housing from the tray and place it in the fixture". A task is not a department, a job title, or a stage like "assembly", because those contain many tasks with very different characteristics, and a robot can only take one task at a time. A good task list is written from what you see people do, not from the procedure document, because the procedure often leaves out the small acts that keep the work going. You know a task list is at the right level when each line could be timed with a stopwatch and when two observers would agree on where it starts and ends. Mapping methods from lean practice, such as those in *Learning to See* by Mike Rother and John Shook, are useful here, but you need only a plain numbered list.

**Worked example.** A production engineer at a small electronics assembler is asked where a robot could go.

> Input, first attempt: "1. Kitting. 2. Assembly. 3. Test. 4. Packing."

> Output, after watching the line for an hour: "1. Pick circuit board from rack. 2. Place board in test fixture. 3. Close fixture and press start. 4. Read pass or fail on screen. 5. Remove board. 6. If pass, place in outgoing tray. If fail, place in red bin and write the fault on a tag."

> Reading: The first list names stages, and nobody could say which one a robot should take. The second list, which covers only the test stage, already shows that tasks 1, 2, and 5 look similar, that task 4 involves reading, and that task 6 splits into two very different actions.

**Practice.** Choose one stage of a process you own. Watch it, or ask someone who does it to talk you through it, and write it as a numbered task list with one action on one object per line.

**Check.**

- Question: "Two engineers have written task lists for the same bottling line changeover. Choose the task list at the level this lesson taught."
- Controls: "List A" and "List B".
- List A: "1. Stop the line. 2. Changeover. 3. Restart and check."
- List B: "1. Stop the filler at the operator panel. 2. Remove the bottle guide rails for the old size. 3. Fit the guide rails for the new size. 4. Select the new recipe on the panel. 5. Run ten bottles and check fill height."
- Correct: "List B".
- Right feedback: "Yes. Each line in List B is one action on one object with a clear start and end. You could time each line."
- Wrong feedback: "List A names stages. Changeover contains several tasks with very different characteristics, so you could not mark it as a single task. Choose the list where each line is one action on one object."
- Pass reason: "You chose the list you could time line by line, which is the level at which a task can be judged."

**Bridge.** A list of tasks is only the start, and the next lesson gives each task the four facts you need to judge it.

#### Lesson 2: Four facts about each task

- **Id:** `four-facts`
- **Place:** This lesson finishes the first module by adding evidence to the task list.

**Core idea.** Every task on your list needs four facts before it can be judged. "How often" is how many times it happens in a shift or a day. "How much it varies" is whether the part, the product, or the action changes, and how often. "How the part arrives" is whether it comes in a known place and orientation, such as a fixture or a tray, or loose, stacked, or tangled. "What judgement it needs" is whether a person is deciding something, such as whether a part looks right or what to do next. These four facts are observations, not opinions, and where you do not know one, you write "not yet measured" rather than guessing. A task with all four facts can be argued about sensibly. A task with only an opinion, such as "this is boring" or "this is easy", cannot.

**Worked example.** The electronics engineer adds the four facts to task 2 from lesson 1.

> Input: "Place board in test fixture."

> Output: "How often: about 400 times a shift. How much it varies: two board types, changed about once a week. How the part arrives: in a rack, one board per slot, same orientation. What judgement it needs: none, the fixture only accepts the board one way."

> Reading: The shift count is the engineer's own figure for this example. With these four facts, the task starts to look like a strong candidate, and anybody who disagrees has something specific to disagree with.

**Practice.** Add the four facts to at least three tasks on your own list. Write "not yet measured" for any fact you do not know.

**Check.**

- Question: "This task record from a pharmacy warehouse is missing one of the four facts. Edit the record so all four facts are present."
- Control: an editable record: "Task: place filled prescription bag into the delivery crate for its route. How often: about 900 times a day. How much it varies: bag size varies from small to large, route changes each bag. What judgement it needs: the packer reads the route label and chooses the crate."
- What must be added: "How the part arrives", with a description such as "bags arrive loose in a chute, in any orientation" or "not yet measured".
- Feedback when missing: "The record still has no line for how the part arrives. Add how the bags are presented to the packer, or write not yet measured."
- Feedback when the added line is an opinion rather than an observation, detected when the line contains only words such as easy, hard, simple, or difficult: "Your new line gives an opinion about how hard the task is. Describe how the bag actually arrives: where it is, and in what position."
- Right feedback: "Yes. The record now has all four facts, so the task can be judged on evidence."
- Validation: the edited record must contain a line beginning "How the part arrives" with content that is either a description of position or presentation or the phrase "not yet measured".

**Bridge.** With four facts on each task, you can now mark each one, which is the next lesson.

#### Lesson 3: Robot, person, or not yet

- **Id:** `robot-person-or-not-yet`
- **Place:** This is the second module. It turns facts into a mark on every task.

**Core idea.** Each task receives one of three marks. "Robot" means the task happens often, varies little, arrives in a known place and orientation, and needs no judgement, so a robot could reasonably take it as the process stands. "Person" means the task needs judgement, varies a great deal, or happens too rarely to justify automation, so a person should keep it. "Not yet" means the task could be a robot task if something else changed first, most often the way the part arrives, and it names what would have to change. The mark is a claim about this task in this process today, not a permanent judgement about the task in general. A mark without a reason is not acceptable in this course, and the reason must refer to one or more of the four facts.

**Worked example.** The pharmacy warehouse manager marks three tasks.

> Input: "Task A: seal filled bags. 900 a day, one bag type, bags arrive on a conveyor upright, no judgement. Task B: check the medicine against the prescription. 900 a day, every prescription different, a pharmacist decides. Task C: place bags into route crates. 900 a day, bags arrive loose in a chute, route label read by the packer."

> Output: "Task A: Robot, because it is frequent, uniform, presented upright, and needs no judgement. Task B: Person, because it needs a pharmacist's judgement on every item. Task C: Not yet, because the bags arrive loose. It could become a robot task if bags arrived one at a time in a fixed position with a scannable route label."

> Reading: Task C is the interesting one. It is not a no. It is a clear statement of what would need to change upstream, which is often a cheaper change than the robot itself.

**Practice.** Mark every task on your own list with "Robot", "Person", or "Not yet" and write one sentence of reason for each, using the four facts.

**Check.**

- Question: "Here are four tasks from a bakery's packing area, with their four facts. Mark each task as Robot, Person, or Not yet."
- Controls: "Robot", "Person", and "Not yet".
- Tasks, correct answers, and feedback:
  1. "Place sealed bread bags into trays. 3,000 a shift, one bag size per run, bags arrive single file on a conveyor, no judgement." Correct: "Robot". Right: "Yes. It is frequent, uniform, presented in a known way, and needs no judgement." Wrong: "All four facts point the same way: frequent, uniform, presented single file, no judgement. That is a robot task as the process stands."
  2. "Decorate celebration cakes to a customer's written instructions. About twenty a day, every design different." Correct: "Person". Right: "Yes. Every cake is different and needs judgement, so a person keeps it." Wrong: "Every cake is different and the decorator is interpreting instructions. That needs judgement, so it stays with a person."
  3. "Pick rolls from a heap on the cooling rack into bags of six. 2,000 a shift, rolls arrive piled and touching." Correct: "Not yet". Right: "Yes. The rolls arrive piled, which a robot handles poorly. If they arrived spaced in rows, the task could become a robot task." Wrong: "The volume and uniformity are there, but the rolls arrive in a heap. Look at how the part arrives. That is what would need to change first, which makes it not yet."
  4. "Swap the slicer blade when it dulls. About once a fortnight, needs a trained engineer." Correct: "Person". Right: "Yes. It is rare and needs a trained judgement, so it stays with a person." Wrong: "This happens about once a fortnight and needs trained judgement. It is neither frequent nor free of judgement, so it stays with a person."
- Pass reason: "You gave each task the mark its four facts support, and you used not yet where the way the part arrives is what stands in the way."

**Bridge.** Some tasks look like robot tasks until you watch closely, and the next lesson is about those.

#### Lesson 4: The easy step that is not

- **Id:** `the-easy-step-that-is-not`
- **Place:** This is the third module. It protects the recommendation from the most common mistake.

**Core idea.** Some tasks are easy for a person and hard for a robot, and they are easy to mismark because they look so simple. Typical examples are picking one item from a bin of tangled or overlapping items, handling anything soft or flexible such as bags, cables, and fabric, reading handwriting or damaged labels, and noticing in passing that something is wrong. The last one is the most often missed. A person who places a part in a fixture is also, without being asked, looking at it, and they will put aside a cracked part even though no procedure says to. When the task moves to a robot, that noticing disappears unless someone designs it back in. So the easy step that is not is a step where a person does hidden work that the task list does not show. It is not a step that is merely tiring, and it is not a step that the supplier has said is difficult.

**Worked example.** A furniture manufacturer is looking at the step "place the cushion into the polythene bag".

> Input: "The packer takes a cushion from the stack, opens a bag, slides the cushion in, and folds the end. 600 a shift. No judgement listed."

> Output: "The step looks like a robot task on volume, but the cushion is soft and deforms, the bag is flexible and has to be opened, and the packer also looks at each cushion and puts aside any with loose stitching, which is not on the list. This is an easy step that is not."

> Reading: The task list was accurate as far as it went. Watching the packer revealed two handling problems and one piece of hidden inspection. Any recommendation that marked this step Robot would have lost the inspection without anybody deciding to lose it.

**Practice.** Look at every task you marked "Robot". For each, watch or ask about it once more and write down anything the person does that is not on the list, especially any noticing or putting aside.

**Check.**

- Question: "Two assessments have been written of the step 'place the cable harness into the box'. Choose the assessment that finds the easy step that is not."
- Controls: "Assessment A" and "Assessment B".
- Assessment A: "Robot. The step happens 500 times a shift and the box is always in the same place, so it meets the conditions."
- Assessment B: "Not yet. The box is in a fixed place, but the harness is flexible and tangles, and the packer untangles any knotted harness and checks the connector clips are fitted, which is not on the task list."
- Correct: "Assessment B".
- Right feedback: "Yes. Assessment B finds the flexible part and the hidden check the packer does. Those are what make this easy step hard for a robot."
- Wrong feedback: "Assessment A looks only at where the box is. It misses that the harness is flexible and that the packer checks the clips. Look again for hidden work the person is doing."
- Pass reason: "You chose the assessment that looked for the hidden work, not only the visible motion."

**Bridge.** Automating a task changes the tasks around it, and the next lesson asks you to write down how.

#### Lesson 5: The knock-on effect

- **Id:** `the-knock-on-effect`
- **Place:** This lesson sits between the easy step and the recommendation. It widens the view from one task to its neighbours.

**Core idea.** When a robot takes a task, the tasks before and after it change. The task before usually has to present parts more consistently than a person ever needed, for example in a tray instead of a pile. The task after has to accept the robot's pace, which is steady but not flexible, so buffers and storage may be needed. Exceptions that the person handled quietly now arrive somewhere else, often at the next person in line or at a new reject bin that someone has to own. The person who did the task usually does different work, such as loading, clearing, and watching the robot, which is a real change and not simply their old job minus one task. The knock-on effect is not a reason to avoid automation. It is part of the cost and part of the design, and a recommendation that ignores it will be surprised by it later.

**Worked example.** The electronics engineer considers the knock-on effect of automating task 2, placing boards in the test fixture.

> Input: "Robot places boards in the fixture."

> Output: "Task before: boards must now arrive in racks in a consistent orientation, which they already do, but a damaged rack will now stop the robot. Task after: failed boards will still need a person to write the fault tag, so the tester operator becomes the person who handles fails and clears robot stops. Exceptions: bent pins, which the operator notices when placing, will now be found only by the tester."

> Reading: None of this stops the recommendation. It does mean the recommendation must include a rack check, a named person for fails and stops, and an honest note that bent pins will be caught later in the process.

**Practice.** For each task you marked "Robot", write one sentence about the task before, one about the task after, and one about where its exceptions will now go.

**Check.**

- Question: "A robot will take the task of placing jars into cases at a jam factory. Mark each sentence as Changes a neighbouring task or Stays within this task."
- Controls: "Changes a neighbouring task" and "Stays within this task".
- Sentences, correct answers, and feedback:
  1. "The labeller before the robot must now deliver jars upright and spaced, because the robot cannot pick jars that have fallen over." Correct: "Changes a neighbouring task". Right: "Yes. The task before now has a stricter job." Wrong: "This sentence is about the labeller, which is the task before. The robot has changed what that task must do."
  2. "The robot places six jars per case." Correct: "Stays within this task". Right: "Yes. This describes the robot's own task." Wrong: "This is about the robot's own action and nothing else. It stays within this task."
  3. "Chipped jars, which the packer used to put aside, will now go into cases and must be caught at the case check." Correct: "Changes a neighbouring task". Right: "Yes. The exception has moved to the case check, which now has more to do." Wrong: "The chipped jars used to be caught by the packer and will now arrive at the case check. That changes a neighbouring task."
  4. "The packer who did this task will now reload the case magazine and clear robot stops." Correct: "Changes a neighbouring task". Right: "Yes. The person's work has changed into new tasks around the robot." Wrong: "The packer now does new tasks around the robot. That is a knock-on change, not the robot's own task."
- Pass reason: "You saw where automating one task changes the work before it, after it, and for the person who used to do it."

**Bridge.** You now have everything the recommendation needs, and the last lesson asks you to write it.

#### Lesson 6: The recommendation

- **Id:** `the-recommendation`
- **Place:** This is the final lesson and the fourth module. You write the artefact.

**Core idea.** The recommendation is a short document that says where, if anywhere, a robot belongs in this process and why. It has five parts: the process and its task list with each task marked Robot, Person, or Not yet and a reason; the task you recommend, or a statement that no task should be automated yet; the easy step that is not, if there is one, and what makes it hard; the knock-on effect on the neighbouring tasks and on the person; and the evidence still needed before a commitment, such as a trial on your own parts or a measurement of exceptions. A recommendation you could defend is one where every claim can be traced back to a fact on the page. It is not a business case, and it does not need prices, although a later investment request should build on it.

**Worked example.** The electronics engineer's recommendation.

> Output: "Process: board test, six tasks. Tasks 1, 2, and 5 marked Robot because they are frequent, presented in racks, and need no judgement. Task 4 marked Person, because an operator reads the result. Task 6 marked Person, because failed boards need a written fault. Recommendation: automate tasks 1, 2, and 5 as one robot task. Easy step that is not: none found, but bent pins are currently noticed at task 2. Knock-on: racks must be checked for damage; the operator becomes responsible for fails and robot stops; bent pins will be caught by the tester instead. Evidence needed: a trial of 500 boards on our racks, and a count of bent pins over a month."

> Reading: Every line refers to a fact already gathered. A sceptical manager could disagree with a mark, but they would have to disagree with a specific fact to do it.

**Practice.** Draft your recommendation in the five fields with the example visible.

**Check (build the artefact).**

- Question: "Write the recommendation for one process you own. Each part has to be traceable to facts you gathered in this course."
- Fields: "Process and task list with marks and reasons", "The task I recommend", "The easy step that is not", "The knock-on effect", "Evidence still needed".
- Feedback for missing parts: "Some tasks in your list have a mark but no reason. Add a reason for each, using how often, how much it varies, how the part arrives, or what judgement it needs." "Your recommended task is not one of the tasks you marked Robot. Recommend a task marked Robot, or explain why a Not yet task should be tackled first." "Your easy step field is empty. Name one, or write none found and say what you checked." "Your knock-on field does not mention the person who did the task. Say what their work becomes." "Your evidence field is empty. Name at least one trial or measurement still needed."
- Right feedback: "Your recommendation marks every task with a reason, names the task to automate, looks for hidden work, describes the knock-on effect, and says what evidence is still missing. You could defend it."

### The artefact and the record

The learner produces a task-by-task recommendation. After every check has passed, they sign their name against it. The record shows the name, the course title "Where a Robot Belongs in the Process", the date signed, the five parts of the recommendation as written, and the public reference. The record states: "This record shows the recommendation the named person wrote in this course. It is not an engineering, safety, or financial approval."

### How learning is validated

The recommendation passes when every task in the list has one of the three marks and a reason that refers to at least one of the four facts; the recommended task is marked Robot, or the learner explicitly recommends that nothing is automated yet; the easy step field names a step or says "none found" with what was checked; the knock-on field refers to at least one neighbouring task and to the person whose work changes; and the evidence field names at least one trial or measurement. Length alone never passes the check.

### Sources and reading

- Mike Rother and John Shook, *Learning to See* (Lean Enterprise Institute), for observing and mapping a process before changing it.
- James P. Womack and Daniel T. Jones, *Lean Thinking*, for thinking about flow between tasks rather than tasks in isolation.
- International Federation of Robotics, *World Robotics* reports, for the kinds of task in which industrial robots are commonly used.
- UK Health and Safety Executive, guidance on manual handling and the Manual Handling Operations Regulations 1992, for understanding why some tasks are chosen for automation on ergonomic grounds.
- Manufacturer application notes from robot and gripper makers, read as descriptions of the conditions under which an application has worked.

---

## 4. Preparing a Team for Automation

**Slug:** `preparing-a-team-for-automation`

**Catalogue:** 2 hours, £99. Promise: "Who is affected, what they must be able to do, and what you will not pretend." Modules: Who is affected, What they must do, What stops, The preparation brief.

### Who it is for

This course is for team leaders, operations managers, and HR or learning partners who are responsible for people whose work will change when a robot or other automation is introduced. They must already know which automation is coming, roughly when, and which process it touches. They do not need technical knowledge of the equipment. The course does not give legal advice. Where a change could affect people's jobs, terms, or numbers, the course tells the learner to involve HR and to take advice on consultation duties, and it names the relevant public guidance.

### Outcome

When you finish, you can list everyone affected by a specific automation, directly and indirectly, write what each group must be able to do in terms you could watch them do, state plainly which tasks and routines will stop, write a message to the team that separates what is decided from what is not, and put all of this into a preparation brief that a colleague could use to run the change without you.

### Learning objectives

1. List the people directly and indirectly affected by a specific automation.
2. Write capability statements that describe something you could watch a person do.
3. Name the tasks and routines that will stop, without softening them into something vaguer.
4. Write a team message that says what is decided, what is not, and when people will know.
5. Produce a preparation brief with owners and dates for the first weeks.

### Lessons

#### Lesson 1: Who is affected

- **Id:** `who-is-affected`
- **Place:** This is the first lesson and the first module. It makes the list of people that the rest of the brief serves.

**Core idea.** People are "directly affected" when the tasks they do each day will change, for example the operators who will load, watch, and recover the robot, or the packers whose task it takes. People are "indirectly affected" when their work changes because of the automation but they do not work at it, for example maintenance technicians who must now look after it, schedulers whose planning must fit its pace, the team upstream who must present parts differently, quality inspectors who meet different defects, and the night shift who inherit what the day shift started. Managers often list only the first group because they are the people standing next to the machine. Leaving out the second group is how a well-run introduction still produces a maintenance team that was never trained and a scheduler who finds out on the day. There is also a third fact to record: people who believe they are affected, even when they are not. Their belief is real and needs an answer, even though they do not appear on the list of changed tasks.

**Worked example.** A distribution centre manager is preparing for autonomous mobile robots, which will carry totes from picking to packing.

> Input, first list: "The pickers who currently push trolleys to packing."

> Output, after walking the flow: "Directly affected: pickers, who will place totes on robots instead of pushing trolleys; packers, who will receive totes from robots. Indirectly affected: the engineering team, who will maintain the robots and chargers; the shift planners, whose labour plans change; the cleaning contractor, whose routes must avoid robot paths; the night shift, who will start the system at the beginning of a shift. People who believe they are affected: the forklift drivers, whose work does not change but who have asked whether it will."

> Reading: The first list was one group. The second has seven, and the forklift drivers are on it because their question deserves an answer, not because their tasks change.

**Practice.** Write the list for your own automation under the three headings, with at least one entry under indirectly affected.

**Check.**

- Question: "A food factory is introducing a robot palletiser at the end of line 3. Mark each group as Directly affected or Indirectly affected."
- Controls: "Directly affected" and "Indirectly affected".
- Groups, correct answers, and feedback:
  1. "The line 3 end-of-line packers who currently stack cases onto pallets." Correct: "Directly affected". Right: "Yes. The task they do each day will change." Wrong: "These packers do the task the robot will take. Their daily work changes directly."
  2. "The maintenance technicians on days and nights." Correct: "Indirectly affected". Right: "Yes. They do not work at the palletiser, but they will have to maintain it." Wrong: "They do not stack pallets, but they will now maintain the robot. Their work changes because of the automation, which is what indirectly affected means."
  3. "The forklift drivers who collect finished pallets, who will now collect them from a new pick-up point with a different pattern." Correct: "Indirectly affected". Right: "Yes. Their collection point and routine change, though they do not work at the robot." Wrong: "The drivers do not work at the palletiser, but their routine changes because of it. That is indirectly affected."
  4. "The line 3 team leader, who will now run the robot's start of shift and recover its stops." Correct: "Directly affected". Right: "Yes. Their daily tasks now include the robot." Wrong: "Running the start and recovering stops are new daily tasks for this team leader. That is directly affected."
- Pass reason: "You saw the people whose own tasks change and the people whose work changes because of the robot."

**Bridge.** Knowing who is affected, the next lesson asks what each of them must be able to do.

#### Lesson 2: What they must be able to do

- **Id:** `what-they-must-do`
- **Place:** This lesson is the second module. It turns the list of people into capabilities.

**Core idea.** A capability statement says what a person must be able to do, in words that describe something you could watch them do and judge. "Can carry out the start of shift on the palletiser in the order on the shift card" is a capability statement. "Understands the robot", "is comfortable with automation", and "has had training" are not, because you cannot watch someone understand or be comfortable, and having attended training does not show that they can do the task. Each group from lesson 1 needs its own statements, because the maintenance technician and the packer need very different things. A good statement names the task, the standard, and where it is written down if it is written anywhere. In this course, a statement is either "Something you can watch" or "Not yet something you can watch".

**Worked example.** The distribution centre manager writes capabilities for the pickers.

> Input: "Pickers will be trained on the robots and will be confident using them."

> Output: "Pickers can place a full tote on a waiting robot and send it to packing from the screen. Pickers can tell a robot that is waiting for a tote from one that is stopped with a fault, by reading the light and the screen. Pickers can step out of a robot's path and let it pass, as shown on the floor markings."

> Reading: The first version described an event and a feeling. The second describes three things a supervisor could watch on the first morning and either sign off or practise again.

**Practice.** Write two capability statements for each group on your list. Read each one and ask whether you could watch someone do it.

**Check.**

- Question: "Here are capability statements for maintenance technicians who will look after a new robot cell. Mark each as Something you can watch or Not yet something you can watch."
- Controls: "Something you can watch" and "Not yet something you can watch".
- Statements, correct answers, and feedback:
  1. "Technicians will be familiar with the robot." Correct: "Not yet something you can watch". Right: "Yes. Familiar is a state of mind, not a task." Wrong: "You cannot watch someone be familiar. Rewrite it as a task they carry out."
  2. "Technicians can isolate the cell following the site's lockout procedure and prove it is isolated before entering." Correct: "Something you can watch". Right: "Yes. This names a task and a standard, and a supervisor could watch it done." Wrong: "This names a specific task and the procedure it follows. A supervisor could watch it being done, so it is something you can watch."
  3. "Technicians can replace the gripper fingers and run the test cycle in the manufacturer's manual." Correct: "Something you can watch". Right: "Yes. It names the task and where its standard is written." Wrong: "Replacing the fingers and running the test cycle are observable tasks with a written standard. That is something you can watch."
  4. "Technicians will have attended the supplier's two-day course." Correct: "Not yet something you can watch". Right: "Yes. Attending shows presence, not that they can do the task." Wrong: "Attending a course shows that someone was in the room. It does not show what they can do. Name the task instead."
- Pass reason: "You kept the statements that describe a task you could watch and set aside the ones that describe attendance or feelings."

**Bridge.** Preparing people also means saying plainly what will end, which is the next lesson.

#### Lesson 3: What stops

- **Id:** `what-stops`
- **Place:** This is the third module. It deals with the part of a change that managers are most tempted to leave unsaid.

**Core idea.** Every automation stops something. Tasks stop, such as stacking cases by hand. Routines stop, such as the rotation between the palletising station and the line, or the chance to talk to colleagues while working side by side. Sometimes roles stop or shrink, and that is a matter for HR, consultation, and careful process, and it is outside what this lesson teaches you to announce. What this lesson teaches is to name the tasks and routines that stop in plain words, because people notice them anyway and will fill any silence with rumour. Saying what stops is not the same as saying people will lose their jobs, and it must not be used to hint at that. It is also not the same as describing the change only in terms of what it adds, such as "exciting new technology", which people correctly hear as avoiding the question.

**Worked example.** Two drafts of the same paragraph to a packing team.

> Input, draft one: "The new palletiser is an exciting opportunity that will transform how we work on line 3 and free you up for more valuable activities."

> Input, draft two: "From the week of 3 November, you will no longer stack cases onto pallets by hand at the end of line 3. The rotation between the stacking station and the line will stop, because there will be no stacking station. You will load the robot's pallet magazine, clear its stops, and check the wrapped pallets."

> Reading: The date is part of this example. Draft one says nothing people can plan around, and it hints at a change without naming it. Draft two says what stops, what ends with it, and what replaces it.

**Practice.** Write a list of the tasks and routines that will stop for each directly affected group. For each, write one plain sentence you could say aloud to that group.

**Check.**

- Question: "Two paragraphs have been drafted to tell a warehouse team about mobile robots. Choose the paragraph that says plainly what stops."
- Controls: "Paragraph A" and "Paragraph B".
- Paragraph A: "Robots will support our pickers and make their day easier, allowing them to focus on what they do best."
- Paragraph B: "From March, pickers will no longer push trolleys to the packing benches. The walk to packing, which is currently most of the day's steps, will stop. Pickers will place totes on robots at the end of each aisle."
- Correct: "Paragraph B".
- Right feedback: "Yes. Paragraph B names the task that stops, the routine that ends with it, and what replaces it."
- Wrong feedback: "Paragraph A describes what the robots add but never says what stops. People will notice what stops whether you say it or not. Choose the paragraph that names it."
- Pass reason: "You chose the paragraph that names what stops in words people can plan around."

**Bridge.** Being plain about what stops leads straight to the harder question of what you do not yet know, and the next lesson is about not pretending.

#### Lesson 4: What you will not pretend

- **Id:** `what-you-will-not-pretend`
- **Place:** This lesson completes the third module. It is about honesty in the message to the team.

**Core idea.** In any change there are things that are decided and things that are not. A message "says what is decided" when it states a fact that has been agreed by the people with the authority to agree it. A message "promises what is not decided" when it offers reassurance, a date, or an outcome that nobody has yet agreed, such as "nobody's job will change" when that has not been decided. Managers make these promises out of kindness, and they do lasting damage when they turn out to be wrong. The honest alternative is to say what is decided, what is not decided, and when people will know. Where the change could affect jobs, pay, or hours, you must involve HR before saying anything, because in the UK there may be legal duties to inform and consult employees or their representatives, and ACAS publishes guidance on this. This lesson does not tell you what those duties are in your case. It teaches you not to promise what you do not know.

**Worked example.** A team leader drafts a message.

> Input: "Don't worry, nobody is going to lose out. The robot is going live on 1 March and everyone will be retrained. Your shift patterns will stay exactly the same."

> Output, after checking with the project and HR: "The robot is planned to go live in March. The exact date will be confirmed by the end of January. Everyone on line 3 will be trained on the new tasks before go-live. Shift patterns have not yet been decided, and HR will talk to the team about them before any change is agreed."

> Reading: The first draft made three promises. Only the training commitment had been agreed. The rewritten message keeps that, turns the date into a statement of when it will be known, and names who will talk about shift patterns.

**Practice.** Take a message you have sent or are about to send about the change. Mark each sentence with "Says what is decided" or "Promises what is not decided", and rewrite each sentence in the second group.

**Check.**

- Question: "A manager has drafted this message about a new robotic welding cell. The project has agreed only the go-live month and the training plan. Mark each sentence."
- Controls: "Says what is decided" and "Promises what is not decided".
- Sentences, correct answers, and feedback:
  1. "The welding cell will go live in June." Correct: "Says what is decided". Right: "Yes. The go-live month has been agreed." Wrong: "The project has agreed the go-live month. This sentence says what is decided."
  2. "Every welder will be trained to load and recover the cell before it goes live." Correct: "Says what is decided". Right: "Yes. The training plan has been agreed." Wrong: "The training plan is one of the things the project has agreed. This sentence says what is decided."
  3. "Nobody's hours will change." Correct: "Promises what is not decided". Right: "Yes. Hours have not been decided, so this is a promise nobody has agreed." Wrong: "Hours are not among the things the project has agreed. This sentence promises what is not decided. Say instead when people will know."
  4. "You will all get the new technician grade." Correct: "Promises what is not decided". Right: "Yes. Grades have not been agreed, and a promise about them is not yours to make yet." Wrong: "Nothing about grades has been agreed. This sentence promises what is not decided, and any change to grades is a matter for HR."
- Pass reason: "You kept the facts that have been agreed and found the promises nobody has yet made."

**Bridge.** With the people, the capabilities, and an honest message in hand, the next lesson plans the first weeks.

#### Lesson 5: The first weeks

- **Id:** `the-first-weeks`
- **Place:** This lesson turns the capabilities from lesson 2 into a plan with owners and dates, ready for the brief.

**Core idea.** A plan for the first weeks says, for each group, when they will practise, who will show them, when someone will watch them do each capability, and who they call when something goes wrong. It also says when the extra support will stop, for example when the supplier's engineer leaves site, because people cope much better with support ending when they knew in advance when it would end. The plan is not a training calendar that lists sessions. It is a list of capabilities with a person and a date against each one. The most common gap is the indirectly affected groups, especially nights and maintenance, who are often left to learn from the day shift.

**Worked example.** A plan for the first weeks of a palletiser.

> Input: "Week 1: training for all. Week 2: go live."

> Output: "Packers, days: practise loading the pallet magazine and recovering a stop with the supplier's engineer on 3 and 4 November; watched by the team leader on 5 November; call the team leader, then the shift engineer. Packers, nights: same practice with the supplier's engineer on the night of 4 November; watched by the night team leader on 6 November. Maintenance: isolation and gripper change with the supplier on 5 November; watched by the maintenance lead on 7 November. The supplier's engineer leaves site on 21 November, and after that the call goes to the shift engineer."

> Reading: The dates belong to the example. The first plan was a label. The second plan could be checked against each person on each date, and it names when the supplier's support ends.

**Practice.** Write the plan for your own change, with at least one row for an indirectly affected group.

**Check.**

- Question: "This first-weeks plan for a vision inspection system is missing parts the lesson named. Edit the plan so it has them."
- Control: an editable plan: "Inspectors, days: practise running the start-of-shift test with the supplier on 10 June. Inspectors, nights: to be arranged. The supplier leaves site at the end of June."
- What must be added: who will watch the day inspectors do the task and when; a date and a person for the night inspectors; and who inspectors call after the supplier leaves.
- Feedback when the watching step is missing: "Your plan says when day inspectors practise but not who will watch them do it or when. Add a person and a date."
- Feedback when nights still says to be arranged: "Night inspectors still have no date and no person. Nights are often the group left to learn from days. Give them a date and a person."
- Feedback when the call after the supplier leaves is missing: "Your plan says when the supplier leaves but not who inspectors call afterwards. Name the role."
- Right feedback: "Yes. Every group now has a practice, a person and a date to watch it done, and someone to call after the supplier's support ends."

**Bridge.** The last lesson brings everything together into the preparation brief, which is what appears on your record.

#### Lesson 6: The preparation brief

- **Id:** `the-preparation-brief`
- **Place:** This is the final lesson and the fourth module. You write the artefact.

**Core idea.** The preparation brief is the document a colleague could pick up and use to prepare the team if you were away. It has five parts: who is affected, directly, indirectly, and those who believe they are; what each group must be able to do, as capabilities you could watch; what stops, in plain words; what is decided, what is not, and when people will know; and the first-weeks plan, with a person and a date against each capability. It is not a communications plan full of slogans and it is not an HR document about roles or terms. It is the practical preparation of people for a change in their daily work.

**Worked example.** The distribution centre manager's brief, in summary.

> Output: "Affected: pickers and packers directly; engineering, shift planners, the cleaning contractor, and nights indirectly; forklift drivers believe they are affected and will be told their work does not change. Capabilities: pickers can place a tote and send the robot; pickers can tell waiting from stopped; packers can receive and release a robot; engineers can take a robot out of service and change a battery following the manual. What stops: pushing trolleys to packing, and the walk that goes with it. Decided: go-live in March, training before go-live. Not decided: shift patterns, which HR will discuss with the team by the end of January. First weeks: practice dates, watchers, and the call route for each group, with the supplier leaving on 28 March."

> Reading: A colleague could run the first weeks from this. It makes no promise that has not been agreed.

**Practice.** Draft the brief for your own change in the fields provided.

**Check (build the artefact).**

- Question: "Write the preparation brief for a real change your team is facing. Each part has to be something a colleague could act on."
- Fields: "Who is affected", "What they must be able to do", "What stops", "What is decided, what is not, and when people will know", "The first weeks".
- Feedback for missing parts: "Your affected field has no indirectly affected group. Add at least one, such as maintenance, nights, or planners." "One of your capability statements describes attendance or a feeling. Rewrite it as something you could watch." "Your what stops field is empty or describes only what is added. Name at least one task or routine that stops." "Your decided field has no not decided line. Say what is not yet decided and when people will know." "Your first weeks field has a group without a person and a date. Add both."
- Right feedback: "Your brief lists everyone affected, gives capabilities you could watch, says plainly what stops, separates what is decided from what is not, and puts a person and a date against each group. A colleague could run the change from it."

### The artefact and the record

The learner produces the preparation brief. After every check has passed, they sign their name against it. The record shows the name, the course title "Preparing a Team for Automation", the date signed, the five parts of the brief as written, and the public reference. The record states: "This record shows the preparation brief the named person wrote in this course. It is not evidence of consultation or of compliance with any employment law or regulation."

### How learning is validated

The brief passes when the affected field contains at least one directly and one indirectly affected group; each capability statement names a task a person carries out and none rests only on words such as familiar, comfortable, confident, understand, or attended; the what stops field names at least one task or routine; the decided field contains at least one decided item and at least one not decided item with a time at which people will know; and each group in the first weeks has a named role and a date. Length alone never passes.

### Sources and reading

- ACAS, guidance on managing change at work and on consultation, including the guidance on the Information and Consultation of Employees Regulations 2004.
- CIPD, public guidance and research on change management and on the introduction of technology at work.
- UK Health and Safety Executive, guidance on managing organisational change and on the Management of Health and Safety at Work Regulations 1999, which require risks to be assessed when work changes.
- UK Health and Safety Executive, human factors guidance on training and competence.
- The supplier's training materials and manuals for the equipment being introduced.

---

## 5. Warehouse and Logistics Automation

**Slug:** `warehouse-and-logistics-automation`

**Catalogue:** 2.5 hours, £129. Promise: "A one-page map of one goods flow, and where automation would make it worse." Modules: The flow, Where it pays, The pile it will not touch, The map.

### Who it is for

This course is for warehouse managers, logistics and supply chain leads, and operations analysts who are being asked about conveyors, sortation, mobile robots, automated storage, or robotic picking. They must already know one goods flow in their site well, or be able to walk it and talk to the people who work it. They should be able to get basic volume information from their warehouse management system or from supervisors. They do not need engineering knowledge.

### Outcome

When you finish, you can draw one goods flow from arrival to dispatch, show where the unit of handling changes, separate what has been measured from what has been assumed, point to the steps where automation would pay and explain why, name the pile of exceptions the automation will not touch, and say where automation would make the flow worse, all on a one-page map a colleague could use in a meeting with a supplier.

### Learning objectives

1. Draw one goods flow as a sequence of steps, marking where the unit of handling changes.
2. Mark each figure about the flow as measured or assumed.
3. Identify the steps where automation would pay and give the reason in terms of volume, uniformity, and travel.
4. Name the exceptions a proposed system will leave for people, and where they will go.
5. State where automation would make the flow worse and what the fallback would be.

### Lessons

#### Lesson 1: One goods flow

- **Id:** `one-goods-flow`
- **Place:** This is the first lesson and the first module. It fixes what the map will cover.

**Core idea.** A goods flow is the path that one kind of goods takes through your site, from the moment it arrives to the moment it leaves. It is usually a sequence such as receive, check, put away, store, replenish, pick, pack, and dispatch, but your flow may skip some steps or add others. The most important thing to mark on the flow is where the "unit of handling" changes: goods may arrive as pallets, be broken into cases, be picked as single items, and leave as parcels. Each change of unit is a place where work and errors concentrate, and automation that suits one unit rarely suits the next. A goods flow is not the whole site and it is not a layout drawing. It is one path, drawn as steps, so that it can be understood on one page.

**Worked example.** A manager at a health and beauty distribution centre is asked about automation.

> Input: "Our whole warehouse: 20,000 SKUs, two mezzanines, returns, e-commerce and store orders."

> Output, narrowed to one flow: "E-commerce orders for small items. Receive pallets from the supplier. Break pallets into cases and put away to shelving on the mezzanine. Pick single items into totes. Pack each order into a mailer bag. Sort mailer bags by carrier into cages. Dispatch. Unit changes: pallet to case at put-away, case to single item at picking, single items to parcel at packing."

> Reading: The whole-site description could not be mapped on a page. The single flow can, and it already shows three changes of unit, each of which is a separate question for automation.

**Practice.** Choose one flow on your site and write it as a sequence of steps. Mark each point where the unit of handling changes.

**Check.**

- Question: "Two descriptions have been written of a flow at a building supplies depot. Choose the one that describes one goods flow as the lesson taught."
- Controls: "Description A" and "Description B".
- Description A: "The yard, the main shed, the trade counter, and deliveries."
- Description B: "Bagged cement for trade customers. Receive full pallets from the supplier. Store pallets in the yard racking. Pick part pallets by the bag for trade orders. Load onto customer vehicles or our own delivery lorries. Unit changes: full pallet to bag at picking."
- Correct: "Description B".
- Right feedback: "Yes. Description B follows one kind of goods from arrival to dispatch and marks where the unit changes."
- Wrong feedback: "Description A lists areas of the site. It does not follow any goods through them or show where the unit changes. Choose the description that follows one path."
- Pass reason: "You chose a single path for one kind of goods with its unit changes marked."

**Bridge.** A flow needs figures before it can be judged, and the next lesson asks whether each figure is measured or assumed.

#### Lesson 2: Measured or assumed

- **Id:** `measured-or-assumed`
- **Place:** This lesson completes the first module by putting numbers on the flow and being honest about where they came from.

**Core idea.** Warehouse automation is sized to volumes, and wrong volumes produce the wrong system. For each step you need the volume per hour or per day, the peak as well as the average, the number of different items, and the size and weight range of the unit. A figure is "Measured" when it comes from a record, such as the warehouse management system, a count, or a time study, and when you know the period it covers. A figure is "Assumed" when it comes from memory, a budget, a supplier's estimate, or an average someone once quoted. Assumed figures are not wrong in themselves. They are dangerous only when nobody knows they are assumed. The peak matters especially, because many flows run at a comfortable average for most of the year and then far above it for a few weeks, and a system sized to the average fails at exactly the moment it matters most.

**Worked example.** The health and beauty manager adds figures.

> Input: "We pick about 8,000 items a day. Peak is about double. Most items are small. There are 20,000 SKUs."

> Output, marked: "About 8,000 items a day: measured, the warehouse management system daily average over the last twelve months. Peak about double: assumed, the manager's memory of last November. Most items are small: assumed, no size data has been pulled. 20,000 SKUs: measured, current item master, though about a third have not moved in six months."

> Reading: The figures belong to the example. Two of the four figures are assumed, including the peak, which is the one a system must be sized for. The next job is to pull the daily volumes for last November and the dimensions from the item master.

**Practice.** Write the figures you know for your flow. Mark each one "Measured" or "Assumed" and, for each measured figure, write where it came from and what period it covers.

**Check.**

- Question: "Here are figures a transport manager has given about a parcel sortation flow. Mark each one as Measured or Assumed."
- Controls: "Measured" and "Assumed".
- Figures, correct answers, and feedback:
  1. "We handle about 12,000 parcels a day, from the carrier manifest totals for the last six months." Correct: "Measured". Right: "Yes. It comes from a record and the period is stated." Wrong: "This figure names its source and the period it covers. That is measured."
  2. "Christmas is probably three times a normal day." Correct: "Assumed". Right: "Yes. Probably shows it is an estimate, and no record is named." Wrong: "No record is named and probably is an estimate. That is assumed, and because it is the peak, it needs measuring."
  3. "The supplier says a sorter like theirs handles our volume easily." Correct: "Assumed". Right: "Yes. It is someone else's estimate, not a measurement of your flow." Wrong: "A supplier's view is an estimate about your flow, not a record of it. That is assumed."
  4. "Parcels range from 0.1 kilograms to 25 kilograms, from the weigh scale log for March." Correct: "Measured". Right: "Yes. It comes from the scale log for a stated month." Wrong: "This names its source and period. That is measured."
- Pass reason: "You separated the figures that come from a record with a period from the figures that come from memory or a supplier."

**Bridge.** With the flow drawn and its figures honest, the next lesson looks for the steps where automation would pay.

#### Lesson 3: Where it pays

- **Id:** `where-it-pays`
- **Place:** This is the second module. It points to candidate steps and explains why they are candidates.

**Core idea.** Automation tends to pay in a warehouse where three things come together. The first is steady volume: work that happens at a high and fairly predictable rate, so that the equipment is used most of the time. The second is uniformity: units of a similar size, shape, and packaging, so that one type of equipment can handle nearly all of them. The third is travel: in many warehouses a large share of labour is spent walking or driving between locations, which is why goods-to-person systems and mobile robots that carry goods to people are common. The step that pays is also usually the step that constrains the whole flow, because speeding up a step that is not the constraint just moves the queue. The step that pays is not necessarily the step where the manager's pain is loudest, and it is not the step where a supplier happens to have a product.

**Worked example.** The health and beauty manager considers two candidate steps.

> Input: "Step A: pickers walk the mezzanine to pick single items into totes. This takes most of the labour in the flow. Items are small and mostly boxed. Step B: returns processing, which is the step everyone complains about, with items arriving opened, unlabelled, and mixed."

> Output: "Step A is where automation would pay. Volume is steady, items are fairly uniform, and most of the labour is travel. A goods-to-person system or mobile robots bringing totes to pickers could be considered. Step B is painful but varies too much to pay. It stays with people."

> Reading: The manager wanted to solve returns. The flow shows the money is in the walking. That does not make returns less important. It means returns needs a different answer.

**Practice.** For each step in your flow, write one sentence each on volume, uniformity, and travel. Mark the one or two steps where all three come together.

**Check.**

- Question: "A clothing retailer's warehouse manager is choosing where automation would pay. Choose the step where volume, uniformity, and travel come together."
- Controls: "Step A" and "Step B".
- Step A: "Sorting single items from e-commerce returns, which arrive in any condition and are inspected one by one."
- Step B: "Moving cases of folded garments in a standard carton size from goods-in to the pick face, many times a day, across a long building."
- Correct: "Step B".
- Right feedback: "Yes. Step B is steady, the cartons are a standard size, and most of the effort is travel across the building."
- Wrong feedback: "Step A varies with every item and needs inspection, so it lacks uniformity. Look again for the step with steady volume, uniform units, and long travel."
- Pass reason: "You chose the step where all three conditions come together, not the step with the most complaints."

**Bridge.** Every system leaves some work for people, and the next lesson names the pile it will not touch.

#### Lesson 4: The pile it will not touch

- **Id:** `the-pile-it-will-not-touch`
- **Place:** This is the third module. It is the part of the map that suppliers rarely draw.

**Core idea.** Every warehouse automation has a set of goods it cannot handle. Common examples are oversized or overweight items, items in soft polythene bags, fragile items, damaged packaging, unreadable or missing labels, mixed pallets, and returns. In this course, those items are "Left for people", and everything the system was designed to handle is "Handled by the system". What is left for people usually ends up in a pile, a cage, or a side lane, and it keeps needing space, labour, and management attention after the automation goes live. The pile is not a sign that the system has failed. It is part of the design, and it has to be sized, located, and staffed. A proposal that does not describe its pile has not been finished, and a map that does not show it will surprise you on the first day.

**Worked example.** The manager reads a supplier's proposal for a goods-to-person system.

> Input: "The system stores and presents all standard totes. Items above the tote size are stored in conventional shelving. Items that fail the weight check are rejected to an exception station. The system supports your full range."

> Output, marked: "The system stores and presents all standard totes" is handled by the system. "Items above the tote size are stored in conventional shelving" is left for people. "Items that fail the weight check are rejected to an exception station" is left for people. "The system supports your full range" is neither until you have checked it against the two sentences before it.

> Reading: The last sentence sounds like everything is handled, yet the proposal itself names two piles. The manager's next question is how many of the 20,000 SKUs are above tote size, which is a measured figure she can pull from the item master.

**Practice.** For the step you marked as paying in lesson 3, list the goods it would not handle. For each, write where they would go and who would handle them.

**Check.**

- Question: "Here are sentences from a proposal for automated parcel sortation. Mark each as Handled by the system or Left for people."
- Controls: "Handled by the system" and "Left for people".
- Sentences, correct answers, and feedback:
  1. "Parcels with a readable label and within the size limits are sorted to the carrier chute." Correct: "Handled by the system". Right: "Yes. These are the parcels the system was designed for." Wrong: "This describes the parcels the sorter was built to handle. That is handled by the system."
  2. "Parcels with no readable label are diverted to a manual lane." Correct: "Left for people". Right: "Yes. A person must deal with these in the manual lane." Wrong: "These parcels go to a manual lane, where a person has to deal with them. That is left for people."
  3. "Items over 30 kilograms bypass the sorter." Correct: "Left for people". Right: "Yes. Heavy items bypass the system, so people handle them." Wrong: "Bypassing the sorter means these are handled another way, usually by people. That is left for people."
  4. "Polybags are sorted when presented flat." Correct: "Left for people". Right: "Yes. The words when presented flat mean that polybags that are not flat will need a person." Wrong: "Read the condition carefully. Polybags that are not presented flat will not be sorted, so some of them are left for people. Mark it as left for people and ask how many that will be."
- Pass reason: "You found the goods the system leaves for people, including the ones hidden behind a condition."

**Bridge.** The pile is one way automation leaves work behind, and the next lesson looks at the ways it can make the flow worse.

#### Lesson 5: Where it makes the flow worse

- **Id:** `where-it-makes-it-worse`
- **Place:** This lesson prepares the part of the map that the promise of the course names directly.

**Core idea.** Automation can make a flow worse even when it works exactly as designed. It can make the flow rigid, so that a sudden peak, a new product shape, or a change in order profile cannot be absorbed the way extra people and trolleys could absorb it. It can create a single point of failure, so that when a sorter or a storage system stops, the whole flow stops with it. It can fix the layout, so that changing the building later becomes expensive. It can concentrate exceptions in one place where they overwhelm a small team. For each of these, a good map says what would happen and what the fallback is, meaning how the flow keeps going, at least partly, when the automation is down or overloaded. Saying where automation makes a flow worse is not the same as arguing against it. It is how you make sure the design includes the answers.

**Worked example.** The manager adds the risks to her goods-to-person option.

> Input: "Goods-to-person for small items."

> Output: "Makes it worse at: peak, if the system's hourly capacity is below the peak we have not yet measured; a stop of the system, when no small items can be picked at all; new product shapes above tote size, which go to shelving. Fallback: keep a manual pick face for the fastest-moving items, sized to cover a stop of half a shift; measure last November's peak before sizing."

> Reading: None of these risks is a reason to stop. Each has become a design requirement, and one of them sends the manager back to measure the peak she assumed in lesson 2.

**Practice.** For your candidate step, write at least two ways automation could make the flow worse and a fallback for each.

**Check.**

- Question: "This map note for a mobile robot system is missing a part the lesson named. Edit the note so it has it."
- Control: an editable note: "Mobile robots carry totes from pick zones to packing. Makes it worse at: a network outage, when robots stop and totes stay in the pick zones."
- What must be added: a fallback for the network outage, for example "Fallback: pickers push totes to packing on trolleys, which are kept at each zone."
- Feedback when missing: "Your note says what would happen during an outage but not how the flow keeps going. Add a fallback."
- Feedback when the fallback is only a hope, detected when the added text contains only phrases such as the supplier will fix it or should not happen: "Your fallback says the problem will be fixed or will not happen. A fallback says how the goods keep moving while it is broken. Describe what people would do."
- Right feedback: "Yes. The note now says what goes wrong and how the goods keep moving while it does."

**Bridge.** The last lesson puts the flow, the figures, the paying step, the pile, and the risks onto a single page.

#### Lesson 6: The map

- **Id:** `the-map`
- **Place:** This is the final lesson and the fourth module. You write the artefact.

**Core idea.** The map is one page about one goods flow. It has six parts: the flow as a sequence of steps with the unit changes marked; the figures for each step, each marked measured or assumed; the step where automation would pay and why, in terms of volume, uniformity, and travel; the pile it will not touch, with where it goes and who handles it; where automation would make the flow worse and the fallback for each; and the next measurement or question to put to a supplier. It is written so that you can put it on the table at a supplier meeting and ask them to respond to it, rather than responding to their brochure.

**Worked example.** The health and beauty manager's map, in text form.

> Output: "Flow: e-commerce small items. Receive pallets, break to cases, put away, pick singles to tote, pack to mailer, sort by carrier, dispatch. Unit changes at put-away, pick, and pack. Figures: daily average 8,000 items, measured, twelve months; peak assumed, to be measured from November; 20,000 SKUs, measured, with a third slow-moving. Pays at: picking, because most labour there is travel and items are mostly boxed. Pile: items above tote size to shelving, weight failures to an exception station, handled by the pick team. Worse at: peak if undersized; full stop if the system stops; new large items. Fallback: manual pick face for the fastest movers. Next: measure peak and pull item dimensions, then ask each supplier for hourly capacity at that peak."

> Reading: The map is short and every line is either a fact or an admitted gap. A supplier has to answer the peak question to stay in the conversation.

**Practice.** Draft your map in the fields provided.

**Check (build the artefact).**

- Question: "Write the one-page map for one goods flow on your site. Each part has to be something you could put in front of a supplier."
- Fields: "The flow and its unit changes", "Figures, measured or assumed", "Where it pays and why", "The pile it will not touch", "Where it makes the flow worse, and the fallback", "Next measurement or question".
- Feedback for missing parts: "Your flow does not mark any unit change. Mark where the unit of handling changes." "Some of your figures are not marked measured or assumed. Mark each one." "Your where it pays field does not mention volume, uniformity, or travel. Give the reason in those terms." "Your pile field does not say where the goods go or who handles them. Add both." "Your worse field has a risk without a fallback. Add how the goods keep moving." "Your next field is empty. Name one measurement or one question for a supplier."
- Right feedback: "Your map follows one flow, is honest about its figures, says where automation pays and why, names the pile and who handles it, says where it makes things worse with a fallback, and ends with a next step."

### The artefact and the record

The learner produces the one-page map. After every check has passed, they sign their name against it. The record shows the name, the course title "Warehouse and Logistics Automation", the date signed, the six parts of the map as written, and the public reference. The record states: "This record shows the goods flow map the named person wrote in this course. It is not a system design, a safety assessment, or a recommendation to buy any product."

### How learning is validated

The map passes when the flow has at least three steps and at least one marked unit change; every figure is marked measured or assumed, and every measured figure names a source; the paying step is justified with at least one of volume, uniformity, or travel; the pile names at least one kind of goods with a destination and a handler; at least one way automation would make the flow worse has a fallback that describes what people would do; and the next field names a measurement or a question. Length alone never passes.

### Sources and reading

- UK Health and Safety Executive, *Warehousing and storage: A guide to health and safety* (HSG76).
- ISO 3691-4, *Industrial trucks: Safety requirements and verification, Part 4: Driverless industrial trucks and their systems*, named so the learner knows the standard that applies to many mobile robots and automated guided vehicles.
- Alan Rushton, Phil Croucher, and Peter Baker, *The Handbook of Logistics and Distribution Management* (Kogan Page).
- Edward H. Frazelle, *World-Class Warehousing and Material Handling*.
- International Federation of Robotics, *World Robotics: Service Robots*, for the use of professional service robots in logistics.
- Supplier documentation for the systems under consideration, read with the measured-or-assumed test from lesson 2.

---

## 6. Specifying a Robotics Project

**Slug:** `specifying-a-robotics-project`

**Catalogue:** 2.5 hours, £149. Promise: "A one-page specification a vendor cannot hide behind." Modules: Outcomes, Volume and exceptions, Who owns the stop, The specification.

### Who it is for

This course is for engineering managers, project leads, operations managers, and procurement professionals who must write or approve the specification for a robot cell or a robotics project before going to suppliers or integrators. They must already know the process to be automated and the business reason for automating it. It helps to have completed Where a Robot Belongs in the Process or to have an equivalent task-level view of the process. The course does not teach how to design the cell, and it does not replace the risk assessment or the conformity work that the complete machine requires.

### Outcome

When you finish, you can write a one-page specification that states outcomes rather than equipment, says how each outcome will be measured at acceptance, gives the volume range and the exceptions with sample parts, names who owns each kind of stop and restart and who is responsible for the safety of the complete cell, and removes the phrases a vendor could later hide behind.

### Learning objectives

1. Rewrite equipment choices as outcomes the cell must achieve.
2. Write an acceptance condition that states the test, the parts, the duration, and the pass mark.
3. Specify volume as a range with a peak and list exceptions with their frequency or "not yet measured".
4. Name owners for stopping, restarting, changing programs, and safety responsibility for the complete cell.
5. Identify and replace wording in a specification or proposal that a vendor could hide behind.

### Lessons

#### Lesson 1: Outcomes, not equipment

- **Id:** `outcomes-not-equipment`
- **Place:** This is the first lesson and the first module. It sets the principle that the specification describes what must be true, not how to make it true.

**Core idea.** An "Outcome" is a statement of what must be true when the cell is working, such as the number of good parts per hour, the quality standard they must meet, the time allowed for a changeover, or the part numbers it must handle. An "Equipment choice" is a statement about how that will be achieved, such as "a six-axis robot", "a vision system from a named brand", or "a vacuum gripper". When a specification is made of equipment choices, a supplier can deliver exactly what was asked for and still produce a cell that does not meet the need, and the buyer has no grounds to object, because the buyer chose the equipment. When a specification is made of outcomes, the supplier takes responsibility for choosing equipment that achieves them. There are good reasons to specify some equipment, for example to match a site standard for spares or controls, and those should be stated as constraints with the reason. They should not be the whole specification.

**Worked example.** A project lead's first draft for a machine-tending cell.

> Input: "Supply one six-axis robot with a payload of 20 kilograms, a twin gripper, a vision system, and guarding, to load our two lathes."

> Output, rewritten: "The cell must load and unload lathes 1 and 2 for part numbers 4410 and 4415. It must deliver at least 60 good parts per hour across both lathes, with the lathes' own cycle times unchanged. It must run unattended for at least two hours from a full infeed. Changeover between the two part numbers must take no more than 20 minutes. Site standard: robot controller from our approved list, to match existing spares."

> Reading: The numbers belong to the example. The first draft chose equipment and said nothing about what it must do. The second draft states outcomes, and keeps one equipment constraint with its reason.

**Practice.** Take a specification, a request for quotation, or a brief from your own work. Mark each sentence "Outcome" or "Equipment choice", and rewrite one equipment choice as an outcome.

**Check.**

- Question: "Here are sentences from a draft specification for a case-packing cell. Mark each sentence as Outcome or Equipment choice."
- Controls: "Outcome" and "Equipment choice".
- Sentences, correct answers, and feedback:
  1. "The cell must pack at least 20 cases per minute of 12 bottles each." Correct: "Outcome". Right: "Yes. It says what must be true, and it can be measured." Wrong: "This says what the cell must achieve, not how. That is an outcome."
  2. "Use a delta robot with a vacuum gripper." Correct: "Equipment choice". Right: "Yes. It chooses the equipment rather than stating what must be achieved." Wrong: "This names the type of robot and gripper. That is an equipment choice. Ask what outcome it was meant to secure."
  3. "Changeover between the 500 millilitre and 1 litre bottle must take no more than 15 minutes." Correct: "Outcome". Right: "Yes. It states a measurable result." Wrong: "This states a result with a time limit that can be measured at acceptance. That is an outcome."
  4. "Include a camera to check bottle orientation." Correct: "Equipment choice". Right: "Yes. It chooses a device. The outcome is that no case leaves with a bottle in the wrong orientation." Wrong: "A camera is a device. The outcome behind it is that no case leaves with a bottle in the wrong orientation. That sentence is an equipment choice."
- Pass reason: "You separated what the cell must achieve from the equipment someone had already chosen."

**Bridge.** An outcome is only useful if you can prove it at handover, and the next lesson writes the test.

#### Lesson 2: How it will be measured

- **Id:** `how-it-will-be-measured`
- **Place:** This lesson completes the first module by attaching an acceptance test to each outcome.

**Core idea.** An acceptance condition says how you will decide that an outcome has been achieved before you accept the cell. It has four parts: the test, such as a continuous production run; the parts, meaning your own parts in the stated range, not the supplier's samples; the duration or quantity, such as eight hours or 2,000 parts; and the pass mark, such as at least 60 good parts per hour averaged over the run with no more than a stated number of stops needing a person. Many projects use a factory acceptance test at the supplier's premises and a site acceptance test after installation, and the specification should say what each must show. An acceptance condition is not a demonstration chosen by the supplier on the day, and it is not "to the customer's satisfaction", which is an invitation to argue later.

**Worked example.** The machine-tending outcome from lesson 1 given an acceptance condition.

> Input: "The cell must deliver at least 60 good parts per hour across both lathes."

> Output: "Site acceptance: an eight-hour production run on part numbers 4410 and 4415, using production blanks from our stores, with one changeover during the run. Pass: at least 60 good parts per hour averaged over the run, excluding the changeover period; no more than three stops needing an operator; the changeover completed in 20 minutes or less."

> Reading: The supplier now knows exactly what they will be judged on and can design for it. The buyer no longer has to argue about whether a good day at the supplier's premises counts.

**Practice.** Write an acceptance condition for one outcome from your own specification, with all four parts.

**Check.**

- Question: "Two acceptance clauses have been written for a robotic welding cell. Choose the clause the supplier could not argue with afterwards."
- Controls: "Clause A" and "Clause B".
- Clause A: "The cell will be accepted following a successful demonstration to the customer's satisfaction."
- Clause B: "Site acceptance: a six-hour run welding frame part 7702 from production-issue components. Pass: at least 40 frames welded, every frame passing the existing weld inspection standard WI-12, and no more than two stops needing an operator."
- Correct: "Clause B".
- Right feedback: "Yes. Clause B states the test, your parts, the duration, and the pass mark, and it points to your existing inspection standard."
- Wrong feedback: "Clause A has no test, no parts, no duration, and no pass mark. Successful and satisfaction can be argued either way. Choose the clause with all four parts."
- Pass reason: "You chose the clause with a test, your parts, a duration, and a pass mark."

**Bridge.** Outcomes and tests depend on what the cell will actually meet, and the next lesson specifies volume and exceptions.

#### Lesson 3: Volume and exceptions

- **Id:** `volume-and-exceptions`
- **Place:** This is the second module. It gives the supplier the facts they need to design for your reality rather than for your average.

**Core idea.** Suppliers design to the numbers they are given. A specification should give volume as a range: the normal rate, the peak and how long it lasts, and the mix of part numbers. It should give the variation in the parts themselves, such as dimensional tolerances, surface finish, and how they arrive. It should list the exceptions the cell will meet, such as a blank with a burr, a part in the wrong orientation, or a missing component, with how often each happens or "not yet measured". Most importantly, it should commit to providing sample parts, including examples of the exceptions, so the supplier cannot later say they were never shown them. A specification that gives only the average rate and the drawing is not wrong, but it hands the supplier the defence that reality was outside what they were told.

**Worked example.** The volume section of a specification.

> Input: "Volume: 400 parts per shift."

> Output: "Volume: normal 350 to 420 parts per shift, measured over the last six months; peak 480 parts per shift for about four weeks before the summer shutdown. Mix: part 4410 about two-thirds, part 4415 about one-third. Parts: blanks cut from bar, length tolerance plus or minus 0.5 millimetres, occasionally with a burr on the cut end. Exceptions: burred blanks, not yet measured; blanks from a different bar batch with a slightly different diameter, about once a month. Samples: we will supply 200 blanks of each part, including at least 20 burred blanks, before the factory acceptance test."

> Reading: The figures belong to the example. The supplier now has the range, the peak, the mix, the variation, the exceptions, and a commitment to samples, so any later claim that the cell met only the average is answered on the page.

**Practice.** Rewrite the volume section of your own specification with a range, a peak, a mix, the part variation, the exceptions, and a commitment to samples.

**Check.**

- Question: "This volume section is missing parts the lesson named. Edit it so the supplier cannot say they were not told."
- Control: an editable section: "Volume: about 1,200 trays a day. Exceptions: some trays are warped."
- What must be added: a peak, the frequency of warped trays or "not yet measured", and a commitment to supply sample trays including warped ones.
- Feedback when the peak is missing: "Your section gives only the daily figure. Add the peak and how long it lasts."
- Feedback when the exception frequency is missing: "Your exception says some trays are warped, but not how often. Add a frequency, or write not yet measured."
- Feedback when samples are missing: "Your section does not commit to supplying samples. Add how many trays you will supply, including warped ones, and by when."
- Right feedback: "Yes. The supplier now has the peak, how often the exception happens or that it is not yet known, and a promise of samples including the exception."

**Bridge.** Knowing what the cell will meet, the next lesson asks who owns it when it stops.

#### Lesson 4: Who owns the stop

- **Id:** `who-owns-the-stop`
- **Place:** This is the third module. It names the people and responsibilities that suppliers and buyers most often leave open.

**Core idea.** A robot cell will stop, sometimes for safety and sometimes for ordinary reasons, and the specification must say who owns each part of that. There are five questions. Who may stop the cell in normal use, and how? Who may restart it after each kind of stop? Who may change programs, positions, or safety settings, and how are those changes recorded? Who is called when the operator cannot recover a stop, at each time of day, and for how long will the supplier provide that support? Who is responsible for the safety of the complete cell as a machine, including its risk assessment, its conformity marking, and its technical documentation? The last question matters because a cell is usually assembled from parts made by different companies, and in the UK the Supply of Machinery (Safety) Regulations 2008 place duties on whoever supplies or puts into service the complete machine. This lesson does not tell you who that is in your project. It teaches you to make sure the specification names who it will be, agreed in writing, with competent advice. A sentence "Names an owner" when it gives a role or organisation. It "Leaves the owner open" when it does not.

**Worked example.** A draft responsibilities section.

> Input: "The supplier will provide support. The cell will be CE or UKCA marked as appropriate. Operators will be trained."

> Output: "Normal stop: operators, from the pendant or the cell panel. Restart after a protective stop: trained operators, following the recovery card. Restart after an emergency stop: the shift team leader, after the cause is found. Program and safety setting changes: the site's robot engineer only, recorded in the change log. Call when an operator cannot recover: shift engineer on days and nights; supplier remote support by telephone for twelve months from site acceptance. Responsibility for the complete cell as a machine, including risk assessment, conformity marking, declaration, and technical file: the integrator, as agreed in the contract."

> Reading: The first version sounds complete but names nobody except the supplier in general. The second names an owner for each question, including the one that is most expensive to leave open.

**Practice.** Answer the five questions for your own project, naming a role or organisation for each. Write "open" where you do not yet know, so the gap is visible.

**Check.**

- Question: "Here are sentences from a responsibilities section for a palletising cell. Mark each as Names an owner or Leaves the owner open."
- Controls: "Names an owner" and "Leaves the owner open".
- Sentences, correct answers, and feedback:
  1. "Changes to robot programs are made only by the site controls engineer and recorded in the change log." Correct: "Names an owner". Right: "Yes. It names who may change programs and how changes are recorded." Wrong: "This names the site controls engineer and a record. That names an owner."
  2. "Appropriate support will be provided after handover." Correct: "Leaves the owner open". Right: "Yes. It does not say who provides support, when, or for how long." Wrong: "Appropriate support names nobody and gives no period. That leaves the owner open."
  3. "The cell will be safe." Correct: "Leaves the owner open". Right: "Yes. It says nothing about who is responsible for the safety of the complete cell." Wrong: "This states a hope. It does not name who is responsible for the risk assessment, conformity, and documentation of the complete cell. That leaves the owner open."
  4. "The integrator is responsible for the risk assessment, conformity marking, and technical file of the complete cell, as set out in the contract." Correct: "Names an owner". Right: "Yes. It names who is responsible for the complete cell and where that is agreed." Wrong: "This names the integrator and points to the contract. That names an owner."
- Pass reason: "You found the sentences that name a role and the ones that leave a gap someone will fall into later."

**Bridge.** Some wording leaves more than the owner open, and the next lesson finds the phrases a vendor can hide behind.

#### Lesson 5: Where a vendor can hide

- **Id:** `where-a-vendor-can-hide`
- **Place:** This lesson reviews the whole draft before the final specification is written.

**Core idea.** Some phrases sound reassuring but commit nobody to anything. Common ones are "up to", which states a maximum that may never be reached; "typical" and "typically", which describe someone else's results; "subject to part quality" and "with suitable parts", which let the supplier decide afterwards that your parts were not suitable; "best endeavours" without a measure; "industry-leading" and "state of the art"; and "to be agreed" for anything important. A phrase "A vendor can hide behind this" when it lets them avoid responsibility for a result later. A phrase is "A vendor can be held to this" when it states a measurable result, on your parts, with an owner. This is not about distrusting suppliers. Many suppliers prefer a clear specification, because it protects them too. It is about writing a document that both sides can use when something goes wrong.

**Worked example.** Sentences from a supplier's response to a specification.

> Input: "The cell achieves up to 70 parts per hour. Typical changeover is 15 minutes. Performance is subject to consistent part quality."

> Output, rewritten by the buyer as a condition of the order: "The cell achieves at least 60 good parts per hour averaged over the site acceptance run. Changeover between parts 4410 and 4415 takes no more than 20 minutes at site acceptance. Part quality is as defined in the volume section, including the burred blanks supplied as samples."

> Reading: The supplier's sentences were not false. They simply could not be enforced. The buyer's sentences use the outcomes and the samples already in the specification, so the supplier knows exactly what they are agreeing to.

**Practice.** Read your own draft specification, or a supplier's response, and underline every phrase from the list above. Rewrite each one so a vendor can be held to it.

**Check.**

- Question: "Here are sentences from a proposal for a robotic bin-picking cell. Mark each as A vendor can hide behind this or A vendor can be held to this."
- Controls: "A vendor can hide behind this" and "A vendor can be held to this".
- Sentences, correct answers, and feedback:
  1. "Pick rates of up to 900 per hour are possible." Correct: "A vendor can hide behind this". Right: "Yes. Up to and possible commit to nothing." Wrong: "Up to states a maximum, and possible makes it a hope. The vendor could deliver far less and still be right. That is a phrase a vendor can hide behind."
  2. "At site acceptance, the cell will pick at least 600 parts per hour from your bins of part 2231 over a four-hour run." Correct: "A vendor can be held to this". Right: "Yes. It states a minimum, your parts, a duration, and when it will be tested." Wrong: "This gives a minimum, on your parts, with a stated test. That is something a vendor can be held to."
  3. "Performance depends on suitable part presentation." Correct: "A vendor can hide behind this". Right: "Yes. Suitable is decided after the fact, by whoever benefits." Wrong: "Suitable is not defined, so the vendor can decide later that your presentation was not suitable. That is a phrase a vendor can hide behind."
  4. "The vendor will provide remote support by telephone within four working hours for twelve months from site acceptance." Correct: "A vendor can be held to this". Right: "Yes. It names the support, the response time, and the period." Wrong: "This names what support, how fast, and for how long. That is something a vendor can be held to."
- Pass reason: "You found the phrases that commit nobody and kept the ones with a measure, your parts, and an owner."

**Bridge.** With every part tested, the last lesson asks you to write the one-page specification.

#### Lesson 6: The specification

- **Id:** `the-specification`
- **Place:** This is the final lesson and the fourth module. You write the artefact.

**Core idea.** The one-page specification has five parts: the outcomes the cell must achieve, with any equipment constraints and their reasons; the acceptance conditions for each outcome, with the test, the parts, the duration, and the pass mark; the volume range, the part variation, the exceptions with frequency or "not yet measured", and the commitment to samples; the owners, answering the five questions from lesson 4; and a line confirming that the document has been read for phrases a vendor could hide behind. It fits on one page because it states facts and conditions, not background. It is a buyer's specification, not a contract, and your organisation's legal and procurement process still applies to the contract itself.

**Worked example.** The project lead assembles the machine-tending specification from the work in lessons 1 to 5.

> Input: the rewritten outcomes from lesson 1, the acceptance condition from lesson 2, the volume section from lesson 3, the responsibilities from lesson 4, and the buyer's rewrites from lesson 5.

> Output: "Outcomes: load and unload lathes 1 and 2 for parts 4410 and 4415; at least 60 good parts per hour across both lathes, with lathe cycle times unchanged; at least two hours unattended from a full infeed; changeover between parts in no more than 20 minutes. Constraint: robot controller from the site's approved list, to match existing spares. Acceptance: factory acceptance test on 200 of our blanks of each part, including 20 burred blanks, with every part loaded and unloaded without a stop needing a person; site acceptance on an eight-hour production run with one changeover, passing at 60 good parts per hour averaged over the run excluding the changeover, no more than three stops needing an operator, and the changeover in 20 minutes or less. Volume: normal 350 to 420 parts per shift, measured over six months; peak 480 per shift for about four weeks before the summer shutdown; mix about two-thirds 4410 and one-third 4415. Variation and exceptions: length tolerance plus or minus 0.5 millimetres; burred blanks, not yet measured; a different bar diameter about once a month. Samples: 200 blanks of each part, including 20 burred blanks, supplied before the factory acceptance test. Owners: normal stop by operators; restart after a protective stop by trained operators using the recovery card; restart after an emergency stop by the shift team leader after the cause is found; program and safety setting changes by the site robot engineer only, recorded in the change log; calls the operator cannot recover go to the shift engineer, with supplier telephone support within four working hours for twelve months from site acceptance; the integrator is responsible for the risk assessment, conformity marking, declaration, and technical file of the complete cell, as set out in the contract. Wording check: read on 4 June; up to, typical, suitable, and to the customer's satisfaction removed."

> Reading: The specification can be sent to three integrators and their responses compared line by line. Each of them has to say how they will meet 60 good parts per hour on burred blanks, and who will own the complete cell.

**Practice.** Assemble your specification from the work you have done in this course.

**Check (build the artefact).**

- Question: "Write the one-page specification for a real or planned robotics project. Each part has to be something a supplier must answer and could be held to."
- Fields: "Outcomes", "Acceptance conditions", "Volume, variation, exceptions, and samples", "Owners", "Wording check".
- Feedback for missing parts: "One of your outcomes names equipment rather than a result. Rewrite it as what must be true, or mark it as a constraint with a reason." "One of your acceptance conditions has no pass mark. Add the number or standard that decides pass." "Your volume section has no peak. Add the peak and how long it lasts." "Your volume section does not commit to samples. Say how many, including exceptions, and by when." "Your owners section does not name who is responsible for the complete cell as a machine. Name the organisation, or write open so the gap is visible." "Your specification still contains up to, typical, suitable, or to the customer's satisfaction. Replace each with a measure."
- Right feedback: "Your specification states outcomes, gives each a test with a pass mark, describes volume with a peak and exceptions with samples, names owners including for the complete cell, and removes the phrases a vendor could hide behind."

### The artefact and the record

The learner produces the one-page specification. After every check has passed, they sign their name against it. The record shows the name, the course title "Specifying a Robotics Project", the date signed, the five parts of the specification as written, and the public reference. The record states: "This record shows the specification the named person wrote in this course. It is not a contract, a risk assessment, or evidence of conformity of any machine with any regulation or standard."

### How learning is validated

The specification passes when each outcome is a measurable result or a constraint with a stated reason; each outcome has an acceptance condition with a test, parts, a duration or quantity, and a pass mark; the volume section includes a peak, at least one exception with a frequency or "not yet measured", and a commitment to samples; the owners section answers all five questions with a role or organisation or with the word "open"; and the text contains none of the flagged phrases ("up to", "typical", "typically", "suitable", "best endeavours", "to the customer's satisfaction", "to be agreed") except where the learner has written them inside quotation marks as examples. Length alone never passes.

### Sources and reading

- UK Health and Safety Executive, guidance on the Supply of Machinery (Safety) Regulations 2008 and on buying new machinery.
- ISO 10218-2, *Robotics: Safety requirements for industrial robots, Part 2: Industrial robot systems, robot applications and robot cells*, for the integrator's safety work on a complete cell.
- ISO 12100, *Safety of machinery: General principles for design, risk assessment and risk reduction*.
- IEC 62381, *Automation systems in the process industry: Factory acceptance test, site acceptance test, and site integration test*, as a reference for the structure of acceptance testing.
- ISPE, *GAMP 5*, for the practice of writing a user requirement specification before selecting a supplier, which is widely used beyond the regulated industries it was written for.
- The Made Smarter programme's public guidance for UK manufacturers adopting automation.

---

## 7. Robotics Safety and Risk

**Slug:** `robotics-safety-and-risk`

**Catalogue:** 2 hours, £129. Promise: "The questions a non-specialist asks on a floor walk, and what to escalate the same day." Modules: Shared space, Stops and zones, The floor walk, Same-day escalation.

### Who it is for

This course is for managers, supervisors, health and safety coordinators, and directors who walk areas with robots but are not robot safety specialists. They must already understand their organisation's general health and safety arrangements, including how to report an incident and who the competent safety adviser is. The course teaches what to look for and what to ask, and when to escalate. It does not make anyone a competent person for robot safety, it does not teach risk assessment of a robot cell, and it does not replace the site's specialists or the risk assessment for any installation.

### Outcome

When you finish, you can describe how a particular robot cell keeps people safe, tell an emergency stop from a protective stop and explain what each zone around a robot does, recognise signs that a safeguard has been defeated, ask the questions on a floor walk that reveal how the cell really runs, decide what must be escalated the same day and what can wait for the review, and write a floor walk note that records what you saw, what you asked, and what you escalated to whom.

### Learning objectives

1. Describe how a robot cell protects people, as either keeping people out or letting them in with a limit.
2. Distinguish an emergency stop from a protective stop and explain the purpose of warning and protective zones.
3. Recognise signs that a safeguard has been defeated.
4. Choose floor walk questions that ask to be shown rather than told.
5. Decide what to escalate the same day, and write a floor walk note with the escalations and who received them.

### Lessons

#### Lesson 1: Shared space

- **Id:** `shared-space`
- **Place:** This is the first lesson and the first module. It gives the two ideas used throughout the course to describe how a cell protects people.

**Core idea.** Robots can move quickly and with great force, and they can move without warning when a program continues after a pause. For that reason every robot installation has to protect people from contact with the robot and its tool. There are broadly two ways it does this. Some measures "Keep the person out" while the robot runs, such as fixed fencing, interlocked gates that stop the robot when opened, and light curtains across an opening. Other measures "Let the person in, with a limit", such as area scanners that slow the robot as a person approaches and stop it closer in, speed and separation monitoring, and power and force limiting on collaborative applications, as described in ISO/TS 15066. Neither approach is safe on its own merits. Each is chosen through a risk assessment for a specific cell, and each only works if it is working as designed. A robot is not safe because it is small, slow, or described as collaborative.

**Worked example.** A manager asks a cell leader how a robot welding cell protects people.

> Input, the cell leader's answer: "It's fenced all round. The loading door has an interlock, so the robot stops if you open it. There's a turntable, so the operator loads one side while the robot welds the other, and a light curtain across the loading side stops the turntable if you reach in while it is turning."

> Output, marked: "It's fenced all round" keeps the person out. "The loading door has an interlock, so the robot stops if you open it" keeps the person out. "The operator loads one side while the robot welds the other" lets the person in, with a limit, because the limit is that the operator is on the other side of a barrier from the robot. "A light curtain across the loading side stops the turntable if you reach in while it is turning" keeps the person out of the turning turntable.

> Reading: The manager now has a clear picture of what protects the operator, and therefore of what to look at on the walk: the fence, the door interlock, the barrier between sides, and the light curtain.

**Practice.** Write down how one robot cell on your site protects people, in three or four sentences. Mark each sentence "Keeps the person out" or "Lets the person in, with a limit". If you cannot write the sentences, that is the first question for your floor walk.

**Check.**

- Question: "Here is a description of how a mobile robot and a palletising robot are protected in a warehouse. Mark each sentence with Keeps the person out or Lets the person in, with a limit."
- Controls: "Keeps the person out" and "Lets the person in, with a limit".
- Sentences, correct answers, and feedback:
  1. "The palletising robot is inside a fence with an interlocked gate." Correct: "Keeps the person out". Right: "Yes. The fence and interlock keep people away while the robot runs." Wrong: "A fence and an interlocked gate stop people entering while the robot runs. That keeps the person out."
  2. "The mobile robot slows down when its scanner detects a person ahead and stops if they come closer." Correct: "Lets the person in, with a limit". Right: "Yes. People share the space, and the limit is the slowing and stopping." Wrong: "People can be in the same aisle as the robot. The limit is that it slows and stops as they approach. That lets the person in, with a limit."
  3. "Pallets are exchanged through a light curtain that mutes only when a pallet, not a person, passes through." Correct: "Keeps the person out". Right: "Yes. The light curtain is designed to let pallets through and stop the robot if a person enters." Wrong: "The light curtain is designed so that a person entering stops the robot. That keeps the person out."
  4. "Floor markings show the mobile robot's route, and people may cross them." Correct: "Lets the person in, with a limit". Right: "Yes. People may cross, and the markings and the robot's scanner are the limit." Wrong: "People are allowed to cross the route. The limit comes from the markings and the robot's own sensing. That lets the person in, with a limit."
- Pass reason: "You described how each measure protects people, either by keeping them out or by letting them in with a limit."

**Bridge.** Both approaches depend on the robot stopping when it should, and the next lesson is about stops and zones.

#### Lesson 2: Stops and zones

- **Id:** `stops-and-zones`
- **Place:** This is the second module. It gives you the vocabulary to understand what you see when a robot stops.

**Core idea.** An "Emergency stop" is a stop that a person chooses to make because of danger, by pressing a red mushroom-headed button, usually on a yellow background. Its behaviour is defined in the machine's design with reference to standards such as ISO 13850 and IEC 60204-1, and it stays stopped until someone deliberately resets it. A "Protective stop" is a stop that the safeguards make automatically, for example when an interlocked gate is opened, a light curtain is broken, a scanner detects a person too close, or a collaborative robot detects a collision. Around many robots, especially mobile robots and cells protected by scanners, the space is divided into zones. The outer "warning zone" usually causes the robot to slow down, and the inner "protective zone" causes a protective stop. The zones are set in the safety configuration, often as shapes on the floor that are not visible to the eye. A protective stop is not a fault. It is the safeguard doing its job, and a cell that makes many protective stops is telling you something about how people and the robot are working together.

**Worked example.** A manager watches a mobile robot for ten minutes and notes what she sees.

> Input: "A picker walked towards the robot and it slowed. The picker kept walking and it stopped. It started again once she moved away. Later a supervisor pressed the red button on the robot because it had caught a strap hanging off a pallet, and it stayed stopped until he reset it."

> Output: "The slowing was the warning zone. The stop when the picker came closer was a protective stop from the protective zone. The supervisor's action was an emergency stop, chosen because of danger, and it needed a deliberate reset."

> Reading: Both stops worked as designed. The manager now knows to ask how often the protective stop happens in this aisle, because a high number could mean that people and robots are sharing a space that is too tight.

**Practice.** Watch a robot on your site for ten minutes, or recall a time you did. Write down each stop you saw and mark it "Emergency stop" or "Protective stop".

**Check.**

- Question: "For each event at a robot cell, mark whether it was an Emergency stop or a Protective stop."
- Controls: "Emergency stop" and "Protective stop".
- Events, correct answers, and feedback:
  1. "An operator opened the interlocked gate to clear a jam, and the robot stopped." Correct: "Protective stop". Right: "Yes. The safeguard made the stop automatically when the gate opened." Wrong: "Nobody chose to stop the robot for danger. The interlock stopped it automatically when the gate opened. That is a protective stop."
  2. "A maintenance technician saw smoke from the robot's cable and pressed the red button on the cell panel." Correct: "Emergency stop". Right: "Yes. A person chose to stop the robot because of danger." Wrong: "A person pressed the red button because of danger. That is an emergency stop."
  3. "A collaborative robot stopped when its arm touched a box that had been left on the table." Correct: "Protective stop". Right: "Yes. The robot detected the collision and stopped itself." Wrong: "The robot detected the collision and stopped on its own. That is a protective stop."
  4. "The robot stopped when a visitor walked into the scanner's protective zone." Correct: "Protective stop". Right: "Yes. The scanner triggered the stop automatically." Wrong: "The scanner saw a person in the protective zone and stopped the robot automatically. That is a protective stop."
- Pass reason: "You told the stops that people choose because of danger from the stops that safeguards make on their own."

**Bridge.** A safeguard can only stop the robot if it has not been defeated, and the next lesson shows you how to recognise when it has.

#### Lesson 3: A defeated safeguard

- **Id:** `a-defeated-safeguard`
- **Place:** This lesson sits between the vocabulary and the floor walk. It gives you the thing you are looking for.

**Core idea.** A safeguard is "defeated" when it has been bypassed, disabled, or worked around so that it no longer protects people as it was designed to. Signs include a spare actuator or key left permanently in a gate interlock, tape or cable ties holding a switch, a gate propped open, an object placed so that a light curtain or scanner is permanently blocked or muted, a scanner that has been turned or covered, a cell running with a panel removed, and people reaching into a cell without stopping it. Safeguards are usually defeated for understandable reasons, most often because they cause stops that get in the way of production. That is not an excuse, and a defeated safeguard is a serious matter, but it is also a design signal that the cell does not fit the way people need to work, and that needs fixing as well as the safeguard. A safeguard "working" means it is present, undamaged, and stops the robot when it should. You cannot test a safeguard yourself on a floor walk unless your site procedure says you may, but you can look and ask to be shown.

**Worked example.** A manager's notes from a quick look at a packaging cell.

> Input: "Gate closed, with a spare key sitting in the interlock. A clean light curtain across the outfeed. A box of labels on the floor inside the scanner's field. Operator reached through the outfeed to straighten a case while the robot was moving."

> Output: "Spare key in the interlock: a safeguard defeated. Clean light curtain: appears to be a safeguard working, to be confirmed by asking to be shown. Box in the scanner field: possibly defeated, because an object in the field may have caused someone to reconfigure or mute it, so ask. Reaching in while the robot moves: a safeguard defeated, because the outfeed should stop the robot when anything enters."

> Reading: The manager found two definite problems and one question. The next lesson turns that question into something she can ask properly.

**Practice.** Look at one cell, or a photograph of one, and write down anything you see under "A safeguard working" and "A safeguard defeated".

**Check.**

- Question: "Here are observations from a walk around a machine-tending cell. Mark each as A safeguard working or A safeguard defeated."
- Controls: "A safeguard working" and "A safeguard defeated".
- Observations, correct answers, and feedback:
  1. "The gate is held open with a cable tie and the robot is running." Correct: "A safeguard defeated". Right: "Yes. The gate can no longer stop the robot, because it is held open." Wrong: "A gate held open while the robot runs cannot protect anyone. That is a safeguard defeated."
  2. "When the operator opened the gate at the end of the cycle, the robot stopped and the panel showed a gate-open message." Correct: "A safeguard working". Right: "Yes. The interlock stopped the robot when the gate opened." Wrong: "The robot stopped when the gate opened and the panel reported it. That is a safeguard working."
  3. "A piece of cardboard has been taped over part of the area scanner's window." Correct: "A safeguard defeated". Right: "Yes. Covering a scanner can stop it detecting people." Wrong: "Covering part of the scanner can stop it seeing a person. That is a safeguard defeated, even if someone meant it as a quick fix for nuisance stops."
  4. "The emergency stop button on the panel is unobstructed, with its label legible." Correct: "A safeguard working". Right: "Yes. It is present and reachable. Whether it has been tested is a question to ask." Wrong: "The button is there and reachable. As far as you can see on a walk, that is a safeguard working. You can ask when it was last tested."
- Pass reason: "You recognised the signs that a safeguard has been bypassed and kept them apart from what looks like a safeguard doing its job."

**Bridge.** Some things you can see, and others you have to ask, which is where the floor walk comes in.

#### Lesson 4: The floor walk

- **Id:** `the-floor-walk`
- **Place:** This is the third module. It gives you the questions a non-specialist asks.

**Core idea.** A floor walk is a visit to where the work happens, to see how it really runs and to talk to the people who run it. It is not an inspection, an audit, or a test of the safeguards, and you should say so to the people you talk to. The most useful floor walk questions ask to be shown rather than told, and they ask about what actually happens rather than what should happen. Good questions include: "Show me what stops the robot if someone walks in." "When did it last stop unexpectedly, and what happened?" "What do you do when it jams?" "Who is allowed to change the robot's program or its safety settings?" "When were the emergency stops last tested, and where is that recorded?" "Where is the risk assessment for this cell, and when was it last reviewed?" Questions that invite a simple yes, such as "Is it safe?" or "Do you follow the procedure?", tell you very little, because the honest answer and the convenient answer are the same word.

**Worked example.** Two managers walk the same cell.

> Input, manager one: "Is everything OK here? Are you following the procedures? Any problems?"

> Input, manager two: "Show me what happens when it jams. When did it last jam? What did you do? Who can change the program if the jam keeps happening?"

> Output: Manager one hears "Yes, fine, no problems." Manager two is shown that the operator clears jams by reaching in through the outfeed after pausing the robot at the pendant, that it jams several times a shift, and that nobody has asked the engineer to look at it.

> Reading: Both managers were polite and interested. Only one asked to be shown what happens, and only one found out how the cell really runs.

**Practice.** Write five questions for a floor walk at a cell on your site. Check each one: does it ask to be shown, and does it ask what actually happens?

**Check.**

- Question: "Two managers have prepared questions for a floor walk at a robotic palletiser. Choose the set of questions that will reveal how the cell really runs."
- Controls: "Set A" and "Set B".
- Set A: "Is the cell safe? Has everyone been trained? Do you follow the lockout procedure?"
- Set B: "Show me what you do when a case falls inside the cell. When did that last happen? Show me the lockout point you use. When were the emergency stops last tested, and where is it written down?"
- Correct: "Set B".
- Right feedback: "Yes. Set B asks to be shown and asks what actually happened, so the answers describe the real cell."
- Wrong feedback: "Every question in Set A can be answered with yes, and yes is both the honest answer and the convenient one. Choose the set that asks to be shown."
- Pass reason: "You chose the questions that ask to be shown what happens, not whether things are fine."

**Bridge.** A floor walk sometimes finds something that cannot wait, and the next lesson decides what to escalate the same day.

#### Lesson 5: Same-day escalation

- **Id:** `same-day-escalation`
- **Place:** This is the fourth module. It sets the line between what cannot wait and what goes to the regular review.

**Core idea.** Some findings must be escalated the same day, which means the person responsible for the area and your site's safety contact are told before the end of the shift, in person or by telephone, and it is recorded. In this course these are labelled "Escalate today". They include any safeguard that has been defeated; any emergency stop that is missing, blocked, or does not work; any contact between a robot and a person, even without injury; any unexpected robot motion; anyone entering a cell under power without following the procedure; and damage to guarding. If a person is in immediate danger, stop the machine first using the emergency stop, and escalate afterwards. Other findings, such as frequent nuisance stops, housekeeping, worn floor markings, or a risk assessment that is due for review, are labelled "Raise at the review" and go to the next safety meeting or cell review with a named owner. Some incidents also have to be reported to the Health and Safety Executive under RIDDOR, and the responsible person at your site decides that. It is not the job of the floor walk to decide it, but it is the job of the floor walk to make sure the responsible person knows.

**Worked example.** The manager from lesson 3 sorts her findings.

> Input: "Spare key in the gate interlock. Operator reaches through the outfeed while the robot moves. The outfeed jams several times a shift. Floor markings worn near the cell."

> Output: "Escalate today: the spare key in the interlock, and the reaching through the outfeed, told to the shift manager at 14:20 and to the site safety adviser by telephone at 14:30, and recorded in the safety log. Raise at the review: the frequent jams, which are the likely reason for reaching in, owned by the production engineer; the worn floor markings, owned by facilities."

> Reading: The defeated safeguard and the unsafe practice could not wait until the next meeting. The jams are the underlying cause and need an engineer, which is work for the review, but the manager has linked them so the root cause is not forgotten.

**Practice.** Take the findings from your own floor walk, or the examples in this lesson, and mark each "Escalate today" or "Raise at the review".

**Check.**

- Question: "Here are findings from a floor walk at a robot assembly line. Mark each as Escalate today or Raise at the review."
- Controls: "Escalate today" and "Raise at the review".
- Findings, correct answers, and feedback:
  1. "An operator says the robot brushed her shoulder yesterday, but she was not hurt and did not report it." Correct: "Escalate today". Right: "Yes. Any contact between a robot and a person is escalated the same day, even without injury." Wrong: "Contact between a robot and a person is escalated the same day, whether or not anyone was hurt. It may show that a safeguard or a setting is not working."
  2. "The cell stops on the scanner several times an hour because trolleys are parked too close." Correct: "Raise at the review". Right: "Yes. The safeguard is working. The layout needs fixing, and that goes to the review with an owner." Wrong: "The scanner is doing its job. The nuisance stops are a layout problem to raise at the review with an owner, unless you see someone defeating the scanner to avoid them."
  3. "The emergency stop on the operator panel has a tool trolley parked in front of it." Correct: "Escalate today". Right: "Yes. A blocked emergency stop is escalated the same day, and the trolley should be moved at once." Wrong: "An emergency stop that cannot be reached quickly is as bad as a missing one. Have the trolley moved and escalate it today."
  4. "The cell's risk assessment is due for its annual review next month." Correct: "Raise at the review". Right: "Yes. It is not overdue, and it goes to the review with an owner." Wrong: "Nothing is wrong today. A review coming due is raised at the review so an owner can plan it."
- Pass reason: "You escalated what cannot wait and sent the rest to the review with an owner."

**Bridge.** The last lesson asks you to write the floor walk note that records all of this, and that note is what appears on your record.

#### Lesson 6: The floor walk note

- **Id:** `the-floor-walk-note`
- **Place:** This is the final lesson. You write the artefact.

**Core idea.** The floor walk note is the written record of one floor walk. It has five parts: the cell, the date, and the time; how the cell protects people, in terms of keeping people out or letting them in with a limit; the questions you asked and what you were shown; what you escalated today, to whom, and when; and what you will raise at the review, with an owner for each item. It is written the same day, in plain sentences, and it records what you saw rather than what you assume. It is not an inspection report and it does not certify that the cell is safe. It is evidence that a manager looked, asked, and acted.

**Worked example.** The manager from lessons 3 and 5 writes up her walk of the packaging cell.

> Input: her notes of what she saw, the questions she asked, and her sorting of findings into escalate today and raise at the review.

> Output: "Cell: case packer 2, walked on 9 October at 13:45. Protection: fenced with an interlocked gate, which keeps the person out; a light curtain across the outfeed, which keeps the person out; an area scanner at the infeed, which lets the person in, with a limit, by slowing and then stopping the robot. Questions and what I was shown: I asked the operator to show me what he does when the outfeed jams. He showed me that he pauses the robot at the pendant and reaches through the outfeed. I asked when it last jammed. He said about an hour ago, and that it jams several times a shift. I asked who can change the program if the jam keeps happening. He did not know. I saw a spare key sitting in the gate interlock and a box of labels on the floor inside the scanner's field. Escalated today: the spare key in the interlock and the reaching through the outfeed, told to the shift manager in person at 14:20, and to the site safety adviser by telephone at 14:30, and recorded in the safety log. The key was removed at 14:25. I also asked the controls engineer, at 14:35, to confirm today whether the scanner has been reconfigured or muted around the box of labels, because if it has, it is a defeated safeguard. To raise at the review: frequent outfeed jams, which are the likely reason for reaching in, owned by the production engineer; worn floor markings near the cell, owned by facilities."

> Reading: Anyone reading the note can see what she looked at, what she was shown, and exactly who was told about the defeated safeguard and when.

**Practice.** Draft the note for a floor walk you have done or will do this week.

**Check (build the artefact).**

- Question: "Write the floor walk note for one robot cell you have walked or will walk. Each part has to record what you saw, asked, and did."
- Fields: "Cell, date, and time", "How the cell protects people", "Questions asked and what I was shown", "Escalated today, to whom, and when", "To raise at the review, with owners".
- Feedback for missing parts: "Your protection field does not describe any measure. Say how the cell keeps people out or lets them in with a limit." "Your questions field contains only questions that can be answered yes or no. Include at least one that asks to be shown." "Your escalation field names a finding but not who you told or when. Add both." "If you escalated nothing today, write nothing escalated today so the reader knows you considered it." "One item for the review has no owner. Name a role."
- Right feedback: "Your note records the cell, how it protects people, the questions you asked and what you were shown, what you escalated today with who and when, and what goes to the review with owners."

### The artefact and the record

The learner produces a floor walk note. After every check has passed, they sign their name against it. The record shows the name, the course title "Robotics Safety and Risk", the date signed, the five parts of the note as written, and the public reference. The record states: "This record shows the floor walk note the named person wrote in this course. It is not a safety inspection, a risk assessment, or a safety sign-off, and it does not certify that any person or machine meets any regulation or standard, including ISO 10218 and ISO/TS 15066."

### How learning is validated

The note passes when the protection field describes at least one measure; the questions field contains at least one question that asks to be shown or asks what actually happened; the escalation field either names each finding with a role and a time or states "nothing escalated today"; every review item has an owner; and every finding the learner describes as a defeated safeguard, a blocked or missing emergency stop, a contact, or an unexpected motion appears in the escalation field rather than the review field. That last test is the one that matters most, because it checks the judgement taught in lesson 5. Length alone never passes.

### Sources and reading

- UK Health and Safety Executive, web guidance on industrial robots and robot safety.
- UK Health and Safety Executive, *Safe use of work equipment: Provision and Use of Work Equipment Regulations 1998, Approved Code of Practice and guidance* (L22).
- UK Health and Safety Executive, guidance on RIDDOR, the Reporting of Injuries, Diseases and Dangerous Occurrences Regulations 2013.
- UK Health and Safety Executive, guidance on leadership and worker involvement in health and safety, including the value of managers visiting the workplace.
- ISO 10218-1 and ISO 10218-2, safety requirements for industrial robots and robot systems.
- ISO/TS 15066, collaborative robots.
- ISO 13850, emergency stop function, and ISO 13855, positioning of safeguards with respect to the approach speeds of parts of the human body.
- ISO 3691-4, driverless industrial trucks and their systems, for mobile robots.

---

## 8. Running a Robotic Cell

**Slug:** `running-a-robotic-cell`

**Catalogue:** 2.5 hours, £129. Promise: "A shift card: start, normal, recover, hand over." Modules: Start of shift, What normal looks like, Recover, then escalate, The shift card.

### Who it is for

This course is for operators, cell leaders, and new technicians who run a guarded industrial robot cell during a shift, for example a welding, machine-tending, palletising, or assembly cell. They must already have been authorised by their employer to operate the cell and have been shown its controls and its site procedures. The course teaches how to run a shift well and how to write it down on a shift card. It does not replace the manufacturer's training or the site's written procedures, and it does not cover entering a cell for maintenance, which needs the site's isolation procedure and appropriate authorisation.

### Outcome

When you finish, you can carry out a start of shift in an order that protects each following step, describe what normal looks like for your cell in numbers and observations, notice drift before it becomes a stop, recover an ordinary stop and know when to stop recovering and escalate, write a log entry that the next shift can act on, and put all of this onto a one-page shift card for your cell.

### Learning objectives

1. Order the start-of-shift checks so that each one protects the next.
2. Describe normal for a cell in measurable terms, including cycle time, stops, and quality.
3. Tell a reading that is normal from one that shows drift.
4. Recover an ordinary stop in order, and name the conditions that turn a recovery into an escalation.
5. Write a shift card for your own cell covering start, normal, recover, and hand over.

### Lessons

#### Lesson 1: Start of shift

- **Id:** `start-of-shift`
- **Place:** This is the first lesson and the first module. It is the first section of the shift card.

**Core idea.** The start of shift is the routine between arriving at the cell and running production. Its purpose is to make sure the cell is in the state you think it is before you rely on it. A good start of shift follows this order: read the handover and the log from the last shift; walk round the outside of the cell and look at the guarding, gates, and light curtains for damage or anything that looks bypassed; confirm that the emergency stops are unobstructed, and test them if your site procedure says the operator does so at the start of shift; check consumables such as wire, gas, tips, grippers, or pallets; confirm the correct robot program and part number are selected; then run and check the first part, often called a first-off check, before running at full rate. Each step protects the next. If you check consumables before reading the handover, you may miss that the last shift changed a tip that needs watching. The start of shift is not the time to change settings. If something is wrong, the procedure is to stop and escalate, not to adjust.

**Worked example.** An operator on a robotic welding cell describes two starts.

> Input, Monday: "I selected the program, started the cell, and then read the log while the first frames were welding. The log said the wire feeder had slipped at the end of the night shift."

> Output, Tuesday: "I read the log first. It said the torch tip had been changed at 05:00. I walked the guarding and found the loading door interlock cover cracked, which I reported before starting. I confirmed the emergency stops were clear. I checked the wire and gas. I selected the program for frame 7702, ran one frame, and checked the welds against the inspection card before running at rate."

> Reading: On Monday, the first several frames were welded with a feeder that the last shift had already warned about. On Tuesday, the warning was read before anything ran, and the cracked cover was found before anyone relied on that door.

**Practice.** Write your cell's start of shift as a list in the order you do it. Compare it with the lesson and mark any step your site adds or requires in a different order.

**Check.**

- Question: "Put these start-of-shift steps for a robotic machine-tending cell in the order this lesson taught."
- Control: an ordering list with: "Read the handover and the log from the last shift.", "Walk round the cell and look at the guarding, gates, and light curtains.", "Confirm the emergency stops are unobstructed.", "Check the gripper and the infeed of blanks.", "Confirm the correct program and part number are selected.", "Run one part and check it before running at rate."
- Correct order: as listed above.
- Right feedback: "Yes. You read what the last shift said, made sure the protection was intact, checked what the cell needs to run, confirmed what it will run, and checked the first part before relying on it."
- Wrong feedback when the log is not first: "Reading the log is not first in your order. A warning from the last shift is only useful if you read it before you act. Move it to the top."
- Wrong feedback when the program is confirmed after the first part: "In your order the first part runs before you have confirmed the program. Confirm what the cell will run before it runs."
- Wrong feedback when guarding is checked after running: "In your order the cell runs before you have looked at the guarding. Look at the protection before you rely on it."
- Wrong feedback for any other misordering: "Look again at which step protects the next. Each check in the start of shift makes the following one safe to rely on."
- Pass reason: "Your start of shift makes sure the cell is in the state you think it is before you run it at rate."

**Bridge.** Once the cell is running you need to know what normal looks like, which is the next lesson.

#### Lesson 2: What normal looks like

- **Id:** `what-normal-looks-like`
- **Place:** This is the second module. It is the second section of the shift card.

**Core idea.** Normal is the range of readings and observations your cell shows when it is running well. It includes numbers, such as cycle time, parts per hour, the number of stops in a shift and their usual causes, first-pass yield, and the scrap count, and it includes observations, such as the sound of the cell, the look of a good part, and the alarms that appear routinely and mean little. You learn normal from the cell's records, from experienced colleagues, and from watching it on good days. Normal is not a single perfect number. It is a range, and it is specific to your cell, your parts, and your shift. Writing normal down matters because without it, people only notice a problem when the cell stops, and by then the scrap, the damage, or the near miss has already happened.

**Worked example.** A cell leader writes down normal for a palletising cell.

> Input: "It runs fine most of the time."

> Output: "Cycle: one case every 5 to 6 seconds. Pallets: about 28 per shift. Stops: usually two to four per shift, mostly a case skewed on the infeed conveyor. Wrap: film tight, no tails. Sound: a steady rhythm; a clunk at the gripper means a case has been gripped off-centre. Routine alarm: low film warning about twice a shift, which is normal."

> Reading: The numbers belong to the example. "Runs fine" could not tell a new operator anything. The written version tells them what to expect and therefore what to notice when it changes.

**Practice.** Write down normal for your cell under numbers and observations. Where you do not know the range, write "to be found from the records" and name who could tell you.

**Check.**

- Question: "Two cell leaders have written down what normal looks like for a robotic machine-tending cell. Choose the description a new operator could use to notice a change."
- Controls: "Description A" and "Description B".
- Description A: "Normally it runs well and the parts come out fine. It stops now and then, but nothing serious."
- Description B: "Cycle: 42 to 45 seconds per part. Stops: one to three per shift, usually a blank not seated on the infeed. Quality: first-off part checked against the gauge at the start of each batch; scrap usually no more than two parts a shift. Sound: a smooth whirr and a click as the chuck closes; a double click means the chuck has re-gripped. Routine alarm: coolant low, about once a shift, which is normal."
- Correct: "Description B".
- Right feedback: "Yes. Description B gives numbers as ranges, the usual causes of stops, and the observations a person would notice, so a new operator can tell when something changes."
- Wrong feedback: "Description A uses words such as well, fine, and now and then, which mean something different to every reader. It has no numbers and no observations. Choose the description with ranges and things you would see or hear."
- Pass reason: "You chose the description of normal that is written as ranges and observations, which is what lets anyone notice drift."

**Bridge.** Once normal is written down, you can see drift, which is the next lesson.

#### Lesson 3: Drift

- **Id:** `drift`
- **Place:** This lesson completes the second module by teaching you to read the numbers against normal.

**Core idea.** Drift is a steady move away from normal that has not yet caused a stop. Examples are a cycle time creeping up by a second over a shift, stops for the same cause becoming more frequent, a weld bead gradually changing shape, or a gripper that needs two attempts more often. In this course a reading is "Normal for this cell" when it is inside the range you wrote down in lesson 2, and it is "Drift worth noting" when it is outside that range or moving steadily towards the edge of it. Drift is important because it gives you time to act before a stop, scrap, or damage. It is not the same as a single odd reading, which can happen for an ordinary reason, and it is not a reason to change settings yourself. It is a reason to note it in the log and, if it continues, to tell the person named on the shift card.

**Worked example.** The palletising cell leader's readings at mid-shift.

> Input: "Cycle 5.5 seconds. 14 pallets. Three stops, all skewed cases. Film tight. One low film warning. Gripper has clunked about ten times in the last hour, usually once or twice an hour."

> Output: "Cycle: normal for this cell. Pallets: normal for this cell at mid-shift. Stops: normal for this cell. Film: normal for this cell. Low film warning: normal for this cell. Gripper clunks: drift worth noting, because the rate has gone well above normal."

> Reading: Everything except one observation is inside normal. The clunks suggest cases are being gripped off-centre more often, which could lead to dropped cases. The cell leader logs it and asks the shift engineer to look at the infeed alignment before it becomes a stop.

**Practice.** Take your cell's readings from a recent shift and mark each one against your normal.

**Check.**

- Question: "A robotic welding cell's normal is: cycle 95 to 100 seconds, two to four stops per shift, first-pass yield above the level on the inspection card, and tip changes every four hours. Mark each reading from today."
- Controls: "Normal for this cell" and "Drift worth noting".
- Readings, correct answers, and feedback:
  1. "Cycle 97 seconds." Correct: "Normal for this cell". Right: "Yes. It is inside the 95 to 100 second range." Wrong: "97 seconds is inside the range written for this cell. That is normal for this cell."
  2. "Cycle 99 seconds at 10:00, 101 at 11:00, 103 at 12:00." Correct: "Drift worth noting". Right: "Yes. The cycle is moving steadily upwards and has left the range." Wrong: "Each reading is higher than the last and the latest two are outside the range. A steady move away from normal is drift worth noting."
  3. "Three stops so far, all for a part not seated in the fixture." Correct: "Normal for this cell". Right: "Yes. Three stops is inside the usual two to four." Wrong: "Three stops is inside the range for this cell. That is normal, although you would note it if the count kept rising."
  4. "The tip needed changing after two hours, not four." Correct: "Drift worth noting". Right: "Yes. The tip is wearing twice as fast as normal." Wrong: "Tip changes are normally every four hours. Needing one after two is outside normal, so it is drift worth noting."
- Pass reason: "You compared each reading with the cell's written normal and found the ones moving away from it."

**Bridge.** Drift that is missed becomes a stop, and the next lesson teaches you to recover a stop and when to escalate instead.

#### Lesson 4: Recover, then escalate

- **Id:** `recover-then-escalate`
- **Place:** This is the third module. It is the third section of the shift card.

**Core idea.** When the cell stops for an ordinary reason, the recovery follows an order: read the message on the panel and note the time; look from outside the cell to find the cause; if the cause can be cleared without entering the cell, or by entering only in the way your site procedure allows, clear it; check that nobody is inside the cell and that the gates are closed; reset as the procedure says; restart and watch the next full cycle. You escalate instead of recovering when the same stop has happened several times this shift; when clearing the cause would mean changing the program, the positions, or any safety setting; when entering the cell would need an isolation that you are not authorised to do; when there is damage to the robot, tooling, cables, or guarding; when anyone was hurt or nearly hurt; when the robot moved unexpectedly; or when you do not understand the message. The number of repeats that means "several" should be written on your shift card, agreed with your cell leader. Escalating is part of running the cell, not a failure to run it.

**Worked example.** An operator records a stop on a machine-tending cell.

> Input: "10:40, stop, gripper failed to close. I opened the gate and pushed the part back into position, closed the gate, reset, and it ran. 11:05, same. 11:20, same. 11:35, same, and I did it again."

> Output, as it should have gone: "10:40, gripper failed to close. From outside the cell I could see the part was not fully seated on the infeed. I opened the gate following the procedure, reseated it, checked nobody was inside, closed the gate, reset, and watched the next cycle. 11:05, same stop, same cause. Recovered as before. 11:20, same stop for the third time, which is our limit on the shift card, so I called the shift engineer at 11:22."

> Reading: Every recovery on its own was done correctly. The escalation limit on the shift card is what stopped the pattern turning into an hour of repeated recoveries.

**Practice.** Write your cell's recovery order in steps, and your list of escalation triggers, including the number of repeats agreed for your cell.

**Check.**

- Question: "A palletising cell has stopped with the message 'case not detected at gripper'. Put these recovery steps in the order this lesson taught."
- Control: an ordering list with: "Read the message on the panel and note the time.", "Look from outside the cell to find the cause.", "Clear the cause as the site procedure allows.", "Check nobody is inside and the gates are closed.", "Reset as the procedure says.", "Restart and watch the next full cycle."
- Correct order: as listed above.
- Right feedback: "Yes. You found the cause before clearing it, made sure the cell was clear and closed before resetting, and watched the next cycle."
- Wrong feedback when reset comes before finding the cause: "In your order you reset before finding the cause. The cell will usually stop again for the same reason. Find the cause first."
- Wrong feedback when restart comes before checking the cell is clear: "In your order the cell restarts before you have checked that nobody is inside and the gates are closed. Check that first."
- Wrong feedback for any other misordering: "Look again at why each step is there. You cannot clear a cause you have not found, and you should not reset a cell you have not checked is clear."
- Pass reason: "Your recovery finds and clears the cause, checks the cell is clear, and only then resets and restarts."

**Bridge.** Every stop, drift, and escalation has to reach the next shift, and the next lesson teaches you to write it down.

#### Lesson 5: The log entry

- **Id:** `the-log-entry`
- **Place:** This lesson prepares the handover section of the shift card.

**Core idea.** A log entry is a short written record of an event during the shift: a stop, a drift, an escalation, a change of consumable, or anything the next shift should know. A useful entry has four facts: the time; what happened, in terms of the message and what you saw; what you did, including anything you escalated and to whom; and the state the cell was left in. A log entry is not a diary and it is not an opinion about the cell or a colleague. It is also not the same as a report of an injury or near miss, which follows the site's own reporting procedure as well as appearing in the log. The next shift reads the log first at their start of shift, so an entry that leaves out what you did or the state you left the cell in forces them to guess.

**Worked example.** Two entries about the same event.

> Input, entry one: "Gripper playing up again. Sorted it."

> Input, entry two: "11:20, third 'gripper failed to close' stop this shift, part not seated on infeed each time. Recovered twice, then called Sam, shift engineer, at 11:22. Sam adjusted the infeed guide at 11:40. No repeat since. Cell running normally at handover. Watch the infeed guide."

> Reading: Entry one tells the next shift there was a problem and nothing else. Entry two tells them what, when, who knows, what was done, and what to watch.

**Practice.** Rewrite a recent log entry from your cell with the four facts.

**Check.**

- Question: "Two log entries have been written about a scanner stop on a robotic assembly line. Choose the entry the next shift could act on."
- Controls: "Entry A" and "Entry B".
- Entry A: "Scanner kept stopping it. Annoying. Someone should look at it."
- Entry B: "14:10 to 15:30, six protective stops from the area scanner, each when a trolley was parked by the parts rack. Moved the trolleys and marked a no-parking area with tape. Told Jo, cell leader, at 15:35, and it goes to the cell review. No stops since 15:30. Running normally at handover."
- Correct: "Entry B".
- Right feedback: "Yes. Entry B gives the time, what happened, what was done and who was told, and the state at handover."
- Wrong feedback: "Entry A gives a feeling and a wish, but not when, what caused it, what was done, or the state the cell was left in. Choose the entry with the four facts."
- Pass reason: "You chose the entry with the time, what happened, what you did, and the state the cell was left in."

**Bridge.** You now have everything for the shift card, which the last lesson asks you to write.

#### Lesson 6: The shift card

- **Id:** `the-shift-card`
- **Place:** This is the final lesson and the fourth module. You write the artefact.

**Core idea.** The shift card is one page for one cell. It has four sections, in the order of a shift. "Start" lists the start-of-shift steps in order. "Normal" gives the numbers and observations that describe normal for this cell. "Recover" gives the recovery order and the escalation triggers, including the number of repeats that means escalate, and who to call on each shift. "Hand over" says what the log entry at the end of the shift must contain. The card does not replace the site's written procedure. It should point to it, and anything on the card that differs from the procedure must be taken to the cell leader to resolve. A good card is one a new operator could follow on their first shift after being shown the cell.

**Worked example.** The palletising cell leader's card.

> Output: "Start: read the log; walk the guarding and light curtains; confirm the emergency stops are clear; check film and pallet magazine; confirm program for the current product; run one pallet layer and check pattern. Normal: one case every 5 to 6 seconds; about 28 pallets a shift; two to four stops, mostly skewed cases; film tight; low film warning about twice a shift; gripper clunk once or twice an hour. Recover: read message and time; look from outside; clear as the procedure allows; check cell clear and gates closed; reset; watch next cycle. Escalate on the third repeat of any stop, any damage, any program or safety setting change, any contact or unexpected motion, or a message you do not understand. Call the shift engineer on days and nights. Hand over: time, what happened, what you did and who you told, and the state of the cell. Site procedure: SOP-PAL-03."

> Reading: The card fits on one page and a new operator could run a shift from it after being shown the cell.

**Practice.** Draft the card for your own cell.

**Check (build the artefact).**

- Question: "Write the shift card for a cell you run or will run. Each section has to be something a new operator could follow."
- Fields: "Start", "Normal", "Recover and escalate", "Hand over", "Site procedure reference".
- Feedback for missing parts: "Your start section does not begin with reading the log. Put it first." "Your normal section has no numbers. Add at least a cycle time or a stop count." "Your recover section has no escalation triggers. Add them, including the number of repeats that means escalate." "Your recover section does not say who to call. Name the role for each shift." "Your hand over section does not list the four facts. Add the time, what happened, what you did and who you told, and the state of the cell." "Your site procedure reference is empty. Name the procedure, or write none found and ask your cell leader."
- Right feedback: "Your card gives the start in order, describes normal in numbers and observations, sets out the recovery with its escalation triggers and who to call, says what the handover must contain, and points to the site procedure."

### The artefact and the record

The learner produces a shift card for one cell. After every check has passed, they sign their name against it. The record shows the name, the course title "Running a Robotic Cell", the date signed, the five parts of the shift card as written, and the public reference. The record states: "This record shows the shift card the named person wrote in this course. It does not authorise the person to operate any machine, and it is not a site procedure or a record of training under any regulation or standard."

### How learning is validated

The shift card passes when the start section begins with reading the log and places the first-part check last; the normal section contains at least one number and one observation; the recover section contains the recovery steps in the taught order, at least three escalation triggers, a repeat limit written as a number, and a role to call; the hand over section contains the four facts; and the site procedure field has a reference or "none found". Length alone never passes.

### Sources and reading

- UK Health and Safety Executive, web guidance on industrial robots.
- UK Health and Safety Executive, *Safe use of work equipment* (L22), for the duties to provide information, instruction, and training on work equipment.
- UK Health and Safety Executive, human factors guidance on shift handover and safety-critical communication.
- UK Health and Safety Executive, guidance on safe maintenance and isolation, so the learner knows why entering a cell for maintenance is a separate, authorised activity.
- ISO 10218-2, the safety standard for industrial robot systems and cells.
- The operating manual for your robot controller from its manufacturer, for example ABB, FANUC, KUKA, or Yaskawa, which is the authority on what your messages mean.

---

## 9. Vision Systems and Automated Inspection

**Slug:** `vision-systems-and-automated-inspection`

**Catalogue:** 2 hours, £129. Promise: "What the camera is judging, how it fails quietly, and what a person still checks." Modules: The judgement, The quiet failure, The human check, The inspection brief.

### Who it is for

This course is for quality engineers, quality managers, production managers, and inspection team leaders who rely on, buy, or are responsible for a camera-based inspection system on a production line. They must already know the product being inspected and its quality requirements. A general understanding of quality inspection, such as the difference between a defect and a variation within tolerance, is assumed. No knowledge of optics or image processing is needed.

### Outcome

When you finish, you can state exactly what a vision system is judging and what it is not, explain the two ways it can be wrong and how the threshold trades one against the other, recognise the ways it can fail without raising an alarm, write a start-of-shift check that proves it can still see a defect, decide what a person must still check, and put all of this into an inspection brief that a colleague could use to run or audit the system.

### Learning objectives

1. State the features a vision system measures and the judgements it does not make.
2. Distinguish a false reject from a false accept and explain what moving the threshold does to each.
3. Identify causes of quiet failure and interpret a falling reject rate with caution.
4. Write a challenge test using known-bad parts, including what to do if it fails.
5. Decide which checks remain with a person, and write an inspection brief.

### Lessons

#### Lesson 1: What the camera is judging

- **Id:** `what-the-camera-judges`
- **Place:** This is the first lesson and the first module. It sets the limits of what the system can tell you.

**Core idea.** A vision inspection system takes an image of a part under set lighting, looks at particular features it has been configured to find, measures them, and compares the measurement with a threshold to decide pass or fail. A feature might be the presence of a label, the position of a hole, the width of a seal, the colour of a patch, or the count of dark pixels in an area where a scratch would appear. Some systems use trained models rather than hand-set rules, but they still decide on the basis of what they were shown during training and set up to look for. So the system answers only the questions it was configured to answer, in the region of the image it was told to look at. It does not "see" the part the way an inspector does, and it will not notice a defect of a kind it was never shown or in a place it was not told to look. In this course a statement is "A feature the system measures" when it describes something configured and measured, and "A judgement the system does not make" when it describes something outside that configuration.

**Worked example.** A quality manager reads the setup sheet of a label inspection system on a bottling line.

> Input: "Checks: label present; label position within 2 millimetres of nominal; barcode readable; batch code printed in the code window."

> Output, marked against a list of things people assumed it checked: "Label present: a feature the system measures. Label position: a feature the system measures. Barcode readable: a feature the system measures. Batch code correct for today: a judgement the system does not make, because it checks only that a code is printed. Label torn at the edge: a judgement the system does not make, unless a check for tears was configured. Bottle cracked: a judgement the system does not make."

> Reading: The system does exactly what its setup sheet says, and the line team had assumed it did more. The batch code finding is the important one, because the system would pass a bottle printed with yesterday's code.

**Practice.** Find the setup sheet or configuration summary for a vision system you rely on. List what it measures. Then list three things people on the line assume it checks, and mark each.

**Check.**

- Question: "A supplier has described a vision system for inspecting moulded caps. Mark each statement as A feature the system measures or A judgement the system does not make."
- Controls: "A feature the system measures" and "A judgement the system does not make".
- Statements, correct answers, and feedback:
  1. "The system measures the outside diameter of each cap and fails caps outside the drawing tolerance." Correct: "A feature the system measures". Right: "Yes. The diameter is configured and measured." Wrong: "This describes a configured measurement with a threshold. That is a feature the system measures."
  2. "The system will catch any defect an inspector would see." Correct: "A judgement the system does not make". Right: "Yes. The system catches only what it was configured or trained to look for." Wrong: "No system measures any defect. It measures what it was set up to measure. This is a judgement the system does not make."
  3. "The system checks for black specks in the top face of the cap within the region configured." Correct: "A feature the system measures". Right: "Yes. It is a configured check in a defined region." Wrong: "This names a defect type and a region. That is a feature the system measures."
  4. "The system confirms the cap will seal on the bottle." Correct: "A judgement the system does not make". Right: "Yes. Sealing depends on things a camera looking at the cap cannot measure." Wrong: "Whether the cap seals depends on its fit and the bottle, which a camera on the cap alone does not measure. This is a judgement the system does not make."
- Pass reason: "You separated what the system actually measures from what people might assume it judges."

**Bridge.** Even within what it measures, the system can be wrong in two different ways, which the next lesson explains.

#### Lesson 2: Two ways to be wrong

- **Id:** `two-ways-to-be-wrong`
- **Place:** This lesson completes the first module by explaining the threshold.

**Core idea.** An inspection decision can be wrong in two ways. A "False reject" is a good part that the system fails. A "False accept" is a bad part that the system passes, which is sometimes called an escape. The threshold sits between the two. Moving it to catch more bad parts will also reject more good ones, and moving it to reject fewer good parts will let more bad ones through. False rejects are visible, because they pile up in the reject bin and cost money, so there is constant pressure to loosen the threshold. False accepts are invisible at the line, because the part looks like a pass, and they are usually discovered later, by a later process or by the customer. Neither kind of error can be driven to zero, and a decision about the threshold is a decision about which error your organisation will accept more of. It is not a technical detail to be left to whoever is nearest the screen.

**Worked example.** A line manager asks to loosen a seal inspection threshold.

> Input: "The seal checker is rejecting too many good pouches. Can we open up the threshold?"

> Output, the quality engineer's reply: "The rejects we reviewed yesterday were mostly good pouches, so these are false rejects. If we open the threshold, we will reject fewer good pouches, but some narrow seals that are genuinely weak will also start to pass, which would be false accepts, and we would not see them until a customer complaint. Before we move it, let's find why good pouches look narrow to the camera. It may be lighting or position."

> Reading: The engineer named both errors and refused to trade an invisible one for a visible one without understanding the cause.

**Practice.** For a system you know, describe one recent false reject and, if you know of one, one false accept. For each, write where it was discovered.

**Check.**

- Question: "Mark each event at a vision inspection station on a tablet line as a False reject or a False accept."
- Controls: "False reject" and "False accept".
- Events, correct answers, and feedback:
  1. "A tablet with a chipped edge passed the camera and was found at packing." Correct: "False accept". Right: "Yes. A bad tablet passed and was found later." Wrong: "The tablet was defective and the system passed it. That is a false accept, found downstream as they usually are."
  2. "A good tablet with a slightly darker colour, within specification, was rejected." Correct: "False reject". Right: "Yes. A good tablet was failed." Wrong: "The tablet was within specification and the system failed it. That is a false reject."
  3. "After the threshold was loosened, tablets with small surface marks started to pass and were found at the customer's goods-in." Correct: "False accept". Right: "Yes. Loosening the threshold let defective tablets through." Wrong: "These tablets were defective and passed. Loosening the threshold traded fewer false rejects for these false accepts."
  4. "A tablet dusted with powder from the press was rejected, and on review it was within specification." Correct: "False reject". Right: "Yes. A good tablet looked bad to the camera and was failed." Wrong: "On review the tablet was good, but the system failed it. That is a false reject."
- Pass reason: "You told the good parts that were failed from the bad parts that were passed."

**Bridge.** The false accepts that matter most are the ones that happen without any warning, which is the quiet failure in the next lesson.

#### Lesson 3: The quiet failure

- **Id:** `the-quiet-failure`
- **Place:** This is the second module. It explains why a vision system can get worse while its numbers look better.

**Core idea.** A quiet failure is a loss of the system's ability to detect defects that does not raise an alarm. Common causes are a change in lighting, such as a lamp dimming with age or daylight from a new window; a dirty or misted lens; a camera knocked slightly out of position during cleaning; a change in the product, such as a new supplier's material with a different surface; and drift in the settings after someone adjusted them for a problem and did not restore them. In each case the system keeps running, keeps passing parts, and often shows a lower reject rate than before, because it is detecting less. A falling reject rate is therefore not in itself good news. It may mean the process has improved, or it may mean the system has gone partly blind. A quiet failure is not the same as a system fault that stops the line, which is at least visible.

**Worked example.** A monthly quality report.

> Input: "The reject rate at the vision station fell from its usual level to about half of that over the last three weeks. The production manager has thanked the moulding team for the improvement."

> Output, the quality engineer's reading: "Three weeks ago the line was cleaned and the camera bracket was moved to make access easier. The fall in rejects starts that week. I ran the known-bad sample parts through this morning and two of the five passed. The fall is at least partly a quiet failure."

> Reading: The report looked like improvement. The engineer asked what else had changed at the same time, and tested the system with parts known to be bad.

**Practice.** Look at the reject rate history for a system you know. Find a period where it fell. Write down what else changed at that time and whether anybody checked that the system could still detect defects.

**Check.**

- Question: "The reject rate at a label inspection camera has fallen sharply this week. Two people have given explanations. Choose the explanation you would act on before thanking the team."
- Controls: "Explanation A" and "Explanation B".
- Explanation A: "The printing team has improved. Rejects are down, so labels must be better."
- Explanation B: "The lamp at the camera was replaced on Monday with a different type, and the fall starts on Monday. We should run the known-bad labels through before we conclude that printing has improved."
- Correct: "Explanation B".
- Right feedback: "Yes. Explanation B links the fall to a change at the camera and tests whether the system can still see a bad label before drawing a conclusion."
- Wrong feedback: "Explanation A treats a lower reject rate as proof of better labels. A camera that sees less also rejects less. Choose the explanation that tests the system first."
- Pass reason: "You treated a falling reject rate as a question to test, not as good news."

**Bridge.** The test in that explanation is the start-of-shift challenge, and the next lesson teaches you to write it.

#### Lesson 4: Prove it can still see

- **Id:** `prove-it-can-still-see`
- **Place:** This lesson completes the second module. It is the answer to the quiet failure.

**Core idea.** A challenge test proves that the system can still detect the defects it is meant to detect. It uses a small set of known-bad parts, sometimes called challenge parts, reject masters, or limit samples, each with one of the defects the system is configured to find, kept safely and labelled. At an agreed frequency, often at the start of each shift and after any change such as cleaning, a lamp replacement, or a product change, someone runs the challenge parts through the system and confirms that every one is rejected. A good part may also be run to confirm it passes. The procedure must say what happens if a challenge part passes: the system is treated as not working, the output since the last successful challenge is held or re-inspected as the quality procedure requires, and the quality owner is told. A challenge test is not a calibration of the camera and it does not prove the system catches everything. It proves that it still catches the specific defects in the challenge set.

**Worked example.** A start-of-shift check for a cap inspection system.

> Input, the current check: "Check camera is on and screen shows images."

> Output, rewritten: "At the start of each shift, and after cleaning, lamp change, or product change: run the five challenge caps from the locked box at the station (oversize, undersize, black speck, short shot, flash), one at a time. Each must be rejected. Then run one good cap, which must pass. Record the result on the station sheet. If any challenge cap passes, stop using the system, hold the caps produced since the last successful challenge, and call the quality engineer on shift."

> Reading: The first check proved only that the camera had power. The second proves that the system still sees five specific defects, and it says what happens if it does not.

**Practice.** Write a challenge test for a system you know, with the parts, the frequency, the record, and what happens if a challenge part passes.

**Check.**

- Question: "This challenge test for a seal inspection camera is missing parts the lesson named. Edit it so it proves the system can still see and says what happens if it cannot."
- Control: an editable procedure: "Once a day, run the known-bad pouches through the seal camera and check they are rejected."
- What must be added: when else it runs, at minimum after cleaning or any change at the camera; where the result is recorded; and what happens if a known-bad pouch passes, including holding output since the last successful challenge and telling the quality owner.
- Feedback when the trigger after changes is missing: "Your procedure runs once a day only. Add a run after cleaning, a lamp change, or any other change at the camera, because those are the causes of quiet failure."
- Feedback when the record is missing: "Your procedure does not say where the result is recorded. Add where it is written down."
- Feedback when the failure action is missing: "Your procedure does not say what happens if a known-bad pouch passes. Add that the system is not used, output since the last successful challenge is held, and the quality owner is told."
- Right feedback: "Yes. Your challenge test now runs after the changes that cause quiet failure, records its result, and says what to do if the system cannot see a known defect."

**Bridge.** A challenge test protects what the camera judges, and the next lesson decides what a person still checks.

#### Lesson 5: The human check

- **Id:** `the-human-check`
- **Place:** This is the third module. It divides the inspection between the system and people.

**Core idea.** A person still checks four kinds of thing when a vision system is in place. The first is anything the system does not measure, which lesson 1 taught you to list. The second is a sample of accepted parts, audited at a set frequency, because that is the only way to find false accepts at the line; recognised sampling schemes such as ISO 2859-1 can help set the size and frequency. The third is a review of rejected parts, because that is how false rejects and their causes are found. The fourth is any new product, new material, or change of supplier, until the system has been proved on it. The human check is not a full re-inspection of every part, which would defeat the purpose of the system, and it is not a quick glance with no record. It is a defined set of checks, with a frequency, a record, and an owner. In this course, each check is either "The camera judges this" or "A person still checks this".

**Worked example.** The quality manager from lesson 1 sets out the human check for the bottling line.

> Output: "The camera judges label presence, position, barcode readability, and that a batch code is printed. A person still checks: that the batch code is today's, at the start of each run and each hour; a sample of accepted bottles for label tears and damage every two hours; the reject bin at the end of each shift, to find why good bottles were rejected; and every new label design for the first full run."

> Reading: The batch code check is new, and it covers the gap the setup sheet revealed. Nobody is being asked to look at every bottle.

**Practice.** For your system, write down which checks the camera judges and which a person still checks, with a frequency for each human check.

**Check.**

- Question: "A vision system on a pharmaceutical carton line checks that a leaflet is present, the carton is closed, and the printed expiry date is legible. Mark each check."
- Controls: "The camera judges this" and "A person still checks this".
- Checks, correct answers, and feedback:
  1. "The leaflet is present in the carton." Correct: "The camera judges this". Right: "Yes. Leaflet presence is one of the configured checks." Wrong: "Leaflet presence is in the list of things the system checks. The camera judges this."
  2. "The expiry date printed is the correct date for this batch." Correct: "A person still checks this". Right: "Yes. The system checks that the date is legible, not that it is the right date." Wrong: "The system checks that the date can be read, not that it is correct. A person still checks this."
  3. "A sample of accepted cartons is opened to check the leaflet is the right version." Correct: "A person still checks this". Right: "Yes. The system checks presence, not version, and auditing accepted cartons is how false accepts are found." Wrong: "The system checks only that a leaflet is present. Checking the version on a sample of accepted cartons is a human check."
  4. "The carton flaps are closed." Correct: "The camera judges this". Right: "Yes. Carton closure is one of the configured checks." Wrong: "Carton closure is in the list of things the system checks. The camera judges this."
- Pass reason: "You gave the camera what it measures and kept for people what it does not."

**Bridge.** The last lesson brings the judgement, the quiet failure, the challenge test, and the human check into the inspection brief.

#### Lesson 6: The inspection brief

- **Id:** `the-inspection-brief`
- **Place:** This is the final lesson and the fourth module. You write the artefact.

**Core idea.** The inspection brief is a one-page account of one vision inspection system. It has five parts: what the camera judges, as a list of configured features, and the judgements it does not make that people might assume it does; how it can be wrong, with the owner who is allowed to change the threshold and the rule that nobody changes it without reviewing both errors; how it can fail quietly at this station, naming the likely causes; the challenge test, with parts, frequency, record, and the action if a challenge part passes; and the human check, with each check, its frequency, and its owner. It is written so that a new quality engineer, an auditor, or a line manager could understand what the system is doing and what is still in people's hands.

**Worked example.** The cap inspection brief.

> Output: "Judges: outside diameter against drawing tolerance; black specks in the top face region; short shot and flash on the rim. Does not judge: whether the cap seals; specks outside the top face region; colour shade. Wrong two ways: false rejects are reviewed from the bin each shift; false accepts are found by the hourly audit and by the filling line. Threshold changes: quality engineer only, after reviewing both errors, recorded on the change sheet. Quiet failure here: lamp ageing, lens dust from the moulding area, bracket knocked during tool changes, new masterbatch supplier. Challenge: five challenge caps from the locked box at the start of each shift and after cleaning, lamp change, tool change, or material change; recorded on the station sheet; if any passes, stop, hold output since the last good challenge, call the quality engineer. Human check: hourly audit of 20 accepted caps for defects outside the configured regions, by the line inspector; shift-end reject review, by the line inspector; first full run of any new colour or material, by the quality engineer."

> Reading: Anyone can see what the camera does, what could go wrong without warning, how that is caught, and what people still do.

**Practice.** Draft the brief for your system in the fields provided.

**Check (build the artefact).**

- Question: "Write the inspection brief for a vision system you rely on or are responsible for. Each part has to be something a colleague or auditor could check."
- Fields: "What the camera judges and does not judge", "How it can be wrong, and who may change the threshold", "How it can fail quietly here", "The challenge test", "The human check".
- Feedback for missing parts: "Your judges field has no does not judge line. Name at least one judgement people might assume the system makes." "Your threshold field does not name who may change it. Name the role." "Your quiet failure field is empty. Name at least one likely cause at this station." "Your challenge test does not say what happens if a challenge part passes. Add the action and who is told." "One of your human checks has no frequency or no owner. Add both."
- Right feedback: "Your brief states what the camera judges and does not, controls the threshold, names the causes of quiet failure, proves the system can still see, and keeps a defined human check."

### The artefact and the record

The learner produces an inspection brief. After every check has passed, they sign their name against it. The record shows the name, the course title "Vision Systems and Automated Inspection", the date signed, the five parts of the brief as written, and the public reference. The record states: "This record shows the inspection brief the named person wrote in this course. It is not a validation of any inspection system and it does not certify compliance with any quality or regulatory standard."

### How learning is validated

The brief passes when the judges field lists at least one configured feature and at least one judgement the system does not make; the threshold field names a role; the quiet failure field names at least one cause; the challenge test names its parts or defects, a frequency that includes at least one trigger after a change, where the result is recorded, and an action if a challenge part passes; and each human check has a frequency and an owner. Length alone never passes.

### Sources and reading

- AIAG, *Measurement Systems Analysis Reference Manual*, for attribute agreement analysis and the idea that an inspection system is itself a measurement system to be evaluated.
- ISO 2859-1, *Sampling procedures for inspection by attributes*, for setting audit sample sizes.
- EMVA 1288, the European Machine Vision Association standard for characterising camera performance, named so the learner knows it exists.
- E. R. Davies, *Computer Vision: Principles, Algorithms, Applications, Learning*, for a thorough account of how machine vision works.
- Manufacturer documentation for your vision system, for example from Cognex, Keyence, or Basler, for how its tools, thresholds, and logs work.

---

## 10. Robotics Investment Decisions

**Slug:** `robotics-investment-decisions`

**Catalogue:** 2 hours, £149. Promise: "Five questions for a capital request, aimed at the process rather than the brand." Modules: The process, Payback and people, Five questions, Ninety days on.

### Who it is for

This course is for finance directors and business partners, operations directors, members of investment committees, and owners of small and medium-sized manufacturers who approve or challenge capital requests for robots and automation. They must already understand the basics of capital appraisal, such as payback and the idea of discounting future cash flows, and know their organisation's approval process. They do not need engineering knowledge. The course does not give financial, tax, or legal advice.

### Outcome

When you finish, you can read a capital request for robotics and judge whether it describes the process and its measured performance, whether its payback includes the full cost of owning the system and a realistic ramp-up, whether its claims about people are supported by a plan, and whether it sets out how success will be measured ninety days after go-live. You can put five questions to the request that are aimed at the process rather than the brand, and write a review that records the answers or says which are not yet answered.

### Learning objectives

1. Judge whether a capital request starts from the process and its measured baseline.
2. Identify costs missing from a payback case, including integration, guarding, training, ramp-up, and support.
3. Distinguish claims about people that are supported by a plan from claims that are not.
4. Put five process-focused questions to a request and record the answers.
5. Set measures for a review ninety days after go-live, against the same baseline.

### Lessons

#### Lesson 1: Start with the process

- **Id:** `start-with-the-process`
- **Place:** This is the first lesson and the first module. It sets the test that every later lesson builds on.

**Core idea.** A capital request for robotics should start with the process it will change, not with the equipment it will buy. That means a description of the process as it runs today, with measured performance: output per hour or per shift, labour hours, quality losses, downtime, and whatever else the automation is meant to improve, with the source and period of each figure. The "baseline" is that measured performance, and it is what the investment will be judged against later. A request that starts with a brand, a model, or a product brochure is asking you to approve a solution before you have been shown the problem. A request that starts with a problem described only in adjectives, such as "slow", "labour-intensive", or "inefficient", has not yet measured it. Starting with the process is not a formality. It is the only way to know afterwards whether the money did what it was meant to do.

**Worked example.** Two openings of capital requests.

> Input, request one: "We request approval to purchase a robot welding cell from a leading manufacturer, which is the market leader in robotic welding and will bring our factory up to date."

> Input, request two: "Frame welding on line 2 is done manually by three welders per shift on two shifts. Over the last six months, measured from the production system, the line has produced an average of 38 frames per shift, with rework on about one frame in ten, recorded by quality. Overtime on line 2 has been needed in most weeks to meet demand. This request is to automate the welding of the two highest-volume frame types."

> Reading: The figures belong to the example. Request one tells you about a brand. Request two tells you what happens today, measured, with sources, and which part of it the money is aimed at.

**Practice.** Take a capital request you have seen or written. Underline every sentence about the process today and circle every sentence about the equipment. Note whether the process sentences have a source and a period.

**Check.**

- Question: "Two capital requests have been submitted for automating packing at a food manufacturer. Choose the request that starts with the process."
- Controls: "Request A" and "Request B".
- Request A: "We propose to invest in a state-of-the-art robotic packing system from a well-known supplier, which will transform our packing hall and make us more competitive."
- Request B: "Packing of 500 gram bags into cases on lines 4 and 5 uses four packers per line per shift. Over the last quarter, from the line reports, output averaged 22 cases per minute per line, with packing the constraint on both lines during the pre-Christmas peak. This request is to automate case packing on lines 4 and 5."
- Correct: "Request B".
- Right feedback: "Yes. Request B describes the process today, with measured output, a source, and a period, and says which part of it the investment is aimed at."
- Wrong feedback: "Request A describes the supplier and the hopes for the equipment. It gives no measured baseline for the process. Choose the request that starts with the process."
- Pass reason: "You chose the request that starts from the process and its measured baseline."

**Bridge.** With the process and its baseline in view, the next lesson tests the payback case.

#### Lesson 2: Payback, honestly

- **Id:** `payback-honestly`
- **Place:** This is the first half of the second module. It tests the numbers in the case.

**Core idea.** Simple payback is the cost of the investment divided by the net benefit it produces each year, and it tells you how many years it takes to earn the money back. Many organisations also use discounted measures such as net present value, and the HM Treasury Green Book is a public example of a thorough appraisal method. Whatever method is used, the case is only as honest as its inputs. The cost of a robot cell is much more than the robot. It includes integration and programming, guarding and safety systems, fixtures and grippers, changes to the building or the flow around the cell, the risk assessment and conformity work, training, spares, software licences, maintenance, and the lost output during installation and commissioning. The benefit must be measured against the baseline from lesson 1, and it rarely arrives in full on the first day, so a realistic case includes a ramp-up period. A payback case that uses the list price of the robot and the full benefit from day one is not wrong arithmetic. It is the right arithmetic on the wrong numbers.

**Worked example.** Two payback cases for the same welding cell, using illustrative figures that belong only to this example.

> Input, case one: "Robot cost £120,000. Saves two welders per shift on two shifts. Payback under two years."

> Input, case two: "Cost: robot and positioner £120,000; integration, programming, and fixtures £90,000; guarding and safety systems £30,000; training £8,000; lost output during commissioning £15,000; spares £10,000. Running cost: maintenance and support £12,000 a year. Benefit: measured against the six-month baseline; reduced overtime and rework in the first six months while the cell ramps up; redeployment of two welders per shift to lines 3 and 4, where vacancies are open, from month six. Payback: about three and a half years on these assumptions."

> Reading: Case one counted the robot and a benefit that assumes four people leave on day one. Case two counts the costs of owning the cell, allows for ramp-up, and describes what happens to the welders. Case two may still be a good investment. It is just an honest one.

**Practice.** List every cost in a payback case you have seen. Compare the list with the costs in this lesson and write down any that were missing.

**Check.**

- Question: "Two payback cases have been prepared for a robotic palletiser. Choose the case you could defend to the board."
- Controls: "Case A" and "Case B".
- Case A: "Palletiser £85,000. Replaces two packers per shift. Payback 14 months."
- Case B: "Palletiser £85,000; conveyor changes and guarding £40,000; integration £25,000; training and commissioning downtime £12,000; annual service contract £6,000. Benefit from the measured labour and overtime baseline, at half rate for the first three months. The two packers per shift move to the new line opening in spring. Payback about two and a half years."
- Correct: "Case B".
- Right feedback: "Yes. Case B counts the cost of owning the palletiser, allows for ramp-up, measures benefit against a baseline, and says what happens to the packers."
- Wrong feedback: "Case A counts only the machine and assumes the full benefit from day one. It leaves out integration, guarding, training, downtime, and service. Choose the case that counts the cost of owning it."
- Pass reason: "You chose the case with the full cost of ownership, a ramp-up, and a measured baseline."

**Bridge.** Case B also said what happens to the packers, and the next lesson looks closely at claims about people.

#### Lesson 3: People in the case

- **Id:** `people-in-the-case`
- **Place:** This is the second half of the second module. It tests the part of a case that is most often assumed.

**Core idea.** Many robotics cases rest on a claim about people: that roles will be saved, that people will be redeployed, that overtime will fall, or that agency labour will no longer be needed. A claim about people is "Supported by a plan" when the case says who is affected, what will happen to them, when, and who is responsible, and when any change to jobs or terms has been discussed with HR. A claim is "Claimed without a plan" when it counts a saving without saying how it will happen, for example "saves four heads" with no mention of what those four people will do. The case also needs to count the new work the automation creates, such as a technician to maintain it and operators to load and recover it. Where a change could affect jobs, there may be legal duties to inform and consult, and HR should be involved before the case is approved. This lesson is not about whether automation should reduce jobs. It is about whether the case is honest about what it assumes.

**Worked example.** Sentences from a case for mobile robots in a warehouse.

> Input: "The robots will save eight picker roles. Pickers will be redeployed. Agency usage will fall by the equivalent of four full-time staff from month three, based on current agency hours in the labour report, as the robots take over trolley runs. Engineering will need one additional technician, recruited before go-live."

> Output, marked: "The robots will save eight picker roles" is claimed without a plan. "Pickers will be redeployed" is claimed without a plan, because it does not say to what or when. "Agency usage will fall by the equivalent of four full-time staff from month three, based on current agency hours in the labour report" is supported by a plan. "Engineering will need one additional technician, recruited before go-live" is supported by a plan.

> Reading: The saving in agency hours is specific and measurable. The eight roles and the redeployment are assertions, and the case would be stronger and more honest if it said where those people will go, or removed the saving until that is known.

**Practice.** Find every claim about people in a case you have seen and mark each one. For each claimed without a plan, write the question you would ask.

**Check.**

- Question: "Here are sentences from a capital request for a robotic machine-tending cell. Mark each as Supported by a plan or Claimed without a plan."
- Controls: "Supported by a plan" and "Claimed without a plan".
- Sentences, correct answers, and feedback:
  1. "The cell saves three operator roles." Correct: "Claimed without a plan". Right: "Yes. It counts a saving without saying what happens to the operators." Wrong: "This counts three roles but does not say who they are, what will happen to them, or when. That is claimed without a plan."
  2. "The two night-shift machine operators will move to the new grinding cell in September, which has two vacancies, and HR has discussed the move with them." Correct: "Supported by a plan". Right: "Yes. It says who, what, when, and that HR is involved." Wrong: "This names who, where they go, when, and that HR has discussed it. That is supported by a plan."
  3. "Overtime will be eliminated." Correct: "Claimed without a plan". Right: "Yes. There is no baseline and no reason given for why overtime ends." Wrong: "No baseline for overtime is given and no mechanism is described. That is claimed without a plan."
  4. "One setter will be trained to maintain the cell, with the supplier's course booked for May, adding four hours of work to their week." Correct: "Supported by a plan". Right: "Yes. It counts the new work the cell creates and says how it will be covered." Wrong: "This names the new work, who will do it, the training, and when. That is supported by a plan."
- Pass reason: "You separated the claims about people that have a plan behind them from the ones that only count a saving."

**Bridge.** The first three lessons each tested one part of a case, and the next lesson turns them into five questions you can ask of any request.

#### Lesson 4: Five questions

- **Id:** `five-questions`
- **Place:** This is the third module. It gives you the questions to take into an investment meeting.

**Core idea.** The five questions are aimed at the process rather than the brand. First: what is the process today, measured, and where did the figures come from? Second: which tasks will the robot take, and which, including the exceptions, stay with people? Third: what does it cost to own, not just to buy, and how long is the ramp-up? Fourth: what happens to the people whose work changes, and who is responsible for that? Fifth: how will we know, ninety days after go-live, whether it worked? Good questions are specific to the request in front of you. They ask for a fact the request has not given, rather than inviting a general reassurance. A question such as "Is this the best supplier?" or "Is this robot reliable?" is aimed at the brand and invites a sales answer. The five questions are not the whole of an appraisal, and your organisation's process still applies. They are the questions that most often reveal whether a case has been thought through.

**Worked example.** A committee member prepares for a meeting about the palletiser in lesson 2.

> Input, first draft of questions: "Why this supplier? Is the palletiser reliable? Have other companies had success with it?"

> Output, rewritten: "What is the measured output and labour on the end of line today, and from which report? Which cases or pallets will the robot not handle, and who handles them? Does the cost include guarding, conveyor changes, and the service contract, and how long before full output? What will the two packers per shift do, and has HR been involved? What will we measure at ninety days, and against which baseline?"

> Reading: The first draft asked about the supplier and invited a brochure in reply. The second asks for five facts about this process, and each has an answer that can be checked.

**Practice.** Write the five questions for a real or recent request, specific to its process.

**Check.**

- Question: "A request has been submitted for a vision inspection system on a bottling line. Choose the question that is aimed at the process rather than the brand."
- Controls: "Question A" and "Question B".
- Question A: "Is this supplier's camera the most advanced on the market?"
- Question B: "What are the current measured rates of defective bottles reaching customers and of good bottles rejected at the manual inspection station, and from which records?"
- Correct: "Question B".
- Right feedback: "Yes. Question B asks for the measured baseline of this process and its source, which is the first of the five questions."
- Wrong feedback: "Question A is about the supplier and invites a sales answer. It tells you nothing about this bottling line. Choose the question that asks for a fact about the process."
- Pass reason: "You chose the question that asks for a checkable fact about this process."

**Bridge.** The fifth question, how you will know at ninety days, needs its own lesson.

#### Lesson 5: Ninety days on

- **Id:** `ninety-days-on`
- **Place:** This is the fourth module. It sets the review that closes the loop.

**Core idea.** A post-investment review compares what happened with what the case said would happen, using the same measures and the same baseline. Ninety days after go-live is a useful first point, because the ramp-up should be well under way and the early problems visible, though many organisations review again at a year. The review should be agreed at the time the investment is approved, not invented afterwards, and it should name the measures, the baseline for each, the owner of the review, and the date. It should also look at the exceptions and the people: whether the pile of work the robot does not touch is the size expected, and whether the plan for the people whose work changed has happened. A post-investment review is not a blame exercise. Its purpose is to learn whether the case was right, what to do next with this system, and how to write the next case better.

**Worked example.** A review plan written into the approval of the welding cell.

> Input: "Performance to be reviewed after installation."

> Output: "Ninety-day review on 15 September, owned by the operations director. Measures, each against the six-month baseline in the request: frames per shift from the production system; rework rate from quality records; overtime hours on line 2 from payroll; cell stops needing an engineer, from the cell log. Also reviewed: the number of frame types still welded by hand; whether the two welders per shift have moved to lines 3 and 4. Outcome: continue as planned, adjust, or escalate to the committee."

> Reading: The date belongs to the example. The first line could be ignored without anyone noticing. The rewritten plan has a date, an owner, measures with sources, and the people and exceptions from the case.

**Practice.** Write a ninety-day review plan for a real or recent request.

**Check.**

- Question: "This review plan for a robotic palletiser is missing parts the lesson named. Edit it so it can actually be carried out."
- Control: an editable plan: "Ninety-day review. Measures: output and labour."
- What must be added: a date and an owner; the baseline and source for each measure; and a check on the people plan or the exceptions.
- Feedback when the date or owner is missing: "Your plan has no date or no owner. Add both, so someone is responsible for holding the review."
- Feedback when baselines are missing: "Your measures have no baseline or source. Add what each will be compared with and where the figure comes from."
- Feedback when people and exceptions are missing: "Your plan measures output and labour only. Add a check on what happened to the people whose work changed, or on the work the robot does not handle."
- Right feedback: "Yes. Your review now has a date, an owner, measures with baselines and sources, and a look at the people and the exceptions."

**Bridge.** The last lesson asks you to apply the five questions to a real request and write the review, which is what appears on your record.

#### Lesson 6: The five-question review

- **Id:** `the-five-question-review`
- **Place:** This is the final lesson. You write the artefact.

**Core idea.** The five-question review is a one-page record of your challenge to one capital request. For each of the five questions it records the question as you asked it, specific to this request, and the answer the request gives or the words "not yet answered". It ends with your view, which is one of three: support, support with conditions, or not yet, with the conditions or the missing answers named, and with the ninety-day review plan the approval should include. It is not the approval itself and it is not a financial model. It is the record of what a careful reader asked and found.

**Worked example.** A finance business partner's review of the palletiser request.

> Output: "Process today: What is measured output and labour at end of line 5? Answer: 28 pallets per shift, two packers, from the line report for the last two quarters. Tasks and exceptions: Which pallets will the robot not build? Answer: mixed-product pallets for two customers, which will be hand-built by a packer on days. Cost to own: Does the cost include guarding, conveyor changes, service, and ramp-up? Answer: guarding and conveyor included; service contract included; ramp-up not yet answered. People: What will the two packers per shift do? Answer: move to the new line in spring, discussed with HR. Ninety days: What will we measure? Answer: not yet answered. View: support with conditions. Conditions: add a ramp-up period to the payback, and add a ninety-day review with output, labour, hand-built pallet count, and the packers' move, owned by the operations manager."

> Reading: The review records exactly what the request answered and what it did not, and its conditions would make the approval stronger.

**Practice.** Choose a real or recent capital request, or use the palletiser request, and draft your review.

**Check (build the artefact).**

- Question: "Write the five-question review of a real or recent capital request for automation. Each question has to be specific to that request, and each answer has to be what the request says or not yet answered."
- Fields: "The process today", "Tasks and exceptions", "Cost to own and ramp-up", "People", "Ninety days on", "My view and conditions".
- Feedback for missing parts: "One of your questions is about the supplier or the brand. Rewrite it as a question about the process." "One of your answers is blank. Write the answer from the request, or write not yet answered." "Your process answer has no source for its figures. Add where they come from, or write not yet answered." "Your view does not begin with support, support with conditions, or not yet. Start with one of those." "Your view is support with conditions or not yet, but names no condition or missing answer. Name at least one." "Your ninety-day field has no measure. Name at least one measure with its baseline."
- Right feedback: "Your review asks five questions about this process, records what the request answers and what it does not, and gives a view with conditions and a ninety-day review."

### The artefact and the record

The learner produces a five-question review of one capital request. After every check has passed, they sign their name against it. The record shows the name, the course title "Robotics Investment Decisions", the date signed, the six parts of the review as written, and the public reference. The record states: "This record shows the investment review the named person wrote in this course. It is not financial, tax, or legal advice, and it is not an approval of any investment."

### How learning is validated

The review passes when each of the five question fields contains a question that refers to the specific process and does not name a supplier or brand as its subject; each question has either an answer or the words "not yet answered"; the process answer includes a source or "not yet answered"; the view begins with "Support", "Support with conditions", or "Not yet"; a view other than "Support" names at least one condition or missing answer; and the ninety-day field names at least one measure. Length alone never passes.

### Sources and reading

- HM Treasury, *The Green Book: Central Government Guidance on Appraisal and Evaluation*, as a public example of thorough appraisal and post-implementation evaluation.
- Richard A. Brealey, Stewart C. Myers, and Franklin Allen, *Principles of Corporate Finance*, for payback, net present value, and their limits.
- International Federation of Robotics, *World Robotics* reports, for context on robot adoption by industry and country.
- The Made Smarter programme's public guidance for UK manufacturers on planning technology adoption.
- ACAS, guidance on consultation when changes may affect jobs.
- CIMA, *Official Terminology*, for standard definitions of payback and related appraisal terms.
