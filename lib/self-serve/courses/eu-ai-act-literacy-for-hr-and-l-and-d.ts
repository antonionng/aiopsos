/*
Course: EU AI Act Literacy for HR and L&D
Slug: eu-ai-act-literacy-for-hr-and-l-and-d
For: L&D leads, HR business partners, people operations managers, and HR generalists who have been
  asked what their organisation is doing about AI literacy under the EU AI Act. They know which AI
  tools their colleagues use, or can find out from IT or procurement. They are not lawyers.
Outcome: The learner reads Article 4 and says accurately what it asks and what it does not, writes a
  role map row for each role that uses an AI system, writes the outline of a record of the measures
  taken, and writes a statement of what that evidence does not claim.
Artefact: The role map and record outline: three role map rows, a record outline, a statement of
  what the work does not claim, and who answers questions about how the Act applies.
Record sentence: Prepared a role map of AI literacy measures, the outline of the record that will
  show them, and a statement of what that evidence does not claim.
Lessons (id, title, move, interaction, pass rule):
  1. what-article-4-asks, What Article 4 asks, tell what the text says from what it does not, mark
     (In the text / Not in the text), every statement marked correctly.
  2. the-context-sets-the-level, The context sets the level, judge a measure against the context,
     choose, the measure built around this system, this use, and the people affected.
  3. the-role-map, The role map, complete a role map row, edit, the row names a use, who is affected,
     what the person must be able to do, a specific measure, an owner, and a review.
  4. what-a-record-contains, What a record contains, tell evidence from claims, mark (Evidence of a
     measure / A claim the record cannot support), every line marked correctly.
  5. what-you-will-not-claim, What you will not claim, tell action from status, mark (Describes what
     was done / Claims a legal status), every sentence marked correctly.
  6. course-assessment, Course assessment, apply every move to new situations, scenario, six of seven.
  7. your-role-map-and-record, Your role map and record outline, write the artefact, build, three rows
     each with a measure and a review date, one row naming the people affected, a record outline with
     a review, a statement that the work is not a statement of compliance, and who answers legal
     questions.
Sources: Regulation (EU) 2024/1689 (the EU AI Act), Articles 2, 3, 4, 5 and 26 and Annex III; the
  European Commission questions and answers on AI literacy; the AI Office living repository of AI
  literacy practices; the ICO guidance on AI and data protection; the CIPD factsheet on evaluating
  learning and development.
Tested on phone:          no, to be walked in the player before release
Tested returning learner: no, to be walked in the player before release
Pass rule tests written:  yes
*/

import type { CourseContent } from "./types.ts";

const IN_TEXT = "In the text";
const NOT_IN_TEXT = "Not in the text";
const SPECIFIC = "Says something specific";
const OPEN = "Leaves a question open";
const EVIDENCE = "Evidence of a measure";
const UNSUPPORTED = "A claim the record cannot support";
const ACTION = "Describes what was done";
const STATUS = "Claims a legal status";
const READY = "Ready for the record";
const ANOTHER_LOOK = "Needs another look";

const ARTICLE_OUTLINE =
  "Article 4 places a duty on providers and deployers of AI systems to take measures to ensure a sufficient level of AI literacy among their staff and other persons dealing with the operation and use of AI systems on their behalf. The measures should take into account those people's technical knowledge, experience, education, and training, the context in which the AI systems are used, and the persons or groups of persons on whom the systems are used. Article 3 describes AI literacy as the skills, knowledge, and understanding that allow people to make an informed deployment of AI systems and to be aware of their opportunities, their risks, and the harm they can cause.";

