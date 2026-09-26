/*
Course: Employee Data, Privacy and AI
Slug: employee-data-privacy-and-ai
For: HR professionals, people operations staff, and data protection leads who support HR, who are asked by managers whether information about staff can go into an AI tool. They know which tools their organisation has approved and, in outline, what its data protection policy says. They do not need legal training.
Outcome: The learner can tell whether information about a worker is personal data when no name is given, keep a red-list of people data out of AI tools, anonymise a prompt properly, answer a manager who wants to paste something they should not, and say what happens when something goes in by mistake. A colleague could watch them do each of these on a real request.
Artefact: The team rule for people data and AI: approved tools and purposes, the red-list in two parts, what may go into the approved tool, the answer in three parts, what to do after a mistake, and the owner and review point.
Record sentence: Wrote and signed a team rule that says which people data never goes into an AI tool, how to answer a manager who asks, and what to do when something goes in by mistake.
Lessons (id, title, move, interaction, pass rule):
  1. what-counts, What counts, recognise personal data without a name, mark (Personal data / Not personal data), every item marked correctly.
  2. the-red-list, The red-list, separate red-list data from data that can go in the approved tool, practice build (three red-list lines, each group detected by keywords) and check mark (Red-list / Can go in the approved tool), every item marked correctly.
  3. anonymised-is-harder-than-it-looks, Anonymised is harder than it looks, find every phrase that identifies a person, mark (Remove or generalise / Keep for the question), every phrase marked correctly.
  4. the-answer, The answer, reply to a manager in three parts, practice edit (acknowledge, limit, reason, and route each detected by keywords) and check choose (Reply A / Reply B), the reply with all three parts.
  5. when-it-goes-in-by-mistake, When something goes in by mistake, report a mistake the same day with what the lead needs, practice choose and check edit (what, when, which tool, and that the conversation was not deleted each detected by keywords).
  6. course-assessment, Course assessment, apply the whole method to new situations, scenario of seven questions, six of seven correct.
  7. the-team-rule, Write the team rule, produce the artefact, build, every field meets its keyword or rule (tool purpose, health line, grievance or disciplinary line, an "only" limit, a reason with "because", a same-day report, a review with a date or name).
Sources: The ICO, Guide to the UK GDPR (what is personal data, special category data, criminal offence data). The ICO, guidance on anonymisation and pseudonymisation. The ICO, Guidance on AI and data protection. The ICO, Employment practices and data protection guidance. The ICO, Personal data breaches: a guide. The ICO, guidance on data protection impact assessments. The UK GDPR, Articles 4, 9, 10, and 33, and the Data Protection Act 2018. GOV.UK, An employer's guide to right to work checks.
Tested on phone:          no
Tested returning learner: no
Pass rule tests written:  yes
*/
import type { CourseContent } from "./types.ts";

const PERSONAL = "Personal data";
const NOT_PERSONAL = "Not personal data";
const RED = "Red-list";
const APPROVED = "Can go in the approved tool";
const REMOVE = "Remove or generalise";
const KEEP = "Keep for the question";

