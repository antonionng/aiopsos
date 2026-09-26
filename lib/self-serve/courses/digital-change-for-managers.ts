/*
Course: Digital Change for Managers
Slug: digital-change-for-managers
For: Line managers whose team is about to change a tool or a way of working, such as moving from email to a shared task board, from paper forms to a system, or from one case management tool to another. The decision has usually been made above them. They know the change that is coming and roughly when. They do not need to know how the new tool works in detail.
Outcome: The manager can describe a tool change as the things their people will stop and start doing, name the old habit and the date and way it ends, plan the first two weeks with a lighter load, a named person to ask and a regular check-in, tell an objection that names a real cost from one that asks for reassurance and answer each properly, and say what they will see in the work at the end of week two that shows the change is holding.
Artefact: The two-week plan, in eight parts: the change as things people do, what they stop doing, what will be harder and what you will do, who they ask, the check-in, objections you expect, the sign in the work, and what you will not pretend.
Record sentence: Wrote and signed a two-week plan for a real tool change that states the change as work, names the date the old habit stops, and sets a sign in the work to check at the end of week two.
Why it is worth paying for: Most tool changes that fail in a team fail in the first fortnight, because the announcement described the tool, the old route stayed open, and nobody decided in advance what success would look like in the work. A manager who finishes this course leaves with a plan for their own team that a colleague could run during their leave, which is the difference between a change that holds and one that quietly reverts.
Lessons (id, title, move, interaction, pass rule):
  1. a-tool-change-is-a-change-in-work, A tool change is a change in work, restate a change as steps in someone's week. Practice: edit a feature announcement (passes when it says what people will do and what it replaces, and keeps the go-live date). Check: mark four sentences as Something they do or Something the tool has (every sentence marked correctly).
  2. what-they-stop-doing, What they stop doing, name the old habit, the date and the way it stops. Practice: edit a plan with no end (passes when it names when the old route stops and how). Check: choose the announcement that says what stops (Announcement B).
  3. the-first-two-weeks, The first two weeks, plan the fortnight as work people can feel. Practice: mark four plan lines as Work people can feel or Only an announcement (every line correct). Check: choose the plan people can feel (Plan B).
  4. hearing-the-objection, Hearing the objection, tell a real cost from a request for reassurance. Practice: choose the response that treats a real cost as a cost (Response B). Check: mark four comments as Names a real cost or Asks for reassurance (every comment correct).
  5. how-you-know, How you know, set a sign in the work for the end of week two. Practice: edit a login target into a sign in the work (passes when it keeps week two, names something every item of work shows, and says how it will be checked). Check: mark four measures as Sign in the work or Count of activity (every measure correct).
  6. putting-the-two-weeks-together, Putting the two weeks together, apply every move to new situations. Practice: choose the stronger manager's note (Note A). Check: scenario of six questions, passMark five.
  7. your-two-week-plan, Your two-week plan, write the artefact. Practice: mark four plan lines as Someone covering could run it or Someone covering would have to ask. Check: build with eight fields, each carrying a rule or an any list.
Sources: John P. Kotter, Leading Change (1996). Jeffrey M. Hiatt, ADKAR: A Model for Change in Business, Government and Our Community (2006). Chip Heath and Dan Heath, Switch: How to Change Things When Change Is Hard (2010). GOV.UK Service Manual, guidance on understanding users and on assisted digital support.
Tested on phone:          no
Tested returning learner: no
Pass rule tests written:  yes
*/

import type { CourseContent } from "./types.ts";

const DO = "Something they do";
const HAS = "Something the tool has";
const FEEL = "Work people can feel";
const ANNOUNCE = "Only an announcement";
const COST = "Names a real cost";
const REASSURE = "Asks for reassurance";
const SIGN = "Sign in the work";
const COUNT = "Count of activity";
const RUN = "Someone covering could run it";
const ASK = "Someone covering would have to ask";