export const COURSE: CourseContent = {
  slug: "eu-ai-act-literacy-for-hr-and-l-and-d",
  hours: 2,
  artefact: {
    lessonId: "your-role-map-and-record",
    title: "The role map and record outline",
    recordLine:
      "Prepared a role map of AI literacy measures, the outline of the record that will show them, and a statement of what that evidence does not claim.",
  },
  lessons: [
    {
      id: "what-article-4-asks",
      title: "What Article 4 asks",
      emphasis: "Article",
      place:
        "This is the first of seven lessons. Before anyone maps roles or designs a record, they need to know what the text of Article 4 actually says, because a good deal of what circulates about it in vendor emails and on intranets is not in it.",
      sections: [
        {
          heading: "What the Article says",
          paragraphs: [
            "Article 4 of the EU AI Act, Regulation (EU) 2024/1689, is short. In general terms, it places a duty on providers and deployers of AI systems to take measures to ensure a sufficient level of AI literacy among the people who work with those systems for them. A provider is the organisation that develops a system and places it on the market. A deployer is the organisation that uses a system under its own authority, which is where most employers who buy an applicant tracking system or a writing assistant will sit.",
            "The duty covers staff, and it also covers other persons dealing with the operation and use of AI systems on the organisation's behalf. That can include contractors, agency workers, and consultants who use a system as part of work they do for you. It does not, on its face, reach every employee regardless of their work. It reaches the people who operate or use AI systems for the organisation.",
            "The Article says the measures should take into account the people's technical knowledge, experience, education, and training, the context in which the systems are used, and the persons or groups of persons on whom the systems are used. Article 3 describes AI literacy as the skills, knowledge, and understanding that allow people to make an informed deployment of AI systems and to be aware of their opportunities, their risks, and the harm they can cause.",
          ],
        },
        {
          heading: "What the Article does not say",
          paragraphs: [
            "What the text leaves out matters as much as what it contains. Article 4 does not require an exam, a pass mark, a named qualification, or an accredited certificate. It does not prescribe a number of hours or a format such as e-learning. It does not require the same measure for everyone, and the factors it lists point the other way, because people with different backgrounds in different contexts need different things.",
            "The Article also does not say that delivering training makes an organisation compliant. It describes a duty to take measures, and it gives no point at which that duty is settled by a single event. A session delivered once and never reviewed is a measure taken on one day, and nothing more can be read into it.",
          ],
        },
        {
          heading: "Two labels for every claim",
          paragraphs: [
            "In this lesson you will judge each statement about Article 4 with one of two labels. A statement is In the text when the words of Article 4, or the description of AI literacy in Article 3, support it. For example, the statement that measures should take account of the context in which systems are used is In the text, because the Article names that factor.",
            "A statement is Not in the text when it adds a requirement, a format, or a guarantee that the text does not contain. An exam, a certificate, an annual test, a deadline for every employee, or a promise that a course makes you compliant are all Not in the text. Some of these may still be sensible as measures. The label does not reject them as ideas. It stops anyone presenting them as what the law asks.",
          ],
        },
        {
          heading: "Why this matters in HR, and the usual mistake",
          paragraphs: [
            "HR and L&D teams are often the first to be asked what the organisation is doing about AI literacy, and they are usually asked by someone who has read a vendor's summary rather than the Article. If that summary is repeated in a policy or a board paper, the organisation ends up committed to requirements the law never set, and it may miss the ones it did.",
            "The usual mistake is to take the most confident summary as the text. A sentence that begins 'Under Article 4, you must' sounds authoritative, and it is easy to copy. Read the Article itself, which takes less than a minute, and check each claim against it before you repeat it.",
            "One question sits outside this course. Whether the Act applies to a particular organisation, including one based in the United Kingdom that sells into or operates in the European Union, depends on the scope rules in Article 2. That is a question for the organisation's lawyers. This course teaches you to prepare evidence of measures, and it does not make you, your team, or your organisation compliant with anything.",
          ],
        },
      ],
      workedExample: {
        title: "A vendor's email, read against the text",
        inputLabel: "The vendor's email",
        outputLabel: "The note the L&D lead sent to the HR director",
        prompt:
          "Under Article 4, every employee must complete a certified AI literacy course. Our two-hour module makes your organisation fully compliant. The Act requires annual testing with a pass mark.",
        output:
          "I have read this against Article 4. None of the three sentences is in the text. The Article asks us to take measures to ensure a sufficient level of AI literacy for the people who use AI systems on our behalf, taking their background and the context into account. It does not mention certification, testing, or a pass mark, and no module can make us compliant. I suggest we map which roles use which systems before we buy anything.",
        reading: [
          "The first sentence is Not in the text. Article 4 does not require a certified course, and it covers the people who deal with AI systems on the organisation's behalf, not every employee regardless of their work.",
          "The second sentence is Not in the text. No training module makes an organisation compliant, and the Article describes a duty to take measures that fit the context, which no off-the-shelf module can settle on its own.",
          "The third sentence is Not in the text. The Article contains no testing schedule and no pass mark. A test might be a good measure for some roles, but it is a choice the organisation makes, not a requirement of the law.",
          "The L&D lead's note keeps to the words of the Article, says plainly what is missing from the vendor's claims, and proposes the next step this course teaches, which is to map roles before choosing measures.",
        ],
      },
      practice: {
        intro:
          "Here are three sentences from an intranet announcement. The outline of Article 4 is shown with the question so that you can check each sentence against it. Mark each one with the two labels you have just learned.",
        check: {
          kind: "mark",
          prompt: "Mark each sentence from the announcement as In the text or Not in the text.",
          material: { label: "Article 4, in outline", text: ARTICLE_OUTLINE },
          passLabel: IN_TEXT,
          failLabel: NOT_IN_TEXT,
          sentences: [
            {
              id: "background",
              text: "The measures we provide will take account of each team's existing knowledge and experience of AI.",
              fail: false,
              why: "The Article names technical knowledge, experience, education, and training as factors the measures should take into account, so this is in the text.",
            },
            {
              id: "hours",
              text: "The Act requires every member of staff to complete four hours of AI training each year.",
              fail: true,
              why: "The Article sets no number of hours and no yearly cycle, and it does not reach every member of staff regardless of their work, so this is not in the text.",
            },
            {
              id: "affected",
              text: "The people on whom a system is used are one of the things our measures must consider.",
              fail: false,
              why: "The Article names the persons or groups of persons on whom the systems are used, so this is in the text.",
            },
          ],
          why: "That is right. The first and third sentences repeat factors the Article names, and the second adds a number of hours and a yearly cycle that the text does not contain.",
        },
      },
      check: {
        kind: "mark",
        prompt: "Mark each statement about Article 4 as In the text or Not in the text.",
        passLabel: IN_TEXT,
        failLabel: NOT_IN_TEXT,
        sentences: [
          {
            id: "exam",
            text: "Every employee must pass an AI literacy exam.",
            fail: true,
            why: "The Article speaks of measures and a sufficient level of literacy, and it never mentions an exam or a pass, so this is not in the text.",
          },
          {
            id: "context",
            text: "Measures should take account of the context in which the AI systems are used.",
            fail: false,
            why: "The Article names the context the systems are used in as one of the factors, so this is in the text.",
          },
          {
            id: "qualification",
            text: "Staff must hold an accredited AI qualification.",
            fail: true,
            why: "No qualification or accreditation is named anywhere in the Article, so this is not in the text.",
          },
          {
            id: "contractors",
            text: "The duty can cover contractors who use AI systems on the organisation's behalf.",
            fail: false,
            why: "The Article is not limited to employees. It includes other persons dealing with the operation and use of AI systems on the organisation's behalf, so this is in the text.",
          },
          {
            id: "delivered",
            text: "Once the training has been delivered, the organisation is compliant with Article 4.",
            fail: true,
            why: "Nothing in the Article says that a single training event settles the duty or makes anyone compliant. This is not in the text, and it is the claim this course asks you never to make.",
          },
        ],
        why: "You kept to the words of the Article. The context and the contractors are in the text, and the exam, the qualification, and the claim of compliance are not, which is exactly the reading a vendor's summary tends to get wrong.",
      },
      bridge:
        "The Article says the measure depends on the people and the context. The next lesson shows how that changes what a sufficient measure looks like from one HR role to another.",
    },
    {
      id: "the-context-sets-the-level",
      title: "The context sets the level",
      emphasis: "context",
      place:
        "This is the second of seven lessons. You now know what Article 4 asks. This lesson teaches you to judge what a sufficient measure looks like for one role, using the factors the Article names.",
      sections: [
        {
          heading: "One level does not fit every role",
          paragraphs: [
            "The Article does not define one level of AI literacy for everyone. It asks the organisation to weigh three things for each group of people: what they already know from their technical knowledge, experience, education, and training; the context in which they use the AI system; and the people on whom the system is used. A sufficient level for one role can be far more than is needed for another.",
            "This is not a loophole. It is the reason a single awareness course for the whole organisation rarely does the job on its own. A recruiter who reviews a ranked shortlist and a designer who drafts a course outline both use AI, but what can go wrong, and who pays for it, is quite different.",
          ],
        },
        {
          heading: "The people on whom the system is used",
          paragraphs: [
            "In HR the third factor carries particular weight, because the people affected are often job applicants and employees, and decisions about them shape their work and their income. The Act itself recognises this. Annex III lists AI systems used for recruitment and selection, and for decisions about terms of work, promotion, termination, allocating tasks, and monitoring or evaluating performance, among its high-risk uses.",
            "Where a system is high-risk, Article 26 asks deployers to assign human oversight to people who have the necessary competence, training, and authority. Article 5 goes further for one use and prohibits AI systems that infer the emotions of a person in the workplace, except for medical or safety reasons. You do not need to become an expert in either Article, but you should know that the heaviest measures belong where the output of a system is used on applicants and employees.",
          ],
        },
        {
          heading: "What a sufficient measure contains",
          paragraphs: [
            "A sufficient measure is specific to the system and the use. It tells the person what this system does, where it is known to fail, what they must do when they disagree with it, and how to record what they did. It is written for the role, and it is reviewed when the system or the use changes.",
            "A sufficient measure is not a general session about what AI is. That kind of session can be a useful first step for people with no background at all, but it does not tell a recruiter how to review an application the ranking placed low. When the output affects someone, the measure has to reach the decision the person makes about them.",
          ],
          beforeAfter: {
            before: "Recruiters will complete the company's introduction to AI.",
            after:
              "Recruiters will attend a session on the ranking feature in our applicant tracking system, covering what it ranks on, the limits the vendor documents, how to review an application it ranked low, and how to record the reason for an override.",
            reading:
              "The first version could be written for any role in any organisation. The second names the system, the use, and the moment the recruiter must act on their own judgement, which is what the context calls for.",
          },
        },
        {
          heading: "The usual mistake",
          paragraphs: [
            "The usual mistake runs in two directions at once. Organisations give the same short video to everyone, which is too little for the recruiter and more than the payroll officer who uses no AI system needs. The measure looks tidy on a report, but it has not been fitted to anyone.",
            "Judge each role by asking three questions in order. What is the system used for? Who is affected by its output? What does this person already know? The answers tell you where the measure needs weight and where a short piece of guidance is enough.",
          ],
        },
      ],
      workedExample: {
        title: "Three roles, three measures",
        inputLabel: "The list of AI uses from IT",
        outputLabel: "The measures the L&D lead wrote",
        prompt:
          "Recruiters: screening feature in the applicant tracking system that ranks applications. Learning designers: general chat assistant, used to draft course outlines. Payroll officers: no AI system in use.",
        output:
          "Recruiters: a session on the screening feature covering what it ranks on, its documented limits, how to review an application it placed low, and how to record an override, with practice on anonymised cases and a repeat whenever the feature changes. Learning designers: a one-page guide on checking drafts against the source material and on what must never be pasted into the tool. Payroll officers: no measure under Article 4 for now, because they do not use an AI system; review if that changes.",
        reading: [
          "The recruiters' measure is the heaviest because the ranking is used on applicants, and a recruiter who trusts it without review could screen out a strong candidate. The measure goes straight to the moment the recruiter must disagree with the system.",
          "The learning designers' measure is lighter because their drafts are reviewed before anyone sees them and affect no individual directly. The guide still covers the two things that can go wrong, which are unchecked content and material that should never have been pasted in.",
          "The payroll line records a decision rather than leaving a gap. Saying that no measure is needed for now, and when that will be looked at again, is more useful than silence, because it shows the role was considered.",
          "Read together, the three measures differ because the three contexts differ, which is what the Article asks the organisation to take into account.",
        ],
      },
      practice: {
        intro:
          "Here are two measures for the learning designers in the worked example. Ask the three questions from the lesson about each one: what the system is used for, who its output affects, and what the designers already know.",
        check: {
          kind: "choose",
          prompt: "Choose the measure that fits the learning designers' context.",
          leftLabel: "Measure A",
          left: "Learning designers receive a one-page guide on checking every draft outline against the source material and on the kinds of material that must never be pasted into the chat assistant.",
          rightLabel: "Measure B",
          right: "Learning designers are told the chat assistant is approved for use and are asked to use it responsibly.",
          correct: "left",
          why: "Measure A is built around what the designers actually do with the tool, and it covers the two things that can go wrong, unchecked drafts and material that should never be pasted in. Measure B names no task, no risk, and nothing the designers should do differently.",
          wrong:
            "Look again at Measure B. Asking people to use a tool responsibly does not say what responsible use looks like for this task. Measure A names the check on drafts and the material to keep out, which fits the context.",
        },
      },
      check: {
        kind: "choose",
        prompt:
          "A recruiter at Hallam Freight uses an AI feature that ranks job applications. Choose the measure that fits the context the Article describes.",
        leftLabel: "Measure A",
        left: "All staff, including the recruiter, watch a thirty-minute video called What Is AI and confirm that they have watched it.",
        rightLabel: "Measure B",
        right:
          "The recruiter attends a session on this ranking feature covering what it ranks on, its documented limits, how to review an application it ranked low, and how to record an override. They practise on five anonymised applications, and the session is repeated when the vendor changes the feature.",
        correct: "right",
        why: "Measure B is built around this system, the applicants it affects, and what the recruiter must do when they disagree with it, which is the context the Article asks you to weigh.",
        wrong:
          "Look again at Measure A. It is the same for everyone and says nothing about the ranking feature or the applicants it affects. The Article asks for measures that take the context of use and the affected people into account, which Measure B does.",
      },
      bridge:
        "One role at a time is a start. The next lesson puts every role on one map, with the parts each row needs so that the reasoning can be checked later.",
    },
    {
      id: "the-role-map",
      title: "The role map",
      emphasis: "map",
      place:
        "This is the third of seven lessons. You can now describe a sufficient measure for one role. This lesson turns that into a role map for the organisation, which is the first half of the artefact you will write at the end.",
      sections: [
        {
          heading: "One row for each role",
          paragraphs: [
            "A role map is a table with one row for each role that deals with the operation or use of an AI system on the organisation's behalf. A role names a group of people by what they do, such as recruiters, line managers, or HR advisers. It never names individuals, because the map describes the organisation's reasoning, not a list of people.",
            "The map is the reasoning that links each role to its measure. Someone reading it later, whether an auditor, a new head of L&D, or a works council, should be able to see why each role received the measure it did, and when that decision will be looked at again.",
          ],
        },
        {
          heading: "The seven parts of a row",
          paragraphs: [
            "Each row has seven parts. The role names the group of people. The system and use says which AI system they use and for what task. Who is affected names the people on whom the output is used, such as applicants, employees, or customers. What they must be able to do states the work the person must be able to perform, written so that someone could watch it.",
            "The measure is what the organisation will provide, such as a session, a guide, supervised practice, or a change to the process. The owner is the role accountable for the measure. The review date is when the row will be looked at again, and a row should also be reviewed whenever the system or its use changes.",
            "A row that is missing a part leaves a question open. If who is affected is blank, nobody can tell why the measure is as heavy or as light as it is. If the owner is blank, nobody will notice when the measure lapses.",
          ],
        },
        {
          heading: "What they must be able to do, written as work",
          paragraphs: [
            "The fourth part is the one people most often get wrong. It should begin with a verb that describes work someone could see, such as check, explain, correct, or record. It should name a task in the role, not a state of mind.",
            "This part tells whoever designs the measure what the check at the end should test. If it says the person must understand AI, nobody can design a check for it. If it says the person must spot and correct an invented figure in a draft, the check writes itself.",
          ],
          beforeAfter: {
            before: "What they must be able to do: understand AI and its risks.",
            after:
              "What they must be able to do: review an application the ranking placed low, and record the reason when they override the ranking.",
            reading:
              "The first version describes a state no one can observe. The second names two pieces of work a recruiter does, which a session can practise and a record can show.",
          },
        },
        {
          heading: "Two labels for a line of the map, and the usual mistake",
          paragraphs: [
            "When you read a draft row, judge each line with one of two labels. A line Says something specific when it names a task, a group of people, a measure, a role, or a date that someone else could check. A line Leaves a question open when a reader would have to ask what it means, for example 'System: AI', 'Measure: training', or 'Review: ongoing'.",
            "A role map is not an inventory of software licences, and it is not a training calendar. The usual mistake is to start from the licence list and write one row per product. Start from the roles and the work instead, because two roles can use the same product for different tasks, with different people affected, and they need different measures.",
          ],
        },
      ],
      workedExample: {
        title: "A row for line managers",
        inputLabel: "The entry in the IT inventory",
        outputLabel: "The role map row the L&D lead wrote",
        prompt:
          "Writing assistant built into the office software. Licensed to all line managers. Used for emails and meeting notes.",
        output:
          "Role: line managers. System and use: the writing assistant built into the office software, used to draft emails and meeting notes. Who is affected: their team members and, occasionally, customers. What they must be able to do: check a draft for invented facts before sending, and keep personal information about their team out of the tool. Measure: a forty-five-minute practical session and a one-page guide, with a check in the session. Owner: head of L&D. Review date: six months after the session, or sooner if the tool changes.",
        reading: [
          "The inventory entry names a product and a licence. The row turns that into reasoning. It says what the managers use the tool for and who reads what it produces.",
          "Who is affected explains why the measure includes keeping personal information out of the tool. Team members are the people whose details a manager is most likely to paste in.",
          "What they must be able to do begins with check and keep, and it names two tasks. Whoever designs the session now knows what the check in the session should test.",
          "The owner and the review date mean the row will not quietly go out of date. Every part answers a question someone could ask later.",
        ],
      },
      practice: {
        intro:
          "Here is a draft row for another role. Judge each line with the two labels from the lesson. The worked row above is still there to compare against.",
        check: {
          kind: "mark",
          prompt: "Mark each line of this draft row as Says something specific or Leaves a question open.",
          passLabel: SPECIFIC,
          failLabel: OPEN,
          sentences: [
            {
              id: "use",
              text: "System and use: the chat assistant in the case management tool, used to summarise employee relations case notes.",
              fail: false,
              why: "It names the system and the task it is used for, so it says something specific.",
            },
            {
              id: "able",
              text: "What they must be able to do: be aware of AI.",
              fail: true,
              why: "Being aware is not work anyone could watch. Write a task that begins with a verb, such as check a summary against the case notes.",
            },
            {
              id: "affected",
              text: "Who is affected: the employees whose cases are summarised.",
              fail: false,
              why: "It names the group of people on whom the output is used, so it says something specific.",
            },
            {
              id: "review",
              text: "Review date: ongoing.",
              fail: true,
              why: "Ongoing gives no date and no trigger, so nobody knows when the row will be looked at. Give a month or a change that will trigger a review.",
            },
          ],
          why: "That is right. The use and the people affected are specific, and 'be aware of AI' and 'ongoing' would leave a reader asking what the person must do and when the row will be reviewed.",
        },
      },
      check: {
        kind: "edit",
        prompt:
          "This row from a role map at Wrenfield Housing is incomplete. Edit it so that each of the seven parts is there and says something specific. Keep the role and the system.",
        label: "The role map row you are completing",
        start: "Role: HR advisers. System: chat assistant. Measure: training.",
        unchanged:
          "You have not changed the row yet. Add what the advisers use the chat assistant for, who is affected, what they must be able to do, a specific measure, an owner, and a review date.",
        limitWording: false,
        keep: [
          {
            id: "role",
            any: ["hr adviser"],
            missing: "Keep the role. The row should still say that it is about HR advisers.",
          },
          {
            id: "system",
            any: ["chat assistant"],
            missing: "Keep the system. The row should still name the chat assistant.",
          },
        ],
        limits: [
          {
            id: "use",
            any: ["used to", "used for", "draft", "summar", "answer", "respond", "prepar", "write"],
            missing:
              "Say what the advisers use the chat assistant for, naming a task, such as drafting policy summaries.",
          },
          {
            id: "affected",
            any: ["affected", "employee", "applicant", "candidate", "staff", "colleague", "worker", "tenant"],
            missing:
              "Name the people on whom the output is used, such as employees or managers who receive the advice.",
          },
          {
            id: "able",
            any: ["able to"],
            missing:
              "Write what an adviser must be able to do, as work someone could see, such as 'must be able to check a summary against the policy'.",
          },
          {
            id: "measure",
            any: ["session", "guide", "guidance", "practice", "practis", "workshop", "coaching", "supervis", "checklist", "briefing"],
            missing:
              "Training on its own does not say what the organisation will provide. Name the session, the guide, the practice, or the change to the process.",
          },
          {
            id: "owner",
            any: ["owner", "accountable"],
            missing: "Name the role accountable for this measure, for example 'Owner: head of HR'.",
          },
          {
            id: "review",
            any: ["review"],
            missing: "Add when this row will be reviewed, or what change will trigger a review.",
          },
        ],
        why: "Your row now links the role to its use, the people affected, what the advisers must be able to do, and a measure with an owner and a review, so a reader can see the reasoning without asking you.",
        result: {
          label: "A completed row, for comparison",
          text: "Role: HR advisers. System and use: the chat assistant, used to draft summaries of policy for managers. Who is affected: the employees and managers who receive the advice. What they must be able to do: check each summary against the policy before sending it, and keep case details out of the tool. Measure: a one-hour session with practice on three summaries, and a one-page guide. Owner: head of HR. Review date: in six months, or when the assistant is updated.",
        },
      },
      bridge:
        "A map says what the organisation intends to do. The next lesson describes the record that shows what it actually did.",
    },
    {
      id: "what-a-record-contains",
      title: "What a record contains",
      emphasis: "record",
      place:
        "This is the fourth of seven lessons. You have a role map. This lesson designs the record that sits beside it, which is the second half of the artefact.",
      sections: [
        {
          heading: "What a record is for",
          paragraphs: [
            "A record of a measure is the evidence that a measure in the role map was actually taken. The map says what the organisation intends. The record says what it did, for whom, and when. When someone asks what the organisation has done about AI literacy, the record is what you show them.",
            "A record is not a certificate of compliance, and it is not a percentage of staff who clicked through a module. A completion figure tells you that a screen was opened. It does not tell you which role the measure was for, what the person did, or when it will be reviewed.",
          ],
        },
        {
          heading: "What each entry holds",
          paragraphs: [
            "For each measure, the record shows who took part, identified by name inside the organisation's own system and by role in any summary. It shows which role map row the measure belongs to, what the measure was, and the date it was provided.",
            "Where the measure included a check, the record shows what the person showed they could do, such as reviewing five anonymised applications and recording an override. It also shows when the measure will next be reviewed and who holds the record. That makes seven items, and each one is a fact someone could verify.",
          ],
        },
        {
          heading: "Two labels for a line of a record",
          paragraphs: [
            "In this lesson a line of a record is Evidence of a measure when it states a fact about what was provided, to whom, and when, or about work the person did. A session, a date, a row of the map, and a task each person completed are all evidence of a measure.",
            "A line is A claim the record cannot support when it says something no set of attendance and work can prove. That a person is AI literate in every context, that the organisation is compliant, or that a regulator has approved the approach are all claims the record cannot support. Attendance and work show what happened on a day with a tool, and nothing larger.",
          ],
        },
        {
          heading: "Keeping the record, and the usual mistake",
          paragraphs: [
            "Keep the record in the organisation's own systems, and apply the same data protection care as any other training record. Names belong in the system where access is controlled. Summaries for a board or a works council use roles and numbers of people, not names.",
            "The usual mistake is to finish a good record with one sentence that undoes it. After six lines of careful evidence, someone adds that the team is now fully compliant, and the whole record reads as a sales document. Stop at the last fact.",
          ],
        },
      ],
      workedExample: {
        title: "A draft record for the recruitment team",
        inputLabel: "The trainer's notes from the session",
        outputLabel: "The draft record",
        prompt:
          "Ranking feature session, 14 May, all seven recruiters there. Everyone did the five anonymised applications and logged an override with a reason. Next version of the feature due in the autumn.",
        output:
          "Recruitment team, row 2 of the role map. Session on the applicant ranking feature, delivered on 14 May. Seven of seven recruiters attended. Each reviewed five anonymised applications and recorded an override with a reason. Next review when the vendor releases the next version, or by November at the latest. Record held by the head of talent. The recruitment team is now fully AI Act compliant.",
        reading: [
          "The first line ties the record to a role and a row of the map, so a reader can see which intention this measure fulfils. That is evidence of a measure.",
          "The session, the date, the attendance, and the work each recruiter did are all facts from the trainer's notes. Each is evidence of a measure.",
          "The review and the record holder come from the map and the notes, and they are evidence of a measure too.",
          "The last line is a claim the record cannot support. The session shows that a measure was taken, and it cannot show that anyone is compliant. The rest of the record is stronger without it.",
        ],
      },
      practice: {
        intro:
          "Here are three lines from the worked record. Mark each one with the two labels from the lesson. The reading above is still there if you want to check.",
        check: {
          kind: "mark",
          prompt: "Mark each line as Evidence of a measure or A claim the record cannot support.",
          passLabel: EVIDENCE,
          failLabel: UNSUPPORTED,
          sentences: [
            {
              id: "attended",
              text: "Seven of seven recruiters attended.",
              fail: false,
              why: "Attendance is a fact the organisation can show, so it is evidence of a measure.",
            },
            {
              id: "compliant",
              text: "The recruitment team is now fully AI Act compliant.",
              fail: true,
              why: "A session cannot show that anyone is compliant, so this is a claim the record cannot support.",
            },
            {
              id: "override",
              text: "Each reviewed five anonymised applications and recorded an override with a reason.",
              fail: false,
              why: "This records work each recruiter did in the session, so it is evidence of a measure.",
            },
          ],
          why: "That is right. Attendance and the work in the session are evidence of a measure, and the claim of compliance is something the record cannot support.",
        },
      },
      check: {
        kind: "mark",
        prompt: "Mark each line of this draft record as Evidence of a measure or A claim the record cannot support.",
        passLabel: EVIDENCE,
        failLabel: UNSUPPORTED,
        sentences: [
          {
            id: "row",
            text: "Line managers in the operations division, row 4 of the role map.",
            fail: false,
            why: "This line only says whom the record is about and which row it belongs to. That is evidence of a measure.",
          },
          {
            id: "session",
            text: "A practical session on checking drafts from the writing assistant, delivered on 2 June.",
            fail: false,
            why: "A session and a date are facts the organisation can show, so this is evidence of a measure.",
          },
          {
            id: "literate",
            text: "All participants are now AI literate.",
            fail: true,
            why: "Literate in what, and for which system? A session shows what people did on one day with one tool, and it cannot prove literacy in every context. Write what they did instead.",
          },
          {
            id: "date",
            text: "Each participant corrected an invented date in a sample draft during the session.",
            fail: false,
            why: "This records a specific piece of work each person did in the session, so it is evidence of a measure.",
          },
          {
            id: "approved",
            text: "This approach has been approved by the EU AI Office.",
            fail: true,
            why: "Nothing in the record shows any approval by a regulator, and the course gives no basis for saying so. Remove claims about regulators.",
          },
        ],
        why: "You kept the lines that state what was provided, to whom, and when, and you rejected the claims of literacy and approval, which no attendance list or piece of work could prove.",
      },
      bridge:
        "You now have the two halves of the artefact. The next lesson teaches the sentence that sits above them and says what they do not claim.",
    },
    {
      id: "what-you-will-not-claim",
      title: "What you will not claim",
      emphasis: "claim",
      place:
        "This is the fifth of seven lessons. You can build a role map and a record. This lesson teaches you to write the statement that goes with them, which says plainly what the work shows and what it does not.",
      sections: [
        {
          heading: "Overclaiming is the common harm",
          paragraphs: [
            "The most common harm in this area is a record that overclaims. A missing record is a gap someone can fill, whereas an overclaiming one misleads the people who read it. When a slide, a policy, or an intranet page says that the organisation is compliant with Article 4, it invites a question nobody inside the organisation can answer with certainty. It also tends to stop the work, because a box that has been ticked does not get reviewed.",
            "HR and L&D teams are often asked to supply this sentence by colleagues who want reassurance. The job is to give them an accurate sentence instead, one that describes the measures and can be defended if anyone asks what it rests on.",
          ],
        },
        {
          heading: "Verbs of action, not words of status",
          paragraphs: [
            "The statement uses verbs that describe action: we identified these roles, we provided these measures on these dates, and we will review them on this date. Every one of those verbs points to something in the map or the record.",
            "It avoids words that describe a legal status, such as compliant, certified, accredited, approved, or meets the requirements. A status is a conclusion someone else would have to reach, and a role map and a record cannot reach it for you.",
          ],
          beforeAfter: {
            before: "Following our AI literacy programme, Thornbury Care is fully compliant with Article 4 of the EU AI Act.",
            after:
              "Thornbury Care has identified the roles that use AI systems, provided a measure for each, and recorded who took part and when. This is evidence of the measures we took. It is not a statement that we comply with the EU AI Act.",
            reading:
              "The first version claims a status that no programme can confer. The second describes three actions the map and the record can show, and it says in plain words what the work is not.",
          },
        },
        {
          heading: "Two labels for a sentence of the statement",
          paragraphs: [
            "Judge each sentence of a statement with one of two labels. A sentence Describes what was done when it states an action the organisation took, a date, a plan to review, or where to take a question. A sentence that says what the work is not, such as 'this is not a statement that we comply with the Act', also describes what was done, because it limits the claim to the evidence.",
            "A sentence Claims a legal status when it says or implies that the organisation, a team, or a person is compliant, certified, approved, or meets the requirements of the Act. It also claims a legal status when it says a regulator or an outside body has endorsed the approach and the organisation has no document to show it.",
          ],
        },
        {
          heading: "Who answers the legal question",
          paragraphs: [
            "The statement also says who to ask about whether and how the Act applies. That is the organisation's legal adviser, whether that is an in-house legal team or an outside firm. HR can prepare the evidence of measures, but it should not be the team that decides the legal position.",
            "The reason for writing it this way is accuracy. An accurate statement is the one a professional can defend when a director, a works council, or a customer asks what the work shows.",
          ],
        },
      ],
      workedExample: {
        title: "Rewriting a headline for the intranet",
        inputLabel: "The draft from the communications team",
        outputLabel: "The statement the L&D lead wrote instead",
        prompt:
          "Great news: every colleague has now completed AI literacy training, and Harlow Mutual is officially EU AI Act compliant.",
        output:
          "This role map and record outline describe the AI literacy measures we have planned and taken for staff who use AI systems on our behalf. They are evidence of measures and of when we took them. They are not a statement that we comply with the EU AI Act, and they have not been reviewed by any regulator. Questions about whether and how the Act applies to us go to our legal team. We will review the map every six months and whenever a system or its use changes.",
        reading: [
          "The draft claims that every colleague completed training, which the record may not show, because the measures were for the roles that use AI systems. It then claims a legal status, officially compliant, that nothing in the work can support.",
          "The first two sentences of the rewrite describe what was done and point to the map and the record, so every word can be checked.",
          "The third sentence says what the work is not, which is the only safe thing to say about compliance in a document like this. It also rules out any suggestion that a regulator has looked at it.",
          "The last two sentences say who answers the legal question and when the work will be reviewed, so a reader knows where to go and that the map will not go out of date.",
        ],
      },
      practice: {
        intro:
          "Here are two sentences for the top of an intranet page about AI literacy. Choose the one you would publish, using the two labels from the lesson.",
        check: {
          kind: "choose",
          prompt: "Choose the sentence you would publish at the top of the intranet page.",
          leftLabel: "Sentence A",
          left: "Kestrel Logistics meets the AI literacy requirements of the EU AI Act.",
          rightLabel: "Sentence B",
          right:
            "Kestrel Logistics has mapped the roles that use AI systems and provided a measure for each, and this page records what we did and when.",
          correct: "right",
          why: "Sentence B describes what was done, mapping the roles and providing the measures, and points to the record. Sentence A claims a legal status, meeting the requirements, that the map and the record cannot show.",
          wrong:
            "Look again at Sentence A. 'Meets the requirements' is a claim of legal status, and nothing on the page can prove it. Sentence B describes the actions the organisation took.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "This draft statement is for a board paper at Pennine Build. Mark each sentence as Describes what was done or Claims a legal status.",
        passLabel: ACTION,
        failLabel: STATUS,
        sentences: [
          {
            id: "identified",
            text: "In the spring we identified the four roles that use AI systems on the company's behalf.",
            fail: false,
            why: "Identifying roles is an action the role map can show, so this describes what was done.",
          },
          {
            id: "certified",
            text: "All four roles are now certified as AI literate.",
            fail: true,
            why: "Certified is a word of status, and no session or record can certify literacy. Say what each role took part in instead.",
          },
          {
            id: "not-statement",
            text: "This paper is not a statement that the company complies with the EU AI Act.",
            fail: false,
            why: "Saying what the work is not keeps the claim within the evidence. This describes what was done, and it is the one safe sentence about compliance.",
          },
          {
            id: "meets",
            text: "Our approach meets the requirements of Article 4.",
            fail: true,
            why: "Meets the requirements is a conclusion about legal status that the paper cannot support. Describe the measures and the dates instead.",
          },
          {
            id: "legal",
            text: "Questions about how the Act applies to us should go to the company solicitor.",
            fail: false,
            why: "Naming who answers the legal question is part of an accurate statement, so this describes what was done.",
          },
        ],
        why: "You kept the sentences that describe actions, a limit on the claim, and who answers the legal question, and you rejected certified and meets the requirements, which claim a status the paper cannot show.",
      },
      bridge:
        "You have now practised every move in the course. The next lesson brings them together and assesses them on situations you have not seen, before you write your own role map and record outline.",
    },
    {
      id: "course-assessment",
      title: "Course assessment",
      emphasis: "assessment",
      place:
        "This is the sixth of seven lessons. It recaps the method from the first five lessons, works one mixed example, and then assesses the whole method on situations you have not seen, before the final lesson asks you to write your own role map and record outline.",
      sections: [
        {
          heading: "Reading the Article and weighing the context",
          paragraphs: [
            "Article 4 places a duty on providers and deployers of AI systems to take measures to ensure a sufficient level of AI literacy among their staff and other persons dealing with those systems on their behalf. The measures should take into account the people's knowledge, experience, education, and training, the context of use, and the people on whom the systems are used. A claim is In the text when those words support it, and Not in the text when it adds an exam, a certificate, a number of hours, or a promise of compliance.",
            "The context sets the level. Ask what the system is used for, who is affected by its output, and what the person already knows. In HR the heaviest measures belong where the output is used on applicants and employees, because the Act treats many employment uses as high-risk. A sufficient measure names the system, what it does, where it fails, what the person must do when they disagree with it, and how they record what they did.",
          ],
        },
        {
          heading: "The map, the record, and the statement",
          paragraphs: [
            "A role map has one row for each role that uses an AI system, with seven parts: the role, the system and use, who is affected, what they must be able to do, the measure, the owner, and the review date. What they must be able to do begins with a verb and names a task someone could watch. The measure is more specific than the word training.",
            "A record shows, for each measure, who took part, the row of the map, what the measure was, the date, what the person did where there was a check, the next review, and who holds the record. A line is Evidence of a measure when it states a fact about what was provided, to whom, and when. It is A claim the record cannot support when it says a person is literate in general, that anyone is compliant, or that a regulator approved the approach.",
            "The statement uses verbs of action and avoids words of status. It says the work is not a statement of compliance with the EU AI Act, and it says who answers questions about how the Act applies, which is the organisation's legal adviser.",
          ],
        },
        {
          heading: "How the assessment works",
          paragraphs: [
            "The assessment sets seven situations from HR and L&D work that you have not yet seen. Each question has one right answer, and each draws on one or more of the moves above. You need six of the seven to pass.",
            "After you submit, each question shows whether your choice was right and the feedback for the option you chose. If you do not reach six, read the feedback for each question you missed, return to the lesson it points to, and try again.",
          ],
        },
      ],
      workedExample: {
        title: "One request, handled with every move",
        inputLabel: "The request from the operations director",
        outputLabel: "The reply the HR business partner sent",
        prompt:
          "Our new shift planning tool uses AI to suggest rotas. The supplier says their online course will make us Article 4 compliant. Can you buy it for all 300 warehouse staff and confirm to the board that we are covered?",
        output:
          "The Article asks us to take measures that fit the people and the context, and it does not say that any course makes us compliant, so I cannot confirm that to the board. The people who use the tool are the eight shift supervisors, and its output is used on the warehouse staff whose rotas it suggests. I will add a row for shift supervisors to our role map, with a session on how the tool builds a rota and how to change a suggestion that is unfair, owned by the operations training lead and reviewed when the supplier updates the tool. I will record who attended and what they practised. Questions about how the Act applies to us should go to our legal team.",
        reading: [
          "The HR business partner first reads the supplier's claim against the text. The claim that a course makes the company compliant is Not in the text, so it is declined plainly.",
          "Next they weigh the context. The people who use the tool are the supervisors, not all 300 staff, and the people affected are the staff whose rotas it suggests. The measure goes where the decision is made.",
          "The new row has a role, a system and use, the people affected, a task the supervisors must be able to do, a specific measure, an owner, and a review trigger. The record will show attendance and practice, which is evidence of a measure.",
          "The reply ends by sending the legal question to the legal team, and nowhere does it claim a status the work cannot show.",
        ],
      },
      practice: {
        intro:
          "Before the assessment, choose the sentence the HR business partner should send to the board. The worked example and the recap above are still there.",
        check: {
          kind: "choose",
          prompt: "Choose the sentence for the board paper about the shift planning tool.",
          leftLabel: "Sentence A",
          left: "We have added the shift supervisors to our AI literacy role map and will record their session on the planning tool, including the date and what each supervisor practised.",
          rightLabel: "Sentence B",
          right: "With the supplier's course in place, the board can be assured that the warehouse is covered under Article 4.",
          correct: "left",
          why: "Sentence A describes what was done and what will be recorded, which the map and the record can show. Sentence B offers an assurance of legal status that no course can give.",
          wrong:
            "Look again at Sentence B. 'Covered under Article 4' is a claim of legal status, and the supplier's course cannot support it. Sentence A describes the measure and the record.",
        },
      },
      check: {
        kind: "scenario",
        prompt:
          "Read each situation and choose what you would do. Each question has one right answer, and you need six of the seven to pass.",
        passMark: 6,
        questions: [
          {
            id: "vendor",
            situation:
              "Aisha Rahman is the L&D manager at Colbeck Insurance. A training supplier sends her a proposal that says Article 4 requires every employee to pass an annual AI literacy test, and that its platform issues a certificate proving compliance. Her HR director asks whether they should sign up.",
            question: "What should Aisha tell her HR director?",
            options: [
              {
                id: "a",
                text: "Sign up, because a certificate for every employee is the safest way to show the organisation has met the Act.",
                feedback:
                  "The certificate and the annual test are not in the text, and no certificate proves compliance. Signing up on that basis commits the organisation to a requirement the law never set. Read the proposal against the Article first.",
              },
              {
                id: "b",
                text: "Sign up for the recruiters only, since they are the ones using a high-risk system.",
                feedback:
                  "Targeting the recruiters is closer to the context, but the decision still rests on the supplier's claims about testing and certification, which are not in the text. Correct the reading first, then choose measures from the role map.",
              },
              {
                id: "c",
                text: "Explain that the test and the certificate are not in the text of Article 4, and propose mapping which roles use which systems before choosing any measure.",
                correct: true,
                feedback:
                  "That is the reading the course teaches. You checked each claim against the Article, rejected the ones it does not contain, and proposed the role map as the basis for any purchase.",
              },
              {
                id: "d",
                text: "Decline the proposal and tell the HR director that Article 4 does not require any training at all.",
                feedback:
                  "The Article does require measures to ensure a sufficient level of AI literacy. Saying nothing is needed is as inaccurate as the supplier's claim. The better reply corrects the claims and proposes the role map.",
              },
            ],
          },
          {
            id: "agency",
            situation:
              "Tom Beckett is an HR business partner at Marlow Retail. The stores use agency workers, supplied by an outside agency, who use an AI scheduling tool to swap and confirm shifts on the company's behalf. Tom's draft role map covers only employees.",
            question: "What should Tom do about the agency workers?",
            options: [
              {
                id: "a",
                text: "Add a row for agency workers who use the scheduling tool, because the Article covers other persons using AI systems on the organisation's behalf.",
                correct: true,
                feedback:
                  "Right. The Article is not limited to employees, and the agency workers use the tool on the company's behalf. They belong on the map with a measure that fits their use.",
              },
              {
                id: "b",
                text: "Leave them off, because the agency is their employer and their training is the agency's concern.",
                feedback:
                  "The Article covers persons dealing with AI systems on the organisation's behalf, which can include agency workers. Leaving them off the map leaves a gap in the reasoning. Add a row for them.",
              },
              {
                id: "c",
                text: "Add every agency worker in every store, including those who never use the tool, so that no one is missed.",
                feedback:
                  "The duty reaches the people who deal with the operation and use of AI systems, not everyone on site. A row for agency workers who use the tool fits the text and keeps the measure focused.",
              },
            ],
          },
          {
            id: "context",
            situation:
              "Grace Adeyemi leads L&D at Southgate Councils Partnership. Two teams have started using AI. The events team uses a chat assistant to draft invitations for internal away days. The employee relations team uses a feature that summarises grievance case notes before a manager decides what happens next.",
            question: "Where should Grace put the heavier measure?",
            options: [
              {
                id: "a",
                text: "The events team, because they use the tool more often and send more of what it writes.",
                feedback:
                  "How often a tool is used matters less than who is affected. An invitation to an away day affects no one's employment, while a grievance summary shapes a decision about an employee. The heavier measure belongs with employee relations.",
              },
              {
                id: "b",
                text: "Both teams equally, because the Article asks for the same level of literacy for everyone.",
                feedback:
                  "The Article asks the organisation to take the context and the people affected into account, so the level differs by role. Here the grievance summaries affect employees directly.",
              },
              {
                id: "c",
                text: "Neither team for now, until the organisation has a full inventory of every AI tool in use.",
                feedback:
                  "Waiting for a full inventory leaves the grievance summaries without any measure while decisions are being made. Start with the roles you know about and add rows as the inventory grows.",
              },
              {
                id: "d",
                text: "The employee relations team, because the summaries are used on employees in a decision about their case.",
                correct: true,
                feedback:
                  "Right. The context and the people affected set the level, and a grievance summary feeds a decision about an employee. The measure should cover how to check a summary against the notes before the manager relies on it.",
              },
            ],
          },
          {
            id: "row",
            situation:
              "Owen Pryce is drafting the role map at Tidewell Water. His row for the recruitment team reads: 'What they must be able to do: understand AI and its limitations.' His manager says the row looks fine.",
            question: "How should Owen change that part of the row?",
            options: [
              {
                id: "a",
                text: "Leave it, because understanding AI is the aim of AI literacy and the Article uses similar words.",
                feedback:
                  "Understanding cannot be watched or checked, so nobody can design a session or a record around it. Rewrite it as a task that begins with a verb, such as reviewing a low-ranked application.",
              },
              {
                id: "b",
                text: "Rewrite it as work someone could watch, such as 'review an application the ranking placed low and record the reason for any override'.",
                correct: true,
                feedback:
                  "Right. The part now begins with a verb and names a task, which tells whoever designs the measure what the check should test and gives the record something to show.",
              },
              {
                id: "c",
                text: "Make it more thorough by listing every limitation of AI the team should understand.",
                feedback:
                  "A longer list of things to understand is still a state of mind, not work. What the row needs is a task the recruiter does, written so that someone could watch it.",
              },
            ],
          },
          {
            id: "record",
            situation:
              "Nadia Kowalski keeps the AI literacy record at Brackley Foods. After a session for line managers on the writing assistant, the trainer sends her a summary to paste in. It ends: 'All 40 managers are now AI literate and the division is compliant.'",
            question: "What should Nadia do with the last sentence?",
            options: [
              {
                id: "a",
                text: "Keep it, because the trainer ran the session and is best placed to judge the outcome.",
                feedback:
                  "The trainer can say what happened in the session, but no session can prove general literacy or compliance. Keeping the sentence turns a record of evidence into a claim it cannot support.",
              },
              {
                id: "b",
                text: "Change it to 'most managers are now AI literate', which is more cautious.",
                feedback:
                  "A cautious claim of literacy is still a claim the record cannot support. Replace it with what the managers did in the session and when the row will be reviewed.",
              },
              {
                id: "c",
                text: "Replace it with what the managers did in the session, such as correcting an invented figure in a sample draft, and the date of the next review.",
                correct: true,
                feedback:
                  "Right. Work each person did and a review date are evidence of a measure, and the claims of literacy and compliance are gone. The record is now something you can defend.",
              },
              {
                id: "d",
                text: "Delete the whole summary, because a record written by a trainer cannot be trusted.",
                feedback:
                  "Most of the trainer's summary is useful evidence of what was provided and to whom. Remove the one sentence that claims a status, and keep the facts.",
              },
            ],
          },
          {
            id: "statement",
            situation:
              "Chris Oduya in internal communications at Fernley Group sends HR a draft intranet banner: 'Fernley is now fully compliant with the EU AI Act's AI literacy rules.' He says staff want reassurance and asks HR to approve it by the end of the day.",
            question: "What should HR send back?",
            options: [
              {
                id: "a",
                text: "A banner that says Fernley has mapped the roles that use AI systems, provided a measure for each, and will review them, with a note that questions about the Act go to the legal team.",
                correct: true,
                feedback:
                  "Right. The banner now uses verbs of action that the map and the record can show, and it sends the legal question to the people who answer it. Staff are reassured by something true.",
              },
              {
                id: "b",
                text: "Approval, with 'fully' removed so the banner reads 'Fernley is compliant with the EU AI Act's AI literacy rules.'",
                feedback:
                  "Removing one word still leaves a claim of legal status that nothing in the work can show. Replace the status with the actions the organisation took.",
              },
              {
                id: "c",
                text: "Approval, as long as the banner links to the role map so that anyone can check it.",
                feedback:
                  "A link to the evidence does not make a claim of compliance accurate. The map shows measures, not a legal status. Rewrite the banner to describe what was done.",
              },
            ],
          },
          {
            id: "scope",
            situation:
              "Helen Marsh is head of people at Carrow Analytics, a company based in Manchester with clients in Germany and the Netherlands. The finance director asks her to confirm, in writing, whether the EU AI Act applies to the company at all before any work on a role map begins.",
            question: "How should Helen answer?",
            options: [
              {
                id: "a",
                text: "Confirm that it does not apply, because the company is based in the United Kingdom.",
                feedback:
                  "Whether the Act applies depends on the scope rules in Article 2, and being based in the United Kingdom does not settle that on its own. HR should not give that answer in writing. Send the question to the legal adviser.",
              },
              {
                id: "b",
                text: "Say that whether and how the Act applies is a question for the company's legal adviser, and offer to prepare the role map as evidence of measures in the meantime.",
                correct: true,
                feedback:
                  "Right. The scope question belongs with the legal adviser, and the role map is useful work whatever the answer, because it shows which roles use AI and what the organisation provides for them.",
              },
              {
                id: "c",
                text: "Confirm that it applies, because the company has European clients, and start the role map straight away.",
                feedback:
                  "Having European clients may be relevant, but the scope rules are for the legal adviser to apply. Confirming the position in writing puts HR in the place of the lawyers. Refer the question and prepare the evidence.",
              },
              {
                id: "d",
                text: "Decline to start any work until the legal position is settled, because a role map might be wasted effort.",
                feedback:
                  "The legal question should go to the legal adviser, but a role map is not wasted whatever the answer. It shows which roles use AI and what each needs, which is good practice in any case.",
              },
            ],
          },
        ],
        why: "You read the Article accurately, weighed the context, kept the map and the record to evidence, and refused to claim a status the work cannot show.",
      },
      bridge:
        "You have passed the assessment. In the final lesson you will write your own role map, record outline, and statement, which become the work on your signed record.",
    },
    {
      id: "your-role-map-and-record",
      title: "Your role map and record outline",
      emphasis: "map",
      place:
        "This is the last of seven lessons. You will write the artefact that appears on your signed record: three rows of a role map for your own organisation, the outline of the record that will show the measures, a statement of what the work does not claim, and who answers questions about the Act.",
      sections: [
        {
          heading: "What you are writing",
          paragraphs: [
            "The artefact has four parts. The first is three rows of a role map, each with the seven parts from the third lesson. The second is a record outline, listing what your record will hold for each measure. The third is a short statement of what the work does not claim. The fourth names the role in your organisation that answers questions about whether and how the Act applies.",
            "Write for your own organisation, using roles and systems you know about. If you are not sure which systems a role uses, write the row you believe is right and add the question to your review date. Do not name individuals, and do not include an email address or a telephone number, because the record will be visible to anyone you share the reference with.",
          ],
        },
        {
          heading: "Rows that hold up",
          paragraphs: [
            "Each row should name the role, the system and what it is used for, who is affected, what the person must be able to do, the measure, the owner, and the review date. Give the review as a month or a number of months, so that someone can tell when it is due. At least one of your rows should name people affected who are not the users themselves, such as applicants or employees.",
            "Make the measure more specific than the word training. Name the session, the guide, the practice, or the change to the process, and say what it covers. Begin what they must be able to do with a verb and a task someone could watch.",
          ],
        },
        {
          heading: "The outline and the statement",
          paragraphs: [
            "The record outline lists the fields your record will hold for each measure: who took part, the row of the map, the measure, the date, what the person did where there was a check, the next review, and who holds the record. You are describing the columns, not filling them in.",
            "The statement uses verbs of action. It says that the work is evidence of measures, that it is not a statement of compliance with the EU AI Act, and when it will be reviewed. Words such as compliant, certified, accredited, or approved by should appear only in the sentence that says what the work is not.",
          ],
        },
        {
          heading: "Two labels for a draft artefact",
          paragraphs: [
            "Before you write, read one draft with two labels. A part is Ready for the record when a stranger could read it and see what the organisation did or will do, for whom, and when. A part Needs another look when it names no task, no people affected, no date, or when it claims a status the work cannot show.",
            "The same labels are the ones to use on your own draft before you press Continue. If any part needs another look, fix it now, because the words you write here are the words a verifier will read.",
          ],
        },
      ],
      workedExample: {
        title: "An artefact from a housing association",
        inputLabel: "The L&D lead's working notes",
        outputLabel: "The artefact she signed",
        prompt:
          "Housing officers use the tenancy tool's AI summaries of repair complaints. Recruiters use the ranking feature. Line managers use the writing assistant. Legal questions go to the company secretary's team.",
        output:
          "Row one. Role: housing officers. System and use: the AI summaries in the tenancy system, used to summarise repair complaints before a visit is booked. Who is affected: tenants. What they must be able to do: check a summary against the original complaint and correct it before booking. Measure: a one-hour session with practice on three anonymised complaints. Owner: head of housing services. Review date: in six months, or when the summaries change. Rows two and three follow the same shape for recruiters and line managers. Record outline: who took part, role map row, measure, date, what each person did in the check, next review, record holder. Statement: This is evidence of the measures we have planned and taken. It is not a statement of compliance with the EU AI Act. Questions about the Act: the company secretary's legal team.",
        reading: [
          "Row one names tenants as the people affected, which explains why the measure centres on checking a summary before a visit is booked.",
          "What they must be able to do begins with check and names a task, and the measure says what the session covers and how many cases are practised.",
          "The record outline lists all seven fields, and the statement uses the word compliance only to say what the work is not.",
          "The last part names a legal team by role, so a reader knows where the legal question goes.",
        ],
      },
      practice: {
        intro:
          "Here are four parts of a draft artefact. Mark each one with the two labels from the lesson. The worked artefact above is there to compare against.",
        check: {
          kind: "mark",
          prompt: "Mark each part of this draft as Ready for the record or Needs another look.",
          passLabel: READY,
          failLabel: ANOTHER_LOOK,
          sentences: [
            {
              id: "row",
              text: "Role: payroll administrators. System and use: the AI assistant in the payroll software, used to answer employee questions about payslips. Who is affected: employees. Measure: a guide on checking each answer against the payslip. Owner: payroll manager. Review date: in March.",
              fail: false,
              why: "The row names the use, the people affected, a specific measure, an owner, and a review month, so it is ready for the record.",
            },
            {
              id: "measure",
              text: "Role: recruiters. Measure: training. Review: ongoing.",
              fail: true,
              why: "Training and ongoing leave a reader asking what will be provided and when it will be reviewed, so this row needs another look.",
            },
            {
              id: "outline",
              text: "Record outline: who took part, role map row, measure, date, what each person did, next review, record holder.",
              fail: false,
              why: "The outline lists the seven fields a record holds, so it is ready for the record.",
            },
            {
              id: "statement",
              text: "Statement: we are certified as meeting Article 4.",
              fail: true,
              why: "Certified and meeting Article 4 claim a legal status, so the statement needs another look. Say it is evidence of measures and not a statement of compliance.",
            },
          ],
          why: "That is right. The payroll row and the outline are ready for the record, and the recruiters' row and the certified statement would each leave a verifier with a question or a claim the work cannot support.",
        },
      },
      check: {
        kind: "build",
        prompt:
          "Write your role map, your record outline, your statement of what they do not claim, and who answers questions about the Act, for your own organisation.",
        fields: [
          {
            id: "row-one",
            label: "Role map: first row",
            hint: "All seven parts. Name people affected who are not the users, such as applicants or employees, and give the review as a month or a number of months.",
            min: 120,
            rule: "fact",
            any: [
              "applicant",
              "candidate",
              "employee",
              "team member",
              "staff",
              "customer",
              "tenant",
              "patient",
              "client",
              "worker",
              "colleague",
              "affected",
            ],
            missing:
              "The first row needs to name the people on whom the output is used, such as applicants or employees, and a review date given as a month or a number of months.",
          },
          {
            id: "row-two",
            label: "Role map: second row",
            hint: "All seven parts. Name a measure more specific than training, and give the review as a month or a number of months.",
            min: 120,
            rule: "fact",
            any: [
              "session",
              "guide",
              "guidance",
              "practice",
              "practis",
              "workshop",
              "coaching",
              "supervis",
              "checklist",
              "briefing",
              "walkthrough",
            ],
            missing:
              "The second row needs a measure more specific than training, such as a session, a guide, or supervised practice, and a review date given as a month or a number of months.",
          },
          {
            id: "row-three",
            label: "Role map: third row",
            hint: "All seven parts. Name a measure more specific than training, and give the review as a month or a number of months.",
            min: 120,
            rule: "fact",
            any: [
              "session",
              "guide",
              "guidance",
              "practice",
              "practis",
              "workshop",
              "coaching",
              "supervis",
              "checklist",
              "briefing",
              "walkthrough",
            ],
            missing:
              "The third row needs a measure more specific than training, such as a session, a guide, or supervised practice, and a review date given as a month or a number of months.",
          },
          {
            id: "record-outline",
            label: "Record outline",
            hint: "The fields your record will hold for each measure: who took part, the row, the measure, the date, what the person did, the next review, and who holds the record.",
            min: 80,
            any: ["review"],
            missing:
              "The record outline needs to list the fields your record will hold for each measure, including when the measure will next be reviewed.",
          },
          {
            id: "not-claimed",
            label: "What this does not claim",
            hint: "Say that the work is evidence of measures and is not a statement of compliance with the EU AI Act.",
            min: 60,
            any: [
              "not a statement of compliance",
              "not a statement that",
              "not a claim of compliance",
              "not a claim that",
              "does not claim",
              "do not claim",
              "not evidence that",
              "does not show that",
            ],
            missing:
              "What this does not claim needs a sentence saying that the work is not a statement of compliance with the EU AI Act, for example 'This is not a statement that we comply with the EU AI Act.'",
          },
          {
            id: "legal-questions",
            label: "Who answers questions about the Act",
            hint: "The role or team, not a person's name, that answers questions about whether and how the Act applies.",
            min: 10,
            rule: "role",
            any: ["legal", "lawyer", "counsel", "solicitor"],
            missing:
              "Name the role or team that answers questions about whether and how the Act applies, such as the legal team or the company solicitor.",
          },
        ],
        why: "Your artefact has three rows that each name a measure or the people affected and a review date, a record outline with a review, a statement that the work is not a statement of compliance, and the legal team that answers questions about the Act. It is evidence of measures, and it claims nothing more.",
      },
      bridge:
        "Your role map and record outline are ready. Sign your name below, and the record will show this work, the course, and the date to anyone who opens the reference.",
    },
  ],
};