export const COURSE: CourseContent = {
  slug: "employee-data-privacy-and-ai",
  hours: 2,
  artefact: {
    lessonId: "the-team-rule",
    title: "The team rule for people data and AI",
    recordLine:
      "Wrote and signed a team rule that says which people data never goes into an AI tool, how to answer a manager who asks, and what to do when something goes in by mistake.",
  },
  lessons: [
    {
      id: "what-counts",
      title: "What counts",
      emphasis: "counts",
      place:
        "This is the first of seven lessons. Before anyone can write a red-list or answer a manager, they need a clear test for what counts as personal data, and that test is broader than most people expect.",
      sections: [
        {
          heading: "Personal data is about a person, with or without a name",
          paragraphs: [
            "Under UK data protection law, personal data is any information relating to an identified or identifiable living person. The definition sits in Article 4 of the UK GDPR, and the ICO's guidance on what personal data is explains it at length. A person is identified when the information names them. A person is identifiable when they can be picked out indirectly, by putting together details such as a job title, a location, a date, and a description of what happened.",
            "In this course, information is Personal data when it relates to a person who is identified, or who could reasonably be identified from it, alone or together with other information that someone is likely to have. Information is Not personal data when it cannot reasonably be linked to any individual. Policy text, a headcount for a large department, and a theme drawn from many survey responses with nothing specific left in it are all examples of information that is not personal data.",
            "The phrase that matters is other information that someone is likely to have. Inside an organisation, colleagues know who works where, who has just joined, who is part time, and who was off last week. A detail that means nothing to a stranger can point straight at one person for anyone who works in the same building.",
          ],
        },
        {
          heading: "What personal data is not",
          paragraphs: [
            "Personal data is not the same as a name. Removing a name does not make information anonymous, and in a small team it often changes nothing. In an office of twelve people, the only part-time analyst is as clear as a name, and so is the new starter in the legal team or the supervisor on the night shift.",
            "Personal data is also not only the sensitive material. A first name on a rota, a staff number on a report, and a note that someone asked for a later start are all personal data. Some personal data is far more harmful than the rest, and the next lesson deals with that, but the first question is always whether the information relates to a person at all.",
            "Replacing names with codes is called pseudonymisation. Staff numbers, candidate references, and initials are common examples. Pseudonymised information is still personal data, because someone in the organisation holds the key that links the code back to the person. The ICO's guidance on anonymisation and pseudonymisation makes this point plainly.",
          ],
        },
        {
          heading: "Why this matters when a manager asks",
          paragraphs: [
            "Most managers who ask whether they can paste something into an AI tool have already taken out the name, and they believe that settles it. If you only check for names, you will agree to prompts that identify a colleague as clearly as if the name were still there, and the information about them will leave your organisation's control.",
            "The test you apply is a practical one. Read the information and ask whether someone in your organisation could work out who it is about. If they could, it is personal data, and everything the rest of this course teaches applies to it. If no reasonable person could link it to anyone, it is not personal data, and you can help the manager without further concern on that point.",
          ],
        },
        {
          heading: "The mistake people usually make",
          paragraphs: [
            "The usual mistake is to treat the absence of a name as the end of the check. The second most common mistake runs the other way, which is to treat every piece of workplace information as personal data. A policy, a job description, or a theme from four hundred survey responses relates to no one, and refusing to let it be used teaches managers that the rules are arbitrary.",
            "Getting both halves right is what makes your answer credible. When you let the policy go through and stop the description of the only payroll specialist, the manager can see that the line follows a reason and is not a reflex.",
          ],
          beforeAfter: {
            before: "Our only payroll specialist in the Bristol office has been off a lot recently.",
            after: "How should a manager structure a supportive conversation about recent short absences?",
            reading:
              "The first sentence has no name, but the office and the role point to one person, so it is personal data about her absence. The second sentence asks the same question without relating to anyone.",
          },
        },
      ],
      workedExample: {
        title: "A message with no name in it",
        inputLabel: "The manager's message",
        outputLabel: "The reply the HR adviser sent",
        prompt:
          "Hi, before I paste this into the assistant, I have taken the name out so it should be fine. 'One of my team in the Bristol office has been off a lot lately. She is our only payroll specialist, and she told me it is to do with a family situation. How should I handle the next conversation?'",
        output:
          "Thank you for checking first. Even without her name, the Bristol office and the only payroll specialist point to one person, so the absence and the family situation are still personal data about her. The question at the end is not about her, and the assistant can help with it on its own: how to structure a supportive conversation about recent absences.",
        reading: [
          "The manager has done what most people do, which is to remove the name and assume the rest is safe. Reading the message against the test, the office and the role together identify one person, because there is only one payroll specialist in Bristol.",
          "Once the person is identifiable, everything said about her is personal data. That includes the absences and the family situation, and the family situation may well relate to her health or to someone else's, which makes it more sensitive still.",
          "The final question, how to handle the next conversation, is not personal data. The adviser separates it from the rest and gives it back to the manager in a form the assistant can answer, so the manager still gets help with the thing they actually wanted.",
        ],
      },
      practice: {
        intro:
          "Here are three pieces of information from HR requests, with the names already removed. Mark each one. For anything you want to call not personal data, ask yourself whether someone in the organisation could work out who it is about. The definitions above are still on the page.",
        check: {
          kind: "mark",
          prompt: "Mark each piece of information as Personal data or Not personal data.",
          passLabel: NOT_PERSONAL,
          failLabel: PERSONAL,
          sentences: [
            {
              id: "handbook",
              text: "Staff may carry over up to five days of annual leave into the next holiday year.",
              fail: false,
              why: "This is a sentence from a staff handbook. It relates to no individual, so it is not personal data.",
            },
            {
              id: "apprentice",
              text: "The apprentice who joined the Derby site in September has asked to change her working pattern.",
              fail: true,
              why: "There is no name, but a single apprentice who joined one site in one month is one person, so this is personal data.",
            },
            {
              id: "initials",
              text: "Candidate JT scored lowest at the second interview.",
              fail: true,
              why: "Initials are a code that the recruiting team can link straight back to the candidate, so this is personal data.",
            },
          ],
          why: "That is right. The handbook sentence relates to no one, while the apprentice and candidate JT can both be identified by people in the organisation, so both are personal data.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "A manager at Castlegate Legal has sent you five pieces of information and asked which are safe to use. None of them contains a name. Mark each one as Personal data or Not personal data.",
        passLabel: NOT_PERSONAL,
        failLabel: PERSONAL,
        sentences: [
          {
            id: "policy",
            text: "Our sickness absence policy triggers a review after five days in a rolling twelve months.",
            fail: false,
            why: "This is a sentence from a policy. It relates to no one, so it is not personal data.",
          },
          {
            id: "legal-team",
            text: "The newest member of the three-person legal team asked for a later start time because of her childcare.",
            fail: true,
            why: "There is no name, but in a team of three the newest member is one person, and the reason is about her private life. This is personal data.",
          },
          {
            id: "survey",
            text: "Across the 400 people who answered the survey, workload was the most common theme.",
            fail: false,
            why: "A theme drawn from four hundred responses cannot reasonably be linked to anyone, so it is not personal data.",
          },
          {
            id: "staff-number",
            text: "Employee 4471 has two live warnings.",
            fail: true,
            why: "Replacing a name with a staff number is pseudonymisation. The HR system links the number straight back to a person, so this is personal data.",
          },
          {
            id: "night-shift",
            text: "The warehouse night shift supervisor was taken to hospital after an accident on Tuesday.",
            fail: true,
            why: "There is likely to be only one night shift supervisor, and the date narrows it further. This is personal data, and it is about their health.",
          },
        ],
        why: "You recognised personal data even without a name. The newest member of a small team, a staff number, and a supervisor on a named shift all point to one person, while the policy and the survey theme relate to no one and can stand as not personal data.",
      },
      bridge:
        "Some personal data does far more harm than the rest if it leaves your control, and the next lesson writes the red-list for it.",
    },
    {
      id: "the-red-list",
      title: "The red-list",
      emphasis: "red-list",
      place:
        "You can now recognise personal data without a name. This second lesson separates the people data that never goes into an AI tool from the data that may go into your organisation's approved tool for an approved purpose.",
      sections: [
        {
          heading: "What the red-list is",
          paragraphs: [
            "A red-list is the list of kinds of people data that never go into an AI tool unless the organisation has set up a specific route for that data and that purpose. A specific route means that someone has assessed the risk, usually through a data protection impact assessment, and the data protection lead has agreed it in writing. Without that route, red-list data stays out, whoever is asking and however good the reason.",
            "In this course, a piece of information is Red-list when it falls into one of the kinds on the list. Information that is not on the red-list Can go in the approved tool, provided three things are true: the tool is one your organisation has approved, the purpose is one it has approved, and only the information the task needs goes in.",
            "Both labels need care. Can go in the approved tool is not a general permission, and a free public chatbot on someone's phone is not the approved tool however convenient it is. Red-list is not a judgement on the manager who asked. It is a statement about the harm the data could do if it were exposed, copied, or kept by a provider you do not control.",
          ],
        },
        {
          heading: "The three groups on the list",
          paragraphs: [
            "The first group is special category data under Article 9 of the UK GDPR. It covers racial or ethnic origin, political opinions, religious or philosophical beliefs, trade union membership, genetic data, biometric data used to identify someone, health, sex life, and sexual orientation. Health is the one HR sees most often, in fit notes, occupational health reports, sickness records, and requests for adjustments.",
            "The second group is criminal offence data under Article 10 of the UK GDPR, which covers information about criminal convictions and offences, including the results of criminal record checks. HR holds it for some roles, and it has its own rules about who may process it and why.",
            "The third group is not special in law, but it causes serious harm in HR if it is exposed. It covers grievance, disciplinary, and investigation files; individual pay, bank details, and National Insurance numbers; identity documents and immigration status; information about children; and anything connected with legal advice or a live tribunal claim. The ICO's employment practices guidance describes why records of this kind need particular care.",
          ],
        },
        {
          heading: "Your organisation's list comes first",
          paragraphs: [
            "The red-list in this course is a starting point, and it does not replace your organisation's own policy. Where your organisation's list is stricter, it wins. Where your organisation has set up an approved route for one kind of data, such as a pay analysis tool that the reward team runs under its own assessment, that route is the way the data is handled, and nobody improvises a second one.",
            "Every line on the list carries a reason. A manager who is told that fit notes are on the list because they are health data, which is special category data, can apply the same reasoning to an occupational health letter the next week without asking you. A list without reasons is a list people argue with.",
          ],
          beforeAfter: {
            before: "Sensitive stuff.",
            after: "Fit notes and occupational health reports, because they are health data, which is special category data under the UK GDPR.",
            reading:
              "The first line leaves every manager to decide what sensitive means. The second names the kind of data and gives the reason, so it can be applied to a document the list never mentioned.",
          },
        },
        {
          heading: "The mistake people usually make",
          paragraphs: [
            "The usual mistake is to decide by the tool rather than the data. People assume that because the tool is approved, anything can go into it. An approved tool lowers some risks, but it does not make it appropriate to put a disciplinary investigation or a fit note into a system that nobody assessed for that purpose.",
            "The opposite mistake is to put ordinary working information on the red-list. First names on a rota, the objectives on a development plan, and an approved job description are personal data or work documents, but they are not red-list. Treating them as if they were makes the list so long that nobody reads it.",
          ],
        },
      ],
      workedExample: {
        title: "Four requests in one week",
        inputLabel: "The four requests",
        outputLabel: "The adviser's decisions",
        prompt:
          "1. A team leader wants to paste the team's job titles and objectives into the approved assistant to draft a development plan template.\n2. A manager wants to paste a staff member's occupational health report into the approved assistant to get a summary.\n3. A department head wants to paste a spreadsheet of individual salaries to ask which roles are paid below the median.\n4. A manager wants to paste the anonymised themes from a team survey to draft a briefing for the team.",
        output:
          "1. Can go in the approved tool, for drafting a template, with only the titles and objectives the template needs.\n2. Red-list. The report is health data. The adviser will go through it with the manager and occupational health.\n3. Red-list. It is individual pay. Pay analysis goes through the reward team's approved route.\n4. Can go in the approved tool. The themes relate to no one, and drafting a briefing is an approved purpose.",
        reading: [
          "The job titles and objectives relate to members of the team, so they are personal data, but they are not on the red-list and a template is an approved purpose. The adviser adds the condition that only what the template needs goes in, which is what the second label requires.",
          "The occupational health report is health data, which is special category data, so it is on the red-list whatever tool is used. The adviser does not stop at the refusal, and offers the route that gets the manager what they need.",
          "The salary spreadsheet is individual pay, which is in the third group. The organisation already has a route for pay analysis, so the adviser sends the request there rather than inventing a new one. The survey themes have nothing specific left in them and can go in the approved tool.",
        ],
      },
      practice: {
        intro:
          "Write the first three lines of your own red-list, one from each group in this lesson. Give each line a kind of data and a reason. The three groups are described in the sections above, and you will return to this list in the last lesson.",
        check: {
          kind: "build",
          prompt: "Write one red-list line for each group, with the kind of data and the reason it is on the list.",
          fields: [
            {
              id: "health",
              label: "A line for health data",
              hint: "For example fit notes, occupational health reports, or sickness records, with the reason.",
              min: 30,
              any: ["health", "fit note", "sickness", "medical", "occupational"],
              missing:
                "The first line does not yet name health data. Name a kind of health information HR holds, such as fit notes or occupational health reports, and say why it is on the list.",
            },
            {
              id: "special",
              label: "A line for another kind of special category or criminal offence data",
              hint: "For example trade union membership, religious belief, ethnic origin, sexual orientation, or criminal record checks.",
              min: 30,
              any: [
                "trade union",
                "religio",
                "belief",
                "ethnic",
                "racial",
                "sexual",
                "sex life",
                "political",
                "biometric",
                "genetic",
                "criminal",
                "conviction",
              ],
              missing:
                "The second line does not yet name another kind of special category or criminal offence data. Choose one, such as trade union membership or criminal record checks, and give the reason.",
            },
            {
              id: "hr",
              label: "A line for HR files, money, or identity",
              hint: "For example grievance or disciplinary files, individual pay, bank details, passports, or a live tribunal claim.",
              min: 30,
              any: [
                "grievance",
                "disciplinary",
                "investigation",
                "pay",
                "salary",
                "salaries",
                "bank",
                "national insurance",
                "passport",
                "identity",
                "immigration",
                "tribunal",
                "legal advice",
                "children",
              ],
              missing:
                "The third line does not yet name an HR file, pay, or identity data. Choose one, such as grievance files or individual pay, and say why it causes harm if exposed.",
            },
          ],
          why: "Your three lines cover all three groups: health, another kind of special category or criminal offence data, and the HR files, money, and identity data that cause harm if exposed.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "Five managers at Harrow Vale Care want to put something into the organisation's approved AI assistant. Mark each item as Red-list or as Can go in the approved tool.",
        passLabel: APPROVED,
        failLabel: RED,
        sentences: [
          {
            id: "job-description",
            text: "The approved job description for a team leader role, to draft interview questions.",
            fail: false,
            why: "A job description is approved text and is not about any person. It can go in the approved tool for drafting.",
          },
          {
            id: "fit-note",
            text: "A team member's fit note from their GP, to help plan adjustments.",
            fail: true,
            why: "A fit note is health data about a named person, which is special category data. It is on the red-list.",
          },
          {
            id: "investigation",
            text: "The notes from a disciplinary investigation meeting, to summarise them.",
            fail: true,
            why: "Disciplinary and investigation files are on the red-list whatever the tool, even an approved one.",
          },
          {
            id: "rota",
            text: "A list of the team's bank holiday cover dates, with first names, to turn into a rota table.",
            fail: false,
            why: "First names and cover dates are personal data, but they are not on the red-list. They can go in the approved tool for a rota, with nothing more than the rota needs.",
          },
          {
            id: "passport",
            text: "A screenshot of an employee's passport, to check the expiry date is read correctly.",
            fail: true,
            why: "A passport is an identity document, so it is on the red-list. Right to work checks are done by a person following the Home Office guidance on GOV.UK.",
          },
        ],
        why: "You kept health, investigation, and identity data on the red-list, and let approved text and routine working information go into the approved tool with only what the task needs.",
      },
      bridge:
        "Often the manager's question can still be answered once the identifying detail has gone, and the next lesson shows how to remove it properly.",
    },
    {
      id: "anonymised-is-harder-than-it-looks",
      title: "Anonymised is harder than it looks",
      emphasis: "Anonymised",
      place:
        "You have a red-list. This third lesson teaches the move that most often lets a manager get help without breaking it, which is to remove everything in a prompt that identifies a person.",
      sections: [
        {
          heading: "What anonymising a prompt means",
          paragraphs: [
            "Anonymising a prompt means changing it so that no one could reasonably work out who it is about, using the information in the prompt together with what people in the organisation are likely to know. When it is done properly, the prompt is no longer personal data, and the question in it can usually be asked of the approved tool.",
            "It almost always takes more than removing the name. You remove or generalise the role when only one or two people hold it. You remove the location, the team size, and the dates when they narrow it down. You remove the distinctive detail of the event and keep only the type of situation the question is about. You also remove any red-list detail, such as a diagnosis, that the question does not need.",
            "The ICO's guidance on anonymisation describes a motivated intruder test, which asks whether a reasonably competent person who wanted to identify someone could do so from the information and other sources available to them. For a prompt about a colleague, the most likely intruder is another colleague, and they already know a great deal.",
          ],
        },
        {
          heading: "The colleague test",
          paragraphs: [
            "The test to apply before a prompt goes anywhere is simple. Think of a colleague in the same organisation reading it over your shoulder, and ask whether they could say that they know who it is about. If they could, the prompt is not anonymous. If the most they could say is that this could be any of a dozen people, it is.",
            "In this lesson you will read a prompt phrase by phrase and give each phrase one of two labels. A phrase is Remove or generalise when it helps identify the person or carries red-list detail the question does not need; you either take it out or replace it with something broader, such as a team member instead of the longest-serving accountant. A phrase is Keep for the question when the question cannot be answered without it and it does not point to anyone.",
          ],
          beforeAfter: {
            before: "Our longest-serving accountant, who is in her sixties, has been diagnosed with arthritis.",
            after: "A team member finds long periods of keyboard work painful.",
            reading:
              "The first version names a role held by one person, an age, and a diagnosis. The second keeps the effect the manager needs help with and drops everything that points to her.",
          },
        },
        {
          heading: "Anonymised is not the same as vague",
          paragraphs: [
            "Anonymising does not mean making the question vague. The aim is to keep everything the question needs and nothing it does not. If a manager wants to know what adjustments might help someone who finds keyboard work painful, the prompt has to say that keyboard work is painful. It does not have to say why, who, where, or since when.",
            "A well anonymised prompt is often a better prompt. Stripping out the story forces the manager to say what they actually want from the answer, and the tool gives more useful help when the question is clear.",
          ],
        },
        {
          heading: "The mistake people usually make",
          paragraphs: [
            "The usual mistake is to remove the name and the obvious identifiers and leave the one detail that gives the person away. A prompt can lose the name, the office, and the date and still say our only Welsh-speaking call handler. Read the finished prompt once more with the colleague test in mind, because the detail that identifies someone is often the one that felt most relevant to the story.",
            "The second mistake is to keep a red-list detail because it seems to explain the situation. A diagnosis, a pregnancy, or a grievance often explains why the manager is asking, but the question rarely needs it. If the question can be answered without it, it goes.",
          ],
        },
      ],
      workedExample: {
        title: "The Bristol prompt, anonymised",
        inputLabel: "The manager's original prompt",
        outputLabel: "The anonymised prompt",
        prompt:
          "One of my team in the Bristol office has been off a lot lately. She is our only payroll specialist, and she told me it is to do with a family situation. How should I handle the next conversation?",
        output:
          "A team member has had several short absences recently and has mentioned a personal situation. I want to have a supportive conversation about attendance without asking for details they have not offered. What structure and questions would help?",
        reading: [
          "The office, the role, and the gender have gone. None of them was needed to answer the question, and together they identified one person. The family situation has become a personal situation, which is enough for the tool to suggest a sensitive approach.",
          "The absences stay, in general form, because the conversation is about attendance and the question cannot be answered without them. A colleague reading the new prompt could not say who it is about.",
          "The question itself is sharper than before. The manager now says what they want from the conversation, which is to be supportive without prying, and the tool can give specific help with that.",
        ],
      },
      practice: {
        intro:
          "Here is a prompt a depot manager was about to run. Read it phrase by phrase and mark each one with the labels from this lesson. The colleague test is described above if you need it.",
        check: {
          kind: "mark",
          prompt: "Mark each phrase of the prompt as Remove or generalise, or as Keep for the question.",
          material: {
            label: "The prompt",
            text: "Our only female forklift driver at the Doncaster depot is going through IVF and needs time off for regular appointments. What should our policy on time off for appointments cover?",
          },
          passLabel: KEEP,
          failLabel: REMOVE,
          sentences: [
            {
              id: "driver",
              text: "Our only female forklift driver",
              fail: true,
              why: "Only one person fits this description, so it identifies her. Remove it or use a team member.",
            },
            {
              id: "depot",
              text: "at the Doncaster depot",
              fail: true,
              why: "The location narrows it to one site and adds nothing the policy question needs. Remove it.",
            },
            {
              id: "ivf",
              text: "is going through IVF",
              fail: true,
              why: "This is health data, which is on the red-list, and the policy question does not need it. Remove it.",
            },
            {
              id: "appointments",
              text: "needs time off for regular appointments",
              fail: false,
              why: "The question is about time off for appointments, so this stays, and on its own it points to no one.",
            },
            {
              id: "question",
              text: "What should our policy on time off for appointments cover?",
              fail: false,
              why: "This is the question the manager needs answered, and it relates to no individual. Keep it.",
            },
          ],
          why: "That is right. The role, the depot, and the treatment identify her or carry health data, while the need for time off and the policy question are what the tool needs to help.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "A manager at Loch Street Housing wants to ask the approved assistant for help. Read the prompt and mark each phrase as Remove or generalise, or as Keep for the question, so that no colleague could work out who it is about.",
        material: {
          label: "The prompt",
          text: "I manage the Glasgow finance team, which has four people. Our longest-serving accountant, who is in her sixties, told me last week that she has been diagnosed with arthritis and is finding the keyboard painful. What adjustments could I offer?",
        },
        passLabel: KEEP,
        failLabel: REMOVE,
        sentences: [
          {
            id: "glasgow",
            text: "I manage the Glasgow finance team",
            fail: true,
            why: "The city and the team together point to one small group. Remove them.",
          },
          {
            id: "four",
            text: "which has four people",
            fail: true,
            why: "A team of four makes every other detail easier to match to one person. Remove it.",
          },
          {
            id: "longest",
            text: "Our longest-serving accountant",
            fail: true,
            why: "The longest-serving accountant in a team of four is one person. Generalise it to a team member.",
          },
          {
            id: "age",
            text: "who is in her sixties",
            fail: true,
            why: "Age is not needed for the question about adjustments, and it helps identify her. Remove it.",
          },
          {
            id: "last-week",
            text: "told me last week",
            fail: true,
            why: "The date helps narrow it down and the question does not need it. Remove it.",
          },
          {
            id: "diagnosis",
            text: "that she has been diagnosed with arthritis",
            fail: true,
            why: "The diagnosis is health data and is not needed to suggest adjustments. Remove the condition and keep its effect.",
          },
          {
            id: "keyboard",
            text: "and is finding the keyboard painful",
            fail: false,
            why: "The tool needs to know what the person finds difficult in order to suggest adjustments, and painful keyboard use on its own points to no one. Keep it.",
          },
          {
            id: "adjustments",
            text: "What adjustments could I offer?",
            fail: false,
            why: "This is the question the manager needs answered. Keep it.",
          },
        ],
        why: "You removed the location, the team size, the role, the age, the date, and the diagnosis, and kept the difficulty and the question. The prompt that remains asks what adjustments help someone who finds keyboard work painful, and no colleague could say who it is about.",
      },
      bridge:
        "Knowing the limit is one thing, and explaining it to a busy manager who wants to paste something is another, which is what the next lesson covers.",
    },
    {
      id: "the-answer",
      title: "The answer",
      emphasis: "answer",
      place:
        "You can apply the red-list and anonymise a prompt. This fourth lesson prepares the answer you give when a manager asks to paste something they should not.",
      sections: [
        {
          heading: "Three parts, in this order",
          paragraphs: [
            "A good answer has three parts. The first acknowledges what the manager is trying to do. Managers who ask usually have a sound aim, such as preparing well for a difficult conversation, getting through a long document before a meeting, or spotting a problem early, and saying so tells them you have understood the request.",
            "The second part states the limit in one sentence and gives the reason. For example: health information about a colleague cannot go into the tool, because it is special category data and we have not set up a safe route for it. One sentence is enough. The reason is what lets the manager apply the rule to the next case on their own.",
            "The third part offers a route that works. That might be removing what identifies the person and asking the general question, going through the document with HR or occupational health, using the organisation's approved route for that data if one exists, or doing that part of the task without a tool. The route is what the manager takes away, so make it specific: who, what, and when.",
          ],
        },
        {
          heading: "What the answer is not",
          paragraphs: [
            "The answer is not a lecture on data protection law. A manager does not need the articles of the UK GDPR, and a long explanation reads as a reason not to ask again.",
            "It is not a flat no either. A flat no protects the data this once, but it teaches the manager to stop asking and start pasting, which is the outcome the red-list exists to prevent. The route in the third part is what keeps them coming back to you.",
            "It is also not a yes with a warning. Once red-list data is in a tool, a warning cannot take it back. If the data is on the red-list, the answer is that it does not go in, and the rest of the reply is about how the manager gets what they need another way.",
          ],
          beforeAfter: {
            before: "No, you cannot do that. It would breach the UK GDPR. Please read the policy.",
            after:
              "It makes sense to want a summary before the meeting. The report cannot go into the assistant, because it is health data and is on our red-list. I can go through it with you on Wednesday morning, and the assistant can give you a general agenda for a return to work meeting.",
            reading:
              "The first reply states a limit and nothing else. The second acknowledges the aim, gives the limit and the reason in one sentence, and offers two routes, one with a named day.",
          },
        },
        {
          heading: "Why the order matters",
          paragraphs: [
            "The acknowledgement comes first because a manager who feels understood reads the limit as help rather than obstruction. If the reply opens with the refusal, the manager has often stopped reading before the route appears.",
            "The route comes last because it is the part the manager acts on. Ending on a specific next step, such as a time to talk or a question the tool can answer, leaves them with something to do rather than something they were told not to do.",
          ],
        },
        {
          heading: "The mistake people usually make",
          paragraphs: [
            "The usual mistake is to write the limit well and leave out the route. Advisers who know the law explain the reason carefully and then stop, and the manager is left with a correct refusal and the same deadline.",
            "The second mistake is to soften the limit until it disappears. A reply that says it is probably best not to paste the grievance letter, but that the manager should use their judgement, has handed the decision back to the person least equipped to make it.",
          ],
        },
      ],
      workedExample: {
        title: "A grievance letter before a meeting",
        inputLabel: "The manager's message",
        outputLabel: "The adviser's reply",
        prompt:
          "Can I paste the grievance letter I received into the AI assistant? I just want a summary so I can prepare for the meeting on Friday.",
        output:
          "It makes sense to want a clear summary before the meeting. Grievance letters cannot go into the assistant, because they are on our red-list and contain detail about the people involved that we have to protect. I can go through the letter with you tomorrow at 10:00, and if it would help, the assistant can give you a general structure for a grievance meeting without any of the letter's details.",
        reading: [
          "The first sentence acknowledges the aim. The manager wants to prepare properly, which is a good thing, and the adviser says so before anything else.",
          "The second sentence states the limit and the reason in one sentence. It names the document, says it cannot go in, and says why, so the manager could apply the same reason to an investigation report next month.",
          "The third sentence offers two routes. One is a named time with the adviser. The other is a general question the assistant can answer safely. The manager can prepare for Friday without the letter going anywhere.",
        ],
      },
      practice: {
        intro:
          "Below is a reply an adviser drafted in a hurry. It states the limit but has none of the other parts. Edit it so that it acknowledges the manager's aim, gives the limit with a reason, and offers a route that works. The three parts are described in the first section above.",
        check: {
          kind: "edit",
          prompt:
            "Farah Idowu, a warehouse shift manager, has asked to paste a colleague's occupational health report into the approved assistant. Edit the draft reply so that it has all three parts of the answer.",
          material: {
            label: "The manager's request",
            text: "Can I paste Dev's occupational health report into the assistant? I want a summary of the adjustments it recommends before our return to work meeting on Monday.",
          },
          label: "The reply you are repairing",
          start:
            "No. Occupational health reports cannot go into the assistant. Please read the data protection policy before you ask again.",
          unchanged:
            "You have not changed the reply yet. Add a sentence that acknowledges what Farah is trying to do, give the reason for the limit, and offer her a route that works.",
          keep: [
            {
              id: "aim",
              any: [
                "makes sense",
                "sensible",
                "good idea",
                "understand",
                "right to want",
                "helpful",
                "good to",
                "prepare",
                "ready for",
                "reasonable",
              ],
              missing:
                "The reply does not yet acknowledge Farah's aim. Start by saying that it makes sense to want to prepare for Monday's meeting.",
            },
            {
              id: "limit",
              any: ["cannot", "can't", "must not", "not go", "does not go", "do not"],
              missing:
                "Keep the limit. The reply should still say plainly that the report cannot go into the assistant.",
            },
            {
              id: "reason",
              any: ["because", "since it", "as it is", "as they are"],
              missing:
                "The limit has no reason yet. Say why, for example because the report is health data and is on the red-list.",
            },
            {
              id: "route",
              any: ["i can", "we can", "hr can", "instead", "together", "go through", "happy to", "ask the"],
              missing:
                "The reply does not yet offer a route that works. Offer something specific, such as going through the report with Farah before Monday.",
            },
          ],
          limits: [],
          limitWording: false,
          why: "Your reply now acknowledges that Farah wants to prepare, states that the report cannot go into the assistant and why, and gives her a way to get the adjustments in front of her before Monday.",
          result: {
            label: "A reply with all three parts",
            text: "It makes sense to want the adjustments clear in your mind before Monday. Occupational health reports cannot go into the assistant, because they are health data and are on our red-list. I can go through Dev's report with you on Friday afternoon, and we can agree which adjustments to discuss.",
          },
        },
      },
      check: {
        kind: "choose",
        prompt:
          "A manager at Pennine Bakeries asks: 'Can I put my team's sickness records into the chatbot to spot patterns?' Choose the reply that follows this lesson.",
        leftLabel: "Reply A",
        left: "Absolutely not. That would be a serious breach of the UK GDPR and could lead to disciplinary action. Please read the data protection policy.",
        rightLabel: "Reply B",
        right:
          "It is a good idea to look for patterns early. Sickness records cannot go into the chatbot, because they are health data and are on our red-list. HR can run the absence report from the HR system for your team, which shows trigger points without anyone's health details, and we can go through it together on Thursday.",
        correct: "right",
        why: "Reply B acknowledges the aim, states the limit and the reason in one sentence, and offers a route that gives the manager what they need, with a day to go through it.",
        wrong:
          "Look again at Reply A. It states the limit, but it does not acknowledge the manager's aim or offer a route that works, and the threat of discipline is more likely to stop them asking than stop them pasting. Reply B has all three parts.",
      },
      bridge:
        "Even with a clear red-list and a good answer, something will one day go into a tool by mistake, and the next lesson covers what happens then.",
    },
    {
      id: "when-it-goes-in-by-mistake",
      title: "When something goes in by mistake",
      emphasis: "mistake",
      place:
        "You can keep red-list data out and answer the manager who asks. This fifth lesson covers the day someone did not ask, and red-list data, or other personal data that should not have gone in, is already in a tool.",
      sections: [
        {
          heading: "Tell the data protection lead the same day",
          paragraphs: [
            "When personal data goes into a tool it should not have gone into, the person who did it, or the person who found out, tells the data protection lead the same day. The data protection lead is the person your organisation has named to handle data protection, and in many organisations that is the data protection officer. Telling them is not an admission of wrongdoing. It is how the organisation learns what happened in time to act.",
            "Under UK data protection law, the organisation has to assess whether the incident is a personal data breach that must be reported. Where it is, Article 33 of the UK GDPR requires it to be reported to the ICO without undue delay and, where feasible, within 72 hours of the organisation becoming aware of it. The ICO's guide to personal data breaches sets this out. The clock runs from when the organisation becomes aware, so a report left until next week uses up time the lead needs.",
          ],
        },
        {
          heading: "What the lead needs to know",
          paragraphs: [
            "A useful report answers three questions. Which tool was it, and was it the approved tool or something else, such as a free public chatbot on a personal phone. What went in, described plainly: the kind of document and, in general terms, whose information it held. When it happened, as closely as you can say, such as today at 14:20.",
            "Those three facts are what the lead uses to decide how serious it is. A staff list pasted into the approved assistant is a different incident from a grievance letter pasted into a public tool with no contract behind it. Without the three facts, the lead has to come back and ask, and the time before any report is due gets shorter.",
          ],
          beforeAfter: {
            before: "I think I may have put something in the chatbot by accident. Probably fine.",
            after:
              "At 14:20 today I pasted a grievance letter from a member of the warehouse team into a free public chatbot on my personal phone, not the approved assistant. I have not deleted the conversation.",
            reading:
              "The first message tells the lead that something happened and nothing else. The second gives the time, the document, and the tool, and says the conversation is still there for the lead to look at.",
          },
        },
        {
          heading: "Do not try to fix it quietly",
          paragraphs: [
            "The instinct after a mistake is to tidy it up: delete the conversation, clear the history, and hope nobody asks. Deleting the conversation on your side does not tell you what the provider has already received or kept, and it removes the record the lead may need to see exactly what went in. Leave the conversation as it is until the lead says otherwise.",
            "Fixing it quietly also takes the decision away from the person whose job it is. Whether the incident must be reported, and whether the people whose data it was need to be told, is for the organisation to decide through the data protection lead. A manager who deletes and says nothing has made that decision alone, without the facts or the authority.",
          ],
        },
        {
          heading: "The mistake people usually make",
          paragraphs: [
            "The usual mistake is to wait. People want to be sure it really was a problem before they raise it, and they spend a day or two deciding. The lead is better placed to judge that, and the report is only useful if it arrives while there is still time to act.",
            "The second mistake is to report it in a way that hides the detail, out of embarrassment. A vague message protects nobody. The team rule you write at the end of this course should make it easy to report a mistake plainly, and a team where people report quickly is safer than one where nobody admits to anything.",
          ],
        },
      ],
      workedExample: {
        title: "A disciplinary letter in the wrong tool",
        inputLabel: "What happened",
        outputLabel: "The message to the data protection lead",
        prompt:
          "Priya Nair is an HR adviser at Weston Fleet Services. At 11:40 on Thursday she pasted a draft disciplinary outcome letter into the approved assistant to tidy the wording, then realised the letter included the employee's name, the allegation, and the sanction. Disciplinary files are on the team's red-list.",
        output:
          "Hello Sam, I need to report a mistake. At 11:40 today I pasted a draft disciplinary outcome letter into the approved assistant to tidy the wording. It included the employee's name, the allegation, and the sanction. I have not deleted the conversation and have not used the output. I am free to talk this afternoon.",
        reading: [
          "Priya writes on the same day, within the hour. She does not wait to work out whether it matters, because that assessment belongs to the data protection lead.",
          "The message gives the three facts the lead needs. The tool was the approved assistant, which the lead will weigh differently from a public tool. What went in was a disciplinary letter with a name, an allegation, and a sanction. It happened at 11:40 today.",
          "She says she has left the conversation in place and not used the output, so the lead can see what went in and nothing has spread further. She ends by offering time to talk, which makes the next step easy.",
        ],
      },
      practice: {
        intro:
          "Two advisers made the same mistake and each wrote to their data protection lead. Choose the message the lead can act on. The three facts the lead needs are listed in the second section above.",
        check: {
          kind: "choose",
          prompt:
            "A list of staff National Insurance numbers was pasted into a public chatbot by mistake. Choose the message that gives the data protection lead what they need.",
          leftLabel: "Message A",
          left: "At 09:15 today I pasted a list of 30 staff names and National Insurance numbers into a free public chatbot in my browser, not the approved assistant, while trying to reformat a table. I have left the conversation open and have not copied anything out of it.",
          rightLabel: "Message B",
          right:
            "Just a heads up that I had a slip with the chatbot this morning. I have cleared my history so it should be sorted, but I wanted you to know in case anyone asks.",
          correct: "left",
          why: "Message A gives the time, what went in, and which tool, and says the conversation is still there. Message B hides the detail and has already deleted the record the lead may need.",
          wrong:
            "Look again at Message B. It does not say what went in or which tool, and clearing the history removes the record the lead may need. Message A gives the three facts and leaves the conversation in place.",
        },
      },
      check: {
        kind: "edit",
        prompt:
          "Callum Price, a stores supervisor at Aldgate Distribution, has made a mistake and drafted a message to the data protection lead. Edit his message so that the lead has what they need. Use the facts in the box.",
        material: {
          label: "What actually happened",
          text: "At 14:20 today Callum pasted a grievance letter from a warehouse operative into a free public chatbot on his personal phone, to get a summary. The approved tool at Aldgate is the Harbour assistant. He has not deleted the conversation yet.",
        },
        label: "The message you are repairing",
        start:
          "Hi Sunita, quick one. I think I might have put something into a chatbot earlier by mistake. I'll delete the conversation so it should be fine, but thought I'd mention it.",
        unchanged:
          "You have not changed Callum's message yet. Add what went in, when it happened, and which tool it was, and say that he will leave the conversation in place.",
        keep: [
          {
            id: "what",
            any: ["grievance"],
            missing:
              "The message does not yet say what went in. Name the document: a grievance letter from a warehouse operative.",
          },
          {
            id: "when",
            any: ["14:20", "2:20", "2.20", "today", "this afternoon"],
            missing: "The message does not yet say when it happened. Give the time, 14:20 today.",
          },
          {
            id: "tool",
            any: ["public", "free", "personal", "phone", "not the approved", "not harbour", "not the harbour"],
            missing:
              "The message does not yet say which tool it was. Say that it was a free public chatbot on his personal phone, not the Harbour assistant.",
          },
          {
            id: "not-deleted",
            any: [
              "not delete",
              "not deleted",
              "won't delete",
              "haven't deleted",
              "left the conversation",
              "leave the conversation",
              "kept the conversation",
              "keep the conversation",
              "still there",
              "still open",
            ],
            missing:
              "The message still plans to delete the conversation. Say instead that he has not deleted it and will leave it in place until Sunita says otherwise.",
          },
        ],
        limits: [],
        limitWording: false,
        why: "Callum's message now gives Sunita the time, the document, and the tool, and it leaves the conversation in place, so she can judge how serious it is and whether it must be reported.",
        result: {
          label: "The message Sunita receives",
          text: "Hi Sunita, I need to report a mistake. At 14:20 today I pasted a grievance letter from a warehouse operative into a free public chatbot on my personal phone, not the Harbour assistant, to get a summary. I have not deleted the conversation and will leave it in place until you tell me otherwise.",
        },
      },
      bridge:
        "You have now used every move in the course. The next lesson brings them together and assesses them on situations you have not yet seen.",
    },
    {
      id: "course-assessment",
      title: "Course assessment",
      emphasis: "assessment",
      place:
        "This is the sixth of seven lessons. It brings together the method from the first five lessons, works one mixed example, and then assesses the whole method on situations you have not seen, before the final lesson asks you to write your team rule.",
      sections: [
        {
          heading: "What counts, and what goes on the red-list",
          paragraphs: [
            "Personal data is any information relating to a living person who is identified or who could reasonably be identified, alone or with other information someone is likely to have. A name is not the test. A role held by one person, a small team, a location, and a date can identify someone as clearly as a name, and a staff number or a set of initials is pseudonymised data, which is still personal data. Policy text, approved job descriptions, and themes drawn from many responses relate to no one.",
            "The red-list is the kinds of people data that never go into an AI tool without a specific approved route. It has three groups: special category data such as health and trade union membership; criminal offence data; and the HR files, money, and identity data that cause harm if exposed, such as grievance and disciplinary files, individual pay, bank details, and passports. Anything else Can go in the approved tool when the tool is approved, the purpose is approved, and only what the task needs goes in. A public chatbot that your organisation has not approved is not the approved tool.",
          ],
        },
        {
          heading: "Anonymising, answering, and reporting",
          paragraphs: [
            "Anonymising a prompt means changing it until a colleague reading it could not say who it is about. Remove or generalise the role, the location, the team size, the dates, and any red-list detail the question does not need, and keep everything the question cannot be answered without. A well anonymised prompt is often clearer than the original.",
            "The answer to a manager has three parts in order: acknowledge the aim, state the limit and the reason in one sentence, and offer a route that works. It is not a lecture, a flat no, or a yes with a warning. When something goes in by mistake, tell the data protection lead the same day with which tool, what went in, and when, and leave the conversation in place. The organisation decides whether it must be reported to the ICO, and where it must, that report is due within 72 hours of the organisation becoming aware where feasible.",
            "The assessment at the end of this lesson sets seven situations you have not seen, in hospitality, recruitment, retail, a contact centre, reward, a charity, and manufacturing. Each question has one right answer, and each draws on one or more of the moves above. You need six of the seven to pass, and after you submit, each question shows the feedback for the option you chose.",
          ],
        },
        {
          heading: "Working through a request in order",
          paragraphs: [
            "When a request arrives, take the moves in the order the course taught them. First ask whether the information is personal data. If it is, ask whether any of it is on the red-list. If it is, ask whether the question can be answered once the identifying and red-list detail has gone. Then write the answer, and make the route the anonymised question if there is one.",
            "This order matters because each step can end the problem early. A request that turns out not to involve personal data needs no further thought on that point, and a red-list request that anonymises cleanly still gives the manager the help they wanted.",
          ],
        },
      ],
      workedExample: {
        title: "One request, taken in order",
        inputLabel: "The manager's request",
        outputLabel: "The adviser's reply",
        prompt:
          "From Jamal, shift manager at Kestrel Foods, Wakefield: 'Can I paste this into the assistant to get advice? My only Polish-speaking line operator, Marta, has told me she is struggling with anxiety since her disciplinary hearing last month and wants to reduce her hours.'",
        output:
          "It makes sense to get advice before you talk to Marta. What you have written cannot go into the assistant, because it names her and includes her health and a disciplinary matter, which are both on our red-list. You can ask the assistant this instead: 'A team member has asked to reduce their hours for health reasons. What should a manager cover in the first conversation?' I can also talk it through with you tomorrow morning.",
        reading: [
          "The request is personal data. It names Marta, and even without the name, the only Polish-speaking line operator identifies her.",
          "Two pieces are on the red-list: the anxiety, which is health data, and the disciplinary hearing, which is an HR file. The question about reducing hours can be answered without either, and without her name, language, or role.",
          "The reply follows the three parts. It acknowledges that Jamal wants advice, states the limit and the reason in one sentence, and offers two routes: an anonymised question he can paste as it stands, and a time to talk.",
        ],
      },
      practice: {
        intro:
          "Before the assessment, choose the anonymised version of a prompt from a hotel manager. The colleague test and the parts to remove are summarised in the sections above.",
        check: {
          kind: "choose",
          prompt:
            "The original prompt read: 'Our head receptionist at the York hotel, who is a practising Muslim, has asked for a quiet room to pray during her shifts. How should I respond?' Choose the version that no colleague could trace back to her.",
          leftLabel: "Prompt A",
          left: "A team member has asked for a quiet space during their shifts for religious observance. What should a manager consider in responding, and what options are usually available?",
          rightLabel: "Prompt B",
          right:
            "Our head receptionist at one of our Yorkshire hotels has asked for a quiet room to pray during her shifts. How should I respond?",
          correct: "left",
          why: "Prompt A removes the role, the location, and the specific belief, and keeps the request and the question. Prompt B still names a role held by one person, which identifies her, and the prayer request reveals her religion.",
          wrong:
            "Look again at Prompt B. The head receptionist is one person, and a Yorkshire hotel barely narrows it, so a colleague could still say who it is about. Prompt A keeps the question and removes what identifies her.",
        },
      },
      check: {
        kind: "scenario",
        prompt:
          "Read each situation and choose what you would do. Each question has one right answer, and you need six of the seven to pass.",
        passMark: 6,
        questions: [
          {
            id: "hospitality",
            situation:
              "Grace Holloway is the HR business partner for Fenwick Hotels, which has eleven hotels. A general manager sends her a prompt he wants to run: 'The head chef at our Harrogate hotel has been late four times this month and says it is because of problems at home. How do I raise it?' He points out that there is no name in it.",
            question: "What should Grace tell him about the prompt?",
            options: [
              {
                id: "a",
                text: "It is fine to run, because it contains no name.",
                feedback:
                  "A name is not the test. Fenwick has one head chef at Harrogate, so the prompt identifies him, and the lateness and problems at home are personal data about him. The question about raising lateness can be asked without the rest.",
              },
              {
                id: "b",
                text: "It is personal data, because the role and the hotel identify one person, and he should ask how to raise repeated lateness without them.",
                correct: true,
                feedback:
                  "That is the test the course teaches. The head chef at one named hotel is one person, so everything said about him is personal data. The manager can still get help by asking the general question about lateness.",
              },
              {
                id: "c",
                text: "It is fine once he changes Harrogate to one of our hotels.",
                feedback:
                  "That helps, but head chef is still a senior role that people can match to a small number of names, and problems at home is detail the question does not need. Remove the role and the home situation as well, and ask the general question.",
              },
            ],
          },
          {
            id: "recruitment",
            situation:
              "Owen Clarke is a recruitment coordinator at Brightwater Utilities. Ahead of a union recognition meeting, a manager asks him to paste the list of staff who have joined the union, with their teams, into the approved assistant to draft an invitation letter. The organisation has no specific route for this data.",
            question: "What should Owen do?",
            options: [
              {
                id: "a",
                text: "Paste the list, because the assistant is the approved tool and drafting a letter is an approved purpose.",
                feedback:
                  "The approved tool does not change what the data is. Trade union membership is special category data, and without a specific approved route it stays out. The letter can be drafted without the list.",
              },
              {
                id: "b",
                text: "Paste the list after removing the names, keeping only the teams.",
                feedback:
                  "In small teams, a team and a union meeting can still point to individuals, and the letter does not need the list at all. Keep the membership data out and draft the letter from the meeting details.",
              },
              {
                id: "c",
                text: "Paste the list into a public chatbot instead, so it does not stay in the organisation's systems.",
                feedback:
                  "A public tool the organisation has not approved is a worse place for this data, not a better one. Trade union membership is on the red-list, and the letter can be drafted without it.",
              },
              {
                id: "d",
                text: "Keep the list out, because trade union membership is special category data, and ask the assistant for a general invitation letter using only the meeting date and place.",
                correct: true,
                feedback:
                  "That is right. Trade union membership is on the red-list whatever the tool, and the letter needs only the meeting details. The manager still gets a draft, and the list goes nowhere.",
              },
            ],
          },
          {
            id: "retail",
            situation:
              "Nadia Sharif manages a Hollins Home store. She wants to turn next month's shift pattern, with first names and dates, into a rota table. The approved assistant is on her work laptop, but it is quicker to use a free chatbot on her own phone.",
            question: "What is the right approach?",
            options: [
              {
                id: "a",
                text: "Use the approved assistant on the work laptop, with only the first names and dates the rota needs.",
                correct: true,
                feedback:
                  "That is right. First names and shift dates are personal data but not red-list, so they can go in the approved tool for a rota, with nothing more than the rota needs. A free chatbot on a personal phone is not the approved tool.",
              },
              {
                id: "b",
                text: "Use the free chatbot, because first names and dates are not on the red-list.",
                feedback:
                  "Not being on the red-list lets data go into the approved tool, not any tool. A free chatbot on a personal phone has not been approved, so use the assistant on the work laptop.",
              },
              {
                id: "c",
                text: "Do not use any tool, because first names are personal data.",
                feedback:
                  "First names are personal data, but they are not on the red-list, and a rota is a routine approved purpose. Refusing makes the rule look arbitrary. Use the approved assistant with only what the rota needs.",
              },
            ],
          },
          {
            id: "contact-centre",
            situation:
              "Liam Hughes leads a team at the Brecon Mutual contact centre in Cardiff. His draft prompt reads: 'Our only Welsh-speaking call handler told me on Monday she is pregnant and is finding eight-hour shifts hard. What changes to her shifts could I consider?'",
            question: "Which version should Liam run?",
            options: [
              {
                id: "a",
                text: "'A call handler told me on Monday she is pregnant and is finding eight-hour shifts hard. What changes to her shifts could I consider?'",
                feedback:
                  "This removes the language, but it keeps the pregnancy, which is health data, and the date and the gender narrow it down. The question can be asked without them.",
              },
              {
                id: "b",
                text: "'Our only Welsh-speaking call handler is finding long shifts hard. What could I consider?'",
                feedback:
                  "This keeps the one detail that identifies her, the only Welsh-speaking call handler, and it loses the eight-hour shifts the question needs. Remove the identifier and keep the difficulty.",
              },
              {
                id: "c",
                text: "'A team member is finding eight-hour shifts hard for health reasons. What changes to shift patterns could a manager consider?'",
                correct: true,
                feedback:
                  "That is right. The language, the pregnancy, the date, and the gender have gone, and the difficulty with eight-hour shifts stays because the question needs it. No colleague could say who this is about.",
              },
            ],
          },
          {
            id: "reward",
            situation:
              "Ellie Morgan is a reward analyst at Carrow Insurance. A director wants to know which roles are paid below the market median and suggests pasting the salary spreadsheet into the approved assistant with names replaced by staff numbers. Carrow's reward team has its own approved pay analysis tool.",
            question: "What should Ellie say?",
            options: [
              {
                id: "a",
                text: "That is fine, because staff numbers make the spreadsheet anonymous.",
                feedback:
                  "Staff numbers are pseudonymisation, and the HR system links them straight back to people, so the spreadsheet is still personal data. Individual pay is on the red-list, and the reward team's tool is the route for it.",
              },
              {
                id: "b",
                text: "Staff numbers can be traced back to people, so it is still personal data, and individual pay is on the red-list, so the analysis should go through the reward team's approved tool.",
                correct: true,
                feedback:
                  "That is right. Replacing names with codes does not make data anonymous, and individual pay stays on the red-list. The organisation already has a route for pay analysis, so Ellie uses it rather than inventing another.",
              },
              {
                id: "c",
                text: "It is fine if the director removes the job titles as well as the names.",
                feedback:
                  "The staff numbers still link every row to a person, and the analysis needs the job titles anyway. Individual pay is on the red-list, and the reward team's approved tool is the route for it.",
              },
              {
                id: "d",
                text: "Round every salary to the nearest thousand first, so the figures are no longer exact.",
                feedback:
                  "Rounding does not stop the staff numbers pointing to people, and the pay is still individual pay. Send the analysis through the reward team's approved tool.",
              },
            ],
          },
          {
            id: "charity",
            situation:
              "Ruth Adeyemi is the people adviser at Lark Rise Trust, a charity. A manager emails: 'I have 40 pages of exit interview notes from people who left my team this year. Can I paste them into the assistant and ask for the main themes?' The notes include names and several comments about named colleagues.",
            question: "Which reply should Ruth send?",
            options: [
              {
                id: "a",
                text: "'Yes, but be careful what you paste and delete it afterwards.'",
                feedback:
                  "This is a yes with a warning. Once named comments about colleagues are in the tool, a warning cannot take them back, and deleting afterwards does not undo it. The reply needs a limit, a reason, and a route.",
              },
              {
                id: "b",
                text: "'No. Exit interviews contain personal data and cannot be used. Please read the data protection policy.'",
                feedback:
                  "This states a limit, but it gives the manager no route to the themes they want and no acknowledgement of a sensible aim. It teaches them to stop asking. The reply that offers a route is stronger.",
              },
              {
                id: "c",
                text: "'Exit interviews are covered by UK GDPR Article 6 and Article 9, and the ICO has guidance on employment records, which I have attached for you to read.'",
                feedback:
                  "This is a lecture. The manager needs to know what to do, not which articles apply. A reply that acknowledges the aim, states the limit in one sentence, and offers a route gives them that.",
              },
              {
                id: "d",
                text: "'It is a good idea to look for themes. The notes cannot go in as they are, because they name people who left and colleagues who are still here. I can draw out the themes with you on Tuesday, and then the assistant can help you write them up.'",
                correct: true,
                feedback:
                  "That is right. The reply acknowledges the aim, states the limit and the reason in one sentence, and offers a route with a named day. The manager still gets the themes, and the named comments go nowhere.",
              },
            ],
          },
          {
            id: "manufacturing",
            situation:
              "Ben Carter is a production manager at Selwood Components. At 16:45 on Friday he realises that an hour earlier he pasted a disciplinary outcome letter, with the employee's name and sanction, into a free public chatbot. The data protection lead, Hannah Webb, is in the office until 17:30.",
            question: "What should Ben do?",
            options: [
              {
                id: "a",
                text: "Delete the conversation now, then tell Hannah on Monday once he is sure it was a problem.",
                feedback:
                  "Deleting the conversation removes the record Hannah may need, and it does not tell anyone what the provider already received. Waiting until Monday uses up time before any report to the ICO is due. Tell her today.",
              },
              {
                id: "b",
                text: "Tell his own manager and let them decide whether Hannah needs to know.",
                feedback:
                  "His manager is not the person who assesses a breach. The data protection lead is, and she needs to hear today. Ben should tell Hannah directly with the tool, what went in, and when.",
              },
              {
                id: "c",
                text: "Tell Hannah before she leaves today, saying it was a free public chatbot, a disciplinary outcome letter with a name and sanction, at about 15:45, and leave the conversation in place.",
                correct: true,
                feedback:
                  "That is right. Ben reports the same day, gives the three facts the lead needs, and leaves the conversation for her to see. Whether it must be reported, and within the 72 hours, is now in the hands of the person whose job it is.",
              },
            ],
          },
        ],
        why: "You applied the whole method to situations you had not seen. You recognised personal data without a name, kept red-list data out even of the approved tool, anonymised a prompt without losing the question, chose the answer with all three parts, and reported a mistake the same day with what the lead needs.",
      },
      bridge:
        "You have used every move in the course on new situations. In the last lesson you will write the team rule for the people you support, and that rule is the work your record will show.",
    },
    {
      id: "the-team-rule",
      title: "Write the team rule",
      emphasis: "rule",
      place:
        "This is the last lesson. You will write the one-page team rule for the managers and staff you support, and that rule is the work your record will show.",
      sections: [
        {
          heading: "What the team rule is",
          paragraphs: [
            "The team rule is one page for the managers and staff you support. It names the AI tool or tools your organisation has approved and what they may be used for. It sets out the red-list with a reason on each line. It says what may go into the approved tool, and reminds people to put in only what the task needs. It gives the answer from lesson four in a short form a manager can follow on their own. It says what to do if something goes in by mistake, and it names who owns the rule and when it will be reviewed.",
            "The test for the rule is whether a manager could follow it without calling you. If a line would leave them asking what you meant, such as sensitive data or be careful, it needs another sentence. If a line names the kind of data and the reason, they can apply it to a document the rule never mentioned.",
          ],
        },
        {
          heading: "What the team rule is not",
          paragraphs: [
            "The team rule is not a data protection policy, and it does not replace one. It is the practical rule that sits under your organisation's policy, in words a busy manager will read. Where the policy says more, or says something stricter, the policy wins, and the rule should say so.",
            "It is also not a statement that your organisation complies with data protection law. Do not write that following the rule makes the team compliant, and do not include anyone's personal details. Use role titles such as the head of HR or the data protection lead rather than names, and leave out email addresses and telephone numbers, because the rule will appear on a record that a second person can open.",
          ],
        },
        {
          heading: "How the rule is checked",
          paragraphs: [
            "When you continue, each part is checked in turn. Approved tools and purposes has to name at least one purpose, such as drafting or summarising. The red-list comes in two parts: the first has to include a line on health data, and the second has to include a line on grievance, disciplinary, or investigation information. Between the two parts, aim for at least six lines, each with a kind of data and a reason.",
            "What may go into the approved tool has to say that only what the task needs goes in. The answer has to give a reason with the word because, alongside the acknowledgement and the route. If something goes in by mistake has to say that the report happens the same day or immediately. Owner and review has to say when the rule will be reviewed, with a month or a date, and it can add a trigger such as a new tool being approved. If a part is missing, the note names it and says what to add.",
          ],
        },
      ],
      workedExample: {
        title: "A team rule for a retail HR team",
        inputLabel: "The request from the head of HR",
        outputLabel: "A complete team rule",
        prompt:
          "Store managers keep asking what they can put into the approved assistant. Please write one page they can follow without calling us, covering the red-list, how we answer, and what to do if something goes in by mistake.",
        output:
          "Approved tools and purposes: the Harbour assistant on work devices, for drafting and summarising work documents. No other AI tool is approved for staff information.\nThe red-list, health and special category data: fit notes and occupational health reports, because they are health data; sickness records, because they reveal health; trade union membership, because it is special category data; criminal record check results, because they are criminal offence data.\nThe red-list, HR files, money, and identity: grievance, disciplinary, and investigation files, because they hold allegations about named people; individual pay and bank details, because they cause direct harm if exposed; passports and right to work documents, because those checks follow the Home Office process; anything about a live tribunal claim, because it must go through our solicitors.\nWhat may go into the approved tool: job descriptions, policies, templates, rotas with first names, and anonymised themes. Put in only what the task needs.\nThe answer, in three parts: say what the manager is trying to do, say what cannot go in and why in one sentence, because a reason lets them apply it next time, and offer HR, occupational health, or an anonymised question instead.\nIf something goes in by mistake: tell the data protection lead the same day, saying which tool, what went in, and when. Do not delete the conversation.\nOwner and review: owned by the head of HR, reviewed every six months, next in March 2027, or sooner when a new tool is approved.",
        reading: [
          "The first part names one approved tool and two purposes, and says that no other tool is approved, which closes the gap a manager with a phone would otherwise fill.",
          "The red-list has eight lines across its two parts, and every line gives the kind of data and the reason. A store manager who meets an occupational health letter or an investigation note can find the line and the reason without asking.",
          "The answer and the mistake sections are short enough to follow in the moment, and the review has a month and a trigger, so the rule does not quietly go out of date when a new tool arrives.",
        ],
      },
      practice: {
        intro:
          "Before you write your own rule, read these lines from a colleague's draft and mark each one. A line is Ready to follow when a manager could act on it without calling you. Mark it A manager would have to ask when they would need to come back to you to find out what it means.",
        check: {
          kind: "mark",
          prompt: "Mark each line of this draft rule as Ready to follow or as A manager would have to ask.",
          passLabel: "Ready to follow",
          failLabel: "A manager would have to ask",
          sentences: [
            {
              id: "sensitive",
              text: "The red-list: anything sensitive.",
              fail: true,
              why: "Sensitive is not defined, so every manager would draw the line in a different place. Name each kind of data and give the reason.",
            },
            {
              id: "fit-notes",
              text: "Fit notes and occupational health reports stay out of every AI tool, because they are health data.",
              fail: false,
              why: "The line names the documents and gives the reason, so a manager could act on it without asking.",
            },
            {
              id: "careful",
              text: "If something goes in by mistake: be more careful next time.",
              fail: true,
              why: "This says nothing about who to tell, when, or what to say. A manager would have to ask what to do.",
            },
            {
              id: "only",
              text: "What may go into the approved tool: policies, templates, and anonymised themes, and only what the task needs.",
              fail: false,
              why: "The line names what may go in and sets the limit, so it is ready to follow.",
            },
          ],
          why: "That is right. The fit note line and the approved tool line can be followed as they stand, but anything sensitive and be more careful next time would leave a manager asking what you meant.",
        },
      },
      check: {
        kind: "build",
        prompt:
          "Write the team rule for the people you support. A manager should be able to follow it without calling you. Use role titles rather than names, and leave out email addresses and telephone numbers.",
        fields: [
          {
            id: "tools",
            label: "Approved tools and purposes",
            hint: "Name the approved tool or tools and what they may be used for, such as drafting or summarising.",
            min: 30,
            any: ["draft", "summar", "template", "rota", "rewrit", "letter", "purpose", "wording", "notes", "reformat"],
            missing:
              "Approved tools and purposes does not yet name a purpose. Name the tool your organisation has approved and say what it may be used for, such as drafting or summarising work documents.",
          },
          {
            id: "redlist-special",
            label: "The red-list: health and other special category data",
            hint: "One line per kind of data, each with a reason. Include health data and at least one other kind of special category or criminal offence data.",
            min: 80,
            any: ["health", "fit note", "occupational", "sickness", "medical"],
            missing:
              "The first part of the red-list does not yet include health data. Add a line such as 'Fit notes and occupational health reports, because they are health data', along with at least one other kind of special category data.",
          },
          {
            id: "redlist-hr",
            label: "The red-list: HR files, money, and identity",
            hint: "One line per kind of data, each with a reason. Include grievance, disciplinary, or investigation information.",
            min: 80,
            any: ["grievance", "disciplinary", "investigation"],
            missing:
              "The second part of the red-list does not yet include grievance, disciplinary, or investigation information. Add a line for it with the reason, along with lines for pay or identity documents.",
          },
          {
            id: "may-go-in",
            label: "What may go into the approved tool",
            hint: "Name what may go in, and remind people to include only what the task needs.",
            min: 30,
            rule: "limit",
            missing:
              "What may go into the approved tool does not yet set a limit. Add a sentence such as 'Put in only what the task needs', because a permission without that limit invites people to paste whole files.",
          },
          {
            id: "answer",
            label: "The answer, in three parts",
            hint: "Acknowledge the aim, state the limit with a reason, and offer a route that works.",
            min: 60,
            any: ["because"],
            missing:
              "The answer does not yet give a reason for the limit. Write the three parts, and make sure the limit carries a reason, for example 'because it is health data and is on our red-list'.",
          },
          {
            id: "mistake",
            label: "If something goes in by mistake",
            hint: "Who is told, how soon, and what they need: which tool, what went in, and when.",
            min: 50,
            any: ["same day", "immediately", "straight away", "at once", "within the hour", "that day", "without delay"],
            missing:
              "If something goes in by mistake does not yet say how soon to report it. Say that the data protection lead is told the same day, with which tool, what went in, and when.",
          },
          {
            id: "owner",
            label: "Owner and review",
            hint: "The role that owns the rule, and when it will be reviewed, with a month or a date.",
            min: 20,
            any: ["review"],
            rule: "fact",
            missing:
              "Owner and review does not yet give a review point. Name the role that owns the rule and say when it will be reviewed, for example 'reviewed in March 2027, or when a new tool is approved'.",
          },
        ],
        why: "Your team rule has every part. It names the approved tool and its purposes, sets out a red-list with health and HR files on it, limits what may go in to what the task needs, gives the answer with a reason, says a mistake is reported the same day, and names an owner and a review point.",
      },
      bridge:
        "Your team rule is ready. Sign your name below, and the record will show this rule, the course, and the date to anyone who opens the reference.",
    },
  ],
};
