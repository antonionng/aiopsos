/*
Course: AI for HR and People Teams
Slug: ai-for-hr-and-people-teams
For: HR advisers, HR business partners, people operations staff, HR generalists in small
  organisations, and office managers who carry the HR role. They can open the AI chat tool their
  organisation provides and they know where the approved text of their people policies lives.
Outcome: The learner can take a week of their own HR work and say which tasks a model may draft
  and which a person must decide, write three reusable briefs that name the source, the reader,
  the limit, and the owner, repair a prompt that contains held information, and produce a hold
  list with a reason and an alternative on every line.
Artefact: The hold list and three patterns.
Record sentence: Wrote and signed three reusable HR drafting patterns and a hold list of the
  information they will never paste into an AI tool.
Lessons (id, title, move, interaction, pass rule):
  1. safe-to-draft, Safe to draft, sort a task into Safe to draft or A person decides, mark,
     every task marked correctly.
  2. what-the-draft-cannot-know, What the draft cannot know, find the sentence that adds a policy
     the source did not contain, mark, every sentence marked correctly.
  3. three-patterns, Three patterns, judge a brief by its source, reader, limit, and owner,
     practice mark and check choose, the brief with all four parts.
  4. what-you-never-paste, What you never paste, mark information as Can go in or Hold, mark,
     every sentence marked correctly.
  5. repair-the-prompt, Repair the prompt, edit a prompt so the task survives and held
     information does not, practice choose and check edit, the edit keeps the task and the
     policy, uses placeholders, and adds a limit on health and on pay.
  6. course-assessment, Course assessment, apply every move to new situations, scenario of seven
     questions, six of seven correct.
  7. the-hold-list, The hold list, write the artefact, practice build and check build, every
     field present with its rule or its course words.
Sources: ICO, Guidance on AI and data protection. ICO, Employment practices and data protection
  guidance. ICO, Guide to the UK GDPR, special category data and criminal offence data. UK GDPR
  Articles 9 and 10, and the Data Protection Act 2018, Schedule 1. Acas Code of Practice on
  disciplinary and grievance procedures. GOV.UK, Artificial Intelligence Playbook for the UK
  Government. CIPD factsheet on evidence-based practice.
Tested on phone:          no
Tested returning learner: no
Pass rule tests written:  yes
*/

import type { CourseContent } from "./types.ts";

const SAFE = "Safe to draft";
const DECIDES = "A person decides";
const WITHIN = "Stays within what we gave it";
const ADDS = "Adds a policy we did not give it";
const GOES_IN = "Can go in";
const HOLD = "Hold";

