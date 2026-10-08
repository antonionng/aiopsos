/*
Course:   Redesigning Workplace Learning
Slug:     redesigning-workplace-learning
For:      Learning and development practitioners, HR business partners with a learning brief, and
          managers who own a programme their team is expected to complete. They own or influence one
          real programme and can describe what people currently do in it. No instructional design
          qualification is assumed.
Outcome:  The learner takes one real programme and redesigns it so that it starts from a skill written
          as observable work, puts the learner inside a realistic task that uses that skill, and ends
          with a check that shows whether the person can do it. They can say what they cut and why,
          and what the manager will see afterwards.
Artefact: The redesign sheet: one page for one programme, stating the programme today, the skill, the
          task, the check and its standard, what was cut, moved, or made optional with a reason, the
          manager view, the question for the one-to-one, and the first change and when.
Record sentence: Redesigned one real programme around a skill, a task, and a check, and signed the sheet
          a colleague could build from.
Lessons (id, title, move, interaction, pass rule):
  1. why-people-finish-nothing, Why people finish nothing. Tell content to consume from work the
     learner does. Practice mark, check mark. Pass: every line marked correctly.
  2. skill-task-check, Skill, task, check. Rewrite a vague aim as a skill, a task, and a check.
     Practice build (skill, task, check with keyword rules), check choose. Pass: the rewrite whose
     skill is observable and whose check names what the observer looks for.
  3. a-check-that-tests-the-task, A check that tests the task. Tell a check of the task from a check
     of recall. Practice mark, check mark. Pass: every proposed check marked correctly.
  4. cut-the-library, Cut the library. Remove content the task does not need. Practice mark (Keep or
     move, Cut or make optional), check edit. Pass: the checklist, the equipment and access guide, and
     the first-month plan are still there, at least one item is marked cut, removed, or optional, and
     a reason is given.
  5. what-the-manager-will-see, What the manager will see. Design the manager view. Practice edit
     (task, check state, and a question must appear), check choose. Pass: the view with the task, the
     check, the work, and a question.
  6. course-assessment, Course assessment. The whole method on new situations. Practice choose, check
     scenario of seven questions. Pass: six of seven.
  7. redesign-one-programme, Redesign one programme. Write the redesign sheet. Build with a rule or a
     keyword list on every field. Pass: every field present and carrying its part.
Sources:  Baldwin and Ford, "Transfer of training: a review and directions for future research",
          Personnel Psychology, 1988. Cathy Moore, Map It, 2017, for action mapping. Brown, Roediger,
          and McDaniel, Make It Stick, 2014, for retrieval practice. Will Thalheimer, the
          Learning-Transfer Evaluation Model (LTEM), 2018. CIPD factsheets on learning and development
          strategy and on evaluating learning and development.
Tested on phone:          no
Tested returning learner: no
Pass rule tests written:  yes
*/

import type { CourseContent } from "./types.ts";

const CONTENT = "Describes content to consume";
const WORK = "Describes work the learner does";
const TASK = "Checks the task";
const RECALL = "Checks recall";
const KEEP = "Keep or move";
const CUT = "Cut or make optional";

