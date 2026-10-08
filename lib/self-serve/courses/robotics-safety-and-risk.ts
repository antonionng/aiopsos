/*
Course: Robotics Safety and Risk
Slug: robotics-safety-and-risk
For: Managers, supervisors, health and safety coordinators, and directors who walk areas with robots but are
  not robot safety specialists. They already know their organisation's general health and safety arrangements,
  how to report an incident, and who the competent safety adviser is.
Outcome: On their next floor walk they can describe how a named robot cell keeps people safe, tell an emergency
  stop from a protective stop, recognise a defeated safeguard, ask questions that get them shown how the cell
  really runs, escalate what cannot wait before the end of the shift, and write a floor walk note a colleague
  could act on.
Artefact: The floor walk note, in five parts: the cell, date, and time; how the cell protects people; the
  questions asked and what was shown; what was escalated today, to whom, and when; and what goes to the review,
  with owners.
Record sentence: Walked a robot cell, recorded how it protects people and what was shown, and escalated what
  could not wait to named people at a stated time.
Lessons (id, title, move, interaction, pass rule):
  1. shared-space, Shared space, describe protection as keeping people out or letting them in with a limit,
     mark, every sentence marked with the right label.
  2. stops-and-zones, Stops and zones, tell an emergency stop from a protective stop, mark, every event marked
     with the right stop.
  3. a-defeated-safeguard, A defeated safeguard, tell a safeguard working from one defeated, mark, every
     observation marked correctly.
  4. the-floor-walk, The floor walk, choose questions that ask to be shown, choose, the set that asks to be
     shown and asks what actually happened.
  5. same-day-escalation, Same-day escalation, sort findings into escalate today and raise at the review, mark,
     every finding sorted correctly.
  6. course-assessment, The course assessment, apply every move to new situations, scenario, six of seven.
  7. the-floor-walk-note, The floor walk note, write the artefact, build, the cell field holds a fact, the
     protection field names a measure, the questions field shows something was shown or asked about what
     happened, the escalation field names a role and a time or says nothing was escalated today, and the review
     field names an owner.
Sources: UK Health and Safety Executive guidance on industrial robots; HSE L22, Safe use of work equipment
  (PUWER 1998 Approved Code of Practice and guidance); HSE guidance on RIDDOR 2013; HSE guidance on leadership
  and worker involvement; ISO 10218-1 and ISO 10218-2; ISO/TS 15066; ISO 13850; ISO 13855; IEC 60204-1;
  ISO 3691-4.
Tested on phone:          no
Tested returning learner: no
Pass rule tests written:  yes
*/
import type { CourseContent } from "./types.ts";

const OUT = "Keeps the person out";
const IN = "Lets the person in, with a limit";
const EMERGENCY = "Emergency stop";
const PROTECTIVE = "Protective stop";
const WORKING = "A safeguard working";
const DEFEATED = "A safeguard defeated";
const TODAY = "Escalate today";
const REVIEW = "Raise at the review";

