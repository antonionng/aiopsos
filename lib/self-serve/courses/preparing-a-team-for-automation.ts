/*
Course: Preparing a Team for Automation
Slug: preparing-a-team-for-automation
For: Team leaders, operations managers, and HR or learning partners responsible for people whose work
  will change when a robot or other automation is introduced. They know which automation is coming,
  roughly when, and which process it touches. They need no technical knowledge of the equipment.
Outcome: The learner can list everyone affected by a specific automation, directly and indirectly,
  write what each group must be able to do as something a supervisor could watch, state plainly which
  tasks and routines stop, separate what is decided from what is not in a message to the team, and put
  all of it into a preparation brief a colleague could use to run the change without them.
Artefact: The preparation brief, in five parts: who is affected; what they must be able to do; what
  stops; what is decided, what is not, and when people will know; the first weeks.
Record sentence: Wrote and signed a preparation brief that names everyone an automation affects, what
  each group must be able to do, what stops, what is and is not decided, and who will watch each group
  in the first weeks.
Lessons (id, title, move, interaction, pass rule):
  1. who-is-affected, Who is affected, sort people into directly and indirectly affected,
     mark (Directly affected / Indirectly affected), every group marked correctly.
  2. what-they-must-do, What they must be able to do, tell a capability you could watch from one you
     could not, practice choose then mark (Something you can watch / Not yet something you can watch),
     every statement marked correctly.
  3. what-stops, What stops, name the tasks and routines that stop in plain words, practice mark
     (Names what stops / Talks round it), check choose (Paragraph A / Paragraph B), the paragraph that
     names what stops.
  4. what-you-will-not-pretend, What you will not pretend, separate what is decided from what is
     promised without agreement, practice choose, check mark (Says what is decided / Promises what is
     not decided), every sentence marked correctly.
  5. the-first-weeks, The first weeks, turn capabilities into a plan with a person and a date, practice
     choose, check edit, the edit adds a watcher, names the person on nights, and names who to call after
     the supplier leaves, while keeping the supplier and the 10 June practice.
  6. course-assessment, The course assessment, apply every move to new situations, practice choose,
     check scenario of eight questions, six correct to pass.
  7. the-preparation-brief, The preparation brief, write the artefact, practice mark (Ready to use /
     A colleague would have to ask), check build of five parts: affected names an indirectly affected
     group; capabilities use "can" or "able to"; what stops names a stop; decided includes a not decided
     item and a concrete time; first weeks names a role and a concrete date or name.
Sources: ACAS guidance on managing change at work and on consulting employees, including the guidance on
  the Information and Consultation of Employees Regulations 2004. CIPD public guidance on change
  management and on introducing technology at work. UK Health and Safety Executive guidance on managing
  organisational change, on the Management of Health and Safety at Work Regulations 1999, and its human
  factors guidance on training and competence. The supplier's own training materials and manuals.
Tested on phone:          no
Tested returning learner: no
Pass rule tests written:  yes
*/
import type { CourseContent } from "./types.ts";

const DIRECT = "Directly affected";
const INDIRECT = "Indirectly affected";
const WATCH = "Something you can watch";
const NOT_WATCH = "Not yet something you can watch";
const NAMES_STOP = "Names what stops";
const TALKS_ROUND = "Talks round it";
const DECIDED = "Says what is decided";
const NOT_DECIDED = "Promises what is not decided";
const READY = "Ready to use";
const ASK = "A colleague would have to ask";

