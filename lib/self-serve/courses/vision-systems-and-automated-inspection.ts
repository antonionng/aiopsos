/*
Course: Vision Systems and Automated Inspection
Slug: vision-systems-and-automated-inspection
For: Quality engineers, quality managers, production managers, and inspection team leaders who rely on, buy, or
  are responsible for a camera-based inspection system on a production line. They know the product and its
  quality requirements, and they know a defect from a variation within tolerance. No optics or image processing.
Outcome: The learner can state what a vision system judges and what it does not, explain false rejects and false
  accepts and what the threshold trades between them, recognise quiet failure, write a challenge test that proves
  the system can still see, decide what a person still checks, and write an inspection brief a colleague or an
  auditor could use to run or audit the system.
Artefact: The inspection brief, in five parts: what the camera judges and does not judge; how it can be wrong and
  who may change the threshold; how it can fail quietly here; the challenge test; the human check.
Record sentence: Wrote and signed an inspection brief stating what one vision system judges, how it can fail
  quietly, how it is challenged, and what a person still checks, as a record of the brief and not a validation of
  the system.
Lessons (id, title, move, interaction, pass rule):
  1. what-the-camera-judges, What the camera is judging, separate configured features from assumed judgements,
     mark, every statement marked correctly.
  2. two-ways-to-be-wrong, Two ways to be wrong, tell a false reject from a false accept, mark, every event marked
     correctly.
  3. the-quiet-failure, The quiet failure, treat a falling reject rate as a question to test, choose, the
     explanation that tests the system first.
  4. prove-it-can-still-see, Prove it can still see, repair a challenge test, edit, the edit keeps the known-bad
     parts and the reject, and adds a trigger after change, a record, a hold on output, and who is told.
  5. the-human-check, The human check, divide the inspection between the camera and people, mark, every check
     marked correctly.
  6. inspection-assessment, Judging a live inspection station, apply the whole method, scenario, six of eight.
  7. the-inspection-brief, The inspection brief, write the artefact, build, each field meets its any list and rule.
Sources: AIAG, Measurement Systems Analysis Reference Manual. ISO 2859-1, Sampling procedures for inspection by
  attributes. EMVA 1288, the European Machine Vision Association standard for camera characterisation. E. R. Davies,
  Computer Vision: Principles, Algorithms, Applications, Learning. Manufacturer documentation for the system in use.
Tested on phone:          no
Tested returning learner: no
Pass rule tests written:  yes
*/
import type { CourseContent } from "./types.ts";

const MEASURES = "A feature the system measures";
const NOT_JUDGED = "A judgement the system does not make";
const FALSE_REJECT = "False reject";
const FALSE_ACCEPT = "False accept";
const QUIET = "A quiet failure";
const VISIBLE = "A visible fault";
const CAMERA = "The camera judges this";
const PERSON = "A person still checks this";
const READY = "Ready to audit";
const ASK = "An auditor would have to ask";

