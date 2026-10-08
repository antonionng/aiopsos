/*
Course: Running a Robotic Cell
Slug: running-a-robotic-cell
For: Operators, cell leaders, and new technicians who run a guarded industrial robot cell
  during a shift (welding, machine tending, palletising, or assembly). They have already been
  authorised by their employer to operate the cell and shown its controls and site procedures.
Outcome: The learner can carry out a start of shift in an order that protects each following
  step, describe normal for their cell in numbers and observations, tell a normal reading from
  drift, recover an ordinary stop in order and know when to stop recovering and escalate, write
  a log entry the next shift can act on, and put all of it onto a one-page shift card.
Artefact: The shift card for one cell: Start, Normal, Recover, Escalate and who to call,
  Hand over, and the Site procedure reference.
Record sentence: Wrote and signed a one-page shift card for one robotic cell that a new operator
  could follow after being shown the cell; the record does not authorise anyone to operate a
  machine and is not a site procedure.
Lessons (id, title, move, interaction, pass rule):
  1. start-of-shift, Start of shift, order the start so each step protects the next.
     Practice: mark (Checked before it was relied on / Relied on before it was checked), every
     sentence right. Check: order, the six steps in the taught sequence.
  2. what-normal-looks-like, What normal looks like, write normal as ranges and observations.
     Practice: edit, the vague description must gain a cycle time, a stop count per shift, and
     an observation, and keep the cell name. Check: choose, Description B.
  3. drift, Drift before a stop, compare each reading with written normal.
     Practice and check: mark (Normal for this cell / Drift worth noting), every reading right.
  4. recover-then-escalate, Recover, then escalate, recover in order and know the triggers.
     Practice: mark (Recover / Escalate), every stop right. Check: order, the six recovery steps.
  5. the-log-entry, The log entry, write the four facts.
     Practice: edit, the entry must gain a time, what happened, what was done, and the state of
     the cell, and keep the gripper. Check: choose, Entry B.
  6. running-the-whole-shift, Running the whole shift, apply every move to new situations.
     Practice: choose. Check: scenario, six questions, pass mark five.
  7. the-shift-card, The shift card, write the artefact.
     Practice: choose, Draft A. Check: build, six fields, each with an `any` list or a rule, and a `missing` sentence.
Sources:
  UK Health and Safety Executive, web guidance on industrial robots.
  UK Health and Safety Executive, Safe use of work equipment (L22).
  UK Health and Safety Executive, human factors guidance on shift handover and safety-critical
  communication.
  UK Health and Safety Executive, guidance on safe maintenance and isolation.
  ISO 10218-2, the safety standard for industrial robot systems and cells (named as reading only).
  The robot controller manufacturer's operating manual, the authority on what a message means.
Tested on phone:          no
Tested returning learner: no
Pass rule tests written:  yes
*/

import type { CourseContent } from "./types.ts";

const BEFORE = "Checked before it was relied on";
const RELIED = "Relied on before it was checked";
const NORMAL = "Normal for this cell";
const DRIFT = "Drift worth noting";
const RECOVER = "Recover";
const ESCALATE = "Escalate";

