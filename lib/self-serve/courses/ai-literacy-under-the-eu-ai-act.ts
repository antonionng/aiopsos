/*
Course: AI Literacy under the EU AI Act
Slug: ai-literacy-under-the-eu-ai-act
For: Managers, team leaders, and people in operations, compliance support, learning and
  development, or HR who have been asked what their area needs to do about AI literacy. They know
  which AI systems their team uses and for what. They have no legal training, and the course is
  not legal advice.
Outcome: The learner can explain, in general terms, what Article 4 asks of providers and deployers
  and what it does not ask, can explain why no course record is evidence that anyone is compliant,
  can write a literacy measure for a role that names the system, the context, the people affected,
  what the person must be able to do, and how you will know, and can describe what an internal
  record of those measures contains. They leave with a one-page AI literacy plan for their area.
Artefact: The AI literacy plan (scope, measures for each role, record, owner and review, and what
  the plan does not claim).
Record sentence: Wrote and signed a one-page AI literacy plan for their area, setting out a measure
  for each role and the evidence that will be kept, with a plain statement that the plan is not a
  claim of compliance.
Lessons (id, title, move, interaction, pass rule):
  1. what-article-4-asks, What Article 4 asks, separate what the provision says from what is
     claimed about it, practice choose / check mark ("In Article 4", "Not in Article 4"), every
     sentence marked correctly.
  2. what-ai-literacy-means, What AI literacy means, describe literacy for one role in terms of
     skills, knowledge, and understanding, practice mark ("Part of the definition", "Not part of
     the definition") / check choose, the description tied to the role and the people affected.
  3. what-it-does-not-give-you, What it does not give you, tell supported statements from claims
     about certificates and compliance, practice choose / check mark ("Supported by the Act",
     "A claim the Act does not support"), every sentence marked correctly.
  4. a-measure-for-your-role, A measure for your role, write a measure with six parts, practice
     mark ("The measure gives this", "The measure leaves this out") / check edit, the edit keeps
     the role and adds a system, a context, the people affected, an observable ability, and a way
     of knowing, each detected by keyword groups.
  5. what-a-record-contains, What a record contains, write record entries that state what was done
     and the evidence, practice choose / check mark ("Records what was done", "Claims more than was
     done"), every sentence marked correctly.
  6. course-assessment, Course assessment, apply the whole method to new situations, practice
     choose / check scenario of seven questions, six of seven correct.
  7. the-plan, The plan, write the artefact, practice mark ("States a limit", "Makes a claim") /
     check build: Scope needs a system word and a concrete fact; Measures needs an observable
     ability ("able to" and similar); Record needs evidence or review, not only attendance; Owner
     and review needs a number, a period, or a trigger; What this plan does not claim needs a plain
     statement that the plan does not claim or state compliance. The ban on claim words outside the
     statement of limits is taught in the lesson and left to tutor feedback, because the engine
     checks for the presence of parts.
Sources:
  Regulation (EU) 2024/1689 (the Artificial Intelligence Act), Article 3 (definitions, including AI
  literacy, provider, and deployer) and Article 4 (AI literacy), official text on EUR-Lex; read the
  current consolidated version. European Commission, AI literacy questions and answers, on the
  Commission's digital strategy website. European AI Office, living repository of AI literacy
  practices. European Commission proposals to amend the Act, which include changes to Article 4;
  check their current status. UK Government, AI Playbook for the UK Government. No enforcement
  dates, penalties, or amounts are stated anywhere in the course.
Tested on phone:          no
Tested returning learner: no
Pass rule tests written:  yes (lib/__tests__/course-ai-literacy-under-the-eu-ai-act.test.ts)
*/

import type { CourseContent } from "./types.ts";

const IN_ARTICLE = "In Article 4";
const NOT_IN_ARTICLE = "Not in Article 4";
const SUPPORTED = "Supported by the Act";
const UNSUPPORTED = "A claim the Act does not support";
const RECORDS = "Records what was done";
const CLAIMS = "Claims more than was done";

