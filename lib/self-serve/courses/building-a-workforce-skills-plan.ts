/*
Course: Building a Workforce Skills Plan
Slug: building-a-workforce-skills-plan
For: HR business partners, L&D leads, workforce planners, and heads of function who have been asked for a
  skills plan, often in response to new technology. They know the roles in their area and can find out
  which changes are already decided for the next six months. They need no analytics software or taxonomy.
Outcome: The learner builds a skills plan for the next two quarters that starts from changes to the work
  that have been decided, names no more than three skills per affected role written as observable work,
  gives each skill a measure, an owner, and a time, and says what will not be trained and what will be
  done instead. They can defend each line by pointing to the change it responds to.
Artefact: The skills plan, one page for two quarters.
Record sentence: Wrote and signed a one-page skills plan for two quarters, with every skill tied to a
  decided change and an owner.
Lessons (id, title, move, interaction, pass rule):
  1. the-work-that-is-changing, The work that is changing. Tell a change we can point to from a trend we
     are guessing at. Mark. Every statement marked correctly.
  2. skills-by-role, Skills by role. Write a skill as observable work for a named role, tied to a change.
     Choose. The row with a named role, an observable skill, and a dated change.
  3. what-you-will-not-train, What you will not train. Decide Train or Solve another way. Mark. Every gap
     marked correctly.
  4. the-few-that-matter, The few that matter. Cut a long list to three using the four questions. Edit.
     Skills 1 and 3 kept, and a reason given for cutting the colour scheme (no consequence), for cutting
     the two non-skills (not observable or not tied to the change), and for moving the report (few people
     or infrequent).
  5. measures-owners-and-dates, Measures, owners, and dates. Give each skill a measure, an owner by role,
     and a time set against the change. Choose. The row a manager could act on without asking.
  6. course-assessment, Course assessment. Apply every move to new situations. Scenario, seven questions,
     pass mark six.
  7. the-plan, The plan. Write the one-page plan. Build. Changes with a date and evidence word; skills with
     a role; measures with an owner word and a date; not trained with an alternative; later list with a
     review word and a date; plan owner with an owner word and a date.
Sources: CIPD factsheet on workforce planning; CIPD Profession Map; World Economic Forum, The Future of
  Jobs Report 2025 (background only); CIPD factsheet on learning and development strategy; Cathy Moore,
  Map It, 2017.
Tested on phone:          no
Tested returning learner: no
Pass rule tests written:  yes
*/

import type { CourseContent } from "./types.ts";

const POINT = "A change we can point to";
const GUESS = "A trend we are guessing at";
const TRAIN = "Train";
const OTHER = "Solve another way";
const READY = "Ready to act on";
const ASK = "A manager would have to ask";

