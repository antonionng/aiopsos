/*
Course: Performance and Feedback with AI
Slug: performance-and-feedback-with-ai
For: Line managers who hold one-to-ones, give feedback, and write or contribute to performance
  reviews, and HR business partners who coach managers through those conversations. They manage at
  least one person, know their review process in outline, and have a real conversation coming up.
Outcome: The learner prepares for one real feedback or performance conversation, using a model only
  for preparation such as structure, the wording of an open question, and rehearsal. They separate
  what they saw from what they inferred, remove unsupported characterisations from a draft, and
  write an opening that states the purpose and the evidence and then asks for the other person's view.
Artefact: The preparation sheet for one real conversation.
Record sentence: Prepared one real feedback conversation from observed evidence, used a model only
  for preparation, and kept every judgement about the person with the manager.
Lessons (id, title, move, interaction, pass rule):
  1. what-you-may-draft, What you may draft, tell preparation from judgement, mark
     (Preparation / Judgement), every task marked correctly.
  2. what-you-must-have-seen, What you must have seen, tell observation from inference, mark
     (Something I saw / Something I inferred), every sentence marked correctly.
  3. the-draft-that-invents, The draft that invents, repair a model's draft, edit, the draft keeps
     the four late arrivals and the two briefings, and adds a purpose and an open question.
  4. one-conversation, One conversation, open a conversation with purpose, evidence, and a question,
     choose (Opening A / Opening B), the opening with purpose, evidence, and an open question.
  5. what-would-change-your-view, What would change your view, name what to listen for and agree a
     next step, edit, the prep keeps its purpose and names something to listen for, an action, and a time.
  6. course-assessment, The course assessment, apply the method to new situations, scenario of seven
     questions, six correct to pass.
  7. the-sheet, The preparation sheet, write the sheet, build, purpose names why; what I saw holds a
     concrete fact; the first question is open; listening names a cause; the next step has an action
     and a date; the model line names preparation only; the decision line says what is and is not decided.
Sources: Acas Code of Practice on disciplinary and grievance procedures; Acas advice on managing
  performance and on difficult conversations; CIPD factsheet on performance management; Center for
  Creative Leadership, Situation-Behaviour-Impact; Kluger and DeNisi, Psychological Bulletin, 1996;
  ICO guidance on employment practices and on monitoring workers.
Tested on phone:          yes
Tested returning learner: yes
Pass rule tests written:  yes
*/

import type { CourseContent } from "./types.ts";

const PREP = "Preparation";
const JUDGE = "Judgement";
const SAW = "Something I saw";
const INFERRED = "Something I inferred";