export const COURSE: CourseContent = {
  slug: "running-a-robotic-cell",
  hours: 2.5,
  artefact: {
    lessonId: "the-shift-card",
    title: "The shift card",
    recordLine:
      "Wrote and signed a one-page shift card for one robotic cell that a new operator could follow after being shown the cell; the record does not authorise anyone to operate a machine and is not a site procedure.",
  },
  lessons: [
    {
      id: "start-of-shift",
      title: "Start of shift",
      emphasis: "Start",
      place:
        "This is the first of seven lessons and the first module of the course. It covers the routine between arriving at the cell and running production, which becomes the first section of the shift card you write at the end.",
      sections: [
        {
          heading: "What the start of shift is for",
          paragraphs: [
            "The start of shift is the routine you carry out between arriving at the cell and running it at full rate. Its purpose is simple to state and easy to lose under pressure: it makes sure the cell is in the state you think it is before you rely on it. The last shift may have changed a tip, cleared a jam, swapped a gripper finger, or left a warning in the log. None of that is visible from the panel, and all of it matters to the next hour of production.",
            "This course assumes you have already been authorised by your employer to operate the cell and have been shown its controls and its site procedures. Nothing here replaces the manufacturer's training or your site's written procedure. The course teaches you how to run a shift well and how to write it down, so that the routine is the same on a quiet Tuesday as it is on a Friday when the supervisor is asking for output.",
          ],
        },
        {
          heading: "The order, and why each step protects the next",
          paragraphs: [
            "A good start of shift follows a set order. First, read the handover and the log from the last shift. Second, walk round the outside of the cell and look at the guarding, the gates, and the light curtains for damage or for anything that looks bypassed. Third, confirm that the emergency stops are unobstructed, and test them if your site procedure says the operator does so at the start of shift. Fourth, check the consumables the cell needs to run, such as wire, gas, tips, gripper fingers, blanks, film, or pallets. Fifth, confirm that the correct robot program and part number are selected. Sixth, run one part and check it, often called a first-off check, before you run at full rate.",
            "The order is not arbitrary. Each step makes the following one safe to rely on. The log comes first because a warning from the last shift is only useful if you read it before you act; if the night shift noted that the wire feeder slipped, you want to know that before you check the wire, not after twenty frames have been welded. The walk-round comes before anything runs because the guarding is what protects you while the cell moves. The consumables and the program come before the first part because the first part is only a fair test of a cell that is ready. The first-off check comes last because it is the proof that everything before it was right.",
          ],
          beforeAfter: {
            before:
              "Selected the program, started the cell, and read the log while the first parts ran.",
            after:
              "Read the log, walked the guarding, confirmed the emergency stops were clear, checked the consumables, confirmed the program, and ran one part to check before running at rate.",
            reading:
              "In the first version the cell was relied on before anyone knew what the last shift had seen. In the second, every step was checked before the next one depended on it.",
          },
        },
        {
          heading: "Two labels for a start of shift",
          paragraphs: [
            "In this lesson you will read descriptions of real starts and judge each action with one of two labels. An action is Checked before it was relied on when the operator looked at something before a later step depended on it, for example reading the log before checking the wire, or walking the guarding before starting the cell. That is the start of shift working as intended.",
            "An action is Relied on before it was checked when a step depended on something nobody had yet looked at, for example running parts before confirming the program, or starting the cell and reading the log while it runs. The action itself may have been harmless on the day. The label is about the order, because the order is what protects you on the day it is not harmless.",
          ],
        },
        {
          heading: "What the start of shift is not",
          paragraphs: [
            "The start of shift is not the time to change settings. If the first part is out of tolerance, if the gate interlock cover is cracked, or if the program list shows a revision you do not recognise, the procedure is to stop and escalate, not to adjust. An operator who changes a weld parameter or a position to get the first part through has changed the cell without telling anyone, and the next shift will inherit a cell that is not the one on the drawing.",
            "The mistake people most often make is to treat the start as a formality once the cell has run well for a few weeks. The steps shrink to a glance at the panel and a press of the start button. The start of shift exists for the morning when something has changed, and you cannot tell in advance which morning that is. The routine only works if it is the same every time.",
          ],
        },
      ],
      workedExample: {
        title: "Two starts on a robotic welding cell",
        inputLabel: "Monday's start, as the operator described it",
        prompt:
          "I selected the program, started the cell, and then read the log while the first frames were welding. The log said the wire feeder had slipped at the end of the night shift.",
        outputLabel: "Tuesday's start, as the operator described it",
        output:
          "I read the log first. It said the torch tip had been changed at 05:00. I walked the guarding and found the loading door interlock cover cracked, which I reported before starting. I confirmed the emergency stops were clear. I checked the wire and gas. I selected the program for frame 7702, ran one frame, and checked the welds against the inspection card before running at rate.",
        reading: [
          "On Monday the operator relied on the cell before checking it. The first several frames were welded with a feeder that the last shift had already warned about, so the warning arrived too late to be useful. Every one of those frames now needs inspecting.",
          "On Tuesday the log was read before anything ran, so the operator knew to watch the new tip. The walk-round found the cracked interlock cover before anyone relied on that door, and the report went in before production started rather than after an incident.",
          "The Tuesday start took a few minutes longer. It also ended with a first frame checked against the inspection card, which is the evidence that the cell was ready. That is the difference the order makes.",
        ],
      },
      practice: {
        intro:
          "Here is how a cell leader described the start of shift on a palletising cell. Mark each action with the labels from this lesson. The section on the two labels is still above if you want to read it again.",
        check: {
          kind: "mark",
          prompt:
            "Mark each action to show whether it was checked before it was relied on, or relied on before it was checked.",
          passLabel: BEFORE,
          failLabel: RELIED,
          sentences: [
            {
              id: "log",
              text: "I read the handover note from nights before I touched the panel.",
              fail: false,
              why: "The handover was read before any later step depended on it, so it was checked before it was relied on.",
            },
            {
              id: "film",
              text: "I started the cell and then went to see whether there was enough stretch film on the wrapper.",
              fail: true,
              why: "The cell was already running before anyone checked the film it needs, so the film was relied on before it was checked.",
            },
            {
              id: "program",
              text: "I confirmed the program for the 12-case layer pattern before running the first pallet.",
              fail: false,
              why: "The program was confirmed before the first pallet depended on it, so this was checked before it was relied on.",
            },
          ],
          why: "That is right. Reading the handover and confirming the program came before the steps that depend on them, while the film was checked only after the cell was already relying on it.",
        },
      },
      check: {
        kind: "order",
        prompt:
          "You are starting a shift on a robotic machine-tending cell that loads blanks into a lathe. Put these start-of-shift steps in the order this lesson taught, so that each step protects the next.",
        steps: [
          { id: "log", label: "Read the handover and the log from the last shift." },
          { id: "guarding", label: "Walk round the cell and look at the guarding, gates, and light curtains." },
          { id: "estops", label: "Confirm the emergency stops are unobstructed." },
          { id: "consumables", label: "Check the gripper and the infeed of blanks." },
          { id: "program", label: "Confirm the correct program and part number are selected." },
          { id: "first-off", label: "Run one part and check it before running at rate." },
        ],
        correct: ["log", "guarding", "estops", "consumables", "program", "first-off"],
        why: "Yes. You read what the last shift said, made sure the protection was intact, checked what the cell needs to run, confirmed what it will run, and checked the first part before relying on it. Your start of shift makes sure the cell is in the state you think it is before you run it at rate.",
        wrong:
          "Not that order yet. Look first at where reading the log sits: a warning from the last shift is only useful if you read it before you act, so it goes at the top. Then check that the guarding is looked at before anything runs, and that the program is confirmed before the first part. Each check in the start of shift makes the following one safe to rely on.",
      },
      bridge:
        "Once the cell is running you need to know what normal looks like for it, which is the next lesson.",
    },
    {
      id: "what-normal-looks-like",
      title: "What normal looks like",
      emphasis: "normal",
      place:
        "This lesson opens the second module. It teaches you to write down what normal looks like for your cell, which becomes the second section of the shift card.",
      sections: [
        {
          heading: "Normal is a range you can write down",
          paragraphs: [
            "Normal is the range of readings and observations your cell shows when it is running well. It includes numbers, such as the cycle time, the parts per hour, the number of stops in a shift and their usual causes, the first-pass yield, and the scrap count. It also includes observations, such as the sound of the cell, the look of a good part, and the alarms that appear routinely and mean little.",
            "Normal is not a single perfect number. The cycle time on the program sheet is a target set by the engineer who wrote the program, and a real cell runs a little either side of it depending on the parts, the material, and the shift. Written normal is a range, such as 42 to 45 seconds a part, and it is specific to your cell, your parts, and your shift. The palletising cell next door has its own normal, and so does yours on the night shift if the product mix is different.",
          ],
        },
        {
          heading: "Numbers and observations",
          paragraphs: [
            "Numbers let two people agree. If normal is one to three stops a shift and there have been five by lunchtime, nobody needs to argue about whether the cell is having a bad day. Write the number as a range, write its unit, and for stops write the usual cause beside the count, because three stops for a skewed case and three stops for a lost gripper vacuum are different shifts.",
            "Observations catch what the numbers miss. An experienced operator hears a double click at the chuck, sees a weld bead that has gone slightly flatter, or notices that a routine warning has not appeared at all. Those things usually change before the numbers do. Write them in the words you would use to tell a colleague, such as 'a smooth whirr and a single click as the chuck closes', so that someone new knows what to listen for.",
          ],
          beforeAfter: {
            before: "It runs fine most of the time.",
            after:
              "Cycle: one case every 5 to 6 seconds. Stops: two to four a shift, mostly a case skewed on the infeed. Sound: a steady rhythm; a clunk at the gripper means a case was gripped off-centre.",
            reading:
              "The first version cannot tell a new operator anything. The second tells them what to expect, and therefore what to notice when it changes.",
          },
        },
        {
          heading: "Where normal comes from",
          paragraphs: [
            "You learn normal from three places. The cell's records give you the numbers: the shift reports, the stop log, and the quality records show what the cell has done on ordinary days. Experienced colleagues give you the observations, because they have heard the cell on good days and bad ones. Watching the cell yourself on a good day ties the two together.",
            "Where you do not yet know a range, say so on the page. Writing 'scrap: to be found from the quality records, ask Wendy in quality' is honest and useful, because it tells the next person where the gap is and who can fill it. Guessing a number and writing it down as if it were measured is worse than leaving the line open, because people will act on it.",
          ],
        },
        {
          heading: "Why it matters, and the usual mistake",
          paragraphs: [
            "Writing normal down matters because without it, people only notice a problem when the cell stops. By then the scrap has been made, the tooling may be damaged, or someone has had a near miss. A written normal lets anyone on the shift notice a change while there is still time to act on it.",
            "The usual mistake is to describe normal in words that mean something different to every reader: well, fine, now and then, nothing serious. Those words feel like a description, and they are useless to a new operator on their first night. The test for a description of normal is whether someone who has never seen the cell could use it to notice a change.",
          ],
        },
      ],
      workedExample: {
        title: "Writing down normal for a palletising cell",
        inputLabel: "What the cell leader said at first",
        prompt: "It runs fine most of the time.",
        outputLabel: "What the cell leader wrote on the card",
        output:
          "Cycle: one case every 5 to 6 seconds. Pallets: about 28 per shift. Stops: usually two to four per shift, mostly a case skewed on the infeed conveyor. Wrap: film tight, no tails. Sound: a steady rhythm; a clunk at the gripper means a case has been gripped off-centre. Routine alarm: low film warning about twice a shift, which is normal.",
        reading: [
          "The numbers belong to this cell. The cycle and the pallet count are ranges taken from the shift reports, and the stop count comes with its usual cause, so a stop for any other reason stands out at once.",
          "The observations are written the way you would say them aloud. 'Film tight, no tails' tells a new operator what a good pallet looks like, and the clunk at the gripper tells them what to listen for.",
          "The routine alarm is on the card on purpose. A new operator who sees the low film warning will know it is expected twice a shift, and will also notice if it starts appearing every hour.",
        ],
      },
      practice: {
        intro:
          "Here is the description of normal that a cell leader wrote for Cell 4, a machine-tending cell at Tregarth Precision. Rewrite it so that a new operator could use it. Add a cycle time in seconds, a stop count per shift, and at least one thing you would hear or see. Keep the name of the cell.",
        check: {
          kind: "edit",
          prompt:
            "Edit this description of normal so that it gives a cycle time, a stop count per shift, and at least one observation. You can use your own cell's numbers if you prefer.",
          label: "The description of normal you are rewriting",
          start: "Normal for Cell 4: it runs fine, the parts are good, and it stops now and then.",
          unchanged:
            "You have not changed the description yet. Replace 'runs fine' and 'now and then' with a cycle time in seconds and a count of stops per shift.",
          keep: [
            {
              id: "cell",
              any: ["cell 4"],
              missing: "Keep the name of the cell, Cell 4, so the reader knows which cell this normal belongs to.",
            },
          ],
          limitWording: false,
          limits: [
            {
              id: "cycle",
              any: ["second", "secs", "per hour", "an hour", "a minute", "per minute"],
              missing:
                "Your description has no cycle time yet. Add one as a range with its unit, for example 42 to 45 seconds a part.",
            },
            {
              id: "stops",
              any: ["per shift", "a shift", "each shift", "every shift", "in a shift"],
              missing:
                "Your description has no stop count yet. Say how many stops are usual per shift and what usually causes them.",
            },
            {
              id: "observation",
              any: ["sound", "hear", "noise", "click", "whirr", "clunk", "look", "see", "shiny", "colour", "alarm", "warning"],
              missing:
                "Your description has no observation yet. Add something you would hear or see when the cell is running well, such as the sound of the chuck closing or a routine alarm.",
            },
          ],
          why: "That description works. It gives the cycle time as a range with a unit, the usual stops per shift, and something a person would hear or see, so a new operator on Cell 4 could tell when something changes.",
          result: {
            label: "A description of normal a new operator could use",
            text: "Normal for Cell 4: cycle 42 to 45 seconds a part. One to three stops a shift, usually a blank not seated on the infeed. A smooth whirr and a single click as the chuck closes. Coolant low warning about once a shift.",
          },
        },
      },
      check: {
        kind: "choose",
        prompt:
          "Two cell leaders have written down what normal looks like for a robotic machine-tending cell. Choose the description a new operator could use to notice a change.",
        leftLabel: "Description A",
        left: "Normally it runs well and the parts come out fine. It stops now and then, but nothing serious.",
        rightLabel: "Description B",
        right:
          "Cycle: 42 to 45 seconds per part. Stops: one to three per shift, usually a blank not seated on the infeed. Quality: first-off part checked against the gauge at the start of each batch; scrap usually no more than two parts a shift. Sound: a smooth whirr and a click as the chuck closes; a double click means the chuck has re-gripped. Routine alarm: coolant low, about once a shift, which is normal.",
        correct: "right",
        why: "Yes. Description B gives numbers as ranges, the usual causes of stops, and the observations a person would notice, so a new operator can tell when something changes. You chose the description of normal written as ranges and observations, which is what lets anyone notice drift.",
        wrong:
          "Look again at Description A. It uses words such as well, fine, and now and then, which mean something different to every reader, and it has no numbers and no observations. Choose the description with ranges and things you would see or hear.",
      },
      bridge:
        "Once normal is written down, you can see a reading start to move away from it. The next lesson teaches you to spot that drift before it becomes a stop.",
    },
    {
      id: "drift",
      title: "Drift before a stop",
      emphasis: "Drift",
      place:
        "This lesson completes the second module. You have written down normal, and now you read the cell's numbers and observations against it during a shift.",
      sections: [
        {
          heading: "What drift is",
          paragraphs: [
            "Drift is a steady move away from normal that has not yet caused a stop. A cycle time that creeps up by a second over the shift is drift. So is a stop for the same cause that comes round more often each hour, a weld bead that gradually changes shape, a gripper that needs two attempts more often than it used to, or a tip that wears out in half its usual time.",
            "Drift matters because it gives you time. A cell that is drifting is usually telling you what will stop it later: a worn part, a fixture that has moved, a batch of blanks that is slightly out, or an infeed that has lost its alignment. Noticed early, drift is a note in the log and a word with the engineer. Missed, it becomes a stop, a pile of scrap, or damage to tooling.",
          ],
        },
        {
          heading: "Two labels for every reading",
          paragraphs: [
            "In this course a reading is Normal for this cell when it is inside the range you wrote down in the last lesson. A cycle of 97 seconds against a normal of 95 to 100 is normal for this cell, and so is a third stop for the usual cause when normal is two to four.",
            "A reading is Drift worth noting when it is outside that range, or when it is still inside but moving steadily towards the edge. Three readings of 99, 101, and 103 seconds are drift worth noting, because each is higher than the last and the latest two have left the range. So is a tip that needs changing after two hours when the card says four.",
          ],
          beforeAfter: {
            before: "Cycle 99 seconds at 10:00, 101 at 11:00, 103 at 12:00. The cell has not stopped, so nothing to report.",
            after:
              "Cycle 99 seconds at 10:00, 101 at 11:00, 103 at 12:00. Drift worth noting: logged at 12:05 and told the shift engineer.",
            reading:
              "The first version waits for a stop before anything is said. The second uses the written normal to see the trend while there is still time to act on it.",
          },
        },
        {
          heading: "What drift is not",
          paragraphs: [
            "Drift is not the same as a single odd reading. One slow cycle can happen for an ordinary reason, such as a blank that took a moment longer to seat, and it does not make a trend. What makes drift is direction and repetition: the same reading moving the same way, or the same event coming round more often.",
            "Drift is also not a reason to change settings yourself. If the cycle is creeping up, the answer is not to raise the speed on the pendant, and if the vacuum is falling, the answer is not to turn up the set point. Changing the cell hides the symptom and leaves the cause in place. Drift is a reason to note it in the log and, if it continues, to tell the person named on the shift card.",
          ],
        },
        {
          heading: "The usual mistake",
          paragraphs: [
            "The usual mistake is to read each number on its own and ask only whether it is bad enough to stop the cell. Each of 99, 101, and 103 seconds looks tolerable on its own. Read together and against the written normal, they are a clear trend. Compare every reading with the range on the card, and compare it with the reading before.",
            "The second mistake is to notice drift and keep it to yourself because nothing has gone wrong yet. The value of seeing drift is that someone can act on it before the stop, and that only happens if it is written in the log and passed on.",
          ],
        },
      ],
      workedExample: {
        title: "Mid-shift readings on the palletising cell",
        inputLabel: "The readings at mid-shift",
        prompt:
          "Cycle 5.5 seconds. 14 pallets. Three stops, all skewed cases. Film tight. One low film warning. Gripper has clunked about ten times in the last hour, usually once or twice an hour.",
        outputLabel: "How the cell leader marked them",
        output:
          "Cycle: normal for this cell. Pallets: normal for this cell at mid-shift. Stops: normal for this cell. Film: normal for this cell. Low film warning: normal for this cell. Gripper clunks: drift worth noting, because the rate has gone well above normal.",
        reading: [
          "Each reading was compared with the normal written in the last lesson. The cycle, the pallet count, the stops, the film, and the routine warning are all inside their ranges, so they are normal for this cell.",
          "The clunks are the one observation outside normal. Ten in an hour against a usual one or two suggests cases are being gripped off-centre much more often, which could lead to a dropped case and a stop.",
          "The cell leader did not change anything on the cell. She logged the clunk rate and asked the shift engineer to look at the infeed alignment before it became a stop.",
        ],
      },
      practice: {
        intro:
          "A robotic assembly cell at Carrow Components has this normal: cycle 30 to 32 seconds, one or two stops per shift for a screw not presented, and a torque reject rate of about one part an hour. Mark each reading from this morning. The two labels are defined in the section above.",
        check: {
          kind: "mark",
          prompt: "Mark each reading as Normal for this cell or as Drift worth noting.",
          passLabel: NORMAL,
          failLabel: DRIFT,
          sentences: [
            {
              id: "cycle",
              text: "Cycle 31 seconds.",
              fail: false,
              why: "31 seconds is inside the 30 to 32 second range, so it is normal for this cell.",
            },
            {
              id: "torque",
              text: "Torque rejects: one at 08:00, two at 09:00, four at 10:00.",
              fail: true,
              why: "The reject count is rising each hour and has left the usual one an hour, so it is drift worth noting.",
            },
            {
              id: "screw",
              text: "One stop so far, a screw not presented.",
              fail: false,
              why: "One stop for the usual cause is inside the range for this cell, so it is normal.",
            },
          ],
          why: "That is right. The cycle and the single stop are inside normal, and the torque rejects are rising steadily and have left the range, which is drift worth noting.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "A robotic welding cell's normal is: cycle 95 to 100 seconds, two to four stops per shift, first-pass yield above the level on the inspection card, and tip changes every four hours. Mark each reading from this shift.",
        passLabel: NORMAL,
        failLabel: DRIFT,
        sentences: [
          {
            id: "cycle",
            text: "Cycle 97 seconds.",
            fail: false,
            why: "97 seconds is inside the range written for this cell, so it is normal for this cell.",
          },
          {
            id: "rising",
            text: "Cycle 99 seconds at 10:00, 101 at 11:00, 103 at 12:00.",
            fail: true,
            why: "Each reading is higher than the last and the latest two are outside the range. A steady move away from normal is drift worth noting.",
          },
          {
            id: "stops",
            text: "Three stops so far, all for a part not seated in the fixture.",
            fail: false,
            why: "Three stops is inside the range for this cell, so it is normal, although you would note it if the count kept rising.",
          },
          {
            id: "tip",
            text: "The tip needed changing after two hours, not four.",
            fail: true,
            why: "Tip changes are normally every four hours. Needing one after two is outside normal, so it is drift worth noting.",
          },
        ],
        why: "You compared each reading with the cell's written normal and found the ones moving away from it. The single cycle and the stop count are inside their ranges, while the rising cycle and the tip wearing twice as fast are drift worth noting.",
      },
      bridge:
        "Drift that is missed becomes a stop. The next lesson teaches you to recover an ordinary stop in order, and to know when to stop recovering and escalate instead.",
    },
    {
      id: "recover-then-escalate",
      title: "Recover, then escalate",
      emphasis: "escalate",
      place:
        "This is the third module. It covers what you do when the cell stops, and when you hand the problem to someone else, which becomes the recovery and escalation sections of the shift card.",
      sections: [
        {
          heading: "The recovery order",
          paragraphs: [
            "When the cell stops for an ordinary reason, the recovery follows a set order. Read the message on the panel and note the time. Look from outside the cell to find the cause. If the cause can be cleared without entering the cell, or by entering only in the way your site procedure allows, clear it. Check that nobody is inside the cell and that the gates are closed. Reset as the procedure says. Restart and watch the next full cycle.",
            "Each step has a reason. You note the time because the log and the escalation limit both depend on it. You look from outside because you cannot clear a cause you have not found, and because the first look should not put you inside a cell that may still hold energy. You check the cell is clear before resetting because a reset can bring the robot back into motion. You watch the next full cycle because a stop that recurs at once was not recovered.",
          ],
        },
        {
          heading: "When you escalate instead",
          paragraphs: [
            "You escalate instead of recovering when any of these is true: the same stop has happened several times this shift; clearing the cause would mean changing the program, the positions, or any safety setting; entering the cell would need an isolation that you are not authorised to do; there is damage to the robot, the tooling, the cables, or the guarding; anyone was hurt or nearly hurt; the robot moved unexpectedly; or you do not understand the message. The manufacturer's manual for your controller is the authority on what a message means, and not understanding one is a reason to ask, not to guess.",
            "The number of repeats that means several should be written on your shift card as a number, agreed with your cell leader, such as the third repeat of the same stop. Without a number, every operator decides for themselves, and the usual result is an hour of recovering the same stop because each recovery on its own seemed reasonable.",
          ],
        },
        {
          heading: "Two labels for a stop",
          paragraphs: [
            "In this lesson you will judge each stop with one of two labels. A stop is one to Recover when it has an ordinary cause you can find from outside, it can be cleared without entering the cell or by entering only as the site procedure allows, and none of the escalation triggers applies.",
            "A stop is one to Escalate when any trigger applies: it is a repeat at or beyond the number on your card, clearing it would change the program, a position, or a safety setting, it needs an isolation you are not authorised to do, there is damage, someone was hurt or nearly hurt, the robot moved unexpectedly, or you do not understand the message. Escalating means leaving the cell stopped in a safe state and calling the person named on the card for your shift.",
          ],
          beforeAfter: {
            before:
              "Third stop for the gripper failing to close. Recovered it again, as the last two went fine.",
            after:
              "Third stop for the gripper failing to close. That is our limit on the card, so I left the cell stopped and called the shift engineer at 11:22.",
            reading:
              "The first version treats each stop on its own. The second uses the number on the card, which is what turns a pattern into an escalation.",
          },
        },
        {
          heading: "Escalating is part of running the cell",
          paragraphs: [
            "Escalating is part of running the cell, not a failure to run it. An operator who calls the engineer on the third repeat has done the job the card asks for, and has given the engineer a clear pattern to work from. An operator who keeps recovering has kept the cell running for a little longer and left the cause in place.",
            "The usual mistake is to treat a good recovery as the end of the matter. Each recovery can be done perfectly and the shift can still go wrong, because the pattern across recoveries is what shows the cause. The second mistake is to fix the cause yourself by changing a position or a parameter on the pendant because a colleague has seen it work. That is a change to the cell, and it belongs to someone authorised to make it.",
          ],
        },
      ],
      workedExample: {
        title: "A repeated stop on a machine-tending cell",
        inputLabel: "What the operator logged",
        prompt:
          "10:40, stop, gripper failed to close. I opened the gate and pushed the part back into position, closed the gate, reset, and it ran. 11:05, same. 11:20, same. 11:35, same, and I did it again.",
        outputLabel: "How the shift should have gone",
        output:
          "10:40, gripper failed to close. From outside the cell I could see the part was not fully seated on the infeed. I opened the gate following the procedure, reseated it, checked nobody was inside, closed the gate, reset, and watched the next cycle. 11:05, same stop, same cause. Recovered as before. 11:20, same stop for the third time, which is our limit on the shift card, so I called the shift engineer at 11:22.",
        reading: [
          "In the first version the operator went straight into the cell without looking from outside, and never checked that the cell was clear before resetting. The recoveries worked, but they were not done in order.",
          "In the second version each recovery follows the order: message and time, the cause found from outside, cleared as the procedure allows, the cell checked clear, reset, and the next cycle watched.",
          "The escalation limit on the shift card is what stopped the pattern turning into an hour of repeated recoveries. The engineer was called with three timed stops and a cause, which is a far better starting point than a cell that has been nudged back into running four times.",
        ],
      },
      practice: {
        intro:
          "The shift card for a robotic welding cell at Hollin Fabrications says to escalate on the third repeat of any stop. Mark each stop from this shift with the two labels defined above.",
        check: {
          kind: "mark",
          prompt: "Mark each stop as one to Recover or one to Escalate.",
          passLabel: RECOVER,
          failLabel: ESCALATE,
          sentences: [
            {
              id: "wire",
              text: "09:15, first 'wire stick' stop of the shift; from outside you can see the wire has stuck to the joint, and the procedure lets you clear it through the interlocked gate.",
              fail: false,
              why: "This is the first stop, the cause is visible from outside, and the procedure allows you to clear it, so it is one to recover.",
            },
            {
              id: "motion",
              text: "10:30, the robot moved towards the loading station before the light curtain had cleared.",
              fail: true,
              why: "The robot moved unexpectedly, which is always a trigger, so this is one to escalate.",
            },
            {
              id: "unknown",
              text: "11:50, a message code you have not seen before appears and the cell will not reset.",
              fail: true,
              why: "You do not understand the message, which is a trigger, so this is one to escalate rather than one to guess at.",
            },
          ],
          why: "That is right. The first wire stick is an ordinary stop you can recover, while unexpected motion and a message you do not understand are both triggers to escalate.",
        },
      },
      check: {
        kind: "order",
        prompt:
          "A palletising cell has stopped with the message 'case not detected at gripper'. It is the first stop of the shift and none of the escalation triggers applies. Put these recovery steps in the order this lesson taught.",
        steps: [
          { id: "message", label: "Read the message on the panel and note the time." },
          { id: "look", label: "Look from outside the cell to find the cause." },
          { id: "clear", label: "Clear the cause as the site procedure allows." },
          { id: "empty", label: "Check nobody is inside and the gates are closed." },
          { id: "reset", label: "Reset as the procedure says." },
          { id: "watch", label: "Restart and watch the next full cycle." },
        ],
        correct: ["message", "look", "clear", "empty", "reset", "watch"],
        why: "Yes. You found the cause before clearing it, made sure the cell was clear and closed before resetting, and watched the next cycle. Your recovery finds and clears the cause, checks the cell is clear, and only then resets and restarts.",
        wrong:
          "Not that order yet. Check first whether you reset before finding the cause, because the cell will usually stop again for the same reason. Then check whether the cell restarts before you have confirmed that nobody is inside and the gates are closed. You cannot clear a cause you have not found, and you should not reset a cell you have not checked is clear.",
      },
      bridge:
        "Every stop, drift, and escalation has to reach the next shift. The next lesson teaches you to write it down in a log entry they can act on.",
    },
    {
      id: "the-log-entry",
      title: "The log entry",
      emphasis: "log",
      place:
        "This lesson prepares the handover section of the shift card. The log is the first thing the next shift reads at their start of shift, so what you write here is what their first lesson depends on.",
      sections: [
        {
          heading: "What a log entry is",
          paragraphs: [
            "A log entry is a short written record of an event during the shift: a stop, a drift, an escalation, a change of consumable, or anything the next shift should know. Your site may keep it in a paper book at the cell, on the panel, or in a shift system. The format matters less than what goes in it.",
            "A useful entry has four facts. The first is the time. The second is what happened, in terms of the message on the panel and what you saw. The third is what you did, including anything you escalated and to whom. The fourth is the state the cell was left in. If any of the four is missing, the next shift has to guess, and they will be guessing at the start of shift, which is the moment the log exists to support.",
          ],
          beforeAfter: {
            before: "Gripper playing up again. Sorted it.",
            after:
              "11:20, third 'gripper failed to close' stop this shift, part not seated on infeed each time. Called Sam, shift engineer, at 11:22. Sam adjusted the infeed guide at 11:40. Cell running normally at handover.",
            reading:
              "The first version says there was a problem and nothing else. The second gives the time, what happened, what was done and who knows, and the state of the cell.",
          },
        },
        {
          heading: "What a log entry is not",
          paragraphs: [
            "A log entry is not a diary and it is not an opinion about the cell or a colleague. 'Annoying' and 'nights left it in a state again' tell the next shift how you felt, and nothing they can act on. Write what you saw and what you did, in plain words, and leave judgement about people to the conversation with your cell leader.",
            "A log entry is also not the same as a report of an injury or a near miss. Those follow your site's own reporting procedure as well as appearing in the log. Writing it in the log alone means the people who investigate near misses may never see it, and writing the report alone means the next shift may start without knowing it happened.",
          ],
        },
        {
          heading: "Writing for the person who reads it next",
          paragraphs: [
            "The reader of your entry is the operator who arrives after you. They were not there, they may not have run this cell for a week, and they will read the log before they walk the guarding. Write so that they could carry on without phoning you. Include the name and role of anyone you told, because the next shift may need to follow up with the same person.",
            "Add one line on what to watch when there is something worth watching. 'Watch the infeed guide' or 'new tip fitted at 05:00, check the first frames closely' turns your entry into something the next shift will use in their first ten minutes.",
          ],
        },
        {
          heading: "The usual mistake",
          paragraphs: [
            "The usual mistake is to write the entry after the event has been fixed, when it no longer feels important, and to leave out what you did and the state you left the cell in. 'Sorted it' tells the next shift nothing about whether the fix was a reseat, a change by the engineer, or a hope that it would not come back.",
            "The second mistake is to leave the state at handover unsaid because the cell is running. Running normally, running with a known issue to watch, and stopped awaiting the engineer are three different starts for the next shift, and only the log can tell them which one they have.",
          ],
        },
      ],
      workedExample: {
        title: "Two entries about the same stop",
        inputLabel: "Entry one",
        prompt: "Gripper playing up again. Sorted it.",
        outputLabel: "Entry two",
        output:
          "11:20, third 'gripper failed to close' stop this shift, part not seated on infeed each time. Recovered twice, then called Sam, shift engineer, at 11:22. Sam adjusted the infeed guide at 11:40. No repeat since. Cell running normally at handover. Watch the infeed guide.",
        reading: [
          "Entry one tells the next shift there was a problem and nothing else. It gives no time, no message, no cause, no action they could check, and no state at handover.",
          "Entry two gives all four facts: the time, what happened with its message and cause, what was done and who was told, and the state of the cell at handover.",
          "The last line, watch the infeed guide, is what the next operator will act on during their own start of shift. It costs five words and saves them from finding the problem again for themselves.",
        ],
      },
      practice: {
        intro:
          "Rewrite entry one from the worked example so that it gives the four facts. You can use the details from the worked example or from a recent shift on your own cell.",
        check: {
          kind: "edit",
          prompt:
            "Edit this log entry so that it gives the time, what happened, what you did and who you told, and the state the cell was left in. Keep the gripper in the entry.",
          label: "The log entry you are rewriting",
          start: "Gripper playing up again. Sorted it.",
          unchanged:
            "You have not changed the entry yet. Start with the time, and say what the message was and what you saw.",
          keep: [
            {
              id: "gripper",
              any: ["gripper"],
              missing: "Keep the gripper in the entry, so the next shift knows which part of the cell was involved.",
            },
          ],
          limitWording: false,
          limits: [
            {
              id: "time",
              any: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
              missing: "Your entry has no time yet. Start it with the time of the stop, for example 11:20.",
            },
            {
              id: "happened",
              any: ["stop", "failed", "message", "fault", "alarm", "not seated"],
              missing:
                "Your entry does not yet say what happened. Give the message on the panel or the stop you saw, for example 'gripper failed to close'.",
            },
            {
              id: "did",
              any: ["reseat", "recovered", "called", "told", "adjusted", "cleared", "escalated", "rang"],
              missing:
                "Your entry does not yet say what you did. Say how you recovered it, and whether you called or told anyone.",
            },
            {
              id: "state",
              any: ["running", "stopped", "at handover", "left the cell", "cell left"],
              missing:
                "Your entry does not yet say what state the cell was left in. Add whether it was running normally, running with something to watch, or stopped.",
            },
          ],
          why: "That entry works. It gives the time, what happened, what you did and who you told, and the state of the cell, so the next shift could act on it without phoning you.",
          result: {
            label: "An entry the next shift can act on",
            text: "11:20, third 'gripper failed to close' stop this shift. Called Sam, shift engineer, at 11:22, and he adjusted the infeed guide. Cell running normally at handover.",
          },
        },
      },
      check: {
        kind: "choose",
        prompt:
          "Two log entries have been written about a scanner stop on a robotic assembly line. Choose the entry the next shift could act on.",
        leftLabel: "Entry A",
        left: "Scanner kept stopping it. Annoying. Someone should look at it.",
        rightLabel: "Entry B",
        right:
          "14:10 to 15:30, six protective stops from the area scanner, each when a trolley was parked by the parts rack. Moved the trolleys and marked a no-parking area with tape. Told Jo, cell leader, at 15:35, and it goes to the cell review. No stops since 15:30. Running normally at handover.",
        correct: "right",
        why: "Yes. Entry B gives the time, what happened, what was done and who was told, and the state at handover. You chose the entry with the four facts, which is the one the next shift can act on.",
        wrong:
          "Look again at Entry A. It gives a feeling and a wish, but not when it happened, what caused it, what was done, or the state the cell was left in. Choose the entry with the four facts.",
      },
      bridge:
        "You have now practised every move a shift needs. The next lesson brings them together in an assessment set in situations you have not seen.",
    },
    {
      id: "running-the-whole-shift",
      title: "Running the whole shift",
      emphasis: "shift",
      place:
        "This is the course assessment, the second-to-last lesson. It recaps the method from the first five lessons, works one mixed example, and then asks you to apply the method in six new situations.",
      sections: [
        {
          heading: "The method in one shift",
          paragraphs: [
            "A shift on a robotic cell has four parts, and each has a move you have now practised. At the start, you read the log first and then check each thing before anything relies on it: the guarding, the emergency stops, the consumables, the program, and then the first part. While the cell runs, you compare what you see and hear with the normal written for this cell, as ranges and observations rather than impressions.",
            "When a reading moves steadily away from normal, you note it as drift and tell the person named on the card if it continues, without changing settings yourself. When the cell stops, you recover in order: message and time, cause found from outside, cleared as the procedure allows, cell checked clear, reset, and the next cycle watched. When a trigger applies, you stop recovering and escalate. At the end, you write the log entry with its four facts, so the next shift starts from what you knew.",
          ],
        },
        {
          heading: "How the moves depend on each other",
          paragraphs: [
            "The moves are linked. The log you write at the end of your shift is the first thing the next operator reads at their start. The normal you write down is what makes drift visible, and drift you catch is a stop you do not have to recover. The repeat limit on the card is what turns a string of good recoveries into an escalation at the right moment.",
            "That is why the assessment mixes them. A real shift does not arrive one lesson at a time. The question in each situation is which move applies here, and what the course taught about doing it well.",
          ],
        },
        {
          heading: "How the assessment works",
          paragraphs: [
            "The assessment has six situations, each with three or four options. Every option is something a reasonable operator might do, and exactly one is right for a reason the course taught. Read the situation in full before you choose, because the detail that decides the answer is often a number or a single phrase.",
            "You need five of the six to pass. After you submit, each question shows whether your choice was right and the feedback for the option you chose. If you do not pass, the feedback names what to look at again, and you can change your answers and submit once more.",
          ],
        },
      ],
      workedExample: {
        title: "One morning on a spot-welding cell",
        inputLabel: "The operator's notes from the first three hours",
        prompt:
          "06:00, read the log: nights noted the tip was dressed at 04:30. Walked the guarding, all intact. E-stops clear. Caps and air checked. Program 31 for bracket 4410 selected. First-off checked against the peel test card, good. 07:30, cycle 58 seconds, normal is 56 to 60. 08:15, weld current fault, first of the shift; from outside saw a bracket not clamped; cleared through the gate as the procedure allows, checked the cell clear, reset, watched the next cycle. 08:40, same fault. 08:55, same fault, third time.",
        outputLabel: "What the operator did next, and the log entry",
        output:
          "08:55, third weld current fault this shift, bracket not clamped each time. Card limit is the third repeat, so I left the cell stopped and called Anil, shift engineer, at 08:57. Anil found a worn clamp pad on fixture 2 and changed it at 09:20. No repeat since. Cell running normally. Watch fixture 2 clamp pads.",
        reading: [
          "The start of shift was done in order, and the first-off check came last, after everything it depends on. The 07:30 cycle reading was compared with the written normal and found inside it.",
          "The first two faults were recovered in order. On the third, the operator did not recover again, because the card sets the limit at the third repeat. That one decision is what the escalation part of the course is about.",
          "The log entry has all four facts and one line on what to watch. The operator who arrives at 14:00 will read it first and know to look at the clamp pads during their walk-round.",
        ],
      },
      practice: {
        intro:
          "Before the assessment, try one short situation. The method above is still on screen.",
        check: {
          kind: "choose",
          prompt:
            "At 07:10 on a machine-tending cell, the log from nights says 'chuck jaws changed at 05:30, first parts looked fine'. Your first-off part is 0.05 mm over the tolerance on the gauge card. Choose what you do.",
          leftLabel: "Option A",
          left: "Adjust the tool offset on the lathe by 0.05 mm so the next part comes in, and log the change at the end of the shift.",
          rightLabel: "Option B",
          right:
            "Do not run at rate. Leave the cell stopped, tell the shift engineer that the first-off is over tolerance after the jaw change on nights, and log it.",
          correct: "right",
          why: "Yes. The start of shift is not the time to change settings. A first-off that fails after a jaw change is a reason to stop and escalate, and the log gives the engineer the likely cause.",
          wrong:
            "Look again at Option A. Changing the offset is a change to the cell made at the start of shift, which the first lesson said is the time to stop and escalate rather than adjust. Option B leaves the cell stopped and tells the engineer, with the jaw change as the likely cause.",
        },
      },
      check: {
        kind: "scenario",
        prompt:
          "Answer each question with the option that follows the method this course taught. You need five of the six to pass.",
        passMark: 5,
        questions: [
          {
            id: "start-warning",
            situation:
              "Priya Nair arrives at 06:00 to run a spot-welding cell at Hollin Fabrications. The night shift log says the light curtain at station 2 tripped twice without anyone near it. The production supervisor, Mark, wants the first batch of 60 brackets moving by 06:15.",
            question: "What should Priya do first?",
            options: [
              {
                id: "a",
                text: "Select the program and run the first-off so the batch starts on time, and look at the light curtain once it is running.",
                feedback:
                  "That relies on the light curtain before anyone has checked it, and the log has already warned you about it. The guarding is what protects you while the cell moves, so it is walked before anything runs. Read the warning, look at station 2, and report what you find before starting.",
              },
              {
                id: "b",
                text: "Read the log in full, then walk the guarding and look closely at the station 2 light curtain before anything runs, and report any fault she finds.",
                correct: true,
                feedback:
                  "Right. The warning is only useful because Priya read it first, and the walk-round checks the protection before the cell relies on it. The pressure to start by 06:15 does not change the order.",
              },
              {
                id: "c",
                text: "Reduce the light curtain sensitivity on the safety controller so that it stops tripping without cause.",
                feedback:
                  "That is a change to a safety setting, which is always a reason to escalate and never something to do at the start of shift. Read the log, walk the guarding, and report the fault so someone authorised can look at it.",
              },
              {
                id: "d",
                text: "Skip the walk-round this morning, because the night shift would have written down any damage they saw.",
                feedback:
                  "The night shift wrote down that the curtain tripped for no reason, which is exactly why it needs looking at. The walk-round is how you confirm the cell is in the state you think it is. Do it before anything runs.",
              },
            ],
          },
          {
            id: "normal-new-starter",
            situation:
              "Callum starts on the night shift on Cell 6, a machine-tending cell at Tregarth Precision, next Monday. The only description of normal the cell leader, Wendy, can find says 'runs fine, stops now and then'. The shift reports from the last month are in the office.",
            question: "What is the best thing for Wendy to give Callum?",
            options: [
              {
                id: "a",
                text: "A note telling him to call her if anything seems off during the shift.",
                feedback:
                  "Callum has never seen the cell, so he cannot tell what seems off. A new operator needs ranges and observations to compare with. Write normal down from the shift reports and add what you would hear and see.",
              },
              {
                id: "b",
                text: "The target cycle time of 42 seconds from the program sheet, as the number to hold the cell to.",
                feedback:
                  "A target is a single number, and the cell runs a little either side of it on a good night. Callum would see drift on every cycle. Give him the range from the shift reports, the usual stops, and the observations.",
              },
              {
                id: "c",
                text: "A written normal taken from last month's shift reports, with the cycle as a range, the usual stops per shift and their causes, and the sounds and routine alarms she knows from running it.",
                correct: true,
                feedback:
                  "Right. Ranges from the records and observations from experience are what let someone new notice a change. Where a number is unknown, Wendy can say so and name who to ask.",
              },
              {
                id: "d",
                text: "An instruction to watch the panel, because if there is no alarm the cell is running normally.",
                feedback:
                  "Many changes happen before any alarm appears, such as a double click at the chuck or a rising cycle time. That is why normal includes numbers and observations. Give Callum a written normal he can compare with.",
              },
            ],
          },
          {
            id: "drift-vacuum",
            situation:
              "On the palletising cell at Brindle Foods, the shift card gives normal vacuum at the gripper as 0.60 to 0.70 bar. This morning the panel read 0.62 at 09:00, 0.58 at 10:00, and 0.54 at 11:00. The cell has not stopped, and the cycle is 5.5 seconds, inside normal.",
            question: "What should the operator do?",
            options: [
              {
                id: "a",
                text: "Note the falling vacuum in the log as drift, with the three readings and times, and tell the shift engineer named on the card.",
                correct: true,
                feedback:
                  "Right. The readings are moving steadily and have left the range, which is drift worth noting. Logging it and telling the named person gives someone time to act before a dropped case turns it into a stop.",
              },
              {
                id: "b",
                text: "Carry on without comment, because the cell has not stopped and the cycle time is normal.",
                feedback:
                  "A cell that has not stopped can still be drifting. The vacuum has fallen three hours in a row and left its range. Note it in the log and tell the person named on the card while there is still time to act.",
              },
              {
                id: "c",
                text: "Raise the vacuum set point on the panel until the reading is back above 0.60 bar.",
                feedback:
                  "Changing the setting hides the symptom and leaves the cause in place, such as a worn cup or a leaking line. Drift is a reason to note and tell, not to adjust. Log the readings and tell the shift engineer.",
              },
              {
                id: "d",
                text: "Stop the cell at once and call maintenance to change the gripper.",
                feedback:
                  "The value of seeing drift early is that there is time to act without a stop. Stopping the cell yourself turns a drift into a stop, and deciding the gripper needs changing is a judgement for the engineer. Log it and tell the named person.",
              },
            ],
          },
          {
            id: "recover-first-stop",
            situation:
              "At 09:10 a machine-tending cell at Carrow Components stops with the message 'part not detected in chuck'. It is the first stop of the shift. From outside the cell, the operator, Dean, can see a blank lying rotated on the fixture. The site procedure allows him to reseat a blank through the interlocked gate.",
            question: "What should Dean do?",
            options: [
              {
                id: "a",
                text: "Press reset from the panel straight away to see whether it clears.",
                feedback:
                  "Resetting before the cause is cleared means the cell will usually stop again for the same reason, and the blank is still lying rotated. Note the time, clear the cause as the procedure allows, check the cell is clear, then reset.",
              },
              {
                id: "b",
                text: "Call the shift engineer, because a stop is always a job for the engineer.",
                feedback:
                  "This is a first stop with a cause Dean can see and a procedure that allows him to clear it, so none of the triggers applies. Escalating every ordinary stop leaves the engineer unable to respond to the ones that need them. Recover it in order.",
              },
              {
                id: "c",
                text: "Switch the robot to manual and jog it to push the blank back into place.",
                feedback:
                  "Moving the robot by hand to clear a part is a change to how the cell is being run and is not what the procedure allows. The procedure lets Dean reseat the blank through the gate. Recover it that way, in order.",
              },
              {
                id: "d",
                text: "Note the time, reseat the blank through the gate as the procedure allows, check nobody is inside and the gate is closed, reset, and watch the next full cycle.",
                correct: true,
                feedback:
                  "Right. The cause was found from outside, cleared as the procedure allows, and the cell was checked clear before the reset. Watching the next cycle confirms the recovery worked.",
              },
            ],
          },
          {
            id: "escalate-third",
            situation:
              "On a robotic welding cell, Asha has recovered an 'arc start failure' stop at 12:50 and 13:15. It happens again at 13:40. The shift card says to escalate on the third repeat, and the shift engineer, Tom, is on another cell for the next half hour. Her colleague Dean says raising the wire feed speed on the pendant usually fixes it.",
            question: "What should Asha do?",
            options: [
              {
                id: "a",
                text: "Let Dean raise the wire feed speed, since he has seen it work before, and tell Tom when he is free.",
                feedback:
                  "Changing the wire feed speed is a change to the program, which is itself a trigger to escalate. Whether it has worked before does not make it Dean's change to make. Leave the cell stopped and call Tom.",
              },
              {
                id: "b",
                text: "Leave the cell stopped in a safe state, call Tom and tell him it is the third arc start failure, and log the three times.",
                correct: true,
                feedback:
                  "Right. The third repeat is the limit on the card, so recovering again is no longer the move. Tom may be busy, but he now has a clear pattern with times, and the cell is not changed by anyone who is not authorised to change it.",
              },
              {
                id: "c",
                text: "Recover it again and keep running until Tom is free, logging each stop as it happens.",
                feedback:
                  "The card sets the limit at the third repeat so that the pattern is passed on, not recovered for another half hour. Each recovery may be done well and the cause still stays in place. Stop recovering and call Tom.",
              },
            ],
          },
          {
            id: "log-handover",
            situation:
              "Jo is handing over a robotic assembly cell at 22:00. At 19:30 the robot dropped a housing, which damaged a gripper finger. Jo left the cell stopped and called Ravi, shift engineer, who fitted a spare finger at 20:15. The cell has run normally since, and there is one spare finger left in the store.",
            question: "Which log entry should Jo write?",
            options: [
              {
                id: "a",
                text: "Gripper finger broke earlier. Ravi fixed it. All good now.",
                feedback:
                  "This entry has no time, no cause, and no detail of what was done or what to watch. The next shift cannot tell when it happened or that the spares are running low. Write the four facts and one line on what to watch.",
              },
              {
                id: "b",
                text: "Bad shift. The gripper is not up to the job and someone needs to sort it out properly.",
                feedback:
                  "This is an opinion about the cell, not a record the next shift can act on. It gives no time, no event, no action, and no state at handover. Write what you saw and what you did.",
              },
              {
                id: "c",
                text: "19:30, robot dropped a housing and damaged a gripper finger. Left the cell stopped and called Ravi, shift engineer, who fitted a spare finger at 20:15. Running normally since. One spare finger left in the store.",
                correct: true,
                feedback:
                  "Right. It gives the time, what happened, what was done and who was told, and the state of the cell. The line about the last spare finger is exactly what the next shift needs to know.",
              },
              {
                id: "d",
                text: "20:15, gripper finger replaced by Ravi. Running normally.",
                feedback:
                  "This entry starts at the repair and leaves out what happened. The next shift will not know the robot dropped a housing, which is the event they most need to watch for. Add the time of the drop and what caused the damage.",
              },
            ],
          },
        ],
        why: "You applied the method across the whole shift: the start in order, normal as ranges, drift noted and passed on, stops recovered in order, escalation at the trigger, and a log entry with the four facts.",
      },
      bridge:
        "You have shown you can run the shift. In the last lesson you write it all down on one page for your own cell, and that shift card is what your record shows.",
    },
    {
      id: "the-shift-card",
      title: "The shift card",
      emphasis: "card",
      place:
        "This is the final lesson and the fourth module. You write the shift card for one cell, and that card is the artefact your signed record shows.",
      sections: [
        {
          heading: "One page for one cell",
          paragraphs: [
            "The shift card is one page for one cell, in the order of a shift. Start lists the start-of-shift steps in order. Normal gives the numbers and observations that describe normal for this cell. Recover gives the recovery order. Escalate gives the triggers, the number of repeats that means escalate, and who to call on each shift. Hand over says what the log entry at the end of the shift must contain. The last line names the site procedure the card belongs to.",
            "A good card is one a new operator could follow on their first shift after being shown the cell. That is the test to hold every section to. If a section only makes sense to someone who already runs the cell, it needs another line.",
          ],
        },
        {
          heading: "What the card is not",
          paragraphs: [
            "The card does not replace the site's written procedure, and it does not authorise anyone to operate the cell. It sits beside the procedure as the working summary an operator uses during the shift, and it should name the procedure it belongs to. Anything on the card that differs from the procedure must be taken to the cell leader to resolve, rather than left for operators to choose between.",
            "The card also does not cover entering the cell for maintenance. That needs the site's isolation procedure and the right authorisation, and it is a separate activity from running a shift. If your recovery section starts to describe maintenance work, stop and move that to an escalation trigger instead.",
          ],
        },
        {
          heading: "How each part is checked",
          paragraphs: [
            "When you continue, each part is checked in turn. Start has to mention the log or the handover, because reading it comes first. Normal has to include at least one number and at least one thing you would see or hear. Recover has to describe the recovery, including the reset and the cell being clear. Escalate has to include the repeat limit as a number and a named role to call. Hand over has to name the state of the cell among the facts the entry gives. The site procedure reference has to name a procedure, or say none found.",
            "If a part is missing, the note names it and says what to add. When every part is present, you can sign your name against the card. Do not put anything confidential on it, because a second person can open your record. Use your cell's real numbers where you are comfortable showing them, or realistic ones that keep the same shape.",
          ],
        },
      ],
      workedExample: {
        title: "The palletising cell leader's card",
        inputLabel: "The cell",
        prompt:
          "Palletising cell 2 at Brindle Foods, running cases of tinned tomatoes onto pallets on days and nights. Site procedure SOP-PAL-03.",
        outputLabel: "The shift card",
        output:
          "Start: read the log; walk the guarding and light curtains; confirm the emergency stops are clear; check film and pallet magazine; confirm program for the current product; run one pallet layer and check the pattern.\nNormal: one case every 5 to 6 seconds; about 28 pallets a shift; two to four stops, mostly skewed cases; film tight; low film warning about twice a shift; gripper clunk once or twice an hour.\nRecover: read the message and note the time; look from outside; clear as the procedure allows; check the cell is clear and the gates closed; reset; watch the next cycle.\nEscalate: on the 3rd repeat of any stop, any damage, any program or safety setting change, any contact or unexpected motion, or a message you do not understand. Call the shift engineer on days and nights.\nHand over: the time, what happened, what you did and who you told, and the state of the cell.\nSite procedure: SOP-PAL-03.",
        reading: [
          "The card fits on one page and follows the shift from start to handover. A new operator could run a shift from it after being shown the cell.",
          "Normal is written as ranges and observations, and the routine warning is on the card so it is not mistaken for drift. The escalation section has a number for repeats and a role to call on each shift.",
          "The card names SOP-PAL-03, so anyone who finds a difference between the card and the procedure knows which document to take to the cell leader.",
        ],
      },
      practice: {
        intro:
          "Before you write your own card, compare two drafts of the escalation section for a welding cell. The test is the one from the first section: could a new operator follow it on their first shift after being shown the cell.",
        check: {
          kind: "choose",
          prompt: "Choose the escalation section a new operator could follow on their first shift.",
          leftLabel: "Draft A",
          left: "Escalate: on the 3rd repeat of any stop, any damage to the robot, torch, cables, or guarding, any change to the program or a safety setting, any contact or unexpected motion, or a message you do not understand. Call the shift engineer on days and the duty technician on nights.",
          rightLabel: "Draft B",
          right: "Escalate: if it keeps stopping or something looks wrong, get someone who knows the cell.",
          correct: "left",
          why: "Yes. Draft A gives the repeat limit as a number, names the triggers, and says which role to call on each shift, so a new operator does not have to decide for themselves when to stop recovering.",
          wrong:
            "Look again at Draft B. 'Keeps stopping' has no number, 'looks wrong' names no trigger, and 'someone who knows the cell' is not a role a new operator could find at 03:00. Draft A gives all three.",
        },
      },
      check: {
        kind: "build",
        prompt:
          "Write the shift card for a cell you run or will run. Each part has to be something a new operator could follow after being shown the cell.",
        fields: [
          {
            id: "start",
            label: "Start",
            hint: "The start-of-shift steps in order, beginning with reading the log and ending with the first-off check.",
            min: 40,
            any: ["log", "handover", "hand over"],
            missing:
              "Your start section does not begin with reading the log. Put reading the log and the handover first, then list the other steps in order, ending with the first-off check.",
          },
          {
            id: "normal",
            label: "Normal",
            hint: "At least one number, such as a cycle time or a stop count, and at least one thing you would see or hear.",
            min: 30,
            rule: "fact",
            any: ["sound", "hear", "noise", "click", "whirr", "clunk", "look", "see", "alarm", "warning", "colour", "tight", "smooth"],
            missing:
              "Your normal section needs both a number and an observation. Add at least a cycle time or a stop count, and something you would see or hear when the cell runs well.",
          },
          {
            id: "recover",
            label: "Recover",
            hint: "The recovery order: message and time, the cause found from outside, cleared as the procedure allows, the cell checked clear, reset, and the next cycle watched.",
            min: 40,
            any: ["reset"],
            missing:
              "Your recover section does not set out the recovery in order. Include finding the cause from outside, checking the cell is clear and the gates are closed, and then the reset.",
          },
          {
            id: "escalate",
            label: "Escalate and who to call",
            hint: "The triggers, the number of repeats that means escalate, and the role to call on each shift.",
            min: 40,
            rule: "fact",
            any: ["engineer", "leader", "supervisor", "technician", "maintenance", "manager"],
            missing:
              "Your escalate section needs the triggers, the number of repeats that means escalate written as a number, and the role to call, such as the shift engineer, on each shift.",
          },
          {
            id: "handover",
            label: "Hand over",
            hint: "What the log entry at the end of the shift must contain.",
            min: 30,
            any: ["state"],
            missing:
              "Your hand over section does not list the four facts. Add the time, what happened, what you did and who you told, and the state of the cell.",
          },
          {
            id: "procedure",
            label: "Site procedure reference",
            hint: "The name or number of the site procedure this card belongs to, or none found.",
            min: 4,
            any: ["sop", "procedure", "instruction", "none found", "ref", "wi-"],
            missing:
              "Your site procedure reference is empty or does not name a procedure. Name the procedure, or write none found and ask your cell leader.",
          },
        ],
        why: "Your card gives the start in order, describes normal in numbers and observations, sets out the recovery, names the escalation triggers with a repeat limit and who to call, says what the handover must contain, and points to the site procedure.",
      },
      bridge:
        "Your shift card is ready. Sign your name below, and the record will show this card, the course, and the date to anyone who opens the reference.",
    },
  ],
};
