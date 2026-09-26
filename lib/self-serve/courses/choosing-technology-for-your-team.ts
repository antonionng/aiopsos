/*
Course: Choosing Technology for Your Team
Slug: choosing-technology-for-your-team
For: Team leaders and managers who have been asked to choose a tool for their team, or to recommend one to the person who holds the budget. They can describe a normal week of their team's work and have at least one option in mind. No technical background is assumed.
Outcome: The learner can write the job a tool must do as a piece of the team's real work, put the same five questions to every option including changing nothing, test an option on three real cases, count the switching cost in both directions, and write a one-page choice record a colleague could read a year later.
Artefact: The choice record, in six parts: the job, the options considered, the five questions, the trial on our work, the switching cost, and the decision and review date.
Record sentence: Wrote and signed a one-page choice record that weighs every option, including changing nothing, against the team's own work and names the date the choice will be reviewed.
Lessons (id, title, move, interaction, pass rule):
  1. start-with-the-job, Start with the job, tell work from features, practice build / check mark ("Describes the job", "Names a feature"), every sentence marked correctly.
  2. five-questions-for-every-option, Five questions for every option, tell an answer from an open question, practice mark / check mark ("Answers a question", "Leaves it open"), every sentence marked correctly.
  3. test-it-on-your-own-work, Test it on your own work, judge a trial, practice choose / check choose, the note built on real cases including an awkward one.
  4. the-switching-cost, The switching cost, separate switching cost from licence cost, practice build / check mark ("Switching cost", "Licence cost"), moving in and moving out each named in the practice; every line marked correctly in the check.
  5. repair-a-choice-record, Repair a choice record, repair a record in place, practice edit / check edit, the record keeps the options and adds changing nothing, a trial, a switching cost line, the weakness accepted, and a review.
  6. judge-a-choice-in-practice, Judge a choice in practice, course assessment, practice choose / check scenario of eight questions, six of eight correct.
  7. your-choice-record, Write your choice record, the artefact, practice mark ("Ready for a reader", "A reader would have to ask") / check build, every field meets its rule or word list.
Sources: GOV.UK Technology Code of Practice; GOV.UK Service Manual guidance on understanding users and their needs; National Cyber Security Centre cloud security principles; National Cyber Security Centre supply chain security guidance.
Tested on phone:          no
Tested returning learner: no
Pass rule tests written:  yes
*/
import type { CourseContent } from "./types.ts";

const JOB = "Describes the job";
const FEATURE = "Names a feature";
const ANSWERS = "Answers a question";
const OPEN = "Leaves it open";
const SWITCHING = "Switching cost";
const LICENCE = "Licence cost";
const READY = "Ready for a reader";
const ASK = "A reader would have to ask";

