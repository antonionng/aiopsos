/*
Course: AI for Writing and Communication
Slug: ai-for-writing-and-communication
For: Managers, communications and policy staff, consultants, and specialists whose work depends on
  emails, briefings, announcements, proposals, and reports. They already use an AI tool for occasional
  drafting and write confidently in English at a professional level.
Outcome: The learner uses a model to produce a first draft from their own point, reader, and material,
  then takes it through an audience pass, a claim pass, and a signature pass until it is a piece they
  would send under their own name, and writes a short standard they will apply to the next piece.
Artefact: The writing standard, with the finished piece, its reader and point, and the standard in five parts.
Record sentence: Took one real piece of writing from a model's first draft to a version they would sign,
  and wrote the standard they will apply to the next piece.
Lessons (id, title, move, interaction, pass rule):
  1. the-first-draft, The first draft, give the model the point, the reader, and the material.
     Practice build (point names what the reader must do or understand, reader names a person or role,
     material holds a concrete fact). Check choose: the request with all three.
  2. audience, Audience, write for this reader rather than for anyone. Practice choose: the opening
     written for a finance director. Check mark: every sentence marked Written for this reader or
     Written for anyone correctly.
  3. claim, Claim, decide whether each claim can be supported. Practice mark and check mark: every claim
     marked A claim I can support or A claim I cannot support yet correctly against the evidence shown.
  4. what-you-will-sign, What you will sign, apply the signature test. Practice mark: every sentence
     marked Passes the signature test or Fails the signature test correctly. Check edit: the Friday
     delivery and the quarterly return are kept, and the hedged close becomes a plain request.
  5. one-finished-piece, One finished piece, run the four passes in order. Practice edit: both facts are
     kept and the unagreed commitment is replaced by a statement that it has not been agreed.
     Check choose: the version that has been through all four passes.
  6. course-assessment, Course assessment, every move on new situations. Practice choose. Check scenario:
     seven questions, pass mark six.
  7. a-standard-for-the-next-one, A standard for the next one, write the artefact. Practice mark: every
     line marked Names a kind of sentence or Too general to catch anything correctly. Check build: the
     finished piece holds a concrete fact, the reader is a named role and the point says what they must
     do, and each part of the standard carries the words its rule looks for.
Sources: UK Government Digital Service, content design guidance on GOV.UK; Plain English Campaign,
  free guides; UK Government, AI Playbook for the UK Government; Anthropic and OpenAI prompt
  engineering documentation.
Tested on phone:          no
Tested returning learner: no
Pass rule tests written:  yes
*/
import type { CourseContent } from "./types.ts";

const THIS_READER = "Written for this reader";
const ANYONE = "Written for anyone";
const SUPPORT = "A claim I can support";
const NOT_YET = "A claim I cannot support yet";
const PASSES = "Passes the signature test";
const FAILS = "Fails the signature test";

