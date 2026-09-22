---
name: experrt-course
description: Standard for the Experrt learning academy. Use when designing or revising a self-serve course, lesson copy, checks, the lesson player, certification, or who can sign back in. Future courses follow this same academic depth. Covers learner types, content, UX, interactivity, validation, certificates, and UI.
---

# Experrt learning academy

This skill is the standard for every self-serve course. Prompt Engineering for Professional Work is the first course written to it. Every course after it uses the same depth, the same lesson shape, the same checks, and the same way back in.

A course is worth paying for when a professional can finish it, do the work on Monday, and say why. The first prompt course failed that test. It was four short captions, a check labelled Holds and Invented, two headers on the phone, and a purchase that opened the lesson with no account to return to.

Read this before writing a lesson, a check, a certificate, or a sign-in path. For each individual course, work through `.cursor/skills/experrt-course-author/SKILL.md`, which turns this standard into a build sheet with quality gates. The plans for all forty courses are in `plans/` beside this file.

## Who uses a course

One email is one Experrt account. A person can hold more than one of these roles. The site already has organisation roles (learner, trainer, manager, admin, owner, finance) and a self-serve purchase that is not yet tied to a user. These types are the people a course must serve. Map them onto that account. Do not invent a second login.

**Individual learner.** They buy a course for themselves. Checkout asks for an email and a card, then asks them to save a password or send a sign-in link to that same email. They land in lesson one. When they come back, on this phone or another, Sign in opens the lesson they left, with their checks and their prompt card. They can buy another course on the same account.

**Team learner.** A manager assigned them a seat. They did not pay. The invite goes to their email. They set a password or open the sign-in link, and the course is already on the account. They see their own lessons and their own record. They do not see anyone else's answers.

**Team manager.** They develop a team. They buy seats or assign a course. They see who has not started, who is inside a lesson, who has passed each check, and who has a signed record. They do not take the lesson unless they also have a seat. They cannot edit a learner's answers or sign a record for someone else.

**Facilitator.** They run a live programme. They can preview a self-serve course so they know what people did on their own. A preview does not issue a certificate. Their cohort record stays the existing one: attendance, grade, and the facilitator named on it. A self-serve certificate is a different document.

**Training provider.** They run a training business on Experrt. They can offer an Experrt course inside a programme they deliver. They do not write the academic courses. Experrt writes those, through this skill.

**Verifier.** They have no account. They open the public reference or the PDF. They see the person's name, the course, the date, and the work that was signed. They do not see the lessons, the failed attempts, or any other purchase.

**Experrt operator.** Purchase alerts go to ag@experrt.com. An operator can see that a purchase happened. They are not a learner.

### How they sign back in

- The email Stripe collected, or the email on the invite, is the account email.
- Offer the password or the sign-in link after payment or assignment, on the way into the lesson. Do not make a separate registration page the thing they must finish before they can pay.
- The browser that just paid keeps the cookie, so they are not locked out while they save the password.
- Sign in is how a second device opens the same course. Progress and the signed card live on the purchase, attached to the user.
- The receipt still thanks them and links them back. The alert still goes to ag@experrt.com.
- A manager's view and a learner's view are different pages of the same account. Signing in as a manager does not drop them inside someone else's lesson.

### What is built

- After payment, `/api/learn/claim` sets the access cookie and sends a buyer with no account to `/learn/welcome`. That page shows the checkout email, asks for their name and a password, and offers to open lesson one without saving.
- `/api/learn/account` creates the Supabase user on the purchase email, signs them in, and attaches every paid purchase on that email to the user (`self_serve_purchases.user_id`). If an account already exists on that email, it asks them to sign in instead.
- `/learn/my-courses` is the learner profile. Signed out, it is the sign-in form. Signed in, it lists each course with progress, the date and price paid, a Carry on button, and the signed record.
- A course opens from the cookie or from the signed-in account (`lib/self-serve/access.ts`). A purchase made while signed in carries the user id in the Stripe metadata.
- A signed-in learner with no organisation who opens `/dashboard` is sent to My courses.
- Emails: the receipt thanks the buyer by name and says how to sign back in. The welcome email thanks them for signing up. ag@experrt.com receives a purchase alert naming the buyer, their email, the course, the amount, the time, and whether they have an account, and a second alert when a learner account is created.

## Content

Write the way a good teacher talks to a colleague.

- Every sentence is a full sentence. A paragraph can be read aloud.
- Teach the idea before you test it. Say what it is, say what it is not, then show it on a real piece of work.
- The words on a button are words the lesson has already explained.
- The reader is a professional. Address them as you.
- One course has one outcome, written as what the person can do when they finish.
- A lesson teaches one move. Several paragraphs, one worked example, one practice, one check. A caption is not a lesson.
- Keep published salary figures on the sales page, with the source. A lesson does not promise that pay will change.
- The same standard is the bar for course two, and for every course after it. Leave an outline as an outline until it can be written at this depth. Do not generate thirty-nine thin courses to fill the catalogue.

### Shape of a lesson

1. Place. One or two sentences on where this sits in the course.
2. Idea. The definition, in full sentences.
3. Worked example. The prompt, the output, and a reading of what happened.
4. Practice. The learner does that move. The controls use the words just taught.
5. Check. A new case, the same move. The question is a full sentence and says what to do.
6. Bridge. One sentence on what the next lesson adds.

