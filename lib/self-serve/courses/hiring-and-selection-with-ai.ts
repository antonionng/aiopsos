/*
Course: Hiring and Selection with AI
Slug: hiring-and-selection-with-ai
For: Recruiters, talent acquisition partners, HR advisers who run recruitment, and hiring managers who
  shortlist and interview. They already run or take part in recruitment, know how their organisation
  writes a job description and person specification, and know in outline that the Equality Act 2010
  protects people from discrimination in recruitment. No legal training is assumed, and the course does
  not replace advice on whether a tool or process is lawful.
Outcome: For any step in a recruitment, the learner can say whether a model may draft it or a person must
  decide it. They can edit an AI-drafted advert so every requirement is tied to the job, tell meaningful
  human review of a shortlist from a formality, write an audit trail entry against the criteria, and ask
  a vendor the questions that matter about an AI feature.
Artefact: The selection standard, a one-page standard for one real vacancy or role family.
Record sentence: Wrote and signed a selection standard that says what a model may draft, who decides each
  judgement about candidates and what they look at, and what the audit trail records.
Lessons (id, title, move, interaction, pass rule):
  1. what-may-be-drafted, What may be drafted, separate drafting from deciding, mark,
     every step marked May be drafted or A person decides correctly.
  2. the-criteria-come-first, The criteria come first, tie each advert requirement to a criterion, edit,
     the edited advert describes phone and video sales, clear proposals in English, and client travel,
     and says in a limit sentence that a driving licence is not needed.
  3. what-a-person-decides, What a person decides, tell meaningful review from a formality, choose,
     the manager who reads the evidence against the criteria and records reasons.
  4. the-audit-trail, The audit trail, record the decision against the criteria, mark,
     every line of the trail entry labelled correctly.
  5. questions-for-an-ai-feature, Questions for an AI feature, ask a vendor what matters, choose,
     the message that asks what the feature judges, how it was tested, whether it can be explained and
     switched off, and what candidates are told.
  6. course-assessment, Course assessment, apply every move to new cases, scenario,
     six of seven situations answered correctly.
  7. the-selection-standard, The selection standard, write the standard, build,
     every part present: a named vacancy, criteria, drafted steps with a source, deciders who look at
     evidence, trail fields including evidence, AI features with questions answered or open, what
     candidates are told, and an owner with a review date.
Sources: Equality Act 2010 and the EHRC Employment Statutory Code of Practice; DSIT, Responsible AI in
  Recruitment (GOV.UK, 2024); ICO, AI tools in recruitment audit outcomes report (2024); ICO employment
  practices guidance on recruitment and selection, and ICO guidance on automated decision-making as
  amended by the Data (Use and Access) Act 2025; ICO and The Alan Turing Institute, Explaining decisions
  made with AI; CIPD factsheet on selection methods; Regulation (EU) 2024/1689, Annex III point 4 and
  Article 5(1)(f); Schmidt and Hunter (1998) and Sackett and colleagues (2022) on selection methods.
Tested on phone:          no
Tested returning learner: no
Pass rule tests written:  yes
*/

import type { CourseContent } from "./types.ts";

const DRAFTED = "May be drafted";
const DECIDES = "A person decides";
const TIED = "Tied to a criterion";
const NOT_IN = "Not in the criteria";
const MEANINGFUL = "Meaningful review";
const FORMALITY = "A formality";
const AGAINST = "Records the decision against the criteria";
const IMPRESSION = "Records an impression the criteria do not contain";
const ANSWERS = "Answers the question";
const DOES_NOT = "Does not answer the question";
const FOLLOW = "A new hiring manager could follow this";
const ASK = "A new hiring manager would have to ask";