export const COURSE: CourseContent = {
  slug: "ai-for-hr-and-people-teams",
  hours: 2.5,
  artefact: {
    lessonId: "the-hold-list",
    title: "The hold list and three patterns",
    recordLine:
      "Wrote and signed three reusable HR drafting patterns and a hold list of the information they will never paste into an AI tool.",
  },
  lessons: [
    {
      id: "safe-to-draft",
      title: "Safe to draft",
      emphasis: "draft",
      place:
        "This is the first of seven lessons. Before anyone writes a brief, they need to know which pieces of their week a model should touch at all, and this lesson gives you the two labels you will use for the rest of the course.",
      sections: [
        {
          heading: "Three tests that must all be true",
          paragraphs: [
            "A task is safe to draft when three things are true at once. The first test is that the output is words a named person will read, change, and own before anyone else sees them. The second test is that the input contains nothing the tool is not approved to receive. The third test is that the draft decides nothing about a person, which means it does not rank, reject, rate, score, or reach a conclusion about someone's conduct, performance, or future.",
            "All three tests have to pass. A task that uses an approved policy but asks the model to choose between two applicants fails the third test. A task that decides nothing but needs a colleague's sickness record as its input fails the second. A task that passes both but will go straight from the tool to an employee, with nobody reading it first, fails the first. When any one test fails, the task is not safe to draft.",
          ],
        },
        {
          heading: "What safe to draft does not mean",
          paragraphs: [
            "Safe to draft is not the same as safe to send. Every draft is still yours to check against the source before it leaves, and the second lesson shows how a sensible task can still produce a sentence that nobody should send. The label says that a model may produce the first version. It says nothing about whether that version is right.",
            "Safe to draft is also not a judgement about how easy a task is. A two-line letter telling someone that their probation has been extended is easy to write, but it records a decision about a person. A long guide to the hybrid working policy is harder to write, but it decides nothing about anyone. Difficulty and risk are different questions, and this course is only concerned with the second.",
          ],
        },
        {
          heading: "The second label: a person decides",
          paragraphs: [
            "When a task decides something about a named worker, it takes the second label, A person decides. Selection, scoring, the outcome of a grievance or a disciplinary, the reason for ending a contract, and a view on whether someone has performed well all belong here. The decision has to be made and recorded by someone with the authority to make it, and that person has to be able to explain it.",
            "A person decides does not mean the tool can never be opened. Once the decision has been made and written down, a model may help with the wording of the letter that communicates it, working from the recorded decision. What it may not do is supply the decision, the reason, or the ranking itself, because then the letter looks finished while containing a judgement that nobody made.",
          ],
        },
        {
          heading: "The mistake people usually make",
          paragraphs: [
            "The usual mistake is to judge a task by its verb. A request to suggest, summarise, or help with feels light, so people treat it as a draft. A request to suggest which of two candidates should receive an offer is still the offer decision, written as advice. A request to summarise which employees are most likely to leave is still a judgement about named people.",
            "The safer habit is to ignore the verb and ask what the output would do if it were used as it stands. If it would change what happens to a particular person, a person decides. If it would only put approved information into better words for a reader, and you will own those words before they leave, the task is safe to draft.",
          ],
        },
      ],
      workedExample: {
        title: "Five tasks from a Monday morning",
        inputLabel: "Monday's task list",
        outputLabel: "How the adviser marked it",
        prompt:
          "1. Rewrite the approved hybrid working policy into a short guide for new starters.\n2. Draft a template invitation to a first-stage interview.\n3. Decide which of two internal applicants goes forward to the panel for the team leader role.\n4. Turn the list of exit interview themes, already stripped of names by a colleague, into a one-page summary for the leadership team.\n5. Write the outcome letter for the grievance that has not yet been discussed with the hearing manager.",
        output:
          "1. Safe to draft.\n2. Safe to draft.\n3. A person decides.\n4. Safe to draft.\n5. A person decides.",
        reading: [
          "The first, second, and fourth tasks are safe to draft. Each produces words that the adviser will read and own, each uses a source the adviser is allowed to share, and none of them decides anything about a person. The exit interview themes pass the second test only because a colleague has already removed the names; the raw notes would not.",
          "The third task is a person decides, because choosing between two applicants is a selection decision. It does not matter that the adviser would check the model's choice afterwards, because the choice itself would have come from the tool.",
          "The fifth task is also a person decides, because the outcome of the grievance has not been reached. If the adviser asked a model to write that letter now, the model would have to invent the outcome, and the letter would look finished while containing a decision nobody made. Once the hearing manager has decided and recorded the outcome, the wording of the letter could be drafted from that record.",
        ],
      },
      practice: {
        intro:
          "Here are three tasks from another adviser's week. Mark each one using the two labels. The three tests are in the first section above: a named person reads and owns the words, the input is approved for the tool, and the draft decides nothing about a person.",
        check: {
          kind: "mark",
          prompt: "Mark each task as Safe to draft or as A person decides.",
          passLabel: SAFE,
          failLabel: DECIDES,
          sentences: [
            {
              id: "lone-working",
              text: "Rewrite the approved lone working policy into a one-page checklist for site staff.",
              fail: false,
              why: "The source is approved, the checklist will be read and owned by the adviser, and it judges nobody, so it is safe to draft.",
            },
            {
              id: "probation",
              text: "Decide whether the new cleaner at the Harlow site should have her probation extended.",
              fail: true,
              why: "Extending probation is a decision about a named person, so it fails the third test and a person decides.",
            },
            {
              id: "reminder",
              text: "Draft a template reminder asking managers to complete return-to-work forms within the week.",
              fail: false,
              why: "A template reminder names no one and decides nothing about anyone, so it is safe to draft.",
            },
          ],
          why: "That is right. The checklist and the reminder only put approved information into words you will own, and the probation question is a decision about a person.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "Here are five tasks from a different HR team's week. Mark each task as Safe to draft or as A person decides.",
        passLabel: SAFE,
        failLabel: DECIDES,
        sentences: [
          {
            id: "welcome",
            text: "Draft a welcome message for new starters in the finance team that explains where to find the expenses policy.",
            fail: false,
            why: "A welcome message uses an approved policy and does not rank, reject, or judge anyone, so it is safe to draft.",
          },
          {
            id: "fixed-term",
            text: "Write the reason we are not extending a named colleague's fixed-term contract.",
            fail: true,
            why: "This asks the model to supply the reason for a decision about a named person. That fails the third test, so a person decides, and the reason has to come from the manager who made it.",
          },
          {
            id: "parental-leave",
            text: "Turn the approved parental leave policy into a one-page question-and-answer sheet for managers.",
            fail: false,
            why: "Nobody is being judged here. The sheet explains an approved policy for managers, so it is safe to draft, although you still check each answer against the text.",
          },
          {
            id: "score",
            text: "Score the five internal applications for the team leader role against the criteria.",
            fail: true,
            why: "A score is not a draft. It is a judgement about each applicant, so this task fails the third test and a person decides.",
          },
          {
            id: "offer",
            text: "Suggest which of the two shortlisted candidates we should make an offer to.",
            fail: true,
            why: "The word suggest does not make this a draft. Choosing who receives an offer is a decision about a person, written as advice.",
          },
        ],
        why: "You kept every task that judges a person with a person, and you let the model draft only words you will own. The welcome message and the question-and-answer sheet explain approved policy, while the contract reason, the scores, and the offer are all decisions about named people.",
      },
      bridge:
        "The next lesson looks inside a task that is safe to draft and shows how the draft can still add a policy nobody gave it.",
    },
    {
      id: "what-the-draft-cannot-know",
      title: "What the draft cannot know",
      emphasis: "know",
      place:
        "You can now pick tasks that are safe to draft. This lesson shows the most common way an HR draft goes wrong even when the task was a sensible one, and it gives you two labels for reading every sentence a model writes.",
      sections: [
        {
          heading: "The model fills the gap",
          paragraphs: [
            "A model writes from the words you gave it and from patterns in the text it learned from. It has not read your handbook, it does not know which version of the sickness absence policy your board approved, and it cannot see the contract a particular employee signed. It does know how HR letters are usually written, and that is where the trouble starts.",
            "When your request is silent about a policy detail, the model does not stop and ask. It fills the gap with the kind of sentence that usually appears in HR letters, such as a number of days, a rate of pay, a timescale, or a named service. The sentence reads as confidently as the facts you did supply, and nothing in the draft tells you which sentences came from you and which came from the pattern.",
          ],
        },
        {
          heading: "Why this matters more in HR",
          paragraphs: [
            "In most writing, an invented detail is an embarrassment. In HR writing it can become an entitlement. A sentence that states a number of days, a rate of pay, or a service can be read by the employee as a promise, quoted back in a grievance, or relied on when they plan their leave or their return to work.",
            "Once that sentence has gone out, the organisation has two choices, and neither is comfortable. It can honour an entitlement that its policy never contained, or it can retract it and explain to the employee why the letter they were sent was wrong. Both cost more time and trust than reading the draft against the source would have done.",
          ],
        },
        {
          heading: "Two labels for every sentence",
          paragraphs: [
            "This lesson uses two labels. A sentence Stays within what we gave it when every fact in it can be found in the source you supplied, or when it contains no fact at all, such as a greeting, a thank-you, or a word of sympathy. Repeating a fact from the source is exactly what you asked the model to do, so a sentence with a number in it can still stay within what we gave it.",
            "A sentence Adds a policy we did not give it when it states a number, a right, a process, a service, or a commitment that is not in the source. It does not matter whether the added detail happens to match what your organisation usually does. If it did not come from the source, nobody has checked it, and it must not go out as it stands.",
            "The second label is not about tone or style. A warm sentence can stay within what we gave it, and a dry, businesslike sentence can add a policy. The only test is whether each fact in the sentence can be found in the source.",
          ],
        },
        {
          heading: "The mistake people usually make",
          paragraphs: [
            "The usual mistake is to read the draft for whether it sounds right rather than for where each fact came from. An experienced adviser knows that phased returns are common and that occupational health is often involved, so a sentence mentioning both feels familiar and passes unnoticed. Familiarity is the reason it slips through.",
            "The habit that works is slower and more reliable. Put the source beside the draft, read one sentence at a time, and find each number, right, and process in the source. If you cannot point to it, the sentence adds a policy we did not give it, whatever your own experience tells you.",
          ],
        },
      ],
      workedExample: {
        title: "A return from sickness absence",
        inputLabel: "The adviser's request",
        outputLabel: "What the model wrote",
        prompt:
          "Write a friendly email to an employee returning from long-term sickness absence. Our policy says their manager will hold a return-to-work meeting on their first day.",
        output:
          "Welcome back, and I hope you are feeling better. Your manager will meet you on your first day for a return-to-work conversation. You will have a phased return over four weeks on full pay. Occupational health will contact you within five working days.",
        reading: [
          "The first sentence contains no fact, so it stays within what we gave it. The second sentence repeats the one fact in the source, the meeting on the first day, so it also stays within what we gave it.",
          "The third sentence adds a policy we did not give it. A four-week phased return on full pay is a specific entitlement, and the adviser never supplied it. The model wrote it because letters of this kind often contain one.",
          "The fourth sentence also adds a policy we did not give it. It names a service and a timescale that were not in the source. If the email went out as written, the employee could reasonably expect four weeks on full pay and a call from occupational health, and the organisation would then have to honour or retract both.",
        ],
      },
      practice: {
        intro:
          "Here is a short source and the reply a model wrote from it. Mark each sentence with the two labels. The definitions are in the section on two labels above, and the worked example shows the same reading on a longer draft.",
        check: {
          kind: "mark",
          prompt: "Mark each sentence as Stays within what we gave it or as Adds a policy we did not give it.",
          material: {
            label: "The source",
            text: "Our holiday policy says staff may carry over up to five days of unused holiday into the next holiday year, with their manager's agreement.",
          },
          passLabel: WITHIN,
          failLabel: ADDS,
          sentences: [
            {
              id: "thanks",
              text: "Thank you for your question about carrying over holiday.",
              fail: false,
              why: "A thank-you contains no policy fact, so it stays within what we gave it.",
            },
            {
              id: "five",
              text: "You may carry over up to five unused days into next year if your manager agrees.",
              fail: false,
              why: "Five days and the manager's agreement are both in the source, so this sentence stays within what we gave it.",
            },
            {
              id: "paid",
              text: "Any days you do not carry over will be paid to you in March.",
              fail: true,
              why: "The source says nothing about paying for unused days or about March, so this sentence adds a policy we did not give it.",
            },
          ],
          why: "That is right. The thanks and the carry-over rule stay within the source, and the payment in March is a financial commitment the model supplied.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "The source said only this: our policy gives five days of paid compassionate leave for the death of a close family member, and the employee should tell their manager which days they will take. Mark each sentence of the model's draft.",
        passLabel: WITHIN,
        failLabel: ADDS,
        sentences: [
          {
            id: "sorry",
            text: "I am so sorry for your loss.",
            fail: false,
            why: "A word of sympathy states no number, right, or process, so it stays within what we gave it.",
          },
          {
            id: "entitled",
            text: "You are entitled to five days of paid compassionate leave.",
            fail: false,
            why: "Five days of paid compassionate leave is exactly the entitlement the source states, so this sentence stays within what we gave it.",
          },
          {
            id: "unpaid",
            text: "If you need more time, you can take up to ten further days of unpaid leave.",
            fail: true,
            why: "The source never mentions further leave. Ten unpaid days is a new entitlement the model supplied, and the employee may rely on it.",
          },
          {
            id: "tell-manager",
            text: "Please let your manager know which days you will take.",
            fail: false,
            why: "Telling the manager which days is the process the source describes, written as a request, so it stays within what we gave it.",
          },
          {
            id: "travel",
            text: "We will also cover your travel costs if the funeral is abroad.",
            fail: true,
            why: "Nothing in the source mentions travel costs. This sentence commits the organisation to paying money, so it adds a policy we did not give it.",
          },
        ],
        why: "You found both sentences that add a policy we did not give it, the ten unpaid days and the travel costs, and you let the sympathy, the stated entitlement, and the process stand.",
      },
      bridge:
        "The next lesson turns this into a habit by writing briefs that give the model the source and the limit before it starts.",
    },
    {
      id: "three-patterns",
      title: "Three patterns",
      emphasis: "patterns",
      place:
        "You can now choose a task that is safe to draft and read a draft for added policy. This lesson gives you three reusable briefs for the kinds of HR drafting that come round every week.",
      sections: [
        {
          heading: "A pattern has four parts",
          paragraphs: [
            "A pattern is a brief you can reuse every time a certain kind of task comes round, with the same four parts each time. The source is the approved text or the prepared material the model may use, and nothing else. The reader is the person the draft is written for, such as a new starter, a line manager, or the leadership team.",
            "The limit says what the draft must not add, most often a number, an entitlement, a date, or a judgement about a person. Write it as a plain instruction that starts with do not, must not, never, or only, and tell the model what to write when the source is silent, for example 'Check with HR'. The owner is the person who reads the draft against the source before it leaves, named by role.",
            "When you read a brief, go through the four parts and say, for each one, either that the brief gives this or that the brief leaves this out. A part that the brief leaves out is a part the model will fill for itself.",
          ],
        },
        {
          heading: "The three patterns that cover most HR drafting",
          paragraphs: [
            "Three patterns cover most safe drafting in HR. A rewrite pattern turns approved policy text into words for a named reader, such as a guide for new starters or a question-and-answer sheet for managers. A summary pattern turns material that has already been stripped of anything identifying into themes for a named reader, such as exit interview themes for the leadership team.",
            "A template pattern produces a blank document with placeholders and no real person in it, such as an interview invitation, an induction checklist, or a letter inviting someone to a meeting. The personal details go in afterwards, by hand, in the system your organisation uses for letters.",
          ],
          beforeAfter: {
            before: "Turn our sickness absence policy into something managers can use.",
            after:
              "Source: the sickness absence policy pasted below, and nothing else. Reader: a line manager who has never handled a long-term absence. Limit: do not add any number of days, rate of pay, service, or timescale that is not in the source; where the source is silent, write 'Check with HR'. Owner: the HR adviser reads the guide against the policy before it goes out.",
            reading:
              "The first version gives the model a topic and leaves it to decide what managers need, what may be added, and who checks. The second version gives all four parts, so it can be run again next month by anyone on the team.",
          },
        },
        {
          heading: "What a pattern is not",
          paragraphs: [
            "A pattern is not a library of fifty clever prompts. Three briefs that you actually reuse, with their limits tested on real drafts, are worth more than a folder of prompts that nobody has checked. The value is in the repetition, because each time the pattern runs you learn whether its limit is doing its job.",
            "A pattern is never a brief that asks the model to make a decision. A brief that asks which teams are most at risk, which candidate is strongest, or whether a grievance is justified would fail the third test from the first lesson every time it ran, so it cannot be a pattern however well it is written.",
          ],
        },
        {
          heading: "The mistake people usually make",
          paragraphs: [
            "The usual mistake is to write a brief with a good source and a clear reader and to leave out the limit and the owner, because the draft looked fine the first time. The limit matters most on the day the source is silent, and that day will come. The owner matters most on the day someone else reruns the pattern and assumes the checking has been done.",
            "The second mistake is to let the source drift. A pattern written for the approved policy text is quietly rerun with a manager's email pasted in instead, and the brief still looks like a pattern. Name the source precisely, so that anyone reusing it can see when they are about to paste something else.",
          ],
        },
      ],
      workedExample: {
        title: "A rewrite pattern for the sickness absence policy",
        inputLabel: "The rewrite pattern",
        outputLabel: "What the model returned",
        prompt:
          "Source: the text of our sickness absence policy, pasted below, and nothing else. Reader: a line manager who has never handled a long-term absence. Limit: do not add any number of days, any rate of pay, any service, or any timescale that is not in the source; if the source does not answer a question, write 'Check with HR'. Owner: I will read the draft against the policy before it goes to managers. Output: a one-page guide with five headings.",
        output:
          "Reporting an absence. Keeping in touch. The return-to-work meeting. Phased returns: Check with HR. Recording the absence.\n\nUnder each heading, the guide gives two or three sentences taken from the policy text.",
        reading: [
          "The limit did its work. In the previous lesson, the same silence in the policy produced a four-week phased return on full pay. Here, the limit told the model what to write when the source was silent, so the gap is visible instead of filled, and the manager knows to ask.",
          "The owner line matters as well, because it makes it plain who is accountable for the guide. A colleague who reruns this pattern after the policy is updated knows that somebody has to read the new guide against the new policy before it goes out.",
          "Every part can be reused. Next quarter the adviser can swap in the lone working policy, keep the reader and the owner, and adjust the limit to the kind of fact that policy is likely to attract.",
        ],
      },
      practice: {
        intro:
          "Here is a template brief another adviser wrote. For each of the four parts, mark whether the brief gives it or leaves it out. The four parts are described in the first section above.",
        check: {
          kind: "mark",
          prompt: "For each part, mark whether this brief gives it or leaves it out.",
          material: {
            label: "The brief",
            text: "Source: our blank interview invitation template and the interview section of the recruitment procedure. Reader: an external candidate invited to a first-stage interview. Output: a letter with placeholders for the name, the role, the date, and the time.",
          },
          passLabel: "The brief gives this",
          failLabel: "The brief leaves this out",
          sentences: [
            {
              id: "source",
              text: "Source",
              fail: false,
              why: "The blank template and the recruitment procedure are a named, approved source, so the brief gives this.",
            },
            {
              id: "reader",
              text: "Reader",
              fail: false,
              why: "An external candidate invited to a first-stage interview is a named reader, so the brief gives this.",
            },
            {
              id: "limit",
              text: "Limit",
              fail: true,
              why: "Nothing says what the letter must not add, so the model could invent a dress code, travel expenses, or a panel.",
            },
            {
              id: "owner",
              text: "Owner",
              fail: true,
              why: "The brief does not say who reads the letter against the procedure before it is used, so the brief leaves this out.",
            },
          ],
          why: "That is right. The brief gives a source and a reader, but it has no limit and no owner, so it is not yet a pattern you can hand to a colleague.",
        },
      },
      check: {
        kind: "choose",
        prompt:
          "Both of these are summary briefs for this month's exit interviews. Choose the one you would reuse as a pattern.",
        leftLabel: "Brief A",
        left: "Here are this month's exit interview notes. Summarise why people are leaving and tell me which teams are most at risk of losing more people.",
        rightLabel: "Brief B",
        right:
          "Source: the list of themes below, which a colleague has already stripped of names, job titles, and dates. Reader: the leadership team. Limit: report only themes that appear in the list, do not estimate numbers, and do not name any team with fewer than ten people. Owner: the head of people reads the summary against the list before it is sent. Output: five bullet points and one sentence on what the list cannot tell us.",
        correct: "right",
        why: "Brief B names a prepared source, a reader, a limit on what must not be added, and the owner who checks it, so it can be reused every month. You chose the brief with all four parts.",
        wrong:
          "Look again at Brief A. It pastes raw exit notes, which may identify people, and asks which teams are most at risk, which is a judgement the model cannot make from notes. It has no limit and no owner, so it is not a pattern you can reuse.",
      },
      bridge:
        "The source is the part of a pattern most likely to carry something that should never be in the tool, and the next lesson names what that is.",
    },
    {
      id: "what-you-never-paste",
      title: "What you never paste",
      emphasis: "paste",
      place:
        "You now have patterns with a source. This lesson draws the line around what may never be part of that source, whatever the task, and gives you the two labels Hold and Can go in.",
      sections: [
        {
          heading: "Held information",
          paragraphs: [
            "Some information about workers must not go into an AI tool at all. This course calls it held information, and marks it with the label Hold. There are three groups, and a piece of information that belongs to any one of them is held.",
            "The first group is what UK data protection law calls special category data, set out in Article 9 of the UK GDPR: information about a person's racial or ethnic origin, political opinions, religious or philosophical beliefs, trade union membership, genetic data, biometric data used to identify them, health, sex life, or sexual orientation. The second group is information about criminal convictions and offences, which Article 10 treats separately. The Information Commissioner's Office explains both in its Guide to the UK GDPR.",
            "The third group is information that is not special category in law but causes real harm in HR if it leaks or is misused. It covers grievance, disciplinary, and investigation detail about identifiable people, individual pay and bank details, identity documents, and anything connected to legal advice or a live claim. The Acas Code of Practice on disciplinary and grievance procedures is a reminder of how carefully that material has to be handled.",
          ],
        },
        {
          heading: "What can go in",
          paragraphs: [
            "Information takes the label Can go in when it is approved policy text, a prepared source with nothing that identifies a person, or a blank template, and when it goes into the tool your organisation has approved for this work. A description of the task, such as 'write a letter inviting an employee to a review meeting', can also go in, because it names no one.",
            "Your organisation's data protection lead may set a stricter list than this one. Where they do, their list wins. The three groups in this lesson are a floor for your own practice, and they are not a statement of what the law requires of your organisation.",
          ],
        },
        {
          heading: "Removing a name is not enough",
          paragraphs: [
            "Removing a name does not turn held information into something that can go in. In a small team, a role, a date, and a condition together can identify someone as surely as a name. 'The warehouse supervisor at the Corby site who has just returned from surgery' is one person, and everyone on that site knows who she is.",
            "The same is true of a pseudonym. Calling someone Employee P and keeping their diagnosis, their union membership, or their warnings in the prompt changes nothing that matters. The question is never whether the name is there. It is whether the information belongs to one of the three groups and could be tied to a person.",
          ],
          beforeAfter: {
            before: "An employee in our six-person accounts team has told us she is pregnant and wants to change her hours.",
            after: "An employee has asked to change her hours under our flexible working policy.",
            reading:
              "In a team of six, the first version identifies her and discloses health information. The second keeps the task, which is a flexible working request, and holds everything the letter does not need.",
          },
        },
        {
          heading: "The mistake people usually make",
          paragraphs: [
            "The usual mistake is to paste context. A manager wants a letter that is kind and careful, so they explain the whole situation to the tool, including the diagnosis, the family circumstances, and the history of warnings. The context feels like it will make the letter better. In practice the letter rarely needs it, and every held detail has now left the organisation's control.",
            "The better habit is to mark each part of a prompt before you run it, one phrase at a time, as Hold or Can go in. Most prompts turn out to need only the task and the policy, and the rest was the writer thinking aloud.",
          ],
        },
      ],
      workedExample: {
        title: "A manager's prompt about absence",
        inputLabel: "The manager's prompt",
        outputLabel: "How each part was marked",
        prompt:
          "Help me write to Priya about her absences. She has had six days off this quarter. She told me it is related to her IVF treatment, and she is in the union, so I want to be careful. Our policy says a review meeting is triggered after five days in a rolling twelve months.",
        output:
          "Priya: Hold.\nSix days off this quarter: Hold.\nIVF treatment: Hold.\nIn the union: Hold.\nA review meeting is triggered after five days in a rolling twelve months: Can go in.",
        reading: [
          "The name Priya is held, because it identifies the person. The six days this quarter is held, because an individual's absence record is health-related information about an identifiable person.",
          "The IVF treatment is held, because it is health data and therefore special category data. Union membership is held, because it is special category data in its own right. The manager mentioned both to explain why they wanted to be careful, and being careful means leaving them out.",
          "The policy trigger of five days in a rolling twelve months can go in, because it is approved policy text and says nothing about any person. Only one part of the prompt could go into the tool. The rest was the manager's context, and the letter the manager needs can be drafted from the policy alone.",
        ],
      },
      practice: {
        intro:
          "Here is a team leader's prompt about a new rota. Mark each sentence as Can go in or Hold. The three groups of held information are in the first section above.",
        check: {
          kind: "mark",
          prompt: "Mark each sentence of the prompt as Can go in or Hold.",
          passLabel: GOES_IN,
          failLabel: HOLD,
          sentences: [
            {
              id: "task",
              text: "Please help me write a note to the team about the new rota.",
              fail: false,
              why: "This describes the task and names no one, so it can go in.",
            },
            {
              id: "depression",
              text: "Sam in dispatch is on a return-to-work plan after treatment for depression.",
              fail: true,
              why: "This is health information about a named person, which is special category data, so you hold it.",
            },
            {
              id: "notice",
              text: "Our rota policy gives staff two weeks' notice of shift changes.",
              fail: false,
              why: "This is policy text and identifies nobody, so it can go in.",
            },
            {
              id: "warnings",
              text: "Two of the drivers are appealing their final written warnings.",
              fail: true,
              why: "Disciplinary detail about identifiable people belongs to the third group, so you hold it even without names.",
            },
          ],
          why: "That is right. The task and the policy can go in, and the health information and the disciplinary appeals are held. The note about the rota needs neither.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "A different manager wrote this prompt. Mark each sentence as information that can go in or information you hold.",
        passLabel: GOES_IN,
        failLabel: HOLD,
        sentences: [
          {
            id: "summary",
            text: "I need a short summary of our flexible working request process for new managers.",
            fail: false,
            why: "Nothing in this sentence is about a person. It describes the task, so it can go in.",
          },
          {
            id: "diagnosis",
            text: "The request from the warehouse supervisor mentions her son's autism diagnosis.",
            fail: true,
            why: "There is no name, but the warehouse supervisor is one identifiable person, and her son's diagnosis is health information. It is held.",
          },
          {
            id: "two-months",
            text: "Our policy says we respond to a request within two months.",
            fail: false,
            why: "This is a sentence from the policy. It identifies no one, so it can go in.",
          },
          {
            id: "lateness",
            text: "He has had two written warnings for lateness in the past year.",
            fail: true,
            why: "Warnings are disciplinary detail about a person. The third group holds that, whether or not a name is given.",
          },
          {
            id: "headcount",
            text: "The team has twelve people across two sites.",
            fail: false,
            why: "A headcount of twelve across two sites does not point to any individual, so this can go in.",
          },
        ],
        why: "You held the health information and the disciplinary detail, and you let the task, the policy, and the headcount go in.",
      },
      bridge:
        "Marking held information is half the move, and the next lesson repairs the prompt so the task can still be done without it.",
    },
    {
      id: "repair-the-prompt",
      title: "Repair the prompt",
      emphasis: "Repair",
      place:
        "You can now spot held information. This lesson teaches you to rewrite a prompt so the task survives and the held information does not.",
      sections: [
        {
          heading: "Deleting is not always enough",
          paragraphs: [
            "When a prompt contains held information, deleting it is not always enough, because the task may still need something in its place. A letter inviting someone to a review meeting still needs to say who it is for and when the meeting is, even though the name and the date cannot go into the tool.",
            "A repair keeps the task and the source, removes or replaces everything held, and adds a limit so the model does not put back what you took out. It is finished when a colleague could run the repaired prompt and get a usable draft without the held information ever entering the tool.",
          ],
        },
        {
          heading: "Three repairs, smallest first",
          paragraphs: [
            "There are three repairs, and you use the smallest one that works. Remove the detail when the task does not need it at all, which is more often than people expect, because a letter that follows policy rarely needs the reason behind an absence.",
            "Generalise the detail when the task needs a type of fact but not the fact itself. Write 'an employee' instead of a name, 'the absence trigger in the policy has been reached' instead of a count of days, and use placeholders such as [name] and [date] that you fill in afterwards, outside the tool, in the system your organisation uses for letters.",
            "Move the task out of the tool when the held information is the task, as it is when a letter has to respond to what the person disclosed. In that case you write it yourself, or you draft the surrounding letter from a blank template and add the personal part by hand afterwards.",
          ],
        },
        {
          heading: "Add the limit",
          paragraphs: [
            "Once the held information is gone, add a limit that stops the model from filling the gap. A letter about a return to work, written without any mention of the reason, is exactly the kind of draft where the model will offer a sentence about recovery, a phased return, or occupational health. Write the limit in plain words: 'Do not mention any health condition, reason for absence, or pay.'",
            "The limit does two jobs. It stops the model from inventing a reason, and it tells the next person who reuses the prompt what was deliberately left out, so they do not helpfully add it back.",
          ],
          beforeAfter: {
            before: "Write to Employee P about her six absences and her treatment, and invite her to a review meeting.",
            after:
              "Write a short, kind letter inviting [name] to a review meeting on [date] under our sickness absence policy. Do not mention any reason for absence, any health condition, or any number of days.",
            reading:
              "The first version is a pseudonym with everything held still in it. The second removes the treatment, generalises the name and the date into placeholders, and adds a limit that keeps them out of the draft.",
          },
        },
        {
          heading: "The mistake people usually make",
          paragraphs: [
            "The usual mistake is to treat a pseudonym as a repair. Calling Priya 'Employee P' and keeping her treatment and her union membership in the prompt changes nothing that matters, because the information is still held and she is still identifiable to anyone who knows the team.",
            "The second mistake is to strip the prompt so thoroughly that the task disappears. A prompt that says only 'write a letter' is safe, but it is useless, and the model will fill every silence. Keep the task, keep the policy, and remove only what is held.",
          ],
        },
      ],
      workedExample: {
        title: "Repairing the manager's absence prompt",
        inputLabel: "The repaired prompt",
        outputLabel: "The letter it produced",
        prompt:
          "Source: our sickness absence policy, pasted below. Reader: an employee who has reached the review trigger in the policy. Limit: do not mention any reason for absence, any health condition, or any number of days; do not add any outcome of the meeting. Output: a short, kind letter inviting them to a review meeting, with placeholders for the name, the date, and the time.",
        output:
          "Dear [name],\n\nUnder our sickness absence policy, we hold a review meeting when the absence trigger has been reached, and I would like to invite you to one on [date] at [time]. The meeting is a chance to talk about how you are and about any support that would help. Please let me know if the time does not suit you.\n\nKind regards",
        reading: [
          "The name and the dates were generalised into placeholders, and the treatment and the union membership were removed, because the letter never needed them. The policy stayed as the source, and the limit stopped the model from mentioning a reason or a number of days.",
          "The manager adds the name, the date, and the time by hand in the organisation's own letter system, and adds nothing about the treatment, because the meeting is where that conversation belongs.",
          "The letter is more useful than the one the manager first asked for, because it cannot be read as a judgement about why the employee was absent.",
        ],
      },
      practice: {
        intro:
          "A line manager wants a letter inviting an employee to a meeting about a flexible working request. The request mentions the employee's caring responsibilities for a parent with dementia. Choose the repair you would run. The three repairs are described in the second section above.",
        check: {
          kind: "choose",
          prompt: "Choose the repaired prompt that keeps the task and holds everything the letter does not need.",
          leftLabel: "Repair A",
          left: "Write to Employee K in the Stockport contact centre, who cares for her mother with dementia, inviting her to a meeting about her flexible working request on 14 May.",
          rightLabel: "Repair B",
          right:
            "Using our flexible working policy, pasted below, write a short letter inviting [name] to a meeting about their flexible working request on [date]. Do not mention the reason for the request or any health condition.",
          correct: "right",
          why: "Repair B keeps the task and the policy, generalises the name and the date into placeholders, removes the dementia diagnosis, and adds a limit so the model does not put a reason back. Repair A is a pseudonym with the held information still in it.",
          wrong:
            "Look again at Repair A. Employee K is a pseudonym, and the site, the date, and her mother's dementia together still identify her and disclose health information. Repair B removes the diagnosis and uses placeholders.",
        },
      },
      check: {
        kind: "edit",
        prompt:
          "This prompt contains held information. Edit it so that the task can still be done and nothing held remains. Keep the task and the policy, replace the name and the date with placeholders such as [name] and [date], and add a limit that stops the letter mentioning health or pay.",
        label: "The prompt you are repairing",
        start:
          "Draft a letter to Tom Reid in payroll confirming his return to work on 3 March after his hernia operation. He is paid on grade 4 of the payroll pay scale and he asked us not to tell his team about the operation. Our policy says a return-to-work meeting takes place on the first day back.",
        unchanged:
          "You have not changed the prompt yet. Start with the operation and the pay grade, which are held, and replace the name and the date with placeholders.",
        keep: [
          {
            id: "task",
            any: ["return to work", "return-to-work", "returning to work"],
            missing:
              "The prompt no longer says what to write. Keep the task so the model knows it is a letter confirming a return to work.",
          },
          {
            id: "policy",
            any: ["first day"],
            missing:
              "You removed the source as well. Keep the policy sentence about the meeting on the first day back, because the letter has to follow it.",
          },
          {
            id: "placeholder",
            any: ["[", "placeholder"],
            missing:
              "The prompt still needs placeholders. Replace the name and the return date with [name] and [date], and fill them in outside the tool.",
          },
        ],
        limits: [
          {
            id: "health",
            any: ["health", "medical", "operation", "condition", "reason for", "illness", "surgery", "absence"],
            missing:
              "Your limit does not yet cover health. Add a sentence such as 'Do not mention any health condition or reason for absence', because the operation is health information and the letter does not need it.",
          },
          {
            id: "pay",
            any: ["pay", "grade", "salary", "wage"],
            missing:
              "Your limit does not yet cover pay. Add a sentence such as 'Do not mention pay or grade', because individual pay is held and a return-to-work letter does not need it.",
          },
        ],
        why: "That repair works. You removed the operation, the pay grade, and the privacy request, generalised the name and the date into placeholders, kept the task and the policy, and added a limit that stops the model putting health or pay back into the letter.",
        result: {
          label: "The letter your repaired prompt produces",
          text: "Dear [name], I am writing to confirm your return to work on [date]. Our policy is that a return-to-work meeting takes place on your first day back, and your manager will meet you then. Please let me know if you have any questions before you return.",
        },
      },
      bridge:
        "You can now choose a safe task, read a draft for added policy, write a pattern, and repair a prompt. The next lesson puts all of that to work on situations you have not seen.",
    },
    {
      id: "course-assessment",
      title: "Course assessment",
      emphasis: "assessment",
      place:
        "This is the sixth of seven lessons. It brings together the method from the first five lessons, works one mixed example, and then assesses the whole method on situations you have not seen, before the final lesson asks you to write your own patterns and hold list.",
      sections: [
        {
          heading: "Safe to draft, and what the draft cannot know",
          paragraphs: [
            "A task is safe to draft when three tests pass at once: a named person reads, changes, and owns the words before anyone else sees them, the input contains nothing the tool is not approved to receive, and the draft decides nothing about a person. When a task ranks, scores, selects, or reaches a conclusion about a named worker, it takes the other label, A person decides, and the model may help only with the wording of a decision someone has already made and recorded.",
            "Even a task that is safe to draft can go wrong. When the source is silent, the model fills the gap with the kind of sentence HR letters usually contain, such as a number of days, a rate of pay, or a service. Read the draft one sentence at a time beside the source. A sentence stays within what we gave it when every fact in it is in the source, and it adds a policy we did not give it when it states a number, a right, or a commitment that is not.",
          ],
        },
        {
          heading: "Patterns and held information",
          paragraphs: [
            "A pattern is a reusable brief with four parts: a source that is approved text, prepared material, or a blank template; a reader named by role; a limit that says what the draft must not add; and an owner who reads the draft against the source before it leaves. The three patterns that cover most HR drafting are a rewrite, a summary, and a template. A brief that asks the model to decide something about a person is never a pattern.",
            "Held information never goes into the tool. It covers special category data, criminal offence data, and the HR material that causes harm if it leaks, such as grievance, disciplinary, and investigation detail, individual pay, and identity documents. Removing a name does not release it, and neither does a pseudonym, because in a small team a role, a date, and a condition can identify someone as surely as a name.",
          ],
        },
        {
          heading: "Repairs, and how the assessment works",
          paragraphs: [
            "When a prompt contains held information, use the smallest repair that works. Remove the detail when the task does not need it, generalise it into a placeholder when the task needs a type of fact but not the fact, and move the task out of the tool when the held information is the task. Then add a limit so the model does not put back what you took out, and keep the task and the source so the prompt still does its job.",
            "The assessment at the end of this lesson sets seven situations from different HR teams. Each question has one right answer, and each draws on one or more of the moves above. You need six of the seven to pass, and after you submit, each question shows the feedback for the option you chose.",
          ],
        },
      ],
      workedExample: {
        title: "One request, read with every move",
        inputLabel: "The request that came in",
        outputLabel: "The brief the adviser ran",
        prompt:
          "From the site manager at Farrow Foods, Wisbech: 'Can you get the tool to draft letters to the three agency workers on the packing line whose assignments we are ending, explaining why? One of them has had a lot of time off for his back, and the other two were late a few times.'",
        output:
          "Source: the end-of-assignment wording from our agreement with the agency, pasted below, and nothing else. Reader: an agency worker whose assignment is ending. Limit: do not give any reason for the assignment ending, do not mention absence, health, or conduct, and do not add any date or payment that is not in the source. Owner: the site manager reads each letter against the agreement before it is sent. Output: a template letter with placeholders for the name, the end date, and the agency contact.",
        reading: [
          "The adviser first asked whether the task was safe to draft. Explaining why an assignment is ending is a decision about named people, so the reason stays with the site manager, who has to own it. The letter itself, without the reason, is a template task.",
          "The adviser then marked the request for held information. The back problem is health data, the lateness is conduct detail about identifiable people, and the three workers can be picked out from the site and the line. None of that went into the tool.",
          "The brief that went in is a template pattern with all four parts. Its limit names the kinds of fact a letter like this tends to attract, a reason, a date, and a payment, so the model cannot supply them. The site manager adds the names and dates by hand and owns what the letters say.",
        ],
      },
      practice: {
        intro:
          "Before the assessment, choose between two briefs for the Farrow Foods letters. The worked example and the recap above are still on the page.",
        check: {
          kind: "choose",
          prompt: "Choose the brief you would run for the end-of-assignment letters.",
          leftLabel: "Brief A",
          left: "Source: the end-of-assignment wording from our agency agreement. Reader: an agency worker whose assignment is ending. Limit: do not give any reason, do not mention absence, health, or conduct, and do not add any date or payment. Owner: the site manager reads each letter before it is sent. Output: a template letter with placeholders.",
          rightLabel: "Brief B",
          right:
            "Write three letters to the agency workers on the Wisbech packing line whose assignments are ending. Explain kindly that one had too much time off for his back and the other two were late, and keep the tone respectful.",
          correct: "left",
          why: "Brief A is a template pattern with a source, a reader, a limit, and an owner, and it keeps the reason with the site manager. Brief B puts health and conduct detail into the tool and asks the model to explain a decision about named people.",
          wrong:
            "Look again at Brief B. It puts a health condition and conduct detail about identifiable workers into the tool, and it asks the model to explain a decision a person must own. A respectful tone does not change either problem. Brief A holds both and keeps all four parts.",
        },
      },
      check: {
        kind: "scenario",
        prompt:
          "Read each situation and choose what you would do. Each question has one right answer, and you need six of the seven to pass.",
        passMark: 6,
        questions: [
          {
            id: "ranking",
            situation:
              "Nadia Rahman is the HR adviser at Pemberton Care Homes. The operations director has asked her to use the AI tool to rank the twelve night care assistants for a new senior carer post, using their last appraisal notes. The director wants the list by Thursday.",
            question: "What should Nadia do?",
            options: [
              {
                id: "a",
                text: "Remove the names from the appraisal notes, paste them in, and ask the model for a ranking.",
                feedback:
                  "Removing the names does not change what the task is. A ranking is a judgement about each carer, so a person decides, and appraisal notes about twelve people on one shift can still identify them. The better move is to keep the ranking with the panel.",
              },
              {
                id: "b",
                text: "Tell the director that the ranking is a decision the panel makes, and offer to draft a blank scoring sheet from the approved criteria for the post.",
                correct: true,
                feedback:
                  "That holds. Ranking candidates fails the third test, so it stays with a person, while a blank scoring sheet built from approved criteria decides nothing and is safe to draft. The director still gets help by Thursday.",
              },
              {
                id: "c",
                text: "Ask the model to rank them, then check the ranking herself before sending it to the director.",
                feedback:
                  "Checking afterwards does not move the decision back to a person, because the order came from the tool. It also means the appraisal notes went in. Keep the ranking with the panel and draft only the blank scoring sheet.",
              },
              {
                id: "d",
                text: "Ask the model to summarise each carer's strengths from the notes, so the director can rank them himself.",
                feedback:
                  "A summary of each named carer's strengths is still a judgement about each person, and it needs their appraisal notes as input. The director would rank from the model's reading. Offer a blank scoring sheet from the approved criteria instead.",
              },
            ],
          },
          {
            id: "phased-return",
            situation:
              "Owen Price is a people partner at Larchfield Estates. His source said only that staff returning from maternity leave can request a phased return by agreement with their manager. The draft email he asked for includes the sentence 'You will work three days a week for your first month at full pay.'",
            question: "What should Owen do with that sentence?",
            options: [
              {
                id: "a",
                text: "Keep it, because phased returns of that kind are common and the employee will welcome it.",
                feedback:
                  "How common something is does not put it in the source. Three days a week on full pay is an entitlement nobody supplied, and the employee may plan around it. The sentence adds a policy we did not give it.",
              },
              {
                id: "b",
                text: "Change 'will' to 'may', so the sentence reads as a possibility rather than a promise.",
                feedback:
                  "Softening the verb still puts a specific arrangement and full pay in front of the employee, and she can reasonably ask for exactly that. The detail is not in the source, so it has to come out, and the brief needs a limit.",
              },
              {
                id: "c",
                text: "Remove it, because it adds a policy we did not give it, and add a limit to the brief so the next draft cannot state a pattern of days or a rate of pay.",
                correct: true,
                feedback:
                  "That holds. The source said only that a phased return can be requested by agreement, so three days a week on full pay is an added policy. Removing it fixes this email, and the limit fixes the next one.",
              },
              {
                id: "d",
                text: "Send the email as it is and correct the arrangement later if her manager disagrees.",
                feedback:
                  "Once the email has gone, the organisation has to honour the arrangement or retract it, and either is harder than a careful read now. The sentence adds a policy we did not give it and should be removed before sending.",
              },
            ],
          },
          {
            id: "absence-summary",
            situation:
              "Joanna Whitfield leads people operations at Carrick Housing Association. Every month she sends the directors a summary of absence themes, prepared by the analytics team with names, teams, and dates already removed. She wants a brief she can hand to a colleague while she is on leave.",
            question: "Which brief should she hand over?",
            options: [
              {
                id: "a",
                text: "Summarise this month's absence spreadsheet for the directors and tell them which managers need to take action.",
                feedback:
                  "A raw spreadsheet is not the prepared source, and deciding which managers need to take action is a judgement about people. The brief has no limit and no owner. The one to hand over names the prepared themes and all four parts.",
              },
              {
                id: "b",
                text: "Write a clear, professional summary of absence for the directors, in the usual style.",
                feedback:
                  "This names a reader, but not the source, the limit, or the owner. Her colleague would not know which material to use, and the model would supply its own numbers. The brief with all four parts is the one to hand over.",
              },
              {
                id: "c",
                text: "Source: the absence themes from analytics. Reader: the directors. Output: five bullet points.",
                feedback:
                  "This has a source and a reader, but no limit and no owner. With no limit, the model may estimate figures or name a small team, and with no owner, nobody reads the summary against the themes before it goes. Choose the brief with all four parts.",
              },
              {
                id: "d",
                text: "Source: the absence themes prepared by analytics, and nothing else. Reader: the directors. Limit: report only themes in the list, do not estimate numbers, and do not name any team of fewer than ten people. Owner: the deputy head of people reads the summary against the themes before it is sent.",
                correct: true,
                feedback:
                  "That holds. The brief names a prepared source, a reader, a limit on what must not be added, and an owner by role, so her colleague can run it while she is away and someone still checks the result.",
              },
            ],
          },
          {
            id: "religious-observance",
            situation:
              "Grace Ellison is the office manager at Tern Architects, a practice of fourteen people, and she carries the HR role. An architect has asked to finish at two o'clock on Fridays for religious observance, and Grace wants help drafting the reply that invites her to discuss the request under the flexible working policy.",
            question: "What should Grace put into the tool?",
            options: [
              {
                id: "a",
                text: "The flexible working policy text and a request for a short reply with placeholders for the name, the date, and the meeting time, and a limit that it must not mention the reason for the request.",
                correct: true,
                feedback:
                  "That holds. Religious belief is special category data, and in a practice of fourteen the request identifies her. The policy and a template with placeholders can go in, and the limit keeps the reason out of the draft.",
              },
              {
                id: "b",
                text: "The whole request with her name removed, so the reply can respond to what she wrote.",
                feedback:
                  "In a practice of fourteen people, a Friday finish for religious observance identifies her without a name, and religious belief is special category data. Hold the request and draft from the policy with placeholders.",
              },
              {
                id: "c",
                text: "The request with her name changed to Employee G, so nobody outside the practice can tell who she is.",
                feedback:
                  "A pseudonym changes nothing that matters. Her religious observance is still in the prompt and is still held. Use the policy text and a template with placeholders, and keep the reason out of the tool.",
              },
              {
                id: "d",
                text: "Only the reason for the request, because a reason on its own is not a name.",
                feedback:
                  "The reason is the held part. Religious belief is special category data whether or not a name comes with it. The policy text is what can go in.",
              },
            ],
          },
          {
            id: "disciplinary-invite",
            situation:
              "Ravi Bansal, a warehouse manager at Kestrel Distribution, sends the HR adviser this prompt: 'Write to Daniel Frost, who has a disciplinary hearing on 12 May for two unauthorised absences, inviting him and telling him he can bring a companion.' The adviser needs to send the invitation this week.",
            question: "Which repair should the adviser make?",
            options: [
              {
                id: "a",
                text: "Replace the name with D.F. and keep the rest of the prompt as it is.",
                feedback:
                  "Initials are a pseudonym, and the hearing date and the allegation still identify him and disclose disciplinary detail. That is not a repair. Draft the invitation from a blank template and add the personal details by hand.",
              },
              {
                id: "b",
                text: "Delete everything and ask the model simply to write a letter.",
                feedback:
                  "That removes the held information, but it also removes the task and the source. The model will fill every silence, including what the hearing is and what rights he has. Keep the task and the procedure, and hold only what is held.",
              },
              {
                id: "c",
                text: "Draft a blank invitation template from the disciplinary procedure, with placeholders for the name, the date, and the allegation, and add those by hand in the HR system.",
                correct: true,
                feedback:
                  "That holds. The allegation is the held part and the letter has to state it, so that part moves out of the tool. The rest of the invitation, including the companion wording from the procedure, can be drafted from a template with placeholders.",
              },
              {
                id: "d",
                text: "Run the prompt as it is, because the invitation has to mention the allegation anyway.",
                feedback:
                  "The letter does have to state the allegation, but that is a reason to add it by hand, not to paste it into the tool. Disciplinary detail about a named person is held. Draft a template and move the allegation out of the tool.",
              },
            ],
          },
          {
            id: "exit-themes",
            situation:
              "Martin Cole, head of people at Brightwater Leisure, needs exit interview themes for Tuesday's board meeting. A colleague offers him the raw spreadsheet of exit interviews, which includes names, sites, managers, and free-text comments. Martin wants to use the AI tool to produce the themes.",
            question: "What should Martin do first?",
            options: [
              {
                id: "a",
                text: "Paste the spreadsheet and ask the model to remove the names before it writes the summary.",
                feedback:
                  "Asking the model to remove names happens after the names have already gone into the tool. The raw spreadsheet is held material. Have the themes prepared and stripped first, and then run the summary pattern.",
              },
              {
                id: "b",
                text: "Paste the spreadsheet and ask which managers are causing people to leave.",
                feedback:
                  "That puts identifiable comments into the tool and asks for a judgement about named managers, which a person decides. Neither part is safe to draft. Prepare the themes first and use a summary pattern with a limit and an owner.",
              },
              {
                id: "c",
                text: "Paste only the free-text comments, because they do not have names in them.",
                feedback:
                  "Free-text comments often name managers, sites, and events that identify the person who wrote them. Removing the name column does not release them. Have the themes prepared and stripped first.",
              },
              {
                id: "d",
                text: "Ask his colleague to turn the comments into themes with names, sites, managers, and small teams removed, and then run the summary pattern with a limit and an owner.",
                correct: true,
                feedback:
                  "That holds. The prepared themes are a source that can go in, and the summary pattern keeps the draft to what is in the list. The owner reads it against the themes before it reaches the board.",
              },
            ],
          },
          {
            id: "rerun-owner",
            situation:
              "Last month, Sinead Moyo at Harrowgate Print wrote a rewrite pattern that turned the lateness policy into a guide for team leaders. The policy has since been updated, and a colleague has rerun the pattern with the new text. He wants to send the guide straight to forty team leaders, because the pattern already has a limit.",
            question: "What should happen before the guide goes out?",
            options: [
              {
                id: "a",
                text: "The owner named in the pattern reads the new guide against the updated policy, one sentence at a time.",
                correct: true,
                feedback:
                  "That holds. A limit reduces what the model invents, but it does not replace the owner. The updated policy may be silent in new places, and only a person reading the guide against it will find a sentence that adds a policy we did not give it.",
              },
              {
                id: "b",
                text: "Nothing, because the limit stops the model from adding anything that is not in the source.",
                feedback:
                  "A limit narrows what the model adds, but it is an instruction, not a guarantee. The pattern names an owner for this reason. The owner reads the new guide against the updated policy before it goes out.",
              },
              {
                id: "c",
                text: "Ask the model to check its own guide against the policy and confirm that nothing was added.",
                feedback:
                  "The model checking its own work is still the model. It can confirm a sentence it invented. The owner named in the pattern reads the guide against the policy.",
              },
              {
                id: "d",
                text: "Add 'Be accurate' to the brief and rerun it before sending.",
                feedback:
                  "Asking for accuracy does not say what must not be added, and rerunning does not tell you what the new draft contains. The owner still has to read the guide against the updated policy before it goes to forty team leaders.",
              },
            ],
          },
        ],
        why: "You applied the whole method to situations you had not seen before. You kept decisions about people with a person, read drafts against their source, chose briefs with all four parts, held what must never go into the tool, repaired prompts without losing the task, and kept an owner between the draft and its readers.",
      },
      bridge:
        "You have now used every move in the course on new situations. In the last lesson you will write three patterns and a hold list for your own work, and that is what your record will show.",
    },
    {
      id: "the-hold-list",
      title: "The hold list",
      emphasis: "hold",
      place:
        "This is the last lesson. You will write the three patterns and the hold list you will use at work, and sign them. They are the work your record will show.",
      sections: [
        {
          heading: "Two halves that work together",
          paragraphs: [
            "The artefact has two halves. The three patterns say what you will use the tool for: a rewrite, a summary, and a template, each written with a source, a reader, a limit, and an owner, and each taken from a task that really came up in your own week. The hold list says what will never go in.",
            "Each line of the hold list has three parts. It names a kind of information, it says why that information is held in the terms of the fourth lesson, and it says what you will do instead when a task seems to need it. A line without the third part is a rule you will break the first time a manager is in a hurry, because it leaves you with no other way to get the work done.",
          ],
        },
        {
          heading: "Write about your own desk",
          paragraphs: [
            "A hold list is not a copy of the three groups from the lesson. It is written about the information that actually crosses your desk. An adviser who handles occupational health referrals writes a line about referral forms, and one who handles payroll queries writes a line about pay slips. An office manager who keeps the right to work checks writes a line about passport scans.",
            "Write each line as an instruction to yourself that starts with never or do not, so that a colleague reading it can see the rule at once. For example: 'Never paste occupational health referral forms, because they contain health data about a named worker. Instead I write the referral myself from the blank form.'",
            "Do not put any real person's name, email address, telephone number, or National Insurance number into the artefact, and do not describe it as proof that you or your organisation comply with any law. The record shows your work exactly as you write it, and a verifier will read it.",
          ],
        },
        {
          heading: "How the artefact is checked",
          paragraphs: [
            "When you continue, each part is checked in turn. The task and source for each pattern has to name approved text, prepared material, or a blank template. The reader and owner has to name both by role. The limit has to start with do not, must not, never, or only, and name the kind of fact the draft must not add, such as a number, a date, an entitlement, a rate of pay, or a judgement about a person.",
            "The first hold line has to name special category information, such as health or religious belief. The second has to name grievance, disciplinary, investigation, pay, or identity information. The further lines have to add at least three more of your own, each with what you do instead. If a part is missing, the note names it and says what to add, and when every part is present you can sign your name against the work.",
          ],
        },
      ],
      workedExample: {
        title: "An artefact from a manufacturing company",
        inputLabel: "The adviser's first pattern and two hold lines",
        outputLabel: "What the rewrite pattern produced on Monday",
        prompt:
          "Rewrite pattern, task and source: turn the approved shift swap policy into a guide for new team leaders, using the policy text only.\nReader and owner: the reader is a new team leader; the owner is the HR adviser, who reads the guide against the policy before it is sent.\nLimit: do not add any pay rate, notice period, or approval step that is not in the policy; where the policy is silent, write 'Check with HR'.\nHold line: Never paste occupational health referral forms, because they contain health data about a named worker. Instead I write the referral myself from the blank form.\nHold line: Never paste screenshots from the HR system, because they show names, pay, and absence together. Instead I copy only the policy text I need.",
        output:
          "Swapping a shift. Two team members can swap a shift when both agree and their team leader approves the swap on the rota before the shift starts.\n\nPay for a swapped shift. Check with HR.\n\nRecording the swap. The team leader updates the rota and keeps the written agreement with it.",
        reading: [
          "Every pattern comes from a real task, and every limit names the kind of fact that pattern is likely to invent. The shift swap policy says nothing about pay for swapped shifts, so the limit made the gap visible instead of letting the model fill it.",
          "Every hold line has a reason and an alternative. The screenshot line is a good example of writing about your own desk, because it names a habit that crosses all three groups at once and gives a way to do the same work without it.",
          "A colleague could pick this up and use it on Monday without asking the adviser what was meant, which is the test your own artefact has to meet.",
        ],
      },
      practice: {
        intro:
          "Before you write the full artefact, draft one hold line in its three parts. The help under each field describes the part, and the three groups of held information are in the fourth lesson if you want to read them again.",
        check: {
          kind: "build",
          prompt: "Write one hold line about information that really crosses your desk.",
          fields: [
            {
              id: "information",
              label: "Information",
              hint: "The kind of information, for example occupational health referral forms or pay slips.",
              min: 8,
              any: [
                "health",
                "medical",
                "sickness",
                "absence",
                "referral",
                "grievance",
                "disciplinary",
                "investigation",
                "pay",
                "bank",
                "passport",
                "identity",
                "right to work",
                "union",
                "religio",
                "belief",
                "ethnic",
                "criminal",
                "conviction",
                "diagnosis",
                "screenshot",
                "record",
                "tribunal",
                "legal",
                "pregnan",
                "disability",
              ],
              missing:
                "Name a kind of held information that crosses your desk, such as health records, grievance notes, or pay slips.",
            },
            {
              id: "why",
              label: "Why it is held",
              hint: "Which group it belongs to, in the terms of the fourth lesson.",
              min: 12,
              any: [
                "because",
                "special category",
                "health",
                "criminal",
                "identif",
                "disciplinary",
                "grievance",
                "investigation",
                "pay",
                "identity",
                "legal",
                "claim",
              ],
              missing:
                "Say why the information is held, for example because it is health data about a named worker or because it is disciplinary detail about an identifiable person.",
            },
            {
              id: "instead",
              label: "What I do instead",
              hint: "What you will do when a task seems to need it, for example drafting from a blank template.",
              min: 12,
              any: [
                "instead",
                "placeholder",
                "blank",
                "template",
                "by hand",
                "myself",
                "policy text",
                "outside the tool",
                "prepared",
                "i write",
                "i copy",
                "i use",
              ],
              missing:
                "Say what you will do instead, for example write it yourself, use a blank template, or copy only the policy text you need.",
            },
          ],
          why: "Your line names the information, says why it is held, and says what you will do instead, so a colleague could follow it without asking.",
        },
      },
      check: {
        kind: "build",
        prompt:
          "Write your three patterns and your hold list for the work you really do. A colleague should be able to use them without asking you what you meant.",
        fields: [
          {
            id: "rewrite-source",
            label: "Rewrite pattern: the task and its source",
            hint: "A rewrite task from your week, and the approved policy text it uses.",
            min: 30,
            any: ["policy", "procedure", "handbook", "guidance", "approved", "template", "prepared"],
            missing:
              "The rewrite pattern does not yet name its source. Say which approved policy text or procedure the model may use, for example the approved hybrid working policy.",
          },
          {
            id: "rewrite-reader-owner",
            label: "Rewrite pattern: the reader and the owner",
            hint: "Who the draft is for, by role, and who reads it against the source before it leaves.",
            min: 20,
            rule: "role",
            any: ["owner", "reads", "checks", "check", "signs off", "approves", "reviews"],
            missing:
              "Name the reader by role and the owner who reads the draft against the source before it leaves, for example 'the owner is the HR adviser, who reads it against the policy'.",
          },
          {
            id: "rewrite-limit",
            label: "Rewrite pattern: the limit",
            hint: "Start with do not, must not, never, or only, and name the kind of fact the draft must not add.",
            min: 20,
            rule: "limit",
            any: ["number", "date", "day", "entitlement", "pay", "rate", "timescale", "judgement", "outcome", "promise", "decision", "amount", "deadline", "notice", "service"],
            missing:
              "The rewrite limit does not yet name what must not be added. Start with do not or never, and name the kind of fact, such as a number of days, a rate of pay, or an entitlement.",
          },
          {
            id: "summary-source",
            label: "Summary pattern: the task and its source",
            hint: "A summary task from your week, and the prepared material with nothing identifying in it.",
            min: 30,
            any: ["prepared", "stripped", "anonymised", "grouped", "themes", "removed", "policy", "approved"],
            missing:
              "The summary pattern does not yet name a prepared source. Say what material it uses and how it has been prepared, for example themes already stripped of names, roles, and dates.",
          },
          {
            id: "summary-reader-owner",
            label: "Summary pattern: the reader and the owner",
            hint: "Who the summary is for, by role, and who reads it against the source before it is sent.",
            min: 20,
            rule: "role",
            any: ["owner", "reads", "checks", "check", "signs off", "approves", "reviews"],
            missing:
              "Name the reader of the summary by role and the owner who reads it against the prepared material before it is sent.",
          },
          {
            id: "summary-limit",
            label: "Summary pattern: the limit",
            hint: "Start with do not, must not, never, or only, and name what the summary must not add or reveal.",
            min: 20,
            rule: "limit",
            any: ["number", "estimate", "name", "team", "judgement", "theme", "figure", "date", "person", "individual", "site", "decision"],
            missing:
              "The summary limit does not yet name what must not be added. Start with do not or only, and name it, for example 'report only themes in the list and do not estimate numbers'.",
          },
          {
            id: "template-source",
            label: "Template pattern: the task and its source",
            hint: "A template task from your week, and the blank template or procedure it uses.",
            min: 30,
            any: ["template", "blank", "placeholder", "policy", "procedure", "approved"],
            missing:
              "The template pattern does not yet name its source. Say which blank template or procedure it uses, and that the personal details go in as placeholders.",
          },
          {
            id: "template-reader-owner",
            label: "Template pattern: the reader and the owner",
            hint: "Who the finished document is for, by role, and who reads it before it is used.",
            min: 20,
            rule: "role",
            any: ["owner", "reads", "checks", "check", "signs off", "approves", "reviews"],
            missing:
              "Name the reader of the template by role and the owner who reads it against the procedure before it is used.",
          },
          {
            id: "template-limit",
            label: "Template pattern: the limit",
            hint: "Start with do not, must not, never, or only, and name what the template must not add.",
            min: 20,
            rule: "limit",
            any: ["name", "date", "number", "pay", "reason", "outcome", "entitlement", "person", "detail", "decision", "promise", "placeholder"],
            missing:
              "The template limit does not yet name what must not be added. Start with do not or only, and name it, for example 'do not add any real name, date, or reason; use placeholders only'.",
          },
          {
            id: "hold-special",
            label: "Hold line: special category information",
            hint: "Never paste this kind of information, because of which group it belongs to, and what you do instead.",
            min: 60,
            rule: "limit",
            any: [
              "health",
              "medical",
              "sickness",
              "diagnosis",
              "religio",
              "belief",
              "union",
              "ethnic",
              "race",
              "sexual",
              "orientation",
              "biometric",
              "genetic",
              "political",
              "disability",
              "pregnan",
              "special category",
            ],
            missing:
              "The first hold line does not yet name special category information. Write it as an instruction that starts with never or do not, name a kind such as health or religious belief, say why it is held, and say what you do instead.",
          },
          {
            id: "hold-case",
            label: "Hold line: case, pay, or identity information",
            hint: "Never paste this kind of information, because of the harm it causes, and what you do instead.",
            min: 60,
            rule: "limit",
            any: [
              "grievance",
              "disciplinary",
              "investigation",
              "pay",
              "bank",
              "passport",
              "identity",
              "right to work",
              "warning",
              "tribunal",
              "legal",
              "claim",
            ],
            missing:
              "The second hold line does not yet name case, pay, or identity information. Write it as an instruction that starts with never or do not, name a kind such as grievance notes or pay slips, say why it is held, and say what you do instead.",
          },
          {
            id: "hold-more",
            label: "Hold list: further lines from my own desk",
            hint: "At least three more lines, one per line, each naming the information, why it is held, and what you do instead.",
            min: 150,
            rule: "limit",
            any: ["instead"],
            missing:
              "Add at least three more hold lines from your own desk. Write each as an instruction that starts with never or do not, say why the information is held, and say what you do instead.",
          },
        ],
        why: "Your artefact has three patterns, each with a source, a reader, an owner, and a limit that names what must not be added, and a hold list that names special category information, case and pay information, and the information that crosses your own desk, with what you do instead. A colleague could use it on Monday without asking you what you meant.",
      },
      bridge:
        "Your patterns and your hold list are ready. Sign your name below, and the record will show them, the course, and the date to anyone who opens the reference.",
    },
  ],
};