export const COURSE: CourseContent = {
  slug: "ai-literacy-under-the-eu-ai-act",
  hours: 2,
  artefact: {
    lessonId: "the-plan",
    title: "The AI literacy plan",
    recordLine:
      "Wrote and signed a one-page AI literacy plan for their area, setting out a measure for each role and the evidence that will be kept, with a plain statement that the plan is not a claim of compliance.",
  },
  lessons: [
    {
      id: "what-article-4-asks",
      title: "What Article 4 asks",
      emphasis: "Article",
      place:
        "This is the first of seven lessons. Before anyone interprets the provision, sells a course against it, or writes a plan for it, you need to know what the provision itself says. This lesson reads Article 4 in general terms and gives you two labels for testing any summary of it.",
      sections: [
        {
          heading: "The duty in plain words",
          paragraphs: [
            "The EU AI Act is Regulation (EU) 2024/1689. Article 4 is the provision on AI literacy. In general terms, it places a duty on providers and deployers of AI systems to take measures to ensure a sufficient level of AI literacy among their staff and among other people who operate or use AI systems on their behalf. That is the whole of the core duty, and it is worth reading slowly, because each part of it does work.",
            "The provision also says what those measures should take into account. It refers to the people's technical knowledge, their experience, their education and training, the context in which the AI systems are used, and the people or groups on whom the systems are used. In other words, the measures are meant to fit the person, the job, and the people affected, rather than being the same for everyone.",
            "The Commission has published proposals to amend the Act, and those proposals include changes to Article 4. This course therefore describes the provision in general terms and does not tell you what any amendment will do. Before you rely on the wording in a document of your own, read the current consolidated text on EUR-Lex and the Commission's AI literacy pages, and ask your legal or compliance advisers where you have them.",
          ],
        },
        {
          heading: "Who must act",
          paragraphs: [
            "Article 4 names two kinds of organisation. A provider is, broadly, an organisation that develops an AI system, or has one developed, and places it on the market or puts it into service under its own name. A deployer is an organisation that uses an AI system under its authority in a professional context. Most employers whose staff use AI tools at work are deployers, even if they have never built anything.",
            "The people covered are wider than the payroll. The provision refers to staff and to other persons dealing with the operation and use of AI systems on the organisation's behalf. Agency workers, contractors, and outsourced teams who use your systems for your work can fall within that description, so a plan that stops at employees may leave out the people doing much of the work.",
          ],
          beforeAfter: {
            before: "Our AI literacy measures apply to all permanent employees.",
            after:
              "Our AI literacy measures apply to employees and to the agency staff and contractors who use our AI systems on our behalf.",
            reading:
              "The first version draws the line at the employment contract. The second follows the provision, which looks at who operates and uses the systems on the organisation's behalf.",
          },
        },
        {
          heading: "What kind of duty it is",
          paragraphs: [
            "The duty is to take measures towards a sufficient level of literacy. It is a standard of reasonable, targeted effort, and it is not a fixed test that a person passes or fails. Article 4 does not name a course, a provider, a number of hours, an exam, or a certificate. It leaves the organisation to decide what measures fit its people and its systems, and to be able to explain that decision.",
            "This matters at work because most of what you will hear about Article 4 comes from people who want you to buy something or approve something. A summary that says every employee must pass an approved exam sounds official and is easy to act on, but it is not what the provision says. If you act on the summary rather than the text, you may spend the budget on the wrong measure and still have nothing to show for the roles that matter most.",
          ],
        },
        {
          heading: "Two labels for any summary",
          paragraphs: [
            "In this lesson you will test summaries of the provision with two labels. A statement is In Article 4 when the provision itself contains it, even in different words: for example, that deployers must take measures towards a sufficient level of AI literacy, or that the measures should take account of experience and context. A statement is Not in Article 4 when it goes beyond the text, for example by requiring an exam, naming an approved course, setting a number of hours, or saying that a course makes an organisation compliant.",
            "The usual mistake is to give a statement the first label because it sounds reasonable. Plenty of reasonable ideas are Not in Article 4. Training everyone for a full day may even be a good measure in some organisations, but the provision does not require it, and a summary that says it does has added something. The test is always whether the text says it, and not whether it sounds sensible.",
          ],
        },
      ],
      workedExample: {
        title: "A vendor's email read against the text",
        inputLabel: "The email from the training vendor",
        outputLabel: "What the manager noted after reading Article 4",
        prompt:
          "Dear Ms Varga, the EU AI Act requires all staff to complete certified AI training by law. Our eight-hour course is fully accredited and makes your organisation compliant with Article 4. We can book your 140 staff onto the next intake.",
        output:
          "Article 4 asks providers and deployers to take measures to ensure a sufficient level of AI literacy among staff and others using AI systems on our behalf, taking account of their knowledge, experience, training, the context, and the people affected. It does not require certification, it sets no number of hours, and it does not say that any course makes an organisation compliant. Next step: list which roles use which systems before deciding whether this course is a suitable measure for any of them.",
        reading: [
          "Eszter Varga is a regional operations manager at Halden Distribution. The email makes three claims that are Not in Article 4: that training must be certified, that all staff need the same course, and that a course confers compliance.",
          "Her note restates what the provision does contain, in her own words, which is the duty to take measures and the factors those measures should take into account. Each sentence of the note could be traced back to the text.",
          "She does not reject the course outright. She treats it as one possible measure, which can only be judged once she knows which roles use which systems and who is affected. That is the question the rest of this course helps her answer.",
        ],
      },
      practice: {
        intro:
          "Two colleagues have each written a one-line summary of Article 4 for a team briefing. Choose the one that stays within the provision. The section on what kind of duty it is will help if you want to read it again.",
        check: {
          kind: "choose",
          prompt: "Choose the summary that says only what Article 4 contains.",
          leftLabel: "Summary A",
          left:
            "Our organisation must take measures to ensure a sufficient level of AI literacy among the people who use AI systems on our behalf, taking account of their experience, the context, and who is affected.",
          rightLabel: "Summary B",
          right:
            "Every member of staff must complete an approved AI literacy course of at least one day and receive a certificate before they use any AI tool.",
          correct: "left",
          why: "Summary A restates the duty and the factors the measures should take into account, so every part of it is In Article 4. Summary B adds an approved course, a minimum length, and a certificate, none of which the provision mentions.",
          wrong:
            "Look again at Summary B. Article 4 does not name an approved course, a length, or a certificate, so each of those is Not in Article 4. Summary A restates the duty to take measures and the factors, which is what the provision contains.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "A colleague, Dominic Reyes, has summarised Article 4 for the operations team at Castleford Foods. Mark each sentence of his summary as In Article 4 or Not in Article 4.",
        passLabel: IN_ARTICLE,
        failLabel: NOT_IN_ARTICLE,
        sentences: [
          {
            id: "duty",
            text: "Organisations that use AI systems at work must take measures to ensure their staff have a sufficient level of AI literacy.",
            fail: false,
            why: "This is the core duty as it applies to deployers, which includes organisations using AI systems under their authority at work, so it is In Article 4.",
          },
          {
            id: "factors",
            text: "The measures should take into account people's experience and training and the context in which the systems are used.",
            fail: false,
            why: "Experience, training, and context are among the factors the provision lists, so this sentence is In Article 4.",
          },
          {
            id: "exam",
            text: "Every employee must pass an approved AI literacy exam.",
            fail: true,
            why: "The provision asks for measures towards a sufficient level. It does not mention an exam, an approved course, or a pass mark, so this sentence is Not in Article 4.",
          },
          {
            id: "others",
            text: "The duty also covers people who operate or use AI systems on the organisation's behalf, not only employees.",
            fail: false,
            why: "The provision refers to staff and other persons dealing with the operation and use of AI systems on the organisation's behalf, such as contractors, so this sentence is In Article 4.",
          },
        ],
        why: "That is the right reading. Dominic's first, second, and fourth sentences restate the duty, the factors, and the people covered, and his third adds an approved exam that the provision never mentions.",
      },
      bridge:
        "Article 4 asks for a sufficient level of AI literacy. The next lesson reads the Act's definition of AI literacy, which explains why that level cannot be the same for every role.",
    },
    {
      id: "what-ai-literacy-means",
      title: "What AI literacy means",
      emphasis: "literacy",
      place:
        "In the first lesson you read what Article 4 asks organisations to do. This lesson reads what the Act means by AI literacy, because that definition tells you what a measure should aim at for each role.",
      sections: [
        {
          heading: "The definition in the Act",
          paragraphs: [
            "The Act defines AI literacy in Article 3, its list of definitions. In general terms, AI literacy is the skills, knowledge, and understanding that allow providers, deployers, and affected persons, taking account of their rights and obligations under the Act, to make an informed deployment of AI systems and to be aware of the opportunities and risks of AI and the harm it can cause.",
            "The definition is short, and it is easy to read past it. It does not talk about enthusiasm, confidence, or general awareness of technology. It talks about what a person can do, what they know, and what they understand, and it ties all three to making an informed deployment and to being aware of risk and harm.",
          ],
        },
        {
          heading: "Three parts worth separating",
          paragraphs: [
            "It helps to separate the definition into three parts. Skills are what a person can do with the system, such as checking a draft for facts and commitments before it is sent, or stopping and escalating when an output could harm someone. Knowledge is what they know about the system they use, such as the fact that it can produce confident wrong answers, and what must never be entered into it.",
            "Understanding is their grasp of the opportunities, the risks, and the possible harm in their own work. An adviser who understands that a wrong reply can mislead a customer in financial difficulty will read a draft differently from one who sees the tool only as a way to save time. When you describe literacy for a role, write one or two sentences for each of the three parts.",
          ],
          beforeAfter: {
            before: "Staff in the claims team should be comfortable with AI.",
            after:
              "Skills: claims handlers can check the tool's summary against the claim file before relying on it. Knowledge: they know the summary can leave out facts and must not be used for the decision letter. Understanding: they understand that a missing fact can lead to an unfair decision for a claimant.",
            reading:
              "The first version describes a feeling. The second names what the handler can do, what they know about this tool, and who could be harmed, which is what the definition asks for.",
          },
        },
        {
          heading: "Why the level differs by role",
          paragraphs: [
            "Article 4 asks for a sufficient level of AI literacy, and it says the measures should take account of the person's knowledge, experience, and training, the context of use, and the people affected. Put that together with the definition and the conclusion follows: the right level differs by role. A customer service adviser using a drafting tool, an HR officer using a screening feature, and an engineer building a model each need different skills, different knowledge, and different understanding.",
            "This is good news for a manager. It means you do not have to teach everyone how models are built, and you do not have to buy the same course for the whole organisation. It also means that a single awareness session for everyone is unlikely to be enough on its own for a role whose outputs affect people's pay, jobs, health, or money, because the context there asks for more.",
          ],
        },
        {
          heading: "What AI literacy is not",
          paragraphs: [
            "AI literacy is not general enthusiasm for AI, and a measure that aims at enthusiasm is aiming at something the definition does not mention. It is also not the same thing as technical knowledge of how models are trained. That knowledge is useful for an engineer and largely irrelevant for a payroll officer checking an answer about holiday pay.",
            "In the practice below you will use two labels. A description is Part of the definition when it names a skill, a piece of knowledge, or an understanding that helps the person use a system well and be aware of its risks and harm in their job. It is Not part of the definition when it names something else, such as excitement about AI, a general interest in technology, or technical detail the role does not need. The common mistake is to treat technical depth as literacy. For most roles, the literacy that matters is knowing where this system goes wrong in this job, and what to do about it.",
          ],
        },
      ],
      workedExample: {
        title: "Literacy for one role in a contact centre",
        inputLabel: "The manager's task",
        outputLabel: "What she wrote",
        prompt:
          "Fiona Adeyemi manages the contact centre at Brightwater Energy. Her 28 advisers use an AI tool in the customer platform to draft email replies to customers about bills and meter readings. She has been asked to say what AI literacy means for them.",
        output:
          "Skills: advisers can check every draft for facts and commitments before sending, and can stop and escalate when a draft promises a refund, a payment plan, or a date. Knowledge: advisers know which tool they use, that its drafts can contain invented facts, and that customer bank details must never be pasted into it. Understanding: advisers understand that a wrong reply can mislead a customer or breach our policy, and that customers in vulnerable circumstances may be more affected.",
        reading: [
          "Fiona's description follows the three parts of the definition, and each part is tied to one system and one job. Nothing in it would help a data scientist, and it does not need to.",
          "The skills are things a team leader could watch an adviser do, such as stopping a draft that promises a refund. That will matter in lesson four, when a measure has to state what people must be able to do.",
          "The understanding names the people affected, including customers in vulnerable circumstances. That reflects the part of Article 4 that asks measures to take account of the people on whom the systems are used.",
        ],
      },
      practice: {
        intro:
          "A manager at Kestrel Housing has listed what AI literacy should mean for the repairs team, who use an AI assistant to log and prioritise tenants' repair requests. Mark each line with the two labels from the last section.",
        check: {
          kind: "mark",
          prompt: "Mark each line as Part of the definition or Not part of the definition.",
          passLabel: "Part of the definition",
          failLabel: "Not part of the definition",
          sentences: [
            {
              id: "skill",
              text: "Repairs coordinators can check the assistant's priority against the repairs policy and raise it when a tenant reports damp, gas, or no heating.",
              fail: false,
              why: "This is a skill tied to the system the team uses and to the tenants affected, so it is part of the definition.",
            },
            {
              id: "excited",
              text: "Repairs coordinators should feel excited about what AI can do for housing.",
              fail: true,
              why: "Excitement is a feeling, and the definition asks for skills, knowledge, and understanding, so this line is not part of the definition.",
            },
            {
              id: "understanding",
              text: "Repairs coordinators understand that a request given too low a priority can leave a tenant in an unsafe home.",
              fail: false,
              why: "This names the harm the system can cause to the people affected, which is the understanding the definition describes.",
            },
          ],
          why: "That is right. The skill and the understanding both tie literacy to the assistant and the tenants, and excitement about AI is not something the definition asks for.",
        },
      },
      check: {
        kind: "choose",
        prompt:
          "Two managers have described what AI literacy means for the payroll team at Linden Retail, who use an AI assistant to answer staff questions about pay and holiday. Choose the description that follows the Act's definition and fits the role.",
        leftLabel: "Description A",
        left:
          "Skills: payroll staff can check the assistant's answers against the pay policy before relying on them, and escalate anything about an individual's pay. Knowledge: they know the assistant can give confident wrong answers and must not be given individual salary data. Understanding: they understand that a wrong answer about pay can cause real hardship and a loss of trust.",
        rightLabel: "Description B",
        right:
          "Payroll staff should understand how large language models work, including neural networks and training data, and should be positive about the potential of AI across the business.",
        correct: "left",
        why: "Description A covers skills, knowledge, and understanding, and ties each part to the assistant the team uses, their work, and the staff whose pay is affected. That is the definition applied to one role.",
        wrong:
          "Look again at Description B. It asks for technical knowledge the payroll role does not need and for a positive attitude, which is not part of the definition. It says nothing about using this assistant safely or about the harm to staff whose pay is affected. Description A covers all three parts for this role.",
      },
      bridge:
        "You can now say what literacy means for a role. Before you write measures, the next lesson is clear about what Article 4, and any course including this one, does not give you.",
    },
    {
      id: "what-it-does-not-give-you",
      title: "What it does not give you",
      emphasis: "not",
      place:
        "This is the third of seven lessons, and it is the centre of what this course promises. It protects you, and the people you brief, from the claims that most often surround the Act.",
      sections: [
        {
          heading: "Claims the Act does not support",
          paragraphs: [
            "A number of claims are made about AI literacy that the Act does not support. The Act does not require a certificate. The European Commission's published questions and answers on AI literacy indicate that no certificate is needed and that organisations may keep their own internal records of what they have done. The Act does not prescribe a particular course, a particular provider, or a number of hours.",
            "Most importantly, the Act does not say that completing any course makes a person or an organisation compliant. Article 4 asks for measures towards a sufficient level of literacy. A course can be one of those measures, and it can produce evidence that the measure was taken, but no course, record, or certificate turns the measure into a finding of compliance.",
          ],
        },
        {
          heading: "Article 4 is one provision among many",
          paragraphs: [
            "Article 4 is one provision in a long regulation. Other obligations may apply to your organisation depending on what your systems are and what you use them for, such as the prohibited practices in Article 5, the requirements for high-risk systems, and the transparency obligations in Article 50. Data protection law applies alongside all of them. Work on AI literacy does nothing, on its own, for any of those.",
            "This is why a sentence such as 'we have covered the AI Act' is a claim the Act does not support, even when the literacy work is good. The honest statement is narrower: the organisation has taken these measures towards AI literacy for these roles, and here is the evidence. Anything wider is for your legal or compliance advisers to assess.",
          ],
        },
        {
          heading: "Two labels for briefings and announcements",
          paragraphs: [
            "In this lesson you will test statements with two labels. A statement is Supported by the Act when it reflects the text, for example that the organisation must take measures towards a sufficient level of AI literacy, or that measures should differ by role and context. A statement is A claim the Act does not support when it goes beyond the text, especially about certificates, approved courses, required hours, or compliance.",
            "The claims tend to appear in the same places: a vendor's sales email, an internal announcement written in a hurry, and a slide for the board that wants a clear answer. They are rarely made in bad faith. They are made because 'certified and compliant' is simpler to say than 'one of several measures, with evidence'. Your job is to keep the simpler words out when they are not true.",
          ],
          beforeAfter: {
            before: "Complete this course to receive your EU AI Act certificate and make our organisation compliant.",
            after:
              "This course is one of the measures we are taking to build AI literacy in teams that use AI tools. The course record shows what you did. It is not a certificate of compliance with the EU AI Act.",
            reading:
              "The first version makes two claims the Act does not support: that there is an EU AI Act certificate, and that a course makes an organisation compliant. The second describes the course as a measure and says plainly what the record is not.",
          },
        },
        {
          heading: "What this course's record is",
          paragraphs: [
            "The same test applies to the record this course issues. When you finish, the record names you, the course, the date, and the plan you wrote, with a public reference that someone else can open. It is evidence that you did this work and produced this plan. It does not say that you or your organisation comply with the EU AI Act or any other regulation, and you should not describe it that way to anyone.",
            "Think of the record as one piece of evidence you prepare. Your plan, once it is carried out, will produce more evidence: the sessions held, the reviews of real work, and the dates they happened. Together, that evidence lets your organisation explain what it did. Whether that is enough is a judgement for the organisation and its advisers, and not something any record can settle.",
          ],
        },
      ],
      workedExample: {
        title: "An announcement rewritten",
        inputLabel: "The first draft of the announcement",
        outputLabel: "The version that went out",
        prompt:
          "From: Learning and Development, Ashcombe Building Society. Great news. All colleagues must complete our new AI course by the end of the quarter. On completion you will receive your official EU AI Act certificate, and the Society will be fully compliant with the AI Act.",
        output:
          "From: Learning and Development, Ashcombe Building Society. Colleagues who use the AI tools in our mortgage and savings systems will be invited to a short course, starting with the mortgage team. The course is one of the measures we are taking to build AI literacy for each role, alongside reviews of real work by team leaders. Your course record shows what you completed. It is not a certificate of compliance with the EU AI Act or any other regulation.",
        reading: [
          "Nadia Rahman, the learning and development officer, found three claims the Act does not support in the first draft: that there is an official EU AI Act certificate, that a course makes the Society compliant, and, by implication, that the same course is needed by everyone.",
          "Her rewrite describes the course as a measure, which is what Article 4 asks for, and names the roles it is for. It also mentions reviews of real work, which is the kind of evidence you will meet in lesson five.",
          "The last two sentences say plainly what the record is and is not. Every sentence of the new version is Supported by the Act, and none of them tells colleagues that anyone has become compliant.",
        ],
      },
      practice: {
        intro:
          "Two versions of a slide for the executive committee at Morrow Logistics describe the AI literacy work. Choose the one you could present without making a claim the Act does not support. The section on the two labels is above.",
        check: {
          kind: "choose",
          prompt: "Choose the slide wording that is Supported by the Act.",
          leftLabel: "Slide A",
          left:
            "AI Act: done. All 310 staff have completed certified AI training, so Morrow Logistics is now compliant with the EU AI Act.",
          rightLabel: "Slide B",
          right:
            "AI literacy: measures are in place for the three roles that use AI systems, with team leader reviews of real work each quarter. This is our literacy work only, and it is not an assessment of compliance with the Act.",
          correct: "right",
          why: "Slide B describes measures for specific roles, names the evidence, and says plainly what the work does not cover. Slide A claims certified training and compliance with the whole Act, and the Act supports neither claim.",
          wrong:
            "Look again at Slide A. The Act creates no certificate for AI literacy, and no training makes an organisation compliant with the Act, which has many other provisions. Slide B describes the measures and the evidence and says what they are not.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "These sentences come from an internal briefing about AI literacy at Farrow and Keel, a firm of surveyors. Mark each one as Supported by the Act or A claim the Act does not support.",
        passLabel: SUPPORTED,
        failLabel: UNSUPPORTED,
        sentences: [
          {
            id: "measures",
            text: "Article 4 asks us to take measures to ensure a sufficient level of AI literacy among staff who use AI systems on our behalf.",
            fail: false,
            why: "This restates what Article 4 asks, so it is Supported by the Act.",
          },
          {
            id: "compliant",
            text: "Once everyone has completed the course, we will be compliant with the EU AI Act.",
            fail: true,
            why: "No course makes an organisation compliant with the Act, and Article 4 is only one of its provisions, so this is A claim the Act does not support.",
          },
          {
            id: "certificate",
            text: "Staff will receive an official EU AI Act certificate.",
            fail: true,
            why: "The Act does not create an official certificate for AI literacy, and the Commission's questions and answers indicate that none is required, so this is A claim the Act does not support.",
          },
          {
            id: "by-role",
            text: "Our measures will differ by role, taking into account what each team does and the systems they use.",
            fail: false,
            why: "Article 4 asks measures to take account of people's knowledge, experience, and context, so measures that differ by role are Supported by the Act.",
          },
        ],
        why: "That is a careful reading. You kept the two sentences that reflect the text and marked the claims about compliance and an official certificate, which the Act does not support.",
      },
      bridge:
        "With the limits clear, the next lesson turns the definition into a measure that one role can carry out and a manager can review.",
    },
    {
      id: "a-measure-for-your-role",
      title: "A measure for your role",
      emphasis: "measure",
      place:
        "This is the fourth of seven lessons. You know what Article 4 asks and what literacy means for a role. This lesson turns that into a measure, which is the thing an organisation actually does.",
      sections: [
        {
          heading: "What a measure is",
          paragraphs: [
            "A literacy measure is a specific action an organisation takes so that the people in one role reach a sufficient level of AI literacy for the systems they use. It is the unit your plan is built from. A session, a supervised piece of work, a guidance sheet with a review, or a change to how work is checked can all be measures, provided they are aimed at one role and one set of systems.",
            "A measure is not a slogan. 'All staff will complete AI awareness training' names no system, no context, and nothing the person must be able to do afterwards, so nobody can tell whether it worked. A measure is also not a promise of perfect performance. It is a reasonable, targeted step that can be described in advance and reviewed afterwards.",
          ],
        },
        {
          heading: "The six parts",
          paragraphs: [
            "A good measure has six parts. It names the role. It names the systems people in that role use. It describes the context, meaning what they use the systems for. It names the people affected, meaning the customers, staff, suppliers, applicants, or members of the public on whom the system's outputs have an effect.",
            "It states what they must be able to do, in terms someone could watch, such as 'check every draft for commitments before sending' or 'review every application in the lowest band'. Finally, it says how you will know, meaning the evidence that the measure worked, such as a manager's review of a sample of real work. The first four parts come from Article 4 and the definition. The last two are what make the measure something you can review.",
          ],
          beforeAfter: {
            before: "Recruiters will attend AI training.",
            after:
              "Role: recruiters. System: the ranking feature in our applicant tracking system. Context: shortlisting for advertised roles. People affected: job applicants. Must be able to: review every application in the lowest band rather than relying on the rank. How we will know: the HR lead reviews one shortlist per recruiter each quarter.",
            reading:
              "The first version says only that something will happen. The second says who, with which system, for what, affecting whom, what they will be able to do, and how anyone will see that they can.",
          },
        },
        {
          heading: "Writing what people must be able to do",
          paragraphs: [
            "The part people most often get wrong is what the person must be able to do. 'Understand AI risks' cannot be watched. 'Check each figure the assistant produces against the ledger before it goes into the pack' can be watched, and a manager can look at a month-end pack and see whether it happened.",
            "Start the line with 'must be able to' and finish it with an action on a real piece of work. Use the skills you wrote in lesson two. If the action involves stopping and asking someone, name who they ask, because escalation that goes nowhere is not a skill anyone can practise.",
          ],
        },
        {
          heading: "Two labels for a draft measure",
          paragraphs: [
            "In the practice you will read a draft measure part by part and use two labels. A part is marked The measure gives this when you can point to the words that do that job. A part is marked The measure leaves this out when no words in the draft do it, even if the reader could guess.",
            "The common mistake is to fill a gap in your head. You know that the finance team uses the assistant for month-end, so you read 'finance staff' and assume the context is there. A colleague reviewing the plan in six months will not know it, and a measure that relies on what you happen to know cannot be reviewed by anyone else.",
          ],
        },
      ],
      workedExample: {
        title: "A measure for recruiters",
        inputLabel: "The HR manager's first draft",
        outputLabel: "The measure she wrote",
        prompt:
          "Recruiters at Tamworth Health Partners will complete an AI module this year.",
        output:
          "Role: the four recruiters in the resourcing team. System: the ranking feature in our applicant tracking system. Context: shortlisting applications for advertised clinical and support roles. People affected: job applicants. Must be able to: explain what the ranking is based on, as described in the vendor's documentation; review every application in the lowest band rather than relying on the rank; recognise when the ranking may disadvantage a group of applicants and escalate to the HR lead. Measure: a two-hour session using our own anonymised past applications, followed by one supervised shortlisting. How we will know: the HR lead reviews one shortlist per recruiter each quarter and records whether the lowest band was reviewed.",
        reading: [
          "Grace Whitfield, the HR manager, started with a line that had a role and an action and nothing else. Her rewrite has all six parts, and each one is labelled so that a reviewer can find it.",
          "The system's outputs affect people's access to work, which is a context that calls for particular care. The measure reflects that by asking recruiters to review the lowest band and to recognise possible unfairness to a group, rather than simply to use the tool well.",
          "The last part tells the HR lead exactly what to look at each quarter. That review will produce the evidence you will record in lesson five, and it is evidence of what recruiters can do, not only of who attended.",
        ],
      },
      practice: {
        intro:
          "Read this draft measure from Pellow Insurance and mark each of the six parts. The section on the six parts is above if you want it.",
        check: {
          kind: "mark",
          prompt:
            "The draft reads: 'Claims handlers will use the summary tool in the claims system to summarise claim files, and will attend a one-hour session on it. Claimants are affected by the decisions.' Mark each part as The measure gives this or The measure leaves this out.",
          passLabel: "The measure gives this",
          failLabel: "The measure leaves this out",
          sentences: [
            {
              id: "role",
              text: "The role",
              fail: false,
              why: "The draft names claims handlers, so it gives the role.",
            },
            {
              id: "system",
              text: "The systems",
              fail: false,
              why: "The draft names the summary tool in the claims system, so it gives the system.",
            },
            {
              id: "context",
              text: "The context",
              fail: false,
              why: "Summarising claim files is what the handlers use the tool for, so the draft gives the context.",
            },
            {
              id: "affected",
              text: "The people affected",
              fail: false,
              why: "The draft names claimants as the people affected by the decisions.",
            },
            {
              id: "able",
              text: "What they must be able to do",
              fail: true,
              why: "Attending a session is not something the handlers must be able to do afterwards. The draft leaves out an observable ability, such as checking the summary against the file before a decision.",
            },
            {
              id: "know",
              text: "How you will know",
              fail: true,
              why: "Nothing in the draft says how anyone will see whether the measure worked, such as a review of a sample of decisions.",
            },
          ],
          why: "That is right. The draft gives the role, the system, the context, and the people affected, but it leaves out what handlers must be able to do and how anyone will know, which are the two parts that make a measure reviewable.",
        },
      },
      check: {
        kind: "edit",
        prompt:
          "Edit this measure for the finance team at Oakridge Components so that it has all six parts: the role, the systems, the context, the people affected, what they must be able to do, and how you will know. You may keep finance staff as the role or narrow it.",
        label: "The measure you are rewriting",
        start: "All finance staff will complete a one-hour AI awareness e-learning module.",
        unchanged:
          "You have not changed the measure yet. Add the system the finance team uses, what they use it for, who is affected, what they must be able to do, and how you will know.",
        limitWording: false,
        keep: [
          {
            id: "role",
            any: ["finance", "accounts", "payroll", "credit control", "management accountant"],
            missing:
              "Keep the role. The measure should still say that it is for the finance team, or for a named part of it such as accounts payable.",
          },
        ],
        limits: [
          {
            id: "system",
            any: ["assistant", "tool", "software", "copilot", "system", "feature", "platform"],
            missing:
              "Name the AI system this role uses, such as the assistant in your accounting software.",
          },
          {
            id: "context",
            any: [
              "context",
              "use it for",
              "uses it for",
              "used for",
              "use it to",
              "uses it to",
              "used to",
              "to draft",
              "to prepare",
              "to summarise",
              "to answer",
              "to reconcile",
              "month-end",
              "month end",
            ],
            missing:
              "Say what the role uses the system for, for example 'they use it to draft replies to supplier queries'.",
          },
          {
            id: "affected",
            any: [
              "affected",
              "suppliers",
              "customers",
              "clients",
              "employees",
              "budget holders",
              "payees",
              "members of the public",
            ],
            missing:
              "Name the people on whom the system's outputs have an effect, such as suppliers, staff, or customers, and use the words 'people affected'.",
          },
          {
            id: "able",
            any: ["able to", "can check", "can explain", "can recognise", "can spot", "escalate"],
            missing:
              "State something the person must be able to do that you could see, starting with 'must be able to', such as checking a figure against the ledger before use.",
          },
          {
            id: "know",
            any: ["how we will know", "we will know", "evidence", "sample", "reviews", "reviewed", "spot check", "spot-check"],
            missing:
              "Say how you will know the measure worked, such as 'How we will know: the finance manager reviews a sample of five replies per person each quarter'.",
          },
        ],
        why: "Your measure now names the role, the system, the context, the people affected, what they must be able to do, and how you will know. It is targeted in the way Article 4 describes, and a colleague could review it without asking you what you meant.",
        result: {
          label: "One version that has all six parts",
          text: "Role: accounts payable officers in the finance team. System: the AI assistant in our accounting software. Context: they use it to draft replies to supplier queries and to summarise statements. People affected: suppliers, and budget holders who rely on the figures. Must be able to: check every figure against the ledger before use, and escalate any draft that commits us to a payment date. Measure: a one-hour session using our own past queries, then five supervised replies. How we will know: the finance manager reviews a sample of five replies per person each quarter.",
        },
      },
      bridge:
        "A measure says what you will do. The next lesson covers the record of what was done, and how to keep it from claiming more than it shows.",
    },
    {
      id: "what-a-record-contains",
      title: "What a record contains",
      emphasis: "record",
      place:
        "This is the fifth of seven lessons. Your plan will include an outline of the record you will keep. This lesson teaches what goes into that record and what must stay out of it.",
      sections: [
        {
          heading: "What a record is for",
          paragraphs: [
            "An internal record of AI literacy measures is a document that shows what your organisation did, for whom, and when, so that you can review it and explain it if you are asked. It is the evidence you prepare as the measures are carried out. The Commission's questions and answers on AI literacy indicate that organisations may keep their own internal records, and that no certificate is needed.",
            "A record is not a compliance certificate, and it should not be written to look like one. Its readers are your own managers, your auditors, your legal or compliance advisers, and anyone who later asks what was done. Each of them needs facts they can check, not conclusions they have to take on trust.",
          ],
        },
        {
          heading: "What each entry contains",
          paragraphs: [
            "For each measure, a useful record contains five things. It names the role and the people in it, or at least how many. It names the systems covered. It states the measure taken and the date it was taken. It describes the evidence that people can do what the measure required, such as a manager's review of a sample of work or a completed supervised task. And it gives a date for review, or the event that will trigger one, because systems and roles change.",
            "The evidence is the part that is most often missing. A completion list shows who attended. It does not show that anyone can now check a draft, question a ranking, or stop an unsafe output. A record that holds only attendance is weak, because it shows presence rather than literacy, and the measures you wrote in lesson four already say what evidence to collect.",
          ],
        },
        {
          heading: "Two labels for a record entry",
          paragraphs: [
            "In this lesson you will read record entries with two labels. An entry Records what was done when it states facts about the measure and the evidence: who, which system, what was done, when, what was reviewed, and what was found. An entry Claims more than was done when it states a conclusion that the evidence cannot support, such as 'fully compliant', 'all risks addressed', 'certified in AI', or 'no further action needed'.",
            "The difference is not about tone. A plain entry can claim too much, and a detailed entry can still be modest. The test is whether a reader could check each statement against something that happened. If an entry reports that two advisers were retrained after the review, that is a fact, and it is a good one to record, because it shows the review found something and acted on it.",
          ],
          beforeAfter: {
            before: "Customer team: AI Act compliant. All staff certified in AI. Risks fully mitigated.",
            after:
              "Customer team, 14 advisers. System: AI drafting tool in our customer platform. Measure: 90-minute session on checking drafts, held 10 and 12 June. Evidence: team leaders reviewed five sent replies per adviser in July; two advisers were retrained. Review: January, or sooner if the tool changes.",
            reading:
              "The first version makes three claims the evidence could not support. The second states what was done, for whom, when, what evidence exists, and when it will be reviewed.",
          },
        },
        {
          heading: "Keeping the record honest over time",
          paragraphs: [
            "A record is written in stages. The measure and its date go in when the measure happens. The evidence goes in after the review, which may be weeks later. The review date goes in at the start and is updated when the review takes place. An entry that is half complete is acceptable, provided it says what is still to come rather than implying it has happened.",
            "Resist the pressure to summarise the record with a single word. A director who asks 'are we covered?' deserves an honest answer, and the honest answer is a description of the measures and the evidence, with a note that other obligations under the Act are outside the literacy work. You prepare the evidence. Whether it is enough is a judgement for the organisation and its advisers.",
          ],
        },
      ],
      workedExample: {
        title: "A record entry rewritten",
        inputLabel: "The first draft of the entry",
        outputLabel: "The entry that went into the record",
        prompt:
          "Warehouse supervisors (Leeds and Wakefield): trained on AI. Fully compliant. All AI risks in the warehouse addressed.",
        output:
          "Warehouse supervisors, Leeds and Wakefield sites, 11 people. System: the AI scheduling assistant in our warehouse management system. Measure: a one-hour session on checking the assistant's shift suggestions against the rota rules and working time limits, held 4 September. Evidence: the operations manager reviewed two weekly rotas per supervisor in October and recorded whether each suggestion had been checked; one supervisor was given a second supervised week. Review: April, or when the scheduling assistant is updated.",
        reading: [
          "Joel Mensah, the operations manager at Crane Street Logistics, started with an entry that made two claims no literacy record can support: that the team is fully compliant, and that all AI risks have been addressed.",
          "His rewrite keeps every fact he could check: the sites, the number of people, the system, the session and its date, the review of real rotas, and what the review found. It also records that one supervisor needed more support, which is the kind of detail that shows the review was real.",
          "The review line gives both a month and a trigger. Nothing in the entry says anyone has become compliant, and every line Records what was done.",
        ],
      },
      practice: {
        intro:
          "Two versions of a record entry for the payroll team at Dunmore Council are below. Choose the one that Records what was done. The section on the two labels is above.",
        check: {
          kind: "choose",
          prompt: "Choose the entry that Records what was done without claiming more.",
          leftLabel: "Entry A",
          left:
            "Payroll team, 7 officers. System: the AI assistant in the HR and payroll system. Measure: a session on checking the assistant's answers about pay against the pay policy, held 19 May. Evidence: the payroll manager reviewed ten answers per officer in June. Review: December.",
          rightLabel: "Entry B",
          right:
            "Payroll team: all 7 officers completed AI training and are certified. The team is fully AI literate and meets all requirements of the AI Act.",
          correct: "left",
          why: "Entry A states the role, the number of people, the system, the measure and its date, the evidence of what people can do, and a review date. Entry B claims certification, full literacy, and meeting all requirements of the Act, none of which a record of one session can show.",
          wrong:
            "Look again at Entry B. There is no AI Act certificate, 'fully AI literate' is a conclusion rather than a fact, and a literacy record cannot show that all requirements of the Act are met. Entry A records what was done and the evidence.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "These lines come from a draft record of AI literacy measures for the finance team at Harlow Engineering. Mark each one as Records what was done or Claims more than was done.",
        passLabel: RECORDS,
        failLabel: CLAIMS,
        sentences: [
          {
            id: "who",
            text: "Finance team, 9 staff. System: the AI assistant in our accounting software. Session on checking figures against the ledger held 3 March.",
            fail: false,
            why: "This line states the role, the number of people, the system, the measure, and the date, so it Records what was done.",
          },
          {
            id: "compliant",
            text: "The finance team is now fully AI Act compliant.",
            fail: true,
            why: "A session and a review cannot show compliance with the Act, and a literacy record should not claim it, so this line Claims more than was done.",
          },
          {
            id: "evidence",
            text: "Evidence: the finance manager reviewed one month-end pack per person in April and recorded whether AI-produced figures had been checked.",
            fail: false,
            why: "This describes evidence of what people can do, not only attendance, so it Records what was done.",
          },
          {
            id: "risks",
            text: "All AI risks in the finance team have been eliminated.",
            fail: true,
            why: "No measure eliminates all risk, and the record has no evidence for this, so it Claims more than was done.",
          },
          {
            id: "review",
            text: "Review: September, or sooner if the accounting software changes.",
            fail: false,
            why: "A review date and a trigger are facts about what will happen next, so this line Records what was done.",
          },
        ],
        why: "That is right. You kept the lines that state what was done, the evidence, and the review, and you marked the claims of compliance and eliminated risk.",
      },
      bridge:
        "You now have every part of the plan. The next lesson brings the whole method together and assesses it on situations you have not seen, before you write your own plan.",
    },
    {
      id: "course-assessment",
      title: "Course assessment",
      emphasis: "assessment",
      place:
        "This is the sixth of seven lessons. It recaps the method from the first five lessons, works one mixed example, and then assesses the whole method on seven situations you have not seen, before the final lesson asks you to write your plan.",
      sections: [
        {
          heading: "What Article 4 asks, and what literacy means",
          paragraphs: [
            "In general terms, Article 4 places a duty on providers and deployers of AI systems to take measures to ensure a sufficient level of AI literacy among their staff and other people who operate or use AI systems on their behalf. The measures should take account of the people's knowledge, experience, education and training, the context of use, and the people on whom the systems are used. Most employers whose staff use AI tools at work are deployers, and the people covered can include agency staff and contractors.",
            "The Act defines AI literacy as the skills, knowledge, and understanding that allow people to make an informed deployment of AI systems and to be aware of their opportunities, risks, and possible harm. Because the measures must take account of role and context, the level that is sufficient differs by role. Literacy is not enthusiasm, and for most roles it is not technical knowledge of how models are built. It is knowing where this system goes wrong in this job, and what to do about it.",
          ],
        },
        {
          heading: "What it does not give you",
          paragraphs: [
            "Article 4 does not require a certificate, an approved course, an exam, or a number of hours. The Commission's questions and answers indicate that no certificate is needed and that organisations may keep their own internal records. No course, including this one, makes a person or an organisation compliant, and Article 4 is one provision among many, alongside the prohibited practices, the requirements for high-risk systems, the transparency obligations, and data protection law.",
            "When you read a briefing, a vendor's email, or a board slide, test each statement. It is Supported by the Act when it reflects the text, and it is A claim the Act does not support when it adds certificates, required courses, or compliance. Your own words should describe measures and evidence, and should leave any wider judgement to the organisation and its legal or compliance advisers.",
          ],
        },
        {
          heading: "Measures and records",
          paragraphs: [
            "A measure is a specific action for one role, with six parts: the role, the systems, the context, the people affected, what they must be able to do, and how you will know. The ability is written as something a person could watch, and the way of knowing is a review of real work rather than a completion list.",
            "The record is the evidence you prepare as measures are carried out. Each entry names the role and the people, the systems, the measure and its date, the evidence of what people can do, and a review date or trigger. An entry Records what was done when it states facts a reader could check, and it Claims more than was done when it states a conclusion such as 'fully compliant' or 'all risks addressed'.",
            "The assessment at the end of this lesson sets seven situations in logistics, care, insurance, banking, procurement, retail, and at board level. Each question has one right answer and draws on one or more of the moves above. You need six of the seven to pass, and after you submit, each question shows the feedback for the option you chose.",
          ],
        },
      ],
      workedExample: {
        title: "One request, answered with the whole method",
        inputLabel: "The request from the director",
        outputLabel: "The reply that went out",
        prompt:
          "From: Sunita Kaur, Director of Operations, Marlow Veterinary Group. Our insurer asked whether we have done the AI Act training. Can you confirm we are compliant? The practice managers use the booking assistant and the nurses use the note-writing tool.",
        output:
          "Sunita, I cannot confirm that we are compliant, and our literacy work is not designed to show that. What I can confirm is this. Article 4 asks us to take measures towards a sufficient level of AI literacy for the people using our AI systems. We have a measure for practice managers using the booking assistant and a measure for nurses using the note-writing tool, each saying what people must be able to do and how we check it. The first reviews of real notes are due in March, and I will send you the record then. Other parts of the Act and data protection law are outside this work, and I suggest we ask our legal adviser how to answer the insurer.",
        reading: [
          "The reply refuses the one thing it cannot honestly say, which is that the group is compliant. It does this in the first sentence, so the director is not left to find it at the end.",
          "It restates the duty in general terms, then describes a measure for each role and system named in the request. That is lessons one, two, and four working together.",
          "It points to the record as evidence still to be prepared, with a date, and it says what the literacy work does not cover. The question about compliance goes to the person qualified to answer it.",
        ],
      },
      practice: {
        intro:
          "Before the assessment, choose the better opening line for a reply to a similar request. The worked example above is still there if you want to compare.",
        check: {
          kind: "choose",
          prompt:
            "A regional director at Pryce Opticians has asked you to confirm that the optometrists are AI Act compliant. Choose the opening line you would send.",
          leftLabel: "Opening A",
          left:
            "Yes, we are compliant, because every optometrist completed the AI module last month.",
          rightLabel: "Opening B",
          right:
            "I cannot confirm compliance, but I can show you the measure we have taken for optometrists using the imaging tool and the evidence we are collecting.",
          correct: "right",
          why: "Opening B declines the claim the Act does not support and offers what you can honestly show, which is the measure for the role and the evidence. Opening A treats a completed module as compliance, which no course can confer.",
          wrong:
            "Look again at Opening A. Completing a module is one measure, and it does not make anyone compliant with the Act. Opening B declines the claim and offers the measure and the evidence.",
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
              "Gareth Lomax is the operations director at Pennine Freight, which has depots in England and a depot in the Netherlands. A training company has sent a proposal saying that EU law requires all 420 staff to complete its six-hour certified AI course. Planners at the Dutch depot use an AI route planning tool, and the office team uses a drafting assistant.",
            question: "What should Gareth take to the board?",
            options: [
              {
                id: "a",
                text: "Approve the course for all 420 staff, because a certificate is the strongest evidence the organisation could hold.",
                feedback:
                  "Article 4 does not require a certificate or a course of any length, and the same six hours for everyone may not suit planners whose route decisions affect drivers. Start from the roles and systems, then judge whether the course is a suitable measure for any of them.",
              },
              {
                id: "b",
                text: "Explain that Article 4 asks for measures suited to each role and context, not a certificate, and list which roles use which systems before judging whether this course is a suitable measure for any of them.",
                correct: true,
                feedback:
                  "This follows the text. Article 4 asks for measures towards a sufficient level of literacy, taking account of role and context, and it names no certificate or hours. Mapping roles to systems first lets the board judge the course as one possible measure.",
              },
              {
                id: "c",
                text: "Tell the board that no action is needed, because Pennine Freight is a UK company.",
                feedback:
                  "The company uses AI systems at a depot in the Netherlands, so whether the Act applies is a real question for its legal advisers, and it should not be dismissed on the basis of where the head office sits. The better move is to describe what Article 4 asks and map the roles.",
              },
            ],
          },
          {
            id: "agency",
            situation:
              "Helen Marsh is the head of operations at Wexford Care Group. Her draft literacy plan covers the 60 employed care coordinators who use an AI rostering assistant. A further 25 coordinators are supplied by an agency, and they use the same assistant every day to roster care visits for the group's clients.",
            question: "What should Helen do about the agency coordinators?",
            options: [
              {
                id: "a",
                text: "Leave them out, because the agency is their employer and is responsible for their training.",
                feedback:
                  "Article 4 refers to staff and to other persons dealing with the operation and use of AI systems on the organisation's behalf. The agency coordinators use Wexford's assistant for Wexford's clients, so leaving them out leaves a gap in the plan.",
              },
              {
                id: "b",
                text: "Give them a shorter awareness video, because they are not permanent staff.",
                feedback:
                  "Their contract does not change what the role involves. They do the same rostering, with the same system, affecting the same clients, so the measure should be based on the role rather than on employment status.",
              },
              {
                id: "c",
                text: "Include them in the measure for care coordinators, because they use the assistant on the group's behalf and do the same work.",
                correct: true,
                feedback:
                  "That follows the provision, which looks at who operates and uses the systems on the organisation's behalf. The measure is for the role, and the agency coordinators hold it. Helen may agree with the agency how the measure is delivered.",
              },
            ],
          },
          {
            id: "claims",
            situation:
              "Imran Shah leads the motor claims team at Rowan Mutual. His 18 handlers use an AI tool that summarises claim files and suggests a settlement band. He has two descriptions of what AI literacy means for the team and must choose one for the plan.",
            question: "Which description should Imran use?",
            options: [
              {
                id: "a",
                text: "Skills: handlers check each summary against the file and set their own band before looking at the suggestion. Knowledge: they know the tool can omit facts and that the suggestion is not a decision. Understanding: they understand that an unfair band harms a claimant and can breach our conduct rules.",
                correct: true,
                feedback:
                  "This covers skills, knowledge, and understanding, and ties each part to the tool, the handlers' work, and the claimants affected. It is the definition applied to one role, which is what a sufficient level depends on.",
              },
              {
                id: "b",
                text: "Handlers should understand how machine learning models are trained and validated, including the statistics behind the settlement band.",
                feedback:
                  "That is technical knowledge the handler role does not need, and it says nothing about checking the summary or the harm to claimants. Literacy for this role is knowing where this tool goes wrong in claims work and what to do about it.",
              },
              {
                id: "c",
                text: "Handlers should feel confident and positive about using AI in claims.",
                feedback:
                  "Confidence is a feeling, and the definition asks for skills, knowledge, and understanding. A confident handler who does not check the summary is the risk the measure should address.",
              },
            ],
          },
          {
            id: "announcement",
            situation:
              "Chloe Barnes is a learning and development partner at Stanmore Bank. She is writing an intranet post to launch AI literacy sessions for the mortgage underwriters, who use an AI tool to summarise applicants' documents. Her manager wants the post to sound decisive.",
            question: "Which sentence should Chloe put in the post?",
            options: [
              {
                id: "a",
                text: "Complete the session to receive your EU AI Act certificate.",
                feedback:
                  "The Act creates no certificate for AI literacy, and the Commission's questions and answers indicate that none is needed. A post that promises one sets up a claim the bank cannot stand behind.",
              },
              {
                id: "b",
                text: "Once every underwriter has attended, the bank will be compliant with the AI Act.",
                feedback:
                  "No session makes an organisation compliant, and Article 4 is one provision among many. This sentence is A claim the Act does not support, however decisive it sounds.",
              },
              {
                id: "c",
                text: "These sessions are mandatory under EU law for every member of staff.",
                feedback:
                  "Article 4 asks for measures suited to role and context, and it does not require a particular session for everyone. The sessions are for underwriters, and the post should say so.",
              },
              {
                id: "d",
                text: "These sessions are one of the measures we are taking so that underwriters can check the summary tool's output against applicants' documents.",
                correct: true,
                feedback:
                  "This is decisive and accurate. It describes the sessions as a measure, names the role, the system, and what underwriters must be able to do, and it makes no claim about certificates or compliance.",
              },
            ],
          },
          {
            id: "procurement-measure",
            situation:
              "Adaeze Okoro is a procurement manager at Hollins County Council. Her draft measure reads: 'Role: procurement officers. System: the AI summary feature in our tendering platform. Context: summarising supplier bids for evaluation panels. People affected: bidding suppliers. Must be able to: check every summary against the bid before it goes to the panel. Measure: a 90-minute session using our own past bids.'",
            question: "What does the measure still need?",
            options: [
              {
                id: "a",
                text: "The people affected, because suppliers are not members of the public.",
                feedback:
                  "The people affected are whoever the system's outputs have an effect on, and bidding suppliers are exactly that. That part is present. The missing part is how anyone will know the measure worked.",
              },
              {
                id: "b",
                text: "How you will know, such as a review by the head of procurement of a sample of summaries against the bids each quarter.",
                correct: true,
                feedback:
                  "That is the missing part. Without it, nobody can tell whether officers now check summaries against the bids, and the record will hold only attendance. A review of a sample of real summaries gives the evidence.",
              },
              {
                id: "c",
                text: "A longer session, because 90 minutes is not enough for a public body.",
                feedback:
                  "Article 4 sets no number of hours, and length is not one of the six parts. The measure already has five parts. What it lacks is a way of knowing whether it worked.",
              },
              {
                id: "d",
                text: "A statement that the council is compliant once the session is held.",
                feedback:
                  "That would be a claim no measure can support. The measure needs a way of knowing whether officers can do what it requires, not a statement of compliance.",
              },
            ],
          },
          {
            id: "record",
            situation:
              "Tom Barrow manages the store support team at Ferris and Gray, a retailer. The quarterly record entry for store managers, who use an AI assistant to draft staff rotas, reads: 'Store managers: all 22 completed the AI e-learning module on 5 May. Completion rate: every manager.' The head of HR has asked whether the entry is good enough.",
            question: "What should Tom add to the entry?",
            options: [
              {
                id: "a",
                text: "A line saying the store managers are now fully AI literate.",
                feedback:
                  "That is a conclusion the entry has no evidence for, so it Claims more than was done. What the entry lacks is evidence of what managers can do with the rota assistant.",
              },
              {
                id: "b",
                text: "The name of the e-learning provider and the module's accreditation number.",
                feedback:
                  "Those details describe the module, not what managers can now do. The entry still shows only attendance. It needs evidence from real rotas and a review date.",
              },
              {
                id: "c",
                text: "Evidence that managers check the assistant's rotas, such as an area manager's review of two rotas per store, and a review date for the measure.",
                correct: true,
                feedback:
                  "That turns an attendance list into a record. A review of real rotas shows whether managers can do what the measure requires, and a review date keeps the entry current when the assistant or the role changes.",
              },
            ],
          },
          {
            id: "board",
            situation:
              "Martin Hale is the managing director of Selby Analytics. The AI literacy plan for the company's three teams is written and the first reviews of real work have taken place. He asks you to add a line to the annual report saying that the company is fully compliant with the EU AI Act.",
            question: "What should you do?",
            options: [
              {
                id: "a",
                text: "Offer a line describing the measures taken for each team and the evidence gathered, say that it is not a statement of compliance, and suggest the wording goes to the company's legal adviser.",
                correct: true,
                feedback:
                  "This gives the managing director something true to publish. You prepared the evidence of the literacy work, and a statement about compliance with the whole Act is a judgement for the company and its advisers, not something a literacy plan can support.",
              },
              {
                id: "b",
                text: "Add the line, because the plan and the reviews are complete.",
                feedback:
                  "The plan and the reviews are evidence of literacy measures. They cannot show compliance with the Act, which has many other provisions, and a published claim is hard to withdraw.",
              },
              {
                id: "c",
                text: "Add the line, but change 'fully compliant' to 'compliant with Article 4'.",
                feedback:
                  "Narrowing the claim does not make it one the evidence can support. The honest line describes the measures and the evidence and leaves the question of compliance to the company's advisers.",
              },
            ],
          },
        ],
        why: "You applied the whole method to situations you had not seen before. You read Article 4 in general terms, tied literacy to role and context, kept claims about certificates and compliance out, found the missing part of a measure, and turned an attendance list into evidence.",
      },
      bridge:
        "You have used every move in the course on new situations. In the last lesson you will write the one-page AI literacy plan for your own area, and that plan is the work your record will show.",
    },
    {
      id: "the-plan",
      title: "The plan",
      emphasis: "plan",
      place:
        "This is the last lesson. You will bring your measures, your record outline, and your statement of limits together on one page, and that page is the work your record will show.",
      sections: [
        {
          heading: "What goes on the page",
          paragraphs: [
            "The AI literacy plan is a one-page document for your own area that sets out the measures you will take and how they will be recorded. It has five parts. The scope says which roles and which AI systems are covered, with the number of people in each role. The measures give one measure for each role, with the six parts from lesson four.",
            "The record says what will be kept for each measure and each person, using the entry from lesson five, and it must include evidence of what people can do, not only attendance. The owner and review part names who owns the plan and when it will be reviewed, or the event that will trigger a review. The last part is a statement of what the plan does not claim.",
          ],
        },
        {
          heading: "The statement of limits",
          paragraphs: [
            "The statement of what the plan does not claim is required. It should say in plain words that the plan sets out measures towards AI literacy, that it does not claim that anyone is compliant with the EU AI Act or any other regulation, and that it does not address obligations other than AI literacy. It is also sensible to say that the plan is not legal advice and has been, or will be, shared with your legal or compliance advisers.",
            "Keep claim words in this part only, and only in the negative. The words 'compliant', 'certified', 'fully meets', and 'guarantees' should not appear anywhere else in the plan as descriptions of what it achieves. If you find one in the scope or a measure, remove it. The plan's job is to describe what you will do and what evidence you will prepare, and nothing more.",
          ],
        },
        {
          heading: "Two labels for the statement of limits",
          paragraphs: [
            "In the practice you will read the lines of a draft statement of limits with two labels. A line States a limit when it says plainly what the plan is not or does not do, such as 'this plan does not claim compliance with the EU AI Act'. A line Makes a claim when it says the plan achieves a legal status or an outcome it cannot show, such as 'with this plan in place, the team meets the Act'.",
            "Claims often creep into the statement of limits itself, usually in the last sentence, where the writer wants to end on something reassuring. Read the statement one line at a time, and if a line says what the plan achieves rather than what it is not, rewrite it.",
          ],
        },
        {
          heading: "How the plan is checked",
          paragraphs: [
            "When you continue, the plan is checked part by part. The scope must name at least one AI system and a concrete fact, such as the number of people or the name of the team. The measures must say what people must be able to do, using words such as 'must be able to'. The record must include evidence or a review, not only attendance. The owner and review part must give a date, a period, or a trigger. The statement of limits must say plainly that the plan does not claim compliance.",
            "Do not put anything confidential into the plan. It will appear on a record that a second person can open, so use role titles and numbers you would be comfortable showing, or realistic examples that keep the same shape. If a part is missing, the note will name it and say what to add. When every part is present, you can sign your name against the plan.",
          ],
        },
      ],
      workedExample: {
        title: "A complete plan for a contact centre",
        inputLabel: "The area the plan covers",
        outputLabel: "The plan",
        prompt:
          "Fiona Adeyemi's contact centre at Brightwater Energy: 32 advisers and 4 team leaders. Advisers use the AI drafting tool in the customer platform to draft replies to customer emails. Team leaders review advisers' work.",
        output:
          "Scope: the customer contact team (32 advisers and 4 team leaders), using the AI drafting tool in our customer platform.\nMeasures: Advisers. System, the drafting tool; context, replies to customer emails about bills and meter readings; people affected, customers, including those in vulnerable circumstances; must be able to check every draft for facts and commitments and escalate anything they cannot support; measure, a 90-minute session with our own examples, then five supervised replies; how we will know, team leaders review five sent replies per adviser each quarter. Team leaders. Must be able to run the review and recognise a pattern of unchecked drafts; measure, a briefing and a shared review sheet; how we will know, the operations manager checks the review sheets each quarter.\nRecord: for each person, the measure, the date, the reviewer, the evidence from the review, and the next review date.\nOwner and review: Fiona Adeyemi, contact centre manager. Review every six months, or when the drafting tool changes.\nWhat this plan does not claim: this plan sets out measures to build AI literacy in this team. It does not claim that the team or Brightwater Energy complies with the EU AI Act or any other regulation, it does not address obligations other than AI literacy, and it is not legal advice.",
        reading: [
          "The scope names the team, the number of people, and the system. Each measure has the six parts, and the team leaders' measure exists because the advisers' measure depends on their reviews.",
          "The record keeps the evidence from the review, not only the session date, so in six months Fiona can see what advisers can actually do. The review has both a period and a trigger.",
          "The statement of limits says what the plan is, what it does not claim, and what it does not cover. No other part of the plan uses a claim word, and nothing on the page says that anyone has become compliant.",
        ],
      },
      practice: {
        intro:
          "Before you write your own plan, read this draft statement of limits from Kingsmere Libraries and mark each line. You will use the same test on your own statement in a moment.",
        check: {
          kind: "mark",
          prompt: "Mark each line of the statement as States a limit or Makes a claim.",
          passLabel: "States a limit",
          failLabel: "Makes a claim",
          sentences: [
            {
              id: "sets-out",
              text: "This plan sets out measures to build AI literacy among library staff who use the catalogue assistant.",
              fail: false,
              why: "This says what the plan is, and nothing more, so it states a limit.",
            },
            {
              id: "not-claim",
              text: "It does not claim that the service complies with the EU AI Act or any other regulation.",
              fail: false,
              why: "This says plainly what the plan does not claim, so it states a limit.",
            },
            {
              id: "meets",
              text: "With these measures in place, the service fully meets its duties under the Act.",
              fail: true,
              why: "This says the plan achieves a legal outcome it cannot show, so it makes a claim, and it undoes the line before it.",
            },
          ],
          why: "That is right. The first two lines say what the plan is and what it does not claim, and the third line reaches for reassurance by claiming the service meets its duties, which the plan cannot show.",
        },
      },
      check: {
        kind: "build",
        prompt:
          "Write the one-page AI literacy plan for your area. Include a measure for each role and a plain statement of what the plan does not claim.",
        fields: [
          {
            id: "scope",
            label: "Scope",
            hint: "The roles, the number of people in each, and the AI systems they use.",
            min: 30,
            rule: "fact",
            any: ["tool", "system", "assistant", "software", "copilot", "platform", "chatbot", "model", "feature"],
            missing:
              "The scope does not yet name an AI system and a concrete fact. Name the AI systems in scope, and give the team or the number of people in each role.",
          },
          {
            id: "measures",
            label: "Measures for each role",
            hint: "For each role: the system, the context, the people affected, what they must be able to do, the measure, and how you will know.",
            min: 120,
            any: ["able to", "can check", "can explain", "can recognise", "can spot"],
            missing:
              "The measures do not yet say what people must be able to do. For each role, add a line that starts 'must be able to' and names something you could see them do on real work.",
          },
          {
            id: "record",
            label: "Record",
            hint: "What will be kept for each measure and each person, including the evidence that people can do what the measure required.",
            min: 40,
            any: ["evidence", "review", "sample", "reviewer", "result", "observed", "checked"],
            missing:
              "Your record shows attendance only. Add the evidence that people can do what the measure required, such as the result of a review of their work.",
          },
          {
            id: "owner",
            label: "Owner and review",
            hint: "Who owns the plan, and the date, period, or event that will trigger a review.",
            min: 20,
            any: [
              "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
              "month", "quarter", "year", "annual", "week", "every ", "when ", "if ", "after ",
              "january", "february", "march", "april", "june", "july", "august", "september", "october", "november", "december",
            ],
            missing:
              "Owner and review has no date or trigger. Name the owner, and give a review date, a period such as every six months, or the event that will trigger a review.",
          },
          {
            id: "limits",
            label: "What this plan does not claim",
            hint: "In plain words, what the plan is not, including that it does not claim compliance with the EU AI Act or any other regulation.",
            min: 40,
            any: ["does not claim", "not a claim", "no claim", "not claim", "does not state", "not a statement", "does not say"],
            missing:
              "State plainly that the plan does not claim compliance with the EU AI Act or any other regulation, for example 'This plan does not claim that the team complies with the EU AI Act or any other regulation.'",
          },
        ],
        why: "Your plan sets out targeted measures for each role, a record that keeps evidence rather than attendance, an owner and a review, and a plain statement of what it does not claim. This is the plan that will appear on your record.",
      },
      bridge:
        "Your plan is ready. Sign your name below, and the record will show this plan, the course, and the date to anyone who opens the reference, as evidence of the work you did and not as a claim of compliance.",
    },
  ],
};