export const COURSE: CourseContent = {
  slug: "choosing-technology-for-your-team",
  hours: 2,
  artefact: {
    lessonId: "your-choice-record",
    title: "The choice record",
    recordLine:
      "Wrote and signed a one-page choice record that weighs every option, including changing nothing, against the team's own work and names the date the choice will be reviewed.",
  },
  lessons: [
    {
      id: "start-with-the-job",
      title: "Start with the job",
      emphasis: "job",
      place:
        "This is the first of seven lessons. Before you look at any product, you write down the work the tool has to carry, and every later lesson measures the options against what you write here.",
      sections: [
        {
          heading: "What a job statement is",
          paragraphs: [
            "A job statement describes the work a tool must carry. It says who does the work, what comes in, what goes out, how often it happens, and what goes wrong with it at the moment. It is written in the language of your team's week: the fault report, the Monday stock order, the client who rings to ask where their quote is.",
            "You write it before you look at a single product page. That order matters, because a product page is written to make its own features feel like your needs. If you read three vendor sites first, your list of requirements will quietly turn into a list of what those three vendors happen to sell, and you will have lost the one thing that lets you judge between them.",
            "A good job statement is short. Three to five sentences are usually enough. The test is whether a colleague from another team could read it and tell you what your people spend their time on, and where that time is being wasted.",
          ],
        },
        {
          heading: "What a job statement is not",
          paragraphs: [
            "A job statement is not a list of requirements such as 'must have a mobile app', 'must use AI' or 'must have dashboards'. Each of those is a feature, which is a capability a product has. A feature is worth paying for only when it serves the job, and you cannot tell whether it does until the job is written down.",
            "It is also not a complaint. Frustration belongs in it, but only when it is turned into a description of the work that fails. 'The current system is rubbish' tells a reader nothing. 'Faults reported in the corridor are often forgotten, and staff chase by email a week later' tells them exactly where to look.",
          ],
          beforeAfter: {
            before: "We need a booking system with online payments, a mobile app and automated reminders.",
            after:
              "Two receptionists book about sixty client appointments a week, mostly by phone. Clients who miss an appointment are not chased, and the slot is lost. Payment is taken at the desk, and the till and the diary are reconciled by hand every Friday.",
            reading:
              "The first version is three features. The second says who does the work, how much of it there is, and two things that go wrong. Reminders might help with missed appointments, but now you can ask whether they do.",
          },
        },
        {
          heading: "Two labels for every sentence",
          paragraphs: [
            "In this course you will read draft requirements one sentence at a time and give each sentence one of two labels. A sentence that Describes the job says who does the work, how they do it now, how often it happens, or what goes wrong. It would still be true if no product existed.",
            "A sentence that Names a feature states a capability a tool should have, without saying what work it would serve. It is not wrong to have such a sentence in your notes, but it cannot be the basis of a choice. When you meet one, ask what job the feature is supposed to do, and write that job instead.",
          ],
        },
        {
          heading: "Why this matters, and the usual mistake",
          paragraphs: [
            "The job statement is the standard every option is measured against. Without it, the comparison becomes a contest of features, and the tool with the longest list wins. Teams then find, six months later, that the one thing they needed, such as seeing a colleague's open cases when they are off sick, is awkward in the tool they bought.",
            "The usual mistake is to start from the tool someone has already seen. A director saw a demonstration at a conference, or a colleague used a product at their last employer, and the job statement is written backwards from it. You can still consider that tool. Write the job first, and then see whether it does the job.",
          ],
        },
      ],
      workedExample: {
        title: "A facilities manager rewrites a request",
        inputLabel: "The first draft",
        outputLabel: "The job statement",
        prompt:
          "We need a helpdesk tool with a mobile app, AI triage and good dashboards. Nadia Brooks, Facilities Manager, Thornbury College.",
        output:
          "Staff in our three buildings report faults such as broken lights and heating problems, about forty a week, by email or by stopping a caretaker in the corridor. Our two caretakers need to see every open fault, who reported it and where it is, and staff need to know that it has been logged. At the moment, faults reported in the corridor are often forgotten, and staff chase by email a week later.",
        reading: [
          "The first draft contains three features and no work. It tells a vendor what to demonstrate, but it gives Nadia nothing to judge the demonstration against.",
          "The rewrite names the people involved, the staff and the two caretakers, and the volume, about forty faults a week. It says what each group needs to see, which is the part a tool will either do well or badly.",
          "The last sentence is the most useful one. Forgotten corridor reports are the failure that costs the college time and goodwill, so any option now has to show how it deals with a fault that starts as a conversation. A mobile app might help, and Nadia can now ask whether it does rather than assume so.",
        ],
      },
      practice: {
        intro:
          "Write the job for a tool your own team needs, in three short parts. The worked example above shows each part, and the two labels are defined in the section before it. Keep to the work, and leave features out.",
        check: {
          kind: "build",
          prompt: "Write three parts of the job statement for a tool your team needs.",
          fields: [
            {
              id: "who",
              label: "Who does the work",
              hint: "The people or roles involved, for example the two receptionists or the account managers.",
              min: 8,
              rule: "role",
              missing:
                "Who does the work is still too thin. Name the people or roles who do this work, for example the two caretakers or the six account managers.",
            },
            {
              id: "often",
              label: "How often it happens",
              hint: "How many times a day, a week or a month the work comes round.",
              min: 6,
              any: ["day", "week", "month", "hour", "daily", "weekly", "monthly", "each", "every", "per"],
              missing:
                "How often it happens does not yet give a frequency. Say how many times a day, a week or a month the work comes round.",
            },
            {
              id: "wrong",
              label: "What goes wrong at the moment",
              hint: "One failure in the work as it is done now, described as work rather than as a feeling.",
              min: 20,
              any: [
                "forgot",
                "forgotten",
                "lost",
                "miss",
                "chase",
                "late",
                "wait",
                "twice",
                "wrong",
                "nobody",
                "no one",
                "cannot",
                "can't",
                "delay",
                "error",
                "mistake",
                "duplicate",
                "by hand",
              ],
              missing:
                "What goes wrong at the moment does not yet describe a failure in the work. Say what is forgotten, lost, delayed, done twice or done by hand, and who notices.",
            },
          ],
          why: "Your statement names the people, how often the work comes round, and what fails at the moment. That is enough to judge any option against, and it contains no features.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "Owen Price, a sales manager at Calder Print, wrote these four sentences about the tool he wants. Mark each sentence with the label it deserves.",
        passLabel: JOB,
        failLabel: FEATURE,
        sentences: [
          {
            id: "spreadsheets",
            text: "Our six account managers each keep their own list of prospects in a spreadsheet.",
            fail: false,
            why: "No product capability is named here. The sentence says who does the work and where the work lives now, so it describes the job.",
          },
          {
            id: "linkedin",
            text: "It must integrate with LinkedIn.",
            fail: true,
            why: "An integration is a capability, and the sentence does not say what work it would serve, so it names a feature. Ask what job the integration would do.",
          },
          {
            id: "sick",
            text: "When someone is off sick, nobody else can see which prospects are due a call.",
            fail: false,
            why: "This is a failure in the work as it is done now, which is exactly what a job statement needs, so it describes the job.",
          },
          {
            id: "dashboard",
            text: "It needs a modern dashboard.",
            fail: true,
            why: "A dashboard is a feature, and 'modern' says nothing about the work, so this sentence names a feature.",
          },
        ],
        why: "That is the right reading. The spreadsheets and the missed calls during sickness describe the job, and the LinkedIn integration and the dashboard are features that have not yet been tied to any work.",
      },
      bridge:
        "With the job written down, the next lesson gives you five questions to put to every option against it, including the option of changing nothing.",
    },
    {
      id: "five-questions-for-every-option",
      title: "Five questions for every option",
      emphasis: "questions",
      place:
        "You now have a job statement. This lesson gives you one set of five questions to put to every option, so that each is judged on the same terms against that job.",
      sections: [
        {
          heading: "The five questions",
          paragraphs: [
            "The first question is whether the option does the job in the way your team does it, or whether you would have to change the work to fit the tool. Sometimes changing the work is right, but it should be a decision, not a surprise. The second question is who will run it day to day, including adding and removing people, fixing settings and answering colleagues' questions, and whether that person has the time.",
            "The third question is where your information goes, who can see it, and whether you can get all of it back out in a form another tool could read. The fourth is what the option needs to connect to, such as your email, calendar or finance system, and whether that connection already exists or has to be built. The fifth is what it will cost over three years, counting people's time as well as the licence.",
            "The National Cyber Security Centre publishes cloud security principles that set out the questions to ask a provider about where data is held and how it is protected. They are worth reading before you put the third question to any online service.",
          ],
        },
        {
          heading: "What the questions are not",
          paragraphs: [
            "The five questions are not a scoring sheet. When you give each answer points and add them up, a tool that is excellent on four questions and fails the third can still come top, even though being unable to get your data out should stop the choice on its own. Read the answers side by side and look for the one that rules an option out.",
            "They are also not only for new tools. Changing nothing is an option, and it has answers too. The spreadsheet you use today has a person who runs it, a place where the data lives, and a cost in people's time every week. Putting the same questions to the current way of working is what makes the comparison fair.",
          ],
        },
        {
          heading: "Two labels for what you read",
          paragraphs: [
            "Most of what you read about an option comes from vendor documents, sales emails and colleagues' summaries. For each sentence, ask whether it answers one of the five questions with something you could check. A sentence that Answers a question names a person, a format, a system, a price or a limit that you could confirm or test.",
            "A sentence that Leaves it open sounds relevant but gives you nothing to check. 'Trusted by leading organisations', 'really intuitive' and 'integrates with hundreds of apps' all leave the questions open, because none of them tells you whether the tool connects to your calendar or who on your team will look after it.",
          ],
          beforeAfter: {
            before: "The platform offers flexible data options.",
            after: "All records, including attachments, can be exported as CSV and PDF files from the admin settings at any time.",
            reading:
              "The first sentence leaves the third question open, because 'flexible' could mean anything. The second answers it with a format and a place you could test during a trial.",
          },
        },
        {
          heading: "Why this matters, and the usual mistake",
          paragraphs: [
            "A fair comparison needs the same questions put to every option. When one tool is judged on its demonstration and another on a colleague's opinion, the comparison says more about who presented than about the tools.",
            "The usual mistake is to accept a confident document as an answer. Vendor copy is written to sound complete. When you mark each sentence, you usually find that only one or two of the five questions have been answered, and the rest have to be asked directly, in writing, before a choice is made.",
          ],
        },
      ],
      workedExample: {
        title: "Reading a vendor's reply",
        inputLabel: "The vendor's reply",
        outputLabel: "Nadia's reading",
        prompt:
          "Our platform is trusted by leading organisations. Data is hosted in the UK on Microsoft Azure. Admins can add users in seconds. Pricing is per user per month. We integrate with hundreds of apps.",
        output:
          "Trusted by leading organisations: leaves it open. Hosted in the UK on Microsoft Azure: answers the third question in part, because it says where data is held, but not how to get it out. Admins can add users in seconds: leaves the second question open, because it does not say who our administrator would be. Pricing per user per month: leaves the fifth question open until we have a figure and count our own time. Hundreds of apps: leaves the fourth question open, because it does not say whether it connects to the college's email.",
        reading: [
          "Nadia read the reply one sentence at a time and asked which of the five questions each sentence answered with something she could check.",
          "Only the hosting sentence answers anything, and even that answer is partial. It says where the data sits, but the third question also asks how the college would get its records back.",
          "The reply is confident, and it answers very little. Nadia now has four questions to send back in writing, and she can put the same questions to the college's current routine of email and corridor conversations.",
        ],
      },
      practice: {
        intro:
          "Here are three sentences from a supplier's email about a room booking tool. Mark each one with the labels defined above. The five questions are listed in the first section if you need them.",
        check: {
          kind: "mark",
          prompt: "Mark each sentence as Answers a question or as Leaves it open.",
          passLabel: ANSWERS,
          failLabel: OPEN,
          sentences: [
            {
              id: "outlook",
              text: "Bookings appear in each person's Outlook calendar through the Microsoft 365 connector, which your IT team switches on once.",
              fail: false,
              why: "This names the system it connects to and who switches the connection on, so it answers the fourth question.",
            },
            {
              id: "loved",
              text: "Our customers love how easy it is.",
              fail: true,
              why: "Being loved by other customers is an impression, and it answers none of the five questions, so it leaves them open.",
            },
            {
              id: "price",
              text: "The licence is £4 per room per month, with no charge for users.",
              fail: false,
              why: "This gives a price you could check against a quote, so it answers part of the fifth question.",
            },
          ],
          why: "That is right. The connector and the price give you something to check, and the sentence about customers loving it leaves every question open.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "These four sentences come from a colleague's summary of a scheduling tool for a clinic. Mark each sentence with the label it deserves.",
        passLabel: ANSWERS,
        failLabel: OPEN,
        sentences: [
          {
            id: "export",
            text: "Everything can be exported as a CSV file from the settings page, including past bookings.",
            fail: false,
            why: "This says how to get all the data out and in what form, so it is a checkable answer to the third question.",
          },
          {
            id: "intuitive",
            text: "It's really intuitive.",
            fail: true,
            why: "Intuitive is an impression rather than an answer, so it leaves all five questions open.",
          },
          {
            id: "joe",
            text: "Joe in operations will add and remove staff, which he estimates at an hour a month.",
            fail: false,
            why: "This names the person who will run the tool and how much of his time it takes, which answers the second question.",
          },
          {
            id: "calendars",
            text: "It connects to lots of calendars.",
            fail: true,
            why: "'Lots of calendars' does not tell you whether it connects to the one your team uses, so the fourth question is still open.",
          },
        ],
        why: "That is a careful reading. The export and Joe's hour a month can both be checked, while 'intuitive' and 'lots of calendars' sound helpful and leave the questions open.",
      },
      bridge:
        "Some of the five questions, above all the first, can only be answered by trying the tool, and the next lesson shows you how to try it on your own work rather than on a demonstration.",
    },
    {
      id: "test-it-on-your-own-work",
      title: "Test it on your own work",
      emphasis: "work",
      place:
        "This lesson turns the first of the five questions into a small trial you can run in an afternoon, using real cases from last week.",
      sections: [
        {
          heading: "A demonstration is the vendor's best case",
          paragraphs: [
            "A vendor demonstration shows the tool doing the vendor's best case. The data is clean, the presenter has done it many times, and the examples were chosen because they work well. None of that is dishonest, but it tells you how the tool behaves on someone else's work, not on yours.",
            "A demonstration is useful for learning what the tool can do and where things are. It cannot answer whether the tool does your job in the way your team does it, because your job was not in the room.",
          ],
        },
        {
          heading: "A trial on your own work",
          paragraphs: [
            "A trial on your own work means taking three real cases from last week and asking the person who normally does the job to put them through the tool themselves, using a free trial or a sandbox account. Two of the cases can be typical. The third should be an awkward case: the exception, the split, the one that needed a phone call or a workaround.",
            "The awkward case matters most. A tool that handles the typical case well can make the exception much harder than it is today, and exceptions are where teams lose time and where mistakes reach customers. If the tool cannot handle the awkward case, you want to know before the contract is signed, not after.",
            "Write down what happened to each case in one sentence. Say who did it, how long it took, and whether the result was right. That note is the evidence you will put in the choice record.",
          ],
          beforeAfter: {
            before: "We watched the demo and it looked very quick.",
            after:
              "Priya booked three of last week's appointments in the trial: a routine check-up in two minutes, a follow-up in one, and a joint appointment with two advisers, which the tool could only book as two separate slots.",
            reading:
              "The first line records an impression of someone else's work. The second names the person, three real cases, the time taken, and the awkward case that the tool did not handle.",
          },
        },
        {
          heading: "What a trial is not",
          paragraphs: [
            "A trial is not a pilot. A pilot is a longer period in which part of the team uses the tool for real work, and it usually needs approval, set-up and support. A trial takes an afternoon, uses a handful of cases, and needs nothing beyond the vendor's trial terms. It comes first, because it tells you whether a pilot is worth running.",
            "It is also not a test of whether you like the tool. Your opinion of the screens is less useful than the result for each case. Take care not to put personal or confidential information into a trial account unless the trial terms and your own organisation's rules allow it. Where they do not, use a real case with the names changed, and keep the shape of the case the same.",
          ],
        },
        {
          heading: "Why this matters, and the usual mistake",
          paragraphs: [
            "The trial is the only part of the comparison that uses your own work as evidence. It turns the first question from an opinion into a finding, and it often produces a new question for the vendor that nobody would have thought to ask.",
            "The usual mistake is to have the manager run the trial. The manager does not do the job every day, so they miss the step that slows the real user down. Ask the person who does the work to do the trial, and sit beside them if you can.",
          ],
        },
      ],
      workedExample: {
        title: "Nadia's trial of the helpdesk tool",
        inputLabel: "The three cases",
        outputLabel: "The trial note",
        prompt:
          "1. A broken light in the library, reported by email. 2. A heating fault in the science block, reported to a caretaker in the corridor. 3. A leak in the sports hall roof that turned out to be the landlord's responsibility.",
        output:
          "Caretaker Mark Hughes put all three through the fourteen-day trial on Tuesday. The email report was logged automatically. The corridor report took Mark three minutes on the phone app, standing in the corridor. The landlord's leak could not be closed without assigning it to one of our own caretakers, so it would either sit open for good or be recorded falsely.",
        reading: [
          "Nadia chose two typical cases and one awkward one. The landlord's leak is the kind of fault that happens a few times a year and always needs a workaround.",
          "The trial was run by Mark, who does the job, and the note says what happened to each case in a sentence. The corridor report, the failure named in the job statement, took three minutes and worked.",
          "The awkward case found a problem the demonstration never showed. Nadia now has a written question for the vendor, and the answer will go into the choice record whatever it is.",
        ],
      },
      practice: {
        intro:
          "Before you judge a trial note, choose a fair set of cases. A payroll officer is about to try a timesheet tool. The section above says what a fair set contains.",
        check: {
          kind: "choose",
          prompt: "Choose the set of three cases that makes a fair trial of the timesheet tool.",
          leftLabel: "Set A",
          left: "Three of last week's timesheets: a normal full-time week, a part-time week, and a week in which Leah Cole worked a night shift that crossed midnight into Saturday.",
          rightLabel: "Set B",
          right: "The three sample timesheets that came with the trial account, which the vendor says cover most situations.",
          correct: "left",
          why: "Set A uses real cases from last week and includes an awkward one, the shift that crosses midnight into the weekend, which is exactly where a timesheet tool is likely to struggle.",
          wrong:
            "Set B uses the vendor's own samples, which were chosen to work well. Look again at Set A, which uses last week's real timesheets and includes the awkward night shift that crosses midnight.",
        },
      },
      check: {
        kind: "choose",
        prompt:
          "Two team members at Meridian Surveys tested the same expenses tool. Choose the trial note you would rely on when you write the choice record.",
        leftLabel: "Note A",
        left: "We watched the vendor's demonstration and it handled receipts, mileage and approvals smoothly. It looked much faster than our spreadsheet, and the team liked it.",
        rightLabel: "Note B",
        right:
          "Sam Ellis put three of last week's claims through the free trial: a taxi receipt, a mileage claim, and a hotel bill split between two projects. The first two took under a minute each. The split bill could only be charged to one project, so Sam had to enter it twice.",
        correct: "right",
        why: "Note B uses real cases, the person who does the job, and an awkward case, and it records what happened to each. The split bill is the finding that matters, and Note A could never have found it.",
        wrong:
          "Note A describes the vendor's demonstration, not your own work. It has no awkward case, so it cannot tell you where the tool makes the job harder. Look again at Note B and the split hotel bill.",
      },
      bridge:
        "Once an option passes the trial, the next lesson asks what it would cost to move your work into it and, one day, to move it out again.",
    },
    {
      id: "the-switching-cost",
      title: "The switching cost",
      emphasis: "switching",
      place:
        "You can now judge an option against the job and on your own work. This lesson adds the cost that is most often left off the comparison.",
      sections: [
        {
          heading: "Moving in and moving out",
          paragraphs: [
            "The switching cost is everything it takes to move the work from where it is now into the new tool, and everything it would take to move it out again. Moving in includes moving existing records, setting the tool up, teaching people, running the old and new ways side by side for a while, and the slower weeks while people learn.",
            "Moving out includes getting your data back in a form another tool can read, the notice period in the contract, and paying the learning cost again for whatever comes next. You may never leave, but the cost of leaving is part of what you are agreeing to on the day you sign, so it belongs in the comparison.",
          ],
        },
        {
          heading: "What the switching cost is not",
          paragraphs: [
            "The switching cost is not the licence price. The licence price is usually the easiest number to find, and it is often the smallest part of the total. A tool that is cheaper per user can cost more overall if every record has to be re-entered by hand, or if the contract ties you in for three years.",
            "In this course, each line in a comparison is one of two kinds. A line that is a Licence cost states what you pay the vendor for the right to use the tool, including a free tier. A line that is a Switching cost states the time, effort or money it takes to move in or to move out. A comparison that contains only licence cost lines is not finished.",
          ],
          beforeAfter: {
            before: "Option B: £25 per user per month, six users, £1,800 a year.",
            after:
              "Option B: £25 per user per month, six users, £1,800 a year. Moving in: six prospect spreadsheets to clean and import, about two days of one account manager's time. Moving out: contacts export as CSV, but call notes cannot be exported.",
            reading:
              "The first version is correct and incomplete. The second keeps the licence line and adds one switching cost line in each direction, and the call notes that cannot be exported become the most important line on the page.",
          },
        },
        {
          heading: "Counting people's time",
          paragraphs: [
            "Most of the switching cost is people's time, and it is easy to leave out because nobody sends an invoice for it. Estimate it in hours or days for a named role: two days of the office manager's time to import the client list, one hour for each of eight staff to learn the new routine, two weeks in which both the old and new rotas are kept.",
            "The estimate does not need to be precise. It needs to be written down, so that the reader can see it and challenge it. An estimate of 'about two days' that turns out to be three is far more useful than a blank space that turns out to be three weeks.",
          ],
        },
        {
          heading: "Why this matters, and the usual mistake",
          paragraphs: [
            "The UK government's Technology Code of Practice, published on GOV.UK, asks public bodies to avoid being locked in to a single supplier. The same care makes sense for a small team, because the records you build up in a tool over several years are often worth more than the tool itself.",
            "The usual mistake is to count moving in and forget moving out. Moving in is visible, because it happens in the first month. Moving out feels distant, and it is exactly the part that decides whether you are free to choose again later.",
          ],
        },
      ],
      workedExample: {
        title: "Owen completes a comparison line",
        inputLabel: "The comparison line",
        outputLabel: "The completed line",
        prompt: "Option B: £25 per user per month, six users, £1,800 a year.",
        output:
          "Licence cost: £25 per user per month, six users, £1,800 a year. Moving in: six spreadsheets of prospects to be cleaned and imported, about two days of one account manager's time. Set-up: fields and stages configured by Owen, about one day. Teaching: one hour for each account manager. Side by side: two weeks in which the spreadsheets stay open as a back-up. Moving out: the contract is annual with ninety days' notice, and contacts export as CSV, but call notes do not.",
        reading: [
          "Owen kept the licence line exactly as it was, because it was correct. He labelled it, so a reader can see it is only one kind of cost.",
          "The moving-in lines are mostly people's time, written as days and hours for named roles. They add roughly four working days that the licence line did not show.",
          "The moving-out line holds the most important finding. Call notes are what the team will build up over years, and if they cannot be exported, leaving Option B would mean losing them. That goes to the vendor as a question before any choice is made.",
        ],
      },
      practice: {
        intro:
          "Write two switching cost lines for an option you are considering, one for moving in and one for moving out. The section on counting people's time shows how to estimate them.",
        check: {
          kind: "build",
          prompt: "Write one switching cost line for moving in and one for moving out.",
          fields: [
            {
              id: "in",
              label: "Moving in",
              hint: "What has to be moved, set up or taught, and roughly how long it takes for which role.",
              min: 20,
              any: [
                "import",
                "move",
                "moving",
                "set up",
                "set-up",
                "setup",
                "teach",
                "train",
                "learn",
                "side by side",
                "re-enter",
                "clean",
                "migrat",
                "transfer",
                "copy",
              ],
              missing:
                "Moving in does not yet say what has to be done. Name what must be moved, set up or taught, and roughly how long it will take.",
            },
            {
              id: "out",
              label: "Moving out",
              hint: "How you would get your data back, in what form, and what the contract says about leaving.",
              min: 20,
              any: ["export", "notice", "leave", "leaving", "cancel", "contract", "download", "get our", "get the data", "exit", "tie", "renew"],
              missing:
                "Moving out does not yet say what leaving would take. Say how the data comes back out, in what form, and what notice the contract requires.",
            },
          ],
          why: "Both lines are switching cost. One says what it takes to move in, the other what it takes to move out, and neither is a licence price.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "These four lines come from a comparison of two project tools for a design studio. Mark each line with the label it deserves.",
        passLabel: SWITCHING,
        failLabel: LICENCE,
        sentences: [
          {
            id: "price",
            text: "Tool X costs £8 per user per month on the annual plan.",
            fail: true,
            why: "This line is only the price per user, so it is a licence cost. Switching cost is the time and effort of moving in or out.",
          },
          {
            id: "reenter",
            text: "Our 140 open projects would need to be re-entered by hand, as there is no import from our current tool.",
            fail: false,
            why: "Re-entering existing work is part of the cost of moving in, so this is a switching cost.",
          },
          {
            id: "attachments",
            text: "Attachments can only be downloaded one at a time if we leave.",
            fail: false,
            why: "This is a cost of moving out, which the lesson counts as switching cost.",
          },
          {
            id: "free",
            text: "Tool Y is free for up to ten users.",
            fail: true,
            why: "A free tier is still a statement about the licence price, so it is a licence cost. It says nothing about moving in or out.",
          },
        ],
        why: "That is right. The two prices, including the free tier, are licence costs, and re-entering 140 projects and downloading attachments one by one are the switching costs that the prices hide.",
      },
      bridge:
        "You now have the job, the five answers, a trial and the switching cost. The next lesson shows how they fit on one page by repairing a weak choice record.",
    },
    {
      id: "repair-a-choice-record",
      title: "Repair a choice record",
      emphasis: "Repair",
      place:
        "This lesson prepares you for the final one. You practise the shape of the choice record on someone else's work before you write your own.",
      sections: [
        {
          heading: "The six parts of a choice record",
          paragraphs: [
            "A choice record is a single page with six parts. The first is the job statement. The second is the options considered, which always include changing nothing. The third is the answers to the five questions for each option, with 'Not yet known' written where there is no answer. The fourth is the result of the trial on your own work. The fifth is the switching cost in both directions. The sixth is the decision, with the thing the chosen option does worse and a named review date.",
            "It is written for someone who was not in the room: your successor, an auditor, a new finance director, or you in a year's time when the renewal notice arrives. Each part should make sense to that reader without a conversation.",
          ],
        },
        {
          heading: "What a choice record is not",
          paragraphs: [
            "A choice record is not a sales case for the winning tool. A record that lists only the strengths of the chosen option reads as advocacy, and a careful reader will not trust it. Say plainly what the chosen option does worse than the others, and what the team will do about it.",
            "It is also not the minutes of the meeting. The reader does not need to know who said what. They need to know what was weighed, what was found, and what was accepted.",
          ],
        },
        {
          heading: "The two parts most often missing",
          paragraphs: [
            "The first part most often missing is changing nothing. When it is left out, the record implies that doing nothing was never possible, and the reader cannot tell whether the new tool is actually better than the current routine. Write one sentence on what changing nothing would cost, usually in people's time each week.",
            "The second is the review date. Without it, the choice is never revisited, and the tool renews year after year whether or not it still does the job. Pick a date with a reason, such as the point at which the contract can still be cancelled with notice.",
          ],
          beforeAfter: {
            before: "Decision: Tool B, because it was the best fit.",
            after:
              "Decision: Tool B over Tool A and over keeping the spreadsheets. Tool B handled the split-project claim in the trial and Tool A did not. Its weakness is that receipts cannot be bulk-exported, so we will download the receipt archive each quarter. We will review this choice on 1 March, when the annual contract can still be cancelled with notice.",
            reading:
              "The first version gives a feeling. The second names every option including changing nothing, the evidence, the weakness accepted, what the team will do about it, and the review date.",
          },
        },
        {
          heading: "Repair in place",
          paragraphs: [
            "When you inherit a weak record, repair it rather than starting again. Keep the parts that are already doing their job, such as a clear job statement or a true licence price, and add the parts that are missing, one at a time.",
            "Read the record once as the reader a year from now would. At each part, ask whether they could understand it without asking you. Where they would have to ask, add the sentence that answers them.",
          ],
        },
      ],
      workedExample: {
        title: "Repairing the expenses record at Meridian Surveys",
        inputLabel: "The weak record",
        outputLabel: "The repaired decision",
        prompt: "We chose Tool B because it was the best fit and the team liked the demo.",
        output:
          "We chose Tool B over Tool A and over keeping the expenses spreadsheet. Changing nothing costs the finance assistant about three hours a week rekeying claims. In the trial, Sam Ellis put three real claims through each tool, and only Tool B handled the hotel bill split between two projects. Tool B's weakness is that receipts cannot be bulk-exported, so we will download the receipt archive each quarter. We will review the choice on 1 March, when the annual contract can still be cancelled with ninety days' notice.",
        reading: [
          "The weak record gave a feeling and a demonstration. Neither would help a reader who has to decide whether to renew.",
          "The repair names all three options, including changing nothing and its cost in the finance assistant's time. It gives the trial result on a real awkward case, which is the reason Tool B won.",
          "It admits the weakness, says what the team will do about it, and names a review date with a reason. A reader a year from now can check each of those claims.",
        ],
      },
      practice: {
        intro:
          "This record from Calder Print is complete except for one thing: it does not consider changing nothing. Add that option, with one sentence on what it would cost. The section above on the parts most often missing describes what to write.",
        check: {
          kind: "edit",
          label: "The choice record you are repairing",
          prompt: "Edit the options so that the record also considers changing nothing, and say what that would cost.",
          start:
            "Job: staff book the four meeting rooms by writing in the front desk diary, and double bookings happen about twice a week. Options: RoomDesk and Outlook room calendars. Trial: three of last week's bookings went through both, and only RoomDesk showed the clash. Decision: RoomDesk. Review on 1 June.",
          unchanged:
            "You have not changed the record yet. Add changing nothing to the options, and say what it would cost.",
          keep: [
            {
              id: "roomdesk",
              any: ["RoomDesk"],
              missing: "Keep the options that were already there. The record should still name RoomDesk.",
            },
          ],
          limits: [
            {
              id: "nothing",
              any: ["changing nothing", "change nothing", "do nothing", "doing nothing", "keep", "stay with", "current", "as it is", "as now", "no change"],
              missing:
                "The options still do not include changing nothing. Add it, for example 'keeping the front desk diary', and say what it costs.",
            },
          ],
          limitWording: false,
          why: "The record now weighs the new options against the current routine, so a reader can see that RoomDesk was chosen over doing nothing as well as over the other tool.",
        },
      },
      check: {
        kind: "edit",
        label: "The choice record you are repairing",
        prompt:
          "This record from Fold Street Kitchens chose a rota tool. Edit it so a colleague could understand the decision in a year's time. Add every part that is missing: changing nothing, a trial result, a switching cost, what the chosen option does worse, and a review date.",
        start: "Job: the team needs a shared rota. Options: RotaApp and ShiftBoard. Decision: ShiftBoard, because it is cheaper.",
        unchanged: "You have not changed the record yet. Start by adding the option of changing nothing, then work through the other missing parts.",
        keep: [
          {
            id: "shiftboard",
            any: ["ShiftBoard"],
            missing: "Keep the decision. The record should still say that ShiftBoard was chosen.",
          },
        ],
        limits: [
          {
            id: "nothing",
            any: ["changing nothing", "change nothing", "do nothing", "doing nothing", "keep", "stay with", "current", "as it is", "spreadsheet", "paper", "whiteboard"],
            missing: "The record still does not consider keeping the current rota. Add it as an option and say what it would cost.",
          },
          {
            id: "trial",
            any: ["trial", "tested", "tried", "put through", "real shifts", "last week"],
            missing: "The record does not say what happened when real shifts were put through either tool. Add the trial result.",
          },
          {
            id: "switching",
            any: ["switching", "moving in", "move in", "moving out", "move out", "export", "notice", "import", "set up", "set-up", "re-enter", "side by side"],
            missing: "'Cheaper' refers only to the licence. Add what it would take to move in and out.",
          },
          {
            id: "weakness",
            any: ["worse", "weakness", "downside", "cannot", "can't", "does not", "doesn't", "accept"],
            missing: "Say what ShiftBoard does worse than the other options, so a reader knows what was accepted.",
          },
          {
            id: "review",
            any: ["review", "revisit", "look again"],
            missing: "Add the date on which someone will review this choice.",
          },
        ],
        limitWording: false,
        why: "The record now shows every option including changing nothing, the evidence from your own work, the cost of switching, the weakness you accepted, and when the choice will be looked at again.",
        result: {
          label: "A repaired record",
          text: "Job: the head chef and two shift leads build the rota for eighteen staff each week on a paper sheet, and swaps are agreed by text and often lost. Options: RotaApp, ShiftBoard, and keeping the paper rota, which costs the head chef about three hours a week. Trial: the shift leads put last week's rota through both tools, and only ShiftBoard handled a split shift. Switching cost: about a day to enter staff and patterns, one week running paper and ShiftBoard side by side, and a CSV export with thirty days' notice to leave. Decision: ShiftBoard. It is cheaper, but it cannot send swap requests by text, so staff without the app will still ask a shift lead. We will review this choice on 1 September.",
        },
      },
      bridge:
        "You can now repair a record in place. The next lesson brings every move in the course together in a set of situations you have not yet seen, before you write your own record.",
    },
    {
      id: "judge-a-choice-in-practice",
      title: "Judge a choice in practice",
      emphasis: "practice",
      place:
        "This is the course assessment. It recaps the method, works one mixed example, and then asks you to apply every earlier lesson to eight situations you have not yet seen.",
      sections: [
        {
          heading: "The method in one page",
          paragraphs: [
            "The course has taught one method in five moves. You write the job before looking at products, describing who does the work, how often and what goes wrong, and you keep features out of it. You put the same five questions to every option, including changing nothing, and you read each vendor sentence for whether it answers a question or leaves it open.",
            "You test the strongest option on three real cases from last week, including an awkward one, and you ask the person who does the job to run them. You count the switching cost in both directions, mostly in people's time, and you do not let the licence price stand in for the whole cost. Finally, you write it all on one page, with the weakness you accepted and a review date.",
          ],
        },
        {
          heading: "Where the method is most often broken",
          paragraphs: [
            "In practice the method is rarely broken in one dramatic step. It is broken by small shortcuts under time pressure: a shortlist taken straight from a vendor's feature list, a scoring sheet in which the answer that should stop the choice is outweighed by points elsewhere, or a demonstration accepted in place of a trial.",
            "The other common break is at the end. The team does the work well, and then records the decision as a single line in an email. A year later nobody can say why the tool was chosen, and the renewal goes through by default.",
          ],
        },
        {
          heading: "How the assessment works",
          paragraphs: [
            "Each situation below is set in a workplace you have not met in the course. Read it in full, then choose the option that follows the method. Every option is something a reasonable manager might do, so read them all before you choose.",
            "You need six of the eight correct to pass. After you submit, each question shows whether your choice was right and why, and if you do not reach six you can read the feedback and try again.",
          ],
        },
      ],
      workedExample: {
        title: "A mixed case at Ashdown Veterinary Group",
        inputLabel: "The practice manager's email",
        outputLabel: "What the method found",
        prompt:
          "Hi, we're moving off the old appointment system. VetDesk is £140 a month and PetBook is £95, so PetBook looks like the obvious choice. PetBook's demo was excellent. Can we sign this week? Rachel Moore, Practice Manager.",
        output:
          "Job: three receptionists book about 300 appointments a week across two surgeries, and emergency appointments squeezed in by vets are often not entered. Options: VetDesk, PetBook, and staying on the old system, whose support ends in December. Trial: reception put last week's cases through both, and PetBook could not add an appointment without a free slot, so emergencies could not be entered. Switching cost: PetBook has no import for the 4,000 pet records, about eight days of reception time, while VetDesk imports them. Decision: VetDesk, reviewed next October.",
        reading: [
          "Rachel's email compared licence prices and a demonstration. Both are real information, and neither is enough to decide on.",
          "Writing the job first brought out the emergency appointment, which became the awkward case in the trial. PetBook failed it, which the demonstration could never have shown.",
          "The switching cost reversed the price difference. PetBook is £45 a month cheaper, but eight days of reception time to re-enter records is a large cost the licence line did not show.",
        ],
      },
      practice: {
        intro:
          "Before the assessment, choose between two short recommendations for the Ashdown case. The method on this page is the standard to judge them by.",
        check: {
          kind: "choose",
          prompt: "Choose the recommendation Rachel could put in front of the partners with confidence.",
          leftLabel: "Recommendation A",
          left: "Recommend PetBook. It is £45 a month cheaper than VetDesk, the demo was excellent, and reception liked it.",
          rightLabel: "Recommendation B",
          right:
            "Recommend VetDesk over PetBook and over staying on the old system. It handled emergency appointments in our trial and imports our 4,000 pet records. It costs £45 a month more. We will review the choice next October.",
          correct: "right",
          why: "Recommendation B compares every option including staying put, rests on the trial and the switching cost, admits that VetDesk costs more, and names a review date.",
          wrong:
            "Recommendation A rests on the licence price and the demonstration. It leaves out the emergency case that PetBook failed in the trial and the eight days of re-entry. Look again at Recommendation B.",
        },
      },
      check: {
        kind: "scenario",
        prompt: "Read each situation and choose what you would do. You need six of the eight correct to pass.",
        passMark: 6,
        questions: [
          {
            id: "shortlist",
            situation:
              "Priya Nair, head of customer service at Larkfield Insurance, forwards you a vendor's comparison chart listing forty features across three complaint-handling tools. She asks for a shortlist by Friday. Her team of nine handles about 250 complaints a month, and several have recently missed the eight-week response deadline.",
            question: "What do you do first?",
            options: [
              {
                id: "a",
                text: "Tick the features on the chart that the team would use and shortlist the tool with the most ticks.",
                feedback:
                  "The chart was written by a vendor, so a shortlist built from it measures the tools against that vendor's features. Write the job first, including the missed deadlines, and then read the chart against it.",
              },
              {
                id: "b",
                text: "Write a job statement with the team: who handles complaints, the monthly volume, and how cases come to miss the deadline.",
                correct: true,
                feedback:
                  "That is the right first move. The missed deadlines are the failure that matters, and a job statement puts them at the centre of the comparison before any feature list can.",
              },
              {
                id: "c",
                text: "Book demonstrations with all three vendors this week so the team can see the tools in action.",
                feedback:
                  "Demonstrations show each vendor's best case. Without a job statement, the team has nothing to judge them against. Write the job first, then use it to decide what to ask each vendor to show.",
              },
            ],
          },
          {
            id: "scores",
            situation:
              "A colleague at Brennan Estates has scored two property management tools out of fifty. Tool A scores 44 and Tool B scores 39. In the notes, Tool A's answer to the third question reads 'Data can only be exported as PDF reports.'",
            question: "How do you treat the scores?",
            options: [
              {
                id: "a",
                text: "Go with Tool A, because a five-point lead is clear.",
                feedback:
                  "The points hide the one answer that should stop the choice. If records only come out as PDF reports, you cannot move them into another tool. Read the answers side by side, not the total.",
              },
              {
                id: "b",
                text: "Reduce Tool A's score on the third question and add the scores up again.",
                feedback:
                  "Adjusting the points still treats a failed export as something that can be outweighed. The five questions are not a scoring sheet. Treat the export answer as a possible reason to rule Tool A out, and ask the vendor in writing.",
              },
              {
                id: "c",
                text: "Set the scores aside, and treat the PDF-only export as a possible reason to rule Tool A out until the vendor confirms how all records can be exported.",
                correct: true,
                feedback:
                  "That holds. Being unable to get your data out in a usable form is the kind of answer that should stop a choice on its own, whatever the other answers are.",
              },
            ],
          },
          {
            id: "nothing",
            situation:
              "At Holloway Dental, the practice owner Chris Tan asks you to compare two patient reminder tools. He says: 'We're only looking at the two new tools. The current way is the receptionists phoning patients the day before, and that's not an option.' The receptionists spend about six hours a week on those calls.",
            question: "How do you set up the comparison?",
            options: [
              {
                id: "a",
                text: "Compare only the two new tools, as Chris asked.",
                feedback:
                  "Without the current routine in the comparison, a reader cannot tell whether either tool beats it. Put the five questions to the phone calls as well, including the six hours a week they cost.",
              },
              {
                id: "b",
                text: "Include the phone calls as a third option and put the same five questions to them, including the six hours a week.",
                correct: true,
                feedback:
                  "That is right. Changing nothing is always an option with its own cost, owner and data. Including it makes the comparison fair and gives Chris a figure the new tools have to beat.",
              },
              {
                id: "c",
                text: "Mention the phone calls in a footnote but leave them out of the five questions.",
                feedback:
                  "A footnote does not make the comparison fair. The current routine needs the same five questions as the new tools, so the reader can see what each option costs in people's time.",
              },
              {
                id: "d",
                text: "Ask the receptionists which tool they prefer and recommend that one.",
                feedback:
                  "Their view matters, and they should run the trial, but a preference is not a comparison. Put the five questions to all three options, including the phone calls.",
              },
            ],
          },
          {
            id: "trial",
            situation:
              "Kelso Logistics is choosing a delivery scheduling tool. The vendor offers a polished online demonstration using sample data, and a fourteen-day free trial. Dispatcher Amir Sadiq schedules about eighty deliveries a day, and last week a delivery to a site with a two-hour access window had to be rebooked twice.",
            question: "How do you test the tool?",
            options: [
              {
                id: "a",
                text: "Ask Amir to put three of last week's deliveries through the free trial, including the one with the two-hour access window, and write down what happened to each.",
                correct: true,
                feedback:
                  "That holds. Amir does the job, the cases are real, and the delivery with the access window is the awkward case most likely to show where the tool makes the work harder.",
              },
              {
                id: "b",
                text: "Attend the demonstration with the operations director and take notes.",
                feedback:
                  "A demonstration shows the vendor's best case with sample data. It cannot show how the tool handles your access windows. Ask Amir to run real cases in the trial.",
              },
              {
                id: "c",
                text: "Run the trial yourself on the vendor's sample data so you understand the tool before involving Amir.",
                feedback:
                  "You do not do the scheduling every day, and the sample data was chosen to work well. Ask Amir, who does the job, to run last week's real deliveries, including the awkward one.",
              },
            ],
          },
          {
            id: "awkward",
            situation:
              "In a trial at Pennine Outdoor, the returns clerk put three of last week's returns through a new returns tool. Two standard refunds took a minute each. A return where the customer wanted an exchange for a different size could not be recorded as an exchange, only as a refund followed by a new order.",
            question: "What do you do with this result?",
            options: [
              {
                id: "a",
                text: "Treat it as a minor issue, because two of the three cases went well.",
                feedback:
                  "The awkward case is the one that matters most, because it shows where the tool makes the work harder. Record it, and ask the vendor in writing before deciding.",
              },
              {
                id: "b",
                text: "Rule the tool out immediately.",
                feedback:
                  "It may turn out to rule the tool out, but you do not yet know whether there is a way to record exchanges. Record the finding and ask the vendor in writing, then decide.",
              },
              {
                id: "c",
                text: "Run the trial again with three standard refunds to get a cleaner result.",
                feedback:
                  "Removing the awkward case hides the finding the trial exists to produce. Keep the exchange case and ask the vendor how the tool handles it.",
              },
              {
                id: "d",
                text: "Record what happened to each case, and send the vendor a written question about exchanges before any choice is made.",
                correct: true,
                feedback:
                  "That is right. The trial did its job by finding an exception the demonstration never showed, and the vendor's written answer belongs in the choice record whatever it says.",
              },
            ],
          },
          {
            id: "licence",
            situation:
              "Harbour Lettings is comparing two tenancy management tools. Tool A costs £3,600 a year and Tool B costs £2,400. Tool B has no import from the current system, so the 900 active tenancies would have to be entered by hand. Tool A imports them.",
            question: "What does your comparison need next?",
            options: [
              {
                id: "a",
                text: "Recommend Tool B, because it saves £1,200 a year.",
                feedback:
                  "The £1,200 is a licence cost only. Entering 900 tenancies by hand could cost far more in people's time. Add switching cost lines for moving in and moving out before comparing.",
              },
              {
                id: "b",
                text: "Estimate the time to enter 900 tenancies by hand for a named role, add moving-out lines for both tools, and then compare.",
                correct: true,
                feedback:
                  "That holds. The licence price is the easiest number to find and often the smallest part of the cost. Once the re-entry time and the cost of leaving are on the page, the comparison is finished.",
              },
              {
                id: "c",
                text: "Ask Tool B's vendor for a discount to widen the gap.",
                feedback:
                  "A discount changes the licence cost, which was not the missing part. The comparison still says nothing about the 900 tenancies or about leaving. Add the switching cost first.",
              },
            ],
          },
          {
            id: "exit",
            situation:
              "The contract for a training records tool at Wexcombe Council's leisure trust runs for three years, renews automatically, and needs 120 days' notice to cancel. Staff training records can only be exported as individual PDF certificates, not as a spreadsheet.",
            question: "Where does this belong in the comparison?",
            options: [
              {
                id: "a",
                text: "Under licence cost, as a note on the contract terms.",
                feedback:
                  "Contract length and export format are about leaving, not about the price of the licence. Record them as switching cost for moving out.",
              },
              {
                id: "b",
                text: "Nowhere yet, because the trust does not plan to leave.",
                feedback:
                  "The cost of leaving is part of what you agree to on the day you sign. A long contract and PDF-only records make it much harder to choose again, so they belong in the comparison now.",
              },
              {
                id: "c",
                text: "As a moving-out switching cost, weighed alongside the other options before the choice is made.",
                correct: true,
                feedback:
                  "That is right. The notice period, the automatic renewal and the export format together decide whether the trust is free to choose again, so they are switching cost and they belong in the comparison.",
              },
            ],
          },
          {
            id: "record",
            situation:
              "Beth Lowry at Cairn Architects has chosen a file-sharing tool. Her draft record names the job, three options including changing nothing, the five answers, the trial and the switching cost. The decision reads: 'We chose DocuVault because it handled the large drawing files in our trial.'",
            question: "What should Beth add before she files the record?",
            options: [
              {
                id: "a",
                text: "Nothing, because the decision already gives the reason.",
                feedback:
                  "The reason is there, but the reader cannot see what was accepted or when the choice will be looked at again. Add what DocuVault does worse and a review date.",
              },
              {
                id: "b",
                text: "A paragraph on why the team was enthusiastic about DocuVault.",
                feedback:
                  "Enthusiasm reads as advocacy, and it does not help a reader decide whether to renew. Add what DocuVault does worse and a named review date instead.",
              },
              {
                id: "c",
                text: "What DocuVault does worse than the other options, and a named review date with a reason.",
                correct: true,
                feedback:
                  "That holds. The weakness tells the reader what was accepted, and the review date means the choice will be revisited, for example before the contract renews.",
              },
              {
                id: "d",
                text: "The minutes of the meeting where the decision was made.",
                feedback:
                  "A reader does not need to know who said what. They need the weakness that was accepted and the date the choice will be reviewed.",
              },
            ],
          },
        ],
        why: "You applied the method to situations you had not seen: the job before the features, the same questions for every option including changing nothing, a trial on real work with an awkward case, the switching cost both ways, and a record with its weakness and review date.",
      },
      bridge:
        "You have applied the method to eight new situations. In the last lesson you write the choice record for your own team's decision, and that record is what your signed record will show.",
    },
    {
      id: "your-choice-record",
      title: "Write your choice record",
      emphasis: "record",
      place:
        "This is the last lesson. You write the choice record for your own team's decision, and the record you write here is the work your signed record shows.",
      sections: [
        {
          heading: "Bring the course together",
          paragraphs: [
            "Your choice record uses the six parts from the repair lesson, and it draws on the work you did earlier in the course: the job statement, the answers to the five questions, the trial and the switching cost. Write each part so that it stands on its own for a reader who joins your team next year.",
            "If you have not yet made the decision, you may write 'Recommended' instead of 'Chosen'. You must still say which option you recommend, why, and what it does worse. A record that recommends changing nothing is a valid record, and sometimes it is the right one.",
          ],
        },
        {
          heading: "Two labels for your own lines",
          paragraphs: [
            "Before you submit, read each part and give it one of two labels. A line is Ready for a reader when someone who was not in the room could understand it and check it: it names people, numbers, cases, dates or systems. A line where A reader would have to ask depends on something only you know, such as 'the usual problem', 'the one we discussed' or 'soon'.",
            "Wherever a reader would have to ask, add the sentence that answers them. That is the same repair you practised in the last lesson, applied to your own work.",
          ],
        },
        {
          heading: "What goes on the record",
          paragraphs: [
            "The record is checked part by part. The job has to describe work, with a person or a number in it, and something that happens now. The options have to include changing nothing. The five questions have to show answers, or 'Not yet known' where there is none. The trial has to name real cases, including an awkward one. The switching cost has to include moving out as well as moving in. The decision has to name the option, and it needs a review date.",
            "Do not put confidential or personal information into the record. It will appear on a page that a second person can open with the reference, so use names and figures you would be comfortable showing, or realistic substitutes that keep the same shape. The record states what you wrote. It does not certify the tool, your organisation or the decision against any standard.",
          ],
        },
      ],
      workedExample: {
        title: "Nadia's choice record",
        inputLabel: "Nadia's notes from the course",
        outputLabel: "The choice record",
        prompt:
          "Job statement from lesson one. Vendor reply and follow-up answers from lesson two. Mark's trial from lesson three. Set-up estimate and contract terms. The vendor's written answer on the landlord's leak.",
        output:
          "The job: staff in three buildings report about forty faults a week by email or to a caretaker in the corridor, and corridor reports are often forgotten.\nOptions considered: the helpdesk tool, a shared Outlook mailbox, and changing nothing, which costs the two caretakers about two hours a week chasing forgotten reports.\nFive questions: the helpdesk tool fits the work; Mark Hughes runs it for about an hour a week; data is held in the UK and exports as CSV; it connects to college email; three-year cost is not yet known until the quote arrives.\nTrial on our work: Mark put three real faults through on Tuesday; email and corridor reports worked, and the awkward case, a landlord's leak, needed a 'closed, external' status the vendor has confirmed in writing it will add.\nSwitching cost: moving in, two days of set-up and one hour for each caretaker; moving out, ninety days' notice and a CSV export of all faults.\nDecision and review date: recommended, the helpdesk tool. Its weakness is that the phone app needs a signal, which is poor in the basement plant room. Review on 1 September, the contract anniversary.",
        reading: [
          "Each part stands on its own. A reader who never met Nadia can see the job, every option including changing nothing, and the evidence for the recommendation.",
          "The five questions include 'not yet known' for the three-year cost. That is honest, and it tells the reader what to check before signing.",
          "The decision admits a weakness and names a review date with a reason. That is why a reader can trust the record, and it is the standard your own record has to meet.",
        ],
      },
      practice: {
        intro:
          "Before you write your own, mark these lines from a draft record at Linfield Pharmacy. Use the two labels defined above.",
        check: {
          kind: "mark",
          prompt: "Mark each line as Ready for a reader or as A reader would have to ask.",
          passLabel: READY,
          failLabel: ASK,
          sentences: [
            {
              id: "job",
              text: "The job: two dispensers log about 120 prescription collections a day on paper, and uncollected items are not chased.",
              fail: false,
              why: "This names the people, the volume and the failure, so a reader could understand and check it.",
            },
            {
              id: "options",
              text: "Options considered: the usual ones.",
              fail: true,
              why: "'The usual ones' depends on something only the author knows. A reader would have to ask which options, and whether changing nothing was one of them.",
            },
            {
              id: "review",
              text: "Decision and review date: we'll look at it again soon.",
              fail: true,
              why: "'Soon' is not a date. A reader would have to ask when, and the review might never happen.",
            },
          ],
          why: "That is right. The job line names people, a number and a failure, while 'the usual ones' and 'soon' leave a reader asking.",
        },
      },
      check: {
        kind: "build",
        prompt: "Write the choice record for your own team's decision. Fill in all six parts so that a colleague could read it in a year's time and know what was weighed and what was accepted.",
        fields: [
          {
            id: "job",
            label: "The job",
            hint: "Who does the work, how often, and what goes wrong at the moment. No features.",
            min: 40,
            rule: "fact",
            missing:
              "The job does not yet describe the work with a concrete fact. Name who does it, give a number such as how many a week, and say what goes wrong at the moment.",
          },
          {
            id: "options",
            label: "Options considered",
            hint: "Every option you weighed, including changing nothing and what that would cost.",
            min: 30,
            any: [
              "changing nothing",
              "change nothing",
              "do nothing",
              "doing nothing",
              "keep",
              "keeping",
              "stay with",
              "staying",
              "current",
              "as it is",
              "as now",
              "no change",
            ],
            missing: "The options do not include changing nothing. Add the current way of working as an option and say what it costs.",
          },
          {
            id: "questions",
            label: "Five questions",
            hint: "For each option: does it fit the work, who runs it, where the data goes and how it comes out, what it connects to, and the three-year cost. Write 'Not yet known' where you have no answer.",
            min: 60,
            any: ["not yet known", "run", "data", "export", "connect", "three years", "3 years", "cost", "fit"],
            missing:
              "The five questions are not yet answered. For each option, say who runs it, where the data goes, what it connects to and what it costs, and write 'Not yet known' where you have no answer.",
          },
          {
            id: "trial",
            label: "Trial on our work",
            hint: "Which real cases were put through, by whom, which one was awkward, and what happened to each.",
            min: 40,
            any: ["case", "cases", "awkward", "tried", "trial", "tested", "put through"],
            rule: "fact",
            missing:
              "The trial does not yet name real cases. Say who put which cases through, name the awkward one, and say what happened to each.",
          },
          {
            id: "switching",
            label: "Switching cost",
            hint: "What moving in would take, and what moving out would take: the export, the notice period, and people's time.",
            min: 40,
            any: ["moving out", "move out", "leave", "leaving", "exit", "notice", "export", "cancel"],
            missing:
              "The switching cost does not yet cover moving out. Say how the data would come back out, in what form, and what notice the contract requires, as well as what moving in would take.",
          },
          {
            id: "decision",
            label: "Decision and review date",
            hint: "The option chosen or recommended, what it does worse, and the date the choice will be reviewed.",
            min: 40,
            any: ["review", "revisit", "look again"],
            rule: "fact",
            missing:
              "The decision does not yet name a review date. Say which option was chosen or recommended, what it does worse, and give the date on which the choice will be reviewed.",
          },
        ],
        why: "Your record states the job, weighs every option including changing nothing, answers the five questions, shows evidence from your own work, counts the cost of switching both ways, and names a review date. A colleague could read it in a year and know what was weighed and what was accepted.",
      },
      bridge:
        "Your choice record is ready. Sign your name below, and the record will show it, the course and the date to anyone who opens the reference.",
    },
  ],
};
