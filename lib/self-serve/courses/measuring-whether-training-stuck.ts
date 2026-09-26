/*
Course: Measuring Whether Training Stuck
Slug: measuring-whether-training-stuck
For: L&D practitioners, HR business partners, and managers who run or sponsor a programme and are
  asked whether it worked. They currently report completions and satisfaction scores and know those
  numbers do not answer the question. They have one real programme and can talk to at least one
  manager of people who took part. No analytics tools or evaluation background needed.
Outcome: The learner can say which common training measures count activity and which show that the
  work changed, write signs in the work that someone other than the learner could see two weeks after
  the programme, plan a fair before and after comparison, ask a manager questions that bring out
  evidence rather than opinion, and tell a skill that is missing from a work environment that gave no
  chance to use it. They leave with a measurement sheet for one programme.
Artefact: The measurement sheet, one page for one programme.
Record sentence: Wrote and signed a measurement sheet that says how one training programme will be
  judged by signs in the work rather than by activity counts.
Lessons (id, title, move, interaction, pass rule):
  1. what-you-stop-counting, What you stop counting, separate activity counts from change in the work,
     mark (Counts activity / Shows the work changed), every line marked correctly.
  2. signs-in-the-work, Signs in the work, write a sign with the four features, practice build and
     check choose, the sign that is observable, in normal work, seen by someone else, with a before state.
  3. when-to-look, When to look, plan a fair before and after comparison, practice mark (Can be compared
     / Cannot be compared) and check choose, the plan with a matched before sample, a two to six week
     window, a sample fixed in advance, and proportionate use of records.
  4. the-manager-conversation, The manager conversation, ask for evidence rather than opinion, practice
     build and check edit, the edit contains a question on what was seen in terms of the sign, a request
     for one piece of work, and a question on what got in the way.
  5. reading-what-you-found, Reading what you found, tell a missing skill from a missing chance, practice
     choose and check mark (The skill is missing / The work gave no chance to use it), every finding
     marked correctly.
  6. course-assessment, Course assessment, every move on new cases, scenario of seven questions,
     six of seven correct.
  7. the-sheet, The sheet, write the measurement sheet, build, every field present with its rule or its
     course words.
Sources: Kirkpatrick and Kirkpatrick, Kirkpatrick's Four Levels of Training Evaluation (ATD Press, 2016);
  Will Thalheimer, the Learning-Transfer Evaluation Model (2018); Robert Brinkerhoff, The Success Case
  Method (2003); Baldwin and Ford, "Transfer of training: a review and directions for future research",
  Personnel Psychology (1988); the CIPD factsheet on evaluating learning and development; the ICO
  employment practices guidance on monitoring workers.
Tested on phone:          yes
Tested returning learner: yes
Pass rule tests written:  yes
*/
import type { CourseContent } from "./types.ts";

const ACTIVITY = "Counts activity";
const CHANGED = "Shows the work changed";
const COMPARED = "Can be compared";
const NOT_COMPARED = "Cannot be compared";
const SKILL = "The skill is missing";
const CHANCE = "The work gave no chance to use it";
const KEEP = "Keep on the sheet";
const TAKE_OFF = "Take off the sheet";