export const COURSE: CourseContent = {
  slug: "robotics-safety-and-risk",
  hours: 2,
  artefact: {
    lessonId: "the-floor-walk-note",
    title: "The floor walk note",
    recordLine:
      "Walked a robot cell, recorded how it protects people and what was shown, and escalated what could not wait to named people at a stated time.",
  },
  lessons: [
    {
      id: "shared-space",
      title: "Shared space",
      emphasis: "space",
      place:
        "This is the first of seven lessons and the start of the first module. It gives you the two ideas this course uses to describe how any robot cell protects the people who work near it.",
      sections: [
        {
          heading: "Why a robot has to be kept apart from people",
          paragraphs: [
            "An industrial robot can move quickly, carry a heavy tool, and exert far more force than a person can resist. It can also move without warning. A robot that has paused because it is waiting for a part, or because a program step has not finished, looks exactly like a robot that has stopped for good, and it will start again the moment the condition it was waiting for is met. The UK Health and Safety Executive's guidance on industrial robots treats this as the central hazard: a person who believes the robot has stopped walks into its reach, and the robot carries on.",
            "For that reason every robot installation has to protect people from contact with the robot and with the tool it carries. The protection is designed for the particular cell, through a risk assessment carried out by people competent to do it, and it is described in that cell's documentation. As a manager on a floor walk you are not checking that design. You are finding out whether you can describe it in plain words, and whether what you see matches it.",
          ],
        },
        {
          heading: "Two ways a cell protects people",
          paragraphs: [
            "There are broadly two ways a cell protects people, and this course gives each a label. The first label is Keeps the person out. A measure keeps the person out when it stops anyone reaching the robot while it runs. Fixed fencing keeps the person out. So does an interlocked gate, which is a gate wired into the safety system so that opening it stops the robot, and so does a light curtain, which is a row of invisible beams across an opening that stops the robot when something breaks them.",
            "The second label is Lets the person in, with a limit. A measure lets the person in, with a limit, when people are allowed to share the space with the robot and something limits what the robot can do while they are there. An area scanner that slows the robot as a person approaches and stops it closer in is one example. Speed and separation monitoring, where the robot keeps a set distance from a person it has detected, is another. Power and force limiting, used on many collaborative applications and described in ISO/TS 15066, restricts how hard the robot can push if it touches someone. In every case the person is allowed in, and the limit is what keeps them safe.",
          ],
          beforeAfter: {
            before: "The cell is safe because it has lots of safety features.",
            after:
              "The robot is fenced on three sides, which keeps the person out. On the fourth side an area scanner slows the robot when someone approaches and stops it at one metre, which lets the person in, with a limit.",
            reading:
              "The first version tells you nothing you could look at. The second names each measure and says which way it protects people, so you know what to find on the walk.",
          },
        },
        {
          heading: "What the two labels are not",
          paragraphs: [
            "Neither label is a grade. A cell that keeps the person out is not safer than a cell that lets the person in, with a limit, or the other way round. Each approach is chosen through the risk assessment for a specific cell, with its specific robot, tool, parts, and people, and each only protects anyone while it is working as it was designed to work.",
            "The labels are also not a judgement about the size or speed of the robot. A robot is not safe because it is small, because it moves slowly when you happen to watch it, or because its supplier calls it collaborative. A small collaborative arm holding a knife, a hot glue nozzle, or a sharp-edged part can injure someone even when the arm itself is limited in force. The word collaborative describes an application that has been assessed, not a property of the robot that travels with it from one job to the next.",
          ],
        },
        {
          heading: "Why this matters on a floor walk, and the usual mistake",
          paragraphs: [
            "If you cannot describe how a cell protects people, you cannot tell whether that protection is in place. Once you can say that a cell keeps the person out with a fence, a gate interlock, and a light curtain, you know exactly what to look at: the fence, the gate, and the light curtain. Once you can say that a mobile robot lets the person in, with a limit, because its scanner slows it and then stops it, you know that the scanner and its settings are the thing that matters.",
            "The usual mistake is to accept a general answer. A cell leader who says 'it is all guarded' or 'it is a cobot, so it is fine' has not told you how people are protected, and you have not yet learned what to look for. Ask them to go measure by measure, and label each measure yourself as you listen. If a measure does not fit either label, ask again, because you have probably not yet understood what it does.",
          ],
        },
      ],
      workedExample: {
        title: "How a welding cell protects people",
        inputLabel: "What the cell leader said",
        outputLabel: "The manager's labels",
        prompt:
          "Declan Murphy, cell leader at Harrowgate Components in Telford, was asked how robot welding cell 3 protects people. He said: 'It is fenced all round. The loading door has an interlock, so the robot stops if you open it. There is a turntable, so the operator loads one side while the robot welds the other, with a screen between them. A light curtain across the loading side stops the turntable if you reach in while it is turning.'",
        output:
          "Fenced all round: keeps the person out. Interlock on the loading door: keeps the person out. Operator loads one side while the robot welds the other, behind a screen: lets the person in, with a limit, because the operator is inside the cell's footprint and the limit is the screen between the operator and the robot. Light curtain across the loading side: keeps the person out of the turning turntable.",
        reading: [
          "The first two measures stop anyone reaching the robot while it welds. The fence does it all the time and the interlock does it whenever the door is opened, so both keep the person out.",
          "The turntable is the interesting one. The operator works within arm's length of the cell every cycle, so they are let in. The limit is the screen and the fact that the robot only ever welds on the far side. That is worth confirming on the walk, because if the screen were removed the whole arrangement would change.",
          "The light curtain protects against a different machine, the turntable itself. The manager now has a list of four things to look at, and a clear sense of which one the operator's safety depends on during every single cycle.",
        ],
      },
      practice: {
        intro:
          "Here is a short description of a screwdriving station at a small assembly site. Use the two labels from this lesson to mark each sentence. The worked example is still above if you want to compare.",
        check: {
          kind: "mark",
          prompt: "Mark each sentence with Keeps the person out or Lets the person in, with a limit.",
          passLabel: OUT,
          failLabel: IN,
          sentences: [
            {
              id: "guard",
              text: "The parts feeder behind the station sits inside a fixed mesh guard that can only be removed with a tool.",
              fail: false,
              why: "A fixed guard that needs a tool to remove stops anyone reaching the feeder while it runs, so it keeps the person out.",
            },
            {
              id: "force",
              text: "The collaborative arm works beside the operator and is set to limit the force it can apply if it touches her.",
              fail: true,
              why: "The operator shares the space with the arm, and the limit is the force setting, so this lets the person in, with a limit.",
            },
          ],
          why: "That is right. The mesh guard stops anyone reaching the feeder, and the arm shares the bench with the operator under a force limit.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "Here is a description of how a mobile robot and a palletising robot are protected at a distribution centre. Mark each sentence with Keeps the person out or Lets the person in, with a limit.",
        material: {
          label: "The site",
          text: "Castlemere Distribution, Daventry. Goods leave the packing line on a mobile robot and are stacked by a palletising robot at the end of aisle 6.",
        },
        passLabel: OUT,
        failLabel: IN,
        sentences: [
          {
            id: "fence",
            text: "The palletising robot is inside a fence with an interlocked gate.",
            fail: false,
            why: "A fence and an interlocked gate stop people entering while the robot runs. That keeps the person out.",
          },
          {
            id: "scanner",
            text: "The mobile robot slows down when its scanner detects a person ahead and stops if they come closer.",
            fail: true,
            why: "People can be in the same aisle as the robot. The limit is that it slows and stops as they approach. That lets the person in, with a limit.",
          },
          {
            id: "curtain",
            text: "Pallets are exchanged through a light curtain that mutes only when a pallet, not a person, passes through.",
            fail: false,
            why: "The light curtain is designed so that a person entering stops the robot. That keeps the person out.",
          },
          {
            id: "markings",
            text: "Floor markings show the mobile robot's route, and people may cross them.",
            fail: true,
            why: "People are allowed to cross the route. The limit comes from the markings and the robot's own sensing. That lets the person in, with a limit.",
          },
        ],
        why: "You described how each measure protects people. The fence, the gate, and the light curtain keep people away from the palletiser, and the mobile robot shares the aisle under the limit of its scanner and its marked route.",
      },
      bridge:
        "Both approaches depend on the robot stopping when it should. The next lesson explains the two kinds of stop and the zones that trigger them.",
    },
    {
      id: "stops-and-zones",
      title: "Stops and zones",
      emphasis: "Stops",
      place:
        "This is the second lesson and the second module. It gives you the words to describe what you see when a robot stops, so that you can tell a safeguard doing its job from a problem.",
      sections: [
        {
          heading: "The emergency stop",
          paragraphs: [
            "An Emergency stop is a stop that a person chooses to make because of danger. On most machines it is a red mushroom-headed button, usually on a yellow background, placed where people can reach it quickly: on the cell panel, on the teach pendant, beside the gates, and on the body of a mobile robot. Its behaviour is set in the machine's design, with reference to standards such as ISO 13850 and IEC 60204-1.",
            "Two features matter to you on a walk. The first is that pressing it is a human decision made because something is wrong. The second is that the machine stays stopped until someone deliberately resets it. Releasing or twisting the button is not a restart, and a machine that restarts on its own after an emergency stop has been released is a serious finding. An emergency stop is a backup for people. It is not the thing that protects them in normal work, which is the job of the safeguards.",
          ],
        },
        {
          heading: "The protective stop",
          paragraphs: [
            "A Protective stop is a stop that the safeguards make automatically, with no one choosing it. The robot stops because an interlocked gate was opened, because a light curtain was broken, because a scanner detected a person too close, or because a collaborative robot detected a collision. Depending on how the cell is configured, it may resume once the cause is cleared, or it may wait for an operator to acknowledge the stop.",
            "A protective stop is not a fault. It is the safeguard doing exactly what it was designed to do. Operators often describe protective stops as the robot 'faulting' or 'tripping', and a manager who repeats that language will soon be treating a working safeguard as a nuisance. Use the right word, and ask about the cause of the stop rather than about how to make it go away.",
          ],
          beforeAfter: {
            before: "The robot faulted when Sanjay went to pick up the dropped case.",
            after:
              "The robot made a protective stop when Sanjay went to pick up the dropped case, because he broke the light curtain at the outfeed.",
            reading:
              "The first version suggests something went wrong with the robot. The second says the safeguard worked and names what triggered it, which is the fact you would want to follow up.",
          },
        },
        {
          heading: "Warning zones and protective zones",
          paragraphs: [
            "Around many robots, and especially around mobile robots and cells guarded by area scanners, the space is divided into zones. The outer zone is usually called the warning zone, and a person entering it causes the robot to slow down. The inner zone is usually called the protective zone, and a person entering it causes a protective stop. Some systems have more than two zones, and some change the shape of the zones as the robot speeds up or turns.",
            "The zones are set in the robot's safety configuration, often as shapes drawn on the floor in software. You usually cannot see them. Floor markings may show roughly where they are, but a marking and a zone are different things, and the marking can wear away or be painted in the wrong place without the zone changing. The positioning of safeguards against the speed at which people approach is the subject of ISO 13855, and it is work for specialists. Your job is to know that the zones exist, to notice the slowing and the stopping, and to ask who is allowed to change the settings.",
          ],
        },
        {
          heading: "What a pattern of stops tells you",
          paragraphs: [
            "One protective stop tells you a safeguard worked. Many protective stops in the same place tell you something about how people and the robot are working together. A mobile robot that stops ten times an hour at the same corner may be sharing an aisle that is too narrow, or people may be taking a shortcut through its route. A cell that stops every time a case falls may have an outfeed that jams. The stops are information, and the right response is to find out why they happen.",
            "The usual mistake is to treat frequent protective stops as a problem with the safeguard. That leads straight to requests to shrink a scanner zone, to mute a light curtain, or to prop a gate, and those are the defeated safeguards you will learn to recognise in the next lesson. When someone tells you the robot keeps stopping, ask what triggers it and where, and make a note of it. Do not ask whether the settings can be relaxed.",
          ],
        },
      ],
      workedExample: {
        title: "Ten minutes beside a mobile robot",
        inputLabel: "What the manager saw",
        outputLabel: "How she described it",
        prompt:
          "Hannah Clarke, operations manager at Castlemere Distribution, watched a mobile robot in aisle 4 for ten minutes. 'A picker walked towards the robot and it slowed. The picker kept walking and it stopped. It started again once she moved away. Later a supervisor pressed the red button on the robot because it had caught a strap hanging off a pallet, and it stayed stopped until he reset it at the robot's panel.'",
        output:
          "The slowing was the warning zone. The stop when the picker came closer was a protective stop from the protective zone, and the robot resumed when she left it. The supervisor's action was an emergency stop, chosen because of danger, and it needed a deliberate reset.",
        reading: [
          "Hannah saw three events and described each with the right word. The slowing and the first stop were the scanner's zones working as designed. Nobody chose them.",
          "The supervisor's stop was a person's decision in response to a hazard, the strap caught on the pallet. The robot stayed stopped until he reset it, which is how an emergency stop should behave.",
          "Both stops worked. What Hannah now wants to know is how often the protective stop happens in aisle 4, because if it happens many times a shift, people and robots may be sharing a space that is too tight, and that is a question for the review.",
        ],
      },
      practice: {
        intro:
          "Two supervisors wrote up the same event at a packing cell. Choose the note that describes the stop correctly, using the words from this lesson.",
        check: {
          kind: "choose",
          prompt:
            "A robot at a packing cell stopped when an operator opened the interlocked gate to clear a jam. Choose the note that describes this correctly.",
          leftLabel: "Note A",
          left: "The robot made a protective stop when the gate was opened. The interlock worked as it should.",
          rightLabel: "Note B",
          right: "The robot had an emergency stop fault when the gate was opened. Maintenance should look at the interlock.",
          correct: "left",
          why: "Note A is right. Nobody chose to stop the robot because of danger. The interlock stopped it when the gate opened, which is a protective stop and a safeguard working.",
          wrong:
            "Look again at Note B. It calls the stop an emergency stop and a fault. Nobody pressed a button because of danger, and the interlock did what it was designed to do, so this was a protective stop.",
        },
      },
      check: {
        kind: "mark",
        prompt: "For each event at a robot cell, mark whether it was an Emergency stop or a Protective stop.",
        passLabel: PROTECTIVE,
        failLabel: EMERGENCY,
        sentences: [
          {
            id: "gate",
            text: "An operator opened the interlocked gate to clear a jam, and the robot stopped.",
            fail: false,
            why: "Nobody chose to stop the robot for danger. The interlock stopped it automatically when the gate opened. That is a protective stop.",
          },
          {
            id: "smoke",
            text: "A maintenance technician saw smoke from the robot's cable and pressed the red button on the cell panel.",
            fail: true,
            why: "A person pressed the red button because of danger. That is an emergency stop.",
          },
          {
            id: "collision",
            text: "A collaborative robot stopped when its arm touched a box that had been left on the table.",
            fail: false,
            why: "The robot detected the collision and stopped on its own. That is a protective stop.",
          },
          {
            id: "visitor",
            text: "The robot stopped when a visitor walked into the scanner's protective zone.",
            fail: false,
            why: "The scanner saw a person in the protective zone and stopped the robot automatically. That is a protective stop.",
          },
        ],
        why: "You told the stop that a person chose because of danger apart from the stops that the safeguards made on their own. Only the technician who saw smoke made an emergency stop.",
      },
      bridge:
        "A safeguard can only stop the robot if it has not been defeated. The next lesson shows you how to recognise when it has.",
    },
    {
      id: "a-defeated-safeguard",
      title: "A defeated safeguard",
      emphasis: "defeated",
      place:
        "This lesson sits between the vocabulary of the first two lessons and the floor walk itself. It describes the thing you are most looking for when you walk a cell.",
      sections: [
        {
          heading: "What defeated means",
          paragraphs: [
            "A safeguard is defeated when it has been bypassed, disabled, or worked around so that it no longer protects people as it was designed to. The safeguard may still be there, and it may even look normal, but it can no longer stop the robot when a person comes into danger. This course uses the label A safeguard defeated for anything you see that shows this has happened.",
            "The opposite label is A safeguard working. A safeguard is working, as far as a floor walk can tell, when it is present, undamaged, unobstructed, and stops the robot when it should. You will often only be able to say that it appears to be working, because you cannot test it yourself. You can look closely, and you can ask to be shown it working, for example by watching an operator open the gate at the end of a cycle.",
          ],
        },
        {
          heading: "The signs to look for",
          paragraphs: [
            "Defeated safeguards tend to look the same from site to site. Look for a spare actuator or key left permanently in a gate interlock, so that the safety system believes the gate is shut. Look for tape or cable ties holding a switch, and for a gate propped or tied open while the robot runs. Look for an object placed so that a light curtain or scanner is permanently blocked or muted, and for a scanner that has been turned away, covered, or knocked out of position.",
            "Look too at behaviour. A cell running with a panel removed has lost part of its guarding. People reaching into a cell without stopping it, or stepping over a light curtain rather than through it, are working around the safeguard even if nothing has been physically changed. A sign that says 'do not enter while robot is running' is not a safeguard at all. It is a request, and if it is the only thing standing between a person and the robot, you have found a gap.",
          ],
          beforeAfter: {
            before: "The gate seemed fine.",
            after:
              "The gate was closed, but a spare interlock key was sitting in the switch on the fence post, so the robot would keep running if the gate were opened.",
            reading:
              "The first note records an impression. The second records exactly what was seen and why it matters, and it would let anyone reading it find the key.",
          },
        },
        {
          heading: "Why safeguards get defeated",
          paragraphs: [
            "Safeguards are usually defeated for understandable reasons. The most common is that the safeguard causes stops that get in the way of production. A light curtain that trips every time a case wobbles on the outfeed, or a gate that has to be opened to clear the same jam six times a shift, creates steady pressure on the people who run the cell to find a quicker way. The spare key or the cable tie is often the result of a shift trying to hit its numbers.",
            "That is not an excuse, and a defeated safeguard is a serious matter that you will escalate the same day, as the fifth lesson explains. It is also a design signal. It tells you that the cell does not fit the way people need to work, and removing the key without fixing the jam only means the key will return. A good floor walk records both: the defeated safeguard, and the reason it was defeated.",
          ],
        },
        {
          heading: "What you may and may not do, and the usual mistake",
          paragraphs: [
            "You should not test a safeguard yourself on a floor walk unless your site procedure says you may. Walking into a scanner field to see whether the robot stops, or opening a gate to check the interlock, puts you at risk if the safeguard has in fact been defeated, and it may disrupt a process you do not fully understand. Look, and ask to be shown by the person who runs the cell.",
            "The usual mistake is to accept that a defeated safeguard is known about and therefore acceptable. An operator may tell you that the engineers know about the key, or that everyone does it, or that it has been like that for months. None of that makes the safeguard work. The fact that it is common makes it more serious, not less, because it means the site has come to depend on something that no longer protects anyone.",
          ],
        },
      ],
      workedExample: {
        title: "A quick look at a packaging cell",
        inputLabel: "The manager's notes",
        outputLabel: "How she labelled them",
        prompt:
          "Priya Nair, production manager at Fenbrook Foods in Wellingborough, spent five minutes at case packer 2. Her notes read: 'Gate closed, with a spare key sitting in the interlock. A clean light curtain across the outfeed. A box of labels on the floor inside the scanner's field. Operator reached through the outfeed to straighten a case while the robot was moving.'",
        output:
          "Spare key in the interlock: a safeguard defeated. Clean light curtain: appears to be a safeguard working, to be confirmed by asking to be shown. Box of labels in the scanner field: possibly defeated, because an object sitting in the field may have led someone to reconfigure or mute the scanner, so ask. Reaching in while the robot moves: a safeguard defeated, because the outfeed should stop the robot when anything enters.",
        reading: [
          "The spare key is the plainest sign in the course. With the key in the switch, the safety system believes the gate is shut whatever its real position.",
          "Priya did not assume the light curtain worked because it was clean. She recorded that it appeared to work and planned to ask to be shown, which is the most a floor walk can honestly say.",
          "The box of labels is a question, not yet a finding. A scanner would normally stop the robot with an object in its protective zone, so if the cell is running, someone may have changed the settings. The reaching in shows the outfeed safeguard is being worked around, whatever its settings are. Priya found two definite problems and one question, and the next lesson shows how to turn that question into something she can ask properly.",
        ],
      },
      practice: {
        intro:
          "Here are three observations from a laser marking cell. Use the two labels from this lesson. The list of signs is still above if you want to read it again.",
        check: {
          kind: "mark",
          prompt: "Mark each observation as A safeguard working or A safeguard defeated.",
          passLabel: WORKING,
          failLabel: DEFEATED,
          sentences: [
            {
              id: "panel",
              text: "The rear access panel is off and leaning against the fence while the cell runs.",
              fail: true,
              why: "A cell running with a panel removed has lost part of its guarding, so this is a safeguard defeated.",
            },
            {
              id: "door",
              text: "The operator opened the door at the end of the cycle and the robot stayed still with a door-open message on the screen.",
              fail: false,
              why: "The interlock held the robot and the panel reported it, so this is a safeguard working.",
            },
            {
              id: "tape",
              text: "The door switch has been wrapped in insulating tape so that it stays closed.",
              fail: true,
              why: "Tape holding a switch makes the system think the door is shut, so this is a safeguard defeated.",
            },
          ],
          why: "That is right. The missing panel and the taped switch both stop the guarding doing its job, and the door interlock stopped the robot as it should.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "Here are observations from a walk around a machine-tending cell. Mark each as A safeguard working or A safeguard defeated.",
        passLabel: WORKING,
        failLabel: DEFEATED,
        sentences: [
          {
            id: "cable-tie",
            text: "The gate is held open with a cable tie and the robot is running.",
            fail: true,
            why: "A gate held open while the robot runs cannot protect anyone. That is a safeguard defeated.",
          },
          {
            id: "gate-message",
            text: "When the operator opened the gate at the end of the cycle, the robot stopped and the panel showed a gate-open message.",
            fail: false,
            why: "The robot stopped when the gate opened and the panel reported it. That is a safeguard working.",
          },
          {
            id: "cardboard",
            text: "A piece of cardboard has been taped over part of the area scanner's window.",
            fail: true,
            why: "Covering part of the scanner can stop it seeing a person. That is a safeguard defeated, even if someone meant it as a quick fix for nuisance stops.",
          },
          {
            id: "estop",
            text: "The emergency stop button on the panel is unobstructed, with its label legible.",
            fail: false,
            why: "The button is there and reachable. As far as you can see on a walk, that is a safeguard working, and you can ask when it was last tested.",
          },
        ],
        why: "You recognised the signs that a safeguard has been bypassed, the tied gate and the covered scanner, and kept them apart from what looks like a safeguard doing its job.",
      },
      bridge:
        "Some things you can see, and others you have to ask about. The next lesson is about the questions that get you shown how a cell really runs.",
    },
    {
      id: "the-floor-walk",
      title: "The floor walk",
      emphasis: "walk",
      place:
        "This is the fourth lesson and the third module. You can now describe a cell's protection, name its stops, and spot a defeated safeguard. This lesson gives you the questions a non-specialist asks to find out what you cannot see.",
      sections: [
        {
          heading: "What a floor walk is",
          paragraphs: [
            "A floor walk is a visit to the place where the work happens, to see how it really runs and to talk to the people who run it. The HSE's guidance on leadership and worker involvement describes managers visiting the workplace and talking to workers as one of the ways leaders learn what actually happens, as opposed to what the paperwork says happens. On a robot cell, that difference is often where the risk sits.",
            "A good floor walk is short, planned, and focused on one or two cells. You know before you arrive how the cell is meant to protect people, because you have read the cell's description or asked for it. You arrive with questions, you ask to be shown things, and you write down what you saw and heard the same day.",
          ],
        },
        {
          heading: "What a floor walk is not",
          paragraphs: [
            "A floor walk is not an inspection, an audit, or a test of the safeguards. You are not there to sign anything off, and you are not the competent person for robot safety. Say so to the people you talk to. An operator who thinks they are being inspected will tell you the procedure. An operator who understands you want to know how the job really goes is far more likely to show you the jam that happens six times a shift.",
            "It is also not a chance to fix things on the spot by instruction. If you find a problem, the fifth lesson explains how to escalate it. If you tell an operator to change the way they clear a jam, or to move a scanner, you may introduce a new hazard in a process you do not fully understand. Your job on the walk is to see, to ask, and to make sure the right people know.",
          ],
        },
        {
          heading: "Ask to be shown, and ask what actually happened",
          paragraphs: [
            "The most useful floor walk questions ask to be shown rather than told, and they ask about what actually happened rather than what should happen. 'Show me what stops the robot if someone walks in.' 'When did it last stop unexpectedly, and what happened?' 'Show me what you do when it jams.' 'Who is allowed to change the robot's program or its safety settings?' 'When were the emergency stops last tested, and where is that written down?' 'Where is the risk assessment for this cell, and when was it last reviewed?'",
            "Each of these produces something you can check: a demonstration, a date, a name, a log, a document. Being shown the lockout point an operator actually uses tells you far more than hearing that lockout is followed. Being told that the emergency stops were tested last Tuesday, and then seeing the entry in the log, is evidence. Being told that they are tested regularly is not.",
          ],
          beforeAfter: {
            before: "Do you follow the jam procedure?",
            after: "Show me what you did the last time it jammed.",
            reading:
              "The first question invites yes. The second asks for a demonstration of a real event, and the answer will show you whether the procedure and the practice are the same thing.",
          },
        },
        {
          heading: "The questions that tell you very little",
          paragraphs: [
            "Questions that invite a simple yes tell you very little. 'Is it safe?' 'Has everyone been trained?' 'Do you follow the procedure?' 'Any problems?' The trouble is that the honest answer and the convenient answer are the same word. An operator who clears jams by reaching in and an operator who always locks off will both say yes, and you will leave knowing nothing more than when you arrived.",
            "The usual mistake is to ask these questions out of politeness. Managers often feel that asking to be shown something suggests they do not trust the operator. In practice the opposite is true. Asking someone to show you how they do their job treats them as the expert on it, which they are, and it is the only way you will learn what the cell is really like at three in the afternoon on a busy shift.",
          ],
        },
      ],
      workedExample: {
        title: "Two managers walk the same cell",
        inputLabel: "The questions each manager asked",
        outputLabel: "What each manager learned",
        prompt:
          "At Harrowgate Components, two managers walked robot cell 5 on consecutive days. Tom Ashworth asked: 'Is everything OK here? Are you following the procedures? Any problems?' Sian Evans asked: 'Show me what happens when it jams. When did it last jam? What did you do? Who can change the program if the jam keeps happening?'",
        output:
          "Tom heard: 'Yes, fine, no problems.' Sian was shown that the operator clears jams by pausing the robot at the pendant and reaching in through the outfeed, that it jams several times a shift, that it last jammed forty minutes earlier, and that nobody has asked the engineer to look at it because nobody on the shift knew who could change the program.",
        reading: [
          "Both managers were polite and interested, and both spent about the same time at the cell. Only Sian asked to be shown what happens, and only she asked about a real event.",
          "Tom's questions could all be answered with yes, and they were. The operator was not being dishonest. The procedures exist, and in his view the cell was fine.",
          "Sian now has two findings. Reaching through the outfeed after only pausing the robot is working around the safeguard, which is escalated today. The repeated jams, with no one knowing who can change the program, are the cause, and they go to the review with an owner. She found both because she asked to be shown.",
        ],
      },
      practice: {
        intro:
          "Here are three floor walk questions that can each be answered with yes. Rewrite them in the box so that at least one asks to be shown something and at least one asks about the last time something actually happened. Keep the subjects of the questions: the jam, and the emergency stops.",
        check: {
          kind: "edit",
          label: "The questions you are rewriting",
          prompt:
            "Rewrite these questions for a walk at a robotic palletiser so that they ask to be shown and ask what actually happened.",
          start: "Is the cell safe? Do you follow the jam procedure? Are the emergency stops tested?",
          unchanged:
            "You have not changed the questions yet. Rewrite at least one so that it asks to be shown something, and one so that it asks about the last time something happened.",
          limitWording: false,
          limits: [
            {
              id: "show",
              any: ["show me", "walk me through", "point to", "can i see", "let me see"],
              missing:
                "None of your questions asks to be shown anything yet. Begin at least one with 'Show me', as in the lesson.",
            },
            {
              id: "last",
              any: ["last time", "last jam", "last tested", "when did", "when was", "last stop"],
              missing:
                "None of your questions asks about a real event yet. Ask when something last happened, for example when the emergency stops were last tested.",
            },
          ],
          keep: [
            {
              id: "jam",
              any: ["jam"],
              missing: "Your questions no longer mention the jam. Keep a question about what happens when the palletiser jams.",
            },
            {
              id: "estop",
              any: ["emergency stop", "e-stop", "stop button"],
              missing:
                "Your questions no longer mention the emergency stops. Keep a question about when they were last tested.",
            },
          ],
          why: "Your questions now ask to be shown and ask about a real event, so the answers will describe the cell as it runs rather than as it should run.",
          result: {
            label: "What the questions might sound like",
            text: "Show me what you do when a case jams on the infeed. When did it last jam, and what did you do? When were the emergency stops last tested, and where is that written down?",
          },
        },
      },
      check: {
        kind: "choose",
        prompt:
          "Two managers at Castlemere Distribution have prepared questions for a floor walk at the robotic palletiser at the end of aisle 6. Choose the set of questions that will reveal how the cell really runs.",
        leftLabel: "Set A",
        left: "Is the cell safe? Has everyone been trained? Do you follow the lockout procedure?",
        rightLabel: "Set B",
        right:
          "Show me what you do when a case falls inside the cell. When did that last happen? Show me the lockout point you use. When were the emergency stops last tested, and where is it written down?",
        correct: "right",
        why: "Set B asks to be shown and asks what actually happened, so the answers describe the real cell: a demonstration, a date, a lockout point, and a log you can look at.",
        wrong:
          "Every question in Set A can be answered with yes, and yes is both the honest answer and the convenient one. Choose the set that asks to be shown and asks when things last happened.",
      },
      bridge:
        "A floor walk sometimes finds something that cannot wait. The next lesson sets the line between what you escalate the same day and what goes to the review.",
    },
    {
      id: "same-day-escalation",
      title: "Same-day escalation",
      emphasis: "escalation",
      place:
        "This is the fifth lesson and the fourth module. Your walk has produced findings. This lesson decides which of them cannot wait and how you pass them on.",
      sections: [
        {
          heading: "What escalating today means",
          paragraphs: [
            "In this course, Escalate today means that the person responsible for the area and your site's safety contact are told before the end of the shift, in person or by telephone, and that you record who you told and when. An email sent at five o'clock to someone who has gone home is not escalation. The point is that someone with the authority to act on the finding knows about it while there is still time to act the same day.",
            "Findings to escalate today include any safeguard that has been defeated; any emergency stop that is missing, blocked, or does not work; any contact between a robot and a person, even without injury; any unexpected robot motion; anyone entering a cell under power without following the procedure; and damage to guarding. These are the findings where the next person to walk into the cell could be hurt, and a week's wait for a meeting is a week of that risk.",
          ],
        },
        {
          heading: "When a person is in danger now",
          paragraphs: [
            "If a person is in immediate danger, stop the machine first, using the nearest emergency stop, and escalate afterwards. This is the case the emergency stop exists for. Do not go to find the cell leader while someone is reaching into a moving cell, and do not wait to be sure. An unnecessary emergency stop costs some minutes of production. A necessary one that nobody pressed can cost far more.",
            "Once the machine is stopped and the person is clear, leave it stopped and tell the responsible person. Do not reset it yourself unless that is part of your role and your site procedure, because the reset is a decision about whether the cell is safe to run, and that decision belongs to someone competent to make it.",
          ],
        },
        {
          heading: "What goes to the review",
          paragraphs: [
            "Other findings are labelled Raise at the review in this course. They go to the next safety meeting or cell review, written down, with a named owner for each item. They include frequent nuisance stops where the safeguard itself is working, housekeeping, worn floor markings, a missing but non-critical sign, and a risk assessment that is coming due for review. None of these is unimportant. They are simply findings where nothing will get worse between now and the next meeting, provided they are recorded and owned.",
            "Many review items are causes of escalate-today findings, and the note should link them. The outfeed that jams six times a shift is a review item, because it needs an engineer and a change to the cell. The operator who reaches through the outfeed because of the jams is an escalate-today finding. If you escalate the reaching and forget the jam, the reaching will return.",
          ],
          beforeAfter: {
            before: "Mentioned the gate issue to someone on cell 3. Will pick up at the next meeting.",
            after:
              "Spare key in the cell 3 gate interlock: told the shift manager, Marcus Obi, in person at 14:20 and the site safety adviser by telephone at 14:30. Recorded in the safety log. Frequent jams at the outfeed, the likely cause: raised at the review, owned by the production engineer.",
            reading:
              "The first version names no one, gives no time, and sends a defeated safeguard to a meeting. The second escalates it the same day to named roles at stated times, and sends the underlying cause to the review with an owner.",
          },
        },
        {
          heading: "Reporting, and the usual mistake",
          paragraphs: [
            "Some incidents must also be reported to the Health and Safety Executive under RIDDOR, the Reporting of Injuries, Diseases and Dangerous Occurrences Regulations 2013. Whether a particular event must be reported is decided by the responsible person at your site, using the HSE's guidance. It is not the job of a floor walk to decide it. It is the job of the floor walk to make sure the responsible person knows, the same day, so that they can decide in time.",
            "The usual mistake is to downgrade a finding because nothing bad has happened. A robot brushing someone's shoulder without injury feels minor, and a spare key that has been in the interlock for months feels normal. Both are escalated today. The absence of an injury is luck, and the length of time a safeguard has been defeated is a measure of how long the site has been exposed, not a reason to wait longer.",
          ],
        },
      ],
      workedExample: {
        title: "Sorting the findings from case packer 2",
        inputLabel: "The manager's findings",
        outputLabel: "How she sorted and passed them on",
        prompt:
          "Priya Nair's findings from case packer 2 at Fenbrook Foods, walked at 13:45: 'Spare key in the gate interlock. Operator reaches through the outfeed while the robot moves. The outfeed jams several times a shift. Floor markings worn near the cell.'",
        output:
          "Escalate today: the spare key in the interlock, and the reaching through the outfeed. Told the shift manager in person at 14:20 and the site safety adviser by telephone at 14:30, and recorded in the safety log. Raise at the review: the frequent outfeed jams, the likely reason for reaching in, owned by the production engineer; the worn floor markings, owned by facilities.",
        reading: [
          "The spare key is a defeated safeguard and the reaching is someone entering the danger zone under power without the procedure. Both could hurt the next operator, so both are escalated before the end of the shift.",
          "Priya told two people, each by a means that reaches them straight away, and she wrote down the times. Anyone reading the safety log later can see that the finding was acted on the same day.",
          "The jams need an engineer and cannot be fixed in an afternoon, so they go to the review. Priya linked them to the reaching, so the root cause is not lost. The floor markings are real but not urgent, and they have an owner.",
        ],
      },
      practice: {
        intro:
          "Here is a note a supervisor wrote after a walk. It names a defeated safeguard but does not escalate it. Rewrite it in the box so that it says who was told, and that they were told today. The before and after above shows the kind of wording that works.",
        check: {
          kind: "edit",
          label: "The escalation you are rewriting",
          prompt: "Rewrite this escalation so that a named role was told the same day.",
          start: "Found the scanner on the mobile robot in aisle 2 turned to face the wall. Will raise it at the monthly safety meeting.",
          unchanged:
            "You have not changed the note yet. Say who you told about the scanner, and that you told them today.",
          limitWording: false,
          limits: [
            {
              id: "who",
              any: ["shift manager", "safety adviser", "supervisor", "team leader", "operations manager", "site manager"],
              missing:
                "Your note does not yet say who was told. Name a role, such as the shift manager or the site safety adviser.",
            },
            {
              id: "when",
              any: ["today", "this morning", "this afternoon", "before the end of the shift", "at 1", "at 0", "at 2"],
              missing:
                "Your note does not yet say that the finding was passed on today. Give the time, or say that it was today.",
            },
          ],
          keep: [
            {
              id: "scanner",
              any: ["scanner"],
              missing: "Your note no longer mentions the scanner. Keep the finding itself in the note.",
            },
          ],
          why: "Your note now escalates the turned scanner the same day to a named role, which is what a defeated safeguard needs.",
          result: {
            label: "How the note might read",
            text: "Found the scanner on the mobile robot in aisle 2 turned to face the wall. Told the shift manager in person at 10:40 today and the site safety adviser by telephone at 10:50. Recorded in the safety log.",
          },
        },
      },
      check: {
        kind: "mark",
        prompt:
          "Here are findings from a floor walk at a robot assembly line at Brindley Precision in Coventry. Mark each as Escalate today or Raise at the review.",
        passLabel: REVIEW,
        failLabel: TODAY,
        sentences: [
          {
            id: "shoulder",
            text: "An operator says the robot brushed her shoulder yesterday, but she was not hurt and did not report it.",
            fail: true,
            why: "Contact between a robot and a person is escalated the same day, whether or not anyone was hurt. It may show that a safeguard or a setting is not working.",
          },
          {
            id: "trolleys",
            text: "The cell stops on the scanner several times an hour because trolleys are parked too close.",
            fail: false,
            why: "The scanner is doing its job. The nuisance stops are a layout problem to raise at the review with an owner, unless you see someone defeating the scanner to avoid them.",
          },
          {
            id: "blocked",
            text: "The emergency stop on the operator panel has a tool trolley parked in front of it.",
            fail: true,
            why: "An emergency stop that cannot be reached quickly is as bad as a missing one. Have the trolley moved and escalate it today.",
          },
          {
            id: "risk-assessment",
            text: "The cell's risk assessment is due for its annual review next month.",
            fail: false,
            why: "Nothing is wrong today. A review coming due is raised at the review so an owner can plan it.",
          },
        ],
        why: "You escalated what cannot wait, the contact and the blocked emergency stop, and sent the layout and the coming review to the meeting with an owner.",
      },
      bridge:
        "You now have every move the course teaches. The next lesson recaps them and tests them together on situations you have not seen.",
    },
    {
      id: "course-assessment",
      title: "The course assessment",
      emphasis: "assessment",
      place:
        "This is the sixth lesson and the course assessment. It brings the five earlier lessons together, works one mixed example, and then asks you to apply them to seven new situations.",
      sections: [
        {
          heading: "The method in one walk",
          paragraphs: [
            "Before you walk a cell, find out how it is meant to protect people, and describe each measure as either keeping the person out or letting the person in, with a limit. That tells you what to look at. At the cell, watch for stops, and describe each one correctly: an emergency stop is chosen by a person because of danger and needs a deliberate reset, while a protective stop is made by the safeguards on their own and is a sign that they are working.",
            "Look for defeated safeguards: keys in interlocks, tied gates, covered or turned scanners, removed panels, and people reaching in under power. Label what you can see as a safeguard working or a safeguard defeated, and remember that a floor walk can only say a safeguard appears to be working. Then ask your questions. Ask to be shown, and ask when things last happened, because questions that invite yes tell you very little.",
          ],
        },
        {
          heading: "Deciding and recording",
          paragraphs: [
            "Sort every finding. Defeated safeguards, missing or blocked emergency stops, any contact between a robot and a person, unexpected motion, entry under power without the procedure, and damaged guarding are escalated today, in person or by telephone, to the person responsible for the area and to the safety contact, with the times recorded. If someone is in danger now, press the emergency stop first. Everything else goes to the review with a named owner, and causes are linked to the findings they produce.",
            "Leave the decision about reporting to the HSE under RIDDOR with the responsible person, and make sure they know the same day. Then write it all down in the floor walk note, which the final lesson teaches. The assessment that follows gives you situations from sites you have not seen, and each question draws on one or more of these moves.",
          ],
        },
        {
          heading: "How the assessment works",
          paragraphs: [
            "There are seven questions. Each describes a real situation and offers three or four things a reasonable manager might do. Exactly one is the move this course teaches. You need six of the seven to pass.",
            "When you submit, each question shows whether your choice was right and why. If you do not reach the pass mark, read the feedback on the questions you missed, go back to the lesson it points to if you need to, and try again. Your answers stay on screen so that you can change only the ones you want to.",
          ],
        },
      ],
      workedExample: {
        title: "One walk, every move",
        inputLabel: "What happened on the walk",
        outputLabel: "What the manager did",
        prompt:
          "Marcus Obi, shift manager at Harrowgate Components, walked the cobot sanding station at 09:30. The supplier's brochure on the wall called it 'collaborative, no guarding needed'. The arm stopped twice while he watched, each time when the operator's hand came near the sanding head. The operator said the arm had 'nudged' his forearm last Friday. Marcus asked to be shown the force settings record and who can change it. Nobody on shift knew.",
        output:
          "Marcus described the station as letting the person in, with a limit, the limit being the force setting and the arm's collision detection, and noted that the sanding head is a hazard in its own right. He recorded both stops as protective stops. He escalated the contact last Friday to the area manager in person at 09:55 and to the site safety adviser by telephone at 10:05, and recorded it in the safety log. He raised at the review the question of who owns the force settings record, owned by the controls engineer.",
        reading: [
          "Marcus did not accept the brochure. Collaborative describes an assessed application, and a sanding head can injure someone even when the arm is force limited, so he described the measure and named the tool as a hazard.",
          "The two stops were the collision detection working, and he used the right word for them. The contact last Friday was different. Any contact between a robot and a person is escalated today, even with no injury, and the responsible person decides whether it must be reported.",
          "Not knowing who owns the settings is not dangerous by the end of the shift, but it matters, so it went to the review with an owner. Every move in the course appears in this one walk.",
        ],
      },
      practice: {
        intro:
          "Before the assessment, here is one short practice. Two supervisors wrote a single line about the same finding. Choose the line that follows the course.",
        check: {
          kind: "choose",
          prompt:
            "On a walk, a supervisor found an emergency stop button on a palletiser fence with its mushroom head snapped off. Choose the line that records the right action.",
          leftLabel: "Line A",
          left: "Broken emergency stop on the palletiser fence. Added to the agenda for next month's safety meeting, owned by maintenance.",
          rightLabel: "Line B",
          right:
            "Broken emergency stop on the palletiser fence. Told the shift manager in person at 11:10 and the site safety adviser by telephone at 11:15, and recorded in the safety log.",
          correct: "right",
          why: "Line B is right. An emergency stop that does not work is escalated today, to named roles at stated times, and recorded.",
          wrong:
            "Look again at Line A. A broken emergency stop is one of the findings that cannot wait for a meeting. It is escalated before the end of the shift to the responsible person and the safety contact.",
        },
      },
      check: {
        kind: "scenario",
        prompt: "Answer each question with the move this course teaches. You need six of the seven to pass.",
        passMark: 6,
        why: "You applied the course's moves to situations you had not seen before: describing protection, naming stops, recognising defeated safeguards, asking to be shown, and escalating what cannot wait.",
        questions: [
          {
            id: "cobot-brochure",
            situation:
              "Northgate Engineering in Stoke has installed a collaborative arm that places parts into a press. The supplier's handover sheet says the arm is collaborative and needs no guarding. The press beside it has an open front where the arm reaches in.",
            question: "On your walk, what is the right way to think about how this station protects people?",
            options: [
              {
                id: "a",
                text: "Accept that the station is safe, because the supplier has confirmed the arm is collaborative.",
                feedback:
                  "Collaborative describes an application that has been assessed, not a property of the arm. The open press is a hazard in its own right. Ask how each hazard is controlled and which measure does it.",
              },
              {
                id: "b",
                text: "Ask to be shown what keeps a person out of the press and what limits the arm when someone is beside it, and where the risk assessment covers both.",
                correct: true,
                feedback:
                  "That holds. You are asking for each measure and which way it protects people, and you are not letting the word collaborative stand in for an answer about the press.",
              },
              {
                id: "c",
                text: "Tell the cell leader to put a fence around the whole station before it runs again.",
                feedback:
                  "You may be right that something is missing, but designing the guarding is not the floor walk's job. Find out how the station is meant to protect people, and escalate if it does not.",
              },
            ],
          },
          {
            id: "aisle-stops",
            situation:
              "At Castlemere Distribution, the mobile robot in aisle 4 makes a protective stop about ten times an hour at the same corner. The team leader, Jas Bains, has logged each one as a fault and asked maintenance whether the scanner's protective zone can be made smaller.",
            question: "What should you do?",
            options: [
              {
                id: "a",
                text: "Support the request, because fewer stops will reduce the temptation to work around the robot.",
                feedback:
                  "Shrinking a protective zone to reduce stops is how a safeguard gets defeated. The stops are the scanner working. The cause is at the corner, and that is what needs to change.",
              },
              {
                id: "b",
                text: "Escalate the stops today to the site safety adviser as a defeated safeguard.",
                feedback:
                  "Nothing has been defeated yet. The scanner is stopping the robot as designed. Frequent protective stops go to the review, and the request to change the settings is something to stop, not to escalate as a defeat.",
              },
              {
                id: "c",
                text: "Explain that these are protective stops, ask that the scanner settings are not changed outside the site's safety arrangements, and raise the corner layout at the review with an owner.",
                correct: true,
                feedback:
                  "That holds. A protective stop is not a fault. The pattern tells you the corner is too tight or people are cutting through, which is a layout problem for the review with an owner.",
              },
              {
                id: "d",
                text: "Ask the pickers to stay out of aisle 4 while the robot is working and leave the settings as they are.",
                feedback:
                  "An instruction on the spot may create a new problem in a process you do not fully understand. Record the pattern and raise the layout at the review with an owner, and ask that the settings are left alone.",
              },
            ],
          },
          {
            id: "muting-bracket",
            situation:
              "At Fenbrook Foods, you notice a small bracket clamped over a muting sensor on the light curtain at the palletiser infeed, so the curtain is muted all the time. The operator, Lewis Grant, says the engineers know about it and that it stops nuisance trips.",
            question: "What is the right response?",
            options: [
              {
                id: "a",
                text: "Treat it as a defeated safeguard, escalate it before the end of the shift to the shift manager and the site safety adviser, and record who you told and when.",
                correct: true,
                feedback:
                  "That holds. A light curtain muted all the time no longer protects anyone. That the engineers know makes it more serious, not less, and it is escalated today.",
              },
              {
                id: "b",
                text: "Record it for the review, since the engineers are already aware of it.",
                feedback:
                  "A defeated safeguard does not become acceptable because it is known about. The next person to reach into the infeed could be hurt, so it is escalated today, not at the review.",
              },
              {
                id: "c",
                text: "Remove the bracket yourself so that the light curtain works again.",
                feedback:
                  "Changing a safeguard yourself may start or stop the cell in ways you do not expect, and it removes the evidence. Escalate it today to the people responsible and let them act.",
              },
            ],
          },
          {
            id: "jam-question",
            situation:
              "You are walking the robot cell that loads a CNC lathe at Brindley Precision. The shift log shows eleven jams at the parts chute last week. You have five minutes with the operator, Anya Kowalski.",
            question: "Which question is most likely to show you how the cell really runs?",
            options: [
              {
                id: "a",
                text: "Do you always lock off before you clear a jam?",
                feedback:
                  "This invites yes, and yes is both the honest and the convenient answer. Ask to be shown what she did the last time instead.",
              },
              {
                id: "b",
                text: "Is the jam procedure clear enough?",
                feedback:
                  "This asks for an opinion and invites yes. It will not tell you what happens at the chute. Ask to be shown a real jam.",
              },
              {
                id: "c",
                text: "Has everyone on the shift been trained on the chute?",
                feedback:
                  "Training records matter, but the answer will be yes and you will learn nothing about the chute. Ask to be shown what actually happens.",
              },
              {
                id: "d",
                text: "Show me what you did the last time the chute jammed.",
                correct: true,
                feedback:
                  "That holds. It asks to be shown and asks about a real event, so you will see whether the practice at the chute matches the procedure.",
              },
            ],
          },
          {
            id: "hand-contact",
            situation:
              "At Northgate Engineering, a maintenance technician, Ollie Price, mentions over coffee that a cobot closed on the back of his hand last Thursday while he was adjusting a fixture. He was not hurt and did not report it. The cobot has run normally since.",
            question: "What should you do today?",
            options: [
              {
                id: "a",
                text: "Note it for the review, since there was no injury and the cobot has run normally since.",
                feedback:
                  "Any contact between a robot and a person is escalated the same day, whether or not anyone was hurt. It may mean a setting or a safeguard is not working. No injury is luck, not a reason to wait.",
              },
              {
                id: "b",
                text: "Tell the area manager and the site safety adviser before the end of the shift, record it, and leave the decision about RIDDOR reporting to the responsible person.",
                correct: true,
                feedback:
                  "That holds. Contact is escalated today, and whether it must be reported to the HSE is decided by the responsible person, who can only decide if they know.",
              },
              {
                id: "c",
                text: "Decide that it is not reportable under RIDDOR, because there was no injury, and ask Ollie to be more careful.",
                feedback:
                  "Deciding whether to report is not the floor walk's job, and a reminder to be careful does not find out why the cobot closed on him. Escalate it today and let the responsible person decide.",
              },
            ],
          },
          {
            id: "note-line",
            situation:
              "On your walk of robot cell 3 at Harrowgate Components you found a spare key in the gate interlock and told the shift manager. You are now writing the escalation line of your floor walk note at the end of the afternoon.",
            question: "Which escalation line should go in the note?",
            options: [
              {
                id: "a",
                text: "Gate interlock issue on cell 3 dealt with.",
                feedback:
                  "This does not say what the finding was, who was told, or when. A reader cannot tell whether the defeated safeguard reached anyone who could act. Name the finding, the role, and the time.",
              },
              {
                id: "b",
                text: "Spare key found in cell 3 gate interlock. Will be discussed at the safety meeting on the 14th.",
                feedback:
                  "A defeated safeguard is escalated today, not at a meeting. The line must show who was told before the end of the shift, and when.",
              },
              {
                id: "c",
                text: "Spare key in the cell 3 gate interlock: told the shift manager in person at 14:20 and the site safety adviser by telephone at 14:30. Key removed at 14:25. Recorded in the safety log.",
                correct: true,
                feedback:
                  "That holds. The line names the finding, each role told, the time, and what happened, so anyone reading the note can see it was acted on the same day.",
              },
            ],
          },
          {
            id: "inside-cell",
            situation:
              "Walking past the palletiser at Castlemere Distribution, you see a temporary worker, Kofi Mensah, step over the low fence into the cell to pick up a fallen case while the robot is still stacking. The shift manager is at the other end of the building.",
            question: "What do you do first?",
            options: [
              {
                id: "a",
                text: "Press the nearest emergency stop, then make sure Kofi is clear and tell the shift manager.",
                correct: true,
                feedback:
                  "That holds. A person in immediate danger is the case the emergency stop exists for. Stop the machine first, then escalate, and leave the reset to the person responsible.",
              },
              {
                id: "b",
                text: "Go and find the shift manager so that they can deal with it.",
                feedback:
                  "Kofi is in danger now, and the shift manager is at the other end of the building. Press the emergency stop first, then escalate.",
              },
              {
                id: "c",
                text: "Call out to Kofi to come out, and write it up for the review.",
                feedback:
                  "Calling out may startle him inside the robot's reach, and entry under power is escalated today, not at the review. Press the emergency stop first, then tell the shift manager.",
              },
            ],
          },
        ],
      },
      bridge:
        "The last lesson asks you to write the floor walk note that records a walk like these. That note is what appears on your record.",
    },
    {
      id: "the-floor-walk-note",
      title: "The floor walk note",
      emphasis: "note",
      place:
        "This is the final lesson. You write the artefact of the course, a floor walk note for one robot cell, and it is what your signed record shows.",
      sections: [
        {
          heading: "What the note is",
          paragraphs: [
            "The floor walk note is the written record of one floor walk. It is written the same day, in plain sentences, and it records what you saw, what you asked, what you were shown, and what you did about it. A colleague who was not there should be able to read it and know which cell you walked, how that cell protects people, what you found, and who now owns each finding.",
            "The note has five parts. The first gives the cell, the date, and the time. The second describes how the cell protects people, using the labels from the first lesson. The third records the questions you asked and what you were shown. The fourth records what you escalated today, to whom, and when. The fifth lists what you will raise at the review, with an owner for each item.",
          ],
        },
        {
          heading: "What the note is not",
          paragraphs: [
            "The note is not an inspection report, a risk assessment, or a safety sign-off, and it does not certify that the cell is safe or that it meets any regulation or standard. Do not write that the cell is compliant, or that it is safe. You are not in a position to say so, and a reader may rely on the sentence. Write what you saw and what you were shown.",
            "It is also not a list of impressions. 'Gate seemed fine' and 'operator knows the procedure' record your opinion, not the cell. 'Operator opened the gate at the end of the cycle and the robot stopped with a gate-open message' records something another person could check. Where you could only see that a safeguard appears to work, say that.",
          ],
          beforeAfter: {
            before: "Walked cell 5. Looked OK. Spoke to the operator about the jams. Will follow up.",
            after:
              "Cell 5, Harrowgate Components, walked on 9 October at 13:45. I asked the operator to show me what he does when the outfeed jams. He showed me that he pauses the robot at the pendant and reaches through the outfeed. It last jammed about an hour before I arrived.",
            reading:
              "The first version cannot be checked or acted on. The second gives the cell, the date, and the time, and it records a question that asked to be shown and exactly what the manager saw.",
          },
        },
        {
          heading: "Writing each part well",
          paragraphs: [
            "In the protection part, name each measure and say whether it keeps the person out or lets the person in, with a limit. In the questions part, write at least one question that asked to be shown or asked when something last happened, and record what you were shown in reply. If a question could only be answered yes or no, it is unlikely to have taught you much, and the note will show it.",
            "In the escalation part, name each finding, the role of each person you told, how you told them, and the time. If you escalated nothing, write 'nothing escalated today', so the reader knows you considered it. Every finding that is a defeated safeguard, a missing or blocked emergency stop, a contact, or an unexpected motion belongs here and not in the review part. In the review part, give every item an owner by role, for example 'owned by the production engineer', and link causes to the findings they produced.",
          ],
        },
      ],
      workedExample: {
        title: "The note for case packer 2",
        inputLabel: "The manager's notes from the walk",
        outputLabel: "The floor walk note she filed",
        prompt:
          "Priya Nair's notes from case packer 2 at Fenbrook Foods: what she saw at the gate, the light curtain, and the scanner; the questions she asked the operator about jams; and her sorting of findings into escalate today and raise at the review, with the times she told people.",
        output:
          "Cell: case packer 2, Fenbrook Foods, walked on 9 October at 13:45. Protection: fenced with an interlocked gate, which keeps the person out; a light curtain across the outfeed, which keeps the person out; an area scanner at the infeed, which lets the person in, with a limit, by slowing and then stopping the robot. Questions and what I was shown: I asked the operator to show me what he does when the outfeed jams. He showed me that he pauses the robot at the pendant and reaches through the outfeed. I asked when it last jammed. He said about an hour ago, and that it jams several times a shift. I asked who can change the program if the jam keeps happening, and he did not know. I saw a spare key in the gate interlock and a box of labels inside the scanner's field. Escalated today: the spare key and the reaching through the outfeed, told to the shift manager in person at 14:20 and the site safety adviser by telephone at 14:30, and recorded in the safety log. The key was removed at 14:25. I asked the controls engineer at 14:35 to confirm today whether the scanner has been reconfigured or muted around the box. To raise at the review: frequent outfeed jams, the likely reason for reaching in, owned by the production engineer; worn floor markings near the cell, owned by facilities.",
        reading: [
          "The first two parts tell a stranger which cell was walked, when, and how it is meant to protect people, measure by measure.",
          "The questions part shows a manager who asked to be shown and asked about a real event, and it records the answer she did not want to hear alongside the one she did.",
          "The escalation part names each finding, each role, each time, and the log entry. The open question about the scanner has a named person and a deadline of today. The review part gives each item an owner and links the jams to the reaching, so the cause will be fixed as well as the symptom.",
        ],
      },
      practice: {
        intro:
          "Here is a weak note from a walk. Rewrite it in the box so that it records something you were shown, who you told about the gate, and that you told them today. Keep the gate in the note. The before and after above shows the level of detail that works.",
        check: {
          kind: "edit",
          label: "The note you are rewriting",
          prompt: "Rewrite this floor walk note so that it records what was shown, and who was told about the gate today.",
          start: "Walked the palletiser. All fine. Spoke to the operator. Mentioned the gate to someone.",
          unchanged:
            "You have not changed the note yet. Record something the operator showed you, and say who you told about the gate and that it was today.",
          limitWording: false,
          limits: [
            {
              id: "shown",
              any: ["showed me", "shown", "show me"],
              missing:
                "Your note does not yet record anything you were shown. Add what the operator showed you when you asked.",
            },
            {
              id: "who",
              any: ["shift manager", "safety adviser", "supervisor", "team leader", "area manager"],
              missing: "Your note does not yet say who you told about the gate. Name their role.",
            },
            {
              id: "when",
              any: ["today", "this morning", "this afternoon", "at 1", "at 0", "at 2"],
              missing: "Your note does not yet say when you told them. Give the time, or say it was today.",
            },
          ],
          keep: [
            {
              id: "gate",
              any: ["gate"],
              missing: "Your note no longer mentions the gate. Keep the finding in the note.",
            },
          ],
          why: "Your note now records something you were shown and escalates the gate the same day to a named role.",
          result: {
            label: "How the note might read",
            text: "Walked the palletiser at 10:15. I asked the operator to show me what he does when a case falls inside the cell, and he showed me the lockout point he uses. The gate was tied open with a cable tie while the robot ran. Told the shift manager in person at 10:30 today and the site safety adviser by telephone at 10:40.",
          },
        },
      },
      check: {
        kind: "build",
        prompt:
          "Write the floor walk note for one robot cell you have walked or will walk. Each part has to record what you saw, asked, and did.",
        why: "Your note records the cell and when you walked it, how it protects people, the questions you asked and what you were shown, what you escalated today with who and when, and what goes to the review with owners.",
        fields: [
          {
            id: "cell",
            label: "Cell, date, and time",
            hint: "Name the cell and the site, and give the date and the time you walked it, for example 'Case packer 2, Fenbrook Foods, 9 October at 13:45'.",
            min: 12,
            rule: "fact",
            missing:
              "Your first part does not yet give the cell's name, the date, or the time. Add the date and the time you walked it.",
          },
          {
            id: "protection",
            label: "How the cell protects people",
            hint: "Name each measure, such as a fence, an interlocked gate, a light curtain, or a scanner, and say whether it keeps the person out or lets the person in, with a limit.",
            min: 40,
            any: [
              "keeps the person out",
              "keep the person out",
              "lets the person in",
              "with a limit",
              "fence",
              "interlock",
              "light curtain",
              "scanner",
              "guard",
              "force limit",
            ],
            missing:
              "Your protection part does not describe any measure. Say how the cell keeps people out or lets them in with a limit, and name the measure.",
          },
          {
            id: "questions",
            label: "Questions asked and what I was shown",
            hint: "Write the questions you asked, including at least one that asked to be shown or asked when something last happened, and what you were shown in reply.",
            min: 40,
            any: ["show me", "showed me", "shown", "when did", "when was", "last time", "last jam", "last tested"],
            missing:
              "Your questions part contains only questions that can be answered yes or no. Include at least one that asks to be shown or asks when something last happened, and what you saw.",
          },
          {
            id: "escalated",
            label: "Escalated today, to whom, and when",
            hint: "Name each finding, the role of each person you told, how you told them, and the time. If you escalated nothing, write 'nothing escalated today'.",
            min: 20,
            rule: "fact",
            any: [
              "shift manager",
              "safety adviser",
              "supervisor",
              "team leader",
              "area manager",
              "operations manager",
              "site manager",
              "production manager",
              "nothing escalated today",
            ],
            missing:
              "Your escalation part does not name who you told and when. Add the role and the time, or write nothing escalated today so the reader knows you considered it.",
          },
          {
            id: "review",
            label: "To raise at the review, with owners",
            hint: "List each item for the next review and give it an owner by role, for example 'owned by the production engineer'.",
            min: 20,
            any: ["owned by", "owner", "owns"],
            missing:
              "One item for the review has no owner. Name a role for each item, for example owned by the production engineer.",
          },
        ],
      },
      bridge:
        "That is the course. Your note shows that you looked at a robot cell, asked to be shown how it really runs, and made sure the right people knew the same day about anything that could not wait.",
    },
  ],
};
