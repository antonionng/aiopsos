---
name: experrt-course-author
description: The brief a course writer fills in for every single Experrt course before any lesson ships. Use when writing, rewriting, or reviewing one course, its lessons, its checks, its feedback, or its certificate. Works with experrt-course, which sets the academy standard; this skill turns that standard into a per-course build sheet with quality gates.
---

# Writing one Experrt course

Read `.cursor/skills/experrt-course/SKILL.md` first. It says what the academy is, who the learners are, and how they sign back in. This skill is the build sheet for one course. Fill in every section below for the course you are writing, and do not ship a lesson until the course passes the gates at the end.

The plans for all forty courses are in `.cursor/skills/experrt-course/plans/`. Start from the plan for your course. Each course is one file, `lib/self-serve/courses/<slug>.ts`, exporting `COURSE: CourseContent` (see `lib/self-serve/courses/types.ts`), registered in `lib/self-serve/courses/index.ts`. Prompt Engineering in `lib/self-serve/prompt-engineering.ts` is the reference for depth and shape. The types are in `lib/self-serve/types.ts`, the pass rules in `lib/self-serve/engine.ts`, and the player is `components/learn/lesson-room.tsx`.

## 0. Enterprise language

Experrt sells to organisations. Every line must read like it was written by a senior practitioner for a professional audience, and nothing may read as machine-written.

- Plain, precise British English. Short and medium sentences. Concrete nouns: the invoice, the rota, the supplier, the cell, the Tuesday handover.
- Name real roles, documents, and decisions from the workplace. Use realistic but invented company and person names.
- Do not use these words or patterns: delve, dive into, deep dive, unlock, unleash, empower, elevate, leverage (as a verb), harness, supercharge, game-changer, seamless, robust, cutting-edge, landscape, realm, tapestry, journey (for learning), navigate (for anything that is not a route), in today's fast-paced world, it's important to note, in conclusion, let's, imagine a world, not just X but Y, rhetorical questions as openers, triplets for rhythm, exclamation marks, emoji, em dashes.
- Do not address the learner with hype. No "you've got this", no "amazing". Respect their time and experience.
- A sentence earns its place by teaching, showing, or instructing. Cut anything that only sounds impressive.

### Sales copy, course cards, and course pages

The owner has rejected clipped marketing lines more than once. Every piece of copy that sells or describes a course follows these rules.

- Write in full sentences, in the voice of an enterprise learning provider speaking to a professional and to the manager who pays for the seat.
- Lead with what the course is and what it changes. Say what the learner will be able to do, what their organisation gains, and what they finish with. Benefits first, mechanics after.
- Never sell on volume. Do not count lessons, questions, hours, or pages as the reason to buy. Duration and price belong in the metadata line, not in the pitch.
- No short declarative fragments or slogans, such as "A decision, not an introduction.", "Start as soon as you pay.", "One course is open.", or "Good work." as a sentence in body copy. If a line would not survive being read aloud to a client, rewrite it.
- A course description (the `promise` in `catalog.ts`) is exactly two full sentences, 35 to 55 words: what the course teaches and for whom, then what the learner and organisation gain, including the finished piece of work.
- Practical details such as checkout, access, and records are explained in one or two complete sentences each, for example "Access begins as soon as payment is confirmed, and your progress is saved to your account."
- A course that is not yet ready is described as in preparation, with a sentence explaining that it opens when it meets the standard. Do not write "Not for sale yet" or "Nothing here takes payment".

## 1. The promise

Write these before anything else. If you cannot write them in plain sentences, the course is not ready to write.

- **Who it is for.** Their job, and what they already know.
- **The outcome.** What they can do on Monday that they could not do before, stated as work someone else could watch.
- **The artefact.** The one thing they make in the final lesson. It is what their signed record shows. For Prompt Engineering it is the prompt card.
- **Why it is worth paying for.** One paragraph a manager would accept as a reason to buy a seat.

## 2. Content

Write like a good university lecturer who has also done the job.

- Every sentence is a full sentence, in British English, with no em dashes. Read each paragraph aloud. If it sounds like a slide, rewrite it.
- Each lesson teaches one move, in this order: where it sits, the idea, a worked example, a practice, a check on a new case, and a bridge to the next lesson.
- The idea is at least four paragraphs. Say what it is, say what it is not, say why it matters at work, and name the mistake people usually make.
- The worked example uses realistic workplace material: a real-looking email, prompt, policy, brief, or ticket. Show the input, the output, and a reading of what happened, line by line.
- Define a word before you use it on a button. If a label on a control does not appear in the lesson text, change the label or teach the word.
- Cite real public sources by name. Do not invent a figure. If you are not sure a statistic is real, leave it out.
- Keep salary figures on the sales page with their source. A lesson never promises that pay will change.