export const COURSE: CourseContent = {
  slug: "performance-and-feedback-with-ai",
  hours: 2,
  artefact: {
    lessonId: "the-sheet",
    title: "The preparation sheet",
    recordLine:
      "Prepared one real feedback conversation from observed evidence, used a model only for preparation, and kept every judgement about the person with the manager.",
  },
  lessons: [
    {
      id: "what-you-may-draft",
      title: "What you may draft",
      emphasis: "draft",
      place:
        "This is the first of seven lessons. Before any drafting starts, it draws the line between preparing for a conversation and judging the person you will speak with.",
      sections: [
        {
          heading: "Two kinds of work before a conversation",
          paragraphs: [
            "Getting ready for a feedback or performance conversation involves two kinds of work, and this course gives each one a name. The first is Preparation. Preparation is the work of getting ready to hold the conversation well: choosing a structure, wording an open question, thinking about how the other person might respond, rehearsing your opening aloud, and noting the points you want to cover. None of it decides anything about the person.",
            "The second is Judgement. Judgement is the work of deciding what you think about the person's performance: which rating they receive, whether they met an objective, whether a concern is serious enough to become formal, and what the evidence in front of you means. Every judgement is a decision about a person, and it is yours to make as their manager, with your HR adviser and your policy where the decision is a serious one.",
            "In this lesson and the rest of the course, you will mark tasks with these two labels. A task is Preparation when it helps you say well what you have already decided to say. A task is Judgement when it would decide, explain, or record what you think of the person.",
          ],
        },
        {
          heading: "What a model may help with",
          paragraphs: [
            "A model may help with preparation. It can suggest an order for a thirty-minute review, offer three ways to word a question about development, or play the other person so that you can practise an opening that does not sound like a verdict. In each case you remain the author of what is said, and the model is helping with how it is said.",
            "There is one condition. Give the model no personal information that your organisation has not approved for that tool. A structure or a question does not need the person's name, their objectives, or their history, so a good preparation request can usually be written without any of them. If your organisation has an approved tool and a policy for it, follow that policy.",
          ],
        },
        {
          heading: "What a model must not do",
          paragraphs: [
            "A model must not make the judgement. It has not seen the person work, it does not know the team, the workload, or what happened in the quarter, and it cannot weigh one piece of evidence against another the way you can. Whatever it writes about the person is assembled from patterns in other people's reviews.",
            "This line has nothing to do with the quality of the wording. A model can produce a fluent, balanced paragraph rating someone's performance, and that fluency is exactly what makes it dangerous. The paragraph looks like a considered assessment while being a guess, and once it is on a review form it is very hard for anyone, including you, to tell which parts you meant.",
          ],
        },
        {
          heading: "The mistake people usually make",
          paragraphs: [
            "The usual mistake is to treat writing the review as drafting, and therefore as preparation. A manager pastes in bullet notes and asks for a paragraph for the review form. It feels like help with wording, but the paragraph is the manager's assessment of the person, and the model will fill every gap in the notes with characterisations the manager never made.",
            "The test is simple. Ask of each task whether it would decide what you think of the person. If it would, it is Judgement and it stays with you. If it would only help you hold the conversation you have already decided to have, it is Preparation and a model may help.",
          ],
          beforeAfter: {
            before: "Write my mid-year review of Priya from these notes.",
            after:
              "Suggest an order for a thirty-minute mid-year review and three open questions about development. I will write the assessment myself.",
            reading:
              "The first request hands the model the assessment and names the person. The second asks only for structure and questions, needs no name, and keeps the assessment with the manager.",
          },
        },
      ],
      workedExample: {
        title: "A manager's plan for a mid-year review",
        inputLabel: "The manager's plan",
        outputLabel: "The plan, marked",
        prompt:
          "1. Ask the model for a structure for a thirty-minute mid-year review.\n2. Ask the model to decide whether the objectives are met, exceeded, or not met.\n3. Ask the model for three open questions about development.\n4. Ask the model to write a paragraph summarising performance for the review form, from my bullet notes.\n5. Rehearse the opening with the model playing the team member.",
        output:
          "1. Preparation.\n2. Judgement.\n3. Preparation.\n4. Judgement.\n5. Preparation.",
        reading: [
          "The structure, the open questions, and the rehearsal are preparation. Each one helps the manager hold the conversation well, and none of them decides anything about the team member.",
          "Deciding whether the objectives are met is judgement in its plainest form. It is the rating, and the model has no way to know whether the objectives were met beyond what the manager tells it.",
          "The summary paragraph is also judgement, even though it looks like drafting. The paragraph is the manager's assessment of the person, and a model working from bullet notes will fill the gaps with characterisations the manager did not make. The manager keeps items 1, 3, and 5 for the model and writes items 2 and 4 alone.",
        ],
      },
      practice: {
        intro:
          "A manager at Calder Logistics is preparing for a probation review with a new starter. Mark each task on their list using the two labels you have just learned. The definitions are in the first section if you want to read them again.",
        check: {
          kind: "mark",
          prompt: "Mark each task as Preparation or as Judgement.",
          passLabel: PREP,
          failLabel: JUDGE,
          sentences: [
            {
              id: "agenda",
              text: "Draft an agenda for a forty-five minute probation review.",
              fail: false,
              why: "An agenda helps the manager hold the review and decides nothing about the new starter, so it is Preparation.",
            },
            {
              id: "extend",
              text: "Decide whether the probation period should be extended.",
              fail: true,
              why: "Extending probation is a decision about the person, so it is Judgement and stays with the manager.",
            },
            {
              id: "opening",
              text: "Suggest how to open the conversation so it does not sound like a verdict.",
              fail: false,
              why: "Working on the opening helps the manager say it well, so it is Preparation.",
            },
          ],
          why: "That is right. The agenda and the opening are preparation, and whether to extend probation is a judgement the manager makes.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "A manager lists what they will ask a model to do before a conversation about missed deadlines. Mark each task as Preparation or as Judgement.",
        passLabel: PREP,
        failLabel: JUDGE,
        sentences: [
          {
            id: "structure",
            text: "Suggest a structure for a twenty-minute conversation about workload and deadlines.",
            fail: false,
            why: "A structure helps you hold the conversation and does not assess anyone, so it is Preparation.",
          },
          {
            id: "formal",
            text: "Tell me whether these missed deadlines are serious enough to start the formal capability process.",
            fail: true,
            why: "Whether to go formal is one of the most serious judgements a manager makes. It needs you, your HR adviser, and your policy, so it is Judgement.",
          },
          {
            id: "questions",
            text: "Give me two open questions to ask about what got in the way.",
            fail: false,
            why: "Wording a question helps you listen, and you decide what to make of the answers, so it is Preparation.",
          },
          {
            id: "why",
            text: "Write a paragraph explaining why this person is underperforming.",
            fail: true,
            why: "This asks the model to explain the person's performance. The reason is exactly what you do not know yet, and the model would have to invent it, so it is Judgement.",
          },
          {
            id: "rehearse",
            text: "Play the team member so I can practise my opening.",
            fail: false,
            why: "Rehearsal helps you say it well, and you are not asking the model to assess the person, so it is Preparation.",
          },
        ],
        why: "You used the model for structure, questions, and rehearsal, and you kept every judgement about the person with yourself. That is the line the rest of the course depends on.",
      },
      bridge:
        "A judgement needs evidence, and the next lesson separates what you saw from what you only concluded.",
    },
    {
      id: "what-you-must-have-seen",
      title: "What you must have seen",
      emphasis: "seen",
      place:
        "In the first lesson you kept the judgement with yourself. This lesson makes sure that judgement rests on evidence you can describe, before any of it goes near a model.",
      sections: [
        {
          heading: "Feedback a person can act on",
          paragraphs: [
            "Feedback that a person can act on describes something the manager actually saw or heard, when it happened, and what effect it had. The Center for Creative Leadership's Situation, Behaviour, Impact model is one well-known way of holding that shape: the situation is the occasion, the behaviour is what the person did, and the impact is what followed.",
            "A sentence in that shape gives the other person something to respond to. They can say what was happening that day, they can agree or disagree about the effect, and together you can talk about what to do differently. The conversation stays on the work, which is the only part of it either of you can change.",
          ],
        },
        {
          heading: "Something I saw and something I inferred",
          paragraphs: [
            "In this course, a sentence is Something I saw when it names a specific action or piece of work, a time or occasion, and, where possible, the effect it had. 'In Tuesday's client call, you answered the pricing question before the client had finished asking it, and the client repeated the question twice' is something the manager saw.",
            "A sentence is Something I inferred when it names a trait, a motive, or a pattern that the manager has concluded from what they saw. 'You are not a good listener' and 'you do not seem committed' are inferences. Nobody can see listening skill or commitment directly. They are conclusions drawn from actions the sentence does not mention.",
            "Inferences are not forbidden thoughts. Every manager forms them, and some are accurate. The point is that an inference is not evidence, and it should not stand in for the evidence in a conversation.",
          ],
        },
        {
          heading: "Why inferences go wrong in the room",
          paragraphs: [
            "An inference in a feedback conversation invites the person to defend their character instead of discussing the work. Told that they do not take ownership, most people argue with the label, and the conversation becomes a dispute about who they are. Told that the report reached finance on the 8th when it was due on the 5th, they can explain what happened and what would help.",
            "In a review of feedback studies published in Psychological Bulletin in 1996, Avraham Kluger and Angelo DeNisi found that feedback did not reliably improve performance, and that feedback which drew attention to the person rather than to the task was more likely to make it worse. Inferences are also the kind of sentence a model produces most readily when it is asked to write feedback from thin notes, which is why the evidence has to be yours before any drafting begins.",
          ],
        },
        {
          heading: "Turning an inference back into evidence",
          paragraphs: [
            "When you find an inference in your notes, ask what you saw that led you to it. If you can name the action, the occasion, and the effect, write that instead. If you cannot, set the inference aside, because you do not yet have the evidence to raise it.",
            "The usual mistake is to keep the inference and add evidence after it, as in 'you do not take ownership, for example the March report was late'. The label still leads, and the person still hears a judgement of their character first. Write the evidence alone and let it speak.",
          ],
          beforeAfter: {
            before: "You do not take ownership of the monthly report.",
            after:
              "The monthly report was due on the 5th and reached finance on the 8th in March and on the 9th in April.",
            reading:
              "The first sentence names a trait the person can only argue with. The second names the work, the dates, and the gap, so the person can explain what happened.",
          },
        },
      ],
      workedExample: {
        title: "Sorting a manager's notes",
        inputLabel: "The manager's notes",
        outputLabel: "The notes, sorted",
        prompt:
          "Late with the monthly report again. Doesn't take ownership. Missed the 5th in March and the 5th in April. The finance team chased twice in April. Bit of an attitude problem when I raised it.",
        output:
          "Something I saw: the report missed the 5th in March and the 5th in April.\nSomething I saw: the finance team chased twice in April.\nSomething I inferred: doesn't take ownership.\nSomething I inferred: a bit of an attitude problem.\nRewritten as something seen: when I raised the April report, you said the deadline was unrealistic and then changed the subject.",
        reading: [
          "The missed deadlines carry dates, so they are something the manager saw. The finance team's two chasers are also something seen, and they show the effect of the late report on other people.",
          "'Doesn't take ownership' and 'a bit of an attitude problem' each name a trait rather than an action, so they are inferences. Neither could be discussed in the room without the person defending themselves.",
          "The manager asks what they saw that led to 'attitude problem', and rewrites it as what was said in the April conversation. That sentence can now be discussed, and the ownership inference is set aside because the dates already carry the point.",
        ],
      },
      practice: {
        intro:
          "The practice manager at Harbour Street Surgery has written three notes about a receptionist before a one-to-one. Mark each one with the labels from the second section, which is still above if you need it.",
        check: {
          kind: "mark",
          prompt: "Mark each note as Something I saw or as Something I inferred.",
          passLabel: SAW,
          failLabel: INFERRED,
          sentences: [
            {
              id: "phones",
              text: "On Monday morning the reception phones were unattended for twenty minutes and nobody had been told.",
              fail: false,
              why: "This names an occasion, a length of time, and what happened, so it is something the manager saw.",
            },
            {
              id: "care",
              text: "You do not care about the patients.",
              fail: true,
              why: "Caring is a state of mind the manager has concluded from something else, so it is something inferred.",
            },
            {
              id: "complaints",
              text: "Two patients complained at the desk that nobody had answered their calls.",
              fail: false,
              why: "Two complaints at the desk can be pointed to, and they show the effect, so this was seen.",
            },
          ],
          why: "That is right. The unattended phones and the two complaints are evidence, and the claim about caring is a conclusion the manager drew from them.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "Mark each sentence from a manager's notes as Something I saw or as Something I inferred.",
        passLabel: SAW,
        failLabel: INFERRED,
        sentences: [
          {
            id: "risks",
            text: "In the team meeting on the 12th, you presented the project update without the risks section we agreed.",
            fail: false,
            why: "It names an occasion, a date, and a specific piece of work, so the manager saw it.",
          },
          {
            id: "detail",
            text: "You are not detail-minded.",
            fail: true,
            why: "Nobody can see detail-mindedness. It names a trait, not an action, and the person can only argue with it, so it is inferred.",
          },
          {
            id: "timeline",
            text: "The client asked twice for the revised timeline before it was sent.",
            fail: false,
            why: "It describes two requests from the client that the manager can point to, and it shows the effect, so it was seen.",
          },
          {
            id: "interest",
            text: "You seem to have lost interest in the role.",
            fail: true,
            why: "Interest is a state of mind the manager has concluded from something else. Write what you saw that made you think it.",
          },
          {
            id: "expenses",
            text: "Your last three expense claims were submitted after the month-end deadline.",
            fail: false,
            why: "Three dated submissions can be checked, and they describe an action, so this was seen.",
          },
        ],
        why: "You kept the sentences that name an action and an occasion, and you set aside the traits and states of mind. Those three seen sentences are what the conversation can stand on.",
      },
      bridge:
        "When those notes go into a model, the model can put the inferences back, and the next lesson shows how to catch and remove them.",
    },
    {
      id: "the-draft-that-invents",
      title: "The draft that invents",
      emphasis: "invents",
      place:
        "You can now separate what you saw from what you inferred. This lesson applies that to a draft a model produced, which is where invented characterisations most often appear.",
      sections: [
        {
          heading: "What a model does with thin notes",
          paragraphs: [
            "When a manager gives a model a few notes and asks for a feedback message or a review paragraph, the model tends to smooth the notes into a narrative that sounds finished. It has read a great many feedback messages, and most of them explain, characterise, and conclude. So it explains, characterises, and concludes, whether or not the notes gave it anything to work from.",
            "The result reads as considered. It has the tone of a manager who has thought about the person for some time. That tone belongs to the writing, and it tells you nothing about whether the content came from you.",
          ],
        },
        {
          heading: "Three things a draft adds",
          paragraphs: [
            "The first is a characterisation, such as 'has shown a pattern of disengagement' or 'struggles with accountability'. These are inferences of the kind you set aside in the last lesson, and the model writes them because feedback messages often contain them. They were never in your notes.",
            "The second is a cause, such as 'perhaps due to personal circumstances'. You do not know the cause, which is one reason for having the conversation, and you should not guess at it. A guessed cause about someone's private life can be hurtful and intrusive, and it puts in writing something the person never told you.",
            "The third is an outcome, such as 'further action may follow' or 'this is now a disciplinary matter'. An outcome commits you to a process that nobody has decided on. It turns an informal conversation into a threat, and it may not match what your policy says should happen next.",
          ],
        },
        {
          heading: "The repair",
          paragraphs: [
            "The repair is to read every sentence of the draft and keep only those that describe something you saw, or that state a purpose or a question you chose. In the practice below you will mark each sentence with one of two labels. Keep means the sentence describes something you saw, says why you want to talk, or asks for the other person's view. Remove or replace with what I saw means the sentence contains a characterisation, a cause, or an outcome that did not come from you.",
            "A characterisation is replaced by the observation that led to it, or it is removed. A guessed cause is removed. An outcome is removed unless you have decided it with HR. Then check that the message still says why you want to talk and asks an open question, because without those it is a statement rather than the start of a conversation.",
            "The repaired draft is shorter, and that is a sign it is working. The usual mistake is to soften an invented sentence rather than remove it, so that 'you clearly do not care' becomes 'you may not seem to care'. The softer version is still an inference, and the person will still hear it.",
          ],
          beforeAfter: {
            before:
              "This reflects a wider pattern of disengagement that I have noticed.",
            after: "The finance team had to chase the April report twice.",
            reading:
              "The first sentence names a pattern and a trait the notes never mentioned. The second replaces it with the observation from the notes, which the person can respond to.",
          },
        },
        {
          heading: "Why the outcome sentence matters most",
          paragraphs: [
            "Of the three additions, the outcome is the one that can do the most harm. A message that says 'we may need to take further action' tells the person they are already in a process. If a concern may become formal, the Acas Code of Practice on disciplinary and grievance procedures, your organisation's policy, and your HR adviser govern what happens, and none of that begins with a line in a feedback message.",
            "Remove the outcome and keep the conversation informal. If, after you have listened, you think the concern may need a formal route, speak to HR before you say anything about it to the person.",
          ],
        },
      ],
      workedExample: {
        title: "Repairing a message about the monthly report",
        inputLabel: "What the manager gave the model",
        outputLabel: "What the model wrote",
        prompt:
          "Notes: the monthly report was due on the 5th and went to finance late in March and April. Finance chased twice in April.\nRequest: write a short message to open a conversation about this.",
        output:
          "I wanted to talk about the monthly report, which has been late in March and April. This reflects a wider pattern of disengagement that I have noticed. I understand things may be difficult at home. If this continues, we may need to take further action.",
        reading: [
          "The first sentence is what the manager saw, so it is kept. The second invents a pattern and a trait that the notes never mentioned, so it is replaced with the observation about the finance team's two chasers.",
          "The third sentence guesses at a personal cause the manager never mentioned. It could be hurtful, and it is intrusive, so it is removed. The fourth commits the manager to further action nobody has decided, so it is removed too.",
          "The repaired message reads: 'I wanted to talk about the monthly report, which was sent after the deadline in March and April, and the finance team had to chase it twice in April. I would like to understand what gets in the way, and work out together what would help.' It is shorter, it says only what the manager saw, and it adds a purpose and an invitation to talk.",
        ],
      },
      practice: {
        intro:
          "A manager's notes say only that the weekly pipeline summary arrived on Monday rather than Friday for the last two weeks. The model wrote the four sentences below. Mark each one with the two labels from the repair section above.",
        check: {
          kind: "mark",
          prompt: "Mark each sentence of the draft as Keep or as Remove or replace with what I saw.",
          material: {
            label: "The manager's notes",
            text: "The weekly pipeline summary arrived on Monday instead of Friday for the last two weeks.",
          },
          passLabel: "Keep",
          failLabel: "Remove or replace with what I saw",
          sentences: [
            {
              id: "summary",
              text: "I wanted to talk about the weekly pipeline summary, which arrived on Monday rather than Friday for the last two weeks.",
              fail: false,
              why: "This is exactly what the notes say, and it states the purpose, so keep it.",
            },
            {
              id: "motivation",
              text: "It seems you have lost motivation since the restructure.",
              fail: true,
              why: "Lost motivation is a characterisation, and the restructure is a cause the notes never mention, so remove it.",
            },
            {
              id: "home",
              text: "Perhaps the new baby is making things harder.",
              fail: true,
              why: "This guesses at a private cause. It is intrusive and it came from nowhere in the notes, so remove it.",
            },
            {
              id: "view",
              text: "I would like to hear how the week looks from your side.",
              fail: false,
              why: "This invites the other person's view, which is what opens the conversation, so keep it.",
            },
          ],
          why: "That is right. You kept the observation and the invitation, and you removed the invented motivation and the guess about the person's private life.",
        },
      },
      check: {
        kind: "edit",
        prompt:
          "The manager's notes said only that a team member arrived after the 9am start on four days in the last two weeks and missed the start of two team briefings. Edit the model's draft so that it contains only what the manager saw, a purpose, and an open question.",
        material: {
          label: "The manager's notes",
          text: "Arrived after 9am on four days in the last two weeks. Missed the start of two team briefings.",
        },
        label: "The draft you are repairing",
        start:
          "I have noticed you arriving after 9am on four days in the last two weeks, and you missed the start of two briefings. You clearly do not see punctuality as important. I wonder whether you are looking for another job. This is now a disciplinary matter. Can we talk about it?",
        unchanged:
          "You have not changed the draft yet. Remove the sentences that name an attitude, guess at a motive, or start a process, then say why you want to talk and ask an open question.",
        keep: [
          {
            id: "arrivals",
            any: ["four days", "4 days", "four mornings", "4 mornings"],
            missing:
              "Keep what you saw about the four late arrivals. It is the part of the message the person can respond to.",
          },
          {
            id: "briefings",
            any: ["briefing"],
            missing:
              "Keep what you saw about the two missed briefings. It is the second piece of evidence, and it shows the effect.",
          },
        ],
        limits: [
          {
            id: "purpose",
            any: ["understand", "i would like to", "i'd like to", "i want to", "the reason", "agree", "so that we", "work out"],
            missing:
              "Say why you want to talk, for example 'I would like to understand what has been happening', so the person knows the purpose of the conversation.",
          },
          {
            id: "question",
            any: ["what ", "what's", "how ", "tell me about", "talk me through", "walk me through"],
            missing:
              "Ask an open question the person can answer in their own words, such as 'What has been happening in the mornings?'. 'Can we talk about it?' can be answered yes or no.",
          },
        ],
        limitWording: false,
        why: "Your message now says what you saw, why you want to talk, and asks for their view. Check that the invented attitude, the guess about another job, and the disciplinary line are gone, because none of them came from your notes.",
        result: {
          label: "The repaired message",
          text: "You arrived after 9am on four days in the last two weeks, and you missed the start of two briefings. I would like to understand what has been happening, and work out together what would help. What have the mornings been like for you recently?",
        },
      },
      bridge:
        "Your opening message is now clean. The next lesson prepares the conversation itself, from the opening to the question you ask first.",
    },
    {
      id: "one-conversation",
      title: "One conversation",
      emphasis: "conversation",
      place:
        "You have evidence and a clean opening. This lesson prepares one conversation from beginning to end, and it teaches the difference between a question that opens the conversation and one that closes it.",
      sections: [
        {
          heading: "Five parts of a prepared conversation",
          paragraphs: [
            "A prepared conversation has five parts. The purpose says in one sentence why you are meeting. The evidence is what you saw, from the second lesson, usually no more than two or three examples. The question is the open question you will ask to hear the other person's view before you offer any solution.",
            "What you will listen for names the answers that would change your view, such as a workload problem you did not know about or a process that makes the deadline impossible. The next step is what you hope to agree, written as an action and a date, with room for the other person to shape it. The next lesson covers those last two parts in detail.",
            "Preparation of this kind is not a script. You will not read it aloud, and the conversation will not follow it line by line. It exists so that you open steadily, listen before you solve, and leave with something agreed.",
          ],
        },
        {
          heading: "The question comes before the solution",
          paragraphs: [
            "In this course, an Open question is one the person can answer in their own words. It cannot be answered with yes or no, and it does not contain your solution or your explanation. 'What happens in the week before the report is due?' is an open question.",
            "A Closed question is one that can be answered with yes or no, or that already carries the answer you expect. 'Can you get the report in by the 5th from now on?' is closed, and so is 'Is the data from the sales team arriving late?', because it offers the person an explanation to agree with. Closed questions have their uses later in a conversation, but asked first they decide the conversation before the person has spoken.",
            "The usual mistake is to open with the solution because it feels efficient. It saves two minutes and loses the one thing you came to hear, which is what the person thinks is going on.",
          ],
          beforeAfter: {
            before: "Do you think you could start earlier in the day?",
            after: "What happens in the mornings before you get in?",
            reading:
              "The first question offers a solution and can be answered with yes or no. The second asks for the person's account of the mornings, so you hear it before you suggest anything.",
          },
        },
        {
          heading: "Informal and formal are different conversations",
          paragraphs: [
            "The preparation in this course is for an informal conversation: a one-to-one, a mid-year review, or a conversation about a concern that has not become formal. Most performance concerns begin and end there, and the Acas advice on managing performance encourages managers to raise concerns early and informally.",
            "If a concern may become formal, the Acas Code of Practice on disciplinary and grievance procedures, your organisation's policy, and your HR adviser govern what happens. A model has no part in those decisions. Do not mention a formal process in an informal conversation unless you have agreed with HR that it is the right step.",
          ],
        },
        {
          heading: "Recording and note-taking",
          paragraphs: [
            "Do not record the conversation or run an AI note-taker in it unless your organisation allows it and the other person has been told and agrees. A performance conversation often turns to workload, health, or life outside work, and the ICO's guidance on monitoring workers expects employers to be clear and proportionate about what they capture.",
            "Do not paste a transcript or your notes of the conversation into a tool afterwards. Write down the next step you agreed, in your own words, and keep it where your organisation keeps records of one-to-ones.",
          ],
        },
      ],
      workedExample: {
        title: "Preparing the conversation about the monthly report",
        inputLabel: "The manager's preparation",
        outputLabel: "What the model helped with",
        prompt:
          "Purpose: to understand what is getting in the way of the report reaching finance by the 5th, and to agree what would help.\nEvidence: the report went to finance after the 5th in March and April, and finance chased twice in April.\nQuestion: What happens in the week before the report is due?\nWhat I will listen for: whether the data arrives late from another team, whether there is a clash with another deadline, and whether anything outside work is affecting them.\nNext step: agree one change and check in after the next report.",
        output:
          "The manager asked the model for five ways to word a question about the week before the deadline, and chose the plainest one. Nothing else on the page came from the model.",
        reading: [
          "The purpose is one sentence, and it names both what the manager wants to understand and what they hope to agree. The evidence is two things the manager saw, with months and the effect on finance.",
          "The question is open. It asks for the person's account of the week and offers no solution or explanation, so the manager hears what is going on before suggesting anything.",
          "The listening line names three answers that would change the manager's view. The model helped only with the wording of the question, which is preparation, and every judgement on the page is the manager's.",
        ],
      },
      practice: {
        intro:
          "Here are four questions a manager might ask first in a conversation about late reports. Mark each one with the two labels from the second section above.",
        check: {
          kind: "mark",
          prompt: "Mark each question as an Open question or as a Closed question.",
          passLabel: "Open question",
          failLabel: "Closed question",
          sentences: [
            {
              id: "week",
              text: "What happens in the week before the report is due?",
              fail: false,
              why: "The person can only answer this in their own words, and it offers no solution, so it is open.",
            },
            {
              id: "fifth",
              text: "Can you get the report in by the 5th from now on?",
              fail: true,
              why: "This can be answered with yes or no, and it contains the solution, so it is closed.",
            },
            {
              id: "sales",
              text: "Is the data from the sales team arriving late?",
              fail: true,
              why: "This offers the person an explanation to agree with and can be answered yes or no, so it is closed.",
            },
            {
              id: "month",
              text: "How does the end of the month look for you at the moment?",
              fail: false,
              why: "This asks for the person's account in their own words, so it is open.",
            },
          ],
          why: "That is right. The two open questions ask for the person's account, and the two closed questions offer a solution or an explanation before they have spoken.",
        },
      },
      check: {
        kind: "choose",
        prompt:
          "Two managers wrote the opening of the same conversation about a team member who has missed the start of briefings. Choose the opening that follows this lesson.",
        leftLabel: "Opening A",
        left: "I would like to talk about the start of the day. You arrived after nine on four days in the last two weeks and missed the start of two briefings. Before I say anything else, what has been happening in the mornings?",
        rightLabel: "Opening B",
        right:
          "I have noticed you are not very engaged at the moment, and I think we need to sort out your attitude to timekeeping before it becomes a bigger problem. Here is what I would like you to do.",
        correct: "left",
        why: "Opening A states the purpose and what the manager saw, then asks an open question to hear the other person's view before any solution is offered.",
        wrong:
          "Look again at Opening B. It starts with inferences about engagement and attitude, gives no evidence, and moves to instructions before the person has spoken. Opening A has a purpose, the evidence, and an open question.",
      },
      bridge:
        "You can now open the conversation. The next lesson prepares what you will listen for and the next step you hope to agree, and it says where an informal conversation ends.",
    },
    {
      id: "what-would-change-your-view",
      title: "What would change your view",
      emphasis: "view",
      place:
        "The last lesson prepared the opening and the first question. This lesson prepares the second half of the conversation: what you will listen for, and the next step you hope to agree.",
      sections: [
        {
          heading: "Listening for something specific",
          paragraphs: [
            "Before the conversation, write down the answers that would change your view. For late reports these might be that the data arrives late from another team, that the report clashes with another deadline, or that the process needs a sign-off from someone who is rarely available. Naming them in advance makes you listen for them, rather than waiting for your turn to speak.",
            "This is not listening for excuses. A manager who writes 'whether they have a good excuse' has already decided that any explanation is an excuse, and will hear every answer that way. A manager who writes the causes they would want to know about is ready to change their mind, which is the reason for asking an open question first.",
          ],
        },
        {
          heading: "When the answer is personal",
          paragraphs: [
            "Sometimes the answer is about health, caring responsibilities, or something else outside work. When that happens, listen, thank the person for telling you, and point them to the support your organisation offers, such as an employee assistance programme, occupational health, or a conversation with HR about flexible working. You do not need the details to do that, so do not ask for them.",
            "Do not write what the person told you about their private life into your preparation notes, and never put it into a model. If it changes the next step, record only the step, such as 'agreed to review deadlines again in four weeks', and let HR advise on anything more.",
          ],
        },
        {
          heading: "A next step you agree together",
          paragraphs: [
            "In this lesson, an Agreed step is a next step that names an action, who will take it, and a date or an occasion when you will look at it again. 'Agree one change to the week before the deadline and check in after the May report' is an agreed step. It is written as something you hope to agree, so the person can shape it in the room.",
            "A Vague hope is a next step that names none of those things, such as 'things need to improve' or 'tell them I expect better'. It sounds firm, but neither of you will know on the day whether it has happened. The usual mistake is to write the next step as an instruction to the person, when it should be something you both leave the room having agreed.",
          ],
          beforeAfter: {
            before: "Next step: they need to sort this out.",
            after:
              "Next step: agree one change to how the report is put together and check in after the June report.",
            reading:
              "The first line gives an instruction with no action and no date. The second names what will change and when you will look at it again, and leaves the person room to suggest the change.",
          },
        },
        {
          heading: "Where the informal conversation ends",
          paragraphs: [
            "If what you hear suggests a serious concern, such as a pattern that has not improved after earlier conversations or a conduct issue, stop preparing for an informal conversation. Speak to your HR adviser, read your policy, and follow the Acas Code of Practice on disciplinary and grievance procedures. The next step on your sheet becomes 'speak to HR', and nothing more.",
            "Do not ask a model what to do next about the person. That is a judgement, and it belongs with you and HR. A model can help you word the invitation to a follow-up conversation once the decision is made, which is preparation.",
          ],
        },
      ],
      workedExample: {
        title: "Revising the second half of a preparation",
        inputLabel: "The manager's first draft",
        outputLabel: "The draft after revision",
        prompt:
          "What I will listen for: whether they have a reason.\nNext step: they need to get better at handovers.",
        output:
          "What I will listen for: whether the handover template is too long, whether the late shift starts before the early shift has finished its calls, and whether anything outside work is affecting them.\nNext step: agree one change to the handover and check in on Friday 14 November.",
        reading: [
          "The first listening line named no cause, so the manager would have heard every answer as a reason to be weighed. The revised line names three things that would change the manager's view, including one about life outside work, which the manager will listen to without asking for detail.",
          "The first next step was a vague hope written as an instruction. The revised step names an action, leaves the person room to choose the change, and gives a date on which both of them will look at it again.",
        ],
      },
      practice: {
        intro:
          "Here are three next steps from different managers' preparation. Mark each one with the two labels from the third section above.",
        check: {
          kind: "mark",
          prompt: "Mark each next step as an Agreed step or as a Vague hope.",
          passLabel: "Agreed step",
          failLabel: "Vague hope",
          sentences: [
            {
              id: "improve",
              text: "Things need to improve from here.",
              fail: true,
              why: "This names no action, no person, and no date, so it is a vague hope.",
            },
            {
              id: "rota",
              text: "Agree who covers the phones during the 8.30 huddle and review it at our one-to-one on 3 December.",
              fail: false,
              why: "This names an action and a date to look at it again, so it is an agreed step.",
            },
            {
              id: "expect",
              text: "Make it clear that I expect better.",
              fail: true,
              why: "This is an instruction to the person with nothing to check, so it is a vague hope.",
            },
          ],
          why: "That is right. Only the rota step names an action and a date, so it is the only one both people could check.",
        },
      },
      check: {
        kind: "edit",
        prompt:
          "A manager has prepared the conversation about the monthly report, but the listening line and the next step would not help them in the room. Edit the preparation so that it names what would change the manager's view and a next step with an action and a time. Keep the purpose.",
        label: "The preparation you are repairing",
        start:
          "Purpose: to talk about the missed reports.\nWhat I will listen for: whether they have a good excuse.\nNext step: tell them it has to stop and that I expect better.",
        unchanged:
          "You have not changed the preparation yet. Replace the listening line with the causes that would change your view, and write a next step with an action and a time.",
        keep: [
          {
            id: "purpose",
            any: ["report"],
            missing:
              "Keep the purpose. The preparation should still say that the conversation is about the monthly report.",
          },
        ],
        limits: [
          {
            id: "listen",
            any: ["workload", "another team", "other team", "clash", "data", "support", "outside work", "process", "deadline", "priorit", "training", "system", "sign-off", "sign off"],
            missing:
              "The listening line does not yet name anything that would change your view. Name a cause you would want to know about, such as late data from another team or a clashing deadline.",
          },
          {
            id: "action",
            any: ["agree", "check in", "try", "review", "change", "meet again", "look again"],
            missing:
              "The next step does not yet name an action you hope to agree, such as agreeing one change to how the report is put together.",
          },
          {
            id: "time",
            any: ["by ", "next week", "next month", "after the next", "monday", "tuesday", "wednesday", "thursday", "friday", "on the ", "date", "weeks", "end of"],
            missing:
              "The next step does not yet say when you will look at it again. Add a date or an occasion, such as after the next report.",
          },
        ],
        limitWording: false,
        why: "Your preparation now names the answers that would change your view and a next step both of you could check, so you will listen for causes and leave with something agreed.",
        result: {
          label: "The preparation after your repair",
          text: "Purpose: to understand what gets in the way of the monthly report and agree what would help.\nWhat I will listen for: late data from another team, a clashing deadline, or something outside work.\nNext step: agree one change and check in after the next report.",
        },
      },
      bridge:
        "You have now prepared every part of one conversation. The next lesson tests the whole method on situations you have not yet seen.",
    },
    {
      id: "course-assessment",
      title: "The course assessment",
      emphasis: "assessment",
      place:
        "This is the sixth of seven lessons. It brings the whole method together, works one mixed example, and then assesses it on seven situations you have not yet seen.",
      sections: [
        {
          heading: "The method from the first two lessons",
          paragraphs: [
            "Every task before a conversation is either Preparation or Judgement. Preparation helps you hold the conversation you have already decided to have: a structure, the wording of an open question, a rehearsal of your opening. Judgement decides what you think of the person: a rating, whether an objective was met, whether a concern should become formal, or why they performed as they did. A model may help with preparation, with no personal information your organisation has not approved for the tool, and the judgement stays with you.",
            "Every judgement rests on evidence you saw. Something I saw names an action, an occasion, and where possible the effect. Something I inferred names a trait, a motive, or a pattern. Inferences are set aside or turned back into the observation that led to them, because feedback aimed at the person rather than the work invites a defence rather than a discussion.",
          ],
        },
        {
          heading: "The method from lessons three to five",
          paragraphs: [
            "A model's draft adds characterisations, causes, and outcomes that were never in your notes. The repair keeps what you saw, a purpose, and an open question, and removes the rest. An outcome such as 'further action may follow' is removed unless you have decided it with HR, because a formal process follows your policy and the Acas Code of Practice, not a feedback message.",
            "A prepared conversation has a purpose, two or three pieces of evidence, an open question asked before any solution, a note of what would change your view, and a next step with an action and a date. If the person tells you something personal, you listen, point to support, and keep it out of your notes and out of any tool. You do not record the conversation or run a note-taker unless your organisation allows it and the person has agreed.",
          ],
        },
        {
          heading: "How the assessment works",
          paragraphs: [
            "The assessment has seven situations. Each one describes a manager's week and asks what they should do. Every option is something a reasonable manager might do, and exactly one of them follows the method.",
            "You need six of the seven to pass. When you submit, each question shows whether your choice was right and why, so you can see what to look at again before you try once more.",
          ],
        },
      ],
      workedExample: {
        title: "One preparation with several problems",
        inputLabel: "A manager's plan for a Thursday one-to-one",
        outputLabel: "The plan after the method is applied",
        prompt:
          "Paste my notes on Dev into the model and ask it to write the feedback. Notes: seems distracted lately, two client emails went unanswered for three days last week, probably because of the house move. Ask it whether this counts as a performance issue. Open with: 'Can you be more responsive to clients?' Next step: be more on top of things.",
        output:
          "Ask the model for an order for a thirty-minute one-to-one about client response times, with no names or notes.\nEvidence: two client emails last week went unanswered for three days.\nOpen with: 'I would like to talk about client response times. Two client emails last week waited three days for a reply. What has the week been like for you?'\nListen for: workload, how the shared inbox is covered, and anything outside work.\nNext step: agree how the inbox is covered and check in on Thursday 20 November.\nDecided: this is an informal conversation. Not decided: whether there is a performance concern.",
        reading: [
          "The original plan put the person's name and notes into the model and asked it to write the feedback and decide whether there is a performance issue. Both are judgement. The revised plan asks the model only for an order, with nothing personal in it.",
          "'Seems distracted' is an inference and 'probably because of the house move' is a guessed private cause, so both are gone. The two unanswered emails are what the manager saw, and they carry the conversation.",
          "The opening question was closed and contained the solution. The revised opening states the purpose and the evidence, then asks an open question. The next step now names an action and a date, and the last line makes clear what the manager has and has not decided.",
        ],
      },
      practice: {
        intro:
          "Before the assessment, choose between two requests a manager might send to a model. The first section above describes the line between them.",
        check: {
          kind: "choose",
          prompt:
            "A manager has a conversation next week about late project handovers. Choose the request that keeps the judgement with the manager.",
          leftLabel: "Request A",
          left: "Here are my notes on the team member. Write the feedback for their annual review and suggest a rating.",
          rightLabel: "Request B",
          right:
            "Suggest an order for a thirty-minute conversation about project handovers, and word two open questions about what gets in the way. Do not describe the person or suggest a rating.",
          correct: "right",
          why: "Request B asks only for structure and questions, which is preparation, and it tells the model not to describe the person. Request A hands over the feedback and the rating, which are both judgements.",
          wrong:
            "Look again at Request A. Writing the review feedback and suggesting a rating are judgements about the person, and the notes would give the model personal information. Request B asks only for preparation.",
        },
      },
      check: {
        kind: "scenario",
        prompt:
          "Read each situation and choose what the manager should do. You need six of the seven to pass.",
        passMark: 6,
        questions: [
          {
            id: "ratings",
            situation:
              "Farah is an operations manager at Kestrel Housing with annual reviews for six caseworkers next week. Her organisation has approved one model for drafting, and its policy allows no personal data in prompts. She has an hour on Monday to prepare.",
            question: "Which use of the model keeps the judgement with Farah?",
            options: [
              {
                id: "a",
                text: "Paste each caseworker's objectives and results into the model and ask which rating fits each one.",
                feedback:
                  "A rating is a judgement, and the prompt would put personal data into the tool against the policy. Ask the model only for a structure or questions, and decide the ratings yourself.",
              },
              {
                id: "b",
                text: "Ask the model to rank the six caseworkers from strongest to weakest so she has a starting point for calibration.",
                feedback:
                  "A ranking is a judgement about each person, and a starting point from the model becomes the answer surprisingly often. Keep the ranking with yourself and use the model for preparation.",
              },
              {
                id: "c",
                text: "Ask the model for a structure for a forty-five minute annual review and two open questions about development, with no names.",
                correct: true,
                feedback:
                  "Right. A structure and open questions are preparation, the request contains no personal data, and every rating stays with Farah.",
              },
              {
                id: "d",
                text: "Ask the model to write a summary paragraph for each review form from her bullet notes, then edit them.",
                feedback:
                  "A summary for the review form is the assessment itself, even though it looks like drafting, and the model will fill gaps in the notes with characterisations. Write the summaries yourself.",
              },
            ],
          },
          {
            id: "evidence",
            situation:
              "Gareth leads a team of call handlers at Pennant Insurance. His notes on one handler read: 'Seems checked out. Average handling time went from six to nine minutes over March. Complaints on 14 and 21 March both mention being put on hold without explanation.'",
            question: "Which sentence should open the evidence part of his preparation?",
            options: [
              {
                id: "a",
                text: "Your average handling time rose from six to nine minutes during March, and complaints on the 14th and the 21st both mentioned being put on hold without an explanation.",
                correct: true,
                feedback:
                  "Right. It names the work, the numbers, the dates, and the effect on customers, so the handler can respond to it.",
              },
              {
                id: "b",
                text: "You seem checked out at the moment, and it is showing in your calls.",
                feedback:
                  "'Checked out' is an inference about a state of mind. The handler can only defend themselves against it. Open with the handling times and the two complaints, which Gareth saw.",
              },
              {
                id: "c",
                text: "Your attitude on calls has slipped, for example your handling time went up in March.",
                feedback:
                  "The evidence is there, but the inference about attitude leads, so the handler hears a judgement of their character first. Write the handling times and the complaints on their own.",
              },
            ],
          },
          {
            id: "cause",
            situation:
              "Marta, a finance manager at Hollins and Webb, asked the approved model to tidy her notes into an opening message about two late month-end reconciliations. The draft it returned includes the sentence 'This may be linked to the stress of your recent divorce.' Marta knows about the divorce from office conversation, but the person has never raised it with her.",
            question: "What should Marta do with that sentence?",
            options: [
              {
                id: "a",
                text: "Soften it to 'I know things may be hard outside work at the moment' so that it sounds supportive.",
                feedback:
                  "The softer version is still a guessed private cause, and it tells the person their private life has been discussed. Remove it and let them raise anything personal themselves.",
              },
              {
                id: "b",
                text: "Remove it, and keep the message to the two late reconciliations, the purpose, and an open question.",
                correct: true,
                feedback:
                  "Right. A guessed cause about someone's private life is intrusive and did not come from anything they told you. The repaired message says what Marta saw and asks for the person's view.",
              },
              {
                id: "c",
                text: "Leave it out of the message but ask in the meeting whether the divorce is the reason for the late work.",
                feedback:
                  "Asking directly puts the same guess into the room and asks for private information Marta does not need. Ask an open question about the work and listen for what the person chooses to tell you.",
              },
            ],
          },
          {
            id: "outcome",
            situation:
              "Owen manages the stores team at Brackley Engineering. The model's draft of his opening message ends with 'If this does not improve, we will move to a formal capability process.' Owen has not spoken to HR, and this is the first conversation about the missed stock counts.",
            question: "What should Owen do with the last sentence?",
            options: [
              {
                id: "a",
                text: "Keep it, because it makes the expectation clear from the start.",
                feedback:
                  "It commits Owen to a formal process nobody has decided on and turns a first informal conversation into a threat. Remove it and speak to HR first if a formal route may be needed later.",
              },
              {
                id: "b",
                text: "Change it to 'further action may follow', which is less specific.",
                feedback:
                  "'Further action' still tells the person they are in a process. The problem is the outcome, not the wording. Remove it.",
              },
              {
                id: "c",
                text: "Move it to the end of the conversation, after he has heard the other person's view.",
                feedback:
                  "The timing does not change the problem. Nobody has decided on a formal process, and that decision follows the policy, the Acas Code, and advice from HR. Remove it.",
              },
              {
                id: "d",
                text: "Remove it, and if he later thinks a formal route may be needed, speak to his HR adviser and follow the policy before saying anything about it.",
                correct: true,
                feedback:
                  "Right. An outcome stays out of an informal message unless it has been decided with HR, and a formal process follows the policy and the Acas Code of Practice.",
              },
            ],
          },
          {
            id: "question",
            situation:
              "Nia runs a small design team at Larkfield Studio. Handover notes for the evening production shift were due by 5pm and went out after 6pm on three days last week. She wants a first question for Wednesday's one-to-one.",
            question: "Which question should Nia ask first?",
            options: [
              {
                id: "a",
                text: "Would starting the handover at 4pm fix the problem?",
                feedback:
                  "This offers Nia's solution before she has heard what gets in the way, and it can be answered yes or no. Ask an open question first.",
              },
              {
                id: "b",
                text: "What gets in the way of the handover notes going out by 5pm?",
                correct: true,
                feedback:
                  "Right. The person can only answer in their own words, and the question contains no solution, so Nia hears their account first.",
              },
              {
                id: "c",
                text: "Do you accept that the handovers were late three times last week?",
                feedback:
                  "This is closed and puts the person on the defensive. The evidence belongs in the opening statement, followed by an open question.",
              },
            ],
          },
          {
            id: "recording",
            situation:
              "Tom manages a remote analyst at Selby Freight and holds one-to-ones on video calls. The company has started a pilot of an AI note-taker, and the policy says it may be used in project meetings only. Tom's next one-to-one is about repeated errors in the weekly forecast.",
            question: "What should Tom do about notes?",
            options: [
              {
                id: "a",
                text: "Turn the note-taker on and tell the analyst at the start that it is running.",
                feedback:
                  "Telling the person is necessary but not enough. The policy does not allow the note-taker in one-to-ones, so it should stay off.",
              },
              {
                id: "b",
                text: "Leave the note-taker off, and write down the next step they agree, in his own words, afterwards.",
                correct: true,
                feedback:
                  "Right. The policy does not allow the note-taker here, and a short note of the agreed step is all the record the conversation needs.",
              },
              {
                id: "c",
                text: "Record the call locally and paste the transcript into the model afterwards for a summary.",
                feedback:
                  "This captures the whole conversation without agreement and puts it into a tool. Leave recording off and note only the next step you agreed.",
              },
            ],
          },
          {
            id: "personal",
            situation:
              "In a one-to-one about missed shift swaps, a warehouse team leader at Calder Logistics tells Aisha, their manager, that they have been caring for a parent after a hospital stay. Aisha had planned to agree a new swap process and check in in two weeks.",
            question: "What should Aisha do?",
            options: [
              {
                id: "a",
                text: "Ask for details of the parent's condition so that her notes of the conversation are accurate.",
                feedback:
                  "Aisha does not need the details to help, and writing them down creates a record of health information about someone else. Listen, point to support, and note only the step you agree.",
              },
              {
                id: "b",
                text: "Afterwards, describe the situation to the model and ask what adjustments she should offer.",
                feedback:
                  "This puts private information into a tool and asks the model to make a judgement. Speak to HR about what support and flexibility the organisation offers.",
              },
              {
                id: "c",
                text: "Listen, thank them for saying so, point them to the support and flexible working options the organisation offers, and record only the next step they agree.",
                correct: true,
                feedback:
                  "Right. This is exactly the answer the listening line prepares for. Aisha changes her view, offers support without asking for details, and keeps the private information out of her notes.",
              },
            ],
          },
        ],
        why: "You kept the judgements with the manager, worked from what was seen, removed invented causes and outcomes, asked open questions first, and kept private information out of notes and tools.",
      },
      bridge:
        "You have applied the method across seven situations. In the final lesson you write the preparation sheet for your own real conversation, and that sheet is the work your record will show.",
    },
    {
      id: "the-sheet",
      title: "The preparation sheet",
      emphasis: "sheet",
      place:
        "This is the last lesson. You will write the preparation sheet for one real conversation you have coming up, and that sheet is what your signed record shows.",
      sections: [
        {
          heading: "What the sheet is",
          paragraphs: [
            "The preparation sheet is the page you take into the conversation. It holds the purpose, two or three pieces of evidence written as things you saw, the open question you will ask first, what you will listen for, and the next step you hope to agree, with a date.",
            "Choose a real conversation in the next few weeks: a one-to-one, a mid-year review, or an informal conversation about a concern. A real conversation is better than an invented one, because you know the evidence and you will find out whether the preparation helped.",
          ],
        },
        {
          heading: "Two lines that make the judgement visible",
          paragraphs: [
            "The sheet has two lines that no other preparation page has. The first says what the model helped with. It should name preparation only, such as the structure, the order of the agenda, the wording of a question, or a rehearsal of the opening. If you did not use a model, say so.",
            "The second says what you have decided and what you have not decided yet. For most informal conversations you will have decided that the conversation is informal, and you will not have decided whether there is a performance concern until you have heard the other person's view. Writing both halves shows a reader that the judgement is yours and that it is still open where it should be.",
          ],
        },
        {
          heading: "What stays off the sheet",
          paragraphs: [
            "The sheet does not name the other person. Your record will be seen by a verifier, and you do not need a name to show that you can prepare well. Write 'the team member' or the role instead. Leave out email addresses and telephone numbers for the same reason.",
            "The sheet does not include anything the person has told you about their health, their family, or their private life. It is not a performance review and not a note for the person's file. It is your preparation, and it should read as preparation to anyone who opens it.",
          ],
        },
        {
          heading: "How the sheet is checked",
          paragraphs: [
            "When you continue, each part is checked. The purpose has to say why you are meeting. What I saw has to contain something concrete, such as a date, a day, a month, or a number. The first question has to be open, starting with words such as what or how. What you will listen for has to name a cause that would change your view. The next step has to name an action and a date.",
            "The model line has to name preparation, such as structure, wording, or rehearsal. The decision line has to say what you have decided and what you have not. If a part is missing, the note names it and says what to add. The record shows the sheet exactly as you wrote it.",
          ],
        },
      ],
      workedExample: {
        title: "A completed preparation sheet",
        inputLabel: "The sheet",
        outputLabel: "What a verifier sees",
        prompt:
          "Purpose: to understand what is getting in the way of the monthly report and agree what would help.\nWhat I saw: the report was sent after the 5th in March and April, and finance chased twice in April.\nThe question I will ask first: What happens in the week before the report is due?\nWhat I will listen for: late data from another team, a clashing deadline, or something outside work.\nThe next step I hope to agree, with a date: agree one change and check in after the June report.\nWhat the model helped with: the wording of the question and the order of the agenda.\nWhat I have decided and what I have not: I have decided this is an informal conversation. I have not decided whether there is a performance concern until I have heard their view.",
        output:
          "A manager who prepared from dated evidence, asked an open question before offering a solution, named what would change their mind, used the model only for wording and order, and left the judgement open.",
        reading: [
          "Every piece of evidence on the sheet is something the manager saw, with months and the effect on finance. There is no trait, no guessed cause, and no mention of a formal process.",
          "The last two lines show the reader where the model stopped and where the manager's judgement began. A verifier who never met either person can see that the preparation was done properly.",
        ],
      },
      practice: {
        intro:
          "Before you write your own sheet, read these lines from another manager's draft and mark each one. The sections above describe what belongs on the sheet.",
        check: {
          kind: "mark",
          prompt: "Mark each line as Ready for the sheet or as Names a trait or a judgement.",
          passLabel: "Ready for the sheet",
          failLabel: "Names a trait or a judgement",
          sentences: [
            {
              id: "seen",
              text: "What I saw: the stock count was submitted on Wednesday instead of Monday in two of the last three weeks.",
              fail: false,
              why: "This names the work, the days, and how often, so it is ready for the sheet.",
            },
            {
              id: "trait",
              text: "What I saw: generally careless with paperwork.",
              fail: true,
              why: "'Careless' is a trait. Write what you saw that led you to it.",
            },
            {
              id: "model",
              text: "What the model helped with: it decided the concern was minor.",
              fail: true,
              why: "Deciding how serious a concern is, is a judgement. The first lesson keeps it with you.",
            },
            {
              id: "decided",
              text: "What I have decided and what I have not: this is informal, and I have not decided whether there is a concern.",
              fail: false,
              why: "This says what is decided and what is still open, so it is ready for the sheet.",
            },
          ],
          why: "That is right. The dated evidence and the decision line are ready, and the trait and the model's judgement need to come off the sheet.",
        },
      },
      check: {
        kind: "build",
        prompt:
          "Write your preparation sheet for one real conversation. Leave out the person's name, their contact details, and anything they have told you about their health or private life.",
        fields: [
          {
            id: "purpose",
            label: "Purpose",
            hint: "One or two sentences on why the conversation is happening.",
            min: 20,
            any: ["understand", "talk about", "agree", "discuss", "review", "look at", "hear", "work out"],
            missing:
              "The purpose does not yet say why you are meeting. Write one sentence such as 'to understand what gets in the way of the report and agree what would help'.",
          },
          {
            id: "seen",
            label: "What I saw",
            hint: "Two or three things you saw or heard, each with an occasion or a time, and the effect if you know it.",
            min: 40,
            rule: "fact",
            missing:
              "What I saw does not yet contain anything concrete. Name the occasion or time, such as a date, a day, a month, or a number, for each thing you saw, and leave out traits.",
          },
          {
            id: "question",
            label: "The question I will ask first",
            hint: "An open question the person can answer in their own words, with no solution in it.",
            min: 12,
            any: ["what", "how", "tell me", "talk me through", "walk me through"],
            missing:
              "The first question is not yet open. Ask a question the person can answer in their own words, starting with what or how.",
          },
          {
            id: "listen",
            label: "What I will listen for",
            hint: "The answers that would change your view, such as a workload problem or a process that gets in the way.",
            min: 20,
            any: ["workload", "whether", "team", "clash", "deadline", "process", "data", "support", "outside work", "training", "system", "priorit", "tools", "cover"],
            missing:
              "What I will listen for does not yet name anything that would change your view. Name a cause you would want to know about, such as workload, a clashing deadline, or a process.",
          },
          {
            id: "next",
            label: "The next step I hope to agree, with a date",
            hint: "An action you hope to agree together, and the date or occasion when you will look at it again.",
            min: 20,
            rule: "fact",
            any: ["agree", "check in", "review", "try", "change", "meet", "look at", "follow up"],
            missing:
              "The next step needs an action and a date. Write what you hope to agree, such as one change to the process, and when you will check in, such as a date or the next report.",
          },
          {
            id: "model",
            label: "What the model helped with",
            hint: "Preparation only, such as structure, wording, or rehearsal. Say so if you did not use one.",
            min: 12,
            any: ["structure", "wording", "word", "rehears", "question", "agenda", "order", "opening", "practis", "did not use", "didn't use", "no model", "nothing"],
            missing:
              "What the model helped with should name preparation only, such as the structure, the wording of a question, or a rehearsal. A rating, a decision, or a summary for the review form is a judgement, and the first lesson keeps it with you.",
          },
          {
            id: "decided",
            label: "What I have decided and what I have not",
            hint: "What you have already decided, and what you will decide only after you have heard their view.",
            min: 20,
            any: ["decided", "have not", "haven't", "not yet", "until", "after i have heard", "after hearing"],
            missing:
              "Say what you have decided and what you have not, for example that the conversation is informal and that you have not decided whether there is a concern until you have heard their view.",
          },
        ],
        why: "Your sheet has every part. It works from what you saw, opens with an open question, names what would change your view, agrees a dated next step, and shows that the model helped only with preparation while the judgement stayed with you.",
      },
      bridge:
        "Your preparation sheet is complete. Sign your name below, and the record will show the sheet, the course, and the date to anyone who opens the reference.",
    },
  ],
};
