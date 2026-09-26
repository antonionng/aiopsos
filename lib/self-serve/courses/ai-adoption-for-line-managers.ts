/*
Course: AI Adoption for Line Managers
Slug: ai-adoption-for-line-managers
For: Line managers, team leaders, supervisors, and middle managers in any function whose team members have started
  using AI tools, and the HR business partners who support them. They manage at least one person, hold regular
  one-to-ones, and know which tools their team is allowed to use. They do not need to be heavy users themselves.
Outcome: The learner can hold a one-to-one about a piece of AI-touched work using a four-part standard (owned,
  declared, checked, within limits), ask three questions that show how the work was made, read the work for claims
  that have no source, return it with a question instead of rewriting it, and tell signs in the work from counts of
  tool activity.
Artefact: The one-to-one standard card: the standard in four lines, the three questions in the manager's words,
  three signs in the work and when they will be looked for, and the one thing the manager will ask for next.
Record sentence: Wrote and signed a one-to-one standard card that sets out how they will review AI-touched work,
  what they will ask, and how they will tell whether the standard has taken hold.
Lessons (id, title, move, interaction, pass rule):
  1. the-standard, The standard, tell a review standard from a usage rule, choose (practice: build of four parts),
     pass when the standard with owned, declared, checked, and within limits is chosen.
  2. ask-what-the-tool-did, Ask what the tool did, ask the three questions, choose (practice: build of three
     questions), pass when the exchange that asks all three and leaves the next step with the person is chosen.
  3. review-the-work, Review the work, find factual sentences with no source, mark with "Checked against a source"
     and "Not yet checked", pass when every sentence is marked correctly.
  4. return-it-with-a-question, Return it with a question, turn fixes into questions, edit, pass when each of the
     four comments names its sentence and asks the person to resolve it (date source, the fault line, the apology
     paragraph returned, who agreed the discount) and at least one question mark is present.
  5. signs-it-stuck, Signs it stuck, tell signs in the work from activity counts, mark with "Sign in the work" and
     "Activity count", pass when every item is marked correctly.
  6. the-standard-in-practice, The standard in practice, course assessment, scenario of eight questions, pass mark
     six of eight.
  7. what-you-ask-for-next, What you ask for next, write the one-to-one standard card, build, pass when every field
     meets its rule: owned, declared, checked, a limit sentence naming personal or confidential data, three
     questions, signs seen in the work, a dated time to look, and one change the team will make.
Sources:
  GOV.UK, the Artificial Intelligence Playbook for the UK Government.
  The ICO, Guidance on AI and data protection.
  The CIPD factsheet on evidence-based practice.
  Acas advice on having difficult conversations at work.
  The Working Time Regulations 1998 and the GOV.UK guidance on rest breaks at work.
Tested on phone:          no
Tested returning learner: no
Pass rule tests written:  yes
*/

import type { CourseContent } from "./types.ts";

const CHECKED = "Checked against a source";
const UNCHECKED = "Not yet checked";
const SIGN = "Sign in the work";
const COUNT = "Activity count";

const OWNED_WORDS = ["own", "responsib", "accountable"];
const DECLARED_WORDS = [
  "tool did",
  "gave the tool",
  "gave it",
  "what you gave",
  "what went in",
  "say what",
  "tell me",
  "declare",
  "which parts",
  "drafted",
];
const CHECKED_WORDS = ["check", "source", "verif"];
const LIMIT_DATA_WORDS = [
  "personal",
  "customer",
  "colleague",
  "confidential",
  "data",
  "approved",
  "allowed",
  "client",
  "candidate",
];
const SIGN_WORDS = [
  "source",
  "checked",
  "caught",
  "asked",
  "marked",
  "flagged",
  "declared",
  "note",
  "error",
  "without being asked",
  "question",
];

