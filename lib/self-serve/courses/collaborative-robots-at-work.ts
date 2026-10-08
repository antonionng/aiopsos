/*
Course: Collaborative Robots at Work
Slug: collaborative-robots-at-work
For: Operators, team leaders, and technicians who work alongside a collaborative robot, or are about to. They have completed their site induction and have been shown their own robot by someone their employer has authorised. The course does not replace the manufacturer's training or the site procedure, and it does not authorise anyone to operate a robot.
Outcome: The learner can say what their cobot application is for and what makes it safe to work near, carry out a start, a stop, and a recovery in the right order and give the reason for each step, recognise when to stop recovering and call a person, and write a shift handover note the next shift can act on without finding them.
Artefact: The shift handover note, in four parts: the state of the robot at handover, the stops this shift and their causes, what was recovered and what was called in, and what the next shift must watch.
Record sentence: Wrote and signed a shift handover note for a collaborative robot that gives the next shift the robot's state, each stop and its cause, what was recovered or called in, and what to watch.
Lessons (id, title, move, interaction, pass rule):
  1. what-it-is-for, What a cobot is for, separate the arm from the whole task, mark (About the arm / About the whole task), every sentence marked correctly.
  2. start-drill, Drill one, the start, the five-step start in order, practice choose and check order on a new cell, the stronger start chosen and the exact order given.
  3. stop-drill, Drill two, the stop, match the stop to the situation, mark (Emergency stop / Pause at the pendant), every situation marked correctly.
  4. recover-drill, Drill three, the recovery, find the cause before the reset, practice edit of a recovery log and check order on a new stop, the log names the cause, the clearing, the path check, and the watched cycle; the order is exact.
  5. when-to-call-a-person, When to call a person, draw the line around what you recover, practice choose and check mark (Recover it myself / Call a person), the stronger decision chosen and every problem marked correctly.
  6. course-assessment, The shift assessment, apply every move to new situations, practice choose and check scenario of eight questions, passMark 6.
  7. the-handover, The handover, write the handover note, practice edit of a thin note and check build, every field meets its rule or word list.
Sources: ISO/TS 15066; ISO 10218-1 and ISO 10218-2; ISO 13850; IEC 60204-1; UK Health and Safety Executive guidance on the Provision and Use of Work Equipment Regulations 1998 and its human factors guidance on shift handover; the user and safety manual for the learner's own robot.
Tested on phone:          no
Tested returning learner: no
Pass rule tests written:  yes
*/
import type { CourseContent } from "./types.ts";

const ARM = "About the arm";
const TASK = "About the whole task";
const PAUSE = "Pause at the pendant";
const ESTOP = "Emergency stop";
const RECOVER = "Recover it myself";
const CALL = "Call a person";

