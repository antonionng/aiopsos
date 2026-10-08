/*
Course: Specifying a Robotics Project
Slug: specifying-a-robotics-project
For: Engineering managers, project leads, operations managers, and procurement professionals who write or approve the
  specification for a robot cell before it goes to suppliers or integrators. They already know the process to be
  automated and the business reason for automating it.
Outcome: The learner writes a one-page specification that states outcomes rather than equipment, gives each outcome an
  acceptance condition with a test, the parts, a duration, and a pass mark, describes volume with a peak and the
  exceptions with samples, names who owns each kind of stop and who is responsible for the complete cell, and removes
  the phrases a vendor could later hide behind.
Artefact: The one-page specification.
Record sentence: Wrote and signed a one-page robotics specification that a supplier must answer line by line and could
  be held to at acceptance.
Lessons (id, title, move, interaction, pass rule):
  1. outcomes-not-equipment, Outcomes, not equipment. Separate outcomes from equipment choices. Mark.
     Pass: every sentence marked Outcome or Equipment choice correctly.
  2. how-it-will-be-measured, How it will be measured. Attach an acceptance condition with four parts. Choose.
     Pass: the clause with a test, your parts, a duration, and a pass mark.
  3. volume-and-exceptions, Volume and exceptions. Give a range, a peak, exceptions, and samples. Edit.
     Pass: the edit keeps the trays, and adds a peak, a frequency or "not yet measured", and a commitment to samples.
  4. who-owns-the-stop, Who owns the stop. Name owners for stop, restart, change, call-out, and the complete cell. Mark.
     Pass: every sentence marked Names an owner or Leaves the owner open correctly.
  5. where-a-vendor-can-hide, Where a vendor can hide. Find wording that commits nobody. Mark.
     Pass: every sentence marked A vendor can hide behind this or A vendor can be held to this correctly.
  6. course-assessment, Course assessment: judging a specification. Apply every move to new cases. Scenario.
     Pass: at least five of six questions right.
  7. the-specification, The specification. Write the artefact. Build.
     Pass: outcomes with a measurable result, acceptance with a pass mark, volume with a peak, exceptions with a
     commitment to samples, owners naming the complete cell or "open", and a dated wording check.
Sources: UK Health and Safety Executive guidance on the Supply of Machinery (Safety) Regulations 2008 and on buying new
  machinery; ISO 10218-2; ISO 12100; IEC 62381 for the structure of factory and site acceptance testing; ISPE GAMP 5 for
  the practice of a user requirement specification; the Made Smarter programme's public guidance for UK manufacturers.
Tested on phone:          no
Tested returning learner: no
Pass rule tests written:  yes
*/
import type { CourseContent } from "./types.ts";

const OUTCOME = "Outcome";
const EQUIPMENT = "Equipment choice";
const FOUR_PARTS = "All four parts";
const PART_MISSING = "A part is missing";
const NAMES_OWNER = "Names an owner";
const OWNER_OPEN = "Leaves the owner open";
const HELD = "A vendor can be held to this";
const HIDE = "A vendor can hide behind this";
const READY = "Ready to send to suppliers";
const ANOTHER_PASS = "Needs another pass";