## 3. Design

- Paper `#fffefa`, ink `#201c29`, violet `#7046eb`, citrus `#e4f477`. Space Grotesk for titles, Inter for reading.
- The lesson page is quiet. One column, a comfortable reading width, generous spacing, no marketing bands.
- One violet underline on the key word of each lesson title, and nothing else competing with it.
- The worked example sits in a white card, so it reads as material rather than teaching.
- The check sits in its own panel. The question is fully above the choices, and on a phone the learner never has to scroll past the choices to read the task.
- Stock photography belongs on the sales page, not inside a lesson. A lesson can use a diagram that teaches.

## 4. Experience

Walk the course as each person in the academy skill before shipping.

- **A new buyer on a phone.** They pay, save a password, and open lesson one without seeing two headers.
- **A returning learner on a laptop.** They sign in, open My courses, and land on the lesson they stopped at.
- **A learner who fails a check twice.** They are told what to look at, in a sentence, and they are never stuck without a way forward.
- **A learner who finishes.** They see their own work, sign it, and can open the public record.
- **A verifier.** They open the reference and understand what was done without an account.

Time each lesson. A lesson should take ten to twenty-five minutes. If it takes less, it is not teaching enough. If it takes more, split it.

## 5. Interactivity

The learner does the work. Choose the interaction that matches the move being taught.

| The move | The interaction |
| --- | --- |
| Tell safe from unsafe, true from invented | Mark each sentence, using two labels the lesson defined |
| Judge which piece of work is better | Choose between two realistic pieces of work |
| Fix something | Edit the starting text in place |
| Make the thing | Write the artefact in labelled parts |
| Follow a procedure where order is the skill | Put the steps in order |
| Apply judgement across several real situations | A scenario assessment: several situations, one right option each, feedback on every option |

The check kinds in code are `mark`, `choose`, `edit`, `build`, `order`, and `scenario`. A practice can use any of them.

- Do not ask them to sort steps the lesson has just listed in order.
- Every control is a full word or a short sentence, large enough to tap, and the selected state is obvious.
- Practice keeps the help on screen. The check removes it and uses a new case.
- The artefact they write in the last lesson is carried through to the record word for word.

## 6. Validation and assessment

A pass means the work meets the lesson's outcome. It does not mean a box was ticked.

- Write the pass rule for every check before you write the copy. For a mark check it is every sentence marked correctly. For a choose check it is the stronger piece of work. For an edit or build check, list the parts that must be present and how each is detected, for example a limit on what must not be invented, or a fact that is true.
- A character count alone is never a pass rule.
- Continue stays disabled until every part has an answer.
- A wrong answer keeps the learner on the lesson. Stored attempts show where people get stuck, and are never shown to a verifier.
- The course is complete when every check has passed and the learner has signed their name against the artefact.
- Add a test in `lib/__tests__/` for every pass rule: one answer that passes, and one wrong answer for each rule.

### The shape of assessment in every course

1. **A check in every lesson,** on a new case, using the move that lesson taught.
2. **A course assessment,** as the second-to-last lesson. Its check is a `scenario` of six to eight questions set in situations the learner has not yet seen, drawing on every earlier lesson. Set `passMark` to about eighty per cent (for example five of six, or six of eight). The lesson itself still teaches: it recaps the course's method in full paragraphs, works one mixed example, and gives a short practice before the assessment.
3. **The artefact,** as the last lesson. A `build` check whose fields each have a `rule` or an `any` list, so every part is checked for substance. This is what the certificate shows.

Writing good scenario questions:

- The situation is two to four full sentences with names, numbers, and a real document or decision. The learner should recognise their own week in it.
- Each question has three or four options. Every option is something a reasonable professional might do. There are no joke options and no "all of the above".
- Exactly one option is right, and it is right for a reason the course taught.
- Every option carries `feedback` written to the person who chose it. For a wrong option, say what that choice would cause at work and what the better move is. For the right option, say why it holds.
- Vary which letter position the right option sits in.

Build fields for the artefact:

- `rule: "role"` needs a named role, `"fact"` a concrete fact (a number, a date, or a name), `"limit"` a clear limit (do not, must not, never, only), and `"shape"` a length or format.
- `any: [...]` requires at least one course-specific word or phrase, for example `["risk", "hazard", "guard"]` for a safety note. Choose words a correct answer will naturally contain, and write `missing` as a full sentence telling the learner what that part needs.

## 7. Feedback people enjoy