export const COURSE: CourseContent = {
  slug: "digital-change-for-managers",
  hours: 2,
  artefact: {
    lessonId: "your-two-week-plan",
    title: "The two-week plan",
    recordLine:
      "Wrote and signed a two-week plan for a real tool change that states the change as work, names the date the old habit stops, and sets a sign in the work to check at the end of week two.",
  },
  lessons: [
    {
      id: "a-tool-change-is-a-change-in-work",
      title: "A tool change is a change in work",
      emphasis: "work",
      place:
        "This is the first of seven lessons. It sets out the idea the rest of the course is built on, and it shapes how you will describe the change to your team in every later lesson.",
      sections: [
        {
          heading: "People feel a change in their week",
          paragraphs: [
            "Your team will not experience the new tool as a list of features. They will experience it as a set of things they used to do and now cannot, and a set of things they now have to do and did not before. The person who used to keep case notes in a Word file will notice that the file has gone. The person who used to forward an email to pass a case on will notice that forwarding no longer counts.",
            "That is why the first job of a manager in a tool change is translation. Somebody above you chose the tool because of what it can do for the organisation. Your team needs to hear what it will change on Monday morning, at their desk, with a customer on the phone. Until you have written the change in those terms, you have not yet described it.",
          ],
        },
        {
          heading: "Two kinds of sentence",
          paragraphs: [
            "In this course, a sentence about the change is Something they do when it describes a step in someone's week. It names an action a person takes, and usually when they take it. For example, 'you will log each call in the case record before you hang up' is something they do. So is 'you will no longer fill in the paper claim form', because stopping something is also a change in what a person does, and it is often the one they notice most.",
            "A sentence is Something the tool has when it describes a capability of the system. 'The system has real-time dashboards' and 'the app offers mobile access' are both of this kind. They may be true, and they may be the reason the organisation bought the tool, but neither tells a member of your team what to do differently at nine o'clock on the first day.",
            "The test is simple. Read the sentence as the person receiving it and ask what they will do differently because of it. If the answer is a specific action, the sentence is something they do. If the answer is nothing in particular, the sentence is something the tool has.",
          ],
          beforeAfter: {
            before: "The new ordering system offers a single catalogue and automated approvals.",
            after:
              "From 14 April, you will order stationery from the catalogue in the new system instead of emailing Fatima. Orders under £50 will be approved automatically, so you will not need to wait for my sign-off.",
            reading:
              "The first version describes the tool. The second tells each person what they will do, what it replaces, and what they no longer need to wait for.",
          },
        },
        {
          heading: "Why announcements come out the wrong way round",
          paragraphs: [
            "Most announcements are written in the second kind of sentence, because that is how the tool was sold to the organisation. The supplier's slides describe capabilities, the business case repeats them, and the programme team's email to managers repeats them again. By the time the message reaches you, it is a list of features that has passed through three sets of hands without anyone asking what it means for a person's day.",
            "If you forward that email to your team as it stands, you have handed the translation to each of them separately. Some will work it out correctly. Some will work it out wrongly. Most will wait and see, which in practice means carrying on as before until something forces them to stop. Writing the change as things people do is not a matter of style. It is the first place where the change can go wrong.",
          ],
        },
        {
          heading: "The mistake people usually make",
          paragraphs: [
            "The usual mistake is to add enthusiasm rather than detail. A manager senses that the feature list will not land, so they add a line such as 'this will make everyone's life easier'. That sentence is neither something they do nor something the tool has. It is a promise, and in the first week, when everything takes longer, the team will remember it.",
            "The better move is to go through the features one at a time and, for each, write the step in someone's week that it changes. Some features will not change anything your team does, and you can leave those out. What remains is shorter than the original announcement and far more useful, because each line is something a person can picture doing.",
          ],
        },
      ],
      workedExample: {
        title: "The case management announcement at Harbour Lane Housing",
        inputLabel: "The email from the programme team",
        prompt:
          "The new case management system goes live on 3 March. It offers a single view of the customer, automated workflows and mobile access.",
        outputLabel: "The manager's rewrite for her team",
        output:
          "From 3 March, you will open a case in the new system instead of starting an email thread. When a tenant calls, you will find them by postcode rather than by searching your inbox. When you pass a case to a colleague, you will assign it in the system rather than forwarding the email. You will no longer keep the case notes in your own Word file.",
        reading: [
          "The programme team's email describes what Harbour Lane Housing bought. A single view of the customer, automated workflows and mobile access are all capabilities, and none of them tells a housing officer what to do on 3 March.",
          "The manager, Grace Mensah, took each capability and asked what it changes in her team's week. The single view became finding a tenant by postcode. The automated workflows became assigning a case in the system. She left out mobile access, because her team works at desks and it changes nothing for them.",
          "The last sentence of the rewrite is a habit that stops. Grace included it because the Word files are where her team keeps its real knowledge, and it is the change they will feel most. Each of the four sentences is something they do, which is what they need to know and what they may worry about.",
        ],
      },
      practice: {
        intro:
          "Here is the announcement a manager at Castlegate Logistics received about a new rota system. Rewrite it for the team so that it says what people will do. The worked example above is still on the page if you want to follow its pattern.",
        check: {
          kind: "edit",
          prompt:
            "Rewrite this announcement so that it describes what people will do, not what the tool has. Keep the go-live date, and say what at least one new step replaces.",
          label: "The announcement you are rewriting",
          start:
            "The new rota system goes live on 6 October. It offers shift swapping, live availability and mobile notifications.",
          unchanged:
            "You have not changed the announcement yet. Rewrite each feature as a step someone will take, for example 'you will swap a shift in the app instead of asking me'.",
          limitWording: false,
          keep: [
            {
              id: "date",
              any: ["6 october", "6th october", "6 oct"],
              missing: "Keep the go-live date. The team still needs to know that the change starts on 6 October.",
            },
          ],
          limits: [
            {
              id: "do",
              any: ["you will", "you'll", "you can now", "you need to", "you must"],
              missing:
                "The rewrite does not yet say what anyone will do. Add a sentence that starts with 'you will' and names a step, such as swapping a shift or checking the rota.",
            },
            {
              id: "replaces",
              any: ["instead of", "rather than", "no longer", "stop", "not need to", "won't need to"],
              missing:
                "The rewrite does not yet say what the new step replaces. Add 'instead of' or 'no longer' and name the old way, such as asking the supervisor or reading the paper rota on the wall.",
            },
          ],
          why: "That rewrite works. It keeps the date, tells people what they will do, and names what the new step replaces, so each person can picture their own week rather than a list of features.",
          result: {
            label: "One rewrite that would pass",
            text: "From 6 October, you will swap a shift in the app instead of asking me to change the paper rota. You will check the app before each shift rather than the sheet on the wall, and you will get a message on your phone when your shifts change.",
          },
        },
      },
      check: {
        kind: "mark",
        prompt:
          "These four sentences come from a manager's first draft about a move to a new expenses system. Mark each sentence with the label it deserves.",
        passLabel: DO,
        failLabel: HAS,
        sentences: [
          {
            id: "receipt",
            text: "You will photograph each receipt with the app on the day you get it.",
            fail: false,
            why: "This describes a step in someone's week. It tells them what they will do, and when.",
          },
          {
            id: "policy",
            text: "The system includes automated policy checks.",
            fail: true,
            why: "This is a capability of the system, not a step anyone takes. Nothing in it tells a person what to do differently.",
          },
          {
            id: "paper",
            text: "You will no longer fill in the monthly paper claim form.",
            fail: false,
            why: "This describes a habit that ends. Stopping something is also a change in what people do, and often the one they notice most.",
          },
          {
            id: "finance",
            text: "It connects directly to the finance platform, with no double keying.",
            fail: true,
            why: "This describes the tool. Ask what a person will do differently because of this sentence, and the answer is nothing it tells them.",
          },
        ],
        why: "That is the right reading. Photographing each receipt and stopping the paper form are both things people do, while the policy checks and the finance connection describe what the tool has, which tells your team nothing about their week.",
      },
      bridge:
        "Of all the things people will do differently, the one that decides whether the change holds is what they stop doing, and that is the next lesson.",
    },
    {
      id: "what-they-stop-doing",
      title: "What they stop doing",
      emphasis: "stop",
      place:
        "This lesson is the first module of the course. It deals with the old habit, which is the part of a change most often left to fade on its own.",
      sections: [
        {
          heading: "Changes fail because the old way is still there",
          paragraphs: [
            "A new way of working rarely fails because people cannot use it. It fails because the old way is still available, familiar and a little faster, so under pressure people drift back to it. On a busy Tuesday with three calls waiting, a housing officer who can either learn the new screen or send the email they have sent a thousand times will send the email.",
            "John Kotter makes a related point in Leading Change: change efforts stall when the old structures and habits are left in place alongside the new ones. You do not need the whole of his model to use this. You only need to accept that if the old route stays open, it will stay in use, and your team will quite reasonably use whichever route is easier on the day.",
          ],
        },
        {
          heading: "A name, a date and a way",
          paragraphs: [
            "The old habit needs three things written down. It needs a name, which is the specific thing people currently do, such as 'emailing holiday requests to me' or 'keeping case notes in Word'. It needs a date on which it stops. And it needs a way it stops, which is what actually happens when someone tries the old route after that date.",
            "The way it stops is the part most often missed. Good examples are a shared inbox that sends an automatic reply pointing to the new form, a spreadsheet made read-only, or a manager who replies to an emailed request with the link and does not act on it until it arrives in the system. Each of these is visible, it is predictable, and it points the person to the right place rather than leaving them stuck.",
          ],
          beforeAfter: {
            before: "Please try to use the new timesheet tool rather than the spreadsheet.",
            after:
              "Timesheets go into the new tool from Monday 2 June. The spreadsheet stays open until Friday 13 June so you can finish May. On 16 June I will make it read-only, and I will copy anything entered after that date into the tool myself and let you know.",
            reading:
              "The first version asks politely and never ends. The second names the habit, gives a period of overlap, a date, and a way of stopping that nobody will be surprised by.",
          },
        },
        {
          heading: "What stopping is not",
          paragraphs: [
            "Stopping is not a punishment, and it should come after people have had support, not before. Closing the old route on the first day, with no overlap, is how you get a team working round the new tool in private, because they have no safe way to finish what they started. A short overlap, usually a week or two, lets people complete work already in flight and practise the new way while the old one is still there as a safety net.",
            "Stopping is also not the same as saying you would prefer people to use the new way. A preference has no date. If you never say when the old route closes, you are running two systems indefinitely, and in six months you will find that the new tool holds half the work and the old one holds the other half, which is worse than either on its own.",
          ],
        },
        {
          heading: "The mistake people usually make",
          paragraphs: [
            "The usual mistake is kindness without an end. A manager wants to avoid pressure, so they say that people can keep using the old way while they get used to the new one. It sounds supportive. In practice it means that the people who find change hardest never have to make it, and the people who did make it are now keeping two sets of records to stay in step with them.",
            "The better move is to be kind about the overlap and clear about the end. Say how long the overlap lasts, say what you will do to help during it, and say exactly what happens on the day it ends. People can plan round a date. They cannot plan round a preference.",
          ],
        },
      ],
      workedExample: {
        title: "Closing the email route at Harbour Lane Housing",
        inputLabel: "The manager's first plan",
        prompt:
          "We'll use the new case system from 3 March, and people can keep using email while they get used to it.",
        outputLabel: "The revised plan",
        output:
          "From 3 March, new cases are opened in the new system. Existing email threads can be finished by email until 17 March. From 17 March, the team inbox sends an automatic reply that gives tenants the new contact form, and I will move any case that arrives by email into the system myself and tell the person who sent it.",
        reading: [
          "The first plan had no end. Grace's team would have kept using email for anything difficult, and email would have stayed the real system while the new one held the easy cases.",
          "The revised plan names the habit, which is opening and working cases by email. It gives two weeks of overlap for threads already in progress, and it sets a date, 17 March, on which the route closes.",
          "It also says how the route closes, with an automatic reply for tenants and a manager who moves stray cases herself. That way of stopping is visible and kind. Nobody's case is lost, and nobody is surprised.",
        ],
      },
      practice: {
        intro:
          "A manager at Fernhill Foods wrote this plan for moving stock requests to a new ordering form. It has no end. Edit it so that it says when the old route stops and how. The section on a name, a date and a way is above if you want it.",
        check: {
          kind: "edit",
          prompt:
            "Edit this plan so that it says when emailed stock requests stop and what happens to a request that arrives by email after that date. Keep the ordering form in the plan.",
          label: "The plan you are editing",
          start:
            "From 2 June, stock requests go through the new ordering form. People can keep emailing Dev if they prefer while they get used to it.",
          unchanged:
            "You have not changed the plan yet. Add the date emailed requests stop and say what Dev will do with an email that arrives after it.",
          limitWording: false,
          keep: [
            {
              id: "form",
              any: ["ordering form", "the form"],
              missing: "Keep the ordering form in the plan. The team still needs to know where requests now go.",
            },
          ],
          limits: [
            {
              id: "end",
              any: ["until", "no longer", "stops on", "stop on", "ends on", "after", "last day"],
              missing:
                "The plan does not yet say when emailing Dev ends. Add a date with a word such as 'until' or 'after', for example 'Dev will accept emailed requests until 13 June'.",
            },
            {
              id: "way",
              any: [
                "automatic reply",
                "auto-reply",
                "autoreply",
                "reply with the link",
                "send the link",
                "will not",
                "won't",
                "read-only",
                "read only",
                "switched off",
                "turned off",
                "enter it",
                "move it",
              ],
              missing:
                "The plan does not yet say how the old route stops. Say what happens to an emailed request after the date, for example 'Dev will reply with the link to the form and will not place the order until it arrives there'.",
            },
          ],
          why: "That edit works. The plan now has an overlap, a date on which emailed requests end, and a way of stopping that sends people to the form rather than leaving them stuck.",
          result: {
            label: "One edit that would pass",
            text: "From 2 June, stock requests go through the new ordering form. Dev will accept emailed requests until 13 June and will enter them into the form for you. After 13 June, Dev will reply to emailed requests with the link to the form and will not place the order until it arrives there.",
          },
        },
      },
      check: {
        kind: "choose",
        prompt:
          "Two managers wrote the same announcement about moving holiday requests to the HR system. Choose the one that says what stops.",
        leftLabel: "Announcement A",
        left: "From next month, please use the HR system for holiday requests. It's much easier and gives you a live view of your allowance.",
        rightLabel: "Announcement B",
        right:
          "From 1 May, please request holiday in the HR system. Until 15 May I will still accept emailed requests and enter them for you. From 15 May, I will reply to emailed requests with the link and will not approve them until they are in the system.",
        correct: "right",
        why: "Announcement B names the old habit, which is emailing requests, gives a period of support until 15 May, and says the date and the way it stops. People can plan round that.",
        wrong:
          "Look again at Announcement A. It never says that emailed requests stop, so people will keep sending them, and the manager will be running two routes indefinitely. Announcement B gives a date and a way the email route ends.",
      },
      bridge:
        "The two weeks around the switch are when the change is won or lost, and the next lesson shows you how to plan them.",
    },
    {
      id: "the-first-two-weeks",
      title: "The first two weeks",
      emphasis: "weeks",
      place:
        "This lesson is the second module of the course. It turns the date of the change into a period you have planned for, rather than a day you hope goes well.",
      sections: [
        {
          heading: "People are slower before they are faster",
          paragraphs: [
            "In the first two weeks of a new tool, most people will be slower, not faster. They are learning where things are, the old shortcuts no longer work, and each small uncertainty costs a minute. A case that used to take four minutes to open may take ten. That is normal, and it passes, but only if the team gets through those two weeks without deciding that the new way is simply worse.",
            "Jeffrey Hiatt's ADKAR model, published by Prosci, separates knowing how to do something from being able to do it under real conditions. Training gives people the first. Only practice, with support close by, gives them the second. The first two weeks are when knowledge turns into ability, and your plan for them is what makes that happen.",
          ],
        },
        {
          heading: "What a two-week plan contains",
          paragraphs: [
            "A good plan for the first two weeks names what will be harder and for whom. It lightens the load where it matters, for example by reducing targets or moving a deadline. It names one person each team member can ask, ideally someone who has used the tool already and sits nearby. And it sets a short, regular check-in, such as ten minutes each morning, where problems surface while they are still small.",
            "The GOV.UK Service Manual's guidance on assisted digital support makes a point that applies inside a team as well as to the public: some people will need help from another person to use a new service, and that help has to be planned rather than left to chance. In a team, the person who needs help is often the one least likely to ask for it in front of others. A named helper and a daily check-in give them a way to ask without making a scene of it.",
          ],
        },
        {
          heading: "Two kinds of line in a plan",
          paragraphs: [
            "In this course, a line in the plan is Work people can feel when it changes something in someone's week. 'Case targets are reduced by a fifth in week one' is work people can feel. So is 'Sam sits with each person for their first two cases' and 'we meet for ten minutes at 9.15 each day'. Each of these changes what happens to a person, who helps them, or what is expected of them.",
            "A line is Only an announcement when it tells people about the change without changing anything for them. 'Send a reminder on day one', 'share the training video' and 'tell people to shout if they have problems' are all only announcements. They are not wrong, and a plan may contain some of them. But a plan made only of announcements leaves each person to cope alone, with the same workload, while everything takes longer.",
          ],
          beforeAfter: {
            before: "Remind everyone about the new system on Monday and share the user guide.",
            after:
              "On Monday and Tuesday, Kemi answers the phones for the first hour so that everyone else can open their first cases with her beside them.",
            reading:
              "The first line tells people something. The second changes their morning: less pressure, and a person next to them while they try it.",
          },
        },
        {
          heading: "The mistake people usually make",
          paragraphs: [
            "The usual mistake is to treat the plan as a communications schedule. The manager lists the emails, the reminders and the survey at the end, and considers the two weeks planned. The team receives more messages than usual and exactly the same workload, and when targets slip in week one, the change gets the blame.",
            "It is also a mistake to treat the plan as a training timetable. Training may be part of it, but a person who sat through an hour of training on Friday still needs someone to ask on Monday. Read each line of your plan and ask whether it changes someone's week. If most lines do not, the plan is still only an announcement.",
          ],
        },
      ],
      workedExample: {
        title: "Planning the fortnight at Harbour Lane Housing",
        inputLabel: "The manager's first idea",
        prompt:
          "Send a reminder on day one. Share the training video. Tell people to shout if they have problems.",
        outputLabel: "The revised two-week plan",
        output:
          "Week one: case targets are reduced by a fifth, because every case will take longer to open. Sam, who tested the system, sits with each person for their first two cases. We meet for ten minutes at 9.15 each day to share what went wrong. Week two: targets return to normal on Thursday if the daily check-ins show that cases are being opened in under five minutes. Anything that cannot be done in the system is written on the shared list, and I take the list to the programme team on Friday.",
        reading: [
          "Every line of Grace's first idea was only an announcement. The team would have been told about the change three times and helped with it not at all.",
          "The revised plan changes people's week. Targets are lighter, a named person sits beside each officer, and a daily check-in gives problems somewhere to go. Each of those is work people can feel.",
          "The plan also says when the support ends. Targets return to normal on Thursday of week two, but only if the check-ins show the work has settled. That condition is honest, and it tells the team that the lighter load is real rather than a gesture.",
        ],
      },
      practice: {
        intro:
          "Here are four lines from a manager's plan for the first two weeks of a new booking system at a physiotherapy clinic. Mark each line with the labels from the section above.",
        check: {
          kind: "mark",
          prompt: `Mark each line of the plan as ${FEEL} or as ${ANNOUNCE}.`,
          passLabel: FEEL,
          failLabel: ANNOUNCE,
          sentences: [
            {
              id: "email",
              text: "Email everyone the go-live date and the login page.",
              fail: true,
              why: "This tells people about the change but does not change anything in their week, so it is only an announcement.",
            },
            {
              id: "slots",
              text: "In week one, each physiotherapist has one fewer appointment each morning to allow time for booking in the new system.",
              fail: false,
              why: "This lightens the load where the change bites, which is work people can feel.",
            },
            {
              id: "nadia",
              text: "Nadia on reception, who tested the system, is the person to ask, and she keeps her diary clear from 8.30 to 9.30 each day.",
              fail: false,
              why: "A named person with protected time changes who helps people and when, which is work people can feel.",
            },
            {
              id: "poster",
              text: "Put a poster about the new system in the staff room.",
              fail: true,
              why: "A poster tells people something without changing their week, so it is only an announcement.",
            },
          ],
          why: "That is right. The lighter diary and Nadia's protected hour change what happens to people, while the email and the poster only tell them about the change.",
        },
      },
      check: {
        kind: "choose",
        prompt:
          "Two managers planned the first two weeks of a move to a new ordering system. Choose the plan that is work people can feel.",
        leftLabel: "Plan A",
        left: "Day one: all-staff email. Day two: training video link. Day five: reminder email. End of week two: survey on how it went.",
        rightLabel: "Plan B",
        right:
          "Week one: Priya and Joe each look after half the team and sit with them for their first three orders. Urgent orders can still be phoned through to Priya, who enters them. A ten-minute check-in each afternoon. Week two: phoned orders stop on Monday. The check-in moves to Tuesday and Thursday only.",
        correct: "right",
        why: "Plan B changes people's week: a named helper, a fallback for urgent orders, a regular check-in, and a clear end to the fallback on the Monday of week two.",
        wrong:
          "Look again at Plan A. Every line is only an announcement. Nothing in it changes what anyone does, who helps them, or what is expected of them, so each person would cope alone while everything takes longer.",
      },
      bridge:
        "During those two weeks you will hear objections, and the next lesson shows you how to tell which ones should change your plan.",
    },
    {
      id: "hearing-the-objection",
      title: "Hearing the objection",
      emphasis: "objection",
      place:
        "This lesson sits between the second and third modules. It prepares you for the conversations that happen in the check-ins and at people's desks during the first two weeks.",
      sections: [
        {
          heading: "Objections are information",
          paragraphs: [
            "When people object to a change, it is tempting to hear resistance and to answer it with encouragement. That is often a mistake. An objection is information about how the change is landing, and some of it is information you cannot get any other way, because the person objecting is the one doing the work.",
            "The people who designed the new tool tested it on typical cases. Your team handles the untypical ones every day: the tenant with two addresses, the shift that crosses midnight, the customer who pays in two instalments. When one of them says the new way does not work, they may be telling you about a gap that nobody else has found yet.",
          ],
        },
        {
          heading: "Two kinds of objection",
          paragraphs: [
            "In this course, an objection Names a real cost when it points to something the change makes worse in the work. A step now takes three times as long. A case cannot be entered at all. A group of staff cannot reach the tool where they work. A customer will be affected. That kind of objection should change your plan, or it should go up to the people who can change the tool, with a date by which you expect an answer.",
            "An objection Asks for reassurance when it expresses worry about the change itself rather than a problem in the work. Fear of making a mistake in front of colleagues, doubt that the change will last, and a sense of not being good with technology are all of this kind. That kind of objection should be answered honestly and with something concrete, such as a person to ask, a check on their first few pieces of work, or a safe place to practise.",
            "Chip and Dan Heath, in Switch, describe how often what looks like resistance is really a lack of clarity about what to do. A reassurance objection is frequently that. The answer is not a speech about why the change is good. It is a clear next step and a person beside them while they take it.",
          ],
        },
        {
          heading: "Why the distinction matters",
          paragraphs: [
            "Treating a real cost as mere worry is how good changes collect bad workarounds. If the officer with the two-address tenant is told not to worry, she will keep that tenant in a private spreadsheet, and so will everyone else with a similar case. Six months later the new system holds most of the work and a dozen private spreadsheets hold the hard cases, which is exactly the situation the change was meant to end.",
            "Treating worry as a cost to be fixed leads the other way, to endless redesign. If every nervous comment becomes a request to the programme team, the tool is never allowed to settle, and the person who was worried is no less worried, because what they needed was help, not a new feature.",
          ],
          beforeAfter: {
            before: "Don't worry about the split shifts, everyone finds it tricky at first.",
            after:
              "You're right that the tool can't record split shifts yet. Keep those on paper for now. I've put it on the list for the programme team and asked for a fix by Friday.",
            reading:
              "The first reply treats a real cost as worry, which leaves the person with a workaround and no end to it. The second treats it as a cost, allows a temporary fallback, and sends it to someone who can fix it.",
          },
        },
        {
          heading: "The mistake people usually make",
          paragraphs: [
            "The usual mistake is to sort objections by who makes them rather than by what they say. The team member who complains about everything is assumed to be worrying, and the quiet one who rarely objects is assumed to have found a real problem. Both assumptions are sometimes wrong. Read the comment itself and ask whether it names something in the work that is now worse.",
            "Some comments carry both. 'I can't find the tenant history, and I'm worried I'll give someone the wrong advice' names a real cost and asks for reassurance in the same breath. Answer both parts: fix or escalate the missing history, and give the person a way to check their advice until it is fixed.",
          ],
        },
      ],
      workedExample: {
        title: "The first check-in at Harbour Lane Housing",
        inputLabel: "What the manager heard",
        prompt:
          "First comment: 'Tenants with two addresses can't be set up in the new system, so I've been keeping them in my old spreadsheet.' Second comment: 'I'm worried I'll get it wrong and a tenant will be left waiting.'",
        outputLabel: "What the manager did",
        output:
          "For the first comment, Grace wrote it on the shared list, asked the programme team for a fix by Friday, and agreed that the spreadsheet could stay for those tenants until then. For the second, she arranged for Sam to check that officer's first five cases before they were sent.",
        reading: [
          "The first comment names a real cost. The tool cannot handle a kind of case the team meets every week, and the officer has already built a workaround. Grace changed the plan by allowing the spreadsheet for those cases only, and she sent the problem to the people who can fix it, with a date.",
          "The second comment asks for reassurance. Nothing in it says the tool makes the work worse. The officer is worried about making a mistake that affects a tenant. Grace answered it with a person and a safety net, not with a change to the system.",
          "Grace did not tell either person that the change was good for them. She took the first comment seriously as information and the second seriously as a feeling, and she gave each a concrete response that matched it.",
        ],
      },
      practice: {
        intro:
          "A payroll officer at Marlowe Care said this in the first week of a new timesheet tool: 'The tool can't record split shifts, so I'm still keeping a paper sheet for those.' Choose the better response. The before and after in the section above will help.",
        check: {
          kind: "choose",
          prompt: "Choose the response that treats this objection the way the lesson describes.",
          leftLabel: "Response A",
          left: "Don't worry, everyone finds the new tool hard at first. Stick with it and you'll soon get used to it, and please try not to use paper.",
          rightLabel: "Response B",
          right:
            "That's a real gap. Keep split shifts on paper until it's fixed. I've added it to the list for the programme team and asked for an answer by Thursday.",
          correct: "right",
          why: "Response B hears a real cost, because the tool cannot record a kind of shift the team works. It allows a temporary fallback and sends the problem to someone who can fix it, with a date.",
          wrong:
            "Look again at Response A. It treats a real cost as a worry. The officer is not nervous about the tool; the tool cannot record split shifts. Telling her to stick with it leaves her with a paper workaround and no end to it.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "A manager heard these four comments in the first week of a new rota tool. Mark each comment with the label it deserves.",
        passLabel: COST,
        failLabel: REASSURE,
        sentences: [
          {
            id: "contract",
            text: "The tool won't let me swap a shift with someone on a different contract, so I have to ask you every time.",
            fail: false,
            why: "This comment names a specific step the tool cannot do, which makes the work worse. That is a real cost, and it should change the plan or go to the people who can change the tool.",
          },
          {
            id: "apps",
            text: "I'm not very good with apps, and I don't want to mess up everyone's rota.",
            fail: true,
            why: "Nothing here says the tool makes the work worse. The speaker is worried about getting it wrong, which is best answered with a person to ask and a way to check.",
          },
          {
            id: "lastTime",
            text: "Last time we changed systems we went back after three months, so why bother?",
            fail: true,
            why: "This comment is about whether the change will stick, not about a step in the work. It needs an honest answer about what is different this time.",
          },
          {
            id: "signal",
            text: "The night shift can't see the rota on their phones because there's no signal in the warehouse.",
            fail: false,
            why: "This names a group of staff who cannot reach the tool where they work. That is a real cost to fix, not a request for reassurance.",
          },
        ],
        why: "That is a careful reading. The contract swaps and the missing signal are real costs that should change the plan, while the worry about apps and the doubt about the last change ask for reassurance and should be answered with a person and an honest reply.",
      },
      bridge:
        "Objections tell you what is going wrong, and the next lesson shows you how to know what is going right.",
    },
    {
      id: "how-you-know",
      title: "How you know",
      emphasis: "know",
      place:
        "This lesson is the third module of the course. It gives you a way to tell, at the end of week two, whether the change is holding or whether the work has quietly gone back to the old route.",
      sections: [
        {
          heading: "Decide in advance what you expect to see",
          paragraphs: [
            "At the end of the first fortnight someone will ask how the change is going. If you have not decided in advance what you would expect to see, you will answer with whatever number is to hand, and the number to hand is usually about the tool rather than the work. You may be persuaded by a figure that looks good and means very little.",
            "The discipline is to write down, before go-live, what would have to be true in the work at the end of week two if the change were holding. Then, on the second Friday, you go and look. Kotter's point about making short-term wins visible depends on this: a win is only a win if it is something you can see in the work and would not have seen before.",
          ],
        },
        {
          heading: "Two kinds of measure",
          paragraphs: [
            "In this course, a Sign in the work is something you could see in the work itself that would only be true if people had changed what they do. 'Every new case this week was opened in the system' is a sign in the work. So is 'no holiday requests arrived by email after 15 May', because it tells you the old route has gone quiet.",
            "A Count of activity is a number about the tool. Logins, pages viewed, and the number of people who finished the training module are all counts of activity. They are easy to collect and they are often what a dashboard shows first, but a person can log in every day and still do the real work somewhere else. A high count of activity is consistent with a change that has not happened.",
          ],
          beforeAfter: {
            before: "Target: 95% of staff have completed the e-learning module by go-live.",
            after:
              "By the second Friday, every stock request for the week has come through the ordering form. I will check Dev's inbox for any emailed requests after 13 June.",
            reading:
              "The first measure could be met by a team still ordering by email. The second could only be met if the orders had moved, and it says how the manager will check.",
          },
        },
        {
          heading: "Say how you will check",
          paragraphs: [
            "A sign in the work is only useful if you say how you will look for it. 'Everyone uses the new board' is a hope. 'On the second Friday I will pick ten tasks at random from last week and check each one is on the board with an owner and a date' is a check. The second version tells you what to do on Friday afternoon and tells a colleague exactly what you meant.",
            "The check does not need to be elaborate. Picking a handful of pieces of work at random and looking at where they were done is usually enough. What matters is that it looks at the work, that you decided on it in advance, and that you will do it on a date you have put in your diary.",
          ],
        },
        {
          heading: "The mistake people usually make",
          paragraphs: [
            "The usual mistake is to accept the programme team's measure as your own. Programme teams report across many teams at once, so they tend to measure what the tool can count automatically, and that is usually logins or completions. Those numbers are useful to them. They are not evidence that your team's work has moved.",
            "You do not need to argue with the programme team's measure. Report it if they ask for it. But set your own sign in the work alongside it, because you are the one who has to know, at the end of week two, whether to lift the extra support or keep it for another week.",
          ],
        },
      ],
      workedExample: {
        title: "Replacing the login target at Harbour Lane Housing",
        inputLabel: "The programme team's suggested measure",
        prompt: "Target: 95% of staff logged in by the end of week two.",
        outputLabel: "The manager's own measure",
        output:
          "By the end of week two, every case opened in that week has its first note in the new system, not in an email or a Word file. I will check this by picking ten cases at random on the second Friday and looking at where their first note is.",
        reading: [
          "The login target could be met by a team that was still working entirely in email. An officer could log in each morning, glance at the screen, and then open every case as an email thread, and the dashboard would show full marks.",
          "Grace's sign could only be met if the work had moved. The first note on a case is written when the case is opened, so if it is in the system, the case was opened there.",
          "Her measure also says how she will check it and when. Ten cases at random on the second Friday is a small, specific task she can put in her diary, and its result tells her whether to lift the lighter targets or keep them.",
        ],
      },
      practice: {
        intro:
          "A finance manager at Oakridge Builders was given this target for a new purchase order system. Edit it into a sign in the work. The section above on saying how you will check is still on the page.",
        check: {
          kind: "edit",
          prompt:
            "Edit this target so that it describes something you would see in the work at the end of week two, and says how you will check it. Keep the end of week two as the point you measure.",
          label: "The target you are editing",
          start: "Target: 90% of the finance team logged in to the purchase order system by the end of week two.",
          unchanged:
            "You have not changed the target yet. Replace the login count with something every order would show, and say how you will check it.",
          limitWording: false,
          keep: [
            {
              id: "when",
              any: ["week two", "second friday", "fortnight", "two weeks"],
              missing: "Keep the point you measure. The target should still say it is checked at the end of week two.",
            },
          ],
          limits: [
            {
              id: "work",
              any: ["every order", "every purchase", "every po", "all orders", "no order", "no purchase", "none", "not one", "each order"],
              missing:
                "The target does not yet describe the work. Say what every order would show if the change were holding, for example 'every order raised in week two has a purchase order number from the new system'.",
            },
            {
              id: "check",
              any: ["check", "pick", "sample", "at random", "look at", "go through"],
              missing:
                "The target does not yet say how you will check it. Add a sentence such as 'I will pick ten invoices at random on the second Friday and check each has a purchase order from the system'.",
            },
          ],
          why: "That edit works. The target now describes something every order would show, it says how you will check, and it still measures at the end of week two, so a team that logged in and carried on the old way would not pass it.",
          result: {
            label: "One edit that would pass",
            text: "By the end of week two, every order raised that fortnight has a purchase order number from the new system before the invoice arrives. On the second Friday I will pick ten invoices at random and check each one.",
          },
        },
      },
      check: {
        kind: "mark",
        prompt:
          "A manager wrote these four measures for a move to a shared task board. Mark each measure with the label it deserves.",
        passLabel: SIGN,
        failLabel: COUNT,
        sentences: [
          {
            id: "logged",
            text: "Everyone in the team has logged in to the board.",
            fail: true,
            why: "Logging in shows access, not that the work has moved. A person can log in and still track their tasks elsewhere, so this is a count of activity.",
          },
          {
            id: "meeting",
            text: "At Monday's meeting, we run through the board rather than a spoken round of updates, and nobody has a task that is not on it.",
            fail: false,
            why: "This can only be true if people are really using the board for their work. The meeting itself runs from the board, which is a sign in the work.",
          },
          {
            id: "training",
            text: "Ten people completed the board training module.",
            fail: true,
            why: "Finishing a module shows training happened, not that the work changed. Training completion is about the course, so this is a count of activity.",
          },
          {
            id: "email",
            text: "No task requests have arrived by email since the second Monday.",
            fail: false,
            why: "The old route has gone quiet, which tells you the habit has changed. That is a sign in the work.",
          },
        ],
        why: "That is right. The Monday meeting and the quiet inbox could only be true if the work had moved to the board, while logins and training completions could be met by a team still working the old way.",
      },
      bridge:
        "You now have every move the plan needs. The next lesson puts them together on situations you have not seen, and it ends with the course assessment.",
    },
    {
      id: "putting-the-two-weeks-together",
      title: "Putting the two weeks together",
      emphasis: "together",
      place:
        "This is the course assessment, the sixth of seven lessons. It recaps the method in full, works one mixed example, and then asks you to apply every move to new situations before you write your own plan.",
      sections: [
        {
          heading: "The method in one place",
          paragraphs: [
            "You began by restating the change as work. A sentence about the change is something they do when it names a step in someone's week, and something the tool has when it describes a capability. Your team needs the first kind, because that is what they will feel on the first morning.",
            "You then named the old habit that must stop, with a date and a way it stops. Without an end, the old route stays open and stays in use. With a short overlap and a clear end, people can finish what they started and then move.",
            "You planned the first two weeks as work people can feel: a lighter load where the change bites, a named person to ask, and a short, regular check-in. You learned to tell an objection that names a real cost from one that asks for reassurance, and to answer each in the way it needs. And you set a sign in the work for the end of week two, with a check you will do on a date, rather than relying on a count of activity.",
          ],
        },
        {
          heading: "How the moves depend on each other",
          paragraphs: [
            "The moves are not a checklist to be ticked separately. Each one makes the next possible. You cannot set a sign in the work until you know what the work will look like, which is the first move. You cannot say when the lighter load ends until you know what you will see when the work has settled, which is the last move. And the check-in you plan in the first two weeks is where most of the objections will reach you.",
            "When you face a real situation, start by asking which move it calls for. A draft announcement full of features calls for the first. A request to keep the old route open calls for the second. A slipping target in week one calls for the third. A complaint calls for the fourth. A question about whether it is working calls for the fifth.",
          ],
        },
        {
          heading: "How the assessment works",
          paragraphs: [
            "The assessment has six situations, each set in a team you have not met in this course. Each situation has three or four options, and each option is something a reasonable manager might do. Exactly one is right for a reason this course taught. You need five of the six to pass.",
            "After you submit, each question shows whether your choice was right and why. If you do not reach five, the feedback names the questions you missed and what to look at again, and you can change your answers and try again. Your answers are not shown to anyone who checks your record.",
          ],
        },
      ],
      workedExample: {
        title: "One note, reviewed with every move",
        inputLabel: "A manager's draft note to her team at Kestrel Dental",
        prompt:
          "Great news: from 1 September we move to the new patient records system, which has digital charting and online booking. Paper charts can carry on while you get used to it. I'm sure it'll save us all time. We'll aim for 100% of staff logged in by the end of the month.",
        outputLabel: "The note after review",
        output:
          "From 1 September, you will chart each appointment on screen instead of on the paper chart, and you will check the day's bookings in the system rather than the diary on reception. Paper charts can be finished for patients already mid-treatment until 12 September; after that, Leanne will scan any paper chart that arrives into the system and let you know. In the first week each clinician has one fewer appointment each morning, and Leanne, who tested the system, is the person to ask. We will meet for ten minutes at 8.20 each day. By the second Friday, every appointment that fortnight should have its chart on screen, and I will check ten at random. I will not tell you it will save time in the first fortnight, because it will not.",
        reading: [
          "The draft opened with features, so the review rewrote them as steps: charting on screen and checking bookings in the system. That is the first move. The draft kept paper open with no end, so the review added a date, 12 September, and a way the route stops, with Leanne scanning stray charts. That is the second.",
          "The draft had no support at all. The review added a lighter diary, a named person and a daily check-in, which is work people can feel. That is the third move, and the check-in is where objections will surface in week one.",
          "The draft measured logins. The review replaced them with a sign in the work, a chart on screen for every appointment, and a check on the second Friday. It also removed the promise that the system would save time, because in the first fortnight it will not, and saying so is what makes the rest of the note believable.",
        ],
      },
      practice: {
        intro:
          "Before the assessment, try one mixed judgement. Two managers at a housing repairs team wrote a note about a new job-booking app. Choose the stronger note, using the whole method above.",
        check: {
          kind: "choose",
          prompt: "Choose the note that would give the change the best chance of holding at the end of week two.",
          leftLabel: "Note A",
          left: "From 7 July, you will book each repair in the app while you are still with the tenant, instead of phoning the office. The office will take phoned bookings until 18 July; after that, Wayne will text you the app link and will not book the job for you. In week one, each operative has one fewer job each day. By the second Friday, every job that week should have been booked in the app, and I will check twenty at random.",
          rightLabel: "Note B",
          right:
            "From 7 July we move to the new job-booking app, which has live scheduling and photo upload. Please try to use it rather than phoning the office. The training video is on the intranet. We are aiming for every operative to have downloaded the app by the end of week two.",
          correct: "left",
          why: "Note A states the change as a step, names the date and way phoned bookings stop, lightens the load in week one, and sets a sign in the work with a check. Note B describes features, has no end to the old route, and measures downloads, which is a count of activity.",
          wrong:
            "Look again at Note B. It describes what the app has, asks people to try it with no date when phoning stops, and measures downloads, which a team still phoning the office could meet. Note A does each of those jobs properly.",
        },
      },
      check: {
        kind: "scenario",
        prompt:
          "Answer all six questions. Each is a situation you have not seen in this course. You need five of the six to pass.",
        passMark: 5,
        questions: [
          {
            id: "announcement",
            situation:
              "Tom Hale manages eight advisers at Brookfield Insurance. The programme team has sent him a draft announcement for the new claims system, which says it 'provides end-to-end claims visibility, smart triage and a modern interface'. Go-live is Monday 10 November, and Tom has been asked to send it to his team by Thursday.",
            question: "What should Tom do with the announcement?",
            options: [
              {
                id: "a",
                text: "Forward it as it stands, because the programme team wrote it and it is accurate.",
                feedback:
                  "It may be accurate, but every sentence is something the tool has. Each adviser would have to work out alone what changes on 10 November, and many would wait and see. The better move is to rewrite it as steps in their week.",
              },
              {
                id: "b",
                text: "Rewrite it as the steps each adviser will take differently from 10 November, and say what each step replaces.",
                correct: true,
                feedback:
                  "That is right. The advisers need to know what they will do on 10 November, not what the system can do. Rewriting each feature as a step in their week is the translation the programme team's email leaves to you.",
              },
              {
                id: "c",
                text: "Add a paragraph at the top saying how much easier the new system will make everyone's work.",
                feedback:
                  "Enthusiasm is not detail. The team will be slower in the first week, and they will remember the promise that it would be easier. The better move is to rewrite the features as steps people will take.",
              },
              {
                id: "d",
                text: "Replace it with a link to the supplier's training videos so people can see the features for themselves.",
                feedback:
                  "Training videos show the tool, not the change in the adviser's week. Each person would still have to work out what they stop and start doing. The better move is to write those steps yourself.",
              },
            ],
          },
          {
            id: "oldRoute",
            situation:
              "Aisha Rahman runs the accounts payable team at Linford Council. Invoices now go through the new approvals tool, which went live on 2 February, but three of her six officers are still emailing invoices to budget holders for sign-off because it is quicker. It is now 9 February.",
            question: "What should Aisha do next?",
            options: [
              {
                id: "a",
                text: "Tell the team the email route closes on 20 February, and that from then she will reply to any emailed invoice with the tool link and will not pay it until it has been approved there.",
                correct: true,
                feedback:
                  "That is right. The old route is still open, so it is still in use. A date, an overlap to finish work in flight, and a visible way of stopping give the team something to plan round.",
              },
              {
                id: "b",
                text: "Leave it, because people will move across in their own time once they are used to the tool.",
                feedback:
                  "The old route is quicker and still open, so under pressure people will keep using it. Waiting means running two routes indefinitely. The better move is to name a date and a way the email route stops.",
              },
              {
                id: "c",
                text: "Block the email route from tomorrow morning so that nobody can use it.",
                feedback:
                  "Closing it overnight with no warning leaves officers with invoices in flight and no safe way to finish them, and it invites workarounds. The better move is a short overlap, a clear date, and a way of stopping that points people to the tool.",
              },
              {
                id: "d",
                text: "Send a reminder asking everyone to use the approvals tool wherever possible.",
                feedback:
                  "A reminder is a preference, and a preference has no date. The three officers already know about the tool. What they need is a date on which email stops and a clear account of what happens after it.",
              },
            ],
          },
          {
            id: "weekOne",
            situation:
              "Ben Carter leads a customer service team of twelve at Tideway Energy. The new ticketing system goes live next Monday. Each adviser normally closes 30 tickets a day, and the programme team has told Ben to expect everyone to be slower in the first week.",
            question: "Which plan for week one is work people can feel?",
            options: [
              {
                id: "a",
                text: "Send a welcome email on Monday, share the user guide on Tuesday, and run a survey on Friday.",
                feedback:
                  "Each of those lines is only an announcement. The advisers would still face a 30-ticket target while every ticket takes longer. The better plan changes their week with a lighter target, a named helper and a check-in.",
              },
              {
                id: "b",
                text: "Keep the target at 30 tickets so that nobody falls behind, and ask people to stay late if they need to.",
                feedback:
                  "Holding the target while everything takes longer puts the whole cost of learning on the advisers, and the change will get the blame. The better plan lightens the load where it bites.",
              },
              {
                id: "c",
                text: "Lower the target to 22 tickets a day in week one, name Chloe, who tested the system, as the person to ask, and hold a ten-minute check-in at 4pm each day.",
                correct: true,
                feedback:
                  "That is right. A lighter target, a named person and a daily check-in each change something in the advisers' week. That is what gets people through the slow fortnight without deciding the new way is worse.",
              },
            ],
          },
          {
            id: "objection",
            situation:
              "In the second check-in at Harlow Veterinary Group, a receptionist, Jess, says: 'The new booking screen won't let me book an emergency appointment into a slot that's already full, so I've had to turn two callers away.' The practice manager, Owen, has to decide what to do before the next day's list.",
            question: "How should Owen treat Jess's comment?",
            options: [
              {
                id: "a",
                text: "Reassure Jess that she will get quicker with the screen and ask her to keep trying.",
                feedback:
                  "Jess is not worried about the screen. She is telling you it cannot do something the practice needs, and callers are being turned away. Treating a real cost as worry leaves the problem in place. The better move is a fallback and an escalation.",
              },
              {
                id: "b",
                text: "Treat it as a real cost: agree that emergencies are booked on paper and entered later until it is fixed, and send it to the programme team asking for a fix by a named date.",
                correct: true,
                feedback:
                  "That is right. The comment names something the tool makes worse, with a real effect on callers. It should change the plan straight away with a fallback, and it should go to the people who can change the tool, with a date.",
              },
              {
                id: "c",
                text: "Arrange for someone to sit with Jess for her next few bookings so she feels more confident.",
                feedback:
                  "A person beside her is the right answer to a worry, but this is not a worry. The screen cannot book an emergency into a full slot, and sitting with Jess will not change that. The better move is a fallback and an escalation.",
              },
            ],
          },
          {
            id: "measure",
            situation:
              "Rachel Obi manages a planning team of nine at Fenmoor District Council. They have moved from a shared spreadsheet to a new task board for tracking planning applications. The programme team's dashboard shows that all nine people logged in every day of week one, and her director asks her on the second Friday whether the change has worked.",
            question: "What should Rachel look at before she answers?",
            options: [
              {
                id: "a",
                text: "The login figures, since daily use by all nine people shows the board is in use.",
                feedback:
                  "Logins are a count of activity. All nine people could log in each day and still track their applications in the spreadsheet. The better move is to look at the work itself.",
              },
              {
                id: "b",
                text: "Whether everyone completed the board training before go-live.",
                feedback:
                  "Training completion shows the course happened, not that the work moved. It is a count of activity. The better move is to check where the applications themselves are being tracked.",
              },
              {
                id: "c",
                text: "How many comments people have added to cards on the board.",
                feedback:
                  "Comments are still activity on the tool. They could be added to a handful of cards while most applications live in the spreadsheet. The better move is to check a sample of the applications themselves.",
              },
              {
                id: "d",
                text: "Ten applications picked at random from the past fortnight, checking that each has a card on the board with its current stage and an owner, and whether anyone has edited the old spreadsheet since go-live.",
                correct: true,
                feedback:
                  "That is right. Both checks look at the work. A card for every sampled application and a quiet spreadsheet can only be true if the team has really moved, which is what her director needs to know.",
              },
            ],
          },
          {
            id: "honest",
            situation:
              "Priya Nair manages a small legal support team at Aldgate Chambers that is moving from paper bundles to an electronic bundling tool on 3 March. She is writing her two-week plan and wants the team to take the change seriously. Two of her team have been through a failed system change before.",
            question: "Which line should Priya put in her plan?",
            options: [
              {
                id: "a",
                text: "I will not tell the team the tool will be quicker in the first fortnight, because it will not, and I will not promise a fix for anything until the programme team confirms it.",
                correct: true,
                feedback:
                  "That is right. Saying plainly what you will not pretend is what makes the rest of the plan believable, particularly to people who have seen a change fail before. It also stops you making promises you cannot keep.",
              },
              {
                id: "b",
                text: "Tell the team that this change is different from last time and will definitely succeed.",
                feedback:
                  "A promise that the change will succeed is exactly what the two people who saw the last one fail will doubt. It asks them to trust a feeling. The better line says honestly what will be hard and what you will not claim.",
              },
              {
                id: "c",
                text: "Tell the team the tool will save everyone an hour a day from the first week.",
                feedback:
                  "In the first fortnight the tool will almost certainly be slower, and the team will notice the gap between the promise and their week. The better line is honest about the slow start.",
              },
            ],
          },
        ],
        why: "You applied every move in the course to situations you had not seen: rewriting features as work, closing the old route with a date, planning a fortnight people can feel, hearing a real cost, looking at the work rather than a count, and being honest about the slow start.",
      },
      bridge:
        "You have shown that you can apply each move. In the final lesson you write the two-week plan for a real change in your own team, and that plan becomes your record.",
    },
    {
      id: "your-two-week-plan",
      title: "Your two-week plan",
      emphasis: "plan",
      place:
        "This is the fourth module and the last lesson. The plan you write here is the work your signed record will show.",
      sections: [
        {
          heading: "What the plan covers",
          paragraphs: [
            "Your plan covers the first two weeks of a real change in your team. It states the change as things people will do. It names the old habit and the date and way it stops. It lists what will be harder and what you will do about it, names who each person can ask, and sets the check-in. It notes the objections you expect and how you will treat them. And it states the sign in the work you expect at the end of week two, with how you will check it.",
            "It also contains one sentence on what you will not pretend, such as 'I will not tell the team it will be quicker in week one'. That sentence matters more than it looks. It is the line that tells your team the rest of the plan is honest, and it stops you making a promise in the first week that you will have to take back in the second.",
          ],
        },
        {
          heading: "What the plan is not",
          paragraphs: [
            "The plan is not a communications plan. It may lead to an email, but its job is to decide what changes in people's week, not what they are told. It does not need the approval of the programme team, although you may share it with them, and it may well give them useful warning of the objections you expect.",
            "It is also not a document for its own sake. Write it for a real change you are about to lead, or one you led recently. If you use names, use the names of roles or first names you would be comfortable showing, because the plan will appear on a record that a second person can open.",
          ],
        },
        {
          heading: "The covering test",
          paragraphs: [
            "The test for the plan is whether a colleague covering your leave in week one could run it without ringing you. In this course, a line is Someone covering could run it when it gives them everything they need to act: a date, a name, a time, a number, or a check they can do. A line is Someone covering would have to ask when it leaves them guessing what you meant, who you meant, or when.",
            "'Case emails stop on 17 March, and the inbox sends an automatic reply with the form' is a line someone covering could run. 'Phase out email over time' is a line someone covering would have to ask about. Read each part of your plan with that colleague in mind before you continue.",
          ],
        },
        {
          heading: "How the plan is checked",
          paragraphs: [
            "When you continue, each part is checked in turn. The change must be stated as things people will do, not as features. What they stop doing must name the habit, a date and a way it stops. What will be harder must name a difficulty and something you will do that changes someone's week. Who they ask must name a person or a role and what they will do. The check-in must have a time or a day and a frequency.",
            "Objections must include at least one, labelled as a real cost or as a request for reassurance, with a response that matches the label. The sign in the work must say what you will see in the work and how you will check it, and it must not be a count of logins, views or completions. What you will not pretend must be a full sentence. If a part is missing, the note names it and says what to add. When every part is present, you sign your name against the plan.",
          ],
        },
      ],
      workedExample: {
        title: "Grace's plan for Harbour Lane Housing",
        inputLabel: "Grace's notes from the earlier lessons",
        prompt:
          "Rewrite of the announcement; 17 March end date for email; Sam as helper; 9.15 check-in; two-address tenants; worry about mistakes; ten cases at random on the second Friday.",
        outputLabel: "The last lines of her plan",
        output:
          "Sign in the work: by the second Friday, every case opened since 3 March has its first note in the new system; I will check ten at random. What I will not pretend: I will not tell the team that the system will save time in the first fortnight, because it will not, and I will not promise that the two-address problem is fixed until the programme team confirms it.",
        reading: [
          "Grace's notes were a list of decisions she had made across the course. The plan turns each decision into a line someone covering could run, with the date, the name, the time and the check written out in full.",
          "The sign in the work is observable in the cases themselves and says how she will check it. The line on what she will not pretend names two things she could have been tempted to promise, and declines both.",
          "The plan is specific enough for someone covering Grace's leave to run, and honest enough that her team will believe it. That is the standard your own plan has to meet.",
        ],
      },
      practice: {
        intro:
          "Before you write your own plan, read these four lines from a manager's plan at a dental practice and mark each one with the covering test from the section above.",
        check: {
          kind: "mark",
          prompt: `Mark each line as ${RUN} or as ${ASK}.`,
          passLabel: RUN,
          failLabel: ASK,
          sentences: [
            {
              id: "stop",
              text: "What they stop doing: paper charts stop on 12 September, and Leanne scans any that arrive after that date.",
              fail: false,
              why: "This line names the habit, a date and a way it stops, with a person, so someone covering could run it.",
            },
            {
              id: "ask",
              text: "Who they ask: someone from IT.",
              fail: true,
              why: "'Someone from IT' names no person and says nothing about when they are available, so someone covering would have to ask who it means.",
            },
            {
              id: "checkin",
              text: "The check-in: ten minutes at 8.20 each morning in week one, then Tuesday and Thursday in week two.",
              fail: false,
              why: "This gives a time and a frequency for both weeks, so someone covering could run it.",
            },
            {
              id: "sign",
              text: "Sign in the work: see how it goes.",
              fail: true,
              why: "This says nothing about what to look for or how to check, so someone covering would have to ask what success looks like.",
            },
          ],
          why: "That is right. The stop date and the check-in give someone covering everything they need, while 'someone from IT' and 'see how it goes' would leave them ringing you.",
        },
      },
      check: {
        kind: "build",
        prompt:
          "Write the two-week plan for the change coming to your team. Include every part, so that a colleague covering your leave could run it.",
        fields: [
          {
            id: "change",
            label: "The change, as things people do",
            hint: "At least two steps people will take differently, each starting 'you will', and what each replaces.",
            min: 40,
            any: ["you will", "you'll", "we will", "they will", "instead of", "rather than", "no longer"],
            missing:
              "The change, as things people do, still reads like a description of the tool. Write at least two things people will do differently, such as 'you will open each case in the system instead of starting an email'.",
          },
          {
            id: "stop",
            label: "What they stop doing",
            hint: "The old habit, the date it stops, and what happens if someone uses it after that date.",
            min: 30,
            rule: "fact",
            any: [
              "stop",
              "no longer",
              "ends",
              "closes",
              "closed",
              "read-only",
              "read only",
              "automatic reply",
              "auto-reply",
              "switched off",
              "turned off",
              "will not accept",
              "won't accept",
            ],
            missing:
              "What they stop doing needs the old habit, a date, and the way it stops. Write it as, for example, 'Case emails stop on 17 March, and the inbox sends an automatic reply with the form'.",
          },
          {
            id: "harder",
            label: "What will be harder, and what you will do",
            hint: "What will be slower or harder in the first two weeks, and a lighter load, a helper, or a fallback that changes someone's week.",
            min: 40,
            any: [
              "slower",
              "harder",
              "longer",
              "lighter",
              "reduce",
              "lower",
              "fewer",
              "sit with",
              "fallback",
              "cover",
              "extra time",
            ],
            missing:
              "What will be harder does not yet name a difficulty and an action. Say what will be slower or harder, and what you will do that changes someone's week, such as a reduced target, a helper who sits with them, or a fallback.",
          },
          {
            id: "ask",
            label: "Who they ask",
            hint: "A named person or role, and what they will do or when they are available.",
            min: 8,
            rule: "role",
            any: ["ask", "sit", "help", "tested", "lead", "champion", "supervisor", "manager", "buddy", "contact", "go to", "available"],
            missing:
              "Who they ask does not yet name a person to go to. Give a name or a role and what they will do, for example 'Sam, who tested the system, sits with each person for their first two cases'. 'IT' or 'the team' is not enough.",
          },
          {
            id: "checkin",
            label: "The check-in",
            hint: "When it happens, how long it lasts, and how often, in each of the two weeks.",
            min: 20,
            rule: "fact",
            any: [
              "daily",
              "each day",
              "every day",
              "each morning",
              "every morning",
              "each afternoon",
              "weekly",
              "twice",
              "minutes",
              "monday",
              "tuesday",
              "wednesday",
              "thursday",
              "friday",
            ],
            missing:
              "The check-in needs a time or a day and a frequency. Write it as, for example, 'ten minutes at 9.15 each day in week one, then Tuesday and Thursday in week two'.",
          },
          {
            id: "objections",
            label: "Objections you expect",
            hint: "At least one objection, labelled as a real cost or as asking for reassurance, with the response that matches.",
            min: 40,
            any: ["real cost", "reassurance"],
            missing:
              "Objections you expect needs at least one objection labelled as a real cost or as asking for reassurance, with a response that matches the label.",
          },
          {
            id: "sign",
            label: "Sign in the work",
            hint: "What you will see in the work at the end of week two, and how and when you will check it. Not logins, views or completions.",
            min: 40,
            any: ["check", "pick", "sample", "look at", "at random", "go through"],
            missing:
              "The sign in the work needs to say how you will check it. Describe what the work will show at the end of week two, and add how you will look, for example 'I will check ten cases at random on the second Friday'.",
          },
          {
            id: "pretend",
            label: "What you will not pretend",
            hint: "One full sentence on what you will not claim or promise to the team.",
            min: 20,
            any: ["will not", "won't", "not pretend", "not tell", "not promise", "not say", "not claim"],
            missing:
              "What you will not pretend needs a full sentence that says what you will not claim, for example 'I will not tell the team it will be quicker in week one'.",
          },
        ],
        why: "Your plan describes the change as work, names what stops and when, plans for the hard parts, names who to ask, sets a check-in, labels the objections you expect, and sets a sign in the work you will check. A colleague covering your leave could run it.",
      },
      bridge:
        "Your signed plan is on your record. Put the check at the end of week two in your diary now, so that on the second Friday you look at the work and not at the dashboard.",
    },
  ],
};
