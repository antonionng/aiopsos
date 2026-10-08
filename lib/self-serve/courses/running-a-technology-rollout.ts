/*
Course: Running a Technology Rollout
Slug: running-a-technology-rollout
For: Project leads, operations managers and team leaders who have been asked to roll out a tool that has
  already been chosen, such as a booking system, a shared drive, a sign-in process or a reporting tool,
  across one team or several. They know what the tool is for and who will use it. They need no project
  management qualification and no technical knowledge of the tool.
Outcome: The learner can write success as a behaviour that can be seen in the work, put the groups in an
  order that learns, give each group an owner, a helper and three dates, plan a support window followed
  by a visible stop to the old way, and name the sign it stuck with the date and method of the check.
Artefact: The rollout sheet, one page for one tool, in five sections: The behaviour, The order of groups,
  Who and when, Support, then stop, and The sign it stuck.
Record sentence: Wrote and signed a rollout sheet for one tool that names the behaviour, the order of
  groups, an owner and dates for each, the support and the stop, and the sign it stuck.
Lessons (id, title, move, interaction, pass rule):
  1. the-behaviour, The behaviour, write success as a behaviour rather than an activity,
     practice choose, check mark ("A behaviour you can see" / "Only an activity"), every sentence marked correctly.
  2. the-order-of-a-rollout, The order of a rollout, sequence a rollout so each step learns from the last,
     practice choose, check order, the five steps in the taught sequence.
  3. who-and-when, Who and when, give each group an owner, a helper and three dates,
     practice mark ("Ready to run" / "Not ready"), check choose, the line with all five parts.
  4. support-then-stop, Support, then stop, plan a support window and a visible stop announced at the start,
     practice choose, check edit, the edit names a helper, dates, a back-up, a place for problems,
     a stop and the announcement.
  5. the-sign-it-stuck, The sign it stuck, choose evidence in the work weeks after the stop,
     practice choose, check mark ("A sign it stuck" / "A sign it launched"), every measure marked correctly.
  6. the-rollout-assessment, The rollout assessment, apply the whole method to new situations,
     practice choose, check scenario of eight questions, six correct to pass.
  7. your-rollout-sheet, Your rollout sheet, write the artefact,
     practice mark ("Ready to run" / "Not ready"), check build, each of five fields meets its keyword list
     and, where set, a concrete fact.
Sources: Microsoft Adoption guidance (adoption.microsoft.com); GOV.UK Service Manual on service phases
  and private beta; Jeffrey M. Hiatt, ADKAR (2006); John P. Kotter, Leading Change (1996).
Tested on phone:          no
Tested returning learner: no
Pass rule tests written:  yes
*/
import type { CourseContent } from "./types.ts";

const SEE = "A behaviour you can see";
const ACTIVITY = "Only an activity";
const READY = "Ready to run";
const NOT_READY = "Not ready";
const STUCK = "A sign it stuck";
const LAUNCHED = "A sign it launched";