export const COURSE: CourseContent = {
  slug: "ai-adoption-for-line-managers",
  hours: 2.5,
  artefact: {
    lessonId: "what-you-ask-for-next",
    title: "The one-to-one standard card",
    recordLine:
      "Wrote and signed a one-to-one standard card that sets out how they will review AI-touched work, what they will ask, and how they will tell whether the standard has taken hold.",
  },
  lessons: [
    {
      id: "the-standard",
      title: "The standard",
      emphasis: "standard",
      place:
        "This is the first of seven lessons. Before you review a single piece of work, you need a short statement of what good looks like when a tool has helped with it. This lesson sets out that standard, and the rest of the course uses it.",
      sections: [
        {
          heading: "What a one-to-one standard is",
          paragraphs: [
            "A one-to-one standard for AI-touched work is a short statement of what good looks like when a team member hands in work that a tool helped to produce. AI-touched work means any piece of work where a tool drafted, summarised, rewrote, translated, or suggested part of what was handed in. It might be a supplier comparison, a customer letter, a rota note, or a briefing for a director. The standard applies to the work, whatever the tool did.",
            "This course uses a standard with four parts. The work is owned. The use is declared. The facts are checked. The work is within limits. Each part is a sentence a team member can meet and a manager can ask about, and together they fit on a few lines that you can share with the team and keep beside you in one-to-ones.",
          ],
        },
        {
          heading: "The four parts",
          paragraphs: [
            "The work is owned means that the person who hands it in is responsible for every sentence and figure in it, whoever or whatever drafted it. If a figure is wrong, it is their figure. This is the same rule you would apply to work a colleague drafted for them, and it stops 'the tool wrote that' from becoming an explanation for an error.",
            "The use is declared means that the person can say what they gave the tool and what the tool gave back. They do not need to keep a log of every prompt. They need to be able to answer, in a sentence, what went in and what came out, so that you and they can see where the work came from.",
            "The facts are checked means that each claim, figure, date, name, or reference has been compared with a source the person can name. A source is something outside the tool: the finance system, the signed contract, the supplier's price list, the rota, or a published page on GOV.UK. The tool's own confident wording is not a source.",
            "The work is within limits means that nothing went into the tool that the organisation does not allow. For most teams, the limit that matters most is personal data about customers, candidates, or colleagues, together with anything marked confidential. The ICO's guidance on AI and data protection explains why personal data should not go into tools the organisation has not approved, and your own organisation's rules say which tools are approved for what.",
          ],
        },
        {
          heading: "What a standard is not",
          paragraphs: [
            "A standard is not a rule about how much people should use AI. A line such as 'everyone must use the assistant for three tasks a week' tells people what to do with the tool, and says nothing about whether the work that comes out is any good. A person can meet a usage target and still hand in a report with an invented figure in it.",
            "A standard is also not a ban, and it is not a way for the manager to take over the work. The manager's job is to hold the standard in the conversation. The team member's job is to meet it. A standard that ends with 'and I will check everything before it goes out' has quietly moved the responsibility back to the manager.",
          ],
          beforeAfter: {
            before:
              "Please use the AI assistant for all first drafts from now on, and I will review everything before it goes out.",
            after:
              "When a tool helps with your work, you still own it. Be ready to tell me what you gave it and what it gave back. Check every figure, date, and reference against a source you can name. Keep customer and colleague details out of the tool.",
            reading:
              "The first version is a usage rule followed by a promise that the manager will do all the checking. The second states the four parts and leaves the responsibility with the person doing the work.",
          },
        },
        {
          heading: "Why it matters, and the usual mistake",
          paragraphs: [
            "Tools produce fluent text quickly, and fluent text is easy to wave through. Without a standard, a manager ends up doing one of two things. Either they read every AI-touched document line by line, which does not last beyond a busy fortnight, or they stop reading closely at all, and the first unchecked figure reaches a customer or a director.",
            "The usual mistake is to start with the tool rather than the work. Managers who are asked to encourage adoption set targets for use, send round lists of good prompts, and count licences. None of that tells a team member what they will be asked when they hand work in. The standard does, and it works the same way whether or not the person used a tool at all.",
          ],
        },
      ],
      workedExample: {
        title: "Two versions of a team note",
        inputLabel: "The first team note",
        prompt:
          "From now on, please use the AI assistant for every first draft, and I will review everything that comes out of it before it goes anywhere. Thanks, Rachel.",
        outputLabel: "The note that went out",
        output:
          "When a tool helps with your work, you still own it. Be ready to tell me what you gave it and what it gave back. Check every figure, date, and reference against a source you can name. Keep customer and colleague details out of the tool. I will ask about this in our one-to-ones. Thanks, Rachel.",
        reading: [
          "Rachel Osei manages a team of seven in the customer operations office at Brackley Water. Her first note sets a usage rule, which is to use the assistant for every first draft, and then promises that she will personally review everything. With seven people drafting faster than before, that promise would have her reading all day within a month.",
          "The note that went out has the four parts in four sentences. 'You still own it' is ownership. 'Tell me what you gave it and what it gave back' is declaring the use. 'Check every figure, date, and reference against a source you can name' is checking the facts. 'Keep customer and colleague details out of the tool' is the limit.",
          "The last line tells the team where the standard will be held, which is in the one-to-ones they already have. It does not add a new meeting or a log. It also says nothing about how often to use the tool, because that is not what Rachel is reviewing.",
        ],
      },
      practice: {
        intro:
          "Write a first version of your own team's standard, one short line for each part. The worked example is above if you want to compare. Write what good work looks like, not how often to use the tool. You will revise this in the last lesson.",
        check: {
          kind: "build",
          prompt: "Write one line for each part of your team's standard.",
          fields: [
            {
              id: "owned",
              label: "The work is owned",
              hint: "Say that the person who hands the work in is responsible for all of it.",
              min: 15,
              any: OWNED_WORDS,
              missing:
                "The first line does not yet say who owns the work. Say that the person who hands it in owns it, or is responsible for every sentence and figure in it.",
            },
            {
              id: "declared",
              label: "The use is declared",
              hint: "Say that they can tell you what they gave the tool and what it gave back.",
              min: 15,
              any: DECLARED_WORDS,
              missing:
                "The second line does not yet ask them to declare the use. Say that they should be ready to tell you what they gave the tool and what it gave back.",
            },
            {
              id: "checked",
              label: "The facts are checked",
              hint: "Say that figures, dates, names, and references are checked against a source they can name.",
              min: 15,
              any: CHECKED_WORDS,
              missing:
                "The third line does not yet mention checking. Say that every figure, date, and reference is checked against a source they can name.",
            },
            {
              id: "limits",
              label: "The work is within limits",
              hint: "Say what must stay out of the tool, such as customer or colleague details.",
              min: 15,
              any: LIMIT_DATA_WORDS,
              missing:
                "The fourth line does not yet name what stays out of the tool. Name the kind of information, such as customer details, colleague details, or anything confidential.",
            },
          ],
          why: "Your draft has all four parts: the work is owned, the use is declared, the facts are checked, and the work stays within limits. Keep it, because you will revise it into your card at the end of the course.",
        },
      },
      check: {
        kind: "choose",
        prompt:
          "Two managers at Kestrel Insurance wrote a standard for their teams. Choose the one that follows this lesson.",
        leftLabel: "Standard A",
        left: "Everyone should use the AI tool at least three times a week. Log each use in the tracker. I will review all AI outputs before they are sent.",
        rightLabel: "Standard B",
        right:
          "You own anything you hand in, however it was drafted. Be ready to say what the tool did. Check every figure, name, and date against a source. Keep personal data out of the tool. We will talk about this in one-to-ones.",
        correct: "right",
        why: "You chose Standard B. It says the work is owned, the use is declared, the facts are checked, and the work stays within limits, and it leaves the checking with the person who did the work.",
        wrong:
          "Look again at Standard A. It sets a usage target and makes the manager review everything. It says nothing about ownership, checking against a source, or what must stay out of the tool, so it is a rule about the tool rather than a standard for the work.",
      },
      bridge:
        "A standard only works if it is held in conversation, and the next lesson gives you three questions that do that in a one-to-one.",
    },
    {
      id: "ask-what-the-tool-did",
      title: "Ask what the tool did",
      emphasis: "Ask",
      place:
        "You now have a standard with four parts. This lesson gives you the three questions that bring it into a one-to-one, so that you can hold the standard without reading every line yourself.",
      sections: [
        {
          heading: "Three questions",
          paragraphs: [
            "The simplest way to hold the standard is to ask three questions about one piece of work. The first is: what did you give the tool? The second is: what did it give back that you changed? The third is: what did you check, and against what? You can put them in your own words, but each question has a job, and all three need to be asked.",
            "Together they cover the whole standard. The first shows what went in, which tells you whether the work stayed within limits. The second shows whether the person read the output closely enough to own it. The third shows whether the facts were checked and against which source. The answers to all three also show whether the use has been declared, because a person who can answer them has declared it.",
          ],
        },
        {
          heading: "Why each question works",
          paragraphs: [
            "What did you give the tool? This question brings out the source material. If the answer is 'the supplier's price lists and our requirements', you know what the output could reasonably be based on. If the answer is 'the complaint emails, with the customers' names', you have found a limits problem before anything else is discussed.",
            "What did it give back that you changed? Someone who read the output critically can usually name a sentence they cut or corrected. Someone who changed nothing has often not read closely, because tools almost always produce something that needs adjusting. This question does not accuse. It invites the person to show the judgement they applied.",
            "What did you check, and against what? This is the question that finds unchecked facts. The useful answers name a source: the finance system, the signed contract, the rota. A vague answer such as 'I read it through' tells you that nothing has been checked against anything outside the tool yet.",
          ],
        },
        {
          heading: "How to ask them",
          paragraphs: [
            "Ask with curiosity, not suspicion. The questions apply just as well to work that used no tool at all, because 'what did you check?' is a good question for any report. If you ask them of every piece of work, nobody feels singled out for using a tool, and nobody feels they have to hide it.",
            "The questions are not a test the person can fail on the spot. If the answer to the third question is 'nothing yet', the next step is to agree what will be checked, against what, and by when, before the work goes out. The person then does the checking, and you move on to the next item in the one-to-one.",
            "The questions also teach the standard. A team member who is asked them every fortnight starts preparing the answers before the meeting, and before long they are writing 'prices checked against the supplier lists on Monday' at the bottom of their work without being asked. That is the habit this course is aiming for.",
          ],
        },
        {
          heading: "The usual mistake",
          paragraphs: [
            "The usual mistake is to ask only whether AI was used. 'Did you use AI for this?' gets a yes or a no, and neither answer tells you anything about the quality of the work. It also makes the tool the subject of the conversation instead of the work, which is the opposite of the standard.",
            "The second mistake follows from the first. Having heard 'yes, a bit', the manager takes the document away to check it personally. The person leaves the one-to-one with no responsibility for checking, and the manager has added an evening's reading to their week.",
          ],
        },
      ],
      workedExample: {
        title: "Three questions about a supplier comparison",
        inputLabel: "The supplier comparison",
        prompt:
          "Comparison of three cleaning suppliers for the Dunmore and Castle Street sites, prepared by Aisha Rahman for the facilities director. Covers annual price, service levels, response times, contract terms, and a recommendation.",
        outputLabel: "The one-to-one exchange",
        output:
          "Manager: What did you give the tool for this? Aisha: The three suppliers' public price lists and our requirements document. Manager: What did it give back that you changed? Aisha: It said Brightclean offers next-day call-outs, which is not in their price list, so I deleted it. Manager: What did you check, and against what? Aisha: The prices, against the price lists. I have not checked the contract terms section, which the tool summarised. Manager: Can you check the terms against each supplier's documents before it goes to the director on Friday? Aisha: Yes, I will do that on Wednesday.",
        reading: [
          "The first answer shows what the output could be based on, which is public price lists and an internal requirements document. Nothing personal or confidential went in, so the work is within limits.",
          "The second answer shows that Aisha read the output closely. She caught a claim about next-day call-outs that the tool had supplied and that no source supported. That is ownership in practice.",
          "The third answer found the gap. The prices were checked, but the contract terms were the tool's summary and nobody had compared them with the suppliers' documents. The manager did not read the comparison. She asked three questions, found one invented claim that Aisha had already caught and one section that still needed checking, and left the checking with Aisha, with a day to do it.",
        ],
      },
      practice: {
        intro:
          "Think of one piece of work a team member handed in recently. Write how you would ask each of the three questions about it, in your own words. The three questions are in the first section above if you want them beside you.",
        check: {
          kind: "build",
          prompt: "Write the three questions as you would ask them about one real piece of work.",
          fields: [
            {
              id: "in",
              label: "What went into the tool",
              hint: "Ask what they gave the tool to work from.",
              min: 12,
              any: ["give", "gave", "put in", "paste", "went in", "into the tool", "start from", "feed"],
              missing:
                "The first question does not yet ask what went into the tool. Ask what they gave it, or what they pasted in, to work from.",
            },
            {
              id: "changed",
              label: "What they changed",
              hint: "Ask what the tool gave back that they changed or removed.",
              min: 12,
              any: ["change", "edit", "remove", "took out", "take out", "delete", "rewrote", "different", "kept"],
              missing:
                "The second question does not yet ask what they changed. Ask what the tool gave back that they changed, removed, or corrected.",
            },
            {
              id: "checked",
              label: "What they checked, and against what",
              hint: "Ask what they checked and which source they used.",
              min: 12,
              any: ["check", "source", "against", "verif"],
              missing:
                "The third question does not yet ask what was checked. Ask what they checked, and against which source.",
            },
          ],
          why: "Your three questions cover what went in, what was changed, and what was checked against a source. Asked together, they show the whole standard without you reading the work line by line.",
        },
      },
      check: {
        kind: "choose",
        prompt:
          "Two managers at Oakfield Foods asked about the same AI-assisted sales report in a one-to-one. Choose the exchange that follows this lesson.",
        leftLabel: "Exchange A",
        left: "Manager: What did you give the tool for this report? Team member: Last quarter's sales figures and the template. Manager: What did it give back that you changed? Team member: It added a growth percentage I could not find in the figures, so I took it out. Manager: What did you check, and against what? Team member: The totals against the finance system. I have not checked the regional split yet. Manager: Can we agree you check that before it goes out on Thursday?",
        rightLabel: "Exchange B",
        right:
          "Manager: Did you use AI for this? Team member: Yes, a bit. Manager: Fine, as long as it is right. I will go through it tonight and fix anything.",
        correct: "left",
        why: "You chose Exchange A. It asks the three questions, finds a growth figure the person had already removed and a regional split that is still unchecked, and agrees that the person checks it before Thursday.",
        wrong:
          "Look again at Exchange B. It asks only whether AI was used, and then the manager takes the review on themselves. None of the three questions is asked, so nobody learns what went in, what was changed, or what still needs checking.",
      },
      bridge:
        "Sometimes you do need to read the work yourself, and the next lesson shows you how to read it quickly for the claims that still need a source.",
    },
    {
      id: "review-the-work",
      title: "Review the work",
      emphasis: "Review",
      place:
        "You can ask the three questions. This lesson teaches you to read a piece of AI-touched work in a few minutes and find the sentences that still need a source.",
      sections: [
        {
          heading: "Read for harm, not for every word",
          paragraphs: [
            "A manager does not need to verify every sentence of a team member's work. That would turn you into the checking step, which the standard is designed to avoid. What you need to do is find the sentences that would cause harm if they were wrong, and see whether each one has been checked.",
            "Harm here means a consequence at work: a customer told the wrong date, a director deciding on a figure nobody can trace, a policy quoted that does not say what the note claims. Those are the sentences worth your few minutes. A clumsy phrase or a long paragraph is a matter for the person's own editing.",
          ],
        },
        {
          heading: "Two labels for a factual sentence",
          paragraphs: [
            "In this lesson a sentence is Checked against a source when it states a fact, figure, date, name, or reference and the person can point to where it came from, or has marked it with its source. 'The team budget is £240,000', with the finance system named as the source, is checked against a source.",
            "A sentence is Not yet checked when it states such a fact and no source is given or known. 'Similar teams spend 30% less on agency staff', with no source named, is not yet checked. The label does not say the sentence is wrong. It says nobody has shown that it is right, so it cannot go out yet.",
            "Opinions, recommendations, and connecting sentences carry neither label. 'I recommend a three-month trial' is the person's judgement, and you review it as judgement, by asking what would make them more or less confident. Asking for a source for an opinion confuses the two and wastes the conversation.",
          ],
        },
        {
          heading: "Where unchecked sentences hide",
          paragraphs: [
            "In AI-touched work, the sentences most likely to be not yet checked are the ones that sound most finished. Look first for precise percentages, named or unnamed studies ('research shows'), quoted policy clauses or legal rules, and statements that something has been agreed, approved, or confirmed.",
            "These sentences are dangerous because tools produce them easily and they read with complete confidence. A precise figure feels as if it must have come from somewhere, and a quoted rule feels authoritative. The CIPD's factsheet on evidence-based practice makes the wider point that a claim should be judged by the quality of the evidence behind it, and the question for each of these sentences is simply where that evidence is.",
          ],
        },
        {
          heading: "What this reading is not",
          paragraphs: [
            "This reading is not proofreading and it is not rewriting. You are not correcting the style, and you are not going to find the sources yourself. When you find a sentence that is not yet checked, your job is to ask the person for its source, which the next lesson covers.",
            "It also does not replace the three questions. The questions tell you what the person says they checked. The reading lets you confirm that the sentences which matter most are among them. Used together, they take a few minutes for a two-page briefing.",
          ],
        },
      ],
      workedExample: {
        title: "A briefing on a new shift pattern",
        inputLabel: "The team member's briefing",
        prompt:
          "The current pattern has three shifts. Overtime costs rose by 18% last year. Research shows four-day weeks improve productivity by a quarter. The union has agreed in principle to a trial. I recommend a three-month trial on one site.",
        outputLabel: "The manager's reading",
        output:
          "Checked against a source: 'three shifts' (the rota) and 'overtime costs rose by 18%' (the finance report). Not yet checked: 'Research shows four-day weeks improve productivity by a quarter' and 'The union has agreed in principle to a trial'. Judgement: the recommendation.",
        reading: [
          "Callum Price wrote this briefing for his manager at Sefton Distribution with help from a tool. When asked, he said the number of shifts came from the rota and the overtime figure from the finance report. Those two sentences are checked against a source.",
          "'Research shows four-day weeks improve productivity by a quarter' is not yet checked. No study is named, and the figure is precise in exactly the way tools produce without support. 'The union has agreed in principle' is also not yet checked, because an agreement is a fact that someone must confirm, and nobody has said who confirmed it or when.",
          "The recommendation is Callum's judgement. His manager will discuss it with him, but she will not ask for a source, because there is no source for a recommendation. The reading took her about two minutes and found the two sentences that would have caused trouble if they had reached the operations director.",
        ],
      },
      practice: {
        intro:
          "Owen Clarke wrote a short note about his team's office move. He says the desk count came from the floor plan and the move date from the facilities team's email. Mark each factual sentence. The definitions of the two labels are in the second section above.",
        check: {
          kind: "mark",
          prompt: "Mark each sentence of Owen's note as checked against a source or not yet checked.",
          passLabel: CHECKED,
          failLabel: UNCHECKED,
          sentences: [
            {
              id: "desks",
              text: "The new floor has 48 desks.",
              fail: false,
              why: "Owen named the floor plan as the source of the desk count, so this sentence is checked against a source.",
            },
            {
              id: "date",
              text: "The move is booked for the weekend of 14 March.",
              fail: false,
              why: "The move date came from the facilities team's email, which Owen named, so it is checked against a source.",
            },
            {
              id: "studies",
              text: "Studies show open-plan offices cut the number of meetings by 20%.",
              fail: true,
              why: "No study is named for this figure, and it is the kind of precise claim a tool supplies easily. It is not yet checked.",
            },
            {
              id: "screens",
              text: "IT has confirmed that every desk will have two screens.",
              fail: true,
              why: "A confirmation is a fact someone must stand behind, and Owen has not said who in IT confirmed it or where. It is not yet checked.",
            },
          ],
          why: "That is right. The desk count and the date have the sources Owen named. The meetings figure has no study behind it, and the IT confirmation has nobody named, so both need a source before the note goes out.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "Nadia Lewis wrote this note on agency staffing for her manager at Holloway Care. She says the budget figure came from the finance system and the headcount from the HR report. Mark each factual sentence as checked against a source or not yet checked.",
        material: {
          label: "What Nadia said about her sources",
          text: "The budget is from the finance system, and the headcount is from this month's HR report. I used the assistant to draft the rest.",
        },
        passLabel: CHECKED,
        failLabel: UNCHECKED,
        sentences: [
          {
            id: "budget",
            text: "The team budget for this year is £240,000.",
            fail: false,
            why: "Nadia named the finance system as the source of the budget figure, so it is checked against a source.",
          },
          {
            id: "headcount",
            text: "We currently have eleven people in the team.",
            fail: false,
            why: "The headcount came from the HR report, which Nadia named, so this sentence is checked against a source.",
          },
          {
            id: "comparison",
            text: "Similar teams in our sector spend about 30% less on agency staff.",
            fail: true,
            why: "No source is named for this comparison, and it sounds precise. Ask where it comes from before it goes out.",
          },
          {
            id: "approval",
            text: "Procurement has already approved the new agency contract.",
            fail: true,
            why: "An approval is a fact someone must confirm, and nothing shows who in procurement approved it or when. It is not yet checked.",
          },
          {
            id: "rule",
            text: "The Working Time Regulations require a rest break of 45 minutes for any shift over five hours.",
            fail: true,
            why: "This quotes a legal rule with no source, and quoted rules are where invented detail hides. The GOV.UK guidance on rest breaks at work gives a different rule for adult workers, a 20-minute break when the working day is longer than six hours, which is why this sentence must be checked before anyone relies on it.",
          },
        ],
        why: "You found the three sentences with no source behind them: the comparison with other teams, the procurement approval, and the quoted rule. The budget and the headcount have the sources Nadia named.",
      },
      bridge:
        "When you find a sentence that is not yet checked, it is tempting to fix it yourself, and the next lesson shows you how to hand it back instead.",
    },
    {
      id: "return-it-with-a-question",
      title: "Return it with a question",
      emphasis: "question",
      place:
        "You can find the sentences that have not been checked. This lesson teaches you to hand the work back so that the team member does the fixing and keeps ownership of the work.",
      sections: [
        {
          heading: "The pull to fix it yourself",
          paragraphs: [
            "When a manager finds a problem in a team member's work, the quickest response is to fix it. You know the right date, you can see the sentence that goes too far, and a correction takes thirty seconds. In the moment, fixing it feels like the helpful thing to do.",
            "Done every time, it teaches the team that the manager is the checking step. People stop checking because they know you will. The standard says the person owns the work and checks the facts, and every quiet correction you make tells them the opposite.",
          ],
        },
        {
          heading: "What returning with a question means",
          paragraphs: [
            "Returning the work with a question means three things in one comment. You name the sentence. You say which part of the standard it does not yet meet, usually that it has not been checked against a source or that it goes beyond what was agreed. You ask the person to resolve it, and say what to do if they cannot.",
            "A typical comment reads: 'Where does the 30% comparison come from? If you cannot find a source, take it out.' It names the sentence, points at the missing source, and gives the person a clear way to finish. They do the work, and next time they are more likely to check before they hand it in.",
          ],
          beforeAfter: {
            before: "Check this.",
            after:
              "The line saying the fault is fixed on all 40 units has no source. Which engineer's report does it come from? If none, take it out until it is confirmed.",
            reading:
              "The first comment leaves the person guessing which sentence you mean and what is wrong with it. The second names the sentence, the missing source, and what to do if there is none.",
          },
        },
        {
          heading: "What a question is not",
          paragraphs: [
            "A question is not a vague comment. 'Check this', 'not sure about this', and 'are you certain?' feel like questions, but the person cannot act on them, because they do not know which sentence you mean or which part of the standard it misses. They will either change something at random or change nothing.",
            "A question is also not a rewritten paragraph in the margin. A comment that says 'changed this to...' followed by your own wording has fixed the work for them, however politely it is phrased. The test is simple: after reading your comment, is the next piece of work theirs to do, or has it already been done?",
          ],
        },
        {
          heading: "When you should fix it yourself",
          paragraphs: [
            "There are times when the manager should fix something directly, and this lesson does not pretend otherwise. If the work is going out in ten minutes and the person is not available, fix it and tell them afterwards. If the error is an obvious typing slip, such as Q2 written for Q3 in a heading, correct it and move on.",
            "The default is still the question, because the question builds the habit and the fix does not. Acas advice on having difficult conversations at work makes the point that people respond better to a specific, factual description of the issue than to a general criticism, and a question that names the sentence is exactly that.",
          ],
        },
      ],
      workedExample: {
        title: "Two sets of comments on the shift briefing",
        inputLabel: "The manager's first comments",
        prompt:
          "1. Changed this to 'Research suggests shorter weeks may help some teams'. 2. Deleted the union line. 3. Rewrote your recommendation to be more cautious.",
        outputLabel: "The comments that went back",
        output:
          "1. The productivity figure has no study named. Can you find the source, or remove the figure? 2. The union line states an agreement. Who confirmed it, and when? If nobody has, take it out. 3. The recommendation is your call. What would make you more or less confident about it?",
        reading: [
          "These are comments on Callum's shift briefing from the last lesson. The first set rewrote the work. The productivity sentence now says what his manager thinks it should say, the union line has gone without explanation, and the recommendation is in her voice rather than his. Callum has nothing to learn from them and no reason to check next time.",
          "The second set names each sentence and the part of the standard it misses. The productivity figure and the union agreement are not yet checked, and each comment asks for the source and says what to do if there is none.",
          "The third comment treats the recommendation as Callum's judgement. It does not ask for a source, because a recommendation has none. It asks what would change his confidence, which is how you review judgement. The briefing that comes back will still be his work.",
        ],
      },
      practice: {
        intro:
          "Rewrite the manager's first comment on the shift briefing as a question. Name the sentence, say which part of the standard it misses, and ask Callum to resolve it. The comments that went back, above, show one way to do it.",
        check: {
          kind: "edit",
          label: "The comment you are rewriting",
          prompt:
            "Edit this comment so that it returns the productivity sentence to Callum with a question instead of rewriting it.",
          start: "Changed this to 'Research suggests shorter weeks may help some teams'.",
          unchanged:
            "You have not changed the comment yet. Replace the rewrite with a question that names the productivity figure and asks for its source.",
          keep: [
            {
              id: "sentence",
              any: ["productivity", "a quarter", "the figure", "25%"],
              missing:
                "Your comment does not yet name the sentence. Say which one you mean, such as the productivity figure.",
            },
            {
              id: "standard",
              any: ["source", "study", "where does", "where did", "checked", "come from", "came from"],
              missing:
                "Your comment does not yet say which part of the standard is missing. Say that the figure has no source, or ask where it came from.",
            },
            {
              id: "asks",
              any: ["?"],
              missing: "Your comment does not yet ask a question. End it with the question Callum needs to answer.",
            },
          ],
          limits: [],
          limitWording: false,
          why: "Your comment names the productivity figure, says it has no source, and asks Callum to find one. The rewrite has gone, so the next piece of work is his.",
        },
      },
      check: {
        kind: "edit",
        label: "The comments you are rewriting",
        prompt:
          "Jess Harper at Northgate Electrical left these comments on Liam's AI-assisted update to a customer. Edit them so that each one returns the work to Liam with a question instead of fixing it.",
        material: {
          label: "Liam's customer update",
          text: "Your replacement units will be delivered on the 12th. Our engineers have fixed the fault on all 40 units. We are very sorry for the disruption this has caused, and we understand how frustrating the last fortnight has been for your team, particularly during your busiest period of the year. As agreed, we will take 10% off your next order.",
        },
        start:
          "1. I have changed the delivery date to the 14th, which I think is right. 2. Check this. 3. Rewrote the apology paragraph because it was too long. 4. The discount mentioned in paragraph three was never agreed, so I deleted it.",
        unchanged:
          "You have not changed the comments yet. Start with comment 1 and ask where the delivery date came from instead of changing it.",
        keep: [
          {
            id: "date",
            any: [
              "date come from",
              "date came from",
              "source for the date",
              "source for the delivery date",
              "check the date",
              "check the delivery date",
              "confirm the date",
              "confirm the delivery date",
              "date against",
              "where did the 12th",
              "where does the 12th",
              "where did the delivery date",
              "where does the delivery date",
              "where did the date",
              "where does the date",
            ],
            missing:
              "Comment 1 still fixes the date. Ask where the delivery date came from, or ask Liam to check it against a named source, such as the dispatch schedule.",
          },
          {
            id: "fault",
            any: ["40 units", "fault", "engineer", "fixed"],
            missing:
              "Comment 2 does not say what to check. Name the sentence, such as the line saying the fault is fixed on all 40 units, and ask for its source.",
          },
          {
            id: "apology",
            any: [
              "can you shorten",
              "could you shorten",
              "please shorten",
              "shorten the apology",
              "cut the apology",
              "shorter",
              "your call",
              "matter of taste",
              "leave the apology",
            ],
            missing:
              "Comment 3 still rewrites the work. Ask Liam to shorten the apology himself, or say it is his call if it is only a matter of taste.",
          },
          {
            id: "discount",
            any: [
              "who agreed",
              "who approved",
              "who confirmed",
              "confirm the discount",
              "confirm who",
              "remove the discount",
              "take the discount out",
              "take out the discount",
              "take the 10% out",
            ],
            missing:
              "Comment 4 still deletes the sentence for him. Name the discount, ask who agreed it, and ask Liam to take it out if nobody did.",
          },
          {
            id: "asks",
            any: ["?"],
            missing: "None of your comments asks a question yet. Turn at least one of them into a question Liam must answer.",
          },
        ],
        limits: [],
        limitWording: false,
        why: "Each comment now names the sentence and asks Liam to resolve it: the source of the date, the source of the fault claim, a shorter apology in his own words, and who agreed the discount. The work stays with the person who owns it.",
        result: {
          label: "How the comments read now",
          text: "1. Where did the delivery date of the 12th come from? Please check it against the dispatch schedule. 2. The line saying the fault is fixed on all 40 units has no source. Which engineer's report does it come from? 3. Could you shorten the apology paragraph? Two sentences would be enough. 4. The 10% discount in paragraph three: who agreed it? If nobody did, please take it out.",
        },
      },
      bridge:
        "After a few weeks of holding the standard like this, you need to know whether it has taken hold, and the next lesson tells you what to look for.",
    },
    {
      id: "signs-it-stuck",
      title: "Signs it stuck",
      emphasis: "Signs",
      place:
        "You can hold the standard in one-to-ones and return work with a question. This lesson helps you tell, after a few weeks, whether the standard has become a habit in your team.",
      sections: [
        {
          heading: "Where a habit shows",
          paragraphs: [
            "A habit shows itself in the work, not in the tool's statistics. If the standard has taken hold, you will see people meeting it before you ask. Sources will be named in the work. Errors will be caught before the work reaches you. People will ask about limits before they paste something into a tool.",
            "None of those things appears on a dashboard. You see them in what the team hands in and hear them in what people say in one-to-ones and team meetings. That is why the manager, and not the tool, is the right person to judge whether the standard has stuck.",
          ],
        },
        {
          heading: "Two labels",
          paragraphs: [
            "In this lesson a Sign in the work is something a manager can see in what the team hands in or says. Examples are a team member naming the source of a figure without being asked, a note saying which parts were drafted with a tool and which were checked, a factual error caught before the work reached you, or a question about whether something may go into the tool.",
            "An Activity count is a number about the tool itself. Examples are logins, prompts sent, licences used, and hours saved as estimated by the tool. Activity counts come from a system and describe how much the tool was used. They say nothing directly about the work that came out.",
          ],
        },
        {
          heading: "What counts can and cannot tell you",
          paragraphs: [
            "Activity counts are useful for one thing, which is knowing whether people have access and have started. If one person has never logged in, that is worth a conversation about access or training. Beyond that, they cannot show whether the work is owned, declared, checked, and within limits.",
            "A high count can even be a warning. A team sending 500 prompts a month whose reports still carry unchecked figures is using the tool heavily and meeting the standard poorly. Hours saved, as estimated by a tool, are the tool's own account of itself and should be read with that in mind.",
          ],
        },
        {
          heading: "When to look",
          paragraphs: [
            "Signs in the work take a few weeks to appear, because people need to be asked the three questions a few times before they start answering them in advance. Look for signs after at least two or three one-to-ones, and decide in advance when you will look, so that you do not judge the standard on the first week.",
            "The usual mistake is to report the counts because they are easy to collect and look like progress. When a director asks how adoption is going, a manager who can say 'three of the last four reports named their sources without being asked' is giving a more useful answer than one who says 'prompts are up by half'.",
          ],
        },
      ],
      workedExample: {
        title: "A manager's notes after six weeks",
        inputLabel: "The manager's notes",
        prompt:
          "Usage dashboard shows 340 prompts this month, up from 120. Mei's supplier note came with a line saying the prices were checked against the price lists on Monday. Two people asked whether they could paste a customer email into the tool. The tool reports 22 hours saved. No unchecked figures in the last three reports.",
        outputLabel: "How the manager read them",
        output:
          "Activity counts: 340 prompts; 22 hours saved. Signs in the work: Mei's line about checked prices; two questions about pasting customer email; no unchecked figures in the last three reports.",
        reading: [
          "Daniel Byrne manages the purchasing team at Wexham Council. His notes mix two kinds of evidence. The prompt count and the hours saved are activity counts, because they come from the tool and describe its use.",
          "Mei's line about checked prices is a sign in the work, because she declared her source without being asked. The two questions about customer email are signs too, because people are thinking about limits before they act. The absence of unchecked figures in three reports is the strongest sign of all, because it is the standard showing up in the finished work.",
          "Daniel uses the signs to judge whether the standard has stuck, and treats the counts as background. If his director asks, he can give three concrete examples from his team's work rather than a percentage from a dashboard.",
        ],
      },
      practice: {
        intro:
          "Write three things you could look for in your own team's work over the coming weeks. For each one, ask yourself whether you would see it in the work or hear it from a person, rather than read it on a dashboard. The two labels are defined in the second section above.",
        check: {
          kind: "build",
          prompt: "Write three signs in the work you could look for in your team.",
          fields: [
            {
              id: "sign1",
              label: "First sign",
              hint: "Something you would see in the work or hear a team member say.",
              min: 15,
              any: SIGN_WORDS,
              missing:
                "The first sign does not yet describe something in the work. Name something you would see or hear, such as a source named without being asked or an error caught before review.",
            },
            {
              id: "sign2",
              label: "Second sign",
              hint: "Something you would see in the work or hear a team member say.",
              min: 15,
              any: SIGN_WORDS,
              missing:
                "The second sign does not yet describe something in the work. Name something you would see or hear, such as a note marking which figures were checked.",
            },
            {
              id: "sign3",
              label: "Third sign",
              hint: "Something you would see in the work or hear a team member say.",
              min: 15,
              any: SIGN_WORDS,
              missing:
                "The third sign does not yet describe something in the work. Name something you would see or hear, such as a question about what may go into the tool.",
            },
          ],
          why: "Each of your three signs is something you would see in the work or hear from your team. None of them is a number from the tool, so each one can tell you whether the standard has stuck.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "These items come from a manager's six-week review at Larchfield Housing. Mark each one as a sign in the work or an activity count.",
        passLabel: SIGN,
        failLabel: COUNT,
        sentences: [
          {
            id: "prompts",
            text: "The tool dashboard shows the team sent 500 prompts last month.",
            fail: true,
            why: "Prompts sent is a number about the tool, and it says nothing about whether the work was checked. It is an activity count.",
          },
          {
            id: "marked",
            text: "A team member's briefing marked which figures came from the finance system.",
            fail: false,
            why: "The manager saw this in the work itself. The person declared their sources without being asked, so it is a sign in the work.",
          },
          {
            id: "licences",
            text: "Eight of nine licences were used at least once.",
            fail: true,
            why: "Licence use shows who has access, not whether the work met the standard. It is an activity count.",
          },
          {
            id: "caught",
            text: "A team member caught an invented date in a draft before sending it to the manager.",
            fail: false,
            why: "This describes the person who owns the work checking a fact. It is a sign in the work.",
          },
          {
            id: "cv",
            text: "A new starter asked whether a candidate's CV could go into the tool.",
            fail: false,
            why: "This is a behaviour, not a number from the tool. Asking about limits before pasting is a sign in the work.",
          },
        ],
        why: "You looked for the standard in the work people handed in and in what they said, and you treated the prompt count and the licence figure as activity counts.",
      },
      bridge:
        "You have now used every move in the course, and the next lesson asks you to use them together on situations you have not seen before.",
    },
    {
      id: "the-standard-in-practice",
      title: "The standard in practice",
      emphasis: "practice",
      place:
        "This is the course assessment. It brings the standard, the three questions, the reading, the returned question, and the signs together, and tests them on eight situations you have not seen before. After it, you write your card.",
      sections: [
        {
          heading: "The method in one place",
          paragraphs: [
            "The standard has four parts. The work is owned by the person who hands it in. The use is declared, so they can say what they gave the tool and what it gave back. The facts are checked against a source they can name. The work is within limits, so nothing went into the tool that the organisation does not allow, with personal data about customers, candidates, and colleagues the most common limit.",
            "You hold the standard with three questions: what did you give the tool, what did it give back that you changed, and what did you check, and against what. When you need to read the work yourself, you read for the factual sentences that would cause harm if wrong, and you label each one Checked against a source or Not yet checked, leaving opinions and recommendations to be reviewed as judgement.",
            "When you find a problem, you return the work with a question that names the sentence, says which part of the standard it misses, and asks the person to resolve it. You fix things yourself only when the work is about to go and the person cannot, or when the error is an obvious slip. After a few weeks, you judge whether the standard has stuck by signs in the work, and you treat activity counts as background.",
          ],
        },
        {
          heading: "How the moves fit together in one conversation",
          paragraphs: [
            "In a real one-to-one the moves come in a natural order. You ask the three questions first, because they tell you what the person already knows about their own work. You read only the sentences their answers leave uncertain. You return anything unresolved with a question and a date. The conversation then moves on to the rest of the one-to-one.",
            "Across several weeks, the signs tell you whether the questions are working. If people start answering before you ask, you can ask for the next thing, which is the subject of the last lesson. If they do not, you keep asking, and you look at whether your comments are still fixing work rather than returning it.",
          ],
        },
        {
          heading: "Where managers slip under pressure",
          paragraphs: [
            "Most slips happen when a manager is busy. The two most common are taking the work away to check it overnight, and writing a quick fix in the margin. Both feel efficient and both move the checking back to the manager. The other common slip is reporting activity counts upward because a director asked for numbers.",
            "The assessment below puts you in those moments. Each question has one option that follows the course and others that a reasonable, busy manager might choose. Read the situation carefully, because the right answer depends on the detail, such as whether the person is available or whether a sentence is a fact or a judgement.",
          ],
        },
      ],
      workedExample: {
        title: "One review, every move",
        inputLabel: "The team member's draft",
        prompt:
          "Tender response section 4, drafted by Sophie Grant with the assistant for Marlow Facilities. 'We have delivered this service to 14 local authorities. Our response time is under two hours, as required by clause 7.3 of the specification. Our accreditation was renewed in May. We believe our regional team is the strongest in the county.'",
        outputLabel: "The manager's review note",
        output:
          "Sophie told me she gave the tool our standard tender text and the specification, and removed a line about a 24-hour helpline we do not run. She checked the client count against the contracts register. Questions back to her: Clause 7.3: what response time does it actually require? Please check the specification. The accreditation renewal: can you find the certificate date? The line about the strongest team is your judgement; what evidence would make a buyer believe it?",
        reading: [
          "Ahmed Siddiqui asked Sophie the three questions first. Her answers showed that nothing personal went in, that she had read the output closely enough to cut an invented helpline, and that the client count was checked against the contracts register.",
          "He then read only the factual sentences her answers did not cover. The response time and the clause reference are not yet checked, and a quoted clause is exactly where invented detail hides. The renewal date is also not yet checked. The last sentence is a judgement, so he asked about evidence rather than a source.",
          "Every comment returns the work with a question. Ahmed did not open the specification himself or rewrite the claim about the team. Sophie will make the changes, and the tender section that goes out will be hers.",
        ],
      },
      practice: {
        intro:
          "Before the assessment, try one short judgement. Both notes below respond to the same unsourced figure in a team member's report. The method is set out in the first section above.",
        check: {
          kind: "choose",
          prompt:
            "Kiran's report says 'Staff sickness fell by 15% after the new rota.' Kiran says the headcount came from the HR system but has not mentioned the sickness figure. Choose the note that follows the course.",
          leftLabel: "Note A",
          left: "I have changed the sickness line to 'Staff sickness appears to have fallen after the new rota', which is safer.",
          rightLabel: "Note B",
          right:
            "The 15% sickness figure has no source yet. Where does it come from? If you cannot find it in the absence records, please take it out before Friday.",
          correct: "right",
          why: "You chose Note B. It names the sentence, says the figure has no source, asks where it came from, and tells Kiran what to do if there is none, so the work stays with Kiran.",
          wrong:
            "Look again at Note A. It rewrites Kiran's sentence for him, so the figure is never checked and Kiran learns nothing about finding a source. Note B names the figure and asks for its source.",
        },
      },
      check: {
        kind: "scenario",
        prompt:
          "Read each situation and choose what you would do. You need six of eight to pass, and you will see feedback on every answer.",
        passMark: 6,
        questions: [
          {
            id: "targets",
            situation:
              "Priya Nair manages a team of nine at Fenwick Logistics. Her director has asked every manager to 'drive AI adoption' and suggests that each person logs at least five uses of the assistant a week. Priya has to send her team a note about it on Monday.",
            question: "What should Priya's note say?",
            options: [
              {
                id: "a",
                text: "Ask everyone to log five uses a week in a shared tracker, as the director suggested.",
                feedback:
                  "A usage target tells people how often to use the tool and nothing about whether the work is any good. Someone could log five uses and still hand in an invented figure. Write the four-part standard instead.",
              },
              {
                id: "b",
                text: "Set out the four-part standard for work the tool helps with, and tell the director she will report signs in the work alongside the usage figures.",
                correct: true,
                feedback:
                  "Right. The note tells the team what good work looks like when a tool helps, and it gives the director something more useful than a count: evidence from the work itself.",
              },
              {
                id: "c",
                text: "Tell the team not to use the assistant until the organisation publishes a formal policy.",
                feedback:
                  "A ban is not a standard, and the director asked for the opposite. The team is already allowed to use the tool, so a standard for the work is what they need now.",
              },
              {
                id: "d",
                text: "Encourage use of the assistant and say that Priya will personally check everything it produces.",
                feedback:
                  "This moves all the checking to Priya, which will not last beyond a busy fortnight, and it leaves the team with no responsibility for their own work. The standard keeps ownership with the person.",
              },
            ],
          },
          {
            id: "newsletter",
            situation:
              "In a one-to-one at Harrow Housing, Tom hands Grace his draft of the quarterly tenant newsletter. He says, 'I used the assistant for most of it.' Grace has twenty minutes and three other items to discuss.",
            question: "What should Grace do first?",
            options: [
              {
                id: "a",
                text: "Ask Tom what he gave the tool, what it gave back that he changed, and what he checked and against what.",
                correct: true,
                feedback:
                  "Right. The three questions take a few minutes and show what went in, whether Tom read the output closely, and which facts still need a source, without Grace reading the newsletter herself.",
              },
              {
                id: "b",
                text: "Ask Tom whether he is happy with it, and move on if he says yes.",
                feedback:
                  "Being happy with it tells Grace nothing about what was checked. The three questions would show whether the dates and figures in the newsletter have a source.",
              },
              {
                id: "c",
                text: "Take the draft away and read it properly that evening.",
                feedback:
                  "Grace becomes the checking step, and Tom leaves with no responsibility for his own work. Ask the three questions instead, and leave any checking with him.",
              },
              {
                id: "d",
                text: "Ask Tom to write it again without the tool so that she can trust it.",
                feedback:
                  "The course does not treat the tool as the problem. Work written without a tool can have unchecked facts too. Ask the three questions about the work he has.",
              },
            ],
          },
          {
            id: "complaints",
            situation:
              "Asked what she gave the tool, Hannah says she pasted thirty customer complaint emails, including names and addresses, into a free chatbot on her phone to get a summary for the monthly report. The organisation's approved tool is a different one. The summary itself looks accurate.",
            question: "What should her manager do?",
            options: [
              {
                id: "a",
                text: "Thank her for saving time, since the summary is accurate, and carry on with the review.",
                feedback:
                  "An accurate summary does not make the input acceptable. Personal data went into a tool the organisation has not approved, which is outside the limits, and that has to be dealt with first.",
              },
              {
                id: "b",
                text: "Ban the whole team from using any tool until further notice.",
                feedback:
                  "A team-wide ban punishes everyone for one limits problem and does not deal with what happened. Handle the problem with Hannah through the organisation's route for data concerns.",
              },
              {
                id: "c",
                text: "Treat it as a limits problem: agree she stops using that tool for this work, raise it today through the organisation's route for data concerns, and discuss what she can put into the approved tool.",
                correct: true,
                feedback:
                  "Right. The first question found a limits problem, and that comes before the quality of the summary. It is raised through the proper route, and Hannah leaves knowing what may go in next time.",
              },
              {
                id: "d",
                text: "Ask her to delete the chat history and say nothing more about it.",
                feedback:
                  "Deleting the history does not undo what was shared, and saying nothing keeps the organisation from dealing with it properly. Raise it through the organisation's route for data concerns.",
              },
            ],
          },
          {
            id: "turnover",
            situation:
              "Ben's report on the wellbeing scheme at Ashby Retail says: 'We employ 212 people across four stores. Staff turnover in our region fell 12% after the scheme, as confirmed by the 2024 Hartley study. I recommend extending the scheme to the warehouse.' Ben says the headcount came from the HR system.",
            question: "Which sentence should his manager ask about first?",
            options: [
              {
                id: "a",
                text: "The headcount of 212 people across four stores.",
                feedback:
                  "Ben named the HR system as the source of the headcount, so that sentence is checked against a source. The turnover figure and the study have no source.",
              },
              {
                id: "b",
                text: "The turnover figure and the Hartley study.",
                correct: true,
                feedback:
                  "Right. A precise percentage and a named study with no source given are the sentences most likely to be not yet checked, and a director could act on them.",
              },
              {
                id: "c",
                text: "The recommendation to extend the scheme to the warehouse.",
                feedback:
                  "The recommendation is Ben's judgement, reviewed as judgement. The factual sentence with no source, the turnover figure and the study, is the one to ask about first.",
              },
            ],
          },
          {
            id: "opinion",
            situation:
              "Chloe's proposal at Pemberton Engineering ends: 'I think we should pilot the new booking system at the Leeds site first, because the team there is the most familiar with the current one.' Her manager is reading the proposal for sentences that are not yet checked.",
            question: "How should the manager treat this sentence?",
            options: [
              {
                id: "a",
                text: "Mark it as not yet checked and ask Chloe for a source.",
                feedback:
                  "This is a recommendation, not a statement of fact, so there is no source to find. Asking for one confuses the two. Review it as judgement.",
              },
              {
                id: "b",
                text: "Rewrite it to recommend a site the manager prefers.",
                feedback:
                  "Rewriting the recommendation takes Chloe's judgement away from her. Ask what would make her more or less confident, and leave the decision about the wording with her.",
              },
              {
                id: "c",
                text: "Delete it, because proposals should only contain facts.",
                feedback:
                  "A proposal needs a recommendation, and this one gives a reason. Deleting it removes the point of the document. Review it as her judgement.",
              },
              {
                id: "d",
                text: "Treat it as Chloe's judgement and ask her what would make her more or less confident about Leeds.",
                correct: true,
                feedback:
                  "Right. Opinions and recommendations carry neither label. You review them by asking about the reasoning, and the decision stays Chloe's.",
              },
            ],
          },
          {
            id: "board-pack",
            situation:
              "The board pack at Fairview Trust goes to the printer in ten minutes. Olu, who prepared the finance section, is on leave today and cannot be reached. His manager notices that a chart heading reads 'Q2 spend' above figures that are clearly labelled Q3 everywhere else.",
            question: "What should the manager do?",
            options: [
              {
                id: "a",
                text: "Correct the heading to Q3, and tell Olu about it when he is back.",
                correct: true,
                feedback:
                  "Right. The work is about to go, the person cannot be reached, and the error is an obvious slip. This is one of the times to fix it yourself, and telling Olu afterwards keeps him aware of his own work.",
              },
              {
                id: "b",
                text: "Leave a comment asking Olu where the heading came from.",
                feedback:
                  "The question is the default, but Olu cannot answer before the pack goes, and the error is an obvious slip. This is a case for fixing it and telling him afterwards.",
              },
              {
                id: "c",
                text: "Hold the whole board pack until Olu is back.",
                feedback:
                  "Delaying the board pack for a heading slip causes more harm than it prevents. Fix the slip and tell Olu when he returns.",
              },
            ],
          },
          {
            id: "comment",
            situation:
              "Sam's cost paper at Ridley Transport says 'Moving to electric vans will save us 40% on running costs in the first year.' No source is given. Sam is in the office all week, and the paper goes to the operations director next Thursday.",
            question: "Which comment should Sam's manager leave?",
            options: [
              {
                id: "a",
                text: "'Check this.'",
                feedback:
                  "Sam will not know which sentence you mean or what is wrong with it. Name the 40% saving, say it has no source, and ask where it comes from.",
              },
              {
                id: "b",
                text: "'Changed to: electric vans may reduce running costs over time.'",
                feedback:
                  "This rewrites Sam's work, so the figure is never checked and Sam learns nothing about finding a source. Return it with a question instead.",
              },
              {
                id: "c",
                text: "'The 40% saving has no source yet. Where does it come from? If you cannot find one, take it out before Thursday.'",
                correct: true,
                feedback:
                  "Right. The comment names the sentence, says which part of the standard it misses, and tells Sam what to do if there is no source. The work stays with Sam.",
              },
              {
                id: "d",
                text: "'Are you sure about this?'",
                feedback:
                  "It sounds like a question, but Sam cannot act on it. Name the sentence and ask for its source, so Sam knows exactly what to do.",
              },
            ],
          },
          {
            id: "report-up",
            situation:
              "Eight weeks after introducing the standard at Carrick Legal Services, Lucy's director asks her how AI adoption is going in her team and wants an answer for the leadership meeting on Friday.",
            question: "What should Lucy report?",
            options: [
              {
                id: "a",
                text: "That all twelve licences are now in use.",
                feedback:
                  "Licence use is an activity count. It shows access, not whether the work is owned, declared, checked, and within limits. Report signs in the work, with counts as background.",
              },
              {
                id: "b",
                text: "That prompts sent have tripled since the standard was introduced.",
                feedback:
                  "More prompts says the tool is used more, not that the work is better. A high count with unchecked figures would even be a warning. Report what you have seen in the work.",
              },
              {
                id: "c",
                text: "That it is too early to say anything, and she will report in six months.",
                feedback:
                  "Eight weeks is enough for signs to appear if you have been asking the questions. Report the signs you have seen, and say when you will look again.",
              },
              {
                id: "d",
                text: "That three of the last four reports named their sources without being asked, one person caught an invented date before review, and two asked about limits, with licence use as background.",
                correct: true,
                feedback:
                  "Right. These are signs in the work, and they tell the director whether the standard has stuck. The licence figure is there as background, not as the measure.",
              },
            ],
          },
        ],
        why: "You held the standard across eight new situations: setting it, asking the three questions, dealing with a limits problem, reading for unchecked facts, treating judgement as judgement, knowing when to fix, returning work with a question, and reporting signs in the work.",
      },
      bridge:
        "You have passed the assessment, and the last lesson asks you to put the standard, the questions, the signs, and your next request on one card for your team.",
    },
    {
      id: "what-you-ask-for-next",
      title: "What you ask for next",
      emphasis: "next",
      place:
        "This is the last lesson. You write the one-to-one standard card you will use with your team, and that card is what your signed record shows.",
      sections: [
        {
          heading: "What the card is",
          paragraphs: [
            "The standard card is a single page you can keep beside you in one-to-ones and share with your team. It states the standard in four lines, one for each part. It lists the three questions in your own words. It names three signs in the work you will look for, and when you will look for them. It ends with what you will ask for next.",
            "The card is written so that a team member can read it and know exactly what you will ask when they hand in work. That makes it a commitment on your side as much as on theirs. If you have written that you will ask the three questions, the team can reasonably expect you to ask them.",
          ],
        },
        {
          heading: "What you will ask for next",
          paragraphs: [
            "What you ask for next is the one change you will ask the team to make once the basic standard is in place. It builds on the habit rather than replacing it. Good examples are a line at the end of every report saying what was checked and against what, or a short team conversation each month about an error someone caught before it went out.",
            "Choose one change, not several, and make it something you could see in the work. 'Everyone gets better at checking' is a hope. 'From next month, every report ends with one line saying what was checked and against what' is a change you can look for in the first report that arrives.",
          ],
        },
        {
          heading: "What the card is not",
          paragraphs: [
            "The card is not a policy, and it does not replace your organisation's rules on which tools may be used or what may go into them. If your organisation has an approved list of tools or a data protection procedure, the card sits alongside it. The GOV.UK Artificial Intelligence Playbook is a public example of an organisation's principles for staff use of AI, including checking outputs, and your own organisation's rules take precedence over anything on your card.",
            "The card is also not a record about individuals. It must not name team members, and it must not contain email addresses or telephone numbers. It describes how you will review work, so that anyone on the team, and anyone who joins later, can read it in the same way.",
          ],
        },
        {
          heading: "Writing it so the team can hold you to it",
          paragraphs: [
            "Write each line as a plain sentence the team could quote back to you. The limits line in particular should be a clear instruction, beginning with words such as do not, must not, never, or only, and naming what must stay out of the tool, such as customer details, candidate details, or anything confidential.",
            "Give the signs a time. 'At the one-to-ones in week 4 and week 8' or 'at the end of March' tells you when to look and stops you judging the standard in the first week. Then read the card as a new team member would, and check that nothing on it depends on something only you know.",
          ],
        },
      ],
      workedExample: {
        title: "A card for an operations team",
        inputLabel: "The first version of the standard",
        prompt:
          "Use the assistant for first drafts. Tell me if you used it. I will review anything important before it goes out.",
        outputLabel: "The card that went to the team",
        output:
          "Standard: You own what you hand in. Be ready to say what the tool did. Check every figure, date, and name against a source. Do not put customer or colleague details into the tool. Questions: What did you give it? What did it give back that you changed? What did you check, and against what? Signs: sources named without being asked, errors caught before review, and questions about limits, looked for at the one-to-ones in week 4 and week 8. Next: from next month, every report ends with one line saying what was checked and against what.",
        reading: [
          "Farah Ali manages the operations team at Tennant Freight. Her first version was a usage rule, a request to declare that the tool was used without saying what it did, and a promise that she would review anything important. It had no ownership, no checking, and no limits.",
          "The card that went to the team has the four parts, the three questions, three signs with a time to look for them, and one change for next month. A team member reading it knows what Farah will ask in the next one-to-one, and what will be expected of their reports from next month.",
          "Farah also has a way to tell, in eight weeks, whether it worked. She will look for the three signs at two named one-to-ones, and she will see in the first report next month whether the checking line is there.",
        ],
      },
      practice: {
        intro:
          "Revise a weak first version of a standard, using what you learned in lessons two to five. Replace the usage rule and the promise to review everything with the four parts of the standard. The card in the worked example is above if you want to compare.",
        check: {
          kind: "edit",
          label: "The standard you are revising",
          prompt: "Edit this standard so that it states the four parts: owned, declared, checked, and within limits.",
          start:
            "Everyone should use the AI tool at least three times a week. Log each use in the tracker. I will review all AI outputs before they are sent.",
          unchanged:
            "You have not changed the standard yet. Replace the usage target with a line saying the person owns the work they hand in.",
          keep: [
            {
              id: "owned",
              any: OWNED_WORDS,
              missing: "Your standard does not yet say who owns the work. Add a line saying the person who hands it in owns it.",
            },
            {
              id: "declared",
              any: DECLARED_WORDS,
              missing:
                "Your standard does not yet ask people to declare the use. Add a line asking them to be ready to say what the tool did.",
            },
            {
              id: "checked",
              any: ["source", "checked against", "check every", "check each", "check all", "check the facts", "check figures"],
              missing:
                "Your standard does not yet say that facts are checked against a source. Add a line asking for every figure, date, and name to be checked against a source.",
            },
            {
              id: "limits",
              any: LIMIT_DATA_WORDS,
              missing:
                "Your standard does not yet set the limit. Add a line saying what must stay out of the tool, such as customer or colleague details.",
            },
          ],
          limits: [],
          limitWording: false,
          why: "Your revised standard has all four parts. The usage target no longer carries the weight, and the checking now sits with the person who owns the work.",
        },
      },
      check: {
        kind: "build",
        prompt:
          "Write your one-to-one standard card for your team. A team member should be able to read it and know exactly what you will ask. Do not name team members, and do not include email addresses or telephone numbers.",
        fields: [
          {
            id: "owned",
            label: "The standard: the work is owned",
            hint: "One line saying the person who hands the work in owns all of it.",
            min: 20,
            any: OWNED_WORDS,
            missing:
              "The first line of your standard does not yet say who owns the work. Say that the person who hands it in owns it, or is responsible for every sentence and figure in it.",
          },
          {
            id: "declared",
            label: "The standard: the use is declared",
            hint: "One line asking people to be ready to say what they gave the tool and what it gave back.",
            min: 20,
            any: DECLARED_WORDS,
            missing:
              "The second line of your standard does not yet ask for the use to be declared. Ask people to be ready to say what they gave the tool and what it gave back.",
          },
          {
            id: "checked",
            label: "The standard: the facts are checked",
            hint: "One line asking for every figure, date, and name to be checked against a source.",
            min: 20,
            any: CHECKED_WORDS,
            missing:
              "The third line of your standard does not yet ask for facts to be checked. Ask for every figure, date, and name to be checked against a source they can name.",
          },
          {
            id: "limits",
            label: "The standard: the work is within limits",
            hint: "Start with do not, must not, never, or only, and name what stays out of the tool.",
            min: 20,
            rule: "limit",
            any: LIMIT_DATA_WORDS,
            missing:
              "The fourth line of your standard does not yet set a clear limit. Write it as an instruction beginning with do not, must not, never, or only, and name what stays out of the tool, such as customer details or anything confidential.",
          },
          {
            id: "q_in",
            label: "Question one: what went into the tool",
            hint: "Your own words for asking what they gave the tool.",
            min: 12,
            any: ["give", "gave", "put in", "paste", "went in", "into the tool", "start from", "feed"],
            missing:
              "Your first question does not yet ask what went into the tool. Ask what they gave it, or what they pasted in, to work from.",
          },
          {
            id: "q_changed",
            label: "Question two: what they changed",
            hint: "Your own words for asking what the tool gave back that they changed.",
            min: 12,
            any: ["change", "edit", "remove", "took out", "take out", "delete", "rewrote", "different", "kept"],
            missing:
              "Your second question does not yet ask what they changed. Ask what the tool gave back that they changed, removed, or corrected.",
          },
          {
            id: "q_checked",
            label: "Question three: what they checked, and against what",
            hint: "Your own words for asking what they checked and which source they used.",
            min: 12,
            any: ["check", "source", "against", "verif"],
            missing:
              "Your third question does not yet ask what was checked. Ask what they checked, and against which source.",
          },
          {
            id: "signs",
            label: "Three signs in the work I will look for",
            hint: "Three things you would see in the work or hear from the team, not numbers from the tool.",
            min: 40,
            any: SIGN_WORDS,
            missing:
              "Your signs do not yet describe something in the work. Name things you would see or hear, such as sources named without being asked, errors caught before review, or questions about limits, rather than counts of prompts, logins, licences, or hours saved.",
          },
          {
            id: "when",
            label: "When I will look for them",
            hint: "Give a week number or a date, for example the one-to-ones in week 4 and week 8.",
            min: 10,
            rule: "fact",
            any: ["week", "month", "one-to-one", "1:1", "review", "quarter"],
            missing:
              "Your signs do not yet have a time. Say when you will look for them, with a week number or a date, for example at the one-to-ones in week 4 and week 8.",
          },
          {
            id: "next",
            label: "What I will ask for next",
            hint: "One change the team will make once the standard is in place, such as a checking line at the end of every report.",
            min: 20,
            any: ["every", "each", "from next", "from now", "from the", "start", "begin", "line", "ask the team", "ask everyone"],
            missing:
              "What you will ask for next does not yet name one change the team will make. Describe it so you could see it in the work, for example that every report will end with one line saying what was checked.",
          },
        ],
        why: "Your card has the standard in four parts, the three questions in your words, three signs in the work with a time to look for them, and one change you will ask for next. A team member could read it and know what you will ask.",
      },
      bridge:
        "That completes the course. Sign your card to issue your record, and you can open it again from My courses whenever you need it in a one-to-one.",
    },
  ],
};
