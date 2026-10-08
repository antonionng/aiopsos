/*
Course: Getting Value from the Technology You Already Pay For
Slug: getting-value-from-the-technology-you-already-pay-for
For: Team leaders, operations managers and office managers who hold or influence a software budget,
  know which tools their team logs in to, and can see or ask for the list of licences. No administrator
  rights or technical training needed.
Outcome: The learner sets the licences the team pays for beside the jobs the team repeats each week,
  names three jobs a tool already owned could carry, says why people have not used it for those jobs,
  and hands their manager a 30-day plan naming the job, the tool and feature, the owner, the reason and
  remedy, the first action, what stops, and the sign in the work.
Artefact: The 30-day plan: three rows, one per job, seven parts per row.
Record sentence: Wrote and signed a 30-day plan that moves three repeating jobs into tools the team
  already pays for, with an owner, a first action, an end to the old route, and a sign in the work.
Lessons (id, title, move, interaction, pass rule):
  1. a-licence-is-not-a-job, A licence is not a job. Tell a licence from a job. Mark (In use for a job /
     Paid for, no job named). Pass: every line marked correctly.
  2. take-the-inventory, Take the inventory. Write an inventory row with the nearby job. Practice build
     (four columns, each ruled); check choose between two rows. Pass: the row you could act on.
  3. three-jobs-worth-moving, Three jobs worth moving. Apply the four tests. Mark (Worth moving / Not now).
     Pass: every job marked correctly.
  4. why-people-opt-out, Why people opt out. Diagnose the reason and pick the remedy. Practice choose;
     check scenario with three comments and the three reasons as options. Pass: all three right.
  5. repair-a-30-day-plan, Repair a 30-day plan. Add the missing parts to a plan row. Practice build
     (what stops, sign in the work); check edit. Pass: owner, first action in week one, what stops, and a
     week-four sign all present, and the job and tool kept.
  6. put-the-method-to-work, Put the method to work (course assessment). Scenario of seven new situations
     across every lesson. Pass: six of seven.
  7. your-30-day-plan, Your 30-day plan. Write the artefact. Build of three rows by seven parts, each part
     ruled (repeat word, named tool, role word, one of the three reasons, a day or date, an end word,
     week four). Pass: every part present.
Sources: Microsoft Learn, Microsoft 365 reports in the admin centre. Google Workspace Admin Help, reports
  and licence management in the Admin console. Microsoft Adoption (adoption.microsoft.com). Chip Heath and
  Dan Heath, Switch: How to Change Things When Change Is Hard (2010).
Tested on phone:          no
Tested returning learner: no
Pass rule tests written:  yes
*/
import type { CourseContent } from "./types.ts";
import type { BuildField } from "../types.ts";

const IN_USE = "In use for a job";
const NO_JOB = "Paid for, no job named";
const WORTH = "Worth moving";
const NOT_NOW = "Not now";

const ROLE_WORDS = [
  "manager",
  "lead",
  "officer",
  "administrator",
  "coordinator",
  "co-ordinator",
  "head of",
  "supervisor",
  "assistant",
  "adviser",
  "advisor",
  "partner",
  "director",
  "receptionist",
  "clerk",
  "controller",
  "analyst",
  "accountant",
  "secretary",
  "engineer",
];

const WEEK_ONE_WORDS = ["week one", "week 1", "monday", "tuesday", "wednesday", "thursday", "friday"];

const STOP_WORDS = [
  "stop",
  "no longer",
  "read-only",
  "read only",
  "closed",
  "switched off",
  "turned off",
  "sent back",
  "archived",
  "retired",
  "removed",
  "not accepted",
];

const WEEK_FOUR_WORDS = ["week four", "week 4"];

const REPEAT_WORDS = [
  "every",
  "each",
  "weekly",
  "daily",
  "week",
  "day",
  "morning",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
];

const REASONS = ["quicker the old way", "nobody showed them", "waiting on someone else"];

function planRow(key: string, name: string): BuildField[] {
  return [
    {
      id: `${key}-job`,
      label: `Row ${name}: Job`,
      hint: "The repeating job, how it is done now, and how often it comes round, for example every Monday.",
      min: 12,
      any: REPEAT_WORDS,
      missing: `The job in row ${name} does not say how often it comes round. Say that it happens every day, every week, or on a named day, because a job that does not repeat will not build a habit.`,
    },
    {
      id: `${key}-tool`,
      label: `Row ${name}: Tool and feature`,
      hint: "The tool from your inventory and the feature that will carry the job, for example Microsoft Forms with a response sheet.",
      min: 8,
      rule: "fact",
      missing: `The tool in row ${name} is not yet named. Give the product by name, as it appears in your inventory, and the feature that will carry the job, for example Microsoft Bookings with email confirmation.`,
    },
    {
      id: `${key}-owner`,
      label: `Row ${name}: Owner`,
      hint: "One person and their role, for example Priya Shah, office manager.",
      min: 6,
      rule: "role",
      any: ROLE_WORDS,
      missing: `Row ${name} does not yet name an owner with a role. Name one person and their role, for example Priya Shah, office manager, because nobody can ask 'everyone' or 'the team' what happened.`,
    },
    {
      id: `${key}-reason`,
      label: `Row ${name}: Reason and remedy`,
      hint: "Quicker the old way, Nobody showed them, or Waiting on someone else, and the remedy that goes with it.",
      min: 20,
      any: REASONS,
      missing: `The reason in row ${name} is not one of the three the course uses. Write Quicker the old way, Nobody showed them, or Waiting on someone else, and then the remedy paired with it.`,
    },
    {
      id: `${key}-first`,
      label: `Row ${name}: First action`,
      hint: "What happens first, who does it, and the day in week one, for example by Wednesday of week one.",
      min: 12,
      rule: "fact",
      missing: `The first action in row ${name} has no day. Say what happens first and by which day of week one, for example by Wednesday.`,
    },
    {
      id: `${key}-stops`,
      label: `Row ${name}: What stops`,
      hint: "The old route that ends and when, for example the old sheet is made read-only on the switch-over Monday.",
      min: 12,
      any: STOP_WORDS,
      missing: `Row ${name} does not say what stops, so the old route will stay open. Name the old route and say when it stops, is closed, or is made read-only.`,
    },
    {
      id: `${key}-sign`,
      label: `Row ${name}: Sign in the work`,
      hint: "What you will see in the work itself in week four. Not a count of logins, and not a feeling.",
      min: 16,
      any: WEEK_FOUR_WORDS,
      missing: `The sign in row ${name} does not say what you will see in week four. Describe what you expect to find in the work itself in week four, rather than a count of logins or a sense that people like the tool.`,
    },
  ];
}