export const COURSE: CourseContent = {
  slug: "vision-systems-and-automated-inspection",
  hours: 2,
  artefact: {
    lessonId: "the-inspection-brief",
    title: "The inspection brief",
    recordLine:
      "Wrote and signed an inspection brief stating what one vision system judges, how it can fail quietly, how it is challenged, and what a person still checks, as a record of the brief and not a validation of the system.",
  },
  lessons: [
    {
      id: "what-the-camera-judges",
      title: "What the camera is judging",
      emphasis: "judging",
      place:
        "This is the first of seven lessons and the start of the first module, The judgement. Before you can trust a vision system, argue about its threshold, or decide what people still check, you need to know exactly which questions it has been set up to answer.",
      sections: [
        {
          heading: "A vision system answers the questions it was given",
          paragraphs: [
            "A vision inspection system takes an image of a part under set lighting, looks at particular features it has been configured to find, measures them, and compares each measurement with a threshold to decide pass or fail. A feature might be the presence of a label, the position of a hole, the width of a seal, the colour of a patch, or the count of dark pixels in the area where a scratch would appear.",
            "Each of those features was chosen by someone, usually the integrator who installed the system or the engineer who set up the inspection program for this product. They drew a region on the image, chose a tool to measure what is inside it, and set the value at which a part fails. Everything the system decides comes from those choices, and nothing else.",
            "So the system answers only the questions it was configured to answer, in the region of the image it was told to look at. If nobody configured a check for torn labels, the system has no opinion about torn labels. If the check for specks covers the top face of a cap and a speck appears on the side wall, the system is not looking there.",
          ],
        },
        {
          heading: "What it is not",
          paragraphs: [
            "A vision system does not see the part the way an inspector does. An experienced inspector glances at a bottle and notices a crack, a smear, the wrong shade of cap, and a label that is slightly out of true, all at once and without being told to look for any of them. The camera captures the same image, but the software only measures what it was asked to measure.",
            "Some systems use trained models rather than hand-set rules. These are often described as learning what a good part looks like, and they can be better than rules at catching variable defects such as surface marks. They still decide on the basis of what they were shown during training and the regions they were set up to examine. A defect of a kind the model was never shown, or in a place it was not trained to look, may pass without any sign that something was missed.",
            "The system is also not a statement about whether the part will work. A camera looking at a cap can measure its diameter, but it cannot tell you whether the cap will seal on a bottle it has never seen. Fitness for use depends on things outside the image, and those remain questions for the quality plan and for people.",
          ],
        },
        {
          heading: "Why this matters on the line",
          paragraphs: [
            "Once a camera is installed, people on the line tend to assume it checks everything they used to check by eye. The inspector who used to look at every tray is moved to another job, the work instruction is shortened, and the phrase 'the camera does that now' starts to appear in meetings. Nobody has read the setup sheet, and the gap between what the system does and what people believe it does is where defects escape.",
            "The setup sheet or configuration summary is the document that closes that gap. It lists the inspection tools, the regions they cover, and the thresholds they use. Reading it against what people assume is the first thing a quality engineer should do with any vision system, whether it is being bought, inherited, or audited.",
          ],
          beforeAfter: {
            before: "The camera checks the labels on every bottle.",
            after:
              "The camera checks that a front label is present, that it sits within 2 millimetres of its nominal position, that the barcode reads, and that a batch code is printed in the code window. It does not check whether the batch code is today's, or whether the label is torn.",
            reading:
              "The first sentence invites everyone to stop looking at labels. The second says exactly what the camera measures and names two things it does not, so people know what is still theirs.",
          },
        },
        {
          heading: "Two labels for every claim",
          paragraphs: [
            "In this lesson you will judge each claim about a system with one of two labels. A claim is A feature the system measures when it describes something that has been configured, measured in a defined region, and compared with a threshold. 'Fails caps whose outside diameter is outside the drawing tolerance' is a feature the system measures, because someone set up that measurement and that limit.",
            "A claim is A judgement the system does not make when it describes something outside that configuration. That includes broad claims such as 'catches any defect', claims about fitness for use such as 'the cap will seal', and claims about correctness when the system only checks presence, such as 'the date is right' when the system only checks that a date is printed.",
            "The mistake people usually make is to read a presence check as a correctness check. A system that confirms a batch code is printed will pass yesterday's batch code without hesitation. Whenever a claim says a thing is right, correct, or suitable, ask whether the system measures that property or only the existence of something in the image.",
          ],
        },
      ],
      workedExample: {
        title: "The label station at Marsh Lane Drinks",
        inputLabel: "The setup sheet",
        outputLabel: "The quality manager's marked list",
        prompt:
          "Label inspection, bottling line 2. Checks: label present; label position within 2 millimetres of nominal; barcode readable; batch code printed in the code window.",
        output:
          "Label present: a feature the system measures. Label position: a feature the system measures. Barcode readable: a feature the system measures. Batch code correct for today: a judgement the system does not make, because it checks only that a code is printed. Label torn at the edge: a judgement the system does not make, because no check for tears was configured. Bottle cracked: a judgement the system does not make.",
        reading: [
          "Helen Achebe, the quality manager, had asked the line team to list what they believed the camera checked. She then marked each item against the setup sheet. The first three items appear on the sheet as configured checks, so each is a feature the system measures.",
          "The batch code is the important finding. The sheet says the system checks that a code is printed in the window, not that the code is correct. The system would pass a bottle printed with yesterday's code, and the line team had assumed it would not.",
          "The torn label and the cracked bottle are not on the sheet at all. Nobody had lied about the system. It did exactly what its setup sheet said, and the team had assumed it did more.",
        ],
      },
      practice: {
        intro:
          "Here is a setup sheet from a jar line and three things people on that line believe the camera checks. Mark each claim with one of the two labels. The section on the two labels is above if you want to read it again.",
        check: {
          kind: "mark",
          prompt: "Mark each claim about the jar inspection camera as A feature the system measures or A judgement the system does not make.",
          material: {
            label: "The setup sheet",
            text: "Harrow Preserves, jar line 1. Checks: lid present; fill level within the band marked on the image; foreign body in the top 20 millimetres of product.",
          },
          passLabel: MEASURES,
          failLabel: NOT_JUDGED,
          sentences: [
            {
              id: "fill",
              text: "The camera fails jars whose fill level is outside the band.",
              fail: false,
              why: "Fill level is a configured check with a band as its threshold, so it is a feature the system measures.",
            },
            {
              id: "lid-tight",
              text: "The camera confirms each lid is tightened to the right torque.",
              fail: true,
              why: "The sheet checks that a lid is present. Torque cannot be seen in an image of the lid, so it is a judgement the system does not make.",
            },
            {
              id: "glass",
              text: "The camera finds glass fragments anywhere in the jar.",
              fail: true,
              why: "The foreign body check covers only the top 20 millimetres of product. A fragment lower in the jar is outside the region, so this is a judgement the system does not make.",
            },
          ],
          why: "That is right. The fill level is a configured measurement. Torque is outside what an image can show, and the foreign body check covers only the top of the jar, so a fragment lower down is not the system's judgement.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "A supplier has described a vision system for inspecting moulded caps at Castlegate Mouldings. Mark each statement as A feature the system measures or A judgement the system does not make.",
        passLabel: MEASURES,
        failLabel: NOT_JUDGED,
        sentences: [
          {
            id: "diameter",
            text: "The system measures the outside diameter of each cap and fails caps outside the drawing tolerance.",
            fail: false,
            why: "This describes a configured measurement with a threshold. That is a feature the system measures.",
          },
          {
            id: "any-defect",
            text: "The system will catch any defect an inspector would see.",
            fail: true,
            why: "No system measures any defect. It measures what it was set up to measure, so this is a judgement the system does not make.",
          },
          {
            id: "specks",
            text: "The system checks for black specks in the top face of the cap within the configured region.",
            fail: false,
            why: "This names a defect type and a region. That is a feature the system measures.",
          },
          {
            id: "seal",
            text: "The system confirms the cap will seal on the bottle.",
            fail: true,
            why: "Whether the cap seals depends on its fit and on the bottle, which a camera looking at the cap alone does not measure. This is a judgement the system does not make.",
          },
        ],
        why: "You separated what the system actually measures from what people might assume it judges. The diameter and the specks are configured checks, while 'any defect' and 'will seal' are claims the camera cannot support.",
      },
      bridge:
        "Even within the features it measures, the system can be wrong in two different ways, and the next lesson explains them and the threshold that sits between them.",
    },
    {
      id: "two-ways-to-be-wrong",
      title: "Two ways to be wrong",
      emphasis: "wrong",
      place:
        "This lesson completes the first module. You now know what the system measures, and this lesson explains how each of those measurements can lead to the wrong decision, and why the threshold is a decision about which mistake you prefer.",
      sections: [
        {
          heading: "Two errors and one threshold",
          paragraphs: [
            "Every inspection decision can be wrong in two ways. A False reject is a good part that the system fails. A False accept is a bad part that the system passes, which is sometimes called an escape. Both are errors of the same measurement, made in opposite directions.",
            "The threshold sits between the two. A seal width check, for example, fails any pouch whose measured seal is narrower than a set value. Raise that value and the system catches more weak seals, but it also fails more good pouches whose seals happen to measure a little narrow. Lower it and fewer good pouches are failed, but more weak seals pass.",
            "Neither error can be driven to zero. Real parts vary, images vary with lighting and position, and the good parts and the bad parts overlap near the limit. Any threshold you choose will make some false rejects and some false accepts. The only question is the balance.",
          ],
        },
        {
          heading: "Why the pressure always runs one way",
          paragraphs: [
            "False rejects are visible. They pile up in the reject bin, they are counted on the shift report, and each one is a good part that has been scrapped or sent for re-inspection. The production manager sees the cost every day, and so there is steady pressure to loosen the threshold.",
            "False accepts are invisible at the line, because a bad part that passes looks exactly like a good part that passes. They are usually found later, at a downstream process, at packing, at the customer's goods-in, or in a complaint. By then the cause is weeks old and the evidence is on a pallet somewhere else.",
            "This is why a decision about the threshold is a decision about which error your organisation will accept more of. It is not a technical detail to be left to whoever is nearest the screen when the reject bin fills up, and it should be made by a named person who has looked at both errors.",
          ],
        },
        {
          heading: "Answering a request to loosen the threshold",
          paragraphs: [
            "The request usually arrives as a complaint about waste. The right answer is neither yes nor no. It starts by finding out whether the rejects are really good parts, and then asks why good parts are looking bad to the camera, because the cause is often lighting, position, or dirt rather than the threshold.",
            "If the threshold does have to move, the person who moves it should say what the change will do to false accepts, record the old and new values, and set a date to review the effect. A threshold changed quietly on a night shift and never recorded is one of the most common reasons a system stops catching the defect it was bought for.",
          ],
          beforeAfter: {
            before: "The seal checker is rejecting too many good pouches, so I have opened up the threshold a bit.",
            after:
              "The seal checker rejected 140 pouches on Tuesday. We reviewed 30 and 26 were good, so most are false rejects. Before anyone changes the threshold, we will find out why good seals measure narrow, and any change will be made by the quality engineer and recorded with the old and new values.",
            reading:
              "The first version trades an error you can see for one you cannot, with no record. The second checks what the rejects really are, looks for the cause, and puts the threshold in the hands of a named role.",
          },
        },
        {
          heading: "The mistake people usually make",
          paragraphs: [
            "The usual mistake is to judge a vision system by its reject rate alone. A low reject rate is read as a good system and a high one as a bad system. In fact the reject rate tells you nothing about false accepts, because they are, by definition, not in the reject bin.",
            "The second mistake is to call every rejected part a false reject once it has been looked at quickly and seems fine. A false reject is a good part, judged good against the specification by someone who knows it. A part that looks fine at arm's length but is outside tolerance is a correct reject, and treating it as a false reject builds the case for loosening a threshold that is doing its job.",
          ],
        },
      ],
      workedExample: {
        title: "A request at Pennine Pouch Co.",
        inputLabel: "The line manager's message",
        outputLabel: "The quality engineer's reply",
        prompt:
          "Hi Sanjay, the seal checker on line 4 is rejecting too many good pouches again. Can we open up the threshold before the weekend run? Thanks, Carl.",
        output:
          "Hi Carl, the rejects we reviewed yesterday were mostly good pouches, so these are false rejects. If we open the threshold, we will reject fewer good pouches, but some narrow seals that are genuinely weak will also start to pass, which would be false accepts, and we would not see them until a customer complaint. Before we move it, I want to find out why good pouches look narrow to the camera. It may be the lighting or the position of the pouch on the conveyor. I will look at it with the line technician this afternoon. Sanjay.",
        reading: [
          "Sanjay named the error Carl was seeing. The rejects had been reviewed and found good, so they were false rejects, and he said so plainly rather than disputing Carl's complaint.",
          "He then named the error Carl was not seeing. Opening the threshold would let weak seals through, and he said where those false accepts would be found, which is at the customer.",
          "Finally he refused to trade an invisible error for a visible one without understanding the cause. The next step is to find why good pouches look narrow, not to move the number.",
        ],
      },
      practice: {
        intro:
          "Here are three events from the seal checker at Pennine Pouch Co. Mark each as a False reject or a False accept, using the definitions at the top of this lesson.",
        check: {
          kind: "mark",
          prompt: "Mark each event at the seal checker as a False reject or a False accept.",
          passLabel: FALSE_REJECT,
          failLabel: FALSE_ACCEPT,
          sentences: [
            {
              id: "good-failed",
              text: "A pouch with a seal inside the width specification was rejected because it sat at an angle on the conveyor.",
              fail: false,
              why: "The pouch was good and the system failed it. That is a false reject, and the cause was position rather than the seal.",
            },
            {
              id: "leaker",
              text: "A pouch with a weak seal passed the checker and burst in the shipping carton.",
              fail: true,
              why: "The pouch was defective and the system passed it. That is a false accept, found later, as they usually are.",
            },
            {
              id: "wrinkle",
              text: "A pouch with a wrinkled seal outside the specification passed after the threshold was lowered on the night shift.",
              fail: true,
              why: "The seal was outside specification and the system passed it. That is a false accept, and the lowered threshold made it more likely.",
            },
          ],
          why: "That is right. The angled pouch was good and was failed, so it is a false reject. The other two were bad and were passed, so they are false accepts, and both were found after the line.",
        },
      },
      check: {
        kind: "mark",
        prompt: "Mark each event at a vision inspection station on a tablet line at Fernhill Pharma as a False reject or a False accept.",
        passLabel: FALSE_REJECT,
        failLabel: FALSE_ACCEPT,
        sentences: [
          {
            id: "chipped",
            text: "A tablet with a chipped edge passed the camera and was found at packing.",
            fail: true,
            why: "The tablet was defective and the system passed it. That is a false accept, found downstream as they usually are.",
          },
          {
            id: "darker",
            text: "A good tablet with a slightly darker colour, within specification, was rejected.",
            fail: false,
            why: "The tablet was within specification and the system failed it. That is a false reject.",
          },
          {
            id: "loosened",
            text: "After the threshold was loosened, tablets with small surface marks started to pass and were found at the customer's goods-in.",
            fail: true,
            why: "These tablets were defective and passed. Loosening the threshold traded fewer false rejects for these false accepts.",
          },
          {
            id: "powder",
            text: "A tablet dusted with powder from the press was rejected, and on review it was within specification.",
            fail: false,
            why: "On review the tablet was good, but the system failed it. That is a false reject.",
          },
        ],
        why: "You told the good parts that were failed from the bad parts that were passed. The darker tablet and the dusted tablet were good and rejected, and the chipped and marked tablets were bad and accepted, and were only found after they left the line.",
      },
      bridge:
        "The false accepts that matter most are the ones that happen without any warning at all, which is the quiet failure in the next lesson.",
    },
    {
      id: "the-quiet-failure",
      title: "The quiet failure",
      emphasis: "quiet",
      place:
        "This lesson starts the second module, The quiet failure. It explains how a vision system can lose its ability to detect defects while its numbers appear to improve.",
      sections: [
        {
          heading: "What a quiet failure is",
          paragraphs: [
            "A quiet failure is a loss of the system's ability to detect defects that does not raise an alarm. The camera still takes pictures, the software still measures, the screen still shows green ticks, and parts still flow. What has changed is that some defects the system used to catch are now passing.",
            "In each case the system keeps running and keeps passing parts, and it often shows a lower reject rate than before, because it is detecting less. That is what makes the failure quiet. Nothing in the normal running of the line tells anyone that the system has partly gone blind.",
          ],
        },
        {
          heading: "The usual causes",
          paragraphs: [
            "The common causes are physical and ordinary. A lamp dims with age, or a new window lets daylight fall across the station in the afternoon. A lens gathers dust from a moulding area or mists up near a washdown. A camera is knocked slightly out of position during cleaning or a tool change, so the inspection region no longer sits where the defect appears.",
            "Other causes come from the product and from people. A new supplier's material may have a different surface or colour, so a speck that stood out on the old material blends into the new one. Settings drift when someone adjusts a threshold or an exposure to deal with a problem on one shift and does not restore it afterwards.",
            "What these causes have in common is that each happens at a known moment: a lamp change, a clean, a tool change, a new material, an adjustment. That is useful, because it tells you when to be suspicious, and in the next lesson it tells you when to test.",
          ],
        },
        {
          heading: "A falling reject rate is a question, not good news",
          paragraphs: [
            "A falling reject rate may mean the process has improved. It may equally mean the system has gone partly blind. The two look identical on a monthly report, and the first explanation is always the more welcome one, so it is the one people tend to accept.",
            "The disciplined response is to ask what else changed at the time the rate started to fall, and then to test whether the system can still see a defect. If known-bad parts are still rejected, the improvement is probably real. If some of them pass, part of the fall is a quiet failure, and the output since the change needs looking at.",
          ],
          beforeAfter: {
            before: "Rejects at the vision station are down by half this month. Well done to the moulding team.",
            after:
              "Rejects at the vision station are down by half this month. The fall starts in the week the line was cleaned and the camera bracket moved. We will run the known-bad parts through before we credit the moulding team.",
            reading:
              "The first version treats a number as a result. The second links the fall to a change at the camera and says how the system will be tested before anyone draws a conclusion.",
          },
        },
        {
          heading: "A quiet failure and a visible fault",
          paragraphs: [
            "In this lesson you will sort events with two labels. An event is A quiet failure when the system keeps running and passing parts but can detect less than before, with no alarm. A dimmed lamp, a dusty lens, a camera knocked a few millimetres, and a threshold left loose after a problem are all quiet failures.",
            "An event is A visible fault when the system stops, alarms, or rejects everything, so that people know at once something is wrong. A camera that loses power and halts the line, or a lens so fogged that every part is rejected, is a visible fault. A visible fault is costly, but it is at least known, and nobody ships parts believing they were inspected.",
            "The mistake people usually make is to design their checks around visible faults. A start-of-shift check that confirms the camera is on and showing images will catch a visible fault and miss every quiet failure, because a partly blind camera is also on and showing images.",
          ],
        },
      ],
      workedExample: {
        title: "The monthly report at Castlegate Mouldings",
        inputLabel: "The monthly quality report",
        outputLabel: "The quality engineer's reading",
        prompt:
          "The reject rate at the cap vision station fell to about half its usual level over the last three weeks. The production manager has thanked the moulding team for the improvement.",
        output:
          "Three weeks ago the line was given a full clean and the camera bracket was moved to make access easier. The fall in rejects starts that week. I ran the five known-bad caps through this morning and two of them passed. The fall is at least partly a quiet failure. I have asked for the bracket to be reset and for caps from the last three weeks to be held for review.",
        reading: [
          "The report looked like an improvement, and the production manager had already treated it as one. Priya Nwosu, the quality engineer, did not dispute that the moulding team might have improved.",
          "She asked what else had changed at the same time as the fall began, and found a clean and a moved bracket in the same week. That gave her a physical cause that could explain a camera seeing less.",
          "She then tested the system with parts known to be bad. Two of five passing is evidence, not suspicion, and it turned a thank-you into a hold on three weeks of output.",
        ],
      },
      practice: {
        intro:
          "Here are three events from vision stations at different sites. Mark each as A quiet failure or A visible fault, using the definitions in the last section above.",
        check: {
          kind: "mark",
          prompt: "Mark each event as A quiet failure or A visible fault.",
          passLabel: VISIBLE,
          failLabel: QUIET,
          sentences: [
            {
              id: "power",
              text: "The camera controller lost power and the conveyor stopped with an alarm on the operator panel.",
              fail: false,
              why: "The line stopped and alarmed, so everyone knew at once. That is a visible fault.",
            },
            {
              id: "lamp",
              text: "The ring light at the station has dimmed over four months, and small scratches no longer stand out from the surface.",
              fail: true,
              why: "The system keeps running and passing parts but sees less, with no alarm. That is a quiet failure.",
            },
            {
              id: "exposure",
              text: "An operator raised the exposure to stop false rejects on a glossy batch and left it raised for the next product.",
              fail: true,
              why: "The system runs normally on the next product with a setting that may hide defects, and nothing alarms. That is a quiet failure.",
            },
          ],
          why: "That is right. The power loss stopped the line, so it was a visible fault. The dimmed light and the setting left raised both let the system keep passing parts while seeing less, which is what makes them quiet failures.",
        },
      },
      check: {
        kind: "choose",
        prompt:
          "The reject rate at a label inspection camera at Marsh Lane Drinks has fallen sharply this week. Two people have given explanations. Choose the explanation you would act on before thanking the team.",
        leftLabel: "Explanation A",
        left: "The printing team has improved. Rejects are down, so labels must be better.",
        rightLabel: "Explanation B",
        right:
          "The lamp at the camera was replaced on Monday with a different type, and the fall starts on Monday. We should run the known-bad labels through before we conclude that printing has improved.",
        correct: "right",
        why: "Explanation B links the fall to a change at the camera and tests whether the system can still see a bad label before drawing a conclusion. You treated a falling reject rate as a question to test, not as good news.",
        wrong:
          "Explanation A treats a lower reject rate as proof of better labels. A camera that sees less also rejects less. Choose the explanation that ties the fall to the lamp change and tests the system first.",
      },
      bridge:
        "The test in Explanation B is the challenge test, and the next lesson teaches you to write one that proves the system can still see.",
    },
    {
      id: "prove-it-can-still-see",
      title: "Prove it can still see",
      emphasis: "see",
      place:
        "This lesson completes the second module. It is the answer to the quiet failure: a short, routine test that proves the system can still detect the defects it is meant to detect.",
      sections: [
        {
          heading: "What a challenge test proves",
          paragraphs: [
            "A challenge test proves that the system can still detect the defects it is meant to detect. Someone runs a small set of parts that are known to be bad through the system, and confirms that every one of them is rejected. A known good part may also be run, to confirm it passes.",
            "The test answers the question that normal running cannot. A camera that has gone partly blind still passes good parts and still shows green ticks, so watching the line tells you nothing. Only a part you already know is bad can tell you whether the system would catch it today.",
          ],
        },
        {
          heading: "The challenge set",
          paragraphs: [
            "The known-bad parts are often called challenge parts, reject masters, or limit samples, depending on the site and the industry. Each carries one of the defects the system is configured to find. A cap station that checks for oversize, undersize, black specks, short shots, and flash needs at least one challenge cap for each.",
            "The parts must be controlled. Each is labelled with the defect it carries, stored in a fixed place such as a locked box at the station, and checked from time to time to make sure it still carries the defect. A challenge part that has been handled until its speck has rubbed off is no longer a challenge, and a set kept loose in a drawer will sooner or later be mixed with good stock.",
            "Where a defect is close to the limit, the challenge part should be close to the limit too. A gross defect proves the system is switched on. A part just outside tolerance proves the threshold is still where it should be.",
          ],
        },
        {
          heading: "When it runs and where it is recorded",
          paragraphs: [
            "The test runs at an agreed frequency, often at the start of each shift. It also runs after any change that can cause a quiet failure: cleaning, a lamp replacement, a camera or bracket moved, a tool change, a new material, or any adjustment to the settings. Those are the moments the last lesson named, and a test that runs only once a day can miss a failure caused at ten in the morning.",
            "The result is recorded every time, on the station sheet or in the system log, with the time, the parts run, the outcome, and the name of the person who ran it. The record is what lets you say, after a problem, which output was made while the system was proved to be working.",
          ],
        },
        {
          heading: "What happens when a challenge part passes",
          paragraphs: [
            "The procedure must say what happens if a challenge part passes, because that is the moment it exists for. The system is treated as not working. Output made since the last successful challenge is held, or re-inspected as the quality procedure requires. The quality owner is told, and the system is not used again until the cause is found and the challenge set is rejected in full.",
            "The temptation is to run the part again until it is rejected. That proves only that the system catches the defect some of the time, which is not the standard. One pass of a challenge part is a failed test.",
          ],
          beforeAfter: {
            before: "Run the test parts. If there is a problem, tell the supervisor.",
            after:
              "If any challenge part passes, stop using the system, hold all output since the last successful challenge, and call the quality engineer on shift. Do not re-run the part to get a reject.",
            reading:
              "The first version leaves the operator to decide what a problem is and what to do. The second says the system stops, names the output to hold, names who is told, and closes off the re-run.",
          },
        },
        {
          heading: "What a challenge test is not",
          paragraphs: [
            "A challenge test is not a calibration of the camera. Calibration concerns the accuracy of the measurement, such as how many pixels make a millimetre, and it is usually done by the integrator or a technician with a reference target. A challenge test concerns detection, and it is done by the line.",
            "A challenge test also does not prove the system catches everything. It proves that the system still catches the specific defects in the challenge set. A defect type that is not in the set, or not in the configuration, is still a matter for the human check in the next lesson.",
          ],
        },
      ],
      workedExample: {
        title: "The cap station start-of-shift check",
        inputLabel: "The current check",
        outputLabel: "The rewritten check",
        prompt: "Check camera is on and screen shows images.",
        output:
          "At the start of each shift, and after cleaning, a lamp change, a tool change, or a material change: run the five challenge caps from the locked box at the station (oversize, undersize, black speck, short shot, flash), one at a time. Each must be rejected. Then run one good cap, which must pass. Record the result, the time, and your name on the station sheet. If any challenge cap passes, stop using the system, hold the caps produced since the last successful challenge, and call the quality engineer on shift.",
        reading: [
          "The first check proved only that the camera had power. A camera with a dim lamp, a dusty lens, or a knocked bracket would pass it every time.",
          "The rewrite names the five defects in the challenge set, where the parts are kept, and the good cap that confirms the system is not simply rejecting everything. It runs at the start of each shift and after each of the changes that cause quiet failure at this station.",
          "It records the result with a name, and it says what happens if the system cannot see a known defect: the system stops, output since the last good challenge is held, and a named role is called.",
        ],
      },
      practice: {
        intro:
          "Two team leaders at Harrow Preserves have each drafted a start-of-shift check for the jar camera. Choose the one that would catch a quiet failure. The worked example above is still there to compare.",
        check: {
          kind: "choose",
          prompt: "Choose the start-of-shift check that proves the jar camera can still see a defect.",
          leftLabel: "Check A",
          left:
            "At the start of each shift and after any clean or lamp change, run the three challenge jars from the labelled box (no lid, low fill, glass fragment in the top layer). Each must be rejected. Record the result on the station sheet. If any passes, stop, hold jars since the last good challenge, and call the shift quality lead.",
          rightLabel: "Check B",
          right:
            "At the start of each shift, confirm the camera screen shows live images and the reject count has reset to zero. Record the check on the station sheet.",
          correct: "left",
          why: "Check A runs known-bad jars through the system after the changes that cause quiet failure, records the result, and says what to do if one passes. Check B would pass on a camera that has gone partly blind, because a blind camera still shows live images.",
          wrong:
            "Look again at Check B. A screen showing live images and a reset counter proves the camera has power, not that it can see a defect. Check A uses known-bad jars and says what happens if one passes.",
        },
      },
      check: {
        kind: "edit",
        prompt:
          "This challenge test for a seal inspection camera at Pennine Pouch Co. is missing parts the lesson named. Edit it so it runs after the changes that cause quiet failure, says where the result is recorded, and says what happens if a known-bad pouch passes.",
        label: "The challenge test you are repairing",
        start: "Once a day, run the known-bad pouches through the seal camera and check they are rejected.",
        unchanged:
          "You have not changed the procedure yet. Add when else it runs, where the result is recorded, and what happens if a known-bad pouch passes.",
        keep: [
          {
            id: "parts",
            any: ["known-bad", "known bad", "challenge"],
            missing: "Keep the known-bad pouches. The test still has to run parts that are known to be bad.",
          },
          {
            id: "reject",
            any: ["reject"],
            missing: "Keep the requirement that every known-bad pouch is rejected, because that is what the test proves.",
          },
        ],
        limits: [
          {
            id: "trigger",
            any: ["clean", "lamp", "bulb", "light", "change", "moved", "knocked", "adjust", "maintenance", "changeover"],
            missing:
              "Your procedure runs once a day only. Add a run after cleaning, a lamp change, or any other change at the camera, because those are the causes of quiet failure.",
          },
          {
            id: "record",
            any: ["record", "log", "sheet", "write", "written", "sign"],
            missing: "Your procedure does not say where the result is recorded. Add where it is written down, such as the station sheet.",
          },
          {
            id: "hold",
            any: ["hold", "held", "quarantine", "re-inspect", "reinspect", "segregate"],
            missing:
              "Your procedure does not say what happens to output if a known-bad pouch passes. Add that output since the last successful challenge is held.",
          },
          {
            id: "owner",
            any: ["quality engineer", "quality owner", "quality manager", "quality lead", "tell", "call", "inform", "notify", "escalate"],
            missing:
              "Your procedure does not say who is told if a known-bad pouch passes. Add that the quality owner is called.",
          },
        ],
        limitWording: false,
        why: "Your challenge test now runs after the changes that cause quiet failure, records its result, and says what to do if the system cannot see a known defect: hold the output since the last good challenge and tell the quality owner.",
        result: {
          label: "What the operator now does",
          text: "At 06:00 and again after the 10:30 clean, Dean runs the four known-bad pouches. All four are rejected at 06:00. After the clean, the narrow-seal pouch passes. Dean stops the camera, tags the pouches made since 06:00 as held, writes both results on the station sheet, and calls the quality engineer.",
        },
      },
      bridge:
        "A challenge test protects what the camera judges. The next lesson decides what a person still checks, for everything the camera does not judge.",
    },
    {
      id: "the-human-check",
      title: "The human check",
      emphasis: "human",
      place:
        "This lesson is the third module, The human check. You know what the camera judges, how it can be wrong, and how to prove it still sees. This lesson divides the rest of the inspection between the system and people.",
      sections: [
        {
          heading: "Four things a person still checks",
          paragraphs: [
            "When a vision system is in place, a person still checks four kinds of thing. The first is anything the system does not measure, which the first lesson taught you to list from the setup sheet. If the camera checks that a batch code is printed but not that it is today's, a person checks the code.",
            "The second is a sample of accepted parts, audited at a set frequency. The third is a review of rejected parts. The fourth is any new product, new material, or change of supplier, until the system has been proved on it with challenge parts made from that product or material.",
          ],
        },
        {
          heading: "Auditing what was accepted",
          paragraphs: [
            "Auditing a sample of accepted parts is the only way to find false accepts at the line. The second lesson showed that false accepts look like passes and are usually found later. A person who takes twenty parts from the accepted side every two hours and inspects them properly will find some of those escapes while the batch is still on site.",
            "The sample should have a size, a frequency, and a record. Recognised sampling schemes such as ISO 2859-1 can help a quality engineer set the size and frequency for a given lot and risk, and the manufacturer's documentation will say what the system logs. The audit looks for the configured defects and for the defects the camera does not measure.",
          ],
        },
        {
          heading: "Reviewing what was rejected",
          paragraphs: [
            "The reject bin holds the false rejects, and a review of it at a set time, often the end of each shift, is how you find them and their causes. Good parts that keep being rejected for the same reason point to lighting, position, dust, or a threshold set too tight.",
            "The review also protects the threshold. When someone asks to loosen it, the answer should start with what the last reject reviews showed. Without those reviews, the only evidence in the room is the size of the bin.",
          ],
        },
        {
          heading: "What the human check is not",
          paragraphs: [
            "The human check is not a full re-inspection of every part. That would defeat the purpose of the system, and people who inspect every part that a machine has already passed soon stop looking closely. It is also not a quick glance at the line with no record, which is what a vague instruction such as 'keep an eye on it' produces.",
            "It is a defined set of checks, each with a frequency, a record, and an owner. The owner is a named role, such as the line inspector or the quality engineer on shift, so that when a check is missed, someone knows it was theirs.",
          ],
          beforeAfter: {
            before: "Operators should keep an eye on the cartons as well as the camera.",
            after:
              "The line inspector opens 10 accepted cartons every two hours to check the leaflet version and records the result on the audit sheet. The shift quality lead reviews the reject bin at the end of each shift.",
            reading:
              "The first version gives everyone a vague duty and nobody a task. The second names each check, its frequency, its record, and its owner.",
          },
        },
        {
          heading: "Two labels for dividing the work",
          paragraphs: [
            "In this lesson you will mark each check with one of two labels. A check is The camera judges this when it is one of the configured features on the setup sheet, measured in its region against its threshold, and proved by the challenge test.",
            "A check is A person still checks this when the camera does not measure it, when it is an audit of accepted parts or a review of rejected ones, or when it concerns a new product or material not yet proved. The mistake people usually make is to hand a correctness check to the camera because the camera checks presence, so read each check for whether it asks that something is there or that it is right.",
          ],
        },
      ],
      workedExample: {
        title: "The human check at Marsh Lane Drinks",
        inputLabel: "What the setup sheet showed",
        outputLabel: "The human check Helen wrote",
        prompt:
          "The camera checks label presence, label position within 2 millimetres, barcode readability, and that a batch code is printed. It does not check that the batch code is today's, or that the label is intact.",
        output:
          "The camera judges label presence, position, barcode readability, and that a batch code is printed. A person still checks: that the batch code is today's, at the start of each run and each hour, by the line leader; a sample of 20 accepted bottles for label tears and damage every two hours, by the line inspector; the reject bin at the end of each shift, to find why good bottles were rejected, by the line inspector; and every new label design for the first full run, by the quality manager.",
        reading: [
          "Helen Achebe started from the first lesson's finding. The batch code check is new, and it covers the gap the setup sheet revealed.",
          "The two-hourly audit of accepted bottles is how false accepts are found at the line, including tears the camera was never set up to see. The shift-end review of rejects is how false rejects and their causes are found.",
          "The first run of a new label design is covered by a person until the system has been proved on it. Each check has a frequency and an owner, and nobody is being asked to look at every bottle.",
        ],
      },
      practice: {
        intro:
          "Two quality leads at Fernhill Pharma have proposed what people should check at the tablet camera. Choose the proposal that is a human check in the sense this lesson defined.",
        check: {
          kind: "choose",
          prompt: "Choose the proposal that defines a human check people can carry out and an auditor can confirm.",
          leftLabel: "Proposal A",
          left:
            "To be safe, the inspectors will look at every tablet again after the camera, on the same shift, until we are confident in the system.",
          rightLabel: "Proposal B",
          right:
            "The line inspector audits 30 accepted tablets every hour for marks outside the camera's regions and records them on the audit sheet. The shift quality lead reviews the reject tray at the end of each shift.",
          correct: "right",
          why: "Proposal B defines each check with a frequency, a record, and an owner, and it covers both the accepted side and the rejects. Proposal A re-inspects everything with no record and no end point, which defeats the system and soon stops being done with care.",
          wrong:
            "Look again at Proposal A. Re-inspecting every tablet has no record, no owner, and no end date, and it is the full re-inspection the lesson says the human check is not. Proposal B names what is checked, how often, and by whom.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "A vision system on a carton line at Fernhill Pharma checks that a leaflet is present, that the carton is closed, and that the printed expiry date is legible. Mark each check as The camera judges this or A person still checks this.",
        passLabel: CAMERA,
        failLabel: PERSON,
        sentences: [
          {
            id: "leaflet",
            text: "The leaflet is present in the carton.",
            fail: false,
            why: "Leaflet presence is one of the configured checks, so the camera judges this.",
          },
          {
            id: "expiry",
            text: "The expiry date printed is the correct date for this batch.",
            fail: true,
            why: "The system checks that the date can be read, not that it is correct. A person still checks this.",
          },
          {
            id: "version",
            text: "A sample of accepted cartons is opened to check the leaflet is the right version.",
            fail: true,
            why: "The system checks only that a leaflet is present. Checking the version on a sample of accepted cartons is how false accepts are found, so a person still checks this.",
          },
          {
            id: "flaps",
            text: "The carton flaps are closed.",
            fail: false,
            why: "Carton closure is one of the configured checks, so the camera judges this.",
          },
        ],
        why: "You gave the camera what it measures and kept for people what it does not. Presence and closure are configured checks, while the correct expiry date and the leaflet version ask whether something is right, which the camera does not measure.",
      },
      bridge:
        "The next lesson brings the judgement, the two errors, the quiet failure, the challenge test, and the human check together in a set of situations you have not seen, and assesses how you apply them.",
    },
    {
      id: "inspection-assessment",
      title: "Judging a live inspection station",
      emphasis: "live",
      place:
        "This is the course assessment, the second-to-last lesson. It recaps the method, works one mixed example from a real station, and then asks you to apply the whole method across eight situations before you write your own brief.",
      sections: [
        {
          heading: "The method in five questions",
          paragraphs: [
            "Every lesson so far has taught one question to ask of a vision system. The first is what the camera is judging: which features are configured, in which regions, against which thresholds, and which judgements people assume it makes that it does not. You answer it from the setup sheet, not from the sales brochure or the line's memory.",
            "The second is how it can be wrong. A false reject is a good part failed, and a false accept is a bad part passed. The threshold trades one against the other, and the person who may change it should be named and should review both errors first. The third is how it can fail quietly: a lamp, a lens, a knocked camera, a new material, or a setting left changed, each of which lowers the reject rate while the system sees less.",
            "The fourth is how you prove it can still see: known-bad challenge parts, run at the start of each shift and after every change that can cause a quiet failure, recorded, with a stop and a hold if any part passes. The fifth is what a person still checks: what the camera does not measure, a sample of accepted parts, a review of rejects, and anything new, each with a frequency, a record, and an owner.",
          ],
        },
        {
          heading: "Reading a station as a whole",
          paragraphs: [
            "In practice the questions arrive tangled together. A complaint about waste is a threshold question, but the answer may be a quiet failure. A customer complaint about an escape is a false accept, but the fix may be a missing human check. The skill is to recognise which question a situation is really asking, and to answer it with the move the course taught rather than the one that makes the problem go away fastest.",
            "Most bad decisions at a vision station share one feature: they trust a number the system produced without asking what the system can see. A low reject rate, a green screen, a supplier's claim, and a challenge part that passes on the second try are all numbers of that kind. The method exists to test them.",
          ],
        },
        {
          heading: "How the assessment works",
          paragraphs: [
            "The assessment has eight situations from stations you have not seen in this course. Each has three or four options, and each option is something a reasonable professional might do. Exactly one is right for a reason the course taught.",
            "You need six of the eight to pass. After you submit, each question shows whether your choice was right and why, so you can read the reasoning for any you missed. If you do not reach six, you stay on this lesson and can try again after reading the feedback.",
          ],
        },
      ],
      workedExample: {
        title: "A Monday meeting at Brookfield Components",
        inputLabel: "The note from the weekly quality meeting",
        outputLabel: "The quality engineer's response",
        prompt:
          "Rejects at the bracket camera are down since the new steel supplier started on the 4th. Production want the threshold opened a little more to cut the remaining rejects. The start-of-shift check has been 'camera on, images showing' since the station was installed. The inspector who used to check hole burrs was moved to goods-in because 'the camera does that now'.",
        output:
          "The setup sheet shows the camera checks hole position and hole diameter. It does not check for burrs, so burrs are back with a person from today, sampled every two hours by the line inspector. The fall in rejects starts with the new steel, which has a brighter finish, so I have run our reject masters through: the undersize hole was passed. That is a quiet failure. The threshold stays where it is, and only the quality engineer will change it after we have reviewed the rejects and the audit. From tomorrow the start-of-shift check runs the four reject masters, and runs again after any material change, and a failure stops the camera and holds output since the last good check.",
        reading: [
          "Tom Ferreira answered each tangled point with the question it was really asking. The burr check was a judgement the system does not make, so it went back to a named person with a frequency.",
          "The falling reject rate lined up with a new material, so he tested with known-bad parts before accepting it, and one passed. The request to open the threshold was refused for now, because there was no review of both errors and the system was already missing a defect.",
          "The start-of-shift check was rewritten into a challenge test with a trigger after change and a stop and hold if a part passes. One meeting note touched all five questions, and each was answered with the move from its lesson.",
        ],
      },
      practice: {
        intro:
          "Before the assessment, try one mixed situation. Choose the response that asks the right question first. The worked example above is still on the page.",
        check: {
          kind: "choose",
          prompt:
            "A new vision system at Oakley Foods is described by its integrator as 'checking tray seals'. The shift manager wants to move the seal inspector to another line on Monday. Choose the response you would give.",
          leftLabel: "Response A",
          left:
            "Agree to the move, because the integrator has confirmed the camera checks tray seals and the reject rate in the first week has been low.",
          rightLabel: "Response B",
          right:
            "Ask for the setup sheet first, list which seal features are measured and which the inspector checks that the camera does not, and keep a person on those until the system is proved with challenge trays.",
          correct: "right",
          why: "Response B starts with what the camera is actually judging, keeps a person on what it does not measure, and proves the system before relying on it. A low reject rate in week one says nothing about false accepts.",
          wrong:
            "Look again at Response A. 'Checks tray seals' is a description, not a list of configured features, and a low reject rate tells you nothing about what is passing. Response B reads the setup sheet and proves the system first.",
        },
      },
      check: {
        kind: "scenario",
        prompt:
          "Read each situation and choose the response that follows the method this course taught. You need six of the eight to pass.",
        passMark: 6,
        questions: [
          {
            id: "supplier-claim",
            situation:
              "Greta Lindqvist is buying a vision system for a tray-sealing line at Hollins Foods. The supplier's proposal says the system 'detects all cosmetic and seal defects'. The capital request goes to the board on Thursday.",
            question: "What should Greta do before she recommends the system?",
            options: [
              {
                id: "a",
                text: "Accept the claim, because the supplier is reputable and the proposal is signed.",
                feedback:
                  "A signed proposal does not tell you what is configured. If the board buys on 'all defects', the line will later drop checks the camera never makes. Ask for the list of features and regions instead.",
              },
              {
                id: "b",
                text: "Ask the supplier for the list of configured features, the regions they cover, and the defect types that will not be checked, and compare it with the current inspection.",
                correct: true,
                feedback:
                  "That holds. A vision system answers only the questions it is configured to answer, so the list of features and the gaps is the only honest basis for the decision.",
              },
              {
                id: "c",
                text: "Run ten good trays through a demonstration unit and recommend it if none are rejected.",
                feedback:
                  "Ten good trays passing tells you about false rejects, not about what the system can detect. It says nothing about the defects it would miss. Start from the configured features.",
              },
              {
                id: "d",
                text: "Ask for a lower price, since the claim cannot be tested before purchase.",
                feedback:
                  "Price does not change what the system judges. The claim can be tested on paper by asking for the configured features and regions, and that is the step to take.",
              },
            ],
          },
          {
            id: "night-threshold",
            situation:
              "At 03:00 the reject bin at the label camera at Wexford Dairies filled up, and the night supervisor lowered the threshold so the line could keep running. It is now 07:30. The reject rate on the day shift is a third of normal and the day manager is pleased.",
            question: "What should the quality engineer on the day shift do?",
            options: [
              {
                id: "a",
                text: "Leave the new threshold in place, because rejects are down and the night shift had a reason.",
                feedback:
                  "A lower reject rate after loosening the threshold is expected, and it means more bad labels are passing unseen. Leaving it in place trades a visible error for an invisible one without any review.",
              },
              {
                id: "b",
                text: "Ask the night supervisor to write a note explaining the change, and review it at the end of the week.",
                feedback:
                  "A note is useful, but the loose threshold would run for days. The output since 03:00 may contain false accepts now, and the threshold should go back until both errors are reviewed.",
              },
              {
                id: "c",
                text: "Restore the recorded threshold, run the challenge labels, review the night's rejects to find the cause, and hold output made since 03:00 for audit.",
                correct: true,
                feedback:
                  "That holds. The threshold is a decision about which error to accept, so it goes back until both are reviewed, and the output made under the loose setting is checked for false accepts.",
              },
            ],
          },
          {
            id: "customer-escape",
            situation:
              "A customer of Castlegate Mouldings has returned 40 caps with flash on the rim. The caps passed the vision station, and the station's reject rate that week was normal. The account manager wants to know how this can be found before it leaves site next time.",
            question: "Which answer is right?",
            options: [
              {
                id: "a",
                text: "These are false rejects, so the threshold should be loosened to reduce waste.",
                feedback:
                  "The caps were bad and were passed, so they are false accepts, not false rejects. Loosening the threshold would let more of them through.",
              },
              {
                id: "b",
                text: "Nothing can be done, because the camera passed them and the reject rate was normal.",
                feedback:
                  "A normal reject rate tells you nothing about false accepts. They can be found at the line by auditing accepted parts, and that is the check to add.",
              },
              {
                id: "c",
                text: "Add a person to re-inspect every cap after the camera until the customer is satisfied.",
                feedback:
                  "Re-inspecting every cap defeats the system and soon stops being done with care. A defined audit of accepted caps with a frequency, a record, and an owner is the better check.",
              },
              {
                id: "d",
                text: "These are false accepts. Check the flash tool is in the configuration and in the challenge set, and add a timed audit of accepted caps with a named owner.",
                correct: true,
                feedback:
                  "That holds. You named the error correctly, checked whether the camera is set up and proved for flash, and added the audit of accepted parts, which is the only way to find escapes at the line.",
              },
            ],
          },
          {
            id: "new-film",
            situation:
              "Pennine Pouch Co. switched to a new film supplier on the 12th. Since then the reject rate at the seal camera has fallen by more than half. The operations director has asked for the saving to go in the monthly report.",
            question: "What should happen before the saving is reported?",
            options: [
              {
                id: "a",
                text: "Run the challenge pouches, made on the new film, through the camera to confirm each is rejected before crediting the new supplier.",
                correct: true,
                feedback:
                  "That holds. A new material is a common cause of quiet failure, and the fall starts on the day it arrived. Only known-bad pouches on the new film can show whether the camera still sees.",
              },
              {
                id: "b",
                text: "Report the saving, because the new film is known to be higher quality.",
                feedback:
                  "The film may well be better, but a camera that sees less also rejects less. The fall lines up with a change of material, so test before reporting.",
              },
              {
                id: "c",
                text: "Tighten the threshold to bring the reject rate back to its old level.",
                feedback:
                  "Tightening the threshold without knowing the cause changes the balance of errors blindly. First test with known-bad pouches whether the camera can still see a defect on the new film.",
              },
            ],
          },
          {
            id: "second-try",
            situation:
              "At the start of the early shift at Harrow Preserves, Aisha runs the four challenge jars. The low-fill jar passes. The team leader suggests running it again, and on the second run it is rejected.",
            question: "What should Aisha do?",
            options: [
              {
                id: "a",
                text: "Record a pass, because the jar was rejected on the second run.",
                feedback:
                  "A second run that rejects proves only that the camera catches low fill some of the time. The first pass is a failed test, and recording it as a pass hides it.",
              },
              {
                id: "b",
                text: "Record both runs and carry on, and mention it at the shift handover.",
                feedback:
                  "Recording both runs is honest, but carrying on means jars are being made on a system that has just failed its challenge. The system should stop and output should be held.",
              },
              {
                id: "c",
                text: "Treat the test as failed, stop using the camera, hold jars made since the last successful challenge, record it, and call the shift quality lead.",
                correct: true,
                feedback:
                  "That holds. One pass of a challenge part is a failed test. The procedure stops the system, holds the output at risk, and tells the quality owner.",
              },
              {
                id: "d",
                text: "Replace the low-fill jar with a fresh one from the line, because the old one may have settled.",
                feedback:
                  "A jar from the line is not a verified challenge part. Checking the challenge set is sensible later, but the test has failed now, and the camera should stop and output should be held.",
              },
            ],
          },
          {
            id: "worn-set",
            situation:
              "During an internal audit at Brookfield Components, Jonah finds the reject masters for the bracket camera loose in an unlabelled drawer at the station. One of them, the burred hole sample, has been handled so often that the burr is barely visible.",
            question: "What is the right correction?",
            options: [
              {
                id: "a",
                text: "Leave the parts where they are, since the operators know which is which.",
                feedback:
                  "Unlabelled parts in a drawer will sooner or later be mixed with good stock or with each other, and a worn part no longer challenges the system. The set has to be controlled.",
              },
              {
                id: "b",
                text: "Store the set labelled in a locked box at the station, replace the worn burr sample with a verified one, and add a periodic check of the set to the procedure.",
                correct: true,
                feedback:
                  "That holds. A challenge part is only useful while it carries its defect and is known for what it is, so the set is labelled, secured, and checked, and the worn part is replaced.",
              },
              {
                id: "c",
                text: "Stop using reject masters and rely on the camera's self-test at power-up.",
                feedback:
                  "A power-up self-test shows the camera is working, not that it can see a burr. That is the check for a visible fault. Only known-bad parts prove detection.",
              },
            ],
          },
          {
            id: "keep-an-eye",
            situation:
              "The production manager at Oakley Foods writes a new work instruction for the tray line: 'Operators to keep an eye on trays as well as the camera.' The camera checks seal presence and seal width, but not the print on the lid film.",
            question: "What should the quality engineer ask for instead?",
            options: [
              {
                id: "a",
                text: "Nothing, because operators are already at the line and will notice problems.",
                feedback:
                  "A vague duty with no frequency, record, or owner produces a glance, not a check. The lid print is not measured by the camera, so it needs a defined human check.",
              },
              {
                id: "b",
                text: "A full re-inspection of every tray by a second operator.",
                feedback:
                  "Re-inspecting every tray defeats the system and people soon stop looking closely. A sampled check with a frequency and an owner covers the gap without that cost.",
              },
              {
                id: "c",
                text: "A request to the integrator to add a print check, with no other change until it arrives.",
                feedback:
                  "Adding a print check may be sensible, but until it is configured and proved the lid print is not checked by anyone. A person has to cover it in the meantime.",
              },
              {
                id: "d",
                text: "A defined check of lid print on a sample of accepted trays at a set frequency, recorded on the audit sheet, with the line inspector named as owner, and a shift-end reject review.",
                correct: true,
                feedback:
                  "That holds. You covered the judgement the camera does not make with a check that has a frequency, a record, and an owner, and kept a review of rejects for false rejects.",
              },
            ],
          },
          {
            id: "new-variant",
            situation:
              "Marsh Lane Drinks launches a new 330 millilitre bottle with a clear label on Monday. The label camera was set up and proved on the 500 millilitre bottle with a white label. The launch plan says the camera will inspect the new bottle from the first run.",
            question: "What should the plan say?",
            options: [
              {
                id: "a",
                text: "A person inspects the first full run of the new bottle while challenge bottles with the new label are made and run, and the camera is relied on only once they are all rejected.",
                correct: true,
                feedback:
                  "That holds. A new product or material is covered by a person until the system is proved on it, and a clear label on a new bottle may look quite different to the camera.",
              },
              {
                id: "b",
                text: "Rely on the camera from the first run, since it passed its challenge test on the 500 millilitre bottle this morning.",
                feedback:
                  "The challenge test proves the camera can see defects on the product it was run with. A clear label on a smaller bottle is a new case, and the camera has not been proved on it.",
              },
              {
                id: "c",
                text: "Loosen the threshold for the launch week, so that false rejects do not delay the first orders.",
                feedback:
                  "Loosening the threshold on an unproved product increases false accepts at the point you know least about the camera's performance. Prove it first and keep a person on the first run.",
              },
            ],
          },
        ],
        why: "You applied the whole method: you read what the camera judges, named the errors correctly, tested a falling reject rate before trusting it, treated a challenge failure as a stop, and kept defined human checks where the camera does not reach.",
      },
      bridge:
        "You have applied the method to stations you had not seen. In the final lesson you will write it down for a system you rely on, as the inspection brief your record will show.",
    },
    {
      id: "the-inspection-brief",
      title: "The inspection brief",
      emphasis: "brief",
      place:
        "This is the final lesson and the fourth module, The inspection brief. You will write the brief for one vision system you rely on or are responsible for, and that brief is the work your record will show.",
      sections: [
        {
          heading: "What the brief is for",
          paragraphs: [
            "The inspection brief is a one-page account of one vision inspection system. It is written so that a new quality engineer, an auditor, or a line manager could understand what the system is doing and what is still in people's hands, without having to find the integrator or the person who set it up.",
            "Most stations have the pieces of this already, scattered across a setup sheet, a work instruction, a start-up checklist, and the memory of one engineer. The brief puts them in one place, and in doing so it shows the gaps, such as a check nobody owns or a change after which nobody tests.",
          ],
        },
        {
          heading: "The five parts",
          paragraphs: [
            "The first part is what the camera judges and does not judge: the configured features, and the judgements people might assume it makes that it does not. The second is how it can be wrong: where false rejects and false accepts are found, the role who may change the threshold, and the rule that nobody changes it without reviewing both errors.",
            "The third is how it can fail quietly at this station, naming the likely causes here, such as the dust from a nearby process or the tool changes that happen weekly. The fourth is the challenge test: the parts, the frequency including the triggers after change, where it is recorded, and the action if a challenge part passes. The fifth is the human check: each check, its frequency, and its owner.",
          ],
        },
        {
          heading: "Writing each part so an auditor could check it",
          paragraphs: [
            "The test for each line of the brief is whether an auditor could check it against the station. A line is Ready to audit when it names something an auditor could look at or ask for: a feature on the setup sheet, a role, a record, a frequency, a box of parts. 'Quality engineer only, recorded on the change sheet' is ready to audit.",
            "A line is one where An auditor would have to ask when it leaves the auditor unable to tell what is done, when, or by whom. 'Threshold managed sensibly' and 'staff check the product regularly' are lines of that kind, because an auditor would have to ask who, how often, and where it is written down.",
            "Write the limit on the threshold with words such as only or never, so the rule is plain. Name roles rather than people, because people move and the brief should outlast them.",
          ],
        },
        {
          heading: "How the brief is checked",
          paragraphs: [
            "When you continue, each part is checked for substance. What the camera judges must state what the system does not judge as well as what it does. The threshold part must name a role and set a clear limit. The quiet failure part must name at least one likely cause at this station. The challenge test must say what happens to output if a challenge part passes. The human check must name who does each check.",
            "If a part is missing, the note will name it and say what to add. Length alone never passes. When every part is present, you can sign your name against the brief, and the record shows it as you wrote it.",
          ],
        },
        {
          heading: "Keep confidential detail out",
          paragraphs: [
            "The brief will appear on a record that a second person can open with the reference. Do not include customer names, part numbers, or settings your organisation treats as confidential. Replace them with realistic descriptions that keep the same meaning, such as 'the flagship cap' or 'the recorded threshold'.",
            "The record shows the brief you wrote. It is not a validation of any inspection system, and it does not certify compliance with any quality or regulatory standard.",
          ],
        },
      ],
      workedExample: {
        title: "The cap inspection brief at Castlegate Mouldings",
        inputLabel: "What Priya had gathered",
        outputLabel: "The brief she wrote",
        prompt:
          "The setup sheet for the cap station, the start-of-shift check from lesson four, the three-week quiet failure after the bracket was moved, and the line team's list of what they thought the camera checked.",
        output:
          "What the camera judges and does not judge: judges outside diameter against drawing tolerance, black specks in the top face region, short shot and flash on the rim; does not judge whether the cap seals, specks outside the top face region, or colour shade.\nHow it can be wrong, and who may change the threshold: false rejects are found in the shift-end bin review; false accepts are found by the hourly audit and by the filling line. Only the quality engineer may change a threshold, after reviewing both errors, recorded on the change sheet.\nHow it can fail quietly here: lamp ageing, lens dust from the moulding area, bracket knocked during tool changes, a new masterbatch supplier.\nThe challenge test: five challenge caps from the locked box at the start of each shift and after cleaning, a lamp change, a tool change, or a material change; recorded on the station sheet; if any passes, stop, hold output since the last good challenge, call the quality engineer.\nThe human check: hourly audit of 20 accepted caps for defects outside the configured regions, by the line inspector; shift-end reject review, by the line inspector; first full run of any new colour or material, by the quality engineer.",
        reading: [
          "Each part does one job and could be checked by an auditor who was not there when it was written. The judgement part lists three configured features and three things the camera does not judge.",
          "The threshold rule names a role and uses only, so it is plain who may move it. The quiet failure part names causes specific to this station, including the bracket that caused the real failure three weeks earlier.",
          "The challenge test and the human check each say what is done, how often, where it is recorded, and by whom. Anyone can see what the camera does, what could go wrong without warning, how that is caught, and what people still do.",
        ],
      },
      practice: {
        intro:
          "Before you write your own brief, mark each line of this draft for a jar camera as Ready to audit or An auditor would have to ask. You will use the same test on your own brief in a moment.",
        check: {
          kind: "mark",
          prompt: "Mark each line of the draft brief as Ready to audit or An auditor would have to ask.",
          passLabel: READY,
          failLabel: ASK,
          sentences: [
            {
              id: "judges",
              text: "Judges lid presence, fill level within the band, and foreign bodies in the top 20 millimetres; does not judge lid torque or glass below the top layer.",
              fail: false,
              why: "It lists configured features and names what the camera does not judge, so an auditor could check it against the setup sheet.",
            },
            {
              id: "threshold",
              text: "The threshold is managed sensibly by the team.",
              fail: true,
              why: "It names no role and no rule, so an auditor would have to ask who may change it and on what basis.",
            },
            {
              id: "challenge",
              text: "Three challenge jars from the labelled box at each shift start and after any clean or lamp change; recorded on the station sheet; if any passes, stop and hold jars since the last good challenge.",
              fail: false,
              why: "It names the parts, the frequency with triggers after change, the record, and the action, so it is ready to audit.",
            },
            {
              id: "human",
              text: "Staff check the jars regularly.",
              fail: true,
              why: "It gives no check, no frequency, and no owner, so an auditor would have to ask what is checked, how often, and by whom.",
            },
          ],
          why: "That is right. The judgement and challenge lines name things an auditor could look at, while 'managed sensibly' and 'check regularly' leave the auditor asking who, how often, and where it is recorded.",
        },
      },
      check: {
        kind: "build",
        prompt:
          "Write the inspection brief for a vision system you rely on or are responsible for. Fill in all five parts so that a colleague or an auditor could check each one against the station.",
        fields: [
          {
            id: "judges",
            label: "What the camera judges and does not judge",
            hint: "The configured features it measures, then at least one judgement people might assume it makes that it does not.",
            min: 40,
            any: ["does not", "doesn't", "not judge", "not check", "not measure", "cannot", "can't"],
            missing:
              "Your judges field has no line on what the camera does not judge. Name at least one judgement people might assume the system makes, and say plainly that it does not make it.",
          },
          {
            id: "threshold",
            label: "How it can be wrong, and who may change the threshold",
            hint: "Where false rejects and false accepts are found, and the role who may change the threshold, written with only or never.",
            min: 30,
            rule: "limit",
            any: ["engineer", "manager", "supervisor", "owner", "lead", "technician", "inspector", "controller", "head of"],
            missing:
              "Your threshold field does not name who may change it with a clear limit. Name the role and write the rule with only or never, for example 'Only the quality engineer may change the threshold'.",
          },
          {
            id: "quiet",
            label: "How it can fail quietly here",
            hint: "The likely causes at this station, such as the lamp, the lens, the camera position, a new material, or settings left changed.",
            min: 20,
            any: [
              "lamp",
              "light",
              "lens",
              "dust",
              "dirt",
              "mist",
              "condensation",
              "bracket",
              "position",
              "knock",
              "moved",
              "supplier",
              "material",
              "setting",
              "drift",
              "focus",
              "exposure",
              "clean",
            ],
            missing:
              "Your quiet failure field does not name a cause. Name at least one likely cause at this station, such as a lamp dimming, dust on the lens, or the camera being knocked.",
          },
          {
            id: "challenge",
            label: "The challenge test",
            hint: "The known-bad parts, when it runs including after changes, where it is recorded, and what happens to output if a part passes.",
            min: 40,
            any: ["hold", "held", "quarantine", "re-inspect", "reinspect", "segregate", "stop"],
            missing:
              "Your challenge test does not say what happens if a challenge part passes. Add that the system is stopped, output since the last successful challenge is held, and who is told.",
          },
          {
            id: "human",
            label: "The human check",
            hint: "Each check a person still makes, how often, and the role that owns it.",
            min: 30,
            any: ["inspector", "engineer", "operator", "leader", "lead", "manager", "supervisor", "technician", "owner", "controller"],
            missing:
              "Your human check does not name an owner. Give each check a frequency and the role that carries it out, such as the line inspector every two hours.",
          },
        ],
        why: "Your brief states what the camera judges and does not, controls the threshold with a named role, names the causes of quiet failure, proves the system can still see with a stop and a hold, and keeps a human check with an owner.",
      },
      bridge:
        "Your inspection brief is complete. Sign your name below, and the record will show the brief, the course, and the date to anyone who opens the reference.",
    },
  ],
};