export const COURSE: CourseContent = {
  slug: "collaborative-robots-at-work",
  hours: 2,
  artefact: {
    lessonId: "the-handover",
    title: "The shift handover note",
    recordLine:
      "Wrote and signed a shift handover note for a collaborative robot that gives the next shift the robot's state, each stop and its cause, what was recovered or called in, and what to watch.",
  },
  lessons: [
    {
      id: "what-it-is-for",
      title: "What a cobot is for",
      emphasis: "cobot",
      place:
        "This is the first of seven lessons and the first module, What it is for. Before any drill is taught, it sets out what the word collaborative means when it is applied to a robot you work beside.",
      sections: [
        {
          heading: "Before you start this course",
          paragraphs: [
            "This course is for people who work alongside a collaborative robot, usually called a cobot, or who are about to. It assumes you have completed your site induction and that someone your employer has authorised has shown you your own robot. It teaches the shape of a good start, a good stop, a good recovery, and a good handover.",
            "It does not replace the manufacturer's training or your site's written procedure, and it does not authorise you to operate any robot. Where your site procedure differs from what this course describes, follow the site procedure, and mention the difference to your supervisor so that one of the two can be corrected.",
          ],
        },
        {
          heading: "What a collaborative robot is",
          paragraphs: [
            "A collaborative robot is an arm designed so that it can work in a space shared with people under certain conditions. It usually limits its own speed and the force it can apply, and it stops when it meets resistance it did not expect. Those features are why a cobot can often work without the full cage that surrounds a traditional industrial robot.",
            "The international technical specification ISO/TS 15066 describes the kinds of collaborative operation, and the robot safety standards ISO 10218-1 and ISO 10218-2 set the wider requirements for robots and robot systems. You do not need to read them to do your job, but it helps to know that they exist and that the engineer or integrator who set up your cell will have worked to them.",
          ],
        },
        {
          heading: "Collaborative describes the whole task",
          paragraphs: [
            "The idea that matters most is that collaborative describes the whole application, and not only the arm. An arm that is gentle on its own can still be dangerous when it carries a knife, a hot part, a sharp sheet, or a heavy load, or when it moves close to someone's face or hands. The tool, the part, the speed, the layout, and the people nearby all change what the arm can do to a person.",
            "So a cobot is not safe because it is called a cobot. It is made safe for a particular task by the way the whole task has been designed, assessed, and set up. The UK Health and Safety Executive's guidance on the Provision and Use of Work Equipment Regulations 1998 makes the same point in general terms: the equipment and the way it is used are judged together.",
          ],
        },
        {
          heading: "Two labels for what you are told",
          paragraphs: [
            "In this lesson you will sort statements about a cobot with two labels. A statement is About the arm when it describes the robot on its own: its payload, its reach, its force limiting, or the fact that it stops when it meets resistance. A statement is About the whole task when it describes the robot together with its tool, its part, its speed in this layout, its guarding, or the people who work near it.",
            "The common mistake is to hear only the statements about the arm and to feel safe. People remember that the robot has force limiting built in, and they forget that the risk assessment says nobody leans over the fixture while it drives screws. When something goes wrong at a cobot cell, it is usually a statement about the whole task that was missed.",
          ],
          beforeAfter: {
            before: "It is a cobot, so you can work right next to it.",
            after:
              "It is a cobot, and in this cell it runs at a reduced speed when you are in the loading area. It carries a blade, so you keep your hands out of the cutting zone until it has parked.",
            reading:
              "The first version is about the arm and makes a promise the arm cannot keep on its own. The second tells the operator what the whole task does to protect them and what they must do in return.",
          },
        },
      ],
      workedExample: {
        title: "A team leader briefs her shift",
        inputLabel: "What the team leader said",
        outputLabel: "How each sentence was marked",
        prompt:
          "Sana Iqbal, team leader at Ashgrove Engineering in Coventry, briefs the late shift on a new screwdriving cobot: \"This robot has force limiting built in. It is set to a slower speed when you are in the loading area. It carries a screwdriver bit that could hurt an eye. The risk assessment says nobody leans over the fixture while it is driving screws.\"",
        output:
          "\"This robot has force limiting built in\" is About the arm. \"It is set to a slower speed when you are in the loading area\" is About the whole task. \"It carries a screwdriver bit that could hurt an eye\" is About the whole task. \"The risk assessment says nobody leans over the fixture while it is driving screws\" is About the whole task.",
        reading: [
          "Only the first sentence is about the arm on its own, and it is the one the shift is most likely to remember afterwards, because it sounds like the reason the robot is safe.",
          "The other three sentences are what actually protect the operator. The slower speed was set for this loading area, the eye hazard comes from the bit the arm carries, and the rule about leaning over the fixture was written for this job. None of them would be true of the same arm on a different task.",
          "Sana's briefing is a good one because three of her four sentences are about the whole task. A briefing that only described the arm would leave the shift with a feeling of safety and no instructions.",
        ],
      },
      practice: {
        intro:
          "Here are three sentences a technician wrote about a cobot that tends a press brake. Mark each one with the two labels you have just learned. The definitions are in the section above if you want to read them again.",
        check: {
          kind: "mark",
          prompt: "Mark each sentence as About the arm or About the whole task.",
          passLabel: ARM,
          failLabel: TASK,
          sentences: [
            {
              id: "reach",
              text: "The arm has a reach of 1,300 millimetres.",
              fail: false,
              why: "Reach is a figure from the arm's specification, with nothing about this job, so it is about the arm.",
            },
            {
              id: "sheet",
              text: "The steel blanks it lifts have sharp edges, so operators wear cut-resistant gloves at the infeed.",
              fail: true,
              why: "The hazard comes from the part, and the gloves were chosen for this task, so it is about the whole task.",
            },
            {
              id: "zone",
              text: "A light curtain stops the arm if anyone steps between it and the press brake.",
              fail: true,
              why: "The light curtain was fitted for this layout and this machine, so it is about the whole task.",
            },
          ],
          why: "That is right. The reach belongs to the arm, and the sharp blanks and the light curtain belong to the task the arm has been given.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "A new starter at Halden Packaging has been told these things about a cobot that packs glass jars into cases. Mark each sentence with About the arm or About the whole task.",
        passLabel: ARM,
        failLabel: TASK,
        sentences: [
          {
            id: "resistance",
            text: "The robot stops if it meets unexpected resistance.",
            fail: false,
            why: "This sentence describes the robot's own behaviour, with no mention of the tool, the part, or the people, so it is about the arm.",
          },
          {
            id: "glass",
            text: "A broken jar in the gripper could cut someone, so the case area is behind a clear screen.",
            fail: true,
            why: "The danger here is the broken glass, and the screen was added for this job, so it is about the whole task.",
          },
          {
            id: "scanner",
            text: "The robot runs more slowly when the scanner sees a person near the case erector.",
            fail: true,
            why: "The scanner, the zone, and the slower speed were configured for this layout and this task, so it is about the whole task.",
          },
          {
            id: "payload",
            text: "The robot can lift up to its rated payload.",
            fail: false,
            why: "The rated payload is a figure from the arm's specification, with nothing about this job, so it is about the arm.",
          },
        ],
        why: "You separated what the arm does by itself from what makes this particular task safe to work near. The screen and the scanner are the sentences that protect the new starter, and they only exist because of the glass jars and the case erector.",
      },
      bridge:
        "Knowing what the application is for, you are ready for the first of three drills, which is starting the robot properly at the beginning of a shift.",
    },
    {
      id: "start-drill",
      title: "Drill one, the start",
      emphasis: "start",
      place:
        "This is the first of the three drills in the second module. It covers the few minutes between arriving at the robot and letting it run on its own.",
      sections: [
        {
          heading: "What a start is for",
          paragraphs: [
            "A start is the short routine between arriving at the robot and letting it run without you standing beside it. Its purpose is to make sure that the robot, the space, and the job are what you think they are before anything moves. It usually takes a few minutes, and on most days it finds nothing wrong.",
            "A start is not the same as switching on. Power can be on for hours while nobody has checked the space or the tool. A start is also not a place to change settings. If a speed, a zone, or a program looks wrong to you, that is a reason to stop and ask, and not a reason to adjust it and carry on.",
          ],
        },
        {
          heading: "The five steps, in order",
          paragraphs: [
            "A good start has five steps. First, read the last handover. Second, look at the space and clear anything that should not be there. Third, check that the tool and the part are the right ones and fitted properly. Fourth, confirm on the pendant or screen that the correct program is selected. Fifth, start the robot and watch the first full cycle before stepping away.",
            "The pendant is the handheld screen and control unit attached to the robot's controller. On some cells the same controls are on a fixed screen. In this course the word pendant covers both.",
          ],
        },
        {
          heading: "Why the order matters",
          paragraphs: [
            "Each step protects the next one. The handover comes first because it may tell you that a gripper was changed, that a part number moved, or that a stop kept repeating, and that changes what you look for in every later step. Clearing the space comes before checking the tool because you may need to reach in, and you want nothing left in the arm's path when it moves. Confirming the program comes after the tool check because the right program with the wrong gripper is still the wrong job.",
            "Watching the first cycle is not optional politeness. It is where you find out whether the robot is doing what the program says on the parts, the tool, and the space you have this morning. A part that seats slightly off on the first cycle is easy to catch while you are standing there, and much harder to catch an hour later when a pallet of them has gone to the next process.",
          ],
          beforeAfter: {
            before: "Switched it on and pressed start, then read the handover while it ran.",
            after:
              "Read the handover, cleared the space, checked the gripper and the part, confirmed the program, then started it and watched the first cycle.",
            reading:
              "In the first version any warning in the handover arrives after the robot is already moving. In the second, each step is done before the step that depends on it.",
          },
        },
        {
          heading: "The usual mistake",
          paragraphs: [
            "The usual mistake is to start first and check afterwards, because the robot was fine yesterday and the line is waiting. Nothing dramatic happens most of the time, which is exactly why the order is easy to lose. The day it matters is the day the night shift changed the fingers or left a tray in the reach of the arm.",
            "If your site procedure adds steps, such as a guard check or a signature on a sheet, add them where the procedure says. The five steps in this lesson are the shape; your procedure is the detail.",
          ],
        },
      ],
      workedExample: {
        title: "The same operator on two mornings",
        inputLabel: "Monday's start, as he described it",
        outputLabel: "Tuesday's start, as he described it",
        prompt:
          "Callum Reeves, machine-tending cobot, Brookmoor Components, Sheffield: \"I switched it on, pressed start, and while it was running I read the handover. The handover said the gripper fingers had been changed at 04:00 and needed watching.\"",
        output:
          "\"I read the handover first. It said the gripper fingers had been changed. I cleared a box someone had left in the reach of the arm, checked the new fingers were tight, confirmed the program for part 2210 was selected, started the robot, and watched the first cycle. The part seated correctly, so I moved on to the next machine.\"",
        reading: [
          "On Monday the warning about the new fingers arrived after the robot was already running on them. If the fingers had been loose, the first sign would have been a dropped part rather than a check.",
          "On Tuesday every step came before the step that needed it. The handover told him what to look at, the box was out of the way before anything moved, and the program was confirmed only once he knew the tool was right.",
          "Nothing went wrong on Monday, and that is the point of the example. A start done in the wrong order usually gets away with it, so the order has to be a habit rather than a reaction.",
        ],
      },
      practice: {
        intro:
          "Two operators at Calder Labels wrote up their start on the same cobot. Choose the one that follows the five steps in the order the lesson gave. The steps are still above if you want to compare.",
        check: {
          kind: "choose",
          prompt: "Choose the start that makes sure the robot, the space, and the job are right before anything moves.",
          leftLabel: "Start A",
          left: "Read the handover note from the night shift, moved a spare label roll off the table in the arm's reach, checked the applicator head was the 100 millimetre one, confirmed program LBL-100 on the pendant, then started it and watched the first box.",
          rightLabel: "Start B",
          right: "Confirmed program LBL-100 on the pendant and started it so the line was not held up, then read the handover, moved a spare label roll off the table, and checked the applicator head while it ran.",
          correct: "left",
          why: "Start A follows the five steps in order. The handover came first, the space and the tool were right before the program was confirmed, and the first box was watched before the operator stepped away.",
          wrong:
            "Look again at Start B. The robot was moving before the handover was read and while a label roll was still in its reach, and the applicator head was checked with the arm already running. Start A does each step before the one that depends on it.",
        },
      },
      check: {
        kind: "order",
        prompt:
          "You are starting a palletising cobot at Wrenfield Foods at 06:00. Put these steps in the order this lesson taught, with the first step at the top.",
        steps: [
          { id: "program", label: "Confirm on the pendant that the program for 12-case layers is selected." },
          { id: "watch", label: "Start the robot and watch it build the first full layer." },
          { id: "handover", label: "Read the night shift's handover note on the cell clipboard." },
          { id: "tool", label: "Check the vacuum gripper is the case gripper and its cups are seated." },
          { id: "space", label: "Walk round the pallet station and move the stray pallet wrap out of the arm's reach." },
        ],
        correct: ["handover", "space", "tool", "program", "watch"],
        why: "Your start makes sure the robot, the space, and the job are what you think they are before anything moves. You read the handover before anything else, made the space and the gripper right before choosing the program, and watched the first layer before walking away.",
        wrong:
          "Not that order yet. The handover has to come first, because it can warn you about anything that follows. The space and the gripper come before the program, and the robot starts only once the program is confirmed. Look again at which step protects the next one.",
      },
      bridge:
        "Once a robot is running you need to know how to stop it, and the next drill teaches which stop to use in which situation.",
    },
    {
      id: "stop-drill",
      title: "Drill two, the stop",
      emphasis: "stop",
      place:
        "This is the second of the three drills. It separates two kinds of stop that people often treat as the same, and it introduces a third kind that you will meet in the recovery drill.",
      sections: [
        {
          heading: "The emergency stop",
          paragraphs: [
            "The Emergency stop is the red mushroom-headed button on the pendant, and often on the cell as well. It is for danger to a person or serious damage to equipment. It is designed to stop the robot quickly and to hold it stopped until someone deliberately resets it. How it behaves is set by the machine's design, and machinery standards such as ISO 13850 and IEC 60204-1 describe how emergency stop functions are meant to work.",
            "Because it is built for danger, it does not rely on the robot's program behaving normally. That is the reason to use it when the robot is doing something you did not expect. If the software is misbehaving, you do not want to depend on the same software to stop it.",
          ],
        },
        {
          heading: "The pause at the pendant",
          paragraphs: [
            "A Pause at the pendant is the normal stop or pause control on the robot's screen. It is for ordinary reasons: reloading a tray, changing a label roll, straightening a box, or any adjustment your site procedure allows with the robot paused. It lets the robot resume in a controlled way from where it stopped.",
            "A pause is not a safety measure against danger. It depends on the robot's software receiving the command and acting on it normally, and on some cells it may take a moment to find on the screen. It is the right stop for routine work, and the wrong one when a person is at risk.",
          ],
        },
        {
          heading: "The protective stop",
          paragraphs: [
            "There is a third kind of stop that you do not choose. A protective stop is triggered by the robot or its safeguards on their own, for example when the arm meets unexpected resistance, a scanner sees someone in a zone, or a gripper loses its part. The pendant will usually show a message saying why.",
            "You will learn what to do after a protective stop in the next lesson, which is the recovery drill. For now, it is enough to know that a protective stop is the system telling you something, and that the message is worth reading.",
          ],
        },
        {
          heading: "Match the stop to the situation",
          paragraphs: [
            "The move in this lesson is to link the stop to the situation, and not to how serious the moment feels. Routine reasons get a pause at the pendant. Danger to a person, or motion you did not expect, gets the emergency stop. If you are unsure whether someone is in danger, treat it as danger.",
            "The common mistake runs in both directions. Some people use the emergency stop as a convenient off switch for routine stops, which can wear the system, can leave the arm in an awkward position, and teaches everyone that the red button is ordinary. Others reach for the pause in a real emergency because it is the button they press every hour. Both come from habit rather than from reading the situation.",
          ],
        },
      ],
      workedExample: {
        title: "Two stops from the same week",
        inputLabel: "The supervisor's notes",
        outputLabel: "The supervisor's review",
        prompt:
          "Gareth Lloyd, supervisor, Calder Labels, Halifax: \"On Tuesday an operator pressed the emergency stop to reload the part tray, which happens every hour. On Thursday the arm moved towards a colleague's hand during an unexpected motion, and the operator paused it at the pendant, which took a few seconds to find on the screen.\"",
        output:
          "\"Tuesday should have been a pause at the pendant, because reloading the tray is a routine reason and nobody was in danger. Thursday should have been the emergency stop, because the motion was unexpected and a person's hand was at risk.\"",
        reading: [
          "The two stops were used the wrong way round, and both operators were trying to be careful. The Tuesday operator thought the red button was the safest choice for any stop. The Thursday operator pressed the button she used every hour.",
          "Gareth's review links each stop to the situation. Reloading a tray is routine, so it gets a pause. An arm moving somewhere it should not, towards a hand, is danger, and it gets the stop that does not depend on the software behaving.",
          "The few seconds spent finding the pause on Thursday are the cost of the wrong habit. Nobody was hurt, but the review is the moment to change the habit before someone is.",
        ],
      },
      practice: {
        intro:
          "Here are two situations at a cobot that loads a test rig. Mark which stop you would use for each. The descriptions of both stops are in the sections above.",
        check: {
          kind: "mark",
          prompt: "Mark each situation with Emergency stop or Pause at the pendant.",
          passLabel: PAUSE,
          failLabel: ESTOP,
          sentences: [
            {
              id: "tray",
              text: "The part tray is empty, and the procedure says to stop the robot before you refill it.",
              fail: false,
              why: "Refilling a tray is routine and nobody is in danger, so you pause the robot at the pendant.",
            },
            {
              id: "cable",
              text: "The arm has snagged its own tool cable and is dragging the rig towards the edge of the bench.",
              fail: true,
              why: "This is serious damage in progress and unexpected motion, so you use the emergency stop.",
            },
          ],
          why: "That is right. The tray refill is routine and gets a pause, and the snagged cable is damage in progress that gets the emergency stop.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "For each situation at a cobot that places labels on boxes at Calder Labels, mark which stop you would use.",
        passLabel: PAUSE,
        failLabel: ESTOP,
        sentences: [
          {
            id: "roll",
            text: "The label roll is running out, and the procedure says to stop the robot before changing it.",
            fail: false,
            why: "Changing a roll is routine, and nobody is in danger. The emergency stop is for danger to a person or serious damage, so use the pause at the pendant.",
          },
          {
            id: "sleeve",
            text: "A colleague's sleeve has caught on the gripper, and the arm is still moving.",
            fail: true,
            why: "A person is in danger here. A pause relies on the software behaving normally, and you need the stop that is designed for danger, so use the emergency stop.",
          },
          {
            id: "box",
            text: "You need to straighten a box on the conveyor, and the procedure allows you to do it with the robot paused.",
            fail: false,
            why: "This is a routine adjustment that the procedure allows with a pause. The emergency stop is not an ordinary off switch.",
          },
          {
            id: "path",
            text: "The arm starts moving along a path you have never seen it take, towards the walkway where people pass.",
            fail: true,
            why: "Unexpected motion towards people is danger. You cannot rely on the software that is misbehaving to pause it, so use the emergency stop.",
          },
        ],
        why: "You matched each stop to the situation. The roll change and the box are routine and get a pause at the pendant, and the caught sleeve and the unexpected path are danger that gets the emergency stop.",
      },
      bridge:
        "After a stop comes the question of getting going again safely, and the third drill teaches the recovery.",
    },
    {
      id: "recover-drill",
      title: "Drill three, the recovery",
      emphasis: "recovery",
      place:
        "This is the third drill, and it completes the second module. It covers what you do after a protective stop, before the robot moves again.",
      sections: [
        {
          heading: "What a recovery is",
          paragraphs: [
            "A recovery is what you do after the robot has stopped for a reason other than a routine pause. Most often it follows a protective stop: the arm detected a collision, the gripper lost its part, or a safeguard such as a scanner or a light curtain was triggered. The aim of a recovery is to understand why the robot stopped before it moves again.",
            "A recovery is not a repair. If clearing the cause would mean changing the program, the safety settings, the tooling, or the guarding, it is no longer a recovery, and the next lesson covers what to do instead. A recovery is also not the same as a reset. The reset is one step near the end of it.",
          ],
        },
        {
          heading: "The five steps, in order",
          paragraphs: [
            "A good recovery has five steps. First, find out why it stopped, by reading the message on the pendant and looking at the robot, the tool, and the part. Second, clear the cause, for example by removing a dropped part or a chip of swarf. Third, check that nobody and nothing is in the path the robot will take when it moves. Fourth, acknowledge or reset the stop on the pendant as your procedure says. Fifth, resume and watch at least one full cycle.",
            "The first step deserves the most time. The message on the pendant tells you what the robot detected, and looking at the cell tells you what caused it. A message saying collision detected, together with a part sitting half out of its fixture, gives you a cause you can clear. A message alone, without looking, gives you a guess.",
          ],
        },
        {
          heading: "Why the reset comes late",
          paragraphs: [
            "The most common mistake is to reset first and look afterwards. The robot then either stops again for the same reason, because the cause is still there, or, worse, moves while the cause is still in its path. Operators who reset first often reset several times in a row, and each reset teaches them nothing.",
            "Checking the path before the reset matters because a recovery usually involves reaching into the cell. You may have left a brush on the fixture, or a colleague may have come to help and be standing where the arm is about to go. The watched cycle at the end is how you confirm that the cause really was the cause.",
          ],
          beforeAfter: {
            before: "Protective stop. Pressed reset. It stopped again. Pressed reset again.",
            after:
              "Protective stop. Read the message, which said the gripper had lost the part. Found the part on the conveyor, removed it, checked the path was clear, acknowledged the stop, and watched the next cycle.",
            reading:
              "The first log has two resets and no cause. The second finds the cause, clears it, and only then resets, so the robot has no reason to stop again for the same thing.",
          },
        },
      ],
      workedExample: {
        title: "A recovery on a test rig",
        inputLabel: "The first log entry",
        outputLabel: "The same event, done properly",
        prompt:
          "Aisha Rahman, operator, cobot loading a test rig, Brookmoor Components: \"Protective stop at 10:15. I pressed reset straight away and it stopped again. I pressed reset again and it stopped again.\"",
        output:
          "\"Protective stop at 10:15. The message said a collision had been detected. The part was sitting half out of the rig fixture. I removed it, checked there was nothing else in the fixture and nobody near the arm, acknowledged the stop, resumed, and watched the next cycle seat correctly.\"",
        reading: [
          "In the first entry Aisha reset twice without finding the cause, so the robot tried to load a part into a fixture that was already occupied and detected the same collision each time.",
          "In the second entry the message told her what the robot had detected, and looking at the fixture told her why. She removed the cause before the reset, checked the path, and watched a cycle to confirm the fix.",
          "The second entry is also a far better record for the next shift. It names the time, the message, the cause, and what was done, which is exactly what the handover in the final lesson will ask for.",
        ],
      },
      practice: {
        intro:
          "Here is a log entry from a tray-loading cobot at Halden Packaging. Rewrite it in place as a recovery in the five steps. Use the facts in the material, keep the time, and say what caused the stop, what you cleared, that the path was checked, and that you watched a cycle.",
        check: {
          kind: "edit",
          prompt:
            "Rewrite this recovery log so that it finds the cause before the reset. Keep the time of the stop.",
          material: {
            label: "What the operator found",
            text: "The pendant message said the gripper had lost the part. A tray insert was lying across the infeed conveyor.",
          },
          label: "The log you are rewriting",
          start:
            "Protective stop at 14:40 on the tray loader. Pressed reset on the pendant and it ran. It stopped again at 14:42, so I reset it again.",
          unchanged:
            "You have not changed the log yet. Rewrite it so that it reads the message, removes the tray insert, checks the path, and only then acknowledges the stop.",
          limitWording: false,
          limits: [],
          keep: [
            {
              id: "time",
              any: ["14:40"],
              missing: "Keep the time of the stop, 14:40, so the next shift knows when it happened.",
            },
            {
              id: "cause",
              any: ["message", "because", "cause", "lost the part", "found"],
              missing:
                "Your log does not yet say why the robot stopped. Add the message on the pendant or what you found when you looked.",
            },
            {
              id: "clear",
              any: ["removed", "cleared", "took", "lifted", "moved"],
              missing: "Your log does not yet say that you cleared the cause. Say that you removed the tray insert.",
            },
            {
              id: "path",
              any: ["path", "nobody", "no one", "clear of", "nothing in"],
              missing:
                "Your log does not yet say that you checked the robot's path before it moved. Add that nobody and nothing was in the way.",
            },
            {
              id: "watch",
              any: ["watched", "observed"],
              missing: "Your log does not yet say that you watched a full cycle after resuming. Add it as the last step.",
            },
          ],
          why: "That recovery finds and clears the cause before the robot moves. It reads the message, removes the insert, checks the path, and ends with a watched cycle.",
          result: {
            label: "A recovery log written in the five steps",
            text: "Protective stop at 14:40 on the tray loader. The message said the gripper had lost the part, and a tray insert was lying across the infeed conveyor. I removed it, checked that nobody and nothing was in the robot's path, acknowledged the stop, resumed, and watched the next cycle.",
          },
        },
      },
      check: {
        kind: "order",
        prompt:
          "A cobot at Wrenfield Foods has stopped with a message saying the gripper lost the part. Put these recovery steps in the order this lesson taught, with the first step at the top.",
        steps: [
          { id: "ack", label: "Acknowledge the stop on the pendant." },
          { id: "remove", label: "Remove the dropped part." },
          { id: "resume", label: "Resume and watch a full cycle." },
          { id: "read", label: "Read the message and look at the gripper and the part to find out why it stopped." },
          { id: "path", label: "Check that nobody and nothing is in the robot's path." },
        ],
        correct: ["read", "remove", "path", "ack", "resume"],
        why: "Your recovery finds and clears the cause before the robot moves again. You found the cause, cleared it, checked the path, and only then acknowledged the stop and resumed while watching.",
        wrong:
          "Not that order yet. You cannot clear a cause you have not found, so reading the message comes first. Acknowledging the stop before the part is removed is the reset-first mistake from the worked example, and the robot must not resume until you have checked its path.",
      },
      bridge:
        "Some stops are not yours to recover, and the next lesson teaches you to recognise them before a small problem becomes a hidden one.",
    },
    {
      id: "when-to-call-a-person",
      title: "When to call a person",
      emphasis: "call",
      place:
        "This is the third module. It draws the line around the stops you recover yourself, and it names the ones you hand to someone else.",
      sections: [
        {
          heading: "The stops that are yours",
          paragraphs: [
            "You recover a stop yourself when the cause is ordinary, visible, and cleared without changing anything about how the robot is set up, and when it has not been happening again and again. A dropped part you can see, a chip of swarf you can brush away, or a box that has slipped on the conveyor are all examples.",
            "In this lesson the label for these is Recover it myself. It means you follow the five-step recovery from the last lesson, and you write the stop and its cause in the handover.",
          ],
        },
        {
          heading: "The stops that are not",
          paragraphs: [
            "The label Call a person means you stop recovering and hand the problem to your supervisor, the robot's responsible engineer, or whoever your site names. You call a person when any one of these is true: the same stop keeps happening; clearing the cause would need a change to the program, the safety settings, the tool, or the guarding; anyone has been hurt or nearly hurt; the robot moved in a way you did not expect; there is visible damage to the robot, its cables, or its tool; or you do not understand the message.",
            "Each of those conditions means the cause is either outside a recovery or not yet known. A change to the program is a repair. A near miss needs to be looked at by someone who can change the task. A message you do not understand means you do not know what you would be clearing.",
          ],
        },
        {
          heading: "Why a pattern matters more than a single stop",
          paragraphs: [
            "The hardest case is a stop you can recover that keeps coming back. Each recovery on its own can be done perfectly, and the pattern can still be the thing that matters. Four dropped parts in an hour usually mean something about the setup has changed: a worn finger, a loose fixture, or a part from a new batch.",
            "A useful rule is that the second repeat of the same stop is a reason to call. Your site may set its own number, and if it does, use it. What matters is that you are counting, and that you stop treating each stop as new when it is not.",
          ],
        },
        {
          heading: "Calling is part of the job",
          paragraphs: [
            "Calling a person is not a failure or an admission that you could not cope. It is the part of the job that keeps small problems from being hidden. An operator who recovers the same stop eight times in a shift has done a lot of work and has kept the real cause out of sight of the one person who could fix it.",
            "The common mistake is pride, or the feeling that the engineer is busy. The better habit is to make the call early, leave the robot safely stopped, and write down what you saw. The person you call will want the same facts the handover asks for: the time, the message, the cause as far as you know it, and what you have already done.",
          ],
        },
      ],
      workedExample: {
        title: "Three notes from one night shift",
        inputLabel: "The night operator's notes",
        outputLabel: "The cell leader's reading",
        prompt:
          "Night shift, cobot cell 4, Ashgrove Engineering: \"A part fell out of the gripper at 01:10, I picked it up and resumed. The same thing happened at 01:40, 02:05, and 02:30, and I recovered each time. At 03:00 I noticed the gripper cable was rubbing on the fixture.\"",
        output:
          "Kwame Mensah, cell leader: \"The first dropped part was yours to recover. By 02:05 the stop was repeating and should have been called in. The rubbing cable is damage and should have been called in as soon as it was seen.\"",
        reading: [
          "Each recovery on its own was done correctly. The operator found the part, cleared it, and resumed. Nothing in the individual notes is careless.",
          "The pattern is what mattered. Four dropped parts in under ninety minutes were a sign that something about the setup had changed, and the rubbing cable at 03:00 was probably the reason. That is damage, and damage is always called in.",
          "Kwame's reading gives the operator a clear line to use next time: recover the first, call on the repeat, and call at once for damage.",
        ],
      },
      practice: {
        intro:
          "Two operators faced the same problem on a cobot that loads a lathe. Choose the decision that follows the line this lesson drew. The list of conditions is in the section above.",
        check: {
          kind: "choose",
          prompt:
            "The part will only seat in the chuck if the robot's approach position is moved by a few millimetres. Choose the better decision.",
          leftLabel: "Decision A",
          left: "Leave the robot stopped, call the shift engineer, and note the time and what you saw on the pendant.",
          rightLabel: "Decision B",
          right: "Adjust the approach position on the pendant by a few millimetres, run one cycle to check it seats, and note the change in the handover.",
          correct: "left",
          why: "Decision A is right. The only fix is a change to the program, and changing the program is outside a recovery, so you call a person and leave the robot safely stopped.",
          wrong:
            "Look again at Decision B. Moving the approach position is a change to the program, which is a repair, not a recovery. Even a small change can alter the path near people. Decision A calls a person.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "For each problem at a cobot that tends a CNC machine at Brookmoor Components, mark whether you would recover it yourself or call a person.",
        passLabel: RECOVER,
        failLabel: CALL,
        sentences: [
          {
            id: "swarf",
            text: "A protective stop because a swarf chip was stuck on the part. You can see the chip and remove it with the brush provided.",
            fail: false,
            why: "The cause is visible and you can clear it with the brush, without changing anything. This is one to recover yourself, unless it keeps happening.",
          },
          {
            id: "program",
            text: "The part is not seating in the chuck, and the only fix would be to change the robot's position in the program.",
            fail: true,
            why: "Clearing this would mean changing the program, which is outside a recovery, so you call a person.",
          },
          {
            id: "forearm",
            text: "The arm brushed your forearm harder than usual when you reached in during a pause.",
            fail: true,
            why: "Contact that was harder than usual is a near miss. Anything that hurts or nearly hurts someone is called in.",
          },
          {
            id: "message",
            text: "The message on the pendant is one you have never seen and do not understand.",
            fail: true,
            why: "You cannot clear a cause you do not understand. When the message is unfamiliar, call a person.",
          },
        ],
        why: "You kept to yourself only the stop that is ordinary, visible, and cleared without changing the setup. The program change, the near miss, and the unfamiliar message all go to someone who can deal with the cause.",
      },
      bridge:
        "You now have every move a shift needs. The next lesson puts them together on situations you have not yet seen, before you write the handover.",
    },
    {
      id: "course-assessment",
      title: "The shift assessment",
      emphasis: "assessment",
      place:
        "This is the course assessment. It recaps the method from the first five lessons, works one mixed shift through from start to finish, and then asks you to apply the method to eight new situations.",
      sections: [
        {
          heading: "The method in one place",
          paragraphs: [
            "The course has taught five moves. First, you separate what the arm does on its own from what makes the whole task safe to work near, and you give more weight to the statements about the whole task. Second, you start the robot in five steps: read the handover, clear the space, check the tool and the part, confirm the program, and watch the first cycle.",
            "Third, you match the stop to the situation: the emergency stop for danger or unexpected motion, and the pause at the pendant for routine reasons. Fourth, you recover a protective stop by finding the cause, clearing it, checking the path, acknowledging the stop, and watching a cycle. Fifth, you call a person when the stop repeats, when the fix would change the setup, when someone was hurt or nearly hurt, when the robot moved unexpectedly, when there is damage, or when you do not understand the message.",
          ],
        },
        {
          heading: "How the moves connect",
          paragraphs: [
            "The moves are not separate tasks. The start depends on the handover the last shift wrote. A recovery depends on having chosen the right stop, because an emergency stop used for a routine reason can leave the arm in an awkward position that makes the recovery harder. The decision to call a person depends on having counted how often a stop has happened, which is only possible if each recovery was written down.",
            "Most real problems at a cobot cell involve more than one move. A dropped part is a recovery until it repeats, at which point it becomes a call. A new tool on an old arm is a question about the whole task before it is a question about the start. Reading a situation well means asking which move it calls for before you reach for a button.",
          ],
        },
        {
          heading: "How the assessment works",
          paragraphs: [
            "The assessment has eight situations. Each one describes a real piece of work at a cobot cell, and each has one option that follows the method this course taught. The other options are things a reasonable operator might do, and the feedback on each one says what it would cause.",
            "You need six of the eight to pass. After you submit, every question shows whether your choice was right and why. If you do not pass, your answers stay on the screen so that you can read the feedback and try again.",
          ],
        },
      ],
      workedExample: {
        title: "One shift, every move",
        inputLabel: "The shift, as it happened",
        outputLabel: "The moves, as the shift leader read them",
        prompt:
          "Early shift, cobot cell 2, Halden Packaging. Dev Patel read the handover, which said a new batch of cartons had arrived. He cleared a pallet of flattened cartons from the edge of the cell, checked the suction gripper, confirmed the program, and watched the first case. At 07:20 a protective stop said the gripper had lost the carton; he found it on the floor, removed it, checked the path, acknowledged the stop, and watched a cycle. It happened again at 07:45 and 08:05. At 08:10 he called Chloe Barnes, the shift engineer, and left the robot stopped.",
        output:
          "The start followed the five steps, and the handover warning about new cartons told Dev what to watch. The first stop at 07:20 was his to recover, and he recovered it in order. By the repeat at 08:05 the stop was a pattern, and calling Chloe was the right move. The new carton batch is the likely cause, which is a question about the whole task, not the arm.",
        reading: [
          "Dev used four of the five moves in one shift. His start was in order, his recovery found the cause before the reset, and he called a person on the repeat rather than recovering the same stop all morning.",
          "The shift leader's reading also names the first lesson. The arm had not changed. The cartons had, and a change in the part is a change in the whole task.",
          "Dev could have called at 07:45, on the first repeat, which is the rule this course suggested. Calling at 08:10 was still well inside a reasonable judgement, and his notes gave Chloe every time and message she needed.",
        ],
      },
      practice: {
        intro:
          "Before the assessment, try one mixed situation. Two operators describe what they did after the same event at a cobot that places lids on tubs. The method is in the sections above.",
        check: {
          kind: "choose",
          prompt:
            "The arm paused itself with a message saying unexpected resistance. When you look, a lid is jammed under the placement head and one of the head's suction cups is split. Choose the better response.",
          leftLabel: "Response A",
          left: "Removed the jammed lid, checked the path was clear, acknowledged the stop, and watched a cycle. It placed the next lid, so I carried on and put the split cup in the handover.",
          rightLabel: "Response B",
          right: "Removed the jammed lid, left the robot stopped, and called the shift technician because the suction cup is split. Wrote down the time and the message.",
          correct: "right",
          why: "Response B is right. The jammed lid was ordinary, but the split cup is damage to the tool, and damage is always called in. Leaving the robot stopped and writing down the time and message gives the technician what they need.",
          wrong:
            "Look again at Response A. The recovery steps were in order, but the split suction cup is damage to the tool, and damage is called in, not carried on with. A cycle that works once does not show the cup will hold. Response B calls a person.",
        },
      },
      check: {
        kind: "scenario",
        prompt:
          "Read each situation and choose what you would do. Each question has one option that follows the method this course taught. You need six of the eight to pass.",
        passMark: 6,
        questions: [
          {
            id: "new-tool",
            situation:
              "Halden Packaging plans to move the cobot from cell 3, where it packs cartons, to a bench where it will deburr castings with a rotary tool. The production manager, Tom Whitlock, says it can go on the new job beside the bench operator tomorrow, because it is a cobot and has force limiting.",
            question: "What do you say to Tom?",
            options: [
              {
                id: "a",
                text: "Agree, because the arm's force limiting will protect the bench operator whatever tool it carries.",
                feedback:
                  "Force limiting is about the arm. A rotary deburring tool is a new hazard that the arm's own features were not assessed against, so the bench operator could be hurt by the tool before the arm senses anything. The better move is to say the new task needs assessing as a whole.",
              },
              {
                id: "b",
                text: "Say that the new tool and the new task change the application, so it needs assessing as a whole task before anyone works beside it.",
                correct: true,
                feedback:
                  "That holds. Collaborative describes the whole task, not the arm, and a rotary tool beside a person is a different task from packing cartons. The assessment has to be done by whoever your site names before the operator works next to it.",
              },
              {
                id: "c",
                text: "Offer to reduce the speed on the pendant yourself before the move, so the arm is gentler on the new job.",
                feedback:
                  "Changing speed settings is a change to the setup, not something an operator decides on the pendant. It also treats the arm's speed as the whole answer, when the tool is the new hazard. The better move is to ask for the task to be assessed as a whole.",
              },
              {
                id: "d",
                text: "Suggest putting a sign on the bench asking the operator to keep a safe distance while it runs.",
                feedback:
                  "A sign does not assess the task, and a bench operator will often need to be close. It leaves the rotary tool hazard unexamined. The better move is to say the new task needs assessing as a whole before anyone works beside it.",
              },
            ],
          },
          {
            id: "missing-handover",
            situation:
              "You arrive at cell 5 at Wrenfield Foods for the 06:00 start. The night shift's handover note is not on the clipboard and the night team leader, Siobhan Kelly, is still on site. The space looks clear and the pendant shows the usual program.",
            question: "What do you do first?",
            options: [
              {
                id: "a",
                text: "Find Siobhan or the missing note and read what the night shift left before you start the robot.",
                correct: true,
                feedback:
                  "That holds. The handover is the first step of a start because it can warn you about anything that follows. The space and the program looking normal does not tell you whether a gripper was changed or a stop kept repeating overnight.",
              },
              {
                id: "b",
                text: "Start the robot and watch the first cycle, since the space and the program both look right.",
                feedback:
                  "The space and the program are only two of the five steps, and the handover is the one that tells you what to look for in the others. Starting without it means any warning from the night shift arrives after the robot is moving. Find the note or Siobhan first.",
              },
              {
                id: "c",
                text: "Start the robot and send Siobhan a message asking her to leave the note later.",
                feedback:
                  "This puts the handover after the start, which is the mistake from the worked example in the start drill. If the night shift changed something, you would be running on it before you knew. Read the handover first.",
              },
            ],
          },
          {
            id: "visitor",
            situation:
              "A group from a customer is being shown round the line at Calder Labels. One visitor steps over the floor marking into the cell and leans towards the fixture while the arm is moving at full speed towards it.",
            question: "Which stop do you use?",
            options: [
              {
                id: "a",
                text: "Pause the robot at the pendant, because it resumes more smoothly afterwards.",
                feedback:
                  "A pause relies on the software behaving normally and can take a moment to find. A person is in the arm's path, which is danger, and smooth resumption does not matter here. Use the emergency stop.",
              },
              {
                id: "b",
                text: "Call out to the visitor to step back and let the robot's force limiting handle any contact.",
                feedback:
                  "Force limiting is about the arm, and at full speed near someone's face it is not the protection the task relies on. Calling out may not be heard in time. A person is in danger, so use the emergency stop.",
              },
              {
                id: "c",
                text: "Press the emergency stop.",
                correct: true,
                feedback:
                  "That holds. A person is in the arm's path while it moves at speed, which is danger, and the emergency stop is designed for exactly that. Once the robot is stopped, the visitor can be moved back and the event reported.",
              },
            ],
          },
          {
            id: "routine-estop",
            situation:
              "At Ashgrove Engineering, Marek Nowak changes the screw feeder on the screwdriving cobot every forty minutes. He presses the emergency stop each time because he says it feels safer, and the site procedure says the feeder is changed with the robot paused.",
            question: "What do you suggest to Marek?",
            options: [
              {
                id: "a",
                text: "Carry on, because the emergency stop is always the safest choice.",
                feedback:
                  "Using the emergency stop for routine work can wear the system, can leave the arm in an awkward position, and teaches the cell that the red button is ordinary. The procedure already says pause, so the better move is to use the pause at the pendant.",
              },
              {
                id: "b",
                text: "Switch the robot off at the main isolator for each change instead.",
                feedback:
                  "Powering down every forty minutes adds a restart each time and is not what the procedure asks for. It solves a problem the procedure has already solved. The better move is the pause at the pendant.",
              },
              {
                id: "c",
                text: "Ask the engineer to remove the emergency stop from the pendant so it cannot be pressed by habit.",
                feedback:
                  "The emergency stop must stay where it is, because it is the stop for danger. The problem is the habit, not the button. The better move is to use the pause at the pendant for the feeder change.",
              },
              {
                id: "d",
                text: "Use the pause at the pendant for the feeder change, as the procedure says, and keep the emergency stop for danger.",
                correct: true,
                feedback:
                  "That holds. A feeder change is routine and the procedure allows it with a pause. Keeping the emergency stop for danger means it is the button people reach for when it matters.",
              },
            ],
          },
          {
            id: "behind-schedule",
            situation:
              "At 10:40 the test rig cobot at Brookmoor Components shows a protective stop with the message collision detected. You can see a part sitting half out of the fixture. The team leader rings and says the line is behind, so just reset it.",
            question: "What do you do?",
            options: [
              {
                id: "a",
                text: "Reset it straight away, because the team leader has asked and the cause looks minor.",
                feedback:
                  "With the part still half out of the fixture, the robot will try to load into an occupied fixture and stop again, or move while the cause is still there. That is the reset-first mistake. Clear the cause, check the path, then acknowledge the stop.",
              },
              {
                id: "b",
                text: "Remove the part, check that nobody and nothing is in the path, acknowledge the stop, and watch the next cycle.",
                correct: true,
                feedback:
                  "That holds. The message and the part gave you a visible, ordinary cause, so this is yours to recover, and the five steps take less time than resetting twice. Watching the next cycle confirms the fix.",
              },
              {
                id: "c",
                text: "Press the emergency stop, then reset both stops together so it is fully cleared.",
                feedback:
                  "The robot has already stopped and nobody is in danger, so the emergency stop adds nothing and gives you a second reset to do. It also leaves the part in the fixture. Recover the stop in the five steps.",
              },
              {
                id: "d",
                text: "Leave it stopped and call the shift engineer, because a collision was detected.",
                feedback:
                  "A collision message with a visible part half out of the fixture is an ordinary cause you can clear without changing anything. Calling for this takes the engineer away for a problem you can recover. Clear the part and recover in order, and call if it repeats.",
              },
            ],
          },
          {
            id: "fourth-drop",
            situation:
              "On the late shift at Halden Packaging, the case-packing cobot has dropped a jar four times since 18:30, and each time you found the jar, cleared it, and recovered in order. It is now 19:55 and it has just dropped a fifth.",
            question: "What do you do?",
            options: [
              {
                id: "a",
                text: "Leave the robot stopped and call the person your site names, with the times of each drop.",
                correct: true,
                feedback:
                  "That holds. The same stop repeating is a reason to call, whatever the quality of each recovery. Five drops in under ninety minutes point at something in the setup, and the times you give let the engineer see the pattern.",
              },
              {
                id: "b",
                text: "Recover it again and write the five drops in the handover for the next shift to look at.",
                feedback:
                  "Each recovery can be done perfectly while the cause stays hidden. Passing it to the next shift leaves them with the same problem and no fix. The repeat is the reason to call a person now.",
              },
              {
                id: "c",
                text: "Reduce the speed on the pendant so the gripper has more time to hold each jar.",
                feedback:
                  "Changing the speed is a change to the setup, which is outside a recovery. It might also hide the real cause, such as a worn finger. The better move is to call a person.",
              },
              {
                id: "d",
                text: "Tighten the gripper fingers yourself with the key in the cell drawer, then resume and watch.",
                feedback:
                  "Adjusting the tool is a change to the setup, not a recovery, and you do not yet know that the fingers are the cause. The repeat is the signal to call a person who can find the cause.",
              },
            ],
          },
          {
            id: "unknown-message",
            situation:
              "The labelling cobot at Calder Labels has stopped and the pendant shows a code, C207, that you have never seen. Nothing in the cell looks out of place, and there is no dropped label or box.",
            question: "What do you do?",
            options: [
              {
                id: "a",
                text: "Acknowledge the stop and watch a cycle, because nothing in the cell looks wrong.",
                feedback:
                  "If you do not understand the message, you do not know the cause, and a recovery starts with finding the cause. Resetting now is a guess. Call a person and leave the robot stopped.",
              },
              {
                id: "b",
                text: "Search for the code online and follow the first fix you find.",
                feedback:
                  "A fix from a forum may belong to a different robot, a different software version, or a different setup, and it could involve changing settings you should not touch. The better move is to call the person your site names.",
              },
              {
                id: "c",
                text: "Leave the robot stopped, call the person your site names, and give them the code and the time.",
                correct: true,
                feedback:
                  "That holds. An unfamiliar message means the cause is not known, which puts it outside a recovery. The code and the time are what the person you call will ask for first.",
              },
              {
                id: "d",
                text: "Switch the controller off and on again to clear the code.",
                feedback:
                  "Restarting the controller clears the message without finding the cause, and it may clear information the engineer needs. The better move is to leave it stopped and call a person.",
              },
            ],
          },
          {
            id: "end-of-shift",
            situation:
              "It is 21:55 at Wrenfield Foods and your shift ends at 22:00. During the shift the palletiser had three protective stops, you recovered two, and you called Priya Nair, the shift engineer, about the third, which she traced to a worn suction cup and replaced.",
            question: "What do you leave for the night shift?",
            options: [
              {
                id: "a",
                text: "A short note saying the robot is fine and there were a few stops.",
                feedback:
                  "Fine and a few stops gives the night shift nothing they can act on. They will not know which program is running, what caused the stops, that Priya replaced a cup, or what to watch. Write the four parts.",
              },
              {
                id: "b",
                text: "A full account of your shift, hour by hour, so nothing is left out.",
                feedback:
                  "A diary buries the few facts the night shift needs among many they do not. They should be able to start well from the note in a minute or two. Write the four parts and leave out the rest.",
              },
              {
                id: "c",
                text: "Tell the incoming operator in person and leave nothing written, since you will see them at the door.",
                feedback:
                  "A spoken handover is easily misheard or forgotten, and it does not reach anyone who arrives later or covers a break. The handover is what the next shift reads first when they start. Write it down in the four parts.",
              },
              {
                id: "d",
                text: "A note giving the state and program, the three stops and their causes, which you recovered and that you called Priya about the third, and that the new suction cup should be watched.",
                correct: true,
                feedback:
                  "That holds. The night shift can start from this without finding you. They know what is running, what happened, who knows about it, and exactly where to look.",
              },
            ],
          },
        ],
        why: "You applied the method across new situations: the whole task before the arm, the handover before the start, the stop matched to the situation, the cause before the reset, the call on a repeat or an unknown, and a handover the next shift can act on.",
      },
      bridge:
        "Everything you started, stopped, recovered, and called in during a shift has to reach the next shift, and the final lesson is where you write that handover.",
    },
    {
      id: "the-handover",
      title: "The handover",
      emphasis: "handover",
      place:
        "This is the final lesson and the fourth module. You write the handover note that your record will show.",
      sections: [
        {
          heading: "What a handover note is",
          paragraphs: [
            "A handover note is the written account of the robot's state that the next shift reads first, as the start drill taught. It is the first step of their start, which makes it the last step of yours. If it is thin, every step of their start is done without the warning it should have carried.",
            "The UK Health and Safety Executive's human factors guidance treats shift handover as safety-critical communication, because much of what goes wrong between shifts is a message that was never passed on. A handover note is where the message is written down so that it does not depend on who meets whom at the door.",
          ],
        },
        {
          heading: "The four parts",
          paragraphs: [
            "A good handover note has four parts. The first is the state of the robot at handover: which program or task is running, and whether anything is not normal. The second is the stops during the shift and what caused each one, or that the cause is unknown, or that there were no stops this shift.",
            "The third is what you recovered and what you called in, and, if you called someone, who. The fourth is what the next shift must watch: a specific part of the robot, the tool, the part, or the task, and the reason. Each part answers one question the next operator would otherwise have to find you to ask.",
          ],
        },
        {
          heading: "What a handover is not",
          paragraphs: [
            "A handover is not all fine unless everything really was. If there were no stops, write no stops this shift, so the next shift knows you checked rather than forgot. A handover is also not a diary of your shift. The next person needs the few facts that let them start well, not an account of every hour.",
            "The common mistake is the three-word note written at the door: robot OK, few stops, watch it. It feels like a handover, and it tells the next shift nothing they can act on. A note that names the program, the causes, the person called, and the gripper cable to watch takes a minute longer and saves the next shift from guessing.",
          ],
        },
        {
          heading: "Write it for someone who cannot find you",
          paragraphs: [
            "The test for your note is whether the next shift could start from it without finding you. Write names and roles, not only first names. Write times where they help, such as when a stop started repeating. Write the cause as you found it, and write cause unknown when you did not find it.",
            "Your note will appear on a record that a second person can open, so do not put anything confidential into it. Use a real or recent shift, and change any names or part numbers you would not want shown, keeping the same shape. This record shows the handover note you wrote in this course. It does not authorise you to operate any robot, and it is not a record of training under any regulation or standard.",
          ],
        },
      ],
      workedExample: {
        title: "Two notes from the same shift",
        inputLabel: "Note one",
        outputLabel: "Note two",
        prompt: "Robot OK. Few stops. Watch it.",
        output:
          "State: running the part 2210 program, normal cycle since 02:50. Stops: four protective stops between 01:10 and 02:30, all dropped parts. Recovered the first two myself. Called Priya Nair, shift engineer, at 02:35 because they kept repeating. She found the gripper cable rubbing on the fixture and re-routed it. Watch: the gripper cable at the fixture, and any dropped part, which should now be rare.",
        reading: [
          "Note one tells the next shift nothing they can act on. They do not know what is running, how many stops there were or why, whether anyone has looked at it, or what it means to watch it.",
          "Note two gives the state with a program and a time, the stops with their cause, the two recoveries and the call with a name and a role, and a specific place to look. A next shift operator could read it in under a minute and start well.",
          "Note two is also only five sentences. A good handover is short because it is precise, not because it leaves things out.",
        ],
      },
      practice: {
        intro:
          "Here is a thin handover note and the shift log it was written from. Rewrite the note in place so it has all four parts. Use the facts from the log, and name who was called.",
        check: {
          kind: "edit",
          prompt: "Rewrite this handover note so the next shift could start from it without finding you.",
          material: {
            label: "The shift log, Line 3 cobot, Tuesday night",
            text: "Running program 4410 for the bracket. Protective stops at 23:20 and 00:05, both because a bracket slipped in the gripper. First one recovered by me. Second one: called Marek Nowak, shift technician, who tightened the gripper fingers at 00:30. Normal since.",
          },
          label: "The handover note you are rewriting",
          start: "Robot OK. Few stops. Watch it.",
          unchanged:
            "You have not changed the note yet. Rewrite it with the state, the stops and their causes, what you recovered and who you called, and what to watch.",
          limitWording: false,
          limits: [],
          keep: [
            {
              id: "state",
              any: ["4410", "program"],
              missing: "Your note does not yet give the state. Name the program that is running, 4410, and say it has been normal since the fix.",
            },
            {
              id: "cause",
              any: ["slipped", "because", "cause", "dropped"],
              missing: "Your note lists stops without causes. Say that both stops were because a bracket slipped in the gripper.",
            },
            {
              id: "called",
              any: ["marek", "technician"],
              missing: "Your note does not yet say who was called. Name Marek Nowak, the shift technician.",
            },
            {
              id: "watch-what",
              any: ["gripper", "fingers", "bracket"],
              missing: "Your note does not yet name what to watch. Name the gripper fingers Marek tightened, and say why.",
            },
          ],
          why: "That note has all four parts. It gives the program, both stops and their cause, the recovery and the call to Marek, and the gripper fingers to watch.",
          result: {
            label: "A handover note in four parts",
            text: "State: running program 4410 for the bracket, normal since 00:30. Stops: two protective stops, at 23:20 and 00:05, both because a bracket slipped in the gripper. Recovered the first myself. Called Marek Nowak, shift technician, about the second; he tightened the gripper fingers at 00:30. Watch: the gripper fingers, and any bracket that slips.",
          },
        },
      },
      check: {
        kind: "build",
        prompt:
          "Write a handover note for a real or recent shift at the cobot you work with, or the one you expect to work with. Each part has to tell the next shift something they can act on.",
        fields: [
          {
            id: "state",
            label: "State of the robot at handover",
            hint: "Name the program or task that is running, for example by its number or name, and say whether anything is not normal.",
            min: 20,
            rule: "fact",
            any: ["normal", "fault", "alarm", "warning", "as expected", "problem", "issue"],
            missing:
              "Your state field does not yet say which program is running or whether anything is not normal. Name the program by its number or name, and say whether it is running normally.",
          },
          {
            id: "stops",
            label: "Stops this shift and their causes",
            hint: "List each stop with its cause, or write cause unknown. If there were none, write no stops this shift.",
            min: 12,
            any: ["cause", "because", "due to", "caused", "unknown", "no stops"],
            missing:
              "Your stops field does not yet give a cause. Add the cause of each stop, or say the cause is unknown, or write no stops this shift so the next shift knows you checked.",
          },
          {
            id: "actions",
            label: "What I recovered and what I called in",
            hint: "Say which stops you recovered yourself and which you called in, and name the person or role you called.",
            min: 16,
            rule: "role",
            any: ["recovered", "called", "rang", "phoned", "reported", "escalated", "nothing called in", "no calls"],
            missing:
              "Your field does not yet separate what you recovered from what you called in. Say which stops you recovered, and name the person or role you called, or say nothing was called in.",
          },
          {
            id: "watch",
            label: "What the next shift must watch",
            hint: "Name a specific part of the robot, the tool, the part, or the task, and say why it needs watching.",
            min: 16,
            any: [
              "gripper",
              "finger",
              "tool",
              "fixture",
              "cable",
              "part",
              "sensor",
              "scanner",
              "guard",
              "conveyor",
              "tray",
              "chuck",
              "suction",
              "cup",
              "label",
              "infeed",
              "outfeed",
              "feeder",
              "program",
              "screen",
              "pallet",
              "carton",
              "jar",
              "box",
            ],
            missing:
              "Your watch field does not yet name something specific. Name the part of the robot, the tool, or the task to watch, such as the gripper fingers or the infeed conveyor, and say why.",
          },
        ],
        why: "Your handover gives the state, the stops and their causes, what you did and who you called, and where the next shift should look. They could start from this without finding you.",
      },
      bridge:
        "Your handover note is ready. Sign your name below, and the record will show this note, the course, and the date to anyone who opens the reference.",
    },
  ],
};