export const COURSE: CourseContent = {
  slug: "specifying-a-robotics-project",
  hours: 2.5,
  artefact: {
    lessonId: "the-specification",
    title: "The one-page specification",
    recordLine:
      "Wrote and signed a one-page robotics specification that a supplier must answer line by line and could be held to at acceptance.",
  },
  lessons: [
    {
      id: "outcomes-not-equipment",
      title: "Outcomes, not equipment",
      emphasis: "Outcomes",
      place:
        "This is the first of seven lessons and the start of the first module. It sets the principle the rest of the course depends on: a specification describes what must be true when the cell is working, and it leaves the supplier to decide how to make it true.",
      sections: [
        {
          heading: "What an outcome is",
          paragraphs: [
            "An outcome is a statement of what must be true when the cell is running in production. It can be the number of good parts per hour, the quality standard those parts must meet, the time allowed for a changeover, the part numbers the cell must handle, or how long it must run without a person. Each of these can be seen and measured by someone who was not in the room when the specification was written.",
            "An equipment choice is a statement about how that result will be achieved. A six-axis robot, a vision system from a named maker, a vacuum gripper, and a particular conveyor are all equipment choices. They describe the solution rather than the need, and they are the words that tend to appear first in a draft, because they are the things people have seen at trade shows and on other sites.",
          ],
        },
        {
          heading: "Why the difference decides who carries the risk",
          paragraphs: [
            "When a specification is made of equipment choices, a supplier can deliver exactly what was asked for and still hand over a cell that does not meet the need. If you asked for a six-axis robot with a 20 kilogram payload and a twin gripper, and the cell cannot keep up with your lathes, the supplier has done what you asked. You chose the equipment, so you carry the consequence.",
            "When a specification is made of outcomes, the supplier takes responsibility for choosing equipment that achieves them. They have to look at your parts, your cycle times, and your changeovers, and propose something that will reach the numbers you wrote down. If it does not, the gap is theirs to close. This is the single largest shift in risk available to a buyer, and it costs nothing but a careful rewrite of the first page.",
          ],
        },
        {
          heading: "When equipment belongs in the specification",
          paragraphs: [
            "There are good reasons to name some equipment. Your site may standardise on one robot controller so that maintenance staff are trained on it and spares are shared across lines. Your IT policy may require a particular programmable logic controller family, or your insurer may expect a certain kind of guarding. These are real requirements, and a supplier needs to know them before they quote.",
            "State each of these as a constraint, with the reason beside it. A line such as 'Robot controller from the site's approved list, to match existing spares' tells the supplier what is fixed and why, so they can design around it. What a constraint must not become is the whole specification. If every line names a device, you have written a shopping list, and the supplier is entitled to deliver the shopping list.",
          ],
          beforeAfter: {
            before: "Use a vacuum gripper.",
            after:
              "The cell must pick cartons from 200 to 600 millimetres long without marking the printed faces. Constraint: vacuum cups from our approved list, because we hold spares for the existing palletiser.",
            reading:
              "The first line chooses a device. The second states the result the device was meant to secure, and keeps the gripper as a constraint with its reason.",
          },
        },
        {
          heading: "The mistake people usually make",
          paragraphs: [
            "The usual mistake is to write the solution you have already imagined and call it a requirement. A project lead visits a site with a delta robot on a packing line, and the first draft says 'delta robot'. Nobody wrote down the packing rate, the bottle sizes, or the changeover time, so no supplier can tell whether a delta robot is the right answer, and no one can prove afterwards that it was the wrong one.",
            "The test for each sentence is simple. Ask what would be true if this sentence were met. If the answer is a result you can measure, the sentence is an outcome. If the answer is only that a device has been installed, the sentence is an equipment choice, and you need to find the outcome behind it or mark it as a constraint with a reason.",
          ],
        },
      ],
      workedExample: {
        title: "Rewriting a machine-tending brief at Harrow Precision",
        inputLabel: "The first draft",
        outputLabel: "The rewritten outcomes",
        prompt:
          "Supply one six-axis robot with a payload of 20 kilograms, a twin gripper, a vision system, and guarding, to load our two lathes.",
        output:
          "The cell must load and unload lathes 1 and 2 for part numbers 4410 and 4415. It must deliver at least 60 good parts per hour across both lathes, with the lathes' own cycle times unchanged. It must run unattended for at least two hours from a full infeed. Changeover between the two part numbers must take no more than 20 minutes. Constraint: robot controller from our approved list, to match existing spares.",
        reading: [
          "Dev Malhotra, the project lead at Harrow Precision, wrote the first draft after seeing a similar cell at a trade show. Every item in it is a device. It says nothing about which parts, how many per hour, or how long the cell must run alone, so a supplier could meet it in full and still starve the lathes.",
          "The rewrite names the machines and the part numbers, then gives three measurable results: the rate, the unattended time, and the changeover time. Each of them is something a person could stand beside the cell and check with a clock and a count.",
          "One equipment line survives, and it survives as a constraint with a reason. The figures belong to this example, and your own will differ, but the shape of the rewrite is the move this lesson teaches.",
        ],
      },
      practice: {
        intro:
          "Here are three sentences from a draft for a label-applying cell. Mark each one using the two labels from this lesson. The test from the last section is still above: ask what would be true if the sentence were met.",
        check: {
          kind: "mark",
          prompt: "Mark each sentence as Outcome or Equipment choice.",
          passLabel: OUTCOME,
          failLabel: EQUIPMENT,
          sentences: [
            {
              id: "rate",
              text: "The cell must label at least 40 jars per minute with the label within 1 millimetre of the seam.",
              fail: false,
              why: "It states a rate and a placement tolerance that can be measured, so it is an outcome.",
            },
            {
              id: "applicator",
              text: "Fit a servo-driven label applicator.",
              fail: true,
              why: "It names a device and says nothing about the result the device must achieve, so it is an equipment choice.",
            },
            {
              id: "formats",
              text: "The cell must handle the 250 gram and 400 gram jars without a tool change.",
              fail: false,
              why: "It states which products the cell must handle and a condition that can be checked, so it is an outcome.",
            },
          ],
          why: "That is right. The rate and the formats are results you could check at the cell, and the applicator is a device someone had already chosen.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "Here are sentences from a draft specification for a case-packing cell at Kestrel Drinks. Mark each sentence as Outcome or Equipment choice.",
        passLabel: OUTCOME,
        failLabel: EQUIPMENT,
        sentences: [
          {
            id: "cases",
            text: "The cell must pack at least 20 cases per minute of 12 bottles each.",
            fail: false,
            why: "This says what the cell must achieve, not how. That is an outcome.",
          },
          {
            id: "delta",
            text: "Use a delta robot with a vacuum gripper.",
            fail: true,
            why: "This names the type of robot and gripper. That is an equipment choice. Ask what outcome it was meant to secure.",
          },
          {
            id: "changeover",
            text: "Changeover between the 500 millilitre and 1 litre bottle must take no more than 15 minutes.",
            fail: false,
            why: "This states a result with a time limit that can be measured at acceptance. That is an outcome.",
          },
          {
            id: "camera",
            text: "Include a camera to check bottle orientation.",
            fail: true,
            why: "A camera is a device. The outcome behind it is that no case leaves with a bottle in the wrong orientation. That sentence is an equipment choice.",
          },
        ],
        why: "You separated what the cell must achieve from the equipment someone had already chosen. The camera line is the one to rewrite first: the outcome is that no case leaves with a bottle the wrong way round, and the supplier can decide how to guarantee it.",
      },
      bridge:
        "An outcome is only useful if you can prove it at handover, and the next lesson writes the test that proves it.",
    },
    {
      id: "how-it-will-be-measured",
      title: "How it will be measured",
      emphasis: "measured",
      place:
        "This lesson completes the first module. In the last lesson you turned equipment into outcomes. Here you attach to each outcome the test that decides whether it has been met before you accept the cell.",
      sections: [
        {
          heading: "What an acceptance condition is",
          paragraphs: [
            "An acceptance condition says how you will decide that an outcome has been achieved. It is written before the order is placed, so that both sides know what the cell will be judged on. Without it, an outcome such as 'at least 60 good parts per hour' is a hope, because nobody has agreed when, on what, or for how long the count will be made.",
            "A complete acceptance condition has four parts. The first is the test, such as a continuous production run. The second is the parts, meaning your own parts from your own stores, in the range the specification describes, and not samples the supplier has chosen. The third is the duration or quantity, such as eight hours or 2,000 parts. The fourth is the pass mark, such as at least 60 good parts per hour averaged over the run with no more than three stops needing a person.",
          ],
        },
        {
          heading: "Factory and site acceptance",
          paragraphs: [
            "Many projects test twice. A factory acceptance test takes place at the supplier's premises before the cell is shipped, and it is the cheapest point at which to find a problem, because nothing has been installed. A site acceptance test takes place after installation on your floor, with your operators, your power, and your parts arriving the way they really arrive. IEC 62381 is a public reference for how the process industry structures these two tests, and many manufacturers borrow its shape.",
            "The specification should say what each test must show. The factory test often proves that the cell can handle every part, including the awkward ones. The site test proves the rate over a real shift. Writing both down stops the common situation where a good factory test is treated as the handover and the site test is quietly shortened.",
          ],
        },
        {
          heading: "What an acceptance condition is not",
          paragraphs: [
            "An acceptance condition is not a demonstration chosen by the supplier on the day. A demonstration runs the parts that behave, for as long as they behave, and it shows the cell at its best. That is useful for a sales visit, and it is no basis for signing off a cell that must run your worst parts on a Friday night shift.",
            "It is also not 'to the customer's satisfaction'. That phrase looks protective, but it gives neither side a number to point to. When the cell runs at 52 parts per hour, the supplier will say you should be satisfied and you will say you are not, and the argument will be settled by whoever has more patience or a better lawyer.",
          ],
          beforeAfter: {
            before: "The changeover time will be demonstrated at handover.",
            after:
              "Site acceptance: two changeovers between parts 4410 and 4415 during the eight-hour run, performed by our trained operator using the supplier's changeover card. Pass: each changeover completed in 20 minutes or less, measured from the last good part to the first good part.",
            reading:
              "The first line promises a demonstration. The second names the test, the parts, the quantity, who does it, how the time is measured, and the pass mark.",
          },
        },
        {
          heading: "The two labels for this lesson",
          paragraphs: [
            "In the practice you will judge acceptance clauses with two labels. A clause has All four parts when you can point to the test, your parts, a duration or quantity, and a pass mark. A clause has A part is missing when any one of the four cannot be found, however reassuring the rest of it sounds.",
            "The usual mistake is to write three of the four and stop. A clause that names a six-hour run on production parts but gives no pass mark leaves the supplier free to argue that any output counts. A clause with a pass mark but no mention of whose parts leaves them free to run the easy ones. Read each clause for all four, one at a time.",
          ],
        },
      ],
      workedExample: {
        title: "Giving the Harrow Precision outcome a test",
        inputLabel: "The outcome",
        outputLabel: "The acceptance condition",
        prompt: "The cell must deliver at least 60 good parts per hour across both lathes.",
        output:
          "Site acceptance: an eight-hour production run on part numbers 4410 and 4415, using production blanks from our stores, with one changeover during the run. Pass: at least 60 good parts per hour averaged over the run, excluding the changeover period; no more than three stops needing an operator; the changeover completed in 20 minutes or less.",
        reading: [
          "The test is an eight-hour production run, and the parts are production blanks from Harrow's own stores, so the supplier cannot bring a box of hand-picked blanks. The run includes a changeover, because the cell will change parts in real use.",
          "The pass mark has three numbers, and each of them came from the outcomes in the last lesson. The rate is averaged over the whole run, which stops a strong first hour from hiding a weak afternoon.",
          "The supplier now knows exactly what they will be judged on and can design for it. Dev no longer has to argue about whether a good day at the supplier's premises counts as handover.",
        ],
      },
      practice: {
        intro:
          "Here are three acceptance clauses from different projects. Mark each as All four parts or A part is missing. Look for the test, your parts, the duration or quantity, and the pass mark, one at a time.",
        check: {
          kind: "mark",
          prompt: "Mark each clause as All four parts or A part is missing.",
          passLabel: FOUR_PARTS,
          failLabel: PART_MISSING,
          sentences: [
            {
              id: "complete",
              text: "Site acceptance: a four-hour run on our production cartons of sizes B and C. Pass: at least 18 cartons per minute averaged over the run, with no more than two stops needing an operator.",
              fail: false,
              why: "It names the test, your cartons, four hours, and a pass mark, so all four parts are there.",
            },
            {
              id: "no-pass",
              text: "Factory acceptance: an eight-hour run on 500 of our castings.",
              fail: true,
              why: "It has a test, your parts, and a duration, but nothing says what result counts as a pass, so a part is missing.",
            },
            {
              id: "their-parts",
              text: "Factory acceptance: a two-hour run on the supplier's sample parts. Pass: at least 300 parts with no rejects.",
              fail: true,
              why: "The parts are the supplier's samples rather than yours, so the clause proves nothing about your parts and a part is missing.",
            },
          ],
          why: "That is right. Only the first clause has a test, your parts, a duration, and a pass mark. The second has no pass mark, and the third runs the supplier's parts.",
        },
      },
      check: {
        kind: "choose",
        prompt:
          "Two acceptance clauses have been written for a robotic welding cell at Ashby Frames. Choose the clause the supplier could not argue with afterwards.",
        leftLabel: "Clause A",
        left: "The cell will be accepted following a successful demonstration to the customer's satisfaction.",
        rightLabel: "Clause B",
        right:
          "Site acceptance: a six-hour run welding frame part 7702 from production-issue components. Pass: at least 40 frames welded, every frame passing the existing weld inspection standard WI-12, and no more than two stops needing an operator.",
        correct: "right",
        why: "Yes. Clause B states the test, your parts, the duration, and the pass mark, and it points to your existing inspection standard, so the result is decided by a count and an inspection rather than by opinion.",
        wrong:
          "Clause A has no test, no parts, no duration, and no pass mark. Successful and satisfaction can be argued either way. Choose the clause with all four parts.",
      },
      bridge:
        "Outcomes and tests depend on what the cell will actually meet on your floor, and the next lesson specifies the volume and the exceptions.",
    },
    {
      id: "volume-and-exceptions",
      title: "Volume and exceptions",
      emphasis: "exceptions",
      place:
        "This is the second module. You have outcomes and the tests that prove them. This lesson gives the supplier the facts they need to design for your reality rather than for your average.",
      sections: [
        {
          heading: "Suppliers design to the numbers they are given",
          paragraphs: [
            "A supplier sizing a cell starts from the rate you give them. If the specification says 400 parts per shift, they will design a cell that comfortably makes 400, and they may add a margin of their own choosing. If your busiest month needs 480, nobody designed for it, and the first peak after handover becomes an argument about whose number was wrong.",
            "Volume should therefore be given as a range. State the normal rate and where the figure comes from, such as the last six months of production records. State the peak, how high it goes, and how long it lasts. State the mix of part numbers, because a cell that is fast on one part and slow on another will miss its rate when the mix shifts.",
          ],
        },
        {
          heading: "Variation in the parts themselves",
          paragraphs: [
            "The drawing shows the part as designed. The cell will meet the part as made. Give the supplier the tolerances that matter for handling, the surface finish, whether parts arrive loose, in trays, on a conveyor, or tipped into a bin, and whether their orientation is controlled. A gripper that works on a clean, square blank can fail on one that is slightly oversize or oily.",
            "You do not need to know which variation will cause trouble. That is the supplier's expertise. Your job is to describe what arrives at the cell honestly, so that they can judge it and so that the facts are written down before anyone has a reason to disagree about them.",
          ],
        },
        {
          heading: "Exceptions, and the words not yet measured",
          paragraphs: [
            "An exception is a condition the cell will meet that is not the normal case: a blank with a burr, a part in the wrong orientation, a missing component, a warped tray, a label that has lifted. List each one, with how often it happens. If nobody has counted, write 'not yet measured'. That phrase is honest, it tells the supplier the exception is real, and it is far better than leaving the exception out or guessing a figure.",
            "Most importantly, commit to providing sample parts, including examples of the exceptions, by a stated date. A supplier who has handled 20 of your burred blanks before the factory test cannot later say they were never shown one. A commitment to samples is the sentence that turns a list of exceptions into something a supplier has to design for.",
          ],
          beforeAfter: {
            before: "Exceptions: some blanks have burrs.",
            after:
              "Exceptions: burred blanks on the cut end, not yet measured. Samples: we will supply 200 blanks of each part, including at least 20 burred blanks, before the factory acceptance test.",
            reading:
              "The first line mentions the exception. The second says how often it is known to happen, which here is not yet measured, and commits to putting examples in the supplier's hands.",
          },
        },
        {
          heading: "The mistake people usually make",
          paragraphs: [
            "The usual mistake is to give only the average rate and the drawing. That specification is not wrong, but it hands the supplier the defence that reality was outside what they were told. When the cell stops on the third burred blank of the morning, the supplier can point to the page and say burrs were never mentioned.",
            "The second mistake is to leave out an exception because nobody has a figure for it. Operators nearly always know which parts cause trouble, even when nobody has counted. Ask them, write the exception down, and mark it not yet measured. The supplier can then ask for more samples, propose a way to count, or price the risk openly.",
          ],
        },
      ],
      workedExample: {
        title: "The volume section at Harrow Precision",
        inputLabel: "The first draft",
        outputLabel: "The rewritten volume section",
        prompt: "Volume: 400 parts per shift.",
        output:
          "Volume: normal 350 to 420 parts per shift, measured over the last six months; peak 480 parts per shift for about four weeks before the summer shutdown. Mix: part 4410 about two-thirds, part 4415 about one-third. Parts: blanks cut from bar, length tolerance plus or minus 0.5 millimetres, occasionally with a burr on the cut end. Exceptions: burred blanks, not yet measured; blanks from a different bar batch with a slightly different diameter, about once a month. Samples: we will supply 200 blanks of each part, including at least 20 burred blanks, before the factory acceptance test.",
        reading: [
          "The single figure has become a range with its source, a peak with its duration, and a mix. A supplier sizing the cell can now see that it has to reach 480 for a month, not 400.",
          "The parts line gives the tolerance that matters for gripping and admits the burr. The exceptions line lists two exceptions, one counted and one not yet measured, and says so plainly.",
          "The samples line is the one that protects Harrow. Any later claim that the cell met only the average, or that burred blanks were a surprise, is answered on the page. The figures belong to this example.",
        ],
      },
      practice: {
        intro:
          "Here are two volume sections for a cell that loads a heat-treatment furnace at Tamar Castings. Choose the one that gives the supplier what this lesson asks for: a range, a peak, the variation, the exceptions, and samples.",
        check: {
          kind: "choose",
          prompt: "Choose the volume section a supplier could not later say left them uninformed.",
          leftLabel: "Section A",
          left:
            "Volume: normal 60 to 75 baskets a day from the last quarter's records; peak 90 baskets a day for about three weeks in October. Castings arrive loose in baskets, orientation not controlled. Exceptions: castings with sand still attached, about one basket in twenty; bent basket frames, not yet measured. Samples: we will supply six full baskets, including one with sand-coated castings and one bent frame, by 30 April.",
          rightLabel: "Section B",
          right:
            "Volume: approximately 70 baskets a day, as per drawing TC-118. Castings are of good quality and exceptions are rare. Further details can be provided on request.",
          correct: "left",
          why: "Section A gives the range with its source, the peak and how long it lasts, how the castings arrive, two exceptions with a frequency or not yet measured, and a dated commitment to samples including the exceptions.",
          wrong:
            "Look again at Section B. It gives one figure, no peak, and says exceptions are rare without naming any, and it commits to nothing. Section A gives the supplier everything this lesson named.",
        },
      },
      check: {
        kind: "edit",
        prompt:
          "This volume section for a tray-destacking cell at Pennine Fresh is missing parts the lesson named. Edit it so the supplier cannot say they were not told. Keep the trays, and add a peak, how often trays are warped or the words not yet measured, and a commitment to supply sample trays including warped ones.",
        label: "The volume section you are editing",
        start: "Volume: about 1,200 trays a day. Exceptions: some trays are warped.",
        unchanged:
          "You have not changed the volume section yet. Add the peak, how often trays are warped or not yet measured, and a commitment to supply sample trays including warped ones.",
        keep: [
          {
            id: "trays",
            any: ["tray"],
            missing: "Keep the trays. The section should still say what the cell handles.",
          },
        ],
        limitWording: false,
        limits: [
          {
            id: "peak",
            any: ["peak"],
            missing: "Your section gives only the daily figure. Add the peak and how long it lasts.",
          },
          {
            id: "frequency",
            any: [
              "not yet measured",
              "not measured",
              "per week",
              "a week",
              "each week",
              "per shift",
              "per batch",
              "in every",
              "out of",
              "per cent",
              "percent",
              "%",
              "once",
              "twice",
              "times",
            ],
            missing:
              "Your exception says some trays are warped, but not how often. Add a frequency, or write not yet measured.",
          },
          {
            id: "samples",
            any: ["sample"],
            missing:
              "Your section does not commit to supplying samples. Add how many trays you will supply, including warped ones, and by when.",
          },
        ],
        why: "Yes. The supplier now has the peak, how often the exception happens or that it is not yet known, and a promise of samples including the exception, so a cell that jams on warped trays in December is a design problem they were told about.",
        result: {
          label: "A section that would pass",
          text: "Volume: normal 1,100 to 1,250 trays a day, from the last six months of dispatch records; peak 1,500 trays a day for the six weeks before Christmas. Exceptions: warped trays, not yet measured. Samples: we will supply 300 trays, including at least 30 warped trays, before the factory acceptance test.",
        },
      },
      bridge:
        "Knowing what the cell will meet, the next lesson asks who owns it when it stops.",
    },
    {
      id: "who-owns-the-stop",
      title: "Who owns the stop",
      emphasis: "owns",
      place:
        "This is the third module. The cell now has outcomes, tests, and a true picture of its parts. This lesson names the people and responsibilities that suppliers and buyers most often leave open.",
      sections: [
        {
          heading: "Every cell stops",
          paragraphs: [
            "A robot cell will stop. Some stops are for safety, such as a door opened or a light curtain broken. Some are ordinary, such as a part dropped, a feeder run empty, or a program fault. A specification that describes only the running cell has said nothing about the moments when the cell is not running, and those are the moments when people make decisions under pressure.",
            "The specification must say who owns each part of a stop. There are five questions. Who may stop the cell in normal use, and how? Who may restart it after each kind of stop? Who may change programs, positions, or safety settings, and how are those changes recorded? Who is called when the operator cannot recover a stop, at each time of day, and for how long will the supplier support that? Who is responsible for the safety of the complete cell as a machine?",
          ],
        },
        {
          heading: "The complete cell as a machine",
          paragraphs: [
            "The last question matters most because a cell is usually assembled from parts made by different companies: a robot from one maker, conveyors from another, guarding from a local fabricator, and a vision system from a fourth. Each part may arrive with its own paperwork, but the assembled cell is a machine in its own right, and someone has to take responsibility for its risk assessment, its conformity marking, its declaration, and its technical file.",
            "In the UK, the Supply of Machinery (Safety) Regulations 2008 place duties on whoever supplies or puts into service the complete machine, and the Health and Safety Executive publishes guidance on buying new machinery. This lesson does not tell you who that is in your project, because it depends on your contract and your arrangements. It teaches you to make sure the specification names who it will be, agreed in writing and with competent advice, so the question is answered before the cell is built.",
          ],
        },
        {
          heading: "The two labels for this lesson",
          paragraphs: [
            "A sentence Names an owner when it gives a role or an organisation for the question it answers, such as 'the site controls engineer' or 'the integrator, as set out in the contract'. It is stronger still when it says how the action is recorded or for how long it applies. A named role can be checked: you can ask that person, or look in the log they keep.",
            "A sentence Leaves the owner open when it does not name anyone. 'Support will be provided', 'the cell will be safe', and 'operators will be trained' all sound complete, and none of them tells you who to call at two in the morning or who signs the declaration. When you do not yet know the owner, write the word open beside the question. An open gap that everyone can see is safer than a sentence that hides it.",
          ],
          beforeAfter: {
            before: "The supplier will provide support.",
            after:
              "Call when an operator cannot recover a stop: the shift engineer on days and nights; supplier remote support by telephone within four working hours for twelve months from site acceptance.",
            reading:
              "The first line names the supplier in general and nothing else. The second names who is called first, what the supplier provides, how fast, and for how long.",
          },
        },
        {
          heading: "The mistake people usually make",
          paragraphs: [
            "The usual mistake is to write a responsibilities section that sounds finished and names nobody. A line such as 'The cell will be CE or UKCA marked as appropriate' reads as a commitment, but it does not say who will do the marking, who holds the technical file, or who decides what is appropriate. When the question matters, usually after an incident or a change, there is no name on the page.",
            "The second mistake is to leave restart and program changes to custom. If anyone can restart after an emergency stop, the cause may never be found. If anyone can edit a robot position, the cell that passed acceptance is no longer the cell on the floor. Naming an owner for each is not bureaucracy. It is how the cell you accepted stays the cell you run.",
          ],
        },
      ],
      workedExample: {
        title: "The responsibilities section at Harrow Precision",
        inputLabel: "The first draft",
        outputLabel: "The rewritten responsibilities",
        prompt:
          "The supplier will provide support. The cell will be CE or UKCA marked as appropriate. Operators will be trained.",
        output:
          "Normal stop: operators, from the pendant or the cell panel. Restart after a protective stop: trained operators, following the recovery card. Restart after an emergency stop: the shift team leader, after the cause is found. Program and safety setting changes: the site's robot engineer only, recorded in the change log. Call when an operator cannot recover: shift engineer on days and nights; supplier remote support by telephone for twelve months from site acceptance. Responsibility for the complete cell as a machine, including risk assessment, conformity marking, declaration, and technical file: the integrator, as agreed in the contract.",
        reading: [
          "The first version sounds complete, but it names only the supplier in general and leaves every one of the five questions open. Nobody reading it could say who may restart the cell after an emergency stop.",
          "The rewrite answers each question with a role. It separates a protective stop, which a trained operator may recover, from an emergency stop, which needs the team leader and a cause. It limits program changes to one person and says where they are recorded.",
          "The last line answers the question that is most expensive to leave open. At Harrow the integrator takes responsibility for the complete cell, and the line points to the contract where that is agreed. Your project may place it elsewhere, and the specification should say where.",
        ],
      },
      practice: {
        intro:
          "Here are two lines answering the same question for a machine-tending cell. Choose the one that names an owner. The definition of the two labels is in the section above.",
        check: {
          kind: "choose",
          prompt: "Choose the line that answers who may restart the cell after an emergency stop.",
          leftLabel: "Line A",
          left: "Restart after an emergency stop will be handled appropriately by site staff.",
          rightLabel: "Line B",
          right:
            "Restart after an emergency stop: the shift team leader only, after the cause has been found and recorded in the stop log.",
          correct: "right",
          why: "Line B names the shift team leader, limits restart to that role, and says the cause must be found and recorded first. Line A names no role and leaves appropriately to be decided in the moment.",
          wrong:
            "Look again at Line A. Site staff could mean anyone, and appropriately is decided by whoever is standing there. Line B names the role and the condition for restart.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "Here are sentences from a responsibilities section for a palletising cell at Norbury Foods. Mark each as Names an owner or Leaves the owner open.",
        passLabel: NAMES_OWNER,
        failLabel: OWNER_OPEN,
        sentences: [
          {
            id: "changes",
            text: "Changes to robot programs are made only by the site controls engineer and recorded in the change log.",
            fail: false,
            why: "This names the site controls engineer and a record. That names an owner.",
          },
          {
            id: "support",
            text: "Appropriate support will be provided after handover.",
            fail: true,
            why: "Appropriate support names nobody and gives no period. That leaves the owner open.",
          },
          {
            id: "safe",
            text: "The cell will be safe.",
            fail: true,
            why: "This states a hope. It does not name who is responsible for the risk assessment, conformity, and documentation of the complete cell. That leaves the owner open.",
          },
          {
            id: "integrator",
            text: "The integrator is responsible for the risk assessment, conformity marking, and technical file of the complete cell, as set out in the contract.",
            fail: false,
            why: "This names the integrator and points to the contract. That names an owner.",
          },
        ],
        why: "You found the sentences that name a role and the ones that leave a gap someone will fall into later. The line about the cell being safe is the one to fix first, because it hides the question of who is responsible for the complete cell.",
      },
      bridge:
        "Some wording leaves more than the owner open, and the next lesson finds the phrases a vendor can hide behind.",
    },
    {
      id: "where-a-vendor-can-hide",
      title: "Where a vendor can hide",
      emphasis: "hide",
      place:
        "This lesson reviews the whole draft before the course assessment and the final specification. It reads for wording that sounds reassuring and commits nobody, whether the wording is in your specification or in a supplier's response to it.",
      sections: [
        {
          heading: "Phrases that commit nobody",
          paragraphs: [
            "Some phrases appear in almost every proposal and in many specifications. 'Up to' states a maximum that may never be reached. 'Typical' and 'typically' describe results from someone else's site with someone else's parts. 'Subject to part quality' and 'with suitable parts' let the supplier decide afterwards that your parts were not suitable. 'Best endeavours' without a measure promises effort rather than a result.",
            "Others are softer still. 'Industry-leading' and 'state of the art' describe the supplier's opinion of themselves. 'To be agreed' beside anything important, such as the acceptance test or the support period, means the thing has not been agreed and will be negotiated later, when the buyer has less room to insist because the order has been placed. Each of these phrases is easy to write and easy to accept, and each of them is where a dispute starts.",
          ],
        },
        {
          heading: "The two labels for this lesson",
          paragraphs: [
            "A phrase is A vendor can hide behind this when it lets a supplier avoid responsibility for a result later. The test is to imagine the cell underperforming and ask whether the supplier could point to the sentence and say they met it. If 'up to 900 picks per hour' is followed by 500 on your bins, the supplier has not broken the sentence.",
            "A phrase is A vendor can be held to this when it states a measurable result, on your parts, with an owner or a test. 'At least 600 picks per hour from our bins of part 2231 over a four-hour run at site acceptance' can be checked by anyone with a clock and a counter. The difference is not the number. It is whether the number is a floor or a ceiling, whose parts it applies to, and when it will be tested.",
          ],
        },
        {
          heading: "This is not about distrusting suppliers",
          paragraphs: [
            "Most suppliers are not trying to mislead anyone. 'Typical' is how their sales material has always been written, and 'subject to part quality' reflects a real fear of being blamed for parts they have never seen. Many suppliers prefer a clear specification, because it protects them too: it tells them what they must reach and stops the goalposts moving after installation.",
            "The aim is a document both sides can use when something goes wrong. When you replace a soft phrase, replace it with something the specification already contains: an outcome from lesson 1, an acceptance condition from lesson 2, or the parts and samples from lesson 3. That way the rewrite is not a new demand. It points the supplier back to facts they were given before they quoted.",
          ],
          beforeAfter: {
            before: "Performance is subject to consistent part quality.",
            after:
              "Part quality is as defined in the volume section, including the burred blanks supplied as samples.",
            reading:
              "The first line lets the supplier decide later what consistent means. The second ties part quality to the facts and samples already in the specification.",
          },
        },
        {
          heading: "The mistake people usually make",
          paragraphs: [
            "The usual mistake is to read for these phrases only in the supplier's proposal. They appear just as often in the buyer's own draft, especially in the parts written late: 'support to be agreed', 'suitable guarding', 'typical cycle time of the existing line'. A vendor can hide behind your wording as easily as behind their own.",
            "The second mistake is to accept a soft phrase because it sits beside a hard number. 'Up to 70 parts per hour' looks like a commitment to 70, and it is a commitment to nothing above zero. Read every number in a proposal for the word in front of it: at least and no more than bind the supplier, while up to and typically do not.",
          ],
        },
      ],
      workedExample: {
        title: "Rewriting a supplier's response for Harrow Precision",
        inputLabel: "The supplier's sentences",
        outputLabel: "The buyer's condition of order",
        prompt:
          "The cell achieves up to 70 parts per hour. Typical changeover is 15 minutes. Performance is subject to consistent part quality.",
        output:
          "The cell achieves at least 60 good parts per hour averaged over the site acceptance run. Changeover between parts 4410 and 4415 takes no more than 20 minutes at site acceptance. Part quality is as defined in the volume section, including the burred blanks supplied as samples.",
        reading: [
          "The supplier's sentences were not false. A cell that averages 45 parts per hour still achieves up to 70, a typical changeover elsewhere may well be 15 minutes, and consistent part quality is whatever the supplier later says it was. None of the three could be enforced.",
          "Dev rewrote each one as a condition of the order, using the outcomes and acceptance condition already in the specification. The rate became a floor, the changeover became a maximum on Harrow's two parts, and both are tied to site acceptance.",
          "The last sentence closes the part quality defence by pointing to the volume section and the samples. The supplier knows exactly what they are agreeing to, and can say so before the order is placed if they cannot meet it.",
        ],
      },
      practice: {
        intro:
          "Here are two sentences from a proposal for a palletising cell. Rewrite them so a vendor can be held to them. Give a minimum rather than a maximum, say when it will be tested, and tie case quality to something already defined in the specification, such as the volume section or the samples.",
        check: {
          kind: "edit",
          prompt:
            "Edit the proposal sentences so that each states a floor, a test, and a definition of case quality that a vendor could be held to.",
          label: "The proposal sentences you are rewriting",
          start: "The cell palletises up to 14 cases per minute. Performance depends on suitable case quality.",
          unchanged:
            "You have not changed the sentences yet. Replace up to with a minimum, say when it will be tested, and tie case quality to the volume section or the samples.",
          keep: [
            {
              id: "cases",
              any: ["case"],
              missing: "Keep the cases. The rewrite should still say what the cell palletises.",
            },
          ],
          limitWording: false,
          limits: [
            {
              id: "floor",
              any: ["at least", "no fewer than", "minimum of", "not less than"],
              missing:
                "Your rewrite does not yet give a floor. Replace up to with at least, or no fewer than, and a number.",
            },
            {
              id: "test",
              any: ["acceptance", "test", "run"],
              missing:
                "Your rewrite does not say when the rate will be proved. Tie it to the site acceptance run or another stated test.",
            },
            {
              id: "defined",
              any: ["as defined", "volume section", "sample", "specification"],
              missing:
                "Your rewrite still leaves case quality for the vendor to decide. Tie it to the volume section or the samples you will supply.",
            },
          ],
          why: "That rewrite works. The rate is now a floor, it is tied to a test, and case quality points to facts already in the specification, so the vendor cannot decide afterwards that your cases were not suitable.",
          result: {
            label: "A rewrite that would pass",
            text: "At site acceptance, the cell palletises at least 12 cases per minute over a four-hour run. Case quality is as defined in the volume section, including the crushed cases supplied as samples.",
          },
        },
      },
      check: {
        kind: "mark",
        prompt:
          "Here are sentences from a proposal for a robotic bin-picking cell at Calder Components. Mark each as A vendor can hide behind this or A vendor can be held to this.",
        passLabel: HELD,
        failLabel: HIDE,
        sentences: [
          {
            id: "up-to",
            text: "Pick rates of up to 900 per hour are possible.",
            fail: true,
            why: "Up to states a maximum, and possible makes it a hope. The vendor could deliver far less and still be right. That is a phrase a vendor can hide behind.",
          },
          {
            id: "minimum",
            text: "At site acceptance, the cell will pick at least 600 parts per hour from your bins of part 2231 over a four-hour run.",
            fail: false,
            why: "This gives a minimum, on your parts, with a stated test. That is something a vendor can be held to.",
          },
          {
            id: "suitable",
            text: "Performance depends on suitable part presentation.",
            fail: true,
            why: "Suitable is not defined, so the vendor can decide later that your presentation was not suitable. That is a phrase a vendor can hide behind.",
          },
          {
            id: "support",
            text: "The vendor will provide remote support by telephone within four working hours for twelve months from site acceptance.",
            fail: false,
            why: "This names what support, how fast, and for how long. That is something a vendor can be held to.",
          },
        ],
        why: "You found the phrases that commit nobody and kept the ones with a measure, your parts, and an owner. Up to and suitable are the two words to replace before this proposal becomes an order.",
      },
      bridge:
        "You have now practised every move in the specification. The next lesson brings them together and tests them on situations you have not yet seen.",
    },
    {
      id: "course-assessment",
      title: "Course assessment: judging a specification",
      emphasis: "assessment",
      place:
        "This is the course assessment. It recaps the method from the first five lessons, works one mixed example, and then asks you to apply the method to six new situations. You need five of the six right to continue to the final lesson.",
      sections: [
        {
          heading: "The method in one page",
          paragraphs: [
            "A specification a vendor cannot hide behind is built in five moves. First, state outcomes rather than equipment: what must be true when the cell is running, in numbers someone could check, with any fixed equipment written as a constraint beside its reason. Second, give each outcome an acceptance condition with four parts: the test, your parts, the duration or quantity, and the pass mark.",
            "Third, describe what the cell will meet: volume as a range with a peak and its duration, the mix, the variation in the parts, each exception with a frequency or the words not yet measured, and a dated commitment to samples that include the exceptions. Fourth, name an owner for each of the five questions about stopping, restarting, changing, calling for help, and the safety of the complete cell, or write open where the answer is not yet known. Fifth, read the whole draft for up to, typical, suitable, best endeavours, to the customer's satisfaction, and to be agreed, and replace each with a measure that points back to the specification.",
          ],
        },
        {
          heading: "How the moves depend on each other",
          paragraphs: [
            "The moves are not a checklist to be ticked in any order. Each one gives the next something to stand on. An acceptance condition cannot have a pass mark until there is an outcome to measure. The samples in the volume section are what the factory acceptance test runs on. The rewrites in the wording check point back to the outcomes and the samples, which is why they read as reminders rather than new demands.",
            "When a specification fails, it usually fails at the join between two moves. The outcome says 60 parts per hour but the acceptance test runs for thirty minutes. The volume section commits to samples but the acceptance test runs the supplier's parts. The owners section names the integrator for the complete cell but the proposal says conformity is to be agreed. Reading for those joins is what the assessment asks you to do.",
          ],
        },
        {
          heading: "Reading an extract as a whole",
          paragraphs: [
            "In the practice below you will compare two extracts from the same specification, each a few lines long. Read each extract for all five moves before you choose. The stronger extract is the one a supplier would have to answer line by line, not the one that is longer or sounds more technical.",
            "In the assessment itself, each situation describes something a project lead, an engineer, or a buyer might face in the weeks before an order is placed. Every option is something a reasonable professional might do. Choose the one this course would support, and read the feedback on each question afterwards, whether or not you chose correctly.",
          ],
        },
      ],
      workedExample: {
        title: "A mixed review at Oakfield Plastics",
        inputLabel: "The draft extract",
        outputLabel: "The reviewed extract",
        prompt:
          "Supply a six-axis robot to unload the moulding press, typically at 30 shots per hour. Acceptance: to the customer's satisfaction. Support to be agreed. The cell will be safe.",
        output:
          "The cell must unload press 4 for mouldings 88-A and 88-B at the press's full rate of at least 30 shots per hour, and place each moulding on the outfeed conveyor without marking the show face. Site acceptance: a six-hour production run on both mouldings from our press; pass at no fewer than 30 shots per hour averaged over the run, no marked show faces at the existing visual inspection, and no more than two stops needing an operator. Call when an operator cannot recover: the shift technician; supplier telephone support within four working hours for twelve months from site acceptance. Responsibility for the complete cell as a machine: open, to be decided with our safety adviser before the order.",
        reading: [
          "Nadia Brook, the engineering manager at Oakfield Plastics, found four of the five moves missing in four sentences. The robot became an outcome with a rate and a quality condition. Typically became at least.",
          "To the customer's satisfaction became an acceptance condition with a test, the press's own mouldings, six hours, and a pass mark that uses the existing inspection. Support to be agreed became a named first call and a supplier commitment with a response time and a period.",
          "The cell will be safe became an honest open gap. Nadia did not yet know who would take responsibility for the complete cell, so she wrote open and named when it would be decided. That is a stronger sentence than a hope, because everyone reading it can see what is still to do.",
        ],
      },
      practice: {
        intro:
          "Here are two extracts from a specification for a cell that tends a grinding machine. Read each for all five moves, then choose the extract a supplier would have to answer line by line.",
        check: {
          kind: "choose",
          prompt: "Choose the extract that a supplier could be held to.",
          leftLabel: "Extract A",
          left:
            "The cell must load grinder 2 for shafts S-40 and S-55 at no fewer than 45 shafts per hour. Site acceptance: a six-hour run on our turned shafts, passing at 45 shafts per hour averaged over the run with no more than two operator stops. Samples: 150 shafts of each size, including 15 with a raised burr, by 12 May. Restart after an emergency stop: the cell leader only.",
          rightLabel: "Extract B",
          right:
            "Supply an industry-leading robot and a state of the art gripper to load grinder 2. The cell will typically achieve 50 shafts per hour, subject to suitable shaft presentation. Acceptance and support to be agreed.",
          correct: "left",
          why: "Extract A states an outcome with a floor, gives it a test on your shafts with a pass mark, commits to samples including the burred shafts, and names who restarts after an emergency stop. Extract B names equipment and relies on typically, suitable, and to be agreed.",
          wrong:
            "Look again at Extract B. It chooses equipment, gives a typical rate subject to suitable presentation, and leaves acceptance and support to be agreed. Extract A gives the supplier something to answer at every line.",
        },
      },
      check: {
        kind: "scenario",
        prompt:
          "Six situations follow, each set in the weeks before a robotics order is placed. For each, choose what you would do. You need five of the six right to pass.",
        passMark: 5,
        questions: [
          {
            id: "blister",
            situation:
              "Ruth Okoye, operations manager at Brambling Healthcare, has a one-line draft for a blister-packing cell: 'Supply a SCARA robot and a vision camera for line 3.' Line 3 packs two blister formats at up to 80 packs per minute, and the site already holds spares for SCARA robots from one approved maker. The draft goes to three integrators on Friday.",
            question: "What should Ruth do before Friday?",
            options: [
              {
                id: "a",
                text: "Add the robot maker's model number and the camera resolution, so that the three quotations are directly comparable.",
                feedback:
                  "More equipment detail makes the quotations easier to compare on price, but it makes the specification more of a shopping list. If the cell cannot keep up, the integrator delivered what was asked. State the outcomes and keep the robot maker as a constraint with its reason.",
              },
              {
                id: "b",
                text: "Rewrite the draft as outcomes, such as the pack rate, the two formats, and the changeover time, and keep the approved robot maker as a constraint with the reason about spares.",
                correct: true,
                feedback:
                  "Yes. Outcomes make the integrators responsible for choosing equipment that reaches the rate on both formats, and the constraint tells them what is fixed and why. That is the move from lesson 1.",
              },
              {
                id: "c",
                text: "Send the draft as it stands, because integrators who work on blister lines will know what line 3 needs.",
                feedback:
                  "The integrators do not know your rate, your formats, or your changeovers, and each will guess differently. You will receive three quotations for three different cells, none of which you can hold to a result. Write the outcomes first.",
              },
              {
                id: "d",
                text: "Ask each integrator to propose the outcomes they think line 3 should achieve, and choose the most ambitious.",
                feedback:
                  "That hands the definition of success to the people who will be judged against it. They will propose what their cell can do, not what line 3 needs. The outcomes are yours to write.",
              },
            ],
          },
          {
            id: "fat",
            situation:
              "Callum Reid, project lead at Wessex Fasteners, receives a supplier's proposed acceptance plan for a screw-sorting cell. It reads: 'Factory acceptance: 30-minute demonstration on supplier's sample screws. Site acceptance: to be confirmed after installation.' The specification's outcome is at least 1,200 good screws per hour across four screw lengths.",
            question: "How should Callum respond?",
            options: [
              {
                id: "a",
                text: "Accept the plan, because the factory demonstration will show the cell working before it ships.",
                feedback:
                  "A 30-minute demonstration on the supplier's own screws shows the cell at its best on parts that behave. It proves nothing about your four lengths or your rate over a shift, and the site test has not been defined at all.",
              },
              {
                id: "b",
                text: "Ask for the demonstration to be extended to two hours, and leave the site acceptance to be confirmed later.",
                feedback:
                  "A longer demonstration is better, but it still runs the supplier's screws and still has no pass mark, and the site test is still undefined. Once the cell is installed, you have less room to insist on a proper test.",
              },
              {
                id: "c",
                text: "Replace both tests with acceptance conditions that run your own screws of all four lengths, for a stated duration, against a pass mark of at least 1,200 good screws per hour.",
                correct: true,
                feedback:
                  "Yes. Each test now has the four parts from lesson 2: the test, your parts, a duration, and a pass mark taken from the outcome. The supplier knows what they will be judged on and can design for it.",
              },
            ],
          },
          {
            id: "peak",
            situation:
              "Aisha Rahman is writing the volume section for a carton-erecting cell at Linden Home. Production records show 850 to 950 cartons per shift for most of the year, rising to 1,300 per shift for about six weeks before Christmas. Her draft says 'Volume: 900 cartons per shift.'",
            question: "What should the volume section say?",
            options: [
              {
                id: "a",
                text: "Leave it at 900, because the supplier will add their own margin and the peak is only six weeks.",
                feedback:
                  "The supplier's margin is their choice and may be far below 1,300. Six weeks before Christmas is when a missed rate costs the most, and the specification will show they were never told. Give the range and the peak.",
              },
              {
                id: "b",
                text: "State the normal range of 850 to 950 per shift with its source, and the peak of 1,300 per shift for about six weeks before Christmas.",
                correct: true,
                feedback:
                  "Yes. The supplier can now size the cell for the peak and knows how long it lasts. That is the range and peak from lesson 3, and it removes the defence that only the average was given.",
              },
              {
                id: "c",
                text: "Change the figure to 1,300 per shift, so the supplier designs for the worst case all year.",
                feedback:
                  "Designing for 1,300 all year may cost more than it needs to, and it hides the pattern the supplier could use, such as planning maintenance outside the peak. Give the real range and the peak with its duration.",
              },
              {
                id: "d",
                text: "Write 'up to 1,300 cartons per shift', which covers both the normal rate and the peak.",
                feedback:
                  "Up to states a maximum and tells the supplier nothing about the normal rate or how long the peak lasts. It is one of the phrases lesson 5 removes. State the range and the peak separately.",
              },
            ],
          },
          {
            id: "creased",
            situation:
              "On a walk around the line at Greyfield Dairy, two operators tell the project lead, Owen Price, that pouch labels sometimes arrive creased and jam the existing applicator. Nobody has counted how often this happens. The specification for a new pouch-handling cell is due to go out next week.",
            question: "What should Owen put in the specification?",
            options: [
              {
                id: "a",
                text: "Leave creased labels out until someone has measured them, so the specification contains only facts.",
                feedback:
                  "Leaving the exception out means the supplier designs as if it does not exist, and later can say they were never told. An exception you know about but have not counted is still a fact. Write it down as not yet measured.",
              },
              {
                id: "b",
                text: "Estimate a frequency of about 2 per cent, so that the supplier has a number to design to.",
                feedback:
                  "A guessed figure looks measured, and if the real rate is higher, the specification is now wrong in the supplier's favour. Write not yet measured and give samples, so the supplier can judge it.",
              },
              {
                id: "c",
                text: "List creased labels as an exception, not yet measured, and commit to supplying sample pouches with creased labels before the factory acceptance test.",
                correct: true,
                feedback:
                  "Yes. The exception is on the page, its frequency is honestly stated as not yet known, and the samples mean the supplier will have handled creased labels before the cell ships. That is the exceptions move from lesson 3.",
              },
              {
                id: "d",
                text: "Write that labels occasionally arrive creased, without further detail, so as not to put suppliers off quoting.",
                feedback:
                  "Occasionally is not a frequency, and without samples the supplier can still say they did not know what a creased label looked like. Write not yet measured and commit to samples.",
              },
            ],
          },
          {
            id: "complete-cell",
            situation:
              "Harriet Cole, procurement lead at Moorland Bakeries, is reviewing the owners section for a tray-loading cell. The robot comes from one maker, the conveyors from another, and the guarding from a local fabricator, with a small integrator assembling the cell. The draft says: 'All parties will comply with applicable regulations.'",
            question: "What should Harriet ask for in the owners section?",
            options: [
              {
                id: "a",
                text: "A line naming who is responsible for the risk assessment, conformity marking, declaration, and technical file of the complete cell, agreed in writing with competent advice, or the word open until it is agreed.",
                correct: true,
                feedback:
                  "Yes. The complete cell is a machine in its own right, and someone has to take responsibility for it. Naming them, or writing open so the gap is visible, is the move from lesson 4.",
              },
              {
                id: "b",
                text: "Keep the line as it is, because each supplier's own paperwork for its part will cover the cell between them.",
                feedback:
                  "Paperwork for each part does not cover the assembled cell. The line names nobody for the complete machine, and when the question matters, there will be no name on the page. Name who is responsible, or write open.",
              },
              {
                id: "c",
                text: "Add a sentence that Moorland Bakeries will ensure the cell is safe before use.",
                feedback:
                  "That states a hope and places an undefined duty on your own site without saying who does the risk assessment, the marking, or the technical file. Name who is responsible for the complete cell, agreed in writing, or write open.",
              },
            ],
          },
          {
            id: "typical",
            situation:
              "Sam Achebe, engineering manager at Riverside Castings, receives a proposal for a deburring cell. It says: 'Typical cycle time is 42 seconds per casting, subject to suitable casting quality. Support to be agreed.' The specification already states an outcome of at least 80 castings per hour, the casting variation, and samples including castings with heavy flash.",
            question: "What should Sam do with these sentences before placing the order?",
            options: [
              {
                id: "a",
                text: "Accept them, because 42 seconds per casting works out at more than 80 castings per hour.",
                feedback:
                  "Typical describes someone else's results, and subject to suitable casting quality lets the supplier decide later that your castings did not qualify. The arithmetic is right and the sentence still binds no one.",
              },
              {
                id: "b",
                text: "Ask the supplier to replace typical with a guaranteed figure, and leave support to be settled after installation.",
                feedback:
                  "A guaranteed figure is better, but suitable casting quality is still undefined, and support to be agreed will be negotiated when you have the least room to insist. Rewrite all three sentences.",
              },
              {
                id: "c",
                text: "Ask the supplier to explain what suitable casting quality means before deciding.",
                feedback:
                  "The explanation will describe what suits the supplier. Your specification already defines casting quality and supplies samples. Point the proposal back to it and rewrite the other two sentences as well.",
              },
              {
                id: "d",
                text: "Rewrite them as conditions of the order: at least 80 castings per hour at site acceptance, casting quality as defined in the specification including the flash samples, and named support with a response time and a period.",
                correct: true,
                feedback:
                  "Yes. Each soft phrase now points to a measure already in the specification, so the supplier knows exactly what they are agreeing to. That is the move from lesson 5.",
              },
            ],
          },
        ],
        why: "You applied the method to new cases: outcomes before equipment, acceptance with four parts, a peak and honest exceptions with samples, a named owner for the complete cell, and measures in place of soft phrases.",
      },
      bridge:
        "You have shown that you can judge a specification. The last lesson asks you to write one of your own, and that specification is what your record will show.",
    },
    {
      id: "the-specification",
      title: "The specification",
      emphasis: "specification",
      place:
        "This is the final lesson and the fourth module. You write the one-page specification for a real or planned robotics project, and that page is the work your record will show.",
      sections: [
        {
          heading: "The six parts on one page",
          paragraphs: [
            "The one-page specification brings together the work of the course in six parts. The outcomes the cell must achieve, with any equipment constraints and their reasons. The acceptance conditions for those outcomes, each with a test, your parts, a duration, and a pass mark. The volume, as a range with a peak and its duration, together with the mix and the variation in the parts.",
            "Then the exceptions, each with a frequency or not yet measured, and the commitment to samples that include them. The owners, answering the five questions about stopping, restarting, changing, calling for help, and the complete cell, with open where the answer is not yet known. Finally a wording check: a line saying when the page was read for phrases a vendor could hide behind, and which ones were removed.",
          ],
        },
        {
          heading: "Why it fits on one page",
          paragraphs: [
            "It fits on one page because it states facts and conditions, not background. The history of the line, the reasons for automating, and the vendors you have spoken to all belong in other documents. A supplier reading this page should find only the things they must answer and could be held to, and nothing they could skim past.",
            "One page also makes comparison possible. When the same page goes to three integrators, their responses can be laid side by side line by line. Each of them has to say how they will reach the rate on your worst parts and who will take responsibility for the complete cell, and a gap in any response is visible at once.",
          ],
        },
        {
          heading: "What the page is and is not",
          paragraphs: [
            "The page is a buyer's specification, in the tradition of a user requirement specification that GAMP 5 and many engineering teams use before a supplier is chosen. It is not a contract. Your organisation's legal and procurement process still applies to the contract itself, and the page should be attached to it rather than replace it.",
            "The page is also not a risk assessment and not evidence that any machine conforms with any regulation or standard. It makes sure the question of who will do that work is answered on paper. Do not put anything confidential on the page you write here, because your record can be opened by anyone with its reference. Use realistic figures that keep the shape of your project if the real ones are sensitive.",
          ],
        },
        {
          heading: "Two labels, and how the page is checked",
          paragraphs: [
            "In the practice you will read lines from a colleague's page with two labels. A line is Ready to send to suppliers when it states something a supplier must answer and could be held to: a measurable result, a test with a pass mark, a peak, an exception with samples, a named owner or an honest open, or a dated wording check. A line Needs another pass when it names equipment without a reason, lacks a pass mark or a peak, names nobody, or still leans on a phrase from lesson 5.",
            "When you continue from your own page, each part is checked in turn. The outcomes must state a measurable result with a number. The acceptance conditions must contain a pass mark. The volume must include a peak. The exceptions must commit to samples. The owners must name who is responsible for the complete cell, or say open. The wording check must say when the page was read and what was removed or replaced. A note will name any part that is missing, and length alone never passes.",
          ],
        },
      ],
      workedExample: {
        title: "The Harrow Precision specification",
        inputLabel: "The work from lessons 1 to 5",
        outputLabel: "The one-page specification",
        prompt:
          "The rewritten outcomes from lesson 1, the acceptance condition from lesson 2, the volume section from lesson 3, the responsibilities from lesson 4, and the buyer's rewrites from lesson 5.",
        output:
          "Outcomes: load and unload lathes 1 and 2 for parts 4410 and 4415; at least 60 good parts per hour across both lathes, with lathe cycle times unchanged; at least two hours unattended from a full infeed; changeover between parts in no more than 20 minutes. Constraint: robot controller from the site's approved list, to match existing spares.\nAcceptance conditions: factory acceptance on 200 of our blanks of each part, including 20 burred blanks, with every part loaded and unloaded without a stop needing a person; site acceptance on an eight-hour production run with one changeover, passing at 60 good parts per hour averaged over the run excluding the changeover, no more than three stops needing an operator, and the changeover in 20 minutes or less.\nVolume and variation: normal 350 to 420 parts per shift, measured over six months; peak 480 per shift for about four weeks before the summer shutdown; mix about two-thirds 4410 and one-third 4415; length tolerance plus or minus 0.5 millimetres.\nExceptions and samples: burred blanks, not yet measured; a different bar diameter about once a month. Samples: 200 blanks of each part, including 20 burred blanks, supplied before the factory acceptance test.\nOwners: normal stop by operators; restart after a protective stop by trained operators using the recovery card; restart after an emergency stop by the shift team leader after the cause is found; program and safety setting changes by the site robot engineer only, recorded in the change log; calls the operator cannot recover go to the shift engineer, with supplier telephone support within four working hours for twelve months from site acceptance; the integrator is responsible for the risk assessment, conformity marking, declaration, and technical file of the complete cell, as set out in the contract.\nWording check: read on 4 June; up to, typical, suitable, and to the customer's satisfaction removed and replaced with the measures above.",
        reading: [
          "Every line on the page came from work Dev had already done in the course. Assembling it took less time than writing any single section, because each part had already been tested on its own.",
          "The page can be sent to three integrators and their responses compared line by line. Each of them has to say how they will meet 60 good parts per hour on burred blanks, at a peak of 480 per shift, and who will own the complete cell.",
          "The wording check is dated and names the phrases removed. A reader six months later can see that the page was reviewed, when, and for what.",
        ],
      },
      practice: {
        intro:
          "Before you write your own page, read these four lines from a colleague's specification for a glass-handling cell at Severn Glazing. Mark each as Ready to send to suppliers or Needs another pass, using the definitions in the section above.",
        check: {
          kind: "mark",
          prompt: "Mark each line as Ready to send to suppliers or Needs another pass.",
          passLabel: READY,
          failLabel: ANOTHER_PASS,
          sentences: [
            {
              id: "outcome",
              text: "Outcomes: the cell must unload sealed units from the press at no fewer than 90 units per hour, for units from 400 to 1,800 millimetres wide.",
              fail: false,
              why: "It states a floor and the range of units the cell must handle, so a supplier must answer it and could be held to it.",
            },
            {
              id: "acceptance",
              text: "Acceptance conditions: an eight-hour run on our production units, to be judged on the day.",
              fail: true,
              why: "It has a test, your units, and a duration, but no pass mark. To be judged on the day is an argument waiting to happen, so it needs another pass.",
            },
            {
              id: "samples",
              text: "Exceptions and samples: units with a chipped edge, about three a shift; we will supply 40 units, including 6 with chipped edges, by 20 March.",
              fail: false,
              why: "It gives the exception, its frequency, and a dated commitment to samples that include it, so it is ready to send.",
            },
            {
              id: "owners",
              text: "Owners: safety of the complete cell will be handled by the relevant parties.",
              fail: true,
              why: "The relevant parties names nobody. Either name who is responsible for the complete cell or write open, so this line needs another pass.",
            },
          ],
          why: "That is right. The outcome and the exceptions line are ready to send. The acceptance line has no pass mark, and the owners line names nobody for the complete cell.",
        },
      },
      check: {
        kind: "build",
        prompt:
          "Write the one-page specification for a real or planned robotics project. Each part has to be something a supplier must answer and could be held to.",
        fields: [
          {
            id: "outcomes",
            label: "Outcomes",
            hint: "What must be true when the cell is running, with numbers, and any equipment constraint with its reason.",
            min: 40,
            rule: "fact",
            any: ["must", "at least", "no more than", "no fewer than", "per hour", "per minute", "per shift"],
            missing:
              "Your outcomes do not yet state a measurable result. Write what the cell must achieve with a number, such as at least 60 good parts per hour, and mark any named equipment as a constraint with a reason.",
          },
          {
            id: "acceptance",
            label: "Acceptance conditions",
            hint: "For each outcome: the test, your parts, the duration or quantity, and the pass mark.",
            min: 40,
            rule: "fact",
            any: ["pass"],
            missing:
              "Your acceptance conditions have no pass mark. Add the number or standard that decides pass, alongside the test, your parts, and the duration.",
          },
          {
            id: "volume",
            label: "Volume and variation",
            hint: "The normal range with its source, the peak and how long it lasts, the mix, and the variation in the parts.",
            min: 30,
            rule: "fact",
            any: ["peak"],
            missing: "Your volume section has no peak. Add the peak and how long it lasts.",
          },
          {
            id: "exceptions",
            label: "Exceptions and samples",
            hint: "Each exception with a frequency or not yet measured, and how many samples you will supply, including exceptions, and by when.",
            min: 30,
            any: ["sample"],
            missing:
              "Your exceptions section does not commit to samples. Say how many, including exceptions, and by when.",
          },
          {
            id: "owners",
            label: "Owners",
            hint: "Who stops, who restarts after each kind of stop, who changes programs, who is called, and who is responsible for the complete cell.",
            min: 40,
            rule: "role",
            any: ["complete cell", "whole cell", "cell as a machine", "open"],
            missing:
              "Your owners section does not name who is responsible for the complete cell as a machine. Name the organisation, or write open so the gap is visible.",
          },
          {
            id: "wording",
            label: "Wording check",
            hint: "When you read the page for phrases a vendor could hide behind, and which ones you removed or replaced.",
            min: 20,
            rule: "fact",
            any: ["removed", "replaced", "rewritten", "rewrote", "checked", "reviewed"],
            missing:
              "Your wording check does not say when the page was read or what was removed. Give the date, and name the phrases you removed or replaced with a measure.",
          },
        ],
        why: "Your specification states outcomes, gives each a test with a pass mark, describes volume with a peak and exceptions with samples, names owners including for the complete cell, and records when the wording was checked, so a supplier must answer every line and could be held to it.",
      },
      bridge:
        "Your specification is ready. Sign your name below, and the record will show this page, the course, and the date to anyone who opens the reference.",
    },
  ],
};