export const COURSE: CourseContent = {
  slug: "measuring-whether-training-stuck",
  hours: 2,
  artefact: {
    lessonId: "the-sheet",
    title: "The measurement sheet",
    recordLine:
      "Wrote and signed a measurement sheet that says how one training programme will be judged by signs in the work rather than by activity counts.",
  },
  lessons: [
    {
      id: "what-you-stop-counting",
      title: "What you stop counting",
      emphasis: "counting",
      place:
        "This is the first of seven lessons. Before you choose the measures that can show whether a programme worked, you set aside the ones that cannot, and you learn the two labels the course uses for every measure you meet.",
      sections: [
        {
          heading: "What most training reports count",
          paragraphs: [
            "Most reports on a training programme are built from numbers that are easy to collect. They say how many people enrolled, how many completed, how long they spent in the modules, how they rated the sessions, and how they scored on a quiz at the end. These numbers arrive automatically from the learning system or the feedback form, and they fill a slide quickly.",
            "Every one of those numbers describes something that happened inside the programme. None of them describes what the person now does at their desk, on the shop floor, or in a one-to-one. A sponsor who paid for a programme on handling complaints wants to know whether complaints are now handled differently, and a completion rate of ninety per cent cannot tell them.",
            "This course is for people who already sense that gap. You may have written a report that looked healthy and still been unable to answer the director who asked whether it worked. The first move is to see clearly which of your measures can answer that question and which cannot.",
          ],
        },
        {
          heading: "Two labels for every measure",
          paragraphs: [
            "In this course, a measure Counts activity when it describes what happened in the programme. Enrolments, completions, attendance, time spent, satisfaction ratings, and end-of-module quiz scores all count activity. They tell you that people turned up, stayed, liked it, or remembered something on the day.",
            "A measure Shows the work changed when it describes something in the person's normal work after the programme that is different from before. The proportion of customer replies that state the next step, the number of expense claims returned for missing receipts, or whether a new manager now holds a weekly one-to-one would each show the work changed, provided there is a before and an after to compare.",
            "Published models of evaluation draw the same line. Kirkpatrick's four levels separate reaction and learning from behaviour and results, and Will Thalheimer's Learning-Transfer Evaluation Model separates attendance, activity, and knowledge from performance in the work. Both treat the change in the work as the stronger evidence. You do not need either model to use this course, but it helps to know that the distinction is not a matter of taste.",
          ],
          beforeAfter: {
            before: "Average satisfaction for the complaints programme was 4.5 out of 5.",
            after:
              "Three weeks after the programme, team leaders sampled ten complaint replies per adviser and found that six in ten offered a next step and a date, compared with three in ten in the month before.",
            reading:
              "The first line counts activity, because a rating is a reaction to the programme. The second shows the work changed, because it compares normal work before and after, and someone other than the adviser collected it.",
          },
        },
        {
          heading: "What activity counts are still for",
          paragraphs: [
            "Setting activity counts aside as evidence does not mean deleting them. A completion figure tells you who has had the chance to learn, which you need before you can look for change in anyone's work. A low rating can warn you of a problem in the design, such as a session that ran too long or an example that did not fit the audience.",
            "The point is to report each number for what it can show. Completions answer the question of reach. Ratings answer the question of whether the sessions landed. Neither answers the question of whether the work changed, and a report that lets them stand in for that answer misleads the person reading it, even when nobody intends to mislead.",
          ],
        },
        {
          heading: "The mistake people usually make",
          paragraphs: [
            "The usual mistake is to report activity counts in the place where the sponsor expects evidence of change. A slide headed 'Impact' that shows completion, satisfaction, and quiz scores invites the reader to treat those numbers as impact. When the sponsor later sees no change in complaints, the programme loses credibility, and so does the person who reported it.",
            "A second mistake is to believe that a high quiz score shows the work changed because it measures knowledge. A quiz is taken inside the programme, often on the same day as the teaching. It tells you what people could recall in that setting. It does not tell you what they chose to do the following week with a queue of real customers waiting. This is the habit the course asks you to stop.",
          ],
        },
      ],
      workedExample: {
        title: "A customer service programme report",
        inputLabel: "The programme report",
        outputLabel: "The same report, read with the two labels",
        prompt:
          "412 staff enrolled and 389 completed. Average satisfaction was 4.6 out of 5. The average quiz score was 86 per cent. Two weeks later, team leaders found that 7 of the 10 replies they sampled from each adviser stated the next step, compared with 4 of 10 before the programme.",
        output:
          "Enrolled 412: Counts activity. Completed 389: Counts activity. Satisfaction 4.6 out of 5: Counts activity. Quiz score 86 per cent: Counts activity. Replies stating the next step, 7 of 10 against 4 of 10 before: Shows the work changed.",
        reading: [
          "The enrolment and completion figures describe who took part. They are worth keeping because they tell the sponsor how many advisers had the chance to learn, but they say nothing about the replies those advisers now write.",
          "The satisfaction rating and the quiz score both come from inside the programme. One is a reaction and the other is recall on the day, so both count activity.",
          "The last sentence is different in kind. It describes normal work, the replies advisers send, it compares the same measure before and after, and team leaders collected it rather than the advisers themselves. The report has one line of evidence about the work and four about the programme, and that one line is the answer to the sponsor's question.",
        ],
      },
      practice: {
        intro:
          "Here is a short report on a warehouse safety induction. Mark each line with one of the two labels. The definitions are in the section above if you want to read them again.",
        check: {
          kind: "mark",
          prompt: "Mark each line of the induction report as Counts activity or Shows the work changed.",
          material: {
            label: "The programme",
            text: "A half-day safety induction for new pickers at the Harlow distribution centre of Fenwright Logistics, covering safe lifting and the use of pallet trucks.",
          },
          passLabel: CHANGED,
          failLabel: ACTIVITY,
          sentences: [
            {
              id: "attended",
              text: "All 36 new pickers who started in September attended the induction.",
              fail: true,
              why: "Attendance describes who took part in the programme, so it counts activity.",
            },
            {
              id: "rated",
              text: "Pickers rated the induction 4.8 out of 5 on the feedback form.",
              fail: true,
              why: "A rating is a reaction to the session, so it counts activity.",
            },
            {
              id: "observed",
              text: "In floor walks four weeks later, shift supervisors saw 30 of 36 new pickers lift from the knees, compared with 19 of 34 in the intake before the induction was redesigned.",
              fail: false,
              why: "Supervisors saw this in normal work and compared it with the intake before, so it shows the work changed.",
            },
          ],
          why: "That is right. Attendance and the rating describe the induction itself, and the floor walk describes how pickers now lift, seen by supervisors and compared with the intake before.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "Mark each line from a report on a new manager programme as counting activity or showing the work changed.",
        material: {
          label: "The programme",
          text: "A four-module programme for managers in their first year at Castleway Building Society, covering one-to-ones, delegation, and handling leave requests.",
        },
        passLabel: CHANGED,
        failLabel: ACTIVITY,
        sentences: [
          {
            id: "completed",
            text: "Ninety-four per cent of participants completed all four modules.",
            fail: true,
            why: "Completing modules says nothing about what managers now do at work, so it counts activity.",
          },
          {
            id: "rating",
            text: "Participants rated the programme 4.7 out of 5.",
            fail: true,
            why: "A rating tells you how people felt about the programme, not what changed in their work, so it counts activity.",
          },
          {
            id: "one-to-ones",
            text: "Six weeks on, 11 of 14 new managers were holding a fortnightly one-to-one with each team member, compared with 3 of 14 before, according to their calendars and their teams.",
            fail: false,
            why: "This describes what managers now do at work, compared with before, and someone other than the manager can confirm it, so it shows the work changed.",
          },
          {
            id: "quiz",
            text: "The average end-of-programme quiz score was 82 per cent.",
            fail: true,
            why: "A quiz is taken inside the programme and measures recall on the day, so it counts activity.",
          },
          {
            id: "leave",
            text: "Team members of new managers who took part reported fewer unanswered requests for leave after the programme than before, in the monthly pulse survey.",
            fail: false,
            why: "This comes from the team, about the manager's work, with a before and an after, so it shows the work changed.",
          },
        ],
        why: "You separated what happened in the programme from what changed in the work. Completion, the rating, and the quiz describe the programme, while the calendars and the pulse survey describe what managers now do, seen by other people and compared with before.",
      },
      bridge:
        "To show the work changed, you need to know exactly what to look for, and the next lesson teaches you to write those signs.",
    },
    {
      id: "signs-in-the-work",
      title: "Signs in the work",
      emphasis: "Signs",
      place:
        "This is the second of seven lessons. You have set aside the measures that count activity. This lesson teaches you to write the signs that will show whether the work changed.",
      sections: [
        {
          heading: "What a sign in the work is",
          paragraphs: [
            "A sign in the work is a specific thing someone could see in the person's normal work after a programme, which would be different if the programme had worked. It is written before you go looking, so that you know what counts as a change and what does not.",
            "A sign is narrower than an objective. The objective of a complaints programme might be that advisers handle complaints well. A sign is what handling complaints well looks like in a reply someone can read: the reply offers a specific next step and a date. You can look at a reply and say whether that is there.",
            "Signs are best collected between two and six weeks after the programme. That is long enough for the person to have met the situation the programme prepared them for, and short enough that a change can reasonably be linked to the programme rather than to a new system, a new manager, or the season.",
          ],
        },
        {
          heading: "The four features of a good sign",
          paragraphs: [
            "A good sign has four features. First, it is observable, meaning it describes an action or a piece of work rather than a feeling or an attitude. Second, it appears in normal work, not in an exercise set up for the evaluation. Third, someone other than the learner can see it, such as a manager, a colleague, a customer, or a system record. Fourth, it has a before state, so you know what the work looked like before the programme and can tell whether it changed.",
            "Each feature closes a door that would otherwise let weak evidence in. A feeling can change without the work changing. An exercise shows what someone can do when asked, not what they do when nobody is asking. A sign only the learner can report depends on their memory and their wish to be helpful. A sign with no before state cannot show a change, because there is nothing to compare it with.",
          ],
          beforeAfter: {
            before: "New managers are more comfortable delegating.",
            after:
              "In the four weeks after the programme, the team's task tracker shows tasks assigned by the new manager to named team members, with a due date, compared with the four weeks before, when most tasks stayed with the manager.",
            reading:
              "The first version is a feeling, and only the manager could report it. The second describes something in the tracker that the manager's own line manager can see, in normal work, with a before state.",
          },
        },
        {
          heading: "A sign does not have to be a number",
          paragraphs: [
            "A sign is not a target, and it does not need to be a percentage. 'The new manager now opens one-to-ones by asking about workload' is a sign if a team member or the manager's own manager can see it and you know that it did not happen before. A number helps when the work produces many examples, such as replies or claims, but a plain description of a changed habit is often enough.",
            "Robert Brinkerhoff's Success Case Method works in a similar way. It looks for specific evidence of use in the work among the people who used the learning most and least, and it asks for the story behind that evidence. The common thread is that the evidence is concrete enough that a second person could check it.",
          ],
        },
        {
          heading: "The mistake people usually make",
          paragraphs: [
            "The usual mistake is to write a sign that is really a hope. 'More confident', 'more aware', and 'better engaged' describe how the programme designer would like people to feel. They fail the first feature, and they usually fail the third as well, because only the learner can say how confident they feel.",
            "A second mistake is to write a sign that is observable but only inside the programme, such as 'can complete the role-play correctly'. A role-play is an exercise. It tells you the skill can be performed, which is useful to the designer, but it is not normal work and it has no before state from the person's actual job. Write signs about the job, and keep exercises inside the programme.",
          ],
        },
      ],
      workedExample: {
        title: "Two draft signs for a delay update programme",
        inputLabel: "The two draft signs",
        outputLabel: "The sign the L&D lead kept",
        prompt:
          "Sign 1: advisers feel more confident about delay updates.\nSign 2: in a sample of ten delay updates per adviser, taken from the case system two weeks after the programme, the update states the new date, the reason, and the next step; before the programme, the team leader's sample found this in about four of ten.",
        output:
          "Sign 2, with the four features written out. What is seen: a delay update that states the new date, the reason, and the next step. Where: delay updates sent to customers from the case system. Who sees it: the team leader, from the case system. Before state: about four in ten, from the team leader's sample in the month before.",
        reading: [
          "Sign 1 fails three of the four features. Confidence is a feeling, it does not sit in any piece of work, and only the adviser can report it. It also has no before state.",
          "Sign 2 is observable, because anyone can read an update and see whether the date, the reason, and the next step are there. It sits in normal work, because these are updates sent to real customers.",
          "The team leader collects it from the case system, so the adviser is not the only source. The before state of about four in ten gives the comparison. Writing the four features out, as the L&D lead did, is how you check a sign before you rely on it.",
        ],
      },
      practice: {
        intro:
          "Write one sign for a programme you run or sponsor, using one field for each of the four features. The worked sign above is still on the page, so you can compare yours with it.",
        check: {
          kind: "build",
          prompt: "Write one sign in the work for your programme, one feature at a time.",
          fields: [
            {
              id: "seen",
              label: "What someone would see",
              hint: "An action or a piece of work, such as a reply, an agenda, a claim form, or a meeting.",
              min: 20,
              any: [
                "reply",
                "replies",
                "update",
                "email",
                "report",
                "meeting",
                "one-to-one",
                "agenda",
                "note",
                "claim",
                "form",
                "log",
                "ticket",
                "case",
                "record",
                "task",
                "plan",
                "call",
                "letter",
                "rota",
              ],
              missing:
                "What someone would see does not yet name a piece of work or an action. Name the thing a second person could look at, such as a reply, an agenda, or a claim form.",
            },
            {
              id: "where",
              label: "Where it appears in normal work",
              hint: "The system, document, or routine where it turns up without anyone setting it up.",
              min: 12,
              any: [
                "system",
                "inbox",
                "calendar",
                "tracker",
                "log",
                "record",
                "rota",
                "file",
                "meeting",
                "weekly",
                "daily",
                "monthly",
                "each",
                "every",
                "normal work",
                "shift",
              ],
              missing:
                "Where it appears does not yet name a place in normal work. Say which system, document, or routine it turns up in, such as the case system or the weekly team meeting.",
            },
            {
              id: "who",
              label: "Who sees it",
              hint: "A person or a system other than the learner, such as a team leader or a report.",
              min: 8,
              rule: "role",
              any: [
                "manager",
                "leader",
                "colleague",
                "customer",
                "system",
                "team",
                "supervisor",
                "reviewer",
                "auditor",
                "finance",
                "report",
                "director",
                "partner",
              ],
              missing:
                "Who sees it does not yet name someone other than the learner. Name the person or system, such as the team leader or the case system.",
            },
            {
              id: "before",
              label: "The before state",
              hint: "What the work looked like before the programme, even as an estimate from a sample.",
              min: 16,
              any: ["before", "baseline", "previously", "last month", "compared with", "used to", "prior"],
              missing:
                "The before state does not yet say what the work looked like before. Add what was there before the programme, such as 'about four in ten before'.",
            },
          ],
          why: "Your sign has all four features. It names something a second person could see, in normal work, collected by someone other than the learner, with a before state to compare against.",
        },
      },
      check: {
        kind: "choose",
        prompt:
          "Two signs were written for a programme on safe handling of personal data in the HR team at Ribble Valley Care. Choose the sign that follows the lesson.",
        leftLabel: "Sign A",
        left: "Participants say they understand data protection better and feel more careful.",
        rightLabel: "Sign B",
        right:
          "In the four weeks after the programme, the number of HR emails sent with unencrypted spreadsheets of staff data attached, as flagged by the email security system, compared with the four weeks before.",
        correct: "right",
        why: "You chose the sign that someone else could see in normal work, with a before and an after. Sign B is observable, comes from emails the team sends anyway, is recorded by a system rather than by the learners, and compares the four weeks after with the four weeks before.",
        wrong:
          "Look again at Sign A. It is a feeling, reported only by the learners, with no before state, so it could not show whether the work changed. Sign B describes emails a system can see, in normal work, before and after.",
      },
      bridge:
        "A sign is only as good as the comparison behind it, and the next lesson decides when to collect it and how to make the before and the after fair.",
    },
    {
      id: "when-to-look",
      title: "When to look",
      emphasis: "look",
      place:
        "This is the third of seven lessons. You can write a sign. This lesson plans when and how you collect it, so that the before and the after can honestly be compared.",
      sections: [
        {
          heading: "Choosing the window",
          paragraphs: [
            "The window is the period after the programme in which you collect the sign. For most workplace skills it opens about two weeks after the programme and closes about six weeks after. Before two weeks, many people have not yet met the situation the programme prepared them for. After six weeks, too much else has changed for you to link a difference to the programme with any confidence.",
            "The right window depends on how often the work happens. A skill used every day, such as writing customer replies, can be sampled at two weeks. A skill used once a month, such as running a probation review, needs a longer window so that each person has had at least one occasion. Write the window as a stated number of weeks after the programme, so that nobody collects the sign on the last day of the course and calls it evidence.",
          ],
        },
        {
          heading: "A before state collected the same way",
          paragraphs: [
            "A before state is only useful if it was collected in the same way as the after. If the before sample was ten replies chosen at random from the case system, the after sample should be ten replies chosen at random from the case system, read against the same standard, ideally by the same person. If the method changes, a difference could come from the method rather than from the work.",
            "When no before state exists, you have two honest options. You can collect one now, before the programme runs, which is the better choice if the programme has not started. Or, if it has already run, you can build one from records that already exist, such as last quarter's replies or last month's calendars, as long as you read them against the same standard you will use afterwards. What you should not do is compare an after sample with a general impression of how things used to be.",
          ],
          beforeAfter: {
            before:
              "Before: the team leader's view that replies were 'often vague'. After: a sample of ten replies per adviser checked for a next step.",
            after:
              "Before: ten replies per adviser from the fortnight before the programme, checked for a next step by the team leader. After: ten replies per adviser from weeks three and four after the programme, checked the same way by the same team leader.",
            reading:
              "The first plan compares an impression with a count, so any difference could come from the change of method. The second uses the same sample size, the same standard, and the same reader, so the two can be compared.",
          },
        },
        {
          heading: "Two labels for a collection plan",
          paragraphs: [
            "In this lesson you will judge each line of a collection plan with one of two labels. A line Can be compared when the after is collected in the same way as the before, from the same kind of normal work, inside a stated window after the programme, with the sample chosen before anyone knows the result. A line Cannot be compared when any of those is missing: the method changes between before and after, the timing is on the day of the programme or open-ended, or the sample is picked by someone who already knows which examples look good.",
            "The last point is easy to miss. If a manager is asked to send their team's best replies, the after sample will look better than the before for reasons that have nothing to do with the programme. Decide in advance how the sample is drawn, such as the first ten replies each adviser sent in week three, and write that rule down before you look.",
          ],
        },
        {
          heading: "Care with records about people",
          paragraphs: [
            "Many good signs come from system records about individuals: emails, calendars, case notes, or call logs. Using those records is a form of monitoring workers, and the ICO's employment practices guidance on monitoring workers expects it to be proportionate, necessary for a stated purpose, and explained to the people concerned. For evaluating a programme, that usually means telling participants in advance what will be sampled and why, collecting only the fields the sign needs, and reporting at team level rather than naming individuals.",
            "This is not a reason to avoid records. It is a reason to design the collection so that it would not surprise the people in it. A plan that reads every email a person sent for a month is out of proportion to a question about delay updates. A plan that samples ten updates per adviser, removes customer names, and reports the proportion for the team is in proportion, and it still answers the sponsor's question.",
          ],
        },
      ],
      workedExample: {
        title: "A collection plan for a new manager programme",
        inputLabel: "The first collection plan",
        outputLabel: "The plan after review",
        prompt:
          "Sign: new managers hold a fortnightly one-to-one with each team member. We will ask managers on the last afternoon of the programme how often they plan to hold one-to-ones. Line managers will send us examples of their best one-to-one agendas. We will compare this with what we remember of how things were before.",
        output:
          "Sign: new managers hold a fortnightly one-to-one with each team member. Before: calendars for the four weeks before the programme, counting one-to-ones with each team member, collected by the HR business partner. After: calendars for weeks three to six after the programme, counted the same way by the same person. Sample: every new manager on the programme, agreed before the programme starts. Managers are told in the joining note that calendar entries titled one-to-one will be counted, and only the count per team member is recorded.",
        reading: [
          "The first plan collects on the last afternoon of the programme, which is inside the programme rather than in the window. It asks about plans, which are intentions rather than work.",
          "The first plan also asks line managers for their best agendas, so the sample is chosen by people who know which examples look good. Its before state is a memory, collected in a different way from the after.",
          "The reviewed plan uses calendars for both the before and the after, counted in the same way by the same person, with the window set at weeks three to six. The sample is every new manager, agreed in advance, and the managers are told what will be counted and why, with only the count recorded. The before and the after can now be compared.",
        ],
      },
      practice: {
        intro:
          "Here are four lines from a collection plan for a programme on writing clear shift handover notes at Tamar Community Hospital. Mark each line with one of the two labels. The section on the two labels is above if you want to read it again.",
        check: {
          kind: "mark",
          prompt: "Mark each line of the collection plan as Can be compared or Cannot be compared.",
          passLabel: COMPARED,
          failLabel: NOT_COMPARED,
          sentences: [
            {
              id: "same-method",
              text: "The ward manager will read twenty handover notes from the fortnight before the programme and twenty from weeks three and four after it, against the same five-point standard.",
              fail: false,
              why: "The same reader uses the same standard on the same number of notes, inside a window after the programme, so the two can be compared.",
            },
            {
              id: "best-notes",
              text: "Each nurse will choose two of their best handover notes from after the programme to send in.",
              fail: true,
              why: "The nurses choose their own best notes, so the sample is picked by people who know which look good, and it cannot be compared with a fair before sample.",
            },
            {
              id: "first-notes",
              text: "The sample will be the first five handover notes each nurse writes on day shifts in week three, a rule agreed before the programme.",
              fail: false,
              why: "The sample rule is fixed in advance and the notes come from normal work inside the window, so this line can be compared.",
            },
            {
              id: "same-day",
              text: "The after sample will be the practice notes written in the final session of the programme.",
              fail: true,
              why: "Practice notes from the final session are an exercise on the day of the programme, not normal work in the window, so they cannot be compared with real handovers from before.",
            },
          ],
          why: "That is right. The ward manager's matched reading and the rule fixed in advance can be compared, while notes chosen by the nurses and practice notes from the session cannot.",
        },
      },
      check: {
        kind: "choose",
        prompt:
          "Two collection plans were written for a programme on accurate expense claims at Mercer Hale Architects. The sign is the number of claims returned by finance for a missing receipt. Choose the plan whose before and after can be compared.",
        leftLabel: "Plan A",
        left: "Finance will count claims returned for a missing receipt in the four weeks before the programme and in weeks three to six after it, from the expenses system, and report the total for the office. Staff are told in the programme invitation that returned claims will be counted for the office as a whole.",
        rightLabel: "Plan B",
        right:
          "Finance will ask each participant at the end of the final session how many claims they expect to have returned next month, and compare the answers with finance's general sense that returns used to be high.",
        correct: "left",
        why: "Plan A collects the same count from the same system before and after, inside a window of weeks three to six, and tells staff what will be counted while reporting only the office total. Plan B asks for expectations on the day of the programme and compares them with an impression, so there is nothing to compare.",
        wrong:
          "Look again at Plan B. It asks people what they expect on the last day of the programme, which is an intention collected inside the programme, and its before state is finance's impression rather than a count. Plan A uses the same count, from the same system, in a stated window.",
      },
      bridge:
        "Many signs can only be seen by the person's manager, and the next lesson prepares the questions that bring that evidence back.",
    },
    {
      id: "the-manager-conversation",
      title: "The manager conversation",
      emphasis: "manager",
      place:
        "This is the fourth of seven lessons. You have signs and a plan for collecting them. This lesson prepares the questions that get evidence of those signs from managers, who often see the work most closely.",
      sections: [
        {
          heading: "The question decides what comes back",
          paragraphs: [
            "A manager is often the best source of evidence about whether a programme stuck, because they see the person's work every week. The way you ask decides what you get. A question that asks for opinion, such as 'Did the training help?', 'Are you happy with the programme?', or 'Has their confidence improved?', invites a polite yes. It tells you what the manager thinks you want to hear, and nothing about the work.",
            "A question that asks for evidence names the sign and asks what the manager has seen. 'In the last two weeks, have you seen them open a one-to-one by asking about workload?' can be answered with a specific yes, a specific no, or an example. Either answer is useful, because both tell you about the work rather than about the manager's feelings towards the programme.",
          ],
        },
        {
          heading: "Three kinds of question",
          paragraphs: [
            "A good set of manager questions has three kinds. The first asks what the manager has seen the person do, in the terms of the sign. The second asks for one example of the work, such as a reply, an agenda, or a handover note, so that you can read it against the standard yourself. The third asks what got in the way, because a missing sign may have a cause in the work rather than in the learning.",
            "The third question is the one most often left out, and it is the one that saves you from the wrong conclusion. If a manager says their adviser has not written a single delay update since the programme, you need to know whether that is because the adviser avoided them or because the team was moved onto a product launch. Only the third question brings that out.",
          ],
          beforeAfter: {
            before: "Has the programme made a difference to how they handle complaints?",
            after:
              "In the last two weeks, have you seen their complaint replies offer a specific next step and a date? Could you send me one reply they wrote this week? Has anything made it harder for them to do that, such as the reply template or the volume of cases?",
            reading:
              "The first version asks for an opinion about the programme. The revised set asks what the manager has seen in terms of the sign, asks for one piece of work, and asks what got in the way.",
          },
        },
        {
          heading: "What not to ask",
          paragraphs: [
            "Do not ask the manager to rate the programme, and do not ask them to rate the person. A rating of the programme counts activity, which you set aside in the first lesson. A rating of the person turns an evaluation of training into a performance judgement, which the person did not agree to, and managers answer it cautiously or not at all.",
            "Do not ask a closing question such as 'Anything else?' as a substitute for the third kind. It sounds open, but in practice it gets a no. If you want to know what got in the way, ask about it directly and give one or two examples of what you mean, such as workload, rota changes, or a system that makes the new way harder.",
          ],
        },
        {
          heading: "Keeping it to ten minutes",
          paragraphs: [
            "Managers will answer three short questions in a ten-minute call or a short email. They will not complete a survey of twenty items, and if they do, the answers become less careful as they go. Three questions, one of each kind, for each sign is enough. If you have two signs, ask about the more important one in full and the other in a single sentence.",
            "Send the questions ahead of the conversation, so the manager can find the example before you speak. Ask during the window you set in the previous lesson, not on the day of the programme and not months later, when neither of you will remember what the work looked like before.",
          ],
        },
      ],
      workedExample: {
        title: "Questions for the managers of new managers",
        inputLabel: "The first draft of questions",
        outputLabel: "The revised questions",
        prompt:
          "1. Did you find the programme useful?\n2. Has their management improved?\n3. Would you recommend it to other new managers?",
        output:
          "1. In the last two weeks, how often has the new manager held a one-to-one with each team member?\n2. Could you share one agenda they used?\n3. Has anything made it harder for them to hold the one-to-ones, such as workload or rota changes?",
        reading: [
          "The first draft asks the manager for opinions: whether the programme was useful, whether management has improved, and whether they would recommend it. None of the answers would tell the L&D lead what the new managers now do.",
          "The first revised question names the sign, one-to-ones with each team member, and asks what the manager has seen over a stated period. The second asks for one piece of work that the L&D lead can read.",
          "The third asks what got in the way and gives two examples, so a missing sign can be explained. The set is short enough to ask in ten minutes, and none of it asks the manager to rate anyone.",
        ],
      },
      practice: {
        intro:
          "Write one question of each kind for a manager of someone who took your programme. The three kinds are described above, and the revised questions in the worked example show one of each.",
        check: {
          kind: "build",
          prompt: "Write three manager questions for your programme, one of each kind.",
          fields: [
            {
              id: "seen",
              label: "What the manager has seen",
              hint: "Name the sign and a period, and ask what they have seen.",
              min: 20,
              any: ["seen", "noticed", "how often", "have they", "did they", "in the last"],
              missing:
                "What the manager has seen does not yet ask what they have seen. Name the sign and ask, for example, 'In the last two weeks, have you seen them...'.",
            },
            {
              id: "example",
              label: "One example of the work",
              hint: "Ask for one piece of work you can read yourself.",
              min: 16,
              any: ["send", "share", "example", "copy", "show", "forward"],
              missing:
                "One example of the work does not yet ask for a piece of work. Ask the manager to send or share one example, such as a reply or an agenda.",
            },
            {
              id: "obstacle",
              label: "What got in the way",
              hint: "Ask directly what made it harder, with an example of what you mean.",
              min: 16,
              any: ["in the way", "harder", "stopped", "prevent", "difficult", "obstacle", "blocked"],
              missing:
                "What got in the way does not yet ask about obstacles. Ask what has made it harder to use the skill, such as workload or a system.",
            },
          ],
          why: "Your questions ask what the manager has seen, ask for one piece of work, and ask what got in the way, so each answer tells you about the work rather than about the programme.",
        },
      },
      check: {
        kind: "edit",
        prompt:
          "Edit these questions for the managers of people who took a programme on handling customer complaints at Aldwick Home Insurance, so that they ask for evidence and not opinion. The sign is that complaint replies now offer a specific next step and a date.",
        label: "The questions you are editing",
        start:
          "1. Did the complaints training help your team?\n2. Are they more confident with complaints now?\n3. How would you rate the programme out of ten?\n4. Anything else?",
        unchanged:
          "You have not changed the questions yet. Rewrite them so that one asks what the manager has seen, one asks for a piece of work, and one asks what got in the way.",
        keep: [],
        limitWording: false,
        limits: [
          {
            id: "sign",
            any: ["next step"],
            missing:
              "Ask what the manager has seen, in terms of the sign: replies that offer a next step and a date.",
          },
          {
            id: "seen",
            any: ["seen", "noticed", "how often", "how many"],
            missing:
              "Ask what the manager has seen, not what they think. A question such as 'In the last two weeks, have you seen their replies offer a next step and a date?' does this.",
          },
          {
            id: "example",
            any: ["send", "share", "example", "copy", "forward", "show me"],
            missing: "Ask for one piece of work, such as a complaint reply from this week.",
          },
          {
            id: "obstacle",
            any: ["in the way", "harder", "stopped", "prevent", "difficult", "obstacle", "blocked"],
            missing: "Ask what has made it harder to use the skill, so a missing sign can be explained.",
          },
        ],
        why: "Your questions now ask what the manager has seen in terms of the sign, ask for one piece of work, and ask what got in the way. Check that the question asking for a rating out of ten has gone, because a rating of the programme counts activity.",
        result: {
          label: "What a manager might send back",
          text: "Yes, most replies I have read this fortnight give a next step and a date, though two of Harriet's did not. I have attached one of Omar's from Tuesday. The main thing slowing them down is that the claims system does not show the loss adjuster's visit date until the next morning.",
        },
      },
      bridge:
        "Once the answers come in, some signs will be missing, and the next lesson teaches you to read what a missing sign means before you decide what to change.",
    },
    {
      id: "reading-what-you-found",
      title: "Reading what you found",
      emphasis: "Reading",
      place:
        "This is the fifth of seven lessons. You have collected evidence from the work and from managers. This lesson teaches you to read a missing sign correctly before deciding what to change.",
      sections: [
        {
          heading: "Two explanations for a missing sign",
          paragraphs: [
            "When a sign is missing two or more weeks after a programme, there are two quite different explanations, and they call for different responses. The first is that the person had the chance to use the skill and did not use it, or used it poorly. The second is that the work did not give them the chance: no occasion arose, or something in the work stopped them.",
            "From the outside, the two look the same. The calendar shows no one-to-ones, or the sampled replies still lack a next step. The difference only becomes visible when you know what the person's work was like in the window, which is why the third manager question from the last lesson matters so much.",
          ],
        },
        {
          heading: "The skill is missing",
          paragraphs: [
            "In this course a finding is The skill is missing when the person had the chance to use the skill in their work and did not use it, or used it in a way the programme did not teach. A manager with a full team, no unusual pressure, and a free diary who held one one-to-one in four weeks is an example. So is a manager who held every one-to-one but used the time only to hand out tasks.",
            "This finding points back at the programme. It may mean the practice was too thin, the example did not match the job, or the habit needed a follow-up session to take hold. It does not mean the person is at fault, and it should not be reported as a judgement on them. It means the programme has more work to do for this group.",
          ],
        },
        {
          heading: "The work gave no chance to use it",
          paragraphs: [
            "A finding is The work gave no chance to use it when the person did not have the occasion, the time, the tools, or the permission to use the skill. A manager whose team was on leave for three weeks had no occasion. An adviser whose case system template still forces the old reply structure lacks the tool. A manager told by their director to cancel one-to-ones to meet a deadline lacks the permission.",
            "Research on the transfer of training has long found that the work environment, including the support of managers and the opportunity to use new skills, affects whether learning is used. Baldwin and Ford's review in Personnel Psychology in 1988 is the paper most often cited for this. The practical lesson is that retraining someone who already has the skill does nothing about the obstacle, and it tells them the organisation did not listen.",
          ],
          beforeAfter: {
            before: "Three of the eight advisers still leave out the date, so they will repeat the module.",
            after:
              "Three of the eight advisers still leave out the date. Their team leader reports that the case system does not show the new date until the following morning, so the finding is that the work gave no chance to use it, and we have asked the systems team to show the date sooner.",
            reading:
              "The first version treats every missing sign as a missing skill and sends people back to training. The second checks what was happening in the work and fixes the obstacle instead.",
          },
        },
        {
          heading: "Read before you respond",
          paragraphs: [
            "The usual mistake is to read every missing sign as a missing skill, because the programme is the thing L&D controls. The opposite mistake also happens: a sponsor who likes the programme may explain every gap as an obstacle in the work. Reading findings correctly is not about excusing anyone. It is about fixing the right thing.",
            "When you cannot tell which explanation fits, ask the manager what happened in the window before you decide. If nothing in the work stopped the person and they still did not use the skill, treat it as the skill missing for now, plan the extra practice, and look again in the next window. Write down which finding you reached and why, so that the response can be checked later.",
          ],
        },
      ],
      workedExample: {
        title: "Three findings from a delay update programme",
        inputLabel: "The three findings",
        outputLabel: "The L&D lead's reading",
        prompt:
          "Team 1: sampled updates state the date and the next step but not the reason, although advisers wrote many delay updates in the window.\nTeam 2: no delay updates were sent, because the team was moved to handle a product launch.\nTeam 3: advisers say they cannot state the new date because the case system does not show it until the next day.",
        output:
          "Team 1: The skill is missing. More practice on stating the reason, in a short follow-up session.\nTeam 2: The work gave no chance to use it. Sample again when the team returns to normal work.\nTeam 3: The work gave no chance to use it. Ask the systems team to show the new date sooner; do not retrain.",
        reading: [
          "In Team 1 the chance was plainly there, because advisers wrote many updates. The reason was left out, so the programme did not build that part of the skill well enough, and the response is more practice on that part.",
          "In Team 2 there was no occasion. Nothing can be concluded about the skill until the team writes delay updates again, so the right response is to sample later rather than to change the programme.",
          "In Team 3 the system hid the information the skill needs. Retraining the advisers would not put the date on their screen, so the response is a request to the systems team. Each finding gets a different response because each has a different cause.",
        ],
      },
      practice: {
        intro:
          "Here is one finding and two proposed responses. Choose the response that matches the finding. The two sections that define the labels are above if you want to read them again.",
        check: {
          kind: "choose",
          prompt:
            "After a programme on writing shorter tenancy letters at Pennine Homes, housing officers' letters are still three pages long. Their manager explains that the letter template in the housing system has fixed sections that cannot be removed. Choose the response that fits the finding.",
          leftLabel: "Response A",
          left: "Book the housing officers onto the letter-writing session again, with more practice on cutting sections.",
          rightLabel: "Response B",
          right:
            "Record the finding as the work gave no chance to use it, and ask the systems administrator to make the fixed sections optional.",
          correct: "right",
          why: "Response B reads the finding correctly. The template stops officers removing sections, so the work gave no chance to use the skill, and the fix is to change the template rather than the people.",
          wrong:
            "Look again at Response A. The officers cannot remove the fixed sections however well they write, so repeating the session treats an obstacle in the work as a missing skill. Response B fixes the template.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "These findings come from a programme teaching new managers at Dunmore Foods to hold fortnightly one-to-ones. Mark each as the skill is missing or the work gave no chance to use it.",
        passLabel: SKILL,
        failLabel: CHANCE,
        sentences: [
          {
            id: "tasks-only",
            text: "A manager held one-to-ones every fortnight, but the agendas show they used the time only to allocate tasks, without asking the team member anything.",
            fail: false,
            why: "The manager held the meetings, so the chance was there. What is missing is the skill of asking the team member for their view.",
          },
          {
            id: "shutdown",
            text: "A manager's team of four was on a three-week site shutdown, so no one-to-ones were possible.",
            fail: true,
            why: "Nobody could hold a one-to-one while the team was away, so the work gave no chance to use it.",
          },
          {
            id: "director",
            text: "A manager was told by their own director to cancel one-to-ones to meet a deadline.",
            fail: true,
            why: "The manager lost permission to use the skill. Retraining them would not help, because the work gave no chance to use it.",
          },
          {
            id: "full-team",
            text: "A manager with a full team and no deadline pressure held one one-to-one in four weeks.",
            fail: false,
            why: "Nothing in the work stopped this manager. The chance was there, so treat it as the skill missing for now, and ask the manager what happened.",
          },
          {
            id: "no-room",
            text: "A manager could not book a private room, because the office has none, and the team works on an open floor.",
            fail: true,
            why: "The obstacle here is the office, not the manager. The work gave no chance to use it, and the fix is a room or a different arrangement.",
          },
        ],
        why: "You told the findings that need a change to the programme from the findings that need a change to the work. The task-only agendas and the single one-to-one had the chance and missed it, while the shutdown, the director's instruction, and the open floor removed the chance.",
      },
      bridge:
        "You have now practised every move in the course. The next lesson brings them together and assesses them on situations you have not seen, before the final lesson puts them on one sheet.",
    },
    {
      id: "course-assessment",
      title: "Course assessment",
      emphasis: "assessment",
      place:
        "This is the sixth of seven lessons. It recaps the method from the first five lessons, works one mixed example, and then assesses the whole method on situations you have not seen, before the final lesson asks you to write your measurement sheet.",
      sections: [
        {
          heading: "What to stop counting, and what to look for instead",
          paragraphs: [
            "A measure Counts activity when it describes what happened inside the programme: enrolments, completions, time spent, ratings, and quiz scores. A measure Shows the work changed when it describes something in the person's normal work after the programme that is different from before. Activity counts still have uses, such as showing who had the chance to learn, but they cannot answer whether the programme did what it was for.",
            "A sign in the work is what you look for instead. It has four features: it is observable, it appears in normal work, someone other than the learner can see it, and it has a before state. A feeling such as 'more confident', or a performance in a role-play, fails at least one of those features and cannot show that the work changed.",
          ],
        },
        {
          heading: "Collecting a fair comparison",
          paragraphs: [
            "A sign is collected in a window, usually two to six weeks after the programme, set according to how often the work happens. The before and the after are collected in the same way, from the same kind of work, ideally by the same person, with the sample drawn by a rule written down before anyone looks. A line in a plan Can be compared when all of that holds, and Cannot be compared when the method changes, the timing falls inside the programme, or someone who knows the result picks the sample.",
            "When the sign comes from records about individuals, the collection should be proportionate. Tell people in advance what will be sampled and why, collect only what the sign needs, and report at team level, in line with the ICO's guidance on monitoring workers.",
          ],
        },
        {
          heading: "Asking managers, and reading what comes back",
          paragraphs: [
            "Manager questions come in three kinds: what the manager has seen, in the terms of the sign; one example of the work; and what got in the way. They do not ask for a rating of the programme or of the person, and they fit into ten minutes.",
            "A missing sign is then read with one of two labels. The skill is missing when the chance was there and the skill was not used, or not used as taught, which points to the programme. The work gave no chance to use it when there was no occasion, time, tool, or permission, which points to the work. Each finding gets a different response, and when you cannot tell, you ask the manager before you decide.",
            "The assessment at the end of this lesson sets seven situations in HR, retail, finance, healthcare, local government, and customer service. Each question has one right answer and draws on one or more of the moves above. You need six of the seven to pass, and after you submit, each question shows the feedback for the option you chose.",
          ],
        },
      ],
      workedExample: {
        title: "A coaching programme report, read and repaired",
        inputLabel: "The draft report to the sponsor",
        outputLabel: "The report after review",
        prompt:
          "Impact of the coaching conversations programme at Brookfield Housing Association: 58 of 60 team leaders completed. Satisfaction 4.4 out of 5. Team leaders report feeling more confident in difficult conversations. Two team leaders did not hold any coaching conversations, so they will repeat the programme.",
        output:
          "Reach: 58 of 60 team leaders completed, which shows who has had the chance to learn. Sign in the work: in weeks three to six, 41 of 58 team leaders' one-to-one notes recorded a question asking the team member for their own solution, compared with 12 of 58 in the four weeks before, read by the HR business partner against the same standard. Missing signs: of the two team leaders with no coaching conversations, one had a team on secondment to a void repairs project, so the work gave no chance to use it; the other had a full team and no unusual pressure, so we will treat it as the skill missing for now and offer a follow-up session.",
        reading: [
          "The draft put completion and satisfaction under 'Impact', where the sponsor expects evidence that the work changed. The review moves completion to 'Reach' and says what it shows.",
          "The draft's claim about confidence was a feeling reported only by the team leaders. The review replaces it with a sign that someone else can read in normal work, with a before state collected the same way.",
          "The draft sent both team leaders back to the programme. The review asks what happened in each case, finds one obstacle in the work and one missing skill, and gives each a different response.",
        ],
      },
      practice: {
        intro:
          "Before the assessment, choose the better version of one line from the Brookfield report. The worked example and the recap above are on the page if you want to read them again.",
        check: {
          kind: "choose",
          prompt: "Choose the line that shows whether the coaching programme changed the work.",
          leftLabel: "Line A",
          left: "Team leaders' one-to-one notes in weeks three to six recorded a question asking for the team member's own solution in 41 of 58 cases, compared with 12 of 58 in the four weeks before.",
          rightLabel: "Line B",
          right: "Team leaders said in the end-of-programme survey that they now feel much more confident about coaching.",
          correct: "left",
          why: "Line A is a sign in the work. It is observable in one-to-one notes, sits in normal work, is read by someone other than the team leader, and has a before state collected the same way. Line B is a feeling reported by the learners inside the programme.",
          wrong:
            "Look again at Line B. It reports how team leaders feel, in a survey taken at the end of the programme, with no before state and no second person who can see it. Line A describes what their notes now contain, compared with before.",
        },
      },
      check: {
        kind: "scenario",
        prompt:
          "Read each situation and choose what you would do. Each question has one right answer, and you need six of the seven to pass.",
        passMark: 6,
        questions: [
          {
            id: "report",
            situation:
              "Nadia Rahman is an L&D adviser at Hollins Retail. Her quarterly report on a store manager programme shows 96 per cent completion and a satisfaction score of 4.6 out of 5, under the heading 'Programme impact'. The retail director has asked her whether the programme changed how store managers run their weekly stock meetings.",
            question: "What should Nadia do with the report before she answers?",
            options: [
              {
                id: "a",
                text: "Keep the heading and add the quiz scores, so that the director has more evidence to consider.",
                feedback:
                  "Quiz scores come from inside the programme as well, so adding them gives the director more activity counts under a heading that promises impact. The question is about stock meetings, which none of these numbers describe.",
              },
              {
                id: "b",
                text: "Move completion and satisfaction under a heading such as 'Reach and reaction', and add a sign from the stock meetings themselves, with a before state.",
                correct: true,
                feedback:
                  "This is the move the course teaches. Completion and satisfaction count activity, so they are reported for what they show, and the director's question is answered with a sign from normal work compared with before.",
              },
              {
                id: "c",
                text: "Tell the director that a 96 per cent completion rate is strong evidence that store managers are applying the programme.",
                feedback:
                  "Completion shows that managers finished the modules, not what they now do in stock meetings. Presenting it as evidence of application is the habit the course asks you to stop, and it will cost credibility if the meetings have not changed.",
              },
            ],
          },
          {
            id: "sign",
            situation:
              "Ellis Moore is an HR business partner at Carrick Finance. He has drafted this sign for a programme on giving feedback to direct reports: 'Managers feel more comfortable giving constructive feedback.' His sponsor has asked to see the sign before the programme runs next month.",
            question: "What should Ellis change before he sends it?",
            options: [
              {
                id: "a",
                text: "Add a rating scale, so managers score their comfort from one to five after the programme.",
                feedback:
                  "A rating of comfort is still a feeling, reported only by the managers, and a number does not make it observable. The sign needs something a second person could see in the work.",
              },
              {
                id: "b",
                text: "Replace it with managers' performance in the feedback role-play on the final day.",
                feedback:
                  "A role-play is an exercise inside the programme. It shows the skill can be performed on request, but it is not normal work and it has no before state from the job.",
              },
              {
                id: "c",
                text: "Rewrite it as something someone else can see in normal work, such as feedback recorded in monthly check-in notes, read by the HR business partner, compared with the month before.",
                correct: true,
                feedback:
                  "This rewrite has all four features. Check-in notes are observable and part of normal work, the HR business partner reads them rather than the manager, and the month before gives the before state.",
              },
            ],
          },
          {
            id: "window",
            situation:
              "Grace Achebe runs a programme on reconciling supplier statements for the accounts team at Tolworth Borough Council. The team reconciles statements once a month, at month end. Her plan is to sample reconciliations on the Friday of the week the programme ends.",
            question: "What should Grace change in her plan?",
            options: [
              {
                id: "a",
                text: "Set the window to cover at least one month end after the programme, for example weeks three to six, and sample the before state from the month end before it, read the same way.",
                correct: true,
                feedback:
                  "The work happens monthly, so the window has to include a month end or nobody will have had the chance to use the skill. Sampling the before state the same way makes the two comparable.",
              },
              {
                id: "b",
                text: "Keep the Friday, because the programme will be fresh in people's minds and the results will be clearer.",
                feedback:
                  "On that Friday nobody will have met a month end since the programme, so there is no normal work to sample. Fresh memory helps a quiz, which counts activity, not a sign in the work.",
              },
              {
                id: "c",
                text: "Sample reconciliations six months later, so that the change has time to settle.",
                feedback:
                  "Six months is well beyond the window. By then the team, the suppliers, and the systems may all have changed, and any difference would be hard to link to the programme. Two to six weeks, including a month end, is the target.",
              },
              {
                id: "d",
                text: "Ask each team member to choose one reconciliation they are proud of from after the programme.",
                feedback:
                  "A sample chosen by the people being measured will look better for reasons unconnected with the programme. Fix the sampling rule in advance and use a window that includes a month end.",
              },
            ],
          },
          {
            id: "records",
            situation:
              "Tom Kaur is evaluating a programme on writing clear discharge summaries at Severn Vale NHS Trust. The sign is that summaries state the follow-up plan and who owns it. His first idea is to export every summary each junior doctor wrote for two months, with names, and share the results by doctor with the clinical director.",
            question: "What is the better way to collect this sign?",
            options: [
              {
                id: "a",
                text: "Export every summary as planned, because a larger sample always gives a more accurate answer.",
                feedback:
                  "Exporting every summary with names is more than the question needs, and reporting by doctor turns an evaluation of training into monitoring of individuals. A proportionate sample answers the same question.",
              },
              {
                id: "b",
                text: "Ask the junior doctors to tell him in a survey whether their summaries now include the follow-up plan.",
                feedback:
                  "A self-report is a sign only the learner can see, so it fails one of the four features. The records are the right source; the collection just needs to be proportionate.",
              },
              {
                id: "c",
                text: "Drop the sign, because any use of clinical records for evaluation will breach data protection law.",
                feedback:
                  "Records can be used for a stated purpose if the collection is proportionate and explained. Dropping the sign leaves the programme with activity counts only. Sample fewer summaries, tell people, and report at team level.",
              },
              {
                id: "d",
                text: "Tell the doctors in advance what will be sampled, take ten summaries per doctor from the window and the month before, record only whether each states the plan and the owner, and report the proportion for the cohort.",
                correct: true,
                feedback:
                  "This keeps the sign and makes the collection proportionate. People know in advance, only the fields the sign needs are recorded, the before and the after are collected the same way, and the result is reported for the cohort rather than by name.",
              },
            ],
          },
          {
            id: "questions",
            situation:
              "Priya Doshi is an L&D partner at Kestrel Contact Centres. Her sign for a programme on call wrap-up notes is that notes now state what was agreed and the next action. Her draft questions for team leaders are: 'Did the programme help? How would you rate your team's notes now? Anything else?'",
            question: "Which revised set should Priya send to team leaders?",
            options: [
              {
                id: "a",
                text: "'How confident is your team with wrap-up notes now? Would you recommend the programme to other teams? Any other comments?'",
                feedback:
                  "Every question here asks for an opinion or a recommendation, so the answers will tell Priya about feelings towards the programme rather than about the notes.",
              },
              {
                id: "b",
                text: "'In the last two weeks, have you seen your team's wrap-up notes state what was agreed and the next action? Could you send me one note from this week? Has anything made that harder, such as call targets or the notes screen?'",
                correct: true,
                feedback:
                  "This set has the three kinds of question. It asks what the team leader has seen in the terms of the sign, asks for one note Priya can read, and asks what got in the way, with examples. None of it asks for a rating.",
              },
              {
                id: "c",
                text: "'Please rate each team member's wrap-up notes from one to ten, and send me the scores by Friday.'",
                feedback:
                  "Rating each person turns the evaluation into a performance judgement they did not agree to, and a score of one to ten is an opinion rather than evidence. Ask what was seen, for an example, and what got in the way.",
              },
            ],
          },
          {
            id: "template",
            situation:
              "Callum Reid evaluated a programme on writing plain-English letters to benefit claimants at Northgate District Council. Five weeks on, most letters still open with two paragraphs of legal wording. The team manager tells him that the letter templates were approved by legal services and officers are not allowed to change the opening.",
            question: "How should Callum read and respond to this finding?",
            options: [
              {
                id: "a",
                text: "Read it as the skill missing, and run a refresher session on plain-English openings.",
                feedback:
                  "The officers are not allowed to change the opening, so a refresher teaches them to do something the work forbids. This is an obstacle in the work, and retraining leaves it in place.",
              },
              {
                id: "b",
                text: "Report that the programme failed, because the sign is missing.",
                feedback:
                  "A missing sign is not the same as a failed programme. Here the officers lacked permission, which is a finding about the work. Read it before you report it, and send the response to the people who can change the template.",
              },
              {
                id: "c",
                text: "Read it as the work gave no chance to use it, and take the finding to legal services with a proposal to review the opening of the templates.",
                correct: true,
                feedback:
                  "This reads the finding correctly. The officers had no permission to change the opening, so the response is aimed at the template and the people who own it, not at the officers.",
              },
            ],
          },
          {
            id: "chance-there",
            situation:
              "Fiona Walsh sponsors a programme on escalating safeguarding concerns at Linden Care Homes. Four weeks on, one senior carer, Dev, has logged no escalations. His manager says Dev worked his normal shifts, three residents on his unit had incidents that met the escalation threshold, and nothing stopped him from logging them.",
            question: "How should Fiona read this finding?",
            options: [
              {
                id: "a",
                text: "As the skill missing for now, because the chance was there and the skill was not used, and arrange a follow-up with Dev and his manager to look at the escalation step again.",
                correct: true,
                feedback:
                  "The occasion, the time, and the permission were all there, so this is the skill missing for now. The follow-up looks at what the programme did not build for Dev, without treating it as a judgement on him.",
              },
              {
                id: "b",
                text: "As the work gave no chance to use it, because senior carers are always busy.",
                feedback:
                  "His manager says nothing stopped him, and there were three incidents that met the threshold. A general sense that carers are busy is not an obstacle found in this case, so this reading would leave the gap unaddressed.",
              },
              {
                id: "c",
                text: "As a reason to remove the escalation sign from the sheet, because it has produced an awkward result.",
                feedback:
                  "The sign did its job by showing a gap. Removing it because the result is uncomfortable would hide the one piece of evidence that something needs to change.",
              },
            ],
          },
        ],
        why: "You applied the whole method: you reported activity counts for what they show, wrote signs with all four features, planned a fair and proportionate comparison, asked managers for evidence, and read each missing sign before choosing a response.",
      },
      bridge:
        "You have shown you can use every move in the course. The final lesson puts your signs, your collection plan, your manager questions, and your reading of missing signs on one sheet, which becomes your record.",
    },
    {
      id: "the-sheet",
      title: "The sheet",
      emphasis: "sheet",
      place:
        "This is the last of seven lessons. You write the measurement sheet for one programme you run or sponsor, and that sheet appears on your signed record.",
      sections: [
        {
          heading: "What the measurement sheet is",
          paragraphs: [
            "The measurement sheet is one page that says how you will know whether one programme stuck. It names the programme and the skill it was meant to build, lists no more than three signs in the work, says when the signs will be collected, gives the manager questions, says how you will read a missing sign, and lists any activity counts you will still report and what they are for. It names who owns it.",
            "It is not an evaluation report. It is the plan that makes a useful report possible, written before the evidence comes in, so that nobody can choose the measures after they see the results. A sponsor should be able to read it in two minutes and see how the question they care about will be answered.",
          ],
        },
        {
          heading: "Each part, and what it must contain",
          paragraphs: [
            "The skill is written with an action verb and names work, such as 'write a delay update that states the new date, the reason, and the next step', rather than a topic such as 'customer communication'. Each sign carries the four features from the second lesson: what someone would see, where in normal work, who sees it, and the before state. The collection time is a stated window after the programme, usually between two and six weeks, as set in the third lesson.",
            "The manager questions are the three kinds from the fourth lesson: what the manager has seen, one example of the work, and what got in the way. The section on missing signs names both findings from the fifth lesson, the skill is missing and the work gave no chance to use it, and gives a different response for each. The activity counts section says what each count is for and makes clear that it is not evidence the work changed. The owner is a role, such as the L&D lead for customer service.",
            "The sheet contains no names of individual participants, no email addresses, and no telephone numbers. Your own name goes on the record when you sign, not inside the sheet.",
          ],
        },
        {
          heading: "Keep on the sheet, or take off the sheet",
          paragraphs: [
            "Before you write the sheet, review what you drafted in the earlier lessons. A sign you should Keep on the sheet has all four features and a window you can collect in. A sign you should Take off the sheet fails any of the four features: it is a feeling, it lives inside the programme, only the learner can see it, or it has no before state that you could collect.",
            "Three signs is a ceiling, not a target. One strong sign that you will actually collect is worth more than three that nobody has time to sample. If you have more than three candidates, keep the ones closest to what the sponsor asked for and the ones that someone already looks at in their normal work.",
          ],
        },
        {
          heading: "How the sheet is checked, and what the record shows",
          paragraphs: [
            "When you continue, each part is checked in turn. The programme part must name the programme and the skill. The signs must include a before state. The collection time must contain a number or a date. The manager questions must include what was seen, an example, or what got in the way. The missing-sign section must use one of the two findings. The activity counts must be limited with a word such as only, do not, or must not, so that nobody reads them as evidence. The owner must name a role.",
            "If a part is missing, the note will name it and say what to add. When every part is present, you can sign your name against the sheet. The record shows the sheet exactly as you wrote it, under the field headings below, so a sponsor or a verifier can see the plan you made.",
          ],
        },
      ],
      workedExample: {
        title: "A measurement sheet for the delay update programme",
        inputLabel: "The measurement sheet",
        outputLabel: "The covering note to the sponsor",
        prompt:
          "The programme and the skill it builds: the delay updates programme for customer service advisers at Ashgrove Direct, building the skill of writing a delay update that states the new date, the reason, and the next step.\nSigns in the work: 1. What is seen: delay updates with all three parts. Where: updates sent from the case system. Who sees it: team leaders, sampling ten per adviser. Before: about four in ten in the month before. 2. What is seen: customer follow-up contacts asking when an order will arrive. Where: the contact log. Who sees it: the contact centre manager. Before: the count for the month before the programme.\nWhen the signs will be collected: weeks two to five after the programme, first ten updates per adviser in week two, a rule fixed in advance.\nThe three manager questions: In the last two weeks, have you seen updates state the date, the reason, and the next step? Could you send me one update from this week? Has anything made that harder, such as the case system or volumes?\nHow I will read a missing sign, and what I will change: if advisers wrote delay updates and left a part out, the skill is missing and we will run a short practice session; if the system hides the date or there were no delays, the work gave no chance to use it and we will go to the systems team or sample again later.\nActivity counts I will still report, and what they are for: completion only, to show who has had the chance to learn; it must not be read as evidence that the work changed.\nOwner: the L&D lead for customer service.",
        output:
          "The attached sheet sets out how we will judge the delay updates programme. We will look at two things in normal work: whether updates now state the date, the reason, and the next step, and whether fewer customers contact us to ask when their order will arrive. Both are compared with the month before. We will collect them in weeks two to five and report back in week six, with completion shown separately as reach.",
        reading: [
          "The skill is written as work someone could watch, and each sign carries all four features, with a before state collected the same way as the after.",
          "The window and the sampling rule are fixed in advance, and the three manager questions follow the three kinds. The missing-sign section gives a different response for each finding.",
          "Completion is kept, but it is limited to showing reach. The covering note to the sponsor is short because the sheet does the work, and the sponsor can see how their question will be answered before any evidence arrives.",
        ],
      },
      practice: {
        intro:
          "Before you write your own sheet, review these candidate signs for a programme on running probation reviews at Wrenfield Engineering. Mark each one with one of the two labels from the section above.",
        check: {
          kind: "mark",
          prompt: "Mark each candidate sign as Keep on the sheet or Take off the sheet.",
          passLabel: KEEP,
          failLabel: TAKE_OFF,
          sentences: [
            {
              id: "forms",
              text: "Probation review forms completed in weeks three to eight record at least one agreed objective with a date, read by the HR adviser, compared with forms from the quarter before.",
              fail: false,
              why: "It is observable in forms from normal work, read by the HR adviser, with a before state from the previous quarter, so keep it on the sheet.",
            },
            {
              id: "aware",
              text: "Managers are more aware of how to run a fair probation review.",
              fail: true,
              why: "Awareness is a feeling that only the manager can report, with no before state, so take it off the sheet.",
            },
            {
              id: "roleplay",
              text: "Managers score at least four out of five in the probation review role-play on day two.",
              fail: true,
              why: "The role-play is an exercise inside the programme, not normal work, so take it off the sheet.",
            },
            {
              id: "on-time",
              text: "The number of probation reviews held by the due date, from the HR system, compared with the six months before the programme.",
              fail: false,
              why: "The HR system records it in normal work, someone other than the manager can see it, and the six months before give the comparison, so keep it on the sheet.",
            },
          ],
          why: "That is right. The review forms and the on-time count have all four features, while awareness is a feeling and the role-play sits inside the programme.",
        },
      },
      check: {
        kind: "build",
        prompt:
          "Write the measurement sheet for your programme. A sponsor should be able to see how you will know whether it stuck.",
        fields: [
          {
            id: "programme",
            label: "The programme and the skill it builds",
            hint: "Name the programme, and write the skill as work someone could watch, starting with an action verb.",
            min: 30,
            any: ["programme", "course", "training", "workshop", "induction", "session"],
            missing:
              "The programme and the skill it builds does not yet name the programme. Say which programme this is, and write the skill as work, such as 'write a delay update that states the new date'.",
          },
          {
            id: "signs",
            label: "Signs in the work",
            hint: "One to three signs. For each: what is seen, where in normal work, who sees it, and the before state.",
            min: 80,
            any: ["before", "baseline", "previously", "compared with", "prior", "last month", "last quarter"],
            missing:
              "Signs in the work do not yet include a before state. For each sign, say what someone would see, where, who sees it, and what the work looked like before the programme.",
          },
          {
            id: "timing",
            label: "When the signs will be collected",
            hint: "A window after the programme, written in figures, such as weeks 3 to 6, and how the sample is drawn.",
            min: 16,
            rule: "fact",
            any: ["week", "weeks", "month", "after"],
            missing:
              "When the signs will be collected does not yet give a window. State the weeks after the programme in figures, for example weeks 3 to 6 after the programme.",
          },
          {
            id: "questions",
            label: "The three manager questions",
            hint: "One on what the manager has seen, one asking for an example of the work, and one on what got in the way.",
            min: 60,
            any: ["seen", "noticed", "example", "send", "share", "in the way", "harder"],
            missing:
              "The three manager questions do not yet ask for evidence. Ask what the manager has seen, not what they think of the programme, and ask for one example and what got in the way.",
          },
          {
            id: "reading",
            label: "How I will read a missing sign, and what I will change",
            hint: "Name both findings, the skill is missing and the work gave no chance to use it, and a different response for each.",
            min: 60,
            any: ["skill is missing", "no chance", "chance to use", "opportunity", "occasion"],
            missing:
              "How I will read a missing sign does not yet name the two findings. Say what you will do if the skill is missing, and what you will do if the work gave no chance to use it.",
          },
          {
            id: "activity",
            label: "Activity counts I will still report, and what they are for",
            hint: "Say what each count is for, and limit it with only, do not, or must not, so no one reads it as evidence.",
            min: 20,
            rule: "limit",
            missing:
              "Activity counts I will still report does not yet set a limit. Say what each count is for, using only, do not, or must not, for example 'completion only, to show who has had the chance to learn'.",
          },
          {
            id: "owner",
            label: "Owner",
            hint: "The role that owns this sheet, such as the L&D lead for customer service.",
            min: 6,
            rule: "role",
            missing: "Owner is still too thin. Name the role that owns the sheet, for example the L&D lead for customer service.",
          },
        ],
        why: "Your sheet has every part. It names the programme and the skill, gives signs with a before state, sets a window, asks managers for evidence, reads missing signs with both findings, and limits activity counts to what they can show, so a sponsor can see how you will know whether it stuck.",
      },
      bridge:
        "Your measurement sheet is ready. Sign your name below, and the record will show this sheet, the course, and the date to anyone who opens the reference.",
    },
  ],
};