export const COURSE: CourseContent = {
  slug: "ai-for-writing-and-communication",
  hours: 2,
  artefact: {
    lessonId: "a-standard-for-the-next-one",
    title: "The writing standard",
    recordLine:
      "Took one real piece of writing from a model's first draft to a version they would sign, and wrote the standard they will apply to the next piece.",
  },
  lessons: [
    {
      id: "the-first-draft",
      title: "The first draft",
      emphasis: "draft",
      place:
        "This is the first of seven lessons. It shows what a model is good at in writing, which is speed, and it sets up the judgement that the rest of the course teaches.",
      sections: [
        {
          heading: "What a model does well",
          paragraphs: [
            "A model can produce a clean, grammatical first draft in a few seconds. It knows how emails, briefings, and reports are usually organised, it rarely makes a spelling mistake, and it does not get tired at the end of the afternoon. For most professionals, the slowest part of writing is the blank page, and a model removes it.",
            "That speed is worth having, and this course does not ask you to give it up. It asks you to be clear about what the speed buys you. A model saves you the typing and the first arrangement of ideas. It does not know what you are trying to achieve with this piece, who will read it, or which facts are true, unless you tell it.",
            "When a model is given only a topic, it writes the most typical piece on that topic. You get a general introduction, a few balanced paragraphs, and a polite close that could have been sent by anyone about anything. The draft is fluent, and it is almost always generic, because generic is what a typical piece looks like.",
          ],
        },
        {
          heading: "Three things to give it before it writes",
          paragraphs: [
            "The difference between a generic draft and a useful one is what you give the model before it starts. This course calls those three things the point, the reader, and the material. The point is the one thing the reader must understand or do after reading, stated in a single sentence. The reader is the named person or group, with a note on what they already know and how they read. The material is your facts, notes, and evidence: the figures, the dates, what was said, and what has not yet happened.",
            "Each of the three closes a gap that the model would otherwise fill with the typical answer. Without the point, it chooses the most obvious one. Without the reader, it writes for a general audience. Without the material, it writes sentences that sound informed but rest on nothing you supplied. Anthropic and OpenAI both make the same recommendation in their published prompting guidance, which is to give the model the context and the goal rather than only the task.",
          ],
          beforeAfter: {
            before: "Write an email about the new expenses process.",
            after:
              "Draft an email to the twelve site supervisors. The point: from 1 April, mileage claims must go through the new app, and paper forms will be returned unpaid. Material: the app is already on their work phones; claims for March can still go on paper until 7 April; Dev Kaur in finance can help anyone who is stuck. They read email on site between jobs, so keep it under 120 words.",
            reading:
              "The first request gives a topic. The second gives the one thing the supervisors must do, who they are and how they read, and the facts the email depends on, including the grace period that answers the question they will ask first.",
          },
        },
        {
          heading: "What a first draft is not",
          paragraphs: [
            "A first draft is not a finished piece. Even a well-briefed model will write some sentences for a general reader, add a claim you did not give it, or close with a phrase you would never use. The rest of this course teaches the passes that deal with each of those problems. A first draft is the material those passes work on.",
            "A first draft is also not a replacement for knowing what you want to say. If you cannot state the point in one sentence before you ask, the model will choose a point for you, and it will choose the most obvious one. That is usually a summary of the situation, when what the reader needed was a request, a decision, or a warning. The discipline of writing the point first is the part of the work that the model cannot do for you.",
          ],
        },
        {
          heading: "The mistake people usually make",
          paragraphs: [
            "The most common mistake is to describe the tone instead of the content. Requests such as 'make it professional', 'make it persuasive', or 'keep it friendly' feel like instructions, but they give the model no point, no reader, and no facts. The model will produce a persuasive, professional piece about the topic in general, and you will have to write the specific version yourself.",
            "The second mistake is to accept what a vague request brings with it. A generic draft often contains commitments you did not decide to make, such as 'we will keep you updated' or 'I will come back to you by the end of the week'. They look harmless because they are polite. Each one is a promise in your name, and the reader is entitled to expect it to be kept. A request that states your point and your material leaves far less room for them.",
          ],
        },
      ],
      workedExample: {
        title: "Two requests for the same email",
        inputLabel: "The two requests",
        outputLabel: "What came back",
        prompt:
          "First request: Write an email about a project delay.\n\nSecond request: Draft an email to our finance director, Claire Dunmore. The point: the lab equipment order is delayed six weeks by the supplier, so I need her agreement to move £18,000 of spend from this quarter to next. Material: the supplier's email of 2 September gives the new delivery date; there is no change to the total budget; the delay does not affect the grant deadline. She reads email on her phone between meetings. Keep it under 150 words and end with the decision I need.",
        output:
          "From the first request: Dear colleague, I am writing to inform you that, due to unforeseen challenges, the project has experienced a delay. We are working hard to resolve the situation and will keep you updated on progress. Thank you for your understanding.\n\nFrom the second request: Dear Claire, the supplier has delayed our lab equipment order by six weeks, and their email of 2 September gives the new delivery date. I would like to move £18,000 of spend from this quarter to next. The total budget does not change, and the delay does not affect the grant deadline. Could you confirm that you are content for me to move the £18,000?",
        reading: [
          "Dr Leah Marsh, a research manager at Hallam Materials Lab, wrote both requests. The first gave the model a topic, so it wrote the typical delay email: an apology for 'unforeseen challenges', no figure, no cause, and no request. It also added a promise to keep the reader updated, which Leah had not decided to make.",
          "The second request stated the point in one sentence, named the reader and how she reads, and listed three facts. The draft that came back used every one of them. It named the cause, the amount, and the two things a finance director would want to know, and it ended with the decision Leah needed.",
          "The second draft is not finished. Its first line could lead with the request rather than the cause, and later lessons will deal with that. But it is built on Leah's point and facts, whereas the first draft would have needed rewriting from nothing.",
        ],
      },
      practice: {
        intro:
          "Plan a draft request for a real piece of writing you owe this week. Fill in the three parts separately before you combine them. The section above on the three things to give the model is still there if you need it.",
        check: {
          kind: "build",
          prompt:
            "Write the point, the reader, and the material for one piece of writing you owe this week.",
          fields: [
            {
              id: "point",
              label: "The point",
              hint: "The one thing the reader must understand or do after reading, in one sentence.",
              min: 20,
              any: ["need", "agree", "approve", "decide", "decision", "understand", "recommend", "ask", "confirm", "know", "sign", "send", "choose"],
              missing:
                "The point does not yet say what the reader must understand or do. Write one sentence that ends in the decision, the action, or the understanding you need from them.",
            },
            {
              id: "reader",
              label: "The reader",
              hint: "The person or group, what they already know, and how they read.",
              min: 12,
              rule: "role",
              missing:
                "The reader is still too thin. Name the person or role, and add what they already know or how they will read the piece.",
            },
            {
              id: "material",
              label: "The material",
              hint: "Your facts, figures, dates, and what has not yet happened.",
              min: 24,
              rule: "fact",
              missing:
                "The material does not yet contain a concrete fact. Add something the model could not guess, such as a figure, a date, a name, or something that has not been agreed.",
            },
          ],
          why: "Your request has a point that says what the reader must do or understand, a named reader, and at least one concrete fact, so the model has something specific to draft from.",
        },
      },
      check: {
        kind: "choose",
        prompt:
          "Farah Iqbal, a policy officer, needs a first draft of a note to her director recommending that a public consultation be extended. Choose the request that gives the model the point, the reader, and the material.",
        leftLabel: "Request A",
        left:
          "Draft a note to my director. The point: I recommend extending the consultation by four weeks. Material: we have 38 responses so far, against 150 last time; two major stakeholder groups have asked in writing for more time; the extension does not affect the ministerial deadline. She reads briefly, so one page, with the recommendation first.",
        rightLabel: "Request B",
        right:
          "Write a professional note recommending that we extend the consultation. Make it persuasive and make sure it covers all the relevant considerations.",
        correct: "left",
        why: "Request A states the point in one sentence, names the reader and how she reads, and gives the three facts the recommendation depends on. The model can draft Farah's argument rather than a general one.",
        wrong:
          "Look again at Request B. It gives the model a topic and a tone, but no point beyond the topic, no reader, and no material, so the model will write a generic case for extending consultations. Request A supplies all three.",
      },
      bridge:
        "The next lesson takes a draft like Leah's and makes it fit a particular reader, which is the first judgement a model cannot make for you.",
    },
    {
      id: "audience",
      title: "Audience",
      emphasis: "Audience",
      place:
        "This is the second of seven lessons and the first of the course's judgements. It comes first because the reader shapes every sentence that follows.",
      sections: [
        {
          heading: "What writing for an audience means",
          paragraphs: [
            "Writing for an audience means choosing what to say, in what order, and in which words, according to three things about this reader: what they already know, what they care about, and what they need to do after reading. Two readers of the same news can need very different pieces. A finance director and a site supervisor both need to know about a new expenses process, but one needs the cost and the risk, and the other needs the date and the button to press.",
            "A model writes by default for a general reader. That produces explanations the expert does not need, jargon the newcomer cannot follow, and background before the point for a reader who has a minute between meetings. The content design guidance that the Government Digital Service publishes on GOV.UK starts from the same place: begin with what the user needs to know or do, and leave out what they do not.",
          ],
        },
        {
          heading: "Written for this reader, or written for anyone",
          paragraphs: [
            "This course uses two labels for the sentences in a draft. A sentence is Written for this reader when it assumes what they know, uses their terms, and moves them towards what they must do. It could only have been written for this person or group, in this situation.",
            "A sentence is Written for anyone when it could be lifted into a document for a different reader without change. Opening claims about the importance of a subject, definitions the reader does not need, and general reassurance usually carry this label. They are not wrong, and some of them are true, but they spend the reader's attention on something that does not help them decide or act.",
          ],
          beforeAfter: {
            before:
              "Effective communication is essential for any successful project. This update sets out the current position on the office move.",
            after:
              "Your team moves to the third floor on Monday 9 June. Please have desks cleared by 5pm on Friday 6 June, and label anything that should come with you.",
            reading:
              "The first version could open any update about any project. The second is written for the team leaders who have to act, and it gives them the date, the deadline, and the task.",
          },
        },
        {
          heading: "What it is not",
          paragraphs: [
            "Writing for an audience is not flattery. A sentence that praises the reader's leadership or thanks them for their continued support is usually written for anyone, because it would fit any reader in the same role. Respect for a reader shows in how well the piece fits what they need, and not in compliments.",
            "It is also not simplifying everything. A technical reader should get technical precision, and removing the detail they rely on makes the piece worse for them. A senior reader should get the decision first, rather than a shorter version of the same background. The question is always what this reader needs, and sometimes the answer is more precision rather than less.",
          ],
        },
        {
          heading: "The usual mistake",
          paragraphs: [
            "The usual mistake is to name the reader as a category and stop there. 'The board', 'stakeholders', and 'the team' are labels, and a model given a label writes for the typical member of it. Before you revise a draft, write one sentence about the actual reader: who they are, what they already know about this subject, and what they must do after reading.",
            "With that sentence in front of you, read the draft from the top and ask of each sentence whether this reader needs it. Move the sentence that tells them what to do towards the top. Remove the definitions they do not need. Replace general words with the words they use, such as the name of the system they log into or the room where they meet.",
          ],
        },
      ],
      workedExample: {
        title: "An IT notice rewritten for warehouse staff",
        inputLabel: "The model's draft",
        outputLabel: "The rewrite for the reader",
        prompt:
          "Security has never mattered more for organisations like ours. Multi-factor authentication, or MFA, is a method of confirming your identity using more than one piece of evidence. From next month, all staff will need to use MFA.",
        output:
          "From Monday 3 November, when you sign in on the shift tablet, you will also need a code from the app on your phone. It takes about ten seconds. If you do not have a work phone, ask your shift lead for a key fob before Friday 31 October.",
        reading: [
          "Aled Morgan, the IT service manager at Pennine Parcels, asked a model for a notice about a change to sign-in. The draft was written for anyone. It opened with a general claim about security, defined a term that warehouse staff did not need, and did not say when, where, or what to do.",
          "Aled's real readers sign in on a shared tablet at the start of each shift, and many of them do not have a work phone. The rewrite starts from that situation. It names the date, the tablet, and the time the new step takes, and it ends with the action for the people most likely to be stuck.",
          "Nothing in the rewrite could be moved into an IT notice for head office without change. That is the test of a piece written for this reader.",
        ],
      },
      practice: {
        intro:
          "Two openings follow for the same email, which asks a finance director who reads on her phone to approve a change to a budget. Choose the one written for this reader. The section on the usual mistake is above if you want to read it again.",
        check: {
          kind: "choose",
          prompt:
            "Mark Ellison, a project lead at Corran Health, is emailing the finance director, Joan Pike, who reads email on her phone between meetings. He needs her approval to move £6,500 from travel to training. Choose the opening written for this reader.",
          leftLabel: "Opening A",
          left:
            "As you will be aware, budgets across the organisation have been under pressure this year, and it is more important than ever that we make the best use of every pound. I thought it would be helpful to set out some background on the team's spending before coming to my request.",
          rightLabel: "Opening B",
          right:
            "Joan, I would like your approval to move £6,500 from our travel budget to training this quarter. The total does not change, and the reasons are below if you want them.",
          correct: "right",
          why: "Opening B puts the decision, the amount, and the reassurance about the total in the first two sentences, which is what a finance director reading on her phone needs. Opening A is written for anyone and makes her scroll before she finds the request.",
          wrong:
            "Look again at Opening A. Its first sentence could open any email about budgets, and it delays the request behind background she did not ask for. Opening B gives her the decision first.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "This draft is for the trustees of Wrenfield Community Trust, a small charity. They are volunteers who meet quarterly, and they need to approve a new platform for online donations. Mark each sentence as Written for this reader or as Written for anyone.",
        passLabel: THIS_READER,
        failLabel: ANYONE,
        sentences: [
          {
            id: "lifeblood",
            text: "Fundraising is the lifeblood of every charity.",
            fail: true,
            why: "This sentence could open any document about fundraising, and it tells the trustees nothing about the decision in front of them, so it is written for anyone.",
          },
          {
            id: "decision",
            text: "We are asking the trustees to approve moving online donations to a new platform from January, at the same monthly cost as now.",
            fail: false,
            why: "This sentence names this board's decision, its date, and its cost, which are the things a volunteer board must weigh, so it is written for this reader.",
          },
          {
            id: "gateway",
            text: "A payment gateway is a service that authorises card payments between a merchant and a bank.",
            fail: true,
            why: "The trustees are not deciding how payment gateways work. This definition would fit any reader, so it is written for anyone.",
          },
          {
            id: "donors",
            text: "Supporters who give monthly will not need to do anything, and we will write to them in December.",
            fail: false,
            why: "A trustee's first worry will be the existing donors, and this sentence answers it, so it is written for this reader.",
          },
        ],
        why: "You kept the sentences that serve this board's decision and marked the general ones that any reader could have received. The trustees now get the decision, the cost, and the answer to their first question, without a lecture on fundraising or payment gateways.",
      },
      bridge:
        "The next lesson moves from who is reading to what you are telling them, and to the claims in a draft that you will have to stand behind.",
    },
    {
      id: "claim",
      title: "Claim",
      emphasis: "Claim",
      place:
        "This is the third of seven lessons and the second of the course's judgements. A piece can suit its reader perfectly and still say something you cannot support.",
      sections: [
        {
          heading: "What counts as a claim",
          paragraphs: [
            "A claim is any sentence that does one of three things. It asserts a fact, such as 'handling time has fallen by 20%'. It reports what someone said or agreed, such as 'as agreed at the last meeting'. Or it commits you or your organisation to something, such as 'we will roll this out in the spring'. A sentence can do more than one of these at once.",
            "Not every sentence is a claim. A thank-you, a greeting, a question, and a request do not assert anything the reader could later check. The claims are the sentences a reader might act on, quote in a meeting, or hold you to, and those are the sentences that need your attention before you send.",
          ],
        },
        {
          heading: "Why models add claims",
          paragraphs: [
            "Models add claims freely, because a confident claim makes writing sound finished. A project report sounds more complete when it says the new process has been welcomed by all teams. A customer letter sounds more reassuring when it says the problem will not happen again. The model has seen thousands of documents that contain sentences like these, so it writes them.",
            "The model does not know whether the teams welcomed the process or whether the problem will recur. It has no access to your feedback forms, your data, or the decisions your leadership team has made. A claim in a model's draft is therefore a claim that nobody has checked, however plausible it sounds, until you check it.",
          ],
        },
        {
          heading: "Can support, or cannot support yet",
          paragraphs: [
            "This course uses two labels for claims. A claim is A claim I can support when you could show the reader the evidence if they asked: the data, the email, the signed policy, or the minutes of the meeting that made the decision. A claim is A claim I cannot support yet when you have no evidence, when the evidence says something weaker, or when the commitment has not been agreed by the person who could make it.",
            "For a claim you cannot support yet, there are three responses. You can find the evidence, and then the claim stands. You can weaken the claim to what the evidence actually shows, which is often still good news. Or you can remove it. What you must not do is leave it in because it sounds right.",
          ],
          beforeAfter: {
            before: "The new rota has been welcomed by all staff and has solved the weekend cover problem.",
            after:
              "Eleven of the fourteen staff who replied to the survey preferred the new rota, and every weekend shift in May was covered.",
            reading:
              "The first version makes two claims the manager could not support. The second states the same good news at the strength the evidence allows, and a reader who asks where the figures came from gets a straight answer.",
          },
        },
        {
          heading: "What this is not, and the usual mistake",
          paragraphs: [
            "This is not a lesson about being timid. A claim you can support should be stated plainly, without hedging. 'Handling time fell from eleven minutes to nine' is better than 'handling time may possibly have improved somewhat', because it is both accurate and useful. Weakening a claim means matching it to the evidence, and it does not mean adding qualifiers to everything.",
            "The usual mistake is to check only the numbers. Figures are the obvious claims, and most people now check them. The claims that slip through are the reported agreements and the commitments: 'as agreed', 'everyone is on board', 'we will'. Each of these says that a person decided something. Ask who decided it, and whether you have seen that decision written down.",
          ],
        },
      ],
      workedExample: {
        title: "A project close report, checked claim by claim",
        inputLabel: "The model's draft of the close report",
        outputLabel: "The revised text",
        prompt:
          "The new process has been welcomed by all teams. It has reduced handling time by 20%. We will roll it out to the Manchester office in the spring.",
        output:
          "Two of the five teams gave feedback, and both were positive. In a four-week sample in the accounts team, average handling time fell from about eleven minutes to nine. A decision on Manchester has not yet been made.",
        reading: [
          "Priya Chandra, a process improvement lead at Marlow Housing Group, checked each sentence against what she actually had. Feedback had come from two of the five teams, and both responses were positive. Handling time had fallen in one team over a four-week sample. Nobody had decided anything about Manchester.",
          "Every sentence in the model's draft was a claim she could not support yet. The revision keeps the good news, stated at the strength the evidence allows, and removes a commitment that nobody had made.",
          "A director who later asked which teams had welcomed the process, or who had agreed the Manchester roll-out, would now get an honest answer. The original report would have left Priya explaining claims that she never meant to make.",
        ],
      },
      practice: {
        intro:
          "Read the evidence, then mark each claim from a sales manager's monthly update. The definitions of the two labels are in the section above.",
        check: {
          kind: "mark",
          prompt: "Mark each claim as A claim I can support or as A claim I cannot support yet, using only the evidence shown.",
          material: {
            label: "The evidence",
            text: "Order book: 14 new contracts signed in October, against 11 in September. Customer survey: 62 responses, of which 48 rated the service good or very good.",
          },
          passLabel: SUPPORT,
          failLabel: NOT_YET,
          sentences: [
            {
              id: "contracts",
              text: "We signed 14 new contracts in October, three more than in September.",
              fail: false,
              why: "The order book gives 14 in October and 11 in September, so this claim can be supported.",
            },
            {
              id: "happy",
              text: "Every customer is happy with the service.",
              fail: true,
              why: "The survey shows 48 of 62 respondents rated the service good or very good. That is good news, but it does not support a claim about every customer.",
            },
            {
              id: "growth",
              text: "Growth will continue through the next quarter.",
              fail: true,
              why: "Two months of figures do not show what will happen next quarter, so this is a claim the manager cannot support yet.",
            },
          ],
          why: "That is right. The contract figures are supported by the order book, and the other two sentences claim more than the survey and two months of orders can show.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "Sarah Okafor, an operations manager, is writing to her team about a new flexible working arrangement. She has the signed policy and the notes from the leadership meeting that approved it. Mark each claim as A claim I can support or as A claim I cannot support yet.",
        material: {
          label: "The evidence",
          text: "Policy: staff may request up to two home-working days a week, subject to line manager approval. Leadership notes: approved for a six-month trial from 1 October; review in March.",
        },
        passLabel: SUPPORT,
        failLabel: NOT_YET,
        sentences: [
          {
            id: "two-days",
            text: "From 1 October you can ask to work from home up to two days a week.",
            fail: false,
            why: "The policy gives two days and the leadership notes give 1 October, so she has the evidence for this claim.",
          },
          {
            id: "permanent",
            text: "This will become permanent after the trial.",
            fail: true,
            why: "The notes say there will be a review in March. Nothing says the arrangement will become permanent, so she cannot support this yet.",
          },
          {
            id: "approved",
            text: "Everyone who asks will be approved.",
            fail: true,
            why: "The policy says requests are subject to line manager approval, so this sentence promises more than the policy gives.",
          },
        ],
        why: "You separated the claim the evidence supports from the two it does not, including a commitment that the organisation has not made. Sarah's team will read the date and the limit with confidence, and nobody will be told that a trial is permanent or that every request will succeed.",
      },
      bridge:
        "The next lesson adds one more test before you sign, which catches the sentences that are accurate and supported but still not yours.",
    },
    {
      id: "what-you-will-sign",
      title: "What you will sign",
      emphasis: "sign",
      place:
        "This is the fourth of seven lessons and the last of the judgements. After audience and claim, it asks whether each sentence is something you would say.",
      sections: [
        {
          heading: "The signature test",
          paragraphs: [
            "The signature test asks one question of every sentence: would you say this, in these words, to this reader, if they were sitting across the table from you? The test works because spoken conversation has no room for the phrases that fill written drafts. Nobody tells a colleague to their face that their efforts were nothing short of transformative.",
            "This course uses two labels for the test. A sentence Passes the signature test when it is plain, accurate, and in your voice, so you would be comfortable saying it aloud to the reader. A sentence Fails the signature test when you would not say it in person, even if every word in it is true. The UK Government's AI Playbook, written for civil servants, makes the underlying point directly: the person using the tool remains responsible for what it produces. Your name at the bottom means the reader hears you.",
          ],
        },
        {
          heading: "Four kinds of sentence that fail",
          paragraphs: [
            "Padding fills space without saying anything. 'I hope this email finds you well' in a note to someone you spoke to an hour ago is padding, and so is 'please do not hesitate to contact me' at the end of every message. Inflated language makes ordinary things sound grand, as in 'a transformative step change' for a process that now takes one fewer form.",
            "False warmth claims feelings you did not express, such as 'I am thrilled' or 'I cannot thank you enough'. Hedging piles qualifiers on a point you are actually sure of, as in 'it may perhaps be worth considering'. Models produce all four readily, because each is common in the writing they learned from, and each makes a draft look polished at a glance.",
          ],
        },
        {
          heading: "What the test is not",
          paragraphs: [
            "The signature test is not about removing all courtesy or all warmth. A genuine thank-you passes easily, and so does a greeting that fits the relationship. The test removes the courtesy you did not mean and the warmth you did not feel, and it leaves the rest.",
            "In practice, a sentence that passes is usually more specific than the one it replaces. Specific thanks are warmer than general praise, because they show the reader that you noticed what they did. The rewrite is often shorter, and it often contains a fact or an action that the original lacked.",
          ],
          beforeAfter: {
            before: "Your dedication and commitment are truly an inspiration to us all.",
            after: "Thank you for staying late on Thursday to finish the stock count. It meant the store opened on time on Friday.",
            reading:
              "The first sentence fails the signature test, because nobody says it across a table. The second passes, and it is warmer, because it names what the colleague did and why it mattered.",
          },
        },
        {
          heading: "The usual mistake",
          paragraphs: [
            "The usual mistake is to accept a sentence because it is accurate and polite. Neither is enough. A sentence can be true, courteous, and still not something you would say, and a reader who knows you will notice the gap between the email and the person.",
            "The second mistake is to read the draft only on screen. Reading aloud, or reading with the particular reader in mind, is the quickest way to hear which sentences are yours. When you reach a sentence you would not say, strike it through and write what you would say instead, or remove it if you would say nothing at all.",
          ],
        },
      ],
      workedExample: {
        title: "A thank-you that sounded like nobody",
        inputLabel: "The model's draft reply",
        outputLabel: "The reply she sent",
        prompt:
          "I hope this message finds you well. I wanted to take a moment to express my profound gratitude for your truly exceptional support, which was nothing short of transformative for the team. Your dedication is an inspiration to us all.",
        output:
          "Thank you for covering the team while Sam was off. Keeping the Thursday deliveries on time made a real difference, and I have told your manager so.",
        reading: [
          "Gemma Hollis, head of distribution at Aldgate Foods, asked a model to thank Anil Mistry, who had covered her team during a two-week sickness absence. The draft was accurate in spirit. Gemma was grateful. But the draft opened with padding, used inflated language and false warmth, and did not say what Anil had actually done.",
          "The reply Gemma sent is shorter and specific. It names the absence, the Thursday deliveries that Anil kept on time, and one action Gemma really took, which was telling his manager. Every sentence passes the signature test.",
          "The rewrite is warmer than the draft because it is specific. Anil can see that Gemma noticed what he did, and he can repeat the last sentence to his manager without embarrassment.",
        ],
      },
      practice: {
        intro:
          "Here are four sentences from a model's draft of an email from a team leader to a supplier she has worked with for three years. Mark each one. The four kinds of sentence that fail are described above.",
        check: {
          kind: "mark",
          prompt: "Mark each sentence as Passes the signature test or as Fails the signature test.",
          passLabel: PASSES,
          failLabel: FAILS,
          sentences: [
            {
              id: "finds-you",
              text: "I trust this message finds you in the very best of health and spirits.",
              fail: true,
              why: "This is padding. She has worked with the supplier for three years and would not open a conversation this way.",
            },
            {
              id: "order",
              text: "Thanks for turning round the order for 400 cartons in two days.",
              fail: false,
              why: "This thanks the supplier for something specific, in words she would use across the table, so it passes.",
            },
            {
              id: "unparalleled",
              text: "Your unparalleled commitment to excellence continues to set the gold standard for the entire industry.",
              fail: true,
              why: "This is inflated language and false warmth. Nobody would say it to a supplier in person.",
            },
            {
              id: "invoice",
              text: "Could you send the invoice to accounts@harrowbuild.co.uk as usual?",
              fail: false,
              why: "This is a plain request in her own voice, so it passes.",
            },
          ],
          why: "That is right. The specific thanks and the plain request pass, and the opening padding and the inflated praise fail, because she would not say either to the supplier's face.",
        },
      },
      check: {
        kind: "edit",
        prompt:
          "Edit this paragraph so that every sentence passes the signature test. It is from a team leader, Rosa Quinn, to her own manager, reporting that a deadline was met. Keep the facts, remove the padding and the inflated words, and turn the hedged last sentence into a plain suggestion or request.",
        label: "The paragraph you are editing",
        start:
          "I hope this finds you well. I am absolutely thrilled to share that, thanks to the tireless and truly outstanding efforts of the whole team, we have successfully delivered the quarterly return on Friday, which represents a truly historic milestone for the department. It may perhaps be worth possibly considering a short thank-you to the team at some point.",
        unchanged:
          "You have not changed the paragraph yet. Start with the first sentence, which is padding, and then replace the inflated words with what the team actually did.",
        keep: [
          {
            id: "return",
            any: ["quarterly return"],
            missing:
              "Your edit has lost what was delivered. Keep the quarterly return in the paragraph and change only the words around it.",
          },
          {
            id: "friday",
            any: ["friday"],
            missing:
              "Your edit has lost the fact that the return was delivered on Friday. Keep the facts and change only the words around them.",
          },
        ],
        limits: [
          {
            id: "request",
            any: ["please", "i suggest", "i recommend", "i would like", "i'd like", "could we", "can we", "shall we", "i propose", "should we", "we should", "would you", "could you"],
            missing:
              "The last sentence still hedges a simple suggestion. If Rosa thinks the team should be thanked, say so plainly, for example 'Could you thank the team at Monday's meeting?' or 'I suggest a short thank-you to the team.'",
          },
        ],
        limitWording: false,
        why: "Your edit keeps the fact that the quarterly return went in on Friday and makes the suggestion plain. Read it once more aloud: if the greeting and words such as 'absolutely thrilled' and 'truly historic' have gone, every sentence now sounds like something Rosa would say to her manager.",
        result: {
          label: "One version that passes",
          text: "We delivered the quarterly return on Friday. The team worked two late evenings to reconcile the supplier accounts in time. Could you thank them at Monday's meeting?",
        },
      },
      bridge:
        "The next lesson puts all four moves in order on one piece of work, from the draft request to the version you would sign.",
    },
    {
      id: "one-finished-piece",
      title: "One finished piece",
      emphasis: "finished",
      place:
        "This is the fifth of seven lessons. It takes one piece of writing all the way through the course's method, so that the final lesson can turn what you did into a standard.",
      sections: [
        {
          heading: "What finished means",
          paragraphs: [
            "A finished piece is one you would send today under your own name. You know who it is for and what it asks of them. You can support every claim in it, and every commitment has been agreed by someone who could make it. Every sentence is one you would say to the reader in person.",
            "That definition is demanding, and it is meant to be. Most drafts that go out with a model's help are not finished in this sense. They are the model's draft with the most obvious problems corrected, and the reader receives whatever the writer did not have time to notice.",
          ],
        },
        {
          heading: "The four passes, in order",
          paragraphs: [
            "Getting to a finished piece follows the sequence this course has taught. First, the draft request, which gives the model your point, your reader, and your material. Second, the audience pass, which rewrites the draft for the named reader. Third, the claim pass, which supports, weakens, or removes each claim. Fourth, the signature pass, which takes out anything you would not say.",
            "The order matters because each pass changes what the next one sees. The audience pass often removes whole paragraphs of background, and there is no point checking the claims in a paragraph you are about to delete. The claim pass often changes the wording of a sentence, and the signature pass should read the wording you will actually send. Doing the passes in order means each one works on the text that remains.",
          ],
        },
        {
          heading: "What a finished piece is not",
          paragraphs: [
            "A finished piece is not the model's draft with a few words changed. If you have corrected the spelling of a name and moved on, you have not done the audience, claim, or signature passes, and the problems those passes catch are still in the text.",
            "It is also not a piece you have rewritten so completely that the model saved you nothing. If you find yourself deleting the whole draft, the problem is usually the draft request, and the faster fix is to give the model a better point, reader, and material and run it again. The aim is that the model did the typing and you did the judgement.",
          ],
        },
        {
          heading: "Where people go wrong",
          paragraphs: [
            "The most common failure is to skip the claim pass under time pressure. The audience and signature passes feel like the visible work, because they change how the piece reads, and the claim pass feels like checking. But the claim pass is the one that stops you promising something you cannot deliver, and it is the one a reader will remember if it goes wrong.",
            "The second failure is to run all the passes at once, reading the draft for a general impression and fixing whatever catches the eye. That catches the loudest problem in each paragraph and misses the quiet ones. Keep the model's first draft beside your revision, run one pass at a time, and ask only that pass's question on each reading.",
          ],
        },
      ],
      workedExample: {
        title: "Leah's delay email, through four passes",
        inputLabel: "The first draft from lesson 1",
        outputLabel: "The email after four passes",
        prompt:
          "Dear Claire, I hope you are well. I am writing to let you know that our supplier has delayed the lab equipment order by six weeks, and I sincerely apologise for any inconvenience this may cause. I would like to move £18,000 of spend from this quarter to next. The delay will not affect the project. Could you confirm that you are content for me to move the £18,000?",
        output:
          "Claire, could you approve moving £18,000 of equipment spend from this quarter to next? The supplier has delayed our order by six weeks, and their email of 2 September gives the new date. The total budget does not change, and the delay does not affect the grant deadline. I will update the forecast as soon as you confirm.",
        reading: [
          "On the audience pass, Leah moved the request to the first line, because Claire reads the first line of each email on her phone and decides then whether to open it. The greeting went too, because it pushed the request down.",
          "On the claim pass, 'the delay will not affect the project' became 'the delay does not affect the grant deadline'. Leah could not show that nothing about the project would change, but she could show the grant deadline, which was the thing Claire would care about.",
          "On the signature pass, 'I sincerely apologise for any inconvenience' was cut. The delay was the supplier's, and Leah had nothing to apologise for. The final email is four sentences, and each pass removed a kind of problem that the other passes would not have caught.",
        ],
      },
      practice: {
        intro:
          "Here is a model's draft from Marion Leckie, a facilities manager at Brandon & Hurst, to Ravi Shah, a department head. She knows the desks arrive on Tuesday 14 March and cost £2,400 as quoted. Nobody has agreed to pay for new chairs, because the budget holder has not decided. Edit the draft through the audience, claim, and signature passes. The section on the four passes is above if you need it.",
        check: {
          kind: "edit",
          prompt:
            "Edit Marion's draft so that it is written for Ravi, makes only claims she can support, and passes the signature test. Keep the delivery date and the cost, and replace the promise about chairs with what is actually true.",
          label: "The draft you are editing",
          start:
            "Dear Ravi, I hope you are well. I am delighted to confirm that the new desks for the second floor will be delivered on Tuesday 14 March, and the total cost is £2,400 as quoted. We will of course cover the cost of replacement chairs for your team as well. Please do not hesitate to reach out with any questions whatsoever.",
          unchanged:
            "You have not changed the draft yet. Start with the claim pass: the sentence about chairs is a commitment nobody has agreed.",
          keep: [
            {
              id: "date",
              any: ["14 march"],
              missing:
                "Your edit has lost the delivery date. Keep Tuesday 14 March, because it is the fact Ravi needs most.",
            },
            {
              id: "cost",
              any: ["2,400", "2400"],
              missing: "Your edit has lost the cost. Keep the £2,400, which Marion can support from the quote.",
            },
          ],
          limits: [
            {
              id: "chairs",
              any: [
                "not been agreed",
                "not yet agreed",
                "not agreed",
                "not been decided",
                "not yet decided",
                "not decided",
                "no decision",
                "to be confirmed",
                "not been confirmed",
                "not yet confirmed",
                "not confirmed",
              ],
              missing:
                "The chairs are still a claim Marion cannot support. Replace 'We will of course cover the cost' with what is true, for example 'The cost of new chairs has not been agreed, and the budget holder will decide.'",
            },
          ],
          limitWording: false,
          why: "Your edit keeps the date and the cost and says plainly that the chairs have not been agreed, which is the claim pass done. If the greeting, 'delighted', and 'do not hesitate' have gone too, Ravi gets four facts he can rely on in words Marion would use.",
          result: {
            label: "One version that passes",
            text: "Ravi, the new desks for the second floor arrive on Tuesday 14 March, and the cost is £2,400 as quoted. The cost of new chairs has not been agreed yet, and I will let you know what the budget holder decides.",
          },
        },
      },
      check: {
        kind: "choose",
        prompt:
          "Nia Roberts, a team leader at Faircroft Analytics, has two versions of an email to a client, Anna Webb, whose report will be a day late. Nia knows the report will arrive on Thursday, the delay is because a data file arrived late from the client's own finance team, and there is no change to the fee. Choose the version that has been through all four passes.",
        leftLabel: "Version A",
        left:
          "Dear Anna, I hope you are well. I am writing to let you know that, due to unforeseen circumstances, your report will unfortunately be slightly delayed. We deeply apologise and will of course waive this month's fee as a gesture of goodwill. We remain fully committed to delivering excellence.",
        rightLabel: "Version B",
        right:
          "Dear Anna, your report will reach you on Thursday rather than Wednesday. The data file from your finance team arrived on Monday afternoon, and we need a day to check it properly. There is no change to the fee. I will send it by midday Thursday.",
        correct: "right",
        why: "Version B states the new date first, gives the true reason, makes no promise Nia has not agreed, and sounds like her. It has been through the audience, claim, and signature passes.",
        wrong:
          "Look again at Version A. It waives the fee, which is a commitment Nia has not been authorised to make, and it hides the real reason behind 'unforeseen circumstances'. Its opening and closing sentences also fail the signature test. Version B states what she can support in her own words.",
      },
      bridge:
        "The next lesson assesses every move in the course on situations you have not seen, and then the final lesson turns the passes into a written standard for your next piece.",
    },
    {
      id: "course-assessment",
      title: "Course assessment",
      emphasis: "assessment",
      place:
        "This is the sixth of seven lessons. It brings together the method from the first five lessons, works one mixed example, and then assesses the whole method on situations you have not seen, before the final lesson asks you to write your standard.",
      sections: [
        {
          heading: "The draft request and the audience pass",
          paragraphs: [
            "A model writes a clean first draft quickly, and given only a topic it writes the most typical piece on that topic. Before it writes, give it three things. The point is the one thing the reader must understand or do, in one sentence. The reader is the named person or group, with what they know and how they read. The material is your facts, figures, dates, and what has not yet happened. A request that describes only the tone, such as 'make it professional', gives the model none of the three.",
            "The audience pass rewrites the draft for the named reader. A sentence is Written for this reader when it assumes what they know, uses their terms, and moves them towards what they must do. A sentence is Written for anyone when it could be moved into a document for a different reader unchanged, such as a general opening claim or a definition the reader does not need. A senior reader gets the decision first, and a technical reader keeps the precision they rely on.",
          ],
        },
        {
          heading: "The claim pass and the signature pass",
          paragraphs: [
            "A claim is a sentence that asserts a fact, reports what someone said or agreed, or commits you to something. It is A claim I can support when you could show the reader the evidence. It is A claim I cannot support yet when you have no evidence, when the evidence says something weaker, or when the commitment has not been agreed by the person who could make it. The response is to find the evidence, weaken the claim to what the evidence shows, or remove it. Check the reported agreements and the commitments as carefully as the numbers.",
            "The signature test asks whether you would say each sentence, in these words, to this reader across the table. Padding, inflated language, false warmth, and hedging all fail it, even when they are accurate. A genuine, specific thank-you passes easily. The four passes run in order, draft request, audience, claim, and signature, because each one changes the text the next one reads.",
          ],
        },
        {
          heading: "How the assessment works",
          paragraphs: [
            "The assessment at the end of this lesson sets seven situations you have not seen, in project management, estates, communications, HR, IT, policy, and team leadership. Each question has one right answer, and each draws on one or more of the moves above.",
            "You need six of the seven to pass. After you submit, each question shows the feedback for the option you chose, and the result gives your score against the pass mark. If you fall short, the feedback names what to look at again, and you can change your answers and submit once more.",
          ],
        },
      ],
      workedExample: {
        title: "An all-staff announcement, through every pass",
        inputLabel: "The request and the model's draft",
        outputLabel: "The announcement after four passes",
        prompt:
          "Request: Write an announcement about the new canteen supplier.\n\nDraft: Good nutrition is at the heart of a happy and productive workplace. We are delighted to announce an exciting new partnership with Greenfold Catering, which will transform your lunchtime experience. Prices will stay the same, and every dish will be locally sourced. We hope you enjoy this fantastic new chapter.",
        output:
          "From Monday 2 February, the canteen at the Leeds office will be run by Greenfold Catering. Opening hours stay at 11:30 to 14:00. Prices for the first three months are fixed at current levels, and the new menu will be on the intranet from Wednesday 28 January. Please send any allergy questions to facilities@corwen.co.uk.",
        reading: [
          "Tariq Hussain, the facilities lead at Corwen Insurance, started with a request that gave only a topic, so the draft was written for anyone. He wrote the point first: staff need to know when the change happens and what stays the same. He named the reader, office staff who read the intranet on the way into work, and gathered the material, including the contract terms.",
          "On the audience pass, the opening claim about nutrition went, and the date moved to the first line. On the claim pass, 'prices will stay the same' became 'prices for the first three months are fixed', because that was what the contract said, and 'every dish will be locally sourced' was removed, because Greenfold had not said it.",
          "On the signature pass, 'exciting new partnership', 'transform your lunchtime experience', and 'fantastic new chapter' were cut. Tariq would not say any of them to a colleague in the lift. The announcement that went up is shorter, and every sentence in it is true and his.",
        ],
      },
      practice: {
        intro:
          "Before the assessment, choose which of Tariq's revised claims he can support. The paragraph on the claim pass is above if you want to read it again.",
        check: {
          kind: "choose",
          prompt:
            "Tariq's contract with Greenfold Catering fixes prices for three months and says nothing about where food is sourced. Choose the sentence he can send.",
          leftLabel: "Sentence A",
          left: "Prices for the first three months are fixed at current levels.",
          rightLabel: "Sentence B",
          right: "Prices will stay the same, and every dish will be locally sourced.",
          correct: "left",
          why: "Sentence A states what the contract says, at the strength it says it. Sentence B turns a three-month fix into a permanent promise and adds a claim about sourcing that nobody made.",
          wrong:
            "Look again at Sentence B. The contract fixes prices for three months, not for good, and it says nothing about local sourcing, so Tariq cannot support either claim. Sentence A matches the evidence.",
        },
      },
      check: {
        kind: "scenario",
        prompt:
          "Read each situation and choose what you would do. Each question has one right answer, and you need six of the seven to pass.",
        passMark: 6,
        questions: [
          {
            id: "draft-request",
            situation:
              "Sanjay Mehta is a project lead at Colbrook Rail. He needs to ask the programme board to delay the go-live of a new ticketing system by two weeks, because supplier testing found 14 defects, three of them serious. He types 'Write an update on the ticketing project for the board' and gets back a page of general progress with no request in it.",
            question: "What should Sanjay do next?",
            options: [
              {
                id: "a",
                text: "Add 'Make it concise and professional' to the request and run it again.",
                feedback:
                  "That describes a tone but still gives the model no point and no facts, so it will write a shorter general update. The board needs the request to delay and the reason for it, which only Sanjay can supply.",
              },
              {
                id: "b",
                text: "Rewrite the request with the point, the reader, and the material: the two-week delay he needs approved, a board that wants the decision first, and the 14 defects with three serious.",
                correct: true,
                feedback:
                  "That is the draft request the course teaches. The point tells the model what the board must decide, the reader tells it how to order the paper, and the defect figures give it the evidence, so the next draft is built on Sanjay's case.",
              },
              {
                id: "c",
                text: "Ask for three versions of the update and choose the best one.",
                feedback:
                  "Three drafts from the same request will be three general updates. More versions do not supply the missing point or facts. The fix is a better request, not more of the same output.",
              },
              {
                id: "d",
                text: "Correct the grammar in the draft and add a sentence at the end asking for the delay.",
                feedback:
                  "A request bolted on at the end of a general update buries the decision under a page of background, and the board may not reach it. Give the model the point first and it will build the paper around it.",
              },
            ],
          },
          {
            id: "audience",
            situation:
              "Helen Burrows is head of estates at Tynedale College. She is writing to the audit committee, whose members are non-executives, about a survey that found 22 fire doors in the main building below standard. The model's draft opens with two paragraphs explaining how fire door ratings work, and the committee's action appears in the last line.",
            question: "What should Helen change first?",
            options: [
              {
                id: "a",
                text: "Keep the explanation, because non-executives may not know how fire door ratings work.",
                feedback:
                  "The committee does not need to understand ratings to act on this. Two paragraphs of definition are written for anyone and push the decision to the end. Lead with what the committee must note or approve.",
              },
              {
                id: "b",
                text: "Add a sentence thanking the committee for its continued focus on safety.",
                feedback:
                  "Thanking the committee in general terms is written for anyone, and it adds one more sentence before the point. The change that matters is moving the action and the risk to the top.",
              },
              {
                id: "c",
                text: "Open with what the committee must note or approve and the 22 doors, and cut the explanation of ratings.",
                correct: true,
                feedback:
                  "That is the audience pass. A senior, non-executive reader gets the decision and the scale of the problem first, and the definition that any reader could have received goes.",
              },
              {
                id: "d",
                text: "Simplify every sentence so that the paper reads more easily.",
                feedback:
                  "Simpler sentences in the same order still put the decision last. Writing for this reader is about what comes first and what is left out, and not only about shorter words.",
              },
            ],
          },
          {
            id: "weaken",
            situation:
              "Bethany Cole is a communications officer at Holmfirth Leisure Trust. Her draft press release says 'Visitor numbers have doubled since the pool reopened.' The turnstile counts she has show 3,100 visits in June this year against 1,900 in June last year.",
            question: "What should Bethany do with the sentence?",
            options: [
              {
                id: "a",
                text: "Change it to say that June visits rose from about 1,900 last year to 3,100 this year.",
                correct: true,
                feedback:
                  "That weakens the claim to exactly what the evidence shows, and it is still good news stated plainly. A journalist who asks for the figures gets the same numbers that are in the release.",
              },
              {
                id: "b",
                text: "Keep it, because the rise is close enough to double and the headline is stronger.",
                feedback:
                  "A rise from 1,900 to 3,100 is about 63%, not double. A reporter who checks the counts will find the gap, and the trust will have published a figure it cannot support. State what the turnstiles show.",
              },
              {
                id: "c",
                text: "Add 'approximately' so that it reads 'Visitor numbers have approximately doubled'.",
                feedback:
                  "A qualifier does not fix a claim the evidence does not support. The counts do not show approximately double. Replace the claim with the figures she has.",
              },
              {
                id: "d",
                text: "Remove all figures from the release in case any of them are challenged.",
                feedback:
                  "The June figures are a claim Bethany can support, and they are the best evidence the trust has. Removing them makes the release weaker without making it more accurate. Weaken the claim to the evidence instead.",
              },
            ],
          },
          {
            id: "commitment",
            situation:
              "Martin Doyle is an HR business partner at Eastgate Logistics. He is drafting a letter to staff about a proposed restructure. The consultation is open until 30 April, and no decisions have been made. The model's draft includes the sentence 'No roles will be lost in the Leeds office.'",
            question: "What should Martin do with that sentence?",
            options: [
              {
                id: "a",
                text: "Keep it, because the Leeds office is not in the first phase of the proposal.",
                feedback:
                  "Not being in the first phase is not the same as a decision that no roles will go. Staff will read this as a promise, and nobody has the authority to make it while the consultation is open.",
              },
              {
                id: "b",
                text: "Soften it to 'We do not expect any roles to be lost in the Leeds office.'",
                feedback:
                  "Softer wording still reads as an assurance, and staff will remember it if the outcome changes. Martin has no evidence for any expectation, so the claim should go.",
              },
              {
                id: "c",
                text: "Move it to the end of the letter so that it is less prominent.",
                feedback:
                  "Moving a commitment does not make it one the organisation has made. Wherever it sits, staff can quote it back. Remove it and state what is true.",
              },
              {
                id: "d",
                text: "Remove it and say that no decisions have been made and that the consultation closes on 30 April.",
                correct: true,
                feedback:
                  "That is right. The sentence was a commitment nobody had agreed, so it goes, and it is replaced with the two things Martin can support: no decisions yet, and the date the consultation closes.",
              },
            ],
          },
          {
            id: "signature",
            situation:
              "Kieran Walsh is the operations lead at Stanmore Finance. The IT team worked overnight on Saturday to move the payments system to new servers, and it was running by 6am. The model's draft of his thank-you begins: 'I cannot thank you enough for your heroic, tireless efforts, which were nothing short of extraordinary.'",
            question: "What should Kieran send instead?",
            options: [
              {
                id: "a",
                text: "The draft as it is, because the team did work very hard and deserves strong praise.",
                feedback:
                  "The team deserves thanks, but this sentence is false warmth and inflated language, and Kieran would not say it to them in person. Specific thanks will mean more to the people who stayed up.",
              },
              {
                id: "b",
                text: "Thank you for working through Saturday night on the payments move. Having it running by 6am meant branches opened on time on Monday.",
                correct: true,
                feedback:
                  "That passes the signature test. It is specific about what the team did and why it mattered, and it is something Kieran would say to them across the table. It is warmer for being specific.",
              },
              {
                id: "c",
                text: "The payments migration was completed on Saturday night.",
                feedback:
                  "This is accurate, but it drops the thanks altogether. The signature test removes the warmth Kieran did not mean, not the thanks he does mean. Keep a plain, specific thank-you.",
              },
            ],
          },
          {
            id: "order",
            situation:
              "Mei Lin is a policy adviser at Harrow Vale Council. She has a 600-word model draft of a briefing for the cabinet member on parking charges. The first three paragraphs are background the cabinet member already knows, and Mei is about to check every figure in them against the council's data.",
            question: "What is the better next step?",
            options: [
              {
                id: "a",
                text: "Check every claim in the whole draft first, because accuracy matters more than order.",
                feedback:
                  "Accuracy does matter, but checking claims in paragraphs that are about to be cut wastes time Mei does not have. The audience pass comes before the claim pass for exactly this reason.",
              },
              {
                id: "b",
                text: "Run the signature pass first, so that the tone is right before she spends time on the figures.",
                feedback:
                  "The signature pass reads the wording she will send, and that wording will change on the audience and claim passes. It comes last. The next step is the audience pass.",
              },
              {
                id: "c",
                text: "Run the audience pass first, cutting the background the cabinet member already knows, and then check the claims in what remains.",
                correct: true,
                feedback:
                  "That is the order the course teaches. The audience pass removes the paragraphs this reader does not need, so the claim pass works only on sentences that will be sent.",
              },
              {
                id: "d",
                text: "Send the draft with a note asking the cabinet member to skip the first three paragraphs.",
                feedback:
                  "That hands the audience pass to the reader, and it sends figures nobody has checked. Cut the background yourself and then check the claims that remain.",
              },
            ],
          },
          {
            id: "standard",
            situation:
              "Grace Adebayo leads a customer accounts team at Linford Energy. She is writing her own standard for work where a model has helped. In the last month she has had to remove a model's promise of a refund, a date for a meter visit nobody had booked, and a comment about a colleague's handling of a complaint.",
            question: "Which line should go in her standard under 'I never let the model write'?",
            options: [
              {
                id: "a",
                text: "Any refund or credit, any appointment date I have not booked, and any comment on a named colleague's work.",
                correct: true,
                feedback:
                  "That names the kinds of sentence Grace has actually had to remove, so it will catch the next one. A line in a standard works when it is specific to the job.",
              },
              {
                id: "b",
                text: "Anything that is wrong.",
                feedback:
                  "Nobody lets a model write things they know are wrong. The line has to name the kinds of sentence that look right and are not, such as refunds, dates, and comments about people.",
              },
              {
                id: "c",
                text: "Long sentences and informal language.",
                feedback:
                  "Those are style points, and a writing standard is not a style guide. The line should name the claims and commitments Grace must write or check herself.",
              },
              {
                id: "d",
                text: "Anything important.",
                feedback:
                  "This is too general to catch anything, because every sentence can seem important or unimportant in a busy week. Name the kinds of sentence, such as a refund, a booked date, or a comment on a colleague.",
              },
            ],
          },
        ],
        why: "You applied the whole method to situations you had not seen before. You gave the model a point, a reader, and material, rewrote for the named reader, matched each claim to its evidence, kept the sentences you would say in person, and ran the passes in order.",
      },
      bridge:
        "You have now used every move in the course on new situations. In the last lesson you will submit your finished piece and write the standard you will apply to the next one, and that is the work your record will show.",
    },
    {
      id: "a-standard-for-the-next-one",
      title: "A standard for the next one",
      emphasis: "standard",
      place:
        "This is the last of seven lessons. You submit the piece you finished and write the writing standard that appears on your record.",
      sections: [
        {
          heading: "What a writing standard is",
          paragraphs: [
            "A writing standard is a short, personal set of rules that you apply to every piece of writing where a model has helped. It records what you will always give the model before it drafts, the questions you ask on the audience and claim passes, the kinds of sentence you will never let the model write for you, and the signature test in your own words.",
            "The standard exists because the judgement in this course is easy to agree with and easy to forget. On a quiet afternoon you will run all four passes. On a busy Thursday, with six emails to send before a meeting, you will be tempted to send the draft. A standard short enough to keep in view is what survives that Thursday.",
          ],
        },
        {
          heading: "The line that matters most",
          paragraphs: [
            "The most important part of the standard is the list of sentences you will never let a model write. It is usually specific to your job. For a finance officer it might be any figure that was not supplied and any payment date. For a manager it might be any comment on a named person's performance. For anyone dealing with customers it is usually prices, refunds, dates, and admissions of fault. Other common entries are legal wording and any apology on behalf of the organisation.",
            "In the practice below, a line in this list either Names a kind of sentence or is Too general to catch anything. A line that names a kind of sentence tells you, as you read, which sentences to stop at, such as 'any date for a decision I have not made'. A line that is too general to catch anything, such as 'anything wrong' or 'anything sensitive', sounds careful but gives you nothing to look for. Base your list on the claims you actually had to remove in the claim lesson and in your finished piece.",
          ],
        },
        {
          heading: "What a standard is not",
          paragraphs: [
            "A standard is not a style guide. It does not need to cover spelling, formatting, or the house rules on capital letters, and your organisation probably has a document for those already. The Plain English Campaign publishes free guides on writing plainly if you want one.",
            "A standard is also not a list of everything the course taught. It is the judgement from the course, reduced to what you personally need to remember, written in your own words. If a line in it would not change what you do on a busy day, leave it out.",
          ],
        },
        {
          heading: "How your submission is checked",
          paragraphs: [
            "The finished piece must contain at least one concrete fact, such as a date, a figure, or a name, because a piece written for a real reader always does. Remove any personal details of the reader that should not appear on a record a second person can open. The reader and point must name the reader and say what they needed to do or understand.",
            "Before drafting must mention what you give the model, such as the point, the reader, or the material. The audience and claim questions must include a question about evidence, support, or agreement. The line on what you never let the model write must name at least one kind of sentence, such as a price, a date, an apology, or a judgement about a person. The signature test must be written in your own words and mention saying or signing. If a part is missing, the note names it and says what to add.",
          ],
        },
      ],
      workedExample: {
        title: "Leah's writing standard",
        inputLabel: "What Leah had learned in lessons 1 to 5",
        outputLabel: "Her writing standard",
        prompt:
          "Her first request gave a topic and produced an apology for 'unforeseen challenges' and a promise to keep the reader updated. Her audience pass moved the request to the first line for a reader on her phone. Her claim pass turned 'will not affect the project' into 'does not affect the grant deadline'. Her signature pass cut an apology for a delay that was the supplier's fault.",
        output:
          "Before drafting: I give the point in one sentence, the reader and how they read, and my facts.\nAudience pass: does the first line tell this reader what I need from them?\nClaim pass: can I show evidence for every fact, and has the right person agreed every commitment?\nI never let the model write: any figure I have not supplied, any promise about budget or dates, or any apology on behalf of the lab.\nSignature test: would I say it to this person across the table?",
        reading: [
          "Every line of Leah's standard comes from something that went wrong in her own draft. The audience question is about the first line because her finance director reads first lines. The never line names figures, budget and date promises, and apologies because those are the sentences she had to remove.",
          "The standard is five lines long. It is short enough to keep beside the screen and specific enough to catch the errors she has actually made, which is the test your own standard has to meet.",
        ],
      },
      practice: {
        intro:
          "Before you write your own standard, mark each of these lines from other people's 'I never let the model write' lists. The paragraph on the line that matters most is above.",
        check: {
          kind: "mark",
          prompt: "Mark each line as Names a kind of sentence or as Too general to catch anything.",
          passLabel: "Names a kind of sentence",
          failLabel: "Too general to catch anything",
          sentences: [
            {
              id: "refund",
              text: "Any refund, credit, or discount that my manager has not approved.",
              fail: false,
              why: "This names the kinds of sentence to stop at, so it will catch a model's goodwill offer.",
            },
            {
              id: "sensitive",
              text: "Anything sensitive.",
              fail: true,
              why: "Almost anything can be sensitive, so this line gives the writer nothing specific to look for.",
            },
            {
              id: "performance",
              text: "Any comment on how a named colleague has performed.",
              fail: false,
              why: "This names a kind of sentence, a judgement about a person, that a manager should always write or check.",
            },
            {
              id: "mistakes",
              text: "Mistakes.",
              fail: true,
              why: "Nobody lets a model write mistakes on purpose. The line has to name the sentences that look right and may not be.",
            },
          ],
          why: "That is right. The lines about refunds and colleagues name the kinds of sentence to stop at, and 'anything sensitive' and 'mistakes' are too general to catch anything.",
        },
      },
      check: {
        kind: "build",
        prompt:
          "Paste the finished piece you worked on in lesson 5, then write your standard for the next one. Remove any personal details that should not appear on your record.",
        fields: [
          {
            id: "piece",
            label: "Finished piece",
            hint: "The final text you sent or will send, after all four passes.",
            min: 120,
            rule: "fact",
            missing:
              "The finished piece does not yet contain a concrete fact. Paste the piece you took through the four passes, with the date, figure, or name it was written around.",
          },
          {
            id: "reader-point",
            label: "Reader and point",
            hint: "Who the piece was for, and the one thing they needed to understand or do.",
            min: 20,
            rule: "role",
            any: ["need", "decide", "decision", "approve", "agree", "understand", "know", "confirm", "sign", "act on", "choose", "reply", "point"],
            missing:
              "Name the reader, not just the topic, and say what they needed to understand, decide, or do.",
          },
          {
            id: "before",
            label: "Before drafting",
            hint: "What you will always give the model before it writes.",
            min: 20,
            any: ["point", "reader", "material", "facts", "evidence"],
            missing: "Say what you will give the model before it writes: your point, your reader, and your material.",
          },
          {
            id: "questions",
            label: "Audience and claim questions",
            hint: "The questions you ask on the audience pass and the claim pass.",
            min: 30,
            any: ["evidence", "support", "agreed", "commit", "prove", "source", "check"],
            missing:
              "Your claim question should ask whether you can support each fact and whether each commitment has been agreed.",
          },
          {
            id: "never",
            label: "I never let the model write",
            hint: "The kinds of sentence you will always write or check yourself.",
            min: 20,
            any: [
              "price",
              "date",
              "deadline",
              "figure",
              "number",
              "apolog",
              "fee",
              "discount",
              "refund",
              "credit",
              "commitment",
              "promise",
              "performance",
              "legal",
              "contract",
              "budget",
              "fault",
              "colleague",
              "person",
            ],
            missing:
              "Name the kinds of sentence you will always write yourself, such as a price, a date, an apology, or a judgement about a person.",
          },
          {
            id: "signature",
            label: "Signature test",
            hint: "The test in your own words.",
            min: 20,
            any: ["say", "sign", "across the table", "in person", "aloud", "face"],
            missing:
              "Write the signature test in your own words, as a question about whether you would say or sign each sentence in front of the reader.",
          },
        ],
        why: "Your finished piece and your standard show the draft request, the reader, the claims, and the sentences you keep for yourself. This is the work that will appear on your record.",
      },
      bridge:
        "Your finished piece and your standard are ready. Confirm that the piece is your own real work, sign your name below, and the record will show your standard, the course, and the date to anyone who opens the reference.",
    },
  ],
};