export const COURSE: CourseContent = {
  slug: "preparing-a-team-for-automation",
  hours: 2,
  artefact: {
    lessonId: "the-preparation-brief",
    title: "The preparation brief",
    recordLine:
      "Wrote and signed a preparation brief that names everyone an automation affects, what each group must be able to do, what stops, what is and is not decided, and who will watch each group in the first weeks.",
  },
  lessons: [
    {
      id: "who-is-affected",
      title: "Who is affected",
      emphasis: "affected",
      place:
        "This is the first of seven lessons and the start of the first module. It produces the list of people that every later part of your preparation brief will serve, so the rest of the course depends on getting it right.",
      sections: [
        {
          heading: "Directly affected",
          paragraphs: [
            "People are directly affected when the tasks they do each day will change. On a packing line that is getting a robot palletiser, the packers who stack cases by hand are directly affected, because the robot takes their task. So is the team leader who will now start the robot at the beginning of each shift and recover it when it stops, because those are new daily tasks. The test is simple to state: if you watched this person on an ordinary Tuesday after go-live, would you see them doing something different at the automation itself.",
            "Directly affected does not mean worse off, and it does not mean better off. It is a description of what changes in the work, not a judgement of whether the change is good for the person. Keep the two apart. A packer who no longer lifts cases may welcome the change and still be directly affected, and a team leader who dreads it is directly affected in exactly the same sense.",
          ],
        },
        {
          heading: "Indirectly affected",
          paragraphs: [
            "People are indirectly affected when their work changes because of the automation, but they do not work at it. The maintenance technicians who will now look after the robot are indirectly affected. So are the shift planners whose labour plan must fit the robot's pace, the team upstream who must present parts or cases differently, the quality inspectors who will meet different defects, and the night shift who inherit whatever the day shift started.",
            "This group is the one managers leave out, and for an understandable reason. When you picture the change, you picture the machine and the people standing next to it. The planner at a desk two buildings away does not come to mind. Yet a well-run introduction can still produce a maintenance team that was never trained and a scheduler who finds out on the day, and both of those failures begin with a list that stopped at the machine.",
            "The practical way to find indirectly affected people is to walk the flow. Start where the material arrives and follow it to where it leaves, and at each step ask who touches it, who plans it, who fixes it, who cleans round it, and who picks it up on the next shift. Each answer is a candidate for the list.",
          ],
          beforeAfter: {
            before: "Affected: the packers on line 3.",
            after:
              "Directly affected: the line 3 end-of-line packers; the line 3 team leader. Indirectly affected: maintenance technicians on days and nights; the shift planner; forklift drivers who collect finished pallets; the night shift, who restart the line.",
            reading:
              "The first list names the people beside the machine. The second came from walking the line from the case erector to the despatch bay, and it adds five groups whose work changes because of the robot.",
          },
        },
        {
          heading: "People who believe they are affected",
          paragraphs: [
            "There is a third fact to record. Some people believe they are affected when they are not. The forklift drivers in a warehouse whose trolleys are being replaced by mobile robots may ask whether their work will change, even though their own tasks will be the same on the Monday after go-live as on the Friday before it.",
            "Their belief is real, and it needs an answer. They do not belong on the list of changed tasks, but they belong in the brief, under their own heading, with a note of what they will be told and when. If you leave them out, the first thing they hear will be a rumour in the canteen, and a group that was never going to be affected becomes the most anxious group on site.",
          ],
        },
        {
          heading: "The mistake to avoid",
          paragraphs: [
            "The usual mistake is to write the list from memory at a desk, in five minutes, and to stop when it contains the people who operate the machine. A list written that way is short, tidy, and wrong. It feels finished because every name on it is correct, but the gaps are invisible until someone in one of the missing groups is surprised.",
            "In this course you will sort each group with two labels. The first is Directly affected, for people whose own daily tasks change at the automation. The second is Indirectly affected, for people whose work changes because of the automation although they do not work at it. When a group seems to sit between the two, ask whether they will stand at the automation and do something new. If they will, they are directly affected. If their work changes somewhere else, they are indirectly affected.",
          ],
        },
      ],
      workedExample: {
        title: "Mobile robots at Kestrel Distribution",
        inputLabel: "The first list",
        outputLabel: "The list after walking the flow",
        prompt:
          "Kestrel Distribution, Northampton site. Autonomous mobile robots will carry totes from picking to packing. Affected: the pickers who currently push trolleys to packing.",
        output:
          "Directly affected: pickers, who will place totes on robots instead of pushing trolleys; packers, who will receive totes from robots at the benches. Indirectly affected: the engineering team, who will maintain the robots and chargers; the shift planners, whose labour plans change; the cleaning contractor, whose routes must avoid robot paths; the night shift, who will start the system at the beginning of each shift. People who believe they are affected: the forklift drivers, whose work does not change but who have asked whether it will.",
        reading: [
          "The first list was written by the operations manager, Aisha Rahman, at her desk. It names one group, and every word of it is accurate, which is why it felt complete.",
          "The second list came from walking the flow from the pick face to the packing benches with the shift manager. Packers were added as directly affected because totes now arrive at their benches on a robot. Engineering, planning, the cleaning contractor, and nights were added as indirectly affected because their work changes although none of them works at a robot.",
          "The forklift drivers appear under their own heading. Their tasks do not change, and the list says so, but they asked a question in a team briefing, and the brief now records that they will be given a plain answer.",
        ],
      },
      practice: {
        intro:
          "Here are three groups from the Kestrel Distribution list. Mark each one with the labels you have just learned. The worked example is still above if you want to compare.",
        check: {
          kind: "mark",
          prompt: "Mark each Kestrel group as Directly affected or Indirectly affected.",
          passLabel: DIRECT,
          failLabel: INDIRECT,
          sentences: [
            {
              id: "pickers",
              text: "Pickers, who will place full totes on a waiting robot at the end of each aisle.",
              fail: false,
              why: "Placing totes on a robot is a new daily task at the automation itself, so the pickers are directly affected.",
            },
            {
              id: "planners",
              text: "Shift planners, whose labour plan must now fit the robots' charging pattern.",
              fail: true,
              why: "The planners never touch a robot, but their plan changes because of the robots, which is what indirectly affected means.",
            },
            {
              id: "cleaners",
              text: "The cleaning contractor, whose evening routes must now avoid the robot paths.",
              fail: true,
              why: "The cleaners do not work at the robots, but their routes change because of them, so they are indirectly affected.",
            },
          ],
          why: "That is right. The pickers now do a new task at the robot, and the planners and the cleaners change their work because of it without working at it.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "Harrow Foods is introducing a robot palletiser at the end of line 3 at its Wakefield factory. Mark each group as Directly affected or Indirectly affected.",
        passLabel: DIRECT,
        failLabel: INDIRECT,
        sentences: [
          {
            id: "packers",
            text: "The line 3 end-of-line packers who currently stack cases onto pallets.",
            fail: false,
            why: "These packers do the task the robot will take, so their daily work changes directly.",
          },
          {
            id: "maintenance",
            text: "The maintenance technicians on days and nights.",
            fail: true,
            why: "They do not stack pallets, but they will now maintain the robot. Their work changes because of the automation, which is what indirectly affected means.",
          },
          {
            id: "forklift",
            text: "The forklift drivers who collect finished pallets, who will now collect them from a new pick-up point with a different pattern.",
            fail: true,
            why: "The drivers do not work at the palletiser, but their routine changes because of it. That is indirectly affected.",
          },
          {
            id: "team-leader",
            text: "The line 3 team leader, who will now run the robot's start of shift and recover its stops.",
            fail: false,
            why: "Running the start and recovering stops are new daily tasks for this team leader at the robot. That is directly affected.",
          },
        ],
        why: "You saw the people whose own tasks change and the people whose work changes because of the robot. The packers and the team leader will stand at the palletiser and do something new, while maintenance and the forklift drivers change their work elsewhere.",
      },
      bridge:
        "Now that you know who is affected, the next lesson asks what each of those groups must be able to do, in words you could check by watching them.",
    },
    {
      id: "what-they-must-do",
      title: "What they must be able to do",
      emphasis: "able",
      place:
        "This is the second module. In the first lesson you listed the people affected by the change. This lesson turns that list into capabilities, which are the heart of the brief and of the plan for the first weeks.",
      sections: [
        {
          heading: "A capability is something you could watch",
          paragraphs: [
            "A capability statement says what a person must be able to do, in words that describe something you could watch them do and judge. 'Can carry out the start of shift on the palletiser in the order on the shift card' is a capability statement. A supervisor could stand beside the operator at six in the morning, watch the start of shift, and say either that it was done to the card or that it needs practising again.",
            "A good statement has three parts. It names the task, it names the standard the task is done to, and it says where that standard is written down if it is written anywhere. The standard might be the shift card, the site's lockout procedure, the manufacturer's manual, or the floor markings. When nothing is written down, that is worth knowing, because it tells you there is a document to write before go-live.",
          ],
        },
        {
          heading: "What a capability is not",
          paragraphs: [
            "'Understands the robot', 'is comfortable with automation', and 'has had training' are not capability statements. You cannot watch someone understand, and you cannot watch someone be comfortable. Attending training is an event, not a capability. It shows that a person was in the room, and it does not show that they can do the task on a busy shift with a stop to clear.",
            "These phrases appear in almost every first draft because they are kind and they are easy to write. They describe what the manager hopes the person will feel. The difficulty is that they cannot be checked, so they cannot be signed off, and a plan built on them has no way of knowing whether it has worked until something goes wrong.",
          ],
          beforeAfter: {
            before: "Packers will be trained on the palletiser and will be confident using it.",
            after:
              "Packers can load an empty pallet into the magazine and restart the robot from the panel, following the shift card. Packers can clear a case jam at the infeed after stopping the robot with the stop button on the guard.",
            reading:
              "The first version describes an event and a feeling. The second describes two tasks a team leader could watch, each with its standard, and either sign off or practise again.",
          },
        },
        {
          heading: "Each group needs its own statements",
          paragraphs: [
            "Every group on your list from the first lesson needs its own statements, because the groups need very different things. A packer needs to load the magazine and clear a jam. A maintenance technician needs to isolate the cell and replace worn parts. A shift planner needs to build a labour plan around the robot's cycle and its planned maintenance windows. A single line such as 'all staff trained on the new system' hides all of these differences.",
            "Indirectly affected groups need statements too, and this is where drafts usually fall short. If the forklift drivers will collect pallets from a new pick-up point, their capability is to collect from that point in the new pattern without entering the robot's guarded area. It is a small statement, and it is the one that prevents a driver reversing into a fence on the first morning.",
          ],
        },
        {
          heading: "The two labels in this lesson",
          paragraphs: [
            "In this lesson you will read statements and sort them with two labels. Something you can watch is the label for a statement that names a task a supervisor could observe and judge against a standard. Not yet something you can watch is the label for a statement that describes a feeling, a state of mind, or an event such as attending a course.",
            "The second label says not yet on purpose. A statement that fails the test is rarely wrong about what matters. It usually points at a real need in vague words, and it can almost always be rewritten as a task. 'Technicians will be familiar with the robot' becomes 'Technicians can take the robot out of service and return it to service following the manual', and the need behind the first version is now something you can check.",
          ],
        },
      ],
      workedExample: {
        title: "Capabilities for the Kestrel pickers",
        inputLabel: "The first draft",
        outputLabel: "The capability statements",
        prompt: "Pickers will be trained on the robots and will be confident using them.",
        output:
          "Pickers can place a full tote on a waiting robot and send it to packing from the screen. Pickers can tell a robot that is waiting for a tote from one that is stopped with a fault, by reading the light and the screen. Pickers can step out of a robot's path and let it pass, as shown on the floor markings.",
        reading: [
          "The first draft described an event, which was training, and a feeling, which was confidence. Neither could be checked on the first morning.",
          "The first statement names a task and where it is done. The second names a judgement the picker must make and exactly what they read to make it. The third names a safety behaviour and the standard, which is the floor markings.",
          "The shift manager, Callum Brooks, could stand in aisle 12 on the first morning and watch all three being done. That is the test each statement in your brief has to meet.",
        ],
      },
      practice: {
        intro:
          "Before you sort statements yourself, choose between two drafts for the Harrow Foods packers. The section above on what a capability is not will help.",
        check: {
          kind: "choose",
          prompt: "Choose the statement a team leader could check by watching a packer on the first shift.",
          leftLabel: "Statement A",
          left: "Packers will be comfortable working alongside the new palletiser.",
          rightLabel: "Statement B",
          right:
            "Packers can clear a case jam at the infeed after stopping the robot with the stop button on the guard, following the shift card.",
          correct: "right",
          why: "Statement B names a task, the order it is done in, and where the standard is written, so a team leader could watch it and sign it off. Statement A describes a feeling that nobody can watch.",
          wrong:
            "Look again at Statement A. Being comfortable is a feeling, and a team leader cannot watch it or sign it off. Statement B names the task and the shift card it follows.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "These capability statements were drafted for the maintenance technicians who will look after a new robot cell at Brennan Fabrications. Mark each as Something you can watch or Not yet something you can watch.",
        passLabel: WATCH,
        failLabel: NOT_WATCH,
        sentences: [
          {
            id: "familiar",
            text: "Technicians will be familiar with the robot.",
            fail: true,
            why: "You cannot watch someone be familiar. Rewrite it as a task they carry out.",
          },
          {
            id: "isolate",
            text: "Technicians can isolate the cell following the site's lockout procedure and prove it is isolated before entering.",
            fail: false,
            why: "This names a specific task and the procedure it follows, so a supervisor could watch it being done.",
          },
          {
            id: "gripper",
            text: "Technicians can replace the gripper fingers and run the test cycle in the manufacturer's manual.",
            fail: false,
            why: "Replacing the fingers and running the test cycle are observable tasks with a written standard.",
          },
          {
            id: "course",
            text: "Technicians will have attended the supplier's two-day course.",
            fail: true,
            why: "Attending a course shows that someone was in the room. It does not show what they can do, so name the task instead.",
          },
        ],
        why: "You kept the statements that describe a task you could watch and set aside the ones that describe attendance or a state of mind. Isolating the cell and changing the gripper can be observed against a written standard, and familiarity and attendance cannot.",
      },
      bridge:
        "Preparing people also means saying plainly what will end, and the next lesson is about naming the tasks and routines that stop.",
    },
    {
      id: "what-stops",
      title: "What stops",
      emphasis: "stops",
      place:
        "This is the third module. You have a list of people and what each must be able to do. This lesson deals with the part of a change that managers are most tempted to leave unsaid, which is what comes to an end.",
      sections: [
        {
          heading: "Every automation stops something",
          paragraphs: [
            "Every automation stops something. Tasks stop, such as stacking cases by hand or pushing a trolley to the packing benches. Routines stop too, such as the rotation between the palletising station and the line, the walk that breaks up a long shift, or the chance to talk to a colleague while working side by side. These routines are rarely written in any procedure, but people value them, and they notice at once when they are gone.",
            "Sometimes roles stop or shrink. That is a matter for HR, for consultation, and for a careful process, and it is outside what this lesson teaches you to announce. Where a change could affect jobs, hours, pay, or terms, involve HR before you say anything. ACAS publishes guidance on managing change and on consulting employees, and your HR partner will know which duties apply in your case.",
          ],
        },
        {
          heading: "Why you name it plainly",
          paragraphs: [
            "People will notice what stops whether you say it or not. The packer who stacked cases for eleven years will see on the first morning that there is no stacking station. If nobody has told her, she will fill the silence herself, and she will usually fill it with the worst reading available. A plain sentence given a few weeks earlier would have let her plan, ask questions, and hear the answer from you rather than from a rumour.",
            "Naming what stops is also a courtesy. It shows that you have looked at the work as the team experiences it, and not only as a line on a project plan. A team that hears its manager say 'the rotation between stacking and the line will stop, because there will be no stacking station' knows that the manager has understood what the change means for them.",
          ],
        },
        {
          heading: "What naming it is not",
          paragraphs: [
            "Saying what stops is not the same as saying that people will lose their jobs, and it must never be used to hint at that. A sentence such as 'some of you may want to think about your future' is not plain. It hints at a decision about roles without naming it, which is the worst of both, because it frightens people and gives them nothing they can check.",
            "It is also not the same as describing the change only by what it adds. Phrases such as 'exciting new technology', 'transform how we work', or 'free you up for more valuable activities' describe gains, and people correctly hear them as a way of avoiding the question. They are not always false, but on their own they say nothing about the Monday after go-live.",
          ],
          beforeAfter: {
            before:
              "The new palletiser is an exciting opportunity that will transform how we work on line 3 and free you up for more valuable activities.",
            after:
              "From the week of 3 November, you will no longer stack cases onto pallets by hand at the end of line 3. The rotation between the stacking station and the line will stop, because there will be no stacking station. You will load the robot's pallet magazine, clear its stops, and check the wrapped pallets.",
            reading:
              "The first version says nothing people can plan around, and it hints at a change without naming it. The second says what stops, what ends with it, and what replaces it, with a week people can put in a diary.",
          },
        },
        {
          heading: "The two labels in this lesson",
          paragraphs: [
            "In this lesson you will read sentences from draft messages and sort them with two labels. Names what stops is the label for a sentence that says, in plain words, which task or routine will end, and ideally when. Talks round it is the label for a sentence that describes only what the change adds, or that hints at an ending without saying what it is.",
            "A message does not have to be made only of sentences that name what stops. It can and should say what replaces the old task, and it can say honestly what the team gains. The test is whether the message, read as a whole, contains at least one plain sentence about what ends. If it does not, it is talking round the change.",
          ],
        },
      ],
      workedExample: {
        title: "Two drafts for the Harrow Foods packing team",
        inputLabel: "Draft one",
        outputLabel: "Draft two",
        prompt:
          "The new palletiser is an exciting opportunity that will transform how we work on line 3 and free you up for more valuable activities.",
        output:
          "From the week of 3 November, you will no longer stack cases onto pallets by hand at the end of line 3. The rotation between the stacking station and the line will stop, because there will be no stacking station. You will load the robot's pallet magazine, clear its stops, and check the wrapped pallets.",
        reading: [
          "Draft one was written by the production manager, Gareth Hughes, in the first week of the project. Every word in it talks round the change. 'Transform' and 'more valuable activities' hint that something will end without saying what.",
          "Draft two names the task that stops, which is stacking by hand, and the routine that ends with it, which is the rotation. It gives a week, which people can plan around.",
          "The last sentence of draft two says what replaces the old task. That is not a softening. It is the information a packer needs next, and it leads straight into the capability statements from the second lesson.",
        ],
      },
      practice: {
        intro:
          "Ashby Print is introducing an automated box folder in its finishing room. Here are three sentences from the supervisor's draft. Mark each with the labels you have just learned.",
        check: {
          kind: "mark",
          prompt: "Mark each sentence as Names what stops or Talks round it.",
          passLabel: NAMES_STOP,
          failLabel: TALKS_ROUND,
          sentences: [
            {
              id: "folding",
              text: "From January, you will no longer fold and tape cartons by hand at the finishing bench.",
              fail: false,
              why: "This sentence names the task that stops and gives the month, so it names what stops.",
            },
            {
              id: "step-forward",
              text: "The folder is a big step forward for the finishing room and for all of us.",
              fail: true,
              why: "This sentence describes only a gain. It does not say what ends, so it talks round it.",
            },
            {
              id: "breaks",
              text: "The shared folding table by the window will go, and with it the paired folding you do on Friday afternoons.",
              fail: false,
              why: "This sentence names a routine that stops, the paired folding on Fridays, in words the team will recognise.",
            },
          ],
          why: "That is right. The first and third sentences say plainly which task and which routine end, and the second describes only what the change adds.",
        },
      },
      check: {
        kind: "choose",
        prompt:
          "Two paragraphs have been drafted to tell the Kestrel Distribution picking team about mobile robots. Choose the paragraph that says plainly what stops.",
        leftLabel: "Paragraph A",
        left: "Robots will support our pickers and make their day easier, allowing them to focus on what they do best.",
        rightLabel: "Paragraph B",
        right:
          "From March, pickers will no longer push trolleys to the packing benches. The walk to packing, which is currently most of the day's steps, will stop. Pickers will place totes on robots at the end of each aisle.",
        correct: "right",
        why: "You chose the paragraph that names what stops in words people can plan around. Paragraph B names the task that stops, the routine that ends with it, and what replaces it, with a month.",
        wrong:
          "Paragraph A describes what the robots add but never says what stops, so it talks round the change. People will notice what stops whether you say it or not. Choose the paragraph that names it.",
      },
      bridge:
        "Being plain about what stops leads straight to the harder question of what you do not yet know, and the next lesson is about not pretending.",
    },
    {
      id: "what-you-will-not-pretend",
      title: "What you will not pretend",
      emphasis: "pretend",
      place:
        "This lesson completes the third module. You can now say what stops. This lesson is about honesty in the rest of the message to the team, and in particular about what has and has not been decided.",
      sections: [
        {
          heading: "Decided and not decided",
          paragraphs: [
            "In any change there are things that are decided and things that are not. A thing is decided when the people with the authority to agree it have agreed it. The go-live month, the training plan, and the equipment being bought are often decided early. Shift patterns, grades, hours, and the number of people needed on a line are often not decided until much later, and some of them may need consultation before they can be decided at all.",
            "A message says what is decided when it states a fact that has been agreed in that way. A message promises what is not decided when it offers reassurance, a date, or an outcome that nobody has yet agreed. 'Nobody's job will change' is a promise of this kind when the question of jobs has not been decided, however sincerely it is meant.",
          ],
        },
        {
          heading: "Why kind promises do damage",
          paragraphs: [
            "Managers make these promises out of kindness. A team member asks a worried question in a huddle, and the natural thing is to reassure them. The difficulty is that a promise about something that has not been decided is a guess, and if the guess turns out to be wrong the team remembers who made it. The next message from that manager, however accurate, is read with suspicion.",
            "A promise can also bind the organisation in ways the manager did not intend. A team leader who tells a welder that he will get a new grade has created an expectation that HR may not be able to meet, and may have said something that affects a later conversation about terms. That is not a reason to say nothing. It is a reason to say only what you know.",
          ],
        },
        {
          heading: "The honest alternative",
          paragraphs: [
            "The honest alternative has three parts. Say what is decided. Say what is not decided. Say when people will know, and who will tell them. 'Shift patterns have not yet been decided, and HR will talk to the team about them before any change is agreed' is honest and specific, and it gives people something to hold you to that you can keep.",
            "Where the change could affect jobs, pay, or hours, involve HR before you say anything about those subjects. In the UK there may be legal duties to inform and consult employees or their representatives, and ACAS publishes guidance on this, including on the Information and Consultation of Employees Regulations 2004. This lesson does not tell you what those duties are in your case. It teaches you not to promise what you do not know.",
          ],
          beforeAfter: {
            before: "Don't worry, the robot won't change anyone's hours.",
            after:
              "Hours have not been decided yet. Siobhan Kelly from HR will meet the team about hours before any change is agreed, and the first meeting is in the week of 19 January.",
            reading:
              "The first version promises an outcome nobody has agreed. The second says plainly that it is not decided, names who will talk about it, and says when.",
          },
        },
        {
          heading: "The two labels in this lesson",
          paragraphs: [
            "In this lesson you will mark sentences with two labels. Says what is decided is the label for a sentence that states something the project or the business has agreed. Promises what is not decided is the label for a sentence that offers reassurance, a date, or an outcome that has not been agreed.",
            "To use the labels, you need to know what has been agreed, so check before you write. Ask the project lead which dates are fixed, ask HR which questions about people are open, and write down both lists. Then read your message sentence by sentence against them. A sentence that is not on the agreed list, and that sounds like a commitment, is a promise that is not yet yours to make.",
          ],
        },
      ],
      workedExample: {
        title: "A team leader's message about line 3",
        inputLabel: "The first draft",
        outputLabel: "The message after checking with the project and HR",
        prompt:
          "Don't worry, nobody is going to lose out. The robot is going live on 1 March and everyone will be retrained. Your shift patterns will stay exactly the same.",
        output:
          "The robot is planned to go live in March. The exact date will be confirmed by the end of January. Everyone on line 3 will be trained on the new tasks before go-live. Shift patterns have not yet been decided, and HR will talk to the team about them before any change is agreed.",
        reading: [
          "The first draft made four statements, and only one of them, the training, had been agreed. 'Nobody is going to lose out' and 'shift patterns will stay exactly the same' promised what is not decided, and the date of 1 March had not been fixed.",
          "The team leader, Dean Walsh, checked with the project lead and with HR before sending. The rewritten message keeps the training commitment, turns the date into a statement of when it will be known, and names who will talk about shift patterns.",
          "Nothing in the second version is less kind. It is more useful, because every sentence in it will still be true in March.",
        ],
      },
      practice: {
        intro:
          "A packer at Harrow Foods has asked the team leader whether the palletiser means fewer people on line 3. Staffing has not been decided. Choose the reply that does not pretend. The honest alternative is described above.",
        check: {
          kind: "choose",
          prompt: "Choose the reply the team leader could give without promising what is not decided.",
          leftLabel: "Reply A",
          left: "That has not been decided yet. HR will talk to the whole team about staffing before anything is agreed, and I will tell you the date of that meeting by Friday.",
          rightLabel: "Reply B",
          right: "No, nobody is going anywhere. The robot is here to help you, not to replace you.",
          correct: "left",
          why: "Reply A says plainly that staffing is not decided, names who will talk about it, and says when the packer will hear more. Reply B promises an outcome nobody has agreed.",
          wrong:
            "Look again at Reply B. Staffing has not been decided, so 'nobody is going anywhere' promises what is not decided. Reply A says it is open and says when the team will know.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "A manager at Brennan Fabrications has drafted this message about a new robotic welding cell. The project has agreed only the go-live month and the training plan. Mark each sentence.",
        material: {
          label: "What the project has agreed",
          text: "Go-live in June. Every welder trained to load and recover the cell before go-live. Nothing else about hours, grades, or staffing has been agreed.",
        },
        passLabel: DECIDED,
        failLabel: NOT_DECIDED,
        sentences: [
          {
            id: "june",
            text: "The welding cell will go live in June.",
            fail: false,
            why: "The project has agreed the go-live month, so this sentence says what is decided.",
          },
          {
            id: "training",
            text: "Every welder will be trained to load and recover the cell before it goes live.",
            fail: false,
            why: "The training plan is one of the things the project has agreed, so this sentence says what is decided.",
          },
          {
            id: "hours",
            text: "Nobody's hours will change.",
            fail: true,
            why: "Hours are not among the things the project has agreed. This sentence promises what is not decided, so say instead when people will know.",
          },
          {
            id: "grade",
            text: "You will all get the new technician grade.",
            fail: true,
            why: "Nothing about grades has been agreed. This sentence promises what is not decided, and any change to grades is a matter for HR.",
          },
        ],
        why: "You kept the facts that have been agreed and found the promises nobody has yet made. The month and the training plan are decided, and hours and grades are open questions that belong with HR.",
      },
      bridge:
        "With the people, their capabilities, and an honest message in hand, the next lesson plans the first weeks, with a person and a date against each group.",
    },
    {
      id: "the-first-weeks",
      title: "The first weeks",
      emphasis: "weeks",
      place:
        "This lesson takes the capabilities from the second lesson and turns them into a plan with owners and dates. It is the last part you need before you write the preparation brief.",
      sections: [
        {
          heading: "What a first-weeks plan contains",
          paragraphs: [
            "A plan for the first weeks says, for each group, when they will practise, who will show them, when someone will watch them do each capability, and who they call when something goes wrong. Watching is the step that turns practice into evidence. A packer who has practised clearing a jam with the supplier's engineer has not yet shown that she can do it alone, and the plan should say who will watch her do it and on what date.",
            "The plan also says when the extra support will stop, for example when the supplier's engineer leaves site. People cope much better with support ending when they knew in advance when it would end, and who they would call afterwards. A team that finds out on a Monday that the engineer left on Friday feels abandoned, even if the plan was always for him to leave.",
          ],
        },
        {
          heading: "What it is not",
          paragraphs: [
            "The plan is not a training calendar. A calendar lists sessions, rooms, and times, and it is useful to the person booking the room. It does not tell you whether anyone can do anything. 'Week 1: training for all. Week 2: go live' is a calendar, and a short one, and it cannot be checked against any person on any date.",
            "The plan is a list of capabilities with a person and a date against each one. Each row can be ticked or not ticked by someone who was not in the room when it was written. That is what makes it useful to a colleague who has to run the first weeks if you are away.",
          ],
          beforeAfter: {
            before: "Week 1: training for all. Week 2: go live.",
            after:
              "Packers, days: practise loading the magazine and recovering a stop with the supplier's engineer on 3 November; watched by the team leader on 5 November; call the team leader, then the shift engineer.",
            reading:
              "The first version is a label. The second names a group, a capability, a person who shows them, a person who watches, two dates, and a call route.",
          },
        },
        {
          heading: "The groups that get left out",
          paragraphs: [
            "The most common gap in a first-weeks plan is the indirectly affected groups, and nights and maintenance in particular. The supplier's engineer usually works days. The training sessions are booked for days. The night shift is left to learn from what the day shift passes on at handover, which means they learn a second-hand version of the task, often at the hour when the fewest people are available to help.",
            "The fix is to give every group on your list from the first lesson its own row, with its own practice date and its own watcher. If the supplier cannot attend a night shift, the plan should say who from days will stay late or come in early, and it should give the night team leader a date to watch their own team. A row that says 'to be arranged' is a row with no plan in it.",
          ],
        },
        {
          heading: "Dates, people, and the call route",
          paragraphs: [
            "Every row needs a named role or person, not a team. 'Maintenance will cover it' leaves nobody responsible. 'The maintenance lead, Sam Okoro, will watch each technician change the gripper by 7 November' leaves one person responsible for one thing by one date. Where the name is not yet known, name the role and say when the name will be confirmed.",
            "The call route is the last part of each row. It says who an operator calls when something goes wrong, first during the supported period and then after it ends. Write both. The call route after the supplier leaves is the one people most need and the one plans most often forget, because while the plan is being written the supplier is still on site.",
          ],
        },
      ],
      workedExample: {
        title: "A first-weeks plan for the Harrow Foods palletiser",
        inputLabel: "The first plan",
        outputLabel: "The plan with a person and a date for each group",
        prompt: "Week 1: training for all. Week 2: go live.",
        output:
          "Packers, days: practise loading the pallet magazine and recovering a stop with the supplier's engineer on 3 and 4 November; watched by the team leader on 5 November; call the team leader, then the shift engineer. Packers, nights: same practice with the supplier's engineer on the night of 4 November; watched by the night team leader on 6 November. Maintenance: isolation and gripper change with the supplier on 5 November; watched by the maintenance lead on 7 November. The supplier's engineer leaves site on 21 November, and after that the call goes to the shift engineer.",
        reading: [
          "The first plan was a label. It could not be checked against anyone on any date, and it did not mention nights or maintenance.",
          "The second plan has a row for each group, including nights and maintenance, which are the two groups most often left to learn second-hand. Each row names who shows the group, who watches them, and when.",
          "The last sentence names the date support ends and the call route after it. A packer reading this in October knows exactly who to ring on 24 November.",
        ],
      },
      practice: {
        intro:
          "Marsden Components is introducing a vision inspection system on its bearing line. Before you repair a plan yourself, choose between two plans for the quality inspectors. The section on what a plan is not will help.",
        check: {
          kind: "choose",
          prompt: "Choose the plan a colleague could check against each group on each date.",
          leftLabel: "Plan A",
          left: "Inspectors, days: practise the start-of-shift test with the supplier on 10 June; watched by the quality lead on 12 June. Inspectors, nights: practise with the supplier on the night of 11 June; watched by the night team leader on 13 June. After the supplier leaves on 30 June, call the shift engineer.",
          rightLabel: "Plan B",
          right: "Training sessions will be held for all inspectors in June, and a refresher will be arranged after go-live if needed.",
          correct: "left",
          why: "Plan A gives each group a practice, a person and a date to watch it done, and a call route after the supplier leaves. Plan B is a training calendar that nobody could check against a person.",
          wrong:
            "Look again at Plan B. It lists sessions but no watcher, no date for nights, and no call route after the supplier leaves. Plan A has a person and a date against each group.",
        },
      },
      check: {
        kind: "edit",
        prompt:
          "This first-weeks plan for the Marsden Components vision inspection system is missing parts the lesson named. Edit the plan so that someone watches the day inspectors on a date, the night inspectors have a date and a named person such as the night team leader, and inspectors know who to call after the supplier leaves.",
        label: "The plan you are repairing",
        start:
          "Inspectors, days: practise running the start-of-shift test with the supplier on 10 June. Inspectors, nights: to be arranged. The supplier leaves site at the end of June.",
        unchanged:
          "You have not changed the plan yet. Add who will watch the day inspectors and when, a date and a person for nights, and who inspectors call after the supplier leaves.",
        limitWording: false,
        keep: [
          {
            id: "supplier",
            any: ["supplier"],
            missing: "Keep the supplier in the plan. It should still say who shows the inspectors and when the supplier leaves.",
          },
          {
            id: "practice-date",
            any: ["10 june"],
            missing: "Keep the day inspectors' practice on 10 June. That part of the plan was already doing its job.",
          },
        ],
        limits: [
          {
            id: "watch",
            any: ["watched", "watch", "observed", "observe", "sign off", "signs off", "signed off"],
            missing:
              "Your plan says when day inspectors practise but not who will watch them do it or when. Add a person and a date, for example 'watched by the quality lead on 12 June'.",
          },
          {
            id: "nights",
            any: [
              "night team leader",
              "nights team leader",
              "night shift team leader",
              "night supervisor",
              "nights supervisor",
              "night shift supervisor",
              "night shift leader",
              "night lead",
              "nights lead",
              "night shift lead",
              "night quality lead",
              "night manager",
              "night shift manager",
            ],
            missing:
              "Night inspectors still have no person. Nights are often the group left to learn from days. Give them a date and a named person, such as the night team leader.",
          },
          {
            id: "call",
            any: ["call", "contact", "ring ", "phone", "escalate"],
            missing:
              "Your plan says when the supplier leaves but not who inspectors call afterwards. Name the role, for example 'after that, call the shift engineer'.",
          },
        ],
        why: "Every group now has a practice, a person and a date to watch it done, and someone to call after the supplier's support ends. A colleague could run the first weeks from this plan without asking you what you meant.",
        result: {
          label: "What the repaired plan gives each group",
          text: "Day inspectors know when they practise and who will watch them. Night inspectors have their own date and their own watcher instead of learning at handover. Everyone knows who to call on the first shift after the supplier has gone.",
        },
      },
      bridge:
        "You now have every part the brief needs. The next lesson assesses the whole method on situations you have not yet seen, before you write the brief itself.",
    },
    {
      id: "course-assessment",
      title: "The course assessment",
      emphasis: "assessment",
      place:
        "This is the second-to-last lesson. It brings the five moves of the course together, works one mixed example, and then assesses them on eight situations you have not met before. You need six of the eight to pass.",
      sections: [
        {
          heading: "The method in one place",
          paragraphs: [
            "The course has taught five moves, and each one answers a question a colleague would ask about your change. The first move lists who is affected: directly affected people, whose own daily tasks change at the automation; indirectly affected people, whose work changes because of it although they do not work at it; and people who believe they are affected, whose question deserves a plain answer. You find the second group by walking the flow rather than by writing from memory.",
            "The second move turns each group into capabilities, written as something you can watch. A capability names a task, the standard it is done to, and where that standard is written. Statements about feelings, familiarity, understanding, or attendance are not yet something you can watch, and they should be rewritten as tasks.",
          ],
        },
        {
          heading: "Plain words and honest limits",
          paragraphs: [
            "The third move names what stops. Tasks and routines end with every automation, and people notice them whether or not you say so. A message that names what stops, with a date, lets people plan. A message that talks round it, with words about transformation and valuable activities, is heard as avoiding the question. Where roles might stop or shrink, that belongs with HR and consultation, not in a team briefing.",
            "The fourth move separates what is decided from what is not. You say what has been agreed by the people with authority to agree it, you say plainly what is still open, and you say when people will know and who will tell them. You do not promise hours, grades, staffing, or dates that nobody has agreed, however kind the promise would feel at the time.",
          ],
        },
        {
          heading: "The first weeks, and how the assessment works",
          paragraphs: [
            "The fifth move plans the first weeks as capabilities with a person and a date against each one, including nights and maintenance, with a call route during the supported period and another after the supplier leaves. A training calendar is not a plan, because nobody can check it against a person.",
            "The assessment gives you eight short situations from different workplaces. Each has three or four options, and each option is something a reasonable manager might do. Exactly one is right for a reason this course taught. After you submit, every question shows the feedback for the option you chose, so you can see why it holds or what it would have caused. If you score fewer than six, read the feedback, go back to the lesson it points to, and try again.",
          ],
        },
      ],
      workedExample: {
        title: "One change read through all five moves",
        inputLabel: "The supervisor's notes",
        outputLabel: "The same notes after applying the method",
        prompt:
          "Tillman Laundry, Swindon. Automated sorting conveyor from April. Affected: sorters. Sorters will be trained and comfortable with the conveyor. It will make everyone's life easier. Nobody will lose hours. Training in March.",
        output:
          "Directly affected: sorters, who will load bags onto the conveyor instead of sorting by hand. Indirectly affected: the maintenance technician; the van drivers, whose loading bay changes; the evening shift, who start the conveyor. Capabilities: sorters can load a bag and clear a blocked chute after stopping the conveyor, following the shift card. What stops: sorting by hand at the long tables stops in April. Decided: go-live in April, training before go-live. Not decided: hours, which HR will discuss with the team by 20 February. First weeks: sorters practise with the supplier on 16 March and are watched by the supervisor on 18 March; after the supplier leaves on 10 April, call the maintenance technician.",
        reading: [
          "The notes named one group. Walking the flow found three more, and the evening shift was added because they will start the conveyor without the supplier present.",
          "'Trained and comfortable' became a task a supervisor can watch. 'Make everyone's life easier' talked round the change, so it became a plain sentence about what stops.",
          "'Nobody will lose hours' promised what is not decided, so it became a statement of who will discuss hours and by when. 'Training in March' became a row with a practice date, a watcher, and a call route after the supplier leaves.",
        ],
      },
      practice: {
        intro:
          "Here is one warm-up question in the same form as the assessment. The worked example above is still on the page.",
        check: {
          kind: "choose",
          prompt:
            "The Tillman Laundry supervisor has to add one line to her notes for the van drivers, whose loading bay moves. Choose the line that belongs in the brief.",
          leftLabel: "Line A",
          left: "Van drivers will be made aware of the new bay.",
          rightLabel: "Line B",
          right: "Van drivers can reverse onto the new bay 4 and load without entering the marked conveyor zone, watched by the yard supervisor on 9 April.",
          correct: "right",
          why: "Line B is a capability you can watch, with a watcher and a date, for an indirectly affected group. Line A describes being made aware, which nobody can watch.",
          wrong:
            "Look again at Line A. Being made aware is not something you can watch, and it has no person or date. Line B names the task, the standard, the watcher, and the date.",
        },
      },
      check: {
        kind: "scenario",
        prompt:
          "Read each situation and choose what you would do. Every option is something a reasonable manager might do, and exactly one is right for a reason this course taught.",
        passMark: 6,
        questions: [
          {
            id: "bakery-list",
            situation:
              "Wexford Bakery in Bristol is installing an automated tray washer in the dispatch area. The dispatch manager, Rhian Evans, has listed the dispatch operatives who currently wash trays by hand. The washer will run through the night, and the night hygiene team will empty its filters and restart it at 5am.",
            question: "What should Rhian do with her list?",
            options: [
              {
                id: "a",
                text: "Keep the list as it is, because the dispatch operatives are the people who wash trays.",
                feedback:
                  "The operatives are directly affected, but the list stops at the machine. The night hygiene team will empty filters and restart the washer, and a list that leaves them out produces a team that finds out on the night. Walk the flow and add them.",
              },
              {
                id: "b",
                text: "Add the night hygiene team as indirectly affected, and walk the flow to find any other group whose work changes.",
                correct: true,
                feedback:
                  "Right. The hygiene team do not wash trays, but their work changes because of the washer, which makes them indirectly affected. Walking the flow is how you find the others, such as maintenance.",
              },
              {
                id: "c",
                text: "Add every person in the building, so that nobody is missed.",
                feedback:
                  "A list of everyone cannot be planned against, because it does not say whose work changes and how. It also hides the people who need the most preparation. List the groups whose work changes, found by walking the flow.",
              },
            ],
          },
          {
            id: "label-printer",
            situation:
              "Corrigan Pharma Supplies is adding an automatic label printer to its packing line in Leicester. The two dispatch clerks, whose work does not change, asked in Monday's briefing whether the printer means their jobs are going. The project lead has confirmed that their tasks are untouched.",
            question: "How should the clerks appear in the preparation brief?",
            options: [
              {
                id: "a",
                text: "Leave them off, because their tasks do not change.",
                feedback:
                  "Their tasks do not change, but they have asked a question, and a group left without an answer fills the silence with rumour. Record them as people who believe they are affected, with what they will be told.",
              },
              {
                id: "b",
                text: "List them as directly affected, so that they are included in the training.",
                feedback:
                  "Directly affected means their own daily tasks change at the automation, and theirs do not. Listing them that way would plan training they do not need and confirm the worry you want to answer.",
              },
              {
                id: "c",
                text: "Record them as people who believe they are affected, and note that they will be told this week that their tasks do not change.",
                correct: true,
                feedback:
                  "Right. Their belief is real and needs an answer. Because the project lead has confirmed their tasks are untouched, you can tell them so plainly, and the brief records when.",
              },
              {
                id: "d",
                text: "Tell them that nothing about their jobs will ever change.",
                feedback:
                  "The project has confirmed their tasks do not change with this printer. It has not decided that nothing will ever change, so 'ever' is a promise of what is not decided. Tell them what is confirmed and no more.",
              },
            ],
          },
          {
            id: "planner-capability",
            situation:
              "Ashby Print's new box folder needs a planned maintenance window every Thursday afternoon. The production planner, Joel Mensah, builds the weekly finishing plan. The first draft of his capability reads: 'Joel will understand the folder's maintenance needs.'",
            question: "Which rewrite belongs in the brief?",
            options: [
              {
                id: "a",
                text: "Joel can build the weekly finishing plan with the folder out of use from 1pm to 4pm on Thursdays, as set out in the maintenance schedule.",
                correct: true,
                feedback:
                  "Right. This names the task, the standard, and where the standard is written, so the finishing manager could check next week's plan and see whether it was done.",
              },
              {
                id: "b",
                text: "Joel will be fully briefed on the folder's maintenance needs.",
                feedback:
                  "Being briefed is an event, not a task. It shows that Joel was told, and it does not show that the plan leaves the folder free on Thursdays. Write the task he carries out.",
              },
              {
                id: "c",
                text: "Joel will be comfortable planning around the folder.",
                feedback:
                  "Comfortable is a feeling, and nobody can watch it. The need behind it is real, so rewrite it as the task: building the plan with the Thursday window kept free.",
              },
            ],
          },
          {
            id: "attendance",
            situation:
              "The supplier of Brennan Fabrications' welding cell issues a certificate of attendance to each welder who completes its one-day course. The operations manager, Helen Price, wants the first-weeks plan to record each welder as 'trained' when they receive the certificate.",
            question: "What should the plan record instead?",
            options: [
              {
                id: "a",
                text: "Record the certificate, and add a refresher course three months later.",
                feedback:
                  "A second course is a second attendance. Neither shows that a welder can load and recover the cell. Record the task and the person who watched it done.",
              },
              {
                id: "b",
                text: "Record the certificate, because the supplier knows the cell best.",
                feedback:
                  "The supplier does know the cell, but a certificate of attendance shows that the welder was in the room. It does not show what they can do on a shift. Record who watched them do the task, and when.",
              },
              {
                id: "c",
                text: "Record, for each welder, the date the cell supervisor watched them load and recover the cell to the shift card.",
                correct: true,
                feedback:
                  "Right. A capability is something you can watch, and the plan records the watching. The certificate can sit alongside it, but it is not the evidence.",
              },
            ],
          },
          {
            id: "higher-value",
            situation:
              "Kestrel Distribution's Daventry site is bringing in mobile robots in May. The draft message to pickers says: 'The robots will free you up to focus on higher-value work.' From May, pickers will no longer walk totes to the packing benches.",
            question: "What should the message say?",
            options: [
              {
                id: "a",
                text: "Keep the sentence, because it is positive and true.",
                feedback:
                  "It may be true, but it only describes a gain, so it talks round the change. Pickers will notice on the first morning that the walk to packing has gone. Say so plainly, with the month.",
              },
              {
                id: "b",
                text: "Say that from May pickers will no longer walk totes to the packing benches, and will place them on robots at the end of each aisle.",
                correct: true,
                feedback:
                  "Right. This names what stops, when, and what replaces it, which is information pickers can plan around.",
              },
              {
                id: "c",
                text: "Leave out any mention of what stops until after go-live, to avoid unsettling people.",
                feedback:
                  "People notice what stops whether you say it or not, and silence is filled with rumour. Naming it before go-live, with a month, is what prevents the unsettling.",
              },
            ],
          },
          {
            id: "roles",
            situation:
              "At Harrow Foods, the finance director has told the production manager that line 3 may need two fewer packers once the palletiser is running. Nothing has been agreed, and HR has not yet been involved. The production manager is drafting the team briefing for Thursday.",
            question: "What should the production manager do about the briefing?",
            options: [
              {
                id: "a",
                text: "Tell the team on Thursday that two roles may go, so that nobody is surprised later.",
                feedback:
                  "This announces a possible change to roles that has not been decided and may need consultation. It is a promise of what is not decided, in the other direction. Involve HR before saying anything about roles.",
              },
              {
                id: "b",
                text: "Tell the team that nobody's job will change, to keep morale steady before go-live.",
                feedback:
                  "Staffing has not been decided, so this promises what is not decided. If it turns out to be wrong, the team will remember who said it. Involve HR, and say only what is agreed.",
              },
              {
                id: "c",
                text: "Hint that some people may want to think about their future, without giving details.",
                feedback:
                  "A hint frightens people and gives them nothing they can check. It is the worst of both. Roles are a matter for HR and consultation, so talk to HR before the briefing and name only the tasks that stop.",
              },
              {
                id: "d",
                text: "Talk to HR before Thursday, keep the briefing to the tasks that stop and what is decided, and say that staffing is not decided and when the team will hear more.",
                correct: true,
                feedback:
                  "Right. Where jobs could be affected, HR comes first, because there may be duties to inform and consult. The briefing names what stops, says what is decided, and is honest that staffing is open.",
              },
            ],
          },
          {
            id: "overtime",
            situation:
              "In a start-of-shift huddle at Marsden Components, an inspector asks whether the Saturday overtime will continue once the vision system is running. Overtime has not been decided. HR's Priya Nair has agreed to meet the team about it by 30 January.",
            question: "What should the team leader say?",
            options: [
              {
                id: "a",
                text: "'That has not been decided yet. Priya Nair from HR will meet the team about overtime by 30 January.'",
                correct: true,
                feedback:
                  "Right. This says plainly that it is not decided, names who will talk about it, and says when, which is a promise the team leader can keep.",
              },
              {
                id: "b",
                text: "'I can't see why it would stop, so I would plan on it carrying on.'",
                feedback:
                  "This sounds like a guess, but the team will hear it as a promise. Overtime is not decided. Say that, and say when they will know.",
              },
              {
                id: "c",
                text: "'I'm not able to talk about that.'",
                feedback:
                  "Refusing to answer leaves the question open with no date, and people fill the gap with rumour. You can say it is not decided and say when they will know without promising anything.",
              },
            ],
          },
          {
            id: "nights-plan",
            situation:
              "Tillman Laundry's first-weeks plan gives day sorters practice with the supplier on 16 March and a watch by the supervisor on 18 March. The evening shift is listed as 'will pick it up from days at handover'. The supplier's engineer leaves site on 10 April.",
            question: "What is the most important change to the plan?",
            options: [
              {
                id: "a",
                text: "Add a second day-shift practice session, so that the day sorters can teach the evening shift better.",
                feedback:
                  "More day practice still leaves the evening shift learning second-hand at handover, with no watcher. Give the evening shift its own row with a practice date and a named person.",
              },
              {
                id: "b",
                text: "Give the evening shift its own practice date with the supplier and a date on which the evening supervisor watches each sorter, and name who they call after 10 April.",
                correct: true,
                feedback:
                  "Right. Evening and night shifts are the groups most often left to learn from days. Their own row, with a person, a date, and a call route after the supplier leaves, closes the gap.",
              },
              {
                id: "c",
                text: "Move the supplier's departure to 30 April, so that there is more support overall.",
                feedback:
                  "Longer support may help, but the evening shift still has no practice, no watcher, and no call route. Extending the date does not put a person and a date against the group that was left out.",
              },
            ],
          },
        ],
        why: "You applied the five moves to new situations: walking the flow, writing capabilities you can watch, naming what stops, keeping to what is decided, and giving every group a person and a date.",
      },
      bridge:
        "You have shown that you can use the method on other people's changes. The last lesson asks you to use it on your own, in the preparation brief that appears on your record.",
    },
    {
      id: "the-preparation-brief",
      title: "The preparation brief",
      emphasis: "brief",
      place:
        "This is the final lesson and the fourth module. You will write the preparation brief for a real change your team is facing, and that brief is the work your record will show.",
      sections: [
        {
          heading: "What the brief is for",
          paragraphs: [
            "The preparation brief is the document a colleague could pick up and use to prepare the team if you were away. If you were off sick in the week before go-live, the shift manager should be able to open your brief and know who to talk to, what each group must be able to do, what to say about what stops, what not to promise, and who is watching whom on which date.",
            "It is not a communications plan full of slogans, and it is not an HR document about roles or terms. It is the practical preparation of people for a change in their daily work. Where a question about jobs, hours, pay, or grades arises, the brief records that it is not decided and who will deal with it, and it leaves the substance to HR and to any consultation that is needed.",
          ],
        },
        {
          heading: "The five parts",
          paragraphs: [
            "The brief has five parts, one for each lesson. Who is affected lists directly affected groups, indirectly affected groups, and people who believe they are affected. What they must be able to do gives each group capabilities you could watch. What stops names the tasks and routines that end, in plain words and with a date where you have one.",
            "What is decided, what is not, and when people will know separates the agreed facts from the open questions, and gives a time and an owner for each open question. The first weeks puts a person and a date against each group's practice and each watch, and names the call route before and after the supplier's support ends.",
          ],
        },
        {
          heading: "Choose a real change, and keep it shareable",
          paragraphs: [
            "Write the brief for a change your team is actually facing, even if it is small, such as a new label printer, a conveyor, or a cobot on one cell. You know the people, the dates, and the open questions, and you will find out in the first weeks whether the brief works.",
            "The brief will appear on a record that a second person can open. Do not include anything confidential, and do not name individuals in connection with any open question about their job. Use roles rather than names where that is more appropriate, and replace sensitive figures with realistic ones that keep the same shape.",
          ],
        },
        {
          heading: "How the brief is checked",
          paragraphs: [
            "When you continue, each part is checked in turn. Who is affected must include at least one indirectly affected group, written with that phrase. What they must be able to do must be written as capabilities, using can or able to. What stops must name something that stops, ends, or will no longer happen.",
            "What is decided, what is not, and when people will know must include something not decided, written with words such as not decided or not agreed, and a concrete time or name for when people will hear. The first weeks must name a role, such as a team leader, supervisor, engineer, or lead, and a concrete date or name. If a part is missing, the note will say which one and what to add. When every part is present, you can sign your name against the brief.",
          ],
        },
      ],
      workedExample: {
        title: "The Kestrel Distribution brief, in summary",
        inputLabel: "The change",
        outputLabel: "The preparation brief",
        prompt:
          "Kestrel Distribution, Northampton site. Autonomous mobile robots will carry totes from picking to packing from March. The supplier's engineer is on site until 28 March.",
        output:
          "Who is affected: pickers and packers directly; engineering, shift planners, the cleaning contractor, and nights indirectly; forklift drivers believe they are affected and will be told their work does not change. What they must be able to do: pickers can place a tote and send the robot; pickers can tell waiting from stopped; packers can receive and release a robot; engineers can take a robot out of service and change a battery following the manual. What stops: pushing trolleys to packing, and the walk that goes with it. Decided: go-live in March, training before go-live. Not decided: shift patterns, which HR will discuss with the team by the end of January. The first weeks: practice dates, watchers, and the call route for each group, with the supplier leaving on 28 March and the shift engineer taking calls after that.",
        reading: [
          "Every part does one job, and each could be checked by someone who was not there when it was written. The forklift drivers appear under their own heading, with what they will be told.",
          "The capabilities are all things Callum Brooks could watch on the first morning. The decided line and the not decided line are kept apart, and the open question has an owner and a time.",
          "A colleague could run the first weeks from this brief. It makes no promise that has not been agreed, which is the test your own brief has to meet.",
        ],
      },
      practice: {
        intro:
          "Before you write your own brief, read these four lines from a brief for a new cobot at Priory Engineering and mark each one. A line is Ready to use when a colleague could act on it as it stands. It is A colleague would have to ask when they would need to come back to you before they could act.",
        check: {
          kind: "mark",
          prompt: "Mark each line of the Priory Engineering brief as Ready to use or A colleague would have to ask.",
          passLabel: READY,
          failLabel: ASK,
          sentences: [
            {
              id: "affected",
              text: "Who is affected: the operators on cell 2.",
              fail: true,
              why: "This line names only the directly affected group. A colleague would have to ask about maintenance, planners, and the other shift.",
            },
            {
              id: "capability",
              text: "What they must be able to do: cell 2 operators can teach the cobot a new pick position from the pendant, following the work instruction WI-214.",
              fail: false,
              why: "This names a task, the standard, and where it is written, so a colleague could watch it and sign it off.",
            },
            {
              id: "decided",
              text: "What is decided, what is not: everything will be fine.",
              fail: true,
              why: "This line says nothing that is decided and promises an outcome nobody has agreed. A colleague would have to ask what is actually agreed.",
            },
            {
              id: "weeks",
              text: "The first weeks: operators practise with the integrator on 12 May and are watched by the cell 2 team leader on 14 May; after the integrator leaves on 23 May, call the maintenance lead.",
              fail: false,
              why: "This line gives a practice, a watcher, two dates, and a call route, so a colleague could run it as it stands.",
            },
          ],
          why: "That is right. The capability and the first-weeks lines are ready to use, but the affected line stops at the machine and the decided line promises what is not decided.",
        },
      },
      check: {
        kind: "build",
        prompt:
          "Write the preparation brief for a real change your team is facing. Fill in all five parts so that a colleague could prepare the team from it without asking you what you meant.",
        fields: [
          {
            id: "affected",
            label: "Who is affected",
            hint: "Directly affected groups, indirectly affected groups, and anyone who believes they are affected.",
            min: 40,
            rule: "role",
            any: ["indirectly"],
            missing:
              "Your affected field has no indirectly affected group. Add at least one, written as indirectly affected, such as maintenance, nights, or planners.",
          },
          {
            id: "capabilities",
            label: "What they must be able to do",
            hint: "For each group, a task you could watch, the standard it is done to, and where that is written.",
            min: 40,
            any: ["can ", "able to"],
            missing:
              "Your capability statements do not yet describe tasks. Write each as what a group can do, for example 'packers can clear a jam following the shift card', rather than attendance or a feeling.",
          },
          {
            id: "stops",
            label: "What stops",
            hint: "The tasks and routines that end, in plain words, with a date if you have one.",
            min: 20,
            any: ["stop", "no longer", "will end", "ends", "ending", "finish"],
            missing:
              "Your what stops field describes only what is added. Name at least one task or routine that stops or will no longer happen.",
          },
          {
            id: "decided",
            label: "What is decided, what is not, and when people will know",
            hint: "What has been agreed, what has not been decided, and a date and an owner for each open question.",
            min: 40,
            rule: "fact",
            any: ["not decided", "not yet decided", "not been decided", "undecided", "not agreed", "not yet agreed", "not been agreed"],
            missing:
              "Your decided field has no not decided line, or no time for it. Say what is not yet decided and when people will know, with a date or a name.",
          },
          {
            id: "firstWeeks",
            label: "The first weeks",
            hint: "For each group, when they practise, who watches them and when, and who they call before and after the supplier leaves.",
            min: 40,
            rule: "fact",
            any: [
              "team leader",
              "lead",
              "supervisor",
              "engineer",
              "manager",
              "trainer",
              "supplier",
              "integrator",
              "technician",
              "coordinator",
              "planner",
            ],
            missing:
              "Your first weeks field has a group without a person and a date. Name the role who will watch each group, such as the team leader or the shift engineer, and give a date.",
          },
        ],
        why: "Your brief lists everyone affected, gives capabilities you could watch, says plainly what stops, separates what is decided from what is not, and puts a person and a date against each group. A colleague could run the change from it.",
      },
      bridge:
        "Your brief is ready. Sign your name below, and the record will show this brief, the course, and the date to anyone who opens the reference.",
    },
  ],
};