## UX

- Buy, then save the sign-in on that email, then open lesson one. The person who just paid is not sent to a blank account form with no course on it.
- Coming back lands on the lesson they left, with a way to open the list of lessons and a way to open My courses.
- My courses shows each course they own, where they stopped, and the record if they have signed.
- A team manager has a people list: name, course, last check passed, signed or not yet.
- One task on the screen. The question is fully visible above the choices on a phone.
- Continue stays disabled until every part of the task has an answer.
- A right answer explains why, and the learner chooses Next. The page does not skip forward before they have read it.
- A wrong answer stays on the lesson. The note names the sentence or the missing part and says what to look at again.
- The receipt, the sign-in link, and the lesson all use the course title the person bought.

## Interactivity

The learner does the work. They do not sort a list that already contains the answer.

- Practice is the move, in small form, with help still on the page.
- The check is the same move on a new case, without the worked answer sitting above the buttons.
- Allowed moves are: mark a sentence with labels the lesson defined, choose between two real pieces of work, edit a prompt, and write the artefact.
- An ordering control is only for a skill where the sequence is the thing being learned.
- Each control is a full word or a short sentence, large enough to tap, with the selected state obvious.
- The thing they produce in the last lesson is the thing that appears on the record.

## Validation of learning

A check passes when the performance matches the outcome of the lesson. A tick, a character count, or a button press is not evidence.

- Stay on the lesson until the check is right. There is no skip.
- Feedback is a full sentence about that answer. It says which sentence invented a promise, or which part of the prompt is missing.
- A pass shows the reason, in the words of the lesson, before Next appears.
- A build task looks for the parts of the work. For a prompt that is a role, a fact that is true, a limit on what must not be invented, and the shape of the answer.
- The course is complete when every check has passed and the learner has signed their name against the work they produced.
- A manager sees pass or not-yet on each lesson, and whether the record is signed. They do not see a percentage that hides a failed check.
- Failed attempts stay on the purchase so we can see where people get stuck. They are not shown to a verifier.

## Certification

- Issue the record only after every check has passed and the learner has signed their name.
- The record names the person, the course, the date, and the work they produced.
- A second person can open `/verify/[ref]` and download the PDF.
- The record does not say the person is compliant with the EU AI Act or any other regulation.
- It is not the facilitated cohort certificate. That one names attendance, a grade, and a facilitator. Do not merge the two documents.
- The learner can open their record from My courses after they sign back in. The public page stays available to anyone with the reference.
- The name on the record is the name they sign, and the account email is the email they can sign in with. Both are stored on the purchase.

## UI

- Paper, ink, violet, citrus. Space Grotesk for titles, Inter for reading. The sales page can be the fuller brand page. The lesson is a quiet page for reading and doing the work.
- The catalogue and the sales page use the site header. The first item is AI LMS.
- The lesson player has one bar: back to the course, and Lessons. Do not put the site header above the lesson bar. Two headers hid the question on a phone.
- My courses and the manager list use the site header, the same cards as the catalogue, and the same type. Do not invent a second visual system for the academy.
- The certificate page is a document: the wordmark, the course, the name, the date, the work, the reference. It is not a second homepage.

## Prompt Engineering for Professional Work

This is the first course to rebuild to the standard above. Do not ship another version that is four captions and a jargon check.

Outcome: the learner can explain what a prompt is, tell a sentence that only thanks someone from a sentence that commits the company, and write a prompt a colleague can run without asking what was meant.

1. What a prompt is. A prompt is the instruction and the evidence you give a model before it writes. It is the only information the model has about this client, this price, and this deadline.
2. What happens when the prompt is silent. The model still writes. The gap is filled with something that sounds finished. Work the "write a polite reply" example here, including why a thank-you can stand and a discount cannot.
3. The parts of a prompt, one at a time. Who is speaking. The facts that are true. What must not be added or promised. The shape of the answer. Each part gets a before and an after.
4. Read a reply. Mark each sentence with the words from lesson 2. The buttons say "Only thanks them" and "Adds a promise that was not in the prompt".
5. Repair the prompt. The learner edits the same prompt. They read the sentence that went too far, name the missing limit, add it, and read the new reply.
6. Write a prompt for a real task. The learner produces the prompt card. The check accepts it when a colleague could run it. They sign the record, and that card is what a verifier sees.

## Order of the work

1. This skill is the standard. Each course is written from its plan in `plans/` and the build sheet in `experrt-course-author`.
2. The lesson player has one header. Done.
3. Individual learners save a sign-in on the purchase email and open the course from My courses. Done. Team learners and managers come next, on the same account. Facilitator preview and provider delivery come after the first course is something a person would pay for.
4. Rewrite Prompt Engineering to the six lessons, with checks that match this skill, and a record that shows the card they wrote.
5. The next course is built only when it passes every gate in `experrt-course-author`. The other outlines stay outlines until then.

## Leave alone

Do not write lessons for the other thirty-nine courses in a batch. Do not add points, streaks, scores that hide a failed check, or a second visual system. Progress ticks and a finish moment are welcome, as described in `experrt-course-author`. Do not turn on Stripe Tax. Do not claim a regulation on a record. Do not put the marketing header back on the lesson player.