export const COURSE: CourseContent = {
  slug: "building-a-workforce-skills-plan",
  hours: 2,
  artefact: {
    lessonId: "the-plan",
    title: "The skills plan",
    recordLine:
      "Wrote and signed a one-page skills plan for two quarters, with every skill tied to a decided change and an owner.",
  },
  lessons: [
    {
      id: "the-work-that-is-changing",
      title: "The work that is changing",
      emphasis: "changing",
      place:
        "This is the first of seven lessons. A skills plan starts from the work, and this lesson sets out which changes to the work belong in a plan for the next two quarters and which do not.",
      sections: [
        {
          heading: "Start from the work, not from a list of skills",
          paragraphs: [
            "Most requests for a skills plan arrive as a request for a list. A director has read something about new technology, or a board paper has asked whether the organisation has the skills it needs, and someone in HR is asked to produce the skills. The quickest response is a long list of competencies, and it is the response that most often leads to nothing, because a list of skills with no change behind it gives no one a reason to act by a particular date.",
            "This course starts somewhere else. A skills plan for the next two quarters should start from the changes to the work that are already decided or under way in your part of the organisation. When a system goes live, a process is redesigned, a service is added, or a role is merged, particular people will need to do particular things differently from a particular date. That is where a skill need comes from, and it is the only starting point that tells you who, what, and when.",
          ],
        },
        {
          heading: "A change we can point to",
          paragraphs: [
            "In this course, A change we can point to is a change with evidence inside the organisation. The evidence is something you could show a sceptical manager: a system with a go-live date in an approved project plan, a process redesign that a committee has signed off, a new service with a launch plan, a regulation with a known date that applies to your organisation, or a role that is being created or removed from a stated month.",
            "Each of these has a date and an owner, even if the date may move. You can ring the project manager and ask which teams will use the new system first. You can read the signed-off process and see which steps change. That is what makes it a change we can point to: someone has decided it, and you can find out exactly what it alters.",
          ],
        },
        {
          heading: "A trend we are guessing at",
          paragraphs: [
            "A trend we are guessing at is a general claim about the future of work. Statements such as 'AI will transform every job', 'everyone will need data skills', or 'customers expect digital service' may be true in some form, and they may be worth discussing, but none of them says which role in your area changes, how its work changes, or by when.",
            "Reports such as the World Economic Forum's Future of Jobs Report are useful background when you think about direction over several years. They are not evidence for a two-quarter plan in your team, because they describe economies and sectors, not your claims department or your outpatient clinic. A plan built on trends alone will be vague, and a vague plan cannot be delivered or checked.",
          ],
        },
        {
          heading: "Why the distinction matters, and the usual mistake",
          paragraphs: [
            "Starting from changes you can point to keeps the plan short, because only a few changes are ever decided for the next six months. It keeps the plan honest, because each line rests on a decision someone else has made. It also makes each line defensible, because when a manager asks why their team is on the plan, you can name the system, the date, and the project that caused it.",
            "The usual mistake is to treat a trend as though it were a change, because it sounds urgent and senior people are talking about it. The result is a plan that asks everyone to learn something general, with no date and no owner, and it quietly stalls. Setting trends aside is not a refusal to think ahead. It is a decision to plan for what is known now, to note the trends as questions, and to review the plan as more is decided.",
          ],
        },
      ],
      workedExample: {
        title: "Six statements from a claims department",
        inputLabel: "The statements collected for the plan",
        outputLabel: "How the HR business partner marked them",
        prompt:
          "1. The new claims system goes live on 1 March. 2. Generative AI is reshaping knowledge work. 3. The fraud referral process changes in April, with a new checklist signed off by the risk committee. 4. Customers increasingly expect digital service. 5. Two team leader roles are being merged into one from May. 6. Everyone will need to be data literate.",
        output:
          "A change we can point to: 1, 3, and 5. A trend we are guessing at: 2, 4, and 6. The trends were kept on a separate note of questions to raise at the next quarterly review.",
        reading: [
          "Marta Hughes, the HR business partner for the claims department at Fenwick Mutual, collected these six statements from managers in one week. Three of them have a date and an owner. The claims system has a go-live date in the project plan, the fraud referral change has a checklist signed off by the risk committee, and the merged team leader role has a start month.",
          "The other three are trends. The statement about generative AI names no system that the department has bought. The statement about digital service names no channel that is changing. The statement about data literacy names no report, no role, and no date. Each may prompt a useful question, but none tells Marta which role must do what by when.",
          "Marta did not throw the trends away. She wrote them on a separate note so that she could ask, at the next review, whether any of them had turned into a decision. The plan itself starts from statements 1, 3, and 5.",
        ],
      },
      practice: {
        intro:
          "Here are three statements from a distribution centre. Mark each one with the two labels from this lesson. The definitions and the claims example are above if you want to read them again.",
        check: {
          kind: "mark",
          prompt: "Mark each statement as a change we can point to or a trend we are guessing at.",
          passLabel: POINT,
          failLabel: GUESS,
          sentences: [
            {
              id: "scanners",
              text: "Handheld scanners replace paper pick lists on 12 February, according to the signed purchase order and rollout plan.",
              fail: false,
              why: "This names equipment, a date, a purchase order, and a rollout plan. It is a change we can point to.",
            },
            {
              id: "robots",
              text: "Warehouses will be mostly automated within the decade.",
              fail: true,
              why: "Nothing here has been decided at this site, and no role or date is named. It is a trend we are guessing at.",
            },
            {
              id: "nights",
              text: "A night shift starts on 7 April, as agreed by the site leadership team.",
              fail: false,
              why: "A shift with a start date agreed by a named team is evidence inside the organisation. It is a change we can point to.",
            },
          ],
          why: "That is right. The scanners and the night shift have a date and a decision behind them, and the claim about automation is a trend with nothing at this site to point to.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "These statements were collected for a skills plan in a hospital's outpatient administration team. Mark each as a change we can point to or a trend we are guessing at.",
        passLabel: POINT,
        failLabel: GUESS,
        sentences: [
          {
            id: "booking",
            text: "The new appointment booking system replaces the current one on 3 June, according to the approved project plan.",
            fail: false,
            why: "This names a system, a date, and an approved plan. It is a change we can point to.",
          },
          {
            id: "automation",
            text: "Automation will remove most administrative work within a few years.",
            fail: true,
            why: "There is no system, no role, and no decision here. It is a trend we are guessing at.",
          },
          {
            id: "letters",
            text: "From September, patient letters will be sent by text message first, as agreed by the operations board.",
            fail: false,
            why: "The operations board agreed this change with a date. It is a change we can point to.",
          },
          {
            id: "self-service",
            text: "Patients will expect more self-service in future.",
            fail: true,
            why: "It may be true, but nothing has been decided inside the organisation and no role or date is named. It is a trend we are guessing at.",
          },
          {
            id: "triage",
            text: "The team is taking on referral triage for two more clinics from July, under the signed service agreement.",
            fail: false,
            why: "A signed agreement with a start month is evidence. It is a change we can point to.",
          },
        ],
        why: "You built the plan on changes with a date and a decision behind them, and set the general trends aside. The booking system, the text-first letters, and the new triage work are the three changes this team's plan can start from.",
      },
      bridge:
        "Each change affects particular roles, and the next lesson writes the skills those roles will need.",
    },
    {
      id: "skills-by-role",
      title: "Skills by role",
      emphasis: "role",
      place:
        "You now have the changes that the plan responds to. This lesson turns each change into the skills that a specific role will need, written so that someone could see whether the skill is there.",
      sections: [
        {
          heading: "What a skill is in this plan",
          paragraphs: [
            "In a skills plan, a skill is something a person in a named role will need to do at work that someone could see. It is written with an action verb, and it is tied to the change that creates the need. 'Book, move, and cancel an appointment in the new system, including for a patient with two linked referrals' is a skill for booking clerks, and it comes from the system change on 3 June.",
            "Each skill row therefore has three parts. There is the role, such as booking clerks or team leaders. There is the skill, written as work someone could watch. There is the change, which is one of the changes you can point to from the first lesson. If any of the three is missing, the row is not yet ready for the plan.",
          ],
        },
        {
          heading: "What a skill is not",
          paragraphs: [
            "A skill is not a topic. 'Digital skills' and 'data' are topics, and they do not say what the person will do. A skill is not a trait. 'Adaptability' and 'resilience' may describe people you would like to work with, but no one can watch a clerk be adaptable in the new booking screen. A skill is not a course title either. 'Introduction to the new system' describes something the organisation might run, not something the person must be able to do afterwards.",
            "Competency frameworks, including the CIPD Profession Map for the people profession, describe capability at a higher level than this. They are useful for careers and development conversations over years. A plan for two quarters needs the level of the work itself, because it has to say what will be different on the day of the change.",
          ],
          beforeAfter: {
            before: "Role: all staff. Skill: digital confidence. Change: digital transformation.",
            after:
              "Role: claims handlers. Skill: register a new claim in the new system and attach the customer's evidence, including documents that arrive after registration. Change: new claims system live from 1 March.",
            reading:
              "The first row names everyone, describes a trait, and points to a trend. The second names one role, describes work a team leader could watch, and points to a dated change.",
          },
        },
        {
          heading: "Why it matters at work",
          paragraphs: [
            "Writing skills this way makes it plain which roles are affected and which are not. A plan that says 'all staff' asks everyone to learn everything, and managers of unaffected teams will rightly ignore it. A plan that names claims handlers and team leaders tells the other teams that this change does not alter their work, and saying so is part of the plan.",
            "It also makes it possible to check later whether the skill is there. If the skill is 'register a claim and attach late evidence', a team leader can sit with a handler in the second week and watch it done. If the skill is 'digital confidence', there is nothing to watch. The usual mistake is to write the skill as a noun because it is quicker, and then find that no one can say whether the plan worked.",
          ],
        },
      ],
      workedExample: {
        title: "Two rows for text-first letters",
        inputLabel: "The change",
        outputLabel: "The skill rows written for it",
        prompt:
          "From September, patient letters will be sent by text message first, as agreed by the operations board.",
        output:
          "Role: outpatient administrators. Skill: check a patient's contact preference and mobile number before sending, and switch to a posted letter when the patient has asked for one. Change: text-first letters from September.\nRole: team leaders. Skill: run the weekly report of failed text messages and assign each one to an administrator for follow-up. Change: text-first letters from September.",
        reading: [
          "Each row names a role. The administrators and the team leaders are affected in different ways, so they have different rows rather than one shared line for the team.",
          "Each skill begins with an action verb and describes work someone could watch: checking a preference, switching to a letter, running a report, and assigning follow-up. A team leader could sit beside an administrator in the first week of September and see whether it was done.",
          "Each row points back to the change. The clinicians are not in the rows, because text-first letters do not alter their work, and the plan says so in one line rather than asking them to attend a briefing they do not need.",
        ],
      },
      practice: {
        intro:
          "Here are three lines written for the handheld scanner change at the distribution centre. Mark each one: is it written as observable work, or is it not yet a skill someone could see? The three tests are a named role, an action someone could see, and the change it comes from.",
        check: {
          kind: "mark",
          prompt: "Mark each line as written as observable work or as not yet a skill someone could see.",
          passLabel: "Written as observable work",
          failLabel: "Not yet a skill someone could see",
          sentences: [
            {
              id: "pick",
              text: "Role: pickers. Skill: scan each item against the pick list on the handheld and correct a short pick before closing the order. Change: scanners from 12 February.",
              fail: false,
              why: "This names the role, gives work a supervisor could watch, and points to the scanner change, so it is written as observable work.",
            },
            {
              id: "tech",
              text: "Role: warehouse staff. Skill: technology awareness. Change: modernisation.",
              fail: true,
              why: "Technology awareness is a topic, warehouse staff is everyone, and modernisation is a trend. It is not yet a skill someone could see.",
            },
            {
              id: "course",
              text: "Role: shift supervisors. Skill: Handheld Scanner Essentials course. Change: scanners from 12 February.",
              fail: true,
              why: "A course title says what the organisation might run, not what a supervisor must be able to do. It is not yet a skill someone could see.",
            },
          ],
          why: "That is right. Only the pickers' row names the role, an action someone could watch, and the change. The other two give a topic and a course title in place of a skill.",
        },
      },
      check: {
        kind: "choose",
        prompt:
          "Two rows were written for the change 'the new claims system goes live on 1 March'. Choose the row that follows this lesson.",
        leftLabel: "Row A",
        left: "Role: all staff. Skill: digital confidence and adaptability. Change: digital transformation.",
        rightLabel: "Row B",
        right:
          "Role: claims handlers. Skill: register a new claim in the new system and attach the customer's evidence, including when documents arrive after registration. Change: new claims system live from 1 March.",
        correct: "right",
        why: "You chose the row with a named role, a skill that can be seen, and the change that creates the need. Row B tells a team leader exactly what to watch for in the first week of March.",
        wrong:
          "Look again at Row A. It names everyone, describes traits no one can observe, and points to a general trend instead of the system change. Row B names claims handlers, gives work someone could watch, and points to 1 March.",
      },
      bridge:
        "Not every skill on the list should be met by training, and the next lesson decides which should not.",
    },
    {
      id: "what-you-will-not-train",
      title: "What you will not train",
      emphasis: "train",
      place:
        "You now have skills by role, each tied to a change. This lesson asks, for each one, whether training is the right way to close the gap, and what to do instead when it is not.",
      sections: [
        {
          heading: "Training is one answer among several",
          paragraphs: [
            "A gap is the difference between what a role will need to do after the change and what people in the role can do now. Training is one way to close a gap. It is often not the quickest way, and it is often not the cheapest. Cathy Moore's book Map It makes the habit plain: before building training, ask whether training is what will change the work.",
            "In this lesson each gap gets one of two labels. A gap is marked Train when people in the role will need to do the work themselves, often enough that they must be able to do it without help, and when a short, practical programme can build the skill before the change arrives. Registering claims every day in a new system is a gap to train.",
          ],
        },
        {
          heading: "Solve another way",
          paragraphs: [
            "A gap is marked Solve another way when a different response fits better. The work can be redesigned, so that the difficult step is removed or handled by the system. A job aid or checklist can be enough for a task that is done rarely, such as a quarterly export. The skill can be hired in or bought as a service when it is specialist and needed by only one or two people. Or the organisation can accept the gap for now, when the change is not yet certain.",
            "Every Solve another way line names which other way and who owns it. 'Job aid for the monthly audit report, owned by the claims operations manager' is a line someone can deliver. 'Handle informally' is not, because no one knows who will do it or what it is.",
          ],
        },
        {
          heading: "What this is not, and why it matters",
          paragraphs: [
            "Saying what you will not train is not a sign that the plan is thin. It is what keeps the plan to one page and keeps the training budget for the gaps that need it. A manager reading the plan should see that you looked at every gap and made a decision, not that you stopped listing.",
            "The usual mistake is to train everything, because training is the tool HR and L&D teams own. A two-hour session on finding the help pages uses a morning of every person's time and is forgotten by the go-live date. A link in the system and a line in the team briefing does the same job, and the time saved goes to the daily work that must be done without help.",
          ],
        },
      ],
      workedExample: {
        title: "Four gaps from the claims system",
        inputLabel: "The gaps listed for the new claims system",
        outputLabel: "The decision and the reason for each",
        prompt:
          "1. Claims handlers must register claims and attach evidence every day. 2. Team leaders must run a monthly audit report. 3. One systems analyst must configure new claim types. 4. Everyone must know how to reset their password.",
        output:
          "1. Train: handlers do this daily and must do it without help. 2. Solve another way: a one-page job aid, owned by the claims operations manager. 3. Solve another way: the vendor provides configuration as a service for the first six months, owned by the IT service manager. 4. Solve another way: the self-service guide the IT team already provides, mentioned in the go-live briefing.",
        reading: [
          "Registering claims is the core daily work of the handlers from 1 March. They cannot stop and look it up for every claim, so a short practical programme before the go-live is the right response.",
          "The audit report is run once a month by a few team leaders. A one-page job aid, kept beside the report, will serve them better than a session they attend in February and need in late March.",
          "Configuring claim types is specialist work needed by one person. Buying it from the vendor for six months is quicker than training, and the plan can revisit it once the system has settled. Password resets are already solved by a guide that exists, so the plan points to it and moves on.",
        ],
      },
      practice: {
        intro:
          "Here are two lines written for the same gap at the distribution centre. Choose the one that follows this lesson. The definitions of Train and Solve another way are above.",
        check: {
          kind: "choose",
          prompt:
            "Once a month, one shift supervisor must export the scanner accuracy report for the site manager. Choose the better line for the plan.",
          leftLabel: "Line A",
          left: "Solve another way: a one-page job aid for the monthly export, owned by the site operations manager.",
          rightLabel: "Line B",
          right: "Train: all shift supervisors attend a half-day reporting course before 12 February.",
          correct: "left",
          why: "Line A solves a monthly task done by one person with a job aid and names who owns it. Line B trains every supervisor for work that one of them does once a month.",
          wrong:
            "Look again at Line B. The export is done once a month by one supervisor, so a half-day course for all of them spends time on a gap a job aid would close. Line A names the other way and its owner.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "These gaps come from the outpatient administration plan. Mark each as a gap to train or a gap to solve another way.",
        passLabel: TRAIN,
        failLabel: OTHER,
        sentences: [
          {
            id: "booking",
            text: "Administrators will book, move, and cancel appointments in the new system many times a day from June.",
            fail: false,
            why: "This is the core daily work of the role from June. People must be able to do it themselves, so train.",
          },
          {
            id: "waiting-list",
            text: "Once a quarter, one team leader exports a waiting list report for the operations board.",
            fail: true,
            why: "This is a quarterly task for one person. A job aid, owned by the team leader, will do the job, so solve it another way.",
          },
          {
            id: "templates",
            text: "The new system needs someone to set up clinic templates, which requires the vendor's specialist configuration training.",
            fail: true,
            why: "This is a specialist task needed by very few people. Buy it from the vendor or give it to one person as part of their role, and name the owner.",
          },
          {
            id: "failed-texts",
            text: "The text-first process sends a failed-message report that team leaders must act on each week.",
            fail: false,
            why: "This weekly task is part of the team leader's job from September, and they must do it without help. Train.",
          },
          {
            id: "help-pages",
            text: "Administrators must know where to find the new system's help pages.",
            fail: true,
            why: "Finding help pages does not need a programme. A link in the system and a mention in the briefing will solve it another way.",
          },
        ],
        why: "You kept training for the frequent work people must do themselves, and solved the rare, specialist, and simple gaps another way. The booking work and the weekly failed-message report are the two gaps this team should train.",
      },
      bridge:
        "Even the gaps to train can be too many for one page, and the next lesson chooses the few that matter most.",
    },
    {
      id: "the-few-that-matter",
      title: "The few that matter",
      emphasis: "few",
      place:
        "You have decided which gaps to train. This lesson cuts the list to no more than three skills per role, so that the plan can deliver what it promises before each change arrives.",
      sections: [
        {
          heading: "No more than three skills per role",
          paragraphs: [
            "A plan that lists nine skills for a role will usually deliver none of them well. People have a normal workload alongside the change, and the weeks before a go-live are already full. This course therefore asks for no more than three skills per role in a two-quarter plan.",
            "Three is a ceiling, not a target. If one skill covers what a role needs for a change, the plan lists one. The discipline is in choosing which skills make the plan and saying, in a sentence, why the others did not.",
          ],
        },
        {
          heading: "The four questions",
          paragraphs: [
            "Each candidate skill is judged with four questions. The first is consequence: what happens if the skill is missing on the day of the change? Does work stop, do customers or patients suffer, or is it only slower? The second is reach: how many people in the role need it? The third is time: how long does it take someone to become competent, and does that fit before the change? The fourth is certainty: how sure is the change, and how sure is its date?",
            "A skill that scores high on consequence and certainty, and that many people need, goes on the plan. A skill that matters less, or whose change is uncertain, goes to a later list with a review date. A skill that is not observable, or not tied to a change on the plan, is cut from this plan altogether, with a note of where it belongs if it belongs anywhere.",
          ],
          beforeAfter: {
            before: "Cut: advanced keyboard shortcuts.",
            after:
              "Cut: advanced keyboard shortcuts. Nothing stops on 1 March if handlers do not know them; they only make the work faster, so they can wait for the refresher in the summer.",
            reading:
              "The first line cuts the skill without saying why, which invites the team leader to put it back. The second gives the reason from the consequence question, so the decision can be explained.",
          },
        },
        {
          heading: "Cutting is a decision, not a judgement of worth",
          paragraphs: [
            "Cutting a skill from the plan is not the same as deciding it is unimportant. It is deciding what this plan will deliver first. A team leader who asked for customer empathy is not wrong that it matters. It is simply not created by the claims system, and it belongs in the service standards work instead.",
            "Each cut or move therefore carries a one-sentence reason drawn from the four questions. The reason is what lets you explain the decision to the managers who asked for the skill. The usual mistake is to cut quietly, which feels kinder in the moment and produces an argument in the steering group a month later.",
          ],
        },
      ],
      workedExample: {
        title: "Nine skills for claims handlers",
        inputLabel: "The team leader's request",
        outputLabel: "The list after the four questions",
        prompt:
          "Before the new system goes live on 1 March, claims handlers need to: register a claim and attach evidence; search for an existing claim; record a fraud referral with the new checklist; create custom reports; use advanced keyboard shortcuts; show customer empathy; understand the vendor's product roadmap; export claims to a spreadsheet; and be confident with change.",
        output:
          "Keep: register a claim and attach evidence; search for an existing claim; record a fraud referral with the new checklist.\nLater list, review in June: create custom reports, because few handlers need them. Export claims to a spreadsheet, because only two analysts do it and the export may change after go-live.\nCut: keyboard shortcuts, because nothing stops without them. Customer empathy, because it is not tied to this change and belongs in the service standards work. The vendor roadmap and confidence with change, because neither is something a handler could be seen doing.",
        reading: [
          "Registering a claim stops work if it is missing, and every handler needs it, so it stays. Searching for an existing claim is needed daily by everyone. Recording a fraud referral has a serious consequence if missing and a date signed off by the risk committee, so it stays too.",
          "Custom reports and spreadsheet exports matter to a few people and can wait. They go to the later list with a review date, so the team leader knows they have not been forgotten.",
          "The shortcuts, the empathy line, the roadmap, and confidence with change are cut, each with a reason. Two of them fail the test from the second lesson, because no one could watch a handler do them.",
        ],
      },
      practice: {
        intro:
          "Here are two ways a partner cut the list for pickers at the distribution centre. Choose the one that follows this lesson. The four questions are above.",
        check: {
          kind: "choose",
          prompt: "Choose the cut list you could defend to the site leadership team.",
          leftLabel: "List A",
          left: "Keep: scan and correct a short pick; confirm a pallet location on the handheld. Later list, review in April: print replacement labels, because only the goods-in desk does it. Cut: be tech-savvy, because no one could see a picker do it.",
          rightLabel: "List B",
          right: "Keep: scan and correct a short pick; confirm a pallet location; print replacement labels; charge the handheld; use the stock query screen; be tech-savvy. Cut: none.",
          correct: "left",
          why: "List A keeps two skills that stop work if missing, moves one to the later list with a reason and a review date, and cuts a trait with a reason. List B keeps six skills and cuts nothing, so it cannot be delivered before 12 February.",
          wrong:
            "Look again at List B. It keeps six skills, including a trait no one can watch, and gives no reasons, so the plan promises more than the weeks before 12 February can deliver. List A keeps the few that matter and explains each cut.",
        },
      },
      check: {
        kind: "edit",
        prompt:
          "This draft plan lists seven skills for booking clerks before the new appointment system goes live on 3 June. Edit it to keep no more than three, and give a one-sentence reason for each skill you cut or move, drawn from the four questions.",
        label: "The draft skills for booking clerks",
        start:
          "Booking clerks, new appointment system live on 3 June.\nSkills:\n1. Book, move, and cancel an appointment in the new system.\n2. Customise the system's colour scheme.\n3. Find a patient's existing appointments and linked referrals.\n4. Run the capacity report at the end of each month.\n5. Check a patient's mobile number and contact preference when booking.\n6. Understand the history of the booking system project.\n7. Be resilient during change.\nCut or moved, with reasons:",
        unchanged:
          "You have not changed the draft yet. Keep no more than three skills, and under 'Cut or moved, with reasons' give a one-sentence reason for each of the others.",
        keep: [
          {
            id: "book",
            any: ["book, move", "cancel an appointment"],
            missing:
              "Keep skill 1, booking, moving, and cancelling appointments. It is daily work that stops if the skill is missing on 3 June.",
          },
          {
            id: "find",
            any: ["linked referral", "existing appointment"],
            missing:
              "Keep skill 3, finding a patient's existing appointments and linked referrals. Every clerk needs it from 3 June, and bookings go wrong without it.",
          },
        ],
        limitWording: false,
        limits: [
          {
            id: "colour",
            any: [
              "nothing stops",
              "does not stop",
              "doesn't stop",
              "no work stops",
              "work carries on",
              "cosmetic",
              "no consequence",
              "no effect",
            ],
            missing:
              "Give the reason for cutting the colour scheme. Nothing stops if it is unchanged on 3 June, so say that in a sentence.",
          },
          {
            id: "observable",
            any: [
              "not observable",
              "cannot be observed",
              "can't be observed",
              "cannot be seen",
              "could not see",
              "couldn't see",
              "no one could see",
              "nobody could see",
              "not something",
              "neither is something",
              "neither is a skill",
              "not a skill",
              "a trait",
              "not tied",
            ],
            missing:
              "Give the reason for cutting the project history and resilience. Neither is something a clerk could be seen doing in the new system, so say so.",
          },
          {
            id: "report",
            any: [
              "one person",
              "few people",
              "a few",
              "once a month",
              "not many",
              "only one",
              "team leader",
              "later list",
            ],
            missing:
              "Say why the capacity report can wait, using how many people need it or how often it is run, and move it to the later list.",
          },
        ],
        why: "Your plan keeps the skills that stop work if missing and that every clerk needs, and each cut has a reason a manager could accept. The colour scheme goes because nothing stops without it, the history and resilience go because no one could watch a clerk do them, and the capacity report waits because few people run it.",
        result: {
          label: "What the service manager reads",
          text: "Booking clerks, new appointment system live on 3 June. Keep: book, move, and cancel an appointment; find a patient's existing appointments and linked referrals; check a patient's mobile number and contact preference when booking. Later list: the capacity report, run once a month by one team leader, reviewed in July. Cut: the colour scheme, because nothing stops without it; the project history and resilience, because neither is something a clerk could be seen doing.",
        },
      },
      bridge:
        "The plan now names the few skills that matter. The next lesson gives each one a measure, an owner, and a time, so that someone is accountable for it.",
    },
    {
      id: "measures-owners-and-dates",
      title: "Measures, owners, and dates",
      emphasis: "owners",
      place:
        "Each role now has no more than three skills. This lesson adds the three things that turn a skill row into a line a manager can hold the organisation to: the measure that will build it, the owner, and the time.",
      sections: [
        {
          heading: "The measure",
          paragraphs: [
            "The measure is the thing the organisation will do to build the skill. It is specific enough that someone could book it: two practice sessions in the training environment, a week of shadowing an experienced colleague, two supervised weeks on live work, or a job aid placed beside the screen. It is not a word such as 'training' or 'support', because neither tells anyone what to arrange.",
            "Choose the measure that fits the skill. A daily task done in a new system is best built by practice on that system before go-live. A judgement task, such as deciding which failed text messages to chase first, is best built by supervised work on real cases, with a team leader beside the person. The measure should also say how you will know the skill is there, such as a team leader watching three bookings in the first week.",
          ],
        },
        {
          heading: "The owner and the time",
          paragraphs: [
            "The owner is the role that will make the measure happen and answer for it. Name the role, such as the service manager or the operations lead, rather than a person. People move jobs, and a one-page plan that names individuals goes out of date and can expose details that do not belong in a shared document. 'L&D' on its own is not an owner, because it names a function rather than someone who can be asked on a Tuesday whether the sessions are booked.",
            "The time is set against the change it responds to. 'In the two weeks before 3 June' is clearer than 'Q2', because it tells the owner the skill must be in place when the system goes live, and it moves with the go-live date if the project slips. A time such as 'ongoing' or 'to be confirmed' tells a manager that no one has decided yet.",
          ],
          beforeAfter: {
            before: "Skill: run the failed-message report. Measure: training. Owner: L&D. When: Q3.",
            after:
              "Skill: run the failed-message report and assign each failure. Measure: two supervised weeks on live reports, with the operations lead reviewing each assignment. Owner: operations lead. When: the first two weeks after text-first letters start in September.",
            reading:
              "The first row leaves every decision open. The second says what will be arranged, who answers for it, and when it happens relative to the change.",
          },
        },
        {
          heading: "Ready to act on, or a manager would have to ask",
          paragraphs: [
            "In this lesson a plan line is Ready to act on when a manager could read it and know what will happen, who is responsible, and when, without ringing you. A line is marked A manager would have to ask when any of the three is missing, vague, or names a function in place of an owner.",
            "The usual mistake is to leave these fields until later, because the skills felt like the hard part. A plan with good skills and no owners is a wish list. The measures, owners, and dates are what make the plan something the organisation can be held to.",
          ],
        },
      ],
      workedExample: {
        title: "Three lines for the outpatient team",
        inputLabel: "The skill rows from the earlier lessons",
        outputLabel: "The rows with a measure, owner, and time",
        prompt:
          "Booking clerks: book, move, and cancel an appointment in the new system. Booking clerks: find a patient's existing appointments and linked referrals. Team leaders: run the failed-message report and assign each failure.",
        output:
          "Booking clerks: book, move, and cancel. Measure: two practice sessions in the training environment, then a team leader watches three bookings. Owner: service manager. When: the two weeks before 3 June.\nBooking clerks: find existing appointments and linked referrals. Measure: the same practice sessions, with five prepared patient records. Owner: service manager. When: the two weeks before 3 June.\nTeam leaders: failed-message report. Measure: two supervised weeks on live reports. Owner: operations lead. When: the first two weeks of text-first letters in September.",
        reading: [
          "Each measure says what will be arranged and how anyone will know it worked. The team leader watching three bookings is the check that the skill is there.",
          "Each owner is a role. The service manager answers for the clerks and the operations lead for the team leaders, so the plan still holds if someone moves job.",
          "Each time is set against the change. If the booking system slips to July, the owner knows the practice sessions move with it.",
        ],
      },
      practice: {
        intro:
          "Mark each line below with the two labels from this lesson. The before and after above shows the difference.",
        check: {
          kind: "mark",
          prompt: "Mark each plan line as Ready to act on or as A manager would have to ask.",
          passLabel: READY,
          failLabel: ASK,
          sentences: [
            {
              id: "pickers",
              text: "Pickers: scan and correct a short pick. Measure: one hour on the practice handhelds in the training bay. Owner: shift manager. When: the week before 12 February.",
              fail: false,
              why: "This line says what will be arranged, who answers for it, and when relative to the change, so it is ready to act on.",
            },
            {
              id: "supervisors",
              text: "Supervisors: confirm a pallet location. Measure: support as needed. Owner: L&D. When: ongoing.",
              fail: true,
              why: "Support as needed, L&D, and ongoing leave every decision open. A manager would have to ask what, who, and when.",
            },
          ],
          why: "That is right. The pickers' line names a measure, a role that owns it, and a time before the change. The supervisors' line leaves all three open.",
        },
      },
      check: {
        kind: "choose",
        prompt:
          "Two rows were written for triage administrators, who take on referral triage for two more clinics from July. Choose the row a manager could act on without asking.",
        leftLabel: "Row A",
        left: "Triage administrators: sort referrals for the new clinics. Measure: training to be arranged. Owner: HR. When: summer.",
        rightLabel: "Row B",
        right:
          "Triage administrators: sort a referral for the two new clinics by urgency using the clinics' triage criteria. Measure: three days shadowing the existing triage desk. Owner: outpatient services manager. When: the last two weeks of June, before triage starts in July.",
        correct: "right",
        why: "Row B names a measure someone could book, an owner by role, and a time set against the start of triage in July. A manager could read it and know exactly what will happen.",
        wrong:
          "Look again at Row A. 'Training to be arranged', 'HR', and 'summer' leave the measure, the owner, and the time undecided. Row B names each of them and ties the time to July.",
      },
      bridge:
        "You now have every part of a plan line. The next lesson brings the whole method together and assesses it on situations you have not seen.",
    },
    {
      id: "course-assessment",
      title: "Course assessment",
      emphasis: "assessment",
      place:
        "This is the sixth of seven lessons. It sets out the whole method in one place, works one mixed example, and then assesses it on new situations before the final lesson asks you to write your own plan.",
      sections: [
        {
          heading: "Changes and skills",
          paragraphs: [
            "A skills plan for two quarters starts from changes to the work that are decided or under way. A change we can point to has evidence inside the organisation, such as a go-live date in an approved plan, a signed-off process, a launch plan, or a role created from a stated month. A trend we are guessing at is a general claim about the future of work. Trends go on a note of questions for the review, not into the plan.",
            "Each change creates skills for particular roles. A skill is something a person in a named role will do that someone could see, written with an action verb and tied to the change. It is not a topic, a trait, or a course title. Roles the change does not affect are left out, and the plan says so.",
          ],
        },
        {
          heading: "Deciding and cutting",
          paragraphs: [
            "For each skill, decide whether to Train or Solve another way. Train when people will do the work themselves, often, without help, and a short practical programme can build it before the change. Solve another way when redesign, a job aid, a bought service, or accepting the gap for now fits better, and name the other way and its owner.",
            "Then cut to no more than three skills per role, using the four questions: consequence if missing on the day, how many people need it, how long it takes to learn, and how certain the change is. Skills that matter less or depend on an uncertain change go to the later list with a review date. Every cut or move carries a one-sentence reason.",
          ],
        },
        {
          heading: "Making it something the organisation can be held to",
          paragraphs: [
            "Every skill that stays gets a measure someone could book, an owner named by role, and a time set against its change. The plan ends with its own owner and a review date that falls before the second quarter begins. Names of individuals, contact details, and pay stay out of it.",
            "The assessment below sets seven situations from different organisations. Each question has one right answer, and each draws on one or more of the moves above. You need six of the seven to pass, and after you submit, each question shows the feedback for the option you chose.",
          ],
        },
      ],
      workedExample: {
        title: "One request, worked through",
        inputLabel: "The request from the head of finance",
        outputLabel: "The plan lines the HR business partner wrote",
        prompt:
          "The finance team at Ardley Homes moves to a new expenses system on 1 October, approved by the finance committee. The head of finance asks for 'AI and data skills for the whole team, plus training on the new system for everyone, including the monthly reconciliation.'",
        output:
          "Change: new expenses system, 1 October, approved by the finance committee.\nFinance assistants: approve or return an expense claim in the new system with the reason recorded. Measure: two practice sessions in the test system. Owner: finance operations manager. When: the two weeks before 1 October.\nNot trained: the monthly reconciliation, done by one accountant, solved with a job aid owned by the finance operations manager.\nNote for the review: AI and data skills, no decided change yet.",
        reading: [
          "The expenses system is a change we can point to, with a date and a committee decision. 'AI and data skills' is a trend, so it goes to a note for the review rather than a plan line.",
          "The assistants' skill is written as work someone could watch and tied to 1 October. It is marked Train, because they will approve claims daily from that date.",
          "The reconciliation is done monthly by one person, so it is solved another way with a job aid, and the line names who owns it. The whole request fits in four lines a manager can read in under a minute.",
        ],
      },
      practice: {
        intro:
          "Before the assessment, choose the line the Ardley Homes plan should use for the head of finance's request about AI and data skills. The sections above set out the method.",
        check: {
          kind: "choose",
          prompt: "Choose the line that follows the method in this course.",
          leftLabel: "Line A",
          left: "Finance team: AI and data skills. Measure: an e-learning module. Owner: L&D. When: this year.",
          rightLabel: "Line B",
          right:
            "Note for the review in December: AI and data skills were raised, but no system or process change has been decided, so there is no plan line yet.",
          correct: "right",
          why: "Line B records the request as a trend, says why it is not a plan line, and gives a review point. Line A turns a trend into a line with a vague skill, a function as owner, and no change behind it.",
          wrong:
            "Look again at Line A. 'AI and data skills' has no decided change behind it, and the skill, the owner, and the time are all vague. Line B notes it for the review, which is where a trend belongs.",
        },
      },
      check: {
        kind: "scenario",
        prompt:
          "Read each situation and choose what you would do. Each question has one right answer, and you need six of the seven to pass.",
        passMark: 6,
        questions: [
          {
            id: "trend",
            situation:
              "Owen Price is the HR business partner for customer operations at Harrowgate Water. After a leadership away day, the operations director asks for 'AI literacy for all 400 staff' to be the first line of the skills plan. No AI tool has been bought or approved, and the only decided change for the next six months is a new job scheduling system going live on 5 May.",
            question: "What should Owen do with the director's request?",
            options: [
              {
                id: "a",
                text: "Put AI literacy for all 400 staff at the top of the plan, because the director asked for it.",
                feedback:
                  "The request comes from a senior person, but it rests on a trend with no decided change behind it. A plan line with no system, role, or date will stall, and it will take time from the scheduling change that is actually happening.",
              },
              {
                id: "b",
                text: "Record it as a trend on the note of questions for the review, and start the plan from the scheduling system on 5 May.",
                correct: true,
                feedback:
                  "That holds. You kept the plan on the change you can point to and recorded the director's request where it can be picked up if a tool is approved. You can explain this to the director by naming the one change that is decided.",
              },
              {
                id: "c",
                text: "Leave AI out of the plan entirely and do not mention it to the director.",
                feedback:
                  "Leaving it out of the plan is right, but saying nothing means the director will assume it was ignored. Record it as a trend with a review point, so the decision is visible and can be revisited.",
              },
              {
                id: "d",
                text: "Add it to the plan as a later item with no date, so that it is on the page.",
                feedback:
                  "A later item still needs a review date and a reason. Putting a trend on the plan with no date blurs the line between what is decided and what is guessed. Record it as a trend on the note for the review.",
              },
            ],
          },
          {
            id: "trait",
            situation:
              "Grace Adeyemi is writing the plan for the contact centre at Linton Energy, which moves to a new telephony platform on 14 April under an approved project plan. A team leader has sent her the line 'Agents: resilience and a positive attitude to change.'",
            question: "What should Grace write in place of that line?",
            options: [
              {
                id: "a",
                text: "Agents: resilience and a positive attitude to change, measured by an engagement survey after go-live.",
                feedback:
                  "Adding a survey does not make a trait observable, and a survey measures feeling, not whether an agent can do the work on the new platform. Write the skill as something someone could see an agent do.",
              },
              {
                id: "b",
                text: "Agents: new telephony platform essentials.",
                feedback:
                  "That is a course title. It says what the organisation might run, not what an agent must be able to do on 14 April. Write the action, such as transferring a call.",
              },
              {
                id: "c",
                text: "All staff: digital confidence for the new platform.",
                feedback:
                  "This names everyone and describes a trait. The plan would not say which role changes or what anyone should be seen doing. Name the role and the action.",
              },
              {
                id: "d",
                text: "Agents: transfer a call to the billing queue on the new platform with the account notes attached. Change: telephony platform live on 14 April.",
                correct: true,
                feedback:
                  "That holds. It names the role, gives an action a team leader could watch, and points to the dated change. On 15 April someone can sit with an agent and see whether it is there.",
              },
            ],
          },
          {
            id: "job-aid",
            situation:
              "Sunita Rao is the L&D lead at Bramwell Logistics. The new expenses system goes live on 1 October. The finance manager asks for a two-day course for the whole team so that they can run the month-end reconciliation, which one accountant does once a month.",
            question: "How should Sunita handle the reconciliation in the plan?",
            options: [
              {
                id: "a",
                text: "Solve it another way with a job aid for the month-end reconciliation, owned by the finance manager, and keep training for the daily approval work.",
                correct: true,
                feedback:
                  "That holds. A task done once a month by one person is well served by a job aid kept beside the report, and naming the owner means it will be written. The training time goes to the daily work that must be done without help.",
              },
              {
                id: "b",
                text: "Book the two-day course for the whole team, because the finance manager has asked for it.",
                feedback:
                  "The course would take two days from every person for a task one of them does monthly, and most would forget it before month end. A job aid, owned by the finance manager, closes the gap more cheaply and lasts longer.",
              },
              {
                id: "c",
                text: "Train the one accountant on a one-day course and add the rest of the team to the later list.",
                feedback:
                  "This is closer, but a day away for a monthly task is still more than it needs, and putting the rest of the team on the later list suggests they need the skill. A job aid for the one accountant, with an owner, is enough.",
              },
              {
                id: "d",
                text: "Leave the reconciliation off the plan, because it is not a daily task.",
                feedback:
                  "The gap is real, so leaving it off means no one closes it. The plan should say it will not be trained and how it will be solved instead, with an owner.",
              },
            ],
          },
          {
            id: "cut",
            situation:
              "Kieran Doyle is the workforce planner for the warehouse at Oakfield Retail. Handheld scanners go live on 2 February. The warehouse manager has sent nine skills for team leaders, including running the scanner reports, reassigning a pick, resetting a handheld, knowing the vendor's roadmap, and being an agile leader.",
            question: "What should Kieran do with the nine skills?",
            options: [
              {
                id: "a",
                text: "Keep all nine, because the warehouse manager knows the team leaders' work best.",
                feedback:
                  "The manager does know the work, but nine skills in the weeks before 2 February will not be delivered well. Apply the four questions, keep no more than three, and give a reason for each of the rest.",
              },
              {
                id: "b",
                text: "Keep the three the manager listed first and drop the other six.",
                feedback:
                  "The order of a list is not a reason. Some of the first three may matter less than skills lower down, and dropping six without reasons invites the manager to put them back. Use the four questions.",
              },
              {
                id: "c",
                text: "Apply the four questions, keep no more than three, and give a one-sentence reason for each skill cut or moved to the later list.",
                correct: true,
                feedback:
                  "That holds. The four questions show which skills stop work if missing and which many team leaders need, and a reason for each cut lets Kieran explain the plan to the warehouse manager. The roadmap and agile leadership fall out because no one could watch them.",
              },
              {
                id: "d",
                text: "Keep all nine but mark three of them as priorities.",
                feedback:
                  "A plan with nine skills and three priorities still asks the team to be ready on all nine, and the other six have no reason or review date. Cut to three and move or cut the rest with a reason.",
              },
            ],
          },
          {
            id: "owner",
            situation:
              "Hannah Scott is reviewing a draft plan at Merrow Council before it goes to the director. One row reads 'Planning officers: log a site visit on the new tablet app. Measure: training. Owner: L&D. When: Q3.' The app goes live on 9 September, according to the approved rollout plan.",
            question: "How should Hannah change the row?",
            options: [
              {
                id: "a",
                text: "Leave it as it is, because the skill is well written and the rest can be sorted out later.",
                feedback:
                  "The skill is well written, but 'training', 'L&D', and 'Q3' leave every decision open. A director cannot hold anyone to it. Name the measure, the owner by role, and the time against 9 September.",
              },
              {
                id: "b",
                text: "Name the measure and the owning role, and set the time against the change, such as two practice visits with the app in the two weeks before 9 September, owned by the planning team manager.",
                correct: true,
                feedback:
                  "That holds. The measure can be booked, the owner can be asked whether it is done, and the time moves with the go-live if the rollout slips. The director can now read the row and know what will happen.",
              },
              {
                id: "c",
                text: "Replace L&D with the name and mobile number of the trainer who will run the sessions.",
                feedback:
                  "A named person and a phone number do not belong in a one-page plan that will be shared, and the plan goes out of date when they move job. Name the owning role, and fix the measure and the time as well.",
              },
              {
                id: "d",
                text: "Change the time to 'as soon as possible' so that the officers are ready early.",
                feedback:
                  "As soon as possible is not a time anyone can plan against, and the measure and owner are still open. Set the time against 9 September and name the measure and the owning role.",
              },
            ],
          },
          {
            id: "uncertain",
            situation:
              "Daniel Moss is the HR business partner for procurement at Kestrel Housing. The procurement team expects to move to a new purchasing system 'possibly in the fourth quarter', but the board has not yet approved the business case, and a decision is due at the board meeting on 20 November.",
            question: "Where should the purchasing system skills go?",
            options: [
              {
                id: "a",
                text: "On the later list, with a review date just after the board meeting on 20 November.",
                correct: true,
                feedback:
                  "That holds. The change is not yet certain, so the skills wait on the later list, and the review date is set so that the plan can be updated as soon as the board decides.",
              },
              {
                id: "b",
                text: "On the plan, with training booked for the fourth quarter so the team is ready if it is approved.",
                feedback:
                  "Booking training for a system that may not be approved spends time on a guess, and if the board says no the plan loses credibility. Put the skills on the later list with a review date after 20 November.",
              },
              {
                id: "c",
                text: "Off the plan and the later list, because it is only a trend.",
                feedback:
                  "It is more than a trend, because there is a business case and a decision date. It is not yet certain enough for the plan, so it belongs on the later list with a review date, where it will not be forgotten.",
              },
              {
                id: "d",
                text: "On the plan as a priority, because a new system is a change we can point to.",
                feedback:
                  "A change we can point to has a decision behind it, and this one does not yet. Until the board approves it, the skills belong on the later list with a review date after 20 November.",
              },
            ],
          },
          {
            id: "slip",
            situation:
              "Chloe Barker owns the skills plan for the outpatient team at Eastleigh Hospitals. The plan says clerks will have two practice sessions 'in the two weeks before 3 June'. The project board has just moved the booking system go-live to 1 July. The review date on the plan is 1 September.",
            question: "What should Chloe do?",
            options: [
              {
                id: "a",
                text: "Run the practice sessions in May as planned, because they are already booked.",
                feedback:
                  "Running the sessions a month before the new go-live means clerks practise and then wait, and much of it will fade by July. The time on the plan is set against the change, so the sessions should move with it.",
              },
              {
                id: "b",
                text: "Wait until the review on 1 September and update the plan then.",
                feedback:
                  "The review date is a floor, not a reason to wait. By 1 September the system will have been live for two months, and the plan will have been wrong the whole time. Update it now that the change has moved.",
              },
              {
                id: "c",
                text: "Rewrite the plan from the start, because a change to the date means the skills may be wrong.",
                feedback:
                  "The change is the same system with a later date, so the skills, the measures, and the owners still hold. Only the timings move. Rewriting everything costs time and unsettles the managers who agreed it.",
              },
              {
                id: "d",
                text: "Move the practice sessions to the two weeks before 1 July, tell the service manager who owns them, and note the change on the plan.",
                correct: true,
                feedback:
                  "That holds. Because the time was written against the change, the sessions move with the go-live, and the owner knows at once what to rebook. The rest of the plan stands.",
              },
            ],
          },
        ],
        why: "You applied the whole method: you kept the plan on changes that are decided, wrote skills as observable work, kept training for the gaps that need it, cut to the few that matter with reasons, and gave each line a measure, an owner, and a time set against its change.",
      },
      bridge:
        "You have now used every move on situations you had not seen. The final lesson asks you to write the one-page skills plan for your own area, which becomes the plan on your record.",
    },
    {
      id: "the-plan",
      title: "The plan",
      emphasis: "plan",
      place:
        "This is the last lesson. You write the skills plan for your area for the next two quarters, and that plan appears, as you write it, on your signed record.",
      sections: [
        {
          heading: "What goes on the page",
          paragraphs: [
            "The plan is one page covering the next two quarters. It opens with the changes it responds to, each with its evidence and its date. It then lists, for each affected role, no more than three skills written as observable work, each with the change it comes from, the measure that will build it, the owner by role, and the time set against the change.",
            "It lists what the organisation will not train, with the other way each gap will be solved and who owns that. It names a later list of skills that were considered and deferred, with a review date. It ends with the role that owns the plan and a review date, which should fall before the second quarter begins, so the plan is checked while there is still time to change it.",
          ],
        },
        {
          heading: "What the plan is not",
          paragraphs: [
            "The plan is not a strategy document, a competency framework, or a training catalogue. Those have their place, and the CIPD factsheets on workforce planning and on learning and development strategy describe that longer-range work well. This plan is a set of decisions a manager can read in two minutes and hold the organisation to.",
            "Keep it free of the names of individuals, email addresses, telephone numbers, and pay figures. Owners are named by role. The plan will be shared with managers and steering groups, and it must still make sense when people change jobs.",
          ],
        },
        {
          heading: "Checking the plan before you sign it",
          paragraphs: [
            "Read the plan once from the top and ask of every skill whether it points to a change listed at the top. A skill that points to nothing has crept in from a trend or a wish list, and it should be moved or cut. Then read each line and ask whether a manager could act on it without ringing you.",
            "Finally, count the skills for each role. If any role has more than three, go back to the four questions. The record will show this plan to anyone who opens its reference, so write it as you would want a head of function to read it.",
          ],
        },
      ],
      workedExample: {
        title: "A plan for the outpatient administration team",
        inputLabel: "The decisions from the earlier lessons",
        outputLabel: "The one-page plan",
        prompt:
          "Changes: booking system on 3 June, triage for two more clinics from July, text-first letters from September. Skills chosen for booking clerks, triage administrators, and team leaders. Gaps solved another way: waiting list report and template configuration. Deferred: custom reporting.",
        output:
          "Changes: booking system live 3 June (approved project plan); referral triage for two more clinics from 1 July (signed service agreement); text-first letters from September (operations board decision).\nBooking clerks: book, move, and cancel in the new system; find existing appointments and linked referrals. Measure: two practice sessions in the training environment. Owner: service manager. When: two weeks before 3 June.\nTriage administrators: sort a referral by urgency using the new clinics' criteria. Measure: three days shadowing. Owner: outpatient services manager. When: last two weeks of June.\nTeam leaders: run the failed-message report and assign each failure. Measure: two supervised weeks. Owner: operations lead. When: first two weeks of September.\nNot trained: waiting list report, solved with a job aid owned by the team leader; template configuration, bought from the vendor for six months, owned by the IT service manager.\nLater list: custom reporting, reviewed in October.\nPlan owner: HR business partner, outpatients. Review date: 1 September.",
        reading: [
          "Every change has evidence and a date, and every skill points back to one of them. No role has more than two skills, so the plan can be delivered alongside normal work.",
          "Every measure can be booked, every owner is a role, and every time is set against its change. The two gaps not trained each name the other way and who owns it.",
          "The review date falls before the second quarter begins, so the owner checks the plan while the September change can still be adjusted. A manager can read the whole page in two minutes.",
        ],
      },
      practice: {
        intro:
          "Before you write your own plan, mark each line of this draft. Does it point to a change listed at the top of the plan, or does it point to nothing on the plan? The draft lists one change: a new rota system at a care home group, live on 4 November.",
        check: {
          kind: "mark",
          prompt: "Mark each line as pointing to a listed change or as pointing to nothing on the plan.",
          passLabel: "Points to a listed change",
          failLabel: "Points to nothing on the plan",
          sentences: [
            {
              id: "rota",
              text: "Home managers: publish a four-week rota in the new system and approve a shift swap. Measure: one practice session. Owner: regional operations manager. When: the week before 4 November.",
              fail: false,
              why: "This skill comes from the rota system on 4 November, so it points to a listed change.",
            },
            {
              id: "wellbeing",
              text: "Carers: wellbeing and self-care. Measure: an online module. Owner: HR. When: winter.",
              fail: true,
              why: "Nothing in the rota change creates this need, and it is a topic rather than a skill. It points to nothing on the plan.",
            },
          ],
          why: "That is right. The home managers' line comes from the rota change, and the wellbeing line has crept in from outside the plan, so it should be moved or cut.",
        },
      },
      check: {
        kind: "build",
        prompt:
          "Write the skills plan for your area for the next two quarters. A manager should be able to read it in two minutes and know what will happen, for whom, and when. Name owners by role, and leave out the names of individuals, contact details, and pay.",
        fields: [
          {
            id: "changes",
            label: "Changes this plan responds to",
            hint: "Each change with its evidence and its date, for example 'booking system live 3 June, approved project plan'.",
            min: 30,
            rule: "fact",
            any: [
              "approved",
              "signed",
              "agreed",
              "decision",
              "decided",
              "go-live",
              "go live",
              "live",
              "launch",
              "project plan",
              "rollout",
              "contract",
              "agreement",
              "committee",
              "board",
            ],
            missing:
              "Changes this plan responds to needs a date and its evidence for each change. Say what was decided, such as an approved project plan or a signed agreement, and give the date.",
          },
          {
            id: "skills",
            label: "Skills by role",
            hint: "For each role, no more than three skills, each starting with an action verb and naming the change it comes from.",
            min: 60,
            rule: "role",
            any: ["role", "skill", "change", "from", "before", "after"],
            missing:
              "Skills by role needs a named role and, for each skill, something a person in that role will do that someone could see, tied to one of the changes above.",
          },
          {
            id: "measures",
            label: "Measures, owners, and dates",
            hint: "For each skill, the measure that will build it, the owning role, and the time set against the change.",
            min: 40,
            rule: "fact",
            any: ["owner", "owned", "owns", "manager", "lead", "head of", "partner"],
            missing:
              "Measures, owners, and dates needs an owner named by role for each skill and a time you can plan against, such as 'the two weeks before 3 June'.",
          },
          {
            id: "not-trained",
            label: "What we will not train, and how we will solve it instead",
            hint: "At least one gap, the other way it will be solved (job aid, redesign, bought service, or accepted for now), and who owns that.",
            min: 30,
            any: [
              "job aid",
              "checklist",
              "guide",
              "vendor",
              "supplier",
              "service",
              "redesign",
              "hire",
              "buy",
              "bought",
              "self-service",
              "accept",
              "instead",
            ],
            missing:
              "What we will not train needs at least one gap and the other way you will solve it, such as a job aid, a redesign, a bought service, or accepting the gap for now, with the role that owns it.",
          },
          {
            id: "later",
            label: "Later list",
            hint: "Skills you considered and deferred, each with a short reason, and the date you will review them.",
            min: 20,
            rule: "fact",
            any: ["review", "revisit", "reconsider", "decide", "check"],
            missing:
              "Later list needs a review date. Name the skills you deferred and say when you will review them, for example 'reviewed in October'.",
          },
          {
            id: "owner",
            label: "Plan owner and review date",
            hint: "The role that owns the plan, and a review date before the second quarter begins.",
            min: 15,
            rule: "fact",
            any: ["owner", "owned", "owns", "partner", "lead", "manager", "head"],
            missing:
              "Plan owner and review date needs the role that owns the plan and a review date, for example 'HR business partner, review 1 September'.",
          },
        ],
        why: "Your plan has every part a manager needs. It starts from changes with evidence and dates, names skills by role, gives each a measure, an owner, and a time, says what will not be trained and what will happen instead, and has a later list, an owner, and a review date.",
      },
      bridge:
        "Your plan is ready. Sign your name below, and the record will show this plan, the course, and the date to anyone who opens the reference.",
    },
  ],
};