Feedback is where the course feels alive. It is specific, warm, and quick. It never mocks, and it never pretends a wrong answer was nearly right.

- **When they are right,** say what they did in their own terms, then why it matters at work. "You marked the discount as a promise the prompt never made. That is the sentence that would have cost the account money." Then show Next lesson. Do not jump them forward before they have read it.
- **When they are wrong,** name the exact sentence or the missing part, say what to look at again, and keep their answer on screen so they can change it. One wrong item is described, not every item.
- **When they are wrong a second time,** point back to the paragraph or the worked example that answers it.
- **Moments of progress.** A tick fills on the lesson bar when a check passes. The pass panel turns citrus for a moment. The last lesson of the course has a short finish moment that quotes the artefact they wrote back to them before they sign.
- **In the inbox.** The receipt thanks them by name. The welcome email tells them how to sign back in. A nudge names the lesson they stopped at. The finish email links their record.
- Momentum is fine. Points, streaks, and scores that hide a failed check are not. A learner should feel progress because they can see their own work improving.
- **Tutor feedback on written work.** On every `build` and `edit` check, in the practice and the check, a signed-in learner can choose "Get feedback on my draft". A tutor model reads their draft against the lesson's teaching and replies in three short paragraphs: what works, what to change (quoting it), and a suggested rewrite. It never decides the pass. Write each lesson's teaching so that it gives the tutor enough to judge against: name the standard clearly in the paragraphs, and make the field hints precise. The route is `app/api/learn/feedback/route.ts`.
- **Scenario feedback.** After a scenario assessment is submitted, each question shows whether the choice was right and the feedback for the option chosen, and the result states the score against the pass mark.

## 8. Certification

- The record is issued only after every check has passed and the learner has signed their name.
- It shows the name they signed, the course, the date, the artefact, and a public reference.
- It never says the person is compliant with the EU AI Act or any other regulation, and it is not the facilitated cohort certificate.
- The learner can open it from My courses, and a verifier can open `/verify/[ref]` and download the PDF.
- Write the one sentence the record uses to describe what was done, for example "Wrote and signed a prompt a colleague can run without asking what was meant." It goes in `artefact.recordLine`, with `artefact.title` (for example "The rollout plan") and `artefact.lessonId` pointing at the final build lesson.
- The record page, the public verify page, and the PDF all show the course, the name, the date, the record sentence, the artefact under its title with each field label, and the reference. The field labels are the build field labels, so write them as clean headings a stranger could read.

## 9. The build sheet

Copy this into the top of the course's lesson file as a comment, and fill it in.

```
Course:
Slug:
For:
Outcome:
Artefact:
Record sentence:
Lessons (id, title, move, interaction, pass rule):
  1.
  2.
  3.
  4.
  5.
  6.
Sources:
Tested on phone:          yes / no
Tested returning learner: yes / no
Pass rule tests written:  yes / no
```

## 9a. Market figures

Every course page shows three market figures in the price card and one benefit that explains why the skill matters now. These live in `lib/self-serve/market-stats.ts`, keyed by course slug.

1. Each figure must be found in the text of the source page it links to. Never round, infer, or carry a number from secondary coverage when the primary page can be opened.
2. At least two of the three figures must be about the course's own subject. A robotics course does not show AI salary figures, and a privacy course shows privacy figures.
3. Prefer UK sources, then European, then global, published within the last three years. Name the scope in the label when a figure is global or comes from a vendor.
4. The `line` is one sentence of at most 70 characters that reads after the value. Figures describe the market and never promise the learner a pay rise or a job.
5. `lib/__tests__/self-serve-landing.test.ts` fails if a course has fewer than three figures, a figure has no source, or two courses in a track share the same three.

## 10. Gates before shipping

Every answer must be yes.

1. Can the outcome be watched, and does the final lesson produce it?
2. Is every sentence a full sentence, and does every paragraph read aloud naturally?
3. Is every word on every button taught earlier in the lesson?
4. Does every lesson have the idea, a worked example, a practice, a check on a new case, and a bridge?
5. Does every check have a written pass rule and a test that proves it?
6. Does the right-answer feedback explain why, and does the wrong-answer feedback name the item?
7. Does the lesson work on a phone with one header and the question above the choices?
8. Can a returning learner sign in and land on the lesson they left?
9. Does the record show the artefact and avoid any claim of regulatory compliance?
10. Would a manager pay for a seat after reading the promise and the first lesson?
11. Does the course end with a scenario assessment with a pass mark, and then the artefact?
12. Does a search of the file find none of the banned words in section 0, and no em dashes?
13. Does the course have three verified market figures of its own in `market-stats.ts`?