export const COURSE: CourseContent = {
  slug: "getting-value-from-the-technology-you-already-pay-for",
  hours: 2,
  artefact: {
    lessonId: "your-30-day-plan",
    title: "The 30-day plan",
    recordLine:
      "Wrote and signed a 30-day plan that moves three repeating jobs into tools the team already pays for, with an owner, a first action, an end to the old route, and a sign in the work.",
  },
  lessons: [
    {
      id: "a-licence-is-not-a-job",
      title: "A licence is not a job",
      emphasis: "job",
      place:
        "This is the first of seven lessons. It sets out the difference between owning software and getting work out of it, and every later lesson in the course depends on that difference.",
      sections: [
        {
          heading: "What a licence buys",
          paragraphs: [
            "A licence is the right to use a piece of software. Your organisation pays for it every month or every year, and it pays the same amount whether anyone opens the tool or not. The licence is a cost that has already been committed, usually by someone in finance or IT who agreed a renewal on behalf of the whole team.",
            "The value of that licence arrives only when a job the team does anyway is done inside the tool, and done faster, more reliably, or with less rework than it was done before. A job, in this course, is a piece of work that repeats: booking a client appointment, approving a supplier invoice, filing a signed contract, or running the Tuesday handover. Until one of those jobs happens inside the tool, the licence is a cost with nothing to show for it.",
          ],
        },
        {
          heading: "What a licence is not",
          paragraphs: [
            "A licence is not the same as a feature being switched on. Your administrator can turn on Microsoft Planner or Google Forms for everyone in an afternoon, and nothing about the team's week will change. A feature being switched on is not the same as the team using it for a job either. A shared board with one card that has not moved since March is switched on, and it carries no work.",
            "Nor is a daily login proof of value. A person can open a tool every morning, glance at it, and still keep the real work in email and a personal spreadsheet. Usage reports count logins and activity because that is what software can measure easily, and those counts are a useful starting point. They do not tell you which job moved, who does it, or whether the old way of doing it has stopped.",
          ],
        },
        {
          heading: "Two labels for every tool",
          paragraphs: [
            "For the rest of this course, you will describe each tool with one of two labels. A tool is In use for a job when you can name three things: the job, the person or team who does it, and the last week it happened inside the tool. 'Finance files every signed contract in the SharePoint contracts library on the day it is signed' earns this label, because it names all three.",
            "A tool is Paid for, no job named when you cannot name those three things. That includes the tool nobody opens, and it also includes the tool that everyone has an account for and that people describe as useful, because an account and an opinion are not a job. The label is not a judgement that the tool is poor or that the team is lazy. It is a plain statement that the licence has not yet been matched to a piece of work.",
          ],
          beforeAfter: {
            before: "Planner: set up last year, everyone has access.",
            after: "Planner: paid for, no job named. One board exists, and no card on it has moved since March.",
            reading:
              "The first line describes access. The second line applies the test, finds no job, person, or recent week, and says so plainly, which is the first step to putting the licence to work.",
          },
        },
        {
          heading: "The mistake people usually make",
          paragraphs: [
            "The usual mistake is to review software by listing what the team owns and what each product can do. That produces a long and accurate list, and it hides the one thing that matters, which is where the work actually happens. A manager can read it and feel reassured that the team is well equipped, while client appointments are still being written into a spreadsheet by hand.",
            "The better habit is to start from the work and ask where it is done. When you find a repeating job that is done outside a tool the team already pays for, you have found the kind of gap this course is about. Those gaps are usually cheaper to close than any new purchase, because the money has already been spent.",
          ],
        },
      ],
      workedExample: {
        title: "From what the office owns to where the work happens",
        inputLabel: "The office manager's note",
        outputLabel: "The rewrite",
        prompt:
          "We have Teams, SharePoint, Planner, Forms and Bookings. Everyone uses Teams daily. Client appointments are booked by phone and written into a shared Excel file. Planner was set up last year and has one board with no cards moved since March.",
        output:
          "Teams is in use for a job: daily internal chat and the weekly team call. Bookings is paid for, no job named, while client appointments are still booked by phone into Excel. Planner is paid for, no job named, with one board untouched since March.",
        reading: [
          "The note came from the office manager of a twelve-person office on Microsoft 365. It is an honest description of what the office owns, and it reads as though the office is well served, because every product on the list is available to every member of staff.",
          "The rewrite applies the two labels. Teams is in use for a job, because the note names the work that happens there and it happens every day. Planner is paid for, no job named, because a board with no movement since March carries no work, however long ago it was set up.",
          "Bookings stands out. A real job, booking client appointments, is being done by phone and typed into a spreadsheet, while a tool that exists to take bookings sits unused in the same licence. That is exactly the gap the rest of the course is looking for: a repeating job done outside a tool the office already pays for.",
        ],
      },
      practice: {
        intro:
          "Here are three lines from a warehouse supervisor's note about the tools on site. Mark each one with the label it deserves. The definitions of both labels are in the section above if you want to read them again.",
        check: {
          kind: "mark",
          prompt: "Mark each line as In use for a job or as Paid for, no job named.",
          passLabel: IN_USE,
          failLabel: NO_JOB,
          sentences: [
            {
              id: "handover",
              text: "Microsoft Teams: the night shift supervisor runs the 6am handover call in Teams, and it ran this morning.",
              fail: false,
              why: "This line names the job, the handover call, the person who runs it, and when it last happened in the tool, so it is in use for a job.",
            },
            {
              id: "canva",
              text: "Canva: we bought it in the spring for the whole site.",
              fail: true,
              why: "Buying the tool is the licence. The line names no job, no person, and no recent week, so it is paid for, no job named.",
            },
            {
              id: "forms",
              text: "Google Forms: the goods-in team logs every damaged delivery on a form, and the last one was logged on Monday.",
              fail: false,
              why: "The line names the job, logging damaged deliveries, the team that does it, and the last day it happened, so it is in use for a job.",
            },
          ],
          why: "That is right. The handover call and the damaged-delivery form each name a job, the people who do it, and a recent day, while the Canva line only records a purchase.",
        },
      },
      check: {
        kind: "mark",
        prompt: "A team lead wrote these four lines about their tools. Mark each line with the label it deserves.",
        passLabel: IN_USE,
        failLabel: NO_JOB,
        sentences: [
          {
            id: "slack",
            text: "Slack: every client escalation is posted in the escalations channel, and the on-call person replies there.",
            fail: false,
            why: "It names a job and the person who does it inside Slack, which is what in use for a job means.",
          },
          {
            id: "zoom",
            text: "Zoom: everyone has an account.",
            fail: true,
            why: "Having an account is the licence itself. The lesson asked for the work that happens inside the tool, and this line names none.",
          },
          {
            id: "google-forms",
            text: "Google Forms: we have it and it is really useful.",
            fail: true,
            why: "This line gives an opinion, not a job. It does not say what form is used, by whom, or when it was last used.",
          },
          {
            id: "sharepoint",
            text: "SharePoint: the signed contracts library, where finance files every contract on the day it is signed.",
            fail: false,
            why: "It names finance, the job of filing signed contracts, and when it happens, which is everything the lesson asked for.",
          },
        ],
        why: "That is the right reading. The Slack and SharePoint lines each name a job and who does it inside the tool, so they are in use for a job. The Zoom line records an account and the Google Forms line records an opinion, so neither names a job, and both are paid for, no job named.",
      },
      bridge:
        "Now that you can tell a licence from a job, the next lesson turns that distinction into an inventory of everything your team pays for.",
    },
    {
      id: "take-the-inventory",
      title: "Take the inventory",
      emphasis: "inventory",
      place:
        "This lesson covers the first module of the course. It produces the table that every later lesson draws on, so it is worth doing with your own tools rather than in the abstract.",
      sections: [
        {
          heading: "Four columns, one row for each tool",
          paragraphs: [
            "An inventory, in this course, is a table with one row for each licensed tool and four columns. The first column is the tool. The second is who holds a licence, as a number and a group, such as four licences held by the account managers. The third is the job it is in use for, written with the test from the last lesson: the job, the person, and a recent week.",
            "The fourth column is the nearby job that is still done somewhere else. For each tool, you write the repeating job closest to what the tool can already do that the team still does by hand, by email, on paper, or in a personal spreadsheet. This column is the one that matters most, because it is where the value you have already paid for is waiting.",
          ],
        },
        {
          heading: "What an inventory is not",
          paragraphs: [
            "An inventory is not the finance list of subscriptions. That list is the right place to start, because it tells you every product the organisation pays for and how many seats it bought. Finance records cost, though, and not work, so the list cannot tell you what happens inside each tool or what happens outside it.",
            "An inventory is also not the vendor's feature list. A feature list tells you what is possible, and it is long by design, because vendors sell on breadth. The inventory tells you what is happening in your team this month, and the fourth column only ever names a job your team already does, never a feature you have heard about and would like to try.",
          ],
          beforeAfter: {
            before: "Mailchimp: email marketing platform with automations, landing pages and audience segmentation.",
            after:
              "Mailchimp Standard, one licence held by marketing, in use for the monthly newsletter. Nearby job still done elsewhere: event invitations sent from Outlook with a pasted list of addresses.",
            reading:
              "The first line is the vendor's description. The second line says who holds the licence, what job it carries, and which repeating job sits just outside it, which is something the team can act on.",
          },
        },
        {
          heading: "Where to find the facts",
          paragraphs: [
            "If you need the list of assigned licences, the person who administers your accounts can usually export it for you. Both the Microsoft 365 admin centre and the Google Workspace Admin console provide licence and usage reports, and Microsoft Learn and Google Workspace Admin Help each document where those reports sit. Ask for the assigned licences by product and by person, which is enough to fill the first two columns.",
            "The third and fourth columns do not come from any report. They come from asking the people who do the work what they did last week and where they did it. A ten-minute conversation with each person who holds a licence will usually fill both columns, and it often turns up a spreadsheet or an inbox that nobody outside that person's desk knew about.",
          ],
        },
        {
          heading: "The mistake people usually make",
          paragraphs: [
            "The usual mistake is to leave the fourth column empty or to fill it with ambitions. 'We should use it more' and 'could be good for marketing' feel like entries, but they name no job, so there is nothing to move. A row with an empty fourth column tells you the tool exists and tells you nothing about what to do next.",
            "A second mistake is to treat the inventory as a cost review and start cancelling licences. Some licences will turn out to be unused, and the renewal date is the right time to deal with them. This course is about putting the licences you keep to work, and a tool that looks idle today may be the one that carries a job next month.",
          ],
        },
      ],
      workedExample: {
        title: "One row from a small agency's inventory",
        inputLabel: "The finance list",
        outputLabel: "One row of the inventory",
        prompt:
          "Microsoft 365 Business Standard for twelve people, Adobe Acrobat Pro for four people, Mailchimp Standard, Xero, and DocuSign for two people.",
        output:
          "Acrobat Pro, four licences held by the account managers, in use for editing PDF brochures. Nearby job still done elsewhere: client contracts are printed, signed and scanned, although both Acrobat Pro and DocuSign can send a document for electronic signature.",
        reading: [
          "The finance list gives the first two columns for every product, and nothing more. It says the agency pays for Acrobat Pro for four people, but it cannot say what those four people do with it.",
          "The row adds the third column after a short conversation with the account managers: they use Acrobat Pro to edit PDF brochures. That is a real job, so the tool is in use for a job.",
          "The fourth column is where the row earns its place. Client contracts are printed, signed and scanned every week, although the agency already pays for electronic signature twice, once in Acrobat Pro and once in DocuSign. Whether to keep both signature tools is a question for the renewal date, but the inventory has found a repeating job done on paper and a capability already paid for, and it has put both on the table.",
        ],
      },
      practice: {
        intro:
          "Fill in one row of your own inventory, with all four columns. Pick a tool from your own team's list. The four columns are described in the first section above, and the worked example shows a finished row.",
        check: {
          kind: "build",
          prompt: "Write one inventory row for a tool your team pays for, filling in all four columns.",
          fields: [
            {
              id: "tool",
              label: "The tool",
              hint: "The product name as it appears on the finance list, for example Adobe Acrobat Pro.",
              min: 4,
              rule: "fact",
              missing:
                "The tool is not yet named. Write the product name as it appears on the finance list, with its capital letters, for example Adobe Acrobat Pro.",
            },
            {
              id: "holders",
              label: "Who holds a licence",
              hint: "How many licences and which group holds them, for example four licences held by the account managers.",
              min: 8,
              any: ["licence", "license", "seat", "people", "staff", "team", "manager", "everyone", "account"],
              missing:
                "Who holds a licence is not yet clear. Say how many licences there are and which group holds them, for example four licences held by the account managers.",
            },
            {
              id: "job",
              label: "The job it is in use for",
              hint: "The job, who does it, and when it last happened, or write Paid for, no job named.",
              min: 8,
              any: ["every", "each", "week", "day", "month", "last", "paid for, no job named", "no job named"],
              missing:
                "The job it is in use for does not say when it happens. Name the job, who does it, and when it last happened, or write Paid for, no job named if you cannot.",
            },
            {
              id: "nearby",
              label: "Nearby job still done elsewhere",
              hint: "Name a job that repeats, not a feature you have heard of, and say where it is done now.",
              min: 16,
              any: ["email", "inbox", "spreadsheet", "excel", "sheet", "paper", "printed", "by hand", "phone", "outlook", "word", "whiteboard", "diary", "post"],
              missing:
                "The nearby job does not say where it is done now. Name a repeating job and the place it is still done, such as email, paper, the phone, or a personal spreadsheet.",
            },
          ],
          why: "That row has all four columns. It names the tool, says who holds the licences, records the job it carries, and points to a repeating job still done somewhere else, which is the part the next lesson works from.",
        },
      },
      check: {
        kind: "choose",
        prompt: "Two colleagues each wrote an inventory row for the same tool. Choose the row you could act on.",
        leftLabel: "Row A",
        left: "Mailchimp: marketing uses it. Good tool, we should use it more.",
        rightLabel: "Row B",
        right:
          "Mailchimp Standard, one licence used by the marketing team, in use for the monthly newsletter. Nearby job still done elsewhere: event invitations are sent from Outlook with a pasted list of two hundred addresses.",
        correct: "right",
        why: "Row B names who holds the licence, the job it is in use for, and the nearby job still done elsewhere, so you can act on it. The invitations sent from Outlook are a repeating job that a tool already paid for could carry.",
        wrong:
          "Row A says who uses the tool but not for what job, and it leaves the fourth column, the nearby job still done elsewhere, empty. 'We should use it more' is an ambition, not a job. Look again at what that column asks for.",
      },
      bridge:
        "An inventory usually shows more nearby jobs than a team can move at once, so the next lesson shows you how to choose three.",
    },
    {
      id: "three-jobs-worth-moving",
      title: "Three jobs worth moving",
      emphasis: "moving",
      place:
        "This lesson covers the second module of the course. It narrows the fourth column of your inventory down to the three jobs your plan will cover.",
      sections: [
        {
          heading: "Four tests for a job",
          paragraphs: [
            "A job is Worth moving when four things are true of it. It repeats at least weekly. It involves more than one person, or a handoff from one person to another. A tool already in your inventory can do it. A mistake during the change would be cheap to put right, so that a wrong entry or a missed step costs a few minutes and not a client.",
            "A job is Not now when any one of those four tests fails. The label does not mean the job is unimportant or that it should never move. It means that this job, at this moment, will not give the team a weekly habit in a tool it already pays for, and a plan built on it is likely to stall.",
          ],
        },
        {
          heading: "What the tests are not looking for",
          paragraphs: [
            "The tests are not a search for the team's hardest problem. Hard problems usually need a project, a budget, or a new purchase, and this course is about the licences you already hold. If the best answer to a problem is a new system, it belongs in a different conversation, and marking it Not now here keeps it out of a 30-day plan that cannot carry it.",
            "The tests are also not a search for the most impressive feature. A workflow that routes approvals through four departments may be the thing the vendor demonstrates, but if the job behind it happens twice a year, nobody will remember how it works by the second time. A plain shared mailbox that three people use every day is worth more to the team than a clever feature nobody uses.",
          ],
        },
        {
          heading: "Why three",
          paragraphs: [
            "Three jobs is deliberate. It is enough for the team to feel a difference in a normal week, because three repeating jobs touch most people's days more than once. It is also few enough that you can support each one properly for a month, which means answering questions, fixing the first mistakes, and closing the old route when the time comes.",
            "Choosing more than three spreads that support too thin, and the jobs that get least attention drift back to email. Choosing one can work, but a single job is easy for the team to see as a pilot that belongs to you, and three jobs make the change feel like the way the team works.",
          ],
        },
        {
          heading: "The mistake people usually make",
          paragraphs: [
            "The usual mistake is to choose the job that is most visible to senior people, such as the quarterly board pack or the annual budget. Those jobs matter, and a manager may be grateful to see them improved, but they come round too rarely to build a habit. By the time the board pack is due again, the team has forgotten the new route and returns to the old one.",
            "When you mark a job Not now, write one sentence saying which test it failed. That sentence protects the decision when someone asks why their favourite job is not in the plan, and it gives you a list to return to once the first three jobs have settled.",
          ],
        },
      ],
      workedExample: {
        title: "Five nearby jobs from the agency's inventory",
        inputLabel: "Five nearby jobs",
        outputLabel: "The shortlist",
        prompt:
          "1. Client contracts are printed, signed and scanned. 2. Event invitations are sent from Outlook with a pasted list. 3. The quarterly board pack is assembled by hand. 4. Holiday requests are sent by email to one manager. 5. Old files are to be migrated once from a retired server.",
        output:
          "Worth moving: contracts, using Acrobat Pro; event invitations, using Mailchimp; holiday requests, using Microsoft Forms. Each repeats weekly and involves a handoff. Not now: the board pack, because it happens quarterly. Not now: the file migration, because it happens once.",
        reading: [
          "The three jobs marked Worth moving pass all four tests. Each comes round at least weekly, each passes from one person to another, each can be carried by a tool the agency already pays for, and a slip in the first week would cost minutes rather than money.",
          "The board pack fails the first test, because it comes round once a quarter. The file migration fails it more clearly still, because it happens once and then it is finished. Both are real work, and the migration may be urgent, but neither will build a weekly habit.",
          "A plan built on the two rejected jobs would stall after the first week, because there would be nothing to practise until the next quarter. The reason written beside each Not now is what lets the office manager explain the shortlist to the directors who care about the board pack.",
        ],
      },
      practice: {
        intro:
          "Here are three candidate jobs from a practice manager at a veterinary surgery. Mark each one with the label it deserves. The four tests are in the first section above.",
        check: {
          kind: "mark",
          prompt: "Mark each candidate job as Worth moving or as Not now.",
          passLabel: WORTH,
          failLabel: NOT_NOW,
          sentences: [
            {
              id: "rota",
              text: "The weekly nurses' rota is drawn up in a Word document and emailed to eight people; the surgery already pays for Microsoft Teams, which includes a shared shifts schedule.",
              fail: false,
              why: "The rota repeats every week, passes between people, and a tool the surgery already pays for can carry it, so it is worth moving.",
            },
            {
              id: "phones",
              text: "Choose a new telephone system when the current contract ends next year.",
              fail: true,
              why: "This is a one-off decision that needs a new purchase, so it fails two of the four tests and is not now.",
            },
            {
              id: "orders",
              text: "Drug stock requests are written on a whiteboard and copied into an email to the supplier every Friday; Microsoft Forms is licensed and unused.",
              fail: false,
              why: "The requests repeat every Friday, involve a handoff from the whiteboard to the person who orders, and Forms is already paid for, so it is worth moving.",
            },
          ],
          why: "That is right. The rota and the stock requests both come round every week, pass between people, and fit a tool the surgery already owns, while the phone system is a one-off that needs a new purchase.",
        },
      },
      check: {
        kind: "mark",
        prompt: "A finance team lead listed four candidate jobs. Mark each one with the label it deserves.",
        passLabel: WORTH,
        failLabel: NOT_NOW,
        sentences: [
          {
            id: "invoices",
            text: "Supplier invoices arrive in three people's inboxes and are forwarded to the approver; the team already has a shared mailbox it does not use.",
            fail: false,
            why: "Check the four tests again. Invoices repeat every week, pass between people, and the shared mailbox is already paid for, so this job is worth moving.",
          },
          {
            id: "budget",
            text: "Rebuild the annual budget model in a new planning system.",
            fail: true,
            why: "This job needs a system the team does not own and happens once a year. The lesson is about weekly jobs in tools you already pay for, so it is not now.",
          },
          {
            id: "checklist",
            text: "The month-end checklist lives in one person's Word document and is emailed round; Planner is licensed and unused.",
            fail: false,
            why: "Look at the handoff. Several people work from this checklist every month, and the tool that could carry it is already licensed, so a slip is cheap to fix and the job is worth moving.",
          },
          {
            id: "auditor",
            text: "Answer the auditor's questions about last year's accounts.",
            fail: true,
            why: "This job does not repeat. The first test in the lesson is that the job comes round at least weekly, so it is not now.",
          },
        ],
        why: "That is the right shortlist. The supplier invoices and the month-end checklist repeat, pass between people, and fit tools the team already has. The budget model needs a new purchase and comes once a year, and the auditor's questions are a one-off, so both are not now.",
      },
      bridge: "Choosing the job is the easy part, and the next lesson explains why a good job still stays outside the tool.",
    },
    {
      id: "why-people-opt-out",
      title: "Why people opt out",
      emphasis: "opt",
      place:
        "This lesson covers the third module of the course. It gives you a way to diagnose the reason behind each job you chose, so that your plan fixes the right thing.",
      sections: [
        {
          heading: "The cause is rarely stubbornness",
          paragraphs: [
            "When a team ignores a tool, the explanation people reach for first is that colleagues resist change. That explanation is almost always too broad to act on, and it is usually unfair. Most people keep to the old route for a reason that makes sense from where they sit, and you can hear the reason in what they say when you ask.",
            "The cause is also not fixed by an announcement. An email from a manager saying that everyone should now use the new tool changes nothing about the reason a person stayed away, so the old route carries on. In Switch (2010), Chip and Dan Heath argue that change comes more readily when the new behaviour is spelled out in specific steps, and the three reasons below are a way of finding which specific step is missing.",
          ],
        },
        {
          heading: "Three reasons you can hear",
          paragraphs: [
            "The first reason is Quicker the old way. The new route costs time the first few times, because there is set-up to do and the screens are unfamiliar, and the benefit arrives later. A busy person reasonably returns to what they know. You hear it as a comparison of speed: 'the phone is two seconds', or 'a quick message is faster'.",
            "The second reason is Nobody showed them. Any training they had was a tour of features, not ten minutes on their own piece of work, so they do not know that the tool can do the part of the job that would help them. You hear it as surprise: 'I didn't know it could do that'.",
            "The third reason is Waiting on someone else. The job is a handoff, and one person using the new route while the others stay on email is worse than everyone staying on email, because that person now has two places to look. You hear it as a condition: 'I'll move when the others do', or 'there's no point while reception still uses the spreadsheet'.",
          ],
        },
        {
          heading: "Each reason has its own remedy",
          paragraphs: [
            "Each reason calls for a different remedy, and the remedy for one does nothing for the others. For Quicker the old way, the remedy is a ready-made template or pre-set configuration, so the first use takes seconds and the set-up cost disappears. For Nobody showed them, the remedy is a short session of about ten minutes using the person's own real case, not a demonstration of every feature.",
            "For Waiting on someone else, the remedy is to move the whole handoff on the same day, so that everyone involved switches at once and nobody is left using the new route alone. That usually means choosing a date, telling everyone involved, and closing the old route on that date.",
          ],
          beforeAfter: {
            before: "Send a reminder to the team that Bookings is available and should be used.",
            after:
              "Pre-set each adviser's hours in Bookings before Friday, give each adviser ten minutes on one of their own appointments, and switch reception and all four advisers over on the same Monday.",
            reading:
              "The reminder answers none of the three reasons. The second version gives a remedy for each one: pre-set hours for the time cost, a short session on their own case, and one date for the whole handoff.",
          },
        },
        {
          heading: "The mistake people usually make",
          paragraphs: [
            "The usual mistake is to assume that the whole team shares one reason and to apply one remedy to everyone, most often more training. Three people can stay away from the same tool for three different reasons, and a training session helps only the one who was never shown. The other two sit through it and go back to the old route.",
            "The better habit is to ask each person what stops them, write down what they actually say, and label it with one of the three reasons before you choose a remedy. When a comment could fit more than one reason, look for the words that decide it: a comparison of speed, a surprise about a feature, or a condition about other people.",
          ],
        },
      ],
      workedExample: {
        title: "Three comments about Bookings",
        inputLabel: "Three comments about Bookings",
        outputLabel: "The diagnosis",
        prompt:
          "1. 'I tried it once, but it took twenty minutes to set my hours, and the phone is two seconds.' 2. 'I didn't know it could send the reminder text for me.' 3. 'There's no point me using it if reception still writes appointments in the spreadsheet.'",
        output:
          "Comment 1: Quicker the old way. Remedy: pre-set each adviser's hours. Comment 2: Nobody showed them. Remedy: ten minutes on a real appointment, including the reminder. Comment 3: Waiting on someone else. Remedy: reception and advisers switch on the same Monday, and the spreadsheet closes that day.",
        reading: [
          "The office manager collected these comments by asking three advisers why they still take bookings by phone. The first compares the time each route takes, which is the sign of Quicker the old way. The second is surprise about a feature, which is the sign of Nobody showed them.",
          "The third sets a condition about someone else, reception, which is the sign of Waiting on someone else. This adviser is right: booking in Bookings while reception writes in the spreadsheet would give the office two diaries that disagree.",
          "Three people have three different reasons, so one reminder email would have fixed none of them. The plan now needs pre-set hours for each adviser, a ten-minute session using a real appointment, and a single date on which reception stops using the spreadsheet.",
        ],
      },
      practice: {
        intro:
          "An IT coordinator at a housing association heard this comment about the new helpdesk: 'There's no point me logging requests in the helpdesk while the others still email me directly.' Choose the remedy that matches the reason. The three reasons and their remedies are in the sections above.",
        check: {
          kind: "choose",
          prompt: "Choose the remedy that answers the reason behind this comment.",
          leftLabel: "Remedy A",
          left: "Pick one Monday on which every request, from every sender, goes through the helpdesk, and from that day reply to emailed requests with the helpdesk link.",
          rightLabel: "Remedy B",
          right: "Run a one-hour training session showing every feature of the helpdesk to the whole team.",
          correct: "left",
          why: "The comment sets a condition about other people, which is Waiting on someone else. Remedy A moves the whole handoff on one date, so nobody is left logging requests alone.",
          wrong:
            "Look again at the comment. The speaker knows how to use the helpdesk and objects only because colleagues still email, which is Waiting on someone else. Training answers Nobody showed them, so Remedy A, one date for the whole handoff, is the one that fits.",
        },
      },
      check: {
        kind: "scenario",
        prompt: "A team lead collected these three comments about a shared task board. Choose the reason behind each comment.",
        passMark: 3,
        questions: [
          {
            id: "others",
            situation:
              "Marcus Bell leads a six-person facilities team at Orchard Lane Housing. The team moved its tasks to a shared board in Planner three weeks ago, and one of the caretakers said this when Marcus asked why his tasks were not on it.",
            question: "\"I'll move my tasks over when the others do; right now I'd just be updating it for myself.\" Which reason is behind this comment?",
            options: [
              {
                id: "quicker",
                text: "Quicker the old way",
                feedback:
                  "The speaker has not said the board is slow. They said it is pointless while others stay behind, which is Waiting on someone else, and the remedy is to move the whole handoff at once.",
              },
              {
                id: "showed",
                text: "Nobody showed them",
                feedback:
                  "The speaker knows how to use the board. What stops them is that colleagues are not on it, which is Waiting on someone else, so a training session would not change anything.",
              },
              {
                id: "waiting",
                text: "Waiting on someone else",
                correct: true,
                feedback:
                  "The speaker depends on colleagues who have not moved, so the remedy is to move the whole handoff at once, on one date.",
              },
            ],
          },
          {
            id: "slower",
            situation:
              "Another caretaker on Marcus's team, Jen Okoye, has used the board a few times and then stopped. She logs about ten small repair jobs a day.",
            question: "\"Typing it into the board takes me longer than sending a quick message.\" Which reason is behind this comment?",
            options: [
              {
                id: "quicker",
                text: "Quicker the old way",
                correct: true,
                feedback:
                  "The complaint is about time on the first attempts, so a template that removes the set-up will help more than any reminder.",
              },
              {
                id: "showed",
                text: "Nobody showed them",
                feedback:
                  "The speaker can use the board and finds it slower. That is the cost of the first few times, which the lesson called Quicker the old way, and a ready-made template is the remedy.",
              },
              {
                id: "waiting",
                text: "Waiting on someone else",
                feedback:
                  "Nothing here mentions colleagues. The speaker compares their own time on the two routes, which is Quicker the old way.",
              },
            ],
          },
          {
            id: "reminder",
            situation:
              "The newest member of the team, Sam Hurst, joined after the board was introduced and was given a login on his first day. He still keeps a paper list in his van.",
            question: "\"I didn't realise I could get a reminder when something is due.\" Which reason is behind this comment?",
            options: [
              {
                id: "quicker",
                text: "Quicker the old way",
                feedback:
                  "The speaker has not compared speeds. They did not know the feature existed, which means Nobody showed them.",
              },
              {
                id: "showed",
                text: "Nobody showed them",
                correct: true,
                feedback:
                  "The speaker was never shown the part that would help with their own work, so ten minutes on their own case is the remedy.",
              },
              {
                id: "waiting",
                text: "Waiting on someone else",
                feedback:
                  "No colleague is mentioned. The gap is knowledge of a feature, which means Nobody showed them.",
              },
            ],
          },
        ],
        why: "Each comment carried its own reason: a condition about colleagues, a comparison of speed, and surprise about a feature. Marcus now needs three different remedies, not one announcement.",
      },
      bridge:
        "You now have three jobs and the reason behind each, and the next lesson shows you what a plan must contain by repairing a weak one.",
    },
    {
      id: "repair-a-30-day-plan",
      title: "Repair a 30-day plan",
      emphasis: "Repair",
      place:
        "This lesson prepares you for the final module. You practise on someone else's plan before you write your own, because the gaps are easier to see in work you did not write.",
      sections: [
        {
          heading: "Seven parts in every row",
          paragraphs: [
            "A 30-day plan, in this course, is one row for each job, and every row has seven parts. The first is the job, with how it is done now. The second is the tool and the feature that will carry it. The third is the owner, one named person with a role. The fourth is the reason people opted out, using the three reasons from the last lesson, and the remedy that goes with it.",
            "The fifth part is the first action, with a day in week one. The sixth is what stops: the old route that ends, and when. The seventh is the sign in the work, which is what you expect to see in the work itself in week four. A row with all seven parts can be handed to someone who was not in the room, and they can carry it out without asking you what you meant.",
          ],
        },
        {
          heading: "What a plan is not",
          paragraphs: [
            "A 30-day plan is not a wish list. 'Use Forms for holiday requests' names a tool and a job, and nothing else, so it cannot fail and cannot succeed. It is also not a training schedule, because training answers only one of the three reasons people opt out, and a plan that is all training leaves the other two untouched.",
            "The owner must be one person. 'Everyone' and 'the team' are not owners, because when the first action slips there is nobody to ask. The owner does not have to do every step. They are the person who notices when the row is off course and who has the standing to put it right.",
          ],
        },
        {
          heading: "The two parts most often missing",
          paragraphs: [
            "The first part most often missing is what stops. If the old spreadsheet stays open, or emailed requests are still accepted, the team will keep using them, because the old route is always quicker at first. What stops names the old route and the day it ends, for example the day the sheet is made read-only or the day emailed requests are sent back with a link to the form.",
            "The second is the sign in the work. It must be something you could see in the work itself, such as appointments appearing in Bookings instead of the spreadsheet, or every holiday request for the month sitting in the response sheet. A count of logins is not a sign in the work, because a person can log in and still do the job elsewhere. A sense that people like the tool is not a sign either, because it cannot be checked.",
          ],
          beforeAfter: {
            before: "Sign in the work: more people using Planner.",
            after:
              "Sign in the work: in week four, every item on the month-end checklist is a card in Planner with a named person, and the Word checklist has not been emailed.",
            reading:
              "The first line is a usage measure that could rise while the Word document still goes round. The second describes what you would find in the work in week four, and anyone could check it.",
          },
        },
        {
          heading: "Repair the row, do not rewrite the job",
          paragraphs: [
            "When a plan row is weak, keep the job and the tool it already names, and add the parts that are missing. The person who wrote it has usually chosen a sensible job, and replacing it with a different one throws away the conversation that led to it. The repair is to make the row followable, not to change what it is about.",
            "Read the repaired row as a manager would. For each part, ask whether a stranger could act on it on Monday. If a part would make them ask who, when, or how they would know, it still needs work.",
          ],
        },
      ],
      workedExample: {
        title: "Repairing the holiday requests row",
        inputLabel: "The weak row",
        outputLabel: "The repaired row",
        prompt: "Holiday requests: use Forms. Tell the team at the next meeting. Should be easier for everyone.",
        output:
          "Job: holiday requests, currently emailed to Priya. Tool and feature: Microsoft Forms with a response spreadsheet. Owner: Priya Shah, office manager. Reason and remedy: Nobody showed them, so a ten-minute walkthrough at the Monday meeting using a real request. First action: Priya builds the form by Friday of week one. What stops: from the first of next month, emailed requests are sent back with the form link. Sign in the work: in week four, every request for the month is in the response sheet and none is in Priya's inbox.",
        reading: [
          "The weak row had a tool and a hope. 'Tell the team at the next meeting' is an announcement, which the last lesson showed does not answer any of the three reasons, and 'should be easier for everyone' cannot be checked by anyone.",
          "The repaired row keeps the job and the tool, and adds the five parts that were missing. It names Priya as owner, gives the reason and its matching remedy, and puts the first action on a named day in week one.",
          "The last two parts are the ones that make the row work. Emailed requests are sent back from a named date, so the old route closes. In week four, anyone can open the response sheet and Priya's inbox and see whether the job has moved.",
        ],
      },
      practice: {
        intro:
          "Here is a plan row with the job, the tool, the owner, the reason, and the first action filled in. Write the two parts that are most often missing. The section above on those two parts will help.",
        check: {
          kind: "build",
          prompt: "Fill in what stops and the sign in the work for this plan row.",
          material: {
            label: "The plan row so far",
            text: "Job: room bookings for the two meeting rooms, currently written in the paper diary at reception. Tool and feature: Outlook room calendars. Owner: Dean Walsh, receptionist. Reason and remedy: Waiting on someone else, so every team switches on the same Monday. First action: Dean sets up both room calendars by Tuesday of week one.",
          },
          fields: [
            {
              id: "stops",
              label: "What stops",
              hint: "The old route that ends, and the day it ends.",
              min: 12,
              any: STOP_WORDS,
              missing:
                "What stops does not yet end the old route. Say that the paper diary stops, is closed, or is removed, and on which day.",
            },
            {
              id: "sign",
              label: "Sign in the work",
              hint: "What you will see in the work itself in week four.",
              min: 16,
              any: WEEK_FOUR_WORDS,
              missing:
                "The sign in the work does not say what you will see in week four. Describe what you would find in the room calendars or the diary in week four.",
            },
          ],
          why: "That is right. The row now closes the paper diary on a named day, and says what anyone could find in the room calendars in week four.",
        },
      },
      check: {
        kind: "edit",
        prompt:
          "Edit this plan row so that a manager could follow it without asking you anything. Keep the job and the tool, and add every part that is missing.",
        label: "The plan row you are repairing",
        start:
          "Job: the weekly stock order. Tool: the shared Excel file in SharePoint. Everyone will try to use it. Hopefully fewer mistakes.",
        unchanged:
          "You have not changed the row yet. Add an owner with a role, a first action with a day in week one, what stops, and what you will see in the work in week four.",
        limitWording: false,
        keep: [
          {
            id: "job",
            any: ["stock order"],
            missing: "Keep the job. The row should still say that it is about the weekly stock order.",
          },
          {
            id: "tool",
            any: ["excel", "sharepoint"],
            missing: "Keep the tool. The row should still name the shared Excel file in SharePoint.",
          },
        ],
        limits: [
          {
            id: "owner",
            any: ROLE_WORDS,
            missing:
              "The row still does not say who owns it. 'Everyone' is not an owner; name one person and their role, for example Tomasz Nowak, warehouse supervisor.",
          },
          {
            id: "first",
            any: WEEK_ONE_WORDS,
            missing: "The row does not yet say what happens first, or by which day in week one.",
          },
          {
            id: "stops",
            any: STOP_WORDS,
            missing:
              "The row does not say which old route stops. If the emailed order still works, people will keep using it.",
          },
          {
            id: "sign",
            any: WEEK_FOUR_WORDS,
            missing:
              "'Fewer mistakes' or 'more people using it' is not something you can see in the work. Say what you expect to find in the stock file in week four.",
          },
        ],
        why: "The row now names who owns it, what happens first and when, which old route stops, and what you will see in the work in week four.",
        result: {
          label: "A repaired row a manager could follow",
          text: "Job: the weekly stock order, currently emailed to the supplier by whoever remembers. Tool and feature: the shared Excel file in SharePoint, with one tab per week. Owner: Tomasz Nowak, warehouse supervisor. Reason and remedy: Quicker the old way, so Tomasz builds a ready-made order tab. First action: Tomasz sets up the tab by Wednesday of week one. What stops: from Monday of week two, emailed orders are sent back with the file link. Sign in the work: in week four, every order for that week is in the shared file and none is in the ordering inbox.",
        },
      },
      bridge:
        "You have repaired someone else's plan. Before you write your own, the next lesson puts the whole method to work on situations you have not seen.",
    },
    {
      id: "put-the-method-to-work",
      title: "Put the method to work",
      emphasis: "method",
      place:
        "This is the course assessment. It recaps the method from the first five lessons, works one mixed example, and then asks you to apply it across seven new situations before you write your own plan.",
      sections: [
        {
          heading: "From licence to job, and from list to inventory",
          paragraphs: [
            "The method starts from the work, not from the software. A licence is the right to use a tool, and it is paid for whether anyone uses it or not. A tool is In use for a job only when you can name the job, the person who does it, and the last week it happened inside the tool. When you cannot, the tool is Paid for, no job named, however many people have an account.",
            "The inventory puts that test into a table. Each licensed tool gets one row and four columns: the tool, who holds a licence, the job it is in use for, and the nearby job still done somewhere else. The finance list gives you the first two columns, and conversations with the people who do the work give you the other two. The fourth column is where the value you have already paid for is waiting.",
          ],
        },
        {
          heading: "From inventory to three jobs",
          paragraphs: [
            "Not every nearby job belongs in the plan. A job is Worth moving when it repeats at least weekly, involves more than one person or a handoff, can be done by a tool already in your inventory, and would be cheap to put right if the change went wrong. If any of those fails, the job is Not now, and you write one sentence saying which test it failed.",
            "Three jobs is enough for the team to feel a difference in a normal week and few enough to support properly for a month. The jobs most visible to senior people, such as the annual budget or the quarterly board pack, usually fail the first test, and a plan built on them stalls.",
          ],
        },
        {
          heading: "From three jobs to a plan that holds",
          paragraphs: [
            "Before you plan, find out why each job has stayed outside the tool. Quicker the old way is answered with a ready-made template, Nobody showed them with ten minutes on the person's own case, and Waiting on someone else with moving the whole handoff on the same day. One announcement answers none of them.",
            "The plan itself gives each job one row with seven parts: the job, the tool and feature, the owner, the reason and remedy, the first action with a day in week one, what stops, and the sign in the work in week four. The two parts most often missing are what stops and the sign in the work, and the sign must be something you can see in the work, never a count of logins or a feeling.",
          ],
        },
      ],
      workedExample: {
        title: "One team, the whole method",
        inputLabel: "The situation",
        outputLabel: "The decisions",
        prompt:
          "Hollis & Grant is a nine-person lettings agency on Google Workspace. Viewings are booked by phone and written in a paper diary. Landlord statements are emailed monthly as attachments. The directors want the annual rent review redone in a new property system. The lettings negotiators say: 'I'll use the calendar when the office does.'",
        output:
          "Inventory: Google Calendar is in use for internal meetings; nearby job still done elsewhere is viewing bookings in the paper diary. Viewings: Worth moving, because they repeat daily, pass between the office and the negotiators, and Calendar is already paid for. Rent review: Not now, because it is annual and needs a new purchase. Reason for viewings: Waiting on someone else. Remedy: the office and all negotiators switch to the shared viewings calendar on the same Monday, and the paper diary is removed from the desk that day.",
        reading: [
          "The office manager began with the work. Google Calendar is in use for a job, internal meetings, and the nearby job is viewing bookings written in a paper diary a few feet away.",
          "The four tests sorted the candidates. Viewings pass all four. The rent review fails two, because it happens once a year and needs a system the agency does not own, so it waits for another conversation.",
          "The negotiators' comment is a condition about the office, which is Waiting on someone else, so the remedy is one date for the whole handoff. The office manager can now write the viewings row with an owner, a first action, the day the diary goes, and a sign in week four.",
        ],
      },
      practice: {
        intro:
          "Before the assessment, choose between two sign lines for the Hollis & Grant viewings row. The section on the plan above says what a sign in the work must be.",
        check: {
          kind: "choose",
          prompt: "Choose the sign in the work that a manager could check in week four.",
          leftLabel: "Sign A",
          left: "Sign in the work: by week four, every negotiator has logged in to Google Calendar at least once a day.",
          rightLabel: "Sign B",
          right:
            "Sign in the work: in week four, every viewing booked that week appears in the shared viewings calendar, and the paper diary is not on the desk.",
          correct: "right",
          why: "Sign B describes what anyone could find in the work in week four: the viewings in the calendar and the diary gone. Sign A is a count of logins, which could be met while viewings still go in the diary.",
          wrong:
            "Look again at Sign A. A daily login is a count of logins, and a negotiator could log in every day and still write viewings in the paper diary. Sign B says what you would see in the work itself.",
        },
      },
      check: {
        kind: "scenario",
        prompt:
          "Seven situations from different teams follow. Choose the best move in each. You need six of the seven to pass.",
        passMark: 6,
        questions: [
          {
            id: "renewal",
            situation:
              "Dev Mistry is operations manager at Harrow & Vale Surveyors, an eighteen-person practice. Their Microsoft 365 renewal is due in six weeks, and the usage report shows that all eighteen staff logged in to Teams last month. A director asks Dev whether the Teams Premium add-on is earning its keep.",
            question: "What should Dev do first?",
            options: [
              {
                id: "logins",
                text: "Tell the director that it is, because every member of staff logged in last month.",
                feedback:
                  "A login is not a job. Staff can open Teams every day and still do the work elsewhere, so the report does not answer the question. Dev needs to name the jobs done inside the add-on, who does them, and when they last happened.",
              },
              {
                id: "jobs",
                text: "List the jobs that happen inside the add-on, with who does each one and the last week it happened, and label each as In use for a job or Paid for, no job named.",
                correct: true,
                feedback:
                  "That applies the test from the first lesson. The director gets an answer in terms of work, and any feature marked Paid for, no job named becomes a question for the renewal.",
              },
              {
                id: "cancel",
                text: "Recommend cancelling the add-on, because nobody has mentioned using it.",
                feedback:
                  "Silence is not evidence either way. Dev may find a job that depends on it, or a nearby job it could carry. The first move is to find out where the work happens.",
              },
              {
                id: "survey",
                text: "Send a staff survey asking how much people like Teams Premium.",
                feedback:
                  "A liking score is an opinion, not a job. It will not tell Dev which work happens inside the add-on or what would stop if it went.",
              },
            ],
          },
          {
            id: "inventory",
            situation:
              "Nadia Farouk, office manager at Calder Dental, has the finance list of nine subscriptions and a licence export from the Microsoft 365 admin centre. She has filled in the tool and who holds each licence. She has an hour before the practice meeting.",
            question: "What should she spend the hour on?",
            options: [
              {
                id: "features",
                text: "Copying each vendor's feature list into the table so the team can see what is possible.",
                feedback:
                  "A feature list tells you what is possible, not what is happening. The inventory needs the job each tool carries and the nearby job still done elsewhere, which come from the people who do the work.",
              },
              {
                id: "cost",
                text: "Adding the cost per licence so the meeting can see which tools are most expensive.",
                feedback:
                  "Cost is useful at the renewal, but finance already has it. It tells you nothing about where the work happens, which is what the inventory is for.",
              },
              {
                id: "nearby",
                text: "Asking the reception and nursing leads what they did last week and where, to fill in the job each tool carries and the nearby job still done elsewhere.",
                correct: true,
                feedback:
                  "That fills the third and fourth columns, which no report can give. The nearby job still done elsewhere is where the practice's three jobs will come from.",
              },
            ],
          },
          {
            id: "choose-three",
            situation:
              "Aisha Rahman leads the customer service team at Penrose Logistics. Her inventory lists five nearby jobs: daily delivery exceptions emailed between three depots, weekly driver rotas in a Word file, a new warehouse system the directors want, the annual customer survey, and weekly returns logged on paper. The team already pays for Microsoft 365.",
            question: "Which three should Aisha put in her plan?",
            options: [
              {
                id: "weekly",
                text: "The delivery exceptions, the driver rotas, and the returns log, because each repeats at least weekly, passes between people, and fits a tool the team already pays for.",
                correct: true,
                feedback:
                  "All three pass the four tests. The warehouse system needs a new purchase and the survey comes once a year, so both are Not now, each with its reason written beside it.",
              },
              {
                id: "visible",
                text: "The warehouse system, the customer survey, and the delivery exceptions, because those are the jobs the directors notice.",
                feedback:
                  "The warehouse system needs a new purchase and the survey comes once a year, so both fail the tests. A plan built on them would stall, however visible they are.",
              },
              {
                id: "all",
                text: "All five at once, so the team sees the full ambition.",
                feedback:
                  "Five jobs spread the support too thin, and two of them fail the tests. Three weekly jobs are enough for the team to feel the change and few enough to support for a month.",
              },
              {
                id: "hardest",
                text: "Only the warehouse system, because it is the team's biggest problem.",
                feedback:
                  "The biggest problem usually needs a project and a budget. This course is about repeating jobs in licences you already hold, so the warehouse system is Not now.",
              },
            ],
          },
          {
            id: "timesheets",
            situation:
              "Owen Pryce, operations manager at Westbrook Electrical, moved engineers' weekly timesheets to a Microsoft Form a month ago. Most engineers still hand in paper. One says: 'There's no point filling in the form while the office still types up the paper ones every Friday.'",
            question: "Which remedy should Owen choose?",
            options: [
              {
                id: "reminder",
                text: "Send all engineers a reminder that the form is now the way to submit timesheets.",
                feedback:
                  "A reminder answers none of the three reasons, and the engineer has told Owen the real one: the office still accepts paper. That is Waiting on someone else.",
              },
              {
                id: "training",
                text: "Run a ten-minute session on the form for each engineer using their own week.",
                feedback:
                  "That is the remedy for Nobody showed them. This engineer knows the form and is waiting on the office, so a session would not change what happens on Friday.",
              },
              {
                id: "template",
                text: "Pre-fill the form with each engineer's usual jobs so it takes seconds.",
                feedback:
                  "That is the remedy for Quicker the old way. The engineer has not said the form is slow; they have said the office still types up paper, which is Waiting on someone else.",
              },
              {
                id: "same-day",
                text: "Choose one Friday from which the office stops typing up paper timesheets and every engineer uses the form, and tell everyone the date.",
                correct: true,
                feedback:
                  "The comment is a condition about the office, which is Waiting on someone else. Moving the whole handoff on one date removes the reason to stay on paper.",
              },
            ],
          },
          {
            id: "job-cards",
            situation:
              "Lucy Tran runs a small print shop, Tran & Co. Her two print operators were shown Planner in a team session last month. One says: 'It takes me ten minutes to set up each job card in Planner, and a sticky note takes ten seconds.'",
            question: "Which remedy fits this comment?",
            options: [
              {
                id: "template",
                text: "Build a ready-made job card template in Planner with the usual fields already filled in.",
                correct: true,
                feedback:
                  "The operator is comparing the time each route takes, which is Quicker the old way. A template removes the set-up cost, so the first card takes seconds.",
              },
              {
                id: "training",
                text: "Book another team session to go through Planner's features again.",
                feedback:
                  "The operator was shown Planner and knows how to use it. The complaint is speed, which is Quicker the old way, so a template helps where another session would not.",
              },
              {
                id: "same-day",
                text: "Set a date on which both operators must switch to Planner together.",
                feedback:
                  "That is the remedy for Waiting on someone else. This operator is not waiting on a colleague; they find the set-up slow, which is Quicker the old way.",
              },
            ],
          },
          {
            id: "what-stops",
            situation:
              "Grace Adebayo, finance manager at Linden Care, is reviewing a plan row from her team: 'Job: purchase order approvals, currently emailed to Grace. Tool and feature: Power Automate approvals. Owner: Kai Morton, finance assistant. Reason and remedy: Nobody showed them, so ten minutes each on a real order. First action: Kai builds the flow by Thursday of week one. Sign in the work: in week four, every purchase order is in the approvals history.'",
            question: "Which part should Grace ask the team to add before she signs it off?",
            options: [
              {
                id: "training",
                text: "A second training date, in case anyone misses the first.",
                feedback:
                  "The remedy is already there. What the row lacks is an end to the old route, so emailed approvals would carry on beside the new flow.",
              },
              {
                id: "stops",
                text: "What stops: the date from which emailed purchase orders are sent back with the link to the approvals flow.",
                correct: true,
                feedback:
                  "The row has six of the seven parts and is missing what stops. Without it, emailing Grace stays open and remains the quicker route.",
              },
              {
                id: "logins",
                text: "A target that every budget holder logs in to Power Automate each week.",
                feedback:
                  "A login target is a count of logins, which is not a sign in the work. The part the row is missing is what stops.",
              },
              {
                id: "tool",
                text: "A second tool as a fallback in case Power Automate does not work out.",
                feedback:
                  "A fallback tool gives people another route to use. The row needs the old route to close, which is what stops.",
              },
            ],
          },
          {
            id: "sign",
            situation:
              "Rhys Morgan, practice manager at Beacon Physiotherapy, is moving new patient referrals from a shared inbox into a SharePoint list. He needs one line for the sign in the work before the plan goes to the clinical lead.",
            question: "Which line should he write?",
            options: [
              {
                id: "logins",
                text: "In week four, the SharePoint usage report shows activity from every clinician.",
                feedback:
                  "Activity in the usage report is a measure of usage alone. Clinicians could open the list and still take referrals from the inbox. Say what you would find in the work.",
              },
              {
                id: "liked",
                text: "In week four, the clinicians say in the team meeting that the list is easier.",
                feedback:
                  "A sense that people like the tool cannot be checked in the work. The sign should describe where the referrals are in week four.",
              },
              {
                id: "work",
                text: "In week four, every new referral received that week is an item in the SharePoint list with a clinician assigned, and none is waiting in the shared inbox.",
                correct: true,
                feedback:
                  "That is something the clinical lead could open and check in week four. It describes the work itself, not a count or a feeling.",
              },
              {
                id: "vendor",
                text: "In week four, Microsoft's adoption dashboard shows the practice's use of SharePoint has gone up.",
                feedback:
                  "A dashboard showing more use is still a measure of usage. It does not tell Rhys whether the referrals moved, which is what the sign must show.",
              },
            ],
          },
        ],
        why: "You applied the whole method: the licence test, the inventory, the four tests for a job, the three reasons and their remedies, and the parts of a plan row that are most often missing.",
      },
      bridge:
        "You have used every part of the method on situations you had not seen. In the last lesson you write your own 30-day plan for your three jobs, and that plan is what your record will show.",
    },
    {
      id: "your-30-day-plan",
      title: "Your 30-day plan",
      emphasis: "plan",
      place:
        "This is the final lesson and the final module of the course. The plan you write here is the work your signed record will show.",
      sections: [
        {
          heading: "Three rows, seven parts each",
          paragraphs: [
            "Your plan has three rows, one for each job you chose with the four tests in the third lesson. Each row has the seven parts from the fifth lesson: the job, the tool and feature, the owner, the reason and remedy, the first action, what stops, and the sign in the work. You have already done most of the thinking, and this lesson puts it into a form someone else can use.",
            "Write each row for the person who will actually carry it out. That person may not be you, and they were not in this course, so they do not know what Quicker the old way means unless the remedy beside it makes the step plain. If a part would make them ask who, when, or how they would know, rewrite it.",
          ],
        },
        {
          heading: "What the plan is not",
          paragraphs: [
            "The plan is not a proposal to buy anything. Every tool it names must already appear in your inventory, because the point of the course is to put licences you already pay for to work. If you find yourself naming a product the team does not own, that job belongs on your Not now list.",
            "The plan is also not a record of anything confidential. The record can be opened by anyone with the reference, so use roles and first names you would be comfortable showing, or realistic substitutes that keep the same shape. The structure of the plan is what the record shows, and the structure is what a verifier cares about.",
          ],
        },
        {
          heading: "How the plan is checked",
          paragraphs: [
            "When you continue, each part of each row is checked for the thing it must contain. The job must say how often it comes round. The tool must be named as a product. The owner must name a person with a role, such as manager, lead, or coordinator. The reason must be one of the three from the fourth lesson, followed by its remedy.",
            "The first action must carry a day or a date. What stops must say that the old route stops, closes, or is made read-only. The sign in the work must say what you will see in week four. If any part falls short, the note names the row and the part, and you can change it and try again.",
          ],
        },
        {
          heading: "Read it once as your manager would",
          paragraphs: [
            "When you have written all three rows, read the plan once as your manager would, and ask whether each row could be followed on Monday without a question. The checks in this lesson catch a missing part, but they cannot tell whether your sign in the work is honest, so that last reading is yours to do.",
            "After the plan passes, you type your name to sign it. The record shows your name, the course, the date, and the three rows exactly as you wrote them. A sensible next step is to send each row to the owner you named, so that the first action happens in week one.",
          ],
        },
      ],
      workedExample: {
        title: "The appointments row from the office manager's plan",
        inputLabel: "The three chosen jobs",
        outputLabel: "The appointments row",
        prompt:
          "Client appointments, now booked by phone into Excel. Holiday requests, now emailed to Priya. The month-end checklist, now a Word document emailed round.",
        output:
          "Job: client appointment booking, now by phone into Excel, several times every day. Tool and feature: Microsoft Bookings with email confirmation. Owner: Hannah Price, reception lead. Reason and remedy: Waiting on someone else, so reception and all four advisers switch on the same Monday. First action: the reception lead sets each adviser's hours by Wednesday of week one. What stops: the appointments sheet is made read-only on the switch-over Monday. Sign in the work: in week four, every appointment for that week appears in Bookings and none appears in the old sheet.",
        reading: [
          "The office manager chose these three jobs in the third lesson and diagnosed them in the fourth. The appointments row brings those decisions together, and each of its seven parts can be checked by someone other than its author.",
          "The reason and the remedy match: the advisers were waiting on reception, so everyone switches on one Monday. The first action is small and dated, and it also removes the set-up cost that one adviser complained about.",
          "The last two parts close the row. The old sheet becomes read-only on a named day, and in week four anyone can open Bookings and the old sheet and see whether the job moved. That is what makes it a plan rather than an intention.",
        ],
      },
      practice: {
        intro:
          "Before you write your own plan, read these lines from a draft row and mark each one. You will apply the same test to every part of your own plan in a moment.",
        check: {
          kind: "mark",
          prompt: "Mark each line of this draft row as Ready to follow or as A manager would have to ask.",
          passLabel: "Ready to follow",
          failLabel: "A manager would have to ask",
          sentences: [
            {
              id: "owner",
              text: "Owner: the team.",
              fail: true,
              why: "The team is not an owner. Nobody can be asked what happened, so a manager would have to ask who owns the row.",
            },
            {
              id: "first",
              text: "First action: Kai Morton, finance assistant, builds the approvals flow by Thursday of week one.",
              fail: false,
              why: "The line names the person, the step, and the day in week one, so it is ready to follow.",
            },
            {
              id: "sign",
              text: "Sign in the work: people will be happier with the new process.",
              fail: true,
              why: "Happiness cannot be checked in the work. A manager would have to ask what they should look for in week four.",
            },
          ],
          why: "That is right. The first action is ready to follow, but 'the team' and 'people will be happier' would leave a manager asking who owns the row and what to look for in week four.",
        },
      },
      check: {
        kind: "build",
        prompt:
          "Write your 30-day plan for your three jobs. Each row must have all seven parts, so that a colleague or manager could follow it without asking you what you meant.",
        fields: [...planRow("row1", "one"), ...planRow("row2", "two"), ...planRow("row3", "three")],
        why: "Each row names a repeating job, a tool from your inventory, an owner, a remedy that matches the reason, a first action with a date, the route that stops, and a sign you could see in the work.",
      },
      bridge:
        "Your plan is ready to sign. Once you sign it, the record will show your three rows, the course, and the date, and the owners you named can start on their first actions this week.",
    },
  ],
};