export const COURSE: CourseContent = {
  slug: "redesigning-workplace-learning",
  hours: 2.5,
  artefact: {
    lessonId: "redesign-one-programme",
    title: "The redesign sheet",
    recordLine:
      "Redesigned one real programme around a skill, a task, and a check, and signed the sheet a colleague could build from.",
  },
  lessons: [
    {
      id: "why-people-finish-nothing",
      title: "Why people finish nothing",
      emphasis: "nothing",
      place:
        "This is the first of seven lessons. It names the problem the course solves before it offers a way to solve it, and it gives you the two labels you will use to read any programme description.",
      sections: [
        {
          heading: "A library is not a programme",
          paragraphs: [
            "Many workplace programmes are built as libraries. Someone collects the modules, videos, slide decks, and documents that seem relevant to a subject, arranges them in a sensible order, and asks people to work through them by a date. The induction has a history video and a product guide. The management series has webinars and a reading list. The system training has a recorded demonstration and a user manual.",
            "Each item may be well made. The trouble is the shape of the whole. A library tells people what to read, watch, or listen to, and it stops there. It does not say what they will do differently at work, it gives them nothing to produce while they are inside it, and it has no way to show at the end whether anything changed.",
          ],
        },
        {
          heading: "Content to consume and work the learner does",
          paragraphs: [
            "This course reads every line of a programme with two labels. A line Describes content to consume when it names something the programme gives the learner to take in: a video to watch, a chapter to read, a webinar to attend, a library to browse. The learner receives something, and nothing is produced. A quiz that asks people to recall facts from the deck they have just read also describes content to consume, because it checks whether the content went in and asks for no work.",
            "A line Describes work the learner does when it names something the learner produces, decides, or practises. Writing a reply to a real complaint, delegating one task from their own list, running a one-to-one with an agenda they drafted, or approving ten real expense claims are all work the learner does. The test is simple. Ask what the learner has in their hands, or has done, when the line is finished. If the answer is nothing except the memory of having read it, the line describes content to consume.",
            "These labels are not a judgement on quality. A beautifully filmed video is still content to consume, and a scrappy exercise on last week's real tickets is still work the learner does. The labels describe what the line asks of the person, and that is the thing that decides whether the programme can change the work.",
          ],
        },
        {
          heading: "Why a library produces nothing to show",
          paragraphs: [
            "When a programme is all content, people have no reason to finish it other than the deadline, and they know it. They open the module, let the video play, click through the deck, and guess the quiz until it passes. The completion report then says the programme was a success, while the team leader sees the same complaints handled in the same way as before.",
            "Research on the transfer of training has pointed at this for a long time. The review by Timothy Baldwin and Kevin Ford in Personnel Psychology in 1988 identified the design of the training and the work environment around it as factors in whether what people learn is used on the job. A library leaves both to chance. It gives the learner no practice in the real task, and it gives the workplace nothing to notice or support afterwards.",
          ],
        },
        {
          heading: "The mistake people usually make",
          paragraphs: [
            "The usual response to a programme that is not working is to add to the library. A new module on the problem area, a better video, a longer reading list, or a refresher quiz. Each addition is content to consume, so the programme grows while the work stays the same, and people are now less likely to finish it than before.",
            "This lesson is not an argument against content. Good content is part of good learning, and people need the complaints policy, the product guide, and the expenses rules. The point is that content should serve a task the learner does, rather than being the programme itself. The rest of this course shows how to build the task first and then decide which content it needs.",
          ],
          beforeAfter: {
            before:
              "Module 5: Handling difficult customers. A twenty-minute video with tips from experienced advisers, followed by a ten-question quiz.",
            after:
              "Module 5: Reply to two real complaints from last month, with names removed, using the complaints policy. Your team leader reads both replies with you on Friday.",
            reading:
              "The first version describes content to consume, including the quiz. The second describes work the learner does, and the policy becomes the content they need in order to do it.",
          },
        },
      ],
      workedExample: {
        title: "An induction read with the two labels",
        inputLabel: "The programme as described",
        outputLabel: "The redesigned description",
        prompt:
          "Induction for new customer service advisers, Marlow Energy.\nModule 1: Our history and values, a twelve-minute video.\nModule 2: Product overview, a thirty-page guide.\nModule 3: The complaints policy, a slide deck.\nModule 4: A quiz of twenty questions on modules 1 to 3.",
        output:
          "Induction for new customer service advisers, Marlow Energy.\nHandle three real complaints from last month, with names removed, using the complaints policy. For each one, write the reply you would send and decide whether to escalate it. Your team leader reviews the three replies with you before your first live shift.",
        reading: [
          "Read with the two labels, all four modules in the original describe content to consume. The video, the guide, and the deck give the new adviser something to take in, and the quiz only checks whether some of it was remembered.",
          "Nothing in the original asks the adviser to do the thing they will do on their first day, which is to answer a customer who is unhappy. A new starter could pass every module and still freeze on the first call.",
          "The redesigned description names work the learner does: three replies and three escalation decisions, reviewed by the person who will manage them. The complaints policy has not disappeared. It is now the document the adviser opens in order to do the task, which is the job content should have in a programme.",
        ],
      },
      practice: {
        intro:
          "Here is part of a system training programme for a new finance system at Harrow Build. Mark each line with the two labels from this lesson. The definitions are in the section above if you want to read them again.",
        check: {
          kind: "mark",
          prompt: "Mark each line of the programme as content to consume or work the learner does.",
          material: {
            label: "The programme",
            text: "Finance system training for purchase ledger clerks, Harrow Build.",
          },
          passLabel: WORK,
          failLabel: CONTENT,
          sentences: [
            {
              id: "demo",
              text: "Watch the recorded demonstration of the new invoice screen.",
              fail: true,
              why: "The clerk watches and produces nothing, so this describes content to consume.",
            },
            {
              id: "invoices",
              text: "Enter five real supplier invoices from last week into the test system and match each one to its purchase order.",
              fail: false,
              why: "The clerk enters and matches real invoices, so this describes work the learner does.",
            },
            {
              id: "manual",
              text: "Read sections 2 to 4 of the user manual.",
              fail: true,
              why: "Reading the manual is taking in content. Nothing is produced, so this describes content to consume.",
            },
          ],
          why: "That is right. The demonstration and the manual give the clerk content, and entering five real invoices is the work they will do on Monday.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "Here is the outline of a management development programme at Fellbrook Care. Mark each line as content to consume or work the learner does.",
        material: {
          label: "The programme",
          text: "First-line manager programme, Fellbrook Care, six weeks.",
        },
        passLabel: WORK,
        failLabel: CONTENT,
        sentences: [
          {
            id: "webinar",
            text: "Watch a webinar on the principles of effective delegation.",
            fail: true,
            why: "The manager watches, but does not delegate anything. This describes content to consume.",
          },
          {
            id: "delegate",
            text: "Delegate one real task from your own list this week and write down what you handed over and what you kept.",
            fail: false,
            why: "This asks the manager to delegate a real task and write about it. That is work the learner does.",
          },
          {
            id: "chapter",
            text: "Read the chapter on situational leadership.",
            fail: true,
            why: "Reading is how the manager takes in content. Nothing is produced, so this describes content to consume.",
          },
          {
            id: "one-to-one",
            text: "Run a one-to-one with a team member using the agenda you drafted in session two, then note what you would change.",
            fail: false,
            why: "Running a one-to-one is the work itself, and the note is something the manager produces. This describes work the learner does.",
          },
          {
            id: "browse",
            text: "Browse the leadership library for further resources.",
            fail: true,
            why: "Browsing produces nothing and changes nothing at work. It is the pattern this lesson warns about, and it describes content to consume.",
          },
        ],
        why: "You separated what the programme gives people to read and watch from what it asks them to do. The delegated task and the one-to-one are the two lines a manager at Fellbrook Care could see in the work the following week.",
      },
      bridge:
        "The next lesson gives you the three parts a programme needs if it is going to describe work: a skill, a task, and a check.",
    },
    {
      id: "skill-task-check",
      title: "Skill, task, check",
      emphasis: "check",
      place:
        "You can now see when a programme is only content. This lesson gives you the structure that replaces the library, and every later lesson builds on it.",
      sections: [
        {
          heading: "Three parts, each depending on the one before",
          paragraphs: [
            "A redesigned programme is built from three parts: a skill, a task, and a check. They are written in that order, because each one depends on the one before. The skill says what the person will be able to do. The task gives them a realistic piece of work in which to do it. The check shows whether they did it to the standard the skill describes.",
            "When the three parts line up, the content the programme needs becomes obvious. It is whatever the person must know or look up to complete the task. Cathy Moore's action mapping, set out in her book Map It, starts from the same place: decide what people need to do before deciding what they need to know. The rest of the old library is then a question of what to cut, which is the subject of the fourth lesson.",
          ],
        },
        {
          heading: "A skill is work someone else could see",
          paragraphs: [
            "A skill is something a person can do at work that someone else could watch or read. Write it with an action verb and a setting, such as 'give a customer a delay update that states the new date, the reason, and what happens next'. A colleague could read that update and say whether it was done.",
            "A skill is not a topic, such as 'customer communication' or 'the expenses policy'. It is not a quality, such as 'confidence' or 'resilience'. It is also not a state of mind, which is why aims beginning with understand, know, be aware of, or appreciate cannot be skills. Nobody can see understanding. They can only see what a person does with it.",
          ],
          beforeAfter: {
            before: "Improve understanding of the expenses policy.",
            after: "Approve or reject an expense claim correctly under the policy and give the reason.",
            reading:
              "The first version names a state of mind that no one can observe. The second names a decision the finance team makes every week, and anyone who knows the policy can say whether it was right.",
          },
        },
        {
          heading: "A task is real work, and a check is evidence",
          paragraphs: [
            "A task is a realistic piece of work in which the person uses the skill. Take it from the real work wherever you can: last week's inbox, last quarter's claims, the rota for next month, a case from the person's own team with details changed. A task such as 'reply to three delay enquiries from last week's inbox' is better than an invented case, because the learner recognises it and because the result is useful.",
            "A check is the evidence that the person did the task to the standard the skill describes. It names who or what judges the result and what they look for, such as 'the team leader confirms that each reply states the date, the reason, and the next step'. A check is not a rating of how confident people feel, and it is not a tick to say they attended.",
          ],
        },
        {
          heading: "The mistake people usually make",
          paragraphs: [
            "The usual mistake is to write the skill as the name of the programme. 'Skill: difficult conversations' is a title, and once the skill is a title, the task becomes 'attend the workshop' and the check becomes 'rate the workshop'. All three parts are then content to consume dressed in new headings.",
            "The fix is to keep asking what the skill looks like at the moment someone does it, until the answer describes work. For a difficult conversation, the answer might be 'state the facts and ask for the team member's view before offering a solution'. That is a skill someone could see, and the task and the check follow from it.",
          ],
        },
      ],
      workedExample: {
        title: "An aim rewritten for a finance team",
        inputLabel: "The learning aim as written",
        outputLabel: "The skill, task, and check",
        prompt:
          "Learning aim for the finance operations team at Carrow Foods: improve understanding of the expenses policy.",
        output:
          "Skill: approve or reject an expense claim correctly under the policy and give the reason.\nTask: review ten real claims from last quarter, with names removed, and decide each one.\nCheck: at least nine of the ten decisions match the finance manager's decisions, and every rejection cites the policy clause.",
        reading: [
          "The original aim could never be checked, because understanding is not visible. Anyone reporting on it would have to fall back on attendance or a quiz, and neither says whether claims are now decided correctly.",
          "The skill begins with two action verbs, approve and reject, and names the setting, which is an expense claim under the policy. It also names the part people most often skip, which is giving the reason.",
          "The task uses real claims from last quarter, so the team works on the cases they will actually see. The check names who judges, the finance manager, and what they look for, a nine in ten match and a clause for every rejection. The person who already knows the right answers can run it in half an hour.",
        ],
      },
      practice: {
        intro:
          "Write the skill, task, and check for one aim from a programme you own or influence. The help under each part repeats the standard from the sections above, and the finance example is there to compare with.",
        check: {
          kind: "build",
          prompt:
            "Take one aim from your own programme and write it as a skill, a task, and a check that someone else could run.",
          fields: [
            {
              id: "skill",
              label: "Skill",
              hint: "Start with an action verb and name a setting, such as approve, reply, write, run, give, or decide.",
              min: 20,
              any: [
                "approve",
                "reject",
                "reply",
                "write",
                "run ",
                "give",
                "decide",
                "handle",
                "answer",
                "review",
                "prepare",
                "draft",
                "record",
                "complete",
                "plan",
                "lift",
                "enter",
                "set up",
                "explain",
                "open",
                "agree",
                "brief",
                "chair",
                "calculate",
                "respond",
                "carry out",
              ],
              missing:
                "The skill does not yet start from an action. Write it as something a person does that someone else could see, beginning with a verb such as approve, reply, write, run, or decide.",
            },
            {
              id: "task",
              label: "Task",
              hint: "Real work in which the person uses the skill, taken from the job wherever possible.",
              min: 20,
              any: ["real", "last week", "last month", "last quarter", "own team", "live", "from your", "from their", "actual", "case"],
              missing:
                "The task does not yet say it uses real work. Say where the work comes from, such as real cases from last month or a case from the person's own team.",
            },
            {
              id: "check",
              label: "Check",
              hint: "Who or what judges the result, and what they look for.",
              min: 20,
              any: ["confirm", "observ", "review", "match", "against", "standard", "look for", "sees", "signs off", "checks that"],
              missing:
                "The check does not yet say how someone will see the task done. Name who judges the result and what they look for, for example 'the team leader confirms that each reply states the date'.",
            },
          ],
          why: "Your aim now reads as a skill someone could see, a task that uses real work, and a check that names who judges and what they look for.",
        },
      },
      check: {
        kind: "choose",
        prompt:
          "Both of these rewrite the aim 'Build confidence in difficult conversations' for new line managers at Tenby Logistics. Choose the one that gives a skill, a task, and a check.",
        leftLabel: "Rewrite A",
        left: "Skill: confidence in difficult conversations. Task: attend the workshop and take part in the discussion. Check: participants rate their confidence before and after the workshop.",
        rightLabel: "Rewrite B",
        right:
          "Skill: open a conversation about missed deadlines by stating the facts and asking for the team member's view before offering a solution. Task: run that opening in a role play with a colleague, using a case from your own team with details changed. Check: the observer confirms you stated the facts, asked for their view, and did not offer a solution first.",
        correct: "right",
        why: "Rewrite B names a skill someone could see, a task that uses it on a case from the manager's own team, and a check that says exactly what the observer looks for. You chose the rewrite in which the skill can be seen, the task uses it, and the check says what to look for.",
        wrong:
          "Look again at Rewrite A. It keeps confidence as the skill, which nobody can observe, its task is attending, which is content to consume, and its check measures how people feel rather than what they did. Rewrite B gives a skill, a task, and a check.",
      },
      bridge:
        "The check is the part people most often get wrong, and the next lesson looks at it closely.",
    },
    {
      id: "a-check-that-tests-the-task",
      title: "A check that tests the task",
      emphasis: "task",
      place:
        "You now have the three parts of a redesigned programme. This lesson teaches you to tell a check that tests the task from one that only tests memory, and to write a standard two reviewers would apply the same way.",
      sections: [
        {
          heading: "Two kinds of check",
          paragraphs: [
            "A check Checks the task when it asks the person to do the work the skill describes, or something very close to it, and judges the result against a standard. Writing the reply to a real complaint and deciding whether to escalate it checks the task. So does lifting a box from floor to shelf while a supervisor watches against the five steps of a safe lift.",
            "A check Checks recall when it asks the person to remember a fact, a definition, a name, or the order of some steps, without doing the work. Choosing the correct escalation route from four options, listing the steps of a safe lift, and answering questions about a regulation all check recall. The person may get every answer right and still be unable to do the task on the day.",
          ],
        },
        {
          heading: "Recall has a place, but it is not the check",
          paragraphs: [
            "Recall matters. Someone who cannot remember the escalation route will struggle to escalate, and the research summarised in Make It Stick by Peter Brown, Henry Roediger, and Mark McDaniel shows that being asked to retrieve material from memory helps people keep it. Short recall questions inside a programme are a sensible way to help people learn.",
            "The problem comes when a recall question is the only check. It cannot show that the person can apply the fact to a real case, so a programme whose only check is a recall quiz will report success while the work stays the same. Will Thalheimer's Learning-Transfer Evaluation Model makes the same distinction between knowing something and performing it in a realistic setting, and treats them as different levels of evidence.",
          ],
        },
        {
          heading: "A standard another person could apply",
          paragraphs: [
            "A good check also has a standard that another person could apply. If two team leaders read the same reply, they should reach the same verdict, because the check says what they look for: the reply is courteous, it states what happens next, and the escalation goes to the right person. A check that says only 'the reply is good' leaves each reviewer to invent a standard.",
            "A check is not a satisfaction survey and not a completion tick. A survey tells you how people felt about the programme, and a tick tells you they reached the end. Neither says whether the task was done, so neither can stand as the check, however useful they are for other purposes.",
          ],
          beforeAfter: {
            before: "Check: the adviser's reply is of a good standard.",
            after:
              "Check: the team leader confirms that the reply acknowledges the problem, states what happens next and by when, and escalates any refund over £500 to the complaints manager.",
            reading:
              "The first version leaves each reviewer to decide what good means. The second names three things any reviewer can look for, so two team leaders would reach the same verdict.",
          },
        },
        {
          heading: "The mistake people usually make",
          paragraphs: [
            "The usual mistake is to keep the old quiz and call it the check, because it is already built and it produces a score. The score feels like evidence, and the report looks tidy, but it measures memory of the deck rather than the work the skill describes.",
            "The second mistake is a check of the task with no standard, such as 'the manager observes a one-to-one'. The task is right, but without a standard the observation becomes a friendly chat. Add the two or three things the observer looks for, and the check becomes evidence.",
          ],
        },
      ],
      workedExample: {
        title: "Two checks for the same induction",
        inputLabel: "The two proposed checks",
        outputLabel: "How each one reads",
        prompt:
          "Check 1: Which of these is the correct escalation route for a complaint over £500? A, B, C, or D.\nCheck 2: Here is a complaint about a £650 refund. Write your reply and say whether you would escalate it, and to whom.",
        output:
          "Check 1 checks recall. The adviser chooses a remembered route and writes nothing.\nCheck 2 checks the task. The adviser writes the reply and makes the escalation decision in a realistic case. Standard: the reply is courteous, it states what happens next, and the escalation goes to the complaints manager.",
        reading: [
          "Both checks come from the Marlow Energy induction in the first lesson. The first asks the adviser to pick one of four routes. Someone who has memorised the deck will pass, and someone who has not may guess correctly. Either way, the check says nothing about whether they can handle a real complaint.",
          "The second asks the adviser to do the work: read a complaint, write a reply, and decide on escalation. It is very close to the first live shift, which is the point.",
          "The second check can still be marked consistently, because it carries a standard with three parts. A team leader can read the reply and say yes or not yet on each part, and a second team leader would reach the same answer.",
        ],
      },
      practice: {
        intro:
          "Here are three checks proposed for a new starter programme in a GP surgery's reception team. Mark each one with the labels from this lesson. The two definitions are in the first section above.",
        check: {
          kind: "mark",
          prompt: "Mark each proposed check as checking the task or checking recall.",
          material: {
            label: "The skill",
            text: "Book a patient into the right appointment type over the phone, following the surgery's triage prompts.",
          },
          passLabel: TASK,
          failLabel: RECALL,
          sentences: [
            {
              id: "types",
              text: "Name the six appointment types the surgery offers.",
              fail: true,
              why: "Naming the types shows the receptionist remembers them. No patient is booked, so this checks recall.",
            },
            {
              id: "calls",
              text: "Take three role-played calls using real requests from last week, and book each into the system while the practice manager listens against the triage prompts.",
              fail: false,
              why: "The receptionist does the booking and the practice manager applies the triage prompts as the standard, so this checks the task.",
            },
            {
              id: "prompt",
              text: "Write down which triage prompt applies when a patient asks for a repeat prescription.",
              fail: true,
              why: "Writing down the right prompt shows the receptionist remembers it. No call is taken and no patient is booked, so this checks recall.",
            },
          ],
          why: "That is right. Only the role-played calls ask the receptionist to book patients against a standard. Naming the types and writing down a prompt both test memory.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "These are proposed checks for a programme on safe lifting at Ridgeway Distribution's Daventry warehouse. Mark each as checking the task or checking recall.",
        material: {
          label: "The skill",
          text: "Move loads between floor, shelf, and pallet safely, following the site's five steps of a safe lift.",
        },
        passLabel: TASK,
        failLabel: RECALL,
        sentences: [
          {
            id: "list",
            text: "List the five steps of a safe lift in the right order.",
            fail: true,
            why: "The person writes a list and lifts nothing. Listing the steps shows they remember them, not that they can lift safely, so this checks recall.",
          },
          {
            id: "observed",
            text: "Lift a boxed item from floor to shelf while the supervisor observes against the five steps.",
            fail: false,
            why: "The person does the lift and the supervisor applies a clear standard, so this checks the task.",
          },
          {
            id: "regs",
            text: "Answer ten multiple-choice questions on manual handling regulations.",
            fail: true,
            why: "No lifting happens in a question. Questions about regulations check what the person remembers, so this checks recall.",
          },
          {
            id: "bay",
            text: "Walk the supervisor through how you would move an awkward load in bay four, then move it.",
            fail: false,
            why: "The person plans and then carries out a real move in the real setting, so this checks the task.",
          },
          {
            id: "report",
            text: "Write down the name of the person you report an injury to.",
            fail: true,
            why: "Knowing who to tell matters, but writing a remembered name shows memory, not a safe lift. This checks recall.",
          },
        ],
        why: "You kept the checks where the person does the lift against the five steps, and you set aside the checks that only test memory. The observed lift and the move in bay four are the two a supervisor could sign with confidence.",
      },
      bridge:
        "Once the task and the check are set, much of the old programme no longer has a job, and the next lesson cuts it.",
    },
    {
      id: "cut-the-library",
      title: "Cut the library",
      emphasis: "Cut",
      place:
        "You have a skill, a task, and a check. This lesson asks you to go back through the old programme and remove, move, or make optional everything the task does not need.",
      sections: [
        {
          heading: "Content earns its place through the task",
          paragraphs: [
            "A piece of content earns its place in a redesigned programme only if the learner needs it to complete the task or to pass the check. That is the whole test. It is not whether the content is accurate, well made, or popular, and it is not whether someone senior asked for it to be included.",
            "Go through the old programme one item at a time with the task beside you. For each item, ask what the learner would be unable to do in the task without it. If there is a clear answer, the item stays. If the honest answer is that they could do the task perfectly well without it, the item is a candidate to cut, move, or make optional.",
          ],
        },
        {
          heading: "Four decisions for every item",
          paragraphs: [
            "Keep means the item stays in the programme because the task uses it directly, such as the complaints policy open beside the complaints task. Move means the item is still needed, but as reference rather than as a module, so it goes where people will find it at the moment they need it, such as a product guide linked from the task. Make optional means the item stays available for people who want more, but it is no longer part of completion. Cut means the item is removed from the programme altogether.",
            "For quick sorting, this lesson groups the four decisions under two labels. Keep or move covers items the task needs, whether as part of the programme or as a reference link. Cut or make optional covers items the task does not need, whether you remove them or leave them available outside completion. Once an item is in the right group, you decide which of the two it is.",
          ],
        },
        {
          heading: "Cutting is not saying the content is bad",
          paragraphs: [
            "Cutting an item from a programme is not a verdict that nobody should read it. The history of the company may be a fine video, and people may enjoy it, but a new adviser does not need it to answer a complaint on day one. It can live on the intranet, and those who want it will find it.",
            "Cutting is often the hardest part politically, because every module has an owner who worked on it. The redesign sheet therefore records what was cut, moved, or made optional, with one sentence for each that refers to the task. A reason such as 'cut, because the task does not use company history' is easier to defend than a matter of taste, and it gives the owner something to argue with other than you.",
          ],
          beforeAfter: {
            before: "Removed the values video, as it felt dated and people skip it.",
            after:
              "Made the values video optional, because the complaints task does not need it. The one paragraph on tone moves into the task instructions, because tone shapes every reply.",
            reading:
              "The first reason is a matter of taste that the video's owner can dispute. The second ties the decision to the task, and it keeps the one part of the video the task does use.",
          },
        },
        {
          heading: "The mistake people usually make",
          paragraphs: [
            "The usual mistake is to keep everything and add the new task on top, so the programme now has the library and the task. Completion takes longer, the task is buried at the end, and people treat it as one more module to click through.",
            "The opposite mistake is to cut something the task quietly depends on, such as the guide to booking equipment that a first-month plan needs. Read each cut against the task one more time before you record it. If the task would stall without the item, it belongs under Keep or move.",
          ],
        },
      ],
      workedExample: {
        title: "The induction after the task is set",
        inputLabel: "The old module list",
        outputLabel: "The decision on each module",
        prompt:
          "Task: handle three real complaints using the complaints policy, reviewed by the team leader.\nModule 1: Our history and values, a twelve-minute video.\nModule 2: Product overview, a thirty-page guide.\nModule 3: The complaints policy, a slide deck.\nModule 4: A quiz of twenty questions.",
        output:
          "Module 1: made optional, because the task does not need company history. One paragraph on tone moves into the task instructions, because tone shapes every reply.\nModule 2: moved to a reference page linked from the task, because advisers look up products while replying.\nModule 3: cut and replaced by the policy itself, open beside the task, because the deck summarised a document the adviser can now use directly.\nModule 4: cut, because the check now tests the task.",
        reading: [
          "The designer at Marlow Energy went through the old modules with the task beside them. Every decision has a one-sentence reason, and every reason refers to the task or the check.",
          "Nothing useful was lost. The values survive as a paragraph on tone where it affects the work, and the product guide survives as a reference link where it is actually opened. The policy is still there, in a more useful form.",
          "The programme is now one task and two documents. A new adviser can finish it in a morning, and the team leader sees three real replies at the end rather than a quiz score.",
        ],
      },
      practice: {
        intro:
          "The task in this programme is for claims handlers at Tamar Insurance: assess five real home insurance claims from last month and decide whether each is covered under the policy wording. Mark each old item with the two labels from this lesson. The four decisions are described in the section above.",
        check: {
          kind: "mark",
          prompt: "Mark each item of the old programme as Keep or move, or as Cut or make optional, judged against the task.",
          material: {
            label: "The task",
            text: "Assess five real home insurance claims from last month and decide whether each is covered under the policy wording.",
          },
          passLabel: KEEP,
          failLabel: CUT,
          sentences: [
            {
              id: "wording",
              text: "The home insurance policy wording.",
              fail: false,
              why: "The handler cannot decide cover without the policy wording, so it belongs under Keep or move.",
            },
            {
              id: "awards",
              text: "A video about the company's customer service awards.",
              fail: true,
              why: "The awards do not help anyone decide whether a claim is covered, so this belongs under Cut or make optional.",
            },
            {
              id: "exclusions",
              text: "A one-page guide to the common exclusions, such as wear and tear.",
              fail: false,
              why: "Exclusions decide many claims, so the handler needs this guide open while they work. It belongs under Keep or move.",
            },
            {
              id: "history-quiz",
              text: "A quiz on the history of the insurance market.",
              fail: true,
              why: "The history of the market does not decide cover, and the quiz tests recall. It belongs under Cut or make optional.",
            },
          ],
          why: "That is right. The policy wording and the exclusions guide are what the handler opens to decide each claim, and the awards video and the history quiz do nothing for the task.",
        },
      },
      check: {
        kind: "edit",
        prompt:
          "The task in this programme at Pennine Housing is: write a first-month plan for a new starter in your team, using the onboarding checklist. Edit the outline so that it keeps only what the task needs. Mark each item you remove as cut or optional, and add a one-sentence reason for each change that refers to the task or the plan.",
        label: "The programme outline you are editing",
        start:
          "1. Video: welcome from the chief executive.\n2. The onboarding checklist.\n3. A guide to booking equipment and system access.\n4. Article: the psychology of first impressions.\n5. Quiz: ten questions about company history.\n6. Task: write the first-month plan and review it with your HR business partner.",
        unchanged:
          "You have not changed the outline yet. Decide which items the first-month plan does not need, mark each one as cut or optional, and give a reason that refers to the task.",
        keep: [
          {
            id: "checklist",
            any: ["checklist"],
            missing:
              "Keep the onboarding checklist. The task says to use it, so the plan cannot be written without it.",
          },
          {
            id: "access",
            any: ["equipment", "system access"],
            missing:
              "Keep the guide to equipment and system access, or link it from the task. A first-month plan needs equipment and access dates.",
          },
          {
            id: "plan",
            any: ["first-month plan", "first month plan"],
            missing: "Keep the task itself. Writing the first-month plan is the programme.",
          },
        ],
        limitWording: false,
        limits: [
          {
            id: "cut",
            any: ["cut ", "cut:", "cut.", "cut,", "removed", "remove ", "optional", "dropped"],
            missing:
              "Say what you took out. Mark the history quiz, the chief executive video, and the article as cut or optional, rather than deleting them without a note.",
          },
          {
            id: "reason",
            any: ["because", "as the task", "as the plan", "the task does not", "the plan does not", "not needed for", "not needed to"],
            missing:
              "Give a one-sentence reason for each change that refers to the task, for example 'cut, because the plan does not need company history'.",
          },
        ],
        why: "You kept what the plan needs, which is the checklist, the equipment and access guide, and the task, and you cut or made optional what it does not need, with a reason tied to the task each time.",
        result: {
          label: "An outline that would pass",
          text: "1. The onboarding checklist.\n2. A guide to booking equipment and system access, linked from the task, because the plan needs access dates.\n3. Task: write the first-month plan and review it with your HR business partner.\nCut: the history quiz, because the plan does not need company history. Made optional: the chief executive video and the article, because the task does not use them.",
        },
      },
      bridge:
        "The programme is now lean, and the next lesson decides what the manager will see when someone has finished it.",
    },
    {
      id: "what-the-manager-will-see",
      title: "What the manager will see",
      emphasis: "manager",
      place:
        "The programme now has a skill, a task, a check, and only the content it needs. This lesson designs the view the person's manager receives when they finish, because that view decides whether the task comes back into the job.",
      sections: [
        {
          heading: "Why the manager matters most",
          paragraphs: [
            "A manager is the person most likely to notice whether learning has changed the work, and the person most likely to create or remove the chance to use it. If the manager asks about the task in the next one-to-one, the learner uses the skill again. If the manager never mentions it, the programme ends the day the check is passed.",
            "Most programmes send the manager a completion report, if they send anything at all. That report is designed for the learning team's records, not for the manager's week, so it rarely prompts a conversation. A redesigned programme writes the manager view on purpose, in the words of the task.",
          ],
        },
        {
          heading: "What the view contains",
          paragraphs: [
            "A good manager view has four parts. It names the task the person did, in one line. It says whether the check has been passed or is not yet passed, and if not yet, which part is outstanding. It attaches the work itself where that is appropriate, such as the three replies or the first-month plan. It ends with one question the manager can ask in their next one-to-one, which brings the task back into the job.",
            "The view is short. A manager with eight direct reports should be able to read it in under a minute and know what to say. The question matters most, because it turns a report into a conversation about the work.",
          ],
          beforeAfter: {
            before: "Induction: 100% complete. Quiz score: 18 out of 20.",
            after:
              "Task: handle three real complaints using the complaints policy. Check: passed on all three replies, which are attached. Question for your next one-to-one: which of the three was hardest to reply to, and what would you do differently now?",
            reading:
              "The first version tells the manager the programme is finished and nothing else. The second tells them what was done, lets them read it, and gives them something to ask.",
          },
        },
        {
          heading: "What the view leaves out",
          paragraphs: [
            "The view should not be a completion percentage or a score out of a hundred. A figure like 92 per cent hides which part of the check was not passed, and it gives the manager nothing to talk about. Time spent in the programme is worse, because it rewards the person who left a video running.",
            "The view should not show the person's failed attempts. Attempts are part of learning, and they are for the programme team to use when improving the design. A manager who sees that someone took three tries at the check may judge them on it, which makes people less willing to try.",
          ],
        },
        {
          heading: "The mistake people usually make",
          paragraphs: [
            "The usual mistake is to let the learning system decide what the manager sees. The default report shows percentages, scores, and minutes, because those are easy to count, and the designer never writes a view of their own. Managers learn to ignore it within a month.",
            "The fix takes ten minutes. Write the view for your programme in the words of the task, decide what is attached, and write the one question. Then ask one manager to read it and say what they would do with it.",
          ],
        },
      ],
      workedExample: {
        title: "A view for a team leader",
        inputLabel: "The completion report the team leader used to get",
        outputLabel: "The view the team leader now receives",
        prompt: "Marlow Energy induction. Learner: new adviser. Status: 100% complete. Quiz: 17 out of 20. Time in programme: 2 hours 10 minutes.",
        output:
          "Task: handle three real complaints using the complaints policy.\nCheck: passed on all three replies. The replies are attached.\nQuestion for your next one-to-one: which of the three was hardest to reply to, and what would you do differently now?",
        reading: [
          "The old report told the team leader three numbers. None of them said whether the adviser could handle a complaint, and none suggested anything to talk about.",
          "The new view names the task in the same words the adviser saw. It says the check was passed on all three replies, which is a statement the team leader can test by reading them, because they are attached.",
          "The question brings the task back into the job. It asks the adviser to reflect on the hardest case and say what they would change, which is the conversation most likely to make the skill stick.",
        ],
      },
      practice: {
        intro:
          "Here is the completion report a line manager at Quayside Hotels receives after a new duty manager finishes a redesigned programme on handling guest complaints at reception. Rewrite it as a manager view. The four parts of a good view are in the section above, and the worked example is there to compare with.",
        check: {
          kind: "edit",
          prompt:
            "Rewrite this report so that it names the task, says whether the check was passed, and ends with one question the manager can ask in the next one-to-one.",
          label: "The report you are rewriting",
          start: "Guest complaints module: 100% complete. Quiz average: 17 out of 20. Time spent: 1 hour 45 minutes.",
          unchanged:
            "You have not changed the report yet. Replace the percentage, the score, and the time with the task, the state of the check, and a question for the one-to-one.",
          keep: [],
          limitWording: false,
          limits: [
            {
              id: "task",
              any: ["task"],
              missing: "Name the task the duty manager did, starting with the word Task, in the words the programme used.",
            },
            {
              id: "state",
              any: ["passed", "not yet"],
              missing: "Say whether the check was passed or not yet passed, so the manager knows where things stand.",
            },
            {
              id: "question",
              any: ["?"],
              missing: "End with one question the manager can ask in the next one-to-one, written as a question.",
            },
          ],
          why: "Your view now tells the manager what was done, where the check stands, and what to ask, which is what a percentage and a time never could.",
        },
      },
      check: {
        kind: "choose",
        prompt:
          "A new starter at Pennine Housing has finished the redesigned onboarding programme from the last lesson. Choose the view you would send to their manager.",
        leftLabel: "View A",
        left: "Onboarding: 92% complete. Average quiz score 8 out of 10. Time spent: 3 hours 40 minutes.",
        rightLabel: "View B",
        right:
          "Task: write a first-month plan using the onboarding checklist. Check: passed, reviewed with the HR business partner on Tuesday. The plan is attached. Question for your next one-to-one: which part of the plan has already changed, and why?",
        correct: "right",
        why: "View B names the task, says the check was passed and who reviewed it, attaches the work, and gives the manager a question about it. You chose the view that shows the task, the check, and the work, with a question for the manager.",
        wrong:
          "Look again at View A. It gives a percentage, a score, and a time, and none of them tells the manager what the person can do or which part of the check is missing. It gives them nothing to talk about. View B names the task and the check, attaches the plan, and offers a question.",
      },
      bridge:
        "You have now used every move in the course on its own. The next lesson brings them together on situations you have not seen, before the final lesson asks you to redesign your own programme.",
    },
    {
      id: "course-assessment",
      title: "Course assessment",
      emphasis: "assessment",
      place:
        "This is the sixth of seven lessons. It brings together the method from the first five lessons, works one mixed example, and then assesses the whole method on situations you have not seen, before the final lesson asks you to write your redesign sheet.",
      sections: [
        {
          heading: "From a library to work",
          paragraphs: [
            "A programme built as a library describes content to consume: videos to watch, documents to read, webinars to attend, and quizzes that check whether the content went in. A programme built for work describes work the learner does: something they produce, decide, or practise while they are in it. When a programme is all content, people finish it only because of the deadline, and the programme has no way to show that anything changed.",
            "The redesign starts from three parts, written in order. The skill is something a person does at work that someone else could see, written with an action verb and a setting. The task is a realistic piece of work in which the person uses the skill, taken from the real work wherever possible. The check is the evidence that the task was done to the standard the skill describes, and it names who judges and what they look for.",
          ],
        },
        {
          heading: "Checks, cuts, and the manager view",
          paragraphs: [
            "A check tests the task when the person does the work and someone applies a standard another reviewer would apply the same way. A check tests recall when it asks the person to remember a fact, a route, or a list. Recall helps people learn, but it cannot be the only check, and neither can a satisfaction survey or a completion tick.",
            "Once the task and the check are set, each item of the old programme is judged against the task. It is kept, moved to a reference link, made optional, or cut, and each decision carries a one-sentence reason that refers to the task. The manager then receives a short view that names the task, says whether the check is passed or not yet, attaches the work, and gives one question for the next one-to-one. It leaves out percentages, scores, time spent, and failed attempts.",
          ],
        },
        {
          heading: "How the assessment works",
          paragraphs: [
            "The assessment at the end of this lesson sets seven situations you have not seen, from a hospital trust, a retailer, a council, a law firm, a manufacturer, a charity, and a software company. Each question has one right answer, and each draws on one or more of the moves above.",
            "You need six of the seven to pass. After you submit, each question shows whether your choice was right and the feedback for the option you chose, so you can see the reasoning behind each one before you move on to your own programme.",
          ],
        },
      ],
      workedExample: {
        title: "A sponsor's brief, read and redesigned",
        inputLabel: "The brief from the sponsor",
        outputLabel: "The redesign the practitioner proposed",
        prompt:
          "From the operations director at Kestrel Retail: 'Store managers need to understand the new stock count process. Please build a module with a video walkthrough, the process document, and a quiz, and make it mandatory by the end of March.'",
        output:
          "Skill: run the weekly stock count in your own store using the new process and reconcile any variance over £200.\nTask: run the count for your store in the week of 10 March, with the area manager on the call for the reconciliation.\nCheck: the area manager confirms the count was submitted by Friday and every variance over £200 has a reason recorded.\nCut: the quiz, because the check now tests the task. Moved: the video, to a link from the task, because managers will want it on the day. Kept: the process document, because the count follows it.\nManager view: the count, the variances, and the question 'Which variance took longest to explain, and why?'",
        reading: [
          "The brief asked for a library: a video, a document, and a quiz. Its aim was a state of mind, understanding, which nobody can check.",
          "The practitioner rewrote the aim as a skill with an action verb and a setting, gave it a task from the real work, and wrote a check that names who judges and what they look for. The quiz was cut, because it only tested recall, and the other two items were kept or moved with a reason tied to the task.",
          "The manager view names the task and attaches the work, and it gives the area manager a question to ask. The director still gets the March deadline, and now also gets evidence that the counts are being done.",
        ],
      },
      practice: {
        intro:
          "Before the assessment, choose between two checks for the Kestrel Retail programme. The section above on checks will help if you want to read it again.",
        check: {
          kind: "choose",
          prompt: "Choose the check that tests the task for store managers learning the new stock count process.",
          leftLabel: "Check A",
          left: "The area manager confirms the count was submitted by Friday and every variance over £200 has a reason recorded.",
          rightLabel: "Check B",
          right: "Store managers answer fifteen questions on the steps of the new stock count process and must score at least twelve.",
          correct: "left",
          why: "Check A tests the task. The manager runs the real count, and the area manager applies a standard with two parts that any reviewer could apply. Check B tests recall of the steps, and a manager could pass it without ever running a count.",
          wrong:
            "Look again at Check B. Fifteen questions on the steps check what the manager remembers, not whether they can run and reconcile a count. Check A has the person do the work and names what the area manager looks for.",
        },
      },
      check: {
        kind: "scenario",
        prompt:
          "Read each situation and choose what you would do. Each question has one right answer, and you need six of the seven to pass.",
        passMark: 6,
        questions: [
          {
            id: "trust",
            situation:
              "Nadia Rahman leads learning at Westmoor Hospitals Trust. The ward clerk induction has seven modules: a welcome video, a tour of the intranet, three e-learning units on data protection, patient flow, and the switchboard, a reading list, and a final quiz. Ward managers say new clerks still cannot book a transfer on the patient system in their first week.",
            question: "What should Nadia do first?",
            options: [
              {
                id: "a",
                text: "Add an eighth module with a video showing how to book a transfer.",
                feedback:
                  "An eighth module is more content to consume, and new clerks can watch it and still be unable to book a transfer. The programme needs work the learner does, starting from the skill ward managers are missing.",
              },
              {
                id: "b",
                text: "Write the skill as booking a transfer on the patient system, and build a task in which new clerks book three real transfers from last week, with details changed, while a senior clerk checks each one.",
                correct: true,
                feedback:
                  "That starts where the course starts. You named the skill as work someone could see, gave it a task from the real work, and set a check with a named judge. The existing modules can then be judged against that task.",
              },
              {
                id: "c",
                text: "Make the final quiz harder, so that clerks have to study the patient flow unit more closely.",
                feedback:
                  "A harder quiz still checks recall. Clerks may remember more about patient flow and still freeze at the booking screen. The fix is a task in which they book transfers and a check on the result.",
              },
            ],
          },
          {
            id: "retail",
            situation:
              "Joel Hartley is an HR business partner at Linden Home Stores. The sponsor for a new store manager programme has written the aim: 'Store managers will be confident leading their teams through the Christmas peak.' Joel has one week to turn it into a design.",
            question: "Which rewrite should Joel take back to the sponsor?",
            options: [
              {
                id: "a",
                text: "Skill: confident peak leadership. Task: attend the peak planning day. Check: managers rate the day.",
                feedback:
                  "Confidence is a quality nobody can observe, attending is content to consume, and a rating measures how people felt about the day. None of the three parts describes work a manager does.",
              },
              {
                id: "b",
                text: "Skill: understand the peak trading plan. Task: read the plan. Check: a quiz on the plan.",
                feedback:
                  "Understand is a state of mind, reading is content to consume, and a quiz checks recall. The rewrite needs an action verb, real work, and a check with a named judge.",
              },
              {
                id: "c",
                text: "Skill: know the key dates of the peak. Task: review the calendar. Check: managers sign to say they have read it.",
                feedback:
                  "Knowing dates is recall, and a signature says only that someone reached the end. The skill should be something a manager does during peak that the regional manager could see.",
              },
              {
                id: "d",
                text: "Skill: build a peak staffing rota for your own store that covers every trading hour within the budgeted hours. Task: build the real rota for the first two weeks of December. Check: the regional manager confirms every hour is covered and the hours are within budget.",
                correct: true,
                feedback:
                  "This rewrite gives a skill with an action verb and a setting, a task that is the manager's real December rota, and a check that names the regional manager and two things they look for. The sponsor can see exactly what managers will be able to do.",
              },
            ],
          },
          {
            id: "council",
            situation:
              "Grace Mensah designs learning for the revenues team at Ashcombe Borough Council. The skill is to decide a council tax discount application correctly and give the reason. Three checks have been proposed, and Grace can use only one.",
            question: "Which check should Grace use?",
            options: [
              {
                id: "a",
                text: "Decide six real applications from last month, with names removed, and the team leader confirms each decision matches the policy and the reason cites the rule.",
                correct: true,
                feedback:
                  "This checks the task. The officer makes real decisions, and the team leader applies a standard another reviewer would apply the same way, which is a matching decision and a cited rule.",
              },
              {
                id: "b",
                text: "Answer twenty multiple-choice questions on the discount rules.",
                feedback:
                  "Questions on the rules check recall. An officer could remember every rule and still misapply one to a real application. The check should ask them to decide real applications against a standard.",
              },
              {
                id: "c",
                text: "Rate your confidence in deciding discount applications before and after the programme.",
                feedback:
                  "A confidence rating measures a feeling, not a decision. It cannot show whether applications are decided correctly, which is what the skill describes.",
              },
            ],
          },
          {
            id: "law",
            situation:
              "Tom Ellery is learning and development manager at Hurst and Vane, a law firm. The task for new trainees is to prepare a completion statement for a residential property sale using the firm's template. The current programme also includes a video on the firm's history, the template with guidance notes, a webinar on the housing market, and a quiz on conveyancing terms.",
            question: "Which set of decisions should Tom record?",
            options: [
              {
                id: "a",
                text: "Keep all four items, because each has an owner who will object if it is removed.",
                feedback:
                  "Owners matter, but keeping everything buries the task under content it does not need. Record a reason tied to the task for each decision, which gives each owner something concrete to discuss.",
              },
              {
                id: "b",
                text: "Cut the template, because trainees will see it on the job anyway, and keep the other three.",
                feedback:
                  "The template is the one item the task cannot be done without. Cutting it would stall the task, while the video, the webinar, and the quiz do nothing for it.",
              },
              {
                id: "c",
                text: "Keep the template, because the task uses it. Make the history video and the market webinar optional, because the task does not need them. Cut the quiz, because the check now tests the task.",
                correct: true,
                feedback:
                  "Each decision is judged against the task and carries a one-sentence reason that refers to it. The template stays, the two items the task does not need are made optional, and the recall quiz goes.",
              },
            ],
          },
          {
            id: "manufacturer",
            situation:
              "Priya Sandhu is an HR business partner at Colne Precision. A new shift supervisor has finished a redesigned programme whose task was to run a start-of-shift safety briefing using the site checklist, observed by the production manager. Priya is writing the view the production manager will receive.",
            question: "Which view should Priya send?",
            options: [
              {
                id: "a",
                text: "Supervisor programme: 100% complete in 2 hours 5 minutes. Final score 88%.",
                feedback:
                  "A percentage, a time, and a score say nothing about whether the briefing was run to the checklist. The production manager has nothing to read and nothing to ask.",
              },
              {
                id: "b",
                text: "Task: run a start-of-shift safety briefing using the site checklist. Check: passed, observed on Wednesday's early shift. The observation notes are attached. Question for your next one-to-one: which item on the checklist got the most questions from the team, and why?",
                correct: true,
                feedback:
                  "This view names the task, says the check was passed and when, attaches the evidence, and gives the production manager a question that brings the briefing back into the job.",
              },
              {
                id: "c",
                text: "Task: run a start-of-shift safety briefing. The supervisor needed three attempts to pass the check. Full attempt history attached.",
                feedback:
                  "Naming the task is right, but failed attempts are for the programme team, not the manager. Showing them invites the manager to judge the supervisor on their learning rather than on the work.",
              },
            ],
          },
          {
            id: "charity",
            situation:
              "Martha Quinn runs volunteer learning at Fairhaven Trust, a homelessness charity. The skill for new outreach volunteers is to complete a first contact form with a rough sleeper, recording only what the person agrees to share. The proposed check is: 'The volunteer's first contact form is of a good standard.'",
            question: "What should Martha change about the check?",
            options: [
              {
                id: "a",
                text: "Replace it with a quiz on the fields of the form, so it can be scored automatically.",
                feedback:
                  "Scoring automatically is convenient, but a quiz on the fields checks recall. The volunteer should still complete a form, and the check should say what the reviewer looks for.",
              },
              {
                id: "b",
                text: "Nothing, because the check already asks the volunteer to complete a real form.",
                feedback:
                  "The task is right, but 'a good standard' leaves each reviewer to invent their own. Two coordinators could reach different verdicts on the same form.",
              },
              {
                id: "c",
                text: "Add a satisfaction survey after the first shift, so volunteers can say how prepared they felt.",
                feedback:
                  "A survey tells Martha how volunteers felt, which may be useful elsewhere, but it says nothing about whether the form was completed correctly.",
              },
              {
                id: "d",
                text: "Name the reviewer and the standard, such as: the outreach coordinator confirms every required field is complete and nothing is recorded that the person did not agree to share.",
                correct: true,
                feedback:
                  "The task was already right. What it lacked was a standard another person could apply. Naming the coordinator and the two things they look for means any reviewer would reach the same verdict.",
              },
            ],
          },
          {
            id: "software",
            situation:
              "Dev Anand manages enablement at Brightfold Software. After redesigning the support engineer onboarding around a task of resolving five real tickets from last month, he is asked by the head of support to add back the product history webinar, the architecture reading pack, and a forty-question quiz, 'so nothing is lost'.",
            question: "What should Dev say to the head of support?",
            options: [
              {
                id: "a",
                text: "Agree to add all three back, since the head of support is the sponsor.",
                feedback:
                  "Adding the three items back rebuilds the library around the task, and new engineers will treat the tickets as one more module. Show the sponsor the reason recorded for each decision first.",
              },
              {
                id: "b",
                text: "Show the redesign sheet, where each item was moved or made optional with a reason tied to the task, and offer to link the reading pack from the tickets that need it.",
                correct: true,
                feedback:
                  "The recorded reasons make the decision about the task rather than about taste, and linking the reading pack from the tickets keeps it where engineers will use it. Nothing has been lost, and the sponsor can see why.",
              },
              {
                id: "c",
                text: "Refuse, and explain that research shows content does not help people learn.",
                feedback:
                  "That overstates the case. Content is part of good learning when it serves the task. The stronger reply is the reason recorded for each item and an offer to link what the tickets need.",
              },
            ],
          },
        ],
        why: "You applied the whole method to situations you had not seen before. You started from a skill someone could see, chose checks that test the task against a standard, judged content against the task, and gave the manager a view in the words of the work.",
      },
      bridge:
        "You have now used every move in the course on new situations. In the last lesson you will write the redesign sheet for your own programme, and that sheet is the work your record will show.",
    },
    {
      id: "redesign-one-programme",
      title: "Redesign one programme",
      emphasis: "programme",
      place:
        "This is the last lesson. You will write the redesign sheet for a programme you own or influence, and that sheet is the work your record will show.",
      sections: [
        {
          heading: "What the redesign sheet is for",
          paragraphs: [
            "The redesign sheet is one page that a colleague, a sponsor, or the programme's owner could read and act on. It records the decision about what the programme is for, written so that someone else can build it and so that the owner can hold the design to it later.",
            "A redesign sheet is not a full course design with every screen written. It does not list every paragraph of the new task instructions or every question in a reference guide. It states the skill, the task, and the check, what happened to the old content, and what the manager will see, and it stops there.",
          ],
        },
        {
          heading: "The parts of the sheet",
          paragraphs: [
            "The sheet opens with the programme today in one or two sentences: what it contains and how long it takes. It then states the skill as observable work, beginning with an action verb and naming a setting. The task follows, described as real work the learner does, and then the check with its standard, naming who judges and what they look for.",
            "Next comes what you cut, moved, or made optional, with a one-sentence reason for each that refers to the task or the check. Then the manager view, naming the task and the state of the check without a percentage, a score, or time spent, and the question for the one-to-one. The sheet ends with the first change you will make and when you will make it, so the design leaves the page.",
          ],
        },
        {
          heading: "How the sheet is checked",
          paragraphs: [
            "When you continue, each part is checked in turn. The programme today needs a concrete detail, such as a number of modules, a length, or a name. The skill needs an action verb. The task needs to say it uses real work. The check needs to name who judges or what standard they apply. The cuts need a reason that refers to the task or the check. The manager view needs the task and the state of the check. The question needs to be a question, and the first change needs a date, a day, or a month.",
            "Do not put the names of individuals, email addresses, or telephone numbers in the sheet. It will appear on a record a second person can open, so describe roles, such as the team leader or the HR business partner, rather than people. If a part is missing, the note will name it and say what to add.",
          ],
        },
      ],
      workedExample: {
        title: "A redesign sheet for an expenses programme",
        inputLabel: "The programme today",
        outputLabel: "The redesign sheet",
        prompt:
          "Carrow Foods expenses programme for finance operations: a forty-minute policy walkthrough video followed by a twenty-question quiz. Completion is reported as a percentage to the finance director each quarter.",
        output:
          "The programme today: a forty-minute policy walkthrough and a twenty-question quiz, reported as a percentage.\nSkill: approve or reject an expense claim correctly under the policy and give the reason.\nTask: review ten real claims from last quarter, with names removed, and decide each one.\nCheck and its standard: the finance manager confirms at least nine of the ten decisions match theirs, and every rejection cites the policy clause.\nWhat I cut, moved, or made optional: the walkthrough is cut and the policy is linked from the task, because the task uses the policy directly. The quiz is cut, because the check now tests the task.\nWhat the manager will see: the task, whether the check is passed or not yet, and the ten decisions.\nThe question for the one-to-one: which claim would you still ask about, and why?\nThe first change and when: replace the quiz with the ten-claim task before the April intake.",
        reading: [
          "Every part of the sheet does one job. The skill has action verbs and a setting, the task uses real claims, and the check names the finance manager and a standard with two parts.",
          "Each cut carries a reason tied to the task or the check. The finance director can see why the walkthrough and the quiz have gone, and the policy is still there in a more useful place.",
          "The manager view drops the percentage, and the first change names an action and a month. A colleague could build the programme from this page without asking what was meant.",
        ],
      },
      practice: {
        intro:
          "Before you write your own sheet, look back at the skill, task, and check you wrote in the second lesson. Read each line of this draft sheet and mark whether a colleague could build from it. You will use the same test on your own sheet in a moment.",
        check: {
          kind: "mark",
          prompt: "Mark each line of this draft sheet as Ready to build from or as A colleague would have to ask.",
          passLabel: "Ready to build from",
          failLabel: "A colleague would have to ask",
          sentences: [
            {
              id: "skill",
              text: "Skill: leadership.",
              fail: true,
              why: "Leadership is a topic, not something a person does that someone else could see. A colleague would have to ask what the manager will actually do.",
            },
            {
              id: "task",
              text: "Task: build next month's rota for your own team within the budgeted hours.",
              fail: false,
              why: "This is real work with a clear setting, so a colleague could build the task from it.",
            },
            {
              id: "check",
              text: "Check: participants complete a feedback form.",
              fail: true,
              why: "A feedback form measures how people felt. It does not say who judges the rota or what they look for, so a colleague would have to ask.",
            },
            {
              id: "first",
              text: "The first change and when: replace the leadership quiz with the rota task before the September cohort.",
              fail: false,
              why: "This names an action and a time, so a colleague could act on it.",
            },
          ],
          why: "That is right. The task and the first change are ready to build from, but 'leadership' and a feedback form would leave a colleague asking what the skill is and how anyone will know it was done.",
        },
      },
      check: {
        kind: "build",
        prompt:
          "Write the redesign sheet for a programme you own or influence. Someone who was not in this course should be able to build from it.",
        fields: [
          {
            id: "today",
            label: "The programme today",
            hint: "What it contains and how long it takes, in one or two sentences, with at least one number or name.",
            min: 30,
            rule: "fact",
            missing:
              "The programme today does not yet give a concrete detail. Say what it contains and how long it takes, for example 'six modules and a quiz, about ninety minutes, 3 hours in total'.",
          },
          {
            id: "skill",
            label: "Skill",
            hint: "Something a person does that someone else could see, beginning with an action verb and naming a setting.",
            min: 25,
            any: [
              "approve",
              "reject",
              "reply",
              "write",
              "run ",
              "give",
              "decide",
              "handle",
              "answer",
              "review",
              "prepare",
              "draft",
              "record",
              "complete",
              "plan",
              "lift",
              "enter",
              "set up",
              "explain",
              "open",
              "agree",
              "brief",
              "chair",
              "calculate",
              "respond",
              "carry out",
              "book",
              "build",
            ],
            missing:
              "Write the skill as something a person does that someone else could see, beginning with an action verb such as approve, reply, write, run, or decide, and naming a setting.",
          },
          {
            id: "task",
            label: "Task",
            hint: "Real work the learner does, taken from the job wherever possible.",
            min: 25,
            any: ["real", "last week", "last month", "last quarter", "own team", "own store", "live", "from your", "actual", "case"],
            missing:
              "This task does not yet describe real work. Describe the work the learner will do and say where it comes from, such as real cases from last month.",
          },
          {
            id: "check",
            label: "Check and its standard",
            hint: "Who or what judges the result, and what they look for.",
            min: 25,
            any: ["confirm", "observ", "review", "match", "against", "standard", "look for", "sees", "signs off", "checks that"],
            missing:
              "This check does not yet say how someone will see the task done to standard. Name who judges the result and what they look for.",
          },
          {
            id: "cuts",
            label: "What I cut, moved, or made optional, with a reason for each",
            hint: "Each item and what happened to it, with a one-sentence reason that refers to the task or the check.",
            min: 30,
            any: ["task", "check"],
            missing:
              "Tie each reason to the task. Say what you cut, moved, or made optional, and give a reason that refers to the task or the check.",
          },
          {
            id: "manager",
            label: "What the manager will see",
            hint: "The task and whether the check is passed or not yet, with the work attached where appropriate. No percentage, score, or time spent.",
            min: 25,
            any: ["passed", "not yet", "check"],
            missing:
              "The manager view does not yet say where the check stands. Name the task and say whether the check is passed or not yet, rather than giving a percentage or a score.",
          },
          {
            id: "question",
            label: "The question for the one-to-one",
            hint: "One question the manager can ask that brings the task back into the job.",
            min: 15,
            any: ["?"],
            missing: "Write the question for the one-to-one as a question the manager can ask, ending with a question mark.",
          },
          {
            id: "first",
            label: "The first change and when",
            hint: "An action and a time, such as a month, a day, or a date.",
            min: 20,
            rule: "fact",
            missing:
              "The first change does not yet say when. Name the action and a time, such as 'before the March intake' or 'by 30 June'.",
          },
        ],
        why: "The redesign sheet has every part. It says what the programme is today, states a skill someone could see, gives a task from real work and a check with a standard, ties every cut to the task, gives the manager a view and a question, and names the first change and when.",
      },
      bridge:
        "Your redesign sheet is ready. Sign your name below, and the record will show this sheet, the course, and the date to anyone who opens the reference.",
    },
  ],
};