export const COURSE: CourseContent = {
  slug: "hiring-and-selection-with-ai",
  hours: 2.5,
  artefact: {
    lessonId: "the-selection-standard",
    title: "The selection standard",
    recordLine:
      "Wrote and signed a selection standard that says what a model may draft, who decides each judgement about candidates and what they look at, and what the audit trail records.",
  },
  lessons: [
    {
      id: "what-may-be-drafted",
      title: "What may be drafted",
      emphasis: "drafted",
      place:
        "This is the first of seven lessons. It draws the line the whole course depends on, between the writing that supports a recruitment and the decisions that are made about candidates.",
      sections: [
        {
          heading: "Recruitment is full of writing",
          paragraphs: [
            "A single vacancy produces a surprising amount of text. There is the job advert, the interview questions, the email inviting candidates to a telephone screen, the scheduling message, the note explaining the benefits, and the template that tells unsuccessful applicants the outcome. Much of this writing is repetitive and follows a pattern, which is exactly the kind of work a general AI assistant does quickly and well.",
            "A step may be drafted with a model when three things are true. The output is text that a person will read and approve before it is used. It is built from criteria and material the organisation has already agreed, such as the approved person specification or the benefits policy. It does not judge any individual candidate. This course calls a step that meets all three tests May be drafted.",
          ],
        },
        {
          heading: "Where a person decides",
          paragraphs: [
            "Every step that judges a candidate belongs to a person. That includes sifting applications, scoring them, ranking them, shortlisting, rejecting, choosing whom to offer, and setting the terms of the offer. This course calls these steps A person decides. The label means that the judgement about the candidate is made by someone who has looked at the evidence and who has the authority to reach a different view from any tool.",
            "A person decides does not mean that no tool may be used near the decision. A recruiter may use a spreadsheet to hold scores, or a model to format interview notes into a table. What the label rules out is handing the judgement itself to the tool, so that the person only confirms what the tool has already concluded. Lesson three looks closely at what it takes for a person to really decide.",
          ],
        },
        {
          heading: "What the line does not mean",
          paragraphs: [
            "May be drafted does not mean the draft is fair or accurate. A model can produce an advert that asks for a recent graduate when the job has nothing to do with age, and the next lesson is about exactly that problem. The label tells you who may write the first version, and it leaves the person who approves the text responsible for everything in it.",
            "The mistake people usually make is to treat a step as drafting because the output looks like writing. A model asked to summarise each candidate's interview and recommend who should get the job produces a paragraph of text, but the recommendation is the decision. When a piece of text says which candidate is better, it is judging a candidate, whatever format it arrives in.",
          ],
          beforeAfter: {
            before: "Ask the model to read the forty applications and write a shortlist of ten with a reason for each.",
            after:
              "Read the forty applications against the four criteria and choose the ten yourself. Then ask the model to draft the invitation email to those ten from the approved template.",
            reading:
              "In the first version the model writes a shortlist, which is a judgement about every applicant. In the second version the person makes the judgement and the model drafts only the email, which a person will approve and which judges no one.",
          },
        },
        {
          heading: "Why the line matters at work",
          paragraphs: [
            "A recruitment decision changes someone's working life, and the candidate is entitled to expect that a person weighed their application. The Equality Act 2010 applies to every stage of recruitment, and UK data protection law places limits on decisions about people that are made solely by automated means. Keeping the judgement with a person is the first safeguard in both cases, and it is also the one a candidate or a tribunal will ask about first.",
            "The line also makes the work easier to organise. Once a team agrees which steps may be drafted, a recruiter can use a model freely for those steps without asking for permission each time, and a hiring manager knows which parts of the process they must give their own time to.",
          ],
        },
      ],
      workedExample: {
        title: "The steps for a finance analyst vacancy",
        inputLabel: "The steps the recruiter listed",
        outputLabel: "The steps, marked",
        prompt:
          "1. Draft the advert from the approved person specification.\n2. Write interview questions for each of the four criteria.\n3. Read the forty applications and decide which ten go to a telephone screen.\n4. Send a template rejection email to those not shortlisted.\n5. Score each interview against the criteria.\n6. Choose the preferred candidate.",
        output:
          "1. May be drafted.\n2. May be drafted.\n3. A person decides.\n4. May be drafted, and the email states no reason the person did not give.\n5. A person decides.\n6. A person decides.",
        reading: [
          "The advert and the interview questions are text a person will approve, both are built from the agreed person specification, and neither judges any applicant, so both may be drafted.",
          "Choosing which ten go forward, scoring each interview, and choosing the preferred candidate are judgements about individuals, so a person decides each of them.",
          "The rejection email is the step to read carefully. The email itself may be drafted, because the decision about who receives it was already made by a person at the sift. The draft must not state a reason for rejection that the person did not give, because the model would be inventing a judgement.",
        ],
      },
      practice: {
        intro:
          "These three steps come from a recruitment for a school office administrator. Mark each one with the two labels you have just learned. The three tests for drafting are in the first section if you want to read them again.",
        check: {
          kind: "mark",
          prompt: "Mark each step as one that may be drafted or one where a person decides.",
          passLabel: DRAFTED,
          failLabel: DECIDES,
          sentences: [
            {
              id: "questions",
              text: "Write three interview questions for the criterion 'keeps accurate pupil attendance records'.",
              fail: false,
              why: "Questions tied to an agreed criterion are text a person will approve, and they judge no candidate, so this step may be drafted.",
            },
            {
              id: "sift",
              text: "Decide which of the twenty-two applicants meet the essential criteria.",
              fail: true,
              why: "Deciding who meets the essential criteria is a judgement about each applicant, so a person decides.",
            },
            {
              id: "schedule",
              text: "Write the message offering interview slots to the four people the head teacher shortlisted.",
              fail: false,
              why: "The head teacher has already decided the shortlist, and the message is text a person will approve, so it may be drafted.",
            },
          ],
          why: "That is right. The questions and the scheduling message may be drafted, and the judgement about who meets the essential criteria stays with a person.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "These steps come from a recruitment for a warehouse team leader at Pennine Parcels. Mark each step as one that may be drafted or one where a person decides.",
        passLabel: DRAFTED,
        failLabel: DECIDES,
        sentences: [
          {
            id: "advert",
            text: "Turn the approved person specification into a job advert.",
            fail: false,
            why: "The advert judges no candidate. A person will approve it and it is built from agreed criteria, so it may be drafted, although you still read it for excluding wording.",
          },
          {
            id: "ranking",
            text: "Use the ranking in the applicant tracking system to decide who is rejected at the first sift.",
            fail: true,
            why: "Rejecting applicants judges each of them, so a person decides, whatever the ranking says.",
          },
          {
            id: "rota",
            text: "Write two interview questions for the criterion 'plans a shift rota that covers peak demand'.",
            fail: false,
            why: "Questions tied to an agreed criterion are text a person will approve, and they judge no one, so they may be drafted.",
          },
          {
            id: "recommend",
            text: "Summarise each candidate's interview and recommend who should get the job.",
            fail: true,
            why: "A recommendation about who gets the job is a judgement about the candidates, even though it arrives as a paragraph of text, so a person decides.",
          },
          {
            id: "invite",
            text: "Draft the email inviting shortlisted candidates to an assessment day.",
            fail: false,
            why: "A person has already decided who is shortlisted, and the invitation is text you will approve, so it may be drafted.",
          },
        ],
        why: "You kept every judgement about a candidate with a person and let the model draft only text you will approve. The ranking and the recommendation both judge individuals, and those are the two steps a tribunal or a candidate would ask about first.",
      },
      bridge:
        "The first thing a model usually drafts is the advert, and the next lesson shows how an advert can shut people out before anyone applies.",
    },
    {
      id: "the-criteria-come-first",
      title: "The criteria come first",
      emphasis: "criteria",
      place:
        "This is the second of seven lessons. You can now separate drafting from deciding, and this lesson looks at the most common draft in recruitment, the job advert, and at what can go wrong in it.",
      sections: [
        {
          heading: "An advert is only as fair as its criteria",
          paragraphs: [
            "The criteria for a vacancy are the statements of what the job involves and what a person needs to do it, usually set out in the person specification. A criterion describes work, such as 'answers customer queries by phone and chat in clear English' or 'plans a shift rota that covers peak demand'. Every requirement in a fair advert can be traced back to one of those statements.",
            "When a model is asked to write an advert with little information, it draws on the patterns in the many adverts it learned from. Those patterns include wording that has nothing to do with the job, such as 'young and energetic team', 'digital native', 'native English speaker', 'recent graduate', or a requirement to drive when the job involves no driving. The model is not choosing to exclude anyone. It is writing what adverts of that kind have often said.",
          ],
        },
        {
          heading: "Why this wording matters",
          paragraphs: [
            "Under the Equality Act 2010, wording like this can amount to direct or indirect discrimination, because it may put people with a protected characteristic, such as age, race, sex, or disability, at a disadvantage without a justification linked to the job. 'Recent graduate' and 'digital native' point to age. 'Native English' may disadvantage people because of their national origin, when the job needs only clear English. A driving licence that the job does not need can disadvantage some disabled applicants, and a phrase about family commitments can disadvantage people with caring responsibilities, who are more often women.",
            "This lesson is not a course in equality law, and it does not tell you whether a particular advert is lawful. The Equality and Human Rights Commission's Employment Statutory Code of Practice is the place to read the detail. What the lesson teaches is one move that prevents most of the problem: write the criteria first, give them to the model as its only source for requirements, and then read the draft so that each requirement is tied to a criterion or removed.",
          ],
        },
        {
          heading: "Two labels for each requirement",
          paragraphs: [
            "When you read a drafted advert, give each requirement one of two labels. A requirement is Tied to a criterion when you can point to the line of the person specification it comes from, even if the wording differs. A requirement is Not in the criteria when no line of the person specification asks for it, or when it asks for something narrower or different from what the criterion says, such as native English where the criterion asks for clear English.",
            "A requirement that is Not in the criteria is either removed or rewritten as the criterion it was reaching for. 'Native English' becomes 'writes clear proposals in English'. 'Hit the ground running' becomes a plain statement of the work in the first months. Where readers might still assume a requirement the job does not have, say so in a sentence that sets a limit, such as 'You do not need a driving licence'.",
          ],
          beforeAfter: {
            before: "Write an advert for a customer support adviser.",
            after:
              "Write an advert for a customer support adviser. Use only these criteria for requirements: answers customer queries by phone and chat in clear English, uses our support system after training, and works flexible shifts between 8am and 8pm. Do not add any requirement that is not in these criteria.",
            reading:
              "The first prompt leaves the model to decide what the job needs, so it borrows requirements from other adverts. The second gives it the criteria as its only source and says it must not add others, which removes most of the excluding wording before you read the draft.",
          },
        },
        {
          heading: "The mistake people usually make",
          paragraphs: [
            "The usual mistake is to read the draft for tone rather than for requirements. An advert can sound warm, modern, and welcoming and still ask for a recent graduate. Reading for tone catches the sentences that feel wrong, whereas reading against the criteria catches the requirements that are wrong, which is the check that matters.",
            "The second mistake is to delete the excluding words and leave nothing in their place. When you remove 'native English', the advert may no longer say anything about language at all, and a candidate cannot tell what the job needs. A good edit puts the criterion back in plain words, so the advert still describes all of the job.",
          ],
        },
      ],
      workedExample: {
        title: "An advert for a customer support adviser",
        inputLabel: "The prompt and the person specification",
        outputLabel: "The advert the model drafted",
        prompt:
          "Prompt: Write an advert for a customer support adviser.\n\nThe agreed person specification: answers customer queries by phone and chat in clear English; uses the support system after training; works flexible shifts between 8am and 8pm.",
        output:
          "We are a young, dynamic team looking for a digital native with native-level English and a full driving licence. Recent graduates preferred.",
        reading: [
          "The prompt gave the model no criteria, so it wrote requirements that adverts often contain. None of them comes from the person specification.",
          "'Young' and 'recent graduates preferred' point to age and are not in the criteria. 'Digital native' is also associated with age, and the criterion is only that the adviser uses the support system after training.",
          "'Native-level English' may disadvantage people by national origin, while the criterion is clear spoken and written English. The driving licence is not linked to any part of the job and could disadvantage some disabled applicants.",
          "The corrected advert reads: 'You will answer customer queries by phone and chat in clear English, use our support system after full training, and work flexible shifts between 8am and 8pm.' Every requirement now comes from a criterion.",
        ],
      },
      practice: {
        intro:
          "Here are four requirements from a drafted advert for a payroll administrator. The criteria are shown with the question. Mark each requirement with the two labels from the section above.",
        check: {
          kind: "mark",
          prompt: "Mark each requirement from the draft advert as tied to a criterion or not in the criteria.",
          material: {
            label: "The criteria",
            text: "Processes the monthly payroll for about 300 staff accurately. Explains pay queries clearly in writing. Works from the Derby office, with no travel.",
          },
          passLabel: TIED,
          failLabel: NOT_IN,
          sentences: [
            {
              id: "payroll",
              text: "You will run the monthly payroll for around 300 colleagues and check it for accuracy.",
              fail: false,
              why: "This is the first criterion in different words, so it is tied to a criterion.",
            },
            {
              id: "graduate",
              text: "This role would suit a recent graduate.",
              fail: true,
              why: "No criterion mentions when someone qualified, and 'recent graduate' points to age, so it is not in the criteria.",
            },
            {
              id: "queries",
              text: "You will answer pay queries in clear, friendly emails.",
              fail: false,
              why: "Explaining pay queries clearly in writing is the second criterion, so this requirement is tied to it.",
            },
            {
              id: "car",
              text: "You will need your own car.",
              fail: true,
              why: "The job is office based with no travel, so a car is not in the criteria.",
            },
          ],
          why: "That is right. The payroll and the pay queries come from the criteria, and the recent graduate and the car are requirements the job never asked for.",
        },
      },
      check: {
        kind: "edit",
        prompt:
          "This advert was drafted by a model for a sales role at Tamar Software. Edit it so that every requirement is tied to one of the criteria and no wording excludes people for a reason unrelated to the job. Put the criteria back in plain words, and say plainly that a driving licence is not needed.",
        material: {
          label: "The criteria",
          text: "Sells our software to small businesses by phone and video call. Writes clear proposals in English. Travels to client sites about twice a month, by any means.",
        },
        label: "The advert you are editing",
        start:
          "Join our energetic young sales team. We need a recent graduate who can hit the ground running, with native English, a clean driving licence, and no family commitments that would get in the way of travel.",
        unchanged:
          "You have not changed the advert yet. Remove the wording that points to age, origin, family, or a licence, and describe the work from the criteria instead.",
        keep: [
          {
            id: "selling",
            any: ["phone", "video"],
            missing:
              "The advert does not yet describe the selling. Add the criterion that the role sells to small businesses by phone and video call.",
          },
          {
            id: "proposals",
            any: ["proposal"],
            missing:
              "The advert does not yet mention proposals. The criterion is clear proposals in English, and native English can exclude people by national origin, so describe the proposals instead.",
          },
          {
            id: "clear",
            any: ["clear"],
            missing:
              "The advert does not yet say what standard of English the job needs. The criterion asks for clear English, so say that in place of native English.",
          },
          {
            id: "travel",
            any: ["client site", "twice a month", "any means"],
            missing:
              "The advert no longer describes the travel. Say that the role visits client sites about twice a month, by any means, in place of the wording about family commitments.",
          },
        ],
        limits: [
          {
            id: "licence",
            any: ["licence", "driving", "drive", "car"],
            missing:
              "The criteria allow travel by any means, so a licence is not needed for the job. Add a sentence such as 'You do not need a driving licence', because readers of the original advert would still assume one.",
          },
        ],
        why: "Every requirement in your advert now comes from the criteria. The selling, the proposals in clear English, and the travel are all described, and you have said plainly that no licence is needed, so the wording that pointed to age, origin, family, or a licence has nothing left to stand on.",
        result: {
          label: "An advert that meets the criteria",
          text: "You will sell our software to small businesses by phone and video call, and write clear proposals in English. You will visit client sites about twice a month, travelling by any means that suits you. You do not need a driving licence.",
        },
      },
      bridge:
        "Once the applications arrive, the decisions begin, and the next lesson describes what it takes for a person to really make them.",
    },
    {
      id: "what-a-person-decides",
      title: "What a person decides",
      emphasis: "decides",
      place:
        "This is the third of seven lessons. The advert is tied to the criteria and the applications are in. This lesson teaches what meaningful human review of a sift or a shortlist looks like.",
      sections: [
        {
          heading: "A signature is not a decision",
          paragraphs: [
            "Lesson one said that a person decides every judgement about a candidate. That is not enough on its own, because a person can take part in a decision without deciding anything. A hiring manager who exports the top twenty names from a ranked list and clicks approve has signed the shortlist, but the tool made it. Nobody looked at the applications that were left out.",
            "UK data protection law places limits on decisions about people that are based solely on automated processing and have legal or similarly significant effects, and a decision about whether someone gets a job can be one of them. The rules on automated decision-making were amended by the Data (Use and Access) Act 2025, so read the ICO's current guidance rather than older summaries. Whatever the exact rules say for your case, a review that only approves the tool's output is unlikely to count as a person deciding.",
          ],
        },
        {
          heading: "Four features of meaningful review",
          paragraphs: [
            "Meaningful review has four features. The reviewer looks at the candidate's evidence, which means the application, the CV, or the interview answers, and not only the tool's score. The reviewer judges that evidence against the published criteria. The reviewer has the authority and the time to reach a different conclusion from the tool, and sometimes does. The reviewer records the reason for each decision in the terms of the criteria.",
            "This lesson calls review with all four features Meaningful review. It calls review that lacks them A formality: a person approves a ranked list, a threshold, or a recommendation they have not tested against the evidence. A formality is not a safeguard, even though a human took part, because the person could not have disagreed with the tool.",
          ],
        },
        {
          heading: "What meaningful review is not",
          paragraphs: [
            "Meaningful review does not mean ignoring the tool. A recruiter may use a ranking to decide which applications to read first, or compare their own scores with the tool's score to find cases worth a second look. The review is meaningful because the person's judgement, formed from the evidence, is what decides the outcome.",
            "Nor does it mean reading every application in the same depth. A reviewer who reads each application against the essential criteria and gives more time to the borderline cases is reviewing meaningfully. What matters is that no applicant is rejected on the strength of a score that nobody checked against their evidence.",
          ],
        },
        {
          heading: "Why it matters, and the usual mistake",
          paragraphs: [
            "Research on selection methods, such as Frank Schmidt and John Hunter's 1998 review and the re-examination of that work by Paul Sackett and colleagues in 2022, found that structured judgement against criteria, such as a structured interview, is among the better predictors of how people perform in a job. Meaningful review is that structured judgement applied at the sift. It is fairer to candidates, and it is also more likely to find the person who can do the work.",
            "The usual mistake is time. A hiring manager is given two hundred applications and an afternoon, so the ranked list becomes the decision. If the time available cannot support meaningful review, the answer is to change the process, for example by asking the recruiter to read every application against the essential criteria first, and not to sign a list that nobody read.",
          ],
        },
      ],
      workedExample: {
        title: "Two sifts with the same ranking feature",
        inputLabel: "How the two recruiters ran the sift",
        outputLabel: "What each sift produced",
        prompt:
          "Both recruiters at Hartley Logistics have two hundred applications for a transport planner and the same ranking feature in the applicant tracking system.\n\nRecruiter one exports the top twenty by score, glances at the list, and sends the rest a rejection.\n\nRecruiter two reads every application in the bottom half that appears to meet the essential criteria, checks each one against those criteria, and records a reason for each change to the list.",
        output:
          "Recruiter one: a shortlist of twenty, identical to the tool's top twenty.\n\nRecruiter two: a shortlist of twenty-six, including six strong candidates the tool ranked low because their job titles used unusual wording, with a reason recorded for each.",
        reading: [
          "Recruiter one's review is a formality. They could not have disagreed with the tool, because they never looked at the evidence of the one hundred and eighty people they rejected.",
          "Recruiter two's review is meaningful. They looked at the evidence, judged it against the criteria, reached a different conclusion from the tool in six cases, and recorded why.",
          "The difference is not the tool, which was the same in both cases. It is what the person looked at and whether they were in a position to disagree.",
        ],
      },
      practice: {
        intro:
          "A recruiter at Fenwick Care describes how she ran last month's sift. Mark each sentence with the two labels from the section on the four features.",
        check: {
          kind: "mark",
          prompt: "Mark each sentence as meaningful review or a formality.",
          passLabel: MEANINGFUL,
          failLabel: FORMALITY,
          sentences: [
            {
              id: "read",
              text: "I read each application against the three essential criteria before I looked at the match score.",
              fail: false,
              why: "She looked at the evidence and judged it against the criteria, which is meaningful review.",
            },
            {
              id: "threshold",
              text: "For the second round, I approved everyone the system scored above 70 without opening their applications.",
              fail: true,
              why: "Approving a threshold without reading the evidence means she could not disagree with the tool, so this is a formality.",
            },
            {
              id: "reason",
              text: "Where I rejected someone the system scored highly, I wrote down which criterion they did not meet.",
              fail: false,
              why: "She reached a different view from the tool and recorded the reason in the terms of the criteria, which is meaningful review.",
            },
          ],
          why: "That is right. Reading the evidence and recording a reason against the criteria are meaningful review, and approving a score threshold unread is a formality.",
        },
      },
      check: {
        kind: "choose",
        prompt:
          "Two hiring managers at Oakridge Housing describe their shortlisting for a lettings coordinator. Choose the one whose review is meaningful rather than a formality.",
        leftLabel: "Manager A",
        left: "The system gives each applicant a match score. I shortlist everyone over 80 and approve the list. It saves me hours, and I sign it off, so a person has made the decision.",
        rightLabel: "Manager B",
        right:
          "I read each application against the four criteria and score it myself. I then compare my scores with the system's match score, and where we disagree by a lot I read the application again. I record my score and one line per criterion for each person I shortlist or reject.",
        correct: "right",
        why: "Manager B looks at the evidence, judges it against the criteria, can reach a different view from the tool, and records the reason. That is meaningful review, and the tool's score has become a prompt for a second look rather than the decision.",
        wrong:
          "Look again at Manager A. Approving a threshold on the tool's score without reading the applications means Manager A could never disagree with the tool. Signing the list is a formality, not a review of the evidence. Manager B reads, scores, compares, and records.",
      },
      bridge:
        "A meaningful decision still needs to be written down so it can be explained, and the next lesson describes that record.",
    },
    {
      id: "the-audit-trail",
      title: "The audit trail",
      emphasis: "trail",
      place:
        "This is the fourth of seven lessons. You can now tell a real decision from a formality, and this lesson teaches you to record the decision so that it can be explained later.",
      sections: [
        {
          heading: "What an audit trail records",
          paragraphs: [
            "An audit trail for selection is the record that lets the organisation explain, later, how a decision about a candidate was reached. For each decision point, such as the sift, the telephone screen, or the final interview, it records the criteria in use, the evidence the person looked at, the decision, the reason written against the criteria, which tools were used and for what, who decided, and the date.",
            "An audit trail is not a transcript of everything said, and it is not a place for general impressions of the candidate. It is short, and every line in it does one of two jobs: it links evidence to a criterion, or it records the decision and the criterion behind it.",
          ],
        },
        {
          heading: "Write every note as if the candidate will read it",
          paragraphs: [
            "A candidate may ask for their personal data, including notes written about them, through a subject access request. The ICO's employment practices guidance and its work on AI in recruitment both point to the value of being able to explain decisions to candidates. The practical rule that follows is simple: write every note as if the candidate will read it, because one day they may.",
            "Once a request has arrived, the notes must not be altered or deleted to keep them from the candidate. The Data Protection Act 2018 makes it an offence to change or destroy information in order to prevent it being disclosed in response to a request. The time to write a good note is when you write it, not after someone asks to see it.",
          ],
        },
        {
          heading: "Two labels for each line",
          paragraphs: [
            "Read each line of a trail entry and give it one of two labels. A line Records the decision against the criteria when it links specific evidence to a published criterion, or when it states the decision and names the criteria behind it. 'Criterion 1, plans work to deadlines: described a six-month office move with milestones. Meets.' is a line of this kind.",
            "A line Records an impression the criteria do not contain when it describes a feeling, a personal characteristic, or a judgement the criteria never asked for. 'Not a good cultural fit', 'seemed nervous', and 'the tool's score was low' are lines of this kind. An impression is not always wrong to notice, but it is not a reason, and it should not stand in the trail as one. Either turn it into evidence against a criterion or delete it.",
          ],
          beforeAfter: {
            before: "Seemed a bit old-fashioned. Would not fit the team's energy.",
            after:
              "Criterion 2, communicates progress to stakeholders: described weekly email updates, but gave no example of handling a disagreement with a stakeholder. Partly meets.",
            reading:
              "The first version records two impressions, and 'old-fashioned' may point to age. The second version names the criterion and the evidence that was missing, which is a reason the candidate could read and understand.",
          },
        },
        {
          heading: "The mistake people usually make",
          paragraphs: [
            "The usual mistake is to write the reason for the decision in the language of the impression. 'Not the right fit' feels like a reason to the person who wrote it, because it sums up their sense of the interview. To anyone else, including the candidate, it says nothing about the work, and it can hide a judgement based on age, accent, or background that the writer did not intend.",
            "The second mistake is to record the tool's score as a reason. A match score is an output of a tool, not one of the criteria. If a score helped you decide which applications to read first, record that under the tools used. The reason for the decision still has to be the evidence against the criteria.",
          ],
        },
      ],
      workedExample: {
        title: "Notes after a project coordinator interview",
        inputLabel: "The interview notes",
        outputLabel: "The notes after the manager's edit",
        prompt:
          "Criterion 1, plans work to deadlines: described a clear plan for a six-month office move, with milestones and a contingency. Meets.\nCriterion 2, communicates progress to stakeholders: gave one example, weekly email updates, but could not describe how they handled a disagreement. Partly meets.\nSeemed a bit old-fashioned.\nWould not fit the team's energy.\nDecision: not progressed, based on criterion 2.",
        output:
          "Criterion 1, plans work to deadlines: described a clear plan for a six-month office move, with milestones and a contingency. Meets.\nCriterion 2, communicates progress to stakeholders: gave one example, weekly email updates, but could not describe how they handled a disagreement. Partly meets. An example of resolving a disagreement with a stakeholder would have been needed to meet it.\nDecision: not progressed, based on criterion 2. Decided by the hiring manager and the operations lead, 14 October.",
        reading: [
          "The first two lines record the decision against the criteria, because each links evidence to a published criterion.",
          "'Seemed a bit old-fashioned' and 'would not fit the team's energy' record impressions the criteria do not contain, and the first may point to age. The manager deletes both.",
          "The decision line was sound only because criterion 2 is the reason given. The manager adds what further evidence on criterion 2 would have been needed, who decided, and the date, so the entry can be explained to the candidate as it stands.",
        ],
      },
      practice: {
        intro:
          "Before the check, choose the better rewrite of one impression from the worked example. The section on the two labels is above if you want to read it again.",
        check: {
          kind: "choose",
          prompt:
            "The note said 'Would not fit the team's energy.' Choose the rewrite that records the decision against the criteria.",
          leftLabel: "Rewrite A",
          left: "Criterion 2, communicates progress to stakeholders: described weekly email updates only, and gave no example of handling a disagreement. Partly meets.",
          rightLabel: "Rewrite B",
          right: "Might be happier in a quieter, more traditional team than ours.",
          correct: "left",
          why: "Rewrite A names a criterion and the evidence the candidate gave, so it records the decision against the criteria. Rewrite B is still an impression, and 'traditional' can point to age.",
          wrong:
            "Look again at Rewrite B. It names no criterion and gives no evidence, and 'more traditional' is the kind of wording that can point to age. Rewrite A ties the evidence to criterion 2.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "Mark each line of this trail entry for a data analyst interview at Brightwater Utilities as recording the decision against the criteria or recording an impression the criteria do not contain.",
        passLabel: AGAINST,
        failLabel: IMPRESSION,
        sentences: [
          {
            id: "joins",
            text: "Criterion 1, cleans and joins data from two sources: walked through joining sales and returns data, and named the check they ran for duplicates. Meets.",
            fail: false,
            why: "This line names the criterion and the evidence the candidate gave, so it records the decision against the criteria.",
          },
          {
            id: "quiet",
            text: "Very quiet, might struggle in our lively office.",
            fail: true,
            why: "None of the criteria mentions being lively. Neither quietness nor the office atmosphere is a criterion, so this is an impression.",
          },
          {
            id: "explains",
            text: "Criterion 2, explains findings to non-specialists: explained a chart clearly, and answered a follow-up question in plain terms. Meets.",
            fail: false,
            why: "This line ties the evidence to criterion 2, so it records the decision against the criteria.",
          },
          {
            id: "score",
            text: "The tool's match score was 62, so probably not strong enough.",
            fail: true,
            why: "A match score is not one of the criteria, 'probably' is not a reason, and the line gives no evidence, so it is an impression.",
          },
          {
            id: "decision",
            text: "Decision: progressed to final stage, meets criteria 1 and 2, criterion 3 to be tested at the final stage.",
            fail: false,
            why: "This line gives the decision and ties it to the criteria, so it records the decision against the criteria.",
          },
        ],
        why: "You kept the lines that tie evidence to a criterion, and you set aside the impression about the office and the tool's score. If the candidate asks to see this entry, the three remaining lines explain the decision in terms of the work.",
      },
      bridge:
        "Many recruiters did not choose the AI features in their systems, and the next lesson gives you the questions to ask about them.",
    },
    {
      id: "questions-for-an-ai-feature",
      title: "Questions for an AI feature",
      emphasis: "Questions",
      place:
        "This is the fifth of seven lessons. You can now decide and record. This lesson helps you ask the right questions about an AI feature in a recruitment tool before anyone relies on it.",
      sections: [
        {
          heading: "A decision aid someone else designed",
          paragraphs: [
            "An AI feature in a recruitment tool, such as ranking, matching, or the scoring of recorded video interviews, is a decision aid that someone else designed. You did not choose the data it learned from or the way it weighs one part of an application against another. The organisation that uses it remains responsible for how it is used and for the decisions made with its help.",
            "Many of these features arrive switched on in an update to a system the team already uses. That is the moment to ask questions, because once a feature has shaped a campaign, it is much harder to explain the decisions it touched.",
          ],
        },
        {
          heading: "Six questions to ask",
          paragraphs: [
            "The Department for Science, Innovation and Technology's guide Responsible AI in Recruitment, published in 2024, and the ICO's 2024 report on its audits of AI tools in recruitment both point to the same practical questions. What does the feature judge, and from what data about the candidate? Has it been tested for whether it produces different outcomes for people with different protected characteristics, and can the vendor show the results? Can we see why a particular candidate was scored as they were?",
            "Three more questions follow. Can we switch the feature off, or use the tool without it? Has a data protection impact assessment been done for our use, and who holds it? What are candidates told about the feature? Each question has an answer that can be checked, and the ICO and The Alan Turing Institute's guidance Explaining decisions made with AI is a useful reference for what a good explanation contains.",
          ],
        },
        {
          heading: "Two labels for a vendor's reply",
          paragraphs: [
            "Read a vendor's reply one sentence at a time. A sentence Answers the question when it gives information you could check or act on, such as which parts of the application the feature reads, what testing was done and on whose data, or how an administrator switches the feature off. A sentence Does not answer the question when it offers a quality instead of a fact, such as 'advanced', 'fair', 'unbiased', or 'fully compliant'.",
            "A statement that a feature is unbiased or compliant is not an answer to any of the six questions. It is a claim, and it tells you nothing about what the feature reads or how it was tested. When a reply is made of such sentences, send the questions again and ask for the facts behind the claim.",
          ],
        },
        {
          heading: "Features that need particular care",
          paragraphs: [
            "Some features read information from which a protected characteristic can be inferred, even when the vendor says they do not use it. Dates of education suggest age, a name or address can suggest ethnicity, and gaps in employment can reflect disability or caring responsibilities. Ask directly which parts of the application the feature reads.",
            "Features that analyse faces or tone of voice in recorded interviews need the most care. If your recruitment reaches the European Union, the EU AI Act lists AI systems used for recruitment and selection as high-risk in Annex III, and Article 5(1)(f) prohibits AI systems that infer emotions in the workplace, with narrow exceptions. Ask your legal team what that means for your organisation, and do not rely on a vendor's summary.",
          ],
        },
        {
          heading: "The mistake people usually make",
          paragraphs: [
            "The usual mistake is to ask for reassurance rather than information. A message that asks the vendor to confirm the feature is unbiased invites exactly the reply it gets, which is a confirmation that answers nothing. Ask questions whose answers are facts.",
            "The second mistake is to treat an unanswered question as a reason to wait and carry on. An open question is a reason to switch the feature off, or to use the tool without it, until the answer arrives. Record the question and the date you asked it, so that the next person can see what is still open.",
          ],
        },
      ],
      workedExample: {
        title: "A new smart ranking feature",
        inputLabel: "The vendor's first reply",
        outputLabel: "The manager's questions and the vendor's second reply",
        prompt:
          "Smart ranking uses advanced AI to find your best candidates. It is fully compliant with GDPR and has been designed to be unbiased.",
        output:
          "The manager's questions: Which parts of a candidate's application does the ranking read, and does it read their name, address, or dates of education? Has it been tested for different outcomes by protected characteristic, and on whose data? Can we see why a candidate was ranked where they were? Can an administrator switch it off? Has a data protection impact assessment been done for our use? What do you recommend we tell candidates?\n\nThe vendor's second reply: The ranking reads the whole CV text, including dates. It has not been tested by protected characteristic on your organisation's data. An administrator can switch it off in the settings.",
        reading: [
          "The first reply answered none of the questions. 'Advanced', 'fully compliant', and 'designed to be unbiased' are qualities, not facts, so none of those sentences answers the question.",
          "The second reply does answer. It shows that the ranking reads information from which age and other characteristics can be inferred, and that no testing has been done on this organisation's applicants.",
          "The manager switches the ranking off for the next campaign, records why, and asks for the vendor's testing results before reconsidering. The unanswered questions about explanation and the impact assessment are recorded as open.",
        ],
      },
      practice: {
        intro:
          "Here are three sentences from a vendor's reply about a matching feature. Mark each one with the two labels from the section above.",
        check: {
          kind: "mark",
          prompt: "Mark each sentence of the vendor's reply as one that answers the question or one that does not.",
          passLabel: ANSWERS,
          failLabel: DOES_NOT,
          sentences: [
            {
              id: "fields",
              text: "The matching reads the skills and job history sections of the CV, and ignores the name and address fields.",
              fail: false,
              why: "This tells you which data the feature reads, which you can check, so it answers the question.",
            },
            {
              id: "fair",
              text: "Our matching is fair to every candidate.",
              fail: true,
              why: "'Fair' is a quality, not a fact. The sentence says nothing about how fairness was tested, so it does not answer the question.",
            },
            {
              id: "off",
              text: "An administrator can turn matching off for any vacancy from the settings page.",
              fail: false,
              why: "This tells you how to switch the feature off, which you can act on, so it answers the question.",
            },
          ],
          why: "That is right. The sentences about what the matching reads and how to switch it off give you facts, and the claim that it is fair gives you none.",
        },
      },
      check: {
        kind: "choose",
        prompt:
          "A vendor offers Castlegate Retail an AI feature that scores recorded video interviews. Choose the message you would send before agreeing to use it.",
        leftLabel: "Message A",
        left: "Please confirm the feature is unbiased and GDPR compliant, and send us your certificate.",
        rightLabel: "Message B",
        right:
          "Please tell us what the scoring judges and from which data, including whether it analyses facial expressions or tone of voice. Please share any testing of outcomes by protected characteristic, and say whether it has been tested on applicants like ours. Can we see why a candidate received their score? Can we use the tool with the scoring switched off? What do you recommend we tell candidates?",
        correct: "right",
        why: "Message B asks what the feature judges, whether its outcomes have been tested, whether scores can be explained, whether it can be switched off, and what candidates are told. It also asks whether the scoring reads faces or voices, which matters a great deal for a video tool.",
        wrong:
          "Look again at Message A. It invites the vendor to say the words unbiased and compliant, which answer none of the questions in the lesson. It also misses whether the scoring reads faces or voices, which matters a great deal for a video tool. Message B asks for facts.",
      },
      bridge:
        "The next lesson brings every move in the course together and assesses it on situations you have not seen, before the final lesson asks you to write your own selection standard.",
    },
    {
      id: "course-assessment",
      title: "Course assessment",
      emphasis: "assessment",
      place:
        "This is the sixth of seven lessons. It recaps the method from the first five lessons, works one mixed example, and then assesses the whole method on situations you have not seen.",
      sections: [
        {
          heading: "Drafting and deciding",
          paragraphs: [
            "A step may be drafted when the output is text a person will read and approve, when it is built from criteria and material the organisation has already agreed, and when it judges no individual candidate. Adverts, interview questions, invitations, scheduling messages, and template emails usually meet all three tests.",
            "A person decides every step that judges a candidate: sifting, scoring, ranking, shortlisting, rejecting, choosing whom to offer, and setting the terms of the offer. A piece of text that says which candidate is better is a judgement, whatever format it arrives in, and a template email must not state a reason for a decision that the person did not give.",
          ],
        },
        {
          heading: "Criteria first, then meaningful review",
          paragraphs: [
            "The criteria describe the work, and every requirement in an advert should be tied to one of them. Wording that points to age, national origin, sex, disability, or caring responsibilities without a link to the job is removed and replaced with the criterion it was reaching for. Where readers might still assume a requirement the job does not have, the advert says so in a plain limit, such as 'You do not need a driving licence'.",
            "Meaningful review has four features: the reviewer looks at the evidence, judges it against the criteria, has the authority and time to disagree with any tool, and records the reason. Review without those features is a formality, and the answer to too little time is to change the process, not to sign a list nobody read.",
          ],
        },
        {
          heading: "The trail and the questions",
          paragraphs: [
            "The audit trail records, for each decision point, the criteria, the evidence, the decision, the reason against the criteria, the tools used, who decided, and the date. Every note is written as if the candidate will read it, because through a subject access request they may, and once a request has arrived the notes must not be altered to keep them from the candidate.",
            "Before anyone relies on an AI feature, ask what it judges and from which data, how its outcomes have been tested by protected characteristic, whether a score can be explained, whether it can be switched off, whether a data protection impact assessment exists, and what candidates are told. A claim that a feature is unbiased or compliant answers none of those questions, and an open question is a reason to switch the feature off until it is answered.",
            "The assessment at the end of this lesson sets seven situations you have not seen. Each question has one right answer, and each draws on one or more of the moves above. You need six of the seven to pass, and after you submit, each question shows the feedback for the option you chose.",
          ],
        },
      ],
      workedExample: {
        title: "A rejection email and the note behind it",
        inputLabel: "The prompt the recruiter used",
        outputLabel: "What the model drafted",
        prompt:
          "You are the recruiter at Marsh Lane Foods. Draft a rejection email to Aisha Grant, who applied for the quality technician role and was not shortlisted. The hiring manager's sift note says: 'Criterion 2, records test results accurately: no evidence of recording laboratory results. Does not meet.'",
        output:
          "Dear Aisha, thank you for applying for the quality technician role. We received a very high number of applications, and on this occasion we have chosen candidates whose experience and energy are a closer match for our team. We wish you well in your search.",
        reading: [
          "Drafting the email is a step that may be drafted, because the hiring manager has already decided the outcome and the recruiter will approve the text.",
          "The draft states two reasons nobody gave. 'A very high number of applications' is a fact the prompt did not contain, and 'energy' is an impression that no criterion asks for and that could suggest age.",
          "The sift note is a sound trail entry, because it ties the evidence to criterion 2. The recruiter removes the invented reasons and either says nothing about the reason or, if the organisation gives feedback, states the reason the hiring manager recorded.",
        ],
      },
      practice: {
        intro:
          "Before the assessment, choose the version of Aisha's email the recruiter could approve. The worked example above shows what went wrong in the first draft.",
        check: {
          kind: "choose",
          prompt: "Choose the rejection email that states no reason the hiring manager did not give.",
          leftLabel: "Email A",
          left: "Dear Aisha, thank you for applying for the quality technician role. After a close review, we have decided not to take your application further on this occasion. If you would like feedback, please reply to this email.",
          rightLabel: "Email B",
          right:
            "Dear Aisha, thank you for applying for the quality technician role. We had a strong field of younger graduates this time, so we will not be taking your application further.",
          correct: "left",
          why: "Email A gives the outcome, offers feedback, and invents no reason. Email B states a reason the hiring manager never gave, and 'younger graduates' points to age, which the criteria never mention.",
          wrong:
            "Look again at Email B. The hiring manager's note gave criterion 2 as the reason, and 'a strong field of younger graduates' is a reason nobody gave that points to age. Email A gives the outcome without inventing a reason.",
        },
      },
      check: {
        kind: "scenario",
        prompt:
          "Read each situation and choose what you would do. Each question has one right answer, and you need six of the seven to pass.",
        passMark: 6,
        questions: [
          {
            id: "shortlist",
            situation:
              "Grace Doyle is a recruiter at Arden Veterinary Group. She has sixty applications for a practice manager role and a deadline of Friday. A colleague suggests pasting all sixty CVs into the AI assistant and asking it for a shortlist of eight with a reason for each.",
            question: "What should Grace do?",
            options: [
              {
                id: "a",
                text: "Ask the assistant for the shortlist of eight, then check the eight reasons before she sends invitations.",
                feedback:
                  "Checking the eight reasons does nothing for the fifty-two people the assistant left out, and choosing the shortlist is a judgement about every applicant. A person decides it. Grace reads the applications against the criteria, and the assistant can draft the invitations afterwards.",
              },
              {
                id: "b",
                text: "Read the sixty applications against the essential criteria herself, choose the eight, and then ask the assistant to draft the invitation email from the approved template.",
                correct: true,
                feedback:
                  "This keeps the judgement with a person and uses the model for the text a person will approve. The shortlist is a decision about each applicant, and the invitation judges no one, so it may be drafted.",
              },
              {
                id: "c",
                text: "Ask the assistant to rank all sixty, and shortlist the top eight so the process is consistent for every applicant.",
                feedback:
                  "A ranking applied without reading the evidence is a formality, however consistent it looks. It also sends sixty CVs to a general assistant to make a decision it should not make. Grace decides the shortlist herself.",
              },
            ],
          },
          {
            id: "advert",
            situation:
              "Owen Price is a hiring manager at Severn Mutual. The model's draft advert for a payroll administrator asks for 'a recent graduate with fluent native English and their own car'. The criteria are: processes the monthly payroll for about 300 staff, explains pay queries clearly in writing, and works from the Derby office with no travel.",
            question: "How should Owen edit the advert?",
            options: [
              {
                id: "a",
                text: "Keep the requirements but add a line saying that the organisation welcomes applications from everyone.",
                feedback:
                  "A welcome line does not change the requirements, and applicants will still read that they must be a recent graduate with native English and a car. Each requirement has to be tied to a criterion or removed.",
              },
              {
                id: "b",
                text: "Change 'recent graduate' to 'graduate' and leave the rest, because English and a car are reasonable in any office job.",
                feedback:
                  "Native English can exclude people by national origin when the criterion is clear writing, and the job has no travel, so a car is not needed. Each requirement has to come from a criterion.",
              },
              {
                id: "c",
                text: "Delete the three requirements and publish the rest of the advert as it stands.",
                feedback:
                  "Deleting the requirements removes the excluding wording but leaves the advert without a description of the work. Put the criteria back in plain words, so applicants can see what the job needs.",
              },
              {
                id: "d",
                text: "Remove all three requirements and describe the work from the criteria: running the monthly payroll for about 300 staff, explaining pay queries clearly in writing, and working from the Derby office.",
                correct: true,
                feedback:
                  "Every requirement now comes from a criterion. The wording that pointed to age, origin, and a car has gone, and the advert still describes the whole job.",
              },
            ],
          },
          {
            id: "hour",
            situation:
              "Dev Sharma is a hiring manager at Lowther Engineering. The applicant tracking system has ranked 150 applicants for a site planner. The recruiter sends Dev the top fifteen and asks him to approve the shortlist in the hour he has before a site visit.",
            question: "What should Dev do?",
            options: [
              {
                id: "a",
                text: "Tell the recruiter he cannot review 150 applications meaningfully in an hour, and agree a process in which the recruiter reads every application against the essential criteria before Dev reviews the borderline cases.",
                correct: true,
                feedback:
                  "This changes the process so that someone looks at the evidence of every applicant against the criteria and can disagree with the ranking. When time cannot support meaningful review, the process is what has to change.",
              },
              {
                id: "b",
                text: "Approve the fifteen, because he is the hiring manager and a person has therefore made the decision.",
                feedback:
                  "Approving a ranked list without reading the evidence is a formality. Dev could not have disagreed with the tool, and the 135 people left out were never looked at.",
              },
              {
                id: "c",
                text: "Read the fifteen applications carefully in the hour, and approve those that meet the criteria.",
                feedback:
                  "Reading the fifteen is better than signing unread, but nobody has looked at the 135 applicants the tool left out. Meaningful review has to cover the people a tool rejected, not only the people it chose.",
              },
            ],
          },
          {
            id: "notes",
            situation:
              "After a final interview for a marketing officer at Kestrel Books, one panel member, Fiona Hale, writes: 'Great energy, reminded me of myself at that age. Strong yes.' The other panel member has recorded scores and evidence against each of the four criteria.",
            question: "What should happen before the decision is recorded?",
            options: [
              {
                id: "a",
                text: "Record Fiona's note as it stands, because the other panel member's scores already cover the criteria.",
                feedback:
                  "Fiona's note would stand in the trail as a reason, and 'reminded me of myself at that age' points to age. Every note is written as if the candidate will read it. Fiona needs to record evidence against the criteria.",
              },
              {
                id: "b",
                text: "Ask Fiona to record her evidence against each of the four criteria, and delete the impression before the panel compares scores.",
                correct: true,
                feedback:
                  "This turns an impression into a decision recorded against the criteria, before the panel relies on it. The trail then explains the decision in terms of the work.",
              },
              {
                id: "c",
                text: "Replace Fiona's note with 'Good cultural fit', which is shorter and less personal.",
                feedback:
                  "'Good cultural fit' is still an impression the criteria do not contain, and it can hide the same judgement. The note has to link evidence to the criteria.",
              },
            ],
          },
          {
            id: "sar",
            situation:
              "Tom Ellis applied for a warehouse supervisor role at Pennine Parcels and was rejected at interview. He has made a subject access request for the notes written about him. One note says 'bit too posh for the warehouse floor'.",
            question: "What should the recruiter, Hannah Moss, do?",
            options: [
              {
                id: "a",
                text: "Delete the line before the notes are released, because it was never meant to be a reason for the decision.",
                feedback:
                  "Once a request has arrived, the notes must not be altered or deleted to keep them from the candidate, and doing so can be an offence under the Data Protection Act 2018. Pass the request to the data protection lead with the notes as they are.",
              },
              {
                id: "b",
                text: "Rewrite the line as evidence against a criterion, so that the release shows a sound trail.",
                feedback:
                  "Rewriting a note after a request has arrived changes the information the candidate is entitled to see. The time to write a good note was at the interview. Pass the notes on as they are, and fix the practice for the future.",
              },
              {
                id: "c",
                text: "Pass the request and the notes, unchanged, to the data protection lead, and raise the note with the hiring manager so that future notes record evidence against the criteria.",
                correct: true,
                feedback:
                  "This respects the request and deals with the practice that produced the note. The lesson is that every note is written as if the candidate will read it, because this candidate now will.",
              },
            ],
          },
          {
            id: "video",
            situation:
              "Lena Fischer leads talent acquisition at Harbour Freight, which hires in Leeds and Rotterdam. A vendor offers a video interview feature that 'reads micro-expressions to assess enthusiasm' and describes it as 'certified bias-free'.",
            question: "What should Lena do?",
            options: [
              {
                id: "a",
                text: "Accept the feature if the vendor sends the bias-free certificate, and keep a copy on file.",
                feedback:
                  "A certificate that says bias-free answers none of the questions about what the feature judges or how it was tested. The feature also infers emotion from faces, which the EU AI Act prohibits in the workplace with narrow exceptions, and Harbour Freight hires in Rotterdam.",
              },
              {
                id: "b",
                text: "Not use the emotion scoring, send the vendor the questions about what it judges, testing, explanation, switching it off, and what candidates are told, and ask the legal team about the EU AI Act for the Rotterdam hiring.",
                correct: true,
                feedback:
                  "This asks for facts rather than reassurance and treats the open questions as a reason not to rely on the feature. Emotion inference in the workplace is prohibited under Article 5(1)(f) of the EU AI Act, so the legal team needs to see it.",
              },
              {
                id: "c",
                text: "Use the feature for the Leeds hiring only, where the EU AI Act does not apply, and ask the questions later.",
                feedback:
                  "Asking the questions later means the feature shapes decisions before anyone knows what it judges. UK data protection and equality law still apply in Leeds. Ask the questions first and keep the feature off until they are answered.",
              },
            ],
          },
          {
            id: "update",
            situation:
              "Sam Okoro has just joined Tolland Housing as a hiring manager and inherited its selection standard for housing officers. An update to the applicant tracking system has switched on a new setting that automatically rejects applicants whose match score is below 40. The standard says nothing about it.",
            question: "What should Sam do?",
            options: [
              {
                id: "a",
                text: "Leave the setting on, because it only removes the weakest applicants and saves reading time.",
                feedback:
                  "An automatic rejection is a decision about each applicant made by the tool, with no person looking at the evidence. A person decides every rejection. The setting needs to be switched off.",
              },
              {
                id: "b",
                text: "Leave the setting on, but read a sample of the rejected applications each month to check the tool.",
                feedback:
                  "A sample check still lets the tool reject most applicants without anyone looking at their evidence. Rejection belongs to a person, so the setting has to be switched off, and the standard updated.",
              },
              {
                id: "c",
                text: "Ask the vendor whether the setting is compliant, and carry on while waiting for the answer.",
                feedback:
                  "Asking whether a setting is compliant invites a reassurance that answers nothing, and carrying on means the tool keeps rejecting people meanwhile. Switch it off first, then ask the questions.",
              },
              {
                id: "d",
                text: "Switch the setting off, record why and the date, and raise it with the owner of the standard so the section on AI features can be updated with the open questions for the vendor.",
                correct: true,
                feedback:
                  "This keeps every rejection with a person, records the change in the trail, and brings the standard up to date so the next hiring manager can see what was decided and what is still open.",
              },
            ],
          },
        ],
        why: "You kept judgements with people, tied requirements to criteria, told meaningful review from a formality, recorded reasons against the criteria, and asked for facts about each AI feature. The final lesson asks you to write those moves down as a standard for a real vacancy.",
      },
      bridge:
        "The final lesson turns every move in the course into one selection standard for a real vacancy or role family, and that standard is the work your record will show.",
    },
    {
      id: "the-selection-standard",
      title: "The selection standard",
      emphasis: "standard",
      place:
        "This is the last lesson. You will write a selection standard for one real vacancy or role family, and that standard is what your signed record shows.",
      sections: [
        {
          heading: "What a selection standard is",
          paragraphs: [
            "A selection standard is one page that anyone involved in a recruitment can follow. It names the vacancy or role family and lists the criteria. It says which steps may be drafted and from what source. It names, by role, who decides each judgement about candidates, and says what that person looks at. It lists the fields of the audit trail entry. It records the answers, or the open questions, about any AI feature in use, and what candidates are told. It ends with who owns the standard and when it will be reviewed.",
            "A standard is not a legal opinion, and it does not say the process is lawful or compliant. It says what the team will do. Its value is that a new hiring manager can pick it up and run a fair, explainable process without having taken this course.",
          ],
        },
        {
          heading: "Write each part so a new hiring manager could follow it",
          paragraphs: [
            "The test for each part is whether a hiring manager who joined last week could act on it without asking you what you meant. A part is ready when they could follow it as it stands. If they would have to ask, it needs more work. 'The recruiter reads every application against the essential criteria' can be followed, whereas 'applications are reviewed' cannot, because it does not say who looks at what.",
            "Write the criteria as work the person will do, and number them so the trail can refer to them. Write the drafted steps with their source, such as 'the advert, drafted from the approved person specification'. Write each judgement with a role and what that role looks at, because a person who only approves or signs off is not reviewing.",
          ],
        },
        {
          heading: "How the standard is checked",
          paragraphs: [
            "When you continue, each part is checked in turn. The vacancy has to be named. The criteria have to be listed or numbered. The drafted steps have to name at least one kind of text, such as an advert, questions, or an email. The section on who decides has to say what the person looks at or reads. The audit trail fields have to include the evidence. The AI features part has to record what was tested, asked, or switched off, or say that none is in use. The part on what candidates are told has to say what they are told. The owner has to come with a date or a month for review.",
            "Do not put candidate names, email addresses, or telephone numbers in the standard, and do not write that the process is lawful, compliant, unbiased, or certified. The record shows the standard exactly as you wrote it, so a verifier sees the work you can now do.",
          ],
        },
      ],
      workedExample: {
        title: "A standard for customer support advisers",
        inputLabel: "The standard for customer support advisers",
        outputLabel: "What a new hiring manager did with it",
        prompt:
          "Role family: customer support advisers, Brightwater Utilities.\nCriteria: 1. answers customer queries by phone and chat in clear English; 2. uses the support system after training; 3. records each contact accurately; 4. works flexible shifts between 8am and 8pm.\nMay be drafted: the advert, from the approved person specification; interview questions for each criterion; template emails for invitations and outcomes.\nWho decides: the recruiter decides the sift and reads every application against criteria 1 and 3; the hiring manager and one colleague decide at interview, each scoring the answers against all four criteria before comparing.\nAudit trail fields: the criteria, the evidence, the decision, the reason against the criteria, the tools used, who decided, and the date.\nAI features: the ranking in the applicant tracking system is switched off until the vendor shares testing results by protected characteristic; explanation of scores is an open question.\nWhat candidates are told: we use AI to help draft adverts and emails, and people make every decision about applications.\nOwner and review: the head of talent owns this standard and reviews it each January.",
        output:
          "Priya, a hiring manager who joined in March, ran the next campaign from the standard. She read the interview answers against the four criteria, scored before comparing with her colleague, and recorded each decision in the seven trail fields. When she noticed the ranking had been switched back on by an update, she switched it off and told the head of talent.",
        reading: [
          "Each part does one job, and each could be checked by someone who was not there when it was written.",
          "The section on who decides names a role for each judgement and says what that role reads, so the review cannot become a formality.",
          "The AI features part records both an action and an open question, which is what let the new hiring manager act when the update changed a setting.",
        ],
      },
      practice: {
        intro:
          "Before you write your own standard, read these four lines from a draft standard for a nursery practitioner role and mark each one. You will use the same test on your own standard in a moment.",
        check: {
          kind: "mark",
          prompt: "Mark each line as one a new hiring manager could follow or one they would have to ask about.",
          passLabel: FOLLOW,
          failLabel: ASK,
          sentences: [
            {
              id: "criteria",
              text: "Criteria: 1. plans daily activities for a group of six children; 2. records each child's progress in the learning journal; 3. works shifts between 7.30am and 6pm.",
              fail: false,
              why: "Each criterion describes work and is numbered, so a new hiring manager could follow it.",
            },
            {
              id: "signoff",
              text: "Who decides: the manager signs off the shortlist.",
              fail: true,
              why: "It does not say what the manager looks at, so a new hiring manager would have to ask whether signing off means reading the applications.",
            },
            {
              id: "drafted",
              text: "May be drafted: interview questions for each criterion, drafted from the person specification.",
              fail: false,
              why: "It names the text and its source, so a new hiring manager could follow it.",
            },
            {
              id: "ai",
              text: "AI features: we use the usual tools sensibly.",
              fail: true,
              why: "It names no feature, no question, and no decision, so a new hiring manager would have to ask what is in use.",
            },
          ],
          why: "That is right. The criteria and the drafted questions can be followed as they stand, and the lines about signing off and the usual tools leave a new hiring manager asking what to do.",
        },
      },
      check: {
        kind: "build",
        prompt:
          "Write the selection standard for one real vacancy or role family. A hiring manager who was not in this course should be able to run the process from it. Leave out candidate names and contact details.",
        fields: [
          {
            id: "vacancy",
            label: "The vacancy or role family",
            hint: "The job title or role family, and the team or organisation it sits in.",
            min: 8,
            rule: "role",
            missing:
              "The vacancy or role family is still too thin. Name the job title or role family, for example customer support advisers in the Leeds contact centre.",
          },
          {
            id: "criteria",
            label: "Criteria",
            hint: "At least three criteria, numbered, each describing work the person will do. No age, graduation year, nationality, native language, or cultural fit.",
            min: 40,
            any: ["criterion", "criteria", "1.", "1)", "essential", "desirable"],
            missing:
              "The criteria are not yet listed. Number at least three criteria, or label them essential and desirable, and write each as work the person will do.",
          },
          {
            id: "drafted",
            label: "What may be drafted, and from what source",
            hint: "The text a model may draft, and the agreed material it is drafted from. No sifting, scoring, ranking, shortlisting, or rejecting.",
            min: 24,
            any: ["advert", "question", "email", "template", "letter", "message", "job description"],
            missing:
              "What may be drafted does not yet name a piece of text. Name at least one step, such as the advert or the interview questions, and the source it is drafted from.",
          },
          {
            id: "decides",
            label: "Who decides each judgement, and what they look at",
            hint: "A role for each judgement, such as the sift, the interview, and the offer, and what that person reads or scores.",
            min: 40,
            any: ["read", "look at", "looks at", "score", "review", "evidence", "against the criteria", "assess"],
            missing:
              "Say what the person looks at, so the review is not a formality. For each judgement, name the role and what they read or score, for example 'the recruiter reads every application against criteria 1 and 2'.",
          },
          {
            id: "trail",
            label: "The audit trail fields",
            hint: "At least the criteria, the evidence, the decision, the reason against the criteria, the tools used, the decider, and the date.",
            min: 30,
            any: ["evidence"],
            missing:
              "The audit trail fields do not yet include the evidence. List at least the criteria, the evidence, the decision, the reason against the criteria, the tools used, who decided, and the date.",
          },
          {
            id: "ai",
            label: "AI features in use, and the questions answered or still open",
            hint: "Each AI feature, and at least three of the lesson five questions marked answered or open. If none is in use, say so.",
            min: 16,
            any: ["switched off", "turned off", "not used", "none", "no ai", "tested", "testing", "question", "open", "vendor", "explain"],
            missing:
              "The AI features part does not yet record what was asked or decided. Name each feature and the questions answered or still open, or say plainly that none is in use.",
          },
          {
            id: "told",
            label: "What candidates are told",
            hint: "What the advert, the privacy notice, or the invitation tells candidates about AI and about who decides.",
            min: 16,
            any: ["told", "tell", "candidates", "applicants", "privacy notice", "advert"],
            missing:
              "What candidates are told is still empty or unclear. Say what candidates are told about AI in the process and who makes the decisions, and where they are told it.",
          },
          {
            id: "owner",
            label: "Owner and review date",
            hint: "The role that owns the standard, and the date, month, or trigger for its review.",
            min: 16,
            rule: "fact",
            missing:
              "Owner and review date does not yet give a date. Name the role that owns the standard and when it will be reviewed, for example 'the head of talent, each January'.",
          },
        ],
        why: "Your standard has every part. It names the vacancy and the criteria, says what may be drafted and from what, names who decides each judgement and what they look at, lists the trail fields, records the AI features and their questions, says what candidates are told, and names an owner with a review date. A hiring manager who was not in this course could run the process from it.",
      },
      bridge:
        "Your selection standard is ready. Sign your name below, and the record will show the standard, the course, and the date to anyone who opens the reference.",
    },
  ],
};