export const COURSE: CourseContent = {
  slug: "running-a-technology-rollout",
  hours: 2,
  artefact: {
    lessonId: "your-rollout-sheet",
    title: "The rollout sheet",
    recordLine:
      "Wrote and signed a rollout sheet for one tool that names the behaviour, the order of groups, an owner and dates for each, the support and the stop, and the sign it stuck.",
  },
  lessons: [
    {
      id: "the-behaviour",
      title: "The behaviour",
      emphasis: "behaviour",
      place:
        "This is the first of seven lessons, and it covers the first module of the course. It sets the definition of success that every other part of your rollout sheet will be measured against.",
      sections: [
        {
          heading: "What a rollout is for",
          paragraphs: [
            "A rollout is the work of moving people from the way they do a task now to the way the new tool expects. The tool has usually been chosen before you are asked to run it, and the contract has often been signed. What is left is the part that decides whether the money was well spent: whether people at reception, in the warehouse or on the finance team do a piece of their work differently, and keep doing it once everyone's attention has moved to the next project.",
            "That is why this course starts with the change in the work rather than with the tool. A new booking system that nobody books through is an expensive screen. A shared drive that people copy files to once a quarter, while the real work stays on their desktops, has changed nothing. The rollout is finished when the work has changed and has stayed changed, and not before.",
          ],
        },
        {
          heading: "A behaviour you can see",
          paragraphs: [
            "The phrase this course uses for a good definition of success is A behaviour you can see. It is a sentence that describes the change in the work, and it says who does it and when. 'Every visitor is signed in on the tablet at reception before they are given a badge' is a behaviour you can see. You could stand in reception on a Wednesday morning and watch whether it is true.",
            "The strongest behaviour sentences also name what will have disappeared. If visitors are signed in on the tablet, the paper visitor book should no longer be on the desk. The thing that disappears is often the easiest part to check, because its absence is obvious to anyone who walks past, and because people cannot quietly carry on with an old way that is no longer there.",
          ],
          beforeAfter: {
            before: "Staff will use the new room booking tool.",
            after:
              "From 1 September, staff book every meeting room through the tool before they use it, and the paper sheets are no longer on the doors.",
            reading:
              "The first version could be true of someone who opened the tool once. The second says who does what, from when, and what will have gone, so you could walk the corridor and see whether it has happened.",
          },
        },
        {
          heading: "Only an activity",
          paragraphs: [
            "The other label is Only an activity. It is a sentence about the rollout itself rather than about the work: 'the training sessions are held', 'the tool is live', 'all reception staff are trained', 'the tablets are installed at five sites'. Each of these can be completed, ticked off and reported to a steering group while every visitor still signs the paper book.",
            "Activities are not wrong. A rollout sheet will list many of them, and without training sessions and installed tablets nothing would change. The point is where they sit. Success is written first, as a behaviour, and every activity on the sheet is there because it serves that behaviour. When an activity does not serve the behaviour, it is a candidate to drop.",
          ],
        },
        {
          heading: "The mistake people usually make",
          paragraphs: [
            "The usual mistake is to copy the vendor's or the sponsor's definition of success, which is almost always a go-live date and a training count. These are the things a supplier controls and can report on, so they appear in every implementation plan. They are also the things that can be finished without the work changing at all.",
            "The test is simple and worth applying to every success sentence you are given. Picture the worst realistic outcome: the tool is switched on, everyone has been trained, and people are still doing the job the old way. If the sentence would still count as met, it is only an activity, and you need to rewrite it as a behaviour you can see.",
          ],
        },
      ],
      workedExample: {
        title: "Rewriting the objective for a visitor system",
        inputLabel: "The objective in the rollout brief",
        prompt:
          "Successfully deploy the visitor system across all five sites by the end of Q2, with all reception staff trained.",
        outputLabel: "The rollout lead's rewrite",
        output:
          "By the end of June, at all five sites, every visitor is signed in on the tablet before they are given a badge, and the paper visitor book is no longer at reception.",
        reading: [
          "The original objective has two parts, a deployment and a training count, and both are activities. It could be met in full with every tablet switched off and every visitor still signing the paper book.",
          "The rewrite names who is affected, which is every visitor at all five sites, and the moment the behaviour happens, which is before they are given a badge. It turns 'end of Q2' into a month that everyone at the sites understands.",
          "The last clause names what will have disappeared. A rollout lead, or a site manager, can check whether the paper book is still at reception in a few seconds, which makes the objective easy to test on any given day.",
        ],
      },
      practice: {
        intro:
          "Here are two success sentences for a new shift rota app at a care home group. Use the test from the last section: if the tool were live and nobody had changed how they worked, would the sentence still be met. The definitions are above if you want them.",
        check: {
          kind: "choose",
          prompt: "Choose the sentence that describes a behaviour you can see.",
          leftLabel: "Sentence A",
          left: "From 3 March, every shift swap at the four homes is requested and approved in the rota app, and the printed rota on the staff room wall is no longer updated by hand.",
          rightLabel: "Sentence B",
          right: "The rota app is live at all four homes by 3 March, and every senior carer has completed the two-hour training module.",
          correct: "left",
          why: "Sentence A is a behaviour you can see. It says who does what, from when, and it names the printed rota that will stop being updated, which any manager could check on a walk round. Sentence B is only an activity, because the app could be live and the training complete while swaps are still agreed on the wall.",
          wrong:
            "Look again at Sentence B. A live app and a finished training module are both activities, and both could be true while every swap is still written on the wall by hand. Sentence A describes the change in the work and what will disappear, so it is a behaviour you can see.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "These four sentences come from a rollout plan for a new room booking tool. Mark each sentence with the label it deserves.",
        passLabel: SEE,
        failLabel: ACTIVITY,
        sentences: [
          {
            id: "live",
            text: "The booking tool will be live on 1 September.",
            fail: true,
            why: "Being live says nothing about how people book rooms, and they could still use the paper sheets. It is only an activity.",
          },
          {
            id: "sheets",
            text: "Staff book every meeting room through the tool before they use it, and the paper sheets are gone from the doors.",
            fail: false,
            why: "Walk past the rooms in your head. You could see whether this is true, so it is a behaviour you can see.",
          },
          {
            id: "training",
            text: "Two training sessions will be held for each floor.",
            fail: true,
            why: "The sessions could all be held and nobody change how they book. Training serves the behaviour, but it is only an activity.",
          },
          {
            id: "reception",
            text: "Reception checks the tool, not the sheets, when someone asks whether a room is free.",
            fail: false,
            why: "This describes a person doing their work differently, which you could observe at the desk. It is a behaviour you can see.",
          },
        ],
        why: "That is the right reading. Going live and holding training are steps in the rollout that could finish without anyone changing how they book, while booking through the tool and reception checking it are changes in the work you could watch happen.",
      },
      bridge:
        "With the behaviour defined, the next lesson puts the rollout in the order that gives that behaviour the best chance of taking hold.",
    },
    {
      id: "the-order-of-a-rollout",
      title: "The order of a rollout",
      emphasis: "order",
      place:
        "This lesson expands the second module of the course. The order in which a rollout happens is the skill here, so the check at the end asks you to put the steps in sequence yourself.",
      sections: [
        {
          heading: "Everywhere at once finds every problem at once",
          paragraphs: [
            "A rollout that starts in every team on the same Monday finds every problem on that Monday. The badge printer jams at five sites instead of one. The contractors without email addresses are turned away at every reception. The helpdesk queue fills in an hour, and the people who could fix the problems are answering the phone instead. By Wednesday, the old way is back in use and the new tool has a reputation it will take months to shake off.",
            "Starting small is not caution for its own sake. A small first group meets the same problems the whole organisation would meet, but it meets them while there is time to fix them and while only one team is affected. The GOV.UK Service Manual describes the same idea for public services, where a private beta with a limited group comes before a wider release.",
          ],
        },
        {
          heading: "The five steps",
          paragraphs: [
            "A sound rollout follows five steps, and each one learns from the one before. First, a small group uses the tool on their real work for a short, fixed period. Second, the problems that group found are fixed, or a way round each one is written down. Third, the next group starts, with a named helper available to them, often someone from the first group who has already met the problems.",
            "Fourth, the old way is stopped for that group, on a date that was announced in advance. Fifth, you look for the sign that the behaviour has stuck in that group before the next group starts. Then the cycle repeats with the next group, which now benefits from everything the earlier groups found.",
          ],
        },
        {
          heading: "Why each step is where it is",
          paragraphs: [
            "Each step depends on the one before it. If you skip the fix, the next group meets exactly the problems the first group found, and the first group's time was wasted. If you stop the old way before a group has started on the new one, they have no way to do their job at all. If you check for the sign before the old way has stopped, the check cannot tell you anything, because people who prefer the old way are still using it.",
            "The first group matters more than any other. It should do the task every day, so that problems appear quickly, and it should have a manager who wants the change, so that problems are reported rather than hidden. A board, a steering group or the IT team rarely makes a good first group, because they do not do the work the tool is for.",
          ],
        },
        {
          heading: "What the order is not",
          paragraphs: [
            "The order is not a rigid timetable. A small team of eight people might go through all five steps in a week, while a hospital trust might take a quarter for each group. The length of each step changes with the size of the group and the weight of the change, but the sequence stays the same.",
            "The order is also not a reason for delay. The usual pressure is to go everywhere at once to meet a date set by a budget or a contract. A staged rollout often reaches the whole organisation sooner in practice, because it avoids the week in which everything fails together and the months spent recovering from it.",
          ],
        },
      ],
      workedExample: {
        title: "Re-ordering the visitor system plan",
        inputLabel: "The original rollout plan",
        prompt:
          "Week one: install tablets at all five sites and train all reception staff. Week two: go live everywhere.",
        outputLabel: "The revised plan",
        output:
          "Weeks one and two: the head office reception uses the tablet for every visitor, with the paper book as a back-up. Week three: fix the two problems head office found, a badge printer that jams and contractors who arrive without an email address. Weeks four and five: the two largest sites start, with the head office receptionist on call as helper. End of week five: the paper book is removed at head office and at the two sites. Week six: check the sign at those three sites before the last two start.",
        reading: [
          "Under the original plan, the jamming badge printer and the contractor problem would have hit all five sites on the same day, with nobody free to fix either.",
          "Under the revised plan, head office finds both problems in its first fortnight, and they are fixed in week three while only one site is affected. The two larger sites start with a helper who has already dealt with them.",
          "The paper book is removed only after each site has started and been supported, and the check comes after the removal. The last two sites wait until that check shows the behaviour has held, so they benefit from everything the first three learned.",
        ],
      },
      practice: {
        intro:
          "A property management firm, Ashby Lettings, is rolling out a new maintenance request tool to three teams. Here are two choices for the first group. Use the paragraph above on what makes a good first group.",
        check: {
          kind: "choose",
          prompt: "Choose the better first group for the rollout, and read the reason in the feedback.",
          leftLabel: "Group A",
          left: "The senior leadership team, because they approved the purchase and can set an example for everyone else.",
          rightLabel: "Group B",
          right: "The Harborne lettings team of six, because they log maintenance requests every day and their manager, Nadia, asked for the tool.",
          correct: "right",
          why: "Group B uses the tool on real work every day, so problems appear quickly, and it has a manager who wants the change, so problems will be reported. The leadership team rarely logs maintenance requests, so they would find very little before the next group starts.",
          wrong:
            "Look again at Group A. The leadership team approved the tool, but they do not log maintenance requests day to day, so they would meet few of the problems the other teams will meet. Group B does the work every day and has a manager who asked for the change.",
        },
      },
      check: {
        kind: "order",
        prompt:
          "Put these five steps of a rollout for a new expenses app at Delmore Engineering in the order you would actually do them.",
        steps: [
          { id: "sales-start", label: "The sales team starts, with a finance team member named as their helper" },
          { id: "check", label: "Check that every sales claim that month came through the app before the next team starts" },
          { id: "trial", label: "The finance team uses the app for their own claims for two weeks" },
          { id: "stop", label: "Paper claim forms stop being accepted from the sales team on the announced date" },
          { id: "fix", label: "Fix the problems the finance team found, or write down the way round them" },
        ],
        correct: ["trial", "fix", "sales-start", "stop", "check"],
        why: "Each step learns from the one before. A small group tries the app on real claims, the problems they found are fixed, the next group starts with help, the old way stops on the announced date, and you check the sign before moving on.",
        wrong:
          "Not that order yet. If the sales team starts before the fix, they meet the problems the finance team already found, so fix first and then widen. If paper forms stop before the sales team starts, they have no way to claim, so start them and support them before the stop. While paper forms are still accepted, a check cannot tell you whether the behaviour has changed, so the check comes after the stop.",
      },
      bridge:
        "Each group in that sequence needs someone who owns it and dates that everyone can see, which is the next lesson.",
    },
    {
      id: "who-and-when",
      title: "Who and when",
      emphasis: "when",
      place:
        "This lesson is the second module of the course. It fills the sequence from the last lesson with names and dates, so that the rollout can be run by the people in each group and checked by you.",
      sections: [
        {
          heading: "Three things against every group",
          paragraphs: [
            "Each group in the rollout needs three things written against it. The first is an owner, who is the person in that group responsible for the change happening there. The second is a helper, who is the person the group can ask when the tool does something unexpected. The third is a set of dates: one for the start, one for the old way stopping, and one for the check.",
            "This course calls a group line Ready to run when all three are present, and Not ready when any of them is missing. The test is whether the owner could read their line on a Monday morning and know what they are responsible for, who will help their people, and the three dates that matter, without asking you.",
          ],
          beforeAfter: {
            before: "Site B: April.",
            after:
              "Site B. Owner: Carla, site manager. Helper: Ben, head office receptionist, on call by phone in the first week. Start: 8 April. Paper book removed: 22 April. Check: 3 June.",
            reading:
              "The first line tells nobody what to do. The second tells Carla what she owns, who will help her team, and the three dates, so she could run her part of the rollout without a meeting.",
          },
        },
        {
          heading: "The owner is in the group",
          paragraphs: [
            "The owner belongs to the group, and is usually its manager. They decide who covers reception while a colleague learns the tablet, they notice when someone has gone back to the paper book, and they have the standing to ask them not to. Those are things only a person inside the team can do.",
            "The owner is not the rollout lead, who cannot be in every team at once, and not the vendor, who does not manage your staff and cannot tell anyone to change how they work. A line with the rollout lead or the supplier as owner is Not ready, however complete the dates are, because nobody in the group has agreed to make the change happen there.",
          ],
        },
        {
          heading: "The helper is a person",
          paragraphs: [
            "The helper is a named person whom the group can reach easily during the first weeks, with a stated way to reach them: at a desk at set times, on the phone, or in a Teams chat. The best helper is often someone from an earlier group, because they have met the same problems on the same kind of work and can answer in the group's own terms.",
            "A help centre, a service desk or 'IT' is not a helper. People will ask a colleague sitting nearby a question they would never raise as a ticket, and a question that is never asked becomes a reason to go back to the old way. Microsoft's public adoption guidance makes a similar point about champions, who are colleagues inside the teams rather than a central support function.",
          ],
        },
        {
          heading: "Three dates, not one",
          paragraphs: [
            "Most rollouts that drift have a start date for each group and nothing after it. The start is the date everyone remembers, because it is the one in the vendor's plan. The stop and the check are the dates that decide whether the change lasts, and they are the ones most often left blank.",
            "Write all three for every group, as calendar dates rather than months or phases. 'April' or 'Phase 2' cannot be checked, and neither can be put in someone's diary. A date such as 22 April can be announced, reminded and held to, and the gap between the start, the stop and the check shows at a glance whether the plan allows enough time.",
          ],
        },
      ],
      workedExample: {
        title: "Writing the lines for two sites",
        inputLabel: "The rollout lead's first table",
        prompt: "Site B: April. Site C: April.",
        outputLabel: "The revised table",
        output:
          "Site B. Owner: Carla, site manager. Helper: Ben, head office receptionist, on call by phone in the first week and on site on the first Monday. Start: 8 April. Paper book removed: 22 April. Check: 3 June.\nSite C. Owner: Omar, facilities lead. Helper: Ben, on site on the first Tuesday. Start: 9 April. Paper book removed: 23 April. Check: 4 June.",
        reading: [
          "The first table gave each site a month and nothing else. Neither site manager could tell from it what they were expected to do, or when.",
          "The revised table names an owner at each site, Carla and Omar, who are the people who run those receptions. It names Ben as helper, with how and when each site can reach him, and it staggers his visits so he can be at both.",
          "Each line now has a start, a stop and a check, all as dates. The rollout lead can look down the table on any day and see which sites are on track, and the check dates sit six weeks after each stop, which is the timing the fifth lesson explains.",
        ],
      },
      practice: {
        intro:
          "Here are three group lines from a rollout of a new stock system at Pellow Garden Centres. Mark each line as Ready to run or Not ready, using the three things from the first section. The worked example above shows a line that is ready.",
        check: {
          kind: "mark",
          prompt: "Mark each group line as Ready to run or as Not ready.",
          passLabel: READY,
          failLabel: NOT_READY,
          sentences: [
            {
              id: "tills",
              text: "Tills team. Owner: Aisha, tills supervisor. Helper: Tom from the pilot store, in the staff room from 8 to 9 each morning. Start: 3 March. Paper stock cards stop: 17 March. Check: 28 April.",
              fail: false,
              why: "This line has an owner in the team, a named helper with how to reach him, and all three dates, so it is ready to run.",
            },
            {
              id: "outdoor",
              text: "Outdoor plants team: March, supported by the vendor.",
              fail: true,
              why: "A month and a vendor are all this line gives. It has no owner in the team, no named helper, and no stop or check date, so it is not ready.",
            },
            {
              id: "cafe",
              text: "Café team. Owner: the rollout lead. Helper: Tom, by phone. Start: 10 March. Paper stock cards stop: 24 March. Check: 5 May.",
              fail: true,
              why: "The dates and the helper are there, but the owner is the rollout lead, who is not part of the café team. Without an owner inside the group, it is not ready.",
            },
          ],
          why: "That is right. The tills line has all three things, the outdoor plants line has almost none, and the café line fails on the owner alone, because the rollout lead cannot run the change inside the café.",
        },
      },
      check: {
        kind: "choose",
        prompt: "Two rollout leads at Orwell Insurance wrote the line for the same team. Choose the line that is ready to run.",
        leftLabel: "Line A",
        left: "Customer service team: go live in May, supported by IT and the vendor.",
        rightLabel: "Line B",
        right: "Customer service team. Owner: Hana, team manager. Helper: Leo from the pilot group, sitting with the team for the first two mornings. Start: 6 May. Old shared spreadsheet made read-only: 20 May. Check: 1 July.",
        correct: "right",
        why: "Line B names an owner in the team, a helper with how the team will reach him, and all three dates, so Hana could run her part of the rollout from it without asking anyone.",
        wrong:
          "Look again at Line A. It has a month but no owner in the team, no named helper, and no date for stopping the old spreadsheet or for the check. IT and the vendor are not people the team can turn to at the next desk, so the line is not ready.",
      },
      bridge:
        "The helper and the stop date are the two halves of the next lesson, which is about a period of support followed by a firm end to the old way.",
    },
    {
      id: "support-then-stop",
      title: "Support, then stop",
      emphasis: "stop",
      place:
        "This lesson is the third module of the course. It plans the weeks in which a group moves from the old way to the new one, and the day on which the old way ends.",
      sections: [
        {
          heading: "The support window",
          paragraphs: [
            "Every group needs a support window. This is a fixed period, with a start date and an end date, in which four things are true. A named helper is easy to reach. The old way is still available as a back-up, so that nobody is stranded when the tool fails on a busy morning. Problems are collected in one place. Someone reviews those problems on a set day and acts on them.",
            "The window is not open-ended. Two weeks is common for a small team doing a daily task, and a month may suit a change that people only meet once a week. The length should be long enough for each person to meet the tool on their real work several times, and short enough that everyone knows it will end.",
          ],
        },
        {
          heading: "The stop",
          paragraphs: [
            "At the end of the window comes the stop. The old way is removed or closed in a way people can see: the paper book is taken off the reception desk, the shared spreadsheet is made read-only, the old form is taken down from the intranet and replaced with a link to the new one. A stop that people can see does not rely on anyone remembering an email.",
            "A stop is not a request. 'Please stop using the old spreadsheet' leaves the spreadsheet open, and on a busy day people use whichever way is quicker for them. 'The spreadsheet will be made read-only on 20 May' changes what is possible, and a colleague who tries the old way on 21 May meets the change themselves.",
          ],
          beforeAfter: {
            before: "We will phase out the paper sheets over the coming weeks.",
            after:
              "On 15 September, the paper sheets are removed from every meeting room door. This date is in the launch email on 1 September.",
            reading:
              "The first version has no date and no visible change, so both systems will run for as long as anyone prefers the old one. The second names what stops, the day it stops, how people will see it, and when they were told.",
          },
        },
        {
          heading: "Why the order is support, then stop",
          paragraphs: [
            "Support without a stop leaves two systems running indefinitely. The new tool gets the easy cases and the old way gets the difficult ones, the data is split between them, and a year later nobody can say which is the record. Jeffrey Hiatt's ADKAR model calls the final stage reinforcement, and a visible stop is one of the plainest forms of it.",
            "A stop without support punishes people for problems the rollout did not fix. If the paper book disappears on the first day and the badge printer jams, the receptionist has a queue of visitors and no way to sign them in. That is how a tool gets a bad name. The order is always support first, with a back-up in place, and then the stop.",
          ],
        },
        {
          heading: "Announce the stop at the start",
          paragraphs: [
            "The stop date is announced at the start of the support window, not sprung at the end of it. People who know from the first day that the paper sheets go on 15 September have two weeks to raise problems, practise on real bookings and ask the helper. People who learn on 14 September that the sheets go tomorrow will ask for more time, and they will usually be right to.",
            "Put the stop date in the first message the group receives about the tool, and say what will stop, on which day, and how they will see it. Then remind them once, a few days before. The announcement turns the stop from a surprise into a plan that the group has been working towards.",
          ],
        },
      ],
      workedExample: {
        title: "The support section of the room booking rollout",
        inputLabel: "The support section as first written",
        prompt: "Support: help available via the IT service desk.",
        outputLabel: "The revised support section",
        output:
          "Support window: 1 to 12 September. Helper: Jo from the pilot floor, at the third-floor hub from 9 to 10 each morning and on Teams all day. Back-up: the paper sheets stay on the doors, and Jo copies any paper booking into the tool at 4 each afternoon. Problems: collected in the Booking Issues list and reviewed by the rollout lead each Friday. Stop: on 15 September, the paper sheets are removed from every door. This date is in the launch email on 1 September.",
        reading: [
          "The original line pointed people to a general service desk and had no end. Nobody would raise a ticket to ask how to book a room for a visitor, so the question would go unasked and the paper sheet would win.",
          "The revised section names Jo as helper and says where and when she can be found. It keeps the paper sheets as a back-up, and Jo copying paper bookings into the tool each afternoon means the tool stays the full record even during the window.",
          "Problems have a home and a reviewer with a day. The stop names what goes, the day it goes, and how people will see it, and it was announced on the first day of the window, so the team has known the date all along.",
        ],
      },
      practice: {
        intro:
          "Here are two stop lines for a finance team at Carrow Foods moving from emailed purchase requests to a new approvals tool. Use the two sections above on the stop and the announcement.",
        check: {
          kind: "choose",
          prompt: "Choose the stop line that people will be able to see and plan for.",
          leftLabel: "Stop A",
          left: "From 30 June, the purchase requests mailbox is closed and sends an automatic reply with a link to the approvals tool. The team is told this date in the launch message on 16 June.",
          rightLabel: "Stop B",
          right: "Once everyone is comfortable with the approvals tool, we will ask the team to stop emailing purchase requests.",
          correct: "left",
          why: "Stop A names what stops, the day it stops, how people will see it in the automatic reply, and when they were told. Stop B has no date and depends on everyone feeling comfortable, so the mailbox would stay open indefinitely.",
          wrong:
            "Look again at Stop B. It has no date, it is a request rather than a change people can see, and 'once everyone is comfortable' may never arrive. Stop A closes the mailbox on a stated day, with an automatic reply, announced at the start.",
        },
      },
      check: {
        kind: "edit",
        prompt:
          "Edit this support section for the Keel Street office's move to a new shared drive so that the team knows who helps them, for how long, and when the old way ends. Add every part that is missing.",
        label: "The support section you are repairing",
        start:
          "Support: the vendor's help centre is available. We will phase out the old system over time.",
        unchanged:
          "You have not changed the support section yet. Add a named helper, the dates of the window, a back-up, a place for problems, and a stop with its date and how people will be told.",
        limitWording: false,
        keep: [
          {
            id: "support",
            any: ["support"],
            missing: "Keep the word support in the section, so the team can see this is the support plan.",
          },
        ],
        limits: [
          {
            id: "helper",
            any: ["helper"],
            missing: "A help centre is not a person. Name a helper and say how the team can reach them.",
          },
          {
            id: "dates",
            any: [
              "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
              "january", "february", "march", "april", "june", "july", "august", "september", "october", "november", "december",
            ],
            missing: "Say when the support window starts and ends, with dates.",
          },
          {
            id: "backup",
            any: ["back-up", "backup", "back up", "fallback", "fall back"],
            missing: "Say what the back-up is during the window, so nobody is stranded if the new drive fails.",
          },
          {
            id: "problems",
            any: ["problem", "issue"],
            missing: "Say where problems are collected and who reviews them.",
          },
          {
            id: "stop",
            any: ["stop", "removed", "read-only", "read only", "switched off", "closed", "withdrawn", "retired"],
            missing:
              "'Phase out over time' has no date. Say what stops, on which day, and how people will see it, for example the old server made read-only on a stated date.",
          },
          {
            id: "announce",
            any: ["announce", "told", "tell", "launch email", "launch message"],
            missing: "Say when people will be told the stop date. The lesson asks for it at the start of the window.",
          },
        ],
        why: "The section now names a helper, gives a window with dates, keeps a back-up, collects problems in one place, and ends with a stop people can see and were told about in advance.",
        result: {
          label: "A support section that would pass",
          text: "Support window: 2 to 13 March. Helper: Sam from the pilot team, at desk 14 from 9 to 10 each morning and on Teams all day. Back-up: the old server stays open. Problems: logged in the Drive Issues list and reviewed by the rollout lead each Friday. Stop: on 16 March the old server is made read-only. This date is announced in the launch email on 2 March.",
        },
      },
      bridge:
        "After the stop, you need to know whether the behaviour has really held once the helper has gone back to their own job, which is the next lesson.",
    },
    {
      id: "the-sign-it-stuck",
      title: "The sign it stuck",
      emphasis: "stuck",
      place:
        "This lesson is the fourth module of the course. It gives you the test that tells you the rollout is finished for a group, and it returns to the behaviour you defined in the first lesson.",
      sections: [
        {
          heading: "A sign it stuck",
          paragraphs: [
            "The phrase this course uses is A sign it stuck. It is evidence in the work, some weeks after the stop and after the attention has moved on, that the behaviour from the first lesson is still happening. If the behaviour was that every visitor is signed in on the tablet, a sign it stuck is that ten visitors chosen from a day six weeks later all appear in the tablet log.",
            "The best signs are ones you can check yourself, without asking anyone how they feel about the tool. You pick a sample of real work, you look for it in the new tool, and you look for traces of the old way: new rows in the spreadsheet that was meant to be closed, requests to restore files from the old server, a paper book that has reappeared in a drawer.",
          ],
        },
        {
          heading: "A sign it launched",
          paragraphs: [
            "The other label is A sign it launched. It is evidence that the rollout happened: the number of accounts created, attendance at training, the number of logins in the first week, the number of sites live. Vendors report these readily, because their system counts them automatically.",
            "Signs it launched are useful for running the rollout. A low login count in week one tells you a group has not started, and you can act on that. But none of them tells you whether the change will last. A person can log in every day for a week, out of duty, and then go back to the old way in week five when the helper has gone and the attention is elsewhere.",
          ],
          beforeAfter: {
            before: "Success measure: 95 per cent of staff logged in during launch week.",
            after:
              "Sign it stuck: on 10 November, six weeks after the old spreadsheet was made read-only, I will pick ten orders from the warehouse dispatch log and check that each one was raised in the new tool.",
            reading:
              "The first measure describes the first week, when everyone was paying attention. The second checks real orders weeks after the stop against a record kept by another team, so it can only pass if the behaviour has held.",
          },
        },
        {
          heading: "Decide the sign before you begin",
          paragraphs: [
            "You decide the sign it stuck, and the date on which you will check it, before the rollout begins. Written in advance, it tells everyone what the rollout is aiming at. Written after the event, it tends to become whatever the numbers happen to show, which is usually a sign it launched.",
            "Check it at least a few weeks after the support window has closed. Checking the day after the stop tells you only that people complied while the change was fresh. John Kotter's Leading Change makes the case that a new way of working needs to be anchored so that it outlasts the people who introduced it, and the delay is what tests that.",
          ],
        },
        {
          heading: "Make the check independent",
          paragraphs: [
            "The strongest sign compares the new tool with a record that does not come from the tool. The contractors who were on site according to the work schedule, the orders in the dispatch log, the invoices in the finance system: each of these exists whether or not anyone used the new tool, so a gap between them and the tool is real evidence that the old way is still in use.",
            "The mistake people usually make is to accept the vendor's success measures as the sign. They are all signs it launched. Keep them on the sheet if they help you run the rollout, but write the sign it stuck separately, in your own words, with a date, a sample and a record to compare against.",
          ],
        },
      ],
      workedExample: {
        title: "Replacing the vendor's measures",
        inputLabel: "The success measures from the vendor",
        prompt:
          "Number of sites live. Number of reception staff trained. Number of visitor sign-ins in the first week.",
        outputLabel: "The rollout lead's sign it stuck",
        output:
          "Six weeks after the paper book is removed at each site, I will ask the site owner for the list of contractors who were on site on one chosen day, from their own work schedule, and check that each one appears in the tablet log for that day.",
        reading: [
          "All three of the vendor's measures describe the launch. Sites live and staff trained are activities, and sign-ins in the first week measure a week in which everyone was watching.",
          "The rollout lead's sign returns to the behaviour from the first lesson, that every visitor is signed in on the tablet, and tests it six weeks after the stop, when the helper has gone back to their own desk.",
          "It compares the tablet log with an independent record, the work schedule, so it can only pass if the contractors who really came were really signed in. A receptionist who has drifted back to a paper list would show up as a gap.",
        ],
      },
      practice: {
        intro:
          "A school business manager at Fernhill Academy is rolling out a new online system for parents to report pupil absences. Here are two ways to know it has worked. Use the difference between a sign it stuck and a sign it launched.",
        check: {
          kind: "choose",
          prompt: "Choose the measure that is a sign it stuck.",
          leftLabel: "Measure A",
          left: "In the first fortnight, 400 parents created an account on the absence system.",
          rightLabel: "Measure B",
          right: "On 20 November, five weeks after the absence phone line was switched off, the office will take the 20 absences recorded in the register that week and check that each one was reported through the system.",
          correct: "right",
          why: "Measure B checks real absences weeks after the stop against the register, which is an independent record, so it shows whether parents are still reporting the new way. Measure A counts accounts in the first fortnight, which is a sign it launched.",
          wrong:
            "Look again at Measure A. Four hundred accounts show that parents signed up, but not that they report absences through the system once the phone line has gone. Measure B checks real absences against the register weeks after the stop.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "These four measures come from the rollout of a new shared drive at Linton Architects. Mark each measure with the label it deserves.",
        passLabel: STUCK,
        failLabel: LAUNCHED,
        sentences: [
          {
            id: "access",
            text: "All forty staff have been given access to the shared drive.",
            fail: true,
            why: "Every person could have access and still save to their desktop. Access shows the drive was set up, so it is a sign it launched.",
          },
          {
            id: "restore",
            text: "Two months after the old server was made read-only, no one has asked IT to restore a file from it.",
            fail: false,
            why: "This is evidence, well after the stop, that nobody is reaching for the old server. It is a sign it stuck.",
          },
          {
            id: "attendance",
            text: "Ninety per cent of staff attended the launch session.",
            fail: true,
            why: "A session is part of the launch and says nothing about where people save their files now. Attendance is a sign it launched.",
          },
          {
            id: "files",
            text: "In a random check of ten client files from last month, all ten were in the right shared folder and none were on personal drives.",
            fail: false,
            why: "This checks where the real work is, weeks later, after the attention has moved on. It is a sign it stuck.",
          },
        ],
        why: "That is the right reading. Access and attendance show that the rollout happened, while the absence of restore requests and the check of real client files show that the behaviour held after the stop.",
      },
      bridge:
        "You now have every part of the method. The next lesson puts it to work on situations you have not seen, as the course assessment, before you write your own sheet.",
    },
    {
      id: "the-rollout-assessment",
      title: "The rollout assessment",
      emphasis: "assessment",
      place:
        "This is the course assessment, the sixth of seven lessons. It brings the four modules together, works one mixed example, and then asks you to apply the method to eight situations you have not met in the course.",
      sections: [
        {
          heading: "The method in one place",
          paragraphs: [
            "A rollout sheet starts with the behaviour: a sentence that says who does what in their work, and when, and ideally what will have disappeared. It is written before anything else, and every activity on the sheet exists to serve it. A go-live date or a training count is only an activity, and cannot stand as the definition of success.",
            "The groups then go in an order that learns. A small first group that does the work every day, with a manager who wants the change, uses the tool for a fixed period. Their problems are fixed before the next group starts with a named helper. The old way stops for each group on an announced date, and the sign is checked before the next group begins.",
            "Each group line has an owner inside the group, a named helper with a way to reach them, and three calendar dates for the start, the stop and the check. Each group has a support window with dates, a back-up and a place for problems, followed by a stop that people can see and were told about at the start. Finally, the sign it stuck is evidence in the work, checked against an independent record, weeks after the stop.",
          ],
        },
        {
          heading: "Where rollouts usually go wrong",
          paragraphs: [
            "Across all four modules, the same pattern appears. The parts of a rollout that are easy to report are written in detail, and the parts that decide whether it lasts are left vague. Go-live dates are precise and stop dates are missing. Training attendance is counted and the behaviour is never described. The vendor is named as support and nobody in the team is named as owner.",
            "When you review a plan, including your own, read it for those gaps first. Look for the behaviour sentence, the reason the first group goes first, the owner in each group, the stop date and how people will see it, and the sign it stuck with a date. A plan with all of these in place can usually survive the problems it meets, because someone is responsible for each of them.",
          ],
        },
        {
          heading: "How the assessment works",
          paragraphs: [
            "The assessment has eight situations. Each one describes a real decision in a rollout and offers three or four things a reasonable professional might do. Exactly one of them follows the method this course has taught, and the feedback on every option explains what that choice would lead to at work.",
            "You need six of the eight to pass. If you fall short, the result names each question you missed and why, and your answers stay on screen so that you can change them. Take each situation on its own terms, and read the names and dates carefully, because the details are where the right answer usually shows itself.",
          ],
        },
      ],
      workedExample: {
        title: "Reviewing a timesheet rollout plan",
        inputLabel: "The draft plan from Brennan Surveyors",
        prompt:
          "Objective: the new timesheet tool is live for all 80 staff by 1 October, with training complete. Plan: all three offices go live on 1 October. Support: the vendor's helpdesk. Success: 90 per cent of staff log in during October.",
        outputLabel: "The rollout lead's review notes",
        output:
          "The objective is only an activity. Rewrite it as: from November, every surveyor enters their hours in the tool by 5pm each Friday, and the Excel timesheet template is removed from the shared drive. The plan starts everywhere at once. Start with the Reading office of twelve, whose manager, Gita, asked for the tool, then fix what they find before Bristol and Exeter start. No office has an owner, a helper or a stop date. The vendor's helpdesk is not a helper. The success measure is a sign it launched. Replace it with a check in December of twenty jobs from the billing system against the hours recorded in the tool.",
        reading: [
          "The review applies the first module to the objective and finds a go-live date and a training count. The rewrite names who does what and by when, and what will disappear, which is the Excel template.",
          "It applies the second module to the plan, choosing a small first office with a willing manager and putting a fix before the other two start. It then applies the third and fourth modules, noting that no office has an owner, a helper or a stop date, and that a vendor helpdesk does not count as a helper.",
          "Finally, it replaces a login count in the launch month with a check against the billing system two months later. Each note is short, but each one comes from a specific part of the method, which is the habit the assessment tests.",
        ],
      },
      practice: {
        intro:
          "Before the assessment, choose between two short rollout sheets for the same timesheet tool. Use the list in the section on where rollouts usually go wrong.",
        check: {
          kind: "choose",
          prompt: "Choose the sheet that has every part of the method in place.",
          leftLabel: "Sheet A",
          left: "Behaviour: every surveyor enters their hours in the tool by 5pm each Friday, and the Excel template is removed. Order: Reading first, then Bristol and Exeter after a fix week. Reading owner: Gita. Helper: Paul, by phone. Start 1 October, stop 15 October, check 26 November. Sign it stuck: twenty billed jobs compared with hours in the tool.",
          rightLabel: "Sheet B",
          right: "Behaviour: every surveyor enters their hours in the tool by 5pm each Friday. Order: all three offices on 1 October to keep things simple. Owner for each office: the rollout lead. Support: the vendor's helpdesk. Sign it stuck: 90 per cent of staff logged in during October.",
          correct: "left",
          why: "Sheet A has a behaviour you can see, an order that learns, an owner in the group with a helper and three dates, and a sign it stuck checked against billing. Sheet B starts everywhere at once, makes the rollout lead the owner, points to a helpdesk, and measures logins in the launch month.",
          wrong:
            "Look again at Sheet B. Its behaviour is sound, but it starts all three offices on one day, names the rollout lead as owner, offers a helpdesk instead of a helper, and uses a login count, which is a sign it launched. Sheet A has every part in place.",
        },
      },
      check: {
        kind: "scenario",
        prompt:
          "Read each situation and choose what you would do. You need six of the eight to pass, and every option has feedback once you submit.",
        passMark: 6,
        questions: [
          {
            id: "objective",
            situation:
              "Priya Nair is the operations manager at Harrow Freight, rolling out a delivery app to 60 drivers. The sponsor's brief says the objective is 'App live for all 60 drivers by 1 March'. Priya has been asked to write the objective on the rollout sheet.",
            question: "Which objective should Priya write?",
            options: [
              {
                id: "a",
                text: "Keep the sponsor's wording, 'App live for all 60 drivers by 1 March', so that the sheet matches the brief.",
                feedback:
                  "The app could be live for every driver while every delivery is still signed for on paper. Matching the brief keeps the sponsor happy for a month, but it is only an activity. Write the change in the work instead.",
              },
              {
                id: "b",
                text: "'From 1 March, every driver records proof of delivery in the app at the customer's door, and paper delivery notes are no longer printed at the depot.'",
                correct: true,
                feedback:
                  "That holds. It says who does what and when, and it names the paper notes that will stop being printed, which anyone at the depot can check. It is a behaviour you can see.",
              },
              {
                id: "c",
                text: "'All 60 drivers complete the app training by 1 March.'",
                feedback:
                  "Training can be completed by every driver without one delivery being recorded in the app. It is only an activity. The objective should describe what drivers do at the door.",
              },
              {
                id: "d",
                text: "'Driver satisfaction with the app scores above 8 out of 10 in the March survey.'",
                feedback:
                  "Drivers could like the app and still use paper when the signal drops. Satisfaction tells you how people feel, not what they do. Write the behaviour you want to see at the door.",
              },
            ],
          },
          {
            id: "all-at-once",
            situation:
              "Tomasz Wilk at Kellet Housing is rolling out a repairs tool to four area teams. The director wants all four teams live in the same week so the cost falls in this financial year. Tomasz has six weeks before the year end.",
            question: "What should Tomasz propose?",
            options: [
              {
                id: "a",
                text: "All four teams go live in the same week, with the vendor providing extra support staff.",
                feedback:
                  "Extra vendor staff will answer calls, but every problem will still arrive in all four teams on the same day, with no chance to fix it first. The order that learns starts with one group.",
              },
              {
                id: "b",
                text: "All four teams go live in the same week, with the old system kept running indefinitely as a safety net.",
                feedback:
                  "Keeping the old system with no end means two systems run side by side, and people use whichever is quicker. You would meet every problem at once and never reach a stop.",
              },
              {
                id: "c",
                text: "The North team uses the tool for two weeks, the problems they find are fixed in week three, and the other three teams start in turn with a helper from North, all within the six weeks.",
                correct: true,
                feedback:
                  "That holds. The first group finds the problems while only one team is affected, they are fixed before anyone else starts, and the later teams have a helper who has already met them. It also fits the director's six weeks.",
              },
            ],
          },
          {
            id: "first-group",
            situation:
              "Ruth Okoye is rolling out a case notes tool across the four teams at Maple Community Trust. The teams are the board of trustees, the IT team of three, the Elm Road team of seven whose manager asked for the tool, and the large outreach team whose manager doubts it.",
            question: "Which group should go first?",
            options: [
              {
                id: "a",
                text: "The Elm Road team, because they write case notes every day and their manager wants the change.",
                correct: true,
                feedback:
                  "That holds. They will meet the real problems quickly, because the tool is part of their daily work, and a manager who wants the change will make sure problems are reported and fixed.",
              },
              {
                id: "b",
                text: "The outreach team, because winning over the sceptical manager early will make the rest easier.",
                feedback:
                  "A large team with a doubtful manager is the hardest place to learn. Problems will be read as proof the tool is wrong rather than reported and fixed. Bring them in later, with a helper and fixes already in place.",
              },
              {
                id: "c",
                text: "The board of trustees, because they approved the spending and can set an example.",
                feedback:
                  "Trustees rarely write case notes, so they would find very few of the problems the teams will meet. The first group should do the work every day.",
              },
              {
                id: "d",
                text: "The IT team, because they can fix technical problems themselves.",
                feedback:
                  "The IT team does not write case notes, so they would test the installation rather than the work. The first group should use the tool on real work every day.",
              },
            ],
          },
          {
            id: "owner",
            situation:
              "Abi Grant is writing the group line for the Leeds warehouse in a rollout of a new picking scanner at Stanmore Retail. The candidates for owner are herself as rollout lead, the vendor's account manager, the IT service desk, and Dev Mistry, who manages the Leeds warehouse.",
            question: "Who should Abi name as owner of the Leeds line?",
            options: [
              {
                id: "a",
                text: "Herself, because as rollout lead she is accountable for the whole project.",
                feedback:
                  "The rollout lead cannot be on the Leeds floor every shift, noticing who has gone back to paper pick lists. The owner has to be someone inside the group.",
              },
              {
                id: "b",
                text: "The vendor's account manager, because they know the scanner best.",
                feedback:
                  "The vendor knows the scanner, but they do not manage Dev's staff and cannot ask anyone to change how they work. The owner has to be inside the group.",
              },
              {
                id: "c",
                text: "The IT service desk, because they will handle problems with the devices.",
                feedback:
                  "The service desk fixes devices, but it has no standing in the warehouse and cannot make the change happen on the floor. The owner has to be inside the group.",
              },
              {
                id: "d",
                text: "Dev Mistry, because he manages the Leeds warehouse team.",
                correct: true,
                feedback:
                  "That holds. Dev is in the group, he decides who covers while someone learns, and he can see and act when someone goes back to paper. That is what an owner does.",
              },
            ],
          },
          {
            id: "drifting",
            situation:
              "Two weeks after the new booking tool started at Calder Physio, Sian Lloyd notices that the reception team still uses the old paper diary on busy mornings. No stop date was ever set, and the helper, Mo, is still on hand.",
            question: "What should Sian do next?",
            options: [
              {
                id: "a",
                text: "Announce now that the paper diary will be removed from reception on a date two weeks away, keep Mo on hand and the diary as a back-up until then, and collect the problems that send people back to paper.",
                correct: true,
                feedback:
                  "That holds. It adds the missing stop, announces it in advance, and keeps support and a back-up in place until the date, so the problems that send people back to paper can be fixed before it goes.",
              },
              {
                id: "b",
                text: "Remove the paper diary from reception tonight, so that the team has to use the tool from tomorrow.",
                feedback:
                  "A stop with no notice punishes the team for whatever makes busy mornings hard, and those problems have not been found or fixed. Announce a stop date and support people until it.",
              },
              {
                id: "c",
                text: "Leave both running until everyone prefers the tool, however long that takes.",
                feedback:
                  "Support without a stop leaves two systems running indefinitely, and the diary will keep winning on busy mornings. The group needs a stop date, announced in advance.",
              },
              {
                id: "d",
                text: "Send the team a reminder email asking them to use the tool instead of the diary.",
                feedback:
                  "A reminder is a request, and the diary is still on the desk on the next busy morning. The team needs a stop they can see, on a date they know.",
              },
            ],
          },
          {
            id: "visible-stop",
            situation:
              "At Wren and Co. Accountants, the client onboarding checklist is moving from a shared spreadsheet to a new workflow tool. The team's support window runs from 3 to 14 June. Lewis Obi is writing the stop.",
            question: "Which stop should Lewis write?",
            options: [
              {
                id: "a",
                text: "'After 14 June, staff are asked to stop using the onboarding spreadsheet.'",
                feedback:
                  "Asking people to stop leaves the spreadsheet open, and on a busy day someone will use it. The stop should change what people can do, in a way they can see.",
              },
              {
                id: "b",
                text: "'The spreadsheet will be retired when the new tool is fully adopted.'",
                feedback:
                  "'Fully adopted' has no date, and it may never be declared while the spreadsheet is still open. Say what stops and on which day.",
              },
              {
                id: "c",
                text: "'On 17 June, the onboarding spreadsheet is made read-only, with a note at the top linking to the new tool. This date is in the launch message on 3 June.'",
                correct: true,
                feedback:
                  "That holds. It names what stops, the day, how people will see it when they open the spreadsheet, and when they were told, which was the first day of the window.",
              },
            ],
          },
          {
            id: "logins",
            situation:
              "At Hartwell Clinics, the new referrals system has been live for a week. The sponsor, Dr Amara Cole, emails to say that 95 per cent of clinicians logged in during launch week and asks whether the rollout can be marked complete.",
            question: "What should the rollout lead reply?",
            options: [
              {
                id: "a",
                text: "Agree to mark it complete, because 95 per cent of logins shows the clinicians are using the system.",
                feedback:
                  "Launch week logins are a sign it launched. Clinicians could log in once and still send referrals by the old route in week six. Wait for the sign it stuck.",
              },
              {
                id: "b",
                text: "Explain that logins show the launch went well, and that the rollout is complete when, six weeks after the old referral form is withdrawn, twenty referrals from the hospital's intake list are all found in the new system.",
                correct: true,
                feedback:
                  "That holds. It welcomes the launch figure for what it is, and it points to evidence in the real work, weeks after the stop, checked against the hospital's own intake list.",
              },
              {
                id: "c",
                text: "Suggest waiting for the vendor's quarterly usage report and marking it complete if logins stay above 90 per cent.",
                feedback:
                  "A longer run of login figures is still a count of logins. It does not show that referrals are going through the new system. Check real referrals against an independent record.",
              },
              {
                id: "d",
                text: "Send a survey asking clinicians whether they are now using the new system for referrals.",
                feedback:
                  "A survey tells you what people say, and people tend to give the expected answer. Check real referrals against the intake list instead.",
              },
            ],
          },
          {
            id: "check-date",
            situation:
              "At Northgate Council, the old paper permit forms stop being accepted from the parking team on 2 September, at the end of a two-week support window. Yusuf Ali has written the sign it stuck as a comparison of twenty permits from the payments ledger with the new permit system, and he now has to choose the check date.",
            question: "When should Yusuf check the sign?",
            options: [
              {
                id: "a",
                text: "On 3 September, the day after the stop, while the change is fresh.",
                feedback:
                  "The day after the stop shows only that people complied while everyone was watching. The sign should be checked after the attention has moved on.",
              },
              {
                id: "b",
                text: "On 2 September, the last day of the support window, while the helper is still available.",
                feedback:
                  "While the window is still open, the paper forms are still accepted, so the check cannot show whether the behaviour has changed. Check after the stop, and after some weeks.",
              },
              {
                id: "c",
                text: "Whenever the vendor's next quarterly report arrives, so that the check uses their figures.",
                feedback:
                  "The vendor's report will be a count of activity in their system, and its date is set by their calendar rather than yours. Set your own date, weeks after the stop.",
              },
              {
                id: "d",
                text: "On 14 October, six weeks after the stop, once the helper has returned to their own work.",
                correct: true,
                feedback:
                  "That holds. Six weeks after the stop, with support gone and attention elsewhere, the ledger comparison can only pass if the parking team has kept to the new system.",
              },
            ],
          },
        ],
        why: "You applied the method across the whole rollout: a behaviour you can see, an order that learns, an owner inside the group, support followed by a visible stop, and a sign it stuck checked weeks later against real work.",
      },
      bridge:
        "In the last lesson you bring the behaviour, the order, the owners, the support and the sign together in the rollout sheet that goes on your record.",
    },
    {
      id: "your-rollout-sheet",
      title: "Your rollout sheet",
      emphasis: "sheet",
      place:
        "This is the final lesson of the course. The sheet you write here is the work your signed record will show.",
      sections: [
        {
          heading: "Choose one real tool",
          paragraphs: [
            "Your rollout sheet covers one real tool that you are rolling out now, or are about to. A real tool is better than an invented one, because you know the groups, you know which manager wants the change and which does not, and you will find out on the check date whether the sheet worked.",
            "Do not put anything confidential on the sheet. It will appear on a record that another person can open with the reference, so use names and dates you would be comfortable showing, or replace them with realistic examples that keep the same shape. Initials or role titles are fine for people.",
          ],
        },
        {
          heading: "The five sections",
          paragraphs: [
            "The sheet has five sections, one for each part of the method. The behaviour is the sentence from the first lesson: who does what, when, and what will have disappeared. The order of groups lists at least two groups, says why the first goes first, and includes the fix before the next group starts.",
            "Who and when gives each group a line with an owner inside the group, a named helper, and the three dates. Support, then stop gives the support window with dates, the back-up, where problems go, and the stop, saying what stops, how people will see it, and when they are told. The sign it stuck says what evidence in the work you will check, against which record, and on which date.",
            "The sheet is not a project plan with every task, and it should fit on one page. The test is whether each owner could read their line and know what they are responsible for and when, and whether someone else could carry out the check on the date you set without asking you what you meant.",
          ],
        },
        {
          heading: "How the sheet is checked",
          paragraphs: [
            "When you continue, each section is checked in turn. The behaviour has to describe the work for every person or each case, using words such as every, each, before, instead of or no longer. The order has to name the group that goes first, or the pilot. Who and when has to name an owner and include a date or a name. Support, then stop has to say what stops, is removed, is closed or is made read-only, and give a date. The sign it stuck has to say how you will check, compare or sample the work, and give a date.",
            "As in the earlier lessons, this course calls a line Ready to run when an owner or a colleague could act on it as it stands, and Not ready when they would have to come back to you. If a section is not ready, the note names it and says what to add. When every section passes, you sign your name against the sheet, and the record shows it exactly as you wrote it.",
          ],
        },
      ],
      workedExample: {
        title: "A complete sheet for the visitor system",
        inputLabel: "The rollout lead's notes",
        prompt:
          "Visitor tablets, five sites. Head office has the most visitors and Ben on reception knows the system. Sites B and C next, then D and E. Badge printer and contractor emails were the problems. Paper book to go. Check contractors against the schedule.",
        outputLabel: "The rollout sheet",
        output:
          "The behaviour: by the end of June, at all five sites, every visitor is signed in on the tablet before they are given a badge, and the paper visitor book is no longer at reception.\nThe order of groups: head office goes first, because it has the most visitors and Ben, its receptionist, already knows the system. Its problems are fixed in week three before Sites B and C start, and Sites D and E start only after the check at the first three.\nWho and when: Head office. Owner: Priya, office manager. Helper: the vendor trainer on the first day, then Ben. Start: 1 April. Stop: 15 April. Check: 27 May. Site B. Owner: Carla, site manager. Helper: Ben. Start: 22 April. Stop: 6 May. Check: 17 June.\nSupport, then stop: each site has a two-week support window with Ben on call by phone and on site on the first day, the paper book kept as a back-up, and problems logged in the Visitor Issues list for review each Friday. At the end of the window the paper book is removed from reception, on a date given in the launch email on the first day.\nThe sign it stuck: six weeks after the paper book is removed at each site, I will take the list of contractors on site for one day from the site owner's work schedule and check that each one appears in the tablet log for that day.",
        reading: [
          "Each section does one job, and each can be read by someone who was not in the room when the notes were written. The behaviour names who, what, when and what disappears.",
          "Every site manager can find their own line and read their owner role, their helper and their three dates. The order says why head office goes first and where the fix sits.",
          "The support section ends in a stop people can see, announced on the first day, and the sign it stuck compares the tablet log with an independent record six weeks later. Success will be decided by what happens at reception in the summer, not by what happened at launch in April.",
        ],
      },
      practice: {
        intro:
          "Your answers from the earlier practices are still yours to use. Before you write your own sheet, mark each line of this draft sheet for a new invoicing tool as Ready to run or Not ready, using the section on how the sheet is checked.",
        check: {
          kind: "mark",
          prompt: "Mark each line of this draft rollout sheet as Ready to run or as Not ready.",
          passLabel: READY,
          failLabel: NOT_READY,
          sentences: [
            {
              id: "behaviour",
              text: "The behaviour: the invoicing tool goes live for the accounts team on 1 February.",
              fail: true,
              why: "Going live is only an activity. The behaviour should say what the accounts team does differently, such as raising every invoice in the tool instead of the Word template.",
            },
            {
              id: "order",
              text: "The order of groups: the Chester accounts team goes first, because they raise invoices daily and their manager asked for the tool, then Wrexham after a fix week.",
              fail: false,
              why: "This names the first group, the reason, and the fix before the next group, so it is ready to run.",
            },
            {
              id: "stop",
              text: "Support, then stop: help from the vendor until people are used to it.",
              fail: true,
              why: "The vendor is not a named helper, and 'until people are used to it' has no dates and no stop. It is not ready.",
            },
            {
              id: "sign",
              text: "The sign it stuck: on 15 April, six weeks after the Word template is removed, I will check ten invoices from the bank statement against the tool.",
              fail: false,
              why: "This is evidence in the work, weeks after the stop, checked against an independent record on a date, so it is ready to run.",
            },
          ],
          why: "That is right. The order and the sign it stuck could be acted on as they stand, while the behaviour is only an activity and the support line has no helper, no dates and no stop.",
        },
      },
      check: {
        kind: "build",
        prompt:
          "Write the rollout sheet for one tool you are rolling out, or are about to. Fill in all five sections so that each owner could act on their part without asking you what you meant.",
        fields: [
          {
            id: "behaviour",
            label: "The behaviour",
            hint: "Who does what in their work, and when, and what will have disappeared. Not a go-live date or a training count.",
            min: 40,
            any: ["every", "each", "before", "instead", "no longer", "always", "all "],
            missing:
              "The behaviour is still only an activity. Say who does what in their work, and when, using words such as every, each or no longer, and name the old way that will disappear.",
          },
          {
            id: "order",
            label: "The order of groups",
            hint: "At least two groups, why the first goes first, and the fix before the next group starts.",
            min: 60,
            any: ["first", "pilot", "start with"],
            missing:
              "The order of groups does not yet say which group goes first. Name the first group, say why it goes first, and say that its problems are fixed before the next group starts.",
          },
          {
            id: "who",
            label: "Who and when",
            hint: "For each group: an owner inside the group, a named helper, and dates for the start, the stop and the check.",
            min: 60,
            rule: "fact",
            any: ["owner"],
            missing:
              "Who and when does not yet name an owner with dates. For each group, write the owner inside the group, the helper, and the dates for the start, the stop and the check.",
          },
          {
            id: "support",
            label: "Support, then stop",
            hint: "The support window with dates, the helper, the back-up, where problems go, and what stops on which day, how people will see it, and when they are told.",
            min: 60,
            rule: "fact",
            any: ["stop", "removed", "read-only", "read only", "switched off", "closed", "withdrawn", "retired"],
            missing:
              "Support, then stop does not yet end the old way. Say what stops, is removed or is made read-only, on which date, and when people are told.",
          },
          {
            id: "sign",
            label: "The sign it stuck",
            hint: "Evidence in the work, weeks after the stop, checked against a record that does not come from the tool, with the date of the check.",
            min: 40,
            rule: "fact",
            any: ["check", "compare", "sample", "pick", "look at"],
            missing:
              "The sign it stuck does not yet say how and when you will check the work. Describe the evidence you will check or compare, against which record, and give the date, weeks after the stop.",
          },
        ],
        why: "Your sheet defines a behaviour you can see, puts the groups in an order that learns, names an owner and dates for each, plans support before the stop, and sets a sign it stuck with a date.",
      },
      bridge:
        "Your rollout sheet is ready to sign, and once you sign it the record will show it to anyone with the reference, so put the date of your sign it stuck in your diary now.",
    },
  ],
};
